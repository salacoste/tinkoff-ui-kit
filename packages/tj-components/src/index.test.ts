import { describe, expect, it } from 'vitest';

import * as mod from './index.js';

/**
 * Public-surface pin (story 16.1: the reading primitives landed): the entry
 * exports exactly the three ТЖ elements — nothing speculative rides along.
 * The 15.1 scaffold assertion (empty entry) flipped the way the bank's did
 * when its first component landed.
 */
describe('pillkit-tj-components public surface (story 16.1)', () => {
  it('exports exactly the reading primitives (code-unit sorted)', () => {
    expect(Object.keys(mod).sort()).toEqual(['TjCta', 'TjLink', 'TjProse']);
  });
});
