---
title: 'Story 1.3 — Dark token layer: attribute-switched dark theme with tonal elevation'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '00008a44ae77287ce45dd386babc48edc8767da1'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The token layer is light-only — Marat's UJ-2 (flip one attribute, everything restyles) is impossible and the Phase 2 dark theme (FR-2) does not exist.

**Approach:** Extend the generator with the dark layer: under `[data-theme="dark"]`, re-declare the SEMANTIC token names from the `dark-*` palette keys per DESIGN.md (tonal surfaces replacing shadows, white-alpha text trio, dark link/error/focus, derived dark tints, charcoal + on-primary invariants), add the missing semantic link/error tokens to BOTH layers (1.2 review finding: light has no `--tk-color-link`/`--tk-color-error` for dark to override), and mechanize the DESIGN.md AA-contrast table as a committed test in both themes.

## Boundaries & Constraints

**Always:**
- Override model (fixed by 1.2 TOKENS.md): dark layer re-declares semantic names only — `--tk-color-surface-base/-muted/-field`, `border-default/-strong`, `text-primary/-secondary/-muted`, `focus-ring`, `link`, `error`, `link-on-tint`, `tint-gray/-bluegray/-mint/-beige`; `dark-*` DESIGN.md keys are palette SOURCE, never emitted as `--tk-color-dark-*`.
- Mapping: surface-base←dark-base #1A1A1A; surface-muted←dark-surface-1 #222222; surface-field←dark-field #FFFFFF1A; border-default←dark-border #FFFFFF24; text-primary←#FFFFFF; text-secondary←#FFFFFFB3; text-muted←#FFFFFF80; focus-ring←dark-focus-ring #66A3FF; link←dark-link #66A3FF; error←dark-error #FF7B74; link-on-tint←dark-link; tints←dark-tint-* (first-pass [ASSUMPTION] flags carried; refinement owned by 5.4); text-on-primary and tint-charcoal are INVARIANTS (no dark override — yellow keeps ink text, charcoal stays).
- New semantic tokens in light layer too: `--tk-color-link: {blue-100}` and `--tk-color-error: {red-100}` (components consume semantics, not scales — AD-2/AD-3 discipline; dark could not override otherwise).
- `border-strong` dark is undefined in DESIGN.md — derive `#FFFFFF3D` (default 24-hex ≈ 14% alpha +12%) with a derived-note annotation in TOKEN_NOTES.
- Tonal elevation: dark layer sets all six `--tk-shadow-*` to `none` (per-component exceptions via the `--tk-<component>-<slot>` grammar, not here).
- Typography/radius/spacing/motion/z tokens are theme-invariant — NO dark re-declarations.
- Generator must fail if any DESIGN.md `dark-*` key is NOT consumed by the mapping (no silent drops) and if any mapped semantic name does not exist in the light layer.
- Theme switch itself adds no transition (0ms default; optional 150ms cross-fade is consumer-side, documented in TOKENS.md).
- Contrast pairs from the DESIGN.md AA table become a committed test (tests/contrast.test.ts) computing WCAG ratios: light (ink-300/yellow-100, white/ink-300, text-secondary #616871 on surface-base, link on surface-base, link-on-tint on field, focus-ring ≥3:1 non-text vs adjacent surfaces) and dark (text trio on dark-base/surface-1, dark-link/dark-error ≥4.5:1 on dark-base, focus-ring ≥3:1) — exact ratios recorded in the test.

**Never:**
- No component markup/class changes, no per-component theme branches (that is verified kit-wide at 5.4 — here only the token layer changes).
- No mutation of scale tokens (`--tk-color-blue-100` etc. keep extracted values in both themes).
- No changes to DESIGN.md values; dark derivation notes land in TOKEN_NOTES only.
- No bundler/runtime logic — pure CSS custom properties on `[data-theme="dark"]` (with `:host` context handling so shadow roots inherit).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Theme flip | `data-theme="dark"` on `<html>` | every semantic token re-resolves; typography/radius/spacing/motion/z unchanged | — |
| Unconsumed dark key | DESIGN.md adds `dark-foo` without a map entry | generation aborts naming the key | loud fail |
| Missing semantic name | map targets a name absent from the light layer | generation aborts | loud fail |
| Contrast regression | any AA-table pair drops below its threshold | tests/contrast.test.ts fails naming pair + computed ratio | — |
| Charcoal/on-primary invariants | dark theme active | tint-charcoal and text-on-primary resolve to light values | — |

</frozen-after-approval>

## Code Map

- `packages/tokens/scripts/generate.mjs` -- pure renderArtifacts + CLI from 1.2 (extend: DARK_MAP, dark block emission, unconsumed-key/missing-name asserts, TOKEN_NOTES additions)
- `packages/tokens/src/tokens.css` -- generated light layer + (new) `[data-theme="dark"]` block
- `tests/tokens-drift.test.ts` -- committed==render equality (auto-covers new block); add dark negative self-checks alongside existing ones
- `packages/tokens/src/index.test.ts` -- light purity (no dark-*); extend with dark-layer pins
- DESIGN.md `colors:` dark entries -- palette source (dark-base/surface-1..3/elevated/border/text trio/field/link/error/focus-ring/tints)

## Tasks & Acceptance

**Execution:**
- [x] `packages/tokens/scripts/generate.mjs` -- DARK_MAP + dark-layer emission + asserts + TOKEN_NOTES (border-strong derivation, link/error semantics, tint first-pass flags) -- the pipeline extension
- [x] `packages/tokens/src/tokens.css` -- regenerated with the dark block (semantic overrides + shadow-none + invariants untouched) -- artifact
- [x] `packages/tokens/src/tokens.ts` + `TOKENS.md` -- regenerated (TS map unchanged shape unless link/error added; TOKENS.md dark section now enumerates the override table) -- artifacts
- [x] `tests/contrast.test.ts` -- WCAG ratio math + both-theme AA-table assertions with ratios in failure messages -- mechanized AA table
- [x] `packages/tokens/src/index.test.ts` -- dark pins: block exists on [data-theme=dark], selected overrides (#66A3FF link/focus, shadow none, invariants) -- coverage

**Acceptance Criteria:**
- Given tokens.css loaded, when `data-theme="dark"` is set on `<html>`, then semantic tokens re-resolve per the mapping and NO `--tk-color-dark-*` name exists anywhere in the output.
- Given `pnpm gen:tokens`, then committed artifacts byte-match (drift test green, no manual edits).
- Given the AA table, when tests/contrast.test.ts runs, then every pair passes with computed ratios ≥ thresholds; failing any pair fails the suite naming the pair and ratio.
- Given a DESIGN.md dark key without a map entry, when generation runs, then it aborts naming the key.
- Given both themes, then typography/radius/spacing/motion/z values are identical (test-asserted single source).

## Implementation Notes

- Approved autonomously (checkpoint 1): user AFK with standing delegation; mapping + invariants trace to DESIGN.md Colors (dark section), 1.2 review's override-model note, and Story 1.3 ACs. border-strong #FFFFFF3D and the link/error semantic addition are the two scaffolding decisions, both annotated in TOKEN_NOTES.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-09-22, lenses: blind-hunter, edge-case-hunter, verification-gap, intent-alignment; verdicts medium 3 / low 7 / notes 3; patches dispatched):

- medium — light `--tk-color-error` fails AA where errors render (red-100 on surface-field 4.22:1, on surface-muted 4.40:1; passes 4.78:1 on base) — same class as 1.2's link-on-tint gap → patch: add semantic `--tk-color-error-on-field` (red-200, computed 4.79:1 on field) to the light layer mirroring the link-on-tint precedent, plus light error pairs in the contrast test.
- medium — 3 dark tint overrides unpinned (mutation-proven: neon values in DESIGN.md render green through all 52 tests) (blind, verification-gap) → patch: pin all three; add exact-set exhaustiveness assertion (dark block = exactly 16 colors + 6 shadows; scale-token re-declaration fails).
- low — generator guard gaps (derived-value hex unchecked; consumed-and-deferred conflict) (edge 1-2) → patch asserts.
- low — `--tk-font-*` missing from the no-dark-redeclaration regex (edge 6) → patch: regex + font slots.
- low — stale tokens.css banner "light token layer" regenerates forever (blind 5) → patch: banner.
- low — tokens.ts exposes no dark values; contrast test hand-parses CSS (blind 6) → patch: generator emits dark token maps; test consumes them.
- low — AA rationale anchors incomplete (blue-100-on-dark 3.76, border-default 1.23 not mechanized) (blind 2) → patch: two anchors.
- low — contrast pins on toBeCloseTo(2dp) knife-edge (blind 10) → patch: 3dp.
- low — contrast module-scope parse fails unattributed (blind 11) → patch: move into test scope.
- low — alpha-background guard in the contrast helper (edge 4) → patch: throw with guidance.
- note — runtime cascade (UJ-2 flip) never exercised in a DOM — by design here; the live flip is verified at 1.5 (Storybook theme toggle AC) and 1.7 (first component) (intent-audit R2) → deferred-work entry.
- note — `:host` light declarations in a shadow-adopted token sheet would beat inherited dark values (cascade trap) (edge 3) — document-level loading + inheritance is the intended consumption; decision + warning owned by 1.5/1.7 → deferred-work entry.
- note — spec checkbox/status closeout at step-05 (blind 9); vacuous `git diff` Verification line superseded by check:tokens-drift (blind 8) — Verification section points at the script now.

## Design Notes

WCAG ratio: relative luminance per spec (sRGB linearization, 0.2126/0.7152/0722 weights), ratio = (L1+0.05)/(L2+0.05). Alpha-composited values (text-secondary #FFFFFFB3 on #1A1A1A) must be composited onto their stated background BEFORE the ratio is computed — the test needs a tiny composite helper; backgrounds come from the same generated token maps so the test stays in sync with the source of truth.

## Verification

**Commands:**
- `pnpm gen:tokens && git diff --exit-code -- packages/tokens` -- expected: exit 0 (after artifacts regenerated+staged)
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck` -- expected: all exit 0
- `grep -c 'data-theme="dark"' packages/tokens/src/tokens.css` -- expected: ≥ 2 (selector + comments)
