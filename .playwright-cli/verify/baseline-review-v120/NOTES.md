# Gate v1.2.0 — session forensics (2026-09-27)

Two maintainer-side flags investigated during the batch-confirm sitting
(Group 2, image 13). Pixel ground truth throughout (scanlines +
connected-components); no baselines touched.

## 1. «Кнопка разной высоты» (flagged on theming-guide--switching [dark])

**Within image 13: NO height difference.** The demo row renders
`tk-button variant="primary" size="card"` «Продолжить» = **154×48 @ x89,y633**
and `tk-button variant="secondary" size="card"` «Подробнее» = **140×48 @
x426,y633** (dark fill #1A1A1A, 1px edge #3A3A3A, light glyphs — initially
misread as a code chip). Both y633–680, both themes IDENTICAL (light twin:
same bboxes, fill #FFFFFF, edge #E7E8EA). The 97px #3A3A3A runs at y633/y680
are the secondary's rounded top/bottom border chords.

**Likely source of the impression — kit docs demos vs the live reference:**

| Surface | Button | Height |
|---|---|---|
| LIVE tbank.ru/business hero CTA «Подобрать варианты» | 188×56 | **56** |
| LIVE tbank.ru/business form submit «Открыть счет» | 188×56 | **56** |
| LIVE debit-form reference (v1 pack, epic-2 canonical) | 127×56 | **56** |
| KIT `size="hero"` | (variants: 211/194 wide) | **56** |
| KIT `size="card"` — DEFAULT + all docs demos | 154×48 | **48** |
| KIT `size="compact"` | 162×32 | **32** |

Every yellow CTA ever measured on the live site is the 56 tier; the kit HAS
it (`hero`), but the default and every docs demo show `card` 48. Nothing is
broken (the ladder covers the reference); the visible mismatch is a
demo/default-tier choice. Options for the maintainer (NOT executed — pixel
changes are gate-governed): (a) keep as is; (b) flip docs demos to
`size="hero"` (a docs-layer change re-opening the demo-bearing baselines);
(c) revisit the default tier (component API discussion, epics-v4).
Secondary-button text confirmed by ×5 zoom read: «Подробнее». Docs-demo size
census (packages/docs/src): `card` ×4, `compact` ×2, `hero` ×0. **The
reference-grounded surfaces already sit on the 56 tier: the showcase
landings use `size="hero"` (business-landing.stories.ts:444 hero CTA;
showcase census hero ×6 / card ×2)** — fidelity is intact; the 48-vs-56
impression comes from docs-layer demos only.

## 2. Live cookie banner (7.2(c)) — see deferred-work entry

Bottom-RIGHT 16/16 compact card 212×126 (width = the 7.2-measured 212px
exactly), ghost-gray accept pill #F2F4F7 68×32 r8, blue uppercase link.
Kit ships bottom-left; its accept pill default is already the same family
(32px, surface-field ghost, text-primary — the yellow 235×32 in the
playground baseline is the story's own compact trigger button, not the
accept). Narrowed deltas: corner (left vs right), link treatment
(kit underline vs live blue-uppercase-none), pill radius (full vs r8),
gray shade. Full facts in
`_bmad-output/implementation-artifacts/deferred-work.md` (spec-7-2 entry,
(c)) and `.playwright-cli/captures-v3/business/`.

## 3. Gate state at this note

Group 1 confirmed by the maintainer («согласен с аргументом по референсу»).
Group 2 in progress: legs 10–13 reviewed OK by the maintainer, 13 flagged
(resolved here as a non-difference within the image; comparison matrix
above), 14–45 pending the maintainer's return. Groups 3–6 not yet presented.

## 4. Package integrity check (2026-09-27, autonomous)

All 82 baseline-derived review copies across the 6 groups byte-match their
`snapshots` sources (0 stale, 0 missing); the remaining 14 files are
EVIDENCE crops / clip pairs by design. The sitting reviews provably current
baselines.

Session CI: `029f7a1` GREEN (run 36299445122), `32eae17` GREEN (run
36300926328) — both by `gh run view` verdicts.

## 5. «Нет центрирования в карточках» (flagged on promocard--variants
## [light], Group 3 leg 10) — SANCTION (a) EXECUTED

**Within the flagged cards: text and pill were ALREADY pixel-center.**
Card «Вклады» (387 wide, center x=193.5 crop): heading x139–248 → center
193.5; pill x122–265 → center 193.5; art tile (128×128 white panel +
yellow disc) x32–160 → center 96 — LEFT-anchored at the 32px padding,
97.5px off card center. The impression = mixed alignment (left art vs
center text/CTA), not missing centering.

**Root cause:** `.card__art` (top mode) was `display: flex` with no
`justify-content` → flex-start. The centered text/CTA register is
reference-derived (spec 3.6: the kit's then-left text was flagged in
review pass 1 and FIXED to center; reference pill re-measured this
session: 182×44 at center 168 = exact card center). The reference has NO
left-anchored small tile anywhere: the 3.6 reference illustration is
262/336 (~78%) centered; the 10.3 bento art is full-width flush bottom
(the kit's bleed mode follows it — bleed rows unchanged by the fix).

**Maintainer sanction (a), 2026-09-27:** center the art to match the
register — `justify-content: center` added to
`:host([data-has-art]) .card__art` (promo-card.css.ts). Re-taken
baselines (delete + harness-written): components-promocard--
{playground,theming,variants} {light,dark} ×6. Run A wrote the six
(the harness fails a missing-snapshot leg after writing — its
accidental-creation guard); art verified centered in the new baseline
(tile x129–256, center 192.5 ≈ card 193.5, 1px antialias rounding).
Run B = full-suite comparison (verdict below). Accessibility/api
promocard legs did not diff (no art cards); homepage showcase did not
diff; business landing is bleed-mode (art width 100% — centering no-op).
Skeleton unaffected (`.sk--art` block is full-width). Gate review copies
for legs 10/11 refreshed from the re-taken baselines. **Run B verdict:
1380 passed, exit 0 (8.4m) — full-suite comparison green.**

CI remediation: push `021740f` run 36311372470 came back RED — gen-drift
(the CEM manifest `custom-elements.json` embeds the promoCardStyles
source string; the CSS commit lacked the regenerated artifact).
`pnpm gen` + unit suite 148/148 + regen committed as `810228b`
(run 36311469726, verdict `success` by `gh run view` — GREEN).

## 6. «Кнопка наезжает на графику» (flagged on promocard--variants
## [dark], Group 3 leg 11) — SANCTION (b)+(c) EXECUTED

**Component geometry was REFERENCE-EXACT; the defect was in the demo
art.** Dark-baseline forensics (card «Т-Бизнес», bleed row): pill
143×48 @ x162–305, y2248–2296; card x40–427 → pill center 233.5 = card
center 233.5 (Δ 0); pill bottom offset 2328−2296 = **32px = the probe
value** (10.3: Δ 0.0, 6/6 reference cards). Pill floating OVER art is
the reference bleed anatomy itself (evidence crops 00/01, approved).

The flag's true content: the bleed demo SVG's WHITE step
(`.tkpc-ba-white`, `--tk-color-white`) painted exactly in the pill's
flight band — white rect x98–330 y2197–2297 ⊃ pill bbox entirely —
both pure white → the pill's boundary fused with the slab (white-on-
white), plus a 143×22 strip of the yellow step hidden. Stark in dark
(the slab glares), softer in light (same fusion — why leg 10 passed).
The reference never shows this: its art is a contrasting illustration;
the pill always reads separate.

**Maintainer sanction (b)+(c), 2026-09-27:** fix the DEMO art only
(no component CSS) + record. Fill rotation in `bleedArtDemo`
(promo-card.stories.ts): yellow → back/bottom step (contrasting band
under the pill), ink → middle, white → front/top step (bottom edge
63% of the zone — clear of the pill band which starts at 65%);
rect geometry untouched.

**Re-take grew to FOUR baselines — the tolerance discovery.** Run A
failed variants ×2 (expected, write-guard) AND accessibility ×2
(unexpected). Investigation: the accessibility story DOES render an
art card (`cardCanvas` «Т-Инвестиции» — line 341), so the §5 claim
«accessibility unaffected / no art cards» was WRONG. Its centering
diff after `021740f` ≈ 24.6k px = **1.47% — just under the config's
global `maxDiffPixelRatio: 0.015`** (playwright.config.ts:70), which
is why run B of §5 stayed green while the baseline kept a
left-anchored tile (sub-tolerance drift). A HEAD-state probe (stories
stashed, docs rebuilt, legs run isolated) confirmed: 4 passed at HEAD.
The bleed rotation added ~88k px → 6.77% total → the legs correctly
failed and were re-taken, baking in BOTH the rotation and the
previously-tolerated centering drift.

Re-taken (delete + harness-written): components-promocard--
{variants,accessibility} {light,dark} ×4. Verified in the new
baselines (both themes): yellow step 353×152 @ (739,761); art disc
96×96 @ x287 — CENTERED (card x40–629, center 334.5); pill 144×46 @
(873,882) a SEPARATE white component — the white step's bottom edge
y831 clears the pill top y882 by 51px; under-pill = yellow step/beige
fill. No white-on-white anywhere in the bleed band. **Run B verdict:
1380 passed, exit 0 (8.3m) — full-suite comparison green.** Gate
review copies refreshed for legs 10/11 (variants) and 12/13
(accessibility). Push `69df436` — run 36313925212, verdict `success`
by `gh run view` — GREEN.

## 7. «Разные отступы» (flagged on the re-presented promocard--variants
## [dark], Group 3 leg 11) — SANCTION (c) EXECUTED

**The crop zoomed the «Т-Инвестиции» card of the «Все тона» grid.**
Every card-level register measured token-exact in BOTH themes (col2:
card x447–832; tile x576–703 left/right margins 129/129 — Δ0.25;
disc 16/16 in tile; card top→art 32 = padding; art→heading 24;
desc→pill 24; pill bottom→card bottom 32; row gap 20; all five discs
identical 96×96 at pitch 407 — rows in line). The vision's «tile
shifted left / disc left-biased / bottom row misaligned» impressions
were annotation-arrow distortion — none survived pixels.

**The one REAL asymmetry — what the maintainer's two arrows marked:**
the demo art slab was 128×96 around a 96×96 disc — side bands 16px,
top/bottom bands **0** (the disc filled the slab's full height; the
`aspect-ratio: 4/3` canvas style stretched width to 128 over a
stretch-height of 96). Visible in both themes (white columns on
pastel / near-black columns on dark tint) — reads as uneven margins
around the circle. Root: STORY-CANVAS demo construction
(`.tkpc-art` in promo-card.stories.ts), not component CSS. The
reference has no such slab at all (3.6 illustration = centered art,
no backing tile) — the slab is a kit-side stand-in.

**Maintainer sanction (c), 2026-09-27:** keep the slab, EQUALIZE the
ring — `.tkpc-art` drops `aspect-ratio: 4/3`, gains
`box-sizing: border-box` + `padding: var(--tk-space-12)`; disc 96×96
unchanged → a 120×120 slab with a 12px ring on all four sides.

Re-taken (delete + harness-written): components-promocard--
{playground,theming,variants,accessibility} {light,dark} ×8. Run A:
8 legs failed (write-guard, expected), 12 promocard-grep legs passed.
Verified in the new baselines (both themes, col2): slab x580–699 /
y344–463 (120×120), disc x593–687 / y356–452, bands 13/12 horizontal
(1px antialias), 12/12 vertical — EQUAL; slab centered (Δ0), padding
32 intact. Blast radius as predicted: skeleton (`.sk--art`) and bleed
legs untouched — no collateral failures. **Run B verdict: 1380
passed, exit 0 (8.3m) — full-suite comparison green.** Gate review
copies 10–13 refreshed, byte-verified. Push `f78cdcc` — run 36315112858,
verdict `success` by `gh run view` — GREEN.

## 8. Re-presented leg 11, flag on the «Платинум» zoom — STALE WINDOW,
## fix (c) CONFIRMED by the maintainer

**The crop zoomed the charcoal «Платинум» card** (variants dark,
«Все тона» row 2 col2) reading «pressed to one side, margins on the
other» — a precise description of the PRE-fix slab (128×96: 0 bands
top/bottom, 16 sides). Re-measured in the CURRENT baseline and the
byte-identical review copy (md5 `89c99905…` match): slab 120×120 @
x580–699 / y706–825, disc 96×96 @ x592–687 / y718–813 — ring
**12/12/12/12 in BOTH themes**; the disc chord at y742 (83px = chord
math for 23px above center) confirms Δ0 centring. Root: macOS Preview
did not reload the refreshed copy — the maintainer zoomed a cached
pre-fix render. A fresh 2× nearest-neighbour zoom crop of the current
file (`ZOOM-platinum-ring-current.png`) was presented; maintainer
confirmed: «меня все устраивает, ок». **No pixel changes.** Group 3
promocard visual legs 10–13 closed as confirmed.

## 9. Gate outcome — CLOSED by the maintainer (2026-09-27)

Group 3 legs 14–21 confirmed in-flow (per-leg «ok»; 19–21 covered by
the maintainer's manual sweep). Groups 4–6 reviewed by the maintainer
manually — «я вручную отсмотрел остальные документы - все ок» (scope
re-confirmed via direct question: the WHOLE pack incl. 04/05/06).
Result block written into `baseline-review-package.md` ЧАСТЬ v1.2.0.

Release pre-flight residue (RELEASE.md §9.1): CI verdict for `f78cdcc`
(run 36315112858, in flight at write time — to be appended to §7) and
ONE more full `pnpm test:visual` on final HEAD (§9.1.4 requires ×2;
one full green run executed after f78cdcc). §9.1.6 SR spot-checks stay
with the maintainer.

**Residue resolved (2026-09-27):** `f78cdcc` CI verdict `success` by
`gh run view` (run 36315112858) — GREEN (recorded in §7; gate commits
`6751320`+`f406a67` pushed). §9.1.4 ×2 closed: second full suite run on
final HEAD — **1380 passed (8.3m), exit 0**. §9.1 now fully green
except §9.1.6 (maintainer's manual SR spot-checks, may ride after the
tag per the v1.1.0 precedent).

**§9.1 closed (2026-09-27):** docs-commit CI chain GREEN — `f406a67`
run 36316267015 `success`, `b8b876a` run 36317206090 `success` (both by
`gh run view`); local gates §9.1.2 green end-to-end (install/build/lint/
typecheck/gen/gen:tokens/test — root suite 148/148) and §9.1.3 gen-drift
EMPTY on HEAD. Every §9.1 item now green except §9.1.6 (maintainer's
manual SR spot-checks — rides after the tag per the v1.1.0 precedent).
Next: §9.2 (version+CHANGELOG) awaits the maintainer's sanction; §9.3
tag is maintainer-only.

## 10. §9.2 EXECUTED under sanction — v1.2.0 release commit (2026-09-27)

Maintainer sanction: «9.2 - ok» + «делай». Version `1.1.0` → `1.2.0` in
the three shipped package.json (tokens/components/react); `private:true`
untouched everywhere; root `0.1.0` and docs `0.0.0` untouched. CHANGELOG
`## [1.2.0] - 2026-09-27` written from the §9.5 draft verbatim (Added /
Changed / Internal); the single prior Unreleased href entry subsumed —
no duplicates; `[Unreleased]` kept as an empty section.

Commit `7d3b3db` `chore(release): v1.2.0 — version + changelog` pushed;
run 36319189468 verdict `success` by `gh run view` — GREEN. §9.3 tag
`v1.2.0` is MAINTAINER-ONLY and was NOT placed at write time (only
v1.0.0/v1.1.0 exist).

## 11. §9.4 fresh-consumer verification — PASS (2026-09-27)

Protocol adapted while the tag is unplaced: cloned `main` and verified
`CLONED_AT=7d3b3db7349aa7b216c3a40b33317e2072a281b5` (the release
commit = future tag target). Workdir `/tmp/v120-consumer.VSSq`: kit
clone + `my-app` (pnpm workspace links, `pillkit-{components,react,
tokens}@1.2.0` resolved through `pnpm-workspace.yaml`; react/react-dom
19.3.0; vite 8.3.1 dev). Setup traps recorded: `pnpm init` writes a
`devEngines.packageManager` `^`-range that pnpm then rejects (removed);
`cmd | tail` pipes mask `set -e` failures — the masked install failure
surfaced later as a missing `node_modules/.bin/vite`.

`main.tsx` per §9.4 verbatim: bleed promo-card «Т-Мобайл» + 3-step svg +
secondary card pill «Подробнее». Console clean (React DevTools info,
Lit dev warning, favicon 404 only).

**Light — all checks pixel/exact-rect PASS** (`page-…13-08-13-923Z.png`):
eval rects — card `(40, 40, 384.4, 324.3)`, svg canvas
`(40, 133.7, 384.4, 230.6)`: left/right/bottom FLUSH EXACT (svg bottom
364.3 = card bottom 364.3; widths equal) — bleed zone reaches the card
edges; pill `(158.9, 284.3, 146.6, 48)` → bottom offset **32.0px
exact**, center 232.2 = card center 232.2, inside the art zone; heading/
description above the art (svg top y133.7); pill body `255,255,255`
pure (scanline: ink step → yellow step → #E7E8EA edge → white body).
Vision's «art not full-bleed / inset 34px» measured the staggered viewBox
STEPS of the stand-in art (same composition as the kit stories), not the
canvas — disproven by the rects above.

**Dark — PASS after correcting the flip address**
(`page-…13-44-24-944Z.png`): the first flip set `data-theme` on the
wrapper DIV — a no-op, and correctly so: the built `tokens.css` dark
layer is `:host([data-theme=dark]),:root[data-theme=dark]` (html or the
host element, not arbitrary ancestors); the theming guide documents
exactly this («Тема переключается атрибутом на `<html>`») and the §9.4
protocol itself says `<html>`. Flipped on `<html>`: card surface
`36,36,36`, heading glyphs `220,220,220`, pill STAYS `255,255,255`
(charcoal-CTA technique holds), card bbox identical `384×324+40+40` —
no layout shift between themes.

Cosmetic note (protocol's stand-in art, NOT a kit defect): its WHITE
back step sits in the pill's flight band → the pill's left edge fuses
softly white-on-white; the kit's own stories use the sanctioned rotation
(`69df436`, yellow under the pill). Consumer art is consumer-supplied.
No kit change.

Verdict: **§9.4 PASS in both themes against `7d3b3db` via the real
distribution mechanism (workspace links at 1.2.0).** Teardown done
(vite stopped, browser closed).
