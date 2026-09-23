---
title: 'Story 3.4+3.5 — Navbar (burger drawer) & Footer (directory)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '6b07febb6156bed502c48c5f89316fdb00360fed'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site's two landmark surfaces — the sticky header with its burger drawer (the overlay controller's second real consumer) and the grouped link directory footer — have no kit counterparts.

**Approach:** Batch two structural components: `tk-navbar` (72px white sticky, logo slot, links with yellow active underline, utilities slots, scroll-shrinking shadow, <768px burger → focus-trapped drawer via the overlay controller + scroll-lock) and `tk-footer` (contentinfo landmark, caps-s uppercase group headers, 6–7 link columns as lists, ink pill quick-links, phone block, body-xs legal). Both are layout-heavy, stateless-or-near-it, and share the probe/gate discipline.

## Boundaries & Constraints — tk-navbar

- Behavior (EXPERIENCE Navbar row): sticky; shadow shrinks IN on scroll (transparent at top → shadow-default after threshold ~8px? — probe the capture/videoless reference: pick 10px scroll threshold, token-timed 150ms fade; note); active section = yellow underline + 700-weight ink text (redundancy rule); utilities = named slots (`utilities-left`, `utilities-right`? — reference shows search + account right; ONE `utilities` slot right + `burger-content` slot for the drawer; note); <768px: nav links collapse to a burger button opening a FOCUS-TRAPPED drawer with refcounted scroll-lock FROM THE OVERLAY CONTROLLER (mountOverlay 'dropdown' layer? drawer = overlay layer semantics — use 'dropdown'; focus-trap primitive; Esc closes; focus restored to the burger) — zero bespoke z/scroll/trap code (AD-12, 2.2).
- API: `links` prop (array { value, label, href }) + active channel `value`/`value-change`? — Navbar is NAVIGATION not form control: use `activeValue` prop (no change-event channel? — clicking a link is anchor navigation; the kit doesn't intercept routing — expose `activeValue` prop only + native anchor clicks; NO §4 channel — note the ruling) ; `sticky` default true; `burgerLabel` a11y name. Slots: `logo` (left), `utilities` (right), `burger` (drawer content override; default = the links list).
- Visual: 72px height (probe), surface-base bg, hairline border-bottom appears with shadow on scroll; logo slot left; links center/left with 4px underline on active (yellow-100, offset to sit on the border edge — probe); utilities right; burger = 44px target with a token-styled icon (inline SVG). Drawer: surface-base panel, radius top corners, shadow-popover, full-width bottom-sheet or side sheet? — probe navbar-mobile.png (reference = bottom sheet? decide by probe; note).
- Responsive: <768px burger (container query or media query — media query @media (max-width: 767px); container queries deferred — note); drawer focus-trap + scroll-lock live only while open.
- Unit tests: sticky/scroll class flip (structural — scroll listener threshold), active underline wiring, burger <768 visibility (media-query structural pin via matchMedia stub), drawer open → controller integration (mount + lock + trap asserted via module effects), Esc/close + focus restore, link clamp, no channel events.

## Boundaries & Constraints — tk-footer

- Behavior (EXPERIENCE Footer row): landmark (native `<footer>` host or role=contentinfo — the HOST element renders as footer? host is the custom element; set role=contentinfo when used as main footer? Native footer inside shadow with the host wrapping — pick: shadow `<footer>` element with contentinfo implicit; note); link columns ARE LISTS (ul/li); group headers = caps-s uppercase (text-transform at render); pill quick-links = the footer-pill-link spec (ink-300 bg, white text, radius-full — mini secondary-inverse pills); phone block bold; legal fine-print body-xs with inline links; ALL content via props+slots: `columns` prop (array { title, links: [{ label, href }] }), `quickLinks` prop, `phone` prop, legal = default slot.
- Visual: probe footer.png for paddings/column gap/caps color; token-driven (spacing 96-120 section rhythm is the CONSUMER's layout — the footer itself exposes its internal padding tokens).
- Unit tests: landmark wiring, columns render as lists, caps transform class, pill quick-links, slot legal, clamps/nulls.

## Shared

- Component gate each: impeccable/axe both themes; stories (default + active-link + mobile-burger [viewport-forced story] + theming + a11y); PROVISIONAL baselines + side-by-sides vs navbar-desktop.png, navbar-mobile.png, footer.png + pixel probes + vision.
- React: wrappers via gen; NO event-map entries EXCEPT navbar drawer open/close if dispatched (prefer NO dispatches — the drawer is internal UI state; note the ruling: internal state, not consumer channel).
- No new tokens; no theme branches; controller-only overlay mechanics (navbar); no label[for].

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Scroll past threshold | page scrolls 10px+ | shadow + hairline fade in (150ms token) | reduced-motion: instant |
| Active link | activeValue set | yellow underline + 700 text; others plain | value not in links → none marked |
| Burger <768 | viewport <768 | burger visible, links hidden | ≥768: inverse |
| Drawer open | burger click | controller-mounted drawer, scroll locked, focus trapped, Esc restores focus to burger | — |
| Footer columns | columns prop | ul/li lists with caps-s headers | empty → column omitted |
| Footer legal slot | slotted content | body-xs inline-linked fine print | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/overlays/` -- mountOverlay + lockBodyScroll + trapFocus (the drawer's mechanics)
- `.playwright-cli/captures/{navbar-desktop,navbar-mobile,footer}.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` §§ Navbar, Footer -- references (FULL path)
- `packages/components/src/tabs/` -- the pill/underline + probe discipline molds

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/navbar/{...}` + `packages/components/src/footer/{...}` -- two suites
- [x] `packages/react` -- wrappers via gen (no event entries; ruling noted) + smokes
- [x] `.playwright-cli/verify/{navbar,footer}/` side-by-sides + probes + vision
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suites run, then each row asserts (all six).
- Given the drawer opens, when inspecting, then ALL mechanics run through the controller/trap primitives — zero bespoke z/scroll/trap code in navbar.ts (structural pin).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; axe both themes zero; probes recorded.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: scroll threshold (10px), drawer form (probe), navbar channel ruling (activeValue prop only), footer landmark technique, caps transform placement.

## Spec Change Log

## Review Triage Log

Quick review (2026-09-23, 7 findings + 2 lows — all fixed in the review pass):

1. **CONVENTIONS §9 exception log missing the navbar-drawer ruling** — the
   internal-UI-state deviation (no `open`/`open-change`) shipped without the
   required entry; PR-checklist item 9 would fail. FIXED: exception-log row 3
   added (spec-ruled, navigation-not-form-control rationale).
2. **Navbar async open/close race + leak** — after `await updateComplete` the
   open path mounted the controller unconditionally: a second click (toggle
   close) or a disconnect during the window would leave a mounted drawer /
   leaked scroll-lock behind a "closed" state, and any controller throw
   became an unhandled rejection. FIXED: post-await re-validation
   (`!#drawerOpen || !isConnected || #overlayHandle` bail) + a `.catch` belt
   on the void toggle call that force-closes with a dev warn; regression
   tests pin rapid double-toggle and disconnect-during-open (no leaked lock,
   element reusable after).
3. **CEM description truncation** — the jsdoc token `@DPR3` in
   navbar.css.ts parsed as a block tag, cutting the manifest description
   mid-sentence. FIXED: reworded to «at DPR3»; manifest regenerated and the
   full description verified.
4. **Bar-link ellipsis dead code** — `text-overflow` on an inline-flex anchor
   never engages (the text lives in an anonymous box). FIXED: the label now
   wraps in `span.link__label` (min-width:0 + ellipsis — the tabs
   `.tab__label` mold); unit structural pin added.
5. **Drawer height cap wrong on mobile** — `.drawer` subtracted the desktop
   72px token at all widths. FIXED: the <768 media block overrides the cap
   with `--tk-navbar-height-mobile`; media-pin test extended.
6. **Footer malformed-entry crash** — null/shapeless entries inside
   `quickLinks` or a column's `links` crashed render (`link.href` on null).
   FIXED: per-entry `isUsableLink` clamp in willUpdate (drop + dev warn,
   the navbar/tabs precedent) with a render-side belt; null-entry and
   shapeless-entry survival tests added.
7. **Pill hover bypassed its hook** — `.pill:hover` hardwired ink-400 past a
   custom `--tk-footer-pill-fill`. FIXED: paired
   `--tk-footer-pill-fill-hover` (default ink-400) consumed on hover,
   documented in the hook list and the Theming story; test pin updated.

Lows (fixed alongside): the navbar capture script's header comment said
375×667 where the code uses 360×667; the react smoke file's `describe`
closed early (post-528 tests ran outside it) — structure only, tests
unchanged and green.

## Design Notes

Navbar drawer: the panel is a shadow-tree child (2.3 ratified pattern) mounted via mountOverlay when open; the trap uses trapFocus(panel) with restore. The scroll-shrink shadow: a scroll listener (passive) toggling a `data-scrolled` attr at the threshold; CSS transitions shadow/border via tokens. Footer: pure layout — no channel, no controller.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
