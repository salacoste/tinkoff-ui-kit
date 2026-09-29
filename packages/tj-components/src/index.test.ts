import { describe, expect, it } from 'vitest';

import * as mod from './index.js';

/**
 * Public-surface pin (story 16.4: the community surfaces landed): the entry
 * exports exactly the eight ТЖ elements + the first ТЖ event class —
 * nothing speculative rides along. The 15.1 scaffold assertion (empty
 * entry) flipped the way the bank's did when its first component landed;
 * 16.1 grew it to three, 16.2+16.3 to six, this batch to nine code units
 * (eight elements + TjOpenComposeEvent, the event-map's first entry).
 */
describe('pillkit-tj-components public surface (story 16.4)', () => {
  it('exports exactly the eight ТЖ elements + the first event class (code-unit sorted)', () => {
    expect(Object.keys(mod).sort()).toEqual([
      'TjComposer',
      'TjCta',
      'TjLink',
      'TjNewsCard',
      'TjOpenComposeEvent',
      'TjPostCard',
      'TjProse',
      'TjRubricHeader',
      'TjTagChip',
    ]);
  });
});
