// SR-RUNSHEET-v1.3.0 — mechanizable half: computed name/role/state vs expected
// RU announcements. Live VoiceOver narration is NOT executed (METHOD.md §SR).
// Name computation pierces shadow boundaries (deepText) — prop-rendered labels
// (label=/count=) live inside shadow roots; a flat textContent would miss them.
import { chromium } from 'playwright';

const BASE = 'http://localhost:6009/iframe.html?id=';
const stories = [
  ['1-tabs-console-underline', 'components-tabs--console-underline'],
  ['2-badge-console-tones', 'components-badge--console-tones'],
  ['3-progressbar-thin-bars', 'components-progressbar--thin-bars'],
  ['4-console-chrome-demo', 'components-v2-console-chrome--demo'],
  ['5-data-surfaces-payments', 'components-v2-data-surfaces--payments-demo'],
  ['6-data-surfaces-progress-favorites', 'components-v2-data-surfaces--progress-favorites-demo'],
];

const HELPERS = `(() => {
  const pierce = (root, sel, out = []) => {
    const walk = (r) => {
      for (const el of r.querySelectorAll(sel)) out.push(el);
      for (const el of r.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(root);
    return out;
  };
  const byId = (id) => {
    const direct = document.getElementById(id);
    if (direct) return direct;
    for (const el of pierce(document, '*')) if (el.id === id) return el;
    return null;
  };
  const deepText = (node) => {
    let out = '';
    const walk = (n) => {
      if (n.nodeType === 3) { out += n.textContent; return; }
      if (n.tagName === 'SLOT') { for (const a of n.assignedNodes({ flatten: true })) walk(a); return; }
      // flattened-tree rule: a shadow host renders EITHER its shadow (slots
      // pull the light children in) OR its children — never both. Walking
      // both double-counts slotted text (host child + slot assignment).
      if (n.nodeType === 1 && n.shadowRoot) { walk(n.shadowRoot); return; }
      for (const c of n.childNodes) walk(c);
    };
    walk(node);
    return out.replace(/\\s+/g, ' ').trim();
  };
  const accName = (el) => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) return lb.split(/\\s+/).map(id => byId(id)?.textContent || '').join(' ').trim();
    let s = deepText(el);
    if (!s) {
      const wrap = el.closest('label');
      if (wrap) s = deepText(wrap);
      if (!s && el.id) { const lf = document.querySelector('label[for="' + el.id + '"]'); if (lf) s = deepText(lf); }
    }
    return s.replace(/\\s+/g, ' ').trim();
  };
  return { pierce, byId, deepText, accName };
})()`;

async function probe(page, key, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  return page.evaluate(([key, HELPERS]) => {
    const { pierce, accName, deepText } = eval(HELPERS);
    const res = [];
    const ok = (desc, pass, detail) => res.push({ desc, pass, detail });
    const tabs = pierce(document, '[role=tab]');
    const bars = pierce(document, '[role=progressbar]');
    const links = pierce(document, 'a');
    const buttons = pierce(document, 'button, [role=button]');

    if (key.startsWith('1-') || key.startsWith('4-')) {
      const t0 = tabs[0];
      if (t0) {
        const sib = [...(t0.parentElement?.children || [])].filter(c => c.getAttribute('role') === 'tab');
        const idx = sib.indexOf(t0) + 1;
        ok('«Главная, вкладка, выбрана, 1 из 4»',
           accName(t0) === 'Главная' && t0.getAttribute('aria-selected') === 'true' && idx === 1 && sib.length === 4,
           `name="${accName(t0)}" selected=${t0.getAttribute('aria-selected')} pos=${idx}/${sib.length}`);
      } else ok('tabs present', false, 'no [role=tab]');
    }
    if (key.startsWith('2-')) {
      const texts = pierce(document, 'tk-badge').map(b => accName(b));
      ok('статус-пилюля → «Ожидает подписи»', texts.includes('Ожидает подписи'), JSON.stringify(texts));
      ok('счётчик → «3»', texts.includes('3'), '');
      const tabNames = tabs.map(accName);
      ok('серые цифры входят в имя вкладки', tabNames.some(n => /\d/.test(n)), JSON.stringify(tabNames));
    }
    if (key.startsWith('3-') || key.startsWith('6-')) {
      const info = bars.map(b => ({ name: accName(b), now: b.getAttribute('aria-valuenow'), max: b.getAttribute('aria-valuemax') }));
      ok('«<label>, индикатор выполнения, N процентов»', bars.length > 0 && info.every(i => i.name && i.now), JSON.stringify(info));
      const spend = info.find(i => /Spending/i.test(i.name));
      if (spend) ok('«Лимит Spending-карты … 72 процента»', spend.now === '72', JSON.stringify(spend));
    }
    if (key.startsWith('4-')) {
      const h3 = pierce(document, 'h3').map(accName);
      ok('мега-панель: заголовки групп читаются как заголовки', h3.length > 0, JSON.stringify(h3));
      const all = links.map(accName);
      ok('«Все сервисы» — статический текст (не ссылка)', !all.includes('Все сервисы'), JSON.stringify(all.slice(0, 8)));
    }
    if (key.startsWith('5-')) {
      const btn = buttons.map(accName);
      for (const n of ['Создать платёж', 'Подписать', 'Загрузить']) ok(`кнопка «${n}»`, btn.includes(n), JSON.stringify(btn.slice(0, 10)));
      const combo = pierce(document, '[role=combobox], input').map(accName);
      ok('поле «Контрагент» (combobox)', combo.some(n => /Контрагент/.test(n)), JSON.stringify(combo));
      ok('чипы «Неделя/Месяц/Квартал»', ['Неделя', 'Месяц', 'Квартал'].every(n => btn.includes(n)), '');
      const cb = pierce(document, '[role=checkbox], input[type=checkbox]').map(accName);
      ok('чекбокс «Запомнить»', cb.some(n => /Запомнить/.test(n)), JSON.stringify(cb));
      const tabNames = tabs.map(accName);
      ok('«На подпись, 5» — счётчик в имени', tabNames.some(n => /На подпись\s*,?\s*5/.test(n)), JSON.stringify(tabNames));
      const cols = pierce(document, 'th, [role=columnheader]').map(accName);
      const i = cols.indexOf('Получатель');
      ok('«Получатель, столбец 1 из 3»', i >= 0 && cols.length - i === 3, JSON.stringify(cols));
    }
    return res;
  }, [key, HELPERS]);
}

// keyboard leg: position focus on the tablist (roving tabindex — the selected
// tab is the focusable one), then ArrowRight must MOVE the selection
// (activation follows focus — the tk-tabs contract).
async function keyboardLeg(page, key, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const readSel = () => page.evaluate((HELPERS) => {
    const { pierce } = eval(HELPERS);
    return pierce(document, '[role=tab]').map(x => x.getAttribute('aria-selected'));
  }, HELPERS);
  const before = await readSel();
  const focused = await page.evaluate((HELPERS) => {
    const { pierce } = eval(HELPERS);
    const t = pierce(document, '[role=tab]').find(x => x.getAttribute('aria-selected') === 'true') ||
              pierce(document, '[role=tab]')[0];
    if (!t) return false;
    t.focus();
    // document.activeElement retargets to the shadow HOST; the root-scoped
    // activeElement sees the real focus target inside the shadow tree.
    return t.getRootNode().activeElement === t;
  }, HELPERS);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const after = await readSel();
  return { tablistFocused: focused, before, after,
           moved: JSON.stringify(before) !== JSON.stringify(after) };
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const out = {};
for (const [key, id] of stories) {
  for (const theme of ['light', 'dark']) {
    const url = `${BASE}${id}&viewMode=story${theme === 'dark' ? '&globals=theme:dark' : ''}`;
    try {
      out[`${key}/${theme}`] = await probe(page, key, url);
      if ((key.startsWith('1-') || key.startsWith('4-')) && theme === 'light') {
        out[`${key}/keyboard`] = await keyboardLeg(page, key, url);
      }
    } catch (e) { out[`${key}/${theme}`] = [{ desc: 'ERROR', pass: false, detail: e.message.slice(0, 200) }]; }
  }
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
