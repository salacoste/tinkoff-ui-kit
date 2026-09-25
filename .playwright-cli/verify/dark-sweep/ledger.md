# Dark sweep ledger — 19/19 (Story 5.4, 2026-09-23) — extended 28/28 (Story 8.2, 2026-09-25)

Method + rulings + findings: `NOTES.md` (same directory). Evidence legend:
**engine** = `tests/visual/dark-sweep.spec.ts` leg
`dark sweep: <component> — theme-flip paint audit` (structure parity /
computed AA pairs incl. slot-aware alpha chains / light-only leftovers /
invariant holds / shadow collapse / border presence / yellow-keeps-ink),
**visual** = generated `tests/visual/visual.spec.ts` legs (screenshot +
axe, every story × theme), **contrast** = `tests/contrast.test.ts` rows
(57-pair mechanized table: 30 light / 27 dark, generated-sourced),
**branch** = `tests/zero-theme-branches.test.ts`,
**gen** = `packages/tokens/scripts/generate.mjs` generation-time asserts.
All 19 engine legs PASS post-fix; the failures they caught on the way in
are the F1–F4 fixes (NOTES.md). **Story 8.2** extends the registry to the
nine v2 components (rows below) + the two delta verdict legs + the six
warm-cream/table [ASSUMPTION] dispositions (the 5.4 mold, sections at the
bottom); its one finding is **F5** (store-badges anchor color channel).

## Per-component dark evidence (28 components × the sweep's check set)

| Component | Structure parity | AA pairs (dark) | No light-only leftovers | Invariants (yellow/ink/charcoal hold) | Shadows collapse (UX-DR2) | Borders present | Yellow keeps ink |
|---|---|---|---|---|---|---|---|
| tk-button | engine (playground) | engine + contrast 9.405/12.635/17.404 rows | engine (secondary pill = surface-base, hairline remap; canvas fix F4) | engine (yellow-100/200/300 fill FORCE-held; inverse flip = the sanctioned exemption R3) | engine (default/hover shadows → none in dark) | engine (1px secondary hairline → #FFFFFF24, width kept) | engine (full-cover ::before yellow + ink label; live) |
| tk-link | engine (variants) | engine + contrast link rows (4.624 light / 6.836 dark) | engine (canvas fix F4) | n/a (no invariant fills) | engine | engine (no borders by design) | n/a |
| tk-badge | engine (variants) | engine + contrast incentive 4.742 / stat 12.635 rows | engine (canvas fix F4) | engine (green-100 + ink-300 fills FORCE-held) | engine (flat chips — none in both) | engine (borderless pills by design) | n/a (green pairs ink by the same engine rule) |
| tk-progress-bar | engine (playground) | engine + contrast header-label rows | **F1 FIXED here**: track gray-200 → border-default (white-alpha rail, computed `rgba(255,255,255,0.14)` probed) | engine (fill blue-100 = indicator ruling R2) | engine (none) | engine (track edge = radius clip, no border) | n/a (fill is text-less — indicator scope) |
| tk-modal | engine (open story, overlay root) | engine + contrast panel-text rows (12.635 light / 17.404 dark) | engine (panel surface-base → #1A1A1A; scrim decorative R2) | engine | engine (modal shadow → none; tonal panel) | engine (panel hairline remap) | n/a |
| tk-tooltip | engine (open story) | engine + contrast white-on-ink 12.635 (theme-invariant fill) | engine (ink-300 pill unchanged = FORCE-held) | engine (ink-300 FORCE-held) | engine (tooltip shadow → none) | engine | n/a |
| tk-toast | engine (stack story, #tk-toast-stack) | engine + contrast toast rows | engine (card surface-base → dark; icon green-200 = R2) | engine | engine (default shadow → none) | engine | n/a |
| tk-input | engine (playground) | engine + contrast field rows (11.126 light / 13.009 + 7.303 composited dark) | engine (field → #FFFFFF1A; placeholder = F5 ruling, ≥3:1 held) | engine (success icon green-100 R2) | engine | engine (focus ring = outline, not shadow; box hairline remap) | n/a |
| tk-select | engine (open story) | engine + contrast select rows | **F3 FIXED here**: option hover gray-100 → surface-muted (dark #222222; active ordering preserved) | engine | engine (dropdown shadow → none) | engine | n/a |
| tk-checkbox | engine (playground) | engine | engine (box surface-base → dark + white-alpha hairline; checked = yellow+ink) | engine (yellow-100 checked fill FORCE-held) | engine | engine (unchecked border-default → #FFFFFF24 visible on dark) | engine (checked box carries ink check glyph) |
| tk-segmented-radio | engine (playground) | engine | engine (segment fill surface-base → dark; inset hairline ring survives) | engine (dot center ink-300 + yellow fill FORCE-held) | engine (track hairline = inset ring, legal) | engine (inset 1px border-default ring remaps) | engine (dot is text-less — indicator scope) |
| tk-thumbnail-picker | engine (playground) | engine | engine (tiles + inset border-strong → #FFFFFF3D; swatch art = R1 ruling) | engine (selected ring ink-300 FORCE-held) | engine | engine (inset hairline ring, width kept) | n/a |
| tk-tabs | engine (playground) | engine | engine (active pill surface-base → dark + hairline belt — the documented 3.3 dark-canvas belt) | engine | engine (pill shadow → none; hairline keeps the edge) | engine (pill border-default remap) | n/a |
| tk-navbar | engine (playground) | engine | engine (bar fill surface-base → dark) | engine (yellow-100 underline FORCE-held; redundant-indicator AA ruling) | engine (bar shadow → none) | engine (bar hairline remap) | engine (underline = strip scope; link text stays the state carrier) |
| tk-footer | engine (playground) | engine + contrast rows | engine (pill ink-300 + white text unchanged = FORCE-held; columns remap) | engine (ink-300 pills FORCE-held) | engine | engine | n/a |
| tk-promo-card | engine (playground) | engine + contrast tint-pairing rows (15.5/8.4/6.1 dark) | engine (tints → dark-tint-*; **F2** skeleton → border-default; charcoal CTA = Tier-B white-on-invariant) | engine (charcoal #333333 FORCE-held — the invariant; CTA pill white + ink-300) | engine (flat tinted cards — none in both) | engine | n/a |
| tk-feature-card | engine (playground incl. editorial) | engine + contrast rows | engine (editorial charcoal FORCE-held; CTA Tier-B — slot-aware chain proven after the parentIndex fix) | engine (charcoal editorial + white pill/ink text) | engine (flat cards) | engine | n/a |
| tk-service-card | engine (playground) | engine + contrast rows | engine (tints remap; link re-scope via --tk-service-card-link → white on charcoal) | engine | engine | engine | n/a |
| tk-article-card | engine (playground) | engine + contrast rows | engine (tints remap; **F2** skeleton → border-default; stitch ::after full-cover) | engine | engine | engine | n/a |
| tk-filter-chips *(8.2)* | engine (playground) | engine — chip labels text-primary 17.404:1 on the dark chip fill; placeholder/«Ещё» same family | engine (chips surface-base → #1A1A1A; menu rows ride the overlay layer — the F3 surface-muted hover recipe, engine-verified on the open state via the combobox leg) | engine (SELECTED = 2px yellow-100 BORDER — the YELLOW family, legal; fill/text unchanged by design, selection never color-alone) | engine (flat chips — none) | engine (idle 1px border-default → #FFFFFF24 remap; selected 2px yellow width-kept) | n/a (selected yellow is a border strip, not a fill behind text — the text carrier stays the pill itself) |
| tk-pagination *(8.2)* | engine (playground) | engine — inactive numbers = link token 6.836:1 on dark-base (the v1 link row); ink active label on yellow | engine (bar surface-base → #1A1A1A) | engine (active pill yellow-100 fill FORCE-held + ink label — «1» keeps ink in dark) | engine (flat pager — none) | engine (no borders by design) | engine (active pill full-cover yellow + ink «1»; live) |
| tk-combobox-search *(8.2)* | engine (open story — the select precedent: the dropdown paints only opened) | engine — field text 13.009:1 on the composited #FFFFFF1A field (the v1 input row); panel rows 17.404:1 on #1A1A1A; placeholder ≥3:1 restricted | engine (field → #FFFFFF1A; panel surface-base → #1A1A1A; option hover surface-muted — the F3 recipe at birth) | engine | engine (dropdown shadow → none; tonal panel) | engine (field box hairline remap) | n/a |
| tk-navbar [mega-nav] *(8.2)* | engine (mega story — the v2 registry row; the v1 playground walk stays the Group III row) | engine — bar/sub-nav links remap; utility chips measured | engine (two-deep bar surface-base → #1A1A1A; sub-nav row same) | engine (active sub-nav section marking survives; yellow-100 underline strip FORCE-held) | engine (scrolled bar shadow → none; hairline keeps the edge) | engine (bar hairline remap) | engine (underline = strip scope, link text stays the state carrier — the v1 ruling) |
| tk-data-table *(8.2)* | engine (playground) | engine — at rest: primary 17.404:1 / secondary (#FFFFFFB3 composited → #BBBBBB) 9.066:1 on dark-base; deltas positive 6.533:1 / negative 4.525:1 (the sanctioned base surface) — plus the VERDICT LEGS below | engine (canvas surface-base → #1A1A1A; muted panel carries NO-delta rows — the 6.4 sanctioned-surface pick) | engine (row-as-link ink; deltas are semantic colors, not invariants — they remap by token) | engine (no shadows) | engine (1px border-table dividers kept width → #FFFFFF1F, composites #363636 on base — Δ+13.4 L*, visible) | n/a (no yellow) |
| tk-cookie-banner *(8.2)* | engine (playground — the card renders OPEN at first paint, top-layer; the paint walk covers #tk-overlay-root, the keyboard-walk topology note is 8.1's) | engine — card text-secondary 9.066:1 on #1A1A1A; accept pill text 13.009:1 on the composited #FFFFFF1A fill (the surface-field family) | engine (card surface-base → #1A1A1A; scrim decorative) | engine | engine (card shadow → none; tonal panel) | engine (card hairline remap) | n/a |
| tk-stepper *(8.2)* | engine (playground) | engine — card copy white 17.404:1 on #1A1A1A; numeral WHITE 14.680:1 on the dark badge #2B2823 (the pinned cream-raised pair); heading on cream canvas 15.895:1 | engine (story canvas tint-cream → #232220; cards surface-base opaque → #1A1A1A; badge tint-cream-raised → #2B2823 — the token remap does the work) | engine (charcoal demo section FORCE-held + white heading — charcoal invariant; badge ink→white flip rides text-primary, the sanctioned semantic channel) | engine (display surface — none by the never-list) | engine (borderless cards by design) | n/a (no yellow; badge is cream) |
| tk-store-badges *(8.2)* | engine (playground) | engine — labels 15.910:1 on the dark pill #222222 | **F5 FIXED here**: the anchor carried the UA `-webkit-link` rgb(0,0,238) color channel UNCHANGED across themes (unpainted — the label sets its own token color — but unreadable to the audit and unthemed); anchor now declares `--tk-store-badges-label` (text-primary semantic), zero pixel change | engine (pills surface-muted → #222222; hover surface-field → composite) | engine (instant hover step — the never-list; none) | engine (borderless pills by design) | n/a |
| tk-qr-block *(8.2)* | engine (playground) | engine — title 17.404:1; note text-secondary 9.066:1 on the dark tile | engine (tiles surface-base → #1A1A1A; the strip IS the v1 tk-tabs element — the composed contract inherits its engine row) | engine (tab pill semantics per the v1 tabs row) | engine (per the v1 tabs row) | engine (per the v1 tabs row) | n/a |

Every story of every component additionally carries the generated
`visual:` + `axe:` legs (both themes) from `tests/visual/visual.spec.ts`;
the engine legs above are the 28 canonical stories the computed-paint
audit runs on (19 v1 + the 9 v2 rows marked *(8.2)* — same registry picks
as the 8.1 Group V).

## Zero-theme-branch check (mechanical) — output

`npx vitest run tests/zero-theme-branches.test.ts` → **Tests 5 passed**:
repo scan (0 violations across components/react/docs runtime sources),
vacuous-walk guard (non-empty file set per package), stale-exemption
guard, detector positive self-check (6 synthesized branches flagged),
detector negative self-check (token-only + comment mentions pass).
Exemptions documented in NOTES.md; the guard runs in `pnpm test` → CI.

## Dark-tint verification table (closes the [ASSUMPTION] flags)

Values sourced from the generated maps (`colorTokens` light /
`darkColorTokens` dark). Lab L\* = CIE Lab (D65); the "L≈16–20%" rule
reads as Lab L\* (ruling 1, NOTES.md). OKLCH recorded alongside per the
spec's computation instruction.

| Tint | Light | Dark | Lab L\* (dark) | Window miss | OKLCH L (dark) | OKLCH hue Δ | Chroma | Verdict |
|---|---|---|---|---|---|---|---|---|
| tint-gray | #F5F5F6 | #242424 | **14.2** | 1.8 pt under | 26.0% | achromatic (C 0.000 both) | — | **HELD** (within the 2-pt threshold; sits between tonal steps 1–2) |
| tint-bluegray | #ECF1F7 | #1E242C | **13.9** | 2.06 pt under | 25.8% | 252.8° → 255.7° (**Δ2.9°** — kept) | 0.010 → 0.017 | **HELD** (exceeds 2 pt by 0.06 but fails the visually-meaningful conjunct: sub-JND, safer direction — ruling 2) |
| tint-mint | #D0F4F2 | #1C2A26 | **15.7** | 0.3 pt under | 27.1% | 192.4° → 175.1° (Δ17.3° ≤ ±20° tolerance) | 0.037 → 0.020 | **HELD** |
| tint-beige | #F1EBD6 | #2A2620 | **15.4** | 0.6 pt under | 27.1% | 93.8° → 78.1° (Δ15.7° ≤ ±20° tolerance) | 0.029 → 0.012 | **HELD** |

Position anchor (why "held" is right, not lawyer-ed): every dark tint
sits between tonal steps 1 and 2 (Lab 13.2–16.6 / OKLCH 25.2–28.1) — a
content tint distinguishable from muted panels without competing with
elevated chrome; the reference dark-evidence band (Taiga ramp #222–#373737
= OKLCH 25.2–33.7%) brackets the same territory.

**Charcoal invariant:** dark-tint-charcoal = tint-charcoal = #333333 —
asserted at generation (`generate.mjs`), pinned by the contrast
white-on-charcoal row, and FORCE-held by the engine on the rendered
charcoal/editorial cards.

**No DESIGN.md tint values changed** — all four hold, so the 3.6
closure-mold correction path was not needed. The [ASSUMPTION] annotations
are RESOLVED to "Verified — Story 5.4 dark sweep: …" per tint in the
generator's `DARK_TOKEN_NOTES` (rendered into `tokens.css` comments +
`TOKENS.md` dark table via `pnpm gen:tokens`; artifacts byte-stable
against a second fresh render — md5-proven). DESIGN.md Colors body now
records the verification (values + tolerances + window-miss numbers).

## Gate evidence (this change)

- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen` —
  all exit 0 (fresh run 2026-09-23; vitest 105 passed incl. the new branch
  guard + the updated skeleton pins; `pnpm gen` re-ran the CEM manifest
  after the story edits — `gen-drift` green).
- Tokens: `pnpm gen:tokens` twice → identical checksums (worktree ==
  fresh render; the committed-pending artifacts carry only the four
  Verified-note comment changes — zero value changes).
- `pnpm test:visual`: update flow after deleting the 23 changed dark
  baselines (F2/F4 classes), then **stable ×2** (765 tests; the pre-update
  compare pass had exactly 23 failures — the changed dark stories — and
  742 passing).
- Engine: 19/19 legs pass in ~3s (both-theme loads per story).

## Baseline obligations at the 5.6 maintainer batch gate

- The **23 re-taken dark baselines** (button ×8, badge ×6, link ×6,
  card `variants` ×3 — F2/F4 classes) ride the existing provisional rule.
- **F1 FLAG (explicit): the dark progress-bar baselines are knowingly
  STALE-BUT-PASSING** — the track's gray-200 → white-alpha fix changes a
  4px rail (~0.16% of the playground canvas), under the 1.5% pixel
  threshold, so those PNGs were NOT re-taken and still show the old
  near-white rail. The computed-style engine leg + the live probe
  (`rgba(255,255,255,0.14)`) pin the real state; the stale pixels MUST be
  eyeballed at the 5.6 batch-confirm so they cannot ride silently.
- **Engine limitation (recorded):** the slot-reparenting walk is ONE level
  deep (`assignedSlot` re-parents the slotted element only — descendants
  of slotted content keep their light-DOM chain and can miss a shadow
  fill behind an intermediate wrapper). Miss direction is false-FAIL
  (fallback paper is white → a missed dark fill fails loudly, never
  silently passes); 19/19 walk clean today; second-level walk is future
  hardening if composed slot content ever nests.

## Incomplete / deferred

None for this story. The baseline obligations above join the existing 5.6
maintainer batch gate (no new deferral — the provisional rule already
covers them). Tonal steps 2/3/elevated stay reserved (no current consumer
— NOTES.md).

---

# Story 8.2 extension — the nine v2 surfaces + the warm-cream close (2026-09-25)

Method: the 5.4 mold VERBATIM. The worklist = the six 6.1 dark first-pass
[ASSUMPTION] flags (the TOKENS.md flag list: cream page/card, delta pair,
table border, row-hover). Technique per family: the tint rule (Lab L\*
window + OKLCH hue/chroma, NOTES.md ruling 1) for the cream pair; the
WCAG relative-luminance step math (the contrast.test.ts definition) for
the delta pair's three-surface scope; composite/grammar arithmetic for
the white-alpha pair. **All six HELD — zero DESIGN.md value edits**, flags
cleared to `Verified — Story 8.2 dark sweep:` notes in the generator's
DARK_TOKEN_NOTES (rendered into `tokens.css` comments + the TOKENS.md
dark table; byte-stable double regen, md5-proven).

## The six 6.1 [ASSUMPTION] dispositions (the L-rule)

### The cream pair (the tint rule — 5.4 table format)

| Flag | Light | Dark | Lab L\* (dark) | Window miss | OKLCH L (dark) | OKLCH hue Δ | Chroma | Verdict |
|---|---|---|---|---|---|---|---|---|
| tint-cream | #F1EEE8 | #232220 | **13.26** | 2.74 pt under | 25.2% | 84.6° → 84.6° (**Δ0.0° — hue exact**) | 0.009 → 0.004 | **HELD** (position + pair-structure conjunct — below) |
| tint-cream-raised | #E9E0D1 | #2B2823 | **16.27** | INSIDE the 16–20 window | 27.8% | 80.7° → 80.6° (Δ0.1°) | 0.022 → 0.010 | **HELD** (inside outright) |

Position anchor (the 5.4 «why held is right» discipline): the page value
sits ON the tonal-step-1 boundary (OKLCH 25.2% = step 1; Lab 13.26 ≈
surface-muted dark `#222222`'s 13.2) — i.e. it MIRRORS the light pair's
own relationship, where cream `#F1EEE8` ≈ muted `#F5F5F6` in lightness
and the warm hue (84.6°, kept EXACTLY) is the differentiator. The raised
step lands INSIDE the rule window; the pair step page→card = Δ3.0 L\*
(25.2 → 27.8%) is the elevation distinction the pair exists to paint.
Correcting the page value up into the window (≥16.0) fails the
visually-meaningful conjunct TWICE: the only in-window landing sits
≤0.3 L\* from the raised sibling (the page/card distinction collapses
sub-JND) and darker-is-safer holds for text (white 15.895:1 on #232220
vs 14.680:1 on #2B2823). The held v1 tints bracket 25.2–28.1% OKLCH —
cream sits at the family floor, raised inside the band. (The bluegray
precedent held a 2.06 miss via the sub-JND+safer-direction conjunct;
this 2.74 miss rides the pair-structure conjunct — a correction would be
perceptible AND destructive, the inverse of meaningful.)

AA anchors unchanged (contrast.test.ts pins): white 15.895 / secondary
(#FFFFFFB3 composited → #BDBDBD) 8.461 on `#232220`; white 14.680 /
secondary (#C0BFBD) 7.989 on `#2B2823`.

### The delta pair (the three-surface AA scope — 6.1 ruling arithmetic)

| Flag | Dark value | on dark-base `#1A1A1A` | on step 1 `#222222` | on hover composite `#313131` | Verdict |
|---|---|---|---|---|---|
| delta-positive | #39B54A | **6.533** ✓ | **5.972** ✓ | **4.883** ✓ | **HELD** — clears AA on all three real surfaces |
| delta-negative | #F63434 | **4.525** ✓ | 4.136 ✗ | **3.382** ✗ | **HELD** under the closed 6.1 scope ruling |

The ERRATUM leg, step-by-step (negative on the hover composite — the
failing dark leg pinned at `tests/contrast.test.ts:282`):

- `#F63434`: R′ = 0.921582, G′ = 0.034340, B′ = 0.034340 (sRGB→linear)
  → L = 0.2126·0.921582 + 0.7152·0.034340 + 0.0722·0.034340 = **0.222967**
- `#313131` (the composite: `#FFFFFF1A` over `#1A1A1A` — 255·0.101961 +
  26·0.898039 = 49.35 → channel 49/255 = 0.192157 → linear **0.030713**)
- ratio = (0.222967 + 0.05) / (0.030713 + 0.05) = 0.272967 / 0.080713 =
  **3.382** (positive leg: `#39B54A` L = 0.344155 → 0.394155/0.080713 =
  **4.883**, pin `:284`)

Negative-hold rationale: the 6.1 scope ruling stays CLOSED (deltas are
sanctioned on base surfaces; the composite failures are PINNED numbers,
never silent omissions — `:282-283`/`:274`/`:279`). A hover-clearing red
exists numerically — computed this sweep: `#FF7B74` = 5.165:1 on
`#313131` — but sits +12.7 Lab L\* into the pastel ERROR family (a delta
red is not an error state; the reference itself ships `#F52222` =
4.255:1 on base, WORSE than the shipped 4.525); no red scale step passes
on base (red-100 = 3.630:1). The least-lightened AA-clearing value stays.

### The white-alpha pair (composite/grammar rule)

| Flag | Dark value | composite on `#1A1A1A` | ΔL\* vs base | Grammar check | Verdict |
|---|---|---|---|---|---|
| border-table | #FFFFFF1F | **#363636** (Lab 22.6) | +13.4 | 1.8 L\* under the dark-border composite `#3A3A3A` — the documented one-step-under divider grammar (dividers quieter than control borders); on step 1 `#222222` → `#3D3D3D` | **HELD** (decorative structure, non-text; 1.4.11 does not apply per 6.1) |
| surface-row-hover | #FFFFFF1A | **#313131** (pinned `:281`) | +11.1 | the SAME 10%-white step as dark-field `#FFFFFF1A` — the family's established fill, not a new one; a visible-but-gentle transient step | **HELD** (transient decorative fill; the row's TEXT pairs on the composite pass: white **13.009** / secondary-composited `#C2C2C2` **7.303** — the v1 input-row pins) |

## The delta verdict legs (the ERRATUM's live confirmations)

`tests/visual/dark-sweep.spec.ts:685` — «dark sweep: tk-data-table —
delta pair verdict legs», BOTH themes, hover-driven on the actual
playground DOM (hover a delta row, read the computed row fill + delta
text color, composite over the story canvas at raster precision):

- **dark**: composite `#313131` — negative **3.382:1** (< 4.5 — the
  FAILING leg, equality-pinned live; the sanctioned-scope state), positive
  **4.883:1** (≥ 4.5); base legs 4.525 / 6.533.
- **light**: composite `#F2F4F7` — negative 5.608:1 (passes), positive
  **4.163:1** (< 4.5 — the light half's own pinned failing leg, `:274`).
- Nuance recorded: Chromium SERIALIZES the computed fill alpha rounded
  (0.1 for the token's 0.101961) — unrounded channel math drifts
  +0.005–0.007 off the pins; the legs composite at RASTER precision
  (8-bit rounded channels — what the browser paints) and land ON the unit
  pins at precision 3.

## Findings this sweep (fixed in-change)

- **F5** — tk-store-badges anchor color channel: the `<a class="badge">`
  carried the UA `-webkit-link` default `rgb(0,0,238)` UNCHANGED across
  themes (unpainted — the label declares its own token color — but
  unthemed and unreadable to the paint audit). FIXED: the anchor declares
  `--tk-store-badges-label` (text-primary semantic) at
  `store-badges.css.ts` — zero pixel change, the channel now themes.

## Baselines this sweep

**NONE.** All six flagged values HELD → zero dark value churn → zero PNG
edits (the full suite runs green ×2 below — the stability proof the
no-change path owes).

## Gate evidence (8.2)

Gates in order, one clean chain (2026-09-25): `pnpm build && pnpm test &&
pnpm lint && pnpm typecheck && pnpm gen && pnpm gen:tokens` — all exit 0.
Vitest **881 passed / 0 failed** (components 667 in 29 files, tokens 15,
react 70, root 129 in 12 files) — zero additions this story
(verification-only; the base ships 881 — the 876 figure in HANDOFF predates
the 8.3 docs drift test). `pnpm gen:tokens` artifacts byte-stable across
double regen (only the six Verified-note comments changed, zero values).

Engine: **30/30 legs green** — the 28 registry audits + the 2 delta verdict
legs (dark 3.382/4.883, light 5.608/4.163 — all landing on the unit pins at
precision 3) — on the private port 6051.

Visual ×2 (port 6051 via the temp `playwright.visual-8-2.config.ts`, deleted
after the runs): **1368 listed = 1368 run ×2; 1366 passed + 2 failed in BOTH
passes — identical failures, deterministic**. The list-vs-run gap recorded on
main (1359/1355 = 4) is **0** in this tree. Zero baselines touched
(`git status` carries no PNG) — the no-change stability proof rides the
1366 ×2 green.

### STOP-AND-REPORT — the 2 failing legs are stale AT BASE (not this sweep)

`visual: components-v2-mega-nav--page [light]` / `[dark]` — the v2 mega-nav
DOCS page embeds `apiReferenceDoc('tk-navbar')`; its «Атрибуты и свойства»
table renders 41px TALLER than the committed baseline (1280×3372 →
1280×3413; divergence starts at row ~2332 = the attributes-table top,
everything above pixel-identical). Forensics:

- The baseline PNGs were committed at `e63639c` (story 8.3) and never
  re-taken (`git log` on the PNG: one commit).
- AFTER `e63639c`, the 8.1 merge grew the tk-navbar CEM attribute
  descriptions — `burger-label` 70→209 chars, `sub-label` 207→379
  (`git diff e63639c..7e525c2 -- packages/components/custom-elements.json`)
  — longer description cells wrap more lines: +41px.
- `256e5cf` re-baselined the SAME growth on `navbar--api` (2 PNGs — «CEM
  table grew from the F1 fallback docs») but MISSED this docs page, which
  renders the same `apiReferenceDoc('tk-navbar')` table.
- This sweep cannot cause it: the tokens diffs are comment-only
  (value-identical lines on both sides of the diff), the only CEM change is
  the store-badges cssText (its own legs green ×2), no navbar/docs-story
  file is touched — the failing table state is byte-identical to base.
- Remedy (maintainer decision; same legitimacy class as `256e5cf`): re-take
  the two `visual-components-v2-mega-nav--page-{light,dark}-1-chromium.png`
  baselines. NOT done here — zero PNG edits per the stop rule.
