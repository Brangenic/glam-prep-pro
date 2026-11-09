/**
 * Every <title> the site can emit fits 60 characters once HTML escaped,
 * so search results never cut a title mid-phrase. Blog override maps are
 * covered in blogTitleOverrides.test.ts; this file covers everything else:
 *
 * - route titles in scripts/prerender-routes.ts (read from source, because
 *   importing the script would run the build step)
 * - every *_TITLE / META_TITLE string constant and literal document.title
 *   under src/, which includes src/data/pageMeta.ts and the pages that set
 *   their own title, such as src/pages/blog/AirliftProblem.tsx
 * - destination meta titles, season aware, as Destination.tsx sets them
 * - the moved-page and private route titles from src/data/legacyRoutes.ts
 * - the legacy Wix /post/<slug> pages and literal <title> tags in scripts/
 * - the homepage title in index.html
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { TITLE_MAX } from "@/lib/metaText";
import {
  ROOT_ALIASES,
  PRIVATE_ROUTES,
  destinationStubMeta,
  isTerritoryStubPath,
  rootAliasMeta,
} from "@/data/legacyRoutes";
import { destinations } from "@/data/destinations";
import { seasonAwareMeta } from "@/data/seasons";
import { WIX_REDIRECTS, WIX_TITLE_SUFFIX, wixRedirectHeading } from "@/lib/wixRedirects";

const BASE_URL = "https://www.carnivalglamhub.com";

const escapedLength = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").length;

const read = (rel: string) => readFileSync(resolve(rel), "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "test" ? [] : walk(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const titles: [string, string][] = [];
const add = (where: string, title: string) => titles.push([where, title]);

// Route titles in the prerender script, string literals only. Imported
// constants are picked up from their own modules below.
const routesSrc = read("scripts/prerender-routes.ts");
const routePaths: string[] = [];
for (const m of routesSrc.matchAll(/path:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g)) {
  add(`prerender-routes ${m[1]}`, m[2]);
}
for (const m of routesSrc.matchAll(/path:\s*"([^"]+)"/g)) routePaths.push(m[1]);

// *_TITLE and META_TITLE constants and literal document.title across src/.
for (const file of walk(resolve("src"))) {
  const rel = relative(process.cwd(), file);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/const ([A-Z0-9_]*_TITLE)\s*(?::\s*string\s*)?=\s*"([^"]+)"/g)) {
    add(`${rel} ${m[1]}`, m[2]);
  }
  for (const m of src.matchAll(/document\.title\s*=\s*"([^"]+)"/g)) add(`${rel} document.title`, m[1]);
}

// Best Carnival makeup pages carry their titles in a local data map.
for (const m of read("src/pages/BestCarnivalMakeup.tsx").matchAll(/\btitle:\s*"([^"]+)"/g)) {
  add("src/pages/BestCarnivalMakeup.tsx", m[1]);
}

// Destination pages: the stored title, which serves while a season is
// open, and the season aware title the runtime sets once it has passed.
for (const d of destinations) {
  add(`destinations.ts ${d.slug} metaTitle`, d.metaTitle);
  add(`destination ${d.slug} season aware`, seasonAwareMeta(d.slug, d.name, d.metaTitle, d.metaDescription).title);
}

// Literal <title> tags in the build scripts, such as the withdrawn post page.
for (const file of readdirSync(resolve("scripts")).filter((f) => f.endsWith(".ts"))) {
  for (const m of read(`scripts/${file}`).matchAll(/<title>([^<$]+)<\/title>/g)) add(`scripts/${file} <title>`, m[1]);
}

// Legacy Wix /post/<slug> pages, built from the same heading function as
// scripts/prerender-wix-redirects.ts. The heading is escaped there before
// the suffix is added, which escapedLength accounts for.
for (const [from, to] of Object.entries(WIX_REDIRECTS)) {
  add(`/post/${from}`, `${wixRedirectHeading(to)}${WIX_TITLE_SUFFIX}`);
}

// Moved pages and private routes.
for (const path of routePaths.filter(isTerritoryStubPath)) {
  add(`/destinations${path}`, destinationStubMeta(path.slice(1), BASE_URL).title);
}
for (const a of ROOT_ALIASES) add(`alias ${a.from}`, rootAliasMeta(a, BASE_URL).title);
for (const p of PRIVATE_ROUTES) add(`private ${p.path}`, p.title);

// Homepage.
const home = read("index.html").match(/<title>([^<]+)<\/title>/)?.[1];
if (home) add("index.html", home);

// Titles found over 60 characters when this guard was extended, reported
// to the owner and awaiting her wording. Nothing new may be added here:
// any other over-length title fails, and an entry that has been fixed
// fails until it is removed, so the list can only shrink.
//
// - /saint-lucia: the stored 2026 title. It is not served today, because
//   the season has wrapped and the season aware title replaces it, but it
//   would serve again once a 2027 date is set.
// - /post/*: legacy Wix pages titled from their target slug plus
//   " | Carnival Glam Hub Journal" by scripts/prerender-wix-redirects.ts.
const AWAITING_WORDING = new Set<string>([
  "prerender-routes /saint-lucia",
  "destinations.ts saint-lucia metaTitle",
  "/post/ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
  "/post/amazon-finds-i-swear-by-for-carnival-season",
  "/post/carnival_hairstyle",
  "/post/top-5-caribbean-carnival-jouvert-bands-experiences",
  "/post/strut-or-struggle-the-ultimate-guide-to-carnival-shoes",
  "/post/behind-the-scenes-with-hoppy-how-stink-dutty-became-a-global-carnival-phenomenon",
  "/post/spirit-mas-carnival-band-launch-trinidad-2025-the-stage-is-set",
  "/post/what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels",
  "/post/jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
  "/post/tribe-2026-band-launch-a-sea-of-mas-magic-mystery",
  "/post/serena-s-trinidad-carnival-journey-an-inspiration-for-all-masqueraders",
  "/post/what-is-jouvert-and-why-should-you-do-it-at-least-once",
  "/post/chloe-bailey-s-saint-lucia-carnival-costume-breaks-the-internet-khloe-kardashian-approves",
  "/post/bianca-marzano-on-hibiscus-bloom-designing-for-iconic-mas-and-why-tobago-carnival-matters",
  "/post/the-excitement-of-trinidad-carnival-2025-band-launch-season",
  "/post/2025-carnival-makeup-guide-50-looks-to-show-your-mua",
  "/post/what-you-need-to-know-about-saint-lucia-carnival",
  "/post/meet-kalista-genevieve-carnival-glam-queen-content-creator",
  "/post/carnival-ponytails-bald-spots",
  "/post/chloe-bailey-just-broke-the-internet-again-at-saint-lucia-carnival-2025",
  "/post/should-the-makeup-match-your-costume",
  "/post/rihanna-s-carnival-looks-over-the-years-50-photos",
  "/post/de-fete-need-rules-fete-etiquette",
  "/post/you-re-outside-for-trinidad-jouvert-but-your-hair-what-s-she-doing",
  "/post/from-brushes-to-baddie-dolls-glam-hub-launches-first-ever-mondaywear-store",
  "/post/winnie-harlow-turns-heads-at-jamaica-carnival-a-genxs-glam-hub-experience",
  "/post/saint-lucia-carnival-2025-travel-tips-for-international-visitors",
  "/post/carnival-icon-beyond-the-bacchanal",
  "/post/is-soft-glam-the-new-trend-uncovering-the-top-carnival-makeup-looks-for-2024",
  "/post/epic-carnival-cruise-partners-with-carnival-glam-hub-for-trinidad-carnival-2026",
  "/post/epic-welcomes-carnival-glam-hub-aboard-for-trinidad-carnival-2026",
  "/post/chatgpt-picks-the-top-5-best-caribbean-carnivals-here-s-my-wild-take",
  "/post/carnival-queen-rihanna-s-stunning-return-to-crop-over-2024",
  "/post/your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know",
  "/post/barbados-crop-over-2025-what-to-know-before-you-go",
  "/post/don-t-make-these-5-rookie-mistakes-trinidad-carnival-2026",
  "/post/jouvert-hair-tips",
  "/post/how-to-put-on-your-carnival-wire-bra",
  "/post/10-tips-for-trinidad-carnival-jouvert",
  "/post/your-carnival-hair-is-not-a-joke-jouvert-essentials-you-ll-thank-yourself-for",
]);

describe("every site title tag fits 60 characters escaped", () => {
  it("found the title sources", () => {
    expect(home).toBeTruthy();
    expect(titles.length).toBeGreaterThan(60);
  });

  it.each(titles.filter(([where]) => !AWAITING_WORDING.has(where)))("%s: %s", (_where, title) => {
    expect(escapedLength(title)).toBeLessThanOrEqual(TITLE_MAX);
  });

  it("the awaiting list only holds titles that exist and are still too long", () => {
    const found = new Map(titles);
    for (const where of AWAITING_WORDING) {
      expect(found.has(where), `${where} no longer exists`).toBe(true);
      expect(escapedLength(found.get(where)!), `${where} now fits, remove it`).toBeGreaterThan(TITLE_MAX);
    }
  });
});
