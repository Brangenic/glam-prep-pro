import { useScrollReveal } from "@/hooks/useScrollReveal";

const painPoints = [
  { icon: "⏰", text: "Early morning appointments across town", stat: "5am" },
  { icon: "🏃‍♀️", text: "Running around trying to find your artist", stat: "3+ stops" },
  { icon: "👗", text: "Dressing your costume alone in a rush", stat: "Stressful" },
  { icon: "💦", text: "Sweating before you even hit the road", stat: "Exhausting" },
];

const Problem = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="problem" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="relative container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-body text-xs uppercase tracking-[0.15em] text-secondary font-medium">
              The Problem
            </span>
          </div>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Carnival Morning Should Feel{" "}
            <span className="italic text-gradient-primary">Exciting</span> —{" "}
            <span className="text-gradient-pink">Not Stressful</span>
          </h2>
          <p
            className={`font-body text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            The reality for many masqueraders is chaotic.
          </p>
        </div>

        {/* Pain point cards grid */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mb-16">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className={`group relative bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-secondary/30 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 120}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-start gap-4">
                {/* Icon circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                  {point.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-body text-base lg:text-lg text-foreground font-medium mb-1">
                    {point.text}
                  </p>
                  <span className="font-body text-xs text-secondary font-semibold uppercase tracking-wider">
                    {point.stat}
                  </span>
                </div>
              </div>

              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-secondary/40 to-transparent group-hover:h-12 transition-all duration-500" />
                <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-secondary/40 to-transparent group-hover:w-12 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom timeline connector */}
        <div
          className={`relative transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          {/* Vertical line */}
          <div className="w-px h-12 bg-gradient-to-b from-secondary/40 to-primary/40 mx-auto mb-6" />

          {/* Closing statement card */}
          <div className="max-w-lg mx-auto text-center bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-primary/20 rounded-2xl p-8 lg:p-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-display text-xl lg:text-2xl text-primary italic font-bold mb-2">
              Carnival Glam Hub was created to change that.
            </p>
            <p className="font-body text-sm text-muted-foreground">
              A premium experience designed to eliminate the chaos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
