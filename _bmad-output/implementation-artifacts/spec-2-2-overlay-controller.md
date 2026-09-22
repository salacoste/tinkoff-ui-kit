---
title: 'Story 2.2 — Overlay controller: single owner of mounting, scroll-lock, positioning, stacking'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
baseline_commit: 'e8e4a44088c7ae725b65afaf47a31caeaf3e5552'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Modal, Tooltip, Toast, Select menus, and the Navbar drawer all float — without a single owner they will wage z-index wars, double-lock scroll, and duplicate positioning logic (AD-12's exact warning).

**Approach:** Build the shared overlay controller in `packages/components` — top-layer mounting with fallback, refcounted body scroll-lock, viewport-flip positioning, cross-instance Toast stacking, and the focus-trap/restore primitive (1.2 review finding: 3.4/4.1 consume it, none implements its own) — as a framework-agnostic module with NO visual surface of its own, unit-tested standalone. Select (2.3) is its first real consumer.

## Boundaries & Constraints

**Always:**
- Lives at `packages/components/src/overlays/` (a module, not a custom element): exported typed API for the five capabilities; consumed by later components; documented in the module header against AD-12 + the frozen §9 overlay usage contract.
- **Mounting:** top-layer (`element.popover` / `showPopover` where available, else `element.appendToTopLayer?.()` — pick the supported mechanism on this stack and note it) with a fallback path (document-positioned container with z from tokens); mount/unmount lifecycle with cleanup; multiple simultaneous overlays supported.
- **z-order:** strictly via `--tk-z-*` tokens (dropdown/popover/tooltip/modal/toast); the controller and its callers contain zero hard-coded z values (zero-hardcoded guard scans components/src — it exempts var()-containing z-index, so consume tokens).
- **Scroll-lock:** refcounted — two overlapping lock holders keep the lock; body scroll restores when the LAST releases; preserves scrollbar-gutter (no layout jump — lock via the standard `overflow: hidden` + `scrollbar-gutter: stable` compensation or padding compensation; document the choice); SSR-safe no-op when `document` is absent.
- **Positioning:** anchor-based floating positioning with viewport flip (all four edges; also shift/clamp inside the viewport horizontally) — implement minimal (no external floating-ui dependency; the kit pins no such dep) OR justify adding one in the report (default: hand-rolled, ~100 lines, tested at edges/corners); reposition on scroll/resize (passive listeners, disconnected on release).
- **Toast stacking:** cross-instance queue — bottom-right, max 3 visible, oldest collapses when a 4th arrives; each instance keeps its own auto-dismiss timing (the controller owns ORDER only); API returns handles with `dismiss()`.
- **Focus trap:** `trapFocus(container)` / `releaseFocus()` — Tab/Shift-Tab cycle within, initial focus placement, restore to the previously-focused element on release; inert-ish background treatment is NOT included (Modal decides at 4.1) — the primitive is the cycle+restore.
- **Frozen §9 conformance:** the controller is mechanics; the `open`/`open-change` declarative contract stays with the components; no consumer-facing API beyond what components need.
- Unit tests (happy-dom where DOM exists; JSDOM-gaps stubbed explicitly): refcount under simultaneous holders (incl. interleaved acquire/release), flip at each edge and corner (synthetic geometry), clamp inside viewport, toast queue overflow (4th collapses oldest, order stable after dismissals), focus cycle (Tab wraps, Shift-Tab wraps, restore on release), mount/unmount cleanup (no leaked listeners/containers), scroll-lock no-op without document.
- Docs: module header maps each capability to its AD-12 clause + future consumers; a short section in CONVENTIONS is NOT needed (§9 already frozen) — instead link the module from §9's paragraph.

**Never:**
- No custom element, no styles beyond what the fallback container needs (token-driven), no visual stories (nothing renders standalone).
- No external positioning dependency without an explicit justification in the report (default: hand-rolled).
- No changes to tokens (z-scale exists), to the frozen §9 text, or to existing components.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Simultaneous locks | Modal open, then drawer opens over it | lock count 2; body locked once; first release keeps lock; second release unlocks | — |
| Flip at each edge | anchor near each viewport edge/corner | placement flips to the side with room; never clipped off-viewport; horizontally clamped | degenerate tiny viewport → clamped best-effort, documented |
| Toast overflow | 4th toast while 3 visible | oldest collapses immediately; remaining order stable | — |
| Focus cycle | Tab/Shift-Tab inside trap | wraps within container; release restores prior focus target | container with zero focusables → trap is a no-op (documented) |
| Scroll during open | user scrolls the page | floating surface repositions (passive listener) until release | — |
| Cleanup | overlay dismissed | listeners removed, container unmounted, lock released, refcount zero | double-release is idempotent |

</frozen-after-approval>

## Code Map

- `packages/components/src/` -- components dir; the overlays module joins it (not a component directory; consumed-tokens guard's component-prefix set derives from src/* dirs — either name it `overlays` (no tk- element, hooks N/A) and adjust nothing, or note the interaction)
- `packages/tokens/src/tokens.css` -- `--tk-z-{dropdown,popover,tooltip,modal,toast}` exist
- `packages/components/CONVENTIONS.md` §9 -- the frozen overlay usage contract this implements mechanically
- `tests/import-boundaries.test.ts` -- components/src scan includes the new module automatically

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/overlays/{index.ts,controller.ts,scroll-lock.ts,positioning.ts,toast-queue.ts,focus-trap.ts}` -- the module (split or merged as natural; exports the typed API)
- [x] `packages/components/src/overlays/overlays.test.ts` -- the unit suite covering every matrix row + cleanup/leak checks
- [x] `packages/components/src/index.ts` -- export the overlays API (selective exports, not *) 
- [x] `packages/react` -- NOT touched (no wrapper: not an element); confirm gen stays clean
- [x] module header docs -- AD-12 mapping + future consumers (Select 2.3 first)

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts the behavior (all six).
- Given a grep of the module, when checking z usage, then every z value consumes `var(--tk-z-*)` and zero literals exist.
- Given `pnpm gen && git diff --exit-code`, then exit 0 (no manifest change — no new element).
- Given the full gates, then build/test/lint/typecheck pass; visual suite unchanged-stable (nothing new renders).

## Implementation Notes

- Approved autonomously (standing delegation). Mounting-mechanism choice (popover API vs appendToTopLayer vs fallback) is the implementer's call on this stack — verify what chromium/node-happy-dom actually support and pick; document the support matrix in the module header.
- happy-dom limits: popover/top-layer and layout APIs may be absent — stub the boundary explicitly in tests (assert the stubbing, so a future happy-dom upgrade tightening the stub fails loudly rather than testing nothing).

## Spec Change Log

- 2026-09-22 (review pass 1) — (a) AC parenthetical «no manifest change — no new element» was factually wrong: CEM records named index.ts re-exports (js-kind) regardless of element status — reworded to gen-idempotence (the exit-0 AC holds as written); (b) API naming deviation recorded: the Intent's illustrative `trapFocus(container)/releaseFocus()` ships as `trapFocus()` → handle with `release()` — consistent with the other four capabilities, intent (the primitive, consumed by 3.4/4.1) unchanged; (c) the Never-list's «no changes to frozen §9 text» vs the Always-list's «link the module from §9» contradiction: the link-only edit stands, logged here (no contract wording touched).
- 2026-09-22 (review pass 1) — implementation deviations, accepted: Popover API primary + container fallback (appendToTopLayer rejected — Chromium-only, no demote); padding compensation over scrollbar-gutter (Safari <18.2); top-layer z-inertness limitation documented (toast host lazy-mounts; modal-over-toasts ordering only exact on the fallback path).

## Review Triage Log

Pass 1 (4 lenses; verdicts: critical 1 / medium 8 / low 7; 16 patch items, all applied):

- critical — focus-trap blind to shadow DOM (Lit kit's own consumers would trap nothing/partially) → patch: composed traversal (light DOM + all open shadow roots incl. non-focusable hosts), deepActiveElement/composedContains, pull-back only on composed-subtree escape; shadow cycling tests.
- medium — zero-focusables early return disabled the trap permanently for lazily-rendered content → patch: listener always installs, only initial focus skipped.
- medium — toast host leak on all-self-remove + early teardown cutting exit animations → patch: MutationObserver on the host (prune disconnected; teardown only at zero connected children); stale-mount release in ensureHost.
- medium — layout thrash (per-scroll synchronous rect reads + style writes) → patch: rAF coalescing with cancel-on-release, sync-safe flag.
- medium — mutation-proven coverage gaps: listener-removal unverified; trapFocus/positionFloating SSR guards untested → patch: removeEventListener spy test + two SSR mirror rows.
- medium — silent garbage handling (conflicting-layer remount dropped; unknown layer/placement NaN'd styles) → patch: loud throws + tests.
- medium — detached anchor clamped surface to viewport corner → patch: auto-release when anchor disconnects.
- low — null-body crashes (mountOverlay/ensureHost); stranded overlays after external container removal (re-parenting); defaultPrevented Tab override; dead bodyPaddingRight; factually-wrong top-layer pointer-events comment + popover-path style override; root over-export (3 internals pulled back); cem comment rationale corrected.
- deferred (2.3 by instruction): anchor-width matching for Select menus.
- notes — intent-audit: producer-surface testing sanctioned («unit-tested standalone», integration at 2.3+); iOS momentum-scroll gap documented in the header, strategy at Modal 4.1.

## Review Triage Log

## Design Notes

Refcount pattern: a module-level counter + acquired Set of holder tokens; the lock applies document styles once at 0→1 and removes at 1→0. Flip: compute anchored rect vs viewport padding (token-less — geometry is not theming), prefer the requested side, flip when clipped, clamp-x always. Toast queue: array of handles; enqueue pushes, overflow dismisses index 0; dismissal events re-evaluate.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0
- `pnpm test:visual` -- unchanged 58/58 (no new stories)
