---
title: 'Story 16.1 — ТЖ reading primitives: tj-prose + tj-link + tj-cta (FREEZE story)'
type: 'feature'
created: '2026-09-29'
status: 'approved'
baseline_commit: '94850b7'
review: 'quick'
review_source: 'qr-lens-16-1'
lenses_ran: ['qr-lens-16-1']
review_loop_iteration: 2
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 16.1 + FR-22)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (probe10-amended: link-body/focus-ring/motion-micro/curve-standard + components anchors)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (reading-surface + CTA + Interaction Primitives, probe10-corrected)'
  - '{project-root}/packages/tj-components/CONVENTIONS.md (§4/§9 + the four [OPEN — 16.1 freeze] items this story resolves)'
  - '{project-root}/.playwright-cli/verify/tj-tokens/NOTES.md (probe9 + probe10 forensics — the evidence base)'
  - '{project-root}/packages/components/src/button/ (the bank mold: dual-tag anchor mode, compact-inset 44px floor, css.ts pattern)'
  - '{project-root}/packages/react/scripts/generate-wrappers.mjs + packages/components/cem.config.mjs (the AD-1 machinery to parameterize)'
---

<frozen-after-approval reason="planning-sanctioned intent (maintainer «ok lets continue» 2026-09-28 + overnight autonomous delegation «ты оркестрируй… принимаешь конечные результаты»; epics-v5 story 16.1; evidence base probe9/probe10 landed as 16.1 pre-work commits 7d0b9b2/be786f8/94850b7) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ family has tokens, fonts policy, conventions, and scaffolds — but ZERO components. Epic 16 opens with the reading primitives that carry the ТЖ identity (the serif reading column, the navy interactive link, the quiet-geometry CTA), and the FIRST ТЖ component must run the freeze ritual (CONVENTIONS §9: the ТЖ instance of the React-surface API freeze) plus prove the AD-1 second instance (CEM manifest → parameterized wrapper generation → committed artifacts under root gen/check:gen drift gates).

**Approach:** Ship three stateless display/link primitives in `pillkit-tj-components`, exactly as the probe10 evidence defines them:

1. **`tj-prose`** — the reading container: `max-width: var(--tj-space-column-reading-body)` (760px, a cap NOT a grid column), the two-family cascade applied to slotted flow content (`::slotted` — the reference's rhythm is 25px paragraph gaps carried by wrappers, so OUR container owns the rhythm), RU hyphenation contract (`hyphens: auto` on the host; `lang="ru"` is the consumer's document-level duty, documented in the story), named `lead` slot (Charter 27/35) + default slot (Charter 21/30), `::slotted(h2)` Graphik 38/700/45 ink-100, `::slotted(blockquote)` Graphik 35/400/50 (pull-quote — grotesque inside the serif flow), `::slotted(a)` the in-body link species.
2. **`tj-link`** — the probe10 link species as a chrome primitive: shadow `<a><slot></slot></a>`, ink `var(--tj-color-link)` (= link-body #1414CC light / #93A2FF dark), underline PRESENT but transparent at rest, revealed on hover at 70% alpha of the ink via `color-mix(in srgb, var(--tj-color-link-body) 70%, transparent)` (the reference's compose-at-use architecture — no alpha tokens), `text-decoration-thickness: 1px`, `text-underline-offset: 0.1em`, `text-underline-position: under`, `transition: text-decoration-color var(--tj-motion-duration-micro) var(--tj-motion-curve-standard)` (both emitted at 15.2+probe10). Ink color does NOT shift on hover (ink-stable hover — the reference's restraint grammar). `href` property rendered onto the shadow anchor; `target` passthrough; `rel` defaults to `noopener noreferrer` IFF `target="_blank"` (the bank 10.4 deterministic external-link mold; consumer `rel` wins verbatim). v1 ships the BASE species only — `secondary`/dashed/positive-surface variants are recorded-reference-behavior for the stories that consume them (16.2+); no speculative APIs at freeze.
3. **`tj-cta`** — the quiet-geometry CTA «Написать»: ANCHOR-ONLY (the reference CTA is a link; no button branch at v1 — a button-CTA species does not exist in the ТЖ roster, an exception-log entry if ever needed), shadow `<a>` with `href`, visual pill h30 (`--tj-rounded-cta` 5px, cta-label 15/400/20, padding 5px 15px — probe10-measured `data-size=small` sizing) riding centered in an invisible **44×44 clickable box** (7px vertical inset each side: 30 + 14 = 44 — the bank compact-inset correction precedent; every pixel of the box is clickable and the focus ring draws around the BOX), fill `var(--tj-color-cta-fill)` / ink `var(--tj-color-cta-ink)` (dark = the #F5F5F9 pill via tokens, zero component branches). Hover: ink-stable (the reference's #333-CTA hover is UNPROBED — nothing invented; cursor pointer only; documented recorded-reference-behavior). Focus: the improvement layer — `:focus-visible { outline: 2px solid var(--tj-color-focus-ring); outline-offset: 2px; }` on ALL THREE components (the reference names `--outline-focus` but under-applies it: UA outline on links, `outline: none` on the CTA).

Plus the two machinery halves:

4. **The freeze ritual (CONVENTIONS §9, ТЖ instance)** — resolve the four `[OPEN — first stateful ТЖ component (16.1 freeze)]` items IN THE CONVENTIONS FILE (orchestrator-owned edits land post-review; the executor's findings feed them):
   - §4 stateful channels: **NONE in the 16.1 roster** (all three stateless display/link primitives) — the ruling records that the first stateful ТЖ surface (engagement bar / drawer / theme control, 16.4+) re-opens §4 on its own terms;
   - event-map: **ships EMPTY** (no custom events in the roster — link/cta ride the native composed `click`; the map file exists so the next story appends, not forks);
   - payload-unwrap bridge: the ТЖ `kit-component.ts` instance **ships WITH the wrapper machinery** (generated wrappers import it — the unwrap runtime must exist even with an empty event registry), a documented FR-17-driven duplication of the bank runtime contract (importing `pillkit-react` would be a forbidden tj→bank edge);
   - z-scale: **15.2 decided NO z tokens** (flat surfaces); the ruling defers the z question to the first overlay story (16.4 burger drawer).
5. **AD-1 second instance** — parameterize the wrapper generator (NOT fork it, ARCHITECTURE-SPINE AD-1 v5): extract `scripts/wrapper-gen/core.mjs` from `packages/react/scripts/generate-wrappers.mjs` with per-family config (manifest path, tag prefix, family runtime paths); **bank output stays BYTE-IDENTICAL** (the 15.2 token-generator precedent: refactor proven by a clean `git diff` BEFORE the ТЖ side is wired); `packages/tj-components` gains `cem.config.mjs` + `gen:manifest` + committed `custom-elements.json`; `packages/tj-react` gains `scripts/generate.mjs` + `src/{event-map.ts,kit-component.ts,generated/}`; root `gen`/`check:gen` extend to both families deterministically.

## Boundaries & Constraints

**Always:**
- Component code follows the bank mold exactly: one directory per component under `packages/tj-components/src/<name>/` with `index.ts`, `<name>.ts`, `<name>.css.ts`, `<name>.test.ts`, `<name>.stories.ts`; styles are Lit `css` modules consuming ONLY `var(--tj-*)` custom properties (inherited — never adopted into the shadow root; the cascade trap); theming crosses the boundary via tokens with ZERO component-level theme branches; every structural (non-token) value is flagged in a css.ts comment per the flag-don't-invent rule (known flags: the 7px CTA inset, the 1px underline thickness, the 25px prose rhythm, the 0.1em underline offset, the 70%/alpha composition values).
- The three components' a11y floor: natural tab order (no tabindex management), `:focus-visible` ring 2px/offset 2px (never removed — the reference's suppression is the documented gap we improve), anchor semantics intact (Enter activates; Space scrolls — the native anchor delta, documented in the story's keyboard checklist).
- `tj-prose` slotted styles and `tj-link`'s shadow styles are the SAME species contract from ONE token source (`--tj-color-link-body` + the measured underline geometry) — the duplication between `::slotted(a)` and the shadow anchor is the documented two-surface contract, not drift.
- Stories are RU-content (real article-shaped prose), each carrying the FR-22 sections: keyboard checklist + SR protocol notes. Story titles under the existing docs ТЖ section namespace (e.g. `ТЖ/Компоненты/…` — match the 15.1 docs shell grouping).
- Docs wiring: `.storybook/main.ts` stories glob gains `'../../tj-components/src/**/*.stories.@(ts|tsx)'` (today it globs docs + bank components only); docs package deps already carry the tj family (verify `pillkit-tj-components` present, add if the scaffold missed it).
- Wrapper machinery: bank byte-stability proven in a SEPARATE step before the ТЖ manifest exists (refactor → `pnpm gen` → `git diff --exit-code` on bank artifacts → commit-safe); the ТЖ generated files are deterministic (sorted, no timestamps) so `check:gen` gates drift.
- Root `package.json`: `gen` = bank manifest+wrappers THEN ТЖ manifest+wrappers; `check:gen` extends its diff-visibility set to `packages/tj-components/custom-elements.json` + `packages/tj-react/src/generated`.
- Gates: `pnpm install` (if deps move) → `pnpm test` → `pnpm lint` → `pnpm typecheck` → `pnpm build`. NO local `test:visual` in ANY mode (the orchestrator mints provisional baselines after review — port 6007 single-owner).
- Tests: per-component vitest files cover the API surface (render branches, href/rel deterministic external-link rule, slot styling presence at the css.ts level, focus-ring rules present in the styles, no `--tk-*` consumption — the FR-17 eslint/test guards already mechanized at 15.1 keep covering the package).

**Never:**
- No `_bmad-output/` edits (read-only for the executor — freeze-ruling text for CONVENTIONS.md goes in the executor's REPORT, the orchestrator lands it); no `.playwright-cli/` changes.
- No token VALUE edits: DESIGN.md is amended through the orchestrator ONLY; if a value feels wrong (rhythm, radius, ink) → STOP and report. No new token keys AT ALL (the probe10 pre-work landed everything 16.1 consumes).
- No `--tk-*` reads, no bank-package imports anywhere in `packages/tj-*` (FR-17; the generator refactor MOVES bank script code into `scripts/wrapper-gen/` — that is root tooling, not a package edge; `packages/react/scripts/generate-wrappers.mjs` becomes a thin config'd shim, its committed artifacts byte-identical).
- No npm/publish/version changes; no CI workflow edits (new stories ride existing legs; the visual harness auto-discovers from the built index with zero spec-file edits).
- No invented states: no CTA hover-fill/press/disabled visuals (unprobed — recorded-reference-behavior notes instead), no `secondary`/dashed link variants, no prose H1/byline blocks (the composition story owns arrangement; tj-prose styles only the reading flow it owns: lead/body/h2/blockquote/a).
- No test:visual locally, in any mode; no baseline PNG creation by the executor.

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Article body composition | `<tj-prose>` + lead slot + flow paragraphs with `<a>`, `<h2>`, `<blockquote>` | Charter 21/30 body, 27/35 lead, Graphik 38/700 h2, 35/50 pull-quote, navy species links, 25px paragraph rhythm, column capped at 760px | unknown slotted tags render UNSTYLED (inert passthrough — BYO content contract, documented) |
| Slotted link hover/focus | mouse over / Tab to slotted `<a>` | underline reveals at 70% ink alpha (100ms ease-in-out); focus ring 2px offset 2px | n/a — CSS-only surface |
| tj-link external | `href="…" target="_blank"` no rel | rendered anchor carries `rel="noopener noreferrer"` | consumer `rel` wins verbatim; `target` without `_blank` mints nothing (bank 10.4 rule) |
| tj-link href empty/unset | `href=""` | anchor renders WITHOUT href (inert, not focusable — native semantics); no crash | documented dev note in the story |
| tj-cta activation | click / Enter | native anchor navigation (consumer-owned href); Space scrolls (native anchor delta) | href empty → inert anchor (same rule as tj-link) |
| tj-cta target box | pointer at the 44px box edge | full box clickable (7px inset visual pill) | n/a — padding-box mold |
| Dark theme | `data-tj-theme="dark"` on an ancestor | ink-100/link/cta/focus-ring tokens re-resolve; ZERO component branches | un-themed consumer = light layer defaults |
| Reduced motion | `prefers-reduced-motion: reduce` | underline transition 0ms (the 15.2 reduced-motion token leg) | n/a — token-driven |
| Wrapper drift | hand-edited generated file | `pnpm check:gen` RED (regenerate == committed) | deterministic output, sorted, no timestamps |
| CEM drift | component API edit without regen | `check:gen` RED naming the manifest | same gate as bank |
| FR-17 trip | any tj file importing bank packages | eslint boundary rule + consumed-tokens guard RED | mechanized at 15.1, no new wiring |

## Code Map

- `packages/tj-components/src/tj-prose/{index.ts,tj-prose.ts,tj-prose.css.ts,tj-prose.test.ts,tj-prose.stories.ts}` — NEW
- `packages/tj-components/src/tj-link/{index.ts,tj-link.ts,tj-link.css.ts,tj-link.test.ts,tj-link.stories.ts}` — NEW
- `packages/tj-components/src/tj-cta/{index.ts,tj-cta.ts,tj-cta.css.ts,tj-cta.test.ts,tj-cta.stories.ts}` — NEW
- `packages/tj-components/src/index.ts` — re-export the three (+ keep scaffold exports)
- `packages/tj-components/{cem.config.mjs,custom-elements.json}` + package.json `gen:manifest` — NEW
- `packages/tj-react/{scripts/generate.mjs}` + `src/{event-map.ts,kit-component.ts,generated/,index.ts}` — NEW (kit-component.ts = the ТЖ instance of the unwrap bridge, documented duplication)
- `scripts/wrapper-gen/core.mjs` — NEW (extracted; parameterized)
- `packages/react/scripts/generate-wrappers.mjs` — becomes the bank config'd shim (byte-identical output)
- `package.json` — root `gen`/`check:gen` extend to the ТЖ family
- `packages/docs/.storybook/main.ts` — stories glob += tj-components; docs package.json dep verify
- `packages/tj-components/README.md` + `packages/tj-react/README.md` — scaffold status paragraphs updated to the component reality (short, honest)

## Tasks & Acceptance

**Execution:**
- [ ] Generator parameterization with bank byte-stability proven FIRST (refactor → gen → clean diff), then ТЖ manifest + wrappers + root gen/check:gen wiring
- [ ] tj-prose (container + slotted flow typography + rhythm + hyphenation contract)
- [ ] tj-link (base species, external-link rule, focus ring)
- [ ] tj-cta (anchor-only, 44×44 floor, dark inversion, focus ring)
- [ ] Stories RU ×3 with FR-22 keyboard/SR sections + the composed article demo story (the three primitives arranged as the reading column — the side-by-side baseline target vs `captures-v3/tj/tj-article-fullpage-*.png`)
- [ ] Docs wiring (stories glob + dep check) + README status updates
- [ ] Freeze-ruling findings in the executor report (the four [OPEN] resolutions + CONVENTIONS.md edit text, orchestrator-landed)
- [ ] Full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

**Acceptance Criteria:**
- Given the docs build, when the visual harness reads the story index, then the new ТЖ stories are discovered with zero harness edits and pass axe in BOTH themes (zero violations — FR-22 impeccable).
- Given `pnpm gen`, when it runs, then bank AND ТЖ manifests+wrappers regenerate deterministically and `pnpm check:gen` passes on a clean tree.
- Given the bank artifacts, when the generator refactor lands, then `packages/components/custom-elements.json` + `packages/react/src/generated` are byte-identical to pre-refactor (proven in the task sequence).
- Given any ТЖ component, when themed via `data-tj-theme` on an ancestor, then every color/typography value re-resolves through `var(--tj-*)` with zero component-level branches, and the FR-17 guards stay green.
- Given the executor diff, when reviewed, then no token VALUE edits, no new token keys, no `_bmad-output/`/`.playwright-cli/` touches, no invented visual states exist.

## Design Notes

- The 25px paragraph rhythm is the ONE measured prose gap (probe10: `P` mb 25px on the live article; the reference's typographic margins are otherwise 0 — wrappers carry layout, so OUR container owns the rhythm deliberately). H2/pull-quote vertical spacing is UNMEASURED on the reference: the composition story sets it via canvas styles in the 24–40px band pending the side-by-side baseline review — the executor picks from the existing spacing scale (24/32/40) and FLAGS the choice; nothing off-scale.
- `color-mix` for the underline alpha: Chrome 111+/Safari 16.2+ (2023 baselines) — the docs/harness targets are evergreen; the alternative (alpha tokens) was rejected because the generator's dark-override grammar requires hex literals for derived values, and compose-at-use is the reference's own architecture (`--opacity-link-border-hover` composed into `--color-link-border-hover` at use site).
- The anchor-only tj-cta ruling: the reference «Написать» is a link (EXPERIENCE: href consumer-owned); shipping a button branch nobody consumes would fork the freeze API. The bank dual-tag mold remains the INHERITED grammar for when a ТЖ button species actually exists (exception-log entry required).
- The wrapper-generator extraction mirrors the 15.2 token-generator split precisely (root `scripts/token-gen/core.mjs` + per-package configs): one mechanism, one input per family. The ТЖ `kit-component.ts` duplication is the AD-12 drawer-helper pattern applied to the React bridge — FR-17 makes sharing impossible; the contract (unwrap semantics) is identical and frozen at bank 2.1.
- Event-map emptiness is load-bearing: it proves the parameterized machinery end-to-end (manifest → wrappers → committed artifacts under check:gen) WITHOUT minting speculative events; the first stateful story appends to the map and nothing else changes.

## Verification

**Commands:**
- `pnpm gen && git status --porcelain` (both families regenerate; only expected NEW files untracked)
- `pnpm check:gen` (clean tree passes)
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build`
- `git diff --exit-code -- packages/components/custom-elements.json packages/react/src/generated` (bank byte-stability, run right after the refactor step)
- Visual/baseline work is ORCHESTRATOR-owned post-review: `pnpm test:visual:update` mints the provisional ТЖ baselines (new files only — the existing 1444 must stay byte-stable), then CI compare owns the verdict.
</frozen-after-approval>

## Implementation Notes

- **All spec tasks landed (A→F sequence honored); two review patch rounds.**
  Executor: file report + gates clean; AD-1 sequence proven in order (bank
  shim refactor → `pnpm gen` → `git diff --exit-code` on bank artifacts =
  exit 0, only `M packages/react/scripts/generate-wrappers.mjs` = the shim
  itself — BEFORE any ТЖ code existed).
- **Executor deviation UPHELD — preview.ts wider than the spec's docs-wiring
  bullet:** `import 'pillkit-tj-tokens/tokens.css'` document-level + the
  withTheme decorator syncing `dataset.tjTheme` alongside `data-theme`.
  Necessary (the toolbar theme otherwise never reaches the ТЖ layer) and
  beneficial (explicit `data-tj-theme="light"` disengages the sheet's
  prefers-color-scheme auto leg inside docs → harness renders never depend
  on the runner's OS theme). Docs = the sole FR-17-exempt composition root;
  tj story files themselves stay token-sheet-import-clean.
- **Triage round 1 (orchestrator, empirical on the built dist — ephemeral
  static server + iframe probe + real Tab walk):** MAJOR — nested in-paragraph
  anchors got NO species (`::slotted(a)` matches ASSIGNED nodes only; CSS
  Scoping forbids descendant combinators) → every story's in-paragraph `<a>`
  rendered UA-blue `rgb(0,0,238)` with UA `auto 1px` outline. Patch 1:
  stories use `<tj-link>` inside paragraphs (its shadow anchor verified
  #1414CC + transparent underline + ring `solid 2px #8A8AE5`); the
  two-surface contract documented (JSDoc + css.ts + 4 new pin tests);
  `::slotted(a)` KEPT for top-level slot anchors. Plus NIT: css.ts headers
  re-pointed to the real DESIGN.md keys (editorial-link / cta-write).
- **Lens round (qr-lens-16-1, iteration 1 — verdict BLOCK):** MAJOR —
  gen-drift was NOT mechanized for the ТЖ family (tests/gen-drift.test.ts
  covers bank only; ci.yml never runs check:gen) and the delivered manifest
  WAS stale (pre-patch «components.editorial-cta» description). Patch 2:
  NEW tests/tj-gen-drift.test.ts — the exact bank mold on the ТЖ family
  (cem analyze + wrapper gen + byte-compare + restore-on-exit in finally),
  trip-probed red on a corrupted manifest, healed byte-identical. MINOR —
  Space-scroll delta row added to all three keyboard checklists (spec's
  I/O-matrix row). NIT — Species story now demos the ONE raw top-level slot
  anchor (the `::slotted(a)` surface gets render/baseline/axe coverage);
  the story pin softened to exactly-one with both-direction rationale.
- **Lens verified clean (evidence-cited):** bank byte-identity (diff leg 0),
  zero token value/key edits (packages/tj-tokens diff empty), 42/42 consumed
  --tj-* names declared, FR-17 clean both directions, preview theme legs,
  EMPTY event-map honored through the wrappers, 2px/offset-2px rings with
  zero tabindex management, ink-stable hover pin mutation-checked (color
  shift CAUGHT, no tdc false-positive), rel/href suites reasoned sound,
  gen determinism (double-run hash-stable).
- **Freeze rulings landed by the orchestrator** in
  packages/tj-components/CONVENTIONS.md (status: frozen at 16.1): NONE
  stateful channels / EMPTY frozen event-map / unwrap bridge = documented
  FR-17 duplication / NO z tokens at 16.1; the drawer-helper surface alone
  stays [OPEN — 16.4].
- **Post-patch control (orchestrator):** iframe probes on the rebuilt dist —
  top-level raw anchor carries the species (#1414CC, transparent 1px
  underline, offset 2.1px=0.1em@21px, Charter); composition story has ZERO
  raw in-paragraph anchors; every Tab stop shows the token ring. Full gate
  chain re-run independently: test 17 files/180 (root leg; packages: tj
  52+8, tokens 17+4, components 713, react 70), lint 0, typecheck 0, build
  success.
- **Executor flags (spec Design Notes follow-up):** H2 band 40px/24px +
  pull-quote 32px — on-scale picks (24/32/40), composition-owned via canvas
  styles (document styles beat ::slotted), recorded in the story, pending
  the side-by-side baseline review vs captures-v3/tj/tj-article-fullpage-*.png.
- Guard flips per their own in-file mandates: consumed-tokens exemption →
  LIVE on the 16.1 roster (+ dir-name matcher fix: ТЖ dirs carry the tj-
  prefix, hook grammar now matches both forms; set still readdir-derived),
  import-boundaries → bank-grade external import pin, index tests → new
  surface pins. Lint hook caught two real backtick-in-css-template bugs;
  typecheck caught a wrong relative import — both fixed mid-flight.

## Spec Change Log

1. **Story-title example vs the shell's ASCII rule** (lens NIT, no code
   change): the Intent's illustrative «ТЖ/Компоненты/…» namespace does not
   slugify under the harness's ASCII id pin. The 15.1 docs-shell rule
   governs: Latin groups `TJ/Prose|Link|CTA` with Cyrillic display names via
   `name:` — implementation-verified against the built index (13 tj ids
   match /^[a-z0-9-]+--[a-z0-9-]+$/). The spec example was illustrative,
   not normative; recorded here rather than edited into the frozen block.
2. **Space-scroll documentation locus** (lens MINOR): the Boundaries bullet
   said "documented in the story's keyboard checklist"; landed as checklist
   rows in all THREE accessibility stories (not just tj-cta's) — the delta
   belongs to every anchor surface.

## Review Triage Log

**qr-lens-16-1 (quick review, iteration 1): verdict BLOCK → patched (round
2) → orchestrator control GREEN.** Lens independently re-ran the gate chain,
proved gen determinism (double-run, hash-stable; bank diff leg 0 throughout),
and produced the stale-manifest evidence that motivated the mechanization.

| Finding | Severity | Disposition |
|---|---|---|
| Gen-drift not mechanized for ТЖ; delivered manifest stale (no CI leg would flag it) | MAJOR | Fixed — tests/tj-gen-drift.test.ts (bank mold, restore-on-exit), trip-probed red, healed byte-identical; regenerated manifest committed with the story. |
| Nested in-paragraph anchors unstyled (found by orchestrator triage pre-lens; lens verified the patch) | MAJOR | Fixed (round 1) — tj-link inside paragraphs + documented two-surface contract + pins; re-verified empirically post-round-2. |
| Space-scroll delta absent from keyboard checklists | MINOR | Fixed — checklist rows ×3. |
| ::slotted(a) top-level surface never visually demoed | NIT | Fixed — one raw top-level anchor in Species + count-exactly-one pin. |
| Story titles TJ/* vs spec example ТЖ/Компоненты | NIT | Recorded — Spec Change Log #1 (15.1 ASCII shell rule governs). |

**Post-approval axe rounds (orchestrator's provisional-baseline mints — the
FR-22 harness leg): two color-surface iterations, story-canvas only, zero
component/token changes.** Round 3 fixed the INK: dark ×12 canvas notes used
`--tj-color-ink-200` (light-only semantic, un-overridden in dark) and the
light composition meta used the RESTRICTED `--tj-color-ink-reference-meta`
(2.434:1) — both → `--tj-color-ink-300` (the authored AA meta step). Round 4
fixed the SURFACE: ink-300 on the PAGE (#F0F0F0) computes 4.478:1 — the
5.099 pin is on the CARD, and the ТЖ palette deliberately has no AA meta step
for bare-page text because the reference's secondary text lives on white
cards over the gray page. Notes (×3 files) and the composition's article
column got `background: var(--tj-color-card)` + token padding/radius — both
themes resolve (5.099 light-card / 10.211 dark-card), and the composition
baseline target moves CLOSER to the reference (t-j.ru articles are white
columns over gray). Baselines re-minted after each round; existing non-ТЖ
baselines byte-stable throughout (0 modified among the 1444 in both sweeps).
The mints proved the harness auto-discovery AC: new tj PNGs + axe legs with
zero spec-file edits.

**Side-by-side vision review (orchestrator, post-mint3 — GREEN):** the
composition baselines (light + dark) vs
`.playwright-cli/captures-v3/tj/tj-article-fullpage-2026-09-28.png`. Light:
white card column with token padding/radius over the #F0F0F0 page; Charter
body + larger lead; Graphik H2/pull-quote; indigo links (navy species, rest
underline transparent BY DESIGN); dark CTA pill with light ink; meta row on
the CARD (AA-clean). Dark: dark page + lighter card, off-white body,
periwinkle links, CTA inverted to a light pill — zero light-theme leakage.
Rhythm vs reference: paragraph step dead-on (25px pin vs ~24–28 measured on
the capture); H2 40/24 + pull-quote 32 sit inside the reference bands
(~48-56/16-20 and ~32-40) — STAY FLAGGED for the maintainer's
baseline-review package (5.6 mold: provisional until human confirm). The
vision pass's «no serif on the reference» aside contradicts probe9 forensics
(Charter body is measured, DESIGN.md is normative) — recorded, no action.

**First CI compare round (run 36492243387 — RED, 12 visual legs):** all
failures localized to tj story canvases carrying `<code>` chrome (checklist
tables, hint notes) styled with the raw `monospace` keyword — the ONLY
unpinned font surface in the render tree. mac (Menlo) vs CI-Linux (DejaVu
Sans Mono): different advance widths reflowed wrapping lines (+5..15px body
heights — a size mismatch the comparator fails before any tolerance applies)
and different glyph rasters antialiased apart on same-height canvases
(playground: identical layout, AA-level storm). Pixel forensics on the run
artifacts: species overlap region byte-stable, delta pure bottom height;
zero non-tj legs affected — bank surfaces consume `--tk-font-mono` (pinned
since 11.2, whose inject.ts comment documents the exact same reflow class).
Fix: `tests/visual/fonts.css` pins `#storybook-root code/pre/kbd/samp` to
JetBrains Mono (ID specificity, no !important; harness determinism for story
chrome — the 11.2 precedent; ТЖ cannot mint a mono token at 16.1 and tj
packages may not read `--tk-*`). Re-mint (mint4): 1516 passed, 22 of 24 tj
PNGs rewritten (anatomy ×2 byte-identical — no code elements), ZERO
non-ТЖ baselines touched.
