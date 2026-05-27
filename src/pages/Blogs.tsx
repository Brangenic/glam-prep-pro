import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";

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
  "Carnival Glam Hub Journal | Carnival Beauty, Hair and Travel Notes";
const PAGE_DESCRIPTION =
  "Editorial notes from Carnival Glam Hub on Carnival beauty, hair, costume care and travel.";
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

const isExcludedSlug = (slug: string | null | undefined) => {
  if (!slug) return false;
  return EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug));
};

const getSlugFromPostUrl = (postUrl: string) => {
  const match = postUrl.match(/\/post\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

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
            (!p.author_name || !EXCLUDED_AUTHORS.includes(p.author_name.trim())) &&
            !isExcludedSlug(p.slug) &&
            !isExcludedSlug(getSlugFromPostUrl(p.post_url))
        );
        setPosts(filtered);
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

  const featured = posts[0];
  const rest = posts.slice(1);
  const usePagination = posts.length > PAGE_SIZE;
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
        <section className="py-14 sm:py-18 lg:py-20" aria-labelledby="blog-page-heading">
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
            <Link
              to="/booking"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Book now
            </Link>
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
