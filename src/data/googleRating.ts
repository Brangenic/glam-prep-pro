/**
 * Google Business Profile rating, read from the live profile on the date in
 * asOf. Display only in the AI booking card. Never emit it as aggregateRating
 * in site JSON-LD. Update all fields together when re-read.
 */
export const GOOGLE_RATING = {
  rating: 4.8,
  count: 19,
  asOf: "2026-10-07",
  url: "https://www.google.com/maps?cid=3692744883055322374",
} as const;
