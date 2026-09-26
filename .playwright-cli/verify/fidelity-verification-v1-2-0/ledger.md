# Fidelity ledger v1.2.0 — 13 rows over the v1.1.0..HEAD moved set (Story 11.3, 2026-09-26)

**Standard (FR-16 / epics-v3.md 11.3, the 8.4 mold at v1.2.0 scope):** every
component whose pixels/API moved in `git diff v1.1.0..HEAD` gets a row with
(1) reference source capture, (2) verify dir pointer, (3) deviation count,
(4) open flags. The moved set was MEASURED from the diff
(`packages/components/src` 36 files + `packages/docs/src` 7 files + the token
layer), cross-referenced with the re-take register (`git log
v1.1.0..HEAD -- 'tests/visual/*snapshots*'` = 11 commits / 163 snapshot-file
events). UNCHANGED components are NOT re-rowed — one aggregate pointer to the
v2 ledger (`../fidelity-verification-v2/ledger.md`) carries them. Derived/
internal surfaces keep honest classifications, never dressed as pixel fidelity.

**The v2 ledger's 25 rows all stand** — this ledger records only the v1.2.0
deltas on top of them. The two epics-named re-checks (stepper brown badge,
business bento radius) are resolved against their 9.1 probes in rows 2–3.

## v1.2.0-moved components

| # | Component (story) | Reference capture | Verify dir / evidence | Deviations | Open flags |
|---|---|---|---|---|---|
| 1 | **Token layer** (9.1 + 9.2) | the AA gates are computed (WCAG 2.1 luminance), the radius gate probed from captures | `../tokens-9-1/` (side-by-side + 3 gate transcripts), `../tokens-9-2/` (anchor transcript) | 0 deviations; one RECORDED-FAILING pin by ruling (below) | none — both gates closed in-window |
| 2 | **tk-stepper badge** (9.1 — the epics-named re-check) | `captures-v2/business/pattern-steps-open-account{,-detail}.png` | `../tokens-9-1/` — `stepper-brown-side-by-side.png` + pixel column scans (badge `#8d6040` y355–410 56px, half-overlap on card top exact); hooks unchanged | 7.3 deviation 1 **RESOLVED by adoption**: badge = `tint-brown` #8D6040 fill + white numeral (the reference pairing) — **white-on-brown 5.413:1 REQUIRED pass; brown-on-tint-cream 4.674:1 REQUIRED pass; brown-on-tint-cream-raised 4.136:1 RECORDED-FAILING pin** (the badge never sits on raised cream — its card-top overlap is white). 7.3 deviations 2–5 stand (4) | none — the maintainer decision (v2 open flag) was ADOPTED at v1.2.0; deferred-work 7.3 closed |
| 3 | **Business bento radius** (9.1 — the epics-named re-check) | `captures-v2/business/pattern-application-form{,-detail}.png` | `../tokens-9-1/probe-output.txt` — the 5.6 arc-staircase mold | **7.4 deviation 14 DISSOLVED by refutation**: form card corners measure **r = 23.8px (IQR 23.5–24.7)** — the reference IS the 24 band; the ledger's «reference ≈32 (vision estimate)» was an artifact of the stacked dark-card sliver's underresolved arc (the 5px `#333` band above the corner). The kit's `radius-xxl` 24 is pixel-exact, NOT a deviation. `rounded.3xl` does not land (< 28 gate); `NOTES:87–105` deviation 14 is superseded BY THIS ROW (deferred-work 7.4f carries the closure) | none |
| 4 | **tk-promo-card** (10.3 `art-mode='bleed'`) | `captures-v2/business/` (bento grid + hi-res single card) | `../promo-card-10-3/` — probes A/B/C/D + render verification | base modes byte-stable (playground/theming canaries never moved — unit-pinned). Bleed mode: pill bottom offset **EXACTLY `--tk-space-32` (Δ=0 in 6/6 cards** — probe refuted the spec's 12–16 expectation); no scrim (0 text-over-art px in reference); zone-height sizing with accepted trio undershoot −9…−19% (ink-width unreachable without redrawing consumer art — forbidden) | the 400px max-width cap is a probe-measured showcase literal, provenance-flagged in CSS (FR-1 lengths blind-spot) |
| 5 | **tk-qr-block** (10.1 `page-copy` slot) | `captures-v2/invest-mobile/full.png` band y≈1780–1862 (glyph-by-glyph decode + render table) | `../batch-10-1-10-2/` — probe (b): render 805/565px vs capture 804/564px (Δ1px, 0.12/0.18%) | spec's expected `body-l`/400/`text-secondary` **REFUTED on three axes** — measured **`body-m` (15px)/400/`text-primary` on pure #FFFFFF**; line rhythm 24px (Δ1.5 from body-m-leading, nearest ramp step); 7.3's 5 deviations stand; the v2-ledger open flag (page-copy slot absent) is CLOSED by this story | none — spacing trued `space-16`/`space-48` (Δ0.5/Δ0) |
| 6 | **tk-input** (10.1 `sr-only` label mode) | v1 capture set unchanged (5.6 row 2) | `../batch-10-1-10-2/` + `../input/` (5.6) | API-only addition — 1px-clip utility (progress-bar mold), label stays `<label for>` so the name chain is untouched; ZERO chrome pixels (baselines moved only where stories document the mode) | none — the v2-ledger gap report is CLOSED |
| 7 | **tk-segmented-radio** (10.1 `sr-only`) | v1 capture set unchanged (5.6 row 5) | `../batch-10-1-10-2/` + `../segmented-radio/` (5.6) | API-only addition — same utility, span keeps id + aria-labelledby | none — v2 gap CLOSED |
| 8 | **tk-checkbox** (10.2 `error` channel) | v1 capture set unchanged (5.6 row 4) | `../batch-10-1-10-2/` + `../checkbox/` (5.6) | API-only addition — the tk-input error line VERBATIM (consumer copy, described-by wired); `error-on-field` carries the pair in both themes | none — v2 gap CLOSED |
| 9 | **tk-button** (10.4 `href`/`target`/`rel`) | unanswerable from captures by construction (screenshots carry no URLs) — the `#fragment` placeholder mold (`href="#ios"` beside the 7.5 `href="#android"`) | `../button-10-4/` — the no-probe disposition + DOM-identity unit pin | ZERO CSS edits; no-href DOM **byte-identical** (captured-literal `BUTTON_BRANCH_DOM` pin); anchor branch duplicates the inner tree ON PURPOSE (Lit marker injection); rel = noopener noreferrer iff target=_blank | none — v2 gap CLOSED (7.5b); ZERO spec deviations — the cycle's first |
| 10 | **tk-tooltip** (9.1 — stories-only delta) | `../tooltip/` (5.6 derived record stands) | `../tokens-9-1/probe-tooltip-cap-output.txt` | POINTER ROW (not a fidelity re-row): the Placements STORY content was rebuilt to hit the 288px `max-width` cap (pill 288 × 4 placements, probe-pinned) — a capture-stability fix, not a component change; the CI tolerance saga (retired → REFUTED by run 36131832924 → restored light 0.13/dark 0.08) is recorded in deferred-work + visual.spec.ts | none — text-metric geometry is the standing tolerance class |
| 11 | **business-landing showcase** (9.1/10.1/10.3 deltas) | `captures-v2/business/` (full.png + pattern set) | `../business-landing/` (7.4 base) + `../batch-10-1-10-2/` + `../promo-card-10-3/` probe D | 7.4's 15 → **13 standing**: deviation 2 CLOSED (10.3 — `.tkb-stage` retired, bento composes `art-mode='bleed'` directly), deviation 14 DISSOLVED (row 3). NEW subtitle slot = reference-verbatim copy, render-verified 731px vs capture 729px (Δ2px, 0.27% — the lens MAJOR correction that killed the invented first copy) | none |
| 12 | **invest-landing showcase** (10.1/10.4 deltas) | `captures-v2/invest-mobile/` | `../invest-landing/` (7.5 base) + `../batch-10-1-10-2/` + `../button-10-4/` | 7.5's 10 assembly deltas stand; page-copy slot adopted (row 5 copy, verbatim); hero CTA adopted `href="#ios"` — **re-took byte-identical both themes (blob-hash-equal)** — the anchor paints the pill pixel-for-pixel | none — 7.5b closed |
| 13 | **docs code surfaces** (11.2 — internal) | n/a — the kit documents itself | `../docs-11-2/` | INTERNAL, not a fidelity surface: `--tk-font-mono` first consumer = 8 rules at 5 files (incl. the lens-caught `.tkcs-grid` tag chips); 36 legs re-taken (mono reflow), then re-taken again under the harness font pin (JetBrains Mono, TEST-ONLY) when CI proved system-mono a platform-metric class (run 36254296012: +17…+28px page heights) | none — the token layer stays system-first per the 9.1 ruling |

**packages/react — ZERO diff v1.1.0..HEAD (explicit line):** the 10.x props
surface (`href`/`target`/`rel`, `sr-only` ×2, `error`, `art-mode`, the two
slots) flows through CEM attributes, not wrapper-code changes — verified
against `packages/react/src/generated/button.ts` (no per-prop code:
`createKitComponent({displayName, tagName, elementClass, react})`) and
`packages/react/src/kit-component.ts` (typing derives from the element class,
`Partial<Omit<Element, keyof HTMLElement>>`; `@lit/react` routes attributes
generically). 10.4's `pnpm gen` moved `custom-elements.json` (+63/−1) only;
wrappers byte-stable.

## UNCHANGED components — v2 ledger rows stand

All 25 v2-ledger surfaces not listed above are untouched by v1.1.0..HEAD
**including navbar/mega-nav** (verified in the diff: zero files under
`packages/components/src/{navbar,mega-nav…}` moved; the 11.2 mono re-takes
touched the docs PAGES' pixels, not the components). The v2 rows at
`../fidelity-verification-v2/ledger.md` remain the fidelity record for:
button chrome (v1), input/checkbox/segmented-radio/select fields, tabs,
navbar+mega-nav, footer, feature/service/article cards, thumbnail-picker,
progress-bar, link, badge, the v2 nine (filter-chips, pagination,
combobox-search, data-table, cookie-banner, store-badges), the derived trio
(modal/tooltip/toast), and the stocks-catalog composition.

## Findings this story (found → dispositioned)

| # | Finding | Disposition |
|---|---|---|
| L1 | The moved-set measurement found NO navbar/mega-nav/react movement — the spec listed them as "if the diff moves them" | recorded as not-moved (this ledger's aggregate pointer row) |
| L2 | Two re-takes in the register are byte-identical (stepper--api ×2 at c13ba12, the invest hero pair at de304e7) | kept in the register MARKED byte-identical — they are the zero-pixel-API-addition evidence, not noise |
| L3 | `verify/business-landing/NOTES.md` deviation 14 still carries the pre-9.1 «≈32 vision estimate» text | superseded BY ROW 3 of this ledger (NOTES are frozen story evidence; deferred-work 7.4f carries the closure) — the 5.6 supersession-line mold, applied at ledger level |
| L4 | 11.1's +12 legs are NON-snapshot engine legs (a11y-sweep +468 lines, cookie-banner +158) — suite PNG count FLAT 392→392, 84 modified | register + package record both counts; `--list` total confirms 1380 |

## SM-C2 statement (v1.2.0 legs)

Visual suite at the 11.3 prep head: the ×2 compare verdict is recorded in
this story's gate round (spec-11-3 Verification) — this ledger's diff is
docs-only, so the served tree is bit-identical to the 11.2 head whose own
round proved 1380/1380 ×2. Every re-take wave since v1.1.0 is explained in
the register:
9.1 baseline round (c13ba12: 22 deleted → 20 git-visible, incl. the
byte-identical api pair), 10.1+10.2 (325631c: 30+2 cluster; afb6089: 6 lens),
10.3 (9813a65: 8), 10.4 (de304e7: 6 visible + 2 byte-identical), 11.1
(d1a210a: 14 accessibility pairs; 7ee97e1: 2 lens), 11.2 (6119d37: 36 mono
flip; a0fb95c: 2 lens; b185cc4: 36 mono-pin — the tolerance commit 90c8e6a
re-took NOTHING). Full forensic one-liners: the baseline package, ЧАСТЬ
v1.2.0.
