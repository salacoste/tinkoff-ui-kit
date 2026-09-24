// Story 6.3 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6020 &
//   node .playwright-cli/verify/combobox-search/combobox-search-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
//
// The CLOSED field render paints the story canvas surface-muted first: the
// field is BORDERLESS surface-base, so on the default surface-base canvas
// its box would be invisible to pixels — the reference register is the
// field on a #F6F7F8-muted canvas (reference-measurements.md). The OPEN
// render comes from the «Открытое меню» story (its TypeOnMount directive
// drives the REAL typing path on mount), captured PAGE-LEVEL with a clip so
// the top-layer panel pixels are included (the same rule as
// tests/visual/combobox-search.spec.ts).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6020;
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

  // CLOSED field (Playground) on a muted canvas — the reference register:
  // nothing focuses the control, so no :focus-within ring paints.
  await openStory(page, 'components-comboboxsearch--playground', dark);
  await page.evaluate(() => {
    document.querySelector('main').style.background = 'var(--tk-color-surface-muted)';
  });
  await page.evaluate(() => document.fonts.ready);
  const field = page.locator('main tk-combobox-search').first();
  await field.evaluate(async (node) => node.updateComplete);
  await field.screenshot({ path: `${OUT}kit-combobox-search-${suffix}.png` });

  // OPEN panel (the «Открытое меню» story — TypeOnMount types 'н' on mount:
  // Сбербанк, Норникель, Яндекс, Т-Технологии, Роснефть). Geometry is logged
  // as ground-truth numbers for NOTES.md (field/panel boxes, row height,
  // matchAnchorWidth equality) alongside the pixel probes.
  await openStory(page, 'components-comboboxsearch--open', dark);
  await page.waitForFunction(() => {
    const host = document.querySelector('main tk-combobox-search');
    const control = host?.shadowRoot?.querySelector('.field__control');
    return control?.getAttribute('aria-expanded') === 'true';
  });
  const geo = await page.evaluate(async () => {
    const host = document.querySelector('main tk-combobox-search');
    await host.updateComplete;
    const root = host.shadowRoot;
    const control = root.querySelector('.field__control');
    const fieldBox = root.querySelector('.field').getBoundingClientRect();
    // Both-trees lookup: popover path keeps the panel in the shadow tree,
    // container fallback re-homes it into #tk-overlay-root (happy-dom mold).
    const id = control.getAttribute('aria-controls');
    const panel = root.getElementById(id) ?? document.getElementById(id);
    const rect = panel.getBoundingClientRect();
    const rows = [...panel.querySelectorAll('[role="option"]:not([aria-disabled])')];
    const rowRects = rows.slice(0, 2).map((row) => row.getBoundingClientRect());
    const box = (r) => ({
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
    });
    return {
      field: box(fieldBox),
      panel: box(rect),
      rows: rows.length,
      rowHeight: rowRects.length === 2 ? Math.round(rowRects[1].y - rowRects[0].y) : null,
      firstRow: rowRects[0] ? box(rowRects[0]) : null,
      widthMatch: Math.abs(rect.width - fieldBox.width) < 0.5,
      gapFieldToPanel: Math.round(rect.top - fieldBox.bottom),
      status: root.querySelector('.status')?.textContent ?? '',
    };
  });
  console.log(`${suffix}: ${JSON.stringify(geo)}`);
  const clip = {
    x: Math.max(0, Math.floor(Math.min(geo.field.x, geo.panel.x)) - 8),
    y: Math.max(0, Math.floor(Math.min(geo.field.y, geo.panel.y)) - 8),
    width: Math.ceil(Math.max(geo.field.x + geo.field.w, geo.panel.x + geo.panel.w) - Math.min(geo.field.x, geo.panel.x)) + 16,
    height: Math.ceil(Math.max(geo.field.y + geo.field.h, geo.panel.y + geo.panel.h) - Math.min(geo.field.y, geo.panel.y)) + 16,
  };
  await page.waitForTimeout(150); // let the top-layer promotion settle
  await page.screenshot({ path: `${OUT}kit-menu-open-${suffix}.png`, clip });

  await context.close();
}
await browser.close();
console.log('kit renders written');
