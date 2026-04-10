"use client";

import { useState, useMemo, useTransition } from "react";
import { archiveStudent, restoreStudent, fetchStudentProfileData } from "@/app/admin/students/actions";
import { Loader2, X, CheckCircle2, AlertCircle, Archive, RotateCcw } from "lucide-react";

interface Student {
    id: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    Location: string;
    preferred_batch: string;
    created_at: string;
    status: string;
}

interface StudentTableProps {
    students: Student[];
}

const BRANCH_LABELS: Record<string, string> = {
    kaloor: "Kaloor",
    kalamassery: "Kalamassery",
    bpcl_township: "BPCL Township",
};

const BRANCH_STYLES: Record<string, string> = {
    kaloor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    kalamassery: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    bpcl_township: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

function formatDate(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

const formatINR = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export default function StudentTable({ students }: StudentTableProps) {
    const [search, setSearch] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");
    const [styleFilter, setStyleFilter] = useState("all");
    const [statusTab, setStatusTab] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
    const [isPending, startTransition] = useTransition();

    // Confirmation modal state
    const [confirmAction, setConfirmAction] = useState<{
        student: Student;
        action: "archive" | "restore";
    } | null>(null);

    // Profile Modal State
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [profileData, setProfileData] = useState<{ payments: any[], batches: any[] } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    // Counts for tabs
    const activeCount = useMemo(() => students.filter(s => (s.status || "ACTIVE") === "ACTIVE").length, [students]);
    const archivedCount = useMemo(() => students.filter(s => s.status === "INACTIVE").length, [students]);

    // Derive unique dance styles from data
    const uniqueStyles = useMemo(() => {
        const styles = new Set<string>();
        students.forEach((s) => {
            if (s.preferred_batch) styles.add(s.preferred_batch);
        });
        return Array.from(styles).sort();
    }, [students]);

    // Filter logic
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return students.filter((s) => {
            // Status tab filter
            const studentStatus = s.status || "ACTIVE";
            if (studentStatus !== statusTab) return false;

            if (q) {
                const matchesName = s.name?.toLowerCase().includes(q);
                const matchesPhone = s.phone?.includes(q);
                if (!matchesName && !matchesPhone) return false;
            }
            if (branchFilter !== "all" && s.Location !== branchFilter) return false;
            if (styleFilter !== "all" && s.preferred_batch !== styleFilter) return false;
            return true;
        });
    }, [students, search, branchFilter, styleFilter, statusTab]);

    // Handlers
    const handleArchive = (student: Student) => {
        setConfirmAction({ student, action: "archive" });
    };

    const handleRestore = (student: Student) => {
        setConfirmAction({ student, action: "restore" });
    };

    const handleConfirmAction = () => {
        if (!confirmAction) return;
        const { student, action } = confirmAction;
        startTransition(async () => {
            let res;
            if (action === "archive") {
                res = await archiveStudent(student.id);
            } else {
                res = await restoreStudent(student.id);
            }
            if (!res.success) {
                alert(`Error: ${res.error}`);
            }
            setConfirmAction(null);
        });
    };

    const handleViewProfile = async (student: Student) => {
        setSelectedStudent(student);
        setIsLoadingProfile(true);
        setProfileData(null);
        try {
            const data = await fetchStudentProfileData(student.id);
            setProfileData(data);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    return (
        <div className="space-y-4 relative">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setStatusTab("ACTIVE")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusTab === "ACTIVE"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${statusTab === "ACTIVE" ? "bg-emerald-500" : "bg-gray-300"}`} />
                    Active
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                        statusTab === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-200 text-gray-500"
                    }`}>
                        {activeCount}
                    </span>
                </button>
                <button
                    onClick={() => setStatusTab("INACTIVE")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusTab === "INACTIVE"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${statusTab === "INACTIVE" ? "bg-gray-500" : "bg-gray-300"}`} />
                    Archived
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                        statusTab === "INACTIVE"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-gray-200 text-gray-500"
                    }`}>
                        {archivedCount}
                    </span>
                </button>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or WhatsApp…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                        />
                    </div>

                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all min-w-[150px] appearance-none cursor-pointer"
                    >
                        <option value="all">All Branches</option>
                        <option value="kaloor">Kaloor</option>
                        <option value="kalamassery">Kalamassery</option>
                        <option value="bpcl_township">BPCL Township</option>
                    </select>

                    <select
                        value={styleFilter}
                        onChange={(e) => setStyleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all min-w-[180px] appearance-none cursor-pointer"
                    >
                        <option value="all">All Styles</option>
                        {uniqueStyles.map((style) => (
                            <option key={style} value={style}>
                                {style}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => window.open("/api/export", "_blank")}
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
                        Export CSV
                    </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{" "}
                        <span className="font-medium text-gray-600">{statusTab === "ACTIVE" ? activeCount : archivedCount}</span>{" "}
                        {statusTab === "ACTIVE" ? "active" : "archived"} students
                    </p>
                    {(search || branchFilter !== "all" || styleFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setBranchFilter("all");
                                setStyleFilter("all");
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Style</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Registered</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? (
                                filtered.map((student) => {
                                    const branchKey = student.Location || "";
                                    const branchLabel = BRANCH_LABELS[branchKey] || branchKey;
                                    const branchStyle = BRANCH_STYLES[branchKey] || "bg-gray-50 text-gray-700 ring-gray-600/20";
                                    const isActive = (student.status || "ACTIVE") === "ACTIVE";

                                    return (
                                        <tr
                                            key={student.id}
                                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${!isActive ? "opacity-70" : ""}`}
                                        >
                                            <td className="px-6 py-4" onClick={() => handleViewProfile(student)}>
                                                <p className="text-sm font-medium text-gray-900 group-hover:text-charcoal transition-colors">
                                                    {student.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleViewProfile(student)}>
                                                <p className="text-sm text-gray-600">{student.age}</p>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleViewProfile(student)}>
                                                <p className="text-sm text-gray-900">{student.phone || "—"}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{student.email || "—"}</p>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleViewProfile(student)}>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${branchStyle}`}>
                                                    {branchLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleViewProfile(student)}>
                                                <p className="text-sm text-gray-600 max-w-[180px] truncate" title={student.preferred_batch}>
                                                    {student.preferred_batch || "—"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                    isActive
                                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                        : "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-300/50"
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                                                    {isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={() => handleViewProfile(student)}>
                                                <p className="text-sm text-gray-500">
                                                    {student.created_at ? formatDate(student.created_at) : "—"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isActive ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleArchive(student); }}
                                                        disabled={isPending}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all disabled:opacity-50"
                                                        title="Archive Student"
                                                    >
                                                        <Archive className="w-3.5 h-3.5" />
                                                        Archive
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRestore(student); }}
                                                        disabled={isPending}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50"
                                                        title="Restore Student"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Restore
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            {statusTab === "INACTIVE" ? (
                                                <>
                                                    <Archive className="w-8 h-8 text-gray-300" />
                                                    <p className="text-sm font-medium text-gray-500">No archived students</p>
                                                    <p className="text-xs text-gray-400">Archived students will appear here for historical reference.</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-500">No students found matching your criteria</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Confirmation Modal ── */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="confirm-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isPending && setConfirmAction(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${
                                confirmAction.action === "archive"
                                    ? "bg-amber-50 border border-amber-100"
                                    : "bg-blue-50 border border-blue-100"
                            }`}>
                                {confirmAction.action === "archive" ? (
                                    <Archive className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <RotateCcw className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 id="confirm-title" className="text-lg font-semibold text-gray-900">
                                    {confirmAction.action === "archive" ? "Archive Student" : "Restore Student"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {confirmAction.action === "archive"
                                        ? <>Are you sure you want to archive <span className="font-semibold text-gray-700">{confirmAction.student.name}</span>? They will be removed from active rosters, fee reminders, and broadcast lists.</>
                                        : <>Restore <span className="font-semibold text-gray-700">{confirmAction.student.name}</span> to active status? They will appear in operational pages again.</>
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setConfirmAction(null)}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={isPending}
                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                                    confirmAction.action === "archive"
                                        ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/30"
                                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30"
                                }`}
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {confirmAction.action === "archive" ? "Yes, Archive" : "Yes, Restore"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-over Profile Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedStudent(null)} />
                    
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <div className="pointer-events-auto w-screen max-w-md transform transition-transform ease-in-out duration-500">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                                {/* Header */}
                                <div className="bg-gray-50 px-4 py-6 sm:px-6 flex items-center justify-between border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 tracking-tight" id="slide-over-title">
                                            Student Profile
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Detailed history and active classes.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 shadow-sm border border-gray-200"
                                        onClick={() => setSelectedStudent(null)}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <X className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-8">
                                    {/* Personal Info */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                (selectedStudent.status || "ACTIVE") === "ACTIVE"
                                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                    : "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-300/50"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${(selectedStudent.status || "ACTIVE") === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                                                {(selectedStudent.status || "ACTIVE") === "ACTIVE" ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Age</p>
                                                <p className="font-medium text-gray-900">{selectedStudent.age}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Location</p>
                                                <p className="font-medium text-gray-900">{BRANCH_LABELS[selectedStudent.Location] || selectedStudent.Location}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-900">{selectedStudent.phone || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900 truncate">{selectedStudent.email || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Loading */}
                                    {isLoadingProfile ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-charcoal/30" />
                                        </div>
                                    ) : profileData ? (
                                        <>
                                            {/* Batches */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-100 pb-2">Active Batches</h4>
                                                {profileData.batches.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {profileData.batches.map(b => (
                                                            <div key={b.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                                <p className="text-sm font-medium text-gray-900">{b.dance_style}</p>

                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No active batches joined.</p>
                                                )}
                                            </div>

                                            {/* Payment History */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-100 pb-2">Payment History</h4>
                                                {profileData.payments.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {profileData.payments.map((p) => (
                                                            <div key={p.id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-3">
                                                                    {p.status === "SUCCESS" ? (
                                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                    ) : p.status === "FAILED" ? (
                                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                                    ) : (
                                                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                                    )}
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{formatINR.format(p.amount)}</p>
                                                                        <p className="text-xs text-gray-500">{formatDate(p.created_at)}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-mono text-gray-400">
                                                                    {p.transaction_id || "Manual"}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No payment history found.</p>
                                                )}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
