// Postbuild: emit a redirect page at dist/blogs/<slug>/index.html for
// every withdrawn blog post listed in src/lib/removedPosts.ts.
//
// Lovable production hosting has no edge or rewrite layer (no
// _redirects, no _headers, no netlify.toml). So a deleted post URL
// cannot be given a real 301 from inside this repository. This mirrors
// scripts/prerender-wix-redirects.ts: canonical to the replacement URL,
// meta refresh, JavaScript redirect, and a real content block so Google
// follows the canonical instead of flagging a Soft 404. A bare one
// sentence stub was flagged Soft 404 in Search Console once already, so
// never reduce these pages to a single line.

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { REMOVED_POSTS, REMOVED_POST_BASE } from "../src/lib/removedPosts";

const DIST = resolve("dist");

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml(targetAbs: string): string {
  const t = escapeAttr(targetAbs);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Carnival Glam Hub Reviews: What Masqueraders Say</title>
    <meta name="description" content="Reviews and testimonials from masqueraders who booked Carnival makeup, hair, dressing and photoshoots with Carnival Glam Hub. Read them all on our reviews page." />
    <link rel="canonical" href="${t}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${t}" />
    <meta property="og:title" content="Carnival Glam Hub Reviews: What Masqueraders Say" />
    <meta property="og:description" content="Verified reviews from masqueraders who booked Carnival makeup, hair, dressing and photoshoots with Carnival Glam Hub." />
    <meta http-equiv="refresh" content="0; url=${t}" />
    <script>window.location.replace(${JSON.stringify(targetAbs)});</script>
  </head>
  <body>
    <main style="font-family:system-ui,sans-serif;max-width:640px;margin:4rem auto;padding:0 1rem;line-height:1.55;color:#222">
      <h1 style="font-size:1.6rem;margin:0 0 1rem">What masqueraders say about Carnival Glam Hub</h1>
      <p>This article has been retired. Everything that was in it, and a great deal more, now lives on our reviews page.</p>
      <p>Read the reviews here: <a href="${t}" rel="canonical">${t}</a>.</p>
      <p>You will be redirected automatically in a moment. If not, tap the link above.</p>
      <p>Carnival Glam Hub is a regional Carnival beauty service for masqueraders flying in for Trinidad, Jamaica, Crop Over, Spicemas, Saint Lucia, Toronto, Miami and more. Sweat-resistant Carnival makeup, hair, dressing assistance and photoshoots, booked in advance so your Carnival morning is calm.</p>
      <p style="margin-top:2rem"><a href="https://www.carnivalglamhub.com/blogs">Back to the Carnival Glam Hub Journal</a></p>
    </main>
  </body>
</html>
`;
}

function main() {
  if (!existsSync(DIST)) {
    console.warn("prerender-removed-posts: dist/ not found, skipping.");
    return;
  }
  let written = 0;
  for (const [slug, target] of Object.entries(REMOVED_POSTS)) {
    const abs = `${REMOVED_POST_BASE}${target}`;
    const dir = join(DIST, "blogs", slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), buildHtml(abs));
    written++;
  }
  console.log(
    `prerender-removed-posts: wrote ${written} withdrawn-post redirect pages (self-canonical to replacement URL).`,
  );
}

main();
