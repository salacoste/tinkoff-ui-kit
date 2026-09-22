// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkButton } from './index.js';

/**
 * Package entry: every component's public surface is reachable from
 * `pillkit-components` (the React wrapper generator imports elements from
 * the package root, so a component missing here breaks `pnpm gen`).
 */
describe('pillkit-components entry', () => {
  it('re-exports the button element and registers tk-button', async () => {
    expect(TkButton).toBeDefined();
    await customElements.whenDefined('tk-button');
    expect(customElements.get('tk-button')).toBe(TkButton);
  });
});
