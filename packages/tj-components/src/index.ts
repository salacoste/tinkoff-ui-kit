/**
 * pillkit-tj-components — Lit custom elements core for the ТЖ sub-kit.
 *
 * Story 16.1 — the reading primitives: tj-prose (the reading column),
 * tj-link (the chrome text link), tj-cta (the anchor CTA). Story 16.2+16.3 —
 * the feed surfaces: tj-rubric-header (the rubric landing head),
 * tj-news-card (the single-link feed card), tj-tag-chip (the purple-field
 * nav chip). Story 16.4 — the community surfaces: tj-composer (the
 * fake-input button card — the FIRST stateful ТЖ surface, its open-compose
 * occurrence opens the event-map), tj-post-card (the transparent community
 * cell). Story 16.5 — the site chrome: tj-header (the sticky bar + the
 * stateless theme cycle), tj-rail (the section rail + the burger drawer)
 * plus the AD-12 overlay helper (mountSheet/lockScroll/trapFocus — a
 * framework-agnostic MODULE, not a custom element; excluded from the
 * Custom Elements Manifest, exported here for direct consumers). One
 * directory per component under `src/<name>/` (the bank layout mold); the
 * Custom Elements Manifest (custom-elements.json, `gen:manifest`) and the
 * React wrappers it feeds (packages/tj-react) describe exactly this surface.
 *
 * Eight of the ten elements are STATELESS display/link surfaces (the
 * event-map no-entry ruling, packages/tj-react/src/event-map.ts) — no
 * channel, no controlled pair, nothing dispatches. The exceptions:
 * tj-composer (stateless in ELEMENT state, event-bearing — the payload-less
 * open-compose occurrence) and the 16.5 chrome pair — tj-header's theme
 * control (the theme-change occurrence; the element itself stays stateless)
 * and tj-rail's drawer (the reflected `open` + open-change channel, the
 * CONVENTIONS §9 overlay row).
 */
export * from './overlays/index.js';
export * from './tj-composer/index.js';
export * from './tj-cta/index.js';
export * from './tj-header/index.js';
export * from './tj-link/index.js';
export * from './tj-news-card/index.js';
export * from './tj-post-card/index.js';
export * from './tj-prose/index.js';
export * from './tj-rail/index.js';
export * from './tj-rubric-header/index.js';
export * from './tj-tag-chip/index.js';
