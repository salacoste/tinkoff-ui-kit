---
title: 'Stories 4.1–4.3 — Overlay trio: Modal, Tooltip, Toast (Epic 4 complete)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '49799a9e54023a38392789babccd356b6f59a9bf'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The last three v1 components — Modal, Tooltip, Toast — are missing; they are the derived (#17–19) overlay trio whose every mechanic must flow through the story-2.2 controller under the frozen §9 contract, and the deferred UJ-3 Toast leg (2.8) is still open.

**Approach:** Batch all three — `tk-modal` (4.1), `tk-tooltip` (4.2), `tk-toast` (4.3). One spec, one implementation agent, one review pass — three suites sharing the controller-consumption discipline, the declarative `open`/`open-change` channel (except where §9 rules otherwise), and the derived-component gate (pattern-consistency baselines, no tbank.ru side-by-sides). Epic 4 closes here; 19/19 shipped.

## Boundaries & Constraints — shared

- **Derived-component gate:** pattern-consistency check = floating-card/info-pill anatomy per DESIGN.md's Components table, shadow/radius tokens verbatim, impeccable zero blockers, axe both themes — baseline is the FIRST APPROVED kit render (AD-8 derived rule; provisional during the autonomous run). No reference captures exist or are required.
- **§9 conformance is binding:** declarative-first (`open` attribute/property + `open-change` `detail: { value: boolean }`, composed, bubbles; content in slots); imperative helpers ONLY Toast, built on the same element (no parallel API); ALL mechanics from `packages/components/src/overlays/` — zero bespoke mount/scroll-lock/positioning/stacking/trap code in any of the three (structural pins in tests); z only via `--tk-z-*`.
- **Open-state visual coverage:** body-locator story baselines CANNOT see top-layer content — each suite gets a per-component spec (`tests/visual/<name>.spec.ts`, the select.spec.ts page-level clip mold) capturing open/stack states.
- Motion ONLY from `--tk-motion-*` tokens (AD-9: overlay open/close → productive entrance/exit curves); reduced-motion collapses at the token layer — never reintroduce fixed durations; opacity-only reduced paths.
- The Lit first-update change-map pitfall (2.3): no mount-time `open-change(false)` — the select mold's guard; async open paths RE-VALIDATE state post-await (3.4 navbar lesson: rapid double-toggle + disconnect-during-open must not leak mounts/locks — regression tests required).
- React: wrappers via `pnpm gen`; event-map entries `tk-modal`/`tk-tooltip` → `onOpenChange`; `tk-toast` ships NO kit events (native click on the slotted action serves the action — documented ruling, the button/cards precedent).
- No new tokens; no theme branches; no `@WORD` in css.ts jsdoc (CEM truncation, 3.4 lesson); no label[for].

## tk-modal (4.1)

- **API:** `open` boolean channel mirroring tk-select exactly (§4-style controlled strict / uncontrolled seeded from `default-open`... follow the select mold's exact shapes — do not invent a new open-channel grammar), `open-change` post-mount flip-only; `heading` string prop → renders the panel's heading element and names the dialog (aria-labelledby, id resolved INSIDE the same shadow tree — the 2.3 idref rule); default slot = body content; named `actions` slot = buttons row. Destructive confirm is a STORY/docs pattern (explicit button in `actions`; a dismiss NEVER fires the action) — no `destructive` prop.
- **Mechanics (all controller):** mount the surface (backdrop scrim + panel as ONE mounted unit) via `mountOverlay(_, 'modal')`; `lockBodyScroll()` while open; `trapFocus(panel)` with restore-to-trigger + lazy arming; initial focus = first focusable in the panel, else the panel itself (tabindex=-1). Esc + backdrop-click dismiss (click on the scrim itself, never bubbled panel clicks). One nesting level: a second modal over a first traps within its own panel (trapFocus LIFO) — tested live.
- **Visual (DESIGN):** panel surface-base, radius-lg (16), `--tk-shadow-modal`, max-width 480 with a viewport clamp, padding 32; dark theme = the tonal step the token layer already maps the chosen surface semantic to (verify against the dark block in tokens.css; record the token choice in NOTES — DESIGN says «tonal step 3»). Scrim = ink alpha token.
- **Motion:** entrance productive-entrance 300ms (moderate): scrim fade + panel opacity+translateY; exit productive-exit 150ms (fast) then release the mount; reduced-motion → token-collapsed 0ms/opacity-only. Exit must complete before unmount/release (await animation end with a bounded timeout, re-validating state after — 3.4 lesson).
- **iOS momentum-scroll (deferred item lands here):** the mitigation is `overscroll-behavior: contain` on the scrollable panel region; real-device verification stays maintainer-side — record a deferred-work.md entry saying exactly that.

## tk-tooltip (4.2)

- **API:** the same `open` channel (select mold); `placement` union `'top'|'bottom'|'left'|'right'` default `'top'` (invalid clamps); `content` string prop = the tooltip text (prop-only by design — keeps content non-focusable BY CONSTRUCTION); default slot = the TRIGGER (single element; the component wires aria-describedby from the slotted trigger to its tooltip surface id).
- **Behavior:** open on pointerenter AND focusin after a 300ms delay (constant documented from EXPERIENCE — a delay, not a motion value; not a token); close on pointerleave / focusout / Esc (immediate, cancel any pending timer); click/tap toggles (touch parity — hover never the only path). Surface = role="tooltip", never focusable, never in the tab order.
- **Positioning:** `positionFloating(trigger, surface, { placement, flip })` — all-four-edge flip near viewport edges is the controller's; unit-test via computed-position stubs at each edge.
- **Announce:** APG aria-describedby pattern (polite by nature of describedby on focus) — the chosen pattern recorded in story docs (the epic AC names this). Icon-only trigger: dev-warn when the slotted trigger exposes no accessible name heuristic (no text, no aria-label/labelledby) — warn, never block; story demonstrates the correct icon-trigger recipe.
- **Visual (DESIGN):** ink-300 bg, white text text-xs, radius-sm (8), `--tk-shadow-tooltip`, padding 8/12 token-picked; fade 150ms (fast) token-timed; dark theme keeps ink surface (theme-invariant — verify against the dark block, note the ruling if any semantic needs an override... there must be ZERO component branches: if ink-300's dark remap differs, consume the token as-is and record what happens).

## tk-toast (4.3)

- **Element API:** `variant: 'default' | 'destructive'` (default `default`, clamps), `duration: number = 5000` (ms; `0` = sticky) — auto-dismiss pauses on pointerenter/focusin, resumes on leave/blur; default slot = message; named `action` slot = one interactive element (styled via ::slotted); icon = internal per-variant token-drawn SVG, aria-hidden. Announcements: default → aria-live="polite"; destructive → role="alert" (implies assertive). NEVER takes focus (no tabindex, no focus() calls — structural pin).
- **Stacking (controller-owned):** the element SELF-ENQUEUES on connectedCallback — `enqueueToast({ element: this, onCollapse: exit-then-remove })` — so both usage patterns are the same element: declarative (consumer creates/appends a tk-toast anywhere; it relocates into the shared bottom-right host) and imperative (`showToast(options)` sugar in `src/toast/` that builds the element, sets props, slots the optional action as a light-DOM button, and returns `{ dismiss() }`). This is the §9 «built on the SAME elements and events» rule made literal — record the self-enqueue ruling in NOTES.
- **Esc:** document-level keydown while any tk-toast is connected dismisses the NEWEST one (module-level registry picks the newest; never steals focus). Auto-dismiss/collapse exit animation then element removal (the queue's MutationObserver prunes — 2.2 contract).
- **Visual (DESIGN):** surface-base card, radius-lg (16), `--tk-shadow-default`, padding 16/20 token-picked, icon + message + action row; entrance slide-up+fade productive-entrance 150ms (fast), exit 150ms; dark theme via the token layer.
- **UJ-3 leg closes:** the 2.8 composed-form showcase gains the submit-success Toast (polite, no focus steal), and the committed walkthrough driver `.playwright-cli/verify/form/walkthrough.mjs` gains the Toast leg (appears politely, focus NOT stolen, 5s default pausable on hover) — walkthrough note completed.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Modal open (uncontrolled) | `open` attr set | mounted via controller, scroll locked, focus trapped in panel, open-change(true) post-mount | double-toggle race → single mount (re-validate post-await) |
| Modal close | Esc / scrim click / `open=false` | exit anim → release mount + lock, focus restored to trigger, open-change(false) | disconnect during exit → no leaked mount/lock |
| Modal destructive | story pattern | action ONLY from the explicit button; dismiss never fires it | — |
| Modal nesting | second modal over first | inner traps within its panel (LIFO); both scroll-locks held; inner close restores into outer | deeper nesting unsupported (documented, one level) |
| Modal a11y | open | role=dialog + aria-modal on the panel, name via labelledby (same-tree id) | heading missing → name from… pick (content fallback) + note |
| Tooltip show | hover or focus 300ms | open-change(true), positioned via controller, describedby wired | leave/blur before 300ms cancels |
| Tooltip dismiss | Esc / pointerleave / blur | closes immediately; pending timer cancelled | — |
| Tooltip touch | tap trigger | toggles open/closed | — |
| Tooltip edge | anchor at viewport edge | controller flips placement | — |
| Tooltip focusables | focusable in content | impossible by construction (prop-only content); surface itself not focusable | — |
| Toast auto-dismiss | default 5s | exit anim, element removed, queue pruned | duration 0 → sticky until Esc/dismiss |
| Toast pause | hover/focus on toast | timer pauses; resumes on leave/blur | — |
| Toast stack | 4th toast arrives | oldest collapses (controller), max 3 visible | — |
| Toast variant | destructive | role=alert, error icon | — |
| Toast Esc | any toast visible | newest dismissed; focus never moves | — |
| Toast action | click slotted action | consumer handler (native click); toast stays until duration/dismiss (pick + note) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/overlays/` -- mountOverlay / lockBodyScroll / positionFloating / enqueueToast / trapFocus (ALL mechanics; the module header carries the capability→clause map)
- `packages/components/src/select/` -- the ratified declarative-overlay mold (open channel, post-mount flip-only guard, panel-in-shadow pattern, select.spec.ts capture mold)
- `packages/components/src/navbar/navbar.ts` -- the mount+lock+trap+restore async mold (post-await re-validation, catch belt, disconnect-during-open regression)
- `packages/components/src/showcase/application-form.stories.ts` + `.playwright-cli/verify/form/walkthrough.mjs` -- the UJ-3 Toast leg lands here
- `packages/tokens/src/tokens.css` -- verify consumed semantics' dark mappings (surface tonal step for the modal panel; ink-300 for tooltip)
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/{DESIGN.md,EXPERIENCE.md}` -- Components table rows + overlay rows (normative)

## Tasks & Acceptance

- [x] `packages/components/src/{modal,tooltip,toast}/{index.ts,<n>.ts,<n>.css.ts,<n>.test.ts,<n>.stories.ts}` -- three suites (+ `src/toast/show.ts` imperative helper)
- [x] `packages/react` -- wrappers via gen + event-map entries (modal/tooltip onOpenChange; toast none + ruling) + smokes
- [x] `tests/visual/{modal,tooltip,toast}.spec.ts` -- open/stack state captures (page-level clip mold)
- [x] `.playwright-cli/verify/{modal,tooltip,toast}/` -- NOTES.md + captures + pattern-consistency records (anatomy vs DESIGN Components table)
- [x] UJ-3 leg: form-story submit toast + walkthrough driver leg + note completed (walkthrough 31/31)
- [x] deferred-work.md entry (iOS real-device scroll-lock verification) + baselines via update flow + stability ×2 (472 ×2 + orchestrator compare run)

**Acceptance Criteria:**
- Given the matrix rows, when each unit suite runs, then each row asserts (all sixteen).
- Given any of the three, when inspecting, then ALL overlay mechanics run through the controller — zero bespoke mount/lock/position/stack/trap code (structural pins in each suite).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2 (incl. open-state specs); axe both themes zero; impeccable zero blockers.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls — all recorded in the per-component verify NOTES:
  - Modal: open channel = select mold verbatim (reflected `open`, flip-only post-mount/post-release dispatch, no default-open pair); scrim = ink-400 52% color-mix (no ink-alpha token exists, no-new-tokens; echoes shadow-modal alpha); dark panel = surface-base + border-default hairline (tonal-step-3 semantic doesn't exist — no-new-tokens ruling); initial focus = first focusable (shadow-aware) else panel tabindex=-1 with trap on the HOST so slotted focusables cycle and the panel paints no ring; entrance 300 / exit 150 with a 350ms bound + matchMedia skip; no `inert` at v1; Esc answered only by the NEWEST modal (and a connected toast outranks it, z 600>500); heading missing → aria-label «Диалог».
  - Toast: SELF-ENQUEUE on connect is the §9 «same elements» ruling made literal (declarative append-anywhere and `showToast` both ride it); enqueue-last connect ordering fixed a double-timer bug caught by tests; action click leaves the toast up; no kit events; React relocation caveat propagated via CEM jsdoc; icon colors green-200 (green-100 fails 3:1 non-text) + error semantic.
  - Tooltip: content prop-only (non-focusable BY CONSTRUCTION); ink-300 theme-invariant (verified no dark remap, 12.6:1 both themes); Esc closes with focus-within (APG ruling, recorded in checklist + NOTES).
- Implementation-time finds (vision + tests): popover UA `inset:auto; margin:0` reset needed on BOTH the modal scrim and the toast stack host (UA fit-content/margin re-centered them — toast-queue.ts:139-148 edit, arrangement mechanics per its own mandate); actions-slot chain `name`-without-`slot` fixed; initial focus raced sibling upgrades.
- Impl agents cannot edit `_bmad-output/` — the orchestrator records Implementation Notes/Triage here (the one sanctioned append was deferred-work.md).

## Spec Change Log

(none — frozen block untouched through implementation and review)

## Review Triage Log

Quick review (2026-09-23): 0 blockers / 3 MAJOR / 3 MINOR / 4 NOTE → verdict FIX-THEN-SHIP; all code items patched and re-verified in the same change:

1. **[MAJOR] Toast action 44px floor** — `::slotted(button)` had `padding:0` (~24px target). PATCHED: min-height 44 + padding-inline 8, link visuals kept, no exception entry. Baselines re-taken.
2. **[MAJOR] Vacuous mount-time open-change guard (modal+tooltip)** — listener attached after mount made the «silent at first paint» assertion tautological (the guard could be deleted green — the vacuous-test class that shipped twice before). PATCHED: pre-connect listener tests, closed + open-attr shapes; **mutation-verified** (removing the `wasOpen` guard fails loudly, restored passes).
3. **[MAJOR] Toast story integrity** — Variants rendered 4 static toasts that self-collapsed under max-3; Theming's scoped-surface demos were false (every toast relocates bottom-right); copy promised a nonexistent «крестик». PATCHED: 3 static + dedicated honest Overflow story + showToast-driven Theming + copy fixed.
4. **[MINOR] Tooltip flip in-suite coverage overclaim** — only top/bottom asserted while the header said all-four. PATCHED: left/right `style.left` cases added.
5. **[MINOR] React `<Toast>` relocation footgun undocumented at point of use** — PATCHED: CEM jsdoc caveat (unmount-while-relocated throws removeChild; re-home or use showToast), propagates to generated wrapper docs.
6. **[MINOR] Tooltip Esc scope unrecorded** — RECORDED (no code): focus-within ruling in checklist + NOTES.
7. **[NOTE→fix] Esc dead-press mid-exit** — PATCHED: `data-exiting` filtered in the toast handler; modal's deferral guard mirrors it.
8. **[NOTE→fix] 0.5px magic number** — PATCHED: optical-alignment comment.
9. **[NOTE→fix] showToast SSR edge** — PATCHED: no-body guard mirroring enqueueToast.
10. **[NOTE, ledger-only] Fallback-path modal projection** — popover-less engines lose slotted projection (2.3 ratified mold limitation; verify NOTES ruling 9).

Post-patch verification: 604 unit (473 components) + 472 visual ×2 stability + orchestrator compare run + walkthrough 31/31; build/lint/typecheck/gen-drift green.

## Design Notes

All three are derived components: the pattern-consistency bar (anatomy + token discipline + audit/a11y-clean) replaces fidelity side-by-sides. The section headers above carry the per-component anatomy from DESIGN.md's Components table verbatim — treat that table + EXPERIENCE rows as the review rubric's source of truth.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
