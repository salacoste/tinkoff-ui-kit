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
  // 'tk-button': none at v1 (native click serves activation).
});
