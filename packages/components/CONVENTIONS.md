# tinkoff-ui-kit — Component API Conventions

**Status:** active (Story 1.4) · **Normative for:** every component PR · **Sources:** ARCHITECTURE-SPINE (AD-1…AD-12), EXPERIENCE.md, PRD FR-3. Where this file and code disagree, the code is wrong until either changes by PR.

Every rule cites its source. The items the sources left undecided for the pilot are ALL resolved (Button pilot PR — see the "resolved at 1.7 pilot" notes in §2, §3, §5, §7) and frozen like every other rule. The 2.1 items in §4 remain open by design.

## 1. Element & file naming

- Custom element names: `tk-` prefix, kebab-case, one word per concept — `tk-button`, `tk-segmented-radio`, `tk-thumbnail-picker`. The prefix is revisited with OQ-3 before publishing. *(AD-4/Conventions)*
- One component per directory: `packages/components/src/<name>/` containing `index.ts` (element + re-exports), `<name>.css.ts` or styles module, `<name>.test.ts`, `<name>.story.ts`. *(AD-4 Conventions)*
- Class names: `TkButton`, `TkSegmentedRadio` — PascalCase with the prefix.

## 2. Props

- Properties are camelCase Lit reactive properties: `variant`, `size`, `loading`, `value`. *(AD-5)*
- Variants and sizes are string-literal unions, never booleans that fork rendering (`variant: 'primary' | 'secondary' | 'inverse'`, not `primary?: boolean; secondary?: boolean`). Confirmed with per-family defaults at the pilot — Button ships `variant: 'primary' | 'secondary' | 'inverse'` (default `primary`) and `size: 'hero' | 'card' | 'compact'` (default `card`); later families declare their own unions and defaults the same way. *(resolved at 1.7 pilot)*
- Attribute reflection: ALL public boolean and enum props reflect to attributes (`@property({ reflect: true })` — booleans as bare presence/absence, enums as their string value); value props (string/number/object data like `value`) NEVER reflect. The reflected attributes are styling/state hooks (the Button sheet keys on `variant`/`size`/`loading`/`disabled` host attributes). *(resolved at 1.7 pilot)*
- Every prop appears in the component's CEM manifest (jsdoc annotations feed the React wrapper generation). *(AD-1)*

## 3. Events

- Value updates: `<prop>-change` — `value-change`, `checked-change`. Payload is always `detail: { value }` where `value` is the unwrapped new value (string, boolean, object — never the raw `CustomEvent`). *(AD-5, Conventions table)*
- Occurrences: bare `<verb>` — `open`, `close`, `dismiss`, `select` (when not a value change). Same `detail: { value }` shape where a payload exists. Occurrence events arrive with the first component that needs one — tk-button ships none at v1 (native `click` serves activation). *(resolved at 1.7 pilot)*
- Kit custom events ALWAYS cross the shadow boundary: `composed: true, bubbles: true` — consumers listen on the element (or any ancestor) without shadow-piercing. The native events kit elements re-emit or forward keep their own native composition. *(resolved at 1.7 pilot)*
- Events are listed in the React event-map registry (`packages/react`) so wrappers expose `onValueChange` / `onClose`. CI's `pnpm gen && git diff --exit-code` fails on **unregenerated** wrapper output; registry completeness itself is enforced by PR checklist item 3, not by the gen check. *(AD-1)*
- React handlers receive the unwrapped `value`, never the `CustomEvent`. *(AD-1)*

## 4. Controlled & uncontrolled

- Every stateful component ships BOTH modes with identical semantics *(AD-5)*:
  - **Uncontrolled:** internal state; consumer sets an initial value and listens to `<prop>-change`. The initial-value prop shape (`defaultValue`-style vs plain attribute) is `[OPEN — frozen at 2.1 (Input)]`.
  - **Controlled:** consumer sets `value`; the component does not mutate it internally — it emits `<prop>-change` and renders the consumer's value. Behavior when a controlled value stops being provided is `[OPEN — frozen at 2.1 (Input)]`.
- Controlled-mode semantics on the React surface are **frozen at Story 2.1 (Input)** — see §9. The spine's adversarial review explicitly left these semantics open until then.

## 5. Slots

- The DEFAULT slot carries the component's primary content (Button's label; later: Input's badge row additions stay named). Anatomy beyond the primary content gets NAMED slots (Button `icon` — left of the label). A component with a single meaningful projection uses the default slot alone; named slots are added per component as EXPERIENCE.md names them. *(resolved at 1.7 pilot)*
- Slot names are lowercase kebab and identical across components for the same role (`badge` in Input = `badge` in any future field) — the same-slot-same-role rule, applied to content slots by analogy with the custom-property grammar. *(Conventions table; analogy noted)*
- Content projection never assumes light-DOM structure inside the shadow root beyond documented slots.

## 6. Custom properties (theming surface)

- Cross-boundary styling happens ONLY via CSS custom properties. Components never read global CSS classes and never inject document-level styles. *(AD-2)*
- Per-component properties follow the grammar `--tk-<component>-<slot>`: `--tk-input-fill`, `--tk-select-fill` — the same slot name for the same role across components. *(Conventions table)*
- Components never hard-code color/radius/shadow/font/z-index values; everything consumes `var(--tk-*)` tokens. Z-order only via `--tk-z-*`; overlays only through the overlay controller. *(AD-2, AD-12; enforced by tests/zero-hardcoded)*
- Dark mode: zero component-level theme branches — `[data-theme="dark"]` swapping the token layer restyles everything. *(AD-3)*

## 7. TypeScript

- Strict mode; public props/events typed with exported literal unions; no `any` in public surface. *(AD-6)*
- Event payload types export as `Tk<PascalName>...Event`: `TkInputChangeEvent`, `TkSelectOpenEvent` — `Tk` + the PascalCase component name + the event stem. Named at the pilot; first concrete export lands with Input (2.1). *(resolved at 1.7 pilot)*

## 8. Accessibility & keyboard

- Roles/names/states correct by construction (radio groups, tablist, dialog, alert); announcements via aria-live only where EXPERIENCE.md names them (Toast, optional ProgressBar narration). *(EXPERIENCE A11y Floor)*
- Keyboard matrix per EXPERIENCE.md Interaction Primitives — Tab/Shift-Tab, arrows (Select, Tabs, SegmentedRadio, ThumbnailPicker), Space (Button, Checkbox), Esc (Modal, Tooltip, Select, Toast), Home/End (Tabs). Focus ring is the unified token: 2px `--tk-color-focus-ring`, offset 2px, never removed, never ink. Tab order = reading order. Hover is never the only path (touch parity).
- Interactive targets ≥44×44px effective. *(EXPERIENCE A11y Floor)*
- Errors/announcements: aria-live regions over visual-only errors; described-by wiring for field messages; errors never steal focus. *(EXPERIENCE Component/State Patterns)*

## 9. Freeze protocol

- The **React-surface API** (prop style, controlled-mode semantics, unwrapped-value handlers) and the **overlay usage API** (imperative + declarative patterns for Modal/Toast) are decided and **FROZEN at Story 2.1 — the Input PR**. Not at a stateless component. *(AD-5)*
- Later components conform to the frozen shapes. A deviation requires an entry in the exception log below with rationale and reviewer sign-off.

### Exception log

| Date | Component | Deviation | Rationale |
|---|---|---|---|
| — | — | — | — |

## 10. Construction rules

- **SSR-compat:** no imperative DOM access at construction time; render via Lit templates only. *(AD-10)*
- **Motion:** durations/curves come exclusively from `--tk-motion-*` tokens (AD-9 mapping: hover 150ms, press 75ms, overlay open/close productive entrance/exit, tab swaps expressive standard); every animation has a `prefers-reduced-motion` path. The token layer already collapses durations to 0ms under the media query — components must not reintroduce fixed durations. *(AD-9)*
- **Detector governance:** impeccable ignore-rule changes are themselves reviewed and justified in the PR that changes them. *(FR-9)*

## 11. PR review checklist (run on every component PR)

1. Naming: `tk-` prefix, kebab-case element, PascalCase class, one directory per component. *(§1)*
2. Props: camelCase, literal-union variants/sizes, no forking booleans. *(§2)*
3. Events: `<prop>-change` / bare `<verb>`, `detail: { value }`, registered in the React event map, `pnpm gen` clean. *(§3, AD-1)*
4. Controlled + uncontrolled both shipped, identical semantics. *(§4)*
5. Slots: same-slot-same-role names. *(§5)*
6. Theming: only `var(--tk-*)`; no hard-coded color/radius/shadow/font/z-index; per-component props follow `--tk-<component>-<slot>`; zero theme branches. *(§6)*
7. A11y: roles/names/states by construction; keyboard matrix implemented; unified focus ring; targets ≥44px; errors announced, never focus-stealing. *(§8)*
8. Construction: no imperative DOM at construction; motion only via tokens with reduced-motion path. *(§10)*
9. Freeze conformance: API matches the shapes frozen at 2.1 (or an exception-log entry exists). *(§9)*
10. Stories: default + all variants + interactive states + theming demo + a11y notes incl. the keyboard-only checklist — no stories, no merge. *(AD-7)*
11. Gates: impeccable zero blockers; axe both themes; visual baseline approved (provisional rule during the autonomous run). *(AD-7, AD-8)*
12. Any detector ignore-rule change is separately justified. *(FR-9)*
