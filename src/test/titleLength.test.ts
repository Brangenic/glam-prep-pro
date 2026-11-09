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
import { WIX_REDIRECTS, wixRedirectTitle } from "@/lib/wixRedirects";

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

// Legacy Wix /post/<slug> pages, from the same title function as
// scripts/prerender-wix-redirects.ts.
for (const [from, to] of Object.entries(WIX_REDIRECTS)) {
  add(`/post/${from}`, wixRedirectTitle(to));
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

describe("every site title tag fits 60 characters escaped", () => {
  it("found the title sources", () => {
    expect(home).toBeTruthy();
    expect(titles.length).toBeGreaterThan(60);
  });

  // No exemptions. Every title source is checked.
  it.each(titles)("%s: %s", (_where, title) => {
    expect(escapedLength(title)).toBeLessThanOrEqual(TITLE_MAX);
  });
});
