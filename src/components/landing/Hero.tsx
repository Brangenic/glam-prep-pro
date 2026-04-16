import heroBg from "@/assets/hero-new.jpg";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const Hero = () => {
  const { get } = useSiteConfig();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <img
        src={heroBg}
        alt="Carnival masquerader with golden feather headdress and rhinestone costume — Carnival Glam Hub"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
      <div className="relative z-10 container mx-auto px-5 sm:px-6 py-24 sm:py-32 lg:py-0 text-center flex flex-col items-center">
        <div className="max-w-2xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary font-medium drop-shadow-lg">
              Now Booking — Limited Slots
            </span>
          </div>
          <h1 id="hero-heading" className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-5 sm:mb-6 animate-fade-up text-white">
            {get("hero_headline").replace(/Starts Here/, (m: string) => "")}
            <span className="text-gradient-primary italic">Starts Here</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-3 max-w-lg animate-fade-up" style={{ animationDelay: "0.15s" }}>
            {get("hero_subtitle")}
          </p>
          <p className="font-body text-sm text-white/60 leading-relaxed mb-8 sm:mb-10 max-w-lg animate-fade-up" style={{ animationDelay: "0.25s" }}>
            {get("hero_subtext")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-body font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all group"
            >
              {get("hero_cta_text")}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#destinations"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-body font-medium text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Choose Your Destination
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
