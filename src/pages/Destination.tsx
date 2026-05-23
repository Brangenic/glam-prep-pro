import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MasosEmbed from "@/components/MasosEmbed";
import { getDestination as getMasosDestination } from "@/lib/destinations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  destinations,
  getDestinationBySlug,
  getDestinationFaqs,
} from "@/data/destinations";
import { buildDestinationUrl } from "@/lib/destinations";
import logoImg from "@/assets/logo.png";
import { getDestinationPackages } from "@/data/destinationPackages";

const Destination = ({ slugOverride }: { slugOverride?: string } = {}) => {
  const params = useParams();
  const slug = slugOverride ?? params.slug ?? "";
  const dest = getDestinationBySlug(slug);
  const faqs = useMemo(() => (dest ? getDestinationFaqs(dest) : []), [dest]);
  const bookingUrl = useMemo(() => (dest ? buildDestinationUrl(dest.slug, "destination_page") : ""), [dest]);

  useEffect(() => {
    if (!dest) return;
    const prevTitle = document.title;
    document.title = dest.metaTitle;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", dest.metaDescription);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://www.carnivalglamhub.com/destinations/${dest.slug}`);

    const pageUrl = `https://www.carnivalglamhub.com/destinations/${dest.slug}`;

    // Barbados-only Google Analytics property (G-9RFDZYBJ5Q)
    let gaScript: HTMLScriptElement | null = null;
    let gaInline: HTMLScriptElement | null = null;
    if (dest.slug === "barbados") {
      const GA_ID = "G-9RFDZYBJ5Q";
      if (!document.getElementById("ga-barbados-loader")) {
        gaScript = document.createElement("script");
        gaScript.id = "ga-barbados-loader";
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(gaScript);
      }
      if (!document.getElementById("ga-barbados-init")) {
        gaInline = document.createElement("script");
        gaInline.id = "ga-barbados-init";
        gaInline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${GA_ID}');`;
        document.head.appendChild(gaInline);
      }
    }

    const upsertJsonLd = (id: string, data: unknown) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.type = "application/ld+json";
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };

    upsertJsonLd("destination-service-jsonld", {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${dest.name} Glam Services`,
      serviceType: `${dest.shortName} Carnival Makeup, Hair & Body Art`,
      description: dest.metaDescription,
      url: pageUrl,
      areaServed: { "@type": "Place", name: dest.shortName },
      provider: {
        "@type": "Organization",
        name: "Carnival Glam Hub",
        url: "https://www.carnivalglamhub.com",
        telephone: "+1-876-509-0997",
        email: "Bookings@carnivalglamhub.com",
      },
      offers: {
        "@type": "Offer",
        url: bookingUrl,
        availability: "https://schema.org/InStock",
        category: `${dest.shortName} Carnival Glam`,
      },
    });

    upsertJsonLd("destination-faq-jsonld", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });

    upsertJsonLd("destination-breadcrumb-jsonld", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.carnivalglamhub.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Destinations",
          item: "https://www.carnivalglamhub.com/#destinations",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: dest.name,
          item: pageUrl,
        },
      ],
    });

    return () => {
      document.title = prevTitle;
      ["destination-service-jsonld", "destination-faq-jsonld", "destination-breadcrumb-jsonld"].forEach(
        (id) => document.getElementById(id)?.remove(),
      );
      ["ga-barbados-loader", "ga-barbados-init"].forEach((id) =>
        document.getElementById(id)?.remove(),
      );
    };
  }, [dest, faqs, bookingUrl]);

  if (!dest) return <Navigate to="/#destinations" replace />;

  const others = destinations.filter((d) => d.slug !== dest.slug).slice(0, 4);
  const masosEntry = getMasosDestination(dest.slug);
  const embedUrl =
    masosEntry && masosEntry.masosUrl.includes("/events/") ? masosEntry.masosUrl : null;
  const packagesData = getDestinationPackages(dest.slug);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        {dest.slug === "grenada" ? (
          <section className="relative w-full overflow-hidden bg-[#0a1a3a]">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
              <img
                src={logoImg}
                alt="Carnival Glam Hub"
                className="w-40 sm:w-56 mb-8"
                loading="eager"
              />
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary font-medium mb-4">
                Where We Glam
              </p>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold italic text-white max-w-3xl">
                Grenada — Carnival Glam Hub 2026
              </h1>
              <p className="font-body text-sm sm:text-base text-white/80 mt-4">
                10 – 11 August 2026
              </p>
            </div>
          </section>
        ) : (
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={dest.image}
            alt={`${dest.name} — Carnival Glam Hub destination`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center top" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-10 sm:pb-16">
            {dest.upcoming && (
              <span className="inline-block w-fit bg-secondary/90 text-secondary-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </span>
            )}
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
              Where We Glam
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold italic text-white max-w-3xl">
              {dest.name}
            </h1>
            <p className="font-body text-sm sm:text-base text-white/80 mt-3">{dest.date}</p>
          </div>
        </section>
        )}

        {/* Packages */}
        {packagesData && (
          <section className="py-12 sm:py-20 border-t border-border" aria-labelledby="packages-heading">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary font-medium mb-3 text-center">
                {packagesData.eventDate}
              </p>
              <h2 id="packages-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center">
                <span className="text-gradient-primary italic">Choose Your Package</span>
              </h2>

              {packagesData.sections.map((section, idx) => (
                <div key={idx} className={idx > 0 ? "mt-16" : ""}>
                  {section.title && (
                    <h3 className="font-display text-xl sm:text-2xl font-bold mb-8 text-center">
                      {section.title}
                    </h3>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {section.packages.map((pkg) => (
                      <a
                        key={pkg.name}
                        href={packagesData.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl hover:border-primary/40 transition-all"
                      >
                        <div className="h-[200px] overflow-hidden bg-muted">
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h4 className="font-display text-base sm:text-lg font-bold leading-tight mb-2 text-foreground">
                            {pkg.name}
                          </h4>
                          <p className="font-body text-lg sm:text-xl font-bold text-primary mb-3">
                            {pkg.price}
                          </p>
                          <span className="mt-auto inline-block text-center bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wide px-4 py-2 rounded-full group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                            Book Now
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-center mt-12">
                <a
                  href={packagesData.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-8 py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Book Your Glam
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Body */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                  About {dest.shortName} Glam
                </h2>
                <p className="font-body text-base text-muted-foreground leading-relaxed mb-8">
                  {dest.longDescription}
                </p>

                <h3 className="font-display text-xl font-bold mb-4">What's included</h3>
                <ul className="space-y-3 mb-8">
                  {dest.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 font-body text-sm sm:text-base">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Book Your Glam
                </a>
              </div>

              <aside className="bg-card/50 border border-border rounded-2xl p-6 h-fit">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                  Event Date
                </p>
                <p className="font-display text-xl font-bold mb-6">{dest.date}</p>

                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                  Reserve your slot
                </p>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Limited availability. Booking closes early every season.
                </p>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary text-primary-foreground font-body font-semibold text-sm px-5 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Book Your Glam
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* FAQ section — renders the same Q&A captured in FAQPage JSON-LD */}
        <section
          className="py-12 sm:py-20 border-t border-border"
          aria-labelledby={`${dest.slug}-faq-heading`}
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3 text-center">
              {dest.shortName} Carnival Glam — FAQ
            </p>
            <h2
              id={`${dest.slug}-faq-heading`}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-center"
            >
              {dest.shortName} Carnival Glam{" "}
              <span className="text-gradient-primary italic">Questions</span>
            </h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.question} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-body font-semibold text-base">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-10">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Book Your Glam
              </a>
            </div>
          </div>
        </section>

        {/* Other destinations */}
        <section className="py-12 sm:py-20 bg-card/50 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">
              Other <span className="text-gradient-primary italic">Destinations</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/destinations/${o.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
                >
                  <img
                    src={o.image}
                    alt={`${o.name} — Carnival Glam Hub destination`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="font-display text-sm sm:text-base font-bold italic text-white">
                      {o.shortName}
                    </h3>
                    <p className="font-body text-[10px] uppercase tracking-wider text-white/70">
                      {o.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Destination;