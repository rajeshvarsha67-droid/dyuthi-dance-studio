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

                {/* Google Reviews CTA */}
                <div className="text-center mt-12">
                    <a
                        href="https://www.google.com/search?sca_esv=ad175a4a610f2e0b&rlz=1C1YTUH_enIN1158IN1158&sxsrf=ANbL-n55OEZe4LX1XSVEPBQtSBrAjIseog:1772651610819&q=dyuthi+dance+studio&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcAxNSGbFS5ClO5Er8o-K43bZgGu2wLGkMz5pbN8xnxz0rdz9dV4mIJIesEOCvZ9DuGyjgprDpUyIYSD24Yq76cLl3VSR0OuJap7ufYg3jjxBv77Tw%3D%3D&sa=X&sqi=2&ved=2ahUKEwjh9crs-YaTAxW6SWwGHRSBFxMQrrQLegQIHRAA&biw=1920&bih=945&dpr=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-[#D32F2F] text-[#D32F2F] font-semibold rounded-full hover:bg-[#D32F2F] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        See All Reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
