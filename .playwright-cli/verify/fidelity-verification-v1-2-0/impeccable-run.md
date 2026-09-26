# Impeccable kit-wide deep pass (Story 11.3, 2026-09-26)

**Standard (SM-1/FR-9, unchanged since 5.6/8.4):** headless design detector
over ALL kit sources with zero blockers; CI contract `impeccable detect` —
exit 0/1/2. This run: worktree at e693d40 (= origin/main, the 11.3 baseline;
the only diff vs main is this story's docs/verification files).

## The run

- Engine: `.claude/skills/impeccable/scripts/impeccable` (the same engine
  behind the PostToolUse/Stop hooks; the Stop-hook deep sweep has run over
  every UI edit of the 9.x–11.x stories).
- Scope: `packages/tokens/src packages/components/src packages/react/src
  packages/docs/src packages/docs/.storybook` — **207 files**
  (`*.ts *.tsx *.css *.js *.mjs *.html`), the 8.4 scope count exactly
  (no net source files entered or left the tree this window — the window's
  edits were in-place).

```sh
find packages/tokens/src packages/components/src packages/react/src \
      packages/docs/src packages/docs/.storybook -type f \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.js' \
         -o -name '*.mjs' -o -name '*.html' \) | sort \
  | xargs .claude/skills/impeccable/scripts/impeccable detect
```

- **Result: exit 0, zero findings, zero warnings** (empty output;
  2026-09-26, tree at the 11.3 prep head).

## Can-fail self-check (reproduced this story, /tmp)

| Probe | Input | Result |
|---|---|---|
| Violation injection | `/tmp/impeccable-probe-113.css` — `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)` | **exit 2**, blocker named (`line 3: [bounce-easing] … Bounce and elastic easing feel dated and tacky`) |
| Control | `/tmp/impeccable-control-113.css` — `color: #333` | exit 0 |

## The ONE sanctioned ignore — unchanged

`.impeccable/config.json` → `detector.ignoreValues`: bounce-easing /
`cubic-bezier(0.35, 1.3, 0.25, 1)` (value-scoped, the reference's expressive
entrance curve). `ignoreRules: []`, `ignoreFiles: []`. Ratified by the
maintainer 2026-09-23 (RELEASE.md §0) — not in any queue.

## Deep sweep beyond the detector (the 8.4 classes, re-run)

| Class | Method | Result |
|---|---|---|
| TODO/FIXME/HACK/XXX in shipped sources + tests | grep over all 5 roots + `tests/` | **0 hits** |
| console/debugger residue | grep over 5 roots | **3 `console.log`** — the same v2 docs demo event handlers (combobox-search/filter-chips/pagination stories; the sanctioned demo pattern, not debug). **0 additions since v1.1.0** (diff-scoped grep). The 15 runtime `console.warn` remain the kit's sanctioned error channel — out of scope by design (the 8.4 N4 wording) |
| Dead code / orphan files | every non-test/non-story .ts in components/src referenced | 0 orphans (no file left/entered the tree this window; the window's new code all ships) |
| Commented-out code | pattern `^\s*//\s*(const\|let\|import\|if\|for\|return)` | 2 hits, both prose continuations in test comments (`segmented-radio.test.ts:294`, `data-table.test.ts:249`) — the same false-positive class as 8.4; 0 real |
| Stale prose numbers (the 5.6 lesson) | targeted sweep: stepper badge pairing, radius ≈32, unit/visual counts in living docs | 0 stale. `stepper.stories.ts:251` mentions tint-cream-raised ONLY as history («До 9.1 бейдж шел на кремовом…» — correct); radius-32 prose absent from sources (the refutation lives in tokens-9-1 + deferred-work); README/docs carry no 1368/942 claims |
| Evidence-path validity | every `.playwright-cli/(verify\|captures*)/…` pointer in packages/ + tests/ → fs check | all resolve. 5 regex-level misses = the 8.4 false-positive class verbatim: 4 × trailing sentence period (`NOTES.md.`, `ledger.md.`), 1 × brace notation (`pattern-steps-open-account{,-detail}.png`, stepper.css.ts:7) — all 6 underlying paths exist |
| css.ts jsdoc-header consistency | the FR-1/AD-3 convention over 27 sheets | 27/27 — 20 lead with «tokens only (FR-1), zero theme branches (AD-3)»; the 7 derived two-sheet surfaces (select/modal/tooltip/toast/combobox-search/cookie-banner/filter-chips) carry «zero theme branches» with their two-sheet anatomy note leading — same shape as 8.4's verdict |

**Verdict: zero blockers, zero fixes needed.** The audit was able to fail
(injection probe exits 2; the v1 yellow audit's F1/F2 and the 5.6 stale-number
MAJOR are the standing proof the classes bite).
