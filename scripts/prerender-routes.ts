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

const BASE_URL = "https://www.carnivalglamhub.com";
const DIST = resolve("dist");
const DEFAULT_OG = `${BASE_URL}/og-image.png`;
const DEFAULT_OG_TYPE = "image/png";
const DEFAULT_OG_W = 1200;
const DEFAULT_OG_H = 630;
const HERO_FALLBACK = `${BASE_URL}/hero-1920.webp`;

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
      "Jamaica Carnival Makeup 2027 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
    description:
      "Book sweat-proof Jamaica Carnival 2027 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/saint-lucia",
    title:
      "Saint Lucia Carnival Makeup 2026 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
    description:
      "Book sweat-proof Saint Lucia Carnival 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/antigua",
    title:
      "Antigua Carnival Makeup 2026 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
    description:
      "Book sweat-proof Antigua Carnival 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/grenada",
    title:
      "Grenada Spicemas Makeup 2026 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
    description:
      "Book sweat-proof Grenada Spicemas 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/barbados",
    title:
      "Barbados Crop Over Makeup 2026 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
    description:
      "Book sweat-proof Barbados Crop Over 2026 makeup, hair, costume dressing, photoshoot and shuttle in one location. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/miami",
    title:
      "Miami Carnival Makeup 2026 | Sweat-Proof Glam, Hair & Photos | Carnival Glam Hub",
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
    title: "Carnival Photoshoot | Professional Costume Photography | Carnival Glam Hub",
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
    title: "Carnival Shuttle Service | Trinidad Carnival Transport | Carnival Glam Hub",
    description:
      "Carnival shuttle service from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed; additional territories available seasonally. Group capacity available.",
    ogImage: `${BASE_URL}/images/services/carnival-shuttle.webp`,
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
      "Carnival Glam Hub FAQ | Carnival Makeup, Hair, Shuttle and Booking Answers",
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
    path: "/trinidad-carnival-2027",
    title: "Trinidad Carnival 2027 Makeup & Hair | Glam Hub",
    description:
      "Trinidad Carnival 2027 dates: Carnival Monday 8 and Tuesday 9 February 2027. Hair, makeup and photos from the Hilton, 2 minutes from the Savannah. Book early from US$50.",
    ogImage: HERO_FALLBACK,
  },
];

const allRoutes: RouteMeta[] = [...destinationRoutes, ...staticRoutes];

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
  const hasCustomImage = Boolean(route.ogImage);
  const image = route.ogImage ?? DEFAULT_OG;
  const imageType = hasCustomImage ? imageTypeFor(image) : DEFAULT_OG_TYPE;
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
  // When the route has its own hero image, strip the placeholder's
  // hardcoded 1200x630 dimensions so platforms read real dimensions.
  if (hasCustomImage) {
    html = html.replace(/\s*<meta\s+property="og:image:width"[^>]*>/i, "");
    html = html.replace(/\s*<meta\s+property="og:image:height"[^>]*>/i, "");
  }

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

  return html;
}

function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("prerender-routes: dist/index.html not found, skipping.");
    return;
  }
  const template = readFileSync(indexPath, "utf8");

  let written = 0;
  for (const route of allRoutes) {
    const html = rewriteHead(template, route);
    const dir = join(DIST, route.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    written++;
  }
  console.log(`prerender-routes: wrote ${written} per-route HTML files.`);
}

try {
  main();
} catch (err) {
  console.error("prerender-routes failed:", err);
  process.exit(0); // never block the build
}