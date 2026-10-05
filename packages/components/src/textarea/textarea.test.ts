// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkTextarea } from './textarea.js';
import { textareaStyles } from './textarea.css.js';

/**
 * tk-textarea unit tests (spec 24T.1): the frozen family contract —
 * uncontrolled typing, controlled strictness (emits, never mutates),
 * controlled release seeding, defaultValue ignored after connect,
 * required+blur validation against the LIVE text, consumer error
 * override/clear, disabled inertness, IME skip — plus the grounded
 * geometry pins (rows=1, resize none, the two growth hooks, body-s
 * typography) and the aria wiring.
 *
 * The real autosize (scrollHeight re-measure) is a BROWSER layout
 * behavior invisible to happy-dom (scrollHeight reports 0 — the mechanism
 * collapses to the min-height floor); it is pinned in the Chromium
 * functional suite (tests/visual/textarea.spec.ts), the input-code.spec.ts
 * mold.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkTextarea): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: Lit dev-mode may warn on attribute misses. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkTextarea>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkTextarea> => {
  const el = new TkTextarea();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const control = (el: TkTextarea): HTMLTextAreaElement => {
  const field = el.shadowRoot?.querySelector('textarea');
  expect(field, 'inner native <textarea> renders').toBeInstanceOf(HTMLTextAreaElement);
  return field as HTMLTextAreaElement;
};

/** Simulate typing: set the live text and run the input pipeline. */
const type = (el: TkTextarea, text: string): void => {
  control(el).value = text;
  control(el).dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

/** Capture value-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkTextarea): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: string }>;
    values.push(custom.detail.value);
  });
  return values;
};

const blur = (el: TkTextarea): void => {
  control(el).dispatchEvent(new Event('blur'));
};

describe('tk-textarea', () => {
  it('registers as tk-textarea exposing TkTextarea', async () => {
    await customElements.whenDefined('tk-textarea');
    expect(customElements.get('tk-textarea')).toBe(TkTextarea);
  });

  it('renders a native one-row textarea with the grounded geometry registers', async () => {
    const el = await mount();
    const field = control(el);
    expect(field.getAttribute('rows')).toBe('1');
    expect(field.getAttribute('maxlength')).toBeNull();
    // CSS pins (comments stripped first — the AD-3 lesson).
    const sheet = textareaStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(sheet).toContain('resize: none');
    expect(sheet).toContain('var(--tk-textarea-min-height, 32px)');
    expect(sheet).toContain('var(--tk-textarea-max-height, 112px)');
    expect(sheet).toContain('overflow-y: auto');
    // The grounded compact register: body-s typography, NOT the single-line
    // field's body-l.
    expect(sheet).toContain('font-size: var(--tk-text-body-s-size)');
    expect(sheet).not.toContain('font-size: var(--tk-text-body-l-size)');
    // No badge slot markup in the family-minimalism ruling.
    expect(el.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('passes maxlength through to the native soft limit (absent = unlimited)', async () => {
    const limited = await mount({ props: { maxlength: 1000 } });
    expect(control(limited).getAttribute('maxlength')).toBe('1000');
    const free = await mount();
    expect(control(free).getAttribute('maxlength')).toBeNull();
  });

  it('uncontrolled typing updates the state and emits §9-style value-change', async () => {
    const el = await mount({ props: { placeholder: 'Добавьте заметку' } });
    const values = collectValues(el);
    type(el, 'первая строка\nвторая');
    await elementUpdated(el);
    expect(values).toEqual(['первая строка\nвторая']);
    // The value in force rides the control's text (the visual half).
    expect(control(el).value).toBe('первая строка\nвторая');
  });

  it('is silent on the first render (§9): no value-change before any edit', async () => {
    const el = await mount({ props: { defaultValue: 'заметка' } });
    const values = collectValues(el);
    // Re-render without edits still emits nothing.
    el.label = 'Заметка';
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(control(el).value).toBe('заметка');
  });

  it('controlled mode is STRICT: typing emits and applies nothing locally', async () => {
    const el = await mount({ props: { value: 'исходный текст' } });
    const values = collectValues(el);
    type(el, 'пользователь печатает');
    await elementUpdated(el);
    expect(values).toEqual(['пользователь печатает']);
    // Caret sanity: the control keeps its LIVE text until the element runs
    // its NEXT update — only then does it re-sync to the controlled value.
    expect(control(el).value).toBe('пользователь печатает');
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).value).toBe('исходный текст');
  });

  it('controlled release seeds uncontrolled from the last controlled value', async () => {
    const el = await mount({ props: { value: 'контроль' } });
    type(el, 'ввод');
    el.value = undefined;
    await elementUpdated(el);
    expect(control(el).value).toBe('контроль');
    type(el, 'новый ввод');
    await elementUpdated(el);
    expect(control(el).value).toBe('новый ввод');
  });

  it('non-string controlled values clamp to their string form', async () => {
    const el = await mount();
    // React conditional props and loose consumers hand over numbers.
    (el as unknown as { value: number }).value = 42;
    await elementUpdated(el);
    expect(el.value).toBe('42');
    expect(control(el).value).toBe('42');
  });

  it('defaultValue is ignored after the first update (initial-value semantics)', async () => {
    const el = await mount({ props: { defaultValue: 'начальное' } });
    el.defaultValue = 'позднее';
    await elementUpdated(el);
    expect(control(el).value).toBe('начальное');
  });

  it('required + blur shows the internal error; whitespace-only counts as empty', async () => {
    const el = await mount({ props: { required: true, label: 'Заметка' } });
    blur(el);
    await elementUpdated(el);
    const error = el.shadowRoot?.querySelector('.error');
    expect(error?.textContent).toContain('Обязательное поле');
    expect(control(el).getAttribute('aria-invalid')).toBe('true');
    expect(control(el).getAttribute('aria-describedby')).toBeTruthy();
    // Typing real content and blurring clears it.
    type(el, 'текст');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(control(el).getAttribute('aria-invalid')).toBeNull();
    // Whitespace-only still counts as empty.
    type(el, '   ');
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeTruthy();
  });

  it('turning required off clears a shown internal error', async () => {
    const el = await mount({ props: { required: true } });
    blur(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeTruthy();
    el.required = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
  });

  it('consumer error overrides the internal one and clears with the prop', async () => {
    const el = await mount({ props: { required: true, error: 'Слишком длинная заметка' } });
    const error = el.shadowRoot?.querySelector('.error');
    expect(error?.textContent).toContain('Слишком длинная заметка');
    el.error = '';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
  });

  it('disabled is inert: typing and blur emit/change nothing', async () => {
    const el = await mount({ props: { disabled: true, required: true } });
    const values = collectValues(el);
    type(el, 'попытка ввода');
    blur(el);
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(control(el).getAttribute('aria-disabled')).toBe('true');
    expect(control(el).hasAttribute('readonly')).toBe(true);
  });

  it('IME composition input never commits', async () => {
    const el = await mount();
    const values = collectValues(el);
    const composing = new InputEvent('input', { bubbles: true, composed: true });
    Object.defineProperty(composing, 'isComposing', { value: true });
    control(el).value = 'провизионный';
    control(el).dispatchEvent(composing);
    await elementUpdated(el);
    expect(values).toEqual([]);
  });

  it('wires the native label association and the sr-only label mode', async () => {
    const el = await mount({ props: { label: 'Заметка о инструменте', required: true } });
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.getAttribute('for')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(control(el).id);
    expect(label?.getAttribute('class')).toBe('label');
    expect(control(el).getAttribute('aria-required')).toBe('true');
    el.srOnly = true;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('label')?.getAttribute('class')).toBe('label label--sr-only');
  });
});
