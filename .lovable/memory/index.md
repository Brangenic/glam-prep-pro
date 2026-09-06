# Project Memory

## Core
Premium aesthetic: warm-white base, Gold & Pink accents. Playfair Display (headings) & Outfit (body).
Use high-res real event photography. No AI portraits, UI overlays, or watermarks.
Band-neutral regional service. External booking: carnivalglamhub.masos.app/events. Contact: Bookings@carnivalglamhub.com, 8765090997.
Automated daily sync (06:00 AM) for Google reviews, Amazon collections, and Wix blog metadata.
Legal: STRICT removal of specific individuals from all assets and metadata.
Blogs: NEVER generate AI images. Hero/body images must come only from the curated blog-images/pool bucket.

## Memories
- [Visual Direction](mem://style/visual-direction) — Premium editorial aesthetic, photography guidelines, and colors
- [Typography](mem://style/typography) — Fonts used for headlines (Playfair Display) and body (Outfit)
- [Key Patterns](mem://ux/key-patterns) — Core layout, interactive features, and framing guidelines
- [Gallery UX](mem://ux/gallery) — Masonry image gallery layout and YouTube video integration
- [Brand Identity & Contact](mem://brand/identity) — Brand positioning, contact info, social links, and logo usage
- [Business Offerings](mem://features/business-offerings) — Supported destinations and detailed service list
- [Station Rentals](mem://features/station-rentals) — B2B station rental page, tier-derived rates (Lite US$200/day, Full US$250/day or US$400 both days)
- [Booking Integration](mem://features/booking-integration) — External booking platform URL and CTA linkage
- [Amazon Store](mem://features/amazon-store) — Daily sync from Amazon storefront to curated collections
- [Reviews](mem://features/reviews) — Automated daily sync of Google reviews via Lovable Cloud
- [Blog Integration](mem://features/blog) — Syncs and sanitizes content from Wix blog to local Markdown
- [Data Sync Architecture](mem://architecture/data-sync) — Scheduled synchronization and hybrid Edge Function hydration
- [Site Structure](mem://architecture/site-structure) — Multi-page app routing setup and native blog integration
- [SEO Strategy](mem://seo/implementation-strategy) — JSON-LD schemas, meta tags, and indexing setup
- [Destination Redirects](mem://navigation/destination-redirects) — SEO and fallback redirects for location paths
- [Legal Compliance](mem://constraints/legal-compliance) — Strict constraint for removing specific individuals from assets
- [No AI Blog Images](mem://constraints/no-ai-blog-images) — Blog images must come only from user-provided pool, never AI-generated
- [Blog Social-Share Image](mem://constraints/blog-social-share-image) — og:image must transcode article hero to 1200x630 JPEG, never serve generic logo
- [Blog Content Standards](mem://constraints/blog-content-standards) — H2 styling, link colors, Amazon-link highlight, booking-CTA dedup, Wix cleanup
- [JADE Knowledge Sync](mem://constraints/glam-bot-knowledge-sync) — JADE (assistant name, formerly Glam Bot) knowledge generated from src/data, never hand-edit knowledge.json, resync in same change set
- [Onward Destination Links](mem://constraints/onward-destination-links) — Onward lists show upcoming Carnivals only via getUpcomingDestinations; card links decided only by getDestinationCardLink
- [J'ouvert Not An Offer](mem://constraints/jouvert-not-an-offer) — J'ouvert never appears on any commercial surface or in the bot pack; every J'ouvert blog post stays untouched
