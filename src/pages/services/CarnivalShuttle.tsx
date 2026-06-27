import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Carnival Shuttle Service | Trinidad Carnival Transport | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Carnival shuttle service from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed; additional territories available seasonally. Group capacity available.";
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
    price: "35",
    availability: "https://schema.org/InStock",
    url: "https://carnivalglamhub.masos.app/events",
    description: "Carnival shuttle service from US$35.",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      minPrice: "35",
    },
  },
};

const SCHEMA_ID = "service-carnival-shuttle-jsonld";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.carnivalglamhub.com/#services" },
    { "@type": "ListItem", position: 3, name: "Carnival Shuttle", item: CANONICAL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where the shuttle runs",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Carnival shuttle is confirmed in Trinidad for Trinidad Carnival 2027. Availability in Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Miami and Toronto varies by season and band partnerships; see the FAQ or confirm at booking.",
      },
    },
    {
      "@type": "Question",
      name: "How it works",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shuttle departures are aligned to your band's road march schedule. We collect you from the Carnival Glam Hub lounge after glam and getting-dressed, drive directly to your band's start point, and drop off as close as the police cordon permits.",
      },
    },
    {
      "@type": "Question",
      name: "Group capacity",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vehicles range from private cars for two to four masqueraders, up to mini-coaches for a full group of friends booked together. Reserve the full vehicle to keep your group together on the morning.",
      },
    },
    {
      "@type": "Question",
      name: "Booking and confirmation",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shuttle is an add-on at booking. Departure times are confirmed by email the week of Carnival once your band's road march schedule is locked in.",
      },
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed mb-5 font-medium">
              Carnival Glam Hub provides private Carnival shuttle transport from our air-conditioned lounge to your band start-point, included in road-ready concierge packages from US$35, available across Trinidad, Jamaica, Barbados, Grenada and Antigua.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival shuttle service at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              is private, scheduled transport from our air-conditioned lounge
              to your band's start point on Carnival morning, so you arrive
              on time, in costume, and ready for the road.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where the shuttle runs
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival shuttle is confirmed in Trinidad for{" "}
              <a href="/trinidad-carnival-2027" className="text-primary hover:underline">
                Trinidad Carnival 2027
              </a>
              . Availability in{" "}
              <a href="/jamaica" className="text-primary hover:underline">Jamaica</a>,{" "}
              <a href="/barbados" className="text-primary hover:underline">Barbados</a>,{" "}
              <a href="/grenada" className="text-primary hover:underline">Grenada</a>,{" "}
              <a href="/antigua" className="text-primary hover:underline">Antigua</a>,{" "}
              <a href="/saint-lucia" className="text-primary hover:underline">Saint Lucia</a>,{" "}
              <a href="/miami" className="text-primary hover:underline">Miami</a> and{" "}
              <a href="/toronto" className="text-primary hover:underline">Toronto</a> varies
              by season and band partnerships; see the{" "}
              <a href="/faq" className="text-primary hover:underline">FAQ</a> or confirm at booking.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How it works
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Shuttle departures are aligned to your band's road march
              schedule. We collect you from the Carnival Glam Hub lounge after
              glam and{" "}
              <a href="/services/getting-dressed" className="text-primary hover:underline">
                getting-dressed
              </a>
              , drive directly to your band's start point, and drop off as
              close as the police cordon permits.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Group capacity
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Vehicles range from private cars for two to four masqueraders, up
              to mini-coaches for a full group of friends booked together.
              Reserve the full vehicle to keep your group together on the
              morning.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Booking and confirmation
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Shuttle is an add-on at booking. Departure times are confirmed
              by email the week of Carnival once your band's road march
              schedule is locked in.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Reserve your{" "}
              <span className="italic text-gradient-primary">Carnival shuttle.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Vehicles fill before glam slots; book together with your group.
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