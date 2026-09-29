/**
 * pillkit-tj-components — Lit custom elements core for the ТЖ sub-kit.
 *
 * Story 16.1 — the reading primitives: tj-prose (the reading column),
 * tj-link (the chrome text link), tj-cta (the anchor CTA). Story 16.2+16.3 —
 * the feed surfaces: tj-rubric-header (the rubric landing head),
 * tj-news-card (the single-link feed card), tj-tag-chip (the purple-field
 * nav chip). One directory per component under `src/<name>/` (the bank
 * layout mold); the Custom Elements Manifest (custom-elements.json,
 * `gen:manifest`) and the React wrappers it feeds (packages/tj-react)
 * describe exactly this surface.
 *
 * All six are STATELESS display/link surfaces (the event-map no-entry
 * ruling, packages/tj-react/src/event-map.ts) — no channel, no controlled
 * pair, nothing dispatches.
 */
export * from './tj-cta/index.js';
export * from './tj-link/index.js';
export * from './tj-news-card/index.js';
export * from './tj-prose/index.js';
export * from './tj-rubric-header/index.js';
export * from './tj-tag-chip/index.js';
