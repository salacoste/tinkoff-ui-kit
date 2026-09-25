import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  registersData,
  SURFACE_SEMANTICS_GROUPS,
} from '../packages/docs/src/v2/registers.js';
import { colorTokens, darkColorTokens } from '../packages/tokens/src/tokens.js';

/**
 * Registers-surface drift guard (spec 8.3, the AD-4 single-source lesson).
 *
 * The token-reference «Регистры v2» story renders the COMMITTED generated
 * TOKENS.md (imported as `pillkit-tokens/TOKENS.md?raw`) through the real
 * parser (packages/docs/src/v2/registers.ts). This test feeds the same
 * committed file through the same parser: if the generator's section shape
 * drifts (a heading renamed, a ruling note dropped, a register row lost),
 * the suite fails HERE with the parser's own loud message — before the docs
 * build could ever render a silently-empty table. check:tokens-drift keeps
 * TOKENS.md regenerated; this keeps the parse honest.
 */
describe('registers surface single source (spec 8.3)', () => {
  const repoRoot = fileURLToPath(new URL('..', import.meta.url));
  const tokensMd = readFileSync(join(repoRoot, 'packages/tokens/src/TOKENS.md'), 'utf8');

  it('the export target the story imports IS the committed generated listing', () => {
    const pkg = JSON.parse(
      readFileSync(join(repoRoot, 'packages/tokens/package.json'), 'utf8'),
    ) as { exports: Record<string, string> };
    expect(pkg.exports['./TOKENS.md']).toBe('./src/TOKENS.md');
  });

  it('the typography-registers table parses to the three 6.1 registers', () => {
    const { typography } = registersData(tokensMd);
    expect(typography.rows.map((row) => row[0])).toEqual([
      'marketing',
      'product-UI',
      'consumer',
    ]);
    // The mapping the spec pins: marketing h1→heading-2, product-UI h1→heading-3.
    expect(typography.rows[0]?.[2]).toContain('--tk-text-heading-2');
    expect(typography.rows[1]?.[2]).toContain('--tk-text-heading-3');
    expect(typography.rows[2]?.[2]).toContain('--tk-text-heading-1');
  });

  it('the delta AA-override ruling renders from TOKENS.md verbatim', () => {
    const { notes } = registersData(tokensMd);
    expect(notes['--tk-color-delta-positive']).toContain('AA override');
    expect(notes['--tk-color-delta-positive']).toContain('surface-base');
    expect(notes['--tk-color-delta-negative']).toContain('AA override');
    expect(notes['--tk-color-tint-cream-raised']).toContain('4.306:1');
  });

  it('the radius-registers note parses from the Radius section', () => {
    const { radiusNote } = registersData(tokensMd);
    expect(radiusNote.startsWith('Two registers')).toBe(true);
  });

  it('every surface-semantics token exists in BOTH generator maps (v2 tokens flow to the page)', () => {
    for (const group of SURFACE_SEMANTICS_GROUPS) {
      for (const token of group.tokens) {
        expect(Object.hasOwn(colorTokens, token)).toBe(true);
        expect(Object.hasOwn(darkColorTokens, token)).toBe(true);
      }
    }
  });
});
