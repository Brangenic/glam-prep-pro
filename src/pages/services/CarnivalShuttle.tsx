import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import YouTubeEmbed from "@/components/YouTubeEmbed";

const PAGE_TITLE =
  "Carnival Shuttle Service | Trinidad Carnival Transport | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Complimentary one-way Carnival shuttle pick-up from the Carnival Glam Hub lounge to your band's start point, included with any Carnival Glam Hub service. Available in select territories and confirmed when you book.";
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
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "0",
    availability: "https://schema.org/InStock",
    url: "https://carnivalglamhub.masos.app/events",
    description: "Complimentary one-way Carnival shuttle pick-up, included with any Carnival Glam Hub service booking.",
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
        text: "The Carnival shuttle is available in select territories and confirmed when you book.",
      },
    },
    {
      "@type": "Question",
      name: "How it works",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The shuttle is a one-way pick-up. Departures are aligned to your band's road march schedule. We collect you from the Carnival Glam Hub lounge after glam and getting-dressed, drive directly to your band's start point, and drop off as close as the police cordon permits. There is no return leg.",
      },
    },
    {
      "@type": "Question",
      name: "Booking and confirmation",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The shuttle is complimentary with any Carnival Glam Hub service you book. Departure times are confirmed by email the week of Carnival once your band's road march schedule is locked in.",
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
              Carnival Glam Hub provides a complimentary one-way Carnival shuttle pick-up from our air-conditioned lounge to your band's start point, included with any Carnival Glam Hub service you book. Available in select territories and confirmed when you book.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival shuttle service at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              is a private, scheduled one-way pick-up from our air-conditioned
              lounge to your band's start point on Carnival morning, so you
              arrive on time, in costume, and ready for the road.
            </p>
          </header>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img src="/images/services/carnival-shuttle.webp" alt="Carnival Glam Hub shuttle that collects masqueraders from the lounge and drives them to their band's start point" loading="eager" decoding="async" className="w-full h-auto sm:rounded-2xl object-cover shadow-lg" />
          </figure>

          <div className="mb-12 text-center">
            <a
              href="/booking"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where the shuttle runs
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival shuttle is available in select territories and
              confirmed when you book.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How it works
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The shuttle is a one-way pick-up. Departures are aligned to your
              band's road march schedule. We collect you from the Carnival
              Glam Hub lounge after glam and{" "}
              <a href="/services/getting-dressed" className="text-primary hover:underline">
                getting-dressed
              </a>
              , drive directly to your band's start point, and drop off as
              close as the police cordon permits. There is no return leg.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Booking and confirmation
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The shuttle is complimentary with any Carnival Glam Hub service
              you book. Departure times are confirmed by email the week of
              Carnival once your band's road march schedule is locked in.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5 text-center">
              See it in action
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <YouTubeEmbed videoId="K6xz7db1W3c" title="Carnival Glam Hub shuttle to your band" />
              <YouTubeEmbed videoId="5DaXapfF8IA" title="Carnival Glam Hub shuttle service" vertical />
            </div>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Reserve your{" "}
              <span className="italic text-gradient-primary">Carnival shuttle.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Complimentary with any Carnival Glam Hub service you book. Available in select territories and confirmed when you book.
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