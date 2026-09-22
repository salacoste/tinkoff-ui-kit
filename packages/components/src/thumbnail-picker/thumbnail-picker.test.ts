// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkThumbnailPicker } from './thumbnail-picker.js';

/**
 * tk-thumbnail-picker unit tests (spec 2.6): the eight I/O matrix rows —
 * row-major arrows (incl. grid wrap at row boundaries and the single-row
 * degeneration), skip-disabled, exactly-one under controlled/uncontrolled,
 * roving tabindex, Space/Enter select, form mirror (wiring-level — the live
 * FormData entry rides the host's formAssociated/ElementInternals mirror,
 * proven live in tests/visual/thumbnail-picker.spec.ts), the image-fail
 * fallback, and the empty/null-options copy slot — plus the §4
 * release/resume transitions, the duplicate-value clamp (2.3 precedent),
 * attribute reflection rules, and enum/null clamping guards.
 *
 * GRID GEOMETRY IN happy-DOM (the spec's noted testing problem — «without a
 * fixed column count at test time, pin the CSS grid column count in tests
 * via a data attribute or test the navigation math against the RENDERED
 * grid»): this suite takes the second route and tests against the RENDERED
 * grid — happy-dom computes no layout (every offsetTop reads 0, so the
 * component's real derivation reads «single row»), and the tests OVERLAY
 * real grid geometry by defining per-tile offsetTop values (row index × 84 =
 * the 72px tile + 12px gap pitch) on the rendered .tile elements. The
 * component's #renderedColumns clustering then derives the pinned column
 * count from the DOM exactly as it does in a real engine — the derivation
 * and the navigation math are both exercised, with no test-only hooks in
 * production code. Lit re-renders update attributes in place (same node
 * identity), so the pinned geometry survives selection updates; tests
 * re-pin whenever the options array is replaced.
 *
 * Keyboard split (the tk-input/checkbox/segmented-radio precedent):
 * happy-dom runs no native key activation, so «Space selects» is pinned
 * STRUCTURALLY — the native radio is the focusable control, the element
 * intercepts ONLY arrows/Enter keydowns (Space reaches the platform
 * uncancelled), and the change pipeline the browser fires after
 * Space/click is exercised directly. The arrow/Enter paths ARE the
 * element's own handlers and run fully here.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkThumbnailPicker): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: the options clamp dev-warns, Lit dev-mode may warn. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

const SIX = [
  { value: 'black', label: 'Чёрная' },
  { value: 'yellow', label: 'Жёлтая' },
  { value: 'platinum', label: 'Платиновая' },
  { value: 'blue', label: 'Синяя' },
  { value: 'green', label: 'Зелёная' },
  { value: 'red', label: 'Красная' },
];

const THREE = [
  { value: 'all', label: 'Все' },
  { value: 'yes', label: 'Да', disabled: true },
  { value: 'no', label: 'Нет' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkThumbnailPicker>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkThumbnailPicker> => {
  const el = new TkThumbnailPicker();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const inputs = (el: TkThumbnailPicker): HTMLInputElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
];

/** Index of the checked radio (-1 when none). */
const checkedIndex = (el: TkThumbnailPicker): number => inputs(el).findIndex((input) => input.checked);

/**
 * Pin a grid layout onto the rendered tiles (the file doc's technique):
 * offsetTop = row × 84 — exactly what a real `repeat(auto-fill, 72px)` grid
 * with 12px gaps reports to the component's clustering.
 */
const pinColumns = (el: TkThumbnailPicker, columns: number): void => {
  const tiles = [...(el.shadowRoot?.querySelectorAll('.tile') ?? [])] as HTMLElement[];
  tiles.forEach((tile, index) => {
    const row = Math.floor(index / columns);
    Object.defineProperty(tile, 'offsetTop', { value: row * 84, configurable: true });
  });
};

/** The element's own arrow/Enter handler — dispatches keydown on `from`'s input. */
const keydown = (el: TkThumbnailPicker, from: number, key: string): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
  inputs(el)[from]?.dispatchEvent(event);
  return event;
};

/**
 * Simulate the browser's post-Space/post-click commit: check the native
 * radio and run the change pipeline (exactly what the UA fires).
 */
const click = (el: TkThumbnailPicker, index: number): void => {
  const input = inputs(el)[index];
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
};

/** Capture value-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkThumbnailPicker): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: string }>;
    values.push(custom.detail.value);
  });
  return values;
};

describe('tk-thumbnail-picker', () => {
  it('registers as tk-thumbnail-picker exposing TkThumbnailPicker', async () => {
    await customElements.whenDefined('tk-thumbnail-picker');
    expect(customElements.get('tk-thumbnail-picker')).toBe(TkThumbnailPicker);
  });

  it('renders the group label + radiogroup grid with native named radios and tile faces (structure)', async () => {
    const el = await mount({ props: { label: 'Выберите дизайн карты', options: SIX } });
    expect(el.shadowRoot?.querySelector('.label')?.textContent).toContain('Выберите дизайн карты');
    const grid = el.shadowRoot?.querySelector('[role="radiogroup"]');
    expect(grid, 'the grid carries the radiogroup role').not.toBeNull();
    expect(grid?.getAttribute('aria-labelledby')).toBeTruthy();
    const group = inputs(el);
    expect(group).toHaveLength(6);
    for (const input of group) {
      expect(input.type).toBe('radio');
      // One shared name = one native radio group (per-tree: instances never cross).
      expect(input.name).toBe(group[0]?.name);
    }
    // The tile label wraps input + face (click-to-select + naming).
    for (const input of group) {
      expect(input.closest('label')).toBe(input.parentElement);
    }
    // No thumbnail → the initials face + the sr-only label text.
    const face = el.shadowRoot?.querySelector('.tile__face');
    expect(face?.querySelector('.tile__initials')?.textContent).toBe('Ч');
    expect(face?.querySelector('.tile__text')?.textContent).toBe('Чёрная');
    // Two-word label → two initial graphemes, uppercased.
    expect(el.shadowRoot?.querySelectorAll('.tile__initials')[2]?.textContent).toBe('П'); // «Платиновая» → one word
    const two = await mount({
      props: { options: [{ value: 'a', label: 'все покупки' }, { value: 'b', label: 'black edition' }] },
    });
    expect(two.shadowRoot?.querySelectorAll('.tile__initials')[0]?.textContent).toBe('ВП');
    expect(two.shadowRoot?.querySelectorAll('.tile__initials')[1]?.textContent).toBe('BE');
  });

  it('renders the thumbnail image when provided (alt-empty, decorative)', async () => {
    const el = await mount({
      props: { options: [{ value: 'a', label: 'Чёрная', thumbnail: 'card.svg' }] },
    });
    const img = el.shadowRoot?.querySelector<HTMLImageElement>('.tile__image');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('card.svg');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('aria-hidden')).toBe('true');
    expect(el.shadowRoot?.querySelector('.tile__initials')).toBeNull();
  });

  it('names the group via aria-label when no label prop is set (axe name gate)', async () => {
    const el = await mount({ props: { options: SIX } });
    const grid = el.shadowRoot?.querySelector('[role="radiogroup"]');
    expect(grid?.getAttribute('aria-label')).toBe('Выбор');
    expect(grid?.getAttribute('aria-labelledby')).toBeNull();
    const withLabel = await mount({ props: { label: 'Выберите дизайн карты', options: SIX } });
    expect(
      withLabel.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-label'),
    ).toBeNull();
  });

  it('group label is a non-interactive SPAN named-into the radiogroup (no for — the 2.5 lesson)', async () => {
    const el = await mount({ props: { label: 'Выберите дизайн карты', options: SIX, defaultValue: 'black' } });
    const label = el.shadowRoot?.querySelector('.label');
    expect(label?.tagName).toBe('SPAN');
    expect(label?.getAttribute('for')).toBeNull();
    expect(label?.getAttribute('id')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-labelledby')).toBe(
      label?.getAttribute('id'),
    );
    expect(inputs(el)[0]?.getAttribute('id')).toBeNull();
  });

  // --- Matrix row 1: row-major arrows on the grid -------------------------------

  it('ArrowRight/ArrowLeft move ROW-MAJOR: at a row end Right wraps onto the next row\'s first tile', async () => {
    // 6 options pinned as a 3-column grid (2 rows of 3) — the render carries
    // real grid geometry via pinColumns (see the file doc).
    const el = await mount({ props: { options: SIX, defaultValue: 'black' } });
    pinColumns(el, 3);
    const values = collectValues(el);

    // Index 0 → 1 → 2 (row 1); Right at the row END (2) lands on the next
    // row's FIRST tile (3), not a wrap to 0.
    keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['yellow']);
    keydown(el, 1, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['yellow', 'platinum']);
    const event = keydown(el, 2, 'ArrowRight');
    await elementUpdated(el);
    expect(event.defaultPrevented, 'the element owns the arrow (UA move suppressed)').toBe(true);
    expect(values).toEqual(['yellow', 'platinum', 'blue']);
    expect(checkedIndex(el)).toBe(3);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[3]);

    // Left mirrors: from the next row's first tile back to the previous row's last.
    keydown(el, 3, 'ArrowLeft');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['platinum']);
    expect(checkedIndex(el)).toBe(2);

    // Right at the GRID end (5) wraps to the very first tile.
    keydown(el, 5, 'ArrowRight');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['black']);
    expect(checkedIndex(el)).toBe(0);
  });

  it('ArrowDown/ArrowUp keep the COLUMN (±columns), wrapping through the grid bottom/top', async () => {
    const el = await mount({ props: { options: SIX, defaultValue: 'black' } });
    pinColumns(el, 3);
    const values = collectValues(el);

    // Same column, next row.
    keydown(el, 0, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['blue']);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[3]);
    expect(checkedIndex(el)).toBe(3);

    // Down from the BOTTOM row wraps to the TOP row, same column.
    keydown(el, 3, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['blue', 'black']);
    expect(checkedIndex(el)).toBe(0);

    // Up from the TOP row wraps to the BOTTOM row, same column.
    keydown(el, 0, 'ArrowUp');
    await elementUpdated(el);
    expect(values).toEqual(['blue', 'black', 'blue']);
    expect(checkedIndex(el)).toBe(3);

    // Up from the second row lands on the first row, same column.
    keydown(el, 4, 'ArrowUp');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['yellow']);
    expect(checkedIndex(el)).toBe(1);
  });

  it('UNEVEN last row (the reference 4+2): vertical wraps keep the COLUMN, short rows clamp to their last tile', async () => {
    // 6 options pinned as a 4-column grid → rows [0,1,2,3] + [4,5]. Pure
    // ±columns index arithmetic would wrap Down from 4 onto index (4+4)%6=2
    // — the WRONG column; the position-based move must land on 0. Found
    // live by tests/visual/thumbnail-picker.spec.ts, pinned here.
    const el = await mount({ props: { options: SIX, defaultValue: 'black' } });
    pinColumns(el, 4);
    const values = collectValues(el);

    // Down from row 1 col 1 → row 2 col 1.
    keydown(el, 0, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['green']);
    expect(checkedIndex(el)).toBe(4);

    // Down from the bottom row's col 1 WRAPS to the TOP row's col 1 (not index 2).
    keydown(el, 4, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['green', 'black']);
    expect(checkedIndex(el)).toBe(0);

    // Down from the bottom row's col 2 wraps to the top row's col 2.
    keydown(el, 5, 'ArrowDown');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['yellow']);
    expect(checkedIndex(el)).toBe(1);

    // Up from the TOP row's col 4 (which the bottom row lacks) CLAMPS to the
    // bottom row's LAST tile (the WAI nearest-cell convention).
    keydown(el, 3, 'ArrowUp');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['red']);
    expect(checkedIndex(el)).toBe(5);

    // Up from the bottom row's col 1 → the top row's col 1.
    keydown(el, 4, 'ArrowUp');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['black']);
    expect(checkedIndex(el)).toBe(0);
  });

  it('a single row degenerates to linear: Down/Up inert, Right/Left move', async () => {
    const el = await mount({ props: { options: SIX, defaultValue: 'black' } });
    pinColumns(el, 6); // one row of six — the real 536px-container layout
    const values = collectValues(el);
    inputs(el)[0]?.focus();

    const event = keydown(el, 0, 'ArrowDown');
    await elementUpdated(el);
    expect(event.defaultPrevented).toBe(true); // owned key, inert move
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[0]);
    keydown(el, 0, 'ArrowUp');
    await elementUpdated(el);
    expect(values).toEqual([]);

    keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['yellow']);
    keydown(el, 1, 'ArrowLeft');
    await elementUpdated(el);
    expect(values).toEqual(['yellow', 'black']);
  });

  it('a single column degenerates to linear: Down/Up move, Right/Left move by one', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'all' } });
    pinColumns(el, 1);
    const values = collectValues(el);

    keydown(el, 0, 'ArrowDown'); // 0 → next row (1, disabled) → skips to 2
    await elementUpdated(el);
    expect(values).toEqual(['no']);
    expect(checkedIndex(el)).toBe(2);
  });

  // --- Matrix row 2: skip disabled; all-disabled inert ---------------------------

  it('disabled tiles are skipped by arrows in BOTH directions (grid-aware)', async () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D', disabled: true },
      { value: 'e', label: 'E' },
      { value: 'f', label: 'F' },
    ];
    const el = await mount({ props: { options, defaultValue: 'a' } });
    pinColumns(el, 3);
    const values = collectValues(el);

    // Right from 2 → 3 is disabled → skips to 4 (same direction).
    keydown(el, 2, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['e']);
    expect(checkedIndex(el)).toBe(4);

    // Left from 4 → 3 disabled → back to 2.
    keydown(el, 4, 'ArrowLeft');
    await elementUpdated(el);
    expect(values).toEqual(['e', 'c']);
    expect(checkedIndex(el)).toBe(2);

    // Down from 0 → 3 disabled → the +3 cycle closes on the origin → inert.
    // Focus lands on 0 programmatically first (an inert move must LEAVE it there).
    inputs(el)[0]?.focus();
    const event = keydown(el, 0, 'ArrowDown');
    await elementUpdated(el);
    expect(event.defaultPrevented).toBe(true);
    expect(values).toEqual(['e', 'c']);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[0]);

    // Down from 1 → 4 (enabled, same column).
    keydown(el, 1, 'ArrowDown');
    await elementUpdated(el);
    expect(values.slice(-1)).toEqual(['e']);
    expect(checkedIndex(el)).toBe(4);
  });

  it('disabled tile: click/Space change reverts, nothing emits; aria-disabled marks it', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'all' } });
    expect(inputs(el)[1]?.getAttribute('aria-disabled')).toBe('true');
    expect(inputs(el)[0]?.getAttribute('aria-disabled')).toBeNull();

    const values = collectValues(el);
    click(el, 1);
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
  });

  it('all-disabled grid: arrows inert — no move, no emit, selection untouched', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B', disabled: true },
          { value: 'c', label: 'C', disabled: true },
          { value: 'd', label: 'D', disabled: true },
        ],
        defaultValue: 'a',
      },
    });
    pinColumns(el, 2);
    const values = collectValues(el);
    inputs(el)[0]?.focus();
    const event = keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(event.defaultPrevented).toBe(true); // the grid still owns its arrows
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement, 'focus cannot move — no enabled target exists').toBe(inputs(el)[0]);
  });

  it('disabled GROUP: arrows are owned (preventDefaulted) and inert — no move, no emit', async () => {
    const el = await mount({ props: { options: SIX, defaultValue: 'black', disabled: true } });
    pinColumns(el, 3);
    const values = collectValues(el);
    inputs(el)[0]?.focus();
    const event = keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    // preventDefault BEFORE the disabled exit: the UA's own radio-arrow move
    // (which roves focus in real browsers) must never run — live-asserted in
    // tests/visual/thumbnail-picker.spec.ts.
    expect(event.defaultPrevented).toBe(true);
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[0]);
    // Enter is owned the same way (no form submit from a disabled group).
    const enter = keydown(el, 0, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    expect(values).toEqual([]);
  });

  // --- Matrix row 3: exactly one selected ever -----------------------------------

  it('exactly one checked radio through any interaction sequence (uncontrolled)', async () => {
    const el = await mount({ props: { options: SIX, defaultValue: 'red' } });
    pinColumns(el, 3);
    keydown(el, 5, 'ArrowRight'); // grid wrap onto the first tile
    await elementUpdated(el);
    keydown(el, 0, 'ArrowDown'); // same column, next row
    await elementUpdated(el);
    click(el, 4);
    await elementUpdated(el);
    const checked = inputs(el).filter((input) => input.checked);
    expect(checked).toHaveLength(1);
    expect(checked[0]?.value).toBe('green');
  });

  it('exactly one checked radio in controlled mode — in BOTH the live window and after the strict revert', async () => {
    const el = await mount({ props: { options: SIX, value: 'black' } });
    pinColumns(el, 3);
    // The live window: an arrow selects «yellow» natively while the channel holds «black».
    keydown(el, 0, 'ArrowRight');
    expect(inputs(el).filter((input) => input.checked)).toHaveLength(1);
    expect(inputs(el)[1]?.checked).toBe(true);

    // The strict revert: any update the element runs re-renders exactly `value`.
    el.requestUpdate();
    await elementUpdated(el);
    expect(el.value).toBe('black');
    expect(checkedIndex(el)).toBe(0);
    expect(inputs(el).filter((input) => input.checked)).toHaveLength(1);
  });

  // --- Matrix row 4: roving tabindex ----------------------------------------------

  it('roving tabindex: selected tile 0, others -1; nothing selected → first enabled', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'yes' } });
    let tabs = inputs(el).map((input) => input.getAttribute('tabindex'));
    expect(tabs).toEqual(['0', '-1', '-1']);

    // Focus+selection move → the roving tab stop moves with them.
    pinColumns(el, 3);
    keydown(el, 0, 'ArrowRight'); // skips the disabled middle
    await elementUpdated(el);
    tabs = inputs(el).map((input) => input.getAttribute('tabindex'));
    expect(tabs).toEqual(['-1', '-1', '0']);

    // Nothing selected → the FIRST non-disabled option is the tab stop.
    const none = await mount({ props: { options: THREE } });
    expect(inputs(none).map((input) => input.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);

    // Disabled-first list → the tab stop skips to the next enabled option.
    const disabledFirst = await mount({
      props: {
        options: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' },
        ],
      },
    });
    expect(inputs(disabledFirst).map((input) => input.getAttribute('tabindex'))).toEqual(['-1', '0']);
  });

  // --- Matrix rows 5 + Space/Enter --------------------------------------------------

  it('Space is never intercepted (the platform owns it) and the change pipeline selects', async () => {
    const el = await mount({ props: { options: SIX } });
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    inputs(el)[1]?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(el.getAttribute('tabindex')).toBeNull();

    const values = collectValues(el);
    click(el, 1);
    await elementUpdated(el);
    expect(values).toEqual(['yellow']);
    expect(checkedIndex(el)).toBe(1);
  });

  it('Enter selects the focused tile and suppresses form submit; already-selected = no-op', async () => {
    const el = await mount({ props: { options: SIX, defaultValue: 'black' } });
    const values = collectValues(el);

    const event = keydown(el, 1, 'Enter');
    expect(event.defaultPrevented, 'Enter must not submit the surrounding form').toBe(true);
    await elementUpdated(el);
    expect(values).toEqual(['yellow']);
    expect(checkedIndex(el)).toBe(1);

    // Enter on the already-selected tile: a no-op — nothing re-emits.
    keydown(el, 1, 'Enter');
    await elementUpdated(el);
    expect(values).toEqual(['yellow']);
  });

  // --- Matrix row: controlled strictness + release (string channel) ------------------

  it('controlled selection: value-change emits, nothing mutates locally; the next update reverts exactly value', async () => {
    const el = await mount({ props: { options: SIX, value: 'black' } });
    const values = collectValues(el);

    click(el, 1);
    expect(values).toEqual(['yellow']);
    expect(el.value).toBe('black'); // strict: the channel is untouched
    expect(inputs(el)[1]?.checked).toBe(true); // native-feeling live flip…

    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0); // …until an update reverts it
  });

  it('controlled value updates render immediately (consumer drives the ring)', async () => {
    const el = await mount({ props: { options: SIX, value: 'black' } });
    el.value = 'red';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(5);
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { options: SIX, value: 'black' } });
    el.value = 'blue';
    await elementUpdated(el);

    el.value = undefined; // release
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(3); // seeded from the LAST controlled value
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    pinColumns(el, 3);
    keydown(el, 3, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['green']);
    expect(checkedIndex(el)).toBe(4);
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { options: SIX, value: 'red' } });
    el.value = undefined;
    await elementUpdated(el);

    el.value = 'black';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0);

    click(el, 1); // consumer-unanswered selection: live flip only
    expect(checkedIndex(el)).toBe(1);
    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0); // strict revert resumes
  });

  it('defaultValue seeds the uncontrolled state at connect; later mutations are ignored', async () => {
    const el = await mount({ props: { options: SIX }, attributes: { 'default-value': 'red' } });
    expect(checkedIndex(el)).toBe(5);
    el.defaultValue = 'black';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(5); // initial-value semantics
  });

  it('value wins over defaultValue when both are set (controlled at first paint)', async () => {
    const el = await mount({
      props: { options: SIX, value: 'red' },
      attributes: { 'default-value': 'black' },
    });
    expect(checkedIndex(el)).toBe(5);
    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(5);
  });

  // --- Matrix row 6: form participation (wiring — live FormData in tests/visual) -----

  it('form wiring: formAssociated host mirrors the entry; the native radios carry the pass-through', async () => {
    expect((TkThumbnailPicker as unknown as { formAssociated?: boolean }).formAssociated).toBe(true);

    const form = document.createElement('form');
    document.body.appendChild(form);
    const el = new TkThumbnailPicker();
    el.setAttribute('name', 'design');
    form.appendChild(el);
    Object.assign(el, { options: SIX, defaultValue: 'black' });
    await elementUpdated(el);

    const group = inputs(el);
    // The pass-through lands on the native controls (grouping + direct-DOM
    // consumers); the SUBMISSION entry itself rides the host's
    // ElementInternals mirror (this env cannot execute it — proven live in
    // tests/visual/thumbnail-picker.spec.ts).
    expect(group[0]?.name).toBe('design');
    expect(group[0]?.value).toBe('black');
    expect(el.getAttribute('name')).toBe('design');
    expect(group[0]?.getRootNode()).toBe(el.shadowRoot);
    expect(form.contains(el)).toBe(true);

    form.remove();
  });

  it('group name uniqueness: two instances never share a radio group name', async () => {
    const a = await mount({ props: { options: SIX } });
    const b = await mount({ props: { options: SIX } });
    expect(inputs(a)[0]?.name).not.toBe(inputs(b)[0]?.name);
  });

  // --- Matrix row 7: image fail → initials/label face --------------------------------

  it('a failed thumbnail load swaps the tile to the initials face — no broken-image glyph', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'a', label: 'Чёрная', thumbnail: 'missing.svg' },
          { value: 'b', label: 'Синяя' },
        ],
      },
    });
    expect(el.shadowRoot?.querySelectorAll('.tile__image')).toHaveLength(1);

    // The browser's error event on the shadow img runs the fallback pipeline.
    const img = el.shadowRoot?.querySelector('.tile__image');
    img?.dispatchEvent(new Event('error', { bubbles: false }));
    await elementUpdated(el);

    expect(el.shadowRoot?.querySelector('.tile__image'), 'the img is gone').toBeNull();
    const faces = el.shadowRoot?.querySelectorAll('.tile__initials');
    expect(faces?.[0]?.textContent).toBe('Ч'); // initials face took over
    expect(faces?.[1]?.textContent).toBe('С');

    // A fixed URL (options updated with a new thumbnail) retries naturally.
    el.options = [
      { value: 'a', label: 'Чёрная', thumbnail: 'fixed.svg' },
      { value: 'b', label: 'Синяя' },
    ];
    await elementUpdated(el);
    const retry = el.shadowRoot?.querySelector('.tile__image');
    expect(retry?.getAttribute('src')).toBe('fixed.svg');
    expect(el.shadowRoot?.querySelectorAll('.tile__initials')).toHaveLength(1);
  });

  it('a failed thumbnail with the same URL does not re-render in a loop (stickiness)', async () => {
    const el = await mount({
      props: { options: [{ value: 'a', label: 'Чёрная', thumbnail: 'missing.svg' }] },
    });
    const img = el.shadowRoot?.querySelector('.tile__image');
    img?.dispatchEvent(new Event('error'));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.tile__image')).toBeNull();
    // A duplicate error on the same pair is a no-op (guarded).
    img?.dispatchEvent(new Event('error'));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.tile__initials')?.textContent).toBe('Ч');
  });

  // --- Matrix row 8: null/empty options → the empty copy slot ------------------------

  it('options=null / [] renders the zero-state copy slot — no crash, no radios, no tab stops', async () => {
    const el = await mount({ props: { label: 'Выберите дизайн карты', options: null as unknown as [] } });
    const empty = el.shadowRoot?.querySelector('.empty');
    expect(empty).not.toBeNull();
    expect(empty?.textContent).toContain('Нет доступных вариантов');
    expect(empty?.querySelector('slot[name="empty"]'), 'the copy lives in the projectable slot').not.toBeNull();
    // Inert: no radiogroup (axe aria-required-children), no inputs to key.
    expect(el.shadowRoot?.querySelector('[role="radiogroup"]')).toBeNull();
    expect(inputs(el)).toHaveLength(0);
    el.options = [];
    await elementUpdated(el);
    expect(inputs(el)).toHaveLength(0);

    // Options arriving later render normally.
    el.options = SIX;
    await elementUpdated(el);
    expect(inputs(el)).toHaveLength(6);
    expect(inputs(el).map((input) => input.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1', '-1', '-1']);
  });

  // --- Clamps + reflection (CONVENTIONS §2) -------------------------------------------

  it('duplicate option VALUES clamp: later duplicates and value-less entries drop with a dev warn', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'black', label: 'Чёрная' },
          { value: 'black', label: 'Чёрная (дубль)' },
          { value: 'blue', label: 'Синяя' },
          { value: '', label: 'Пусто' },
        ] as unknown as [],
      },
    });
    await elementUpdated(el); // the clamp schedules a follow-up update
    expect(inputs(el)).toHaveLength(2);
    expect(inputs(el).map((input) => input.value)).toEqual(['black', 'blue']);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('clamps non-string channel input to its string form; null releases', async () => {
    const el = await mount({ props: { options: SIX } });
    el.value = 123 as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('123'); // unmatched → zero selected, no crash
    expect(checkedIndex(el)).toBe(-1);

    el.value = null as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBeNull();
    expect(checkedIndex(el)).toBe(-1);
  });

  it('reflects the boolean state hook and never reflects the value channel (CONVENTIONS §2)', async () => {
    const el = await mount({ props: { options: SIX } });
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).toBe(true);
    // aria-disabled rides every input while the group is disabled (focusable pattern).
    for (const input of inputs(el)) {
      expect(input.getAttribute('aria-disabled')).toBe('true');
    }
    el.value = 'black';
    el.defaultValue = 'red';
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.hasAttribute('default-value')).toBe(false);
    // The RADIOGROUP itself carries the disabled state too (AT announces the
    // whole group unavailable; the dimmed label rides the disabled-label
    // contrast exemption — the segmented-radio probe).
    expect(
      el.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-disabled'),
    ).toBe('true');
    el.disabled = false;
    await elementUpdated(el);
    expect(
      el.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-disabled'),
    ).toBeNull();
  });
});
