import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteConfig();

  return (
    <section id="book" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div ref={ref} className="relative container mx-auto px-4 sm:px-6 text-center max-w-2xl">
        <div className={`inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 mb-6 sm:mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
          <span className="font-body text-xs uppercase tracking-[0.15em] text-secondary font-medium">Limited Availability</span>
        </div>
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
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-mcp-action="register-event"
            data-mcp-description="Register and pay a deposit for a Carnival Glam Hub event, by territory and date."
            onClick={() => {
              if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
                window.gtag("event", "conversion", {
                  send_to: "AW-10894663311/zIoVCMj-iLAcEI-9_coo",
                  value: 1.0,
                  currency: "USD",
                });
              }
            }}
            className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-body font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {get("cta_button_text")}
          </a>
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
