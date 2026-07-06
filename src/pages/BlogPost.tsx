import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PromoBookingCard from "@/components/PromoBookingCard";

// Extract a YouTube video id from any common URL form. Strips tracking
// params like ?si=, &t=. Returns { id, kind } or null. kind="shorts" gets
// rendered vertically.
const parseYouTube = (
  raw: string,
): { id: string; kind: "video" | "shorts" } | null => {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  const clean = (id: string) => id.replace(/[^A-Za-z0-9_-]/g, "");
  if (host === "youtu.be") {
    const id = clean(url.pathname.slice(1));
    return id ? { id, kind: "video" } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const shorts = url.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shorts) {
      const id = clean(shorts[1]);
      return id ? { id, kind: "shorts" } : null;
    }
    if (url.pathname === "/watch") {
      const id = clean(url.searchParams.get("v") ?? "");
      return id ? { id, kind: "video" } : null;
    }
    const embed = url.pathname.match(/^\/embed\/([^/?#]+)/);
    if (embed) {
      const id = clean(embed[1]);
      return id ? { id, kind: "video" } : null;
    }
  }
  return null;
};

const YouTubeEmbed = ({
  id,
  kind,
}: {
  id: string;
  kind: "video" | "shorts";
}) => {
  const src = `https://www.youtube-nocookie.com/embed/${id}`;
  if (kind === "shorts") {
    return (
      <div className="my-8 mx-auto" style={{ maxWidth: 360 }}>
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "9 / 16" }}>
          <iframe
            src={src}
            title="YouTube short"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="my-8">
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={src}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
};

const cleanMarkdown = (md: string): string => {
  let out = md
    .replace(/\[!\[.*?\]\(https:\/\/smartarget\.online[^\]]*\)\]\([^)]*\)\s*/g, '')
    .replace(/Skip to Main Content\s*/gi, '')
    .replace(/!\[\]\(https:\/\/static\.wixstatic\.com\/media\/[^)]*?fill\/w_\d+,h_1200[^)]*\)\s*/g, '')
    .replace(/^Search\s*$/gm, '')
    .replace(/bottom of page[\s\S]*$/gi, '')
    .replace(/Smartarget Apps are hidden[\s\S]*?top of page\s*/gi, '')
    .replace(/loadbalancer\.visitor-analytics\.io[\s\S]*?ERR_BLOCKED_BY_CLIENT[\s\S]*?Reload\s*/gi, '')
    .replace(/!\[\]\(data:image\/svg\+xml[^\n]*\n?/g, '')
    .replace(/!\[Close Button Icon\][^\n]*\n?/gi, '')
    // Strip leftover Wix comments/ratings block at the bottom of any post
    .replace(/##\s*Comments[\s\S]*$/i, '')
    .replace(/!\[\]\(<Base64-Image-Removed>\)/g, '')
    // Remove blurred thumbnail previews that immediately precede the full
    // resolution version of the same Wix image (q_30,blur_30 placeholders).
    .replace(/!\[[^\]]*\]\([^)]*?q_30,blur_30[^)]*?\)\s*\\?\s*/g, '')
    // Strip stray literal backslashes that leak in from Wix markdown exports.
    // These render as visible "\" characters next to images and captions.
    // Only strip backslashes that aren't escaping a markdown-meaningful char.
    .replace(/\\(?=\s|$)/g, '')
    .replace(/^\s*\\\s*$/gm, '')
    // Strip any remaining stray backslashes that aren't escaping a markdown
    // special character (so we keep \* \_ \[ \] \( \) \# \` \\ \! intact).
    .replace(/\\(?![*_\[\]()#`\\!])/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // De-duplicate consecutive/repeated standalone booking CTA links to
  // carnivalglamhub.masos.app — keep only the FIRST occurrence so we
  // never stack 3+ identical "Book Now" buttons at the foot of a post.
  const bookingLineRe =
    /^\s*\[[^\]]*\]\(\s*https?:\/\/(?:[^/)\s]*\.)?carnivalglamhub\.masos\.app[^)\s]*\)\s*$/i;
  const lines = out.split(/\r?\n/);
  let seenBooking = false;
  const kept: string[] = [];
  for (const line of lines) {
    if (bookingLineRe.test(line)) {
      if (seenBooking) continue;
      seenBooking = true;
    }
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
};

// Merge consecutive standalone CTA button links (masos.app booking +
// wa.me WhatsApp) into a single paragraph so the renderer can lay them
// out side by side instead of stacking vertically.
function groupCtaButtons(md: string): string {
  const ctaLineRe =
    /^\s*\[[^\]]+\]\(\s*https?:\/\/(?:(?:[^/)\s]*\.)?carnivalglamhub\.masos\.app|(?:[^/)\s]*\.)?wa\.me)[^)\s]*\)\s*$/i;
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    if (ctaLineRe.test(cur)) {
      const group: string[] = [cur.trim()];
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].trim() === "") { j++; continue; }
        if (ctaLineRe.test(lines[j])) { group.push(lines[j].trim()); j++; continue; }
        break;
      }
      if (group.length > 1) {
        out.push(group.join(" "));
        i = j - 1;
        continue;
      }
    }
    out.push(cur);
  }
  return out.join("\n");
}
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";
import makeupGuide2026Cover from "@/assets/blog-2026-makeup-guide-cover.webp";
import { RECOVERED_POST_BY_SLUG } from "@/data/recoveredPosts";
import RelatedGuides from "@/components/RelatedGuides";
import RelatedLinks from "@/components/RelatedLinks";
import BlogCTA from "@/components/BlogCTA";
import { buildFaqSchema } from "@/lib/faqSchema";

// Slug rewrite map: some old post bodies link to slugs that don't exist.
// Rewrite the href at render time to the real slug so we don't emit 404s.
const SLUG_LINK_REWRITES: Record<string, string> = {
  "/blogs/carnival-glam-hub-reviews":
    "/blogs/what-people-say-about-carnival-glam-hub",
  "/blogs/barbados-crop-over-2026-what-to-know-before-you-go":
    "/blogs/barbados-crop-over-2025-what-to-know-before-you-go",
  "/blogs/saint-lucia-carnival-2026-travel-tips-for-international-visitors":
    "/blogs/saint-lucia-carnival-2025-travel-tips-for-international-visitors",
};

const HOST_LABELS: Array<[RegExp, string]> = [
  [/(?:^|\.)pinterest\.[a-z.]+$/i, "View on Pinterest"],
  [/(?:^|\.)instagram\.com$/i, "View on Instagram"],
  [/(?:^|\.)tiktok\.com$/i, "View on TikTok"],
  [/(?:^|\.)youtube\.com$|(?:^|\.)youtu\.be$/i, "Watch on YouTube"],
  [/(?:^|\.)facebook\.com$/i, "View on Facebook"],
  [/carnivalglamhub\.masos\.app$/i, "Book on MasOS"],
  [/(?:^|\.)amazon\.[a-z.]+$/i, "View on Amazon"],
];

function labelForHost(href: string): string | null {
  try {
    const host = new URL(href).hostname.toLowerCase();
    for (const [re, label] of HOST_LABELS) if (re.test(host)) return label;
    return `Visit ${host.replace(/^www\./, "")}`;
  } catch {
    return null;
  }
}

// Sanitise link hrefs found in post bodies before render:
//   - HTTP → HTTPS on our own domain
//   - .club → .com
//   - Rewrite three phantom blog slugs to their real slugs
// Also drop anchors pointing at http://solution.mini / http://happen.mini
// while preserving their inner content.
function sanitizeLinksInMarkdown(md: string): string {
  let out = md;
  // http(s)://[www.]carnivalglamhub.com/... → https://www.carnivalglamhub.com/...
  out = out.replace(
    /https?:\/\/(?:www\.)?carnivalglamhub\.com/gi,
    "https://www.carnivalglamhub.com",
  );
  // *.carnivalglamhub.club → carnivalglamhub.com
  out = out.replace(
    /https?:\/\/(?:www\.)?carnivalglamhub\.club/gi,
    "https://www.carnivalglamhub.com",
  );
  // Phantom slugs
  for (const [bad, good] of Object.entries(SLUG_LINK_REWRITES)) {
    const abs = `https://www.carnivalglamhub.com${bad}`;
    out = out.split(abs).join(`https://www.carnivalglamhub.com${good}`);
    // Bare relative form inside markdown links: ](/blogs/...)
    out = out.split(`](${bad})`).join(`](${good})`);
    out = out.split(`](${bad}/)`).join(`](${good})`);
  }
  // Drop anchors pointing at solution.mini / happen.mini, keep inner text/image.
  // Matches markdown [inner](http://solution.mini/...) or (http://happen.mini/...)
  out = out.replace(
    /\[((?:[^\[\]]|\[[^\]]*\])*?)\]\(https?:\/\/(?:solution|happen)\.mini[^)]*\)/g,
    "$1",
  );
  return out;
}

function isDeadLinkHref(href: string | undefined | null): boolean {
  if (!href) return false;
  try {
    const h = new URL(href).hostname.toLowerCase();
    return h === "solution.mini" || h === "happen.mini";
  } catch {
    return false;
  }
}

function rewriteHref(href: string | undefined): string | undefined {
  if (!href) return href;
  let out = href;
  out = out.replace(
    /^https?:\/\/(?:www\.)?carnivalglamhub\.com/i,
    "https://www.carnivalglamhub.com",
  );
  out = out.replace(
    /^https?:\/\/(?:www\.)?carnivalglamhub\.club/i,
    "https://www.carnivalglamhub.com",
  );
  for (const [bad, good] of Object.entries(SLUG_LINK_REWRITES)) {
    if (
      out === bad ||
      out === `${bad}/` ||
      out === `https://www.carnivalglamhub.com${bad}` ||
      out === `https://www.carnivalglamhub.com${bad}/`
    ) {
      return out.startsWith("http")
        ? `https://www.carnivalglamhub.com${good}`
        : good;
    }
  }
  return out;
}

// Bundled hero overrides: replace unreliable storage-bucket URLs with
// reliable bundled WebP imports for specific slugs.
const SLUG_HERO_OVERRIDES: Record<string, string> = {
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua": makeupGuide2026Cover,
};

// Per-slug meta title overrides, kept under 60 characters for SEO.
const SLUG_META_TITLE_OVERRIDES: Record<string, string> = {
  "tribe-carnival-2027-elysia-band-launch":
    "TRIBE Carnival 2027: Inside the Elysia Band Launch",
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua":
    "2026 Carnival Makeup Guide: 50 Looks | Glam Hub",
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips":
    "Trinidad Carnival 2027: Dates, Bands, Costumes & First-Timer Guide | Carnival Glam Hub",
  "what-is-jouvert-and-why-should-you-do-it-at-least-once":
    "What Is J'ouvert? The Pre-Dawn Carnival Ritual Explained | Carnival Glam Hub",
  "10-tips-for-trinidad-carnival-jouvert":
    "10 J'ouvert Tips for Trinidad Carnival, From People Who Have Played | Carnival Glam Hub",
  "top-seven-best-carnival-hairstyles":
    "The Best Carnival Hairstyles That Survive the Road | Carnival Glam Hub",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival":
    "Jab Jab 101: What You Need to Know About Grenada Spicemas | Carnival Glam Hub",
  "top-5-caribbean-carnival-jouvert-bands-experiences":
    "The 5 Best Caribbean Carnival J'ouvert Bands and Experiences | Carnival Glam Hub",
  "strut-or-struggle-the-ultimate-guide-to-carnival-shoes":
    "The Ultimate Carnival Shoes Guide: Strut, Do Not Struggle | Carnival Glam Hub",
  "carnival-queen-rihannas-stunning-return-to-crop-over-2024":
    "Rihanna's Crop Over Looks: The Carnival Queen Returns to Barbados | Carnival Glam Hub",
};

// Per-slug body content cleanup: strip broken images (and their orphan
// caption lines) that should no longer appear in the article body.
const slugContentCleaners: Record<string, (md: string) => string> = {
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua": (md) => {
    return md
      // Remove the broken 2026 makeup-guide cover image at the top of the body
      .replace(/!\[[^\]]*\]\(https:\/\/[^)]*blog-images\/[^)]*2026[^)]*\)\s*/gi, '')
      // Orphan caption that belonged only to that removed cover image
      .replace(/^\s*Luxurios Soft Glam\s*$/gim, '')
      // Remove the Pinterest-linked AI-generated woman image
      .replace(/\[!\[[^\]]*\]\(https:\/\/static\.wixstatic\.com\/media\/[^)]*\)\]\([^)]*pinterest[^)]*\)\s*/gi, '')
      // Orphan caption that belonged only to that removed Pinterest image
      .replace(/^\s*[“"]Whatever you think looks good[”"][^\n]*\n?/gim, '')
      // Promote standalone bold lines to h2 headings so they get generous
      // top spacing from the prose styles.
      .replace(/^\*\*([^\n*][^\n]*?)\*\*\s*$/gm, '## $1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  },
};

type BlogPostData = {
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  published_date: string | null;
  read_time: string | null;
  meta_description: string | null;
  updated_at: string | null;
};

const BANNED_SLUG_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /^crop-over-/i,
  /^chatgpt-/i,
  /-gpt-/i,
  /^gpt-/i,
  /^ai-/i,
  /^artificial-/i,
];

const isBannedSlug = (slug: string | undefined | null) => {
  if (!slug) return false;
  // Recovered legacy posts always render — never treat as banned.
  if (slug in RECOVERED_POST_BY_SLUG) return false;
  return BANNED_SLUG_PATTERNS.some((re) => re.test(slug));
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronously mark known-deleted slugs as noindex on first paint, before
  // the database roundtrip resolves. True 410/404 status codes are not
  // achievable from a static SPA host; this is the strongest signal we can
  // emit for JS-executing crawlers.
  useEffect(() => {
    if (!isBannedSlug(slug)) return;
    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(robots);
    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", "https://www.carnivalglamhub.com/blogs");
    document.head.appendChild(canonical);
    setLoading(false);
    setPost(null);
    return () => {
      robots.remove();
      canonical.remove();
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    // Skip the DB roundtrip entirely for banned slugs; they are gone.
    if (isBannedSlug(slug)) return;

    // Code-resident recovered posts: render directly, no DB roundtrip.
    const recovered = RECOVERED_POST_BY_SLUG[slug];
    if (recovered) {
      setPost({
        title: recovered.title,
        content: recovered.content,
        excerpt: recovered.excerpt,
        image_url: recovered.coverImage,
        author_name: recovered.author,
        author_avatar_url: null,
        published_date: recovered.publishedDate,
        read_time: recovered.readTime,
        meta_description: recovered.metaDescription,
        updated_at: recovered.publishedDate,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    const load = async () => {
      const normalizedSlug = decodeURIComponent(slug);
      const selectColumns = "title, content, excerpt, image_url, author_name, author_avatar_url, published_date, read_time, meta_description, updated_at";

      const { data: bySlug } = await supabase
        .from("blog_posts")
        .select(selectColumns)
        .eq("slug", normalizedSlug)
        .maybeSingle();

      let resolvedPost = bySlug as BlogPostData | null;

      if (!resolvedPost) {
        const { data: byExternalId } = await supabase
          .from("blog_posts")
          .select(selectColumns)
          .eq("external_id", normalizedSlug)
          .maybeSingle();

        resolvedPost = byExternalId as BlogPostData | null;
      }

      if (!resolvedPost) {
        const { data: byPostUrlSlug } = await supabase
          .from("blog_posts")
          .select(selectColumns)
          .ilike("post_url", `%/post/${normalizedSlug}`)
          .maybeSingle();

        resolvedPost = byPostUrlSlug as BlogPostData | null;
      }

      if (isMounted) {
        if (resolvedPost && slug && SLUG_HERO_OVERRIDES[slug]) {
          resolvedPost = { ...resolvedPost, image_url: SLUG_HERO_OVERRIDES[slug] };
        }
        setPost(resolvedPost);
        setLoading(false);
      }

      // If post exists but has no content, trigger a background sync
      if (resolvedPost && !resolvedPost.content) {
        // Scrape this specific post's content on demand
        const { data: scraped } = await supabase.functions.invoke("scrape-blog-content", {
          body: { slug: normalizedSlug },
        });
        if (isMounted && scraped?.content) {
          setPost((prev) => prev ? { ...prev, content: scraped.content } : prev);
        }
      }
    };

    load();
    return () => { isMounted = false; };
  }, [slug]);

  useEffect(() => {
    if (post?.title) {
      const override = slug ? SLUG_META_TITLE_OVERRIDES[slug] : undefined;
      if (override) {
        document.title = override;
      } else {
        const suffix = " | Carnival Glam Hub Blog";
        const withSuffix = `${post.title}${suffix}`;
        document.title =
          withSuffix.length <= 70 ? withSuffix : post.title;
      }
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (post?.meta_description && metaDesc) {
      metaDesc.setAttribute("content", post.meta_description);
    }

    // 410-style handling: when load is complete and no post resolved,
    // mark this URL as noindex so search engines drop the stale slug.
    let robotsTag: HTMLMetaElement | null = null;
    let canonicalTag: HTMLLinkElement | null = null;
    if (!loading && !post) {
      document.title = "Post not found | Carnival Glam Hub";
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      robotsTag.setAttribute("content", "noindex, nofollow");
      document.head.appendChild(robotsTag);
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      canonicalTag.setAttribute("href", "https://www.carnivalglamhub.com/blogs");
      document.head.appendChild(canonicalTag);
    }

    // Extract and inject FAQ schema from AI-generated content
    let faqScript: HTMLScriptElement | null = null;
    let articleScript: HTMLScriptElement | null = null;
    let breadcrumbScript: HTMLScriptElement | null = null;

    if (post && slug && !isBannedSlug(slug)) {
      const postUrl = `https://www.carnivalglamhub.com/blogs/${slug}`;
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        image: post.image_url
          ? {
              "@type": "ImageObject",
              url: post.image_url,
              width: 1200,
              height: 630,
            }
          : undefined,
        datePublished: post.published_date ?? undefined,
        dateModified: post.updated_at ?? post.published_date ?? undefined,
        author: post.author_name
          ? { "@type": "Person", name: post.author_name }
          : { "@type": "Organization", name: "Carnival Glam Hub" },
        publisher: {
          "@type": "Organization",
          name: "Carnival Glam Hub",
          logo: {
            "@type": "ImageObject",
            url: "https://www.carnivalglamhub.com/logo.png",
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        description: post.meta_description ?? post.excerpt ?? undefined,
      };
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.textContent = JSON.stringify(articleSchema);
      document.head.appendChild(articleScript);

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
          { "@type": "ListItem", position: 2, name: "Journal", item: "https://www.carnivalglamhub.com/blogs" },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      };
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.type = "application/ld+json";
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }

    if (post?.content) {
      const faqMatch = post.content.match(/<!-- FAQ_SCHEMA_JSON\n([\s\S]*?)\n-->/);
      if (faqMatch?.[1]) {
        try {
          const faqSchema = JSON.parse(faqMatch[1]);
          faqScript = document.createElement("script");
          faqScript.type = "application/ld+json";
          faqScript.textContent = JSON.stringify(faqSchema);
          document.head.appendChild(faqScript);
        } catch {}
      }
      // Generic fallback: derive FAQPage schema from a `## Frequently Asked
      // Questions` section if no embedded JSON was provided.
      if (!faqScript) {
        const derived = buildFaqSchema(post.content);
        if (derived) {
          faqScript = document.createElement("script");
          faqScript.type = "application/ld+json";
          faqScript.textContent = JSON.stringify(derived);
          document.head.appendChild(faqScript);
        }
      }
    }

    return () => {
      document.title = "Carnival Glam Hub";
      if (faqScript) faqScript.remove();
      if (articleScript) articleScript.remove();
      if (breadcrumbScript) breadcrumbScript.remove();
      if (robotsTag) robotsTag.remove();
      if (canonicalTag) canonicalTag.remove();
    };
  }, [post, loading, slug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <article className="py-10 sm:py-14 lg:py-18">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-5 bg-muted rounded w-24" />
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-muted rounded w-28" />
                    <div className="h-3 bg-muted rounded w-40" />
                  </div>
                </div>
                <div className="h-72 bg-muted rounded-2xl" />
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
                  ))}
                </div>
              </div>
            ) : !post ? (
              <div className="text-center py-20">
                <h1 className="font-display text-3xl font-bold mb-4">This post has been removed.</h1>
                <p className="font-body text-muted-foreground mb-6">
                  The URL you followed is no longer available.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground"
                  >
                    Back to journal
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-body text-sm font-semibold hover:bg-card transition-colors"
                  >
                    About Carnival Glam Hub
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Back link */}
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors mb-10 group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                  </svg>
                  All Posts
                </Link>

                {/* Title */}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-6" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  {post.title}
                </h1>

                {/* Author & meta bar */}
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
                  {post.author_avatar_url && (
                    <img
                      src={post.author_avatar_url}
                      alt={post.author_name ?? "Author"}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10"
                    />
                  )}
                  <div className="font-body text-sm">
                    {post.author_name && (
                      <p className="font-semibold text-foreground leading-tight">{post.author_name}</p>
                    )}
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {post.published_date && <span>{post.published_date}</span>}
                      {post.read_time && <span> · {post.read_time}</span>}
                    </p>
                  </div>
                </div>

                {/* Hero image */}
                {post.image_url && (
                  <div className="mb-10 -mx-4 sm:mx-0">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full rounded-none sm:rounded-2xl object-cover object-top max-h-[28rem]"
                    />
                  </div>
                )}

                {/* Content */}
                {post.content ? (
                  <div className="prose prose-base max-w-none dark:prose-invert
                    prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
                    [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:!mt-16 [&_h2]:!mb-6
                    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:!mt-12 [&_h3]:!mb-4
                    prose-p:font-body prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:mb-6
                    [&_a]:text-[#1d4ed8] [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-[#1d4ed8]/40 hover:[&_a]:decoration-[#1d4ed8] [&_a]:font-medium
                    prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:font-body
                    [&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:max-w-full [&_img]:object-contain [&_img]:rounded-2xl [&_img]:mx-auto [&_img]:my-10
                    [&_p:has(>img)]:my-10 [&_p:has(>img)]:py-1
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:font-body prose-li:text-foreground/80 prose-li:leading-[1.8]
                    prose-ul:my-6 prose-ol:my-6
                    prose-hr:border-border prose-hr:my-10
                  ">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, href, children, ...props }) => {
                          const rewritten = rewriteHref(href);
                          // Drop anchors to dead internal placeholder domains
                          // (solution.mini / happen.mini) — render children only.
                          if (isDeadLinkHref(rewritten)) {
                            return <>{children}</>;
                          }
                          const finalHref = rewritten;
                          let isAmazon = false;
                          let isGoogleReview = false;
                          try {
                            if (finalHref) {
                              const h = new URL(finalHref).hostname.toLowerCase();
                              isAmazon = /(^|\.)amazon\.[a-z.]+$/.test(h);
                              isGoogleReview = h === "g.page" || h.endsWith(".g.page");
                            }
                          } catch {}
                          // If the anchor's only child is an image with no
                          // text, derive an aria-label from the image alt or
                          // destination host so it isn't flagged as "no anchor
                          // text" by SEO audits.
                          let derivedAriaLabel: string | undefined;
                          const kids = (node?.children ?? []) as any[];
                          const nonWs = kids.filter(
                            (c) => !(c.type === "text" && /^\s*$/.test(c.value ?? "")),
                          );
                          const hasText = nonWs.some(
                            (c) =>
                              c.type === "text" && ((c.value ?? "").toString().trim().length > 0),
                          );
                          const onlyImage =
                            !hasText &&
                            nonWs.length === 1 &&
                            nonWs[0].type === "element" &&
                            nonWs[0].tagName === "img";
                          if (onlyImage) {
                            const alt = (nonWs[0].properties?.alt ?? "").toString().trim();
                            derivedAriaLabel =
                              alt || labelForHost(finalHref ?? "") || undefined;
                          }
                          if (isGoogleReview) {
                            return (
                              <a
                                href={finalHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="!no-underline inline-flex items-center gap-2 rounded-full bg-[#1a73e8] hover:bg-[#1765c9] !text-white px-5 py-2.5 font-semibold shadow-sm transition-colors"
                                aria-label={derivedAriaLabel}
                                {...props}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fill="#fff" d="M12 2l2.39 7.36H22l-6.19 4.5L18.2 21 12 16.5 5.8 21l2.39-7.14L2 9.36h7.61L12 2z"/>
                                </svg>
                                {children}
                              </a>
                            );
                          }
                          if (isAmazon) {
                            return (
                              <a
                                href={finalHref}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="!text-[#FF9900] !decoration-[#FF9900] font-bold underline underline-offset-2"
                                aria-label={derivedAriaLabel}
                                {...props}
                              >
                                {children}
                              </a>
                            );
                          }
                          return (
                            <a href={finalHref} aria-label={derivedAriaLabel} {...props}>
                              {children}
                            </a>
                          );
                        },
                        p: ({ node, children, ...props }) => {
                          // If the paragraph has a single anchor child that
                          // is a standalone YouTube URL, replace with embed.
                          const kids = (node?.children ?? []).filter(
                            (c: any) => !(c.type === "text" && /^\s*$/.test(c.value ?? "")),
                          );
                          // Promo marker: a paragraph that is exactly [[PROMO_BOOKING]]
                          if (
                            kids.length === 1 &&
                            kids[0].type === "text" &&
                            typeof (kids[0] as any).value === "string" &&
                            (kids[0] as any).value.trim() === "[[PROMO_BOOKING]]"
                          ) {
                            return <PromoBookingCard />;
                          }
                          if (kids.length === 1 && kids[0].type === "element" && (kids[0] as any).tagName === "a") {
                            const href = ((kids[0] as any).properties?.href ?? "") as string;
                            const text = ((kids[0] as any).children?.[0]?.value ?? "") as string;
                            // Treat as standalone only when link text equals the URL (autolink).
                            if (href && text && href === text) {
                              const yt = parseYouTube(href);
                              if (yt) return <YouTubeEmbed id={yt.id} kind={yt.kind} />;
                            }
                            // Standalone booking link → render as prominent CTA button.
                            try {
                              const u = new URL(href);
                              if (u.hostname.endsWith("carnivalglamhub.masos.app")) {
                                return (
                                  <p className="my-8 flex justify-center">
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary/90 no-underline"
                                    >
                                      {text || "Book Now"}
                                    </a>
                                  </p>
                                );
                              }
                              if (u.hostname === "wa.me" || u.hostname.endsWith(".wa.me")) {
                                return (
                                  <p className="my-8 flex justify-center">
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold !text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#1ebe5b] no-underline"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M20.52 3.48A11.94 11.94 0 0012.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62a11.96 11.96 0 005.82 1.49h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.21-3.49-8.41zM12.03 21.3h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.68.96.98-3.59-.22-.37a9.32 9.32 0 01-1.42-4.92c0-5.15 4.19-9.34 9.35-9.34 2.5 0 4.85.97 6.62 2.74a9.29 9.29 0 012.74 6.62c0 5.16-4.19 9.4-9.28 9.4zm5.36-6.99c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.42s1.04 2.8 1.19 2.99c.15.2 2.06 3.15 5 4.42.7.3 1.25.48 1.68.62.71.23 1.35.19 1.86.12.57-.08 1.74-.71 1.98-1.4.24-.68.24-1.27.17-1.4-.07-.12-.27-.19-.56-.34z"/>
                                      </svg>
                                      {text || "WhatsApp Us"}
                                    </a>
                                  </p>
                                );
                              }
                            } catch {}
                          }
                          return <p {...props}>{children}</p>;
                        },
                      }}
                    >
                      {(() => {
                        const base = sanitizeLinksInMarkdown(cleanMarkdown(post.content));
                        const slugCleaner = slug ? slugContentCleaners[slug] : undefined;
                        return slugCleaner ? slugCleaner(base) : base;
                      })()}
                    </ReactMarkdown>
                  </div>
                ) : post.excerpt ? (
                  <p className="font-body text-foreground/80 text-lg leading-[1.8]">
                    {post.excerpt}
                  </p>
                ) : null}

                {/* Related guides — internal linking for SEO */}
                {slug && (
                  <RelatedGuides
                    currentSlug={slug}
                    currentTags={
                      slug && RECOVERED_POST_BY_SLUG[slug]
                        ? RECOVERED_POST_BY_SLUG[slug].tags
                        : []
                    }
                    currentCategory={
                      slug && RECOVERED_POST_BY_SLUG[slug]
                        ? RECOVERED_POST_BY_SLUG[slug].category
                        : null
                    }
                  />
                )}

                {/* Related service + destination links — push readers to money pages */}
                {slug && (() => {
                  const s = slug.toLowerCase();
                  const service = /hair|hairstyle|ponytail|braid|wig/.test(s)
                    ? { to: "/services/carnival-hair", label: "Carnival hair and hairstyles" }
                    : /photo|shoot/.test(s)
                    ? { to: "/services/carnival-photoshoot", label: "Carnival photoshoot" }
                    : /shoe|getting-dressed|costume/.test(s)
                    ? { to: "/services/getting-dressed", label: "Costume getting-dressed help" }
                    : /shuttle|transport/.test(s)
                    ? { to: "/services/carnival-shuttle", label: "Carnival shuttle service" }
                    : { to: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" };
                  const dest = /trinidad/.test(s)
                    ? { to: "/trinidad", label: "Trinidad Carnival" }
                    : /jamaica/.test(s)
                    ? { to: "/jamaica", label: "Jamaica Carnival" }
                    : /grenada|spicemas|jab/.test(s)
                    ? { to: "/grenada", label: "Grenada Spicemas" }
                    : /barbados|crop[- ]?over/.test(s)
                    ? { to: "/barbados", label: "Barbados Crop Over" }
                    : /saint[- ]?lucia|st[- ]?lucia/.test(s)
                    ? { to: "/saint-lucia", label: "Saint Lucia Carnival" }
                    : /miami/.test(s)
                    ? { to: "/miami", label: "Miami Carnival" }
                    : /toronto|caribana/.test(s)
                    ? { to: "/toronto", label: "Toronto Caribana" }
                    : /antigua/.test(s)
                    ? { to: "/antigua", label: "Antigua Carnival" }
                    : { to: "/trinidad", label: "Trinidad Carnival" };
                  return (
                    <RelatedLinks services={[service]} destinations={[dest]} guides={[]} />
                  );
                })()}

                {/* Conversion CTA — pushes to MasOS booking page */}
                <BlogCTA
                  slug={slug}
                  tags={
                    slug && RECOVERED_POST_BY_SLUG[slug]
                      ? RECOVERED_POST_BY_SLUG[slug].tags
                      : []
                  }
                  category={
                    slug && RECOVERED_POST_BY_SLUG[slug]
                      ? RECOVERED_POST_BY_SLUG[slug].category
                      : null
                  }
                />

                {/* Bottom CTA */}
                <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                    </svg>
                    More Posts
                  </Link>
                </div>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default BlogPost;
