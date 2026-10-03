// Pure copy helpers for glam-hub-mcp, kept import-free so vitest can test them.
// Before payment the amount is "payable in full now"; "paid in full" is only
// used once payment is confirmed.
export function prePaymentSummary(event: string, label: string, when: string, venue: string, price: number): string {
  return `${event}, ${label}, ${when}, at ${venue}. US$${price}, payable in full now.`;
}

export function startBookingText(summary: string, reference: string, url: string): string {
  return `${summary} Reference ${reference}. Your time is held for 30 minutes. Pay securely here: ${url}`;
}

export function statusSummary(event: string, label: string, amount: number, status: string): string {
  return status === "paid" ? `${event}, ${label}, US$${amount} paid in full.` : `${event}, ${label}, US$${amount}.`;
}
