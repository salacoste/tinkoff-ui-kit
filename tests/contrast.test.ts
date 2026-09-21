import { describe, expect, it } from 'vitest';

import { colorTokens, darkColorTokens } from '../packages/tokens/src/tokens.js';

/**
 * Mechanized AA-contrast table (spec 1.3): every pair from the DESIGN.md
 * Colors "AA contrast adjustments" table — plus the spec's dark additions —
 * is asserted against its WCAG 2.1 threshold with the exact computed ratio
 * recorded to 3 decimals. A pair fails the suite naming the pair and the
 * computed ratio; a value change that shifts a ratio breaks the recorded
 * pin, so drift has to be re-recorded deliberately.
 *
 * Math (spec 1.3 Design Notes): relative luminance per the WCAG spec
 * (sRGB linearization, 0.2126/0.7152/0.0722 weights), ratio =
 * (L1+0.05)/(L2+0.05). Alpha-bearing values (the dark white-alpha text trio)
 * are composited onto their stated background in sRGB space BEFORE the ratio
 * is computed; an alpha-bearing BACKGROUND is rejected outright — it is
 * ambiguous without an explicit compositing base.
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

/** Alpha-composite fg onto bg in sRGB space — required before any ratio (spec 1.3 Design Notes). */
function composite(fgHex: string, bgHex: string): string {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  const mix = (a: number, b: number) => Math.round(a * fg.alpha + b * (1 - fg.alpha));
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(mix(fg.rgb[0], bg.rgb[0]))}${hex(mix(fg.rgb[1], bg.rgb[1]))}${hex(mix(fg.rgb[2], bg.rgb[2]))}`;
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).rgb;
  const linearize = (channel: number) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG 2.1 contrast ratio; alpha-bearing fg is composited onto bg first.
 * Alpha-bearing backgrounds abort: the ratio depends on what lies beneath,
 * which only the caller knows.
 */
function contrastRatio(fgHex: string, bgHex: string): number {
  if (parseHex(bgHex).alpha < 1) {
    throw new Error(
      `contrast: alpha-bearing background '${bgHex}' needs an explicit compositing base — composite it onto its surface first, then compare the opaque results`,
    );
  }
  const fg = parseHex(fgHex).alpha < 1 ? composite(fgHex, bgHex) : fgHex;
  const l1 = luminance(fg);
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
  // Light — DESIGN.md AA table, extracted pairs that pass as-is.
  { theme: 'light', name: 'ink-300 text on yellow-100 primary fill', fg: colorTokens['--tk-color-ink-300'], bg: colorTokens['--tk-color-yellow-100'], min: AA_TEXT, recorded: 9.405 },
  { theme: 'light', name: 'white text on ink-300 inverse fill', fg: colorTokens['--tk-color-white'], bg: colorTokens['--tk-color-ink-300'], min: AA_TEXT, recorded: 12.635 },
  // Light — AA-overridden semantics (the override values themselves must pass).
  // text-secondary computes 5.635:1 (DESIGN.md records the same pair as 5.64 — rounding).
  { theme: 'light', name: 'text-secondary on surface-base', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 5.635 },
  { theme: 'light', name: 'link (blue-100 alias) on surface-base', fg: colorTokens['--tk-color-link'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 4.624 },
  { theme: 'light', name: 'link-on-tint on surface-field', fg: colorTokens['--tk-color-link-on-tint'], bg: colorTokens['--tk-color-surface-field'], min: AA_TEXT, recorded: 4.965 },
  // Light — error semantics: red-100 carries base, red-200 carries field/muted.
  { theme: 'light', name: 'error (red-100 alias) on surface-base', fg: colorTokens['--tk-color-error'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 4.795 },
  { theme: 'light', name: 'error-on-field on surface-field', fg: colorTokens['--tk-color-error-on-field'], bg: colorTokens['--tk-color-surface-field'], min: AA_TEXT, recorded: 4.787 },
  { theme: 'light', name: 'error-on-field on surface-muted', fg: colorTokens['--tk-color-error-on-field'], bg: colorTokens['--tk-color-surface-muted'], min: AA_TEXT, recorded: 4.990 },
  // Light — focus ring is non-text UI: 1.4.11 requires 3:1 against adjacent surfaces.
  { theme: 'light', name: 'focus-ring vs surface-base', fg: colorTokens['--tk-color-focus-ring'], bg: colorTokens['--tk-color-surface-base'], min: AA_NON_TEXT, recorded: 4.624 },
  { theme: 'light', name: 'focus-ring vs surface-muted', fg: colorTokens['--tk-color-focus-ring'], bg: colorTokens['--tk-color-surface-muted'], min: AA_NON_TEXT, recorded: 4.244 },
  { theme: 'light', name: 'focus-ring vs surface-field', fg: colorTokens['--tk-color-focus-ring'], bg: colorTokens['--tk-color-surface-field'], min: AA_NON_TEXT, recorded: 4.072 },
  // Dark — white-alpha text trio composited on both dark surfaces.
  { theme: 'dark', name: 'text-primary on dark surface-base', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 17.404 },
  { theme: 'dark', name: 'text-primary on dark surface-muted (tonal step 1)', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-surface-muted'), min: AA_TEXT, recorded: 15.910 },
  { theme: 'dark', name: 'text-secondary #FFFFFFB3 composited on dark surface-base', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 9.066 },
  { theme: 'dark', name: 'text-secondary #FFFFFFB3 composited on dark surface-muted', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-surface-muted'), min: AA_TEXT, recorded: 8.468 },
  { theme: 'dark', name: 'text-muted #FFFFFF80 composited on dark surface-base', fg: dark('--tk-color-text-muted'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 5.244 },
  { theme: 'dark', name: 'text-muted #FFFFFF80 composited on dark surface-muted', fg: dark('--tk-color-text-muted'), bg: dark('--tk-color-surface-muted'), min: AA_TEXT, recorded: 5.048 },
  // Dark — added link/error semantics (blue-100 fails in dark; dark-link/dark-error are the AA additions).
  { theme: 'dark', name: 'dark link on dark surface-base', fg: dark('--tk-color-link'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 6.836 },
  { theme: 'dark', name: 'dark error on dark surface-base', fg: dark('--tk-color-error'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 6.910 },
  { theme: 'dark', name: 'dark error-on-field on dark surface-muted (tonal step 1)', fg: dark('--tk-color-error-on-field'), bg: dark('--tk-color-surface-muted'), min: AA_TEXT, recorded: 6.317 },
  // Dark — focus ring, non-text 3:1 against adjacent dark surfaces.
  { theme: 'dark', name: 'focus-ring vs dark surface-base', fg: dark('--tk-color-focus-ring'), bg: dark('--tk-color-surface-base'), min: AA_NON_TEXT, recorded: 6.836 },
  { theme: 'dark', name: 'focus-ring vs dark surface-muted', fg: dark('--tk-color-focus-ring'), bg: dark('--tk-color-surface-muted'), min: AA_NON_TEXT, recorded: 6.249 },
  // Dark — the yellow invariant: primary CTA keeps ink text, identical ratio by construction.
  { theme: 'dark', name: 'invariant text-on-primary on unchanged yellow-100', fg: colorTokens['--tk-color-text-on-primary'], bg: colorTokens['--tk-color-yellow-100'], min: AA_TEXT, recorded: 9.405 },
];

describe('WCAG AA contrast — mechanized DESIGN.md table (spec 1.3)', () => {
  it('consumes the generated darkColorTokens map with all 17 semantic overrides', () => {
    // Named guard: if generation drops or shrinks the dark map, this fails
    // here instead of surfacing as lookup noise in the pair tests.
    expect(Object.keys(darkColorTokens)).toHaveLength(17);
  });

  it.each(AA_PAIRS)('$theme: $name', (pair) => {
    const actual = contrastRatio(pair.fg, pair.bg);
    expect(
      actual,
      `${pair.theme} pair '${pair.name}': computed ${actual.toFixed(3)}:1, required >= ${pair.min}:1 (${pair.fg} on ${pair.bg})`,
    ).toBeGreaterThanOrEqual(pair.min);
    expect(
      actual,
      `${pair.theme} pair '${pair.name}': computed ${actual.toFixed(3)}:1, recorded ${pair.recorded}:1 — token values drifted; re-record deliberately`,
    ).toBeCloseTo(pair.recorded, 3);
  });

  it('records the failing extracted pairs that motivated each AA override (rationale anchors)', () => {
    // gray-500 #79818C — the site's own text-secondary, replaced by gray-600 (see light pairs).
    expect(contrastRatio(colorTokens['--tk-color-gray-500'], colorTokens['--tk-color-surface-base'])).toBeCloseTo(3.939, 3);
    // blue-100 on light fields — why link-on-tint exists.
    expect(contrastRatio(colorTokens['--tk-color-blue-100'], colorTokens['--tk-color-surface-field'])).toBeCloseTo(4.072, 3);
    // yellow-100 vs white — why yellow state indicators are always redundant (DESIGN.md AA table).
    expect(contrastRatio(colorTokens['--tk-color-yellow-100'], colorTokens['--tk-color-surface-base'])).toBeCloseTo(1.343, 3);
    // blue-100 on dark-base — why dark-link exists (the light link color fails AA in dark).
    expect(contrastRatio(colorTokens['--tk-color-blue-100'], dark('--tk-color-surface-base'))).toBeCloseTo(3.764, 3);
    // border-default on white — why the unified focus ring exists (an invisible ring, 1.4.11 fails).
    expect(contrastRatio(colorTokens['--tk-color-border-default'], colorTokens['--tk-color-surface-base'])).toBeCloseTo(1.226, 3);
  });

  it('computes WCAG ratios per the spec definition (self-check)', () => {
    // White on black is exactly 21:1; black on black exactly 1:1.
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 2);
    expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1, 2);
    // Symmetric in argument order.
    expect(contrastRatio('#333333', '#FFDD2D')).toBeCloseTo(contrastRatio('#FFDD2D', '#333333'), 10);
    // Alpha compositing: 0% and 100% alpha collapse to the background/foreground.
    expect(contrastRatio('#FFFFFF00', '#1A1A1A')).toBeCloseTo(1, 2);
    expect(contrastRatio('#FFFFFF', '#1A1A1A')).toBeCloseTo(contrastRatio('#FFFFFFFF', '#1A1A1A'), 10);
    // Alpha-bearing backgrounds are rejected with guidance, not silently mis-measured.
    expect(() => contrastRatio('#FFFFFF', '#FFFFFF1A')).toThrow(/needs an explicit compositing base/);
  });
});
