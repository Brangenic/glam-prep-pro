// Postbuild: emit real 301 redirect rules for legacy Wix /post/<slug>
// URLs and for the /destinations/<slug> aliases into dist/_redirects.
//
// Previously we shipped meta-refresh HTML stubs at dist/post/<slug>/
// index.html. Those stubs return HTTP 200, which Google increasingly
// classifies as "Soft 404" for redirect-only pages. Replacing them with
// server-level 301s (via Netlify _redirects, honoured by Lovable
// hosting) lets crawlers drop the old URL cleanly and pass link equity
// to the new one.

import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { resolve, join } from "path";
import { WIX_REDIRECTS } from "../src/lib/wixRedirects";

const DIST = resolve("dist");

// Destination slugs that have a /destinations/<slug> alias emitted by
// prerender-routes.ts. We keep the SPA fallback for JS clients but
// prefer a real 301 so crawlers only see the canonical short URL.
const DESTINATION_ALIASES = [
  "jamaica",
  "saint-lucia",
  "antigua",
  "grenada",
  "barbados",
  "miami",
  "toronto",
  "trinidad",
  "guyana",
  "epic-cruise",
];

function main() {
  if (!existsSync(DIST)) {
    console.warn("prerender-wix-redirects: dist/ not found, skipping.");
    return;
  }

  const redirectsPath = join(DIST, "_redirects");
  const existing = existsSync(redirectsPath)
    ? readFileSync(redirectsPath, "utf8")
    : "";

  const lines: string[] = [];
  lines.push("# Legacy Wix /post/<slug> → new blog URLs (301, forced).");
  for (const [slug, target] of Object.entries(WIX_REDIRECTS)) {
    // `!` forces the redirect even if a matching file exists — belt and
    // braces in case an old HTML stub is still on disk.
    lines.push(`/post/${slug}  ${target}  301!`);
  }
  lines.push("");
  lines.push("# /destinations/<slug> aliases → canonical short slug (301).");
  for (const slug of DESTINATION_ALIASES) {
    lines.push(`/destinations/${slug}  /${slug}  301!`);
  }
  lines.push("");

  // Preserve any pre-existing rules (from public/_redirects), but make
  // sure our new 301s appear BEFORE the SPA `/* /index.html 200`
  // catch-all — Netlify honours the first matching rule.
  const rendered = `${lines.join("\n")}\n${existing}`.trim() + "\n";
  writeFileSync(redirectsPath, rendered);

  // Remove any legacy HTML stubs that would otherwise be served with
  // HTTP 200 and re-introduce soft-404 signals.
  for (const slug of Object.keys(WIX_REDIRECTS)) {
    const dir = join(DIST, "post", slug);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  // Same treatment for the /destinations/<slug> aliases — the 301 rule
  // above is canonical; drop the duplicate HTML that would otherwise be
  // served (and indexed) with a self-canonical to the short URL.
  for (const slug of DESTINATION_ALIASES) {
    const dir = join(DIST, "destinations", slug);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  console.log(
    `prerender-wix-redirects: wrote ${Object.keys(WIX_REDIRECTS).length} /post/* + ${DESTINATION_ALIASES.length} /destinations/* 301 rules.`,
  );
}

main();