// @vitest-environment happy-dom
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';

import { selectMenuStyles } from './select.css.js';
import { TK_SELECT_TYPEAHEAD_RESET_MS, TkSelect, type TkSelectOption } from './select.js';

/**
 * tk-select unit tests (spec 2.3): the nine I/O & edge-case matrix rows —
 * open+navigate (aria-activedescendant), Enter select, Escape-without-select,
 * typeahead (multi-char buffer, fake-timer reset), outside-click close +
 * focus return, focus-loss close (natural tab order), disabled-option
 * behavior (skipped, unselectable), controlled strictness/release seeding
 * (mirroring tk-input's suite), long-list scrollIntoView — plus the aria
 * wiring (expanded/controls/activedescendant/selected/described-by), the
 * open-change event, and the CONTROLLER integration: the menu panel is
 * mounted through mountOverlay (dropdown layer) and positioned through
 * positionFloating (anchor-min-width) — asserted via the DOM effects the
 * controller leaves (container reparenting, z token, inline fixed styles),
 * with zero popover API in happy-dom (the stub-boundary note in
 * overlays.test.ts; happy-dom runs the controller's container fallback path).
 */

const elementUpdated = (el: TkSelect): Promise<unknown> => el.updateComplete;

/** Reference-flavored fixture (tbank.ru cashback categories). */
const CASHBACK: TkSelectOption[] = [
  { value: 'all', label: '1% Все покупки' },
  { value: 'restaurants', label: '5% Рестораны' },
  { value: 'pharmacy', label: '5% Аптеки' },
  { value: 'ozon', label: '5% Ozon.ru' },
  { value: 'perekrestok', label: '3% Пятёрочка', disabled: true },
  { value: 'sport', label: '5% Спорттовары' },
  { value: 'taxi', label: '5% Такси' },
];

/** Typeahead-focused fixture: distinct Cyrillic first letters. */
const ALPHABETICAL: TkSelectOption[] = [
  { value: 'a', label: 'Аптеки' },
  { value: 'r', label: 'Рестораны' },
  { value: 's', label: 'Спорттовары' },
  { value: 't', label: 'Такси' },
];

let warnSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkSelect>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkSelect> => {
  const el = new TkSelect();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const trigger = (el: TkSelect): HTMLButtonElement => {
  const button = el.shadowRoot?.querySelector('.field__trigger');
  expect(button, 'combobox trigger renders').toBeInstanceOf(HTMLButtonElement);
  return button as HTMLButtonElement;
};

const press = (el: TkSelect, key: string, init: KeyboardEventInit = {}): boolean =>
  trigger(el).dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  );

const panel = (el: TkSelect): Element => {
  // While OPEN the controller owns the panel (reparented into the overlay
  // container on the fallback path); while closed it lives in tk-select's
  // shadow tree next to the trigger (single-tree aria id refs — see the
  // class doc). Found via the trigger's aria-controls id — valid in both.
  const id = trigger(el).getAttribute('aria-controls') ?? '';
  const menu = el.shadowRoot?.getElementById(id) ?? document.getElementById(id);
  expect(menu, 'listbox panel exists (shadow tree or overlay container)').not.toBeNull();
  return menu as Element;
};

const rows = (el: TkSelect): Element[] => Array.from(panel(el).querySelectorAll('[role="option"]'));

const displayValue = (el: TkSelect): string =>
  (el.shadowRoot?.querySelector('.field__value')?.textContent ?? '').trim();

const collectValues = (el: TkSelect): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    values.push((event as CustomEvent<{ value: string }>).detail.value);
  });
  return values;
};

const collectOpenStates = (el: TkSelect): boolean[] => {
  const states: boolean[] = [];
  el.addEventListener('open-change', (event: Event) => {
    states.push((event as CustomEvent<{ value: boolean }>).detail.value);
  });
  return states;
};

/** focusout with a controllable relatedTarget (happy-dom FocusEventInit-proof). */
const focusoutTo = (el: TkSelect, relatedTarget: Node | null): void => {
  const event = new Event('focusout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  trigger(el).dispatchEvent(event);
};

const outsidePointerDown = (target: Element): void => {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
};

describe('tk-select', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('registers as tk-select exposing TkSelect', async () => {
    await customElements.whenDefined('tk-select');
    expect(customElements.get('tk-select')).toBe(TkSelect);
  });

  it('option hover/active steps consume SEMANTICS, not scale tokens (5.4 dark sweep pin)', () => {
    // The F3 fix's mechanical half: gray-100 painted a near-white hover chip
    // on the dark menu (scale tokens carry no dark remap). hover =
    // surface-muted (light value = gray-100's hex), active = surface-field —
    // a regression back to a scale token fails here, not in a screenshot.
    const cssText = selectMenuStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(cssText).toMatch(
      /\[role='option'\]:hover\)\s*\{[^}]*background:\s*var\(--tk-color-surface-muted\)/,
    );
    expect(cssText).toMatch(
      /\.tk-active\)\s*\{[^}]*background:\s*var\(--tk-color-surface-field\)/,
    );
    expect(cssText).not.toMatch(/var\(--tk-color-gray-100\)/);
  });

  it('renders the combobox trigger with field language and aria wiring', async () => {
    const el = await mount({
      attributes: { label: 'Кэшбэк', placeholder: 'Выберите категорию', required: '' },
      props: { options: CASHBACK },
    });
    const button = trigger(el);
    expect(button.getAttribute('role')).toBe('combobox');
    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-labelledby')).toBeTruthy();
    expect(el.shadowRoot?.getElementById(button.getAttribute('aria-labelledby') ?? '')?.textContent).toContain('Кэшбэк');
    expect(button.getAttribute('aria-required')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(panel(el).id);
    // The listbox itself is named (axe aria-input-field-name): label first.
    expect(panel(el).getAttribute('aria-label')).toBe('Кэшбэк');
    expect(displayValue(el)).toBe('Выберите категорию');
    // The panel is a generated SHADOW-tree child, hidden when closed.
    expect(panel(el).hasAttribute('hidden')).toBe(true);
    // Chevron is decorative.
    expect(el.shadowRoot?.querySelector('.field__chevron')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows the selected option label and reflects boolean props, never value props', async () => {
    const el = await mount({ props: { options: CASHBACK, defaultValue: 'restaurants' } });
    expect(displayValue(el)).toBe('5% Рестораны');
    el.required = true;
    el.open = true;
    await elementUpdated(el);
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.hasAttribute('open')).toBe(true);
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).toBe(true); // reflection
    expect(el.hasAttribute('open')).toBe(false); // disabled closes (behavior test below)
    el.value = 'taxi';
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
  });

  // --- Matrix row 1: open + navigate --------------------------------------

  it('Enter opens: menu mounts controller-side (dropdown layer, anchor-min-width), visual focus starts at the selected option', async () => {
    const el = await mount({ props: { options: CASHBACK, defaultValue: 'ozon' } });
    const openStates = collectOpenStates(el);
    press(el, 'Enter');
    await elementUpdated(el);

    expect(el.open).toBe(true);
    expect(openStates).toEqual([true]);
    expect(panel(el).hasAttribute('hidden')).toBe(false);

    // Controller integration (container fallback path — happy-dom has no
    // popover API): reparented into the overlay container, z only via the
    // dropdown layer token, positioned fixed by positionFloating with the
    // anchor-min-width match applied (width 0 here — no layout engine).
    expect(panel(el).parentElement?.id).toBe('tk-overlay-root');
    expect((panel(el) as HTMLElement).style.zIndex).toBe('var(--tk-z-dropdown)');
    expect((panel(el) as HTMLElement).style.position).toBe('fixed');
    expect((panel(el) as HTMLElement).style.minWidth).toBe('0px');

    // Visual focus starts at the SELECTED option, not the first.
    const button = trigger(el);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[3]?.id);
    expect(rows(el)[3]?.getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowDown/ArrowUp move visual focus (aria-activedescendant follows, wrapping, disabled rows skipped)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'ArrowDown'); // open at first enabled
    await elementUpdated(el);
    const button = trigger(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[0]?.id);

    press(el, 'ArrowDown'); // 0 → 1
    press(el, 'ArrowDown'); // 1 → 2
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[2]?.id);

    press(el, 'ArrowDown'); // 2 → 3
    press(el, 'ArrowDown'); // 3 → 4 disabled → SKIPPED to 5
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[5]?.id);

    press(el, 'ArrowDown'); // 5 → 6
    press(el, 'ArrowDown'); // 6 → WRAP to 0
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[0]?.id);

    press(el, 'ArrowUp'); // 0 → wrap to 6
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[6]?.id);
  });

  it('ArrowDown opens when closed; ArrowUp opens at the last enabled option', async () => {
    const down = await mount({ props: { options: CASHBACK } });
    press(down, 'ArrowDown');
    await elementUpdated(down);
    expect(down.open).toBe(true);
    expect(trigger(down).getAttribute('aria-activedescendant')).toBe(rows(down)[0]?.id);

    const up = await mount({ props: { options: CASHBACK } });
    press(up, 'ArrowUp');
    await elementUpdated(up);
    expect(up.open).toBe(true);
    expect(trigger(up).getAttribute('aria-activedescendant')).toBe(rows(up)[6]?.id);
  });

  it('Home/End jump first/last enabled option; they also open when closed', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'End');
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[6]?.id);

    press(el, 'Home');
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[0]?.id);
  });

  // --- Matrix row 2: select ------------------------------------------------

  it('Enter on the active option selects: value-change emits, menu closes, focus stays on the trigger', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    const values = collectValues(el);
    const openStates = collectOpenStates(el);
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'ArrowDown'); // → option 1
    press(el, 'Enter');
    await elementUpdated(el);

    expect(values).toEqual(['restaurants']);
    expect(openStates).toEqual([true, false]);
    expect(el.open).toBe(false);
    expect(displayValue(el)).toBe('5% Рестораны');
    expect(panel(el).hasAttribute('hidden')).toBe(true);
    // Uncontrolled: the channel stays free — state lives inside.
    expect(el.value).toBeUndefined();
  });

  it('Space opens when closed; Enter-only selects while open (Space is inert by design)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, ' ');
    await elementUpdated(el);
    expect(el.open).toBe(true);

    const values = collectValues(el);
    press(el, ' ');
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(values).toEqual([]);
  });

  it('clicking an option selects it (pointerdown on the panel never moves focus)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    const values = collectValues(el);

    // The panel prevents pointerdown default (focus stays on the trigger).
    const row = rows(el)[2] as HTMLElement;
    row.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    row.click();
    await elementUpdated(el);

    expect(values).toEqual(['pharmacy']);
    expect(el.open).toBe(false);
    expect(displayValue(el)).toBe('5% Аптеки');
  });

  it('clicking the trigger toggles open/closed', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    trigger(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(true);
    trigger(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  // --- Matrix row 3: Escape --------------------------------------------------

  it('Escape closes WITHOUT changing value; open-change carries false', async () => {
    const el = await mount({ props: { options: CASHBACK, defaultValue: 'all' } });
    const values = collectValues(el);
    const openStates = collectOpenStates(el);
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'ArrowDown');
    press(el, 'Escape');
    await elementUpdated(el);

    expect(el.open).toBe(false);
    expect(values).toEqual([]);
    expect(openStates).toEqual([true, false]);
    expect(displayValue(el)).toBe('1% Все покупки');
  });

  // --- Matrix row 4: typeahead -------------------------------------------------

  it('typeahead composes a multi-char buffer and jumps to the first enabled prefix match', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { options: ALPHABETICAL } });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'Home');
    const button = trigger(el);

    press(el, 'с');
    vi.advanceTimersByTime(100);
    press(el, 'п');
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[2]?.id); // Спорттовары

    // A char that extends past any match keeps the current active («no match → stays»).
    press(el, 'я');
    await elementUpdated(el);
    expect(button.getAttribute('aria-activedescendant')).toBe(rows(el)[2]?.id);
  });

  it('the buffer resets after the timing constant (500ms) — fresh prefixes start over', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { options: ALPHABETICAL } });
    expect(TK_SELECT_TYPEAHEAD_RESET_MS).toBe(500);
    press(el, 'т'); // closed → opens + jumps to Такси
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[3]?.id);

    vi.advanceTimersByTime(TK_SELECT_TYPEAHEAD_RESET_MS);
    press(el, 'а'); // fresh buffer: Аптеки — WITHOUT the reset the buffer «та» would keep Такси
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[0]?.id);
  });

  it('typeahead while closed opens the menu and jumps', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { options: ALPHABETICAL } });
    press(el, 'р');
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[1]?.id);
  });

  // --- Matrix row 5: outside click ---------------------------------------------

  it('outside click closes and returns focus to the trigger', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    const button = trigger(el);
    const focusSpy = vi.spyOn(button, 'focus');

    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    outsidePointerDown(outsider);
    await elementUpdated(el);

    expect(el.open).toBe(false);
    expect(focusSpy).toHaveBeenCalled();
    // Focus returned: the trigger IS the shadow root's active element —
    // strict identity, no truthy-parse escape hatch.
    expect(el.shadowRoot?.activeElement).toBe(button);
    // ...and it STAYS there: the real-browser race (a late focus move after
    // the close settles) is what the spy alone cannot prove — one macrotask
    // later the trigger still holds focus.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.shadowRoot?.activeElement).toBe(button);
  });

  it('a press inside the trigger or panel does NOT close', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    outsidePointerDown(el); // host boundary (shadow presses retarget here)
    expect(el.open).toBe(true);
    outsidePointerDown(panel(el));
    expect(el.open).toBe(true);
  });

  // --- Matrix row 6: focus loss ---------------------------------------------------

  it('focus leaving the whole component closes (natural tab order — no forced focus return)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    const button = trigger(el);
    const focusSpy = vi.spyOn(button, 'focus');

    const elsewhere = document.createElement('input');
    document.body.appendChild(elsewhere);
    focusoutTo(el, elsewhere);
    await elementUpdated(el);

    expect(el.open).toBe(false);
    expect(focusSpy, 'focus follows natural tab order — never forced back').not.toHaveBeenCalled();
  });

  it('focusout with relatedTarget inside the component keeps the menu open', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    focusoutTo(el, el);
    await elementUpdated(el);
    expect(el.open).toBe(true);
  });

  // --- Matrix row 7: disabled options --------------------------------------------

  it('disabled options: never selected by Enter or click, skipped by navigation and typeahead', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    const values = collectValues(el);
    press(el, 'Enter');
    await elementUpdated(el);
    expect(rows(el)[4]?.getAttribute('aria-disabled')).toBe('true');
    expect(rows(el)[0]?.getAttribute('aria-disabled')).toBeNull();

    // Enter never lands on a disabled row (navigation skips index 4).
    press(el, 'End'); // → 6
    press(el, 'ArrowUp'); // 6 → 5
    press(el, 'ArrowUp'); // 5 → 4 disabled → skipped to 3
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[3]?.id);

    // Direct click on a disabled row selects nothing and does not close.
    (rows(el)[4] as HTMLElement).click();
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(el.open).toBe(true);
  });

  it('an all-disabled list opens with no visual focus and selects nothing', async () => {
    const el = await mount({
      props: { options: [{ value: 'x', label: 'X', disabled: true }] },
    });
    press(el, 'Enter');
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBeNull();
    press(el, 'Enter');
    await elementUpdated(el);
    expect(el.open).toBe(true);
  });

  // --- Matrix row 8: controlled (mirrors tk-input's suite) -------------------------

  it('controlled selection: value-change emits, nothing mutates locally; display renders exactly value', async () => {
    const el = await mount({ props: { options: CASHBACK, value: 'all' } });
    const values = collectValues(el);
    expect(displayValue(el)).toBe('1% Все покупки');

    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'ArrowDown');
    press(el, 'Enter');
    await elementUpdated(el);

    expect(values).toEqual(['restaurants']);
    expect(el.value, 'strict: the channel is untouched by selection').toBe('all');
    // Renders exactly the consumer value until the consumer answers.
    expect(displayValue(el)).toBe('1% Все покупки');

    el.value = 'restaurants';
    await elementUpdated(el);
    expect(displayValue(el)).toBe('5% Рестораны');
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { options: CASHBACK, value: 'all' } });
    el.value = 'taxi';
    await elementUpdated(el);
    el.value = undefined; // release
    await elementUpdated(el);
    expect(displayValue(el)).toBe('5% Такси');
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    press(el, 'Enter'); // opens at the seeded selection (taxi, index 6)
    await elementUpdated(el);
    press(el, 'ArrowUp'); // 6 → 5 (Спорттовары)
    press(el, 'Enter');
    await elementUpdated(el);
    expect(values).toEqual(['sport']);
    expect(displayValue(el)).toBe('5% Спорттовары');
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { options: CASHBACK, value: 'all' } });
    el.value = undefined;
    await elementUpdated(el);
    el.value = 'ozon';
    await elementUpdated(el);
    expect(displayValue(el)).toBe('5% Ozon.ru');
    el.requestUpdate();
    await elementUpdated(el);
    expect(displayValue(el)).toBe('5% Ozon.ru');
  });

  it('defaultValue seeds the uncontrolled state; mutated after connect it is ignored', async () => {
    const el = await mount({ attributes: { 'default-value': 'ozon' }, props: { options: CASHBACK } });
    expect(displayValue(el)).toBe('5% Ozon.ru');
    el.defaultValue = 'taxi';
    await elementUpdated(el);
    expect(displayValue(el)).toBe('5% Ozon.ru');
  });

  it('value wins over defaultValue when both are set (controlled at first paint)', async () => {
    const el = await mount({
      attributes: { 'default-value': 'ozon' },
      props: { options: CASHBACK, value: 'all' },
    });
    expect(displayValue(el)).toBe('1% Все покупки');
  });

  it('clamps non-string value channel inputs; null label/error mean absent (React conditionals)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    el.value = 123 as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('123');
    expect(displayValue(el), 'unmatched value → placeholder, never a crash').toBe('');

    const quiet = await mount({
      props: { options: CASHBACK, label: null as unknown as string, error: null as unknown as string },
    });
    expect(quiet.shadowRoot?.querySelector('label')).toBeNull();
    expect(quiet.shadowRoot?.querySelector('.error')).toBeNull();
  });

  it('an unmatched controlled value shows the placeholder (no phantom option)', async () => {
    const el = await mount({
      attributes: { placeholder: 'Выберите категорию' },
      props: { options: CASHBACK, value: 'nope' },
    });
    expect(displayValue(el)).toBe('Выберите категорию');
    expect(trigger(el).getAttribute('aria-invalid')).toBeNull();
  });

  // --- Error / disabled field states ---------------------------------------------

  it('consumer error renders with icon, aria-invalid and described-by wiring', async () => {
    const el = await mount({
      attributes: { label: 'Кэшбэк' },
      props: { options: CASHBACK, error: 'Выберите категорию' },
    });
    const button = trigger(el);
    const message = el.shadowRoot?.querySelector('.error');
    expect(message?.textContent).toContain('Выберите категорию');
    expect(button.getAttribute('aria-invalid')).toBe('true');
    expect(button.getAttribute('aria-describedby')).toBe(message?.getAttribute('id'));
    expect(el.shadowRoot?.querySelector('.error__icon')?.getAttribute('aria-hidden')).toBe('true');

    el.error = undefined;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(button.getAttribute('aria-invalid')).toBeNull();
  });

  it('disabled: aria-disabled on the trigger, inert interactions, and an open menu closes', async () => {
    const el = await mount({ props: { options: CASHBACK, disabled: true } });
    const button = trigger(el);
    expect(button.getAttribute('aria-disabled')).toBe('true');

    press(el, 'Enter');
    await elementUpdated(el);
    expect(el.open).toBe(false);
    trigger(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(false);

    el.disabled = false;
    await elementUpdated(el);
    press(el, 'Enter');
    await elementUpdated(el);
    expect(el.open).toBe(true);
    el.disabled = true; // disabling while open closes
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  // --- Matrix row 9: long list ---------------------------------------------------

  it('long lists: the panel scrolls internally and the active row is scrolled into view (block nearest)', async () => {
    const many: TkSelectOption[] = Array.from({ length: 30 }, (_, i) => ({
      value: `v${i}`,
      label: `Опция ${i + 1}`,
    }));
    const el = await mount({ props: { options: many } });
    press(el, 'Enter');
    await elementUpdated(el);
    expect(rows(el)).toHaveLength(30);

    const scrolled: string[] = [];
    for (const row of rows(el)) {
      vi.spyOn(row, 'scrollIntoView').mockImplementation(((arg?: unknown) => {
        scrolled.push(`${row.id}:${JSON.stringify(arg)}`);
      }) as Element['scrollIntoView']);
    }
    press(el, 'End');
    await elementUpdated(el);
    expect(scrolled.at(-1)).toContain(rows(el)[29]?.id ?? '');
    expect(scrolled.at(-1)).toContain('"nearest"'); // block: 'nearest' arg
  });

  it('open-change mirrors interaction flips (composed, bubbles, detail { value })', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    const seen: boolean[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('open-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'Escape');
    await elementUpdated(el);
    expect(seen).toEqual([true, false]);
    expect(composedHeard).toEqual([true, true]);
  });

  it('closing unmounts the panel from the controller and re-homes it into the shadow tree (next open works)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    const menu = panel(el);
    expect(menu.parentElement?.id).toBe('tk-overlay-root');

    press(el, 'Escape');
    await elementUpdated(el);
    // Re-homed into the SHADOW root (a shadow child's parentElement is null —
    // the ShadowRoot is not an Element; assert via the shadow tree instead).
    expect(el.shadowRoot?.contains(menu), 're-homed into the shadow tree').toBe(true);
    expect((menu as HTMLElement).style.zIndex).toBe(''); // controller snapshot restored
    expect(menu.hasAttribute('hidden')).toBe(true);

    press(el, 'Enter');
    await elementUpdated(el);
    expect(panel(el).parentElement?.id).toBe('tk-overlay-root');
  });

  it('the declarative open attribute establishes visual focus on the selected-or-first row (the Open-story path)', async () => {
    const el = await mount({ attributes: { open: '' }, props: { options: CASHBACK, defaultValue: 'sport' } });
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[5]?.id); // selected

    const fresh = await mount({ attributes: { open: '' }, props: { options: CASHBACK } });
    await elementUpdated(fresh);
    expect(trigger(fresh).getAttribute('aria-activedescendant')).toBe(rows(fresh)[0]?.id); // first enabled
  });

  it('setting open=false programmatically unmounts too (the frozen §9 declarative surface)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    el.open = true;
    await elementUpdated(el);
    expect(panel(el).parentElement?.id).toBe('tk-overlay-root');
    el.open = false;
    await elementUpdated(el);
    expect(panel(el).hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot?.contains(panel(el))).toBe(true);
  });

  it('ids are unique across instances (aria chains never cross elements)', async () => {
    const a = await mount({ attributes: { label: 'A' }, props: { options: CASHBACK } });
    const b = await mount({ attributes: { label: 'B' }, props: { options: CASHBACK } });
    expect(panel(a).id).not.toBe(panel(b).id);
    expect(trigger(a).getAttribute('aria-controls')).toBe(panel(a).id);
    expect(trigger(b).getAttribute('aria-controls')).toBe(panel(b).id);
  });

  // --- Review fixes (2.3 review pass) ---------------------------------------

  it('both label AND placeholder absent: trigger and panel fall back to the default accessible name (axe name-viable)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    const button = trigger(el);
    expect(button.getAttribute('aria-label')).toBe('Выбор');
    expect(button.getAttribute('aria-labelledby')).toBeNull();
    expect(panel(el).getAttribute('aria-label')).toBe('Выбор');
  });

  it('typeahead survives nullish option labels (loose consumer data never crashes the matcher)', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: {
        options: [
          { value: 'x', label: undefined as unknown as string },
          { value: 'y', label: 'Ясли' },
        ],
      },
    });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'я'); // would TypeError on option 0's undefined label without the guard
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[1]?.id);
  });

  it('Space while open is inert AND never feeds the typeahead buffer', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { options: ALPHABETICAL } });
    press(el, 'Enter'); // opens at the first row (Аптеки)
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[0]?.id);

    press(el, ' '); // inert while open
    await elementUpdated(el);
    expect(el.open).toBe(true);

    // «Space then т» still matches: a CLEAN buffer ('т') jumps to Такси; a
    // Space-polluted one (' т') matches nothing and would stay on Аптеки.
    press(el, 'т');
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[3]?.id);
  });

  it('IME composition keydowns are fully inert (isComposing / keyCode 229)', async () => {
    const el = await mount({ props: { options: ALPHABETICAL } });
    const composing = new KeyboardEvent('keydown', {
      key: 'р',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(composing, 'isComposing', { value: true });
    trigger(el).dispatchEvent(composing);
    const legacy = new KeyboardEvent('keydown', {
      key: 'р',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(legacy, 'keyCode', { value: 229 });
    trigger(el).dispatchEvent(legacy);
    await elementUpdated(el);
    expect(el.open, 'composition input neither opens nor types ahead').toBe(false);
  });

  it('zero options: keyboard and click opens stay inert (no expanded empty listbox)', async () => {
    const el = await mount({ props: { options: [] } });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'ArrowDown');
    await elementUpdated(el);
    trigger(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(false);

    el.options = CASHBACK; // options arrive later → interaction works again
    await elementUpdated(el);
    press(el, 'Enter');
    await elementUpdated(el);
    expect(el.open).toBe(true);
  });

  it('options/value/label changing while open keeps aria-activedescendant on a LIVE option id', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'End'); // active = index 6
    await elementUpdated(el);
    expect(trigger(el).getAttribute('aria-activedescendant')).toBe(rows(el)[6]?.id);

    el.options = CASHBACK.slice(0, 3); // shrink → active must clamp to 2
    await elementUpdated(el);
    await elementUpdated(el); // the requested follow-up pass renders the trigger
    const described = trigger(el).getAttribute('aria-activedescendant');
    expect(described).toBe(rows(el)[2]?.id);
    expect(described, 'the referenced id exists in the live DOM').toBeTruthy();
    expect(panel(el).querySelector(`#${described}`)).not.toBeNull();

    el.label = 'Кэшбэк (обновлено)'; // label change while open re-syncs names
    await elementUpdated(el);
    expect(panel(el).getAttribute('aria-label')).toBe('Кэшбэк (обновлено)');
  });

  it('duplicate option values clamp: later duplicates drop with a dev warn, the first row selects', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'a', label: 'Первая' },
          { value: 'a', label: 'Дубликат' },
          { value: 'b', label: 'Вторая' },
        ],
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('tk-select: duplicate'));
    warnSpy.mockClear();
    press(el, 'Enter');
    await elementUpdated(el);
    expect(rows(el)).toHaveLength(2); // the duplicate row never renders

    const values = collectValues(el);
    (rows(el)[0] as HTMLElement).click();
    await elementUpdated(el);
    expect(values).toEqual(['a']);
    expect(displayValue(el)).toBe('Первая'); // the FIRST occurrence wins
    expect(warnSpy).not.toHaveBeenCalled(); // converged — no warn loop
  });

  it('open-change fires AFTER the mount/position work (the panel is visible + positioned at event time)', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    const atEvent: Array<{ value: boolean; hidden: boolean; parent: string | null; position: string }> = [];
    el.addEventListener('open-change', (event: Event) => {
      // At open-event time the controller may already have reparented the
      // panel into the overlay container (the fallback path) — look in both
      // trees, like the panel() helper.
      const panelId = trigger(el).getAttribute('aria-controls') ?? '';
      const menu = el.shadowRoot?.getElementById(panelId) ?? document.getElementById(panelId);
      atEvent.push({
        value: (event as CustomEvent<{ value: boolean }>).detail.value,
        hidden: menu?.hasAttribute('hidden') ?? true,
        parent: menu?.parentElement?.id || menu?.parentElement?.tagName || null,
        position: menu instanceof HTMLElement ? menu.style.position : '',
      });
    });
    press(el, 'Enter');
    await elementUpdated(el);
    press(el, 'Escape');
    await elementUpdated(el);
    expect(atEvent).toHaveLength(2);
    expect(atEvent[0]?.value).toBe(true);
    expect(atEvent[0]?.hidden, 'panel already visible when open-change(true) fires').toBe(false);
    expect(atEvent[0]?.parent).toBe('tk-overlay-root'); // controller-mounted
    expect(atEvent[0]?.position).toBe('fixed'); // positionFloating already ran
    expect(atEvent[1]?.value).toBe(false);
  });

  it('detaching the element tears the menu down quietly', async () => {
    const el = await mount({ props: { options: CASHBACK } });
    press(el, 'Enter');
    await elementUpdated(el);
    const menu = panel(el);
    el.remove();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
  });
});
