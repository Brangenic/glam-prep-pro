import solutionImg from "@/assets/carnival-9.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const luxuryFeatures = [
  {
    icon: "☕",
    title: "Pre-Game Lounge",
    description: "Coffee, tea, water, and cocktails — start your carnival morning relaxed and in the mood.",
  },
  {
    icon: "👗",
    title: "Dressing Assistant",
    description: "A dedicated assistant to make sure your costume is properly fitted and secured before you leave.",
  },
  {
    icon: "🧵",
    title: "On-Site Seamstress",
    description: "Costume popped? Gems fell off? Feather dropped? Our seamstress handles adjustments, bra fittings, ring fixes, and gem replacements on the spot.",
  },
  {
    icon: "📸",
    title: "Photo Shoot Ready",
    description: "Step into our garden for a stunning pre-road photo shoot — content-ready before you even hit the road.",
  },
  {
    icon: "🧳",
    title: "Bag Storage",
    description: "Check your bags and belongings so you can walk straight out onto the road with nothing holding you back.",
  },
  {
    icon: "🚐",
    title: "Shuttle Service",
    description: "Walk straight out to your band or hop on our shuttle — we get you where you need to be.",
  },
];

const Problem = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="experience" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body text-xs uppercase tracking-[0.15em] text-primary font-medium">
              The Experience
            </span>
          </div>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            A Complete Carnival Morning{" "}
            <span className="italic text-gradient-primary">Experience</span>
          </h2>
          <p
            className={`font-body text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Carnival Glam Hub is more than a makeup appointment. It's a luxury,
            full-service preparation experience designed to make sure you feel
            confident, relaxed, and fully ready before you step onto the road.
          </p>
        </div>

        {/* Image + features grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Image */}
          <div
            className={`relative aspect-[3/4] rounded-3xl overflow-hidden gold-glow transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <img
              src={solutionImg}
              alt="Masquerader getting glam at Carnival Glam Hub"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-primary/10">
              <p className="font-body text-xs text-primary font-medium uppercase tracking-wider">
                The Glam Hub Difference
              </p>
              <p className="font-body text-sm text-foreground/80 mt-1">
                Full-service. Concierge-style. Luxury from start to finish.
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-5">
            {luxuryFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:gold-glow transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-bold mb-1 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
