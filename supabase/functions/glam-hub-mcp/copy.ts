// Pure copy helpers for glam-hub-mcp, kept import-free so vitest can test them.
// Before payment the amount is "payable in full now"; "paid in full" is only
// used once payment is confirmed.
export function prePaymentSummary(event: string, label: string, when: string, venue: string, price: number): string {
  return `${event}, ${label}, ${when}, at ${venue}. US$${price}, payable in full now.`;
}

export function startBookingText(summary: string, reference: string, url: string): string {
  return `${summary} Reference ${reference}. Your time is held for 15 minutes. Pay securely here: ${url}`;
}

export function statusSummary(event: string, label: string, amount: number, status: string): string {
  return status === "paid" ? `${event}, ${label}, US$${amount} paid in full.` : `${event}, ${label}, US$${amount}.`;
}

// Friendly refusals from reserve_ai_booking limit codes. Each points to JADE.
export function limitMessage(code: string, whatsapp: string): string | null {
  switch (code) {
    case "IP_LIMIT":
    case "EMAIL_LIMIT":
    case "PHONE_LIMIT":
      return `There have been too many booking attempts from these details just now. Please wait a little and try again, or Talk to JADE on WhatsApp ${whatsapp} and we will help you book.`;
    case "BUSY":
    case "HOARD_TRIPPED":
      return `Online booking is very busy at the moment. Please try again in a few minutes, or Talk to JADE on WhatsApp ${whatsapp} and we will help you book.`;
    default:
      return null;
  }
}
