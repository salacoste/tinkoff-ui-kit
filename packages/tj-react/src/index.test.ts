// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it } from 'vitest';

import { Cta, EVENT_MAP, Link, Prose } from './index.js';

/**
 * pillkit-tj-react generated surface (story 16.1: the reading primitives).
 * The wrapper imports `pillkit-tj-components` (built dist — the packages run
 * in topological order under `pnpm -r test`) and the pinned `@lit/react`;
 * React itself resolves via the workspace peer (19.3.0). The smoke test
 * EXECUTES each wrapper through react-dom — the generated file is the whole
 * public surface, so an object-shape check alone would not catch a broken
 * binding (the bank index.test.ts mold).
 *
 * 16.1 pins the EMPTY-registry contract: all three wrappers bind zero kit
 * events (the reading primitives dispatch nothing — the no-entry rulings in
 * event-map.ts) and the unwrap bridge exists but never fires.
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

describe('pillkit-tj-react (story 16.1)', () => {
  it('generates the three reading-primitive wrappers from the ТЖ manifest', () => {
    // createComponent returns a React ForwardRefExoticComponent — an object
    // with the React forward_ref tag and a render function.
    for (const wrapper of [Cta, Link, Prose]) {
      expect(wrapper).toBeTypeOf('object');
      expect(wrapper.$$typeof).toBeDefined();
      expect((wrapper as { render?: unknown }).render).toBeTypeOf('function');
    }
  });

  it('renders <Prose> as tj-prose with slotted children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Prose, null, React.createElement('p', null, 'Абзац')),
    );
    const el = container.querySelector('tj-prose');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.textContent).toBe('Абзац');
    expect(el?.shadowRoot?.querySelector('slot[name="lead"]')).not.toBeNull();
  });

  it('renders <Link> as tj-link with element properties set through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        Link,
        { href: 'https://example.com/post', target: '_blank' },
        'Читать',
      ),
    );
    const el = container.querySelector('tj-link');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('https://example.com/post');
    expect((el as unknown as { target?: string }).target).toBe('_blank');
    expect(el?.textContent).toBe('Читать');
    const anchor = el?.shadowRoot?.querySelector('a.link');
    expect(anchor?.getAttribute('href')).toBe('https://example.com/post');
    // The 10.4 mold holds through the wrapper: _blank + no consumer rel.
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders <Cta> as tj-cta with element properties set through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Cta, { href: '#subscribe' }, 'Написать'),
    );
    const el = container.querySelector('tj-cta');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('#subscribe');
    expect(el?.textContent).toBe('Написать');
    expect(el?.shadowRoot?.querySelector('a.cta')?.getAttribute('href')).toBe('#subscribe');
  });

  it('forwards refs through the HOC to the underlying elements (every wrapper is a forwardRef HOC)', async () => {
    const proseRef = React.createRef<HTMLElement>();
    await renderToContainer(React.createElement(Prose, { ref: proseRef }));
    // The ref lands on the CUSTOM ELEMENT itself — the HOC layer must stay
    // transparent for imperative access (focus, internals, measurements).
    expect(proseRef.current).toBeInstanceOf(HTMLElement);
    expect(proseRef.current?.tagName).toBe('TJ-PROSE');
  });

  it('resolves the pinned @lit/react dependency', () => {
    expect(typeof litReact.createComponent).toBe('function');
  });

  it('ships the EMPTY 16.1 event registry — no reading primitive maps events', () => {
    // The freeze ruling (spec 16.1 + CONVENTIONS §9): stateless display/link
    // surface — tj-link/tj-cta ride the native composed click, tj-prose
    // dispatches nothing. The first stateful ТЖ surface APPENDS here.
    expect(EVENT_MAP['tj-prose']).toBeUndefined();
    expect(EVENT_MAP['tj-link']).toBeUndefined();
    expect(EVENT_MAP['tj-cta']).toBeUndefined();
    expect(Object.keys(EVENT_MAP)).toEqual([]);
  });

  it('freezes the event registry at runtime (file edits, never mutation)', () => {
    expect(Object.isFrozen(EVENT_MAP)).toBe(true);
    expect(() => {
      (EVENT_MAP as Record<string, unknown>)['tj-foo'] = {};
    }).toThrow(TypeError);
  });
});
