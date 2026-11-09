/**
 * Alt text for images inside synced blog articles that arrive with an
 * empty alt, written as `![](url)` in the article markdown. The article
 * text itself lives in the backend and is not edited here; instead both
 * rendering surfaces fill the alt from this map when the markdown leaves
 * it empty: src/pages/BlogPost.tsx and scripts/prerender-bodies.ts.
 *
 * Keys are a stable part of the image URL, matched with `includes`, so
 * resized Wix variants of the same file still match. Each value describes
 * what is actually in the picture. This module imports no assets.
 */

const BLOG_IMAGE_ALT: [string, string][] = [
  [
    "477465_ec03697c024549959a39d83b00518cd4~mv2.jpg",
    "Two progress photos side by side of a masquerader in a white bikini, dated 18 July 2023 and 29 March 2024, captioned Hard work pays off",
  ],
  [
    "477465_59fef3335bdd4acdb9b2ff3fde78c74f~mv2.jpg",
    "Collage of five Carnival Glam Hub makeup looks with jewelled headpieces, gem face art and feathered costumes",
  ],
  [
    "event_poster_1751658402456.png",
    "Tribe Launch Land band launch poster: Saturday 5 July, 7pm, QPS, drinks inclusive, with physical ticket outlets listed",
  ],
  ["content_provider_featured_1720202032122.png", "Advance Dynamics logo, a rainbow striped armadillo"],
  ["content_provider_logo_1719329705779.png", "Advance Dynamics logo"],
  ["player.tegotv.com/img/website_logo.png", "Website icon"],
  ["player.tegotv.com/img/facebook_logo.png", "Facebook logo"],
  ["player.tegotv.com/img/instagram_logo.png", "Instagram logo"],
  ["player.tegotv.com/img/youtube_logo.png", "YouTube logo"],
  ["player.tegotv.com/img/firetv.png", "Fire TV logo"],
  ["player.tegotv.com/img/android_tv.png", "Android TV logo"],
  ["player.tegotv.com/img/roku.png", "Roku logo"],
  ["player.tegotv.com/img/iphone.png", "Apple iPhone app logo"],
  ["player.tegotv.com/img/android_mobile.png", "Android app logo"],
];

/** The alt to use: the markdown's own alt when it has one, else the map, else undefined. */
export function blogImageAlt(src: string | undefined, alt?: string | null): string | undefined {
  const own = (alt ?? "").trim();
  if (own) return own;
  if (!src) return undefined;
  return BLOG_IMAGE_ALT.find(([key]) => src.includes(key))?.[1];
}
