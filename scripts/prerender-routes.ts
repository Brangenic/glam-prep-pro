// Postbuild: emits per-route static HTML at dist/<path>/index.html for
// the app's non-blog routes (destinations, services, /trinidad-carnival-2027,
// /about, /faq, /reviews, /amazon-store, /booking-calculator) with the
// correct <title>, meta description, canonical and og/twitter tags.
// Mirrors scripts/prerender-blog-meta.ts but uses a static metadata map
// instead of Supabase, because this metadata lives in the source files.
//
// The body of every emitted file still boots the SPA, so user-visible
// content (rendered React) is unchanged. Only the served <head> changes.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import sharp from "sharp";

const BASE_URL = "https://www.carnivalglamhub.com";
const DIST = resolve("dist");
const DEFAULT_OG = `${BASE_URL}/og-image.png`;
const DEFAULT_OG_TYPE = "image/png";
const HERO_FALLBACK = `${BASE_URL}/og-home.jpg`;

const OG_W = 1200;
const OG_H = 630;

// Route path → real hero image source. Kept inline (not imported) so this
// script stays free of the app's runtime asset modules.  Every entry is
// transcoded to a 1200×630 JPEG at /og/route-<slug>.jpg at build time so
// social crawlers always see a page-specific preview in the raw HTML.
const ROUTE_HERO_SOURCES: Record<string, string> = {
  "/jamaica":
    "https://www.dropbox.com/scl/fi/a2s2gnuk6k1zurq8296ee/IMG_6662.jpg?rlkey=l0ekybyz3r68kohd6bbxjx2ro&raw=1",
  "/saint-lucia":
    "https://www.dropbox.com/scl/fi/wvkuyil1teg9kdvl6wdbp/Alliyah.png?rlkey=q8zy5e0rd8zbtpb2bi2yh6imc&raw=1",
  "/antigua":
    "https://www.dropbox.com/scl/fi/zj9aswskvl80vunhkhdcf/Chloe%20J.png?rlkey=yxp73i1uv8pcwpuink46ty6mv&raw=1",
  "/grenada":
    "https://www.dropbox.com/scl/fi/taonoqg2p6faph4jipzhr/AALiyah.png?rlkey=jwxhfig9y16l6kn2573nkuggh&raw=1",
  "/barbados":
    "https://www.dropbox.com/scl/fi/4a52okz83gxh171qyhfjc/Dania.png?rlkey=q3figf3ty5abs9gdie4rtjcow&raw=1",
  "/miami":
    "https://www.dropbox.com/scl/fi/x4z9o06d4h5ite4v2ph4g/Kayla.png?rlkey=o33o2vlxhcqidxgewnhp4wuh0&raw=1",
  "/toronto":
    "https://www.dropbox.com/scl/fi/tnghsl2n83e111g3b6ffs/Krystal%20Pitt.png?rlkey=nyhzn9cf43lwlsqjpa0hif5pk&raw=1",
  "/trinidad":
    "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&raw=1",
  "/epic-cruise":
    "https://www.dropbox.com/scl/fi/i9atucg76ieovbmkkqupg/IMG_8522.jpg?rlkey=b74ambfqu21fjbadhidkcy6u7&raw=1",
  // /guyana uses a bundled local asset (carnival-4.jpg). Resolve from dist
  // assets at transcode time so we don't depend on the hashed filename here.
  "/guyana": "asset:carnival-4",
  // Trinidad Carnival 2027 uses the same hero as the Trinidad destination.
  "/trinidad-carnival-2027":
    "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&raw=1",
  // Services already ship 1200-ish source images under /images/services/.
  // We still transcode them to 1200×630 so previews render correctly.
  "/services/carnival-makeup": "/images/services/makeup-hero.jpg",
  "/services/carnival-hair": "/images/services/hair-hero.jpg",
  "/services/carnival-photoshoot": "/images/services/photoshoot-hero.jpg",
  "/services/getting-dressed": "/images/services/getting-dressed-hero.jpg",
  "/services/carnival-shuttle": "/images/services/carnival-shuttle-og.jpg",
  // Section / utility routes — pick a relevant on-brand photo per page so
  // no important route falls back to the generic logo card.
  "/about": "/images/services/makeup-hero.jpg",
  "/faq": "/images/services/hair-hero.jpg",
  "/reviews": "/images/services/photoshoot-hero.jpg",
  "/blogs": "/images/services/photoshoot-hero.jpg",
  "/amazon-store": "/images/services/makeup-hero.jpg",
  "/booking-calculator": "/images/services/makeup-hero.jpg",
  "/best-carnival-makeup-trinidad":
    "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&raw=1",
  "/best-carnival-makeup-jamaica":
    "https://www.dropbox.com/scl/fi/a2s2gnuk6k1zurq8296ee/IMG_6662.jpg?rlkey=l0ekybyz3r68kohd6bbxjx2ro&raw=1",
  "/best-carnival-makeup-miami":
    "https://www.dropbox.com/scl/fi/x4z9o06d4h5ite4v2ph4g/Kayla.png?rlkey=o33o2vlxhcqidxgewnhp4wuh0&raw=1",
};

function slugForRoute(path: string): string {
  return path.replace(/^\//, "").replace(/\//g, "-");
}

async function transcodeOgImage(slug: string, source: string): Promise<string | null> {
  try {
    const outDir = join(DIST, "og");
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, `route-${slug}.jpg`);
    let buf: Buffer;
    if (source.startsWith("asset:")) {
      const basename = source.slice("asset:".length);
      const assetsDir = join(DIST, "assets");
      if (!existsSync(assetsDir)) return null;
      const { readdirSync } = await import("fs");
      const files = readdirSync(assetsDir);
      const re = new RegExp(
        `^${basename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-[A-Za-z0-9_-]+\\.(webp|png|jpe?g)$`,
      );
      const hit = files.find((f) => re.test(f));
      if (!hit) return null;
      buf = readFileSync(join(assetsDir, hit));
    } else if (source.startsWith("/")) {
      const localFile = join(DIST, source.replace(/^\//, ""));
      if (!existsSync(localFile)) return null;
      buf = readFileSync(localFile);
    } else {
      const res = await fetch(source);
      if (!res.ok) return null;
      buf = Buffer.from(await res.arrayBuffer());
    }
    await sharp(buf)
      .resize(OG_W, OG_H, { fit: "cover", position: "centre" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outFile);
    return `${BASE_URL}/og/route-${slug}.jpg`;
  } catch (err) {
    console.warn(`prerender-routes: og transcode failed for ${slug}:`, err);
    return null;
  }
}

function imageTypeFor(url: string): string {
  const ext = url.split("?")[0].split("#")[0].toLowerCase();
  if (ext.endsWith(".webp")) return "image/webp";
  if (ext.endsWith(".png")) return "image/png";
  if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
}

type RouteMeta = {
  /** Absolute path beginning with "/" — used for canonical and file path. */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  /** Optional JSON-LD blocks to inject as <script type="application/ld+json"> before </head>. */
  jsonLd?: object[];
};

// Per-destination meta mirrors src/data/destinations.ts (metaTitle /
// metaDescription). The Destination route renders for each of these slugs
// at "/<slug>". Atlanta and similar redirect-only routes are intentionally
// excluded. Kept inline (not imported) so this script stays free of the
// app's runtime asset imports.
const destinationRoutes: RouteMeta[] = [
  {
    path: "/jamaica",
    title:
      "Jamaica Carnival Makeup 2027 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Jamaica Carnival 2027 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/saint-lucia",
    title:
      "Saint Lucia Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Saint Lucia Carnival 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/antigua",
    title:
      "Antigua Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Antigua Carnival 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/grenada",
    title:
      "Grenada Spicemas Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Grenada Spicemas 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/barbados",
    title:
      "Barbados Crop Over Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Barbados Crop Over 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/miami",
    title:
      "Miami Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Book sweat-proof Miami Carnival 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/toronto",
    title: "Toronto Carnival Makeup & Glam 2026 | Glam Hub",
    description:
      "Toronto Caribbean carnival glam from Carnival Glam Hub. Expert carnival makeup for Caribana and the diaspora. Book your look for Toronto Carnival now.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/trinidad",
    title:
      "Trinidad Carnival Makeup, Hair & Photoshoots | Carnival Glam Hub",
    description:
      "Trinidad Carnival makeup, hair, photoshoots, getting-dressed and shuttle from one Port of Spain lounge. Trusted by 15,000+ masqueraders since 2017.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/guyana",
    title: "Guyana Carnival Makeup & Glam 2026 | Glam Hub",
    description:
      "Book premium Guyana Carnival makeup, hair, gems and body paint. Sweat-proof carnival glam by professional Caribbean artists.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/epic-cruise",
    title: "Epic Cruise Carnival Makeup & Glam 2027 | Glam Hub",
    description:
      "Book your carnival glam services on the EPIC Cruise. Carnival Glam Hub is aboard the EPIC Carnival Experience for Trinidad Carnival 2027.",
    ogImage: HERO_FALLBACK,
  },
];

// Service + core routes. Title and description must match what each page
// component sets at runtime so Helmet/effect updates don't conflict with
// the static head.
const staticRoutes: RouteMeta[] = [
  {
    path: "/services/carnival-makeup",
    title: "Sweat-Resistant Carnival Makeup | Carnival Glam Hub",
    description:
      "Sweat-resistant Carnival makeup that holds through the road. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua. Trusted by 15,000+ since 2017.",
    ogImage: `${BASE_URL}/images/services/makeup-hero.jpg`,
  },
  {
    path: "/services/carnival-hair",
    title: "Carnival Hair & Hairstyles | Headpiece-Ready | Glam Hub",
    description:
      "Carnival hair and Carnival hairstyles built to hold under feathers, wires and tropical heat — sleek ponies, voluminous curls, braided crowns and headpiece-ready installs. Trinidad, Jamaica, Barbados, Grenada, Antigua.",
    ogImage: `${BASE_URL}/images/services/hair-hero.jpg`,
  },
  {
    path: "/services/carnival-photoshoot",
    title: "Carnival Photoshoot | Costume Photography | Glam Hub",
    description:
      "Professional Carnival photoshoot captured the morning of the parade. In-lounge or outdoor sets, fast turnaround, private gallery delivery. Trinidad, Jamaica, Barbados, Grenada, Antigua.",
    ogImage: `${BASE_URL}/images/services/photoshoot-hero.jpg`,
  },
  {
    path: "/services/getting-dressed",
    title: "Carnival Costume Getting-Dressed Assistance | Carnival Glam Hub",
    description:
      "Professional getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars, harnesses. Included in concierge packages across Trinidad, Jamaica, Barbados, Grenada and Antigua.",
    ogImage: `${BASE_URL}/images/services/getting-dressed-hero.jpg`,
  },
  {
    path: "/services/carnival-shuttle",
    title: "Carnival Shuttle Service | Trinidad Transport | Glam Hub",
    description:
      "Carnival shuttle service from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed; additional territories available seasonally. Group capacity available.",
    ogImage: `${BASE_URL}/images/services/carnival-shuttle-og.jpg`,
  },
  {
    path: "/about",
    title: "About Carnival Glam Hub | Caribbean Beauty Concierge",
    description:
      "The Caribbean's premium Carnival beauty concierge. Founded by Gabrielle Waite in 2017. Trusted by 15,000+ masqueraders across Trinidad, Jamaica and beyond.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/faq",
    title:
      "Carnival Glam Hub FAQ | Booking, Makeup & Shuttle Answers",
    description:
      "Answers to the most common questions about booking Carnival Glam Hub: makeup, hair, photoshoot, getting-dressed, shuttle, deposits, cancellations and what to bring on Carnival morning.",
  },
  {
    path: "/reviews",
    title: "Carnival Glam Hub Reviews | Real Client Carnival Makeup Testimonials",
    description:
      "Read real reviews from Carnival Glam Hub clients. Authentic testimonials from women who booked carnival makeup and glam services for Miami, Toronto, Barbados, and the Caribbean.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/amazon-store",
    title: "Carnival Glam Hub Amazon Storefront | Carnival Makeup Essentials",
    description:
      "Shop the Carnival Glam Hub Amazon storefront — curated Carnival makeup, hair, costume and lounge essentials hand-picked by our team.",
  },
  {
    path: "/booking-calculator",
    title: "Carnival Glam Quote Calculator | Carnival Glam Hub",
    description:
      "Get a personalised Carnival morning quote in three steps. Sweat-proof makeup, hair, dressing, photoshoot and shuttle, priced for your party size and territory.",
  },
  {
    path: "/blogs",
    title: "Carnival Beauty and Travel Journal | Carnival Glam Hub",
    description:
      "Guides, tips and stories on Carnival makeup, hair, costumes and travel for masqueraders across the Caribbean and the diaspora. Read the journal.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/trinidad-carnival-2027",
    title: "Trinidad Carnival 2027 Makeup & Hair | Glam Hub",
    description:
      "Trinidad Carnival 2027 dates: Carnival Monday 8 and Tuesday 9 February 2027. Hair, makeup and photos from the Hilton, 2 minutes from the Savannah. Book early from US$50.",
    ogImage: HERO_FALLBACK,
  },
];

const allRoutes: RouteMeta[] = [...destinationRoutes, ...staticRoutes];

// ============================================================
// JSON-LD enrichment
// Attach BreadcrumbList + (Service / Event / Reviewed Business)
// schemas to each prerendered route so crawlers see them in the
// static HEAD. The runtime React copies of these schemas have
// been removed from the page components to prevent duplicates
// after hydration.
// ============================================================

const ORG_ID = `${BASE_URL}/#organization`;
const PROVIDER = { "@id": ORG_ID };
const CARIBBEAN_AREAS = [
  "Trinidad and Tobago",
  "Jamaica",
  "Barbados",
  "Grenada",
  "Antigua and Barbuda",
  "Saint Lucia",
];

function homeCrumb(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${BASE_URL}${path}` },
    ],
  };
}

function sectionCrumb(section: string, name: string, path: string) {
  // Sections (Services, Destinations) don't have their own index URL —
  // anchor them to the homepage so position 2 still resolves.
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: section, item: `${BASE_URL}/#${section.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name, item: `${BASE_URL}${path}` },
    ],
  };
}

type ServiceMeta = {
  name: string;
  serviceType: string;
  crumb: string;
  extraOffer?: object;
};

const SERVICE_META: Record<string, ServiceMeta> = {
  "/services/carnival-makeup": {
    name: "Sweat-Resistant Carnival Makeup",
    serviceType: "Carnival Makeup",
    crumb: "Carnival Makeup",
    extraOffer: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "160",
      highPrice: "2000",
      offerCount: "4",
      availability: "https://schema.org/InStock",
      url: "https://carnivalglamhub.masos.app/events",
    },
  },
  "/services/carnival-hair": {
    name: "Carnival Hair Styling",
    serviceType: "Carnival Hair Styling",
    crumb: "Carnival Hair",
  },
  "/services/carnival-photoshoot": {
    name: "Carnival Photoshoot",
    serviceType: "Carnival Photoshoot",
    crumb: "Carnival Photoshoot",
  },
  "/services/getting-dressed": {
    name: "Carnival Costume Getting-Dressed Assistance",
    serviceType: "Costume Dressing",
    crumb: "Getting Dressed",
  },
  "/services/carnival-shuttle": {
    name: "Carnival Shuttle Service",
    serviceType: "Carnival Shuttle",
    crumb: "Carnival Shuttle",
  },
};

const DEST_AREA: Record<string, object> = {
  "/jamaica": { "@type": "Country", name: "Jamaica" },
  "/saint-lucia": { "@type": "Country", name: "Saint Lucia" },
  "/antigua": { "@type": "Country", name: "Antigua and Barbuda" },
  "/grenada": { "@type": "Country", name: "Grenada" },
  "/barbados": { "@type": "Country", name: "Barbados" },
  "/miami": {
    "@type": "City",
    name: "Miami",
    containedInPlace: { "@type": "Country", name: "United States" },
  },
  "/toronto": {
    "@type": "City",
    name: "Toronto",
    containedInPlace: { "@type": "Country", name: "Canada" },
  },
  "/trinidad": { "@type": "Country", name: "Trinidad and Tobago" },
  "/guyana": { "@type": "Country", name: "Guyana" },
  "/epic-cruise": { "@type": "Place", name: "EPIC Carnival Experience cruise" },
  "/trinidad-carnival-2027": { "@type": "Country", name: "Trinidad and Tobago" },
};

const DEST_CRUMB: Record<string, string> = {
  "/jamaica": "Jamaica Carnival",
  "/saint-lucia": "Saint Lucia Carnival",
  "/antigua": "Antigua Carnival",
  "/grenada": "Grenada Spicemas",
  "/barbados": "Barbados Crop Over",
  "/miami": "Miami Carnival",
  "/toronto": "Toronto Caribana",
  "/trinidad": "Trinidad Carnival",
  "/guyana": "Guyana Carnival",
  "/epic-cruise": "Epic Cruise — Trinidad Carnival",
  "/trinidad-carnival-2027": "Trinidad Carnival 2027",
};

function buildJsonLd(route: RouteMeta): object[] {
  const url = `${BASE_URL}${route.path}`;
  const blocks: object[] = [];

  // 1) BreadcrumbList for every route.
  if (route.path.startsWith("/services/")) {
    const meta = SERVICE_META[route.path];
    blocks.push(sectionCrumb("Services", meta?.crumb ?? route.title, route.path));
  } else if (DEST_AREA[route.path]) {
    blocks.push(sectionCrumb("Destinations", DEST_CRUMB[route.path] ?? route.title, route.path));
  } else {
    // Map known static routes to friendly crumb names.
    const NAME: Record<string, string> = {
      "/about": "About",
      "/faq": "FAQ",
      "/reviews": "Reviews",
      "/amazon-store": "Amazon Storefront",
      "/booking-calculator": "Quote Calculator",
      "/blogs": "Journal",
    };
    blocks.push(homeCrumb(NAME[route.path] ?? route.title, route.path));
  }

  // 2) Service node for /services/* and destinations.
  if (route.path.startsWith("/services/")) {
    const meta = SERVICE_META[route.path];
    if (meta) {
      const service: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: meta.name,
        serviceType: meta.serviceType,
        url,
        description: route.description,
        provider: PROVIDER,
        areaServed: CARIBBEAN_AREAS,
      };
      if (meta.extraOffer) service.offers = meta.extraOffer;
      blocks.push(service);
    }
  } else if (DEST_AREA[route.path]) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${DEST_CRUMB[route.path]} Glam Concierge`,
      serviceType: "Carnival morning concierge (makeup, hair, dressing, photoshoot, shuttle)",
      url,
      description: route.description,
      provider: PROVIDER,
      areaServed: DEST_AREA[route.path],
    });
  }

  // 3) Trinidad 2027 gets its real Event + reviewed-business schemas in
  // the static head as well (moved out of the page component).
  if (route.path === "/trinidad-carnival-2027") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Trinidad Carnival 2027 — Glam Hub Morning Concierge",
      startDate: "2027-02-08T04:00:00-04:00",
      endDate: "2027-02-09T20:00:00-04:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      url,
      description:
        "Trinidad Carnival 2027 makeup, hair, photoshoot, getting-dressed, seamstress and shuttle — by Carnival Glam Hub.",
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
        url: BASE_URL,
      },
      offers: {
        "@type": "Offer",
        url,
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        price: "50",
        validFrom: "2026-05-01",
      },
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${url}#business`,
      name: "Carnival Glam Hub",
      alternateName: "Carnival Glam Hub — Trinidad Carnival",
      url,
      sameAs: ["https://www.wikidata.org/wiki/Q140323641"],
      image: `${BASE_URL}/og/trinidad-carnival-2027.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Port of Spain",
        addressCountry: "TT",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "43",
        bestRating: "5",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Ashley Trini S" },
          reviewBody:
            "5 stars across the board for the experience! I chose Carnival Glam Hub for Carnival Monday and went with a different service on Tuesday. I completely prefer Glam Hub and will be using them for both days next year for 2027 Carnival.",
          reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: "5" },
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Kerra Denel" },
          reviewBody:
            "I had the most amazing experience at Carnival Glam Hub! From start to finish, everything was seamless. My appointment started right on time — which is everything during Carnival season — and the entire process was professional and organised.",
          reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: "5" },
        },
      ],
    });
  }

  return blocks;
}

for (const r of allRoutes) {
  r.jsonLd = buildJsonLd(r);
}

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rewriteHead(template: string, route: RouteMeta): string {
  const url = `${BASE_URL}${route.path}`;
  const title = route.title;
  const desc = route.description;
  const image = route.ogImage ?? DEFAULT_OG;
  const imageType = route.ogImage ? imageTypeFor(image) : DEFAULT_OG_TYPE;
  const ogType = route.ogType ?? "website";

  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  );

  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(desc)}">`,
  );

  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="${ogType}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image"[^>]*>/i,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:secure_url"[^>]*>/i,
    `<meta property="og:image:secure_url" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:alt"[^>]*>/i,
    `<meta property="og:image:alt" content="${escapeAttr(title)}" />`,
  );

  // og:image:type — match the real file extension for custom hero images.
  if (/<meta\s+property="og:image:type"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+property="og:image:type"[^>]*>/i,
      `<meta property="og:image:type" content="${imageType}" />`,
    );
  }
  // Every prerendered OG image is a 1200×630 JPEG (either transcoded here
  // or the pre-existing /og-home.jpg / /og-image.png), so keep explicit
  // dimensions so Facebook/WhatsApp render them without cropping.
  html = html.replace(
    /<meta\s+property="og:image:width"[^>]*>/i,
    `<meta property="og:image:width" content="${OG_W}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:height"[^>]*>/i,
    `<meta property="og:image:height" content="${OG_H}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:url"[^>]*>/i,
    `<meta name="twitter:url" content="${escapeAttr(url)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:image"[^>]*>/i,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:image:alt"[^>]*>/i,
    `<meta name="twitter:image:alt" content="${escapeAttr(title)}" />`,
  );
  // twitter:card must be summary_large_image
  if (!/<meta\s+name="twitter:card"[^>]*>/i.test(html)) {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:card" content="summary_large_image" />\n  </head>`,
    );
  }
  if (/<meta\s+name="twitter:title"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:title"[^>]*>/i,
      `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:title" content="${escapeAttr(title)}">\n  </head>`,
    );
  }
  if (/<meta\s+name="twitter:description"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:description"[^>]*>/i,
      `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:description" content="${escapeAttr(desc)}">\n  </head>`,
    );
  }

  // JSON-LD: inject per-route blocks just before </head>. Escape "<" as
  // \u003c so the script body cannot terminate the surrounding tag.
  if (route.jsonLd && route.jsonLd.length > 0) {
    const scripts = route.jsonLd
      .map(
        (block) =>
          `    <script type="application/ld+json" data-prerender="route">${JSON.stringify(
            block,
          ).replace(/</g, "\\u003c")}</script>`,
      )
      .join("\n");
    html = html.replace("</head>", `${scripts}\n  </head>`);
  }

  return html;
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("prerender-routes: dist/index.html not found, skipping.");
    return;
  }
  const template = readFileSync(indexPath, "utf8");

  // Transcode every route's hero to a 1200×630 JPEG so social crawlers
  // never fall back to the generic brand logo. Failures leave the route
  // on its declared ogImage (or HERO_FALLBACK) — never blocks the build.
  for (const route of allRoutes) {
    const source = ROUTE_HERO_SOURCES[route.path];
    if (!source) continue;
    const transcoded = await transcodeOgImage(slugForRoute(route.path), source);
    if (transcoded) route.ogImage = transcoded;
  }

  let written = 0;
  for (const route of allRoutes) {
    const html = rewriteHead(template, route);
    const dir = join(DIST, route.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    written++;

    // Destinations are also linked as /destinations/<slug> in older
    // content. The SPA redirects those to /<slug> client-side, but the
    // initial HTML social crawlers fetch is the homepage fallback with
    // generic metadata. Emit the same per-route HTML under
    // /destinations/<slug>/ so previews are correct on either URL.
    if (DEST_AREA[route.path]) {
      const aliasDir = join(DIST, "destinations", route.path.replace(/^\//, ""));
      mkdirSync(aliasDir, { recursive: true });
      writeFileSync(join(aliasDir, "index.html"), html);
      written++;
    }
  }
  console.log(`prerender-routes: wrote ${written} per-route HTML files.`);
}

main().catch((err) => {
  console.error("prerender-routes failed:", err);
  process.exit(0); // never block the build
});