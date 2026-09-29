import { describe, expect, it } from 'vitest';

import * as mod from './index.js';

/**
 * Public-surface pin (story 16.2+16.3: the feed surfaces landed): the entry
 * exports exactly the six ТЖ elements — nothing speculative rides along.
 * The 15.1 scaffold assertion (empty entry) flipped the way the bank's did
 * when its first component landed; 16.1 grew it to three, this batch to six.
 */
describe('pillkit-tj-components public surface (story 16.2+16.3)', () => {
  it('exports exactly the six ТЖ elements (code-unit sorted)', () => {
    expect(Object.keys(mod).sort()).toEqual([
      'TjCta',
      'TjLink',
      'TjNewsCard',
      'TjProse',
      'TjRubricHeader',
      'TjTagChip',
    ]);
  });
});
