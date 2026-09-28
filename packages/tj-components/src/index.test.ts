import { describe, expect, it } from 'vitest';

/**
 * Story 15.1 scaffold anchor: the public entry stays EMPTY until the first
 * ТЖ component story (epic 16) — no surface may precede 16.1's freeze of
 * the reading primitives' API grammar.
 */
describe('pillkit-tj-components scaffold (story 15.1)', () => {
  it('exports nothing yet — components land with epic 16', async () => {
    const mod = await import('./index.js');
    expect(Object.keys(mod)).toEqual([]);
  });
});
