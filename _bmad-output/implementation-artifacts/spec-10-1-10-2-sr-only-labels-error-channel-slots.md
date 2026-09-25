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

- [ ] Probes FIRST: business subheading + invest paragraph (copy + metrics) from the archived
      captures → verify NOTES; typography mappings recorded
- [ ] 10.1: `srOnly` on input + segmented-radio (prop, utility class, jsdoc, stories,
      checklist rows, tests)
- [ ] 10.2: `error` on checkbox (input mold, uid, aria wiring, styles, stories, tests)
- [ ] 10.2: `subtitle` slot on stepper + `page-copy` slot on qr-block (presence molds,
      probe-mapped styles, stories incl. v2 docs pages, tests)
- [ ] Showcase adoptions: business (sr-only label + subheading) + invest (page-copy),
      reference-verbatim copy only
- [ ] `pnpm gen` (CEM + wrappers regen) + `pnpm gen:tokens` byte-stable; DOM-identity proof
      (no-new-props render vs baseline)
- [ ] THE baseline round: sanctioned set explicit-delete + update, both themes, ×2 stable,
      zero movement outside the set; `lsof -ti:6007` clean before each pass
- [ ] Full gates (build → test → lint → typecheck → gen-drift post-commit → visual ×2);
      spec closed; conventional commit EN + push; CI green by `gh run`

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

(executor judgment calls — filled post-execution)

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text: (none yet)

## Review Triage Log

(filled after the quick-review lens)

## Verification

(executor / review / merge rounds + CI verdict — filled as they complete)
