"use client";

import { useState, useTransition } from "react";
import { updateBatchSchedule } from "@/app/admin/timings/actions";
import { Clock, Pencil, X, Loader2, Check, MapPin, CalendarDays } from "lucide-react";

// --- Types ---
interface Batch {
    id: string;
    branch: string;
    dance_style: string;
    days: string | null;
    timing: string | null;
}

interface TimingManagerProps {
    batches: Batch[];
}

// --- Branch Badge ---
function BranchBadge({ branch }: { branch: string }) {
    const lower = branch.toLowerCase();
    let style = "bg-gray-50 text-gray-700 ring-gray-600/20";
    if (lower.includes("kaloor")) style = "bg-blue-50 text-blue-700 ring-blue-600/20";
    else if (lower.includes("kalamassery")) style = "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    else if (lower.includes("bpcl")) style = "bg-purple-50 text-purple-700 ring-purple-600/20";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${style}`}>
            {branch}
        </span>
    );
}

// --- Main Component ---
export default function TimingManager({ batches }: TimingManagerProps) {
    // Modal state
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
    const [days, setDays] = useState("");
    const [timing, setTiming] = useState("");
    const [isPending, startTransition] = useTransition();
    const [saveResult, setSaveResult] = useState<{ error?: string; success?: boolean } | null>(null);

    const openEditor = (batch: Batch) => {
        setEditingBatch(batch);
        setDays(batch.days || "");
        setTiming(batch.timing || "");
        setSaveResult(null);
    };

    const closeEditor = () => {
        setEditingBatch(null);
        setSaveResult(null);
    };

    const handleSave = () => {
        if (!editingBatch) return;
        startTransition(async () => {
            const result = await updateBatchSchedule(editingBatch.id, days, timing);
            setSaveResult(result);
            if (result.success) {
                setTimeout(() => closeEditor(), 800);
            }
        });
    };

    // Group batches by branch
    const grouped = batches.reduce<Record<string, Batch[]>>((acc, batch) => {
        const key = batch.branch || "Uncategorized";
        if (!acc[key]) acc[key] = [];
        acc[key].push(batch);
        return acc;
    }, {});
    const branchNames = Object.keys(grouped).sort();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Class Timings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Set the days and timings for each batch. Changes appear instantly on the public website.
                </p>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

                {/* Table Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Batch Schedules
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {batches.length} Batches
                    </span>
                </div>

                {batches.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-gray-50/60 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dance Style</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timing</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {branchNames.map((branchName) =>
                                    grouped[branchName].map((batch, idx) => (
                                        <tr
                                            key={batch.id}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            {/* Branch — show on first row of group */}
                                            <td className="px-6 py-4">
                                                {idx === 0 ? (
                                                    <BranchBadge branch={batch.branch} />
                                                ) : (
                                                    <span className="text-xs text-gray-300">↳</span>
                                                )}
                                            </td>

                                            {/* Dance Style */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">{batch.dance_style}</p>
                                            </td>

                                            {/* Days */}
                                            <td className="px-6 py-4">
                                                {batch.days ? (
                                                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                                                        <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                                        {batch.days}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Not set</span>
                                                )}
                                            </td>

                                            {/* Timing */}
                                            <td className="px-6 py-4">
                                                {batch.timing ? (
                                                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                        {batch.timing}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Not set</span>
                                                )}
                                            </td>

                                            {/* Edit */}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openEditor(batch)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 px-4 m-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Clock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900">No batches to schedule</h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Create batches first on the Batch Manager page, then come here to set their schedules.
                        </p>
                    </div>
                )}
            </div>

            {/* ─── Edit Modal ─── */}
            {editingBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={closeEditor} />

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="font-semibold text-gray-900">Edit Schedule</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {editingBatch.dance_style} · {editingBatch.branch}
                                </p>
                            </div>
                            <button
                                onClick={closeEditor}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {saveResult?.error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                                    {saveResult.error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                    Days
                                </label>
                                <input
                                    type="text"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    placeholder="e.g., Tuesday & Thursday"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                    Timing
                                </label>
                                <input
                                    type="text"
                                    value={timing}
                                    onChange={(e) => setTiming(e.target.value)}
                                    placeholder="e.g., 5:00 PM – 6:30 PM"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={closeEditor}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending || saveResult?.success === true}
                                className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : saveResult?.success ? (
                                    <Check className="w-4 h-4" />
                                ) : null}
                                {saveResult?.success ? "Saved!" : "Save Schedule"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
