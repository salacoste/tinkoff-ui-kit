# pillkit-tokens — canonical token listing

GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens`.

- Source of truth: `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md` frontmatter — blocks `colors`, `typography`, `fonts`, `rounded`, `spacing`, `shadows`, `motion`.
- The `components:` frontmatter block is consumer spec prose — never rendered.
- The z-scale is scaffold mechanics, not an extraction (own section below).
- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tk-color-dark-*` custom properties.
- AA-bearing color notes are GENERATED from the DESIGN.md `aa-annotations:` block (story 9.2 — the generator literals died; every note must anchor in the Colors body, anchor lost → generation aborts): 10 entries — 10 verified / 0 open `[ASSUMPTION]` flags. Resolved history: text-secondary (Story 1.2); focus-ring (Story 1.2); link-on-tint (Story 1.2); error-on-field (Story 1.3); text-muted (Story 1.2); delta-positive (Story 6.1); delta-negative (Story 6.1); tint-cream (Story 6.1); tint-cream-raised (Story 6.1); tint-brown (Story 9.1).

Light layer: **139 tokens** on `:host, :root` (colors 52, typography 42, fonts 1, radius 7, spacing 14, shadows 6, motion 11, z-scale 6) plus the dark layer: **23 semantic overrides + 6 shadow-none re-declarations** on `[data-theme="dark"]`.

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
| `--tk-color-delta-positive` | `#168821` | AA override — DESIGN.md reference `{colors.green-300}` resolves to `#168821` (4.587:1 on surface-base): the site's delta green `#00A328` = 3.350:1 fails 4.5:1. RULING: sanctioned on surface-base only — green-300 fails on surface-muted (4.210:1), surface-field (4.039:1) and the row-hover composite `#F2F4F7` (4.163:1); 6.2/6.4 hold deltas on unhovered rows or re-derive at 8.2. Anchors live in DESIGN.md Colors (Table delta semantics). |
| `--tk-color-delta-negative` | `#C40B08` | AA override — DESIGN.md reference `{colors.red-300}` resolves to `#C40B08` (6.179:1 on surface-base): the site's delta red `#F52222` = 4.090:1 fails 4.5:1. RULING: sanctioned on surface-base only — red-300 itself clears the adjacent surfaces (muted 5.671:1, field 5.441:1, hover `#F2F4F7` 5.608:1) but the green leg does not, so the pair-level ruling holds: 6.2/6.4 keep deltas on unhovered base-surface rows or re-derive at 8.2. Anchors live in DESIGN.md Colors (Table delta semantics). |
| `--tk-color-border-table` | `rgba(0,16,36,0.12)` | Extracted verbatim (v2, invest/stocks table divider) — `rgba(0,16,36,0.12)`; decorative structure (non-text), dark first-pass in the dark layer. DESIGN.md Colors (Table delta semantics). |
| `--tk-color-surface-row-hover` | `rgba(36,74,127,0.06)` | Extracted verbatim (v2, invest/stocks row hover fill) — `rgba(36,74,127,0.06)`; decorative fill (non-text), dark first-pass in the dark layer. DESIGN.md Colors (Table delta semantics). |
| `--tk-color-tint-cream` | `#F1EEE8` | Warm-cream family (v2, business) — DISTINCT from tint-beige per step (computed OKLCH vs beige 93.8°/C0.029: base 84.6°/C0.009, raised 80.7°/C0.022 — 9–13° toward orange, chroma 0.31×–0.76×; DESIGN.md Colors). AA sanctioned: text-primary 10.911:1 / text-secondary 4.866:1 on the tint (tests/contrast.test.ts). |
| `--tk-color-tint-cream-raised` | `#E9E0D1` | Warm-cream raised step (v2, business). AA sanctioned: text-primary 9.655:1; text-secondary = 4.306:1 FAILS 4.5:1 — NOT sanctioned on raised cream, use text-primary there (the v1 on-tint ruling precedent; tests/contrast.test.ts). |
| `--tk-color-tint-brown` | `#8D6040` | Measured (Story 9.1) — stepper badge fill `#8D6040` from the archived reference block (.playwright-cli/verify/stepper/reference-block.png; the 7.3 placeholder mapped it to tint-cream-raised). Theme-invariant (charcoal mold). AA REQUIRED: white numeral 5.413:1 ✓, on tint-cream 4.674:1 ✓; RECORDED-FAILING: on tint-cream-raised 4.136:1 (the badge never sits there — its card overlap is white). DESIGN.md Colors. |
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
| `--tk-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace` |  |

The mono slot comes from the `fonts` block (story 9.1): a system-first monospace chain for tabular/code faces, no licensed asset. It has no consumer in 9.1 by design — the first is the invest tables story (11.2).

Daytona-first stacks (maintainer license decision, 2026-09-22): the bundled licensed renames are the default. **DaytonaSans** = `Neue Haas Unica W1G` (renamed build, usage + renaming license from Monotype held by the maintainer) ships in `packages/tokens/fonts/` — import `pillkit-tokens/daytona.css` and the slots render it; **DaytonaPragma** = Pragmatica (ParaType, same arrangement) ships at true weights 400/500/700 (Book/Medium/Bold cuts; no SemiBold — 600/700 requests match the 700 face). Both are separately-licensed assets, NOT covered by the package MIT license (`fonts/LICENSE-FONTS.md`). `TinkoffSans` (the site's heading font, `dsHeading`) remains proprietary/unavailable, so DaytonaSans takes the heading role as the closest licensed grotesk. Consumers self-hosting the originals override the slots with the family names first (recipe below, unchanged); the open fallback is **Inter**, then the site-mirroring system chain.

Override recipe (custom properties cascade and inherit — declare on `body`/your app root, or any later or higher-specificity declaration):

```css
:root { --tk-font-body: Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif; }
```

An override replaces the whole value: re-include the fallback stack so the DESIGN.md fallbacks stay preserved.

### Typography registers (v2)

The three v2 domains carry the SAME token base at three typography registers — MAPPINGS onto the slots above, zero new type tokens (DESIGN.md Components → Registers). Components declare their register; nothing branches at the token layer:

| Register | Domains | h1 mapping | Body data usage |
| --- | --- | --- | --- |
| marketing | tbank.ru/business, invest landing | `--tk-text-heading-2-*` (44px / 700, Daytona stacks) — the kit's shipped default | body slots as shipped |
| product-UI | invest/stocks | `--tk-text-heading-3-*` (36px / 500) | dense body data — body-m / body-s with tighter 24/20px leadings in table cells (set at usage, not in tokens) |
| consumer | v1 consumer pages | `--tk-text-heading-1-*` (50px / 700) — the extracted site ramp as-is | body slots as shipped |

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
| `--tk-color-tint-cream` | `#F1EEE8` | `#232220` | `colors.dark-tint-cream` | Verified — Story 8.2 dark sweep: Lab L* 13.26, OKLCH 25.2% C 0.004 H 84.6° vs light 84.6° (Δ0.0° — hue exact); held — 2.74 pt under the 16–20 window, but the correction fails the meaningful conjunct twice: the only in-window landing sits ≤0.3 L* from the raised sibling (the page→card step would collapse sub-JND) and the value mirrors the light pair's page≈muted-lightness relationship (surface-muted dark `#222222` = Lab 13.2 ≈ 13.26 — warm hue is the differentiator, as in light). AA holds: text-primary 15.895:1 / text-secondary 8.461:1 (tests/contrast.test.ts). DESIGN.md Colors. |
| `--tk-color-tint-cream-raised` | `#E9E0D1` | `#2B2823` | `colors.dark-tint-cream-raised` | Verified — Story 8.2 dark sweep: Lab L* 16.27 — INSIDE the 16–20 window; OKLCH 27.8% C 0.010 H 80.6° vs light 80.7° (Δ0.1°); pair step page→raised = Δ3.0 L* (25.2→27.8% OKLCH), a clean tonal elevation. AA holds: text-primary 14.680:1 / text-secondary 7.989:1 (tests/contrast.test.ts). DESIGN.md Colors. |
| `--tk-color-delta-positive` | `#168821` | `#39B54A` | `colors.dark-delta-positive` | Verified — Story 8.2 dark sweep: `#39B54A` clears AA on ALL three real dark surfaces — base 6.533:1, tonal step 1 5.972:1, row-hover composite `#313131` 4.883:1 (confirmed live on the story DOM — the delta verdict legs of tests/visual/dark-sweep.spec.ts; pins tests/contrast.test.ts:284-285). Sourced from green-100: the existing lightest green step clears as-is, no value authored (green-300, the light override, measures 3.794:1 in dark). Site anchors live in DESIGN.md Colors (Table delta semantics). |
| `--tk-color-delta-negative` | `#C40B08` | `#F63434` | `colors.dark-delta-negative` | Verified — Story 8.2 dark sweep: `#F63434` clears AA on the sanctioned dark base only (4.525:1); the row-hover composite `#313131` 3.382:1 and tonal step 1 `#222222` 4.136:1 FAIL — the closed 6.1 scope ruling (deltas sanctioned on base surfaces; composite failures PINNED, never silent — contrast.test.ts:282-283, confirmed live on the story DOM by the delta verdict legs). A hover-clearing red exists numerically (`#FF7B74` = 5.165:1 on `#313131`) but sits +12.7 L* into the pastel error family — not a delta red; the least-lightened AA value stays (no red scale step passes: red-100 = 3.630:1, site `#F52222` = 4.255:1 on base, worse). Site anchors live in DESIGN.md Colors (Table delta semantics). |
| `--tk-color-border-table` | `rgba(0,16,36,0.12)` | `#FFFFFF1F` | `colors.dark-border-table` | Verified — Story 8.2 dark sweep: `#FFFFFF1F` composites to `#363636` on dark-base (Lab 22.6, Δ+13.4 — a visible hairline) and `#3D3D3D` on tonal step 1; 1.8 L* under the dark-border composite `#3A3A3A` — the documented one-step-under divider grammar (dividers quieter than control borders). 0x1F ≈ 12% white mirrors light rgba(0,16,36,0.12). Decorative structure (non-text; 1.4.11 does not apply). DESIGN.md Colors. |
| `--tk-color-surface-row-hover` | `rgba(36,74,127,0.06)` | `#FFFFFF1A` | `colors.dark-surface-row-hover` | Verified — Story 8.2 dark sweep: `#FFFFFF1A` composites to `#313131` on dark-base (pinned tests/contrast.test.ts:281) — Δ+11.1 L* over base, a visible-but-gentle transient step; the row's text pairs on the composite pass (text-primary 13.009:1, text-secondary 7.303:1) and the delta pair rides the 6.1 scope ruling (3.382/4.883 — the negative leg's documented state, confirmed live). Same 10% white as the dark-field fill family. DESIGN.md Colors. |

### Theme invariants

These semantics keep their light values in dark — no override is emitted:

- `--tk-color-text-on-primary` — yellow keeps ink text in dark (DESIGN.md Colors)
- `--tk-color-tint-charcoal` — charcoal tint is theme-invariant (DESIGN.md Colors)
- `--tk-color-tint-brown` — brown tint is theme-invariant — the stepper badge keeps its fill + white numeral in dark (DESIGN.md Colors, story 9.1)

### Tonal elevation

All six `--tk-shadow-*` tokens collapse to `none` in dark: hierarchy comes from tonal surface steps instead of shadows (DESIGN.md Elevation & Depth). Per-component exceptions use the `--tk-<component>-<slot>` grammar — never this layer. `--tk-color-surface-muted` carries tonal step 1 (`dark-surface-1`); steps 2/3/elevated are deferred below until their consuming components land.

### Deferred dark palette keys

Accounted-for `dark-*` keys with no token-layer emission yet (adding a `dark-*` key without an entry here aborts generation — no silent drops):

- `colors.dark-surface-2` — tonal elevation step 2 — no semantic consumer yet; emitted when overlay/component stories define raised dark surface slots (Epic 2 overlays / Story 5.4 refinement), never as --tk-color-dark-*
- `colors.dark-surface-3` — tonal elevation step 3 — DESIGN.md reserves it for Modal-in-dark ("dark theme tonal step 3"); emitted when Modal lands, never as --tk-color-dark-*
- `colors.dark-elevated` — highest tonal step — reserved for elevated dark chrome; emitted when its consuming component lands, never as --tk-color-dark-*
- `colors.dark-tint-charcoal` — theme-invariant — charcoal equals the light value (equality asserted at generation); no dark override is emitted
- `colors.dark-tint-brown` — theme-invariant (charcoal mold, story 9.1) — brown equals the light value (equality asserted at generation); the stepper badge keeps its brown fill + white numeral in dark, no dark override is emitted
