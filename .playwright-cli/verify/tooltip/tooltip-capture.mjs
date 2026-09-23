// Story 4.2 kit renders — COMMITTED capture recipe (NOTES.md), the
// select-capture.mjs mold. DERIVED component: no tbank.ru side-by-sides —
// the pattern-consistency bar is the first-approved kit render.
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6015 &
//   node .playwright-cli/verify/tooltip/tooltip-capture.mjs
//
// Pinned capture env identical to the visual suite.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6015;
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

const openStory = async (page, dark) => {
  const params = new URLSearchParams({ id: 'components-tooltip--open', viewMode: 'story' });
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
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();

for (const dark of [false, true]) {
  await openStory(page, dark);
  const geo = await page.evaluate(async () => {
    const tooltip = document.querySelector('main tk-tooltip');
    tooltip.open = false;
    await tooltip.updateComplete;
    tooltip.open = true;
    await tooltip.updateComplete;
    const surface = tooltip.shadowRoot.querySelector('[role="tooltip"]');
    const trigger = tooltip.querySelector('button');
    const s = surface.getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    return {
      x: Math.min(t.left, s.left),
      y: Math.min(t.top, s.top),
      width: Math.max(t.right, s.right) - Math.min(t.left, s.left),
      height: Math.max(t.bottom, s.bottom) - Math.min(t.top, s.top),
    };
  });
  await page.screenshot({
    path: `${OUT}kit-tooltip-open-${dark ? 'dark' : 'light'}.png`,
    clip: {
      x: Math.floor(geo.x - 16),
      y: Math.floor(geo.y - 16),
      width: Math.ceil(geo.width + 32),
      height: Math.ceil(geo.height + 32),
    },
  });
  console.log(`kit-tooltip-open-${dark ? 'dark' : 'light'}.png`, JSON.stringify(geo));
}

await context.close();
await browser.close();
