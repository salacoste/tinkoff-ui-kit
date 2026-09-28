# pillkit-tj — Component API Conventions (ТЖ sub-kit)

**Status:** seeded (Story 15.1) · **Normative for:** every ТЖ component PR (epic 16 onward) · **Sources:** `packages/components/CONVENTIONS.md` (the bank kit's frozen grammar — AD-5 v5: «conventions are seeded, not shared»), ARCHITECTURE-SPINE v5 Delta, `ux-designs/ux-tj-kit-2026-09-28/{DESIGN,EXPERIENCE}.md`.

This file seeds the ТЖ package with the bank kit's **frozen §4/§9 grammar, copied with ТЖ naming** — the API language is inherited, not reinvented. Everything ТЖ-specific that the sources leave undecided is marked `[OPEN — first stateful ТЖ component (16.1 freeze)]` (AD-5 v5 ruling); nothing ТЖ-specific is silently invented here. Where this file and code disagree, the code is wrong until either changes by PR.

Naming settled at OQ-9 (spine v5 Delta): element prefix `tj-`, token prefix `--tj-*`, theme attribute `data-tj-theme`, package family `pillkit-tj-{tokens,components,react}`. The ТЖ family has **zero runtime dependency on the bank family — and vice versa** (FR-17; docs composes both).

## 4. Controlled & uncontrolled *(inherited from the bank §4, frozen at 2.1 — Input PR)*

- Every stateful component ships BOTH modes with identical semantics *(AD-5)*. The bank shapes are inherited VERBATIM; ТЖ deviations go through the §9 exception log:
  - **Uncontrolled:** internal state; the initial value is the `defaultValue` prop (attribute `default-value`) — plain initial-value semantics, so changes after the first update are IGNORED. Consumer listens to `<prop>-change`. If both `value` and `defaultValue` are provided, `value` wins (controlled at first paint).
  - **Controlled — STRICT:** consumer sets `value` (a property channel; it never reflects); the element renders EXACTLY `value` and mutates nothing internally — interaction emits `<prop>-change` and applies nothing locally. For caret sanity the inner native control keeps its live text between updates and re-syncs to the value in force on the element's next update (mirroring how React wraps native inputs — consumers answering `<prop>-change` → setState get native-feeling behavior).
  - **Release:** removing `value` (setting it to null/undefined) switches the element to uncontrolled, with the internal state SEEDED from the last controlled value. Setting `value` again resumes strict rendering.
- On the React surface the wrapper applies the standard controlled mapping (`value` prop → element property, change event → handler with the unwrapped value) and adds NO value-clamping logic of its own; strict revert is the element's job, not the wrapper's.
- Which ТЖ surfaces are stateful channels at all — the ТЖ roster is display/link-heavy — `[OPEN — first stateful ТЖ component (16.1 freeze)]`.

## 9. Freeze protocol *(inherited shape; the ТЖ instance freezes at 16.1)*

- The **React-surface API** (prop style, controlled-mode semantics, unwrapped-value handlers) and the **overlay usage API** are frozen in the BANK kit at Story 2.1 — Input PR (`packages/components/CONVENTIONS.md` §9). The ТЖ family INHERITS those shapes; it re-runs the freeze ritual on its own package's terms at **story 16.1 — the first stateful ТЖ component** (epics-v5 E16; AD-5 v5).
- Later ТЖ components conform to the frozen shapes. A deviation requires an entry in the exception log below with rationale and reviewer sign-off.

### Frozen React-surface API (inherited from the bank 2.1 freeze)

- Wrappers stay GENERATED from the ТЖ CEM manifest via `@lit/react` (the parameterized `generate-wrappers` machinery — AD-1 v5: not forked), with ТЖ kit custom events registered in the ТЖ-owned event-map `[OPEN — first stateful ТЖ component (16.1 freeze)]`.
- Handlers receive the UNWRAPPED `value` — `detail: { value }` is unwrapped by the wrapper runtime before the consumer's handler runs; the raw `CustomEvent` never reaches React code (AD-1). Payload-less kit events fall back to passing the event itself.
- Controlled mode on the React surface is the standard `value` + change-handler mapping onto the element (§4 strict semantics, enforced by the element; the wrapper adds NO value-clamping logic).
- The ТЖ payload-unwrap bridge (the bank's `kit-component.ts` mold) `[OPEN — first stateful ТЖ component (16.1 freeze)]`.

### Overlay usage API (inherited shape; the ТЖ instance is the rail's burger drawer)

- **Declarative-first.** An overlay surface is a normal element in the DOM tree whose open state is the `open` attribute/property plus an `open-change` event (`detail: { value: boolean }`, composed, bubbles). Content lives in SLOTS; the consumer owns the open state.
- **Imperative helpers ONLY for inherently imperative surfaces** (fire-and-forget notifications with nothing in the consumer's tree) — built on the SAME elements and events, never a parallel API.
- **The drawer ruling (AD-12 v5):** the ТЖ roster's only overlay-class surface is the rail's burger drawer. It gets a small ТЖ-owned overlay helper (mount + focus trap + scroll lock) inside THIS package — a deliberate, documented duplication of the bank controller's contract; importing `pillkit-components` would break FR-17. The helper's exact surface `[OPEN — first stateful ТЖ component (16.1 freeze)]`. REVISIT trigger: a second ТЖ overlay surface → extract a shared `pillkit-overlays` package consumed by both families as a peer.
- Z-order only via `--tj-z-*` tokens `[OPEN — 15.2 token story decides the ТЖ z-scale]`.

### Exception log

| Date | Component | Deviation | Rationale |
|---|---|---|---|
| — | — | — | Empty at seed (story 15.1). First entry lands with the first ТЖ component PR. |

## Naming quick-reference (inherited grammar, ТЖ namespace)

- Elements `tj-` prefix kebab-case (`tj-news-card`), classes `Tj` + PascalCase; one directory per component under `src/<name>/` with `index.ts`, styles module, `<name>.test.ts`, `<name>.stories.ts`.
- Value updates `<prop>-change` with `detail: { value }`; occurrences bare `<verb>`; kit events always `composed: true, bubbles: true`.
- Theming ONLY via `var(--tj-*)` tokens; per-component hooks follow `--tj-<component>-<slot>`; dark mode via the `[data-tj-theme="dark"]` token layer — zero component-level theme branches. No ТЖ component reads `--tk-*` and no bank component reads `--tj-*` (AD-2 v5).
