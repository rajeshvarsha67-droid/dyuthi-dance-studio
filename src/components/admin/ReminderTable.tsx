"use client";

import { useState, useMemo } from "react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface ReminderStudent {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    Location: string | null;
    preferred_batch: string | null;
    status: string;
}

interface ReminderTableProps {
    students: ReminderStudent[];
    isPastDueDate: boolean;
}

// ──────────────────────────────────────────────
// Branch config
// ──────────────────────────────────────────────
const BRANCH_LABELS: Record<string, string> = {
    kaloor: "Kaloor",
    kalamassery: "Kalamassery",
    bpcl_township: "BPCL Township",
    Kaloor: "Kaloor",
    Kalamassery: "Kalamassery",
};

const BRANCH_STYLES: Record<string, string> = {
    kaloor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    kalamassery: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    bpcl_township: "bg-purple-50 text-purple-700 ring-purple-600/20",
    Kaloor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Kalamassery: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

// ──────────────────────────────────────────────
// WhatsApp helpers
// ──────────────────────────────────────────────

/** Strip spaces/dashes, prepend 91 if needed */
function formatPhoneForWhatsApp(raw: string): string {
    let cleaned = raw.replace(/[\s\-\(\)\+]/g, "");
    // Remove leading 0 (Indian local format)
    if (cleaned.startsWith("0")) {
        cleaned = cleaned.slice(1);
    }
    // Prepend Indian country code if not already present
    if (!cleaned.startsWith("91")) {
        cleaned = "91" + cleaned;
    }
    return cleaned;
}

/** Build a WhatsApp Click-to-Chat URL with a personalised reminder message. */
function generateWhatsAppLink(
    student: ReminderStudent,
    isPastDueDate: boolean
): string {
    const branch =
        BRANCH_LABELS[student.Location || ""] ||
        student.Location ||
        "your";
    const danceStyle = student.preferred_batch || "dance";

    const message = isPastDueDate
        ? `Hi ${student.name}, this is a reminder from Dyuthi Dance Studio that your monthly fee for the ${branch} ${danceStyle} batch was due on the 5th and is now overdue. Please log in to your student portal to complete the payment at your earliest convenience. Thank you!`
        : `Hi ${student.name}, this is a gentle reminder from Dyuthi Dance Studio that your monthly fee for the ${branch} ${danceStyle} batch is due soon (by the 5th). You can log in to your student portal to complete the payment. Thank you!`;

    const formattedNumber = formatPhoneForWhatsApp(student.phone || "");
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export default function ReminderTable({
    students,
    isPastDueDate,
}: ReminderTableProps) {
    const [search, setSearch] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");

    // — Filter logic ——————————————————————
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return students.filter((s) => {
            if (q) {
                const nameMatch = s.name?.toLowerCase().includes(q);
                const phoneMatch = s.phone?.includes(q);
                const emailMatch = s.email?.toLowerCase().includes(q);
                if (!nameMatch && !phoneMatch && !emailMatch) return false;
            }
            if (branchFilter !== "all") {
                const loc = (s.Location || "").toLowerCase();
                if (loc !== branchFilter) return false;
            }
            return true;
        });
    }, [students, search, branchFilter]);

    // Track which rows have been clicked (in-memory only)
    const [sentIds, setSentIds] = useState<Set<string>>(new Set());
    const markSent = (id: string) => {
        setSentIds((prev) => new Set(prev).add(id));
    };

    return (
        <div className="space-y-4">
            {/* ─── Controls Bar ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
                            id="reminder-search"
                            type="text"
                            placeholder="Search by name, phone or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all"
                        />
                    </div>

                    {/* Branch filter */}
                    <select
                        id="reminder-branch-filter"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all min-w-[150px] appearance-none cursor-pointer"
                    >
                        <option value="all">All Branches</option>
                        <option value="kaloor">Kaloor</option>
                        <option value="kalamassery">Kalamassery</option>
                        <option value="bpcl_township">BPCL Township</option>
                    </select>

                    {/* Send All visible */}
                    <button
                        onClick={() => {
                            filtered.forEach((s) => {
                                if (s.phone) {
                                    window.open(
                                        generateWhatsAppLink(s, isPastDueDate),
                                        "_blank"
                                    );
                                    markSent(s.id);
                                }
                            });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 transition-all whitespace-nowrap shadow-sm"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Send All Visible
                    </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing{" "}
                        <span className="font-medium text-gray-600">
                            {filtered.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-600">
                            {students.length}
                        </span>{" "}
                        unpaid students
                    </p>
                    {(search || branchFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setBranchFilter("all");
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Table ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Batch Details
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    WhatsApp Number
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? (
                                filtered.map((student) => {
                                    const hasPhone = !!student.phone;
                                    const wasSent = sentIds.has(student.id);

                                    // Branch info
                                    const branchKey =
                                        student.Location || "";
                                    const branchLabel =
                                        BRANCH_LABELS[branchKey] || branchKey;
                                    const branchStyle =
                                        BRANCH_STYLES[branchKey] ||
                                        BRANCH_STYLES[
                                            branchKey.toLowerCase()
                                        ] ||
                                        "bg-gray-50 text-gray-700 ring-gray-600/20";

                                    const danceStyle =
                                        student.preferred_batch;

                                    return (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            {/* Name + email */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {student.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                                                    {student.email || "—"}
                                                </p>
                                            </td>

                                            {/* Batch details */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {branchLabel && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${branchStyle}`}
                                                        >
                                                            {branchLabel}
                                                        </span>
                                                    )}
                                                    {danceStyle && (
                                                        <span className="text-sm text-gray-600">
                                                            {danceStyle}
                                                        </span>
                                                    )}
                                                    {!branchLabel &&
                                                        !danceStyle && (
                                                            <span className="text-sm text-gray-400">
                                                                —
                                                            </span>
                                                        )}
                                                </div>
                                            </td>

                                            {/* Status badge */}
                                            <td className="px-6 py-4 text-center">
                                                {isPastDueDate ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                        Overdue
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        Due Soon
                                                    </span>
                                                )}
                                            </td>

                                            {/* Phone */}
                                            <td className="px-6 py-4">
                                                {hasPhone ? (
                                                    <span className="text-sm text-gray-900 font-mono">
                                                        {student.phone}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-amber-500/20 font-medium">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                                            />
                                                        </svg>
                                                        No Number Provided
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-center">
                                                {hasPhone ? (
                                                    <a
                                                        href={generateWhatsAppLink(
                                                            student,
                                                            isPastDueDate
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() =>
                                                            markSent(student.id)
                                                        }
                                                        className={`
                                                            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                                            focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm
                                                            ${
                                                                wasSent
                                                                    ? "bg-gray-100 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-200 focus:ring-gray-400"
                                                                    : "bg-[#25D366] text-white hover:bg-[#1ebe57] hover:shadow-md focus:ring-[#25D366]/40"
                                                            }
                                                        `}
                                                    >
                                                        {wasSent ? (
                                                            <>
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
                                                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                                Sent
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                >
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                                </svg>
                                                                Send Reminder
                                                            </>
                                                        )}
                                                    </a>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed"
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
                                                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                                            />
                                                        </svg>
                                                        No Number
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <svg
                                                className="w-12 h-12 text-emerald-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">
                                                All students are paid up!
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                No pending fee reminders for
                                                this month.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
