---
title: 'Story 15.2 — ТЖ token layer: generator second input + native-dark contract + AA pins'
type: 'feature'
created: '2026-09-28'
status: 'open'
baseline_commit: ''
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 15.2)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (THE token source — radii/shadows sections carry the 2026-09-28 measured amendment)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (the auto/light/dark no-flash theme contract)'
  - '{project-root}/.playwright-cli/verify/tj-tokens/NOTES.md (probe forensics — the values are settled, do not re-derive)'
  - '{project-root}/packages/tokens/scripts/generate.mjs (the mechanism to parameterize)'
  - '{project-root}/ad4-matrix.mjs (the root shared-tooling precedent this spec follows)'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="planning-sanctioned intent (maintainer «ok lets continue» 2026-09-28; epics-v5 story 15.2; probes + DESIGN.md amendment already landed by the orchestrator) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ family has no token table — `pillkit-tj-tokens` ships only the
`--tj-scaffold-placeholder` marker. No ТЖ component story can start until `--tj-*`
tokens exist, and the bank generator is a single-input mechanism (hardcoded bank
DESIGN.md path, `--tk-` prefixes, `data-theme` attribute, bank semantic tables).

**Approach:** Land the ТЖ token layer by making the generation mechanism take TWO
inputs (AD-3 v5): extract the kit-agnostic core to the repo ROOT (the
`ad4-matrix.mjs` precedent — root is shared tooling, not a package, so no FR-17
edge and the ТЖ packages stay installable alone), parameterize per-kit config
(prefix, theme attribute, semantic tables, dark-emission mode), regenerate the
bank artifacts BYTE-IDENTICALLY, and generate the ТЖ layer (light + native-dark
auto contract) from the amended DESIGN.md. Mechanize the AA truth (gold
asymmetry, restricted inks) and scope the value guards to the ТЖ family.

**Pre-work ALREADY LANDED (orchestrator, this story's first AC, 2026-09-28):**
live pixel-probes on t-j.ru (4 surfaces + purple scan + rail tiles —
`.playwright-cli/verify/tj-tokens/`), DESIGN.md amended with MEASURED radii
(card 25 / panel 30 / chip 20 / control-sm 15 / cta 5 / cta-promo 10 /
control-xs 8 / input 4 / icon-tile 7 / badge 50%) and the FLAT-shadow verdict
(only `overlay: 0 2px 8px rgba(0,0,0,.1)` exists; card lifts deleted).

## Boundaries & Constraints

**Always:**
- ONE mechanism, TWO inputs: a root-level shared core (parse/validate/value
  grammar/{block.ref} resolution/render CSS+TS+MD/drift mold), consumed by BOTH
  `packages/tokens/scripts/generate.mjs` (bank config) and
  `packages/tj-tokens/scripts/generate.mjs` (ТЖ config). The bank CLI's OUTPUT
  must be byte-identical after the refactor (`git diff -- packages/tokens` empty;
  `check:tokens-drift` green).
- Per-kit config carries: DESIGN.md path, token prefix (`--tk-`/`--tj-`), theme
  attribute (`data-theme`/`data-tj-theme`), light semantic emission mode (bank:
  scale+aliases; ТЖ: direct keys), the dark-override table, and the
  dark-emission mode (bank: manual `[data-theme="dark"]` only; ТЖ: native-auto —
  see below).
- **ТЖ dark mapping (authored here; amend DESIGN.md colors FIRST if a gap
  surfaces, never in code):** raw-key overrides `page←dark-page`,
  `card←dark-card`, `divider←dark-divider`, `cta-fill←dark-cta-fill`,
  `cta-ink←dark-cta-ink`; aliases introduced per the bank
  mold: `--tj-color-link` (light source `gold-ink`, dark source `dark-link` —
  THE gold asymmetry mechanized) and `--tj-color-engage` (light source
  `ink-reference-meta`, dark source `dark-engage`). EVERY `dark-*` key must be
  consumed or generation aborts (the bank invariant, second instance).
- **Dark completeness pass BEFORE generating:** enumerate every emitted light
  semantic; any with no dark value (headline ink on dark cards, time-meta dark,
  divider-strong dark) gets its `dark-*` source authored into DESIGN.md from the
  recon evidence (`.playwright-cli/captures-v3/tj/probe-notes.md` dark battery;
  INDEX.md PNGs) — extraction, not invention. Flag each addition in the DESIGN.md
  comment; a value the recon cannot ground → `[ASSUMPTION]`-flagged in
  TOKENS.md, never silent.
- **Native-dark contract (EXPERIENCE.md):** ТЖ default = `auto`: light layer on
  `:host,:root`; dark overrides emitted BOTH on
  `:host([data-tj-theme="dark"]),:root[data-tj-theme="dark"]` AND inside
  `@media (prefers-color-scheme: dark)` scoped `:root:not([data-tj-theme="light"])`
  (the no-flash attribute contract: `data-tj-theme="light"` forces light under a
  dark OS). The generator emits this; a committed test pins the selector shape.
- TS types (`src/tokens.ts`) + `src/TOKENS.md` listing (source block, AA notes
  derived from `aa-annotations`, dark override table) — the bank mold.
- **AA mechanization (the 9.2 machine-truth mold, ТЖ instance):** a root test
  (`tests/tj-contrast.test.ts`) computes 3-decimal ratios from the GENERATED
  maps and pins: ink-100/card 21.000, ink-300/card 5.096, gold-ink/card 5.310,
  dark-meta/dark-card 10.21x (exact from DESIGN.md table), gold/dark-card
  5.860 (the asymmetry's dark leg), ink-200/cta-fill 21.000,
  dark-cta-ink/dark-cta-fill ≥19; RESTRICTED pairs (ink-reference-meta 2.44,
  ink-reference-time 3.95, dark-engage 3.28) are asserted to FAIL AA **and** to
  carry their `aa-annotations` entry (status: verified + story re-anchored
  '15.2'). Exact-set exhaustiveness guard (bank 1.3 mold).
- **Guards scoped:** `tests/consumed-tokens.test.ts` gains the ТЖ family
  (`--tj-*` prefix, declared-in-tokens.css check; no consumers exist yet — the
  guard is wired and green-empty); `zero-hardcoded` needs NO change (ТЖ sources
  already scanned); aa-annotation `story:` fields re-anchor `ux-tj`→`15.2`.
- Root scripts: `gen:tokens` stays bank; add `gen:tokens:tj`
  (`pnpm --filter pillkit-tj-tokens gen:tokens`) and a drift check for the ТЖ
  artifacts (committed == fresh render); CI joins the existing gen/drift legs
  only where they enumerate (no new workflow).
- Docs: the TJ/Getting-started stub's «таблица пока не существует» note updates
  to the real token count (prose only; the full reference page is 17.3).

**Never:**
- No bank token VALUE churn: `packages/tokens` byte-identical (drift + git diff
  proof). Shared-core refactor touches `packages/tokens/scripts/generate.mjs`
  ONLY as a config-ization; behavior change = failure.
- No ТЖ→bank import edge (FR-17) — the shared core lives at ROOT (outside
  `packages/`), the ТЖ CLI never imports from `packages/tokens/**`.
- No hand-authored token values in `packages/tj-tokens/src/tokens.css` — the
  scaffold marker file is REPLACED wholesale by the generator's output
  (generation is the single source; AD-3).
- No new radii/shadows/colors beyond the amended DESIGN.md; if a value feels
  wrong, amend DESIGN.md with evidence first (the frozen probe values are
  settled — challenging them requires NEW live-probe forensics).
- No npm/publish/version changes; no `_bmad/`, `.claude/settings.json`,
  `.playwright-cli/captures-v3/` modifications (verify/ additions from THIS
  story's own runs are fine; captures are read-only).
- No font files (15.3 owns fonts — stacks render as DESIGN.md strings).

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bank regeneration after refactor | unchanged bank DESIGN.md | `git diff -- packages/tokens` EMPTY; `check:tokens-drift` exit 0 | Any byte drift = story failure |
| ТЖ generation | amended ТЖ DESIGN.md | `--tj-*` on `:host,:root` + dark dual emission + tokens.ts + TOKENS.md; scaffold marker GONE | Missing ref/cycle/unconsumed dark-* → abort naming the key |
| OS dark, no attribute | `prefers-color-scheme: dark` | dark values apply (the auto leg) | n/a |
| OS dark + forced light | `data-tj-theme="light"` | light values hold (no-flash contract) | Committed selector-shape test |
| Gold asymmetry | generated maps | `--tj-color-link` = gold-ink (light) / gold (dark) | Contrast test pins both legs |
| Restricted ink misuse | any consumer uses meta inks for essential text | out of scope here (component stories enforce); the TEST asserts the annotation exists | n/a |
| Drift | DESIGN.md edited, no regen | `check:tokens-drift:tj` exit 1 | Loud, names the artifact |
| FR-17 | tj CLI importing bank package | impossible by layout (root core) | AD-4 layers still armed |

## Code Map

- `packages/tokens/scripts/generate.mjs` — the mechanism; extract
  `scripts/token-gen/core.mjs` (root) + thin config'd CLIs per kit
- `_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md` —
  the ТЖ input (ALREADY amended; may gain dark-completeness keys this story)
- `packages/tj-tokens/src/tokens.css|tokens.ts` + `TOKENS.md` — generation
  targets (marker file replaced)
- `tests/tokens-drift.test.ts` (bank mold), NEW `tests/tj-contrast.test.ts`,
  `tests/consumed-tokens.test.ts` (ТЖ scoping), `package.json` (root scripts),
  `.github/workflows/ci.yml` (only if legs enumerate)
- `packages/docs/src/tj/getting-started.stories.ts` — status prose update

## Tasks & Acceptance

**Execution:**
- [ ] Root shared core extracted; bank generate.mjs config'd onto it; bank
      artifacts byte-identical (drift + empty git diff proofs)
- [ ] DESIGN.md dark-completeness pass (missing dark-* keys authored from recon
      evidence; flags/comments per Always-list)
- [ ] ТЖ config + CLI; generation lands tokens.css (light + auto/dark dual
      emission), tokens.ts, TOKENS.md; scaffold marker replaced
- [ ] `tests/tj-contrast.test.ts` — 3-decimal pins incl. the gold asymmetry and
      the restricted-ink annotations; exact-set exhaustiveness
- [ ] consumed-tokens ТЖ scoping; aa-annotations story re-anchor
- [ ] Root scripts + drift check + CI enumeration (if any); docs stub prose
- [ ] Full gate chain ×7 packages + `pnpm gen:tokens` AND `gen:tokens:tj`
      (order: DESIGN.md → gen → gen:tokens → tests)

**Acceptance Criteria:**
- Given the refactor, when the bank generator runs, then `packages/tokens` is
  byte-identical (git diff empty + drift green).
- Given the ТЖ DESIGN.md, when `gen:tokens:tj` runs, then `--tj-*` tokens exist
  for every non-dark color key + link/engage aliases, the dark layer applies
  BOTH via `[data-tj-theme="dark"]` and the `prefers-color-scheme` auto leg
  (light-forcing attribute respected), and every `dark-*` source key is consumed.
- Given the generated maps, when the contrast test runs, then every AA pair pins
  at 3 decimals and every restricted pair FAILS with its annotation present.
- Given any `--tj-*` consumer reference, when consumed-tokens runs, then
  undeclared names fail (green-empty at this story: no consumers yet).
- Given the story diff, when reviewed, then no bank token value changed and no
  hand-authored ТЖ token exists outside the generator's output.

## Design Notes

The root-core extraction is the one architectural act: `ad4-matrix.mjs` already
proved the pattern (single source at root, per-consumer thin layers, tests pin
the equality). Keep the core PURE (string in → artifacts out; no fs) so the
drift tests import it exactly as the bank's does today. The ТЖ config's
`direct` light-emission mode exists because the ТЖ colors block IS semantic
(no scale/alias indirection) — the bank's alias mode stays untouched. The dark
dual-emission is a config flag (`darkMode: 'manual' | 'native-auto'`), not a
fork: the selector grammar parameterizes over the theme attribute.

## Verification

**Commands:**
- `pnpm gen:tokens && git diff --exit-code -- packages/tokens` (bank stability)
- `pnpm --filter pillkit-tj-tokens gen:tokens && pnpm build && pnpm test && pnpm lint && pnpm typecheck`
- `pnpm check:tokens-drift` + the new ТЖ drift check — exit 0; deliberate
  DESIGN.md tweak → exit 1 → revert (local trip-probe, reverted before commit)
- `git diff --stat -- packages/tokens` — EMPTY; `packages/tj-tokens/src` —
  generated artifacts only
</frozen-after-approval>

## Implementation Notes

## Spec Change Log

## Review Triage Log
