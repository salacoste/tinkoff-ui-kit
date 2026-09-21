# @tk-kit/tokens — canonical token listing

GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.

- Source of truth: `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` frontmatter — blocks `colors`, `typography`, `rounded`, `spacing`, `shadows`, `motion`.
- The `components:` frontmatter block is consumer spec prose — never rendered.
- The z-scale is scaffold mechanics, not an extraction (own section below).
- Dark values (the `dark-*` color entries) are **not** part of the light layer — Story 1.3 emits the dark layer on `[data-theme="dark"]` (see "Deferred to the dark layer").
- `[ASSUMPTION]` flags ship with their values (DESIGN.md body marks them); they are resolved by Stories 3.6/5.6, never silently dropped.

Light layer: **128 tokens** on `:host, :root` (colors 42, typography 42, radius 7, spacing 14, shadows 6, motion 11, z-scale 6).

## Colors

Light entries from the `colors` block: brand/ink/gray/lightblue/functional scales, AA-adjusted semantic aliases, card tints.

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-color-yellow-100` | `#FFDD2D` |  |
| `--tk-color-yellow-200` | `#FCC521` |  |
| `--tk-color-yellow-300` | `#FAB619` |  |
| `--tk-color-ink-100` | `#909090` |  |
| `--tk-color-ink-200` | `#666666` |  |
| `--tk-color-ink-300` | `#333333` |  |
| `--tk-color-ink-400` | `#000000` |  |
| `--tk-color-gray-100` | `#F5F5F6` |  |
| `--tk-color-gray-200` | `#E7E8EA` |  |
| `--tk-color-gray-300` | `#CBCFD3` |  |
| `--tk-color-gray-400` | `#959BA4` |  |
| `--tk-color-gray-500` | `#79818C` |  |
| `--tk-color-gray-600` | `#616871` |  |
| `--tk-color-lightblue-100` | `#ECF1F7` |  |
| `--tk-color-lightblue-200` | `#E4EBF3` |  |
| `--tk-color-lightblue-300` | `#DDE4ED` |  |
| `--tk-color-blue-100` | `#1771E6` |  |
| `--tk-color-blue-200` | `#1464CC` |  |
| `--tk-color-blue-300` | `#0953B3` |  |
| `--tk-color-green-100` | `#39B54A` |  |
| `--tk-color-green-200` | `#2CA53A` |  |
| `--tk-color-green-300` | `#168821` |  |
| `--tk-color-red-100` | `#E01F19` |  |
| `--tk-color-red-200` | `#D3120E` |  |
| `--tk-color-red-300` | `#C40B08` |  |
| `--tk-color-white` | `#FFFFFF` |  |
| `--tk-color-surface-base` | `#FFFFFF` |  |
| `--tk-color-surface-muted` | `#F5F5F6` |  |
| `--tk-color-surface-field` | `#ECF1F7` |  |
| `--tk-color-border-default` | `#E7E8EA` |  |
| `--tk-color-border-strong` | `#CBCFD3` |  |
| `--tk-color-text-primary` | `#333333` |  |
| `--tk-color-text-secondary` | `#616871` | AA override — gray-600 `#616871` replaces the extracted `#79818C` (gray-500, 3.94:1 on white fails 4.5:1; `#616871` = 5.64:1). DESIGN.md Colors. |
| `--tk-color-text-muted` | `#959BA4` | Restricted: placeholder/disabled/non-essential text only — `#959BA4` fails AA for body text. DESIGN.md Colors. |
| `--tk-color-text-on-primary` | `#333333` |  |
| `--tk-color-focus-ring` | `#1771E6` | AA override — unified `blue-100` ring at 2px offset 2px (the reference ink-on-ink ring is invisible; border-default = 1.23:1). DESIGN.md Colors. |
| `--tk-color-link-on-tint` | `#1464CC` | AA addition — `blue-200` for links on tinted/field surfaces (blue-100 = 4.07:1 on field, fails). DESIGN.md Colors. |
| `--tk-color-tint-gray` | `#F5F5F6` |  |
| `--tk-color-tint-bluegray` | `#ECF1F7` |  |
| `--tk-color-tint-mint` | `#E2F1EC` | [ASSUMPTION] vision-inventory estimate pending build-time capture verification — resolved by Stories 3.6/5.6. DESIGN.md Colors. |
| `--tk-color-tint-beige` | `#F5EFE6` | [ASSUMPTION] vision-inventory estimate pending build-time capture verification — resolved by Stories 3.6/5.6. DESIGN.md Colors. |
| `--tk-color-tint-charcoal` | `#333333` |  |

## Typography

Per-slot tokens from the `typography` block: `--tk-text-<slot>-size` / `-weight` always; `-leading` and `-tracking` where DESIGN.md declares them (bold variants reuse their base slot's leading at usage; caps-s renders uppercase at usage — no `text-transform` in tokens, per DESIGN.md Typography).

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-text-heading-1-size` | `50px` | first family is a consumer-supplied brand-font slot (OQ-2) |
| `--tk-text-heading-1-weight` | `700` |  |
| `--tk-text-heading-1-leading` | `1.1` |  |
| `--tk-text-heading-2-size` | `44px` |  |
| `--tk-text-heading-2-weight` | `700` |  |
| `--tk-text-heading-2-leading` | `1.15` |  |
| `--tk-text-heading-3-size` | `36px` |  |
| `--tk-text-heading-3-weight` | `500` |  |
| `--tk-text-heading-3-leading` | `1.2` |  |
| `--tk-text-heading-4-size` | `28px` |  |
| `--tk-text-heading-4-weight` | `500` |  |
| `--tk-text-heading-4-leading` | `1.25` |  |
| `--tk-text-heading-5-size` | `24px` |  |
| `--tk-text-heading-5-weight` | `500` |  |
| `--tk-text-heading-5-leading` | `1.3` |  |
| `--tk-text-heading-6-size` | `20px` |  |
| `--tk-text-heading-6-weight` | `500` |  |
| `--tk-text-heading-6-leading` | `1.35` |  |
| `--tk-text-body-l-size` | `17px` |  |
| `--tk-text-body-l-weight` | `400` |  |
| `--tk-text-body-l-leading` | `1.5` |  |
| `--tk-text-body-m-size` | `15px` |  |
| `--tk-text-body-m-weight` | `400` |  |
| `--tk-text-body-m-leading` | `1.5` |  |
| `--tk-text-body-s-size` | `13px` |  |
| `--tk-text-body-s-weight` | `400` |  |
| `--tk-text-body-s-leading` | `1.5` |  |
| `--tk-text-body-xs-size` | `12px` |  |
| `--tk-text-body-xs-weight` | `400` |  |
| `--tk-text-body-xs-leading` | `1.45` |  |
| `--tk-text-body-xs-tracking` | `0.4px` |  |
| `--tk-text-body-l-bold-size` | `17px` |  |
| `--tk-text-body-l-bold-weight` | `500` |  |
| `--tk-text-body-m-bold-size` | `15px` |  |
| `--tk-text-body-m-bold-weight` | `500` |  |
| `--tk-text-body-s-bold-size` | `13px` |  |
| `--tk-text-body-s-bold-weight` | `500` |  |
| `--tk-text-caps-s-size` | `12px` | rendered uppercase — see Typography body |
| `--tk-text-caps-s-weight` | `500` |  |
| `--tk-text-caps-s-tracking` | `1px` |  |

### Font family slots

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-font-heading` | `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif` |  |
| `--tk-font-body` | `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif` |  |

The first family of each slot is the **consumer brand-font slot** (OQ-2 — the reference's `dsHeading`/`dsText` are proprietary and never bundled). Point it at a licensed brand font or a metric-compatible open alternative; recommended default: **Inter**. Heading and body slots share DESIGN.md's single fallback stack and are overridden independently.

Override recipe (custom properties cascade and inherit — declare on `body`/your app root, or any later or higher-specificity declaration):

```css
:root { --tk-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; }
```

An override replaces the whole value: re-include the fallback stack so the DESIGN.md fallbacks stay preserved.

## Radius

Two registers per DESIGN.md Shapes: pill-soft marketing (`lg`/`xl`/`xxl`/`full`) and tight-precise app (`xs`/`sm`/`md`) — never mixed within one component.

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-radius-xs` | `4px` |  |
| `--tk-radius-sm` | `8px` |  |
| `--tk-radius-md` | `12px` |  |
| `--tk-radius-lg` | `16px` |  |
| `--tk-radius-xl` | `24px` | [ASSUMPTION] vision-estimated service-card radius — verify at build. Resolved by Stories 3.6/5.6. DESIGN.md Shapes. |
| `--tk-radius-xxl` | `32px` | [ASSUMPTION] vision-estimated feature/promo-card radius — verify at build. Resolved by Stories 3.6/5.6. DESIGN.md Shapes. |
| `--tk-radius-full` | `9999px` |  |

## Spacing

[ASSUMPTION] systematized scale — the reference site exposes no root spacing scale (inline utilities); values follow its grid behavior. DESIGN.md Layout & Spacing.

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-space-4` | `4px` |  |
| `--tk-space-8` | `8px` |  |
| `--tk-space-12` | `12px` |  |
| `--tk-space-16` | `16px` |  |
| `--tk-space-20` | `20px` |  |
| `--tk-space-24` | `24px` |  |
| `--tk-space-32` | `32px` |  |
| `--tk-space-40` | `40px` |  |
| `--tk-space-48` | `48px` |  |
| `--tk-space-64` | `64px` |  |
| `--tk-space-96` | `96px` |  |
| `--tk-space-120` | `120px` |  |
| `--tk-space-container` | `1200px` |  |
| `--tk-space-grid-gap` | `20px` |  |

## Shadows

Light theme shadow layers, used verbatim from the site. Dark theme replaces elevation with tonal surface steps (DESIGN.md Elevation & Depth; Story 1.3).

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-shadow-default` | `0 4px 24px rgba(0,0,0,.12)` |  |
| `--tk-shadow-hover` | `0 12px 36px rgba(0,0,0,.2)` |  |
| `--tk-shadow-modal` | `0 18px 30px rgba(51,51,51,.52)` |  |
| `--tk-shadow-popover` | `0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)` |  |
| `--tk-shadow-dropdown` | `0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)` |  |
| `--tk-shadow-tooltip` | `0 6px 15px rgba(0,0,0,.2)` |  |

## Motion

Durations and curves come exclusively from these tokens (AD-9); everything respects `prefers-reduced-motion: reduce`.

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-motion-curve-expressive-standard` | `cubic-bezier(0.4,0.1,0.2,1)` |  |
| `--tk-motion-curve-expressive-entrance` | `cubic-bezier(0.35,1.3,0.25,1)` |  |
| `--tk-motion-curve-expressive-exit` | `cubic-bezier(0.4,0,1,1)` |  |
| `--tk-motion-curve-productive-standard` | `cubic-bezier(0.2,0,0.4,0.9)` |  |
| `--tk-motion-curve-productive-entrance` | `cubic-bezier(0,0,0.4,0.9)` |  |
| `--tk-motion-curve-productive-exit` | `cubic-bezier(0.2,0,1,1)` |  |
| `--tk-motion-duration-fastest` | `75ms` |  |
| `--tk-motion-duration-fast` | `150ms` |  |
| `--tk-motion-duration-moderate` | `300ms` |  |
| `--tk-motion-duration-slow` | `500ms` |  |
| `--tk-motion-duration-slowest` | `700ms` |  |

Reduced motion is mechanical: under `prefers-reduced-motion: reduce` the stylesheet re-declares every `--tk-motion-duration-*` token to `0ms` on `:host, :root` — theme-independent, because the dark layer re-declares the same duration names. Components pair it with opacity-only fallbacks.

### Motion mapping rationale (AD-9)

| Interaction | Token mapping |
| --- | --- |
| Hover | `--tk-motion-duration-fast` (150ms) |
| Press / active | `--tk-motion-duration-fastest` (75ms) |
| Overlay open/close (Modal, Toast, dropdowns) | `--tk-motion-curve-productive-entrance` / `--tk-motion-curve-productive-exit` |
| Tab and content swaps | `--tk-motion-curve-expressive-standard` |
| Theme switch | 0ms by default (token-layer swap); optional 150ms cross-fade |
| Reduced motion | durations collapse to 0ms, opacity-only fallbacks |

transitions.dev recipes fold onto these tokens at recipe-consumption time (their `:root` selectors never match inside shadow stylesheets) — deferred AD-9 work, see `_bmad-output/implementation-artifacts/deferred-work.md`.

## Z-scale — scaffold mechanics

Not a DESIGN.md extraction. Stacking order is fixed by AD-12 usage: z-order comes only from the `--tk-z-*` scale and the shared overlay controller owns every floating surface — no component implements its own z-index. Values leave one spare slot between layers.

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-z-nav` | `100` | sticky site chrome (Navbar) |
| `--tk-z-dropdown` | `200` | select menus, dropdown menus |
| `--tk-z-popover` | `300` | popovers, floating panels |
| `--tk-z-tooltip` | `400` | tooltips — above the popovers they annotate |
| `--tk-z-modal` | `500` | modal dialogs (focus-trapped) |
| `--tk-z-toast` | `600` | toasts — transient, above modals |

## Deferred to the dark layer (Story 1.3)

These DESIGN.md `colors` entries are dark-theme palette values; the light layer intentionally does not render them. **Override model:** the dark layer re-declares the SEMANTIC names (`--tk-color-surface-base`, `--tk-color-surface-muted`, `--tk-color-text-primary`, …) on `[data-theme="dark"]`; the `dark-*` keys below are the palette SOURCE for that mapping, never the consumed names — components always reference semantic tokens, never `--tk-color-dark-*`. The `dark-tint-*` values are first-pass `[ASSUMPTION]` in DESIGN.md — their flags land with that layer.

- `--tk-color-dark-base`
- `--tk-color-dark-surface-1`
- `--tk-color-dark-surface-2`
- `--tk-color-dark-surface-3`
- `--tk-color-dark-elevated`
- `--tk-color-dark-border`
- `--tk-color-dark-text-primary`
- `--tk-color-dark-text-secondary`
- `--tk-color-dark-text-muted`
- `--tk-color-dark-field`
- `--tk-color-dark-link`
- `--tk-color-dark-error`
- `--tk-color-dark-focus-ring`
- `--tk-color-dark-tint-gray`
- `--tk-color-dark-tint-bluegray`
- `--tk-color-dark-tint-mint`
- `--tk-color-dark-tint-beige`
- `--tk-color-dark-tint-charcoal`
