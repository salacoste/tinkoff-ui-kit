---
title: 'Story 11.1 — a11y-sweep deltas on the 10.1–10.4 surfaces'
type: 'feature'
created: '2026-09-26'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'de304e7'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 11.1; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-8-1-v2-a11y-sweep.md (THE engine/ledger mold — Group V registry, targeted legs, ledger format)'
  - '{project-root}/tests/visual/a11y-sweep.spec.ts (the SWEEP registry + walk/scan/targeted leg shapes)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/METHOD.md (six-check method, ledger format, §SR; the extensions list this story joins)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v2.md (the run-sheet mold — URL blocks, обход, ожидаемые анонсы, Результат rows)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-10-1-10-2-sr-only-labels-error-channel-slots.md (the 10.1+10.2 API surfaces)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-10-3-promo-card-full-bleed-art.md (art-mode=bleed)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-10-4-button-href-mode.md (href/target/rel anchor mode)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (7.2(b) — the cookie-banner Tab-walk revisit this story owns)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The four API-extension stories 10.1–10.4 shipped with per-story
unit/visual gates but WITHOUT the 5.1 a11y-sweep pass every other surface
carries: no ledger rows for the new modes, no engine legs, no SR-protocol
delta rows. Epics-v3 11.1 closes the sweep debt before the v1.2.0 release.

**Scope — the seven new-mode surfaces (the DELTA, not the components from
scratch; their v1/v2 rows stand):**
1. tk-input — `sr-only` label mode (10.1: `.label--sr-only`, id/for chain kept)
2. tk-segmented-radio — `sr-only` group label (10.1: same mold, aria-labelledby kept)
3. tk-checkbox — `error` consumer-error channel (10.2: aria-invalid +
   aria-describedby → error `<p>` OUTSIDE the label, the input mold)
4. tk-stepper — `subtitle` named slot (10.2: `data-has-subtitle` wrapper)
5. tk-qr-block — `page-copy` named slot (10.2: `data-has-page-copy` wrapper)
6. tk-promo-card — `art-mode="bleed"` (10.3: overlay pill over art)
7. tk-button — `href`/`target`/`rel` anchor mode (10.4: `<a class="button">`)

**Approach:** The 8.1 mold verbatim, scoped to deltas. (a) ENGINE: the SWEEP
registry gains TWO new rows (the second-row-per-component precedent — navbar
carries one per story contract) + targeted legs for the args-driven modes +
the cookie-banner 7.2(b) keyboard leg. (b) LEDGER: `group-VI.md` — seven
surface-mode rows × the six checks, RU, real evidence pointers. (c) SR
PROTOCOLS: the seven stories' «Протокол скринридер-проверки» sections extend
with the new-mode rows (RU announcements verbatim); the v1.2.0 run-sheet
`SR-RUNSHEET-v1.2.0.md` is written with EMPTY Результат rows — execution
stays maintainer-side (§8.1.4; 11.3's release package points at it). Dark
legs ride the visual suite automatically (every story runs both themes).

## Boundaries & Constraints

- **Registry rows (walk ×2 themes + scan each):**
  `tk-button / components-button--variants-and-sizes` — the href demo row's
  anchors are KIT stops: ring parity (`.button` class-level CSS), name, href
  exposure, ≥44. `tk-promo-card / components-promocard--variants` — the bleed
  cards' pill stops ringed + ≥44 (the 44-tall overlay pill). EXACT stop
  counts are MEASURED by the executor and recorded in the registry comment +
  Implementation Notes (the registry's deliberate-update contract); story
  chrome stops ride along unasserted (the existing rule).
- **Targeted legs (the 8.1 cookie-accept mold — args-driven modes):**
  Storybook iframe URLs accept `&args=` — use them, do NOT edit shared
  helpers (`tests/visual/stories.ts` untouched):
  - input `sr-only:true` — walk = 1 stop, ring on `.field`, the deep name
    check resolves the label (visually hidden ≠ nameless), the label element
    measures the 1px-clip box (the utility actually applied, not `display:none`).
  - segmented-radio `sr-only:true` — group named by the hidden span
    (aria-labelledby chain), walk 1 stop, ring topology unchanged.
  - checkbox `error:<ru-string>` — inner input carries `aria-invalid="true"`
    + `aria-describedby` → the error paragraph's id; the `<p>` renders
    OUTSIDE the label element; name chain intact; walk 1 stop.
  - stepper subtitle + qr-block page-copy — tree legs on the slotted demos:
    host `data-has-subtitle`/`data-has-page-copy` on, wrapper + content in
    the tree, heading `<h2>` present, decorative numerals `aria-hidden`;
    qr-block's 1-stop walk intact (tabs unchanged).
- **cookie-banner 7.2(b) — the recorded revisit home, closes here:** ONE
  targeted keyboard leg in `tests/visual/cookie-banner.spec.ts` on the open
  card (element-API path): a FORWARD walk cannot enter a first-paint
  top-layer surface (the 8.1 engine finding — fundamental), but Shift+Tab
  from body REACHES the accept pill (the 8.1 probe note): assert the
  reverse-entry stop is the accept, ringed + named, and Enter accepts +
  closes the card. HONEST-OUT: if the probe refutes Shift+Tab entry too,
  record the finding, keep the leg at what IS realizable, and close 7.2(b)
  as covered-by-sweep + the documented top-layer limitation — no forcing.
- **Ledger:** `group-VI.md` follows the METHOD.md format EXACTLY — six check
  cells per surface row, each with a real evidence pointer (leg name +
  file:line or test id); «N/A by construction» cells cite the test that
  proves the construction; vacuous «ok» cells forbidden. METHOD.md's
  extensions list gains the group-VI line.
- **SR protocol sections (RU content, EN meta):** each of the seven stories
  extends its protocol table with the new-mode rows — traversal + expected
  announcements VERBATIM-quotable (the v2 run-sheet copies from here):
  e.g. input sr-only → «Сумма, поле редактирования» with the label announced
  despite being visually hidden; checkbox error → invalid state + error text
  read; button href → «Скачать для iOS, ссылка» + Enter navigates (Space is
  native scroll — the documented 10.4 delta); promo-card bleed → art not
  announced (consumer aria-hidden), pill announced as its button name.
  The expected announcements must derive from the SHIPPED tree (read the
  built DOM, don't invent) — probe with axe-tree/name resolution where
  unsure; narration QUALITY stays maintainer-side.
- **SR-RUNSHEET-v1.2.0.md:** the v2 mold verbatim — подготовка block, per-
  surface URL pairs (light/dark), обход, ожидаемые анонсы (quoted from the
  story protocols), EMPTY «Результат: light [ ] / dark [ ]» rows. No digest
  write (PROTOCOL-DIGEST.md is maintainer-filled at execution).
- **Byte-stability + sanctioned baselines:** engine legs are functional-only
  (no baselines). The seven protocol-section EXTENSIONS are rendered story
  content → the sanctioned re-take set is EXACTLY the seven components'
  accessibility stories (both themes — up to 14 legs; verify each section's
  host story before taking; if a protocol section lives elsewhere, that
  story is in the set instead, recorded). ANY other PNG moving → STOP and
  investigate (the 6.3 contamination class). A sweep FINDING that demands a
  mechanical fix (an 8.1 F-class) follows the sanctioned defect-fix flow:
  STOP-and-report first, orchestrator adjudicates, then explicit re-take.
- **Gates:** full chain build → test → lint → typecheck; `pnpm gen` +
  `pnpm gen:tokens` (byte-stable — no API/token changes expected; if a
  story jsdoc changes CEM, regen normally); post-commit gen-drift; visual ×2
  zero-unexplained movement with `lsof -ti:6007` clean before each pass; CI
  green = Actions verdict (`gh run`) on the pushed head.
- **Non-goals:** no SR execution by the harness (the v1/§8.1.4 ruling);
  no new components or API changes (mechanical a11y fixes only, STOP-gated);
  no six-check method edits (extension only); no NVDA (stays deferred); no
  re-opening settled rulings (Esc-no-dismiss, text-target §9, sr-only
  contrast — the utility is off-paint by construction); no visual-suite
  restructure; no CHANGELOG entry (11.3 owns the release notes sweep).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| button href walk | variants-and-sizes story | anchors = KIT stops, ringed (2px/2px/token), named, ≥44, exact count pinned | unringed anchor → FIX |
| promo bleed scan | variants story | overlay pills ≥44×44, ringed on focus | undersized pill → FIX (probe first) |
| input sr-only | `&args=sr-only:true` | label 1px-clipped but still the accessible name; walk 1 stop | nameless field → FIX |
| segmented sr-only | `&args=sr-only:true` | group named by hidden span; «Выбор» fallback untouched | fallback regression → FIX |
| checkbox error | `&args=error:…` | aria-invalid + describedby→p; p outside label; name intact | missing wiring → FIX |
| stepper subtitle | slotted demo story | data-has-subtitle on; wrapper in tree; numeral aria-hidden | phantom wrapper → FIX |
| qr-block page-copy | slotted demo story | data-has-page-copy on; tabs walk 1 stop intact | tab regressions → FIX |
| cookie 7.2(b) | open card, Shift+Tab | accept = first reverse stop, ringed + named; Enter accepts+closes | unreachable → honest-out, record |
| ledger | 7 rows × 6 cells | every cell carries a real pointer | vacuous cell → FIX |
| SR protocols | 7 stories | new-mode rows, announcements from the shipped tree | invented announcement → never |
| run-sheet | v1.2.0 file | v2 mold, EMPTY Результат rows | filled-by-executor → never |
| Round isolation | PNG outside the sanctioned set | STOP + investigate | blind update → process violation |
| Gates | full chain + visual ×2 + gen-drift | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `tests/visual/a11y-sweep.spec.ts` — 2 registry rows (Group VI comment) +
  the targeted new-mode legs
- `tests/visual/cookie-banner.spec.ts` — the 7.2(b) Shift+Tab reverse-entry
  + Enter-accept leg
- `.playwright-cli/verify/a11y-sweep/group-VI.md` — the seven-row ledger (RU)
- `.playwright-cli/verify/a11y-sweep/METHOD.md` — extensions-list line
- `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md` — the run-sheet
  (empty Результат rows)
- `packages/components/src/{input,segmented-radio,checkbox,stepper,qr-block,promo-card,button}/*.stories.ts`
  — SR-protocol section extensions (RU rows)
- `tests/visual/visual.spec.ts-snapshots/` — the sanctioned re-take set (the
  seven accessibility stories ×2 themes; explicit delete + update)
- `custom-elements.json` + `packages/react/src/generated/*` — regenerated
  ONLY if jsdoc changed (not expected)

## Tasks & Acceptance

- [x] Engine deltas: 2 registry rows (stops measured + recorded) + targeted
      new-mode legs (input/segmented/checkbox/stepper/qr-block) + the cookie
      7.2(b) leg — all green locally *(12 legs; sweep file 88→99; stop counts
      11/10 — Implementation Notes 6–7)*
- [x] Ledger `group-VI.md` (7 rows × 6 checks, RU, real pointers) +
      METHOD.md extension note *(42/42 cells; lens opened 10+ citations, all
      real)*
- [x] SR protocol rows in the seven stories (announcements from the shipped
      tree) + `SR-RUNSHEET-v1.2.0.md` (empty Результат rows) *(7 stories + 3
      approved demo figures; the lens MAJOR caught inherited birth-stale «+20%»
      expectations — fixed to the shipped +30%, Change Log 2)*
- [x] THE baseline round: sanctioned set explicit-delete + update, both
      themes, ×2 stable, zero movement outside; `lsof -ti:6007` clean
      *(recovered after the stale-dist incident — Implementation Notes 5; +2
      input PNGs in the fix round; exactly-14+2 verified; ×2 stability
      1380/1380)*
- [x] Full gates (build → test → lint → typecheck → gen-drift post-commit →
      visual ×2); spec closed; conventional commit EN; CI green by `gh run`
      *(executor d1a210a/7ee97e1 + orchestrator merge round; CI verdicts in
      Verification)*

**Acceptance Criteria:**
- Given the extended registry, when the sweep runs, then every new leg is
  green and the two new rows' stop counts are recorded as deliberate
  measurements.
- Given a visually hidden sr-only label, when the deep name check runs, then
  the field/group still resolves its accessible name (and the utility is
  proven applied, not display:none).
- Given checkbox error set, when the tree is read, then aria-invalid +
  aria-describedby point at the error paragraph rendered outside the label.
- Given the ledger, when read, then all 7 × 6 cells carry honest verdicts
  with real evidence pointers.
- Given the seven stories, when their SR protocol sections are read, then
  each carries the new-mode rows with tree-derived expected announcements,
  and the run-sheet mirrors them with empty Результат rows.
- Given the merged tree, then every gate exits 0, gen-drift is clean, and
  the only moved PNGs are inside the sanctioned set.

## Implementation Notes

Executor judgment calls (worktree ecba360 + lens-fix b5a35fd, rebased → d1a210a +
7ee97e1; lens-audited — all upheld, five mandated adjudications VERIFIED with
independent evidence):
1. **Three demo figures added to the accessibility stories** (stepper subtitle,
   qr-block page-copy, button href) — ORCHESTRATOR-APPROVED pre-execution: the
   run-sheet's one-URL-per-surface mold demands the protocol rows be exercisable.
   Verbatim copies of the Variants/VariantsAndSizes sources (same labels/props;
   figcaptions dropped — minimal composition); no decorative art at story level in
   the three (the clause holds vacuously); lens diffed them byte-equal to source.
2. **Cookie 7.2(b) realized as a bounded reverse-entry walk:** the spec's
   one-press Shift+Tab reading was MEASURED AND REFUTED (reverse order from body:
   slotted link → story demo trigger → body → accept pill); the leg rides the 8.1
   bounded-walk mold — first in-card stop asserted (the slotted link, named via
   aria-label, its recorded 7.2 underline affordance), then the accept pill
   (unified ring 2px/2px/token, «Хорошо», 73.6×44), Enter → consent-choice fires +
   consumer `open=false` closes (the kit never closes itself — the 7.2 contract).
   The lens replayed the walk independently on its own port: identical.
3. **`&args=` grammar boundary pinned empirically** (probes on the built bundle):
   ASCII values apply (incl. `%20` spaces and the key/value SEPARATOR `:` as `%3A`);
   MULTIBYTE UTF-8 is silently dropped (raw AND percent-encoded — never reaches
   render; mechanism unconfirmed, grammar pinned). Consequence: the checkbox
   error leg sets the RU string via the element property API (`.error=` — same
   reactive property, same render branch; lens-probed equivalent). Boundary
   comments at the targeted-leg site + the openStoryArgs docblock (which the lens
   MINOR sharpened: a raw colon INSIDE a value drops the value; %3A-encoded
   applies).
4. **Stale promo-card protocol quotes corrected to the shipped demo**
   («П-латинум»→«Т-Инвестиции», «Оформить»→«Подробнее») in story + run-sheet.
5. **The stale-dist incident (honest deviation — Spec Change Log 1):** baseline
   pass 1 rewrote the 14 sanctioned PNGs byte-identical to HEAD — impossible after
   visible-content edits (the alarm rule: edits that add visible pixels make
   byte-identity impossible; 10.4's byte-identical invest legs were legitimate
   because shadow-DOM semantics changed no pixels). Forensics: the void pass was
   served a PRE-EDIT dist (run without the wrapper's build step; storybook wipes
   outDir, so staleness only survives a skipped build); pass 2's build refreshed
   the dist but its playwright run died (ERR_CONNECTION_REFUSED — a 600s
   foreground-timeout conversion severed the webServer) with the exit code MASKED
   by a grep pipeline. Redo: lsof → explicit rm -v of the 14 → full unpiped
   test:visual → 1366 passed + exactly 14 written → git: exactly the 14 differ →
   two full stability passes. Shell-hygiene lesson recorded: no pipelines around
   gate commands. The 6.3 contamination class in miniature — caught by the
   impossibility check, not by the suite.
6. **Arithmetic precision (lens NOTE):** the sweep FILE went 88 → 99 tests
   (+11: 6 registry legs from 2 rows + 5 targeted); the 12th new leg (cookie) lives
   in cookie-banner.spec.ts — commit + ledger state this correctly; the executor
   report's «87+12=99» phrasing was off by one on the file split.
7. **Registry stop counts (measured, documented in the registry comments):**
   button variants-and-sizes = 11 (9 size×variant + 2 href anchors); promo-card
   variants = 10 (5 tint + 2 no-art + 3 bleed CTAs; skeleton cards project no
   actions).
8. **Totals:** visual suite 1368 → **1380** legs (+12); unit 942 unchanged
   (ledger cites shipped unit tests; suites untouched); gen/gen:tokens
   byte-stable (lens re-ran, porcelain clean after).

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **Honest process deviation:** the stale-dist + void-pass incident
   (Implementation Notes 5) consumed two extra visual passes; no content impact
   (all 12 legs run against playground/variants content pre-existing on any
   dist). Recorded for the process ledger, not a contract deviation.
2. **Lens MAJOR fix round (b5a35fd):** the NEW input protocol row + run-sheet
   lines inherited a birth-stale «плюс 20 процентов» expectation while the shipped
   demo badge has rendered **+30%** since story 2.1 (git -S: «+20%» never existed
   in source) — a violation of «announcements from the shipped tree» caught by
   the lens. Fixed at four sites (story rows ×2, run-sheet lines ×2) + the 2
   input accessibility PNGs re-taken (already-sanctioned stories) + one stability
   pass 1380/1380. One further birth-stale site lives in the CLOSED §8.1.4
   PROTOCOL-DIGEST (maintainer's executed v1.1.0 record): NOT edited — history
   stays as executed; disposition = maintainer annotates at the v1.2.0 SR
   execution (the living run-sheet v1.2.0 is correct).
3. **First divergence rebase of the cycle:** main advanced (e9f8767) during
   execution (the worktree forked from origin/main = d26feda, before the
   local-only spec commit b95c626); the branch rebased onto e9f8767 — tree delta
   vs pre-rebase head = exactly the two main-side spec files, story content
   byte-identical. SHA map: ecba360→d1a210a, b5a35fd→7ee97e1.
4. Merge round + CI verdicts: see Verification.

## Review Triage Log

Quick review (qr-lens-11-1, 2026-09-26): **FIX-THEN-SHIP — 1 MAJOR / 1 MINOR / 3
NOTE; fix round executed (b5a35fd); post-fix state SHIP.** All five mandated
adjudications returned VERIFIED with the lens's OWN evidence:
1. [ADJ-1] demo figures — diffed byte-equal to Variants sources; all three
   stories inside the sanctioned 14-PNG set.
2. [ADJ-2] cookie walk — independently re-derived on a private port (6199):
   stop order, ring/name/geometry, consent-choice + consumer close all match; the
   refuted one-press reading honestly recorded; the v2 quote cross-checked
   verbatim.
3. [ADJ-3] args boundary — re-derived empirically (ASCII/%20/separator-%3A apply;
   multibyte dropped raw+encoded); property-API equivalence confirmed (identical
   render); no multibyte arg rides the URL channel anywhere.
4. [ADJ-4] baseline round — the apparent spec-file deletion in the diff = branch
   point artifact (executor touches zero _bmad-output files); real diff exactly
   26 files; all 14 PNGs genuinely differ; stale-dist forensics internally
   consistent with serve.mjs + build config.
5. [ADJ-5] scope — 10+ ledger cells opened, citations real and matching; registry
   comments match story content; run-sheet v2 mold with 14 EMPTY result rows;
   gates re-run in worktree all exit 0 (942 unit); regen byte-stable (porcelain
   clean after gen); single scoped commit per round; RU content/EN meta.
- [MAJOR] «+20%» vs shipped +30% (four sites) → fixed in b5a35fd + 2-PNG re-take
  (Change Log 2).
- [MINOR] args docblock colon precision (separator vs in-value) → fixed in
  b5a35fd.
- [NOTE] sweep-file arithmetic phrasing → Implementation Notes 6.
- [NOTE] checkbox run-sheet demo-order wrinkle — inherited + faithfully quoted;
  left as-is.
- [NOTE] stale-dist incident leaves no in-tree artifact — diagnosis verified
  sound; nothing further to audit.

## Verification

- Executor round (worktree, ecba360): research plan → engine deltas (12 legs,
  sweep file 99) → ledger 42/42 + METHOD line → 7 stories + 3 demo figures +
  run-sheet → baseline round (recovered after the stale-dist incident; 14 PNGs
  explicit-delete + update, exactly-14 vs HEAD, ×2 stability 1380/1380) → gates
  all exit 0 → fix round b5a35fd (four +30% sites, docblock, 2-PNG re-take,
  1380/1380, fast gates green). Worktree porcelain-clean at both commits.
- Lens round (qr-lens-11-1): five adjudications VERIFIED with independent
  evidence (own-port walk replay, empirical args re-derivation, structural
  exactly-14, 10+ ledger citations opened, gates re-run exit 0, regen
  byte-stable); verdict FIX-THEN-SHIP; lens killed after delivery (standing
  rule).
- Merge round (orchestrator, main tree): fix verified (grep «20 процент» → only
  the out-of-scope digest site; «30» at 2+2 sites); rebase e9f8767 (Change Log
  3); ff-merge 26 files +941/−10 (exactly the 14 accessibility PNGs + 12
  code/docs files); fast gates green (build → test 942 → lint → typecheck → gen
  → gen:tokens); GEN_DRIFT clean; visual **1380/1380 ×2** (8.2m / 8.2m),
  `lsof -ti:6007` clean before every pass.
- Merge: e9f8767..7ee97e1 ff-only; pushed.
- **CI VERDICT on 7ee97e1: GREEN — run 36243545032 (12:57:05Z → 13:17:24Z, 20.3m,
  gates job success; one spurious local «RED» traced to a network failure inside
  `gh run watch` — the conclusion field is the verdict, re-poll verified).**
  Story 11.1's green head = 7ee97e1.
- Docs round: spec post-sections + ledger 7.2(b) closure + CLAUDE.md totals
  1368→1380 + cycle bullet; docs-head CI verdict recorded below.
- **CI VERDICT on the docs head: GREEN — run 36244834495, gates job success**
  (13:20:27Z → 13:38:09Z, 17.7m, on 694934f; the terminal head's own run
  verified via `gh run` after this line landed — the standing
  non-self-referential close).

