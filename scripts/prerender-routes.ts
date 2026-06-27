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
import { destinations } from "../src/data/destinations";

const BASE_URL = "https://www.carnivalglamhub.com";
const DIST = resolve("dist");
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

type RouteMeta = {
  /** Absolute path beginning with "/" — used for canonical and file path. */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
};

// Per-destination meta sourced from src/data/destinations.ts (metaTitle /
// metaDescription). The Destination route renders for each of these slugs
// at "/<slug>". Atlanta and similar redirect-only routes are intentionally
// excluded.
const destinationRoutes: RouteMeta[] = destinations.map((d) => ({
  path: `/${d.slug}`,
  title: d.metaTitle,
  description: d.metaDescription,
  ogImage: typeof d.image === "string" && /^https?:\/\//.test(d.image) ? d.image : DEFAULT_OG,
}));

// Service + core routes. Title and description must match what each page
// component sets at runtime so Helmet/effect updates don't conflict with
// the static head.
const staticRoutes: RouteMeta[] = [
  {
    path: "/services/carnival-makeup",
    title: "Sweat-Resistant Carnival Makeup | Carnival Glam Hub",
    description:
      "Sweat-resistant Carnival makeup that holds through the road. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua. Trusted by 15,000+ since 2017.",
  },
  {
    path: "/services/carnival-hair",
    title: "Carnival Hair & Hairstyles | Headpiece-Ready | Glam Hub",
    description:
      "Carnival hair and Carnival hairstyles built to hold under feathers, wires and tropical heat — sleek ponies, voluminous curls, braided crowns and headpiece-ready installs. Trinidad, Jamaica, Barbados, Grenada, Antigua.",
  },
  {
    path: "/services/carnival-photoshoot",
    title: "Carnival Photoshoot | Professional Costume Photography | Carnival Glam Hub",
    description:
      "Professional Carnival photoshoot captured the morning of the parade. In-lounge or outdoor sets, fast turnaround, private gallery delivery. Trinidad, Jamaica, Barbados, Grenada, Antigua.",
  },
  {
    path: "/services/getting-dressed",
    title: "Carnival Costume Getting-Dressed Assistance | Carnival Glam Hub",
    description:
      "Professional getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars, harnesses. Included in concierge packages across Trinidad, Jamaica, Barbados, Grenada and Antigua.",
  },
  {
    path: "/services/carnival-shuttle",
    title: "Carnival Shuttle Service | Trinidad Carnival Transport | Carnival Glam Hub",
    description:
      "Carnival shuttle service from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed; additional territories available seasonally. Group capacity available.",
  },
  {
    path: "/about",
    title: "About Carnival Glam Hub | Caribbean Beauty Concierge",
    description:
      "The Caribbean's premium Carnival beauty concierge. Founded by Gabrielle Waite in 2017. Trusted by 15,000+ masqueraders across Trinidad, Jamaica and beyond.",
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
  const image = route.ogImage ?? DEFAULT_OG;
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