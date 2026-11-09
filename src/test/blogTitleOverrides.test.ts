/**
 * Blog title overrides are final <title> tags. An override longer than 60
 * characters once HTML escaped is cut word by word by fitTitle, which is
 * how eleven headlines were served mid-phrase in search results. Every
 * override must fit intact, on the prerendered surface and the runtime one.
 *
 * Both maps are read from source, because importing the prerender script
 * would run its build step.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TITLE_MAX } from "@/lib/metaText";

const escapedLength = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").length;

function readMap(file: string, name: string): Record<string, string> {
  const src = readFileSync(resolve(file), "utf8");
  const start = src.indexOf(`${name}: Record<string, string> = {`);
  expect(start, `${name} not found in ${file}`).toBeGreaterThan(-1);
  const block = src.slice(start, src.indexOf("\n};", start));
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    expect(out[m[1]], `duplicate override for ${m[1]}`).toBeUndefined();
    out[m[1]] = m[2];
  }
  return out;
}

const PRERENDER = readMap("scripts/prerender-blog-meta.ts", "SEO_TITLE_OVERRIDES");
const RUNTIME = readMap("src/pages/BlogPost.tsx", "SLUG_META_TITLE_OVERRIDES");

const NEW_TITLES: Record<string, string> = {
  "caribbean-carnival-has-an-airlift-problem": "Caribbean Carnival's Real Problem Is Airlift, Not Demand",
  "yuma-ferocious-trinidad-carnival-2027-band-launch": "YUMA Ferocious: Trinidad Carnival 2027 Band Launch",
  "trinidad-carnival-vs-jamaica-carnival": "Trinidad Carnival vs Jamaica Carnival: Which to Choose",
  "jab-jab-grenada-2026-guide": "Jab Jab Grenada: What to Wear, Bring and How to Clean Up",
  "saint-lucia-carnival-2025-travel-tips-for-international-visitors":
    "Saint Lucia Carnival: Travel Tips for Visitors Flying In",
  "dont-skip-jouvert-because-of-your-hair-tips-to-keep-it-fabulous":
    "Don't Skip J'ouvert Over Your Hair: How to Protect It",
  "spirit-mas-band-launch-trinidad-carnival-2025-the-stage-is-set": "Spirit Mas Band Launch: Trinidad Carnival 2025",
  "meet-kalista-genevieve-carnival-glam-queen-content-creator": "Meet Kalista Genevieve: Carnival Glam Queen and Creator",
  "chloe-baileys-saint-lucia-carnival-costume-breaks-the-internet":
    "Chloe Bailey's Saint Lucia Carnival Costume Goes Viral",
  "chloe-bailey-just-broke-the-internet-again-at-saint-lucia-carnival-2025":
    "Chloe Bailey at Saint Lucia Carnival 2025: The Looks",
  "youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing":
    "Trinidad J'ouvert Hair: What Is Yours Actually Doing?",
  "10-tips-for-trinidad-carnival-jouvert": "10 Trinidad J'ouvert Tips From People Who Have Done It",
  "carnival-queen-rihannas-stunning-return-to-crop-over-2024": "Rihanna's Crop Over 2024: The Carnival Queen Returns",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival": "Jab Jab 101: What to Know About Grenada Spicemas",
};

describe("blog title overrides fit 60 characters escaped", () => {
  it.each(Object.entries(PRERENDER))("prerender: %s", (_slug, title) => {
    expect(escapedLength(title)).toBeLessThanOrEqual(TITLE_MAX);
  });

  // No exemptions. Every runtime override fits too.
  it.each(Object.entries(RUNTIME))("runtime: %s", (_slug, title) => {
    expect(escapedLength(title)).toBeLessThanOrEqual(TITLE_MAX);
  });
});

describe("the replacement titles", () => {
  it.each(Object.entries(NEW_TITLES))("%s is identical on both surfaces", (slug, title) => {
    expect(PRERENDER[slug]).toBe(title);
    expect(RUNTIME[slug]).toBe(title);
  });

  it("the airlift post's own page sets the same title tag", () => {
    const src = readFileSync(resolve("src/pages/blog/AirliftProblem.tsx"), "utf8");
    expect(src.match(/const META_TITLE = "([^"]+)"/)?.[1]).toBe(NEW_TITLES["caribbean-carnival-has-an-airlift-problem"]);
  });

  it("use no em dash", () => {
    expect(Object.values(NEW_TITLES).join(" ")).not.toMatch(/\u2014/);
  });
});
