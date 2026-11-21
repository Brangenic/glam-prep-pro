---
name: Admin and content security
description: Content generators locked to cron secret or admin, AI blog posts are drafts until an admin publishes, public sign-up disabled
type: constraint
---
- Autopilot and content generators may only be triggered by the daily scheduler (private secret), the admin chat, or a signed-in admin. Never by the public site key.
- AI-written blog posts are never auto-published. They wait as drafts until the owner presses Publish in the Admin Autopilot tab.
- Public sign-up is off. The sign-in page has no sign-up option. New admins are added by the owner.
- Owner asked for: password minimum 12 characters, leaked-password protection on.
