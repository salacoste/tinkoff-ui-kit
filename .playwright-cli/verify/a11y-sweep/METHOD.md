# A11y sweep — METHOD (Stories 5.1–5.3, 2026-09-23)

**Standard being swept:** SM-2 — WCAG 2.1 AA 19/19, keyboard-complete per
EXPERIENCE Interaction Primitives, unified focus ring, contrast per the
AA-override table in BOTH themes, ≥44px effective targets, reduced-motion
zero-animation. The sweep's product is EVIDENCE (ledgers + a permanent CI
guard) and IN-CHANGE FIXES — not new features.

**Provisional-baseline precedent applies to nothing here** except the visual
baselines the in-change fixes touched (navbar/tooltip stories) — those follow
the visual suite's own provisional rule (maintainer batch gate, 5.6).

## The six checks (per component × both themes unless marked)

1. **Keyboard matrix** — the EXPERIENCE Interaction Primitives cell set
   (Tab/Shift-Tab everywhere; arrows on Select, Tabs, SegmentedRadio,
   ThumbnailPicker; Space on Button, Checkbox; Esc on Modal, Tooltip, Select,
   Toast; Home/End on Tabs; Enter on native controls). Every cell maps to an
   ASSERTING test — unit (packages/components/src/<name>/<name>.test.ts),
   live-engine spec (tests/visual/<name>.spec.ts), the walkthrough driver
   (.playwright-cli/verify/form/walkthrough.mjs), or the sweep's own
   `tests/visual/a11y-sweep.spec.ts` Tab/Shift+Tab walk. A cell with no
   asserting test is a GAP → the gap is fixed with a new test, never waived.
2. **Unified focus ring** — 2px `--tk-color-focus-ring` (dark remap
   `#66A3FF`), solid, offset 2px, asserted in COMPUTED styles at every real
   keyboard stop (`:focus-visible` matched via real Tab presses): on the
   element, its `+` sibling (invisible-input pattern: checkbox box, segment
   surface, tile face), or `.field:focus-within` (input/select). Logged §9
   exceptions (tk-link underline, tk-article-card underline) verify their
   exception-log entry instead: underline PRESENT and opaque while focused.
   The modal panel's `outline: none` is the documented native-dialog dedup
   (modal.css.ts; the panel is not a tab stop).
3. **Roles/names/states by construction** — axe (wcag2a/2aa/2.1a/2.1aa tags)
   on EVERY story × BOTH themes (tests/visual/visual.spec.ts, generated from
   the built story index) PLUS the sweep's deep name-check: every visible
   interactive element in every root (document + shadow trees) resolves a
   non-empty accessible name (labelledby chain > aria-label > label > alt >
   title > content INCLUDING slotted text).
4. **Contrast per the AA-override table** — the mechanized pair table
   (tests/contrast.test.ts) extended at 5.1 to every rendered pair the walk
   found uncovered: field fills (input text / select value+placeholder /
   segment labels, light + composited dark), overlay surfaces (tooltip
   white-on-ink, toast/modal text, scrim ruled decorative), badge fills
   (ink-on-green, white-on-ink), and the full card-tint pairing grid
   (text-primary/secondary/link-on-tint × 4 tints × 2 themes, charcoal
   invariant, charcoal-CTA invariant). Ruled: the ProgressBar yellow fill
   vs track is a REDUNDANT state indicator (aria-valuenow + optional % text
   carry the information — the DESIGN.md AA table's own redundancy rule,
   anchored in contrast.test.ts rationale anchors).
5. **Targets ≥44×44 effective** — real-pixel geometry: the button-compact
   precedent (tests/visual/button.spec.ts) plus per-component legs
   (checkbox bare-box, segment/tile inputs, tab track height) and the
   sweep's deep scan (every visible kit interactive element measures ≥44×44;
   effective box = wrapping label for inputs, ::after stitch carrier for
   article-card). **Ruled exception (§9 log, kit-wide row):** anchors flowing
   INLINE in prose/dense text lists (tk-link inline/legal, footer column and
   legal links) keep text-bounded targets — the 3.1 tk-link precedent;
   WCAG 2.1 AA has no target-size SC and WCAG 2.5.8's inline exception is
   the recognized analog. Enforced boundary: `display: inline` anchors are
   the ONLY exemption in the scan.
6. **Reduced motion — zero animations** — the permanent CI guard
   `tests/visual/reduced-motion.spec.ts`: every discovered story × both
   themes under `reduce` emulation must settle with `document.getAnimations()`
   empty AND a computed-style sweep of the canvas showing no animation with a
   non-zero duration and no non-zero transition-duration. An animation whose
   duration collapses to 0s through the token layer is motionless and passes
   (the tooltip css header's documented ruling); an infinite animator without
   a reduce belt FAILS (ProgressBar sweep, spinner, skeletons all carry
   explicit belts — pinned live).

## Mechanization map

| Check | Instrument |
|---|---|
| 1 Tab/Shift-Tab + 2 rings + 3 names + 5 geometry | `tests/visual/a11y-sweep.spec.ts` (walk + scan + targeted legs, both themes) |
| 1 arrows/Space/Esc/Home/End | unit suites + live specs + walkthrough (cited per ledger cell) |
| 3 axe | `tests/visual/visual.spec.ts` (generated, every story × theme) |
| 4 contrast | `tests/contrast.test.ts` (60 pairs) |
| 5 geometry precedents | `tests/visual/{button,checkbox,segmented-radio,thumbnail-picker,tabs,homepage}.spec.ts` |
| 6 reduced motion | `tests/visual/reduced-motion.spec.ts` (214 legs) |

**Guard placement decision (spec Implementation Notes):** both new specs live
in the Playwright visual lane (`tests/visual/*.spec.ts`, config testMatch)
because they need the built-docs webServer; `pnpm test:visual` is an existing
CI gate (ci.yml), so CI runs them with zero workflow edits. They do NOT run
in the vitest `pnpm test` lane.

**CI-duration observation (review note):** the two guards add ~274 legs
(214 reduced-motion + 60 sweep) to a lane CI runs at `workers: 1` — the RM
half costs ~1.5 min locally (per-story page loads dominate; each sweep is a
single evaluate). Acceptable against the existing ~4.5 min visual suite.
REVISIT when the story index grows materially past ~107 stories or CI lane
time becomes the constraint — the natural lever is batching multiple stories
per test on one page, not raising workers (the pinned 1-worker CI rule
exists for raster contention on shared runners).

## Screen-reader spot-checks — PROTOCOL ONLY (the loud deviation)

VoiceOver/NVDA spot-checks named by the story ACs are RECORDED as protocols
in each component's «Доступность» story (scripted traversal steps + expected
announcements, RU) and DEFERRED to the maintainer: the harness must not
hijack the user's screen reader and NVDA is Windows-only — the
provisional-baseline precedent, surfaced here and in deferred-work.md
(single entry). The axe-tree half of SR behavior (roles/names/states as AT
consumes them) IS mechanized (visual suite + sweep name-check); what stays
manual is real narration quality, live-region delivery, and error-read
behavior.

## Ledger format

`group-I.md` / `group-II.md` / `group-III.md` — one table per component:
six check cells, each carrying a real evidence pointer (test id + file:line,
or the sweep spec leg name). «N/A by construction» cells cite the test that
PROVES the construction (e.g. badge's plain-span test). Vacuous «ok» cells
are forbidden; every cited test was opened and its assertion body confirmed
during the sweep (the vacuous-citation class shipped three times before).

**Extensions after 5.1–5.3 (same method, later stories):**
`group-IV.md` (6.5 — the v2 catalog cluster + composed page; unit/live
matrices, engine deferred to 8.1) and `group-V.md` (8.1 — the nine v2
surfaces ON the sweep engine: the Group V registry, the registry-declared
`ringAncestor` carrier topology, and the cookie-banner targeted leg; the
kit-wide `:host([hidden])` pattern test `tests/hidden-guard.test.ts` rides
the same lane).

## Findings disposition (this sweep)

| # | Finding | Disposition |
|---|---|---|
| F1 | tk-toast action button never painted the unified ring — `::slotted(button):focus-visible` is an INVALID selector (CSS Scoping: nothing may compound after `::slotted()`), silently dropped at parse; the UA default ring rendered instead. Probed via CSSOM (1 of 2 rules parsed). | FIXED: `packages/components/src/toast/toast.css.ts` → `::slotted(button:focus-visible)`; pinned live by the a11y-sweep walk (both themes). |
| F2 | navbar story utilities: the icon-only search anchor measured 20×44px — under the kit's 44×44 floor (story-composed slot content). | FIXED: `navbar.stories.ts` `.tkn-utility` gains `min-width: 44px` + centering (the mobile chips' own recipe). Pinned by the sweep scan. |
| F3 | tooltip Open-story demo trigger was a plain `<button>` rendering the UA ring — misrepresenting the canonical composition. | FIXED: the story trigger is a composed `<tk-button secondary compact>` carrying the unified ring; sweep walk pins it. tooltip.spec.ts trigger query updated; baselines re-approved (provisional rule). |
| R1 | Text-bounded link targets (footer columns/legal, tk-link inline) vs the 44px floor. | RULED: CONVENTIONS.md §9 exception log, kit-wide row (see check 5). |
| R2 | ProgressBar fill/track 1.343:1 and the modal scrim. | RULED: redundant/decorative (check 4); anchored in contrast.test.ts rationale anchors + aria-valuenow wiring. |
| R3 | tk-link / tk-article-card focus = underline, not the ring. | Pre-existing §9 entries (3.1 / 3.9) — now verified LIVE by the sweep walk (opaque underline while `:focus-visible`). |
