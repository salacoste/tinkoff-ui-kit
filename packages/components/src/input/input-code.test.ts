// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkInput } from './input.js';
import { inputStyles } from './input.css.js';

/**
 * tk-input CODE MODE unit tests (spec 26.4): the cell row contract, the
 * typing/paste/deletion mechanics, the §4/§9 value channel on the joined
 * string, complete firing, clamping, group semantics and the disabled/error
 * group states.
 *
 * Focus is asserted through focus() SPIES, not shadowRoot.activeElement —
 * happy-dom's focus routing is not a browser's. The REAL focus walk
 * (auto-advance, arrows, backspace) is proven by the Chromium functional
 * spec (tests/visual/input-code.spec.ts) through shadowRoot.activeElement —
 * the v1.5.0 lesson.
 */

const elementUpdated = (el: TkInput): Promise<unknown> => el.updateComplete;

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkInput>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkInput> => {
  const el = new TkInput();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const cells = (el: TkInput): HTMLInputElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll<HTMLInputElement>('.code__cell') ?? []);

const group = (el: TkInput): HTMLElement | null =>
  (el.shadowRoot?.querySelector('.code') as HTMLElement | null) ?? null;

/** Type into cell i: set the live text and run the input pipeline. */
const typeIn = (el: TkInput, index: number, text: string): void => {
  const cell = cells(el)[index];
  cell.value = text;
  cell.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

/** Press a key on cell i (the real keydown pipeline). */
const press = (el: TkInput, index: number, key: string): void => {
  cells(el)[index].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
};

/** Synthetic clipboard paste onto cell i with the given raw text. */
const pasteInto = (el: TkInput, index: number, text: string): Event => {
  const event = new Event('paste', { bubbles: true, composed: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: () => text },
  });
  cells(el)[index].dispatchEvent(event);
  return event;
};

/** Capture value-change / complete payloads in arrival order. */
const collectEvents = (el: TkInput): { values: string[]; completes: string[]; order: string[] } => {
  const values: string[] = [];
  const completes: string[] = [];
  const order: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    values.push((event as CustomEvent<{ value: string }>).detail.value);
    order.push('value-change');
  });
  el.addEventListener('complete', (event: Event) => {
    completes.push((event as CustomEvent<{ value: string }>).detail.value);
    order.push('complete');
  });
  return { values, completes, order };
};

describe('tk-input code mode', () => {
  it('renders a named group of one-digit cells with the OTP attributes', async () => {
    const el = await mount({
      attributes: { code: '', label: 'Код подтверждения', name: 'otp' },
    });
    const row = cells(el);
    expect(row).toHaveLength(4);
    // The SMS contract: numeric keyboard, one char, first cell names the code
    // for the browser's own SMS fill; the rest opt OUT of any autofill.
    expect(row[0].getAttribute('autocomplete')).toBe('one-time-code');
    expect(row[1].getAttribute('autocomplete')).toBe('off');
    expect(row[2].getAttribute('inputmode')).toBe('numeric');
    expect(row[3].getAttribute('maxlength')).toBe('1');
    row.forEach((cell) => expect(cell.type).toBe('text'));
    // name is a first-cell pass-through (the group submits one value).
    expect(row[0].getAttribute('name')).toBe('otp');
    expect(row[1].getAttribute('name')).toBeNull();
    // Group semantics (AC3): role=group named by the label prop; per-cell
    // 1-based names; the visible <label for> targets the first cell.
    expect(group(el)?.getAttribute('role')).toBe('group');
    expect(group(el)?.getAttribute('aria-label')).toBe('Код подтверждения');
    expect(row.map((c) => c.getAttribute('aria-label'))).toEqual([
      'Цифра 1',
      'Цифра 2',
      'Цифра 3',
      'Цифра 4',
    ]);
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.getAttribute('for')).toBe(row[0].id);
  });

  it('an explicit autocomplete prop wins on the first cell (pass-through family)', async () => {
    const el = await mount({
      attributes: { code: '' },
      props: { autocomplete: 'sms-otp' },
    });
    expect(cells(el)[0].getAttribute('autocomplete')).toBe('sms-otp');
    expect(cells(el)[1].getAttribute('autocomplete')).toBe('off');
  });

  it('without a label the group falls back to the «Код подтверждения» name — never nameless', async () => {
    const el = await mount({ attributes: { code: '' } });
    expect(group(el)?.getAttribute('aria-label')).toBe('Код подтверждения');
    expect(el.shadowRoot?.querySelector('label')).toBeNull();
  });

  it('clamps length to 4–8 (NaN reads as the default 4) and re-renders the row', async () => {
    const el = await mount({ attributes: { code: '', length: '2' } });
    expect(el.length).toBe(4);
    expect(cells(el)).toHaveLength(4);

    el.length = 9;
    await elementUpdated(el);
    expect(el.length).toBe(8);
    expect(cells(el)).toHaveLength(8);

    el.length = Number.NaN;
    await elementUpdated(el);
    expect(el.length).toBe(4);
    expect(cells(el)).toHaveLength(4);
  });

  it('typing commits the digit, emits value-change, and auto-advances focus', async () => {
    const el = await mount({ attributes: { code: '', label: 'Код подтверждения' } });
    const row = cells(el);
    const { values } = collectEvents(el);
    const focusSpies = row.map((cell) => vi.spyOn(cell, 'focus'));

    typeIn(el, 0, '1');
    await elementUpdated(el);
    expect(values).toEqual(['1']);
    // Auto-advance: the NEXT cell received focus.
    expect(focusSpies[1]).toHaveBeenCalledTimes(1);
    expect(focusSpies[0]).not.toHaveBeenCalled();
    // The committed digit is pinned by the data-filled state + live value.
    expect(row[0].hasAttribute('data-filled')).toBe(true);
    expect(row[0].value).toBe('1');
  });

  it('filling every cell fires complete AFTER the final value-change (detail { value })', async () => {
    const el = await mount({ attributes: { code: '' } });
    const { values, completes, order } = collectEvents(el);

    typeIn(el, 0, '1');
    typeIn(el, 1, '2');
    typeIn(el, 2, '3');
    typeIn(el, 3, '4');
    await elementUpdated(el);

    expect(values).toEqual(['1', '12', '123', '1234']);
    expect(completes).toEqual(['1234']);
    // Order: the state channel speaks first, the completion occurrence second.
    expect(order.slice(-2)).toEqual(['value-change', 'complete']);
    const last = el.shadowRoot?.querySelector('.code__cell:last-child');
    expect(last?.hasAttribute('data-filled')).toBe(true);
  });

  it('re-typing the last digit of a full code fires complete again with the new value', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '1234' } });
    await elementUpdated(el);
    const { values, completes } = collectEvents(el);

    typeIn(el, 3, '5');
    await elementUpdated(el);
    expect(values).toEqual(['1235']);
    expect(completes).toEqual(['1235']);
  });

  it('a non-digit never commits: the cell snaps back, nothing emits', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '12' } });
    const { values, completes } = collectEvents(el);

    typeIn(el, 2, 'x');
    expect(values).toEqual([]);
    expect(completes).toEqual([]);
    expect(cells(el)[2].value).toBe('');
    expect(cells(el)[0].value).toBe('1');
  });

  it('paste-split via the input pipeline: «1 2-3 4» → value «1234» + complete + tail focus', async () => {
    const el = await mount({ attributes: { code: '' } });
    const row = cells(el);
    const { values, completes } = collectEvents(el);
    const focusSpies = row.map((cell) => vi.spyOn(cell, 'focus'));

    typeIn(el, 0, '1 2-3 4');
    await elementUpdated(el);

    expect(values).toEqual(['1234']);
    expect(completes).toEqual(['1234']);
    expect(row.map((c) => c.value)).toEqual(['1', '2', '3', '4']);
    // Focus lands on the cell AFTER the last written one — the last cell here.
    expect(focusSpies[3]).toHaveBeenCalledTimes(1);
  });

  it('paste-split fills from the FOCUSED cell, clamped by the row end', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '1' } });
    const { values } = collectEvents(el);

    typeIn(el, 1, '2-3-4-5-6');
    await elementUpdated(el);
    // Row of 4: only three of the five pasted digits fit past cell 1.
    expect(values).toEqual(['1234']);
    expect(cells(el).map((c) => c.value)).toEqual(['1', '2', '3', '4']);
  });

  it('the paste event is intercepted (preventDefault) and digit-stripped', async () => {
    const el = await mount({ attributes: { code: '' } });
    const { values } = collectEvents(el);

    const event = pasteInto(el, 0, '9 8-7 6');
    await elementUpdated(el);
    expect(event.defaultPrevented).toBe(true);
    expect(values).toEqual(['9876']);
    expect(cells(el).map((c) => c.value)).toEqual(['9', '8', '7', '6']);
  });

  it('a digit-less paste is ignored entirely (no preventDefault, no events)', async () => {
    const el = await mount({ attributes: { code: '' } });
    const { values } = collectEvents(el);

    const event = pasteInto(el, 0, 'a-b');
    expect(event.defaultPrevented).toBe(false);
    expect(values).toEqual([]);
  });

  it('Backspace on an EMPTY cell walks back and clears the previous digit', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '12' } });
    const row = cells(el);
    const { values } = collectEvents(el);
    const focusSpies = row.map((cell) => vi.spyOn(cell, 'focus'));

    // Cell 2 is empty (value '12' filled cells 0–1); Backspace there.
    press(el, 2, 'Backspace');
    await elementUpdated(el);

    expect(values).toEqual(['1']);
    expect(row[1].value).toBe('');
    expect(focusSpies[1]).toHaveBeenCalledTimes(1);
  });

  it('Backspace on the empty FIRST cell is a no-op (nothing behind to clear)', async () => {
    const el = await mount({ attributes: { code: '' } });
    const { values } = collectEvents(el);
    press(el, 0, 'Backspace');
    await elementUpdated(el);
    expect(values).toEqual([]);
  });

  it('native deletion on a filled cell commits through the input pipeline (no focus move)', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '1234' } });
    const row = cells(el);
    const { values } = collectEvents(el);
    const focusSpies = row.map((cell) => vi.spyOn(cell, 'focus'));

    // The browser clears the char itself; the input event carries ''.
    typeIn(el, 3, '');
    await elementUpdated(el);
    expect(values).toEqual(['123']);
    expect(row.map((c) => c.value)).toEqual(['1', '2', '3', '']);
    focusSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });

  it('deleting a middle cell compacts — the value is the joined string, holes cannot exist', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '1234' } });
    typeIn(el, 1, '');
    await elementUpdated(el);
    expect(cells(el).map((c) => c.value)).toEqual(['1', '3', '4', '']);
  });

  it('←/→ walk the row; the ends are quiet', async () => {
    const el = await mount({ attributes: { code: '' } });
    const row = cells(el);
    const focusSpies = row.map((cell) => vi.spyOn(cell, 'focus'));

    press(el, 1, 'ArrowRight');
    expect(focusSpies[2]).toHaveBeenCalledTimes(1);
    press(el, 2, 'ArrowLeft');
    expect(focusSpies[1]).toHaveBeenCalledTimes(1);
    // Off-both-ends: no crash, no focus calls beyond the row.
    press(el, 0, 'ArrowLeft');
    press(el, 3, 'ArrowRight');
    expect(focusSpies[0]).not.toHaveBeenCalled();
    expect(focusSpies[3]).not.toHaveBeenCalled();
  });

  it('§9: nothing dispatches at first render — defaultValue prefills silently', async () => {
    const el = await mount({ attributes: { code: '', 'default-value': '12' } });
    const { values, completes } = collectEvents(el);
    expect(values).toEqual([]);
    expect(completes).toEqual([]);
    expect(cells(el).map((c) => c.value)).toEqual(['1', '2', '', '']);
    expect(cells(el)[0].hasAttribute('data-filled')).toBe(true);
    expect(cells(el)[2].hasAttribute('data-filled')).toBe(false);
  });

  it('controlled typing: emits the candidate, applies nothing — live text survives until an update', async () => {
    const el = await mount({ attributes: { code: '' }, props: { value: '12' } });
    const { values, completes } = collectEvents(el);
    expect(cells(el).map((c) => c.value)).toEqual(['1', '2', '', '']);

    typeIn(el, 2, '3');
    expect(values).toEqual(['123']);
    // Strict: the channel is untouched; complete speaks the candidate.
    expect(el.value).toBe('12');
    expect(completes).toEqual([]);
    // Caret sanity: the live digit stays visible until an update runs…
    expect(cells(el)[2].value).toBe('3');
    // …and any update the element runs re-syncs to exactly `value`.
    el.requestUpdate();
    await elementUpdated(el);
    expect(cells(el)[2].value).toBe('');
  });

  it('controlled value renders digit-stripped and row-clamped (display clamp, prop untouched)', async () => {
    const el = await mount({ attributes: { code: '' }, props: { value: '12 34-5' } });
    expect(el.value).toBe('12 34-5');
    expect(cells(el).map((c) => c.value)).toEqual(['1', '2', '3', '4']);
  });

  it('a controlled answer that completes the row fires nothing extra (events are user-driven only)', async () => {
    const el = await mount({ attributes: { code: '' }, props: { value: '12' } });
    const { completes } = collectEvents(el);
    el.value = '1234';
    await elementUpdated(el);
    expect(cells(el).map((c) => c.value)).toEqual(['1', '2', '3', '4']);
    expect(completes).toEqual([]);
  });

  it('disabled governs the whole group: readonly + aria-disabled cells, typing inert', async () => {
    const el = await mount({
      attributes: { code: '', 'default-value': '1' },
      props: { disabled: true },
    });
    const { values, completes } = collectEvents(el);
    cells(el).forEach((cell) => {
      expect(cell.readOnly).toBe(true);
      expect(cell.getAttribute('aria-disabled')).toBe('true');
    });
    typeIn(el, 1, '2');
    press(el, 1, 'ArrowRight');
    pasteInto(el, 1, '34');
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(completes).toEqual([]);
  });

  it('error outlines every cell: code--error, aria-invalid + described-by on each, message below', async () => {
    const el = await mount({ attributes: { code: '' }, props: { error: 'Неверный код' } });
    const row = cells(el);
    expect(group(el)?.classList.contains('code--error')).toBe(true);
    const message = el.shadowRoot?.querySelector('.error');
    expect(message?.textContent).toContain('Неверный код');
    row.forEach((cell) => {
      expect(cell.getAttribute('aria-invalid')).toBe('true');
      expect(cell.getAttribute('aria-describedby')).toBe(message?.getAttribute('id'));
    });
  });

  it('required + blur with an EMPTY row: the calm message; inter-cell walks never trip it', async () => {
    const el = await mount({ attributes: { code: '', required: '', 'default-value': '1' } });
    // Partial value: blur (an inter-cell walk) must not trip the check.
    cells(el)[0].dispatchEvent(new Event('blur'));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();

    typeIn(el, 1, '');
    // '' compacts the row to empty… still '1'. Empty the row properly:
    typeIn(el, 0, '');
    await elementUpdated(el);
    cells(el)[0].dispatchEvent(new Event('blur'));
    await elementUpdated(el);
    const message = el.shadowRoot?.querySelector('.error');
    expect(message?.textContent).toContain('Обязательное поле');
    cells(el).forEach((cell) => expect(cell.getAttribute('aria-invalid')).toBe('true'));
  });

  it('the mode switch is a reflected attribute (markup-visible: <tk-input code>)', async () => {
    const el = await mount();
    expect(el.hasAttribute('code')).toBe(false);
    el.code = true;
    await elementUpdated(el);
    expect(el.hasAttribute('code')).toBe(true);
    expect(cells(el)).toHaveLength(4);
    // And back: the single field returns untouched.
    el.code = false;
    await elementUpdated(el);
    expect(cells(el)).toHaveLength(0);
    expect(el.shadowRoot?.querySelector('.field__control')).toBeInstanceOf(HTMLInputElement);
  });

  it('CSS pins: kit-register geometry, the four spec hooks, state borders, no motion', () => {
    const cssText = inputStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    // The four AC4 hooks, exactly.
    const hooks = new Set(cssText.match(/--tk-input-code-[a-z-]+/g) ?? []);
    expect(hooks).toEqual(
      new Set([
        '--tk-input-code-size',
        '--tk-input-code-cell',
        '--tk-input-code-gap',
        '--tk-input-code-border-active',
      ]),
    );
    // Kit-register geometry: the 52px family square, radius-md, border-default.
    expect(cssText).toMatch(/\.code__cell\s*\{[^}]*width:\s*var\(--tk-input-code-size,\s*52px\)/);
    expect(cssText).toMatch(/height:\s*var\(--tk-input-code-size,\s*52px\)/);
    expect(cssText).toMatch(/border-radius:\s*var\(--tk-input-radius,\s*var\(--tk-radius-md\)\)/);
    expect(cssText).toMatch(/\.code__cell\s*\{[^}]*border:\s*1px solid var\(--tk-color-border-default\)/);
    // Filled → border-strong; error → error-on-field; focus keeps the family
    // ring and the yellow accent hook.
    expect(cssText).toMatch(/\.code__cell\[data-filled\]\s*\{[^}]*border-color:\s*var\(--tk-color-border-strong\)/);
    expect(cssText).toMatch(/\.code__cell:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--tk-color-focus-ring\)/);
    expect(cssText).toMatch(/border-color:\s*var\(--tk-input-code-border-active,\s*var\(--tk-color-focus-ring\)\)/);
    expect(cssText).toMatch(/\.code--error \.code__cell\s*\{[^}]*border-color:\s*var\(--tk-color-error-on-field\)/);
    // No motion in the code row (the input family is instant).
    expect(cssText).not.toMatch(/transition/);
    expect(cssText).not.toMatch(/animation/);
  });
});
