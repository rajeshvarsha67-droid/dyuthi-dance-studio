import { createSupabaseServerClient } from "@/lib/supabase-server";
import ReminderTable from "@/components/admin/ReminderTable";

export interface ReminderStudent {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    Location: string | null;
    preferred_batch: string | null;
    status: string;
}

export default async function RemindersPage() {
    const supabase = await createSupabaseServerClient();

    // ── IST date math ──────────────────────────────────────────
    // Use IST (UTC+5:30) so the 5th triggers at the right time in India
    const nowUTC = new Date();
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

    const year = nowIST.getUTCFullYear();
    const month = nowIST.getUTCMonth(); // 0-indexed
    const dayOfMonth = nowIST.getUTCDate();

    // First day of current month in IST → convert to ISO for Supabase filter
    const firstOfMonthIST = new Date(Date.UTC(year, month, 1) - IST_OFFSET_MS);
    const firstOfMonthISO = firstOfMonthIST.toISOString();

    const isPastDueDate = dayOfMonth > 5;

    // ── Query 1: all active students (filtered by status = 'ACTIVE') ──
    const { data: students, error: studentsError } = await supabase
        .from("registrations")
        .select("id, name, phone, email, Location, preferred_batch, status")
        .eq("status", "ACTIVE")
        .order("name", { ascending: true });

    if (studentsError) {
        console.error("[Reminders] Students fetch error:", studentsError.message);
    }

    // ── Query 2: this month's successful payments ──────────────
    const { data: paidThisMonth, error: paymentsError } = await supabase
        .from("payments")
        .select("student_id")
        .eq("status", "SUCCESS")
        .gte("created_at", firstOfMonthISO);

    if (paymentsError) {
        console.error("[Reminders] Payments fetch error:", paymentsError.message);
    }

    // ── Filter: keep only students who have NOT paid ───────────
    const paidStudentIds = new Set(
        (paidThisMonth || []).map((p: { student_id: string }) => p.student_id)
    );
    const allActive = (students as ReminderStudent[]) || [];
    const unpaidStudents = allActive.filter((s) => !paidStudentIds.has(s.id));

    // Human-readable billing period label (e.g. "March 2026")
    const billingMonth = nowIST.toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">
                        Fee Reminders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Students with unpaid fees for{" "}
                        <span className="font-semibold text-gray-700">
                            {billingMonth}
                        </span>
                        .{" "}
                        {isPastDueDate ? (
                            <span className="text-red-600 font-medium">
                                Payment was due on the 5th — overdue.
                            </span>
                        ) : (
                            <span className="text-amber-600 font-medium">
                                Due date: 5th of this month.
                            </span>
                        )}
                    </p>
                </div>

                {/* Quick stats pills */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Unpaid count */}
                    <div
                        className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ${
                            isPastDueDate
                                ? "border-red-200"
                                : "border-amber-200"
                        }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full animate-pulse ${
                                isPastDueDate
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                            }`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {unpaidStudents.length} unpaid
                        </span>
                    </div>

                    {/* Total active */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {allActive.length} total active
                        </span>
                    </div>

                    {/* Reachable */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <svg
                            className="w-4 h-4 text-[#25D366]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                            {unpaidStudents.filter((s) => s.phone).length}{" "}
                            reachable
                        </span>
                    </div>
                </div>
            </div>

            <ReminderTable
                students={unpaidStudents}
                isPastDueDate={isPastDueDate}
            />
        </div>
    );
}
