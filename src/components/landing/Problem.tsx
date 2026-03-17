import solutionImg from "@/assets/experience-hero.jpg";
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
    description: "A dedicated assistant ensures your costume is properly fitted and secured before you leave.",
  },
  {
    icon: "🧵",
    title: "On-Site Seamstress",
    description: "Costume popped? Gems fell off? Our seamstress handles adjustments, fittings, and gem replacements on the spot.",
  },
  {
    icon: "📸",
    title: "Photo Shoot Ready",
    description: "Step into our garden for a stunning pre-road photo shoot — content-ready before you hit the road.",
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

      <div ref={ref} className="relative container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
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
            More than a makeup appointment — a luxury, full-service preparation
            experience so you feel confident, relaxed, and fully ready before you
            step onto the road.
          </p>
        </div>

        {/* Wide image */}
        <div
          className={`relative rounded-3xl overflow-hidden aspect-[21/9] mb-14 gold-glow transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <img
            src={solutionImg}
            alt="Masquerader getting glam at Carnival Glam Hub"
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 border border-primary/10">
              <p className="font-body text-xs text-primary font-medium uppercase tracking-wider">
                The Glam Hub Difference
              </p>
              <p className="font-body text-sm text-foreground/80 mt-0.5">
                Full-service. Concierge-style. Luxury from start to finish.
              </p>
            </div>
          </div>
        </div>

        {/* 2×3 Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {luxuryFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:gold-glow transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + i * 80}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display text-base font-bold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
