# Story 2.8 — composed application form: UJ-3 walkthrough record + assembly side-by-side (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch.

**Standard (the spec's side-by-side ruling):** this record is about ASSEMBLY —
reading order, cluster, wiring — NOT per-pixel matching. Per-component
fidelity deltas are already recorded in each component's own verify NOTES
(`.playwright-cli/verify/<component>/NOTES.md`); nothing here re-litigates them.

**SR method note:** observations below come from a LIVE keyboard walk of the
built story with axe-tree dumps (role/name/state via Playwright ariaSnapshot)
at each step. Full VO/NVDA narration is a 5.x human task — this record is the
tree-level evidence for it. The Toast leg of UJ-3 was deferred to Story 4.3
and CLOSED THERE (2026-09-23): the composed form now raises the submit-success
Toast after the valid submit, and the walkthrough driver carries the Toast leg
(see the Flow-6 addendum below).

## Files

| File | What |
|---|---|
| `walkthrough.mjs` | the COMMITTED walkthrough driver (real key presses / clicks through the built story; prints the raw observation log these NOTES distill; exits non-zero on any failed check) |
| `side-by-side-light.png` / `side-by-side-dark.png` | reference assembly (top, `captures/application-form-full.png` resized 1104→568 — the reference scaled to the KIT PANEL/form-line width of 568px, the 2.7 like-for-like line; the capture's true DPR2→CSS width is 552, so this is ~103%, NOT a pixel restoration) vs kit render (bottom), 40px gutter |
| `kit-form-light.png` / `kit-form-dark.png` | the composed panel at 568px (both themes), initial state (33%) |
| `kit-form-error-light.png` | the empty-required submit state (story-driven ФИО error via `error` prop) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs,
pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter). The preview's sticky
not-affiliated banner is REMOVED before these element screenshots — it
overlaps the scrolled panel top (the same muted band the visual baselines
carry; page chrome, not the form).

## Reproduce

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6013 &
node .playwright-cli/verify/form/walkthrough.mjs   # 26/26 checks → exit 0
# side-by-sides: magick ../../captures/application-form-full.png -resize 568x \
#   \( -size 568x40 xc:white \) kit-form-<theme>.png -background white -append side-by-side-<theme>.png
```

## The composition (what ships)

`packages/components/src/showcase/application-form.stories.ts` — story
`showcase-application-form--application-form` («Заявка на дебетовую карту
(composed)»). A SHOWCASE directory, not a component dir: a composite form
widget is explicitly out of scope (Epic 2 context), so compositions must not
read as kit atoms in the tree (the spec's «note the choice»).

Parts (all existing, zero edits): tk-progress-bar (announce on), tk-input ×2
(ФИО required + «+20%» badge slot; телефон `type=tel` + autocomplete),
tk-segmented-radio (Да/Нет), tk-select (7 cashback categories), 
tk-thumbnail-picker (6 token-SVG designs, 4+2 wrap at 324px), tk-checkbox
(consent + inline anchor), tk-button (primary/hero «Продолжить»).

WIRING TECHNIQUE (spec Design Notes, as built): uncontrolled components wired
by events into one closure state object; a single `view()` render function
re-invoked via Lit `render(view(), host)` from each handler. Lit diffs the
host in place, so element instances AND FOCUS survive every re-render (the
walkthrough's mid-typing progress updates prove it); only derived bindings
move (ProgressBar value, Input error, Button loading).

COMPLETION FORMULA (spec judgment call, noted): completed fields / total,
rounded — total 6 (ФИО, телефон, гражданство, кэшбэк, дизайн, согласие);
trim-nonempty for inputs, non-empty selection for pickers, checked for
consent. Initial 33% = «Да» + «Чёрная» preselected mirroring the reference
captures (the reference's own «5%» is the site's internal metric — not
reproducible from the spec's formula, noted as an intentional deviation).
SUBMIT_RESET_MS = 1200 (JS timing constant — the select typeahead precedent).

## UJ-3 walkthrough (EXPERIENCE.md Flow 3, live 2026-09-23 — 26/26 checks)

### Flow 3 step 1 — Tab into the form; label + required; badge after label

Tab stops observed (focus chain descends the shadow roots; exactly 8):

1. `tk-input[fio] › input` — ФИО
2. `tk-input[phone] › input` — телефон
3. `tk-segmented-radio › input[value=yes]` — citizenship (Да checked = tab stop)
4. `tk-select › button` — cashback trigger
5. `tk-thumbnail-picker › input[value=black]` — design (checked tile = tab stop)
6. `tk-checkbox › input` — consent
7. `a` — «выгодные предложения» (inline anchor inside the consent label)
8. `tk-button › button` — «Продолжить»

Reading order matches the spec's I/O matrix row exactly (ФИО → телефон →
citizenship → cashback → design → consent → button). Name order proof:
`aria-labelledby="tk-input-1-label tk-input-1-badge"` resolves to
`«Фамилия, имя и отчество *» › «+20%»` — the badge reads AFTER the label,
never over it. The axe tree names the field
`textbox "Фамилия, имя и отчество +20%"` with `[required]` semantics
(aria-required) — no hand-written aria anywhere in the story source (Flow 3's
climax condition holds at composition level too).

Passing THROUGH the empty required ФИО raised the component's own on-blur
error («Обязательное поле», aria-invalid) — frozen 2.1 semantics, observed
and recorded; see the layering note below.

### Flow 3 step 2 — Select Enter/arrows/Enter; SegmentedRadio arrows

- Enter on the closed trigger: `aria-expanded=true`, trigger keeps DOM focus,
  visual focus starts at the selected/first row (`1% Все покупки`).
- 2× ArrowDown: `aria-activedescendant` walks to `5% Аптеки`.
- Enter: picks it — trigger text «5% Аптеки», `aria-expanded=false`, focus
  back on the trigger, ProgressBar 33→50 (cashback now complete).
- SegmentedRadio: ArrowRight moves Да→Нет with FOCUS FOLLOWING SELECTION
  (shadow-active input `[value=no]` is both focused and checked); ProgressBar
  unchanged (either value counts as completed). ArrowLeft returns to Да.

### Flow 3 step 3 — submit error: described-by, no focus theft, heard on revisit

Empty ФИО + Enter on «Продолжить»:

- The STORY's validation sets the Input `error` prop (the spec's driving
  technique): `aria-describedby="tk-input-1-error"` →
  «Укажите фамилию, имя и отчество», `aria-invalid=true`.
- Focus NOT stolen: the focus chain is `tk-button › button` before AND after
  (no move to the field, none to the message).
- ProgressBar unchanged (50) — the failed submit has no progress side effect.
- Revisit: Shift+Tab×7 walks back to the ФИО input with the described-by
  intact — the message is what a SR reads on the next visit.
- Layering observed (both layers per their frozen contracts): typing replaces
  the story message immediately (the story clears its `error` on edit);
  the component's INTERNAL blur message («Обязательное поле», raised by the
  step-1 walk) surfaces under it until the next blur revalidates and clears
  it. Not a defect — the documented internal-vs-consumer division
  (input.ts: internal check = required-only on blur; everything else = the
  consumer's `error` prop).

### Completion + valid submit (ProgressBar narration path)

Fill ФИО → 67, телефон → 83, consent (click) → 100; the ProgressBar's polite
region narrates settled values («Заполнено 33%» observed at entry,
«Заполнено 100%» at the end — announce is ON in this composition). Valid
submit: `aria-busy=true` + spinner with the button WIDTH FROZEN (169.7px →
169.7px measured), resets after 1200ms, ProgressBar stays 100% (the formula —
all six fields complete — not a submit side effect), THEN the submit-success
Toast appears (the 4.3 leg — see the Flow-6 addendum).

### Initial axe tree (step 0 dump, light theme)

```
- text: Уже заполнено 33%
- progressbar "Уже заполнено"
- text: Заполнено 33% Фамилия, имя и отчество
- textbox "Фамилия, имя и отчество +20%"
- text: +20% Мобильный телефон
- textbox "Мобильный телефон": /placeholder: +7 900 000-00-00
- radiogroup "Гражданство РФ?": radio "Да" [checked]; radio "Нет"
- combobox "Выберите повышенный кэшбэк (четыре категории)": Выберите категорию
- listbox "Выберите повышенный кэшбэк (четыре категории)"
- radiogroup "Выберите дизайн карты": radio "Чёрная" [checked]; … ×6
- separator
- checkbox "Соглашаюсь получать рекламу про кешбэк, повышенный процент и выгодные предложения"
- link "выгодные предложения": /url: "#conditions"
- button "Продолжить"
```

(The filled-form final tree adds the selected option rows and checked states;
full dumps print from `walkthrough.mjs`.)

## Axe + baselines

- `axe: showcase-application-form--application-form [light|dark]` — ZERO
  violations (visual suite, and re-run explicitly in walkthrough step 9).
- **Correction recorded (review finding, 2026-09-23):** the walkthrough's
  ORIGINAL step 9 analyzed the page twice without navigating between
  iterations — the last navigation was step 8's dark render, so its
  «[light]» pass was a vacuous mislabeled duplicate of the dark result.
  Fixed: `openStory(page, dark)` per iteration before analyzing; the
  re-run's 26/26 contains genuine light AND dark passes (both zero
  violations). Light-theme coverage was never in doubt — the visual suite's
  own per-theme axe tests had already passed it independently — but the
  walkthrough record now carries its own honest light evidence.
- Baselines (both themes) written via the update flow, then STABLE ×2
  compare runs: 191/191 tests passed three times.
- `pnpm gen` clean (no new element — the manifest diff is empty, as the spec
  predicted).

## Impeccable (AC: zero blockers — recorded evidence)

The CI step's exact invocation form
(`.github/workflows/ci.yml` → «Impeccable design detector (changed UI
files, zero blockers)») run locally on the showcase file:

```sh
.claude/skills/impeccable/scripts/impeccable detect \
  packages/components/src/showcase/application-form.stories.ts
# → no output, exit code 0   (contract: 0 clean / 1 unscannable / 2 findings)
```

Zero findings, recorded 2026-09-23. Supporting context: the file sits inside
the FR-1 zero-hardcoded scan root (its suite passes in `pnpm test`), and the
full audit dimensions are backed by the axe/live-walkthrough/baseline
evidence above.

## Assembly side-by-side — vision check (zai analyze_image, 2026-09-23)

- First pass ran against captures overlapped by the sticky disclaimer banner
  (see Files) and «read» a solid full-width progress bar with no label —
  DISPROVEN by pixels before re-verification (the 2.4/2.7 lesson: verify the
  artifact before trusting a vision read). Pixel probe of the clean render:
  fill blue #1771E6 x26→193 (168px of the 516px track = 33%), track gray
  #E7E8EA x196→541, header text pixels present («Уже заполнено»/«33%»).
- Corrected pass (light): partial ~1/3 blue fill on a labeled strip
  confirmed; all seven composition parts present and named; 4+2 wrap; no
  clipping, overlap or misalignment; the reference's extras (email, DOB,
  legal line, site chrome, cookie popup) accounted for as intentional
  omissions.

## Intentional deviations / assembly decisions (documented, not defects)

1. **Field order follows the SPEC, not the reference's visual order.** The
   frozen I/O matrix fixes the reading order ФИО → телефон → citizenship →
   cashback → design → consent → button; the reference page renders
   progress → design → cashback → ФИО → телефон(+email) → DOB → citizenship
   → consent. Spec wins (sole source of truth); the side-by-side shows the
   difference openly.
2. **Email + DOB + the legal small-print line are omitted** — the spec's
   composition list names exactly seven parts; the reference's extras are
   out of the composition by design.
3. **Only ФИО is required** (spec letter); the reference also marks телефон.
   The submit validation therefore exercises one Input error path.
4. **Badge is «+20%»**, the reference capture's actual value (the spec names
   it); UJ-3's «+30%» in EXPERIENCE.md is the generic pattern wording.
5. **Button hero (56px), right-aligned** — the reference's ~52px sits
   between the kit's frozen 48/56 sizes; hero is the primary-CTA size and
   the single primary of the cluster. 4px delta, noted.
6. **Divider before consent** (border-default hairline) mirrors the
   reference's own divider rhythm (2.0 full-capture reading).
7. **Picker pinned to 324px** for the 4+2 wrap — the kit's frozen 72px tiles
   would fit 6-across in the 520px column; the reference's larger tiles are
   2.6's recorded per-component delta.
8. **Initial 33%, not the reference's 5%** — the demo formula is
   completed/total (spec judgment call); the site's 5% is its own metric.
9. **No `<form>` element** — the button is type=button by design and the
   spec forbids submission wiring beyond the demo reset; checkbox/picker/
   segmented form participation is proven in their own stories.

## Integration gaps found

None blocking; no component was edited (spec Never — and none needed).
Two observations for the record, both already-documented component
semantics rather than gaps: the error-layering interplay in Flow-3 step 3
(internal blur message vs consumer `error` prop), and the ProgressBar
narration depending on the opt-in `announce` prop (off by default — the
composition opts in; consumers who forget it get silent progress, per the
frozen optional-live rule).


## Flow-6 addendum — the Toast leg, CLOSED at Story 4.3 (2026-09-23)

The composed form now raises the confirmation toast on the VALID submit path
(after the 1200ms loading reset), via the imperative `showToast` helper —
the §9-sanctioned form, built on the same `tk-toast` element as the
declarative one. The committed driver's Step 6 grew the leg; re-walked live
(**31/31 checks pass**, up from 23):

- Appears in the shared stack (`#tk-toast-stack`, z via `var(--tk-z-toast)`)
  with `aria-live="polite"` and the message «Заявка отправлена. Менеджер
  свяжется с вами» — UJ-3's «announced politely».
- Focus NOT stolen: the deep focus chain stays on the submit `tk-button`
  through appearance AND collapse; no tabindex anywhere on the toast.
- 5s default, PAUSABLE on hover: hovered ~1.5s in, held ~7s total (past the
  nominal window) — still visible; after the pointer leaves, the ~3.5s
  remainder + exit collapses it, and the stacking host tears down with the
  last toast (the queue's MutationObserver lifecycle, observed live).
- Esc on the empty-ФИО submit path: no toast exists to dismiss (the toast
  only rides the valid path) — the failure/recovery leg from UJ-3 is the
  error message + this confirmation, both without focus theft.

Story-copy note: the form story's note/checklist rows were updated in the
same pass (they described the 4.3 deferral); the application-form visual
baselines were re-taken for the new copy.
