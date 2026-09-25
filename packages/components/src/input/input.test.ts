// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkInput } from './input.js';
import { inputStyles } from './input.css.js';

/**
 * tk-input unit tests (spec 2.1): the eight I/O matrix rows — uncontrolled
 * typing, controlled strictness (emits, never mutates), controlled release
 * seeding, defaultValue ignored after connect, required+blur validation,
 * consumer error override/clear, badge announcement order — plus the aria
 * wiring (described-by / invalid / required), enum clamping, pass-through
 * props, and disabled semantics.
 *
 * Focus-theft split: happy-dom fires no real focus moves — «the error never
 * steals focus» is pinned HERE structurally (validation runs on blur and
 * never calls focus()/any focus API; activeElement is untouched) and in the
 * story a11y notes for the walkthrough half.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkInput): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: Lit dev-mode may warn on attribute misses. */
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
  badge?: string;
};

const mount = async ({ props, attributes, badge }: MountOptions = {}): Promise<TkInput> => {
  const el = new TkInput();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (badge !== undefined) {
    const chip = document.createElement('span');
    chip.setAttribute('slot', 'badge');
    chip.textContent = badge;
    el.appendChild(chip);
  }
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const control = (el: TkInput): HTMLInputElement => {
  const input = el.shadowRoot?.querySelector('input');
  expect(input, 'inner native <input> renders').toBeInstanceOf(HTMLInputElement);
  return input as HTMLInputElement;
};

/** Simulate typing: set the live text and run the input pipeline. */
const type = (el: TkInput, text: string): void => {
  control(el).value = text;
  control(el).dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

/** Capture value-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkInput): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: string }>;
    values.push(custom.detail.value);
  });
  return values;
};

const blur = (el: TkInput): void => {
  control(el).dispatchEvent(new Event('blur'));
};

describe('tk-input', () => {
  it('registers as tk-input exposing TkInput', async () => {
    await customElements.whenDefined('tk-input');
    expect(customElements.get('tk-input')).toBe(TkInput);
  });

  it('renders a native <input> in the shadow root, type defaulting to text', async () => {
    const el = await mount();
    const input = control(el);
    expect(input.type).toBe('text');
  });

  // --- Matrix row 1: uncontrolled typing ---------------------------------

  it('uncontrolled typing: internal state updates and value-change emits (composed, bubbles, detail { value })', async () => {
    const el = await mount({ attributes: { label: 'ФИО', placeholder: 'Иван' } });
    const values = collectValues(el);
    // Composed + bubbles: the listener above sits on the element itself; a
    // second listener on the parent proves the event crosses both borders.
    const parentHeard: string[] = [];
    el.parentElement?.addEventListener('value-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      parentHeard.push(custom.detail.value);
      expect(custom.composed).toBe(true);
    });

    type(el, 'Ив');
    type(el, 'Иван');

    expect(values).toEqual(['Ив', 'Иван']);
    expect(parentHeard).toEqual(['Ив', 'Иван']);
    // Uncontrolled: the property channel stays free (undefined) — the state
    // lives inside, surfaced through the event.
    expect(el.value).toBeUndefined();
    expect(control(el).value).toBe('Иван');
  });

  // --- Matrix row 2: controlled strictness --------------------------------

  it('controlled typing: value-change emits, nothing mutates locally; the next update re-renders exactly value', async () => {
    const el = await mount({ props: { value: 'a' } });
    const values = collectValues(el);

    type(el, 'ab');
    expect(values).toEqual(['ab']);
    // Strict: the channel is untouched by typing.
    expect(el.value).toBe('a');
    // Caret sanity: the live text stays visible UNTIL an update runs…
    expect(control(el).value).toBe('ab');
    // …and any update the element runs re-syncs it to exactly `value`
    // (the Design Notes contract — this is what "renders exactly value" means).
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('a');
  });

  it('controlled value updates render immediately (consumer drives the text)', async () => {
    const el = await mount({ props: { value: 'a' } });
    el.value = 'abc';
    await elementUpdated(el);
    expect(control(el).value).toBe('abc');
  });

  // --- Matrix row 3: controlled released ----------------------------------

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { value: 'a' } });
    el.value = 'abc';
    await elementUpdated(el);

    el.value = undefined; // release
    await elementUpdated(el);
    // Seeded from the LAST controlled value — not the first, not blank.
    expect(control(el).value).toBe('abc');
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    type(el, 'abcd');
    expect(control(el).value).toBe('abcd');
    expect(values).toEqual(['abcd']);
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { value: 'a' } });
    el.value = undefined;
    await elementUpdated(el);
    type(el, 'xyz');
    expect(control(el).value).toBe('xyz');

    el.value = 'reset';
    await elementUpdated(el);
    expect(control(el).value).toBe('reset');
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('reset');
  });

  // --- Matrix row 4: defaultValue ignored after connect --------------------

  it('defaultValue seeds the uncontrolled state at connect', async () => {
    const el = await mount({ attributes: { 'default-value': 'Иван' } });
    expect(control(el).value).toBe('Иван');
    const values = collectValues(el);
    type(el, 'Иван Петрович');
    expect(values).toEqual(['Иван Петрович']);
  });

  it('defaultValue mutated after connect is ignored (initial-value semantics)', async () => {
    const el = await mount({ attributes: { 'default-value': 'Иван' } });
    type(el, 'Ива');

    el.defaultValue = 'Пётр';
    await elementUpdated(el);
    // The internal state continues from what was typed — the late mutation
    // never re-seeds.
    expect(control(el).value).toBe('Ива');
    type(el, 'Иван');
    expect(control(el).value).toBe('Иван');
  });

  it('value wins over defaultValue when both are set (controlled at first paint)', async () => {
    const el = await mount({ props: { value: 'a' }, attributes: { 'default-value': 'Иван' } });
    expect(control(el).value).toBe('a');
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('a');
  });

  // --- Matrix row 5: required + blur validation ----------------------------

  it('required + blur with empty value: calm message, aria-invalid, described-by wired, focus NOT stolen', async () => {
    const el = await mount({ attributes: { label: 'ФИО', required: '' } });
    const input = control(el);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();

    const focusSpy = vi.spyOn(el, 'focus');
    const activeBefore = document.activeElement;
    blur(el);
    await elementUpdated(el);

    const message = el.shadowRoot?.querySelector('.error');
    expect(message, 'error message renders').not.toBeNull();
    expect(message?.textContent).toContain('Обязательное поле');
    expect(message?.textContent).not.toContain('!');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    // described-by wiring: the id referenced IS the message's id.
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBe(message?.getAttribute('id'));
    expect(el.shadowRoot?.getElementById(describedBy ?? '')).toBe(message);
    // Focus theft: nothing focused, no focus() call.
    expect(focusSpy).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(activeBefore);

    // Blur with a value clears the internal error.
    type(el, 'Иван');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('non-required blur never produces an internal error', async () => {
    const el = await mount({ attributes: { label: 'ФИО' } });
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
  });

  // --- Matrix row 6: consumer error ---------------------------------------

  it('consumer error renders immediately (no blur needed), overrides internal, clears with the prop', async () => {
    const el = await mount({ attributes: { label: 'ФИО' } });
    el.error = 'Проверьте данные';
    await elementUpdated(el);
    const input = control(el);
    expect(el.shadowRoot?.querySelector('.error')?.textContent).toContain('Проверьте данные');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();

    // Overrides the internal error while set…
    el.required = true;
    await elementUpdated(el);
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')?.textContent).toContain('Проверьте данные');

    // …and clearing the prop exposes/clears state again.
    el.error = undefined;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')?.textContent).toContain('Обязательное поле');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    el.error = undefined;
    type(el, 'Иван');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('an empty-string error prop is no error state', async () => {
    const el = await mount({ props: { error: '' } });
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(control(el).getAttribute('aria-invalid')).toBeNull();
  });

  // --- Matrix row 7: badge slot -------------------------------------------

  it('badge slot: announced AFTER the label (labelledby id order) and right-anchored in the field', async () => {
    const el = await mount({ attributes: { label: 'ФИО' }, badge: '+30%' });
    await elementUpdated(el);
    const input = control(el);
    const labelledBy = input.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const order = (labelledBy ?? '').split(/\s+/);
    expect(order).toHaveLength(2);
    const [labelId, badgeId] = order;
    // Order is the announcement order: label first, badge second.
    expect(el.shadowRoot?.getElementById(labelId)?.textContent).toContain('ФИО');
    // The badge id wraps the named slot; name computation flattens the slot,
    // so the claim is "the +30% nodes are ASSIGNED to that slot" (a slot's own
    // textContent is only its fallback content — never the projection).
    const badgeSlot = el.shadowRoot?.getElementById(badgeId)?.querySelector('slot');
    const badgeText = (badgeSlot?.assignedNodes({ flatten: true }) ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(badgeText).toContain('+30%');
    // The label is also a real <label for> fallback + click target.
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.getAttribute('for')).toBe(input.id);
    // Right-anchored in the field: the badge wrapper renders AFTER the input
    // in the flex row and the field carries the badge layout flag.
    expect(el.shadowRoot?.querySelector('.field')?.classList.contains('field--badge')).toBe(true);
    const fieldHtml = el.shadowRoot?.querySelector('.field')?.innerHTML ?? '';
    expect(fieldHtml.indexOf('class="field__control"')).toBeLessThan(
      fieldHtml.indexOf('field__badge'),
    );
    // The chip is slotted light DOM, projected into the named slot.
    expect(el.querySelector('[slot="badge"]')?.textContent).toBe('+30%');
  });

  it('without label or badge the input falls back to the placeholder name (no labelledby noise)', async () => {
    const el = await mount({ attributes: { placeholder: 'Иван' } });
    const input = control(el);
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.getAttribute('placeholder')).toBe('Иван');
    expect(el.shadowRoot?.querySelector('label')).toBeNull();
  });

  it('badge alone (no label) still joins the name chain first', async () => {
    const el = await mount({ badge: '+30%' });
    await elementUpdated(el);
    const labelledBy = control(el).getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(labelledBy).toContain('-badge');
  });

  // --- Pass-through props + enum clamp ------------------------------------

  it('passes name and autocomplete through to the native input', async () => {
    const el = await mount({
      props: { name: 'fullname', autocomplete: 'name' },
    });
    const input = control(el);
    expect(input.getAttribute('name')).toBe('fullname');
    expect(input.getAttribute('autocomplete')).toBe('name');
  });

  it('clamps an invalid type to text and reflects the corrected attribute (CONVENTIONS §2)', async () => {
    const el = await mount({ attributes: { type: 'checkbox' } });
    await elementUpdated(el);
    expect(el.type).toBe('text');
    expect(el.getAttribute('type')).toBe('text');
    expect(control(el).type).toBe('text');

    el.type = 'datetime-local' as unknown as TkInput['type'];
    await elementUpdated(el);
    expect(el.getAttribute('type')).toBe('text');

    el.type = 'email';
    await elementUpdated(el);
    expect(el.getAttribute('type')).toBe('email');
    expect(control(el).type).toBe('email');
  });

  it('reflects boolean props as attributes and never reflects value props (CONVENTIONS §2)', async () => {
    const el = await mount();
    el.required = true;
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    el.value = 'abc';
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.getAttribute('default-value')).toBeNull();
  });

  // --- Disabled -------------------------------------------------------------

  it('disabled: aria-disabled + readonly on the native input, typing inert', async () => {
    const el = await mount({ props: { value: 'a', disabled: true } });
    const input = control(el);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(input.readOnly).toBe(true);

    const values = collectValues(el);
    type(el, 'abc');
    expect(values).toEqual([]);
    expect(el.value).toBe('a');
    // The state channels are untouched by inert typing.
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('a');
  });

  it('disabled blur runs no validation (no phantom errors while disabled)', async () => {
    const el = await mount({ attributes: { required: '' }, props: { disabled: true } });
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
  });

  // --- A11y wiring details ----------------------------------------------------

  it('the required asterisk is aria-hidden (aria-required carries the semantics)', async () => {
    const el = await mount({ attributes: { label: 'ФИО', required: '' } });
    expect(el.shadowRoot?.querySelector('.label__star')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the error icon is decorative (aria-hidden) — the message text carries the content', async () => {
    const el = await mount({ props: { error: 'Проверьте данные' } });
    expect(el.shadowRoot?.querySelector('.error__icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('ids are unique across instances (the aria chain never crosses elements)', async () => {
    const a = await mount({ attributes: { label: 'A', required: '' } });
    const b = await mount({ attributes: { label: 'B', required: '' } });
    const inputA = control(a);
    const inputB = control(b);
    expect(inputA.id).not.toBe(inputB.id);
    a.error = 'x';
    await elementUpdated(a);
    const describedA = inputA.getAttribute('aria-describedby');
    expect(describedA).not.toBe(inputB.getAttribute('aria-describedby'));
  });

  // --- Review fixes (2.1 review pass) ---------------------------------------

  it('controlled blur validates the LIVE text — a lagging consumer never trips a false required error', async () => {
    const el = await mount({ props: { value: '', required: true } });
    const values = collectValues(el);

    // Lagging consumer: typing emitted, `value` not yet re-applied ('').
    type(el, 'Иван');
    expect(values).toEqual(['Иван']);
    expect(el.value).toBe('');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error'), 'live text present → no error').toBeNull();

    // Live text empty (typed over with nothing) → the required error fires.
    type(el, '');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error'), 'live text empty → error').not.toBeNull();
  });

  it('whitespace-only live text counts as empty for the required check', async () => {
    const el = await mount({ attributes: { label: 'ФИО', required: '' } });
    type(el, '   ');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).not.toBeNull();
  });

  it('turning required off clears a shown internal error (no stale message awaiting a blur)', async () => {
    const el = await mount({ attributes: { label: 'ФИО', required: '' } });
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).not.toBeNull();

    el.required = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(control(el).getAttribute('aria-invalid')).toBeNull();
  });

  it('null label / null error props (React conditional props) mean absent, never a crash', async () => {
    const el = await mount({
      props: {
        label: null as unknown as string,
        error: null as unknown as string,
      },
    });
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('label')).toBeNull();
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(control(el).getAttribute('aria-invalid')).toBeNull();
    expect(control(el).getAttribute('aria-labelledby')).toBeNull();
  });

  it('skips value-change while composing (IME) and emits the committed input afterwards', async () => {
    const el = await mount({ attributes: { label: 'ФИО' } });
    const values = collectValues(el);
    const input = control(el);

    // Mid-composition: provisional text, no emission, no state commit.
    input.value = 'ото';
    const composing = new InputEvent('input', { bubbles: true, composed: true });
    Object.defineProperty(composing, 'isComposing', { value: true });
    input.dispatchEvent(composing);
    expect(values).toEqual([]);
    expect(el.value).toBeUndefined();
    expect(control(el).value).toBe('ото');

    // The input event following compositionend carries isComposing=false.
    input.value = 'ответ';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    expect(values).toEqual(['ответ']);
  });

  it('clamps non-string value channel inputs to their string form (raw non-strings never stored)', async () => {
    const el = await mount();
    el.value = 123 as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('123');
    expect(control(el).value).toBe('123');

    el.value = {} as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('[object Object]');
    expect(control(el).value).toBe('[object Object]');

    // null still releases (seeded from the last controlled value).
    el.value = null as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBeNull();
    expect(control(el).value).toBe('[object Object]');
  });

  // --- sr-only label mode (story 10.1) ---------------------------------------

  it('sr-only + label: the SAME label element keeps id/for and its chain position — only the class flips', async () => {
    const el = await mount({ attributes: { label: 'Телефон', placeholder: '+7 900' }, props: { srOnly: true } });
    const input = control(el);
    const label = el.shadowRoot?.querySelector('label');
    expect(label, 'the label element still renders (clipped paint, real node)').not.toBeNull();
    expect(label?.classList.contains('label--sr-only')).toBe(true);
    // The wiring is IDENTICAL to the visible mode: id, for, chain position.
    expect(label?.getAttribute('id')).toBe(`${input.id}-label`);
    expect(label?.getAttribute('for')).toBe(input.id);
    expect(label?.textContent).toContain('Телефон');
    const order = (input.getAttribute('aria-labelledby') ?? '').split(/\s+/);
    expect(order[0]).toBe(label?.getAttribute('id'));
    // The prop reflects as the sr-only attribute (CONVENTIONS §2).
    expect(el.hasAttribute('sr-only')).toBe(true);

    // Toggling off restores the plain class — no remnant.
    el.srOnly = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('label')?.classList.contains('label--sr-only')).toBe(false);
    expect(el.hasAttribute('sr-only')).toBe(false);
  });

  it('sr-only pin: the 1px-clip utility neutralizes the label rhythm — margin -1px sourced AFTER .label', () => {
    const cssText = inputStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const utility = cssText.match(/^ {2}\.label--sr-only\s*\{([^}]*)\}/m)?.[1] ?? '';
    expect(utility, 'the .label--sr-only rule exists').not.toBe('');
    expect(utility).toMatch(/position:\s*absolute/);
    expect(utility).toMatch(/width:\s*1px/);
    expect(utility).toMatch(/height:\s*1px/);
    expect(utility).toMatch(/margin:\s*-1px/);
    expect(utility).toMatch(/overflow:\s*hidden/);
    expect(utility).toMatch(/clip:\s*rect\(0 0 0 0\)/);
    expect(utility).toMatch(/clip-path:\s*inset\(50%\)/);
    // ORDER: the utility must come after .label so margin -1px wins over the
    // visible label's `margin: 0 0 var(--tk-space-8)` (no rhythm remnant)…
    expect(cssText.indexOf('.label {')).toBeLessThan(cssText.indexOf('.label--sr-only'));
    // …and display is never none, so the name computation is untouched.
    expect(utility).not.toMatch(/display:\s*none/);
  });

  it('sr-only without label: documented no-op — no label node, the placeholder names the field', async () => {
    const el = await mount({ attributes: { placeholder: 'Электронная почта' }, props: { srOnly: true } });
    expect(el.shadowRoot?.querySelector('label')).toBeNull();
    expect(el.shadowRoot?.querySelector('.label--sr-only')).toBeNull();
    expect(control(el).getAttribute('aria-labelledby')).toBeNull();
    expect(control(el).getAttribute('placeholder')).toBe('Электронная почта');
  });

  it('sr-only + badge: the badge is an independent surface — visible and SECOND in the name chain', async () => {
    const el = await mount({
      attributes: { label: 'Телефон' },
      props: { srOnly: true },
      badge: '+30%',
    });
    await elementUpdated(el);
    const clipped = el.shadowRoot?.querySelectorAll('.label--sr-only') ?? [];
    expect(clipped.length, 'exactly ONE node carries the utility — the label').toBe(1);
    const badge = el.shadowRoot?.querySelector('.field__badge');
    expect(badge, 'the badge wrapper stays a rendered surface').not.toBeNull();
    expect(badge?.classList.contains('label--sr-only')).toBe(false);
    const order = (control(el).getAttribute('aria-labelledby') ?? '').split(/\s+/);
    expect(order).toHaveLength(2);
    expect(order[0]).toBe(el.shadowRoot?.querySelector('label')?.getAttribute('id'));
    expect(order[1].endsWith('-badge')).toBe(true);
  });

  it('DOM identity: without sr-only the host carries no attribute and the label class list is exactly the pre-10.1 shape', async () => {
    const el = await mount({ attributes: { label: 'ФИО', required: '' } });
    expect(el.hasAttribute('sr-only')).toBe(false);
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.getAttribute('class')).toBe('label');
  });
});
