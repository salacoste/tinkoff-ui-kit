---
stepsCompleted:
  - v3-epics-ratified (maintainer salacoste, 2026-09-25: scope as drafted — 9 stories;
    10.4 button-href INCLUDED on the cycle; font-mono INCLUDED with the docs consumer)
inputDocuments:
  - _bmad-output/implementation-artifacts/deferred-work.md (the single ledger — every story below closes named entries)
  - _bmad-output/planning-artifacts/epics-v2.md (the mold; v2 COMPLETE, released as tag v1.1.0)
  - RELEASE.md (§8 flow reused as the §9/release mold; §8.4 gate findings)
  - .playwright-cli/verify/{business-landing,invest-landing}/NOTES.md (the 7.4/7.5 deviation registries — the API gaps)
  - .playwright-cli/verify/{stepper,v110-fresh-clone}/NOTES.md (brown-badge probes; consumer recipe deltas)
runMode: awaiting ratification (post-v1.1.0 planning round, maintainer present)
---

# tinkoff-ui-kit — Epic Breakdown v3 (v1.2.0: API completions + token truth)

v1 (Epic 1–5, 38 stories) → v1.0.0. v2 (Epic 6–8, 14 stories) → v1.1.0 (tagged e09fd3c,
all gates + fresh-clone consumer verified). This cycle is a MINOR release assembled almost
entirely from the deferred-work ledger: the API gaps the two landing showcases exposed but
deliberately did not patch, the token decisions the maintainer has now taken (brown badge
ink: refusal flipped to adoption at v1.2.0 per the 7.3 revisit clause), and two generator
truth debts. The v1 component-story gate (FR-16) applies VERBATIM. Non-goals: transitions.dev
literal folding (still no consumer), packages/react peer-only layout (recipe docs already
cover the vite dedupe class), iOS momentum-scroll + NVDA (hardware-gated, maintainer-side).

## Epic 9: Token layer — brand ink, geometry, generator truth

### Story 9.1: Token additions + the single v1.2.0 baseline round

As a kit maintainer, I want the three deferred tokens added through DESIGN.md governance
(brown badge ink ≈ #8D6040 as a semantic with the stepper sheet flipped to consume it —
the 7.3 refusal's recorded revisit; radius ≈32 for the bento flag; `--tk-font-mono` with
the docs code blocks as its first consumer),
So that brand-correct renderings stop needing per-consumer hook overrides (7.3, 7.4f, 1.5).
- DESIGN.md + `pnpm gen:tokens` + `pnpm gen`; contrast table extends (brown-on-cream pair
  must clear AA or the mapping stays — the probe says ink-on-cream passes);
- stepper baselines re-take (deliberate mini-confirm, maintainer batch per the 5.6 mold);
- THE ONE baseline round of the cycle also carries the tooltip text-advance structural fix
  (story content wide enough to hit the pill max-width cap, pinning geometry — retires the
  CI-scoped tolerance recorded in the CI-restoration round).

### Story 9.2: Generator truth (annotations + import matrix)

As a kit maintainer, I want TOKEN_NOTES' AA-override/[ASSUMPTION] annotations derived
mechanically from the DESIGN.md body (not string literals that go silently stale), and the
AD-4 import matrix single-sourced (eslint config derives the boundary test + docs entries),
So that a DESIGN.md body edit can no longer diverge from generated truth (1.2, 1.1 debts).
- Zero visual churn expected (generator/test refactor; gen-drift check pins byte-stability
  where applicable); CI stays green; the boundary test's file-type coverage gap class dies.

## Epic 10: Component API completions (the showcase-exposed gaps)

### Story 10.1: sr-only label modes (input + segmented-radio)

As a form author, I want `srOnly`/label-mode channels on tk-input and tk-segmented-radio,
So that visually-unlabeled forms (the business form cluster mold) still announce correct
names to screen readers (7.4a + 7.4c — the a11y pair of the flagged gaps).
- Visible label unchanged; sr-only mode = the reference's visually-hidden pattern, axe
  clean, name-from-authority; keyboard checklists + SR protocols extend.

### Story 10.2: Error channel + the two slot additions

As a form/marketing author, I want an error channel on tk-checkbox (consumer-error riding
the field alone today), a subtitle slot on tk-stepper cards, and the page-copy slot on
tk-qr-block between title and tablist,
So that the business form and the invest install cluster compose without deviations
(7.4b, 7.4d, 7.5a — the three additive micro-APIs).
- All additive; existing stories byte-stable except new variants; checkbox error follows
  the input error mold (aria-invalid + describedby wiring).

### Story 10.3: Promo-card full-bleed art mode

As a marketing author, I want promo-card art rendering UNDER the text block (not only the
actions-stage above-content mode),
So that reference bento cards with full-bleed photography compose from the kit (7.4e).
- Mode channel on the existing data-has-art anatomy; contrast guard for text-over-art
  (scrim token if the reference carries one — spec decides from the capture).

### Story 10.4: Button href mode (anchor rendering)

As a page author, I want `href` on tk-button rendering an anchor with button styling,
So that CTAs like «Скачать для iOS» navigate instead of requiring onClick plumbing (7.5b —
the v1-API extension that needs its own spec; breaking-ADJACENT, additive prop).
- Anchor semantics (rel/noopener defaults for external), focus/keyboard parity with the
  button path, wrapper regenerates; v1 stories byte-stable (no href = literally today's
  render); CHANGELOG `Added` + semver note.

## Epic 11: v1.2.0 verification + release

### Story 11.1: Sweep deltas on the new surfaces

a11y-sweep engine legs for the new API modes (10.1–10.4); dark legs auto via the visual
suite; SR protocol sections extend in the touched stories (execution stays maintainer-side
per the §8.1.4 mold — run-sheet + digest pattern).

### Story 11.2: Docs completion (5.5/8.3 mold)

Component pages gain the new props/slots (CEM-driven, auto); the token reference auto-gains
9.1; docs code blocks consume `--tk-font-mono` (the token's first surface); getting-started
carries the vite-dedupe line (already in README — cross-link).

### Story 11.3: Verification ledger + release v1.2.0

Fidelity rows where reference-grounded (brown badge vs the stepper probes; bento radius vs
the business capture); yellow-discipline audit extension; kit-wide impeccable; **maintainer
baseline batch PRE v1.2.0** (extends the 5.6/8.4 package); RELEASE.md flow re-used verbatim
(§8 mold): gates → tag v1.2.0 (maintainer-only) → fresh-clone check (§8.4 recipe now
self-sufficient with the vite.config dedupe).

---

*Sequencing: 9.1 → 9.2 → [10.1 + 10.2] → 10.3 → 10.4 → 11.1 → 11.2 → 11.3
(9.1 first — the baseline round and the new tokens unblock 10.x side-by-sides; 10.1+10.2
batch as one spec round per the v2 [6.2+6.3] precedent; 11.x mirrors 8.x. Everything is
dependency-loose after 9.1; total 9 stories.)*
