import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const src = readFileSync("supabase/functions/glam-hub-mcp/index.ts", "utf8");
const toolsBlock = src.slice(src.indexOf("const TOOLS = ["), src.indexOf("// Directory review: annotations.title"));
const descriptions = [...toolsBlock.matchAll(/description:\s*"([^"]*)"/g)].map((m) => m[1]);

describe("glam-hub-mcp tool descriptions are plain facts", () => {
  it("finds every tool and parameter description", () => {
    expect(descriptions.length).toBeGreaterThanOrEqual(6);
  });
  it("contains no instructions aimed at the model", () => {
    for (const d of descriptions) {
      for (const banned of ["Use this", "Always", "Never", "You must", "Give the"]) {
        expect(d.toLowerCase()).not.toContain(banned.toLowerCase());
      }
    }
  });
});
