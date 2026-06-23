import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Carnival Hair & Hairstyles | Headpiece-Ready | Glam Hub";
const PAGE_DESCRIPTION =
  "Carnival hair and Carnival hairstyles built to hold under feathers, wires and tropical heat — sleek ponies, voluminous curls, braided crowns and headpiece-ready installs. Trinidad, Jamaica, Barbados, Grenada, Antigua.";
const CANONICAL = "https://www.carnivalglamhub.com/services/carnival-hair";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Carnival Hair Styling",
  serviceType: "Carnival hair styling",
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
    description: "Carnival hair styling from US$180.",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      minPrice: "180",
    },
  },
};

const SCHEMA_ID = "service-carnival-hair-jsonld";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.carnivalglamhub.com/#services" },
    { "@type": "ListItem", position: 3, name: "Carnival Hair Styling", item: CANONICAL },
  ],
};

const CarnivalHair = () => {
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
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <article className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <header className="mb-10 sm:mb-14 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Service
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Carnival hair styling that{" "}
              <span className="italic text-gradient-primary">holds through the road</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival hair and Carnival hairstyles at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              are sculpted, secured and headpiece-ready — built to hold under
              feathers, wires and tropical heat, finished by professional
              stylists inside our air-conditioned lounge before you leave for
              the road.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              Carnival hair has a very specific job: stay seated under a heavy
              headpiece for ten hours, in 30+ degree heat, through rum, paint
              and constant movement. Our stylists treat it as engineering as
              much as styling — base, anchor, shape, hold — so the look you
              leave the lounge with is the look in your road photos.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What hair styles do you offer?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Sleek high pony, voluminous curl set, braided crown and feed-in
              braids, slick-back base for elaborate headpieces, half-up
              half-down with a secured front, and clean clip-in or sewn-in
              installs. Bring your headpiece so we can fit and balance the
              style around it. For inspiration, our{" "}
              <a
                href="/blogs/top-seven-best-carnival-hairstyles"
                className="text-primary hover:underline"
              >
                guide to the best carnival hairstyles
              </a>{" "}
              walks through what each style looks like on the road and which
              costume types it suits.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why carnival hair has to last
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Standard salon styling is built to last an evening. Carnival hair
              has to last a full day on the road, plus the after-party. Each
              style is built in layers: cleansed and stretched base, secured
              foundation, the visible style, and a hold layer that resists
              humidity, sweat and movement. Pins are anchored so wires and
              feathers stay put for the full route, and the front is set so
              sweat does not pull it down by midday.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How much does carnival hair cost?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival hair styling starts from US$180. Most road-day styles
              fall between US$180 and US$280 depending on length, density and
              complexity. Feed-in braids, custom installs and heavy headpiece
              integrations are quoted on consultation. Add-ons — clip-in
              lengths, custom partings, edge styling and a touch-up kit for the
              road — are priced separately on booking.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How long does the appointment take?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Plan for 60 to 120 minutes in the chair, depending on the style.
              A sleek high pony or slick-back base for a heavy headpiece is at
              the faster end. Voluminous curl sets, braided crowns and feed-in
              braids sit in the middle. Full clip-in or sewn-in installs are
              the longest. Hair is scheduled in sequence with makeup and
              getting-dressed so the morning runs to time and you leave with
              the band, not after it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How should I prep my hair before the appointment?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Wash and fully dry your hair the day before — not the morning of
              — so it has a little grip for pins and braids. Skip heavy
              leave-ins and oils; they make holds fail in heat. Bring your
              headpiece, any extensions or wefts you want used, and a clear
              reference image of the style you want. If you are unsure which
              style suits your costume, our stylists will walk through options
              when you arrive and pick the one that will photograph best with
              your headpiece in place.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Can you work around my headpiece?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Yes — and we expect to. Most road-day headpieces are heavy,
              front-loaded and pinned in from below. Bring it. The stylist
              will build the base specifically to seat it, balance the weight
              across the crown and back, and anchor the pins so the piece
              stays put when you jump, wine and bend through the route.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where can I book carnival hair?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival hair styling is available at every Carnival Glam Hub
              location. The most booked destinations are{" "}
              <a href="/trinidad" className="text-primary hover:underline">Trinidad Carnival</a>,{" "}
              <a href="/jamaica" className="text-primary hover:underline">Jamaica Carnival</a> and{" "}
              <a href="/miami" className="text-primary hover:underline">Miami Carnival</a>;
              we also work{" "}
              <a href="/barbados" className="text-primary hover:underline">Barbados</a>,{" "}
              <a href="/grenada" className="text-primary hover:underline">Grenada</a>,{" "}
              <a href="/antigua" className="text-primary hover:underline">Antigua</a>,{" "}
              <a href="/saint-lucia" className="text-primary hover:underline">Saint Lucia</a> and{" "}
              <a href="/toronto" className="text-primary hover:underline">Toronto</a>. Read more{" "}
              <a href="/about" className="text-primary hover:underline">about us</a> or check
              the <a href="/faq" className="text-primary hover:underline">FAQ</a>.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Lock your{" "}
              <span className="italic text-gradient-primary">Carnival hair</span> in
              early.
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Slots close two to three months before Carnival.
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

export default CarnivalHair;