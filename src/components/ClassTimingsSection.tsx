"use client";

import { useState } from "react";
import { ChevronDown, Clock, MapPin } from "lucide-react";

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
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <section id="schedule" className="bg-gray-50 py-20 lg:py-28">
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Schedule
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                        Class Timings
                    </h2>
                </div>

                <div className="flex flex-col gap-4">
                    {schedules.map((schedule, idx) => (
                        <div
                            key={schedule.branch}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-[#D32F2F]" />
                                    <div className="text-left">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {schedule.branch}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {schedule.location}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={`text-slate-400 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Accordion Content */}
                            {openIndex === idx && (
                                <div className="border-t border-gray-100 px-6 pb-5">
                                    <table className="w-full mt-4">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <th className="pb-3">Class</th>
                                                <th className="pb-3">Days</th>
                                                <th className="pb-3 text-right">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.classes.map((cls) => (
                                                <tr
                                                    key={cls.name}
                                                    className="border-t border-gray-50"
                                                >
                                                    <td className="py-3 text-sm font-medium text-slate-900">
                                                        {cls.name}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600">
                                                        {cls.days}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 text-right flex items-center justify-end gap-1.5">
                                                        <Clock size={14} className="text-slate-400" />
                                                        {cls.time}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
