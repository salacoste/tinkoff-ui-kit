# Epic 4 Context: Overlays (dialogs, tooltips, toasts)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Deliver the derived overlay trio — Modal, Tooltip, Toast — behaving per the overlay contract (focus trap/restore, dismiss patterns, aria announcements, stacking), with every mechanic owned by the single story-2.2 overlay controller (AD-12). These are the last three of the 19-component v1 set; being **derived (#17–19)**, they get **pattern-consistency checks** (floating-card/info-pill anatomy, token discipline, audit-clean, a11y-clean) with first-approved-render baselines — NOT reference-capture side-by-sides (no tbank.ru captures exist or are required for them). Epic 4 also closes the deferred UJ-3 Toast leg (a form-submit Toast in the 2.8 composed-form walkthrough).

## Stories

- Story 4.1: Modal — focus trap + restore, Esc + overlay-click dismiss, refcounted scroll lock, productive entrance/exit
- Story 4.2: Tooltip — hover+focus show with 300ms delay, viewport flip, no focusable content, touch parity
- Story 4.3: Toast — 5s auto-dismiss (configurable), pause on hover/focus, polite/alert, bottom-right stack max 3, frozen imperative+declarative API, UJ-3 leg closes

## Requirements & Constraints

- Every component story passes the component gate: impeccable audit with zero blockers; axe on its story in BOTH themes; Storybook story covering default + all variants + interactive states + theming demo + a11y notes incl. the keyboard-only checklist; controlled + uncontrolled where stateful (per `CONVENTIONS.md`); CEM-generated React wrapper; approved visual baseline (derived rule: first approved kit render — provisional during the autonomous run); reduced-motion paths for all motion. No stories → no merge.
- **CONVENTIONS §9 frozen overlay usage API binds all three:**
  - Declarative-first: an overlay surface is a normal element whose open state is the `open` attribute/property + `open-change` event (`detail: { value: boolean }`, composed, bubbles); content lives in SLOTS.
  - Imperative helpers ONLY for inherently imperative surfaces: Toast may ship programmatic show/dismiss helpers **built on the same elements and events, never a parallel API** — the only sanctioned imperative pattern.
  - The controller owns the mechanics: mounting (top-layer popover API with `#tk-overlay-root` fallback), refcounted scroll-lock, positioning/flip, stacking, focus-trap/restore are CONSUMED from `packages/components/src/overlays/`, never reimplemented. Z-order only via `--tk-z-*`.
- WCAG 2.1 AA per component as built: keyboard operability, visible unified focus ring (2px `--tk-color-focus-ring`, offset 2), correct roles/names/states, contrast both themes, targets ≥44×44px effective.
- Yellow discipline unchanged: yellow only for primary actions/active indicators; ink on yellow.
- EXPERIENCE rows (normative):
  - Modal: focus trap + restore on close; Esc AND overlay-click dismiss (destructive actions require an explicit button — the action never fires from a dismiss); body scroll locked; productive-entrance open, productive-exit close; one level deep.
  - Tooltip: hover + focus show (300ms delay), Esc/hide-on-blur dismiss; NEVER contains focusable content; positioning flips near viewport edges; icon trigger gets an accessible name.
  - Toast: auto-dismiss 5s default (configurable), pause on hover/focus; aria-live="polite", destructive variant role="alert"; bottom-right stack, max 3 visible (oldest collapses); imperative + declarative usage patterns.
- Interaction Primitives: Esc (Modal, Tooltip, Select, Toast); Modal traps and restores; **Toast never takes focus**; touch parity — hover is never the only path.
- Motion only from `--tk-motion-*` tokens (AD-9: overlay open/close → productive entrance/exit curves); the token layer already collapses durations to 0ms under `prefers-reduced-motion` — components must not reintroduce fixed durations; opacity-only fallbacks under reduced motion.
- SSR-compat: no imperative DOM access at construction time; render via Lit templates only.

## Technical Decisions

- Lit custom elements, one directory per component (`packages/components/src/{modal,tooltip,toast}/`), `tk-` prefix, shadow DOM; React wrappers generated from CEM (`pnpm gen` clean); kit events registered in the owned event-map with documented rulings for event-less components.
- **Overlay panels are SHADOW-TREE children with own shadow roots** (2.3 ratified pattern): the popover path promotes the panel in place; the fallback container reparents across the boundary. Axe idrefs (aria-labelledby etc.) resolve inside the same shadow tree — light-DOM panels fail aria-valid-attr-value.
- Controller surface (story 2.2, `src/overlays/index.ts`): `mountOverlay(element, layer)` — throws on unknown layer / silent layer switch, remount returns live handle; `lockBodyScroll()` refcounted with scrollbar-gutter compensation; `positionFloating` / `computeFloatingPosition` — all-four-edge flip, viewport clamp, rAF-coalesced scroll/resize, `matchAnchorWidth` boolean|'min'; `enqueueToast({ element, onCollapse? })` — module-level stack, bottom-right host `#tk-toast-stack`, `TK_TOAST_MAX_VISIBLE = 3` (oldest collapses; host lifecycle via MutationObserver; the queue never starts/stops timers); `trapFocus` — SHADOW-AWARE composed Tab/Shift-Tab cycle, LIFO nesting, lazy arming, restore.
- Z-scale (scaffold mechanics, not DESIGN extraction): nav 100 / dropdown 200 / popover 300 / tooltip 400 / modal 500 / toast 600. Toast host mounts lazily at the FIRST toast so it paints above modals mounted before it.
- Accepted controller limitations to respect (documented, deliberate): iOS momentum-scroll not stopped by the lock (touch strategy deferred to 4.1 — Modal records the real-device check outcome); focusable visibility is selector-level.
- Lit first-update change-map pitfall (2.3 lesson): mount-time `open-change(false)` must be guarded (`wasOpen !== undefined`); `open-change` dispatches POST-mount flip-only.
- Async open/close races (3.4 navbar lesson): after any `await updateComplete`, RE-VALIDATE the open state and connectivity before mounting; belt `.catch` on void async calls; disconnect during open must not leak a mounted surface or a scroll-lock.
- Baseline regeneration: the update flow SKIPS rewrites below the 1.5% threshold — delete PNGs to force regeneration when a wrong render got baselined.
- `@WORD` in css.ts jsdoc truncates the CEM manifest description (3.4 lesson) — never use it.

## Cross-Story Dependencies

- Everything builds on the 2.2 controller (already shipped + unit-tested) and the frozen §9 contract from 2.1; tk-select (2.3) is the ratified declarative-overlay mold; tk-navbar's drawer (3.4) is the mount+lock+trap+restore mold; the 2.8 composed-form story (`showcase/application-form`) + its committed walkthrough driver (`.playwright-cli/verify/form/walkthrough.mjs`) take the deferred Toast leg at 4.3.
- Visual harness: open-state captures need the per-component spec pattern (page-level clip via element API open — body-locator story baselines CANNOT see top-layer content; select.spec.ts is the mold).
- Epic 5 later re-verifies this group (a11y sweep I incl. VoiceOver+NVDA spot-checks, dark sweep, pattern-consistency ledger closure at 5.6).
