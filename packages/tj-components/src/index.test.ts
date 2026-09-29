import { describe, expect, it } from 'vitest';

import * as mod from './index.js';

/**
 * Public-surface pin (story 16.5: the site chrome landed): the entry exports
 * exactly the ten ТЖ elements + the two ТЖ event classes + the AD-12 overlay
 * helper's runtime surface — nothing speculative rides along. The 15.1
 * scaffold assertion (empty entry) flipped the way the bank's did when its
 * first component landed; 16.1 grew it to three elements, 16.2+16.3 to six,
 * 16.4 to eight + the first event class, this story to the chrome pair + the
 * helper (mountSheet/lockScroll/trapFocus + the scrim class constant) + the
 * header's exported JS constants (the theme attribute + the scroll
 * threshold). Type-only re-exports (TjHeaderItem, TjRailItem, the handle/
 * strategy types) are compile-time only and never appear at runtime — JS
 * `export *` skips interface bindings.
 */
describe('pillkit-tj-components public surface (story 16.5)', () => {
  it('exports exactly the ten ТЖ elements + two event classes + the overlay helper surface', () => {
    expect(Object.keys(mod).sort()).toEqual([
      'TJ_HEADER_SCROLL_THRESHOLD_PX',
      'TJ_SHEET_SCRIM_CLASS',
      'TJ_THEME_ATTRIBUTE',
      'TjComposer',
      'TjCta',
      'TjHeader',
      'TjLink',
      'TjNewsCard',
      'TjOpenChangeEvent',
      'TjOpenComposeEvent',
      'TjPostCard',
      'TjProse',
      'TjRail',
      'TjRubricHeader',
      'TjTagChip',
      'TjThemeChangeEvent',
      'lockScroll',
      'mountSheet',
      'trapFocus',
    ]);
  });
});
