import * as litReact from '@lit/react';
import { describe, expect, it } from 'vitest';

import { Button, EVENT_MAP } from './index.js';

/**
 * @tk-kit/react scaffold + generated surface. The wrapper imports
 * `@tk-kit/components` (built dist — the packages run in topological order
 * under `pnpm -r test`) and the pinned `@lit/react`; React itself resolves
 * via the workspace peer (19.3.0).
 */
describe('@tk-kit/react', () => {
  it('generates a Button wrapper for tk-button from the manifest', () => {
    // createComponent returns a React ForwardRefExoticComponent — an object
    // with the React forward_ref tag and a render function.
    expect(Button).toBeTypeOf('object');
    expect(Button.$$typeof).toBeDefined();
    expect((Button as { render?: unknown }).render).toBeTypeOf('function');
  });

  it('resolves the pinned @lit/react dependency', () => {
    expect(typeof litReact.createComponent).toBe('function');
  });

  it('ships the owned event registry (empty for Button at v1)', () => {
    expect(EVENT_MAP).toEqual({});
  });
});
