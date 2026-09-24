# Group IV ledger — v2 catalog cluster + composed page (Story 6.5)

Four v2 surfaces × six checks = 24 cells + the composed-page
re-verification (the recorded walkthrough). Legend: **sweep** =
`tests/visual/a11y-sweep.spec.ts`, **RM** = `tests/visual/reduced-motion.spec.ts`
(story-loop — runs EVERY story × theme, v2 stories included since they
landed), **axe** = generated per-theme legs. All file:line pointers opened
during the sweep; bodies verified.

Engine note (honest scope): the group I–III mechanized walk matrix covers
the 19 v1 components; the v2 cluster's checks 1–2 are evidenced by each
component's OWN unit/live matrices plus the composed-page walkthrough —
the same six-check method on the engines the v2 stories shipped with.
Extending the SWEEP list itself is story 8.1's call (it owns the matrix).

## tk-combobox-search

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: arrows step active row WITH WRAP + Home/End + activedescendant follows `combobox-search.test.ts:312`; APG edges (ArrowUp opens at LAST row, ArrowDown at first; Home/End do NOT open) `:340`; End scrolls the active row into view `:356`; Enter commits — value-change, field re-renders to label, menu closes, focus STAYS in the field `:371`; Enter on the committed row = close-no-change `:391`; Enter closed = inert `:404`; Escape closes AND restores the committed label `:413`; outside press closes with focus returned `:467`; Tab path closes with NO forced return (natural order) `:485`; IME composition pauses the pipeline `:531`. LIVE: `tests/visual/combobox-search.spec.ts:47` (typing path opens, field-anchored, width-matched) + `:114` (closed hidden by attribute AND computed display); composed walkthrough S10–S14 (type → arrows → Enter commit → live re-filter, focus never leaves the field). |
| 2 Ring | Field control `combobox-search.css.ts:112` — ring observed at the walkthrough's field stop, and STILL present through the commit step (S14, `:371` pins focus retention); geometry legs of the open-panel spec assert the same register. |
| 3 Roles/names/states | Combobox aria wiring + hidden listbox `combobox-search.test.ts:127`; label/placeholder override the accessible names of field AND panel `:155`; the polite region announces match counts with RU pluralization `:236` (decades `:255`, overrides `:272`); zero matches = disabled empty row, NO activedescendant `:286`; committed row carries aria-selected + check glyph `:429`; controlled/uncontrolled §4 boundaries `:672-743`; axe per-theme. |
| 4 Contrast | Field text on surface-field `#ECF1F7` (the capture's own register — NOTES:83), hint/matched = text-secondary; panel rows = text-primary/secondary on surface-base — the SAME token pairs as the group-III surface-base rows (5.635 light / dark rows evidenced there); no new pairs. |
| 5 Geometry | Field 48px tall (NOTES:83); suggestion rows 48px radius-sm on surface-base (NOTES:93) — ≥44 throughout; live width-match assert `combobox-search.spec.ts:47`. |
| 6 Reduced motion | No entrance animation — the panel mounts controller-side (positionFloating) fully formed; RM legs every combobox story × theme (story-loop, zero animations). |

## tk-filter-chips

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: Space selects — value-change, prior deselected, FOCUS PRESERVED `filter-chips.test.ts:153`; re-select active = no-op (single-select ruling) `:173`; ←/→ cycle FOCUS chip-to-chip (wrapping), NO value change `:184`; every chip is a TAB STOP (documented deviation from APG roving-tabindex) `:209`; Enter on «Ещё» mounts the menu controller-side with focus inside `:222`; menu arrows/Home/End + Enter selects `:295`; Escape closes, focus RETURNS to «Ещё» `:276`; outside click `:319`; Tab path natural `:338`; Tab OUT of the open menu closes it `:368`; chip press while open selects AND closes `:428`; mid-open items change never strands focus `:392`. LIVE: `tests/visual/filter-chips.spec.ts:42` (open «Ещё» region top-layer, anchored, width-matched); composed walkthrough S15–S24 (arrows move focus without selecting, Enter selects, «Ещё» open/Esc-return). |
| 2 Ring | Chip `filter-chips.css.ts:108`; slotted menu rows ring via `::slotted([role='menuitemradio']:focus-visible)` `:217` — the 5.1 slotted-ring lesson (`:215` comment); observed at every walkthrough stop incl. inside the open menu (S23). |
| 3 Roles/names/states | tablist + tab wiring with the «Ещё» trigger `filter-chips.test.ts:120`; no-overflow renders no «Ещё» + visibleCount clamps `:136`; selection through the menu rides the SAME channel, «Ещё» carries the border of an active hidden chip `:247`; unmatched value clamps to first item `:470`; §2 chains `:477-507`; value-change composed/bubbles `:585`; axe per-theme. |
| 4 Contrast | Chip label ink on surface-base (group-III pair family); SELECTED state = ink text + yellow border — redundant state, never color alone (the navbar active-underline family); the one vision contrast note is reviewed and recorded as a non-defect deviation `filter-chips/NOTES.md:93`. |
| 5 Geometry | Chips 44px capsules (NOTES:48 — the 45px read = 44 + 1px flex-line rounding, no artifact); menu rows 48px radius-sm (NOTES:57) — ≥44 throughout. |
| 6 Reduced motion | Static chip row; menu mounts fully formed; RM legs every filter-chips story × theme. |

## tk-data-table

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: FIRST row anchor is the single tab stop (tabindex 0, others −1) `data-table.test.ts:203`; ArrowDown/Up move row-to-row CLAMPED, no wrap `:213`; Home/End jump to first/last `:247`; Enter left NATIVE (anchor navigates), Space = preventDefault + click `:265`; inert rows SKIPPED by roving `:325`; roving survives data change (shrink clamps, replacement moves the stop) `:362` — the composed page's live re-filter path; focusin follows real focus (click moves the stop) `:448`; keydown on non-anchor surfaces inert `:459`. LIVE: `tests/visual/data-table.spec.ts:59` (chromium keyboard contract: single stop, clamped arrows + inert skip, Home/End, Enter/Space, keyboard-only ring); composed walkthrough S25–S29. |
| 2 Ring | The WHOLE ROW rings on keyboard focus — `.row__link:focus-visible` + `.row:has(.row__link:focus-visible)` `data-table.css.ts:179-183`, with the keyboard-only guard (a mouse click does not paint — `:35-36`); structural pin `data-table.test.ts:431`; asserted live by the spec's chromium ring leg `data-table.spec.ts:59` and observed at walkthrough stops (wt-05). |
| 3 Roles/names/states | role=table named via caption/aria-label `data-table.test.ts:406`; header + 10 grid rows with two-line cell anatomy `:124`; delta semantics paint BOTH cell lines `:147-159`; rows=[] = documented zero-state copy, NO rowgroup `:281`; unknown keys/missing href degrade, never throw `:296`; one anchor per row, href on the whole row `:172`; no channel events — navigation is native `:188`; axe per-theme. |
| 4 Contrast | Names text-primary / ticker+metadata text-secondary on surface-base (group-III pair family); delta lines BOTH painted `--tk-color-delta-{positive,negative}` `data-table.css.ts:149-156` — the sign ALSO lives in the data strings («+1,46 %» / «−0,9 %»), color never the only channel; name link = ink, no synthetic underline `:440-443`. |
| 5 Geometry | The row anchor is the target — full-row hit area (stitch pin `:172`); 81px row register (structural semantic pin `:104`); header cells non-interactive; 100 rows natural render keeps the contract `:376`. |
| 6 Reduced motion | Hover fill is a color change, not motion; RM legs every data-table story × theme. |

## tk-pagination

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: «2» commits — page-change, active pill MOVES, focus lands on the NEW ACTIVE button `pagination.test.ts:118`; prev/next commit through the same landing `:136`; active page press = no-op `:154`; page=1 prev aria-disabled + text-muted, NEVER emits `:165`; page=count next boundary-disabled `:182`; load-more bar: emits, page UNCHANGED, focus STAYS on the bar `:199`; count=1 hides the numbers row `:250`; controlled page §4 `:309-355`. Composed walkthrough S30–S39 (bar → disabled-prev still a perceivable stop → numbers → page-2 activation lands focus on the newly-active number → load-more collapse keeps focus on the bar). |
| 2 Ring | `.page/.step/.load-more:focus-visible` — one unified block `pagination.css.ts:179-184` ("never removed — on the pressed box itself"); observed at every walkthrough pager stop incl. after activation. |
| 3 Roles/names/states | nav LANDMARK with the default name `pagination.test.ts:98`, overridable `:366`; aria-current exactly on the active number (asserted through the commit legs `:118-136`); chevrons named («Предыдущая/Следующая страница») + aria-disabled at the boundaries (walkthrough S33/S37 announcements); page-change composed/bubbles `:237`; axe per-theme. |
| 4 Contrast | Active pill #333 on #FFDD2D ≈ 9.3:1 — AA outright (NOTES:58); inactive numbers = link token on surface-base (group-I link pair family); disabled chevrons = text-muted + aria-disabled (state is semantic, not color-only). |
| 5 Geometry | Bar 44px, numbers 44px boxes on the §8 floor — pitch 48 vs the reference's ~36 is the SANCTIONED deviation 7 (NOTES:51,:56,:65-67); pill 32px centered in the 44px box. |
| 6 Reduced motion | Static pager (no transitions); RM legs every pagination story × theme. |

## Re-verifications (spec-required, this change)

- **The COMPOSED page (6.5's deliverable):** the recorded keyboard
  walkthrough `stocks-catalog/walkthrough.md` S1–S39 — Tab from page start:
  14 nav stops in reading order (row 1 → utilities → row 2, aria-current on
  «Инвестиции» + «Каталог»), ring at every stop; the combobox panel journey
  (type → activedescendant arrows → Enter commit with focus retained and the
  table re-filtering LIVE); the tablist (arrows move focus, Enter selects,
  AND zero-state with every control operable, recovery); the «Ещё» menu
  (open, menuitemradio, Esc returns focus to the trigger); the table (single
  stop, clamped roving, Home, native Enter); the pager (bar, perceivable
  disabled chevrons, page-2 focus discipline, load-more collapse). Wiring
  driven live again by `tests/visual/stocks-catalog.spec.ts` (commit →
  chips AND zero-state → recovery → page-2 slice + focus → load-more).
- **Theme re-verification:** wt-08 — the same page under `globals=theme:dark`
  with zero story-code branches (the token layer remap carries navbar,
  chips, table deltas, pager); both themes' baselines land with this story.

**Group IV total: 24/24 cells evidenced + the composed-page walkthrough +
the wiring spec leg.**
