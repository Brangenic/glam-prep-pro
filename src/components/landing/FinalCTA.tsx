import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import TerritoryBookingRow from "@/components/booking/TerritoryBookingRow";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteConfig();

  return (
    <section id="book" className="section-y relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div ref={ref} className="relative container mx-auto px-4 sm:px-6 text-center max-w-2xl">
        <h2
          id="cta-heading"
          className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {get("cta_headline").replace(/Glam Slot/, "")}
          <span className="text-gradient-primary italic">Glam Slot</span>
        </h2>
        <p
          className={`font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {get("cta_description")}
        </p>
        <div
          className={`flex flex-col items-center gap-4 sm:gap-5 justify-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-full max-w-xl mx-auto">
            <TerritoryBookingRow tone="light" campaign="closing_card" heading={get("cta_button_text")} />
          </div>
          <a
            href="#destinations"
            className="inline-flex items-center justify-center gap-2 border border-primary/30 text-primary font-body font-medium text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-primary/10 transition-all"
          >
            View Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
