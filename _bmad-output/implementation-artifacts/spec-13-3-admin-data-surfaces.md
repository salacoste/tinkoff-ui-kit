---
title: 'Story 13.3 — admin data surfaces (toolbar + status tables + page header + cards)'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 2
baseline_commit: 'e274712'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-13-1-admin-gap-map-capture-source.md (Change Log 2: status-tables + toolbar COMPOSITION CONFIRMED; empty-state deferred; drawer absent)'
  - '{project-root}/.playwright-cli/captures-v3/admin/ (reference pack: admin-table-toolbar, admin-limits-company, admin-limits-business-cards, admin-payments-hub, admin-main-fullpage)'
  - '{project-root}/packages/components/src/badge/ (variants = incentive|stat ONLY, badge.ts:41; default renders GREEN (incentive, badge.ts:48 + badge.css.ts:70-71); ZERO --tk-badge-* custom-property hooks — the pack's gray and red tones are unreachable today)'
  - '{project-root}/packages/components/src/tabs/ (TkTab.badge EXISTS — tabs.ts:21, renders <tk-badge count> at tabs.ts:318, count already in the accessible name — badge tones flow into tab counts with NO tabs code)'
  - '{project-root}/packages/components/src/progress-bar/ (fill hook --tk-progress-bar-fill EXISTS, progress-bar.css.ts:122, honored by determinate AND indeterminate; track height = structural 4px literal with NO hook, :112 — pack bars are h6–10)'
  - '{project-root}/packages/components/src/filter-chips/ (selected = 2px yellow border + 44px floor matches the pack's segmented filter; chip API is LABEL-ONLY, filter-chips.ts:17 — the pack's count-digit-in-chip is a recorded delta)'
  - '{project-root}/packages/components/src/data-table/ (zero status/badge/pill hooks — composition, not code)'
  - '{project-root}/packages/components/src/button/ (variants primary/secondary/inverse, button.ts:54 — the pack's #ECEEF0 gray-fill toolbar button maps via a named stand-in + delta note)'
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (13.3 closes Epic 13's build stories before the 14.x sweep/release)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** the admin pack ratifies the console's data surfaces as
**compositions of existing atoms** (spec 13.1 Change Log 2), but the kit
ships none of the recipes, and two pack-grounded tones/geometry are
unreachable with shipped code: the pack's **gray** count digit and status
pill render GREEN today (badge default = incentive), no red/attention tone
exists, and no custom-property hooks expose badge theming; the pack's
6–10px progress tracks cannot render on a structural 4px literal.

**Scope (every row pack-grounded):**

| Surface | Pixel evidence (pack) | Deliverable |
|---|---|---|
| Badge tones | gray digit in tab count chips (`admin-table-toolbar` tabs via existing `TkTab.badge`); gray status pill h28 light-fill gray-text («Ожидает подписи», `admin-table-toolbar` row); red `#E5372B` count pill on the in-progress bar (`admin-payments-hub`) | **CODE: `badge` `neutral` + `attention` variants** + mint the `--tk-badge-*` hooks family (zero hooks today); tabs consume them through the EXISTING `TkTab.badge` slot — no tabs code |
| Toolbar above tables | `admin-main-fullpage` «Действия»: 6 gray-fill buttons `#ECEEF0` r10 h36–40 icon+label (one white+shadow emphasized), search, filter chips, «Запомнить» toggle | **Docs pattern**: button **`secondary` stand-in + fill delta** (secondary = surface-base white + hairline, button.css.ts:151-158 — no gray-fill variant exists) + combobox-search + filter-chips (selected border/floor already match; count-in-chip = recorded delta, label-only API) + checkbox as the «Запомнить» stand-in (no toggle atom — delta recorded) |
| Status table | `admin-table-toolbar`: tabs w/ count badges, segmented filter, summary row (checkbox r8 + count + total), rows w/ circular avatar + 2 subtitles + right amount + status pill | **Docs pattern**: data-table + the new neutral badge (status column), tabs counts via `TkTab.badge`; colored statuses ungrounded — neutral mapping only |
| Page header | `admin-limits-*`: H1 + right-aligned secondary tabs + 1px divider + «…» overflow | **Docs pattern** (consumes the 13.2 tabs underline variant) |
| Progress-in-cards | `admin-limits-*`: thin h6–10 fully-rounded bars — yellow `#FFDD2D` AND neutral-dark `#333` fills; blue sliver `#4A5FC1` | **CODE: `progress-bar` height hook** (track 4px literal → size/height option); fill colors = pattern note via the EXISTING `--tk-progress-bar-fill` (determinate + indeterminate already honor it) |
| Favorites tile grid + ghost tile | `admin-payments-hub`: 5×2 tiles `#F0F0F2` r16 w/ per-tile «…»; ghost action tile (blue icon+link, no border) | **Docs pattern** (tile + ghost tile recipes; the overflow «…» popover stays deferred — no open-state capture) |

**Out of scope (recorded):** red/attention ON TAB LABELS (extension — the
pack grounds attention on the payments-hub in-progress bar only, NOT on
table-toolbar tabs, which show gray digits); filter-chips count slot
(label-only API — delta recorded, follow-up if a pack surface demands it);
toggle atom («Запомнить» = checkbox stand-in, delta recorded); empty-state
(deferred — ungrounded); drawer (RESOLVED ABSENT — not in v1.3.0);
avatar-menu / kebab menu-popover open states (follow-up capture per 13.1);
«Изменить лимит» blue-link rows (`link` covers them).

</frozen-after-approval>

## Boundaries & Constraints

- Composition-first: code lands ONLY where shipped capability is missing —
  this spec adds exactly two changes: **badge variants (`neutral` +
  `attention`) with the `--tk-badge-*` hooks family** and **the
  progress-bar height hook**. Everything else is docs patterns + stories.
- Both changes are additive (no breaking props; `incentive`/`stat` and the
  4px default survive untouched); any css.ts change ⇒ `pnpm gen`, regen
  committed WITH the change, `pnpm test` AFTER gen.
- New stories ⇒ baselines as unconfirmed PNGs (1.5% floor rule; human
  batch-confirm at the pre-release gate).
- Console numbers are model-estimated ±; PNGs are ground truth. Token
  grammar: `--tk-badge-*` (MINTED here), `--tk-progress-bar-*` (existing
  prefix — NOT `--tk-progress-*`). New tokens get a pack-grounded reason +
  a home in the 13.2 DESIGN.md console section.
- RU story content, EN story-meta; EN conventional commits by explicit
  pathspec; pnpm only; no parallel visual runs on 6007.

## Tasks & Acceptance

1. **Badge `neutral` + `attention` variants** (code). AC: `neutral` =
   light gray fill + gray text (renders the pack's h28 status pill AND the
   gray tab-count digit — fix today's green default mismatch);
   `attention` = red `#E5372B` with **text pairing passing AA at body-xs**
   (white on #E5372B ≈ 4.3:1 and ink ≈ 3:1 both fail — map onto the red
   scale with a passing pair per the frozen badge AA-pairing ruling, or
   record the deviation in NOTES); `--tk-badge-*` hooks minted (fill/text
   at minimum) per-variant; a11y: tone never rides color alone (existing
   count/text stays in the accessible name); regen + tests + RU demo story
   (status pill + tab counts via the EXISTING `TkTab.badge`) + baselines.
2. **Progress-bar height hook** (code). AC: track height exposed (size
   option or custom property) rendering the pack's h6–10 thin bars;
   default 4px unchanged; determinate + indeterminate + degenerate cases
   intact; regen + tests + RU demo story (yellow + neutral-dark cards from
   `admin-limits-*`) + baseline.
3. **Admin data-surface patterns** (docs). AC: pattern pages for toolbar,
   status table (neutral-badge status column + summary-row recipe),
   page header (right-aligned tabs + divider), progress-cards (heights via
   Task 2, fills via `--tk-progress-bar-fill`), favorites grid + ghost
   tile — each citing its pack PNG + the recorded deltas (button
   `secondary` + gray-fill delta, «Запомнить» checkbox, filter-chips
   count, avatar circles as plain img slots); showcase story composing one
   payments-list screen (toolbar + table + status column + tab counts).
4. **Ledger.** AC: Change Log + Verification honest; out-of-scope items
   restated with owners.

## Implementation Notes

- Sequencing: lands AFTER 13.2 (page-header pattern consumes the tabs
  underline variant; DESIGN.md console section hosts the new token homes);
  both after the `e274712` CI verdict.
- Badge geometry (±): the pack's status pill is h28, light fill, gray
  text — map onto the existing badge shape; the in-chip count digit is a
  small circle inside the tab label row (`TkTab.badge` already places it).
- Progress bars: thin (h6–10) fully-rounded; the yellow variant is the
  console's only yellow FILL besides the logo (selection = 2px borders,
  not fills) — keep consistent with 13.2's DESIGN.md language.
- Summary-row checkbox = existing `checkbox` (r8 in the pack); avatar
  circles = plain img/div slots in the pattern — no new avatar component
  (open-state ungrounded).

## Spec Change Log

1. 2026-09-27 — initial draft; scope per spec 13.1 Change Log 2; reference
   = the PII-redacted admin pack.
2. 2026-09-27 — quick-review lens round 1: **NEEDS-FIX**, re-scoped per
   findings: (a) tabs count-badge was a DUPLICATE (`TkTab.badge` exists,
   count in accessible name) → code #1 is now badge `neutral`+`attention`
   variants + `--tk-badge-*` hooks (the real gap: gray renders green
   today, no red tone, zero hooks); (b) progress-bar fill hook EXISTS
   (`--tk-progress-bar-fill`) → code #2 is now the track HEIGHT hook
   (4px literal vs pack h6–10), fill mapping demoted to a pattern note;
   (c) red #E5372B re-attributed to the payments-hub in-progress bar
   (on-tab red marked extension, not pack-grounded); (d) filter-chips
   count-in-chip + «Запомнить» toggle + gray-fill button recorded as
   deltas with named stand-ins; (e) token prefixes corrected
   (`--tk-progress-bar-*`; `--tk-badge-*` minted by Task 1).
3. 2026-09-27 — lens round 2 (re-verdict **APPROVED**): folded — (a) Task 1
   AC pins the AA body-xs text pairing for `attention` (both naive pairs
   on #E5372B fail; map onto the red scale or record the deviation);
   (b) toolbar stand-in pre-named deterministically: button `secondary` +
   gray-fill delta (no gray-fill variant exists). Status → approved.

## Verification

(filled at execution)
