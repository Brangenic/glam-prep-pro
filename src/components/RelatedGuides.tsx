import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RECOVERED_POSTS_META } from "@/data/recoveredPostsMeta";

type Candidate = {
  slug: string;
  title: string;
  tags: string[];
  category: string | null;
  publishedDate: string | null;
};

const EXCLUDED_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /^crop-over-/i,
  /^chatgpt-/i,
  /gpt/i,
  /^ai-/i,
  /^artificial-/i,
];
const ALLOWED_OVERRIDE = new Set(RECOVERED_POSTS_META.map((p) => p.slug));
const isExcluded = (slug: string) => {
  if (ALLOWED_OVERRIDE.has(slug)) return false;
  return EXCLUDED_PATTERNS.some((re) => re.test(slug));
};

const RelatedGuides = ({
  currentSlug,
  currentTags = [],
  currentCategory = null,
}: {
  currentSlug: string;
  currentTags?: string[];
  currentCategory?: string | null;
}) => {
  const [related, setRelated] = useState<Candidate[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const recovered: Candidate[] = RECOVERED_POSTS_META.map((p) => ({
        slug: p.slug,
        title: p.title,
        tags: p.tags ?? [],
        category: p.category ?? null,
        publishedDate: p.publishedDate ?? null,
      }));

      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, published_date, post_url")
        .order("published_date", { ascending: false })
        .limit(40);

      const dbCandidates: Candidate[] = (data ?? [])
        .map((row) => {
          const slug =
            row.slug ??
            (row.post_url?.match(/\/post\/([^/?#]+)/i)?.[1]
              ? decodeURIComponent(row.post_url.match(/\/post\/([^/?#]+)/i)![1])
              : null);
          if (!slug) return null;
          return {
            slug,
            title: row.title,
            tags: [],
            category: null,
            publishedDate: row.published_date,
          } as Candidate;
        })
        .filter((x): x is Candidate => Boolean(x));

      const merged = new Map<string, Candidate>();
      [...recovered, ...dbCandidates].forEach((c) => {
        if (c.slug === currentSlug) return;
        if (isExcluded(c.slug)) return;
        if (!merged.has(c.slug)) merged.set(c.slug, c);
      });

      const tagSet = new Set(currentTags.map((t) => t.toLowerCase()));
      const cat = currentCategory?.toLowerCase() ?? null;
      const scored = Array.from(merged.values()).map((c) => {
        let score = 0;
        c.tags.forEach((t) => {
          if (tagSet.has(t.toLowerCase())) score += 2;
        });
        if (cat && c.category && c.category.toLowerCase() === cat) score += 3;
        return { c, score };
      });

      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const ad = a.c.publishedDate ?? "";
        const bd = b.c.publishedDate ?? "";
        return bd.localeCompare(ad);
      });

      const picked = scored.slice(0, 4).map((s) => s.c);
      if (!cancelled) setRelated(picked);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentSlug, currentTags.join("|"), currentCategory]);

  if (related.length === 0) return null;

  return (
    <aside className="mt-16 pt-10 border-t border-border">
      <h2 className="font-display text-xl sm:text-2xl font-bold mb-5">
        Related guides
      </h2>
      <ul className="space-y-3">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/blogs/${p.slug}`}
              className="font-body text-base text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RelatedGuides;