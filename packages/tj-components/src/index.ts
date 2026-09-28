/**
 * pillkit-tj-components — Lit custom elements core for the ТЖ sub-kit.
 *
 * Story 16.1 — the reading primitives: tj-prose (the reading column),
 * tj-link (the chrome text link), tj-cta (the anchor CTA). One directory
 * per component under `src/<name>/` (the bank layout mold); the Custom
 * Elements Manifest (custom-elements.json, `gen:manifest`) and the React
 * wrappers it feeds (packages/tj-react) describe exactly this surface.
 *
 * All three are STATELESS display/link surface (the event-map no-entry
 * ruling, packages/tj-react/src/event-map.ts) — no channel, no controlled
 * pair, nothing dispatches.
 */
export * from './tj-cta/index.js';
export * from './tj-link/index.js';
export * from './tj-prose/index.js';
