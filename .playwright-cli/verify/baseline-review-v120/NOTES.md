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
