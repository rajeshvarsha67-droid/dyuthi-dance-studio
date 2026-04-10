import Image from "next/image";

interface GalleryImage {
    id?: string;
    image_url: string;
    alt_text?: string | null;
}

interface GallerySectionProps {
    images?: GalleryImage[];
}

const FALLBACK_IMAGES: GalleryImage[] = [
  { image_url: "/images/gallery-1.jpg" },
  { image_url: "/images/gallery-2.jpg" },
  { image_url: "/images/gallery-3.jpg" },
  { image_url: "/images/gallery-4.jpg" },
  { image_url: "/images/gallery-5.jpeg" },
  { image_url: "/images/gallery-6.jpeg" },
  { image_url: "/images/gallery-7.jpeg" },
  { image_url: "/images/gallery-8.jpeg" },
  { image_url: "/images/gallery-9.jpeg" },
  { image_url: "/images/gallery-10.jpeg" },
];

export default function GallerySection({ images: initialImages = [] }: GallerySectionProps) {
  const displayImages = initialImages.length > 0 ? initialImages : FALLBACK_IMAGES;

  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl tracking-wide text-charcoal">
          Gallery
        </h2>
      </div>

      <div className="relative w-full flex overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {/* First set */}
          <div className="flex gap-4 px-2">
            {displayImages.map((img, idx) => (
              <Image
                key={`a-${idx}`}
                src={img.image_url}
                alt={img.alt_text || `Gallery Image ${idx + 1}`}
                width={600}
                height={384}
                className="h-64 md:h-96 w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex gap-4 px-2">
            {displayImages.map((img, idx) => (
              <Image
                key={`b-${idx}`}
                src={img.image_url}
                alt={img.alt_text || `Gallery Image ${idx + 1}`}
                width={600}
                height={384}
                className="h-64 md:h-96 w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
