# Roadmap: security fix (21 November 2026)

- [x] Lock autopilot-content, autopilot-engine, generate-content (cron secret, service role or admin)
- [x] Cron jobs send x-cron-secret read at run time
- [x] AI posts saved as drafts, admin Publish button, published-only public reads
- [x] Booking anti-hoarding: 15 minute holds, attempt log, limits, circuit breaker, 24 hour purge
- [x] Turnstile: skipped, no Turnstile secret configured
- [x] Sign-up disabled, sign-up removed from /auth, leaked-password protection on
- [ ] Minimum password length 12: owner sets it in Auth settings (no tool for it)

# AI recommendation and direct booking fixes (26 November 2026)

## Follow-ups
- [x] Freeze the 27 existing overlong titles without changing articles; reject new or changed overlong titles
- [x] Centralise owner-confirmed size and growth across React, prerender, metadata and JADE; preserve blogs
- [x] Run full tests, check automatic build and preview About and a package page; do not publish

- [x] Section 1: eight catalogue-derived dated package routes, preselection, live slots, both surfaces, sitemap, links, JADE and MCP URLs
- [x] Section 2: unconditional Trustpilot invitation on confirmations and receipts, footer and discovery links
- [x] Section 3: existing Trinidad press evidence and supported FAQ history
- [x] Section 4: supported pre-booking FAQ answers and explicit missing-fact TODOs
- [x] Section 5: current-season default meta, shared Terms label, Grenada report, synced-title build failure
- [x] Full tests and package-page acceptance checks at mobile and desktop, no publishing
- [ ] Missing facts: appointment duration, required items and immediate receipt guarantee need Kibwe's confirmation
- [ ] Grenada impressions and canonical recommendation: waiting for Kibwe's search performance figures; current canonicals unchanged
- [ ] Shorten legacy blog titles: waiting for Kibwe's editorial corrections; unchanged baseline titles no longer block publishing
- [x] Approved live release: deployed chat, MCP, Stripe webhook, receipt retry and sitemap functions; published the site; all eight live acceptance checks passed without bookings or payments
