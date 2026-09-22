# Epic 2 Context: Forms and progress (the reference application form assembles from the kit)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Ship the forms and progress components — Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar — plus the shared overlay controller, so that the reference application form assembles entirely from kit atoms and passes a keyboard-only + screen-reader walkthrough end to end. This epic is also where the kit's public API is settled: the React-surface convention and the overlay usage API are decided at Input and frozen for every later component, and the overlay controller built here becomes the single owner of floating-surface mechanics for Select menus now and Modal/Tooltip/Toast/Navbar drawer later.

## Stories

- Story 2.0: Reference capture pack for all remaining components
- Story 2.1: Input with validation — and the frozen React/overlay API
- Story 2.2: Overlay controller — single owner of mounting, scroll-lock, positioning, stacking
- Story 2.3: Select — native-equivalent keyboard dropdown
- Story 2.4: Checkbox — consent-style with indeterminate
- Story 2.5: SegmentedRadio — Да/Нет pill group
- Story 2.6: ThumbnailPicker — selectable tiles with ring
- Story 2.7: ProgressBar — determinate default, safe indeterminate
- Story 2.8: Composed application form — UJ-3 walkthrough recorded

## Requirements & Constraints

- All six components are reference-grounded: each needs an approved visual baseline with a side-by-side against its tbank.ru capture attached to the baseline PR (captures come from story 2.0).
- Every component meets WCAG 2.1 AA in BOTH themes: keyboard operability, visible focus, correct roles/names/states, contrast per the AA-override pairs, effective interactive targets >= 44×44px.
- Every stateful component ships controlled (`value` + change event) and uncontrolled modes with identical semantics, plus a React wrapper generated from the custom-elements manifest.
- Component gate per story: impeccable audit with zero blockers, axe checks on the story in both themes, Storybook story covering default + all variants + interactive states + theming demo + a11y notes including a keyboard-only checklist, and reduced-motion paths for all motion. A component without stories does not merge.
- The composed application form is a docs example — a composite form widget is explicitly out of scope; only the atoms ship.
- ProgressBar is the only non-overlay component permitted aria-live narration, and it is optional, never forced.
- Error/validation microcopy: calm bank-grade tone, no exclamation marks, numbers formatted with spaces ("1 331 ₽"), strings localization-ready (no baked-in concatenation).
- Baselines recorded during the autonomous run are PROVISIONAL: the side-by-side capture is archived alongside, automated kit-vs-kit comparison enforces drift from provisional approval onward, and the maintainer confirms or re-takes baselines as a batch later.

## Technical Decisions

- Components are Lit custom elements under `packages/components/src/<name>/`, rendering in shadow roots; theming crosses boundaries only via `--tk-*` custom properties. No hard-coded color/radius/shadow/font/z-index in component code; z-order comes only from the `--tk-z-*` scale.
- The React package is generated, never hand-written: wrappers from the custom-elements manifest via `@lit/react`, events mapped through the owned event-map registry (`value-change` → `onValueChange`), handlers receive unwrapped values. `pnpm gen` must leave a clean diff.
- API convention (documented in `packages/components/CONVENTIONS.md`): camelCase reactive props; value updates dispatch `<prop>-change` with `detail: { value }`; occurrences dispatch bare `<verb>` events; controlled + uncontrolled with identical semantics. The React-surface API shape and the overlay usage API (imperative + declarative patterns for Modal/Toast) are decided in story 2.1 and recorded as FROZEN — later components conform; deviations require a logged exception.
- The overlay controller (story 2.2) is a framework-agnostic module with no visual surface of its own: top-layer mounting with fallback, refcounted body scroll-lock (body scroll restores only when the last consumer releases), viewport-flip positioning, cross-instance Toast stacking (bottom-right, max 3 visible, oldest collapses), and the focus-trap/restore primitive that Modal and the Navbar drawer must consume rather than reimplement. Unit-tested standalone in Vitest: mount/unmount, refcount under simultaneous consumers, flip at edges/corners, stack overflow, trap/restore cycling.
- Per-component custom properties follow `--tk-<component>-<slot>`, with the same slot name for the same role across components (`--tk-input-fill` ≡ `--tk-select-fill`).
- Field visual language comes from tokens: surface-field fill (#ECF1F7; dark-field in dark theme), radius-md 12px, 52px height, gray-500 placeholder, border-default hairline, 2px focus-ring offset 2px. Select shares the field language + chevron; its menu uses the dropdown shadow with radius-sm items. Checkbox: 20px box, radius-xs, ink-300 check on yellow-100 fill. SegmentedRadio: pill track, selected segment solid fill + dot indicator. ThumbnailPicker: 72px radius-md tiles wrapping to a grid, 2px ink border ring on selection. ProgressBar: 4px gray-200 track, blue-100 fill, pill radius.
- Motion values come exclusively from motion tokens — hover 150ms, press 75ms; every animation has a `prefers-reduced-motion` path (0ms / opacity-only). Stack versions are pinned in the workspace lockfiles; do not re-pin.

## UX & Interaction Patterns

- Input: label and placeholder both supported (placeholder never replaces label); required marked with asterisk + aria-required; inline badge slot (e.g. "+30%") announced after the label; validation on blur with the message tied via aria-describedby; the error never steals focus — it is heard on the next visit to the field. Error state: red message + icon, aria-invalid.
- Select: native-equivalent keyboard — Enter/Space opens, arrows navigate, Enter selects, Esc closes, typeahead jumps, Home/End work; selected option conveys aria-selected; the trigger has combobox semantics with an accessible name; the menu closes on outside click AND on focus loss, returning focus to the trigger.
- Checkbox: Space toggles; label is clickable and tied to the input; indeterminate prop for parent states; the consent pattern (label link + checkbox) ships as a composed story example, not a separate component.
- SegmentedRadio: radio/radiogroup semantics by construction; arrow keys move within the group and selection follows focus; exactly one option selected at any time.
- ThumbnailPicker: radio-group semantics over visual tiles; row-major arrow navigation; selection announced via ring + state; the empty state renders a zero-state copy slot, never blank.
- ProgressBar: determinate by default with value/min/max exposed; label and percentage are optional slots; the indeterminate variant uses a reduced-motion-safe pulse (static under reduce); zero-state copy slot.
- Cross-cutting state patterns: the focus-visible ring is the unified 2px token ring, offset 2px, never removed; disabled = 40% opacity, no pointer events, aria-disabled; hover = one token step at 150ms.
- Story 2.8 records the keyboard + SR walkthrough of the composed form (label + required announced, badge read after label, Select opens/navigates/picks by keyboard, arrows move Да/Нет with focus-follows-selection, submit error via aria-describedby without focus theft, ProgressBar reflecting completion); the Toast leg is deferred and re-walked with the Toast story in Epic 4.

## Cross-Story Dependencies

- Story 2.0 must run before the first component baseline: fidelity side-by-sides need its captures; it also captures the mint/beige tint surfaces at native zoom for the assumption check in Epic 3.
- Story 2.1 blocks 2.2–2.7: the frozen React/overlay API decided there governs every later component; 2.2 additionally consumes the overlay usage decision from it.
- Story 2.2 depends on the z-scale tokens from Epic 1, is consumed by Select (2.3), and later by Modal/Tooltip/Toast (Epic 4) and the Navbar drawer (Epic 3).
- Story 2.8 needs every Epic 2 component plus Button from Epic 1.
- Provisional baselines are confirmed or re-taken at the batched maintainer gate in Epic 5.
