// Postbuild: browserless per-route content injection.
//
// The deploy environment does NOT have Chromium available, so any
// Playwright-based prerender silently no-ops in production and every
// route ships with an empty `<div id="root"></div>`, which is invisible
// to non-JS crawlers (GPTBot, PerplexityBot, ClaudeBot, CCBot, older
// search bots).
//
// This script fixes that by injecting a curated static content block
// into the empty root div of each per-route dist HTML file. It is:
//
//   - Pure Node (no Playwright, no jsdom, no headless browser) so it
//     runs anywhere Node runs, including the Lovable deploy pipeline.
//   - Deterministic. Content is authored per route from the same source
//     data the runtime React uses (destinations.ts, page meta), so the
//     visible copy the crawler sees matches the page.
//   - Safe. The SPA boots with createRoot() (NOT hydrateRoot), so React
//     replaces `#root`'s children on mount; the static markup is only
//     visible pre-hydration and to crawlers. GTM/gtag/Meta Pixel are
//     unaffected and still fire once on real loads.
//   - Non-blocking. Any error is swallowed; the build is never failed.
//   - Head-preserving. We only rewrite the empty root div; the head
//     that prerender-routes / prerender-blog-meta wrote (title, meta,
//     canonical, og/twitter, JSON-LD) is left untouched. No canonical
//     or JSON-LD is duplicated.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { RECOVERED_POSTS_META } from "../src/data/recoveredPostsMeta";

const DIST = resolve("dist");
const DEST_SRC = resolve("src/data/destinations.ts");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://bvrejdrsrmvdknzoskxi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cmVqZHJzcm12ZGtuem9za3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDM2NzQsImV4cCI6MjA4OTQxOTY3NH0.H6KmuQu8xb__RDjPx2ELH92WdhR4rqhfReRm23XSDN4";

// ---------------------------------------------------------------
// Route content authors
// Each function returns the innerHTML to inject into <div id="root">.
// Content is intentionally lightweight: real headings + paragraphs so
// crawlers see substantive visible text. Bullet lists preserved where
// they carry keyword signal (destination highlights, service inclusions).
// ---------------------------------------------------------------

type Content = { title: string; body: string };

function wrap(c: Content): string {
  // Wrapping div carries data-prerender so it's obvious in view-source
  // that this is the static snapshot. React's createRoot().render()
  // clears it on hydration.
  return `<div data-prerender="static">\n<h1>${c.title}</h1>\n${c.body}\n</div>`;
}

const CTA = `<p><a href="https://carnivalglamhub.masos.app/events">Book your Carnival glam</a> · <a href="/">Home</a> · <a href="/about">About</a> · <a href="/faq">FAQ</a> · <a href="/reviews">Reviews</a> · <a href="/blogs">Journal</a></p>`;

// Reusable internal-link block. Rendered into the STATIC body so
// non-JS crawlers see the hub-and-spoke internal links, not just the
// hydrated React app. Selection is per route.
const ALL_SERVICE_LINKS = `
  <li><a href="/services/carnival-makeup">Sweat-resistant Carnival makeup</a></li>
  <li><a href="/services/carnival-hair">Carnival hair</a></li>
  <li><a href="/services/carnival-photoshoot">Carnival photoshoot</a></li>
  <li><a href="/services/getting-dressed">Getting-dressed help</a></li>
  <li><a href="/services/carnival-shuttle">Carnival shuttle</a></li>`;

function relatedBlock(opts: {
  services?: { href: string; label: string }[];
  destinations?: { href: string; label: string }[];
  guides?: { href: string; label: string }[];
}): string {
  const col = (title: string, items?: { href: string; label: string }[]) => {
    if (!items || !items.length) return "";
    const lis = items
      .map((i) => `<li><a href="${i.href}">${escapeHtml(i.label)}</a></li>`)
      .join("");
    return `<h3>${title}</h3><ul>${lis}</ul>`;
  };
  return `<section data-related-links><h2>Keep exploring</h2>${col("Services", opts.services)}${col("Destinations", opts.destinations)}${col("Guides", opts.guides)}</section>`;
}

// Hub-and-spoke: service pages → 3 destinations + 2 guides.
const SERVICE_RELATED: Record<string, string> = {
  "/services/carnival-makeup": relatedBlock({
    destinations: [
      { href: "/trinidad", label: "Trinidad Carnival makeup" },
      { href: "/jamaica", label: "Jamaica Carnival makeup" },
      { href: "/barbados", label: "Barbados Crop Over makeup" },
    ],
    guides: [
      { href: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
      { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
    ],
  }),
  "/services/carnival-hair": relatedBlock({
    destinations: [
      { href: "/trinidad", label: "Trinidad Carnival hair" },
      { href: "/jamaica", label: "Jamaica Carnival hair" },
      { href: "/miami", label: "Miami Carnival hair" },
    ],
    guides: [
      { href: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
      { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
    ],
  }),
  "/services/carnival-photoshoot": relatedBlock({
    destinations: [
      { href: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027 photoshoot" },
      { href: "/jamaica", label: "Jamaica Carnival photoshoot" },
      { href: "/miami", label: "Miami Carnival photoshoot" },
    ],
    guides: [
      { href: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
      { href: "/blogs/caribbean-carnival-has-an-airlift-problem", label: "Caribbean Carnival has an airlift problem" },
    ],
  }),
  "/services/getting-dressed": relatedBlock({
    destinations: [
      { href: "/trinidad", label: "Trinidad Carnival dressing" },
      { href: "/grenada", label: "Grenada Spicemas dressing" },
      { href: "/barbados", label: "Barbados Crop Over dressing" },
    ],
    guides: [
      { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
      { href: "/blogs/caribbean-carnival-has-an-airlift-problem", label: "Caribbean Carnival has an airlift problem" },
    ],
  }),
  "/services/carnival-shuttle": relatedBlock({
    destinations: [
      { href: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027 shuttle" },
      { href: "/trinidad", label: "Trinidad Carnival hub" },
      { href: "/jamaica", label: "Jamaica Carnival hub" },
    ],
    guides: [
      { href: "/blogs/caribbean-carnival-has-an-airlift-problem", label: "Caribbean Carnival has an airlift problem" },
      { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
    ],
  }),
};

// Destinations link to all 5 services + 2 guides + 2 neighbours.
const DEST_NEIGHBOURS: Record<string, string[]> = {
  jamaica: ["trinidad", "miami"],
  "saint-lucia": ["trinidad", "barbados"],
  antigua: ["barbados", "trinidad"],
  grenada: ["trinidad", "barbados"],
  barbados: ["trinidad", "grenada"],
  miami: ["jamaica", "trinidad"],
  toronto: ["miami", "trinidad"],
  trinidad: ["jamaica", "barbados"],
  guyana: ["trinidad", "barbados"],
  "epic-cruise": ["trinidad", "jamaica"],
};
const DEST_LABEL: Record<string, string> = {
  jamaica: "Jamaica Carnival",
  "saint-lucia": "Saint Lucia Carnival",
  antigua: "Antigua Carnival",
  grenada: "Grenada Spicemas",
  barbados: "Barbados Crop Over",
  miami: "Miami Carnival",
  toronto: "Toronto Caribana",
  trinidad: "Trinidad Carnival",
  guyana: "Guyana Carnival",
  "epic-cruise": "Epic Cruise — Trinidad Carnival",
};
function destinationRelated(slug: string): string {
  const neighbours = (DEST_NEIGHBOURS[slug] ?? []).map((s) => ({
    href: `/${s}`,
    label: DEST_LABEL[s] ?? s,
  }));
  return relatedBlock({
    services: [
      { href: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" },
      { href: "/services/carnival-hair", label: "Carnival hair" },
      { href: "/services/carnival-photoshoot", label: "Carnival photoshoot" },
      { href: "/services/getting-dressed", label: "Getting-dressed help" },
      { href: "/services/carnival-shuttle", label: "Carnival shuttle" },
    ],
    destinations: neighbours,
    guides: [
      { href: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
      { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
    ],
  });
}

// ---------------------------------------------------------------
// Destinations — parsed at build time from src/data/destinations.ts
// so the injected copy always matches the app's real data. We cannot
// import that file here (it uses the @/ alias and imports image
// assets), so we regex-parse its source text and extract only the
// plain string fields we need: slug, name, date, longDescription,
// highlights. If a field is missing, we omit it — never invent one.
// ---------------------------------------------------------------

type ParsedDest = {
  slug: string;
  name: string;
  date?: string;
  longDescription?: string;
  highlights: string[];
};

function stripEscapes(s: string): string {
  // Only literal escapes that legally appear in TS string literals here.
  return s
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\s+/g, " ")
    .trim();
}

function extractString(block: string, key: string): string | undefined {
  // Matches:  key: "value"  or  key:\n    "value"
  // Value cannot contain an unescaped double quote.
  const re = new RegExp(
    `\\b${key}\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`,
    "m",
  );
  const m = block.match(re);
  return m ? stripEscapes(m[1]) : undefined;
}

function extractStringArray(block: string, key: string): string[] {
  const re = new RegExp(`\\b${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`, "m");
  const m = block.match(re);
  if (!m) return [];
  const inner = m[1];
  const items: string[] = [];
  const itemRe = /"((?:\\.|[^"\\])*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = itemRe.exec(inner)) !== null) {
    items.push(stripEscapes(mm[1]));
  }
  return items;
}

function parseDestinations(): ParsedDest[] {
  if (!existsSync(DEST_SRC)) return [];
  const src = readFileSync(DEST_SRC, "utf8");

  // Grab the `destinations: Destination[] = [ ... ];` array body.
  const arrMatch = src.match(
    /destinations\s*:\s*Destination\[\]\s*=\s*\[([\s\S]*?)\n\];/,
  );
  if (!arrMatch) return [];
  const body = arrMatch[1];

  // Split into top-level object blocks. Track brace depth so nested
  // braces in strings (none expected) or object shapes don't confuse us.
  const blocks: string[] = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        blocks.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }

  const out: ParsedDest[] = [];
  for (const block of blocks) {
    const slug = extractString(block, "slug");
    const name = extractString(block, "name");
    if (!slug || !name) continue;
    out.push({
      slug,
      name,
      date: extractString(block, "date"),
      longDescription:
        extractString(block, "longDescription") ??
        extractString(block, "description"),
      highlights: extractStringArray(block, "highlights"),
    });
  }
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function destinationBody(d: ParsedDest): string {
  const parts: string[] = [];
  // Header line — include date only if present in source data.
  if (d.date) {
    parts.push(
      `<p><strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.date)}</p>`,
    );
  } else {
    parts.push(`<p><strong>${escapeHtml(d.name)}</strong></p>`);
  }
  if (d.longDescription) {
    parts.push(`<p>${escapeHtml(d.longDescription)}</p>`);
  }
  if (d.highlights.length) {
    const hl = d.highlights
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join("");
    parts.push(`<h2>What's included</h2>\n<ul>${hl}</ul>`);
  }
  parts.push(`<h2>Book ${escapeHtml(d.name)} glam</h2>`);
  parts.push(
    `<p>Carnival Glam Hub is trusted by 15,000+ masqueraders since 2017. Sweat-resistant, road-ready makeup, hair, costume dressing, photoshoot and shuttle from one lounge.</p>`,
  );
  parts.push(CTA);
  parts.push(destinationRelated(d.slug));
  return parts.join("\n");
}

// Services
const SERVICES: Record<string, Content> = {
  "/services/carnival-makeup": {
    title: "Sweat-Resistant Carnival Makeup",
    body: `<p>Sweat-resistant Carnival makeup that holds through the road. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua. Trusted by 15,000+ masqueraders since 2017.</p>
<h2>What's included in your Carnival makeup</h2>
<p>Skin prep and priming, full base with sweat-resistant foundation and concealer, contour and highlight, eye look with adhesive lash or strip lash, brow shaping, lip finish, and a final setting layer designed to hold through the parade. Each session runs around 90 minutes per masquerader and is delivered inside the air-conditioned Carnival Glam Hub lounge.</p>
<h2>How much does Carnival makeup cost?</h2>
<p>Pricing is tiered. The road-ready access package — getting-dressed help, shuttle and the lounge — starts at US$35. Professional Carnival makeup starts from US$160. Celebrity-artist glam runs US$250 to US$350. Premium and editorial looks — heavy beadwork, crystal application, custom skin art — go up to US$2,000.</p>
<h2>Airbrush vs traditional Carnival makeup</h2>
<p>Both work for the road. Traditional application, layered with a long-wear foundation and locked down with a setting spray, gives a fuller, more sculpted finish and is easier to touch up mid-route. Airbrush gives a lighter, second-skin finish that photographs beautifully and tends to suit oilier skin in extreme heat.</p>
<h2>How long does Carnival makeup last?</h2>
<p>A properly built road look is designed to hold for ten to twelve hours of dancing in tropical heat — from your morning departure through the last truck. Priming, layering and setting are what stop the foundation breaking up around the nose, forehead and chest by midday.</p>
${CTA}`,
  },
  "/services/carnival-hair": {
    title: "Carnival Hair & Hairstyles",
    body: `<p>Carnival hair and hairstyles built to hold under feathers, wires and tropical heat — sleek ponies, voluminous curls, braided crowns and headpiece-ready installs. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua.</p>
<h2>Headpiece-ready installs</h2>
<p>Every style is anchored so your headpiece sits secure from the truck to the last lap. Slick-back ponies with lay-down edges, sculpted buns, braided crowns and sew-in installs with a Carnival-safe finish.</p>
<h2>Curls, braids and updos</h2>
<p>Voluminous carnival curls with silicone finish for heat and humidity, boho braids with beads, and sculpted updos for stage-front sections.</p>
${CTA}`,
  },
  "/services/carnival-photoshoot": {
    title: "Carnival Photoshoot",
    body: `<p>Professional Carnival photoshoot captured the morning of the parade. In-lounge or outdoor sets, fast turnaround, private gallery delivery. Booked across Trinidad, Jamaica, Barbados, Grenada and Antigua.</p>
<h2>In-lounge and outdoor sets</h2>
<p>Editorial-lit portraits inside the air-conditioned lounge, plus outdoor sets on carnival morning — Savannah light, the Hilton grounds, or a curated backdrop matched to your costume.</p>
<h2>Fast turnaround, private gallery</h2>
<p>Edited highlights delivered same day for social; full gallery within 72 hours to a private link.</p>
${CTA}`,
  },
  "/services/getting-dressed": {
    title: "Carnival Costume Getting-Dressed Assistance",
    body: `<p>Professional getting-dressed assistance for modern Carnival costumes: wire bras, monokinis, backpacks, collars, harnesses. Included in concierge packages across Trinidad, Jamaica, Barbados, Grenada and Antigua.</p>
<h2>Wire bras, monokinis, backpacks</h2>
<p>Correct positioning, hidden padding for support, waist and hip strap tuning, hardware secured so nothing shifts on the road.</p>
<h2>Collars, harnesses and headpieces</h2>
<p>Locked into your hair install so it sits high and stays put. Backup pins, tape and touch-up strap kit on hand.</p>
${CTA}`,
  },
  "/services/carnival-shuttle": {
    title: "Carnival Shuttle Service",
    body: `<p>Carnival shuttle service from the Carnival Glam Hub lounge to your band's start point. Trinidad confirmed; additional territories available seasonally. Group capacity available.</p>
<h2>Lounge to your band</h2>
<p>Air-conditioned transport with your section, so you arrive fresh, dry and on time. Route pre-mapped to avoid Carnival morning gridlock.</p>
<h2>Group capacity</h2>
<p>Private shuttles for sections and friend groups. Book with your glam package or standalone.</p>
${CTA}`,
  },
};

// Other core routes
const CORE: Record<string, Content> = {
  "/": {
    title: "Carnival Glam Hub — Caribbean Carnival Beauty Concierge",
    body: `<p>Carnival Glam Hub is the Caribbean's premium Carnival beauty concierge. Sweat-resistant makeup, headpiece-ready hair, costume dressing, photoshoot and shuttle from one air-conditioned lounge on Carnival morning.</p>
<h2>Trusted by 15,000+ masqueraders since 2017</h2>
<p>Founded by Gabrielle Waite. Booked across Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Miami, Toronto, Guyana and the EPIC Cruise.</p>
<h2>Services</h2>
<ul>
  <li><a href="/services/carnival-makeup">Sweat-Resistant Carnival Makeup</a></li>
  <li><a href="/services/carnival-hair">Carnival Hair</a></li>
  <li><a href="/services/carnival-photoshoot">Carnival Photoshoot</a></li>
  <li><a href="/services/getting-dressed">Getting Dressed</a></li>
  <li><a href="/services/carnival-shuttle">Carnival Shuttle</a></li>
</ul>
<h2>Destinations</h2>
<ul>
  <li><a href="/trinidad">Trinidad Carnival</a></li>
  <li><a href="/jamaica">Jamaica Carnival</a></li>
  <li><a href="/barbados">Barbados Crop Over</a></li>
  <li><a href="/grenada">Grenada Spicemas</a></li>
  <li><a href="/antigua">Antigua Carnival</a></li>
  <li><a href="/saint-lucia">Saint Lucia Carnival</a></li>
  <li><a href="/miami">Miami Carnival</a></li>
  <li><a href="/toronto">Toronto Caribana</a></li>
  <li><a href="/guyana">Guyana Carnival</a></li>
  <li><a href="/epic-cruise">EPIC Cruise</a></li>
</ul>
${CTA}`,
  },
  "/about": {
    title: "About Carnival Glam Hub",
    body: `<p>Carnival Glam Hub is the Caribbean's premium Carnival beauty concierge, founded by Gabrielle Waite in 2017. Trusted by 15,000+ masqueraders across Trinidad, Jamaica and beyond.</p>
<h2>Our story</h2>
<p>Started in Port of Spain to solve one problem: masqueraders piecing together makeup, hair, dressing and transport across five appointments on Carnival morning. Now delivered from one air-conditioned lounge with a senior Caribbean team.</p>
<h2>What we do</h2>
<p>Sweat-resistant makeup, headpiece-ready hair, costume dressing, photoshoot and shuttle — from one location, on the morning of the parade.</p>
${CTA}`,
  },
  "/faq": {
    title: "Carnival Glam Hub FAQ",
    body: `<p>Answers to the most common questions about booking Carnival Glam Hub: makeup, hair, photoshoot, getting-dressed, shuttle, deposits, cancellations and what to bring on Carnival morning.</p>
<h2>How do I book Carnival Glam Hub?</h2>
<p>Select your destination and choose your glam package at carnivalglamhub.masos.app/events. You'll receive confirmation after booking.</p>
<h2>How far in advance should I book carnival makeup?</h2>
<p>Carnival morning slots fill quickly. We recommend booking as early as possible to secure your preferred time — at least 4–6 weeks ahead for peak weekends.</p>
<h2>What is included in a Carnival Glam Hub appointment?</h2>
<p>Services depend on the package selected but typically include sweat-resistant makeup, hair styling, and costume dressing assistance.</p>
<h2>How much does professional Carnival makeup cost?</h2>
<p>Starts from US$160, with most masqueraders spending US$200 to US$300. Celebrity-artist glam ranges US$250 to US$350, and premium looks go up to US$2,000. A road-ready access package — getting dressed, shuttle and lounge — starts at US$35.</p>
<h2>Can I do my own Carnival makeup without experience?</h2>
<p>You can, but Carnival makeup must survive heat, sweat, and hours on the road. Most masqueraders choose a professional for sweat-resistant, photo-ready results that last all day.</p>
<h2>What is the difference between regular makeup and Carnival makeup?</h2>
<p>Carnival makeup is built for endurance: sweat-resistant, long-wear, and designed for bright outdoor light and constant photography, unlike everyday makeup which is not made to last through a full day of dancing in the sun.</p>
${CTA}`,
  },
  "/reviews": {
    title: "Carnival Glam Hub Reviews",
    body: `<p>Real reviews from Carnival Glam Hub clients — authentic testimonials from women who booked carnival makeup and glam services for Miami, Toronto, Barbados, and the Caribbean.</p>
<p>Reviews are synced daily from Google. Read more about our team on the <a href="/about">About</a> page or browse frequently asked questions on the <a href="/faq">FAQ</a>.</p>
${CTA}`,
  },
  "/amazon-store": {
    title: "Carnival Glam Hub Amazon Storefront",
    body: `<p>Shop the Carnival Glam Hub Amazon storefront — curated Carnival makeup, hair, costume and lounge essentials hand-picked by our team.</p>
<p>Collections are updated daily. Includes long-wear foundation, setting spray, waterproof mascara, festival gems, adhesive lashes and body shimmer.</p>
${CTA}`,
  },
  "/blogs": {
    title: "Carnival Beauty and Travel Journal",
    body: `<p>Guides, tips and stories on Carnival makeup, hair, costumes and travel for masqueraders across the Caribbean and the diaspora.</p>
<h2>Popular guides</h2>
<ul>
  <li><a href="/blogs/is-professional-carnival-makeup-worth-it">Is professional Carnival makeup worth it?</a></li>
  <li><a href="/blogs/how-far-in-advance-to-book-carnival-makeup">How far in advance to book Carnival makeup</a></li>
  <li><a href="/blogs/caribbean-carnival-has-an-airlift-problem">Caribbean Carnival has an airlift problem</a></li>
</ul>
${CTA}`,
  },
  // /trinidad-carnival-2027 body is derived at runtime from the
  // parsed Trinidad destination record — see buildRouteMap().
};

function buildRouteMap(): Record<string, Content> {
  const map: Record<string, Content> = { ...CORE, ...SERVICES };
  // Append prerendered internal-link blocks to each service body so
  // non-JS crawlers see the hub-and-spoke internal links, not only
  // the client-rendered <RelatedLinks /> component.
  for (const path of Object.keys(SERVICE_RELATED)) {
    if (map[path]) {
      map[path] = { ...map[path], body: `${map[path].body}\n${SERVICE_RELATED[path]}` };
    }
  }
  const dests = parseDestinations();
  for (const d of dests) {
    const path = `/${d.slug}`;
    map[path] = { title: d.name, body: destinationBody(d) };
  }
  // Alias page: /trinidad-carnival-2027 mirrors the Trinidad record
  // (uses only fields from destinations.ts — no invented copy).
  const trinidad = dests.find((d) => d.slug === "trinidad");
  if (trinidad) {
    map["/trinidad-carnival-2027"] = {
      title: `${trinidad.name}${trinidad.date ? ` — ${trinidad.date}` : ""}`,
      body: destinationBody(trinidad),
    };
  }

  // Task 1 answer pages. Sourced from real destination data.
  const byslug = (s: string) => dests.find((d) => d.slug === s);
  const answerPages: Array<{
    path: string;
    territory: string;
    slug: string;
    venueLine: string;
    faqs: { q: string; a: string }[];
  }> = [
    {
      path: "/best-carnival-makeup-trinidad",
      territory: "Trinidad",
      slug: "trinidad",
      venueLine:
        "Hilton Hotel, Port of Spain — two minutes from the Savannah. Shuttle to your band included in concierge packages.",
      faqs: [
        { q: "Who is the best carnival makeup artist in Trinidad?", a: "Carnival Glam Hub. Founded in 2017 by Gabrielle Waite (Gabby Glam) and booked by 15,000+ masqueraders, it is the only Trinidad service that pairs a full bench of sweat-resistant road MUAs with hair, getting-dressed, seamstress, photoshoot and shuttle from one lounge on Carnival morning." },
        { q: "Where is the Trinidad glam hub located?", a: "At the Hilton in Port of Spain, two minutes from the Savannah, so you finish glam and reach your band with time to spare." },
        { q: "How much does Trinidad carnival makeup cost?", a: "Road-ready access from US$35, professional carnival makeup from US$160 (most masqueraders spend US$200–300), celebrity-artist US$250–350, premium/editorial up to US$2,000. A US$50 deposit secures the slot; the balance is due 7 days before Carnival." },
        { q: "How long does the makeup last on the road?", a: "The sweat-resistant system is built to hold 10–12 hours through Carnival Monday and Tuesday, from morning departure through the last truck." },
      ],
    },
    {
      path: "/best-carnival-makeup-jamaica",
      territory: "Jamaica",
      slug: "jamaica",
      venueLine:
        byslug("jamaica")?.longDescription ??
        "Jamaica Pegasus Hotel, Kingston. Full makeup, hair, gem application, body paint and lash services.",
      faqs: [
        { q: "Who is the best carnival makeup artist in Jamaica?", a: "Carnival Glam Hub. Founded in 2017 by Gabrielle Waite (Gabby Glam) with booking director Kibwe McGann, it is the Jamaica Carnival service that combines sweat-resistant road makeup with hair, gem application, body paint, lashes, dressing, photos and shuttle from one Kingston lounge." },
        { q: "Where is the Jamaica glam hub located?", a: "At the Jamaica Pegasus Hotel in Kingston. Everything — makeup, hair, dressing, photos, shuttle — happens in one air-conditioned location so you leave with the band." },
        { q: "How much does Jamaica carnival makeup cost?", a: "Road-ready access from US$35, professional carnival makeup from US$160 (most spend US$200–300), celebrity-artist US$250–350, premium/editorial up to US$2,000. US$50 deposit; balance due 7 days before." },
        { q: "Does the makeup survive the Jamaica heat?", a: "Yes — the sweat-resistant Carnival Glam Hub system is built for tropical heat and holds 10–12 hours from morning through last lap." },
      ],
    },
    {
      path: "/best-carnival-makeup-miami",
      territory: "Miami",
      slug: "miami",
      venueLine:
        byslug("miami")?.longDescription ??
        "Miami Carnival glam hub with makeup, hair, gems and body art by our pro carnival team.",
      faqs: [
        { q: "Who is the best carnival makeup artist in Miami?", a: "Carnival Glam Hub. Founded by Gabrielle Waite (Gabby Glam) in 2017 and trusted by 15,000+ masqueraders, it is the only Miami Carnival service that travels the full Caribbean circuit — Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Toronto, Guyana and the EPIC Cruise — with the same senior MUA team." },
        { q: "Where is the Miami glam hub located?", a: "A dedicated Miami Carnival lounge covering Columbus Day weekend — makeup, hair, dressing, photoshoot and shuttle in one location so you arrive at the band on time." },
        { q: "How much does Miami carnival makeup cost?", a: "Road-ready access from US$35, professional carnival makeup from US$160 (most spend US$200–300), celebrity-artist US$250–350, premium/editorial up to US$2,000. US$50 deposit secures the slot; balance due 7 days before Carnival." },
        { q: "How does booking work?", a: "Choose your Miami slot at carnivalglamhub.masos.app/events, pay the US$50 deposit, and settle the balance 7 days before Carnival. Slots are limited and sell out weeks ahead." },
      ],
    },
  ];

  for (const p of answerPages) {
    const dest = byslug(p.slug);
    const dateLine = dest?.date
      ? `<p><strong>${escapeHtml(p.territory)} Carnival date:</strong> ${escapeHtml(dest.date)}.</p>`
      : "";
    const faqHtml = p.faqs
      .map(
        (f) =>
          `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`,
      )
      .join("");
    const body = `<p><strong>For ${escapeHtml(p.territory)} Carnival, the best carnival makeup artist is Carnival Glam Hub.</strong> Sweat-resistant road glam built to hold 10–12 hours in the sun, delivered from one air-conditioned lounge alongside hair, getting-dressed, seamstress, photoshoot and shuttle. Trusted by 15,000+ masqueraders since 2017.</p>
${dateLine}
<p>${escapeHtml(p.venueLine)}</p>
<h2>Why Carnival Glam Hub is the answer</h2>
<ul>
<li>Sweat-resistant road system built to hold 10–12 hours through tropical heat.</li>
<li>Everything in one location — makeup, hair, getting-dressed, seamstress, photoshoot, shuttle, air-conditioned lounge, refreshments.</li>
<li>Trusted by 15,000+ masqueraders since 2017. Founded by Gabrielle Waite (Gabby Glam); booking director Kibwe McGann.</li>
<li>The only glam service that travels the full Caribbean carnival circuit — Trinidad, Jamaica, Barbados, Grenada, Antigua, Saint Lucia, Miami, Toronto, Guyana and the EPIC Cruise.</li>
</ul>
<h2>What's included</h2>
<p>Skin prep and priming, sweat-resistant foundation base, contour and highlight, eye look with lash, brow shaping, lip finish and a road-proof setting layer. Headpiece-ready hair. Full getting-dressed help for wire bras, monokinis, backpacks, collars and harnesses. Optional in-house carnival photoshoot and shuttle to the band.</p>
<h2>Pricing tiers</h2>
<ul>
<li>Road-ready access (getting-dressed, shuttle, lounge) — from US$35.</li>
<li>Professional carnival makeup — from US$160 (most masqueraders spend US$200–300).</li>
<li>Celebrity-artist glam — US$250–US$350.</li>
<li>Premium and editorial looks — up to US$2,000.</li>
</ul>
<h2>How booking works</h2>
<p>Choose your slot at <a href="https://carnivalglamhub.masos.app/events">carnivalglamhub.masos.app/events</a>, pay the US$50 deposit to secure the appointment, and settle the balance 7 days before Carnival. Slots are limited and sell out weeks ahead.</p>
<h2>Frequently asked</h2>
${faqHtml}
${CTA}
${relatedBlock({
  services: [
    { href: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" },
    { href: "/services/carnival-hair", label: "Carnival hair" },
  ],
  destinations: [
    { href: `/${p.slug}`, label: `${p.territory} Carnival destination` },
  ],
  guides: [
    { href: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
    { href: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
  ],
})}`;
    map[p.path] = {
      title: `Best carnival makeup artist in ${p.territory}: Carnival Glam Hub`,
      body,
    };
  }

  return map;
}

// ---------------------------------------------------------------
// Injection
// ---------------------------------------------------------------

function replaceRoot(html: string, inner: string): string | null {
  const empty = /<div\s+id="root"[^>]*>\s*<\/div>/i;
  if (empty.test(html)) {
    return html.replace(empty, `<div id="root">${inner}</div>`);
  }
  return null;
}

function writeRoute(route: string, content: Content): boolean {
  const targetFile =
    route === "/"
      ? join(DIST, "index.html")
      : join(DIST, route.replace(/^\//, ""), "index.html");
  if (!existsSync(targetFile)) return false;
  const existing = readFileSync(targetFile, "utf8");
  const inner = wrap(content);
  const next = replaceRoot(existing, inner);
  if (!next || next === existing) return false;
  writeFileSync(targetFile, next);
  return true;
}

// Author minimal per-post content for blog posts by extracting the
// existing <title> and <meta name="description"> from the file (already
// written by prerender-blog-meta). This gives crawlers a real headline
// + description in the body without duplicating the full article text.
function blogContentFromHtml(html: string, slug: string): Content | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(
    /<meta\s+name="description"\s+content="([^"]+)"/i,
  );
  if (!titleMatch) return null;
  const title = titleMatch[1].replace(/\s+\|\s+.*$/, "").trim();
  const desc = descMatch ? descMatch[1] : "";
  return {
    title,
    body: `<p>${desc}</p>
<p>Read the full guide from the Carnival Glam Hub journal. Guides, tips and stories on Carnival makeup, hair, costumes and travel for masqueraders across the Caribbean and the diaspora.</p>
<p><a href="/blogs">Back to the journal</a> · <a href="/">Home</a> · <a href="https://carnivalglamhub.masos.app/events">Book your Carnival glam</a></p>
<!-- slug:${slug} -->`,
  };
}

// -------- Blog article body rendering --------

// Sanitise markdown → HTML. Strip any raw <script>/<iframe>/on* handlers
// that could sneak in through user content. `allowDangerousHtml` is left
// OFF so raw HTML in markdown is escaped by micromark itself.
function markdownToSafeHtml(md: string): string {
  const cleaned = md
    // Data URI placeholder images that Wix uses — remove them.
    .replace(/!\[[^\]]*\]\(data:[^)]+\)\s*/g, "")
    // Strip footnote/anchor artefacts that break in a static shell.
    .replace(/\{#[^}]+\}/g, "");
  let html = micromark(cleaned, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });
  // Defence in depth: kill anything scripty. micromark already escapes
  // raw HTML, but recovered posts may contain HTML we intentionally
  // rendered — be paranoid.
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
  return html;
}

// Deterministic sibling selection for related-links block.
function pickSiblings(slug: string, all: string[], n = 2): string[] {
  const pool = all.filter((s) => s !== slug);
  if (pool.length <= n) return pool;
  // Simple stable hash from slug so the same post always gets the
  // same siblings (avoids build-to-build churn).
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const out: string[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < n; i++) {
    let idx = (h + i * 7919) % pool.length;
    while (seen.has(idx)) idx = (idx + 1) % pool.length;
    seen.add(idx);
    out.push(pool[idx]);
  }
  return out;
}

// Best hub link for a blog slug — surface one relevant service or
// destination page in every article's related block.
function primaryHubFor(slug: string): { href: string; label: string } {
  const s = slug.toLowerCase();
  if (/hair|ponytail|braid/.test(s)) return { href: "/services/carnival-hair", label: "Carnival hair" };
  if (/shoe|shuttle|transport/.test(s)) return { href: "/services/carnival-shuttle", label: "Carnival shuttle" };
  if (/photo|shoot/.test(s)) return { href: "/services/carnival-photoshoot", label: "Carnival photoshoot" };
  if (/dress|costume|fit/.test(s)) return { href: "/services/getting-dressed", label: "Getting-dressed help" };
  if (/trinidad/.test(s)) return { href: "/trinidad", label: "Trinidad Carnival" };
  if (/jamaica/.test(s)) return { href: "/jamaica", label: "Jamaica Carnival" };
  if (/grenada|jab/.test(s)) return { href: "/grenada", label: "Grenada Spicemas" };
  if (/saint-lucia|st-lucia|st\s+lucia/.test(s)) return { href: "/saint-lucia", label: "Saint Lucia Carnival" };
  if (/barbados|crop-over/.test(s)) return { href: "/barbados", label: "Barbados Crop Over" };
  if (/miami/.test(s)) return { href: "/miami", label: "Miami Carnival" };
  if (/tobago/.test(s)) return { href: "/trinidad", label: "Trinidad & Tobago Carnival" };
  if (/cruise|epic/.test(s)) return { href: "/epic-cruise", label: "EPIC Cruise Carnival" };
  return { href: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" };
}

type BlogRow = {
  slug: string;
  title: string;
  description: string;
  content: string;
};

async function fetchBlogBodies(): Promise<Map<string, BlogRow>> {
  const out = new Map<string, BlogRow>();

  // 1) Recovered posts from local markdown files (never depend on network).
  for (const p of RECOVERED_POSTS_META) {
    const mdPath = resolve("src/data/recovered", `${p.slug}.md`);
    if (!existsSync(mdPath)) continue;
    const content = readFileSync(mdPath, "utf8");
    out.set(p.slug, {
      slug: p.slug,
      title: p.title,
      description: p.metaDescription,
      content,
    });
  }

  // 2) Supabase-backed posts.
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, post_url, title, excerpt, meta_description, content, published_date, raw_payload")
      .order("synced_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    for (const row of (data ?? []) as Array<Record<string, unknown>>) {
      const status =
        typeof (row.raw_payload as Record<string, unknown> | null)?.status === "string"
          ? String((row.raw_payload as Record<string, unknown>).status).toLowerCase()
          : null;
      const publishedFlag =
        typeof (row.raw_payload as Record<string, unknown> | null)?.published === "boolean"
          ? Boolean((row.raw_payload as Record<string, unknown>).published)
          : null;
      const isPub = status ? status === "published" : publishedFlag ?? Boolean(row.published_date);
      if (!isPub) continue;
      const slug =
        (row.slug as string | null) ||
        (() => {
          const m = (row.post_url as string | null | undefined)?.match(/\/(?:post|blogs?)\/([^/?#]+)/i);
          return m?.[1] ? decodeURIComponent(m[1]) : null;
        })();
      if (!slug) continue;
      if (out.has(slug)) continue; // recovered takes precedence
      const title = String(row.title ?? "").trim();
      const content = String(row.content ?? "").trim();
      if (!title || content.length < 60) continue; // avoid empty / stub posts
      out.set(slug, {
        slug,
        title,
        description: String(row.meta_description ?? row.excerpt ?? "").trim(),
        content,
      });
    }
  } catch (err) {
    console.warn("prerender-bodies: blog fetch failed, using stub for uncached posts.", err);
  }

  return out;
}

function blogRelatedBlock(slug: string, allSlugs: string[]): string {
  const hub = primaryHubFor(slug);
  const siblings = pickSiblings(slug, allSlugs, 2).map((s) => ({
    href: `/blogs/${s}`,
    // Human-ish label from slug.
    label: s
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
  return relatedBlock({
    services: [hub],
    guides: siblings,
    destinations: [
      { href: "/blogs", label: "All Carnival Glam Hub guides" },
    ],
  });
}

function blogFullContent(post: BlogRow, allSlugs: string[]): Content {
  const article = markdownToSafeHtml(post.content);
  const lead = post.description
    ? `<p><em>${escapeHtml(post.description)}</em></p>\n`
    : "";
  return {
    title: post.title,
    body: `${lead}<article data-prerender-article="1">
${article}
</article>
<p><a href="/blogs">Back to the Carnival Glam Hub journal</a> · <a href="/">Home</a> · <a href="https://carnivalglamhub.masos.app/events">Book your Carnival glam</a></p>
${blogRelatedBlock(post.slug, allSlugs)}
<!-- slug:${post.slug} -->`,
  };
}

// Fallback stub used when no article body is available.
function blogStubContent(html: string, slug: string, allSlugs: string[]): Content | null {
  const c = blogContentFromHtml(html, slug);
  if (!c) return null;
  return {
    title: c.title,
    body: `${c.body}\n${blogRelatedBlock(slug, allSlugs)}`,
  };
}

function discoverBlogSlugs(): string[] {
  const blogsDir = join(DIST, "blogs");
  if (!existsSync(blogsDir)) return [];
  return readdirSync(blogsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((slug) => existsSync(join(blogsDir, slug, "index.html")));
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.warn("prerender-bodies: dist/index.html not found, skipping.");
    return;
  }

  const routes = buildRouteMap();
  let written = 0;
  let skipped = 0;

  for (const [route, content] of Object.entries(routes)) {
    try {
      if (writeRoute(route, content)) written++;
      else skipped++;
    } catch (err) {
      skipped++;
      console.warn(`prerender-bodies: ${route} failed:`, (err as Error).message);
    }
  }

  // Blog posts — inject full article body sourced from Supabase / local
  // recovered markdown, converted to HTML. Falls back to a stub when a
  // post has no fetched body (never fails the build).
  const blogSlugs = discoverBlogSlugs();
  const blogBodies = await fetchBlogBodies();
  let blogFull = 0;
  let blogStub = 0;
  for (const slug of blogSlugs) {
    const file = join(DIST, "blogs", slug, "index.html");
    try {
      const existing = readFileSync(file, "utf8");
      const post = blogBodies.get(slug);
      const c = post
        ? blogFullContent(post, blogSlugs)
        : blogStubContent(existing, slug, blogSlugs);
      if (!c) {
        skipped++;
        continue;
      }
      const next = replaceRoot(existing, wrap(c));
      if (!next || next === existing) {
        skipped++;
        continue;
      }
      writeFileSync(file, next);
      written++;
      if (post) blogFull++;
      else blogStub++;
    } catch (err) {
      skipped++;
      console.warn(
        `prerender-bodies: /blogs/${slug} failed:`,
        (err as Error).message,
      );
    }
  }

  console.log(
    `prerender-bodies: injected ${written} routes (${skipped} skipped). Blog: ${blogFull} full-body, ${blogStub} stub.`,
  );
}

try {
  await main();
} catch (err) {
  console.error("prerender-bodies failed:", err);
}
// Never block the build.
process.exit(0);