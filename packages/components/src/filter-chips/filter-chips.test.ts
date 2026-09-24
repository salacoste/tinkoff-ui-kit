// @vitest-environment happy-dom
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT, TkFilterChips, type TkFilterChipsItem } from './filter-chips.js';

/**
 * tk-filter-chips unit tests (spec 6.2): the filter-chips half of the I/O &
 * edge-case matrix — chip select (value-change + prior deselected + FOCUS
 * ON THE CHIP), arrow cycling (wrap, no value change), «Ещё» overflow
 * open/select/Esc, and the unmatched-value clamp — plus the frozen §4
 * strictness/release suite (mirroring tk-select's), the no-deselect ruling,
 * the every-chip-a-tab-stop deviation, and the CONTROLLER integration: the
 * menu panel mounts through mountOverlay (dropdown layer) and positions
 * through positionFloating (anchor-min-width) — asserted via the DOM
 * effects the controller leaves, with zero popover API in happy-dom (the
 * container fallback path — the select suite's note).
 */

const elementUpdated = (el: TkFilterChips): Promise<unknown> => el.updateComplete;

/** The reference's own chip set (invest/stocks catalog, NOTES.md §D — 10 incl. overflow). */
const CATALOG: TkFilterChipsItem[] = [
  { value: 'what-to-buy', label: 'Что купить' },
  { value: 'stocks', label: 'Акции' },
  { value: 'currency', label: 'Валюта' },
  { value: 'funds', label: 'Фонды' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'futures', label: 'Фьючерсы' },
  { value: 'options', label: 'Опционы' },
  { value: 'strategies', label: 'Стратегии' },
  { value: 'indexes', label: 'Индексы' },
  { value: 'favorites', label: 'Избранное' },
];

let warnSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkFilterChips>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkFilterChips> => {
  const el = new TkFilterChips();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const chips = (el: TkFilterChips): HTMLButtonElement[] => {
  const nodes = [...(el.shadowRoot?.querySelectorAll('[role="tab"]') ?? [])] as HTMLButtonElement[];
  expect(nodes.length, 'chip tabs render').toBeGreaterThan(0);
  return nodes;
};

const moreButton = (el: TkFilterChips): HTMLButtonElement | null =>
  el.shadowRoot?.querySelector('.chip--more') ?? null;

/** The menu panel — shadow tree while closed, the overlay container while open (the select helper's both-trees lookup). Falls back to the role lookup when the «Ещё» chip itself is gone (items shrank). */
const menuPanel = (el: TkFilterChips): Element | null => {
  const id = moreButton(el)?.getAttribute('aria-controls');
  const byId = id ? (el.shadowRoot?.getElementById(id) ?? document.getElementById(id)) : null;
  return byId ?? el.shadowRoot?.querySelector('[role="menu"]') ?? null;
};

const menuRows = (el: TkFilterChips): Element[] => {
  const panel = menuPanel(el);
  return panel ? [...panel.querySelectorAll('[role="menuitemradio"]')] : [];
};

const selectedChip = (el: TkFilterChips): HTMLButtonElement | undefined =>
  chips(el).find((chip) => chip.getAttribute('aria-selected') === 'true');

const collectValues = (el: TkFilterChips): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    values.push((event as CustomEvent<{ value: string }>).detail.value);
  });
  return values;
};

const press = (target: Element, key: string): boolean =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

/** focusout with a controllable relatedTarget (happy-dom FocusEventInit-proof). */
const focusoutTo = (el: TkFilterChips, relatedTarget: Node | null): void => {
  const event = new Event('focusout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  el.shadowRoot?.querySelector('.row')?.dispatchEvent(event);
};

/** focusout from a MENU ROW — the real Tab-out origin (row → panel → the panel's own binding; the panel is .row's shadow-tree sibling, so this path never crosses .row). */
const focusoutFromRow = (row: Element, relatedTarget: Node | null): void => {
  const event = new Event('focusout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  row.dispatchEvent(event);
};

const outsidePointerDown = (target: Element): void => {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
};

describe('tk-filter-chips', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-filter-chips exposing TkFilterChips', async () => {
    await customElements.whenDefined('tk-filter-chips');
    expect(customElements.get('tk-filter-chips')).toBe(TkFilterChips);
  });

  it('renders the reference split: 7 visible chips + the «Ещё» chip; tablist + tab wiring', async () => {
    const el = await mount({ props: { items: CATALOG } });
    expect(chips(el)).toHaveLength(TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT);
    const more = moreButton(el);
    expect(more, 'the «Ещё» chip renders past the window').not.toBeNull();
    expect(more?.getAttribute('aria-haspopup')).toBe('menu');
    expect(more?.getAttribute('aria-expanded')).toBe('false');
    expect(more?.getAttribute('aria-controls')).toBe(menuPanel(el)?.id);
    expect(menuPanel(el)?.getAttribute('role')).toBe('menu');
    expect(menuPanel(el)?.hasAttribute('hidden'), 'panel hidden while closed').toBe(true);

    const tablist = el.shadowRoot?.querySelector('[role="tablist"]');
    expect(tablist?.getAttribute('aria-label')).toBe('Фильтры'); // the default name
    expect(tablist?.contains(more ?? {} as Node), '«Ещё» is NEVER a tablist child').toBe(false);
  });

  it('no overflow: the «Ещё» chip is absent; visibleCount clamps invalid values to the default (§2)', async () => {
    const el = await mount({ props: { items: CATALOG.slice(0, 5) } });
    expect(moreButton(el)).toBeNull();
    expect(chips(el)).toHaveLength(5);

    const broken = await mount({ props: { items: CATALOG, visibleCount: 0 } });
    await elementUpdated(broken);
    expect(broken.visibleCount, 'invalid count degrades to 7').toBe(TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT);
    expect(chips(broken)).toHaveLength(7);

    const nan = await mount({ props: { items: CATALOG.slice(0, 3), visibleCount: Number.NaN } });
    expect(nan.visibleCount).toBe(TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT);
    expect(chips(nan)).toHaveLength(3);
  });

  // --- Matrix row 1: chip select ------------------------------------------------

  it('Space on «Валюта» selects: value-change, prior deselected, FOCUS PRESERVED on the chip', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const values = collectValues(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить'); // first item pre-selected (always-one ruling)

    const target = chips(el)[2] as HTMLButtonElement; // «Валюта»
    target.focus();
    expect(el.shadowRoot?.activeElement).toBe(target);
    // Space on a native button rides the UA's click activation.
    target.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    target.click();
    await elementUpdated(el);

    expect(values).toEqual(['currency']);
    expect(selectedChip(el)).toBe(target); // the same node, still selected
    expect(chips(el)[0]?.getAttribute('aria-selected')).toBe('false'); // prior deselected
    expect(el.shadowRoot?.activeElement, 'focus PRESERVED on the toggled chip (the sanctioned improvement)').toBe(target);
    expect(el.value, 'uncontrolled: no controlled channel').toBeUndefined();
  });

  it('re-selecting the active chip is a NO-OP (no deselect-to-none ruling)', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const values = collectValues(el);
    (chips(el)[0] as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить');
  });

  // --- Matrix row 2: arrow cycling -------------------------------------------------

  it('←/→ cycle focus chip-to-chip within the tablist (wrapping), NO value change', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const values = collectValues(el);
    const list = chips(el);
    const first = list[0] as HTMLButtonElement;
    const second = list[1] as HTMLButtonElement;
    first.focus();

    const focusSpy = vi.spyOn(second, 'focus');
    press(first, 'ArrowRight');
    expect(focusSpy).toHaveBeenCalled();
    expect(el.shadowRoot?.activeElement).toBe(second);

    const focusLast = vi.spyOn(list[list.length - 1] as HTMLButtonElement, 'focus');
    press(first, 'ArrowLeft'); // 0 → wrap to last
    expect(focusLast).toHaveBeenCalled();

    const focusFirst = vi.spyOn(first, 'focus');
    press(list[list.length - 1] as HTMLButtonElement, 'ArrowRight'); // last → wrap to 0
    expect(focusFirst).toHaveBeenCalled();

    expect(values).toEqual([]); // arrows NEVER select
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить');
  });

  it('every chip is a TAB STOP (the documented deviation from APG roving-tabindex)', async () => {
    const el = await mount({ props: { items: CATALOG.slice(0, 3) } });
    for (const chip of chips(el)) {
      expect(chip.tabIndex).toBe(0);
    }
    // «Ещё» is a plain button in the natural tab order too (not a tab).
    expect(moreButton(el)).toBeNull(); // 3 items ≤ window — no «Ещё» here
    const long = await mount({ props: { items: CATALOG } });
    expect(moreButton(long)?.tabIndex).toBe(0);
  });

  // --- Matrix rows 3–5: the «Ещё» overflow ------------------------------------------

  it('Enter on «Ещё» mounts the menu controller-side (dropdown layer, anchor-min-width) with focus inside', async () => {
    const el = await mount({ props: { items: CATALOG, defaultValue: 'stocks' } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);

    expect(more.getAttribute('aria-expanded')).toBe('true');
    const panel = menuPanel(el) as HTMLElement;
    expect(panel.hasAttribute('hidden')).toBe(false);

    // Controller integration (container fallback path — happy-dom has no
    // popover API): reparented into the overlay container, z only via the
    // dropdown layer token, positioned fixed with the anchor-min-width match.
    expect(panel.parentElement?.id).toBe('tk-overlay-root');
    expect(panel.style.zIndex).toBe('var(--tk-z-dropdown)');
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.minWidth).toBe('0px');

    // Rows = the overflow residents only; focus moved INTO the menu (first
    // row — no overflow-resident selection to start from).
    const rows = menuRows(el);
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Стратегии', 'Индексы', 'Избранное']);
    expect(document.activeElement).toBe(rows[0]);
  });

  it('Enter on «Индексы» selects through the SAME channel: value-change, menu closes, focus on «Ещё», «Ещё» carries the border', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const values = collectValues(el);
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);

    const indexes = menuRows(el)[1] as HTMLButtonElement; // «Индексы»
    const focusSpy = vi.spyOn(more, 'focus');
    indexes.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    indexes.click();
    await elementUpdated(el);

    expect(values).toEqual(['indexes']);
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
    expect(focusSpy).toHaveBeenCalled();
    expect(el.shadowRoot?.activeElement).toBe(more);
    // The visible indicator ruling: «Ещё» itself carries the selected border
    // while the active item is overflow-resident, and NO visible chip does.
    expect(more.classList.contains('chip--selected')).toBe(true);
    expect(selectedChip(el)).toBeUndefined();
    // The checked row follows the value on the next open.
    press(more, 'ArrowDown');
    await elementUpdated(el);
    expect(document.activeElement?.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement?.textContent?.trim()).toBe('Индексы');
  });

  it('Escape closes WITHOUT changing value; focus returns to «Ещё»', async () => {
    const el = await mount({ props: { items: CATALOG, defaultValue: 'currency' } });
    const values = collectValues(el);
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    const focusSpy = vi.spyOn(more, 'focus');

    press(document.activeElement as Element, 'ArrowDown'); // navigate first
    press(document.activeElement as Element, 'Escape');
    await elementUpdated(el);

    expect(el.getAttribute('aria-expanded') ?? more.getAttribute('aria-expanded')).toBe('false');
    expect(values).toEqual([]);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Валюта'); // value untouched
    expect(focusSpy).toHaveBeenCalled();
    expect(el.shadowRoot?.activeElement).toBe(more);
  });

  it('menu keyboard: ArrowDown/ArrowUp cycle (wrapping), Home/End jump; Enter selects the focused row', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowUp'); // ArrowUp opens at the LAST row (the APG menu-button edge)
    await elementUpdated(el);
    const rows = menuRows(el);
    expect(document.activeElement).toBe(rows[2]); // «Избранное»

    press(document.activeElement as Element, 'Home');
    expect(document.activeElement).toBe(rows[0]); // «Стратегии»
    press(document.activeElement as Element, 'ArrowUp'); // 0 → wrap to last
    expect(document.activeElement).toBe(rows[2]);
    press(document.activeElement as Element, 'ArrowDown'); // last → wrap to first
    expect(document.activeElement).toBe(rows[0]);

    const values = collectValues(el);
    (document.activeElement as HTMLButtonElement).click(); // Enter rides the native click
    await elementUpdated(el);
    expect(values).toEqual(['strategies']);
    expect(selectedChip(el)).toBeUndefined();
    expect(moreButton(el)?.classList.contains('chip--selected')).toBe(true);
    expect(rows.length).toBe(3);
  });

  it('outside click closes with focus returned to «Ещё»; presses inside the host/panel do not close', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    outsidePointerDown(el); // host boundary (shadow presses retarget here)
    expect(more.getAttribute('aria-expanded')).toBe('true');
    outsidePointerDown(menuPanel(el) as Element);
    expect(more.getAttribute('aria-expanded')).toBe('true');

    const focusSpy = vi.spyOn(more, 'focus');
    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    outsidePointerDown(outsider);
    await elementUpdated(el);
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('focus loss (Tab path) closes with NO forced focus return — natural tab order', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    const focusSpy = vi.spyOn(more, 'focus');

    const elsewhere = document.createElement('input');
    document.body.appendChild(elsewhere);
    focusoutTo(el, elsewhere);
    await elementUpdated(el);

    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(focusSpy, 'focus follows natural tab order — never forced back').not.toHaveBeenCalled();
  });

  it('click on «Ещё» opens the menu; click again toggles it closed (the Enter/Space ride path)', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    more.click();
    await elementUpdated(el);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(menuRows(el)[0]);

    more.click();
    await elementUpdated(el);
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
  });

  it('Tab OUT of the open menu (focus leaving a menu ROW) closes it — the panel-origin exit', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    more.click();
    await elementUpdated(el);
    const rows = menuRows(el);
    expect(document.activeElement).toBe(rows[0]);

    const elsewhere = document.createElement('input');
    document.body.appendChild(elsewhere);
    const focusSpy = vi.spyOn(more, 'focus');
    // The REAL propagation origin of a Tab-out is the focused ROW inside the
    // panel; the panel is .row's shadow-tree SIBLING, so this event reaches
    // the close rule only through the panel's own focusout binding — the
    // 6.2 quick-review BLOCKER (it used to strand the menu open, with the
    // document pointerdown listener live and Esc unreachable).
    focusoutFromRow(rows[0], elsewhere);
    await elementUpdated(el);

    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
    expect(focusSpy, 'natural tab order — never forced back').not.toHaveBeenCalled();
  });

  it('a mid-open items change that removes the focused row RE-LANDS focus in the menu (never stranded)', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    press(document.activeElement as Element, 'End'); // focus the LAST row («Избранное»)
    expect(document.activeElement?.textContent?.trim()).toBe('Избранное');

    el.items = CATALOG.slice(0, 9); // «Избранное» leaves the overflow WITH the focus
    await elementUpdated(el);

    expect(more.getAttribute('aria-expanded'), 'menu stays open').toBe('true');
    const rows = menuRows(el);
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Стратегии', 'Индексы']);
    expect(document.activeElement, 'focus re-landed on the first row — never body').toBe(rows[0]);
  });

  it('closing unmounts the panel from the controller and re-homes it into the shadow tree (next open works)', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    const panel = menuPanel(el) as HTMLElement;
    expect(panel.parentElement?.id).toBe('tk-overlay-root');

    press(document.activeElement as Element, 'Escape');
    await elementUpdated(el);
    expect(el.shadowRoot?.contains(panel), 're-homed into the shadow tree').toBe(true);
    expect(panel.style.zIndex).toBe(''); // controller snapshot restored
    expect(panel.hasAttribute('hidden')).toBe(true);

    press(more, 'ArrowDown');
    await elementUpdated(el);
    expect(menuPanel(el)?.parentElement?.id).toBe('tk-overlay-root');
  });

  it('a chip press while the menu is open selects AND closes the menu', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const values = collectValues(el);
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    expect(more.getAttribute('aria-expanded')).toBe('true');

    const target = chips(el)[1] as HTMLButtonElement; // «Акции»
    target.click();
    await elementUpdated(el);
    expect(values).toEqual(['stocks']);
    expect(more.getAttribute('aria-expanded')).toBe('false');
  });

  it('items shrinking past the window while the menu is open closes it; the panel follows the data', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    expect(more.getAttribute('aria-expanded')).toBe('true');

    el.items = CATALOG.slice(0, 5); // window shrinks the overflow away
    await elementUpdated(el);
    expect(moreButton(el), '«Ещё» gone with the overflow').toBeNull();
    expect(menuPanel(el)?.hasAttribute('hidden')).toBe(true);
  });

  it('detaching the element tears the menu down quietly', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const more = moreButton(el) as HTMLButtonElement;
    press(more, 'ArrowDown');
    await elementUpdated(el);
    const panel = menuPanel(el) as HTMLElement;
    el.remove();
    await elementUpdated(el);
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
  });

  // --- Matrix row 6: the value clamp -----------------------------------------------

  it('unmatched value clamps to the FIRST item — the channel itself is corrected (§2)', async () => {
    const el = await mount({ props: { items: CATALOG, value: 'nope' } });
    await elementUpdated(el);
    expect(el.value, 'the controlled channel carries the corrected value').toBe('what-to-buy');
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить');
  });

  it('a matched value going unmatched after an items change re-clamps to the first item', async () => {
    const el = await mount({ props: { items: CATALOG, value: 'indexes' } });
    expect(moreButton(el)?.classList.contains('chip--selected')).toBe(true);
    el.items = CATALOG.slice(0, 4); // «Индексы» gone
    await elementUpdated(el);
    expect(el.value).toBe('what-to-buy');
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить');
  });

  it('an unmatched defaultValue clamps to the first item; a non-string value runs the full §2 chain', async () => {
    const el = await mount({ attributes: { 'default-value': 'nope' }, props: { items: CATALOG } });
    expect(selectedChip(el)?.textContent?.trim()).toBe('Что купить');

    // The §2 chain on the controlled channel: 123 → String '123' (the select
    // mold's non-string coercion) → NOT among the item values → clamps to the
    // first item. Unlike tk-select (unmatched → placeholder), filter-chips
    // has no empty state — the value is always one of the items.
    const coerced = await mount({ props: { items: CATALOG } });
    coerced.value = 123 as unknown as string;
    await elementUpdated(coerced);
    expect(coerced.value).toBe('what-to-buy');
    expect(selectedChip(coerced)?.textContent?.trim()).toBe('Что купить');
  });

  it('empty items: nothing renders and nothing selects (no phantom chip)', async () => {
    const el = await mount({ props: { items: [] } });
    expect(el.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(0);
    expect(moreButton(el)).toBeNull();
  });

  it('duplicate item values clamp: later duplicates drop with a dev warn, the first occurrence wins', async () => {
    const el = await mount({
      props: {
        items: [
          { value: 'a', label: 'Первая' },
          { value: 'a', label: 'Дубликат' },
          { value: 'b', label: 'Вторая' },
        ],
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('tk-filter-chips: duplicate'));
    warnSpy.mockClear();
    expect(chips(el)).toHaveLength(2); // the duplicate chip never renders
    expect(selectedChip(el)?.textContent?.trim()).toBe('Первая'); // first occurrence wins
    expect(warnSpy).not.toHaveBeenCalled(); // converged — no warn loop
  });

  // --- The frozen §4 suite (mirrors tk-select's) -------------------------------------

  it('controlled selection: value-change emits, nothing mutates locally; the row renders exactly value', async () => {
    const el = await mount({ props: { items: CATALOG, value: 'stocks' } });
    const values = collectValues(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Акции');

    (chips(el)[2] as HTMLButtonElement).click(); // «Валюта»
    await elementUpdated(el);

    expect(values).toEqual(['currency']);
    expect(el.value, 'strict: the channel is untouched by selection').toBe('stocks');
    expect(selectedChip(el)?.textContent?.trim(), 'renders exactly the consumer value until it answers').toBe('Акции');

    el.value = 'currency';
    await elementUpdated(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Валюта');
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { items: CATALOG, value: 'stocks' } });
    el.value = 'currency';
    await elementUpdated(el);
    el.value = undefined; // release
    await elementUpdated(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Валюта');
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    (chips(el)[1] as HTMLButtonElement).click(); // «Акции»
    await elementUpdated(el);
    expect(values).toEqual(['stocks']);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Акции');
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { items: CATALOG, value: 'stocks' } });
    el.value = undefined;
    await elementUpdated(el);
    el.value = 'funds';
    await elementUpdated(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Фонды');
    el.requestUpdate();
    await elementUpdated(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Фонды');
  });

  it('defaultValue seeds the uncontrolled state; mutated after connect it is ignored; value wins when both are set', async () => {
    const el = await mount({ attributes: { 'default-value': 'currency' }, props: { items: CATALOG } });
    expect(selectedChip(el)?.textContent?.trim()).toBe('Валюта');
    el.defaultValue = 'stocks';
    await elementUpdated(el);
    expect(selectedChip(el)?.textContent?.trim()).toBe('Валюта');

    const both = await mount({
      attributes: { 'default-value': 'currency' },
      props: { items: CATALOG, value: 'stocks' },
    });
    expect(selectedChip(both)?.textContent?.trim()).toBe('Акции'); // controlled at first paint
  });

  it('value-change crosses the shadow boundary (composed, bubbles) with the unwrapped payload', async () => {
    const el = await mount({ props: { items: CATALOG } });
    const seen: string[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('value-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: string }>).detail.value);
    });
    (chips(el)[1] as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(seen).toEqual(['stocks']);
    expect(composedHeard).toEqual([true]);
  });
});
