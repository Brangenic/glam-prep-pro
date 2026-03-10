import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="book" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background pointer-events-none" />
      <div ref={ref} className="relative container mx-auto px-6 text-center max-w-2xl">
        <p
          className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Limited Availability
        </p>
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Secure Your Carnival{" "}
          <span className="text-gradient-primary">Glam Slot</span>
        </h2>
        <p
          className={`font-body text-lg text-muted-foreground leading-relaxed mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Carnival morning appointments are limited and typically sell out early.
          Reserve your spot now to ensure a smooth, stress-free start to your
          Carnival day.
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="#destinations"
            className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-bold text-lg px-10 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Book Your Glam Appointment
          </a>
          <a
            href="#destinations"
            className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground font-display font-bold text-sm px-8 py-4 rounded-lg hover:border-secondary hover:text-secondary transition-colors"
          >
            View Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
