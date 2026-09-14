import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { BOOKING_URL } from "@/lib/constants";
import {
  PRESS_OUTLETS,
  PRESS_STORIES,
  PRESS_TIMELINE,
  storiesByTier,
  type PressStory,
} from "@/data/pressCoverage";

const PAGE_TITLE = "Carnival Glam Hub in the Press | Media Coverage";
const PAGE_DESCRIPTION =
  "Carnival Glam Hub media coverage from Teen Vogue, theGrio, the Jamaica Observer, the Jamaica Gleaner, Our Today, CaribVoxx and Haute People.";
const CANONICAL = "https://www.carnivalglamhub.com/press";
const OG_IMAGE = "https://www.carnivalglamhub.com/og-image.png";
const ORGANISATION = {
  "@type": "Organization",
  name: "Carnival Glam Hub",
  url: "https://www.carnivalglamhub.com",
};

const ANSWER_SUMMARY =
  "Carnival Glam Hub has been covered by the press since 2019. Coverage includes Teen Vogue, theGrio, the Jamaica Observer, the Jamaica Gleaner, Our Today, CaribVoxx and Haute People, spanning Carnival in Jamaica, Trinidad, Miami, Saint Lucia, Barbados, Grenada and Toronto.";


const formatDate = (iso: string) => {
  const parsed = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

/* ---------------------------------------------------------------- atoms */

const OutletMark = ({
  outlet,
  domain,
  className = "",
}: {
  outlet: string;
  domain: string;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!failed && (
        <img
          src={favicon(domain)}
          alt={`${outlet} logo`}
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-5 w-5 rounded-sm object-contain"
        />
      )}
      <span className="font-display text-sm tracking-wide text-foreground/75">
        {outlet}
      </span>
    </div>
  );
};

const NoteBadge = ({ note }: { note: string }) => (
  <span className="self-start rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-body text-[10px] uppercase tracking-[0.14em] text-primary">
    {note}
  </span>
);

const ReadCta = ({ outlet, label = "Read Article" }: { outlet: string; label?: string }) => (
  <span className="mt-auto pt-4 font-body text-sm font-semibold text-primary">
    {label} <span aria-hidden="true">→</span>
    <span className="sr-only"> on {outlet}</span>
  </span>
);

const StoryDate = ({ story }: { story: PressStory }) => (
  <p className="font-body text-xs text-muted-foreground">
    <time dateTime={story.publishedDate}>{formatDate(story.publishedDate)}</time>
    {story.author && <span> · {story.author}</span>}
  </p>
);

/** Publisher image with a typographic fallback when hotlinking is blocked. */
const FallbackPanel = ({
  story,
  ratio,
}: {
  story: PressStory;
  ratio: string;
}) => {
  const year = story.publishedDate.slice(0, 4);
  return (
    <div
      aria-hidden="true"
      className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-secondary p-6 sm:p-7 ${ratio}`}
    >
      <span className="font-body text-[10px] uppercase tracking-[0.28em] text-primary-foreground/85">
        {story.outlet}
      </span>
      <span className="font-display text-5xl font-bold italic leading-none text-primary-foreground/95 sm:text-6xl">
        {year}
      </span>
      <span className="border-t border-primary-foreground/25 pt-3 font-display text-base font-semibold leading-snug text-primary-foreground/95 line-clamp-3 sm:text-lg">
        {story.headline}
      </span>
    </div>
  );
};

const RemoteImage = ({
  story,
  ratio,
  onFail,
}: {
  story: PressStory;
  ratio: string;
  onFail: () => void;
}) => (
  <div className={`overflow-hidden bg-primary/5 ${ratio}`}>
    <img
      src={story.image}
      alt={`${story.outlet} coverage of Carnival Glam Hub: ${story.headline}`}
      loading="lazy"
      decoding="async"
      onError={onFail}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  </div>
);

/* ------------------------------------------------------------ story card */

const StoryCard = ({
  story,
  variant,
}: {
  story: PressStory;
  variant: "wide" | "tall" | "compact";
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(story.image) && !imageFailed;
  const quoteLed = !showImage && Boolean(story.pullQuote);

  return (
    <article
      id={`story-${story.id}`}
      className="scroll-mt-28 h-full"
    >
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/10"
      >
        {showImage ? (
          <RemoteImage
            story={story}
            ratio={variant === "tall" ? "aspect-[3/4]" : "aspect-[16/10]"}
            onFail={() => setImageFailed(true)}
          />
        ) : quoteLed ? null : (
          <FallbackPanel
            story={story}
            ratio={variant === "tall" ? "aspect-[4/5]" : "aspect-[16/9]"}
          />
        )}
        <div
          className={`flex flex-1 flex-col p-6 sm:p-7 ${
            quoteLed ? "bg-gradient-to-br from-primary/[0.06] to-secondary/[0.05]" : ""
          }`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <OutletMark outlet={story.outlet} domain={story.outletDomain} />
            {story.note && <NoteBadge note={story.note} />}
          </div>

          {quoteLed ? (
            <>
              <blockquote className="font-display text-lg italic leading-snug text-foreground sm:text-xl">
                &ldquo;{story.pullQuote}&rdquo;
              </blockquote>
              {story.pullQuoteAttribution && (
                <p className="mt-3 font-body text-xs uppercase tracking-[0.14em] text-primary/80">
                  {story.pullQuoteAttribution}
                </p>
              )}
              <h3 className="mt-5 font-display text-base font-bold leading-snug transition-colors group-hover:text-primary">
                {story.headline}
              </h3>
            </>
          ) : (
            <>
              <h3
                className={`font-display font-bold leading-snug transition-colors group-hover:text-primary ${
                  variant === "wide" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                }`}
              >
                {story.headline}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                {story.summary}
              </p>
            </>
          )}

          <div className="mt-4">
            <StoryDate story={story} />
          </div>
          <ReadCta outlet={story.outlet} />
        </div>
      </a>
    </article>
  );
};

/* ------------------------------------------------------------------ page */

const Press = () => {
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

    const restorers: Array<() => void> = [
      setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION),
      setMeta('meta[property="og:url"]', "property", "og:url", CANONICAL),
      setMeta('meta[property="og:type"]', "property", "og:type", "website"),
      setMeta('meta[property="og:image"]', "property", "og:image", OG_IMAGE),
      setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image"),
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", PAGE_DESCRIPTION),
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", OG_IMAGE),
    ];

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

  const [hero] = storiesByTier("hero");
  const features = storiesByTier("feature");
  const caribbean = storiesByTier("caribbean");
  const mentions = storiesByTier("mention");

  const [heroFeature, secondFeature] = features;
  const [caribFailed, setCaribFailed] = useState<Record<string, boolean>>({});

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Carnival Glam Hub in the press",
    url: CANONICAL,
    description: PAGE_DESCRIPTION,
    inLanguage: "en-GB",
    about: ORGANISATION,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PRESS_STORIES.map((story, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: story.headline,
          url: story.url,
          datePublished: story.publishedDate,
          ...(story.author ? { author: { "@type": "Person", name: story.author } } : {}),
          ...(story.image ? { image: story.image } : {}),
          publisher: { "@type": "Organization", name: story.outlet },
          about: ORGANISATION,
          isBasedOn: ORGANISATION.url,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
      { "@type": "ListItem", position: 2, name: "Press", item: CANONICAL },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Has Carnival Glam Hub been featured in the press?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Carnival Glam Hub has been featured in Teen Vogue, theGrio, the Jamaica Observer, the Jamaica Gleaner, Our Today, CaribVoxx and Haute People, across more than twenty articles published between 2019 and 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Which international publications have covered Carnival Glam Hub?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Teen Vogue covered Carnival Glam Hub in its 2024 report on the Carnival glam machine at Grenada's Spicemas, and theGrio recommended Carnival Glam Hub in its Jamaica Carnival 2024 guide.",
        },
      },
      {
        "@type": "Question",
        name: "When did press coverage of Carnival Glam Hub begin?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The earliest coverage is a Jamaica Gleaner Flair profile of co-founder Gabrielle Waite published on 2 September 2019, followed by coverage of the Trinidad expansion in 2020.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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

      <main className="pt-28 sm:pt-32">
        {/* A. HERO */}
        <section className="pb-10 pt-6 sm:pb-14" aria-labelledby="press-heading">
          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.28em] text-secondary">
              Media
            </p>
            <h1
              id="press-heading"
              className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              In The <em className="italic text-gradient-primary">Press</em>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              From international fashion titles to leading Caribbean media, Carnival Glam
              Hub has become part of the conversation around Carnival beauty, culture and
              the modern masquerader experience.
            </p>

            <dl className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-16">
              {[
                ["9", "years of coverage"],
                ["7", "publications"],
                ["2019", "to 2026"],
              ].map(([value, label]) => (
                <div key={label} className="text-center">
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-bold text-gradient-primary sm:text-3xl">
                      {value}
                    </span>
                    <span className="mt-1 block font-body text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mx-auto mt-10 max-w-3xl border-t border-primary/15 pt-8 font-body text-sm leading-relaxed text-muted-foreground">
              {ANSWER_SUMMARY}
            </p>
          </div>
        </section>

        {/* B. LOGO STRIP */}
        <section aria-label="Publications that have covered Carnival Glam Hub" className="border-y border-primary/10 bg-primary/[0.02] section-y-sm">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5 lg:gap-x-7 xl:gap-x-9 2xl:gap-x-12">
              {PRESS_OUTLETS.map((o) => (
                <a
                  key={o.name}
                  href={`#story-${o.anchorId}`}
                  aria-label={`Jump to ${o.name} coverage`}
                  className="group flex items-center gap-2 opacity-50 grayscale transition-all duration-500 ease-out hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0"
                >
                  <img
                    src={favicon(o.domain)}
                    alt={`${o.name} logo`}
                    width={28}
                    height={28}
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                  />
                  <span className="font-display text-base tracking-wide text-foreground/80 transition-colors group-hover:text-primary 2xl:text-lg">
                    {o.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* C. FEATURED COVERAGE */}
        {hero && (
          <section className="section-y" aria-labelledby="featured-heading">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              <h2 id="featured-heading" className="sr-only">
                Featured coverage
              </h2>
              <article
                id={`story-${hero.id}`}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-primary/20"
              >
                <div className="grid lg:grid-cols-2">
                  <div className="order-2 bg-card p-8 sm:p-12 lg:order-1 lg:p-14">
                    <span className="mb-5 inline-block font-body text-[11px] font-medium uppercase tracking-[0.22em] text-secondary">
                      Featured coverage
                    </span>
                    <div className="mb-5">
                      <OutletMark outlet={hero.outlet} domain={hero.outletDomain} />
                    </div>
                    <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                      {hero.headline}
                    </h3>
                    <div className="mt-4">
                      <StoryDate story={hero} />
                    </div>
                    <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {hero.summary}
                    </p>
                    <a
                      href={hero.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-block rounded-full bg-primary px-7 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                      Read on {hero.outlet} <span aria-hidden="true">→</span>
                    </a>
                  </div>

                  {/* Typographic composition: publisher imagery is not licensed. */}
                  <div
                    aria-hidden="true"
                    className="order-1 relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-secondary p-8 sm:min-h-[420px] sm:p-12 lg:order-2"
                  >
                    <div className="flex items-center justify-between font-body text-[11px] uppercase tracking-[0.3em] text-primary-foreground/80">
                      <span>{hero.outlet}</span>
                      <span>October 2024</span>
                    </div>
                    <p className="font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
                      Pretty
                      <br />
                      <span className="italic">Mas</span>
                      <br />
                      Glam
                    </p>
                    <div className="border-t border-primary-foreground/25 pt-4 font-body text-[11px] uppercase tracking-[0.24em] text-primary-foreground/80">
                      Spicemas · Grenada
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* D. SECONDARY FEATURES */}
        {features.length > 0 && (
          <section className="pb-9 sm:pb-12 lg:pb-16" aria-labelledby="features-heading">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              <h2
                id="features-heading"
                className="mb-8 font-display text-2xl font-bold sm:text-3xl"
              >
                In depth
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {heroFeature && (
                  <article
                    id={`story-${heroFeature.id}`}
                    className="scroll-mt-28"
                  >
                    <a
                      href={heroFeature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-secondary/[0.06] p-8 transition-all hover:shadow-lg hover:shadow-primary/10 sm:p-10"
                    >
                      <div className="mb-6">
                        <OutletMark outlet={heroFeature.outlet} domain={heroFeature.outletDomain} />
                      </div>
                      <blockquote className="font-display text-xl italic leading-snug text-foreground sm:text-2xl">
                        &ldquo;{heroFeature.pullQuote}&rdquo;
                      </blockquote>
                      <p className="mt-4 font-body text-xs uppercase tracking-[0.16em] text-primary/80">
                        {heroFeature.pullQuoteAttribution}
                      </p>
                      <h3 className="mt-7 font-display text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                        {heroFeature.headline}
                      </h3>
                      <div className="mt-3">
                        <StoryDate story={heroFeature} />
                      </div>
                      <ReadCta outlet={heroFeature.outlet} label={`Read on ${heroFeature.outlet}`} />
                    </a>
                  </article>
                )}

                {secondFeature && (
                  <StoryCard story={secondFeature} variant="wide" />
                )}
              </div>
            </div>
          </section>
        )}

        {/* E. FROM THE CARIBBEAN PRESS */}
        <section className="pb-9 sm:pb-12 lg:pb-16" aria-labelledby="caribbean-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <h2
              id="caribbean-heading"
              className="mb-8 font-display text-2xl font-bold sm:text-3xl"
            >
              From the <em className="italic text-gradient-primary">Caribbean</em> press
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {caribbean.map((story, index) => {
                const hasImage = Boolean(story.image) && !caribFailed[story.id];
                // Vary the rhythm by position, not by whether the publisher
                // image loaded, so a row of fallback panels still alternates
                // between wide and narrow cards.
                const SPANS = [
                  "md:col-span-7",
                  "md:col-span-5",
                  "md:col-span-4",
                  "md:col-span-8",
                  "md:col-span-6",
                  "md:col-span-6",
                ];
                const span = SPANS[index % SPANS.length];
                const narrow = span === "md:col-span-4" || span === "md:col-span-5";
                const variant: "wide" | "tall" | "compact" = narrow
                  ? hasImage
                    ? "tall"
                    : "compact"
                  : "wide";
                return (
                  <div key={story.id} className={span}>
                    <StoryCardWithFail
                      story={story}
                      variant={variant}
                      onFail={() =>
                        setCaribFailed((prev) => ({ ...prev, [story.id]: true }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* F. TIMELINE */}
        <section className="border-y border-primary/10 section-y" aria-labelledby="timeline-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <h2
              id="timeline-heading"
              className="mb-8 font-display text-xl font-bold sm:text-2xl"
            >
              A story built over time
            </h2>
            <ol className="flex flex-col gap-6 border-l border-primary/25 pl-6 md:grid md:auto-cols-fr md:grid-flow-col md:gap-0 md:border-l-0 md:border-t md:pl-0 md:pt-6">
              {PRESS_TIMELINE.map(({ year, outlets }) => (
                <li key={year} className="relative md:pr-5 md:pt-1">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.72rem] top-1.5 h-2 w-2 rounded-full bg-primary md:-top-[1.68rem] md:left-0"
                  />
                  <p className="font-display text-base font-bold text-primary">{year}</p>
                  <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                    {outlets.join(", ")}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* G. ALSO MENTIONED IN */}
        <section className="section-y" aria-labelledby="mentions-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <h2
              id="mentions-heading"
              className="mb-6 font-display text-xl font-bold sm:text-2xl"
            >
              Also mentioned in
            </h2>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
              {mentions.map((story) => (
                <li key={story.id} id={`story-${story.id}`} className="scroll-mt-28 border-b border-border pb-3">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-wrap items-baseline gap-x-3"
                  >
                    <span className="font-body text-[11px] uppercase tracking-[0.16em] text-primary/80">
                      {story.outlet}
                    </span>
                    <span className="font-body text-sm text-foreground/85 transition-colors group-hover:text-primary">
                      {story.headline}
                    </span>
                    <time
                      dateTime={story.publishedDate}
                      className="ml-auto font-body text-xs text-muted-foreground"
                    >
                      {story.publishedDate.slice(0, 4)}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* H. ENQUIRIES + BOOKING */}
        <section className="pb-16 sm:pb-24" aria-labelledby="enquiries-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
              <h2 id="enquiries-heading" className="font-display text-xl font-bold sm:text-2xl">
                Media enquiries
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
                For interviews, comment or imagery, write to{" "}
                <a
                  href="mailto:carnivalglamhub@gmail.com"
                  className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
                >
                  carnivalglamhub@gmail.com
                </a>
                .
              </p>
              <h3 className="mt-8 font-display text-lg font-bold sm:text-xl">
                Ready when you are
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
                Spaces sell out months before Carnival. Secure yours now.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-mcp-action="register-event"
                data-mcp-description="Register and pay a deposit for a Carnival Glam Hub event, by territory and date."
                className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Book your glam
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

/** Wraps StoryCard so the parent grid can react to a failed publisher image. */
const StoryCardWithFail = ({
  story,
  variant,
  onFail,
}: {
  story: PressStory;
  variant: "wide" | "tall" | "compact";
  onFail: () => void;
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(story.image) && !failed;

  if (!showImage) return <StoryCard story={{ ...story, image: undefined }} variant={variant} />;

  return (
    <article id={`story-${story.id}`} className="h-full scroll-mt-28">
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/10"
      >
        <RemoteImage
          story={story}
          ratio={variant === "tall" ? "aspect-[4/3]" : "aspect-[16/10]"}
          onFail={() => {
            setFailed(true);
            onFail();
          }}
        />
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <OutletMark outlet={story.outlet} domain={story.outletDomain} />
            {story.note && <NoteBadge note={story.note} />}
          </div>
          <h3
            className={`font-display font-bold leading-snug transition-colors group-hover:text-primary ${
              variant === "wide" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {story.headline}
          </h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
            {story.summary}
          </p>
          <div className="mt-4">
            <StoryDate story={story} />
          </div>
          <ReadCta outlet={story.outlet} />
        </div>
      </a>
    </article>
  );
};

export default Press;
