import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { TJ_REQUIRED_NOTES, tjRegistersData } from '../packages/docs/src/tj/tj-registers.js';
import { colorTokens, darkColorTokens, typographyTokens } from '../packages/tj-tokens/src/tokens.js';

/**
 * ТЖ registers-surface drift guard (spec 17.3 — the 8.3 AD-4 lesson, TJ
 * mirror of tests/docs-registers-source.test.ts).
 *
 * The token-reference «Регистры ТЖ» story renders the COMMITTED generated
 * TOKENS.md (imported as `pillkit-tj-tokens/TOKENS.md?raw`) through the real
 * TJ parser (packages/docs/src/tj/tj-registers.ts — the sanctioned
 * family-specific mirror reusing the bank primitives). This test feeds the
 * same committed file through the same parser AND cross-checks every parsed
 * row against the generator's typed maps: if the generator's section shape
 * drifts, the suite fails HERE with the parser's own loud message — before
 * the docs build could render a silently-empty table.
 * check:tokens-drift:tj keeps TOKENS.md regenerated; this keeps the parse
 * honest and the export lane wired.
 */
describe('ТЖ registers surface single source (spec 17.3)', () => {
  const repoRoot = fileURLToPath(new URL('..', import.meta.url));
  const tokensMd = readFileSync(join(repoRoot, 'packages/tj-tokens/src/TOKENS.md'), 'utf8');
  const data = tjRegistersData(tokensMd);

  it('the export target the story imports IS the committed generated listing', () => {
    const pkg = JSON.parse(
      readFileSync(join(repoRoot, 'packages/tj-tokens/package.json'), 'utf8'),
    ) as { exports: Record<string, string>; files: string[] };
    expect(pkg.exports['./TOKENS.md']).toBe('./src/TOKENS.md');
    // The files array ships the same source file to workspace consumers
    // (the bank tokens package mold).
    expect(pkg.files).toContain('src/TOKENS.md');
  });

  it('the dark-layer table parses to EXACTLY the 13 overrides of the generator map', () => {
    const rows = data.darkLayer.rows;
    expect(rows).toHaveLength(13);
    expect(rows.map((row) => row[0])).toEqual(Object.keys(darkColorTokens));
    // Every parsed Dark value is the generator's own — no hand-copied rows.
    for (const [token, , dark] of rows) {
      expect(dark).toBe(darkColorTokens[token as keyof typeof darkColorTokens]);
      // The Light column must agree with the light map too.
      expect(row1(rows, token)).toBe(colorTokens[token as keyof typeof colorTokens]);
    }
  });

  it('the theme invariants are the 5 tokens the dark layer never overrides', () => {
    const tokens = data.invariants.map(([token]) => token);
    expect(tokens).toHaveLength(5);
    for (const token of tokens) {
      expect(Object.hasOwn(darkColorTokens, token)).toBe(false);
      expect(Object.hasOwn(colorTokens, token)).toBe(true);
    }
    // The load-bearing invariant rulings render verbatim from the bullets.
    const rationales = Object.fromEntries(data.invariants);
    expect(rationales['--tj-color-ink-200']).toContain('cta-fill');
    expect(rationales['--tj-color-ink-reference-time']).toContain('unbound in dark');
    expect(rationales['--tj-color-badge-purple']).toContain('stays purple in dark');
  });

  it('the font-slots table parses to the two FR-20 slots with generator stacks', () => {
    expect(data.fontSlots.rows.map((row) => row[0])).toEqual(['--tj-font-ui', '--tj-font-reading']);
    for (const [token, value] of data.fontSlots.rows) {
      expect(value).toBe(typographyTokens[token as keyof typeof typographyTokens]);
    }
    // The FR-20 paragraph names both reference families.
    expect(data.fontSlotsNote).toContain('ui = Graphik');
    expect(data.fontSlotsNote).toContain('reading = Charter');
  });

  it('the dual-emission contract renders from the dark-layer lead verbatim', () => {
    expect(data.darkLayerNote).toContain('prefers-color-scheme');
    expect(data.darkLayerNote).toContain('data-tj-theme="light"');
  });

  it('the radius note is the quiet-geometry lead (cards 25 / panels 30)', () => {
    expect(data.radiusNote.startsWith('Pixel-probed')).toBe(true);
    expect(data.radiusNote).toContain('**25** / panels **30**');
  });

  it('every required AA/restriction ruling is present and verbatim', () => {
    for (const token of TJ_REQUIRED_NOTES) {
      expect(data.notes[token]?.length ?? 0).toBeGreaterThan(0);
    }
    // Spot-pinned rulings (the pages quote these; drift would change the
    // rendered rules silently).
    expect(data.notes['--tj-color-ink-reference-meta']).toContain('Restricted');
    expect(data.notes['--tj-color-ink-reference-meta']).toContain('2.434:1');
    expect(data.notes['--tj-color-gold-ink']).toContain('AA override');
    expect(data.notes['--tj-color-chip-fill']).toContain('Theme-invariant');
    expect(data.notes['--tj-color-focus-ring']).toContain('non-text 3:1');
    expect(data.notes['--tj-color-engage']).toContain('Restricted');
  });
});

/** The Light column (index 1) of a dark-layer row, by token name. */
function row1(rows: string[][], token: string): string | undefined {
  return rows.find((row) => row[0] === token)?.[1];
}
