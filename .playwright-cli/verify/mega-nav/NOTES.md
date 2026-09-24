# Story 7.1 — MegaNav verify evidence (two-deep header)

All numbers below are PIXEL PROBES (ImageMagick scanline runs) or live-DOM
geometry, not vision reads. Vision was used once as a cross-check (bottom).
Reference = `.playwright-cli/captures-v2/invest-stocks/pattern-header-meganav.png`
(1280x129 crop of the two-row header region, light mode; no dark reference exists).

## Files

| File | What it is |
| --- | --- |
| `reference-meganav.png` | 1280x129 crop of the reference two-row region |
| `kit-mega-nav-light.png` / `kit-mega-nav-dark.png` | Element screenshots of `tk-navbar` in the `components-navbar--mega-nav` story (fixed story), pinned capture env |
| `mega-nav-side-by-side-light.png` | reference + 2px #E0E2E4 hairline + kit light (1280x269) |
| `mega-nav-side-by-side-dark.png` | hairline + kit dark (no dark reference exists; 1280x140) |
| `mega-nav-capture.mjs` | Committed capture recipe (see below) |
| `runs.awk` | Scanline run-collapse program (reference copy; the sandbox refuses `awk -f`, so the body is inlined into commands) |

## Capture recipe (reproduce)

```sh
pnpm build                                   # docs dist must contain the stories
node tests/visual/serve.mjs 6015 &           # free port >= 6015
node .playwright-cli/verify/mega-nav/mega-nav-capture.mjs
# composites (ImageMagick):
#   magick -size 1280x2 xc:"#E0E2E4" hairline.png
#   magick reference-meganav.png hairline.png kit-mega-nav-light.png \
#     -background white -append mega-nav-side-by-side-light.png
```

Pinned env (same as `tests/visual`): chromium `--font-render-hinting=none
--disable-lcd-text`, 1280x800 DSF 1, `reducedMotion: reduce`, `colorScheme:
light`, locally served DaytonaSans/Inter via `tests/visual/fonts.css`.

Probe method: `magick <img> -crop Wx1+X+Y txt:-` piped through the inline
run-collapse awk (consecutive same-RGB pixels collapse to `xSTART-END rgb n=`),
luminance threshold 249 for "ink" (light) / brightest-pixel for dark.

## Reference ground truth (light crop, y0–128)

| Probe | Value |
| --- | --- |
| Row 1 | y0–63 (64px tall) |
| Logo shield | x88–116, yellow #FFDD2D |
| Brand wordmark «Банк» | x124–178, #333 BOLD — 337 sub-100-lum px, DENSER than the active link (139) → it is the logo lockup text, not a nav link |
| Inactive row-1 links | from x232 («Бизнес» group x232–328), regular weight, core grays ~#757575 |
| Active row-1 «Инвестиции» | x354–427, #333 bold + UNDERLINE 2px #666666 at y62–63, x353–428 |
| Utilities «Войти» | right-aligned blue #336FEE text link (x1124–1188) |
| Divider between rows | 1px #DDDFE0 at y64, x88–1191 (full container width) |
| Row 2 | y65–128 (64px tall) |
| Row-2 first item «Обзор» | starts x88 == container content edge == logo left edge |
| Inactive row-2 links | core grays ~#757575 (same family as row 1) |
| Active row-2 «Каталог» | x151–193, #333 bold + UNDERLINE 2px #666666 at y127–128, x150–196 (bottom edge of the row) |

## Kit ground truth (fixed story, element PNG 1280x138)

| Probe | Value (light / dark) |
| --- | --- |
| Row 1 (`.bar__inner`) | y0–71, height 72 — v1 DESIGN height, v1-verbatim |
| Row 2 (`.subnav`) | y72–135, height 64 (`--tk-navbar-subnav-height`, capture literal, flagged in css) |
| Whole bar | 137px; one sticky unit; shadow/border gated on the 10px scroll threshold (bottom rows clean at scroll 0: y133–137 = 0 px) |
| Row-1 active «Инвестиции» | #333 700; underline 4px #FFDD2D y69–72, ~x292–385 (v1 DESIGN language, v1-identical css) |
| Row-1 inactive | (97,104,113) = `--tk-color-text-secondary`, 400 / dark: #BABABA core |
| Row-2 active «Каталог» | #333 700, NO underline (y128–137 clean — spec pin) / dark: up to #FFF core |
| Row-2 inactive | `--tk-color-text-secondary` 400 (same token as row 1) |
| Seam y72–76 | clean (93 px at y72 = the row-1 underline's bottom row only); NO divider |
| Registers | `.bar__inner` left == `.subnav__inner` left == x40 (1200px container centered at 1280) — both rows share the container content register, mirroring the capture's x88/x88 |
| Row-2 first box | x64 (container edge + 24 container padding), text x76 (+12 link padding); row-1 link boxes start x148 (after the slotted logo) |

DOM geometry log (capture script, both themes identical):
`barHeight 137, innerHeight 72, subnavHeight 64, subnavTop 72, innerLeft 40,
subInnerLeft 40, row1LinkLeft 148, subLinkLeft 64`.

## Vision cross-check (optional, one upload)

`meganav-left-inspect-2x.png` (560x129 left region at 200%) analyzed via the
image-analysis tool; the CDN session-slot fault did NOT trigger this session
(returned URL matched the basename). All five vision claims verified against
probes: (1) shield-T + bold «БАНК» wordmark — probe-confirmed (lockup, denser
than active); (2) divider present — x88–1191 #DDDFE0; (3) row-1 underline under
«Инвестиции» — y62–63 #666666; (4) row-2 underline under «Каталог» — vision was
RIGHT where the initial y118–120 probes were too high; extended probes found
the 2px #666666 stripe at y127–128 x150–196; (5) row-2 active darker/bold —
#333 cores. Pixels remain ground truth; this is the recorded cross-check.

## Deviations (kit vs reference capture)

1. **Row-1 active underline color/weight** — capture: 2px #666666 gray; kit:
   4px #FFDD2D yellow. Row 1 is frozen v1-verbatim (DESIGN-wins ruling from the
   v1 story); kit renders the v1 language. Reported, not changed.
2. **Row-2 active underline EXISTS in the capture** — 2px #666666 y127–128
   x150–196 under «Каталог». The frozen spec pins NO underline for row 2
   ("700 text-primary, no underline"; unit-pinned by the absent
   `.sublink[aria-current]::after`). Implemented per spec; reported as the
   single largest capture-vs-spec contradiction. The story copy's old claim
   "полос нет на y118–120" was probe-refuted and reworded.
3. **Divider between rows** — capture HAS 1px #DDDFE0 at y64 (x88–1191); spec
   froze NO divider (white-field separation). Implemented per spec; reported.
4. **Register phrasing** — spec: row 2 aligns with the row-1 LINK register
   "NOT the logo register" (x≈88). In the capture x88 is simultaneously the
   container content edge AND the logo left edge — the two coincide, so the
   spec's distinction is not resolvable there. Kit aligns `.subnav__inner` to
   the same container math as `.bar__inner` (both x40), which reproduces the
   capture's shared register.
5. **Row-1 height** — capture 64px vs v1 DESIGN 72px. v1-verbatim ruling; kit
   72px.
6. **Container inset** — capture content register x88 at 1280w; kit x40
   (1200 container centered). V1-inherited delta, unchanged by 7.1.
7. **First-text inset** — kit link boxes carry +12px inline padding (44px
   min-target rationale); capture text starts at the container edge.
8. **«Банк» in the capture is the wordmark, not a link** — the spec's §D
   example lists «Банк» among row-1 links; the capture's row-1 links start at
   «Бизнес» (x232). Content-level only (row-1 links are consumer data; the kit
   story keeps «Банк» as first MEGA_LINKS entry).
9. **Utilities** — capture «Войти» is a blue #336FEE text link; the kit story
   composes the house utility pill. Utilities are slot content, not anatomy.

## Incidents (recorded for the orchestrator)

- **Story bug caught by probes**: the MegaNav story inherited the file-level
  Storybook `args.activeValue: 'retail'`, which matches no MEGA_LINKS value —
  row-1 rendered with NO active link (helper `?? 'invest'` never fired because
  Storybook always injects the meta default into `(args)` stories). Fixed with
  a story-level `args: { activeValue: 'invest' }` override; `MegaNav` light+dark
  baselines regenerated AFTER the fix (the other six mega baselines never had
  the bug — their stories don't take Storybook args).
- **Foreign leaked webServer**: a `serve.mjs 6007` process from the MAIN
  checkout (started 20:34:53, serving a dist WITHOUT the mega stories) squatted
  the visual-suite port; `reuseExistingServer: !CI` made two runs fail with
  false "Couldn't find story" errors. Process killed; runs green after. Shared-
  machine hazard worth a governance note.
- **Baseline accounting**: 8 NEW mega baselines + 2 regenerated
  `components-navbar--api` baselines (the auto-generated API table legitimately
  grew rows for `subLinks`/`subActiveValue`/`subLabel` — canvas 1073px → 1280px,
  diff localized to the table region; all v1 RENDER baselines untouched and
  passing compare-mode).
