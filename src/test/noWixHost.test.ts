import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import path from "path";
import { DUPLICATE_IMAGE_RE } from "@/lib/duplicateImages";

// Owner rule: nothing on the site loads from or calls the old Wix hosts.
const root = path.resolve(__dirname, "../..");
const HOSTS = ["wix" + "static.com", "wix" + "site.com", "wix" + ".com", "wix" + "mp.com"];
const ROOTS = ["src", "scripts", "public", "supabase/functions"];
// The legacy redirect map holds old slugs only, never a host, but stays exempt.
const EXEMPT = new Set(["src/lib/wixRedirects.ts", "src/test/noWixHost.test.ts"]);
const TEXT = /\.(ts|tsx|js|mjs|cjs|json|md|txt|html|xml|css|toml|svg)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) { if (name !== "node_modules" && name !== "migrations") walk(full, out); }
    else if (TEXT.test(name)) out.push(full);
  }
  return out;
}

describe("no Wix host anywhere in the site source", () => {
  const files = ROOTS.flatMap((r) => walk(path.join(root, r)));
  it("scans a real file set", () => expect(files.length).toBeGreaterThan(100));
  for (const host of HOSTS) {
    it(`no file references ${host}`, () => {
      const hits = files
        .filter((f) => !EXEMPT.has(path.relative(root, f)))
        .filter((f) => readFileSync(f, "utf8").toLowerCase().includes(host));
      expect(hits.map((f) => path.relative(root, f))).toEqual([]);
    });
  }
});

describe("built prerendered HTML references no Wix host", () => {
  const dist = path.join(root, "dist");
  it.skipIf(!existsSync(dist))("no dist HTML file mentions a Wix host", () => {
    const hits = walk(dist).filter((f) => f.endsWith(".html")).filter((f) => {
      const s = readFileSync(f, "utf8").toLowerCase();
      return HOSTS.some((h) => s.includes(h));
    });
    expect(hits.map((f) => path.relative(root, f))).toEqual([]);
  });
});

describe("duplicate legacy preview images collapse to one", () => {
  it("drops the first of an identical adjacent pair, keeping the alt of the second", () => {
    const md = "![](https://x/a.jpg)\\\n![Real alt](https://x/a.jpg)\n\n![b](https://x/b.jpg)";
    expect(md.replace(DUPLICATE_IMAGE_RE, "")).toBe("![Real alt](https://x/a.jpg)\n\n![b](https://x/b.jpg)");
  });
});
