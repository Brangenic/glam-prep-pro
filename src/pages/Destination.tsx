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
import { getHubTier, getHubInclusions, TIER_LABEL, MIAMI_SHUTTLE_NOTE, hasBarber, BARBER_LABEL, getCapabilities, MIAMI_VENUE_NAME, MIAMI_VENUE_ADDRESS, MIAMI_VENUE_ALIAS, MIAMI_VENUE_CITY, MIAMI_VENUE_DISTANCES, MIAMI_HUB_LOCATION, MIAMI_BAG_CHECK_NOTE } from "@/data/hubTiers";
import { BARBER_PRICE, OVERNIGHT_BAG_CHECK_PRICE } from "@/data/territoryPricing";
import logoImg from "@/assets/logo.png";
import { getDestinationPackages } from "@/data/destinationPackages";
import {
  GALLERY_CTA,
  GALLERY_HREF,
  getUpcomingDestinations,
  hasSeasonPassed,
  passedSeasonYear,
  seasonAwareMeta,
} from "@/data/seasons";

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

  const seasonPassed = hasSeasonPassed(slug);
  const seasonMeta = dest
    ? seasonAwareMeta(dest.slug, dest.name, dest.metaTitle, dest.metaDescription)
    : { title: "", description: "" };

  useEffect(() => {
    if (!dest) return;
    const prevTitle = document.title;
    document.title = seasonMeta.title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", seasonMeta.description);

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
      const ogTitle = seasonPassed
        ? seasonMeta.title
        : seo.year
          ? `${seo.event} Makeup ${seo.year} | Carnival Glam Hub`
          : `${seo.event} Makeup, Hair & Photoshoots | Carnival Glam Hub`;
      setProp("og:title", ogTitle);
      setProp("og:description", seasonMeta.description);
      setMeta("twitter:title", ogTitle);
      setMeta("twitter:description", seasonMeta.description);
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
  }, [dest, faqs, bookingUrl, seasonPassed, seasonMeta.title, seasonMeta.description]);

  if (!dest) return <Navigate to="/#destinations" replace />;

  // Onward links show upcoming Carnivals only. Computed from the live
  // clock on every render, so a stale prerender self-corrects on
  // hydration. Trinidad and Trinidad Carnival 2027 are deduped inside the
  // helper because they are the same Carnival.
  const others = getUpcomingDestinations(dest.slug, 4)
    .map((u) => {
      const source =
        getDestinationBySlug(u.slug) ??
        (u.slug === "trinidad-carnival-2027" ? getDestinationBySlug("trinidad") : undefined);
      return { ...u, image: source?.image };
    })
    .filter((o): o is typeof o & { image: string } => Boolean(o.image));
  const onwardLinks = getUpcomingDestinations(dest.slug);

  const tier = getHubTier(dest.slug);
  const inclusions = getHubInclusions(dest.slug) ?? dest.highlights;
  const caps = getCapabilities(dest.slug);
  const addOns: { label: string; note: string }[] = [
    ...(caps.overnightBagCheck
      ? [{
          label: "Overnight bag check",
          note: `US$${OVERNIGHT_BAG_CHECK_PRICE} per masquerader. Leave your bag with us while you are on the road and collect it that night or the next day.`,
        }]
      : []),
    ...(caps.reels
      ? [{ label: "Reels", note: "Price confirmed on booking." }]
      : []),
    ...(caps.barber
      ? [{ label: "Barber", note: `US$${BARBER_PRICE} per masquerader.` }]
      : []),
  ];
  const masosEntry = getMasosDestination(dest.slug);
  const embedUrl =
    masosEntry && masosEntry.masosUrl.includes("/events/") ? masosEntry.masosUrl : null;
  const packagesData = getDestinationPackages(dest.slug);
  const seasonEnded = dest.slug === "jamaica";
  const waitlistHref = "mailto:Bookings@carnivalglamhub.com?subject=Jamaica%20Carnival%202027%20Waitlist";
  // A passed territory sells nothing. Every booking call to action on the
  // page becomes a Gallery link, derived from the season calendar.
  const ctaHref = seasonPassed ? GALLERY_HREF : seasonEnded ? waitlistHref : bookingUrl;
  const ctaLabel = seasonPassed
    ? GALLERY_CTA
    : seasonEnded
      ? "Join 2027 Waitlist"
      : "Book Your Glam";
  const ctaExternal = !seasonPassed && !seasonEnded;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={dest.image}
            alt={dest.imageAlt ?? `${dest.name} masquerader in full costume — ${dest.description}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: dest.objectPosition || "center top" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-10 sm:pb-16">
            {seasonPassed && (
              <span className="inline-block w-fit bg-white/90 text-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3">
                {passedSeasonYear(dest.slug)} season wrapped
              </span>
            )}
            {dest.upcoming && !seasonPassed && (
              <span className="inline-block w-fit bg-secondary/90 text-secondary-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </span>
            )}
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
              Where We Glam
            </p>
            {tier && (
              <span className="inline-flex w-fit items-center gap-2 mb-3">
                <span className="bg-white/90 text-foreground font-body text-[11px] sm:text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full">
                  {TIER_LABEL[tier]}
                </span>
                {hasBarber(dest.slug) && (
                  <span className="font-body text-[11px] sm:text-xs uppercase tracking-wider font-medium text-white/80">
                    {BARBER_LABEL}
                  </span>
                )}
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

        {/* Season wrapped banner — any territory whose date has passed */}
        {seasonPassed && (
          <section
            aria-label={`${dest.name} ${passedSeasonYear(dest.slug)} season ended`}
            className="border-y border-border bg-card/60"
          >
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8 sm:py-10 text-center">
              <span className="inline-block bg-foreground/85 text-background font-body text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full mb-4">
                Season wrapped
              </span>
              <p className="font-display text-lg sm:text-xl lg:text-2xl font-bold leading-snug mb-3">
                {dest.name} {passedSeasonYear(dest.slug)} has wrapped. Bookings are closed for this season.
              </p>
              <p className="font-body text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Have a look at what our artists created on the road, and follow
                us for {dest.shortName} next season.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={GALLERY_HREF}
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {GALLERY_CTA}
                </a>
                <Link
                  to="/#destinations"
                  className="inline-block rounded-full border border-border bg-background px-7 py-3.5 font-body text-sm font-semibold hover:border-primary/60 hover:text-primary transition-colors"
                >
                  See the seasons still open
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Miami logistics notice — venue move and no shuttle, above packages */}
        {dest.slug === "miami" && (
          <section
            aria-label="Miami Carnival 2026 venue and travel notice"
            className="border-y border-border bg-card/60"
          >
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8 sm:py-10">
              <span className="inline-block bg-foreground/85 text-background font-body text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full mb-4">
                Plan your travel
              </span>
              <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-bold leading-snug mb-3">
                Miami Carnival has moved to Broward County
              </h2>
              <div className="font-body text-sm sm:text-base text-muted-foreground space-y-3">
                <p>
                  As announced by Miami Carnival, the Parade of Bands is at{" "}
                  <strong className="text-foreground">{MIAMI_VENUE_NAME}</strong>,{" "}
                  {MIAMI_VENUE_ADDRESS}, sometimes listed as the{" "}
                  {MIAMI_VENUE_ALIAS}. The city is {MIAMI_VENUE_CITY}, not Fort
                  Lauderdale.
                </p>
                <p>
                  <strong className="text-foreground">
                    {MIAMI_HUB_LOCATION}
                  </strong>{" "}
                  The venue moved to Broward and we moved with it, so you are
                  minutes from the road rather than driving in from Miami.
                </p>
                <p>
                  <strong className="text-foreground">{MIAMI_SHUTTLE_NOTE}</strong>
                </p>
                <p>{MIAMI_BAG_CHECK_NOTE}</p>
                <p>{MIAMI_VENUE_DISTANCES}</p>
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
                {seasonPassed ? (
                  <span className="text-gradient-primary italic">
                    {passedSeasonYear(dest.slug)} packages, past season
                  </span>
                ) : seo ? (
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
                    {section.packages.map((pkg) => {
                      const CardTag = seasonPassed ? "div" : "a";
                      return (
                      <CardTag
                        key={pkg.name}
                        {...(seasonPassed
                          ? {}
                          : {
                              href: packagesData.bookingUrl,
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
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
                          {seasonPassed ? (
                            <span className="mt-auto inline-block text-center border border-border text-muted-foreground font-body font-semibold text-xs uppercase tracking-wide px-4 py-2 rounded-full">
                              Past season
                            </span>
                          ) : (
                            <span className="mt-auto inline-block text-center bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wide px-4 py-2 rounded-full group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                              Book Now
                            </span>
                          )}
                        </div>
                      </CardTag>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="text-center mt-12">
                {seasonPassed ? (
                  <>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      These were the {passedSeasonYear(dest.slug)} packages. They
                      are shown for reference only and are not bookable.
                    </p>
                    <a
                      href={GALLERY_HREF}
                      className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-8 py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                      {GALLERY_CTA}
                    </a>
                  </>
                ) : (
                  <a
                    href={packagesData.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-8 py-4 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Book Your Glam
                  </a>
                )}
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
                  {dest.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 font-body text-sm sm:text-base">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-display text-xl font-bold mb-4">
                  What is included at this hub
                  {tier ? ` (${TIER_LABEL[tier]})` : ""}
                </h3>
                <ul className="space-y-3 mb-8">
                  {inclusions.map((h) => (
                    <li
                      key={`inc-${h}`}
                      className="flex items-start gap-3 font-body text-sm sm:text-base"
                    >
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {addOns.length > 0 && (
                  <>
                    <h3 className="font-display text-xl font-bold mb-4">
                      Paid add-ons at this hub
                    </h3>
                    <ul className="space-y-3 mb-8">
                      {addOns.map((a) => (
                        <li
                          key={`add-${a.label}`}
                          className="flex items-start gap-3 font-body text-sm sm:text-base"
                        >
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                          <span>
                            {a.label}
                            <span className="block text-muted-foreground text-xs mt-0.5">{a.note}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}


                {dest.slug === "miami" && (
                  <p className="font-body text-sm text-muted-foreground mb-8">
                    {MIAMI_SHUTTLE_NOTE} {MIAMI_BAG_CHECK_NOTE}
                  </p>
                )}

                {tier === "lite" && (
                  <p className="font-body text-sm text-muted-foreground mb-8">
                    {dest.shortName} is a Glam Hub Lite. Our Full Service Glam
                    Hubs, which add shuttle, breakfast and refreshments, alcohol,
                    hair, seamstress and getting-dressed assistance, run in{" "}
                    <Link to="/jamaica" className="text-primary hover:underline">Jamaica</Link>,{" "}
                    <Link to="/trinidad" className="text-primary hover:underline">Trinidad</Link> and{" "}
                    <Link to="/miami" className="text-primary hover:underline">Miami</Link>.
                  </p>
                )}

                <a
                  href={ctaHref}
                  target={ctaExternal ? "_blank" : undefined}
                  rel={ctaExternal ? "noopener noreferrer" : undefined}
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {ctaLabel}
                </a>
              </div>

              <aside className="bg-card/50 border border-border rounded-2xl p-6 h-fit">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                  Event Date
                </p>
                <p className="font-display text-xl font-bold mb-6">{dest.date}</p>

                {seasonPassed ? (
                  <>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                      Season wrapped
                    </p>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      {dest.name} {passedSeasonYear(dest.slug)} is over and
                      bookings are closed. See the looks from the road in our
                      Gallery.
                    </p>
                    <a
                      href={GALLERY_HREF}
                      className="block w-full text-center bg-primary text-primary-foreground font-body font-semibold text-sm px-5 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      {GALLERY_CTA}
                    </a>
                  </>
                ) : seasonEnded ? (
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
                href={ctaHref}
                target={ctaExternal ? "_blank" : undefined}
                rel={ctaExternal ? "noopener noreferrer" : undefined}
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                {ctaLabel}
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
                  to={o.path}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
                >
                  <img
                    src={o.image}
                    alt={`${o.name} masquerader in costume, a Carnival Glam Hub destination`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="font-display text-sm sm:text-base font-bold italic text-white">
                      {o.shortName}
                    </h3>
                    <p className="font-body text-[10px] uppercase tracking-wider text-white/70">
                      {o.dateText}
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
        {!seasonPassed && (
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl pb-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Are you a makeup artist or hair stylist working{" "}
            {dest.shortName} Carnival?{" "}
            <a href="/station-rentals" className="text-primary hover:underline">
              Rent a station inside our Glam Hub
            </a>
            .
          </p>
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