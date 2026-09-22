---
title: 'Story 2.1 — Input with validation, and the frozen React/overlay API'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
baseline_commit: 'dd397ac16d0fe63186cee15b89353d088cea7d23'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The kit has no stateful component — and the React-surface API plus overlay usage API are deliberately undecided (AD-5: frozen at the FIRST stateful PR, this one). Every later component inherits whatever is decided here.

**Approach:** Implement `tk-input` per EXPERIENCE.md/DESIGN.md (label+placeholder, badge slot, required, blur validation, described-by errors) as the first stateful component — controlled AND uncontrolled — and FROZEN the two open API surfaces by writing them into CONVENTIONS.md §4/§9 with «frozen at 2.1» notes: (1) uncontrolled initial value = `defaultValue` prop; (2) controlled semantics = strict (element renders exactly `value`; typing emits `value-change` and applies nothing locally; removing `value` switches to uncontrolled seeded from the last controlled value); (3) overlay usage = declarative-first (`open` attribute + `open-change` event, content in slots) with imperative helpers for inherently imperative surfaces (Toast) built on the same elements — the overlay controller (2.2) and Modal/Tooltip/Toast (E4) conform to this contract.

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE.md Input row): label AND placeholder both supported (placeholder never replaces label — label visible always); required marked with asterisk + `aria-required`; inline badge slot (e.g. «+30%») announced AFTER the label (label → badge → input in the a11y tree via a labelledby chain or fieldset legend ordering — implementer picks the technique, notes it); validation fires on blur; message tied via `aria-describedby`; error never steals focus.
- State Patterns: error = red message + icon (error-on-field token on field surfaces — `--tk-color-error-on-field`), `aria-invalid`, described-by; message text follows the voice table (calm, no exclamation).
- Visual (DESIGN.md input spec): surface-field fill, radius-md, height 52px, gray-500 placeholder, 2px `--tk-color-focus-ring` offset 2; dark theme via `--tk-color-surface-field`/dark restyle — zero theme branches. Per-component custom properties per the `--tk-<component>-<slot>` grammar (e.g. `--tk-input-fill`).
- Stateful API (frozen decisions above): `value` (string, never reflects), `defaultValue` (initial for uncontrolled; later changes ignored), `value-change` event `detail: { value }` composed+bubbles; typing in uncontrolled updates internal state and emits; in controlled, emits only. `disabled`, `invalid`/error state can be set by consumer (validation helper prop: `validate?: (value) => string | null` — NO, keep the surface minimal: consumer-driven error via `error` message prop + internal on-blur required-check when `required` is set; document the division).
- React pipeline (AD-1): first EVENT_MAP entry — `'tk-input': { onValueChange: 'value-change' }`; wrapper generated; the wrapper's controlled mode uses the standard React `value`/`onChange` mapping onto the element (unwrapped value in the handler per the frozen contract); document that the wrapper does NOT add value-clamping logic.
- CONVENTIONS.md updates: §4 two OPEN markers resolved («frozen at 2.1 — Input PR»); §9 gains the frozen overlay usage contract paragraph (declarative-first + imperative-for-Toast, `open`/`open-change` as the state contract, controller owns mechanics per AD-12).
- Component gate (the shared gate note): impeccable zero blockers; axe both themes; story covers default + variants (with/without label, badge, required, error, disabled, dark demo) + theming demo + a11y notes incl. keyboard-only checklist; PROVISIONAL visual baseline with side-by-side vs `.playwright-cli/captures/input-application-form.png` archived to `.playwright-cli/verify/input/` + zai vision check; reduced-motion paths (Input has no animation by default — focus ring is instant; note it).
- Unit tests (happy-dom): controlled strictness (typing emits but doesn't mutate), controlled→uncontrolled seeding, defaultValue ignored after connect, blur validation wiring (required + custom error prop), badge announcement order, aria-describedby/aria-invalid/aria-required correctness, wrapper event smoke (react-dom render + onValueChange receives unwrapped string).
- SSR-compat construction (AD-10): native `<input>` in the shadow root; no imperative DOM at construction; `name`/`type`/`autocomplete` pass-through props (typed whitelist); form-association (ElementInternals) is NOT in v1 — note the limitation in the story docs.

**Never:**
- No new tokens (flag missing values in the report); no theme branches; no z-index/scroll logic (nothing floats).
- No changes to the frozen CONVENTIONS §2/§3/§5/§7 resolutions from 1.7.
- No overlay controller code (2.2) and no Modal/Tooltip/Toast (E4) — this story only WRITES their usage contract.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Uncontrolled typing | user types | internal value updates, `value-change` emitted (composed, bubbles) | — |
| Controlled typing | `value` set by consumer | `value-change` emitted; the VALUE channel is never mutated locally — the element renders exactly `value` on its next update (the shadow input keeps its live text between updates for caret sanity, then re-syncs) | — |
| Controlled released | `value` removed after being set | switches to uncontrolled, internal state seeded from the last controlled value | — |
| `defaultValue` late change | prop mutated after connect | ignored (initial-value semantics) | — |
| Required + blur empty | `required`, blur with empty value | error message shown (calm copy), `aria-invalid`, described-by wired, focus NOT stolen | — |
| Consumer error | `error` prop set | error state renders immediately (overrides internal), clears when prop clears | — |
| Badge slot | `<span slot="badge">+30%</span>` | badge announced after label in the SR tree; visually right-anchored in the field | — |
| `value` + `defaultValue` both set | both props present | `value` wins (controlled); `defaultValue` inert | — |
| Disabled field | `disabled` set | no input interaction, announced disabled, no validation firing | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/button/` -- the 1.7 pilot mold (file layout, css.ts patterns, enum clamp, host interception, warn-once guards)
- `packages/components/CONVENTIONS.md` -- §4 OPEN markers to resolve; §9 to extend (freeze protocol references this PR)
- `packages/react/src/event-map.ts` -- first real entry lands here (frozen registry)
- `.playwright-cli/captures/input-application-form.png` + `.working/captures-2026-09-22.md` § Input -- reference side-by-side source + measured observations
- `packages/tokens/src/tokens.css` -- available tokens incl. error-on-field, surface-field, focus-ring, radius-md

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/input/{index.ts,input.ts,input.css.ts,input.test.ts,input.stories.ts}` -- the component suite
- [x] `packages/components/CONVENTIONS.md` -- §4 resolved + §9 overlay contract (frozen at 2.1)
- [x] `packages/react/src/event-map.ts` + regen wrappers (`pnpm gen`) -- first event entry
- [x] `packages/react/src/index.test.ts` -- wrapper controlled-mode smoke (onValueChange unwrapped string)
- [x] `.playwright-cli/verify/input/` side-by-side + vision check -- provisional evidence
- [x] baselines via update flow + stability ×2 -- provisional truth

**Acceptance Criteria:**
- Given the matrix rows, when the unit tests run, then each row's behavior is asserted (all nine).
- Given `pnpm gen && git diff --exit-code`, then exit 0 (event-map entry reflected in the generated wrapper).
- Given CONVENTIONS.md, then no `[OPEN — frozen at 2.1 (Input)]` markers remain and §9 documents the overlay usage contract.
- Given the visual suite, then Input baselines pass both themes ×2; axe zero violations both themes; side-by-side archived with vision notes (provisional rule).
- Given a keyboard+SR walkthrough of the story, then label → badge → input order, described-by error, no focus theft hold (documented in the story a11y notes).

## Implementation Notes

- Approved autonomously (standing delegation). The three freeze decisions (defaultValue; strict controlled + seeding on release; declarative-first overlays with imperative Toast helpers) are the story's mandate from AD-5 — they bind all later components; deviations require the §9 exception log.

## Spec Change Log

- 2026-09-22 (review pass 1) — matrix row 2 reworded to the precise implemented semantics (channel-strict; live text until next update — the original «rendered text unchanged» contradicted the frozen CONVENTIONS §4 wording the implementation follows); rows 8–9 added documenting the two implemented-but-previously-unmapped behaviors (value-wins-over-defaultValue, disabled inertness) so «all rows asserted» is literal. Intent (strict controlled) unchanged. KEEP: the frozen §4/§9 text as written by the Input PR.

## Review Triage Log

Pass 1 (4 lenses; verdicts: high 1 / medium 7 / low 5; 13 patch items + spec amendments, all applied):

- medium — consumed-tokens guard weakened beyond justification (blanket fallback exemption + lost \s* tolerance; typo'd core tokens in fallback position escape — mutation-proven) → patch: exemption scoped to declared-names ∨ real-component prefixes (set derived from src dirs), whitespace restored, 5 self-checks; residual in-namespace gap documented.
- medium — controlled blur validated the stale channel (lagging consumer → false «Обязательное поле» persisting) → patch: blur validates LIVE text (#controlValue); controlled+required+blur test added.
- medium — EVENT_MAP ↔ manifest completeness manual-only → patch: tests/event-map-completeness.test.ts (dispatch-scan ↔ registry, loud, vacuous-guarded).
- medium — ref channel untested after the forwardRef HOC switch (mutation-proven silent break) → patch: Input+Button ref tests.
- low-med — null-prop crashes (error/label = null from React) → patch: != null guards + tests.
- low — required-toggle leaves stale error → patch: willUpdate clears; IME isComposing gate; whitespace-trim required check; non-string value coercion; ValueModes orphaned timer (WeakMap + cancel); react index.ts stale header (frozen §9 carve-out wording); badge token use-site comment + closed-hook-set doc + control end-padding; Variants figcaption honesty; NOTES capture recipe + the two value-level deltas added to deviations.
- spec amendments (orchestrator): matrix row 2 reworded to the precise channel-strict semantics; rows 8–9 added (value-wins, disabled); «all eight» → «all nine».
- notes — overlay half of the freeze is prose by design (2.2/E4 bind); freeze-doc is a prose contract (not machine-checked); kit-component.ts bridge = the §9 carve-out, reviewed and accepted; consumed-tokens amendment governance surfaced to maintainer.
- false — «story artifact stale» (closed now); «baseline not reproducible» (recipe committed in the patch round).

## Design Notes

Strict-controlled typing: the shadow `<input>` keeps its own live text for caret sanity but `updated()` re-syncs it to `value` when controlled — emit on `input` events; consumers treating `value-change` → setState get native-feeling behavior. This mirrors how React wraps native inputs and is the least surprising frozen contract.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0
- `pnpm test:visual` (update flow first, then ×2 compare) -- all pass, stable
- impeccable hooks on UI file writes -- zero blockers
