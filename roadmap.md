# Roadmap: security fix (21 November 2026)

- [x] Lock autopilot-content, autopilot-engine, generate-content (cron secret, service role or admin)
- [x] Cron jobs send x-cron-secret read at run time
- [x] AI posts saved as drafts, admin Publish button, published-only public reads
- [x] Booking anti-hoarding: 15 minute holds, attempt log, limits, circuit breaker, 24 hour purge
- [x] Turnstile: skipped, no Turnstile secret configured
- [x] Sign-up disabled, sign-up removed from /auth, leaked-password protection on
- [ ] Minimum password length 12: owner sets it in Auth settings (no tool for it)
