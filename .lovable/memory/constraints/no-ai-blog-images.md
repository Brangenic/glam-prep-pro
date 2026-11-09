---
name: No AI images in blogs
description: Blog hero/body images must come ONLY from user-provided photos in the blog-images/pool bucket. Never generate AI images for blog content.
type: constraint
---
Blog posts (autopilot or manual) MUST use only real photos provided by the user, sourced from the Supabase `blog-images/pool` storage bucket. Never call any image generation model (Gemini, GPT-image, etc.) for blog hero or body images. If the pool is empty, fail loudly rather than fall back to AI generation. **Why:** User explicitly forbids AI imagery for blogs — only real event photography is allowed.

One-time exception, approved by the site owner on 9 November 2026: the post `2027-carnival-calendar` uses five owner-supplied graphics stored under `blog-images/2027-carnival-calendar/`, deliberately outside `pool/` so autopilot can never select them. Do not "fix" that post, do not copy those images into `pool/`, and do not treat it as a precedent for any other post.
