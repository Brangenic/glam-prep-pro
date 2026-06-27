import { useEffect, useMemo, useState } from "react";
import { Check, Play } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import TrinidadGuidesBlock from "@/components/TrinidadGuidesBlock";
import { buildDestinationUrl } from "@/lib/destinations";
import photoGabby from "@/assets/trinidad-2027-p1.webp";
import photoDania from "@/assets/trinidad-2027-p2.webp";
import photoChontelle from "@/assets/trinidad-2027-p3.webp";
import heroCover from "@/assets/trinidad-2027-hero.webp";
import reviewsImage from "@/assets/trinidad-2027-reviews.webp";

const PAGE_TITLE = "Trinidad Carnival 2027 Makeup & Hair | Glam Hub";
const PAGE_DESCRIPTION =
  "Trinidad Carnival 2027 dates: Carnival Monday 8 and Tuesday 9 February 2027. Hair, makeup and photos from the Hilton, 2 minutes from the Savannah. Book early from US$50.";
const CANONICAL = "https://www.carnivalglamhub.com/trinidad-carnival-2027";
const YT_ID = "IHUJsYg0GhI";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Trinidad Carnival 2027 — Glam Hub Morning Concierge",
  startDate: "2027-02-08T04:00:00-04:00",
  endDate: "2027-02-09T20:00:00-04:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  url: CANONICAL,
  description:
    "Trinidad Carnival 2027 makeup, hair, photoshoot, getting-dressed, seamstress and shuttle — by Carnival Glam Hub.",
  location: {
    "@type": "Place",
    name: "Port of Spain, Trinidad and Tobago",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Port of Spain",
      addressCountry: "TT",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
  },
  offers: {
    "@type": "Offer",
    url: "https://www.carnivalglamhub.com/trinidad-carnival-2027",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    price: "50",
    validFrom: "2026-05-01",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Trinidad Carnival 2027", item: CANONICAL },
  ],
};

// Real Trinidad reviews from our public Google profile, also rendered visibly on this page.
const VISIBLE_REVIEWS = [
  {
    author: "Ashley Trini S",
    rating: 5,
    body:
      "5 stars across the board for the experience! I chose Carnival Glam Hub for Carnival Monday and went with a different service on Tuesday. I completely prefer Glam Hub and will be using them for both days next year for 2027 Carnival.",
  },
  {
    author: "Kerra Denel",
    rating: 5,
    body:
      "I had the most amazing experience at Carnival Glam Hub! From start to finish, everything was seamless. My appointment started right on time — which is everything during Carnival season — and the entire process was professional and organised.",
  },
] as const;

const aggregateRatingValue = (
  VISIBLE_REVIEWS.reduce((s, r) => s + r.rating, 0) / VISIBLE_REVIEWS.length
).toFixed(1);

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${CANONICAL}#business`,
  name: "Carnival Glam Hub — Trinidad Carnival",
  url: CANONICAL,
  image: "https://www.carnivalglamhub.com/og/trinidad-carnival-2027.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Port of Spain",
    addressCountry: "TT",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: aggregateRatingValue,
    reviewCount: VISIBLE_REVIEWS.length,
    bestRating: "5",
  },
  review: VISIBLE_REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    reviewBody: r.body,
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: "5",
    },
  })),
};

const TICKS = [
  "Makeup",
  "Hair",
  "Photoshoot",
  "Getting Dressed",
  "Seamstress Support",
  "Shuttle Service",
  "Breakfast & Refreshments",
  "Air Conditioned Lounge",
  "Overnight Bag Check",
];

const TrinidadCarnival2027 = () => {
  const bookingUrl = useMemo(() => buildDestinationUrl("trinidad", "trinidad_2027_page"), []);
  const [videoLoaded, setVideoLoaded] = useState(false);

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

  const photos = [
    { src: photoGabby, caption: "Gabby — hair and makeup by Glam Hub", alt: "Gabby — Trinidad Carnival hair and makeup by Glam Hub" },
    { src: photoDania, caption: "Dania Duntin — hair and makeup by Glam Hub", alt: "Dania Duntin — Trinidad Carnival hair and makeup by Glam Hub" },
    { src: photoChontelle, caption: "Chontelle — hair by Glam Hub, makeup by Chontelle", alt: "Chontelle — Trinidad Carnival hair by Glam Hub, makeup by Chontelle" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Above the fold */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            Trinidad Carnival 2027
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Trinidad Carnival 2027{" "}
            <span className="italic text-gradient-primary">Makeup, Hair & Photoshoots</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-muted-foreground mb-6">
            Book your Carnival morning with the team trusted by 15,000+ masqueraders since 2017.
          </p>
          <div className="mb-8 -mx-4 sm:mx-0">
            <img
              src={heroCover}
              alt="Carnival Glam Hub Trinidad Carnival 2027 cover"
              width={1220}
              height={846}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto sm:rounded-2xl border border-border"
            />
          </div>
          <div className="mb-8 max-w-2xl mx-auto rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 text-left">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2 text-center">
              Bookings Are Open Now
            </p>
            <p className="font-body text-base sm:text-lg text-foreground/85 leading-relaxed text-center">
              Hair, makeup and photos from the <strong>Hilton Hotel</strong>, two minutes from the Savannah. Shuttle service from the Hilton, getting dressed assistance, and refreshments and snacks included. Carnival Monday 8 February and Carnival Tuesday 9 February 2027.
            </p>
          </div>
          <p className="font-body text-base sm:text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
            Trinidad Carnival is the big one. The heat is real, the road is long, and your makeup and hair have to hold up from the first lap to the last. That is exactly what we do. Booking a Trinidad Carnival makeup artist who actually understands the road is the difference between glam that fades by lunchtime and a face that still looks fresh in your sunset photos.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-left max-w-xl mx-auto mb-10">
            {TICKS.map((t) => (
              <li key={t} className="flex items-start gap-3 font-body text-base">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 mb-8 gold-glow">
            <p className="font-display text-xl sm:text-2xl font-bold">
              Only <span className="text-gradient-primary">US$50</span> secures your appointment.
            </p>
          </div>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground font-body font-bold tracking-wider text-sm px-10 py-4 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            BOOK NOW
          </a>
        </section>

        {/* Dates */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center">
            Trinidad Carnival 2027
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary mb-2">Carnival Monday</p>
              <p className="font-display text-xl font-bold">8 February 2027</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary mb-2">Carnival Tuesday</p>
              <p className="font-display text-xl font-bold">9 February 2027</p>
            </div>
          </div>
        </section>

        {/* Why Glam Hub */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">Why Glam Hub</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {[
              { src: photoGabby, name: "Gabby", alt: "Gabby — Trinidad Carnival hair and makeup by Glam Hub" },
              { src: photoDania, name: "Dania", alt: "Dania Duntin — Trinidad Carnival hair and makeup by Glam Hub" },
              { src: photoChontelle, name: "Chontelle", alt: "Chontelle — Trinidad Carnival hair by Glam Hub" },
            ].map((m) => (
              <figure key={m.name} className="flex flex-col">
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
                <figcaption className="mt-2 text-center font-body text-sm text-muted-foreground">{m.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
            We have glammed more than 15,000 masqueraders since 2017. Our work has been featured internationally and trusted by Carnival models, influencers and everyday masqueraders who just want to look incredible on the road. We have been doing this across multiple Carnival territories for years, so we know exactly what it takes to keep your Trinidad Carnival glam flawless from your first photo to your last lap.
          </p>
        </section>

        {/* Morning services */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">Your Carnival Morning</h2>
          <div className="space-y-6">
            {[
              ["Makeup", "Sweat-proof Trinidad Carnival makeup built to last the full day, through the heat, the wine and the sweat. Soft glam to full drama, by a pro Trinidad Carnival MUA who gets the road and knows exactly how to make your look photograph."],
              ["Hair", "Trinidad Carnival hair styled to survive the road and complement your costume, done fast and done right."],
              ["Photoshoots", "Step into our garden for a pre-road shoot so your look is captured before the sun and the crowd."],
              ["Getting Dressed", "A dedicated assistant fits and secures your costume so nothing slips once you hit the road."],
              ["Seamstress Support", "Popped wire, fallen gem, loose strap? Our on-site seamstress fixes it on the spot."],
              ["Shuttle Service", "Walk straight out to your band or hop on our shuttle. No traffic, no parking stress."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                <p className="font-body text-base text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why book early */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">Why Book Early</h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
            The best appointment times run from 4:00am to 8:00am, and they go first. Those early slots give you enough time to get ready, take your photos and reach your band comfortably before you cross the stage.
          </p>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
            A relaxed morning is the whole game. You want time to eat, time to enjoy your photos in the garden and time to actually meet your section before the first truck pulls off. The masqueraders who book late end up rushing in heels at sunrise, and it shows in the photos.
          </p>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
            Locking in a great Trinidad Carnival makeup artist early also means you get to choose your look in advance, send your costume colours through and arrive knowing exactly what you are walking out with. No last-minute compromises.
          </p>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
            Most experienced masqueraders lock in their glam the moment they pay their costume deposit. Do the same and skip the morning scramble.
          </p>
        </section>

        {/* Media */}
        <section className="container mx-auto px-4 sm:px-6 max-w-4xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">See the Glam in Action</h2>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-card mb-10">
            {videoLoaded ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0`}
                title="Carnival Glam Hub — see the glam in action"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setVideoLoaded(true)}
                className="absolute inset-0 group"
                aria-label="Play video"
              >
                <img
                  src={`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`}
                  alt="Carnival Glam Hub Trinidad Carnival glam highlights"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1" fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {photos.map((p) => (
              <figure key={p.caption} className="rounded-2xl overflow-hidden border border-border bg-card">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover"
                />
                <figcaption className="p-4 font-body text-sm text-muted-foreground text-center">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="text-center mt-6">
            <a
              href="https://www.carnivalglamhub.com/#gallery"
              className="font-body text-sm font-medium text-primary hover:underline"
            >
              View the full gallery →
            </a>
          </div>
        </section>

        {/* Reviews */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-center">
            Glam Hub Reviews for Trinidad Carnival
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground text-center mb-3 max-w-2xl mx-auto">
            Hear straight from masqueraders who trusted us with their Trinidad Carnival glam.
          </p>
          <p className="font-body text-base sm:text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Read what Trinidad clients say about their morning, their look and how it held up on the road.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {VISIBLE_REVIEWS.map((r) => (
              <figure key={r.author} className="rounded-2xl border border-border bg-card p-6 text-left">
                <div className="font-body text-sm text-secondary mb-2" aria-label={`Rated ${r.rating} out of 5`}>
                  ★★★★★
                </div>
                <blockquote className="font-body text-base text-foreground/85 leading-relaxed mb-3">
                  “{r.body}”
                </blockquote>
                <figcaption className="font-body text-sm text-muted-foreground">— {r.author}</figcaption>
              </figure>
            ))}
          </div>
          <a
            href="https://www.google.com/maps/search/Carnival+Glam+Hub+Trinidad+Port+of+Spain"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden border border-border bg-card mb-6 hover:shadow-lg transition-shadow"
          >
            <img
              src={reviewsImage}
              alt="Carnival Glam Hub Trinidad Carnival reviews"
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </a>
          <div className="text-center">
            <a
              href="https://www.google.com/maps/search/Carnival+Glam+Hub+Trinidad+Port+of+Spain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground font-body font-bold tracking-wider text-sm px-10 py-4 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              READ OUR GOOGLE REVIEWS
            </a>
          </div>
        </section>

        {/* Strong CTA */}
        <TrinidadGuidesBlock />

        {/* Strong CTA */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Your Costume Isn&apos;t The Only Thing{" "}
              <span className="italic text-gradient-primary">That Sells Out.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-3">
              Flights sell out. Hotels sell out. Costumes sell out. The best glam appointments do too.
            </p>
            <p className="font-body text-base sm:text-lg text-foreground/85 mb-8">
              Secure your Trinidad Carnival 2027 appointment today. Only US$50 holds your slot.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground font-body font-bold tracking-wider text-base px-12 py-5 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              BOOK NOW
            </a>
          <p className="mt-6 font-body text-sm text-muted-foreground">
            Looking for the evergreen Trinidad hub?{" "}
            <a href="/trinidad" className="font-semibold text-primary hover:underline">
              Visit our Trinidad Carnival page →
            </a>
          </p>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default TrinidadCarnival2027;
