import carnival1 from "@/assets/carnival-1.jpg";
import carnival2 from "@/assets/carnival-2.jpg";
import carnival3 from "@/assets/carnival-3.jpg";
import carnival4 from "@/assets/carnival-4.jpg";
import carnival5 from "@/assets/carnival-5.jpg";
import carnival6 from "@/assets/carnival-6.jpg";
import carnival7 from "@/assets/carnival-7.jpg";
import carnival8 from "@/assets/carnival-8.jpg";
import carnival9 from "@/assets/carnival-9.jpg";
import carnival10 from "@/assets/carnival-10.jpg";
import carnival11 from "@/assets/gallery-5.jpeg";
import carnival12 from "@/assets/gallery-6.jpg";
import carnival13 from "@/assets/gallery-7.jpg";
import carnival14 from "@/assets/gallery-8.jpg";
import carnival15 from "@/assets/gallery-9.jpg";
import carnival16 from "@/assets/gallery-10.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const images = [
  { src: carnival1, alt: "Carnival glam with jeweled blue costume and rhinestones", className: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2" },
  { src: carnival11, alt: "Smiling carnival masquerader in orange costume with gold jewelry and pink gems", className: "col-span-1 row-span-1", objectPosition: "center 20%" },
  { src: carnival2, alt: "Blue feathered carnival costume with iridescent wings", className: "col-span-1 row-span-1" },
  { src: carnival12, alt: "Full-length carnival costume with bright orange, pink, and turquoise feathers", className: "col-span-1 row-span-1 sm:row-span-2", objectPosition: "center top" },
  { src: carnival3, alt: "Jeweled carnival costume with emerald details", className: "col-span-1 row-span-1" },
  { src: carnival4, alt: "Close-up carnival glam with glitter and turquoise", className: "col-span-1 row-span-1", objectPosition: "center 20%" },
  { src: carnival6, alt: "Royal blue butterfly wings carnival costume", className: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-2" },
  { src: carnival13, alt: "Two friends in carnival costumes hugging and smiling at an event", className: "col-span-1 row-span-1" },
  { src: carnival15, alt: "Masquerader in a jeweled carnival costume seated in a colorful feathered backpiece", className: "col-span-1 row-span-1 sm:row-span-2", objectPosition: "center top" },
  { src: carnival5, alt: "Pink and orange feathered carnival wings costume", className: "col-span-1 row-span-1" },
  { src: carnival7, alt: "Colorful feathered headdress carnival masquerader", className: "col-span-1 row-span-1" },
  { src: carnival14, alt: "Masquerader with blue dragon wings and jeweled carnival costume", className: "col-span-1 row-span-1 sm:row-span-2", objectPosition: "center top" },
  { src: carnival8, alt: "Golden carnival jewelry close-up with feather details", className: "col-span-1 row-span-1" },
  { src: carnival16, alt: "Celebrating masquerader on the road surrounded by photographers and carnival energy", className: "col-span-1 row-span-1", objectPosition: "center top" },
  { src: carnival9, alt: "Gold headpiece and crystal carnival jewelry close-up", className: "col-span-1 row-span-1" },
  { src: carnival10, alt: "Pink and magenta butterfly wings carnival costume", className: "col-span-1 row-span-1" },
];

const glamHubVideos = [
  {
    id: "W4b98oLRTCE",
    title: "Glam Hub in Action video",
  },
];

const Gallery = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="gallery" className="py-16 sm:py-24 lg:py-32">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 auto-rows-[120px] sm:auto-rows-[180px] lg:auto-rows-[240px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.className} rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                loading="lazy"
              />
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