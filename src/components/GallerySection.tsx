"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
    { src: "/images/gallery-1.jpg", alt: "Gallery 1" },
    { src: "/images/gallery-2.jpg", alt: "Gallery 2" },
    { src: "/images/gallery-3.jpg", alt: "Gallery 3" },
    { src: "/images/gallery-4.jpg", alt: "Gallery 4" },
    { src: "/images/gallery-5.jpeg", alt: "Gallery 5" },
    { src: "/images/gallery-6.jpeg", alt: "Gallery 6" },
    { src: "/images/gallery-7.jpeg", alt: "Gallery 7" },
    { src: "/images/gallery-8.jpeg", alt: "Gallery 8" },
    { src: "/images/gallery-9.jpeg", alt: "Gallery 9" },
    { src: "/images/gallery-10.jpeg", alt: "Gallery 10" },
];

export default function GallerySection() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goNext = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
        }
    };

    const goPrev = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(
                (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
            );
        }
    };

    return (
        <section id="gallery" className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 bg-red-50 text-[#D32F2F] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                        Our Moments
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Gallery
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        A glimpse into the vibrant world of Dyuthi — performances, practices, and precious moments captured in time.
                    </p>
                </div>

                {/* Masonry-style Grid */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="break-inside-avoid group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                            onClick={() => openLightbox(index)}
                        >
                            <div className="relative overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                        View
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X size={32} />
                    </button>

                    {/* Prev Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-2"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={galleryImages[lightboxIndex].src}
                            alt={galleryImages[lightboxIndex].alt}
                            width={1200}
                            height={800}
                            className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                            priority
                        />
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-2"
                        aria-label="Next image"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        {lightboxIndex + 1} / {galleryImages.length}
                    </div>
                </div>
            )}
        </section>
    );
}
