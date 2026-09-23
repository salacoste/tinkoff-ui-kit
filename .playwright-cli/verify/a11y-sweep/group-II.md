# Group II ledger — forms (Story 5.2)

Five components × six checks = 30 cells + the 2.8 walkthrough re-verification.
Legend: **sweep** = `tests/visual/a11y-sweep.spec.ts`, **RM** =
`tests/visual/reduced-motion.spec.ts`, **axe** = generated per-theme legs.
All file:line pointers opened during the sweep; bodies verified.

## tk-input

| Check | Evidence |
|---|---|
| 1 Keyboard | Native input is the control (`input.test.ts:87`); no keydown interception exists (text entry is the platform's); IME composition inert `:487`; LIVE Tab order + label→badge→input reading order: walkthrough step 1 `.playwright-cli/verify/form/walkthrough.mjs:126-183` (8-stop exact sequence, RU story); sweep walk (playground, both themes). |
| 2 Ring | Field-box ring via :focus-within (`input.css.ts:97-103` — both modalities, wraps input + badge); the control's own outline:none is a dedup AT THAT MOMENT (`:127-131`, documented); asserted computed at the real Tab stop by the sweep walk — the `.field` carrier, both themes. |
| 3 Roles/names/states | Label + badge join the name in ORDER (`input.test.ts:293` labelledby id order; walkthrough badge-chain probe `:154-183` LIVE «Фамилия…» then «+20%»); placeholder-only fallback name `:326`; required asterisk aria-hidden + aria-required carries semantics `:410`; aria-invalid + described-by error wiring `:211` and LIVE walkthrough `:286-296` (focus NOT stolen — asserted `:292-296`); disabled `:385`; axe both themes. |
| 4 Contrast | Sweep additions: text-primary on surface-field LIGHT 11.126 / DARK composited 13.009; select-placeholder row shares the same field fill (see tk-select); error text = error/error-on-field pairs (existing); placeholder = gray-500 — restricted token, paints through ::placeholder (axe never measures it; the documented exemption, DESIGN.md Colors note). |
| 5 Geometry | 52px field box is the interactive surface (`input.css.ts:87-88` literal, structural — no height token exists); sweep scan real-pixel ≥44 both dimensions. |
| 6 Reduced motion | Field transitions ride tokens; RM legs every input story × theme (transition-duration collapse asserted). |

## tk-select

| Check | Evidence |
|---|---|
| 1 Keyboard | Enter opens `select.test.ts:171`; ArrowDown/Up move visual focus, wrap, skip disabled `:197`; arrows open when closed `:224`; Home/End `:238`; Enter selects + focus stays on trigger `:252`; Space opens (inert while open, never feeds typeahead) `:271,:726`; Esc closes without change `:313`; typeahead `:331,:351,:365`; outside click returns focus `:376`; focus-loss close `:412`; IME inert `:744`; LIVE full flow: walkthrough step 2 `.playwright-cli/verify/form/walkthrough.mjs:199-243` (Enter → 2×ArrowDown → Enter picks «5% Аптеки», focus on trigger, progress 33→50); sweep walk. |
| 2 Ring | Trigger ring on `.field:focus-within` (`select.css.ts:85-89`), asserted computed by the sweep walk; the trigger's own outline:none is the same-moment dedup (`:117-121`). RULING: the open menu's VISUAL focus is the `.tk-active` flat-fill highlight + aria-activedescendant (combobox APG — real focus never leaves the trigger, `:233-238` comment) — not a ring by design. |
| 3 Roles/names/states | Combobox/listbox/option + aria-selected wiring `select.test.ts:130`; both-absent label fallback name `:701`; disabled `:587`; ids unique `:691`; axe both themes incl. the open story. |
| 4 Contrast | Sweep additions: value text-primary on surface-field 11.126 / dark composited 13.009; placeholder span = text-secondary on surface-field 4.962 light / 7.303 dark composited (the REAL-element AA override — `select.css.ts:122-133` + verify/select/NOTES.md); menu panel text on surface-base rows. |
| 5 Geometry | The full 52px box is the interactive target (`select.css.ts:95-98` comment + field height); options min-height 48 (`select.css.ts:37` header) — sweep scan on the OPEN story: trigger + all options ≥44, named. |
| 6 Reduced motion | Transitions ride tokens — no belt needed by design (`select.css.ts:146` header note); RM legs LIVE every select story × theme, incl. the open menu. |

## tk-checkbox

| Check | Evidence |
|---|---|
| 1 Keyboard | Space path = native input, NO keydown interception (`checkbox.test.ts:101` — the platform owns Space); label-click toggle `:147`; indeterminate → checked per APG `:306`; disabled Space keeps the mixed VISUAL `:395`; sweep walk (playground, both themes). |
| 2 Ring | Sibling-bridge ring: `.control__input:focus-visible + .box` (`checkbox.css.ts:114-119`) — the invisible input owns focus, the visible box paints the ring; asserted computed at the real Tab stop by the sweep walk (sibling carrier), both themes; the opacity-0 input paints nothing itself (`:85-97` construction). |
| 3 Roles/names/states | Wrapping label = click + naming surface (`checkbox.test.ts:86`); aria-checked=mixed only when indeterminate `:278,:289`; checked wins `:297`; ariaLabel bare-box path `:494`; ids note `:541`; axe both themes. |
| 4 Contrast | Check glyph ink-300 on surface-base box (12.635 values — existing white/ink row pair family); border hairline = decorative (state duplicated by aria-checked — the redundancy principle); no uncovered rendered pair found by the scan. |
| 5 Geometry | The label SURFACE carries the 44 floor — real-pixel bare-box proof `tests/visual/checkbox.spec.ts:109-142` (label ≥44×44, visual box 20px inside); sweep scan measures the label-box union (native label semantics) ≥44 with labels present too. |
| 6 Reduced motion | Box fill/border transitions ride tokens (`checkbox.css.ts:107-110`); RM legs every checkbox story × theme. |

## tk-segmented-radio

| Check | Evidence |
|---|---|
| 1 Keyboard | ArrowRight/Down move focus AND selection `segmented-radio.test.ts:139`; wrap at edges `:167`; Space never intercepted `:183`; Enter selects + no submit `:202`; disabled skipped both directions `:220`; all-disabled inert `:248`; disabled-GROUP arrows OWNED (no UA rove) `:271` + LIVE `tests/visual/segmented-radio.spec.ts:122-159` (real keydown, focus stays put); walkthrough step 3 LIVE `.playwright-cli/verify/form/walkthrough.mjs:245-268` (Да→Нет, focus follows selection); sweep walk (roving single stop). |
| 2 Ring | Sibling ring `.segment__input:focus-visible + .segment__surface` (`segmented-radio.css.ts:171-176`) — asserted computed by the sweep walk (sibling carrier), both themes. |
| 3 Roles/names/states | Radiogroup + named radios EXACT (getByRole computed-name probe) `segmented-radio.spec.ts:161-175` LIVE + structure `segmented-radio.test.ts:104`; aria-label group fallback `:126`; roving tabindex `:340`; one-checked invariant `:310,:323`; axe. |
| 4 Contrast | Sweep additions: unselected label text-primary on surface-field track 11.126 / dark composited 13.009; selected = text-primary on white segment fill 12.635 (values family); hover step AA documented in `segmented-radio.css.ts:158-159` (12.6:1 light / 15.7:1 dark). |
| 5 Geometry | Every invisible radio covers ≥44×44 of the 56px track — real-pixel `segmented-radio.spec.ts:96-120`; sweep scan (label-union ≥44). |
| 6 Reduced motion | Segment fill/box-shadow transitions ride tokens (`segmented-radio.css.ts:144-147`); the selected fill keeps solid — RM legs every story × theme. |

## tk-thumbnail-picker

| Check | Evidence |
|---|---|
| 1 Keyboard | Row-major ArrowRight/Left with row-end carry `thumbnail-picker.test.ts:204`; Down/Up column keep ± wrap `:239`; UNEVEN 4+2 rows `:270`; single row/column degenerate `:311,:335`; disabled skipped `:348`; Space native `:508`; Enter `:527`; LIVE against the RENDERED grid (real rects → 4 columns, real keys): `tests/visual/thumbnail-picker.spec.ts:104-182`; sweep walk (roving single stop). |
| 2 Ring | Sibling ring `.tile__input:focus-visible + .tile__face` (`thumbnail-picker.css.ts:187-192`) — asserted computed by the sweep walk (sibling carrier), both themes. |
| 3 Roles/names/states | Radiogroup + EXACT tile names `thumbnail-picker.spec.ts:208-216` LIVE + structure `:137`; aria-label fallback `:179`; group-label span ruling `:190`; roving tabindex `:478`; image alt-empty decorative `:167`; axe. |
| 4 Contrast | Tile label text on the face (surface registers — existing pairs); selected ring = focus-ring token (non-text 3:1 rows); the initials fallback face = text pairs on surface; no uncovered rendered pair found. |
| 5 Geometry | Every tile radio spans the full 72×72 tile ≥44 — real-pixel `thumbnail-picker.spec.ts:184-206`; sweep scan. |
| 6 Reduced motion | Ring/fill transitions ride tokens (`thumbnail-picker.css.ts:175` note); RM legs every story × theme. |

## 2.8 walkthrough re-verification (spec-required)

Re-run this change: `node .playwright-cli/verify/form/walkthrough.mjs` →
**31/31 checks passed** (both axe themes included; output archived in the
story report). The composed form is unaffected by the toast css fix (the
action-ring fix is additive styling); the walkthrough's own toast legs
(polite announce, no focus theft, pause/resume) re-verified green.

**Group II total: 30/30 cells evidenced + walkthrough 31/31.** SR protocol
rows added to all five components' «Доступность» stories.
