---
title: 'Story 8.3 — v2 docs completion (9 pages + registers surface)'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'e63639c (worktree, base 6104850) → FAST-FORWARD merge into main'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 8.3)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-5-*.md (THE docs mold — page structure, CEM tables)'
  - '{project-root}/packages/docs/src/ (getting-started, theming-guide, token-reference — the existing surfaces)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The nine v2 components have no docs pages, and the 6.1 register mappings
(marketing h1→heading-2 etc.) + v2 tokens are documented only in TOKENS.md — the consumer
surface lags the kit.

**Approach:** The 5.5 mold VERBATIM: nine component pages in `packages/docs` (API tables
from CEM auto-import, usage examples, theming notes, a11y incl. the SR-protocol sections),
the REGISTERS documentation surface (the mapping table rendered on the token-reference
page), and the token reference auto-gains the v2 tokens (generator-driven, zero hand
rows).

## Boundaries & Constraints

**Always:**
- Pages: filter-chips, pagination, combobox-search, mega-nav (the navbar page EXTENDS —
  the two-deep section), data-table, cookie-banner, stepper, store-badges, qr-block —
  the 5.5 page anatomy (what/when/not-for, API table from CEM, examples RU, theming, a11y
  notes + SR protocol, composition pointers to the showcase stories for the 6.5/7.4/7.5
  clusters).
- Registers surface: the token-reference page gains the REGISTERS table (the 6.1 mapping
  rows — marketing h1→heading-2 / product h1→heading-3, the search/table/cream surface
  semantics, the delta AA-override note with its §9-hover exception pointer) — rendered
  from a single source (the TOKENS.md/register doc via the docs build, not a second
  hand-copy; if the docs build has no import path, a checked-in generated artifact with a
  drift guard — the AD-4 single-source lesson).
- Token reference: v2 tokens appear via the existing generator surface (verify; no hand
  rows).
- The deferred preview.ts canvas-bg consideration EXECUTES HERE (its revisit condition is
  "the next docs-story work that touches canvas painting"): weigh one preview-level
  theme-aware rule vs the per-story copies; DECIDE and record (either is sanctioned —
  the ledger note is the deliverable).
- Consumer gotchas carried: cookie-banner storage-is-consumer's pattern; data-table
  keyboard contract; combobox-search query-never-emits; store-badge art-is-consumer's.

**Never:**
- No component source changes (docs only; a component gap found = REPORT); no new tokens;
  no hand-maintained token tables (generator or guarded artifact); no RU/EN mixups
  (docs pages RU like v1, code/meta EN).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Pages | 9 v2 components | 5.5-anatomy pages, CEM tables live | — |
| Navbar page | mega-nav section | the extension documented (subLinks contract) | — |
| Registers | token-reference | the mapping table renders, single-source | — |
| Token ref | v2 tokens | present via generator | — |
| Canvas bg | preview.ts decision | made + recorded (the debt's revisit condition) | — |

## Tasks & Acceptance

- [ ] 9 docs pages (+ navbar extension section); registers table; token ref verified
- [ ] preview.ts canvas-bg decision recorded
- [ ] Full gates green (VISUAL SERIALIZED — docs stories baseline too); spec closed; commit + push

**Acceptance Criteria:**
- Given the docs build, when opened, then all 9 v2 pages render with live CEM tables.
- Given the registers table, when the token layer changes, then it cannot drift silently.
- Given the gates, then green.

## Implementation Notes

**Executor round (worktree → e63639c, 34 files +2303; merged into main FAST-FORWARD —
linear history, base 6104850):**

- **Nine pages** in `packages/docs/src/v2/` — the 5.5 anatomy (when/not-for, live example,
  theming, a11y + SR-protocol tables, composition pointers to the showcase stories), API
  tables ALWAYS the generated CEM via `apiReferenceDoc` (zero hand-typed tables):
  filter-chips, pagination, combobox-search, mega-nav, data-table, cookie-banner, stepper,
  store-badges, qr-block. mega-nav documents the navbar EXTENSION (subLinks contract,
  desktop-only, «Разделы»).
- **Registers surface** — a new «Регистры v2» story on token-reference: typography mapping
  (marketing h1→heading-2 / product h1→heading-3), radius registers, search/table/cream
  surface semantics with the AA rulings verbatim + the §9-hover delta exception pointer.
- **Single source honored:** the committed GENERATED `TOKENS.md` exported by
  `pillkit-tokens/TOKENS.md` (?raw) + parser `packages/docs/src/v2/registers.ts` — the
  generator needed no changes. DOUBLE drift shield: the existing `check:tokens-drift` +
  a NEW `tests/docs-registers-source.test.ts` (runs the real file through the real
  parser — CI-parity via `pnpm test`).
- **Canvas-bg DECISION (the deferred-work revisit condition executed):** KEEP the
  per-story canvas copies; NO preview-level rule. Rationale (recorded with the code):
  (1) the copy is explicit intent at the use-site and FR-1 evidence; (2) a preview rule
  couples to layout (fullscreen vs sb-main-padded) and pins Storybook internals;
  (3) a second painter of the same surface is the AD-4 anti-pattern; (4) zero baseline
  churn.
- Consumer gotchas carried verbatim: cookie-banner storage-is-consumer's; data-table
  keyboard contract = the deliberate APG improvement (FR-12); combobox-search
  query-never-emits; store-badge art-is-consumer's (the known 7.5 qr-block copy-slot gap
  honestly referenced on the qr-block page).
- Units: root 127/127 = base 122 + exactly 5 NEW tests (docs-registers-source.test.ts).
  The executor's «fixed a pre-existing failure class» wording was a CLAIM DISTORTION
  (lens N1): nothing pre-existing failed at base; the md-regex separator fix and the
  hex-from-prose removal happened INSIDE the executor's own in-progress set (registers.ts
  parser + the new pages), not in the repo. Zero repo impact beyond the shipped tests.
- Visual: exactly 20 new baselines (10 stories × 2 themes; git status-verified set);
  full suite ×2 = **1329 legs green both passes** on private port 6061; temp config
  deleted pre-commit.
- Docs-chrome axe findings (components UNTOUCHED — diff shows zero changes under
  packages/components/src/ + packages/react/): docs styles were beating `::slotted` —
  the scaffold anchor ink is excluded from tk-cookie-banner (the frozen text-secondary
  ruling survives), and token-reference's single anchor colors via the link token
  (browser blue failed dark).
- No new component gaps; no deviations from the spec.

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

**Lens qr-lens-8-3 (2026-09-25, read-only pass on worktree @ e63639c): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / 5 notes.**

All nine claims verified (worktree-relative cites): 9 pages carry the full 5.5 anatomy
(when/not-for/usage-live-demo/theming/a11y + SR-protocol table/composition); API tables
LIVE via apiReferenceDoc → committed CEM (api-reference.ts:3; all 9 tags present in
custom-elements.json); mega-nav documents the extension (subLinks contract
mega-nav.stories.ts:90-103, desktop-only :76-82, «Разделы» default :102, v1
byte-stability :94-96). Registers: story renders from the committed generated TOKENS.md
(token-reference.stories.ts:677; sections TOKENS.md:135/145/61-62/66); §9 pointer resolves
(CONVENTIONS.md:62, correct slug + repo URL = git remote). Single source PROVEN BY CODE:
?raw import (token-reference:18; packages/tokens/package.json:31); the parser THROWS on a
missing section/note (registers.ts:35,85,160,167 — never renders empty); the drift test
runs the real file through the real parser inside `pnpm test` (vitest include) = CI
parity. Canvas-bg decision recorded at preview.ts:52-70 with the 4-point rationale.
Gotchas verbatim (cookie-banner:92-102, data-table:139-150 FR-12, combobox-search:107,
store-badges:92). Units re-run by the lens: 127/127 (CI=1), tsc clean — discrepancy
resolved: +5 tests exactly, nothing pre-existing touched (see Implementation Notes
truing). Visual arithmetic confirmed: 20 all-new PNGs, 10 baseline stories; legs
1269 + 10×(visual+axe+reduced-motion ×2 themes) = 60 → 1329; visual.spec.ts needs NO
commit (generated from packages/docs/dist/index.json at runtime — tests/visual/stories.ts:10-12).
The two docs-chrome axe fixes are docs-layer only (page-scaffold.ts:66-73 preserves the
banner's frozen ::slotted text-secondary ruling; token-reference:106-111 the single
anchor); `git diff 6104850..e63639c --name-status` = ZERO files under packages/components/
+ packages/react/. Hygiene: no _bmad-output edits, no package.json/version changes, no
tags/push, lineage exact (one commit on base).

Notes + dispositions:
- **N1 (claim distortion: «fixed pre-existing failures» — nothing pre-existing failed)**
  → Implementation Notes TRUED above; no repo defect.
- **N2 (RU story display names vs the 5.5 letter «meta EN»)** → accepted: the 5.5-built
  domain itself is RU-display/EN-ids (theming-guide «Переключение темы» at base);
  baseline ids come from export names (`Page` → `--page-*`) — baseline-stable.
- **N3 (deferred-work canvas-bg entry left open by the executor — correctly, given the
  _bmad-output ban)** → orchestrator closed the ledger entry (decision annotation, this
  window).
- **N4 (one PRE-EXISTING hex in a base jsdoc comment, token-reference.stories.ts:216 —
  untouched by 8.3, tests green)** → recorded for future grep hygiene; no action this
  story.
- **N5 (the Registers delta/§9 paragraph is RU paraphrase + pointer; the VERBATIM half
  is the RULE column from colorNotes, drift-pinned by the test)** → accepted: the
  paraphrase is context, not a second rule source — the single-source requirement is
  met structurally.

Accepted deviation: cookie-banner's «В составе» honestly declines showcase pointers
(«в шоукейсах не участвует», cookie-banner:167-174) — the banner is genuinely absent
from the 6.5/7.4/7.5 clusters; the other 8 pages carry them.

**Orchestrator disposition: NO fix round — merged as-is (FAST-FORWARD e63639c).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor + lens re-run) | units 127/127 (CI=1), tsc clean, gen/gen:tokens clean, post-commit drift clean |
| Worktree visual (executor) | 1329/1329 ×2 on private port 6061; 20 baselines all-new (set git-status-verified); temp config deleted pre-commit |
| Merge | e63639c FAST-FORWARD into main (linear; no conflicts) |
| Main gates (8.3-merged) | build/test/lint/typecheck/gen/gen:tokens GREEN; post-commit gen-drift CLEAN |
| Main visual (combined 8.1+8.3) | 1355/1355 ×2 (8.2m each) on private port 6041 — every 8.3 leg has its worktree ×2 (1329) + the combined ×2; exit 0, deterministic |
| Spec closed | 2026-09-25 — see commits: e63639c (ff-merge), 256e5cf (8.1's baseline re-take), close commit |
