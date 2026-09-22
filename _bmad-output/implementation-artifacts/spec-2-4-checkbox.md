---
title: 'Story 2.4 — Checkbox: consent-style with indeterminate'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: '6f3863c04c415b0f7db9cfaf617f0f1208f23a10'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's consent-line checkbox (the form's legal backbone) has no kit counterpart — Epic 2's form cannot ship without it.

**Approach:** Implement `tk-checkbox` per EXPERIENCE.md/DESIGN.md: 20px box, radius-xs, ink-300 check on yellow-100 fill when checked; Space toggles; label clickable and tied to the input; `indeterminate` prop for parent states; the consent pattern (label text + inline link + checkbox) ships as a composed story example — plus close the 2.0 capture gap: take the checked-state reference capture in the same session (INDEX.md names this story as the owner).

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE Checkbox row): Space toggles (native input); label clickable (native `<label>` or label-bound click); `checked`/`indeterminate` render per the visual spec; checked/indeterminate/mixed states announce correctly (`indeterminate` exposes `aria-checked="mixed"` per APG when it applies to a checkbox role — note: native input + indeterminate is NOT announced, so use role/state wiring that announces; implementer picks native-input-with-aria vs role=checkbox — note the technique and its trade-off).
- Stateful API per frozen §4: `checked`/`defaultChecked`/`checked-change` (detail {value: boolean}); `indeterminate` is VISUAL-only (does not participate in the value channel — parent-state display; note in docs); `label` prop + default slot alternative (label prop wins? — pick: slot content if present else label prop; note it); `disabled`; `name`/`value` pass-through (native form participation works when inside a form — checkbox CAN participate natively via the shadow input; note it — unlike Input, do NOT defer: wire the inner input's name/value which the browser submits naturally when the host is in a form).
- Visual (DESIGN.md): 20px box, `--tk-radius-xs`, ink-300 check glyph on `--tk-color-yellow-100` fill when checked; unchecked = surface-field fill + border-default hairline (note the observed reference style in the capture; the unchecked box may be white with hairline — follow the capture); indeterminate = ink dash/dash-fill (follow reference convention: yellow fill + ink minus); focus = unified ring; disabled 40% + no pointer events; hover token step.
- Unit tests: Space toggle, click-label toggle, checked/indeterminate/mixed announce wiring, controlled strictness + release seeding (booleans), disabled inertness, form participation (FormData with name/value when in a form — happy-dom supports it), clamping/null guards.
- React: `'tk-checkbox': { onCheckedChange: 'checked-change' }` + gen + wrapper smoke (boolean payload).
- Component gate: impeccable/axe both themes; story: default + checked/indeterminate/disabled + consent composed example (checkbox + label text + TextLink-like inline link — use a plain anchor styled via tokens, TextLink component is 3.1) + theming + a11y notes/keyboard checklist; PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/checkbox-consent.png` AND the new checked-state capture; vision check.
- Capture gap close: playwright-cli session → toggle a consent checkbox on tbank.ru (or set via JS `input.checked = true` + dispatch) → `checkbox-consent-checked.png` in captures/ + INDEX.md gap updated (remove the gap entry, note the method).

**Never:**
- No new tokens (flag missing values); no theme branches; indeterminate never enters the value channel; no separate «consent» component (composed example only).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Space | focus on box | checked flips, `checked-change` emitted | — |
| Label click | click label text | toggles (native label-input binding) | — |
| Controlled | checked prop set | strict; release seeds (boolean mirror of §4) | — |
| Indeterminate | prop set | mixed visual + `aria-checked="mixed"`; toggling sets checked=false→true per APG | — |
| Disabled | disabled | no toggle by any means; announced | — |
| Form submit | inside <form> with name/value | FormData carries name=value when checked | — |
| Null label | label=null | renders slot content or bare box; no crash | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/input/` -- the stateful mold (§4 semantics, null guards, css/test patterns)
- `.playwright-cli/captures/checkbox-consent.png` + `.working/captures-2026-09-22.md` § Checkbox -- unchecked reference (checked capture owed by this story)
- `packages/components/src/select/` -- latest component patterns (requestUpdate resync, willUpdate clamps)
- INDEX.md gap entry -- to close

## Tasks & Acceptance

**Execution:**
- [x] checked-state capture session (tbank.ru, session tinkoff-ui) + INDEX.md gap close
- [x] `packages/components/src/checkbox/{index.ts,checkbox.ts,checkbox.css.ts,checkbox.test.ts,checkbox.stories.ts}` -- the suite
- [x] `packages/react/src/event-map.ts` + gen + wrapper smoke (boolean payload)
- [x] `.playwright-cli/verify/checkbox/` side-by-sides (unchecked + checked) + vision check
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts (all seven).
- Given the story, when axe runs both themes, then zero violations (mixed state announced correctly).
- Given the capture dir, when reading INDEX.md, then no open gap remains for Checkbox.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual suite stable ×2.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: unchecked-box fill (follow capture), indeterminate glyph, aria technique (native vs role), label slot-vs-prop precedence.

## Spec Change Log

- 2026-09-22 — **AMENDED (implementation): «happy-dom supports it» for FormData falsified.** Live probe
  (`node`, happy-dom 20.14.5): `form.elements === 0` for a native input inside a shadow root AND
  `attachInternals` does not exist — the end-to-end FormData matrix row is unprovable in happy-dom by
  ANY mechanism. KEEP: the unit suite pins the wiring (name/value/checkedness on the listed control +
  the composed-tree chain); the live proof lives in `tests/visual/checkbox.spec.ts` (chromium, real
  label-click → FormData pipeline). Documented in checkbox.test.ts § Matrix row 6 and
  `.playwright-cli/verify/checkbox/NOTES.md`.
- 2026-09-22 — **AMENDED (implementation): «the browser submits the shadow input naturally» falsified.**
  Live probe on the built story (chromium 1.63): the form-owner walk stops at the shadow root —
  `form.elements` stays empty with the shadow input checked, so native shadow-input submission does
  not exist (the gap `formAssociated` exists to fill). The host therefore declares `formAssociated` +
  mirrors the entry via `ElementInternals.setFormValue` (value or native "on" when checked, no entry
  when unchecked; reflected host `name` keys the entry; `formResetCallback` restores
  `defaultChecked`), feature-guarded for environments without internals. KEEP: the chromium proof in
  `tests/visual/checkbox.spec.ts`; the native input stays the interaction/announcement surface —
  only submission rides the internals. Recorded in the TkCheckbox class doc and NOTES.md.

## Review Triage Log

Pass 1 (quick lens, live-probed; verdicts: medium 4 / low 3; 7 patch items, all applied):

- medium — two test-file comments asserted the DISPROVEN mechanism (form-owner crosses shadow boundaries) while NOTES.md/class doc stated the truth; live probe confirmed: shadow input gets NO outer form owner, FormData rides the formAssociated mirror → comments + Accessibility story teaching rewritten to the truth.
- medium — disabled+indeterminate+Space: UA clears native indeterminate, guard reverted only checked → mixed VISUAL dropped while stale aria-checked="mixed" persisted → patch: guard restores indeterminate too + regression test.
- medium — label-less checkbox ~20-28px wide hit area (44px floor is both dimensions) → patch: inline padding on .root; NOTES deviation claims both axes; Playwright geometry test added.
- medium — controlled mixed window: Space flipped visuals while stale mixed announcement persisted (the strict-lag trade-off degrading exactly the state the spec calls out) → patch: imperative aria-checked re-derivation from live native state on every change + 3-phase regression test (flip→drop, accept→stays, reject→restored).
- low — recorded contrast figures contradicted the pinned 3-decimal table (5.9→5.635, 10.9→9.405, 1.47→2.24/12.635) → corrected everywhere.
- notes — the unit Form-submit row moved to the chromium spec (falsified happy-dom premise — Spec Change Log records both amendments); vision-vs-pixel corrections recorded (reference consent text ~#757575 not #333; box 16px vs DESIGN 20px — DESIGN wins, deviations documented).

## Design Notes

Native `<input type=checkbox>` inside the shadow root + `<label>` wrapping gives Space/click/form for free; the visual box is REPLACED (appearance: none / custom rendering) with token-styled box + SVG check — the classic pattern; indeterminate via the native property + aria-checked=mixed on the host (native indeterminate isn't announced). Keep the native input as the interaction/announcement surface.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
- impeccable hooks -- zero blockers
