---
title: 'Story 6.4 — DataTable: the typographic row-as-link catalog table'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — story ran in the 6.3→7.1 parallel window)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 6.4 — THE v2 flagship)'
  - '{project-root}/packages/components/CONVENTIONS.md (§2/§4/§6/§8/§9 FROZEN)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§C exact colors, §D keyboard observed, §E typography — the measured source of truth)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png (776×11643 scroll capture — side-by-side source)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-select.md (props-driven data mold); spec-3-9-article-card (::after stitch)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The invest/stocks catalog table — the FR-12 flagship surface — has no kit
counterpart: two-line typographic rows as links, deltas whose COLOR carries direction, and a
reference whose keyboard layer is inert (arrows do nothing; every row a raw Tab stop).

**Approach:** Implement `tk-data-table` — a props-driven typographic table (the 2.3 options
mold: `columns` + `rows` data, no slots-v2) that is pixel-faithful to the measured anatomy
(NOTES §C/§E) and carries the SANCTIONED APG keyboard layer the reference lacks (FR-12's
improvement axis, HANDOFF §3: roving tabindex, ArrowUp/Down, Home/End, Enter/Space activate).

## Boundaries & Constraints

**Always:**
- API (props-driven, additive, navigation NOT a form channel — the navbar/§9 ruling; NO §4
  pair, NO events): `columns: TkDataTableColumn[]` where TkDataTableColumn =
  `{ key: string; header: string; align?: 'start'|'end'; width?: string }` (width = a css
  track value consumed as-is, default auto — structural, flagged); `rows:
  TkDataTableRow[]` where TkDataTableRow = `{ href: string; cells:
  Record<string, TkDataTableCell> }` and TkDataTableCell = `{ primary: string;
  secondary?: string; delta?: 'positive'|'negative' }` — the two-line cell anatomy
  (primary 15/24, secondary 13/20); `delta` applies the delta semantic color to BOTH lines
  of that cell (reference: ₽-line and %-line share the direction color; the SIGN lives in
  the data string — «color carries direction, sign optional per cell data», the epics row
  verbatim); no delta → text-primary/text-secondary. `caption?: string` — the accessible
  table name (sr-only; the reference has no visible caption). Unknown cell keys render
  empty; missing `href` renders the row inert (no anchor) — degrade, never throw (§2).
- Anatomy (NOTES §C/§E measured): row height **81px** (two-line cells; capture literal —
  FLAG, no token); header row 15px/500 text-secondary, STATIC (no sort v2), letter-spacing
  normal, aligned with the body tracks; body primary text 15px/24px text-primary (reference
  ink rgba(0,0,0,0.8) = the product-UI primary mapping), secondary 13px/20px
  text-secondary; **dividers 1px `--tk-color-border-table` on the row's border-bottom**
  (row-level paint — same visual as the reference's TD-border trick), no zebra; **hover =
  `--tk-color-surface-row-hover` on the whole row** (NOTES real-hover probe rgba(36,74,127,
  0.06)), name text stays ink, no underline (the reference's net visual; the anchor's raw
  blue-100 base color is overridden by inner text — kit renders ink directly); column
  tracks via css grid on the row, `align` maps to text-align per column.
- Deltas: `--tk-color-delta-positive` / `--tk-color-delta-negative` (the 6.1 AA-override
  semantics — reference #00A328/#F52222 are DESIGN.md anchors, NOT consumed). The 6.1
  CONSTRAINT holds: delta text sits on surface-base cells only; the row-hover composite
  (4.039:1, pinned contrast.test.ts) is UNAVOIDABLE — hover is reference-faithful and the
  color IS the semantic → recorded as a §9 exception-log row BY THE ORCHESTRATOR at triage
  (rationale: direction-by-color is the table's core semantic; alternatives break the
  semantic or invent tokens; hover is transient; revisit if the token layer gains
  delta-on-tint variants). Dark theme: the dark delta tokens on dark row-hover (#FFFFFF1A)
  ride the 6.1 dark first-pass — 8.2 verifies.
- Semantics/keyboard (the APG layer — reference fidelity covers VISUALS, keyboard is the
  sanctioned improvement): container `role="table"` named by the caption (aria-label);
  header `role="row"` of `role="columnheader"` cells; body rows `role="row"` containing
  `role="cell"`s; the row's FIRST cell's primary text is a real `<a href>` whose `::after`
  stretches `inset: 0` over the positioned row (the 3.9 article-card stitch — the row is
  the containing block) — the WHOLE row is the link's hit area, one anchor per row.
  Roving tabindex on the anchors (focused row's anchor tabindex 0, others −1; initial =
  first row): ONE Tab stop into the table; ArrowUp/Down move row-to-row CLAMPED at the
  ends (no wrap — grid convention); Home/End first/last row; Enter navigates natively;
  Space is preventDefaulted + click() (anchors ignore Space natively); Tab exits naturally
  from the focused row. `:focus-visible` on the anchor draws the §8 unified ring around
  the WHOLE ROW (`.row:focus-within` — the boxed register).
- Scope fences: NO selection channel v2 (no checkboxes/radio rows); NO sorting (headers
  static); NO virtualization v2 (long lists scroll naturally — a 100-row story proves it);
  NO brand-logo column type v2 (the reference's circular logos — noted as a future thumb
  cell type); narrow viewports = the table's min-width with `overflow-x: auto` on the host
  (column collapse OUT of scope; flag the min-width literal).
- The v1 component gate VERBATIM (FR-16): impeccable zero blockers; axe both themes;
  stories = default playground (the reference's three columns: Название/Цена/Изменение
  with two-line cells + real tickers) + variants (single-line rows, align end columns,
  delta mixes incl. no-delta, inert rows) + interactive keyboard story + theming + a11y
  notes (keyboard checklist incl. the roving contract) + SR-protocol section; React
  surface via `pnpm gen` (no events — property passthrough); provisional baselines ×2 +
  side-by-side vs a pattern-table-stocks.png crop archived to
  `.playwright-cli/verify/data-table/` + vision check (blocked-protocol honest); RU
  content, EN meta.

**Never:**
- No new tokens; no theme branches; no z-index literals; no scroll-lock; no §4/§9 text
  changes; no reopening of the delta-semantic decision (6.1 landed it); no sort/selection/
  virtualization; no logo/image cells v2; no synthetic :hover in stories beyond the token.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Render | 3 columns, 10 rows | header + 10 grid rows, 81px, two-line cells per data | — |
| Delta up | cell {primary:'+56 ₽', secondary:'+1,2 %', delta:'positive'} | both lines delta-positive, sign as given | — |
| Delta down/none | delta:'negative' / omitted | delta-negative / ink+muted lines | — |
| Row navigate | click anywhere on a row | the row anchor's href (whole-row hit area) | — |
| Keyboard entry | Tab into table | focus lands FIRST row's anchor (single stop) | — |
| Arrows | ↓↓↑ in body | focus moves row-to-row, clamped at ends, NO wrap | — |
| Home/End | Home / End | first / last row anchor focused | — |
| Enter/Space | on focused row | native navigation / click() — same href | — |
| Empty rows | rows=[] | the documented zero-state copy slot (never blank), no rowgroup | — |
| Missing data | unknown cell key / no href | empty cell / inert row (§2 degrade) | — |
| Long list | 100 rows | natural scroll, roving intact, no virtualization | — |
| Caption | caption set/omitted | role=table named / unnamed (axe warns — story documents) | — |
| Narrow viewport | <table min-width | host overflow-x auto (columns never reflow) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/select/` -- the props-driven data mold (options → columns/rows)
- `packages/components/src/article-card/` -- the ::after whole-card stitch (row hit area)
- `packages/components/src/navbar/` -- navigation-not-a-form ruling (no §4/events)
- `.playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png` -- side-by-side
  source (crop a representative header+3-rows window)
- `tests/visual/` -- baselines; `packages/components/src/index.ts` + index.test.ts -- exports

## Tasks & Acceptance

- [ ] `packages/components/src/data-table/{index.ts,data-table.ts,data-table.css.ts,data-table.test.ts,data-table.stories.ts}`
- [ ] event-map UNCHANGED (no events) + `pnpm gen` (wrapper = property passthrough)
- [ ] `.playwright-cli/verify/data-table/` side-by-side + probes + vision (blocked-protocol)
- [ ] baselines via update flow + stability ×2; full gates green (VISUAL SERIALIZED — port
  6007 is machine-global, see deferred-work); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (13), when the unit suite runs, then each row asserts.
- Given the keyboard story, when driven by the visual spec, then the roving contract
  (single Tab stop, arrows clamped, Home/End, Space-activates) holds in chromium.
- Given axe × both themes on every story, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
