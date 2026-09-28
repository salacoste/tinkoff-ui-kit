#!/usr/bin/env node
/**
 * pillkit-tokens — generation CLI (Stories 1.2–1.3, AD-3; config-ized onto the
 * shared core in story 15.2 — ONE mechanism, TWO inputs).
 *
 * The MECHANISM lives at the repo root (scripts/token-gen/core.mjs, the
 * ad4-matrix.mjs precedent for root shared tooling): parse/validate, the value
 * grammar, `{block.ref}` resolution, the dark-layer mapping model, the
 * aa-annotations derivation, and the CSS/TS/MD renderers — all pure functions
 * parameterized by a per-kit config. THIS file is the bank's thin input: the
 * config literals below (prefix, theme attribute, semantic tables, prose) and
 * the CLI wrapper. The ТЖ family's twin lives at
 * packages/tj-tokens/scripts/generate.mjs with its own config on the same core.
 * The import is build-time only (scripts/, not src/ — outside the AD-4 scan
 * roots; tokens stays the bank lane's runtime root).
 *
 * DESIGN.md frontmatter is the sole source of truth for token values. The core
 * renders three committed artifacts:
 *
 *   src/tokens.css — the light `--tk-*` layer on `:host, :root` (shadow-root usable)
 *                    plus the dark layer on `:host([data-theme="dark"]),
 *                    :root[data-theme="dark"]` (Story 1.3)
 *   src/tokens.ts  — typed token name/value maps for programmatic access
 *   src/TOKENS.md  — the canonical listing (value, source block, assumption flags,
 *                    z-scale + motion-mapping rationale, dark override table)
 *
 * The render step is a pure, importable function (`renderArtifacts(designText)`);
 * the CLI below is a thin wrapper that reads DESIGN.md and writes the files.
 * tests/tokens-drift.test.ts imports the renderer to prove the committed
 * artifacts equal a fresh render — DESIGN.md edits cannot land silently.
 *
 * Invariants:
 * - Deterministic: regenerating an unchanged DESIGN.md is byte-stable
 *   (`pnpm check:tokens-drift` proves it). The 15.2 refactor is itself pinned
 *   by that byte-identity: the config-ization changed NOTHING in the output.
 * - Loud failures: anything unexpected aborts rendering (thrown Error from the
 *   pure function; exit 1 from the CLI) instead of being guessed around.
 * - The `components:` frontmatter block is consumer spec prose — never rendered.
 * - The `aa-annotations:` frontmatter block (story 9.2) is the machine source
 *   for every AA-bearing color note — the notes DERIVE from it (prefix from
 *   kind, [ASSUMPTION] flag from status) and each must anchor in the Colors
 *   body via a factual substring; anchor lost → abort.
 * - `dark-*` color entries are the palette SOURCE for the dark layer's semantic
 *   overrides — never emitted as `--tk-color-dark-*` custom properties, never
 *   rendered into the light layer. Every `dark-*` key must be consumed by
 *   DARK_OVERRIDES or DARK_DEFERRED or generation aborts (no silent drops).
 * - Never hand-edit the artifacts; change DESIGN.md and regenerate.
 * - Colors-block values are hex literals, verbatim `rgba()` extractions, or
 *   `{colors.<key>}` references (Story 6.1) — references resolve transitively
 *   to their terminal literal (missing targets and cycles abort naming the
 *   key), and emitted declarations always carry the RESOLVED value.
 */
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createTokenGenerator } from '../../../scripts/token-gen/core.mjs';

const DESIGN_MD = fileURLToPath(
  new URL(
    '../../../_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md',
    import.meta.url,
  ),
);
const OUT_CSS = fileURLToPath(new URL('../src/tokens.css', import.meta.url));
const OUT_TS = fileURLToPath(new URL('../src/tokens.ts', import.meta.url));
const OUT_MD = fileURLToPath(new URL('../src/TOKENS.md', import.meta.url));

// ---------------------------------------------------------------------------
// Bank config — every kit-specific literal the core parameterizes on (story
// 15.2). These are the former module-level literals of this file, unchanged;
// the core's job is to make them the ONLY thing that differs per kit.
// ---------------------------------------------------------------------------

/**
 * Scaffold semantic aliases — `link`/`error` exist as semantic names in BOTH
 * themes (Story 1.3): components consume semantics, not scales (AD-2/AD-3
 * discipline), and the dark layer could not override a name the light layer
 * never declares. `error-on-field` mirrors the link-on-tint precedent for the
 * error scale: red-100 fails AA on field/muted surfaces, red-200 carries them.
 * Values alias the extracted functional scales; every alias carries a
 * TOKEN_NOTES annotation and is equality-checked in assertAnnotationConsistency.
 */
const LIGHT_SEMANTIC_ALIASES = [
  { name: '--tk-color-link', scale: 'blue-100' },
  { name: '--tk-color-error', scale: 'red-100' },
  { name: '--tk-color-error-on-field', scale: 'red-200' },
];

/**
 * DARK_OVERRIDES — the dark layer re-declares SEMANTIC names only, sourced from
 * the DESIGN.md `dark-*` palette (spec 1.3 mapping, frozen after approval):
 * tonal surfaces replacing shadows, white-alpha text trio, dark link/error/
 * focus, derived dark tints. The `dark-*` keys are the palette SOURCE — never
 * emitted as `--tk-color-dark-*`. `border-strong` is the one derived value:
 * DESIGN.md defines no dark border-strong, so `#FFFFFF3D` lifts dark-border
 * (24-hex ≈ 14% white) +12% toward opaque — anchored by an assert below.
 */
const DARK_OVERRIDES = [
  { name: '--tk-color-surface-base', source: 'dark-base' },
  { name: '--tk-color-surface-muted', source: 'dark-surface-1' },
  { name: '--tk-color-surface-field', source: 'dark-field' },
  { name: '--tk-color-border-default', source: 'dark-border' },
  { name: '--tk-color-border-strong', source: 'dark-border', derived: '#FFFFFF3D' },
  { name: '--tk-color-text-primary', source: 'dark-text-primary' },
  { name: '--tk-color-text-secondary', source: 'dark-text-secondary' },
  { name: '--tk-color-text-muted', source: 'dark-text-muted' },
  { name: '--tk-color-focus-ring', source: 'dark-focus-ring' },
  { name: '--tk-color-link', source: 'dark-link' },
  { name: '--tk-color-error', source: 'dark-error' },
  { name: '--tk-color-link-on-tint', source: 'dark-link' },
  { name: '--tk-color-error-on-field', source: 'dark-error' },
  { name: '--tk-color-tint-gray', source: 'dark-tint-gray' },
  { name: '--tk-color-tint-bluegray', source: 'dark-tint-bluegray' },
  { name: '--tk-color-tint-mint', source: 'dark-tint-mint' },
  { name: '--tk-color-tint-beige', source: 'dark-tint-beige' },
  // v2 additions (Story 6.1, VERIFIED by the 8.2 dark sweep — the 5.4 rule):
  // the warm-cream tint pair continues the tint block; the table-semantics
  // quartet (deltas, divider, row hover) maps the four v2 dark palette keys.
  // All six HELD with computed evidence (DARK_TOKEN_NOTES carry the numbers).
  { name: '--tk-color-tint-cream', source: 'dark-tint-cream' },
  { name: '--tk-color-tint-cream-raised', source: 'dark-tint-cream-raised' },
  { name: '--tk-color-delta-positive', source: 'dark-delta-positive' },
  { name: '--tk-color-delta-negative', source: 'dark-delta-negative' },
  { name: '--tk-color-border-table', source: 'dark-border-table' },
  { name: '--tk-color-surface-row-hover', source: 'dark-surface-row-hover' },
];

/**
 * dark-* palette keys deliberately NOT emitted by this layer — every key must
 * still be accounted for here or generation aborts (no silent drops). The tonal
 * steps get semantic homes when their consuming stories land; dark-tint-charcoal
 * is the documented charcoal invariant (asserted equal to the light value).
 */
const DARK_DEFERRED = new Map([
  [
    'dark-surface-2',
    'tonal elevation step 2 — no semantic consumer yet; emitted when overlay/component stories define raised dark surface slots (Epic 2 overlays / Story 5.4 refinement), never as --tk-color-dark-*',
  ],
  [
    'dark-surface-3',
    'tonal elevation step 3 — DESIGN.md reserves it for Modal-in-dark ("dark theme tonal step 3"); emitted when Modal lands, never as --tk-color-dark-*',
  ],
  [
    'dark-elevated',
    'highest tonal step — reserved for elevated dark chrome; emitted when its consuming component lands, never as --tk-color-dark-*',
  ],
  [
    'dark-tint-charcoal',
    'theme-invariant — charcoal equals the light value (equality asserted at generation); no dark override is emitted',
  ],
  [
    'dark-tint-brown',
    'theme-invariant (charcoal mold, story 9.1) — brown equals the light value (equality asserted at generation); the stepper badge keeps its brown fill + white numeral in dark, no dark override is emitted',
  ],
]);

/** Semantic names deliberately NOT re-declared in dark — they keep their light values. */
const DARK_INVARIANTS = [
  { name: '--tk-color-text-on-primary', why: 'yellow keeps ink text in dark (DESIGN.md Colors)' },
  { name: '--tk-color-tint-charcoal', why: 'charcoal tint is theme-invariant (DESIGN.md Colors)' },
  { name: '--tk-color-tint-brown', why: 'brown tint is theme-invariant — the stepper badge keeps its fill + white numeral in dark (DESIGN.md Colors, story 9.1)' },
];

/**
 * Dark-layer design-intent annotations — rendered as comments in the dark block
 * and the Notes column of the TOKENS.md dark table. Facts stated here are
 * anchored by asserts in the core's darkLayerModel (via darkAsserts below) so
 * annotations cannot drift.
 */
const DARK_TOKEN_NOTES = new Map([
  [
    '--tk-color-border-strong',
    'Derived — DESIGN.md defines no dark border-strong; `#FFFFFF3D` = dark-border `#FFFFFF24` (24-hex ≈ 14% white) lifted +12% toward opaque. Story 1.3 scaffolding decision, not an extraction.',
  ],
  [
    '--tk-color-link-on-tint',
    'Alias — dark reuses `dark-link` (the light-only on-tint step exists because blue-100 fails on light fields).',
  ],
  [
    '--tk-color-error-on-field',
    'Alias — dark reuses `dark-error` (the light-only on-field step exists because red-100 fails on light field/muted surfaces).',
  ],
  [
    '--tk-color-tint-gray',
    'Verified — Story 5.4 dark sweep: Lab L* 14.2, OKLCH L 26.0% C 0.000 (achromatic, like the light tint); held — 1.8 pt under the rule window, inside the 2-pt correction threshold; sits between tonal steps 1–2 (content tint, not elevated chrome). DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-bluegray',
    'Verified — Story 5.4 dark sweep: Lab L* 13.9, OKLCH L 25.8%, hue 255.7° vs light 252.8° (Δ2.9° — kept); held — 2.06 pt under the window exceeds the 2-pt threshold by 0.06 but fails the visually-meaningful conjunct (sub-JND, safer direction: darker tint, more text contrast). DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-mint',
    'Verified — Story 5.4 dark sweep: Lab L* 15.7, OKLCH L 27.1%, hue 175.1° vs light 192.4° (Δ17.3° — within the recorded ±20° tolerance at C ≤ 0.04); held — 0.3 pt under the window. DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-beige',
    'Verified — Story 5.4 dark sweep: Lab L* 15.4, OKLCH L 27.1%, hue 78.1° vs light 93.8° (Δ15.7° — within the recorded ±20° tolerance at C ≤ 0.04); held — 0.6 pt under the window. DESIGN.md Colors.',
  ],
  // v2 additions (Story 6.1, verified by the 8.2 dark sweep — the 5.4 rule):
  // all six first-pass values HELD with computed evidence (Lab/OKLCH tint
  // derivation, three-surface delta AA scope, white-alpha composites); the
  // arithmetic lives in .playwright-cli/verify/dark-sweep/ledger.md.
  [
    '--tk-color-tint-cream',
    'Verified — Story 8.2 dark sweep: Lab L* 13.26, OKLCH 25.2% C 0.004 H 84.6° vs light 84.6° (Δ0.0° — hue exact); held — 2.74 pt under the 16–20 window, but the correction fails the meaningful conjunct twice: the only in-window landing sits ≤0.3 L* from the raised sibling (the page→card step would collapse sub-JND) and the value mirrors the light pair\'s page≈muted-lightness relationship (surface-muted dark `#222222` = Lab 13.2 ≈ 13.26 — warm hue is the differentiator, as in light). AA holds: text-primary 15.895:1 / text-secondary 8.461:1 (tests/contrast.test.ts). DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-cream-raised',
    'Verified — Story 8.2 dark sweep: Lab L* 16.27 — INSIDE the 16–20 window; OKLCH 27.8% C 0.010 H 80.6° vs light 80.7° (Δ0.1°); pair step page→raised = Δ3.0 L* (25.2→27.8% OKLCH), a clean tonal elevation. AA holds: text-primary 14.680:1 / text-secondary 7.989:1 (tests/contrast.test.ts). DESIGN.md Colors.',
  ],
  [
    '--tk-color-delta-positive',
    'Verified — Story 8.2 dark sweep: `#39B54A` clears AA on ALL three real dark surfaces — base 6.533:1, tonal step 1 5.972:1, row-hover composite `#313131` 4.883:1 (confirmed live on the story DOM — the delta verdict legs of tests/visual/dark-sweep.spec.ts; pins tests/contrast.test.ts:284-285). Sourced from green-100: the existing lightest green step clears as-is, no value authored (green-300, the light override, measures 3.794:1 in dark). Site anchors live in DESIGN.md Colors (Table delta semantics).',
  ],
  [
    '--tk-color-delta-negative',
    'Verified — Story 8.2 dark sweep: `#F63434` clears AA on the sanctioned dark base only (4.525:1); the row-hover composite `#313131` 3.382:1 and tonal step 1 `#222222` 4.136:1 FAIL — the closed 6.1 scope ruling (deltas sanctioned on base surfaces; composite failures PINNED, never silent — contrast.test.ts:282-283, confirmed live on the story DOM by the delta verdict legs). A hover-clearing red exists numerically (`#FF7B74` = 5.165:1 on `#313131`) but sits +12.7 L* into the pastel error family — not a delta red; the least-lightened AA value stays (no red scale step passes: red-100 = 3.630:1, site `#F52222` = 4.255:1 on base, worse). Site anchors live in DESIGN.md Colors (Table delta semantics).',
  ],
  [
    '--tk-color-border-table',
    'Verified — Story 8.2 dark sweep: `#FFFFFF1F` composites to `#363636` on dark-base (Lab 22.6, Δ+13.4 — a visible hairline) and `#3D3D3D` on tonal step 1; 1.8 L* under the dark-border composite `#3A3A3A` — the documented one-step-under divider grammar (dividers quieter than control borders). 0x1F ≈ 12% white mirrors light rgba(0,16,36,0.12). Decorative structure (non-text; 1.4.11 does not apply). DESIGN.md Colors.',
  ],
  [
    '--tk-color-surface-row-hover',
    'Verified — Story 8.2 dark sweep: `#FFFFFF1A` composites to `#313131` on dark-base (pinned tests/contrast.test.ts:281) — Δ+11.1 L* over base, a visible-but-gentle transient step; the row\'s text pairs on the composite pass (text-primary 13.009:1, text-secondary 7.303:1) and the delta pair rides the 6.1 scope ruling (3.382/4.883 — the negative leg\'s documented state, confirmed live). Same 10% white as the dark-field fill family. DESIGN.md Colors.',
  ],
]);

/**
 * Z-scale — scaffold mechanics, not a DESIGN.md extraction. Stacking order is
 * fixed by AD-12 usage (z-order comes only from --tk-z-*; the shared overlay
 * controller owns every floating surface); values leave one spare slot between
 * layers so future surfaces never collide with neighbors.
 */
const Z_SCALE = [
  { name: '--tk-z-nav', value: '100', layer: 'sticky site chrome (Navbar)' },
  { name: '--tk-z-dropdown', value: '200', layer: 'select menus, dropdown menus' },
  { name: '--tk-z-popover', value: '300', layer: 'popovers, floating panels' },
  { name: '--tk-z-tooltip', value: '400', layer: 'tooltips — above the popovers they annotate' },
  { name: '--tk-z-modal', value: '500', layer: 'modal dialogs (focus-trapped)' },
  { name: '--tk-z-toast', value: '600', layer: 'toasts — transient, above modals' },
];

/**
 * Design-intent annotations recorded at capture time — the LITERAL residue.
 * Story 9.2 moved every AA-BEARING note (a contrast ratio or an AA ruling in
 * its text) into the DESIGN.md `aa-annotations:` frontmatter block; the notes
 * are DERIVED from it in the core's aaAnnotationsModel and merged into the live
 * TOKEN_NOTES map at render time. What stays a literal here BY DESIGN:
 * semantic-alias stories (link/error — alias equalities, no AA facts),
 * probe-closure Verified Shapes/Colors entries (mint/beige — measured values,
 * no AA ruling), verbatim-extract entries (border-table/surface-row-hover —
 * decorative structure, no AA ruling), and BLOCK_NOTE_SPACING below. Both
 * migration directions abort: a literal for a name also in the block is a
 * double source; any AA-bearing literal without a block entry aborts (the
 * class test lives in isAaBearing). Exported for the migration self-checks in
 * tests/tokens-drift.test.ts.
 */
export const TOKEN_NOTE_LITERALS = new Map([
  [
    '--tk-color-link',
    'Semantic alias — `blue-100`, added in Story 1.3: components consume semantics, not scales (AD-2/AD-3), and the dark layer needs a semantic name to override (`dark-link`). DESIGN.md Colors (TextLink).',
  ],
  [
    '--tk-color-error',
    'Semantic alias — `red-100`, added in Story 1.3 alongside `link` so both themes expose error semantics (the dark layer overrides it with `dark-error`). DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-mint',
    'Verified — Story 3.6 closure: measured `#D0F4F2` on the reference ОСАГО card (computed style + native-zoom crop, Story 2.0 capture pack), replacing the vision-inventory estimate. DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-beige',
    'Verified — Story 3.6 closure: measured `#F1EBD6` on the reference Т-Образование card (computed style + native-zoom crop, Story 2.0 capture pack), replacing the vision-inventory estimate. DESIGN.md Colors.',
  ],
  [
    '--tk-radius-xl',
    'Verified — Story 5.6 closure: pixel-probe of the archived service-card capture (Story 2.0 pack, DPR 1) measures 24px — the arc staircase is pixel-identical to the kit\'s 24px render; the 3.8 ~24 reading confirmed. DESIGN.md Shapes.',
  ],
  [
    '--tk-radius-xxl',
    'Verified — Story 5.6 closure: pixel-probes of the archived card captures measure 22–24px (two sub-signatures within the band — banners 21.9–22.2, tiles 23.5–23.9 — collapsed to one token); the 32px vision estimate is corrected to the measured card radius — xxl equals xl. DESIGN.md Shapes.',
  ],
  [
    '--tk-color-border-table',
    'Extracted verbatim (v2, invest/stocks table divider) — `rgba(0,16,36,0.12)`; decorative structure (non-text), dark first-pass in the dark layer. DESIGN.md Colors (Table delta semantics).',
  ],
  [
    '--tk-color-surface-row-hover',
    'Extracted verbatim (v2, invest/stocks row hover fill) — `rgba(36,74,127,0.06)`; decorative fill (non-text), dark first-pass in the dark layer. DESIGN.md Colors (Table delta semantics).',
  ],
]);

const BLOCK_NOTE_SPACING =
  'Verified-systematized — Story 5.6 closure: the reference exposes no root spacing scale (inline utilities), so the kit systematizes the 4-based grid; the load-bearing steps are probe-verified at composition (container 1200px, grid-gap 20px, 96–120 section rhythm — Story 3.10 probes). DESIGN.md Layout & Spacing.';

const FONT_SLOT_COMMENT = [
  '  /* Font family slots — Daytona-first (maintainer license decision, 2026-09-22).',
  "     The bundled licensed renames are the default: DaytonaSans = Neue Haas",
  "     Unica W1G (renamed under the maintainer's Monotype license; ships in",
  '     packages/tokens/fonts/ via pillkit-tokens/daytona.css), DaytonaPragma =',
  '     Pragmatica (ParaType; 400/500/700). Separately-licensed assets, NOT',
  "     MIT — see fonts/LICENSE-FONTS.md. TinkoffSans (the site's heading font,",
  '     dsHeading) stays proprietary/unavailable — DaytonaSans takes the heading',
  '     role as the closest licensed grotesk. Open fallback: Inter. Consumers',
  '     self-hosting originals override the slots (recipe in TOKENS.md). A slot',
  '     override replaces the whole value: re-include the fallback stack. */',
].join('\n');

/** Mono slot comment (story 9.1) — rides right after the Daytona slots. */
const FONT_MONO_COMMENT = [
  '  /* Mono slot — DESIGN.md `fonts` block (story 9.1): system-first chain,',
  '     no licensed asset. No consumer in 9.1 by design; the first consumer',
  '     is the docs code blocks (story 11.2). */',
].join('\n');

const DESIGN_MD_PATH = '_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md';

/**
 * The bank config — the whole per-kit surface the core parameterizes on.
 * `darkAsserts` carries the bank's derivation anchors (border-strong
 * arithmetic, charcoal/brown invariants) verbatim from the pre-15.2 generator.
 */
const BANK_CONFIG = {
  prefix: '--tk-',
  themeAttribute: 'data-theme',
  requiredBlocks: ['colors', 'shadows', 'motion', 'typography', 'fonts', 'rounded', 'spacing'],
  fontsAllowedKeys: ['mono'],
  typographyFamilyGrammar: 'inline-groups',
  lightSemanticAliases: LIGHT_SEMANTIC_ALIASES,
  darkMode: 'manual',
  darkOverrides: DARK_OVERRIDES,
  darkDeferred: DARK_DEFERRED,
  darkInvariants: DARK_INVARIANTS,
  darkTokenNotes: DARK_TOKEN_NOTES,
  darkAsserts: [
    // Derivation anchor: border-strong #FFFFFF3D is derived FROM dark-border —
    // if the input ever changes, generation aborts so the derivation is revisited.
    (colors, fail) =>
      colors['dark-border'] === '#FFFFFF24'
        ? undefined
        : fail(
            `DARK_OVERRIDES border-strong derivation is anchored on dark-border '#FFFFFF24' but found ${JSON.stringify(colors['dark-border'])} — re-derive '#FFFFFF3D' (or its successor) and update the annotation`,
          ),
    // Charcoal invariant cross-check (DESIGN.md Colors): dark-tint-charcoal
    // documents that charcoal equals the light value — if that ever changes,
    // the no-override disposition is stale and generation must abort.
    (colors, fail) =>
      colors['dark-tint-charcoal'] === colors['tint-charcoal']
        ? undefined
        : fail(
            `dark-tint-charcoal (${colors['dark-tint-charcoal']}) no longer equals tint-charcoal (${colors['tint-charcoal']}) — the DESIGN.md charcoal invariant changed; revisit DARK_DEFERRED/DARK_INVARIANTS`,
          ),
    // Brown invariant cross-check (story 9.1, charcoal mold): dark-tint-brown
    // documents that the stepper badge brown equals the light value.
    (colors, fail) =>
      colors['dark-tint-brown'] === colors['tint-brown']
        ? undefined
        : fail(
            `dark-tint-brown (${colors['dark-tint-brown']}) no longer equals tint-brown (${colors['tint-brown']}) — the DESIGN.md brown invariant changed; revisit DARK_DEFERRED/DARK_INVARIANTS`,
          ),
  ],
  annotationEqualities: [
    ['text-secondary', 'gray-600'],
    ['focus-ring', 'blue-100'],
    ['link-on-tint', 'blue-200'],
    ['delta-positive', 'green-300'],
    ['delta-negative', 'red-300'],
  ],
  zScale: Z_SCALE,
  tokenNoteLiterals: TOKEN_NOTE_LITERALS,
  genCommand: 'pnpm gen:tokens',
  css: {
    header: [
      '/**',
      ' * pillkit-tokens — token layers (generated): light on `:host, :root`,',
      ' * dark semantic overrides on `[data-theme="dark"]` (Story 1.3).',
      ' *',
      ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens`.',
      ` * Source of truth: ${DESIGN_MD_PATH}`,
      ' * (frontmatter blocks: colors / typography / fonts / rounded / spacing / shadows / motion).',
      ' *',
      ' * The `:host` selector keeps every custom property usable inside shadow',
      ' * roots; kit components consume tokens exclusively via var(--tk-*) (FR-1 —',
      ' * zero hard-coded values outside this package).',
      ' */',
    ],
    colorsComment:
      'Colors — DESIGN.md `colors` light entries (scales, AA-adjusted semantics, tints) plus the scaffold `link`/`error` semantic aliases; the `dark-*` entries feed the dark layer below.',
    typographyComment:
      'Typography — DESIGN.md `typography` (+ the `fonts` block\'s mono family slot). No text-transform lives in tokens: caps render uppercase at usage per DESIGN.md.',
    fontSlotComment: [FONT_SLOT_COMMENT],
    fontMonoComment: [FONT_MONO_COMMENT],
    radiusComment: 'Radius — DESIGN.md `rounded` (pill register for controls, marketing registers for cards).',
    spacingComment: 'Spacing — DESIGN.md `spacing`.',
    spacingNote: BLOCK_NOTE_SPACING,
    shadowsComment:
      'Shadows — DESIGN.md `shadows` (light theme; dark theme replaces elevation with tonal steps).',
    motionComment:
      'Motion — DESIGN.md `motion`. AD-9: durations and curves come exclusively from these tokens.',
    zComment: 'Z-scale — scaffold mechanics, not a DESIGN.md extraction. AD-3/AD-12: z-order comes only from --tk-z-*.',
    darkComment:
      'Dark theme (Story 1.3) — semantic color overrides. Sourced from the DESIGN.md `dark-*` palette per the frozen 1.3 mapping; `dark-*` keys are the palette SOURCE, never emitted as `--tk-color-dark-*`. Theme switch adds no transition (0ms; an optional 150ms cross-fade is consumer-side).',
    invariantsComment: [
      '/*',
      ' * Theme invariants — intentionally absent from the dark rule above:',
      ' * --tk-color-text-on-primary, --tk-color-tint-charcoal and',
      ' * --tk-color-tint-brown keep their light values (yellow keeps ink text in',
      ' * dark; charcoal and the stepper badge brown stay — DESIGN.md Colors,',
      ' * equality asserted at generation). Typography / radius / spacing / motion /',
      ' * z are theme-invariant too — single source in the :host, :root rules.',
      ' */',
    ],
    darkShadowsComment:
      'Dark theme — tonal elevation (DESIGN.md Elevation & Depth): shadows collapse to `none`; hierarchy comes from tonal surface steps. Per-component exceptions use the `--tk-<component>-<slot>` grammar, never this layer.',
  },
  ts: {
    header: [
      '/**',
      ' * pillkit-tokens — typed token maps (generated).',
      ' *',
      ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens`.',
      ` * Source of truth: ${DESIGN_MD_PATH}`,
      ' * (frontmatter blocks; the z-scale is scaffold mechanics per AD-3/AD-12).',
      ' * Values mirror src/tokens.css — see src/TOKENS.md for the canonical listing',
      ' * with assumption flags and rationale.',
      ' */',
    ],
    mapDocs: {
      colorTokens: 'Color tokens — scales, light semantic aliases, card tints (values: DESIGN.md `colors`).',
      darkColorTokens:
        'Dark-layer color tokens — the semantic overrides re-declared on `[data-theme="dark"]` (sources: DESIGN.md `dark-*` palette; `border-strong` derived). Not spread into `tokens`: the light layer stays the single name registry.',
      typographyTokens:
        'Typography tokens — per-slot size/weight/leading/tracking plus the family slots (values: DESIGN.md `typography`; mono from the `fonts` block, story 9.1).',
      radiusTokens: 'Radius tokens (values: DESIGN.md `rounded`).',
      spaceTokens: 'Spacing tokens — 4-based scale, container width, grid gap (values: DESIGN.md `spacing`).',
      shadowTokens: 'Shadow tokens — light semantic shadow layers (values: DESIGN.md `shadows`).',
      motionTokens:
        'Motion tokens — expressive/productive curves and the duration scale (values: DESIGN.md `motion`).',
      zTokens: 'Z-scale — overlay stacking order; scaffold mechanics fixed by AD-12 usage, not a DESIGN.md extraction.',
    },
  },
  md: {
    title: '# pillkit-tokens — canonical token listing',
    sourceBullets: [
      `- Source of truth: \`${DESIGN_MD_PATH}\` frontmatter — blocks \`colors\`, \`typography\`, \`fonts\`, \`rounded\`, \`spacing\`, \`shadows\`, \`motion\`.`,
      '- The `components:` frontmatter block is consumer spec prose — never rendered.',
      '- The z-scale is scaffold mechanics, not an extraction (own section below).',
      '- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tk-color-dark-*` custom properties.',
    ],
    countsLine: ({ total, counts, dark, shadows }) =>
      `Light layer: **${total} tokens** on \`:host, :root\` (${counts.map(([block, count]) => `${block} ${count}`).join(', ')}) plus the dark layer: **${dark.overrides.length} semantic overrides + ${shadows.length} shadow-none re-declarations** on \`[data-theme="dark"]\`.`,
    colorsIntro: [
      'Light entries from the `colors` block: brand/ink/gray/lightblue/functional scales, AA-adjusted semantic aliases, card tints.',
    ],
    typographyIntro: [
      "Per-slot tokens from the `typography` block: `--tk-text-<slot>-size` / `-weight` always; `-leading` and `-tracking` where DESIGN.md declares them (bold variants reuse their base slot's leading at usage; caps-s renders uppercase at usage — no `text-transform` in tokens, per DESIGN.md Typography).",
    ],
    fontProse: [
      'The mono slot comes from the `fonts` block (story 9.1): a system-first monospace chain for tabular/code faces, no licensed asset. It had no consumer in 9.1 by design; the first consumer is the docs code blocks (story 11.2).',
      '',
      'Daytona-first stacks (maintainer license decision, 2026-09-22): the bundled licensed renames are the default. **DaytonaSans** = `Neue Haas Unica W1G` (renamed build, usage + renaming license from Monotype held by the maintainer) ships in `packages/tokens/fonts/` — import `pillkit-tokens/daytona.css` and the slots render it; **DaytonaPragma** = Pragmatica (ParaType, same arrangement) ships at true weights 400/500/700 (Book/Medium/Bold cuts; no SemiBold — 600/700 requests match the 700 face). Both are separately-licensed assets, NOT covered by the package MIT license (`fonts/LICENSE-FONTS.md`). `TinkoffSans` (the site\'s heading font, `dsHeading`) remains proprietary/unavailable, so DaytonaSans takes the heading role as the closest licensed grotesk. Consumers self-hosting the originals override the slots with the family names first (recipe below, unchanged); the open fallback is **Inter**, then the site-mirroring system chain.',
      '',
      'Override recipe (custom properties cascade and inherit — declare on `body`/your app root, or any later or higher-specificity declaration):',
      '',
      '```css',
      ':root { --tk-font-body: Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif; }',
      '```',
      '',
      'An override replaces the whole value: re-include the fallback stack so the DESIGN.md fallbacks stay preserved.',
      '',
    ],
    typographyExtra: [
      '### Typography registers (v2)',
      '',
      'The three v2 domains carry the SAME token base at three typography registers — MAPPINGS onto the slots above, zero new type tokens (DESIGN.md Components → Registers). Components declare their register; nothing branches at the token layer:',
      '',
      '| Register | Domains | h1 mapping | Body data usage |',
      '| --- | --- | --- | --- |',
      '| marketing | tbank.ru/business, invest landing | `--tk-text-heading-2-*` (44px / 700, Daytona stacks) — the kit\'s shipped default | body slots as shipped |',
      '| product-UI | invest/stocks | `--tk-text-heading-3-*` (36px / 500) | dense body data — body-m / body-s with tighter 24/20px leadings in table cells (set at usage, not in tokens) |',
      '| consumer | v1 consumer pages | `--tk-text-heading-1-*` (50px / 700) — the extracted site ramp as-is | body slots as shipped |',
    ].join('\n'),
    radiusIntro: [
      'Two registers per DESIGN.md Shapes: pill-soft marketing (`lg`/`xl`/`xxl`/`full`) and tight-precise app (`xs`/`sm`/`md`) — never mixed within one component.',
    ],
    spacingIntro: [BLOCK_NOTE_SPACING],
    shadowsIntro: [
      'Light theme shadow layers, used verbatim from the site. Dark theme replaces elevation with tonal surface steps (DESIGN.md Elevation & Depth; Story 1.3).',
    ],
    motionIntro: [
      'Durations and curves come exclusively from these tokens (AD-9); everything respects `prefers-reduced-motion: reduce`.',
    ],
    motionProse: [
      'Reduced motion is mechanical: under `prefers-reduced-motion: reduce` the stylesheet re-declares every `--tk-motion-duration-*` token to `0ms` on `:host, :root` — theme-independent, because the dark layer re-declares the same duration names. Components pair it with opacity-only fallbacks.',
      '',
    ],
    motionExtra: [
      '### Motion mapping rationale (AD-9)',
      '',
      '| Interaction | Token mapping |',
      '| --- | --- |',
      '| Hover | `--tk-motion-duration-fast` (150ms) |',
      '| Press / active | `--tk-motion-duration-fastest` (75ms) |',
      '| Overlay open/close (Modal, Toast, dropdowns) | `--tk-motion-curve-productive-entrance` / `--tk-motion-curve-productive-exit` |',
      '| Tab and content swaps | `--tk-motion-curve-expressive-standard` |',
      '| Theme switch | 0ms by default (token-layer swap); optional 150ms cross-fade |',
      '| Reduced motion | durations collapse to 0ms, opacity-only fallbacks |',
      '',
      'transitions.dev recipes fold onto these tokens at recipe-consumption time (their `:root` selectors never match inside shadow stylesheets) — deferred AD-9 work, see `_bmad-output/implementation-artifacts/deferred-work.md`.',
    ].join('\n'),
    zSection: {
      heading: ['## Z-scale — scaffold mechanics'],
      intro: [
        'Not a DESIGN.md extraction. Stacking order is fixed by AD-12 usage: z-order comes only from the `--tk-z-*` scale and the shared overlay controller owns every floating surface — no component implements its own z-index. Values leave one spare slot between layers.',
      ],
    },
    darkSection: {
      heading: ['## Dark layer (Story 1.3)'],
      intro: [
        'Setting `data-theme="dark"` on `<html>` re-resolves every SEMANTIC color token — zero markup/class/inline-style changes (AD-3). **Override model:** the dark layer re-declares semantic names only, sourced from the `dark-*` palette keys below; the `dark-*` keys are the palette SOURCE, never the consumed names — components always reference semantic tokens, never `--tk-color-dark-*` (enforced: generation aborts on any unconsumed `dark-*` key). Typography / radius / spacing / motion / z are theme-invariant — the `:host, :root` rules above stay the single source. Theme switch adds no transition (0ms default; an optional 150ms cross-fade is consumer-side, applied on the consumer surface — never in the token layer).',
      ],
      elevation: {
        heading: ['### Tonal elevation'],
        intro: [
          'All six `--tk-shadow-*` tokens collapse to `none` in dark: hierarchy comes from tonal surface steps instead of shadows (DESIGN.md Elevation & Depth). Per-component exceptions use the `--tk-<component>-<slot>` grammar — never this layer. `--tk-color-surface-muted` carries tonal step 1 (`dark-surface-1`); steps 2/3/elevated are deferred below until their consuming components land.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// The generator + re-exports — the surface tests/tokens-drift.test.ts and
// generate.d.mts pin (`renderArtifacts` pure fn + the TOKEN_NOTE_LITERALS
// canary map). Byte-identity of the regenerated artifacts is the 15.2 AC.
// ---------------------------------------------------------------------------

const { renderArtifacts: render } = createTokenGenerator(BANK_CONFIG);

export function renderArtifacts(designText) {
  return render(designText);
}

// ---------------------------------------------------------------------------
// CLI wrapper — read DESIGN.md, render, write the three artifacts
// ---------------------------------------------------------------------------

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;

if (isDirectRun) {
  const artifacts = renderArtifacts(readFileSync(DESIGN_MD, 'utf8'));
  writeFileSync(OUT_CSS, artifacts.tokensCss);
  writeFileSync(OUT_TS, artifacts.tokensTs);
  writeFileSync(OUT_MD, artifacts.tokensMd);
  console.log(
    'gen:tokens: rendered light + dark layer artifacts -> src/tokens.css, src/tokens.ts, src/TOKENS.md',
  );
}
