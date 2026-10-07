import { chromium } from '/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:6199/';
mkdirSync('/tmp/tk-v190/shots', { recursive: true });

const results = [];
const ok = (name, pass, detail = '') => {
  results.push(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  return pass;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

// --- raw tk-spinner (27.1) ---
const sp = await page.evaluate(() => {
  const read = (sel) => {
    const el = document.querySelector(sel);
    const svg = el.shadowRoot.querySelector('svg');
    const arc = el.shadowRoot.querySelector('circle');
    return {
      role: el.getAttribute('role'),
      label: el.getAttribute('aria-label'),
      hidden: el.getAttribute('aria-hidden'),
      sizeVar: el.style.getPropertyValue('--tk-spinner-size'),
      sizeAttr: el.getAttribute('size'),
      viewBox: svg.getAttribute('viewBox'),
      pathLength: arc.getAttribute('pathLength'),
      dash: arc.getAttribute('stroke-dasharray'),
      stroke: getComputedStyle(arc).stroke,
      strokeW: getComputedStyle(arc).strokeWidth,
      arcAria: svg.getAttribute('aria-hidden'),
    };
  };
  return {
    named: read('#spin-named'),
    def: read('#spin-default'),
    deco: read('#spin-decorative'),
    s24: read('#spin-24'),
    bogus: read('#spin-bogus'),
    color: read('#spin-color'),
  };
});
ok('spinner: named role=status + aria-label from connectedCallback', sp.named.role === 'status' && sp.named.label === 'Загрузка данных', JSON.stringify({ r: sp.named.role, l: sp.named.label }));
ok('spinner: default label «Загрузка»', sp.def.role === 'status' && sp.def.label === 'Загрузка', String(sp.def.label));
ok('spinner: label="" -> decorative aria-hidden, no role', sp.deco.hidden === 'true' && sp.deco.role === null, JSON.stringify({ h: sp.deco.hidden, r: sp.deco.role }));
ok('spinner: size=24 -> host inline --tk-spinner-size + viewBox', sp.s24.sizeVar === '24px' && sp.s24.viewBox === '0 0 24 24', JSON.stringify({ v: sp.s24.sizeVar, vb: sp.s24.viewBox }));
ok('spinner: size=48 outside union clamps to 20', sp.bogus.sizeVar === '20px' && sp.bogus.sizeAttr === '20' && sp.bogus.viewBox === '0 0 20 20', JSON.stringify({ v: sp.bogus.sizeVar, a: sp.bogus.sizeAttr }));
ok('spinner: arc stroke = currentColor of the context', sp.color.stroke === 'rgb(11, 162, 100)', sp.color.stroke);
ok('spinner: 3/4 arc — pathLength 100, dash 75 25, stroke 2px, svg aria-hidden', sp.named.pathLength === '100' && sp.named.dash === '75 25' && sp.named.strokeW === '2px' && sp.named.arcAria === 'true', JSON.stringify({ p: sp.named.pathLength, d: sp.named.dash, w: sp.named.strokeW }));

// reduced motion -> the rotation collapses to a static arc (and back)
await page.emulateMedia({ reducedMotion: 'reduce' });
const animNone = await page.$eval('#spin-named', (el) => getComputedStyle(el.shadowRoot.querySelector('.spinner')).animationName);
await page.emulateMedia({ reducedMotion: 'no-preference' });
const animSpin = await page.$eval('#spin-named', (el) => getComputedStyle(el.shadowRoot.querySelector('.spinner')).animationName);
ok('spinner: reduce -> static arc; motion back -> tk-spinner-rotate', animNone === 'none' && animSpin === 'tk-spinner-rotate', `${animNone} / ${animSpin}`);

// --- raw tk-carousel page-change (27.4) ---
const silent = await page.evaluate(async () => {
  const events = [];
  const car = document.createElement('tk-carousel');
  car.label = 'Тихий рейл';
  for (let i = 1; i <= 6; i++) {
    const c = document.createElement('div');
    c.className = 'car-card';
    c.textContent = String(i);
    car.append(c);
  }
  car.addEventListener('page-change', (e) => events.push(e.detail));
  const frame = document.createElement('div');
  frame.className = 'car-frame';
  frame.append(car);
  document.querySelector('#raw-carousel').append(frame);
  await new Promise((r) => setTimeout(r, 450));
  frame.remove();
  return events.length;
});
ok('carousel: §9 SILENCE — first render establishes the baseline, 0 emits', silent === 0, `${silent} events`);

await page.evaluate(() => {
  window.__car = [];
  document.querySelector('#car1').addEventListener('page-change', (e) => window.__car.push({ d: e.detail, c: e.composed, b: e.bubbles }));
});
await page.evaluate(() => document.querySelector('#car1').shadowRoot.querySelector('[aria-label="Вперёд"]').click());
await page.waitForFunction(() => window.__car.length >= 1, null, { timeout: 6000 });
const step1 = await page.evaluate(() => window.__car[0]);
ok('carousel: chevron step -> page-change {page: 2}, composed+bubbles', step1.d.page === 2 && step1.c && step1.b, JSON.stringify(step1));
await page.waitForTimeout(400);
await page.evaluate(() => document.querySelector('#car1').shadowRoot.querySelector('[aria-label="Назад"]').click());
await page.waitForFunction(() => window.__car.length >= 2, null, { timeout: 6000 });
const step2 = await page.evaluate(() => window.__car[1]);
ok('carousel: step back -> {page: 1}', step2.d.page === 1, JSON.stringify(step2.d));

// --- raw tk-toast hide (27.4) ---
await page.evaluate(() => {
  window.__toasts = [];
  window.__shows = 0;
  document.addEventListener('hide', (e) => window.__toasts.push(e.detail), true);
  document.addEventListener('show', () => window.__shows++, true);
});
await page.click('#toast-auto');
await page.waitForFunction(() => window.__toasts.length >= 1, null, { timeout: 6000 });
const auto = await page.evaluate(() => window.__toasts[0]);
ok('toast: duration timer -> hide {reason: "auto"} exactly once', auto.reason === 'auto' && (await page.evaluate(() => window.__toasts.length)) === 1, JSON.stringify(auto));
await page.click('#toast-sticky');
await page.waitForTimeout(300);
await page.keyboard.press('Escape');
await page.waitForFunction(() => window.__toasts.length >= 2, null, { timeout: 6000 });
const manual = await page.evaluate(() => window.__toasts[1]);
ok('toast: sticky + Esc -> hide {reason: "manual"}', manual.reason === 'manual', JSON.stringify(manual));
await page.waitForTimeout(400);
const shows = await page.evaluate(() => window.__shows);
ok('toast: NO show event exists (REFUSED contract)', shows === 0, `${shows} show events`);

// --- react wrappers (payloads unwrapped into the props) ---
await page.waitForFunction(() => document.querySelector('#root tk-spinner'), null, { timeout: 6000 });
const rspin = await page.evaluate(() => {
  const el = document.querySelector('#root tk-spinner');
  return { role: el.getAttribute('role'), label: el.getAttribute('aria-label') };
});
ok('react Spinner: label prop survives (role=status + label)', rspin.role === 'status' && rspin.label === 'Загрузка (React)', JSON.stringify(rspin));

await page.waitForFunction(() => document.querySelector('#root tk-carousel'), null, { timeout: 6000 });
await page.evaluate(() => document.querySelector('#root tk-carousel').shadowRoot.querySelector('[aria-label="Вперёд"]').click());
await page.waitForFunction(() => window.__reactPage, null, { timeout: 6000 });
const rpage = await page.evaluate(() => window.__reactPage);
ok('react Carousel: onPageChange gets the UNWRAPPED {page: 2}', !!rpage && rpage.page === 2 && rpage.isEvent === false, JSON.stringify(rpage));

await page.waitForFunction(() => window.__reactHide, null, { timeout: 8000 }).catch(() => null);
await page.waitForTimeout(300);
const rhide = await page.evaluate(() => window.__reactHide ?? null);
ok('react Toast: onHide gets the UNWRAPPED {reason: "auto"}', rhide.reason === 'auto' && rhide.isEvent === false, JSON.stringify(rhide));

// --- dark remap ---
const darkBase = await page.evaluate(() => {
  document.documentElement.dataset.theme = 'dark';
  return getComputedStyle(document.documentElement).getPropertyValue('--tk-color-surface-base').trim();
});
ok('dark: --tk-color-surface-base -> #1a1a1a', darkBase === '#1a1a1a', darkBase);

await page.screenshot({ path: '/tmp/tk-v190/shots/dark.png', fullPage: true });
await page.evaluate(() => delete document.documentElement.dataset.theme);
await page.waitForTimeout(100);
await page.screenshot({ path: '/tmp/tk-v190/shots/light.png', fullPage: true });

ok('console: 0 errors', errors.length === 0, errors.join(' | ').slice(0, 200));

await browser.close();
console.log(results.join('\n'));
const fails = results.filter((x) => x.startsWith('FAIL')).length;
console.log(`\n${results.length - fails}/${results.length} legs PASS`);
process.exit(fails ? 1 : 0);
