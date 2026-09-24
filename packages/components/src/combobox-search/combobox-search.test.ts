// @vitest-environment happy-dom
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkComboboxSearch, type TkComboboxSearchOption } from './combobox-search.js';

/**
 * tk-combobox-search unit tests (spec 6.3): the full I/O & edge-case matrix —
 * filter-by-label-AND-value, typing-opens, match-count announcements (RU
 * pluralization + the prop templates), combobox aria wiring with
 * aria-activedescendant navigation (focus NEVER leaves the field), Enter
 * commit / Escape restore / outside-press / focus-loss closing, the IME
 * composition pause, the long-list scroll reveal, mid-open data re-clamps —
 * plus the frozen §4 strictness/release suite (mirroring tk-select's) and
 * the CONTROLLER integration: the panel mounts through mountOverlay
 * ('dropdown' layer) and positions through positionFloating (anchor =
 * the field box, exact width match) — asserted via the DOM effects the
 * controller leaves, with zero popover API in happy-dom (the container
 * fallback path — the select suite's note).
 */

const elementUpdated = (el: TkComboboxSearch): Promise<unknown> => el.updateComplete;

/** The reference's own instrument set (invest/stocks catalog, spec 6.3). */
const INSTRUMENTS: TkComboboxSearchOption[] = [
  { value: 'GAZP', label: 'Газпром' },
  { value: 'SBER', label: 'Сбербанк' },
  { value: 'LKOH', label: 'Лукойл' },
  { value: 'GMKN', label: 'Норникель' },
  { value: 'YNDX', label: 'Яндекс' },
  { value: 'TCSG', label: 'Т-Технологии' },
  { value: 'ROSN', label: 'Роснефть' },
  { value: 'NVDA', label: 'NVIDIA' },
  { value: 'AAPL', label: 'Apple' },
  { value: 'MOEX', label: 'Московская биржа' },
];

/** Synthetic long lists for pluralization counts and the scroll fold. */
const makeOptions = (count: number): TkComboboxSearchOption[] =>
  Array.from({ length: count }, (_, index) => ({ value: `o${index}`, label: `Опция ${index}` }));

let warnSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkComboboxSearch>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkComboboxSearch> => {
  const el = new TkComboboxSearch();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const control = (el: TkComboboxSearch): HTMLInputElement => {
  const node = el.shadowRoot?.querySelector<HTMLInputElement>('.field__control');
  expect(node, 'the field control renders').toBeTruthy();
  return node as HTMLInputElement;
};

/** The suggestion panel — shadow tree while closed, the overlay container while open (both-trees lookup). */
const menuPanel = (el: TkComboboxSearch): HTMLElement | null => {
  const id = control(el).getAttribute('aria-controls') ?? '';
  return (el.shadowRoot?.getElementById(id) ?? document.getElementById(id)) ?? null;
};

const menuRows = (el: TkComboboxSearch): Element[] => {
  const panel = menuPanel(el);
  return panel ? [...panel.querySelectorAll('[role="option"]:not([aria-disabled="true"])')] : [];
};

const statusRegion = (el: TkComboboxSearch): Element | null =>
  el.shadowRoot?.querySelector('.status') ?? null;

const collectValues = (el: TkComboboxSearch): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    values.push((event as CustomEvent<{ value: string }>).detail.value);
  });
  return values;
};

/**
 * The typing path: set the control's text and fire the input event, exactly
 * as native typing does (optionally as an IME composition event).
 */
const typeInto = (el: TkComboboxSearch, text: string, isComposing = false): void => {
  const node = control(el);
  node.value = text;
  const event = new Event('input', { bubbles: true, composed: true });
  Object.defineProperty(event, 'isComposing', { value: isComposing });
  node.dispatchEvent(event);
};

const press = (target: Element, key: string): boolean =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

const outsidePointerDown = (target: Element): void => {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
};

/** focusout with a controllable relatedTarget (happy-dom FocusEventInit-proof). */
const focusoutTo = (el: TkComboboxSearch, relatedTarget: Node | null): void => {
  const event = new Event('focusout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  el.shadowRoot?.querySelector('.field')?.dispatchEvent(event);
};

describe('tk-combobox-search', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-combobox-search exposing TkComboboxSearch', async () => {
    await customElements.whenDefined('tk-combobox-search');
    expect(customElements.get('tk-combobox-search')).toBe(TkComboboxSearch);
  });

  it('renders the borderless search anatomy with the combobox aria wiring and a hidden listbox', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const node = control(el);

    expect(el.shadowRoot?.querySelector('.field'), 'the 52px field box renders').toBeTruthy();
    expect(el.shadowRoot?.querySelector('.field__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(node.type).toBe('text');
    expect(node.getAttribute('role')).toBe('combobox');
    expect(node.getAttribute('aria-haspopup')).toBe('listbox');
    expect(node.getAttribute('aria-expanded')).toBe('false');
    expect(node.getAttribute('aria-autocomplete')).toBe('list');
    expect(node.getAttribute('autocomplete')).toBe('off');
    expect(node.getAttribute('aria-label'), 'the fallback name stands in').toBe('Поиск');
    expect(node.getAttribute('placeholder')).toBe('Название или тикер');
    expect(node.getAttribute('aria-activedescendant')).toBeNull();

    const panel = menuPanel(el);
    expect(panel, 'aria-controls references a REAL node (eager panel creation)').toBeTruthy();
    expect(panel?.getAttribute('role')).toBe('listbox');
    expect(panel?.hasAttribute('hidden'), 'panel hidden while closed').toBe(true);
    expect(el.shadowRoot?.contains(panel), 'a shadow-tree child while closed').toBe(true);

    const status = statusRegion(el);
    expect(status, 'the polite region renders').toBeTruthy();
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.textContent, 'silent while closed').toBe('');
  });

  it('label/placeholder props override the accessible names of field AND panel', async () => {
    const el = await mount({
      props: { options: INSTRUMENTS, label: 'Инструменты', placeholder: 'Поиск' },
    });
    expect(control(el).getAttribute('aria-label')).toBe('Инструменты');
    expect(control(el).getAttribute('placeholder')).toBe('Поиск');
    expect(menuPanel(el)?.getAttribute('aria-label')).toBe('Инструменты');

    const defaults = await mount({ props: { options: INSTRUMENTS } });
    expect(menuPanel(defaults)?.getAttribute('aria-label'), 'panel falls back to the placeholder').toBe(
      'Название или тикер',
    );
  });

  it('the field shows the committed label; a FOREIGN value renders as itself — nothing clamps', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'SBER' } });
    expect(control(el).value).toBe('Сбербанк');

    const foreign = await mount({ props: { options: INSTRUMENTS, value: 'XYZ' } });
    expect(control(foreign).value, 'free-text channel: the foreign value holds').toBe('XYZ');
    expect(foreign.value).toBe('XYZ');

    const empty = await mount({ props: { options: INSTRUMENTS } });
    expect(control(empty).value).toBe('');
  });

  // --- Matrix rows 1–2: filter + typing-opens ---------------------------------------

  it('typing filters case-insensitively over label AND value, stable order, WITHOUT touching the value channel', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'GAZP' } });
    const values = collectValues(el);

    typeInto(el, 'газ'); // label-first, lowercase query, uppercase label
    await elementUpdated(el);
    expect(el.value, 'uncontrolled: no controlled channel exposed').toBeUndefined();
    expect(values).toEqual([]);

    typeInto(el, 'gaz'); // the same row via the VALUE — one match either way
    await elementUpdated(el);
    expect(menuRows(el).map((row) => row.textContent?.trim())).toEqual(['Газпром']);

    typeInto(el, 'sb'); // ticker-first typing
    await elementUpdated(el);
    expect(menuRows(el).map((row) => row.textContent?.trim())).toEqual(['Сбербанк']);
  });

  it('typing OPENS the menu controller-side (dropdown layer, field-anchored, width-matched) with the first row active', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'газ');
    await elementUpdated(el);

    const node = control(el);
    expect(node.getAttribute('aria-expanded')).toBe('true');
    const panel = menuPanel(el) as HTMLElement;
    expect(panel.hasAttribute('hidden')).toBe(false);
    // Controller integration (container fallback path — happy-dom has no
    // popover API): reparented into the overlay container, z only via the
    // dropdown layer token, positioned fixed with the exact width match.
    expect(panel.parentElement?.id).toBe('tk-overlay-root');
    expect(panel.style.zIndex).toBe('var(--tk-z-dropdown)');
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.width, 'matchAnchorWidth true: width pinned to the anchor').toBe('0px');

    const rows = menuRows(el);
    expect(rows).toHaveLength(1);
    expect(node.getAttribute('aria-activedescendant')).toBe(rows[0]?.id);
    expect(rows[0]?.classList.contains('tk-active')).toBe(true);
  });

  it('a printable KEYPRESS alone does not open — the input event is the open path', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    press(control(el), 'a');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded'), 'printable keys ride native input').toBe('false');
    typeInto(el, 'a');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('true');
  });

  // --- Matrix row 3: announcements ---------------------------------------------------

  it('the polite region announces the match count with correct RU pluralization after each filter', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'газ'); // 1 — singular
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Найден 1 инструмент');

    typeInto(el, 'с'); // Сбербанк, Роснефть, Московская биржа + TCSG — 4 — few
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Найдено 4 инструмента');

    typeInto(el, 'a'); // GAZP + the NVIDIA and Apple options (label AND value are the SAME options) — 3
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Найдено 3 инструмента');

    typeInto(el, 'zzz'); // zero — the no-results message
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Ничего не найдено');
  });

  it('pluralization holds across the RU decades (11 many, 21 singular, 22 few)', async () => {
    const eleven = await mount({ props: { options: makeOptions(11) } });
    typeInto(eleven, 'опц');
    await elementUpdated(eleven);
    expect(statusRegion(eleven)?.textContent).toBe('Найдено 11 инструментов');

    const twentyOne = await mount({ props: { options: makeOptions(21) } });
    typeInto(twentyOne, 'опц');
    await elementUpdated(twentyOne);
    expect(statusRegion(twentyOne)?.textContent).toBe('Найден 21 инструмент');

    const twentyTwo = await mount({ props: { options: makeOptions(22) } });
    typeInto(twentyTwo, 'опц');
    await elementUpdated(twentyTwo);
    expect(statusRegion(twentyTwo)?.textContent).toBe('Найдено 22 инструмента');
  });

  it('resultsMessage / noResultsMessage override the announcement text ({n} template)', async () => {
    const el = await mount({
      props: { options: INSTRUMENTS, resultsMessage: 'Matches: {n} of {n}', noResultsMessage: 'Пусто' },
    });
    typeInto(el, 'газ');
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Matches: 1 of 1');
    typeInto(el, 'zzz');
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Пусто');
  });

  // --- Matrix row 4: zero matches -----------------------------------------------------

  it('zero matches keep the menu open with the disabled empty row and NO activedescendant', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'zzz');
    await elementUpdated(el);

    const panel = menuPanel(el) as HTMLElement;
    expect(panel.hasAttribute('hidden'), 'the inverted 6.2 lesson: empty STAYS open').toBe(false);
    expect(menuRows(el)).toHaveLength(0);
    const emptyRow = panel.querySelector('[role="option"][aria-disabled="true"]');
    expect(emptyRow?.textContent?.trim()).toBe('Ничего не найдено');
    expect(control(el).getAttribute('aria-activedescendant')).toBeNull();
    expect(statusRegion(el)?.textContent).toBe('Ничего не найдено');
  });

  it('empty options behave the same: typing opens onto the no-results row', async () => {
    const el = await mount({ props: { options: [] } });
    typeInto(el, 'а');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('true');
    expect(menuPanel(el)?.querySelector('[aria-disabled="true"]')?.textContent?.trim()).toBe(
      'Ничего не найдено',
    );
  });

  // --- Matrix row 5: navigation --------------------------------------------------------

  it('ArrowDown/ArrowUp step the active row with WRAP; Home/End jump; the active mark and activedescendant follow', async () => {
    const el = await mount({ props: { options: INSTRUMENTS.slice(0, 3), defaultValue: 'LKOH' } });
    typeInto(el, 'о'); // Газпром (label), Лукойл (label+value) — committed Лукойл lands ACTIVE
    await elementUpdated(el);
    const node = control(el);
    let rows = menuRows(el);
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Газпром', 'Лукойл']);
    expect(node.getAttribute('aria-activedescendant')).toBe(rows[1]?.id); // committed survives the filter
    expect(rows[1]?.classList.contains('tk-active')).toBe(true);

    press(node, 'ArrowDown'); // 1 → wrap to 0
    await elementUpdated(el);
    rows = menuRows(el);
    expect(node.getAttribute('aria-activedescendant')).toBe(rows[0]?.id);
    expect(rows[0]?.classList.contains('tk-active')).toBe(true);

    press(node, 'ArrowUp'); // 0 → wrap to last
    await elementUpdated(el);
    expect(node.getAttribute('aria-activedescendant')).toBe(menuRows(el)[1]?.id);

    press(node, 'Home');
    await elementUpdated(el);
    expect(node.getAttribute('aria-activedescendant')).toBe(menuRows(el)[0]?.id);
    press(node, 'End');
    await elementUpdated(el);
    expect(node.getAttribute('aria-activedescendant')).toBe(menuRows(el)[1]?.id);
  });

  it('ArrowUp opens at the LAST row; ArrowDown at the first (the APG combobox edges); Home/End do NOT open', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const node = control(el);
    press(node, 'ArrowUp');
    await elementUpdated(el);
    const rows = menuRows(el);
    expect(node.getAttribute('aria-expanded')).toBe('true');
    expect(node.getAttribute('aria-activedescendant')).toBe(rows[rows.length - 1]?.id);

    press(node, 'Escape');
    await elementUpdated(el);
    press(node, 'End');
    await elementUpdated(el);
    expect(node.getAttribute('aria-expanded'), 'closed Home/End stay native caret moves').toBe('false');
  });

  it('the long list reveals the active row: End scrolls the last row into view (nearest)', async () => {
    const el = await mount({ props: { options: makeOptions(30) } });
    typeInto(el, 'опц');
    await elementUpdated(el);
    const panel = menuPanel(el) as HTMLElement;
    const last = panel.children[29] as HTMLElement;
    const spy = vi.spyOn(last, 'scrollIntoView');
    press(control(el), 'End');
    await elementUpdated(el);
    expect(spy).toHaveBeenCalledWith({ block: 'nearest' });
    expect(statusRegion(el)?.textContent).toBe('Найдено 30 инструментов');
  });

  // --- Matrix rows 6–8: commit / restore / closing --------------------------------------

  it('Enter commits the active row: value-change, uncontrolled applies, the field re-renders to the label, menu closes, focus STAYS in the field', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const values = collectValues(el);
    const node = control(el);
    node.focus();

    typeInto(el, 'сб');
    await elementUpdated(el);
    press(node, 'Enter');
    await elementUpdated(el);

    expect(values).toEqual(['SBER']);
    expect(el.value, 'uncontrolled: no controlled channel exposed').toBeUndefined();
    expect(node.value, 'the transient query gives way to the label').toBe('Сбербанк');
    expect(node.getAttribute('aria-expanded')).toBe('false');
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot?.activeElement, 'focus never left the field').toBe(node);
    expect(statusRegion(el)?.textContent, 'the region clears silently on close').toBe('');
  });

  it('Enter on the committed row is a close-with-no-change (native menu behavior)', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'LKOH' } });
    const values = collectValues(el);
    const node = control(el);
    typeInto(el, 'лук');
    await elementUpdated(el);
    press(node, 'Enter');
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(node.getAttribute('aria-expanded')).toBe('false');
    expect(node.value).toBe('Лукойл');
  });

  it('Enter is INERT while the menu is closed — no open, no emit', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const values = collectValues(el);
    press(control(el), 'Enter');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('false');
    expect(values).toEqual([]);
  });

  it('Escape closes AND restores the field to the committed label; the value channel is untouched', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'GAZP' } });
    const values = collectValues(el);
    const node = control(el);
    typeInto(el, 'сб');
    await elementUpdated(el);
    expect(node.value).toBe('сб');

    press(node, 'Escape');
    await elementUpdated(el);
    expect(node.getAttribute('aria-expanded')).toBe('false');
    expect(node.value, 'the query was transient — restored to the label').toBe('Газпром');
    expect(values).toEqual([]);
    expect(el.value).toBeUndefined();
  });

  it('the committed row carries aria-selected + the check glyph and re-homes the active row on reopen', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'GMKN' } });
    const node = control(el);
    press(node, 'ArrowDown'); // no query — the full list, committed active
    await elementUpdated(el);
    const rows = menuRows(el);
    expect(node.getAttribute('aria-activedescendant')).toBe(rows[3]?.id); // Норникель (4th option)
    expect(rows[3]?.getAttribute('aria-selected')).toBe('true');
    expect(rows[3]?.querySelector('svg[aria-hidden="true"]'), 'the ink check glyph').toBeTruthy();
    expect(rows.filter((row) => row.getAttribute('aria-selected') === 'true')).toHaveLength(1);

    press(node, 'Escape');
    await elementUpdated(el);
    press(node, 'ArrowDown');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded'), 'reopen after close works').toBe('true');
    expect(menuRows(el)).toHaveLength(10);
  });

  it('a row CLICK commits through the same channel; pointerdown keeps focus in the field', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const values = collectValues(el);
    const node = control(el);
    node.focus();
    typeInto(el, 'я');
    await elementUpdated(el);

    const row = menuRows(el).find((option) => option.textContent?.trim() === 'Яндекс') as HTMLElement;
    row.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(el.shadowRoot?.activeElement, 'pointerdown never moves focus out of the field').toBe(node);
    row.click();
    await elementUpdated(el);

    expect(values).toEqual(['YNDX']);
    expect(node.value).toBe('Яндекс');
    expect(node.getAttribute('aria-expanded')).toBe('false');
  });

  it('outside press closes with focus returned to the field; presses inside the host/panel do not close', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'га');
    await elementUpdated(el);
    outsidePointerDown(el); // host boundary (shadow presses retarget here)
    expect(control(el).getAttribute('aria-expanded')).toBe('true');
    outsidePointerDown(menuPanel(el) as Element);
    expect(control(el).getAttribute('aria-expanded')).toBe('true');

    const focusSpy = vi.spyOn(control(el), 'focus');
    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    outsidePointerDown(outsider);
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('false');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('focus loss (Tab path) closes with NO forced focus return — natural tab order', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'га');
    await elementUpdated(el);
    const focusSpy = vi.spyOn(control(el), 'focus');

    const elsewhere = document.createElement('input');
    document.body.appendChild(elsewhere);
    focusoutTo(el, elsewhere);
    await elementUpdated(el);

    expect(control(el).getAttribute('aria-expanded')).toBe('false');
    expect(focusSpy, 'focus follows natural tab order — never forced back').not.toHaveBeenCalled();
  });

  it('closing unmounts the panel from the controller and re-homes it into the shadow tree (next open works)', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'га');
    await elementUpdated(el);
    const panel = menuPanel(el) as HTMLElement;
    expect(panel.parentElement?.id).toBe('tk-overlay-root');

    press(control(el), 'Escape');
    await elementUpdated(el);
    expect(el.shadowRoot?.contains(panel), 're-homed into the shadow tree').toBe(true);
    expect(panel.style.zIndex).toBe(''); // controller snapshot restored
    expect(panel.hasAttribute('hidden')).toBe(true);

    press(control(el), 'ArrowDown');
    await elementUpdated(el);
    expect(menuPanel(el)?.parentElement?.id).toBe('tk-overlay-root');
  });

  it('detaching the element tears the menu down quietly', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'га');
    await elementUpdated(el);
    const panel = menuPanel(el) as HTMLElement;
    el.remove();
    await elementUpdated(el);
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
  });

  // --- IME -------------------------------------------------------------------------------

  it('IME composition PAUSES the pipeline: isComposing input neither opens nor refilters', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'Г', true);
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded'), 'no open mid-composition').toBe('false');
    expect(statusRegion(el)?.textContent).toBe('');

    typeInto(el, 'Газ'); // compositionend has passed — a normal input filters
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('true');
    expect(statusRegion(el)?.textContent).toBe('Найден 1 инструмент');

    typeInto(el, 'Г', true); // mid-composition AGAIN while open: no refilter
    await elementUpdated(el);
    expect(statusRegion(el)?.textContent).toBe('Найден 1 инструмент');
  });

  // --- mid-open data changes ---------------------------------------------------------------

  it('a mid-open options change re-renders the rows and re-clamps the active row — never a stale activedescendant', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'с'); // 4 rows, first active
    await elementUpdated(el);
    press(control(el), 'End'); // last row active
    await elementUpdated(el);

    el.options = INSTRUMENTS.filter((option) => option.value === 'SBER' || option.value === 'ROSN');
    await elementUpdated(el);
    // The rows re-render synchronously inside updated(); the activedescendant
    // attribute follows on the follow-up update the re-render requests.
    await elementUpdated(el);
    const rows = menuRows(el);
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Сбербанк', 'Роснефть']);
    const activeId = control(el).getAttribute('aria-activedescendant');
    expect(activeId).toBe(rows[1]?.id); // clamped into the new range
    expect(rows[1]?.classList.contains('tk-active')).toBe(true);

    el.options = [];
    await elementUpdated(el);
    await elementUpdated(el);
    expect(menuRows(el)).toHaveLength(0);
    expect(menuPanel(el)?.querySelector('[aria-disabled="true"]')?.textContent?.trim()).toBe(
      'Ничего не найдено',
    );
    expect(control(el).getAttribute('aria-activedescendant')).toBeNull();
    expect(statusRegion(el)?.textContent).toBe('Ничего не найдено');
  });

  // --- disabled / duplicates ----------------------------------------------------------------

  it('disabled closes the open menu, makes the field readonly+aria-disabled, and swallows typing', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    typeInto(el, 'га');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('true');

    el.disabled = true;
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded')).toBe('false');
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
    expect(el.getAttribute('disabled'), 'the reflected styling hook').toBe('');
    expect(control(el).hasAttribute('readonly')).toBe(true);
    expect(control(el).getAttribute('aria-disabled')).toBe('true');

    typeInto(el, 'газ');
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-expanded'), 'inert while disabled').toBe('false');
  });

  it('duplicate option values drop with a dev warn; the first occurrence wins', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'a', label: 'Первая' },
          { value: 'a', label: 'Дубликат' },
          { value: 'b', label: 'Вторая' },
        ],
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('tk-combobox-search: duplicate'));
    warnSpy.mockClear();
    typeInto(el, '');
    await elementUpdated(el);
    expect(menuRows(el).map((row) => row.textContent?.trim())).toEqual(['Первая', 'Вторая']);
    expect(warnSpy).not.toHaveBeenCalled(); // converged — no warn loop
  });

  // --- degrade + IME composition tracking (the W4/W5 triage round) ---------------

  it('a nullish label degrades — no throw, the option filters via its value, the display never leaks "undefined" (§2)', async () => {
    const el = await mount({
      props: {
        options: [{ value: 'GAZP', label: undefined as unknown as string }, ...INSTRUMENTS.slice(1, 3)],
        defaultValue: 'GAZP',
      },
    });
    const node = control(el);
    expect(node.value, 'the label-less committed option displays empty').toBe('');

    expect(() => typeInto(el, 'gaz')).not.toThrow(); // value-side match
    await elementUpdated(el);
    expect(menuRows(el).map((row) => row.textContent?.trim())).toEqual(['']);
    expect(statusRegion(el)?.textContent).toBe('Найден 1 инструмент');
  });

  it('options churn during an IME composition from committed state NEVER rewrites the field', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, defaultValue: 'GAZP' } });
    const node = control(el);
    node.dispatchEvent(new Event('compositionstart', { bubbles: true, composed: true }));
    typeInto(el, 'Газп', true); // paused — native provisional text only
    el.options = [...INSTRUMENTS]; // identity churn (React inline arrays)
    await elementUpdated(el);
    await elementUpdated(el);
    expect(node.value, 'provisional composition text survives the churn').toBe('Газп');
    expect(node.getAttribute('aria-expanded'), 'no open from paused events').toBe('false');
  });

  it('commit and Escape DURING an in-flight composition force the restore — no orphaned provisional text', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const node = control(el);

    typeInto(el, 'га'); // open normally, active row 0 = Газпром
    await elementUpdated(el);
    node.dispatchEvent(new Event('compositionstart', { bubbles: true, composed: true }));
    typeInto(el, 'Газпр', true); // provisional text, paused
    press(node, 'Enter'); // commit mid-composition
    await elementUpdated(el);
    expect(node.value, 'the restore lands even mid-composition').toBe('Газпром');

    typeInto(el, 'га'); // reopen
    await elementUpdated(el);
    node.dispatchEvent(new Event('compositionstart', { bubbles: true, composed: true }));
    typeInto(el, 'Газпр', true);
    press(node, 'Escape'); // restore mid-composition
    await elementUpdated(el);
    expect(node.getAttribute('aria-expanded')).toBe('false');
    expect(node.value, 'no orphaned provisional text after Esc').toBe('Газпром');
  });

  // --- The frozen §4 suite (mirrors tk-select's) ---------------------------------------------

  it('controlled commit: value-change emits, nothing mutates locally; the field renders exactly value at commit boundaries', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, value: 'GAZP' } });
    const values = collectValues(el);
    const node = control(el);
    expect(node.value).toBe('Газпром');

    typeInto(el, 'сб'); // the live query is INPUT state, never the value channel
    await elementUpdated(el);
    expect(node.value, 'the live text holds between updates (the caret carve-out)').toBe('сб');
    expect(values, 'typing NEVER emits').toEqual([]);
    expect(el.value).toBe('GAZP');

    press(node, 'Enter'); // commit
    await elementUpdated(el);
    expect(values).toEqual(['SBER']);
    expect(el.value, 'strict: the channel is untouched by commit').toBe('GAZP');
    expect(node.value, 'reverts to exactly the consumer value until it answers').toBe('Газпром');

    el.value = 'SBER'; // the consumer answers
    await elementUpdated(el);
    expect(node.value).toBe('Сбербанк');
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, value: 'GAZP' } });
    el.value = 'SBER';
    await elementUpdated(el);
    el.value = undefined; // release
    await elementUpdated(el);
    expect(control(el).value).toBe('Сбербанк');
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    typeInto(el, 'лук');
    await elementUpdated(el);
    press(control(el), 'Enter');
    await elementUpdated(el);
    expect(values).toEqual(['LKOH']);
    expect(control(el).value, 'now applied locally').toBe('Лукойл');
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { options: INSTRUMENTS, value: 'GAZP' } });
    el.value = undefined;
    await elementUpdated(el);
    el.value = 'YNDX';
    await elementUpdated(el);
    expect(control(el).value).toBe('Яндекс');
    typeInto(el, 'га');
    press(control(el), 'Enter');
    await elementUpdated(el);
    expect(control(el).value, 'strict revert after the resume').toBe('Яндекс');
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('Яндекс');
  });

  it('defaultValue seeds the uncontrolled state; mutated after connect it is ignored; value wins when both are set', async () => {
    const el = await mount({ attributes: { 'default-value': 'SBER' }, props: { options: INSTRUMENTS } });
    expect(control(el).value).toBe('Сбербанк');
    el.defaultValue = 'LKOH';
    await elementUpdated(el);
    expect(control(el).value).toBe('Сбербанк');

    const both = await mount({
      attributes: { 'default-value': 'SBER' },
      props: { options: INSTRUMENTS, value: 'LKOH' },
    });
    expect(control(both).value).toBe('Лукойл'); // controlled at first paint
  });

  it('a non-string value coerces to its string form (free text — no clamp, no throw)', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    el.value = 123 as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('123');
    expect(control(el).value).toBe('123');
  });

  it('value-change crosses the shadow boundary (composed, bubbles) with the unwrapped payload', async () => {
    const el = await mount({ props: { options: INSTRUMENTS } });
    const seen: string[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('value-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: string }>).detail.value);
    });
    typeInto(el, 'газ');
    await elementUpdated(el);
    press(control(el), 'Enter');
    await elementUpdated(el);
    expect(seen).toEqual(['GAZP']);
    expect(composedHeard).toEqual([true]);
  });
});
