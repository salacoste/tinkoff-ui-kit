---
title: 'Story 7.3 — Stepper + StoreBadges + QrBlock: the marketing display batch'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.3 — FR-14)'
  - '{project-root}/packages/components/CONVENTIONS.md (§3/§6/§8/§9 FROZEN)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (UX addendum rows: qr-loaded, store-badges-loaded, steps-open-account-detail)'
  - '{project-root}/.playwright-cli/captures-v2/business/pattern-steps-open-account{,-detail}.png (stepper source)'
  - '{project-root}/.playwright-cli/captures-v2/invest-mobile/pattern-store-badges-loaded.png (badges source)'
  - '{project-root}/.playwright-cli/captures-v2/invest-mobile/pattern-qr-{tabs,loaded}.png (QR tablist source)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The three marketing display blocks of the business/app-landing domains (FR-14)
— the numbered steps, the app-store badge row, the QR-install tablist — have no kit
counterparts, and 7.4/7.5 compositions need them.

**Approach:** A batch of THREE display components in one story (one executor round, one
lens): `tk-stepper` (display-only numbered cards, optional CTA slot), `tk-store-badges`
(a row of plain external store links with consumer-supplied brand art), `tk-qr-block`
(the install tablist COMPOSING the v1 tk-tabs contract + a per-tab QR tile). All three
are presentational: zero §4 channels, zero events beyond what tk-tabs itself owns.

## Boundaries & Constraints

**Always (shared):**
- Display components: no form channel, no events (§3 n/a — nothing occurs; the QR tablist's
  tab switching rides tk-tabs' OWN internal contract if the v1 element is composed, else
  the v1 tabs API verbatim), no focus beyond native links; §8 native-hit checks; §6 hook
  grammar per component (`--tk-stepper-*`, `--tk-store-badges-*`, `--tk-qr-block-*`, each
  consumed WITH token fallbacks); `:host([hidden])` guards on sheets that set display.
- The v1 component gate VERBATIM (FR-16) per component: impeccable zero blockers; axe both
  themes; stories (default playground from the reference copy + variants + theming + a11y
  notes + SR-protocol section); React surface via `pnpm gen`; provisional baselines ×2 +
  side-by-sides archived to `.playwright-cli/verify/{stepper,store-badges,qr-block}/`
  + probes (the standing runs.awk method; vision = blocked-protocol note, zero claims);
  RU content, EN meta.

**tk-stepper (business steps-open-account):**
- API: `steps: TkStepperStep[]` where TkStepperStep = `{ title: string; text: string }` —
  numbering is AUTOMATIC (1..n rendered, never in data — the reference's numerals are the
  block's own chrome); optional UNNAMED SLOT = CTA row under the cards (the epics'
  «optional CTA slot»; the reference block itself has NO CTA — the slot is empty by
  default and the default story matches the reference). `heading?: string` — the block's
  visible heading prop (reference has one; default NONE rendered when unset... use the
  v1 section-heading pattern if a mold exists, else plain heading-4 mapping — flag).
- Anatomy (NOTES + detail capture): 3 WHITE surface-base rounded cards on the page cream;
  number = brown rounded-square badge OVERLAPPING the card's top edge (half above), white
  bold numeral; title + text centered under it; equal-height row (grid, 1-2-3 columns at
  the standard breakpoints — the v1 card-grid mold). Card radius, badge size/overlap,
  brown mapping = EXECUTOR PROBES the `-detail` capture and trues (the warm-brown likely
  maps to the beige/cream family token nearest — RECORD the mapping; if no token is
  honest-near, flag the literal per flag-don't-invent). No hover elevation (display);
  no motion.

**tk-store-badges (invest-mobile badges row):**
- API: `badges: TkStoreBadge[]` where TkStoreBadge = `{ href: string; label: string;
  iconSrc?: string; iconAlt?: string }` — PLAIN external links (`target="_blank"` +
  `rel="noopener noreferrer"`, the epics' ruling verbatim). Brand art is CONSUMER-SUPPLIED
  via `iconSrc` (the kit ships ZERO third-party brand marks — AppGallery/RuStore/Samsung
  icons are trademarks; the LABEL text stays as data = nominative use, the ART never
  enters the repo); no icon → the pill renders label-only (degrade, never throw §2).
- Anatomy (NOTES store-badges-loaded): uniform-size LIGHT-GRAY pill buttons (#F5F5F5-ish →
  `--tk-color-surface-field` nearest token, RECORD), icon squircle on the RIGHT (inverted
  vs official badges — the reference's own layout), label body-s/600; row wraps on narrow
  viewports; hover = the standard surface hover family; hit target = the whole pill, ≥44px
  height (§8; if the visual pill is shorter, pad the hit — the navbar drawer-link mold).
  Exact pill height/radius/padding = executor probes, verify round trues.

**tk-qr-block (invest-mobile QR tablist):**
- API: `title?: string` (block heading, e.g. «Отсканируйте QR-код» — probe the capture);
  `tabs: TkQrTab[]` where TkQrTab = `{ label: string; qrSrc: string; note?: string }` —
  each tab renders a panel: the security copy (NOTES: camera+QR with security copy — probe
  exact wording from the capture; prop-overridable `note` carries it) + the QR image in a
  white rounded tile, monochrome (the kit NEVER generates QR art — `qrSrc` is the
  consumer's encoding; alt text auto-composed from label, e.g. «QR-код для {label}»).
- The tablist = THE V1 tk-tabs CONTRACT COMPOSED — render the existing `tk-tabs` element
  inside tk-qr-block's shadow with the tabs' own keyboard/semantics (do NOT reimplement
  the tablist; if tk-tabs' API cannot express the block, STOP and report — that is a
  triage question, not an executor judgment). Tab visual (loaded capture): active = white
  fill + outline, inactive = light-gray fill (token map + RECORD; outline = border-default
  family — probe).
- Anatomy: QR tile = white surface-base rounded card padding ~16 (flag), sized to the
  image; the block sits on the page surface; no motion beyond tabs' own (v1 tokens).

**Never:**
- No new tokens; no theme branches; no z-index literals; no third-party brand ART in the
  repo (labels only, nominative); no QR generation; no §4 channels; no events on
  stepper/badges; no reimplementation of the tabs contract; no §4/§9 text changes; no
  scroll-lock; no motion on stepper/badges.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Stepper render | steps 3 | numbered cards 1-3, badge overlap, centered copy | — |
| Stepper auto-number | steps 5 | 1..5 rendered; data numbering impossible | — |
| Stepper CTA | slot empty / set | reference-plain / CTA row under cards | — |
| Stepper empty | steps=[] | the documented zero-state copy slot (never blank §2) | — |
| Stepper 1 column | mobile viewport | stack, badge geometry intact | — |
| Badges render | 3 badges w/ icons | uniform pills, icon right, labels | — |
| Badge no icon | iconSrc omitted | label-only pill, same size class | — |
| Badge link | click/keyboard | external navigation, noopener, _blank | — |
| Badges empty | badges=[] | zero-state slot, never blank | — |
| QR render | 2 tabs | tk-tabs with 2 panels: copy + QR tile each | — |
| QR keyboard | Tab/Arrows in tabs | the v1 tk-tabs contract VERBATIM | — |
| QR no note | note omitted | panel = QR tile only | — |
| QR alt | screen reader on image | «QR-код для {label}» announced | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/tabs/` -- THE tablist contract to compose (qr-block)
- `packages/components/src/pagination/` + `filter-chips/` -- recent v2 idioms (props data
  shapes, zero-state slots, css.ts conventions)
- `packages/components/src/article-card/` or the v1 card-grid component -- the equal-height
  card row mold (stepper)
- `.playwright-cli/captures-v2/business/pattern-steps-open-account-detail.png`,
  `invest-mobile/pattern-store-badges-loaded.png`, `invest-mobile/pattern-qr-loaded.png`
  -- the three side-by-side sources
- `tests/visual/` -- baselines; `packages/components/src/index.ts` + index.test.ts -- 3 exports

## Tasks & Acceptance

- [ ] `packages/components/src/{stepper,store-badges,qr-block}/{index.ts,*.ts,*.css.ts,*.test.ts,*.stories.ts}`
- [ ] 3 exports + registry tests; event-map UNCHANGED (no events — gen = property
      passthrough); `pnpm gen` + wrapper smokes
- [ ] `.playwright-cli/verify/{stepper,store-badges,qr-block}/` side-by-sides + probes +
      vision (blocked-protocol)
- [ ] baselines via update flow + stability ×2; full gates green (VISUAL SERIALIZED —
      port 6007 machine-global); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (13), when the unit suite runs, then each row asserts across the
  three suites.
- Given the QR block, when inspected, then the tablist IS the v1 tk-tabs contract
  (composed element or its verbatim API — not a reimplementation).
- Given axe × both themes on every story of all three, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
