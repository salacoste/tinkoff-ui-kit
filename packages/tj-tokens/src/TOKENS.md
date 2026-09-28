# pillkit-tj-tokens — canonical token listing

GENERATED FILE — DO NOT EDIT. Regenerate with `pnpm gen:tokens:tj`.

- Source of truth: `_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md` frontmatter — blocks `colors`, `typography`, `rounded`, `spacing`, `shadows`, `motion`.
- The `components:` frontmatter block is consumer spec prose — never rendered.
- The `dark-*` color entries are the palette SOURCE for the dark layer (see "Dark layer") — never emitted as `--tj-color-dark-*` custom properties.
- No z-scale: the ТЖ layer has no floating surfaces yet — a story needing one amends DESIGN.md first (the bank AD-12 scale stays the reference precedent).
- AA-bearing color notes are GENERATED from the DESIGN.md `aa-annotations:` block (story 9.2 — the generator literals died; every note must anchor in the Colors body, anchor lost → generation aborts): 7 entries — 7 verified / 0 open `[ASSUMPTION]` flags. Resolved history: ink-reference-meta (Story 15.2); ink-reference-time (Story 15.2); gold-ink (Story 16.1); link-body (Story 16.1); focus-ring (Story 16.1); engage (Story 15.2); badge-purple (Story 15.2).

Light layer: **100 tokens** on `:host, :root` (colors 18, typography 44, radius 11, spacing 16, shadows 1, motion 10) plus the dark layer: **13 semantic overrides** on `[data-tj-theme="dark"]` AND the native auto leg (`prefers-color-scheme: dark` on `:root:not([data-tj-theme="light"])`).

## Colors

Direct semantic keys from the `colors` block — the ТЖ table IS semantic (no scale/alias indirection) — plus the `link`/`engage` aliases. Restricted inks carry their AA rulings in the Notes column (derived from the DESIGN.md `aa-annotations:` block).

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-color-ink-100` | `#000000` |  |
| `--tj-color-ink-200` | `#333333` |  |
| `--tj-color-ink-300` | `#6E6E6E` |  |
| `--tj-color-ink-reference-meta` | `#A6A6A6` | Restricted: reference meta `#A6A6A6` = 2.434:1 on card — supplementary/decorative meta only; essential meta uses the authored ink-300 `#6E6E6E` (5.099:1). Mirrors the bank kit text-muted restricted ruling. |
| `--tj-color-ink-reference-time` | `#808080` | Restricted: reference time-meta `#808080` = 3.949:1 on card (3.982 on dark-card, unbound) — timestamps and read-time only, never names/titles. |
| `--tj-color-page` | `#F0F0F0` |  |
| `--tj-color-card` | `#FFFFFF` |  |
| `--tj-color-divider` | `#E5E5E5` |  |
| `--tj-color-divider-strong` | `#A6A6A6` |  |
| `--tj-color-gold` | `#C79637` |  |
| `--tj-color-gold-ink` | `#8A6519` | AA override — authored `#8A6519` (5.308:1 on card) replaces the extracted `#C79637` (2.676:1 — fails even the 3:1 large-text bar) for light-theme gold TEXT accents — award/byline chrome; `#C79637` stays the anchor + decorative carrier (rules, ornaments). Dark keeps the reference value — `#C79637` = 5.876:1 on dark-card. Probe10 re-roled the LINK species onto the extracted link-body pair; gold-ink no longer feeds the link alias. |
| `--tj-color-link-body` | `#1414CC` | Measured (Story 16.1) — extracted `#1414CC` (reference --outline-interactive) = 10.491:1 on card / 9.206:1 on page — the in-body link ink; dark `#93A2FF` = 6.630:1 on dark-card / 7.700:1 on dark-page. The hover underline (70% alpha of the ink) is decorative — AA rides the ink. |
| `--tj-color-badge-purple` | `#8054FF` | Restricted: purple `#8054FF` exists ONLY as the 30×30 circular badge fill (non-text carrier, white glyph); never a text or link color. |
| `--tj-color-cta-fill` | `#333333` |  |
| `--tj-color-cta-ink` | `#FFFFFF` |  |
| `--tj-color-focus-ring` | `#8A8AE5` | Restricted: non-text 3:1: `#8A8AE5` = 3.067:1 on card ✓ / 2.691:1 on bare page ✗ — focus rings are card-surface compositions (the ТЖ chrome grammar); dark `#828BBB` = 4.763:1 on dark-card ✓. The reference defines the token but under-applies it (probe10); the kit applies 2px :focus-visible rings — improvement layer. |
| `--tj-color-link` | `#1414CC` |  |
| `--tj-color-engage` | `#A6A6A6` | Restricted: engagement ink: dark `#717277` = 3.277:1 on dark-card — counts/secondary affordances only; the light engage alias rides ink-reference-meta (2.434:1, restricted). |

## Typography

Per-slot tokens from the `typography` block: `--tj-text-<slot>-size` / `-weight` always; `-leading` where DESIGN.md declares it. Families live in the two slots below — every mapping slot's `fontFamily` is a `{typography.<slot>}` reference (one declaration site per family, FR-20).

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-text-display-featured-size` | `55px` | /pro/ featured course cards — the largest type on the site |
| `--tj-text-display-featured-weight` | `700` |  |
| `--tj-text-display-featured-leading` | `1.1` |  |
| `--tj-text-article-h1-size` | `45px` | reading column w764; family RESOLVED probe9 (2026-09-28, live article): computed Graphik 700/45px/50px, fonts.check true — the site ships Graphik as a VARIABLE face (loaded 400+600, covering 700) |
| `--tj-text-article-h1-weight` | `700` |  |
| `--tj-text-article-h1-leading` | `50px` |  |
| `--tj-text-rubric-h1-size` | `38px` | rubric + community h1 |
| `--tj-text-rubric-h1-weight` | `700` |  |
| `--tj-text-rubric-h1-leading` | `45px` |  |
| `--tj-text-article-h2-size` | `38px` |  |
| `--tj-text-article-h2-weight` | `700` |  |
| `--tj-text-article-h2-leading` | `45px` |  |
| `--tj-text-pro-h1-size` | `32px` | inside the purple hero card |
| `--tj-text-pro-h1-weight` | `700` |  |
| `--tj-text-hero-title-size` | `21px` | home card scale — the home "hero" is card-scale, not display |
| `--tj-text-hero-title-weight` | `700` |  |
| `--tj-text-hero-title-leading` | `25px` |  |
| `--tj-text-section-h2-size` | `21px` |  |
| `--tj-text-section-h2-weight` | `700` |  |
| `--tj-text-news-title-size` | `24px` | feed/rubric card titles (news + community posts) |
| `--tj-text-news-title-weight` | `700` |  |
| `--tj-text-news-title-leading` | `30px` |  |
| `--tj-text-card-title-size` | `17px` | meta-colored small card titles |
| `--tj-text-card-title-weight` | `400` |  |
| `--tj-text-article-lead-size` | `27px` | serif lead paragraph, w760 |
| `--tj-text-article-lead-weight` | `400` |  |
| `--tj-text-article-lead-leading` | `35px` |  |
| `--tj-text-article-body-size` | `21px` | serif reading register — w760 |
| `--tj-text-article-body-weight` | `400` |  |
| `--tj-text-article-body-leading` | `30px` |  |
| `--tj-text-pull-quote-size` | `35px` | blockquote — groteske inside the reading column |
| `--tj-text-pull-quote-weight` | `400` |  |
| `--tj-text-pull-quote-leading` | `50px` |  |
| `--tj-text-time-meta-size` | `15px` |  |
| `--tj-text-time-meta-weight` | `400` |  |
| `--tj-text-cta-label-size` | `15px` |  |
| `--tj-text-cta-label-weight` | `400` |  |
| `--tj-text-cta-label-leading` | `20px` |  |
| `--tj-text-nav-label-size` | `17px` | sidebar rubric labels — probe9 census: navItem ×11/11 at 17px/700 Graphik (vision 16/400 was a wrapper artifact: the pill anchors set no family and compute Times; the inner spans carry Graphik) |
| `--tj-text-nav-label-weight` | `700` |  |
| `--tj-text-body-link-size` | `21px` | probe10 census ×8/8: in-body links INHERIT the reading register (Charter 21px, ink = the extracted link-body species); the 15px-grotesque vision read was a wrapper artifact — 15px Graphik links are search-suggest/footer/bubble surfaces, not article body |
| `--tj-text-body-link-weight` | `400` |  |

### Font family slots

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-font-ui` | `Graphik, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif` |  |
| `--tj-font-reading` | `Charter, "Bitstream Charter", "PT Serif", Georgia, serif` |  |

Family slots (FR-20): **ui = Graphik** (grotesque — UI and all headings), **reading = Charter** (serif — the article reading register, the strongest ТЖ identity marker). Stacks carry the reference family names first (licensed consumers auto-pickup, the OQ-2 policy) with open cyrillic-capable fallbacks behind (Inter / PT Serif, OQ-8). No font files are bundled — 15.3 owns fonts; these render as DESIGN.md strings.

An override replaces the whole value: re-include the fallback stack so the DESIGN.md fallbacks stay preserved.

## Radius

Pixel-probed 2026-09-28 (verify/tj-tokens/NOTES.md): cards measure **25** / panels **30** — the vision trio 20/24/32 was deleted (a 9.1 repeat); `icon-tile` measured **7px** on the 30×30 rail tiles; `badge` is a 50% circle. Quiet geometry: r5 CTAs, not pills.

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-radius-input` | `4px` |  |
| `--tj-radius-control-xs` | `8px` |  |
| `--tj-radius-cta` | `5px` |  |
| `--tj-radius-cta-promo` | `10px` |  |
| `--tj-radius-control-sm` | `15px` |  |
| `--tj-radius-chip` | `20px` |  |
| `--tj-radius-card` | `25px` |  |
| `--tj-radius-panel` | `30px` |  |
| `--tj-radius-icon-tile` | `7px` |  |
| `--tj-radius-badge` | `50%` |  |
| `--tj-radius-full` | `9999px` |  |

## Spacing

4-based scale plus the ТЖ layout anchors (reading column w764/w760, sidebar rail w290, main column ~770, header h72, container 1200). Article rhythm is BYO — the reading column is the unit of measure, not the grid.

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-space-4` | `4px` |  |
| `--tj-space-8` | `8px` |  |
| `--tj-space-12` | `12px` |  |
| `--tj-space-16` | `16px` |  |
| `--tj-space-20` | `20px` |  |
| `--tj-space-24` | `24px` |  |
| `--tj-space-32` | `32px` |  |
| `--tj-space-40` | `40px` |  |
| `--tj-space-48` | `48px` |  |
| `--tj-space-64` | `64px` |  |
| `--tj-space-column-reading` | `764px` |  |
| `--tj-space-column-reading-body` | `760px` |  |
| `--tj-space-rail-sidebar` | `290px` |  |
| `--tj-space-column-main` | `770px` |  |
| `--tj-space-header-h` | `72px` |  |
| `--tj-space-container` | `1200px` |  |

## Shadows

FLAT language — the 95-card census measured `box-shadow: none`; surfaces separate by color, not elevation. The single `overlay` shadow is the search-suggest panel extraction; the vision card lifts were deleted. Kept as-is in dark (theme-invariant per the probe battery; 17.2 re-verifies).

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-shadow-overlay` | `0 2px 8px rgba(0,0,0,.1)` |  |

## Motion

Durations and curves come exclusively from these tokens (AD-9); everything respects `prefers-reduced-motion: reduce`. Starting contract = the bank grammar — the ТЖ reference exposed no transitions; per-component verification at each FR-22 gate.

| Token | Value | Notes |
| --- | --- | --- |
| `--tj-motion-curve-expressive-standard` | `cubic-bezier(0.4,0.1,0.2,1)` |  |
| `--tj-motion-curve-expressive-entrance` | `cubic-bezier(0.35,1.3,0.25,1)` |  |
| `--tj-motion-curve-expressive-exit` | `cubic-bezier(0.4,0,1,1)` |  |
| `--tj-motion-curve-productive-standard` | `cubic-bezier(0.2,0,0.4,0.9)` |  |
| `--tj-motion-curve-standard` | `cubic-bezier(0.42,0,0.58,1)` |  |
| `--tj-motion-duration-fastest` | `75ms` |  |
| `--tj-motion-duration-micro` | `100ms` |  |
| `--tj-motion-duration-fast` | `150ms` |  |
| `--tj-motion-duration-moderate` | `300ms` |  |
| `--tj-motion-duration-slow` | `500ms` |  |

Reduced motion is mechanical: under `prefers-reduced-motion: reduce` the stylesheet re-declares every `--tj-motion-duration-*` token to `0ms` on `:host, :root` — theme-independent. Components pair it with opacity-only fallbacks.

## Dark layer (Story 15.2)

The reference's OWN dark values (`prefers-color-scheme` live capture — extraction, not authoring): a cool-dark set (`#12151C` page / `#20232A` cards) with an inverted near-white CTA pill. **Dual emission (EXPERIENCE.md):** the overrides apply on `:host([data-tj-theme="dark"]), :root[data-tj-theme="dark"]` AND natively under `@media (prefers-color-scheme: dark)` on `:root:not([data-tj-theme="light"])` — the OS preference applies dark UNLESS light is forced (`data-tj-theme="light"` keeps light values under a dark OS; the no-flash contract). Typography / radius / spacing / motion / shadows are theme-invariant.

| Token | Light | Dark | Source | Notes |
| --- | --- | --- | --- | --- |
| `--tj-color-page` | `#F0F0F0` | `#12151C` | `colors.dark-page` |  |
| `--tj-color-card` | `#FFFFFF` | `#20232A` | `colors.dark-card` |  |
| `--tj-color-divider` | `#E5E5E5` | `#3E4146` | `colors.dark-divider` |  |
| `--tj-color-divider-strong` | `#A6A6A6` | `#D0D0D2` | `colors.dark-divider-strong` |  |
| `--tj-color-ink-100` | `#000000` | `#FFFFFF` | `colors.dark-ink` | Extraction — dark-ink #FFFFFF: the dark-home pixel census grounds pure-white headline ink (#FFFFFF ×15051 in title bands vs meta #D0D0D2 ×2370); 15.727:1 on dark-card. Dark-article unprobed — 17.2 re-verifies. |
| `--tj-color-ink-300` | `#6E6E6E` | `#D0D0D2` | `colors.dark-meta` | Collapse — the authored light-only AA step (5.099:1) has no dark twin; dark-meta #D0D0D2 (10.211:1 on dark-card) already clears AA. |
| `--tj-color-ink-reference-meta` | `#A6A6A6` | `#D0D0D2` | `colors.dark-meta` | Remap — #A6A6A6 vanishes in dark (census ~76px, artwork-adjacent); dark-meta #D0D0D2 carries the duty. The LIGHT restricted ruling (2.434:1) is untouched — the annotation is a light-theme statement. |
| `--tj-color-cta-fill` | `#333333` | `#F5F5F9` | `colors.dark-cta-fill` |  |
| `--tj-color-cta-ink` | `#FFFFFF` | `#000000` | `colors.dark-cta-ink` |  |
| `--tj-color-link` | `#1414CC` | `#93A2FF` | `colors.dark-link-body` | Probe10 — the link species is the reference's OWN interactive pair: light #1414CC (10.491:1 on card), dark #93A2FF (6.630:1 on dark-card). The 15.2 gold pairing is retired; gold is the award accent. |
| `--tj-color-engage` | `#A6A6A6` | `#717277` | `colors.dark-engage` | Restricted — dark-engage #717277 = 3.277:1 on dark-card: counts/secondary affordances only. The light engage alias rides ink-reference-meta (2.434:1, also restricted). |
| `--tj-color-link-body` | `#1414CC` | `#93A2FF` | `colors.dark-link-body` | Probe10 — the reference dark --outline-interactive; the alias and this direct token source the SAME key (one literal). |
| `--tj-color-focus-ring` | `#8A8AE5` | `#828BBB` | `colors.dark-focus-ring` | Improvement layer — the reference NAMES --outline-focus but under-applies it (probe10); dark #828BBB = 4.763:1 non-text on dark-card. 2px :focus-visible rings on every interactive. |

### Theme invariants

These semantics keep their light values in dark — no override is emitted:

- `--tj-color-gold` — the anchor + decorative/award carrier — clears AA on dark surfaces (5.876:1 on dark-card)
- `--tj-color-gold-ink` — light-only authored AA step for gold TEXT accents — award/byline chrome (probe10 re-roled the link species)
- `--tj-color-badge-purple` — the 30×30 badge stays purple in dark (census #8054FF ×537 present; scoped non-text carrier)
- `--tj-color-ink-200` — light CTA fill duty only — the cta-fill semantic carries the flip; dark strong-UI ink is ink-100/dark-ink
- `--tj-color-ink-reference-time` — unbound in dark (dark-article unprobed; 3.982:1 on dark-card stays restricted class) — the 17.2 dark sweep decides

### Deferred dark palette keys

None — every `dark-*` palette key is consumed by an override (a new unconsumed `dark-*` key aborts generation — no silent drops).
