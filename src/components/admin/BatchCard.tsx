"use client";

import { useState, useTransition } from "react";
import { Clock, Users, User, X, Loader2, Check } from "lucide-react";
import { getBatchStudents, saveAttendance } from "@/app/admin/batches/actions";

interface Batch {
    id: string;
    branch: string;
    dance_style: string;

}

export default function BatchCard({ batch }: { batch: Batch }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    
    // Checkbox state for attendance
    const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();
    const [didSave, setDidSave] = useState(false);

    const handleOpenAttendance = async () => {
        setIsModalOpen(true);
        setIsLoadingStudents(true);
        setDidSave(false);
        setPresentIds(new Set()); // reset

        try {
            const data = await getBatchStudents(batch.id);
            setStudents(data);
            // By default mark everyone present
            setPresentIds(new Set(data.map((s: any) => s.id)));
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const handleTogglePresent = (id: string) => {
        setPresentIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSaveAttendance = () => {
        startTransition(async () => {
            await saveAttendance(batch.id, Array.from(presentIds));
            setDidSave(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1000);
        });
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors shadow-sm flex flex-col h-full relative group">
                <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {batch.dance_style}
                    </h3>
                    <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                        batch.branch === "Kaloor" ? "bg-blue-50 text-blue-700 ring-blue-600/20" : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                    }`}>
                        {batch.branch}
                    </span>
                </div>

                <div className="space-y-3 mt-auto flex-1 flex flex-col justify-end">
                    <button
                        onClick={handleOpenAttendance}
                        className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-sm font-semibold bg-gray-50 hover:bg-gray-100 text-charcoal border border-gray-200 rounded-lg transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Take Attendance
                    </button>
                </div>
            </div>

            {/* Attendance Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="font-semibold text-gray-900">Take Attendance</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{batch.dance_style} · {batch.branch}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoadingStudents ? (
                                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                    <Loader2 className="w-8 h-8 animate-spin text-charcoal mb-2" />
                                    <p className="text-sm">Loading enrolled students...</p>
                                </div>
                            ) : students.length > 0 ? (
                                <div className="space-y-3">
                                    {students.map((student) => {
                                        const isPresent = presentIds.has(student.id);
                                        return (
                                            <div
                                                key={student.id}
                                                onClick={() => handleTogglePresent(student.id)}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                                    isPresent 
                                                        ? "border-charcoal/30 bg-gray-50/50 shadow-sm" 
                                                        : "border-gray-200 hover:border-gray-300 opacity-60"
                                                }`}
                                            >
                                                <span className={`font-medium text-sm ${isPresent ? "text-gray-900" : "text-gray-500"}`}>
                                                    {student.name}
                                                </span>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                                    isPresent ? "bg-charcoal border-charcoal text-white" : "border-gray-300 bg-white"
                                                }`}>
                                                    {isPresent && <Check className="w-3.5 h-3.5" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-900">No active students</p>
                                    <p className="text-xs text-gray-500 mt-1">There are no successful payments linked to this batch yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAttendance}
                                disabled={isPending || isLoadingStudents || students.length === 0 || didSave}
                                className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : didSave ? <Check className="w-4 h-4" /> : null}
                                {didSave ? "Saved!" : "Save Attendance"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
