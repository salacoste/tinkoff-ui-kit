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

- [ ] Engine deltas: 2 registry rows (stops measured + recorded) + targeted
      new-mode legs (input/segmented/checkbox/stepper/qr-block) + the cookie
      7.2(b) leg — all green locally
- [ ] Ledger `group-VI.md` (7 rows × 6 checks, RU, real pointers) +
      METHOD.md extension note
- [ ] SR protocol rows in the seven stories (announcements from the shipped
      tree) + `SR-RUNSHEET-v1.2.0.md` (empty Результат rows)
- [ ] THE baseline round: sanctioned set explicit-delete + update, both
      themes, ×2 stable, zero movement outside; `lsof -ti:6007` clean
- [ ] Full gates (build → test → lint → typecheck → gen-drift post-commit →
      visual ×2); spec closed; conventional commit EN; CI green by `gh run`

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

(post-execution)

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
(none yet)

## Review Triage Log

(post-review)

## Verification

(post-rounds)
