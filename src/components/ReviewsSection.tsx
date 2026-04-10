"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
    id?: string;
    student_name: string;
    review_text: string;
    rating?: number;
    image?: string; // fallback
    alt?: string; // fallback
}

interface ReviewsSectionProps {
    reviews?: Review[];
}

const FALLBACK_REVIEWS = [
    { student_name: "Happy Student 1", image: "/images/review-1.jpg", alt: "Happy student 1", review_text: "Dyuthi completely changed my approach to dance. The instructors are phenomenal!" },
    { student_name: "Happy Student 2", image: "/images/review-2.jpg", alt: "Happy student 2", review_text: "A vibrant community and a rigorous training ground. Highly recommended." },
    { student_name: "Happy Student 3", image: "/images/review-3.jpg", alt: "Happy student 3", review_text: "My confidence has skyrocketed since I joined. The best decision ever." },
    { student_name: "Happy Student 4", image: "/images/review-4.jpg", alt: "Happy student 4", review_text: "Professional, fun, and deeply inspiring. I look forward to every class." },
];

export default function ReviewsSection({ reviews: initialReviews = [] }: ReviewsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const displayReviews = initialReviews.length > 0 ? initialReviews : FALLBACK_REVIEWS;

    const next = () => setCurrentIndex((prev) => (prev + 1) % displayReviews.length);
    const prev = () =>
        setCurrentIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);

    return (
        <section className="bg-[#F9F8F6] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Testimonials
                    </span>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
                        The Dyuthi Community
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prev}
                        className="absolute -left-4 lg:-left-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-300"
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 lg:-right-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-300"
                        aria-label="Next review"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {displayReviews.map((review, idx) => (
                            <div
                                key={idx}
                                className={`bg-white p-8 flex flex-col items-center text-center transition-all duration-500 ${
                                    idx === currentIndex ? "scale-[1.03]" : "opacity-70"
                                }`}
                            >
                                <svg className="w-6 h-6 text-gray-200 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>

                                <p className="text-sm font-sans text-gray-600 leading-relaxed mb-4">
                                    &ldquo;{review.review_text}&rdquo;
                                </p>
                                
                                <p className="text-xs font-semibold text-charcoal mb-4 uppercase tracking-widest">
                                    - {review.student_name}
                                </p>

                                <div className="relative w-14 h-14 rounded-full overflow-hidden mt-auto bg-gray-100 flex items-center justify-center">
                                    {review.image ? (
                                        <Image
                                            src={review.image}
                                            alt={review.alt || "Student Reviewer"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-bold text-lg">{review.student_name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Google Reviews CTA */}
                <div className="text-center mt-20">
                    <a
                        href="https://www.google.com/search?q=dyuthi+dance+studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        See All Reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
