---
title: 'Story 7.4 — Business landing composition (bento + warm-cream)'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'bbbceef (worktree, base d6a9f2c) → merge 5a6f5e5 (combined with 7.5 + CEM 0df4593)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.4 — FR-14 bento recipes + warm-cream proof)'
  - '{project-root}/packages/components/src/showcase/{homepage,application-form}.stories.ts (THE composition mold)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§business: 2+3 bento anatomy; §C warm-cream measured table — #F1EEE8 page / #E9E0D1 cards, hue ~81°, DISTINCT family)'
  - '{project-root}/.playwright-cli/captures-v2/business/{full-scrolled,full}.png + pattern-{hero-service-selector,products-grid,application-form-detail,steps-open-account-detail,footer-detail}.png'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-14's bento recipes and the 6.1 warm-cream family have no composed proof —
the business above-the-fold (header → hero-selector → 2+3 bento → steps → form → footer)
is the domain that exercises both.

**Approach:** A SHOWCASE composition (the `src/showcase/` mold — canvas LAYOUT recipes,
not new components): `business-landing.stories.ts` assembling 7.1 navbar → hero
service-selector → the asymmetric 2+3 bento (flat cream cards from the EXISTING card
element + §6 surface hooks, floating white-pill CTAs over art) → 7.3 stepper → the
v1-composed application form cluster → v1 footer — on the warm-cream page tokens.

## Boundaries & Constraints

**Always:**
- Placement + mold: `packages/components/src/showcase/business-landing.stories.ts` — the
  application-form wiring mold (state object + `render(template, host)`, focus survives,
  tokens-only canvas styling); the jsdoc states the ASSEMBLY standard (reading order,
  cluster, wiring — not per-pixel).
- Bento (THE deliverable — NOTES measured): asymmetric **2+3 grid**; cards = FLAT warm-cream
  fill `--tk-color-surface-card-cream` (#E9E0D1) on page `--tk-color-surface-cream`
  (#F1EEE8) — the 6.1 tokens, NO new ones; card ~528×408 at reference scale, **radius 24px
  → nearest token step, RECORD the mapping (24 is likely a flagged literal if no token
  step matches)**; NO shadow (flat register); big 3D art = story-only placeholder art via
  the 2.6 token-read SVG technique (yellow ONLY inside illustrations — never UI chrome);
  **floating white-pill CTA overlapping the art's bottom** (surface-base pill, standard
  button register composed on the existing button); grid-footer centered pill «Все сервисы»
  (light fill + blue text — the link register). Cards compose the EXISTING card element
  with §6 hooks (surface/fill overrides) — a bento COMPONENT is explicitly NOT built
  (NOTES candidate #9 ruling).
- Section anatomy (top→bottom per full-scrolled): 7.1 navbar (bank-wide row; subLinks if
  the business capture shows row 2 — probe, follow the capture) → hero service-selector
  (probe pattern-hero-service-selector.png: heading register + selector cluster — v1
  components) → bento → steps = 7.3 tk-stepper (white cards on cream per its spec) →
  form cluster (pattern-application-form-detail: segmented toggle «Открыть счет»/
  «Открыть бизнес» → phone input → 1px divider → consent left + yellow pill submit right —
  v1 SegmentedRadio/Input/Checkbox/Button, the application-form mold) → v1 footer.
- Typography: the BUSINESS register mappings (marketing h1 → heading tokens per the 6.1
  registers doc — probe the capture's scale and map, zero new type tokens).
- The v1 composition gate (the showcase precedent): axe × both themes zero violations;
  provisional baselines ×2; side-by-side vs `business/full-scrolled.png` REGIONS (one
  composite per section cluster) archived to `.playwright-cli/verify/business-landing/`
  + probes (runs.awk) on the bento geometry (grid tracks, radius, CTA overlap); vision =
  blocked-protocol note; RU content, EN meta.

**Never:**
- No new components or elements (bento = canvas recipes on existing cards — the candidate-9
  ruling); no new tokens (6.1 cream family IS the token layer); no theme branches; no
  yellow UI chrome; no shadow on bento cards; no per-pixel truing beyond the bento
  geometry probes; no changes to composed components' APIs (gaps = REPORT, triage decides);
  no §4/§9 text changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Compose | story mounts | header→hero→bento→steps→form→footer, reference order | — |
| Bento grid | desktop viewport | 2+3 asymmetric tracks, cream cards flat, no shadow | — |
| Floating CTA | over art | white pill overlaps art bottom edge, ≥44px hit | — |
| Grid footer | «Все сервисы» | centered light pill, blue link text | — |
| Form wiring | phone + consent + submit | the application-form mold wiring (validation + toast) | invalid → inline errors |
| Narrow viewport | mobile | bento stacks (1-col), sections reflow | — |
| Theme | dark toggle | composition re-themes incl. cream surfaces (the 6.1 dark first-pass) | — |
| a11y | axe both themes | zero violations | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/showcase/application-form.stories.ts` -- THE wiring mold
- `packages/components/src/{navbar,stepper}/` + v1 card/button/input/segmented-radio/
  checkbox/footer -- the composed surfaces (READ APIs, never modify)
- `.playwright-cli/captures-v2/business/full-scrolled.png` -- regional side-by-side source
- `tests/visual/` -- baselines; `.playwright-cli/verify/business-landing/` -- evidence

## Tasks & Acceptance

- [ ] `packages/components/src/showcase/business-landing.stories.ts` (+ any shared
      story-only helpers, the mold's pattern)
- [ ] `.playwright-cli/verify/business-landing/` — regional side-by-sides + bento geometry
      probes + vision (blocked-protocol)
- [ ] baselines ×2 via update flow; axe both themes green; full gates green (VISUAL
      SERIALIZED); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (8), when the composed story is driven, then each row holds.
- Given the bento, when probed, then cards = cream tokens, flat (no shadow), radius mapped
  and recorded, 2+3 tracks match the reference's asymmetry.
- Given axe × both themes on the composed story, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

**Executor round (worktree → bbbceef, 25 files +1679; merge 5a6f5e5):**

- `packages/components/src/showcase/business-landing.stories.ts` — the application-form
  wiring mold: tk-navbar (business row ACTIVE, capture shows NO subLinks — probe followed)
  → hero + a selector of 5 tk-service-card → bento 2+3 (trio ratio 4:5:4; floating white
  CTA overlapping the art) → tk-stepper → application cluster (segmented mode «Открыть
  счет»/«Открыть бизнес»; consumer-error on the phone input; consent; IMPERATIVE toast
  with mode-derived copy per the toast §4 contract) → tk-footer. Warm-cream canvas; every
  color a `var(--tk-*)` (FR-1 grep clean).
- `tests/visual/business-landing.spec.ts` — own spec: wiring checks, BENTO GEOMETRY
  assertions, toast **element-screenshot** (not page-clip) in both themes — page-level
  clip breaks at scrollY≈2268 (the numbers recorded in the spec's rationale).
- `.playwright-cli/verify/business-landing/` — captures, probe ground truth
  (`probe-output.txt`), side-by-side (reference on top), `NOTES.md` (method + measurement
  tables + vision check + deviation registry with file:line).
- Worktree gates: build/unit 872 (15+665/29+70+122)/lint/typecheck green; gen/gen:tokens
  no-op; gen-drift clean. Visual **1254/1254 ×2** on private port 6051 (temp config
  deleted pre-commit). Axe both themes green after a STORY-side fix: the doc-block link
  `.tkb-all` color → `--tk-color-link-on-tint` (the SHIPPED pair ≈5.2:1 at 15px/500 —
  the rejected pre-fix blue was the 4.18:1 axe flag) — zero component edits in the
  commit.
- Baselines: exactly 4 all-new (story light+dark + toast clip light+dark).
- **Token-name premise trued:** the spec's `surface-cream`/`surface-card-cream` names are
  the 6.1 layer's ACTUAL `tint-cream` family (tokens.ts:59-60) — consumed as shipped, no
  renames.
- Bento heights 328/359 = the assembly standard (not capture-verbatim); card structure
  inversion via the actions-stage; steps title/text mapped from the link's own captions
  (no invented copy); the phone number is fictionalized; the grid-footer pill copy follows
  the capture (see Spec Change Log).

## Spec Change Log

- **2026-09-25 (executor round, premise corrections — pixels over prose):**
  (1) The frozen bento footer copy «Все сервисы» — the capture's actual pill reads
  «Все продукты»; composed per the capture (the 7.1 precedent: measured pixels outrank
  frozen prose, deviation logged). (2) The frozen token names `surface-cream` /
  `surface-card-cream` do not exist in the 6.1 layer — the shipped family is `tint-cream`
  (tokens.ts:59-60); the composition consumes the shipped names. No other frozen term
  changed.

## Review Triage Log

**Lens qr-lens-7-4 (2026-09-25, read-only pass on worktree @ bbbceef): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / 5 notes (dispositions below).**

All nine claim-groups CONFIRMED (worktree-relative cites): clean history (base d6a9f2c +
one commit, reflog-checked, no tags/push); lane-only diffstat — ZERO component/react
changes; clean tree (blobs match commit, temp config deleted, scratch diagnostics gone);
composition lines (navbar :400-426, hero + 5 service-cards :429-452, bento 2+3 :459-465,
trio tracks 4fr/5fr/4fr :759, floating CTA :800-805, stepper :472-476, form cluster
:484-521, imperative mode-derived toast :381-384, footer :527-539); cream tokens exact
(tokens.ts:59-60 = #F1EEE8/#E9E0D1, the spec's measured pair); §6 hooks real
(promo-card.css.ts:36-38,81-108,161; service-card.css.ts:29,68); h1 44→heading-2 exact;
radius 24 = radius-xxl EXACT (tokens.ts:146, mapping recorded NOTES:57-60); visual spec
legs (wiring :46-81, bento geometry :83-118, toast both themes :120-146, element-screenshot
rationale with numbers :137-143); probe ground truth ↔ NOTES tables match; baselines 4
all-new; lens RE-RAN tsc/lint/units (872 exact = 15+665/29+70+122) — all green; gen no-op
consistent; matrix coverage declared honestly (below); all 7 kit gaps present in
NOTES:107-117, nothing patched; hygiene clean (RU content/EN meta, no _bmad-output).

Matrix honest coverage: Form wiring + Bento tracks/CTA + Theme + a11y = spec legs;
Compose order + grid-footer pill + flat-no-shadow = baselines/probes (declared, no spec
asserts — acceptable for a composition story); **Narrow-viewport row = the weakest —
story CSS only (:939-985), no probe, no leg** (note-level; the reflow itself is
baseline-covered via the 375px pair? NO — baselines are 1280+360 only; recorded here as
an honest coverage gap for 8.1's real-browser legs to absorb).

Lens notes + orchestrator dispositions:
- **N1 (story:776 hex `#1A1A1A` inside a CSS re-scope comment; FR-1 grep technically
  unclean)** → FIXED in-window: comment reworded to name the situation
  («the dark theme's near-black surface-base would fail 1.4.11…») — zero hex literals
  now, future greps safe.
- **N2 (spec jsdoc header still said PAGE-LEVEL clip while the implementation + NOTES
  correctly record element-screenshot)** → FIXED in-window: header trued to the
  toast's own element screenshot with the scroll-depth pointer.
- **N3 (NOTES:91 cited `packages/components/src/tokens/tokens.ts` — wrong path)** →
  FIXED in-window: `packages/tokens/src/tokens.ts:59-60`.
- **N4 («4.18:1» in the executor's report was the REJECTED pre-fix ratio; the shipped
  `--tk-color-link-on-tint` pair is ≈5.2:1 at 15px/500)** → no source defect (the
  artifact was accurate); spec Implementation Notes trued to the shipped number.
- **N5 (yellow shield logo :663 = the navbar story mold's own art, not new yellow UI
  chrome)** → accepted, no action.

Accepted deviations: all 15 of NOTES:87-104, incl. the pixel-confirmed «Все продукты»
(spec froze «Все сервисы» — Spec Change Log above), steps mapping without invented copy,
fictionalized phone, assembly-standard bento heights, squashed fan selector, visible
phone label (kit gap), radius 24 vs the ~32 note.

**Orchestrator disposition: NO WARN/BLOCKER fix round — note-level hygiene fixes applied
in-window by the orchestrator (stories comment, spec jsdoc, NOTES path); merged as-is
(5a6f5e5).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor) | build/unit 872/lint/typecheck/gen/gen:tokens green; gen-drift clean |
| Worktree visual (executor) | 1254/1254 ×2 (=1244 base + 10 own legs), private port 6051, temp config deleted pre-commit |
| Merge | 5a6f5e5 clean (lane-only files, no overlap with 7.5/CEM) |
| Main gates (combined 7.4+7.5) | build/test/lint/typecheck/gen/gen:tokens GREEN; post-commit gen-drift CLEAN |
| Main visual (combined) | ×2 on private port 6041: pass A 1269/1269 (7.7m) + pass B 1269/1269 (7.7m) — every 7.4 leg has worktree ×2 + combined ×2 |
| Note-fix round | comments/prose only (stories css-comment, spec jsdoc, verify NOTES path) — post-fix gates GREEN (873 unit) + scoped re-run of all 10 business-landing legs on the rebuilt dist: 10/10, ZERO pixel diffs (inertness empirical) |
| Spec closed | 2026-09-25 — see commits: 5a6f5e5 (merge), close commit |
