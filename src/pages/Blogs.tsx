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

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
        setPosts((data as BlogPost[]) ?? []);
        setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  const getSlugFromPostUrl = (postUrl: string) => {
    const match = postUrl.match(/\/post\/([^/?#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  };

  const getPostLink = (post: BlogPost) => {
    const resolvedSlug = post.slug || getSlugFromPostUrl(post.post_url) || post.external_id;
    return `/blogs/${encodeURIComponent(resolvedSlug)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="py-14 sm:py-18 lg:py-20" aria-labelledby="blog-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <header className="mb-10 sm:mb-14">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                Carnival Glam Hub Blog
              </p>
              <h1
                id="blog-page-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              >
                Stories, Tips &amp;{" "}
                <span className="italic text-gradient-primary">Carnival Culture</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Stay in the loop with carnival news, glam tips, destination guides, and behind-the-scenes stories from the Carnival Glam Hub team.
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
                <p className="font-body text-muted-foreground">
                  Blog posts are syncing. Check back shortly!
                </p>
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
                            {featured.excerpt}
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
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post) => (
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
                              {post.excerpt}
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
              </>
            )}
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
