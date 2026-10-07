import { describe, it, expect } from "vitest";
import { widgetHtml } from "../../supabase/functions/glam-hub-mcp/widget";
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";

describe("AI booking card", () => {
  const html = widgetHtml(buildAiBookingCatalogue());
  it("auto-sizes in MCP Apps hosts and ChatGPT", () => {
    expect(html).toContain("ui/notifications/size-changed");
    expect(html).toContain("ResizeObserver");
    expect(html).toContain("notifyIntrinsicHeight");
  });
  it("runs the MCP Apps handshake and reads tool results", () => {
    expect(html).toContain("ui/initialize");
    expect(html).toContain("ui/notifications/initialized");
    expect(html).toContain("ui/notifications/tool-result");
    expect(html).toContain("ui/notifications/tool-input");
  });
  it("loads its own data when none arrives", () => {
    expect(html).toContain("check_slot_availability");
    expect(html).toContain("get_trinidad_glam_options");
  });
  it("never says paid before payment, and has no em dash", () => {
    expect(html).toContain("Payable in full at booking");
    expect(html).not.toMatch(/paid in full/i);
    expect(html).not.toContain("\u2014");
  });
});

describe("AI booking card photos, rating and gallery", () => {
  const html = widgetHtml(buildAiBookingCatalogue());
  it("shows lazy photos that resize the card and hide on error", () => {
    expect(html).toContain('loading="lazy"');
    expect(html).toContain("im.onload");
    expect(html).toContain("im.onerror");
  });
  it("reads the rating from the catalogue, not hardcoded markup", () => {
    expect(html).toContain('" on Google, "');
    expect(html).not.toMatch(/4\.8 on Google/);
    expect(html.toLowerCase()).not.toContain("verified");
    expect(html).toContain("See our Gallery");
    expect(html).not.toContain("\u2014");
  });
});
