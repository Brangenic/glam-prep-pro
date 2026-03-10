import { useScrollReveal } from "@/hooks/useScrollReveal";

const painPoints = [
  "Early morning appointments across town.",
  "Running around trying to find your artist.",
  "Dressing your costume alone in a rush.",
  "Sweating before you even hit the road.",
  "By the time you reach the band, the experience already feels exhausting.",
];

const Problem = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="problem" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6 max-w-3xl text-center">
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Carnival Morning Should Feel{" "}
          <span className="italic text-gradient-primary">Exciting</span> —{" "}
          <span className="text-gradient-pink">Not Stressful</span>
        </h2>
        <p
          className={`font-body text-lg text-muted-foreground mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          The reality for many masqueraders is chaotic.
        </p>
        <div className="space-y-4 mb-12">
          {painPoints.map((point, i) => (
            <p
              key={i}
              className={`font-body text-base lg:text-lg text-foreground/65 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {point}
            </p>
          ))}
        </div>
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="w-12 h-px bg-primary mx-auto mb-8" />
          <p className="font-display text-xl text-primary italic font-bold">
            Carnival Glam Hub was created to change that.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;