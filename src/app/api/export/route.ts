import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Branch key → human-readable label
const BRANCH_LABELS: Record<string, string> = {
    kaloor: "Kaloor",
    kalamassery: "Kalamassery",
    bpcl_township: "BPCL Township",
};

/**
 * Wraps a value in double-quotes and escapes any internal double-quotes.
 * Handles null / undefined gracefully (returns empty quoted string).
 */
function csvField(value: unknown): string {
    const str = value == null ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient();

        // ── Auth: verify the caller is a logged-in admin ──
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: adminUser } = await supabase
            .from("admin_users")
            .select("id")
            .ilike("email", user.email || "")
            .maybeSingle();

        if (!adminUser) {
            return NextResponse.json(
                { error: "Unauthorized – admin access required" },
                { status: 401 }
            );
        }

        // ── Fetch all registrations ──
        const { data: students, error: studentsError } = await supabase
            .from("registrations")
            .select(
                "id, name, email, phone, Location, preferred_batch, created_at, status"
            )
            .order("created_at", { ascending: false });

        if (studentsError) {
            console.error("Export – registrations query failed:", studentsError);
            return NextResponse.json(
                { error: "Failed to fetch student data." },
                { status: 500 }
            );
        }

        // ── Fetch all successful payments to compute totals ──
        const { data: payments } = await supabase
            .from("payments")
            .select("student_id, amount, status")
            .eq("status", "SUCCESS");

        // Build a map: student_id → total paid (only SUCCESS payments)
        const totalPaidMap = new Map<string, number>();
        if (payments) {
            for (const p of payments) {
                const current = totalPaidMap.get(p.student_id) ?? 0;
                totalPaidMap.set(p.student_id, current + (p.amount ?? 0));
            }
        }

        // ── Fetch latest payment status per student (regardless of status) ──
        const { data: allPayments } = await supabase
            .from("payments")
            .select("student_id, status, created_at")
            .order("created_at", { ascending: false });

        const latestStatusMap = new Map<string, string>();
        if (allPayments) {
            for (const p of allPayments) {
                // First occurrence per student_id is the latest (already DESC sorted)
                if (!latestStatusMap.has(p.student_id)) {
                    latestStatusMap.set(p.student_id, p.status ?? "");
                }
            }
        }

        // ── Build CSV ──
        const header = [
            "Student Name",
            "Email",
            "WhatsApp",
            "Branch",
            "Dance Style",
            "Registration Date",
            "Active",
            "Total Paid (₹)",
            "Latest Payment Status",
        ];

        const rows = (students ?? []).map((s) => {
            const branchLabel = BRANCH_LABELS[s.Location] ?? s.Location ?? "";
            const regDate = s.created_at
                ? new Date(s.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  })
                : "";
            const totalPaid = totalPaidMap.get(s.id);
            const latestStatus = latestStatusMap.get(s.id) ?? "";

            return [
                csvField(s.name),
                csvField(s.email),
                csvField(s.phone),
                csvField(branchLabel),
                csvField(s.preferred_batch),
                csvField(regDate),
                csvField((s.status || "ACTIVE") === "ACTIVE" ? "Yes" : "No"),
                csvField(totalPaid != null ? totalPaid : ""),
                csvField(latestStatus),
            ].join(",");
        });

        const csv = [header.map(csvField).join(","), ...rows].join("\r\n");

        // ── Return as downloadable file ──
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition":
                    'attachment; filename="dyuthi_students_export.csv"',
            },
        });
    } catch (err) {
        console.error("Export route error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
