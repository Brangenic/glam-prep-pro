import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  AI_DISCOVERY_ONLY_PATHS,
  AI_DISCOVERY_ONLY_ROBOTS,
  NOINDEX_PORTAL_PATHS,
  isAiDiscoveryOnlyPath,
  isNoindexPortalPath,
} from "@/data/aiDiscoveryOnly";
import { AI_APP_SECTIONS, AI_APP_WEBSITE_BOOKING_URL } from "@/data/aiBookingAppPage";
import { getTerritoryPricing } from "@/data/territoryPricing";

// Owner rule: website paths always go to MasOS. The Trinidad portal has no
// internal links but is open to Google and AI assistants.

// The portal pages themselves, the data files that only define the path
// constants, routing and tests are the only files allowed to name the paths.
const EXCLUDED = new Set([
  "src/pages/TrinidadBook.tsx",
  "src/pages/TrinidadBookResult.tsx",
  "src/pages/AiBookingApp.tsx",
  "src/data/trinidadBookPage.ts",
  "src/data/aiBookingAppPage.ts",
  "src/data/aiDiscoveryOnly.ts",
  "src/data/legacyRoutes.ts",
  "src/App.tsx",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (p === "src/test") continue;
      walk(p, out);
    } else if (/\.(tsx?|jsx?|md|mdx|json|html)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

const PATH = String.raw`(?:https?://(?:www\.)?carnivalglamhub\.com)?/(?:trinidad/book|ai-booking-app)`;
const LINK_PATTERNS = [
  // href="/trinidad/book", to='/ai-booking-app', href: "/trinidad/book", url: `...`
  new RegExp(String.raw`\b(?:href|to|url|link|path)\s*[=:]\s*\{?\s*["'\`]${PATH}`, "i"),
  // href={TRINIDAD_BOOK_PATH} and friends
  new RegExp(String.raw`\b(?:href|to|url|link)\s*[=:]\s*\{?\s*(?:TRINIDAD_BOOK_(?:PATH|URL)|AI_APP_(?:PATH|URL))\b`),
  // markdown links
  new RegExp(String.raw`\]\(${PATH}`, "i"),
  // raw anchors in HTML strings
  new RegExp(String.raw`<a[^>]+href=\\?["']${PATH}`, "i"),
];

describe("Trinidad portal has no internal links", () => {
  it("no file under src/ renders a link to /trinidad/book or /ai-booking-app", () => {
    const offenders: string[] = [];
    for (const file of walk("src")) {
      if (EXCLUDED.has(file)) continue;
      const text = readFileSync(file, "utf8");
      text.split("\n").forEach((line, i) => {
        if (LINK_PATTERNS.some((re) => re.test(line))) offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("the scanner would catch a real link", () => {
    expect(LINK_PATTERNS.some((re) => re.test('<a href="/trinidad/book">'))).toBe(true);
    expect(LINK_PATTERNS.some((re) => re.test('{ label: "x", href: "/ai-booking-app" }'))).toBe(true);
    expect(LINK_PATTERNS.some((re) => re.test("<Link to={TRINIDAD_BOOK_PATH}>"))).toBe(true);
  });

  it("the Navbar contains neither path, desktop or mobile", () => {
    const nav = readFileSync("src/components/landing/Navbar.tsx", "utf8");
    expect(nav).not.toContain("/trinidad/book");
    expect(nav).not.toContain("/ai-booking-app");
    expect(nav).not.toMatch(/Hilton slot/i);
    expect(nav).not.toMatch(/Book in ChatGPT and Claude/i);
  });

  it("the Footer contains neither path", () => {
    const footer = readFileSync("src/components/landing/Footer.tsx", "utf8");
    expect(footer).not.toContain("/trinidad/book");
    expect(footer).not.toContain("/ai-booking-app");
  });

  it("/ai-booking-app sends website bookings to the Trinidad MasOS event", () => {
    const trinidad = getTerritoryPricing("trinidad")?.bookingUrl;
    expect(trinidad).toMatch(/^https:\/\/carnivalglamhub\.masos\.app\/events\//);
    expect(AI_APP_WEBSITE_BOOKING_URL).toBe(trinidad);
    const hrefs = AI_APP_SECTIONS.flatMap((s) => s.links ?? []).map((l) => l.href);
    expect(hrefs).toContain(trinidad);
    expect(hrefs.filter((h) => isAiDiscoveryOnlyPath(h))).toEqual([]);
  });

  it("JADE never links website visitors to the portal", () => {
    const pack = JSON.parse(readFileSync("supabase/functions/chat/knowledge.json", "utf8"));
    const urls: string[] = pack.links.map((l: { url: string }) => l.url);
    expect(urls.filter((u) => isAiDiscoveryOnlyPath(u))).toEqual([]);
    const { neverSay, ...rest } = pack;
    expect(JSON.stringify(rest)).not.toMatch(/\/trinidad\/book|\/ai-booking-app/);
    expect(JSON.stringify(neverSay)).toMatch(/\/trinidad\/book/);
  });

  it("/trinidad/book is indexable on both surfaces", () => {
    expect(isNoindexPortalPath("/trinidad/book")).toBe(false);
    expect(isAiDiscoveryOnlyPath("/trinidad/book")).toBe(true);
    const page = readFileSync("src/pages/TrinidadBook.tsx", "utf8");
    expect(page).not.toContain("useNoindex");
    expect(page).toContain("c.href = TRINIDAD_BOOK_URL");
    const prerender = readFileSync("scripts/prerender-routes.ts", "utf8");
    expect(prerender).toContain("isNoindexPortalPath(route.path)");
    expect(prerender).not.toContain("isAiDiscoveryOnlyPath(route.path)");
  });

  it("the payment return pages and /ai-booking-app stay noindex, nofollow", () => {
    expect(AI_DISCOVERY_ONLY_ROBOTS).toBe("noindex, nofollow");
    expect([...AI_DISCOVERY_ONLY_PATHS].sort()).toEqual(
      ["/ai-booking-app", "/trinidad/book", "/trinidad/book/cancelled", "/trinidad/book/confirmed"],
    );
    expect([...NOINDEX_PORTAL_PATHS].sort()).toEqual(
      ["/ai-booking-app", "/trinidad/book/cancelled", "/trinidad/book/confirmed"],
    );
    for (const page of ["src/pages/TrinidadBookResult.tsx", "src/pages/AiBookingApp.tsx"]) {
      expect(readFileSync(page, "utf8")).toContain("useNoindex(AI_DISCOVERY_ONLY_ROBOTS)");
    }
    const prerender = readFileSync("scripts/prerender-routes.ts", "utf8");
    expect(prerender).toContain("isNoindexPortalPath(p.path) ? AI_DISCOVERY_ONLY_ROBOTS : PRIVATE_ROBOTS");
  });

  it("/trinidad/book is in the sitemap; the noindex pages are not; nothing is blocked in robots.txt", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    expect(sitemap).toContain("<loc>https://www.carnivalglamhub.com/trinidad/book</loc>");
    expect(readFileSync("scripts/generate-sitemap.ts", "utf8")).toContain('path: "/trinidad/book"');
    for (const f of ["public/sitemap.xml", "public/sitemap-news.xml", "scripts/generate-sitemap.ts", "scripts/generate-news-sitemap.ts", "supabase/functions/generate-sitemap/index.ts"]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\/trinidad\/book\/(confirmed|cancelled)|\/ai-booking-app/);
    }
    expect(readFileSync("public/robots.txt", "utf8")).not.toMatch(/\/trinidad\/book|\/ai-booking-app/);
    const llms = readFileSync("public/llms.txt", "utf8");
    expect(llms).toContain("https://www.carnivalglamhub.com/trinidad/book");
    expect(llms).toContain("https://www.carnivalglamhub.com/ai-booking-app");
  });
});
