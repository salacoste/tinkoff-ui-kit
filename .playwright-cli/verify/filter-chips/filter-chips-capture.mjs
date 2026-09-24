// Story 6.2 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6013 &
//   node .playwright-cli/verify/filter-chips/filter-chips-capture.mjs
//   # then recompose the side-by-sides (ImageMagick) per NOTES.md
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6013;
const OUT = new URL('.', import.meta.url).pathname;
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');

/** The reference's own catalog (invest/stocks, NOTES.md §D) — 10 items. */
const CATALOG = [
  { value: 'what-to-buy', label: 'Что купить' },
  { value: 'stocks', label: 'Акции' },
  { value: 'currency', label: 'Валюта' },
  { value: 'funds', label: 'Фонды' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'futures', label: 'Фьючерсы' },
  { value: 'options', label: 'Опционы' },
  { value: 'strategies', label: 'Стратегии' },
  { value: 'indexes', label: 'Индексы' },
  { value: 'favorites', label: 'Избранное' },
];

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

  // The reference composition (pattern-catalog-filters.png row strip): the
  // catalog's own 10 items, 7 visible + «Ещё», «Акции» selected — the yellow
  // 2px border on white fill.
  await openStory(page, 'components-filterchips--playground', dark);
  const el = page.locator('main tk-filter-chips').first();
  await el.evaluate(async (node, items) => {
    node.items = items;
    node.value = 'stocks';
    await node.updateComplete;
  }, CATALOG);
  await page.evaluate(() => document.fonts.ready);
  const row = el.locator('.row');
  await row.screenshot({ path: `${OUT}kit-filterchips-${suffix}.png` });

  // The open «Ещё» menu — the interaction mount path (ArrowDown on the
  // chip), page-level clip so the top-layer panel pixels are included (the
  // same rule as tests/visual/filter-chips.spec.ts).
  if (!dark) {
    await el.evaluate(async (node) => {
      const more = node.shadowRoot.querySelector('.chip--more');
      more.focus();
      more.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
      await node.updateComplete;
    });
    const geo = await el.evaluate((node) => {
      const more = node.shadowRoot.querySelector('.chip--more');
      const chipRect = more.getBoundingClientRect();
      const panel = node.shadowRoot.getElementById(more.getAttribute('aria-controls'));
      const rect = panel.getBoundingClientRect();
      return {
        x: Math.floor(Math.min(chipRect.left, rect.left)) - 8,
        y: Math.floor(Math.min(chipRect.top, rect.top)) - 8,
        width: Math.ceil(Math.max(chipRect.right, rect.right) - Math.min(chipRect.left, rect.left)) + 16,
        height: Math.ceil(Math.max(chipRect.bottom, rect.bottom) - Math.min(chipRect.top, rect.top)) + 16,
      };
    });
    await page.waitForTimeout(150); // let the chevron rotation settle
    await page.screenshot({ path: `${OUT}kit-menu-open-${suffix}.png`, clip: geo });
  }

  await context.close();
}
await browser.close();
console.log('kit renders written');
