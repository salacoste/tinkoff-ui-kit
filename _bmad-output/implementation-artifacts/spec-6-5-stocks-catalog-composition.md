---
title: 'Story 6.5 — Composed stocks catalog + keyboard walkthrough'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — runs after 6.4 lands)'
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

- [ ] `packages/components/src/showcase/stocks-catalog.stories.ts` (composition + wiring
      + dataset; RU content, EN meta)
- [ ] `.playwright-cli/verify/stocks-catalog/` — assembly side-by-side vs full.png top
      region + walkthrough.md (the recorded Tab/arrow journey, live via playwright-cli)
      + a11y-sweep ledger rows extended
- [ ] baselines ×2 via update flow; axe both themes green; full gates green (VISUAL
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

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
