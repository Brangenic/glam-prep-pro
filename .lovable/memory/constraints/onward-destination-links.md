---
name: Onward destination links, upcoming only
description: Any list, grid, strip or banner linking to another destination shows upcoming Carnivals only, read from getUpcomingDestinations. Pages stay live and indexed. Card links decided only by getDestinationCardLink.
type: constraint
---
Any list, grid, strip, banner or link block that points a visitor at a destination other than the one they are viewing shows **upcoming destinations only**. A Carnival that has passed never appears as an onward option anywhere on the site.

Rules:
- Every such list reads `getUpcomingDestinations` from `src/data/seasons.ts`. Never add a destination list with its own hardcoded array.
- Destination pages are never deleted, never deindexed and never removed from the sitemap. The rule governs onward links, not pages.
- `getDestinationCardLink` in `src/lib/destinations.ts` is the only place that decides where a destination card goes: the MasOS event when upcoming with a real event UUID, the destination page when upcoming without one (today Jamaica and Tobago), the Gallery when the season has wrapped.
- The helper reads the live clock at call time, so the React app recomputes on hydration and a stale prerender never shows a wrapped Carnival.
- When a real date lands, set the territory's season end date in `SEASON_END_DATES` and let everything reopen on its own. Never reopen a territory by hand.
- `src/test/onwardDestinations.test.ts` enforces all of the above against a fixed clock of 26 August 2026.

**Why:** Kibwe's standing rule, 26 August 2026. Sending someone to a Carnival that has already happened wastes their time and ours. Full detail in the ONWARD DESTINATION RULE section of `CLAUDE.md`.
