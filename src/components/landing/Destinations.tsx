import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { destinations } from "@/data/destinations";

const Destinations = () => {
  const { ref, isVisible } = useScrollReveal();

  // Homepage-only ordering and label overrides. Does not affect destination
  // pages, routes, sitemap or shared data.
  const HOMEPAGE_ORDER = [
    "saint-lucia",
    "toronto",
    "barbados",
    "antigua",
    "grenada",
    "miami",
    "trinidad",
    "epic-cruise",
  ];
  const HOMEPAGE_OVERRIDES: Record<string, { name?: string; date?: string }> = {
    trinidad: { name: "Trinidad Carnival 2027" },
    "epic-cruise": { date: "Returns 2028" },
  };
  const orderedDestinations = HOMEPAGE_ORDER
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ ...d, ...HOMEPAGE_OVERRIDES[d.slug] }));

  return (
    <section id="destinations" className="py-16 sm:py-24 lg:py-32 bg-card/50" aria-labelledby="destinations-heading">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Where We Glam</p>
          <h2
            id="destinations-heading"
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Choose Your{" "}
            <span className="text-gradient-primary italic">Destination</span>
          </h2>
          <p
            className={`font-body text-sm sm:text-base text-muted-foreground max-w-lg mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Choose your location to view availability and book your glam package.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {orderedDestinations.map((d, i) => (
            <Link
              key={d.slug}
              to={`/destinations/${d.slug}`}
              onClick={() => {
                if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
                  window.gtag("event", "destination_click", {
                    event_category: "navigation",
                    event_label: d.slug,
                    destination: d.slug,
                  });
                }
              }}
              aria-label={`Book ${d.name} glam services`}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] block transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <img
                src={d.image}
                alt={`${d.name} masquerader in costume — ${d.description}`}
                width={600}
                height={800}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {d.upcoming && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-secondary/90 text-secondary-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              {/* Date badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 sm:px-3 rounded-full">
                {d.date}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold mb-1.5 sm:mb-2 italic text-white">
                  {d.name}
                </h3>
                <p className="font-body text-xs text-white/70 mb-4 sm:mb-5">
                  {d.description}
                </p>
                <span className="inline-block bg-primary text-primary-foreground font-body font-semibold text-xs px-5 py-2.5 rounded-full group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                  {d.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;