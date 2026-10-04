import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const src = readFileSync("supabase/functions/glam-hub-mcp/index.ts", "utf8");

describe("glam-hub-mcp tools/list annotations", () => {
  it("copies every tool's title into annotations.title", () => {
    expect(src).toMatch(/for \(const t of TOOLS\)[^\n]*annotations = \{ title: t\.title, \.\.\.t\.annotations \}/);
    for (const title of ["Trinidad Carnival 2027 glam options", "Check time slots", "Start a booking", "Booking status"]) {
      expect(src).toContain(`title: "${title}"`);
    }
  });
  it("start_booking stays non read-only and non destructive", () => {
    expect(src).toContain("annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: false }");
  });
  it("never advertises OAuth, the app needs no sign-in", () => {
    expect(src).not.toMatch(/oauth-protected-resource|oauth-authorization-server|WWW-Authenticate/i);
  });
});
