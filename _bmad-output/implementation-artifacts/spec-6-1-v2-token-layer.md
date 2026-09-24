---
title: 'Story 6.1 — v2 token layer: table semantics + warm-cream + registers'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '1dcf272159a1c208d26b470f2206284d3f0f2423'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 6.1)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md (v2 rows, commit 93d31d1)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md (v2 Component Patterns rows)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (extraction evidence)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-4-dark-sweep.md (annotation/verification mold)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The v2 UX phase (commit 93d31d1) landed the normative v2 rows into DESIGN.md
frontmatter, and the token pipeline cannot consume them — HEAD is RED at exactly this seam:
`pnpm gen:tokens` aborts (`colors.delta-positive: expected a hex color string, got
"{colors.green-300}"`) and 3 tokens-drift tests fail on the same root cause. Story 6.1 turns
the v2 rows into generated substrate: every v2 component (6.2+) must consume named tokens
only (FR-15).

**Approach:** Teach `generate.mjs` the v2 grammar — frontmatter color REFERENCES
(`{colors.<key>}`) resolved to values at render time, and `rgba()` literals (both extracted
verbatim from the live reference) — then wire the dark layer for all six v2 semantics with
dark first-pass values flagged `[ASSUMPTION]` for the 8.2 dark sweep (the 5.4 rule), extend
the mechanized AA-contrast table (delta pairs ≥4.5:1 BOTH themes — requires authoring
`dark-delta-*` first-pass values, green-300/red-300 measurably fail on dark surfaces), pin
the new names in the guards, and document the typography registers in the canonical listing
as MAPPINGS (zero new type tokens).

## Boundaries & Constraints

- **Reference syntax (colors block only):** a value of exactly `{colors.<key>}` where `<key>`
  matches the key grammar resolves to the referenced entry's value — transitively (a chain
  resolves to its terminal literal), with cycle detection and missing-target aborts that NAME
  the key. References resolve AFTER literal validation (two-pass); the resolved value is
  itself validated. Emitted declarations carry the RESOLVED value (the v1
  LIGHT_SEMANTIC_ALIASES precedent — consumers see real values, contrast math stays trivial).
  The v1 in-generator aliases (`link`/`error`/`error-on-field`) are NOT migrated — reference
  support is additive; `assertAnnotationConsistency` handles both mechanisms.
- **rgba literals (colors block only):** strict grammar `rgba(<0-255 int>,<0-255 int>,<0-255
  int>,<0-1 float>)` — `border-table` and `surface-row-hover` are verbatim extractions. Malformed
  rgba/hex aborts as today.
- **Dark layer:** DARK_OVERRIDES gains six entries — `--tk-color-delta-positive`,
  `--tk-color-delta-negative`, `--tk-color-border-table`, `--tk-color-surface-row-hover`,
  `--tk-color-tint-cream`, `--tk-color-tint-cream-raised` — sourced from four NEW first-pass
  palette keys (`dark-delta-positive`, `dark-delta-negative`, `dark-border-table`,
  `dark-surface-row-hover`) plus the two `dark-tint-cream*` keys already in DESIGN.md. All six
  carry DARK_TOKEN_NOTES `[ASSUMPTION — verify at the v2 dark phase (8.2) per the 5.4 rule]`
  annotations stating their derivation facts. Derivation discipline: deltas follow the
  dark-error/dark-link precedent (authored lightened brand hues — NO scale step passes: green-300
  ≈3.8:1, red-100 ≈3.6:1 on dark-base); border/hover follow the white-alpha grammar precedent
  (dark-border #FFFFFF24 / dark-field #FFFFFF1A family). The «no silent drops» rule (every
  `dark-*` key consumed or deferred, loudly) extends to the new keys automatically.
- **DESIGN.md edits — sanctioned EXACTLY as follows, nothing else:** four new dark first-pass
  keys in the colors block (with `[ASSUMPTION]` comments carrying their derivation), v2 rows in
  the Colors body AA-contrast table (site anchors #00A328 3.4:1 / #F52222 4.2:1 → overridden
  green-300 4.7:1 / red-300 6.3:1 light; dark first-pass values with computed ratios), and the
  `updated:` date. NO existing token value changes.
- **v1 byte-stability:** the regenerated artifacts' v1 declarations are byte-identical —
  verified by diffing before/after (the change is strictly additive: 6 light declarations,
  6 dark overrides, TOKENS.md rows + a Registers section + dark-table rows).
- **Registers in TOKENS.md:** a rendered section (the z-scale-rationale pattern) documenting
  the three registers as MAPPINGS from DESIGN.md's Registers body section — marketing
  (h1→heading-2 44/700 Daytona), product-UI (h1→heading-3 36/500, dense body data leadings),
  consumer (h1 50) — «components declare their register; nothing branches at the token layer».
  Zero typography-token changes.
- **Contrast table (tests/contrast.test.ts):** AA_PAIRS gains — light delta pairs on
  surface-base; DARK delta pairs on dark-base (≥4.5:1 REQUIRED — if a first-pass dark value
  fails, re-derive per the AA rule before committing it); cream text pairs both themes
  (text-primary/secondary on tint-cream/-raised; dark-text-primary/secondary on
  dark-tint-cream/-raised). A FAILING cream pair is a recorded ruling (the pair is not
  sanctioned — e.g. «on cream-raised use text-primary only»), never a silent omission.
- **Guards cover the new names:** consumed-tokens fixture assertions pin the six declared
  names; tokens-drift gains negative self-checks (missing reference target aborts naming the
  key; reference cycle aborts; malformed rgba aborts). zero-hardcoded / zero-theme-branches /
  gen-drift: no component sources change — verify unaffected, extend only if review finds a gap.
- **Visual:** ONLY the Token Reference story changes (it renders the generated maps by
  construction). Its baselines re-take deliberately (explicit PNG deletes + update flow), both
  themes, stable ×2. ZERO movement on any other baseline — the sub-1.5% no-rewrite rule plus
  explicit-delete discipline holds.
- **Non-goals:** no component consumes the new tokens (6.2+ do); no typography block changes;
  no new semantic families beyond the six; the `components:` frontmatter block stays prose-only
  (never rendered — the v2 component rows there are spec prose, not generation input).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Reference value | `delta-positive: '{colors.green-300}'` | emits `--tk-color-delta-positive: #168821` | missing target → abort naming key |
| Reference chain | A→B→literal | resolves to terminal literal | cycle → abort naming the chain |
| rgba literal | `border-table: 'rgba(0,16,36,0.12)'` | emitted verbatim | malformed rgba → abort |
| Unconsumed dark key | new dark-* w/o disposition | — | abort naming key (existing rule) |
| v1 stability | regen before vs after | v1 declarations byte-identical | any diff → FIX (additive-only violation) |
| Delta contrast light | green-300/red-300 on white | ≥4.5:1 pinned (4.7 / 6.3) | fail → value bug, FIX |
| Delta contrast dark | first-pass on dark-base | ≥4.5:1 pinned | fail → re-derive per AA rule |
| Cream text pairs | primary/secondary × cream/-raised × themes | ratios recorded; failing pair dropped WITH ruling | silent omission → FIX |
| Token Reference story | regenerated maps | re-baselined both themes, ×2 stable | other baselines move → FIX |
| Gates | full suite incl. gen:tokens | ALL green (HEAD's red seam closed) | — |

</frozen-after-approval>

## Code Map

- `packages/tokens/scripts/generate.mjs` — colorsModel (two-pass + COLOR_VALUE_RE + reference
  resolver), DARK_OVERRIDES/DARK_TOKEN_NOTES (+ six entries), TOKEN_NOTES/annotations,
  assertAnnotationConsistency (reference-aware), TOKENS.md rendering (+ Registers section)
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` — the
  sanctioned edits (Boundaries); sole source of truth, hand-edited only via this spec
- `packages/tokens/src/{tokens.css,tokens.ts,TOKENS.md}` — regenerated artifacts (never hand-edited)
- `tests/contrast.test.ts` — AA_PAIRS extension; `tests/tokens-drift.test.ts` — self-heals +
  new negative self-checks; `tests/consumed-tokens.test.ts` — fixture pins
- `packages/docs/src/token-reference.stories.ts` — unchanged source; its baselines re-take
- `tests/visual/baselines/` — token-reference PNGs (explicit delete + update flow)

## Tasks & Acceptance

- [x] Generator: reference resolution (two-pass, transitive, loud cycle/missing aborts) +
      rgba grammar + six dark-layer wirings + annotations + Registers section rendering
- [x] DESIGN.md: four dark first-pass keys + AA-table v2 rows + updated-date (sanctioned edits only)
- [x] Regenerate artifacts (`pnpm gen:tokens`); v1-byte-stability diff proven; double-regen stable
- [x] tests: contrast pairs (deltas both themes REQUIRED ≥4.5; cream pairs with rulings),
      tokens-drift negative self-checks, consumed-tokens fixture pins
- [x] Baselines: token-reference both themes re-taken, ×2 stable, zero other movement
- [x] Full gates green (build/test/lint/typecheck/gen/gen:tokens/gen-drift + visual ×2);
      spec closed; conventional commit EN + push

**Acceptance Criteria:**
- Given the regenerated artifacts, when diffed against HEAD, then the change is strictly
  additive (6 light + 6 dark + TOKENS.md sections) and v1 declarations are byte-identical.
- Given `pnpm test`, then the contrast suite pins delta pairs ≥4.5:1 in BOTH themes and the
  three currently-red tokens-drift tests pass (plus new negative self-checks).
- Given the full gate suite, then every command exits 0 — the HEAD red seam (gen:tokens abort
  on `{colors.green-300}`) is closed by this story.
- Given `pnpm check:tokens-drift` after commit, then byte-stable (the by-design pre-commit
  exit-1 turns green once the artifacts are committed).

## Implementation Notes

- Approved autonomously (standing delegation). Executor judgment calls, triage-endorsed:
  1. **dark-delta-positive = green-100 `#39B54A`** (6.533 on dark-base) — an EXISTING scale
     step, no authored value. The frozen block's «NO scale step passes» parenthetical was
     factually wrong for green (it listed only green-300/red-100); the binding rule (AA ≥4.5,
     re-derive on fail) is satisfied and the sourcing is disclosed in DARK_TOKEN_NOTES.
  2. **dark-delta-negative = authored `#F63434`** (4.525 on dark-base) per the dark-error
     precedent (least-lightened clear of 4.5). Margin is thin off base — see the scope ruling
     below; 8.2 verifies.
  3. **dark-border-table `#FFFFFF1F`** (12% white — mirrors the extracted divider's own alpha),
     **dark-surface-row-hover `#FFFFFF1A`** (the family's established fill step, = dark-field).
- Resolver: two-pass colorsModel (literal/syntax validation, then transitive reference
  resolution with cycle + missing-target + dark-*-target aborts, re-validation of terminals);
  strict rgba grammar with BOTH rejection branches mutation-probed (range + shape); the
  dark-*-target guard is probe-backed too (post-patch addition). assertAnnotationConsistency
  resolves through references (re-pointing `{colors.green-300}` breaks generation).
- v1 byte-stability: round 1 = tokens.css/tokens.ts pure additions (+12/+12); patch round
  touched ONLY v2 annotation lines (tokens.ts byte-identical, 0 non-v2 lines — grep-proven);
  TOKENS.md carries exactly 2 mechanically-forced modified lines (counts 131→137/17→23 + the
  assumptions bullet, which would otherwise be false). Double-regen byte-stable.
- index.test.ts (pillkit-tokens) 17→23: a named-list pin extension (not in the Code Map —
  forced by the six new dark overrides; recorded here per the freeze protocol).
- The spec's «10 baselines» guess was wrong: the token-reference set is 8 PNGs (4 stories ×
  2 themes); only the 2 colors ones shift (colors render in the colors story only).
- contrast.test.ts gained a generated-sourced `rgbaLiteralToHex` converter (the pre-existing
  `composite()` accepts hex only; the light hover token is an rgba literal).

## Spec Change Log

Frozen block untouched. Two triage-sanctioned DESIGN.md amendments beyond the two hunks the
Boundaries named (both numbers-truing per the 3.6 discipline — no decision changed):
1. The colors-block v2 comment's site-anchor figures trued 3.4/4.2 → 3.350/4.090.
2. The AA-table row's light figures trued 4.7/6.3 → 4.587/6.179 (3dp, matching its dark half)
   and gained the delta scope-ruling sentence (triage item 1 below).
The frozen I/O matrix itself quotes the spine's imprecise 4.7/6.3 — computed truth is
4.587/6.179 (both ≥4.5, decision unchanged); recorded here rather than editing the frozen block.

## Review Triage Log

Quick review (2026-09-24): 1 blocker / 1 MAJOR / 2 MINOR / 5 NOTE → FIX-THEN-SHIP; all patched:

1. **[BLOCKER] Delta surface-scope failures unrecorded — and one leg missed by everyone.**
   green-300 on the LIGHT row-hover composite (#F2F4F7) = 4.163 FAIL — found by the reviewer
   alone; dark legs 3.382 (#313131 hover composite) / 4.136 (#222222 tonal-1) computed by the
   executor but recorded nowhere. The spec's own «silent omission → FIX» law applied: 11
   rationale-anchor pins + per-leg TOKEN_NOTES/DARK_TOKEN_NOTES rulings + a DESIGN.md
   scope-ruling sentence. NO value changes: green-300/red-300 are frozen by the spine
   («не переоткрывать»), no darker green step exists, and authoring one violates the freeze.
2. **[MAJOR] Annotation drift in DESIGN.md** — the spine's imprecise ratios (4.7/6.3/4.2)
   survived into the AA-table row while every generated annotation carried computed truth.
   Trued at BOTH carriers (see Spec Change Log).
3. **[MINOR] tint-cream OKLCH wording** — «~13° toward orange, chroma halved» fit only the
   raised step; reworded per-step (base 84.6°/C0.009, raised 80.7°/C0.022 vs beige 93.8°/C0.029).
4. **[MINOR] Bracket mismatch** — TOKENS.md's bullet quoted `[ASSUMPTION — …]` but rendered
   notes lacked brackets; the six DARK_TOKEN_NOTES now open with the literal bracketed flag.
5. **[hardening, reviewer open-question] dark-\*-target reference guard** added to
   resolveColorReferences (a light-layer declaration must never emit a dark palette value) —
   mutation-probed (added in a post-patch round on triage's initiative).
6. **[probe] rgba grammar-rejection branch** (missing alpha) — second mutation probe; the
   round-1 probe covered only the range branch.
7. **[NOTE→record] Passing legs recorded the passing way**: red-300 muted 5.671 / field 5.441 /
   hover 5.608; dark-green hover 4.883 / tonal-1 5.972.
8. **[NOTE→carry into 6.4]** green-300 FAILS on surface-muted 4.210 and surface-field 4.039 —
   DataTable delta cells must sit on surface-base rows only; the 6.4 spec inherits this
   constraint (deltas never on muted/field/hovered fills without re-derivation at 8.2).
9. [NOTE] reviewer verified: resolver sound end-to-end, mutation probes causal, strict
   additivity holds, Registers section mappings-only, cream ruling correctly templated.
10. [NOTE] `pnpm test` mid-round failures fixed at root cause (rgba converter; lowercase-hex
    pin compare) — not test hacks.

Post-patch: 662 unit tests green (122 root, +2 probes); regen annotation-only; zero PNG
movement in the patch round.

## Verification

**Commands:**
- `pnpm build && pnpm gen && pnpm gen:tokens && pnpm test && pnpm lint && pnpm typecheck` — all exit 0 (662 unit: 15 tokens + 475 components + 50 react + 122 root)
- `git add -A && pnpm gen && git diff --exit-code` — exit 0 (gen-drift clean)
- `pnpm test:visual` ×2 (compare mode) — 921/921 stable, both passes (see below)
- v1 byte-stability: git diff over packages/tokens/src — additions + v2-annotation lines only

**Changed files (git status scope):** spec (this file), DESIGN.md (sanctioned edits + triage
amendments), generate.mjs, tokens.css/ts/TOKENS.md (regenerated), pillkit-tokens index.test.ts,
tests/{contrast,tokens-drift,consumed-tokens}.test.ts, 2 token-reference--colors baselines
(light+dark, explicitly deleted then re-taken via the update flow). Nothing else.
