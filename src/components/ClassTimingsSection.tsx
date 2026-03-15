import { Clock, MapPin } from "lucide-react";

interface BranchSchedule {
    branch: string;
    location: string;
    classes: { name: string; days: string; time: string }[];
}

const schedules: BranchSchedule[] = [
    {
        branch: "Kaloor Branch",
        location: "Kaloor, Kochi",
        classes: [
            { name: "Zumba", days: "Mon – Fri", time: "7:00 – 8:00 PM" },
            { name: "Western", days: "Sat – Sun", time: "4:00 – 5:30 PM" },
            { name: "Bharatanatyam", days: "Sat – Sun", time: "3:00 – 4:00 PM" },
        ],
    },
    {
        branch: "Kalamassery Branch",
        location: "Kalamassery, Kochi",
        classes: [
            { name: "Zumba", days: "Tue – Thu", time: "6:00 – 7:00 PM" },
            {
                name: "Bollywood (Women)",
                days: "Tue – Thu",
                time: "7:30 – 8:30 PM",
            },
            { name: "Western", days: "Sat – Sun", time: "4:00 – 5:00 PM" },
        ],
    },
];

export default function ClassTimingsSection() {
    return (
        <section id="schedule" className="bg-[#F9F8F6] py-24 lg:py-32">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Schedule
                    </span>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
                        Class Timings
                    </h2>
                </div>

                <div className="flex flex-col gap-16">
                    {schedules.map((schedule) => (
                        <div key={schedule.branch}>
                            {/* Branch Header */}
                            <div className="flex items-center gap-2 mb-8">
                                <MapPin size={16} className="text-gray-400" />
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                                        {schedule.branch}
                                    </h3>
                                    <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-sans">
                                        {schedule.location}
                                    </p>
                                </div>
                            </div>

                            {/* Schedule Grid */}
                            <div>
                                {/* Header Row */}
                                <div className="grid grid-cols-3 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 font-sans border-b border-gray-200 pb-4">
                                    <span>Class</span>
                                    <span>Days</span>
                                    <span className="text-right">Time</span>
                                </div>

                                {/* Data Rows */}
                                {schedule.classes.map((cls) => (
                                    <div
                                        key={cls.name}
                                        className="grid grid-cols-3 border-b border-gray-100 py-5"
                                    >
                                        <span className="text-sm font-medium text-[#1A1A1A] font-sans">
                                            {cls.name}
                                        </span>
                                        <span className="text-sm text-gray-500 font-sans">
                                            {cls.days}
                                        </span>
                                        <span className="text-sm text-gray-500 text-right flex items-center justify-end gap-1.5 font-sans">
                                            <Clock size={14} className="text-gray-300" />
                                            {cls.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
