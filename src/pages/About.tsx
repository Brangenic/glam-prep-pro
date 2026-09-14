import { BOOKING_URL } from "@/lib/constants";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import {
  AREA_SERVED,
  FULL_SERVICE_NAMES,
  LITE_NAMES,
  listNames,
} from "@/data/hubTiers";

import {
  ABOUT_PAGE_DESCRIPTION as PAGE_DESCRIPTION,
  ABOUT_PAGE_TITLE as PAGE_TITLE,
} from "@/data/pageMeta";

const CANONICAL = "https://www.carnivalglamhub.com/about";

/** Where we operate, generated from the two tier model. */
const FULL_SERVICE_SENTENCE = listNames(FULL_SERVICE_NAMES);
const LITE_SENTENCE = listNames(LITE_NAMES);

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Carnival Glam Hub",
  url: CANONICAL,
  description: PAGE_DESCRIPTION,
  inLanguage: "en-GB",
  isPartOf: {
    "@type": "WebSite",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
  },
  mainEntity: {
    "@type": "Organization",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
    founder: [
      {
        "@type": "Person",
        name: "Kibwe McGann",
        jobTitle: "Co-Founder, Carnival Glam Hub",
      },
      {
        "@type": "Person",
        name: "Gabrielle Waite",
        alternateName: "Gabby Glam",
        jobTitle: "Co-Founder, Carnival Glam Hub",
      },
    ],
    foundingDate: "2017",
    areaServed: AREA_SERVED,
    sameAs: [
      "https://www.instagram.com/carnivalglamhub",
      "https://www.facebook.com/carnivalglamhub",
      "https://www.tiktok.com/@carnivalglamhub",
      "https://www.youtube.com/@carnivalglamhub",
      "https://www.pinterest.com/carnivalglamhub",
    ],
  },
};

// BeautySalon (Organization) and founder Person JSON-LD blocks are rendered
// statically in index.html. They are intentionally NOT duplicated here.

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Company", item: "https://www.carnivalglamhub.com/about" },
    { "@type": "ListItem", position: 3, name: "About", item: "https://www.carnivalglamhub.com/about" },
  ],
};

const SCHEMA_ID = "about-page-jsonld";
const ORG_SCHEMA_ID = "about-org-jsonld";

const About = () => {
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
      {/* JSON-LD rendered inline so crawlers see it without executing JS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
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
              About
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              About <span className="italic text-gradient-primary">Carnival Glam Hub</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub is a premium Carnival morning concierge that prepares
              travelling masqueraders for the road with sweat-resistant makeup, hair
              styling, getting-dressed assistance, photoshoot and shuttle, all under
              one roof. Since 2017 we have prepared more than 15,000 masqueraders,
              turning the most chaotic morning of the year into a calm, organised,
              professionally run experience. One location. One schedule. Everything
              handled.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              The Carnival Glam Hub story
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub started in{" "}
              <a href="/jamaica" className="text-primary hover:underline">
                Jamaica
              </a>{" "}
              in 2017 with a simple observation, and opened in{" "}
              <a href="/trinidad-carnival-2027" className="text-primary hover:underline">
                Trinidad
              </a>{" "}
              in 2020. The morning of Carnival is the most
              expensive and most fragile part of the entire experience. Masqueraders
              were paying for costumes, flights, hotels and fetes, then losing the
              morning to late makeup artists, hair appointments on the other side of
              town, no transport, no food and no time. We built one space where every
              part of the Carnival morning could happen in sequence, on time, and to a
              standard worth photographing. Today, Carnival Glam Hub operates as a
              multi-territory concierge serving masqueraders from across the diaspora.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Founders
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub was founded in 2017 by Gabrielle Waite and Kibwe
              McGann. Gabrielle is a Jamaican makeup artist and entrepreneur with a
              background in beauty and Carnival production, and the founder of{" "}
              <a
                href="https://gabbyglamcosmetics.com/"
                target="_blank"
                rel="noopener"
                className="text-primary hover:underline"
              >
                Gabby Glam Cosmetics
              </a>{" "}
              and{" "}
              <a
                href="https://www.visitglamhaus.com/"
                target="_blank"
                rel="noopener"
                className="text-primary hover:underline"
              >
                Glam Haus by Gabby Glam
              </a>
              . She received the Distinguished Award in Beauty at the Jamaica
              Gleaner&apos;s Flair Distinguished Awards in 2023. Together they built the

              concept around a real masquerader&apos;s needs:{" "}
              <a href="/services/carnival-makeup" className="text-primary hover:underline">
                sweat-resistant makeup
              </a>{" "}
              that survives the road,{" "}
              <a href="/services/carnival-hair" className="text-primary hover:underline">
                hair that holds
              </a>{" "}
              through the parade,{" "}
              <a href="/services/getting-dressed" className="text-primary hover:underline">
                getting-dressed assistance
              </a>{" "}
              for technical costumes,{" "}
              <a href="/services/carnival-photoshoot" className="text-primary hover:underline">
                professional photography
              </a>
              , refreshments and{" "}
              <a href="/services/carnival-shuttle" className="text-primary hover:underline">
                transport
              </a>
              , all under one roof, on one schedule.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Where we operate
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our Full Service Glam Hubs run in {FULL_SERVICE_SENTENCE}. We also
              operate as Glam Hub Lite in {LITE_SENTENCE}, following the regional
              Carnival calendar. Most clients travel internationally for Carnival
              from the United States, Canada and the United Kingdom.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              What we stand for
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Premium, organised, calm. We treat the Carnival morning as a production,
              not a series of appointments. Every booking includes a schedule, a point
              of contact, an air-conditioned lounge and refreshments.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Press and recognition
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Carnival Glam Hub has been{" "}
              <Link
                to="/press"
                className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
              >
                featured in
              </Link>{" "}
              Our Today, the Jamaica Observer, the Jamaica Gleaner and CaribVoxx for its
              role in raising the standard of Carnival morning experiences across the
              region. Gabrielle Waite received the{" "}
              <a
                href="https://past.jamaica-gleaner.com/article/lifestyle/20230428/leading-women-business-media-and-beauty-honoured"
                target="_blank"
                rel="noopener"
                className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
              >
                Distinguished Award in Beauty
              </a>{" "}
              at the Jamaica Gleaner's Flair Distinguished Awards in 2023.
            </p>

          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              Ready when you are
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              Appointments run to a fixed schedule on Carnival morning. Book early to
              get the time you want.
            </p>
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-16 sm:mt-20">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Carnival morning, <span className="italic text-gradient-primary">handled.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Choose your territory and book your appointment.
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

export default About;