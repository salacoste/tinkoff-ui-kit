// Probe (b) render-and-compare helper — renders candidate strings in the
// kit-pinned DaytonaSans 400 @ 15px (#333 on white) with the tests/visual
// chromium flags (--font-render-hinting=none --disable-lcd-text, DSF 1), so
// bitmap reads of the archived invest capture can be settled by glyph-shape
// comparison instead of by eye. Usage:
//   node .playwright-cli/verify/batch-10-1-10-2/render-candidates.mjs "str1" "str2" ...
// Writes /tmp/render-mystery/cand-<i>.png (element shots, padded 10px).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const FONT = readFileSync(
  new URL('../../../packages/tokens/fonts/DaytonaSans-400.woff2', import.meta.url),
).toString('base64');

const candidates = process.argv.slice(2);
const OUT = '/tmp/render-mystery';

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 300 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><html><head><style>
@font-face { font-family: DaytonaSans; font-style: normal; font-weight: 400;
  src: url(data:font/woff2;base64,${FONT}) format('woff2'); }
body { margin: 0; background: #ffffff; }
span { display: inline-block; font-family: DaytonaSans, sans-serif;
  font-size: 15px; font-weight: 400; line-height: 1.5; color: #333333;
  white-space: nowrap; padding: 10px; }
</style></head><body>
${candidates.map((_, i) => `<span id="s${i}"></span>`).join('<br>')}
</body></html>`);
await page.evaluate(async (texts) => {
  await document.fonts.load('400 15px DaytonaSans');
  await document.fonts.ready;
  texts.forEach((t, i) => {
    document.getElementById(`s${i}`).textContent = t;
  });
}, candidates);
await page.waitForTimeout(200);
for (let i = 0; i < candidates.length; i++) {
  await page.locator(`#s${i}`).screenshot({ path: `${OUT}/cand-${i}.png` });
}
await browser.close();
console.log('done');
