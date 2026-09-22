# Story 2.3 — tk-select provisional baseline evidence (2026-09-22)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side sources (Story 2.0, tbank.ru debit-card
form): `.playwright-cli/captures/select-cashback.png` (536×57, closed
trigger) and `select-cashback-open.png` (536×383, open menu).

## Files

| File | What |
|---|---|
| `side-by-side-closed-light.png` / `-dark.png` | reference trigger (top) vs kit closed trigger (bottom), 40px gutter |
| `side-by-side-open-light.png` / `-dark.png` | reference open menu (top) vs kit open menu (bottom) |
| `kit-select-closed-light.png` / `-dark.png` | kit closed renders (Playground story, field pinned to 536px = reference crop width, placeholder composition) |
| `kit-select-open-light.png` / `-dark.png` | kit open renders (Open story, same pinned field; clip = trigger ∪ controller-mounted panel) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6011 &
node .playwright-cli/verify/select/select-capture.mjs   # COMMITTED alongside this NOTES
```

The script pins each `main tk-select` to the reference composition
(`width: 536px`, `label: ''`, placeholder «Выберите повышенный кэшбэк (четыре
категории)»), awaits `updateComplete` + `document.fonts.ready`, screenshots
the element (closed) and a clip union of field + panel rects (open — the panel
is controller-mounted in the top layer, outside the host's box).

Side-by-sides: `magick ( <reference> -bordercolor '#CCCCCC' -border 1 )
( -size 40x1 xc:white ) ( <kit> -bordercolor '#CCCCCC' -border 1 )
-background white -append`.

## Ground truth — computed styles vs reference measurements

Playwright `getComputedStyle` on the built story (authoritative; vision color
readings carry the known near-white ambiguity):

| Aspect | Reference (capture pack § Select) | Kit (computed) | Verdict |
|---|---|---|---|
| Trigger fill | ~#F0F1F3 ± (≈ surface-field) | #ECF1F7 (`--tk-color-surface-field`) | exact token |
| Trigger height | ~52px (57px element bound) | 52.0px + 1px hairline | exact |
| Trigger radius | ~12px | 12px (`--tk-radius-md`) | exact |
| Placeholder text | ~#33333B, 15–16px | **#616871 (text-secondary), 17px** | DEVIATION 1 (AA) |
| Chevron | down «⌄», ~#4A4A52, right inset ~16–20px | 24px inline SVG, `--tk-color-text-secondary` (#616871), 16px inset, rotates 180° on open | DEVIATION 2 (nearest token) |
| Menu container | #FFFFFF, radius ~12px, soft shadow, no border | `--tk-color-surface-base` (#FFFFFF / #1A1A1A dark), radius-md 12px, `--tk-shadow-dropdown` (3-layer), no border | exact |
| Option row | h ~48px, text ~#333 15px, 16px inner padding | min-height 48px, 15px body-m, #333, 4px panel inset + 12px row padding = 16px text inset | exact |
| Long list | (not captured) | max-height `calc(var(--tk-space-48) * 7 + var(--tk-space-12))` = 348px (7 rows + panel padding + headroom), overflow-y auto, scrollIntoView block:nearest | spacing-derived per spec |
| Dark menu | — (site is light-only) | #1A1A1A surface, shadow collapsed to none by the dark token layer, rows white text | authored dark layer |

## Vision check notes (zai analyze_image, 2026-09-22) — the check EARNED its keep

Four real defects surfaced only here (unit tests, axe and the kit-vs-kit
baseline were all green through every one of them):

1. **No menu rendered at all** (first capture): light children of a shadow
   host render ONLY through slot assignment — the Design-Notes light-DOM
   panel had no `<slot>`, so it generated no box. Interim fix: mounting slot.
2. **axe aria-valid-attr-value**: with the light-DOM panel, the trigger's
   `aria-activedescendant`/`aria-controls` crossed a shadow boundary on every
   idref — unresolvable by axe (and by strictly-scoped screen readers). FIX:
   the panel became a generated child of tk-select's SHADOW TREE (single-tree
   idrefs); the mounting slot went away (shadow children render in tree
   order). The popover path promotes the panel IN PLACE (the controller's
   documented shadow-safe mechanism); only the no-popover fallback moves it
   across the tree boundary and back. This AMENDS the spec's Design Notes
   decision — recorded in select.ts's class doc and deviation 9 below.
3. **A one-notch scrollbar + light gutter strip** in the dark render: the
   7-row list overflowed the exact-content max-height by the panel's own
   padding; and the panel anchored to the trigger BUTTON hung ~50px short of
   the field's right edge (invisible on light, obvious on dark). FIXES:
   max-height gained a headroom step (`calc(7·48px + 12px)`), the anchor is
   the FIELD box.
4. **Declarative `<tk-select open>` had no aria-activedescendant** (mount set
   the active index without requesting the re-render that paints the
   attribute). FIX: initial activation goes through the same path as
   keyboard navigation.

Final passes (on the shipped code): `side-by-side-open-light.png` — trigger
+ 7-row white menu, first row highlighted (blue-gray rounded fill), menu
flush with the field width (no right-edge strip), no scrollbar, no stray
text, last row fully visible; rows ~45-48px, 16px text inset. The closed
side-by-side's vision flags (fill "white", "black chevron") are the KNOWN
near-white ambiguity — computed styles pin fill #ECF1F7 (the exact
reference-family token, same reading the 2.0 notes recorded for the
reference's own #ECF1F7) and chevron #616871; the one REAL closed-state
deviation is the placeholder color (deviation 1).

## Harness limitation discovered (flagged for the maintainer)

`locator('body')` element screenshots EXCLUDE top-layer (popover-promoted)
content: the committed `components-select--open` baselines record the story
chrome + open trigger but NOT the floating menu (verified by vision on the
baseline PNG — blank where the menu paints). Mitigated since the 2.3 review:
`tests/visual/select.spec.ts` captures the open-menu region PAGE-LEVEL (clip
over field + panel) with its own baseline set — the open menu has automated
drift protection now; Epic 4 (Modal/Tooltip/Toast) should generalize that
into the story harness itself.

Form participation: name/FormData не входит в v1 — как и у Input; решение в
5.x при первом реальном consumer-форме.

## Intentional deviations (documented, not defects)

1. **Placeholder color text-secondary (#616871), not gray-500 (#79818C).**
   The DESIGN spec's gray-500 measures 3.46:1 on the surface-field fill —
   under AA for 17px text. tk-input escapes measurement only because a native
   input's placeholder paints through the `::placeholder` pseudo-element
   (axe never sees it); tk-select's placeholder is a real span, so the kit's
   AA-override axis applies (the link-on-tint precedent): one step darker,
   4.95:1 on the light fill; the dark layer's #FFFFFFB3 passes on the
   translucent dark field. The `--tk-select-placeholder` hook still lets
   consumers restore gray-500.
1a. **Placeholder/value font size 17px** (`--tk-text-body-l`, the nearest
   token step) vs the reference's ~15–16px reading — the type scale has no
   15–17 bridging step for field text; 17 was chosen exactly as tk-input's
   own documented deviation #4 (same field language ⇒ same step), preferred
   over 15px body-m which drops below the reference's measured range.
   Disposition: keep; revisit only if the scale gains a 16px step.
2. **Chevron color text-secondary (#616871)** vs the reference's ~#4A4A52 —
   nearest token step, decorative + aria-hidden (no contrast requirement).
3. **Single-select semantics** vs the reference's multiselect-with-checkboxes
   (the capture's «четыре категории» control). v1 scope per the spec: options
   `{ value, label, disabled? }`, `aria-selected`; the multiselect pattern is
   a later composition. The disabled row keeps the capture's dimmed look.
4. **Selected-row marking = ink check glyph + medium weight** — the capture
   shows no yellow anywhere; its own selected affordance is a checkbox
   (multiselect, out of scope). Visual focus (the active row) = surface-field
   flat fill highlight, the reference's flat-fill language; the real focus
   ring stays on the trigger the whole time the menu is open.
5. **Menu↔field gap 4px** (spacing step) — the capture's open menu sits
   flush-to-4px below the field; exact gap unreadable at DPR 1.
6. **No internal required validation** (unlike tk-input): a select has no
   typing, so blur-timing is ambiguous — `required` is semantics-only and the
   consumer drives `error`. Noted per the spec's flagged judgment calls.
7. **Typeahead selects nothing** — it moves visual focus (open if closed);
   Enter commits. The spec's matrix row is «typeahead jumps», and combobox
   semantics separate activation from selection. Buffer resets after 500ms
   (`TK_SELECT_TYPEAHEAD_RESET_MS`, matching the motion duration-slow step).
8. **aria-activedescendant/aria-controls stay single-tree** — the panel
   lives in tk-select's shadow tree with the trigger (AMENDED from the
   spec's Design Notes light-DOM decision, which failed the axe
   aria-valid-attr-value gate; see the vision notes). No-popover fallback
   engines move the panel across the boundary while mounted — a documented
   window with no axe/AT gate behind it.
9. **The reference's open capture is an expanded inline multiselect**
   (checkboxes + brand icons + em-dash label format) — v1 is a single-select
   per the spec's frozen data shape; row affordances are the ink check +
   flat-fill highlight. Label copy uses the trigger text from the closed
   reference; the dash format («1% — Все покупки») is data, not component
   behavior.
