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
(accessibility).
