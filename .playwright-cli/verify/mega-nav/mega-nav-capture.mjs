// Story 7.1 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6015 &
//   node .playwright-cli/verify/mega-nav/mega-nav-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
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

  // The two-deep composition (pattern-header-meganav.png): row 1 = the
  // bank-wide bar with «Инвестиции» active, row 2 = the domain sub-nav
  // with «Каталог» active — the capture's own state.
  await openStory(page, 'components-navbar--mega-nav', dark);
  const el = page.locator('.tkn-canvas tk-navbar').first();
  await el.evaluate(async (node) => node.updateComplete);
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-mega-nav-${suffix}.png` });

  // Geometry read (fed straight into the NOTES probe table): row heights
  // and registers measured on the LIVE kit render, same method as the
  // reference scanlines.
  const geo = await el.evaluate((node) => {
    const bar = node.shadowRoot.querySelector('.bar');
    const inner = node.shadowRoot.querySelector('.bar__inner');
    const subnav = node.shadowRoot.querySelector('.subnav');
    const subInner = node.shadowRoot.querySelector('.subnav__inner');
    const firstRow1Link = node.shadowRoot.querySelector('.link');
    const firstSub = node.shadowRoot.querySelector('.sublink');
    const barRect = bar.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const subRect = subnav.getBoundingClientRect();
    const subInnerRect = subInner.getBoundingClientRect();
    const linkRect = firstRow1Link.getBoundingClientRect();
    const subRectLink = firstSub.getBoundingClientRect();
    return {
      barHeight: barRect.height,
      innerHeight: innerRect.height,
      subnavHeight: subRect.height,
      subnavTop: subRect.top - barRect.top,
      innerLeft: innerRect.left,
      subInnerLeft: subInnerRect.left,
      row1LinkLeft: linkRect.left,
      subLinkLeft: subRectLink.left,
    };
  });
  console.log(`${suffix} geometry:`, JSON.stringify(geo));

  await context.close();
}
await browser.close();
console.log('kit renders written');
