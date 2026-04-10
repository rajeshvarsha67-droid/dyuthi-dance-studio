import { Clock, MapPin } from "lucide-react";

interface BatchRow {
    id: string;
    branch: string;
    dance_style: string;
    days: string | null;
    timing: string | null;
}

interface ClassTimingsSectionProps {
    batches?: BatchRow[];
}

// Location labels per branch name (customize as needed)
const BRANCH_LOCATIONS: Record<string, string> = {
    "kaloor branch": "Kaloor, Kochi",
    "kalamassery branch": "Kalamassery, Kochi",
    "bpcl township": "BPCL Township, Kochi",
};

function getLocation(branch: string): string {
    return BRANCH_LOCATIONS[branch.toLowerCase()] || "Kochi, Kerala";
}

export default function ClassTimingsSection({ batches = [] }: ClassTimingsSectionProps) {
    // Group batches by branch, only include ones that have at least days or timing set
    const grouped: Record<string, BatchRow[]> = {};

    for (const batch of batches) {
        const key = batch.branch;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(batch);
    }

    const branchNames = Object.keys(grouped).sort();

    // If there are no batches at all, show a fallback
    if (branchNames.length === 0) {
        return (
            <section id="schedule" className="bg-[#F9F8F6] py-24 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                            Schedule
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1A1A1A]">
                            Class Timings
                        </h2>
                    </div>
                    <p className="text-center text-gray-500 text-sm">
                        Class schedules will be announced soon. Please check back later.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="schedule" className="bg-[#F9F8F6] py-24 lg:py-32">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Schedule
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1A1A1A]">
                        Class Timings
                    </h2>
                </div>

                <div className="flex flex-col gap-16">
                    {branchNames.map((branchName) => {
                        const classes = grouped[branchName];
                        return (
                            <div key={branchName}>
                                {/* Branch Header */}
                                <div className="flex items-center gap-2 mb-8">
                                    <MapPin size={16} className="text-gray-400" />
                                    <div>
                                        <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                                            {branchName}
                                        </h3>
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-sans">
                                            {getLocation(branchName)}
                                        </p>
                                    </div>
                                </div>

                                {/* Schedule Grid */}
                                <div className="w-full overflow-x-auto">
                                    <div className="min-w-[500px]">
                                        {/* Header Row */}
                                        <div className="grid grid-cols-3 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 font-sans border-b border-gray-200 pb-4">
                                            <span>Class</span>
                                            <span>Days</span>
                                            <span className="text-right">Time</span>
                                        </div>

                                        {/* Data Rows */}
                                        {classes.map((cls) => (
                                            <div
                                                key={cls.id}
                                                className="grid grid-cols-3 border-b border-gray-100 py-5"
                                            >
                                                <span className="text-sm font-medium text-[#1A1A1A] font-sans">
                                                    {cls.dance_style}
                                                </span>
                                                <span className="text-sm text-gray-500 font-sans">
                                                    {cls.days || "TBA"}
                                                </span>
                                                <span className="text-sm text-gray-500 text-right flex items-center justify-end gap-1.5 font-sans">
                                                    <Clock size={14} className="text-gray-300" />
                                                    {cls.timing || "TBA"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
