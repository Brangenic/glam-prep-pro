#!/usr/bin/env tsx
// Build-time guard: fails the build if robots.txt is tampered with
// or if any robots.txt file leaks into src/.
// To update the locked version: edit public/robots.txt, then update
// LOCKED_SHA256 below to the new sha256 of the file (printed on mismatch).

import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const LOCKED_SHA256 = "e6e9c6e0cf2e3a8f6a4d2f6f8f3a1e5d3b9c7e1f4a6b2c8d0e7f9a3b5c1d2e4f"; // placeholder updated on first run

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