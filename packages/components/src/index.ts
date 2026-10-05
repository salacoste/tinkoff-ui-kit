/**
 * pillkit-components — Lit custom elements core package for tinkoff-ui-kit.
 *
 * One directory per component under `src/<name>/`; this entry re-exports the
 * public surface of every component. The Custom Elements Manifest
 * (`custom-elements.json`, generated via `pnpm gen:manifest`) and the React
 * wrappers it feeds (packages/react, `pnpm gen`) stay in sync with these
 * exports.
 */
export * from './accordion/index.js';
export * from './article-card/index.js';
export * from './avatar/index.js';
export * from './badge/index.js';
export * from './breadcrumb/index.js';
export * from './button/index.js';
export * from './carousel/index.js';
export * from './chart/index.js';
export * from './checkbox/index.js';
export * from './combobox-search/index.js';
export * from './cookie-banner/index.js';
export * from './data-table/index.js';
export * from './empty-state/index.js';
export * from './feature-card/index.js';
export * from './filter-chips/index.js';
export * from './footer/index.js';
export * from './input/index.js';
export * from './instrument-hero/index.js';
export * from './kv-list/index.js';
export * from './link/index.js';
export * from './menu-popover/index.js';
export * from './modal/index.js';
export * from './navbar/index.js';
export * from './note/index.js';
export * from './pagination/index.js';
export * from './progress-bar/index.js';
export * from './promo-card/index.js';
export * from './range-slider/index.js';
export * from './figure/index.js';
export * from './publisher-header/index.js';
export * from './quote-chip/index.js';
export * from './qr-block/index.js';
export * from './rating/index.js';
export * from './segmented-radio/index.js';
export * from './select/index.js';
export * from './service-card/index.js';
export * from './skeleton/index.js';
export * from './stepper/index.js';
export * from './store-badges/index.js';
export * from './switch/index.js';
export * from './tabs/index.js';
export * from './textarea/index.js';
export * from './thumbnail-picker/index.js';
export * from './toast/index.js';
export * from './tooltip/index.js';
// Overlays — the shared controller module (Story 2.2), NOT an element: no
// wrapper is generated for it (CONVENTIONS §9 binds floating components to
// consume these capabilities; AD-12). Selective exports by design: only the
// capability functions and their types; module-internal constants (container
// and stack ids, the max-visible count) stay inside src/overlays/.
export {
  mountOverlay,
  lockBodyScroll,
  computeFloatingPosition,
  positionFloating,
  enqueueToast,
  trapFocus,
} from './overlays/index.js';
export type {
  TkOverlayHandle,
  TkOverlayLayer,
  TkOverlayMountStrategy,
  TkScrollLockHandle,
  TkComputeOptions,
  TkFloatingPosition,
  TkPlacement,
  TkPositionFloatingOptions,
  TkPositioningHandle,
  TkRect,
  TkViewport,
  TkToastHandle,
  TkToastOptions,
  TkFocusTrapHandle,
  TkFocusTrapOptions,
  TkInitialFocusTarget,
} from './overlays/index.js';
