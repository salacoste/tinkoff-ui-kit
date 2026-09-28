import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { colorTokens, darkColorTokens } from '../packages/tj-tokens/src/tokens.js';

/**
 * Mechanized AA-contrast table for the ТЖ layer (story 15.2 — the bank 1.3
 * mold, second instance): every pair from the ТЖ DESIGN.md Colors AA table plus
 * the dark-mapping legs is asserted against its WCAG 2.1 threshold with the
 * exact computed ratio recorded to 3 decimals (pins machine-trued 2026-09-28 —
 * the spec Change Log #1 records the arithmetic corrections). A pair fails the
 * suite naming the pair and the computed ratio; a value change that shifts a
 * ratio breaks the recorded pin, so drift has to be re-recorded deliberately.
 *
 * The RESTRICTED inks are pinned the failing way (the no-silent-omission
 * rule): each asserts its exact sub-AA ratio AND that its `Restricted:` ruling
 * rides the generated tokens.css declaration — the machine truth and the
 * rendered annotation must stay in lockstep.
 *
 * Math: WCAG 2.1 relative luminance (sRGB linearization, 0.2126/0.7152/0.0722
 * weights), ratio = (L1+0.05)/(L2+0.05). The ТЖ table is all-opaque hex — no
 * alpha compositing legs; an alpha-bearing BACKGROUND is still rejected
 * outright (ambiguous without an explicit compositing base).
 *
 * Sources stay in sync with the artifacts: light values come from the
 * generated colorTokens map, dark values from the generated darkColorTokens
 * map — never re-typed here.
 */

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

type Rgb = readonly [number, number, number];

function parseHex(hex: string): { rgb: Rgb; alpha: number } {
  const match = /^#([0-9a-fA-F]{3,8})$/.exec(hex);
  if (match === null) throw new Error(`contrast: not a hex color: ${hex}`);
  let digits = match[1];
  if (digits.length === 3 || digits.length === 4) digits = [...digits].map((d) => d + d).join('');
  if (digits.length !== 6 && digits.length !== 8) throw new Error(`contrast: unsupported hex shape: ${hex}`);
  const channel = (index: number) => parseInt(digits.slice(index * 2, index * 2 + 2), 16);
  return { rgb: [channel(0), channel(1), channel(2)], alpha: digits.length === 8 ? channel(3) / 255 : 1 };
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).rgb;
  const linearize = (channel: number) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG 2.1 contrast ratio; alpha-bearing backgrounds abort (ambiguous — only the caller knows what lies beneath). */
function contrastRatio(fgHex: string, bgHex: string): number {
  if (parseHex(bgHex).alpha < 1) {
    throw new Error(
      `contrast: alpha-bearing background '${bgHex}' needs an explicit compositing base — composite it onto its surface first, then compare the opaque results`,
    );
  }
  const l1 = luminance(fgHex);
  const l2 = luminance(bgHex);
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

/** Dark-layer value lookup — keyof-typed against the generated map. */
function dark(token: keyof typeof darkColorTokens): string {
  return darkColorTokens[token];
}

interface AaPair {
  theme: 'light' | 'dark';
  name: string;
  fg: string;
  bg: string;
  min: number;
  /** Computed ratio at authoring time — recorded so value drift is loud. */
  recorded: number;
}

const AA_PAIRS: readonly AaPair[] = [
  // Light — headline ink on both light surfaces (the editorial reading base).
  { theme: 'light', name: 'ink-100 headline ink on card', fg: colorTokens['--tj-color-ink-100'], bg: colorTokens['--tj-color-card'], min: AA_TEXT, recorded: 21 },
  { theme: 'light', name: 'ink-100 headline ink on page', fg: colorTokens['--tj-color-ink-100'], bg: colorTokens['--tj-color-page'], min: AA_TEXT, recorded: 18.427 },
  // Light — the CTA pill (near-black fill, white ink).
  { theme: 'light', name: 'cta-ink on cta-fill (light pill)', fg: colorTokens['--tj-color-cta-ink'], bg: colorTokens['--tj-color-cta-fill'], min: AA_TEXT, recorded: 12.635 },
  // Light — the AUTHORED essential-meta AA step (vs the restricted reference meta below).
  { theme: 'light', name: 'ink-300 authored meta on card', fg: colorTokens['--tj-color-ink-300'], bg: colorTokens['--tj-color-card'], min: AA_TEXT, recorded: 5.099 },
  // Light — the gold asymmetry's light leg: the authored #8A6519 link step
  // (the reference gold #C79637 itself fails — 2.676:1, why gold-ink exists).
  { theme: 'light', name: 'gold-ink authored link on card', fg: colorTokens['--tj-color-gold-ink'], bg: colorTokens['--tj-color-card'], min: AA_TEXT, recorded: 5.308 },
  // Light — the scoped 30×30 badge: white glyph on purple, non-text UI (1.4.11 3:1).
  { theme: 'light', name: 'badge glyph (white) on badge-purple fill', fg: colorTokens['--tj-color-cta-ink'], bg: colorTokens['--tj-color-badge-purple'], min: AA_NON_TEXT, recorded: 4.536 },
  // Dark — the gold asymmetry's dark leg: the link alias flips to the
  // REFERENCE gold and it clears AA on dark surfaces (why gold stays invariant).
  { theme: 'dark', name: 'link (reference gold) on dark card', fg: dark('--tj-color-link'), bg: dark('--tj-color-card'), min: AA_TEXT, recorded: 5.876 },
  // Dark — dark-meta carries BOTH meta semantics (the ink-300 collapse and the
  // reference-meta remap) on both dark surfaces.
  { theme: 'dark', name: 'ink-300 (collapsed onto dark-meta) on dark card', fg: dark('--tj-color-ink-300'), bg: dark('--tj-color-card'), min: AA_TEXT, recorded: 10.211 },
  { theme: 'dark', name: 'ink-300 (collapsed onto dark-meta) on dark page', fg: dark('--tj-color-ink-300'), bg: dark('--tj-color-page'), min: AA_TEXT, recorded: 11.859 },
  { theme: 'dark', name: 'ink-reference-meta (remapped to dark-meta) on dark card', fg: dark('--tj-color-ink-reference-meta'), bg: dark('--tj-color-card'), min: AA_TEXT, recorded: 10.211 },
  { theme: 'dark', name: 'ink-reference-meta (remapped to dark-meta) on dark page', fg: dark('--tj-color-ink-reference-meta'), bg: dark('--tj-color-page'), min: AA_TEXT, recorded: 11.859 },
  // Dark — the CTA pill inverts (near-white fill, black ink).
  { theme: 'dark', name: 'cta-ink on cta-fill (inverted pill)', fg: dark('--tj-color-cta-ink'), bg: dark('--tj-color-cta-fill'), min: AA_TEXT, recorded: 19.311 },
  // Dark — the dark-completeness extraction: pure-white headline ink on both
  // dark surfaces (the dark-home census grounding for dark-ink #FFFFFF).
  { theme: 'dark', name: 'ink-100 (dark-ink extraction) on dark card', fg: dark('--tj-color-ink-100'), bg: dark('--tj-color-card'), min: AA_TEXT, recorded: 15.727 },
  { theme: 'dark', name: 'ink-100 (dark-ink extraction) on dark page', fg: dark('--tj-color-ink-100'), bg: dark('--tj-color-page'), min: AA_TEXT, recorded: 18.265 },
];

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const TOKENS_CSS = join(REPO_ROOT, 'packages/tj-tokens/src/tokens.css');

interface RestrictedPair {
  theme: 'light' | 'dark';
  name: string;
  token: string;
  fg: string;
  bg: string;
  recorded: number;
}

const RESTRICTED_PAIRS: readonly RestrictedPair[] = [
  {
    theme: 'light',
    name: 'ink-reference-meta on card — supplementary/decorative meta only',
    token: '--tj-color-ink-reference-meta',
    fg: colorTokens['--tj-color-ink-reference-meta'],
    bg: colorTokens['--tj-color-card'],
    recorded: 2.434,
  },
  {
    theme: 'light',
    name: 'ink-reference-time on card — timestamps/read-time only, never names/titles',
    token: '--tj-color-ink-reference-time',
    fg: colorTokens['--tj-color-ink-reference-time'],
    bg: colorTokens['--tj-color-card'],
    recorded: 3.949,
  },
  {
    theme: 'dark',
    name: 'engage (dark-engage) on dark card — counts/secondary affordances only',
    token: '--tj-color-engage',
    fg: darkColorTokens['--tj-color-engage'],
    bg: darkColorTokens['--tj-color-card'],
    recorded: 3.277,
  },
];

describe('ТЖ AA contrast (story 15.2)', () => {
  it('sanctioned pairs clear their WCAG thresholds at the recorded ratios', () => {
    for (const pair of AA_PAIRS) {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(ratio, `${pair.theme} — ${pair.name}`).toBeCloseTo(pair.recorded, 3);
      expect(ratio, `${pair.theme} — ${pair.name}`).toBeGreaterThanOrEqual(pair.min);
    }
  });

  it('restricted inks FAIL AA at the recorded ratios and carry their ruling in tokens.css', () => {
    const css = readFileSync(TOKENS_CSS, 'utf8');
    for (const pair of RESTRICTED_PAIRS) {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(ratio, `${pair.theme} — ${pair.name}`).toBeCloseTo(pair.recorded, 3);
      expect(ratio, `${pair.theme} — ${pair.name}`).toBeLessThan(AA_TEXT);
      // The generated stylesheet carries the Restricted: ruling on the light
      // declaration (aa-annotations derived, 15.2) — the annotation and the
      // machine truth drift together or not at all.
      const declaration = css.indexOf(`  ${pair.token}:`);
      expect(declaration, `${pair.token} declaration missing from tokens.css`).toBeGreaterThan(-1);
      const preceding = css.slice(0, declaration).trimEnd();
      const comment = preceding.slice(preceding.lastIndexOf('/*') + 2, preceding.lastIndexOf('*/'));
      expect(comment, `${pair.token} must carry a Restricted: comment`).toContain('Restricted:');
      expect(comment).toContain(pair.recorded.toFixed(3));
    }
  });

  it('exact color sets — 16 light semantics, 11 dark overrides (exhaustive, no drift)', () => {
    expect(Object.keys(colorTokens).sort()).toEqual(
      [
        '--tj-color-badge-purple',
        '--tj-color-card',
        '--tj-color-cta-fill',
        '--tj-color-cta-ink',
        '--tj-color-divider',
        '--tj-color-divider-strong',
        '--tj-color-engage',
        '--tj-color-gold',
        '--tj-color-gold-ink',
        '--tj-color-ink-100',
        '--tj-color-ink-200',
        '--tj-color-ink-300',
        '--tj-color-ink-reference-meta',
        '--tj-color-ink-reference-time',
        '--tj-color-link',
        '--tj-color-page',
      ].sort(),
    );
    expect(Object.keys(darkColorTokens).sort()).toEqual(
      [
        '--tj-color-card',
        '--tj-color-cta-fill',
        '--tj-color-cta-ink',
        '--tj-color-divider',
        '--tj-color-divider-strong',
        '--tj-color-engage',
        '--tj-color-ink-100',
        '--tj-color-ink-300',
        '--tj-color-ink-reference-meta',
        '--tj-color-link',
        '--tj-color-page',
      ].sort(),
    );
  });

  it('light aliases ride their scale values (link = gold-ink, engage = ink-reference-meta)', () => {
    expect(colorTokens['--tj-color-link']).toBe(colorTokens['--tj-color-gold-ink']);
    expect(colorTokens['--tj-color-engage']).toBe(colorTokens['--tj-color-ink-reference-meta']);
  });

  it('computes WCAG ratios per the spec definition (self-check)', () => {
    // White on black is exactly 21:1; black on black exactly 1:1.
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 2);
    expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1, 2);
    // Symmetric in argument order.
    expect(contrastRatio('#8A6519', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#8A6519'), 10);
    // Alpha-bearing backgrounds are rejected with guidance, not silently mis-measured.
    expect(() => contrastRatio('#FFFFFF', '#FFFFFF1A')).toThrow(/needs an explicit compositing base/);
  });
});
