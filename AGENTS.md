# Architecture rules

- Derive direct Trinidad package routes from the existing catalogue using the pure URL mapper; this keeps website and MCP product links identical without circular imports.
- Keep dated package text and Offer schema in the asset-free package data module, read by React and prerender scripts; this prevents crawler and browser drift.
- Carry shared consent wording and review invitations through the generated catalogue into edge code; this keeps browser, MCP and receipt wording consistent.
- Resolve simple Trinidad booking intents against the generated JADE package directory before model calls; this prevents fabricated package URLs while retaining the existing AI path for other questions.
- Generate only the marked Trinidad discovery section when refreshing JADE knowledge; this preserves unrelated llms.txt content.
- Reject new or changed overlong synced blog titles before prerender output, exempting only exact frozen baseline titles; this protects publishing without editing legacy articles.
- Keep size, annual growth and counting-scope prose in the asset-free stats module, with generated discovery text and Vite HTML substitution; this keeps React, JADE and crawler content tied to one annual update.
- Keep sync_state accessible only to the service role; the admin dashboard reads other tables and needs no direct sync-record access.