import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const cleanMarkdown = (md: string): string => {
  return md
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
};
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";
import makeupGuide2026Cover from "@/assets/blog-2026-makeup-guide-cover.webp";
import { RECOVERED_POST_BY_SLUG } from "@/data/recoveredPosts";

// Bundled hero overrides: replace unreliable storage-bucket URLs with
// reliable bundled WebP imports for specific slugs.
const SLUG_HERO_OVERRIDES: Record<string, string> = {
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua": makeupGuide2026Cover,
};

// Per-slug meta title overrides, kept under 60 characters for SEO.
const SLUG_META_TITLE_OVERRIDES: Record<string, string> = {
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua":
    "2026 Carnival Makeup Guide: 50 Looks | Glam Hub",
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
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    const load = async () => {
      const normalizedSlug = decodeURIComponent(slug);
      const selectColumns = "title, content, excerpt, image_url, author_name, author_avatar_url, published_date, read_time, meta_description";

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
      document.title = override ?? `${post.title} | Carnival Glam Hub Blog`;
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
        image: post.image_url ? [post.image_url] : undefined,
        datePublished: post.published_date ?? undefined,
        dateModified: post.published_date ?? undefined,
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
                      className="w-full rounded-none sm:rounded-2xl object-cover max-h-[28rem]"
                    />
                  </div>
                )}

                {/* Content */}
                {post.content ? (
                  <div className="prose prose-base max-w-none dark:prose-invert
                    prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
                    prose-h2:text-2xl [&_h2]:!mt-14 [&_h2]:!mb-5
                    prose-h3:text-xl [&_h3]:!mt-10 [&_h3]:!mb-4
                    prose-p:font-body prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:mb-6
                    prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-a:decoration-primary/30 hover:prose-a:decoration-primary
                    prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:font-body
                    prose-img:rounded-2xl prose-img:mx-auto prose-img:my-8
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:font-body prose-li:text-foreground/80 prose-li:leading-[1.8]
                    prose-ul:my-6 prose-ol:my-6
                    prose-hr:border-border prose-hr:my-10
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {(() => {
                        const base = cleanMarkdown(post.content);
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
