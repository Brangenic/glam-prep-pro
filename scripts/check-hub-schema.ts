import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { assertAppointmentOnlyMarkup } from "../src/lib/hubSchemaGuard";
function check(dir: string): number {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) count += check(path);
    else if (entry.name.endsWith(".html")) { assertAppointmentOnlyMarkup(readFileSync(path, "utf8"), path); count++; }
  }
  return count;
}
console.log(`Appointment-only markup verified in ${check("dist")} HTML files.`);