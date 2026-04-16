

## Plan: Supercharged Autopilot Engine

### Current State
The autopilot generates 10 blog posts + 20 social drafts daily. Social posts aren't needed — just **social post ideas**. Now we make it truly powerful.

### What We're Adding

**1. Competitor Intelligence Scraping**
Before writing each blog, the engine scrapes top-ranking competitor articles for the same keywords. It analyzes what's ranking, what's missing, and generates content that fills the gaps — not copying, but **outperforming** existing content.

**2. Duplicate Topic Prevention**
Before generating a new blog, the engine checks existing `blog_posts` titles and slugs to avoid writing about the same topic twice. It tells the AI "these topics are already covered — find something NEW."

**3. Internal Linking Web**
Each new blog post gets 2-3 links to existing blog posts on the site (not just the booking page). This builds a powerful internal link network that search engines love. The engine fetches recent post slugs and titles and instructs the AI to weave them in naturally.

**4. AI-Generated Featured Images**
Each blog post gets a unique AI-generated carnival-themed hero image using the Lovable AI image generation model. Stored in a storage bucket and linked to the post.

**5. FAQ Schema Generation**
Each blog post gets a JSON-LD FAQ schema block embedded in the content. This makes posts eligible for Google's "People Also Ask" rich results — massive visibility boost.

**6. Auto-Sitemap Regeneration**
After each autopilot run, the engine regenerates `/sitemap.xml` dynamically from all blog posts in the database, so Google discovers new content immediately.

**7. Social Post Ideas (not full posts)**
Instead of full social posts, generate **content ideas** with hooks, angles, and suggested hashtags — formatted as inspiration for the admin to adapt.

**8. Smarter Trending Search**
Expand search queries to include competitor brand names, seasonal events, and "people also ask" style queries. Use broader carnival lifestyle topics (fashion, travel, fetes, costumes) not just makeup.

### Architecture Update

```text
Daily Cron (6 AM) ──► autopilot-content (Enhanced)
                           │
                    ┌──────┼──────────┐
                    ▼      ▼          ▼
              Firecrawl  Competitor   Existing
              Trending   Analysis     Blog Data
                    │      │          │
                    └──────┼──────────┘
                           ▼
                    Lovable AI (gemini-2.5-flash)
                           │
                    ┌──────┼──────┬──────────┐
                    ▼      ▼      ▼          ▼
              SEO Blog   Images  Social     Sitemap
              + FAQ      (AI)    Ideas      Regen
              + Links
```

### Implementation Steps

**Step 1: Storage bucket for AI images**
- Create `blog-images` storage bucket with public read access
- Edge function generates images and uploads them

**Step 2: Rewrite `autopilot-content` edge function**
- Add duplicate detection (query existing blog slugs/titles)
- Add competitor scraping (Firecrawl top 3 results for target keyword, extract what they cover)
- Add internal linking (fetch 10 recent blog slugs/titles, pass to AI prompt)
- Add FAQ schema generation in blog body
- Expand trending queries to carnival lifestyle topics
- Change social generation to "content ideas" format
- Generate AI image per blog post via Lovable AI image model
- Upload image to storage, set `image_url` on blog post

**Step 3: Dynamic sitemap edge function**
- New `generate-sitemap` edge function that queries all blog posts and builds XML sitemap
- Called at end of each autopilot run
- Also serves as a route the frontend can hit

**Step 4: Serve dynamic sitemap**
- Update the app to fetch sitemap from the edge function or serve from `site_config`
- Store generated sitemap XML in `site_config` so it's served statically

**Step 5: Update AutopilotTab UI**
- Show image generation status in run results
- Show "Content Ideas" section instead of "Social Drafts"
- Add count of internal links created

### Files Changed
- **Modified**: `supabase/functions/autopilot-content/index.ts` — major rewrite with all enhancements
- **New**: `supabase/functions/generate-sitemap/index.ts` — dynamic sitemap builder
- **New migration**: Create `blog-images` storage bucket
- **Modified**: `src/components/admin/AutopilotTab.tsx` — updated UI for new features
- **Modified**: `generated_content` usage — social posts become "content ideas"

### Daily Output (10 territories)
- 10 SEO blog posts with competitor-aware content
- 10 AI-generated hero images
- 10 FAQ schema blocks (Google rich results)
- 20-30 internal links woven across new posts
- 10 social content idea briefs
- 1 fresh sitemap submitted to search engines

