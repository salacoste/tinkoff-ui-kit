# Dark sweep ledger — 19/19 (Story 5.4, 2026-09-23)

Method + rulings + findings: `NOTES.md` (same directory). Evidence legend:
**engine** = `tests/visual/dark-sweep.spec.ts` leg
`dark sweep: <component> — theme-flip paint audit` (structure parity /
computed AA pairs incl. slot-aware alpha chains / light-only leftovers /
invariant holds / shadow collapse / border presence / yellow-keeps-ink),
**visual** = generated `tests/visual/visual.spec.ts` legs (screenshot +
axe, every story × theme), **contrast** = `tests/contrast.test.ts` rows
(57-pair mechanized table: 30 light / 27 dark, generated-sourced),
**branch** = `tests/zero-theme-branches.test.ts`,
**gen** = `packages/tokens/scripts/generate.mjs` generation-time asserts.
All 19 engine legs PASS post-fix; the failures they caught on the way in
are the F1–F4 fixes (NOTES.md).

## Per-component dark evidence (19 components × the sweep's check set)

| Component | Structure parity | AA pairs (dark) | No light-only leftovers | Invariants (yellow/ink/charcoal hold) | Shadows collapse (UX-DR2) | Borders present | Yellow keeps ink |
|---|---|---|---|---|---|---|---|
| tk-button | engine (playground) | engine + contrast 9.405/12.635/17.404 rows | engine (secondary pill = surface-base, hairline remap; canvas fix F4) | engine (yellow-100/200/300 fill FORCE-held; inverse flip = the sanctioned exemption R3) | engine (default/hover shadows → none in dark) | engine (1px secondary hairline → #FFFFFF24, width kept) | engine (full-cover ::before yellow + ink label; live) |
| tk-link | engine (variants) | engine + contrast link rows (4.624 light / 6.836 dark) | engine (canvas fix F4) | n/a (no invariant fills) | engine | engine (no borders by design) | n/a |
| tk-badge | engine (variants) | engine + contrast incentive 4.742 / stat 12.635 rows | engine (canvas fix F4) | engine (green-100 + ink-300 fills FORCE-held) | engine (flat chips — none in both) | engine (borderless pills by design) | n/a (green pairs ink by the same engine rule) |
| tk-progress-bar | engine (playground) | engine + contrast header-label rows | **F1 FIXED here**: track gray-200 → border-default (white-alpha rail, computed `rgba(255,255,255,0.14)` probed) | engine (fill blue-100 = indicator ruling R2) | engine (none) | engine (track edge = radius clip, no border) | n/a (fill is text-less — indicator scope) |
| tk-modal | engine (open story, overlay root) | engine + contrast panel-text rows (12.635 light / 17.404 dark) | engine (panel surface-base → #1A1A1A; scrim decorative R2) | engine | engine (modal shadow → none; tonal panel) | engine (panel hairline remap) | n/a |
| tk-tooltip | engine (open story) | engine + contrast white-on-ink 12.635 (theme-invariant fill) | engine (ink-300 pill unchanged = FORCE-held) | engine (ink-300 FORCE-held) | engine (tooltip shadow → none) | engine | n/a |
| tk-toast | engine (stack story, #tk-toast-stack) | engine + contrast toast rows | engine (card surface-base → dark; icon green-200 = R2) | engine | engine (default shadow → none) | engine | n/a |
| tk-input | engine (playground) | engine + contrast field rows (11.126 light / 13.009 + 7.303 composited dark) | engine (field → #FFFFFF1A; placeholder = F5 ruling, ≥3:1 held) | engine (success icon green-100 R2) | engine | engine (focus ring = outline, not shadow; box hairline remap) | n/a |
| tk-select | engine (open story) | engine + contrast select rows | **F3 FIXED here**: option hover gray-100 → surface-muted (dark #222222; active ordering preserved) | engine | engine (dropdown shadow → none) | engine | n/a |
| tk-checkbox | engine (playground) | engine | engine (box surface-base → dark + white-alpha hairline; checked = yellow+ink) | engine (yellow-100 checked fill FORCE-held) | engine | engine (unchecked border-default → #FFFFFF24 visible on dark) | engine (checked box carries ink check glyph) |
| tk-segmented-radio | engine (playground) | engine | engine (segment fill surface-base → dark; inset hairline ring survives) | engine (dot center ink-300 + yellow fill FORCE-held) | engine (track hairline = inset ring, legal) | engine (inset 1px border-default ring remaps) | engine (dot is text-less — indicator scope) |
| tk-thumbnail-picker | engine (playground) | engine | engine (tiles + inset border-strong → #FFFFFF3D; swatch art = R1 ruling) | engine (selected ring ink-300 FORCE-held) | engine | engine (inset hairline ring, width kept) | n/a |
| tk-tabs | engine (playground) | engine | engine (active pill surface-base → dark + hairline belt — the documented 3.3 dark-canvas belt) | engine | engine (pill shadow → none; hairline keeps the edge) | engine (pill border-default remap) | n/a |
| tk-navbar | engine (playground) | engine | engine (bar fill surface-base → dark) | engine (yellow-100 underline FORCE-held; redundant-indicator AA ruling) | engine (bar shadow → none) | engine (bar hairline remap) | engine (underline = strip scope; link text stays the state carrier) |
| tk-footer | engine (playground) | engine + contrast rows | engine (pill ink-300 + white text unchanged = FORCE-held; columns remap) | engine (ink-300 pills FORCE-held) | engine | engine | n/a |
| tk-promo-card | engine (playground) | engine + contrast tint-pairing rows (15.5/8.4/6.1 dark) | engine (tints → dark-tint-*; **F2** skeleton → border-default; charcoal CTA = Tier-B white-on-invariant) | engine (charcoal #333333 FORCE-held — the invariant; CTA pill white + ink-300) | engine (flat tinted cards — none in both) | engine | n/a |
| tk-feature-card | engine (playground incl. editorial) | engine + contrast rows | engine (editorial charcoal FORCE-held; CTA Tier-B — slot-aware chain proven after the parentIndex fix) | engine (charcoal editorial + white pill/ink text) | engine (flat cards) | engine | n/a |
| tk-service-card | engine (playground) | engine + contrast rows | engine (tints remap; link re-scope via --tk-service-card-link → white on charcoal) | engine | engine | engine | n/a |
| tk-article-card | engine (playground) | engine + contrast rows | engine (tints remap; **F2** skeleton → border-default; stitch ::after full-cover) | engine | engine | engine | n/a |

Every story of every component additionally carries the generated
`visual:` + `axe:` legs (both themes) from `tests/visual/visual.spec.ts`;
the engine legs above are the 19 canonical stories the computed-paint
audit runs on.

## Zero-theme-branch check (mechanical) — output

`npx vitest run tests/zero-theme-branches.test.ts` → **Tests 5 passed**:
repo scan (0 violations across components/react/docs runtime sources),
vacuous-walk guard (non-empty file set per package), stale-exemption
guard, detector positive self-check (6 synthesized branches flagged),
detector negative self-check (token-only + comment mentions pass).
Exemptions documented in NOTES.md; the guard runs in `pnpm test` → CI.

## Dark-tint verification table (closes the [ASSUMPTION] flags)

Values sourced from the generated maps (`colorTokens` light /
`darkColorTokens` dark). Lab L\* = CIE Lab (D65); the "L≈16–20%" rule
reads as Lab L\* (ruling 1, NOTES.md). OKLCH recorded alongside per the
spec's computation instruction.

| Tint | Light | Dark | Lab L\* (dark) | Window miss | OKLCH L (dark) | OKLCH hue Δ | Chroma | Verdict |
|---|---|---|---|---|---|---|---|---|
| tint-gray | #F5F5F6 | #242424 | **14.2** | 1.8 pt under | 26.0% | achromatic (C 0.000 both) | — | **HELD** (within the 2-pt threshold; sits between tonal steps 1–2) |
| tint-bluegray | #ECF1F7 | #1E242C | **13.9** | 2.06 pt under | 25.8% | 252.8° → 255.7° (**Δ2.9°** — kept) | 0.010 → 0.017 | **HELD** (exceeds 2 pt by 0.06 but fails the visually-meaningful conjunct: sub-JND, safer direction — ruling 2) |
| tint-mint | #D0F4F2 | #1C2A26 | **15.7** | 0.3 pt under | 27.1% | 192.4° → 175.1° (Δ17.3° ≤ ±20° tolerance) | 0.037 → 0.020 | **HELD** |
| tint-beige | #F1EBD6 | #2A2620 | **15.4** | 0.6 pt under | 27.1% | 93.8° → 78.1° (Δ15.7° ≤ ±20° tolerance) | 0.029 → 0.012 | **HELD** |

Position anchor (why "held" is right, not lawyer-ed): every dark tint
sits between tonal steps 1 and 2 (Lab 13.2–16.6 / OKLCH 25.2–28.1) — a
content tint distinguishable from muted panels without competing with
elevated chrome; the reference dark-evidence band (Taiga ramp #222–#373737
= OKLCH 25.2–33.7%) brackets the same territory.

**Charcoal invariant:** dark-tint-charcoal = tint-charcoal = #333333 —
asserted at generation (`generate.mjs`), pinned by the contrast
white-on-charcoal row, and FORCE-held by the engine on the rendered
charcoal/editorial cards.

**No DESIGN.md tint values changed** — all four hold, so the 3.6
closure-mold correction path was not needed. The [ASSUMPTION] annotations
are RESOLVED to "Verified — Story 5.4 dark sweep: …" per tint in the
generator's `DARK_TOKEN_NOTES` (rendered into `tokens.css` comments +
`TOKENS.md` dark table via `pnpm gen:tokens`; artifacts byte-stable
against a second fresh render — md5-proven). DESIGN.md Colors body now
records the verification (values + tolerances + window-miss numbers).

## Gate evidence (this change)

- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen` —
  all exit 0 (fresh run 2026-09-23; vitest 105 passed incl. the new branch
  guard + the updated skeleton pins; `pnpm gen` re-ran the CEM manifest
  after the story edits — `gen-drift` green).
- Tokens: `pnpm gen:tokens` twice → identical checksums (worktree ==
  fresh render; the committed-pending artifacts carry only the four
  Verified-note comment changes — zero value changes).
- `pnpm test:visual`: update flow after deleting the 23 changed dark
  baselines (F2/F4 classes), then **stable ×2** (765 tests; the pre-update
  compare pass had exactly 23 failures — the changed dark stories — and
  742 passing).
- Engine: 19/19 legs pass in ~3s (both-theme loads per story).

## Baseline obligations at the 5.6 maintainer batch gate

- The **23 re-taken dark baselines** (button ×8, badge ×6, link ×6,
  card `variants` ×3 — F2/F4 classes) ride the existing provisional rule.
- **F1 FLAG (explicit): the dark progress-bar baselines are knowingly
  STALE-BUT-PASSING** — the track's gray-200 → white-alpha fix changes a
  4px rail (~0.16% of the playground canvas), under the 1.5% pixel
  threshold, so those PNGs were NOT re-taken and still show the old
  near-white rail. The computed-style engine leg + the live probe
  (`rgba(255,255,255,0.14)`) pin the real state; the stale pixels MUST be
  eyeballed at the 5.6 batch-confirm so they cannot ride silently.
- **Engine limitation (recorded):** the slot-reparenting walk is ONE level
  deep (`assignedSlot` re-parents the slotted element only — descendants
  of slotted content keep their light-DOM chain and can miss a shadow
  fill behind an intermediate wrapper). Miss direction is false-FAIL
  (fallback paper is white → a missed dark fill fails loudly, never
  silently passes); 19/19 walk clean today; second-level walk is future
  hardening if composed slot content ever nests.

## Incomplete / deferred

None for this story. The baseline obligations above join the existing 5.6
maintainer batch gate (no new deferral — the provisional rule already
covers them). Tonal steps 2/3/elevated stay reserved (no current consumer
— NOTES.md).
