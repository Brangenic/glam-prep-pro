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

# REDIRECTS AND VANITY DOMAINS

- Lovable production hosting has no edge or rewrite layer. There is no
  `_redirects`, no `_headers` and no `netlify.toml` behaviour in
  production. A rule added to `public/_redirects` does nothing. Verified
  26 August 2026: `/destinations/barbados` returns 200, not the 301 that
  file claims.
- A legacy or alias URL therefore cannot be given a real 301 from inside
  this repository. The strongest available signal is the pattern in
  `scripts/prerender-wix-redirects.ts`: a prerendered page carrying a
  canonical to the new URL, a meta refresh, a JavaScript redirect and
  enough real content that Google does not classify it as a Soft 404. A
  bare stub was previously flagged as Soft 404 in Search Console, so
  never reduce those pages to one sentence.
- Three vanity domains point at this site and are managed at the
  registrar, not here. `trinidadcarnivalmakeup.com` 301s to `/trinidad`,
  `miamicarnivalmakeup.com` 301s to `/miami`, and `bookglamhub.com` is
  reserved for the Glam Match tool. All three were verified as
  single-hop 301s on 26 August 2026, except bookglamhub.com which still
  serves a placeholder page.
- GoDaddy forwarding redirects the bare root only.
  `https://trinidadcarnivalmakeup.com/glam-match?utm_source=flyer`
  returns 404 with no redirect. Never publish a deep path or a query
  string on a vanity domain. Put campaign parameters on the destination
  URL instead. Real path and query preservation would require moving DNS
  to a host with wildcard redirect rules.

## Copy rules


- British spelling throughout.
- Never use an em dash. Use a comma, a full stop or the word "and".
- The word "masos" must never appear in customer-facing copy. URLs are
  the only exception.
- No emoji in JADE output or in the chat widget UI.

## JADE (GLAM BOT) SYNCHRONISATION RULE

Any change to Carnival Glam Hub factual content must trigger a review of
JADE knowledge. Where relevant, update the bot knowledge source in
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

---

# THE PRERENDERED SURFACE IS A SECOND RENDERING SURFACE

`scripts/prerender-bodies.ts` and `scripts/prerender-routes.ts` are not a
build detail, they are the site as every non JavaScript reader sees it,
which includes Google's first pass and every LLM crawler.

- Every copy or fact change is applied to the React page and to the
  prerender scripts in the same change set. One without the other is drift,
  and drift is only visible in View Source.
- Any figure or list that exists in `src/data/` is imported, never retyped.
  Prices through `src/data/territoryPriceProse.ts`, territory lists through
  `listNames` on `src/data/hubTiers.ts` filtered by the season flag, shared
  titles, descriptions and standing sentences through `src/data/pageMeta.ts`.
- The scripts run in Node and must not import anything that imports an image
  asset. `hubTiers.ts`, `territoryPricing.ts`, `pageMeta.ts` and
  `territoryPriceProse.ts` are safe, `destinations.ts` is not.
- Both founders are always named together, there is no rating, no review
  count, no invented lead time and no "the only" claim.
- `src/test/prerenderDrift.test.ts` fails the build on any of the above.

---

# ONWARD DESTINATION RULE

Any list, grid, strip, banner or link block that points a visitor at a
destination other than the one they are viewing shows **upcoming
destinations only**. A Carnival that has passed never appears as an onward
option anywhere on the site.

Destination pages themselves are never deleted, never deindexed and never
removed from the sitemap. The rule governs onward links, not pages. A
wrapped territory keeps its page, its content and its search presence, it
simply stops being offered as somewhere else to go.

The homepage destination grid in `src/components/landing/Destinations.tsx`
is in scope. A wrapped Carnival drops out of that grid entirely, it does
not stay on as a badge and a Gallery link, and the grid is left to reflow
rather than padded.

Every such list reads `getUpcomingDestinations` from `src/data/seasons.ts`.
Nobody adds a new destination list with its own hardcoded array. The helper
reads the live clock at call time, so the React app recomputes on hydration
and a stale prerender can never show a wrapped Carnival to a visitor.

Current call sites, all of which must stay on the helper:

- `src/pages/Destination.tsx`, the "Other Destinations" grid and the
  awaiting-dates banner
- `src/components/landing/Footer.tsx`, the footer destination list
- `src/components/RelatedLinks.tsx`, neighbour and service related links
- `src/components/landing/Destinations.tsx`, the homepage grid and the
  "Also glamming" strip
- `scripts/prerender-bodies.ts`, the build-time neighbour and footer
  cross-links

## Where a destination card goes

`getDestinationCardLink` in `src/lib/destinations.ts` is the only place
that decides. A destination card goes:

- to the MasOS event when the Carnival is upcoming and has a real event
  UUID on file, with UTMs attached by `buildDestinationUrl`
- to the destination page when it is upcoming but has no event UUID, which
  today is Jamaica and Tobago, so the visitor lands on the waitlist or
  enquiry block
- to the Gallery when the season has wrapped
- to a WhatsApp enquiry where a territory has no date, no page and no
  event, for example Atlanta, worded as an enquiry rather than a booking.
  Such a card never points at the generic MasOS events list, because that
  drops a visitor into a list of other territories

Anything not sellable carries no booking call to action. Epic Cruise is
the standing example: it returns in 2028 with no confirmed day, so it
holds no MasOS event and its card goes to `/epic-cruise`, where the
register-interest block lives.

Outbound cards use `target="_blank"` and `rel="noopener noreferrer"` to
match every other booking call to action. Internal cards stay client side
routes so the SPA does not reload.

## Reopening a territory

When a real date lands for any territory, set its season end date in
`SEASON_END_DATES` in `src/data/seasons.ts` and let everything reopen on
its own. Do not reopen a territory by hand, do not re-add it to a list, and
do not special case it in a component. Jamaica is the live example: it has
no confirmed 2027 day yet, so it reads "2027 season, dates to be confirmed"
and carries a waitlist rather than a bookable card. The day the date is
confirmed, one line in the season calendar is the whole change.

## Enforcement

`src/test/onwardDestinations.test.ts` fails if a wrapped slug can appear in
an onward list, if both Trinidad pages appear in one list, if a card link
resolves to the wrong target, or if a component grows a destination slug
array with no season filter beside it. It runs against a fixed clock of
26 August 2026 so it never starts failing on its own in February.

---

# J'OUVERT IS EDITORIAL, NEVER AN OFFER

Masqueraders do not book makeup, hair or a photoshoot for J'ouvert.
J'ouvert is oil, paint and mud, so glam before it makes no commercial
sense. Carnival Glam Hub sells nothing for J'ouvert, anywhere, and must
never appear to. This is regional, not a Grenada quirk.

J'ouvert therefore never appears on a destination page, a service page, a
package, an inclusion list, a highlight, an FAQ answer, a meta
description, structured data, `public/llms.txt`, a prerendered body, or in
the JADE knowledge pack. Not as a package, not as an inclusion, not as
an example, not as "and J'ouvert too".

The blog posts stay, all of them, untouched. They are top of funnel, they
rank, and one of them sits on a keyword doing thousands of searches a
month. Never delete, rename, noindex, redirect or reword a J'ouvert
article, and never remove one from the sitemap, the blog index or internal
links. Editorial links from a commercial page into a J'ouvert guide are
fine, the offer is what is forbidden.

JADE must not pretend the festival does not exist. It may discuss
J'ouvert and point to our guides, it simply may not sell makeup, hair or a
photoshoot for it. The rule lives in the NEVER SAY guardrail in
`src/data/botKnowledge.ts` and in the J'OUVERT section of the system
prompt in `supabase/functions/chat/logic.ts`.

## Enforcement

`src/test/jouvertNotAnOffer.test.ts` fails the build if any casing of
"jouvert" appears in destination data, package or pricing data, inclusion
lists, service page copy, FAQ answers, `public/llms.txt`, the prerender
scripts or the generated bot pack. Blog directories and blog scripts are
scoped out on purpose. A future session that finds a Grenada or Trinidad
page with no J'ouvert mention and thinks it is an oversight is wrong.


---

# AI BOOKING APP

A remote MCP server, the `glam-hub-mcp` edge function, sells Trinidad Carnival 2027 appointments inside ChatGPT and Claude with Stripe Checkout on Carnival Glam Hub's own Stripe account.

- The catalogue `supabase/functions/glam-hub-mcp/catalogue.json` is generated from `src/data/` by `src/data/aiBookingCatalogue.ts` and `scripts/generate-ai-booking-catalogue.ts` on predev and prebuild. Never hand-edit it. `src/test/aiBookingCatalogue.test.ts` fails on drift.
- Trinidad 2027 makeup and photoshoot only, standard artists: mon/tue/both makeup, makeup and photoshoot, and Monday and Tuesday photoshoot only. Nothing premium, no hair, bronzing, Full Glam, reels, bag check or barber.
- Slots 04:00 to 08:00 each day, capacity 3. A both-days booking holds one Monday and one Tuesday slot. A slot counts paid bookings and unexpired pending holds (31 minutes). Paid in full at booking.
- No discount, coupon or promotion code of any kind, anywhere.
- A frontend publish does not redeploy edge functions. Redeploy `glam-hub-mcp` after any catalogue or function change.
- Payment confirmation: `glam-hub-stripe-webhook` (signature checked with STRIPE_WEBHOOK_SECRET, 5 minute tolerance) marks a booking paid only when amount and currency match, and `get_booking_status` reconciles with Stripe if a webhook is late. A paid booking stays paid even if its slot is now over capacity; the accounts email then opens "OVERBOOKED, CHECK SLOT".
- Emails go from carnivalglamhub@gmail.com through the Gmail connector. Templates live in `supabase/functions/_shared/glamHubEmails.ts` and are tested by `src/test/aiBookingEmails.test.ts`. The receipt never shows the booking reference. `notification_sent_at` and `receipt_sent_at` are set only after a successful send, so nothing sends twice and `glam-hub-email-retry` (service role only) can resend what was skipped.
- The website channel is `/trinidad/book`. It calls the same function through `/web/options` and `/web/book` on `glam-hub-mcp`, so the page, ChatGPT and Claude share one reservation, price and Checkout path. The server decides the price. Source is recorded as `website`, and Checkout returns to `/trinidad/book/confirmed` or `/trinidad/book/cancelled`. Page copy, FAQ and figures live in `src/data/trinidadBookPage.ts` and feed the page, prerender, JSON-LD and JADE.
- Checkout collects nothing beyond what we already hold: `billing_address_collection` auto, no shipping, phone or custom fields, promotion codes off.
- Refunds: `charge.refunded` on the webhook. A full refund sets status cancelled, which frees the slot, and records `refunded_at`. A partial refund only logs and notifies accounts with "PARTIAL REFUND". The accounts notice subject starts "ACCOUNTS | REFUND |", is sent once per refunded amount (`refund_notified_cents`) and nothing goes to the customer.
- "Talk to JADE" in this app reads `WHATSAPP_URL` from `src/lib/constants.ts` through the generated catalogue, the same number as the rest of the site. Never hardcode a WhatsApp number in the edge functions.
