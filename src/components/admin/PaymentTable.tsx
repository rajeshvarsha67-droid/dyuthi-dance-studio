"use client";

import { useState, useMemo } from "react";
import type { PaymentRow } from "@/app/admin/payments/page";

const STATUS_OPTIONS = ["All", "SUCCESS", "PENDING", "FAILED"] as const;

const statusBadge: Record<string, { bg: string; text: string; dot: string }> = {
    SUCCESS: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    FAILED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function truncate(str: string, max: number): string {
    return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function PaymentTable({ payments }: { payments: PaymentRow[] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filtered = useMemo(() => {
        return payments.filter((p) => {
            // Status filter
            if (statusFilter !== "All" && p.status !== statusFilter) return false;

            // Search filter
            if (search.trim()) {
                const q = search.toLowerCase();
                const studentName = p.registrations?.name?.toLowerCase() || "";
                const txnId = p.transaction_id?.toLowerCase() || "";
                if (!studentName.includes(q) && !txnId.includes(q)) return false;
            }

            return true;
        });
    }, [payments, search, statusFilter]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Controls Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    All Transactions
                    <span className="ml-2 text-sm font-normal text-gray-400">
                        ({filtered.length})
                    </span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search name or txn ID…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition-all duration-200"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition-all duration-200 appearance-none cursor-pointer"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s === "All" ? "All Statuses" : s.charAt(0) + s.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>

                    {/* Export Ledger */}
                    <button
                        onClick={() => window.open("/api/export-payments", "_blank")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-emerald-500 text-emerald-600 bg-emerald-50 rounded-xl text-sm font-semibold hover:bg-emerald-100 hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all whitespace-nowrap"
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
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                        </svg>
                        Export Ledger
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Batch
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length > 0 ? (
                            filtered.map((p) => {
                                const badge = statusBadge[p.status] || statusBadge.PENDING;
                                return (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Date & Time */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatDateTime(p.created_at)}
                                            </div>
                                        </td>

                                        {/* Transaction ID */}
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                                                {truncate(p.transaction_id || "—", 16)}
                                            </code>
                                        </td>

                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {p.registrations 
                                                    ? (Array.isArray(p.registrations) ? p.registrations[0]?.name : p.registrations.name) 
                                                    : 'Unknown Student'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {p.registrations 
                                                    ? (Array.isArray(p.registrations) ? p.registrations[0]?.email : p.registrations.email) 
                                                    : "—"}
                                            </div>
                                        </td>

                                        {/* Batch */}
                                        <td className="px-6 py-4">
                                            {p.batches ? (
                                                <div className="text-sm text-gray-900">
                                                    {Array.isArray(p.batches)
                                                        ? `${p.batches[0]?.branch} - ${p.batches[0]?.dance_style}`
                                                        : `${p.batches.branch} - ${p.batches.dance_style}`}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">
                                                    Unassigned Batch
                                                </span>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatINR(Number(p.amount))}
                                            </span>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                                                />
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <svg
                                            className="w-10 h-10 text-gray-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                            No payments found matching your filters.
                                        </p>
                                        {(search || statusFilter !== "All") && (
                                            <button
                                                onClick={() => {
                                                    setSearch("");
                                                    setStatusFilter("All");
                                                }}
                                                className="text-xs text-charcoal font-medium hover:underline mt-1"
                                            >
                                                Clear all filters
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
