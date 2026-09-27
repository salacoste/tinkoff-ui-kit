---
title: 'Story 14.1 — sweep deltas + docs completion (the 13.x console family)'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 2
baseline_commit: 'afa645e'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (Story 14.1 — "a11y-sweep engine legs for the new family (13.2/13.3)… CEM-driven component pages + the new vertical docs groups gain their family entries"; 14.x mirrors 11.x)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-11-1-a11y-sweep-deltas.md (THE mold this mirrors: Group VI registry rows + group-VI.md ledger + SR-protocol story sections + run-sheet split)'
  - '{project-root}/tests/visual/a11y-sweep.spec.ts (the SWEEP registry — Groups I–VI, the group union type, stops/minKitSurfaces semantics, "story chrome rides unasserted")'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/METHOD.md + group-VI.md (ledger format: six-check rows × surface, RU, real evidence pointers)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v2.md (the living run-sheet — execution stays maintainer-side per §8.1.4; the v1.3.0 package is 14.2 work)'
  - '{project-root}/packages/docs/src/component-search.ts (COMPONENTS = the 19 v1 pages ONLY — the whole v2 cluster + both pattern pages are invisible to the docs index search; pre-existing gap this story owns)'
  - '{project-root}/packages/docs/src/theming-guide.stories.ts (the per-component override demos — the 13.3 hooks family has no demo figure)'
  - '{project-root}/packages/docs/src/v2/data-table.stories.ts:187 (the v2 pattern-page SR-protocol table mold — console-chrome + data-surfaces carry NO protocol section)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-13-2-console-nav-chrome.md + spec-13-3-admin-data-surfaces.md (the family surfaces this story sweeps: components-tabs--console-underline, components-badge--console-tones, components-progressbar--thin-bars, the two v2 pattern pages)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** the 13.x console family shipped with per-story unit + visual +
axe gates (both cycles green), but WITHOUT the completions every previous
family round carried — mirroring the exact debt 11.1 closed for 10.x:
1. no a11y-sweep registry rows for the new stories (the SWEEP knows nothing
   of `components-tabs--console-underline`, `components-badge--console-tones`,
   `components-progressbar--thin-bars`);
2. no ledger rows (group files stop at VI) and no SR-protocol deltas (the
   tabs/badge/progress-bar protocol tables predate the family; both v2
   pattern pages lack the protocol section the 8.3 page mold carries);
3. docs completion debt, part pre-existing: the docs index search lists
   ONLY the 19 v1 pages — the nine v2 components, Mega nav, and both 13.x
   pattern pages are unsearchable (8.3 never extended the index; this cycle
   surfaces it); the theming guide demos none of the minted
   `--tk-badge-fill`/`--tk-badge-text`/`--tk-progress-bar-height` hooks; a
   stale-claim pass is owed (badge "two variants", progress "4px" claims).

**Scope — four work items:**

1. **ENGINE — Group VII registry rows** (the 13.x family; second-row
   precedent — v1/v2 rows stand untouched): three rows measured on the
   built docs bundle (stops + minKitSurfaces COUNTED, never guessed):
   `tk-tabs / components-tabs--console-underline` (roving tabindex → 1
   stop, N tab surfaces), `tk-badge / components-badge--console-tones` (the
   embedded tk-tabs figure carries the interactive surfaces — badges are
   non-interactive), `tk-progress-bar / components-progressbar--thin-bars`
   (0 stops, 0 surfaces — the row exists so the story joins the walk+scan
   matrix). RECORDED DECISION: the v2 pattern pages (console-chrome,
   data-surfaces demos) do NOT get sweep rows — the 8.1 line holds (the
   sweep is component canonical stories; docs pages ride axe via the visual
   suite + their protocol sections; interaction behavior belongs to the
   component rows). Group union type extends `'VII'`; header doc block
   gains the family note.
2. **LEDGER — `group-VII.md`**: the three surfaces × the six checks, RU,
   real evidence pointers (file:line opened at run time), the docs-pages
   coverage mode named (axe legs via visual.spec.ts, protocol tables in the
   pages). Mirrors group-VI.md. The METHOD.md «Extensions after 5.1–5.3»
   list gains the group-VII sentence (the group-VI precedent — the method
   doc stays the one-stop index).
3. **SR PROTOCOLS** (sections extend; execution stays maintainer-side —
   §8.1.4): (a) the tabs/badge/progress-bar story protocol tables gain
   13.x rows (underline indicator: aria-selected + bold text carry state,
   the ink bar is presentation-only — announcements unchanged vs the pill;
   badge neutral/attention: tone NEVER announced — text content carries it
   (color-alone rule); thin bars: label-prop naming — the bare-pack delta);
   (b) console-chrome + data-surfaces pattern pages GAIN the
   «Протокол скринридер-проверки» table (the 8.3 page mold): the console
   tabs row (names + counts in the announcements), the payments demo row
   (toolbar → tabs → table traversal), labeled bars. Baselines repaint
   (delete + update, explicit).
4. **DOCS COMPLETION:** (a) component-search gains the v2 family entries —
   the 11 v2 pages (8 element pages + Mega nav + Console chrome + Data
   surfaces; SearchEntry grows an optional kind so pattern pages without an
   element tag stay legal; the page jsdoc's "19 kit pages" claim
   corrected); the search demo stories' baselines repaint; (b)
   theming-guide: one override-demo figure for the badge pair
   (`--tk-badge-fill`/`--tk-badge-text` retint live) + the height hook
   named in the channels list — tokens only; baselines repaint; (c)
   stale-claim sweep across docs pages + CONVENTIONS + READMEs: badge
   variant-union claims, progress-bar fixed-4px claims, "no badge hooks"
   claims — fix at the claim site, hex-free (zero-hardcoded guard).

**Out of scope (recorded):** SR run-sheet EXECUTION (maintainer-side; the
v1.3.0 runsheet package is 14.2); dark legs (automatic — visual suite runs
both themes; dark-sweep registry needs no row: no new component); fidelity
rows (14.2); landing-page-style live-interaction specs for the pattern
pages (their interactions are the component rows' contract — nothing new
to drive); releases/tags (maintainer-only).

</frozen-after-approval>

## Boundaries & Constraints

- stops/minKitSurfaces are MEASURED on the built bundle before the row
  lands (the 11.1 "MEASURED <date>" comment mold); a story adding an
  interactive surface updates its row deliberately.
- Any baseline repaint = explicit delete + update (1.5% floor rule); no
  batch-confirm — the PNGs stay unconfirmed until the 14.2 maintainer
  package.
- Story content RU, meta EN; tokens only in all painted docs surfaces
  (FR-1 guard runs on docs); commits by explicit pathspec, EN conventional;
  pnpm only; port 6007 never parallel.
- The search index change touches `component-search.ts` (a docs-site
  element, no CEM) — no `pnpm gen` implications; the theming-guide figure
  is docs-only too. `pnpm test` after all edits.
- SR-protocol tables state EXPECTED announcements (RU verbatim) with EMPTY
  result cells — the engine never claims a maintainer run happened.

## Tasks & Acceptance

1. **Group VII registry rows** (code). AC: three rows land with measured
   stops/minKitSurfaces + the recorded docs-pages decision comment; group
   union extends; full a11y-sweep file green on the built bundle (all
   groups).
2. **group-VII.md ledger** (docs). AC: three surface sections × six
   checks, RU, evidence pointers opened at run; the coverage-mode note for
   the pattern pages; totals line in the file header.
3. **SR protocol sections** (docs+stories). AC: the protocol tables living
   in the component `Accessibility` stories
   (`components-{tabs,badge,progressbar}--accessibility`) gain the family
   rows; both pattern pages carry the protocol table (the 8.3 mold); the
   REPAINTED baselines are exactly those stories' PNGs (3 accessibility
   stories × 2 themes) + the pattern-page overview stories that gain the
   table — NOT console-underline/console-tones/thin-bars (their pixels
   don't change).
4. **Docs completion** (docs). AC: search index 30 entries (19 v1 + the 11
   v2 pages: 8 elements + Mega nav + Console chrome + Data surfaces);
   pattern entries carry the kind marker + ru names (element tag optional);
   the getting-started search-demo baselines repaint;
   theming-guide figure + channels list name all three hooks; stale-claim
   grep set runs clean (badge union, 4px claims, hooks claims).
5. **Ledger.** AC: Change Log + Verification honest; out-of-scope items
   restated with owners (14.2).

## Implementation Notes

- Measure FIRST (probe the built bundle with the existing walk, count),
  then write rows — the registry comment block records the measurement
  date like Group VI's.
- The badge console-tones row: minKitSurfaces counts the embedded tabs'
  tab buttons (3) — badges/labels are not interactive; stops = 1 (roving
  tabindex single stop per tabs group).
- The theming-guide badge figure retints a REAL badge pair via the hooks
  (e.g. attention → ink pair) — the same tokens-only rule as the existing
  demos; `--tk-progress-bar-height` joins the channels prose (a geometry
  demo is redundant — thin-bars already shows it).
- Stale-claim grep set: `incentive.*stat|two variants|два варианта`,
  `4px|четырёх пикс` near прогресс/badge contexts, `no hooks|нет хуков`,
  over packages/docs/src, packages/components/CONVENTIONS.md, root +
  package READMEs — inspect every hit, fix only true staleness.

## Spec Change Log

1. 2026-09-27 — initial draft (autonomous round; epics-v4 Story 14.1;
   mirrors 11.1 engine mold + the 11.2 docs-completion half).
2. 2026-09-27 — quick-review lens round 1: **NEEDS-FIX**, folded: (a) Task 3
   AC named the WRONG repaint set — the protocol tables live in the
   component `Accessibility` stories (tabs:451/badge:314/progress:442), not
   the console family stories (their pixels don't change); (b) Task 2
   missed the METHOD.md «Extensions» list entry (the group-VI precedent);
   (c) search count corrected: the v2 cluster is 11 pages (8 elements +
   Mega nav pattern), not 12 — 30 total. Re-verdict: **APPROVED** (all
   three are precision fixes; scope unchanged). Status → approved,
   lenses_ran ['quick'], iteration 2.
3. 2026-09-27 — EXECUTION deviation, recorded: the frozen Task 4 wording
   "SearchEntry grows an optional kind" landed as an OPTIONAL TAG instead —
   same legality (pattern pages without an element render no tag chip
   line), one field fewer; Mega nav KEEPS a real tag (`tk-navbar` — the
   page IS the navbar two-row extension). No behavior change vs the frozen
   intent.

## Verification

Task 1 — Group VII registry rows: **DONE**. Three rows in
`tests/visual/a11y-sweep.spec.ts` (tabs console-underline 1 stop / 4
surfaces, badge console-tones 1 stop / 3 surfaces, progressbar thin-bars
0/0); group union extends 'VII'; the docs-pages-off-registry decision
lives in the registry comment (8.1 line). Stops are MEASURED BY THE
ENGINE: the walk asserts the EXACT kit-stop count (`.toBe(target.stops)`
with the re-measure message) — green = measured, no guessing. 9 new legs
green; the full a11y-sweep file: **108 passed** (99 prior + 9).

Task 2 — ledger: **DONE**. `.playwright-cli/verify/a11y-sweep/group-VII.md`
(three surfaces × six checks, RU, file:line pointers opened at run:
tabs.css.ts:198-208, badge.css.ts:87-110, badge.test.ts:192/207,
progress-bar.css.ts:117, progress-bar.test.ts:190, tabs.spec.ts:444,
dark-sweep.spec.ts:353-359; the pattern-pages coverage-mode section).
METHOD.md «Extensions after 5.1–5.3» gains the group-VII sentence.

Task 3 — SR protocol sections: **DONE**. Component `Accessibility`
stories extended: tabs +«Консольный режим (indicator="underline")» row
(announcements unchanged vs the pill); badge +«Консольные тона» row (tone
never announced) AND the stale «обеих пар (4.74:1 и 12.6:1)» claim
corrected to «всех четырёх пар … DESIGN.md» with neutral/attention figures
joining the demo row; progress-bar +«Тонкие бары» row (label-prop naming,
the axe-driven bare-pack delta). Both pattern pages carry the protocol
table (console-chrome in «Доступность»; data-surfaces gains a
«Доступность» section + table). Baselines: the 3 accessibility pairs + 2
page pairs re-captured delete+update (14 PNGs total incl. Task 4's two
below); the console-underline/console-tones/thin-bars baselines UNTOUCHED
(their pixels didn't change — proven by the full compare run).

Task 4 — docs completion: **DONE** (deviation (3) above). Search index:
30 entries (19 v1 + 11 v2 — 8 elements + Mega nav [tk-navbar] + Console
chrome + Data surfaces [tagless, conditional chip line]); haystack handles
the optional tag; getting-started status claim corrected «все 19
компонентов» → «все 27 компонентов (19 v1 + 8 v2)» — both stale claims of
this round found by the spec's grep set. Theming guide: the badge-pair
override figure (attention default vs the hook-retinted pair, tokens
only) + the geometry-channel note naming `--tk-progress-bar-height`.
Stale-claim sweep otherwise CLEAN (CONVENTIONS/READMEs/EXPERIENCE carry no
variant-union or fixed-4px claims; the theming-guide tk-button "no fill
hooks" adjustment remains TRUE).

Task 5 — ledger: **DONE** (this Change Log + Verification). Out-of-scope
restated: SR run-sheet EXECUTION + the v1.3.0 runsheet package → 14.2;
fidelity rows → 14.2; releases/tags → maintainer-only.

Gates (2026-09-27, local): root vitest **151** / components **713** /
react 70 / tokens 17 — all green; lint clean; a11y-sweep **108**; full
visual compare `node tests/visual/run.mjs` **1438 passed** (visual+axe,
both themes, every story) — includes the 14 re-captured baselines' axe
legs. No css.ts change this round → no `pnpm gen` (CEM untouched).
