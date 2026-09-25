import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { colorTokens, motionTokens, shadowTokens, tokens, typographyTokens, zTokens } from './index.js';

/**
 * Story 1.2 acceptance anchors for the generated light layer — the full drift /
 * grammar guarantees live in the root suite and `pnpm check:tokens-drift`; these
 * pin the values downstream stories build against (AA overrides, font slots,
 * z-scale, motion durations).
 */
describe('pillkit-tokens generated maps', () => {
  it('ships the AA-overridden text-secondary, not the extracted #79818C', () => {
    expect(colorTokens['--tk-color-text-secondary']).toBe('#616871');
  });

  it('emits both font family slots with the Daytona-first DESIGN.md stacks (maintainer license decision, 2026-09-22)', () => {
    const heading =
      'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif';
    const body =
      'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif';
    expect(typographyTokens['--tk-font-heading']).toBe(heading);
    expect(typographyTokens['--tk-font-body']).toBe(body);
  });

  it('emits the 9.1 additions: measured tint-brown + the mono family slot (story 9.1)', () => {
    expect(colorTokens['--tk-color-tint-brown']).toBe('#8D6040');
    expect(typographyTokens['--tk-font-mono']).toBe(
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    );
    // Mono has NO 9.1 consumer by design — the first is the invest tables
    // story (11.2); the deliberate exemption is recorded in DESIGN.md's
    // fonts comment and TOKENS.md.
  });

  it('keeps caps-s tracking separate (no text-transform in tokens)', () => {
    expect(typographyTokens['--tk-text-caps-s-tracking']).toBe('1px');
    expect(Object.keys(tokens).some((name) => name.includes('transform'))).toBe(false);
  });

  it('emits the z-scale in AD-12 stacking order', () => {
    expect(zTokens).toEqual({
      '--tk-z-nav': '100',
      '--tk-z-dropdown': '200',
      '--tk-z-popover': '300',
      '--tk-z-tooltip': '400',
      '--tk-z-modal': '500',
      '--tk-z-toast': '600',
    });
  });

  it('emits every motion duration from DESIGN.md', () => {
    expect(motionTokens).toMatchObject({
      '--tk-motion-duration-fastest': '75ms',
      '--tk-motion-duration-fast': '150ms',
      '--tk-motion-duration-moderate': '300ms',
      '--tk-motion-duration-slow': '500ms',
      '--tk-motion-duration-slowest': '700ms',
    });
  });

  it('keeps every token under the --tk- grammar', () => {
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
    for (const name of Object.keys(tokens)) {
      expect(name.startsWith('--tk-')).toBe(true);
    }
  });

  it('mirrors the AA override into the stylesheet artifact', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).toContain('--tk-color-text-secondary: #616871');
  });

  it('emits no --tk-color-dark-* custom-property declarations (Never boundary)', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    // Story 1.3 documents the rule in artifact comments ("never emitted as
    // `--tk-color-dark-*`") — the boundary is about declarations, so strip
    // comments before matching, exactly like the FR-1 detector does.
    const declarationsOnly = css.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(declarationsOnly).not.toMatch(/--tk-color-dark-/);
  });

  it('carries the derived aa-annotations ledger with zero open [ASSUMPTION] flags (story 9.2)', () => {
    const md = readFileSync(new URL('./TOKENS.md', import.meta.url), 'utf8');
    expect(md).toContain('`aa-annotations:` block');
    expect(md).toContain('10 verified / 0 open `[ASSUMPTION]` flags');
  });
});

/**
 * Story 1.3 acceptance anchors for the dark layer — the block exists on
 * `[data-theme="dark"]` (both document and shadow-host selector forms), the
 * frozen mapping's selected overrides are pinned, tonal elevation collapses
 * shadows to `none`, the invariants stay absent, and nothing outside
 * colors/shadows is ever re-declared (typography/radius/spacing/motion/z are
 * theme-invariant — single source in the light layer).
 */
describe('pillkit-tokens dark layer (Story 1.3)', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
  const darkStart = css.indexOf(':host([data-theme="dark"])');
  const darkSection = darkStart === -1 ? '' : css.slice(darkStart);
  // Declarations only — the dark section carries explanatory comments that
  // mention token names (invariants, the --tk-<component>-<slot> grammar).
  const darkDeclarations = darkSection.replace(/\/\*[\s\S]*?\*\//g, '');
  const darkNames = new Set([...darkDeclarations.matchAll(/(--tk-[a-z0-9-]+):/g)].map((match) => match[1]));

  it('declares the block on both document and shadow-host dark selectors', () => {
    expect(darkSection, 'no [data-theme="dark"] layer found in tokens.css').not.toBe('');
    expect(darkSection).toContain(':host([data-theme="dark"])');
    expect(darkSection).toContain(':root[data-theme="dark"] {');
  });

  it('pins the frozen mapping: surfaces, borders, white-alpha trio, link/focus #66A3FF', () => {
    expect(darkSection).toContain('--tk-color-surface-base: #1A1A1A;');
    expect(darkSection).toContain('--tk-color-surface-muted: #222222;');
    expect(darkSection).toContain('--tk-color-surface-field: #FFFFFF1A;');
    expect(darkSection).toContain('--tk-color-border-default: #FFFFFF24;');
    expect(darkSection).toContain('--tk-color-border-strong: #FFFFFF3D;');
    expect(darkSection).toContain('--tk-color-text-primary: #FFFFFF;');
    expect(darkSection).toContain('--tk-color-text-secondary: #FFFFFFB3;');
    expect(darkSection).toContain('--tk-color-text-muted: #FFFFFF80;');
    expect(darkSection).toContain('--tk-color-focus-ring: #66A3FF;');
    expect(darkSection).toContain('--tk-color-link: #66A3FF;');
    expect(darkSection).toContain('--tk-color-error: #FF7B74;');
    expect(darkSection).toContain('--tk-color-link-on-tint: #66A3FF;');
    expect(darkSection).toContain('--tk-color-error-on-field: #FF7B74;');
    expect(darkSection).toContain('--tk-color-tint-gray: #242424;');
    expect(darkSection).toContain('--tk-color-tint-bluegray: #1E242C;');
    expect(darkSection).toContain('--tk-color-tint-mint: #1C2A26;');
    expect(darkSection).toContain('--tk-color-tint-beige: #2A2620;');
  });

  it('declares EXACTLY the 23 mapped semantic colors + 6 shadow-none tokens — nothing else', () => {
    const expected = [
      '--tk-color-surface-base',
      '--tk-color-surface-muted',
      '--tk-color-surface-field',
      '--tk-color-border-default',
      '--tk-color-border-strong',
      '--tk-color-text-primary',
      '--tk-color-text-secondary',
      '--tk-color-text-muted',
      '--tk-color-focus-ring',
      '--tk-color-link',
      '--tk-color-error',
      '--tk-color-link-on-tint',
      '--tk-color-error-on-field',
      '--tk-color-tint-gray',
      '--tk-color-tint-bluegray',
      '--tk-color-tint-mint',
      '--tk-color-tint-beige',
      // v2 additions (Story 6.1) — warm-cream tints + table semantics.
      '--tk-color-tint-cream',
      '--tk-color-tint-cream-raised',
      '--tk-color-delta-positive',
      '--tk-color-delta-negative',
      '--tk-color-border-table',
      '--tk-color-surface-row-hover',
      ...Object.keys(shadowTokens),
    ].sort();
    expect([...darkNames].sort()).toEqual(expected);
  });

  it('collapses every shadow token to none (tonal elevation)', () => {
    for (const name of Object.keys(shadowTokens)) {
      expect(darkSection, `${name} must be re-declared as none in dark`).toContain(`${name}: none;`);
    }
  });

  it('keeps the invariants at their light values — no dark re-declaration', () => {
    expect(darkNames.has('--tk-color-text-on-primary')).toBe(false);
    expect(darkNames.has('--tk-color-tint-charcoal')).toBe(false);
    // Story 9.1: the stepper badge brown is theme-invariant (the charcoal
    // mold) — the badge keeps its fill + white numeral in dark.
    expect(darkNames.has('--tk-color-tint-brown')).toBe(false);
  });

  it('re-declares only semantic colors and shadows — typography/radius/spacing/motion/font stay single-source', () => {
    const themeInvariant = /^--tk-(text|radius|space|motion|z|font)-/;
    for (const name of darkNames) {
      expect(name, `${name} is theme-invariant and must never appear in the dark layer`).not.toMatch(themeInvariant);
    }
  });

  it('exposes link/error semantics in the light layer for the dark layer to override', () => {
    expect(colorTokens['--tk-color-link']).toBe('#1771E6');
    expect(colorTokens['--tk-color-error']).toBe('#E01F19');
    expect(colorTokens['--tk-color-error-on-field']).toBe('#D3120E');
  });
});
