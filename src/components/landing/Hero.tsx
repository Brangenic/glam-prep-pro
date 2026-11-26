import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useEffect } from "react";
import TerritoryBookingRow from "@/components/booking/TerritoryBookingRow";
import { BOOK_TERRITORY_ANCHOR } from "@/lib/bookingBar";
import { Link } from "react-router-dom";
import { HOME_COVERAGE_PATH, HOME_FACES_PROOF, HOME_FEATURED_OUTLET } from "@/data/homeProof";

const HERO_768 = "/hero-768.webp";
const HERO_1280 = "/hero-1280.webp";
const HERO_1920 = "/hero-1920.webp";

const Hero = () => {
  const { get } = useSiteConfig();

  // A "Book Now" from another page lands on /#book-territory. The row is
  // rendered after load, so scroll to it once it exists.
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== `#${BOOK_TERRITORY_ANCHOR}`) return;
    document.getElementById(BOOK_TERRITORY_ANCHOR)?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <img
        src={HERO_1280}
        srcSet={`${HERO_768} 768w, ${HERO_1280} 1280w, ${HERO_1920} 1920w`}
        sizes="100vw"
        width={1920}
        height={1080}
        alt="Carnival masquerader with golden feather headdress and rhinestone costume, Carnival Glam Hub"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
      <div className="relative z-10 container mx-auto px-5 sm:px-6 pt-24 pb-28 sm:pt-36 sm:pb-24 lg:pt-32 lg:pb-16 text-center flex flex-col items-center">
        <div className="max-w-2xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary font-medium drop-shadow-lg">
              Now Booking
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
          {/* Territory row sits inside the hero, under the headline, so it is
              in view on a phone without pushing the headline off screen.
              Each button goes straight to that territory's MasOS event. */}
          <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <TerritoryBookingRow anchor campaign="home_booking_bar" heading={get("hero_cta_text")} />
            <p data-home-proof="hero" className="mt-2 text-center font-body text-xs leading-5 text-hero-muted-foreground">
              {HOME_FACES_PROOF}{HOME_FEATURED_OUTLET && <> · <Link to={HOME_COVERAGE_PATH} className="hover:underline underline-offset-2">Featured in {HOME_FEATURED_OUTLET}</Link></>}
            </p>
            <a
              href="#destinations"
              className="mt-4 inline-flex items-center justify-center gap-2 border border-white/30 text-white font-body font-medium text-sm px-6 sm:px-8 py-3 rounded-full hover:bg-white/10 transition-all"
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
