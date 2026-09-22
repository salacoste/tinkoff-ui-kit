// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it } from 'vitest';

import { Button, EVENT_MAP } from './index.js';

/**
 * @tk-kit/react generated surface. The wrapper imports `@tk-kit/components`
 * (built dist — the packages run in topological order under `pnpm -r test`)
 * and the pinned `@lit/react`; React itself resolves via the workspace peer
 * (19.3.0). The smoke test EXECUTES the wrapper through react-dom — the
 * generated file is the whole public surface, so an object-shape check alone
 * would not catch a broken binding.
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

describe('@tk-kit/react', () => {
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
    // Membership assertion, not deep-equality: the registry grows when Input
    // lands; only tk-button's absence is this component's contract.
    expect(EVENT_MAP['tk-button']).toBeUndefined();
  });

  it('freezes the event registry at runtime (file edits, never mutation)', () => {
    expect(Object.isFrozen(EVENT_MAP)).toBe(true);
    expect(() => {
      (EVENT_MAP as Record<string, unknown>)['tk-foo'] = {};
    }).toThrow(TypeError);
  });
});
