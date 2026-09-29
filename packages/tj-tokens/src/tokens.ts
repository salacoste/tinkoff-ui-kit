/**
 * pillkit-tj-tokens — typed token maps (generated).
 *
 * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens:tj`.
 * Source of truth: _bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md
 * (frontmatter blocks; the z-scale is scaffold mechanics authored at 16.5 — the drawer opener).
 * Values mirror src/tokens.css — see src/TOKENS.md for the canonical listing
 * with assumption flags and rationale.
 */

/** Color tokens — direct semantic keys + the link/engage aliases (values: DESIGN.md `colors`). */
export const colorTokens = {
  '--tj-color-ink-100': '#000000',
  '--tj-color-ink-200': '#333333',
  '--tj-color-ink-300': '#6E6E6E',
  '--tj-color-ink-reference-meta': '#A6A6A6',
  '--tj-color-ink-reference-time': '#808080',
  '--tj-color-page': '#F0F0F0',
  '--tj-color-card': '#FFFFFF',
  '--tj-color-divider': '#E5E5E5',
  '--tj-color-divider-strong': '#A6A6A6',
  '--tj-color-gold': '#C79637',
  '--tj-color-gold-ink': '#8A6519',
  '--tj-color-link-body': '#1414CC',
  '--tj-color-badge-purple': '#8054FF',
  '--tj-color-chip-ink': '#FFFFFF',
  '--tj-color-chip-fill': '#6E48DB',
  '--tj-color-cta-fill': '#333333',
  '--tj-color-cta-ink': '#FFFFFF',
  '--tj-color-focus-ring': '#8A8AE5',
  '--tj-color-link': '#1414CC',
  '--tj-color-engage': '#A6A6A6',
} as const;

/** Dark-layer color tokens — the semantic overrides re-declared on `[data-tj-theme="dark"]` and the native auto leg (sources: DESIGN.md `dark-*` palette — the reference's own dark values). Not spread into `tokens`: the light layer stays the single name registry. */
export const darkColorTokens = {
  '--tj-color-page': '#12151C',
  '--tj-color-card': '#20232A',
  '--tj-color-divider': '#3E4146',
  '--tj-color-divider-strong': '#D0D0D2',
  '--tj-color-ink-100': '#FFFFFF',
  '--tj-color-ink-300': '#D0D0D2',
  '--tj-color-ink-reference-meta': '#D0D0D2',
  '--tj-color-cta-fill': '#F5F5F9',
  '--tj-color-cta-ink': '#000000',
  '--tj-color-link': '#93A2FF',
  '--tj-color-engage': '#717277',
  '--tj-color-link-body': '#93A2FF',
  '--tj-color-focus-ring': '#828BBB',
} as const;

/** Typography tokens — per-slot size/weight/leading plus the family slots (values: DESIGN.md `typography`; the Graphik/Charter string slots, FR-20). */
export const typographyTokens = {
  '--tj-text-display-featured-size': '55px',
  '--tj-text-display-featured-weight': '700',
  '--tj-text-display-featured-leading': '1.1',
  '--tj-text-article-h1-size': '45px',
  '--tj-text-article-h1-weight': '700',
  '--tj-text-article-h1-leading': '50px',
  '--tj-text-rubric-h1-size': '38px',
  '--tj-text-rubric-h1-weight': '700',
  '--tj-text-rubric-h1-leading': '45px',
  '--tj-text-article-h2-size': '38px',
  '--tj-text-article-h2-weight': '700',
  '--tj-text-article-h2-leading': '45px',
  '--tj-text-pro-h1-size': '32px',
  '--tj-text-pro-h1-weight': '700',
  '--tj-text-hero-title-size': '21px',
  '--tj-text-hero-title-weight': '700',
  '--tj-text-hero-title-leading': '25px',
  '--tj-text-section-h2-size': '21px',
  '--tj-text-section-h2-weight': '700',
  '--tj-text-news-title-size': '24px',
  '--tj-text-news-title-weight': '700',
  '--tj-text-news-title-leading': '30px',
  '--tj-text-card-title-size': '17px',
  '--tj-text-card-title-weight': '400',
  '--tj-text-article-lead-size': '27px',
  '--tj-text-article-lead-weight': '400',
  '--tj-text-article-lead-leading': '35px',
  '--tj-text-article-body-size': '21px',
  '--tj-text-article-body-weight': '400',
  '--tj-text-article-body-leading': '30px',
  '--tj-text-pull-quote-size': '35px',
  '--tj-text-pull-quote-weight': '400',
  '--tj-text-pull-quote-leading': '50px',
  '--tj-text-time-meta-size': '15px',
  '--tj-text-time-meta-weight': '400',
  '--tj-text-byline-size': '15px',
  '--tj-text-byline-weight': '700',
  '--tj-text-byline-leading': '20px',
  '--tj-text-cta-label-size': '15px',
  '--tj-text-cta-label-weight': '400',
  '--tj-text-cta-label-leading': '20px',
  '--tj-text-nav-label-size': '17px',
  '--tj-text-nav-label-weight': '700',
  '--tj-text-body-link-size': '21px',
  '--tj-text-body-link-weight': '400',
  '--tj-font-ui': 'Graphik, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif',
  '--tj-font-reading': 'Charter, "Bitstream Charter", "PT Serif", Georgia, serif',
} as const;

/** Radius tokens (values: DESIGN.md `rounded`). */
export const radiusTokens = {
  '--tj-radius-input': '4px',
  '--tj-radius-control-xs': '8px',
  '--tj-radius-cta': '5px',
  '--tj-radius-cta-promo': '10px',
  '--tj-radius-control-sm': '15px',
  '--tj-radius-chip': '20px',
  '--tj-radius-card': '25px',
  '--tj-radius-panel': '30px',
  '--tj-radius-icon-tile': '7px',
  '--tj-radius-badge': '50%',
  '--tj-radius-full': '9999px',
} as const;

/** Spacing tokens — 4-based scale + ТЖ layout anchors (values: DESIGN.md `spacing`). */
export const spaceTokens = {
  '--tj-space-4': '4px',
  '--tj-space-8': '8px',
  '--tj-space-12': '12px',
  '--tj-space-16': '16px',
  '--tj-space-20': '20px',
  '--tj-space-24': '24px',
  '--tj-space-32': '32px',
  '--tj-space-40': '40px',
  '--tj-space-48': '48px',
  '--tj-space-64': '64px',
  '--tj-space-column-reading': '764px',
  '--tj-space-column-reading-body': '760px',
  '--tj-space-rail-sidebar': '290px',
  '--tj-space-column-main': '770px',
  '--tj-space-header-h': '72px',
  '--tj-space-container': '1200px',
} as const;

/** Shadow tokens — the single overlay shadow; FLAT language (values: DESIGN.md `shadows`). */
export const shadowTokens = {
  '--tj-shadow-overlay': '0 2px 8px rgba(0,0,0,.1)',
} as const;

/** Motion tokens — expressive/productive curves and the duration scale (values: DESIGN.md `motion`). */
export const motionTokens = {
  '--tj-motion-curve-expressive-standard': 'cubic-bezier(0.4,0.1,0.2,1)',
  '--tj-motion-curve-expressive-entrance': 'cubic-bezier(0.35,1.3,0.25,1)',
  '--tj-motion-curve-expressive-exit': 'cubic-bezier(0.4,0,1,1)',
  '--tj-motion-curve-productive-standard': 'cubic-bezier(0.2,0,0.4,0.9)',
  '--tj-motion-curve-standard': 'cubic-bezier(0.42,0,0.58,1)',
  '--tj-motion-duration-fastest': '75ms',
  '--tj-motion-duration-micro': '100ms',
  '--tj-motion-duration-fast': '150ms',
  '--tj-motion-duration-moderate': '300ms',
  '--tj-motion-duration-slow': '500ms',
} as const;

/** Z-scale — overlay stacking order (Story 16.5); scaffold mechanics fixed by the AD-12 usage ruling, not a DESIGN.md extraction. */
export const zTokens = {
  '--tj-z-nav': '100',
  '--tj-z-drawer': '300',
} as const;

/** Every --tj-* custom property emitted by the light layer. */
export const tokens = {
  ...colorTokens,
  ...typographyTokens,
  ...radiusTokens,
  ...spaceTokens,
  ...shadowTokens,
  ...motionTokens,
  ...zTokens,
} as const;

/** Union of every token custom-property name. */
export type TokenName = keyof typeof tokens;

/** Union of every token value (CSS custom property values are strings). */
export type TokenValue = (typeof tokens)[TokenName];
