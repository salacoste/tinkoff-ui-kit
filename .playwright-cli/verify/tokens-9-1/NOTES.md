# Story 9.1 — token additions + baseline round: verification evidence (2026-09-25)

Three decision gates ran BEFORE any DESIGN.md edit, per the frozen spec order.
Artifacts in this directory; sources are ARCHIVED captures only (no live site).

## Gate 1 — rounded.3xl radius probe: **KILLED (< 28px)**

The archived business form-card captures
(`.playwright-cli/captures-v2/business/pattern-application-form{,-detail}.png`)
measured by the Story 5.6 arc-staircase mold (closed-form
`r = Y + inset + sqrt(2·Y·inset)`, median + IQR, DPR 1 = CSS px):

- `pattern-application-form-detail.png` (1280×485): white sheet
  left x=88 / right x=1191 (P1 = median = max over body rows 300..400),
  top y=113 EXACT (deep-white contiguous-run starts at EVERY mid-card column;
  the sheet's top carries a full-width 5px `#333` stacked-card sliver at
  y=108–112 — the reference's own dark-edge card stack).
  **Top-left r = 23.8px (IQR 23.5–24.7); top-right r = 23.8px** — a textbook
  circular fit (inset 14 @ Y=2 → r=23.5; consistent to inset 2 @ Y=16).
- `pattern-application-form.png` (580×430): card edges clip past the frame
  (white edge-to-edge through y=332; y=333 full-width shadow) — layout
  corroboration only, no radius read.

**Verdict: median 23.8 < 28 → `rounded.3xl` does NOT land.** Scope reduced to
tokens 1+3; `.tkb-form__card` keeps `--tk-radius-xl` (24 — the measurement
says the kit is ALREADY faithful). This also CORRECTS the 7.4 deviation-ledger
estimate «reference ≈32 (vision estimate)» (`verify/business-landing/NOTES.md`
deviation 14): the ≈32 impression came from the dark stacked-card sliver's
underresolved arc, not the white form card. Re-run:
`bash .playwright-cli/verify/tokens-9-1/probe-ref.sh | tee …/probe-output.txt`.

## Gate 2 — tint-brown AA gate: **PASSED (≥ 4.5)**

Computed per WCAG 2.1 relative luminance (3-decimal pins land in
`tests/contrast.test.ts`):

| Pair | Ratio | Status |
|---|---|---|
| white numeral on `tint-brown` `#8D6040` | **5.413** | REQUIRED — passes; token lands, stepper flips |
| `tint-brown` on `tint-cream` | **4.674** | REQUIRED — passes (badge over page cream) |
| `tint-brown` on `tint-cream-raised` | **4.136** | RECORDED-FAILING pin — the badge never sits on raised cream (its card-top overlap is white) |

Disposition: the charcoal mold — `DARK_DEFERRED['dark-tint-brown']` +
`DARK_INVARIANTS['--tk-color-tint-brown']` + a generation-time equality
assert (sibling to charcoal's). Dark override map stays 23.

## Gate 3 — tooltip Placements pill cap: **HIT (288 × 4)**

`probe-tooltip-cap.mjs` serves the built docs bundle (harness `serve.mjs` on
private port 6191; pinned chromium flags; DSF 1) and measures the four
generated `div[role="tooltip"]` surfaces on the story:

```
placement=top    visible=true  pill 288 x 68.17
placement=bottom visible=true  pill 288 x 68.17
placement=left   visible=true  pill 288 x 68.17
placement=right  visible=true  pill 288 x 68.17
```

All four pinned-open pills measure EXACTLY the `max-width:
calc(var(--tk-space-48) * 6)` cap — pill geometry is now structural, and the
`CI_VISUAL_TOLERANCE['components-tooltip--placements [light]'] = 0.13` entry
is RETIRED (mechanism + map stay; `tests/visual/visual.spec.ts` records the
retirement).

## Files

| File | What |
|---|---|
| `probe-ref.sh` | re-runnable radius probe wrapper (identify + scanline layout tables + the staircase) |
| `probe-radius.mjs` | the arc-staircase probe (5.6 mold; near-white mask, corner-local edges — adaptations documented in-header) |
| `probe-output.txt` | saved radius-probe transcript incl. the gate verdict |
| `probe-tooltip-cap.mjs` | pill-cap width probe (built bundle, private port) |
| `probe-tooltip-cap-output.txt` | saved pill-cap transcript |
| `kit-stepper-brown-light.png` | kit stepper crop from the NEW Playground light baseline (1280×340) |
| `stepper-brown-side-by-side.png` | reference block (top) vs kit brown-badge render (bottom), 4px `#E0E2E4` separators — the 7.3 recipe mold |

## Side-by-side: pixel + vision (mandated method note)

Pixel column scans of the new Playground light baseline (x=213 badge-1
center, x=640 card-2 center): badge `#8d6040` spans y355–410 (56px), white
numeral strokes y376–388 at the badge centerline, card top y411 — the badge's
56px box overlaps the card top by EXACTLY half (411−355 = 56), card white to
y570, heading ink ≈y253. 4.5v vision on `stepper-brown-side-by-side.png`:
brown fills + white numerals MATCH in both halves, half-overlap matches,
cards match (fill/count/rounding); remaining deltas are the RECORDED 7.3
deviations (responsive card width mold → taller, wider-spread cards;
bold-title + sub-line content structure) — not color.

## The baseline round (v1.2.0)

Explicit delete (22 PNGs) → `pnpm test:visual:update` (both themes) →
`git status` audit → compare ×2.

| Set | Files | Count |
|---|---|---|
| A | `components-stepper--{playground,variants,theming,accessibility,api}` ×2, `components-v2-stepper--page` ×2, `showcase-business-landing--business-landing` ×2, `showcase-invest-landing--invest-landing` ×2 | 16 |
| B | business-landing pair — **VOID** (radius probe killed the flip) | 0 |
| C | `components-tooltip--placements` ×2 | 2 |
| D | `token-reference--colors` ×2 + `--typography` ×2 (**--surfaces NOT re-taken**: radius scale unchanged, page did not move) | 4 |
| E | per-spec dirs: `invest-landing.spec.ts-snapshots` (qr-block clip only), `tooltip.spec.ts-snapshots` (OPEN story only) — no touched regions | 0 |

Zero PNGs outside the sanctioned set moved. `token-reference--surfaces`,
both per-spec dirs, and `components-stepper--api` (re-taken byte-identical —
no badge on the API page) all stayed green in git. `token-reference--registers`
did not move (the renderMd radius-registers sentence is unchanged — 9.1 adds
no radius token).

Dark-sweep leg: the stepper theme-flip audit initially flagged the brown
badge fill `rgb(141,96,64)` as «UNCHANGED in dark — the lightblue-200 bug
class»; root-caused to the sweep's invariant-family allowlist not knowing the
9.1 brown invariant — the sanctioned family was added
(`BROWN` → `FORCE_INVARIANT`, `tests/visual/dark-sweep.spec.ts`), leg green.

Compare run 1 (18.9m): 1366 passed / 1 failed —
`visual: theming-guide--dark-pairing [light]`, NOT in the sanctioned set,
baseline untouched in git, story disconnected from 9.1 content; isolated
rerun green 4/4 (visual + axe, both themes) → full-suite-load flake,
recorded, not patched. Compare run 2 (8.4m): **1368 passed / 0 failed,
exit 0** — ×2 stability holds; the baseline is green as committed.

## Judgment calls (recorded)

1. Radius probe kills 3xl → NO Shapes-body sentence, NO `.tkb-form__card`
   flip, NO renderMd radius-sentence change (Registers page provably static).
2. DESIGN.md body Components table Stepper row: `white cards {rounded.lg}`
   trued to `{rounded.xl}` alongside the frontmatter row — leaving it would
   contradict the sanctioned frontmatter truing post-flip.
3. `tint-brown`/`dark-tint-brown` placed in the warm-cream family block
   (same business provenance) rather than splitting across the v1 tint/dark
   groups; the Colors-body line «Charcoal tint is theme-invariant» left
   as-is (the AA-table row + TOKENS.md invariants carry the brown fact).
4. hex `#8D6040` kept out of STORY prose (FR-1 zero-hardcoded scans story
   sources); the value lives in the token + css.ts jsdoc.
5. CI tolerance entry retired by EMPTYING the map (mechanism + comment stay)
   rather than deleting the plumbing — next platform class reuses it.
