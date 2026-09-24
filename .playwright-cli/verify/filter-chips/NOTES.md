# Story 6.2 — tk-filter-chips side-by-side evidence (2026-09-24)

Reference: T-Bank invest/stocks catalog filter row, captured in
`.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png`
(824px content column). The kit render reproduces the capture's own
composition: the catalog's 10 items, 7 visible + «Ещё», «Акции» selected.

## Files

| File | What |
|---|---|
| `filterchips-side-by-side-light.png` / `-dark.png` | reference strip (top, on its #F6F7F8 band) vs kit row (bottom, on white), 2px gray hairline between |
| `kit-filterchips-light.png` / `kit-filterchips-dark.png` | kit renders (Playground + catalog items + value='stocks') — 1232×45 |
| `kit-menu-open-light.png` | the open «Ещё» menu (ArrowDown mount path, page-clip so top-layer panel pixels are included) — 127×216 |
| `reference-row.png` | the reference crop itself (824×64) |
| `filter-chips-capture.mjs` | the committed capture recipe |

Reference crop: `magick .playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png -crop 824x64+0+76 +repage reference-row.png`

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6013 &
node .playwright-cli/verify/filter-chips/filter-chips-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides:
magick reference-row.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-filterchips-light.png -background white -append filterchips-side-by-side-light.png
magick reference-row.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-filterchips-dark.png -background white -append filterchips-side-by-side-dark.png
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter.

## Probe method

ImageMagick scanline runs (`magick img -crop Wx1+X+Y txt:-`, unique-color
runs); capsule verified by the dy=1 arc inset (radius-full on a 44px box →
inset 22−√43 ≈ 15; measured yellow top-arc run 49px on a ≈79px chip box →
inset 15 ✓). Standing rule: every load-bearing value below is MEASURED.

## Ground truth — pixel probes: reference vs kit

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Chip height | 44px (orig y80–124) | 44px (col x=156: borders y0–1 and y42–43) — the 45px shot = 44 + 1px flex-line rounding, no visual artifact | match |
| Chip fill | #FFFFFF | white (surface-base) | match |
| Unselected border | 1px #E2E4E6-family hairline | 1px #E8E9EA ≈ border-default #E7E8EA (x107 stroke) | deviation 3 (token, near-identical) |
| Selected border | 2px #FFDD2D, fill/text UNCHANGED | 2px #FFDD2D top/bottom (y0–1, y42–43) + 2px left (x116–117); fill white, text #333333 unchanged | match exact |
| Corner shape | rounded rect r≈10–12 (top-border chord inset 7 at dy=1 → r≈11.7) | radius-full capsule (dy=1 arc inset 15 = r22 formula ✓) | **deviation 1 — FROZEN** (spec «pills radius-full» + DESIGN `{rounded.full}`) |
| Chip gap | ~4px pure bg (~5–6 edge-to-edge) | 8px measured (x108–115 between border strokes) — space-8 | deviation 2 (token step; documented in the css header) |
| Chip text | #333333, ~15px | #333333 core (x147–148), body-m 15px | match |
| «Ещё» chevron | #999999 | #616871-family strokes (#6F757D AA) — text-secondary | deviation 4 (token semantics) |
| Row structure | 8 chips x1→771: Что купить / **Акции** / Валюта / Фонды / Облигации / Фьючерсы / Опционы / Ещё+chevron | identical sequence, same SELECTED chip, chevron present; kit row wider (padding 16 vs ~12 + gap 8 vs ~4) | match (rhythm deviation 2) |
| Menu | (closed in the capture) | 48px rows, radius-sm, check on the checked row — the select menu language | kit surface (spec pick) |

## Vision check (zai analyze_image, 2026-09-24)

Ran on the light side-by-side via the CDN upload endpoint. Verdict: **high
fidelity (~95%), no defects** — sequence and selection identical in both
strips («Акции» carries the yellow border in both), selection treatment
identical (yellow border, white fill, unchanged dark text), chevron present,
no misalignment/clipping; kit row slightly wider spacing (real — deviations
2 and the padding step).

REFUTED by pixels, per the standing methodology:
- «The reference chips read as full pills; the kit is marginally squarer» —
  BACKWARDS. Pixels: reference = rounded rect r≈10–12 (chord inset 7 at
  dy=1); kit = the true capsule (inset 15 → r=22). Vision cannot resolve
  radius at this scale; deviation 1 stands as pixel-proven.
- The first pagination-framed call on the same URL honestly refused (the
  session's CDN endpoint pinned to ONE object — first-write-wins — so the
  pagination composite was never deliverable; see pagination/NOTES.md).

## Intentional deviations (documented, not defects)

1. **Capsule `radius-full`, not the reference's r≈10–12 rounded rect.**
   FROZEN: the approved spec says «pills radius-full» and DESIGN.md
   `filterChips.radius: '{rounded.full}'` — DESIGN wins over captures (the
   tabs/segmented-radio precedent). Recorded here per CONVENTIONS §9.
2. **Chip gap 8 (space-8) vs reference ~4–5.** The spec's "~4–6px" was
   descriptive; the kit pins the 8px token step (the smallest spacing token
   above the measured range's midpoint keeps AA-consistent rhythm across
   themes). Documented in the css header with the probe citation.
3. **Border token #E7E8EA vs reference #E2E4E6** — token semantics; ΔE
   negligible.
4. **Chevron text-secondary #616871 vs #999999** — token semantics; the
   chevron is decorative (aria-hidden), so AA does not apply.
5. **Selected text stays text-primary #333** (frozen spec ruling: the border
   alone carries selection) — matches the reference's own #333; NOT a
   deviation, recorded because the vision pass raised the contrast note.

## Semantics note (recorded for the review pass)

tablist of `role=tab` chips (single-select filter); «Ещё» is the tablist's
SIBLING menu button (never a tab) opening a `menu` popover with
`menuitemradio` rows (the select 2.3 menu mold, single-tree aria id refs);
arrow-key roving focus; selection = value string channel per CONVENTIONS §4;
overflow chips (8th+) live in the menu. The closed panel hides via the
`hidden` attribute + `:host([hidden])` override — the 6.2 visual-gate
finding (author-origin `display:block` beats UA `[hidden]` without it).
