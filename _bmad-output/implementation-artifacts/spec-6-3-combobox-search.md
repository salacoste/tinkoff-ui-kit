---
title: 'Story 6.3 — ComboboxSearch: the catalog typeahead field'
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

- [x] `packages/components/src/combobox-search/{index.ts,combobox-search.ts,combobox-search.css.ts,combobox-search.test.ts,combobox-search.stories.ts}`
- [x] `tests/visual/combobox-search.spec.ts` -- open-state capture (page-level clip, both themes)
- [x] event-map entry + `pnpm gen` + wrapper controlled smoke
- [x] `.playwright-cli/verify/combobox-search/` side-by-side + vision check
- [x] baselines via update flow + stability ×2; full gates green; spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (11), when the unit suite runs, then each row asserts.
- Given the menu opens, when inspecting the DOM, then the panel is controller-mounted (dropdown
  layer, anchor-width match) and idrefs stay in one shadow tree.
- Given axe × both themes on every story (incl. open state), then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual baselines stable ×2.

## Implementation Notes

**Architecture** (`packages/components/src/combobox-search/`): the Select 2.3
mold adapted to a search register. Two css sheets — the field sheet plus the
panel sheet adopted into the suggestion listbox's OWN shadow root (single-tree
aria idrefs on both controller paths: popover promotion + fallback reparent);
6 `--tk-combobox-search-*` hooks (§6), each consumed WITH its token default;
`:host([hidden])` override on the panel sheet (the 6.2 lesson).

**§4 channel:** value/defaultValue string pair, strict/release with seed;
typing NEVER emits; Enter commits (field=label, `value-change`, menu closes,
focus stays in the field); Esc closes + restores the committed label; foreign
value renders as-is, NO clamp (search holds free text — the spec's own ruling,
not a deviation); dedup drops `value===''` options beyond select's
nullish-only mold — load-bearing ('' is the empty-value sentinel in
`#committedOption`). Outside-press keeps the transient query (only Esc
restores — the query is transient input, not value); whitespace-only query =
no filter (trimmed).

**Keyboard:** opens on typing; ArrowDown/Up step `aria-activedescendant` with
wrap; Home/End jump rows while OPEN and stay native caret moves while closed
(single-line input owns them); Space = query character (select's Space-inert
rule deliberately not carried); IME composition pauses the whole pipeline
(filter + open + navigation) until compositionend's trailing input. Alt+arrows
not intercepted, PageUp/PageDown unimplemented — APG-optional, spec silent,
deliberate (a11y story documents). Focus NEVER enters the panel — rows are
pointer targets (pointerdown preventDefault), focusout bound on `.field`.

**Overlay:** mountOverlay 'dropdown' layer, positionFloating anchored on the
field box, matchAnchorWidth true (panel = field width exactly — pixel-proven);
zero bespoke positioning/z. Zero matches / empty options KEEP the panel open
with an aria-disabled non-interactive «Ничего не найдено» row (the inverted
6.2 lesson), announced.

**Announcements:** polite live region, RU pluralization (1/4/11/21/22/111
classes walked correct), «Найдено N инструмент/а/ов», cleared on close;
consumer overrides `resultsMessage` ({n} template, textContent-bound — no
injection path) / `noResultsMessage`.

**Live-text re-sync (the load-bearing subtlety):** Lit's `.value` binding is
dirty-checked — after commit/Esc the binding value is unchanged vs the last
query render, so Lit SKIPS the write and diverged query text would survive in
the field. Fixed with an imperative re-sync in `updated()` (tk-input's
carve-out approach), hardened in triage to a `#composing` boolean
(@compositionstart/@compositionend) + `#forceFieldSync` set by the
commit/Esc-restore paths: unrelated updates (options identity churn from
React inline arrays) NEVER rewrite mid-composition; commit/Esc DURING
composition still force the restore (no orphaned provisional text).

**Open-state baseline driver:** the «Открытое меню» story self-drives via a
story-only TypeOnMount directive (real focus+input path — no declarative open
exists) — baselines and axe see the genuinely open panel. Triage caught the
factory being applied UNCALLED (`${typeOnMount}` instead of
`${typeOnMount()}`): the first --open baseline had silently recorded a CLOSED
field; fixed, both baselines re-taken.

**Wrappers/docs:** event-map `onValueChange`; `pnpm gen` → 22 wrappers incl.
ComboboxSearch; 4 React tests (registry entry, renders-as, unwrapped 'GAZP'
payload, controlled typing-never-emits/commit-emits with strict revert +
release-seed); RU stories ×7 (EN meta) incl. SR-protocol section. Story data:
'н' matches 5 of 10 instruments (Сбербанк contains 'н') — corrected from 4
during verification when real chromium disagreed with the spec comment.

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

Quick-review lens (2026-09-24): **0 BLOCKER, 5 WARN, 10 NOTE; matrix 11/11
covered by honest behavioral tests** — verdict «needs work before gates … all
small, none touch the 11 matrix behaviors». All 10 executor decisions AGREED
(dispositions 1:1 in the lens transcript); 3 open questions resolved (Q1 §9
row = triage/lead; Q2 baselines = the verify round; Q3 verify dir COMMITTED as
provenance). Dispositions:

1. **W1 — §9 exception-log row for the internal menu-open state** (jsdoc
   claimed «recorded» before it was): added BY THE ORCHESTRATOR to
   CONVENTIONS.md §9 (the filter-chips mirror; navigation-adjacent auxiliary
   surface, `aria-expanded` exposes state).
2. **W2 — phantom citation `pattern-catalog-searchbar.png` ×3** (ts:35, ts:48,
   css.ts:12): fixed to the real source — the TOP REGION of
   `pattern-catalog-filters.png`, provenance = spec frontmatter +
   verify/reference-measurements.md (the 6.2 phantom-provenance lesson
   applied; grep confirms zero `searchbar` hits remain).
3. **W3 — missing React wrapper controlled smoke** (spec task item): 4-test
   block added per the Select mold + 6.2 precedent; react suite 56 → 60.
4. **W4 — nullish `label` crashes `#filteredOptions`** (§2 degrade-never-
   throw): `String(option.label ?? '')` guards in #filteredOptions,
   #committedDisplay (was coercing undefined → literal 'undefined' string),
   and the row render; degrade test added.
5. **W5 — live-text re-sync not IME-safe in the composition-from-committed-
   state branch** (query===null: options churn mid-composition rewrote the
   field and cancelled the IME session; while commit/Esc-during-composition
   is exactly where the forced write IS load-bearing): composition boolean +
   `#forceFieldSync` from the commit/Esc-restore paths; stale heuristic guard
   removed; 2 regression tests (churn-during-composition keeps provisional
   text; Enter/Esc mid-composition lands the label, no orphans).
6. **N1** — spec Implementation Notes = this document (filled at close).
7. **N2/N3/N4** — doc lines (outside-press keeps query; whitespace-only =
   no filter; ''-sentinel dedup) — in the class-doc.
8. **N5** — story typos («однстрочное», EN/RU mix) — fixed.
9. **N6** — main-sheet `:host{display:block}` vs UA `[hidden]` on the host
   itself is KIT-WIDE (select same), not a 6.3 regression — recorded in
   deferred-work.md, out of scope here.
10. **N7** — event-map comment rephrased (the completeness net demands only
    events that actually dispatch).
11. **N8** — `.claude/worktrees/` (the parallel 7.1 worktree) gitignored by
    the orchestrator — gen-drift's `git add -A` would have staged the whole
    nested checkout.
12. **N9** — round ordering honored: verify evidence + baselines BEFORE the
    gate/commit round.
13. **N10** — Alt+arrows/PageUp/PageDown documented in the a11y story
    (deliberate, APG-optional, spec silent).
14. **[post-lens, verify round] TypeOnMount factory applied uncalled** — the
    --open baseline had recorded a CLOSED field (nothing asserted the expanded
    state); fixed + re-taken. The strongest catch of the cycle: a green suite
    baselining the wrong state.
15. **[post-lens, verify round] 'н' filter count 4 → 5** — spec/story
    comments corrected when real chromium disagreed.
16. **[post-lens, verify round] icon→placeholder gap trued** — probes found
    the kit at ≈1px box-to-glyph vs the reference's ≈16px (glyph x52);
    `margin-inline-end: var(--tk-space-16)` on `.field__icon` lands the glyph
    at x53 (residue = glyph sidebearing/AA); NOTES deviation #1 moved to
    «trued this round». The reference's own arithmetic (16 padding + 20 icon
    box + 16 gap = x52) is the proof.
17. **[vision]** BLOCKED this session — the analysis channel rejects data:
    URLs with a 400 and no upload endpoint exists (a different fault
    signature than 6.2's CDN slot-pinning, same outcome); zero vision claims,
    documented honestly — fidelity rests on the probes (pixels are ground
    truth; the probes caught the gap + the TypeOnMount defect vision would
    have been asked about).

**§9-recorded deviations vs reference** (full tables in the verify NOTES):
icon/placeholder token semantics (#959BA4 text-muted vs #999999 icon strokes
and the #999–#A5 placeholder band), verify-canvas #F5F5F6 vs #F6F7F8, radius-md
12 vs r≈11 (nearest token step), focus ring present in the open render (state
difference, not counted).

## Verification

**Gates (order per HANDOFF; run by the executor after the last source edit,
then the serialized orchestrator confirmation at commit time):**

| Command | Exit |
|---|---|
| `pnpm build` | 0 |
| `pnpm test` | 0 — 772 unit (tokens 15 + components 575 + react 60 + root 122); NOTE: `pnpm gen` MUST precede `pnpm test` after any css.ts/jsdoc edit — the root gen-drift guard fails on the stale committed CEM (CI parity `check:gen`) |
| `pnpm lint` | 0 |
| `pnpm typecheck` | 0 |
| `pnpm gen` / `pnpm gen:tokens` | 0 — 22 wrappers incl. ComboboxSearch; tokens no-op |
| `git add -A && pnpm gen && git diff --exit-code` | 0 (gen-drift clean) |
| `pnpm test:visual` | net **1041/1041** (995 → 1041, +46: 42 comboboxsearch + 4 page-clip spec); three runs, each green after `--last-failed` reruns of the documented flake classes (webServer-death connection-refused under multi-agent load; the port-6007 contamination incident below); zero pixel/axe failures on clean serialized reruns |

**Infra incidents (honest record):** the visual harness's webServer port
(6007) is MACHINE-GLOBAL with `reuseExistingServer: !CI` — while story 7.1's
worktree ran its own visual pass in parallel, a mid-flight run silently bound
the OTHER tree's dist (212-failure contamination class incl. 2 false
navbar-api pixel diffs against the worktree's build; all 212 green on the
serialized rerun against the correct dist). Lesson recorded in
deferred-work.md: SERIALIZE `test:visual` across concurrent checkouts, and
kill stray 6007 servers before gate rounds.

**Baselines:** 16 new (14 story ×2 themes + 2 page-clip ×2 themes), taken via
the scoped update flow, RE-TAKEN once after the x52 icon-gap truing (still
untracked at re-take — nothing below the 1.5% bar was ever overwritten; zero
pre-existing baselines touched). Stability: full-suite green across three
serialized passes.

**Verify evidence:** `.playwright-cli/verify/combobox-search/` — 11 files:
NOTES.md (files table,
recipe port 6020, probe method, kit-vs-reference ground truth, numbered
deviations, vision-blocked note), the committed capture recipe
(combobox-search-capture.mjs), reference-field.png (the 824×72 crop),
kit renders closed+open × light/dark (open = page-clip WITH top-layer
pixels), both side-by-side composites, reference-measurements.md +
runs.awk (committed provenance). Probe headlines: fill #FFFFFF exact, NO
border, 52px, radius-md 12 vs ref r≈11; open panel = field width exactly,
4px gap, 5 rows × 48px, active-row fill #ECF1F7 (= surface-field),
dropdown-shadow band present; icon gap ≈17px vs ref ≈16px post-truing.

**Changed files (git scope):** `packages/components/src/combobox-search/`
(new), `packages/components/src/index.ts` + `index.test.ts`,
`packages/components/custom-elements.json`, `packages/react/src/{event-map.ts,
index.test.ts}` + `generated/combobox-search.ts` + `generated/index.ts`,
`tests/visual/combobox-search.spec.ts` (new), 16 baseline PNGs (new),
`.playwright-cli/verify/combobox-search/` (new), `packages/components/
CONVENTIONS.md` (§9 row), `.gitignore` (worktrees), this spec.

**Process note:** this story ran as Track A of a two-track parallelization
(story 7.1 MegaNav in an isolated worktree, Track B) — the port-6007
collision class was found BY that parallelism and is now a documented
serialization rule.

