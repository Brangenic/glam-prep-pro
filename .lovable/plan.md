

## Plan: Admin AI Chat for Site Management

### What It Does
A chat interface in the `/admin` dashboard where admins talk to an AI assistant that can:
- Generate and publish content (social posts, blog drafts) — already partially built
- Update site configuration: hero text, announcements, featured destinations, CTA labels
- Query site data: "how many reviews do we have?", "show me draft content for Jamaica"

### Architecture

```text
Admin Chat UI ──► Edge Function (admin-chat) ──► Lovable AI
                                                    │
                                              Tool Calling
                                                    │
                                    ┌───────────────┼───────────────┐
                                    ▼               ▼               ▼
                              site_config      generated_content   queries
                              (DB table)       (existing table)    (read-only)
```

### Implementation Steps

**1. Create `site_config` table**
- Key-value store for dynamic site elements (hero headline, hero subtitle, announcement banner, featured territory, CTA text)
- Public read access (site renders from it), admin write access
- Site components read from this table with sensible defaults as fallback

**2. Create `admin-chat` Edge Function**
- Uses Lovable AI with tool calling
- Tools available to the AI:
  - `update_site_config` — change hero text, banners, CTAs
  - `generate_content` — create social/blog content for a territory
  - `publish_content` — approve and publish draft content
  - `query_data` — read stats (review count, content count, territories)
- Admin-only: validates JWT and checks `has_role(admin)`

**3. Add Chat tab to Admin dashboard**
- New "AI Assistant" tab in the existing admin Tabs component
- Chat UI similar to the public Glam Bot but styled for admin
- Shows what actions the AI took (e.g., "Updated hero headline to ...")

**4. Update site components to use `site_config`**
- Hero, FinalCTA, and Navbar read dynamic text from `site_config` with hardcoded defaults as fallback
- Uses React Query with a long stale time so it doesn't over-fetch

### What the Admin Experience Looks Like
- Admin: "Change the hero headline to 'Get Your Carnival Glam On'"
- AI: "Done — I've updated the hero headline. It's live now."
- Admin: "Generate 3 Instagram posts for Trinidad carnival"
- AI: "Created 3 draft posts for Trinidad. You can review them in the Content tab."
- Admin: "How many 5-star reviews do we have?"
- AI: "You currently have 47 five-star Google reviews."

### Files Changed
- **New**: `supabase/functions/admin-chat/index.ts`
- **New migration**: `site_config` table + RLS
- **Modified**: `src/pages/Admin.tsx` — add AI Assistant tab
- **Modified**: `src/components/landing/Hero.tsx` — read from `site_config`
- **Modified**: `src/components/landing/FinalCTA.tsx` — read from `site_config`

