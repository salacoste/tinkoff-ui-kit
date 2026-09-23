# Story 3.8 — tk-service-card provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run): kit-vs-kit baselines enforce drift from
here on; the maintainer confirms or re-takes this batch. Side-by-side source
(Story 2.0, tbank.ru): `.playwright-cli/captures/service-card-grid.png`
(1280×361). Parent evidence index: `../promo-card/NOTES.md`.

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | reference directory grid (top) vs kit Playground grid (bottom), 40px white gutter |
| `side-by-side-dark.png` | kit dark render (top) vs kit light (bottom) on #1A1A1A |
| `kit-service-card-{light,dark}.png` | kit Playground 3-up grid |
| `service-card-capture.mjs` + `suites.json` | the committed capture recipe |

Same pinned capture env as the visual suite (see `../promo-card/NOTES.md`).

## Ground truth — probes vs reference

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Tile | ~334×316, fill ~#F5F6F8, radius ~24px | tint-gray #F5F5F6, radius-xl 24, padding 24 | match (register) |
| Icon | 44×44 rounded-square ~12px radius, blue 3D gradient | space-48 tile at radius-md (12px), consumer art | match on track (DEVIATION 2 demo art) |
| Heading | near-black ~24px 600–700 | heading-5 24px/500 text-primary | match (weight = discipline) |
| Body | ~#33383D 16px/24px 3 lines | body-m 15px text-secondary | match (token step) |
| Link | brand blue 16px, no underline | slotted tk-link standalone, on-tint AA step, pinned bottom | match (+ AA override, deviation 1) |
| Padding | ~28px left / ~40px top (asymmetric) | space-24 symmetric (DESIGN frozen) | match on systematization |

## Vision check pass (zai analyze_image, 2026-09-23)

- Same visual language: flat gray fill, oversized radius, no shadows,
  icon→heading→description→link left-aligned rhythm, blue links pinned low
  at a consistent baseline across cards.
- No overlap/text overflow inside kit cards. (The reference row's own
  CRT-illustration overlap is reference-side, not counted.)

## Intentional deviations (documented, not defects)

1. **Links consume the on-tint AA step (blue-200), not the reference's
   blue** — blue-100 = ~4.1–4.4:1 on the tint surfaces (fails 4.5:1); the
   card re-scopes `--tk-color-link` to `--tk-color-link-on-tint` for its
   subtree (white on charcoal). Found by the axe gate, pinned by unit test.
2. **Demo icons are flat tinted squares** (no glyphs) — the kit ships no
   icon set; the projected 3D tile is consumer content (container
   aria-hidden).
3. **Element-shot framing** — the kit strip starts at the grid's content
   bounds; the reference grid's page gutters are consumer layout.
4. **Heading weight 500** vs the reference's ~600–700 — kit discipline.
