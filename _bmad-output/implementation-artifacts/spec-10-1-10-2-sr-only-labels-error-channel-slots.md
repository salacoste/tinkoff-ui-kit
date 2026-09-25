---
title: 'Stories 10.1 + 10.2 — sr-only label modes, checkbox error channel, stepper/qr-block slots'
type: 'feature'
created: '2026-09-25'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '820a9b8'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Stories 10.1 + 10.2; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (spec-7-4 entry: kit gaps a–e; spec-7-5 entry: gap a — page-copy)'
  - '{project-root}/.playwright-cli/verify/business-landing/NOTES.md (kit-gap list; deviations 12–13; the STEPS block)'
  - '{project-root}/.playwright-cli/verify/invest-landing/NOTES.md (delta 3: the reference paragraph y 1780–1862 between title and tabs)'
  - '{project-root}/.playwright-cli/verify/stepper/NOTES.md («Missing subtitle» record; heading-2 metrics row)'
  - '{project-root}/packages/components/src/{input/checkbox/segmented-radio/stepper/qr-block}/*.ts (current APIs)'
  - '{project-root}/packages/components/src/progress-bar/progress-bar.css.ts:157-170 + combobox-search.css.ts:130-142 (the sr-only 1px-clip utility mold)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-6-2-filter-chips-pagination.md (the two-stories-one-spec batch mold)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Five additive micro-API gaps flagged by the 7.4/7.5 showcases (epics-v3 10.1+10.2,
the ratified batch): (a) tk-input and tk-segmented-radio expose no visually-hidden label mode —
the business form was forced into a visible «Телефон» label where the reference hides it, and
label-less radio groups announce the fallback «Выбор» (7.4a/7.4c); (b) tk-checkbox has no error
channel — the form's consumer error rode the phone input alone (7.4b); (c) tk-stepper cannot
render the reference block's page subheading under the h2 (7.4d); (d) tk-qr-block cannot render
the invest reference's explanatory paragraph between title and tablist (7.5a) — the showcase
shipped without it.

**Approach:** All four are ADDITIVE, default-off surfaces following in-repo molds: `srOnly`
boolean (reflected `sr-only`) on input + segmented-radio keeps the SAME label element/id/name
chain and hides it with the progress-bar sr-only utility; `error` string on checkbox follows the
input error mold verbatim (consumer message → `<p class="error">` + `aria-invalid` +
`aria-describedby`, null/''-tolerant); named slot `subtitle` on stepper and `page-copy` on
qr-block render their wrapper ONLY when slotted (the stepper CTA presence mold). The two
showcases then adopt them (business: phone label → sr-only + the reference subheading;
invest: the reference paragraph → the page-copy slot), closing the recorded deviations. The
byte-stability invariant: with no new prop/slot set, all five components render DOM IDENTICAL
to today — only opting-in stories (and the CEM-driven Api docs) may move baselines.

## Boundaries & Constraints

- **10.1 — `srOnly` on tk-input:** `@property({ type: Boolean, reflect: true }) srOnly = false`
  (attribute `sr-only`). When true AND a label is set, the EXISTING `<label class="label"
  id="…-label" for="…">` gains a modifier class carrying the sr-only utility (the exact
  progress-bar/combobox-search shape: `position: absolute; width/height: 1px; margin: -1px;
  padding: 0; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space:
  nowrap; border: 0` — the label's visible `margin: 0 0 var(--tk-space-8)` neutralizes inside
  it). The label STAYS a `<label for>` (click target + fallback association) and stays first in
  the `aria-labelledby` chain; the badge (independent slot) stays visible; the asterisk rule
  unchanged (aria-hidden inside the label). `srOnly` with NO label = documented no-op (the
  placeholder still names the field — the existing fallback). Placeholder/badge geometry when
  the label hides: the field renders exactly as the label-less variant does today.
- **10.1 — `srOnly` on tk-segmented-radio:** same prop/clamp/utility on the `<span
  class="label" id="…-label">`; the span keeps its id and the `aria-labelledby` wiring; the
  «Выбор» aria-label fallback path (no label at all) is UNTOUCHED. Disabled-group 40%-opacity
  and the WCAG-exempt ruling ride along unchanged (the hidden label is exempt a fortiori).
- **10.2 — `error` on tk-checkbox (the input mold, verbatim semantics):** `@property({ type:
  String }) error?: string` — consumer message, rendered IMMEDIATELY, cleared when the prop
  clears; `''`/null/undefined = no error (the input `#message` null-tolerance, React
  conditional props included). Rendered shape: `<p class="error" id="<uid>-error">` as a
  SIBLING AFTER `<label class="root">` (never inside it — error text inside a label would join
  the accessible name); the native input gains `aria-invalid="true"` +
  `aria-describedby="<uid>-error"` ONLY while a message shows (all three attrs render
  `nothing` when unset — the DOM-identical guarantee). Per-instance uid machinery follows the
  input mold (`tk-checkbox-N`, `static #nextId`), minted only in the error state. Visual = the
  input error line verbatim: icon (the same 16px circle-! svg) + text, `error-on-field`,
  body-s, gap-4, top margin 8. NO internal validation is added (checkbox has none today — the
  documented division: internal checks are tk-input's required-only; everything else is the
  consumer's `error`).
- **10.2 — slot `subtitle` on tk-stepper:** named slot between `heading` and the `<ol>`:
  `<p class="stepper__subtitle"><slot name="subtitle"></slot></p>` rendered ONLY when the slot
  carries content — the `#slotHasContent` + `toggleAttribute('data-has-subtitle')` presence
  mold (the CTA row's exact mirror, slotchange-driven). Renders regardless of `heading`
  presence and in the empty state (slot content is the consumer's authority; no hidden
  coupling). Typography PROBE-GATED from the archived business capture
  (`.playwright-cli/captures/` steps pattern — the 7.3 «Missing subtitle» record): measure
  size/weight/color, map to the nearest tokens (expected neighborhood: body-l/body-m regular,
  text-secondary, centered — the h2 is centered); record the mapping + any Δ in verify NOTES.
  Semantics: a plain `<p>` (the heading ramp stays at 2 — no h3; the a11y story's heading
  structure prose is re-checked, not assumed).
- **10.2 — slot `page-copy` on tk-qr-block:** named slot between the title `<h2>` and
  `<tk-tabs>`: `<div class="qr-block__copy"><slot name="page-copy"></slot></div>`, same
  presence mold (`data-has-page-copy`). Renders when `title` is unset and when `tabs=[]`
  (independent surfaces, the title's own behavior). Typography from the invest composition —
  the reference paragraph measures two lines at y 1780–1862 (invest NOTES delta 3); the
  showcase currently omits it entirely, so the slot styling is probe-mapped from the capture
  (expected neighborhood: body-l regular text-secondary on the cream canvas) — probe first,
  nearest tokens, record.
- **Showcase adoptions (the stories' own «compose without deviations» clause):**
  business-landing — the phone field label goes `sr-only` (deviation 12 closes) AND the steps
  block gains the reference subheading via the subtitle slot (verbatim copy from the archived
  capture; PROBE-GATED on legibility — if the capture's subheading copy is not extractable,
  the flip is SKIPPED and recorded, never invented); invest-landing — the reference paragraph
  lands via the page-copy slot (verbatim from `pattern-qr-loaded.png`, delta 3's record). All
  other showcase content byte-stable.
- **Byte-stability invariant (the round's core guarantee):** with `srOnly`/`error` unset and
  the two slots empty, all five components' rendered DOM is IDENTICAL to baseline_commit —
  wrappers absent, no new attributes, no uid minted. Therefore the ONLY baselines that may
  move (both themes, ×2 stable, explicit delete + update) are the sanctioned set: the legs
  whose stories opt in or whose Api docs regenerate from CEM —
  `components-input--{accessibility,api}`, `components-segmentedradio--{accessibility,api}`,
  `components-checkbox--{variants,accessibility,api}`,
  `components-stepper--{variants,api}` + `components-v2-stepper--page`,
  `components-qrblock--{variants,api}` + `components-v2-qrblock--page`,
  `showcase-business-landing--business-landing`,
  `showcase-invest-landing--invest-landing`. ANY other PNG moving → STOP and investigate
  (the 6.3 contamination class). Per-spec snapshot dirs: check which captures include the
  touched regions (business/invest clips), re-take only those.
- **Story/demo placement (RU content, EN meta — unchanged rules):** the sr-only demos +
  checklist rows land in the input/segmented-radio Accessibility stories (the checklists
  extend — «AT читает имя скрытой метки»); the checkbox error state demo lands in Variants +
  its Accessibility checklist row; the stepper subtitle + qr-block page-copy demos land in
  their Variants stories; the v2 docs pages (stepper, qr-block) gain the new surface in their
  composed demos. Api stories need NO hand edits (apiReferenceDoc renders CEM) — they move
  because the jsdoc additions (`@attr sr-only`, `@attr error`, `@slot subtitle`,
  `@slot page-copy`) regenerate CEM via `pnpm gen`.
- **React surface: ZERO manual work.** Wrappers are CEM-generated (`pnpm gen`); element-class
  typing carries the new props automatically; no new events → `event-map.ts` untouched
  (its completeness net demands entries only for KIT events). Slots reach React consumers
  through children as today.
- **Gates:** full chain build → test → lint → typecheck; `pnpm gen` (CEM + wrappers)
  + `pnpm gen:tokens` (byte-stable — no token changes); post-commit gen-drift
  (`pnpm gen && pnpm gen:tokens && git diff --exit-code -- packages/ tests/`); visual ×2
  zero-unexplained movement; `lsof -ti:6007` clean before each pass; CI green = Actions
  verdict (`gh run`) on the pushed head.
- **Non-goals:** no per-card stepper slots/data fields (deviation 6's split stays); no promo-
  card full-bleed (10.3); no button href (10.4); no aria-label forwarding on input hosts (the
  sr-only label covers the flagged gap); no checkbox internal validation; no new tokens; no
  showcase work beyond the two named adoptions; no baseline re-takes outside the sanctioned
  set.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| input sr-only + label | `sr-only` + `label="Телефон"` | label visually hidden, same id/for, first in labelledby chain; field renders as label-less | visible box/margin remnants → FIX |
| input sr-only, NO label | `sr-only` alone | no-op — placeholder names the field (existing fallback) | invented name → never |
| input sr-only + badge | `sr-only` + badge slot | badge stays visible, chain = hidden label → badge | badge hidden too → FIX |
| segmented sr-only | `sr-only` + label | hidden span keeps id; radiogroup named by it | «Выбор» fallback firing → FIX |
| segmented sr-only, NO label | `sr-only` alone | «Выбор» aria-label fallback unchanged | — |
| checkbox error set | `error="Согласитесь..."` | error `<p>` + aria-invalid + describedby wired to the p id | unwired idref / idref inside label → FIX |
| checkbox error='' / null | React conditional props | NO error state, no attrs, no uid minted | crash/attr remnants → FIX |
| checkbox error + slotted label | slot + error | interplay unchanged (error is a sibling) | name pollution → never |
| checkbox DOM identity | no new props set | DOM identical to baseline_commit (all five) | any diff → FIX before baselines |
| stepper subtitle empty | no slotted content | wrapper ABSENT, `data-has-subtitle` off | empty wrapper adding rhythm → FIX |
| stepper subtitle + heading unset | slot only | subtitle renders alone (no hidden coupling) | — |
| stepper subtitle + steps=[] | slot + empty steps | heading/subtitle/empty-copy all render | — |
| page-copy + tabs=[] | slot + empty tabs | title + copy, no tablist | copy swallowed → FIX |
| showcase flips | business/invest | reference-verbatim copy only | invented showcase copy → never (skip + record) |
| CEM regen | `pnpm gen` | new attrs/slots in CEM + wrappers; Api docs pick up | stale CEM → gen-drift fails |
| Round isolation | any PNG outside sanctioned set | STOP + investigate | blind update → process violation |
| Gates | full chain + visual ×2 + gen-drift | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/input/input.ts` + `input.css.ts` — `srOnly` prop, hidden-label
  modifier (sr-only utility), jsdoc `@attr`
- `packages/components/src/segmented-radio/segmented-radio.ts` + `segmented-radio.css.ts` —
  same mold
- `packages/components/src/checkbox/checkbox.ts` + `checkbox.css.ts` — `error` prop, `#message`
  mold, uid machinery, error `<p>` + aria wiring, error styles (input mold), jsdoc `@attr`
- `packages/components/src/stepper/stepper.ts` + `stepper.css.ts` — `subtitle` slot + presence
  mold + `.stepper__subtitle` (probe-mapped), jsdoc `@slot`
- `packages/components/src/qr-block/qr-block.ts` + `qr-block.css.ts` — `page-copy` slot +
  presence mold + `.qr-block__copy` (probe-mapped), jsdoc `@slot`
- `packages/components/src/{input,segmented-radio,checkbox,stepper,qr-block}/*.stories.ts` —
  demos + checklist rows (RU content, EN meta); `packages/docs/src/v2/{stepper,qr-block}.stories.ts`
  — new surface in the composed pages
- `packages/components/src/showcase/{business-landing,invest-landing}.stories.ts` — the two
  adoptions (reference-verbatim copy)
- `packages/components/src/{input,segmented-radio,checkbox,stepper,qr-block}/*.test.ts` —
  behavior pins (matrix rows above)
- `custom-elements.json` + `packages/react/src/generated/*` — regenerated (`pnpm gen`), zero
  hand edits
- `tests/visual/visual.spec.ts-snapshots/` + per-spec snapshot dirs — the sanctioned re-take
  set (explicit delete + update, both themes, ×2 stable)
- `.playwright-cli/verify/batch-10-1-10-2/NOTES.md` — subtitle/page-copy probe transcripts,
  showcase-copy extraction evidence, re-take manifest

## Tasks & Acceptance

- [x] Probes FIRST: business subheading + invest paragraph (copy + metrics) from the archived
      captures → verify NOTES; typography mappings recorded *(probe (a) copy CORRECTED in the
      review round — see Change Log 1; metrics were sound throughout)*
- [x] 10.1: `srOnly` on input + segmented-radio (prop, utility class, jsdoc, stories,
      checklist rows, tests)
- [x] 10.2: `error` on checkbox (input mold, uid, aria wiring, styles, stories, tests)
- [x] 10.2: `subtitle` slot on stepper + `page-copy` slot on qr-block (presence molds,
      probe-mapped styles, stories incl. v2 docs pages, tests)
- [x] Showcase adoptions: business (sr-only label + subheading) + invest (page-copy),
      reference-verbatim copy only *(after the MAJOR-1 correction — the shipped subtitle is
      the true reference string, render-verified 731px vs capture 729px)*
- [x] `pnpm gen` (CEM + wrappers regen) + `pnpm gen:tokens` byte-stable; DOM-identity proof
      (no-new-props render vs baseline)
- [x] THE baseline round: sanctioned set explicit-delete + update, both themes, ×2 stable,
      zero movement outside the set; `lsof -ti:6007` clean before each pass *(32 legs = exactly
      the sanctioned set, lens-reconciled; 6 legs re-taken AGAIN in the review round)*
- [x] Full gates (build → test → lint → typecheck → gen-drift post-commit → visual ×2);
      spec closed; conventional commit EN + push; CI green by `gh run` *(two commits:
      325631c executor + afb6089 review fix; merge round re-ran all gates independently)*

**Acceptance Criteria:**
- Given `<tk-input label="Телефон" sr-only>` and `<tk-segmented-radio label="…" sr-only>`,
  then no label box renders, the field/group geometry equals the label-less variant, and the
  accessible name still comes from the label text (axe name gate passes on the new stories).
- Given `<tk-checkbox .error=${'…'}>`, then the error line renders with `aria-invalid` +
  `aria-describedby` wired to it; given `error` cleared to `''`/null, then the DOM returns
  exactly to the no-error shape.
- Given slotted `subtitle`/`page-copy` content, then the wrappers render in position; given
  empty slots, then the wrappers are absent and `data-has-subtitle`/`data-has-page-copy` are
  off (DOM identical to baseline).
- Given the merged tree, then every gate exits 0, `git status` is clean (gen-drift included),
  and the only moved PNGs are inside the sanctioned set.

## Implementation Notes

Executor judgment calls (lens-audited; #2 audited FAIL→corrected, see Change Log 1):
1. **Slot-oscillation convergence rule (the round's engine find):** a conditional wrapper in
   two parts (wrapped slot mid-template + bare listening slot at container end) produced a
   COMPETING slotchange from the retired slot whose empty assignedNodes flipped the presence
   flag back — an infinite render loop hanging the canvas in all six slot-bearing stories in
   Chromium; happy-dom never fired the competing event (unit tests stayed green the whole
   time). Fix: presence sync always RE-QUERIES the live tree instead of trusting
   `event.target`. Documented in both components' jsdoc + as STOP 2 in NOTES; regression
   tests pin the flip paths. Lens traced all flip paths adversarially and confirmed the
   committed tree holds exactly one `slot[name]` — always truthful.
2. **Probe (a) copy was INVENTED — caught by the lens, corrected in afb6089.** The shipped
   «Откройте расчетный счет онлайн за 10 минут и получите бесплатно» existed nowhere in the
   captures (the lens refuted it on five deterministic axes; the true line
   «Если у вас не зарегистрирован бизнес, сначала оставьте заявку на регистрацию — поможем
   бесплатно» even reads off the executor's OWN x6 upscale). Root cause was a discipline
   asymmetry: probe (b) carried the render-width verification table, probe (a) did not —
   and the NOTES claim «glyph-decoded + render-confirmed» was false for (a). Post-fix
   render verification: true string 731px vs capture ink 729px (**Δ0.27%**), invented
   string 478px (Δ34%). LESSON (standing for every future copy probe): a copy extraction
   without a render-width check against the capture ink is an UNVERIFIED claim.
3. **Bare listening slot sits at the container END** (not mid-template): a mid-template slot
   broke the `A + B` sibling rhythm of adjacent blocks (stop-probe 1; regression-pinned).
4. **Two spec-expectation refutations, both by pixels** (the spec's own probe-gate
   mechanism): both slots are body-m/400/text-primary on white — NOT the expected
   body-l/text-secondary on cream. Recorded with Δ in NOTES.
5. **New hooks `--tk-stepper-subtitle` / `--tk-qr-block-copy`** — CONVENTIONS §6 grammar
   with token defaults (the input four-hook precedent); lens-ruled within the house
   pattern. Token layer untouched (tokens.css/ts byte-identical).
6. **Composite spacing judgments:** `.stepper__subtitle + .stepper__empty` = space-32
   (composite, no reference pair for the zero state); qr copy→tabs = space-48 while the
   title-only distance measures space-40 (recorded in NOTES).
7. **qr-block Variants third figure** merges the title-unset + tabs=[] degradations into
   one figure.
8. **A neutral unit-test fixture** (stepper.test.ts `subtitleP()`) retains a substring of
   the retired invented phrase — not reference copy, never renders; left as-is per the
   content-only fix mandate.
9. Unit totals after the batch: **930** (root 147 + tokens 17 + components 696 + react 70)
   = 901 + 29 (input +5, segmented-radio +4, checkbox +6, stepper +7, qr-block +7); zero
   deleted/skipped (lens re-ran the unit suite: 696/696 components).
10. React surface byte-identical (thin `createKitComponent` wrappers carry no prop
    enumeration — new props flow through element typing; CEM +200 lines).

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **MAJOR-1 correction (review round, afb6089):** the business showcase subheading shipped
   invented copy (see Implementation Notes 2) — the frozen matrix row «invented showcase
   copy → never (skip + record)» was violated unknowingly, not deliberately. Fix: true
   reference string at all four sites, NOTES probe (a) rewritten honestly (incl. MINOR-1:
   the capture path corrected to `captures-v2/business/full.png`), 6 tainted baselines
   (business-landing ×2, stepper--variants ×2, v2-stepper--page ×2) explicitly deleted and
   re-taken, full gates re-run. The spec's probe-gated showcase-flip path executed as
   frozen — the copy leg of probe (a) was simply wrong until the lens caught it.
2. Review round (afb6089, second commit — 325631c not amended, the 9.2 precedent):
   render-subtitle-verify.mjs committed as the discipline artifact.
3. Merge round: this docs commit (ledger closures + CLAUDE.md cycle state).
4. **CI-remediation round (orchestrator, after the afb6089 RED):** test-driver fix only —
   no component/story/token bytes touched. The invest qr-tab leg raced the lazy QR decode
   at rect-measurement time (see Verification); fix = decode-wait + CI-only per-leg
   tolerance 0.03 + light baseline re-take (dark was already at the loaded height). New
   standing rule for every interactive-baseline leg: await lazy-media decode BEFORE
   measuring any rect (the «revalidate after await» iron rule's media case) — recorded in
   deferred-work.md next to the port-6007 rule.

## Review Triage Log

Quick review (qr-lens-10-x, 2026-09-25): **FIX-THEN-SHIP — 1 MAJOR / 1 MINOR / 1 NOTE;
MAJOR+MINOR fixed in afb6089 before merge.**
1. **[MAJOR] invented showcase copy** (Implementation Notes 2) — refuted by the lens on five
   independent deterministic axes: glyph-classifier decode on three artifacts (identical),
   the executor's own x6 upscale reading the TRUE line, cluster arithmetic (74 vs ~50),
   advance-width model (true 763px-predicted vs shipped 507px against 729px capture ink),
   structure (em-dash/no-digits vs «10»/no-dash). Contaminated 4 source sites + NOTES +
   6 baselines. FIXED: afb6089.
2. **[MINOR] NOTES cited a nonexistent capture dir** (`captures-v2/business-landing/` →
   `captures-v2/business/`). FIXED: folded into the NOTES rewrite.
3. [NOTE] strict DOM-identity reading: the bare listening slot is one extra shadow node vs
   baseline — accepted per the AC's operative definition (every in-repo presence mold keeps
   a persistent slot node); recorded, no action.
4. Checklist: tasks 1/5 and AC-3's showcase-flip leg FAIL on the executor commit — all
   PASS on afb6089 (the lens independently re-ran gen+gen:tokens (zero drift) and the
   unit suite (696/696) on 325631c; convergence rule judged SOUND with all flip paths
   traced; hooks §6 PASS; baseline containment 32=32 reconciled exactly; iron rules held).
   Probe (b) (invest page-copy) verified GENUINE by the lens's own decode + width model.

## Verification

- Executor round (worktree, 325631c): probes → gen/gen:tokens (byte-stable) → build → test
  (930) → lint → typecheck — all exit 0. Visual chronology with two honest STOPs: run 1 =
  39 fails (4 non-sanctioned rhythm diffs → listening-slot position fix, Notes 3), run 2 =
  67 fails (canvas hang → slot-oscillation convergence fix, Notes 1), run 3 = 31 fails =
  exactly the sanctioned set → delete+update (32 PNGs incl. 2 invest per-spec clips) →
  **1368/1368 ×2** (8.4m each). Post-commit gen-drift clean.
- Review-fix round (afb6089): true string at 4 sites, old string gone from shipped
  surfaces; NOTES probe (a) honest + render table (731/729 Δ0.27%, 478/729 Δ34%); 6 PNGs
  deleted + re-taken (exactly 6 "writing actual"); **1368/1368 ×2** (8.2m each); full
  gates re-run green (test 930); gen-drift clean; 325631c untouched.
- Merge round (orchestrator, afb6089): fast gates green (build → test 930 → lint →
  typecheck → gen → gen:tokens); GEN_DRIFT_CLEAN; worktree porcelain clean; visual
  **1368/1368 ×2** (8.2m / 8.3m) under load ~9 with zero starvation; `lsof -ti:6007`
  clean before every pass. Orchestrator independently verified the fix (grep of both
  strings, NOTES content, afb6089 stat = 11 files exactly).
- Merge: f3e90a5..afb6089 ff-only (85 files, +1533/−38); pushed.
- **CI VERDICT on afb6089: RED — run 36189883158 (1 failed / 1367 passed, 19.1m)** — the
  invest-landing qr-tab interactive leg (`invest landing [1280] cluster › interactive
  baseline: the qr-block region with the second platform tab active [both themes]`):
  expected 1200×274, received 1200×442. Pixel forensics on the run's artifacts (bands
  identical to y257; the tail 16px byte-profile-equal — the QR's top rows): the leg measured
  the block's rect IMMEDIATELY after the tab click, racing the revealed panel's
  `loading="lazy"` QR decode — macOS baselined the PRE-decode height in the light iteration
  (274: tile = padding only) while its own dark baseline had caught the LOADED height (the
  committed dark PNG was already 1200×442 — byte-identical to the post-fix re-take; the race
  was live on macOS all along, resolving per-iteration); ubuntu measured loaded-in-both.
  Second layer: the clip's small area (1200×442) amplifies cross-platform text-advance
  deltas of the title/copy/tablist lines to ~1.45% vs the 1.5% default (the QR image itself
  diffs ZERO cross-platform; the full-story legs carry the same deltas at ~0.2% inside a
  full 1280 frame). **Remediation (orchestrator round, the two CI precedents):** decode-wait
  (`img.decode()` on the visible panel QR) before the rect measurement — the 9.1 combobox
  driver-fix mold, and the CLAUDE.md «revalidate after await» rule verbatim; plus a CI-only
  per-leg `maxDiffPixelRatio: 0.03` (the CI_VISUAL_TOLERANCE tooltip mold — local compare
  stays strict at the config default); light baseline re-taken at the loaded height (the
  only moved PNG; dark byte-identical, no diff). Commit: 15a5ac6.
- **CI VERDICT on 15a5ac6: GREEN** — run 36195175278, completed success: gates job green,
  visual **1368/1368 (15.4m)** — the remediated leg passes on ubuntu at the loaded-height
  baseline with the 0.03 clip tolerance. Story 10.1+10.2's green head = 15a5ac6.
