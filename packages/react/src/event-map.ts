/**
 * Owned event registry (AD-1): maps `<tag>` → { React prop name → native
 * event name } for the `events` option of `@lit/react`'s createComponent.
 *
 * The generator (`scripts/generate-wrappers.mjs`) wires
 * `events: EVENT_MAP['<tag>'] ?? {}` into every generated wrapper — a new
 * component's events are exposed by ADDING an entry here and running
 * `pnpm gen` (registry completeness is a PR-checklist item per CONVENTIONS
 * §3; `pnpm gen && git diff --exit-code` gates regeneration drift only).
 *
 * Kit custom events follow CONVENTIONS §3 (resolved at the 1.7 pilot):
 * `<prop>-change` for value updates with `detail: { value }` payloads,
 * bare `<verb>` for occurrences; all kit custom events dispatch with
 * `composed: true, bubbles: true`. React handlers receive the unwrapped
 * value via the payload — never the raw CustomEvent (frozen at Story 2.1).
 *
 * tk-button has NO custom events at v1: the native `click` (composed,
 * bubbles) serves activation — occurrence events arrive with the first
 * component that needs one.
 */
export interface TkKitElementEventMap {
  /** React handler prop name (e.g. `onValueChange`) → native event name (e.g. `value-change`). */
  readonly [reactPropName: string]: string;
}

export const EVENT_MAP: Readonly<Record<string, Readonly<TkKitElementEventMap>>> = Object.freeze({
  // 'tk-button': {} — none at v1 (native click only); entries land with the
  // first component that emits kit custom events (e.g. Input's value-change).
  // Frozen at runtime: new entries are FILE edits, never mutation — `pnpm
  // gen` regenerates the wrappers after any edit.
});
