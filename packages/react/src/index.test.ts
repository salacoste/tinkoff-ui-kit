// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { Button, EVENT_MAP, Input } from './index.js';

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
