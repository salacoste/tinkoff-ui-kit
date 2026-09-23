// Story 3.6 CORRECTED-TINT PROOF — mint/beige kit card crops + computed styles.
// Same pinned env as the capture recipe; writes tint-mint-kit.png / tint-beige-kit.png
// and prints the computed backgrounds for the NOTES probe table.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6012;
const OUT = new URL('.', import.meta.url).pathname;
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();
const params = new URLSearchParams({ id: 'components-promocard--variants', viewMode: 'story' });
await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
await page.waitForFunction(() => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0);
await page.addStyleTag({ content: FONTS_CSS });
await page.evaluate(() => document.fonts.ready);
const cards = page.locator('main section:has(h2:text("Все тона")) tk-promo-card');
await cards.first().evaluate(async (node) => node.updateComplete);
const count = await cards.count();
for (let i = 0; i < count; i += 1) {
  const card = cards.nth(i);
  const variant = await card.getAttribute('variant');
  const bg = await card.evaluate((node) => getComputedStyle(node.shadowRoot.querySelector('.card')).backgroundColor);
  if (variant === 'mint' || variant === 'beige') {
    await card.screenshot({ path: `${OUT}tint-${variant}-kit.png` });
    console.log(`${variant}: computed bg ${bg}`);
  }
}
await context.close();
await browser.close();
