"use client";

import { useState, useMemo } from "react";

interface BatchData {
    id: string;
    branch: string;
    dance_style: string;
}

interface StudentData {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    Location: string | null;
    preferred_batch: string | null;
}

interface BroadcastToolProps {
    batches: BatchData[];
    students: StudentData[];
}

const BRANCH_OPTIONS = [
    { value: "all", label: "All Branches" },
    { value: "kaloor", label: "Kaloor" },
    { value: "kalamassery", label: "Kalamassery" },
    { value: "bpcl_township", label: "BPCL Township" },
];

export default function BroadcastTool({ batches, students }: BroadcastToolProps) {
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedStyle, setSelectedStyle] = useState("all");
    const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

    // Derive unique batch styles based on selected branch
    const availableStyles = useMemo(() => {
        const filtered =
            selectedBranch === "all"
                ? batches
                : batches.filter(
                      (b) => b.branch.toLowerCase() === selectedBranch
                  );
        const styles = new Set<string>();
        filtered.forEach((b) => styles.add(b.dance_style));
        return Array.from(styles).sort();
    }, [batches, selectedBranch]);

    // Reset style when branch changes and current style is no longer available
    const effectiveStyle = availableStyles.includes(selectedStyle)
        ? selectedStyle
        : "all";

    // Filter students
    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            if (selectedBranch !== "all" && s.Location !== selectedBranch)
                return false;
            if (effectiveStyle !== "all" && s.preferred_batch !== effectiveStyle)
                return false;
            return true;
        });
    }, [students, selectedBranch, effectiveStyle]);

    // Generate comma-separated lists
    const phoneList = useMemo(() => {
        return filteredStudents
            .map((s) => s.phone)
            .filter((p): p is string => !!p && p.trim() !== "")
            .join(", ");
    }, [filteredStudents]);

    const emailList = useMemo(() => {
        return filteredStudents
            .map((s) => s.email)
            .filter((e): e is string => !!e && e.trim() !== "")
            .join(", ");
    }, [filteredStudents]);

    const phoneCount = phoneList ? phoneList.split(", ").length : 0;
    const emailCount = emailList ? emailList.split(", ").length : 0;

    const handleCopy = async (text: string, field: "phone" | "email") => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // Fallback — select text in a temporary textarea
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Filters ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                        />
                    </svg>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Filter Students
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Branch */}
                    <select
                        id="branch-filter"
                        value={selectedBranch}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value);
                            setSelectedStyle("all");
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all appearance-none cursor-pointer"
                    >
                        {BRANCH_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Style / Batch */}
                    <select
                        id="style-filter"
                        value={effectiveStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-charcoal/15 focus:border-charcoal transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">All Styles / Batches</option>
                        {availableStyles.map((style) => (
                            <option key={style} value={style}>
                                {style}
                            </option>
                        ))}
                    </select>

                    {/* Clear filters */}
                    {(selectedBranch !== "all" || effectiveStyle !== "all") && (
                        <button
                            onClick={() => {
                                setSelectedBranch("all");
                                setSelectedStyle("all");
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-all whitespace-nowrap"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* ── Student Count ───────────────────────────────── */}
            <div className="flex items-center gap-3 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-charcoal animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                        <span className="text-lg font-bold text-charcoal">
                            {filteredStudents.length}
                        </span>{" "}
                        {filteredStudents.length === 1 ? "Student" : "Students"}{" "}
                        Found
                    </span>
                </div>
                {selectedBranch !== "all" && (
                    <span className="text-xs text-gray-400">
                        in{" "}
                        {BRANCH_OPTIONS.find((o) => o.value === selectedBranch)
                            ?.label ?? selectedBranch}
                        {effectiveStyle !== "all" ? ` · ${effectiveStyle}` : ""}
                    </span>
                )}
            </div>

            {/* ── Output Boxes ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WhatsApp Numbers */}
                <OutputBox
                    id="whatsapp-output"
                    title="WhatsApp Numbers"
                    subtitle={`${phoneCount} number${phoneCount !== 1 ? "s" : ""}`}
                    content={phoneList}
                    emptyMessage="No phone numbers available for this filter."
                    copied={copiedField === "phone"}
                    onCopy={() => handleCopy(phoneList, "phone")}
                    icon={
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                        </svg>
                    }
                />

                {/* Email Addresses */}
                <OutputBox
                    id="email-output"
                    title="Email Addresses"
                    subtitle={`${emailCount} email${emailCount !== 1 ? "s" : ""}`}
                    content={emailList}
                    emptyMessage="No email addresses available for this filter."
                    copied={copiedField === "email"}
                    onCopy={() => handleCopy(emailList, "email")}
                    icon={
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* OutputBox — a reusable read-only output with copy button      */
/* ────────────────────────────────────────────────────────────── */

function OutputBox({
    id,
    title,
    subtitle,
    content,
    emptyMessage,
    copied,
    onCopy,
    icon,
}: {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    emptyMessage: string;
    copied: boolean;
    onCopy: () => void;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center text-charcoal">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="text-[11px] text-gray-400">{subtitle}</p>
                    </div>
                </div>

                <button
                    id={`${id}-copy-btn`}
                    onClick={onCopy}
                    disabled={!content}
                    className={`
                        inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200
                        ${
                            copied
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : content
                                  ? "bg-charcoal text-white hover:bg-charcoal/90 shadow-sm"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }
                    `}
                >
                    {copied ? (
                        <>
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                {content ? (
                    <div
                        id={id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-700 max-h-48 overflow-y-auto break-all select-all"
                    >
                        {content}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-400">
                            {emptyMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
