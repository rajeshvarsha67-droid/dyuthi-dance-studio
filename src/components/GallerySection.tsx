"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 1024 ? 600 : 400;
      sliderRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const images = [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpeg",
    "/images/gallery-6.jpeg",
    "/images/gallery-7.jpeg",
    "/images/gallery-8.jpeg",
    "/images/gallery-9.jpeg",
    "/images/gallery-10.jpeg",
  ];

  return (
    <section id="gallery" className="py-24 lg:py-32 skeuo-inset relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        {/* Section Header */}
        <div className="text-center mb-16 relative skeuo-panel p-8 rounded-3xl max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 skeuo-inset text-[#D32F2F] text-xs font-bold rounded-full uppercase tracking-[0.2em] mb-4 shadow-sm">
            Our Moments
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold skeuo-text mb-4 tracking-tight">
            Gallery
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#D32F2F] to-[#ff5252] mx-auto mt-6 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Skeuomorphic Gallery Slider System */}
        <div className="gallery w-full mt-16 perspective-[1500px] relative">
          
          {/* External Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-15px] lg:left-[-30px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full skeuo-btn flex items-center justify-center group shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-slate-700 group-active:scale-90 transition-transform" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-15px] lg:right-[-30px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full skeuo-btn flex items-center justify-center group shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-slate-700 group-active:scale-90 transition-transform" />
          </button>

          {/* Heavy Recessed Aluminum Track */}
          <div 
            ref={sliderRef}
            className="slider w-full skeuo-inset rounded-[2.5rem] p-6 lg:p-10 hide-scrollbars overflow-x-auto snap-x snap-mandatory flex items-center shadow-[inset_0_20px_40px_rgba(0,0,0,0.4),0_2px_1px_rgba(255,255,255,0.8)] border border-black/10 transition-transform"
          >
            <div className="wrapper flex gap-8 lg:gap-14 w-max snap-center py-8 px-4 items-center">
              
              {images.map((src, idx) => (
                <div 
                  key={idx} 
                  className="slide relative w-[320px] h-[450px] lg:w-[480px] lg:h-[650px] rounded-2xl overflow-hidden snap-center shrink-0 skeuo-glass hover:scale-105 hover:-translate-y-4 transition-all duration-700 ease-out cursor-pointer group shadow-[15px_20px_40px_rgba(0,0,0,0.5)]"
                  style={{
                      transformStyle: "preserve-3d"
                  }}
                >
                  {/* Inner Physical Bevel/Frame holding the image */}
                  <div className="absolute inset-3 lg:inset-5 rounded-[12px] overflow-hidden skeuo-inset z-10 box-border border-4 border-[#e2e2e2] dark:border-[#2a2e35]">
                    <Image
                      src={src}
                      alt={`Gallery image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                      sizes="(max-width: 768px) 320px, 480px"
                    />
                    {/* Deep inner shadow simulating actual physical depth of the frame */}
                    <div className="absolute inset-0 shadow-[inset_0px_0px_25px_rgba(0,0,0,0.7)] pointer-events-none z-20 mix-blend-multiply"></div>
                  </div>

                  {/* Thick Glass edge reflection highlights */}
                  <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-30 mix-blend-overlay"></div>
                  <div className="absolute top-0 left-0 w-[5%] h-full bg-gradient-to-r from-white/30 to-transparent pointer-events-none z-30 mix-blend-overlay"></div>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbars::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbars {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
