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

- [x] The mono flip at all four files (pre + inline code; a completeness grep
      for remaining `font-family: var(--tk-font-body)` inside any docs
      pre/code rule → zero) + the stale-claim corrections at all five sites
      (grep «invest tables» across repo → zero hits) *(7 rules at 4 files in
      round 1; round 2 added the FIFTH file the lens caught — component-search
      tag chips; hyphen-safe re-sweep → zero; claim-bearing sites zero, the
      4 residual hits live inside this frozen spec quoting the claim —
      Implementation Notes 4)*
- [x] Generator + DESIGN.md edits → `gen:tokens` AND `gen` re-run; regen diff
      = comment/note bytes ONLY; `pnpm test` AFTER gen *(2 comment lines
      tokens.css + 1 note line TOKENS.md; CEM/wrappers/tokens.ts byte-stable;
      lens re-ran both generators → porcelain-clean-after)*
- [x] The consumption pin test + the getting-started dedupe block; unit totals
      recorded (942 → 943) *(943 = 17+708+70+148, consumed-tokens file 8→9;
      pin names FIVE files after round 2; mutation-proven by the lens)*
- [x] THE baseline round: sanctioned set explicit-delete + update, both
      themes, ×2 stable, zero movement outside; the token-ref note-paragraph
      question MEASURED and recorded; `lsof -ti:6007` clean before each pass
      *(MEASURED set = 18 stories × 2 = 36 legs, block-vs-inline attribution
      in NOTES; round 2 re-took exactly the 2 getting-started legs (38
      re-taken total across rounds); token-ref note = NOT a parsed surface —
      registersData reads mdFirstParagraph of `## Radius` only; ×2 stability
      1380/1380 in the worktree, ×2 again in the merge round)*
- [x] Full gates (build → test → lint → typecheck → gen-drift post-commit →
      visual ×2); spec closed; conventional commit EN; CI green by `gh run`
      *(executor 6119d37 + a0fb95c + orchestrator merge round; CI verdicts in
      Verification)*

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

## Implementation Notes

Executor judgment calls (worktree 6119d37 + lens-fix a0fb95c; lens-audited —
all six round-1 calls upheld, five mandated adjudications verified with
independent evidence):
1. **The axe casualty + adjudicated tabindex fix (in-story, round 1):** mono
   metrics pushed the stepper usage sample's ~140-char line into a REAL
   scroll region → `scrollable-region-focusable` failed both themes (WCAG
   2.1.1 — a bare `<pre>` has no keyboard scroll access). Orchestrator
   adjudicated option A: `tabindex="0"` on codeBlock()'s `<pre>` — axe's own
   canonical remediation, zero pixels (empirically proven: all 36 fresh
   baselines compared green WITH the attribute), rides all 9 v2 pages,
   benign tab stop on non-scrolling pages. The a11y-sweep registry verified
   untouched (zero `components-v2` rows of 30). The kit's first
   actually-scrolling scroll container at capture width — recorded.
2. **The sanctioned set measured 36, not ~24:** 18 stories = getting-started
   ×1, theming-guide ×3, token-reference ×5, v2 pages ×9 — each attributed
   by grep with block-vs-inline pixel attribution per story in NOTES. The
   spec's own «the RECORD is the contract» clause governs.
3. **The token-reference note question answered by code, re-confirmed on the
   regenerated TOKENS.md:** `registersData` applies mdFirstParagraph ONLY to
   `## Radius` (untouched bytes); the corrected mono note sits in
   `## Typography` after the font-slots table — not a parsed surface → the
   corrected prose moves ZERO token-reference pixels; those stories moved
   only via the `.tktr code` flip.
4. **Round 2 (lens MAJOR-1) — the hyphen-blind sweep miss:** the story
   round's completeness regex `\.tk\w+\s+(pre|code)` cannot match hyphenated
   stems — `.tkcs-grid code` (component-search tag chips, rendered TWICE in
   the baselined getting-started--page) stayed body-font while the ledger
   claimed «zero remaining». Root cause recorded; hyphen-safe re-sweep
   (any rule whose selector mentions pre/code) closed the set to zero; the
   chip rule flipped (tag chips are code content — the block+inline ruling
   verbatim); pin grew to five named files; ledger rewritten truthfully as
   its own FORENSICS entry. The 4 «invest tables» residual hits inside this
   frozen spec = sanctioned (citation quotes, human-frozen file).
5. **Executor micro-calls (round 1, all upheld):** per-site CSS rationale
   comments; literal after-install-`</pre>` placement; the pin asserts the
   named files ⊆ consumers (stronger than the spec's ≥1); cross-link names
   README's real heading «Быстрый старт»; the token-reference specimen
   column keeps heading/body fonts (type specimens ≠ code surfaces — the
   row's `<code>` cells DID flip); `SCAN_ROOTS[...] ?? []` narrowing.
6. **Pin granularity (lens N2, accepted):** the pin is file-level — a
   partial within-file regression (one of a file's rules reverted) escapes;
   this matches the spec's mandated shape («name the files found»). A
   rule-level pin is a possible future tightening, recorded not required.
7. **Process notes:** the executor's first full-compare attempt died at the
   600s foreground Bash cap (an 8-9m pass does not fit foreground) — re-run
   in background, no gate skipped; the orchestrator's own pass-2 was killed
   by a session restart and re-run clean. Both re-affirm: long visual passes
   run backgrounded, verdicts from completion records only.
8. **Totals:** unit 942 → **943** (17+708+70+148; the pin is the only
   addition); visual stays **1380** legs (no new legs — a docs-content
   story); 38 PNGs re-taken across both rounds (36 + the fix-round 2), zero
   unsanctioned movement in any pass.

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **In-story gate casualty + adjudicated mechanical fix:** the axe
   scrollable-region-focusable collision (Implementation Notes 1) exercised
   the sanctioned defect-fix flow — STOP, orchestrator adjudication, fix,
   proof. The spec matrix had no row for it; the fix rides the story commit.
2. **Sanctioned set: estimate → measurement:** ~24 → 36 legs (Notes 2) — the
   deliberate-update contract working as designed.
3. **Lens MAJOR fix round (a0fb95c):** the fifth flip file (component-search)
   + pin extension + ledger correction (Notes 4). The frozen four-file Code
   Map line predates the measurement; the fifth file is INSIDE the frozen
   Intent's «every docs code surface» — a research-completeness correction,
   not a scope change.
4. **CI remediation rounds (90c8e6a → pin head):** the code-head push's
   first CI proof exposed the system-mono platform class (36/36 sanctioned
   legs RED on ubuntu, zero canaries). Attempt #1 (CI-scoped tolerance,
   90c8e6a) FAILED — Playwright 1.63 hard-fails size-mismatched screenshots
   before any tolerance applies (comparator source verified; see
   Verification). Attempt #2 = the structural fix: the mono slot joins the
   harness font pin (JetBrains Mono, test-only dep; token layer untouched)
   — no content changes either way. The class + disposition recorded in
   deferred-work.
5. Merge round + CI verdicts: see Verification.

## Review Triage Log

Quick review (qr-lens-11-2, 2026-09-26): **FIX-THEN-SHIP — 1 MAJOR / 0 MINOR
/ 3 NOTE; fix round executed (a0fb95c); post-fix state SHIP.** All five
mandated adjudications returned VERIFIED with the lens's OWN evidence:
1. [ADJ-1] flip completeness — FAILED as shipped (the MAJOR), otherwise
   clean: 7/7 flips verified, inline ruling applied, specimen-column
   exclusion sound (type samples are `<td>` inline-styled, not code).
2. [ADJ-2] regen shape — re-ran both generators in the worktree: porcelain
   clean after; tokens.css = 2 comment lines, TOKENS.md = 1 note line; CEM/
   wrappers/tokens.ts absent from the diff.
3. [ADJ-3] the pin — mutation-proven (both theming-guide rules reverted →
   pin FAILED naming the file + assert line; restored → 9/9); 943 verified
   from the lens's own gate run; file-granularity = spec shape (N2).
4. [ADJ-4] baseline round — 36/36 name-status M, ls-tree cross-check 36 of
   392 blobs changed (356 canaries byte-stable), ALL 36 blob hashes differ
   base→commit (no stale-dist), all 9 v2 stories use codeBlock (no v2
   canary), tabindex zero-pixel sound (attribute-only, compared green).
5. [ADJ-5] scope + claims — «invest tables» claim-bearing zero (residual =
   frozen spec ×4 + NOTES' own self-referential heading); README snippet
   byte-verbatim ×3 lines; README/CHANGELOG absent from diff; _bmad-output
   touched ONLY at DESIGN.md ONLY in the fonts comment; single scoped commit
   per round; no npm artifacts.
- [MAJOR-1] `.tkcs-grid code` missed + false ledger completeness claim →
  fixed in a0fb95c (Change Log 3), root-caused and re-swept hyphen-safe.
- [N1] ~33 component-package code rules (`*-canvas code` ×~28, `.tkap code`,
  showcase ×4) remain body-font — outside this story's declared
  packages/docs scope; DISPOSITION: deferred-work entry (future micro-story
  or maintainer ruling) so the next mono story doesn't rediscover them.
- [N2] pin file-granularity → Implementation Notes 6.
- [N3] 36-vs-24 estimate → properly governed by the record-is-the-contract
  clause.

## Verification

- Executor round (worktree, 6119d37): all four work items + regen chain +
  the adjudicated tabindex fix; unit 943; baseline pass 1 = exactly 36
  sanctioned movers, ×2 stability 1380/1380; axe suite-wide green. Fix
  round (a0fb95c): fifth flip file + five-file pin + truthful ledger +
  exactly-2 getting-started re-takes + full compare 1380/1380. Worktree
  porcelain-clean at both commits; post-commit gen-drift exit 0.
- Lens round (qr-lens-11-2): gates re-run green in the worktree (build,
  test 943, lint, typecheck); regen idempotency re-proven; pin
  mutation-proven; blob-hash forensics on the baseline round; verdict
  FIX-THEN-SHIP; lens killed after delivery (standing rule).
- Merge round (orchestrator, main tree): fix verified (flip + 5-file pin +
  ledger forensics); ff-merge 14af291..a0fb95c (48 files +331/−25 — exactly
  the 38 PNGs + 10 source/doc files); fast gates green (build → test 943 →
  lint → typecheck → gen → gen:tokens); GEN_DRIFT clean; visual pass 1
  **1380/1380** (8.6m); pass 2 first attempt killed by a session restart
  (no results), re-run clean — verdicts from completion records only.
- Merge: 14af291..a0fb95c ff-only; pushed.
- **CI VERDICT on a0fb95c: RED — run 36254296012 (16:06:56Z → 16:28:46Z,
  21.8m): the Visual+axe step failed EXACTLY the 36 sanctioned legs
  (1344/1380), zero outside the set.** Forensics: system-first
  `--tk-font-mono` resolves to different faces per platform (macOS Menlo vs
  ubuntu DejaVu/Liberation) → every doc page with code surfaces reflows
  (full-page height +17…+28px; ratios 0.02–0.07) — the structurally
  un-pinnable wrap-count subclass (the tooltip placements precedent),
  perfectly scoped to the flip (the canaries proved it). Remediation
  attempt #1 = the standing CI-scoped per-leg tolerance
  (CI_VISUAL_TOLERANCE flat 0.10, local strict proof 1380/1380) — head
  90c8e6a.
- **CI VERDICT on 90c8e6a: RED — run 36256418333 (same step, EXACTLY the
  same 36 legs): the tolerance never engaged.** The run's errors print the
  size line («Expected an image 1280px by 3284px, received 1280px by
  3312px.») with NO ratio line — verified against the installed Playwright
  1.63 comparator source (playwright-core compareImages): a SIZE MISMATCH
  fails UNCONDITIONALLY (`if (pixelsMismatchError || sizesMismatchError)
  return { errorMessage: … }`), even when the padded pixel count is inside
  maxDiffPixelRatio (run 1 printed ratios only because the no-options
  default path counts and reports pixels). The doc pages' full-page canvas
  HEIGHTS differ per platform, so no tolerance option can ever cover the
  class. The 0.10 entries are retired day-one — they never shipped a green
  run.
- **Remediation #2 — the structural fix: the mono slot joins the harness
  font pin.** `pinDeterministicFonts` (built for body/heading when the mono
  token did not exist yet) now also pins `--tk-font-mono` to locally-served
  JetBrains Mono (`@fontsource/jetbrains-mono` 5.3.0, OFL-1.1, latin +
  cyrillic; a TEST-ONLY devDependency served by tests/visual/serve.mjs at
  /jetbrains-mono — the token layer stays system-first per the 9.1 ruling;
  the pin is a capture-time slot override in fonts.css, the identical
  mechanism already used for body/heading). Mono glyph metrics become
  platform-independent → full-page canvas heights exactly equal on macOS
  and ubuntu → the 36 legs compare at DEFAULT tolerance everywhere; the
  CI_VISUAL_TOLERANCE map returns to tooltip-only. The 36 sanctioned
  baselines re-taken under the pin (explicit delete of exactly the 36 PNGs
  + update pass; gates ALL exit 0; strict visual ×2 = 1380/1380 both).
  Remediation head = b185cc4 (run 36260365889).
- **CI VERDICT on b185cc4: GREEN — run 36260365889 (17:49:06Z → 18:10:13Z,
  21.1m), visual step completed:success.** The pin equalized the full-page
  canvas heights across platforms: all 1380 legs (the 36 mono-bearing ones
  included) compared green at DEFAULT tolerance on ubuntu — the tolerance
  map is tooltip-only again. Story 11.2's green head = b185cc4.
- Docs round: spec post-sections + deferred-work entries + CLAUDE.md cycle
  bullet and totals 942→943; docs-head CI verdict recorded below.
- **CI VERDICT on the docs head (eb5a5ba): GREEN — run 36261862359
  (18:14:58Z → 18:35:25Z, 20.4m).** The terminal head's own run is verified
  via `gh` after landing (the non-self-referential close mold, story 11.1).
