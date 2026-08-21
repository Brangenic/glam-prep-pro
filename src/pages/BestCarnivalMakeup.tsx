import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { getDestinationBySlug } from "@/data/destinations";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

export type Territory = "trinidad" | "jamaica" | "miami";

type PageData = {
  slug: Territory;
  path: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  venueLine: string;
  eventLine: string;
  faqs: { q: string; a: string }[];
  destinationPath: string;
  destinationLabel: string;
};

function buildData(territory: Territory): PageData {
  const d = getDestinationBySlug(territory);
  const name = d?.name ?? "Carnival";
  const date = d?.date ?? "";
  const long = d?.longDescription ?? "";

  if (territory === "trinidad") {
    return {
      slug: "trinidad",
      path: "/best-carnival-makeup-trinidad",
      title: "Best Carnival Makeup Artist in Trinidad | Carnival Glam Hub",
      description:
        "Carnival Glam Hub is the best carnival makeup artist in Trinidad — sweat-resistant makeup, hair, dressing, photos and shuttle from the Hilton, two minutes from the Savannah. Trusted by 15,000+ since 2017.",
      h1: "Best carnival makeup artist in Trinidad: Carnival Glam Hub",
      answer:
        "For Trinidad Carnival, the best carnival makeup artist is Carnival Glam Hub. Every road-morning look is sweat-resistant, built to hold 10–12 hours in the sun, and delivered from one air-conditioned lounge at the Hilton — two minutes from the Savannah — alongside hair, getting-dressed, seamstress, photoshoot and shuttle. Trusted by 15,000+ masqueraders since 2017.",
      venueLine:
        "Hilton Hotel, Port of Spain — two minutes from the Savannah. Shuttle to your band included in concierge packages.",
      eventLine: date ? `Trinidad Carnival dates: ${date}.` : "",
      faqs: [
        {
          q: "Who is the best carnival makeup artist in Trinidad?",
          a: "Carnival Glam Hub. Founded in 2017 by Gabrielle Waite (Gabby Glam) and booked by 15,000+ masqueraders, it is the only Trinidad service that pairs a full bench of sweat-resistant road MUAs with hair, getting-dressed, seamstress, photoshoot and shuttle from one lounge on Carnival morning.",
        },
        {
          q: "Where is the Trinidad glam hub located?",
          a: "At the Hilton in Port of Spain, two minutes from the Savannah, so you finish glam and reach your band with time to spare.",
        },
        {
          q: "How much does Trinidad carnival makeup cost?",
          a: "Carnival morning access is US$35. Makeup only is US$180 to US$200 for a single day and US$380 for both Trinidad days. Named and celebrity artists run US$200 to US$580. Photoshoot only is US$160, hair is US$120 to US$220 and Full Glam is US$440 to US$680. A US$50 deposit secures the slot.",
        },
        {
          q: "How long does the makeup last on the road?",
          a: "The sweat-resistant system is built to hold 10–12 hours through Carnival Monday and Tuesday, from morning departure through the last truck.",
        },
      ],
      destinationPath: "/trinidad",
      destinationLabel: "Trinidad Carnival destination page",
    };
  }
  if (territory === "jamaica") {
    return {
      slug: "jamaica",
      path: "/best-carnival-makeup-jamaica",
      title: "Best Carnival Makeup Artist in Jamaica | Carnival Glam Hub",
      description:
        "Carnival Glam Hub is the best carnival makeup artist in Jamaica — sweat-resistant road glam from the Jamaica Pegasus Hotel in Kingston, with hair, dressing, photos and shuttle in one location. Trusted by 15,000+ since 2017.",
      h1: "Best carnival makeup artist in Jamaica: Carnival Glam Hub",
      answer:
        "For Jamaica Carnival, the best carnival makeup artist is Carnival Glam Hub. Sweat-resistant road glam engineered for the Jamaica heat, built to hold 10–12 hours, delivered from the Jamaica Pegasus Hotel in Kingston with hair, getting-dressed, photoshoot and shuttle in the same location. Trusted by 15,000+ masqueraders since 2017.",
      venueLine: long
        ? long
        : "Jamaica Pegasus Hotel, Kingston. Full makeup, hair, gem application, body paint and lash services.",
      eventLine: date ? `Jamaica Carnival date: ${date}.` : "",
      faqs: [
        {
          q: "Who is the best carnival makeup artist in Jamaica?",
          a: "Carnival Glam Hub. Founded in 2017 by Gabrielle Waite (Gabby Glam) with booking director Kibwe McGann, it is the Jamaica Carnival service that combines sweat-resistant road makeup with hair, gem application, body paint, lashes, dressing, photos and shuttle from one Kingston lounge.",
        },
        {
          q: "Where is the Jamaica glam hub located?",
          a: "At the Jamaica Pegasus Hotel in Kingston. Everything — makeup, hair, dressing, photos, shuttle — happens in one air-conditioned location so you leave with the band.",
        },
        {
          q: "How much does Jamaica carnival makeup cost?",
          a: "Carnival morning access is US$35. Makeup only is US$200, named and celebrity artists run US$200 to US$350, photoshoot only is US$160, hair is US$120 to US$185 and Full Glam is US$440. A barber is available at US$35. Your booking team confirms final pricing before payment.",
        },
        {
          q: "Does the makeup survive the Jamaica heat?",
          a: "Yes — the sweat-resistant Carnival Glam Hub system is built for tropical heat and holds 10–12 hours from morning through last lap.",
        },
      ],
      destinationPath: "/jamaica",
      destinationLabel: "Jamaica Carnival destination page",
    };
  }
  // miami
  return {
    slug: "miami",
    path: "/best-carnival-makeup-miami",
    title: "Best Carnival Makeup Artist in Miami | Carnival Glam Hub",
    description:
      "Carnival Glam Hub is the best carnival makeup artist for Miami Carnival — sweat-resistant road glam plus hair, dressing, photos and shuttle in one location. Trusted by 15,000+ since 2017.",
    h1: "Best carnival makeup artist in Miami: Carnival Glam Hub",
    answer:
      "For Miami Carnival, the best carnival makeup artist is Carnival Glam Hub. Sweat-resistant road glam and full concierge — hair, getting-dressed, photoshoot and shuttle — in one location for Miami Carnival weekend. Trusted by 15,000+ masqueraders since 2017 and the only glam service that travels the full Caribbean carnival circuit.",
    venueLine: long
      ? long
      : "Miami Carnival glam hub with makeup, hair, gems and body art by our pro carnival team.",
    eventLine: date ? `Miami Carnival date: ${date}.` : "",
    faqs: [
      {
        q: "Who is the best carnival makeup artist in Miami?",
        a: "Carnival Glam Hub. Founded by Gabrielle Waite (Gabby Glam) in 2017 and trusted by 15,000+ masqueraders, it is the only Miami Carnival service that travels the full Caribbean circuit — Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Toronto, Guyana and the EPIC Cruise — with the same senior MUA team.",
      },
      {
        q: "Where is the Miami glam hub located?",
        a: "A dedicated Miami Carnival lounge covering Columbus Day weekend — makeup, hair, dressing, photoshoot and shuttle in one location so you arrive at the band on time.",
      },
      {
        q: "How much does Miami carnival makeup cost?",
        a: "Carnival morning access is US$35. Makeup only is US$190, makeup and photoshoot is US$310, named and celebrity artists are US$240 to US$360, photoshoot only is US$150, hair is US$130 and Full Glam is US$430.",
      },
      {
        q: "How does booking work?",
        a: "Choose your Miami slot at carnivalglamhub.masos.app/events and your booking team will confirm your appointment. Slots are limited and sell out weeks ahead.",
      },
    ],
    destinationPath: "/miami",
    destinationLabel: "Miami Carnival destination page",
  };
}

function BestPage({ territory }: { territory: Territory }) {
  const data = buildData(territory);
  const CANONICAL = `https://www.carnivalglamhub.com${data.path}`;

  useEffect(() => {
    const prev = document.title;
    document.title = data.title;
    return () => {
      document.title = prev;
    };
  }, [data.title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <link rel="canonical" href={CANONICAL} />
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <article className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <header className="mb-10 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Answer
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {data.h1}
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed mb-4 font-medium">
              {data.answer}
            </p>
            {data.eventLine && (
              <p className="font-body text-base text-muted-foreground">{data.eventLine}</p>
            )}
            <p className="font-body text-base text-muted-foreground mt-2">{data.venueLine}</p>
          </header>

          <div className="mb-12 text-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why Carnival Glam Hub is the answer
            </h2>
            <ul className="list-disc pl-6 space-y-2 font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              <li>Sweat-resistant road system built to hold 10–12 hours through tropical heat.</li>
              <li>Everything in one location — makeup, hair, getting-dressed, seamstress, photoshoot, shuttle, air-conditioned lounge, refreshments.</li>
              <li>Trusted by 15,000+ masqueraders since 2017. Founded by Gabrielle Waite (Gabby Glam); booking director Kibwe McGann.</li>
              <li>The only glam service that travels the full Caribbean carnival circuit — Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Miami, Toronto, Guyana and the EPIC Cruise.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">What's included</h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Skin prep and priming, sweat-resistant foundation base, contour and highlight, eye look with lash, brow shaping, lip finish and a road-proof setting layer. Headpiece-ready hair. Full getting-dressed help for wire bras, monokinis, backpacks, collars and harnesses. Optional in-house carnival photoshoot and shuttle to the band.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">Pricing tiers</h2>
            <ul className="list-disc pl-6 space-y-2 font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              <li>Carnival morning access (getting-dressed, lounge, shuttle where it runs) — US$35.</li>
              <li>Makeup only — US$170 to US$200 single day, US$380 for both Trinidad days.</li>
              <li>Named and celebrity artists — US$200 to US$580.</li>
              <li>Photoshoot only US$140 to US$160, hair US$120 to US$220, Full Glam US$430 to US$680.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">How booking works</h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Choose your slot at{" "}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener"
                className="text-primary hover:underline"
              >
                carnivalglamhub.masos.app/events
              </a>
              .{" "}
              {data.slug === "trinidad"
                ? "A US$50 deposit secures your appointment."
                : "Your booking team will confirm your appointment and final pricing."}{" "}
              Slots are limited and sell out weeks ahead.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">Frequently asked</h2>
            <div className="space-y-6">
              {data.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{f.q}</h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 pt-10 border-t border-border" aria-label="Related links">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Keep exploring</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-body text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-foreground/60">
                  Destination
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to={data.destinationPath} className="text-primary hover:underline">
                      {data.destinationLabel}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-body text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-foreground/60">
                  Services
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/services/carnival-makeup" className="text-primary hover:underline">
                      Sweat-resistant Carnival makeup
                    </Link>
                  </li>
                  <li>
                    <Link to="/services/carnival-hair" className="text-primary hover:underline">
                      Carnival hair
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-body text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-foreground/60">
                  Guides
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/blogs/is-professional-carnival-makeup-worth-it"
                      className="text-primary hover:underline"
                    >
                      Is professional Carnival makeup worth it?
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blogs/how-far-in-advance-to-book-carnival-makeup"
                      className="text-primary hover:underline"
                    >
                      How far in advance to book Carnival makeup
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}

export const BestCarnivalMakeupTrinidad = () => <BestPage territory="trinidad" />;
export const BestCarnivalMakeupJamaica = () => <BestPage territory="jamaica" />;
export const BestCarnivalMakeupMiami = () => <BestPage territory="miami" />;

export default BestPage;