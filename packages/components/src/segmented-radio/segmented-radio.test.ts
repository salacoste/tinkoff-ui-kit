// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkSegmentedRadio } from './segmented-radio.js';

/**
 * tk-segmented-radio unit tests (spec 2.5): the seven I/O matrix rows —
 * arrows move+select (incl. wrap, skip-disabled), exactly-one invariant
 * under controlled/uncontrolled, roving tabindex, Space/Enter select, form
 * mirror (wiring-level — the FormData entry rides the host's
 * formAssociated/ElementInternals mirror, proven live in
 * tests/visual/segmented-radio.spec.ts), null options — plus the §4
 * release/resume transitions, the duplicate-value clamp (2.3 precedent),
 * attribute reflection rules, and enum/null clamping guards.
 *
 * Keyboard split (the tk-input/checkbox precedent): happy-dom runs no native
 * key activation, so «Space selects» is pinned STRUCTURALLY — the native
 * radio is the focusable control, the element intercepts ONLY
 * arrows/Enter keydowns (Space reaches the platform uncancelled), and the
 * change pipeline the browser fires after Space/click is exercised
 * directly. The arrow/Enter paths ARE the element's own handlers and run
 * fully here.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkSegmentedRadio): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: the options clamp dev-warns, Lit dev-mode may warn. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

const YES_NO = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const THREE = [
  { value: 'all', label: 'Все' },
  { value: 'yes', label: 'Да', disabled: true },
  { value: 'no', label: 'Нет' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkSegmentedRadio>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkSegmentedRadio> => {
  const el = new TkSegmentedRadio();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const inputs = (el: TkSegmentedRadio): HTMLInputElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
];

/** Index of the checked radio (-1 when none). */
const checkedIndex = (el: TkSegmentedRadio): number => inputs(el).findIndex((input) => input.checked);

/** The element's own arrow/Enter handler — dispatches keydown on `from`'s input. */
const keydown = (el: TkSegmentedRadio, from: number, key: string): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
  inputs(el)[from]?.dispatchEvent(event);
  return event;
};

/**
 * Simulate the browser's post-Space/post-click commit: check the native
 * radio and run the change pipeline (exactly what the UA fires).
 */
const click = (el: TkSegmentedRadio, index: number): void => {
  const input = inputs(el)[index];
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
};

/** Capture value-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkSegmentedRadio): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: string }>;
    values.push(custom.detail.value);
  });
  return values;
};

describe('tk-segmented-radio', () => {
  it('registers as tk-segmented-radio exposing TkSegmentedRadio', async () => {
    await customElements.whenDefined('tk-segmented-radio');
    expect(customElements.get('tk-segmented-radio')).toBe(TkSegmentedRadio);
  });

  it('renders the group label + radiogroup track with native named radios (structure)', async () => {
    const el = await mount({ props: { label: 'Гражданство РФ?', options: YES_NO } });
    expect(el.shadowRoot?.querySelector('.label')?.textContent).toContain('Гражданство РФ?');
    const track = el.shadowRoot?.querySelector('[role="radiogroup"]');
    expect(track, 'the track carries the radiogroup role').not.toBeNull();
    expect(track?.getAttribute('aria-labelledby')).toBeTruthy();
    const group = inputs(el);
    expect(group).toHaveLength(2);
    for (const input of group) {
      expect(input.type).toBe('radio');
      // One shared name = one native radio group (per-tree: instances never cross).
      expect(input.name).toBe(group[0]?.name);
    }
    expect(group[0]?.value).toBe('yes');
    expect(group[1]?.value).toBe('no');
    // The segment label wraps input + surface (click-to-select + naming).
    for (const input of group) {
      expect(input.closest('label')).toBe(input.parentElement);
    }
    expect(el.shadowRoot?.querySelector('.segment__dot')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('names the group via aria-label when no label prop is set (axe name gate)', async () => {
    const el = await mount({ props: { options: YES_NO } });
    const track = el.shadowRoot?.querySelector('[role="radiogroup"]');
    expect(track?.getAttribute('aria-label')).toBe('Выбор');
    expect(track?.getAttribute('aria-labelledby')).toBeNull();
    const withLabel = await mount({ props: { label: 'Гражданство РФ?', options: YES_NO } });
    expect(
      withLabel.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-label'),
    ).toBeNull();
  });

  // --- Matrix row 1: arrows move + select (wrapping) --------------------------

  it('ArrowRight/ArrowDown move focus AND selection to the next option; value-change emits', async () => {
    const el = await mount({ props: { options: YES_NO, defaultValue: 'yes' } });
    const values = collectValues(el);
    const parentHeard: string[] = [];
    el.parentElement?.addEventListener('value-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      parentHeard.push(custom.detail.value);
      expect(custom.composed).toBe(true);
    });

    const event = keydown(el, 0, 'ArrowRight');
    expect(event.defaultPrevented, 'the element owns the arrow (UA move suppressed)').toBe(true);
    await elementUpdated(el);

    expect(values).toEqual(['no']);
    expect(parentHeard).toEqual(['no']);
    expect(checkedIndex(el)).toBe(1);
    expect(el.shadowRoot?.activeElement, "focus moved within the group (document.activeElement is the host in shadow DOM)").toBe(inputs(el)[1]);
    expect(el.value).toBeUndefined(); // uncontrolled: the channel stays free

    // ArrowDown behaves as next too — and WRAPS from the last option back to
    // the first, selecting it (the same move Left/Up mirror).
    keydown(el, 1, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['no', 'yes']);
    expect(checkedIndex(el)).toBe(0);
  });

  it('arrows WRAP at the edges (last → first, first → last)', async () => {
    const el = await mount({ props: { options: YES_NO, defaultValue: 'no' } });
    const values = collectValues(el);

    keydown(el, 1, 'ArrowRight'); // last → wraps to first
    await elementUpdated(el);
    expect(values).toEqual(['yes']);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement, "focus moved within the group (document.activeElement is the host in shadow DOM)").toBe(inputs(el)[0]);

    keydown(el, 0, 'ArrowLeft'); // first → wraps to last
    await elementUpdated(el);
    expect(values).toEqual(['yes', 'no']);
    expect(checkedIndex(el)).toBe(1);
  });

  it('Space is never intercepted (the platform owns it) and the change pipeline selects', async () => {
    const el = await mount({ props: { options: YES_NO } });
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
    expect(values).toEqual(['no']);
    expect(checkedIndex(el)).toBe(1);
  });

  it('Enter selects the focused option and suppresses form submit; already-selected = no-op', async () => {
    const el = await mount({ props: { options: YES_NO, defaultValue: 'yes' } });
    const values = collectValues(el);

    const event = keydown(el, 1, 'Enter');
    expect(event.defaultPrevented, 'Enter must not submit the surrounding form').toBe(true);
    await elementUpdated(el);
    expect(values).toEqual(['no']);
    expect(checkedIndex(el)).toBe(1);

    // Enter on the already-selected option: a no-op — nothing re-emits.
    keydown(el, 1, 'Enter');
    await elementUpdated(el);
    expect(values).toEqual(['no']);
  });

  // --- Matrix row 2: skip disabled; all-disabled inert ---------------------------

  it('disabled options are skipped by arrows in BOTH directions', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'all' } });
    const values = collectValues(el);

    keydown(el, 0, 'ArrowRight'); // middle is disabled → lands on last
    await elementUpdated(el);
    expect(values).toEqual(['no']);
    expect(checkedIndex(el)).toBe(2);
    expect(el.shadowRoot?.activeElement, "focus moved within the group (document.activeElement is the host in shadow DOM)").toBe(inputs(el)[2]);

    keydown(el, 2, 'ArrowLeft'); // back: skips the disabled middle again
    await elementUpdated(el);
    expect(values).toEqual(['no', 'all']);
    expect(checkedIndex(el)).toBe(0);
  });

  it('disabled option: click/Space change reverts, nothing emits; aria-disabled marks it', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'all' } });
    expect(inputs(el)[1]?.getAttribute('aria-disabled')).toBe('true');
    expect(inputs(el)[0]?.getAttribute('aria-disabled')).toBeNull();

    const values = collectValues(el);
    click(el, 1);
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
  });

  it('all-disabled group: arrows inert — no move, no emit, selection untouched', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B', disabled: true },
        ],
        defaultValue: 'a',
      },
    });
    const values = collectValues(el);
    // Focus lands on the disabled segment programmatically (aria-disabled
    // keeps it focusable — the pilot pattern)…
    inputs(el)[0]?.focus();
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[0]);
    const event = keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(event.defaultPrevented).toBe(true); // the group still owns its arrows
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement, "focus cannot move — no enabled target exists").toBe(inputs(el)[0]);
  });

  it('disabled GROUP: arrows are owned (preventDefaulted) and inert — no move, no emit', async () => {
    const el = await mount({ props: { options: YES_NO, defaultValue: 'yes', disabled: true } });
    const values = collectValues(el);
    inputs(el)[0]?.focus();
    const event = keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    // preventDefault BEFORE the disabled exit: the UA's own radio-arrow move
    // (which roves focus in real browsers) must never run — live-asserted in
    // tests/visual/segmented-radio.spec.ts.
    expect(event.defaultPrevented).toBe(true);
    expect(values).toEqual([]);
    expect(checkedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement).toBe(inputs(el)[0]);
    // Enter is owned the same way (no form submit from a disabled group).
    const enter = keydown(el, 0, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    expect(values).toEqual([]);
  });

  it('group label is a non-interactive SPAN named-into the radiogroup (no for, no orphan affordance)', async () => {
    const el = await mount({ props: { label: 'Гражданство РФ?', options: YES_NO, defaultValue: 'yes' } });
    // The Input mold's label[for] does NOT transfer to radio groups: pointing
    // for at the tab-stop radio concatenates the group text onto that one
    // option's accessible name («Гражданство РФ? Да» while «Нет» stays bare —
    // probed live in chromium). The span + aria-labelledby naming keeps every
    // option named by its own wrapping segment label.
    const label = el.shadowRoot?.querySelector('.label');
    expect(label?.tagName).toBe('SPAN');
    expect(label?.getAttribute('for')).toBeNull();
    expect(label?.getAttribute('id')).toBeTruthy();
    // Group naming rides the span's id; options carry no ids to associate.
    expect(el.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-labelledby')).toBe(
      label?.getAttribute('id'),
    );
    expect(inputs(el)[0]?.getAttribute('id')).toBeNull();
  });

  // --- Matrix row 3: exactly one selected ever -----------------------------------

  it('exactly one checked radio through any interaction sequence (uncontrolled)', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'no' } });
    keydown(el, 2, 'ArrowRight'); // wrap onto disabled-skipping path
    await elementUpdated(el);
    keydown(el, 0, 'ArrowRight'); // skips middle
    await elementUpdated(el);
    click(el, 2);
    await elementUpdated(el);
    const checked = inputs(el).filter((input) => input.checked);
    expect(checked).toHaveLength(1);
    expect(checked[0]?.value).toBe('no');
  });

  it('exactly one checked radio in controlled mode — in BOTH the live window and after the strict revert', async () => {
    const el = await mount({ props: { options: YES_NO, value: 'yes' } });
    // The live window: arrow selects «no» natively while the channel holds «yes».
    keydown(el, 0, 'ArrowRight');
    expect(inputs(el).filter((input) => input.checked)).toHaveLength(1);
    expect(inputs(el)[1]?.checked).toBe(true);

    // The strict revert: any update the element runs re-renders exactly `value`.
    el.requestUpdate();
    await elementUpdated(el);
    expect(el.value).toBe('yes');
    expect(checkedIndex(el)).toBe(0);
    expect(inputs(el).filter((input) => input.checked)).toHaveLength(1);
  });

  // --- Matrix row 4: roving tabindex ----------------------------------------------

  it('roving tabindex: selected option 0, others -1; nothing selected → first non-disabled', async () => {
    const el = await mount({ props: { options: THREE, defaultValue: 'yes' } });
    let tabs = inputs(el).map((input) => input.getAttribute('tabindex'));
    expect(tabs).toEqual(['0', '-1', '-1']);

    // Focus+selection move → the roving tab stop moves with them.
    keydown(el, 0, 'ArrowRight');
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

  // --- Matrix row 5: controlled strictness + release (string channel) ---------------

  it('controlled selection: value-change emits, nothing mutates locally; the next update reverts exactly value', async () => {
    const el = await mount({ props: { options: YES_NO, value: 'yes' } });
    const values = collectValues(el);

    click(el, 1);
    expect(values).toEqual(['no']);
    expect(el.value).toBe('yes'); // strict: the channel is untouched
    expect(inputs(el)[1]?.checked).toBe(true); // native-feeling live flip…

    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0); // …until an update reverts it
  });

  it('controlled value updates render immediately (consumer drives the segment)', async () => {
    const el = await mount({ props: { options: YES_NO, value: 'yes' } });
    el.value = 'no';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(1);
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { options: YES_NO, value: 'yes' } });
    el.value = 'no';
    await elementUpdated(el);

    el.value = undefined; // release
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(1); // seeded from the LAST controlled value
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    keydown(el, 1, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['yes']);
    expect(checkedIndex(el)).toBe(0);
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { options: YES_NO, value: 'no' } });
    el.value = undefined;
    await elementUpdated(el);

    el.value = 'yes';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0);

    click(el, 1); // consumer-unanswered selection: live flip only
    expect(checkedIndex(el)).toBe(1);
    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(0); // strict revert resumes
  });

  it('defaultValue seeds the uncontrolled state at connect; later mutations are ignored', async () => {
    const el = await mount({ props: { options: YES_NO }, attributes: { 'default-value': 'no' } });
    expect(checkedIndex(el)).toBe(1);
    el.defaultValue = 'yes';
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(1); // initial-value semantics
  });

  it('value wins over defaultValue when both are set (controlled at first paint)', async () => {
    const el = await mount({
      props: { options: YES_NO, value: 'no' },
      attributes: { 'default-value': 'yes' },
    });
    expect(checkedIndex(el)).toBe(1);
    el.requestUpdate();
    await elementUpdated(el);
    expect(checkedIndex(el)).toBe(1);
  });

  // --- Matrix row 6: form participation (wiring — live FormData in tests/visual) ---

  it('form wiring: formAssociated host mirrors the entry; the native radios carry the pass-through', async () => {
    expect((TkSegmentedRadio as unknown as { formAssociated?: boolean }).formAssociated).toBe(true);

    const form = document.createElement('form');
    document.body.appendChild(form);
    const el = new TkSegmentedRadio();
    el.setAttribute('name', 'citizenship');
    form.appendChild(el);
    Object.assign(el, { options: YES_NO, defaultValue: 'yes' });
    await elementUpdated(el);

    const group = inputs(el);
    // The pass-through lands on the native controls (grouping + direct-DOM
    // consumers); the SUBMISSION entry itself rides the host's
    // ElementInternals mirror (this env cannot execute it — proven live in
    // tests/visual/segmented-radio.spec.ts).
    expect(group[0]?.name).toBe('citizenship');
    expect(group[0]?.value).toBe('yes');
    expect(el.getAttribute('name')).toBe('citizenship');
    expect(group[0]?.getRootNode()).toBe(el.shadowRoot);
    expect(form.contains(el)).toBe(true);

    form.remove();
  });

  it('group name uniqueness: two instances never share a radio group name', async () => {
    const a = await mount({ props: { options: YES_NO } });
    const b = await mount({ props: { options: YES_NO } });
    expect(inputs(a)[0]?.name).not.toBe(inputs(b)[0]?.name);
  });

  // --- Matrix row 7: null/empty options ----------------------------------------------

  it('options=null / [] renders an empty inert track — no crash, no tab stops', async () => {
    const el = await mount({ props: { options: null as unknown as [] } });
    expect(el.shadowRoot?.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(inputs(el)).toHaveLength(0);
    // Inert: no input exists to key, and updates keep working.
    el.options = [];
    await elementUpdated(el);
    expect(inputs(el)).toHaveLength(0);

    // Options arriving later render normally.
    el.options = YES_NO;
    await elementUpdated(el);
    expect(inputs(el)).toHaveLength(2);
    expect(inputs(el).map((input) => input.getAttribute('tabindex'))).toEqual(['0', '-1']);
  });

  // --- Clamps + reflection (CONVENTIONS §2) -------------------------------------------

  it('duplicate option VALUES clamp: later duplicates and value-less entries drop with a dev warn', async () => {
    const el = await mount({
      props: {
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'yes', label: 'Да (дубль)' },
          { value: 'no', label: 'Нет' },
          { value: '', label: 'Пусто' },
        ] as unknown as [],
      },
    });
    await elementUpdated(el); // the clamp schedules a follow-up update
    expect(inputs(el)).toHaveLength(2);
    expect(inputs(el).map((input) => input.value)).toEqual(['yes', 'no']);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('clamps non-string channel input to its string form; null releases', async () => {
    const el = await mount({ props: { options: YES_NO } });
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
    const el = await mount({ props: { options: YES_NO } });
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).toBe(true);
    // aria-disabled rides every input while the group is disabled (focusable pattern).
    for (const input of inputs(el)) {
      expect(input.getAttribute('aria-disabled')).toBe('true');
    }
    el.value = 'yes';
    el.defaultValue = 'no';
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.hasAttribute('default-value')).toBe(false);
    // The RADIOGROUP itself carries the disabled state too (AT announces the
    // whole group unavailable; the dimmed label rides the disabled-label
    // contrast exemption — probed, see the class doc).
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
