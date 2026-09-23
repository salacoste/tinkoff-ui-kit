# Story 3.5 — tk-footer provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru):
`.playwright-cli/captures/footer.png` (1280×1910 — carries the reference's
own sticky-header and cookie-card capture artifacts, noted where relevant).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference full footer (top) vs kit footer (bottom), 40px white gutter |
| `kit-footer-{light,dark}.png` | kit footer (Playground story — 6 columns, 7 pills, phone, legal) |
| `footer-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800,
DSF 1, `--font-render-hinting=none --disable-lcd-text`, reducedMotion
reduce, colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/footer/footer-capture.mjs   # COMMITTED alongside this NOTES
# side-by-side:
#   magick \( ../../captures/footer.png \) \( -size 1280x40 xc:white \) \
#     \( kit-footer-light.png \) -background white -append side-by-side-light.png
```

## Ground truth — pixel probes vs reference (ImageMagick)

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Group headers | 12px uppercase ≈#8A8A8E, ~0.05em tracking | stems ≈#636A73 (caps-s tokens + text-transform: uppercase) | match on metrics; **DEVIATION 2** on color (AA) |
| Column links | ~15px gray #8C-ish, ~31px pitch | body-m 15px, text-secondary #616871, pitch 30.5px (22.5 line + space-8) | match (token rhythm) |
| Columns | 6 tracks, 40–60px gaps, ~88px gutters | auto-fill minmax(160px,1fr) at space-40; 6 columns in one row at 1200px | match (grid, not fixed tracks) |
| Top divider | 1px #E6E6E6 above the directory | 1px #E7E8EA EXACT (border-default) above the bottom zone | match (placement differs — see deviation 1) |
| Pills | #2C2C2E fill, white 14px, h≈36px | ink-300 #333333 EXACT fill, white body-s text, 44px min-height | fill = frozen DESIGN spec; **DEVIATION 3** (44px floor) |
| Phone | white bold ~18px | body-l-bold (17px/500) text-primary, right-aligned | match (token step) |
| Legal | ~13px #8E8E93 with inline links | body-xs 12px text-secondary slot; inline links = composed tk-link legal | match (token step) |
| Dark theme | — (site light-only) | bg #1A1A1A, header band ≈#B6B6B6 (white-alpha blend), pills stay #333 (ink scale unmapped — tone-invariant like charcoal), white text 12.6:1 | tonal mapping correct |

## Vision check pass (zai analyze_image, 2026-09-23)

- Structure confirmed: 6 uppercase-gray-header columns, pills/phone/legal
  all render legibly, NO clipping/overlap/artifacts in the kit strip.
- The reference's sticky-header band and cookie card (its capture's own
  artifacts) correctly absent from the kit render.
- Noted deltas are the documented deviations below (flat single surface,
  one header tier, link tone) plus content-scale differences (fewer
  pills/links, one-line legal, no phone caption) — the story's demo data,
  not the component's shape.

## Intentional deviations (documented, not defects)

1. **Flat single surface — no dark legal strip.** The reference's two-zone
   mega-footer (white directory + hard-edged black strip) paints the dark
   zone at PAGE level; the kit ships the flat directory + a
   divider-separated bottom zone, and the pills carry their OWN ink fill
   (they read on any surface). Consumers compose the strip:
   `<div class="dark-strip"><tk-footer …>` — the 96–120 section rhythm
   and page surfaces are the consumer's layout (the spec's own ruling).
2. **Caps headers text-secondary, not the probed ≈#8A8A8E.** The probe
   color fails AA at ≈3.2:1; the kit's semantic override is text-secondary
   (5.64:1) — the AA-override ruling DESIGN.md's contrast table applies to
   failing reference pairs.
3. **Pill height 44px, not the reference's 36px** — the ≥44px
   interactive-target floor. Fill stays the frozen `footer-pill-link`
   spec (ink-300 / white / radius-full); hover darkens one token step
   (ink-300 → ink-400) at the 150ms token.
4. **One header tier per column.** The reference interleaves uppercase
   group labels + bold title-case sub-headers; the spec's frozen model is
   `columns: [{ title, links }]` with caps-s headers — the systematized
   shape, recorded here.
5. **Phone is plain bold text, not a tel: link** — the spec's `phone`
   prop carries no href; wrap in your own link if needed (documented in
   the element jsdoc).

## Rulings recorded (spec Implementation Notes)

- **Landmark technique**: the SHADOW tree renders a native `<footer>`
  element (implicit contentinfo) — no role juggling on the host.
- **Caps transform placement**: `text-transform: uppercase` at render
  (footer.css.ts, unit-pinned) — the caps-s token carries no case, per
  DESIGN.md's typography note.
- **Column omission**: a column with no title or no links never renders
  (the matrix row); null columns/quickLinks clamp to empty.

## Semantics note (recorded for the review pass)

Columns are real ul/li lists under h3 headers; every link is a native
anchor named by its text with the unified focus ring; the pills are ≥44px
targets; the legal slot styles body-xs and expects composed tk-link
`legal` inline links (composed, not reimplemented). Stateless: nothing
dispatches, no event-map entry (the spec's ruling).
