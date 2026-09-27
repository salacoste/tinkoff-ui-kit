# Impeccable kit-wide deep pass (Story 14.2, 2026-09-28)

**Standard (SM-1/FR-9, unchanged since 5.6/8.4/11.3):** headless design
detector over ALL kit sources with zero blockers; CI contract `impeccable
detect` — exit 0/1/2. This run: worktree at `80a3604` (= origin/main after
the spec-14.2 push; the only diff vs main is this story's
docs/verification files).

## The run

- Engine: `.claude/skills/impeccable/scripts/impeccable` (the same engine
  behind the PostToolUse/Stop hooks; the Stop-hook deep sweep has run over
  every UI edit of the 12.x–14.x stories).
- Scope: `packages/tokens/src packages/components/src packages/react/src
  packages/docs/src packages/docs/.storybook` — **209 files**
  (`*.ts *.tsx *.css *.js *.mjs *.html`), 11.3's 207 + 2 = the two NEW
  v2 pattern-page sources (`console-chrome.stories.ts`,
  `data-surfaces.stories.ts`, 13.2/13.3). No other source file entered or
  left the tree this window.

```sh
find packages/tokens/src packages/components/src packages/react/src \
      packages/docs/src packages/docs/.storybook -type f \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.js' \
         -o -name '*.mjs' -o -name '*.html' \) | sort \
  | xargs .claude/skills/impeccable/scripts/impeccable detect
```

- **Result: exit 0, zero findings, zero warnings** (empty output;
  2026-09-28, tree at the 14.2 prep head).

## Can-fail self-check (reproduced this story, /tmp)

| Probe | Input | Result |
|---|---|---|
| Violation injection | `/tmp/impeccable-probe-142.css` — `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)` | **exit 2**, blocker named (`line 1: [bounce-easing] … Bounce and elastic easing feel dated and tacky`) |
| Control | `/tmp/impeccable-control-142.css` — `color: #333` | exit 0 |

## The ONE sanctioned ignore — unchanged

`.impeccable/config.json` → `detector.ignoreValues`: bounce-easing /
`cubic-bezier(0.35, 1.3, 0.25, 1)` (value-scoped, the reference's expressive
entrance curve). `ignoreRules: []`, `ignoreFiles: []`. Ratified by the
maintainer 2026-09-23 (RELEASE.md §0) — not in any queue.

## Deep sweep beyond the detector (the 8.4 classes, re-run)

| Class | Method | Result |
|---|---|---|
| TODO/FIXME/HACK/XXX in shipped sources + tests | grep over all 5 roots + `tests/` | **0 hits** |
| console/debugger residue | grep over 5 roots | **3 `console.log`** — the same v2 docs demo event handlers (combobox-search/filter-chips/pagination stories; the sanctioned demo pattern, not debug). **0 additions since v1.2.0** (diff-scoped grep). The 15 runtime `console.warn` remain the kit's sanctioned error channel — out of scope by design (the 8.4 N4 wording) |
| Dead code / orphan files | every non-test/non-story .ts in components/src referenced | 0 orphans (the window's net new sources are the 2 pattern pages, both shipped + imported by the docs index) |
| Commented-out code | pattern `^\s*//\s*(const\|let\|import\|if\|for\|return)` | 6 hits, ALL prose continuations in comments (`segmented-radio.test.ts:294`, `toast-queue.ts:144`, `progress-bar.test.ts:280`, `link.test.ts:179`, `modal.ts:248`, `data-table.test.ts:249`) — the same false-positive class as 8.4/11.3; 0 real |
| Stale prose numbers (the 5.6 lesson) | targeted sweep: component counts, unit/visual totals, fixed-geometry claims in living docs | 0 stale in living surfaces: getting-started's «27 компонентов (19 v1 + 8 v2)» is the 14.1 correction; the 1368/943/414 figures live only in FROZEN release/handoff history sections (point-in-time records — correct by design); HANDOFF's living gates line updates in this story's close |
| Evidence-path validity | every `.playwright-cli/(verify\|captures*)/…` pointer in packages/ + tests/ → fs check | 48 unique pointers checked, all resolve. 4 regex-level misses = the known false-positive class verbatim: brace-notation lists (`verify/{mega-nav,stepper}/`-style in HANDOFF/spec prose) + the `{,-detail}` pair — all underlying paths verified present (2 PNGs + 7 dirs) |
| css.ts jsdoc-header consistency | the FR-1/AD-3 convention over 27 sheets | 27/27 — 20 lead with «tokens only (FR-1), zero theme branches (AD-3)»; the 7 derived two-sheet surfaces carry «zero theme branches» with their two-sheet anatomy note leading — same shape as 8.4/11.3 |

**Verdict: zero blockers, zero fixes needed.** The audit was able to fail
(injection probe exits 2; the v1 yellow audit's F1/F2 and the 5.6 stale-number
MAJOR are the standing proof the classes bite).
