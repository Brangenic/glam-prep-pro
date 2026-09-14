import { BOOKING_URL } from "@/lib/constants";
import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import YouTubeEmbed from "@/components/YouTubeEmbed";

const PAGE_TITLE =
  "Carnival Photoshoot | Costume Photography | Glam Hub";
const PAGE_DESCRIPTION =
  "Professional Carnival photoshoot shot outdoors in the garden or by the water, with 3 professionally edited photos delivered in 36 to 48 hours. Trinidad, Jamaica, Barbados, Grenada, Antigua.";
const CANONICAL = "https://www.carnivalglamhub.com/services/carnival-photoshoot";




const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What's included in your Carnival photoshoot",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A dedicated outdoor photography session on the morning of Carnival with directed posing for your costume. Every shoot is done outdoors, in the garden or by a water feature such as a hotel pool or the beach, depending on your location, with professional editing afterward. You receive 3 professionally edited photos delivered within 36 to 48 hours.",
      },
    },
    {
      "@type": "Question",
      name: "When does the shoot happen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before you hit the road. The shoot is scheduled into the concierge timeline immediately after makeup, hair and getting-dressed, while the look is at its absolute peak and before anything has been touched by the sun. The photographer works around your band's departure window so nothing is rushed. Most masqueraders are in front of the camera between 5am and 8am, depending on territory and band.",
      },
    },
    {
      "@type": "Question",
      name: "How long until you see the photos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fast. You receive 3 professionally edited photos within 36 to 48 hours of your shoot.",
      },
    },
    {
      "@type": "Question",
      name: "Who is behind the camera?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Carnival Glam Hub works with a small bench of in-house Carnival photographers who shoot the morning every year. They know how to direct posing for wire bras and backpacks, where to stand so feathers do not eat the frame, and how to read the early-morning light outside the lounge. You are not handing your costume to someone shooting their first parade.",
      },
    },
    {
      "@type": "Question",
      name: "Can we do couples, group or band-section shoots?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Couples and small groups are common, best friends, sister duos, full sections. Group shoots are scheduled into the morning timeline so glam finishes in sequence and everyone hits the camera together at peak. Larger band-section shoots need to be flagged at booking so we hold the photographer and the shoot window.",
      },
    },
    {
      "@type": "Question",
      name: "What should I bring?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your costume, your headpiece, any reference shots you want to recreate, and a charged phone for the quick-turn selects. The lounge handles styling tape, pins and small repairs, so you do not need to bring those.",
      },
    },
    {
      "@type": "Question",
      name: "Why a pre-road shoot beats road snaps",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On the road the light is harsh, the costume is dusty by midday, the makeup is past its peak and you are surrounded by thousands of other masqueraders. Phone snaps from friends are great for memories but they will not match what the section looked like when you put it on at 5am. The shoot exists for that window: directed posing outdoors, the right light, the headpiece seated properly, every gem still in place. It is the difference between a frame you will reprint and a camera roll you will scroll past.",
      },
    },
    {
      "@type": "Question",
      name: "How are the photos delivered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You receive 3 professionally edited, high-resolution photos delivered digitally within 36 to 48 hours of your shoot, ready to post and to print. Additional edited images from your session are available on request.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the Carnival photoshoot cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Carnival photoshoot starts from US$140 as a stand-alone session and is discounted when bundled with Carnival makeup, hair and getting-dressed. Final pricing varies by territory and photographer.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I book the Carnival photoshoot?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Available across every Carnival Glam Hub location. The most booked photoshoots are Trinidad Carnival, Jamaica Carnival and Miami Carnival; we also shoot Barbados, Grenada, Antigua, Saint Lucia and Toronto.",
      },
    },
  ],
};

const CarnivalPhotoshoot = () => {
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
              Professional Carnival photoshoot,{" "}
              <span className="italic text-gradient-primary">captured before the road</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed mb-5 font-medium">
              Carnival Glam Hub provides on-site professional Carnival photoshoots from US$140, captured the morning of the parade in our lounges across Trinidad, Jamaica, Barbados, Grenada, Saint Lucia, Antigua, Guyana and Miami.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              A Carnival photoshoot at{" "}
              <a href="/about" className="text-primary hover:underline">
                Carnival Glam Hub
              </a>{" "}
              is a professional photography session of you in full costume,
              captured on-site the morning of the parade while makeup, hair and
              costume are at their peak, and delivered to a private gallery
              after Carnival.
            </p>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mt-4">
              This is the only window of the day your costume, glam and energy
              all look exactly the way you imagined when you bought the
              section. Phone snaps in a hotel mirror will not do it justice.
              Our in-house photographers capture you outdoors, in the garden
              or by a water feature, with directed posing, the right light
              and full editorial editing, before you step into the band.
            </p>
          </header>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src="/images/services/photoshoot-hero.jpg"
              width={1125}
              height={1325}
              alt="Pre-road Carnival photoshoot at Saint Lucia Carnival by Carnival Glam Hub"
              loading="eager"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl object-cover shadow-lg"
            />
          </figure>

          <div className="mb-12 text-center">
            <a
              href={BOOKING_URL} target="_blank" rel="noopener"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What's included in your Carnival photoshoot
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              A dedicated outdoor photography session on the morning of Carnival with
              directed posing for your costume. Every shoot is done outdoors, in the
              garden or by a water feature such as a hotel pool or the beach, depending
              on your location, with professional editing afterward. You receive 3
              professionally edited photos delivered within 36 to 48 hours.
            </p>
          </section>

          <figure className="mb-8 -mx-4 sm:mx-0">
            <img
              src="/images/services/photoshoot-1.jpg"
              width={1130}
              height={1409}
              alt="Masquerader in full costume during a Carnival Glam Hub pre-road photoshoot"
              loading="lazy"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl object-cover shadow-lg"
            />
          </figure>

          <div className="mb-12 text-center">
            <a
              href="https://carnivalglamhub.masos.app/events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book your photoshoot
            </a>
          </div>

          <section className="mb-12">
            <YouTubeEmbed videoId="141z_Vbm_S4" title="Carnival Glam Hub photoshoot content" />
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              When does the shoot happen?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Before you hit the road. The shoot is scheduled into the
              concierge timeline immediately after makeup, hair and
              getting-dressed, while the look is at its absolute peak and
              before anything has been touched by the sun. The photographer
              works around your band's departure window so nothing is rushed.
              Most masqueraders are in front of the camera between 5am and
              8am, depending on territory and band.
            </p>
          </section>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src="/images/services/photoshoot-2.jpg"
              width={1284}
              height={1599}
              alt="Carnival costume portrait captured in the Carnival Glam Hub photoshoot garden"
              loading="lazy"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl object-cover shadow-lg"
            />
          </figure>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How long until you see the photos?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Fast. You receive 3 professionally edited photos within 36 to 48 hours
              of your shoot.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Who is behind the camera?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub works with a small bench of in-house Carnival
              photographers who shoot the morning every year. They know how to
              direct posing for wire bras and backpacks, where to stand so
              feathers do not eat the frame, and how to read the early-morning
              light outside the lounge. You are not handing your costume to
              someone shooting their first parade.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Can we do couples, group or band-section shoots?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Yes. Couples and small groups are common, best friends, sister
              duos, full sections. Group shoots are scheduled into the morning
              timeline so glam finishes in sequence and everyone hits the
              camera together at peak. Larger band-section shoots need to be
              flagged at booking so we hold the photographer and the shoot
              window.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What should I bring?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Your costume, your headpiece, any reference shots you want to
              recreate, and a charged phone for the quick-turn selects. The
              lounge handles styling tape, pins and small repairs, so you do
              not need to bring those.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why a pre-road shoot beats road snaps
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              On the road the light is harsh, the costume is dusty by midday,
              the makeup is past its peak and you are surrounded by thousands
              of other masqueraders. Phone snaps from friends are great for
              memories but they will not match what the section looked like
              when you put it on at 5am. The shoot exists for that
              window: directed posing outdoors, the right light, the headpiece
              seated properly, every gem still in place. It is the difference
              between a frame you will reprint and a camera roll you will
              scroll past.
            </p>
          </section>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src="/images/services/photoshoot-3.jpg"
              width={1284}
              height={1610}
              alt="Content-ready Carnival photoshoot before hitting the road, by Carnival Glam Hub"
              loading="lazy"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl object-cover shadow-lg"
            />
          </figure>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How are the photos delivered?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              You receive 3 professionally edited, high-resolution photos delivered
              digitally within 36 to 48 hours of your shoot, ready to post and to
              print. Additional edited images from your session are available on
              request.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How much does the Carnival photoshoot cost?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival photoshoot starts from US$140 as a stand-alone
              session and is discounted when bundled with{" "}
              <a
                href="/services/carnival-makeup"
                className="text-primary hover:underline"
              >
                Carnival makeup
              </a>
              , hair and{" "}
              <a
                href="/services/getting-dressed"
                className="text-primary hover:underline"
              >
                getting-dressed
              </a>
              . Final pricing varies by territory and photographer.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where can I book the Carnival photoshoot?
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Available across every Carnival Glam Hub location. The most
              booked photoshoots are{" "}
              <a href="/trinidad" className="text-primary hover:underline">Trinidad Carnival</a>,{" "}
              <a href="/jamaica" className="text-primary hover:underline">Jamaica Carnival</a> and{" "}
              <a href="/miami" className="text-primary hover:underline">Miami Carnival</a>;
              we also shoot{" "}
              <a href="/barbados" className="text-primary hover:underline">Barbados</a>,{" "}
              <a href="/grenada" className="text-primary hover:underline">Grenada</a>,{" "}
              <a href="/antigua" className="text-primary hover:underline">Antigua</a>,{" "}
              <a href="/saint-lucia" className="text-primary hover:underline">Saint Lucia</a> and{" "}
              <a href="/toronto" className="text-primary hover:underline">Toronto</a>. See the{" "}
              <a href="/faq" className="text-primary hover:underline">FAQ</a> for territory-specific details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5 text-center">
              See it in action
            </h2>
            <div className="max-w-sm mx-auto">
              <YouTubeEmbed videoId="lUvAC3soq_g" title="Pre-road Carnival photoshoot at Carnival Glam Hub" vertical />
            </div>
          </section>
          <RelatedLinks />
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Document the morning{" "}
              <span className="italic text-gradient-primary">properly.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Photographer time is booked by slot, and the popular times go first.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={BOOKING_URL} target="_blank" rel="noopener"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Book now
              </a>
              <a
                href="/services/carnival-makeup"
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                See Carnival makeup →
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

export default CarnivalPhotoshoot;