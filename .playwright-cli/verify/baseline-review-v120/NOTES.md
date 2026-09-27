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

## 2. Live cookie banner (7.2(c)) — see deferred-work entry

Bottom-RIGHT 16/16 compact card 212×126 (width = the 7.2-measured 212px
exactly), ghost-gray accept pill #F2F4F7 68×32, blue uppercase link. Kit
ships bottom-left + yellow pill. Full facts in
`_bmad-output/implementation-artifacts/deferred-work.md` (spec-7-2 entry,
(c)) and `.playwright-cli/captures-v3/business/`.

## 3. Gate state at this note

Group 1 confirmed by the maintainer («согласен с аргументом по референсу»).
Group 2 in progress: legs 10–13 reviewed OK by the maintainer, 13 flagged
(resolved here as a non-difference within the image; comparison matrix
above), 14–45 pending the maintainer's return. Groups 3–6 not yet presented.
