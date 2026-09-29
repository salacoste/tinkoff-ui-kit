#!/usr/bin/env node
/**
 * pillkit-tj-tokens — generation CLI (story 15.2: ONE mechanism, TWO inputs —
 * the AD-3 v5 second input).
 *
 * The MECHANISM is the repo-root shared core (scripts/token-gen/core.mjs) the
 * bank kit's CLI consumes with the bank config; THIS file is the ТЖ input: a
 * config + a thin CLI wrapper. FR-17 holds by construction — the core lives at
 * root (shared tooling, the ad4-matrix.mjs precedent), so this CLI has ZERO
 * import edges on packages/tokens/** and the ТЖ family stays installable alone.
 *
 * ТЖ config deltas vs the bank (everything else is the shared mold):
 * - prefix `--tj-`, theme attribute `data-tj-theme`.
 * - Light emission is DIRECT KEYS: the ТЖ colors table IS semantic (no
 *   scale/alias indirection) — every non-dark key emits, plus the two
 *   spec-authored aliases (`link` = gold-ink light / dark-link dark — THE gold
 *   asymmetry mechanized; `engage` = ink-reference-meta light / dark-engage).
 * - `darkMode: 'native-auto'`: the overrides emit on BOTH
 *   `:host([data-tj-theme="dark"]), :root[data-tj-theme="dark"]` AND inside
 *   `@media (prefers-color-scheme: dark)` on `:root:not([data-tj-theme="light"])`
 *   (+ :host mirror) — the reference's native `prefers-color-scheme` flip with
 *   the no-flash attribute contract (EXPERIENCE.md: `data-tj-theme="light"`
 *   forces light under a dark OS).
 * - Typography grammar 'slot-refs': the two family slots are standalone string
 *   entries (`font-ui` = Graphik, `font-reading` = Charter, FR-20); every
 *   mapping slot's `fontFamily` is a `{typography.<slot>}` reference. No fonts
 *   block (15.3 owns fonts — stacks render as DESIGN.md strings).
 * - The dark values are the reference's OWN (extraction, not authoring).
 * - The z-scale (16.5) is scaffold mechanics, not a DESIGN.md extraction —
 *   AUTHORED at the story that opened the family's first overlay surface
 *   (the rail's burger drawer); the bank AD-12 scale is the reference
 *   precedent (the CLI's own 15.2 comment said exactly this). Shadows do
 *   NOT collapse in dark (the ТЖ overlay shadow is theme-invariant).
 *
 * Artifacts (same as the bank mold): src/tokens.css (light + dual-emission
 * dark), src/tokens.ts (typed maps), src/TOKENS.md (canonical listing).
 * tests/tj-tokens-drift.test.ts proves committed == fresh render;
 * tests/tj-contrast.test.ts pins the AA machine truth from the generated maps.
 * Never hand-edit the artifacts; change DESIGN.md and regenerate
 * (`pnpm gen:tokens:tj`).
 */
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createTokenGenerator } from '../../../scripts/token-gen/core.mjs';

const DESIGN_MD = fileURLToPath(
  new URL(
    '../../../_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md',
    import.meta.url,
  ),
);
const OUT_CSS = fileURLToPath(new URL('../src/tokens.css', import.meta.url));
const OUT_TS = fileURLToPath(new URL('../src/tokens.ts', import.meta.url));
const OUT_MD = fileURLToPath(new URL('../src/TOKENS.md', import.meta.url));

// ---------------------------------------------------------------------------
// ТЖ config — the whole per-kit surface (story 15.2). Values are the amended
// DESIGN.md's own (dark-completeness keys dark-ink/dark-divider-strong landed
// by the orchestrator per the step-1 proposal; every ratio comment in DESIGN.md
// is machine-trued to 3 decimals).
// ---------------------------------------------------------------------------

const DESIGN_MD_PATH = '_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md';

/**
 * The two spec-authored light aliases (the bank `link`/`error` mold): the ТЖ
 * table has no scales to bridge, but `link` and `engage` must exist as semantic
 * names in BOTH themes so the dark layer can override them — `--tj-color-link`
 * light-sources link-body and dark-sources dark-link (probe10, 16.1 pre-work:
 * the reference's OWN link species is the extracted interactive pair #1414CC/
 * #93A2FF — the 15.2 gold-ink pairing re-roled gold to the award accent);
 * `--tj-color-engage` light-sources ink-reference-meta and dark-sources
 * dark-engage.
 */
const LIGHT_SEMANTIC_ALIASES = [
  { name: '--tj-color-link', scale: 'link-body' },
  { name: '--tj-color-engage', scale: 'ink-reference-meta' },
];

/**
 * The dark layer (spec 15.2 frozen mapping + the dark-completeness proposal,
 * landed in DESIGN.md): the reference's OWN dark values, re-declared
 * semantically. dark-meta feeds TWO overrides (the bank dark-link
 * source-reuse precedent): the authored ink-300 step collapses onto it and the
 * reference meta ink remaps to it.
 */
const DARK_OVERRIDES = [
  { name: '--tj-color-page', source: 'dark-page' },
  { name: '--tj-color-card', source: 'dark-card' },
  { name: '--tj-color-divider', source: 'dark-divider' },
  { name: '--tj-color-divider-strong', source: 'dark-divider-strong' },
  { name: '--tj-color-ink-100', source: 'dark-ink' },
  { name: '--tj-color-ink-300', source: 'dark-meta' },
  { name: '--tj-color-ink-reference-meta', source: 'dark-meta' },
  { name: '--tj-color-cta-fill', source: 'dark-cta-fill' },
  { name: '--tj-color-cta-ink', source: 'dark-cta-ink' },
  { name: '--tj-color-link', source: 'dark-link-body' },
  { name: '--tj-color-engage', source: 'dark-engage' },
  // probe10 (16.1 pre-work): the link species + focus ring join the dark layer —
  // dark-link-body/dark-focus-ring resolve from the palette below (the 15.2
  // dark-link gold carrier is retired; the alias and the direct token now
  // source the SAME key, one literal).
  { name: '--tj-color-link-body', source: 'dark-link-body' },
  { name: '--tj-color-focus-ring', source: 'dark-focus-ring' },
];

/**
 * None — the dark-completeness pass consumed every `dark-*` key (page, card,
 * divider, divider-strong, ink, meta, engage, cta-fill, cta-ink, link) and
 * probe10 added link-body/focus-ring overrides for both. The empty map stays
 * explicit: a NEW `dark-*` key still aborts generation until it gets a
 * disposition (no silent drops — the bank invariant, second instance).
 */
const DARK_DEFERRED = new Map([]);

/**
 * Semantics deliberately NOT re-declared in dark — evidence per key (pixel
 * census / probe-notes, story 15.2 step 1; link roles re-anchored probe10):
 * - gold: the anchor + decorative/award carrier; it clears AA on dark surfaces
 *   (5.876:1 on dark-card) where award text may use it directly.
 * - gold-ink: the light-only authored AA step for gold TEXT accents (award/
 *   byline chrome — probe10 re-roled the link species onto link-body).
 * - badge-purple: present in the dark viewport census (#8054FF ×537) — the
 *   30×30 badge stays purple (scoped non-text carrier).
 * - ink-200: #333 appears only as the CTA fill in light; the cta-fill semantic
 *   carries the flip; strong-UI-ink duty in dark belongs to ink-100/dark-ink.
 * - ink-reference-time: unbound in dark (dark-article unprobed; keeping
 *   #808080 renders 3.982:1 on dark-card — restricted class either way);
 *   the 17.2 dark sweep decides whether it joins dark-meta.
 */
const DARK_INVARIANTS = [
  { name: '--tj-color-gold', why: 'the anchor + decorative/award carrier — clears AA on dark surfaces (5.876:1 on dark-card)' },
  { name: '--tj-color-gold-ink', why: 'light-only authored AA step for gold TEXT accents — award/byline chrome (probe10 re-roled the link species)' },
  { name: '--tj-color-badge-purple', why: 'the 30×30 badge stays purple in dark (census #8054FF ×537 present; scoped non-text carrier)' },
  { name: '--tj-color-ink-200', why: 'light CTA fill duty only — the cta-fill semantic carries the flip; dark strong-UI ink is ink-100/dark-ink' },
  { name: '--tj-color-ink-reference-time', why: 'unbound in dark (dark-article unprobed; 3.982:1 on dark-card stays restricted class) — the 17.2 dark sweep decides' },
];

/**
 * Dark-layer annotations — rendered as comments in the dark rules and the
 * TOKENS.md dark table. The restricted rulings' machine truth lives in
 * tests/tj-contrast.test.ts (3-decimal pins from the generated maps).
 */
const DARK_TOKEN_NOTES = new Map([
  [
    '--tj-color-ink-100',
    'Extraction — dark-ink #FFFFFF: the dark-home pixel census grounds pure-white headline ink (#FFFFFF ×15051 in title bands vs meta #D0D0D2 ×2370); 15.727:1 on dark-card. Dark-article unprobed — 17.2 re-verifies.',
  ],
  [
    '--tj-color-ink-300',
    'Collapse — the authored light-only AA step (5.099:1) has no dark twin; dark-meta #D0D0D2 (10.211:1 on dark-card) already clears AA.',
  ],
  [
    '--tj-color-ink-reference-meta',
    'Remap — #A6A6A6 vanishes in dark (census ~76px, artwork-adjacent); dark-meta #D0D0D2 carries the duty. The LIGHT restricted ruling (2.434:1) is untouched — the annotation is a light-theme statement.',
  ],
  [
    '--tj-color-link',
    'Probe10 — the link species is the reference\'s OWN interactive pair: light #1414CC (10.491:1 on card), dark #93A2FF (6.630:1 on dark-card). The 15.2 gold pairing is retired; gold is the award accent.',
  ],
  [
    '--tj-color-link-body',
    'Probe10 — the reference dark --outline-interactive; the alias and this direct token source the SAME key (one literal).',
  ],
  [
    '--tj-color-focus-ring',
    'Improvement layer — the reference NAMES --outline-focus but under-applies it (probe10); dark #828BBB = 4.763:1 non-text on dark-card. 2px :focus-visible rings on every interactive.',
  ],
  [
    '--tj-color-engage',
    'Restricted — dark-engage #717277 = 3.277:1 on dark-card: counts/secondary affordances only. The light engage alias rides ink-reference-meta (2.434:1, also restricted).',
  ],
]);

/**
 * ТЖ has no literal note residue day one — every AA-bearing note derives from
 * the DESIGN.md `aa-annotations:` block (the bank 9.2 mold; the ТЖ block is
 * complete for its five AA-bearing semantics). Non-AA literals may join later.
 */
const TOKEN_NOTE_LITERALS = new Map([]);

/**
 * Z-scale (Story 16.5) — scaffold mechanics, not a DESIGN.md extraction (the
 * bank Z_SCALE grammar verbatim, second instance). Stacking order is fixed
 * by the AD-12 usage ruling (z-order comes only from --tj-z-*; the ТЖ overlay
 * helper owns every floating surface); values leave one spare slot between
 * layers so future surfaces never collide with neighbors. AUTHORED, not
 * probed — the cross-origin wall kept the reference's own stacking
 * unobservable; the bank AD-12 scale is the reference precedent (exactly
 * what this CLI's 15.2 comment predicted: "a story needing one amends
 * DESIGN.md first" — 16.5 minted it here instead, two tokens at the roster's
 * honest size, not the bank's six; mint-grow only when a surface demands it).
 */
const Z_SCALE = [
  { name: '--tj-z-nav', value: '100', layer: 'sticky site chrome (tj-header)' },
  { name: '--tj-z-drawer', value: '300', layer: 'the rail burger sheet + scrim (focus-trapped, scroll-locked)' },
];

const TJ_CONFIG = {
  prefix: '--tj-',
  themeAttribute: 'data-tj-theme',
  requiredBlocks: ['colors', 'shadows', 'motion', 'typography', 'rounded', 'spacing'],
  // No fonts block in the ТЖ table (15.3 owns fonts); an early fonts key must
  // wire deliberately — the allowed set is empty until 15.3 amends it.
  fontsAllowedKeys: [],
  typographyFamilyGrammar: 'slot-refs',
  radiusAllowPercent: true, // `badge: 50%` — the circular carrier; everything else px
  lightSemanticAliases: LIGHT_SEMANTIC_ALIASES,
  darkMode: 'native-auto',
  darkOverrides: DARK_OVERRIDES,
  darkDeferred: DARK_DEFERRED,
  darkInvariants: DARK_INVARIANTS,
  darkTokenNotes: DARK_TOKEN_NOTES,
  darkAsserts: [],
  annotationEqualities: [],
  zScale: Z_SCALE,
  tokenNoteLiterals: TOKEN_NOTE_LITERALS,
  genCommand: 'pnpm gen:tokens:tj',
  css: {
    header: [
      '/**',
      ' * pillkit-tj-tokens — token layers (generated): light on `:host, :root`,',
      ' * dark semantic overrides on `[data-tj-theme="dark"]` PLUS the native',
      ' * `prefers-color-scheme: dark` auto leg (Story 15.2).',
      ' *',
      ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens:tj`.',
      ` * Source of truth: ${DESIGN_MD_PATH}`,
      ' * (frontmatter blocks: colors / typography / rounded / spacing / shadows / motion).',
      ' *',
      ' * The `:host` selector keeps every custom property usable inside shadow',
      ' * roots; kit components consume tokens exclusively via var(--tj-*) (FR-1 —',
      ' * zero hard-coded values outside this package).',
      ' */',
    ],
    colorsComment:
      'Colors — DESIGN.md `colors` direct semantic keys (the ТЖ table IS semantic) plus the `link`/`engage` aliases; the `dark-*` entries feed the dark layer below.',
    typographyComment:
      'Typography — DESIGN.md `typography`: per-slot size/weight/leading with `{typography.<slot>}` family references; the family slots themselves are declared below (one declaration site per family).',
    fontSlotComment: [
      '  /* Family slots (FR-20 two-family contract) — ui = Graphik (grotesque,',
      '     UI + all headings), reading = Charter (serif, the article reading',
      '     register). Stacks carry the reference family names first (licensed',
      '     consumers auto-pickup, the OQ-2 policy) with open cyrillic-capable',
      '     fallbacks behind. No font files are bundled here — 15.3 owns fonts;',
      '     these render as DESIGN.md strings. An override replaces the whole',
      '     value: re-include the fallback stack. */',
    ],
    fontMonoComment: undefined,
    radiusComment:
      'Radius — DESIGN.md `rounded` (pixel-probed 2026-09-28: cards 25 / panels 30 — the vision trio deleted; icon-tile 7 on the 30×30 rail tiles; badge 50%). Quiet geometry: r5 CTAs, not pills.',
    spacingComment: 'Spacing — DESIGN.md `spacing`.',
    spacingNote: undefined,
    shadowsComment:
      'Shadows — DESIGN.md `shadows`: FLAT language (the 95-card census measured `none`; surfaces separate by color, not elevation) — the single `overlay` shadow, kept as-is in dark.',
    motionComment:
      'Motion — DESIGN.md `motion` (starting contract = the bank grammar; the ТЖ reference exposed no transitions — per-component verification at each FR-22 gate). AD-9: durations and curves come exclusively from these tokens.',
    zComment:
      'Z-scale (Story 16.5) — scaffold mechanics, not a DESIGN.md extraction. AD-12: z-order comes only from --tj-z-*; the ТЖ overlay helper owns every floating surface. One spare slot (200) between the two layers.',
    darkComment:
      'Dark theme (Story 15.2) — the reference\'s OWN dark values (prefers-color-scheme extraction, not authored), re-declared semantically. Apply via `data-tj-theme="dark"` or let the native auto leg below follow the OS.',
    darkAutoComment:
      'Native dark (auto) — EXPERIENCE.md contract: the same overrides under `prefers-color-scheme: dark`, suppressed only by `data-tj-theme="light"` (no-flash: forced light holds under a dark OS).',
    invariantsComment: [
      '/*',
      ' * Theme invariants — intentionally absent from the dark rules above:',
      ' * --tj-color-gold, --tj-color-gold-ink, --tj-color-badge-purple,',
      ' * --tj-color-ink-200 and --tj-color-ink-reference-time keep their light',
      ' * values (gold stays the anchor/decorative/award carrier, clear of AA on',
      ' * dark surfaces; gold-ink is the light-only AA step for gold text accents;',
      ' * the badge stays purple in dark; ink-200\'s flip rides cta-fill; the',
      ' * time-meta is unbound in dark — 17.2 decides). Typography / radius /',
      ' * spacing / motion / shadows are theme-invariant too — single source in',
      ' * the :host, :root rules.',
      ' */',
    ],
    darkShadowsComment: undefined,
  },
  ts: {
    header: [
      '/**',
      ' * pillkit-tj-tokens — typed token maps (generated).',
      ' *',
      ' * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens:tj`.',
      ` * Source of truth: ${DESIGN_MD_PATH}`,
      ' * (frontmatter blocks; the z-scale is scaffold mechanics authored at 16.5 — the drawer opener).',
      ' * Values mirror src/tokens.css — see src/TOKENS.md for the canonical listing',
      ' * with assumption flags and rationale.',
      ' */',
    ],
    mapDocs: {
      colorTokens:
        'Color tokens — direct semantic keys + the link/engage aliases (values: DESIGN.md `colors`).',
      darkColorTokens:
        'Dark-layer color tokens — the semantic overrides re-declared on `[data-tj-theme="dark"]` and the native auto leg (sources: DESIGN.md `dark-*` palette — the reference\'s own dark values). Not spread into `tokens`: the light layer stays the single name registry.',
      typographyTokens:
        'Typography tokens — per-slot size/weight/leading plus the family slots (values: DESIGN.md `typography`; the Graphik/Charter string slots, FR-20).',
      radiusTokens: 'Radius tokens (values: DESIGN.md `rounded`).',
      spaceTokens: 'Spacing tokens — 4-based scale + ТЖ layout anchors (values: DESIGN.md `spacing`).',
      shadowTokens:
        'Shadow tokens — the single overlay shadow; FLAT language (values: DESIGN.md `shadows`).',
      motionTokens:
        'Motion tokens — expressive/productive curves and the duration scale (values: DESIGN.md `motion`).',
      zTokens:
        'Z-scale — overlay stacking order (Story 16.5); scaffold mechanics fixed by the AD-12 usage ruling, not a DESIGN.md extraction.',
    },
  },
  md: {
    title: '# pillkit-tj-tokens — canonical token listing',
    sourceBullets: [
      `- Source of truth: \`${DESIGN_MD_PATH}\` frontmatter — blocks \`colors\`, \`typography\`, \`rounded\`, \`spacing\`, \`shadows\`, \`motion\`.`,
      '- The `components:` frontmatter block is consumer spec prose — never rendered.',
      '- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tj-color-dark-*` custom properties.',
      '- The z-scale (16.5) is scaffold mechanics, not an extraction (own section below) — AUTHORED at the drawer opener, the bank AD-12 scale as the reference precedent.',
    ],
    countsLine: ({ total, counts, dark }) =>
      `Light layer: **${total} tokens** on \`:host, :root\` (${counts.map(([block, count]) => `${block} ${count}`).join(', ')}) plus the dark layer: **${dark.overrides.length} semantic overrides** on \`[data-tj-theme="dark"]\` AND the native auto leg (\`prefers-color-scheme: dark\` on \`:root:not([data-tj-theme="light"])\`).`,
    colorsIntro: [
      'Direct semantic keys from the `colors` block — the ТЖ table IS semantic (no scale/alias indirection) — plus the `link`/`engage` aliases. Restricted inks carry their AA rulings in the Notes column (derived from the DESIGN.md `aa-annotations:` block).',
    ],
    typographyIntro: [
      'Per-slot tokens from the `typography` block: `--tj-text-<slot>-size` / `-weight` always; `-leading` where DESIGN.md declares it. Families live in the two slots below — every mapping slot\'s `fontFamily` is a `{typography.<slot>}` reference (one declaration site per family, FR-20).',
    ],
    fontProse: [
      'Family slots (FR-20): **ui = Graphik** (grotesque — UI and all headings), **reading = Charter** (serif — the article reading register, the strongest ТЖ identity marker). Stacks carry the reference family names first (licensed consumers auto-pickup, the OQ-2 policy) with open cyrillic-capable fallbacks behind (Inter / PT Serif, OQ-8). No font files are bundled — 15.3 owns fonts; these render as DESIGN.md strings.',
      '',
      'An override replaces the whole value: re-include the fallback stack so the DESIGN.md fallbacks stay preserved.',
      '',
    ],
    typographyExtra: undefined,
    radiusIntro: [
      'Pixel-probed 2026-09-28 (verify/tj-tokens/NOTES.md): cards measure **25** / panels **30** — the vision trio 20/24/32 was deleted (a 9.1 repeat); `icon-tile` measured **7px** on the 30×30 rail tiles; `badge` is a 50% circle. Quiet geometry: r5 CTAs, not pills.',
    ],
    spacingIntro: [
      '4-based scale plus the ТЖ layout anchors (reading column w764/w760, sidebar rail w290, main column ~770, header h72, container 1200). Article rhythm is BYO — the reading column is the unit of measure, not the grid.',
    ],
    shadowsIntro: [
      'FLAT language — the 95-card census measured `box-shadow: none`; surfaces separate by color, not elevation. The single `overlay` shadow is the search-suggest panel extraction; the vision card lifts were deleted. Kept as-is in dark (theme-invariant per the probe battery; 17.2 re-verifies).',
    ],
    motionIntro: [
      'Durations and curves come exclusively from these tokens (AD-9); everything respects `prefers-reduced-motion: reduce`. Starting contract = the bank grammar — the ТЖ reference exposed no transitions; per-component verification at each FR-22 gate.',
    ],
    motionProse: [
      'Reduced motion is mechanical: under `prefers-reduced-motion: reduce` the stylesheet re-declares every `--tj-motion-duration-*` token to `0ms` on `:host, :root` — theme-independent. Components pair it with opacity-only fallbacks.',
      '',
    ],
    motionExtra: undefined,
    zSection: {
      heading: ['## Z-scale — scaffold mechanics (Story 16.5)'],
      intro: [
        'Not a DESIGN.md extraction. Stacking order is fixed by the AD-12 usage ruling: z-order comes only from the `--tj-z-*` scale and the ТЖ overlay helper (packages/tj-components/src/overlays/) owns every floating surface — no component implements its own z-index. Values leave one spare slot between layers (200 stays free for a future dropdown step); mint-grow only when a surface demands it — two tokens at the roster\'s honest size, not the bank\'s six.',
      ],
    },
    darkSection: {
      heading: ['## Dark layer (Story 15.2)'],
      intro: [
        'The reference\'s OWN dark values (`prefers-color-scheme` live capture — extraction, not authoring): a cool-dark set (`#12151C` page / `#20232A` cards) with an inverted near-white CTA pill. **Dual emission (EXPERIENCE.md):** the overrides apply on `:host([data-tj-theme="dark"]), :root[data-tj-theme="dark"]` AND natively under `@media (prefers-color-scheme: dark)` on `:root:not([data-tj-theme="light"])` — the OS preference applies dark UNLESS light is forced (`data-tj-theme="light"` keeps light values under a dark OS; the no-flash contract). Typography / radius / spacing / motion / shadows are theme-invariant.',
      ],
      elevation: undefined,
    },
  },
};

// ---------------------------------------------------------------------------
// The generator + re-exports — the surface tests/tj-tokens-drift.test.ts pins.
// ---------------------------------------------------------------------------

const { renderArtifacts: render } = createTokenGenerator(TJ_CONFIG);

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
    'gen:tokens:tj: rendered light + native-dark layer artifacts -> src/tokens.css, src/tokens.ts, src/TOKENS.md',
  );
}
