# Story 7.2 — tk-cookie-banner side-by-side evidence (2026-09-24)

Reference: T-Bank invest/stocks cookie consent dialog — the live DOM
snapshot's own copy («Мы используем куки, чтобы делать сайт удобным для
вас» + slotted link «Согласие на обработку данных» /privacy/ + pill
«Хорошо»), element-captured in
`.playwright-cli/captures-v2/invest-stocks/cookie-dialog-element.png`
(212×126 file px = the WHOLE card incl. ~2–3px AA halo; card interior
202×118). The kit render reproduces the capture's own copy verbatim in the
Playground story.

## Files

| File | What |
|---|---|
| `cookie-banner-side-by-side-light.png` / `-dark.png` | reference element crop (top) vs kit render (bottom), 2px gray hairline between, white background |
| `kit-cookie-banner-light.png` / `-dark.png` | kit renders (Playground story, default copy + «Хорошо») — 228×143 = 212×127 card + 8px clip pad |
| `ref-x4.png` | the 4× reference render (848×504) the spec probes ran on |
| `cookie-banner-capture.mjs` | the committed capture recipe |
| `runs.awk` | the scanline-run collapser the probes below use |

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6023 &
node .playwright-cli/verify/cookie-banner/cookie-banner-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides:
magick .playwright-cli/captures-v2/invest-stocks/cookie-dialog-element.png \
  -bordercolor '#E0E2E4' -border 0x2 \
  .playwright-cli/verify/cookie-banner/kit-cookie-banner-light.png \
  -background white -append .playwright-cli/verify/cookie-banner/cookie-banner-side-by-side-light.png
# …same with kit-cookie-banner-dark.png for the -dark composite
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter.
The card is TOP-LAYER promoted, so the kit capture is a PAGE-LEVEL clip over
the card rect (element screenshots of the host see an empty
`display: contents` box) — the same reason the story baselines exclude it
and `tests/visual/cookie-banner.spec.ts` exists.

## Probe method

ImageMagick scanline runs (`magick img -crop Wx1+X+Y txt:-` collapsed by
`runs.awk`) plus a DOM-geometry pass in the same pinned browser (card rect,
computed radius/padding/gap, line count, computed colors) — DOM numbers are
exact, pixel runs disambiguate the reference. The standing rule applies:
every load-bearing value below is MEASURED; vision reads are cross-checks
only (see Vision check).

## Ground truth — reference vs kit

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Card width | 202px interior (212 file px incl. halo); its own cap ≈202 | 212px (cap; DOM: fit-content → 212) | match — the 212 cap IS the measured reference width (see deviation 3) |
| Card height | 118px | 127px | deviation 5 (44px hit floor + uniform padding) |
| Radius | r=16 — chord inset ≈3.5px at dy=6 | 16px computed; chord inset ≈3–4px at dy=6 (row y14: AA ramp x1–10) | match — radius-lg chord-verified in BOTH |
| Fill | #FFFFFF | surface-base #FFFFFF (light) | match |
| Padding | ragged: L≈13 (text x14), T≈18, B≈6 (pill bottom 112, card 118) | uniform 16px (space-16; DOM pad "16px") | deviation 2 |
| Text | 3 glyph bands (y≈21–34/42–54/64–70), 13px, cores #333-family | 2 lines (DOM: 39px = 2×19.5 at 180px content), 13px/19.5 body-s, cores #616871 exact | ink deviation 6; line count deviation 5 |
| Link «куки» | ~#A0–#B0 AA (#B8B8B8 family) | computed rgb(97,104,113) = text-secondary exact (dark: rgba(255,255,255,.7)) | deviation 6 (frozen §6 mapping) |
| Pill geometry | x13–80 y81–112 → 68×32, hit = pill | 73.6×32 pill centered in a 73.6×44 hit box (DOM) | height match (32 exact); width +6 (font rag); hit floor deviation 1 |
| Pill fill | #F2F4F7 | #ECF1F7 = surface-field exact (dark: rgba(255,255,255,.1)) | deviation 7 (token semantics) |
| Pill label | #333-family cores (y94–101), 600 | text-primary + font-weight 600 literal | match (weight deviation 8 — literal) |
| Message→pill gap | ≈11px (text band ends 70, pill 81) | 12px (space-12; DOM gap) | match (token step) |
| Bottom-left inset | viewport crop — see Position below | left 16 / bottom 16 exact (DOM: card x16, y+127 = 800−16) | flagged judgment 4 |
| Motion | none observed | none — no transition/animation tokens in the sheet (frozen) | match |
| Focus ring | not in the static crop | 2px ring visible in kit renders: the OPEN state's own initial focus on «Хорошо» (the contract; chromium matches :focus-visible on the post-open programmatic focus) | contract artifact, not drift |

Kit card geometry (DOM, light): 212×127 at (16, 657) = 16px bottom gap;
message 180×39 (2 lines); accept box x32 y724 73.6×44, pill 73.6×32.

## Position (live re-attempt — honest note)

The bottom-left PLACEMENT evidence is the frozen live DOM snapshot +
`cookie-dialog-viewport.png` (the session's settle attempt): the dialog sits
in the viewport's bottom-left corner. A fresh live re-capture was NOT
attempted this story: the site gates the dialog behind a session/geo state
that made the earlier settle flaky, and the reference crop + viewport frame
already pin the corner unambiguously. The 16px INSET itself did not resolve
to sub-10px certainty in the viewport frame — it stands as the FLAGGED house
judgment (16 = space-16, standard T-Bank fixed-surface gap), recorded as
deviation 4, not as measured truth.

## Vision check

**Blocked by tooling — recorded honestly, zero vision claims.** The session
environment returns a CDN URL instead of an inline render for image reads
(the same endpoint behavior the pagination/filter-chips NOTES record). No
vision read informed ANY value above — the table is entirely ImageMagick
pixel runs + DOM computed geometry.

## Intentional deviations (documented, not defects)

1. **44px hit box around the 32px pill (§8)** — the reference's pill IS its
   own hit area (32px < the floor); the kit pads the hit box invisibly (the
   navbar drawer-link / pagination page-box pattern). Pill height is
   probe-measured 32px — the spec's "~24px visual" estimate trued to the
   measured bound (the pagination bar-height precedent).
2. **Padding 16 uniform (space-16)** vs the reference's ragged L≈13/T≈18/B≈6
   — the token step is the flagged pick over three ragged edges.
3. **max-width 212px** — the MEASURED reference card width. The spec's
   "~320px (flagged)" estimate shipped first and rendered the reference copy
   as 320×2 lines; trued down to the measured bound this story (the standing
   measured-over-estimate rule). Length literal, sanctioned by the guard's
   own scope (colors/z only) and the min-width-180 precedent beside it.
4. **16px bottom-left inset** — flagged house judgment (space-16), not
   sub-pixel measured; see Position above.
5. **Card height 127 vs 118; 2 lines vs 3** — the §8 44px hit floor (vs the
   reference's 32px self-hit pill) plus uniform 16px bottom padding (vs its
   6px) make the kit 9px taller; DaytonaSans packs the same copy into 2
   lines where the site font needs 3. Same frame (212), different rag.
6. **Message/link ink: text-secondary #616871** vs the reference's #333 text
   / #B8B8B8 link — the spec's frozen §6 mapping (link rides the
   `--tk-cookie-banner-link` hook, default text-secondary; the muted-family
   reference value recorded in the spec's own evidence block).
7. **Pill fill surface-field #ECF1F7** vs #F2F4F7 — frozen token semantics
   (the blue-tint field register; surface-muted #F5F5F6 is RGB-nearer but
   the wrong family — field matches the reference's blue-tinted gray).
8. **Accept label font-weight 600 literal** — capture-measured; the token
   bold step is 500, the reference is heavier (the pagination 700
   precedent).
9. **`::slotted(a:focus-visible)` underline** added beyond the frozen
   "hover only" — the tk-link exception language: the underline IS the link
   register's focus affordance (§8 hover-never-the-only-path parity).
10. **Conditional focus restore** — on close, focus returns to the pre-open
    element ONLY while focus still sits inside the banner (a non-modal page
    is interactive; restoring unconditionally would yank the user back).
11. **NO hover restyle, NO transition anywhere** — the frozen no-motion
    ruling (the one kit surface whose every state change is instant).

## Semantics note (recorded for the review pass)

Full semantics live in cookie-banner.ts / the Доступность story: card =
`role="dialog"` named via aria-label (NO aria-modal — non-modal by contract);
NO scrim, NO scroll-lock, NO focus trap (Tab leaves naturally); Esc is
PREVENTED but never answers (consent is a positive act — no dismiss, no
open-change); outside pointerdown is not listened to at all; «Хорошо»
emits ONLY `consent-choice` (§3 bare verb, payload-less) — the kit never
closes itself, never touches localStorage/cookies (storage is the
consumer's). `open`/`open-change` follows CONVENTIONS §9 verbatim
(reflecting prop, `{value}` echo post-mount/post-release, flip-only
`wasOpen !== undefined` first-paint guard). Storage and SR-protocol
execution remain consumer/maintainer-side (deferred-work).
