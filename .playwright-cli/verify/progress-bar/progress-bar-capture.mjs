// Story 2.7 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6012 &
//   node .playwright-cli/verify/progress-bar/progress-bar-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6012;
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

  // The reference composition (progress-bar-fill.png, 568×40): host pinned
  // to 568px = the capture's line width, the live label copy «Уже
  // заполнено», value 5 of 0–100 (the capture's ~5% fill).
  await openStory(page, 'components-progressbar--playground', dark);
  const el = page.locator('main tk-progress-bar').first();
  await el.evaluate((node) => {
    node.style.width = '568px';
    node.label = 'Уже заполнено';
    node.value = 5;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.evaluate(async (node) => node.updateComplete);
  await el.screenshot({ path: `${OUT}kit-progress-bar-${suffix}.png` });

  // Indeterminate render for the kit's own record (no reference capture
  // exists — the site form is determinate): static 33% fill under the
  // pinned reduced-motion env.
  await el.evaluate(async (node) => {
    node.indeterminate = true;
    await node.updateComplete;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.evaluate(async (node) => node.updateComplete);
  await el.screenshot({ path: `${OUT}kit-progress-bar-indeterminate-${suffix}.png` });

  await context.close();
}
await browser.close();
console.log('kit renders written');
