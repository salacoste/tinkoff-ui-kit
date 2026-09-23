# Story 4.3 — tk-toast provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. **DERIVED component (AD-8 derived rule): NO tbank.ru
side-by-sides exist or are required — the bar is the FIRST APPROVED KIT
RENDER + pattern consistency.**

## Files

| File | What |
|---|---|
| `toast-capture.mjs` | committed capture recipe (below) |
| `kit-toast-stack-light.png` / `-dark.png` | the approved stack renders (Stack story: three sticky toasts, page-level clip over the stacking host) |
| `light-dark-pair.png` | the two themes stacked (the vision-check artifact) |

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6016 &
node .playwright-cli/verify/toast/toast-capture.mjs
```

Pinned env identical to the visual suite. Sticky (`duration="0"`) toasts
only — an auto-dismissing toast could vanish mid-capture (the stories follow
the same rule; interactive demos fire real 5s toasts on click only).

## Pattern-consistency record — anatomy vs DESIGN.md Components table

DESIGN.md row: **«Toast — White card `{rounded.lg}`, `default` shadow, icon +
message + optional action»** + the spec 4.3 rows (padding 16/20, entrance
slide-up+fade 150ms, exit 150ms).

| Aspect | DESIGN / spec | Kit (shipped) | Verdict |
|---|---|---|---|
| Fill | white card | `--tk-color-surface-base` via `--tk-toast-fill` | exact |
| Radius | rounded.lg (16) | `--tk-radius-lg` via `--tk-toast-radius` | exact |
| Shadow | `default` | `--tk-shadow-default` (none in dark — the token layer) | exact |
| Padding | 16/20 | `--tk-space-16` / `--tk-space-20` | exact |
| Motion | 150ms entrance/exit | `--tk-motion-duration-fast` productive-entrance/exit, reduced-motion belt | exact |
| Anatomy | icon + message + action | internal token-drawn SVG (aria-hidden) + default slot + named `action` slot | ✓ |

## Vision check notes (zai analyze_image, 2026-09-23)

Pass on the shipped code, both themes: all three cards carry the correct
anatomy (green circle-check on the two defaults, red circle-exclamation on
the destructive; blue action «Открыть» on the second card only), rounded
cards with the subtle light-theme shadow and a proper dark surface, no
clipping/overlap anywhere. One live defect was caught and fixed BEFORE the
pass (see below).

## Vision/visual findings that earned their keep

1. **The stacking host rendered CENTERED, not bottom-right, in real
   browsers.** UA `[popover]` styles (`inset: 0; margin: auto; fit-content`)
   overrode the queue's `bottom/right: 0` hug — the queue's own unit tests
   (happy-dom, no popover API) could never see it. FIX: inline `top/left:
   auto; margin: 0` in `ensureHost()` (toast-queue.ts — the queue owns host
   arrangement mechanics). Found by the toast.spec.ts corner assertions.

## Judgment calls (spec Implementation Notes — recorded here)

1. **SELF-ENQUEUE ruling (the §9 «same elements» rule made literal):** the
   element enqueues ITSELF on connectedCallback
   (`enqueueToast({ element: this, onCollapse: dismiss })`), so declarative
   (append a tk-toast anywhere — it relocates into #tk-toast-stack) and
   imperative (`showToast()` in show.ts builds THIS element, sets props,
   slots message/action, returns `{ dismiss() }`) are the same element and
   slots. The queue's dismiss handle is deliberately NOT used — removal is
   SELF-removal after the exit animation (the queue's advertised pattern),
   so the exit paints before the MutationObserver prunes the entry.
   connect-order note: the enqueue runs LAST in connectedCallback — the
   relocation fires a nested disconnect+connect pair inside it, and with the
   enqueue last the nested teardown/setup leaves exactly one timer/listener
   set/registry entry (a double-timer bug found by the unit suite).
2. **Toast action click: the toast STAYS** until duration/dismiss — the
   action is the consumer's native click (the button/cards no-event
   precedent); auto-dismissing on action would surprise read-later flows.
   This is also the event-map ruling: tk-toast ships NO kit events.
3. **Icons:** default = circle-check in green-200 (green-100 measures 2.64:1
   on white — under the 3:1 non-text floor; green-200 passes both themes),
   destructive = circle-exclamation in `--tk-color-error` (the semantic,
   dark-mapped). Both aria-hidden; color via currentColor classes.
4. **Duration clamps:** negative → 0 (sticky); non-finite → the 5000
   default. A duration set after connect re-arms the window (wrappers
   assign properties post-construction — unit-pinned).
5. **Esc:** document-level keydown while any toast is connected dismisses
   the NEWEST LIVE toast (module-level registry; entries mid-exit are
   filtered — a press must not die with the animating element, the fix-round
   dead-press finding; the modal's guard mirrors it and defers only to
   LIVE toasts), never stealing focus; the MODAL's Esc handler defers to a
   connected live toast (z 600 > 500 — recorded in
   verify/modal/NOTES.md ruling 7). Cross-ruling (mirrored in
   verify/tooltip/NOTES.md 6a): tk-tooltip's Esc is scoped to focus WITHIN
   the component (the APG pattern) — the document-level Esc owners are the
   toast and the modal, never the tooltip.
6. **React + relocation caveat:** a JSX-owned `<tk-toast>` relocates out of
   React's container on connect; React's unmount then throws removeChild on
   a node it no longer parents. Not a bug in the element — the §9 design —
   but React consumers should prefer the imperative `showToast` for
   fire-and-forget notifications (noted in the react smoke test; the wrapper
   still exists and works while mounted).

## Harness notes

`tests/visual/toast.spec.ts` captures the stack region PAGE-LEVEL (clip over
the stacking host) with its own baseline set, plus assertions (toast layer z
token, three toasts with the right live/register attributes, pointer-events
opt-in, bottom-right corner hug).


## Fix-round patch (2026-09-23, review FIX-THEN-SHIP)

1. **Action 44px floor:** `::slotted(button)` now carries
   `min-height: 44px` + inline padding — the EFFECTIVE target is the whole
   row-high box (the navbar drawer-link pattern), link-register visuals
   kept. Fixed, not exempted (no exception-log entry). Baselines re-taken
   (the action row grows the card).
2. **Stories rework:** Variants cut to THREE static toasts (the sticky
   figure — whose «крестиком» caption lied: no close button exists — was
   removed); a dedicated OVERFLOW story demonstrates the max-3 collapse
   (four sticky toasts; the oldest collapses on the 4th connect — instantly
   under the pinned reduced-motion capture env); Theming is now
   showToast-driven with copy stating the stack is ALWAYS fixed
   bottom-right (the scoped-surface demos implied anchoring they never had).
3. **Esc dead-press mid-exit:** `onDocumentKeydown` filters `data-exiting`
   entries — Esc reaches the newest LIVE toast; the modal's toast-guard
   mirrors the filter (`tk-toast:not([data-exiting])`).
4. **`showToast` SSR guard** mirrors enqueueToast's no-body check
   (`typeof document === 'undefined' || !document.body`).
5. **React relocation caveat** added to the element's CEM jsdoc (unmount of
   a relocated toast throws removeChild in container-owning renderers —
   re-home or use showToast) so it propagates to the generated wrapper docs.
6. **`margin-block-start: 0.5px`** on the icon is commented in-sheet
   (optical alignment of the 20px glyph against the 15px/1.5 text line).
