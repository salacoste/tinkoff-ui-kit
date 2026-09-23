// Story 4.3 kit renders — COMMITTED capture recipe (NOTES.md), the
// select-capture.mjs mold. DERIVED component: no tbank.ru side-by-sides —
// the pattern-consistency bar is the first-approved kit render.
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6016 &
//   node .playwright-cli/verify/toast/toast-capture.mjs
//
// Pinned capture env identical to the visual suite.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6016;
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
  const params = new URLSearchParams({ id: 'components-toast--stack', viewMode: 'story' });
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
  const geo = await page.evaluate(() => {
    const host = document.getElementById('tk-toast-stack');
    const rect = host.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  await page.screenshot({
    path: `${OUT}kit-toast-stack-${dark ? 'dark' : 'light'}.png`,
    clip: {
      x: Math.floor(geo.x),
      y: Math.floor(geo.y),
      width: Math.ceil(geo.width),
      height: Math.ceil(geo.height),
    },
  });
  console.log(`kit-toast-stack-${dark ? 'dark' : 'light'}.png`, JSON.stringify(geo));
}

await context.close();
await browser.close();
