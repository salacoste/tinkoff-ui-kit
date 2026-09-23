// Stories 3.10+3.11 composition evidence — COMMITTED capture recipe (NOTES.md).
// Reproduces the per-breakpoint kit renders in this directory from the BUILT
// docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6014 &
//   node .playwright-cli/verify/homepage/homepage-capture.mjs
//   # then recompose the side-by-side (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, DSF 1, reducedMotion reduce,
// colorScheme light, locally-served fonts pinned (tests/visual/fonts.css —
// the same override inject.ts applies). Breakpoints: 1280 (>=1024 full) /
// 900 (768–1023 one-step collapse) / 360 (<768 single column + burger).
// The preview's sticky not-affiliated banner is REMOVED before capture —
// page chrome, not composition (the form captures' own precedent).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PORT = 6014;
// fileURLToPath, not .pathname: percent-encoded directory paths (non-ASCII
// checkouts) break raw pathname use — the harness uses fileURLToPath for
// exactly this (tests/visual/inject.ts).
const OUT = fileURLToPath(new URL('.', import.meta.url));
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');

const pin = async (page) => {
  await page.addStyleTag({ content: FONTS_CSS });
  // fonts.load + fonts.check REFUSAL (the inject.ts contract): fonts.load
  // resolves with zero faces on a 404, so without the check a serve/font
  // failure would silently raster a system font into the evidence PNGs.
  await page.evaluate(async () => {
    const DAYTONA = [400, 500, 600];
    const INTER = [400, 500, 700];
    const load = (family, weights) => weights.map((w) => document.fonts.load(`${w} 16px ${family}`));
    const missing = (family, weights) =>
      weights.filter((w) => !document.fonts.check(`${w} 16px ${family}`));
    await Promise.all([...load('DaytonaSans', DAYTONA), ...load('Inter', INTER)]);
    await document.fonts.ready;
    const missingDaytona = missing('DaytonaSans', DAYTONA);
    if (missingDaytona.length > 0) {
      throw new Error(
        `DaytonaSans weights ${missingDaytona.join(', ')} did not load — is tests/visual/serve.mjs serving packages/tokens/fonts at /daytona? Refusing to capture: the evidence would silently raster a system font.`,
      );
    }
    const missingInter = missing('Inter', INTER);
    if (missingInter.length > 0) {
      throw new Error(
        `Inter weights ${missingInter.join(', ')} (loaded fallback) did not load — is serve.mjs serving @fontsource/inter at /inter? Refusing to capture.`,
      );
    }
  });
};

const openStory = async (page, dark) => {
  const params = new URLSearchParams({ id: 'showcase-homepage--homepage', viewMode: 'story' });
  if (dark) params.set('globals', 'theme:dark');
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  // Capture-side theme assertion (visual.spec.ts's dark-URL lesson): the
  // dark globals param must actually have flipped the preview root BEFORE
  // any dark capture, or dark evidence silently becomes light renders.
  if (dark) {
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== 'dark') {
      throw new Error(
        `dark capture requested but html[data-theme]="${String(theme)}" — refusing to write light renders as dark evidence`,
      );
    }
  }
  await page.evaluate(() => document.querySelector('.tk-docs-disclaimer')?.remove());
  await pin(page);
};

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});

// --- Full composition per breakpoint x theme (the UX-DR14 matrix legs) -------
for (const dark of [false, true]) {
  const suffix = dark ? 'dark' : 'light';
  for (const width of [1280, 900, 360]) {
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    const page = await context.newPage();
    await openStory(page, dark);
    await page.screenshot({ path: `${OUT}homepage-${width}-${suffix}.png`, fullPage: true });
    await context.close();
  }
}

// --- Composition regions at 1280 light (the side-by-side kit column) ---------
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  await openStory(page, false);
  await page.locator('tk-navbar .bar').screenshot({ path: `${OUT}kit-region-navbar.png` });
  await page.locator('.tkh-hero').screenshot({ path: `${OUT}kit-region-hero.png` });
  await page.locator('.tkh-grid').screenshot({ path: `${OUT}kit-region-grid.png` });
  await page.locator('.tkh-strip__panel').screenshot({ path: `${OUT}kit-region-strip.png` });
  await page.locator('tk-footer').screenshot({ path: `${OUT}kit-region-footer.png` });
  await context.close();
}

// --- The open burger drawer at 360 (both themes) ------------------------------
for (const dark of [false, true]) {
  const suffix = dark ? 'dark' : 'light';
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  await openStory(page, dark);
  await page.locator('tk-navbar .burger').click();
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}homepage-360-drawer-${suffix}.png` });
  await context.close();
}

await browser.close();
console.log('homepage composition renders written');
