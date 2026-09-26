# Story 11.2 — docs completion: verification evidence (2026-09-26)

Executor ledger. Work: the `--tk-font-mono` first consumer (docs code blocks,
7 pre/code rules at 4 files), stale first-consumer-claim corrections at 5
sites, the consumed-tokens docs-mono pin (unit 942 → 943), the
getting-started vite-dedupe recipe + README cross-link, regen chain
(`gen:tokens` + `gen` — diff = comment/note lines ONLY), baseline round.

## The measured sanctioned baseline set — 18 stories × 2 themes = 36 legs

Attribution: BLOCK = the page renders `<pre>` surfaces (flipped
`pre { font-family }`); INLINE = the page renders inline `<code>` spans
(flipped `code { font-family }`). Both rules flipped at every file (the spec
ruling); a story moves if it renders EITHER surface — every story below
renders at least one.

| Story id | BLOCK | INLINE | Extra mover |
|---|---|---|---|
| getting-started--page | yes (6 pre blocks incl. NEW vite.config.ts) | yes | NEW dedupe prose + snippet + cross-link (content grew) |
| theming-guide--switching | yes (2 pre) | yes | — |
| theming-guide--overrides | yes (3 pre) | yes | — |
| theming-guide--dark-pairing | NO | yes (table cells + prose) | inline-only mover |
| token-reference--colors | NO | yes (token names/values in cells) | inline-only mover |
| token-reference--typography | NO | yes (slot stems, stacks) | inline-only mover |
| token-reference--surfaces | NO | yes | inline-only mover |
| token-reference--motion | NO | yes | inline-only mover |
| token-reference--registers | NO | yes (register names, §9 pointer cells) | inline-only mover |
| components-v2-combobox-search--page | yes (codeBlock) | yes (25 code tags) | — |
| components-v2-cookie-banner--page | yes (codeBlock) | yes (18) | — |
| components-v2-data-table--page | yes (codeBlock) | yes (16) | — |
| components-v2-filter-chips--page | yes (codeBlock) | yes (20) | — |
| components-v2-mega-nav--page | yes (codeBlock) | yes (19) | — |
| components-v2-pagination--page | yes (codeBlock) | yes (24) | — |
| components-v2-qr-block--page | yes (codeBlock) | yes (18) | — |
| components-v2-stepper--page | yes (codeBlock) | yes (21) | — |
| components-v2-store-badges--page | yes (codeBlock) | yes (14) | — |

Measured by selector-level sweep (all `pre`/`code` CSS rules in
packages/docs/{src,.storybook}) + grep-attribution of `codeBlock`/`<code>`
in the story sources. The v2 folder holds exactly the 9 codeBlock-bearing
files above — no v2 page is a canary. Spec's ~24-leg estimate vs measured 36:
the RECORD is the contract (spec Boundaries). Canaries: every other story in
the index (components ×19 families, showcase ×6).

## Flip completeness (acceptance grep) — CORRECTED in the fix round

- Story round (commit 6119d37): the 7 rules of the four mapped files
  (tkgs pre/code, tktg code/pre, tkv2 pre/code, tktr code) flipped to
  `var(--tk-font-mono)`. The story round's completeness sweep reported
  «zero remaining body-font pre/code rules» — that sentence was FALSE:
  the sweep's selector regex (`\.tk\w+\s+(pre|code)`) did not match
  HYPHENATED stems, so `.tkcs-grid code` (packages/docs/src/
  component-search.ts:142) escaped it.
- FIX ROUND (lens MAJOR-1): `.tkcs-grid code` flipped (tag chips = code
  content — element tags; orchestrator adjudication: the block+inline
  ruling's half-adoption argument applies verbatim). Corrected sweep
  (selector = any rule whose selector mentions pre/code, hyphen-safe):
  the ONLY body-font code rule left anywhere in packages/docs was exactly
  this one; post-fix ZERO remain.
- `.storybook/preview.ts:88` is the `.tk-docs-disclaimer` banner — prose
  chrome (not a code surface), correctly out of scope.
- Lens N1 (recorded by the orchestrator, no action here): ~33 component-
  story canvas / api-reference / showcase code rules in
  packages/components stay body — outside this story's declared
  packages/docs scope; deferred-work entry opened.

## «invest tables» grep — claim-bearing sites: ZERO

Post-edit repo grep hits, ALL expected:
- `_bmad-output/implementation-artifacts/spec-11-2-…md` ×4 — the FROZEN spec
  quoting the stale claim as citation (human-frozen; `_bmad-output` is
  orchestrator-owned except DESIGN.md). Sanctioned residual per main's
  Phase-1 ruling: the matrix's «grep → 0» row means claim-BEARING sites.
- `packages/tokens/src/tokens.css` + `TOKENS.md` — flipped by the regen
  (verified in the committed diff: comment/note lines ONLY).

## Item 6 — the token-reference note-paragraph question: MEASURED, moves ZERO pixels

`registersData` (packages/docs/src/v2/registers.ts) applies `mdFirstParagraph`
to exactly ONE section: `## Radius`. The paragraph that renders on the
Registers story is the Radius lead («Two registers per DESIGN.md Shapes:
pill-soft marketing (`lg`/`xl`/`xxl`/`full`) and tight-precise app
(`xs`/`sm`/`md`) — never mixed within one component.») — bytes UNTOUCHED by
this story. The corrected mono note lives in `## Typography` AFTER the
`### Font family slots` table; `registersData` parses that section only as
the `### Typography registers (v2)` TABLE (no paragraph path). Re-confirmed
on the REGENERATED TOKENS.md (diff = the one prose line inside Typography —
not a parsed surface). Conclusion: the corrected prose moves ZERO
token-reference pixels; those stories move ONLY via the `.tktr code` flip.

## Verify-only record (a) — CEM carries the 10.x props: PRESENT ×9

Grepped `packages/components/custom-elements.json` (declarations):
`tk-button` @href, @target, @rel (10.4); @sr-only on `tk-input` AND
`tk-segmented-radio` (10.1); @error on `tk-checkbox` (10.2);
slot `subtitle` on `tk-stepper` (10.2); slot `page-copy` on `tk-qr-block`
(10.2); @art-mode on `tk-promo-card` (10.3). Docs API surfaces derive from
the same manifest (`packages/components/src/api-reference.ts` imports
`custom-elements.json` directly — tables cannot disagree); React wrappers
pass attributes dynamically via `createKitComponent` (no per-prop code to
grep). No edit needed or made.

## Verify-only record (b) — token reference auto-gains the 9.1 rows: PRESENT

- `--tk-color-tint-brown` `#8D6040` → Colors story tints table via
  `splitColorFamilies` (`^--tk-color-tint-`).
- `--tk-font-mono` → Typography story family-slots table via the
  `--tk-font-*` filter.
Values unchanged by this story (regen diff is comment/note bytes only);
both rows verified present in the regenerated artifacts. No edit made.

## Regen diff shape (iron-rule check)

`pnpm gen:tokens && pnpm gen` after the DESIGN.md + generate.mjs edits:
- `tokens.css`: 2 comment lines inside FONT_MONO_COMMENT. Nothing else.
- `TOKENS.md`: 1 prose line (the mono note). Nothing else.
- `custom-elements.json`, `packages/react/src/generated/*`, `tokens.ts`:
  byte-stable (absent from git status).
No value/structure change — no STOP condition hit.

## Unit totals

942 → 943 workspace-wide (tokens 17 + components 708 + react 70 + root
148; root was 147). The +1 = the docs-mono consumption pin in
tests/consumed-tokens.test.ts (file went 8 → 9 tests). A flip regression
fails the pin naming the files that vanished (assertion messages carry the
file list).

## Baseline round (appended after the round runs)

- Port 6007 check: CLEAN (`lsof -ti:6007` empty) before the pass.
- Pass 1 (delete+update): 36 sanctioned PNGs rm'd explicitly →
  `pnpm test:visual:update` (fresh docs build) → git status shows EXACTLY
  36 Modified in visual.spec.ts-snapshots/, zero adds/deletes, zero
  non-sanctioned movers (grep-filtered). All 36 differ from HEAD — no
  byte-identical retake (stale-dist alarm clear). Initial run: 1378
  passed / 2 axe failures (stepper — see FORENSICS + ADJUDICATION below;
  resolved by the orchestrator-approved tabindex fix, no re-take).
- Pass 1 full compare (post-fix): 1380 passed, exit 0.
- Pass 2 stability (post-fix): 1380 passed, exit 0 — the ×2 contract.

## FORENSICS — axe `scrollable-region-focusable` on the stepper v2 page (the mono flip's one gate casualty)

**What fired:** `scrollable-region-focusable: .tkv2 > pre`, stepper page,
both themes, update pass 2026-09-26. The stepper usage sample carries a
~140-char line (`<p slot="subtitle">Если у вас не зарегистрирован бизнес…</p><!-- необязательный подзаголовок -->`).
It FIT the `pre` box in `--tk-font-body` at body-s 13px; in `--tk-font-mono`
(wider glyphs) it now overflows → `overflow-x: auto` becomes an ACTUALLY
scrollable region → axe (WCAG 2.1.1) demands keyboard access the bare `<pre>`
does not have. The other 8 v2 pages' samples do not overflow in mono → no
violation there. Deterministic, both themes, mono-caused.

**Why the spec did not settle it:** Boundaries ruled «if a block's
overflow-x behavior shifts with wider glyphs, that is the honest new
baseline, not a fix trigger» — that sanctions the PIXEL shift (and this
round's stepper PNG retake IS that honest baseline), but the kit's axe gate
carries ZERO exclusions by constitution, and a scrollable region without
keyboard access fails it. The spec's matrix has no row for this collision.

**Kit precedent:** none — this is the kit's FIRST actually-scrolling scroll
container at capture width (`tk-data-table` host also declares
`overflow-x: auto` but never overflows in baselined states; tabs strip
delegates scroll to consumers). No tabindex-on-scroll-container pattern
exists yet.

**Options considered:**
- (A) `tabindex="0"` on `codeBlock()`'s `<pre>` (page-scaffold.ts) — the
  canonical accessible-code-block remediation (axe's own); zero pixel impact
  (baselines capture unfocused state); rides all 9 v2 pages' DOM; the 8
  non-scrolling pages gain a benign tab stop on copyable code. RECOMMENDED.
- (B) reformat the stepper sample's long line to fit mono width — docs
  content edit; changes line count/pixels beyond the sanctioned flip;
  contradicts the «not a fix trigger» ruling.
- (C) axe exclusion for the story — unconstitutional (harness: «No story
  carries an axe exclusion»).
- (D) CSS `white-space: pre-wrap` — a style retouch outside «the flip is
  EXACTLY the font-family declaration»; changes wrap semantics of every v2
  block.

## ADJUDICATION (orchestrator ruling, same day)

**Option (A) APPROVED** — axe's canonical remediation; addresses the flip's
accessibility CONSEQUENCE without touching pixels (B contradicts the spec's
own «not a fix trigger» ruling; C unconstitutional; D exceeds the exact-flip
mandate). In-story mechanical a11y fix via the sanctioned defect-fix flow;
the orchestrator carries it in the spec's Spec Change Log.

**Executed:** `tabindex="0"` + the causal-chain comment on `codeBlock()`
(packages/docs/src/v2/page-scaffold.ts). Rider 2 engine check MEASURED:
`grep "components-v2" tests/visual/a11y-sweep.spec.ts` → ZERO hits; all 30
sweep-registry rows are `components-<name>--<story>` component stories —
NO v2 page is walked, no stop-count impact.

**Rider 3 protocol executed (no stepper PNG re-take):**
- Fresh docs build → isolated re-run of the two failed legs:
  `axe: components-v2-stepper--page` [light] ✓ [dark] ✓ (2 passed).
- FULL compare pass 1: **1380 passed, exit 0** (the predicted 1378 + 2) —
  all 36 sanctioned re-taken baselines compared green WITH the tabindex
  attribute in the DOM: empirical proof of zero pixel impact.
- FULL compare pass 2 (the spec's visual ×2): **1380 passed, exit 0**.
- Port 6007 verified clean before every pass (three checks, all clean).

**Baseline round totals:** 36/36 legs re-taken (delete+update, explicit
rm), zero non-sanctioned movers, ×2 stable, axe suite-wide green.

## FORENSICS — the component-search miss (lens MAJOR-1, fix round 2026-09-26)

**The miss:** `.tkcs-grid code` (packages/docs/src/component-search.ts:142,
`font-family: var(--tk-font-body)` at :145) — the tag chips under each card
in the component search grid (19 element-tag chips), rendered TWICE in the
baselined getting-started--page (the live search + the empty-state demo at
`query="несуществующий"`). A docs code surface per the spec's own Intent
(«every docs code surface»); the story round left it on body font.

**Root cause (honest-deviation record):** the story round's completeness
sweep regex `\.tk\w+\s+(pre|code)\s*\{` matches selector stems of
`[A-Za-z0-9_]+` only — `.tkcs-grid` contains a hyphen, so the rule was
invisible to the sweep AND to its `-B2` context grep (the font-family sits
3 lines below the selector). The sweep's «zero remaining» conclusion was
therefore over-broad: it proved «zero UNHYPHENATED-stem body-font code
rules». A hyphen-safe sweep (any rule whose selector mentions pre/code)
run in the fix round lists exactly ONE body-font code rule in
packages/docs — the missed one; zero remain after the fix.

**Adjudication (orchestrator, FIX-THEN-SHIP):** flip it — the chips render
element tags (code content; mono is conventional; the block+inline
ruling's half-adoption argument applies verbatim). Pin updated to five
named files. Fix-round baseline protocol: re-take ONLY the two
getting-started--page PNGs (the sole story rendering the chips —
component-search is imported nowhere else), one full compare pass after.

