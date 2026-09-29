// Story 16.6 census probe (orchestrator-owned): measures EVERY live block of
// the reading column vs its bone census counterpart to localize the 30px
// skeleton swap drift. Same env as the walkthrough driver (1280×800, pinned
// fonts). Run: node .playwright-cli/verify/tj-article/probe-census.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const PORT = 6013;
const STORY_ID = 'tj-article-page--page-composition';
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();
const params = new URLSearchParams({ id: STORY_ID, viewMode: 'story' });
await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
await page.waitForFunction(() => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0);
await page.addStyleTag({ content: FONTS_CSS });
await page.evaluate(async () => {
  const loads = [
    ...[400, 700].map((w) => document.fonts.load(`${w} 16px PT Serif`)),
    ...[400, 500, 700].map((w) => document.fonts.load(`${w} 16px Inter`)),
  ];
  await Promise.all(loads);
  await document.fonts.ready;
});

const blockInfo = (el) => {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    tag: el.tagName.toLowerCase() + (el.slot ? `[slot=${el.slot}]` : '') + (el.className && typeof el.className === 'string' ? `.${el.className.split(' ').filter(Boolean).join('.')}` : ''),
    h: Math.round(rect.height * 10) / 10,
    mt: cs.marginTop, mb: cs.marginBottom,
    lines: el instanceof HTMLElement && el.tagName !== 'DIV' ? Math.round(rect.height / parseFloat(cs.lineHeight)) : '',
  };
};

const live = await page.evaluate(() => {
  const blockInfo = (el) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase() + (el.slot ? `[slot=${el.slot}]` : '') + (el.className && typeof el.className === 'string' ? `.${el.className.split(' ').filter(Boolean).join('.')}` : ''),
      h: Math.round(rect.height * 10) / 10,
      mt: cs.marginTop, mb: cs.marginBottom,
      lines: el instanceof HTMLElement && el.tagName !== 'DIV' ? Math.round(rect.height / parseFloat(cs.lineHeight)) : '',
    };
  };
  const out = { article: document.querySelector('#tjart-article').getBoundingClientRect().height, blocks: [] };
  const liveRoot = document.querySelector('.tjart-live');
  for (const child of liveRoot.children) {
    if (child.tagName === 'TJ-PROSE') {
      out.blocks.push({ tag: 'tj-prose', h: Math.round(child.getBoundingClientRect().height), mt: '0', mb: '0' });
      // Slotted flow lives in the light DOM of the host; rects + computed
      // margins reflect the ::slotted cascade exactly.
      for (const pchild of child.children) out.blocks.push(blockInfo(pchild));
    } else {
      out.blocks.push(blockInfo(child));
    }
  }
  return out;
});
console.log('LIVE article height:', Math.round(live.article));
console.table(live.blocks);

await page.locator('#tjart-skeleton-toggle').click();
await page.waitForTimeout(50);
const bones = await page.evaluate(() => {
  const out = { article: document.querySelector('#tjart-article').getBoundingClientRect().height, blocks: [] };
  for (const child of document.querySelector('.tjart-bones').children) {
    if (child.className.includes('tjart-sk-byline')) {
      out.blocks.push({ tag: '.tjart-sk-byline(row)', h: Math.round(child.getBoundingClientRect().height), mt: getComputedStyle(child).marginTop, mb: getComputedStyle(child).marginBottom });
      continue;
    }
    out.blocks.push({
      tag: '.' + child.className,
      h: Math.round(child.getBoundingClientRect().height),
      mt: getComputedStyle(child).marginTop,
      mb: getComputedStyle(child).marginBottom,
    });
  }
  return out;
});
console.log('BONES article height:', Math.round(bones.article));
console.table(bones.blocks);
console.log('DELTA (live - bones):', Math.round(live.article - bones.article));

await browser.close();
