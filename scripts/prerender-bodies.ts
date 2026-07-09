// Postbuild: snapshots the fully rendered <body> of each public route
// against the built app and writes it back into dist/<route>/index.html.
// This gives non-JS crawlers (GPTBot, PerplexityBot, ClaudeBot, CCBot,
// and older search bots) real visible page content — not just <head>.
//
// Runs AFTER prerender-blog-meta and prerender-routes, so each route
// already has its correct head (title, meta, canonical, og/twitter,
// JSON-LD). We only rewrite the empty `<div id="root"></div>` slot with
// the rendered React tree. Because the app boots with createRoot() (not
// hydrateRoot), the SPA still fully re-renders on load — the static
// tree is simply the pre-hydration snapshot crawlers see.
//
// Failures never block the build (process.exit(0)). If Playwright /
// Chromium is unavailable in the build environment, the script no-ops
// and every route falls back to the head-only prerender behavior.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, join, extname } from "path";
import { createServer } from "http";
import type { AddressInfo } from "net";

const DIST = resolve("dist");

// Routes we snapshot. Blog posts are discovered from dist/blogs/*.
// Intentionally excluded: /auth, /admin, /booking-calculator,
// /booking-confirmed, /thank-you (interactive / auth-gated).
const SNAPSHOT_ROUTES: string[] = [
  "/",
  "/about",
  "/faq",
  "/reviews",
  "/amazon-store",
  "/blogs",
  "/trinidad-carnival-2027",
  "/services/carnival-makeup",
  "/services/carnival-hair",
  "/services/carnival-photoshoot",
  "/services/getting-dressed",
  "/services/carnival-shuttle",
  "/jamaica",
  "/trinidad",
  "/saint-lucia",
  "/grenada",
  "/barbados",
  "/antigua",
  "/miami",
  "/toronto",
  "/guyana",
  "/epic-cruise",
];

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function serveDist(): Promise<{ port: number; close: () => Promise<void> }> {
  return new Promise((resolvePromise, reject) => {
    const server = createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
        // Try direct file
        const direct = join(DIST, urlPath.replace(/^\/+/, ""));
        const directIndex = join(direct, "index.html");
        let filePath: string | null = null;
        if (existsSync(direct) && statSync(direct).isFile()) filePath = direct;
        else if (existsSync(directIndex) && statSync(directIndex).isFile())
          filePath = directIndex;
        else {
          // SPA fallback
          filePath = join(DIST, "index.html");
        }
        const ext = extname(filePath).toLowerCase();
        res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
        res.end(readFileSync(filePath));
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as AddressInfo).port;
      resolvePromise({
        port,
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}

function discoverBlogSlugs(): string[] {
  const blogsDir = join(DIST, "blogs");
  if (!existsSync(blogsDir)) return [];
  return readdirSync(blogsDir).filter((name) => {
    const p = join(blogsDir, name, "index.html");
    return existsSync(p);
  });
}

function replaceRootInHtml(html: string, rootHtml: string): string {
  // Match the empty root div in the built template.
  const rootRe = /<div\s+id="root"[^>]*>\s*<\/div>/i;
  if (rootRe.test(html)) return html.replace(rootRe, rootHtml);
  // Fallback: replace any <div id="root">...</div> block.
  const anyRootRe = /<div\s+id="root"[\s\S]*?<\/div>\s*(?=<script)/i;
  if (anyRootRe.test(html)) return html.replace(anyRootRe, rootHtml + "\n    ");
  return html;
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("prerender-bodies: dist/index.html not found, skipping.");
    return;
  }

  // Load Playwright lazily so a missing/broken chromium doesn't crash import.
  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (err) {
    console.warn("prerender-bodies: playwright not available, skipping.", err);
    return;
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.warn(
      "prerender-bodies: chromium launch failed, skipping full-body prerender.",
      err,
    );
    return;
  }

  const server = await serveDist();
  const origin = `http://127.0.0.1:${server.port}`;
  const blogSlugs = discoverBlogSlugs();
  const routes = [
    ...SNAPSHOT_ROUTES,
    ...blogSlugs.map((slug) => `/blogs/${slug}`),
  ];

  const context = await browser.newContext({
    viewport: { width: 1280, height: 1800 },
    userAgent:
      "Mozilla/5.0 (compatible; CarnivalGlamHubPrerender/1.0; +https://www.carnivalglamhub.com/)",
  });
  // Never let a slow third-party (GTM, pixel, chat) block the snapshot.
  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (
      /googletagmanager\.com|google-analytics\.com|googleadservices\.com|facebook\.net|connect\.facebook|doubleclick\.net|clarity\.ms|hotjar|fullstory/.test(
        url,
      )
    ) {
      return route.abort();
    }
    return route.continue();
  });

  let written = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const page = await context.newPage();
      page.on("pageerror", () => {
        /* ignore — never fail the build on runtime errors */
      });
      await page.goto(`${origin}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 20_000,
      });
      // Wait for React to mount and render real content into #root.
      await page
        .waitForFunction(
          () => {
            const root = document.getElementById("root");
            if (!root) return false;
            const text = (root.textContent || "").trim();
            return text.length > 200 && root.children.length > 0;
          },
          { timeout: 15_000 },
        )
        .catch(() => {
          /* fall through — capture whatever rendered */
        });
      // Give React a beat to finish any pending effects (data fetch,
      // scroll-reveal, images swap) but cap it so builds stay fast.
      await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});

      const rootHtml = await page.evaluate(() => {
        const root = document.getElementById("root");
        return root ? root.outerHTML : "";
      });
      await page.close();

      if (!rootHtml || rootHtml.length < 200) {
        failed++;
        continue;
      }

      // Preserve the head that prerender-routes / prerender-blog-meta
      // already wrote — only swap the empty root div for the rendered
      // tree.
      const targetDir = join(DIST, route.replace(/^\//, ""));
      const targetFile =
        route === "/"
          ? join(DIST, "index.html")
          : join(targetDir, "index.html");
      if (!existsSync(targetFile)) {
        failed++;
        continue;
      }
      const existing = readFileSync(targetFile, "utf8");
      const next = replaceRootInHtml(existing, rootHtml);
      if (next === existing) {
        failed++;
        continue;
      }
      writeFileSync(targetFile, next);
      written++;
    } catch (err) {
      failed++;
      console.warn(`prerender-bodies: ${route} failed:`, (err as Error).message);
    }
  }

  await context.close();
  await browser.close();
  await server.close();

  console.log(
    `prerender-bodies: snapshotted ${written} routes (${failed} skipped) of ${routes.length}.`,
  );
}

main().catch((err) => {
  console.error("prerender-bodies failed:", err);
  process.exit(0); // never block the build
});