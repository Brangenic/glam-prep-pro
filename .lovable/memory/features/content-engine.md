---
name: AI Content Engine
description: Territory-aware AI content generation pipeline using scraped data
type: feature
---
## AI Content Engine (Phase 1)

### Tables
- `territories` — 10 seeded carnival territories (Trinidad, Jamaica, Antigua, Barbados, St. Lucia, Grenada, Tobago, Miami, Atlanta, Toronto) with keywords, hashtags, event dates
- `generated_content` — AI-generated marketing pieces with territory, channel, content_type, status (draft/published)

### Edge Function: `generate-content`
- POST with `{ territory_slug?, channel, content_type, count }`
- Gathers source data: Google reviews, blog posts, Amazon products, Firecrawl trending search
- Calls Lovable AI (gemini-2.5-flash) to generate territory-specific content
- Supports channels: instagram, whatsapp, facebook, twitter, blog, email
- Content types: social_post (default), or custom
- Saves as draft; requires admin approval to publish

### Channels supported
instagram, whatsapp, facebook, twitter, blog, email

### Brand voice
Confident, glamorous, inclusive, Caribbean-rooted. Always includes booking CTA.
