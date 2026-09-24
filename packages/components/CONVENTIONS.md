# tinkoff-ui-kit — Component API Conventions

**Status:** active (Story 1.4) · **Normative for:** every component PR · **Sources:** ARCHITECTURE-SPINE (AD-1…AD-12), EXPERIENCE.md, PRD FR-3. Where this file and code disagree, the code is wrong until either changes by PR.

Every rule cites its source. The items the sources left undecided for the pilot are ALL resolved (Button pilot PR — see the "resolved at 1.7 pilot" notes in §2, §3, §5, §7) and frozen like every other rule. The 2.1 items (§4 controlled/uncontrolled shapes, §9 React surface + overlay usage) are resolved by the Input PR — see the "frozen at 2.1" notes.

## 1. Element & file naming

- Custom element names: `tk-` prefix, kebab-case, one word per concept — `tk-button`, `tk-segmented-radio`, `tk-thumbnail-picker`. Prefix decision closed at OQ-3 — `tk-`/`--tk-*` stay permanently (generic abbreviation, zero trademark collision). *(AD-4/Conventions)*
- One component per directory: `packages/components/src/<name>/` containing `index.ts` (element + re-exports), `<name>.css.ts` or styles module, `<name>.test.ts`, `<name>.stories.ts`. *(AD-4 Conventions; the file stem is `stories.ts` — the Storybook convention every suite has shipped since 1.7, text corrected at 3.1/3.2 review)*
- Class names: `TkButton`, `TkSegmentedRadio` — PascalCase with the prefix.

## 2. Props

- Properties are camelCase Lit reactive properties: `variant`, `size`, `loading`, `value`. *(AD-5)*
- Variants and sizes are string-literal unions, never booleans that fork rendering (`variant: 'primary' | 'secondary' | 'inverse'`, not `primary?: boolean; secondary?: boolean`). Confirmed with per-family defaults at the pilot — Button ships `variant: 'primary' | 'secondary' | 'inverse'` (default `primary`) and `size: 'hero' | 'card' | 'compact'` (default `card`); later families declare their own unions and defaults the same way. *(resolved at 1.7 pilot)*
- Enum error strategy: an invalid runtime value CLAMPS to the union default (in `willUpdate`, correcting the reflected attribute too) — never throws. Bad input degrades to the default variant, not a crash, and the value in force is always visible in the DOM. *(resolved at the 1.7 pilot review)*
- Attribute reflection: ALL public boolean and enum props reflect to attributes (`@property({ reflect: true })` — booleans as bare presence/absence, enums as their string value); value props (string/number/object data like `value`) NEVER reflect. The reflected attributes are styling/state hooks (the Button sheet keys on `variant`/`size`/`loading`/`disabled` host attributes). *(resolved at 1.7 pilot)*
- Every prop appears in the component's CEM manifest (jsdoc annotations feed the React wrapper generation). *(AD-1)*

## 3. Events

- Value updates: `<prop>-change` — `value-change`, `checked-change`. Payload is always `detail: { value }` where `value` is the unwrapped new value (string, boolean, object — never the raw `CustomEvent`). *(AD-5, Conventions table)*
- Occurrences: bare `<verb>` — `open`, `close`, `dismiss`, `select` (when not a value change). Same `detail: { value }` shape where a payload exists. Occurrence events arrive with the first component that needs one — tk-button ships none at v1 (native `click` serves activation). *(resolved at 1.7 pilot)*
- Kit custom events ALWAYS cross the shadow boundary: `composed: true, bubbles: true` — consumers listen on the element (or any ancestor) without shadow-piercing. The native events kit elements re-emit or forward keep their own native composition. *(resolved at 1.7 pilot)*
- Events are listed in the React event-map registry (`packages/react`) so wrappers expose `onValueChange` / `onClose`. CI's `pnpm gen && git diff --exit-code` fails on **unregenerated** wrapper output; registry completeness itself is enforced by PR checklist item 3, not by the gen check. *(AD-1)*
- React handlers receive the unwrapped `value`, never the `CustomEvent`. *(AD-1)*

## 4. Controlled & uncontrolled

- Every stateful component ships BOTH modes with identical semantics *(AD-5)*. Both shapes below are **frozen at 2.1 — Input PR**; later components inherit them verbatim, deviations go through the §9 exception log:
  - **Uncontrolled:** internal state; the initial value is the `defaultValue` prop (attribute `default-value`) — plain initial-value semantics, so changes after the first update are IGNORED. Consumer listens to `<prop>-change`. If both `value` and `defaultValue` are provided, `value` wins (controlled at first paint). *(resolved at 2.1 — Input PR)*
  - **Controlled — STRICT:** consumer sets `value` (a property channel; it never reflects); the element renders EXACTLY `value` and mutates nothing internally — typing emits `<prop>-change` and applies nothing locally. For caret sanity the inner native control keeps its live text between updates and re-syncs to the value in force on the element's next update (mirroring how React wraps native inputs — consumers answering `<prop>-change` → setState get native-feeling behavior). *(resolved at 2.1 — Input PR)*
  - **Release:** removing `value` (setting it to null/undefined) switches the element to uncontrolled, with the internal state SEEDED from the last controlled value. Setting `value` again resumes strict rendering. *(resolved at 2.1 — Input PR)*
- On the React surface the wrapper applies the standard controlled mapping (`value` prop → element property, change event → handler with the unwrapped value — §3) and adds NO value-clamping logic of its own; strict revert is the element's job, not the wrapper's. *(frozen at 2.1 — Input PR; see §9)*

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
- Event payload types export as `Tk<PascalName>...Event`: `TkInputChangeEvent`, `TkSelectOpenEvent` — `Tk` + the PascalCase component name + the event stem. Named at the pilot; first concrete export landed at 2.1 (`TkInputChangeEvent` in tk-input). *(resolved at 1.7 pilot)*

## 8. Accessibility & keyboard

- Roles/names/states correct by construction (radio groups, tablist, dialog, alert); announcements via aria-live only where EXPERIENCE.md names them (Toast, optional ProgressBar narration). *(EXPERIENCE A11y Floor)*
- Keyboard matrix per EXPERIENCE.md Interaction Primitives — Tab/Shift-Tab, arrows (Select, Tabs, SegmentedRadio, ThumbnailPicker), Space (Button, Checkbox), Esc (Modal, Tooltip, Select, Toast), Home/End (Tabs). Focus ring is the unified token: 2px `--tk-color-focus-ring`, offset 2px, never removed, never ink. Tab order = reading order. Hover is never the only path (touch parity).
- Interactive targets ≥44×44px effective. *(EXPERIENCE A11y Floor)*
- Errors/announcements: aria-live regions over visual-only errors; described-by wiring for field messages; errors never steal focus. *(EXPERIENCE Component/State Patterns)*

## 9. Freeze protocol

- The **React-surface API** (prop style, controlled-mode semantics, unwrapped-value handlers) and the **overlay usage API** (imperative + declarative patterns for Modal/Toast) are decided and **FROZEN at Story 2.1 — the Input PR**. Not at a stateless component. *(AD-5)*
- Later components conform to the frozen shapes. A deviation requires an entry in the exception log below with rationale and reviewer sign-off.

### Frozen React-surface API (at 2.1 — Input PR)

- Wrappers stay GENERATED from the CEM manifest via `@lit/react` (`pnpm gen`; §3), with kit custom events registered in the owned event-map (`'tk-input': { onValueChange: 'value-change' }` is the first entry).
- Handlers receive the UNWRAPPED `value` — `detail: { value }` is unwrapped by the kit's wrapper runtime before the consumer's handler runs; the raw `CustomEvent` never reaches React code (AD-1). Payload-less kit events fall back to passing the event itself.
- Controlled mode on the React surface is the standard `value` + change-handler mapping onto the element (§4 strict semantics, enforced by the element; the wrapper adds NO value-clamping logic).

### Frozen overlay usage API (at 2.1 — Input PR; binds 2.2 and E4)

- **Declarative-first.** An overlay surface (Select's menu, Modal, Tooltip, the Navbar drawer) is a normal element in the DOM tree whose open state is the `open` attribute/property plus an `open-change` event (`detail: { value: boolean }`, composed, bubbles — the §3 shapes). Content lives in SLOTS; the consumer owns the open state and composes the surface like any other element.
- **Imperative helpers ONLY for inherently imperative surfaces.** Toast (fire-and-forget notifications with nothing in the consumer's tree) may ship programmatic `show`/`dismiss` helpers — built on the SAME elements and events, never a parallel API. This is the only sanctioned imperative pattern.
- **The controller owns the mechanics (AD-12).** Mounting (top-layer with fallback), scroll-lock (refcounted), positioning/flip, stacking, and focus-trap/restore live in the story-2.2 overlay controller and are CONSUMED, never reimplemented, by overlay components. `z-order` only via `--tk-z-*`. Implemented in `packages/components/src/overlays/` (Story 2.2 — its module header carries the capability→clause map and the mounting support matrix).
- The overlay controller (2.2) and Modal/Tooltip/Toast (E4) CONFORM to this contract; deviations require the exception log below.

### Exception log

| Date | Component | Deviation | Rationale |
|---|---|---|---|
| 2026-09-23 | tk-link (Story 3.1) | Hover affordance is the underline only — no color step; EXPERIENCE State Patterns' hover token step (blue-200) is not consumed. The underline fades in on the 150ms motion token, so the motion letter holds. | The cross-theme-correct step token does not exist: blue-200 carries NO dark remap (a raw step would be invisible/wrong in dark) and no-new-tokens forbids inventing a link-hover semantic this story. The underline carries the affordance in BOTH themes. Revisit if the token layer ever gains a link-hover semantic. |
| 2026-09-23 | tk-link (Story 3.1) | Focus indicator is the underline, not the unified 2px ring (§8). | EXPERIENCE.md's TextLink row names «keyboard focus visible underline» — the component row outranks the generic ring rule for inline text; the ring governs boxed controls (buttons, fields) where the reference shows a box. The underline is always visible while keyboard-focused (`:focus-visible`), never removed. |
| 2026-09-23 | tk-navbar drawer (Story 3.4) | The drawer's open state is INTERNAL UI STATE, not a consumer channel: no `open` attribute/property and no `open-change` event, deviating from the frozen §9 declarative overlay-surface contract (`open` + `open-change`) that tk-select carries. Esc/burger/link-click close it; nothing dispatches. | The spec (3.4) itself ruled the drawer internal — navbar is NAVIGATION, not a form control: link clicks are native anchor navigation with no controlled semantics to mirror (the same ruling keeps `activeValue` a prop-only input with no §4 channel), and a page carries exactly one header drawer no consumer legitimately drives remotely. Recorded so PR-checklist item 9 holds; a real programmatic-control need reopens this with a proper `open`/`open-change` surface. |
| 2026-09-23 | tk-article-card (Story 3.9) | The whole-card «Читать» link's focus indicator is the UNDERLINE only, not the unified 2px ring (§8). | The tk-link (3.1) exception precedent applies verbatim: the card link is a text link whose giant hit area is the ::after stitch, not a boxed control — the ring governs buttons/fields where the reference shows a box. The underline is always visible while keyboard-focused (`:focus-visible`), never removed. Recorded so PR-checklist item 9 holds. |
| 2026-09-23 | kit-wide (Stories 5.1–5.3 a11y sweep) | The ≥44×44 interactive-target floor (§8) applies to BOXED/PADDED registers: buttons, fields, pills, standalone links, burger, tabs, segments, tiles, checkbox label surfaces, drawer links. Anchors FLOWING INLINE in prose or dense text lists — tk-link `inline`/`legal` variants, footer column links — keep their TEXT-BOUNDED targets (often under 44px tall). | The 3.1 tk-link precedent («inline links inside sentences keep their line-box targets»), applied kit-wide by the sweep: the compliance target is WCAG 2.1 AA, which has NO target-size criterion (44px is the kit's own stricter floor — EXPERIENCE A11y Floor «pill heights comply» contemplates the boxed registers), and WCAG 2.5.8's inline/sentence exception is the recognized analog for in-text links. Padding dense link lists to 44px would break the reference footer/prose fidelity the kit recreates. Mechanized boundary: `tests/visual/a11y-sweep.spec.ts` exempts exactly `a` elements resolving `display: inline` — every other kit surface in every story must measure ≥44×44 or the sweep fails. The boundary is COMPUTED-DISPLAY, not semantics: a default-variant tk-link placed as a lone CTA outside prose still computes inline and rides the exemption coherently with the variant contract (the standalone variant exists for exactly the boxed-CTA register). |
| 2026-09-24 | tk-filter-chips «Ещё» menu (Story 6.2) | The overflow menu's open state is INTERNAL UI STATE, not a consumer channel: no `open` attribute/property and no `open-change` event, deviating from the frozen §9 declarative overlay-surface contract (`open` + `open-change`) that tk-select's menu carries. Esc/outside-press/focus-loss close it; selecting or re-toggling «Ещё» closes it; nothing dispatches. | The tk-navbar drawer precedent (above) applied to an auxiliary surface of a FORM CONTROL: the chip row's only consumer channel is the §4 `value` pair — the menu exists solely to reach items past `visibleCount`, its open/close is presentation detail with no controlled semantics to mirror, and `aria-expanded` on «Ещё» already exposes the state to AT. The spec (6.2) itself ruled the menu internal. Recorded so PR-checklist item 9 holds; a real programmatic-control need reopens this with a proper `open`/`open-change` surface. |
| 2026-09-24 | tk-combobox-search panel (Story 6.3) | The suggestion panel's open state is INTERNAL UI STATE, not a consumer channel: no `open` attribute/property and no `open-change` event, deviating from the frozen §9 declarative overlay-surface contract (`open` + `open-change`) that tk-select's menu carries. Esc/outside-press/focus-loss close it; committing (Enter) or further typing refilters/reopens it; nothing dispatches. | The tk-filter-chips «Ещё» precedent (above) applied to a search field's auxiliary surface: the field's only consumer channel is the §4 `value` pair — typing NEVER emits (the spec (6.3) froze that), the panel exists solely to present the live query's filtered matches, its open/close follows query/focus as presentation detail with no controlled semantics to mirror, and `aria-expanded` on the field already exposes the state to AT. The spec (6.3) itself ruled the panel internal. Recorded so PR-checklist item 9 holds; a real programmatic-control need reopens this with a proper `open`/`open-change` surface. |
| 2026-09-24 | tk-data-table deltas on row hover (Story 6.4) | The delta text also renders on the row-HOVER composite surface — below the 4.5:1 AA text floor on ONE leg per theme: light `delta-positive` 4.163:1 on the #F2F4F7 hover composite (contrast.test.ts:275), dark `delta-negative` 3.382:1 on the #313131 hover composite (:282). The opposite legs PASS on hover (light negative 5.608:1 :277, dark positive 4.883:1 :284). All deltas sit at full compliance on surface-base resting cells; only the transient hover tint dips. | Direction-by-COLOR is the table's core semantic (FR-12: «color carries direction»); suppressing or re-coloring deltas on hovered rows would break the semantic mid-interaction, and the no-new-tokens rule forbids inventing delta-on-tint variants. Hover is transient; resting rows sit on surface-base at full compliance. Every ratio above is PINNED in tests/contrast.test.ts (light :275/:277, dark :282/:284); the dark side rides the 6.1 dark first-pass and is verified by the 8.2 sweep. Revisit if the token layer ever gains delta-on-tint variants. [Row corrected 2026-09-25 per the 6.4 quick-review lens: it originally cited 4.039:1 — that is the surface-FIELD pin (:276), a surface the table never paints — and implied both light legs fail.] |

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
