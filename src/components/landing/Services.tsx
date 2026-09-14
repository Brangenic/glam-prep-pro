import { useState } from "react";
import servicesImg from "@/assets/services-hero.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  FULL_SERVICE_SLUGS,
  HUB_CAPABILITIES,
  TIER_LABEL,
} from "@/data/hubTiers";

/** Title case a slug, so "saint-lucia" reads as "Saint Lucia". */
const titleCase = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/** "Trinidad and Jamaica" from a list of slugs, in reading order. */
const listNames = (slugs: readonly string[]) => {
  const names = slugs.map(titleCase);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

/**
 * Availability lines are derived from the tier model in hubTiers.ts, so
 * they cannot drift from the territories that actually run the service.
 */
const BRONZING_SLUGS = Object.keys(HUB_CAPABILITIES).filter(
  (s) => HUB_CAPABILITIES[s].bronzing && s !== "trinidad-carnival-2027",
);

const BRONZING_AVAILABILITY = `${listNames(BRONZING_SLUGS)} only`;

const FULL_SERVICE_AVAILABILITY = `${TIER_LABEL.full}s only, ${listNames(
  FULL_SERVICE_SLUGS,
)}`;

const services = [
  {
    title: "Makeup Services",
    description: "Professional glam designed specifically for Carnival lighting, photography, and long wear.",
    details: ["Soft glam", "Full glam", "Glitter & carnival looks"],
    accent: "from-primary/20 to-secondary/10",
  },
  {
    title: "Hair Styling",
    description: "Styles designed to complement your costume and survive the road.",
    details: ["Ponytails", "Braids", "Sleek styles"],
    availability: FULL_SERVICE_AVAILABILITY,
    accent: "from-secondary/20 to-primary/10",
  },
  {
    title: "Costume Dressing",
    description: "Our team ensures your costume is properly fitted, secured, and photo-ready before you leave.",
    details: ["On-site seamstress", "Dressing assistants", "Large mirrors"],
    availability: FULL_SERVICE_AVAILABILITY,
    accent: "from-primary/15 to-secondary/15",
  },
  {
    title: "Bronzing",
    description: "Body-perfecting bronzing for smoother, more even-looking skin in person and in photos.",
    details: ["Remove visible tan lines", "Soften the look of stretch marks", "Even skin tone for better photos"],
    availability: BRONZING_AVAILABILITY,
    accent: "from-secondary/15 to-primary/20",
  },
  {
    title: "Content & Photos",
    description: "Start your carnival day with beautiful photos and content-ready moments.",
    details: ["Pre-road photo shoot", "Social-ready content"],
    accent: "from-secondary/15 to-primary/20",
  },
  {
    title: "Concierge Prep",
    description: "One schedule, from the moment you arrive to the moment you leave for the road.",
    details: ["From arrival to departure, everything coordinated"],
    availability: FULL_SERVICE_AVAILABILITY,
    accent: "from-primary/20 to-secondary/20",
  },
];

const Services = () => {
  const { ref, isVisible } = useScrollReveal();
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="section-y section-flush-top">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p
            className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Our Services
          </p>
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            What We <span className="italic text-gradient-primary">Offer</span>
          </h2>
        </div>

        {/* Two-column: image + interactive list */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Image with floating active label */}
          <div
            className={`relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] gold-glow transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <img
              src={servicesImg}
              alt="Close-up carnival glam makeup and jewelry"
              width={1000}
              height={1250}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Active service floating badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 transition-all duration-500">
              <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 border border-primary/10">
                <p className="font-display text-sm font-bold text-primary mb-1">
                  {services[active].title}
                </p>
                <p className="font-body text-xs text-foreground/70 leading-relaxed">
                  {services[active].description}
                </p>
              </div>
            </div>

            {/* Step indicator dots */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex flex-col gap-1.5">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "bg-primary scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`View service ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Interactive service list */}
          <div className="space-y-2 sm:space-y-3">
            {services.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActive(i)}
                className={`group w-full text-left relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } ${
                  i === active
                    ? "bg-card border-primary/30 gold-glow"
                    : "bg-card/50 border-border hover:border-primary/20"
                }`}
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                {/* Hover gradient */}
                <div
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${s.accent} transition-opacity duration-500 ${
                    i === active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}
                />

                <div className="relative flex items-start gap-3 sm:gap-4">
                  {/* Number indicator */}
                  <span
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display text-xs sm:text-sm font-bold transition-all duration-300 ${
                      i === active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-sm sm:text-base font-bold mb-1 transition-colors duration-300 ${
                        i === active ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {s.title}
                    </h3>

                    {/* Expandable details */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        i === active ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                        {s.description}
                      </p>
                      <ul className="space-y-1">
                        {s.details.map((d) => (
                          <li
                            key={d}
                            className="font-body text-xs text-foreground/60 flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-secondary" />
                            {d}
                          </li>
                        ))}
                      </ul>
                      {s.availability && (
                        <p className="font-body text-[11px] text-muted-foreground mt-2">
                          {s.availability}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className={`flex-shrink-0 w-4 h-4 mt-1 transition-all duration-300 ${
                      i === active
                        ? "text-primary rotate-90"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;