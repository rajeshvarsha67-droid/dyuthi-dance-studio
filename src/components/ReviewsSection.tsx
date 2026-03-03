"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
    { image: "/images/review-1.jpg", alt: "Happy student 1" },
    { image: "/images/review-2.jpg", alt: "Happy student 2" },
    { image: "/images/review-3.jpg", alt: "Happy student 3" },
    { image: "/images/review-4.jpg", alt: "Happy student 4" },
];

export default function ReviewsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prev = () =>
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Testimonials
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                        The Dyuthi Community
                    </h2>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prev}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={20} className="text-slate-700" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Next review"
                    >
                        <ChevronRight size={20} className="text-slate-700" />
                    </button>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {reviews.map((review, idx) => (
                            <div
                                key={idx}
                                className={`relative aspect-[4/5] rounded-xl overflow-hidden shadow-md transition-all duration-300 ${idx === currentIndex
                                    ? "ring-2 ring-[#D32F2F] scale-[1.02]"
                                    : ""
                                    }`}
                            >
                                <Image
                                    src={review.image}
                                    alt={review.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
