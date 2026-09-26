# UX-DR17 yellow-discipline audit — v1.2.0 extension (Story 11.3, 2026-09-26)

**Standard (unchanged since v1 — `../fidelity-verification/yellow-audit.md`,
methodology verbatim):** yellow ONLY for primary-action fills and active
indicators; ink text on yellow (never white); yellow never for links /
icons-at-rest / decoration; active indicators always redundant with weight,
shadow, or another color-insensitive carrier (WCAG 1.4.11).

**Extension scope of this run:** every surface the `v1.1.0..HEAD` diff moved
(the 9.x–11.x window: token layer, stepper/input/segmented-radio/checkbox/
promo-card/qr-block/button/tooltip, both showcases, the docs mono flip).
The v1 (19 components + docs) and v2 (nine + three compositions + v2 docs
pages) audits stand; this run re-executes the same mechanical inventory and
classifies the DIFF surface. The audit CAN fail — the v1 run found and fixed
2 real violations (F1/F2); the same bar applies here.

## Step 1 — yellow tokens (unchanged)

`--tk-color-yellow-100 #FFDD2D / -200 #FCC521 / -300 #FAB619` — theme-
invariant (no dark override). No other token resolves to a yellow hex; the
v1.2.0 additions touch none of this: `tint-brown` #8D6040 is a BROWN family
entry (warm-cream block, 9.1) — explicitly NOT a yellow question (the v2
audit's stepper line holds); `--tk-font-mono` is a font slot. The
consumed-tokens CI guard still proves every `var(--tk-*)` resolves.

## Step 2 — mechanical inventory (re-run, honest counts)

The v1/v2 command verbatim over the five roots at HEAD e693d40:

```sh
grep -rn "yellow-100\|yellow-200\|yellow-300" \
  packages/tokens/src packages/components/src packages/react/src \
  packages/docs/src packages/docs/.storybook \
  --include="*.ts" --include="*.css" --include="*.js" --include="*.mjs" --include="*.html"
```

**Result: 66 hits / 29 files** (v2 run at aa9780f: 65/29 — the +1 hit is the
single new consuming rule classified in Step 3; no file entered or left the
list). Documentation-class hits (jsdoc, RU story prose, generated TOKENS
sheets) dominate exactly as in v1/v2.

**Diff-scoped pass** (the v1.2.0-relevant surface — added lines only,
`git diff v1.1.0..HEAD -U0 -- packages/ | grep '^+'`):

- **Source roots: exactly 1 added yellow line** —
  `packages/components/src/promo-card/promo-card.stories.ts:129`
  `.tkpc-bleed-art .tkpc-ba-yellow { fill: var(--tk-color-yellow-100); }`
- 3 further raw-diff hits are the CEM manifest's full-sheet re-embeds
  (`custom-elements.json` re-serializes the whole checkbox/input/
  segmented-radio sheets when ANY rule in them changes — their yellow rules
  are the PRE-EXISTING v1 consumers B1/B2 re-serialized, not new usages).
- **Raw-hex sweep on added lines: 0 hits** (`#FFDD2D|#FCC521|#FAB619|
  255,221,45` — zero yellow hex literals entered the tree this window).
  Full-tree raw-hex state: 7 hits — 3+3 in `tokens.{ts,css}` (the token
  definitions, where literals belong) + the one known comment
  (`thumbnail-picker.css.ts:13`, the documented v2 residual). Unchanged.

## Step 3 — classification of the v1.2.0 diff surface

### C. Demo/art in slots — RULED (consumer-content class)

| # | Site | File:line | What | Ruling |
|---|---|---|---|---|
| C13 | promo-card bleed demo art, `.tkpc-ba-yellow` rect fill | `promo-card.stories.ts:129` (shape at :44) | token-filled decorative rect inside the 10.3 `art-mode='bleed'` demo SVG (`aria-hidden="true" focusable="false"`, three stacked rects white/yellow/ink) | the C5 class verbatim (the v1 promo-card art disc): consumer art in the `art` slot, token-drawn (zero-hardcoded guard satisfied), **no text on any fill** — verified against the SVG source (three `<rect>`s, no text nodes) |

No other consuming selector was added by 9.1–11.2. The stepper badge flip
introduced brown, not yellow; the checkbox error / input+segmented sr-only /
qr-block page-copy / button href / docs mono changes add zero color rules
touching yellow.

### A/B — no new entries

- New primary-CTA fills in kit chrome: **0** (button href mode re-uses the
  shipped pill; the anchor inherits the identical `.button` rules —
  `button.css.ts` untouched by 10.4, verified in the diffstat).
- New active indicators: **0**.

## Step 4 — verdicts per v1.2.0-moved surface

| Surface | Verdict | Basis |
|---|---|---|
| token layer (9.1/9.2) | PASS | adds brown + a font slot; zero yellow-adjacent entries |
| tk-stepper | PASS | zero yellow selectors (badge = tint-brown family; hooks unchanged) |
| tk-promo-card | PASS | the single new yellow use = C13 art fill (slot demo, text-free) |
| tk-qr-block / tk-input / tk-segmented-radio / tk-checkbox | PASS | zero yellow rules added (error channel = `error-on-field` red family; sr-only = structural 1px-clip) |
| tk-button | PASS | zero CSS edits in the window (the href diffstat is ts/stories/test only) |
| tk-tooltip | PASS | stories-only content change; sheet untouched |
| business-landing showcase | PASS | subtitle/bento deltas add no yellow; the hero-CTA pills stay white-on-cream; C9/C11 art unchanged |
| invest-landing showcase | PASS | page-copy + href adoption add no yellow; C10/C12 art unchanged |
| docs code surfaces (11.2) | PASS | the mono flip changes `font-family` declarations only — grep confirms zero yellow rules touched in `packages/docs` |

## Step 5 — ink-on-yellow (never white)

No NEW text-bearing yellow surface arose this window: the one new fill (C13)
carries no text (SVG source check above); every pre-existing ink-on-yellow
pair (v1 table: button primary, checkbox glyph, segment dot, A4/A5 demos,
logo shields) is untouched by the diff — their selectors and pairings are
byte-identical at HEAD. Dark layer: yellow-100 remains without override;
pairs theme-invariant (8.2 engine, 28/28 — unchanged).

## Verdict

- New primary-CTA fills: **0**. New active indicators: **0**. New demo/art:
  **1** (C13 — ruled, text-free). **Illegal: 0 found → 0 fixes.**
- The audit's ability to fail is inherited from the v1 run (F1/F2) and the
  unchanged command; re-run anchor: Step 2's command + the diff-scoped pass.
- UX-DR17 holds kit-wide at the v1.2.0 head: the window's changes touched
  brown, fonts, structure, and copy — yellow discipline is byte-carried from
  v1/v2 plus one sanctioned art fill.
