"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

export function ThreeDMarquee({ images }: { images: string[] }) {
  // We'll split the images into 4 columns to create the 3D staggered effect
  const cols = [[], [], [], []] as string[][];
  images.forEach((img, i) => cols[i % 4].push(img));

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-transparent antialiased py-10 perspective-[1000px]">
      <div
        className="flex h-full w-full gap-4 rotate-x-[20deg] rotate-y-[-20deg] scale-110 translate-y-[-10px] items-start justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(15deg) rotateY(-15deg) rotateZ(5deg) scale(1.1)",
        }}
      >
        {cols.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-4 w-64 min-w-[16rem]"
            style={{
              // Add a stagger to the starting position for a more organic feel
              transform: `translateZ(${colIdx * 20 - 40}px)`,
            }}
          >
            <MarqueeColumn images={col} reverse={colIdx % 2 !== 0} />
          </div>
        ))}
      </div>
      
      {/* Soft overlay gradients for depth and realistic lighting */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/80 to-transparent dark:from-neutral-900/80"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white/80 to-transparent dark:from-neutral-900/80"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/80 to-transparent dark:from-neutral-900/80"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/80 to-transparent dark:from-neutral-900/80"></div>
    </div>
  );
}

function MarqueeColumn({ images, reverse }: { images: string[]; reverse: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Double the images to create the infinite scroll effect seamlessly
  const scrollImages = [...images, ...images];

  return (
    <div
      className="relative flex flex-col gap-4 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "-webkit-linear-gradient(top, transparent, black 10%, black 90%, transparent)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex flex-col gap-4 animate-marquee`}
        style={{
          animationDuration: "30s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        {scrollImages.map((src, idx) => (
          <div
            key={idx}
            className="w-full relative rounded-2xl overflow-hidden skeuo-panel group cursor-pointer"
            style={{
              // Randomizing height slightly for masonry vibe
              height: `${Math.floor(Math.random() * 80) + 160}px`
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="256px"
            />
            {/* Skeuomorphic glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none"></div>
            {/* Skeuomorphic inner shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
          </div>
        ))}
      </div>
      
      {/* We need inline keyframes for the marquee since we can't easily edit tailwind config without side effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 0.5rem)); }
        }
        .animate-marquee {
          animation-name: marquee;
        }
      `}} />
    </div>
  );
}
