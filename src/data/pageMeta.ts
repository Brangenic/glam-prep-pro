/**
 * Page titles and meta descriptions shared by the React pages and the
 * build-time prerender scripts.
 *
 * The prerendered HTML is a second rendering surface. Any copy that both
 * surfaces must agree on lives here so it can never be typed twice.
 * This module imports no assets, so the Node prerender scripts can read it.
 */

export const ABOUT_PAGE_TITLE =
  "About Carnival Glam Hub | Caribbean Beauty Concierge";

export const ABOUT_PAGE_DESCRIPTION =
  "Caribbean Carnival morning concierge, founded in 2017 by Gabrielle Waite and Kibwe McGann. More than 15,000 masqueraders served since 2017.";

export const REVIEWS_PAGE_TITLE =
  "Carnival Glam Hub Reviews | What Masqueraders Say";

export const REVIEWS_PAGE_DESCRIPTION =
  "Reviews published on Google by Carnival Glam Hub clients who booked Carnival makeup, hair and glam across Trinidad, Jamaica, Miami, Toronto and the wider Caribbean.";

/** The two founders, in the order they are always named. */
export const FOUNDER_NAMES = ["Gabrielle Waite", "Kibwe McGann"] as const;

/** Verified outbound links for the founder credit. */
export const GABBY_GLAM_COSMETICS_URL = "https://gabbyglamcosmetics.com/";
export const GLAM_HAUS_URL = "https://www.visitglamhaus.com/";
export const GLEANER_AWARD_URL =
  "https://past.jamaica-gleaner.com/article/lifestyle/20230428/leading-women-business-media-and-beauty-honoured";

/** How the booking rhythm is described everywhere. No invented lead time. */
export const BOOKING_RHYTHM_SENTENCE =
  "Appointments run to a fixed schedule on Carnival morning and are booked by time slot, so the popular times go first.";
