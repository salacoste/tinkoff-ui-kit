# ТЖ token freeze — live pixel-probe forensics (story 15.2 pre-work)

Session: playwright-cli `tinkoff-ui`, 2026-09-28, viewport 1280×800, light (system).
Method: `page.evaluate` computed-style censuses (radius | shadow signatures over
text-bearing elements ≥40×20) + targeted probes. Scripts archived here
(tj-probe1/3/7.js). READ-ONLY: navigation + computed styles only, nothing
entered or submitted.

## Surfaces probed

1. Home `/` — full census
2. Rubric `/flows/invest/` — full census
3. Article `/news/metro-ukaz-putin/` — full census
4. `/pro/` (Учебник) — full census + purple-carrier scan (rgb 128,84,255)

## Measured radius language (light)

| Value | Carrier (live evidence) | Count |
|---|---|---|
| **5px** | `a` CTA «Написать» — h30 w98 bg #333 (#FFFFFF ink), fs15/400 | home+flows |
| **8px** | `a._applicationLink_` store links [138×35 / 115×35] | home/flows/pro |
| **10px** | `a._button_1ybcb_5` /pro/ CTAs [160×50, 198×50] — incl. PURPLE bg carriers | /pro/ |
| **15px** | `a._root_1lxog_1` engagement buttons [70×30]; `li._tag_1nh9u_9` /pro/ tag list [184×45] | article, /pro/ |
| **20px** | `a._pill_rh58a_3` tag chips [121×40, 127×40] | home/flows/pro |
| **25px** | `div._card_1l4p8_7` feed cards [760×270]; `div._foreground_blpgw_7` feed rows [760×65]; `div._contentArticle_` article media [930×…] | 95× home, 56× flows |
| **30px** | `section._root_1y55r_3` [1260×134]; `header._root_e67ic_6` /pro/ purple hero [1260×600]; `a._root_3pc5n_3` top-rounded 30/30/0/0 [1180×215] | /pro/ |
| **40px** | `a._pillText_5qunn_49` [127×40] — pill = height (full) | /pro/ |
| **50%** | `div._uraniaIcon_` PURPLE badge 30×30 (#8054FF); dots `span` 7×7 #D43B2D / 10×10 #1414CC | /pro/, header |
| **4px** | suggest input (search) | home |
| 200/200/200/0 | `div._root_h154k_1` decorative squircle [228×360] purple | /pro/ (pattern-level, NOT a token) |
| 15px top-only | `div._root_nx8i2_4`; bottom-only `div._main_1o4n2_23` 0/0/25/25 | misc |

## Measured shadow language

- **Cards: NO shadow anywhere.** 95-card census, feed rows, article media — all
  `box-shadow: none`, flat on the #F0F0F0 page with card #FFFFFF. The reference
  separates surfaces by COLOR, not elevation.
- The ONLY measured shadow: search-suggest panel `div._suggest_` [35×330] →
  **`rgba(0,0,0,0.1) 0px 2px 8px 0px`** (i.e. `0 2px 8px rgba(0,0,0,.1)`).
- No hover-lift shadows observed (censuses were non-hover state; hover shadow
  would contradict the flat language — treat as none unless a component story
  proves otherwise).

## Verdicts vs the vision estimates (DESIGN.md pre-probe)

| Token (vision) | Measured | Ruling |
|---|---|---|
| `card-sm 20 / card-md 24 / card-lg 32` | **25px** everywhere cards live; 30px for panels/hero | COLLAPSED: `card: 25px`, `panel: 30px` — the trio was a vision artifact (9.1 repeat) |
| `icon-tile 12px` | rail tiles 30×30 **r7** (probe8 addendum) | CORRECTED: `icon-tile: 7px` — the mid-session «no carrier» was a census text-filter artifact |
| `cta 5px` | 5px h30 #333 ✓ | CONFIRMED (+ new fact: /pro/ CTAs are r10 h50 — separate register `cta-promo`) |
| `badge 50%` | 50%, purple badge is 30×30 ✓ | CONFIRMED |
| `shadows.card / card-hover / floating` | cards FLAT; only overlay shadow exists | SUPERSEDED: `overlay: 0 2px 8px rgba(0,0,0,.1)`; card lifts DELETED |
| (chips unmarked) | 20px [127×40]; /pro/ pillText 40px=pill(h) | NEW: `chip: 20px`; pillText rides `full` |
| (engagement unmarked) | 15px [70×30] | NEW: `control-sm: 15px` |
| (store links unmarked) | 8px [138×35] | NEW: `control-xs: 8px` |
| (suggest input) | 4px | NEW: `input: 4px` |

## Dark-theme note

Dark values share the same layout classes (native `prefers-color-scheme`
flip); radii/shadows are theme-invariant on the reference — dark cards are the
same r25 flat on #12151C/#20232A. [ASSUMPTION — same-class parity; the 15.2
dark-sweep story (17.2) re-verifies mechanically.]

## Purple carriers scan (/pro/) — scope confirmation

#8054FF appears ONLY as: 30×30 r50% badge, hero panel bg [1260×600 r30],
decorative squircles [228×360], CTA fills [160×50 r10]. No text-on-white, no
general surfaces → the scoped-carrier ruling (DESIGN.md aa-annotations) holds.

## Addendum (probe8, same session): rail icon tiles

The rounded-key drop of `icon-tile` was premature — the rail's icon carriers
are `span._icon_` **30×30, border-radius 7px** (transparent bg; filtered out
of the earlier censuses by the text-content guard). DESIGN.md restored
`icon-tile: 7px` and corrected `sidebar-rail.icon-tile` 40px→30px (measured).

## Addendum (probe9, 2026-09-28 late): 16.1 verify-at-story items — article page

Session: same tinkoff-ui playwright-cli session, read-only. Page:
`/news/metro-ukaz-putin/` (the reconnoitered article). Scripts: /tmp/tj-h1-probe{,2}.js
(transient — logic recorded here).

1. **article-H1 family RESOLVED = Graphik** (the heads-grotesque assumption held):
   computed `Graphik, "Apple Color Emoji", "Noto Color Emoji", sans-serif`,
   700 / 45px / 50px on `h1._articleTitle_1vffn_42`; `document.fonts.check('700 45px
   Graphik')` true — the site's Graphik is a VARIABLE face (loaded set: 400 + 600,
   covering 700 requests).
2. **nav-label CORRECTED: 17px / 700 Graphik** (vision said 16/400 — artifact):
   census `[class*=navItem]` ×11/11 all 17px/700 («Новости», «Дневники трат»,
   «Инвестиции» rail). The header pills `_pill_rh58a_3` show computed "Times" 16/400 —
   WRAPPER artifact (the anchor sets no family; the inner span carries Graphik) — not
   a token fact.
3. Reading register CONFIRMED exact: lead `_lead_lrct0_3` Charter 27/400/35 ✓;
   body `_paragraph_1w7nq_3` Charter 21/400/30 ×8 ✓. Charter loads as 400 ONLY on the
   live site (no bold serif — matches our 400-only reading register).
4. In-article sub-styles census (context for 16.1 prose work): Graphik 17/400/25 ×4
   (embed captions), Graphik 15/400/20 (time-meta), Graphik 15/700/20 (byline),
   Graphik 10/400/13 (fine print).
5. Live loaded-faces census: Graphik 400/600(var), Charter 400, Ruble Sans 400/500/600
   (₽ symbol font), Tinkoff Sans Condensed 300, YS Text Variable (ad modules), Noto
   Color Emoji. Ruble Sans = potential future fine-detail for money glyphs — noted,
   NOT a token (no ТЖ surface needs it yet).

DESIGN.md amendment PENDING (orchestrator, lands with the 16.1 pre-work regen AFTER
15.3 closes — editing now would drift the generated artifacts under the executor):
`article-h1` note → resolved-probed; `nav-label` → 17px/700. Then
`pnpm gen:tokens:tj` + gates.

## probe10 — link species + focus system (2026-09-28, live article + reference CSS)

Session `tinkoff-ui`, article `/news/metro-ukaz-putin/` (probe9 page, still open).
Forensics for the 16.1 pre-work amendment #2 — the link/focus evidence that
re-pointed the ТЖ link tokens off gold. Scripts: /tmp/tj-link-census.js,
/tmp/tj-link-ctx.js, /tmp/tj-ratios.js; CSS pulled to /tmp/tj-*.css.

### Anchor census ×171 (visible anchors, computed styles)

Species that matter:
- **×8/8 in-body article links** (`A._a_1n56p_7` in `P._paragraph_1w7nq_3`):
  `rgb(20,20,204)` Charter 21px/400 INHERITED, `text-decoration: underline` with
  `text-decoration-color: rgba(0,0,0,0)` — the underline EXISTS but paints
  transparent at rest; thickness 1px, offset .1em (2.1px @21px), position under.
  transition 0s at rest (hover transition lives in the hover rule).
- **×10 gold Graphik 15px** = like-bubbles `_bubble_rjnkt_1` (highlighted state
  rides `--surface-award` = the gold). Gold is the AWARD accent, not the link ink.
- **×23 black Graphik 17px `_link_jp6vv_241`** = SEARCH-SUGGEST dropdown items
  (`_suggest_jp6vv_187`) — NOT a body species; out of 16.1.
- **×68 black Times 16 + ×7 rgb(0,0,238) Times** = ad modules / unstyled anchors
  (UA defaults) — FR-21 main-kit boundary / no design species.
- Footer/cookie/app links gray+white Graphik 10-15px — later stories' chrome.

### The reference's OWN link system (minerva/v120/link.css + hedge/v148-1/index4.css)

`._a_1n56p_7` base: `color: rgb(var(--outline-interactive))`; underline `#0000`
at rest; `:hover` → `text-decoration-color: var(--color-link-border-hover)` =
`rgba(--outline-interactive, .7)`, `transition: text-decoration-color .1s
ease-in-out`. Ink color does NOT shift on hover (ink-stable hover). Variants:
`data-secondary` (ink + always-on .3-alpha underline, hover .7), `data-pseudo`
(dashed gradient underline), `data-surface=positive/negative/warning/...`,
`data-inverse`. Theme vars (index4.css `:root` / `prefers-color-scheme: dark` +
`.tj-auto-theme` class channel — the site has BOTH mechanisms):
- `--outline-interactive: 20,20,204` / dark `147,162,255`
- `--outline-interactive-hover: 1,1,160` / dark `129,129,246` (exists; unused by
  the base link hover — recorded, no token minted)
- `--outline-secondary: 0,0,0` / dark `208,208,210` (= dark-meta)
- `--opacity-link-border: .3`→`.5` dark; `--opacity-link-border-hover: .7` both
- `--outline-focus: 138,138,229` / dark `130,139,187`

### Focus system (the a11y reality)

Only ONE :focus rule across all fetched sheets: like-bubbles
`outline-color: rgb(var(--outline-focus))` (UA outline otherwise). Body links:
UA `outline: auto` (nothing authored). CTA (janus Button.css): `outline: none` —
SUPPRESSED (gap). CTA small sizing confirmed: `data-size=small` → r5, padding
5px 15px (h30), `transition: background-color .1s ease-in-out`.

### Consequences (landed as the 16.1 pre-work amendment #2)

- DESIGN.md: link-body #1414CC / dark-link-body #93A2FF + focus-ring #8A8AE5 /
  dark-focus-ring #828BBB; `--tj-color-link` re-pointed off gold (gold-ink
  re-roled to award-text accent); body-link typography corrected 15/grotesque →
  21/Charter-inherited; motion: duration-micro 100ms + curve-standard (the
  measured ease-in-out bezier); editorial-link + cta-write component anchors
  rewritten (focus fields, hover grammar).
- Machine ratios (3-dec, tj-ratios.js — sanity #000/#FFF = 21.000): link-body
  10.491 card / 9.206 page; dark 6.630 dark-card / 7.700 dark-page; focus-ring
  non-text 3.067 card / 2.691 page (RESTRICTED to card compositions); dark
  4.763. Pinned in tests/tj-contrast.test.ts (light 18 / dark 13 key sets).
- Generator: `dark-link` palette key RETIRED (core blocks dark-*→dark-* refs —
  the alias + direct token now source dark-link-body, one literal); DARK_OVERRIDES
  +link-body +focus-ring; stale gold-asymmetry literals rewritten.
- Underline alpha (.3/.7) is a use-site composition (color-mix against the
  theme-aware ink) — mirrors the reference's compose-at-use architecture; core
  requires dark-override derived values to be hex, so no rgba tokens.
- Process gotcha recorded: an inline-JS ratio script lied (zsh quoting +
  slice(1,3) assumed a '#' prefix — 'FFFFFF' parsed as [255,255,15], sanity
  19.563 instead of 21.000). File-based rerun with [0,2,4] slices + sanity pin
  is the mold; the repo's own parseHex strips '#' via regex and is unaffected.
