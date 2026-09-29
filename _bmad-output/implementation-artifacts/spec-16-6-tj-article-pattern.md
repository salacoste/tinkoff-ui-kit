---
title: 'Story 16.6 — ТЖ article composition + ad-slot recipe + live walkthrough'
type: 'feature'
created: '2026-09-29'
status: 'draft'
baseline_commit: 'cd52924'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 16.6 — the roster CLOSES at 16.5: this is a PATTERN story, zero new package API)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (Reading surface contract verbatim: composition order, hyphenation, in-body links, THE ENGAGEMENT BAR contract; Flow C — consumer mixes an ad into an editorial feed)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (species rows; the editorial-vs-ad language split)'
  - '{project-root}/.playwright-cli/captures-v3/tj/probe-notes.md (Article section: H1 45/700/50, column w764, Charter lead 27/35 body 21/30, H2 38/700/45 Graphik, pull-quote 35/400/50, time-meta 15/400 #808080; Accent locator: yellow/navy ONLY inside native-ad promo cards 760×350/760×220 r25)'
  - '{project-root}/packages/tj-components/src/tj-prose/ + tj-header/ + tj-rail/ (the composed components — 16.1 + 16.5)'
  - '{project-root}/packages/components/src/promo-card/ (the Flow-C ad interior — DOCS-side composition only, FR-17)'
  - '{project-root}/packages/tj-components/src/tj-tag-chip/tj-tag-chip.stories.ts (the /pro/ hero PATTERN mold — pattern stories are documented recipes, not API)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 story 16.6) — do not modify unless renegotiated">

## Intent

**Problem:** every ТЖ roster component ships (16.1–16.5), but the kit's flagship surface — the ARTICLE PAGE — exists only as scattered stories; the FR-17/FR-21 editorial-vs-ad boundary (Flow C) is contractual prose with zero demonstration; and the reading flow has never been proven live (the UJ mold every prior epic closed on).

**Approach — two pattern stories + a mechanized imports guard + the live walkthrough (orchestrator-owned):**

1. **`packages/tj-components/src/patterns/article-page.stories.ts`** — NEW (the only package-side file; the /pro/-hero pattern mold: a documented RECIPE story, NOT API — the roster closed at 16.5, zero new components/props/events):
   - The composed article page at 1280: `tj-header` (wordmark/actions slots = synthetic consumer art) + the two-column body — `tj-rail` (rubric nav, `current-value` on the article's rubric) + the reading column in `tj-prose`:
     - slotted `p[slot=lead]` (Charter 27/35), the article flow (body 21/30, in-body `h2` 38/700/45, `blockquote` 35/400/50 — all the 16.1 species, the pattern FEEDS content), in-body links as `<tj-link>` (the two-surface link law);
     - the H1 + BYLINE row as pattern markup ABOVE the prose (the reference order: H1 45/700/50 → byline avatar/author/time-meta/read-time): H1 rides the prose's own heading species via a slotted flow heading? NO — the 16.1 prose cascade covers p/h2/blockquote/a ONLY (H1 45/700 is the ARTICLE pattern's own line, pattern-level css with tokens; time-meta 15/400 in the restricted time-ink, the 16.2 ruling);
     - **the ENGAGEMENT BAR as pattern markup** (the EXPERIENCE contract verbatim, native semantics): a row of quiet buttons — like = `aria-pressed` TOGGLE (emit-only: the kit pattern stores NOTHING — the demo wires a local in-memory handler; no counts stored, counts are CONSUMER data), comment/share/bookmark = plain buttons whose accessible names announce identity («Комментировать», «Поделиться», «В закладки»); h40 row, meta-ink glyphs (decorative, aria-hidden), 2px focus rings; NEVER traps focus;
     - **the sticky improvement is OPT-IN and OFF by default** (the EXPERIENCE improvement clause): a pattern note + a demo block showing the scroll-back compact rail (150ms token, reduced-motion instant) implemented as a story-level `scroll` listener toggling a class — recipe prose marks it improvement-not-reference;
     - **skeleton state** (the walkthrough demand): a pattern-level reading skeleton — bones as meta-ink alpha on the card ground (the 16.2 skeleton law: NEVER bank gray-200), toggled by a demo control (the driver targets it);
     - `data-tj-theme` flip works on the whole canvas (the header's theme control is IN the pattern — clicking it re-themes the article; the walkthrough drives it).
   - Story list (RU content, EN meta titles): the page itself + an anatomy/contract note + the FR-22 accessibility section (keyboard checklist, SR protocol notes, reduced-motion rows) — the family mold.
   - Canvas chrome consumes `var(--tj-*)` tokens ONLY.

2. **The imports guard (mechanized — epics: "the lockfile/imports assert it"):** `tests/tj-article-pattern-imports.test.ts` — NEW root test: the article-page stories file's import lines may reference ONLY (a) relative `../tj-*` modules, (b) `lit`, (c) types — assert ZERO imports of `pillkit-components`/`../../components`/any bank path, ZERO `--tk-*` reads in its cssText (belt). Trip-probe style: the test fails loudly naming the offending line.

3. **`packages/docs/src/tj/ad-slot-recipe.stories.ts`** — NEW (DOCS = the sole sanctioned both-families composition point, 15.1): the Flow-C recipe — the ТЖ ad slot as GRID GEOMETRY (a pattern-level slot region in the article flow's aside rail: 760-wide cells per the accent locator, or the rail column's ad cell at 290 — the reference's own two promo sizes documented), with the bank `tk-promo-card` composed INSIDE as any consumer would (real import, real props):
   - FR-21 split made visible: bank-yellow lives INSIDE the promo's own frame; the surrounding ТЖ surface keeps `--tj-*`; recipe prose states the boundary contract (zero token leakage either direction — the 15.2 cross-family var() isolation guard is the mechanical net);
   - the empty/ad-free variant (graceful slot collapse — no phantom boxes).

4. **Live walkthrough (the UJ mold — ORCHESTRATOR-owned, NOT executor work):** `.playwright-cli/verify/tj-article/walkthrough.mjs` + NOTES.md — keyboard pass over the built article pattern: tab topology (header chips → theme → CTA → rail rows → in-body links → engagement buttons in order), both themes incl. the native-dark flip (`data-tj-theme` cycle AND the prefers-color-scheme auto leg), the skeleton toggle, focus rings visible at every stop, Esc does nothing outside the drawer. The executor delivers the story states the driver needs; the orchestrator authors/runs the driver post-review and records verdicts in Implementation Notes (live VO/NVDA stay maintainer-side, METHOD.md §SR boundary).

## Boundaries & Constraints

**Always:**
- Pattern = recipe documentation: every interactive piece uses NATIVE semantics (button/aria-pressed/anchor) — no kit state channels invented; the engagement bar stores nothing (emit-only; the demo handler is story-local).
- Tokens only in canvas chrome (`var(--tj-*)`); every structural number the pattern introduces (h40 engagement row, byline gaps, ad-cell geometry) carries a FLAG comment naming the probe source or authored pick.
- FR-22 sections in both stories; RU story content SYNTHETIC, zero PII (names/avatars = placeholders, the bank store-badges mold).
- Gates: `pnpm test` → `pnpm lint` → `pnpm typecheck` → `pnpm build`, `&&`-chained, `set -o pipefail` when piped. NO local `test:visual` in ANY mode (orchestrator mints baselines post-review — port 6007 single-owner).

**Never:**
- NO new package components, props, events, tokens, deps — the roster closed at 16.5 (this story composes what exists; anything missing becomes a recorded deviation, not an invention).
- NO bank imports anywhere under `packages/tj-*` (FR-17 — the ad recipe composes in `packages/docs/` ONLY); no `--tk-*` reads in ТЖ files; no yellow/navy values in ТЖ pattern chrome (FR-21 — the promo's yellow is the CARD's own).
- No `_bmad-output/` / `.playwright-cli/` edits by the executor (the walkthrough driver is orchestrator-authored).
- No npm/publish/version/CI-workflow changes.

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Like toggle | click/Enter on the like button | `aria-pressed` flips true/false; label unchanged («Нравится»); the demo handler may show a local count — kit markup stores nothing | rapid toggling never double-announces (one button, one announcement) |
| Identity buttons | focus/click comment/share/bookmark | accessible names announce identity; buttons are quiet (no pressed state — they are actions, not toggles) | href-less share = button, never a dead link |
| Sticky rail (opt-in) | scroll down then back up (demo block armed) | compact engagement rail appears over 150ms; reduced-motion instant | OFF by default; never traps focus; never covers the in-body link being read (position pin in recipe prose) |
| Theme flip | click the header theme control ×3 | canvas cycles auto→light→dark→auto; native-dark leg renders when the attribute is absent and the OS prefers dark | out-of-band attribute writes respected (stateless control, 16.5) |
| Skeleton | demo control on | reading column shows meta-ink-alpha bones on card ground; no layout shift on swap (same boxes) | bones never animate (the no-shimmer law, 16.2) |
| Ad slot filled | tk-promo-card composed (docs story) | promo keeps bank tokens inside its frame; the ТЖ aside keeps `--tj-*`; no var() crosses | ad-free variant: slot collapses, no phantom box |
| Imports guard | a bank path sneaks into the article story | tests/tj-article-pattern-imports.test.ts RED naming the line | — |

## Code Map

- `packages/tj-components/src/patterns/article-page.stories.ts` — NEW (the ТЖ-only composed article page)
- `packages/docs/src/tj/ad-slot-recipe.stories.ts` — NEW (Flow C, consumer-side bank-promo composition)
- `tests/tj-article-pattern-imports.test.ts` — NEW (the mechanized ТЖ-only assertion)
- `.playwright-cli/verify/tj-article/{walkthrough.mjs,NOTES.md}` — NEW, ORCHESTRATOR-authored post-review
- `packages/tj-components/README.md` — the pattern pointer line (no component list change)

## Tasks & Acceptance

**Execution:**
- [ ] article-page pattern story (header + rail + prose flow + H1/byline + engagement bar recipe + skeleton + FR-22)
- [ ] ad-slot recipe story in docs (tk-promo-card consumer-side, FR-21 split, empty variant)
- [ ] imports guard test (ТЖ-only lines, loud attribution) green
- [ ] README pattern pointer; full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

**Acceptance Criteria:**
- Given the article-page story file, when the imports guard runs, then every import resolves to a ТЖ module or `lit` — a bank path or `--tk-*` read fails the test naming the offending line.
- Given the engagement bar, when the like button is activated, then `aria-pressed` flips and NO kit-level state or count persists beyond the story-local demo handler; comment/share/bookmark announce identity and carry no pressed semantics.
- Given the docs ad-slot story, when `tk-promo-card` composes inside the ТЖ aside, then the promo's yellow/navy stay inside its own frame and the ТЖ surface consumes only `--tj-*` (the 15.2 cross-family var() isolation guard stays green).
- Given the theme control in the composed header, when the walkthrough cycles it (orchestrator, post-review), then the whole article re-themes per the 16.5 contract incl. the native-dark auto leg.

## Design Notes

- **Pattern, not API — the load-bearing ruling:** the epics roster closed at 16.5; the engagement bar and the ad slot are RECIPES (documented, copy-paste-able compositions) exactly like the 16.3 /pro/ hero. If real consumers need them as components, that is an epics-v6 conversation, recorded here as the trigger.
- **Emit-only engagement:** the reference stores like-state server-side; the kit pattern demonstrates the SEMANTIC contract (aria-pressed toggle + identity buttons) and deliberately holds no state — the anti-16.4 stance (composer was the sanctioned stateful exception; nothing else joins it).
- **The sticky improvement is OFF by default** because the reference shows no such rail (observed-baseline: engagement sits below the fold); the improvement layer ships as an opt-in recipe block, per the project's copy-and-improve grammar.
- **H1/byline above the prose:** tj-prose's cascade (16.1) deliberately covers flow content only — the H1 + byline row is page chrome, so it rides the pattern canvas with tokens (H1 45/700/50 per probe-notes; time-meta in the restricted time-ink). Feeding it INTO prose would widen a frozen component's species set — a deviation trap, avoided.
- **The walkthrough is orchestrator-owned** because the browser is orchestrator-exclusive (the standing session law); the executor's obligation is deterministic story states (skeleton control, theme cycle via the real header control), which the driver then targets.

## Verification

**Commands:**
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build` — `&&` between pnpm commands, `set -o pipefail` when piped (the PIPEFAIL GATE LAW, both clauses)
- `pnpm test` includes the NEW imports guard (tests/tj-article-pattern-imports.test.ts)
- Visual/baseline work is ORCHESTRATOR-owned post-review: `pnpm test:visual:update` mints the provisional pattern baselines (existing byte-stable; scoped runs OMIT the `--`); CI compare owns the verdict; the live walkthrough runs against the built docs (the 2.8 mold) with verdicts recorded here.
</frozen-after-approval>

## Implementation Notes

_(orchestrator fills: executor deviations, triage, lens verdicts, patch rounds, gates, side-by-side, baselines, walkthrough, CI)_
