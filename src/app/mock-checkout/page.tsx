import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import Link from "next/link";

// ── Inline Server Action ────────────────────────────────────
async function processPayment(formData: FormData) {
    "use server";

    // Use session-based client for auth only
    const supabase = await createSupabaseServerClient();
    // Use admin client (bypasses RLS) for database operations
    const db = supabaseAdmin;

    // 1. Get the current logged-in user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("[processPayment] Auth error:", authError?.message);
        redirect("/admin/login");
    }

    console.log("1. AUTH USER EMAIL:", user.email);

    // 2. Find the student's most recent active registration (using admin client to bypass RLS)
    const { data: students, error: studentError } = await db
        .from("registrations")
        .select("id, Location, preferred_batch, status")
        .ilike("email", user.email || "")
        .order("created_at", { ascending: false })
        .limit(5);

    console.log("2. DB LOOKUP RESULT:", { data: students, error: studentError });

    const student = students?.find(s => s.status === "ACTIVE") || students?.[0];

    if (studentError || !student) {
        console.error(
            "[processPayment] Student lookup failed:",
            studentError?.message ?? "No registration found for " + user.email
        );
        throw new Error("No registration found for email: " + user.email);
    }

    if (!student.Location || !student.preferred_batch) {
        throw new Error("Student registration is missing Location or preferred_batch.");
    }

    const branch = student.Location;
    const danceStyle = student.preferred_batch;

    console.log("3. BATCH LOOKUP:", { branch, danceStyle });

    // 3. Look up the specific batch (using admin client to bypass RLS).
    //    Old registrations may store "kaloor" while batches has "Kaloor branch",
    //    so we try exact ilike first, then wildcard partial match, then JS fallback.
    let batch: { id: string } | null = null;

    // Attempt 1: Exact case-insensitive match
    const { data: exactMatch, error: exactErr } = await db
        .from("batches")
        .select("id")
        .ilike("branch", branch)
        .ilike("dance_style", danceStyle)
        .maybeSingle();

    console.log("3a. Exact match:", { exactMatch, exactErr });

    if (exactMatch) {
        batch = exactMatch;
    } else {
        // Attempt 2: Wildcard partial match (e.g., "kaloor" matches "Kaloor branch")
        const { data: partialMatch, error: partialErr } = await db
            .from("batches")
            .select("id")
            .ilike("branch", `%${branch}%`)
            .ilike("dance_style", `%${danceStyle}%`)
            .limit(1)
            .maybeSingle();

        console.log("3b. Partial match:", { partialMatch, partialErr });

        if (partialMatch) {
            batch = partialMatch;
        } else {
            // Attempt 3: JS-level fuzzy match as last resort
            const { data: allBatches } = await db
                .from("batches")
                .select("id, branch, dance_style");

            console.log("3c. All batches for fuzzy:", allBatches);

            const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
            const fuzzy = allBatches?.find((b) =>
                normalize(b.branch).includes(normalize(branch)) &&
                normalize(b.dance_style).includes(normalize(danceStyle))
            );
            if (fuzzy) batch = { id: fuzzy.id };
        }
    }

    if (!batch) {
        throw new Error(`The batch this student registered for (${branch} - ${danceStyle}) does not exist in the system.`);
    }

    console.log("4. MATCHED BATCH:", batch.id);

    // 4. Insert into the payments table (using admin client to bypass RLS)
    const status = formData.get("status") as string;
    const { error: insertError } = await db.from("payments").insert({
        student_id: student.id,
        batch_id: batch.id,
        amount: 1500,
        transaction_id: "MOCK_" + Date.now(),
        status: status || "PENDING",
    });

    if (insertError) {
        console.log("3. INSERT ERROR:", insertError);
        redirect("/mock-checkout?error=insert_failed");
    }

    // 5. Success → redirect back to payment portal
    redirect("/student/pay");
}

// ── Page Component (Server Component) ───────────────────────
export default async function MockCheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;
    const supabase = await createSupabaseServerClient();

    // Get current user for the welcome banner
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    const { data: student } = await supabase
        .from("registrations")
        .select("name")
        .eq("email", user.email)
        .maybeSingle();

    const studentName = student?.name || user.email?.split("@")[0] || "Student";

    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
        student_not_found:
            "No registration found for your account. Please register for a class first.",
        no_batches:
            "No batches exist in the database. An admin must create at least one batch.",
        insert_failed:
            "Failed to insert the payment record. Check the server console for details.",
    };
    const errorMessage = params.error ? errorMessages[params.error] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-charcoal/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-charcoal/3 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                {/* Branding Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-xl mb-4 shadow-lg">
                        <svg
                            className="w-7 h-7 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.42 15.17l-5.19-5.19m0 0L12 4.22m-5.77 5.76h15.54"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal font-serif tracking-tight">
                        Test Environment
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Simulate Payment · Dyuthi Dance Studio
                    </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <svg
                            className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                        <p className="text-sm leading-relaxed">{errorMessage}</p>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                    {/* Welcome Banner */}
                    <div className="bg-charcoal px-6 py-5 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
                            Testing as
                        </p>
                        <h2 className="text-xl font-bold font-serif">
                            {studentName}
                        </h2>
                        <p className="text-xs text-white/50 mt-1">{user.email}</p>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Info */}
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                                ⚠ Test Mode
                            </p>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                These buttons will insert a real row into the{" "}
                                <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
                                    payments
                                </code>{" "}
                                table with amount ₹1,500 and a mock transaction ID.
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                Simulated Amount
                            </p>
                            <p className="text-4xl font-bold text-charcoal font-serif">
                                ₹1,500
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Monthly Batch Fee
                            </p>
                        </div>

                        {/* Success Form */}
                        <form action={processPayment}>
                            <input
                                type="hidden"
                                name="status"
                                value="SUCCESS"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-emerald-600/20 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Simulate Successful Payment
                            </button>
                        </form>

                        {/* Failure Form */}
                        <form action={processPayment}>
                            <input
                                type="hidden"
                                name="status"
                                value="FAILED"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-red-600/20 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Simulate Failed Payment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Back link */}
                <div className="text-center">
                    <Link
                        href="/student/pay"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                        Back to Payment Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
