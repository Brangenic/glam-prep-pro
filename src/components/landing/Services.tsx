import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    title: "Makeup Services",
    description: "Professional glam designed for Carnival lighting, photography, and long wear.",
    details: ["Soft glam", "Full glam", "Glitter & carnival looks"],
  },
  {
    title: "Hair Styling",
    description: "Styles designed to complement your costume and survive the road.",
    details: ["Ponytails", "Braids", "Sleek styles"],
  },
  {
    title: "Costume Dressing",
    description: "Our team ensures your costume is properly fitted and secured before you leave.",
    details: ["No last-minute adjustments on the road"],
  },
  {
    title: "Content & Photos",
    description: "Start your carnival day with beautiful photos and content-ready moments.",
    details: ["Pre-road photo shoot", "Social-ready content"],
  },
  {
    title: "Concierge Prep",
    description: "An elevated experience designed to make your carnival morning seamless.",
    details: ["From arrival to departure, everything coordinated"],
  },
];

const Services = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="services" className="py-24 lg:py-32 bg-card/30">
      <div ref={ref} className="container mx-auto px-6">
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          What We Offer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group border border-border rounded-xl p-8 hover:border-secondary/50 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-secondary transition-colors">
                {s.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                {s.description}
              </p>
              <ul className="space-y-1">
                {s.details.map((d) => (
                  <li key={d} className="font-body text-sm text-foreground/70">
                    — {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
