import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const SLUG = "caribbean-carnival-has-an-airlift-problem";
const URL = `https://www.carnivalglamhub.com/blogs/${SLUG}`;
const TITLE =
  "The Caribbean Carnival economy doesnt have a demand problem. It has an airlift problem.";
const DESCRIPTION =
  "Working across 10 Carnival territories, the same constraint keeps showing up. Demand isnt the bottleneck. Seats are.";
const AUTHOR = "Kibwe McGann";
const DATE_PUBLISHED = "2026-05-29";
const FEATURED_IMAGE = "/linkedin-carnival-air-travel-post.svg";
const TAGS = ["Carnival Economy", "Caribbean Travel", "Airlift", "Carnival Glam Hub"];

const BODY_PARAGRAPHS: string[] = [
  "Working across 10 Carnival territories with __CGH__ has given me a clear view of what actually limits this market. The headlines focus on costume sales, fete sell-outs and influencer attendance numbers. The real bottleneck is upstream of all of that. It is the seat on the plane.",
  "Demand for Caribbean Carnival is healthy. Diaspora masqueraders in London, Toronto, New York, Atlanta, Miami and Lagos book costumes months in advance. __TRINIDAD__'s section leaders cap registration windows because they sell out. __STLUCIA__ and Grenada are running at capacity for hotel inventory during peak. Antigua, Barbados and Jamaica each report year-on-year visitor growth tied to their Carnival weekends. Promoters are not struggling to fill rooms. Bands are not struggling to fill sections. The constraint sits at the airport.",
  "Adam Smith made the point two and a half centuries ago. The size of the market is limited by the extent of the division of labour, and the division of labour is limited by the size of the market. Translate that to Carnival. Every additional masquerader landing in a territory creates a new buyer for a hotelier, a driver, a hairstylist, a photographer, a vendor, a makeup artist, a costume designer, a feather supplier and a band administrator. Each of those roles deepens and specialises as demand thickens. Cut the inbound seats and you do not just lose a tourist. You shrink the entire local economy that organises itself around that visitor.",
  "__STLUCIA__ made this concrete for me last year. British Airways direct service into Saint Lucia was suspended. The workaround for masqueraders flying in from the United Kingdom was to route through Tobago. That is a full extra flight, an extra fare, an extra night and a separate immigration queue. A premium service like ours is supposed to absorb friction for the masquerader. We were instead writing apology emails for what an airline schedule had done. A handful of bookings cancelled outright. Others downgraded packages because budget had been eaten by airfare. Saint Lucia Carnival did not lose appetite. Saint Lucia Carnival lost capacity.",
  "__TRINIDAD__ has the same shape of problem at a larger scale. Carnival weekend airlift into Piarco is finite. Caribbean Airlines, American, JetBlue, BA, Air Canada and Copa are not adding aircraft because Carnival demands it. So fares climb, routes via Miami or New York become the default and many would-be masqueraders simply pick a different territory or sit the year out. Toronto's Caribana ships visitors out into the Caribbean rather than absorbing them, which makes seat supply on northbound legs the same kind of pinch point.",
  "The fix is not a marketing campaign. It is a sustained, coordinated push to expand and protect inbound airlift around Carnival dates. That means tourism authorities, ministries and airline commercial teams sitting in the same room twelve months ahead of each Carnival, treating airlift like infrastructure. Block charters where the schedule does not exist. Negotiate guaranteed-seat allotments on commercial carriers. Publish the routes early so the diaspora can plan and so band administrators can size their sections to confirmed inbound capacity rather than hope.",
  "Caribbean Carnival is one of the few cultural products in the world that consistently pulls hard currency back to the region every year. Treating it as a serious export means treating the gateway like infrastructure. The gateway is airlift.",
];

const PLAIN_BODY =
  BODY_PARAGRAPHS.map((p) =>
    p
      .replace(/__CGH__/g, "Carnival Glam Hub")
      .replace(/__TRINIDAD__/g, "Trinidad")
      .replace(/__STLUCIA__/g, "Saint Lucia")
  ).join("\n\n") +
  "\n\nKibwe McGann\nCofounder, Carnival Glam Hub";

type Segment =
  | { type: "text"; value: string }
  | { type: "link"; to: string; label: string };

const tokeniseParagraph = (paragraph: string): Segment[] => {
  const regex = /(__CGH__|__TRINIDAD__|__STLUCIA__)/g;
  const out: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(paragraph)) !== null) {
    if (match.index > last) {
      out.push({ type: "text", value: paragraph.slice(last, match.index) });
    }
    if (match[1] === "__CGH__") {
      out.push({ type: "link", to: "/", label: "Carnival Glam Hub" });
    } else if (match[1] === "__TRINIDAD__") {
      out.push({ type: "link", to: "/trinidad-carnival-2027", label: "Trinidad" });
    } else {
      out.push({ type: "link", to: "/st-lucia", label: "Saint Lucia" });
    }
    last = match.index + match[1].length;
  }
  if (last < paragraph.length) {
    out.push({ type: "text", value: paragraph.slice(last) });
  }
  return out;
};

const AirliftProblem = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${TITLE} | Carnival Glam Hub Journal`;

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
    restorers.push(setMeta('meta[name="description"]', "name", "description", DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", TITLE));
    restorers.push(setMeta('meta[property="og:description"]', "property", "og:description", DESCRIPTION));
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", URL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "article"));
    restorers.push(setMeta('meta[name="twitter:title"]', "name", "twitter:title", TITLE));
    restorers.push(setMeta('meta[name="twitter:description"]', "name", "twitter:description", DESCRIPTION));

    // Canonical
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

    // Article JSON-LD
    const today = new Date().toISOString().slice(0, 10);
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      datePublished: DATE_PUBLISHED,
      dateModified: today,
      author: { "@type": "Person", name: AUTHOR },
      publisher: {
        "@type": "Organization",
        name: "Carnival Glam Hub",
        logo: {
          "@type": "ImageObject",
          url: "https://www.carnivalglamhub.com/logo.png",
        },
      },
      image: [`https://www.carnivalglamhub.com${FEATURED_IMAGE}`],
      mainEntityOfPage: { "@type": "WebPage", "@id": URL },
      keywords: TAGS.join(", "),
      articleBody: PLAIN_BODY,
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

  // First-mention link tracking
  let cghLinked = false;
  let trinidadLinked = false;
  let stLuciaLinked = false;

  const renderParagraph = (paragraph: string, idx: number) => {
    const segments = tokeniseParagraph(paragraph);
    return (
      <p key={idx} className="font-body text-foreground/80 leading-[1.8] text-base sm:text-lg mb-6">
        {segments.map((seg, i) => {
          if (seg.type === "text") return <span key={i}>{seg.value}</span>;
          let shouldLink = false;
          if (seg.label === "Carnival Glam Hub" && !cghLinked) {
            shouldLink = true;
            cghLinked = true;
          } else if (seg.label === "Trinidad" && !trinidadLinked) {
            shouldLink = true;
            trinidadLinked = true;
          } else if (seg.label === "Saint Lucia" && !stLuciaLinked) {
            shouldLink = true;
            stLuciaLinked = true;
          }
          return shouldLink ? (
            <Link
              key={i}
              to={seg.to}
              className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary"
            >
              {seg.label}
            </Link>
          ) : (
            <span key={i}>{seg.label}</span>
          );
        })}
      </p>
    );
  };

  const formattedDate = new Date(DATE_PUBLISHED).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

            {/* Featured image placeholder (asset not yet uploaded) */}
            <div
              className="mb-10 -mx-4 sm:mx-0 rounded-none sm:rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-16 text-center"
              role="img"
              aria-label="Featured image placeholder awaiting upload from Kibwe"
            >
              <p className="font-body text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Featured Image Placeholder
              </p>
              <p className="font-body text-sm text-muted-foreground">
                Awaiting upload from Kibwe — image will be swapped in once delivered.
              </p>
            </div>

            <div>
              {BODY_PARAGRAPHS.map((p, i) => renderParagraph(p, i))}

              <div className="mt-10 pt-6 border-t border-border">
                <p className="font-body text-foreground/80 leading-[1.8] text-base sm:text-lg mb-1">
                  <Link
                    to="/about"
                    className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary font-semibold"
                  >
                    Kibwe McGann
                  </Link>
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  Cofounder, Carnival Glam Hub
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

export default AirliftProblem;