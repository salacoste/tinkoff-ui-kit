---
title: 'Story 2.3 — Select: native-equivalent keyboard dropdown'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
baseline_commit: 'ec5e1e6ae83fe0f870ba6f77f32f5e904dbb4639'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's «повышенный кэшбэк»-style select field has no kit counterpart — and the overlay controller (2.2) has never carried a real consumer.

**Approach:** Implement `tk-select` per EXPERIENCE.md/DESIGN.md: the field language + chevron, dropdown menu with the site's dropdown shadow and radius-sm items, native-equivalent keyboard behavior, combobox semantics — with the menu mounted/positioned through the 2.2 controller (adding the anchor-width matching the controller deferred to this story), and closing on outside click AND focus loss with focus returned to the trigger.

## Boundaries & Constraints

**Always:**
- Keyboard parity (EXPERIENCE Select row): Enter/Space opens; arrows navigate and move visual focus (aria-activedescendant); Enter selects; Esc closes without selecting; typeahead jumps (multi-char buffer, ~500ms reset — note the timing constant); Home/End jump first/last; menu closes on outside click AND on focus loss (blur leaving the whole component), focus returns to the trigger.
- Semantics: trigger = combobox role with accessible name (label prop like Input — reuse the Input field patterns: label always visible, aria-required, error described-by); popup = listbox/option with `aria-selected` on the chosen option; `aria-expanded` on the trigger; `aria-activedescendant` wiring while open; options identified by id.
- Stateful API per the FROZEN §4 contract: `value`/`defaultValue`/`value-change` (strict controlled + release seeding — identical semantics to Input), `options` (array of { value, label, disabled? } — the kit's data shape; slotted alternatives are NOT in v1, note the decision), `label`, `placeholder`, `required`, `error`, `disabled` — enum/null clamping per §2.
- Overlay integration (2.2 + AD-12): menu panel mounted via `mountOverlay(panel, 'dropdown')`, positioned via `positionFloating` anchored to the trigger — ADD the anchor-width matching to `positioning.ts` (`matchAnchorWidth?: boolean | 'min'` option — boolean = width equals anchor, 'min' = minWidth; Select uses 'min' so long labels can grow) — this is the sanctioned 2.3 public API addition; z-order only via the layer token; scroll-lock NOT applied (dropdowns don't lock page scroll); no own z-index/positioning code.
- Visual (DESIGN.md select spec): field = Input's language (surface-field fill, radius-md, 52px, hairline, unified focus ring); chevron icon slot (decorative, aria-hidden) rotating on open (motion token; reduced-motion safe); menu = `--tk-shadow-dropdown` 3-layer, radius top/bottom per the reference (menu panel radius, items radius-sm), surface-base background, selected item marked per the reference (note the observed style in the capture — highlight/ink; no yellow unless the capture shows it).
- Component gate: impeccable zero blockers; axe both themes; story covers default + open state (interaction story) + variants (label/placeholder/required/error/disabled) + theming + a11y notes incl. the full keyboard checklist; PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/select-cashback.png` AND `-open.png` archived to `.playwright-cli/verify/select/` + vision check.
- Unit tests (happy-dom): all keyboard rows, controlled strictness/release seeding (mirror Input's tests), outside-click close + focus return, focus-loss close, aria wiring (expanded/activedescendant/selected), typeahead buffer timing (fake timers), disabled options unselectable, clamping, controller integration (menu mounts on open, unmounts on close — assert via the overlay module's exported functions or DOM effects).
- React: event-map entry already covers `value-change` via the completeness guard's pattern — add `'tk-select': { onValueChange: 'value-change' }` to EVENT_MAP + `pnpm gen`; wrapper controlled-mode smoke mirrors Input's.

**Never:**
- No new tokens (chevron via inline SVG in shadow styles — color via currentColor/token; flag missing values in the report); no theme branches; no scroll-lock on dropdown; no z-index literals.
- No changes to frozen §4/§9 text (the anchor-width addition extends `positioning.ts`'s OPTION surface — a new option, not a contract change; note it in the module header).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Open + navigate | Enter, ↓ ↓ | menu opens; visual focus moves per aria-activedescendant | — |
| Select | Enter on active option | value set, `value-change` emitted, menu closes, focus on trigger | — |
| Esc | menu open | closes WITHOUT changing value; focus to trigger | — |
| Typeahead | type «ка» quickly | jumps to first option matching the composed buffer; buffer resets after timeout | no match → stays |
| Outside click | menu open | closes; focus returns to trigger | — |
| Focus loss | Tab away while open | closes; focus follows natural tab order | — |
| Disabled option | Enter on it | not selected; visual focus skips or blocks (pick + note) | — |
| Controlled | value prop set | identical semantics to Input (strict, release seeds) | — |
| Long option list | >viewport-height options | menu scrolls internally (option list max-height token-less: use spacing-derived max + overflow-y auto); aria-activedescendant follows into view (scrollIntoView block nearest) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/input/` -- the field mold (label/aria/error patterns, css conventions, test structure)
- `packages/components/src/overlays/` -- mountOverlay + positionFloating (EXTEND positioning with matchAnchorWidth); LAYER 'dropdown'
- `.playwright-cli/captures/select-cashback{,-open}.png` + `.working/captures-2026-09-22.md` § Select -- reference + measured observations
- `packages/react/src/event-map.ts` -- add tk-select entry (frozen registry)
- `tests/event-map-completeness.test.ts` -- will demand the entry when value-change dispatch appears (it checks the pattern)

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/overlays/positioning.ts` -- matchAnchorWidth option (boolean\|'min') + tests in overlays.test.ts -- the sanctioned API addition
- [x] `packages/components/src/select/{index.ts,select.ts,select.css.ts,select.test.ts,select.stories.ts}` -- the component suite
- [x] `packages/react/src/event-map.ts` + `pnpm gen` + wrapper smoke -- registry entry
- [x] `.playwright-cli/verify/select/` side-by-sides (closed + open) + vision check -- provisional evidence
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row's behavior asserts (all nine).
- Given the menu opens, when inspecting the DOM, then the panel is controller-mounted (dropdown layer) with anchor-min-width positioning — zero bespoke positioning/z code in select.ts.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0.
- Given the visual suite, then Select baselines pass both themes ×2; axe zero violations both themes (open state interaction story axe-clean too).
- Given a keyboard walkthrough, then the full checklist holds (documented in the story a11y notes).

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls flagged: disabled-option navigation behavior, selected-item visual (follow the capture, not assumption), typeahead timing constant, options-as-prop data shape.
- The open-state story renders the menu open for baseline/axe — use the component's open API (a `open` internal + story interaction or a forced-open prop? Prefer: interaction story via play-function-free static rendering with the menu open through element API — note the technique; axe must see the open menu).

## Spec Change Log

- 2026-09-22 (review pass 1) — Design-Notes amendment RATIFIED: the light-DOM panel decision could not pass its own axe gate (shadow→light aria-activedescendant/aria-controls idrefs fail aria-valid-attr-value); the panel ships as a shadow-tree child with its own shadow root (single-tree idrefs; popover path promotes in place — controller-documented shadow-safe; fallback path moves across the boundary). The future-overlay-components contract follows this pattern.
- 2026-09-22 (review pass 1) — R1 focus-return ambiguity resolved R1b (spec's own matrix row: outside-click returns focus; focus-loss follows natural tab order) — consistent with the EXPERIENCE Select row; the unqualified Focus-management-primitive sentence loses to the row that names the two close paths.
- 2026-09-22 (review pass 1) — accepted deviations (all in NOTES.md): placeholder text-secondary AA override; chevron nearest-token; single-select v1 (reference control is multiselect — noted for v2); typeahead jumps-never-commits (combobox convention per EXPERIENCE «typeahead jumps»); arrow wrap; no internal required validation.

## Review Triage Log

Pass 1 (4 lenses; verdicts: high 1 / medium 9 / low 4; 14 patch items + 1 emergent fix, all applied):

- high — open-menu baselines captured WITHOUT the menu (body-locator element screenshots exclude top-layer — the story's headline state had zero automated drift protection) → patch: tests/visual/select.spec.ts opens the select via the element API and captures the field∪panel region with a page-level clip (top-layer included), own baseline set both themes; NOTES harness-limitation updated.
- medium — unnamed combobox when label+placeholder both absent → patch: 'Выбор' default aria-label (localization-ready constant).
- medium — typeahead crashes on nullish labels; Space pollutes the buffer; IME composition pollutes → patches + tests.
- medium — stale aria-activedescendant on options/label change while open → patch: resync covers label/placeholder + requestUpdate; test.
- medium — duplicate option values mark the wrong row → patch: willUpdate clamps later duplicates + nullish, dev warn, convergent; test.
- medium — open-change fired before the panel mounted (and a SPURIOUS open-change(false) at mount — Lit lists never-set props in the first update's change map; caught by the React smoke after the timing fix) → patch: dispatch in updated() post-mount with triple guards; tests.
- medium — matchAnchorWidth constraint-before-measurement ordering unpinned (reorder ships green) → patch: width-dependent rect stub + clamp-bites anchor geometry asserting computed left.
- medium — weak focus-return assertion (operator-precedence bug: passed for any focused shadow element) → patch: strict toBe(button) + persistence macrotask.
- low — zero-options opens empty listbox (early-return); story/docs text sync (placeholder narrative, shadow wording ×4, css hook list + 4px flag); NOTES deviation split (17px) + committed capture recipe (select-capture.mjs).
- defer — form participation (name/FormData) recorded in NOTES limitations for 5.x.
- notes — intent-audit: every ambiguity resolved with documented rationale; visual expectations of the open menu now covered by the region spec (the manual side-by-side remains the provisional-approval evidence).

## Review Triage Log

## Design Notes

Menu in light DOM or shadow? The panel must be controller-mounted (reparented to the overlay container) — render it as a child of the component, mounted via the controller; the panel itself stays in the component's shadow root IF the controller's fallback path can host shadow content (it reparents the ELEMENT — a shadow-rendered panel is a child of the shadow root, cannot reparent without slot tricks). DECISION: render the panel in the component's LIGHT DOM (like slotted content, generated not slotted), hidden when closed — the controller can then mount it. Note this pattern in the module header — it's the contract future overlay components follow (Modal/Tooltip/Toast same).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow first, then ×2) -- all pass, stable
- impeccable hooks on UI writes -- zero blockers
