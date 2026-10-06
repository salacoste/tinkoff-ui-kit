# Pixel passports report — baseline-review-v180 (batch-confirm v1.8.0)

Date: 2026-10-06. Source: `tests/visual/visual.spec.ts-snapshots/` (read-only).
Method: `identify` for WxH; `convert -colorspace Gray` fx mean / standard_deviation, rounded to 1e-3. Raw data: `work/passports.tsv`; pair deltas: `work/pairs-delta.tsv`.

## 0. Inventory vs task brief — count discrepancy (informational)

- Brief listed 56 files; G4 (input) declared x10 with stories {api, code-accessibility, code-mode, confirmation}.
- Disk reality: 64 files. G4 has NINE stories x 2 = 18 files: accessibility, api, code-accessibility, code-mode, confirmation, playground, theming, value-modes, variants.
- Decision: groups treated as complete on-disk sets — every group file passported and composited (G4 = 18 tiles). Nothing dropped, nothing invented.
- Per-group counts: G1 rangeslider 10, G2 switch 10, G3 avatar 12, G4 input 18, G5 textarea 6, G6 terminal 6, G7 getting-started 2. Total 64.

## 1. Passports

- 64/64 measured, 0 errors.
- All files are 1280 px wide; heights 323-4329 px.

## 2. Non-emptiness check (std > 0.001 AND W >= 100 AND H >= 100)

- FLAGS: none (0/64).
- Margins: min std = 0.085 (`avatar--admin-feed-light`), min height = 323 px (`textarea--accessibility-notes-light`).

## 3. Theme differentiation (|meanLight - meanDark| per story pair)

- 32 pairs measured, FLAGS: none (0/32). Threshold 0.02; observed min 0.720, max 0.856 — every dark layer is unmistakably distinct (page background differs everywhere).

| group | story | mean L | mean D | delta | verdict |
|---|---|---|---|---|---|
| G1 | visual-components-rangeslider--accessibility | 0.967 | 0.144 | 0.823 | ok |
| G1 | visual-components-rangeslider--api | 0.973 | 0.191 | 0.782 | ok |
| G1 | visual-components-rangeslider--calculator | 0.971 | 0.138 | 0.833 | ok |
| G1 | visual-components-rangeslider--playground | 0.972 | 0.136 | 0.836 | ok |
| G1 | visual-components-rangeslider--variants | 0.978 | 0.131 | 0.847 | ok |
| G2 | visual-components-switch--accessibility | 0.966 | 0.146 | 0.820 | ok |
| G2 | visual-components-switch--api | 0.971 | 0.194 | 0.777 | ok |
| G2 | visual-components-switch--playground | 0.971 | 0.136 | 0.835 | ok |
| G2 | visual-components-switch--settings | 0.980 | 0.126 | 0.854 | ok |
| G2 | visual-components-switch--variants | 0.976 | 0.131 | 0.845 | ok |
| G3 | visual-components-avatar--accessibility | 0.969 | 0.141 | 0.828 | ok |
| G3 | visual-components-avatar--admin-feed | 0.980 | 0.125 | 0.855 | ok |
| G3 | visual-components-avatar--api | 0.973 | 0.189 | 0.784 | ok |
| G3 | visual-components-avatar--news-row | 0.981 | 0.125 | 0.856 | ok |
| G3 | visual-components-avatar--playground | 0.975 | 0.134 | 0.841 | ok |
| G3 | visual-components-avatar--variants | 0.972 | 0.139 | 0.833 | ok |
| G4 | visual-components-input--accessibility | 0.956 | 0.159 | 0.797 | ok |
| G4 | visual-components-input--api | 0.968 | 0.199 | 0.769 | ok |
| G4 | visual-components-input--code-accessibility | 0.967 | 0.143 | 0.824 | ok |
| G4 | visual-components-input--code-mode | 0.970 | 0.138 | 0.832 | ok |
| G4 | visual-components-input--confirmation | 0.958 | 0.145 | 0.813 | ok |
| G4 | visual-components-input--playground | 0.969 | 0.144 | 0.825 | ok |
| G4 | visual-components-input--theming | 0.887 | 0.145 | 0.742 | ok |
| G4 | visual-components-input--value-modes | 0.963 | 0.156 | 0.807 | ok |
| G4 | visual-components-input--variants | 0.961 | 0.151 | 0.810 | ok |
| G5 | visual-components-textarea--accessibility-notes | 0.969 | 0.249 | 0.720 | ok |
| G5 | visual-components-textarea--notes | 0.963 | 0.238 | 0.725 | ok |
| G5 | visual-components-textarea--states | 0.971 | 0.244 | 0.727 | ok |
| G6 | visual-components-button--api | 0.975 | 0.187 | 0.788 | ok |
| G6 | visual-invest-terminal-ticket--terminal-ticket | 0.979 | 0.124 | 0.855 | ok |
| G6 | visual-token-reference--colors | 0.976 | 0.188 | 0.788 | ok |
| G7 | visual-getting-started--page | 0.957 | 0.209 | 0.748 | ok |

## 4. Observations (no flags — context for arbitration)

- `textarea` dark means 0.238-0.249 — above the typical dark band 0.124-0.199: dark pages carry large lighter panels. Deltas 0.720-0.727, so a dark layer is clearly present.
- `input--theming` light mean 0.887 vs siblings 0.956-0.981 — theming page carries colored swatch plates; expected.
- Tall pages: `token-reference--colors` 1280x3475 and `getting-started--page` 1280x4329 become single tall tiles (1520 / 1894 px at 560 width) in composites G6/G7.

## 5. Composites (work/composite-G*.png)

| composite | tiles | rows | px |
|---|---|---|---|
| G1 rangeslider | 10 | 4+4+2 | 2240x1061 |
| G2 switch | 10 | 4+4+2 | 2240x1187 |
| G3 avatar | 12 | 4+4+4 | 2240x893 |
| G4 input | 18 | 4+4+4+4+2 | 2240x1986 |
| G5 textarea | 6 | 4+2 | 2240x327 |
| G6 terminal | 6 | 4+2 | 2240x2073 |
| G7 getting-started | 2 | 2 | 1120x1894 |

Tile order per composite: see `work/composites-order.md` (sidecar is the authority — tiles carry no labels).
