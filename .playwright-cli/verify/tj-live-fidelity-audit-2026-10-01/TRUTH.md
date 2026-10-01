# TJ family — kit-side authored truth (validator B)

Extraction date: 2026-10-01. Sources: `packages/tj-components/src/**`, `packages/tj-tokens/src/tokens.css`, story files in `packages/tj-components/src/**` + `packages/docs/src/tj/*.stories.ts`. All paths relative to repo root `/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui`.

Owner legend: **C** = component css.ts (shipped chrome), **T** = token layer (`packages/tj-tokens/src/tokens.css`), **S** = story/pattern canvas (recipe, not shipped API), **F** = structural FLAG (non-token literal, flagged in source comments as unmeasured/authored pick).

Token value resolutions used throughout (tokens.css): `--tj-space-N` = N px (L127–136); container 1200 (L142); header-h 72 (L141); column-reading 764 (L137); column-reading-body 760 (L138); column-main 770 (L140); rail-sidebar 290 (L139). Radius: cta 5 (L113), cta-promo 10 (L114), control-sm 15 (L115), chip 20 (L116), card 25 (L117), panel 30 (L118), icon-tile 7 (L119), badge 50% (L120), full 9999 (L121).

## 1. tj-header

| element | metric | our value | source | owner |
|---|---|---|---|---|
| bar | height (rest) | 72px via `grid-template-rows: var(--tj-space-header-h)` | tj-header.css.ts:59 | T (h72) |
| bar | height (scrolled, any scroll > 0) | 56px literal | tj-header.css.ts:67; threshold `TJ_HEADER_SCROLL_THRESHOLD_PX = 0` tj-header.ts:67 | F |
| bar | background | `var(--tj-color-page)` #F0F0F0 light / #12151C dark — NO divider hairline | tj-header.css.ts:60; tokens.css:25,190 | T |
| bar | sticky/blend | `position: sticky; top: 0; z-index: var(--tj-z-nav)` (100) | tj-header.css.ts:55–57; tokens.css:183 | C/T |
| bar | compress animation | grid-template-rows 150ms `--tj-motion-curve-standard` | tj-header.css.ts:61; tokens.css:158,161 | T |
| inner row | container / insets | max-width 1200 centered; padding-inline 24; item gap 24 | tj-header.css.ts:86–90 | T + F(24s) |
| nav chip | height | `min-height: 40px` (REMEASURED 2026-09-30, 7 chips × 2 captures, zero spread) | tj-header.css.ts:119 | F (measured) |
| nav chip | padding-x | 12px | tj-header.css.ts:120 | F (4-grid pick) |
| nav chip | radius | `--tj-radius-chip` = 20px | tj-header.css.ts:121; tokens.css:116 | T |
| nav chip | fill / ink | card #FFFFFF / ink-100 #000 (dark: #20232A / #FFF) — WHITE PILL on page-gray bar | tj-header.css.ts:122,126; tokens.css:26,195 | T |
| nav chip | font | nav-label 17px / 700, Graphik (`--tj-font-ui`) | tj-header.css.ts:123–125; tokens.css:92–93,104 | T |
| nav chip | gap between | 24px | tj-header.css.ts:111 | F |
| nav chip | current marking | SEMANTIC-ONLY (`aria-current`), zero visual delta | tj-header.css.ts:104–107 | C |
| icon (theme) button | box | 44×44 transparent, no hover | tj-header.css.ts:144–152 | F |
| theme glyph | size | 24×24 decorative half/half circle | tj-header.css.ts:164–166 | F |
| CTA «Написать» | hit box | 44×44 invisible anchor, `padding-inline: 15px` (width content-based ≈ 98px per probe10) | tj-header.css.ts:181–183 | F |
| CTA pill | height | 30px — `::before` `inset-block: 7px` = (44−30)/2 | tj-header.css.ts:198 | F (remeasured) |
| CTA pill | radius | `--tj-radius-full` (9999) — fully rounded, NOT radius-cta 5 | tj-header.css.ts:200 | T |
| CTA pill | fill / ink | cta-fill #333333 / cta-ink #FFFFFF (dark: #F5F5F9 / #000000) | tj-header.css.ts:201,206; tokens.css:39–40,200–201 | T |
| CTA label | font | cta-label 15px/400/20 Graphik | tj-header.css.ts:190–192; tokens.css:89–91 | T |
| CTA | hover | NONE (unprobed on reference — nothing invented) | tj-header.css.ts:175,64 | C |
| focus rings | all interactives | 2px `--tj-color-focus-ring` (#8A8AE5 light / #828BBB dark), offset 2 | tj-header.css.ts:132,155,210; tokens.css:42,209 | C/T |
| story demo | wordmark slot | 44px floor, img height 32 | tj-header.stories.ts:104–113 | S |

## 2. tj-cta (single variant — no size ladder exists)

| metric | our value | source | owner |
|---|---|---|---|
| hit box | 44×44, `padding-inline: 15px` | tj-cta.css.ts:48–50 | F |
| pill height | 30px (`::before` inset-block 7px) | tj-cta.css.ts:68 | F |
| pill radius | `--tj-radius-cta` = **5px** (quiet, NOT pill) | tj-cta.css.ts:70; tokens.css:113 | T |
| fill / ink | cta-fill #333 / cta-ink #FFF (dark inverts via tokens) | tj-cta.css.ts:71,78; tokens.css:39–40,200–201 | T |
| label font | 15px/400/20 Graphik | tj-cta.css.ts:57–59; tokens.css:89–91 | T |
| hover | NONE by design (ink-stable, cursor only) | tj-cta.css.ts:62–64 | C |
| focus | 2px ring around the 44 BOX, offset 2 | tj-cta.css.ts:83–86 | C |

Header CTA vs tj-cta: same 44/30/15 mold, but header pill = radius-full, article CTA = radius 5 (tj-header.css.ts:170–175 comment).

## 3. tj-tag-chip

| metric | our value | source | owner |
|---|---|---|---|
| height | 40px | tj-tag-chip.css.ts:48 | F (census) |
| padding-inline | `--tj-space-20` = 20px | tj-tag-chip.css.ts:49 | F (on-scale pick) |
| radius | chip 20px | tj-tag-chip.css.ts:50; tokens.css:116 | T |
| fill / ink | chip-fill **#6E48DB** / chip-ink #FFFFFF — opaque AA override replacing the reference's translucent `rgba(255,255,255,.18)`; THEME-INVARIANT (no dark override) | tj-tag-chip.css.ts:51–52; tokens.css:36–38 | T |
| font | nav-label 17/700 Graphik | tj-tag-chip.css.ts:54–55; tokens.css:92–93 | T |
| hover/focus | `translateY(-2px)` lift, 150ms standard | tj-tag-chip.css.ts:60,66–69 | F (magnitude) |
| focus ring | 2px chip-ink (white), NOT focus-ring token (AA-on-purple ruling) | tj-tag-chip.css.ts:75–78 | C |
| chevron gap | 8px; 1em glyph, 2px stroke, currentColor | tj-tag-chip.css.ts:87–90 | F |
| /pro/ hero pattern (S) | field: max-w 760, min-h 600, padding 48/40, bg badge-purple #8054FF, radius panel 30; CTA h50 px-i 24 r cta-promo 10, 15/700; blobs 228×360 r200; chips gap 12 | tj-tag-chip.stories.ts:173–213,226–240 | S |

## 4. tj-news-card

| metric | our value | source | owner |
|---|---|---|---|
| host cap | max-width 760 (column-reading-body) | tj-news-card.css.ts:34 | T |
| card padding | 24px all sides | tj-news-card.css.ts:49 | T |
| card radius | `--tj-radius-card` = 25px | tj-news-card.css.ts:51; tokens.css:117 | T |
| card fill | card #FFFFFF (dark #20232A); FLAT — no shadow, no hover | tj-news-card.css.ts:50; tokens.css:26 | T |
| byline row | gap 12; mark 40×40 r-panel(30); avatar 32×32 round; author 15/700/20 ink-100 | tj-news-card.css.ts:69,74–76,89–91,104–107 | T + F(40/32) |
| title | margin-top 16; news-title 24/700/30 Graphik ink-100 (slotted h2/h3) | tj-news-card.css.ts:114,121–124; tokens.css:70–72 | T |
| excerpt | margin-top 12; card-title 17/400, lh 24, **reading family (Charter)**, ink-100 | tj-news-card.css.ts:132,137–140 | T + F(lh24) |
| meta | margin-top 16; time-meta 15/400, lh 20, ink-300 #6E6E6E (dark #D0D0D2) | tj-news-card.css.ts:150,152–155; tokens.css:20,84–85,197 | T |
| skeleton | bones ink-300 @12% alpha, radius cta 5, no shimmer; mark 40, title lh 30, meta lh 20 | tj-news-card.css.ts:162–208 | F |

## 5. tj-post-card

| metric | our value | source | owner |
|---|---|---|---|
| cell | TRANSPARENT: no bg/radius/border/padding — sheet owned by consumer pattern | tj-post-card.css.ts:45–55 | C (ruling) |
| meta row | gap 8; avatar 20×20 round (structural FLAG); author 15/700/20 ink-100; date 15/400 ink-300 | tj-post-card.css.ts:73,78–79,93–96,101–104 | F(20) + T |
| title | margin-top 16; news-title 24/700/30 ink-100; 2-line clamp quartet | tj-post-card.css.ts:116,123–130 | T + F(clamp) |
| count | margin-top 12, gap 4; 15/400 ink-300; own flow line below clamped title (recorded micro-delta vs reference) | tj-post-card.css.ts:139–148 | T + F |

## 6. tj-rubric-header

| metric | our value | source | owner |
|---|---|---|---|
| host surface | card fill + `--tj-radius-panel` 30 | tj-rubric-header.css.ts:35–36; tokens.css:118 | T |
| cover clip | top-corners-only panel radius, straight bottom cut | tj-rubric-header.css.ts:59 | C |
| mark | 100×100, radius panel, margin 24/24; overlap −50px (half over cover) when cover present | tj-rubric-header.css.ts:66–71,79 | F |
| flow padding | 16 / 24 / 24 (top/x/bottom) | tj-rubric-header.css.ts:93 | F |
| h1 | rubric-h1 38/700/45 Graphik ink-100 | tj-rubric-header.css.ts:99–101; tokens.css:57–59 | T |
| subtitle | margin-top 8; card-title 17/400 lh 24 ink-300 | tj-rubric-header.css.ts:109–116 | T + F |

## 7. tj-composer

| metric | our value | source | owner |
|---|---|---|---|
| height | DERIVED 88px = padding-block 24×2 + avatar 40 (never declared) | tj-composer.css.ts:30–32 | derived |
| padding | 24 block / 32 inline | tj-composer.css.ts:32 | T |
| radius | **20px literal** (probe r20; no card-family token carries 20 — `--tj-radius-composer` ratification candidate) | tj-composer.css.ts:35 | F |
| fill | card #FFFFFF; no border; no hover art | tj-composer.css.ts:33–39 | T |
| avatar | 40×40 round (`--tj-space-40`, badge radius) | tj-composer.css.ts:58–60 | T |
| avatar→text gap | 24 | tj-composer.css.ts:29 | T |
| ghost text | card-title 17/400, lh 24 (pick), ink-300 | tj-composer.css.ts:70–73 | T + F(lh) |

## 8. tj-rail

| metric | our value | source | owner |
|---|---|---|---|
| sidebar width | 290 (`--tj-space-rail-sidebar`) | tj-rail.css.ts:34; tokens.css:139 | T |
| list | column, gap 4 | tj-rail.css.ts:52 | T |
| row | min-height 44 (hit floor), tile→label gap 12, nav-label 17/700 ink-100 | tj-rail.css.ts:65–71 | F(44) + T |
| icon tile | 40×40 box, radius icon-tile 7; slotted art 30×30 | tj-rail.css.ts:93–103 | F |
| burger | 44×44 hit, 40×40 visual chip inset 2px, radius control-sm 15, fill card | tj-rail.css.ts:117–134 | F |
| burger breakpoint | max-width 1199px | tj-rail.css.ts:189 | F |
| sheet (drawer) | `min(290px, 86vw)` full-height left; padding 16/24; card fill; shadow-overlay `0 2px 8px rgba(0,0,0,.1)`; panel radius 30 on INNER edge only | tj-rail.css.ts:155–170; tokens.css:148 | T + F(86vw) |
| current marking | semantic-only, no visual delta | tj-rail.css.ts:57–61 | C |

## 9. tj-prose / tj-link

| element | metric | our value | source | owner |
|---|---|---|---|---|
| prose host | column cap 760; Charter 21/400/30 ink-100; `hyphens: auto` (lang=ru consumer duty) | tj-prose.css.ts:53–64 | T |
| paragraph | `margin: 0 0 25px` — the ONE measured prose gap (probe10); 25 is a literal, no scale step | tj-prose.css.ts:76 | F (measured) |
| lead | 27/400/35 Charter; spacing composition-owned | tj-prose.css.ts:86–91 | T |
| in-article H2 | Graphik 38/700/45, `margin: 0` (UA neutralized — band composition-owned) | tj-prose.css.ts:96–103 | T |
| pull-quote | Graphik 35/400/50, `margin: 0` | tj-prose.css.ts:108–115 | T |
| body link | color link-body #1414CC (dark #93A2FF); body-link 21/400; underline EXISTS, transparent at rest; 1px thickness; offset .1em; position under | tj-prose.css.ts:126–137; tokens.css:33,94–95,207 | T + F(geometry measured) |
| link hover | underline reveals at 70% alpha of ink (`color-mix`); ink color STABLE (no shift) | tj-prose.css.ts:139–141 | F (alpha) |
| tj-link | same species as prose slotted anchor: color `--tj-color-link` #1414CC; underline transparent → 70% on hover; 1px/.1em/under; inline, no box | tj-link.css.ts:40–54 | T + F |

## 10. Patterns (composition spacings)

### Article page (`packages/tj-components/src/patterns/article-page.stories.ts`)
| metric | our value | source | owner |
|---|---|---|---|
| page canvas | bg page #F0F0F0; padding 32/24/64 | article-page.stories.ts:117–118 | S |
| frame | max-width 1200 centered | article-page.stories.ts:168–171 | S |
| layout grid | `290px rail + minmax(0,1fr)`, column gap 40, margin-top 24 | article-page.stories.ts:188–194 | S |
| article column | max-width 760, card fill, padding 24, radius card 25 (WHITE column over gray page) | article-page.stories.ts:218–223 | S |
| H1 | 45/700/50, mb 16 | article-page.stories.ts:233–240 | S |
| byline row | gap 12, mb 24; avatar 40 round; author 15/700/20; meta 15/400 ink-300 gap 8 | article-page.stories.ts:241–271 | S |
| prose H2 band | margin-block 40/24 | article-page.stories.ts:275–277 | S |
| pull-quote band | margin-block 32/32 | article-page.stories.ts:278–280 | S |
| engagement bar | mt 40, pt 24, 1px divider top, gap 8; buttons h40, px 12, radius 15, transparent bg, 15/400/20 ink-300 → hover/pressed ink-100 | article-page.stories.ts:282–319 | S |
| scroll-back rail (opt-in) | fixed bottom, card bg, 1px divider top, padding 8/16 | article-page.stories.ts:336–347 | S |
| reading skeleton | bones 12% alpha; 25px rhythm literals mirror live flow | article-page.stories.ts:374–448 | S |

### Community page (`tj-post-card.stories.ts`)
| metric | our value | source | owner |
|---|---|---|---|
| canvas | padding 40/24/64, bg page | tj-post-card.stories.ts:36–37 | S |
| composer | ON THE PAGE (gray), max-width 770, margin-bottom 32 — NOT inside the white sheet (tone-on-tone verdict) | tj-post-card.stories.ts:222–225 | S |
| posts sheet | max-width 770, padding 32/40, card fill, radius panel 30 | tj-post-card.stories.ts:227–233 | S |
| posts grid | 3 columns, column-gap 24, row-gap 40 | tj-post-card.stories.ts:234–239 | S |

### Rubric (docs demo, `packages/docs/src/tj/patterns-rubric.stories.ts`)
Hero wrapper padding 32/24, radius panel 30 (L100–102); feed column max-width 760, item gap 24 (L109–114). NOTE: docs pattern PAGES (article/community/pro/rubric «Обзор») are docs-site chrome on BANK `--tk-*` tokens — not TJ geometry.

### Colors, light AND dark (token layer)
| role | light | dark | source |
|---|---|---|---|
| page | #F0F0F0 | #12151C | tokens.css:25,190 |
| card | #FFFFFF | #20232A | tokens.css:26,191 |
| divider | #E5E5E5 | #3E4146 | tokens.css:27,192 |
| meta ink (ink-300) | #6E6E6E | #D0D0D2 | tokens.css:20,197 |
| CTA fill / ink | #333333 / #FFFFFF | #F5F5F9 / #000000 | tokens.css:39–40,200–201 |
| link | #1414CC | #93A2FF | tokens.css:33,43,203,207 |
| chip fill / ink | #6E48DB / #FFFFFF (theme-invariant) | same | tokens.css:36–38 |

## Pixel verification (suite baselines, ImageMagick probes)

Viewport truth: playwright.config.ts:56–57 — 1280×800, deviceScaleFactor 1 (no scaling; sanity: header wordmark img measures EXACTLY 32px, authored 32).

| element | authored | measured in PNG | verdict |
|---|---|---|---|
| tj-cta playground pill | 30px h, r5, px 15 | y334..363 → **30px h**; x48..238 → w191 (long demo label) | MATCH |
| header wordmark (story) | 32px img | y72..103 = **32px** | MATCH (scale sanity) |
| header nav chips | 40px (min-height) | white band y70..105 = **36px**, hard edges | **MISMATCH — stale baseline** (see below) |
| header CTA pill | 30px h / ~98px w / radius-full | dark fill y70..105 = **36px h**, x885..980 = 96+AA ≈ 98px w | width MATCH; height **MISMATCH — stale baseline** |
| composer (community pattern) | w770, r20, mb 32 to sheet, h88 derived | bottom edge y≈602 with r20 corner shrink; width 770 (x≈24..794); gap to sheet 32 (sheet top y613); top ≈514 → h≈88 | MATCH |
| community sheet | w770, r30, padding 32/40 | x24..793 = **770 w**; top corners x33→x24 over ~17 rows ≈ **r30**; box y613..953 | MATCH |
| news-card/note corner (playground) | radius card 25 | arc fit over y145..159: inset profile fits **r≈24–25** (left edge 24, card top ≈y143) | MATCH |

**Stale-baseline finding (header):** `visual-tj-header--*` PNGs were minted at commit dad294f (2026-09-29). The geometry fix 0c88291 (2026-09-30, spec 18.1 queue (e)) changed nav chips 36→40px and CTA pill 36→30px (inset 4→7px) but the baselines were NOT re-minted — the commit records «sub-threshold delta → re-mint cancelled by the 1.5% law (2123/2123 post-fix GREEN)». So the committed header PNGs still render the PRE-FIX 36/36 geometry; current authored truth is CSS 40/30 (which the stale PNG cannot show). Composer/news-card/CTA baselines are same-commit with their CSS — current.

## Could NOT establish (honest absence)

1. **tag-chip translucent variant** — does not exist in our CSS; the reference's translucent `rgba(255,255,255,.18)` field chip was replaced by the opaque AA override #6E48DB (tokens.css:37–38). If the live site shows translucent chips on purple, that is a known deliberate deviation.
2. **tj-cta variants/sizes** — exactly ONE mold exists (44/30/15/r5); no secondary/small/large variant to tabulate.
3. **Header CTA fixed width** — not authored; content-derived (≈98px per probe10 note, matches measured 96+AA).
4. **Current-render header PNG** — cannot be produced without a browser (forbidden for this validator); the 40/30 authored values are source-verified only.
5. **Dark-theme pixel probes** — not run (time-boxed; light legs only). Dark values are token-layer-sourced.
6. **Hover states** — header CTA, chips marking, composer, cards: all authored NONE (unprobed-on-reference rulings); only tag-chip lift (−2px) and engage-button ink shift exist.
7. **Docs pattern «Обзор» pages** — bank-token docs chrome (`--tk-*`), deliberately not TJ metrics; excluded.
