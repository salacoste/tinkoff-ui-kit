---
title: 'Story 6.3 — ComboboxSearch: the catalog typeahead field'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '4bf13f4115afb4609f05408e642fc000831778a7'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 6.3)'
  - '{project-root}/packages/components/CONVENTIONS.md (§4/§9 FROZEN)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§D: search role=combobox; UX addendum anatomy)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png (vision-extracted 2026-09-24)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-select.md (THE mold — combobox keyboard, overlay, timing, review lessons)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The stocks catalog's «Название или тикер» search field — the entry point of the
FR-12 data-view cluster — has no kit counterpart. It is the reference's only combobox and the
keyboard-complete search primitive every v2 catalog composes (6.5 wires it to the table).

**Approach:** Implement `tk-combobox-search` as the Select 2.3 mold adapted to a search field:
flat white field with a left magnifier icon, typeahead filtering over an options prop, the
menu on the 2.2 overlay controller (dropdown layer), a polite result-count announcement, and
commit-on-Enter semantics (typing never commits — the 2.3 «typeahead jumps-never-commits»
ruling carried over).

## Boundaries & Constraints

**Always:**
- Anatomy (vision-extracted): surface-base fill, NO border (flat white field against a muted
  page — the search register, distinct from Input/Select's surface-field+hairline), radius-md,
  52px height, magnifier icon LEFT (inline SVG, currentColor/text-muted, aria-hidden), placeholder
  «Название или тикер» (prop-overridable, text-muted). Focus = the §8 unified ring. The custom
  property grammar per §6 (`--tk-combobox-search-fill` etc. with token fallbacks).
- Keyboard (EXPERIENCE row + 2.3 mold): opens on typing (any printable key or the input being
  focused+typed); ArrowDown/Up move visual focus through options (aria-activedescendant) with
  wrap; Enter selects the active option (commits: field shows the option label, value becomes
  its value, `value-change`, menu closes, focus stays in the field); Esc closes WITHOUT
  committing and restores the field text to the committed value's label; Home/End first/last;
  plain typing continues filtering (multi-char buffer semantics: each keystroke refilters —
  this is a search field, NOT the 2.3 jump-buffer; the distinction is deliberate, document it).
- Commit semantics (§4 FROZEN): `value`/`defaultValue` = the SELECTED OPTION'S VALUE (string —
  the 2.3 data-shape semantics, display = label); typing-only NEVER emits (the query is internal
  transient state; consumers needing the raw query get it at commit time via the option, or
  compose their own input — noted in story notes); `value-change` detail {value} fires ONLY on
  commit (Enter/click); release seeding + strict controlled per the frozen shapes; value not in
  options → field shows it as-is if non-empty (search fields tolerate foreign values better
  than selects — ruling, documented) with NO clamp-to-first.
- Filtering: case-insensitive substring on label (and value), computed internally; zero matches
  → the menu shows a NON-interactive «Ничего не найдено» row (2.3's zero-options lesson
  INVERTED deliberately: an empty popup flashing on every keystroke is worse than a stable
  no-results row — ruling, documented); count announced politely (aria-live="polite" region:
  «Найдено N инструментов» / «Ничего не найдено» — RU, prop-overridable template) — the live
  region is inside the component, updates AFTER the filter settles, never steals focus.
- Semantics: field role=combobox (aria-expanded, aria-controls, aria-activedescendant while
  open) + aria-label (placeholder is NOT a name — label prop or aria-label default «Поиск»);
  popup = listbox/option, aria-selected on the committed option; idrefs within one shadow tree
  (the 2.3 Spec-Change-Log shadow-panel pattern — panel is a shadow-tree child with its own
  root; single-tree idrefs).
- Overlay integration (AD-12): menu via mountOverlay 'dropdown' layer + positionFloating
  anchored to the field, matchAnchorWidth true (menu = field width — the reference's full-width
  suggestion list); NO scroll-lock; outside click AND focus loss close (focus follows natural
  tab order on focus-loss; returns to the field on outside-click/Esc — the 2.3 R1b matrix).
- The v1 component gate VERBATIM (FR-16): impeccable zero blockers; axe both themes; stories =
  default + open state (the 2.3 page-level-clip technique for open-menu baselines —
  tests/visual own spec with a clip covering field∪panel) + variants (placeholder/disabled/
  foreign-value) + theming + a11y notes incl. the keyboard checklist + SR-protocol section;
  React wrapper via `pnpm gen` + event-map (`value-change`); provisional baselines ×2 +
  side-by-side vs the capture's search region archived to `.playwright-cli/verify/combobox-search/`
  + zai vision check; reduced-motion; RU content, EN meta.

**Never:**
- No new tokens; no theme branches; no scroll-lock; no z-index literals; no async/server search
  v2 (options prop is sync — a provider/async story is future work, noted in docs); no reopening
  of 6.1 token decisions; no changes to frozen §4/§9 text; no IME-hostile filtering (composition
  events respected — the 2.3 review lesson: buffer/filter pauses during compositionstart..end).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Type | «GA» | menu opens, options filtered (label+value, case-insensitive), count announced | zero matches → «Ничего не найдено» row |
| Navigate | ↓ ↓ ↑ | aria-activedescendant moves, active option scrolled into view (block:nearest) | wrap at both ends |
| Commit | Enter on active | field=label, value-change {value}, menu closes, focus in field | — |
| Esc | menu open, typed «GA» | closes, field restored to committed label, NO emit | — |
| Outside click | menu open | closes, focus to field | — |
| Focus loss | Tab away open | closes, natural tab order | — |
| Foreign value | value="XYZ" not in options | rendered as-is, no clamp, menu filters normally | — |
| Controlled | value prop | strict: typing changes nothing committed until consumer answers | — |
| Release | value removed | uncontrolled, seeded from last committed | — |
| IME | composition in progress | filter does not run mid-composition | — |
| Long list | >max-height options | internal scroll, activedescendant follows | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/select/` -- THE mold (copy the structure: open/close timing guards,
  activedescendant resync, duplicate-clamp, IME pauses, controller integration asserts, the
  open-state visual spec with page-level clip)
- `packages/components/src/input/` -- field aria/label patterns
- `packages/components/src/overlays/` -- mountOverlay + positionFloating (matchAnchorWidth true)
- `packages/react/src/event-map.ts` -- tk-combobox-search entry
- `.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png` top region -- side-by-side
- `tests/visual/` -- baselines incl. the open-state spec (select.spec.ts mold)

## Tasks & Acceptance

- [ ] `packages/components/src/combobox-search/{index.ts,combobox-search.ts,combobox-search.css.ts,combobox-search.test.ts,combobox-search.stories.ts}`
- [ ] `tests/visual/combobox-search.spec.ts` -- open-state capture (page-level clip, both themes)
- [ ] event-map entry + `pnpm gen` + wrapper controlled smoke
- [ ] `.playwright-cli/verify/combobox-search/` side-by-side + vision check
- [ ] baselines via update flow + stability ×2; full gates green; spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (11), when the unit suite runs, then each row asserts.
- Given the menu opens, when inspecting the DOM, then the panel is controller-mounted (dropdown
  layer, anchor-width match) and idrefs stay in one shadow tree.
- Given axe × both themes on every story (incl. open state), then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual baselines stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)

