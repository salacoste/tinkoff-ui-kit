// Story 2.4 side-by-side kit renders — COMMITTED capture recipe (NOTES.md).
// Reproduces the evidence in this directory from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6011 &
//   node .playwright-cli/verify/checkbox/checkbox-capture.mjs
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

  // Unchecked + checked — Playground story pinned to the reference
  // composition: 536px width (the capture's line width) and the live consent
  // copy WITH its inline link («выгодные предложения» underlined — the
  // reference's own shape), slotted like the consent story composes it
  // (generated-evidence inline styles on the anchor, the same class of
  // inline styling the overlay controller applies).
  await openStory(page, 'components-checkbox--playground', dark);
  const el = page.locator('main tk-checkbox').first();
  await el.evaluate((node) => {
    node.style.width = '536px';
    node.replaceChildren(
      document.createTextNode(
        'Соглашаюсь получать рекламу про кешбэк, повышенный процент и ',
      ),
    );
    const link = document.createElement('a');
    link.href = '#conditions';
    link.textContent = 'выгодные предложения';
    link.style.color = 'inherit';
    link.style.textDecoration = 'underline';
    node.appendChild(link);
  });
  await page.evaluate(() => document.fonts.ready);
  await el.evaluate(async (node) => node.updateComplete);
  await el.screenshot({ path: `${OUT}kit-checkbox-unchecked-${suffix}.png` });

  // Checked — the CONTROLLED channel (defaultChecked after connect is
  // ignored per the frozen §4 initial-value semantics, so the render pins
  // the state the way a consumer would).
  await el.evaluate(async (node) => {
    node.checked = true;
    await node.updateComplete;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-checkbox-checked-${suffix}.png` });

  // Mixed (indeterminate) — no reference capture exists (the site form has no
  // parent checkbox); rendered for the kit's own record both themes.
  await el.evaluate(async (node) => {
    node.checked = false;
    node.indeterminate = true;
    await node.updateComplete;
  });
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: `${OUT}kit-checkbox-mixed-${suffix}.png` });

  await context.close();
}
await browser.close();
console.log('kit renders written');
