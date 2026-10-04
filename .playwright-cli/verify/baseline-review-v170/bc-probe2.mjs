// Forensics round 2: the bright block paints without a background-color —
// walk shadow roots, look for media/background-image elements.
import { chromium } from 'playwright';

const URL_ = 'http://localhost:6483/iframe.html?id=components-breadcrumb--playground&viewMode=story&globals=theme:dark';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 803 } });
await page.goto(URL_, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const report = await page.evaluate(() => {
  const hits = [];
  const walk = (root, depth) => {
    for (const el of root.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      if (['img', 'iframe', 'canvas', 'video', 'svg'].includes(tag)) {
        const r = el.getBoundingClientRect();
        hits.push({ kind: tag, depth, cls: el.className?.baseVal ?? el.className ?? '', w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y) });
      }
      const cs = getComputedStyle(el);
      if (cs.backgroundImage !== 'none') {
        const r = el.getBoundingClientRect();
        hits.push({ kind: 'bg-image', tag, depth, cls: el.className?.toString?.().slice(0, 60) ?? '', w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y), img: cs.backgroundImage.slice(0, 120) });
      }
      if (el.shadowRoot) walk(el.shadowRoot, depth + 1);
    }
  };
  walk(document.body, 0);
  const canvas = document.querySelector('.tkbc-canvas');
  return {
    hits: hits.slice(0, 40),
    childCount: canvas ? canvas.children.length : -1,
    structure: canvas ? [...canvas.children].map((c) => `${c.tagName.toLowerCase()}${c.className ? '.' + c.className : ''}`) : [],
    canvasBg: canvas ? getComputedStyle(canvas).backgroundColor : null,
  };
});
console.log(JSON.stringify(report, null, 1));
await browser.close();
