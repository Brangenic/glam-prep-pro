import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { BOOKING_URL } from "@/lib/constants";
import { PRESS_STORIES, type PressStory } from "@/data/pressCoverage";

const PAGE_TITLE = "Press and Media Coverage | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Carnival Glam Hub in the press. Coverage from Our Today, the Jamaica Observer and the Jamaica Gleaner on the Caribbean's premium Carnival morning concierge.";
const CANONICAL = "https://www.carnivalglamhub.com/press";
const ORGANISATION = {
  "@type": "Organization",
  name: "Carnival Glam Hub",
  url: "https://www.carnivalglamhub.com",
};

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

const OutletMark = ({ story }: { story: PressStory }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex items-center gap-2.5">
      {!failed && (
        <img
          src={`https://www.google.com/s2/favicons?sz=128&domain=${story.outletDomain}`}
          alt={`${story.outlet} logo`}
          width={28}
          height={28}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-6 w-6 object-contain rounded-sm"
        />
      )}
      <span className="font-display text-base tracking-wide text-foreground/80">
        {story.outlet}
      </span>
    </div>
  );
};

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

  const [featured, ...rest] = PRESS_STORIES;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Glam Hub in the news",
    url: CANONICAL,
    description: PAGE_DESCRIPTION,
    inLanguage: "en-GB",
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
          publisher: { "@type": "Organization", name: story.outlet },
          about: ORGANISATION,
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
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="py-14 sm:py-18 lg:py-20" aria-labelledby="press-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <header className="mb-10 sm:mb-14">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                Press
              </p>
              <h1
                id="press-page-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              >
                Glam Hub in the{" "}
                <span className="italic text-gradient-primary">news</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Carnival Glam Hub is covered by Caribbean and international press for
                raising the standard of the Carnival morning across the region. Here is
                where our work has been written about.
              </p>
            </header>

            {featured && (
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl border border-border bg-card overflow-hidden mb-10 sm:mb-14 group hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <div className="p-6 sm:p-10 lg:p-12">
                  <span className="inline-block font-body text-xs uppercase tracking-[0.15em] text-secondary font-medium mb-4">
                    Latest coverage
                  </span>
                  <div className="mb-4">
                    <OutletMark story={featured} />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 group-hover:text-primary transition-colors max-w-3xl">
                    {featured.headline}
                  </h2>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    <time dateTime={featured.publishedDate}>{formatDate(featured.publishedDate)}</time>
                    {featured.note && <span> · {featured.note}</span>}
                  </p>
                  <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">
                    {featured.excerpt}
                  </p>
                  <span className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                    Read on {featured.outlet} →
                  </span>
                </div>
              </a>
            )}

            {rest.length > 0 && (
              <>
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">
                  More coverage
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((story) => (
                    <a
                      key={story.id}
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-2xl border border-border bg-card p-6 group hover:shadow-lg hover:shadow-primary/10 transition-all"
                    >
                      <div className="mb-4">
                        <OutletMark story={story} />
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {story.headline}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mb-3">
                        <time dateTime={story.publishedDate}>{formatDate(story.publishedDate)}</time>
                      </p>
                      {story.note && (
                        <span className="self-start rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-body text-[11px] uppercase tracking-[0.12em] text-primary mb-3">
                          {story.note}
                        </span>
                      )}
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                        {story.excerpt}
                      </p>
                      <span className="mt-auto font-body text-sm font-semibold text-primary">
                        Read on {story.outlet} →
                      </span>
                    </a>
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 sm:mt-16 rounded-2xl border border-border bg-card p-6 sm:p-10">
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-3">
                Media enquiries
              </h2>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
                For interviews, comment or imagery, write to{" "}
                <a
                  href="mailto:bookings@carnivalglamhub.com"
                  className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
                >
                  bookings@carnivalglamhub.com
                </a>
                . You can also read more{" "}
                <Link to="/about" className="text-primary hover:underline">
                  about Carnival Glam Hub
                </Link>
                .
              </p>
              <h3 className="font-display text-lg sm:text-xl font-bold mb-3">
                Ready when you are
              </h3>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                Spaces sell out months before Carnival. Secure yours now.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-mcp-action="register-event"
                data-mcp-description="Register and pay a deposit for a Carnival Glam Hub event, by territory and date."
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
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

export default Press;
