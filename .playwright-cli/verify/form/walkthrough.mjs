// Story 2.8 — LIVE UJ-3 walkthrough driver (committed recipe, NOTES.md).
// Reproduces the keyboard + axe-tree walkthrough of the composed story from
// the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6013 &
//   node .playwright-cli/verify/form/walkthrough.mjs
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies).
//
// Every interaction is a REAL key press / click through the composed story
// (no synthetic event shortcuts) — the record this prints is the raw
// observation log NOTES.md distills. Focus reads DESCEND the shadow chain
// (document.activeElement stops at the first shadow host; the real focus
// lives in host.shadowRoot.activeElement). SR observations come from the
// axe tree (role/name/state via Playwright ariaSnapshot) — full VO/NVDA
// narration is a 5.x human task, noted in NOTES.md.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const PORT = 6013;
const STORY_ID = 'showcase-application-form--application-form';
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');
const AXE_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const pin = async (page) => {
  await page.addStyleTag({ content: FONTS_CSS });
  await page.evaluate(async () => {
    const loads = [
      ...[400, 500, 600].map((w) => document.fonts.load(`${w} 16px DaytonaSans`)),
      ...[400, 500, 700].map((w) => document.fonts.load(`${w} 16px Inter`)),
    ];
    await Promise.all(loads);
    await document.fonts.ready;
  });
};

const openStory = async (page, dark) => {
  const params = new URLSearchParams({ id: STORY_ID, viewMode: 'story' });
  if (dark) params.set('globals', 'theme:dark');
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  await pin(page);
};

/**
 * Describes the REAL focus: descends document.activeElement through every
 * shadowRoot.activeElement — the composed chain, inner element first.
 */
const activeStop = (page) =>
  page.evaluate(() => {
    const describe = (node) => {
      if (!(node instanceof Element)) return '';
      const tag = node.tagName.toLowerCase();
      const extra = [
        node.getAttribute('type') ? ` type=${node.getAttribute('type')}` : '',
        node.getAttribute('value') ? ` value=${node.getAttribute('value')}` : '',
        node.getAttribute('name') ? ` name=${node.getAttribute('name')}` : '',
      ].join('');
      return tag + extra;
    };
    let el = document.activeElement;
    if (!el || el === document.body) return 'body';
    const chain = [describe(el)];
    while (el?.shadowRoot?.activeElement) {
      el = el.shadowRoot.activeElement;
      chain.push(describe(el));
    }
    return chain.join(' › ');
  });

const progressBarValue = (page) =>
  page.evaluate(() => {
    const bar = document.querySelector('.tkf-panel tk-progress-bar');
    return Number(bar?.shadowRoot?.querySelector('.track')?.getAttribute('aria-valuenow'));
  });

const announcement = (page) =>
  page.evaluate(() => {
    const bar = document.querySelector('.tkf-panel tk-progress-bar');
    return bar?.shadowRoot?.querySelector('.announcement')?.textContent ?? null;
  });

const panelSnapshot = (page) => page.locator('.tkf-panel').ariaSnapshot();

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();
await openStory(page, false);
await page.evaluate(() => {
  (document.querySelector('.tkf-panel') ?? document.body).scrollIntoView();
});

const submitButton = page.getByRole('button', { name: 'Продолжить' });
const fioField = page.getByRole('textbox', { name: 'Фамилия, имя и отчество +20%' });
const phoneField = page.getByRole('textbox', { name: 'Мобильный телефон' });

// --- Step 0 — initial tree (UJ-3 entry state) ---------------------------------
console.log('\n=== STEP 0 — initial tree ===');
console.log(await panelSnapshot(page));
check('initial progress 33% (2 of 6 preselected: Да + Чёрная)', (await progressBarValue(page)) === 33);
check('initial narration «Заполнено 33%» (aria-live)', (await announcement(page)) === 'Заполнено 33%');

// --- Step 1 (UJ-3 #1) — Tab order + label→badge→input --------------------------
console.log('\n=== STEP 1 — Tab walk (reading order) ===');
await page.evaluate(() => document.body.focus());
const stops = [];
for (let i = 0; i < 14; i += 1) {
  await page.keyboard.press('Tab');
  const stop = await activeStop(page);
  if (stop === 'body' && stops.length > 0) break;
  stops.push(stop);
  console.log(`Tab stop ${stops.length}: ${stop}`);
  if (stop.startsWith('button') && stop.includes('tk-button')) break; // past the submit row
}
const expectedStops = [
  'tk-input',
  'tk-input',
  'tk-segmented-radio',
  'tk-select',
  'tk-thumbnail-picker',
  'tk-checkbox',
  'a',
  'tk-button',
];
const stopsOk =
  stops.length === expectedStops.length &&
  stops.every((s, i) => (expectedStops[i] === 'a' ? s === 'a' : s.startsWith(expectedStops[i])));
check(
  'Tab order: ФИО → телефон → Да → select → дизайн → согласие → ссылка → Продолжить',
  stopsOk,
  stops.join(' | '),
);

const badgeChain = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  const input = host?.shadowRoot?.querySelector('input');
  const labelledby = input?.getAttribute('aria-labelledby') ?? '';
  const order = labelledby
    .split(' ')
    .filter(Boolean)
    .map((id) => {
      const el = host.shadowRoot?.getElementById(id);
      // The badge cell's text lives in SLOTTED nodes — textContent of the
      // shadow span alone is empty.
      const slot = el instanceof HTMLElement ? el.querySelector('slot') : null;
      const text = slot
        ? slot
            .assignedNodes({ flatten: true })
            .map((n) => n.textContent?.trim() ?? '')
            .join('')
        : (el?.textContent ?? '');
      return text.trim();
    });
  return { labelledby, order };
});
const labelledbyIds = badgeChain.labelledby.split(' ').filter(Boolean);
check(
  'ФИО name order label → badge («Фамилия…» then «+20%»)',
  labelledbyIds[0]?.endsWith('-label') === true &&
    labelledbyIds.at(-1)?.endsWith('-badge') === true &&
    badgeChain.order.at(-1) === '+20%',
  `${badgeChain.labelledby} → ${JSON.stringify(badgeChain.order)}`,
);

// The walk blurred the required ФИО — the component's own on-blur error shows.
const blurError = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  const text = host?.shadowRoot?.querySelector('.error__text')?.textContent ?? null;
  const invalid = host?.shadowRoot?.querySelector('input')?.getAttribute('aria-invalid') ?? null;
  return { text, invalid };
});
check(
  'blur through empty required ФИО raised the INTERNAL error («Обязательное поле»)',
  blurError.text === 'Обязательное поле' && blurError.invalid === 'true',
  JSON.stringify(blurError),
);

// --- Step 2 (UJ-3 #2a) — Select: Enter opens, arrows move, Enter picks ----------
console.log('\n=== STEP 2 — Select keyboard flow ===');
await page.getByRole('combobox', { name: 'Выберите повышенный кэшбэк (четыре категории)' }).focus();
await page.keyboard.press('Escape'); // start from a known closed state
await page.keyboard.press('Enter');
await page.waitForTimeout(50);
const openState = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-select');
  const trigger = host?.shadowRoot?.querySelector('.field__trigger');
  const activeId = trigger?.getAttribute('aria-activedescendant');
  return {
    expanded: trigger?.getAttribute('aria-expanded'),
    activeText: activeId ? host.shadowRoot?.querySelector(`#${CSS.escape(activeId)}`)?.textContent?.trim() : null,
    focused: trigger === host.shadowRoot.activeElement,
  };
});
check('Enter opens the menu (aria-expanded=true, trigger keeps focus)', openState.expanded === 'true' && openState.focused);
console.log(`visual focus (aria-activedescendant): ${openState.activeText}`);
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
const afterArrows = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-select');
  const trigger = host?.shadowRoot?.querySelector('.field__trigger');
  const id = trigger?.getAttribute('aria-activedescendant');
  return host?.shadowRoot?.querySelector(`#${CSS.escape(id ?? '')}`)?.textContent?.trim() ?? null;
});
console.log(`after 2×ArrowDown: visual focus → ${afterArrows}`);
await page.keyboard.press('Enter');
await page.waitForTimeout(50);
const picked = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-select');
  const trigger = host?.shadowRoot?.querySelector('.field__trigger');
  return {
    expanded: trigger?.getAttribute('aria-expanded'),
    text: trigger?.querySelector('.field__value')?.textContent?.trim(),
    focusReturned: trigger === host.shadowRoot.activeElement,
  };
});
check(
  'Enter picks «5% Аптеки», menu closes, focus back on trigger, progress 33→50',
  picked.expanded === 'false' &&
    picked.text === '5% Аптеки' &&
    picked.focusReturned &&
    (await progressBarValue(page)) === 50,
  `trigger=${picked.text}, progress=${await progressBarValue(page)}`,
);

// --- Step 3 (UJ-3 #2b) — SegmentedRadio: arrows, focus-follows-selection -------
console.log('\n=== STEP 3 — SegmentedRadio arrows ===');
await page.locator('.tkf-panel tk-segmented-radio input[value="yes"]').focus();
const beforeArrow = await activeStop(page);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(50);
const afterArrow = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-segmented-radio');
  const inputs = [...(host?.shadowRoot?.querySelectorAll('input[type="radio"]') ?? [])];
  const active = host?.shadowRoot?.activeElement ?? null;
  return {
    focusOn: active?.getAttribute('value') ?? null,
    inside: !!active && inputs.includes(active),
    checked: inputs.find((i) => i.checked)?.getAttribute('value') ?? null,
  };
});
check(
  'ArrowRight Да→Нет: focus follows selection (focused=checked=Нет)',
  afterArrow.focusOn === 'no' && afterArrow.checked === 'no' && afterArrow.inside,
  JSON.stringify(afterArrow),
);
console.log(`focus before: ${beforeArrow}; after: value=${afterArrow.focusOn}, checked=${afterArrow.checked}`);
check('progress unchanged by the Да/Нет flip (either value counts)', (await progressBarValue(page)) === 50);
await page.keyboard.press('ArrowLeft'); // back to Да (the reference default)
await page.waitForTimeout(50);

// --- Step 4 (UJ-3 #3) — submit with empty required ФИО: error, no focus theft --
console.log('\n=== STEP 4 — empty-required submit ===');
await submitButton.focus();
const focusBeforeSubmit = await activeStop(page);
await page.keyboard.press('Enter');
await page.waitForTimeout(50);
const focusAfterSubmit = await activeStop(page);
const submitError = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  const input = host?.shadowRoot?.querySelector('input');
  const describedBy = input?.getAttribute('aria-describedby');
  const message = describedBy
    ? host?.shadowRoot?.querySelector(`#${CSS.escape(describedBy)}`)?.textContent?.trim()
    : null;
  return { describedBy, message, invalid: input?.getAttribute('aria-invalid') };
});
check(
  'submit error via described-by («Укажите фамилию, имя и отчество»), aria-invalid',
  submitError.message === 'Укажите фамилию, имя и отчество' && submitError.invalid === 'true',
  JSON.stringify(submitError),
);
check(
  'focus NOT stolen (stays on the button)',
  focusBeforeSubmit === focusAfterSubmit && focusBeforeSubmit.startsWith('tk-button'),
  `${focusBeforeSubmit} → ${focusAfterSubmit}`,
);
check('ProgressBar unchanged by the failed submit', (await progressBarValue(page)) === 50);

// Revisit: Shift+Tab back to the ФИО — the described-by message is present there.
let revisitStop = '';
for (let i = 0; i < 10; i += 1) {
  await page.keyboard.press('Shift+Tab');
  revisitStop = await activeStop(page);
  if (revisitStop.startsWith('tk-input') && revisitStop.includes('name=fio')) break;
}
const revisit = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  const input = host?.shadowRoot?.querySelector('input');
  return {
    stop: input === (host?.shadowRoot?.activeElement ?? document.activeElement),
    describedBy: input?.getAttribute('aria-describedby'),
    invalid: input?.getAttribute('aria-invalid'),
  };
});
check(
  'error heard on revisit (focus reaches ФИО with described-by intact)',
  revisitStop.startsWith('tk-input') && revisitStop.includes('name=fio') && revisit.stop && (revisit.describedBy ?? '') !== '',
  `stop=${revisitStop}, describedby=${revisit.describedBy}`,
);

// --- Step 5 — progressive completion to 100% -----------------------------------
console.log('\n=== STEP 5 — fill to 100% ===');
await page.keyboard.type('Иванов Алексей Петрович');
await page.waitForTimeout(50);
const fioAfterType = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  return {
    message: host?.shadowRoot?.querySelector('.error__text')?.textContent ?? null,
    value: host?.shadowRoot?.querySelector('input')?.value,
  };
});
// The story clears ITS error on edit; the component's internal blur-validated
// message («Обязательное поле», raised by the step-1 walk) surfaces under it
// until the next blur revalidates — the frozen 2.1 semantics, recorded.
check(
  'typing replaces the story-driven error (internal blur message remains until blur)',
  fioAfterType.message !== 'Укажите фамилию, имя и отчество' && fioAfterType.value === 'Иванов Алексей Петрович',
  JSON.stringify(fioAfterType),
);
await page.keyboard.press('Tab'); // blur ФИО → revalidation
await page.waitForTimeout(50);
const fioAfterBlur = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-input[name="fio"]');
  return host?.shadowRoot?.querySelector('.error') === null;
});
check('blur revalidation clears the internal message', fioAfterBlur);
check('progress 50→67 after ФИО', (await progressBarValue(page)) === 67);

await phoneField.click();
await page.keyboard.type('+7 900 000-00-00');
await page.waitForTimeout(50);
check('progress 67→83 after телефон', (await progressBarValue(page)) === 83);

await page.locator('.tkf-panel tk-checkbox input').click();
await page.waitForTimeout(50);
check('progress 83→100 after согласие', (await progressBarValue(page)) === 100);
check('final narration «Заполнено 100%»', (await announcement(page)) === 'Заполнено 100%');

// --- Step 6 — valid submit: loading, width frozen, reset; NO Toast -------------
console.log('\n=== STEP 6 — valid submit ===');
await submitButton.focus();
const buttonBox = await submitButton.boundingBox();
await page.keyboard.press('Enter');
await page.waitForTimeout(80);
const loadingState = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-button');
  const b = host?.shadowRoot?.querySelector('button');
  return {
    busy: b?.getAttribute('aria-busy'),
    box: b?.getBoundingClientRect().toJSON(),
    spinnerVisible:
      getComputedStyle(host?.shadowRoot?.querySelector('.button__spinner') ?? b).display !== 'none',
  };
});
check('valid submit: aria-busy=true + spinner while loading', loadingState.busy === 'true' && loadingState.spinnerVisible);
check(
  'button width frozen during loading',
  Math.abs((loadingState.box?.width ?? 0) - (buttonBox?.width ?? 0)) < 0.5,
  `${buttonBox?.width} → ${loadingState.box?.width}`,
);
await page.waitForTimeout(1400);
const resetState = await page.evaluate(() => {
  const host = document.querySelector('.tkf-panel tk-button');
  const progress = document.querySelector('.tkf-panel tk-progress-bar');
  return {
    busy: host?.shadowRoot?.querySelector('button')?.getAttribute('aria-busy'),
    lightToasts: document.querySelectorAll('tk-toast, [role="status"]').length,
    lightLive: document.querySelectorAll('[aria-live]').length,
    progressLive: progress?.shadowRoot?.querySelectorAll('[aria-live]').length ?? 0,
  };
});
check('button resets (aria-busy gone)', resetState.busy !== 'true');
check(
  'NO Toast / status surface appears (deferred to 4.3)',
  resetState.lightToasts === 0 && resetState.lightLive === 0,
  JSON.stringify(resetState),
);
check('ProgressBar stays 100% after the demo reset', (await progressBarValue(page)) === 100);
console.log(
  `aria-live census: light DOM=${resetState.lightLive}, inside ProgressBar (announce)=${resetState.progressLive}`,
);

// --- Step 7 — final tree --------------------------------------------------------
console.log('\n=== STEP 7 — final tree (filled form) ===');
console.log(await panelSnapshot(page));

// --- Step 8 — kit renders + error-state render for the side-by-side ------------
console.log('\n=== STEP 8 — kit renders ===');
// The preview's sticky disclaimer banner overlaps the scrolled panel top in
// element screenshots (muted band — the same band the visual baselines
// carry); it is page chrome, not the form, so the side-by-side captures
// hide it for a clean form-only record.
const hideDisclaimer = (page) =>
  page.evaluate(() => {
    document.querySelectorAll('.tk-docs-disclaimer').forEach((n) => n.remove());
  });
await page.reload();
await openStory(page, false);
await hideDisclaimer(page);
await page.evaluate(() => {
  (document.querySelector('.tkf-panel') ?? document.body).scrollIntoView();
});
await page.locator('.tkf-panel').screenshot({ path: new URL('kit-form-light.png', import.meta.url).pathname });
await submitButton.click(); // empty-ФИО submit → the story-driven error state
await page.waitForTimeout(50);
await page.locator('.tkf-panel').screenshot({ path: new URL('kit-form-error-light.png', import.meta.url).pathname });
await page.reload();
await openStory(page, true);
await hideDisclaimer(page);
await page.evaluate(() => {
  (document.querySelector('.tkf-panel') ?? document.body).scrollIntoView();
});
await page.locator('.tkf-panel').screenshot({ path: new URL('kit-form-dark.png', import.meta.url).pathname });

// --- Step 9 — axe, both themes ---------------------------------------------------
console.log('\n=== STEP 9 — axe both themes ===');
for (const dark of [false, true]) {
  // Navigate per iteration BEFORE analyzing: the loop's earlier shape kept
  // the page on step 8's DARK render for both passes, so the [light] check
  // was a vacuous mislabeled duplicate (review finding — corrected).
  await openStory(page, dark);
  const axe = await new AxeBuilder({ page }).withTags([...AXE_WCAG_TAGS]).analyze();
  const violations = axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  check(`axe zero violations [${dark ? 'dark' : 'light'}]`, violations.length === 0, violations.join('; '));
}

await context.close();
await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n=== SUMMARY: ${results.length - failed.length}/${results.length} checks passed ===`);
for (const f of failed) console.log(`FAILED: ${f.name} — ${f.detail}`);
process.exit(failed.length > 0 ? 1 : 0);
