---
title: 'Story 1.2 — Light token layer: the full extracted token system as --tk-* custom properties'
type: 'feature'
created: '2026-09-22'
status: 'done'
review: 'thorough'
review_source: 'auto'
route: 'full'
route_source: 'auto'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
baseline_commit: 'a36c119238f53af481776023c0d16e79e691a2e6'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The scaffolded `@tk-kit/tokens` package ships only a placeholder CSS marker — the kit's foundation (FR-1) does not exist, so no component can be styled without hard-coding values.

**Approach:** Build the single token pipeline (AD-3): a generator in `packages/tokens` that reads the normative DESIGN.md frontmatter (colors incl. AA-override semantics, typography, rounded, spacing, shadows, motion) and emits committed artifacts — the light `--tk-*` CSS layer plus TS types plus the canonical listing — with a drift check so DESIGN.md stays the sole source of truth.

## Boundaries & Constraints

**Always:**
- DESIGN.md (`_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md`) frontmatter AND body rules are normative; every color/typography/rounded/spacing/shadow/motion entry is emitted.
- Naming grammar (fixes the emission): color scales `--tk-color-yellow-100` … ; semantic aliases keep DESIGN.md names (`--tk-color-surface-base`, `--tk-color-focus-ring`, `--tk-color-text-secondary`, …) — AA overrides land under these names exactly; typography emits per-slot triples `--tk-text-<slot>-size|-weight|-leading` plus family slots `--tk-font-heading`/`--tk-font-body` (first family = consumer brand-font slot, fallback stack from DESIGN.md, Inter documented as recommended default); spacing `--tk-space-<n>` incl. `--tk-space-container`; radius `--tk-radius-xs|sm|md|lg|xl|xxl|full`; shadows `--tk-shadow-default|-hover|modal|popover|dropdown|tooltip`; motion `--tk-motion-curve-expressive-standard` etc. + `--tk-motion-duration-fastest|fast|moderate|slow|slowest`; z-scale `--tk-z-nav|dropdown|popover|tooltip|modal|toast` with values 100/200/300/400/500/600 (stacking order fixed by AD-12 usage; recorded as scaffold mechanics in the canonical listing).
- Light layer on `:host, :root` (shadow-root usable); caps-s tracking stays a separate `--tk-text-caps-s-tracking` value — NO `text-transform` in tokens (uppercase applied at render per DESIGN.md).
- Values carrying a DESIGN.md `[ASSUMPTION]` flag (mint/beige tints, xxl/xl radii) are emitted WITH the flag annotated as a CSS comment and in the canonical listing (resolution owned by Stories 3.6/5.6).
- Generated files are committed; `pnpm gen:tokens` regenerates; CI drift check deferred to Story 1.8 but the check script lands now (`pnpm gen:tokens && git diff --exit-code -- packages/tokens`).
- Zero-hard-coded guard (FR-1 consequence): a committed test fails if `packages/{components,react,docs}/src` contains literal color hex/rgb() values or `z-index:` literals — only `packages/tokens` emits raw values.

**Never:**
- No dark theme content beyond keeping the `[data-theme="dark"]` layering hook ready (Story 1.3 owns dark values).
- No hand-editing generated artifacts (edit DESIGN.md or the generator only).
- No bundling of the vendored `transitions/` recipes into the package (their folding is the deferred AD-9 work at recipe-consumption time).
- No changes to DESIGN.md token values themselves (flags/annotation only at capture-verification stories).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Generation | `pnpm gen:tokens` on a clean tree | emitted files byte-identical to committed ones (exit 0 diff) | non-zero diff names the drifted file |
| Missing token | DESIGN.md gains a new frontmatter entry | regen emits it; listing + TS types include it | — |
| Hard-coded value | a component file adds `color: #333333` or `z-index: 42` | zero-hardcoded test fails naming file:line | — |
| Font slot override | consumer re-declares `--tk-font-body` (or `--tk-font-heading`) at equal-or-higher specificity than the token layer, or later in the cascade (e.g. on `body` or the app root after tokens.css loads) | family slot resolves the consumer's stack; DESIGN.md fallbacks survive when the consumer re-includes them (documented recipe in TOKENS.md) | — |

</frozen-after-approval>

## Code Map

- `packages/tokens/` -- scaffold from Story 1.1: src/index.ts imports './tokens.css'; vite lib build emits dist/index.css (verified by root suite); package.json exports `.` and `./tokens.css`
- `tests/import-boundaries.test.ts` -- pattern to follow for the new zero-hardcoded guard (root suite, fs-based)
- `DESIGN.md` (context path above) -- token source of truth; frontmatter blocks colors/typography/rounded/spacing + body `shadows:`/`motion:` blocks; AA-override table in Colors body
- `transitions/_root.css` -- vendored motion tunables (NOT folded here; deferred-work entry names the owner)
- spec-1-1 Implementation Notes (same dir) -- TS7 dual-alias, external regexes, pnpm 12 quirks

## Tasks & Acceptance

**Execution:**
- [x] `packages/tokens/scripts/generate.mjs` -- parse the DESIGN.md YAML frontmatter (all token blocks — colors, shadows, motion, typography, rounded, spacing — live between the `---` fences; the `components:` block is NOT emitted, it is consumer spec prose); emit `src/tokens.css` (light layer), `src/tokens.ts` (typed token name/value maps), `src/TOKENS.md` (canonical listing: every token, value, source block, assumption flags, z-scale + motion-mapping rationale) -- the pipeline
- [x] `packages/tokens/src/tokens.css` + `tokens.ts` + `TOKENS.md` -- generated, committed -- the artifacts
- [x] `packages/tokens/package.json` -- add `gen:tokens` script; export `./TOKENS.md` — developer entry points
- [x] root `package.json` -- add `gen:tokens` forwarding script -- convenience
- [x] `tests/zero-hardcoded.test.ts` -- scan packages/{components,react,docs}/src/**/*.{ts,tsx,css} for hex/rgb(a)/hsl color literals and `z-index` declarations (with a negative self-check on synthesized strings; tokens package excluded) -- FR-1 guard
- [x] `packages/tokens/src/index.ts` -- re-export token TS maps; keep the CSS import -- programmatic access

**Acceptance Criteria:**
- Given the committed tree, when `pnpm gen:tokens && git diff --exit-code -- packages/tokens` runs, then exit 0 (no drift).
- Given DESIGN.md's frontmatter, when reading emitted `tokens.css`, then every entry appears under the grammar above, including all six shadows, all motion curves/durations, the z-scale, both font slots with fallback stacks, and `--tk-color-text-secondary: #616871` (AA override, not the extracted #79818C).
- Given the emitted `TOKENS.md`, when searching for mint/beige and xxl/xl, then the DESIGN.md `[ASSUMPTION]` flags are annotated.
- Given a component file with a hex literal or z-index, when `pnpm test` runs, then the zero-hardcoded guard fails naming the file.
- Given a consumer overriding `--tk-font-body` per the documented cascade recipe (TOKENS.md), then their family wins with DESIGN.md fallbacks preserved when re-included. *(AC amended 2026-09-22: original wording — ":root before the stylesheet loads" — violated CSS cascade physics; intent unchanged, see Spec Change Log.)*

## Implementation Notes

- Approved autonomously (checkpoint 1): user AFK with standing delegation; frozen block traces to DESIGN.md/AD-3/Story 1.2 ACs. Z-scale values (100..600) are scaffold mechanics fixed by AD-12's stacking order — documented in TOKENS.md as such.

## Spec Change Log

- 2026-09-22 (review pass 1) — the frozen I/O row "Font slot override" and its AC stated that a consumer `:root` declaration "before importing tokens.css" wins the slot. Mechanically false: a later same-specificity `:root` declaration in tokens.css wins the cascade, so no load order makes the consumer's earlier value survive. Amended both to the cascade-correct recipe (equal-or-higher specificity, later cascade position, e.g. `body`/app root; fallbacks survive when re-included) — exactly what the generated TOKENS.md already documents. Intent (an overridable brand-font slot) unchanged; flagged to the maintainer in the story summary. Known-bad state avoided: an AC that no implementation could ever satisfy. KEEP: the font slots themselves, fallback stacks, and Inter-as-default documentation are correct and must survive.

## Review Triage Log

Pass 1 (2026-09-22, lenses: blind-hunter, edge-case-hunter, verification-gap, intent-alignment; verdicts: high 0 / medium 6 / low 5 / false 0; all patches dispatched to the implementer, spec-level fixes applied by orchestrator):

- medium — drift check manual-only: DESIGN.md value edits land with every gate green (verification-gap mutation-proven; intent-audit (c)/(d)) → patch: pure render function + committed-artifact equality test in the root suite; untracked/hand-stage detection added to check:tokens-drift.
- medium — `[data-theme="dark"]` test asserts a trailing comment; light-layer purity (no dark values on :root) verified by nothing (verification-gap mutation-proven; blind 7) → patch: not-match(/--tk-color-dark-/) assertion.
- medium — zero-hardcoded guard blind spots: quoted zIndex escapes, calc(var(--tk-z-*)) false-positives, url(#id)/anchor/CSS-id hex false-positives, multi-line comment line misattribution, vacuous walk on missing src/, new packages & unscanned extensions invisible (blind 1-2, edge 8-13) → patch: detector+walk hardening bundle.
- medium — reduced-motion promised in prose, no mechanical hook → patch: token-layer @media block collapsing all --tk-motion-duration-* to 0ms (implements EXPERIENCE.md kit-wide).
- medium — text-muted #959BA4 ships without a usage-restriction annotation (AA contract gap) → patch: TOKEN_NOTES restriction + regen.
- medium — TOKENS.md ships a repo-relative markdown link that dies in node_modules → patch: plain-text path.
- low — generator robustness (duplicate YAML keys silently kept; invalid key segments; dup names post-rename; CSS-breaking values; empty blocks; `note:` fields dropped; TOKEN_NOTES can go stale vs DESIGN.md) (edge 1-7) → patch: assert bundle keeping loud-fail design.
- low — index.ts side-effect-import comment overstates what vite lib mode does → patch: comment corrected against actual dist output.
- low — dark override model undocumented for Story 1.3 (semantic names vs dark-* palette keys) (blind 4) → patch: TOKENS.md deferred-dark note.
- low — vacuous `[data-theme=dark]` / font AC cascade physics → spec amended (see Spec Change Log) + purity assertion patch.
- defer — AA-override SEMANTICS and [ASSUMPTION] flags live in DESIGN.md body prose but are re-authored as literals in TOKEN_NOTES; body edits don't flow through regeneration mechanically (intent-audit (a)) → deferred-work.md (mechanical body parsing is structural hardening, not this story).
- defer — z-scale is a second source of truth inside the generator (intent-audit (b)) — documented as scaffold mechanics everywhere it appears; promotion into DESIGN.md frontmatter is a DESIGN.md governance decision for the maintainer → deferred-work.md.
- note — `yaml` devDep re-resolved vite/vitest lockfile snapshots with a yaml peer (blind 15) — benign pnpm peer snapshotting, no action.
- note — spec checkboxes/status updated at story close (blind 16), handled by step-05.

## Design Notes

Generator over hand-authored CSS: AD-3 names DESIGN.md as source of truth; a parser over its YAML frontmatter (all token blocks live between the `---` fences; skip the `components:` prose block) keeps emission mechanical. Parse with a real YAML parser (js-yaml or the YAML lib already in the dependency graph via pnpm — prefer adding `yaml` as a devDep over hand-rolling), fail loudly on anything unexpected rather than guessing.

## Verification

**Commands:**
- `pnpm gen:tokens && git diff --exit-code -- packages/tokens` -- expected: exit 0
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck` -- expected: all exit 0
- `grep -c 'ASSUMPTION' packages/tokens/src/TOKENS.md` -- expected: ≥ 3 (mint, beige, radius flags)
