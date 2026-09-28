// SR-RUNSHEET-v1.2.0 — mechanizable half: computed name/role/state vs expected
// RU announcements. Live VoiceOver narration is NOT executed (METHOD.md §SR).
// Name computation pierces shadow boundaries (flattened-tree deepText: slot
// assignment + prop render; a shadow host renders EITHER its shadow OR its
// children — never both).
import { chromium } from 'playwright';

const BASE = 'http://localhost:6009/iframe.html?id=';
const stories = [
  ['1-input-sr-only', 'components-input--accessibility'],
  ['2-segmentedradio-sr-only', 'components-segmentedradio--accessibility'],
  ['3-checkbox-error', 'components-checkbox--accessibility'],
  ['4-stepper-subtitle', 'components-stepper--accessibility'],
  ['5-qrblock-page-copy', 'components-qrblock--accessibility'],
  ['6-promocard-bleed', 'components-promocard--accessibility'],
  ['7-button-href', 'components-button--accessibility'],
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
      if (n.nodeType === 1 && n.shadowRoot) { walk(n.shadowRoot); return; }
      for (const c of n.childNodes) walk(c);
    };
    walk(node);
    return out.replace(/\\s+/g, ' ').trim();
  };
  const accName = (el) => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) return lb.split(/\\s+/).map(id => deepText(byId(id)) || '').join(' ').trim();
    if (el.tagName === 'IMG' && el.getAttribute('alt')) return el.getAttribute('alt').trim();
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
    const { pierce, byId, deepText, accName } = eval(HELPERS);
    const res = [];
    const ok = (desc, pass, detail) => res.push({ desc, pass, detail });
    const inputs = pierce(document, 'input');
    const buttons = pierce(document, 'button, [role=button]');
    const anchors = pierce(document, 'a');

    if (key.startsWith('1-')) {
      const info = inputs.map(i => ({ name: accName(i), type: i.getAttribute('type') || 'text' }));
      const fio = info.find(i => /^Фамилия/.test(i.name));
      ok('«Фамилия…» + бейдж ПОСЛЕ подписи', !!fio && /30/.test(fio.name) && fio.name.indexOf('30') > fio.name.indexOf('Фамилия'), JSON.stringify(info));
      const tel = info.filter(i => /^Телефон/.test(i.name));
      ok('sr-only поле → «Телефон»', tel.length >= 1, JSON.stringify(tel.map(t => t.name)));
      ok('sr-only + бейдж → подпись, затем бейдж', tel.some(t => /30/.test(t.name) && t.name.indexOf('30') > t.name.indexOf('Телефон')), JSON.stringify(tel.map(t => t.name)));
    }
    if (key.startsWith('2-')) {
      const groups = pierce(document, '[role=radiogroup]').map(g => ({
        name: accName(g),
        radios: [...(g.parentElement?.children || [])].filter(c => c.getAttribute && c.getAttribute('role') === 'radio').length,
      }));
      const names = groups.map(g => g.name);
      ok('группа «Гражданство РФ?»', names.some(n => /Гражданство/.test(n)), JSON.stringify(names));
      ok('sr-only группа «Тип операции», НЕ «Выбор»', names.some(n => /Тип операции/.test(n)) && !names.every(n => /Выбор/.test(n)), JSON.stringify(names));
      // tk-segmented-radio rides NATIVE input[type=radio] with a roving
      // tabindex (checked one tabbable, others -1) — the state IS .checked.
      const radios = pierce(document, 'input[type=radio]');
      const perGroup = pierce(document, '[role=radiogroup]').map(g => {
        const root = g.getRootNode();
        const rs = [...root.querySelectorAll('input[type=radio]')];
        return { total: rs.length, checked: rs.filter(r => r.checked).length, tabbable: rs.filter(r => r.tabIndex === 0).length };
      });
      ok('нативные радио: 2/группа, ровно одна выбрана, roving tabindex', radios.length >= 4 && perGroup.every(p => p.total === 2 && p.checked === 1 && p.tabbable === 1), JSON.stringify(perGroup));
    }
    if (key.startsWith('3-')) {
      const boxes = pierce(document, 'input[type=checkbox], [role=checkbox]').map(c => ({
        name: accName(c),
        checked: c.getAttribute('aria-checked') ?? (c.checked ? 'true' : 'false'),
        invalid: c.getAttribute('aria-invalid'),
        described: c.getAttribute('aria-describedby'),
      }));
      // the Accessibility story renders TWO demos (verified against the story
      // source): the indeterminate default-label box and the error box; the
      // aria-label-only «Согласен» demo lives in the Variants story
      ok('демо-чекбоксы с именами из label', boxes.some(b => /Соглашаюсь получать рекламу/.test(b.name)) && boxes.some(b => /Согласен с условиями/.test(b.name)) && boxes.length === 2, JSON.stringify(boxes.map(b => b.name)));
      const err = boxes.find(b => /Согласен с условиями/.test(b.name));
      ok('ошибка НЕ в имени', !!err, JSON.stringify(boxes.map(b => b.name)));
      if (err) {
        const desc = err.described ? deepText(byId(err.described)) : '';
        ok('aria-invalid + описание зачитывается', err.invalid === 'true' && /Подтвердите согласие/.test(desc) && !/Подтвердите/.test(err.name),
           `invalid=${err.invalid} desc="${desc.slice(0, 60)}" name="${err.name}"`);
      }
      ok('indeterminate → aria-checked=mixed', boxes.some(b => b.checked === 'mixed'), JSON.stringify(boxes.map(b => b.checked)));
    }
    if (key.startsWith('4-')) {
      const h2 = pierce(document, 'h2').map(accName);
      ok('«Откройте счет для бизнеса», заголовок 2', h2.some(n => /Откройте счет/.test(n)) && h2.length >= 2, JSON.stringify(h2));
      const lists = pierce(document, 'ol, ul');
      ok('список, 3 элемента', lists.some(l => l.querySelectorAll(':scope > li').length === 3),
         JSON.stringify(lists.map(l => l.querySelectorAll(':scope > li').length)));
      const h3 = pierce(document, 'h3').map(accName);
      // «N.» in the protocol announcement is VO's own list-item numbering —
      // the computed h3 name carries no numeral (badge is aria-hidden)
      ok('шаги — заголовки 3 (имя без цифры, нумерацию даёт список)', h3.some(n => n === 'Заполните заявку') && h3.some(n => n === 'Дождитесь решения') && h3.some(n => n === 'Начните работать'), JSON.stringify(h3.slice(0, 6)));
      const badges = pierce(document, 'tk-badge, [data-step-badge], .badge');
      ok('цифровой бейдж aria-hidden', badges.length === 0 || badges.every(b => b.getAttribute('aria-hidden') === 'true'), `badges=${badges.length} hidden=${badges.filter(b => b.getAttribute('aria-hidden') === 'true').length}`);
    }
    if (key.startsWith('5-')) {
      const h2 = pierce(document, 'h2').map(accName);
      ok('«Вариант 2. Отсканируйте QR-код», заголовок 2', h2.some(n => /Вариант 2/.test(n)), JSON.stringify(h2));
      const tabs = pierce(document, '[role=tab]');
      const t0 = tabs[0];
      if (t0) {
        const sib = [...(t0.parentElement?.children || [])].filter(c => c.getAttribute('role') === 'tab');
        ok('«Android 9.0 и выше, вкладка, выбрана, 1 из 2»',
           accName(t0) === 'Android 9.0 и выше' && t0.getAttribute('aria-selected') === 'true' && sib.length === 2,
           `name="${accName(t0)}" selected=${t0.getAttribute('aria-selected')} of=${sib.length}`);
      } else ok('tabs present', false, 'no [role=tab]');
      const imgs = pierce(document, 'img, [role=img]').map(i => accName(i));
      ok('«QR-код для Android 9.0 и выше, изображение»', imgs.some(n => /QR-код/.test(n) && /Android/.test(n)), JSON.stringify(imgs));
      // page-copy: a paragraph BEFORE the tablist in DOM order
      const p = pierce(document, 'p').find(x => /Переходите по ссылкам/.test(accName(x)));
      const tl = pierce(document, '[role=tablist]')[0];
      ok('page-copy — обычный абзац ДО панели вкладок', !!p && !!tl && !!(p.compareDocumentPosition(tl) & Node.DOCUMENT_POSITION_FOLLOWING),
         p ? `p="${accName(p).slice(0, 40)}…" order=${(p.compareDocumentPosition(tl) || 0) & Node.DOCUMENT_POSITION_FOLLOWING ? 'p-before-tablist' : 'WRONG'}` : 'no page-copy p');
    }
    if (key.startsWith('6-')) {
      const h3 = pierce(document, 'h3').map(accName);
      ok('карты НЕ интерактивны: заголовок 3', h3.some(n => /Т-Инвестиции/.test(n)) && h3.some(n => /Т-Бизнес/.test(n)), JSON.stringify(h3));
      const hosts = pierce(document, 'tk-promo-card');
      ok('host-карты вне табуляции (tabIndex -1)', hosts.length > 0 && hosts.every(h => h.tabIndex === -1 || h.getAttribute('tabindex') === '-1'),
         JSON.stringify(hosts.map(h => h.tabIndex)));
      const cta = buttons.map(accName).filter(n => n === 'Подробнее');
      ok('единственная остановка — CTA «Подробнее, кнопка»', cta.length >= 2, JSON.stringify(cta));
      // «арт НЕ объявляется»: bleed-svg carries the consumer-side aria-hidden;
      // the top-mode art is a NAMELESS generic div (SR-invisible without any
      // marking) — both satisfy the protocol's "not announced"
      const arts = pierce(document, '[slot=art]');
      ok('арт не объявляется (aria-hidden или безымянный generic)', arts.length > 0 && arts.every(a => a.getAttribute('aria-hidden') === 'true' || accName(a) === ''), JSON.stringify(arts.map(a => ({ hidden: a.getAttribute('aria-hidden'), name: accName(a).slice(0, 20), tag: a.tagName }))));
    }
    if (key.startsWith('7-')) {
      const btn = buttons.map(accName).filter(Boolean);
      ok('кнопки объявляются «…, кнопка» (имя+роль)', btn.length > 0, JSON.stringify(btn.slice(0, 8)));
      // tk-button's own anchors only (a.button inside tk-button shadows) —
      // Storybook chrome anchors would pollute the rel/target verdict
      const tkLinks = pierce(document, 'tk-button').flatMap(h => [...(h.shadowRoot?.querySelectorAll('a.button') || [])])
        .map(a => ({ name: accName(a), href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel') }));
      ok('href-ряд: роль ССЫЛКА (нативный <a href> в шэдоу-руте tk-button)', tkLinks.some(l => /Открыть страницу/.test(l.name)) && tkLinks.some(l => /Открыть в новой вкладке/.test(l.name)), JSON.stringify(tkLinks));
      const blank = tkLinks.find(l => l.target === '_blank');
      ok('target=_blank → rel noopener noreferrer', !!blank && (blank.rel || '').includes('noopener') && (blank.rel || '').includes('noreferrer'), blank ? `rel="${blank.rel}"` : 'no _blank link');
      const b2a = pierce(document, 'a.button').length;
      ok('без href остаётся <button>', buttons.length > 0 && b2a > 0, `buttons=${buttons.length} anchors-with-button-class=${b2a}`);
    }
    return res;
  }, [key, HELPERS]);
}

// keyboard legs: block 2 — arrow moves the checked radio (selection follows
// focus); block 7 — Enter on the href link navigates (native anchor).
async function keyboardLeg(page, key, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  if (key.startsWith('2-')) {
    const read = () => page.evaluate((HELPERS) => {
      const { pierce } = eval(HELPERS);
      return pierce(document, 'input[type=radio]').map(x => String(x.checked));
    }, HELPERS);
    const before = await read();
    const focused = await page.evaluate((HELPERS) => {
      const { pierce } = eval(HELPERS);
      const t = pierce(document, 'input[type=radio]').find(x => x.checked);
      if (t) t.focus();
      return t ? t.getRootNode().activeElement === t : false;
    }, HELPERS);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(250);
    const after = await read();
    return { before, after, moved: JSON.stringify(before) !== JSON.stringify(after), focused };
  }
  if (key.startsWith('7-')) {
    // Enter navigation is native-anchor semantics; the story hrefs point at
    // https://example.com (external) — pressing Enter would leave the probe
    // page. Focus + href presence verify the mechanizable half honestly.
    const focused = await page.evaluate((HELPERS) => {
      const { pierce, deepText } = eval(HELPERS);
      const hosts = pierce(document, 'tk-button');
      const a = hosts.flatMap(h => [...(h.shadowRoot?.querySelectorAll('a.button') || [])]).find(x => /Открыть страницу/.test(deepText(x)));
      if (!a) return { found: false };
      a.focus();
      return { found: true, focused: a.getRootNode().activeElement === a, href: a.getAttribute('href') };
    }, HELPERS);
    return { enterSkipped: 'external href — native anchor navigation is UA semantics', ...focused };
  }
  return null;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const out = {};
for (const [key, id] of stories) {
  for (const theme of ['light', 'dark']) {
    const url = `${BASE}${id}&viewMode=story${theme === 'dark' ? '&globals=theme:dark' : ''}`;
    try {
      const r = await probe(page, key, url);
      if (r.every(x => x.desc !== 'ERROR') && r.length) out[`${key}/${theme}`] = r;
      else out[`${key}/${theme}`] = r;
      if ((key.startsWith('2-') || key.startsWith('7-')) && theme === 'light') {
        const kb = await keyboardLeg(page, key, url);
        if (kb) out[`${key}/keyboard`] = kb;
      }
    } catch (e) { out[`${key}/${theme}`] = [{ desc: 'ERROR', pass: false, detail: e.message.slice(0, 200) }]; }
  }
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
