/**
 * pillkit-tokens — typed token maps (generated).
 *
 * DO NOT EDIT BY HAND — regenerate with `pnpm gen:tokens`.
 * Source of truth: _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md
 * (frontmatter blocks; the z-scale is scaffold mechanics per AD-3/AD-12).
 * Values mirror src/tokens.css — see src/TOKENS.md for the canonical listing
 * with assumption flags and rationale.
 */

/** Color tokens — scales, light semantic aliases, card tints (values: DESIGN.md `colors`). */
export const colorTokens = {
  '--tk-color-yellow-100': '#FFDD2D',
  '--tk-color-yellow-200': '#FCC521',
  '--tk-color-yellow-300': '#FAB619',
  '--tk-color-ink-100': '#909090',
  '--tk-color-ink-200': '#666666',
  '--tk-color-ink-300': '#333333',
  '--tk-color-ink-400': '#000000',
  '--tk-color-gray-100': '#F5F5F6',
  '--tk-color-gray-200': '#E7E8EA',
  '--tk-color-gray-300': '#CBCFD3',
  '--tk-color-gray-400': '#959BA4',
  '--tk-color-gray-500': '#79818C',
  '--tk-color-gray-600': '#616871',
  '--tk-color-lightblue-100': '#ECF1F7',
  '--tk-color-lightblue-200': '#E4EBF3',
  '--tk-color-lightblue-300': '#DDE4ED',
  '--tk-color-blue-100': '#1771E6',
  '--tk-color-blue-200': '#1464CC',
  '--tk-color-blue-300': '#0953B3',
  '--tk-color-green-100': '#39B54A',
  '--tk-color-green-200': '#2CA53A',
  '--tk-color-green-300': '#168821',
  '--tk-color-red-100': '#E01F19',
  '--tk-color-red-200': '#D3120E',
  '--tk-color-red-300': '#C40B08',
  '--tk-color-white': '#FFFFFF',
  '--tk-color-surface-base': '#FFFFFF',
  '--tk-color-surface-muted': '#F5F5F6',
  '--tk-color-surface-field': '#ECF1F7',
  '--tk-color-border-default': '#E7E8EA',
  '--tk-color-border-strong': '#CBCFD3',
  '--tk-color-text-primary': '#333333',
  '--tk-color-text-secondary': '#616871',
  '--tk-color-text-muted': '#959BA4',
  '--tk-color-text-on-primary': '#333333',
  '--tk-color-focus-ring': '#1771E6',
  '--tk-color-link-on-tint': '#1464CC',
  '--tk-color-tint-gray': '#F5F5F6',
  '--tk-color-tint-bluegray': '#ECF1F7',
  '--tk-color-tint-mint': '#D0F4F2',
  '--tk-color-tint-beige': '#F1EBD6',
  '--tk-color-tint-charcoal': '#333333',
  '--tk-color-delta-positive': '#168821',
  '--tk-color-delta-negative': '#C40B08',
  '--tk-color-border-table': 'rgba(0,16,36,0.12)',
  '--tk-color-surface-row-hover': 'rgba(36,74,127,0.06)',
  '--tk-color-tint-cream': '#F1EEE8',
  '--tk-color-tint-cream-raised': '#E9E0D1',
  '--tk-color-link': '#1771E6',
  '--tk-color-error': '#E01F19',
  '--tk-color-error-on-field': '#D3120E',
} as const;

/** Dark-layer color tokens — the semantic overrides re-declared on `[data-theme="dark"]` (sources: DESIGN.md `dark-*` palette; `border-strong` derived). Not spread into `tokens`: the light layer stays the single name registry. */
export const darkColorTokens = {
  '--tk-color-surface-base': '#1A1A1A',
  '--tk-color-surface-muted': '#222222',
  '--tk-color-surface-field': '#FFFFFF1A',
  '--tk-color-border-default': '#FFFFFF24',
  '--tk-color-border-strong': '#FFFFFF3D',
  '--tk-color-text-primary': '#FFFFFF',
  '--tk-color-text-secondary': '#FFFFFFB3',
  '--tk-color-text-muted': '#FFFFFF80',
  '--tk-color-focus-ring': '#66A3FF',
  '--tk-color-link': '#66A3FF',
  '--tk-color-error': '#FF7B74',
  '--tk-color-link-on-tint': '#66A3FF',
  '--tk-color-error-on-field': '#FF7B74',
  '--tk-color-tint-gray': '#242424',
  '--tk-color-tint-bluegray': '#1E242C',
  '--tk-color-tint-mint': '#1C2A26',
  '--tk-color-tint-beige': '#2A2620',
  '--tk-color-tint-cream': '#232220',
  '--tk-color-tint-cream-raised': '#2B2823',
  '--tk-color-delta-positive': '#39B54A',
  '--tk-color-delta-negative': '#F63434',
  '--tk-color-border-table': '#FFFFFF1F',
  '--tk-color-surface-row-hover': '#FFFFFF1A',
} as const;

/** Typography tokens — per-slot size/weight/leading/tracking plus the family slots (values: DESIGN.md `typography`). */
export const typographyTokens = {
  '--tk-text-heading-1-size': '50px',
  '--tk-text-heading-1-weight': '700',
  '--tk-text-heading-1-leading': '1.1',
  '--tk-text-heading-2-size': '44px',
  '--tk-text-heading-2-weight': '700',
  '--tk-text-heading-2-leading': '1.15',
  '--tk-text-heading-3-size': '36px',
  '--tk-text-heading-3-weight': '500',
  '--tk-text-heading-3-leading': '1.2',
  '--tk-text-heading-4-size': '28px',
  '--tk-text-heading-4-weight': '500',
  '--tk-text-heading-4-leading': '1.25',
  '--tk-text-heading-5-size': '24px',
  '--tk-text-heading-5-weight': '500',
  '--tk-text-heading-5-leading': '1.3',
  '--tk-text-heading-6-size': '20px',
  '--tk-text-heading-6-weight': '500',
  '--tk-text-heading-6-leading': '1.35',
  '--tk-text-body-l-size': '17px',
  '--tk-text-body-l-weight': '400',
  '--tk-text-body-l-leading': '1.5',
  '--tk-text-body-m-size': '15px',
  '--tk-text-body-m-weight': '400',
  '--tk-text-body-m-leading': '1.5',
  '--tk-text-body-s-size': '13px',
  '--tk-text-body-s-weight': '400',
  '--tk-text-body-s-leading': '1.5',
  '--tk-text-body-xs-size': '12px',
  '--tk-text-body-xs-weight': '400',
  '--tk-text-body-xs-leading': '1.45',
  '--tk-text-body-xs-tracking': '0.4px',
  '--tk-text-body-l-bold-size': '17px',
  '--tk-text-body-l-bold-weight': '500',
  '--tk-text-body-m-bold-size': '15px',
  '--tk-text-body-m-bold-weight': '500',
  '--tk-text-body-s-bold-size': '13px',
  '--tk-text-body-s-bold-weight': '500',
  '--tk-text-caps-s-size': '12px',
  '--tk-text-caps-s-weight': '500',
  '--tk-text-caps-s-tracking': '1px',
  '--tk-font-heading': 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif',
  '--tk-font-body': 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif',
} as const;

/** Radius tokens (values: DESIGN.md `rounded`). */
export const radiusTokens = {
  '--tk-radius-xs': '4px',
  '--tk-radius-sm': '8px',
  '--tk-radius-md': '12px',
  '--tk-radius-lg': '16px',
  '--tk-radius-xl': '24px',
  '--tk-radius-xxl': '24px',
  '--tk-radius-full': '9999px',
} as const;

/** Spacing tokens — 4-based scale, container width, grid gap (values: DESIGN.md `spacing`). */
export const spaceTokens = {
  '--tk-space-4': '4px',
  '--tk-space-8': '8px',
  '--tk-space-12': '12px',
  '--tk-space-16': '16px',
  '--tk-space-20': '20px',
  '--tk-space-24': '24px',
  '--tk-space-32': '32px',
  '--tk-space-40': '40px',
  '--tk-space-48': '48px',
  '--tk-space-64': '64px',
  '--tk-space-96': '96px',
  '--tk-space-120': '120px',
  '--tk-space-container': '1200px',
  '--tk-space-grid-gap': '20px',
} as const;

/** Shadow tokens — light semantic shadow layers (values: DESIGN.md `shadows`). */
export const shadowTokens = {
  '--tk-shadow-default': '0 4px 24px rgba(0,0,0,.12)',
  '--tk-shadow-hover': '0 12px 36px rgba(0,0,0,.2)',
  '--tk-shadow-modal': '0 18px 30px rgba(51,51,51,.52)',
  '--tk-shadow-popover': '0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)',
  '--tk-shadow-dropdown': '0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)',
  '--tk-shadow-tooltip': '0 6px 15px rgba(0,0,0,.2)',
} as const;

/** Motion tokens — expressive/productive curves and the duration scale (values: DESIGN.md `motion`). */
export const motionTokens = {
  '--tk-motion-curve-expressive-standard': 'cubic-bezier(0.4,0.1,0.2,1)',
  '--tk-motion-curve-expressive-entrance': 'cubic-bezier(0.35,1.3,0.25,1)',
  '--tk-motion-curve-expressive-exit': 'cubic-bezier(0.4,0,1,1)',
  '--tk-motion-curve-productive-standard': 'cubic-bezier(0.2,0,0.4,0.9)',
  '--tk-motion-curve-productive-entrance': 'cubic-bezier(0,0,0.4,0.9)',
  '--tk-motion-curve-productive-exit': 'cubic-bezier(0.2,0,1,1)',
  '--tk-motion-duration-fastest': '75ms',
  '--tk-motion-duration-fast': '150ms',
  '--tk-motion-duration-moderate': '300ms',
  '--tk-motion-duration-slow': '500ms',
  '--tk-motion-duration-slowest': '700ms',
} as const;

/** Z-scale — overlay stacking order; scaffold mechanics fixed by AD-12 usage, not a DESIGN.md extraction. */
export const zTokens = {
  '--tk-z-nav': '100',
  '--tk-z-dropdown': '200',
  '--tk-z-popover': '300',
  '--tk-z-tooltip': '400',
  '--tk-z-modal': '500',
  '--tk-z-toast': '600',
} as const;

/** Every --tk-* custom property emitted by the light layer. */
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
