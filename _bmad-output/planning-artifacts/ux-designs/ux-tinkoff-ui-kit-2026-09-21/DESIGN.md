---
name: tinkoff-ui-kit
description: Open-source recreation of the T-Bank (ex-Tinkoff) consumer web design language — yellow-black, pill-shaped, pastel-carded — as a token-first component kit with an authored dark theme.
status: final
created: 2026-09-21
updated: 2026-09-23
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
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
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

`[ASSUMPTION]` The site exposes no root spacing scale (utilities inline), so the kit
systematizes a 4-based scale (`{spacing.4}`…`{spacing.120}`), consistent with the reference's
grid behavior: `{spacing.container}` (1200px) max content width, `{spacing.grid-gap}` card-grid
gaps, `{spacing.96}`–`{spacing.120}` vertical section rhythm, two-up and three-up card grids at
equal columns.

## Elevation & Depth

Light theme uses the site's semantic shadow system verbatim: `default`
(0 4px 24px rgba(0,0,0,.12)) and `default-hover` for resting/hover lift on white controls;
`popover`/`dropdown` (3-layer), `modal`, `tooltip` for overlays. Colored card surfaces stay
flat — no shadows on tinted cards.

Dark theme replaces elevation with **tonal steps** (app-evidenced): shadows are disabled or
reduced to near-invisible; hierarchy comes from `dark-surface-1…3` lightness steps.

## Shapes

The system's signature is the **pill** (`{rounded.full}`): all buttons, badges, segmented
controls, active tabs. Cards use the marketing radii `{rounded.xxl}` (32px) for feature/promo
cards and `{rounded.xl}` (24px) for service cards — `[ASSUMPTION]` vision-estimated, verify at
build. Fields use `{rounded.md}`. The app-layer vars (`{rounded.xs}`/`{rounded.sm}`, 4/8px)
serve dense UI. Two registers — pill-soft marketing, tight-precise app — never mix within one
component.

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
