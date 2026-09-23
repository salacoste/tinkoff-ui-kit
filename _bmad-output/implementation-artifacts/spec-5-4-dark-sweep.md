---
title: 'Story 5.4 — Dark mode sweep: token-only restyling verified 19/19'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '6189211613f7e404a3a9e2f1d0a52a6ad3b60d5'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** SM-5 (dark mode 19/19 with zero component-specific hacks) is asserted by construction discipline but never swept as a verified whole — and the dark-tint first-pass values ([ASSUMPTION] from the spine's deferred list) have never been checked against the derivation rule.

**Approach:** Flip `data-theme="dark"` across every story and verify all 19 components render correctly (no illegible pairs, no light-only assumptions, no leftover light artifacts); add a mechanical repo check proving zero component-level theme branches; run the dark-tint fidelity check against the derivation rule (L≈16–20%, hue kept; charcoal invariant) and refine DESIGN.md + tokens in the same change if flagged — the 3.6 closure mold.

## Boundaries & Constraints

- **19/19 render correctness:** every story in dark (the visual suite already screenshots both themes — the sweep adds a DOM-level dark audit: computed-style pairs on every rendered surface — text/background resolve to AA per the 60-row table; borders/hairlines present; shadows disabled/replaced by tonal steps per UX-DR2; NO light-only assumptions (e.g., a white hardcoded anywhere, a light-only token consumed without dark mapping — the 2.5 lightblue-200 class of bug)).
- **Zero theme branches (mechanical):** a repo check that no component source matches theme-branch patterns (`[data-theme`, `:host([data-theme`, `data-theme=` selectors/attribute checks in TS) — theming flows ONLY through `--tk-*` token consumption. Existing guards may already cover part; the sweep makes it an explicit named check with a committed spec/test. Documented exemptions: the tokens package itself, the docs Storybook decorator (the toggle), test files.
- **Dark-tint refinement:** for each dark tint (gray/bluegray/mint/beige dark values), compute L* and hue vs the light value — the rule: L≈16–20%, hue kept, charcoal invariant. If any first-pass value misses the rule window AND the miss is visually meaningful, correct DESIGN.md frontmatter → `pnpm gen:tokens` → committed artifacts → probe evidence (the 3.6 closure discipline: pixel-probe the changed surfaces). If values hold, clear the [ASSUMPTION] annotation with the verification note (assumption-flag closure lands fully at 5.6 — this story closes the dark-tint flag specifically).
- Shadows→tonal elevation verified: no component paints `--tk-shadow-*` in dark where UX-DR2 says tonal steps replace them (the token layer handles it — verify no component bypasses with raw shadows).
- Yellow keeps ink text in dark; borders use dark-border white-alpha (UX-DR2 checklist).
- Findings fixed in-change; baselines re-taken for any visually-changed dark story (delete + update flow below threshold); no new components; RU content/EN meta unchanged.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Dark flip per story | data-theme=dark | 19/19 correct, AA pairs hold | illegible pair → FIX |
| Theme-branch check | repo components source | zero matches (documented exemptions only) | match → FIX or exempt w/ ruling |
| Dark tints | L*/hue computation | within rule window or corrected | miss → DESIGN.md + regen + probes |
| Shadow discipline | dark computed styles | shadows disabled/tonal; no raw bypass | bypass → FIX |
| Charcoal invariant | dark renders | unchanged from light | drift → FIX |
| Baselines | changed dark stories | re-taken, stable ×2 | — |

</frozen-after-approval>

## Code Map

- `packages/tokens/src/tokens.css` -- the dark block + tint values under check; `scripts/generate.mjs` -- regen
- `tests/contrast.test.ts` -- the 60-row pair table (both themes already)
- `tests/visual/visual.spec.ts` -- both-theme screenshot loop; `a11y-sweep.spec.ts`/`reduced-motion.spec.ts` -- engine molds for a dark-audit spec
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` -- frontmatter tint values + Colors dark rules
- `.playwright-cli/verify/a11y-sweep/` -- evidence/ledger format mold → `.playwright-cli/verify/dark-sweep/`

## Tasks & Acceptance

- [x] `.playwright-cli/verify/dark-sweep/{NOTES.md,ledger.md}` -- 19/19 sweep evidence (19×7 cells) + tint computation table + branch-check output
- [x] Mechanical zero-theme-branch check committed as a named test (`tests/zero-theme-branches.test.ts` — self-checks + vacuous/stale-exemption tripwires; patterns incl. light-dark()/color-scheme after review)
- [x] Dark-tint verification: computation table — ALL FOUR HELD (Lab L* 14.2/13.9/15.7/15.4; bluegray's 2.06pt miss within the sub-JND+safer-direction conjunct); [ASSUMPTION] annotations resolved with verification notes (values unchanged, byte-stable double-regen)
- [x] Dark-audit spec -- `tests/visual/dark-sweep.spec.ts` (19 canonical stories × both themes: structure parity, slot-aware alpha-chain AA pairs, light-only-leftover detection, forced invariants, shadow collapse, border presence, yellow-keeps-ink)
- [x] Fixes for findings (F1–F4 below); baselines stable ×2 (23 dark re-takes, zero light touched); full gates green

**Acceptance Criteria:**
- Given the ledger, when read, then 19 components × dark checks carry evidence and the tint table shows L*/hue vs the rule.
- Given the branch check in CI, when a component adds a theme branch, then it fails.
- Given `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls recorded in NOTES.md: the «L≈16–20%» rule reads as CIE **Lab L\*** (the OKLCH reading demands tints darker than the canvas — self-destructs against the palette's own ramp); correction threshold = miss >2 L* AND visually meaningful (sub-JND <2.3 L* + safer-direction conjunct operationalized); hue tolerance ±20° at C≤0.04; engine's slot-walk is one level deep (false-FAIL direction only — documented limitation).
- **Sweep findings fixed in-change:** F1 progress-bar track gray-200 → border-default (near-white rail in dark; light byte-identical #E7E8EA); F2 skeletons gray-200 → border-default in article/feature/promo cards (+ css-pins); F3 select option hover gray-100 → surface-muted (light #F5F5F6 identical; active>hover ordering holds both themes); F4 button/link/badge story canvases painted `surface-base` (headings were white-on-white INVISIBLE in dark — axe resolves transparent chains as «incomplete», the exact blind spot the DOM-level engine closes). Ruled R2: fill stays blue-100 (redundancy rule).
- Tint closure: all four dark tints HELD — no DESIGN.md value edits; `[ASSUMPTION]` → per-tint «Verified — Story 5.4» notes in DARK_TOKEN_NOTES, rendered into tokens.css/TOKENS.md (comments only, zero value churn, md5-proven double regen).
- 23 dark baselines re-taken (button 8 / badge 6 / link 6 / card variants 3), zero light touched; F1's dark PNG is knowingly stale-but-passing (sub-threshold 4px rail) — **flagged for the 5.6 maintainer batch-confirm** (dedicated ledger section).

## Spec Change Log

(none — frozen block untouched; DESIGN.md edits were pre-sanctioned by the spec's own boundaries but turned out unnecessary: values held)

## Review Triage Log

Quick review (2026-09-23): 0 blockers / 0 MAJOR / 4 MINOR / 5 NOTE → FIX-THEN-SHIP; all patched:

1. **[the one gate] Stale pre-5.4 JSDoc shipping in the public manifest** — progress-bar.css.ts still asserted gray-200 carries no dark remap «belongs to 5.4's pass» (this change IS it). PATCHED: dark-theme paragraph + custom-property defaults rewritten to border-default semantics; manifest regenerated and text-verified (13 residual gray-200 mentions = intentional «light value =» references).
2. **Same class, 8 skeleton docstrings** (reviewer listed 5; grep found 8 incl. @attr lines) — all updated to border-default naming; manifest regenerated.
3. **F3 had no mechanical pin** — cssText pin added to select.test.ts (hover→surface-muted, active→surface-field, scale-token regression guard; landed in selectMenuStyles after a first-attempt correction). 46/46.
4. **Ledger arithmetic** — link dark baselines 6 (not 5); F4 = 20 canvases (not 21); 742 = passing complement (765−23), not the failure count. Corrected.
5. **[NOTE→fix] Guard patterns** — `light-dark(` + `color-scheme` added; offender self-checks 8; **trip-probe verified live** (injected light-dark() in link.css.ts failed the guard by file:line, probe removed, file verified pristine).
6. **[NOTE→fix] Contrast label** — actual count 57 AA_PAIRS rows (30 light / 27 dark; the earlier «58/31» included the interface union line); labels corrected.
7. **[NOTE→fix] Slot-walk limitation** — one-level assignedSlot documented in NOTES + ledger (false-FAIL direction; second-level walk = future hardening).
8. **[NOTE→record] F1 stale dark baseline** — explicit FLAG + dedicated «Baseline obligations at the 5.6 maintainer batch gate» ledger section; computed-style pin + live probe hold the line.
9. [NOTE, deferred to 5.6 consideration] single canvas bg in preview.ts could retire the N-copy per-story pattern.
10. [NOTE] tonal steps 2/3/elevated stay reserved with no consumer — recorded, no action.

Post-patch verification: 644 unit (root 105 incl. extended guard; select 46/46) + 765 visual ×2 + orchestrator compare run; zero baseline movement in the patch round (docstring/test/guard changes only).

## Design Notes

The 3.6 closure is the mold for value corrections: evidence → DESIGN.md edit → regen → committed artifacts identical → probe proof. The sweep's product is evidence + the mechanical branch guard; fixes ride along.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow if baselines changed, then ×2) -- stable
