---
title: 'Story 11.2 — docs completion: --tk-font-mono first consumer + dedupe cross-link'
type: 'feature'
created: '2026-09-26'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'd340942'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 11.2 — docs completion, 5.5/8.3 mold; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (the 9.1 mono entry: zero consumers BY DESIGN, first consumer = the docs code blocks at 11.2)'
  - '{project-root}/packages/tokens/scripts/generate.mjs (FONT_MONO_COMMENT ~995-1004 — rides into tokens.css; the TOKENS.md mono-note literal ~1245)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md (fonts: block ~203-206 — the stale first-consumer claim)'
  - '{project-root}/tests/consumed-tokens.test.ts (the declaration pin ~145-156 with the stale comment; SCAN_ROOTS already covers packages/docs/src)'
  - '{project-root}/packages/tokens/src/index.test.ts (the 9.1 additions test ~26-34 with the stale comment)'
  - '{project-root}/packages/docs/src/getting-started.stories.ts (.tkgs pre/code ~70-85; the install block ~203-205 — the dedupe snippet lands after it)'
  - '{project-root}/packages/docs/src/theming-guide.stories.ts (.tktg code/pre ~84-98)'
  - '{project-root}/packages/docs/src/v2/page-scaffold.ts (.tkv2 pre/code ~81-95; codeBlock() ~164-166 — used by 9 v2 stories)'
  - '{project-root}/packages/docs/src/token-reference.stories.ts (.tktr code ~134-135; TOKENS.md?raw import ~18; the registers paragraph surface)'
  - '{project-root}/README.md (~60-76 — the vite-dedupe recipe the story cross-links)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 9.1 shipped `--tk-font-mono` with ZERO consumers by design — and
its recorded first-consumer claim («the invest tables story (11.2)») is STALE:
the ratified epics-v3 11.2 says the token's first surface is the DOCS CODE
BLOCKS. Today every docs `<pre>/<code>` surface renders `--tk-font-body`, the
vite-dedupe recipe lives only in README (getting-started — the natural install
surface — does not carry it), and the token's no-consumer era needs closing
honestly at every site that records it.

**Scope — four work items on the ratified epics text:**
1. **THE MONO FLIP (the token's first consumer):** every docs code surface's
   `font-family` goes `var(--tk-font-body)` → `var(--tk-font-mono)` at FOUR
   files — getting-started (`.tkgs pre` + `.tkgs code`), theming-guide
   (`.tktg code` + `.tktg pre`), v2/page-scaffold (`.tkv2 pre` + `.tkv2 code`
   if present — 9 v2 stories render it via `codeBlock()`), token-reference
   (`.tktr code` — the page renders markdown `code` spans inline). RULING:
   BOTH block `pre` AND inline `code` rules flip — inline code in mono inside
   body-font prose is the conventional code rendering; flipping only blocks
   would leave the token half-adopted.
2. **STALE-COMMENT CORRECTIONS (five sites, one claim):** the
   «first consumer = the invest tables story (11.2)» text flips everywhere to
   the ratified fact — «first consumer = the docs code blocks (story 11.2)»,
   past-tense after this story lands: DESIGN.md `fonts:` block comment;
   `generate.mjs` FONT_MONO_COMMENT (rides into tokens.css) + the TOKENS.md
   mono-note literal; `tests/consumed-tokens.test.ts` (the 9.1 pin comment);
   `packages/tokens/src/index.test.ts` (the 9.1 additions comment). The
   generator-literal edits CHANGE tokens.css + TOKENS.md bytes — `gen:tokens`
   output commits with the story (and the DESIGN.md edit mandates BOTH
   `gen:tokens` AND `gen` re-runs — the standing iron rule).
3. **CONSUMPTION PIN (the no-consumer era ends TEST-PROVEN):** the
   consumed-tokens declaration pin's comment flips, and the file gains a
   positive pin that the docs scan roots now CONSUME `--tk-font-mono` bare
   (the flipped files) — the 9.1 «deliberate exemption» never had a code-level
   net to retire (it was recorded in comments only); this test makes the
   first-consumer fact permanent and fail-loud if the flip ever regresses.
4. **GETTING-STARTED VITE-DEDUPE:** the story gains the recipe after its
   install code block — RU prose (adapted from README ~66-76: the
   workspace-link dual-react mechanism, the v1.1.0 release-gate provenance in
   one line) + the 3-line `vite.config.ts` code block + a cross-link line
   pointing at the README quick-start as the full recipe home. README itself
   is NOT edited (it already carries the canonical copy — cross-link is
   one-directional, no duplication drift).

**Approach:** docs-layer story on the 5.5/8.3 mold — no component, no token
VALUE changes, no API. Verify-only items ride along: (a) CEM-driven component
pages already show the 10.x props (href/target/rel, sr-only ×2, error,
subtitle, page-copy, art-mode — landed by the 10.x regens; the executor
verifies presence in `custom-elements.json` + the generated Api surfaces and
records the check — no edit expected); (b) the token reference auto-gains the
9.1 rows (`tint-brown` + `--tk-font-mono` in the typography table — derived
from the GENERATED TOKENS.md via registers; verify present). Both are
record-keeping verifications in the executor's NOTES, zero code.

## Boundaries & Constraints

- **The flip is EXACTLY the font-family declaration** in the pre/code rules of
  the four files — no size/leading/spacing retouch (mono metrics ride the
  existing body-s tokens; if a block's overflow-x behavior shifts with wider
  glyphs, that is the honest new baseline, not a fix trigger), no new rules,
  no scoping changes. A pre-code surface found OUTSIDE the four files → STOP
  and report (the sweep must be complete, not sample).
- **Generator edits:** the two `generate.mjs` literals change COMMENT/PROSE
  bytes only — the emitted token VALUES, order, and structure must stay
  byte-identical (diff of regenerated tokens.css/TOKENS.md = the comment/note
  lines ONLY; anything else → STOP). DESIGN.md edit → re-run BOTH `gen:tokens`
  AND `gen` (the iron rule); `pnpm test` runs AFTER gen, never before.
- **Comment corrections are CONTENT-TRUE, not cosmetically trimmed:** each
  site keeps its 9.1 provenance («no consumer in 9.1 by design») and gains the
  close («first consumer = the docs code blocks, story 11.2»). The
  consumed-tokens/index.test comments also update the pointer to where the
  exemption USED to be recorded (DESIGN.md fonts comment + TOKENS.md note) —
  both now record the consumer fact.
- **Consumption pin shape:** a small dedicated test in consumed-tokens.test.ts
  (the file's own idiom): assert the scanned docs sources include ≥1 bare
  `var(--tk-font-mono)` consumption — name the files found, so a flip
  regression lists what vanished. No change to SCAN_ROOTS or the detector.
- **Dedupe snippet fidelity:** the 3-line `vite.config.ts` block copies
  README's verbatim (`import { defineConfig } from 'vite';` shape); prose is
  RU, story-meta EN; the cross-link names README's quick-start section (no
  external URLs — the story renders inside Storybook; a bare `README.md →
  quick-start` textual pointer, the docs-family convention).
- **Sanctioned baseline set (the deliberate-update contract):** every story
  whose rendered pixels contain ANY surface this story changes — (a) the four
  flipped files' pre/code blocks (getting-started, theming-guide,
  token-reference, the 9 codeBlock-bearing v2 stories: combobox-search,
  cookie-banner, data-table, filter-chips, mega-nav, pagination, stepper,
  store-badges, qr-block), (b) getting-started AGAIN for the new snippet
  (same story — one entry), (c) token-reference AGAIN if the corrected
  TOKENS.md mono-note prose is the typography section's first paragraph that
  `registers.ts` renders (mdFirstParagraph — MEASURE in the regenerated
  TOKENS.md; if the note is the rendered paragraph, the corrected text moves
  those pixels; if the rendered paragraph is another, record which). Expected
  neighborhood: ~12 stories × 2 themes ≈ 24 legs — the executor MEASURES the
  exact set (grep-attribution + the visual round's actual movers) and records
  it in NOTES + the registry comment mold. ANY PNG outside the set → STOP and
  investigate (the 6.3 class). v2 stories WITHOUT a codeBlock stay byte-
  stable (canaries).
- **Gates:** full chain build → test → lint → typecheck; `pnpm gen` +
  `pnpm gen:tokens` (regen EXPECTED to diff: tokens.css + TOKENS.md comment/
  note bytes — committed; wrappers/CEM byte-stable); post-commit gen-drift;
  visual ×2 zero-unexplained movement, `lsof -ti:6007` clean before each
  pass; CI green = Actions verdict (`gh run`) on the pushed head.
- **Non-goals:** no token value changes, no NEW tokens (mono chain stays
  system-first);
  no font ASSETS (no licensed mono — the 9.1 ruling); no jsdoc/CEM hand-edits
  (verify-only items (a)/(b)); no CHANGELOG entry (11.3 owns the release
  notes sweep); no SR-protocol rows (docs stories are not components); no
  registers.ts/mdFirstParagraph changes (the parser shape is pinned by its
  own throw); no README edit; no prose re-authoring beyond the stale-claim
  corrections.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| pre/code flip | 4 files' pre+code rules | `font-family: var(--tk-font-mono)` at every docs code surface | leftover body-font code rule → FIX |
| inline code | `.tkgs/.tktg/.tktr code` (non-pre) | flips too (the explicit ruling) | block-only flip → FIX |
| regen diff | gen:tokens after generator+DESIGN edits | tokens.css + TOKENS.md comment/note lines ONLY | value/structure diff → STOP |
| stale claim | 5 sites | all read «docs code blocks (11.2)», 9.1 provenance kept | site missed → FIX (grep «invest tables» → 0) |
| consumption pin | docs scan roots | ≥1 bare mono consumption, files named | pin absent → FIX; flip regression → test RED with file list |
| dedupe snippet | getting-started after install block | RU prose + verbatim 3-line block + README cross-link | snippet drifts from README → FIX |
| token-ref note | corrected mono note as first paragraph? | MEASURED; pixels move only if rendered; recorded | assumed → never |
| CEM verify | 10.x props in custom-elements.json | present (href ×3 sites, sr-only, error, subtitle, page-copy, art-mode) | missing → investigate (NOT hand-edit) |
| token-ref 9.1 | tint-brown + mono rows | present in the typography/colors tables | missing → investigate |
| Round isolation | PNG outside the sanctioned set | STOP + investigate | blind update → process violation |
| Gates | full chain + regen-committed + visual ×2 + gen-drift | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `packages/docs/src/getting-started.stories.ts` — `.tkgs pre`/`.tkgs code`
  flip + the vite-dedupe prose/snippet/cross-link after the install block
- `packages/docs/src/theming-guide.stories.ts` — `.tktg code`/`.tktg pre` flip
- `packages/docs/src/v2/page-scaffold.ts` — `.tkv2 pre` (+ `.tkv2 code` if
  present) flip — the shared block 9 v2 stories render
- `packages/docs/src/token-reference.stories.ts` — `.tktr code` flip
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md`
  — `fonts:` block comment correction (frontmatter-adjacent comment, no value
  change)
- `packages/tokens/scripts/generate.mjs` — FONT_MONO_COMMENT + the TOKENS.md
  mono-note literal corrections
- `packages/tokens/src/tokens.css` + `packages/tokens/src/TOKENS.md` —
  REGENERATED (comment/note bytes; committed, never hand-edited)
- `tests/consumed-tokens.test.ts` — stale comment corrected + the positive
  docs-consumption pin test
- `packages/tokens/src/index.test.ts` — stale comment corrected
- `tests/visual/visual.spec.ts-snapshots/` — the sanctioned re-take set
  (explicit delete + update; the measured ~24-leg neighborhood)
- `.playwright-cli/verify/docs-11-2/NOTES.md` — the measured baseline-set
  ledger + the two verify-only records (CEM props, token-ref 9.1 rows)

## Tasks & Acceptance

- [ ] The mono flip at all four files (pre + inline code; a completeness grep
      for remaining `font-family: var(--tk-font-body)` inside any docs
      pre/code rule → zero) + the stale-claim corrections at all five sites
      (grep «invest tables» across repo → zero hits)
- [ ] Generator + DESIGN.md edits → `gen:tokens` AND `gen` re-run; regen diff
      = comment/note bytes ONLY; `pnpm test` AFTER gen
- [ ] The consumption pin test + the getting-started dedupe block; unit totals
      recorded (942 → 943)
- [ ] THE baseline round: sanctioned set explicit-delete + update, both
      themes, ×2 stable, zero movement outside; the token-ref note-paragraph
      question MEASURED and recorded; `lsof -ti:6007` clean before each pass
- [ ] Full gates (build → test → lint → typecheck → gen-drift post-commit →
      visual ×2); spec closed; conventional commit EN; CI green by `gh run`

**Acceptance Criteria:**
- Given any docs code block (block or inline) in the built storybook, then it
  renders in the mono chain (`--tk-font-mono`), and no docs pre/code rule
  still carries `--tk-font-body`.
- Given the regenerated token sheet + TOKENS.md, then the ONLY byte changes
  are the corrected comment/note lines, and every recorded first-consumer
  claim names the docs code blocks at 11.2.
- Given the consumed-tokens suite, then a test pins the docs mono consumption
  by file, and removing the flip fails it with the file list.
- Given the getting-started story, then the install flow carries the
  vite-dedupe recipe (README-verbatim snippet) with the cross-link.
- Given the merged tree, then every gate exits 0, gen-drift is clean, unit
  count grew by the pin test, and the only moved PNGs are inside the measured
  sanctioned set.
