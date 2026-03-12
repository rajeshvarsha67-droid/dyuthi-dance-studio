"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
    { image: "/images/review-1.jpg", alt: "Happy student 1", review: "Dyuthi completely changed my approach to dance. The instructors are phenomenal!" },
    { image: "/images/review-2.jpg", alt: "Happy student 2", review: "A vibrant community and a rigorous training ground. Highly recommended." },
    { image: "/images/review-3.jpg", alt: "Happy student 3", review: "My confidence has skyrocketed since I joined. The best decision ever." },
    { image: "/images/review-4.jpg", alt: "Happy student 4", review: "Professional, fun, and deeply inspiring. I look forward to every class." },
];

export default function ReviewsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prev = () =>
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    return (
        <section className="bg-slate-100 py-24 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                 {/* Section Header */}
                 <div className="text-center mb-16 relative skeuo-panel p-8 rounded-3xl max-w-2xl mx-auto">
                    <span className="inline-block px-4 py-1.5 skeuo-inset text-[#D32F2F] text-xs font-bold rounded-full uppercase tracking-[0.2em] mb-4 shadow-sm">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold skeuo-text mb-4 tracking-tight">
                        The Dyuthi Community
                    </h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-[#D32F2F] to-[#ff5252] mx-auto mt-6 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]"></div>
                </div>

                <div className="relative mt-20 max-w-5xl mx-auto">
                    {/* Navigation Arrows - Heavy physical buttons */}
                    <button
                        onClick={prev}
                        className="absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full skeuo-btn flex items-center justify-center group"
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={24} className="text-slate-700 group-active:scale-95 transition-transform" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full skeuo-btn flex items-center justify-center group"
                        aria-label="Next review"
                    >
                        <ChevronRight size={24} className="text-slate-700 group-active:scale-95 transition-transform" />
                    </button>

                    {/* Cards Grid */ }
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {reviews.map((review, idx) => (
                            <div
                                key={idx}
                                className={`uiverse-card group ${idx === currentIndex ? "scale-[1.05]" : "opacity-90"} transition-all duration-500`}
                            >
                                <div className="bg p-6 flex flex-col justify-between items-center text-center">
                                    <svg className="w-8 h-8 text-[#D32F2F] opacity-20 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                    
                                    <p className="text-base md:text-lg font-bold text-slate-900 leading-relaxed relative z-10 mt-6 md:mt-10">
                                        "{review.review}"
                                    </p>

                                    <div className="relative w-16 h-16 rounded-full overflow-hidden mt-6 border-2 border-[#D32F2F] shadow-lg">
                                        <Image
                                            src={review.image}
                                            alt={review.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="blob"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Google Reviews CTA */}
                <div className="text-center mt-20 relative z-20">
                    <a
                        href="https://www.google.com/search?q=dyuthi+dance+studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 skeuo-btn-primary rounded-full font-bold text-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-md">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        See All Reviews on Google
                    </a>
                </div>
            </div>

            {/* Uiverse Card CSS */}
            <style jsx>{`
                .uiverse-card {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3/4;
                    border-radius: 14px;
                    z-index: 10;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 20px 20px 60px #d1d5db, -20px -20px 60px #ffffff;
                }
                .uiverse-card .bg {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    right: 5px;
                    bottom: 5px;
                    z-index: 2;
                    background: rgba(255, 255, 255, .85);
                    backdrop-filter: blur(24px);
                    border-radius: 10px;
                    overflow: hidden;
                    outline: 2px solid white;
                }
                .uiverse-card .blob {
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    background-color: #D32F2F;
                    opacity: 1;
                    filter: blur(12px);
                    animation: blob-bounce 5s infinite ease;
                }
                @keyframes blob-bounce {
                    0% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
                    25% { transform: translate(-100%, -100%) translate3d(100%, 0, 0); }
                    50% { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); }
                    75% { transform: translate(-100%, -100%) translate3d(0, 100%, 0); }
                    100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
                }
            `}</style>
        </section>
    );
}
