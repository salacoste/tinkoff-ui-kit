// Story 6.4 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6014 &
//   node .playwright-cli/verify/data-table/data-table-capture.mjs
//   # then crop + recompose (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
//
// CAPTURE MECHANICS (learned the hard way, 6.4): element screenshots of
// content TALLER than the viewport (this table: 56+10×81 ≈ 866px > 800)
// go through Playwright's beyond-viewport path, which leaves the page
// FRACTIONALLY SCROLLED and repaints Storybook's wrapper — the capture
// grows a phantom muted band above the table (verified against live
// computed styles: no element paints it). The suite's own story baselines
// use locator('body') screenshots — stable. This recipe does the same and
// crops deterministically with ImageMagick AFTERWARDS; the crop rects are
// measured at scroll 0 (page coords = image coords).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6014;
const OUT = new URL('.', import.meta.url).pathname;
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');

const pin = async (page) => {
  await page.addStyleTag({ content: FONTS_CSS });
  await page.evaluate(async () => {
    const loads = [
      ...[400, 500, 600].map((w) => document.fonts.load(`${w} 16px DaytonaSans`)),
      ...[400, 500, 700].map((w) => document.fonts.load(`${w} 16px Inter`)),
    ];
    await Promise.all(loads);
    await document.fonts.ready;
  });
};

const openStory = async (page, id, dark) => {
  const params = new URLSearchParams({ id, viewMode: 'story' });
  if (dark) params.set('globals', 'theme:dark');
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  await pin(page);
};

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
for (const dark of [false, true]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const suffix = dark ? 'dark' : 'light';

  // The reference composition (pattern-table-stocks.png): the catalog
  // anatomy — Название/Цена/Изменение, two-line cells, 81px rows, 10 rows.
  await openStory(page, 'components-datatable--playground', dark);
  const el = page.locator('main tk-data-table').first();
  await el.evaluate(async (node) => node.updateComplete);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));

  const rects = await el.evaluate((node) => {
    const round = (n, mode) => Math[mode](n);
    const box = (e) => e.getBoundingClientRect();
    const host = box(node);
    const header = box(node.shadowRoot.querySelector('.row--header'));
    const rows = Array.from(node.shadowRoot.querySelectorAll('.body .row')).slice(0, 3);
    const last = box(rows[rows.length - 1]);
    return {
      table: {
        x: round(host.left, 'floor'),
        y: round(host.top, 'floor'),
        w: round(host.width, 'ceil'),
        h: round(host.height, 'ceil'),
      },
      head3rows: {
        x: round(Math.min(header.left, host.left), 'floor'),
        y: round(header.top, 'floor'),
        w: round(Math.max(header.right, host.right) - Math.min(header.left, host.left), 'ceil'),
        h: round(last.bottom - header.top + 1, 'ceil'),
      },
      headerH: round(header.height, 'round'),
      rowH: round(box(rows[1]).height, 'round'),
    };
  });
  console.log(suffix, JSON.stringify(rects));

  // The suite's own mechanism (visual.spec.ts): a body screenshot stitches
  // taller-than-viewport canvases cleanly; crops happen offline (magick).
  await page.locator('body').screenshot({ path: `${OUT}kit-page-${suffix}.png` });

  await context.close();
}
await browser.close();
console.log('kit pages written (crop offline: see NOTES.md)');
