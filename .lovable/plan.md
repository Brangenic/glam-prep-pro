

## Plan: Autonomous Content Engine — "Smart Site"

### What It Does

An automated daily pipeline that turns your site into a self-feeding content machine. Every day it:

1. **Searches trending carnival topics** — uses Firecrawl to find what people are searching for right now (e.g. "Trinidad carnival 2026 makeup", "best body paint for jouvert")
2. **Auto-generates SEO blog articles** — writes full 800-1200 word blog posts targeting those trending searches, published directly to your `/blogs` page
3. **Auto-generates social posts** — creates Instagram, WhatsApp, Facebook, and Twitter content for each territory
4. **Auto-publishes to the site** — blog content goes live automatically (social posts stay as drafts for review)
5. **Tracks performance** — logs what was generated, when, and for which territory

### Architecture

```text
Daily Cron (6 AM) ──► autopilot-content (Edge Function)
                           │
                    ┌──────┼──────┐
                    ▼      ▼      ▼
              Firecrawl  Google   Existing
              Trending   Reviews  Blog Data
                    │      │      │
                    └──────┼──────┘
                           ▼
                    Lovable AI (gemini-2.5-flash)
                           │
                    ┌──────┼──────┐
                    ▼      ▼      ▼
              SEO Blog   Social   generated_content
              Articles   Posts    (database)
              (auto-     (draft
              published)  status)
```

### Implementation Steps

**1. New Edge Function: `autopilot-content`**
- Runs autonomously (no user input needed)
- For each active territory:
  - Searches Firecrawl for trending carnival + makeup queries
  - Picks the top 2-3 trending topics
  - Generates one full SEO blog article per territory (title, slug, excerpt, full markdown body, meta description)
  - Generates 2 social posts per territory (Instagram + one random channel)
- Blog articles are inserted directly into `blog_posts` table with status "published" — they appear on `/blogs` immediately
- Social posts go into `generated_content` as drafts

**2. Database changes**
- Add `source` column to `blog_posts` (`'wix_sync'` or `'ai_generated'`, default `'wix_sync'`) to distinguish AI-written posts from synced ones
- Add `meta_description` column to `blog_posts` for SEO
- Add `auto_publish` column to `generated_content` (boolean, default false)

**3. Daily cron job via pg_cron**
- Schedule `autopilot-content` to run daily at 6:00 AM UTC
- Uses `pg_cron` + `pg_net` to call the edge function automatically

**4. SEO enhancements for AI blog posts**
- Auto-generated blog posts include: H2 headings, internal links to booking page, territory-specific keywords, CTA at the end
- `BlogPost.tsx` updated to render meta description tag for SEO
- Sitemap generation considers AI-generated posts

**5. Admin visibility**
- New "Autopilot" tab in admin dashboard showing:
  - Last run timestamp and results
  - Toggle to enable/disable autopilot per territory
  - Log of generated content with counts

### What the Daily Output Looks Like

For 10 active territories, each day the site would produce:
- **10 new SEO blog posts** (one per territory, targeting trending searches)
- **20 social media drafts** (2 per territory, ready for review)
- All blog posts live on the site within minutes, indexed by search engines

### Example Generated Blog Post

> **Title**: "5 Jouvert Makeup Looks That Won't Budge in Trinidad Carnival 2026"
> **Slug**: `/blogs/jouvert-makeup-looks-trinidad-2026`
> **Content**: Full 1000-word article with tips, product links, booking CTA
> **Meta**: "Discover the best waterproof jouvert makeup looks for Trinidad Carnival 2026. Book your glam artist with Carnival Glam Hub."

### Files Changed
- **New**: `supabase/functions/autopilot-content/index.ts`
- **New migration**: Add `source`, `meta_description` columns to `blog_posts`; add `auto_publish` to `generated_content`
- **New migration**: pg_cron job scheduling
- **Modified**: `src/pages/Admin.tsx` — add Autopilot tab
- **Modified**: `src/pages/BlogPost.tsx` — render meta description
- **Modified**: `index.html` — dynamic meta tag support

### Important Notes
- Blog posts are generated as original content, not copied from other sites
- Each post targets specific long-tail keywords people are actually searching for
- The AI uses your real reviews, products, and brand voice to stay authentic
- Social posts stay as drafts so you can review before posting externally
- You can disable autopilot for any territory from the admin dashboard

