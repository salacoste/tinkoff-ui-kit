---
title: 'Story 6.2 — FilterChips + Pagination: the catalog filter/page controls'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '4bf13f4115afb4609f05408e642fc000831778a7'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 6.2)'
  - '{project-root}/packages/components/CONVENTIONS.md (§4/§9 FROZEN)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§D keyboard evidence, UX addendum)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png + pattern-table-stocks.png (vision-extracted 2026-09-24)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-select.md (field/overlay mold); spec-2-5-segmented-radio.md (pill mold)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The invest/stocks catalog's filter row and pager have no kit counterparts — the two
controls every data view in the v2 domains needs (FR-12), and both carry reference keyboard
defects the kit is sanctioned to improve (focus-drop on chip toggle; inert controls).

**Approach:** Implement `tk-filter-chips` (single-select pill row + «Ещё» overflow dropdown per
the vision-extracted anatomy: selection = 2px yellow border on white, communicated by border
ONLY) and `tk-pagination` (nav landmark: yellow active pill, windowed numbers with ellipsis,
prev/next chevrons, separate full-width muted «Показать еще» bar) per EXPERIENCE.md rows and
DESIGN.md frontmatter, both on the FROZEN §4 stateful contract, the overflow menu on the 2.2
overlay controller.

## Boundaries & Constraints

**Always — tk-filter-chips:**
- Anatomy (vision-extracted from pattern-catalog-filters.png): pills radius-full, body-m text,
  white fill (surface-base), ~40–44px tall, single NON-wrapping row (overflow scrolls
  horizontally); UNSELECTED = 1px border-default hairline + text-primary; SELECTED = 2px
  yellow-100 border + text-primary (fill unchanged — selection is the border alone); focus ring
  per §8 unified token; effective targets ≥44×44 (§8 boxed register — pad hit area if the
  visual pill runs shorter).
- Semantics: container role=tablist, chips role=tab + aria-selected (the reference's own role,
  given the contract it implies — single-select by construction); each chip is a TAB STOP
  (reference fidelity: 7 observed stops — a deliberate, documented deviation from APG
  roving-tabindex, recorded in the story a11y notes); ArrowLeft/Right cycle focus within the
  group WITHOUT selecting (manual activation — the reference's Space-toggles model);
  Space/Enter select; **focus is PRESERVED on the toggled chip after the value change — the
  reference's focus-drops-to-body defect is the sanctioned improvement**; the group label via
  aria-label prop (visual label optional/slot per capture — none shown inline).
- Single-select: selecting a chip sets value to its item value and deactivates the prior
  (observed). Re-selecting the active chip KEEPS it active (reference checkbox toggle-off is
  NOT single-select-coherent — ruling: no deselect-to-none; value always one of the items;
  document in story notes).
- «Ещё» overflow: a chip-styled BUTTON (same pill, 1px hairline, chevron-down icon right,
  aria-haspopup, aria-expanded) placed after the visible window; opens a dropdown (overlay
  controller 'dropdown' layer, matchAnchorWidth per Select 2.3 mold) listing the remaining
  items as menuitemradio options; selecting one changes value through the SAME channel and
  closes the menu with focus returned to the «Ещё» button; while an overflow-resident item is
  active, the «Ещё» chip itself carries the selected border (the border-only selected language —
  visible indicator ruling, documented). Esc/outside-click close; menu items keyboard-navigable
  (arrows + Home/End per menu semantics).
- Data shape: `items: { value: string; label: string }[]` prop (the 2.3 options mold — slotted
  alternatives out of scope); `visibleCount: number` (default 7 — the reference's split);
  §4 FROZEN stateful pair `value`/`defaultValue` (string) + `value-change` (detail {value});
  clamping per §2 (value not in items → clamp to first item, correct the attribute).
- No new tokens (yellow-100/border-default/surface-base/text-primary/body-m all exist); chevron
  inline SVG currentColor; no theme branches; z-order via layer token only.

**Always — tk-pagination:**
- Anatomy (vision-extracted from pattern-table-stocks.png bottom): a `<nav>` landmark with
  aria-label («Пагинация» default, overridable); CENTERED row: prev chevron ‹ button — disabled
  (text-muted) at the lower boundary; page numbers as text buttons (blue-100 link-blue text, no
  fill) with ACTIVE page = yellow-100 pill (radius-full, ~32px) + ink-300 text + weight 700 and
  NOT focusable-as-link (aria-current="page", rendered non-interactive or focusable-but-current
  — pick per a11y review, document); ellipsis «…» (text-secondary, aria-hidden) where number
  gaps ≥2; next chevron › button — disabled at the upper boundary; SEPARATE ROW above the
  numbers: the «Показать еще» full-width bar — surface-muted fill, radius-md, ~44–52px, blue-100
  centered label («Показать еще» default, prop-overridable), emits the load-more occurrence.
- Windowing algorithm (capture: active=1 renders 1 2 3 4 5 … 196): always render first and last
  page; render the window of pages within ±2 of active; collapse gaps ≥2 into one ellipsis;
  dedupe when windows overlap. Unit-tested for active ∈ {1, 2, 3, middle, last−1, last, count≤7
  (no ellipsis), count=1 (numbers row hidden entirely — nav shows only load-more if present)}.
- §4 FROZEN pair `page`/`defaultPage` (number) + `page-change` (detail {value: number}) —
  identical strict/release semantics; `count` (number, ≥1, clamps), `showMore` boolean prop
  (default false — renders the load-more row when true) + bare-verb `load-more` event (no
  payload; §3 occurrence — registered in the event map); «Показать еще» does NOT change page
  (consumer appends) — focus stays on the bar after emitting.
- Focus discipline (EXPERIENCE): after a `page-change` the numbers re-render — focus lands on
  the NEWLY-ACTIVE page button (stays on nav; never drops to body). Prev/next wrap is FORBIDDEN
  (boundary = disabled, the reference model). Numbers are buttons (native focus), not links —
  the kit component has no URL model; document in story notes.
- Effective targets ≥44×44 on chevrons, numbers (pad the hit area — visual glyphs are ~32px);
  numbers row is a list (ol/li or aria-owned group); no new tokens (blue-100/yellow-100/ink-300/
  surface-muted/text-secondary/text-muted all exist).

**Always — both components:** the v1 component gate VERBATIM (FR-16): impeccable zero blockers;
axe both themes; stories = default + variants + interactive states + theming + a11y notes
incl. the full keyboard checklist + an SR-protocol section (execution maintainer-side);
React wrappers via `pnpm gen` + event-map entries (`value-change`, `page-change`, `load-more`);
provisional baselines (update flow, ×2 stable) + side-by-side vs the captures archived to
`.playwright-cli/verify/{filter-chips,pagination}/` + zai vision check; reduced-motion on all
motoricity (chevron/border transitions via motion tokens); RU story content, EN story meta.

**Never:**
- No reopening of settled v2 decisions (deltas, cream, registers — 6.1 landed them); no new
  tokens; no theme branches; no scroll-lock on the «Ещё» dropdown; no z-index literals; no
  changes to frozen §4/§9 text (the components CONSUME the contracts); no «Ещё» menu
  reimplementation outside the overlay controller; no multi-select mode v2 (items are
  single-select; a future multiselect is a new story, noted in docs).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Chip select | Space on «Валюта» | value=«Валюта»'s item value, `value-change`, prior deselected, FOCUS ON THE CHIP | — |
| Arrow cycle | ←/→ in the group | focus moves chip-to-chip (incl. wrap), NO value change | — |
| Overflow open | Enter on «Ещё» | dropdown mounts (controller, dropdown layer), aria-expanded=true | — |
| Overflow select | Enter on «Индексы» | value-change, menu closes, focus on «Ещё» button, «Ещё» carries selected border | — |
| Overflow Esc | menu open | closes, NO value change, focus to «Ещё» | — |
| Value clamp | value not in items | clamps to first item (§2), attribute corrected | — |
| Page change | click «2» | page-change {value:2}, active pill moves, focus on new active button | — |
| Boundary prev | page=1 | prev disabled (text-muted, aria-disabled, no emit) | — |
| Windowing | page=95, count=196 | 1 … 93 94 [95] 96 97 … 196 | — |
| Load more | click the bar | `load-more` emitted, page UNCHANGED, focus stays on bar | — |
| Controlled page | page prop | strict render; release seeds from last controlled | — |
| Empty/edge | count=1 | numbers row hidden; nav = load-more only (or nothing if showMore=false) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/select/` -- the overlay-consumer mold (menu open/close, focus return,
  event timing — the «Ещё» menu follows it)
- `packages/components/src/segmented-radio/` -- the pill mold (radius/full, single-select
  semantics, arrow cycling)
- `packages/components/src/overlays/` -- mountOverlay/positionFloating, LAYER 'dropdown'
- `packages/react/src/event-map.ts` -- tk-filter-chips + tk-pagination entries
- `.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png` (chips/«Ещё») +
  `pattern-table-stocks.png` bottom third (pager + load-more) -- side-by-side sources
- `tests/visual/` -- baselines; `packages/components/src/index.ts` + index.test.ts -- exports

## Tasks & Acceptance

- [x] `packages/components/src/filter-chips/{index.ts,filter-chips.ts,filter-chips.css.ts,filter-chips.test.ts,filter-chips.stories.ts}`
- [x] `packages/components/src/pagination/{index.ts,pagination.ts,pagination.css.ts,pagination.test.ts,pagination.stories.ts}`
- [x] event-map entries + `pnpm gen` + wrapper smokes (controlled-mode, both components) — 21 wrappers incl. FilterChips/Pagination
- [x] `.playwright-cli/verify/{filter-chips,pagination}/` side-by-sides + vision checks (recipes + renders + composites + pixel-probe NOTES; chips vision-audited, pagination vision BLOCKED by a CDN tooling fault — documented in its NOTES)
- [x] baselines via update flow + stability ×2; full gates green; specs closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows, when each unit suite runs, then every row asserts (12 rows across the
  two suites; windowing cases as a parametrized table).
- Given the «Ещё» menu opens, when inspecting the DOM, then the panel is controller-mounted on
  the dropdown layer — zero bespoke positioning/z code.
- Given axe on every new story × both themes, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0.
- Given the visual suite, then both components' baselines pass ×2; side-by-sides archived.

## Implementation Notes

**Recovery first (audit-trail context):** the executor round ran 14:02–14:08
and the session hung before any commit; the working tree held the full
implementation. Specs 6.2/6.3 were recovered verbatim from the session
transcript, docs restored from HEAD, and this close-out completed the cycle
(fixes → verify artifacts → gates) on top of that tree.

**tk-filter-chips** (`packages/components/src/filter-chips/`): tablist of
`role=tab` chips (single-select, every chip a tab stop — the reference's 7
observed stops, the sanctioned APG deviation, documented in the a11y story)
+ the «Ещё» chip-styled sibling button opening a `menu` popover
(`menuitemradio` rows) on the 2.2 overlay controller's dropdown layer —
zero bespoke positioning/z. While an overflow-resident item is selected the
«Ещё» chip itself carries the yellow border (the border-only language).
§4 value/defaultValue string channel with §2 clamps (unmatched → first
item; no empty state — no deselect-to-none). The closed panel hides via the
`hidden` attribute set from TS + a `:host([hidden])` override in the menu
sheet (see Triage 6).

**tk-pagination** (`packages/components/src/pagination/`): `<nav
aria-label>` landmark; windowing = first + last + ±2 around active, gaps ≥2
→ one ellipsis, dedupe; §4 page/defaultPage strict/release-with-seed, clamp
to [1, count]; active = `aria-current="page"` focusable-but-current (the
review-approved pick); border chevrons aria-disabled no-op; «Показать еще»
emits `load-more` only; focus lands on the newly-active number after a
change. Geometry trued to the pixel probes this round: bar 44px / gap
space-16 (the shipped first cut had 52/64 on fabricated css flags — replaced
with probe citations; see Triage 7 and the NOTES).

**Wrappers/docs:** event-map entries (`value-change`, `page-change`,
`load-more`), `pnpm gen` → 21 wrappers incl. FilterChips/Pagination; RU
stories (playground/variants/page-modes/theming/a11y+SR-protocol/api) with
EN meta; on-tint recipes via the `--tk-pagination-page-text` hook
(link-on-tint on light tints, white on charcoal — the tabs 3.3 precedent).

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

Quick-review lens (2026-09-24): **1 BLOCKER, 4 WARN, 6 NOTE; matrix 12/12**
— verdict «needs work before gates … after the blocker fix (+ its honest
test), the exception-log row, and the verify side-by-sides, this is
ship-ready». Dispositions:

1. **BLOCKER — Tab out of the open «Ещё» menu strands it open.** `@focusout`
   was bound on `.row` while the controller-reparented panel is `.row`'s
   SIBLING — panel-origin focusout never crossed the handler; aria-expanded
   + the document pointerdown listener survived, Esc unreachable, next
   outside click force-stole focus. Fixed at root cause: the same
   `#handleFocusout` also bound on the panel in `#getPanel` (guard kept),
   and `updated()` consolidated with post-render FOCUS REVALIDATION (a
   re-render that drops the focused row re-lands focus on checked-or-first —
   the HANDOFF §5 post-await lesson applied to data changes). Honest tests
   added: `focusoutFromRow` helper (panel-origin path), natural-Tab close
   (never forced back), mid-open items-shrink re-land, chip-press-while-open
   close, detach teardown.
2. **[WARN] No scrollIntoView in the menu** (focused row can clip under the
   ~7-row max-height) — fixed: `#focusMenuRows(edge)` + `#revealRow(row)`
   (`scrollIntoView({ block: 'nearest' })`), the select mold verbatim.
3. **[WARN] `#handleMoreClick` — the primary open path — had zero test
   coverage** (every suite open rode ArrowDown) — fixed: real click tests
   incl. the toggle-close branch.
4. **[WARN] Missing §9 exception-log row** for the menu-open internal state
   — added to CONVENTIONS.md §9 (the sanctioned §4/§9 mechanism).
5. **[WARN] Phantom verify provenance** — both css.ts headers cited
   NOTES.md files that did not exist. Delivered this close-out:
   `.playwright-cli/verify/{filter-chips,pagination}/` with committed
   capture recipes, kit renders (light+dark + open-menu), reference crops,
   side-by-side composites, and NOTES.md carrying the full pixel-probe
   ground-truth tables + deviations (the citations are now literal-true).
6. **[visual-gate finding, post-lens] Closed «Ещё» panel painted as a
   visible block** — author-origin `display: block` on the menu `:host`
   beats UA `[hidden]`. Fixed with `:host([hidden]) { display: none }` (the
   tooltip/modal mold); polluted baselines deleted EXPLICITLY (iron rule)
   and re-taken via the update flow.
7. **[geometry truing, this close-out] Pagination bar 52→44px, bar→numbers
   gap 64→16** — the shipped css flags («52–56», «64–72») were fabricated;
   pixel probes measured the reference at 44px / 19px → the spec range's
   bound + the nearest token step, flags rewritten with probe citations
   (NOTES.md). Pagination baselines re-taken (36 green).
8. **[NOTE] `.chip` min-width 44px** — applied (short labels pad to the
   §8 box).
9. **[NOTE] `load-more` invisible to the event-map syntax net** — grammar
   extended (occurrence events covered).
10. **[NOTE declined] Variants' controlled `page`** — kept: controlled
    variants are the house pattern (select.stories:61); not a defect.
11. **[NOTE] dead `tkp-field` class** — removed.
12. **[vision vs pixels]** six vision claims on the raw reference were
    refuted by probes this round (full-bleed bar, 44px height, pill
    position/⌀, blue inactive numbers, chip height/gap) — recorded per the
    standing methodology; the chips composite audit's radius note was
    likewise refuted (reference is r≈10–12 rounded-rect, the KIT is the
    capsule — backwards read).

**§9-recorded deviations vs reference** (frozen values kept, unfrozen
fixed — full tables in the NOTES files): chips radius-full (FROZEN, ref
r≈10–12) + gap 8 vs ~4–5 (token step); pagination link-family token
semantics (link/link-on-tint/text-muted/text-secondary vs the capture's
blues), pill 40×32 stadium vs ⌀32 circle, bar radius-md 12 vs 8, digit
pitch 48 vs ~36 (§8 floor).

## Verification

**Gates (order per HANDOFF):**

| Command | Exit |
|---|---|
| `pnpm build` | 0 |
| `pnpm test` | 0 — 730 unit (15 tokens + 537 components + 56 react + 122 root; first run caught the stale custom-elements.json mid-jsdoc-edits — `pnpm gen` then green) |
| `pnpm lint` | 0 |
| `pnpm typecheck` | 0 |
| `pnpm gen` / `pnpm gen:tokens` | 0 — 21 wrappers, manifest regenerated |
| `git add -A && pnpm gen && git diff --exit-code` | 0 (gen-drift clean) |
| `pnpm test:visual` | pass 1: 985/995 + 10 flakes (3× the known parallel axe-injection race, 7 visual/reduced-motion) — all 10 green on `--last-failed` rerun (10/10, 5.4s); **pass 2: 995/995 clean (5.9m, exit 0)** — baselines stable ×2, the flake class is worker parallelism, not drift |

**Baselines:** pagination re-taken via the update flow post-geometry-truing
(`--update-snapshots -g 'pagination'`, 36 green); filter-chips re-taken
after the `:host([hidden])` fix (explicit PNG deletion first — iron rule);
no baseline below the 1.5% bar was overwritten.

**Verify evidence:** `.playwright-cli/verify/{filter-chips,pagination}/` —
committed recipes (ports 6013/6014, the pinned visual-suite env), kit
renders, reference crops from captures-v2/invest-stocks, side-by-side
composites, NOTES.md with measured tables. Vision: chips audited (~95%
match, no defects; one radius claim refuted by pixels); pagination BLOCKED
by the CDN upload endpoint's session-slot pinning (one fixed URL for every
upload, first-write-wins — two fresh-basename attempts returned the
byte-identical URL); fidelity rests on the exhaustive pixel probes, per the
standing «pixels are ground truth» methodology.

**Changed files (git scope):** `packages/components/src/{filter-chips,pagination}/`
(new), `packages/components/src/index.ts` + `index.test.ts`,
`packages/components/custom-elements.json`, `packages/react/src/{event-map.ts,index.test.ts}`
+ generated wrappers, `packages/components/CONVENTIONS.md` (§9 row),
`tests/visual/filter-chips.spec.ts` (new), baseline PNGs (filter-chips ×2
themes, pagination ×2 themes — re-takes), `.playwright-cli/verify/{filter-chips,pagination}/`
(new), this spec.

