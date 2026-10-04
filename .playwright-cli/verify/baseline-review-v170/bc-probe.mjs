// One-off DOM forensics: identify the bright block in the breadcrumb
// playground dark baseline (read-only; serves no gate).
import { chromium } from 'playwright';

const URL_ = 'http://localhost:6483/iframe.html?id=components-breadcrumb--playground&viewMode=story&globals=theme:dark';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 803 } });
await page.goto(URL_, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const bright = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const m = cs.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) continue;
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    if (r > 240 && g > 240 && b > 240) {
      const rect = el.getBoundingClientRect();
      if (rect.width * rect.height > 20000) {
        out.push({
          tag: el.tagName.toLowerCase(), cls: el.className?.toString?.().slice(0, 80) ?? '',
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          bg: cs.backgroundColor, color: cs.color,
          text: (el.textContent ?? '').replace(/\s+/g, ' ').slice(0, 90),
        });
      }
    }
  }
  return out;
});
console.log('theme:', theme, '| body bg:', bodyBg);
console.log('bright elements (bg>240, area>20k):');
for (const b of bright) console.log(JSON.stringify(b));
await page.screenshot({ path: '/tmp/bc-dark-live.png', fullPage: true });
await browser.close();
