import { describe, expect, it } from 'vitest';

/**
 * Story 15.1 scaffold anchor: the public entry stays EMPTY until the first
 * ТЖ component story generates wrappers from the ТЖ CEM manifest (epic 16).
 */
describe('pillkit-tj-react scaffold (story 15.1)', () => {
  it('exports nothing yet — wrappers land with epic 16', async () => {
    const mod = await import('./index.js');
    expect(Object.keys(mod)).toEqual([]);
  });

  it('resolves the pinned @lit/react dependency (the generator substrate)', async () => {
    const litReact = await import('@lit/react');
    expect(typeof litReact.createComponent).toBe('function');
  });
});
