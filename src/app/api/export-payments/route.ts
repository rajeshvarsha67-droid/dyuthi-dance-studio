import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

        // ── Fetch all payments with relational joins ──
        const { data: payments, error } = await supabase
            .from("payments")
            .select(
                "*, registrations(name, email), batches(branch, dance_style)"
            )
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Export-payments – query failed:", error);
            return NextResponse.json(
                { error: "Failed to fetch payment data." },
                { status: 500 }
            );
        }

        // ── Build CSV ──
        const header = [
            "Date",
            "Transaction ID",
            "Student Name",
            "Student Email",
            "Branch",
            "Dance Style",
            "Amount (INR)",
            "Status",
        ];

        const rows = (payments ?? []).map((p: any) => {
            const date = p.created_at
                ? new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  })
                : "";
            const studentName = p.registrations?.name ?? "Deleted User";
            const studentEmail = p.registrations?.email ?? "";
            const branch =
                BRANCH_LABELS[p.batches?.branch] ?? p.batches?.branch ?? "";
            const danceStyle = p.batches?.dance_style ?? "";

            return [
                csvField(date),
                csvField(p.transaction_id),
                csvField(studentName),
                csvField(studentEmail),
                csvField(branch),
                csvField(danceStyle),
                csvField(p.amount != null ? p.amount : ""),
                csvField(p.status),
            ].join(",");
        });

        const csv = [header.map(csvField).join(","), ...rows].join("\r\n");

        // ── Return as downloadable file ──
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition":
                    'attachment; filename="dyuthi_financial_ledger.csv"',
            },
        });
    } catch (err) {
        console.error("Export-payments route error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
