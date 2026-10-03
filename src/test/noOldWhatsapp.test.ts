import { it, expect } from "vitest";
import { execSync } from "child_process";
import catalogue from "../../supabase/functions/glam-hub-mcp/catalogue.json";
import { WHATSAPP_URL } from "@/lib/constants";
import { JADE_WHATSAPP } from "../../supabase/functions/_shared/glamHubEmails";

const OLD = ["1876", "8093571"].join("");

it("the retired JADE number appears nowhere in the repo", () => {
  const out = execSync(`git grep -n -I -e ${OLD} -e "876 809 3571" -- . ':!node_modules' || true`, { encoding: "utf8" });
  const rg = execSync(`grep -rIl --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist -e ${OLD} -e "876 809 3571" . || true`, { encoding: "utf8" });
  expect(out.trim() + rg.trim()).toBe("");
});

it("AI booking app uses the site WhatsApp constant", () => {
  expect(catalogue.whatsapp).toBe(WHATSAPP_URL);
  expect(JADE_WHATSAPP).toBe(WHATSAPP_URL);
});
