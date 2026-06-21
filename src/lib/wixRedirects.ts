// Single source of truth for legacy Wix /post/<slug> → current site redirects.
// Imported by both the React Router catch-all and the postbuild prerender
// script that emits static HTML at dist/post/<slug>/index.html.

export const WIX_REDIRECT_BASE = "https://www.carnivalglamhub.com";

// Keys are the old Wix slug (the part after `/post/`). Values are the
// site-relative target path on the current site, beginning with `/`.
export const WIX_REDIRECTS: Record<string, string> = {
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips":
    "/blogs/ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
  "amazon-finds-i-swear-by-for-carnival-season":
    "/blogs/jouvert-amazon-finds-i-swear-by-for-carnival-season",
  "carnival_hairstyle": "/blogs/top-seven-best-carnival-hairstyles",
  "top-5-caribbean-carnival-jouvert-bands-experiences":
    "/blogs/top-5-caribbean-carnival-jouvert-bands-experiences",
  "strut-or-struggle-the-ultimate-guide-to-carnival-shoes":
    "/blogs/strut-or-struggle-the-ultimate-guide-to-carnival-shoes",
  "behind-the-scenes-with-hoppy-how-stink-dutty-became-a-global-carnival-phenomenon":
    "/blogs/behind-the-scenes-with-hoppy-how-stink-dutty-became-a-global-phenomenon",
  "spirit-mas-carnival-band-launch-trinidad-2025-the-stage-is-set":
    "/blogs/spirit-mas-band-launch-trinidad-carnival-2025-the-stage-is-set",
  "what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels":
    "/blogs/what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival":
    "/blogs/jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
  "tribe-2026-band-launch-a-sea-of-mas-magic-mystery":
    "/blogs/tribe-2026-band-launch-a-sea-of-mas-magic-mystery",
  "serena-s-trinidad-carnival-journey-an-inspiration-for-all-masqueraders":
    "/blogs/serenas-trinidad-carnival-2025-journey-an-inspiration-for-all-masqueraders",
  "what-is-jouvert-and-why-should-you-do-it-at-least-once":
    "/blogs/what-is-jouvert-and-why-should-you-do-it-at-least-once",
  "chloe-bailey-s-saint-lucia-carnival-costume-breaks-the-internet-khloe-kardashian-approves":
    "/blogs/chloe-baileys-saint-lucia-carnival-costume-breaks-the-internet",
  "bianca-marzano-on-hibiscus-bloom-designing-for-iconic-mas-and-why-tobago-carnival-matters":
    "/blogs/bianca-manzano-on-hibiscus-bloom-designing-for-iconic-mas-and-why-tobago-carnival-matters",
  "the-excitement-of-trinidad-carnival-2025-band-launch-season":
    "/blogs/the-excitement-of-trinidad-carnival-2025-band-launch-season",
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua":
    "/blogs/2025-carnival-makeup-guide-50-looks-to-show-your-mua",
  "what-you-need-to-know-about-saint-lucia-carnival":
    "/blogs/what-you-need-to-know-about-saint-lucia-carnival",
  "meet-kalista-genevieve-carnival-glam-queen-content-creator":
    "/blogs/meet-kalista-genevieve-carnival-glam-queen-content-creator",
  "carnival-ponytails-bald-spots":
    "/blogs/carnival-ponytails-bald-spots-what-no-one-tells-you",
  "chloe-bailey-just-broke-the-internet-again-at-saint-lucia-carnival-2025":
    "/blogs/chloe-bailey-just-broke-the-internet-again-at-saint-lucia-carnival-2025",
  "should-the-makeup-match-your-costume":
    "/blogs/should-the-makeup-match-your-costume",
  "rihanna-s-carnival-looks-over-the-years-50-photos":
    "/blogs/rihannas-carnival-looks-over-the-years-50-photos",
  "de-fete-need-rules-fete-etiquette":
    "/blogs/de-fete-need-rules-fete-etiquette",
  "you-re-outside-for-trinidad-jouvert-but-your-hair-what-s-she-doing":
    "/blogs/youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing",
  "from-brushes-to-baddie-dolls-glam-hub-launches-first-ever-mondaywear-store":
    "/blogs/from-brushes-to-baddie-dolls-glam-hub-launches-first-ever-mondaywear-store",
  "winnie-harlow-turns-heads-at-jamaica-carnival-a-genxs-glam-hub-experience":
    "/blogs/winnie-harlow-turns-heads-at-jamaica-carnival-a-genxs-glam-hub-experience",
  "saint-lucia-carnival-2025-travel-tips-for-international-visitors":
    "/blogs/saint-lucia-carnival-2025-travel-tips-for-international-visitors",
  "carnival-icon-beyond-the-bacchanal":
    "/blogs/carnival-icon-beyond-the-bacchanal",
  "is-soft-glam-the-new-trend-uncovering-the-top-carnival-makeup-looks-for-2024":
    "/blogs/is-soft-glam-the-new-trend-carnival-makeup-looks-2024",
  "epic-carnival-cruise-partners-with-carnival-glam-hub-for-trinidad-carnival-2026":
    "/blogs/epic-carnival-cruise-partners-with-carnival-glam-hub-for-trinidad-carnival-2026",
  "epic-welcomes-carnival-glam-hub-aboard-for-trinidad-carnival-2026":
    "/blogs/epic-welcomes-carnival-glam-hub-aboard-for-trinidad-carnival-2026",
  "chatgpt-picks-the-top-5-best-caribbean-carnivals-here-s-my-wild-take":
    "/blogs/top-5-caribbean-carnival-jouvert-bands-experiences",
  "carnival-queen-rihanna-s-stunning-return-to-crop-over-2024":
    "/blogs/rihannas-carnival-looks-over-the-years-50-photos",
  "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know":
    "/jamaica",
  "saint-lucia-carnival-an-unforgettable-girls-trip":
    "/blogs/saint-lucia-carnival-2024-review",
  "barbados-crop-over-2025-what-to-know-before-you-go": "/barbados",
};

export function getWixRedirectTarget(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();
  return WIX_REDIRECTS[decoded] ?? WIX_REDIRECTS[slug] ?? null;
}