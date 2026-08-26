import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fnDir = path.join(root, "supabase", "functions");

const read = (relative: string) => fs.readFileSync(path.join(fnDir, relative), "utf8");

const START = read("glam-match-start/index.ts");
const ANALYZE = read("glam-match-analyze/index.ts");
const GENERATE = read("glam-match-generate/index.ts");
const SHARED = read("_shared/glamMatch.ts");
const CONFIG = fs.readFileSync(path.join(root, "supabase", "config.toml"), "utf8");

const glamMatchFunctionFiles = fs
  .readdirSync(fnDir)
  .filter((name) => name.startsWith("glam-match-"))
  .map((name) => path.join(fnDir, name, "index.ts"))
  .filter((file) => fs.existsSync(file));

describe("glam match edge functions exist and are public", () => {
  it("ships three functions", () => {
    expect(glamMatchFunctionFiles).toHaveLength(3);
  });

  it("runs without a login", () => {
    for (const name of ["glam-match-start", "glam-match-analyze", "glam-match-generate"]) {
      expect(CONFIG).toContain(`[functions.${name}]`);
    }
    const blocks = CONFIG.split("[functions.").filter((b) => b.startsWith("glam-match-"));
    expect(blocks).toHaveLength(3);
    for (const block of blocks) expect(block).toContain("verify_jwt = false");
  });

  it("each function serves POST and handles CORS preflight", () => {
    for (const source of [START, ANALYZE, GENERATE]) {
      expect(source).toContain("Deno.serve");
      expect(source).toContain('req.method === "OPTIONS"');
      expect(source).toContain('req.method !== "POST"');
    }
  });
});

describe("request and response shapes", () => {
  it("start accepts destination_slug, placement and consent", () => {
    expect(START).toContain("const { destination_slug, placement, consent } = body");
  });

  it("start returns lead_id and two signed uploads", () => {
    expect(START).toContain("lead_id: leadId");
    expect(START).toContain("costume_upload");
    expect(START).toContain("selfie_upload");
    expect(START).toContain("createSignedUploadUrl");
    expect(START).toContain(`${"$"}{leadId}/costume.jpg`);
    expect(START).toContain(`${"$"}{leadId}/selfie.jpg`);
  });

  it("analyze takes a lead_id and returns one analysis row", () => {
    expect(ANALYZE).toContain("body?.lead_id");
    expect(ANALYZE).toContain('.from("glam_match_analysis")');
    expect(ANALYZE).toContain("analysis,");
    expect(ANALYZE).toContain("confidence");
  });

  it("analyze survives one failed vision pass and reports low confidence", () => {
    expect(ANALYZE).toContain("analyze.costume_failed");
    expect(ANALYZE).toContain("analyze.selfie_failed");
    expect(ANALYZE).toContain('confidence = costume');
    expect(ANALYZE).toContain('"low"');
  });

  it("generate takes lead_id, styles and look_id", () => {
    expect(GENERATE).toContain("body?.lead_id");
    expect(GENERATE).toContain("body?.styles");
    expect(GENERATE).toContain("body?.look_id");
  });

  it("generate inserts four looks and images only the best match", () => {
    expect(GENERATE).toContain("looks.slice(0, 4)");
    expect(GENERATE).toContain("inserted.find((look) => look.best_match)");
  });

  it("never returns a raw storage path to the browser", () => {
    for (const source of [START, ANALYZE, GENERATE]) {
      expect(source).not.toContain("preview_path: look.preview_path");
    }
    expect(GENERATE).toContain("preview_path: undefined");
    expect(GENERATE).toContain("createSignedUrl");
  });
});

describe("consent gate", () => {
  it("refuses unless consent is exactly true", () => {
    expect(START).toContain("if (consent !== true)");
    const gate = START.slice(START.indexOf("if (consent !== true)"), START.indexOf("const ipHash"));
    expect(gate).toContain("400");
    expect(gate.toLowerCase()).toContain("consent");
  });

  it("stores a hashed IP and never the raw one", () => {
    expect(START).toContain("hashIp");
    expect(START).toContain("ip_hash: ipHash");
    expect(START).not.toMatch(/ip:\s*clientIp/);
    expect(SHARED).toContain("SHA-256");
  });

  it("rate limits leads per hashed IP per day", () => {
    expect(SHARED).toContain("MAX_LEADS_PER_IP_PER_DAY = 5");
    expect(START).toContain("MAX_LEADS_PER_IP_PER_DAY");
    expect(START).toContain("rate_limited: true");
  });
});

describe("generation cap", () => {
  it("caps generated images at three per lead", () => {
    expect(SHARED).toContain("MAX_IMAGES_PER_LEAD = 3");
    expect(GENERATE).toContain("(count ?? 0) < MAX_IMAGES_PER_LEAD");
    expect(GENERATE).toContain("capped: true");
  });

  it("counts only images that were actually created", () => {
    expect(GENERATE).toContain('.eq("event", "generate.image_created")');
  });
});

describe("model configuration", () => {
  it("keeps models overridable by environment variable", () => {
    expect(SHARED).toContain('Deno.env.get("GLAM_MATCH_TEXT_MODEL") ?? "gpt-4o"');
    expect(SHARED).toContain('Deno.env.get("GLAM_MATCH_IMAGE_MODEL") ?? "gpt-image-2"');
    expect(SHARED).toContain('Deno.env.get("GLAM_MATCH_IMAGE_QUALITY") ?? "medium"');
  });

  it("retries once with the offending image parameter stripped", () => {
    expect(GENERATE).toContain("input_fidelity");
    expect(GENERATE).toContain("first.status === 400");
    expect(GENERATE).toContain("delete retryParams[offender]");
    expect(GENERATE).toContain("stripped_param");
    expect(GENERATE).toContain("request_shape");
  });
});

describe("no hardcoded prices, dates or territory names in the glam match functions", () => {
  const territoryWords = [
    "Trinidad",
    "Tobago",
    "Jamaica",
    "Barbados",
    "Antigua",
    "Grenada",
    "Saint Lucia",
    "St Lucia",
    "Miami",
    "Toronto",
    "Guyana",
    "Atlanta",
    "Epic Cruise",
  ];

  const priceLike = /(US\$|USD\s?\d|TT\$|£\s?\d|\$\s?\d)/;
  const dateLike =
    /\b(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)|(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}|\b20\d{2}-\d{2}-\d{2}\b|\b(19|20)\d{2}\b)/;

  // Code comments are engineering notes, never sent to a model or a customer, so
  // they are stripped before the guard runs. Model retirement dates live in comments.
  const stripComments = (code: string) =>
    code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  for (const file of glamMatchFunctionFiles) {
    const source = stripComments(fs.readFileSync(file, "utf8"));
    const label = path.basename(path.dirname(file));

    it(`${label} carries no price`, () => {
      expect(priceLike.test(source)).toBe(false);
    });

    it(`${label} carries no date`, () => {
      expect(dateLike.test(source)).toBe(false);
    });

    it(`${label} carries no territory name`, () => {
      for (const word of territoryWords) {
        expect(source.includes(word)).toBe(false);
      }
    });
  }
});
