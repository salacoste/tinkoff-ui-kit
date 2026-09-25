// Story 9.1 — tooltip Placements pill-cap probe (2026-09-25).
//
// The Placements story's four pinned-open pills now carry RU content long
// enough to hit the pill max-width cap `calc(var(--tk-space-48) * 6)` (288px),
// pinning pill GEOMETRY instead of text advance — the structural fix that
// retires the CI_VISUAL_TOLERANCE entry for that story (visual.spec.ts).
// This probe proves the cap is hit: each pill's bounding width must equal
// 288 EXACTLY, ×4, in the built docs bundle.
//
// Mold: the business-landing capture recipe — the harness's own static server
// (tests/visual/serve.mjs) on a PRIVATE port (not the machine-global 6007),
// pinned chromium flags --font-render-hinting=none --disable-lcd-text,
// 1280×800 DSF 1.
//
// Run: node .playwright-cli/verify/tokens-9-1/probe-tooltip-cap.mjs

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..');
const PORT = 6191; // private probe port; the visual suite's 6007 stays untouched

const server = spawn('node', [resolve(REPO_ROOT, 'tests/visual/serve.mjs'), String(PORT)], {
  stdio: 'ignore',
});
await new Promise((resolveListen, rejectListen) => {
  const poll = setInterval(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/index.json`);
      if (res.ok) {
        clearInterval(poll);
        resolveListen();
      }
    } catch {
      // not up yet
    }
  }, 150);
  setTimeout(() => {
    clearInterval(poll);
    rejectListen(new Error('probe server did not come up on port 6191'));
  }, 10_000);
});

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const url = `http://127.0.0.1:${PORT}/iframe.html?id=components-tooltip--placements&viewMode=story`;
await page.goto(url);
await page.waitForFunction(
  () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  undefined,
  { timeout: 15_000 },
);
await page.waitForTimeout(400); // overlay mount + fade settle (150ms fast token)

const rows = await page.evaluate(() => {
  // The pill is the generated surface div[role="tooltip"] (own shadow root;
  // max-width lives on its :host). The overlay controller may reparent it —
  // query document-wide, keyed by each tooltip host's placement.
  const hosts = [...document.querySelectorAll('tk-tooltip')];
  return hosts.map((host) => {
    const surface = host.shadowRoot?.querySelector('div[role="tooltip"]') ?? null;
    const rect = surface?.getBoundingClientRect();
    return {
      placement: host.getAttribute('placement'),
      width: rect ? Math.round(rect.width * 100) / 100 : null,
      height: rect ? Math.round(rect.height * 100) / 100 : null,
      visible: surface ? !surface.hidden : false,
    };
  });
});

console.log('tooltip Placements pill-cap probe — built docs bundle (DSF 1, pinned chromium flags)');
console.log('='.repeat(78));
console.log(`story: ${url}`);
console.log(`cap token: max-width: calc(var(--tk-space-48) * 6) = 288px`);
for (const row of rows) {
  console.log(
    `  placement=${String(row.placement).padEnd(6)} visible=${row.visible}  pill ${row.width} x ${row.height}`,
  );
}
const widths = rows.map((r) => r.width);
const allCapped =
  rows.length === 4 && widths.every((w) => w === 288);
console.log('-'.repeat(78));
console.log(
  allCapped
    ? 'VERDICT: all 4 pills measure exactly 288px — the max-width cap pins geometry (CI tolerance retirement is structural).'
    : `VERDICT: NOT all pills at the 288 cap (widths: ${widths.join(', ')}) — investigate before retiring the tolerance.`,
);

await browser.close();
server.kill();
