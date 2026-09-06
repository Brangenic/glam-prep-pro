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

import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { buildKnowledgePack } from "../src/data/botKnowledge";

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
