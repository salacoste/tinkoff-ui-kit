# Impeccable kit-wide deep pass — BOTH trees (Story 17.4, 2026-09-29)

**Standard (SM-1/FR-9, unchanged since 5.6/8.4/11.3/14.2):** headless
design detector over ALL kit sources with zero blockers; CI contract
`impeccable detect` — exit 0/1/2. This run: tree at `58d979e` (the 17.3
head; the only uncommitted diff vs main is this story's verification files).
Post-verification CI round (the 36617540273 axe findings — links moved off
muted notes on the 5 pattern pages): the detector re-ran scoped over the 4
edited story files at the fix head — **exit 0**; the full-tree counts above
are unchanged by a 4-file markup move (no rule classes touched).

## The run

- Engine: `.claude/skills/impeccable/scripts/impeccable` (the same engine
  behind the PostToolUse/Stop hooks; the Stop-hook deep sweep has run over
  every UI edit of the 15.x–17.x stories, incl. the 16.5 CI gate round).
- Scope — **BOTH trees** for the first time (the 17.4 mandate): bank
  `packages/tokens/src packages/components/src packages/react/src
  packages/docs/src packages/docs/.storybook` + ТЖ
  `packages/tj-tokens/src packages/tj-components/src packages/tj-react/src`
  — **297 files** (`*.ts *.tsx *.css *.js *.mjs *.html`), 14.2's 209 + 88
  = the ТЖ family sources (10 component dirs' ts/css.ts/stories/tests,
  overlays, patterns, api-reference, tj-tokens src+scripts, tj-react
  src+generated wrappers, docs/src/tj story files). No other source file
  entered or left the bank trees this cycle.

```sh
find packages/tokens/src packages/components/src packages/react/src \
      packages/docs/src packages/docs/.storybook packages/tj-tokens/src \
      packages/tj-components/src packages/tj-react/src -type f \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.js' \
         -o -name '*.mjs' -o -name '*.html' \) | sort \
  | xargs .claude/skills/impeccable/scripts/impeccable detect
```

- **Result: exit 0, zero findings, zero warnings** (empty output;
  2026-09-29, tree at the 17.4 head).

## Can-fail self-check (reproduced this story, /tmp)

| Probe | Input | Result |
|---|---|---|
| Violation injection | `/tmp/impeccable-probe-174.css` — `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)` | **exit 2**, blocker named (`line 1: [bounce-easing] … Bounce and elastic easing feel dated and tacky`) |
| Control | `/tmp/impeccable-control-174.css` — `color: #333` | exit 0 |

(The gate's live bite on THIS cycle's code is separately on record: 16.5's
CI run 36530021981 RED on the header bar animation — fixed via the
sanctioned `grid-template-rows` channel, e945221 → GREEN.)

## The ONE sanctioned ignore — unchanged

`.impeccable/config.json` → `detector.ignoreValues`: bounce-easing /
`cubic-bezier(0.35, 1.3, 0.25, 1)` (value-scoped, the reference's
expressive entrance curve). `ignoreRules: []`, `ignoreFiles: []`.
Ratified by the maintainer 2026-09-23 (RELEASE.md §0) — not in any queue.

## Deep sweep beyond the detector (the 8.4 classes, re-run over BOTH trees)

| Class | Method | Result |
|---|---|---|
| TODO/FIXME/HACK/XXX in shipped sources + tests | grep over 8 roots + `tests/` | **0 hits** |
| console/debugger residue | grep over 8 roots | **3 `console.log`** — the same v2 docs demo event handlers (combobox-search/filter-chips/pagination stories; the sanctioned demo pattern). **0 in the ТЖ trees; 0 additions since v1.3.0.** The 15 runtime `console.warn` remain the kit's sanctioned error channel — out of scope by design (the 8.4 N4 wording) |
| Dead code / orphan files | ТЖ non-test/non-story .ts sources referenced | 0 orphans — 10 component modules + overlays helper + patterns + api-reference all shipped + imported (docs index / stories / CEM); generated wrappers regen-gated |
| Commented-out code | pattern `^\s*//\s*(const\|let\|import\|if\|for\|return)` | **4 hits, ALL prose continuations in comments** — the same false-positive class as 8.4/11.3/14.2: bank `segmented-radio.test.ts:294`, `data-table.test.ts:249` + ТЖ `tj-rubric-header.ts:65`, `tj-composer.test.ts:220`; 0 real |
| Stale prose numbers (the 5.6 lesson) | targeted sweep of living ТЖ surfaces | **0 stale**: getting-started «все 10 компонентов tj-*» = exactly 10 dirs; sweep headers «68-row» = exactly 68 registry rows each (a11y + dark); component-search = 16 ТЖ rows; frozen history sections carry point-in-time figures by design |
| Evidence-path validity | every `.playwright-cli/(verify\|captures*)/…` pointer in packages/ + tests/ → fs check | **54 unique pointers, all resolve.** 7 regex-level misses = the known false-positive class verbatim (brace-notation lists, `<component>` placeholder, markdown `</code>` tails) — all 7 underlying paths verified present |
| css.ts jsdoc-header consistency | the FR-1/AD-3 convention over the 10 ТЖ sheets (bank 27 already clean at 14.2) | **10/10** — 9 lead with the standard formula («tokens only, zero theme branches»); `tj-composer.css.ts` leads with its two-part anatomy note («tokens ONLY; every structural non-token value carries its FLAG inline») — the same sanctioned variant shape as the bank's 7 derived two-sheet surfaces |

**Verdict: zero blockers, zero fixes needed.** The audit was able to fail
(injection probe exits 2; this cycle's own CI round + the 17.3 axe finding
are the standing proof the wider gate set bites).
