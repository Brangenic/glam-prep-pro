import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import heroImage from "@/assets/blog-book-early-hero.webp";
import costumeImage from "@/assets/blog-book-early-costume.webp";

const SLUG = "how-far-in-advance-to-book-carnival-makeup";
const URL = `https://www.carnivalglamhub.com/blogs/${SLUG}`;
const TITLE = "How Far In Advance Should I Book My Carnival Makeup Artist?";
const META_TITLE = "How Early Should You Book Carnival Makeup? | Glam Hub";
const DESCRIPTION =
  "When to book your Carnival makeup artist, why the 4am to 8am slots go first, and how to lock in a smooth Carnival morning. A Glam Hub guide.";
const META_DESCRIPTION = DESCRIPTION;
const AUTHOR = "Carnival Glam Hub";
const DATE_PUBLISHED = "2026-06-21";
const FEATURED_IMAGE_ABS = `https://www.carnivalglamhub.com${heroImage}`;
const YOUTUBE_ID = "6bNZE5AI4sk";
const TAGS = [
  "Carnival Booking",
  "Carnival Makeup Artist",
  "Carnival Morning",
  "Glam Hub",
];

const BookEarly = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = META_TITLE;

    const setMeta = (
      selector: string,
      attr: "name" | "property",
      name: string,
      content: string
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      let created = false;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
        created = true;
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (created) tag?.remove();
        else if (prev !== null) tag?.setAttribute("content", prev);
      };
    };

    const restorers: Array<() => void> = [];
    restorers.push(setMeta('meta[name="description"]', "name", "description", META_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", TITLE));
    restorers.push(setMeta('meta[property="og:description"]', "property", "og:description", DESCRIPTION));
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", URL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "article"));
    restorers.push(setMeta('meta[property="og:image"]', "property", "og:image", FEATURED_IMAGE_ABS));
    restorers.push(setMeta('meta[name="twitter:title"]', "name", "twitter:title", TITLE));
    restorers.push(setMeta('meta[name="twitter:description"]', "name", "twitter:description", DESCRIPTION));
    restorers.push(setMeta('meta[name="twitter:image"]', "name", "twitter:image", FEATURED_IMAGE_ABS));

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute("href") ?? null;
    let createdCanonical = false;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
      createdCanonical = true;
    }
    canonical.setAttribute("href", URL);

    const today = new Date().toISOString().slice(0, 10);
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      datePublished: DATE_PUBLISHED,
      dateModified: today,
      author: { "@type": "Organization", name: AUTHOR, url: "https://www.carnivalglamhub.com/" },
      publisher: {
        "@type": "Organization",
        name: "Carnival Glam Hub",
        logo: {
          "@type": "ImageObject",
          url: "https://www.carnivalglamhub.com/logo.png",
        },
      },
      image: [FEATURED_IMAGE_ABS],
      mainEntityOfPage: { "@type": "WebPage", "@id": URL },
      keywords: TAGS.join(", "),
    };
    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
        { "@type": "ListItem", position: 2, name: "Journal", item: "https://www.carnivalglamhub.com/blogs" },
        { "@type": "ListItem", position: 3, name: TITLE, item: URL },
      ],
    };
    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (createdCanonical) canonical?.remove();
      else if (prevCanonical !== null) canonical?.setAttribute("href", prevCanonical);
      articleScript.remove();
      breadcrumbScript.remove();
    };
  }, []);

  const formattedDate = new Date(DATE_PUBLISHED).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const P = ({ children }: { children: React.ReactNode }) => (
    <p className="font-body text-foreground/80 leading-[1.8] text-base sm:text-lg mb-6">{children}</p>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <article className="py-10 sm:py-14 lg:py-18">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors mb-10 group"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              All Posts
            </Link>

            <div className="mb-4 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <span
                  key={t}
                  className="inline-block rounded-full border border-border bg-card/60 px-3 py-1 font-body text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-6"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {TITLE}
            </h1>

            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <div className="font-body text-sm">
                <p className="font-semibold text-foreground leading-tight">{AUTHOR}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  <time dateTime={DATE_PUBLISHED}>{formattedDate}</time> · 5 min read
                </p>
              </div>
            </div>

            <figure className="mb-10 -mx-4 sm:mx-0">
              <img
                src={heroImage}
                alt="Masquerader enjoying refreshments in the Carnival Glam Hub lounge"
                width={1600}
                height={1067}
                className="w-full h-auto rounded-none sm:rounded-2xl object-cover aspect-[3/2]"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </figure>

            <div>
              <P>One of the biggest mistakes first-time masqueraders make is waiting too long to book their Carnival morning services.</P>

              <P>As a general rule, once you have placed a deposit on your costume, you should start thinking about your makeup appointment. The best time slots typically disappear first, especially the 4:00am to 8:00am appointments. Those times give you enough time to get ready, take photos, get dressed, and comfortably reach your band before it reaches the stage.</P>

              <P>The more services you are booking, the earlier you should secure your appointment.</P>

              <P>Many masqueraders assume makeup is only an hour. In reality, Carnival morning can quickly become a three to four-hour process. Makeup may take an hour, hair may take another hour, getting dressed can easily add 30 minutes, and most people want time for photos before heading to the road.</P>

              <figure className="my-8 -mx-4 sm:mx-0">
                <img
                  src={costumeImage}
                  alt="Masquerader in full Carnival costume ready for the road"
                  width={1400}
                  height={1750}
                  className="w-full h-auto rounded-none sm:rounded-2xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <P>This is why many experienced masqueraders look for convenience rather than simply looking for a makeup artist.</P>

              <P>Nobody wants to spend Carnival morning bouncing around a city they do not know, rushing between vendors, sitting in traffic, and hoping everything runs on schedule.</P>

              <P>
                At <Link to="/" className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary">Carnival Glam Hub</Link>, many guests choose us because everything happens in one location. Makeup, hair, photoshoots, getting dressed assistance, seamstress support, refreshments and shuttle service are all available under one roof.
              </P>

              <div className="my-8 -mx-4 sm:mx-0">
                <div
                  className="relative w-full overflow-hidden rounded-none sm:rounded-2xl bg-black"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  {videoLoaded ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&autoplay=1`}
                      title="Carnival Glam Hub: everything in one location"
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVideoLoaded(true)}
                      aria-label="Play video: Carnival Glam Hub one-stop Carnival morning"
                      className="absolute inset-0 w-full h-full group"
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
                        alt="Carnival Glam Hub one-stop Carnival morning video thumbnail"
                        width={480}
                        height={270}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 group-hover:bg-primary transition-colors">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <P>Even guests who do their own makeup often use our getting dressed services because Carnival costumes have become increasingly complex. Missing strings, broken clasps, loose feathers, costume adjustments and last-minute repairs happen more often than most people expect. Having an experienced seamstress nearby can save your entire morning.</P>

              <P>One feature our returning guests love is overnight bag check. Instead of carrying extra shoes, clothing, chargers and personal items onto the road, you can leave your bag with us, jump on the shuttle, enjoy Carnival, and collect your belongings afterwards. For two-day Carnivals like Trinidad, Grenada and Saint Lucia, that convenience becomes even more valuable.</P>

              <P>The biggest benefit of booking early is not simply securing a makeup artist. It is securing the Carnival morning experience you actually want.</P>

              <P>
                Ready to book your Carnival morning? Visit{" "}
                <a
                  href="https://www.carnivalglamhub.com"
                  className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary font-semibold"
                >
                  www.carnivalglamhub.com
                </a>{" "}
                and secure your slot before the best times are gone.
              </P>

              <div className="mt-10 pt-6 border-t border-border">
                <p className="font-body text-foreground/80 leading-[1.8] text-base sm:text-lg mb-1">
                  <Link
                    to="/about"
                    className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary font-semibold"
                  >
                    Carnival Glam Hub
                  </Link>
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  Carnival makeup, hair and morning concierge across the Caribbean.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary group"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                More Posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default BookEarly;
