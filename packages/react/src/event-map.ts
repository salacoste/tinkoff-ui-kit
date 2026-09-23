/**
 * Owned event registry (AD-1): maps `<tag>` → { React prop name → native
 * event name } for the `events` option of `@lit/react`'s createComponent.
 *
 * The generator (`scripts/generate-wrappers.mjs`) routes every wrapper through
 * `createKitComponent` (./kit-component.js), which feeds this map into
 * `@lit/react` AND unwraps the kit payload before the consumer's handler
 * runs — a new component's events are exposed by ADDING an entry here and
 * running `pnpm gen` (registry completeness is a PR-checklist item per
 * CONVENTIONS §3; `pnpm gen && git diff --exit-code` gates regeneration drift
 * only).
 *
 * Kit custom events follow CONVENTIONS §3 (resolved at the 1.7 pilot):
 * `<prop>-change` for value updates with `detail: { value }` payloads,
 * bare `<verb>` for occurrences; all kit custom events dispatch with
 * `composed: true, bubbles: true`. React handlers receive the unwrapped
 * value — never the raw CustomEvent (AD-1, frozen at Story 2.1; see
 * CONVENTIONS §9 «Frozen React-surface API»).
 *
 * Controlled mode on this surface is the standard `value` + change-handler
 * mapping onto the element (strict semantics owned by the element —
 * CONVENTIONS §4); the wrappers add NO value-clamping logic of their own.
 */
export interface TkKitElementEventMap {
  /** React handler prop name (e.g. `onValueChange`) → native event name (e.g. `value-change`). */
  readonly [reactPropName: string]: string;
}

export const EVENT_MAP: Readonly<Record<string, Readonly<TkKitElementEventMap>>> = Object.freeze({
  // Frozen at runtime: new entries are FILE edits, never mutation — `pnpm
  // gen` regenerates the wrappers after any edit.
  'tk-input': {
    onValueChange: 'value-change',
  },
  // Story 2.3 — value-change (the §4 contract) + open-change (the §9 frozen
  // overlay-surface state event every floating surface carries; demanded
  // mechanically by tests/event-map-completeness.test.ts).
  'tk-select': {
    onValueChange: 'value-change',
    onOpenChange: 'open-change',
  },
  // Story 2.4 — the boolean state channel (§4 contract on `checked`;
  // `indeterminate` is visual-only and deliberately carries NO event).
  'tk-checkbox': {
    onCheckedChange: 'checked-change',
  },
  // Story 2.5 — the string state channel (§4 contract on `value`, the same
  // mapping tk-input/tk-select carry; demanded mechanically by
  // tests/event-map-completeness.test.ts).
  'tk-segmented-radio': {
    onValueChange: 'value-change',
  },
  // Story 2.6 — the string state channel (§4 contract on `value`, the same
  // mapping as tk-input/tk-select/tk-segmented-radio; demanded mechanically
  // by tests/event-map-completeness.test.ts).
  'tk-thumbnail-picker': {
    onValueChange: 'value-change',
  },
  // Story 3.3 — the string state channel (§4 contract on `value`, the same
  // mapping as tk-input/tk-select/tk-segmented-radio/tk-thumbnail-picker;
  // demanded mechanically by tests/event-map-completeness.test.ts).
  'tk-tabs': {
    onValueChange: 'value-change',
  },
  // 'tk-button': none at v1 (native click serves activation).
  // 'tk-navbar': none at v3.4 — NAVIGATION, NOT A FORM CONTROL (spec 3.4
  // ruling): `activeValue` is a prop-only input with NO change-event
  // channel (clicks are native anchor navigation), and the burger drawer is
  // INTERNAL UI state (not a consumer channel — no open/open-change, the
  // deliberate §9 deviation the spec itself rules). The completeness
  // guard's no-entry case, mirrored from tk-button.
  // 'tk-footer': none at v3.5 — STATELESS DIRECTORY (spec 3.5): pure
  // landmark layout, nothing dispatches (the completeness guard's no-entry
  // case, mirrored from tk-button).
  // 'tk-link': none at v3.1 — STATELESS (spec 3.1): navigation is the native
  // anchor's own behavior; the element dispatches nothing (the completeness
  // guard's no-entry case, mirrored from tk-button).
  // 'tk-badge': none at v3.2 — STATELESS DISPLAY (spec 3.2): never
  // interactive alone; the element dispatches nothing (the completeness
  // guard's no-entry case, mirrored from tk-button).
  // 'tk-promo-card'/'tk-feature-card'/'tk-service-card'/'tk-article-card':
  // none at v3.6–3.9 — DISPLAY COMPONENTS (specs 3.6–3.9): passive surfaces;
  // the CTA/link carries the action as a native anchor/button inside slots
  // (nothing dispatches — the completeness guard's no-entry case, mirrored
  // from tk-button/tk-footer).
  // 'tk-progress-bar': none at v2.7 — STATELESS DISPLAY (spec 2.7): value is
  // an input, not a channel; the element dispatches nothing (the completeness
  // guard's no-entry case, mirrored from tk-button).
});
