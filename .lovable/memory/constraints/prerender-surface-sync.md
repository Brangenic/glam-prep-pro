---
name: Prerendered surface sync
description: The prerender scripts are a second rendering surface. Every copy or fact change applies to both, and any figure or list in src/data must be imported by the scripts, never retyped.
type: constraint
---
This is a client-rendered SPA, so `scripts/prerender-bodies.ts` and `scripts/prerender-routes.ts` are a second, independent rendering surface. What they emit is what Google's first pass and every LLM crawler reads.

Rules:
- Any change to customer-facing copy, a fact, a price, a date, a title, a description or a canonical is applied to the React page and to the prerender scripts in the same change set. They drift silently and the drift is only visible in View Source.
- Any figure or list that exists in `src/data/` is imported by the scripts, never retyped. Prices come from `src/data/territoryPricing.ts` through `src/data/territoryPriceProse.ts`. Territory lists come from `src/data/hubTiers.ts` through `listNames`, filtered by the season flag so a territory that is not running cannot appear in an operating list. Shared titles, descriptions and standing sentences live in `src/data/pageMeta.ts`.
- The scripts run in Node, so they must not import anything that imports an image asset. `hubTiers.ts`, `territoryPricing.ts`, `pageMeta.ts` and `territoryPriceProse.ts` are safe. `destinations.ts` is not; use `territoryProfiles.ts` instead.
- Both founders, Gabrielle Waite and Kibwe McGann, are always named together. No rating, no review count, no invented lead time, no "the only" claim, no en dash or em dash.
- `src/test/prerenderDrift.test.ts` enforces all of the above and fails the build on drift.
