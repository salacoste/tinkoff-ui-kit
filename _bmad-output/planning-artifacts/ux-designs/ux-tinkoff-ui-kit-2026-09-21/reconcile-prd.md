---
title: "reconcile-prd: UX spines vs prd-tinkoff-ui-kit-2026-09-21"
status: final
created: 2026-09-21
inputs:
  - prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
targets:
  - ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md
  - ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md
---

# Reconciliation: PRD → UX spines

Verified clean (no gap): FR-2, FR-4 (19/19 components, both tables, variants incl. FeatureCard
charcoal editorial, consent-as-composed-example), FR-5 (full overlay contract), FR-6 (Accessibility
Floor incl. contrast pairs both themes), FR-8 (Component page ×19 matches FR-8 consequences),
UJ-1/2/3 (Flows 1–3), OQ-1 (authored dark theme, evidence + assumptions marked), OQ-5/OQ-6/OQ-7
(correctly deferred to architecture), SM-2/SM-4/SM-5/SM-C2 (drift rejection cited explicitly).
Glossary vocabulary is used consistently; "Phase 1/2" wording is absent but scope is intact (both
phases in v1), so benign.

## Gaps

1. **Motion and shadow tokens missing from the Token System of record (FR-1, FR-7, SM supports).**
   EXPERIENCE.md Interaction Primitives defers to "DESIGN.md motion tokens (site curves/durations)",
   and FR-7 requires durations/curves to come from Token System motion tokens — but DESIGN.md
   frontmatter has no `motion:` section at all (only durations 150ms/75ms/0ms appear inline in
   EXPERIENCE.md State Patterns). Likewise `shadow: default / modal / tooltip` are referenced by
   component specs but never declared as tokens; elevation values exist only in prose, and no
   `dark-tint-charcoal` exists for the charcoal FeatureCard variant in dark mode. The declared
   frontmatter (self-declared "system of record") is incomplete vs FR-1's "motion curve set".

2. **FR-11 unofficial labeling absent from the shipped docs-site surfaces.** EXPERIENCE.md's IA
   defines the kit's product surfaces (docs index, component page, token reference, theming guide);
   PRD FR-11 requires unofficial/no-trademark disclaimers on everything published, docs site
   included. No surface, slot, or element carries it, and trademark-safe naming (OQ-3) is not
   flagged anywhere in the spines.

3. **FR-9 / FR-10 quality-gate regime has no anchor in either spine (SM-1, SM-3 implications).**
   The impeccable merge gate, Reference-Site visual-regression baselines, Fidelity checks (16) and
   Pattern-consistency checks (3) appear nowhere. DESIGN.md documents the anatomy those checks
   would consume, but nothing records the check regime or hands it to architecture/epics. May be
   judged out of UX lane — but then it should be routed explicitly, not silently dropped.

4. **OQ-2 resolved by half.** DESIGN.md Typography decides the font-token target stack and the
   consumer-supplied brand-font slot, but the PRD-required *recommended open (ideally
   metric-compatible) alternative* is never named and never explicitly deferred — the strategy
   decision OQ-2 asks for is left implicitly open while reading as closed.

5. **Silent scope addition under OQ-4 (reverse direction).** EXPERIENCE.md Voice & Tone requires
   all shipped default component copy to ship in both RU and EN string slots `[ASSUMPTION]`. The
   PRD's OQ-4 is single-language *docs* for v1 and contains no bilingual string-slot requirement;
   this adds i18n surface area with architecture impact, decided in the spine rather than routed
   back to the PRD. Either prune to the chosen single language or raise a PRD change.
