import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { colorTokens, motionTokens, tokens, typographyTokens, zTokens } from './index.js';

/**
 * Story 1.2 acceptance anchors for the generated light layer — the full drift /
 * grammar guarantees live in the root suite and `pnpm check:tokens-drift`; these
 * pin the values downstream stories build against (AA overrides, font slots,
 * z-scale, motion durations).
 */
describe('@tk-kit/tokens generated maps', () => {
  it('ships the AA-overridden text-secondary, not the extracted #79818C', () => {
    expect(colorTokens['--tk-color-text-secondary']).toBe('#616871');
  });

  it('emits both font family slots with the DESIGN.md fallback stack', () => {
    const stack = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif';
    expect(typographyTokens['--tk-font-heading']).toBe(stack);
    expect(typographyTokens['--tk-font-body']).toBe(stack);
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

  it('keeps dark palette values out of the light layer (Never boundary)', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).not.toMatch(/--tk-color-dark-/);
  });
});
