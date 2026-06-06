#!/usr/bin/env tsx
// Build-time guard: fails the build if robots.txt is tampered with
// or if any robots.txt file leaks into src/.
// To update the locked version: edit public/robots.txt, then update
// LOCKED_SHA256 below to the new sha256 of the file (printed on mismatch).

import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const LOCKED_SHA256 = "ad46cf0392facbe320bb3e6f1031c49b1ee1888ed3f25ba2c9c9fe8a816eaf8e";

const robotsPath = resolve("public/robots.txt");
if (!existsSync(robotsPath)) {
  console.error("[robots-guard] public/robots.txt is missing");
  process.exit(1);
}
const sha = createHash("sha256").update(readFileSync(robotsPath)).digest("hex");

if (process.env.ROBOTS_LOCK_UPDATE === "1") {
  console.log(`[robots-guard] current sha256: ${sha}`);
  console.log("[robots-guard] paste this into LOCKED_SHA256 in scripts/check-robots-lock.ts");
  process.exit(0);
}

if (sha !== LOCKED_SHA256) {
  console.error("[robots-guard] public/robots.txt sha256 mismatch.");
  console.error(`  expected: ${LOCKED_SHA256}`);
  console.error(`  actual:   ${sha}`);
  console.error("  If this change is intentional, run with ROBOTS_LOCK_UPDATE=1 and update LOCKED_SHA256.");
  process.exit(1);
}

// Walk src/ and fail if any robots.txt is present there.
function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (name.toLowerCase() === "robots.txt") out.push(full);
  }
  return out;
}

const leaks = walk(resolve("src"));
if (leaks.length > 0) {
  console.error("[robots-guard] robots.txt must not live in src/. Found:");
  for (const f of leaks) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("[robots-guard] OK");