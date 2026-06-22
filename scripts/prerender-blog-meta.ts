// Postbuild: emits per-post static HTML at dist/blogs/<slug>/index.html
// with route-specific <title>, meta description, canonical and og/twitter
// tags, so social and search crawlers (which don't run JS) get accurate
// previews. The body still boots the SPA, so user-visible content is
// unchanged.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { RECOVERED_POSTS_META } from "../src/data/recoveredPostsMeta";

const BASE_URL = "https://www.carnivalglamhub.com";
const DIST = resolve("dist");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://bvrejdrsrmvdknzoskxi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cmVqZHJzcm12ZGtuem9za3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDM2NzQsImV4cCI6MjA4OTQxOTY3NH0.H6KmuQu8xb__RDjPx2ELH92WdhR4rqhfReRm23XSDN4";

const EXCLUDED_SLUG_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /crop-over-/i,
  /^chatgpt/i,
  /gpt/i,
  /^ai-/i,
  /-ai-/i,
  /^artificial/i,
];

const ALLOWED_OVERRIDE_SLUGS = new Set<string>(
  RECOVERED_POSTS_META.map((p) => p.slug),
);

const isExcludedSlug = (slug: string | null | undefined) =>
  !slug ||
  (!ALLOWED_OVERRIDE_SLUGS.has(slug) &&
    EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug)));

const isPublished = (row: { published_date?: string | null; raw_payload?: Record<string, unknown> | null }) => {
  const status =
    typeof row.raw_payload?.status === "string" ? (row.raw_payload!.status as string).toLowerCase() : null;
  if (status) return status === "published";
  if (typeof row.raw_payload?.published === "boolean") return row.raw_payload!.published as boolean;
  return Boolean(row.published_date);
};

const getSlugFromPostUrl = (postUrl: string | null | undefined) => {
  if (!postUrl) return null;
  const match = postUrl.match(/\/(?:post|blogs?)\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

// Resolve a bundled asset basename to its hashed dist URL.
function findHashedAsset(basename: string): string | null {
  const assetsDir = join(DIST, "assets");
  if (!existsSync(assetsDir)) return null;
  const files = readdirSync(assetsDir);
  // Vite outputs `${basename}-<hash>.<ext>` for static imports.
  const re = new RegExp(`^${basename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-[A-Za-z0-9_-]+\\.(webp|png|jpe?g|svg)$`);
  const hit = files.find((f) => re.test(f));
  return hit ? `${BASE_URL}/assets/${hit}` : null;
}

type Post = {
  slug: string;
  title: string;
  description: string;
  image: string;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
};

type ResolvedImage = {
  url: string;
  width: number;
  height: number;
  type: string; // image/jpeg | image/png
};

const FB_W = 1200;
const FB_H = 630;
const FALLBACK_OG = `${BASE_URL}/og-image.png`;

function rewriteWixToJpeg(url: string): string | null {
  // https://static.wixstatic.com/media/<file>[/...rest]
  const m = url.match(/^(https?:\/\/static\.wixstatic\.com\/media\/)([^/?#]+)/i);
  if (!m) return null;
  const file = m[2];
  return `${m[1]}${file}/v1/fill/w_${FB_W},h_${FB_H},al_c,q_90/${file}`;
}

async function generateLocalJpeg(slug: string, sourceUrl: string): Promise<string | null> {
  // Accept absolute (BASE_URL/...) or root-relative (/...) paths that map to
  // a file under dist/.
  const path = sourceUrl.startsWith(BASE_URL)
    ? sourceUrl.slice(BASE_URL.length)
    : sourceUrl;
  if (!path.startsWith("/")) return null;
  const localFile = join(DIST, path.replace(/^\//, ""));
  if (!existsSync(localFile)) return null;
  const outDir = join(DIST, "og");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `${slug}.jpg`);
  await sharp(localFile)
    .resize(FB_W, FB_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outFile);
  return `${BASE_URL}/og/${slug}.jpg`;
}

async function resolveOgImage(slug: string, image: string): Promise<ResolvedImage> {
  const fallback: ResolvedImage = {
    url: FALLBACK_OG,
    width: FB_W,
    height: FB_H,
    type: "image/png",
  };
  if (!image) return fallback;

  const wix = rewriteWixToJpeg(image);
  if (wix) return { url: wix, width: FB_W, height: FB_H, type: "image/jpeg" };

  const isLocal =
    image.startsWith(`${BASE_URL}/`) || image.startsWith("/");
  if (isLocal) {
    try {
      const generated = await generateLocalJpeg(slug, image);
      if (generated)
        return { url: generated, width: FB_W, height: FB_H, type: "image/jpeg" };
    } catch (err) {
      console.warn(`prerender-blog-meta: sharp failed for ${slug}:`, err);
    }
    return fallback;
  }

  // Other absolute URL. Reject WebP outright (Facebook doesn't render it).
  if (/\.webp(\?|$)/i.test(image)) return fallback;
  // Trust as-is, but still advertise FB dimensions/type best-guess.
  const type = /\.png(\?|$)/i.test(image) ? "image/png" : "image/jpeg";
  return { url: image, width: FB_W, height: FB_H, type };
}

function manualPosts(): Post[] {
  const out: Post[] = [];
  const push = (slug: string, title: string, description: string, basename: string, fallback: string) => {
    const image = findHashedAsset(basename) ?? fallback;
    out.push({ slug, title, description, image });
  };
  push(
    "is-professional-carnival-makeup-worth-it",
    "Is Professional Carnival Makeup Worth It?",
    "Professional Carnival makeup costs US$200 to US$300. Here is what you are really paying for, and whether it is worth it once Carnival is over.",
    "blog-carnival-makeup-worth-it-hero-v2",
    `${BASE_URL}/og-image.png`,
  );
  push(
    "how-far-in-advance-to-book-carnival-makeup",
    "How Far In Advance Should I Book My Carnival Makeup Artist?",
    "When to book your Carnival makeup artist, why the 4am to 8am slots go first, and how to lock in a smooth Carnival morning. A Glam Hub guide.",
    "blog-book-early-hero",
    `${BASE_URL}/og-image.png`,
  );
  push(
    "caribbean-carnival-has-an-airlift-problem",
    "The Caribbean Carnival economy doesn't have a demand problem. It has an airlift problem.",
    "Masqueraders are ready to spend, but flights into the region are the bottleneck. An editorial on Carnival's airlift problem.",
    "blog-airlift-hero",
    `${BASE_URL}/og-image.png`,
  );
  for (const p of RECOVERED_POSTS_META) {
    out.push({
      slug: p.slug,
      title: p.title,
      description: p.metaDescription,
      image: p.coverImage,
      publishedDate: p.publishedDate,
      modifiedDate: p.publishedDate,
      author: p.author,
    });
  }
  return out;
}

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rewriteHead(template: string, post: Post, img: ResolvedImage): string {
  const url = `${BASE_URL}/blogs/${post.slug}`;
  const title = `${post.title} | Carnival Glam Hub Blog`;
  const desc = post.description;
  const image = img.url;

  let html = template;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // meta name="description"
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(desc)}">`,
  );

  // canonical
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  // og:type -> article
  html = html.replace(
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="article" />`,
  );
  // og:url
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  );
  // og:title
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  );
  // og:description
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`,
  );
  // og:image (and secure_url, alt). Replace all og:image-related image URLs.
  html = html.replace(
    /<meta\s+property="og:image"[^>]*>/i,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:secure_url"[^>]*>/i,
    `<meta property="og:image:secure_url" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:image:alt"[^>]*>/i,
    `<meta property="og:image:alt" content="${escapeAttr(post.title)}" />`,
  );
  // Explicit Facebook-friendly dimensions/type.
  const setOrAppend = (re: RegExp, tag: string) => {
    if (re.test(html)) {
      html = html.replace(re, tag);
    } else {
      html = html.replace("</head>", `    ${tag}\n  </head>`);
    }
  };
  setOrAppend(
    /<meta\s+property="og:image:type"[^>]*>/i,
    `<meta property="og:image:type" content="${img.type}" />`,
  );
  setOrAppend(
    /<meta\s+property="og:image:width"[^>]*>/i,
    `<meta property="og:image:width" content="${img.width}" />`,
  );
  setOrAppend(
    /<meta\s+property="og:image:height"[^>]*>/i,
    `<meta property="og:image:height" content="${img.height}" />`,
  );

  // twitter:url
  html = html.replace(
    /<meta\s+name="twitter:url"[^>]*>/i,
    `<meta name="twitter:url" content="${escapeAttr(url)}" />`,
  );
  // twitter:image
  html = html.replace(
    /<meta\s+name="twitter:image"[^>]*>/i,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:image:alt"[^>]*>/i,
    `<meta name="twitter:image:alt" content="${escapeAttr(post.title)}" />`,
  );
  // Twitter image dimensions/type for parity with og:*.
  if (/<meta\s+name="twitter:image:width"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:image:width"[^>]*>/i,
      `<meta name="twitter:image:width" content="${img.width}" />`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:image:width" content="${img.width}" />\n  </head>`,
    );
  }
  if (/<meta\s+name="twitter:image:height"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:image:height"[^>]*>/i,
      `<meta name="twitter:image:height" content="${img.height}" />`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:image:height" content="${img.height}" />\n  </head>`,
    );
  }
  // twitter:title / description (these live near the bottom of head)
  if (/<meta\s+name="twitter:title"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:title"[^>]*>/i,
      `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:title" content="${escapeAttr(title)}">\n  </head>`,
    );
  }
  if (/<meta\s+name="twitter:description"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="twitter:description"[^>]*>/i,
      `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
    );
  } else {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:description" content="${escapeAttr(desc)}">\n  </head>`,
    );
  }
  // Ensure twitter:card is summary_large_image
  if (!/<meta\s+name="twitter:card"/i.test(html)) {
    html = html.replace(
      "</head>",
      `    <meta name="twitter:card" content="summary_large_image">\n  </head>`,
    );
  }

  // BlogPosting JSON-LD
  const authorName = (post.author ?? "").trim();
  const isOrgAuthor =
    !authorName || /carnival\s+glam\s+hub/i.test(authorName);
  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: desc,
    image: [image],
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: isOrgAuthor
      ? { "@type": "Organization", name: "Carnival Glam Hub" }
      : { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Carnival Glam Hub",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.png`,
      },
    },
  };
  if (post.publishedDate) blogPosting.datePublished = post.publishedDate;
  blogPosting.dateModified = post.modifiedDate ?? post.publishedDate ?? undefined;
  const jsonLd = `<script type="application/ld+json" data-prerender="blogposting">${JSON.stringify(
    blogPosting,
  ).replace(/</g, "\\u003c")}</script>`;
  html = html.replace("</head>", `    ${jsonLd}\n  </head>`);

  return html;
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("prerender-blog-meta: dist/index.html not found, skipping.");
    return;
  }
  const template = readFileSync(indexPath, "utf8");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const posts: Post[] = [];
  const seen = new Set<string>();

  // Manual posts win on duplicate slugs.
  for (const m of manualPosts()) {
    if (seen.has(m.slug)) continue;
    seen.add(m.slug);
    posts.push(m);
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, post_url, title, excerpt, meta_description, image_url, published_date, author_name, raw_payload")
      .order("synced_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    for (const row of data ?? []) {
      if (!isPublished(row)) continue;
      const slug = row.slug || getSlugFromPostUrl(row.post_url);
      if (!slug || isExcludedSlug(slug)) continue;
      if (seen.has(slug)) continue;
      const title = (row.title ?? "").trim();
      if (!title) continue;
      const description = (row.meta_description ?? row.excerpt ?? "").toString().trim();
      const image = (row.image_url ?? "").toString().trim() || `${BASE_URL}/og-image.png`;
      seen.add(slug);
      posts.push({
        slug,
        title,
        description,
        image,
        publishedDate: (row.published_date ?? "").toString() || undefined,
        modifiedDate: (row.published_date ?? "").toString() || undefined,
        author: (row.author_name ?? "").toString() || undefined,
      });
    }
  } catch (err) {
    console.warn("prerender-blog-meta: failed to fetch blog posts.", err);
  }

  let written = 0;
  for (const post of posts) {
    const resolved = await resolveOgImage(post.slug, post.image);
    const html = rewriteHead(template, post, resolved);
    const dir = join(DIST, "blogs", post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    written++;
  }
  console.log(`prerender-blog-meta: wrote ${written} per-post HTML files.`);
}

main().catch((err) => {
  console.error("prerender-blog-meta failed:", err);
  process.exit(0); // never block the build
});