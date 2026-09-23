---
title: 'Story 5.7 — Publish PREP: MIT, semver, changelog, unofficial labeling (the maintainer gate is NEVER crossed)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'f0b2e6f1c0e0f0f4e08a5f1a3d5c2f3e6a9b7c8d'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-11/SM-6 — a consumer must be able to install from npm and render Button from the README example; the kit needs MIT + semver + changelog + unofficial labeling on every published surface. Everything up to (but NOT including) the publish decision is this story's scope.

**Approach:** Prepare every release artifact: the MIT LICENSE (code-scoped, fonts explicitly NOT swept in), CHANGELOG seeded per semver discipline, READMEs (root + per-package) with a VERIFIED working Button example + disclaimer + font licensing, package metadata (descriptions, keywords, license fields, repository, engines, peer ranges), the api-reference.d.ts packaging decision from 5.5, the fresh-consumer SM-6 self-test recorded, and a maintainer RELEASE.md checklist (flip private → tag → publish → verify). `private: true` STAYS; no tags created; no npm commands run.

## Boundaries & Constraints

- **MIT scoping:** root LICENSE = MIT (code), with an explicit carve-out sentence pointing at `packages/tokens/fonts/LICENSE-FONTS.md` (Daytona fonts — © Monotype Imaging / © ParaType, separately licensed, NOT MIT). The tokens package SHIPS the font binaries — its package.json `license` field strategy is a RECORDED CHOICE (research npm/SPDX best practice for mixed-licensed payloads; e.g. "MIT" + NOTICE-style README section vs "SEE LICENSE IN" — pick, justify, surface for maintainer ratification with the publish gate).
- **Unofficial labeling EVERYWHERE published:** root README, per-package READMEs (pillkit-tokens/components/react; docs package stays private anyway), package.json descriptions, the repo-description string (recorded in RELEASE.md for the maintainer to apply on GitHub), Storybook (already has the banner — verify). NO T-Bank trademarks in published naming (pillkit-* + tk-* stand; verify no «Т-Банк»/«Tinkoff» strings in package names/descriptions/keywords — the study-project context lives in the disclaimer, worded as unofficial recreation, not affiliation).
- **README example MUST WORK:** the root README's quickstart is proven by the SM-6 self-test — a fresh consumer project created OUTSIDE the repo (tmp dir), workspace-linked per the documented recipe (build prerequisite included), renders `tk-button` via both the element and the React wrapper; evidence (transcript + screenshot via playwright-cli session) archived in `.playwright-cli/verify/sm6-self-test/`. The README text and the tested recipe must be IDENTICAL.
- **Semver/changelog:** CHANGELOG.md (Keep a Changelog format) seeded with the v1.0.0 entry summarizing Epics 1–5 (19 components, tokens light/dark, the overlay controller, the guards/harness — release-note register, not a commit dump); semver policy line (breaking only in majors, deprecations documented) in README or CONTRIBUTING-adjacent section.
- **Metadata sweep:** every package.json — description (RU or EN? EN for npm surface; docs language RU applies to Storybook content), keywords, license, repository, engines (node >=20 already), peer deps (react package: peer range covering React 19.x — verify against the 19.3.0 pin), `type: module`, exports map sanity (the api-reference.d.ts decision lands here: prefer files-exclusion over tsconfig-exclude so typechecking stays — implement and record).
- **RELEASE.md (maintainer checklist):** the exact steps: pre-flight (CI green at HEAD, gates, baseline batch confirmed per 5.6 package), the private→public flip per package, version decision (1.0.0 vs 1.0.0-rc.1 — RECOMMEND, maintainer decides), tag + `npm publish` commands (or release-it if configured — keep it plain npm), post-publish verification (fresh install renders Button), and the OQ-3 gate reminder (names final sign-off). RU.
- **Deferred-work triage:** walk deferred-work.md — resolve what 5.7 owns (LICENSE file entry closes; react peer range closes; mono font slot stays deferred with its revisit condition; api-reference.d.ts closes with the decision), update statuses honestly.
- No source/behavior changes to components; no new stories/baselines expected (README/LICENSE don't render in Storybook — if any docs story mentions version/licensing text, re-baseline per the delete+update flow).
- 5.5's N8 fold-in: the getting-started font wording («лицензии… принадлежащим мейнтейнеру») tightened so a consumer cannot misread it as THEIR redistribution grant — precise wording, license file remains the authority.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| LICENSE | root | MIT + fonts carve-out | fonts swept into MIT → BLOCKER |
| SM-6 self-test | fresh tmp consumer | Button renders (element + React), evidence archived | failure → fix recipe/README until true |
| CHANGELOG | v1.0.0 seed | epic-level summary, semver policy | — |
| Metadata | 4 package.json | complete npm surface, no trademarks | — |
| api-reference.d.ts | packaging decision | implemented (files-exclusion preferred) + recorded | — |
| RELEASE.md | maintainer steps | flip/tag/publish/verify + OQ-3 reminder | — |
| Trademark sweep | published strings | zero Т-Банк/Tinkoff in names/descriptions/keywords | hit → reword |
| deferred-work | triage | owned entries closed, rest keep conditions | — |

</frozen-after-approval>

## Code Map

- `packages/tokens/fonts/LICENSE-FONTS.md` -- the carve-out target; `packages/docs/src/getting-started.stories.ts` -- N8 wording
- `package.json` ×4 + root -- metadata sweep
- `.playwright-cli/verify/` evidence format; the 5.6 baseline-review-package (RELEASE.md references it as pre-flight)
- `deferred-work.md` -- triage (read + the single allowed append/edit of statuses — for THIS story the agent may edit statuses in place, it owns the triage)

## Tasks & Acceptance

- [x] LICENSE (MIT, fonts carve-out) + per-package license strategy recorded
- [x] CHANGELOG.md v1.0.0 seed + semver policy
- [x] READMEs (root + tokens/components/react): working quickstart, disclaimer, fonts, docs link
- [x] SM-6 self-test executed + evidence archived; README recipe == tested recipe
- [x] Metadata sweep + trademark sweep + api-reference.d.ts decision implemented
- [x] RELEASE.md (RU maintainer checklist) + N8 wording fix + deferred-work triage
- [x] Full gates (visual expected unchanged — verify)

**Acceptance Criteria:**
- Given a fresh consumer following the root README quickstart EXACTLY, when they render Button, then it renders — evidence archived (SM-6).
- Given every published surface (READMEs, descriptions, keywords, Storybook), when inspected, then the unofficial disclaimer is present and no T-Bank trademark appears in naming.
- Given RELEASE.md, when the maintainer follows it after his gates, then every step is executable without reading code; `private: true` STILL set in all packages at commit time; no tags exist.
- Given `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && pnpm gen:tokens && git diff --exit-code` (staged), exit 0.

## Implementation Notes

- Approved autonomously (standing delegation). Recorded choices: tokens-package license-field strategy, version recommendation, metadata language.
- HARD: no `npm publish`, no `npm access`, no version bump commits, no git tags, no `private` flip. The maintainer gate (OQ-3 final + publish) is HIS.

## Spec Change Log

- 2026-09-23 (executor) — **RECORDED CHOICE, tokens license field:** `"license": "SEE LICENSE IN LICENSE"` + package-local `packages/tokens/LICENSE` (code=MIT, fonts separately licensed per `fonts/LICENSE-FONTS.md`; both files verified in the tarball via `npm pack --dry-run`). npm's documented mechanism for non-SPDX split payloads; SPDX expressions misrepresent the split (`OR` would offer MIT for fonts, `AND` would claim conjunctive terms for the whole package). Alternative (`"MIT"` + README NOTICE) rejected: registry surface would claim MIT for a tarball shipping 7 proprietary font binaries. Surfaced for maintainer ratification — RELEASE.md §0.1.
- 2026-09-23 (executor) — **RECORDED CHOICE, version recommendation:** `1.0.0-rc.1` (RELEASE.md §0.2) — feature-complete kit, but the human gates (baseline batch confirmation, SR spot-checks, §0.1 ratification, bounce-easing) can still force changes; rc keeps 1.0.0 clean. Maintainer decides; the `1.0.0` path is documented too.
- 2026-09-23 (executor) — **SM-6 FINDING (fixed in-change):** the 5.5-documented install recipe FAILED verbatim on pnpm 11/12 — `pnpm add` at the consumer's workspace root aborts with `ERR_PNPM_ADDING_TO_ROOT`. Root cause: my-app is simultaneously workspace root and app (yaml lists `.`). Fixed in BOTH the root README quickstart and the getting-started story: every consumer `pnpm add` now carries `-w`. README recipe and tested recipe are identical; evidence in `.playwright-cli/verify/sm6-self-test/` (NOTES.md, render screenshot, a11y snapshot, console log, verbatim consumer sources).
- 2026-09-23 (executor) — **api-reference.d.ts decision implemented as files-exclusion:** `packages/components/package.json` files gains `"!dist/api-reference*"` — verified via `npm pack --dry-run` (api-reference.* absent from the tarball, 130 type files still ship, typecheck untouched). tsconfig-exclude rejected as instructed (would stop typechecking the stories that import the module).
- 2026-09-23 (executor) — **N8 fold-in:** getting-started font section reworded («договоры лицензируют МЕЙНТЕЙНЕРА и НЕ передаются вместе с пакетом; права потребителя определяет только LICENSE-FONTS.md…») — a consumer can no longer misread the maintainer's licenses as their redistribution grant. The pair `getting-started--page {light,dark}` re-baselined via delete+update (only PNGs touched); plus the same story carries the `-w` recipe fix.
- 2026-09-23 (executor) — **Metadata sweep:** react peer `19.3.0` → `^19.0.0` (covers 19.x incl. the 19.3.0 test pin); descriptions/keywords/repository/license across all 5 package.json (npm surface EN; repo README RU per OQ-4 register); root `LICENSE` (MIT © 2026 salacoste) with the fonts + vendored-transitions carve-outs; transitions.dev terms verified (transitions.dev/terms.html) and provenance headers added to all 32 `t-*.css`; trademark sweep green (only factual repo URLs + the root README disclaimer remain).
- 2026-09-23 (executor) — **deferred-work triage:** closed 3 (vendored LICENSE+headers; dark-flip runtime — 5.4 evidence; token-loading model — confirmed since 1.7), kept 6 with revisit conditions, recorded 2 previously homeless considerations (preview canvas bg from spec-5-4 triage #9; top-layer stacking exactness from spec-2-2 triage).
- 2026-09-23 (executor) — RELEASE.md (RU) added at root: pre-flight incl. the 5.6 baseline-review package reference, §0 ratification surface, private-flip + `workspace:*` rewrite warning for plain npm, publish/tag/post-install-verify commands, OQ-3 final sign-off, repo-description string. No npm commands executed, no tags, `private: true` intact everywhere.
- 2026-09-23 (executor, final-review patch round) — 2 MAJOR + 4 MINOR + 4 NOTE fixes: `packages/components/LICENSE` + `packages/react/LICENSE` added (both packages declared MIT but shipped no LICENSE file — the MIT inclusion condition was unmet; pack re-verified); RELEASE.md §5 now uses `@rc` dist-tags for the rc path (bare install of a prerelease-only package errors — `latest` points at nothing); CHANGELOG maintainer comment ref §3→§2; `transitions/_root.css` provenance header (the 33rd file — root LICENSE carve-out names the whole directory); root README font paragraph ported to the precise N8 sentence structure (agreements license the MAINTAINER, do not pass with the package; consumer rights defined ONLY by LICENSE-FONTS.md); 5.7 visual-run outcomes anchored in the spec Verification section; root package.json license → `SEE LICENSE IN LICENSE` (MIT-with-carve-outs; exact beats cosmetic); garbled closing paragraph removed from root LICENSE; RELEASE.md §6 gains the revert-`workspace:*`-after-publish line (version specifier would shadow the workspace link on next install); RELEASE.md §0.3 adds the vendored-transitions redistribution residual judgment to the ratification surface.

## Review Triage Log

Quick review (2026-09-23, the project's FINAL lens): 0 blockers / 2 MAJOR / 4 MINOR / 4 NOTE → FIX-THEN-SHIP; the review INDEPENDENTLY re-ran the tarball packs (all three), fetched the live transitions.dev terms, re-ran the trademark sweep, and verified git-state hard rules. All 10 items patched in the final round (per-item detail in the Spec Change Log's last entry):

1. **[MAJOR] components/react tarballs shipped no LICENSE** (MIT inclusion condition unmet) — both LICENSEs added, packs re-verified (136/50 files; api-reference still excluded).
2. **[MAJOR] RELEASE.md §5 broke on the rc path** (bare install of prerelease-only errors) — `@rc`-qualified installs + the why; 1.0.0 bare path as the alternative.
3–6. CHANGELOG §-ref (§3→§2); `_root.css` provenance header (33/33); root README font paragraph ported to the precise N8 structure; 5.7 visual outcomes anchored in Verification.
7–10. Root license field `SEE LICENSE IN LICENSE`; garbled LICENSE paragraph removed; §6 workspace:* revert line; §0.3 transitions ratification pointer.

Review-verified clean (independently, not trusted): root LICENSE dual carve-out unambiguous; ZERO transitions content in any tarball (so «never shipped» is factually true); tokens mixed-license pack correct incl. the `SEE LICENSE IN LICENSE` target; README recipe == SM-6-tested recipe step-for-step incl. the `-w` fix; trademark sweep green (only factual repo URLs + the allowed disclaimer register); hard rules intact (private ×5, 0 tags, HEAD unchanged through the whole story).

Post-patch verification: 644 unit + 921 visual (×2 by agent + orchestrator compare run); both generators drift-clean; 62 files staged (16 A / 46 M), zero unstaged residue. **Story 5.7 closes; the 38-story BMAD v1 plan is COMPLETE — remaining actions are maintainer gates only (RELEASE.md).**

## Design Notes

This story's product is TRUST paperwork: licensing that cannot mislead, a README that cannot fail, a release path the maintainer can walk blind. The SM-6 self-test is the story's proof — if the README recipe and the tested recipe diverge by one line, the story fails its own bar.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && pnpm gen:tokens && git diff --exit-code` -- all exit 0 (both generators staged)
- `pnpm test:visual` -- unchanged count (921) unless a story text changed (then re-taken per flow)
- SM-6: the archived self-test transcript + screenshot

**Run outcomes (5.7, 2026-09-23):** unit 644/644; visual — first full run
920 passed + 1 axe re-entrancy flake (`axe: components-link--api [light]`,
"Axe is already running" race in the iframe; story untouched by this story) →
isolated re-run green, second full run **921/921**; the only intentional
baseline movement is the re-baselined `getting-started--page {light,dark}`
pair (N8 + recipe fix), verified by `git status tests/visual/` showing exactly
those two PNGs modified.
