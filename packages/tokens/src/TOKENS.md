# pillkit-tokens — canonical token listing

GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.

- Source of truth: `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` frontmatter — blocks `colors`, `typography`, `rounded`, `spacing`, `shadows`, `motion`.
- The `components:` frontmatter block is consumer spec prose — never rendered.
- The z-scale is scaffold mechanics, not an extraction (own section below).
- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tk-color-dark-*` custom properties.
- All `[ASSUMPTION]` flags are RESOLVED (mint/beige tints — Story 3.6; dark tints — 5.4; xxl/xl radii + the spacing systematization — 5.6): every flagged value was verified against the archived captures and now carries a `Verified —` annotation; none was silently dropped.

Light layer: **131 tokens** on `:host, :root` (colors 45, typography 42, radius 7, spacing 14, shadows 6, motion 11, z-scale 6) plus the dark layer: **17 semantic overrides + 6 shadow-none re-declarations** on `[data-theme="dark"]`.

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
| `--tk-color-tint-mint` | `#D0F4F2` | Verified — Story 3.6 closure: measured `#D0F4F2` on the reference ОСАГО card (computed style + native-zoom crop, Story 2.0 capture pack), replacing the vision-inventory estimate. DESIGN.md Colors. |
| `--tk-color-tint-beige` | `#F1EBD6` | Verified — Story 3.6 closure: measured `#F1EBD6` on the reference Т-Образование card (computed style + native-zoom crop, Story 2.0 capture pack), replacing the vision-inventory estimate. DESIGN.md Colors. |
| `--tk-color-tint-charcoal` | `#333333` |  |
| `--tk-color-link` | `#1771E6` | Semantic alias — `blue-100`, added in Story 1.3: components consume semantics, not scales (AD-2/AD-3), and the dark layer needs a semantic name to override (`dark-link`). DESIGN.md Colors (TextLink). |
| `--tk-color-error` | `#E01F19` | Semantic alias — `red-100`, added in Story 1.3 alongside `link` so both themes expose error semantics (the dark layer overrides it with `dark-error`). DESIGN.md Colors. |
| `--tk-color-error-on-field` | `#D3120E` | AA addition — `red-200` for errors on field/muted surfaces (red-100 = 4.22:1 on surface-field and 4.40:1 on surface-muted — both fail 4.5:1; red-200 passes). Mirrors the link-on-tint precedent. DESIGN.md Colors. |

## Typography

Per-slot tokens from the `typography` block: `--tk-text-<slot>-size` / `-weight` always; `-leading` and `-tracking` where DESIGN.md declares them (bold variants reuse their base slot's leading at usage; caps-s renders uppercase at usage — no `text-transform` in tokens, per DESIGN.md Typography).

| Token | Value | Notes |
| --- | --- | --- |
| `--tk-text-heading-1-size` | `50px` | Daytona-first stack — bundled licensed renames are the default (maintainer agreements, 2026-09-22; see Typography body) |
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
| `--tk-font-heading` | `DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif` |  |
| `--tk-font-body` | `DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif` |  |

Daytona-first stacks (maintainer license decision, 2026-09-22): the bundled licensed renames are the default. **DaytonaSans** = `Neue Haas Unica W1G` (renamed build, usage + renaming license from Monotype held by the maintainer) ships in `packages/tokens/fonts/` — import `pillkit-tokens/daytona.css` and the slots render it; **DaytonaPragma** = Pragmatica (ParaType, same arrangement) ships at true weights 400/500/700 (Book/Medium/Bold cuts; no SemiBold — 600/700 requests match the 700 face). Both are separately-licensed assets, NOT covered by the package MIT license (`fonts/LICENSE-FONTS.md`). `TinkoffSans` (the site's heading font, `dsHeading`) remains proprietary/unavailable, so DaytonaSans takes the heading role as the closest licensed grotesk. Consumers self-hosting the originals override the slots with the family names first (recipe below, unchanged); the open fallback is **Inter**, then the site-mirroring system chain.

Override recipe (custom properties cascade and inherit — declare on `body`/your app root, or any later or higher-specificity declaration):

```css
:root { --tk-font-body: Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif; }
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
| `--tk-radius-xl` | `24px` | Verified — Story 5.6 closure: pixel-probe of the archived service-card capture (Story 2.0 pack, DPR 1) measures 24px — the arc staircase is pixel-identical to the kit's 24px render; the 3.8 ~24 reading confirmed. DESIGN.md Shapes. |
| `--tk-radius-xxl` | `24px` | Verified — Story 5.6 closure: pixel-probes of the archived card captures measure 22–24px (two sub-signatures within the band — banners 21.9–22.2, tiles 23.5–23.9 — collapsed to one token); the 32px vision estimate is corrected to the measured card radius — xxl equals xl. DESIGN.md Shapes. |
| `--tk-radius-full` | `9999px` |  |

## Spacing

Verified-systematized — Story 5.6 closure: the reference exposes no root spacing scale (inline utilities), so the kit systematizes the 4-based grid; the load-bearing steps are probe-verified at composition (container 1200px, grid-gap 20px, 96–120 section rhythm — Story 3.10 probes). DESIGN.md Layout & Spacing.

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

## Dark layer (Story 1.3)

Setting `data-theme="dark"` on `<html>` re-resolves every SEMANTIC color token — zero markup/class/inline-style changes (AD-3). **Override model:** the dark layer re-declares semantic names only, sourced from the `dark-*` palette keys below; the `dark-*` keys are the palette SOURCE, never the consumed names — components always reference semantic tokens, never `--tk-color-dark-*` (enforced: generation aborts on any unconsumed `dark-*` key). Typography / radius / spacing / motion / z are theme-invariant — the `:host, :root` rules above stay the single source. Theme switch adds no transition (0ms default; an optional 150ms cross-fade is consumer-side, applied on the consumer surface — never in the token layer).

| Token | Light | Dark | Source | Notes |
| --- | --- | --- | --- | --- |
| `--tk-color-surface-base` | `#FFFFFF` | `#1A1A1A` | `colors.dark-base` |  |
| `--tk-color-surface-muted` | `#F5F5F6` | `#222222` | `colors.dark-surface-1` |  |
| `--tk-color-surface-field` | `#ECF1F7` | `#FFFFFF1A` | `colors.dark-field` |  |
| `--tk-color-border-default` | `#E7E8EA` | `#FFFFFF24` | `colors.dark-border` |  |
| `--tk-color-border-strong` | `#CBCFD3` | `#FFFFFF3D` | derived | Derived — DESIGN.md defines no dark border-strong; `#FFFFFF3D` = dark-border `#FFFFFF24` (24-hex ≈ 14% white) lifted +12% toward opaque. Story 1.3 scaffolding decision, not an extraction. |
| `--tk-color-text-primary` | `#333333` | `#FFFFFF` | `colors.dark-text-primary` |  |
| `--tk-color-text-secondary` | `#616871` | `#FFFFFFB3` | `colors.dark-text-secondary` |  |
| `--tk-color-text-muted` | `#959BA4` | `#FFFFFF80` | `colors.dark-text-muted` |  |
| `--tk-color-focus-ring` | `#1771E6` | `#66A3FF` | `colors.dark-focus-ring` |  |
| `--tk-color-link` | `#1771E6` | `#66A3FF` | `colors.dark-link` |  |
| `--tk-color-error` | `#E01F19` | `#FF7B74` | `colors.dark-error` |  |
| `--tk-color-link-on-tint` | `#1464CC` | `#66A3FF` | `colors.dark-link` | Alias — dark reuses `dark-link` (the light-only on-tint step exists because blue-100 fails on light fields). |
| `--tk-color-error-on-field` | `#D3120E` | `#FF7B74` | `colors.dark-error` | Alias — dark reuses `dark-error` (the light-only on-field step exists because red-100 fails on light field/muted surfaces). |
| `--tk-color-tint-gray` | `#F5F5F6` | `#242424` | `colors.dark-tint-gray` | Verified — Story 5.4 dark sweep: Lab L* 14.2, OKLCH L 26.0% C 0.000 (achromatic, like the light tint); held — 1.8 pt under the rule window, inside the 2-pt correction threshold; sits between tonal steps 1–2 (content tint, not elevated chrome). DESIGN.md Colors. |
| `--tk-color-tint-bluegray` | `#ECF1F7` | `#1E242C` | `colors.dark-tint-bluegray` | Verified — Story 5.4 dark sweep: Lab L* 13.9, OKLCH L 25.8%, hue 255.7° vs light 252.8° (Δ2.9° — kept); held — 2.06 pt under the window exceeds the 2-pt threshold by 0.06 but fails the visually-meaningful conjunct (sub-JND, safer direction: darker tint, more text contrast). DESIGN.md Colors. |
| `--tk-color-tint-mint` | `#D0F4F2` | `#1C2A26` | `colors.dark-tint-mint` | Verified — Story 5.4 dark sweep: Lab L* 15.7, OKLCH L 27.1%, hue 175.1° vs light 192.4° (Δ17.3° — within the recorded ±20° tolerance at C ≤ 0.04); held — 0.3 pt under the window. DESIGN.md Colors. |
| `--tk-color-tint-beige` | `#F1EBD6` | `#2A2620` | `colors.dark-tint-beige` | Verified — Story 5.4 dark sweep: Lab L* 15.4, OKLCH L 27.1%, hue 78.1° vs light 93.8° (Δ15.7° — within the recorded ±20° tolerance at C ≤ 0.04); held — 0.6 pt under the window. DESIGN.md Colors. |

### Theme invariants

These semantics keep their light values in dark — no override is emitted:

- `--tk-color-text-on-primary` — yellow keeps ink text in dark (DESIGN.md Colors)
- `--tk-color-tint-charcoal` — charcoal tint is theme-invariant (DESIGN.md Colors)

### Tonal elevation

All six `--tk-shadow-*` tokens collapse to `none` in dark: hierarchy comes from tonal surface steps instead of shadows (DESIGN.md Elevation & Depth). Per-component exceptions use the `--tk-<component>-<slot>` grammar — never this layer. `--tk-color-surface-muted` carries tonal step 1 (`dark-surface-1`); steps 2/3/elevated are deferred below until their consuming components land.

### Deferred dark palette keys

Accounted-for `dark-*` keys with no token-layer emission yet (adding a `dark-*` key without an entry here aborts generation — no silent drops):

- `colors.dark-surface-2` — tonal elevation step 2 — no semantic consumer yet; emitted when overlay/component stories define raised dark surface slots (Epic 2 overlays / Story 5.4 refinement), never as --tk-color-dark-*
- `colors.dark-surface-3` — tonal elevation step 3 — DESIGN.md reserves it for Modal-in-dark ("dark theme tonal step 3"); emitted when Modal lands, never as --tk-color-dark-*
- `colors.dark-elevated` — highest tonal step — reserved for elevated dark chrome; emitted when its consuming component lands, never as --tk-color-dark-*
- `colors.dark-tint-charcoal` — theme-invariant — charcoal equals the light value (equality asserted at generation); no dark override is emitted
