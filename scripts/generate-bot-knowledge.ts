// Generates the JADE knowledge pack.
//
// Plain Node, run by `bunx tsx` from predev and prebuild, exactly like
// the other scripts in this folder. It imports the composer in
// src/data/botKnowledge.ts, which imports only asset-free data modules,
// and writes pretty-printed JSON to supabase/functions/chat/knowledge.json
// so the edge function can read a single generated view of the same data
// the site renders.
//
// Nothing here may import src/data/destinations.ts, because that module
// imports image assets and cannot be loaded outside Vite.

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { buildKnowledgePack } from "../src/data/botKnowledge";
import { TRINIDAD_DIRECT_LLMS_SECTION } from "../src/data/trinidadPackages";
import { TRINIDAD_HISTORY_SENTENCE, TRINIDAD_PRESS_STORY } from "../src/data/pressCoverage";
import { TRUSTPILOT_PROFILE_URL } from "../src/lib/constants";
import { STATS_LLMS_SECTION } from "../src/data/glamHubStats";

const OUT = resolve(process.cwd(), "supabase/functions/chat/knowledge.json");

function main() {
  const pack = buildKnowledgePack();

  const slugs = Object.keys(pack.territories);
  const missing = slugs.filter((s) => !pack.territories[s].brief?.trim());
  if (missing.length) {
    throw new Error(
      `Territories with an empty brief: ${missing.join(", ")}. Refusing to write knowledge.json.`,
    );
  }

  const json = `${JSON.stringify(pack, null, 2)}\n`;
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json, "utf8");
  const discoveryPath = resolve("public/llms.txt");
  const section = [TRINIDAD_DIRECT_LLMS_SECTION, `## Trustpilot\nCarnival Glam Hub profile: ${TRUSTPILOT_PROFILE_URL}`, `## Trinidad press evidence\n${TRINIDAD_HISTORY_SENTENCE}\n${TRINIDAD_PRESS_STORY ? `${TRINIDAD_PRESS_STORY.outlet}, ${TRINIDAD_PRESS_STORY.publishedDate}: ${TRINIDAD_PRESS_STORY.summary} ${TRINIDAD_PRESS_STORY.url}` : ""}`].join("\n\n");
  const start = "<!-- generated-trinidad-discovery:start -->";
  const end = "<!-- generated-trinidad-discovery:end -->";
  const source = readFileSync(discoveryPath, "utf8");
  const statsStart = "<!-- generated-glam-hub-stats:start -->";
  const statsEnd = "<!-- generated-glam-hub-stats:end -->";
  const existing = source.includes(statsStart)
    ? source.replace(new RegExp(`${statsStart}[\\s\\S]*?${statsEnd}`), STATS_LLMS_SECTION)
    : source.replace("\n\n## Booking and Registration", `\n\n${STATS_LLMS_SECTION}\n\n## Booking and Registration`);
  const generated = `${start}\n${section}\n${end}`;
  writeFileSync(discoveryPath, existing.includes(start) ? existing.replace(new RegExp(`${start}[\\s\\S]*?${end}`), generated) : existing.replace("End of llms.txt body.", `${generated}\n\nEnd of llms.txt body.`));

  console.log(
    `[bot-knowledge] wrote ${OUT} (${Buffer.byteLength(json, "utf8")} bytes)`,
  );
  console.log(
    `[bot-knowledge] territories: ${slugs.length}, events: ${pack.events.length}, topics: ${Object.keys(pack.topics).length}, links: ${pack.links.length}`,
  );
}

try {
  main();
} catch (err) {
  console.error("[bot-knowledge] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
}
