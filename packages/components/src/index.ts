/**
 * pillkit-components — Lit custom elements core package for tinkoff-ui-kit.
 *
 * One directory per component under `src/<name>/`; this entry re-exports the
 * public surface of every component. The Custom Elements Manifest
 * (`custom-elements.json`, generated via `pnpm gen:manifest`) and the React
 * wrappers it feeds (packages/react, `pnpm gen`) stay in sync with these
 * exports.
 */
export * from './button/index.js';
export * from './input/index.js';
