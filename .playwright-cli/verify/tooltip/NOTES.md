# Story 4.2 — tk-tooltip provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. **DERIVED component (AD-8 derived rule): NO tbank.ru
side-by-sides exist or are required — the bar is the FIRST APPROVED KIT
RENDER + pattern consistency.**

## Files

| File | What |
|---|---|
| `tooltip-capture.mjs` | committed capture recipe (below) |
| `kit-tooltip-open-light.png` / `-dark.png` | the approved open renders (Open story, element-API open, page-level clip over trigger ∪ pill + 16px margin) |
| `light-dark-pair.png` | the two themes stacked (the vision-check artifact) |

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6015 &
node .playwright-cli/verify/tooltip/tooltip-capture.mjs
```

Pinned env identical to the visual suite. The script exercises the
ELEMENT-API open (false→true) and clips the PAGE screenshot (top-layer
pixels included).

## Pattern-consistency record — anatomy vs DESIGN.md Components table

DESIGN.md row: **«Tooltip — Ink-300 bg, white text-xs, `{rounded.sm}`,
`tooltip` shadow»** + the spec 4.2 rows (padding 8/12, fade 150ms, 300ms
delay, four-edge flip).

| Aspect | DESIGN / spec | Kit (shipped) | Verdict |
|---|---|---|---|
| Fill | ink-300 | `--tk-color-ink-300` via `--tk-tooltip-fill` | exact |
| Text | white text-xs | `--tk-color-white` + `--tk-text-body-xs-*` | exact |
| Radius | rounded.sm (8) | `--tk-radius-sm` via `--tk-tooltip-radius` | exact |
| Shadow | `tooltip` | `--tk-shadow-tooltip` (none in dark — the token layer) | exact |
| Padding | 8/12 | `--tk-space-8` / `--tk-space-12` | exact |
| Motion | fade 150ms | `--tk-motion-duration-fast` productive-standard, opacity-only | exact |
| Anatomy | — | `role="tooltip"` pill anchored to the slotted trigger (info-pill anatomy ✓) | ✓ |

## Vision check notes (zai analyze_image, 2026-09-23)

Pass on the shipped code: dark #333-ish pill with white small text in BOTH
themes (theme-invariant — ruling 1 below), positioned above the trigger with
a clean ~8px gap, compact rounded corners, no defects. One noted (expected)
behavior: the pill's LEADING EDGE aligns with the trigger's left edge rather
than centering — that is the controller's frozen `computeFloatingPosition`
geometry (2.2: `left = anchor.left`), not a component decision; with a pill
wider than the trigger the asymmetry is visible and correct per the
controller's contract.

## Judgment calls (spec Implementation Notes — recorded here)

1. **Theme-invariance ruling:** ink-300 has NO dark remap in tokens.css, so
   the pill stays #333333 in both themes BY DESIGN — consumed as-is, zero
   component branches (the spec's «verify against the dark block, note the
   ruling» demand). White-on-ink-300 measures 12.6:1 in both themes.
2. **Content is PROP-ONLY by construction:** the pill text is the `content`
   prop — nothing slot-projects into the surface, so no consumer can ever
   put a control in it; the surface itself is `role="tooltip"` with no
   tabindex, never in the tab order (structural pins in the suite).
3. **The 300ms delay is a JS constant** (`TK_TOOLTIP_DELAY_MS`), documented
   from EXPERIENCE («delay 300ms») — a delay, not a motion value; the token
   layer cannot feed JS timers. The offset is 8 (`--tk-space-8`); the
   viewport padding stays the controller's default.
4. **Trigger wiring:** aria-describedby set on the slotted trigger (first
   assigned element; more than one dev-warns), prior value snapshotted and
   restored on unwire/disconnect; the surface is created EAGERLY (the select
   aria-controls precedent — axe validates the idref while hidden). A
   declarative open races slotchange — `#resolveTrigger()` reads the live
   slot so the mount is never refused for the wiring's async nature.
5. **Icon-only trigger guard:** heuristic = text content, aria-label,
   aria-labelledby, or title; warn once per trigger, never block. The story
   demonstrates the correct recipe (aria-label + aria-hidden glyph); the
   anti-pattern is shown as a code snippet, NOT a live button — a live
   unnamed button fails the axe button-name gate the visual suite enforces
   on every story.
6. **Click/tap toggles instantly** (touch parity — hover is never the only
   path); Esc/pointerleave/focusout close immediately and cancel the pending
   timer (matrix rows, unit-pinned).
6a. **Esc SCOPE ruling (fix-round record, mirrored in verify/toast/NOTES.md):**
   Esc closes when focus is WITHIN the component (the keydown listener lives
   on the host — the APG tooltip pattern, where the trigger carries the
   handler). A hover-opened pill with focus elsewhere closes on
   pointerleave/blur instead — a document-level Esc would close tooltips the
   user is not addressing and fight the modal/toast Esc owners.

## Harness notes

`tests/visual/tooltip.spec.ts` captures the open pill PAGE-LEVEL (clip over
trigger ∪ pill) with its own baseline set, plus assertions (tooltip layer z
token, inline fixed positioning, placement top with the pill above the
trigger, describedby wired, never focusable).
