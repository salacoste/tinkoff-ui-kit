# Story 6.3 — tk-combobox-search side-by-side evidence (2026-09-24)

Reference: T-Bank invest/stocks catalog search field — the top strip of
`.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png`
(the borderless white field with the magnifier and «Название или тикер»
placeholder on the #F6F7F8 catalog canvas). The kit render reproduces the
CLOSED field (Playground story, canvas painted muted — see capture recipe)
and the OPEN suggestion panel (the «Открытое меню» story, whose TypeOnMount
directive drives the real typing path: focus + input «н» on the shadow
control → 5 filtered rows), light + dark.

## Files

| File | What |
|---|---|
| `combobox-search-side-by-side-light.png` / `-dark.png` | reference strip (top) vs kit closed field (bottom), 2px gray hairline between, white background — 1200×129 (the 824px reference right-padded to the 1200px kit width) |
| `kit-combobox-search-light.png` / `-dark.png` | kit closed field (Playground) — 1200×53 = the 52px field + focus-free AA edge |
| `kit-menu-open-light.png` / `-dark.png` | kit OPEN panel, page-level clip with 8px padding (top-layer pixels included) — 1216×320 |
| `reference-field.png` | the reference crop itself (824×72) |
| `combobox-search-capture.mjs` | the committed capture recipe |
| `reference-measurements.md` / `runs.awk` | shared provenance (committed at story 6.1) |

Reference crop: `magick .playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png -crop 824x72+0+0 +repage reference-field.png`

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6020 &   # 6016–6019 were taken by sibling agents
node .playwright-cli/verify/combobox-search/combobox-search-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides:
magick reference-field.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-combobox-search-light.png -background white -append combobox-search-side-by-side-light.png
magick reference-field.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-combobox-search-dark.png -background white -append combobox-search-side-by-side-dark.png
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter
(tests/visual/fonts.css — the same override inject.ts applies).

Two capture notes. (1) The CLOSED-field render paints the story canvas
`var(--tk-color-surface-muted)` first: the field is BORDERLESS surface-base,
so on the default surface-base canvas its box would be pixel-invisible —
the reference register is exactly the field on a muted canvas. (2) The OPEN
render must be a PAGE-LEVEL clip (the capture script uses
`page.screenshot({ clip })`): element screenshots exclude top-layer
(promoted popover) content — the same rule as
tests/visual/combobox-search.spec.ts.

## Probe method

ImageMagick scanline runs: `magick img -crop Wx1+X+Y txt:-` collapsed to
unique-color runs via `runs.awk`; corner radius from the dy=1/dy=2 chord
insets (inset = r − √(2r·dy − dy²); insets 6/4.5 → r≈11–12). Open-panel
geometry logged from the page itself (getBoundingClientRect of field,
panel, first two rows — printed by the capture script). The standing rule
applies: every load-bearing value below is MEASURED; vision reads are
cross-checks only (see Vision check — blocked).

## Ground truth — pixel probes + page geometry: reference vs kit

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Canvas | #F6F7F8 | #F5F5F6 (surface-muted, painted) | deviation 4 (token semantics, Δ1/channel) |
| Field fill | #FFFFFF solid | #FFFFFF exact | match |
| Field border | none (pure AA step to canvas) | none | match |
| Field height | ≥52 visible (capture crops the field top: white band y23–55) | exactly 52px (spec) | match (spec-consistent) |
| Field radius | r≈11 (insets 6 / 4.5 at dy=1/2) | r≈11–12 = radius-md 12 (same insets) | deviation 5 (token step) |
| Icon box / strokes | strokes x20–33, core #999999, ~1.5–2px strokes | strokes x18–31, core #959BA4, same stroke weight | deviation 2 (token semantics) |
| Icon→placeholder gap | glyphs from x52 → ≈16px box-to-glyph (icon box ≈x16–36), ≈19px stroke-to-stroke | glyphs from x53 (AA) / x54 (core) → ≈17px box-to-glyph (icon box x16–36 = space-16 + 20px) | match — deviation 1 TRUED this round (was ≈1px box-to-glyph before the fix; the 1px residue is glyph sidebearing/AA) |
| Placeholder | cores #999–#A5 | cores #959BA4 (text-muted) | deviation 3 (token semantics) |
| Focus ring | none (capture is unfocused) | #1771E6 2px in the OPEN render | state difference, not a deviation (the open state is reached by the typing path — focus is by construction) |

Open-panel geometry (page probes, light+dark identical):

- field 1200×52; panel 1200×248 — `widthMatch: true` (matchAnchorWidth:
  the panel is exactly the field width, never narrower)
- field→panel gap 4px (MENU_OFFSET_PX), anchored below the field box
- 5 rows for «н» (Сбербанк, Норникель, Яндекс, Т-Технологии, Роснефть),
  `rowHeight: 48` — and pixel-proven: the active row (Яндекс) fill band
  #ECF1F7 = surface-field, exactly 48px tall
- dropdown shadow present below the panel: #E6E6E6 band x26–1189
  (--tk-shadow-dropdown)
- panel radius: radius-md (the `--tk-combobox-search-menu-radius` slot
  default) — NOT pixel-probeable here (white panel on white canvas);
  recorded as the token value, honestly
- status region: «Найдено 5 инструментов»

The reference menu is not part of the evidence: the capture's field is
CLOSED. The kit's menu surface follows the spec's picks (select-menu
language: 48px radius-sm rows on surface-base, surface-field active fill,
dropdown shadow) — documented as kit surface, not a deviation.

## Vision check (zai analyze_image, 2026-09-24)

**Blocked by tooling — recorded honestly.** One attempt was made per the
round instruction (the light composite, audit prompt covering height,
radius, icon weight/color, the icon→placeholder gap, placeholder color,
border, left padding). The session's only image-analysis channel forwards
REMOTE URLs; the composite was delivered as a data: URL and the backend
rejected it: 400 «file must pass at least one of file_id, file_url,
file_data» — i.e. the endpoint wants a hosted file, and no upload endpoint
exists this session (the pagination round hit the same missing channel
through the CDN first-write-wins fault). Zero vision claims recorded.

Consequence: fidelity rests on the pixel probes + page geometry above —
the project's ground-truth method anyway; every kit value in the table was
measured, none estimated. Notably the probes caught what vision round have
been asked to check anyway: the icon→placeholder gap (deviation 1).

## Intentional deviations (documented, not defects)

1. **Icon→placeholder gap — TRUED this round (the 6.2 geometry-truing
   pattern): was ≈15px short, now matches within 1px.** First cut:
   `.field__icon` carried only `margin-inline-start: var(--tk-space-16)`,
   so the control followed the 20px icon box with no trailing gap —
   placeholder glyph at x37 (≈1px box-to-glyph) vs the reference's x52
   (≈16px box-to-glyph = 16 field padding + 20 icon box + 16 gap, the
   reference-measurements.md arithmetic). Fix (lead-approved):
   `margin-inline-end: var(--tk-space-16)` on `.field__icon`
   (combobox-search.css.ts). After: glyph AA at x53 / core x54 → ≈17px
   box-to-glyph; the 1px residue vs 16 is glyph sidebearing/AA, not
   geometry. All 16 baselines re-taken on the fixed build; kit renders,
   composites and probes in this directory are the POST-fix set.
2. Icon color #959BA4 (text-muted) vs reference #999999 — token
   semantics; Δ ≤ 1/channel, imperceptible.
3. Placeholder #959BA4 (text-muted) vs reference #999–#A5 band — token
   semantics; the kit value sits at the band's darker end.
4. Canvas #F5F5F6 (surface-muted) vs reference #F6F7F8 — context token
   semantics, Δ 1/channel.
5. Field radius radius-md 12 vs reference r≈11 — the token step nearest
   11 (the pagination deviation class).
6. Focus ring in the open render — an interaction STATE difference (the
   reference capture is unfocused), recorded so the composite reader does
   not count it as a deviation.

## Found during verify (process notes for the review pass)

- The «Открытое меню» story's TypeOnMount directive was initially
  committed as `data-driver=${typeOnMount}` — an UNCALLED directive
  factory: Lit requires `${typeOnMount()}` in the template, otherwise the
  factory is stringified into the attribute and never runs. The driver had
  NEVER executed, so the story's original baselines recorded a CLOSED
  field. Fixed in combobox-search.stories.ts; docs rebuilt; the two --open
  baselines re-taken scoped. Nothing else in the suite asserted that
  story's expanded state — the verify capture is what caught it.
- The 'н' filter expectation: 'н' matches 5 of the 10 INSTRUMENTS
  (Сбербанк contains 'н'), not 4 — corrected in the spec + story comment
  before the page-clip baselines were taken (happy-dom unit tests never
  typed 'н', so the miscount had never surfaced).

## Semantics note (recorded for the review pass)

Full semantics live in combobox-search.ts / the Accessibility story:
`role="combobox"` (aria-expanded/controls/activedescendant,
aria-autocomplete="list") named via `aria-label`; panel `role="listbox"`
with `role="option"` rows + `aria-selected`; focus NEVER leaves the field
(arrows drive aria-activedescendant); the magnifier is aria-hidden; IME
pauses the pipeline (isComposing); «Найдено N инструментов» in a polite
region; the panel's open state is INTERNAL (the §9 exception-log entry,
filter-chips precedent); value follows CONVENTIONS §4 verbatim (typing
never emits; Enter on a row emits value-change; Esc restores the value
text).
