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
 * - `dark-*` color entries are the palette SOURCE for the dark layer's semantic
 *   overrides — never emitted as `--tk-color-dark-*` custom properties, never
 *   rendered into the light layer. Every `dark-*` key must be consumed by
 *   DARK_OVERRIDES or DARK_DEFERRED or generation aborts (no silent drops).
 * - Never hand-edit the artifacts; change DESIGN.md and regenerate.
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

const TOKEN_BLOCKS = ['colors', 'shadows', 'motion', 'typography', 'rounded', 'spacing'];
const NON_TOKEN_KEYS = new Set([
  'name',
  'description',
  'status',
  'created',
  'updated',
  'sources',
  'components', // consumer spec prose — components reference it, the pipeline never renders it
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

/** Colors: scales + light semantic aliases + card tints; `dark-*` keys feed the dark layer. */
function colorsModel(colors) {
  assertNonEmptyMapping(colors, 'colors');
  const entries = [];
  for (const [key, value] of Object.entries(colors)) {
    assertKey(key, `colors.${key}`);
    assert(
      typeof value === 'string' && HEX_RE.test(value),
      `colors.${key}: expected a hex color string, got ${JSON.stringify(value)}`,
    );
    assertValue(value, `colors.${key}`);
    if (!key.startsWith('dark-')) {
      entries.push({ name: `--tk-color-${key}`, value });
    }
  }
  for (const alias of LIGHT_SEMANTIC_ALIASES) {
    assert(
      alias.scale in colors,
      `LIGHT_SEMANTIC_ALIASES: '${alias.name}' aliases scale '${alias.scale}' which does not exist in colors — update the alias after a DESIGN.md rename`,
    );
    entries.push({ name: alias.name, value: colors[alias.scale] });
  }
  return { entries, byKey: colors };
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
]);

/** Semantic names deliberately NOT re-declared in dark — they keep their light values. */
const DARK_INVARIANTS = [
  { name: '--tk-color-text-on-primary', why: 'yellow keeps ink text in dark (DESIGN.md Colors)' },
  { name: '--tk-color-tint-charcoal', why: 'charcoal tint is theme-invariant (DESIGN.md Colors)' },
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
 * Design-intent annotations recorded at capture time. The frontmatter carries
 * values only; these notes trace to DESIGN.md body prose (the Colors AA-override
 * table and [ASSUMPTION] markers) and ship alongside the values. Facts stated
 * here are cross-checked against the parsed DESIGN.md in
 * assertAnnotationConsistency — annotations cannot drift from the values.
 */
const TOKEN_NOTES = new Map([
  [
    '--tk-color-text-secondary',
    'AA override — gray-600 `#616871` replaces the extracted `#79818C` (gray-500, 3.94:1 on white fails 4.5:1; `#616871` = 5.64:1). DESIGN.md Colors.',
  ],
  [
    '--tk-color-focus-ring',
    'AA override — unified `blue-100` ring at 2px offset 2px (the reference ink-on-ink ring is invisible; border-default = 1.23:1). DESIGN.md Colors.',
  ],
  [
    '--tk-color-link-on-tint',
    'AA addition — `blue-200` for links on tinted/field surfaces (blue-100 = 4.07:1 on field, fails). DESIGN.md Colors.',
  ],
  [
    '--tk-color-link',
    'Semantic alias — `blue-100`, added in Story 1.3: components consume semantics, not scales (AD-2/AD-3), and the dark layer needs a semantic name to override (`dark-link`). DESIGN.md Colors (TextLink).',
  ],
  [
    '--tk-color-error',
    'Semantic alias — `red-100`, added in Story 1.3 alongside `link` so both themes expose error semantics (the dark layer overrides it with `dark-error`). DESIGN.md Colors.',
  ],
  [
    '--tk-color-error-on-field',
    'AA addition — `red-200` for errors on field/muted surfaces (red-100 = 4.22:1 on surface-field and 4.40:1 on surface-muted — both fail 4.5:1; red-200 passes). Mirrors the link-on-tint precedent. DESIGN.md Colors.',
  ],
  [
    '--tk-color-text-muted',
    'Restricted: placeholder/disabled/non-essential text only — `#959BA4` fails AA for body text. DESIGN.md Colors.',
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
]);

const BLOCK_NOTE_SPACING =
  'Verified-systematized — Story 5.6 closure: the reference exposes no root spacing scale (inline utilities), so the kit systematizes the 4-based grid; the load-bearing steps are probe-verified at composition (container 1200px, grid-gap 20px, 96–120 section rhythm — Story 3.10 probes). DESIGN.md Layout & Spacing.';

/** The AA-override annotations state alias-to-scale equalities — assert they still hold. */
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
      ' * (frontmatter blocks: colors / typography / rounded / spacing / shadows / motion).',
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
      'Typography — DESIGN.md `typography`. No text-transform lives in tokens: caps render uppercase at usage per DESIGN.md.',
      [
        ...declarationLines(model.typography.entries),
        '',
        FONT_SLOT_COMMENT,
        ...model.typography.fontSlots.map(({ name, value }) => `  ${name}: ${value};`),
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
      ' * --tk-color-text-on-primary and --tk-color-tint-charcoal keep their light',
      ' * values (yellow keeps ink text in dark; charcoal stays — DESIGN.md Colors,',
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
      'Typography tokens — per-slot size/weight/leading/tracking plus the family slots (values: DESIGN.md `typography`).',
      [...model.typography.entries, ...model.typography.fontSlots],
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
  const { colors, typography, radius, space, shadows, motion, z } = model;
  const counts = [
    ['colors', colors.entries.length],
    ['typography', typography.entries.length + typography.fontSlots.length],
    ['radius', radius.length],
    ['spacing', space.length],
    ['shadows', shadows.length],
    ['motion', motion.length],
    ['z-scale', z.length],
  ];
  const total = counts.reduce((sum, [, count]) => sum + count, 0);
  const lines = [];
  lines.push('# pillkit-tokens — canonical token listing', '');
  lines.push('GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.', '');
  lines.push(
    `- Source of truth: \`${DESIGN_MD_PATH}\` frontmatter — blocks \`colors\`, \`typography\`, \`rounded\`, \`spacing\`, \`shadows\`, \`motion\`.`,
    '- The `components:` frontmatter block is consumer spec prose — never rendered.',
    '- The z-scale is scaffold mechanics, not an extraction (own section below).',
    '- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tk-color-dark-*` custom properties.',
    '- All `[ASSUMPTION]` flags are RESOLVED (mint/beige tints — Story 3.6; dark tints — 5.4; xxl/xl radii + the spacing systematization — 5.6): every flagged value was verified against the archived captures and now carries a `Verified —` annotation; none was silently dropped.',
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
  lines.push(mdTable(typography.fontSlots.map(({ name, value }) => [mdCode(name), mdCode(value), ''])), '');
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
