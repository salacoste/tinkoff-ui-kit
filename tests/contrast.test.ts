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

/**
 * A generated rgba() literal (the v2 table-chrome extractions) → the equivalent
 * `#rrggbbaa` hex so composite() can consume it — the VALUE stays
 * generated-sourced (converted, never re-typed). Alpha rounds to 1/255 steps;
 * the composites this file pins are insensitive to that rounding.
 */
function rgbaLiteralToHex(value: string): string {
  const match = /^rgba\((\d+),(\d+),(\d+),(0?\.\d+|1)\)$/.exec(value);
  if (match === null) throw new Error(`contrast: not an rgba() literal: ${value}`);
  const [r, g, b] = match.slice(1, 4).map(Number);
  const alpha = Math.round(Number(match[4]) * 255);
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}${hex(alpha)}`;
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
  // --- 5.1–5.3 sweep extension: every RENDERED pair the kit-wide walk found
  // outside the table above (overlays, badge fills, the card tint pairings).
  // Light values from the generated colorTokens map; dark legs use ONLY the
  // generated darkColorTokens overrides — never re-typed here.
  // Light — overlay surfaces: toast/modal panel text, the tooltip pill, the badge stat fill.
  { theme: 'light', name: 'text-primary on surface-base (toast body / modal panel text)', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 12.635 },
  // Light — field fills: input text / select value / unselected segment label.
  { theme: 'light', name: 'text-primary on surface-field (input text / select value / segment label)', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-surface-field'], min: AA_TEXT, recorded: 11.126 },
  // Light — the select placeholder span (a REAL element axe measures — the
  // AA-override step; see select.css.ts and verify/select/NOTES.md).
  { theme: 'light', name: 'text-secondary (select placeholder) on surface-field', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-surface-field'], min: AA_TEXT, recorded: 4.962 },
  // Dark — the translucent field (#FFFFFF1A) composited onto dark surface-base
  // first (the test rejects alpha backgrounds; compositing stays generated-
  // sourced — both inputs come from the dark map).
  { theme: 'dark', name: 'text-primary on dark surface-field (composited on dark surface-base)', fg: dark('--tk-color-text-primary'), bg: composite(dark('--tk-color-surface-field'), dark('--tk-color-surface-base')), min: AA_TEXT, recorded: 13.009 },
  { theme: 'dark', name: 'text-secondary (select placeholder) on dark surface-field (composited)', fg: dark('--tk-color-text-secondary'), bg: composite(dark('--tk-color-surface-field'), dark('--tk-color-surface-base')), min: AA_TEXT, recorded: 7.303 },
  { theme: 'light', name: 'tooltip pill text (white) on ink-300 fill', fg: colorTokens['--tk-color-white'], bg: colorTokens['--tk-color-ink-300'], min: AA_TEXT, recorded: 12.635 },
  { theme: 'light', name: 'badge stat text (white) on ink-300 fill', fg: colorTokens['--tk-color-white'], bg: colorTokens['--tk-color-ink-300'], min: AA_TEXT, recorded: 12.635 },
  // Light — badge incentive: the 2.1 ink-on-green pair.
  { theme: 'light', name: 'badge incentive text-on-primary on green-100', fg: colorTokens['--tk-color-text-on-primary'], bg: colorTokens['--tk-color-green-100'], min: AA_TEXT, recorded: 4.742 },
  // Light — card tint pairings (promo/feature headings; descriptions are the secondary legs).
  { theme: 'light', name: 'text-primary on tint-gray (card default)', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-gray'], min: AA_TEXT, recorded: 11.596 },
  { theme: 'light', name: 'text-primary on tint-bluegray', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-bluegray'], min: AA_TEXT, recorded: 11.126 },
  { theme: 'light', name: 'text-primary on tint-mint', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-mint'], min: AA_TEXT, recorded: 10.772 },
  { theme: 'light', name: 'text-primary on tint-beige', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-beige'], min: AA_TEXT, recorded: 10.586 },
  { theme: 'light', name: 'text-secondary (card description) on tint-gray', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-tint-gray'], min: AA_TEXT, recorded: 5.172 },
  { theme: 'light', name: 'text-secondary (card description) on tint-bluegray', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-tint-bluegray'], min: AA_TEXT, recorded: 4.962 },
  { theme: 'light', name: 'text-secondary (card description) on tint-mint', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-tint-mint'], min: AA_TEXT, recorded: 4.804 },
  { theme: 'light', name: 'text-secondary (card description) on tint-beige', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-tint-beige'], min: AA_TEXT, recorded: 4.721 },
  // Light — card action links on tints (article/service cards; the on-tint step).
  { theme: 'light', name: 'link-on-tint (card action) on tint-gray', fg: colorTokens['--tk-color-link-on-tint'], bg: colorTokens['--tk-color-tint-gray'], min: AA_TEXT, recorded: 5.175 },
  { theme: 'light', name: 'link-on-tint (card action) on tint-bluegray', fg: colorTokens['--tk-color-link-on-tint'], bg: colorTokens['--tk-color-tint-bluegray'], min: AA_TEXT, recorded: 4.965 },
  { theme: 'light', name: 'link-on-tint (card action) on tint-mint', fg: colorTokens['--tk-color-link-on-tint'], bg: colorTokens['--tk-color-tint-mint'], min: AA_TEXT, recorded: 4.807 },
  { theme: 'light', name: 'link-on-tint (card action) on tint-beige', fg: colorTokens['--tk-color-link-on-tint'], bg: colorTokens['--tk-color-tint-beige'], min: AA_TEXT, recorded: 4.724 },
  // Light — the charcoal pair (theme-invariant tint): white text on charcoal cards.
  { theme: 'light', name: 'white on tint-charcoal (charcoal cards)', fg: colorTokens['--tk-color-white'], bg: colorTokens['--tk-color-tint-charcoal'], min: AA_TEXT, recorded: 12.635 },
  // Dark — card tint pairings on the first-pass dark tints (5.4 owns refinement; the pairs hold).
  { theme: 'dark', name: 'text-primary on dark tint-gray', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-gray'), min: AA_TEXT, recorded: 15.523 },
  { theme: 'dark', name: 'text-primary on dark tint-bluegray', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-bluegray'), min: AA_TEXT, recorded: 15.626 },
  { theme: 'dark', name: 'text-primary on dark tint-mint', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-mint'), min: AA_TEXT, recorded: 14.909 },
  { theme: 'dark', name: 'text-primary on dark tint-beige', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-beige'), min: AA_TEXT, recorded: 15.037 },
  { theme: 'dark', name: 'text-secondary (card description) on dark tint-gray', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-gray'), min: AA_TEXT, recorded: 8.352 },
  { theme: 'dark', name: 'text-secondary (card description) on dark tint-bluegray', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-bluegray'), min: AA_TEXT, recorded: 8.382 },
  { theme: 'dark', name: 'text-secondary (card description) on dark tint-mint', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-mint'), min: AA_TEXT, recorded: 8.091 },
  { theme: 'dark', name: 'text-secondary (card description) on dark tint-beige', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-beige'), min: AA_TEXT, recorded: 8.121 },
  // Dark — card action links on the dark tints (link-on-tint remaps to dark-link).
  { theme: 'dark', name: 'link-on-tint (card action) on dark tint-gray', fg: dark('--tk-color-link-on-tint'), bg: dark('--tk-color-tint-gray'), min: AA_TEXT, recorded: 6.097 },
  { theme: 'dark', name: 'link-on-tint (card action) on dark tint-bluegray', fg: dark('--tk-color-link-on-tint'), bg: dark('--tk-color-tint-bluegray'), min: AA_TEXT, recorded: 6.137 },
  { theme: 'dark', name: 'link-on-tint (card action) on dark tint-mint', fg: dark('--tk-color-link-on-tint'), bg: dark('--tk-color-tint-mint'), min: AA_TEXT, recorded: 5.856 },
  { theme: 'dark', name: 'link-on-tint (card action) on dark tint-beige', fg: dark('--tk-color-link-on-tint'), bg: dark('--tk-color-tint-beige'), min: AA_TEXT, recorded: 5.906 },
  // Theme-invariant (like the yellow pair above): the charcoal card's re-scoped
  // secondary CTA — the actions zone re-declares surface-base/text-primary to
  // white/ink-300 in BOTH themes (the 3.7 review-fix pair), so light-map
  // values are the truth in dark too.
  { theme: 'dark', name: 'invariant charcoal-card CTA pair (ink-300 label on white pill)', fg: colorTokens['--tk-color-ink-300'], bg: colorTokens['--tk-color-white'], min: AA_TEXT, recorded: 12.635 },
  // --- 6.1 v2 table semantics: deltas are the AA-override pattern in BOTH
  // themes. Light: the DESIGN.md references resolve to green-300/red-300 (the
  // site's #00A328/#F52222 fail on white — pinned in the rationale-anchors
  // test). Dark: first-pass values REQUIRED ≥4.5:1 on dark-base (green-100
  // clears as-is; the red is authored per the dark-error precedent).
  // SCOPE RULING: deltas are sanctioned on BASE surfaces only — the failing
  // composites (light green on hover/muted/field; dark red on hover/step-1)
  // are pinned with numbers in the rationale-anchors test; 6.2/6.4 hold
  // deltas on unhovered rows or re-derive at 8.2.
  { theme: 'light', name: 'delta-positive (green-300 reference) on surface-base', fg: colorTokens['--tk-color-delta-positive'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 4.587 },
  { theme: 'light', name: 'delta-negative (red-300 reference) on surface-base', fg: colorTokens['--tk-color-delta-negative'], bg: colorTokens['--tk-color-surface-base'], min: AA_TEXT, recorded: 6.179 },
  { theme: 'dark', name: 'dark delta-positive (green-100 first-pass) on dark surface-base', fg: dark('--tk-color-delta-positive'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 6.533 },
  { theme: 'dark', name: 'dark delta-negative (#F63434 first-pass) on dark surface-base', fg: dark('--tk-color-delta-negative'), bg: dark('--tk-color-surface-base'), min: AA_TEXT, recorded: 4.525 },
  // --- 6.1 v2 warm-cream pairs, both themes. RULING (the v1 on-tint
  // precedent — a failing pair is dropped WITH a recorded ruling, never
  // silently omitted): text-secondary on tint-cream-raised computes 4.306:1
  // and FAILS 4.5:1 — the pair is NOT sanctioned; on raised cream use
  // text-primary. The failing ratio is pinned in the rationale-anchors test.
  { theme: 'light', name: 'text-primary on tint-cream (cream card)', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-cream'], min: AA_TEXT, recorded: 10.911 },
  { theme: 'light', name: 'text-secondary (cream card description) on tint-cream', fg: colorTokens['--tk-color-text-secondary'], bg: colorTokens['--tk-color-tint-cream'], min: AA_TEXT, recorded: 4.866 },
  { theme: 'light', name: 'text-primary on tint-cream-raised (raised cream card)', fg: colorTokens['--tk-color-text-primary'], bg: colorTokens['--tk-color-tint-cream-raised'], min: AA_TEXT, recorded: 9.655 },
  { theme: 'dark', name: 'text-primary on dark tint-cream', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-cream'), min: AA_TEXT, recorded: 15.895 },
  { theme: 'dark', name: 'text-secondary (cream card description) on dark tint-cream', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-cream'), min: AA_TEXT, recorded: 8.461 },
  { theme: 'dark', name: 'text-primary on dark tint-cream-raised', fg: dark('--tk-color-text-primary'), bg: dark('--tk-color-tint-cream-raised'), min: AA_TEXT, recorded: 14.68 },
  { theme: 'dark', name: 'text-secondary (cream card description) on dark tint-cream-raised', fg: dark('--tk-color-text-secondary'), bg: dark('--tk-color-tint-cream-raised'), min: AA_TEXT, recorded: 7.989 },
  // --- 9.1 stepper badge brown: the measured reference value (#8D6040) lands
  // as its own token — theme-invariant (the charcoal mold, no dark override;
  // the dark rows would be the same numbers by construction). REQUIRED: the
  // white numeral on brown, and the badge fill against the page cream.
  // RECORDED-FAILING: brown on raised cream — the badge never sits there
  // (its card-top overlap is white); pinned in the rationale-anchors test.
  { theme: 'light', name: 'stepper badge numeral (white on tint-brown)', fg: colorTokens['--tk-color-white'], bg: colorTokens['--tk-color-tint-brown'], min: AA_TEXT, recorded: 5.413 },
  { theme: 'light', name: 'stepper badge fill (tint-brown) on page tint-cream', fg: colorTokens['--tk-color-tint-brown'], bg: colorTokens['--tk-color-tint-cream'], min: AA_TEXT, recorded: 4.674 },
];

describe('WCAG AA contrast — mechanized DESIGN.md table (spec 1.3)', () => {
  it('consumes the generated darkColorTokens map with all 23 semantic overrides', () => {
    // Named guard: if generation drops or shrinks the dark map, this fails
    // here instead of surfacing as lookup noise in the pair tests.
    expect(Object.keys(darkColorTokens)).toHaveLength(23);
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
    // Site delta anchors (6.1, invest/stocks — recorded in DESIGN.md Colors,
    // "Table delta semantics"; not palette entries) — why BOTH delta
    // semantics override: each fails 4.5:1 on white.
    expect(contrastRatio('#00A328', colorTokens['--tk-color-surface-base'])).toBeCloseTo(3.35, 3);
    expect(contrastRatio('#F52222', colorTokens['--tk-color-surface-base'])).toBeCloseTo(4.09, 3);
    // The site delta red fails on dark-base too (4.255:1) — why dark-delta-
    // negative is authored rather than reusing the extraction. The scale steps
    // it would alias fail as well: green-300 3.794:1, red-100 3.630:1 on dark.
    expect(contrastRatio('#F52222', dark('--tk-color-surface-base'))).toBeCloseTo(4.255, 3);
    expect(contrastRatio(colorTokens['--tk-color-green-300'], dark('--tk-color-surface-base'))).toBeCloseTo(3.794, 3);
    expect(contrastRatio(colorTokens['--tk-color-red-100'], dark('--tk-color-surface-base'))).toBeCloseTo(3.63, 3);
    // Delta surface scope (6.1 triage — same ruling style as the cream pin
    // below): deltas are sanctioned on BASE surfaces only; every other real
    // table surface fails AA for at least one leg per theme. Pinned so the
    // ruling has numbers, never a silent omission: the light green fails
    // everywhere off base; the light red clears all three legs (recorded the
    // passing way); the dark red fails on both composites; the dark green
    // holds on both (recorded the passing way).
    const lightHover = composite(
      rgbaLiteralToHex(colorTokens['--tk-color-surface-row-hover']),
      colorTokens['--tk-color-surface-base'],
    );
    expect(lightHover.toLowerCase()).toBe('#f2f4f7');
    expect(contrastRatio(colorTokens['--tk-color-delta-positive'], lightHover)).toBeCloseTo(4.163, 3);
    expect(contrastRatio(colorTokens['--tk-color-delta-positive'], colorTokens['--tk-color-surface-muted'])).toBeCloseTo(4.21, 3);
    expect(contrastRatio(colorTokens['--tk-color-delta-positive'], colorTokens['--tk-color-surface-field'])).toBeCloseTo(4.039, 3);
    expect(contrastRatio(colorTokens['--tk-color-delta-negative'], lightHover)).toBeCloseTo(5.608, 3);
    expect(contrastRatio(colorTokens['--tk-color-delta-negative'], colorTokens['--tk-color-surface-muted'])).toBeCloseTo(5.671, 3);
    expect(contrastRatio(colorTokens['--tk-color-delta-negative'], colorTokens['--tk-color-surface-field'])).toBeCloseTo(5.441, 3);
    const darkHover = composite(dark('--tk-color-surface-row-hover'), dark('--tk-color-surface-base'));
    expect(darkHover).toBe('#313131');
    expect(contrastRatio(dark('--tk-color-delta-negative'), darkHover)).toBeCloseTo(3.382, 3);
    expect(contrastRatio(dark('--tk-color-delta-negative'), dark('--tk-color-surface-muted'))).toBeCloseTo(4.136, 3);
    expect(contrastRatio(dark('--tk-color-delta-positive'), darkHover)).toBeCloseTo(4.883, 3);
    expect(contrastRatio(dark('--tk-color-delta-positive'), dark('--tk-color-surface-muted'))).toBeCloseTo(5.972, 3);
    // Cream ruling (6.1): text-secondary on tint-cream-raised FAILS 4.5:1 —
    // the pair is not sanctioned (use text-primary there); pinned here so the
    // ruling has a number, per the no-silent-omission rule.
    expect(contrastRatio(colorTokens['--tk-color-text-secondary'], colorTokens['--tk-color-tint-cream-raised'])).toBeCloseTo(4.306, 3);
    // Brown ruling (9.1): tint-brown on tint-cream-raised FAILS 4.5:1 — the
    // stepper badge never sits on raised cream (its card-top overlap is
    // white); pinned so the ruling has a number, never a silent omission.
    expect(contrastRatio(colorTokens['--tk-color-tint-brown'], colorTokens['--tk-color-tint-cream-raised'])).toBeCloseTo(4.136, 3);
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
