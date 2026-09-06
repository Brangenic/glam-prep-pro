// Snapshot of every blog slug that resolves to a real, renderable post.
//
// Three sources, all of them live today:
//   1. Explicit React post routes in src/App.tsx
//   2. Recovered in-repo markdown posts (src/data/recoveredPostsMeta.ts)
//   3. Rows in the blog_posts table, captured here so build time code and
//      tests can validate links without a database round trip
//
// Maintenance: if a post is withdrawn, remove it here and it will fail the
// guides test until the guide entry pointing at it is removed too. That is
// the point, a deleted post must never leave a dead card behind.

import { RECOVERED_POSTS_META } from "./recoveredPostsMeta";

/** Posts rendered by their own React component. */
export const REACT_POST_SLUGS = [
  "caribbean-carnival-has-an-airlift-problem",
  "is-professional-carnival-makeup-worth-it",
  "how-far-in-advance-to-book-carnival-makeup",
] as const;

/** Database backed posts, snapshot taken 6 September 2026. */
export const DATABASE_POST_SLUGS = [
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua",
  "a-fabulous-time-at-glam-hub",
  "barbados-crop-over-2025-what-to-know-before-you-go",
  "behind-the-scenes-with-hoppy-how-stink-dutty-became-a-global-phenomenon",
  "bianca-manzano-on-hibiscus-bloom-designing-for-iconic-mas-and-why-tobago-carnival-matters",
  "carnival-glam-hub-experience-what-to-expect",
  "carnival-icon-beyond-the-bacchanal",
  "carnival-ponytails-bald-spots-what-no-one-tells-you",
  "carnival-queen-rihannas-stunning-return-to-crop-over-2024",
  "chatgpt-picks-the-top-5-best-caribbean-carnivals-heres-my-wild-take",
  "chloe-bailey-just-broke-the-internet-again-at-saint-lucia-carnival-2025",
  "chloe-baileys-saint-lucia-carnival-costume-breaks-the-internet",
  "consistently-amazing-service",
  "crop-over-2026-barbados-kadooment-guide",
  "de-fete-need-rules-fete-etiquette",
  "dont-skip-jouvert-because-of-your-hair-tips-to-keep-it-fabulous",
  "epic-carnival-cruise-partners-with-carnival-glam-hub-for-trinidad-carnival-2026",
  "epic-welcomes-carnival-glam-hub-aboard-for-trinidad-carnival-2026",
  "first-staging-of-carnival-glam-hub",
  "from-brushes-to-baddie-dolls-glam-hub-launches-first-ever-mondaywear-store",
  "genx-miami-carnival-2024-costumes",
  "hassle-free-carnival-glam",
  "how-to-protect-your-hair-at-jouvert-without-looking-crazy",
  "is-soft-glam-the-new-trend-carnival-makeup-looks-2024",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
  "jab-jab-grenada-2026-guide",
  "jouvert-amazon-finds-i-swear-by-for-carnival-season",
  "makeup-mastery-at-jamaica-carnival",
  "meet-kalista-genevieve-carnival-glam-queen-content-creator",
  "perfect-make-up-at-carnival",
  "rihannas-carnival-looks-over-the-years-50-photos",
  "saint-lucia-carnival-2024-review",
  "saint-lucia-carnival-2025-travel-tips-for-international-visitors",
  "serenas-trinidad-carnival-2025-journey-an-inspiration-for-all-masqueraders",
  "should-the-makeup-match-your-costume",
  "spirit-mas-band-launch-trinidad-carnival-2025-the-stage-is-set",
  "stress-free-carnival-experience",
  "strut-or-struggle-the-ultimate-guide-to-carnival-shoes",
  "the-evolution-of-glam-hub",
  "the-excitement-of-trinidad-carnival-2025-band-launch-season",
  "top-5-caribbean-carnival-jouvert-bands-experiences",
  "top-seven-best-carnival-hairstyles",
  "tribe-2026-band-launch-a-sea-of-mas-magic-mystery",
  "tribe-carnival-2027-elysia-band-launch",
  "trinidad-carnival-vs-grenada-carnival",
  "trinidad-carnival-vs-jamaica-carnival",
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
  "what-is-jouvert-and-why-should-you-do-it-at-least-once",
  "what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels",
  "what-to-bring-for-carnival",
  "what-you-need-to-know-about-saint-lucia-carnival",
  "why-i-keep-coming-back-to-carnival-glam-hub",
  "winnie-harlow-turns-heads-at-jamaica-carnival-a-genxs-glam-hub-experience",
  "your-no-nonsense-jab-jab-survival-kit-straight-from-someone-whos-been-baptized-in-oil",
  "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know",
  "youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing",
  "yuma-ferocious-trinidad-carnival-2027-band-launch",
] as const;

export const ALL_POST_SLUGS: ReadonlySet<string> = new Set<string>([
  ...REACT_POST_SLUGS,
  ...DATABASE_POST_SLUGS,
  ...RECOVERED_POSTS_META.map((p) => p.slug),
]);

export const isRealPostSlug = (slug: string) => ALL_POST_SLUGS.has(slug);
