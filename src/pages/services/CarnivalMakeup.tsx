import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE = "Sweat-Resistant Carnival Makeup | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Sweat-resistant Carnival makeup that holds through the road. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua. Trusted by 15,000+ since 2017.";
const CANONICAL = "https://www.carnivalglamhub.com/services/carnival-makeup";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sweat-Resistant Carnival Makeup",
  serviceType: "Carnival makeup",
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
    price: "160",
    availability: "https://schema.org/InStock",
    url: "https://carnivalglamhub.masos.app/events",
    description:
      "Professional Carnival makeup from US$160; celebrity-artist glam US$250–US$350; premium looks up to US$2,000.",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      minPrice: "160",
      maxPrice: "2000",
    },
  },
};

const SCHEMA_ID = "service-carnival-makeup-jsonld";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.carnivalglamhub.com/#services" },
    { "@type": "ListItem", position: 3, name: "Carnival Makeup", item: CANONICAL },
  ],
};

// FAQ pairs mirror the visible question H2s and the answer paragraphs
// rendered below. Keep these in sync with the on-page copy.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What's included in your Carnival makeup",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Skin prep and priming, full base with sweat-resistant foundation and concealer, contour and highlight, eye look with adhesive lash or strip lash, brow shaping, lip finish, and a final setting layer designed to hold through the parade. Each session runs around 90 minutes per masquerader and is delivered inside the Carnival Glam Hub air-conditioned lounge.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Carnival makeup cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing is tiered so you can choose the level of artistry you want for the morning. The road-ready access package — getting-dressed help, shuttle and the lounge — starts at US$35. Professional Carnival makeup starts from US$160, which is what most first-time masqueraders book. Celebrity-artist glam, with one of our senior MUAs who works with soca artists and band launches, runs US$250 to US$350. Premium and editorial looks — heavy beadwork, crystal application, custom skin art — go up to US$2,000. Add-ons such as airbrush, body shimmer and second-day touch-ups are quoted separately on booking.",
      },
    },
    {
      "@type": "Question",
      name: "Airbrush vs traditional Carnival makeup",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both work for the road; the right choice depends on your skin and your costume. Traditional application, layered with a long-wear foundation and locked down with a setting spray, gives a fuller, more sculpted finish and is easier to touch up mid-route. Airbrush gives a lighter, second-skin finish that photographs beautifully and tends to suit oilier skin in extreme heat, but it is harder to repair if a feather brushes your cheek. Our artists will recommend the right route once they see your costume, skin type and the kind of photos you want.",
      },
    },
    {
      "@type": "Question",
      name: "How long does Carnival makeup actually last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A properly built road look is designed to hold for ten to twelve hours of dancing in tropical heat — from your morning departure through the last truck. The base is the part that matters most: priming, layering and setting are what stop the foundation breaking up around the nose, forehead and chest by midday. Eye looks, lashes and lips are reinforced with road-tested products and locked down at the end. We pack a small touch-up kit on request for blot-and-go fixes on the route, but most masqueraders never reach for it.",
      },
    },
    {
      "@type": "Question",
      name: "How do I prepare for my appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Arrive on a clean face — no SPF, no primer, no leftover product. Eat something before you get to the lounge; sessions run around 90 minutes and you will sit through hair and getting-dressed after. Bring your headpiece, any reference photos you want the artist to see, and your costume so the artist can match base tones and shimmer to it. If you wear contact lenses, put them in before the eye look. Lash strips and adhesives are provided; if you have a preferred brand, bring it.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I book Carnival makeup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Available at every Carnival Glam Hub location. The three most booked are Trinidad Carnival, Jamaica Carnival and Miami Carnival; we also operate in Barbados, Grenada, Antigua, Saint Lucia and Toronto. See the FAQ for booking details and about us for the story.",
      },
    },
  ],
};

const CarnivalMakeup = () => {
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

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (previousCanonical !== null) canonical?.setAttribute("href", previousCanonical);
      else canonical?.remove();
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
              Sweat-resistant Carnival makeup,{" "}
              <span className="italic text-gradient-primary">built for the road</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed mb-5 font-medium">
              Carnival Glam Hub provides sweat-resistant professional Carnival makeup from US$160 (road-ready access from US$35), delivered in our air-conditioned lounges across Trinidad, Jamaica, Barbados, Grenada, Saint Lucia, Antigua, Guyana and Miami.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival makeup at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              is sweat-resistant makeup designed for the road, applied by
              professional MUAs in our air-conditioned lounge. It is engineered
              for tropical heat, hours of dancing and full-day costume wear,
              and has been tested by 15,000+ masqueraders since 2017.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              Professional Carnival makeup at Carnival Glam Hub starts from
              US$160. Most masqueraders spend US$200 to US$300, with
              celebrity-artist and premium looks ranging up to US$2,000. A
              road-ready access package (getting dressed, shuttle and lounge)
              starts at US$35.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What's included in your Carnival makeup
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Skin prep and priming, full base with sweat-resistant foundation and
              concealer, contour and highlight, eye look with adhesive lash or strip
              lash, brow shaping, lip finish, and a final setting layer designed to
              hold through the parade. Each session runs around 90 minutes per
              masquerader and is delivered inside the Carnival Glam Hub
              air-conditioned lounge.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How much does Carnival makeup cost?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Pricing is tiered so you can choose the level of artistry you want
              for the morning. The road-ready access package — getting-dressed
              help, shuttle and the lounge — starts at US$35. Professional
              Carnival makeup starts from US$160, which is what most first-time
              masqueraders book. Celebrity-artist glam, with one of our senior
              MUAs who works with soca artists and band launches, runs US$250 to
              US$350. Premium and editorial looks — heavy beadwork, crystal
              application, custom skin art — go up to US$2,000. Add-ons such as
              airbrush, body shimmer and second-day touch-ups are quoted
              separately on booking.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Airbrush vs traditional Carnival makeup
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Both work for the road; the right choice depends on your skin and
              your costume. Traditional application, layered with a long-wear
              foundation and locked down with a setting spray, gives a fuller,
              more sculpted finish and is easier to touch up mid-route. Airbrush
              gives a lighter, second-skin finish that photographs beautifully
              and tends to suit oilier skin in extreme heat, but it is harder
              to repair if a feather brushes your cheek. Our artists will
              recommend the right route once they see your costume, skin type
              and the kind of photos you want.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How long does Carnival makeup actually last?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              A properly built road look is designed to hold for ten to twelve
              hours of dancing in tropical heat — from your morning departure
              through the last truck. The base is the part that matters most:
              priming, layering and setting are what stop the foundation
              breaking up around the nose, forehead and chest by midday. Eye
              looks, lashes and lips are reinforced with road-tested products
              and locked down at the end. We pack a small touch-up kit on
              request for blot-and-go fixes on the route, but most masqueraders
              never reach for it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How do I prepare for my appointment?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Arrive on a clean face — no SPF, no primer, no leftover product.
              Eat something before you get to the lounge; sessions run around
              90 minutes and you will sit through hair and getting-dressed
              after. Bring your headpiece, any reference photos you want the
              artist to see, and your costume so the artist can match base
              tones and shimmer to it. If you wear contact lenses, put them in
              before the eye look. Lash strips and adhesives are provided; if
              you have a preferred brand, bring it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why sweat-resistant matters
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Caribbean Carnival happens in 30+ degree heat with no shade, full-volume
              dancing and constant body contact with feathers, wires and other
              masqueraders. Standard event or bridal makeup will slide, transfer or
              break apart within an hour. Our system is layered specifically for that
              environment.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What we use
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Long-wear, sweat-resistant professional brands selected and rotated
              based on skin tone, oil level and personal preference. We finish every
              look with a road-proof setting layer that locks the base in place.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Pair it with the photoshoot
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival makeup pairs naturally with the in-house{" "}
              <a
                href="/services/carnival-photoshoot"
                className="text-primary hover:underline"
              >
                Carnival photoshoot
              </a>
              , captured before you leave for the road while the look is at its peak.
              See the photoshoot service for details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where can I book Carnival makeup?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Available at every Carnival Glam Hub location. The three most
              booked are{" "}
              <a href="/trinidad" className="text-primary hover:underline">Trinidad Carnival</a>,{" "}
              <a href="/jamaica" className="text-primary hover:underline">Jamaica Carnival</a> and{" "}
              <a href="/miami" className="text-primary hover:underline">Miami Carnival</a>;
              we also operate in{" "}
              <a href="/barbados" className="text-primary hover:underline">Barbados</a>,{" "}
              <a href="/grenada" className="text-primary hover:underline">Grenada</a>,{" "}
              <a href="/antigua" className="text-primary hover:underline">Antigua</a>,{" "}
              <a href="/saint-lucia" className="text-primary hover:underline">Saint Lucia</a> and{" "}
              <a href="/toronto" className="text-primary hover:underline">Toronto</a>. See the{" "}
              <a href="/faq" className="text-primary hover:underline">FAQ</a> for booking
              details and{" "}
              <a href="/about" className="text-primary hover:underline">about us</a> for the story.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Lock in your{" "}
              <span className="italic text-gradient-primary">Carnival makeup slot.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Spaces sell out months in advance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/booking"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Book now
              </a>
              <a
                href="/about"
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                See all services →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default CarnivalMakeup;