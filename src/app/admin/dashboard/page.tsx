import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { AlertCircle, CheckCircle2, TrendingUp, Users, MapPin, Activity } from "lucide-react";

export default async function DashboardOverviewPage() {
    const supabase = await createSupabaseServerClient();

    // 1. Fetch Active Students Count
    const { count: totalStudents } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("status", "ACTIVE");

    // 2. Fetch Active Batches Count
    const { data: allBatches } = await supabase.from("batches").select("*");
    const activeBatches = allBatches?.length || 0;

    // 3. Fetch Total Revenue
    const { data: payments } = await supabase
        .from("payments")
        .select("amount, status");

    const successfulPayments = payments?.filter(p => p.status === "SUCCESS") || [];
    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // 4. Fetch 5 Recent Registrations
    const { data: recentStudents } = await supabase
        .from("registrations")
        .select("id, name, age, Location, preferred_batch, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    // 5. Fetch Failed Payments for Alerts
    const { data: rawFailedPayments } = await supabase
        .from("payments")
        .select("id, amount, student_id")
        .eq("status", "FAILED")
        .limit(5);

    // 6. Fetch 5 Recent Successful Payments
    const { data: rawRecentPayments } = await supabase
        .from("payments")
        .select("id, amount, student_id, created_at")
        .eq("status", "SUCCESS")
        .order("created_at", { ascending: false })
        .limit(5);

    // Memory join for student names on payments
    const allRelevantStudentIds = [
        ...(rawFailedPayments?.map(p => p.student_id) || []),
        ...(rawRecentPayments?.map(p => p.student_id) || [])
    ].filter(Boolean);

    let studentsLookup: Record<string, string> = {};
    if (allRelevantStudentIds.length > 0) {
        const { data: studentsForPayments } = await supabase
            .from("registrations")
            .select("id, name")
            .in("id", allRelevantStudentIds);
        
        studentsLookup = (studentsForPayments || []).reduce((acc, curr) => {
            acc[curr.id] = curr.name;
            return acc;
        }, {} as Record<string, string>);
    }

    const failedPayments = rawFailedPayments?.map(p => ({
        ...p,
        studentName: studentsLookup[p.student_id] || "Unknown Student"
    })) || [];

    const recentPayments = rawRecentPayments?.map(p => ({
        ...p,
        studentName: studentsLookup[p.student_id] || "Unknown Student"
    })) || [];

    // Formatters
    const formatINR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

    const metrics = [
        {
            title: "Active Students",
            value: totalStudents || 0,
            icon: <Users className="w-5 h-5 text-blue-600" />,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Active Batches",
            value: activeBatches || 0,
            icon: <MapPin className="w-5 h-5 text-emerald-600" />,
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            title: "Total Revenue",
            value: formatINR.format(totalRevenue),
            icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Dashboard Overview
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome back! Here's a summary of your studio's performance.
                </p>
            </div>

            {/* Quick Alerts Section */}
            {failedPayments.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Attention Needed</h2>
                    
                    {failedPayments.map(fp => (
                        <div key={fp.id} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Failed Payment: {formatINR.format(Number(fp.amount))}</p>
                                <p className="text-xs text-red-600 mt-0.5">Student: {fp.studentName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                    <div
                        key={metric.title}
                        className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    {metric.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {metric.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl border ${metric.bgColor} ${metric.borderColor}`}>
                                {metric.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
                        <Link
                            href="/admin/students"
                            className="text-sm font-medium text-charcoal hover:underline"
                        >
                            View All &rarr;
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentStudents && recentStudents.length > 0 ? (
                                    recentStudents.map((student) => {
                                        const dateStr = student.created_at 
                                            ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(student.created_at))
                                            : "N/A";
                                            
                                        const branch = student.Location === "bpcl_township" 
                                            ? "BPCL" 
                                            : student.Location?.charAt(0).toUpperCase() + student.Location?.slice(1) || "N/A";

                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-xs text-gray-500">{student.preferred_batch}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800">
                                                        {branch}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-sm text-gray-500">{dateStr}</div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No recent registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Payments Feed */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-6">
                            {recentPayments && recentPayments.length > 0 ? (
                                recentPayments.map((payment) => {
                                    const dateStr = payment.created_at 
                                        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" }).format(new Date(payment.created_at))
                                        : "N/A";

                                    return (
                                        <div key={payment.id} className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {payment.studentName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {dateStr}
                                                </p>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                + {formatINR.format(Number(payment.amount))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-sm text-gray-500">
                                    No successful payments yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
