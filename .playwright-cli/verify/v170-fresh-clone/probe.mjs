// Flow-B §14.4 probe — v1.7.0 fresh-clone consumer (RELEASE.md §14.4).
// Verifies tk-chart / tk-breadcrumb / tk-figure, raw AND React-wrapped,
// both themes, console-zero. Run from the kit repo: node .playwright-cli/verify/v170-fresh-clone/probe.mjs <url>
import { chromium } from 'playwright';

const PAGE_URL = process.argv[2];
if (!PAGE_URL) { console.error('usage: probe.mjs <url>'); process.exit(2); }

const results = [];
const leg = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(300); // custom-elements upgrade + firstUpdated sweeps

// ── 1. chart-raw (tone=bond, badge, reference) ─────────────────────────────
const chartRaw = page.locator('#chart-raw');
leg('chart-raw: host role=img', await chartRaw.evaluate((el) => el.getAttribute('role')) === 'img', 'role attr');
leg('chart-raw: aria-label derived (NBSP + RU comma)', await chartRaw.evaluate((el) => el.getAttribute('aria-label')) === 'График, 5 точек, последнее значение 20 235 500,5', JSON.stringify(await chartRaw.evaluate((el) => el.getAttribute('aria-label'))));
leg('chart-raw: tone attribute reflected', await chartRaw.evaluate((el) => el.getAttribute('tone')) === 'bond', 'tone=bond');
const chartRawFacts = await chartRaw.evaluate((el) => {
  const svg = el.shadowRoot.querySelector('svg');
  const stops = [...el.shadowRoot.querySelectorAll('.chart__stop-a, .chart__stop-b')].map((s) => getComputedStyle(s).stopColor);
  const yItems = [...el.shadowRoot.querySelectorAll('.chart__y-item')].map((s) => s.textContent);
  const badge = el.shadowRoot.querySelector('.chart__badge');
  return {
    hasArea: !!svg.querySelector('path.chart__area'),
    hasLine: !!svg.querySelector('path.chart__line'),
    gridCount: svg.querySelectorAll('line.chart__grid').length,
    hasReference: !!svg.querySelector('line.chart__reference'),
    stops, yItems,
    badgeText: badge?.textContent ?? null,
    xItems: [...el.shadowRoot.querySelectorAll('.chart__x-item')].map((s) => s.textContent),
  };
});
leg('chart-raw: series area+line paths', chartRawFacts.hasArea && chartRawFacts.hasLine, `area=${chartRawFacts.hasArea} line=${chartRawFacts.hasLine}`);
leg('chart-raw: quiet grid (inner lines ≥1)', chartRawFacts.gridCount >= 1, `grid lines=${chartRawFacts.gridCount}`);
leg('chart-raw: dashed reference inside domain', chartRawFacts.hasReference, 'reference line present');
leg('chart-raw: bond gradient stops resolve (invest identity)', chartRawFacts.stops[0] === 'rgb(0, 158, 77)' && chartRawFacts.stops[1] === 'rgb(0, 129, 62)', JSON.stringify(chartRawFacts.stops));
leg('chart-raw: y-axis abbreviates (млн, NBSP, RU comma)', chartRawFacts.yItems.every((t) => /млн|тыс\./.test(t)) && chartRawFacts.yItems.some((t) => t.includes(',') || t.includes(' ')), JSON.stringify(chartRawFacts.yItems));
leg('chart-raw: badge = full-precision last value', chartRawFacts.badgeText === '20 235 500,5', JSON.stringify(chartRawFacts.badgeText));
leg('chart-raw: x labels from data', chartRawFacts.xItems.length >= 2 && chartRawFacts.xItems[0] === 'июл', JSON.stringify(chartRawFacts.xItems));

// ── 2. crumb-raw ───────────────────────────────────────────────────────────
const crumbRaw = page.locator('#crumb-raw');
const crumbRawFacts = await crumbRaw.evaluate((el) => {
  const nav = el.shadowRoot.querySelector('nav.breadcrumb');
  const lis = [...el.shadowRoot.querySelectorAll('li.breadcrumb__item')];
  const links = lis.map((li) => li.querySelector('a.breadcrumb__link')).filter(Boolean);
  const seps = [...el.shadowRoot.querySelectorAll('.breadcrumb__separator')];
  const current = el.shadowRoot.querySelector('.breadcrumb__current');
  return {
    navLabel: nav?.getAttribute('aria-label'),
    hasOl: !!el.shadowRoot.querySelector('ol.breadcrumb__list'),
    liCount: lis.length,
    linkCount: links.length,
    hrefs: links.map((a) => a.getAttribute('href')),
    sepCount: seps.length,
    sepsHidden: seps.every((s) => s.getAttribute('aria-hidden') === 'true'),
    currentText: current?.textContent,
    currentAttr: current?.getAttribute('aria-current'),
    terminalIsAnchor: !!lis.at(-1).querySelector('a'),
  };
});
leg('crumb-raw: nav landmark + accessible name', crumbRawFacts.navLabel === 'Хлебные крошки' && crumbRawFacts.hasOl, `label=${JSON.stringify(crumbRawFacts.navLabel)}`);
leg('crumb-raw: nav > ol > 3 li', crumbRawFacts.liCount === 3 && crumbRawFacts.hasOl, `li=${crumbRawFacts.liCount}`);
leg('crumb-raw: 2 anchor stops, hrefs from data', crumbRawFacts.linkCount === 2 && crumbRawFacts.hrefs[0] === '#invest', JSON.stringify(crumbRawFacts.hrefs));
leg('crumb-raw: chevrons aria-hidden ×2', crumbRawFacts.sepCount === 2 && crumbRawFacts.sepsHidden, `seps=${crumbRawFacts.sepCount} hidden=${crumbRawFacts.sepsHidden}`);
leg('crumb-raw: terminal aria-current="page", never an anchor', crumbRawFacts.currentAttr === 'page' && !crumbRawFacts.terminalIsAnchor, `current=${JSON.stringify(crumbRawFacts.currentText)} aria-current=${crumbRawFacts.currentAttr}`);

// ── 3. figure-raw ──────────────────────────────────────────────────────────
const figureRaw = page.locator('#figure-raw');
const figureRawFacts = await figureRaw.evaluate((el) => {
  const img = el.querySelector('img[slot="media"]');
  const media = el.shadowRoot.querySelector('.figure__media');
  const caption = el.shadowRoot.querySelector('figcaption.figure__caption');
  const r = media.getBoundingClientRect();
  return {
    loading: img?.getAttribute('loading'),
    decoding: img?.getAttribute('decoding'),
    ratio: r.width / r.height,
    captionText: caption?.textContent?.trim() ?? null,
  };
});
leg('figure-raw: lazy enforcement (img loading=lazy + decoding=async)', figureRawFacts.loading === 'lazy' && figureRawFacts.decoding === 'async', `loading=${figureRawFacts.loading} decoding=${figureRawFacts.decoding}`);
leg('figure-raw: aspect hook 16/9', Math.abs(figureRawFacts.ratio - 16 / 9) < 0.02, `ratio=${figureRawFacts.ratio.toFixed(3)}`);
leg('figure-raw: caption presence', figureRawFacts.captionText === 'Кадр из обзора эмитента', JSON.stringify(figureRawFacts.captionText));

// ── 4. React wrappers — props survive element creation ─────────────────────
const chartReact = page.locator('#chart-react');
const chartReactFacts = await chartReact.evaluate((el) => {
  const svg = el.shadowRoot.querySelector('svg');
  return {
    tone: el.getAttribute('tone'),
    aria: el.getAttribute('aria-label'),
    hasSeries: !!svg?.querySelector('path.chart__line'),
    yItems: [...el.shadowRoot.querySelectorAll('.chart__y-item')].map((s) => s.textContent),
    badge: el.shadowRoot.querySelector('.chart__badge')?.textContent ?? null,
  };
});
leg('chart-react: points prop survived (series rendered)', chartReactFacts.hasSeries, 'path.chart__line present');
leg('chart-react: tone prop reflected', chartReactFacts.tone === 'stock', `tone=${chartReactFacts.tone}`);
leg('chart-react: derived aria-label', chartReactFacts.aria === 'График, 5 точек, последнее значение 20 235 500,5', JSON.stringify(chartReactFacts.aria));
leg('chart-react: badge prop', chartReactFacts.badge === '20 235 500,5', JSON.stringify(chartReactFacts.badge));

const crumbReact = page.locator('#crumb-react');
const crumbReactFacts = await crumbReact.evaluate((el) => ({
  liCount: el.shadowRoot.querySelectorAll('li.breadcrumb__item').length,
  linkCount: el.shadowRoot.querySelectorAll('a.breadcrumb__link').length,
  current: el.shadowRoot.querySelector('.breadcrumb__current')?.getAttribute('aria-current'),
}));
leg('crumb-react: items prop survived (3 li, 2 links, current)', crumbReactFacts.liCount === 3 && crumbReactFacts.linkCount === 2 && crumbReactFacts.current === 'page', JSON.stringify(crumbReactFacts));

const figureReact = page.locator('#figure-react');
const figureReactFacts = await figureReact.evaluate((el) => {
  const img = el.querySelector('img[slot="media"]');
  const caption = el.shadowRoot.querySelector('figcaption.figure__caption');
  const media = el.shadowRoot.querySelector('.figure__media');
  const r = media.getBoundingClientRect();
  return { loading: img?.getAttribute('loading'), caption: caption?.textContent?.trim() ?? null, ratio: r.width / r.height };
});
leg('figure-react: caption prop + slotted media + lazy', figureReactFacts.caption === 'Тот же кадр через обёртку' && figureReactFacts.loading === 'lazy' && Math.abs(figureReactFacts.ratio - 16 / 9) < 0.02, `caption=${JSON.stringify(figureReactFacts.caption)} loading=${figureReactFacts.loading} ratio=${figureReactFacts.ratio.toFixed(3)}`);

// ── 5. dark theme remap ────────────────────────────────────────────────────
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await page.waitForTimeout(150);
const darkBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tk-color-surface-base').trim());
leg('dark: --tk-color-surface-base remaps', darkBg === 'rgb(26, 26, 26)' || darkBg === '#1a1a1a', darkBg);

// ── 6. screenshots ─────────────────────────────────────────────────────────
const outDir = import.meta.dirname + '/';
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await page.screenshot({ path: `${outDir}dark-full.png`, fullPage: true });
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
await page.waitForTimeout(150);
await page.screenshot({ path: `${outDir}light-full.png`, fullPage: true });

leg('console: zero errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nTOTAL ${results.length} legs, PASS ${results.length - failed.length}, FAIL ${failed.length}`);
process.exit(failed.length ? 1 : 0);
