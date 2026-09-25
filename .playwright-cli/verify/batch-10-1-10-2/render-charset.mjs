// Probe (b) charset render — one span per character (wide margins), so the
// decoder gets clean per-glyph templates with reliable ink boxes.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const FONT = readFileSync(
  new URL('../../../packages/tokens/fonts/DaytonaSans-400.woff2', import.meta.url),
).toString('base64');

const CHARS = process.argv[2];
const OUT = '/tmp/render-mystery';

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
const page = await browser.newPage({ viewport: { width: 3000, height: 220 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><html><head><style>
@font-face { font-family: DaytonaSans; font-style: normal; font-weight: 400;
  src: url(data:font/woff2;base64,${FONT}) format('woff2'); }
body { margin: 0; background: #ffffff; font-family: DaytonaSans, sans-serif;
  font-size: 15px; font-weight: 400; color: #333333; }
div { line-height: 1; padding: 30px 0; }
span { display: inline-block; padding: 0 12px; }
</style></head><body>
<div>${[...CHARS].map((c, i) => `<span id="c${i}">${c}</span>`).join('')}</div>
</body></html>`);
await page.evaluate(async () => {
  await document.fonts.load('400 15px DaytonaSans');
  await document.fonts.ready;
});
await page.waitForTimeout(200);
const boxes = [];
for (let i = 0; i < [...CHARS].length; i++) {
  const el = page.locator(`#c${i}`);
  const box = await el.boundingBox();
  boxes.push({ ch: [...CHARS][i], x: box.x, y: box.y, w: box.width, h: box.height });
}
// one screenshot of the whole strip; python will cut glyphs by span boxes
await page.locator('div').screenshot({ path: `${OUT}/charset.png` });
console.log(JSON.stringify(boxes));
await browser.close();
