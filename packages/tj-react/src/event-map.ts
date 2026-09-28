/**
 * Owned event registry — ТЖ instance (AD-1 v5): maps `<tag>` → { React prop
 * name → native event name } for the `events` option of `@lit/react`'s
 * createComponent.
 *
 * EMPTY AT THE 16.1 FREEZE, BY DESIGN (spec 16.1, the freeze ruling recorded
 * in packages/tj-components/CONVENTIONS.md §9): the reading-primitives roster
 * (tj-prose / tj-link / tj-cta) is stateless display/link surface — tj-link
 * and tj-cta render native anchors and ride the native composed `click`;
 * tj-prose is a container that dispatches nothing. No speculative events are
 * minted at a freeze (the bank tk-button no-entry precedent at its v1).
 *
 * The registry EXISTS so the first stateful ТЖ surface (16.4+: engagement
 * bar / drawer / theme control) APPENDS an entry here and re-runs `pnpm gen`
 * — the machinery (manifest → wrappers → committed artifacts under
 * check:gen) is proven end-to-end by the empty case: wrappers generate, bind
 * zero events, and stay drift-gated.
 *
 * Kit custom events follow the inherited §3 grammar: `<prop>-change` for
 * value updates with `detail: { value }` payloads, bare `<verb>` for
 * occurrences; all kit custom events dispatch with `composed: true,
 * bubbles: true`. React handlers receive the unwrapped value — never the raw
 * CustomEvent (AD-1; the frozen React-surface contract, CONVENTIONS §9).
 *
 * Controlled mode on this surface is the standard `value` + change-handler
 * mapping onto the element (strict semantics owned by the element — §4);
 * the wrappers add NO value-clamping logic of their own.
 */
export interface TjKitElementEventMap {
  /** React handler prop name (e.g. `onValueChange`) → native event name (e.g. `value-change`). */
  readonly [reactPropName: string]: string;
}

export const EVENT_MAP: Readonly<Record<string, Readonly<TjKitElementEventMap>>> = Object.freeze({
  // Frozen at runtime: new entries are FILE edits, never mutation — `pnpm
  // gen` regenerates the wrappers after any edit.
  //
  // 'tj-prose': none at 16.1 — STATELESS READING CONTAINER: pure flow
  // typography for slotted content; nothing dispatches.
  // 'tj-link': none at 16.1 — STATELESS CHROME LINK: navigation is the
  // native anchor's own behavior; the element dispatches nothing.
  // 'tj-cta': none at 16.1 — STATELESS ANCHOR CTA: same native-anchor
  // ruling as tj-link; nothing dispatches.
});
