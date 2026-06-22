---
name: Blog social-share image
description: og:image / twitter:image rules for blog posts — never serve the generic brand logo when an article has any image
type: constraint
---
Blog post `og:image` and `twitter:image` MUST never fall back to the generic `/og-image.png` brand logo when the article has any usable image.

Rules (enforced in `scripts/prerender-blog-meta.ts`):
- Always transcode the article's hero image to a 1200x630 JPEG at build time (cover crop, quality ~85, mozjpeg) and serve it from `https://www.carnivalglamhub.com/og/<slug>.jpg`.
- Accept any source format (Supabase Storage WebP, wixstatic, PNG, etc.) — never reject an image by extension. Always re-encode through `sharp` to JPEG so WhatsApp/Facebook/Twitter/iMessage render it.
- If the hero image is missing or fails to fetch, fall back to the FIRST markdown body image (`![...](url)`) and transcode that instead.
- Only fall back to `/og-image.png` as an absolute last resort when a post has no image at all.
- Always emit `og:image:type=image/jpeg`, `og:image:width=1200`, `og:image:height=630`, and twin twitter:* tags.

**Why:** prior bug shipped 15 posts pointing `og:image` at WebP URLs (rejected by Facebook), then fell back to the generic Glam Hub logo, killing CTR on social shares.