# PRD Quality Review — PRD: tinkoff-ui-kit v1 (prd-tinkoff-ui-kit-2026-09-21)

## Overall verdict

This is a good PRD with a real thesis — copy-first recreation, automated quality gates as the product — and the discipline to name its trade-offs (internal quality bar over adoption metrics, the 18-component ceiling as a feature, drift as failure). The risk is concentrated in Done-ness at the seams: the fidelity gate is written as universal ("18/18") while three components are admitted derivations with no Reference Site baseline, the Phase 1/2 vocabulary is never reconciled with §6 MVP scope, and two FRs carry heuristic or under-specified consequences. Fix the four findings below and this is ready to hand to UX and architecture.

## Decision-readiness — strong

Decisions are stated as decisions, with the given-up side named. Table is "dropped by copy-first principle" (FR-4 Out of Scope), the composite form widget is excluded with rationale, and the 18-component cap is elevated to a counter-metric — SM-C1: "the 18-component v1 ceiling is a feature." The stack deferral is a properly recorded decision in two places (§5 "Stack choice — decided in bmad-architecture, not here"; OQ4 "Phase-blocker for FR-3 concretization"), with a handoff, not a dodge. §7 openly gives up adoption measurement: "(Internal quality bar per brief; external metrics deliberately secondary)."

Open Questions are genuinely open — dark palette, package name, docs language, fidelity tolerance — none is rhetorical, and two carry explicit phase-blocker labels for downstream workflows. The single `[NOTE FOR PM]` (§6.2) sits at a real tension (deferring the application form, the Reference Site's flagship assembly), not at a safe checkpoint.

The one place a decision-maker must do the inference work is phase vs. release scope.

### Findings

- **medium** Phase 1/2 vocabulary never reconciled with MVP scope (§3 Glossary vs §6.1, FR-2) — the Glossary defines dark theme, a11y hardening, and motion as "Phase 2," and FR-2 says "Dark theme is a Phase 2 improvement," yet §6.1 In Scope lists "dark theme layer (FR-1, FR-2)," "WCAG 2.1 AA (FR-6)," and "motion set (FR-7)" inside MVP. Whether v1 ships once (both phases inside) or in two releases is never stated; a reader must cross three sections to decode it. *Fix:* one sentence in §6 ("v1 = Phase 1 + Phase 2; phases are internal build order, not release boundaries"), or split §6.1 by phase.

## Substance over theater — strong

No furniture. There is no persona section at all — just three named UJ protagonists, each driving real requirements (UJ-1 → FR-1/FR-4 install-to-ship; UJ-2 → FR-2 theming; UJ-3 → FR-6), and each JTBD line traces to an FR (theming → FR-2, WCAG → FR-6, semver/changelog → FR-11). NFRs are product-specific rather than boilerplate: FR-6 names the actual contrast risks ("yellow-on-black and tinted-background pairs ... in light AND dark themes"), FR-7 binds motion to tokens and names the verification method ("verified via media emulation"), FR-9/FR-10 specify CI-level enforcement. The Vision could not swap into another PRD: "yellow-black, pill-shaped, pastel-carded, 3D-illustrated — exists only inside a closed product." The only furniture-adjacent item is SM-6, scored under Strategic coherence.

## Strategic coherence — strong

The thesis — faithful first (Phase 1), better second (Phase 2), everything gated — is stated in §1 and every section serves it: FR ordering runs foundation (tokens) → components → a11y → motion → docs → gates → distribution; Non-Goals reinforce it ("never invent new brand identity"); and the SM set validates the thesis rather than measuring activity — SM-1..4 are the quality bar itself. Counter-metrics are real and well-aimed: SM-C1 caps component count against SM-1..4; SM-C2 declares "drift from the Reference Site is failure, not freshness" against SM-3. Scope kind (platform/library) matches the scope logic: foundation first, ceiling fixed.

### Findings

- **low** SM-6 has no measurement protocol (§7) — "install-to-first-render (README example) under 15 minutes for a new consumer" says nothing about who measures, how, or with what n; and the header's "external metrics deliberately secondary" slightly overstates, since this is the only external metric in the document. *Fix:* give SM-6 a method (e.g., maintainer-observed install during release candidate) or demote it to a release-checklist item, and reword the parenthetical to "external metrics deliberately excluded except SM-6."

## Done-ness clarity — adequate

The "Consequences (testable)" pattern is applied to all 11 FRs and mostly earns its label: FR-1's "zero hard-coded color/radius/shadow values outside the Token System," FR-4's integrative "Reference Site homepage above the fold can be reassembled from Kit Components plus content," FR-7's "Zero animations run for reduced-motion users," FR-11's "render Button from the README example." This is above PRD average, and FR-10's undefined tolerance is honestly deferred via OQ6 ("pixel-exact vs. perceptual threshold ... set with tooling at architecture") — an acceptable deferral, not a finding.

But three consequences will not survive story creation, and one is unsatisfiable as written. This is the dimension story creation leans on hardest; the findings below are the gap between "adequate" and "strong."

### Findings

- **high** Fidelity acceptance is unsatisfiable for the derived trio (FR-4 Consequences + SM-3 vs FR-4 rows 17–18 and FR-5) — FR-4 demands "Each component's visual output passes a Fidelity check against its Reference Site capture" and SM-3 scores "18/18 components pass Fidelity checks against Reference Site baselines," yet Modal and Tooltip are tagged `[ASSUMPTION]` "derived: floating-card pattern (cookie banner anatomy)" and Toast is "not visible on the homepage." The Glossary defines a Fidelity check as comparison "against a Reference Site capture"; no capture of these three components exists. As written, SM-3 cannot reach 18/18 and story writers cannot draft the fidelity acceptance for 3 of 18 components. *Fix:* scope the fidelity gate to the 15 site-grounded components (SM-3: 15/15) and define a separate derived-component bar — pattern-consistency with the named exemplar plus FR-6/FR-7 checks — or explicitly designate the exemplar captures (cookie banner) as their baselines.
- **medium** FR-3's headline consequence is a heuristic (§4.2 FR-3) — "A developer who has learned one component can predict the API of the next" is not verifiable, and the convention it points to is itself "defined at architecture time." Only the second consequence ("No component introduces a one-off prop-naming or theming escape hatch") is reviewable. *Fix:* restate consequence 1 as existence-and-enforcement of a written API-convention spec (review/lint check), keeping the predictability line as motivation rather than as the test.
- **medium** FR-5 Toast behavior under-specified (§4.2 FR-5) — "auto-dismissing" carries no duration bound, and there is no word on pause-on-hover, dismissal affordance, stacking, or max concurrent toasts. These are product decisions that will surface as story-blocking questions. *Fix:* add bounds (default duration range, single-vs-stack, hover behavior) or tag the deferral to UX alongside the existing styling assumption.
- **low** Card variant scope delegated to "the site's usage" (§4.2 Description) — which background tints ship on which of the four card components must be re-derived from captures at story time. *Fix:* add a variants column to FR-4's table for the card group, or state the rule explicitly ("variant set = those observable in the component's grounding capture").

## Scope honesty — strong

Omissions are explicit and load-bearing: §2.2 Non-Users, six-item §5 Non-Goals (including the stack deferral), and §6.2 with named v2 revisits. De-scoping is done loudly, not silently — Table's drop carries its principle, and the composite-form exclusion carries both rationale and the `[NOTE FOR PM]` on the flagship tension. `[ASSUMPTION]` tags sit exactly where inference happened (Modal/Tooltip rows, FR-5). Open-items density — 6 Open Questions + 3 inline assumptions + 1 PM note — is right-sized for a launch-stakes PRD feeding two downstream workflows, and nothing reads as silently narrowed. (One roundtrip gap is logged in Mechanical notes.)

## Downstream usability — strong

Glossary discipline is real: Reference Site, Token System, Kit Component, Story docs, and impeccable design audit are used verbatim across FRs, UJs, and SM definitions; FR-1..11, UJ-1..3, SM-1..6/C1..2 are contiguous and unique, and every cross-reference resolves (each SM names the FR it validates; §6.1's FR pointers all exist). Sections survive standalone extraction — FRs carry consequences inline rather than deferring to "see above." UJs have named protagonists with inline context (Anya "solo frontend dev on a fintech landing," Marat "maintainer of a customer portal," Lena "keyboard-only screen-reader user") — no floating UJs. Handoff signals are explicit where downstream needs them (OQ1 → UX dark palette; OQ4/OQ5/OQ6 → architecture). The SM-3/derived-trio mismatch is the one place story creation will stall; it is scored under Done-ness.

## Shape fit — strong

Library/dev-tool shape, chain-top (feeds UX → architecture → stories): UJs are deliberately "scaled light per template dial" (§2.3) and SMs are internal-quality rather than user-facing — the right calibration, stated rather than accidental. No over-formalization (no persona sections, no eight-journey theater for a single-audience tool) and no under-formalization (a consumer-facing visual product still gets three concrete journeys and per-component acceptance). Launch governance proper to OSS — semver, changelog, trademark-safe naming, MIT — is present as FR-11 + OQ2 rather than forgotten.

## Mechanical notes

- **Assumptions Index roundtrip:** §9 entries 3 and 4 (Table dropped; "3D illustrations treated as content slots") have no inline `[ASSUMPTION]` tag — they appear only as decisions in FR-4's Out of Scope list. Either tag them inline at the point of inference or reclassify them as recorded decisions in the index.
- **Glossary drift:** "Fidelity check" (§3, FR-4) vs "Fidelity regression checks" (FR-10) vs "Fidelity checks" (SM-3). If the CI gate and the per-component comparison are different artifacts, define both in the Glossary; otherwise unify.
- **External reference:** "brief non-goal" (FR-4 Out of Scope, §2.2) points outside the PRD. §0 declares brief lineage, so this is acceptable, but story extraction of FR-4 standalone loses the composite-form rationale — a one-line restatement would make FR-4 self-contained.
- **IDs/cross-refs:** all FR/UJ/SM IDs contiguous and unique; all "Validates FR-n" and §6 references resolve; §9 section pointers ("§4.2 FR-4") resolve correctly. UJ protagonist naming carries context inline.
