"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function HeroSection() {
    useEffect(() => {
        const parallaxImage = document.getElementById("hero-parallax-img");
        if (!parallaxImage) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Adjust the 0.15 multiplier to make the effect stronger or weaker
                    const scrollPosition = window.scrollY * 0.15;
                    parallaxImage.style.transform = `translateY(${scrollPosition}px) scale(1.1)`;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section
            id="home"
            className="min-h-screen flex flex-col lg:flex-row"
        >
            {/* Left Side — Typography */}
            <div className="w-full text-center lg:w-1/2 lg:text-left flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-0 mb-10 lg:mb-0">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl leading-[1.1] font-bold text-[#1A1A1A] mb-8">
                    Welcome to Dyuthi Dance Studio
                </h1>
                <p className="text-base lg:text-lg text-gray-500 mb-12 max-w-md leading-relaxed font-sans">
                    Traverse into the boundless world of dance.
                </p>

                <div>
                    <a
                        href="#register"
                        className="inline-block px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors duration-300"
                    >
                        Join a Batch
                    </a>
                </div>
            </div>

            {/* Right Side — Hero Image with Parallax */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto min-h-[400px] bg-[#F9F8F6] flex justify-center items-center relative overflow-hidden">
                <Image
                    id="hero-parallax-img"
                    src="/images/hero-bg.jpg"
                    alt="Dyuthi Dance Studio"
                    fill
                    className="object-cover object-[center_15%] opacity-90 scale-110 transition-transform duration-0"
                    priority
                />
            </div>
        </section>
    );
}
