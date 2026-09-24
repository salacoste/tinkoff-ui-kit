// Story 7.2 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6023 &
//   node .playwright-cli/verify/cookie-banner/cookie-banner-capture.mjs
//   # then recompose the side-by-side (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6023;
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

  // The reference composition (the live DOM snapshot's own copy): the
  // Playground story with its slotted privacy link, default «Хорошо» pill.
  const params = new URLSearchParams({
    id: 'components-cookie-banner--playground',
    viewMode: 'story',
  });
  if (dark) params.set('globals', 'theme:dark');
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  await pin(page);

  // The card is TOP-LAYER promoted — an element screenshot of the host would
  // capture an empty display:contents box, so the capture is PAGE-LEVEL with
  // a clip over the card rect (top-layer pixels land in page screenshots).
  const clip = await page.evaluate(async () => {
    const host = document.querySelector('main tk-cookie-banner');
    if (!host) return null;
    await host.updateComplete;
    const card =
      host.shadowRoot?.querySelector('div') ??
      document.querySelector('#tk-overlay-root > div');
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.x - 8)),
      y: Math.max(0, Math.floor(r.y - 8)),
      width: Math.ceil(r.width + 16),
      height: Math.ceil(r.height + 16),
    };
  });
  if (!clip) throw new Error('cookie card not found');
  await page.screenshot({ path: `${OUT}kit-cookie-banner-${suffix}.png`, clip });

  await context.close();
}
await browser.close();
console.log('kit renders written');
