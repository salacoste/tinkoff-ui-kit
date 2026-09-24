---
title: 'Story 6.5 — Composed stocks catalog + keyboard walkthrough'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'b1a1b9f (on main); merged-main confirmation in Verification'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 6.5 — FR-12 composition consequence)'
  - '{project-root}/packages/components/src/showcase/{homepage,application-form}.stories.ts (THE composition mold — read the jsdoc contracts first)'
  - '{project-root}/packages/components/src/{navbar,combobox-search,filter-chips,data-table,pagination}/ (the five composed surfaces)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/full.png (side-by-side source — TOP REGION, assembly-level standard)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/ (the ledger this story extends)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-12's composition consequence is unproven: the five v2 catalog surfaces
(mega-nav, search, chips, table, pagination) shipped individually but never as ONE page —
and the reference's own keyboard journey is inert (NOTES §D), so the sanctioned APG
improvement has no end-to-end proof either.

**Approach:** A SHOWCASE composition (the `src/showcase/` mold — compositions must not
read as kit components): `stocks-catalog.stories.ts` assembling the two-deep mega-nav +
combobox-search + filter-chips + tk-data-table + pagination over a real-ticker dataset
with live wiring (search commit filters; chips filter; pagination windows), PLUS the
recorded keyboard walkthrough (Tab/arrow journey through the whole cluster, live via
playwright-cli) and the a11y-sweep ledger rows for the v2 cluster.

## Boundaries & Constraints

**Always:**
- Placement + mold: `packages/components/src/showcase/stocks-catalog.stories.ts` — the
  application-form mold VERBATIM (one render function keyed to a closure state object,
  re-invoked via Lit `render(template, host)` from each `-change` handler; focus survives
  re-renders; tokens-only canvas styling — zero hardcoded values; the file's jsdoc states
  the ASSEMBLY standard: reading order, cluster, wiring — NOT per-pixel matching;
  per-component deltas stay in their verify NOTES).
- Composition (top → bottom, the reference's above-the-fold): the 7.1 two-deep navbar
  (`subLinks` = the invest sections) → the catalog controls cluster (combobox-search +
  filter-chips per the reference layout) → tk-data-table (the flagship rows) → tk-pagination
  (windowed, load-more style if the reference shows it — probe full.png). Wiring is REAL:
  search commit filters rows (name/ticker substring); chip selection filters by the
  chip's data facet (the story dataset carries the facet field — mapping documented in
  the story jsdoc); pagination slices the FILTERED set; zero matches = the table's
  zero-state + chips remain operable (never a dead end). Filters compose with AND across
  control kinds, OR within chips (the tablist single-select contract rules — verify
  against the chips element's actual selection model and follow IT, do not invent).
- Dataset: real RU tickers (15–30 rows so pagination has 2–3 windows), two-line cells
  with deltas per the 6.4 anatomy; data lives in the story file (the mold's pattern).
- Keyboard walkthrough (the deliverable): a RECORDED live journey via playwright-cli
  (the sanctioned browser tool) — Tab from page start through mega-nav (row-1 links →
  utilities → row-2 links) → search (type + arrow + Enter commit) → chips (arrow within
  the tablist per its contract) → table (single Tab stop, ArrowUp/Down rows, Home/End,
  Enter row) → pagination (Tab stops + activation) — every step's focused element +
  announcement expectation logged; evidence = `.playwright-cli/verify/stocks-catalog/`
  (walkthrough.md with the step table + key screenshots); the a11y-sweep LEDGER gains
  the v2 cluster rows (the file's existing format). On the LIVE reference nothing is
  typed/submitted — the walkthrough drives THE KIT's story page only.
- The v1 composition gate (the showcase precedent): axe × both themes on the composed
  story, zero violations; provisional baselines ×2 (the composed page IS a story —
  standard story baselines; no page-clip needed unless a top-layer surface opens — the
  search panel: if baselined open, the combobox-search page-clip technique applies);
  RU content, EN meta; no new components, no new tokens, no wrapper changes (showcase
  stories are not exported — index.ts untouched).

**Never:**
- No new components or elements; no new tokens; no theme branches; no per-pixel truing of
  the composed page (assembly-level standard); no changes to the five composed components'
  APIs (a wiring gap found = REPORT it, triage decides — executor does not patch kit
  components in this story); no live-reference input (playwright-cli on the kit story
  only); no §4/§9 text changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Compose | story mounts | the five surfaces in reference reading order, real data | — |
| Search commit | type «СБ», Enter | rows filtered by substring, field shows label | zero rows → table zero-state |
| Chips filter | chip selected | facet-filtered rows (follow the chips selection model) | — |
| Combined | search + chip | AND across kinds, composed result count | — |
| Pagination | page 2 | windowed slice of the FILTERED set | filter shrink → page clamps |
| Zero matches | all filters out | zero-state, controls operable | — |
| Keyboard journey | full Tab/arrow walk | the recorded step table holds (every stop named) | — |
| Theme | dark toggle | whole composition re-themes (inherited properties) | — |
| a11y | axe on composed story | zero violations both themes | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/showcase/application-form.stories.ts` -- THE mold (jsdoc
  contracts: wiring technique, assembly standard, completion formula analog)
- `packages/components/src/{navbar,combobox-search,filter-chips,data-table,pagination}/`
  -- the composed surfaces (READ their public APIs; do not modify)
- `.playwright-cli/captures-v2/invest-stocks/full.png` -- top-region side-by-side
- `.playwright-cli/verify/a11y-sweep/` -- the ledger to extend; `tests/visual/` -- baselines

## Tasks & Acceptance

- [x] `packages/components/src/showcase/stocks-catalog.stories.ts` (composition + wiring
      + dataset; RU content, EN meta)
- [x] `.playwright-cli/verify/stocks-catalog/` — assembly side-by-side vs full.png top
      region + walkthrough.md (the recorded Tab/arrow journey, live via playwright-cli)
      + a11y-sweep ledger rows extended
- [x] baselines ×2 via update flow; axe both themes green; full gates green (VISUAL
      SERIALIZED — port 6007 machine-global); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (9), when the composed story is driven, then each row holds
  (wiring asserts live in the walkthrough evidence; unit-test what the harness can).
- Given the keyboard walkthrough, when executed on the kit story, then every stop's
  focused element + announcement matches the recorded table.
- Given axe × both themes on the composed story, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0 (showcase changes no
  exports); visual stable ×2.

## Implementation Notes

Executed on main in the 6.5 window, committed `b1a1b9f` (23 files, lane-only):
`packages/components/src/showcase/stocks-catalog.stories.ts` (591 lines — the
application-form mold verbatim: one render function keyed to a closure state object,
re-invoked via Lit `render()` from each `-change` handler; focus survives re-renders —
PROVEN by the walkthrough's S36/S38 pager discipline and S14 search commit),
`tests/visual/stocks-catalog.spec.ts` (179 lines — E2E wiring legs: search commit,
chip select, zero-state, pagination windowing, load-more), 4 new baselines (×2 themes),
`.playwright-cli/verify/stocks-catalog/` (walkthrough.md — 39 recorded steps S1–S39
across 6 legs, 8 stills wt-01…08, NOTES, capture recipe, side-by-sides ×2 themes), and
`.playwright-cli/verify/a11y-sweep/group-IV.md` — the v2 cluster's ledger rows (24/24
cells, both themes).

**Wiring as specced:** search commit filters by name/ticker substring (S14: «СБ» →
2 rows); chips filter by facet — the tablist's SINGLE-SELECT contract rules (roving
focus, Enter/Space commits selection; the frozen block's «OR within chips» clause was
written against an assumed multi-select and the spec itself ordered: follow the
ELEMENT's actual selection model — see Triage Log); filters compose AND across kinds
(S18: «Сбербанк» needle × «Валюта» facet → 0 rows → the table's zero-state, chips stay
operable — S20 re-selects and the rows return); pagination windows the FILTERED set
(S36: page 2 = the 3-row slice) and load-more collapses the numbers row at count=1
(S39); dark theme re-themes the whole page with zero story branches (wt-08).

**Keyboard walkthrough (the deliverable):** 39 steps, every stop probed for the REAL
focused element through open shadow roots — 14 nav stops before the first control;
combobox aria-activedescendant roving; chips arrows-move vs Enter-select; table single
Tab stop + clamped ArrowUp/Down + Home/End + native Enter on the row anchor; pager
focus lands on the newly-active page number after every page/chevron/load-more change;
Esc returns focus to the «Ещё» trigger. No dead ends, no dropped focus. On the LIVE
reference nothing was typed or submitted — the record drives the kit's story page only.

**Visual/axe:** 1154/1154 ×2 green in the executor window (zero axe violations — the
new axe serializer's first full-field proof after debt #18); a11y-sweep group-IV rows
24/24. N1 (lens): walkthrough.md:38 cross-ref said «mega-nav walkthrough, 7.1» — no such
artifact exists (7.1's evidence = NOTES.md + §D); corrected to «the mega-nav §D keyboard
order, 7.1» (navbar.test.ts:755 pins that order).

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

Quick-review lens (qr-lens-6-5) on `b1a1b9f`: **SHIP — 0 BLOCKERS / 0 WARN / 2 NOTEs.**

- **N1 — walkthrough.md:38 named a nonexistent artifact** («matches the mega-nav
  walkthrough, 7.1» — 7.1's evidence set is NOTES.md + §D, no walkthrough). The claim
  itself (14 nav stops) verified TRUE. DISPOSITION: FIXED at spec close — one-word
  correction to «the mega-nav §D keyboard order, 7.1» (the order pinned at
  navbar.test.ts:755).
- **N2 — px lengths on the story canvas** = the documented FR-1 blind spot (same as the
  mold showcase files). DISPOSITION: recorded, no action.

**Provenance note (honest):** the lens's report tail (wiring-map verdict, deviation
dispositions, hygiene lines) was lost to relay truncation at first delivery; the
dispositions below were re-verified by the ORCHESTRATOR directly against the commit and
the spec closed on them. The lens's compact resend then ARRIVED POST-CLOSE and CONFIRMED
every disposition without discrepancy — its own wording: wiring-map 5/5 TRUE (with cites:
stories:294-298/:229-236/:301-304/:245-264/:313-315/:239-242, spec legs :129-140/:142-
154/:175-178), deviations = COMPLIANT / CORRECT / HONEST-verified / WITHIN CHARTER,
hygiene all CONFIRMED (4 all-new baselines, event surface untouched, group-IV ledger
cites real — combobox-search.test.ts:312/:340/:371, pagination.test.ts:118,
data-table.test.ts:203, filter-chips.test.ts:153, filter-chips.ts:583-587), verdict
unchanged SHIP 0/0/2. The lines below keep the orchestrator's original phrasing:

- **«OR within chips» vs single-select — NOT a deviation:** the frozen block's own
  parenthetical rules («verify against the chips element's actual selection model and
  follow IT, do not invent»); tk-filter-chips is a tablist SINGLE-select (6.2), so the
  composition's single-select + AND-across-kinds is the spec's letter. Evidenced at
  walkthrough S18/S20.
- **Per-component pixel deltas as scope fences — correct:** the frozen block sets the
  assembly-level standard («no per-pixel truing of the composed page»; deltas live in
  per-component verify NOTES).
- **«СБ» → 5 matches — verified:** S11 (Сбербанк, Сбербанк-ап, Т-Инвестиции ТМосбиржа,
  Сбер MOEX Total Return, Индекс МосБиржи — dataset-wide substring), live-announced
  «Найдено 5 инструментов».
- **Port-6007 orphan kill (executor) — protocol-conformant:** foreign orphaned serve.mjs
  (PPID 1, zero runners, verified twice 60s apart) — exactly the refined rule's kill
  criteria.
- **Hygiene:** 23 files ALL lane-only (showcase story + tests/visual specs + baselines +
  verify evidence — commit file list verified); 4 baselines all-new (2 story + 2
  region-clip × both themes); event surface untouched (no packages/react files in the
  commit); ledger extension follows group-IV's existing format (24/24 cells).

## Verification

| Gate | Result |
|---|---|
| Executor window `b1a1b9f` | visual **1154/1154 ×2** green (first full-field proof of the axe serializer after debt #18 — zero axe failures both runs); a11y-sweep group-IV 24/24 both themes |
| Merged-main full gates (post-6.4-fix merge, this close window) | **ALL GREEN** — tokens 15, components 630, react 66, root 122; gen-drift empty |
| Merged-main visual (union suite: 1145 + 6.5's 9 legs) | **1154/1154 passed ×2** (7.0m each, private port 6031, temp VISUAL_PORT config deleted before commit) |
| Matrix rows (9) | each holds — wiring legs E2E-pinned in tests/visual/stocks-catalog.spec.ts (search commit / chip select / zero-state / windowing / load-more) + the recorded walkthrough steps |
| gen check | showcase story changes no exports — `pnpm gen` clean, index.ts untouched (commit file list) |
