/**
 * Owned event registry — ТЖ instance (AD-1 v5): maps `<tag>` → { React prop
 * name → native event name } for the `events` option of `@lit/react`'s
 * createComponent.
 *
 * EMPTY AT THE 16.1 FREEZE BY DESIGN (spec 16.1, the freeze ruling recorded
 * in packages/tj-components/CONVENTIONS.md §9): the reading-primitives roster
 * (tj-prose / tj-link / tj-cta) is stateless display/link surface — tj-link
 * and tj-cta render native anchors and ride the native composed `click`;
 * tj-prose is a container that dispatches nothing. No speculative events are
 * minted at a freeze (the bank tk-button no-entry precedent at its v1).
 *
 * THE FIRST ENTRY LANDED AT 16.4 (the first stateful ТЖ surface): tj-composer
 * — the fake-input community card — dispatches `open-compose` (occurrence,
 * §3 bare verb, NO payload: `detail` stays null, so the unwrap contract
 * passes the TjOpenComposeEvent itself to React handlers). The machinery
 * predicted at 16.1 is now proven by the populated case: append an entry,
 * re-run `pnpm gen`, and the wrappers pick the prop up at RUNTIME via
 * createKitComponent (packages/tj-react/src/kit-component.ts) — generated
 * wrapper files do NOT change when the registry grows.
 *
 * Kit custom events follow the inherited §3 grammar: `<prop>-change` for
 * value updates with `detail: { value }` payloads, bare `<verb>` for
 * occurrences; all kit custom events dispatch with `composed: true,
 * bubbles: true`. React handlers receive the unwrapped value — never the raw
 * CustomEvent (AD-1; the frozen React-surface contract, CONVENTIONS §9);
 * payload-less occurrences hand the handler the event itself.
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
  'tj-composer': {
    // 16.4 — the FIRST ТЖ entry: activation (click/Enter/Space on the real
    // shadow button) dispatches the payload-less occurrence; the consumer
    // opens THEIR editor (the kit never renders one). TjOpenComposeEvent
    // naming (CONVENTIONS §4, re-opened on the ТЖ instance at 16.4).
    onOpenCompose: 'open-compose',
  },
  //
  // 'tj-prose': none at 16.1 — STATELESS READING CONTAINER: pure flow
  // typography for slotted content; nothing dispatches.
  // 'tj-link': none at 16.1 — STATELESS CHROME LINK: navigation is the
  // native anchor's own behavior; the element dispatches nothing.
  // 'tj-cta': none at 16.1 — STATELESS ANCHOR CTA: same native-anchor
  // ruling as tj-link; nothing dispatches.
  // 'tj-news-card' / 'tj-rubric-header' / 'tj-tag-chip': none at 16.3 —
  // stateless reading/feed surface (the 16.3 no-entry freeze).
  // 'tj-post-card': none at 16.4 — TRANSPARENT cell on the news-card anchor
  // mold: navigation is the native anchor's own behavior; nothing dispatches.
});
