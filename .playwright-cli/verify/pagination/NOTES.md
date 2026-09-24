# Story 6.2 — tk-pagination side-by-side evidence (2026-09-24)

Reference: T-Bank invest/stocks catalog bottom strip — the «Показать еще»
bar + numbers row — captured in
`.playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png`
(776px content column). The kit render reproduces the capture's own scale:
count=196, show-more bar, page 1 active (uncontrolled default) →
‹ 1 2 3 4 5 … 196 ›.

## Files

| File | What |
|---|---|
| `pagination-side-by-side-light.png` / `-dark.png` | reference strip (top) vs kit render (bottom), 2px gray hairline between, white background |
| `kit-pagination-light.png` / `kit-pagination-dark.png` | kit renders (Playground story, count=196 page=1) — 1232×105 = 44 bar + 16 gap + 44 numbers |
| `reference-bar-numbers.png` | the reference crop itself (776×112) |
| `pagination-capture.mjs` | the committed capture recipe |

Reference crop: `magick .playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png -crop 776x112+0+1042 +repage reference-bar-numbers.png`

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6014 &
node .playwright-cli/verify/pagination/pagination-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides:
magick reference-bar-numbers.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-pagination-light.png -background white -append pagination-side-by-side-light.png
magick reference-bar-numbers.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-pagination-dark.png -background white -append pagination-side-by-side-dark.png
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter.

## Probe method

ImageMagick scanline runs: `magick img -crop Wx1+X+Y txt:-` collapsed to
unique-color runs; corner radius from the dy=1 chord inset
(inset = r − √(2r−1); bar inset 4 → r=8, capsule inset ≈15 → r=22). The
standing rule applies: every load-bearing value below is MEASURED; vision
reads are cross-checks only (see Vision check).

## Ground truth — pixel probes: reference vs kit

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Bar width | full-bleed x0→776 | full-bleed x0→1231 (AA pixels at both ends) | match |
| Bar height | 44px (orig y1052–1095) | 44px (y0–43, col x=100) | match — the spec's ~44–52 range taken at the measured bound (was 52 in the first cut, FIXED) |
| Bar radius | r≈8 (inset 4 at dy=1) | r≈12 — solid fill starts x11 at dy=0, radius-md | deviation 3 (token step) |
| Bar fill | #F2F4F7 | #F5F5F6 — surface-muted exact | deviation 4 (token semantics) |
| Bar label | #126DF7, centered, ~15–16px | #1464CC core (col x=631 y=23) — link-on-tint exact; glyph band ≈561–643 centered on the bar | deviation 5 (token semantics) |
| Bar→numbers gap | 19px (bar-bottom→pill-top) | 16px (bar ends y43, numbers box y60 = 44+16; space-16) | deviation 6 (was 64 in the first cut, FIXED to the token step nearest 19) |
| Numbers row | digit pitch ~36px, row centered (‹ x232 → › ~x555 on 776) | 44px boxes + 4px gaps → pitch 48; 9 boxes = 428px centered on 1232 | deviation 7 (§8 floor sanctioned) |
| Active pill | circle ⌀32 #FFDD2D (x257–288), #333 text | 40×32 STADIUM #FFDD2D (y66–97, x452–491), #333333 text core | fill/text exact; shape deviation 2 |
| Pill text contrast | dark on yellow | #333333 on #FFDD2D ≈ 9.3:1 — AA outright | match |
| Inactive numbers | #126DF7 (41px solid core run) | #1771E6 — link exact (cores at x568/612/616/660/665) | deviation 5 (token semantics) |
| ‹ disabled | #7AADFB (19px solid) | #9EA3AB AA ≈ #959BA4 — text-muted | deviation 5 (token semantics) |
| › enabled | #126DF7 | #1771E6 (strokes x750–770) | deviation 5 (token semantics) |
| Ellipsis | BLUE family (#2578F8–#5194F9) | #616871 exact — text-secondary (dots x706–715, y86) | deviation 5 (token semantics) |
| Total render height | bar 44 + gap 19 + row ≈44 | 44 + 16 + 44 = 105px (identify-verified) | match (gap token step) |

Kit numbers-row geometry (from the probes): numbers box y60–103 (44px, §8
floor); pill top y66 = box top + 6 (32px pill centered in the 44px box);
digit glyph band y≈74–89 (15px body-m in the 44px box).

## Vision check (zai analyze_image, 2026-09-24)

**Blocked by tooling for this component — recorded honestly.** The session's
CDN upload endpoint returned ONE fixed URL for every upload (basename-keyed,
first-write-wins: two uploads under fresh filenames came back byte-identical
to the first-uploaded FILTER-CHIPS composite), so the pagination composite
could never be delivered to the vision model. The filter-chips audit (same
session, same endpoint) succeeded and is recorded in its NOTES.

Consequence: pagination fidelity rests on the pixel probes above — which are
the project's ground-truth method anyway; every kit value in the table was
measured, none estimated. Prior vision reads on the raw reference WERE run
and six claims were refuted by pixels (full-bleed bar vs claimed x8–768;
44px vs claimed 45; pill position/⌀; blue inactive numbers vs claimed gray
#898989) — the refutation list lives in the 6.2 triage log.

## Intentional deviations (documented, not defects)

1. **Bar height 44px** — the spec's "~44–52px" range taken at the measured
   lower bound (the reference's own value). First cut shipped 52px on a
   fabricated "52–56" css flag; FIXED in this story with the probe citation.
2. **Active pill = 40×32 radius-full stadium, not the reference's ⌀32
   circle.** DESIGN.md pins `pagination.radius: full`; the uniform stadium
   also holds 2–3-digit pages (…196) without a shape change. Height matches
   the reference exactly (32).
3. **Bar radius-md 12 vs reference r≈8** — the token step nearest 8.
4. **Bar fill surface-muted #F5F5F6 vs #F2F4F7** — token semantics; ΔL
   imperceptible (<1.5%). DESIGN.md pins only token semantics for
   pagination, so unfrozen geometry follows tokens.
5. **Link-family token semantics:** digits link #1771E6 (ref #126DF7), bar
   label link-on-tint #1464CC (ref #126DF7 — the AA-correct link step the
   token layer defines for tinted fills), disabled ‹ text-muted #959BA4 (ref
   light-blue #7AADFB), ellipsis text-secondary #616871 (ref blue). The kit
   speaks its own link/disabled/ellipsis language; hue family preserved
   (blue digits/chevrons, gray only where the kit's disabled language says
   gray).
6. **Bar→numbers gap 16 (space-16) vs measured 19** — the token step nearest
   19 (space-16 renders 16px box-to-box; the reference's 19 includes its
   own row-box rounding). First cut shipped 64 on a fabricated flag; FIXED.
7. **Digit pitch 48 vs reference ~36** — the §8 44px-target floor; the
   spec's a11y section sanctions it explicitly (invisible 44px fields
   around ~32px glyphs).

## Semantics note (recorded for the review pass)

Full semantics live in pagination.ts / the Accessibility story: `<nav
aria-label>` wrapper; numbers are BUTTONS (no URL model — consumer handles
page-change); active = `aria-current="page"` focusable-but-current; border
chevrons `aria-disabled` focusable no-op; ellipsis `aria-hidden`; «Показать
еще» emits load-more only (never changes page); focus lands on the
NEWLY-ACTIVE number after a change. page/defaultPage follows CONVENTIONS §4
verbatim (strict controlled, release-with-seed, clamp to [1, count]).
