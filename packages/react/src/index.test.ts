// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { Button, Checkbox, EVENT_MAP, Input, SegmentedRadio, Select, ThumbnailPicker } from './index.js';

/**
 * pillkit-react generated surface. The wrapper imports `pillkit-components`
 * (built dist — the packages run in topological order under `pnpm -r test`)
 * and the pinned `@lit/react`; React itself resolves via the workspace peer
 * (19.3.0). The smoke test EXECUTES the wrapper through react-dom — the
 * generated file is the whole public surface, so an object-shape check alone
 * would not catch a broken binding.
 *
 * The Input tests pin the React-surface contract FROZEN at Story 2.1
 * (CONVENTIONS §9): the registry's first entry (`value-change` →
 * `onValueChange`), handlers receiving the UNWRAPPED value, and the standard
 * controlled `value` mapping with NO wrapper-side clamping.
 */

// React 19 act() environment flag (test-utils lives on 'react' now).
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const roots: Root[] = [];
afterAll(() => {
  for (const root of roots) {
    act(() => root.unmount());
  }
});

const renderToContainer = async (element: React.ReactElement): Promise<HTMLElement> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  await act(() => {
    root.render(element);
  });
  return container;
};

/** Simulate typing on the tk-input shadow control (live text + input event). */
const typeInto = (el: Element, text: string): void => {
  const control = el.shadowRoot?.querySelector('input');
  if (!control) throw new Error('tk-input: no inner <input> found');
  control.value = text;
  control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

describe('pillkit-react', () => {
  it('generates a Button wrapper for tk-button from the manifest', () => {
    // createComponent returns a React ForwardRefExoticComponent — an object
    // with the React forward_ref tag and a render function.
    expect(Button).toBeTypeOf('object');
    expect(Button.$$typeof).toBeDefined();
    expect((Button as { render?: unknown }).render).toBeTypeOf('function');
  });

  it('renders <Button> as a themed tk-button with props and children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Button, { variant: 'secondary' }, 'Label'),
    );
    const el = container.querySelector('tk-button');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    // React 19 sets unknown props as attributes on custom elements — the
    // reflected attribute round-trips the variant.
    expect(el?.getAttribute('variant')).toBe('secondary');
    // Children project into the default slot (the label).
    expect(el?.textContent).toBe('Label');
  });

  it('resolves the pinned @lit/react dependency', () => {
    expect(typeof litReact.createComponent).toBe('function');
  });

  it('ships the owned event registry — tk-button has NO entry at v1', () => {
    // Membership assertion, not deep-equality: the registry grows when new
    // components land; only tk-button's absence is this component's contract.
    expect(EVENT_MAP['tk-button']).toBeUndefined();
  });

  it('freezes the event registry at runtime (file edits, never mutation)', () => {
    expect(Object.isFrozen(EVENT_MAP)).toBe(true);
    expect(() => {
      (EVENT_MAP as Record<string, unknown>)['tk-foo'] = {};
    }).toThrow(TypeError);
  });

  // --- The frozen React-surface contract (Story 2.1, CONVENTIONS §9) --------

  it("carries the first registry entry: tk-input's value-change → onValueChange", () => {
    expect(EVENT_MAP['tk-input']).toEqual({ onValueChange: 'value-change' });
  });

  it('renders <Input> as tk-input with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(Input, { label: 'ФИО', placeholder: 'Иван' }),
    );
    const el = container.querySelector('tk-input');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    // Lit properties (not attributes) receive the props via @lit/react.
    expect((el as unknown as { label?: string }).label).toBe('ФИО');
    expect((el as unknown as { placeholder?: string }).placeholder).toBe('Иван');
    expect(el?.shadowRoot?.querySelector('input')).not.toBeNull();
  });

  it('onValueChange receives the UNWRAPPED string — never the CustomEvent (AD-1)', async () => {
    const handler = vi.fn();
    const container = await renderToContainer(
      React.createElement(Input, { label: 'ФИО', onValueChange: handler }),
    );
    const el = container.querySelector('tk-input');
    expect(el).not.toBeNull();

    // Direct dispatch: detail { value } in, bare string out.
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'abc' }, composed: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]?.[0];
    expect(payload).toBe('abc');
    expect(typeof payload).toBe('string');

    // Real typing path: same unwrap through the element's own event.
    handler.mockClear();
    typeInto(el as Element, 'абв');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBe('абв');
  });

  it('controlled mode: standard value mapping, wrapper adds no clamping (strictness is the element\'s)', async () => {
    let state = 'a';
    const container = await renderToContainer(
      React.createElement(Input, {
        value: state,
        onValueChange: (value: unknown) => {
          // A consumer doing setState — the handler already got the unwrapped
          // string (asserted here, not re-unwrapped).
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-input') as (Element & { value?: string }) | null;
    expect(el?.value).toBe('a');

    // Typing: the event fires with the new text; the element's channel keeps
    // the consumer value (strict) — the wrapper itself clamps nothing.
    typeInto(el as Element, 'ab');
    expect(state).toBe('ab');
    expect(el?.value).toBe('a');

    // The consumer's render answers: value flows back and the element
    // re-renders exactly it.
    await act(() => {
      root.render(
        React.createElement(Input, {
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('ab');
    const control = (el as Element).shadowRoot?.querySelector('input');
    expect(control?.value).toBe('ab');

    // Removing the value prop releases the element (frozen §4 semantics)
    // — the wrapper passes undefined through with no opinion of its own.
    await act(() => {
      root.render(React.createElement(Input, { label: 'ФИО' }));
    });
    expect(el?.value).toBeUndefined();
    // Seeded from the last controlled value.
    expect((el as Element).shadowRoot?.querySelector('input')?.value).toBe('ab');
  });

  // --- Story 2.3: tk-select wrapper (mirrors the Input smoke) ----------------

  it("carries the story 2.3 registry entry: tk-select's value-change/open-change", () => {
    expect(EVENT_MAP['tk-select']).toEqual({
      onValueChange: 'value-change',
      onOpenChange: 'open-change',
    });
  });

  it('renders <Select> as tk-select with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(Select, {
        label: 'Кэшбэк',
        placeholder: 'Выберите категорию',
        options: [
          { value: 'all', label: '1% Все покупки' },
          { value: 'taxi', label: '5% Такси' },
        ],
      }),
    );
    const el = container.querySelector('tk-select');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Кэшбэк');
    expect((el as unknown as { options?: unknown[] }).options).toHaveLength(2);
    expect(el?.shadowRoot?.querySelector('button')).not.toBeNull();
  });

  it('Select handlers receive unwrapped payloads (string value, boolean open)', async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const container = await renderToContainer(
      React.createElement(Select, { onValueChange, onOpenChange }),
    );
    const el = container.querySelector('tk-select');
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'taxi' }, composed: true, bubbles: true }),
    );
    el?.dispatchEvent(
      new CustomEvent('open-change', { detail: { value: true }, composed: true, bubbles: true }),
    );
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]?.[0]).toBe('taxi');
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
  });

  it('Select controlled mode: standard value mapping, wrapper adds no clamping (mirrors Input)', async () => {
    const OPTIONS = [
      { value: 'all', label: '1% Все покупки' },
      { value: 'taxi', label: '5% Такси' },
    ];
    let state = 'all';
    const container = await renderToContainer(
      React.createElement(Select, {
        options: OPTIONS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-select') as (Element & {
      value?: string;
      open?: boolean;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.value).toBe('all');

    // Open + select the second option through the element's own pipeline.
    await act(() => {
      (el as unknown as { open: boolean }).open = true;
    });
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const panelId = (el as Element).shadowRoot
      ?.querySelector('button')
      ?.getAttribute('aria-controls');
    const row = panelId
      ? (document.getElementById(panelId)?.querySelectorAll('[role="option"]')[1] as HTMLElement)
      : null;
    expect(row, 'the open menu renders its option rows').not.toBeNull();
    await act(() => {
      row?.click();
    });

    // Strict: the event fired, the element's channel keeps the consumer value.
    expect(state).toBe('taxi');
    expect(el?.value).toBe('all');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(
        React.createElement(Select, {
          options: OPTIONS,
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('taxi');

    // Removing the value prop releases the element (frozen §4 semantics).
    await act(() => {
      root.render(React.createElement(Select, { options: OPTIONS, label: 'Кэшбэк' }));
    });
    expect(el?.value).toBeUndefined();
    // Seeded from the last controlled value — display still shows «Такси».
    expect(
      (el as Element).shadowRoot?.querySelector('.field__value')?.textContent,
    ).toContain('Такси');
  });

  // --- Story 2.4: tk-checkbox wrapper (mirrors the Input/Select smoke) -------

  it("carries the story 2.4 registry entry: tk-checkbox's checked-change", () => {
    expect(EVENT_MAP['tk-checkbox']).toEqual({ onCheckedChange: 'checked-change' });
  });

  it('renders <Checkbox> as tk-checkbox with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(Checkbox, { label: 'Соглашаюсь получать рекламу' }),
    );
    const el = container.querySelector('tk-checkbox');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Соглашаюсь получать рекламу');
    const input = el?.shadowRoot?.querySelector('input');
    expect(input, 'the native checkbox surface renders').not.toBeNull();
    expect(input?.type).toBe('checkbox');
  });

  it('onCheckedChange receives the UNWRAPPED boolean — never the CustomEvent (AD-1)', async () => {
    const handler = vi.fn();
    const container = await renderToContainer(
      React.createElement(Checkbox, { onCheckedChange: handler }),
    );
    const el = container.querySelector('tk-checkbox');
    expect(el).not.toBeNull();

    // Direct dispatch: detail { value } in, bare boolean out.
    el?.dispatchEvent(
      new CustomEvent('checked-change', { detail: { value: true }, composed: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]?.[0];
    expect(payload).toBe(true);
    expect(typeof payload).toBe('boolean');

    // Real toggle path: same unwrap through the element's own pipeline.
    handler.mockClear();
    const control = el?.shadowRoot?.querySelector('input');
    control!.checked = true;
    control!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBe(true);
  });

  it('Checkbox controlled mode: standard checked mapping, wrapper adds no clamping (boolean channel)', async () => {
    let state = false;
    const container = await renderToContainer(
      React.createElement(Checkbox, {
        checked: state,
        onCheckedChange: (value: unknown) => {
          expect(typeof value).toBe('boolean');
          state = value as boolean;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-checkbox') as (Element & {
      checked?: boolean;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.checked).toBe(false);

    // Toggle: the event fires with the new state; the element's channel keeps
    // the consumer value (strict) — the wrapper itself clamps nothing.
    const control = el?.shadowRoot?.querySelector('input');
    control!.checked = true;
    control!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(state).toBe(true);
    expect(el?.checked).toBe(false);

    // The consumer's render answers: checked flows back.
    await act(() => {
      root.render(
        React.createElement(Checkbox, {
          checked: state,
          onCheckedChange: (value: unknown) => {
            state = value as boolean;
          },
        }),
      );
    });
    expect(el?.checked).toBe(true);
    expect(el?.shadowRoot?.querySelector('input')?.checked).toBe(true);

    // Removing the checked prop releases the element (frozen §4 semantics)
    // — seeded from the last controlled value.
    await act(() => {
      root.render(React.createElement(Checkbox, { label: 'Согласен' }));
    });
    expect(el?.checked).toBeUndefined();
    expect(el?.shadowRoot?.querySelector('input')?.checked).toBe(true);
  });

  // --- Story 2.5: tk-segmented-radio wrapper (mirrors the Input/Select smoke) --

  it("carries the story 2.5 registry entry: tk-segmented-radio's value-change", () => {
    expect(EVENT_MAP['tk-segmented-radio']).toEqual({ onValueChange: 'value-change' });
  });

  it('renders <SegmentedRadio> as tk-segmented-radio with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(SegmentedRadio, {
        label: 'Гражданство РФ?',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' },
        ],
      }),
    );
    const el = container.querySelector('tk-segmented-radio');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Гражданство РФ?');
    expect((el as unknown as { options?: unknown[] }).options).toHaveLength(2);
    const radios = (el as Element).shadowRoot?.querySelectorAll('input[type="radio"]');
    expect(radios, 'the native radio group renders').toHaveLength(2);
    expect((el as Element).shadowRoot?.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it('onValueChange receives the UNWRAPPED string — never the CustomEvent (AD-1)', async () => {
    const handler = vi.fn();
    const container = await renderToContainer(
      React.createElement(SegmentedRadio, {
        onValueChange: handler,
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' },
        ],
      }),
    );
    const el = container.querySelector('tk-segmented-radio');
    expect(el).not.toBeNull();

    // Direct dispatch: detail { value } in, bare string out.
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'no' }, composed: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]?.[0];
    expect(payload).toBe('no');
    expect(typeof payload).toBe('string');

    // Real selection path: same unwrap through the element's own pipeline
    // (the change event the UA fires after a label-click/Space selection).
    handler.mockClear();
    const radios = (el as Element).shadowRoot?.querySelectorAll('input');
    const second = radios?.[1] as HTMLInputElement | undefined;
    second!.checked = true;
    second!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBe('no');
  });

  it('SegmentedRadio controlled mode: standard value mapping, wrapper adds no clamping (string channel)', async () => {
    const OPTIONS = [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' },
    ];
    let state = 'yes';
    const container = await renderToContainer(
      React.createElement(SegmentedRadio, {
        options: OPTIONS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-segmented-radio') as (Element & {
      value?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.value).toBe('yes');

    // Select the second option through the element's own pipeline.
    const radios = (el as Element).shadowRoot?.querySelectorAll('input');
    const second = radios?.[1] as HTMLInputElement | undefined;
    await act(() => {
      second!.checked = true;
      second!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });

    // Strict: the event fired, the element's channel keeps the consumer value.
    expect(state).toBe('no');
    expect(el?.value).toBe('yes');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(
        React.createElement(SegmentedRadio, {
          options: OPTIONS,
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('no');
    const checked = [...((el as Element).shadowRoot?.querySelectorAll('input') ?? [])].find(
      (input) => input.checked,
    );
    expect(checked?.value).toBe('no');

    // Removing the value prop releases the element (frozen §4 semantics)
    // — seeded from the last controlled value.
    await act(() => {
      root.render(React.createElement(SegmentedRadio, { options: OPTIONS, label: 'Гражданство РФ?' }));
    });
    expect(el?.value).toBeUndefined();
    const seeded = [...((el as Element).shadowRoot?.querySelectorAll('input') ?? [])].find(
      (input) => input.checked,
    );
    expect(seeded?.value).toBe('no');
  });

  it('forwards refs through the HOC to the underlying elements (every wrapper is a forwardRef HOC)', async () => {
    const inputRef = React.createRef<HTMLElement>();
    const buttonRef = React.createRef<HTMLElement>();
    await renderToContainer(React.createElement(Input, { label: 'ФИО', ref: inputRef }));
    await renderToContainer(React.createElement(Button, { ref: buttonRef }));
    // The ref lands on the CUSTOM ELEMENT itself — the HOC layer must stay
    // transparent for imperative access (focus, internals, measurements).
    expect(inputRef.current).toBeInstanceOf(HTMLElement);
    expect(inputRef.current?.tagName).toBe('TK-INPUT');
    expect(buttonRef.current).toBeInstanceOf(HTMLElement);
    expect(buttonRef.current?.tagName).toBe('TK-BUTTON');
  });
});
  // --- Story 2.6: tk-thumbnail-picker wrapper (mirrors the Input/Select smoke) --

  it("carries the story 2.6 registry entry: tk-thumbnail-picker's value-change", () => {
    expect(EVENT_MAP['tk-thumbnail-picker']).toEqual({ onValueChange: 'value-change' });
  });

  it('renders <ThumbnailPicker> as tk-thumbnail-picker with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(ThumbnailPicker, {
        label: 'Выберите дизайн карты',
        defaultValue: 'black',
        options: [
          { value: 'black', label: 'Чёрная' },
          { value: 'blue', label: 'Синяя' },
        ],
      }),
    );
    const el = container.querySelector('tk-thumbnail-picker');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Выберите дизайн карты');
    expect((el as unknown as { options?: unknown[] }).options).toHaveLength(2);
    const radios = (el as Element).shadowRoot?.querySelectorAll('input[type="radio"]');
    expect(radios, 'the native radio group renders').toHaveLength(2);
    expect((el as Element).shadowRoot?.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it('ThumbnailPicker handlers receive the UNWRAPPED string — never the CustomEvent (AD-1)', async () => {
    const handler = vi.fn();
    const container = await renderToContainer(
      React.createElement(ThumbnailPicker, {
        onValueChange: handler,
        options: [
          { value: 'black', label: 'Чёрная' },
          { value: 'blue', label: 'Синяя' },
        ],
      }),
    );
    const el = container.querySelector('tk-thumbnail-picker');
    expect(el).not.toBeNull();

    // Direct dispatch: detail { value } in, bare string out.
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'blue' }, composed: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]?.[0];
    expect(payload).toBe('blue');
    expect(typeof payload).toBe('string');

    // Real selection path: same unwrap through the element's own pipeline
    // (the change event the UA fires after a tile-click/Space selection).
    handler.mockClear();
    const radios = (el as Element).shadowRoot?.querySelectorAll('input');
    const second = radios?.[1] as HTMLInputElement | undefined;
    second!.checked = true;
    second!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBe('blue');
  });

  it('ThumbnailPicker controlled mode: standard value mapping, wrapper adds no clamping (string channel)', async () => {
    const OPTIONS = [
      { value: 'black', label: 'Чёрная' },
      { value: 'blue', label: 'Синяя' },
    ];
    let state = 'black';
    const container = await renderToContainer(
      React.createElement(ThumbnailPicker, {
        options: OPTIONS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-thumbnail-picker') as (Element & {
      value?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.value).toBe('black');

    // Select the second tile through the element's own pipeline.
    const radios = (el as Element).shadowRoot?.querySelectorAll('input');
    const second = radios?.[1] as HTMLInputElement | undefined;
    await act(() => {
      second!.checked = true;
      second!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });

    // Strict: the event fired, the element's channel keeps the consumer value.
    expect(state).toBe('blue');
    expect(el?.value).toBe('black');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(
        React.createElement(ThumbnailPicker, {
          options: OPTIONS,
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('blue');
    const checked = [...((el as Element).shadowRoot?.querySelectorAll('input') ?? [])].find(
      (input) => input.checked,
    );
    expect(checked?.value).toBe('blue');

    // Removing the value prop releases the element (frozen §4 semantics)
    // — seeded from the last controlled value.
    await act(() => {
      root.render(
        React.createElement(ThumbnailPicker, { options: OPTIONS, label: 'Выберите дизайн карты' }),
      );
    });
    expect(el?.value).toBeUndefined();
    const seeded = [...((el as Element).shadowRoot?.querySelectorAll('input') ?? [])].find(
      (input) => input.checked,
    );
    expect(seeded?.value).toBe('blue');
  });
