// Story 2.5 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6011 &
//   node .playwright-cli/verify/segmented-radio/segmented-radio-capture.mjs
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

  // Default composition — the reference's own: «Гражданство РФ?», Да selected
  // (default-value), host pinned to 536px = the reference crop width.
  await openStory(page, 'components-segmentedradio--playground', dark);
  const el = page.locator('main tk-segmented-radio').first();
  await el.evaluate(async (node) => {
    node.style.width = '536px';
    await node.updateComplete;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-segmented-radio-yes-${suffix}.png` });

  // The mirrored state: «Нет» selected (shows the ghost circle on «Да»).
  // Drives the CONTROLLED channel — default-value after connect is ignored
  // per the frozen §4 initial-value semantics (the checkbox capture precedent).
  await el.evaluate(async (node) => {
    node.value = 'no';
    await node.updateComplete;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-segmented-radio-no-${suffix}.png` });
  await context.close();
}
await browser.close();
console.log('kit renders written');
