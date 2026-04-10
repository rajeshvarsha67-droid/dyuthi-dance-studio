"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addBatch, type ActionState } from "@/app/admin/batches/actions";
import { Loader2, Plus } from "lucide-react";

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
                    <Loader2 size={16} className="animate-spin" /> Creating...
                </>
            ) : (
                <>
                    <Plus size={16} /> Create Batch
                </>
            )}
        </button>
    );
}

const initialState: ActionState = { error: "", success: false };

export default function AddBatchForm() {
    const [state, formAction] = useActionState(addBatch, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Batch</h2>
            
            {state?.error && (
                <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                    {state.error}
                </div>
            )}
            
            {state?.success && (
                <div className="mb-6 p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl">
                    Successfully created new batch!
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
                <div>
                    <label htmlFor="branch" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Branch
                    </label>
                    <select
                        id="branch"
                        name="branch"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Select Branch</option>
                        <option value="Kaloor">Kaloor</option>
                        <option value="Kalamassery">Kalamassery</option>
                    </select>
                </div>

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
    );
}
