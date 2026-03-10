import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="book" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div ref={ref} className="relative container mx-auto px-6 text-center max-w-2xl">
        <div className={`inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-body text-xs uppercase tracking-[0.15em] text-secondary font-medium">Limited Availability</span>
        </div>
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Secure Your Carnival{" "}
          <span className="text-gradient-primary italic">Glam Slot</span>
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
            className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-body font-semibold text-lg px-10 py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Book Your Glam Appointment
          </a>
          <a
            href="#destinations"
            className="inline-flex items-center justify-center gap-2 border border-primary/30 text-primary font-body font-medium text-sm px-8 py-4 rounded-full hover:bg-primary/10 transition-all"
          >
            View Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;