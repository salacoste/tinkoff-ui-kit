---
title: 'Story 9.1 — token additions (tint-brown, radius-3xl, font-mono) + THE v1.2.0 baseline round'
type: 'feature'
created: '2026-09-25'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '485e5b272629741fede960a971f639cca2965bab'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 9.1; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (7.3 brown record, 7.4f radius, 1.5 mono slot, the CI text-advance tolerance entry)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md (colors/rounded/typography frontmatter; Components table row 413 already specs brown badge + white numeral)'
  - '{project-root}/.playwright-cli/verify/stepper/NOTES.md (the probe ground truth: badge 56×56 #8D6040, white ≈20px numeral, radius ≈18, card ≈24)'
  - '{project-root}/.playwright-cli/verify/business-landing/NOTES.md (deviation 14 + kit-gap list: form card ≈32 vs radius cap 24)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-6-1-v2-token-layer.md (the token-story mold: byte-stability discipline, guards, baseline re-take flow)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-6-verification.md (radius-correction history: xxl 32→24 by probe — 3xl must respect it)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Three deferred token decisions are now taken (epics-v3 ratified 2026-09-25) but the
token layer cannot express them: (1) the reference stepper badge ink — probe-measured `#8D6040`,
7.3's recorded refusal flipped to adoption at v1.2.0 — has no token, so the brand-correct badge
ships on a cream stand-in; (2) the business form card's ≈32 radius is capped at `radius-xxl` 24
(7.4f); (3) no mono font slot exists, so every code surface renders in `--tk-font-body` (1.5).
Separately, the CI-scoped tolerance for the tooltip placements text-advance class
(`CI_VISUAL_TOLERANCE` 0.13) is waiting for its recorded structural fix. v1.2.0 allows exactly
ONE baseline re-take round — this story is it.

**Approach:** Add the three tokens through DESIGN.md governance (frontmatter + generator +
`gen:tokens`), flip the stepper sheet's badge defaults to consume the brown (fill `tint-brown`,
numeral `white` — the reference pairing; hooks unchanged), flip the business form card to the new
radius step (PROBE-GATED — see Boundaries), extend the mechanized contrast table with the brown
pairs, pin the new names in the guards, and land the structural tooltip fix (Placements story
content wide enough to hit the pill `max-width` cap, pinning geometry) — retiring the CI
tolerance entry. Everything visual changes in THIS round: stepper set + business/invest
showcases + tooltip placements + the token-reference pages that enumerate the new tokens.

## Boundaries & Constraints

- **Token 1 — `tint-brown` (stepper badge ink):** DESIGN.md colors block gains
  `tint-brown: '#8D6040'` (card-tints family comment: probe-measured business steps badge fill,
  Story 7.3) and `dark-tint-brown: '#8D6040'` — **theme-invariant, the charcoal mold**: generator
  gains a DARK_DEFERRED entry, a DARK_INVARIANTS entry for `--tk-color-tint-brown`, and a
  dark-equals-light assert sibling to the charcoal assert. Stepper sheet flips ONLY the two
  fallbacks: `--tk-stepper-badge-fill` → `var(--tk-color-tint-brown)`,
  `--tk-stepper-badge-number` → `var(--tk-color-white)`; the hooks themselves, badge radius
  (radius-lg, deviation-3 Δ2 stays), numeral weight (deviation-4 stays) are UNCHANGED. **AA
  gate:** white on `#8D6040` must compute ≥4.5:1 (hand-check ≈5.41) — if the executed
  contrastRatio fails 4.5, the mapping STAYS cream (epics' own condition) and the story records
  the refusal instead. Contrast table extends: REQUIRED white-on-tint-brown (the shipped pair,
  theme-invariant) and tint-brown-on-tint-cream (≈4.68, the reference page-level pairing); plus a
  RECORDED-FAILING pin tint-brown-on-tint-cream-raised (≈4.14) with the ruling «brown is a fill
  (white numeral) or an ink on tint-cream — never an ink on raised cream».
- **Token 2 — `rounded.3xl` (form-card ≈32) — PROBE-GATED:** the ≈32 is a VISION estimate
  (deviation 14); the radius history (5.6: xxl 32→24 corrected BY PROBE) demands pixels first.
  Executor probes the archived business form-card capture (ImageMagick arc-staircase mold:
  `.playwright-cli/verify/stepper/probe-ref.sh`, `verify/fidelity-verification/radii-probe.mjs`)
  BEFORE any DESIGN.md edit; transcript lands in `.playwright-cli/verify/tokens-9-1/`. **Ruling:
  measured ≥28px → the token lands** (`3xl: 32px`, or the probed integer if it sits at 30–34;
  placed after `xxl`, before `full` — the scale stays monotonic) **and the business-landing
  `.tkb-form__card` flips** `border-radius: var(--tk-radius-xl)` → `var(--tk-radius-3xl)`.
  **Measured <28px → NO token**: the flag closes as «24 confirmed», scope reduces to tokens 1+3,
  recorded in deferred-work (7.4f) and the Spec Change Log. Scope is the FORM card ONLY — bento
  promo-cards stay `radius-xxl` 24 (probe-exact there; the epics' «bento flag» phrase resolves to
  the ledger's recorded fact: form card). TOKEN_NOTES for `--tk-radius-3xl` states the 5.6
  lineage explicitly: 3xl is a NEW measured step, not the corrected-away xxl estimate resurrected.
- **Token 3 — `--tk-font-mono`:** DESIGN.md gains a NEW frontmatter block `fonts:` carrying
  `mono:` — wired into the generator DELIBERATELY (TOKEN_BLOCKS + a fontsModel that accepts
  exactly `mono` for now; unknown keys abort per house grammar). Value:
  `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace` (system chain —
  no licensed mono face exists; double quotes only, the value grammar forbids `'`). Emitted as
  the third family slot (after heading/body) in tokens.css (FONT_SLOT_COMMENT extends with the
  mono line), tokens.ts `typographyTokens`, and the TOKENS.md font-slots table. **No consumer in
  9.1** — the docs code blocks are the first consumer at 11.2; if a consumption guard demands a
  consumer, record a fixture exemption pointing at 11.2, never delete the token.
- **Tooltip structural fix (retires the CI tolerance):** the Placements story's four pinned-open
  pills get RU content long enough to hit the pill `max-width: calc(var(--tk-space-48) * 6)`
  (288px) cap — geometry pinned by the cap, not by platform text advance. Probe-verify pill
  box width === 288 for all four (playwright-cli, transcript in verify NOTES); story names/meta
  unchanged; figcaptions may stay. The `'components-tooltip--placements [light]': 0.13` entry is
  REMOVED from CI_VISUAL_TOLERANCE (the mechanism + its comment stay, updated to record the
  entry retired by this fix); CI's next run passes placements at the default tolerance.
- **DESIGN.md sanctioned edits, nothing else:** the three frontmatter additions + their comments;
  the `components:` stepper row trued to shipped reality (badge-fill/badge-number gain
  `{colors.tint-brown}`/`{colors.white}`; badge-radius `{rounded.sm}`→`{rounded.lg}` and
  card-radius `{rounded.lg}`→`{rounded.xl}` — numbers-truing per the 3.6 discipline, recorded in
  the change log); one Colors-body AA-table row for the brown pairs; one Shapes-body sentence for
  3xl (probe-gated); `updated:` date. NO existing token value changes.
- **v1-byte-stability discipline (6.1 mold):** the regenerated artifacts' diff is strictly
  additive outside the sanctioned lines (3 light declarations + 1 dark-side disposition +
  TOKENS.md rows/counts). Proven by git diff before/after; double-regen byte-stable.
- **THE baseline round (explicit delete + update, both themes, ×2 stable) — the sanctioned set:**
  A) brown flip: `visual-components-stepper--{playground,variants,api,theming,accessibility}`,
  `visual-components-v2-stepper--page`, `visual-showcase-business-landing--business-landing`,
  `visual-showcase-invest-landing--invest-landing` (16 PNGs); B) radius flip: the
  business-landing pair from A (void if the probe kills the token); C) tooltip:
  `visual-components-tooltip--placements` (2); D) token pages: `visual-token-reference--colors`
  (tint-brown) + `--typography` (font-mono) + `--surfaces` IF the radius group renders there —
  re-take exactly the pages that actually shift (6.1's lesson: verify, don't guess); E) per-spec
  snapshot dirs (`invest-landing.spec.ts-snapshots`, `tooltip.spec.ts-snapshots`): check which
  captures include the touched regions, re-take only those. **Any OTHER PNG moving → STOP and
  investigate** (the 6.3 contamination class / unintended coupling) — never a blind update.
- **Text surfaces stay truthful:** stepper.stories.ts theming block (210–216) and
  docs `v2/stepper.stories.ts` (123–131) carry the cream-mapping prose — update to the brown
  default; the brown-mapping flag comment block at stepper.css.ts:19–46 rewrites as the
  consumes-tint-brown note. Story content RU, story meta EN (unchanged rule).
- **Non-goals:** no 9.2 annotation-derivation refactor (TOKEN_NOTES stays literal here — new
  entries follow the existing string-literal mold); no mono consumer (11.2); no badge-radius /
  numeral-weight changes (7.3 deviations 3–4 stay); no promo-card full-bleed (10.3); no
  qr-block/input/checkbox API work (10.x); no new dark palette keys beyond `dark-tint-brown`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Brown AA gate | contrastRatio(white, #8D6040) | ≥4.5 → flip proceeds (≈5.41) | <4.5 → mapping stays cream, refusal recorded |
| Brown dark side | `data-theme="dark"` | badge stays brown (invariant), numeral white 5.41 both themes | any dark override of tint-brown → FIX (mold violation) |
| Radius probe | arc-staircase on form-card capture | ≥28px → `3xl` lands + form card flips | <28px → no token, scope reduces, recorded |
| Radius scale | xs 4 … xl 24, xxl 24, 3xl 32, full | monotonic; TOKEN_NOTES carries the 5.6 lineage | non-monotonic insert → FIX |
| fonts block | `fonts: { mono: <stack> }` | emits `--tk-font-mono` (3rd family slot) | unknown fonts key / missing block / `'` in value → abort |
| Unconsumed dark key | `dark-tint-brown` | consumed by DARK_DEFERRED + invariant assert | either missing → generation aborts (no silent drops) |
| Stepper hooks | consumer sets `--tk-stepper-badge-fill` | override wins (fallbacks only change) | hook regression → FIX (unit-pinned contract) |
| Tooltip cap | Placements pills, long RU content | pill width === 288 (max-width bound), ×4 | width < 288 → content not long enough, FIX content |
| CI tolerance | placements [light] on ubuntu | passes at default 1.5% (entry deleted) | still diffs → structural fix incomplete, FIX |
| Byte stability | regen before vs after | additive-only outside sanctioned lines | any other diff → FIX |
| Round isolation | any PNG outside sets A–E diffs | STOP + investigate | blind update → process violation |
| Gates | full chain + gen:tokens BEFORE gen, test AFTER gen | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` — the
  sanctioned edits (Boundaries); sole source of truth, hand-edited only via this spec
- `packages/tokens/scripts/generate.mjs` — fonts block wiring (TOKEN_BLOCKS, fontsModel,
  fontSlots merge, FONT_SLOT_COMMENT, rendered block-list strings), DARK_DEFERRED/DARK_INVARIANTS
  + the brown equality assert, TOKEN_NOTES entries (tint-brown, radius-3xl, font-mono)
- `packages/tokens/src/{tokens.css,tokens.ts,TOKENS.md}` — regenerated (never hand-edited)
- `packages/components/src/stepper/stepper.css.ts` — the two badge fallbacks + comment block
- `packages/components/src/stepper/stepper.stories.ts`, `packages/docs/src/v2/stepper.stories.ts`
  — mapping prose updates
- `packages/components/src/showcase/business-landing.stories.ts` — `.tkb-form__card` radius flip
  (probe-gated) + the assembly-standard comment's radius-mapping mention
- `packages/components/src/tooltip/tooltip.stories.ts` — Placements content (cap-hitting RU copy)
- `tests/contrast.test.ts` — brown pairs (2 REQUIRED + 1 recorded-failing pin);
  `tests/tokens-drift.test.ts` — fonts-block negative self-checks;
  `tests/consumed-tokens.test.ts` + `packages/tokens/src/index.test.ts` — new-name pins
  (font-mono exemption per Boundaries if required)
- `tests/visual/visual.spec.ts` — CI_VISUAL_TOLERANCE entry retirement (mechanism stays)
- `tests/visual/visual.spec.ts-snapshots/` + per-spec snapshot dirs — the sanctioned re-take set
- `.playwright-cli/verify/tokens-9-1/` — probe transcripts (radius gate, pill-cap widths),
  re-take manifest, fresh stepper side-by-side crop (brown badge vs reference — the 11.3 ledger
  row's evidence)

## Tasks & Acceptance

- [x] Probe gate FIRST: form-card radius arc probe on the archived capture → verify/tokens-9-1/
- [x] DESIGN.md: three token additions + stepper components-row truing + body rows + date
- [x] Generator: fonts wiring + brown dark-side disposition + TOKEN_NOTES; regen; byte-stability
      diff proven; double-regen stable
- [x] Stepper sheet flip + story/docs prose; business form-card radius flip (if gated in)
- [x] Tooltip Placements content fix + pill-cap probe (===288 ×4); CI tolerance entry retired
- [x] Tests: contrast rows (brown), guards/pins for the three names, fonts negative self-checks
- [x] THE baseline round: sanctioned set A–E explicit-delete + update, both themes, ×2 stable,
      zero movement outside the set; lsof -ti:6007 clean before each pass
- [x] Verify NOTES (tokens-9-1): probe transcripts + re-take manifest + side-by-side crop
- [x] Full gates green (build → test AFTER gen → lint → typecheck → gen → gen:tokens →
      gen-drift post-commit → visual ×2); spec closed; conventional commit EN + push

**Acceptance Criteria:**
- Given `pnpm gen:tokens`, then the light layer declares `--tk-color-tint-brown`,
  `--tk-radius-3xl` (if probe-gated in) and `--tk-font-mono`, the dark layer does NOT re-declare
  `tint-brown` (invariant, asserted), and the v1 declarations are byte-identical.
- Given `pnpm test`, then the contrast suite pins white-on-tint-brown ≥4.5 and
  brown-on-tint-cream ≥4.5, records brown-on-cream-raised as a failing ruling, and the
  tokens-drift suite carries the fonts-block negative self-checks.
- Given the stepper stories in both themes, then the badge renders brown with a white numeral
  (hooks still override), and the baselines moved ONLY within the sanctioned set.
- Given the Placements story, then all four pinned pills measure 288px wide and the CI tolerance
  map no longer carries the entry.
- Given the full gate chain on the merge commit, then every command exits 0 and `git status` is
  clean (gen-drift included).

## Implementation Notes

Executor judgment calls (triage-endorsed):
1. **rounded.3xl KILLED by the probe gate** — arc-staircase probe of
   `pattern-application-form-detail.png`: form-card corners measure **r = 23.8px (IQR
   23.5–24.7) < 28** → the frozen fallback executed (no token, set B void, no form-card flip,
   no Shapes sentence). The probe also EXPLAINS the ≈32: the reference carries a 5px `#333`
   stacked-dark-card band immediately above the corner (y 108–112) — a vision artifact, now
   corrected in deferred-work 7.4f and the business-landing deviation registry's source entry.
2. Components body row trued `{rounded.lg}`→`{rounded.xl}` alongside the frontmatter truing
   (both stale vs shipped since 7.3 — numbers-truing, no decision changed).
3. `FONT_MONO_COMMENT` added as its own comment block instead of extending FONT_SLOT_COMMENT —
   same emitted intent (reviewer: equivalent).
4. dark-sweep BROWN family added as a legitimate single-purpose verdict leg (badge is brown in
   dark too — theme-invariant), not a weakened assertion.
5. CI tolerance retired by EMPTYING the map (mechanism + comment kept, now recording the
   retirement). **5a. REFUTED same day by CI** (run 36131832924): entries restored —
   light 0.13 / dark 0.08; the cap pins width, not wrap line count (ubuntu +1 line,
   68→87px). Change Log item 3 carries the full record.
6. `stepper--api` pair re-created byte-identical (the Api story is apiReferenceDoc — no badge
   rendered) → 20 PNGs modified, not 22; set E verified empty (tooltip.spec.ts captures the
   OPEN story only; invest-landing's per-spec clip is the qr-block region).
7. Unit totals after 9.1: **889** (root 136 + tokens 16 + components 667 + react 70) = 881 + 8
   new (contrast it.each +2, tokens index +1, consumed-tokens +1, tokens-drift +4); zero
   deleted/skipped (reviewer-verified by rerun + grep).
8. Executor's report headline said "879" — arithmetic typo for 889 (its own breakdown + the
   reviewer's independent rerun both say 889); recorded here, not in code.

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **Scope reduction (the frozen block's own fallback path, not an amendment):** rounded.3xl
   refused by the probe gate — DESIGN.md carries NO rounded/Shapes edits; the story shipped as
   tokens 1 + 3 + the tooltip fix + the baseline round (set B void).
2. Merge-round additions: qr-lens finding 3 — stepper.css.ts docblock's badge-radius note
   repointed at verify/stepper/NOTES.md (commit 4184494, incl. the CEM description regen the
   docblock rides); deferred-work closures 7.3/7.4f/1.5/CI-tolerance (this commit).
3. **Post-merge CI refutation + remediation (same day):** the Boundaries AC «CI's next run
   passes placements at the default tolerance» was REFUTED by Actions run 36131832924 on
   e0d4fd2 — 1366/1368, BOTH placements legs red (light 0.10, dark 0.04). Pixel forensics
   (downloaded artifacts, row-profile): the 288px cap pins pill WIDTH only; pill height =
   wrap LINE COUNT, and ubuntu lays the same RU copy one line further (macOS 68px → ubuntu
   87px) — structurally un-pinnable by story content. Remediation: the CI_VISUAL_TOLERANCE
   entries RESTORED (light 0.13, dark 0.08; visual.spec.ts comment carries the full history);
   the cap-hitting story content stays (kills the auto-width subclass, exercises wrap). The
   deferred-work CI-tolerance entry's closure was re-trued to the honest disposition: the
   CI-scoped tolerance IS the standing fix for text-metric geometry. See Implementation
   Notes 5a.

## Review Triage Log

Quick review (qr-lens-9-1, 2026-09-25): **FIX-THEN-SHIP — 1 MAJOR / 2 MINOR / 4 NOTE; all
resolved in the merge round.**
1. **[MAJOR] deferred-work ledger not trued** (7.4f line now false; CI-tolerance entry's
   revisit condition satisfied) — orchestrator-owned (the executor is barred from
   `_bmad-output/`); closed in the merge round with all four 9.1 closures.
2. **[MINOR] "879 passed" arithmetic** — true count 889 (see Implementation Notes 7–8).
3. **[MINOR] dangling docblock pointer** (stepper.css.ts:12 "see the flag below" after the
   flag's rewrite) — fixed in 4184494.
4. [NOTE] FONT_MONO_COMMENT equivalence; [NOTE] compare run 1's single unrelated flake
   (`theming-guide--dark-pairing [light]`, outside the sanctioned set, baseline untouched,
   isolated rerun green, run 2 clean — watch in CI); [NOTE] CHANGELOG correctly empty (11.3
   owns release notes); checklist items 1–12 all verified clean (frontmatter truing DID
   happen; additivity + byte-stability + dark-map 23 independently re-proven; fonts wiring +
   negative self-tests pass; contrast rows exact; 20-PNG manifest exact; dark-sweep BROWN
   legitimate; language rules clean).

## Verification

- Executor round (worktree, c13ba12): probe gates → gen:tokens → gen → build → test (889) →
  lint → typecheck — all exit 0; visual update + compare ×2 (run 1: 1366/1 — the unrelated
  flake above; run 2: **1368/1368, exit 0, 8.4m**); post-commit gen:tokens + check:tokens-drift
  exit 0.
- Merge round (orchestrator, 4184494): fast gates green; visual compare **1368/1368 (8.2m)**;
  post-commit `pnpm gen && pnpm gen:tokens && git diff --exit-code -- packages/ tests/` →
  GEN_DRIFT_CLEAN, tree clean; ff-merge to main; `lsof -ti:6007` clean before every round.
- Changed files (merged scope): spec (this file), deferred-work.md, CLAUDE.md, DESIGN.md,
  generate.mjs, tokens.css/tokens.ts/TOKENS.md + index.test.ts (pillkit-tokens),
  stepper.css.ts/.stories.ts, docs v2/stepper.stories.ts, tooltip.stories.ts,
  custom-elements.json, tests/{contrast,tokens-drift,consumed-tokens}.test.ts,
  tests/visual/{visual,dark-sweep}.spec.ts, 20 baseline PNGs, verify/tokens-9-1/ (8 files).
  CI verdict on the push head e0d4fd2 (run 36131832924, checked via `gh run`): **RED —
  1366/1368, both tooltip placements legs** (the retired-tolerance AC refuted; forensics +
  remediation in Change Log item 3). Remediation commit restores the two tolerance entries
  and trues ledger/spec/CLAUDE.md; the remediation push's Actions run is the cycle's green
  CI proof — its verdict recorded below at close.
  - **CI VERDICT ON THE REMEDIATION HEAD: <filled after `gh run` on the remediation push>**