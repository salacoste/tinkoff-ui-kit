---
title: 'Story 10.4 — button href mode (anchor rendering)'
type: 'feature'
created: '2026-09-26'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'c9cd63d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 10.4; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (spec-7-5 entry (b): the hero-CTA gap)'
  - '{project-root}/packages/components/src/button/{button.ts,button.css.ts,button.stories.ts,button.test.ts} (the pilot component: class-level CSS, host click interception, enum clamps)'
  - '{project-root}/packages/components/src/store-badges/store-badges.ts:81-108 (the in-repo anchor mold: target=_blank + rel="noopener noreferrer")'
  - '{project-root}/packages/components/src/showcase/invest-landing.stories.ts:238-249 (the hero CTA pair — tk-button «Скачать для iOS» + tk-link href="#android")'
  - '{project-root}/tests/visual/invest-landing.spec.ts:228-258 (the 360 hero leg that pins pill geometry through the .button class)'
  - '{project-root}/CHANGELOG.md (## [Unreleased] — the story-mandated Added entry + semver note)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-10-3-promo-card-full-bleed-art.md (the mint/reflect lesson — href carries NO default, NO mint)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** tk-button always renders a native `<button>` — a CTA that navigates (the
invest reference's «Скачать для iOS» links to the App Store) forces consumers into
onClick plumbing. Ledger 7.5(b): the invest showcase's hero CTA ships a `<button>`
where the reference carries a link; epics-v3 10.4 closes the gap with the v1-API
extension the ledger reserved for its own spec (breaking-ADJACENT, additive prop).

**Approach:** One additive mode channel — `href?: string` (plus `target?: string` /
`rel?: string` companions). With `href` set to a non-empty string the shadow DOM
renders `<a class="button">` INSTEAD of `<button class="button" type="button">`;
with `href` unset/empty the render is LITERALLY today's DOM, byte-for-byte. All
existing styling applies unchanged — button.css.ts gates everything on the `.button`
class and `:host([variant/size/...])` attributes, never on the tag, so the anchor
paints the identical pill (yellow/secondary/inverse, hover/press/focus ring, spinner,
disabled opacity). The host-level click interception (constructor listener) already
covers BOTH tags: `disabled`/`loading` keep the link inert (preventDefault kills
navigation from every dispatch path). External-link safety rides the store-badges
contract, made deterministic: `rel` defaults to `noopener noreferrer` IFF
`target="_blank"` (noopener only matters when a NEW browsing context opens — target
is that signal; no URL parsing in the render path), consumer `rel` always wins
verbatim. The invest hero CTA adopts `href="#ios"` — the showcase's own recorded
placeholder mold (the adjacent tk-link carries `href="#android"` since 7.5; captures
are screenshots and carry no URLs — the real App Store URL is UNKNOWABLE from the
reference and must NOT be invented). Ledger 7.5(b) closes. CHANGELOG `## [Unreleased]`
gains the `### Added` entry with the semver note (additive minor; no-href renders
byte-identical).

**Probe disposition (the probes-first rule's empty case):** ZERO pixel probes — this
story extracts nothing from captures. The pill visuals are already shipped and the
anchor changes semantics, not pixels; the only reference question (the href VALUE) is
unanswerable from screenshots by construction, resolved by the #fragment placeholder
mold above. Recorded here so the executor does not invent a probe round.

## Boundaries & Constraints

- **API:** `@property() href?: string`, `@property() target?: string`,
  `@property() rel?: string` — all optional strings, NO reflect, NO defaults: nothing
  is minted on any host (the 10.3 lesson — reflect+default mints; here the union of
  absent attributes IS the byte-stability guarantee). `''`/null/undefined `href` =
  the button branch (null-tolerance, the checkbox `error` mold). jsdoc `@attr
  {string} href` / `@attr {string} target` / `@attr {string} rel` + a class-header
  anchor-mode paragraph. No other prop/slot/event. React surface: ZERO manual work
  (CEM regen carries typing).
- **Template branch (CSS-untouched):** button.css.ts is NOT edited — the anchor
  reuses `.button` verbatim by construction. When `href` is effective:
  `<a class="button" href=… target?=… rel?=… aria-disabled/aria-busy …>` with the
  SAME inner tree (spinner + label slots) as today; NO `type` attribute on the anchor
  (button-only), no `role` (native anchor semantics are correct), no `part` (none
  exists today). When unset: today's `<button …>` render byte-identical — pinned by
  a DOM-identity unit test (the 10.3 mold).
- **rel contract (deterministic, no URL parsing):** consumer `rel` set → verbatim.
  Else `target === '_blank'` → `rel="noopener noreferrer"` (the store-badges
  contract verbatim; noopener/noreferrer only matter for a new browsing context —
  `target` is that signal, cross-origin-with-same-tab navigation opens no new
  context). Else → no `rel` attribute rendered.
- **State parity:** `disabled` + href → `aria-disabled="true"` anchor, host
  `pointer-events: none`, synthetic clicks prevented (no navigation), stays
  focusable (the aria-disabled pattern — an href link must not lose its address:
  right-click/copy still works). `loading` + href → `aria-busy`, spinner, inert
  (no navigation); `disabled`-over-`loading` precedence unchanged. The accessible-
  name guard (empty-default-slot warn-once) and the icon slot behave identically on
  both branches.
- **Keyboard parity (recorded, native):** Tab focus + `:focus-visible` ring
  identical (class-level CSS); Enter activates (navigates) on the anchor exactly as
  it clicks the button. Space activates the BUTTON branch only — on an anchor Space
  scrolls the page (native anchor semantics; the reference's own links behave the
  same). This delta is DOCUMENTED in the Accessibility story prose, not "fixed".
- **Showcase adoption (the «compose without deviations» clause):** invest-landing
  hero — `<tk-button variant="primary" size="hero" href="#ios">Скачать для
  iOS</tk-button>` (the #android placeholder mold; label/art byte-stable otherwise).
  Ledger 7.5(b) closes. tests/visual/invest-landing.spec.ts: the 360 hero leg's
  pill-geometry asserts keep working untouched (they pierce to `.button` — tag-
  agnostic); ADD anchor pins to that leg (shadow root's interactive element is an
  A, carries href="#ios" and the .button class) — no new leg needed.
- **Story/demo placement (RU content, EN meta):** the link demo lands in
  VariantsAndSizes (a row composing href + target/_blank example pointing at
  `https://example.com` — the stories' placeholder convention, never a real brand
  URL); the Accessibility checklist gains the anchor row (focusable link, Enter
  navigates, Space is native-scroll — the documented delta); Api moves via CEM.
- **CHANGELOG (story-mandated):** `## [Unreleased]` → `### Added` — one bullet:
  `tk-button: href/target/rel anchor mode — the pill renders an anchor when href is
  set; no-href renders byte-identical (additive minor, story 10.4)`. EN, Keep-a-
  Changelog shape. No version heading is created (11.3 owns the release bump).
- **Byte-stability invariant (the round's core guarantee):** with `href` absent,
  every existing surface renders DOM identical to baseline_commit — the ONLY
  baselines that may move (both themes, ×2 stable, explicit delete + update) are:
  `visual-components-button--{variants-and-sizes,accessibility,api}` (the demo +
  checklist + CEM) and `visual-showcase-invest-landing--invest-landing` (the
  adoption) — 8 legs. Playground/States/Interaction/LongLabel/WithIcon/Theming are
  the canaries: byte-stable, ANY movement → STOP and investigate (the 6.3
  contamination class).
- **Gates:** full chain build → test → lint → typecheck; `pnpm gen` (CEM +
  wrappers) + `pnpm gen:tokens` (byte-stable — no token changes); post-commit
  gen-drift (`pnpm gen && pnpm gen:tokens && git diff --exit-code -- packages/
  tests/`); visual ×2 zero-unexplained movement with `lsof -ti:6007` clean before
  each pass; CI green = Actions verdict (`gh run`) on the pushed head.
- **Non-goals:** no `download` attribute; no router integration/link-component
  interception; no button→link auto-detection beyond `href`; no new events (native
  click serves both tags); no pixel re-derivations of the pill (already shipped);
  no changes to variant/size/loading/disabled behavior; no CHANGELOG version bump
  (11.3 owns it); no baseline re-takes outside the sanctioned set.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| no href (default) | attribute absent / '' / null / undefined | today's `<button>` render, DOM byte-identical (unit-pinned) | any diff → FIX before baselines |
| href set | `href="#ios"` | `<a class="button" href="#ios">` same inner tree/styles | `<button>` rendering → FIX |
| href + target=_blank | no consumer rel | `rel="noopener noreferrer"` minted (store-badges contract) | missing rel → FIX |
| href + rel override | `rel="next"` + target=_blank | rel verbatim (`next`) | forced noopener → never |
| href, no target | `href="#ios"` | no rel attribute (same-tab navigation) | blanket rel → never |
| href + disabled | `disabled` + href | aria-disabled anchor, pointer-events none, synthetic click prevented → NO navigation, stays focusable | navigation while disabled → FIX |
| href + loading | `loading` + href | aria-busy + spinner, inert → NO navigation | navigation while loading → FIX |
| disabled+loading href | both | disabled wins semantics; spinner may render (recorded precedence) | — |
| name guard | href set, empty default slot | warn-once fires identically (anchor branch) | silent unnamed link → FIX |
| icon slot | href + icon | icon renders left of label (both branches) | — |
| keyboard | Tab / Enter / Space | Tab+focus ring identical; Enter navigates; Space = native scroll (documented delta) | Space "fixed" to click → never |
| CEM regen | `pnpm gen` | href/target/rel in CEM + wrappers; Api docs pick up | stale CEM → gen-drift fails |
| showcase flip | invest hero CTA | anchor with href="#ios"; label/art byte-stable; ledger 7.5(b) closed | invented store URL → never |
| Round isolation | any PNG outside the sanctioned 8 | STOP + investigate | blind update → process violation |
| Gates | full chain + visual ×2 + gen-drift | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/button/button.ts` — `href`/`target`/`rel` props + the
  template branch + jsdoc. NO CSS edit, NO behavior edit to existing paths.
- `packages/components/src/button/button.stories.ts` — VariantsAndSizes link row +
  Accessibility checklist row (RU content, EN meta)
- `packages/components/src/button/button.test.ts` — anchor render, DOM identity
  (no-href byte-pin), rel contract ×3, disabled/loading inertia, name guard on the
  anchor path (12 → ~19 tests)
- `packages/components/src/showcase/invest-landing.stories.ts` — the hero adoption
  (`href="#ios"`)
- `tests/visual/invest-landing.spec.ts` — anchor pins added to the 360 hero leg
- `CHANGELOG.md` — `### Added` under `## [Unreleased]` (one bullet + semver note)
- `custom-elements.json` + `packages/react/src/generated/*` — regenerated
  (`pnpm gen`), zero hand edits
- `tests/visual/visual.spec.ts-snapshots/` — the sanctioned re-take set (8 legs =
  4 stories × 2 themes: button ×3 + invest-landing; explicit delete + update)
- `.playwright-cli/verify/button-10-4/NOTES.md` — the no-probe disposition record,
  adoption diff, re-take manifest

## Tasks & Acceptance

- [x] `href`/`target`/`rel` props + template branch + jsdoc + unit tests (12 → ~19);
      DOM-identity pin FIRST (no-href render vs baseline shape) *(12 → 20; the pin
      leads the 10.4 section; the existing 12 untouched in order — Implementation
      Notes 4)*
- [x] Stories: VariantsAndSizes link row + Accessibility row; showcase adoption
      (`href="#ios"`); invest spec anchor pins; CHANGELOG Added bullet
- [x] `pnpm gen` (CEM + wrappers) + `pnpm gen:tokens` byte-stable; DOM-identity
      proof on every existing story surface (canaries byte-stable) *(CEM +63/−1,
      React wrappers byte-stable by design; tokens no diff)*
- [x] THE baseline round: sanctioned 8 legs explicit-delete + update, both themes,
      ×2 stable, zero movement outside the set; `lsof -ti:6007` clean before each
      pass *(all 8 rm'd + re-taken; the 6 button legs moved, the 2 invest legs came
      back BYTE-IDENTICAL — the sanctioned set legitimately shrank to 6 moved PNGs;
      see Implementation Notes 7)*
- [x] Full gates (build → test → lint → typecheck → gen-drift post-commit →
      visual ×2); spec closed; conventional commit EN; CI green by `gh run`
      *(executor de304e7 + orchestrator merge round; CI verdicts in Verification)*

**Acceptance Criteria:**
- Given `<tk-button href="#ios">Label</tk-button>`, then the shadow DOM renders an
  anchor carrying the same `.button` class and inner tree, styled byte-identically
  to the button path, focusable with the same focus ring, navigating on Enter.
- Given the same component WITHOUT `href`, then the rendered DOM is byte-identical
  to the pre-story render (the button branch; no attribute minted).
- Given `href` + `target="_blank"` with no consumer `rel`, then the anchor carries
  `rel="noopener noreferrer"`; given a consumer `rel`, it is used verbatim.
- Given the invest landing after adoption, then the hero CTA is an anchor with
  `href="#ios"`, its pixels are unchanged from the re-take, and ledger 7.5(b) is
  closed.
- Given the merged tree, then every gate exits 0, gen-drift is clean, the CHANGELOG
  carries the Added bullet, and the only moved PNGs are inside the sanctioned set.

## Implementation Notes

Executor judgment calls (worktree commit de304e7; lens-audited — all seven upheld,
all five mandated adjudications verified with independent evidence):
1. **Inner tree DUPLICATED between the two template branches** (anchor
   `button.ts:206-210` vs button `button.ts:221-225`), with the rationale as a code
   comment (button.ts:192-195): sharing the inner tree through a child expression
   would inject Lit `<!---->` part markers into the BUTTON branch, breaking
   byte-identity — probe-verified (today's DOM carries no interior markers). The
   lens diffed the two literals modulo indentation: byte-equal spinner/label/slots/
   slotchange binding; only tag + href/target/rel vs type differ.
2. **`rel=''` reads as unset** (the `_blank` default still mints noopener
   noreferrer) and **`target=''` renders no attribute** — the href null-tolerance
   clause extended to the companions; no path renders an empty attribute.
3. **The DOM-identity byte-pin is a true capture, not self-consistency:** the
   `BUTTON_BRANCH_DOM` literal was compared by the lens against the BASE-commit
   component's live render (a /tmp clone at 92dcb34) — equal; and mutation-proven
   (injecting `data-probe` OR a `${''}` child expression into the button branch
   fails the pin — the latter simultaneously re-proving call 1's marker rationale).
4. **The pin is the FIRST test of the 10.4 section; the existing 12 tests untouched
   in order** — «pin FIRST» in its executable form. Cross-variant equality
   (absent/''/null/undefined + a live-then-cleared round-trip) asserted in-test;
   host no-mint pinned (`getAttributeNames()` = exactly `[size, variant]`).
5. **12 → 20 tests** (spec said ~19 — the `~` tolerance; each matrix row that is
   testable got a dedicated test; the four no-href inputs folded into the pin).
6. **Accessibility intro qualifier:** one sentence beyond the mandated checklist row
   — the note's «рендерит нативный `<button>`» needed the href qualifier to stay
   truthful. Rides the «documented in the Accessibility story prose» clause.
7. **The round's strongest outcome — 6 moved PNGs, not 8:** both
   `showcase-invest-landing` legs were rm'd + re-taken and came back **byte-
   identical** (equal git blob hashes at base and commit; the PNGs' mtimes prove
   the re-take rewrote them, not staleness). Structural reason the pixels cannot
   change: the anchor lives in the shadow root (document styles cannot cross) and
   button.css.ts already neutralizes anchor UA defaults on `.button`
   (`text-decoration: none`, font family/size/weight, per-variant `color`,
   `cursor: pointer`) — ZERO CSS edits, the spec's «semantics, not pixels»
   prediction held in the strongest form.
8. Unit totals after the story: **942** (root 147 + tokens 17 + components 708 +
   react 70) = 934 + 8; zero deleted/skipped (lens re-ran the full suite).

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **Zero deviations** — the first story of the v1.2.0 cycle with an empty
   deviation ledger. The sanctioned set shrank 8 → 6 MOVED legs by byte-identity
   (Implementation Notes 7) — not a deviation: the spec's «the ONLY baselines that
   MAY move» invariant is satisfied in its strongest form by legs that re-take
   byte-identical.
2. Merge round + CI verdicts: see Verification.

## Review Triage Log

Quick review (qr-lens-10-4, 2026-09-26): **SHIP — 0 MAJOR / 0 MINOR / 3 NOTE.
No fix round.** All five mandated adjudications returned VERIFIED with independent
evidence:
1. [ADJ-1] duplicated inner tree — byte-equal modulo indentation; marker rationale
   empirically re-proven (mutation B).
2. [ADJ-2] the byte-pin — base-verified (literal = BASE-commit live render),
   mutation-proven (two failure injections), cross-variant + no-mint asserted.
3. [ADJ-3] rel/target resolver — ordering verified (consumer rel → _blank default
   → none); no empty attributes on any path; three rel tests cover the contract.
4. [ADJ-4] the invest byte-identical claim — TRUE and the rm+re-take genuinely
   happened (blob-hash equality + mtime forensics); `git diff base..commit` touches
   exactly 6 PNGs.
5. [ADJ-5] scope sweep — CHANGELOG verbatim per mandate; canaries untouched; CEM
   +63/−1 with byte-stable wrappers (lens gen re-run: zero drift); anchor pins
   pierce the shadow root and genuinely pin the adoption; CSS zero-diff;
   `_bmad-output/` zero edits; no npm; single scoped commit.
- [NOTE-1] ledger 7.5(b) closure is the orchestrator's post-merge docs step (this
  round) — noted, done below.
- [NOTE-2] visual ×2 + CI belong to the orchestrator's merge gates — run in the
  merge round (Verification).
- [NOTE-3] the lens's own forensics ran in a /tmp clone (removed); worktree
  porcelain clean before and after.

## Verification

- Executor round (worktree, de304e7): API-first with the DOM-identity pin leading →
  stories/adoption/CHANGELOG → gen (CEM +63/−1, wrappers byte-stable) → build → test
  (942: components 708 + root 147 + tokens 17 + react 70) → lint → typecheck — all
  exit 0. Baseline round: all 8 sanctioned legs rm'd + re-taken; 6 button legs moved,
  the 2 invest legs BYTE-IDENTICAL (blob-hash-equal — Implementation Notes 7); visual
  ×2 **1368/1368** (8.2m each); post-commit gen-drift clean; port verified before
  every pass.
- Lens round (qr-lens-10-4): full non-visual gate re-runs green (test 942, lint,
  typecheck, build, gen-drift — porcelain clean before and after); the byte-pin
  verified against the BASE commit's live render + two mutation injections in a /tmp
  clone; the invest byte-identity forensically confirmed (blob hashes + mtimes);
  the two template literals diffed byte-equal modulo indentation.
- Merge round (orchestrator, main tree): fast gates green (build → test **942** →
  lint → typecheck → gen → gen:tokens); GEN_DRIFT_CLEAN; worktree porcelain clean;
  visual = pass 1 **1368/1368** (8.5m) + pass 3 **1368/1368** (8.2m) — pass 2
  (1366/1368, 26.1m) failed two story-unrelated legs (modal--theming [light] visual,
  navbar--mobile-burger [dark] axe) under machine load 9.28 (three busy peer
  sessions); both re-ran GREEN targeted (8/8 in 5.8s incl. all siblings) — the
  starvation class, pass 2 documented, ×2 satisfied by passes 1+3; `lsof -ti:6007`
  clean before every pass.
- Merge: 92dcb34..de304e7 ff-only (14 files, +507/−3, exactly 6 PNGs); pushed.
  (Process note: the orchestrator's session cwd briefly drifted into the worktree
  via a foreground cd — one merge attempt no-op'd against the wrong tree and was
  caught by the anomaly check; no state was affected, the real merge ran from the
  main tree.)
- **CI VERDICT on de304e7: GREEN — run 36234613749 (10:03:16Z → 10:23:01Z, 19.8m,
  gates job success).** Story 10.4's green head = de304e7.
- Docs round: spec post-execution sections + ledger 7.5(b) closure + CLAUDE.md
  cycle bullet and totals 934→942; docs-head CI verdict recorded below.
- **CI VERDICT on the docs head: GREEN — run 36235657956, gates job success**
  (10:24Z → 10:43:59Z, 19.7m; the terminal head's own run verified via `gh run`
  after this line landed — the standing non-self-referential close).
