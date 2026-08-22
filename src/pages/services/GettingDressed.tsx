import { BOOKING_URL } from "@/lib/constants";
import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import YouTubeEmbed from "@/components/YouTubeEmbed";

const PAGE_TITLE =
  "Carnival Costume Getting-Dressed Assistance | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Professional getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars, harnesses. Free with any Carnival Glam Hub service, US$35 stand-alone, at our Full Service Glam Hubs in Trinidad, Jamaica and Miami.";
const CANONICAL = "https://www.carnivalglamhub.com/services/getting-dressed";




const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why getting-dressed help matters",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A costume that is not fitted properly will shift, dig, ride up or come apart on the road. A poorly seated backpack or collar will hurt within the first hour. Gem fixes, zip breaks and last-minute alterations are the most common reasons masqueraders miss their band's start. Our team adjusts every piece for fit and movement — and our seamstress repairs anything that needs a needle — before you leave the lounge.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in your getting-dressed appointment",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full assembly of all costume pieces, padding and tape adjustments where needed, harness and backpack seating, collar and headpiece balancing, on-site seamstress for gem replacement, strap shortening and emergency zip and seam repairs, double-checking of every closure, and a final road-ready inspection.",
      },
    },
    {
      "@type": "Question",
      name: "How it speeds up the morning",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Self-dressing in a hotel room typically takes 45 to 90 minutes and ends in a panic. With Carnival Glam Hub, getting-dressed happens in sequence after glam and is completed in 20 to 30 minutes. You leave on time, fitted correctly.",
      },
    },
    {
      "@type": "Question",
      name: "What if a costume piece breaks at the lounge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "That is exactly what the on-site seamstress is there for. The most common morning-of failures — a wire bra cup that has collapsed, a gem cluster that has dropped overnight, a strap that is too long, a zip that splits when you raise your arms — all get handled in the lounge before you leave. We keep matching gem packs, thread, elastic and trim on hand so the repair looks like part of the costume, not a patch job.",
      },
    },
    {
      "@type": "Question",
      name: "What should I bring to my appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every piece of your costume, in the original packaging if you still have it — including the headpiece, arm and leg pieces, stockings, any padding and the standing collar. Bring road shoes you have already broken in, plus a change of clothes for after. We supply tape, pins, padding and small repair kit; you do not need to bring those.",
      },
    },
    {
      "@type": "Question",
      name: "Can the seamstress alter a costume that does not fit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most modern band costumes, yes — within reason. Straps can be shortened, padding added, wire bras re-shaped, monokini bases taken in slightly, and gem clusters re-attached or replaced. Full re-cuts of a beaded panel or structural changes to a backpack are not road-morning jobs; flag those at the fitting in advance. The aim is a costume that holds its shape and does not bite into you for ten hours, not a rebuild.",
      },
    },
    {
      "@type": "Question",
      name: "How much does getting-dressed help cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting-dressed assistance is included free with any Carnival Glam Hub service. It is US$35 as a stand-alone for masqueraders who bring their own artist.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I book getting-dressed help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting-dressed assistance is a Full Service Glam Hub inclusion, available in Trinidad, Jamaica and Miami. Glam Hub Lite territories do not offer getting dressed or seamstress support; they cover makeup, photoshoot, a changing room, and coffee, tea and light refreshments. It pairs with Carnival makeup and the Carnival photoshoot in the same morning slot.",
      },
    },
  ],
};

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
              Carnival costume getting-dressed,{" "}
              <span className="italic text-gradient-primary">done properly</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed mb-5 font-medium">
              Carnival Glam Hub provides hands-on Carnival costume getting-dressed and on-site seamstress support, included free with any Carnival Glam Hub service and US$35 as a stand-alone, at our Full Service Glam Hubs in Trinidad, Jamaica and Miami.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Getting-dressed assistance at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              is hands-on help fitting your modern Carnival costume, by trained
              dressers who balance wire bras, monokini bases, harnesses,
              backpacks and standing collars so nothing shifts on the road. It is
              included free with any Carnival Glam Hub service.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              An on-site seamstress works alongside the dressing team for the
              things a hotel room cannot fix: a wire bra that pinches, a gem
              that has fallen off overnight, a strap that needs shortening, a
              zip that gives way an hour before the band leaves. You walk in
              with a costume; you walk out road-ready.
            </p>
          </header>

          <div className="mb-12 text-center">
            <a
              href={BOOKING_URL} target="_blank" rel="noopener"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src="/images/services/getting-dressed-hero.jpg"
              alt="Carnival Glam Hub dressing assistant helping a masquerader into her costume"
              loading="eager"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl object-cover shadow-lg"
            />
          </figure>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why getting-dressed help matters
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              A costume that is not fitted properly will shift, dig, ride up or
              come apart on the road. A poorly seated backpack or collar will
              hurt within the first hour. Gem fixes, zip breaks and last-minute
              alterations are the most common reasons masqueraders miss their
              band's start. Our team adjusts every piece for fit and movement —
              and our seamstress repairs anything that needs a needle — before
              you leave the lounge.
            </p>
          </section>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img src="/images/services/getting-dressed-2.webp" alt="Carnival Glam Hub dresser securing a masquerader's costume before the road" loading="lazy" decoding="async" className="w-full h-auto sm:rounded-2xl object-cover shadow-lg" />
          </figure>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What's included in your getting-dressed appointment
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Full assembly of all costume pieces, padding and tape adjustments
              where needed, harness and backpack seating, collar and headpiece
              balancing, on-site seamstress for gem replacement, strap
              shortening and emergency zip and seam repairs, double-checking of
              every closure, and a final road-ready inspection.
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
              What if a costume piece breaks at the lounge?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              That is exactly what the on-site seamstress is there for. The
              most common morning-of failures — a wire bra cup that has
              collapsed, a gem cluster that has dropped overnight, a strap
              that is too long, a zip that splits when you raise your arms —
              all get handled in the lounge before you leave. We keep
              matching gem packs, thread, elastic and trim on hand so the
              repair looks like part of the costume, not a patch job.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What should I bring to my appointment?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every piece of your costume, in the original packaging if you
              still have it — including the headpiece, arm and leg pieces,
              stockings, any padding and the standing collar. Bring road shoes
              you have already broken in, plus a change of clothes for after.
              We supply tape, pins, padding and small repair kit; you do not
              need to bring those.
            </p>
          </section>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img src="/images/services/getting-dressed-6.webp" alt="Final road-ready costume check during getting-dressed at Carnival Glam Hub" loading="lazy" decoding="async" className="w-full h-auto sm:rounded-2xl object-cover shadow-lg" />
          </figure>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Can the seamstress alter a costume that does not fit?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              For most modern band costumes, yes — within reason. Straps can
              be shortened, padding added, wire bras re-shaped, monokini
              bases taken in slightly, and gem clusters re-attached or
              replaced. Full re-cuts of a beaded panel or structural changes
              to a backpack are not road-morning jobs; flag those at the
              fitting in advance. The aim is a costume that holds its shape
              and does not bite into you for ten hours, not a rebuild.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How much does getting-dressed help cost?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Getting-dressed assistance is included free with any Carnival
              Glam Hub service. It is US$35 as a stand-alone for masqueraders
              who bring their own artist. No tiers, no add-on surcharges.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where can I book getting-dressed help?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Getting-dressed assistance is a Full Service Glam Hub
              inclusion, available in{" "}
              <a href="/trinidad" className="text-primary hover:underline">Trinidad Carnival</a>,{" "}
              <a href="/jamaica" className="text-primary hover:underline">Jamaica Carnival</a> and{" "}
              <a href="/miami" className="text-primary hover:underline">Miami Carnival</a>.
              Glam Hub Lite territories such as{" "}
              <a href="/barbados" className="text-primary hover:underline">Barbados</a>,{" "}
              <a href="/grenada" className="text-primary hover:underline">Grenada</a>,{" "}
              <a href="/antigua" className="text-primary hover:underline">Antigua</a>,{" "}
              <a href="/saint-lucia" className="text-primary hover:underline">Saint Lucia</a> and{" "}
              <a href="/toronto" className="text-primary hover:underline">Toronto</a> do not
              offer getting dressed or seamstress support; they cover makeup, photoshoot and
              reels, a changing room, and coffee, tea and light refreshments. It pairs with{" "}
              <a href="/services/carnival-makeup" className="text-primary hover:underline">
                Carnival makeup
              </a>{" "}
              and the{" "}
              <a href="/services/carnival-photoshoot" className="text-primary hover:underline">
                Carnival photoshoot
              </a>{" "}
              in the same morning slot. See the{" "}
              <a href="/faq" className="text-primary hover:underline">FAQ</a> for details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5 text-center">
              See it in action
            </h2>
            <YouTubeEmbed videoId="pHGdlC2jyLw" title="Getting dressed for Carnival with Carnival Glam Hub" />
          </section>
          <RelatedLinks />
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
              href={BOOKING_URL} target="_blank" rel="noopener"
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