/**
 * Token-generation core — the kit-agnostic mechanism (story 15.2, AD-3 v5:
 * ONE mechanism, TWO inputs). Extracted from packages/tokens/scripts/
 * generate.mjs (stories 1.2–9.2): everything a token pipeline does lives HERE
 * as pure functions parameterized by a per-kit config — parse/validate, the
 * value grammar, `{block.ref}` resolution, the dark-layer mapping model, the
 * aa-annotations derivation, and the CSS/TS/MD renderers.
 *
 * Consumers (thin config'd CLIs, never forks):
 *   - packages/tokens/scripts/generate.mjs     (bank: --tk-, data-theme,
 *     scale+aliases light mode, manual dark, z-scale, Daytona prose)
 *   - packages/tj-tokens/scripts/generate.mjs  (ТЖ: --tj-, data-tj-theme,
 *     direct-keys light mode, native-auto dark — lands with the 15.2
 *     continuation once the ТЖ DESIGN.md dark-completeness amendment is in)
 *
 * Root placement is the FR-17 ruling (ad4-matrix.mjs precedent): root is
 * shared tooling, not a package — the ТЖ CLI imports it with zero edges on
 * packages/**, so both families stay installable alone.
 *
 * PURITY CONTRACT: this module imports NOTHING but the YAML parser — no fs, no
 * process, no paths. `createTokenGenerator(config)` returns a
 * `renderArtifacts(designText)` pure function so drift tests import it exactly
 * as the bank's always did (tests/tokens-drift.test.ts). Determinism:
 * regenerating an unchanged DESIGN.md is byte-stable; anything unexpected
 * aborts by throwing (the CLI maps that to exit 1).
 *
 * Invariants carried from the bank mold (unchanged in meaning):
 * - The `components:` frontmatter block is consumer spec prose — never rendered.
 * - The `aa-annotations:` block is the machine source for every AA-bearing
 *   color note; notes DERIVE from it and must anchor in the Colors body.
 * - `dark-*` color entries are the palette SOURCE for the dark layer — never
 *   emitted as custom properties, never rendered into the light layer; every
 *   `dark-*` key must be consumed (override or deferral) or generation aborts.
 * - Colors-block values are hex literals, verbatim `rgba()` extractions, or
 *   `{colors.<key>}` references resolving transitively to a terminal literal.
 */

import { parse } from 'yaml';

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

/**
 * Every frontmatter key any kit may carry. Token blocks are the UNION across
 * kits; which are REQUIRED is per-kit config (`requiredBlocks`) — the bank
 * requires all seven, the ТЖ table has no `fonts` block (15.3 owns fonts).
 */
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

// ---------------------------------------------------------------------------
// Value grammar — shared regexes (kit-agnostic by construction)
// ---------------------------------------------------------------------------

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGBA_RE = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d(?:\.\d+)?)\)$/;
const COLOR_REFERENCE_RE = /^\{colors\.([a-z0-9-]+)\}$/;
/** Typography family references (ТЖ slot-refs grammar): `{typography.<slot>}`. */
const TYPOGRAPHY_REFERENCE_RE = /^\{typography\.([a-z0-9-]+)\}$/;
const PX_RE = /^\d+(\.\d+)?px$/;
/** Percent radius values (`badge: 50%` — the ТЖ circle carrier); opt-in per kit. */
const PERCENT_RE = /^\d+(\.\d+)?%$/;
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
 * Build the per-kit generator. The config is the WHOLE per-kit surface (the
 * bank's former module-level literals); the returned `renderArtifacts` is the
 * pure render pipeline. `config.tokenNoteLiterals` is read at RENDER time so
 * the drift tests' in-place canary mutations are observed (bank mold).
 */
export function createTokenGenerator(config) {
  const { prefix, themeAttribute } = config;
  const colorName = (key) => `${prefix}color-${key}`;

  // -------------------------------------------------------------------------
  // Frontmatter parsing (pure — design text in, validated document out)
  // -------------------------------------------------------------------------

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
    for (const block of config.requiredBlocks) {
      assert(block in doc, `frontmatter is missing the '${block}' token block`);
    }
    return doc;
  }

  // -------------------------------------------------------------------------
  // Colors model — literal grammar + reference resolution + light emission
  // -------------------------------------------------------------------------

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
   * grammar) — pass-1 syntax validation alone cannot guarantee that. The
   * one-way-flow hardening (6.1 triage) stays: a light-layer declaration would
   * emit the dark value verbatim — the flow is one-way (the dark layer sources
   * dark-* keys; nothing in the light layer ever resolves to them).
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
   * Colors: non-dark entries + the configured light semantic aliases; `dark-*`
   * keys feed the dark layer. Two-pass (spec 6.1): pass 1 validates every
   * value's literal grammar, pass 2 resolves `{colors.<key>}` references —
   * emitted declarations carry the RESOLVED value (the v1 light-alias
   * precedent: consumers see real values, contrast math stays trivial). The
   * bank emits scale+aliases (aliases bridge scales to semantics); the ТЖ
   * table IS semantic — direct keys + the link/engage aliases. Mechanically
   * one path; the difference is config.
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
        entries.push({ name: colorName(key), value: byKey[key] });
      }
    }
    for (const alias of config.lightSemanticAliases) {
      assert(
        alias.scale in colors,
        `light semantic alias '${alias.name}' aliases scale '${alias.scale}' which does not exist in colors — update the alias after a DESIGN.md rename`,
      );
      entries.push({ name: alias.name, value: byKey[alias.scale] });
    }
    return { entries, byKey };
  }

  // -------------------------------------------------------------------------
  // Dark layer model — `dark-*` palette keys → semantic overrides
  // -------------------------------------------------------------------------

  /**
   * Validate the dark mapping against the parsed colors and the light-layer
   * names, then materialize the override list. Loud failures (spec 1.3 I/O
   * matrix): an unconsumed `dark-*` key aborts naming the key; a mapped
   * semantic name missing from the light layer aborts (the dark layer
   * re-declares names, it never introduces them). Kit-specific derivation
   * anchors (the bank's border-strong arithmetic, theme-invariant equalities)
   * ride in `config.darkAsserts` and run against the resolved palette.
   */
  function darkLayerModel(colors, lightNames) {
    const light = new Set(lightNames);
    const sources = new Set();
    const targeted = new Set();
    const overrides = config.darkOverrides.map((entry) => {
      assert(
        !targeted.has(entry.name),
        `dark overrides: '${entry.name}' is targeted twice — one override per semantic name`,
      );
      targeted.add(entry.name);
      assert(
        colors[entry.source] !== undefined,
        `dark overrides: '${entry.name}' sources '${entry.source}' which does not exist in colors — update the mapping after a DESIGN.md rename`,
      );
      sources.add(entry.source);
      assert(
        light.has(entry.name),
        `dark overrides target '${entry.name}' which the light layer does not declare — the dark layer re-declares semantic names, it never introduces them`,
      );
      if (entry.derived !== undefined) {
        assert(
          HEX_RE.test(entry.derived),
          `dark overrides: derived value ${JSON.stringify(entry.derived)} for '${entry.name}' is not a hex color — derived overrides go through the same grammar as palette values`,
        );
      }
      return {
        name: entry.name,
        value: entry.derived ?? colors[entry.source],
        source: entry.source,
        derived: entry.derived,
      };
    });
    for (const extraAssert of config.darkAsserts ?? []) {
      extraAssert(colors, fail);
    }
    const deferred = [];
    for (const key of Object.keys(colors)) {
      if (!key.startsWith('dark-')) continue;
      if (sources.has(key) || config.darkDeferred.has(key)) continue;
      fail(
        `colors.${key}: dark palette key is not consumed — add it to the dark overrides or the deferral list deliberately (no silent drops)`,
      );
    }
    for (const key of config.darkDeferred.keys()) {
      assert(
        colors[key] !== undefined,
        `dark deferrals: '${key}' does not exist in colors — stale deferral entry after a DESIGN.md rename`,
      );
      assert(
        !sources.has(key),
        `dark deferrals list '${key}' which the dark overrides also consume — a dark palette key gets exactly one disposition (override OR deferral), not both`,
      );
      deferred.push(key);
    }
    for (const invariant of config.darkInvariants) {
      assert(
        light.has(invariant.name),
        `dark invariants reference '${invariant.name}' which the light layer does not declare — update the invariant list`,
      );
      assert(
        !targeted.has(invariant.name),
        `dark invariants list '${invariant.name}' which the dark overrides also target — an invariant cannot be overridden`,
      );
    }
    for (const name of config.darkTokenNotes.keys()) {
      assert(
        targeted.has(name),
        `dark token notes reference '${name}' which the dark layer does not override — update the annotations`,
      );
    }
    return { overrides, deferred, invariants: config.darkInvariants };
  }

  // -------------------------------------------------------------------------
  // Typography / fonts / px-mappings / shadows / motion models
  // -------------------------------------------------------------------------

  /**
   * Typography — two family grammars, config-selected:
   *
   * 'inline-groups' (the bank mold): every slot is a mapping whose optional
   * `fontFamily` is a LITERAL stack; slots named `heading-*` must share one
   * stack and all other slots another (the OQ-2 two-stack resolution). The
   * family slots DERIVE from the groups (`--<prefix>font-heading/body`) — no
   * per-slot family token is emitted.
   *
   * 'slot-refs' (the ТЖ grammar): standalone STRING entries in the typography
   * block declare the family slots themselves (`font-ui` / `font-reading` →
   * `--tj-font-ui` / `--tj-font-reading`); every mapping slot's `fontFamily`
   * must be a `{typography.<slot>}` REFERENCE resolving to a declared slot —
   * literal stacks inside mapping entries abort (one declaration site per
   * family, the AD-3 discipline at the typography layer). References VALIDATE
   * and resolve; emission stays the two slots.
   */
  function typographyModel(typography) {
    assertNonEmptyMapping(typography, 'typography');
    const allowed = new Set(['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontFamily', 'note']);
    const grammar = config.typographyFamilyGrammar;
    const entries = [];
    const stringSlots = [];
    const mappingSlots = [];
    for (const [slot, spec] of Object.entries(typography)) {
      assertKey(slot, `typography.${slot}`);
      if (typeof spec === 'string') {
        assert(
          grammar === 'slot-refs',
          `typography.${slot}: a standalone string entry is the slot-refs grammar — this kit's config declares '${grammar}'`,
        );
        assertValue(spec, `typography.${slot}`);
        stringSlots.push({ slot, stack: spec });
        continue;
      }
      mappingSlots.push({ slot, spec });
    }
    assert(
      grammar !== 'slot-refs' || stringSlots.length > 0,
      'typography: the slot-refs grammar requires at least one standalone string family slot (font-ui/…)',
    );
    const slotStacks = new Map(stringSlots.map(({ slot, stack }) => [slot, stack]));
    const resolveFamily = (slot, raw) => {
      const reference = TYPOGRAPHY_REFERENCE_RE.exec(raw);
      if (reference === null) return raw;
      assert(
        grammar === 'slot-refs',
        `typography.${slot}.fontFamily: a {typography.<slot>} reference is the slot-refs grammar — this kit's config declares '${grammar}'`,
      );
      const target = reference[1];
      assert(
        slotStacks.has(target),
        `typography.${slot}.fontFamily: reference target 'typography.${target}' does not exist — family references must name a standalone string slot`,
      );
      assert(
        target !== slot,
        `typography.${slot}.fontFamily: self-reference 'typography.${slot}' — a family reference must name another slot`,
      );
      return slotStacks.get(target);
    };
    const headingFamilies = new Set();
    const bodyFamilies = new Set();
    for (const { slot, spec } of mappingSlots) {
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
      entries.push({ name: `${prefix}text-${slot}-size`, value: spec.fontSize, note });
      entries.push({ name: `${prefix}text-${slot}-weight`, value: spec.fontWeight });
      if ('lineHeight' in spec) {
        assert(
          typeof spec.lineHeight === 'string' &&
            (/^\d+(\.\d+)?$/.test(spec.lineHeight) || PX_RE.test(spec.lineHeight)),
          `typography.${slot}.lineHeight: expected a unitless ratio or px, got ${JSON.stringify(spec.lineHeight)}`,
        );
        assertValue(spec.lineHeight, `typography.${slot}.lineHeight`);
        entries.push({ name: `${prefix}text-${slot}-leading`, value: spec.lineHeight });
      }
      if ('letterSpacing' in spec) {
        assert(
          typeof spec.letterSpacing === 'string' && SIGNED_PX_RE.test(spec.letterSpacing),
          `typography.${slot}.letterSpacing: expected <n>px, got ${JSON.stringify(spec.letterSpacing)}`,
        );
        assertValue(spec.letterSpacing, `typography.${slot}.letterSpacing`);
        entries.push({ name: `${prefix}text-${slot}-tracking`, value: spec.letterSpacing });
      }
      if ('fontFamily' in spec) {
        assert(
          typeof spec.fontFamily === 'string' && spec.fontFamily.trim().length > 0,
          `typography.${slot}.fontFamily: expected a font stack string`,
        );
        // A raw {typography.<slot>} reference never emits as-is — its `}` trips
        // the emission guard — so the RESOLVED stack is value-checked instead
        // (the colors-reference mold: emitted declarations carry the terminal).
        const stack = resolveFamily(slot, spec.fontFamily);
        if (TYPOGRAPHY_REFERENCE_RE.test(spec.fontFamily)) {
          assertValue(stack, `typography.${slot}.fontFamily (reference-resolved)`);
        } else {
          assertValue(spec.fontFamily, `typography.${slot}.fontFamily`);
        }
        if (grammar === 'inline-groups') {
          (slot.startsWith('heading-') ? headingFamilies : bodyFamilies).add(stack);
        }
      }
    }
    if (grammar === 'inline-groups') {
      // OQ-2 resolution (2026-09-22): each group must agree internally; a slot
      // drifting its stack aborts generation.
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
          { name: `${prefix}font-heading`, value: [...headingFamilies][0] },
          { name: `${prefix}font-body`, value: [...bodyFamilies][0] },
        ],
      };
    }
    return {
      entries,
      // The string slots conventionally carry a `font-` key prefix inside the
      // typography block (their namespace there); the EMISSION prefix already
      // carries the family role, so it is stripped — `font-ui` emits
      // `--tj-font-ui`, never `--tj-font-font-ui`. A table declaring both
      // `ui` and `font-ui` collides and dies on the duplicate-name assert.
      fontSlots: stringSlots.map(({ slot, stack }) => ({
        name: `${prefix}font-${slot.replace(/^font-/, '')}`,
        value: stack,
      })),
    };
  }

  /**
   * Fonts — standalone family slots OUTSIDE the per-slot typography block (the
   * bank `fonts.mono` mold, story 9.1). The allowed-key set is per-kit config —
   * a new family slot wires in deliberately, never by guessing. The block is
   * required only where the kit's `requiredBlocks` lists it (the ТЖ table has
   * none until 15.3).
   */
  function fontsModel(fonts) {
    if (fonts === undefined) return [];
    assertNonEmptyMapping(fonts, 'fonts');
    const allowed = new Set(config.fontsAllowedKeys);
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
      entries.push({ name: `${prefix}font-${slot}`, value });
    }
    return entries;
  }

  /**
   * Rounded / spacing share one shape: flat <n>px mapping under a token prefix.
   * `allowPercent` widens the rounded grammar to `<n>%` for kits whose table
   * carries a circular-badge radius (the ТЖ `badge: 50%`) — spacing stays px-only.
   */
  function pxMappingModel(block, at, tokenPrefix, allowPercent = false) {
    assertNonEmptyMapping(block, at);
    const entries = [];
    for (const [key, value] of Object.entries(block)) {
      assertKey(key, `${at}.${key}`);
      assert(
        typeof value === 'string' && (PX_RE.test(value) || (allowPercent && PERCENT_RE.test(value))),
        `${at}.${key}: expected <n>px${allowPercent ? ' or <n>%' : ''}, got ${JSON.stringify(value)}`,
      );
      assertValue(value, `${at}.${key}`);
      entries.push({ name: `${tokenPrefix}${key}`, value });
    }
    return entries;
  }

  /** Shadows: `default-hover` is rendered as `--<prefix>shadow-hover` (spec 1.2 naming grammar). */
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
      entries.push({ name: `${prefix}shadow-${renames[key] ?? key}`, value });
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
      entries.push({ name: `${prefix}motion-${key}`, value });
    }
    return entries;
  }

  // -------------------------------------------------------------------------
  // AA annotations (story 9.2) — derived from the DESIGN.md `aa-annotations:`
  // frontmatter block; shared grammar, per-kit prefix
  // -------------------------------------------------------------------------

  const AA_KINDS = new Set(['override', 'addition', 'restricted', 'pairing', 'measured']);
  const AA_STATUSES = new Set(['verified', 'assumed']);
  const AA_ENTRY_FIELDS = new Set(['kind', 'status', 'story', 'text']);
  // '24T.2' — capture-wave stories carry a letter suffix (24T.1/24T.2); the
  // plain N.N shape stays the common case (grammar widened 24T.2).
  const AA_STORY_RE = /^\d+[A-Z]?\.\d+$/;

  /**
   * The AA-class test (spec 9.2): a note is AA-bearing when its text carries a
   * contrast ratio (`N.NNN:1`) or an explicit AA ruling. Every AA-bearing note
   * must live in the DESIGN.md block — a literal that matches is an abort.
   */
  const AA_RATIO_RE = /\d+\.\d+:1/;
  const AA_CLASS_RE = /\bAA\b/;
  const isAaBearing = (text) => AA_RATIO_RE.test(text) || AA_CLASS_RE.test(text);

  /**
   * Note prefix per kind (executor pin, spec 9.2 Implementation Notes): override
   * and addition read "AA <kind> — ", restricted reads "Restricted: ", measured
   * interpolates its story pointer ("Measured (Story N.N) — "). The pairing kind
   * injects NOTHING: its notes open with the pairing narrative itself — pinned
   * by byte-identity of the regenerated artifacts.
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
   * key, at an indented `aa-annotations:` key, or at the `---` fence end: the
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
   * names — an alias entry names the alias semantic). Every derived note must
   * ANCHOR in the Colors body / colors frontmatter: at least one line there
   * carries the entry's token ref together with a factual substring from its
   * text — a Colors-body edit that removes the anchored fact aborts generation
   * instead of shipping a stale annotation. `status: assumed` emits a leading
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
    assert(
      anchorLines.some((line) => line.trim() !== ''),
      'DESIGN.md Colors body / colors frontmatter not found — the aa-annotations anchor space is missing',
    );
    const derived = new Map();
    for (const [name, spec] of Object.entries(block)) {
      assertKey(name, `aa-annotations.${name}`);
      assert(
        lightNameSet.has(colorName(name)),
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
      const anchored = anchorLines.some((line) => refRe.test(line) && facts.some((fact) => line.includes(fact)));
      assert(
        anchored,
        `aa-annotations.${name}: note no longer anchors in DESIGN.md — no Colors-body/frontmatter line carries the token ref '${name}' together with a factual substring (${facts.slice(0, 4).join(', ')}${facts.length > 4 ? ', …' : ''}) from its text; restore the anchor or re-record the annotation deliberately`,
      );
      derived.set(colorName(name), { ...entry, note, tokenName: colorName(name) });
    }
    return derived;
  }

  /**
   * The LIVE annotation map the renderers read — the kit's literal notes plus
   * the AA notes derived from the DESIGN.md `aa-annotations:` block, rebuilt on
   * every `renderArtifacts` call (deterministic; no cross-render state). Enforces
   * the both-direction migration aborts (spec 9.2): a literal for a name also in
   * the block is a double source; an AA-class literal without a block entry
   * aborts. The literals map is read FROM CONFIG at render time so the drift
   * tests' in-place canary mutations are observed.
   */
  const tokenNotes = new Map();
  function mergeAaNotes(derived) {
    const literals = config.tokenNoteLiterals;
    for (const tokenName of derived.keys()) {
      assert(
        !literals.has(tokenName),
        `token note literals still carry '${tokenName}' which the aa-annotations block also defines — double source; the literal must die`,
      );
    }
    for (const [tokenName, literal] of literals) {
      assert(
        derived.has(tokenName) || !isAaBearing(literal),
        `token note literal '${tokenName}' is AA-bearing (a contrast ratio or an AA ruling) but has no aa-annotations entry — AA-bearing notes must derive from the DESIGN.md block`,
      );
    }
    tokenNotes.clear();
    for (const [tokenName, literal] of literals) tokenNotes.set(tokenName, literal);
    for (const [tokenName, { note }] of derived) tokenNotes.set(tokenName, note);
    return derived;
  }

  /**
   * Annotation consistency (the 9.2 equalities): alias-to-scale equalities are
   * per-kit config (`annotationEqualities` — [semantic, scale] pairs checked on
   * the REFERENCE-RESOLVED palette), and every configured light semantic alias
   * must still render its scale's value. Every note must name a rendered token.
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
    for (const [semantic, scale] of config.annotationEqualities ?? []) expectAlias(semantic, scale);
    for (const alias of config.lightSemanticAliases) {
      const rendered = model.colors.entries.find((entry) => entry.name === alias.name);
      assert(
        rendered !== undefined && rendered.value === colors[alias.scale],
        `TOKEN_NOTES drift: semantic alias '${alias.name}' no longer equals scale '${alias.scale}' (${colors[alias.scale]}) — update the annotation`,
      );
    }
    for (const name of tokenNotes.keys()) {
      assert(
        allNames.includes(name),
        `TOKEN_NOTES references '${name}' which is not rendered — update the annotations`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // Rendering — tokens.css
  // -------------------------------------------------------------------------

  function cssRule(comment, declarations) {
    const lines = [];
    if (comment) lines.push(`/* ${comment} */`);
    lines.push(':host,', ':root {');
    lines.push(...declarations);
    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Dark-layer rule (manual mode, the bank mold) — the selectors only match
   * under the kit's theme attribute: `:root[<attr>="dark"]` flips the document
   * (attribute on <html>), `:host([<attr>="dark"])` lets a shadow host carry
   * the theme context; custom properties then inherit into every shadow tree.
   */
  function darkRule(comment, declarations) {
    const lines = [];
    if (comment) lines.push(`/* ${comment} */`);
    lines.push(`:host([${themeAttribute}="dark"]),`, `:root[${themeAttribute}="dark"] {`);
    lines.push(...declarations);
    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Native-auto dark rule (ТЖ, EXPERIENCE.md contract): the SAME overrides ride
   * a second, attribute-free selector inside `@media (prefers-color-scheme:
   * dark)` scoped to `:root:not([<attr>="light"])` — the OS preference applies
   * dark UNLESS the light-forcing attribute holds (the no-flash contract:
   * `data-tj-theme="light"` keeps light values under a dark OS). The :host form
   * mirrors the shadow-root channel.
   */
  function darkAutoRule(comment, declarations) {
    const lines = [];
    if (comment) lines.push(`/* ${comment} */`);
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push(`:host(:not([${themeAttribute}="light"])),`, `:root:not([${themeAttribute}="light"]) {`);
    lines.push(...declarations);
    lines.push('}');
    lines.push('}');
    return lines.join('\n');
  }

  function declarationLines(entries, notes = tokenNotes) {
    const lines = [];
    for (const { name, value } of entries) {
      const note = notes.get(name);
      if (note) lines.push(`  /* ${note} */`);
      lines.push(`  ${name}: ${value};`);
    }
    return lines;
  }

  function renderCss(model, dark) {
    const css = config.css;
    const parts = [];
    parts.push(css.header.join('\n'));
    parts.push(cssRule(css.colorsComment, declarationLines(model.colors.entries)));
    parts.push(
      cssRule(css.typographyComment, [
        ...declarationLines(model.typography.entries),
        '',
        ...(css.fontSlotComment ?? []),
        ...model.typography.fontSlots.map(({ name, value }) => `  ${name}: ${value};`),
        ...(css.fontMonoComment ?? []),
        ...model.fonts.map(({ name, value }) => `  ${name}: ${value};`),
      ]),
    );
    parts.push(cssRule(css.radiusComment, declarationLines(model.radius)));
    parts.push(
      cssRule(css.spacingComment, [
        ...(css.spacingNote !== undefined ? [`  /* ${css.spacingNote} */`] : []),
        ...declarationLines(model.space),
      ]),
    );
    parts.push(cssRule(css.shadowsComment, declarationLines(model.shadows)));
    parts.push(cssRule(css.motionComment, declarationLines(model.motion)));
    parts.push(
      [
        '/* Reduced motion — EXPERIENCE.md: durations collapse to 0ms kit-wide (theme-independent:',
        ' * the same duration names are re-declared, so the dark layer inherits this too);',
        ' * components pair it with opacity-only fallbacks. */',
        '@media (prefers-reduced-motion: reduce) {',
        ':host,',
        ':root {',
        ...model.motion
          .filter(({ name }) => name.startsWith(`${prefix}motion-duration-`))
          .map(({ name }) => `  ${name}: 0ms;`),
        '}',
        '}',
      ].join('\n'),
    );
    if (model.z.length > 0) {
      parts.push(cssRule(css.zComment, model.z.map(({ name, value }) => `  ${name}: ${value};`)));
    }
    const darkDeclarations = declarationLines(
      dark.overrides.map(({ name, value }) => ({ name, value })),
      config.darkTokenNotes,
    );
    parts.push(darkRule(css.darkComment, darkDeclarations));
    if (config.darkMode === 'native-auto') {
      parts.push(darkAutoRule(css.darkAutoComment, darkDeclarations));
    }
    if (css.invariantsComment !== undefined) {
      parts.push(css.invariantsComment.join('\n'));
    }
    if (css.darkShadowsComment !== undefined) {
      parts.push(
        darkRule(
          css.darkShadowsComment,
          model.shadows.map(({ name }) => `  ${name}: none;`),
        ),
      );
    }
    return `${parts.join('\n\n')}\n`;
  }

  // -------------------------------------------------------------------------
  // Rendering — tokens.ts (typed maps)
  // -------------------------------------------------------------------------

  function tsMap(constName, doc, entries) {
    return [
      `/** ${doc} */`,
      `export const ${constName} = {`,
      ...entries.map(({ name, value }) => `  '${name}': '${value}',`),
      '} as const;',
    ].join('\n');
  }

  function renderTs(model, dark) {
    const docs = config.ts.mapDocs;
    const maps = [
      tsMap('colorTokens', docs.colorTokens, model.colors.entries),
      tsMap('darkColorTokens', docs.darkColorTokens, dark.overrides),
      tsMap(
        'typographyTokens',
        docs.typographyTokens,
        [...model.typography.entries, ...model.typography.fontSlots, ...model.fonts],
      ),
      tsMap('radiusTokens', docs.radiusTokens, model.radius),
      tsMap('spaceTokens', docs.spaceTokens, model.space),
      tsMap('shadowTokens', docs.shadowTokens, model.shadows),
      tsMap('motionTokens', docs.motionTokens, model.motion),
      ...(model.z.length > 0 ? [tsMap('zTokens', docs.zTokens, model.z)] : []),
    ];
    return [
      ...config.ts.header,
      '',
      maps.join('\n\n'),
      '',
      `/** Every ${prefix}* custom property emitted by the light layer. */`,
      'export const tokens = {',
      '  ...colorTokens,',
      '  ...typographyTokens,',
      '  ...radiusTokens,',
      '  ...spaceTokens,',
      '  ...shadowTokens,',
      '  ...motionTokens,',
      ...(model.z.length > 0 ? ['  ...zTokens,'] : []),
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

  // -------------------------------------------------------------------------
  // Rendering — TOKENS.md (canonical listing)
  // -------------------------------------------------------------------------

  function mdTable(rows, header = ['Token', 'Value', 'Notes']) {
    const table = [header, header.map(() => '---'), ...rows];
    return table.map((row) => `| ${row.join(' | ')} |`).join('\n');
  }

  /** Wrap a token name/value in markdown code backticks. */
  const mdCode = (text) => '`' + text + '`';

  /** Notes column: static annotations plus any DESIGN.md `note:` field carried on the entry. */
  function noteOf(entry) {
    return [tokenNotes.get(entry.name), entry.note].filter(Boolean).join(' ');
  }

  function renderMd(model, dark) {
    const md = config.md;
    const { colors, typography, fonts, radius, space, shadows, motion, z } = model;
    const counts = [
      ['colors', colors.entries.length],
      ['typography', typography.entries.length + typography.fontSlots.length],
      ['fonts', fonts.length],
      ['radius', radius.length],
      ['spacing', space.length],
      ['shadows', shadows.length],
      ['motion', motion.length],
      ...(z.length > 0 ? [['z-scale', z.length]] : []),
    ].filter(([, count]) => count > 0);
    const total = counts.reduce((sum, [, count]) => sum + count, 0);
    // DERIVED [ASSUMPTION] ledger (story 9.2) — the counts and the per-entry
    // story pointers come from the `aa-annotations:` block statuses, so an entry
    // flipping to `assumed` (or resolving) re-derives this line mechanically.
    const aaEntries = [...model.aa.values()];
    const aaOpen = aaEntries.filter((entry) => entry.status === 'assumed');
    const aaResolved = aaEntries.filter((entry) => entry.status === 'verified');
    const aaStatusLine = `- AA-bearing color notes are GENERATED from the DESIGN.md \`aa-annotations:\` block (story 9.2 — the generator literals died; every note must anchor in the Colors body, anchor lost → generation aborts): ${aaEntries.length} entries — ${aaResolved.length} verified / ${aaOpen.length} open \`[ASSUMPTION]\` flags${aaOpen.length > 0 ? ` — OPEN: ${aaOpen.map((entry) => entry.name).join(', ')}` : ''}. Resolved history: ${aaResolved.map((entry) => `${entry.name} (Story ${entry.story})`).join('; ')}.`;
    const lines = [];
    lines.push(md.title, '');
    lines.push(`GENERATED FILE — DO NOT EDIT. Regenerate with \`${config.genCommand}\`.`, '');
    lines.push(...md.sourceBullets, aaStatusLine, '');
    lines.push(md.countsLine({ total, counts, dark, shadows }), '');

    lines.push('## Colors', '');
    lines.push(...md.colorsIntro, '');
    lines.push(mdTable(colors.entries.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

    lines.push('## Typography', '');
    lines.push(...md.typographyIntro, '');
    lines.push(mdTable(typography.entries.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');
    if (typography.fontSlots.length > 0 || fonts.length > 0) {
      lines.push('### Font family slots', '');
      lines.push(
        mdTable([...typography.fontSlots, ...fonts].map(({ name, value }) => [mdCode(name), mdCode(value), ''])),
        '',
      );
    }
    lines.push(...md.fontProse);
    if (md.typographyExtra !== undefined) lines.push(md.typographyExtra, '');

    lines.push('## Radius', '');
    lines.push(...md.radiusIntro, '');
    lines.push(mdTable(radius.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

    lines.push('## Spacing', '');
    lines.push(...md.spacingIntro, '');
    lines.push(mdTable(space.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

    lines.push('## Shadows', '');
    lines.push(...md.shadowsIntro, '');
    lines.push(mdTable(shadows.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');

    lines.push('## Motion', '');
    lines.push(...md.motionIntro, '');
    lines.push(mdTable(motion.map((entry) => [mdCode(entry.name), mdCode(entry.value), noteOf(entry)])), '');
    lines.push(...md.motionProse);
    if (md.motionExtra !== undefined) lines.push(md.motionExtra, '');

    if (z.length > 0) {
      lines.push(...md.zSection.heading, '');
      lines.push(...md.zSection.intro, '');
      lines.push(mdTable(z.map(({ name, value, layer }) => [mdCode(name), mdCode(value), layer])), '');
    }

    lines.push(...md.darkSection.heading, '');
    lines.push(...md.darkSection.intro, '');
    const lightValues = new Map(colors.entries.map(({ name, value }) => [name, value]));
    lines.push(
      mdTable(
        dark.overrides.map(({ name, value, source, derived }) => [
          mdCode(name),
          mdCode(lightValues.get(name) ?? ''),
          mdCode(value),
          derived ? 'derived' : mdCode(`colors.${source}`),
          config.darkTokenNotes.get(name) ?? '',
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
    if (md.darkSection.elevation !== undefined) {
      lines.push(...md.darkSection.elevation.heading, '');
      lines.push(...md.darkSection.elevation.intro, '');
    }
    lines.push('### Deferred dark palette keys', '');
    if (dark.deferred.length === 0) {
      lines.push(
        'None — every `dark-*` palette key is consumed by an override (a new unconsumed `dark-*` key aborts generation — no silent drops).',
        '',
      );
    } else {
      lines.push(
        'Accounted-for `dark-*` keys with no token-layer emission yet (adding a `dark-*` key without an entry here aborts generation — no silent drops):',
        '',
        ...dark.deferred.map((key) => `- \`colors.${key}\` — ${config.darkDeferred.get(key)}`),
        '',
      );
    }
    return lines.join('\n');
  }

  // -------------------------------------------------------------------------
  // Pure render pipeline — design text in, artifact bodies out
  // -------------------------------------------------------------------------

  function renderArtifacts(designText) {
    const doc = parseFrontmatter(designText);
    const model = {
      colors: colorsModel(doc.colors),
      typography: typographyModel(doc.typography),
      fonts: fontsModel(doc.fonts),
      radius: pxMappingModel(doc.rounded, 'rounded', `${prefix}radius-`, config.radiusAllowPercent === true),
      space: pxMappingModel(doc.spacing, 'spacing', `${prefix}space-`),
      shadows: shadowsModel(doc.shadows),
      motion: motionModel(doc.motion),
      z: config.zScale,
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
    // renders (the merged notes map is what the renderers read).
    const aa = mergeAaNotes(aaAnnotationsModel(doc['aa-annotations'], new Set(allNames), designText));
    model.aa = aa;
    assertAnnotationConsistency(model, allNames);
    return {
      tokensCss: renderCss(model, dark),
      tokensTs: renderTs(model, dark),
      tokensMd: renderMd(model, dark),
    };
  }

  return { renderArtifacts, tokenNoteLiterals: config.tokenNoteLiterals };
}
