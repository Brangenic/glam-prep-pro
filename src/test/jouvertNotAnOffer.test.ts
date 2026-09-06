import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";

import { destinations, getDestinationFaqs } from "@/data/destinations";
import { getHubInclusions, LITE_NOT_OFFERED } from "@/data/hubTiers";
import { TERRITORY_PRICING } from "@/data/territoryPricing";
import { ALL_CARNIVAL_GUIDES, CARNIVAL_GUIDE_GROUPS } from "@/data/carnivalGuides";

const JOUVERT = /j\s*'?\s*ouv[ae]?[ry]?t?|jouvay/i;
const STRICT = /jouvert|j\s*'\s*ouvert|jouvay/i;

/**
 * J'OUVERT IS EDITORIAL, NEVER AN OFFER.
 *
 * Masqueraders do not book makeup, hair or a photoshoot for J'ouvert.
 * J'ouvert is oil, paint and mud, so Carnival Glam Hub sells nothing for
 * it in any territory and must never appear to. Confirmed by Kibwe on
 * 3 September 2026, and it applies everywhere we operate.
 *
 * A future session that finds a Grenada or Trinidad page with no
 * J'ouvert mention and thinks it is an oversight is WRONG. The absence
 * is deliberate. Do not "restore" it.
 *
 * The blog directories are scoped out on purpose. The J'ouvert articles
 * are top of funnel editorial, they rank, and one sits on a keyword doing
 * thousands of searches a month. They stay exactly as they are, in the
 * sitemap, the blog index and internal links. Editorial is fine, an offer
 * is false.
 */
const REPO = resolve(process.cwd());

// Blog content, blog metadata, blog routing and blog build scripts.
const EXEMPT = [
  "src/data/recovered",
  "src/data/recoveredPosts.ts",
  "src/data/recoveredPostsMeta.ts",
  "src/pages/blog",
  "src/pages/Blogs.tsx",
  "src/pages/BlogPost.tsx",
  "src/components/BlogCTA.tsx",
  "src/components/landing/CarnivalGuides.tsx",
  "src/components/TrinidadGuidesBlock.tsx",
  "src/lib/wixRedirects.ts",
  "scripts/prerender-blog-meta.ts",
  "scripts/prerender-wix-redirects.ts",
  // Names J'ouvert only inside the NEVER SAY guardrail, so the bot knows
  // not to sell it. The generated pack is checked separately above.
  "src/data/botKnowledge.ts",
  // The guides registry and the blog slug catalogue are pointers at journal
  // articles, nothing more. J'ouvert and Jab guides belong there, because
  // editorial is fine and only an offer is false.
  "src/data/carnivalGuides.ts",
  "src/data/blogCatalogue.ts",
];

const isExempt = (rel: string) => EXEMPT.some((e) => rel === e || rel.startsWith(`${e}/`));

/**
 * Editorial allowances. These are links and labels pointing at the J'ouvert
 * journal posts, which are protected top of funnel editorial. A link to an
 * article is not an offer, so the slug and its human readable label are
 * stripped before the commercial-surface scan runs. Nothing here sells
 * makeup, hair or a photoshoot for J'ouvert, and nothing else may be added
 * to this list unless it is likewise a pointer at a blog post.
 */
const EDITORIAL_ALLOWANCES: RegExp[] = [
  /grenada-jab-jab-spicemas-jouvert-experience/g,
  // A pointer at the protected Trinidad J'ouvert guide. A link to an
  // article is editorial, never an offer.
  /10-tips-for-trinidad-carnival-jouvert/g,
  /Grenada Jab Jab, the Spicemas J'ouvert experience/g,
  /Grenada Jab Jab: The Spicemas J'ouvert Experience/g,
  /Spicemas Jab Jab begins before dawn/g,
];

// Every registered guide is a link to a protected journal article, so its
// slug and its anchor text are stripped before the commercial scan runs.
const esc = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const GUIDE_ALLOWANCES: RegExp[] = [
  // A whole guide entry, its anchor, its blurb and its /blogs/ link, is one
  // pointer at a protected journal article. Strip the entry entirely rather
  // than word by word, so a partial strip cannot leave a stray fragment.
  ...ALL_CARNIVAL_GUIDES.map(
    (g) => new RegExp(`[^\\n"]*${esc(g.slug)}[^\\n"]*`, "g"),
  ),
  ...ALL_CARNIVAL_GUIDES.flatMap((g) => [
    new RegExp(esc(g.anchor), "g"),
    new RegExp(esc(g.blurb), "g"),
  ]),
  ...CARNIVAL_GUIDE_GROUPS.flatMap((group) => [
    new RegExp(esc(group.title), "g"),
    new RegExp(esc(group.blurb), "g"),
  ]),
];

const stripEditorial = (text: string) =>
  [...GUIDE_ALLOWANCES, ...EDITORIAL_ALLOWANCES].reduce(
    (acc, re) => acc.replace(re, ""),
    text,
  );


const walk = (dir: string, out: string[] = []) => {
  for (const entry of readdirSync(join(REPO, dir))) {
    const rel = `${dir}/${entry}`;
    if (isExempt(rel)) continue;
    if (statSync(join(REPO, rel)).isDirectory()) walk(rel, out);
    else if (/\.(ts|tsx|txt|json)$/.test(entry)) out.push(rel);
  }
  return out;
};

describe("J'ouvert is editorial, never an offer", () => {
  it("never appears in destination data", () => {
    for (const d of destinations) {
      const surfaces = [
        d.description,
        d.longDescription,
        d.metaTitle,
        d.metaDescription,
        d.cta,
        ...d.highlights,
        ...getDestinationFaqs(d).flatMap((f) => [f.question, f.answer]),
      ];
      for (const text of surfaces) expect(text ?? "", `${d.slug}: ${text}`).not.toMatch(STRICT);
    }
  });

  it("never appears in package, pricing or inclusion data", () => {
    expect(STRICT.test(JSON.stringify(TERRITORY_PRICING))).toBe(false);
    const lists = [
      ...LITE_NOT_OFFERED,
      ...destinations.flatMap((d) => getHubInclusions(d.slug) ?? []),
    ];
    for (const item of lists) expect(item).not.toMatch(STRICT);
  });

  it("never appears in llms.txt", () => {
    expect(stripEditorial(readFileSync(join(REPO, "public/llms.txt"), "utf8"))).not.toMatch(
      STRICT,
    );
  });

  it("never appears in the generated bot knowledge pack", () => {
    const pack = JSON.parse(
      readFileSync(join(REPO, "supabase/functions/chat/knowledge.json"), "utf8"),
    ) as { neverSay?: unknown };
    // The NEVER SAY guardrail names J'ouvert on purpose, so the bot knows
    // not to sell it. Every other part of the pack must be clean.
    const { neverSay, ...rest } = pack;
    expect(Array.isArray(neverSay)).toBe(true);
    expect(STRICT.test(stripEditorial(JSON.stringify(rest)))).toBe(false);
  });

  it("never appears in service pages, other pages, data or prerender scripts", () => {
    const files = [
      ...walk("src/pages"),
      ...walk("src/data"),
      ...walk("src/components"),
      ...walk("scripts"),
    ];
    const offenders = files.filter((f) =>
      STRICT.test(stripEditorial(readFileSync(join(REPO, f), "utf8"))),
    );
    expect(offenders, `J'ouvert found on commercial surfaces: ${offenders.join(", ")}`).toEqual([]);
  });
});

// Keeps the loose pattern referenced so a future edit cannot silently
// weaken it while a near-miss spelling slips onto a commercial surface.
export const JOUVERT_PATTERNS = { JOUVERT, STRICT };
