// Probe (a) render-verification (review MAJOR-1) — the discipline that was
// missing from the original probe (a): render the business subheading line in
// the kit-pinned DaytonaSans 400 @ 15px (#333 on white, tests/visual chromium
// flags, DSF 1) and report its width against the capture's measured ink.
// Measures BOTH the shipped reference-verbatim line and the retired invented
// line so the NOTES table carries the full evidence. Usage:
//   node .playwright-cli/verify/batch-10-1-10-2/render-subtitle-verify.mjs
// Writes /tmp/render-mystery/subtitle-verify-{true,invented}.png for ink-bbox
// analysis and prints canvas advance widths.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const FONT = readFileSync(
  new URL('../../../packages/tokens/fonts/DaytonaSans-400.woff2', import.meta.url),
).toString('base64');

const TRUE_LINE =
  'Если у вас не зарегистрирован бизнес, сначала оставьте заявку на регистрацию — поможем бесплатно';
const INVENTED_LINE =
  'Откройте расчетный счет онлайн за 10 минут и получите бесплатно';

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
  white-space: nowrap; }
</style></head><body>
<span id="true"></span><br><span id="invented"></span>
</body></html>`);
await page.evaluate(async ([t, i]) => {
  await document.fonts.load('400 15px DaytonaSans');
  await document.fonts.ready;
  document.getElementById('true').textContent = t;
  document.getElementById('invented').textContent = i;
}, [TRUE_LINE, INVENTED_LINE]);
await page.waitForTimeout(200);

const widths = await page.evaluate(([t, i]) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '400 15px DaytonaSans, sans-serif';
  return {
    trueAdvance: Math.round(ctx.measureText(t).width * 10) / 10,
    inventedAdvance: Math.round(ctx.measureText(i).width * 10) / 10,
    trueLayout: document.getElementById('true').getBoundingClientRect().width,
    inventedLayout: document.getElementById('invented').getBoundingClientRect().width,
  };
}, [TRUE_LINE, INVENTED_LINE]);

await page.locator('#true').screenshot({ path: '/tmp/render-mystery/subtitle-verify-true.png' });
await page.locator('#invented').screenshot({ path: '/tmp/render-mystery/subtitle-verify-invented.png' });
await browser.close();
console.log(JSON.stringify(widths));
console.log('capture ink of the reference line: 729px (glyph-classified, three artifacts agree)');
