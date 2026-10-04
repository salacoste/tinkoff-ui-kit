// Forensics round 3: what node is ACTUALLY painted at the bright points?
import { chromium } from 'playwright';

const URL_ = 'http://localhost:6483/iframe.html?id=components-breadcrumb--playground&viewMode=story&globals=theme:dark';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 803 } });
await page.goto(URL_, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const answer = await page.evaluate(() => {
  const points = [[640, 480], [640, 600], [640, 700], [400, 650], [900, 520], [640, 200]];
  return points.map(([x, y]) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return { x, y, hit: 'none' };
    const chain = [];
    let n = el;
    for (let i = 0; n && i < 6; i++) {
      chain.push(`${n.tagName?.toLowerCase?.() ?? n.nodeName}${n.id ? '#' + n.id : ''}${n.className && typeof n.className === 'string' ? '.' + n.className.split(' ').slice(0, 2).join('.') : ''}`);
      n = n.parentElement ?? (n.getRootNode()?.host ?? null);
    }
    const cs = getComputedStyle(el);
    return { x, y, tag: el.tagName.toLowerCase(), id: el.id, cls: String(el.className).slice(0, 60), bg: cs.backgroundColor, zi: cs.zIndex, pos: cs.position, chain };
  });
});
console.log(JSON.stringify(answer, null, 1));
await browser.close();
