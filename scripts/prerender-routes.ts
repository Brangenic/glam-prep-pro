// PRICING NOTE: every figure quoted in this file comes from
// src/data/territoryPricing.ts (masos products). Keep them in step with
// that file. Never invent a price here.
// Makeup only US$170 to US$210 single day, US$380 both Trinidad days.
// Named and celebrity artists US$200 to US$580. Photoshoot only US$140 to US$160.
// Hair US$120 to US$220. Full Glam US$430 to US$680.
// Carnival morning access US$35. Barber US$35 (Jamaica and Trinidad only).
// Reels US$80 (Trinidad and Jamaica only).
// Highest price of any product anywhere US$680. Deposit US$50, Trinidad only.
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
import {
  STATION_FAQS,
  STATION_RATE_HIGH,
  STATION_RATE_LOW,
  VENDOR_SPACE_BOTH_DAYS,
  VENDOR_SPACE_PER_DAY,
} from "../src/data/stationRentals";
import { TRINIDAD_ANSWER_SECTIONS } from "../src/data/answerPages";
import { hasSeasonPassed, passedSeasonYear, seasonAwareMeta } from "../src/data/seasons";
import {
  MIAMI_VENUE_NAME,
  MIAMI_VENUE_FAQ,
} from "../src/data/hubTiers";

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
  "/jamaica": "/images/destinations/jamaica-meliza-hernandez.jpg",
  "/saint-lucia":
    "https://www.dropbox.com/scl/fi/wvkuyil1teg9kdvl6wdbp/Alliyah.png?rlkey=q8zy5e0rd8zbtpb2bi2yh6imc&raw=1",
  "/antigua":
    "https://www.dropbox.com/scl/fi/zj9aswskvl80vunhkhdcf/Chloe%20J.png?rlkey=yxp73i1uv8pcwpuink46ty6mv&raw=1",
  "/grenada": "/images/destinations/grenada-hero-radisson.jpg",

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
  // /tobago uses a bundled local asset (carnival-8.jpg) until we have
  // real Tobago photography.
  "/tobago": "asset:carnival-8",
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
  // Section / utility routes, pick a relevant on-brand photo per page so
  // no important route falls back to the generic logo card.
  "/about": "/images/services/makeup-hero.jpg",
  "/faq": "/images/services/hair-hero.jpg",
  "/reviews": "/images/services/photoshoot-hero.jpg",
  "/blogs": "/images/services/photoshoot-hero.jpg",
  "/amazon-store": "/images/services/makeup-hero.jpg",
  "/booking-calculator": "/images/services/makeup-hero.jpg",
  "/station-rentals": "/images/station-rentals/station-rentals-hero.png",
  "/press": "/images/services/photoshoot-hero.jpg",
  "/joinourteam": "/images/station-rentals/station-rentals-hero.png",
  // Portrait illustration: letterboxed onto the brand warm-white canvas
  // (see OG_CONTAIN_ROUTES) so the figures are never cropped.
  "/policies": "/images/policies/refund-policy.png",

  "/best-carnival-makeup-trinidad":
    "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&raw=1",
  "/best-carnival-makeup-jamaica":
    "https://www.dropbox.com/scl/fi/a2s2gnuk6k1zurq8296ee/IMG_6662.jpg?rlkey=l0ekybyz3r68kohd6bbxjx2ro&raw=1",
  "/best-carnival-makeup-miami":
    "https://www.dropbox.com/scl/fi/x4z9o06d4h5ite4v2ph4g/Kayla.png?rlkey=o33o2vlxhcqidxgewnhp4wuh0&raw=1",
};

// Routes whose source art is a portrait illustration rather than a
// landscape photograph. A cover crop would slice the figures' heads off,
// so these are letterboxed ("contain") onto the brand warm-white canvas
// with a gold rule along the bottom edge, which reads as deliberate.
const OG_CONTAIN_ROUTES = new Set<string>(["/policies"]);

/** Brand warm white, hsl(40 20% 97%) from src/index.css --background. */
const OG_CANVAS = { r: 249, g: 248, b: 246, alpha: 1 };
/** Brand gold, hsl(43 72% 50%) from src/index.css --primary. */
const OG_RULE_HEX = "#dba724";

// og:image:alt / twitter:image:alt. Where a route ships a real photograph
// or illustration, describe the picture rather than repeating the title.
// Routes not listed here fall back to the page title.
const OG_IMAGE_ALT: Record<string, string> = {
  "/jamaica":
    "Masquerader in a Jamaica Carnival costume with sweat-resistant Carnival Glam Hub makeup",
  "/saint-lucia":
    "Masquerader in a Saint Lucia Carnival costume with Carnival Glam Hub makeup and headpiece",
  "/antigua":
    "Masquerader in an Antigua Carnival costume with Carnival Glam Hub makeup",
  "/grenada":
    "Masquerader in a Grenada Spicemas costume with Carnival Glam Hub makeup",
  "/barbados":
    "Masquerader in a Barbados Crop Over costume with Carnival Glam Hub makeup",
  "/miami":
    "Masquerader in a Miami Carnival costume with Carnival Glam Hub makeup",
  "/toronto":
    "Masquerader in a Toronto Caribana costume with Carnival Glam Hub makeup",
  "/trinidad":
    "Masquerader in a Trinidad Carnival costume with sweat-resistant Carnival Glam Hub makeup",
  "/tobago":
    "Masquerader in Carnival costume with Carnival Glam Hub makeup for Tobago Carnival",
  "/guyana":
    "Masquerader in Carnival costume with Carnival Glam Hub makeup for Guyana Carnival",
  "/epic-cruise":
    "Masquerader glammed by Carnival Glam Hub aboard the EPIC Carnival Experience cruise",
  "/trinidad-carnival-2027":
    "Masquerader in a Trinidad Carnival costume glammed by Carnival Glam Hub for the 2027 season",
  "/services/carnival-makeup":
    "Carnival Glam Hub artist applying sweat-resistant Carnival makeup to a masquerader",
  "/services/carnival-hair":
    "Carnival Glam Hub stylist setting a headpiece-ready Carnival hairstyle",
  "/services/carnival-photoshoot":
    "Masquerader photographed in full Carnival costume at a Carnival Glam Hub photoshoot",
  "/services/getting-dressed":
    "Carnival Glam Hub team fitting a masquerader into a wire-bra Carnival costume",
  "/services/carnival-shuttle":
    "Masqueraders leaving the Carnival Glam Hub lounge for the Carnival shuttle",
  "/about":
    "Carnival Glam Hub artist at work on a masquerader on Carnival morning",
  "/faq":
    "Carnival Glam Hub stylist finishing a masquerader's Carnival hair in the lounge",
  "/reviews":
    "Masquerader in full Carnival costume photographed by the Carnival Glam Hub team",
  "/blogs":
    "Masquerader in full Carnival costume photographed by the Carnival Glam Hub team",
  "/press":
    "Masquerader in full Carnival costume photographed by the Carnival Glam Hub team on Carnival morning",
  "/amazon-store":
    "Professional Carnival makeup products laid out at a Carnival Glam Hub station",
  "/booking-calculator":
    "Carnival Glam Hub artist applying Carnival makeup at a lounge station",
  "/station-rentals":
    "Carnival Glam Hub makeup station rentals, a gold branded director's chair beside a lit vanity of professional makeup products",
  "/joinourteam":
    "A Carnival Glam Hub station set up for an artist on Carnival morning",
  "/policies":
    "Illustration of two Glam Hub team members reviewing a refund request form",
  "/best-carnival-makeup-trinidad":
    "Masquerader in a Trinidad Carnival costume with sweat-resistant Carnival Glam Hub makeup",
  "/best-carnival-makeup-jamaica":
    "Masquerader in a Jamaica Carnival costume with sweat-resistant Carnival Glam Hub makeup",
  "/best-carnival-makeup-miami":
    "Masquerader in a Miami Carnival costume with sweat-resistant Carnival Glam Hub makeup",
};



function slugForRoute(path: string): string {
  return path.replace(/^\//, "").replace(/\//g, "-");
}

async function transcodeOgImage(
  slug: string,
  source: string,
  mode: "cover" | "contain" = "cover",
): Promise<string | null> {
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
    if (mode === "contain") {
      const RULE_H = 14;
      const rule = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${RULE_H}"><rect width="${OG_W}" height="${RULE_H}" fill="${OG_RULE_HEX}"/></svg>`,
      );
      await sharp(buf)
        .resize(OG_W, OG_H - RULE_H, {
          fit: "contain",
          background: OG_CANVAS,
        })
        .extend({ bottom: RULE_H, background: OG_CANVAS })
        .composite([{ input: rule, top: OG_H - RULE_H, left: 0 }])
        .flatten({ background: OG_CANVAS })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outFile);
    } else {
      await sharp(buf)
        .resize(OG_W, OG_H, { fit: "cover", position: "centre" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outFile);
    }
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
  /** Absolute path beginning with "/", used for canonical and file path. */
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
      "Jamaica Carnival, Sunday 4 April 2027. Makeup, hair, bronzing, shuttle and photoshoot at our Full Service Glam Hub in Kingston. Book your morning slot.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/saint-lucia",
    title:
      "Saint Lucia Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Sweat-resistant Saint Lucia Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/antigua",
    title:
      "Antigua Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Sweat-resistant Antigua Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/grenada",
    title:
      "Spicemas 2027 Makeup, 9 to 10 August | Grenada Glam Hub",
    description:
      "Spicemas 2027 is Monday 9 and Tuesday 10 August. Grenada Carnival makeup at the Radisson Hotel, band route outside. Pre-register US$50 to 31 December 2026.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/barbados",
    title:
      "Barbados Crop Over Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Sweat-resistant Barbados Crop Over 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/miami",
    title:
      "Miami Carnival Makeup 2026 | Broward Venue | Glam Hub",
    description:
      "Miami Carnival 2026 has moved to Broward: Central Broward Park, Lauderhill. No shuttle this season, so plan your ride. Book makeup, hair and photoshoot.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/toronto",
    title: "Toronto Carnival Makeup & Glam 2026 | Glam Hub",
    description:
      "Toronto Caribana glam from our Glam Hub Lite. Sweat-resistant Carnival makeup, headpiece-ready hair and a photoshoot, by professional Caribbean artists.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/trinidad",
    title:
      "Trinidad Carnival Makeup, Hair & Photoshoots | Glam Hub",
    description:
      "Trinidad Carnival makeup, hair, photoshoots, getting-dressed and shuttle from one Port of Spain lounge. Trusted by 15,000+ masqueraders since 2017.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/tobago",
    title:
      "Tobago Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    description:
      "Sweat-resistant Tobago Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. The Awakening runs 30 October to 1 November 2026. Slots are limited.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/guyana",
    title: "Guyana Carnival Makeup & Glam 2026 | Glam Hub",
    description:
      "Guyana Carnival makeup with a photoshoot at our Glam Hub Lite. Sweat-resistant Carnival glam by professional Caribbean artists, trusted since 2017.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/epic-cruise",
    title: "Epic Cruise Carnival Glam | Returns 2028 | Glam Hub",
    description:
      "The EPIC Cruise Glam Hub returns in 2028 and dates are still to be confirmed. Register your interest with Carnival Glam Hub for the next sailing.",
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
      "Carnival hair built to hold under feathers, wires and tropical heat: sleek ponies, curls, braided crowns and headpiece-ready installs, from US$100.",
    ogImage: `${BASE_URL}/images/services/hair-hero.jpg`,
  },
  {
    path: "/services/carnival-photoshoot",
    title: "Carnival Photoshoot | Costume Photography | Glam Hub",
    description:
      "Professional Carnival photoshoot captured on parade morning. In-lounge or outdoor sets, fast turnaround and private gallery delivery in five territories.",
    ogImage: `${BASE_URL}/images/services/photoshoot-hero.jpg`,
  },
  {
    path: "/services/getting-dressed",
    title: "Carnival Costume Dressing Assistance | Glam Hub",
    description:
      "Getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars and harnesses. Included with the Full Service Glam Hub.",
    ogImage: `${BASE_URL}/images/services/getting-dressed-hero.jpg`,
  },
  {
    path: "/services/carnival-shuttle",
    title: "Carnival Shuttle Service | Trinidad Transport | Glam Hub",
    description:
      "Carnival shuttle from our lounge to your band's start point, included with the Full Service Glam Hub in Jamaica and Trinidad. No shuttle in Miami.",
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
      "Carnival Glam Hub FAQ | Booking and Service Answers",
    description:
      "Answers on booking Carnival Glam Hub: makeup, hair, photoshoot, dressing, shuttle, the US$50 deposit, cancellations and what to bring on the morning.",
  },
  {
    path: "/press",
    title: "Carnival Glam Hub in the Press | Media Coverage",
    description:
      "Carnival Glam Hub media coverage from Teen Vogue, theGrio, the Jamaica Observer, the Jamaica Gleaner, Our Today, CaribVoxx and Haute People.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/reviews",
    title: "Carnival Glam Hub Reviews | Real Client Testimonials",
    description:
      "Real reviews from Carnival Glam Hub clients who booked Carnival makeup, hair and glam across Trinidad, Jamaica, Miami, Toronto and the wider Caribbean.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/amazon-store",
    title: "Amazon Storefront | Carnival Makeup Essentials",
    description:
      "Shop the Carnival Glam Hub Amazon storefront: curated Carnival makeup, hair, costume and lounge essentials, hand-picked by the artists on our team.",
  },
  {
    path: "/booking-calculator",
    title: "Carnival Glam Quote Calculator | Carnival Glam Hub",
    description:
      "Get a personalised Carnival morning quote in three steps. Real Carnival Glam Hub pricing for makeup, hair, photoshoot and Carnival morning access, by territory.",
  },
  {
    path: "/station-rentals",
    title: "Carnival Station Rental for Makeup Artists | Glam Hub",
    description:
      "Rent a station inside a Carnival Glam Hub. Makeup artist and hair stylist stations from US$200 per day, plus vendor and merchandise spaces.",
    ogImage: `${BASE_URL}/images/station-rentals/station-rentals-hero.png`,
  },
  {
    path: "/policies",
    title: "Terms, Refund Policy and Privacy Policy | Carnival Glam Hub",
    description:
      "Carnival Glam Hub booking terms, deposit and refund policy, cancellation and transfer rules, referral terms and privacy policy. Effective 24 August 2026.",
    ogImage: `${BASE_URL}/images/policies/refund-policy.png`,
  },

  {
    path: "/blogs",
    title: "Carnival Beauty and Travel Journal | Carnival Glam Hub",
    description:
      "Guides, tips and stories on Carnival makeup, hair, costumes and travel for masqueraders across the Caribbean and the diaspora. Read the journal.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/joinourteam",
    title: "Join Our Team | Carnival Glam Hub Careers",
    description:
      "Work Carnival mornings with us. We hire makeup artists, hair stylists, photographers, dressers and front of house crew across the Caribbean diaspora.",
  },
  {
    path: "/trinidad-carnival-2027",
    title: "Trinidad Carnival 2027 Makeup & Hair | Glam Hub",
    description:
      "Trinidad Carnival 2027 runs Monday 8 and Tuesday 9 February. Hair, makeup and photos from the Hilton, two minutes from the Savannah. US$50 books a slot.",
    ogImage: HERO_FALLBACK,
  },
];

// Answer-first commercial pages targeting "best carnival makeup artist in <territory>".
const answerRoutes: RouteMeta[] = [
  {
    path: "/best-carnival-makeup-trinidad",
    title: "Best Carnival Makeup Artist in Trinidad | Carnival Glam Hub",
    description:
      "Sweat-resistant Trinidad Carnival makeup, hair, dressing, photos and shuttle from the Hilton and The BRIX, minutes from the Savannah. Since 2017.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/best-carnival-makeup-jamaica",
    title: "Best Carnival Makeup Artist in Jamaica | Carnival Glam Hub",
    description:
      "Sweat-resistant Jamaica Carnival road glam from the Jamaica Pegasus Hotel in Kingston, with hair, dressing, photos and shuttle all in one location.",
    ogImage: HERO_FALLBACK,
  },
  {
    path: "/best-carnival-makeup-miami",
    title: "Best Carnival Makeup Artist in Miami | Carnival Glam Hub",
    description:
      "Carnival Glam Hub is the best carnival makeup artist for Miami Carnival, sweat-resistant road glam plus hair, dressing, photos and shuttle in one location.",
    ogImage: HERO_FALLBACK,
  },
];

const allRoutes: RouteMeta[] = [...destinationRoutes, ...staticRoutes, ...answerRoutes];

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
  // Sections (Services, Destinations) don't have their own index URL, // anchor them to the homepage so position 2 still resolves.
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
      lowPrice: "170",
      highPrice: "580",
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
  "/tobago": { "@type": "Country", name: "Trinidad and Tobago" },
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
  "/tobago": "Tobago Carnival",
  "/guyana": "Guyana Carnival",
  "/epic-cruise": "Epic Cruise, Trinidad Carnival",
  "/trinidad-carnival-2027": "Trinidad Carnival 2027",
};

// A territory whose season has passed keeps its page, its indexing and
// its prerendered head, but the head stops selling a Carnival that is
// over. Title and description are rewritten from the season calendar in
// src/data/seasons.ts, exactly as the runtime page does, so crawler and
// human see the same thing. Nothing here is hardcoded per slug.
for (const route of destinationRoutes) {
  const slug = route.path.replace(/^\//, "");
  if (!hasSeasonPassed(slug)) continue;
  const eventName = DEST_CRUMB[route.path] ?? route.title;
  const meta = seasonAwareMeta(slug, eventName, route.title, route.description);
  route.title = meta.title;
  route.description = meta.description;
}

// ---------- Answer-page metadata (Task 1) ----------
type AnswerMeta = {
  crumb: string;
  territoryName: string;
  areaServed: object;
  destPath: string;
  faqs: { q: string; a: string }[];
};
const ANSWER_META: Record<string, AnswerMeta> = {
  "/best-carnival-makeup-trinidad": {
    crumb: "Best Carnival Makeup Artist in Trinidad",
    territoryName: "Trinidad",
    areaServed: { "@type": "Country", name: "Trinidad and Tobago" },
    destPath: "/trinidad",
    // Questions and answers come from the shared answer-page module, so the
    // FAQPage schema always matches the visible H2 headings on the page.
    faqs: TRINIDAD_ANSWER_SECTIONS.map((sx) => ({ q: sx.q, a: sx.a })),
  },
  "/best-carnival-makeup-jamaica": {
    crumb: "Best Carnival Makeup Artist in Jamaica",
    territoryName: "Jamaica",
    areaServed: { "@type": "Country", name: "Jamaica" },
    destPath: "/jamaica",
    faqs: [
      { q: "Who is the best carnival makeup artist in Jamaica?", a: "Carnival Glam Hub. Founded in 2017 by Gabrielle Waite (Gabby Glam) with booking director Kibwe McGann, it is the Jamaica Carnival service that combines sweat-resistant road makeup with hair, gem application, body paint, lashes, dressing, photos and shuttle from one Kingston lounge." },
      { q: "Where is the Jamaica glam hub located?", a: "At the Jamaica Pegasus Hotel in Kingston. Everything happens in one air-conditioned location, makeup, hair, dressing, photos and shuttle so you leave with the band." },
      { q: "How much does Jamaica carnival makeup cost?", a: "Carnival morning access is US$35. Makeup only is US$200, named and celebrity artists run US$200 to US$350, photoshoot only is US$160, hair is US$120 to US$185 and Full Glam is US$440. A barber is available at US$35. Your booking team confirms final pricing before payment." },
      { q: "Does the makeup survive the Jamaica heat?", a: "Yes, the sweat-resistant Carnival Glam Hub system is built for tropical heat and holds 10–12 hours from morning through last lap." },
    ],
  },
  "/best-carnival-makeup-miami": {
    crumb: "Best Carnival Makeup Artist in Miami",
    territoryName: "Miami",
    areaServed: { "@type": "City", name: "Miami", containedInPlace: { "@type": "Country", name: "United States" } },
    destPath: "/miami",
    faqs: [
      { q: "Who is the best carnival makeup artist in Miami?", a: "Carnival Glam Hub. Founded by Gabrielle Waite (Gabby Glam) in 2017 and trusted by 15,000+ masqueraders, it is the only Miami Carnival service that travels the full Caribbean circuit, Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Toronto, Guyana and the EPIC Cruise, with the same senior MUA team." },
      { q: "Where is the Miami glam hub located?", a: "A dedicated Miami Carnival lounge covering Columbus Day weekend, makeup, hair, dressing, photoshoot and shuttle in one location so you arrive at the band on time." },
      { q: "How much does Miami carnival makeup cost?", a: "Carnival morning access is US$35. Makeup only is US$190, makeup and photoshoot is US$310, named and celebrity artists are US$240 to US$360, photoshoot only is US$150, hair is US$130 and Full Glam is US$430." },
      { q: "How does booking work?", a: "Choose your Miami slot at carnivalglamhub.masos.app/events and your booking team will confirm your appointment. Slots are limited and sell out weeks ahead." },
    ],
  },
};

function faqPage(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// HowTo for /services/carnival-makeup prep, steps match the visible on-page copy.
const MAKEUP_HOWTO = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to prep for your Carnival makeup appointment",
  description:
    "Prep steps for a Carnival Glam Hub makeup appointment so your sweat-resistant look holds all day on the road.",
  totalTime: "PT10M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Arrive on a clean face", text: "Arrive on a clean face, no SPF, no primer, no leftover product." },
    { "@type": "HowToStep", position: 2, name: "Eat beforehand", text: "Eat something before you get to the lounge; sessions run around 90 minutes and you will sit through hair and getting-dressed after." },
    { "@type": "HowToStep", position: 3, name: "Bring headpiece, costume and references", text: "Bring your headpiece, any reference photos you want the artist to see, and your costume so the artist can match base tones and shimmer to it." },
    { "@type": "HowToStep", position: 4, name: "Put contacts in first", text: "If you wear contact lenses, put them in before the eye look. Lash strips and adhesives are provided." },
  ],
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
  } else if (ANSWER_META[route.path]) {
    blocks.push(homeCrumb(ANSWER_META[route.path].crumb, route.path));
  } else {
    // Map known static routes to friendly crumb names.
    const NAME: Record<string, string> = {
      "/about": "About",
      "/faq": "FAQ",
      "/press": "Press",
      "/reviews": "Reviews",
      "/amazon-store": "Amazon Storefront",
      "/booking-calculator": "Quote Calculator",
      "/station-rentals": "Station Rentals",
      "/joinourteam": "Join Our Team",
      "/blogs": "Journal",
      "/policies": "Terms and Policies",
    };
    blocks.push(homeCrumb(NAME[route.path] ?? route.title, route.path));
  }

  // 1b) /policies: a plain WebPage node. No FAQPage here on purpose.
  if (route.path === "/policies") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms and Policies",
      url,
      description: route.description,
      dateModified: "2026-08-24",
      publisher: PROVIDER,
    });
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
    // HowTo on the makeup service page, prep steps mirror on-page copy.
    if (route.path === "/services/carnival-makeup") {
      blocks.push(MAKEUP_HOWTO);
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
    // Miami Carnival has moved to Broward County. The announced venue and
    // the no-shuttle warning ship in the crawler-visible head.
    if (route.path === "/miami") {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Place",
        name: MIAMI_VENUE_NAME,
        alternateName: "Fort Lauderdale cricket stadium",
        address: {
          "@type": "PostalAddress",
          streetAddress: "3700 NW 11th Place",
          addressLocality: "Lauderhill",
          addressRegion: "FL",
          postalCode: "33311",
          addressCountry: "US",
        },
      });
      blocks.push(
        faqPage([{ q: MIAMI_VENUE_FAQ.question, a: MIAMI_VENUE_FAQ.answer }]),
      );
    }
    // Grenada Spicemas 2027. The venue and band route facts, the dates,
    // the pre-registration and the Lite inclusions ship in the
    // crawler-visible head, matching the visible page FAQ.
    if (route.path === "/grenada") {
      const gPreReg = getOpenPreRegistration("grenada");
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Place",
        name: GRENADA_VENUE_NAME,
        description: GRENADA_VENUE_NOTE,
        address: { "@type": "PostalAddress", addressCountry: "GD" },
      });
      blocks.push(
        faqPage([
          { q: GRENADA_VENUE_FAQ.question, a: GRENADA_VENUE_FAQ.answer },
          { q: GRENADA_ROUTE_FAQ.question, a: GRENADA_ROUTE_FAQ.answer },
          {
            q: "When is Spicemas 2027?",
            a: "Spicemas 2027 is Monday 9 and Tuesday 10 August 2027 in Grenada. The Carnival Glam Hub for Spicemas 2027 is hosted at the Radisson Hotel, central in Grenada, and the band route starts outside the hotel.",
          },
          ...(gPreReg
            ? [
                {
                  q: "How do I secure my spot for Spicemas 2027?",
                  a: `You secure your spot for Spicemas 2027 with a US$${gPreReg.amount} pre-registration per masquerader, which closes on ${gPreReg.closesOnText}. Pre-registration is not a full booking and no service is included, because no Grenada makeup or photoshoot price is published for 2027 yet.`,
                },
              ]
            : []),
          {
            q: "What is included at the Grenada Glam Hub?",
            a: GRENADA_INCLUSIONS_SENTENCE,
          },
        ]),
      );
    }
  } else if (ANSWER_META[route.path]) {
    const a = ANSWER_META[route.path];
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Best Carnival Makeup Artist in ${a.territoryName}, Carnival Glam Hub`,
      serviceType: "Carnival makeup",
      url,
      description: route.description,
      provider: PROVIDER,
      areaServed: a.areaServed,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "35",
        highPrice: "680",
        offerCount: "4",
        availability: "https://schema.org/InStock",
        url: "https://carnivalglamhub.masos.app/events",
      },
    });
    blocks.push(faqPage(a.faqs));
  }

  // 2b) Station rentals: B2B Service + AggregateOffer + FAQPage.
  if (route.path === "/station-rentals") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Carnival Glam Hub Station Rental",
      url,
      description: route.description,
      provider: PROVIDER,
      areaServed: CARIBBEAN_AREAS,
      audience: {
        "@type": "BusinessAudience",
        name: "Independent Carnival makeup artists and hair stylists renting a station, and vendors selling Monday wear, costume accessories and merchandise from a vendor space",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: String(STATION_RATE_LOW),
        highPrice: String(Math.max(STATION_RATE_HIGH, VENDOR_SPACE_BOTH_DAYS)),
        // Two station offers (Glam Hub Lite per day, Full Service per day),
        // the Full Service both-days rate, and the two flat vendor space
        // rates. Vendor space rates are flat and never tier-derived.
        offerCount: "5",
        availability: "https://schema.org/InStock",
        url,
        offers: [
          {
            "@type": "Offer",
            name: "Station rental, Glam Hub Lite, per day",
            price: String(STATION_RATE_LOW),
            priceCurrency: "USD",
            url,
          },
          {
            "@type": "Offer",
            name: "Station rental, Full Service Glam Hub, per day",
            price: "250",
            priceCurrency: "USD",
            url,
          },
          {
            "@type": "Offer",
            name: "Station rental, Full Service Glam Hub, both days",
            price: String(STATION_RATE_HIGH),
            priceCurrency: "USD",
            url,
          },
          {
            "@type": "Offer",
            name: "Vendor and merchandise space, per day",
            price: String(VENDOR_SPACE_PER_DAY),
            priceCurrency: "USD",
            url: `${url}#vendor-spaces`,
          },
          {
            "@type": "Offer",
            name: "Vendor and merchandise space, both days",
            price: String(VENDOR_SPACE_BOTH_DAYS),
            priceCurrency: "USD",
            url: `${url}#vendor-spaces`,
          },
        ],
      },
    });
    blocks.push(faqPage(STATION_FAQS.map((f) => ({ q: f.q, a: f.a }))));
    blocks.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "Inside a Carnival Glam Hub in Trinidad",
      description:
        "A look inside the Carnival Glam Hub in Trinidad on Carnival morning: the air-conditioned beauty lounge, the stations, reception and the room independent makeup artists and hair stylists rent a station in.",
      thumbnailUrl: ["https://i.ytimg.com/vi/HWFyXB1tyIU/maxresdefault.jpg"],
      uploadDate: "2024-03-01T00:00:00-04:00",
      contentUrl: "https://www.youtube.com/watch?v=HWFyXB1tyIU",
      embedUrl: "https://www.youtube.com/embed/HWFyXB1tyIU",
      publisher: PROVIDER,
    });
  }

  // 3) Trinidad 2027 gets its real Event + reviewed-business schemas in
  // the static head as well (moved out of the page component).
  if (route.path === "/trinidad-carnival-2027") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Trinidad Carnival 2027, Glam Hub Morning Concierge",
      startDate: "2027-02-08T04:00:00-04:00",
      endDate: "2027-02-09T20:00:00-04:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      url,
      description:
        "Trinidad Carnival 2027 makeup, hair, photoshoot, getting-dressed, seamstress and shuttle, by Carnival Glam Hub.",
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
      alternateName: "Carnival Glam Hub, Trinidad Carnival",
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
            "I had the most amazing experience at Carnival Glam Hub! From start to finish, everything was seamless. My appointment started right on time, which is everything during Carnival season, and the entire process was professional and organised.",
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
  const imageAlt = OG_IMAGE_ALT[route.path] ?? title;


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
    `<meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />`,
  );

  // og:image:type, match the real file extension for custom hero images.
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
    `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}" />`,
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
  // on its declared ogImage (or HERO_FALLBACK), never blocks the build.
  for (const route of allRoutes) {
    const source = ROUTE_HERO_SOURCES[route.path];
    if (!source) continue;
    const transcoded = await transcodeOgImage(
      slugForRoute(route.path),
      source,
      OG_CONTAIN_ROUTES.has(route.path) ? "contain" : "cover",
    );

    if (transcoded) route.ogImage = transcoded;
  }

  let written = 0;
  for (const route of allRoutes) {
    const html = rewriteHead(template, route);
    const dir = join(DIST, route.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    written++;

  }

  // /destinations/<slug> aliases: emit a redirect STUB only, never content.
  // A stub keeps the alias URL from serving the homepage shell (which would
  // ship a homepage canonical and the generic og-home.jpg on a subpage URL),
  // while consolidating signals onto the short slug via canonical + meta
  // refresh. Deliberately NO robots noindex: noindex plus canonical is a
  // contradictory signal and would block consolidation.
  for (const route of destinationRoutes) {
    const slug = route.path.replace(/^\//, "");
    const target = `${BASE_URL}/${slug}`;
    const ogImage = route.ogImage?.startsWith("http")
      ? route.ogImage
      : `${BASE_URL}${route.ogImage ?? ""}`;
    const stub = `<!doctype html>
<html lang="en">
  <head>
    <script>location.replace("/${slug}" + location.search + location.hash);</script>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/${slug}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${route.title}</title>
    <meta name="description" content="${route.description.replace(/"/g, "&quot;")}" />
    <link rel="canonical" href="${target}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description.replace(/"/g, "&quot;")}" />
    <meta property="og:url" content="${target}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${target}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${ogImage}" />
  </head>
  <body><a href="/${slug}">Continue to ${route.title}</a></body>
</html>
`;
    const dir = join(DIST, "destinations", slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), stub);
  }
  console.log(
    `prerender-routes: wrote ${destinationRoutes.length} /destinations/* redirect stubs.`,
  );

  // Root-level legacy aliases. /glam-store is the old name for the Amazon
  // storefront, so it is one page under two URLs. It gets its own head and
  // a canonical onto /amazon-store rather than a second self-canonical
  // page, which would split the signals between duplicates. Same stub
  // shape as the /destinations/* aliases: canonical, meta refresh and a
  // JavaScript replace, with a real link in the body so it is never read
  // as a Soft 404.
  const rootAliases: { from: string; to: string }[] = [
    { from: "/glam-store", to: "/amazon-store" },
  ];
  for (const alias of rootAliases) {
    const target = allRoutes.find((r) => r.path === alias.to);
    if (!target) continue;
    const abs = `${BASE_URL}${alias.to}`;
    const ogImage = target.ogImage?.startsWith("http")
      ? target.ogImage
      : `${BASE_URL}${target.ogImage ?? ""}`;
    const desc = target.description.replace(/"/g, "&quot;");
    const stub = `<!doctype html>
<html lang="en">
  <head>
    <script>location.replace("${alias.to}" + location.search + location.hash);</script>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${alias.to}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${target.title}</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${abs}" />
    <meta property="og:title" content="${target.title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${abs}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${abs}" />
    <meta name="twitter:title" content="${target.title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${ogImage}" />
  </head>
  <body>
    <h1>${target.title}</h1>
    <p>The Glam Store has moved. Every Carnival Glam Hub product pick now lives on one page, the Amazon storefront, with the makeup, hair, costume and travel items our artists actually use on Carnival morning.</p>
    <p><a href="${alias.to}">Continue to the Carnival Glam Hub Amazon storefront</a></p>
  </body>
</html>
`;
    const dir = join(DIST, alias.from.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), stub);
  }
  console.log(`prerender-routes: wrote ${rootAliases.length} root alias redirect stubs.`);

  console.log(`prerender-routes: wrote ${written} per-route HTML files.`);

  // Homepage-only VideoObject JSON-LD. The "Glam Hub in Action" YouTube
  // clip is embedded on the home page (src/components/landing/Gallery.tsx)
  // but the schema.org block was only injected client-side, so Google's
  // video crawler never saw it. Add it to dist/index.html AFTER per-route
  // writes so it lands on `/` only, not every subroute.
  const homeVideo = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Carnival Glam Hub Reviews from Trinidad, Jamaica and Miami Masqueraders",
    description:
      "Real masquerader reviews and testimonials of Carnival Glam Hub from Trinidad, Jamaica and Miami. Hear directly from women who booked their Carnival morning with the original Carnival morning concierge for sweat-resistant makeup, hair, getting dressed, photos and shuttle.",
    thumbnailUrl: [`${BASE_URL}/og-home.jpg`],
    uploadDate: "2024-07-02T04:06:01-07:00",
    contentUrl: "https://www.youtube.com/watch?v=W4b98oLRTCE",
    embedUrl: "https://www.youtube.com/embed/W4b98oLRTCE",
    publisher: {
      "@type": "Organization",
      name: "Carnival Glam Hub",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };
  // Homepage BreadcrumbList. Every other route gets one from buildJsonLd,
  // but `/` is written from the template rather than through rewriteHead,
  // so it is injected here. A single-item list, because the homepage is
  // the root of the trail.
  const homeBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    ],
  };
  const homeScripts =
    `    <script type="application/ld+json" data-prerender="home-breadcrumb">${JSON.stringify(
      homeBreadcrumb,
    ).replace(/</g, "\\u003c")}</script>\n` +
    `    <script type="application/ld+json" data-prerender="home-video">${JSON.stringify(
      homeVideo,
    ).replace(/</g, "\\u003c")}</script>\n  </head>`;
  const homeHtml = readFileSync(indexPath, "utf8");
  writeFileSync(indexPath, homeHtml.replace("</head>", homeScripts));
  console.log(
    "prerender-routes: injected homepage BreadcrumbList and VideoObject JSON-LD.",
  );
}

main().catch((err) => {
  console.error("prerender-routes failed:", err);
  process.exit(0); // never block the build
});