import jamaicaImg from "@/assets/dest-jamaica-new.jpg";
import stluciaImg from "@/assets/dest-stlucia-new.jpg";
import trinidadImg from "@/assets/dest-trinidad-new.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const destinations = [
  {
    name: "Jamaica Carnival",
    description: "Kingston glam hub services for Jamaica Carnival.",
    image: jamaicaImg,
    cta: "Book Jamaica Carnival",
  },
  {
    name: "Saint Lucia Carnival",
    description: "Premium glam services for Saint Lucia Carnival.",
    image: stluciaImg,
    cta: "Book Saint Lucia",
  },
  {
    name: "Trinidad Carnival",
    description: "Upcoming glam services for Trinidad Carnival — Port of Spain.",
    image: trinidadImg,
    cta: "View Availability",
    upcoming: true,
  },
];

const Destinations = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="destinations" className="py-24 lg:py-32 bg-card/50" aria-labelledby="destinations-heading">
      <div ref={ref} className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Where We Glam</p>
          <h2
            id="destinations-heading"
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Choose Your{" "}
            <span className="text-gradient-primary italic">Destination</span>
          </h2>
          <p
            className={`font-body text-base text-muted-foreground max-w-lg mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Choose your location to view availability and book your glam package.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {destinations.map((d, i) => (
            <div
              key={d.name}
              className={`group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <img
                src={d.image}
                alt={`${d.name} — Carnival Glam Hub destination`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {d.upcoming && (
                <div className="absolute top-4 left-4 bg-secondary/90 text-secondary-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl lg:text-2xl font-bold mb-2 italic text-white">
                  {d.name}
                </h3>
                <p className="font-body text-xs text-white/70 mb-5">
                  {d.description}
                </p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-xs px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {d.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;