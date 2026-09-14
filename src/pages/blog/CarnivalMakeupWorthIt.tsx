import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import heroImage from "@/assets/blog-carnival-makeup-worth-it-hero-v2.webp";
import diyImage from "@/assets/blog-carnival-makeup-worth-it-diy.webp";

const SLUG = "is-professional-carnival-makeup-worth-it";
const URL = `https://www.carnivalglamhub.com/blogs/${SLUG}`;
const TITLE = "Is Professional Carnival Makeup Worth It?";
const META_TITLE = "Is Professional Carnival Makeup Worth It? | Glam Hub";
const DESCRIPTION =
  "Makeup only runs US$170 to US$210 for a single day. Here is what you are really paying for, and whether it is worth it once Carnival is over.";
const META_DESCRIPTION = DESCRIPTION;
const AUTHOR = "Carnival Glam Hub";
const DATE_PUBLISHED = "2026-06-21";
const FEATURED_IMAGE_ABS = `https://www.carnivalglamhub.com${heroImage}`;
const YOUTUBE_ID = "DWuZ147fSbU";
const TAGS = [
  "Carnival Makeup",
  "Professional Makeup",
  "Carnival Glam Hub",
  "Masqueraders",
];

const CarnivalMakeupWorthIt = () => {
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

  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight mt-12 mb-5 tracking-tight">
      {children}
    </h2>
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
                  <time dateTime={DATE_PUBLISHED}>{formattedDate}</time> · 6 min read
                </p>
              </div>
            </div>

            <figure className="mb-10 -mx-4 sm:mx-0">
              <img
                src={heroImage}
                alt="Close-up of dramatic Carnival makeup with gems by Carnival Glam Hub"
                width={986}
                height={558}
                className="w-full h-auto rounded-none sm:rounded-2xl object-cover aspect-[3/2]"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </figure>

            <div>
              <P>
                Every Carnival season the same question lands in the inboxes of Caribbean masqueraders. Is professional Carnival makeup actually worth it, or is US$170 to US$200 too much to spend on a face that washes off in the shower? It is a fair question. The honest answer depends on what you think you are paying for.
              </P>
              <P>
                At <Link to="/" className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary">Carnival Glam Hub</Link> we have done thousands of Carnival faces across Trinidad, Jamaica, Grenada, Saint Lucia, Antigua, Barbados, Miami and Toronto. Here is what we have learnt about the real value of professional Carnival makeup, and when it is worth booking.
              </P>

              <H2>How Much Does Professional Carnival Makeup Cost?</H2>
              <P>
                At Carnival Glam Hub, makeup only is US$170 to US$200 for a single day, and US$380 for both Trinidad days. Named and celebrity artists run US$200 to US$580. The price reflects the artist's training, the calibre of the products used, the time on the chair, and the technical knowledge required to build a face that survives an eight-hour day on the road.
              </P>
              <P>
                Cheaper options exist. So do far more expensive ones. The middle band is where most established Carnival MUAs sit, and it is where the value is clearest: a trained artist, sweat-resistant products, and a finish that holds up in photos and on stage.
              </P>

              <H2>What You Are Really Paying For</H2>
              <P>
                Carnival makeup is not party makeup. It is performance makeup. You are paying for techniques such as cut crease, sweat-proof primer, layered powder setting, lip stain under lipstick, and gem application that does not lift after the first wine. You are paying for products that are built for heat, sweat and humidity. And you are paying for an artist who has watched faces fall apart on the road and knows exactly how to stop yours from doing the same.
              </P>
              <P>
                The other half of the cost is time. A Carnival face is not a thirty-minute job. It is usually 90 minutes to two hours of detailed work, often before sunrise, often with the costume already on.
              </P>

              <H2>Can I Do My Own Carnival Makeup?</H2>

              <figure className="my-8 -mx-4 sm:mx-0">
                <img
                  src={diyImage}
                  alt="Masquerader applying her own Carnival makeup in a mirror"
                  width={1200}
                  height={1500}
                  className="w-full h-auto rounded-none sm:rounded-2xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <P>
                Yes, you can. Plenty of masqueraders do, and some look stunning. The risk is that regular makeup is built for a few controlled hours indoors, while Carnival makeup needs to survive sweat, heat, dust, drinks, hugs and an eight-hour parade route. Without sweat-proof products and the right setting technique, faces tend to slide by midday.
              </P>
              <P>
                If you are confident with eyes, lips and gem placement, and you have tested your products in heat before, doing your own makeup is a real option. If you have not, an experienced Carnival artist is usually the safer choice.
              </P>

              <H2>What Makes Carnival Makeup Different to Regular Makeup</H2>
              <P>
                The technique is the difference. Carnival makeup leans heavily on the eyes and lips, uses sweat-proof application, and adds drama through gems. Regular makeup is built for a few hours in controlled conditions. Carnival makeup is built for the road.
              </P>
              <P>
                That changes the products, the order of application, the amount of setting powder, and the way colour is laid down. It is the same craft as everyday makeup, applied to a much harder brief.
              </P>

              <H2>Why So Many Masqueraders Choose Carnival Glam Hub</H2>
              <P>
                We obsess over the things that go wrong on the road and engineer them out before you sit in the chair. Trained artists, tested sweat-proof products, gem application that holds, an on-time morning, and photos that still look right at five in the afternoon. Watch a typical Carnival morning with us:
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
                      title="Carnival Glam Hub: a Carnival morning"
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVideoLoaded(true)}
                      aria-label="Play video: Carnival Glam Hub Carnival morning"
                      className="absolute inset-0 w-full h-full group"
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
                        alt="Carnival Glam Hub Carnival morning video thumbnail"
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

              <H2>So, Is It Worth It?</H2>
              <P>
                If you have invested thousands in costume, flights, accommodation and tickets, the difference between a face that lasts and a face that does not is rarely worth saving US$200 on. Professional Carnival makeup is not really about looking dramatic at 6am. It is about looking right in every photo, every video and every memory you keep from that day.
              </P>
              <P>
                For most masqueraders we work with, the answer is yes. It is worth it.
              </P>

              <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
                <p className="font-body text-foreground/80 leading-[1.8] text-base sm:text-lg mb-4">
                  Ready to book a Carnival face that lasts the route?
                </p>
                <Link
                  to="/services/carnival-makeup"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-body text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  See Carnival Makeup Services
                </Link>
              </div>

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

export default CarnivalMakeupWorthIt;
