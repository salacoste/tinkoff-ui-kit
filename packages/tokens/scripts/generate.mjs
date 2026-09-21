#!/usr/bin/env node
/**
 * @tk-kit/tokens — generation pipeline (Story 1.2, AD-3).
 *
 * DESIGN.md frontmatter is the sole source of truth for token values. This module
 * parses it with a real YAML parser and renders three committed artifacts:
 *
 *   src/tokens.css — the light `--tk-*` layer on `:host, :root` (shadow-root usable)
 *   src/tokens.ts  — typed token name/value maps for programmatic access
 *   src/TOKENS.md  — the canonical listing (value, source block, assumption flags,
 *                    z-scale + motion-mapping rationale)
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
 * - `dark-*` color entries belong to the Story 1.3 dark layer — never rendered
 *   into the light layer (only listed as deferred in TOKENS.md).
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

/** Colors: scales + light semantic aliases + card tints; `dark-*` keys defer to Story 1.3. */
function colorsModel(colors) {
  assertNonEmptyMapping(colors, 'colors');
  const entries = [];
  const deferred = [];
  for (const [key, value] of Object.entries(colors)) {
    assertKey(key, `colors.${key}`);
    assert(
      typeof value === 'string' && HEX_RE.test(value),
      `colors.${key}: expected a hex color string, got ${JSON.stringify(value)}`,
    );
    assertValue(value, `colors.${key}`);
    if (key.startsWith('dark-')) {
      deferred.push(`--tk-color-${key}`);
    } else {
      entries.push({ name: `--tk-color-${key}`, value });
    }
  }
  return { entries, deferred, byKey: colors };
}

/** Typography: per-slot size/weight (+leading/tracking when declared) + family slots. */
function typographyModel(typography) {
  assertNonEmptyMapping(typography, 'typography');
  const allowed = new Set(['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontFamily', 'note']);
  const entries = [];
  const families = new Set();
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
      families.add(spec.fontFamily);
    }
  }
  assert(
    families.size === 1,
    `expected one shared fallback stack across typography, found ${families.size} (${[...families].join(' | ')}) — wire heading/body stacks separately if DESIGN.md ever splits them`,
  );
  const fontFamilyStack = [...families][0];
  return {
    entries,
    fontSlots: [
      { name: '--tk-font-heading', value: fontFamilyStack },
      { name: '--tk-font-body', value: fontFamilyStack },
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
    '--tk-color-text-muted',
    'Restricted: placeholder/disabled/non-essential text only — `#959BA4` fails AA for body text. DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-mint',
    '[ASSUMPTION] vision-inventory estimate pending build-time capture verification — resolved by Stories 3.6/5.6. DESIGN.md Colors.',
  ],
  [
    '--tk-color-tint-beige',
    '[ASSUMPTION] vision-inventory estimate pending build-time capture verification — resolved by Stories 3.6/5.6. DESIGN.md Colors.',
  ],
  [
    '--tk-radius-xl',
    '[ASSUMPTION] vision-estimated service-card radius — verify at build. Resolved by Stories 3.6/5.6. DESIGN.md Shapes.',
  ],
  [
    '--tk-radius-xxl',
    '[ASSUMPTION] vision-estimated feature/promo-card radius — verify at build. Resolved by Stories 3.6/5.6. DESIGN.md Shapes.',
  ],
]);

const BLOCK_NOTE_SPACING =
  '[ASSUMPTION] systematized scale — the reference site exposes no root spacing scale (inline utilities); values follow its grid behavior. DESIGN.md Layout & Spacing.';

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

function declarationLines(entries) {
  const lines = [];
  for (const { name, value } of entries) {
    const note = TOKEN_NOTES.get(name);
    if (note) lines.push(`  /* ${note} */`);
    lines.push(`  ${name}: ${value};`);
  }
  return lines;
}

const FONT_SLOT_COMMENT = [
  '  /* Font family slots — the first family position is the consumer brand-font',
  "     slot (OQ-2: the reference's dsHeading/dsText are proprietary and never",
  '     bundled). Point it at a licensed brand font or a metric-compatible open',
  '     alternative — recommended default: Inter. A slot override replaces the',
  '     whole value: re-include the fallback stack. */',
].join('\n');

function renderCss(model) {
  const parts = [];
  parts.push(
    [
      '/**',
      ' * @tk-kit/tokens — light token layer (generated).',
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
      'Colors — DESIGN.md `colors` (light entries; the `dark-*` entries are reserved for the Story 1.3 dark layer).',
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
    [
      '/*',
      ' * Dark theme layering hook — Story 1.3 emits the dark layer on',
      ' * `[data-theme="dark"]` from the `dark-*` DESIGN.md entries; this light',
      ' * layer is the base it overrides. Theme switching is an attribute change on',
      ' * <html> — zero markup/class/inline-style changes (AD-3).',
      ' */',
    ].join('\n'),
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

function renderTs(model) {
  const maps = [
    tsMap('colorTokens', 'Color tokens — scales, light semantic aliases, card tints (values: DESIGN.md `colors`).', model.colors.entries),
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
    ' * @tk-kit/tokens — typed token maps (generated).',
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

function mdTable(rows) {
  const table = [['Token', 'Value', 'Notes'], ['---', '---', '---'], ...rows];
  return table.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

/** Wrap a token name/value in markdown code backticks. */
const mdCode = (text) => '`' + text + '`';

/** Notes column: static annotations (TOKEN_NOTES) plus any DESIGN.md `note:` field carried on the entry. */
function noteOf(entry) {
  return [TOKEN_NOTES.get(entry.name), entry.note].filter(Boolean).join(' ');
}

function renderMd(model) {
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
  lines.push('# @tk-kit/tokens — canonical token listing', '');
  lines.push('GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.', '');
  lines.push(
    `- Source of truth: \`${DESIGN_MD_PATH}\` frontmatter — blocks \`colors\`, \`typography\`, \`rounded\`, \`spacing\`, \`shadows\`, \`motion\`.`,
    '- The `components:` frontmatter block is consumer spec prose — never rendered.',
    '- The z-scale is scaffold mechanics, not an extraction (own section below).',
    '- Dark values (the `dark-*` color entries) are **not** part of the light layer — Story 1.3 emits the dark layer on `[data-theme="dark"]` (see "Deferred to the dark layer").',
    '- `[ASSUMPTION]` flags ship with their values (DESIGN.md body marks them); they are resolved by Stories 3.6/5.6, never silently dropped.',
    '',
  );
  lines.push(
    `Light layer: **${total} tokens** on \`:host, :root\` (${counts.map(([block, count]) => `${block} ${count}`).join(', ')}).`,
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
    "The first family of each slot is the **consumer brand-font slot** (OQ-2 — the reference's `dsHeading`/`dsText` are proprietary and never bundled). Point it at a licensed brand font or a metric-compatible open alternative; recommended default: **Inter**. Heading and body slots share DESIGN.md's single fallback stack and are overridden independently.",
    '',
    'Override recipe (custom properties cascade and inherit — declare on `body`/your app root, or any later or higher-specificity declaration):',
    '',
    '```css',
    ":root { --tk-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; }",
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

  lines.push('## Deferred to the dark layer (Story 1.3)', '');
  lines.push(
    'These DESIGN.md `colors` entries are dark-theme palette values; the light layer intentionally does not render them. **Override model:** the dark layer re-declares the SEMANTIC names (`--tk-color-surface-base`, `--tk-color-surface-muted`, `--tk-color-text-primary`, …) on `[data-theme="dark"]`; the `dark-*` keys below are the palette SOURCE for that mapping, never the consumed names — components always reference semantic tokens, never `--tk-color-dark-*`. The `dark-tint-*` values are first-pass `[ASSUMPTION]` in DESIGN.md — their flags land with that layer.',
    '',
  );
  lines.push(colors.deferred.map((name) => `- \`${name}\``).join('\n'), '');
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
  assertAnnotationConsistency(model, allNames);
  return {
    tokensCss: renderCss(model),
    tokensTs: renderTs(model),
    tokensMd: renderMd(model),
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
    'gen:tokens: rendered light-layer artifacts -> src/tokens.css, src/tokens.ts, src/TOKENS.md',
  );
}
