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
