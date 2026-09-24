---
title: 'Story 7.3 — Stepper + StoreBadges + QrBlock: the marketing display batch'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'd199a79 (worktree) → merge d6a9f2c → lens fix 6cb2234'
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

- [x] `packages/components/src/{stepper,store-badges,qr-block}/{index.ts,*.ts,*.css.ts,*.test.ts,*.stories.ts}`
- [x] 3 exports + registry tests; event-map UNCHANGED (no events — gen = property
      passthrough); `pnpm gen` + wrapper smokes
- [x] `.playwright-cli/verify/{stepper,store-badges,qr-block}/` side-by-sides + probes +
      vision (blocked-protocol)
- [x] baselines via update flow + stability ×2; full gates green (VISUAL SERIALIZED —
      port 6007 machine-global); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (13), when the unit suite runs, then each row asserts across the
  three suites.
- Given the QR block, when inspected, then the tablist IS the v1 tk-tabs contract
  (composed element or its verbatim API — not a reimplementation).
- Given axe × both themes on every story of all three, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

Executed in an isolated worktree (executor round), commit `d199a79` (70 files, +3955),
merged to main as `d6a9f2c` (two union conflicts: components/react index.test.ts — both
additive, resolved keeping 6.4+7.2+7.3 blocks; gen union clean, drift-check clean
post-merge).

**tk-stepper** (13 tests): `TkStepperStep={title,text}` — numbering automatic 1..n,
`heading?`, unnamed CTA slot, zero state. The brown numeral badge — the round's FLAGGED
mapping: probe-measured reference #8D6040 has no token-layer counterpart; shipped on
`tint-cream-raised` + `text-primary` (AA 9.655:1; white-on-cream would be 1.4:1) with
`--tk-stepper-badge-fill`/`-number` custom props as the day-one brand hook — recorded as
a maintainer decision in deferred-work.md (brown token belongs to the token layer).
Deltas: card 336 fixed → auto-fit (379 @1232 story), badge radius 18→16, numeral
700→500, heading → heading-2 EXACT; reference subtitle/page-toggle outside the frozen
API.

**tk-store-badges** (10 tests): `TkStoreBadge={href,label,iconSrc?,iconAlt?}`,
`target=_blank rel=noopener noreferrer`, zero state. Radius TRUED this round by a
three-depth arc fit (insets 6/1.5/1 at dy 8/16/20) → **r≈24 = radius-xl** (first pass
had pinned radius-lg 16 off a loose read; sheet + header + unit pin corrected). Pill
324×80 and gap 64 probe-EXACT both sides; fill #F6F7F8→surface-muted (Δ≈1); label
600→body-m-bold 500; icons neutral placeholder art (zero brand art in repo); zero motion
(instant hover step, unit-pinned).

**tk-qr-block** (11 tests): `title` (typed `string=''` — the native `HTMLElement.title`
collision documented; Lit never reflects), `TkQrTab={label,qrSrc,note?}`; the tablist is
v1 tk-tabs COMPOSED verbatim (zero `--tk-tabs-*` overrides — unit-pinned; keyboard and
`value-change` cross both boundaries as tk-tabs' own). Position correction (the round's
finding): the note sits UNDER the tile, not above (x=640 runs: tile starts y≈101 right
under the tabs; text y303–323 below the card; gap 12 = space-12 EXACT) — corrected
everywhere + a DOM-order pin. AA finding: nearer note-ink token text-muted (#959BA4)
FAILED axe live at 2.8:1 on 4 light stories → reverted to text-secondary (4.99:1);
capture core #C5C5C5 ≈2.1:1 — the same AA-over-capture ruling as the badge. Note size
≈19–20px → body-l 17 (nearest step). Inactive-tab gray #F2F4F7 unexpressed (the v1
invisible-track ruling) — recorded delta.

**Executor's lens-scrutiny fixes DURING the round (self-found, all landed in d199a79):**
(1) invalid CTA selector `:host([data-has-cta'])` — unterminated string silently dropped
by the CSS parser, margin never applied, and the unit test had matched the same typo —
fixed to the promo-card unquoted precedent (sheet + test); (2) note position above→below;
(3) radius-lg→radius-xl arc-fit; (4) note-ink AA revert. Happy-dom truths re-confirmed:
slot `textContent` is always fallback (`assignedNodes` is truth); slotchange fires only
on post-mount change.

**Gates (worktree):** build/test/lint/typecheck/gen/gen:tokens green — tokens 15,
components 27 files/622 (its fork pre-dated the 6.5-window count), react 64, root 122;
gen-drift 0. Visual: re-record run 1135 passed + exactly 20 new-baseline writes;
confirmation 1155 passed exit 0, zero axe violations; port 6007 handled per protocol
(one foreign run waited out; own orphans cleaned after confirmed ownership).

**Evidence:** `.playwright-cli/verify/{stepper,store-badges,qr-block}/` — NOTES.md each
(ground-truth tables, capture recipes, deviations), side-by-sides (reference over kit,
2px hairline), kit + reference crops, probe transcripts, the qr note-strip position
proof. 30 baselines (5 stories × 3 components × 2 themes; 12 re-recorded mid-round after
the fixes, stable ×2). React: 3 property-passthrough wrappers, ZERO event-map edits
(display components dispatch nothing of their own; qr tab switching is composed
tk-tabs' contract).

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

Quick-review lens (qr-lens-7-3) on the worktree commit `d199a79`: **SHIP — 0 BLOCKERS /
2 WARN / 7 NOTEs.**

- **Template-vs-selector check (the 6.4 B1 lesson): CLEAN across all three components**
  — every sheet selector matches a template element and the reverse (stepper css:76-207
  vs ts:92-109 incl. the FIXED `:host([data-has-cta])` at css:190 ↔ attr toggle ts:84 ↔
  parse-pinned test:108; badges css:63-145 vs ts:75-108; qr css:70-149 vs ts:94-122
  incl. `.panel__tile + .panel__note` ↔ the DOM-order pin ts:103-113).
- **Matrix 13/13 pinned** (stepper :64/:95/:104/:132/:155; badges :62/:88/:108/:130; qr
  :69/:98+115/:143/:158); test counts 13/10/11 as claimed (37/37 re-run by the lens);
  react smokes + zero event-map entries for all three tags (react index.test.ts:1468+).
- **W1 — store-badges zero-state copy renders LEFT-aligned** contra intended centering:
  `.badges--empty` inherits the ul's flex row without a display/justify override, so
  `text-align:center` never fires (slotted copy = display:contents flex items at
  flex-start). DISPOSITION: FIXED by the orchestrator in the merge window —
  `justify-content: center` added (css sheet + comment); the variants baseline pair
  re-taken; full suite ×2 re-proven post-fix (see Verification).
- **W2 — default icon alt DUPLICATED the pill's accname** («RuStore RuStore» —
  `alt=${iconAlt ?? label}` + visible label span in the same anchor), while the a11y
  story text claimed the opposite. DISPOSITION: FIXED — default `alt=''` (icon
  decorative; accname = the visible label alone, exactly what the SR protocol row
  expects); explicit iconAlt overrides. Test :99-104 rewritten to pin BOTH paths;
  a11y story row re-worded to match reality; 10/10 green.
- **N1** — stepper heading trued to heading-2 (44px probe) over the spec's heading-4
  guess; no section-heading template exists so the else-branch rules; flagged in the
  sheet. ACCEPTED.
- **N2** — stale story copy said «radius-lg» after the arc-fit trued the sheet to
  radius-xl. DISPOSITION: FIXED (one word, same fix commit).
- **N3** — pill fill surface-muted over the spec's surface-field hint (probe ΔE≈1 vs
  #F6F7F8; surface-field is bluish). ACCEPTED (recorded in the sheet header).
- **N4** — qr keyboard test name promises arrows/Home/Tab but pins ArrowRight only;
  the full matrix is composed v1 tk-tabs' own suite. ACCEPTED.
- **N5** — NULL entries inside steps/tabs arrays throw (outside the documented §2
  clamp = null/undefined ARRAY, no matrix row; kit precedent). RECORDED.
- **N6** — CTA slot renders only in the non-empty branch; matrix row 3 presumes
  steps. ACCEPTED.
- **N7** — the worktree's index.ts/index.test.ts/event-map deltas vs main stem from
  its fork point predating the 6.4/7.2 windows — NOT deletions (verified additive by
  the lens; the merge union kept both sides).
- **Executor's accepted deviations** (all recorded in css headers/NOTES): brown badge
  → tint-cream-raised + text-primary with `--tk-stepper-badge-*` hooks (deferred-work
  maintainer flag); heading-2 over heading-4 (probe); surface-muted over surface-field
  (probe); inactive-tab gray unexpressed (v1 invisible-track ruling); note ink
  text-secondary (AA-over-capture; text-muted failed live axe 2.8:1); radius-xl
  arc-fit + note-under-tile (mid-round corrections, pinned); `title` typed `string=''`
  (HTMLElement.title collision documented).

## Verification

| Gate | Result |
|---|---|
| Worktree gates `d199a79` | build/test/lint/typecheck/gen/gen:tokens green; gen-drift 0; tokens 15, components 622 (27 files — fork pre-dated the 6.5-window count), react 64, root 122 |
| Worktree visual | re-record run 1135 passed + exactly 20 new-baseline writes; confirmation **1155 passed, exit 0**, zero axe violations |
| Merged-main full gates `d6a9f2c` | **ALL GREEN** — tokens 15, components 665 (29 files), react 70, root 122; gen union clean, drift-check clean post-commit |
| Merged-main visual (union suite) | **1244/1244 passed ×2** (7.5–7.6m each, private port 6041) — 1154 main + 90 trio legs (30 story baselines + spec-file legs) |
| Lens fix round `6cb2234` | W1+W2+N2 fixed on main (store-badges css/ts/test/stories); badges suite 11/11 (incl. the new W1 pin); accessibility baseline pair re-taken via --update (exactly 2 PNGs changed — the rendered SR-table row + zero-state centering); **1244/1244 ×2 post-fix**, both exit 0 |
| axe × both themes | zero violations across all trio stories (merge runs + fix runs) |
| React surface | 27 wrappers (24 + trio property-passthrough); ZERO event-map entries (display components dispatch nothing; qr tabs = composed tk-tabs' own contract); smokes green |

Worktree artifacts: 3 component dirs ×5 files, 30 baselines, evidence ×3
(`.playwright-cli/verify/{stepper,store-badges,qr-block}/`), react smokes, CEM union.
Lens verdict: SHIP 0 BLOCKERS / 2 WARN / 7 NOTE — both WARNs + N2 fixed in `6cb2234`
(the merge window itself); N1/N3/N4/N6 accepted (probe-trued/recorded), N5 recorded,
N7 fork-point artifact.
