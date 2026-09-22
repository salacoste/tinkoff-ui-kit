---
title: 'Story 2.6 — ThumbnailPicker: selectable tiles with ring'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
baseline_commit: 'e5bd99423559ccc5ac741cdcda79d9544db06fca'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's card-design selector (tiles with ring) has no kit counterpart — the form's visual-choice control.

**Approach:** Implement `tk-thumbnail-picker` per EXPERIENCE.md/DESIGN.md: 72px square tiles wrapping to a grid, selected tile gets a 2px ink border ring; radio-group semantics over visual tiles with row-major arrow navigation; empty-state copy slot per State Patterns; frozen §4 string channel; same gate discipline as 2.3–2.5.

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE ThumbnailPicker row): radio-group semantics (radiogroup/radio, aria-checked); arrow keys navigate ROW-MAJOR (Left/Up prev, Right/Down next — grid semantics; wrapping within the grid, note the pick); selection follows focus (radio semantics per SegmentedRadio precedent); exactly one selected ever; roving tabindex; Space/Enter select; disabled options skipped and unselectable; Home/End (grid precedent — arrows only per EXPERIENCE letter, same decision as 2.5, note it).
- Tiles: 72px squares (DESIGN), wrap to a grid (CSS grid auto-fill minmax? — grid-template-columns: repeat(auto-fill, 72px) with gap from spacing tokens; note the choice); selected = 2px ink-300 border ring (DESIGN — pixel-probe the capture for the exact ring treatment: outer ring vs inset, offset); tile content = consumer slot per option? NO — options prop (2.3 data shape: { value, label, disabled?, thumbnail? }) where thumbnail is a URL/initials for the tile face; render image if provided else label initials or plain label (follow the capture: the reference tiles show card designs — images; initials fallback for the kit's stories; note the decision); label text below/inside per capture probe.
- Empty state (State Patterns row: ProgressBar, ThumbnailPicker → zero-state copy slot): zero options → the empty slot renders (documented copy), inert; null options same.
- Stateful API per frozen §4: `value`/`defaultValue`/`value-change` (string); `options`; `label` (group accessible name — SPAN pattern per 2.5's ratified lesson, NOT label[for]); `disabled` group; `name` formAssociated mirror (2.4 pattern); duplicate-value clamp.
- Unit tests: row-major arrows (incl. wrap at row boundaries — with N columns the wrap behavior must be grid-correct: Right at row end → next row's first; Down → same column next row — note: without fixed column count at test time, pin the CSS grid column count in tests via a data attribute or test the navigation math against the RENDERED grid), skip-disabled, exactly-one, roving tabindex, Space/Enter, form mirror wiring, clamps, empty slot, null guards.
- React: `'tk-thumbnail-picker': { onValueChange: 'value-change' }` + gen + wrapper smoke.
- Component gate: impeccable/axe both themes; story: default + options variants (images + initials fallback) + disabled + empty state + theming + a11y/keyboard checklist; PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/thumbnail-picker-card-design.png` + PIXEL-PROBE the ring treatment + vision check.

**Never:**
- No new tokens; no theme branches; no cross-theme-hover tokens without dark mappings (2.5 lesson); no label[for] (2.5 lesson).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Row-major arrows | → on 3-col grid | moves within grid rows correctly, wrapping | single row/column degenerates to linear |
| Skip disabled | disabled tile mid-grid | arrows skip both directions | all-disabled → inert |
| Exactly one | any interaction | one aria-checked (incl. controlled) | zero options → empty slot, inert |
| Tab | into/out | enters at selected; leaves naturally | none selected → first enabled |
| Controlled | value prop set | strict; release seeds | — |
| Form | name + inside form | FormData name=value | — |
| Image fail | thumbnail URL 404s | falls back to initials/label face (onerror), no broken-image glyph | — |
| Null options | options=null/[] | empty slot state, no crash | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/segmented-radio/` -- the closest mold (radio group, arrows, §4 string channel, formAssociated, span-label)
- `.playwright-cli/captures/thumbnail-picker-card-design.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` § ThumbnailPicker -- reference + observations
- `tests/event-map-completeness.test.ts` -- demands the registry entry

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/thumbnail-picker/{index.ts,thumbnail-picker.ts,thumbnail-picker.css.ts,thumbnail-picker.test.ts,thumbnail-picker.stories.ts}` -- the suite
- [x] `packages/react/src/event-map.ts` + gen + wrapper smoke
- [x] `.playwright-cli/verify/thumbnail-picker/` side-by-side + PIXEL-PROBE ring treatment + vision check
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts (all eight).
- Given the capture, when pixel-probed, then the ring treatment reading is recorded (resolving the 2.0 ambiguity for this component).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; axe both themes zero violations; empty slot renders per State Patterns.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: grid column derivation for row-major math (auto-fill vs explicit `columns` prop — pick explicit-free unless tests need determinism: compute columns from rendered DOM in tests), initials fallback, ring probe outcome, tile label placement.

## Spec Change Log

## Review Triage Log

Pass 1 (quick lens; verdicts: low 3; no functional bugs — all navigation/§4/form/fallback paths traced and pinned):

- low — Code Map cited the wrong .working path AGAIN (2.5's triaged defect reintroduced — a spec-authoring habit to break: always resolve .working against the ux-designs dir) → fixed.
- low — status done vs unticked checkboxes → ticked.
- low — react index.test.ts section order (2.6 inserted before 2.5) → reordered chronologically.
- notes — ring probe: reference shows a ~3px #FFDD2D outer annulus; DESIGN freezes 2px ink-300 — mapped (DESIGN wins, deviation recorded); position-based vertical navigation with last-tile clamping on uneven rows (4+2) documented as deviation 6; the impeccable broken-image finding was a false positive on a test message string (reworded, no suppression).

## Design Notes

Same native-radio surface pattern as 2.5 (shadow inputs + explicit keydown + formAssociated); the grid only changes the NAVIGATION MATH (row-major = index ± 1 for horizontal, index ± columns for vertical — columns read from the rendered grid at keydown time via computed style or offsetLeft clustering; document the technique). Tile faces: img with onerror → initials div; ring via outline or border on the selected tile wrapper (probe decides).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
