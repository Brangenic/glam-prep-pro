# Working in the Carnival Glam Hub codebase

Project rules for anyone, human or agent, changing this repository.
Production site: https://www.carnivalglamhub.com. Vite, React, TypeScript,
Tailwind.

## The data layer is the single source of truth

Every factual thing the site says lives in `src/data/` or
`src/lib/constants.ts`:

- `territoryProfiles.ts`, `destinations.ts` for territories and dates
- `hubTiers.ts` for the two tiers, inclusions and capabilities
- `territoryPricing.ts` for every published price
- `seasons.ts` for season end dates and closing out
- `policies.ts` for Terms, refunds and privacy
- `pressCoverage.ts` for verified press
- `stationRentals.ts` for station and vendor space offers
- `constants.ts` for the booking URL, site URL, Amazon storefront,
  WhatsApp and contact email

Rules:

- **No component may hardcode a price.** Import it. Same for dates,
  venues, URLs, deposit figures and inclusion lists.
- Never invent a price or a date. If a figure is not in the data layer it
  is not confirmed, and the correct output is "confirmed on booking".
- Season status is always derived from `hasSeasonPassed`, never a hand
  maintained list of passed territories.

## Two surfaces, always changed together

This is a client-rendered SPA, and social and search crawlers do not run
JavaScript. So every page exists twice:

1. The runtime React surface under `src/`
2. The build-time prerender scripts, `scripts/prerender-routes.ts`,
   `scripts/prerender-bodies.ts`, `scripts/prerender-blog-meta.ts`, plus
   the sitemap generators

Any change touching customer-facing pricing, policy wording, meta titles,
descriptions, canonicals or share images must be applied to both. They
drift apart silently, and the drift is only visible in View Source.

Never remove the canonical-domain redirect script or the noindex script
at the top of `index.html`, and never point a canonical at a
`.lovable.app` host.

## Copy rules

- British spelling throughout.
- Never use an em dash. Use a comma, a full stop or the word "and".
- The word "masos" must never appear in customer-facing copy. URLs are
  the only exception.
- No emoji in Glam Bot output or in the chat widget UI.

## GLAM BOT SYNCHRONISATION RULE

Any change to Carnival Glam Hub factual content must trigger a review of
Glam Bot knowledge. Where relevant, update the bot knowledge source in
the same commit or change set. Never leave site content and bot data
inconsistent.

In practice:

- The bot's knowledge pack is **generated** from `src/data/` by
  `src/data/botKnowledge.ts` and `scripts/generate-bot-knowledge.ts`,
  which writes `supabase/functions/chat/knowledge.json`. The generator
  runs on `predev` and `prebuild`.
- So editing a data module and rebuilding updates the bot automatically.
  There is nothing else to do for a price, a date, a policy clause or a
  press story.
- The drift test in `src/test/glamBotKnowledge.test.ts` fails the build
  if the committed pack does not equal a fresh build, or if
  `territoryProfiles.ts` and `destinations.ts` disagree.
- Anything added **outside** `src/data/` must be added to
  `botKnowledge.ts` in the same change, or the bot will not know it.
- Never hand-edit `supabase/functions/chat/knowledge.json`.

Full detail lives in `GLAM_BOT_RULES.md`.

### Worked examples

**Changing a Trinidad price.** Edit the product line in
`src/data/territoryPricing.ts`. Check `src/pages/BookingCalculator.tsx`
and the destination prerender still read from the module rather than a
literal. Regenerate the pack, then run `npm run test`.

**Adding a territory.** Add it to `src/data/destinations.ts` and
`src/data/territoryProfiles.ts` with identical name, short name and date
text, add its season end date to `src/data/seasons.ts`, its tier to
`src/data/hubTiers.ts`, its pricing to `src/data/territoryPricing.ts`, a
route in `src/App.tsx`, and a hero plus meta entry in
`scripts/prerender-routes.ts` and the sitemap scripts. Regenerate the
pack, then run `npm run test`, which will fail on drift if the two
territory modules disagree.

**Adding press coverage.** Add the story to `src/data/pressCoverage.ts`
with its outlet, headline, date and URL. The press count and the outlet
list on `/press` and in the bot's press topic are derived, so there is no
number to update. Regenerate the pack, then run `npm run test`.

**Changing a policy.** Edit the clause in `src/data/policies.ts`. Mirror
it in `src/pages/FAQ.tsx` if the FAQ paraphrases it, and in
`scripts/prerender-bodies.ts` so crawlers see the same wording. The
deposit figure the bot quotes is read out of clause 1.1, so it follows
automatically. Regenerate the pack, then run `npm run test`.
