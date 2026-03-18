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
import { useScrollReveal } from "@/hooks/useScrollReveal";

const images = [
  { src: carnival1, alt: "Carnival glam with jeweled blue costume and rhinestones", className: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2" },
  { src: carnival11, alt: "Smiling carnival masquerader in orange costume with gold jewelry and pink gems", className: "col-span-1 row-span-1", objectPosition: "center 20%" },
  { src: carnival2, alt: "Blue feathered carnival costume with iridescent wings", className: "col-span-1 row-span-1" },
  { src: carnival3, alt: "Jeweled carnival costume with emerald details", className: "col-span-1 row-span-1" },
  { src: carnival4, alt: "Close-up carnival glam with glitter and turquoise", className: "col-span-1 row-span-1", objectPosition: "center 20%" },
  { src: carnival6, alt: "Royal blue butterfly wings carnival costume", className: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-2" },
  { src: carnival5, alt: "Pink and orange feathered carnival wings costume", className: "col-span-1 row-span-1" },
  { src: carnival7, alt: "Colorful feathered headdress carnival masquerader", className: "col-span-1 row-span-1" },
  { src: carnival8, alt: "Golden carnival jewelry close-up with feather details", className: "col-span-1 row-span-1" },
  { src: carnival9, alt: "Gold headpiece and crystal carnival jewelry close-up", className: "col-span-1 row-span-1" },
  { src: carnival10, alt: "Pink and magenta butterfly wings carnival costume", className: "col-span-1 row-span-1" },
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
      </div>
    </section>
  );
};

export default Gallery;