import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Trinidad Carnival Makeup and Glam 2027 | Glam Hub";
const PAGE_DESCRIPTION =
  "Trinidad Carnival 2027 is Monday 8 and Tuesday 9 February. Premium Carnival morning concierge in Port of Spain: sweat-proof makeup, hair, photoshoot, shuttle. Book at carnivalglamhub.com.";
const CANONICAL = "https://www.carnivalglamhub.com/trinidad-carnival-2027";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Trinidad Carnival 2027 Morning Concierge with Carnival Glam Hub",
  startDate: "2027-02-08T04:00:00-04:00",
  endDate: "2027-02-09T20:00:00-04:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  url: CANONICAL,
  description:
    "Carnival Glam Hub morning concierge for Trinidad Carnival 2027 in Port of Spain: makeup, hair, getting-dressed, photoshoot and shuttle.",
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
    url: "https://www.carnivalglamhub.com/booking",
    availability: "https://schema.org/PreOrder",
    priceCurrency: "USD",
    price: "0",
    validFrom: "2026-05-01",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Carnival Glam Hub Services for Trinidad Carnival 2027",
  serviceType: "Carnival morning beauty concierge",
  url: CANONICAL,
  description:
    "Sweat-resistant Carnival makeup, hair styling, getting-dressed assistance, photoshoot and shuttle for Trinidad Carnival 2027.",
  provider: {
    "@type": "Organization",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
  },
  areaServed: "Trinidad and Tobago",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.carnivalglamhub.com/booking",
    validThrough: "2027-02-16",
  },
};

const EVENT_SCHEMA_ID = "trinidad-carnival-2027-event-jsonld";
const SERVICE_SCHEMA_ID = "trinidad-carnival-2027-service-jsonld";
const FAQ_SCHEMA_ID = "trinidad-carnival-2027-faq-jsonld";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Select your destination and choose your glam package. You will receive confirmation after booking.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance should I book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Carnival morning slots fill quickly. We recommend booking as early as possible to secure your preferred time.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in my appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Services depend on the package selected but typically include makeup, hair styling, and costume dressing assistance.",
      },
    },
    {
      "@type": "Question",
      name: "Where does the glam take place?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each destination has a designated glam hub location shared after booking confirmation.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book for a group?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Group bookings are available and recommended for friends or band sections.",
      },
    },
    {
      "@type": "Question",
      name: "Do slots sell out?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We limit appointments per carnival morning to maintain a premium experience. Early booking is strongly recommended.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Destinations", item: "https://www.carnivalglamhub.com/#destinations" },
    { "@type": "ListItem", position: 3, name: "Trinidad Carnival 2027", item: CANONICAL },
  ],
};

const TrinidadCarnival2027 = () => {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
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
              Destination
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Trinidad Carnival 2027 with{" "}
              <span className="italic text-gradient-primary">Carnival Glam Hub</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Trinidad Carnival 2027 is the two-day Carnival Monday and Tuesday
              parade in Port of Spain on 15 and 16 February 2027. Carnival Glam
              Hub is the territory&apos;s premium morning concierge for
              masqueraders travelling in from the United States, Canada, the
              United Kingdom and the wider Caribbean diaspora. Pre-register
              your slot now; the 2027 calendar is already filling.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Trinidad Carnival 2027 dates
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Monday is 15 February 2027. Carnival Tuesday is 16 February
              2027. J&apos;Ouvert runs in the early hours of Monday morning. Most fete
              and Carnival activity begins in the week prior. Confirm your costume
              collection schedule with your band as soon as it is published.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What we deliver for Trinidad Carnival 2027
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Sweat-resistant{" "}
              <a href="/services/carnival-makeup" className="text-primary hover:underline">
                Carnival makeup
              </a>
              ,{" "}
              <a href="/services/carnival-hair" className="text-primary hover:underline">
                Carnival hair styling
              </a>
              ,{" "}
              <a href="/services/getting-dressed" className="text-primary hover:underline">
                getting-dressed assistance
              </a>{" "}
              for your costume, optional{" "}
              <a
                href="/services/carnival-photoshoot"
                className="text-primary hover:underline"
              >
                Carnival photoshoot
              </a>
              , optional{" "}
              <a
                href="/services/carnival-shuttle"
                className="text-primary hover:underline"
              >
                Carnival shuttle
              </a>{" "}
              to your band&apos;s start point, refreshments, and an air-conditioned
              waiting lounge. Every booking runs on a confirmed schedule so the
              morning never slips.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Why pre-register now
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Trinidad slots are the most contested in the Caribbean Carnival
              calendar. By the time costumes are fully distributed, glam slots are
              usually gone. Pre-registration secures your time, your team and your
              shuttle.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Who we serve
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub serves travelling masqueraders booked with the major
              Trinidad bands as well as local clients. We co-ordinate with your
              costume collection and band start times so your morning is choreographed
              end-to-end.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              How to pre-register
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Add your details at{" "}
              <a href="/booking" className="text-primary hover:underline">
                /booking
              </a>{" "}
              and a member of the Carnival Glam Hub team will confirm your slot, your
              services and your shuttle within 48 hours. See the{" "}
              <a href="/faq" className="text-primary hover:underline">FAQ</a> for
              what is included and read more{" "}
              <a href="/about" className="text-primary hover:underline">about us</a>.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Pre-register for{" "}
              <span className="italic text-gradient-primary">
                Trinidad Carnival 2027.
              </span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Secure your morning before costume collection opens.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/booking"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Pre-register now
              </a>
              <a
                href="/about"
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Read about us →
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

export default TrinidadCarnival2027;