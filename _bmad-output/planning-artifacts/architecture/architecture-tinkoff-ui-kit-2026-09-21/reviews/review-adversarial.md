---
review: adversarial-pair construction
target: ../ARCHITECTURE-SPINE.md
lens: two units one level down, each obeying every AD to the letter, yet incompatible
reviewer: finalize reviewer (adversarial)
date: 2026-09-21
verdict: REVISE — paradigm sound; 5 letter-compliant divergence holes; all closable with targeted AD amendments, no structural change
---

# Adversarial Review — ARCHITECTURE-SPINE.md

Method: for each shared resource that crosses a component boundary, I constructed two builders
working in parallel stories who each satisfy AD-1..AD-11 as written, then asked what breaks when
their output coexists. Five constructions produced real incompatibility. Each closes with a
minimal amendment (tightened AD text or one conventions row), not a new architecture.

---

## Pair 1 — Modal builder vs Select builder: nobody owns stacking, top-layer mounting, or body scroll-lock

**The construction.** Builder M implements Modal: panel + scrim appended to `document.body`
carrying an inline `z-index: 999`; scroll locked by setting `document.body.style.overflow =
'hidden'` on open, restored on close. Builder S implements Select: dropdown rendered inside its
own shadow root, `position: absolute; z-index: 100`. Builder N (Navbar) ships the burger drawer
that EXPERIENCE.md requires to be focus-trapped — and also sets `body.style.overflow = 'hidden'`.

**Why both obey the ADs.** AD-2 bans hard-coded *color/radius/shadow/font* values and document-
level *stylesheets*; an inline z-index on your own element and a mutated `body.style` property
are neither. AD-2 mandates shadow roots — Builder S is the more literal compliance. AD-11
(EXPERIENCE.md) governs per-overlay *semantics* — focus trap, Esc, aria-live — and both pass
every one of those rules. DESIGN.md's token inventory has **no z scale at all**, so no token
exists to reference.

**The incompatibility.** Select opened inside an open Modal: the menu is clipped by the modal
scrim's stacking context (100 < 999) or clipped by the panel's overflow. A Toast fired during a
Modal session lands wherever its own magic number falls. Modal and Navbar drawer both open; Modal
closes first and restores `overflow` — the page now scrolls behind the still-trapped drawer.
All three components individually pass AD-7, AD-8, and AD-11.

**Fix (minimal).**
- AD-3: add a `z` scale to the token pipeline (`--tk-z-base / -popover / -overlay / -toast`).
- AD-2: extend the hard-code ban to "z-index/stacking values" (the enumerated list is the hole).
- AD-11 (or a new AD-12): one shared `overlay` controller under `packages/components/src/_internal/`
  is the single owner of top-layer mounting, stacking order, and a **refcounted** scroll-lock;
  every floating surface routes through it. Name its clients exhaustively — the Capability Map's
  "Modal/Tooltip/Toast" under-governs two floating surfaces EXPERIENCE.md itself specifies:
  the **Select menu** and the **Navbar drawer**.

## Pair 2 — Input builder vs Select builder: component-theming custom-property names diverge

**The construction.** Both themable; both consume only tokens internally; both expose consumer
overrides through CSS custom properties — the one channel AD-2 sanctions. AD-2/AD-3 constrain
the *values*, never the *names*. Input ships `--tk-input-fill`, `--tk-input-border`,
`--tk-input-error-bg`. Select ships `--tk-select-background`, `--tk-select-border-color`,
`--tk-select-invalid-fill`.

**Why both obey the ADs.** Every overridden value resolves to a token; nothing hard-coded;
shadow DOM respected. No AD or conventions row specifies a naming grammar for the per-component
theming surface ("token names mirror site natives" covers only the extracted globals).

**The incompatibility.** DESIGN.md mandates "same field language" for Input and Select, but a
consumer restyling all form fields has no common handle; the docs Theming guide ("per-token
overrides") cannot document a stable grammar; the two fields drift on the same page when one
accepts a token-alias update the other's names don't mirror.

**Fix (minimal).** Add one Consistency Conventions row: component-level custom properties follow
`--tk-<component>-<slot>` with a fixed slot vocabulary (`-fill`, `-border`, `-text`, `-radius`,
`-shadow`, `-focus`); each component var aliases a global token by default, so the common handle
is the global token; new component vars pass the tokens story's grammar review.

## Pair 3 — Button builder (first PR) vs Toast builder (last PR): AD-5's freeze timing hands the API decision to the least representative component

**The construction.** AD-5: "Final React-surface API shape (hook vs prop style) is fixed by the
first component PR and then frozen." The first component (PRD FR-4 #1) is Button: stateless, no
controlled mode, no events beyond click, no imperative surface. EXPERIENCE.md explicitly defers
Toast's "imperative and declarative usage patterns" to architecture — and the spine defers it
again to that first PR.

**Why both obey the ADs.** Fully — the divergence mechanism is the AD itself. Builder B freezes
a props-only pass-through shape, perfectly adequate for Button. Builder T later needs
`toast.show()` or `open`-prop semantics that the frozen shape excludes except by "logged
exception" (FR-3), and the 17 components in between were built against the wrong convention.

**The incompatibility.** One kit, two React idioms: Button→Badge→…→Tabs follow the frozen
prop-only shape; overlays accumulate exceptions. Consumers face a API whose conventions depend
on which component number they imported.

**Fix (minimal).** Tighten AD-5: move the freeze from "first component PR" to **"the first
stateful component PR (Input, #4), which must also decide the imperative-vs-declarative shape
for overlays in the same PR"** — or decide it in the spine now (declarative prop + event
everywhere; imperative controller as a thin wrapper over the same core state machine). Also pin
what "identical semantics" means for controlled/uncontrolled (reflected-only when `value` is
supplied; `defaultValue` for uncontrolled initial) — AD-5 asserts identical semantics without
defining them, leaving two builders free to ship semi-controlled variants that both pass.

## Pair 4 — Input wrapper vs Select wrapper: manual event maps and non-deterministic CEM regeneration

**The construction.** Structural Seed: `react/ # @lit/react wrappers, generated from CEM +
manual event maps`. Two builders wrap in parallel. Input: `value-change` → `onValueChange`,
handler receives the raw `CustomEvent`. Select: `value-change` → `onValueChange`, handler
receives the unwrapped `detail.value` string.

**Why both obey the ADs.** AD-1 requires "events mapped" — both are. AD-5 governs the core
event name and payload (`value-change`, `detail: { value }`) — both cores comply. The wrapper
handler signature is unspecified anywhere.

**The incompatibility.** Under AD-6 strict TypeScript the kit splits compile-time: consumer
`onValueChange={(v) => v.toLowerCase()}` typechecks against Select and breaks against Input.
Compounding: two PRs regenerating CEM + wrappers produce differently-ordered committed
artifacts; a rebase can silently drop one component's wrapper; AD-8 baseline diffs churn on
unrelated regeneration noise.

**Fix (minimal).** Tighten AD-1: (a) one uniform wrapper contract — handlers receive the raw
`CustomEvent` (payload already pinned by AD-5) — the point is *one* written rule, either way;
(b) event maps live in a single owned registry file, not per-PR hand edits; (c) generation is
deterministic (sorted CEM output) and CI runs `pnpm gen && git diff --exit-code` — a component
PR without its regenerated wrapper fails, and regeneration cannot reorder.

## Pair 5 — Component dir A vs component dir B: AD-8 capture environment is per-directory folklore

**The construction.** AD-8 fixes a 1.5% threshold "per component viewport" — but viewport,
device scale factor, fonts, and animation time are unpinned. Builder A captures at 1280×800 /
DSF 1, system-fallback fonts, screenshot after entrance animations settle. Builder B at
1440×900 / DSF 2, Inter, immediately after mount. Both "baseline against tbank.ru captures".

**Why both obey the ADs.** Every literal clause of AD-8 is satisfied in each directory; the AD
is silent on everything that makes two baselines comparable.

**The incompatibility.** Thresholds are percentages of different pixel densities and crops —
incomparable; a third machine (CI) fails both. Toast (5 s auto-dismiss) and indeterminate
ProgressBar pulse yield nondeterministic captures. The font slot is consumer-supplied
(DESIGN.md OQ-2), so unpinned test fonts mean different glyph metrics per contributor. A
cross-component PR then flips which baselines are "wrong", poisoning the re-approval rule.

**Fix (minimal).** AD-8 capture-environment clause: one shared Playwright config — pinned
viewport + DSF; `prefers-reduced-motion: reduce` forced during baseline capture (AD-9 already
guarantees the 0 ms path, so captures become deterministic), with a separate motion-on story
for transition review; brand-font slot pinned to the documented default in the test harness;
baselines stored in one root `__screenshots__/` tree whose README states the environment.

---

## Honorable mentions (logged, below fix threshold)

- **Live-region ownership:** Toast (aria-live polite) and ProgressBar (optional narration) both
  need live-region nodes; appending them to `document.body` is letter-legal under AD-2 (elements,
  not styles). Fold "shared live-region host" into the Pair-1 overlay controller module.
- **Checklist-only enforcement:** AD-5/FR-3 rely on PR checklists; once CEM exists, most of it
  is mechanically checkable (event-name regex, `detail: { value }` shape) — a lint script would
  convert the weakest enforcement point into a gate.
- **Hard-coded spacing** is also outside AD-2's enumerated ban (color/radius/shadow/font); same
  one-line extension as z-index covers it.

## Amendment summary

| Target | Amendment |
| --- | --- |
| AD-1 | Uniform wrapper handler contract; owned event-map registry; deterministic generation + CI `gen --check` |
| AD-2 | Hard-code ban extended: z-index/stacking (and spacing) values |
| AD-3 | Add `z` scale tokens; sorted deterministic output |
| AD-5 | Freeze point → first *stateful* component PR (+ overlay API decided there); define controlled-mode semantics |
| AD-8 | Capture-environment clause: pinned viewport/DSF, forced reduced-motion, pinned test font, single baselines root |
| AD-11/AD-12 | Shared overlay controller: top-layer mount, stacking, refcounted scroll-lock — clients: Modal, Tooltip, Toast, Select menu, Navbar drawer |
| Conventions | `--tk-<component>-<slot>` custom-property grammar + slot vocabulary |

Verdict: **REVISE** — apply the seven amendments above; with them, every constructed pair
collapses, because each shared resource gains exactly one owner.
