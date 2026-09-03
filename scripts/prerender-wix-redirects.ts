// Postbuild: emit per-legacy-Wix-slug HTML at dist/post/<slug>/index.html.
//
// Lovable production hosting has no edge/rewrite layer (no _redirects,
// no _headers, no netlify.toml). The strongest signal we can emit for a
// dead legacy URL is therefore a static HTML page that (a) canonicalises
// itself to the new URL, (b) client-redirects browsers, and (c) carries
// enough real content that Google follows the canonical instead of
// flagging "Soft 404" on an empty redirect stub.
//
// Previous version was a bare meta-refresh page with `noindex,follow`
// and one sentence of body, Google Search Console classified those as
// Soft 404. This version keeps the canonical + JS redirect for
// browsers, drops `noindex` (canonical does the consolidation), and
// adds a real content block that names the destination post so the
// page is not "empty" to a crawler that ignores the meta-refresh.

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { WIX_REDIRECTS, WIX_REDIRECT_BASE } from "../src/lib/wixRedirects";

const DIST = resolve("dist");

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function humanTitle(targetPath: string): string {
  // Turn "/blogs/some-slug-name" into "Some Slug Name"
  const slug = targetPath.replace(/^\/blogs\//, "").replace(/^\/+/, "");
  if (!slug) return "Carnival Glam Hub Journal";
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function buildHtml(targetAbs: string, targetPath: string): string {
  const t = escapeAttr(targetAbs);
  const heading = escapeAttr(humanTitle(targetPath));
  const title = `${heading} | Carnival Glam Hub Journal`;
  // NOTE: intentionally NO `noindex`. Self-canonical to the new URL is
  // the correct consolidation signal. Google will drop the /post/*
  // slug and index the target instead.
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="This Carnival Glam Hub Journal post has moved to a new URL. Read the full article at ${t}." />
    <link rel="canonical" href="${t}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${t}" />
    <meta property="og:title" content="${escapeAttr(heading)}" />
    <meta property="og:description" content="Read the full Carnival Glam Hub Journal post at ${t}." />
    <meta http-equiv="refresh" content="0; url=${t}" />
    <script>window.location.replace(${JSON.stringify(targetAbs)});</script>
  </head>
  <body>
    <main style="font-family:system-ui,sans-serif;max-width:640px;margin:4rem auto;padding:0 1rem;line-height:1.55;color:#222">
      <h1 style="font-size:1.6rem;margin:0 0 1rem">${escapeAttr(heading)}</h1>
      <p>This Carnival Glam Hub Journal article has moved to a new permanent URL.</p>
      <p>Read the full post here: <a href="${t}" rel="canonical">${t}</a>.</p>
      <p>You'll be redirected automatically in a moment. If not, tap the link above.</p>
      <p style="margin-top:2rem"><a href="https://www.carnivalglamhub.com/blogs">Back to the Carnival Glam Hub Journal</a>, sweat-resistant carnival makeup, hair, dressing, photoshoot and shuttle for masqueraders flying in for Trinidad, Jamaica, Crop Over and more.</p>
    </main>
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
    writeFileSync(join(dir, "index.html"), buildHtml(abs, target));
    written++;
  }
  console.log(`prerender-wix-redirects: wrote ${written} redirect HTML files (self-canonical to new URL, no noindex).`);
}

main();