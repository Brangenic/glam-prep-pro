import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { aiBlogDraftRow } from "../../supabase/functions/_shared/aiBlogDraft";

const root = path.resolve(__dirname, "../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

describe("AI autopilot posts are drafts", () => {
  it("the AI row builder always sets status draft and no publication date", () => {
    const row = aiBlogDraftRow({ externalId: "ai-x", title: "T", slug: "t", excerpt: null, content: "c", metaDescription: null, imageUrl: "u" });
    expect(row.status).toBe("draft");
    expect(row.published_date).toBeNull();
    expect(row.source).toBe("ai_generated");
  });

  for (const fn of ["autopilot-content", "autopilot-engine"]) {
    it(`${fn} inserts blog posts only through the draft builder and never pings IndexNow`, () => {
      const src = read(`supabase/functions/${fn}/index.ts`);
      const inserts = src.match(/from\("blog_posts"\)\.insert\(([^\n]*)/g) ?? [];
      expect(inserts.length).toBe(1);
      expect(inserts[0]).toContain("aiBlogDraftRow(");
      expect(src).not.toContain("api.indexnow.org");
      expect(src).not.toContain("INDEXNOW_API_KEY");
      expect(src).not.toContain("functions/v1/generate-sitemap");
    });
  }

  for (const fn of ["autopilot-content", "autopilot-engine", "generate-content"]) {
    it(`${fn} checks authorisation before any paid call`, () => {
      const src = read(`supabase/functions/${fn}/index.ts`);
      const gate = src.indexOf("await requireAdminOrCron(req");
      const handler = src.indexOf("Deno.serve(");
      expect(gate).toBeGreaterThan(handler);
      const after = src.slice(gate);
      const firstPaid = Math.min(...["searchTrending(", "gatherSourceData(", "generateArticle(", "generateBlogArticle("]
        .map((n) => after.indexOf(n)).filter((i) => i >= 0));
      expect(firstPaid).toBeGreaterThan(0);
    });
  }
});

describe("public blog queries only read published posts", () => {
  const files = [
    "src/pages/Blogs.tsx",
    "src/pages/BlogPost.tsx",
    "src/components/RelatedGuides.tsx",
    "scripts/prerender-bodies.ts",
    "scripts/prerender-blog-meta.ts",
    "scripts/generate-sitemap.ts",
    "scripts/generate-news-sitemap.ts",
    "supabase/functions/generate-sitemap/index.ts",
    "supabase/functions/blog-post-gate/index.ts",
  ];
  for (const f of files) {
    it(`${f} filters status published on every blog_posts read`, () => {
      const src = read(f);
      const reads = src.split('.from("blog_posts")').slice(1);
      expect(reads.length).toBeGreaterThan(0);
      for (const chunk of reads) {
        const query = chunk.slice(0, chunk.indexOf(";"));
        if (!query.trimStart().startsWith(".select(")) continue; // writes are not reads
        expect(query).toContain('.eq("status", "published")');
      }
    });
  }

  it("the public read policy is limited to published posts", () => {
    const dir = path.join(root, "drizzle/migrations");
    const sql = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort().map((f) => readFileSync(path.join(dir, f), "utf8")).join("\n");
    expect(sql).toMatch(/CREATE POLICY "Public can read published blog posts" ON public\.blog_posts\s+FOR SELECT TO public USING \(status = 'published'\)/);
    expect(sql).toMatch(/ADD COLUMN status text NOT NULL DEFAULT 'published'/);
  });
});
