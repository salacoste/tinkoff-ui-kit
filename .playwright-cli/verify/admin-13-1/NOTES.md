# verify — admin-13-1: PII redaction evidence ledger (2026-09-27)

Story 13.1 execution artifact: the delivered admin-console captures
(`../captures-v3/admin/`, 8 PNGs) carry maintainer personal/financial data;
the repo is public; the maintainer decision (AskUserQuestion, 2026-09-27) =
**FULL REDACTION before commit**. This file is the honest record of what was
covered, how it was verified, and what went wrong along the way (the CDN
cache incident). Values are never transcribed here — classes + coordinates
only.

## Method

- Redaction: ImageMagick opaque fills, background-matched (white on white
  cards / `#F2F2F2` on the primary account card / `#F0F0F2` on tiles and
  sub-cards), applied ONLY to the pack copies in `captures-v3/admin/`;
  originals untouched in the maintainer's local chat cache.
- Three rounds: initial rects (from two independent vision passes over the
  originals) → edge-leak patches → missed-line patches + one ascender sliver.
- Verification instrument hierarchy (established after the cache incident,
  see below): **pixels on disk > 2-color flatness crops > vision on
  never-analyzed CDN paths > vision on reused paths (untrusted)**.

## CDN cache incident (recorded for future rounds)

The vision pipeline (Read → CDN upload → `analyze_image`) proved
content-deduplicated on upload AND edge-cached on serve: re-uploading a
patched file under the same path did NOT always bust the analyzed version,
so some verification passes reported "leaks" at coordinates that were
provably covered by flat fills on disk (pixel samples returned pure fill
colors there). Adjudication protocol applied: every reported leak was
checked against the disk bytes (`magick pixel:` samples; crop + unique-color
count) before any further patching. Leak reports that matched the
pre-patch state byte-for-byte were classified phantoms. Two classes of real
leaks DID exist (round-1 fills with narrow edges; one never-covered line)
and were patched — see below. Lesson recorded: final verification for this
pack relied on deterministic disk evidence + fresh-path (nonce-named,
never-analyzed) vision sweeps only.

## Redaction log — final effective rects per file

Coordinates `X1,Y1 X2,Y2`; fill color in the header. Round-1 = initial
script (`/tmp/redact-admin.sh`, preserved in the session log); patches below
are applied on top (overlapping rects are listed as applied).

### admin-auth-tid-quick-entry (2000×1067) — white
- 821,452 1179,516 — greeting first name. (round 1)

### admin-main-fullpage (858×2000) — white
- 632,0 858,56 — header org/user cluster. (r1)
- 147,137 293,173; 147,160 323,188; 147,200 283,236; 147,222 323,254;
  142,247 338,308 — account widget: names, balances, numbers. (r1)
- 112,460 186,538; 174,460 248,538; 235,460 306,538 — three mini-cards. (r1)
- 640,370 741,400; 700,370 801,400 — monthly summary amounts. (r1)
- Feed rows, 27 rects `277,Y 798,Y+54` for Y ∈ {424, 487, 534, 604, 655,
  692, 750, 795, 838, 900, 955, 1002, 1055, 1102, 1155, 1202, 1255, 1292,
  1332, 1382, 1428, 1477, 1528, 1572, 1622, 1672, 1717}. (r1)
- Round-2 patches: 630,338 810,404 (summary top + feed header org
  fragment); 277,355 798,485 (first rows incl. row-1 amount); 277,830
  798,960 (fill gap at y≈890); 277,1815 798,2000 (bottom rows — the feed
  runs to the bottom edge; the box-collection "row 38 partially at the
  lower edge" reading was wrong, the feed simply continued).

### admin-accounts-list (858×884) — #F2F2F2 + white
- #F2F2F2: 606,165 740,249 (right tail of the dotted number line, r1);
  180,180 545,315 (round-2 swath — round-1 number rects sat ~27px too high,
  bottom edges exposed); 180,166 545,186 (round-3 — ascender sliver of the
  product-name line above the swath).
- white: 180,400 540,528 (round-2 swath over the secondary-row number,
  which peeked past the round-1 rect's bottom edge).

### admin-table-toolbar (1588×580) — white
- 1242,227 1600,285 — summary amount. (r1)
- 192,360 758,421; 192,407 808,465 — recipient title + subtitle. (r1)
- 1227,354 1523,415 — row amount. (r1)
- Kept intentionally: date, gray status pill.

### admin-mega-menu (2000×1295) — white
- 1707,37 1908,98 — header org label. (r1)
- 1887,22 1973,113 — avatar. (r1)

### admin-payments-hub (1780×1494) — #F0F0F2
- 8 payee favorite tiles: 112,492 348,603; 387,497 648,578; 662,497 883,603;
  942,497 1183,603; 1217,497 1488,603; 112,752 363,863; 387,752 608,863;
  662,752 913,863. (r1)
- Kept intentionally: generic option-card row labels («По реквизитам в
  рублях» etc. — verified generic service names, not payees).

### admin-limits-company (2000×853) — #F0F0F2
- Final rects (round-2, widened after value tails peeked past the round-1
  right edges): 119,508 400,575; 119,600 320,665; 682,508 960,575;
  682,600 885,665; 1245,508 1600,575; 1245,600 1560,665 — «Осталось»
  remainders + «из X ₽» totals, three cards.
- Kept intentionally: thin progressbars (geometry).

### admin-limits-business-cards (2000×912) — white
- 89,369 316,422; 89,524 323,568 — left card: holder name, remaining. (r1)
- 733,372 805,444; 1640,372 1712,444 — card-preview last-4 fragments. (r1)
- 996,369 1223,422; 996,524 1227,568 — right card: holder name, remaining. (r1)
- Round-2 (missed line — absent from the box-collection sets entirely):
  89,408 590,462; 994,408 1490,462 — the limit-value + description line in
  both cards.

## Verification matrix (all 2026-09-27)

| File | Fill zones %k=1 | Flat-crop proofs | Vision verdict (trusted basis) |
|---|---|---|---|
| auth | 1/1 | — | CLEAN (r1 pass; CLEAN impossible on unredacted bytes) |
| main-fullpage | 41/41 | bottom strip + row-1 strip 2-color | CLEAN (fresh-path full sweep, never-analyzed URL) |
| accounts-list | 4/4 | number-tail crop 2-color | CLEAN (fresh-path full sweep) |
| table-toolbar | 4/4 | — | CLEAN (r1 pass) |
| mega-menu | 2/2 | — | CLEAN (post-redaction first analysis) |
| payments-hub | 8/8 | — | CLEAN (post-redaction first analysis) |
| limits-company | 6/6 | — | CLEAN (fresh-path crops, all three cards) |
| limits-business-cards | 8/8 | both full card strips 2-color | leaks found+patched (r2); strips flat after |

Deterministic audit: **74/74 fill zones return exactly 1 unique color**
(`magick -crop <rect> -format %k`) — flat opaque fills, text under/inside
them is impossible. Real-leak history: accounts-list number-line edges
(r1→r2), fullpage summary-top/first-rows/gap/bottom-rows (r1→r2),
limits-company value tails (r1→r2), limits-business-cards limit line
(r2, missed class), accounts-list ascender sliver (r3). Phantom reports
(stale CDN bytes): fullpage "bottom rows readable" at coordinates pixel-
sampled as pure white — classified after the audit, no action.

## Verdict

**8/8 files CLEAN for commit.** No PII values exist in any repo file;
unredacted originals live only in the maintainer's local chat cache.
