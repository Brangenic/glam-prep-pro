import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Carnival Shuttle Service | Trinidad Carnival Transport | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Carnival shuttle from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed for 2027; additional territories seasonal.";
const CANONICAL = "https://www.carnivalglamhub.com/services/carnival-shuttle";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Carnival Shuttle Service",
  serviceType: "Carnival shuttle service",
  url: CANONICAL,
  description: PAGE_DESCRIPTION,
  provider: {
    "@type": "Organization",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
  },
  areaServed: [
    "Trinidad and Tobago",
    "Jamaica",
    "Barbados",
    "Grenada",
    "Antigua and Barbuda",
  ],
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.carnivalglamhub.com/booking",
  },
};

const SCHEMA_ID = "service-carnival-shuttle-jsonld";

const CarnivalShuttle = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (prev === null) tag?.remove();
        else tag?.setAttribute("content", prev);
      };
    };

    const restorers: Array<() => void> = [];
    restorers.push(setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE));
    restorers.push(setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", CANONICAL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "website"));

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    let script = document.getElementById(SCHEMA_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCHEMA_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(serviceSchema);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (previousCanonical !== null) canonical?.setAttribute("href", previousCanonical);
      else canonical?.remove();
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <article className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <header className="mb-10 sm:mb-14 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Service
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Carnival shuttle,{" "}
              <span className="italic text-gradient-primary">from the lounge to the road</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              runs a dedicated Carnival shuttle so masqueraders move from the
              air-conditioned lounge to their band's start point with the costume
              intact and the morning on schedule.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where the shuttle runs
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Confirmed for{" "}
              <a href="/trinidad-carnival-2027" className="text-primary hover:underline">
                Trinidad Carnival 2027
              </a>{" "}
              between the Carnival Glam Hub lounge and each major band's stated
              start point. Additional territories (Jamaica, Barbados, Grenada,
              Antigua) are seasonal and confirmed at booking.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How it works
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Your shuttle slot is tied to your glam appointment. After makeup,
              hair and getting-dressed, you are escorted directly to a private
              vehicle and dropped at your band's meeting point. Drivers are
              briefed on the road schedule so departures are timed against the
              parade, not the clock alone.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Group capacity
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Solo seats, paired seats, and small private group bookings up to
              six. Larger crews can request a dedicated vehicle at booking;
              availability depends on territory and date.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Booking and confirmation
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The shuttle is bookable as an add-on to any Carnival Glam Hub
              package. Routes and pick-up windows are confirmed by email at
              least two weeks before Carnival, with a final confirmation the
              evening before the road.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Add the{" "}
              <span className="italic text-gradient-primary">shuttle</span> to your booking.
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Capacity is limited and shuttle slots close before glam slots.
            </p>
            <a
              href="/booking"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default CarnivalShuttle;