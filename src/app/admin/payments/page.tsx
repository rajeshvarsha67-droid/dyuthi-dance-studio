import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";
import PaymentTable from "@/components/admin/PaymentTable";

// Type for the relational payment data
export interface PaymentRow {
    id: string;
    student_id: string;
    batch_id: string;
    amount: number;
    transaction_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    registrations: { name: string; email: string; phone: string } | null;
    batches: { branch: string; dance_style: string } | null;
}

export default async function PaymentsLedgerPage() {
    // We already authenticate the user via middleware / layout for admin routes,
    // but we use supabaseAdmin here to bypass RLS and ensure the relational
    // join to the "batches" table doesn't silently return null due to policies.
    const db = supabaseAdmin;

    // Fetch all payments with relational joins
    const { data: payments, error } = await db
        .from("payments")
        .select("*, registrations(name, email, phone), batches(branch, dance_style)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[PaymentsLedger] Fetch error:", error.message);
    }

    const allPayments: PaymentRow[] = (payments as PaymentRow[]) || [];

    // Calculate KPI metrics
    const totalRevenue = allPayments
        .filter((p) => p.status === "SUCCESS")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingCollections = allPayments
        .filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const failedCount = allPayments.filter((p) => p.status === "FAILED").length;

    // INR formatter
    const formatINR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

    const kpis = [
        {
            title: "Total Revenue",
            value: formatINR.format(totalRevenue),
            icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
        },
        {
            title: "Pending Collections",
            value: formatINR.format(pendingCollections),
            icon: <Clock className="w-5 h-5 text-amber-600" />,
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100",
        },
        {
            title: "Failed Transactions",
            value: failedCount,
            icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
            bgColor: "bg-red-50",
            borderColor: "border-red-100",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Payment Ledger
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Master record of all transactions — mock payments & future
                    gateway webhooks.
                </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.title}
                        className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    {kpi.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {kpi.value}
                                </p>
                            </div>
                            <div
                                className={`p-3 rounded-xl border ${kpi.bgColor} ${kpi.borderColor}`}
                            >
                                {kpi.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive Ledger Table */}
            <PaymentTable payments={allPayments} />
        </div>
    );
}
