# Live captures v3 — the per-vertical reference convention

Root index of the per-vertical capture packs (the maintainer's subprojects
direction 2026-09-26/27: tinkoff-bank / tinkoff-business / tinkoff-invest as
subproject families over the shared core; ТЖ later). This directory layout is
the single convention for reference truth from v3 on; `captures-v2/` is the
previous flat generation — cross-referenced below, never moved.

## Convention (spec 12.2)

- One directory per vertical: `bank/`, `business/`, `invest/` (+ `tj/`
  reserved). Future verticals follow the same mold.
- Capture files: `<vertical>-<surface>-<YYYY-MM-DD>.png` (e.g.
  `biz-form-section-2026-09-27.png`).
- Every pack carries `INDEX.md` (session header, files table, probe findings,
  subproject grounding) + `probe-notes.md` (raw eval transcripts).
- Discipline, non-negotiable (the standing iron rules): READ-ONLY on the live
  reference — nothing typed, nothing submitted, no cookie-wall consent, no
  login; browser = playwright-cli only; pixels are ground truth; sessions
  recorded by name in the pack INDEX.
- Login-walled surfaces (authorized-zone/admin, Epic 13): the SR-RUNSHEET
  mold — a maintainer-side session hands over read-only captures; the
  autonomous run never authenticates.

## Packs

| Vertical | Pack | Status |
|---|---|---|
| tinkoff-bank (retail) | `bank/` | 2026-09-27 — homepage viewport + fullpage atlas + debit-card application form (`INDEX.md`) |
| tinkoff-business | `business/` | 2026-09-27 deep round — viewport, LIVE cookie banner (the 7.2(c) adjudication material), form section, fullpage (`INDEX.md`) |
| tinkoff-invest | `invest/` | **cross-referenced, no byte moves** — the v2 packs hold the material: `../captures-v2/invest-mobile/` (tbank.ru/invest/mobile-application) and `../captures-v2/invest-stocks/` (tbank.ru/invest/stocks); see `../captures-v2/INDEX.md`. A fresh v3 invest pass happens when an invest-family story needs new surfaces (the stocks-catalog/qr references already consumed v2). |
| тинькофф журнал (ТЖ) | `tj/` | **reserved — later** («займемся позже», maintainer 2026-09-26/27); no directory until the vertical opens |
