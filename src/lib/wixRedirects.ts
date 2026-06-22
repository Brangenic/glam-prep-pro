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
    "/blogs/chatgpt-picks-the-top-5-best-caribbean-carnivals",
  "carnival-queen-rihanna-s-stunning-return-to-crop-over-2024":
    "/blogs/carnival-queen-rihannas-stunning-return-to-crop-over-2024",
  "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know":
    "/blogs/your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know",
  "saint-lucia-carnival-an-unforgettable-girls-trip":
    "/blogs/saint-lucia-carnival-2024-review",
  "barbados-crop-over-2025-what-to-know-before-you-go":
    "/blogs/barbados-crop-over-2025-what-to-know-before-you-go",
  "top-10-must-attend-fetes-at-trinidad-carnival-2024": "/trinidad",
  "comfort-queen-or-hot-gyal": "/blogs/comfort-queen-or-hot-gyal",
  "carnival-glam-hub-miami": "/miami",
  "tobago-carnival-2022-what-to-do-who-to-play-with-where-to-go": "/blogs",
  "why-celebrities-are-rethinking-jamaica-carnival": "/jamaica",
  "carnival-makeup-then-photoshoot": "/services/carnival-photoshoot",
  "carnival-glam-hub-trinidad-2024": "/trinidad",
  "miami-s-genx-carnival-costumes-2022": "/miami",
  "carnival-without-the-hassle-carnival-glam-hub": "/about",
  "toronto-carnival-2024-glam-hub-kayla-martone-team-up-to-offer-caribana-makeup-hair-and-photosho":
    "/toronto",
  "fete-republic-night-carnival-jamaica": "/jamaica",
  "my-miami-carnival-experience-feat-ton-travels": "/miami",
  "elle-smith-trinidad-carnival-2024-it-girl": "/trinidad",
  "don-t-make-these-5-rookie-mistakes-trinidad-carnival-2026":
    "/blogs/dont-make-these-5-rookie-mistakes-trinidad-carnival-2027",
  "carnival-week-2022-in-jamaica": "/jamaica",
  "carnival-is-woman": "/blogs",
  "burna-boy-for-crop-over": "/barbados",
  "what-is-carnival-glam-hub-what-is-all-the-fuss-about": "/about",
  "faces-of-bella-rogue-confirmed-for-jamaica": "/jamaica",
  "jouvert-hair-tips":
    "/blogs/how-to-protect-your-hair-at-jouvert-without-looking-crazy",
  "is-trinidad-carnival-safe-the-real-talk-you-never-knew-you-needed":
    "/blogs/is-trinidad-carnival-safe",
  "how-to-put-on-your-carnival-wire-bra":
    "/blogs/how-to-put-on-your-carnival-wire-bra",
  "essential-pointers-for-those-attending-carnival-in-trinidad-and-tobago": "/trinidad",
  "yardmas-jamaica-carnival-band-launch-2024": "/jamaica",
  "my-miami-carnival-experience": "/miami",
  "carnival-dos-and-donts": "/blogs",
  "up-next-bun-up-the-road-with-genxs-carnival": "/jamaica",
  "10-tips-for-trinidad-carnival-jouvert":
    "/blogs/10-tips-for-trinidad-carnival-jouvert",
  "xodus-jamaica-carnival-band-launch-a-celebration-of-mas-couture": "/jamaica",
  "carnival-in-the-caribbean-what-you-need-to-know": "/blogs",
  "how-did-we-get-here-carnival-glam-hub": "/about",
  "genxs-drops-first-costume-look-and-unveils-carnival-theme": "/jamaica",
  "caribbean-beauties-carnival-glam-hub": "/about",
  "get-ready-to-roar-genx-miami-carnival-launch-2024-ravage-unleashed": "/miami",
  "your-carnival-hair-is-not-a-joke-jouvert-essentials-you-ll-thank-yourself-for":
    "/blogs/dont-skip-jouvert-because-of-your-hair-tips-to-keep-it-fabulous",
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