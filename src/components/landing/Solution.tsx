import solutionImg from "@/assets/carnival-10.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Solution = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="experience" className="py-24 lg:py-32 overflow-hidden">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`relative aspect-[3/4] lg:aspect-square rounded-3xl overflow-hidden transition-all duration-1000 gold-glow ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <img
              src={solutionImg}
              alt="Carnival Glam Hub makeup artist applying sweat-proof glam on a masquerader before the road"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-primary/10">
              <p className="font-body text-xs text-primary font-medium uppercase tracking-wider">The Glam Hub Difference</p>
              <p className="font-body text-sm text-foreground/80 mt-1">Full-service. Concierge-style. Stress-free.</p>
            </div>
          </div>
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">The Experience</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              A Complete Carnival Morning{" "}
              <span className="text-gradient-primary italic">Experience</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              Carnival Glam Hub is more than a makeup appointment. It is a
              full-service preparation experience designed to make sure you feel
              confident, relaxed, and fully ready before you step onto the road.
            </p>
            <p className="font-body text-lg text-foreground/70 leading-relaxed">
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