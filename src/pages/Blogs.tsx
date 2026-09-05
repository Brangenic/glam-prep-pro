import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BOOKING_URL } from "@/lib/constants";
import Fuse from "fuse.js";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";
import airliftHero from "@/assets/blog-airlift-hero.webp";
import worthItHero from "@/assets/blog-carnival-makeup-worth-it-hero-v2.webp";
import bookEarlyHero from "@/assets/blog-book-early-hero.webp";
import { RECOVERED_POSTS_META } from "@/data/recoveredPostsMeta";

type BlogPost = {
  external_id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string | null;
  post_url: string;
  author_name: string | null;
  author_avatar_url: string | null;
  published_date: string | null;
  read_time: string | null;
};

const PAGE_TITLE =
  "Carnival Beauty and Travel Journal | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Guides, tips and stories on Carnival makeup, hair, costumes and travel for masqueraders across the Caribbean and the diaspora. Read the journal.";
const CANONICAL = "https://www.carnivalglamhub.com/blogs";

const EXCLUDED_SLUG_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /^crop-over-/i,
  /^chatgpt-/i,
  /gpt/i,
  /^ai-/i,
  /^artificial-/i,
];

// Slugs that bypass the exclusion patterns and the EXCLUDED_AUTHORS filter.
// Used for legacy Wix posts we have intentionally restored.
const ALLOWED_OVERRIDE_SLUGS = new Set<string>(
  RECOVERED_POSTS_META.map((p) => p.slug),
);

const isExcludedSlug = (slug: string | null | undefined) => {
  if (!slug) return false;
  // Withdrawn posts never appear in the index, whatever else they match.
  if (isRemovedPostSlug(slug)) return true;
  if (slug && ALLOWED_OVERRIDE_SLUGS.has(slug)) return false;
  return EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug));
};

const getSlugFromPostUrl = (postUrl: string) => {
  const match = postUrl.match(/\/post\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const TODAY_ISO = new Date().toISOString().slice(0, 10);

const MANUAL_POSTS: BlogPost[] = [
  {
    external_id: "manual-is-professional-carnival-makeup-worth-it",
    title: "Is Professional Carnival Makeup Worth It?",
    excerpt:
      "Makeup only runs US$170 to US$200 for a single day. Here is what you are really paying for, and whether it is worth it once Carnival is over.",
    image_url: worthItHero,
    slug: "is-professional-carnival-makeup-worth-it",
    post_url: "/blogs/is-professional-carnival-makeup-worth-it",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: TODAY_ISO,
    read_time: "6 min read",
  },
  {
    external_id: "manual-how-far-in-advance-to-book-carnival-makeup",
    title: "How Far In Advance Should I Book My Carnival Makeup Artist?",
    excerpt:
      "When to book your Carnival makeup artist, why the 4am to 8am slots go first, and how to lock in a smooth Carnival morning. A Glam Hub guide.",
    image_url: bookEarlyHero,
    slug: "how-far-in-advance-to-book-carnival-makeup",
    post_url: "/blogs/how-far-in-advance-to-book-carnival-makeup",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: TODAY_ISO,
    read_time: "5 min read",
  },
  {
    external_id: "manual-caribbean-carnival-has-an-airlift-problem",
    title:
      "The Caribbean Carnival economy doesn't have a demand problem. It has an airlift problem.",
    excerpt:
      "Masqueraders are ready to spend, but flights into the region are the bottleneck. An editorial on Carnival's airlift problem.",
    image_url: airliftHero,
    slug: "caribbean-carnival-has-an-airlift-problem",
    post_url: "/blogs/caribbean-carnival-has-an-airlift-problem",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: "2026-05-29",
    read_time: "7 min read",
  },
  ...RECOVERED_POSTS_META.map((p) => ({
    external_id: `manual-${p.slug}`,
    title: p.title,
    excerpt: p.excerpt,
    image_url: p.coverImage,
    slug: p.slug,
    post_url: `/blogs/${p.slug}`,
    author_name: p.author,
    author_avatar_url: null,
    published_date: p.publishedDate,
    read_time: p.readTime,
  })),
];

const FEATURED_SLUG = "trinidad-carnival-2027-first-time-masquerader-guide";
const MANUAL_GRID_ORDER: string[] = [
  "is-professional-carnival-makeup-worth-it",
  "how-far-in-advance-to-book-carnival-makeup",
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
  "youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing",
  "caribbean-carnival-has-an-airlift-problem",
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua",
  "what-is-jouvert-and-why-should-you-do-it-at-least-once",
  "what-people-say-about-carnival-glam-hub",
  "jab-jab-grenada-2026-guide",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
  "should-the-makeup-match-your-costume",
  "genx-miami-carnival-2024-costumes",
];

const resolveSlug = (post: BlogPost) =>
  post.slug || getSlugFromPostUrl(post.post_url) || post.external_id;

// Synonym groups for meaning-aware search. A query that matches any
// term in a group expands to include every other term in the group, so
// "jab jab" also finds "jouvert", "makeup" also finds "glam", etc.
const SYNONYM_GROUPS: string[][] = [
  ["jouvert", "j'ouvert", "jab jab", "jab", "oil", "paint", "mud"],
  ["makeup", "glam", "beauty", "mua", "face", "lashes"],
  ["hair", "braids", "wig", "cornrows", "silk press", "ponytail", "hairstyle"],
  ["shoes", "footwear", "boots", "heels", "sneakers"],
  ["costume", "mas", "band", "wire bra"],
  ["trinidad", "tt", "trini", "port of spain"],
  ["tobago"],
  ["grenada", "spicemas"],
  ["st lucia", "saint lucia"],
  ["barbados", "crop over", "bim"],
  ["antigua"],
  ["miami", "miami carnival"],
  ["toronto", "caribana"],
  ["jamaica"],
  ["guyana"],
];

const expandQuery = (q: string): string => {
  const lower = q.toLowerCase();
  const extras = new Set<string>();
  for (const group of SYNONYM_GROUPS) {
    if (group.some((term) => lower.includes(term))) {
      group.forEach((t) => extras.add(t));
    }
  }
  if (extras.size === 0) return q;
  return `${q} ${Array.from(extras).join(" ")}`;
};

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // Search state is mirrored to the URL ?q= param so the WebSite
  // SearchAction in JSON-LD is a real, shareable target.
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQueryState] = useState(() => searchParams.get("q") ?? "");
  const setQuery = (next: string) => {
    setQueryState(next);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next.trim()) params.set("q", next);
        else params.delete("q");
        return params;
      },
      { replace: true },
    );
  };
  const PAGE_SIZE = 24;

  const EXCLUDED_AUTHORS = [
    "Krystal Angelique",
    "Melissa Chung",
    "Shadge Henry",
    "Marissa Williams",
    "Tamika Campbell",
    "Mala Morrison",
    "Antoinette Dixon",
    "Jade Amiel",
    "Shadae Henry",
    "Snowwhite Hogie",
    "Daydrie Burke",
  ];

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      supabase.functions.invoke("sync-public-content", {
        body: { source: "blog_posts" },
      });

      const { data } = await supabase
        .from("blog_posts")
        .select("external_id, title, excerpt, image_url, slug, post_url, author_name, author_avatar_url, published_date, read_time")
        .order("synced_at", { ascending: false });

      if (isMounted) {
        const filtered = ((data as BlogPost[]) ?? []).filter(
          (p) =>
            (
              (p.slug && ALLOWED_OVERRIDE_SLUGS.has(p.slug)) ||
              !p.author_name ||
              !EXCLUDED_AUTHORS.includes(p.author_name.trim())
            ) &&
            !isExcludedSlug(p.slug) &&
            !isExcludedSlug(getSlugFromPostUrl(p.post_url))
        );
        // Merge manual posts, deduping by slug in case the synced source
        // ever picks them up later.
        const existingSlugs = new Set(filtered.map((p) => resolveSlug(p)));
        const manuals = MANUAL_POSTS.filter((p) => !existingSlugs.has(resolveSlug(p)));
        const merged = [...manuals, ...filtered];

        // Parse published_date defensively; unparseable/missing → null so those
        // posts can never win the "Latest Post" hero slot.
        const parseDate = (v: string | null | undefined): number | null => {
          if (!v) return null;
          const t = Date.parse(v);
          return Number.isFinite(t) ? t : null;
        };

        // Find the newest post across the merged set (DB + manual). This slug
        // is always pinned to the hero regardless of the curated grid order,
        // so any future post with a newer date automatically takes the slot.
        let newestSlug: string | null = null;
        let newestTime = -Infinity;
        for (const p of merged) {
          const t = parseDate(p.published_date);
          if (t !== null && t > newestTime) {
            newestTime = t;
            newestSlug = resolveSlug(p);
          }
        }

        // Display order: newest post first (hero), then the old FEATURED_SLUG,
        // then MANUAL_GRID_ORDER, then everything else by published_date desc.
        // The hero post is excluded from later buckets so it never repeats.
        const orderIndex = (slug: string) => {
          if (newestSlug && slug === newestSlug) return -2;
          if (slug === FEATURED_SLUG) return -1;
          const i = MANUAL_GRID_ORDER.indexOf(slug);
          return i === -1 ? Number.POSITIVE_INFINITY : i;
        };
        const sorted = [...merged].sort((a, b) => {
          const ai = orderIndex(resolveSlug(a));
          const bi = orderIndex(resolveSlug(b));
          if (ai !== bi) return ai - bi;
          const ad = parseDate(a.published_date) ?? 0;
          const bd = parseDate(b.published_date) ?? 0;
          return bd - ad;
        });
        setPosts(sorted);
        setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (prev === null) tag?.remove();
        else tag?.setAttribute("content", prev);
      };
    };

    const restorers: Array<() => void> = [];
    restorers.push(setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE));
    restorers.push(setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", CANONICAL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "website"));

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (previousCanonical !== null) canonical?.setAttribute("href", previousCanonical);
      else canonical?.remove();
    };
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "excerpt", weight: 0.3 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [posts],
  );

  const trimmedQuery = query.trim();
  const filteredPosts = useMemo(() => {
    if (!trimmedQuery) return posts;
    const expanded = expandQuery(trimmedQuery);
    return fuse.search(expanded).map((r) => r.item);
  }, [trimmedQuery, fuse, posts]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);
  const usePagination = !trimmedQuery && filteredPosts.length > PAGE_SIZE;
  const totalPages = usePagination ? Math.ceil(rest.length / (PAGE_SIZE - 1)) : 1;
  const pageItems = usePagination
    ? rest.slice((page - 1) * (PAGE_SIZE - 1), page * (PAGE_SIZE - 1))
    : rest;

  const getPostLink = (post: BlogPost) => {
    const resolvedSlug = post.slug || getSlugFromPostUrl(post.post_url) || post.external_id;
    return `/blogs/${encodeURIComponent(resolvedSlug)}`;
  };

  const truncate = (s: string, n: number) =>
    s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Carnival Glam Hub Journal",
    url: CANONICAL,
    description: PAGE_DESCRIPTION,
    blogPost: posts.slice(0, 25).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://www.carnivalglamhub.com${getPostLink(p)}`,
      datePublished: p.published_date ?? undefined,
      image: p.image_url ?? undefined,
      author: p.author_name ? { "@type": "Person", name: p.author_name } : undefined,
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
              { "@type": "ListItem", position: 2, name: "Journal", item: CANONICAL },
            ],
          }),
        }}
      />
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="section-y" aria-labelledby="blog-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <header className="mb-10 sm:mb-14">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                Carnival Glam Hub Journal
              </p>
              <h1
                id="blog-page-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              >
                The Carnival Glam Hub{" "}
                <span className="italic text-gradient-primary">journal</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                <Link to="/about" className="text-primary hover:underline">Carnival Glam Hub</Link>'s editorial notes on Carnival mornings, beauty, hair, costume care and travel. Read by masqueraders preparing for Carnival across Trinidad, Jamaica, Barbados, Grenada and Antigua.
              </p>
            </header>

            {/* Smart search */}
            <div className="mb-8 sm:mb-10">
              <label htmlFor="blog-search" className="sr-only">
                Search the journal
              </label>
              <input
                id="blog-search"
                type="search"
                name="q"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search the journal, try ‘jouvert’, ‘makeup’, ‘Trinidad’…"
                className="w-full max-w-2xl rounded-full border border-border bg-card px-5 py-3 font-body text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card animate-pulse">
                    <div className="aspect-[16/9] bg-muted rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="font-body text-base sm:text-lg text-muted-foreground mb-6">
                  We are rebuilding the journal. New editorial notes coming soon.
                </p>
                <Link
                  to="/about"
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  About Carnival Glam Hub
                </Link>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="font-body text-base sm:text-lg text-foreground mb-2">
                  No journal posts match “{trimmedQuery}”.
                </p>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  Try a broader word, like ‘makeup’, ‘jouvert’ or a Carnival name.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {/* Featured post */}
                {featured && (
                  <PostCardLink
                    href={getPostLink(featured)}
                    className="block rounded-3xl border border-border bg-card overflow-hidden mb-10 sm:mb-14 group hover:shadow-lg hover:shadow-primary/10 transition-all"
                  >
                    <div className="grid md:grid-cols-2">
                      {featured.image_url ? (
                        <img
                          src={featured.image_url}
                          alt={featured.title}
                          className="w-full h-64 md:h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="eager"
                        />
                      ) : (
                        <div className="w-full h-64 md:h-full bg-muted" />
                      )}
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        <span className="inline-block font-body text-xs uppercase tracking-[0.15em] text-secondary font-medium mb-3">
                          Latest Post
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {truncate(featured.excerpt, 160)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-auto">
                          {featured.author_avatar_url && (
                            <img
                              src={featured.author_avatar_url}
                              alt={featured.author_name ?? "Author"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div className="font-body text-xs text-muted-foreground">
                            {featured.author_name && <span className="font-medium text-foreground">{featured.author_name}</span>}
                            {featured.published_date && <span> · {featured.published_date}</span>}
                            {featured.read_time && <span> · {featured.read_time}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PostCardLink>
                )}

                {/* Post grid */}
                {pageItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pageItems.map((post) => (
                      <PostCardLink
                        key={post.external_id}
                        href={getPostLink(post)}
                        className="rounded-2xl border border-border bg-card overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all"
                      >
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full aspect-[16/9] bg-muted" />
                        )}
                        <div className="p-5">
                          <h2 className="font-display text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-3">
                              {truncate(post.excerpt, 160)}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {post.author_avatar_url && (
                              <img
                                src={post.author_avatar_url}
                                alt={post.author_name ?? "Author"}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <div className="font-body text-xs text-muted-foreground">
                              {post.author_name && <span className="font-medium text-foreground">{post.author_name}</span>}
                              {post.published_date && <span> · {post.published_date}</span>}
                              {post.read_time && <span> · {post.read_time}</span>}
                            </div>
                          </div>
                        </div>
                      </PostCardLink>
                    ))}
                  </div>
                )}

                {usePagination && totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-full border border-border font-body text-sm disabled:opacity-40 hover:bg-card transition-colors"
                    >
                      Previous
                    </button>
                    <span className="font-body text-sm text-muted-foreground px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-full border border-border font-body text-sm disabled:opacity-40 hover:bg-card transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl pb-16 sm:pb-24">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to book your{" "}
              <span className="italic text-gradient-primary">Carnival morning?</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Spaces sell out months before Carnival.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

const PostCardLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

export default Blogs;
