import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
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
import { getHubTier, getHubInclusions, TIER_LABEL, MIAMI_SHUTTLE_NOTE } from "@/data/hubTiers";
import logoImg from "@/assets/logo.png";
import { getDestinationPackages } from "@/data/destinationPackages";
import TrinidadGuidesBlock from "@/components/TrinidadGuidesBlock";

const TERRITORY_PLACE: Record<string, { city: string; country: string }> = {
  trinidad: { city: "Port of Spain", country: "TT" },
  "trinidad-carnival-2027": { city: "Port of Spain", country: "TT" },
  jamaica: { city: "Kingston", country: "JM" },
  barbados: { city: "Bridgetown", country: "BB" },
  grenada: { city: "St. George's", country: "GD" },
  "saint-lucia": { city: "Castries", country: "LC" },
  antigua: { city: "St. John's", country: "AG" },
  miami: { city: "Miami", country: "US" },
  toronto: { city: "Toronto", country: "CA" },
  guyana: { city: "Georgetown", country: "GY" },
};

const Destination = ({ slugOverride }: { slugOverride?: string } = {}) => {
  const params = useParams();
  const slug = slugOverride ?? params.slug ?? "";
  const dest = getDestinationBySlug(slug);
  const faqs = useMemo(() => (dest ? getDestinationFaqs(dest) : []), [dest]);
  const bookingUrl = useMemo(() => (dest ? buildDestinationUrl(dest.slug, "destination_page") : ""), [dest]);

  const seoOverrides: Record<string, { territory: string; year: string; event: string }> = {
    // Trinidad evergreen hub — no year. The dated edition lives at /trinidad-carnival-2027.
    trinidad: { territory: "Trinidad", year: "", event: "Trinidad Carnival" },
    jamaica: { territory: "Jamaica", year: "2027", event: "Jamaica Carnival" },
    miami: { territory: "Miami", year: "2026", event: "Miami Carnival" },
    "saint-lucia": { territory: "Saint Lucia", year: "2026", event: "Saint Lucia Carnival" },
    antigua: { territory: "Antigua", year: "2026", event: "Antigua Carnival" },
    barbados: { territory: "Barbados", year: "2026", event: "Barbados Crop Over" },
    grenada: { territory: "Grenada", year: "2026", event: "Grenada Spicemas" },
  };
  const seo = dest ? seoOverrides[dest.slug] : undefined;

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

    if (seo) {
      const setProp = (property: string, content: string) => {
        let el = document.querySelector<HTMLMetaElement>(
          `meta[property="${property}"]`,
        );
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute("property", property);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };
      const ogTitle = seo.year
        ? `${seo.event} Makeup ${seo.year} | Carnival Glam Hub`
        : `${seo.event} Makeup, Hair & Photoshoots | Carnival Glam Hub`;
      setProp("og:title", ogTitle);
      setProp("og:description", dest.metaDescription);
      setMeta("twitter:title", ogTitle);
      setMeta("twitter:description", dest.metaDescription);
    }

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://www.carnivalglamhub.com/${dest.slug}`);

    // Service + BreadcrumbList JSON-LD for destinations is emitted at
    // build time in scripts/prerender-routes.ts so crawlers see it in
    // the static <head>. FAQPage stays runtime-injected because its
    // content is generated from per-destination data.
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

    upsertJsonLd("destination-faq-jsonld", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });

    return () => {
      document.title = prevTitle;
      document.getElementById("destination-faq-jsonld")?.remove();
    };
  }, [dest, faqs, bookingUrl]);

  if (!dest) return <Navigate to="/#destinations" replace />;

  const others = destinations.filter((d) => d.slug !== dest.slug).slice(0, 4);
  const tier = getHubTier(dest.slug);
  const inclusions = getHubInclusions(dest.slug) ?? dest.highlights;
  const masosEntry = getMasosDestination(dest.slug);
  const embedUrl =
    masosEntry && masosEntry.masosUrl.includes("/events/") ? masosEntry.masosUrl : null;
  const packagesData = getDestinationPackages(dest.slug);
  const seasonEnded = dest.slug === "jamaica";
  const waitlistHref = "mailto:Bookings@carnivalglamhub.com?subject=Jamaica%20Carnival%202027%20Waitlist";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={dest.image}
            alt={`${dest.name} masquerader in full costume — ${dest.description}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: dest.objectPosition || "center top" }}
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
            {tier && (
              <span className="inline-block w-fit bg-white/90 text-foreground font-body text-[11px] sm:text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full mb-3">
                {TIER_LABEL[tier]}
              </span>
            )}
            {dest.slug === "epic-cruise" && (
              <span className="inline-block w-fit bg-secondary/90 text-secondary-foreground font-body text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                🚢 Glam Hub at Sea — exclusively for EPIC Cruise masqueraders
              </span>
            )}
            {dest.slug === "trinidad" && (
              <span className="inline-block w-fit bg-secondary/90 text-secondary-foreground font-body text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                Also available on Epic Cruise 🚢
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold italic text-white max-w-3xl">
              {dest.name}
            </h1>
            <p className="font-body text-sm sm:text-base text-white/80 mt-3">{dest.date}</p>
          </div>
        </section>

        {/* Trinidad evergreen hub intro + cross-link to dated edition */}
        {dest.slug === "trinidad" && (
          <section className="border-t border-border bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-10 sm:py-14 text-center">
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary font-medium mb-3">
                Trinidad Carnival Glam Hub
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Carnival makeup, hair and photos for{" "}
                <span className="text-gradient-primary italic">Trinidad Carnival</span>
              </h2>
              <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                Sweat-resistant makeup, road-ready hair, getting-dressed help, on-site photos and shuttle from our Port of Spain lounge — by the team trusted by 15,000+ masqueraders since 2017.
              </p>
              <div className="mb-6 rounded-2xl border border-primary/30 bg-background/60 px-5 py-4 max-w-2xl mx-auto">
                <p className="font-body text-sm sm:text-base text-foreground/85">
                  Booking for Trinidad Carnival 2027?{" "}
                  <a
                    href="/trinidad-carnival-2027"
                    className="font-semibold text-primary hover:underline"
                  >
                    See our Trinidad Carnival 2027 page →
                  </a>
                </p>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Book Now
              </a>
            </div>
          </section>
        )}

        {/* Season ended banner — Jamaica only */}
        {dest.slug === "jamaica" && (
          <section
            aria-label="Jamaica Carnival 2026 season ended"
            className="relative bg-gradient-to-br from-primary via-primary to-primary/90 border-y-4 border-primary-foreground/10 shadow-lg shadow-primary/20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] [background-size:18px_18px] text-primary-foreground"
            />
            <div className="relative container mx-auto px-4 sm:px-6 max-w-5xl py-8 sm:py-10 text-center">
              <span className="inline-block bg-primary-foreground/15 text-primary-foreground font-body text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                Season Ended
              </span>
              <p className="font-display text-lg sm:text-xl lg:text-2xl font-bold leading-snug text-primary-foreground">
                🎉 Jamaica Carnival 2026 has wrapped — see you next year! In the meantime, explore our other active destinations:
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto">
                {[
                  { slug: "miami", label: "Miami" },
                  { slug: "barbados", label: "Barbados" },
                  { slug: "trinidad", label: "Trinidad" },
                  { slug: "antigua", label: "Antigua" },
                  { slug: "grenada", label: "Grenada" },
                  { slug: "saint-lucia", label: "Saint Lucia" },
                  { slug: "toronto", label: "Toronto" },
                  { slug: "epic-cruise", label: "Epic Cruise" },
                ].map((d) => (
                  <Link
                    key={d.slug}
                    to={`/${d.slug}`}
                    className="block bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:scale-[1.03] font-body font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md text-center transition-all"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Packages */}
        {packagesData && !seasonEnded && (
          <section className="py-12 sm:py-20 border-t border-border" aria-labelledby="packages-heading">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary font-medium mb-3 text-center">
                {packagesData.eventDate}
              </p>
              <h2 id="packages-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center">
                {seo ? (
                  <span className="text-gradient-primary italic">
                    {seo.event} makeup prices and packages
                  </span>
                ) : (
                  <span className="text-gradient-primary italic">Choose Your Package</span>
                )}
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
                  {seo
                    ? `Where to get your makeup done for ${seo.event}`
                    : `About ${dest.shortName} Glam`}
                </h2>
                <p className="font-body text-base text-muted-foreground leading-relaxed mb-8">
                  {dest.longDescription}
                </p>

                <h3 className="font-display text-xl font-bold mb-4">
                  {seo
                    ? `What's included in your ${seo.event} glam morning`
                    : "What's included"}
                </h3>
                <ul className="space-y-3 mb-8">
                  {inclusions.map((h) => (
                    <li key={h} className="flex items-start gap-3 font-body text-sm sm:text-base">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {dest.slug === "miami" && (
                  <p className="font-body text-sm text-muted-foreground mb-8">
                    {MIAMI_SHUTTLE_NOTE}
                  </p>
                )}

                {tier === "lite" && (
                  <p className="font-body text-sm text-muted-foreground mb-8">
                    {dest.shortName} is a Glam Hub Lite. Our Full Service Glam
                    Hubs, which add shuttle, bag and wing check, breakfast and
                    refreshments, alcohol, hair and bronzing, run in{" "}
                    <Link to="/jamaica" className="text-primary hover:underline">Jamaica</Link>,{" "}
                    <Link to="/trinidad" className="text-primary hover:underline">Trinidad</Link> and{" "}
                    <Link to="/miami" className="text-primary hover:underline">Miami</Link>.
                  </p>
                )}

                <a
                  href={seasonEnded ? waitlistHref : bookingUrl}
                  target={seasonEnded ? undefined : "_blank"}
                  rel={seasonEnded ? undefined : "noopener noreferrer"}
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {seasonEnded ? "Join 2027 Waitlist" : "Book Your Glam"}
                </a>
              </div>

              <aside className="bg-card/50 border border-border rounded-2xl p-6 h-fit">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                  Event Date
                </p>
                <p className="font-display text-xl font-bold mb-6">{dest.date}</p>

                {seasonEnded ? (
                  <>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                      Season Ended
                    </p>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      Bookings for Jamaica 2027 opening soon — join our waitlist to be first in line.
                    </p>
                    <a
                      href={waitlistHref}
                      className="block w-full text-center bg-primary text-primary-foreground font-body font-semibold text-sm px-5 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      Join 2027 Waitlist
                    </a>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
              {seo ? (
                <>
                  How to book your{" "}
                  <span className="text-gradient-primary italic">
                    {seo.event} glam slot
                  </span>
                </>
              ) : (
                <>
                  {dest.shortName} Carnival Glam{" "}
                  <span className="text-gradient-primary italic">Questions</span>
                </>
              )}
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
                href={seasonEnded ? waitlistHref : bookingUrl}
                target={seasonEnded ? undefined : "_blank"}
                rel={seasonEnded ? undefined : "noopener noreferrer"}
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                {seasonEnded ? "Join 2027 Waitlist" : "Book Your Glam"}
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
                    alt={`${o.name} masquerader in costume — Carnival Glam Hub destination`}
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
        {dest.slug === "trinidad" && (
          <div className="pb-12 sm:pb-20">
            <TrinidadGuidesBlock />
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl pb-12 sm:pb-20">
          <RelatedLinks />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Destination;