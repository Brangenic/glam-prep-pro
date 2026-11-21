// Row builder for AI-written blog posts. Import-free so vitest can test it.
// AI posts are never public on insert: they wait as drafts until an admin
// presses Publish in the Admin Autopilot tab.

export type AiBlogDraftInput = {
  externalId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  metaDescription: string | null;
  imageUrl: string;
};

export function aiBlogDraftRow(p: AiBlogDraftInput) {
  return {
    external_id: p.externalId,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    meta_description: p.metaDescription,
    image_url: p.imageUrl,
    post_url: `https://www.carnivalglamhub.com/blogs/${p.slug}`,
    source: "ai_generated",
    author_name: "Carnival Glam Hub",
    // No publication date until an admin publishes it.
    published_date: null,
    status: "draft" as const,
  };
}
