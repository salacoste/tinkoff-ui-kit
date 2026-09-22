/**
 * @tk-kit/react — React adapters for tinkoff-ui-kit.
 *
 * Wrappers are GENERATED from the Custom Elements Manifest of
 * `@tk-kit/components` via `@lit/react`'s createComponent, driven by the
 * owned event registry (`./event-map.js`). Regenerate with `pnpm gen`
 * (root); `pnpm check:gen` fails on unregenerated output. No behavior,
 * styling, or a11y logic lives in this package (AD-1) — the Lit core owns
 * all three.
 */
export * from './generated/index.js';
export { EVENT_MAP } from './event-map.js';
export type { TkKitElementEventMap } from './event-map.js';
