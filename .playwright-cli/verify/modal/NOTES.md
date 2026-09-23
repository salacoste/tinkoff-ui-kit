# Story 4.1 — tk-modal provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. **DERIVED component (AD-8 derived rule): NO tbank.ru
side-by-sides exist or are required — the bar is the FIRST APPROVED KIT
RENDER + pattern consistency (anatomy vs DESIGN.md Components table, token
discipline, audit/a11y-clean).**

## Files

| File | What |
|---|---|
| `modal-capture.mjs` | committed capture recipe (below) |
| `kit-modal-open-light.png` / `-dark.png` | the approved open renders (Open story, element-API open, page-level clip over the panel + 16px margin) |
| `light-dark-pair.png` | the two themes stacked (the vision-check artifact) |

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6014 &
node .playwright-cli/verify/modal/modal-capture.mjs
```

Pinned env identical to the visual suite (chromium
`--font-render-hinting=none --disable-lcd-text`, 1280×800 DSF 1,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter).
The script exercises the ELEMENT-API open (false→true), reads the panel rect
from the promoted surface and clips the PAGE screenshot (top-layer pixels
included — body-locator captures cannot see the popover surface).

## Pattern-consistency record — anatomy vs DESIGN.md Components table

DESIGN.md row: **«Modal — White panel `{rounded.lg}`, `modal` shadow; dark
theme tonal step 3»** + the spec 4.1 rows (max-width 480, padding 32, scrim
= ink alpha).

| Aspect | DESIGN / spec | Kit (shipped) | Verdict |
|---|---|---|---|
| Panel fill | «White panel» | `--tk-color-surface-base` (light #FFFFFF exact; dark #1A1A1A) | token-choice ruling 1 |
| Radius | rounded.lg (16) | `--tk-radius-lg` via `--tk-modal-radius` hook | exact |
| Shadow | `modal` | `--tk-shadow-modal` (collapses to none in dark — the token layer) | exact |
| Width | 480 + viewport clamp | `calc(var(--tk-space-48) * 10)` (spacing-derived) + `calc(100% - var(--tk-space-32))` | spacing-derived |
| Padding | 32 | `--tk-space-32` | exact |
| Scrim | «ink alpha» | `color-mix(in srgb, var(--tk-color-ink-400) 52%, transparent)` | ruling 2 |
| Motion | entrance 300 / exit 150 productive curves | `--tk-motion-duration-moderate/fast` + `--tk-motion-curve-productive-entrance/exit`, reduced-motion belt `animation: none` | exact |
| Anatomy | — | heading (h2, heading-6 tokens) + body slot + actions slot row | floating-card anatomy ✓ |

## Vision check notes (zai analyze_image, 2026-09-23) — three real defects caught

1. **Popover UA sizing shrank the scrim to the panel.** UA `[popover]` sets
   `width/height: fit-content; margin: auto` — author `inset: 0` alone does
   not restore the viewport-filling frame, so the scrim covered only the
   panel box (measured surface width 480 vs 1280). FIX: `width/height: auto`
   in the surface `:host` reset (same class of UA reset as the select panel
   / navbar drawer — now named in the sheet comment).
2. **The actions slot chain was broken — buttons rendered in the BODY slot,
   left-aligned.** The surface's light-child forwarder carried
   `name="actions"` but not `slot="actions"`: unassigned to the surface
   shadow's named slot, both forwarders fell into the default slot. FIX:
   `<slot name="actions" slot="actions">`. (Slot-forwarding chains need BOTH
   attributes — recorded for every future two-level projection.)
3. **Initial focus landed on the PANEL (UA blue ring baked into the render),
   and both story buttons were primary-yellow.** Two causes: (a) the
   initial-focus heuristic was light-DOM-only, so `tk-button` (a custom
   element whose real `<button>` lives in its shadow root) looked
   unfocusable — replaced with a shadow-aware presence check mirroring the
   trap's collection; (b) a declarative open at first paint races sibling
   custom elements' first render (tk-modal's update microtask runs before
   tk-button's) — the trap now arms one microtask later with full
   generation/connectivity re-validation. The story's «Отмена» became
   `variant="secondary"` (the capture now shows the correct primary/secondary
   pair; the visible 2px blue ring on «Отмена» is the UNIFIED ring on the
   legitimately-focused first action — intentional, per the initial-focus
   contract).

Final passes (shipped code): panel centered, scrim covering, buttons
right-aligned and differentiated, heading/body/buttons anatomy clean, no
clipping; dark render distinguishable (tonal step + the ruling-3 hairline).

## Judgment calls (spec Implementation Notes — recorded here)

1. **Open-channel exact shape = the select mold verbatim:** plain reflected
   `open` boolean + `open-change` `detail { value }` composed/bubbles,
   flip-only, POST-mount on open / POST-release on close. No
   `default-open` pair exists in the mold — the declarative `<tk-modal open>`
   IS the initial-open form (the select ruling).
2. **Scrim = ink-400 at 52% via color-mix.** No ink-alpha token exists and
   this story adds no tokens; 52% echoes the modal shadow's own alpha
   (`rgba(51,51,51,.52)` in the token layer). Exposed as `--tk-modal-scrim`.
3. **Dark panel = surface-base (#1A1A1A) + border-default hairline.** The
   DESIGN «tonal step 3» semantic is RESERVED in the tokens generator
   («emitted when Modal lands») but no-new-tokens forbids inventing it; the
   hairline (`--tk-color-border-default`, one rule, both themes —
   #E7E8EA light / #FFFFFF24 dark) supplies the dark separation the scrim
   alone cannot (#1A1A1A on scrimmed #1A1A1A). Revisit if the token layer
   ever gains the reserved step.
4. **Initial focus = first focusable in the panel else the panel itself**
   (`tabindex=-1`), per the spec row; the trap container is the HOST so
   slotted consumer focusables join the cycle (the trap's selector-level
   collection cannot see them from inside the surface's tree). The panel's
   own focus paints no ring (`.panel:focus-visible { outline: none }`) —
   the container is not a control; the unified ring belongs to the child
   controls (the select trigger's dedup precedent).
5. **Exit duration 150 (fast) vs entrance 300 (moderate)** — the spec's own
   numbers; the JS close path awaits animationend with the
   `TK_MODAL_EXIT_MAX_MS = 350` bound and re-validates its generation
   post-await (the 3.4 lesson).
6. **No inert-style background at v1** — trap + scrim + refcounted
   scroll-lock carry the dialog (the trap module leaves inert to the
   consumer; EXPERIENCE does not demand it).
7. **Esc precedence:** only the NEWEST open modal answers (module-level
   LIFO), and a connected `tk-toast` eats the Esc first (toast layer 600 >
   modal 500 — the z-scale's own ordering logic; found while testing the
   cross-interaction).
8. **Heading missing → `aria-label="Диалог"`** (the select
   DEFAULT_ACCESSIBLE_NAME precedent — the axe name gate demands a name;
   the matrix row's «content fallback» pick).
9. **Fallback-path limitation (documented):** the container fallback
   (popover-less engines) moves surface + forwarding slots together out of
   tk-modal's shadow tree — slotted consumer content stops projecting on
   that legacy path. No axe/AT gate runs there; happy-dom unit tests assert
   structure only (the molds' rule).
10. **iOS momentum scroll:** `overscroll-behavior: contain` on the scrollable
    panel is the shipped mitigation; the real-device verification stays
    maintainer-side (the deferred-work.md entry this story lands).

## Harness notes

Same top-layer gap as 2.3: body-locator baselines cannot see the promoted
surface — `tests/visual/modal.spec.ts` captures the open region PAGE-LEVEL
(clip over the panel) with its own baseline set, plus geometry assertions
(z token, fixed frame, viewport-spanning scrim, centered ≤480 panel).


## Fix-round patch (2026-09-23)

- Ruling 7 refined: the Esc toast-deferral now counts only LIVE toasts
  (`tk-toast:not([data-exiting])`) — an exiting toast no longer swallows a
  press its own handler ignores (the dead-press fix, mirrored in
  verify/toast/NOTES.md).
- The mount-time open-change guard gained a LOUD regression test in both
  modal and tooltip suites (listener attached BEFORE connect, closed and
  open-attr shapes; mutation-verified — removing the wasOpen check fails
  it).
