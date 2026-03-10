import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    title: "Makeup Services",
    description: "Professional glam designed specifically for Carnival lighting, photography, and long wear.",
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
    <section id="services" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Our Services</p>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            What We <span className="italic text-gradient-primary">Offer</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:gold-glow transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="w-8 h-px bg-primary mb-6 group-hover:w-12 transition-all" />
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-5">
                {s.description}
              </p>
              <ul className="space-y-1.5">
                {s.details.map((d) => (
                  <li key={d} className="font-body text-sm text-foreground/60 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-secondary" />
                    {d}
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