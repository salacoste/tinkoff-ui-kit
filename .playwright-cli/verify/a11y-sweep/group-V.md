# Group V ledger — the nine v2 surfaces on the SWEEP ENGINE (Story 8.1)

The 6.5 group-IV engine note deferred the matrix extension to this story —
done here: `tests/visual/a11y-sweep.spec.ts` carries a **Group V** registry
(the nine v2 stories; 27 walk/scan legs + 1 targeted leg, both themes for the
walk). Legend: **sweep** = the Group V legs of `tests/visual/a11y-sweep.spec.ts`,
**RM** = `tests/visual/reduced-motion.spec.ts` (story-loop — every v2 story ×
theme since it landed), **axe** = the generated per-theme legs of
`tests/visual/visual.spec.ts`. Group IV's four rows are RESTATED here with
their new engine evidence (its unit/live pointers remain the deep matrix);
the five new rows cite their own suites. Every file:line pointer was opened
during the sweep; bodies confirmed.

Engine extensions this sweep shipped (with their reasons):
- **ringAncestor topology** — tk-data-table paints the unified ring on the
  whole `.row` (`:has(.row__link:focus-visible)`, data-table.css.ts:191), an
  ANCESTOR the v1 carrier set (self / `+` sibling / `.field`) cannot see.
  The carrier is registry-declared per target (`.row`), never swept
  unconditionally — the 5.1 permissiveness ruling holds.
- **cookie-banner walk story** — the playground renders the card OPEN at
  first paint (top-layer); a forward Tab walk from body never enters the
  top layer (probed live: focus stays on body while the card is open). The
  generic walk rides the VARIANTS story (closed banners + demo triggers);
  the open card's keyboard contract is the TARGETED leg (Shift+Tab bounded
  walk → accept pill ring + the Esc-no-dismiss ruling, live).

## tk-filter-chips

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: Space selects + focus preserved `filter-chips.test.ts:153`; re-select no-op `:173`; ←/→ cycle focus chip-to-chip NO value change `:184`; every chip a TAB STOP (the documented APG deviation) `:209`; Enter on «Ещё» mounts the menu with focus inside `:222`; menu arrows/Home/End + Enter `:295`; Escape closes, focus RETURNS to «Ещё» `:276`; outside click `:319`; Tab natural `:338`; Tab OUT closes `:368`; chip press while open selects AND closes `:428`; mid-open items change never strands focus `:392`. LIVE: `tests/visual/filter-chips.spec.ts:42` (top-layer «Ещё» region). ENGINE: sweep V/walk `components-filterchips--playground` — EXACT 8 kit stops (7 chips + «Ещё») forward ≡ Shift+Tab reverse, rings at every stop, both themes. |
| 2 Ring | `.chip:focus-visible` `filter-chips.css.ts:115`; slotted menu rows `::slotted([role='menuitemradio']:focus-visible)` `:224` (the 5.1 slotted-ring lesson, applied at birth); walk pins the ring live ×2 themes. |
| 3 Roles/names/states | tablist + tab wiring with «Ещё» `filter-chips.test.ts:120`; no-overflow no-«Ещё» + clamp `:136`; menu rides the same channel + active-hidden-chip border `:247`; unmatched value clamps `:470`; §2 chains `:477-507`; value-change composed `:585`; ENGINE scan: 8/8 kit surfaces NAMED; axe per-theme. |
| 4 Contrast | Chip label ink on surface-base (the group-III pair family); SELECTED = ink text + yellow border — redundant, never color alone; the one vision note recorded as a non-defect deviation `filter-chips/NOTES.md:93`. |
| 5 Geometry | Chips 44px capsules (NOTES:48); menu rows 48px (NOTES:57); ENGINE scan: every chip ≥44×44 measured live. |
| 6 Reduced motion | Static row; menu mounts fully formed; RM story-loop ×2 themes. |

## tk-pagination

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: «2» commits — page-change, pill moves, focus lands on the NEW ACTIVE `pagination.test.ts:118`; prev/next same landing `:136`; active no-op `:154`; page=1 prev aria-disabled NEVER emits `:165`; next boundary `:182`; load-more bar — page unchanged, focus STAYS `:199`; count=1 hides numbers `:250`; controlled `:309-355`. ENGINE: sweep V/walk `components-pagination--playground` — EXACT 9 kit stops (load-more bar + prev + 6 numbers + next) forward ≡ reverse, rings throughout, both themes. |
| 2 Ring | One unified block `.page/.step/.load-more:focus-visible` `pagination.css.ts:184-186`; walk pins live ×2 themes. |
| 3 Roles/names/states | nav LANDMARK named, overridable `pagination.test.ts:98`/`:366`; aria-current exactly on the active number `:118-136`; chevrons named + aria-disabled at boundaries; page-change composed `:237`; ENGINE scan: 9/9 named; axe per-theme. |
| 4 Contrast | Active pill #333 on #FFDD2D ≈ 9.3:1 (NOTES:58); inactive = link token on surface-base (group-I family); disabled = text-muted + aria-disabled (semantic, not color-only). |
| 5 Geometry | Bar 44px, numbers 44px boxes (sanctioned deviation 7, NOTES:51-67); ENGINE scan: all 9 measured ≥44×44. |
| 6 Reduced motion | Static pager; RM story-loop ×2 themes. |

## tk-combobox-search

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: arrows step WITH WRAP + Home/End + activedescendant `combobox-search.test.ts:312`; APG edges (ArrowUp opens at LAST row; Home/End do NOT open) `:340`; End scrolls into view `:356`; Enter commits — re-render to label, menu closes, focus STAYS `:371`; committed-row Enter = close-no-change `:391`; closed Enter inert `:404`; Escape closes AND restores `:413`; outside press + focus return `:467`; Tab path natural `:485`; IME composition pauses `:531`. LIVE: `tests/visual/combobox-search.spec.ts:47` (open path, width-matched) + `:114` (closed = hidden attr AND computed display). ENGINE: sweep V/walk playground — EXACT 1 kit stop (the field input) forward ≡ reverse, ring pinned ×2 themes. |
| 2 Ring | Field control `combobox-search.css.ts:119` (the `.field`-box register); walk pins live. |
| 3 Roles/names/states | Combobox aria wiring + hidden listbox `:127`; label/placeholder override accnames of field AND panel `:155`; polite region announces MATCH COUNTS with RU pluralization `:236` (decades `:255`, overrides `:272`) — the announcement half of the six checks; zero matches = disabled empty row, NO activedescendant `:286`; committed row aria-selected + glyph `:429`; controlled/uncontrolled `:672-743`; ENGINE scan on the OPEN story (field + generated options); axe per-theme. |
| 4 Contrast | Field text on surface-field; rows text-primary/secondary on surface-base — the group-III pair families; no new pairs. |
| 5 Geometry | Field 48px+ (NOTES:83); rows 48px radius-sm (NOTES:93); ENGINE scan ≥44 throughout. |
| 6 Reduced motion | Panel mounts fully formed (no entrance animation); RM story-loop ×2 themes. |

## tk-navbar (мега-навигация — расширение 7.1)

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: keyboard order row-1 links → utilities slot → row-2 links, every stop a real anchor `navbar.test.ts:755`; <768 hides the sub-nav, drawer stays v1 (row-1 only) `:713`/`:728`; Esc/Return drawer mechanics = the v1 legs (`:337`, burger leg of the sweep); sub-link clicks dispatch nothing `:861`. ENGINE: sweep V/walk `components-navbar--mega-nav` — EXACT 14 kit stops (5 row-1 + 2 utilities + 6 row-2) forward ≡ reverse, rings at every stop incl. the slotted utility chips, both themes. The v1 playground walk stays the Group III row. |
| 2 Ring | `.link/.sublink/.drawer__link:focus-visible` one block `navbar.css.ts:209-211`; burger `:363`; utility chips carry the F2 min-width-44 recipe (story css) and ring at their own anchor; walk pins live ×2 themes. |
| 3 Roles/names/states | TWO named nav landmarks («Навигация» + subLabel default «Разделы») + aria-current on BOTH actives `navbar.test.ts:822`; **empty-name fallback (8.1 fix, 7.1 N1)**: `sub-label=""`/`burger-label=""` (whitespace incl.) fall back to the defaults — nav 2, burger AND drawer dialog never render nameless (new unit test after `:859`); unmatched subActiveValue marks NOTHING `:675`; empty subLinks = byte-identical v1 `:803`/`:534`; ENGINE scan: 14/14 named; axe per-theme. |
| 4 Contrast | Row-2 active = 700 weight + ink + 2px gray stroke (text-secondary) — TRIPLE-redundant state (NOTES:64; weight carries it alone in forced-colors); row-1 = the v1 yellow-stroke + 700 family (group-III); the row-2 stripe stays gray by the recorded ruling (7.1 N2). |
| 5 Geometry | Row 2 = 64px capture literal (NOTES:60) — every sub-link box ≥44 measured live by the scan; utilities ≥44 (F2 recipe); burger 44 (the Group III 360 leg). **Stress-case NOTE (7.1 N4, ledger-recorded):** a consumer overflowing row 2 can shrink a `.sublink` box below 44px — identical to the v1 `.link` mold, kit-inherited, out of 7.1 scope BY TRIAGE; shipped stories all measure ≥44. |
| 6 Reduced motion | The scrolled shadow/hairline ride the 150ms token with the reduce belt (`navbar.test.ts:131`); RM story-loop ×2 themes incl. all four mega stories. |

## tk-data-table

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: FIRST row anchor is the single tab stop `data-table.test.ts:211`; arrows CLAMPED no-wrap `:213`; Home/End `:247`; Enter NATIVE (anchor navigates), Space = click `:265`; inert rows skipped `:325`; roving survives data change `:362`; focusin follows real focus `:448`; non-anchor keydown inert `:459`. LIVE: `tests/visual/data-table.spec.ts:59` (chromium keyboard contract). ENGINE: sweep V/walk playground — EXACT 1 kit stop, ring resolved on the ROW carrier (the new `ringAncestor: '.row'` topology), ×2 themes. |
| 2 Ring | The WHOLE ROW rings — `.row__link:focus-visible { outline: none }` + `.row:has(.row__link:focus-visible)` `data-table.css.ts:187-194`, keyboard-only guard (module header `:34-39`); structural pin `data-table.test.ts:439`; the engine now pins it LIVE (the ancestor carrier the v1 engine could not see — closed deliberately per-target). |
| 3 Roles/names/states | role=table named via caption/aria-label `:406`; header + grid rows two-line anatomy `:124`; delta semantics BOTH lines `:147-159`; zero-state copy outside the role `:281`; unknown keys degrade `:296`; one anchor per row, whole-row href `:172`; no channel events `:188`; ENGINE scan: 10/10 anchors named; axe per-theme. |
| 4 Contrast | Names/deltas on surface-base incl. the 6.1 delta rows (contrast.test.ts:203-206, the scope ruling at `:199`); the sign ALSO lives in the data strings («+1,46 %» / «−0,9 %») — color never the only channel; name link = ink, no synthetic underline `:440-443`. |
| 5 Geometry | Full-row hit area — the anchor's `::after` inset-0 stitch over the positioned 81px row (css `:177-181`, pin `:172`); ENGINE scan measures the STITCHED row box (81px ≥44) for all 10 rows; header cells non-interactive; 100 rows keep the contract `:376`. |
| 6 Reduced motion | Hover fill is a color change, not motion; RM story-loop ×2 themes. |

## tk-cookie-banner

| Check | Evidence |
|---|---|
| 1 Keyboard | Unit matrix: open mounts on the modal layer, NAMED, non-modal, focus on «Хорошо» `cookie-banner.test.ts:124`; **Esc is PREVENTED, not answered — no dismiss, no open-change (the RECORDED RULING: consent is a positive act; a ledger row, NOT a violation)** `:222`; Esc inert while closed `:238`; outside press mutates nothing `:249`; **Tab flows NATURALLY (no trap — non-modal)** `:271`; open=false releases, focus returns to the opener `:337`; close while focus elsewhere restores nothing (no yank) `:360`. LIVE: `tests/visual/cookie-banner.spec.ts` — open card (element-API path, non-modal dialog contract, focus on accept) + closed computed-display pin. ENGINE: V/walk on VARIANTS (the top-layer playground defeats a forward walk — probed, see the engine notes) EXACT 4 kit stops (demo triggers) forward ≡ reverse; TARGETED leg: bounded Shift+Tab walk reaches the accept pill — REAL keyboard focus, ring contract, Esc-no-dismiss pinned LIVE. |
| 2 Ring | `.banner__accept:focus-visible` `cookie-banner.css.ts:185-187`; slotted link `::slotted(a:focus-visible)` `:144` (the 5.1 slotted-ring lesson) — sheet-pinned `cookie-banner.test.ts:305`; the targeted leg pins the accept ring live against the theme token. |
| 3 Roles/names/states | role=dialog NON-modal (aria-modal ABSENT — the scrimless ruling), named via label (overridable) `:430`; accept names the pill `:419`; consent-choice composed + detail `:396`/`:207`; open reflects `:412`; first-paint change-guard `:160`; zero-bespoke pin `:460`; ENGINE scan on the playground: slotted link named via aria-label, trigger + accept named; axe per-theme. |
| 4 Contrast | Card = text-secondary on surface-base (group-III family); the charcoal-panel demo figcaption inherits the panel white (the in-story axe fix, stories `:148-152`); no new pairs. |
| 5 Geometry | Accept = the §8 44px hit floor with the 32px visible pill inside (NOTES:64, live-pinned by the spec); card width band [180, 212] (NOTES:57, the measured reference cap); the slotted link is display:inline prose — the ruled text-target exception. |
| 6 Reduced motion | No-motion ruling frozen at birth (never-list; the spec header); RM story-loop ×2 themes. |

## tk-stepper

| Check | Evidence |
|---|---|
| 1 Keyboard | N/A BY CONSTRUCTION — zero interactive surfaces (a static numbered card row); PROVEN by the renders test: badges aria-hidden paint, no control elements `stepper.test.ts:64`; ENGINE walk: EXACT 0 kit stops, forward ≡ reverse (the badge/progress-bar precedent). |
| 2 Ring | N/A by construction — nothing focusable (the 0-stop walk proves it live ×2 themes). |
| 3 Roles/names/states | N/A interactive-wise BY CONSTRUCTION: the numbered badges are aria-hidden PAINT `:64` (numbers live in the visual order, not a list role — the reference's own reading); heading h2 when set `:168`; CTA slot rides the consumer's own content `:104`/`:114`; ENGINE scan: 0 kit surfaces; axe per-theme (all stories). |
| 4 Contrast | Title/body = text-primary on surface-base; body-l 400 `:51`-family (NOTES); the 56×56 badge fill is the recorded brown-flag deviation 1 (NOTES:47) — numerals contrast against it asserted in the story's own a11y table; no new mechanized pairs (the family rows cover the text). |
| 5 Geometry | N/A interactive-wise by construction (no targets); the 56×56 badge/48 gap/one-column collapse pins `:77`/`:86`/`:155` (structure, not hit-areas). |
| 6 Reduced motion | Never-list pin — zero transition/animation declarations `:184`; RM story-loop ×2 themes. |

## tk-store-badges

| Check | Evidence |
|---|---|
| 1 Keyboard | N/A BY CONSTRUCTION for arrows/Space (external `<a>` pills — native anchors); Tab/Shift+Tab: ENGINE walk `components-storebadges--playground` — EXACT 3 kit stops (the three pills) forward ≡ reverse ×2 themes; Enter = the anchor's own navigation (no channel events by design — the navbar family). |
| 2 Ring | `.badge:focus-visible` — the unified 2px token ring sheet-pinned `store-badges.test.ts:129-136`; walk pins it live ×2 themes. |
| 3 Roles/names/states | Accname = the VISIBLE label alone — icon decorative by default (alt=""), iconAlt overrides `:99`; every pill an external link (href, _blank, noopener+noreferrer) `:116`; uniform 3-pill size class `:62`; label-only degrade `:88`; zero-state copy slot `:138`; ENGINE scan: 3/3 named; axe per-theme. |
| 4 Contrast | Label = text-primary on the pill fill (surface-base family); hover = instant fill step (no color-only state — the label text carries everything). |
| 5 Geometry | The §8 target rides the 80px pill (`:129-136`, NOTES:46-47 — the 324px uniform-basis size class); ENGINE scan: all 3 pills measured ≥44×44. |
| 6 Reduced motion | Never-list pin (zero transitions; hover is an instant step) `:168`; RM story-loop ×2 themes. |

## tk-qr-block

| Check | Evidence |
|---|---|
| 1 Keyboard | COMPOSE-VERBATIM: the strip is the v1 tk-tabs element itself — arrows/Home/Tab behave per the v1 tabs contract, automatic activation, no interception `qr-block.test.ts:98`; value-change crosses both boundaries from tk-tabs itself — the class dispatches nothing `:115`; ENGINE walk `components-qrblock--playground` — EXACT 1 kit stop (the tab row), forward ≡ reverse ×2 themes. |
| 2 Ring | The v1 tabs ring (group-II row) — the block's own sheet touches ONLY geometry (the compose-verbatim pin: zero `--tk-tabs-*` overrides `:130`); walk pins the ring live ×2 themes. |
| 3 Roles/names/states | Two named tabs (both labels) `:69`; each tab's panel = note copy + the QR tile in tk-tabs' named slot `:78`; **the QR image announces «QR-код для {label}»** (auto-composed alt, monochrome consumer art) `:158`; title h2 when set `:168`; note-omitted degrade = tile only `:143`; zero-tab clamp `:179`; ENGINE scan: 2/2 tab buttons named; axe per-theme. |
| 4 Contrast | Tabs/labels = the v1 tabs pairs (group-II family); the tile is consumer art (monochrome by the reference); no new pairs. |
| 5 Geometry | The tab track = the v1 44px floor (group-II legs); the tile is a non-interactive image (the announced alt is the a11y channel); ENGINE scan: both tabs ≥44×44. |
| 6 Reduced motion | Static block (the v1 tabs never-list applies); RM story-loop ×2 themes. |

## Mechanical fixes landed IN THIS SWEEP (the spec's triage hooks)

| # | Item | Disposition |
|---|---|---|
| F1 | `sub-label=""` / `burger-label=""` stripped accessible names (7.1 N1; string-prop parity). | FIXED: navbar.ts render-side fallback (`trim() \|\| default`) for nav 2, the burger button AND the drawer dialog; unit test added (`navbar.test.ts`, after `:859`); jsdoc updated; argTypes controls for subActiveValue/subLabel added (7.1 N3 polish). Changes NO rendered story default (defaults untouched). |
| F2 | Kit-wide `:host([hidden])` sweep (deferred-work 6.3 N6). | EXECUTED: 18 unguarded sheets gained the guard (first pass); the PATTERN test `tests/hidden-guard.test.ts` found FIVE more — the multi-sheet components (combobox-search, cookie-banner, filter-chips, modal, tooltip) carried the guard only in their SURFACE sheets, leaving the kit HOSTS unguarded (`hidden` on tk-modal rendered!) — 18+5 = 23 sheets patched, 33/33 guarded total (the 10 pre-guarded sheets included); pattern-level pins (guard-in-SAME-sheet + roster tripwire 33/27). |
| F3 | tk-data-table row ring invisible to the engine (ancestor carrier). | ENGINE: registry-declared `ringAncestor: '.row'` topology (per-target, documented); the row-ring design itself was already correct (css + structural pin). |
| F4 | Cookie-banner forward-walk incoherence on the first-paint top-layer story. | ENGINE: walk rides the variants story; a targeted leg drives the open card's keyboard contract live (Shift+Tab bounded walk + ring + Esc-no-dismiss). Recorded, not waived. |
| R1 | `.sublink` consumer-stress shrink below 44px (7.1 N4). | RECORDED here (navbar row 5): identical to the v1 `.link` mold, kit-inherited; all shipped stories measure ≥44. |
| R2 | Cookie-banner Esc-no-dismiss. | RECORDED RULING (7.2), NOT a violation — re-pinned live by the targeted leg. |

**Group V total: 9 components × 6 checks = 54/54 cells evidenced; 28 new
engine legs green ×both themes where applicable; the four group-IV rows now
carry engine evidence alongside their unit/live matrices.**
