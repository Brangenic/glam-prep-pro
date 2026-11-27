import type { SeasonMakeupPage } from "@/data/carnivalMakeupPages";
import { hasSeasonPassed } from "@/data/seasons";
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Same data and section order as CarnivalSeasonMakeup.tsx. */
export function seasonMakeupBody(p: SeasonMakeupPage): string {
  const link = (url: string, text: string) => `<a href="${escape(url)}">${escape(text)}</a>`;
  const sections = (items: { q: string; a: string }[]) => items.map((s) => `<h3>${escape(s.q)}</h3><p>${escape(s.a)}</p>`).join("\n");
  const closed = hasSeasonPassed(p.slug);
  return `<p>${escape(p.intro)}</p>
<h2>What every booking includes</h2><ul>${p.inclusions.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>
${closed ? "<p>Bookings for this season are closed.</p>" : `<p>${link(p.bookingUrl, p.bookingLabel)}</p><p>${link(p.eventUrl, p.bookingLabel + " on our booking platform")}</p>`}
<img src="${escape(p.image)}" alt="${escape(p.imageAlt)}" loading="lazy" />
${p.timeline.length ? `<h2>How the morning works</h2>${sections(p.timeline)}` : ""}
${p.proof.length ? `<h2>Past seasons and independent reviews</h2>${p.proof.map((r) => `<p>${escape(r.text)}${r.url ? ` ${link(r.url, r.label ?? r.text)}` : ""}</p>`).join("\n")}` : ""}
<h2>Booking questions</h2>${sections(p.faq)}
<p>${link(`/${p.slug}`, "Explore the " + p.slug + " hub")}</p><p>${link("/policies", "Terms and policies")}</p>`;
}