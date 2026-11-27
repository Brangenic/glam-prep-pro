import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  FACES_SINCE_2017, FACES_FORMATTED, STATS_COUNTED_TO_YEAR,
  NEW_CLIENTS_PER_YEAR, CLIENTS_IN_LATEST_YEAR, STATS_STARTED_YEAR,
  STATS_HEADLINE, STATS_LATEST_YEAR, STATS_HOW_WE_COUNT,
  STATS_LLMS_SECTION, renderStatsHtml,
} from "@/data/glamHubStats";
import { buildKnowledgePack } from "@/data/botKnowledge";
import { ABOUT_PAGE_DESCRIPTION, CARNIVAL_MAKEUP_PAGE_DESCRIPTION, JAMAICA_BEST_PAGE_DESCRIPTION, MIAMI_BEST_PAGE_DESCRIPTION } from "@/data/pageMeta";
import { STATS_SHORT } from "@/data/glamHubStats";
import { DESC_MAX } from "@/lib/metaText";

const read = (path: string) => readFileSync(path, "utf8");
function withoutGeneratedAt(pack: Record<string, unknown>) {
  const { generatedAt, ...facts } = pack;
  return facts;
}
function filesIn(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

describe("owner-confirmed size and annual growth", () => {
  it("counts faces through 2026, not distinct masqueraders", () => {
    expect(FACES_SINCE_2017).toBe(15 * 1000);
    expect(STATS_COUNTED_TO_YEAR).toBe(2026);
    expect(STATS_STARTED_YEAR).toBe(2017);
  });
  it("records about one thousand new clients each year", () => {
    expect(NEW_CLIENTS_PER_YEAR).toBe(1000);
    expect(STATS_HEADLINE).toBe(`More than ${(15 * 1000).toLocaleString("en-GB")} faces since 2017, with about 1,000 new clients every year.`);
  });
  it("records more than one thousand bookings in the latest counted year", () => {
    expect(CLIENTS_IN_LATEST_YEAR).toBe(1000);
    expect(STATS_LATEST_YEAR).toBe("In 2026, more than 1,000 people booked with Carnival Glam Hub.");
  });
  it("includes launches and shoots, and the pre-platform records", () => {
    expect(STATS_HOW_WE_COUNT).toBe("Our count includes Carnival mornings in every territory, band launches and band shoots. Our first seasons, from 2017, were kept in spreadsheets and on our first website, before our current booking platform.");
  });
  it("keeps the short count intact within the metadata length guard", () => {
    for (const text of [ABOUT_PAGE_DESCRIPTION, CARNIVAL_MAKEUP_PAGE_DESCRIPTION, JAMAICA_BEST_PAGE_DESCRIPTION, MIAMI_BEST_PAGE_DESCRIPTION]) {
      expect(text).toContain(STATS_SHORT);
      expect(text.length).toBeLessThanOrEqual(DESC_MAX);
    }
  });
  it("generates crawler HTML and JADE from the same figures", () => {
    const html = renderStatsHtml(read("index.html"));
    // The Organization now has the owner's appointment-only description.
    expect(renderStatsHtml("__GLAM_HUB_STATS_HEADLINE__")).toBe(STATS_HEADLINE);
    expect(html).toContain('"@type": "Organization"');
    expect(html).not.toContain("__GLAM_HUB_STATS_HEADLINE__");
    const knowledge = JSON.stringify(buildKnowledgePack());
    expect(knowledge).toContain(STATS_HEADLINE);
    expect(knowledge).toContain(STATS_LATEST_YEAR);
    expect(knowledge).toContain(STATS_HOW_WE_COUNT);
    expect(withoutGeneratedAt(JSON.parse(read("supabase/functions/chat/knowledge.json")))).toEqual(withoutGeneratedAt({ ...buildKnowledgePack() }));
    expect(read("public/llms.txt")).toContain(STATS_LLMS_SECTION);
  });
  it("rejects hand-typed face counts outside the module and preserved blog content", () => {
    // Retain detection of the original figure even after annual updates.
    const originalFigure = 15 * 1000;
    const literal = new RegExp([FACES_FORMATTED, FACES_SINCE_2017, originalFigure, originalFigure.toLocaleString("en-GB")].join("|"));
    const offenders: string[] = [];
    const blogContent = (path: string) => path.startsWith("src/data/recovered/")
      || path === "src/data/manualBlogPosts.ts"
      // Historical migration contains preserved blog body and blog metadata only.
      || path === "supabase/migrations/20260623222555_5e6e9988-47d4-4f28-bf52-6772ea72f7af.sql";
    for (const path of [...["src", "scripts", "public", "supabase"].flatMap(filesIn), "index.html"]) {
      if (path === "src/data/glamHubStats.ts" || blogContent(path)) continue;
      const buffer = readFileSync(path);
      if (buffer.includes(0)) continue; // Binary assets cannot contain hand-typed prose.
      let text = buffer.toString("utf8");
      // Generated artefacts necessarily contain rendered numbers. Permit only
      // verified generated data, never a blanket exemption for those files.
      if (path === "supabase/functions/chat/knowledge.json") {
        expect(withoutGeneratedAt(JSON.parse(text))).toEqual(withoutGeneratedAt({ ...buildKnowledgePack() }));
        text = "";
      }
      if (path === "public/llms.txt") {
        expect(text).toContain(STATS_LLMS_SECTION);
        text = text.replace(STATS_LLMS_SECTION, "");
      }
      if (literal.test(text)) offenders.push(path);
    }
    expect(offenders).toEqual([]);
  });
});