// Regenerates files/cv.pdf from the built /cv/ page, so the PDF can never
// drift from the site. Requires Google Chrome (used headlessly via
// playwright-core). Run after `eleventy` — `npm run build` chains both.
import http from "node:http";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const root = process.cwd();
const OUT = path.join(root, "files/cv.pdf");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.join(root, pathname);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

// Any Chromium-family engine will do. Preference order: Playwright's own
// downloadable Chromium (works on any machine/CI after
// `npx playwright install chromium`), then locally installed Chrome/Edge.
async function launchAnyChromium() {
  const attempts = [{}, { channel: "chrome" }, { channel: "msedge" }];
  for (const options of attempts) {
    try {
      return await chromium.launch(options);
    } catch {
      // not available on this machine — try the next one
    }
  }
  return null;
}

try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  const browser = await launchAnyChromium();
  if (!browser) {
    console.warn("[cv-pdf] SKIPPED — no Chromium-family browser found, files/cv.pdf NOT regenerated.");
    console.warn("[cv-pdf] Run `npx playwright install chromium` once on this machine, then `npm run build:pdf`.");
    process.exit(0);
  }
  const page = await browser.newPage();
  // networkidle so the Google Fonts have arrived before rendering
  await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
  await page.pdf({
    path: OUT,
    format: "Letter",
    margin: { top: "0.65in", bottom: "0.65in", left: "0.7in", right: "0.7in" },
    printBackground: true,
  });
  await browser.close();
  console.log(`[cv-pdf] wrote ${path.relative(root, OUT)}`);
} catch (err) {
  console.error("[cv-pdf] FAILED — files/cv.pdf was NOT regenerated:", err.message);
  console.error("[cv-pdf] (run `npm run build:pdf` to retry)");
  process.exitCode = 1;
} finally {
  server.close();
}
