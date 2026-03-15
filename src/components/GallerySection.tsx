import Image from "next/image";

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

export default function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl lg:text-5xl tracking-wide text-charcoal">
          Gallery
        </h2>
      </div>

      <div className="relative w-full flex overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {/* First set */}
          <div className="flex gap-4 px-2">
            {images.map((src, idx) => (
              <Image
                key={`a-${idx}`}
                src={src}
                alt={`Gallery Image ${idx + 1}`}
                width={600}
                height={384}
                className="h-96 w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex gap-4 px-2">
            {images.map((src, idx) => (
              <Image
                key={`b-${idx}`}
                src={src}
                alt={`Gallery Image ${idx + 1}`}
                width={600}
                height={384}
                className="h-96 w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
