// Story 2.3 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6011 &
//   node .playwright-cli/verify/select/select-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6011;
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

  // Closed trigger — reference composition: bare 536px field, placeholder.
  await openStory(page, 'components-select--playground', dark);
  const el = page.locator('main tk-select').first();
  await el.evaluate((node) => {
    node.style.width = '536px';
    node.label = '';
    node.placeholder = 'Выберите повышенный кэшбэк (четыре категории)';
  });
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-select-closed-${suffix}.png` });

  // Open menu — same pinned composition; clip = field ∪ controller-mounted
  // panel (top-layer content needs a PAGE-LEVEL screenshot; element shots
  // exclude it — see NOTES "Harness limitation").
  await openStory(page, 'components-select--open', dark);
  const open = page.locator('main tk-select').first();
  await open.evaluate(async (node) => {
    node.style.width = '536px';
    node.label = '';
    node.placeholder = 'Выберите повышенный кэшбэк (четыре категории)';
    await node.updateComplete;
    // The label removal re-laid-out the anchor; positionFloating listens to
    // scroll/resize only — nudge a resize and let its rAF coalescing run.
    window.dispatchEvent(new Event('resize'));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.evaluate(() => document.fonts.ready);
  const clip = await open.evaluate((node) => {
    const root = node.shadowRoot;
    const field = root.querySelector('.field').getBoundingClientRect();
    const panelId = root.querySelector('.field__trigger').getAttribute('aria-controls');
    // The panel lives in the shadow tree; the no-popover fallback path may
    // hold it in the overlay container — look in both.
    const panel = (root.getElementById(panelId) ?? document.getElementById(panelId)).getBoundingClientRect();
    const top = Math.min(field.top, panel.top);
    const left = Math.min(field.left, panel.left);
    const bottom = Math.max(field.bottom, panel.bottom);
    const right = Math.max(field.right, panel.right);
    return { x: Math.floor(left), y: Math.floor(top), width: Math.ceil(right - left), height: Math.ceil(bottom - top) };
  });
  await page.screenshot({ path: `${OUT}kit-select-open-${suffix}.png`, clip });
  await context.close();
}
await browser.close();
console.log('kit renders written');
