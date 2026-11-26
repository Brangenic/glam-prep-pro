# Architecture rules

- Derive direct Trinidad package routes from the existing catalogue using the pure URL mapper; this keeps website and MCP product links identical without circular imports.
- Keep dated package text and Offer schema in the asset-free package data module, read by React and prerender scripts; this prevents crawler and browser drift.
- Carry shared consent wording and review invitations through the generated catalogue into edge code; this keeps browser, MCP and receipt wording consistent.
- Resolve simple Trinidad booking intents against the generated JADE package directory before model calls; this prevents fabricated package URLs while retaining the existing AI path for other questions.
- Generate only the marked Trinidad discovery section when refreshing JADE knowledge; this preserves unrelated llms.txt content.
- Reject overlong synced blog titles before prerender output and preserve the error's non-zero exit; this stops silent truncation without editing articles.