---
name: Season lifecycle
description: Self-maintaining season calendar that closes passed territories out of all booking CTAs
type: feature
---
`src/data/seasons.ts` is the single source of truth for territory season end dates (ISO).
`hasSeasonPassed(slug)` compares the end date against today. No date means not passed.
`SEASON_FORWARD_SLUGS` exempts Jamaica, which always points forward to its next season.

When a season passes, everything derives automatically:
- Destination page: "Season wrapped" badge and banner, package grid is non-clickable reference only, every booking CTA becomes a Gallery link (`/#gallery`, there is no standalone /gallery route).
- Home destination cards link to the Gallery with a "wrapped" badge.
- Booking calculator territory list and station rentals rate card drop the territory. Tier rates in `stationRentals.ts` stay untouched for next season.
- Destination FAQs, `prerender-routes.ts` head and `prerender-bodies.ts` body all swap to wrapped copy.

Pages are never deleted. They stay indexed, in the sitemap and prerendered. Only the commercial CTA changes.
