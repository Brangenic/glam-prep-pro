import solutionImg from "@/assets/solution-reveal.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Solution = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="experience" className="py-24 lg:py-32 overflow-hidden">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`relative aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <img
              src={solutionImg}
              alt="Makeup artist preparing masquerader"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-8">
              A Complete Carnival Morning{" "}
              <span className="text-gradient-primary">Experience</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              Carnival Glam Hub is more than a makeup appointment. It is a
              full-service preparation experience designed to make sure you feel
              confident, relaxed, and fully ready before you step onto the road.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Our team handles every detail so you arrive looking polished,
              prepared, and camera-ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
