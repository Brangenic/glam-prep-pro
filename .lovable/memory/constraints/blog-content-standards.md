---
name: Blog content standards
description: Typography, link styling, Amazon-link highlighting, booking-CTA dedup, and scraped-Wix cleanup rules for blog post bodies
type: constraint
---
Rules for the blog post renderer (`src/pages/BlogPost.tsx`) and any markdown rendered as a blog body:

- **H2** must always be visually prominent: `text-3xl font-bold` with a clear gap above (`!mt-16`) and below (`!mb-6`). H3 follows at `text-2xl font-semibold` with `!mt-12 !mb-4`.
- **In-content links** must be clearly identifiable as links — underlined AND in an accessible blue accent (`#1d4ed8`), not brand gold (gold-on-cream fails contrast as a link signal).
- **Amazon links** (host matches `amazon.*`) must render in Amazon orange `#FF9900`, bold and underlined, with `target=_blank rel="noopener noreferrer sponsored"`. Implemented via a custom `a` renderer in the ReactMarkdown `components` map so this applies to every blog automatically.
- **Booking CTAs** to `carnivalglamhub.masos.app` render as a single prominent button. De-duplicate: keep only the FIRST standalone booking link in the body, drop subsequent duplicates so the foot of a post never stacks 3+ identical "Book Now" buttons.
- **Scraped Wix cruft** must be stripped in `cleanMarkdown`: visitor-analytics blocks, Smartarget widgets, "Skip to Main Content", Wix Comments/Ratings sections, base64 image placeholders, blurred q_30,blur_30 thumbnails, stray escape backslashes.

**Why:** premium editorial reading experience, clearer CTAs, and Amazon storefront monetization that visibly stands out as a shop link.