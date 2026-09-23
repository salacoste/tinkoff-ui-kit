# Epic 5 Context: Release readiness (verified quality + published package)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Close the v1 loop: full-kit verification sweeps (a11y 19/19 in three groups, dark 19/19, fidelity ledger 16/16 + pattern-consistency 3/3), docs completion (getting-started, token reference, theming guide, docs-site states, RU), discipline audits (kit-wide impeccable, yellow-usage), and release preparation (MIT/semver/changelog/unofficial labeling). Epic 5 ends at TWO maintainer gates that the autonomous run PREPARES but never crosses: the batched provisional-baseline confirmation (5.6) and the publish decision itself (5.7 — OQ-3 names stand as pillkit-*; nothing is published without the maintainer).

## Stories

- Story 5.1: A11y sweep I — method definition + primitives, indicators, overlays groups
- Story 5.2: A11y sweep II — forms group + 2.8 walkthrough re-verification
- Story 5.3: A11y sweep III — navigation and cards groups + 3.10 composition re-verification
- Story 5.4: Dark mode sweep — token-only restyling verified 19/19, dark-tint refinement
- Story 5.5: Docs completion — reference, theming guide, getting started, docs-site states
- Story 5.6: Fidelity and discipline verification — 16/16 + 3/3 ledger, kit-wide audits, maintainer baseline batch gate
- Story 5.7: Publish the package — npm, MIT, semver, unofficial labeling (MAINTAINER GATE)

## Requirements & Constraints

- Sweep method (5.1 defines, 5.2/5.3 apply): keyboard matrix per EXPERIENCE Interaction Primitives (Tab/Shift-Tab, arrows, Space, Esc, Home/End per component), visible unified focus rings, correct roles/names/states, contrast per the AA-override table in BOTH themes, interactive targets ≥44×44px effective, reduced-motion zero-animation via playwright-cli media emulation (`set-reduced-motion`).
- **SR spot-checks (VoiceOver + NVDA named in the ACs):** the autonomous run RECORDS THE PROTOCOL and DEFERS EXECUTION to the maintainer (the provisional-baseline precedent) — this harness must not hijack the user's screen reader, and NVDA is Windows-only. Each group's story docs get the spot-check protocol (scripted steps + what to listen for + expected announcements); deferred-work.md carries the execution entry. Surface this deviation loudly.
- 5.4 dark sweep: `data-theme="dark"` flip across every story — 19/19 render correctly (no illegible pairs, no light-only assumptions); a repo check confirms ZERO component-level theme branches (all theming via `--tk-*`); dark tints refined against the derivation rule (L≈16–20%, hue kept; charcoal invariant) if fidelity checks flag first-pass values — DESIGN.md + token regeneration in the same change if values move (the 3.6 closure mold).
- 5.5 docs: 19/19 component pages complete (live default, all variants, interactive states, theming demo, a11y notes incl. keyboard checklist, API tables from CEM), token reference light/dark side by side, theming guide (switching, per-token overrides, dark pairing rules), getting-started (install, theming, font slot incl. Daytona licensing note, Inter recommendation); docs-site states per EXPERIENCE (cold-load skeleton, empty-search state «Ничего не найдено…»); voice/microcopy per the table (calm, verbs, «1 331 ₽», localization-ready slots); unofficial disclaimer on every docs surface; docs language RU (OQ-4), story meta EN for baseline stability.
- 5.6: 16/16 reference-grounded baselines with archived tbank.ru side-by-sides (they exist — verify the ledger maps every one); 3/3 derived pattern-consistency records; impeccable kit-wide zero blockers; yellow-discipline audit (UX-DR17); all DESIGN.md [ASSUMPTION] flags resolved (mint/beige done at 3.6; xxl/xl radii + dark-tint first pass verified here); **maintainer batched baseline gate PREPARED** — a review package listing every provisional baseline with its side-by-side, ready for confirm/re-take.
- 5.7: MIT + semver + changelog per release; README example renders Button in a fresh consumer project (self-test recorded); disclaimer in README/repo description/docs/package metadata; `pnpm gen && git diff --exit-code` clean + CI green at the release tag. **Publishing does not proceed without the maintainer** — prepare everything up to (but not including) `npm publish` / the final version-number decision.
- NFR-1 legal: unofficial recreation only; no T-Bank trademarks in published naming; fonts stay under LICENSE-FONTS.md (separately licensed — the LICENSE file must NOT sweep them into MIT).

## Technical Decisions

- Verification artifacts follow the UX-DR14 mold: `.playwright-cli/verify/<sweep>/` with METHOD.md + per-group ledgers + evidence; story-doc updates land in the component suites' stories.ts (RU content, EN meta).
- Mechanized where possible: the reduced-motion zero-animation check becomes a discover-every-story Playwright spec (`document.getAnimations()` empty under `reduce` after settle) — a real CI guard, not a one-shot note; contrast checks extend the existing mechanized AA table; geometry (44px) assertions follow the button compact precedent; keyboard coverage is a ledger mapping each component × matrix cell → the asserting test (gap → fix the gap, not the ledger).
- Existing substrate to reuse: tests/contrast.test.ts (26 pairs), tests/visual suite (472 baselines, axe both themes built in), per-component specs (open-state, geometry, keyboard), homepage.spec.ts viewport matrix, form walkthrough driver (31/31).
- Dark-tint refinement (if flagged): DESIGN.md frontmatter edit → `pnpm gen:tokens` → committed artifacts → probes pixel-identical proof (the 3.6 closure discipline).
- The 5.6 maintainer review package: `_bmad-output/implementation-artifacts/baseline-review-package.md` + the archived side-by-sides index — everything the maintainer needs to confirm or re-take in one sitting.

## Cross-Story Dependencies

- 5.1 defines the method 5.2/5.3 apply — one spec can batch all three (they share the method doc + ledger format); 5.4 needs 5.1–5.3 findings closed (contrast issues found in dark would collide); 5.5 needs component a11y notes final; 5.6 needs everything; 5.7 needs 5.6.
- Suggested batching: [5.1+5.2+5.3] → [5.4] → [5.5] → [5.6] → [5.7-prep]. Each batch: spec → executor subagent → review lens → patches → orchestrator gates → commit/push → docs updated.
