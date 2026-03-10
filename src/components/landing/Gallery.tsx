import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const images = [
  { src: gallery1, alt: "Carnival glam makeup results", className: "col-span-2 row-span-2" },
  { src: gallery2, alt: "Behind the scenes preparation", className: "col-span-1 row-span-1" },
  { src: gallery4, alt: "Close-up makeup details", className: "col-span-1 row-span-1" },
  { src: gallery3, alt: "Group of carnival masqueraders", className: "col-span-2 row-span-1" },
];

const Gallery = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-card/30">
      <div ref={ref} className="container mx-auto px-6">
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Carnival Glam in Action
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[200px] lg:auto-rows-[250px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.className} rounded-xl overflow-hidden transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
