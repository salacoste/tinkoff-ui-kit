# Story 3.9 — tk-article-card provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run): kit-vs-kit baselines enforce drift from
here on; the maintainer confirms or re-takes this batch. Side-by-side source
(Story 2.0, tbank.ru): `.playwright-cli/captures/article-card-grid.png`
(1280×285). Parent evidence index: `../promo-card/NOTES.md`.

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | reference media grid (top) vs kit Playground grid (bottom), 40px white gutter |
| `side-by-side-dark.png` | kit dark render (top) vs kit light (bottom) on #1A1A1A |
| `kit-article-card-{light,dark}.png` | kit Playground 3-up grid |
| `article-card-capture.mjs` + `suites.json` | the committed capture recipe |

Same pinned capture env as the visual suite (see `../promo-card/NOTES.md`).

## Ground truth — probes vs reference

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Tile | ~334×230, fill ~#F5F5F7, radius ~16–20px | tint-gray #F5F5F6, radius-lg 16 (exact token in range), padding 32 | match |
| Heading | ~#1C1C1E ~20px 600–700, lh 28px, ≤2 lines | heading-6 20px/500 lh 1.35, line-clamp 2 (webkit+standard) | match (weight = discipline) |
| Description | ~#8E8E93 ~15px/21px, 2–3 lines | body-m 15px text-secondary | match |
| «Читать» link | blue ~14–15px, no underline/arrow | body-m at link-on-tint, underline on hover/:focus-visible | match (+ AA override, deviation 1) |
| Stitch | whole-card click (reference behavior) | `.card__link::after { position:absolute; inset:0 }` on the relative card — ONE tab stop | match (native anchor, footer precedent) |
| Flatness | no shadow | no box-shadow in sheet | match |

## Vision check pass (zai analyze_image, 2026-09-23)

- Same visual language: identical neutral gray family, uniform large
  radius, flat surfaces, matching heading scale/clamping, gray description,
  blue «Читать» pinned bottom-left, left-aligned, padding rhythm mirrors
  the reference.
- No internal defects: no truncation, no overlaps, no artifacts inside the
  kit cards. (Left-edge flush/bottom crop are element-shot framing, noted
  below.)

## Intentional deviations (documented, not defects)

1. **The link color is the on-tint AA step (blue-200), white on charcoal** —
   blue-100 = ~4.1–4.4:1 on the tint surfaces (fails 4.5:1); found by the
   axe gate, pinned by unit test. The dark layer remaps the on-tint token
   to dark-link.
2. **Focus indicator is the underline** (hover/:focus-visible fade on the
   motion token) — the tk-link §9 exception precedent for text links; the
   ring governs boxed controls.
3. **No media/illustration** — the reference's decorative monitor art is
   page content; the card is text-only per its spec.
4. **Element-shot framing** — the strip starts at the grid's content
   bounds; page gutters are consumer layout.
5. **Heading weight 500** vs the reference's ~600–700 — kit discipline.
