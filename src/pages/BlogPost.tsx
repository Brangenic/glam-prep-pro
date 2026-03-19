import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { supabase } from "@/integrations/supabase/client";

type BlogPostData = {
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  published_date: string | null;
  read_time: string | null;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, content, excerpt, image_url, author_name, author_avatar_url, published_date, read_time")
        .eq("slug", slug)
        .maybeSingle();

      if (isMounted) {
        setPost(data as BlogPostData | null);
        setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [slug]);

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Carnival Glam Hub Blog`;
    }
    return () => { document.title = "Carnival Glam Hub"; };
  }, [post?.title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <article className="py-10 sm:py-14 lg:py-18">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-64 bg-muted rounded-2xl" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded" />
                  ))}
                </div>
              </div>
            ) : !post ? (
              <div className="text-center py-20">
                <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
                <p className="font-body text-muted-foreground mb-6">
                  This blog post doesn't exist or may have been removed.
                </p>
                <Link
                  to="/blogs"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground"
                >
                  Back to Blog
                </Link>
              </div>
            ) : (
              <>
                {/* Back link */}
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-5">
                  {post.author_avatar_url && (
                    <img
                      src={post.author_avatar_url}
                      alt={post.author_name ?? "Author"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="font-body text-sm text-muted-foreground">
                    {post.author_name && (
                      <span className="font-medium text-foreground">{post.author_name}</span>
                    )}
                    {post.published_date && <span> · {post.published_date}</span>}
                    {post.read_time && <span> · {post.read_time}</span>}
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                  {post.title}
                </h1>

                {/* Content */}
                {post.content ? (
                  <div className="prose prose-lg max-w-none dark:prose-invert
                    prose-headings:font-display prose-headings:text-foreground
                    prose-p:font-body prose-p:text-foreground/85 prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-img:rounded-2xl prose-img:mx-auto
                    prose-strong:text-foreground
                    prose-li:font-body prose-li:text-foreground/85
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>
                ) : post.excerpt ? (
                  <p className="font-body text-foreground/85 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                ) : null}

                {/* Bottom CTA */}
                <div className="mt-12 pt-8 border-t border-border text-center">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    ← More Posts
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
