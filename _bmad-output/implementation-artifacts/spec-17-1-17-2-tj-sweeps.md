---
title: 'Story 17.1+17.2 — ТЖ a11y sweep + ТЖ dark sweep (extraction-verification)'
type: 'feature'
created: '2026-09-29'
status: 'draft'
baseline_commit: 'da6771f'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Stories 17.1/17.2 + Sequencing: "17.1+17.2 (batch)"; Port-6007 serialization — ТЖ stories join the ONE visual suite)'
  - '{project-root}/tests/visual/a11y-sweep.spec.ts (THE MOLD for 17.1 — SWEEP matrix / openStory / probeStop walk / ringFailures / deep-name scan with resolveName + insideKit)'
  - '{project-root}/tests/visual/dark-sweep.spec.ts (THE MOLD for 17.2 — PaintRecord fingerprint / slot-aware alpha-chain compositing / light-only leftovers / forced invariants / per-row single test, both themes inside)'
  - '{project-root}/packages/tj-tokens/tokens.css (--tj-color-focus-ring #8A8AE5 light / #828BBB dark; the 11 dark overrides; theme-invariant comments; the probe10 link pair #1414CC→#93A2FF)'
  - '{project-root}/packages/docs/.storybook/preview.ts (ONE toolbar toggle writes BOTH data-theme and data-tj-theme — buildStoryUrl(id, theme) drives ТЖ verbatim; the explicit attribute pins the ТЖ sheet so the harness never depends on the runner OS theme)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-15-2-tj-tokens.md (the dual-emit contract: [data-tj-theme="dark"] + prefers-color-scheme auto leg with :not([data-tj-theme="light"]); RESTRICTED_PAIRS)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-16-6-tj-article-pattern.md Implementation Notes (THE AXE COLLISION ruling: restricted inks NEVER render in kit stories — card meta rides authored-AA ink-300, page-ground rides ink-100; the walkthrough lessons: docs boot runtime writes data-tj-theme=light → native-dark legs strip the attribute POST-settle)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/METHOD.md + SR-RUNSHEET-v1.3.0.md (read-only: the method/ledger/runsheet molds this batch extends with v1.4.0)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 stories 17.1+17.2 batched) — do not modify unless renegotiated">

## Intent

**Problem:** the ТЖ family ships 10 components + 3 pattern compositions across 46 built stories, but the two verification engines that closed every prior cycle — the keyboard/ring/name/geometry sweep and the theme-flip paint audit — have never run on it. The ТЖ dark layer is also UNVERIFIED as an *extraction*: its 11 dark overrides were authored from the dark-home pixel census (15.2), and the dual-emit mechanism (attribute block + media-scoped auto leg) has never been proven to agree with itself.

**Approach — two new functional-only engine files in the ONE visual suite (no baselines, no screenshots; CI compare owns verdicts as ever):**

1. **`tests/visual/tj-a11y-sweep.spec.ts` — NEW (17.1, the 5.1/11.1 method on the ТЖ registry).** Duplicate-and-adapt the bank engine (the bank spec files stay BYTE-IDENTICAL — frozen CI-green engines are not refactored by a sweep story):
   - **TSWEEP matrix = EVERY ТЖ story id** (the epic says "every ТЖ story × both themes"; discovery list below is frozen coverage — 46 rows). Each row: `{ component, story, stops, minKitSurfaces, assertAllStops?, scanStory? }` with `stops` = EXACT tj-kit Tab-stop count and an inline derivation comment naming the story-source interactive set (the 5.1 "measured, not assumed" law — derived from story source analysis; the orchestrator validates numbers with a scoped run post-review and corrects via patch round, the 16.6 census-retune mold).
   - **CHECK 1 (walks, BOTH themes):** forward Tab walk with per-element ordinals until the cycle closes on a revisit; assert EXACT kit-stop count; Shift+Tab walk must revisit the same ordinal set. Kit classifier = host tag `tj-*` (the ad-slot-recipe row additionally counts `tk-*` hosts — the FR-21 boundary story legitimately hosts both families; comment it).
   - **CHECK 2 (ring, BOTH themes):** every kit stop carries the unified ring — 2px solid, offset 2px, color = `--tj-color-focus-ring` RESOLVED AT RUNTIME from the live document (light #8A8AE5 / dark #828BBB — never a hardcoded hex in the engine). **NO underline exceptions** for ТЖ: probe10 ruled links GET 2px rings (the reference names but under-applies --outline-focus; the kit ring is the improvement layer) — the exception array stays in the engine (mold parity) but ships EMPTY with a comment.
   - **CHECK 3 (deep names, light scan):** every visible interactive element (document + shadow trees, the SELECTOR mold) has a non-empty accessible name via the resolveName chain (aria-labelledby → aria-label → alt → title → label[for] → closest label → slot-assigned text).
   - **CHECK 5 (geometry, light scan):** clickable box ≥44×44. The 16.1 corrective-box precedent is legal (tj-cta = h30 pill inside a 44×44 clickable box — assert the CLICKABLE box, not the visual pill); §9 inline-prose anchors stay exempt (display-computed boundary, mechanized mold).
   - **Pattern rows** (`article-page--page-composition`, `tag-chip--pro-hero-pattern`, `post-card--community-pattern`, `ad-slot-recipe--recipe`): `assertAllStops: true` — recipe markup is deliberate surface, so story-chrome stops (wordmark, chips, engage buttons, demo toggles) get ring/name assertions too, not just `tj-*` hosts (the 16.6 walkthrough proved this layer manually; now it is pinned).
   - **SR state pins (the 17.1 SR deliverable, mechanized):** a `test.describe` block asserting computed role/state for the stateful surfaces at DOM level: composer fake-input = `<button type="button">` (button-not-input is the load-bearing 16.4 ruling); rail drawer `open` reflection + drawer-button aria-expanded; header theme control's RU announcement labels (unit-pinned already — pinned here at the computed-name level); news/post card inert-empty-href + external-rel rules; the pattern like-toggle `aria-pressed` flip. Live VoiceOver stays maintainer-side (METHOD.md §SR boundary).

2. **`tests/visual/tj-dark-sweep.spec.ts` — NEW (17.2, the 5.4 mold in EXTRACTION-VERIFICATION mode — the twist: ТЖ dark values are the REFERENCE'S OWN, so the sweep verifies extraction fidelity, not authored tonal rules).** Per ТЖ story (all 46 rows): collect the light + dark deep paint fingerprint (document + shadow trees + pseudos), then:
   - **STRUCTURE PARITY** — identical fingerprint sequence across themes (a branch = a render-level theme fork);
   - **AA TEXT PAIRS (dark)** — slot-aware alpha-chain compositing, ≥4.5:1 text / ≥3:1 large (≥24px, or ≥18.66px at ≥700) / placeholders ≥3 (the restricted ruling). **No restricted exemptions at DOM level:** the 16.6 axe-collision ruling means restricted inks NEVER render in kit stories — every DOM AA failure here is a REAL finding;
   - **LIGHT-ONLY LEFTOVERS** — a color that does not change in dark is a finding unless it is in the ТЖ legal-invariant set: the tag-chip purple family (16.2 theme-invariant by design, twin-pinned in unit tests — now pinned at computed-paint level) + constants the token sheet itself marks theme-invariant (derive the table from tokens.css comments; derivation notes inline);
   - **FORCED INVARIANTS (extraction fidelity)** — chip purple EXACT both themes; the link pair FLIPS with the exact reference values #1414CC→#93A2FF (values READ from the token sheet at runtime — the spec pins the flip, the sheet owns the literals); the CTA fill flips per its token; **failure protocol: a forced-invariant failure re-opens the DESIGN.md dark rows with measured evidence — extraction-verification mode means the reference wins and the kit conforms; NO silent authored retunes**;
   - **SHADOW COLLAPSE / BORDERS PRESENT** — ТЖ is FLAT by design (15.2: only overlay shadow exists), so the shadow leg asserts the near-empty inventory stays theme-consistent and overlay-only; borders keep width with a non-transparent resolved color;
   - **NATIVE-DARK PARITY LEG (NEW — the dual-emit proof):** for each story, `colorScheme: 'dark'` emulation + **`data-tj-theme` stripped POST-settle** (the 16.6 walkthrough lesson: the docs boot runtime writes `data-tj-theme=light` — stripping before settle races the boot write) → the full computed-color fingerprint must EQUAL the explicit-dark run's. Divergence = the 15.2 dual-emit generator bug (fix the MECHANISM, not values).

3. **SR-RUNSHEET-v1.4.0 draft + ledgers — orchestrator-owned artifacts** (the verify-dir read-only law for subagents): the executor delivers the SR state table + the v1.4.0 runsheet CONTENT (RU, the v1.3.0 mold: per-component anchors, expected computed names/roles/states, VO keystroke protocol, verdict cells) in its report; the orchestrator validates, then authors `.playwright-cli/verify/tj-a11y-sweep/{ledger.md,SR-RUNSHEET-v1.4.0.md}` and `.playwright-cli/verify/tj-dark-sweep/ledger.md` after the scoped runs.

**The frozen 46-row coverage set** (from the built docs index at da6771f): tj-prose {playground, species, composition, accessibility}, tj-link {playground, species, anchor-contract, accessibility}, tj-cta {playground, anatomy, anchor-contract, accessibility}, tj-rubric-header {playground, anatomy, accessibility}, tj-news-card {playground, anatomy, skeleton, accessibility}, tj-tag-chip {playground, anchor-contract, pro-hero-pattern, accessibility}, tj-composer {playground, anatomy, accessibility}, tj-post-card {playground, anatomy, community-pattern, accessibility}, tj-header {playground, anatomy, theme-contract, accessibility}, tj-rail {playground, anatomy, chrome-composition, drawer, accessibility}, tj-article-page {page-composition, anatomy, accessibility}, tj-ad-slot-recipe {recipe, accessibility}, tj-getting-started {page}.

## Boundaries & Constraints

**Always:**
- Bank spec files `tests/visual/a11y-sweep.spec.ts` / `dark-sweep.spec.ts` stay BYTE-IDENTICAL (duplicate-and-adapt; zero edits to frozen engines).
- Tokens resolved at runtime from the live document (`getComputedStyle` / `var()` resolution) — hex literals appear ONLY where the test pins the extraction pair itself, and even then as runtime-read comparisons.
- Deterministic: `waitForStorySettled` mold, no screenshots, no baseline minting, no `test:visual` runs by the executor (functional engines; the orchestrator runs the scoped validation on 6007 post-review — single owner).
- Gates: `pnpm test && pnpm lint && pnpm typecheck && pnpm build` — `&&`-chained, `set -o pipefail` when piped (PIPEFAIL GATE LAW).
- Real findings from the engines become TRIAGE entries first: component/story defects = orchestrator patch rounds ratified in Implementation Notes; extraction-fidelity failures = DESIGN.md re-open evidence (never silent retunes).

**Never:**
- NO package `src/` changes in the executor round (the roster closed at 16.5; sweeps are verification — if a defect is found, it is patched in a triage round with the finding recorded).
- NO edits to `_bmad-output/` or `.playwright-cli/` by the executor (verify-dir artifacts are orchestrator-authored post-review).
- NO npm/publish/tag/CI-workflow changes; no new deps; no new baselines.
- NO theme branching via OS preference in the a11y engine (explicit attribute via `globals=theme:dark` — the preview determinism law); the native preference appears ONLY in the 17.2 parity leg, under emulation, post-settle strip.

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Walk cycle | Tab ×N on any ТЖ story | kit stops recorded until first revisited ordinal; count == row pin | count mismatch message names story + expected/actual (the 5.1 deliberate-update contract) |
| Reverse walk | Shift+Tab after forward | revisits exactly the forward ordinal set | unseen ordinal = loud failure naming it |
| Ring check | focus-visible on kit stop | 2px solid offset-2px `--tj-color-focus-ring` (theme-resolved) | failure dumps all rings seen + computed token color |
| Pattern row stop | engage button / wordmark focused | asserted like kit stops (`assertAllStops`) — recipe chrome is deliberate surface | — |
| Boundary story | ad-slot-recipe walk | `tj-*` AND `tk-*` hosts counted; promo CTA ring rides `--tk-color-focus-ring` (bank layer, same toggle) | — |
| Skeleton story | news-card--skeleton walk/scan | stops pin reflects bones-only (no interactive in bones); scan finds zero unnamed interactives | — |
| Drawer story | rail--drawer at 1280 | story's own open-state surfaces measured; trap containment rides the modal mold if the demo renders open | open-state DOM absent → loud fail, not skip |
| Native-dark parity | colorScheme dark + post-settle attribute strip | fingerprint == explicit-dark fingerprint, every ТЖ story | divergence lists the differing node paths |
| Forced invariant | chip purple / link pair / CTA flip | chip EXACT; link flips to the sheet's dark value; CTA flips per token | failure = DESIGN.md re-open evidence entry, values quoted |
| Leftover | a color unchanged in dark | legal ONLY in the documented invariant set | finding names element + both computed colors |

## Code Map

- `tests/visual/tj-a11y-sweep.spec.ts` — NEW (17.1 engine + TSWEEP matrix + SR state pins)
- `tests/visual/tj-dark-sweep.spec.ts` — NEW (17.2 engine: parity / AA / leftovers / invariants / native-dark leg)
- `.playwright-cli/verify/tj-a11y-sweep/{ledger.md,SR-RUNSHEET-v1.4.0.md}` — NEW, ORCHESTRATOR-authored post-review
- `.playwright-cli/verify/tj-dark-sweep/ledger.md` — NEW, ORCHESTRATOR-authored post-review

## Tasks & Acceptance

**Execution:**
- [ ] tj-a11y-sweep engine: matrix ×46 with derivation comments, walks ×2 themes, ring/name/geometry legs, pattern assertAllStops rows, SR state pins
- [ ] tj-dark-sweep engine: parity / alpha-chain AA / leftovers / forced invariants / shadow+borders / native-dark parity leg, ×46
- [ ] reduced-motion + visual/axe coverage NOTE only (discovery already covers ТЖ — no work, recorded in ledger)
- [ ] full gates ×7 packages (`test → lint → typecheck → build`); NO test:visual locally

**Acceptance Criteria:**
- Given any of the 46 ТЖ stories, when the a11y engine walks it in either theme, then every kit stop is ringed with the theme-resolved `--tj-color-focus-ring` and the stop count equals the row pin — a changed interactive surface fails loudly demanding a deliberate matrix update.
- Given the pattern rows, when story-chrome stops are focused, then they carry rings and names too (assertAllStops) — recipe markup is verified surface, not bystander.
- Given the dark sweep on any story, when light and dark fingerprints are compared, then structure is identical, dark AA holds with zero restricted exemptions, and only the documented invariant set stays unchanged.
- Given the native-dark leg, when the OS prefers dark and `data-tj-theme` is stripped post-settle, then the rendered fingerprint equals the explicit-dark run's — the 15.2 dual-emit is proven self-consistent.
- Given a forced-invariant failure, then the finding is recorded as DESIGN.md re-open evidence with measured values — no silent token retune in this story.

## Design Notes

- **Extraction-verification semantics (the 17.2 twist):** the bank dark sweep enforced AUTHORED rules (yellow keeps ink, shadow collapse). The ТЖ sweep enforces the REFERENCE'S OWN extraction: the dark overrides came from the dark-home census, so invariants pin the extraction pair and failures are evidence against DESIGN.md rows — the direction of authority is inverted, and the failure protocol encodes it.
- **Why duplicate-and-adapt:** the bank engines are spec-frozen CI-green; a shared-core refactor would churn two gate files for zero behavioral gain. The ТЖ files mirror the family grammar (pillkit-tj-* mirrors bank packages the same way). Divergent bits are exactly the family facts: attribute, ring token, kit prefix, invariants, the native-dark leg, empty underline table.
- **Why rings replace underline exceptions:** the bank §9 exceptions encode the reference's underline-only focus on links; probe10 re-pointed ТЖ links onto the reference's own focus tokens and the kit's 2px ring IS the sanctioned improvement — so the ТЖ engine pins rings everywhere, exceptions array empty by design.
- **Sizing:** ≈46×2 walk tests + 46 scan + SR pins + 46 dark rows (per-row single test, both themes + native leg inside) ≈ +190 functional tests on the 1678-test suite; workers CI=1 already serializes; no screenshots keep per-test cost at settle+evaluate only.
- **The walkthrough already proved the flagship manually (16.6, 22/22)** — these engines pin that class of truth for ALL 46 stories mechanically, which is exactly what 17.1's "the 5.1/11.1 method" means.

## Verification

**Commands:**
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build` (executor, PIPEFAIL law)
- Orchestrator post-review: `pnpm build` (docs dist fresh) → scoped functional validation `pnpm test:visual --grep "tj-(a11y|dark)-sweep"` on the 6007 lane (scoped runs OMIT the `--`; NO baseline mint — engines are functional-only) → matrix-number corrections as patch rounds → push zero-in-flight → CI verdict via `gh run view --json conclusion` (never before the fact).
</frozen-after-approval>
