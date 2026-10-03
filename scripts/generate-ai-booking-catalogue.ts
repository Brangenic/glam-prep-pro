// Generates the AI booking app catalogue from src/data. Run on predev and
// prebuild. Never hand-edit supabase/functions/glam-hub-mcp/catalogue.json.
import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { buildAiBookingCatalogue } from "../src/data/aiBookingCatalogue";

const OUT = resolve(process.cwd(), "supabase/functions/glam-hub-mcp/catalogue.json");

try {
  const json = `${JSON.stringify(buildAiBookingCatalogue(), null, 2)}\n`;
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json, "utf8");
  console.log(`[ai-booking-catalogue] wrote ${OUT}`);
} catch (err) {
  console.error("[ai-booking-catalogue] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
}
