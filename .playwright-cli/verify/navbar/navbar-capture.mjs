// Story 3.4 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6012 &
//   node .playwright-cli/verify/navbar/navbar-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1 (desktop) /
// 360×667 DSF 1 (mobile — the reference capture's CSS width), reducedMotion
// reduce, colorScheme light, locally-served fonts pinned
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

// --- Desktop (1280×800): the bar, at-rest and past the scroll threshold ------
for (const dark of [false, true]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const suffix = dark ? 'dark' : 'light';
  await openStory(page, 'components-navbar--playground', dark);
  const navbar = page.locator('main tk-navbar, .tkn-canvas tk-navbar').first();
  await navbar.evaluate(async (node) => node.updateComplete);
  await page.evaluate(() => document.fonts.ready);
  const bar = navbar.locator('.bar');
  await bar.screenshot({ path: `${OUT}kit-navbar-${suffix}.png` });

  // Past the 10px threshold: data-scrolled flips, shadow + hairline fade in
  // (0ms under the pinned reduce preference — the deterministic state). The
  // story canvas is shorter than the viewport — a spacer makes the page
  // scrollable so scrollTo can actually move.
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.setAttribute('data-capture-spacer', '');
    spacer.style.height = '1600px';
    document.body.appendChild(spacer);
  });
  await page.evaluate(() => window.scrollTo(0, 120));
  await navbar.evaluate(async (node) => node.updateComplete);
  await bar.screenshot({ path: `${OUT}kit-navbar-scrolled-${suffix}.png` });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector('[data-capture-spacer]')?.remove();
  });
  await context.close();
}

// --- Mobile (360×667): the burger bar + the open drawer ----------------------
// 360 CSS px = the reference mobile capture's CSS width (1080 @DPR3).
for (const dark of [false, true]) {
  const context = await browser.newContext({
    viewport: { width: 360, height: 667 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const suffix = dark ? 'dark' : 'light';
  await openStory(page, 'components-navbar--playground', dark);
  const navbar = page.locator('.tkn-canvas tk-navbar').first();
  await navbar.evaluate(async (node) => node.updateComplete);
  await page.evaluate(() => document.fonts.ready);
  const bar = navbar.locator('.bar');
  await bar.screenshot({ path: `${OUT}kit-navbar-mobile-${suffix}.png` });

  // The open drawer through the element's own pipeline (burger click).
  await navbar.evaluate((node) => {
    node.shadowRoot?.querySelector('.burger')?.click();
  });
  await navbar.evaluate(async (node) => node.updateComplete);
  await page.waitForTimeout(50);
  await navbar.locator('.drawer').screenshot({ path: `${OUT}kit-navbar-drawer-${suffix}.png` });
  await context.close();
}

await browser.close();
console.log('kit renders written');
