import c1_480 from "@/assets/carnival-1-480.webp";
import c1_960 from "@/assets/carnival-1-960.webp";
import c1_1400 from "@/assets/carnival-1-1400.webp";
import c3_480 from "@/assets/carnival-3-480.webp";
import c3_960 from "@/assets/carnival-3-960.webp";
import c3_1400 from "@/assets/carnival-3-1400.webp";
import c4_480 from "@/assets/carnival-4-480.webp";
import c4_960 from "@/assets/carnival-4-960.webp";
import c4_1400 from "@/assets/carnival-4-1400.webp";
import c5_480 from "@/assets/carnival-5-480.webp";
import c5_960 from "@/assets/carnival-5-960.webp";
import c5_1400 from "@/assets/carnival-5-1400.webp";
import c7_480 from "@/assets/carnival-7-480.webp";
import c7_960 from "@/assets/carnival-7-960.webp";
import c7_1400 from "@/assets/carnival-7-1400.webp";
import c8_480 from "@/assets/carnival-8-480.webp";
import c8_960 from "@/assets/carnival-8-960.webp";
import c8_1400 from "@/assets/carnival-8-1400.webp";
import c10_480 from "@/assets/carnival-10-480.webp";
import c10_960 from "@/assets/carnival-10-960.webp";
import c10_1400 from "@/assets/carnival-10-1400.webp";
import g5_480 from "@/assets/gallery-5-480.webp";
import g5_960 from "@/assets/gallery-5-960.webp";
import g5_1400 from "@/assets/gallery-5-1400.webp";
import g6_480 from "@/assets/gallery-6-480.webp";
import g6_960 from "@/assets/gallery-6-960.webp";
import g6_1400 from "@/assets/gallery-6-1400.webp";
import g8_480 from "@/assets/gallery-8-480.webp";
import g8_960 from "@/assets/gallery-8-960.webp";
import g8_1400 from "@/assets/gallery-8-1400.webp";
import g9_480 from "@/assets/gallery-9-480.webp";
import g9_960 from "@/assets/gallery-9-960.webp";
import g9_1400 from "@/assets/gallery-9-1400.webp";
import g10_480 from "@/assets/gallery-10-480.webp";
import g10_960 from "@/assets/gallery-10-960.webp";
import g10_1400 from "@/assets/gallery-10-1400.webp";
import g11_480 from "@/assets/gallery-11-480.webp";
import g11_960 from "@/assets/gallery-11-960.webp";
import g11_1400 from "@/assets/gallery-11-1400.webp";
import g13_480 from "@/assets/gallery-13-480.webp";
import g13_960 from "@/assets/gallery-13-960.webp";
import g13_1400 from "@/assets/gallery-13-1400.webp";
import g14_480 from "@/assets/gallery-14-480.webp";
import g14_960 from "@/assets/gallery-14-960.webp";
import g14_1400 from "@/assets/gallery-14-1400.webp";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { toSchemaDateTime } from "@/lib/schemaDate";

const set = (s: string, m: string, l: string) => `${s} 480w, ${m} 960w, ${l} 1400w`;

const images = [
  { src: g14_960, srcSet: set(g14_480, g14_960, g14_1400), alt: "Three masqueraders posing together with pink and blue feathered wings on the road", aspectClass: "aspect-[4/3]", objectPosition: "center center", w: 1200, h: 900 },
  { src: c1_960, srcSet: set(c1_480, c1_960, c1_1400), alt: "Carnival glam with jeweled blue costume and rhinestones", aspectClass: "aspect-[4/5]", w: 800, h: 1000 },
  { src: g10_960, srcSet: set(g10_480, g10_960, g10_1400), alt: "Close-up carnival portrait with bright blue costume details and jeweled headpiece", aspectClass: "aspect-[3/4]", objectPosition: "center top", w: 750, h: 1000 },
  { src: g6_960, srcSet: set(g6_480, g6_960, g6_1400), alt: "Full-length carnival costume with bright orange, pink, and turquoise feathers", aspectClass: "aspect-[3/4]", objectPosition: "center top", w: 750, h: 1000 },
  { src: g11_960, srcSet: set(g11_480, g11_960, g11_1400), alt: "Outdoor carnival portrait with warm-toned costume and dramatic glam makeup", aspectClass: "aspect-[3/4]", objectPosition: "center top", w: 750, h: 1000 },
  { src: g8_960, srcSet: set(g8_480, g8_960, g8_1400), alt: "Masquerader with blue dragon wings and jeweled carnival costume", aspectClass: "aspect-[3/4]", objectPosition: "center top", w: 750, h: 1000 },
  { src: g9_960, srcSet: set(g9_480, g9_960, g9_1400), alt: "Celebrating masquerader on the road surrounded by photographers and carnival energy", aspectClass: "aspect-[4/5]", objectPosition: "center top", w: 800, h: 1000 },
  { src: g5_960, srcSet: set(g5_480, g5_960, g5_1400), alt: "Smiling carnival masquerader in orange costume with gold jewelry and pink gems", aspectClass: "aspect-square", objectPosition: "center 20%", w: 1000, h: 1000 },
  { src: c4_960, srcSet: set(c4_480, c4_960, c4_1400), alt: "Close-up carnival glam with glitter and turquoise", aspectClass: "aspect-[4/5]", objectPosition: "center 20%", w: 800, h: 1000 },
  { src: g13_960, srcSet: set(g13_480, g13_960, g13_1400), alt: "Beauty portrait in a red carnival costume with embellished eye makeup", aspectClass: "aspect-[4/5]", objectPosition: "center top", w: 800, h: 1000 },
  { src: c5_960, srcSet: set(c5_480, c5_960, c5_1400), alt: "Pink and orange feathered carnival wings costume", aspectClass: "aspect-[4/5]", w: 800, h: 1000 },
  { src: c10_960, srcSet: set(c10_480, c10_960, c10_1400), alt: "Pink and magenta butterfly wings carnival costume", aspectClass: "aspect-[4/5]", w: 800, h: 1000 },
  { src: c3_960, srcSet: set(c3_480, c3_960, c3_1400), alt: "Jeweled carnival costume with emerald details", aspectClass: "aspect-square", w: 1000, h: 1000 },
  { src: c7_960, srcSet: set(c7_480, c7_960, c7_1400), alt: "Colorful feathered headdress carnival masquerader", aspectClass: "aspect-square", w: 1000, h: 1000 },
  { src: c8_960, srcSet: set(c8_480, c8_960, c8_1400), alt: "Golden carnival jewelry close-up with feather details", aspectClass: "aspect-square", w: 1000, h: 1000 },
];

const glamHubVideos = [
  {
    id: "W4b98oLRTCE",
    title: "Glam Hub in Action video",
  },
];

const videoObjectSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Carnival Glam Hub Reviews from Trinidad, Jamaica and Miami Masqueraders",
  description:
    "Real masquerader reviews and testimonials of Carnival Glam Hub from Trinidad, Jamaica and Miami. Hear directly from women who booked their Carnival morning with the original Carnival morning concierge for sweat-resistant makeup, hair, getting dressed, photos and shuttle.",
  thumbnailUrl: "https://www.carnivalglamhub.com/og-image.png",
  uploadDate: toSchemaDateTime("2024-07-02T04:06:01-07:00"),
  contentUrl: "https://www.youtube.com/watch?v=W4b98oLRTCE",
  embedUrl: "https://www.youtube.com/embed/W4b98oLRTCE",
  publisher: {
    "@type": "Organization",
    name: "Carnival Glam Hub",
    logo: {
      "@type": "ImageObject",
      url: "https://www.carnivalglamhub.com/logo.png",
    },
  },
};

const Gallery = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="gallery" className="section-y">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Our Work</p>
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Carnival Glam <span className="italic text-gradient-primary">in Action</span>
          </h2>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-3 lg:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`mb-2 break-inside-avoid sm:mb-3 lg:mb-4 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className={img.aspectClass}>
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  width={img.w}
                  height={img.h}
                  alt={img.alt}
                  className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 gap-4 sm:gap-6">
          {glamHubVideos.map((video, i) => (
            <div
              key={video.id}
              className={`overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card gold-glow transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${900 + i * 120}ms` }}
            >
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;