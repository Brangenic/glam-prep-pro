---
name: Supercharged Autopilot Content Engine
description: Daily automated pipeline with competitor intelligence, user-provided pool images, FAQ schema, internal linking, content ideas, and dynamic sitemap
type: feature
---

## Pipeline (daily 6AM UTC via pg_cron)

1. **Expanded trending search** — Firecrawl searches carnival lifestyle topics (makeup, costumes, fetes, travel, body paint) not just makeup
2. **Competitor intelligence** — scrapes top-ranking competitor articles for the same keywords, feeds them to AI to outperform
3. **Duplicate prevention** — queries existing blog_posts titles/slugs before generation, tells AI to find NEW topics
4. **SEO blog generation** — 1000-1500 word articles with 4+ H2s, competitor-aware content, 2-3 internal links to other posts
5. **FAQ schema** — each blog includes FAQ section + JSON-LD FAQPage schema embedded as HTML comment for BlogPost.tsx to extract
6. **User-provided hero images only** — selects the least-used photo from the curated `blog-images/pool` bucket and fails loudly if no pool photos exist
7. **Content ideas** (not full posts) — generates hooks, angles, talking points, hashtags for social content inspiration
8. **Sitemap regeneration** — triggers `generate-sitemap` edge function after each run

## Key Files
- `supabase/functions/autopilot-content/index.ts` — main orchestrator
- `supabase/functions/generate-sitemap/index.ts` — dynamic XML sitemap from blog_posts
- `src/components/admin/AutopilotTab.tsx` — admin dashboard with stats (images, links, ideas)
- `src/pages/BlogPost.tsx` — extracts FAQ_SCHEMA_JSON from content, injects as ld+json

## Database
- `blog_posts.source` = `'ai_generated'` for autopilot posts
- `blog_posts.image_url` set only from the user-provided `blog-images/pool` storage path
- `generated_content.content_type` = `'content_idea'` for ideas (body is JSON with hook, talking_points, etc.)
- `site_config.sitemap_xml` stores generated sitemap
- Storage bucket: `blog-images` (public read)
