import { chromium } from '/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:6199/';
mkdirSync('/tmp/tk-v180/shots', { recursive: true });

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

// --- raw atoms ---
const slider = page.locator('#slider');
ok('slider: native range interior', await slider.locator('input[type=range]').count() === 1);
const sv = await slider.evaluate((el) => {
  const input = el.shadowRoot.querySelector('input');
  return { value: input.value, avt: input.getAttribute('aria-valuetext'), shadowText: el.shadowRoot.textContent };
});
ok('slider: value 40', sv.value === '40', JSON.stringify(sv));
ok('slider: valueFormatter -> aria-valuetext', sv.avt === '40 %', JSON.stringify(sv));
ok('slider: valueFormatter -> readout text', sv.shadowText.includes('40 %'), sv.shadowText.trim().slice(0, 60));

const sw = page.locator('#switch');
const swd = await sw.evaluate((el) => {
  const input = el.shadowRoot.querySelector('input');
  const sizes = [...el.shadowRoot.querySelectorAll('*')].map((n) => {
    const r = n.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  });
  return { role: input?.getAttribute('role'), type: input?.type, checked: input?.checked, sizes };
});
ok('switch: native checkbox + role=switch (rides the input)', swd.role === 'switch' && swd.type === 'checkbox', JSON.stringify({ role: swd.role, type: swd.type }));
ok('switch: property channel -> checked', swd.checked === true);
ok('switch: capsule 36x20 register', swd.sizes.includes('36x20'), swd.sizes.join(','));

const av = await page.locator('#avatar').evaluate((el) => ({
  role: el.getAttribute('role'),
  label: el.getAttribute('aria-label'),
  text: el.shadowRoot.textContent.trim(),
}));
ok('avatar: role=img + aria-label from connectedCallback', av.role === 'img' && av.label === 'Мария Оганова', JSON.stringify(av));
ok('avatar: initials МО', av.text === 'МО', av.text);

const notes = page.locator('#notes textarea');
await notes.fill('строка один\nстрока два');
await page.waitForTimeout(200);
const nh = await notes.evaluate((el) => getComputedStyle(el).height);
ok('textarea: autosize 16n+16 -> 48px', nh === '48px', nh);
const nLabel = await page.locator('#notes').evaluate((el) => el.shadowRoot.querySelector('label')?.textContent ?? null);
ok('textarea: native label wiring', !!nLabel, String(nLabel));

const fills = await page.evaluate(() => {
  const read = (sel) => {
    const el = document.querySelector(sel);
    const btn = el.shadowRoot.querySelector('.button');
    const cs = getComputedStyle(btn, '::before');
    return { bg: cs.backgroundColor, radius: cs.borderRadius, color: getComputedStyle(btn).color };
  };
  return { buy: read('#buy'), sell: read('#sell') };
});
ok('button positive: ::before #0BA264', fills.buy.bg === 'rgb(11, 162, 100)', JSON.stringify(fills.buy));
ok('button positive: radius-xs 4px', fills.buy.radius === '4px', fills.buy.radius);
ok('button positive: white label', fills.buy.color === 'rgb(255, 255, 255)', fills.buy.color);
ok('button negative: ::before #9D2B2B', fills.sell.bg === 'rgb(157, 43, 43)', JSON.stringify(fills.sell));

// --- react wrappers (props survive element creation) ---
const r = await page.evaluate(() => {
  const root = document.getElementById('root');
  const rs = root.querySelector('tk-range-slider');
  const rw = root.querySelector('tk-switch');
  const ra = root.querySelector('tk-avatar');
  const rt = root.querySelector('tk-textarea');
  const btns = [...root.querySelectorAll('tk-button')];
  const readBtn = (el) => {
    const b = el.shadowRoot.querySelector('.button');
    return getComputedStyle(b, '::before').backgroundColor;
  };
  return {
    sliderText: rs?.shadowRoot?.textContent ?? null,
    sliderAvt: rs?.shadowRoot?.querySelector('input')?.getAttribute('aria-valuetext') ?? null,
    switchRole: rw?.shadowRoot?.querySelector('input')?.getAttribute('role'),
    switchChecked: rw?.shadowRoot?.querySelector('input')?.checked,
    avatarRole: ra?.getAttribute('role'),
    avatarLabel: ra?.getAttribute('aria-label'),
    avatarText: ra?.shadowRoot?.textContent.trim(),
    textareaLabel: rt?.shadowRoot?.querySelector('label')?.textContent?.trim() ?? null,
    buy: btns.length === 2 ? readBtn(btns[0]) : null,
    sell: btns.length === 2 ? readBtn(btns[1]) : null,
  };
});
ok('react RangeSlider: valueFormatter prop survives (72 %)', r.sliderText?.includes('72 %') && r.sliderAvt === '72 %', JSON.stringify({ t: r.sliderText?.trim().slice(0, 40), a: r.sliderAvt }));
ok('react Switch: defaultChecked survives', r.switchRole === 'switch' && r.switchChecked === true, JSON.stringify(r.switchRole));
ok('react Avatar: name prop survives (role+label+ЛВ)', r.avatarRole === 'img' && r.avatarLabel === 'Ли Вонг' && r.avatarText === 'ЛВ', JSON.stringify({ r: r.avatarRole, l: r.avatarLabel, t: r.avatarText }));
ok('react Textarea: label prop survives', r.textareaLabel === 'Заметка (React)', String(r.textareaLabel));
ok('react Button: variant fills survive', r.buy === 'rgb(11, 162, 100)' && r.sell === 'rgb(157, 43, 43)', JSON.stringify({ b: r.buy, s: r.sell }));

// --- dark remap ---
const darkBase = await page.evaluate(() => {
  document.documentElement.dataset.theme = 'dark';
  return getComputedStyle(document.documentElement).getPropertyValue('--tk-color-surface-base').trim();
});
ok('dark: --tk-color-surface-base -> #1a1a1a', darkBase === '#1a1a1a', darkBase);

await page.screenshot({ path: '/tmp/tk-v180/shots/dark.png', fullPage: true });
await page.evaluate(() => delete document.documentElement.dataset.theme);
await page.waitForTimeout(100);
await page.screenshot({ path: '/tmp/tk-v180/shots/light.png', fullPage: true });

ok('console: 0 errors', errors.length === 0, errors.join(' | ').slice(0, 200));

await browser.close();
console.log(results.join('\n'));
const fails = results.filter((x) => x.startsWith('FAIL')).length;
console.log(`\n${results.length - fails}/${results.length} legs PASS`);
process.exit(fails ? 1 : 0);
