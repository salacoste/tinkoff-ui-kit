/**
 * pillkit-react — React adapters for tinkoff-ui-kit.
 *
 * Wrappers are GENERATED from the Custom Elements Manifest of
 * `pillkit-components` via `@lit/react`'s createComponent, driven by the
 * owned event registry (`./event-map.js`). Regenerate with `pnpm gen`
 * (root); `pnpm check:gen` fails on unregenerated output.
 *
 * Component behavior, styling, and a11y logic NEVER live in this package
 * (AD-1) — the Lit core owns all three. The package owns exactly one piece
 * of runtime: the payload-unwrap bridge (`./kit-component.js`) that delivers
 * the unwrapped `detail.value` to React handlers instead of the raw
 * CustomEvent — the frozen React-surface contract (CONVENTIONS §9,
 * frozen at Story 2.1).
 */
export * from './generated/index.js';
export { EVENT_MAP } from './event-map.js';
export type { TkKitElementEventMap } from './event-map.js';
