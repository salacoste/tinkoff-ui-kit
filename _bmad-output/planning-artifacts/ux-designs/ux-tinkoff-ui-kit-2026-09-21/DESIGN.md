---
name: tinkoff-ui-kit
description: Open-source recreation of the T-Bank (ex-Tinkoff) consumer web design language — yellow-black, pill-shaped, pastel-carded — as a token-first component kit with an authored dark theme.
status: final
created: 2026-09-21
updated: 2026-09-25
sources:
  - ../../prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
  - ../../briefs/brief-tinkoff-ui-kit-2026-09-21/brief.md
colors:
  # Brand scale (extracted)
  yellow-100: '#FFDD2D'
  yellow-200: '#FCC521'
  yellow-300: '#FAB619'
  # Ink scale (site "black-*")
  ink-100: '#909090'
  ink-200: '#666666'
  ink-300: '#333333'
  ink-400: '#000000'
  # Gray scale (extracted)
  gray-100: '#F5F5F6'
  gray-200: '#E7E8EA'
  gray-300: '#CBCFD3'
  gray-400: '#959BA4'
  gray-500: '#79818C'
  gray-600: '#616871'
  # Field surfaces (extracted)
  lightblue-100: '#ECF1F7'
  lightblue-200: '#E4EBF3'
  lightblue-300: '#DDE4ED'
  # Functional scales (extracted)
  blue-100: '#1771E6'
  blue-200: '#1464CC'
  blue-300: '#0953B3'
  green-100: '#39B54A'
  green-200: '#2CA53A'
  green-300: '#168821'
  red-100: '#E01F19'
  red-200: '#D3120E'
  red-300: '#C40B08'
  white: '#FFFFFF'
  # Semantic — light theme (extracted aliases, AA-adjusted — see Colors body)
  surface-base: '#FFFFFF'
  surface-muted: '#F5F5F6'
  surface-field: '#ECF1F7'
  border-default: '#E7E8EA'
  border-strong: '#CBCFD3'
  text-primary: '#333333'
  text-secondary: '#616871'
  text-muted: '#959BA4'
  text-on-primary: '#333333'
  focus-ring: '#1771E6'
  link-on-tint: '#1464CC'
  # Card tints (from marketing inventory)
  tint-gray: '#F5F5F6'
  tint-bluegray: '#ECF1F7'
  tint-mint: '#D0F4F2'
  tint-beige: '#F1EBD6'
  tint-charcoal: '#333333'
  # Semantic — dark theme (authored from brand-truth evidence; see Colors body)
  dark-base: '#1A1A1A'
  dark-surface-1: '#222222'
  dark-surface-2: '#292929'
  dark-surface-3: '#2F2F2F'
  dark-elevated: '#373737'
  dark-border: '#FFFFFF24'
  dark-text-primary: '#FFFFFF'
  dark-text-secondary: '#FFFFFFB3'
  dark-text-muted: '#FFFFFF80'
  dark-field: '#FFFFFF1A'
  dark-link: '#66A3FF'
  dark-error: '#FF7B74'
  dark-focus-ring: '#66A3FF'
  dark-tint-gray: '#242424'
  dark-tint-bluegray: '#1E242C'
  dark-tint-mint: '#1C2A26'
  dark-tint-beige: '#2A2620'
  dark-tint-charcoal: '#333333'
  # v2 — table semantics (invest/stocks; extracted values in the Colors body notes;
  # semantic aliases are the AA-override pattern: the site's #00A328/#F52222 fail 4.5:1
  # on white — 3.350:1 / 4.090:1 — so the semantics point at the existing darker scale steps)
  delta-positive: '{colors.green-300}'
  delta-negative: '{colors.red-300}'
  border-table: 'rgba(0,16,36,0.12)'
  surface-row-hover: 'rgba(36,74,127,0.06)'
  # v2 — warm-cream family (business; computed 2026-09-24: page #F1EEE8 OKLCH 0.950/0.009/84.6°,
  # card #E9E0D1 0.910/0.022/80.7° — hue ~13° toward orange vs tint-beige 93.8° → DISTINCT family)
  tint-cream: '#F1EEE8'
  tint-cream-raised: '#E9E0D1'
  dark-tint-cream: '#232220'
  dark-tint-cream-raised: '#2B2823'
  # v2 — stepper badge brown (business; measured 2026-09-25 from the archived
  # stepper reference block — .playwright-cli/verify/stepper/reference-block.png:
  # badge fill #8D6040 with white numeral, AA 5.413:1). Theme-invariant per the
  # charcoal mold: dark-tint-brown = light value (the badge keeps its brown fill
  # and white numeral in dark; see the Colors AA table row).
  tint-brown: '#8D6040'
  dark-tint-brown: '#8D6040'
  # v2 — dark first-pass table semantics: deltas follow the dark-error/dark-link
  # AA precedent (least-lightened value clearing 4.5:1 on dark-base), divider/hover
  # follow the white-alpha grammar (dark-border #FFFFFF24 / dark-field #FFFFFF1A)
  dark-delta-positive: '#39B54A' # green-100 — verified 8.2: clears AA on all three dark surfaces (base 6.533 / step1 5.972 / hover composite #313131 4.883)
  dark-delta-negative: '#F63434' # authored lightened delta red — verified 8.2: base 4.525 ✓ (sanctioned scope); hover composite #313131 3.382 / step1 4.136 fail per the closed 6.1 scope ruling (pinned, live-confirmed)
  dark-border-table: '#FFFFFF1F' # white-alpha hairline at the extracted divider's own alpha (0x1F ≈ 12% white mirrors rgba(0,16,36,0.12)), one step under dark-border — verified 8.2: composite #363636 on base (Δ+13.4 L*), 1.8 L* under the dark-border composite
  dark-surface-row-hover: '#FFFFFF1A' # white-alpha fill grammar — reuses the family's established fill step (dark-field, 10% white); verified 8.2: composite #313131 on base, text pairs on it 13.009/7.303 ✓
shadows:
  default: '0 4px 24px rgba(0,0,0,.12)'
  default-hover: '0 12px 36px rgba(0,0,0,.2)'
  modal: '0 18px 30px rgba(51,51,51,.52)'
  popover: '0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)'
  dropdown: '0 25px 15px rgba(0,0,0,.03), 0 11px 11px rgba(0,0,0,.04), 0 3px 6px rgba(0,0,0,.05)'
  tooltip: '0 6px 15px rgba(0,0,0,.2)'
motion:
  curve-expressive-standard: 'cubic-bezier(0.4,0.1,0.2,1)'
  curve-expressive-entrance: 'cubic-bezier(0.35,1.3,0.25,1)'
  curve-expressive-exit: 'cubic-bezier(0.4,0,1,1)'
  curve-productive-standard: 'cubic-bezier(0.2,0,0.4,0.9)'
  curve-productive-entrance: 'cubic-bezier(0,0,0.4,0.9)'
  curve-productive-exit: 'cubic-bezier(0.2,0,1,1)'
  duration-fastest: 75ms
  duration-fast: 150ms
  duration-moderate: 300ms
  duration-slow: 500ms
  duration-slowest: 700ms
typography:
  heading-1: { fontSize: 50px, fontWeight: '700', lineHeight: '1.1', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif', note: 'Daytona-first stack — bundled licensed renames are the default (maintainer agreements, 2026-09-22; see Typography body)' }
  heading-2: { fontSize: 44px, fontWeight: '700', lineHeight: '1.15', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif' }
  heading-3: { fontSize: 36px, fontWeight: '500', lineHeight: '1.2', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif' }
  heading-4: { fontSize: 28px, fontWeight: '500', lineHeight: '1.25', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif' }
  heading-5: { fontSize: 24px, fontWeight: '500', lineHeight: '1.3', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif' }
  heading-6: { fontSize: 20px, fontWeight: '500', lineHeight: '1.35', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif' }
  body-l: { fontSize: 17px, fontWeight: '400', lineHeight: '1.5', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-m: { fontSize: 15px, fontWeight: '400', lineHeight: '1.5', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-s: { fontSize: 13px, fontWeight: '400', lineHeight: '1.5', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-xs: { fontSize: 12px, fontWeight: '400', lineHeight: '1.45', letterSpacing: 0.4px, fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-l-bold: { fontSize: 17px, fontWeight: '500', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-m-bold: { fontSize: 15px, fontWeight: '500', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  body-s-bold: { fontSize: 13px, fontWeight: '500', fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif' }
  caps-s: { fontSize: 12px, fontWeight: '500', letterSpacing: 1px, fontFamily: 'DaytonaSans, DaytonaPragma, Inter, -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif', note: 'rendered uppercase — see Typography body' }
# v2 — mono family slot (story 9.1): system-first monospace chain for
# tabular/code faces; no licensed asset. No 9.1 consumer by design — the first
# is the invest tables story (11.2). One key today; new keys wire deliberately.
fonts:
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 24px
  full: 9999px
spacing:
  '4': 4px
  '8': 8px
  '12': 12px
  '16': 16px
  '20': 20px
  '24': 24px
  '32': 32px
  '40': 40px
  '48': 48px
  '64': 64px
  '96': 96px
  '120': 120px
  container: 1200px
  grid-gap: 20px
components:
  button-primary:
    background: '{colors.yellow-100}'
    color: '{colors.ink-300}'
    radius: '{rounded.full}'
    height: 56px
    height-compact: 32px
    typography: '{typography.body-m-bold}'
    hover-background: '{colors.yellow-200}'
    active-background: '{colors.yellow-300}'
  button-secondary:
    background: '{colors.white}'
    color: '{colors.ink-300}'
    radius: '{rounded.full}'
    shadow: default
    height: 48px
  button-inverse:
    background: '{colors.ink-300}'
    color: '{colors.white}'
    radius: '{rounded.full}'
    height: 48px
  text-link:
    color: '{colors.blue-100}'
    hover-color: '{colors.blue-200}'
    on-tint-color: '{colors.link-on-tint}'
  badge-chip:
    radius: '{rounded.full}'
    typography: '{typography.body-xs}'
  input:
    background: '{colors.surface-field}'
    radius: '{rounded.md}'
    border: '{colors.border-default}'
    focus-ring: '{colors.focus-ring}'
    placeholder: '{colors.gray-500}'
    height: 52px
    dark-background: '{colors.dark-field}'
  select:
    radius: '{rounded.md}'
    height: 52px
  tabs:
    active-radius: '{rounded.full}'
    active-shadow: default
  card-promo:
    radius: '{rounded.xxl}'
    background: '{colors.tint-gray}'
    padding: '{spacing.32}'
  card-feature:
    radius: '{rounded.xxl}'
    min-height: 320px
  # v2 components (FR-12..14; terse — behavioral contracts live in EXPERIENCE.md)
  data-table:
    divider: '{colors.border-table}'
    row-height: 81px
    row-fill-hover: '{colors.surface-row-hover}'
    delta-positive: '{colors.delta-positive}'
    delta-negative: '{colors.delta-negative}'
    cell-primary: '{typography.body-m}'
    cell-secondary: '{typography.body-s}'
    header-typography: '{typography.body-m}'
  filter-chips:
    radius: '{rounded.full}'
    typography: '{typography.body-m}'
    single-select: true
  pagination:
    active-fill: '{colors.yellow-100}'
    active-text: '{colors.ink-300}'
    radius: '{rounded.full}'
    more-link-color: '{colors.blue-100}'
  combobox-search:
    radius: '{rounded.md}'
    height: 52px
  mega-nav:
    height: 72px
    subnav-height: 56px
  cookie-banner:
    radius: '{rounded.lg}'
    shadow: default
  stepper:
    badge-radius: '{rounded.lg}'
    card-radius: '{rounded.xl}'
    badge-fill: '{colors.tint-brown}'
    badge-number: '{colors.white}'
  store-badges:
    radius: '{rounded.full}'
    fill: '{colors.surface-muted}'
  qr-block:
    tile-radius: '{rounded.lg}'
    tile-fill: '{colors.white}'
  card-service:
    radius: '{rounded.xl}'
    padding: '{spacing.24}'
  navbar:
    height: 72px
    active-indicator: '{colors.yellow-100}'
  footer-pill-link:
    background: '{colors.ink-300}'
    color: '{colors.white}'
    radius: '{rounded.full}'
  modal:
    radius: '{rounded.lg}'
    shadow: modal
  tooltip:
    radius: '{rounded.sm}'
    shadow: tooltip
  toast:
    radius: '{rounded.lg}'
    shadow: default
---

## Brand & Style

tinkoff-ui-kit recreates the consumer web language of T-Bank (ex-Tinkoff): a mass-market fintech
aesthetic that is friendly without being childish. The posture is **confident, rounded, and
generous** — pill controls, large soft cards, pastel product surfaces carrying glossy 3D art, and
one loud brand color (yellow) spent almost exclusively on the primary action. Everything else is
quiet grayscale discipline.

The kit is a copy-first recreation (PRD: fidelity is a hard constraint), so this DESIGN.md is
mostly *extraction*: color, type, radius, and elevation values come from live tbank.ru computed
styles and inventory captures. Authored additions are explicitly marked: the dark theme (site is
light-only; palette synthesized from brand-truth evidence — the site's own `on-dark` token layer,
the T-Bank app's dark mode, and Taiga UI's open elevation ramp) and the derived overlay trio.

## Colors

**Yellow (`{colors.yellow-100}` → `200` → `300`)** is the action color: primary CTA fills, active
nav underline, selection highlights. Text on yellow is ink, never white. Yellow is not used for
links, icons at rest, or decoration.

**Ink scale** (`ink-100…400`) carries text and inverse surfaces; body text is
`{colors.text-primary}` (#333333), softer than pure black on purpose.

**Gray / lightblue scales** build surfaces: `{colors.surface-muted}` for secondary panels,
`{colors.surface-field}` for inputs, `{colors.border-default}` for hairlines. Functional scales
(blue = links/focus, green = success, red = error) each ship 3 steps for hover/active depth.

**Card tints** (gray, bluegray, mint, beige, charcoal) are the marketing language's signature
pastel surfaces; each pairs automatic dark-text, charcoal pairs white text. Mint and beige are
verified values (Story 3.6 closure): measured by computed styles + native-zoom crops in the
Story 2.0 capture pack — mint `#D0F4F2` (ОСАГО card, flat single-hex surface), beige
`#F1EBD6` (Т-Образование card) — replacing the earlier vision-inventory estimates.

**Dark theme (authored).** Evidence: the site's own `on-dark` white-alpha layer (text at
100%/72%/50%, field at 10% white), the T-Bank app dark mode (near-black base, tonally elevated
gray widgets, no shadows), Taiga UI's ramp (#222/#292929/#2F2F2F/#373737, borders
rgba(255,255,255,.14)). Synthesis: `{colors.dark-base}` canvas, tonal elevation steps
`dark-surface-1…3` / `dark-elevated` replacing shadows, white-alpha text trio, yellow unchanged
(yellow-on-dark keeps ink text — contrast holds), borders `{colors.dark-border}`. Tinted cards in
dark mode follow the derivation rule: darken the tint toward L≈16–20% (CIE Lab L*) keeping hue.
**Verified at Story 5.4 (dark sweep): all four `dark-tint-*` values hold** — Lab L* 14.2 / 13.9 /
15.7 / 15.4 (max window miss 2.06 pt: sub-JND and in the safer direction), hue kept (bluegray
Δ2.9°; mint/beige Δ17.3°/15.7°, within the recorded ±20° tolerance at chroma ≤ 0.04; gray
achromatic), each sitting between tonal steps 1–2 (content tint, not elevated chrome). Charcoal
tint is theme-invariant (`dark-tint-charcoal` = light value).

**AA contrast adjustments (authored deviations from extraction).** The reference's own values
fail WCAG 2.1 AA in places; the kit overrides semantics while keeping scales intact (a11y is a
PRD improvement axis, fidelity checks cover visuals, not ratios):

| Pair | Ratio | Status |
|---|---|---|
| ink-300 on yellow-100 (primary button) | 9.41:1 | passes as extracted |
| white on ink-300 (inverse button) | 12.63:1 | passes as extracted |
| `{colors.text-secondary}` | — | **overridden** to gray-600 #616871 (site's #79818C = 3.94:1 on white — fails 4.5:1; #616871 = 5.64:1) |
| TextLink blue-100 on white | 4.62:1 | passes; on tints use `{colors.link-on-tint}` blue-200 (blue-100 = 4.07:1 on field — fails) |
| Dark links | — | **added** `{colors.dark-link}` #66A3FF (blue-100 = 3.76:1 on dark-base); dark errors `{colors.dark-error}` #FF7B74 |
| Focus ring | — | **unified** `{colors.focus-ring}` blue-100 / `{colors.dark-focus-ring}` #66A3FF, 2px offset 2px (site's ink-on-ink = invisible; border-default = 1.23:1) |
| Dark text-secondary #FFFFFFB3 | 6.75–9.07:1 | passes; #FFFFFF80 (muted) restricted to ≥48px or non-essential text |
| Yellow active indicators (nav underline, tab pill) | 1.34:1 vs white | fails 1.4.11 non-text 3:1 → indicators are always **redundant**: paired with 700-weight ink text (Navbar) or ink text + shadow (Tabs pill); yellow never carries state alone |
| Table deltas (v2, invest/stocks) | — | **overridden** — `delta-positive` = green-300 `#168821` (4.587:1 on white ✓; site `#00A328` = 3.350:1 fails) / `delta-negative` = red-300 `#C40B08` (6.179:1 ✓; site `#F52222` = 4.090:1 fails). **Scope ruling — deltas are sanctioned on base surfaces only; row-hover/tonal composites fail AA** for at least one leg per theme (green-300: row-hover composite `#F2F4F7` 4.163:1, surface-muted 4.210:1, surface-field 4.039:1; dark `#F63434`: row-hover composite `#313131` 3.382:1, tonal step 1 `#222222` 4.136:1; red-300 clears muted/field/hover at 5.671/5.441/5.608) — 6.2/6.4 hold deltas on unhovered rows or re-derive at 8.2. Dark first-pass **verified (8.2 dark sweep — both HELD)**: `dark-delta-positive` = green-100 `#39B54A` clears ALL three dark surfaces — base 6.533:1, step 1 5.972:1, hover composite `#313131` 4.883:1 (green-300 fails in dark at 3.794:1); `dark-delta-negative` `#F63434` 4.525:1 on base (sanctioned scope; hover `#313131` 3.382:1 / step 1 4.136:1 fail per the scope ruling — a hover-clearing red `#FF7B74` = 5.165:1 exists numerically but is +12.7 L* into the pastel error family, not a delta red; no red scale step passes: red-100 = 3.630:1, site `#F52222` = 4.255:1 on base) |
| Warm-cream pairings (v2, business) | 4.87–15.90:1 | sanctioned: text-primary 10.911:1 / text-secondary 4.866:1 on `tint-cream`; text-primary 9.655:1 on `tint-cream-raised`; dark: 15.895 / 8.461 on `dark-tint-cream`, 14.680 / 7.989 on `dark-tint-cream-raised`. **text-secondary NOT sanctioned on `tint-cream-raised`** — 4.306:1 fails 4.5:1, use text-primary there (the v1 on-tint ruling precedent) |
| Stepper badge brown (v2, business, 9.1) | 5.413:1 / 4.674:1 | REQUIRED: white numeral on `tint-brown` **5.413:1** ✓ (badge fill, both themes — `tint-brown` is theme-invariant, charcoal mold); `tint-brown` on `tint-cream` **4.674:1** ✓ (badge over page cream). RECORDED-FAILING: `tint-brown` on `tint-cream-raised` **4.136:1** (< 4.5) — the badge never sits on raised cream (its card-top overlap is white); pinned, not fixed |

## Typography

Font stacks are **Daytona-first** (maintainer license decision, 2026-09-22): the bundled
licensed renames are now the default. **DaytonaSans** ≡ Neue Haas Unica W1G (renamed build,
usage + renaming license from Monotype held by the maintainer) ships in
`packages/tokens/fonts/` and takes both slots' lead; **DaytonaPragma** ≡ Pragmatica (ParaType,
same licensing arrangement) follows as soon as the maintainer supplies the files. Both are
separately-licensed assets, NOT covered by the package's MIT license
(`fonts/LICENSE-FONTS.md`). `TinkoffSans` — the site's actual heading font (`dsHeading`) —
remains proprietary/unavailable (a T-Bank asset, no license path), so DaytonaSans takes the
heading role as the closest licensed grotesk. Consumers self-hosting the originals override
the slots (recipe unchanged — declare `--tk-font-heading`/`--tk-font-body` with the originals
first); the stacks mirror the site's chain structure (licensed grotesk first, then the open
fallback **Inter**, then the system chain). The ramp itself is extracted
exactly:

- Headings h1–h6: 50/44/36/28/24/20px; weight 700 (h1–h2) and 500 (h3–h6)
- Body l/m/s/xs: 17/15/13/12px at 400; bold variants at 500 (never 600+)
- `{typography.caps-s}` for footer group headers and micro-labels — rendered uppercase with
  +1px tracking (transform applied at render, not stored in the token)
- Mobile headings reuse the h1/h4/h6 sizes per the site's own mobile mapping

## Layout & Spacing

The site exposes no root spacing scale (utilities inline), so the kit systematizes a 4-based
scale (`{spacing.4}`…`{spacing.120}`) — a **recorded systematization, re-verified at Story
5.6**: the scale has nothing to extract verbatim (no capture can confirm or refute the raw
steps), but its load-bearing steps ARE probe-verified against the reference at composition
(Story 3.10: `{spacing.container}` 1200px content width probed 64..1216, `{spacing.grid-gap}`
20px probed on the 3-up grids, `{spacing.96}`–`{spacing.120}` section rhythm probed), two-up
and three-up card grids at equal columns.

## Elevation & Depth

Light theme uses the site's semantic shadow system verbatim: `default`
(0 4px 24px rgba(0,0,0,.12)) and `default-hover` for resting/hover lift on white controls;
`popover`/`dropdown` (3-layer), `modal`, `tooltip` for overlays. Colored card surfaces stay
flat — no shadows on tinted cards.

Dark theme replaces elevation with **tonal steps** (app-evidenced): shadows are disabled or
reduced to near-invisible; hierarchy comes from `dark-surface-1…3` lightness steps.

## Shapes

The system's signature is the **pill** (`{rounded.full}`): all buttons, badges, segmented
controls, active tabs. Cards use ONE measured marketing radius: `{rounded.xl}`/`{rounded.xxl}`
(24px) — **verified at Story 5.6** by pixel-probing the archived Story-2.0 card captures
(`.playwright-cli/verify/fidelity-verification/radii-probe.mjs`, DPR 1): service and article
tiles measure 24px (arc staircase pixel-identical to the kit's 24px renders), the promo/feature
banners measure 22–24px across three captures — **two sub-signatures within the band**
(banners' arc fits 21.9–22.2; tiles' 23.5–23.9), collapsed to ONE token. The original
`{rounded.xxl}` 32px vision estimate is thereby CORRECTED to the measured card radius — `xxl`
now equals `xl`; the reference paints one card-radius band, not two registers. Fields use
`{rounded.md}`. The app-layer vars (`{rounded.xs}`/`{rounded.sm}`, 4/8px) serve dense UI. Two
registers — pill-soft marketing, tight-precise app — never mix within one component.

## Components

Visual specs for the 19 v1 components (behaviors live in EXPERIENCE.md):

| Component | Anatomy & key visuals |
|---|---|
| Button | Pill; primary yellow (ink text) / secondary white + `default` shadow / inverse ink-300 (white text); heights 56 (hero) / 48 (card) / 32 (compact); press darkens one step |
| TextLink | `{colors.blue-100}`, underline on hover; inline-legal variant in `{typography.body-xs}` gray |
| Badge/Chip | Pill chip; incentive variant green-100 bg + ink text; stat variant ink-300 bg + white text |
| Input | `{colors.surface-field}` fill, `{colors.focus-ring}` 2px focus outline, `{rounded.md}`, 52px, placeholder gray-500; inline badge slot right-anchored |
| Select | Same field language + chevron; menu uses `dropdown` shadow, `{rounded.sm}` items |
| Checkbox | 20px box, `{rounded.xs}`, ink-300 check on yellow-100 fill when checked |
| SegmentedRadio | Pill track, `{rounded.full}`; selected segment solid fill + dot indicator |
| ThumbnailPicker | Square tiles `{rounded.md}`, selected gets 2px ink border ring |
| ProgressBar | 4px track `{colors.border-default}` (light value = gray-200's hex; dark = white-alpha tonal step — Story 5.4), fill blue-100, `{rounded.full}` |
| Tabs | Text tabs; active = white pill + `default` shadow inside invisible track |
| Navbar | 72px, white, logo slot left, nav links with yellow active underline, utilities right |
| Footer | Uppercase gray group headers (`caps-s`), 6–7 link columns, ink-300 pill quick-links, bold phone block |
| PromoCard | Tint bg, `{rounded.xxl}`, art slot top, title/desc, white pill CTA bottom-center; auto text-pairing per tint |
| FeatureCard | 2-up large variant incl. charcoal editorial variant (white heading, white pill CTA, bleed art right) |
| ServiceCard | `{rounded.xl}`, small 3D icon slot, title, desc, text link pinned bottom |
| ArticleCard | Text-only: 2-line title, desc, "Читать" link |
| Modal | White panel `{rounded.lg}`, `modal` shadow; dark theme tonal step 3 |
| Tooltip | Ink-300 bg, white text-xs, `{rounded.sm}`, `tooltip` shadow |
| Toast | White card `{rounded.lg}`, `default` shadow, icon + message + optional action |
| DataTable | Typographic rows (NO charts): row-as-link, two-line cells (body-m name/price + body-s ticker/lot), 1px `{colors.border-table}` dividers, no zebra, 81px rows, hover `{colors.surface-row-hover}`; delta text `{colors.delta-positive/negative}` — color carries direction (v2, invest/stocks) |
| FilterChips | Checkbox-tablist chips, pill radius, single-select semantics, overflow «Ещё» (v2) |
| Pagination | Numbered nav, active = yellow-100 pill + ink text, «Показать еще» blue text button (v2) |
| ComboboxSearch | Field-language search with typeahead listbox (v2) |
| MegaNav | Two-deep header: bank-wide row (72px) + domain sub-nav row (56px) — extension of tk-navbar (v2, business/invest) |
| CookieBanner | Consent dialog, `{rounded.lg}` card + default shadow, link + accept (v2) |
| Stepper | Numbered steps: white cards `{rounded.xl}`, brown number badge overlapping the top edge, white numeral (v2, business) |
| StoreBadges | App-store pill badges (AppGallery/RuStore/Samsung molds), muted fill, brand icon RIGHT (v2, invest-mobile) |
| QrBlock | QR install tablist + monochrome QR in white tile `{rounded.lg}` (v2, invest-mobile) |

**Registers (v2, cross-domain finding 2026-09-24).** The three domains carry the SAME token
base at three typography registers — mappings onto the existing scale, no new type tokens:
**marketing** (business, invest landing: h1 = `heading-2` 44/700, Daytona stacks — the kit's
shipped default), **product-UI** (invest/stocks: h1 = `heading-3` 36/500, dense body data
typography — body-m/body-s with tighter 24/20px leadings in table cells), and the v1 consumer
register (h1 50). Components declare their register; nothing branches at the token layer.

**Table delta semantics (AA-override pattern).** invest/stocks paints deltas green
`#00A328` / red `#F52222` (computed 2026-09-24) — both FAIL 4.5:1 on white (3.4:1 / 4.2:1);
per this file's AA-override discipline the semantic tokens point at the existing darker scale
steps (`delta-positive` = green-300 `#168821` 4.7:1 ✓, `delta-negative` = red-300 `#C40B08`
6.3:1 ✓); the extracted values are recorded here as the extraction-note anchor. Row hover
`rgba(36,74,127,0.06)`, divider `rgba(0,16,36,0.12)` — extracted verbatim.

**Warm-cream family (v2, business).** Distinct from tint-beige (computed OKLCH: cream
`#F1EEE8` 0.950/0.009/84.6° and raised `#E9E0D1` 0.910/0.022/80.7° vs beige 0.939/0.029/93.8°
— hue −13° toward orange, chroma halved). `tint-cream`/`tint-cream-raised` +
dark pair verified at the 8.2 dark sweep (both HELD): page `#232220` Lab 13.26 / OKLCH
25.2% H 84.6° (hue Δ0.0° — exact; 2.74 pt under the 16–20 window, held — the in-window
landing collapses the page→card step to ≤0.3 L*, and the value mirrors the light pair's
page≈muted-lightness relationship, dark `#222222` = 13.2); raised `#2B2823` Lab 16.27 —
INSIDE the window, pair step Δ3.0 L*. Business bento
cards: flat (no shadow), `{rounded.xl}`, floating white 111×44 pill CTA over 3D art; yellow
appears only inside illustrations.

**Reference anchors.** Fidelity baseline capture: `.playwright-cli/tbank-home-full.png`
(repo root, homepage, 2026-09-21). Extraction provenance (live computed styles, 1112 root
vars): `.working/tokens-extract-tbank-ru.md` in this directory. Dark-theme evidence sources
are cited in Colors above (site on-dark vars, T-Bank app dark-mode reports, Taiga UI ramp).
DESIGN.md and EXPERIENCE.md win on conflict with any capture.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Yellow exclusively for primary action and active indicators | Yellow for links, icons, decoration, or white-on-yellow text |
| Ink (#333) text on yellow; white text only on ink/charcoal | Pure-black body text; colored text on tinted cards |
| Pills for controls, xxl radii for cards, md for fields | Mix marketing and app radius registers in one component |
| Tinted cards flat (no shadow); white controls get `default` shadow | Shadows on colored surfaces; shadow-stacks on dark theme |
| Bold = 500, headings 700/500 only | 600/800/900 weights; condensed or serif substitutes |
| Dark theme = tonal steps + white-alpha text, yellow kept | Inverting light tokens mechanically; changing brand yellow in dark |
