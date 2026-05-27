import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Carnival Costume Getting-Dressed Assistance | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Professional getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars, harnesses. Included in concierge packages across Trinidad, Jamaica, Barbados, Grenada and Antigua.";
const CANONICAL = "https://www.carnivalglamhub.com/services/getting-dressed";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Carnival Costume Getting-Dressed Assistance",
  serviceType: "Carnival costume getting-dressed assistance",
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

const SCHEMA_ID = "service-getting-dressed-jsonld";

const GettingDressed = () => {
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
              Carnival costume getting-dressed,{" "}
              <span className="italic text-gradient-primary">done properly</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Modern Carnival costumes are technical pieces. Wire bras, monokini
              bases, harnesses, backpacks and standing collars need to be fitted,
              balanced and secured by someone who has done it thousands of times.{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              includes professional getting-dressed assistance in every concierge
              package.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why it matters
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              A costume that is not fitted properly will shift, dig, ride up or come
              apart on the road. A poorly seated backpack or collar will hurt within
              the first hour. Our team adjusts every piece for fit and movement
              before you leave the lounge.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What is included
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Full assembly of all costume pieces, padding and tape adjustments
              where needed, harness and backpack seating, collar and headpiece
              balancing, double-checking of every closure, and a final road-ready
              inspection.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How it speeds up the morning
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Self-dressing in a hotel room typically takes 45 to 90 minutes and
              ends in a panic. With Carnival Glam Hub, getting-dressed happens in
              sequence after glam and is completed in 20 to 30 minutes. You leave
              on time, fitted correctly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Included with concierge packages
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Getting-dressed assistance is included in every Carnival Glam Hub
              concierge package across{" "}
              <a href="/trinidad-carnival-2027" className="text-primary hover:underline">
                Trinidad
              </a>
              , Jamaica, Barbados, Grenada and Antigua. It can also be booked as a
              stand-alone service for masqueraders already booked for{" "}
              <a href="/services/carnival-makeup" className="text-primary hover:underline">
                Carnival makeup
              </a>{" "}
              elsewhere.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Stop dressing yourself in a{" "}
              <span className="italic text-gradient-primary">hotel mirror.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Let our team do it properly.
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

export default GettingDressed;