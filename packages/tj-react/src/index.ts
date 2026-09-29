/**
 * pillkit-tj-react — React adapters for the ТЖ sub-kit of pillkit.
 *
 * Wrappers are GENERATED from the Custom Elements Manifest of
 * `pillkit-tj-components` via `@lit/react`'s createComponent, driven by the
 * ТЖ-owned event registry (`./event-map.js`). Regenerate with `pnpm gen`
 * (root); `pnpm check:gen` fails on unregenerated output.
 *
 * Component behavior, styling, and a11y logic NEVER live in this package
 * (AD-1 v5) — the Lit core owns all three. The package owns exactly one
 * piece of runtime: the payload-unwrap bridge (`./kit-component.js`, a
 * documented FR-17-driven duplication of the bank contract) that delivers
 * the unwrapped `detail.value` to React handlers instead of the raw
 * CustomEvent. The registry OPENED at 16.4: tj-composer's `open-compose`
 * (payload-less occurrence — handlers receive the TjOpenComposeEvent
 * itself) is the first ТЖ entry; the seven stateless wrappers still bind
 * zero events. Future entries are file edits + `pnpm gen`.
 */
export * from './generated/index.js';
export { EVENT_MAP } from './event-map.js';
export type { TjKitElementEventMap } from './event-map.js';
