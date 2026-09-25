#!/usr/bin/env node
/**
 * pillkit-tokens — generation pipeline (Stories 1.2–1.3, AD-3).
 *
 * DESIGN.md frontmatter is the sole source of truth for token values. This module
 * parses it with a real YAML parser and renders three committed artifacts:
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
 *   (`pnpm check:tokens-drift` proves it; CI wiring lands in Story 1.8).
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
import { parse } from 'yaml';

const DESIGN_MD = fileURLToPath(
  new URL(
    '../../../_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md',
    import.meta.url,
  ),
);
const OUT_CSS = fileURLToPath(new URL('../src/tokens.css', import.meta.url));
const OUT_TS = fileURLToPath(new URL('../src/tokens.ts', import.meta.url));
const OUT_MD = fileURLToPath(new URL('../src/TOKENS.md', import.meta.url));

/** Rendering aborts by throwing — importable from tests; the CLI maps this to exit 1. */
const fail = (message) => {
  throw new Error(`gen:tokens: ${message}`);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const assertMapping = (value, at) => {
  assert(
    value !== null && typeof value === 'object' && !Array.isArray(value),
    `${at}: expected a YAML mapping, got ${JSON.stringify(value)}`,
  );
};
const assertNonEmptyMapping = (value, at) => {
  assertMapping(value, at);
  assert(Object.keys(value).length > 0, `${at}: block is empty — every token block must carry entries`);
};

// ---------------------------------------------------------------------------
// Frontmatter parsing (pure — design text in, validated document out)
// ---------------------------------------------------------------------------

const TOKEN_BLOCKS = ['colors', 'shadows', 'motion', 'typography', 'fonts', 'rounded', 'spacing'];
const NON_TOKEN_KEYS = new Set([
  'name',
  'description',
  'status',
  'created',
  'updated',
  'sources',
  'components', // consumer spec prose — components reference it, the pipeline never renders it
  // machine-consumed annotation source (story 9.2) — the AA-bearing color notes
  // derive from it at generation; it never emits tokens itself.
  'aa-annotations',
]);

function parseFrontmatter(designText) {
  const fence = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(designText);
  assert(fence !== null, 'DESIGN.md has no YAML frontmatter between --- fences');
  let doc;
  try {
    // uniqueKeys: duplicate keys abort — "last one wins" would silently rewrite tokens.
    doc = parse(fence[1], { uniqueKeys: true });
  } catch (error) {
    fail(`DESIGN.md frontmatter is not valid YAML: ${error.message}`);
  }
  assertMapping(doc, 'DESIGN.md frontmatter');
  for (const key of Object.keys(doc)) {
    assert(
      TOKEN_BLOCKS.includes(key) || NON_TOKEN_KEYS.has(key),
      `unexpected frontmatter key '${key}' — a new token block must be wired into the generator deliberately, never guessed`,
    );
  }
  for (const block of TOKEN_BLOCKS) {
    assert(block in doc, `frontmatter is missing the '${block}' token block`);
  }
  return doc;
}

// ---------------------------------------------------------------------------
// Per-block models — validate loudly, render mechanically
// ---------------------------------------------------------------------------

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
/**
 * v2 value grammar (Story 6.1, colors block only) — beyond hex, DESIGN.md may
 * carry verbatim rgba() extractions (table divider/hover fills) and references
 * `{colors.<key>}` (semantic aliases that resolve to a referenced entry's
 * value at render time; the v2 delta semantics alias the green/red scales).
 */
const RGBA_RE = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d(?:\.\d+)?)\)$/;
const COLOR_REFERENCE_RE = /^\{colors\.([a-z0-9-]+)\}$/;
const PX_RE = /^\d+(\.\d+)?px$/;
const SIGNED_PX_RE = /^-?\d+(\.\d+)?px$/;
/** Key grammar: a single lowercase/digit/dash segment — anything else emits an invalid custom property. */
const KEY_SEGMENT_RE = /^[a-z0-9-]+$/;
/** Characters that would break CSS declarations, TS string literals, or MD code spans. */
const VALUE_FORBIDDEN_RE = /[;}'`\n]/;

const assertKey = (key, at) => {
  assert(
    typeof key === 'string' && KEY_SEGMENT_RE.test(key),
    `${at}: key '${String(key)}' must match ^[a-z0-9-]+$ — it would emit an invalid custom property name`,
  );
};

const assertValue = (value, at) => {
  assert(
    typeof value === 'string' && value.length > 0 && !VALUE_FORBIDDEN_RE.test(value),
    `${at}: value ${JSON.stringify(value)} contains a character that breaks CSS/TS/MD emission (; } quotes newline)`,
  );
};

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
 * Validate one colors value against the literal grammar (pass 1) — hex,
 * rgba(r,g,b,a) literal, or a `{colors.<key>}` reference. Reference SYNTAX is
 * validated here; the target's existence and terminal value are resolved in
 * pass 2 (`resolveColorReferences`). Range checks live here so a malformed
 * rgba aborts even when it is never referenced by anything.
 */
function assertColorValue(value, at) {
  assert(typeof value === 'string', `${at}: expected a color string, got ${JSON.stringify(value)}`);
  if (HEX_RE.test(value)) return;
  const rgba = RGBA_RE.exec(value);
  if (rgba !== null) {
    const [r, g, b, a] = rgba.slice(1).map(Number);
    assert(
      r <= 255 && g <= 255 && b <= 255 && a <= 1,
      `${at}: rgba channels must be 0-255 ints with a 0-1 alpha float, got ${JSON.stringify(value)}`,
    );
    return;
  }
  if (COLOR_REFERENCE_RE.test(value)) return;
  fail(
    `${at}: expected a hex color, rgba(r,g,b,a) literal, or {colors.<key>} reference, got ${JSON.stringify(value)}`,
  );
}

/**
 * Pass 2 — resolve `{colors.<key>}` references transitively: a chain resolves
 * to its terminal literal (spec 6.1). Loud failures NAME the key: a missing
 * target aborts naming key and target; a cycle aborts naming the whole chain.
 * The resolved value is re-validated (a terminal must satisfy the literal
 * grammar) — pass-1 syntax validation alone cannot guarantee that.
 */
function resolveColorReferences(colors) {
  const resolved = new Map();
  const resolveKey = (key, chain) => {
    if (resolved.has(key)) return resolved.get(key);
    const value = colors[key];
    const reference = COLOR_REFERENCE_RE.exec(value);
    if (reference === null) {
      resolved.set(key, value);
      return value;
    }
    const target = reference[1];
    assert(
      target in colors,
      `colors.${key}: reference target 'colors.${target}' does not exist — references must name a key declared in the colors block`,
    );
    // Hardening (6.1 triage): a light-layer declaration would emit the dark
    // value verbatim — the flow is one-way (the dark layer sources dark-*
    // keys; nothing in the light layer ever resolves to them).
    assert(
      !target.startsWith('dark-'),
      `colors.${key}: reference target 'colors.${target}' is a dark-* palette key — a light-layer declaration would emit a dark value; point the reference at a light key`,
    );
    assert(
      !chain.includes(target),
      `colors.${key}: reference cycle ${[...chain, target].map((k) => `colors.${k}`).join(' -> ')} — a reference chain must terminate at a literal value`,
    );
    const terminal = resolveKey(target, [...chain, target]);
    resolved.set(key, terminal);
    return terminal;
  };
  const byKey = {};
  for (const key of Object.keys(colors)) {
    const value = resolveKey(key, [key]);
    assertColorValue(value, `colors.${key} (reference-resolved)`);
    assertValue(value, `colors.${key} (reference-resolved)`);
    byKey[key] = value;
  }
  return byKey;
}

/**
 * Colors: scales + light semantic aliases + card tints; `dark-*` keys feed the
 * dark layer. Two-pass (spec 6.1): pass 1 validates every value's literal
 * grammar, pass 2 resolves `{colors.<key>}` references — emitted declarations
 * carry the RESOLVED value (the v1 LIGHT_SEMANTIC_ALIASES precedent: consumers
 * see real values, contrast math stays trivial).
 */
function colorsModel(colors) {
  assertNonEmptyMapping(colors, 'colors');
  for (const [key, value] of Object.entries(colors)) {
    assertKey(key, `colors.${key}`);
    assertColorValue(value, `colors.${key}`);
    // References never emit as-is — the raw value's `}` would trip the
    // emission guard; the RESOLVED terminal is value-checked in pass 2.
    if (COLOR_REFERENCE_RE.test(value)) continue;
    assertValue(value, `colors.${key}`);
  }
  const byKey = resolveColorReferences(colors);
  const entries = [];
  for (const key of Object.keys(colors)) {
    if (!key.startsWith('dark-')) {
      entries.push({ name: `--tk-color-${key}`, value: byKey[key] });
    }
  }
  for (const alias of LIGHT_SEMANTIC_ALIASES) {
    assert(
      alias.scale in colors,
      `LIGHT_SEMANTIC_ALIASES: '${alias.name}' aliases scale '${alias.scale}' which does not exist in colors — update the alias after a DESIGN.md rename`,
    );
    entries.push({ name: alias.name, value: byKey[alias.scale] });
  }
  return { entries, byKey };
}

// ---------------------------------------------------------------------------
// Dark layer model (Story 1.3) — `dark-*` palette keys → semantic overrides
// ---------------------------------------------------------------------------

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
 * anchored by asserts in darkLayerModel so annotations cannot drift.
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
 * Validate the dark mapping against the parsed colors and the light-layer
 * names, then materialize the override list. Loud failures (spec 1.3 I/O
 * matrix): an unconsumed `dark-*` key aborts naming the key; a mapped semantic
 * name missing from the light layer aborts (the dark layer re-declares names,
 * it never introduces them).
 */
function darkLayerModel(colors, lightNames) {
  const light = new Set(lightNames);
  const sources = new Set();
  const targeted = new Set();
  const overrides = DARK_OVERRIDES.map((entry) => {
    assert(
      !targeted.has(entry.name),
      `DARK_OVERRIDES: '${entry.name}' is targeted twice — one override per semantic name`,
    );
    targeted.add(entry.name);
    assert(
      colors[entry.source] !== undefined,
      `DARK_OVERRIDES: '${entry.name}' sources '${entry.source}' which does not exist in colors — update the mapping after a DESIGN.md rename`,
    );
    sources.add(entry.source);
    assert(
      light.has(entry.name),
      `DARK_OVERRIDES targets '${entry.name}' which the light layer does not declare — the dark layer re-declares semantic names, it never introduces them`,
    );
    if (entry.derived !== undefined) {
      assert(
        HEX_RE.test(entry.derived),
        `DARK_OVERRIDES: derived value ${JSON.stringify(entry.derived)} for '${entry.name}' is not a hex color — derived overrides go through the same grammar as palette values`,
      );
    }
    return { name: entry.name, value: entry.derived ?? colors[entry.source], source: entry.source, derived: entry.derived };
  });
  // Derivation anchor: border-strong #FFFFFF3D is derived FROM dark-border — if
  // the input ever changes, generation aborts so the derivation is revisited.
  assert(
    colors['dark-border'] === '#FFFFFF24',
    `DARK_OVERRIDES border-strong derivation is anchored on dark-border '#FFFFFF24' but found ${JSON.stringify(colors['dark-border'])} — re-derive '#FFFFFF3D' (or its successor) and update the annotation`,
  );
  const deferred = [];
  for (const key of Object.keys(colors)) {
    if (!key.startsWith('dark-')) continue;
    if (sources.has(key) || DARK_DEFERRED.has(key)) continue;
    fail(
      `colors.${key}: dark palette key is not consumed — add it to DARK_OVERRIDES or DARK_DEFERRED deliberately (no silent drops)`,
    );
  }
  for (const key of DARK_DEFERRED.keys()) {
    assert(
      colors[key] !== undefined,
      `DARK_DEFERRED: '${key}' does not exist in colors — stale deferral entry after a DESIGN.md rename`,
    );
    assert(
      !sources.has(key),
      `DARK_DEFERRED lists '${key}' which DARK_OVERRIDES also consumes — a dark palette key gets exactly one disposition (override OR deferral), not both`,
    );
    deferred.push(key);
  }
  for (const invariant of DARK_INVARIANTS) {
    assert(
      light.has(invariant.name),
      `DARK_INVARIANTS references '${invariant.name}' which the light layer does not declare — update the invariant list`,
    );
    assert(
      !targeted.has(invariant.name),
      `DARK_INVARIANTS lists '${invariant.name}' which DARK_OVERRIDES also targets — an invariant cannot be overridden`,
    );
  }
  // Charcoal invariant cross-check (DESIGN.md Colors): dark-tint-charcoal
  // documents that charcoal equals the light value — if that ever changes, the
  // no-override disposition above is stale and generation must abort.
  assert(
    colors['dark-tint-charcoal'] === colors['tint-charcoal'],
    `dark-tint-charcoal (${colors['dark-tint-charcoal']}) no longer equals tint-charcoal (${colors['tint-charcoal']}) — the DESIGN.md charcoal invariant changed; revisit DARK_DEFERRED/DARK_INVARIANTS`,
  );
  // Brown invariant cross-check (story 9.1, charcoal mold): dark-tint-brown
  // documents that the stepper badge brown equals the light value.
  assert(
    colors['dark-tint-brown'] === colors['tint-brown'],
    `dark-tint-brown (${colors['dark-tint-brown']}) no longer equals tint-brown (${colors['tint-brown']}) — the DESIGN.md brown invariant changed; revisit DARK_DEFERRED/DARK_INVARIANTS`,
  );
  for (const name of DARK_TOKEN_NOTES.keys()) {
    assert(
      targeted.has(name),
      `DARK_TOKEN_NOTES references '${name}' which the dark layer does not override — update the annotations`,
    );
  }
  return { overrides, deferred, invariants: DARK_INVARIANTS };
}

/** Typography: per-slot size/weight (+leading/tracking when declared) + family slots. */
function typographyModel(typography) {
  assertNonEmptyMapping(typography, 'typography');
  const allowed = new Set(['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontFamily', 'note']);
  const entries = [];
  const headingFamilies = new Set();
  const bodyFamilies = new Set();
  for (const [slot, spec] of Object.entries(typography)) {
    assertKey(slot, `typography.${slot}`);
    assertMapping(spec, `typography.${slot}`);
    for (const field of Object.keys(spec)) {
      assert(
        allowed.has(field),
        `unexpected field '${field}' in typography.${slot} — extend the generator deliberately`,
      );
    }
    assert(
      typeof spec.fontSize === 'string' && PX_RE.test(spec.fontSize),
      `typography.${slot}.fontSize: expected <n>px, got ${JSON.stringify(spec.fontSize)}`,
    );
    assert(
      typeof spec.fontWeight === 'string' && /^\d{3}$/.test(spec.fontWeight),
      `typography.${slot}.fontWeight: expected a 3-digit weight string, got ${JSON.stringify(spec.fontWeight)}`,
    );
    assertValue(spec.fontSize, `typography.${slot}.fontSize`);
    assertValue(spec.fontWeight, `typography.${slot}.fontWeight`);
    // DESIGN.md `note:` fields are design intent — carried into the listing, never dropped.
    const note = typeof spec.note === 'string' && spec.note.length > 0 ? spec.note : undefined;
    entries.push({ name: `--tk-text-${slot}-size`, value: spec.fontSize, note });
    entries.push({ name: `--tk-text-${slot}-weight`, value: spec.fontWeight });
    if ('lineHeight' in spec) {
      assert(
        typeof spec.lineHeight === 'string' && (/^\d+(\.\d+)?$/.test(spec.lineHeight) || PX_RE.test(spec.lineHeight)),
        `typography.${slot}.lineHeight: expected a unitless ratio or px, got ${JSON.stringify(spec.lineHeight)}`,
      );
      assertValue(spec.lineHeight, `typography.${slot}.lineHeight`);
      entries.push({ name: `--tk-text-${slot}-leading`, value: spec.lineHeight });
    }
    if ('letterSpacing' in spec) {
      assert(
        typeof spec.letterSpacing === 'string' && SIGNED_PX_RE.test(spec.letterSpacing),
        `typography.${slot}.letterSpacing: expected <n>px, got ${JSON.stringify(spec.letterSpacing)}`,
      );
      assertValue(spec.letterSpacing, `typography.${slot}.letterSpacing`);
      entries.push({ name: `--tk-text-${slot}-tracking`, value: spec.letterSpacing });
    }
    if ('fontFamily' in spec) {
      assert(
        typeof spec.fontFamily === 'string' && spec.fontFamily.trim().length > 0,
        `typography.${slot}.fontFamily: expected a font stack string`,
      );
      assertValue(spec.fontFamily, `typography.${slot}.fontFamily`);
      (slot.startsWith('heading-') ? headingFamilies : bodyFamilies).add(spec.fontFamily);
    }
  }
  // OQ-2 resolution (2026-09-22): DESIGN.md carries TWO faithful stacks — the
  // heading slots share one, the body slots (body-*, caps-s) the other. Each
  // group must agree internally; a slot drifting its stack aborts generation.
  for (const [group, families] of [
    ['heading', headingFamilies],
    ['body', bodyFamilies],
  ]) {
    assert(
      families.size === 1,
      `expected one shared ${group} font stack across typography, found ${families.size} (${[...families].join(' | ')}) for ${group} slots — every ${group} slot must declare the same stack`,
    );
  }
  return {
    entries,
    fontSlots: [
      { name: '--tk-font-heading', value: [...headingFamilies][0] },
      { name: '--tk-font-body', value: [...bodyFamilies][0] },
    ],
  };
}

/**
 * Fonts — the mono family slot (story 9.1): DESIGN.md declares standalone font
 * FAMILY stacks here, outside the per-slot `typography` block (whose slots each
 * carry their own inline stack). Keys emit as `--tk-font-<key>` alongside the
 * heading/body slots. The allowed-key set is explicit — a new family slot wires
 * into this model deliberately, never by guessing.
 */
function fontsModel(fonts) {
  assertNonEmptyMapping(fonts, 'fonts');
  const allowed = new Set(['mono']);
  const entries = [];
  for (const [slot, value] of Object.entries(fonts)) {
    assertKey(slot, `fonts.${slot}`);
    assert(
      allowed.has(slot),
      `unexpected fonts key '${slot}' — wire new family slots into fontsModel deliberately (allowed today: ${[...allowed].join(', ')})`,
    );
    assert(
      typeof value === 'string' && value.trim().length > 0,
      `fonts.${slot}: expected a font stack string, got ${JSON.stringify(value)}`,
    );
    assertValue(value, `fonts.${slot}`);
    entries.push({ name: `--tk-font-${slot}`, value });
  }
  return entries;
}

/** Rounded / spacing share one shape: flat <n>px mapping under a token prefix. */
function pxMappingModel(block, at, prefix) {
  assertNonEmptyMapping(block, at);
  const entries = [];
  for (const [key, value] of Object.entries(block)) {
    assertKey(key, `${at}.${key}`);
    assert(
      typeof value === 'string' && PX_RE.test(value),
      `${at}.${key}: expected <n>px, got ${JSON.stringify(value)}`,
    );
    assertValue(value, `${at}.${key}`);
    entries.push({ name: `${prefix}${key}`, value });
  }
  return entries;
}

/** Shadows: `default-hover` is rendered as `--tk-shadow-hover` (spec 1.2 naming grammar). */
function shadowsModel(shadows) {
  assertNonEmptyMapping(shadows, 'shadows');
  const renames = { 'default-hover': 'hover' };
  const entries = [];
  for (const [key, value] of Object.entries(shadows)) {
    assertKey(key, `shadows.${key}`);
    assert(
      typeof value === 'string' && value.includes('px'),
      `shadows.${key}: expected a shadow string, got ${JSON.stringify(value)}`,
    );
    assertValue(value, `shadows.${key}`);
    entries.push({ name: `--tk-shadow-${renames[key] ?? key}`, value });
  }
  return entries;
}

/** Motion: curve-* cubic-beziers and duration-* millisecond values, verbatim. */
function motionModel(motion) {
  assertNonEmptyMapping(motion, 'motion');
  const entries = [];
  for (const [key, value] of Object.entries(motion)) {
    assertKey(key, `motion.${key}`);
    if (key.startsWith('curve-')) {
      assert(
        typeof value === 'string' && value.startsWith('cubic-bezier(') && value.endsWith(')'),
        `motion.${key}: expected a cubic-bezier(...) curve, got ${JSON.stringify(value)}`,
      );
    } else if (key.startsWith('duration-')) {
      assert(
        typeof value === 'string' && /^\d+ms$/.test(value),
        `motion.${key}: expected an <n>ms duration, got ${JSON.stringify(value)}`,
      );
    } else {
      fail(`unexpected motion key '${key}' — expected curve-* or duration-*`);
    }
    assertValue(value, `motion.${key}`);
    entries.push({ name: `--tk-motion-${key}`, value });
  }
  return entries;
}

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
 * are DERIVED from it in `aaAnnotationsModel` and merged into the live
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

/**
 * The LIVE annotation map the renderers read — TOKEN_NOTE_LITERALS plus the
 * AA notes derived from the DESIGN.md `aa-annotations:` block, rebuilt on
 * every `renderArtifacts` call (deterministic; no cross-render state).
 */
const TOKEN_NOTES = new Map();

// ---------------------------------------------------------------------------
// AA annotations (story 9.2) — derived from the DESIGN.md `aa-annotations:`
// frontmatter block; the string literals died with the migration
// ---------------------------------------------------------------------------

const AA_KINDS = new Set(['override', 'addition', 'restricted', 'pairing', 'measured']);
const AA_STATUSES = new Set(['verified', 'assumed']);
const AA_ENTRY_FIELDS = new Set(['kind', 'status', 'story', 'text']);
const AA_STORY_RE = /^\d+\.\d+$/;

/**
 * The AA-class test (spec 9.2): a note is AA-bearing when its text carries a
 * contrast ratio (`N.NNN:1`) or an explicit AA ruling. Every AA-bearing note
 * must live in the DESIGN.md block — a literal here that matches is an abort.
 */
const AA_RATIO_RE = /\d+\.\d+:1/;
const AA_CLASS_RE = /\bAA\b/;
const isAaBearing = (text) => AA_RATIO_RE.test(text) || AA_CLASS_RE.test(text);

/**
 * Note prefix per kind (executor pin, spec 9.2 Implementation Notes): override
 * and addition read "AA <kind> — ", restricted reads "Restricted: ", measured
 * interpolates its story pointer ("Measured (Story N.N) — "). The pairing kind
 * injects NOTHING: its notes open with the pairing narrative itself (the
 * warm-cream family phrasing) — pinned by byte-identity of the regenerated
 * artifacts, which forces the exact pre-migration strings.
 */
const aaNotePrefix = (entry) => {
  if (entry.kind === 'measured') return `Measured (Story ${entry.story}) — `;
  if (entry.kind === 'pairing') return '';
  if (entry.kind === 'restricted') return 'Restricted: ';
  return `AA ${entry.kind} — `;
};

/** Factual substrings a note may anchor on: `N.NNN:1` ratios and hex colors. */
const AA_RATIO_FACT_RE = /\d+\.\d+:1/g;
const AA_HEX_FACT_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
/** The AA threshold itself is not a distinguishing fact — real measurements only. */
const aaFactsOf = (text) => {
  const facts = new Set([...text.matchAll(AA_RATIO_FACT_RE)].map((match) => match[0]));
  for (const match of text.matchAll(AA_HEX_FACT_RE)) facts.add(match[0]);
  facts.delete('4.5:1');
  return [...facts];
};

/**
 * The colors frontmatter block body — indented lines, blank lines and comment
 * lines only. The capture ends EXPLICITLY at the next column-0 frontmatter
 * key, at an indented `aa-annotations:` key (yaml-nesting the block under
 * colors must not leak its `text:` lines in), or at the `---` fence end: the
 * aa-annotations block's own lines can NEVER enter the anchor space, or a
 * future entry would vacuously self-anchor on the very line it wrote.
 */
const colorsFrontmatterOf = (designText) => {
  const match =
    /^colors:\r?\n((?:(?![ \t]*aa-annotations:|[A-Za-z][\w-]*:|---)[^\n]*\r?\n)*)/m.exec(designText);
  return match === null ? '' : match[1];
};

/** The `## Colors` body section (the human narrative + the AA table). */
const colorsBodyOf = (designText) => {
  const match = /\n## Colors\r?\n([\s\S]*?)(?=\r?\n## )/.exec(designText);
  return match === null ? '' : match[1];
};

/**
 * Derive the AA-bearing notes from the DESIGN.md `aa-annotations:` block.
 *
 * Wiring is DELIBERATE (the 9.1 fonts mold): unknown entry fields abort, kind
 * and status are closed sets, `story` is required for verified and measured
 * entries, entry names must be declared color semantics (rendered light token
 * names). Every derived note must ANCHOR in the Colors body / colors
 * frontmatter: at least one line there carries the entry's token ref together
 * with a factual substring from its text (a `N.NNN:1` ratio or a hex) — a
 * Colors-body edit that removes the anchored fact aborts generation instead of
 * shipping a stale annotation. `status: assumed` emits a leading
 * `[ASSUMPTION]` flag (counted in the derived TOKENS.md status line);
 * `verified` + `story` is the resolved form.
 */
function aaAnnotationsModel(block, lightNameSet, designText) {
  assertMapping(block, 'aa-annotations');
  assert(Object.keys(block).length > 0, 'aa-annotations: block is empty — the AA-bearing notes are mandatory machine truth');
  const anchorLines = [
    ...colorsFrontmatterOf(designText).split(/\r?\n/),
    ...colorsBodyOf(designText).split(/\r?\n/),
  ];
  assert(anchorLines.some((line) => line.trim() !== ''), 'DESIGN.md Colors body / colors frontmatter not found — the aa-annotations anchor space is missing');
  const derived = new Map();
  for (const [name, spec] of Object.entries(block)) {
    assertKey(name, `aa-annotations.${name}`);
    assert(
      lightNameSet.has(`--tk-color-${name}`),
      `aa-annotations.${name}: not a declared color semantic — entry names must name light-layer color tokens`,
    );
    assertMapping(spec, `aa-annotations.${name}`);
    for (const field of Object.keys(spec)) {
      assert(
        AA_ENTRY_FIELDS.has(field),
        `unexpected field '${field}' in aa-annotations.${name} — extend the annotation grammar deliberately (allowed: ${[...AA_ENTRY_FIELDS].join(', ')})`,
      );
    }
    assert(
      typeof spec.kind === 'string' && AA_KINDS.has(spec.kind),
      `aa-annotations.${name}.kind: expected one of ${[...AA_KINDS].join(' | ')}, got ${JSON.stringify(spec.kind)}`,
    );
    assert(
      typeof spec.status === 'string' && AA_STATUSES.has(spec.status),
      `aa-annotations.${name}.status: expected verified | assumed, got ${JSON.stringify(spec.status)}`,
    );
    if ('story' in spec) {
      assert(
        typeof spec.story === 'string' && AA_STORY_RE.test(spec.story),
        `aa-annotations.${name}.story: expected a story pointer string like '9.1', got ${JSON.stringify(spec.story)}`,
      );
    }
    assert(
      spec.status !== 'verified' || typeof spec.story === 'string',
      `aa-annotations.${name}: status 'verified' requires its closure 'story' pointer`,
    );
    assert(
      spec.kind !== 'measured' || typeof spec.story === 'string',
      `aa-annotations.${name}: kind 'measured' requires 'story' — the note prefix embeds it ("Measured (Story N.N) — ")`,
    );
    assert(
      typeof spec.text === 'string' && spec.text.length > 0,
      `aa-annotations.${name}.text: expected the note body string`,
    );
    const entry = { name, kind: spec.kind, status: spec.status, story: spec.story, text: spec.text };
    const note = `${entry.status === 'assumed' ? '[ASSUMPTION] ' : ''}${aaNotePrefix(entry)}${entry.text}`;
    // Body-anchor assert (the debt's core): the note must trace to DESIGN.md.
    const facts = aaFactsOf(entry.text);
    assert(
      facts.length > 0,
      `aa-annotations.${name}: text carries no anchorable fact (no N.NNN:1 ratio, no hex) — every derived note must anchor in the Colors body`,
    );
    const refRe = new RegExp(`\\{colors\\.${name}\\}|\\b${name}\\b`);
    const anchored = anchorLines.some(
      (line) => refRe.test(line) && facts.some((fact) => line.includes(fact)),
    );
    assert(
      anchored,
      `aa-annotations.${name}: note no longer anchors in DESIGN.md — no Colors-body/frontmatter line carries the token ref '${name}' together with a factual substring (${facts.slice(0, 4).join(', ')}${facts.length > 4 ? ', …' : ''}) from its text; restore the anchor or re-record the annotation deliberately`,
    );
    derived.set(`--tk-color-${name}`, { ...entry, note, tokenName: `--tk-color-${name}` });
  }
  return derived;
}

/**
 * Merge the derived AA notes into the live TOKEN_NOTES map, enforcing the
 * both-direction migration aborts (spec 9.2): a literal remaining for a name
 * present in the block is a double source; an AA-class literal whose name is
 * NOT in the block aborts (the 10-entry migration must stay complete).
 */
function mergeAaNotes(derived) {
  for (const tokenName of derived.keys()) {
    assert(
      !TOKEN_NOTE_LITERALS.has(tokenName),
      `TOKEN_NOTES still carries a literal for '${tokenName}' which the aa-annotations block also defines — double source; the literal must die`,
    );
  }
  for (const [tokenName, literal] of TOKEN_NOTE_LITERALS) {
    assert(
      derived.has(tokenName) || !isAaBearing(literal),
      `TOKEN_NOTES literal '${tokenName}' is AA-bearing (a contrast ratio or an AA ruling) but has no aa-annotations entry — AA-bearing notes must derive from the DESIGN.md block`,
    );
  }
  TOKEN_NOTES.clear();
  for (const [tokenName, literal] of TOKEN_NOTE_LITERALS) TOKEN_NOTES.set(tokenName, literal);
  for (const [tokenName, { note }] of derived) TOKEN_NOTES.set(tokenName, note);
  return derived;
}

const BLOCK_NOTE_SPACING =
  'Verified-systematized — Story 5.6 closure: the reference exposes no root spacing scale (inline utilities), so the kit systematizes the 4-based grid; the load-bearing steps are probe-verified at composition (container 1200px, grid-gap 20px, 96–120 section rhythm — Story 3.10 probes). DESIGN.md Layout & Spacing.';

/**
 * The AA-override annotations state alias-to-scale equalities — assert they
 * still hold. `byKey` carries REFERENCE-RESOLVED values, so the v2 delta
 * aliases (`{colors.green-300}` / `{colors.red-300}` in DESIGN.md) are checked
 * the same way as the in-generator aliases: re-pointing a reference at a
 * different scale breaks the equality and aborts, so the annotation has to be
 * re-recorded deliberately.
 */
function assertAnnotationConsistency(model, allNames) {
  const colors = model.colors.byKey;
  const expectAlias = (semantic, scale) => {
    assert(semantic in colors && scale in colors, `TOKEN_NOTES drift: ${semantic}/${scale} no longer exist in colors`);
    assert(
      colors[semantic] === colors[scale],
      `TOKEN_NOTES drift: ${semantic} (${colors[semantic]}) no longer equals ${scale} (${colors[scale]}) — update the annotation`,
    );
  };
  expectAlias('text-secondary', 'gray-600');
  expectAlias('focus-ring', 'blue-100');
  expectAlias('link-on-tint', 'blue-200');
  expectAlias('delta-positive', 'green-300');
  expectAlias('delta-negative', 'red-300');
  for (const alias of LIGHT_SEMANTIC_ALIASES) {
    const rendered = model.colors.entries.find((entry) => entry.name === alias.name);
    assert(
      rendered !== undefined && rendered.value === colors[alias.scale],
      `TOKEN_NOTES drift: semantic alias '${alias.name}' no longer equals scale '${alias.scale}' (${colors[alias.scale]}) — update the annotation`,
    );
  }
  for (const name of TOKEN_NOTES.keys()) {
    assert(
      allNames.includes(name),
      `TOKEN_NOTES references '${name}' which is not rendered — update the annotations`,
    );
  }
}

// ---------------------------------------------------------------------------
// Rendering — tokens.css (light layer)
// ---------------------------------------------------------------------------

function cssRule(comment, declarations) {
  const lines = [];
  if (comment) lines.push(`/* ${comment} */`);
  lines.push(':host,', ':root {');
  lines.push(...declarations);
  lines.push('}');
  return lines.join('\n');
}

/**
 * Dark-layer rule — same shape as cssRule but the selectors only match under
 * `data-theme="dark"`: `:root[data-theme="dark"]` flips the document (attribute
 * on <html>), `:host([data-theme="dark"])` lets a shadow host carry the theme
 * context; custom properties then inherit into every shadow tree.
 */
function darkRule(comment, declarations) {
  const lines = [];
  if (comment) lines.push(`/* ${comment} */`);
  lines.push(':host([data-theme="dark"]),', ':root[data-theme="dark"] {');
  lines.push(...declarations);
  lines.push('}');
  return lines.join('\n');
}

function declarationLines(entries, notes = TOKEN_NOTES) {
  const lines = [];
  for (const { name, value } of entries) {
    const note = notes.get(name);
    if (note) lines.push(`  /* ${note} */`);
    lines.push(`  ${name}: ${value};`);
  }
  return lines;
}

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
  '     no licensed asset. No consumer in 9.1 by design — the first is the',
  '     invest tables story (11.2). */',
].join('\n');

function renderCss(model, dark) {
  const parts = [];
  parts.push(
    [
      '/**',
      ' * pillkit-tokens — token layers (generated): light on `:host, :root`,',
      ' * dark semantic overrides on `[data-theme="dark"]` (Story 1.3).',
      ' *',
      ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens`.',
      ' * Source of truth: _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md',
      ' * (frontmatter blocks: colors / typography / fonts / rounded / spacing / shadows / motion).',
      ' *',
      ' * The `:host` selector keeps every custom property usable inside shadow',
      ' * roots; kit components consume tokens exclusively via var(--tk-*) (FR-1 —',
      ' * zero hard-coded values outside this package).',
      ' */',
    ].join('\n'),
  );
  parts.push(
    cssRule(
      'Colors — DESIGN.md `colors` light entries (scales, AA-adjusted semantics, tints) plus the scaffold `link`/`error` semantic aliases; the `dark-*` entries feed the dark layer below.',
      declarationLines(model.colors.entries),
    ),
  );
  parts.push(
    cssRule(
      'Typography — DESIGN.md `typography` (+ the `fonts` block\'s mono family slot). No text-transform lives in tokens: caps render uppercase at usage per DESIGN.md.',
      [
        ...declarationLines(model.typography.entries),
        '',
        FONT_SLOT_COMMENT,
        ...model.typography.fontSlots.map(({ name, value }) => `  ${name}: ${value};`),
        FONT_MONO_COMMENT,
        ...model.fonts.map(({ name, value }) => `  ${name}: ${value};`),
      ],
    ),
  );
  parts.push(
    cssRule('Radius — DESIGN.md `rounded` (pill register for controls, marketing registers for cards).', declarationLines(model.radius)),
  );
  parts.push(
    cssRule(
      'Spacing — DESIGN.md `spacing`.',
      [`  /* ${BLOCK_NOTE_SPACING} */`, ...declarationLines(model.space)],
    ),
  );
  parts.push(cssRule('Shadows — DESIGN.md `shadows` (light theme; dark theme replaces elevation with tonal steps).', declarationLines(model.shadows)));
  parts.push(cssRule('Motion — DESIGN.md `motion`. AD-9: durations and curves come exclusively from these tokens.', declarationLines(model.motion)));
  parts.push(
    [
      '/* Reduced motion — EXPERIENCE.md: durations collapse to 0ms kit-wide (theme-independent:',
      ' * the same duration names are re-declared, so the dark layer inherits this too);',
      ' * components pair it with opacity-only fallbacks. */',
      '@media (prefers-reduced-motion: reduce) {',
      ':host,',
      ':root {',
      ...model.motion
        .filter(({ name }) => name.startsWith('--tk-motion-duration-'))
        .map(({ name }) => `  ${name}: 0ms;`),
      '}',
      '}',
    ].join('\n'),
  );
  parts.push(
    cssRule(
      'Z-scale — scaffold mechanics, not a DESIGN.md extraction. AD-3/AD-12: z-order comes only from --tk-z-*.',
      model.z.map(({ name, value }) => `  ${name}: ${value};`),
    ),
  );
  parts.push(
    darkRule(
      'Dark theme (Story 1.3) — semantic color overrides. Sourced from the DESIGN.md `dark-*` palette per the frozen 1.3 mapping; `dark-*` keys are the palette SOURCE, never emitted as `--tk-color-dark-*`. Theme switch adds no transition (0ms; an optional 150ms cross-fade is consumer-side).',
      declarationLines(
        dark.overrides.map(({ name, value }) => ({ name, value })),
        DARK_TOKEN_NOTES,
      ),
    ),
  );
  parts.push(
    [
      '/*',
      ' * Theme invariants — intentionally absent from the dark rule above:',
      ' * --tk-color-text-on-primary, --tk-color-tint-charcoal and',
      ' * --tk-color-tint-brown keep their light values (yellow keeps ink text in',
      ' * dark; charcoal and the stepper badge brown stay — DESIGN.md Colors,',
      ' * equality asserted at generation). Typography / radius / spacing / motion /',
      ' * z are theme-invariant too — single source in the :host, :root rules.',
      ' */',
    ].join('\n'),
  );
  parts.push(
    darkRule(
      'Dark theme — tonal elevation (DESIGN.md Elevation & Depth): shadows collapse to `none`; hierarchy comes from tonal surface steps. Per-component exceptions use the `--tk-<component>-<slot>` grammar, never this layer.',
      model.shadows.map(({ name }) => `  ${name}: none;`),
    ),
  );
  return `${parts.join('\n\n')}\n`;
}

// ---------------------------------------------------------------------------
// Rendering — tokens.ts (typed maps)
// ---------------------------------------------------------------------------

function tsMap(constName, doc, entries) {
  return [
    `/** ${doc} */`,
    `export const ${constName} = {`,
    ...entries.map(({ name, value }) => `  '${name}': '${value}',`),
    '} as const;',
  ].join('\n');
}

function renderTs(model, dark) {
  const maps = [
    tsMap('colorTokens', 'Color tokens — scales, light semantic aliases, card tints (values: DESIGN.md `colors`).', model.colors.entries),
    tsMap(
      'darkColorTokens',
      'Dark-layer color tokens — the semantic overrides re-declared on `[data-theme="dark"]` (sources: DESIGN.md `dark-*` palette; `border-strong` derived). Not spread into `tokens`: the light layer stays the single name registry.',
      dark.overrides,
    ),
    tsMap(
      'typographyTokens',
      'Typography tokens — per-slot size/weight/leading/tracking plus the family slots (values: DESIGN.md `typography`; mono from the `fonts` block, story 9.1).',
      [...model.typography.entries, ...model.typography.fontSlots, ...model.fonts],
    ),
    tsMap('radiusTokens', 'Radius tokens (values: DESIGN.md `rounded`).', model.radius),
    tsMap('spaceTokens', 'Spacing tokens — 4-based scale, container width, grid gap (values: DESIGN.md `spacing`).', model.space),
    tsMap('shadowTokens', 'Shadow tokens — light semantic shadow layers (values: DESIGN.md `shadows`).', model.shadows),
    tsMap('motionTokens', 'Motion tokens — expressive/productive curves and the duration scale (values: DESIGN.md `motion`).', model.motion),
    tsMap('zTokens', 'Z-scale — overlay stacking order; scaffold mechanics fixed by AD-12 usage, not a DESIGN.md extraction.', model.z),
  ];
  return [
    '/**',
    ' * pillkit-tokens — typed token maps (generated).',
    ' *',
    ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens`.',
    ' * Source of truth: _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md',
    ' * (frontmatter blocks; the z-scale is scaffold mechanics per AD-3/AD-12).',
    ' * Values mirror src/tokens.css — see src/TOKENS.md for the canonical listing',
    ' * with assumption flags and rationale.',
    ' */',
    '',
    maps.join('\n\n'),
    '',
    '/** Every --tk-* custom property emitted by the light layer. */',
    'export const tokens = {',
    '  ...colorTokens,',
    '  ...typographyTokens,',
    '  ...radiusTokens,',
    '  ...spaceTokens,',
    '  ...shadowTokens,',
    '  ...motionTokens,',
    '  ...zTokens,',
    '} as const;',
    '',
    '/** Union of every token custom-property name. */',
    'export type TokenName = keyof typeof tokens;',
    '',
    '/** Union of every token value (CSS custom property values are strings). */',
    'export type TokenValue = (typeof tokens)[TokenName];',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Rendering — TOKENS.md (canonical listing)
// ---------------------------------------------------------------------------

const DESIGN_MD_PATH = '_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md';

function mdTable(rows, header = ['Token', 'Value', 'Notes']) {
  const table = [header, header.map(() => '---'), ...rows];
  return table.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

/** Wrap a token name/value in markdown code backticks. */
const mdCode = (text) => '`' + text + '`';

/** Notes column: static annotations (TOKEN_NOTES) plus any DESIGN.md `note:` field carried on the entry. */
function noteOf(entry) {
  return [TOKEN_NOTES.get(entry.name), entry.note].filter(Boolean).join(' ');
}

function renderMd(model, dark) {
  const { colors, typography, fonts, radius, space, shadows, motion, z } = model;
  const counts = [
    ['colors', colors.entries.length],
    ['typography', typography.entries.length + typography.fontSlots.length],
    ['fonts', fonts.length],
    ['radius', radius.length],
    ['spacing', space.length],
    ['shadows', shadows.length],
    ['motion', motion.length],
    ['z-scale', z.length],
  ];
  const total = counts.reduce((sum, [, count]) => sum + count, 0);
  // DERIVED [ASSUMPTION] ledger (story 9.2) — replaces the hand-written
  // resolved-history bullet: the counts and the per-entry story pointers come
  // from the `aa-annotations:` block statuses, so an entry flipping to
  // `assumed` (or resolving) re-derives this line mechanically. Zero open
  // flags today; the machinery is proven by the negative self-checks.
  const aaEntries = [...model.aa.values()];
  const aaOpen = aaEntries.filter((entry) => entry.status === 'assumed');
  const aaResolved = aaEntries.filter((entry) => entry.status === 'verified');
  const aaStatusLine = `- AA-bearing color notes are GENERATED from the DESIGN.md \`aa-annotations:\` block (story 9.2 — the generator literals died; every note must anchor in the Colors body, anchor lost → generation aborts): ${aaEntries.length} entries — ${aaResolved.length} verified / ${aaOpen.length} open \`[ASSUMPTION]\` flags${aaOpen.length > 0 ? ` — OPEN: ${aaOpen.map((entry) => entry.name).join(', ')}` : ''}. Resolved history: ${aaResolved.map((entry) => `${entry.name} (Story ${entry.story})`).join('; ')}.`;
  const lines = [];
  lines.push('# pillkit-tokens — canonical token listing', '');
  lines.push('GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.', '');
  lines.push(
    `- Source of truth: \`${DESIGN_MD_PATH}\` frontmatter — blocks \`colors\`, \`typography\`, \`fonts\`, \`rounded\`, \`spacing\`, \`shadows\`, \`motion\`.`,
    '- The `components:` frontmatter block is consumer spec prose — never rendered.',
    '- The z-scale is scaffold mechanics, not an extraction (own section below).',
    '- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tk-color-dark-*` custom properties.',
    aaStatusLine,
    '',
  );
  lines.push(
    `Light layer: **${total} tokens** on \`:host, :root\` (${counts.map(([block, count]) => `${block} ${count}`).join(', ')}) plus the dark layer: **${dark.overrides.length} semantic overrides + ${shadows.length} shadow-none re-declarations** on \`[data-theme="dark"]\`.`,
    '',
  );

  lines.push('## Colors', '');
  lines.push('Light entries from the `colors` block: brand/ink/gray/lightblue/functional scales, AA-adjusted semantic aliases, card tints.', '');
  lines.push(mdTable(colors.entries.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

  lines.push('## Typography', '');
  lines.push(
    "Per-slot tokens from the `typography` block: `--tk-text-<slot>-size` / `-weight` always; `-leading` and `-tracking` where DESIGN.md declares them (bold variants reuse their base slot's leading at usage; caps-s renders uppercase at usage — no `text-transform` in tokens, per DESIGN.md Typography).",
    '',
  );
  lines.push(mdTable(typography.entries.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');
  lines.push('### Font family slots', '');
  lines.push(
    mdTable(
      [...typography.fontSlots, ...fonts].map(({ name, value }) => [mdCode(name), mdCode(value), '']),
    ),
    '',
  );
  lines.push(
    'The mono slot comes from the `fonts` block (story 9.1): a system-first monospace chain for tabular/code faces, no licensed asset. It has no consumer in 9.1 by design — the first is the invest tables story (11.2).',
    '',
  );
  lines.push(
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
  );
  lines.push('### Typography registers (v2)', '');
  lines.push(
    'The three v2 domains carry the SAME token base at three typography registers — MAPPINGS onto the slots above, zero new type tokens (DESIGN.md Components → Registers). Components declare their register; nothing branches at the token layer:',
    '',
    '| Register | Domains | h1 mapping | Body data usage |',
    '| --- | --- | --- | --- |',
    '| marketing | tbank.ru/business, invest landing | `--tk-text-heading-2-*` (44px / 700, Daytona stacks) — the kit\'s shipped default | body slots as shipped |',
    '| product-UI | invest/stocks | `--tk-text-heading-3-*` (36px / 500) | dense body data — body-m / body-s with tighter 24/20px leadings in table cells (set at usage, not in tokens) |',
    '| consumer | v1 consumer pages | `--tk-text-heading-1-*` (50px / 700) — the extracted site ramp as-is | body slots as shipped |',
    '',
  );

  lines.push('## Radius', '');
  lines.push('Two registers per DESIGN.md Shapes: pill-soft marketing (`lg`/`xl`/`xxl`/`full`) and tight-precise app (`xs`/`sm`/`md`) — never mixed within one component.', '');
  lines.push(mdTable(radius.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

  lines.push('## Spacing', '');
  lines.push(BLOCK_NOTE_SPACING, '');
  lines.push(mdTable(space.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

  lines.push('## Shadows', '');
  lines.push('Light theme shadow layers, used verbatim from the site. Dark theme replaces elevation with tonal surface steps (DESIGN.md Elevation & Depth; Story 1.3).', '');
  lines.push(mdTable(shadows.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

  lines.push('## Motion', '');
  lines.push('Durations and curves come exclusively from these tokens (AD-9); everything respects `prefers-reduced-motion: reduce`.', '');
  lines.push(mdTable(motion.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');
  lines.push(
    'Reduced motion is mechanical: under `prefers-reduced-motion: reduce` the stylesheet re-declares every `--tk-motion-duration-*` token to `0ms` on `:host, :root` — theme-independent, because the dark layer re-declares the same duration names. Components pair it with opacity-only fallbacks.',
    '',
  );
  lines.push('### Motion mapping rationale (AD-9)', '');
  lines.push(
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
    '',
  );

  lines.push('## Z-scale — scaffold mechanics', '');
  lines.push(
    'Not a DESIGN.md extraction. Stacking order is fixed by AD-12 usage: z-order comes only from the `--tk-z-*` scale and the shared overlay controller owns every floating surface — no component implements its own z-index. Values leave one spare slot between layers.',
    '',
  );
  lines.push(mdTable(z.map(({ name, value, layer }) => [mdCode(name), mdCode(value), layer])), '');

  lines.push('## Dark layer (Story 1.3)', '');
  lines.push(
    'Setting `data-theme="dark"` on `<html>` re-resolves every SEMANTIC color token — zero markup/class/inline-style changes (AD-3). **Override model:** the dark layer re-declares semantic names only, sourced from the `dark-*` palette keys below; the `dark-*` keys are the palette SOURCE, never the consumed names — components always reference semantic tokens, never `--tk-color-dark-*` (enforced: generation aborts on any unconsumed `dark-*` key). Typography / radius / spacing / motion / z are theme-invariant — the `:host, :root` rules above stay the single source. Theme switch adds no transition (0ms default; an optional 150ms cross-fade is consumer-side, applied on the consumer surface — never in the token layer).',
    '',
  );
  const lightValues = new Map(colors.entries.map(({ name, value }) => [name, value]));
  lines.push(
    mdTable(
      dark.overrides.map(({ name, value, source, derived }) => [
        mdCode(name),
        mdCode(lightValues.get(name) ?? ''),
        mdCode(value),
        derived ? 'derived' : mdCode(`colors.${source}`),
        DARK_TOKEN_NOTES.get(name) ?? '',
      ]),
      ['Token', 'Light', 'Dark', 'Source', 'Notes'],
    ),
    '',
  );
  lines.push('### Theme invariants', '');
  lines.push(
    'These semantics keep their light values in dark — no override is emitted:',
    '',
    ...dark.invariants.map(({ name, why }) => `- \`${name}\` — ${why}`),
    '',
  );
  lines.push('### Tonal elevation', '');
  lines.push(
    'All six `--tk-shadow-*` tokens collapse to `none` in dark: hierarchy comes from tonal surface steps instead of shadows (DESIGN.md Elevation & Depth). Per-component exceptions use the `--tk-<component>-<slot>` grammar — never this layer. `--tk-color-surface-muted` carries tonal step 1 (`dark-surface-1`); steps 2/3/elevated are deferred below until their consuming components land.',
    '',
  );
  lines.push('### Deferred dark palette keys', '');
  lines.push(
    'Accounted-for `dark-*` keys with no token-layer emission yet (adding a `dark-*` key without an entry here aborts generation — no silent drops):',
    '',
    ...dark.deferred.map((key) => `- \`colors.${key}\` — ${DARK_DEFERRED.get(key)}`),
    '',
  );
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Pure render pipeline — design text in, artifact bodies out
// ---------------------------------------------------------------------------

export function renderArtifacts(designText) {
  const doc = parseFrontmatter(designText);
  const model = {
    colors: colorsModel(doc.colors),
    typography: typographyModel(doc.typography),
    fonts: fontsModel(doc.fonts),
    radius: pxMappingModel(doc.rounded, 'rounded', '--tk-radius-'),
    space: pxMappingModel(doc.spacing, 'spacing', '--tk-space-'),
    shadows: shadowsModel(doc.shadows),
    motion: motionModel(doc.motion),
    z: Z_SCALE,
  };
  for (const { name, value } of model.z) {
    assertValue(value, `z-scale ${name}`);
  }
  const allNames = [
    ...model.colors.entries,
    ...model.typography.entries,
    ...model.typography.fontSlots,
    ...model.fonts,
    ...model.radius,
    ...model.space,
    ...model.shadows,
    ...model.motion,
    ...model.z,
  ].map(({ name }) => name);
  const duplicates = allNames.filter((name, index) => allNames.indexOf(name) !== index);
  assert(
    duplicates.length === 0,
    `duplicate token names after renames: ${[...new Set(duplicates)].join(', ')} — DESIGN.md keys collide under the emission grammar`,
  );
  // Dark mapping validates before annotation consistency so its specific
  // failure modes (unconsumed key, missing light target) name the culprit.
  const dark = darkLayerModel(model.colors.byKey, allNames);
  // AA notes derive from the `aa-annotations:` block AFTER the models exist
  // (entry names validate against rendered light token names) and BEFORE the
  // renders (the merged TOKEN_NOTES map is what the renderers read).
  const aa = mergeAaNotes(aaAnnotationsModel(doc['aa-annotations'], new Set(allNames), designText));
  model.aa = aa;
  assertAnnotationConsistency(model, allNames);
  return {
    tokensCss: renderCss(model, dark),
    tokensTs: renderTs(model, dark),
    tokensMd: renderMd(model, dark),
  };
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
