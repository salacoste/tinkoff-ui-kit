# ТЖ a11y sweep ledger — 45/45 (Story 17.1, 2026-09-29)

Method: the 5.1/11.1 engine duplicated-and-adapted onto the ТЖ registry —
`tests/visual/tj-a11y-sweep.spec.ts` (140 functional tests: 45 walk rows ×
both themes, 45 deep scans, 5 SR state pins). The bank engine
(`tests/visual/a11y-sweep.spec.ts`) stays BYTE-IDENTICAL; every divergence
is a recorded family fact. Scoped orchestrator validation
`pnpm exec playwright test -g "tj-(a11y|dark)-sweep"` → **185 passed**
(a11y + dark engines together; a11y share = 140). CI owns the full gate.

## Evidence legend

**walk** = `tj-a11y-sweep walk: <component> — <story> — Tab stops ringed
[light|dark]` — real Tab traversal (80-press cap, cycle closes on a
revisited per-element ordinal), EXACT kit stop count vs the TSWEEP
derivation, unified-ring assertion per stop, Shift+Tab revisits the same
ordinal set. **scan** = `… every visible interactive element named,
≥44×44 (or ruled)` — document + every shadow tree, name chain
(labelledby → label → alt → title → label[for] → closest label → slot
text → textContent), effective box (label wrap + stitched-::after
ancestor), §9 inline-prose exemption = COMPUTED `display: inline`.
**SR pin** = the describe-block state pins (DOM-computed role/state).
**pattern** = `assertAllStops` rows assert story-chrome stops too and pin
the TOTAL forward-walk length.

## Ring family resolution (runtime, per surface)

tk hosts (the FR-21 ad-slot story only) → `--tk-color-focus-ring`;
tj stops whose OWN bg is the purple field family (chip-fill /
badge-purple) → `--tj-color-chip-ink`; every other tj stop →
`--tj-color-focus-ring` (light #8A8AE5 / dark #828BBB — resolved, never
hardcoded). Story-chrome stops = geometry + non-transparent (pattern
pages mix token worlds deliberately). NO underline exceptions: probe10
ruled ТЖ links GET 2px rings — the exception table ships EMPTY. All ТЖ
rings are SELF-CARRIED (the bank sibling/.field/ringAncestor carrier
topology is dropped — no ТЖ pattern licenses it).

## Per-component evidence (45 built story ids)

| Component | Stories (stops = kit Tab stops) | walk ×2 | scan | Notes |
|---|---|---|---|---|
| tj-prose | playground 0 / species 2 / composition 3 / accessibility 2 | engine | engine | static typography; skeleton/anatomy inert hosts render NO href (16.1 rule) |
| tj-link | playground 2 / species 3 / anchor-contract 2 / accessibility 0 | engine | engine | inert href="" renders no attribute — zero stops |
| tj-cta | playground 1 / anatomy 2 / anchor-contract 1 / accessibility 0 | engine | engine | 44-box species |
| tj-rubric-header | playground/anatomy/accessibility 0 | engine | engine | pure display surface |
| tj-news-card | playground 2 / anatomy 1 / skeleton 1 / accessibility 0 | engine | engine | row-as-link stitched ::after — effective box = whole card |
| tj-tag-chip | playground 4 / anchor-contract 2 / **pro-hero-pattern 5 (pattern)** / accessibility 0 | engine | engine | `subFloorExempt: tj-tag-chip .chip` — the 40px pill is the 16.2 twin-pinned census height; hero CTA chrome ringed with chip-ink on the purple field |
| tj-composer | playground 2 / anatomy 2 / accessibility 0 | engine | engine | fake-input = shadow `<button type=button>` (SR pin) |
| tj-post-card | playground 1 / anatomy 2 / **community-pattern 4 (pattern)** / accessibility 0 | engine | engine | all-kit pattern (1 composer button + 3 card anchors) |
| tj-header | playground/anatomy/theme-contract/accessibility — 9 stops each | engine | engine | `subFloorExempt: tj-header .chip` (36px capture-estimate pill — the WEAKEST recorded exemption, re-measure candidate); wordmark + «Поиск» floors = the F-fixes below |
| tj-rail | playground 5 / anatomy 5 / **chrome-composition 13** / drawer 5 / accessibility 0 | engine | engine | drawer walk = as-rendered CLOSED (sheet hidden → no stops); open-state contract = SR pin |
| tj-article-page | **page-composition 12 kit / 18 total (pattern)** / anatomy 0 / accessibility 0 | engine | engine | backrail visibility-hidden = zero stops by default; engage buttons individually (Flow D) |
| tj-ad-slot-recipe | **recipe 6 kit / 7 total (pattern, countBankHosts)** / accessibility 0 | engine | engine | the ONE both-families composition point: 2 tk-promo-card CTAs ring with `--tk-color-focus-ring`; `.tjad-toggle` chrome = bank border token, geometry-only |
| tj-getting-started | page 0 | engine | engine | text-only onboarding |

Spec note: the spec prose said "46 rows" — the built docs index carries
**45** story ids; the engine enumerates all 45 (off-by-one recorded in
the story report, spec closed with the correction).

## SR state pins (DOM-computed; live VO/NVDA = the runsheet, maintainer-side)

1. **tj-composer** — fake-input is `<button type="button">` NOT an input
   (the 16.4 ruling); label span renders the placeholder text; host
   `aria-label` forwards onto the shadow button and WINS; avatar tile
   aria-hidden. ✓
2. **tj-rail drawer** — reflected `open` boolean channel; burger
   `aria-expanded`/`aria-controls` → sheet id; sheet role=dialog
   aria-modal, RU label «Разделы»; programmatic open at 1280 (burger
   display:none — mechanics ungated); trap places focus on the first row;
   Esc closes → `open` false, expanded false, sheet hidden, and focus
   restores to the PRE-TRAP target — for the programmatic demo that is
   the demo button (LIFO, run-4 pin correction), not the invisible burger. ✓
3. **tj-header theme cycle** — stateless light → dark → auto → light;
   RU announcements «Тема оформления: тёмная/системная/светлая» via the
   polite live region; `theme-change` detail = mode STRING
   ['dark','auto','light']; glyph aria-hidden. ✓
4. **Anchor contracts** (link/cta/tag-chip/news-card/post-card) — inert
   href="" renders NO attribute (no tab stop); `_blank` without rel gains
   exactly `noopener noreferrer`; consumer rel rides VERBATIM (rel="next"
   / "nofollow" — nothing appended). ✓
5. **article-page like-toggle** — exactly ONE pressed-carrier in the
   MAIN engage bar (scoped: the opt-in backrail clones the classes with
   its own aria-pressed — run-4 scoping fix); aria-pressed flips
   false→true→false; count re-derives from `data-base-count`
   128→129→128; label stays static «Нравится». ✓

## Triage fixes + engine lessons (the patch rounds, ratified deviations)

- **F1 wordmark rings** (triage): slotted consumer anchors GET the kit
  ring — `.tjhh-wordmark`/`.tjart-wordmark`/`.tjrl-wordmark`
  `:focus-visible` 2px `--tj-color-focus-ring` offset 2px (probe10:
  rings everywhere — the improvement layer).
- **F2 «Поиск» floor** (triage): `.tjhh-action` 40px → 44px hit-area
  literals (no `--tj-space-44` on the 4-step scale; no fill → hit-area
  only; FLAG in source).
- **F3 header chip 36px** (triage): KEPT as the recorded exemption —
  extraction-faithful pill height; hit-area expansion is a consumer
  recipe, maintainer FLAG stands.
- **Wordmark 44px floors** (run 3): the slotted anchors are FLEX ITEMS —
  blockified, so the §9 inline-prose exemption cannot apply; all three
  wordmark classes grow to an invisible 44×44 box (logo/text unchanged;
  the `.tjhh-action` precedent; FLAG in source).
- **3-digit hex** (run 2, engine): the sheet declares
  `--tj-color-chip-ink: #fff`; the token reader now normalizes 3- AND
  6-digit hex to Chromium's `rgb()` serialization (the ring WAS present —
  the comparison string was wrong).
- **SR pin scoping** (run 4, engine): drawer Esc pin rewritten to the
  true LIFO contract; like-toggle pin scoped off the backrail clones.

SR manual protocol: `SR-RUNSHEET-v1.4.0.md` (same directory) — 7 surfaces
× light/dark, maintainer-side VoiceOver/NVDA pass.
