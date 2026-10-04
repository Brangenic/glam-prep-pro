// Pure email templates for the Glam Hub AI booking app. No imports, so
// vitest and Deno can both load it. British spelling, no em dashes, no
// emoji. The receipt never carries the booking reference (house rule).

import { catalogue } from "./glamHubCatalogue.ts";
// From WHATSAPP_URL in src/lib/constants.ts via the generated catalogue.
export const JADE_WHATSAPP = catalogue.whatsapp;
export const POLICIES_URL = "https://www.carnivalglamhub.com/policies";
export const LOGO_URL = "https://www.carnivalglamhub.com/brand-logo.png";
export const ACCOUNTS_EMAIL = "carnivalglamhub@gmail.com";

export type BookedDay = { day: "monday" | "tuesday"; time: string; spotsLeft?: number };
export type EmailBooking = {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  productLabel: string;
  amountUsd: number;
  days: BookedDay[];
  paymentIntentId: string | null;
  paidAt: string; // ISO
  source: string;
  venue: string;
  inclusions: string[];
  overbooked?: boolean;
};

const SHORT: Record<string, string> = { monday: "Mon", tuesday: "Tue" };
const LONG: Record<string, string> = {
  monday: "Carnival Monday 8 February 2027",
  tuesday: "Carnival Tuesday 9 February 2027",
};

/** "05:00" -> "5am", "12:30" -> "12:30pm". */
export function friendlyTime(t: string): string {
  const [hS, mS] = t.split(":");
  const h = Number(hS);
  const m = Number(mS ?? 0);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sorted(days: BookedDay[]): BookedDay[] {
  return [...days].sort((a, b) => (a.day === b.day ? 0 : a.day === "monday" ? -1 : 1));
}

export function trinidadTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Port_of_Spain",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso)) + " (Trinidad time)";
}

function inclusionsSentence(items: string[]): string {
  const l = items.map((i) => i.toLowerCase());
  if (l.length < 2) return l[0] ?? "";
  return `${l.slice(0, -1).join(", ")}, and ${l[l.length - 1]}`;
}

export function accountsEmail(b: EmailBooking): { subject: string; text: string } {
  const ds = sorted(b.days);
  const dayPart = ds.map((d) => SHORT[d.day]).join(" and ");
  const timePart = ds.map((d) => friendlyTime(d.time)).join(" and ");
  const subject = `ACCOUNTS | Trinidad 2027 | ${dayPart} ${timePart} | ${b.productLabel} | US$${b.amountUsd} | ${b.firstName} ${b.lastName}`;
  const lines = [
    ...(b.overbooked ? ["OVERBOOKED, CHECK SLOT", ""] : []),
    `Reference: ${b.reference}`,
    `First name: ${b.firstName}`,
    `Last name: ${b.lastName}`,
    `Email: ${b.email}`,
    `Cell: ${b.phone}`,
    `Package: ${b.productLabel}`,
    ...ds.map((d) => `${LONG[d.day]}: ${friendlyTime(d.time)}`),
    `Amount paid (USD): US$${b.amountUsd}`,
    `Stripe payment id: ${b.paymentIntentId ?? "not recorded"}`,
    `Paid at: ${trinidadTime(b.paidAt)}`,
    `Booked through: ${b.source}`,
    ...ds.map((d) => `Spots left ${SHORT[d.day]} ${friendlyTime(d.time)} after this booking: ${d.spotsLeft ?? "unknown"}`),
  ];
  return { subject, text: lines.join("\n") };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function receiptEmail(b: EmailBooking): { subject: string; text: string; html: string } {
  const subject = "You're booked, Glam Girl. Trinidad Carnival 2027";
  const ds = sorted(b.days);
  const when = ds.map((d) => `${LONG[d.day]} at ${friendlyTime(d.time)}`).join(" and ");
  const where = capitalise(b.venue);
  const incl = inclusionsSentence(b.inclusions);
  const text = [
    "Hey Glam Girl,",
    "",
    "Your chair is locked in for Trinidad Carnival 2027 and your payment is in. Here's everything you need.",
    "",
    `Package: ${b.productLabel}`,
    `When: ${when}`,
    `Where: ${where}`,
    `Paid in full: US$${b.amountUsd}`,
    "",
    `Included with your booking: ${incl}.`,
    "",
    "Please check in at the Hub 30 minutes before your time. There's a 15 minute grace period, and after that your service may be shortened so the next masquerader stays on schedule.",
    "",
    `Questions about your morning? Talk to JADE (${JADE_WHATSAPP}). Our booking policies are here (${POLICIES_URL}).`,
    "",
    "See you on Carnival morning,",
    "Carnival Glam Hub",
  ].join("\n");

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;color:#c9a24a;font-size:13px;text-transform:uppercase;letter-spacing:1px;width:120px;vertical-align:top">${k}</td><td style="padding:6px 0;color:#f4efe6;font-size:15px">${esc(v)}</td></tr>`;
  const html = `<!doctype html><html lang="en-GB"><body style="margin:0;padding:0;background:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0d0d0d;border-radius:14px;font-family:Georgia,'Times New Roman',serif">
<tr><td align="center" style="padding:28px 24px 8px"><img src="${LOGO_URL}" alt="Carnival Glam Hub" width="150" style="display:block;width:150px;height:auto"></td></tr>
<tr><td style="padding:8px 28px 0;color:#e6c878;font-size:22px">Hey Glam Girl,</td></tr>
<tr><td style="padding:12px 28px;color:#f4efe6;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif">Your chair is locked in for Trinidad Carnival 2027 and your payment is in. Here's everything you need.</td></tr>
<tr><td style="padding:4px 28px;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2a;border-bottom:1px solid #2a2a2a">
${row("Package", b.productLabel)}${row("When", when)}${row("Where", where)}${row("Paid in full", `US$${b.amountUsd}`)}
</table></td></tr>
<tr><td style="padding:16px 28px 0;color:#f4efe6;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif">Included with your booking: ${esc(incl)}.</td></tr>
<tr><td style="padding:12px 28px 0;color:#f4efe6;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif">Please check in at the Hub 30 minutes before your time. There's a 15 minute grace period, and after that your service may be shortened so the next masquerader stays on schedule.</td></tr>
<tr><td style="padding:12px 28px 0;color:#f4efe6;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif">Questions about your morning? <a href="${JADE_WHATSAPP}" style="color:#e6c878">Talk to JADE</a>. Our booking policies are <a href="${POLICIES_URL}" style="color:#e6c878">here</a>.</td></tr>
<tr><td style="padding:20px 28px 28px;color:#f4efe6;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif">See you on Carnival morning,<br><span style="color:#e6c878">Carnival Glam Hub</span></td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

/** Full refund when the whole charge has been returned. */
export function isFullRefund(amountCents: number, refundedCents: number): boolean {
  return amountCents > 0 && refundedCents >= amountCents;
}

/** Accounts-only refund notice. The customer gets nothing from us here. */
export function refundEmail(b: EmailBooking, refundedUsd: number, partial: boolean): { subject: string; text: string } {
  const ds = sorted(b.days);
  const dayPart = ds.map((d) => SHORT[d.day]).join(" and ");
  const timePart = ds.map((d) => friendlyTime(d.time)).join(" and ");
  const subject = `ACCOUNTS | REFUND | Trinidad 2027 | ${dayPart} ${timePart} | ${b.productLabel} | US$${b.amountUsd} | ${b.firstName} ${b.lastName}`;
  const lines = [
    ...(partial ? ["PARTIAL REFUND, booking still active, slot still held", ""] : ["Full refund, booking cancelled and slot released", ""]),
    `Reference: ${b.reference}`,
    `Name: ${b.firstName} ${b.lastName}`,
    `Email: ${b.email}`,
    `Cell: ${b.phone}`,
    `Package: ${b.productLabel}`,
    ...ds.map((d) => `${LONG[d.day]}: ${friendlyTime(d.time)}`),
    `Amount paid (USD): US$${b.amountUsd}`,
    `Amount refunded (USD): US$${refundedUsd}`,
    `Stripe payment id: ${b.paymentIntentId ?? "not recorded"}`,
    `Booked through: ${b.source}`,
  ];
  return { subject, text: lines.join("\n") };
}
