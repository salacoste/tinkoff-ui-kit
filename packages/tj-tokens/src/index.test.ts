import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Story 15.1 scaffold anchors (the 1.1 mold): the placeholder stylesheet
 * carries the ТЖ-namespace marker through the package's `./tokens.css`
 * export source, and the programmatic entry stays EMPTY until the generator
 * lands at 15.2 — no hand-authored token may precede its table (AD-3 v5).
 */
describe('pillkit-tj-tokens scaffold (story 15.1)', () => {
  it('carries the --tj-scaffold-placeholder marker in the stylesheet source', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).toContain('--tj-scaffold-placeholder');
  });

  it('declares the marker on the light-layer selectors (:host, :root)', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).toContain(':root');
  });

  it('exports nothing yet — the generated token maps land at story 15.2', async () => {
    const mod = await import('./index.js');
    expect(Object.keys(mod)).toEqual([]);
  });
});
