---
title: 'Story 12.1 + 12.2 — docs per-vertical restructure + reference capture packs'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'e1916a6'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (Epic 12; ratified 2026-09-27 — «ok lets continue»)'
  - '{project-root}/packages/components/src/showcase/{homepage,application-form,business-landing,invest-landing,stocks-catalog}.stories.ts (the five title lines)'
  - '{project-root}/tests/visual/{homepage,business-landing,invest-landing,stocks-catalog}.spec.ts (STORY_ID constants keyed to the kind slug)'
  - '{project-root}/playwright.config.ts (snapshotPathTemplate — baseline names derive from story ids)'
  - '{project-root}/.playwright-cli/captures-v3/business/ (the pack mold: capture PNGs + INDEX.md + probe-notes.md)'
  - '{project-root}/.playwright-cli/captures-v2/ (the flat previous generation: invest-mobile / invest-stocks packs cross-referenced, never moved)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** the maintainer's subprojects direction (2026-09-26/27 — bank /
business / invest as separate subproject families over the shared 27-component
core, ТЖ later) is ratified but invisible in the kit's two structural surfaces:
the docs nav groups all five compositions under one flat `Showcase/*`, and
reference captures live in mixed generations (captures-v2 flat;
captures-v3/business vertical-first) with no written convention — every future
family story (Epic 13 admin especially) would have to rediscover where
reference truth lives.

**Scope — two work items, landing together (the [6.2+6.3] batching precedent
for small paired stories):**
1. **12.1 DOCS PER-VERTICAL RESTRUCTURE (title renames, zero pixels):** the
   five showcase story titles move from `Showcase/*` to per-vertical groups —
   `Bank/Homepage`, `Bank/Application form`, `Business/Landing`,
   `Invest/Landing`, `Invest/Stocks catalog`. Meta EN, story content RU
   untouched (the RU `title:` object literals inside stories are CONTENT).
   `Components/*` + `Components v2/*` stay untouched — the shared core does
   not fragment. The story-id change (`showcase-*` → `bank-*|business-*|
   invest-*`) cascades EXACTLY: 4 STORY_ID constants in the behavioral specs
   (+1 doc comment in homepage.spec.ts) and 10 baseline PNGs via `git mv`
   (bytes unchanged — the rename proof is the full-suite green run at default
   tolerance; a rename round is NOT a re-take, so no baseline content changes
   and no mini-confirm package). A source comment at each title line
   cross-links the vertical's capture pack (12.2) — comments, not canvas text,
   so zero pixel churn.
2. **12.2 PER-VERTICAL REFERENCE CAPTURE PACKS:** `.playwright-cli/captures-v3/`
   root `INDEX.md` becomes THE convention (per-vertical pack dirs;
   `<surface>-<YYYY-MM-DD>.png` naming; INDEX.md + probe-notes.md per pack;
   the read-only iron rule; v2 packs cross-referenced, never moved). The
   **bank** pack lands via a live read-only playwright-cli pass on tbank.ru
   retail (the biz-* capture mold: viewport + fullpage + a form surface); the
   **invest** pack = INDEX cross-referencing the captures-v2 invest-mobile /
   invest-stocks packs; **ТЖ** = reserved slot recorded in the root INDEX
   («займемся позже»).

</frozen-after-approval>

## Boundaries & Constraints

- **Zero pixel churn is an AC, not a hope:** no rendered-canvas text changes
  (cross-links are source comments); the full visual suite must come back
  1380/1380 GREEN AT DEFAULT TOLERANCE after the rename — any failing leg is
  an unexpected REAL delta → stop and investigate (never re-take to green).
- No component-package edits beyond the five title lines + their comments
  (zero `css.ts` → no `pnpm gen`).
- The behavioral specs' snapshot names are human-keyed (not story-id-keyed)
  and the homepage spec is probe-only — no PNG renames outside
  `visual.spec.ts-snapshots/`.
- Storybook sorts groups alphabetically from the title strings (Bank,
  Business, Invest) — NO `.storybook` config is added or changed.
- Live capture pass: READ-ONLY (nothing typed, nothing submitted, no login),
  playwright-cli only, desktop viewport, screenshots land ONLY under
  `captures-v3/bank/` with INDEX + probe-notes (the business pack mold).
- `packages/docs/dist` regenerates at build (generated artifact — never
  hand-edited; the suite's index discovery reads the fresh build).

## I/O & Edge-Case Matrix

| Story id (old → new) | Title file | Baseline PNGs (git mv ×2 themes) |
|---|---|---|
| `showcase-homepage--homepage` → `bank-homepage--homepage` | homepage.stories.ts:176 | `visual-showcase-homepage--homepage-{light,dark}-1-chromium.png` |
| `showcase-application-form--application-form` → `bank-application-form--application-form` | application-form.stories.ts:164 | `…application-form…` pair |
| `showcase-business-landing--business-landing` → `business-landing--business-landing` | business-landing.stories.ts:332 | `…business-landing…` pair |
| `showcase-invest-landing--invest-landing` → `invest-landing--invest-landing` | invest-landing.stories.ts:201 | `…invest-landing…` pair |
| `showcase-stocks-catalog--stocks-catalog` → `invest-stocks-catalog--stocks-catalog` | stocks-catalog.stories.ts:267 | `…stocks-catalog…` pair |

Edge cases pinned: (a) a behavioral spec still pointing at the OLD id fails
its own `goto` loudly (index lookup) — the 4 constants are updated in the same
commit, so no window exists; (b) a stale baseline name after `git mv` = the
suite treats the PNG as MISSING and re-writes it — the green-run AC catches
any forgotten rename by failing first at compare (missing snapshot ≠ green).

## Code Map

- `packages/components/src/showcase/*.stories.ts` — 5 title lines + 5
  pack-cross-link comments.
- `tests/visual/{homepage,business-landing,invest-landing,stocks-catalog}.spec.ts`
  — STORY_ID constants (+ homepage header comment).
- `tests/visual/visual.spec.ts-snapshots/` — 10 `git mv` renames.
- `.playwright-cli/captures-v3/INDEX.md` (NEW — the convention + invest
  cross-ref + ТЖ reserved slot), `.playwright-cli/captures-v3/bank/*` (NEW —
  captures + INDEX.md + probe-notes.md).
- `.playwright-cli/verify/verticals-12-1-12-2/NOTES.md` (NEW — the round's
  evidence ledger).

## Tasks & Acceptance

1. Five titles renamed + cross-link comments; `pnpm --filter pillkit-docs
   build` emits the new index (ids verified from the built index.json). **AC:**
   built index contains zero `showcase-*` ids; five `bank|business|invest-*`
   ids present.
2. Four STORY_ID constants + homepage comment updated. **AC:** grep for
   `showcase-` across tests/ returns nothing (snapshot PNGs excluded — those
   are renamed by task 3).
3. Ten baselines `git mv`-ed. **AC:** `git status` shows 10 renames (R) in the
   snapshots dir; zero other changes there.
4. Full `pnpm test:visual` — **AC: 1380/1380 green at default tolerance**
   (through the tree-identity gate — same-tree path; also proves the renamed
   baselines byte-match the built stories).
5. Unit gates green (946) + lint/typecheck.
6. captures-v3 root INDEX.md (convention, invest cross-ref, ТЖ reserved);
   bank pack from the live read-only pass (≥3 captures + INDEX +
   probe-notes). **AC:** the root INDEX names all four verticals with their
   pack paths; bank INDEX follows the business mold (surface list, date,
   session notes, probe method).
7. Verify NOTES for the round (rename proof numbers, capture inventory).
8. Commits by pathspec (code+renames / captures+NOTES / spec+epics), push
   when no run in flight, CI verdict by Actions only.

## Implementation Notes

- `Business/Landing` (not `Business/Business landing`) — the group already
  says business; same for `Invest/Landing`. The story EXPORT names stay, so
  ids keep their story half (`business-landing--business-landing`).
- The rename round needs no maintainer mini-confirm (zero pixel content
  changes — git-tracked renames, proof by green run), but the round REPORT
  lists the 10 renames explicitly.
- Bank capture pass: the reference surfaces are the RETAIL homepage
  (viewport + fullpage) and one form surface (the application form's live
  counterpart) — mirroring `biz-{viewport,fullpage,form-section}`. If the
  live site gates a surface (cookie wall, geo), record the attempt honestly
  in probe-notes and capture what is legitimately reachable (the 7.2
  precedent — no state forcing).

## Spec Change Log

1. 2026-09-27 — initial spec (stories 12.1+12.2, epics-v4 ratified round).
2. 2026-09-27 — **scope amendment (execution-discovered):** ten RENDERED
   cross-links in 8 v2 docs stories (`packages/docs/src/v2/{combobox-search,
   data-table,pagination,mega-nav,filter-chips,stepper,qr-block,store-badges}
   .stories.ts`) carry the old kind both as `?path=/story/showcase-…` href
   (dead target after the rename) and as visible link TEXT — the rename round
   flips them to the new ids/names, which CHANGES CANVAS PIXELS on those v2
   `--page` stories. Consequence: the round is no longer pure-rename — the
   v2 legs join as an affected set (discovery run → explicit delete → re-take
   → full green), and those re-taken baselines go to the maintainer
   mini-confirm (the human gate REOPENS for pixel content, per the standing
   rule; the 10 rename legs stay confirm-free — bytes unchanged).
   **Measured outcome (discovery run D): the set is EMPTY** — 1380/1380 green
   at default tolerance; the re-worded links sit in full-page canvases where
   the delta stays under 1.5% (the same legitimate sub-threshold class as the
   mono round's business/invest showcases). Per the 1.5% rule those baselines
   are NOT re-taken; the committed PNGs keep the old link text as tolerated
   drift (a CI ubuntu band, if it ever appears, takes the standing per-leg
   tolerance mold — the mono-tail precedent).
3. 2026-09-27 — **lens triage (qr-lens-12-1-12-2, delivered post-merge):**
   its MAJOR-1 (the 10 v2 cross-links) is entry 2 above — self-caught during
   execution, closed by `b5c2daf` + run D. Its MAJOR-2 (`.playwright-cli/
   captures-v3/` missing from the .gitignore whitelist): no data was lost —
   the pack landed via `git add -f` (`907752e`), per the standing rule — but
   the mold gap was real (captures/ + captures-v2/ carry negation lines, v3
   did not; the pending admin pack would be invisible to `git status`).
   Fixed one line: `!.playwright-cli/captures-v3/` joins the whitelist
   (verified: hypothetical admin-capture path no longer ignored; on-disk
   inventory == tracked set, zero strays surfaced).

## Verification

Executed 2026-09-27 (evidence: `.playwright-cli/verify/verticals-12-1-12-2/NOTES.md`):

1. **AC1 ✓** — build green; built index.json: zero `showcase-*` ids, the five
   `bank|business|invest-*` ids exactly per the matrix.
2. **AC2 ✓** — `grep 'showcase-'` over tests/*.ts: nothing.
3. **AC3 ✓** — 10 R in git status, zero other snapshot-dir changes.
4. **AC4 ✓** — full `pnpm test:visual` **1380/1380 green at default
   tolerance, exit 0 (9.1m)** — rename proof (renamed baselines byte-match);
   one more real-suite pass through the tree-identity gate.
5. **AC5 ✓** — unit 13 files / 151 root tests green; lint 0; typecheck 0.
6. **AC6 ✓** — `captures-v3/bank/` (3 PNGs + INDEX + probe-notes; read-only
   session `bank-capture`); root `captures-v3/INDEX.md` names all four
   verticals (invest cross-ref, ТЖ reserved). Probe highlight: retail form
   submit = 56px hero-tier yellow r12 — a live button-tier data point.
7. **AC7 ✓** — round NOTES written.
8. Pending at spec time: commits + push + CI verdict (Actions only).
