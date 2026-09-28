---
name: tj-kit
description: The ТЖ (Тиньков Журнал, t-j.ru) editorial design language as a separate exportable sub-kit — Graphik/Charter two-family typography, black-ink-on-white-cards editorial chrome, navy interactive links + gold award accents, native prefers-color-scheme dark mode.
status: draft
created: 2026-09-28
updated: 2026-09-28
sources:
  - ../../../.playwright-cli/captures-v3/tj/INDEX.md
  - ../../../.playwright-cli/captures-v3/tj/probe-notes.md
  - ../../prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
  - ../../briefs/brief-tinkoff-ui-kit-2026-09-21/brief.md
colors:
  # Editorial ink scale (extracted, light)
  ink-100: '#000000'        # headline ink — pure black (vs the bank kit's #333 primary)
  ink-200: '#333333'        # CTA fill + strong UI ink
  ink-300: '#6E6E6E'        # AUTHORED AA step for essential meta (5.099:1 on card) — improvement layer; dark collapses onto dark-meta
  ink-reference-meta: '#A6A6A6'   # reference meta ink — RESTRICTED (2.434:1 on card, decorative/supplementary only); dark remaps to dark-meta
  ink-reference-time: '#808080'   # reference time-meta — RESTRICTED (3.949:1 on card; 3.982 on dark-card — UNBOUND in dark, timestamps)
  # Surfaces (extracted, light)
  page: '#F0F0F0'
  card: '#FFFFFF'
  # Dividers (extracted)
  divider: '#E5E5E5'
  divider-strong: '#A6A6A6'
  # Gold — the award/ornament accent (extracted; re-roled OFF the link species by probe10)
  gold: '#C79637'           # reference value; 2.676:1 on card — CANNOT be an AA text color in light; stays the anchor + decorative carrier
  gold-ink: '#8A6519'       # AUTHORED AA override for gold TEXT accents — award/byline chrome (5.308:1 on card); light-only, no longer the link alias
  # Interactive link species (extracted, probe10 2026-09-28 — the reference's OWN link
  # system, minerva/v120/link.css + hedge/v148-1/index4.css theme vars): ink =
  # rgb(var(--outline-interactive)); underline TRANSPARENT at rest, revealed on hover at
  # 70% alpha of the ink (--opacity-link-border-hover), 0.1s ease-in-out. The alpha is a
  # use-site composition (color-mix against the theme-aware ink token) — mirrors the
  # reference's compose-at-use architecture and keeps dark on the same key.
  link-body: '#1414CC'        # reference --outline-interactive (light) — 10.491:1 on card / 9.206:1 on page
  dark-link-body: '#93A2FF'   # reference dark --outline-interactive — 6.630:1 on dark-card / 7.700:1 on dark-page
  # Scoped accents (extracted; scoped carriers only — see Colors body)
  badge-purple: '#8054FF'   # «Учебник» 30×30 circular badge ONLY — non-text carrier
  # CTA (extracted)
  cta-fill: '#333333'
  cta-ink: '#FFFFFF'
  # Dark theme (extracted — the reference's own dark values, unlike the bank kit's authored dark)
  dark-page: '#12151C'
  dark-ink: '#FFFFFF'        # headline/strong ink inverts to pure white — dark-home pixel census: #FFFFFF ×15051 in title bands (wordmark/hero/featured) vs meta #D0D0D2 ×2370; dark-article unprobed, 17.2 re-verifies. Feeds ink-100.
  dark-card: '#20232A'
  dark-divider: '#3E4146'
  dark-divider-strong: '#D0D0D2'  # two-grade dark battery (#3E4146 ×27 · #D0D0D2 ×10) mirrors the light divider/divider-strong pair. Feeds divider-strong.
  dark-meta: '#D0D0D2'      # 10.211:1 on dark-card ✓ — carries meta duty in dark (feeds BOTH ink-300 and ink-reference-meta overrides)
  dark-engage: '#717277'    # like/engagement ink — RESTRICTED (3.277:1 on dark-card). Feeds the engage alias.
  dark-cta-fill: '#F5F5F9'  # CTA inverts to a near-white pill
  dark-cta-ink: '#000000'
  # probe10: the 15.2 `dark-link` key (gold carrier) is RETIRED — the link alias
  # dark-sources dark-link-body directly now (the generator blocks dark-*→dark-*
  # references; one key, one literal, no duplication).
  # Focus (extracted token + improvement layer): the reference NAMES --outline-focus but
  # under-applies it — probe10: only like-bubbles carry `outline-color`; body links fall to
  # the UA outline; the CTA suppresses outline entirely. The kit applies a 2px
  # :focus-visible ring on every interactive — documented improvement, reference color.
  focus-ring: '#8A8AE5'       # reference --outline-focus (light) — non-text 3.067:1 on card / 2.691:1 on bare page (RESTRICTED to card surfaces)
  dark-focus-ring: '#828BBB'  # dark --outline-focus — non-text 4.763:1 on dark-card
# AA-bearing notes grammar per the bank-kit mold (story 9.2 machine truth);
# ratios below are MACHINE computations, 3-decimal, trued 2026-09-28 — the ТЖ
# token story (15.2) mechanizes these exact pins in its contrast test exactly
# as 1.2/6.1 did. status: verified entries are re-anchored to story: '15.2';
# probe10 amendments (16.1 pre-work) anchor story: '16.1'.
aa-annotations:
  ink-reference-meta:
    kind: restricted
    status: verified
    story: '15.2'
    text: 'reference meta `#A6A6A6` = 2.434:1 on card — supplementary/decorative meta only; essential meta uses the authored ink-300 `#6E6E6E` (5.099:1). Mirrors the bank kit text-muted restricted ruling.'
  ink-reference-time:
    kind: restricted
    status: verified
    story: '15.2'
    text: 'reference time-meta `#808080` = 3.949:1 on card (3.982 on dark-card, unbound) — timestamps and read-time only, never names/titles.'
  gold-ink:
    kind: override
    status: verified
    story: '16.1'
    text: 'authored `#8A6519` (5.308:1 on card) replaces the extracted `#C79637` (2.676:1 — fails even the 3:1 large-text bar) for light-theme gold TEXT accents — award/byline chrome; `#C79637` stays the anchor + decorative carrier (rules, ornaments). Dark keeps the reference value — `#C79637` = 5.876:1 on dark-card. Probe10 re-roled the LINK species onto the extracted link-body pair; gold-ink no longer feeds the link alias.'
  link-body:
    kind: measured
    status: verified
    story: '16.1'
    text: 'extracted `#1414CC` (reference --outline-interactive) = 10.491:1 on card / 9.206:1 on page — the in-body link ink; dark `#93A2FF` = 6.630:1 on dark-card / 7.700:1 on dark-page. The hover underline (70% alpha of the ink) is decorative — AA rides the ink.'
  focus-ring:
    kind: restricted
    status: verified
    story: '16.1'
    text: 'non-text 3:1: `#8A8AE5` = 3.067:1 on card ✓ / 2.691:1 on bare page ✗ — focus rings are card-surface compositions (the ТЖ chrome grammar); dark `#828BBB` = 4.763:1 on dark-card ✓. The reference defines the token but under-applies it (probe10); the kit applies 2px :focus-visible rings — improvement layer.'
  engage:
    kind: restricted
    status: verified
    story: '15.2'
    text: 'engagement ink: dark `#717277` = 3.277:1 on dark-card — counts/secondary affordances only; the light engage alias rides ink-reference-meta (2.434:1, restricted).'
  badge-purple:
    kind: restricted
    status: verified
    story: '15.2'
    text: 'purple `#8054FF` exists ONLY as the 30×30 circular badge fill (non-text carrier, white glyph); never a text or link color.'
shadows:
  # PIXEL-PROBED 2026-09-28: cards are FLAT (box-shadow none across 95-card
  # censuses — surfaces separate by color, not elevation); the reference's
  # only measured shadow is the search-suggest overlay panel. The vision
  # card-lift estimates are DELETED (forensics: verify/tj-tokens/NOTES.md).
  overlay: '0 2px 8px rgba(0,0,0,.1)'
motion:
  # First ТЖ transitions MEASURED probe10 (2026-09-28, link.css + Button.css):
  # link underline reveal + CTA background = 0.1s ease-in-out — duration-micro
  # joins the scale and curve-standard records the keyword's exact bezier.
  # The rest of the contract stays the bank kit's motion grammar; per-component
  # verification lands with each component story (FR-22 gate).
  curve-expressive-standard: 'cubic-bezier(0.4,0.1,0.2,1)'
  curve-expressive-entrance: 'cubic-bezier(0.35,1.3,0.25,1)'
  curve-expressive-exit: 'cubic-bezier(0.4,0,1,1)'
  curve-productive-standard: 'cubic-bezier(0.2,0,0.4,0.9)'
  curve-standard: 'cubic-bezier(0.42,0,0.58,1)'   # the measured ease-in-out keyword as its exact bezier — the ТЖ interactive curve (probe10)
  duration-fastest: 75ms
  duration-micro: 100ms
  duration-fast: 150ms
  duration-moderate: 300ms
  duration-slow: 500ms
typography:
  # TWO FAMILY CONTRACTS (FR-20): ui = Graphik (grotesque); reading = Charter (serif).
  # Stacks carry the reference's exact family names first (licensed consumers
  # auto-pickup — the OQ-2 policy); open fallbacks per OQ-8 (UX proposal:
  # Inter grotesque / PT Serif reading — final at the token story).
  font-ui: 'Graphik, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif'
  font-reading: 'Charter, "Bitstream Charter", "PT Serif", Georgia, serif'
  # Display/heading register (Graphik) — per-surface h1 scale from computed probes
  display-featured: { fontSize: 55px, fontWeight: '700', lineHeight: '1.1', fontFamily: '{typography.font-ui}', note: '/pro/ featured course cards — the largest type on the site' }
  article-h1: { fontSize: 45px, fontWeight: '700', lineHeight: '50px', fontFamily: '{typography.font-ui}', note: 'reading column w764; family RESOLVED probe9 (2026-09-28, live article): computed Graphik 700/45px/50px, fonts.check true — the site ships Graphik as a VARIABLE face (loaded 400+600, covering 700)' }
  rubric-h1: { fontSize: 38px, fontWeight: '700', lineHeight: '45px', fontFamily: '{typography.font-ui}', note: 'rubric + community h1' }
  article-h2: { fontSize: 38px, fontWeight: '700', lineHeight: '45px', fontFamily: '{typography.font-ui}' }
  pro-h1: { fontSize: 32px, fontWeight: '700', fontFamily: '{typography.font-ui}', note: 'inside the purple hero card' }
  hero-title: { fontSize: 21px, fontWeight: '700', lineHeight: '25px', fontFamily: '{typography.font-ui}', note: 'home card scale — the home "hero" is card-scale, not display' }
  section-h2: { fontSize: 21px, fontWeight: '700', fontFamily: '{typography.font-ui}' }
  news-title: { fontSize: 24px, fontWeight: '700', lineHeight: '30px', fontFamily: '{typography.font-ui}', note: 'feed/rubric card titles (news + community posts)' }
  card-title: { fontSize: 17px, fontWeight: '400', fontFamily: '{typography.font-ui}', note: 'meta-colored small card titles' }
  # Reading register (Charter) — the ТЖ identity marker
  article-lead: { fontSize: 27px, fontWeight: '400', lineHeight: '35px', fontFamily: '{typography.font-reading}', note: 'serif lead paragraph, w760' }
  article-body: { fontSize: 21px, fontWeight: '400', lineHeight: '30px', fontFamily: '{typography.font-reading}', note: 'serif reading register — w760' }
  # Hybrid: pull-quote is Graphik inside the serif flow
  pull-quote: { fontSize: 35px, fontWeight: '400', lineHeight: '50px', fontFamily: '{typography.font-ui}', note: 'blockquote — groteske inside the reading column' }
  # UI text
  time-meta: { fontSize: 15px, fontWeight: '400', fontFamily: '{typography.font-ui}' }
  cta-label: { fontSize: 15px, fontWeight: '400', lineHeight: '20px', fontFamily: '{typography.font-ui}' }
  nav-label: { fontSize: 17px, fontWeight: '700', fontFamily: '{typography.font-ui}', note: 'sidebar rubric labels — probe9 census: navItem ×11/11 at 17px/700 Graphik (vision 16/400 was a wrapper artifact: the pill anchors set no family and compute Times; the inner spans carry Graphik)' }
  body-link: { fontSize: 21px, fontWeight: '400', fontFamily: '{typography.font-reading}', note: 'probe10 census ×8/8: in-body links INHERIT the reading register (Charter 21px, ink = the extracted link-body species); the 15px-grotesque vision read was a wrapper artifact — 15px Graphik links are search-suggest/footer/bubble surfaces, not article body' }
rounded:
  # PIXEL-PROBED 2026-09-28 on the live reference (forensics:
  # .playwright-cli/verify/tj-tokens/NOTES.md — home/flows/article//pro/
  # censuses). The vision trio card 20/24/32 was an artifact (9.1 repeat):
  # cards measure 25, panels/hero 30. icon-tile measured 7px on the 30x30
  # rail tiles (span._icon_ [30x30] r7, home rail — probe8 addendum).
  input: 4px
  control-xs: 8px
  cta: 5px
  cta-promo: 10px
  control-sm: 15px
  chip: 20px
  card: 25px
  panel: 30px
  icon-tile: 7px
  badge: 50%
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
  # ТЖ layout anchors (computed): reading column w764/w760, sidebar rail w290,
  # main content column ~770, header h~72
  column-reading: 764px
  column-reading-body: 760px
  rail-sidebar: 290px
  column-main: 770px
  header-h: 72px
  container: 1200px
components:
  cta-write:
    background: '{colors.cta-fill}'
    color: '{colors.cta-ink}'
    radius: '{rounded.cta}'
    height: 30px
    typography: '{typography.cta-label}'
    dark-background: '{colors.dark-cta-fill}'
    dark-color: '{colors.dark-cta-ink}'
    focus-ring: '{colors.focus-ring}'
    transition: 'background-color 100ms curve-standard (measured, probe10) — reference suppresses outline; the kit shows the ring (improvement)'
  editorial-link:
    color: '{colors.link-body}'
    dark-color: '{colors.dark-link-body}'
    focus-ring: '{colors.focus-ring}'
    hover: 'ink-stable — underline reveal only (70% alpha of the ink via color-mix, 100ms curve-standard)'
    secondary-color: '{colors.ink-100}'
    secondary-dark-color: '{colors.dark-meta}'
    note: 'probe10 re-point: the link species is the extracted interactive pair, not gold. Secondary variant rides ink/dark-meta with an always-on 30% underline (70% on hover); dashed pseudo-links and positive/negative surface variants stay out of 16.1 (no consumer yet).'
  article-body-text:
    typography: '{typography.article-body}'
    color: '{colors.ink-100}'
  article-lead-text:
    typography: '{typography.article-lead}'
    color: '{colors.ink-100}'
  pull-quote:
    typography: '{typography.pull-quote}'
    color: '{colors.ink-100}'
  news-card:
    background: '{colors.card}'
    radius: '{rounded.card}'
    title-typography: '{typography.news-title}'
    title-color: '{colors.ink-100}'
    dark-background: '{colors.dark-card}'
  rubric-header:
    background: '{colors.card}'
    radius: '{rounded.panel}'
    h1-typography: '{typography.rubric-h1}'
  tag-chip:
    radius: '{rounded.chip}'
    background: 'rgba(255,255,255,.18)'
    color: '#FFFFFF'
    typography: '{typography.nav-label}'
    note: 'on-purple translucent chips — /pro/ hero nav'
  sidebar-rail:
    width: '{spacing.rail-sidebar}'
    icon-tile: 30px
    icon-tile-radius: '{rounded.icon-tile}'
  header-bar:
    height: '{spacing.header-h}'
    background: '{colors.card}'
---

# ТЖ (Тиньков Журнал) — Design System Definition

Status: **draft for the v5 planning chain** (UX phase). Extraction source: the
2026-09-28 recon pack (`.playwright-cli/captures-v3/tj/` — 11 captures, computed-style battery,
both themes). This file is the ТЖ sub-kit's token SOURCE: its frontmatter feeds the ТЖ token
generator instance (FR-18); it never mixes into the bank kit's table.

## Brand & Style

ТЖ is an editorial product wearing bank-adjacent but distinct clothes. The identity:

- **Ink-first, not yellow-first.** Pure-black headlines on white cards over a `#F0F0F0` page.
  The bank's yellow is absent from editorial chrome — it exists only in native-ad modules,
  which are the MAIN kit's language entering via the optional integration (FR-21).
- **Two-family typography.** Graphik (grotesque) for UI and ALL headings; Charter (serif) for
  the article reading register. The serif body is the strongest ТЖ identity marker and the
  clearest divergence from the bank kit.
- **Gold, sparingly.** `#C79637` is the award/ornament accent (384 uses on the home DOM
  census — rules, ornaments, highlighted like-bubbles) and NOT an AA text color in light
  (see Colors). Probe10 retired the "gold editorial link" read: the reference's OWN link
  species is the navy interactive pair `#1414CC`/`#93A2FF` with a hover-revealed underline.
- **Quiet geometry.** r5 CTAs (not pills!), hairline dividers, FLAT cards — no shadow lifts
  anywhere (the 95-card pixel census: `box-shadow: none`; surfaces separate by color, not
  elevation). Where the bank kit is pill-shaped and yellow, ТЖ is rectangular and ink-colored.
- **Native dark.** The reference darkens via `prefers-color-scheme` alone — a cool-dark set
  (`#12151C` page / `#20232A` cards) with an inverted near-white CTA pill. The kit adds an
  explicit override channel (improvement layer; EXPERIENCE.md contract).

## Colors

**Extraction method:** computed styles (the CDN-origin stylesheets block `cssRules` — same wall
as the bank reference; probe-notes.md holds the transcripts). Fill/color censuses on the home
DOM: light `#FFF×144 / #FFDD2D×11 / #8054FF×3 / #06101E×9`, colors `#000×4989 / #A6A6A6×4781 /
#C79637×384`; dark `#20232A×119 / #FFDD2D×11 (art only)`.

**AA table (UX-phase computations; the token story pins 3-decimal values mechanically):**

| Pair | Ratio | Ruling |
|---|---|---|
| ink-100 #000 on card #FFF / page #F0F0F0 | 21.000 / 18.427 | ✓ |
| cta-ink #FFF on cta-fill #333 | 12.635 | ✓ |
| ink-300 #6E6E6E (authored) on card | 5.099 | ✓ — essential meta |
| ink-reference-meta #A6A6A6 on card | 2.434 | ✗ RESTRICTED (decorative/supplementary) |
| ink-reference-time #808080 on card / dark-card | 3.949 / 3.982 | ✗ RESTRICTED (timestamps/read-time) |
| gold #C79637 on card | 2.676 | ✗ as text; gold-ink #8A6519 = 5.308 ✓ (award chrome) |
| gold #C79637 on dark-card #20232A | 5.876 | ✓ — award accents in dark |
| link-body #1414CC on card / page | 10.491 / 9.206 | ✓ — the link species (probe10) |
| dark-link-body #93A2FF on dark-card / dark-page | 6.630 / 7.700 | ✓ |
| focus-ring #8A8AE5 vs card (non-text) | 3.067 | ✓ 1.4.11 on card surfaces |
| focus-ring #8A8AE5 vs page (non-text) | 2.691 | ✗ RESTRICTED — rings ride cards |
| dark-focus-ring #828BBB vs dark-card (non-text) | 4.763 | ✓ |
| dark-meta #D0D0D2 on dark-card / dark-page | 10.211 / 11.859 | ✓ |
| dark-cta-ink #000 on dark-cta-fill #F5F5F9 | 19.311 | ✓ |
| dark-engage #717277 on dark-card | 3.277 | ✗ RESTRICTED (counts) |
| dark-ink #FFFFFF on dark-card / dark-page | 15.727 / 18.265 | ✓ |

**Scoped accents:** `badge-purple #8054FF` — the «Учебник» 30×30 circular badge only (white
glyph on purple = 4.536:1 — non-text carrier, glyph is supplementary to the adjacent label).
Yellow `#FFDD2D` / navy `#06101E` are deliberately ABSENT from this table: they are the main
kit's ad-module language (FR-21 boundary).

**Dark rationale:** unlike the bank kit's authored dark, ТЖ's dark values are the reference's
OWN (`prefers-color-scheme` live capture) — extraction, not authoring. The one authored dark
addition may be an AA meta step if a story needs essential meta darker than dark-engage
(revisit at the token story; no value invented now).

## Typography

Two contracts, per FR-20. Stacks: reference family names first (Graphik / Charter — licensed
consumers auto-pickup per the OQ-2 policy), open cyrillic-capable fallbacks behind (OQ-8 UX
proposal: Inter / PT Serif; final ruling at the token story — bundling only on delivered
licenses, the Daytona precedent). NOTE: no ТЖ font files exist in the repo; nothing is bundled
by this planning artifact.

Register map per surface (computed): home hero card 21/700/25 · section H2 21/700 · small card
17/400 · news/community titles 24/700/30 · rubric+community h1 38/700/45 · /pro/ h1 32/700 ·
featured display 55/700 · article H1 45/700/50 · article H2 38/700/45 · lead 27/400/35 serif ·
body 21/400/30 serif · pull-quote 35/400/50 grotesque · time-meta 15/400 · CTA label 15/400/20.

Resolved 2026-09-28 (probe9, live article page — forensics in
`.playwright-cli/verify/tj-tokens/NOTES.md`): article-H1 family = Graphik (computed
on the H1 node itself, fonts.check true); nav-label = 17px/700 (×11/11 census; the
16/400 vision read was a wrapper artifact). Probe10 (same day, link census ×171 +
the reference's own link.css) retired the last "quirk": in-body links ×8/8 INHERIT
the reading register (Charter 21px) with the extracted interactive ink — the 15px
grotesque read was a wrapper artifact of suggest/footer/bubble surfaces.

## Layout & Spacing

Reading column w764 (H1) / w760 (body); sidebar rail w290 (16 rubric entries, icon tiles 40px);
main content column ~770; header ~72px. Card padding ~24; inter-card gap ~24; 8px base grid.
Article BYO rhythm: the reading column is the unit of measure, not the grid.

## Elevation & Depth

Near-flat: cards float on the page by luminance contrast, not shadow. Shadow values are
vision-estimated candidates only — pixel-probe at the first ТЖ component story before any
baseline freeze (the 9.1 lesson).

## Shapes

CTA r5 (computed) — the quiet-geometry marker. Badge r50% (computed). Card radii 20/24/32 are
vision candidates pending the same mandatory probe. Pills (full) exist only in nav chips and
the dark CTA inversion.

## Motion

No ТЖ transitions were captured. The starting contract inherits the bank kit's motion grammar
(curves + 75/150/300/500 durations, reduced-motion to 0ms per the standing a11y floor).
Per-component motion verification is part of each FR-22 gate; a dedicated ТЖ motion probe
happens if the first interactive component (header rail or tag-chip nav) shows a different
grammar live.

## Components (anchors)

The frontmatter `components` block carries style anchors for the roster's first citizens —
CTA «Написать», editorial link, the reading-register text styles, news card, rubric header,
tag chip, sidebar rail, header bar. Full component contracts (states, slots, events, a11y)
live in EXPERIENCE.md + the per-story specs; this file owns VALUES.
