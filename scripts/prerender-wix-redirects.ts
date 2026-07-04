// Postbuild: emits static HTML at dist/post/<slug>/index.html for each
// legacy Wix URL. Each file canonicalises to the new target on
// www.carnivalglamhub.com and triggers an instant client-side redirect
// for browsers, while crawlers honour the canonical link element.

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { WIX_REDIRECTS, WIX_REDIRECT_BASE } from "../src/lib/wixRedirects";

const DIST = resolve("dist");

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml(targetAbs: string): string {
  const t = escapeAttr(targetAbs);
  // Derive a unique title from the target path so redirect stubs never
  // share the same <title>. Fixes duplicate-title errors in audits.
  let targetPath = "/";
  try {
    targetPath = new URL(targetAbs).pathname || "/";
  } catch {}
  const title = `Redirecting to ${escapeAttr(targetPath)} | Carnival Glam Hub`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${t}" />
    <meta http-equiv="refresh" content="0; url=${t}" />
    <meta property="og:url" content="${t}" />
    <meta property="og:type" content="article" />
    <link rel="alternate" href="${t}" />
    <script>window.location.replace(${JSON.stringify(targetAbs)});</script>
  </head>
  <body>
    <p>This page has moved. Redirecting to <a href="${t}">${t}</a>.</p>
  </body>
</html>
`;
}

function main() {
  if (!existsSync(DIST)) {
    console.warn("prerender-wix-redirects: dist/ not found, skipping.");
    return;
  }
  let written = 0;
  for (const [slug, target] of Object.entries(WIX_REDIRECTS)) {
    const abs = `${WIX_REDIRECT_BASE}${target}`;
    const dir = join(DIST, "post", slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), buildHtml(abs));
    written++;
  }
  console.log(`prerender-wix-redirects: wrote ${written} redirect HTML files.`);
}

main();