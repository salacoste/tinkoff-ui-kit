---
title: 'Story 17.5 — Release prep v1.4.0: ТЖ joins the train (recipe §11 + versions + CHANGELOG + HANDOFF; TAG = maintainer)'
type: 'feature'
created: '2026-09-29'
status: 'approved'
baseline_commit: 'TBD-at-execution (the 17.4 close-out head)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 17.5: "Versions bump across the six shippable packages (bank ×3 + ТЖ ×3) on one tag (OQ-10); CHANGELOG section; RELEASE.md «Релиз v1.4.0» recipe (fresh-clone consumer installs ТЖ ALONE and renders tj-cta — the Flow-A lockfile acceptance at release grade); the tag itself ONLY on the maintainer'"'"'s explicit sanction")'
  - '{project-root}/RELEASE.md §10 «Релиз v1.3.0» (THE MOLD — 10.1 pre-flight / 10.2 version+CHANGELOG / 10.3 tag / 10.4 fresh-consumer / 10.5 changelog draft / 10.6 fonts-legal / 10.7 non-execution proof; §11 mirrors it with measured v1.4.0 facts)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-14-2-verification-ledger-release-v1-3-0-prep.md (the story that authored §10 — its division "story executes prep, maintainer executes tag" is reused verbatim)'
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-tinkoff-ui-kit-2026-09-21/prd.md §8 OQ-10 ("the ТЖ packages ride the same monorepo git-tag train with their own CHANGELOG section. Independent tags only if the maintainer rules otherwise at ТЖ release prep")'
  - '{project-root}/packages/docs/src/tj/getting-started.stories.ts (the Flow-A install text — §11.4'"'"'s recipe must match it verbatim: pnpm add -w pillkit-tj-tokens pillkit-tj-components pillkit-tj-react --workspace, vite dedupe 3-liner, NO bank packages)'
  - '{project-root}/_bmad-output/implementation-artifacts/baseline-review-package.md ЧАСТЬ v1.4.0 (the batch-confirm gate §11.1 references — maintainer-ratified scope, 194 PNG-events register)'
  - '{project-root}/.playwright-cli/verify/tj-a11y-sweep/SR-RUNSHEET-v1.4.0.md (the live SR protocol §11.1 references — maintainer-side)'
  - '{project-root}/CHANGELOG.md ([Unreleased] head — converted to [1.4.0] by this story)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 sequencing 17.4 → 17.5) — do not modify unless renegotiated">

## Intent

**Problem:** epics-v5 lands the entire ТЖ family (15.1–17.4), but the
release train has no v1.4.0: bank packages sit at 1.3.0, ТЖ packages at
0.0.0 (pre-release scaffolding versions), CHANGELOG carries the window
only as `[Unreleased]`, RELEASE.md has no §11 recipe, and HANDOFF does
not close epics-v5. The maintainer has no single executable page for the
v1.4.0 release, and OQ-10's default (ТЖ rides the same git-tag train,
own CHANGELOG section) is recorded nowhere in the release docs.

**Approach:** the 14.2→§10 mold rerun for v1.4.0 — the story executes
everyTHING-EXCEPT-THE-TAG and writes the maintainer's recipe:

1. **RELEASE.md §11 «Релиз v1.4.0»** (7 subsections, RU, §10-mirror with
   measured v1.4.0 facts):
   - §11.1 pre-flight: CI green on the release-prep head (incl. the
     timeout forensics: 36593380779 cancelled ×3 at exactly ~30:20 by the
     old `timeout-minutes: 30` ceiling — suite grew to 2118 legs; raised
     30→60 in 202beb1, verdict run recorded by id); local gate chain;
     gen-drift check; visual suite ×2 (2118/2118 both, port-6007
     serialization); batch-confirm ЧАСТЬ v1.4.0 (maintainer gate — the
     package 17.4 assembled); SR-RUNSHEET-v1.4.0 live runs.
   - §11.2 version+CHANGELOG — EXECUTED BY THIS STORY (recorded as done,
     unlike §10.2 which was a maintainer step): six shippable manifests —
     bank ×3 `1.3.0 → 1.4.0`, ТЖ ×3 `0.0.0 → 1.4.0` (join-train per
     OQ-10 default; one tag, six packages, one version); root 0.1.0 and
     docs 0.0.0 stay outside the release contract (precedent §8.2/§9.2/
     §10.2). CEM manifests embed NO package version (verified: heads carry
     `schemaVersion: 1.0.0` only) → bumps are pixel/gen-clean.
   - §11.3 tag — MAINTAINER-ONLY, verbatim §10.3 mold (IRON RULE).
   - §11.4 fresh-consumer verification = **Flow-A at release grade**:
     clone `--branch v1.4.0`, consumer installs ТЖ ALONE
     (`pillkit-tj-tokens pillkit-tj-components pillkit-tj-react` → the ТЖ
     trio only, NO bank packages — the FR-17 disjointness IS the
     acceptance), renders `tj-cta` both themes via `data-tj-theme` +
     auto leg; vite `dedupe` 3-liner README-verbatim. Secondary leg: the
     bank consumer flow (v1.3.0 §10.4 mold) referenced — not re-run
     in-story (the tag does not exist yet; §11.4 is recipe-only until
     the maintainer's tag).
   - §11.5 changelog draft (EN) — the exact text this story lands in
     CHANGELOG.md (see task 2), kept in §11.5 as the historical record.
   - §11.6 fonts/legal — unchanged §10.6 reminder (Graphik/Charter
     licensed path, OQ-8 pins stand).
   - §11.7 what 17.4 already checked (quartet recap: gates at the 17.4
     head, ad-language 0, impeccable 297 exit 0, ledger 11 rows, package
     measured) + **PROOF OF NON-EXECUTION scoped to the TAG ONLY**
     (`git tag -l` without v1.4.0 at story close; npm never) — versions/
     CHANGELOG ARE executed by this story, so the §10.7-style proof
     narrows to the tag (explicitly worded so the narrowing is visible).
2. **Version bumps + CHANGELOG.md** (in-story, mirrors §11.2 record):
   six `package.json` version fields; CHANGELOG `[Unreleased]` →
   `[1.4.0] - <execution date>`, fresh empty `[Unreleased]` on top. The
   v1.4.0 section: **Added — ТЖ family** (10 components tj-* across
   reading/feed/community/chrome/article + the token layer dual-emit +
   generated React trio + docs section incl. token-reference/theming/
   patterns/API tables + 185-leg a11y/dark sweeps + ad-slot recipe
   pattern + SR-RUNSHEET) and **Internal** (bank inter-window: docs-nav
   regroup 43fb084 + mono-pin retakes 20d3796 + getting-started ТЖ
   paragraph 67b7fd9; CI timeout 30→60 202beb1 with the forensic
   one-liner; harness font pins 15.3; **Verification** — fidelity
   ledger 11 rows + ad-language audit 0 values + impeccable 297 files
   exit 0 + ЧАСТЬ v1.4.0 baseline package assembled). Numbers MEASURED
   from the 17.4 package/inventory — nothing typed from memory.
3. **HANDOFF close:** epics-v5 marked landed end-to-end (15.1 → 17.5);
   maintainer queue refreshed verbatim from the standing list (live
   VoiceOver/NVDA per SR-RUNSHEET-v1.4.0; iOS momentum-scroll; admin
   open-state captures; Graphik/Charter licenses; header-chip 36px
   re-measure FLAG; batch-confirm ЧАСТЬ v1.4.0; TAG v1.4.0 sanction).
4. **Gates at the release-prep head:** full local chain EXIT 0 +
   `pnpm gen` post-bump drift check (expected: none — versions don't
   feed generators) + CI green by run id; spec closed with honest
   Implementation Notes + Verification.

**The run STOPS before the tag: no `git tag`, ever, in this story. The
tag fires ONLY on the maintainer's explicit sanction (IRON RULE).**

## Boundaries & Constraints

**Always:** every §11 number MEASURED (suite PNG 544 + 25 per-component;
1267 unit; 2118 visual/axe legs — the 17.4 package's counts, re-cited
not re-measured unless the close-out head moved them); §11.4 shell
commands COPY-RUN (the recipe must be executable verbatim: workspace
yaml, exact `pnpm add` lines, dedupe block); CHANGELOG text EN, story/
docs content RU where rendered; conventional commits EN by explicit
pathspec; the version-bump commit lands BEFORE the recipe references it
(recipe cites its own head).

**Never:** NO `git tag`; NO npm commands; no baseline edits (bumps are
pixel-clean — verified no version renders in any story); no edits to
`packages/*/custom-elements.json` or generated wrappers beyond what
`pnpm gen` itself produces (expected: none); no reopening settled
stories; ТЖ versions do NOT take an independent tag scheme (OQ-10
default stands — independent tags are a maintainer ruling, recorded in
§11.3 as the one alternative); the executor of the version bump is the
ORCHESTRATOR (release files are orchestrator-owned; no subagent edits
RELEASE.md/CHANGELOG/package manifests).

## Tasks & Acceptance

1. **RELEASE.md §11** (docs). AC: 7 subsections mirroring §10; §11.1
   cites the timeout forensic + verdict run id; §11.2 records the
   executed bumps (six manifests, before→after values); §11.3 verbatim
   maintainer-only; §11.4 Flow-A shell is copy-run and matches
   getting-started verbatim (install lines + dedupe + NO bank packages);
   §11.5 = the landed CHANGELOG text; §11.7 proof scoped to the tag with
   the narrowing worded explicitly.
2. **Versions + CHANGELOG** (release files). AC: six manifests at 1.4.0;
   `[1.4.0] - <date>` + fresh `[Unreleased]`; ТЖ section + Internal with
   measured numbers; `pnpm gen` after bump = zero diff; grep proves no
   story/test reads the version fields.
3. **HANDOFF** (docs). AC: epics-v5 closed; queue = the standing
   maintainer list, nothing dropped, nothing invented.
4. **Ledger** (spec). AC: Change Log + Verification honest; CI verdict
   by run id only after it exists; close-out stamps written AFTER the
   verdict per the standing rule.

</frozen-after-approval>
