// Story 7.4 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6052 &
//   node .playwright-cli/verify/business-landing/business-landing-capture.mjs
//   # then recompose the side-by-sides + probes (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6052;
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

  // The composed story AS SHIPPED — no attribute fiddling, no interaction:
  // this record is about ASSEMBLY (reading order, cluster, wiring), so the
  // resting page is the artifact. Element shots feed the per-cluster
  // side-by-sides; the full-page shot is the whole-composition record.
  const params = new URLSearchParams({
    id: 'showcase-business-landing--business-landing',
    viewMode: 'story',
  });
  if (dark) params.set('globals', 'theme:dark');
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  await pin(page);
  await page.evaluate(() => document.fonts.ready);

  if (!dark) {
    const sections = [
      ['.tkb-hero', 'kit-hero.png'],
      ['.tkb-bento', 'kit-bento.png'],
      ['.tkb-steps', 'kit-steps.png'],
      ['.tkb-form', 'kit-form.png'],
      ['.tkb-footer', 'kit-footer.png'],
    ];
    for (const [selector, name] of sections) {
      await page.locator(selector).screenshot({ path: `${OUT}${name}` });
    }
  }
  await page.screenshot({ path: `${OUT}kit-page-${suffix}.png`, fullPage: true });

  await context.close();
}
await browser.close();
console.log('kit page renders written');
