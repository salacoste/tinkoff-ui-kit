// Stories 3.6–3.9 card-family kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6012 &
//   node .playwright-cli/verify/<dir>/<dir>-capture.mjs
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

/**
 * LIVE DARK-PILL ASSERTION (review finding 1): on the theme-invariant
 * charcoal, the slotted tk-button secondary's pill must stay WHITE with
 * INK text in BOTH themes — the dark layer's surface-base (#1A1A1A) is
 * re-scoped to the --tk-<name>-cta-fill hook inside the actions zone.
 * Computed in real Chromium; a non-white pill FAILS the recipe (exit 1).
 */
const assertCtaPill = async (page, dark, cardSelector) => {
  const button = page.locator(`${cardSelector} tk-button`).first();
  await button.evaluate(async (node) => node.updateComplete);
  const { pillFill, label } = await button.evaluate((node) => {
    const inner = node.shadowRoot.querySelector('.button');
    return {
      pillFill: getComputedStyle(inner, '::before').backgroundColor,
      label: getComputedStyle(inner).color,
    };
  });
  if (dark) {
    const ok = /rgb\(255, 255, 255\)|#fff/.test(pillFill) || /rgb\(255, 255, 255\)|#fff/.test(fill);
    if (!ok) throw new Error(`dark CTA pill is NOT white: ::before ${pillFill} / bg ${fill}`);
    if (!/rgb\(51, 51, 51\)|#333/.test(label)) throw new Error(`dark CTA label is NOT ink: ${label}`);
    console.log(`dark CTA pill: ${pillFill}, label ${label} — OK`);
  }
};

/** One card suite: light + dark kit renders of the Playground story. */
const capture = async (browser, { story, selector, file, ctaCard, ctaStory }) => {
  for (const dark of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    const page = await context.newPage();
    const suffix = dark ? 'dark' : 'light';
    await openStory(page, story, dark);
    const target = page.locator(selector).first();
    await target.evaluate(async (node) => node.updateComplete);
    await page.evaluate(() => document.fonts.ready);
    await target.screenshot({ path: `${OUT}${file}-${suffix}.png` });
    if (ctaCard && dark) {
      // The charcoal/editorial card may live in another story — open it and
      // run the live computed assertion there.
      if (ctaStory) {
        await openStory(page, ctaStory, dark);
        await page.locator(ctaCard).first().evaluate(async (node) => node.updateComplete);
      }
      await assertCtaPill(page, dark, ctaCard);
    }
    await context.close();
  }
};

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
const suites = JSON.parse(readFileSync(new URL('./suites.json', import.meta.url), 'utf8'));
for (const suite of suites) await capture(browser, suite);
await browser.close();
console.log('kit renders written');
