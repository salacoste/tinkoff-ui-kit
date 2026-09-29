# ТЖ dark sweep ledger — 45/45 (Story 17.2, 2026-09-29)

Method: EXTRACTION-VERIFICATION (the direction of authority is INVERTED
versus the bank 5.4 sweep): the ТЖ dark values are the REFERENCE'S OWN
(the 15.2 dark-home pixel census), so the engine verifies EXTRACTION
FIDELITY — every invariant pins extraction pairs READ FROM THE TOKEN
SHEET AT RUNTIME (`tests/visual/tj-dark-sweep.spec.ts`, 45 tests). A
forced-invariant failure is DESIGN.md re-open evidence with measured
values, never a silent retune. Scoped orchestrator validation
`pnpm exec playwright test -g "tj-(a11y|dark)-sweep"` → **185 passed**
(dark share = 45). CI owns the full gate.

## Evidence legend (per story, all 45 ids)

**parity** = structure fingerprint `tag[variant]#id.classes#ordinal`
sequence IDENTICAL across themes (a branch = a render-level theme fork).
**AA** = slot-aware alpha-chain compositing, dark theme: ≥4.5:1 text,
≥3:1 large (≥24px, or ≥18.66px @ ≥700), placeholders ≥3 — NO restricted
exemptions at DOM level (the 16.6 axe-collision ruling: the restricted
inks never render in kit stories; every AA failure is a real finding).
**leftovers** = an unchanged color is legal ONLY in the sheet's own
theme-invariant set (purple field family + gold accents + transparent;
chip-ink white only ON purple grounds — own or Tier-B ancestor; white-alpha
VEILS on purple grounds — the /pro/ hero blobs, run 7).
**forced** = purple family EXACT in dark; link pair flips with the
sheet's own values (#1414CC → #93A2FF); CTA fill flips (#333333 →
#F5F5F9). **shadows** = ТЖ is FLAT: theme-consistent AND overlay-geometry
only (`--tj-shadow-overlay` 0 2px 8px). **native** = dual-emit proof:
OS-dark + `data-tj-theme` stripped POST-settle + bank layer
`data-theme=dark` → double-rAF self-check (attr still null, page token =
dark value) → full computed fingerprint EQUALS the explicit-dark run.

## Per-component evidence

| Component (stories) | parity | AA (dark) | leftovers | forced flips | shadows | native |
|---|---|---|---|---|---|---|
| tj-prose (4) | engine | engine | engine | engine (prose link flips) | engine (flat) | engine |
| tj-link (4) | engine | engine | engine | engine (link pair both ways) | engine | engine |
| tj-cta (4) | engine | engine — label rides the ::before pill (the pseudo-composite fix) | engine | engine (cta-fill flip) | engine | engine |
| tj-rubric-header (3) | engine | engine | engine | n/a | engine | engine |
| tj-news-card (4) | engine | engine (meta ink-300 on card) | engine | n/a | engine | engine |
| tj-tag-chip (4) | engine | engine — chip-ink on chip-fill, twin-pinned | engine — /pro/ hero blobs = white-alpha veils on the invariant field (run 7) | engine (purple family EXACT) | engine | engine |
| tj-composer (3) | engine | engine | engine | n/a | engine | engine |
| tj-post-card (4) | engine | engine | engine | n/a | engine | engine |
| tj-header (4) | engine | engine — CTA label rgb(0,0,0) on the flipped #F5F5F9 pill ≈19.5:1 (was 1.15:1 against the page before the pseudo-composite fix) | engine | engine (cta-fill flip + purple chips exact) | engine | engine |
| tj-rail (5) | engine | engine | engine | n/a | engine — drawer sheet = the overlay token | engine |
| tj-article-page (3) | engine | engine | engine | engine (composed header legs inherit) | engine | engine |
| tj-ad-slot-recipe (2) | engine | engine (universal leg) | bank-exempt (see boundary note) | bank-exempt | bank-exempt | engine |
| tj-getting-started (1) | engine | engine | engine | n/a | engine | engine |

## The FR-21 bank boundary (run-5 ratification)

The ad-slot story's bank surfaces follow the BANK's own dark contract
(spec 8.2 owns them): (1) subtrees under a tk-* host — the promo cards;
(2) the PAGE CHROME above `.tjad-stage` — the story's own boundary
comment («The ТЖ stage: --tj-* ONLY from here down»); that chrome
consumes `--tk-*` tokens whose flip (text-primary #333 → #FFF) is the
bank's contract. The engine's `bankScoped` follows the story's line, not
just tk- hosts — the toggle's #333 collided with ТЖ light cta-fill BY
VALUE (run-4 finding, dismissed as coincidental, not extraction drift).
Structure parity, border presence and AA stay UNIVERSAL on bank surfaces.

## Engine lessons of the patch rounds (all engine-side, zero component fixes)

- **run 2 — 3-digit hex**: `--tj-color-chip-ink: #fff` read raw broke
  every chip-ink comparison; the sheet reader normalizes 3-/6-digit hex
  to `rgb()` now.
- **run 3 — SB chrome**: Storybook's `#root-inner` wrapper (UA black, no
  text) and the story `<style>` element (CSS-source "text", UA
  display:none) tripped the unchanged-text leg; the leg now gates on
  `visible && hasText` — a color channel only RENDERS on visible
  text-bearing nodes (the bank mold needed no gate: its legal set already
  includes ink-black).
- **run 4 — pseudo compositing**: ТЖ pills ride `::before` with inset
  geometry (the CTA law); `effectiveBackground` now composites absolute
  rendering pseudos between the element's own bg and its content — the
  CTA label measured 1.15:1 against the PAGE before, ≈19.5:1 against its
  real pill now. A ТЖ family fact the bank mold never had (bank pills
  paint element bg directly).
- **run 5 — leftover bank gate**: the leftover leg demanded ТЖ legality
  FROM bank surfaces (`legal = transparent || (!bank && …)` inverted the
  exemption); bank surfaces are now skipped entirely — flagging their
  charcoal/yellow/white invariants here would re-derive the frozen bank
  engine's logic.
- **run 7 — white-alpha veils (post-lens)**: the `color(srgb …)` parser
  extension surfaced the 16.2/16.3 /pro/ hero blobs — `color-mix(white 10%)`
  over the theme-invariant purple field, UNCHANGED in dark BY DESIGN (a
  tint OF the invariant). Legalized as `isWhiteVeil && onPurpleGround(index)`
  — the fill-side analog of the chip-ink Tier-B rule (fill-side Tier-B).

## Standing rulings recorded with this sweep

- **`--tj-color-ink-reference-time` stays UNBOUND in dark** (the 15.2
  open decision, resolved here): no dark-article reference exists (16.6
  record); the ink never renders at DOM level (restricted contract) — it
  re-opens only with a dark-article capture. The dark block = 13
  declarations (not 11 as earlier memory had it).
- **ink-200 is deliberately OUTSIDE the leftover-legal set** (lens-172
  MINOR, documented): it rides the cta-fill flip — it CHANGES in dark, so
  an unchanged render of it would be a real finding, not an invariant.
- **parseColor reads Chromium's `color(srgb … / a)` serialization**
  (color-mix() backgrounds — the skeleton-bone family; lens-172 MINOR):
  previously they parsed transparent. The extension DID change a verdict —
  it surfaced the /pro/ hero blob veils (run 7), now legalized as
  white-alpha veils on purple grounds (the run-7 lesson above); every
  text-bearing fill still measured correct before and after.
- **Zero forced-invariant failures across all 45 rows**: the extraction
  pairs hold — no DESIGN.md re-open evidence produced.
- **Native-dark parity holds on all 45 rows**: the 15.2 dual-emit
  mechanism (attribute block + prefers-color-scheme auto leg,
  tokens.css 187–237) is proven mechanically per story.
