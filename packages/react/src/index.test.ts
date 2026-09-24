// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { ArticleCard, Badge, Button, Checkbox, ComboboxSearch, EVENT_MAP, FeatureCard, FilterChips, Footer, Input, Link, Modal, Navbar, Pagination, ProgressBar, PromoCard, SegmentedRadio, Select, ServiceCard, Tabs, ThumbnailPicker, Toast, Tooltip } from './index.js';

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
  // --- Story 2.7: tk-progress-bar wrapper (stateless display — no events) --

  it('ships NO registry entry for tk-progress-bar (stateless display, nothing dispatches)', () => {
    // Spec 2.7: value is an input, not a channel — the element dispatches
    // nothing, so the completeness guard demands NO event-map entry (the
    // tk-button no-entry precedent).
    expect(EVENT_MAP['tk-progress-bar']).toBeUndefined();
  });

  it('renders <ProgressBar> as tk-progress-bar with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(ProgressBar, { label: 'Уже заполнено', value: 30, min: 0, max: 100 }),
    );
    const el = container.querySelector('tk-progress-bar') as (Element & {
      label?: string;
      value?: number;
      min?: number;
      max?: number;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.label).toBe('Уже заполнено');
    expect(el?.value).toBe(30);
    expect(el?.min).toBe(0);
    expect(el?.max).toBe(100);
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // Prop reflection into the shadow surface: the track carries the aria
    // wiring of the rendered value.
    const track = (el as Element).shadowRoot?.querySelector('.track');
    expect(track?.getAttribute('role')).toBe('progressbar');
    expect(track?.getAttribute('aria-valuenow')).toBe('30');
    expect(track?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('ProgressBar booleans reach the element as reflected attributes (indeterminate/announce)', async () => {
    const container = await renderToContainer(
      React.createElement(ProgressBar, { indeterminate: true, label: 'Загрузка' }),
    );
    const el = container.querySelector('tk-progress-bar');
    expect(el?.hasAttribute('indeterminate')).toBe(true);
    // announce stays off unless asked — narration is opt-in.
    expect(el?.hasAttribute('announce')).toBe(false);
  });

  // --- Story 3.1/3.2: tk-link / tk-badge wrappers (stateless — no events) --

  it('ships NO registry entries for tk-link/tk-badge (stateless, nothing dispatches)', () => {
    // Specs 3.1/3.2: navigation is the native anchor's own behavior and the
    // badge is never interactive alone — neither dispatches, so the
    // completeness guard demands NO event-map entry (the tk-button
    // no-entry precedent).
    expect(EVENT_MAP['tk-link']).toBeUndefined();
    expect(EVENT_MAP['tk-badge']).toBeUndefined();
  });

  it('renders <Link> as tk-link with element properties and pass-through attrs (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Link, { variant: 'legal', href: '/legal', target: '_blank' }, 'Политика'),
    );
    const el = container.querySelector('tk-link');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { variant?: string }).variant).toBe('legal');
    expect((el as unknown as { href?: string }).href).toBe('/legal');
    expect((el as unknown as { target?: string }).target).toBe('_blank');
    // Children project into the default slot; the shadow anchor carries the
    // pass-through surface.
    expect(el?.textContent).toBe('Политика');
    const anchor = el?.shadowRoot?.querySelector('a.link');
    expect(anchor?.getAttribute('href')).toBe('/legal');
    expect(anchor?.getAttribute('target')).toBe('_blank');
  });

  it('renders <Badge> as tk-badge with count/variant through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Badge, { variant: 'stat', count: 250 }),
    );
    const el = container.querySelector('tk-badge') as (Element & {
      variant?: string;
      count?: number;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.variant).toBe('stat');
    expect(el?.count).toBe(250);
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // Count mode: the cap renders, the number data never reflects.
    expect(el?.shadowRoot?.querySelector('.badge__count')?.textContent).toBe('99+');
    expect(el?.hasAttribute('count')).toBe(false);
    // Never interactive: no tabindex/role anywhere in the shadow surface.
    expect(el?.shadowRoot?.querySelector('[tabindex], [role]')).toBeNull();
  });

  // --- Story 3.3: tk-tabs wrapper (mirrors the SegmentedRadio smoke) --------

  it("carries the story 3.3 registry entry: tk-tabs's value-change", () => {
    expect(EVENT_MAP['tk-tabs']).toEqual({ onValueChange: 'value-change' });
  });

  it('renders <Tabs> as tk-tabs with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(
        Tabs,
        {
          defaultValue: 'debit',
          tabs: [
            { value: 'debit', label: 'Дебетовая карта' },
            { value: 'credit', label: 'Кредитная карта', badge: 5 },
            { value: 'deposit', label: 'Вклад' },
          ],
        },
        React.createElement('div', { slot: 'tab-0' }, 'Дебетовая'),
        React.createElement('div', { slot: 'tab-1' }, 'Кредитная'),
        React.createElement('div', { slot: 'tab-2' }, 'Вклад'),
      ),
    );
    const el = container.querySelector('tk-tabs');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { defaultValue?: string }).defaultValue).toBe('debit');
    expect((el as unknown as { tabs?: unknown[] }).tabs).toHaveLength(3);
    const tabButtons = (el as Element).shadowRoot?.querySelectorAll('[role="tab"]');
    expect(tabButtons, 'the tab bar renders').toHaveLength(3);
    expect((el as Element).shadowRoot?.querySelector('[role="tablist"]')).not.toBeNull();
    // The badge composition rides along (nested tk-badge inside tab 2).
    expect((el as Element).shadowRoot?.querySelector('[role="tab"] tk-badge')).not.toBeNull();
    // Panel projection: the per-index named slots carry the children.
    const panel0 = (el as Element).shadowRoot?.querySelector('[role="tabpanel"]');
    expect(panel0?.querySelector('slot')?.getAttribute('name')).toBe('tab-0');
    expect(el?.querySelector('[slot="tab-0"]')?.textContent).toBe('Дебетовая');
  });

  it('Tabs handlers receive the UNWRAPPED string — never the CustomEvent (AD-1)', async () => {
    const handler = vi.fn();
    const container = await renderToContainer(
      React.createElement(Tabs, {
        onValueChange: handler,
        tabs: [
          { value: 'debit', label: 'Дебетовая карта' },
          { value: 'credit', label: 'Кредитная карта' },
        ],
      }),
    );
    const el = container.querySelector('tk-tabs');
    expect(el).not.toBeNull();

    // Direct dispatch: detail { value } in, bare string out.
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'credit' }, composed: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]?.[0];
    expect(payload).toBe('credit');
    expect(typeof payload).toBe('string');

    // Real selection path: same unwrap through the element's own pipeline
    // (the click the UA fires on the shadow tab button).
    handler.mockClear();
    const buttons = (el as Element).shadowRoot?.querySelectorAll('[role="tab"]');
    await act(() => {
      (buttons?.[1] as HTMLButtonElement | undefined)?.click();
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBe('credit');
  });

  it('Tabs controlled mode: standard value mapping, wrapper adds no clamping (string channel)', async () => {
    const TABS = [
      { value: 'debit', label: 'Дебетовая карта' },
      { value: 'credit', label: 'Кредитная карта' },
    ];
    let state = 'debit';
    const container = await renderToContainer(
      React.createElement(Tabs, {
        tabs: TABS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-tabs') as (Element & {
      value?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.value).toBe('debit');

    // Select the second tab through the element's own pipeline.
    const buttons = (el as Element).shadowRoot?.querySelectorAll('[role="tab"]');
    await act(() => {
      (buttons?.[1] as HTMLButtonElement | undefined)?.click();
    });

    // Strict: the event fired, the element's channel keeps the consumer value.
    expect(state).toBe('credit');
    expect(el?.value).toBe('debit');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(
        React.createElement(Tabs, {
          tabs: TABS,
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('credit');
    const selected = [...((el as Element).shadowRoot?.querySelectorAll('[role="tab"]') ?? [])].find(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
    expect(selected?.textContent).toContain('Кредитная карта');

    // Removing the value prop releases the element (frozen §4 semantics)
    // — seeded from the last controlled value.
    await act(() => {
      root.render(React.createElement(Tabs, { tabs: TABS }));
    });
    expect(el?.value).toBeUndefined();
    const seeded = [...((el as Element).shadowRoot?.querySelectorAll('[role="tab"]') ?? [])].find(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
    expect(seeded?.textContent).toContain('Кредитная карта');
  });

  // --- Story 3.4/3.5: tk-navbar / tk-footer wrappers (no events) ------------

  it('ships NO registry entries for tk-navbar/tk-footer (navigation + stateless directory)', () => {
    // Spec 3.4 ruling: activeValue is a prop-only input (no change channel)
    // and the drawer is internal UI state (no open/open-change); spec 3.5:
    // the footer dispatches nothing. The completeness guard demands NO
    // event-map entries (the tk-button no-entry precedent).
    expect(EVENT_MAP['tk-navbar']).toBeUndefined();
    expect(EVENT_MAP['tk-footer']).toBeUndefined();
  });

  it('renders <Navbar> as tk-navbar with element properties and slot children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        Navbar,
        {
          activeValue: 'business',
          sticky: true,
          burgerLabel: 'Меню',
          links: [
            { value: 'retail', label: 'Частным лицам', href: '#retail' },
            { value: 'business', label: 'Бизнесу', href: '#business' },
          ],
        },
        React.createElement('span', { slot: 'logo' }, 'ЛОГО'),
      ),
    );
    const el = container.querySelector('tk-navbar') as (Element & {
      activeValue?: string;
      burgerLabel?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.activeValue).toBe('business');
    expect(el?.burgerLabel).toBe('Меню');
    expect(el?.hasAttribute('sticky'), 'boolean reflects').toBe(true);
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    const links = [...((el as Element).shadowRoot?.querySelectorAll('.links .link') ?? [])];
    expect(links).toHaveLength(2);
    expect(links[1]?.getAttribute('aria-current')).toBe('page');
    // Slot projection: the logo lands in the named slot.
    expect(el?.querySelector('[slot="logo"]')?.textContent).toBe('ЛОГО');
  });

  it('renders <Footer> as tk-footer with element properties and slot children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        Footer,
        {
          phone: '8 800 333-33-33',
          columns: [
            { title: 'Банк', links: [{ label: 'Кредиты', href: '#loans' }] },
            { title: 'Пусто', links: [] },
          ],
          quickLinks: [{ label: 'О банке', href: '#about' }],
        },
        React.createElement('p', null, '© 2026'),
      ),
    );
    const el = container.querySelector('tk-footer') as (Element & {
      phone?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.phone).toBe('8 800 333-33-33');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // The landmark renders; the empty column is omitted (the clamp row).
    expect(el?.shadowRoot?.querySelector('footer.footer')).not.toBeNull();
    expect(el?.shadowRoot?.querySelectorAll('.column')).toHaveLength(1);
    expect(el?.shadowRoot?.querySelectorAll('.pill')).toHaveLength(1);
    // The default slot carries the legal fine-print.
    expect(el?.querySelector('p')?.textContent).toBe('© 2026');
  });

  // --- Stories 3.6–3.9: the card family wrappers (display — no events) -----

  it('ships NO registry entries for the card family (passive display components)', () => {
    // Specs 3.6–3.9: the CTA/link carries the action as native elements in
    // slots; the cards dispatch nothing — the completeness guard demands NO
    // event-map entries (the tk-button/tk-footer no-entry precedent).
    expect(EVENT_MAP['tk-promo-card']).toBeUndefined();
    expect(EVENT_MAP['tk-feature-card']).toBeUndefined();
    expect(EVENT_MAP['tk-service-card']).toBeUndefined();
    expect(EVENT_MAP['tk-article-card']).toBeUndefined();
  });

  it('renders <PromoCard> as tk-promo-card with props, boolean reflection, and slot children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        PromoCard,
        { variant: 'mint', heading: 'ОСАГО', description: 'Страховка за 2 минуты' },
        React.createElement('div', { slot: 'art' }),
        React.createElement('button', { slot: 'actions' }, 'Подробнее'),
      ),
    );
    const el = container.querySelector('tk-promo-card') as (Element & {
      variant?: string;
      heading?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.variant).toBe('mint');
    expect(el?.getAttribute('variant'), 'enum reflects').toBe('mint');
    expect(el?.heading).toBe('ОСАГО');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el?.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('ОСАГО');
    expect(el?.shadowRoot?.querySelector('.card__actions slot')).not.toBeNull();
  });

  it('renders <FeatureCard> as tk-feature-card with the editorial variant (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        FeatureCard,
        { variant: 'editorial', heading: 'Платинум' },
        React.createElement('div', { slot: 'art' }),
      ),
    );
    const el = container.querySelector('tk-feature-card') as (Element & {
      variant?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.variant).toBe('editorial');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el?.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Платинум');
    // The art slot projects into the bleed column.
    expect(el?.shadowRoot?.querySelector('.card__art slot[name="art"]')).not.toBeNull();
  });

  it('renders <ServiceCard> as tk-service-card with the aria-hidden icon container (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        ServiceCard,
        { heading: 'Расчетный счет', description: 'Открытие за день' },
        React.createElement('span', { slot: 'icon' }),
        React.createElement('a', { slot: 'actions', href: '#rko' }, 'Подробнее'),
      ),
    );
    const el = container.querySelector('tk-service-card') as (Element & {
      heading?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.heading).toBe('Расчетный счет');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el?.shadowRoot?.querySelector('.card__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(el?.shadowRoot?.querySelector('.card__actions slot')).not.toBeNull();
  });

  it('renders <ArticleCard> as tk-article-card with the whole-card link (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(ArticleCard, {
        heading: 'Как устроен кэшбэк',
        description: 'Разбираем механику',
        href: '/article',
        linkLabel: 'Читать',
      }),
    );
    const el = container.querySelector('tk-article-card') as (Element & {
      href?: string;
      linkLabel?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.href).toBe('/article');
    expect(el?.linkLabel).toBe('Читать');
    expect(el?.hasAttribute('href'), 'string data never reflects').toBe(false);
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // ONE tab stop: the single focusable is the whole-card anchor.
    const focusables = el?.shadowRoot?.querySelectorAll('a, button, [tabindex]');
    expect(focusables).toHaveLength(1);
    const link = focusables?.[0] as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/article');
    expect(link.textContent?.trim()).toBe('Читать');
  });

  it('card skeletons reach the elements as reflected attributes', async () => {
    const container = await renderToContainer(
      React.createElement(PromoCard, { skeleton: true, heading: 'Загрузка' }),
    );
    const el = container.querySelector('tk-promo-card');
    expect(el?.hasAttribute('skeleton')).toBe(true);
    const container2 = await renderToContainer(
      React.createElement(ArticleCard, { skeleton: true }),
    );
    expect(container2.querySelector('tk-article-card')?.hasAttribute('skeleton')).toBe(true);
  });

  // --- Stories 4.1–4.3: the overlay trio (modal/tooltip open-change; toast none) --

  it("carries the 4.1/4.2 registry entries: tk-modal/tk-tooltip open-change", () => {
    expect(EVENT_MAP['tk-modal']).toEqual({ onOpenChange: 'open-change' });
    expect(EVENT_MAP['tk-tooltip']).toEqual({ onOpenChange: 'open-change' });
  });

  it('ships NO registry entry for tk-toast (fire-and-forget, nothing dispatches)', () => {
    // Spec 4.3 ruling: no open channel, no kit events — the slotted action
    // serves its own native click (the tk-button no-entry precedent);
    // showToast is built on the SAME element, never a parallel event surface.
    expect(EVENT_MAP['tk-toast']).toBeUndefined();
  });

  it('renders <Modal> as tk-modal with heading through the wrapper (smoke)', async () => {
    const onOpenChange = vi.fn();
    const container = await renderToContainer(
      React.createElement(
        Modal,
        { heading: 'Подтверждение', onOpenChange },
        React.createElement('p', null, 'Тело'),
        React.createElement('button', { slot: 'actions' }, 'ОК'),
      ),
    );
    const el = container.querySelector('tk-modal') as (Element & {
      heading?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.heading).toBe('Подтверждение');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // open-change unwraps to the bare boolean (AD-1).
    el?.dispatchEvent(
      new CustomEvent('open-change', { detail: { value: true }, composed: true, bubbles: true }),
    );
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
  });

  it('renders <Tooltip> as tk-tooltip with props and an unwrapped onOpenChange (smoke)', async () => {
    const onOpenChange = vi.fn();
    const container = await renderToContainer(
      React.createElement(
        Tooltip,
        { content: 'Подсказка', placement: 'bottom', onOpenChange },
        React.createElement('button', null, 'Триггер'),
      ),
    );
    const el = container.querySelector('tk-tooltip') as (Element & {
      content?: string;
      placement?: string;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.content).toBe('Подсказка');
    expect(el?.getAttribute('placement')).toBe('bottom'); // enum reflects
    // The trigger wires aria-describedby to the eager surface.
    const describedBy = el?.querySelector('button')?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(el?.shadowRoot?.getElementById(describedBy ?? '')?.getAttribute('role')).toBe('tooltip');
    el?.dispatchEvent(
      new CustomEvent('open-change', { detail: { value: false }, composed: true, bubbles: true }),
    );
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
  });

  it('renders <Toast> as tk-toast; the element self-enqueues from the wrapper too (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        Toast,
        { variant: 'destructive', duration: 0 },
        'Платёж не прошёл',
      ),
    );
    // The toast SELF-ENQUEUES on connect: it is no longer inside the React
    // container — it relocated into the shared bottom-right stack (query the
    // document, not the container). React consumers wanting fire-and-forget
    // notifications should prefer the imperative showToast helper (the §9
    // ruling) precisely because JSX-owned toasts relocate out of the tree —
    // noted in verify/toast/NOTES.md.
    const el = document.querySelector('#tk-toast-stack tk-toast') as (Element & {
      variant?: string;
      updateComplete?: Promise<unknown>;
      dismiss?: () => void;
    }) | null;
    expect(el, 'the wrapper renders the custom element (relocated to the stack)').not.toBeNull();
    expect(el?.variant).toBe('destructive');
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el?.getAttribute('role')).toBe('alert'); // destructive register
    expect(el?.shadowRoot?.querySelector('[tabindex]'), 'never focusable').toBeNull();
    // Re-home into the container before teardown: React's unmount removes
    // the nodes it TRACKS as container children — a relocated node would
    // throw removeChild during the suite's root.unmount() cleanup.
    if (el) container.appendChild(el);
    (el as { dismiss: () => void }).dismiss?.();
  });

  // --- Story 6.2: tk-filter-chips / tk-pagination wrappers (the v2 catalog controls) --

  it("carries the story 6.2 registry entries: tk-filter-chips value-change; tk-pagination page-change + load-more", () => {
    // The «Ещё» menu's open state is INTERNAL (the navbar-drawer precedent —
    // spec 6.2): no open-change mapping exists, deliberately.
    expect(EVENT_MAP['tk-filter-chips']).toEqual({ onValueChange: 'value-change' });
    expect(EVENT_MAP['tk-pagination']).toEqual({
      onPageChange: 'page-change',
      onLoadMore: 'load-more',
    });
  });

  it('renders <FilterChips> as tk-filter-chips with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(FilterChips, {
        label: 'Раздел каталога',
        visibleCount: 3,
        items: [
          { value: 'stocks', label: 'Акции' },
          { value: 'currency', label: 'Валюта' },
          { value: 'funds', label: 'Фонды' },
          { value: 'indexes', label: 'Индексы' },
        ],
      }),
    );
    const el = container.querySelector('tk-filter-chips');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Раздел каталога');
    expect((el as unknown as { visibleCount?: number }).visibleCount).toBe(3);
    expect((el as unknown as { items?: unknown[] }).items).toHaveLength(4);
    const tabs = (el as Element).shadowRoot?.querySelectorAll('[role="tab"]');
    expect(tabs, 'the windowed chip row renders').toHaveLength(3);
    expect((el as Element).shadowRoot?.querySelector('.chip--more'), 'the «Ещё» chip renders').not.toBeNull();
  });

  it('FilterChips handlers receive the UNWRAPPED string; controlled mode adds no clamping (mirrors Input)', async () => {
    const ITEMS = [
      { value: 'stocks', label: 'Акции' },
      { value: 'currency', label: 'Валюта' },
    ];
    let state = 'stocks';
    const container = await renderToContainer(
      React.createElement(FilterChips, {
        items: ITEMS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-filter-chips') as (Element & {
      value?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.value).toBe('stocks');

    // Select the second chip through the element's own pipeline.
    const chips = [...((el as Element).shadowRoot?.querySelectorAll('[role="tab"]') ?? [])];
    await act(() => {
      (chips[1] as HTMLElement).click();
    });

    // Strict: the event fired, the element's channel keeps the consumer value.
    expect(state).toBe('currency');
    expect(el?.value).toBe('stocks');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(
        React.createElement(FilterChips, {
          items: ITEMS,
          value: state,
          onValueChange: (value: unknown) => {
            state = value as string;
          },
        }),
      );
    });
    expect(el?.value).toBe('currency');
    const selected = [...((el as Element).shadowRoot?.querySelectorAll('[role="tab"]') ?? [])].find(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
    expect(selected?.textContent).toContain('Валюта');

    // Removing the value prop releases the element (frozen §4 semantics).
    await act(() => {
      root.render(React.createElement(FilterChips, { items: ITEMS, label: 'Раздел каталога' }));
    });
    expect(el?.value).toBeUndefined();
    const seeded = [...((el as Element).shadowRoot?.querySelectorAll('[role="tab"]') ?? [])].find(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
    expect(seeded?.textContent).toContain('Валюта');
  });

  it('renders <Pagination> as tk-pagination with element properties and boolean reflection', async () => {
    const container = await renderToContainer(
      React.createElement(Pagination, { count: 196, showMore: true, moreLabel: 'Показать еще' }),
    );
    const el = container.querySelector('tk-pagination') as (Element & {
      count?: number;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.count).toBe(196);
    expect(el?.hasAttribute('show-more'), 'boolean reflects').toBe(true);
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    // count data never reflects; the windowed row renders the capture shape.
    expect(el?.hasAttribute('count')).toBe(false);
    const pages = [...((el as Element).shadowRoot?.querySelectorAll('.pages li') ?? [])]
      .slice(1, -1)
      .map((li) => (li.querySelector('.page') ? (li.textContent ?? '').trim() : '…'));
    expect(pages).toEqual(['1', '2', '3', '4', '5', '…', '196']);
    expect((el as Element).shadowRoot?.querySelector('.load-more')?.textContent?.trim()).toBe(
      'Показать еще',
    );
  });

  it('Pagination handlers receive the UNWRAPPED number (page-change) and the occurrence (load-more)', async () => {
    const onPageChange = vi.fn();
    const onLoadMore = vi.fn();
    const container = await renderToContainer(
      React.createElement(Pagination, { count: 12, showMore: true, onPageChange, onLoadMore }),
    );
    const el = container.querySelector('tk-pagination');
    expect(el).not.toBeNull();

    el?.dispatchEvent(
      new CustomEvent('page-change', { detail: { value: 4 }, composed: true, bubbles: true }),
    );
    el?.dispatchEvent(new CustomEvent('load-more', { composed: true, bubbles: true }));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange.mock.calls[0]?.[0]).toBe(4);
    // Payload-less occurrence: the handler receives the event itself (§9).
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('Pagination controlled mode: standard page mapping, wrapper adds no clamping (number channel)', async () => {
    let state = 1;
    const container = await renderToContainer(
      React.createElement(Pagination, {
        count: 12,
        page: state,
        onPageChange: (value: unknown) => {
          expect(typeof value).toBe('number');
          state = value as number;
        },
      }),
    );
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-pagination') as (Element & {
      page?: number;
      updateComplete?: Promise<unknown>;
    }) | null;
    expect(el?.page).toBe(1);

    // Press «3» through the element's own pipeline.
    const buttons = [...((el as Element).shadowRoot?.querySelectorAll('.page') ?? [])];
    await act(() => {
      (buttons[2] as HTMLElement).click();
    });

    // Strict: the event fired, the element's channel keeps the consumer page.
    expect(state).toBe(3);
    expect(el?.page).toBe(1);

    // The consumer's render answers: page flows back, the pill moved.
    await act(() => {
      root.render(
        React.createElement(Pagination, {
          count: 12,
          page: state,
          onPageChange: (value: unknown) => {
            state = value as number;
          },
        }),
      );
    });
    expect(el?.page).toBe(3);
    expect((el as Element).shadowRoot?.querySelector('.page--active')?.textContent?.trim()).toBe('3');

    // Removing the page prop releases the element (frozen §4 semantics).
    await act(() => {
      root.render(React.createElement(Pagination, { count: 12, label: 'Пагинация' }));
    });
    expect(el?.page).toBeUndefined();
    expect((el as Element).shadowRoot?.querySelector('.page--active')?.textContent?.trim()).toBe('3');
  });

  // --- Story 6.3: tk-combobox-search wrapper (mirrors the Select smoke) ------

  it("carries the story 6.3 registry entry: tk-combobox-search's value-change", () => {
    expect(EVENT_MAP['tk-combobox-search']).toEqual({
      onValueChange: 'value-change',
    });
  });

  it('renders <ComboboxSearch> as tk-combobox-search with element properties set through the wrapper', async () => {
    const container = await renderToContainer(
      React.createElement(ComboboxSearch, {
        label: 'Поиск инструментов',
        placeholder: 'Название или тикер',
        options: [
          { value: 'GAZP', label: 'Газпром' },
          { value: 'SBER', label: 'Сбербанк' },
        ],
      }),
    );
    const el = container.querySelector('tk-combobox-search');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Поиск инструментов');
    expect((el as unknown as { placeholder?: string }).placeholder).toBe('Название или тикер');
    expect((el as unknown as { options?: unknown[] }).options).toHaveLength(2);
    expect(
      el?.shadowRoot?.querySelector('input[role="combobox"]'),
      'the combobox control renders',
    ).not.toBeNull();
  });

  it('ComboboxSearch handlers receive the UNWRAPPED string — never the CustomEvent (AD-1)', async () => {
    const onValueChange = vi.fn();
    const container = await renderToContainer(
      React.createElement(ComboboxSearch, { onValueChange }),
    );
    const el = container.querySelector('tk-combobox-search');
    el?.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: 'GAZP' }, composed: true, bubbles: true }),
    );
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]?.[0]).toBe('GAZP');
  });

  it('ComboboxSearch controlled mode: typing never emits, commit emits; standard value mapping, wrapper adds no clamping', async () => {
    const OPTIONS = [
      { value: 'GAZP', label: 'Газпром' },
      { value: 'SBER', label: 'Сбербанк' },
    ];
    let state = 'GAZP';
    let commits = 0;
    const render = () =>
      React.createElement(ComboboxSearch, {
        options: OPTIONS,
        value: state,
        onValueChange: (value: unknown) => {
          expect(typeof value).toBe('string');
          state = value as string;
          commits += 1;
        },
      });
    const container = await renderToContainer(render());
    const root = roots[roots.length - 1];
    const el = container.querySelector('tk-combobox-search') as (Element & {
      value?: string;
      updateComplete?: Promise<unknown>;
    }) | null;
    const control = el?.shadowRoot?.querySelector('input');
    expect(el?.value).toBe('GAZP');
    expect(control?.value, 'renders exactly the consumer value').toBe('Газпром');

    // TYPING through the element's own pipeline: live text only — the §4
    // strict carve-out. No event may reach the handler.
    await act(() => {
      (control as HTMLInputElement).value = 'сб';
      control?.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(commits, 'typing NEVER emits').toBe(0);
    expect(el?.value, 'strict: the channel is untouched by typing').toBe('GAZP');
    expect(control?.value, 'the live text holds between updates').toBe('сб');

    // Commit the active (first) row through the element's own pipeline.
    await act(() => {
      control?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    await (el as { updateComplete: Promise<unknown> }).updateComplete;
    expect(commits).toBe(1);
    expect(state).toBe('SBER');
    expect(el?.value, 'strict: the channel is untouched by commit').toBe('GAZP');
    expect(control?.value, 'reverts to exactly the consumer value until it answers').toBe('Газпром');

    // The consumer's render answers: value flows back.
    await act(() => {
      root.render(render());
    });
    expect(el?.value).toBe('SBER');
    expect(control?.value).toBe('Сбербанк');

    // Removing the value prop releases the element (frozen §4 semantics) —
    // seeded from the last controlled value, the field still shows «Сбербанк».
    await act(() => {
      root.render(React.createElement(ComboboxSearch, { options: OPTIONS, label: 'Поиск' }));
    });
    expect(el?.value).toBeUndefined();
    expect(control?.value).toBe('Сбербанк');
  });
});
