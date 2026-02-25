import Image from "next/image";
import { Heart, Sparkles, Users, Handshake } from "lucide-react";

const values = [
    { icon: Heart, label: "Joy" },
    { icon: Sparkles, label: "Confidence" },
    { icon: Handshake, label: "Connection" },
    { icon: Users, label: "Community" },
];

export default function OurStorySection() {
    return (
        <section id="our-story" className="bg-gray-50 py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Text Column */}
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Our Story
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        More Than Just Movement
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed mb-8">
                        Founded by Dona Benny, a passionate performer with over 10 years of
                        experience, Dyuthi Dance Studio is a vibrant space where children
                        (ages 6+) and adults come together to learn, express, and grow. We
                        believe dance builds confidence, discipline, and connection.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {values.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                            >
                                <Icon size={16} className="text-[#D32F2F]" />
                                <span className="text-sm font-medium text-slate-700">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Column */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80"
                        alt="Dance studio atmosphere"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
