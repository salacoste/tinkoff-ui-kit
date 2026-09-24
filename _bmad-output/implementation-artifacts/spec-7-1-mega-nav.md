---
title: 'Story 7.1 — MegaNav: the two-deep header'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '932c9b3'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.1)'
  - '{project-root}/packages/components/CONVENTIONS.md (§4/§9 FROZEN)'
  - '{project-root}/packages/components/src/navbar/ (v1 — THE base; its NOTES.md height ruling)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/pattern-header-meganav.png (pixel-probed 2026-09-24)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§D keyboard: every link a Tab stop)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The invest/business cross-domain headers are two-deep (bank-wide row + domain
sub-nav row) — v1's tk-navbar models one row only (FR-13).

**Approach:** EXTEND `tk-navbar` with an optional sub-nav row (the epics' «not a new element
where avoidable» pick — composition API, no `tk-mega-nav` element): a `subLinks` prop renders
a second plain-link navigation row inside the same sticky bar; sticky/shadow/burger inherit
unchanged. Panels/flyouts OUT of scope (volatile A/B).

## Boundaries & Constraints

**Always:**
- API (additive, zero breaking — v1 navbar renders identically without subLinks):
  `subLinks: TkNavbarLink[]` (the SAME data shape as `links` — value/label/href, navigation
  not a form channel, NO §4 pair, NO events — the v1 ruling carries verbatim);
  `subActiveValue: string` (marks the active sub-nav section; matching nothing marks none —
  the v1 matrix pick); `subLabel: string` (accessible name for the second `<nav>` landmark,
  default «Разделы» — two navs on one page need distinguishing names, the v1
  DEFAULT_NAV_LABEL precedent). Sub-nav row renders ONLY when subLinks is non-empty.
- Anatomy (pixel-probed from pattern-header-meganav.png, 1280×129): row 1 = the v1
  bank-wide bar VERBATIM (72px per DESIGN `navbar.height` — the recorded capture-vs-DESIGN
  ruling stands; yellow underline + 700 ink active; logo/utilities slots; burger <768px);
  row 2 = 64px (capture-measured literal, flagged per flag-don't-invent — no token exists),
  plain links: inactive text-secondary, ACTIVE = 700 text-primary + NO underline (the
  capture shows NO underline and NO row divider — separation is whitespace on the shared
  white surface; row 1's underline language does NOT cascade down). Both rows white
  surface-base; the sub-nav row left-aligns with the same container register as row 1
  links (capture: logo x≈80–120, row-1 links from x≈124, row-2 links from x≈88 — the
  sub-nav starts at the row-1 LINK register, not the logo register — document in the
  story notes).
- Sticky/shadow: the WHOLE two-row bar is one sticky unit; the 10px scroll threshold +
  shadow/hairline fade apply to the bar as a whole (v1 logic untouched — the shadow sits
  under the LAST row). Burger drawer: v1's model unchanged (row-1 links only; sub-nav is
  DESKTOP-ONLY chrome, hidden <768px — the mobile capture shows no sub-nav; document).
- Semantics: two `<nav>` landmarks (`Навигация` + `subLabel`); every link a real `<a>`
  and a Tab stop (§D observed order: row-1 links → Войти → row-2 links); native anchor
  navigation, never intercepted; active marking is presentational only (aria-current="page"
  on the active link of each row — real semantics for real navigation).
- The v1 component gate VERBATIM (FR-16): impeccable zero blockers; axe both themes;
  stories = default (v1 regression: navbar WITHOUT subLinks must render byte-stable) +
  two-deep playground + variants (no-subLinks / unmatched subActiveValue / long sub-nav
  overflow) + theming + a11y notes incl. the keyboard checklist + SR-protocol section;
  React surface: `pnpm gen` (no new events — property passthrough via the existing
  wrapper mechanism; event-map UNCHANGED unless gen requires an entry — if the generator
  needs a stub entry, record why); provisional baselines ×2 incl. a v1-navbar UNCHANGED
  proof (the existing navbar baselines must not move) + side-by-side vs the capture's
  two-row region archived to `.playwright-cli/verify/mega-nav/` + zai vision check;
  reduced-motion (shadow fade already tokened); RU content, EN meta.

**Never:**
- No new tokens; no theme branches; no z-index literals; no mega-panels/flyouts (out of
  scope); no second burger/drawer for sub-nav; no §4/§9 text changes; no breaking change
  to v1 navbar's DOM/API/baselines; no scroll-lock.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| v1 regression | no subLinks | renders EXACTLY v1 navbar (existing baselines unmoved) | — |
| Two-deep | subLinks 6 items, subActiveValue='catalog' | row 2 under row 1 inside the same bar; active item 700 ink, no underline | — |
| Unmatched active | subActiveValue='nope' | NO link marked (v1 matrix pick) | — |
| Sticky scroll | scroll 10px+ | shadow+hairline fade in under the LAST row | — |
| Burger <768px | mobile viewport | row 1 burger drawer as v1; sub-nav row HIDDEN | — |
| Keyboard | Tab through | row-1 links → utilities → row-2 links, all real anchors | — |
| Empty subLinks | `subLinks=[]` | no second row, no second nav landmark | — |
| a11y | two navs | landmarks named («Навигация», subLabel); aria-current on both actives | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/navbar/` -- THE base (navbar.ts/css/stories/test all extend
  in place; the v1 render path must stay byte-identical without subLinks)
- `.playwright-cli/captures-v2/invest-stocks/pattern-header-meganav.png` -- side-by-side
  source (rows y0–63 / y65–128; logo x≈80–120; row-2 link register x≈88)
- `tests/visual/` -- baselines; `packages/components/src/index.ts` (no new export — the
  same tk-navbar) + index.test.ts (API surface pins extend)

## Tasks & Acceptance

- [ ] `packages/components/src/navbar/navbar.ts` + `navbar.css.ts` extended (subLinks/
  subActiveValue/subLabel; the 64px row-2 literal flagged; sub-nav hidden <768px)
- [ ] `navbar.stories.ts` + `navbar.test.ts` extended (v1 regression suite INTACT —
  existing tests untouched; new matrix rows + v1 byte-stability pin)
- [ ] `.playwright-cli/verify/mega-nav/` side-by-side + vision check
- [ ] baselines via update flow + stability ×2 (new stories only; existing navbar
  baselines MUST NOT move — compare-mode proof); full gates green; spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (8), when the unit suite runs, then each row asserts (new tests;
  every pre-existing navbar test still passes unmodified).
- Given the navbar renders without subLinks, when the visual suite runs, then the v1
  baselines pass byte-for-byte (no re-take).
- Given axe × both themes on every story (incl. two-deep), then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

**2026-09-24 (triage, post-executor):** two factual premises inside the frozen
«Always — anatomy» bullet are CORRECTED per the standing pixels-are-ground-truth
methodology (the 6.2 geometry-truing precedent): the reference's row 2 DOES mark
its active sublink with an underline (2px #666666, y127–128, x150–196) and the
rows ARE separated by a hairline divider (1px #DDDFE0, y64, container span) —
the original freeze rested on probes at y118–120 / a partial divider window that
missed both. Ruling: row 2 active = 700 text-primary **+ 2px underline in
`--tk-color-text-secondary`** (token semantics vs the #666666 literal — recorded
deviation), and a **1px `--tk-color-border-default` divider** renders between the
rows when the subnav row exists (vs #DDDFE0 — recorded deviation). Everything
else in the frozen block stands (row 1 v1-verbatim yellow-underline DESIGN
ruling; no-underline cascade still does NOT apply — row 2 has its OWN underline
language, the reference's). The no-subLinks byte-stability invariant is
unaffected. Component trued in the worktree triage round; baselines re-taken
deliberately.

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
