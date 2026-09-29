# Fidelity ledger v1.4.0 — ТЖ family rows over the v1.3.0..HEAD moved set (Story 17.4, 2026-09-29)

**Standard (FR-16 / epics-v5 17.4, the 14.2 mold at ТЖ scope):** every
composition surface whose pixels/API moved in `git diff v1.3.0..HEAD` gets a
row with (1) reference source capture, (2) verify/evidence pointer,
(3) deviation count, (4) open flags. The moved set was RE-MEASURED at the
execution head `58d979e`: the moved set IS the ТЖ family —
`packages/tj-tokens` (source + generated + scripts), `packages/tj-components`
(10 `tj-*` component dirs + `overlays/` + `patterns/` + api-reference),
`packages/tj-react` (generated wrappers ×10 + src), `packages/docs/src/tj`
(9 story files + tj-registers), the ТЖ test set (7 unit files + 2 sweep
specs), and **216 baseline PNGs** (166 pre-17.3 + 50 in 58d979e). The bank
trees moved only in 2-line cross-link comments + the shared preview/docs
chrome rows 17.3 added — NOT bank surface moves (scope note below).
Re-take register: `git log v1.3.0..HEAD -- 'tests/visual/*snapshots*'` =
**11 commits / PNG-events** (forensic one-liners in the baseline package,
ЧАСТЬ v1.4.0). UNCHANGED bank components are NOT re-rowed — the aggregate
pointer to `fidelity-verification-v1-3-0/ledger.md` carries them (every bank
surface verdict there stands; this cycle touched none of their pixels).

**Reference pack of this cycle:** `../../captures-v3/tj/` (11 PII-clean
PNGs + INDEX.md + probe-notes.md; the 2026-09-28 recon pack). Probe method
is playwright computed-style censuses + vision-model pixel analysis —
geometry/colors are ESTIMATES (±), the PNGs are ground truth; kit-side
facts (AA ratios, CSS values) are measured. Composition surfaces keep
honest classifications — pattern-consistency, never dressed as pixel
fidelity.

## Scope note — what is NOT a row

- The **17.3 docs pages** (token-reference / theming-guide / getting-started
  expansion / patterns pages / API tables / search rows): docs-side text
  surfaces, not reference-grounded component surfaces — the 14.2 ruling
  verbatim. Their OWN verification is mechanized (drift test vs TOKENS.md,
  CEM mirror, sweeps 68 rows, axe both themes — the axe finding fixed
  in-round: bank link pair is surface-base-tuned, 4.24 on muted vs 4.62 on
  base).
- The **bank-side chrome touches** of 17.3 (preview.ts disclaimer ids,
  component-search rows): shared docs chrome, not bank component surfaces.
- **SR narration quality / live VO/NVDA**: maintainer-side (SR-RUNSHEET
  v1.4.0, drafted at 17.1/17.2 with the mechanized half prefilled).

## v1.4.0-moved ТЖ surfaces

| # | Surface (story) | Reference capture | Verdict | Δ / deviations | Open flags |
|---|---|---|---|---|---|
| 1 | **Token layer** (15.2) — all `--tj-*` | probe-notes + INDEX probe findings (censuses ×4 surfaces) | **CONFIRMED after corrections** — every verdict is evidence-backed in `verify/tj-tokens/NOTES.md` | 4 measured corrections at freeze: radius trio COLLAPSED to card 25 / panel 30 (the vision trio was a 9.1-repeat artifact); `icon-tile` 12→**7** (probe8 rail tiles 30×30 r7); link ink re-pointed OFF gold onto `#1414CC`/dark `#93A2FF` (probe10 — gold is the AWARD accent, ×10 like-bubbles); shadows: card lifts DELETED, the ONLY shadow is the suggest-panel `0 2px 8px rgba(0,0,0,.1)` | Ruble Sans noted, not a token (no ТЖ surface needs it); composer r20 structural FLAG (16.4) |
| 2 | **Reading primitives** (16.1 — tj-prose / tj-link / tj-cta) | `tj-article-{viewport,fullpage}` | **PASS** (post-mint3 vision review, GREEN) | the reference's light byline meta IS the sub-AA restricted class — the kit's authored AA step is the SANCTIONED deviation (recorded 16.1, re-cited 16.6); link species per probe10 (transparent-at-rest underline, ink-stable hover) | none |
| 3 | **Feed surfaces** (16.2/16.3 — rubric-header / news-card / tag-chip) | `tj-rubric-news-{viewport,fullpage}` | **PASS** — overlap/mark/hierarchy/gray-subtitle ✓; flat card, ~20–25 radius read on the 760 column, serif excerpt vs sans byline | 0 | optical observation → maintainer package: the rubric mark sits a hair left of the heading edge (border-radius optics vs side-bearing; both at space-24 — not a bug) |
| 4 | **/pro/ hero pattern** (16.3) | `tj-pro-{viewport,fullpage}` | **PASS** — purple hero card + translucent-white chip nav per the capture anatomy; purple-scope CONFIRMED (carriers scan: badge 30×30 r50%, hero bg, squircles, CTA fills — nowhere else) | 0 | featured display 55 + `/pro/` CTA r10 h50 live in the pattern registers (`cta-promo`), not component props |
| 5 | **Community** (16.4 — tj-composer / tj-post-card) | `tj-community-{viewport,fullpage}` | **PASS** after ONE pattern-level fix: the frozen Intent placed the composer INSIDE the white sheet (tone-on-tone — the orchestrator's spec wording, not the implementation); fixed story-side to the reference composition (composer on the GRAY page, sibling above the sheet) | 1 (spec-origin, fixed in-round; component css/ts untouched) | composer height DERIVED 88 (vision band 88–96 brackets it); r20 FLAG (row 1) |
| 6 | **Chrome** (16.5 — tj-header / tj-rail / burger drawer / AD-12) | `tj-home-{viewport,fullpage,dark-viewport}` | **PASS** both themes — pill chips on card tokens, no divider, uniform nav-label 17/700 species, fully-rounded 36px CTA pill, blending bar | 2 vision claims DISMISSED with evidence («mixed-weight rows» — structurally impossible + pixel-disproven; «dark hero light-leak» — synthetic placeholder art); current marking re-ruled SEMANTIC-ONLY (probe9 ×11/11 uniform) | the 16.5 CI detector round is recorded evidence the impeccable gate bites (grid-template-rows channel fix e945221) |
| 7 | **Article composition** (16.6 — patterns/article-page) | `tj-article-{viewport,fullpage}` | **PASS** both themes + **live walkthrough 22/22** (tab topology 18 stops, rings, like-toggle, theme cycle, skeleton zero-shift 1310/1310, scroll-back rail, native-dark auto leg, axe ×2) | 1 REAL defect caught by the walkthrough (bone census drift 30px — last paragraph `para-l3`→`para-l4`, fixed + retuned); ad surfaces (carousel band, floating yellow overlay) are SITE-level ads, out of pattern scope — the Flow-C recipe carries them | live VO/NVDA maintainer-side |
| 8 | **Ad-slot recipe** (16.6 — Flow-C) | `tj-article-viewport` (floating promo) | **PASS as architecture** — ad modules are BANK surfaces: `tk-promo-card` via the documented `--tk-promo-card-*` hooks (ad-slot-recipe.stories.ts:289); the ТЖ family carries ZERO ad-language values — mechanically proven in `ad-language-audit.md` (this dir) | 0 | none (the split is FR-21's second half) |
| 9 | **Dark layer** (15.2 + 17.2 sweep) | `tj-home-dark-viewport` | **PASS** — native `prefers-color-scheme` parity, mechanically re-proven ×45 stories by `tj-dark-sweep` (277 legs at the 17.3 head); 13 overrides, invariants hold (purple/gold twins, FLAT shadow kept) | 0 | `ink-reference-time` stays UNBOUND in dark — no dark-article capture exists (honest absence, 17.2 ruling) |
| 10 | **Fonts** (15.3 — OQ-8) | probe9 loaded-faces census | **CONFIRMED** — ui=Graphik (variable 400/600), reading=Charter (400-only); open cyrillic-capable fallbacks (Inter / PT Serif); ZERO font bytes in the kit | 0 | Graphik/Charter licensing stays maintainer-side (standing queue) |
| 11 | **A11y sweep** (17.1) | n/a (contract-level) | **140 tests GREEN** — pseudo-composite AA law, 3-digit hex normalization, LIFO focus restore, SR pins ×5 | 0 | SR-RUNSHEET v1.4.0 live legs maintainer-side |

## Findings (roll-up)

- **L1 — the gates bite (recorded proof ×3 this cycle):** the 16.5 CI
  detector block (animation channel), the 17.3 axe finding (link-on-muted
  contrast), and the 16.6 walkthrough census drift — all caught by
  mechanized gates, all fixed in-round. Zero findings reached a release
  surface.
- **L2 — spec-origin misses are the only real misses:** 16.4 composer
  placement (orchestrator wording) — implementations followed frozen specs
  faithfully; the misses lived in the specs, caught by reference-first
  fidelity rounds.
- **L3 — the honest-absence ledger:** no dark-article reference
  (`ink-reference-time` unbound), no live VO/NVDA, Graphik/Charter
  licenses, Ruble Sans, composer r20 token candidacy, rubric-mark optics —
  all named, none silently dropped.
- **L4 — react/tokens cross-check:** `packages/tj-react` is 100% GENERATED
  (10 wrappers, regen-gated); `packages/tj-tokens` generated artifacts are
  drift-gated — zero hand-edits (numstat: every generated file pairs with
  its generator input commit).
