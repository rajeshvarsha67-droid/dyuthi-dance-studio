"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { addBatch, deleteBatch, type ActionState } from "@/app/admin/batches/actions";
import { Loader2, Plus, Trash2, MapPin } from "lucide-react";

// --- Types ---
interface Batch {
    id: string;
    branch: string;
    dance_style: string;
}

interface BatchManagerProps {
    batches: Batch[];
}

// --- Submit Button ---
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-charcoal text-white rounded-xl hover:bg-charcoal/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 size={16} className="animate-spin" /> Adding…
                </>
            ) : (
                <>
                    <Plus size={16} /> Add Batch
                </>
            )}
        </button>
    );
}

// --- Delete Button ---
function DeleteButton({ batchId, onDelete }: { batchId: string; onDelete: (id: string) => void }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(() => {
                    onDelete(batchId);
                });
            }}
            disabled={isPending}
            title="Delete batch"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
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
const initialState: ActionState = { error: "", success: false };

export default function BatchManager({ batches }: BatchManagerProps) {
    const [state, formAction] = useActionState(addBatch, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    // Group batches by branch
    const grouped = batches.reduce<Record<string, Batch[]>>((acc, batch) => {
        const key = batch.branch || "Uncategorized";
        if (!acc[key]) acc[key] = [];
        acc[key].push(batch);
        return acc;
    }, {});

    const branchNames = Object.keys(grouped).sort();

    const handleDelete = async (id: string) => {
        setDeleteError(null);
        const result = await deleteBatch(id);
        if (result.error) {
            setDeleteError(result.error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Batch Manager
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Add, view and remove studio branches and their dance styles.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* ─── Left: Add New Batch Form ─── */}
                <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Batch</h2>

                        {state?.error && (
                            <div className="mb-5 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                                {state.error}
                            </div>
                        )}

                        {state?.success && (
                            <div className="mb-5 p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl">
                                Batch added successfully!
                            </div>
                        )}

                        <form ref={formRef} action={formAction} className="space-y-4">
                            {/* Branch Name */}
                            <div>
                                <label htmlFor="branch" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    required
                                    placeholder="e.g., Kaloor"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                                />
                            </div>

                            {/* Dance Style */}
                            <div>
                                <label htmlFor="dance_style" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                    Dance Style
                                </label>
                                <input
                                    type="text"
                                    id="dance_style"
                                    name="dance_style"
                                    required
                                    placeholder="e.g., Zumba, Classical, Western"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                                />
                            </div>

                            <SubmitButton />
                        </form>
                    </div>
                </div>

                {/* ─── Right: Existing Batches Table ─── */}
                <div className="w-full lg:w-2/3 flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

                        {/* Table Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Manage Existing Batches</h2>
                            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {batches.length} Total
                            </span>
                        </div>

                        {/* Delete Error */}
                        {deleteError && (
                            <div className="mx-6 mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                                {deleteError}
                            </div>
                        )}

                        {batches.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {branchNames.map((branchName) => (
                                    <div key={branchName}>
                                        {/* Branch Group Header */}
                                        <div className="px-6 py-3 bg-gray-50/60 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {branchName}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                — {grouped[branchName].length} {grouped[branchName].length === 1 ? "style" : "styles"}
                                            </span>
                                        </div>

                                        {/* Batch Rows */}
                                        {grouped[branchName].map((batch) => (
                                            <div
                                                key={batch.id}
                                                className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center shrink-0">
                                                        <span className="text-xs font-bold text-charcoal/60">
                                                            {batch.dance_style.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {batch.dance_style}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5 lg:hidden">
                                                            {batch.branch}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <BranchBadge branch={batch.branch} />
                                                    <DeleteButton
                                                        batchId={batch.id}
                                                        onDelete={handleDelete}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 m-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                <h3 className="text-sm font-medium text-gray-900">No batches yet</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Get started by adding a new batch using the form on the left.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
