---
title: "Product Brief: tinkoff-ui-kit"
status: final
created: 2026-09-21
updated: 2026-09-21
---

# Product Brief: tinkoff-ui-kit

## Executive Summary

tinkoff-ui-kit is a professional, open-source web UI kit that recreates the design language of the
Tinkoff/T-Bank website (tinkoff.ru) — one of the most recognizable fintech interfaces in the
Russian-speaking market — and rebuilds it as a modern, accessible component library. The original
design is battle-tested on millions of users but closed: no public web component library exists.
This kit extracts its design system (palette, typography, spacing, radii, shadows, motion) and
rebuilds it as a token-driven library that any developer can install and use.

The kit ships in two phases: **Phase 1** recreates the reference faithfully — exact tokens and
components as they exist on the site; **Phase 2** layers the improvements the original lacks:
WCAG 2.1 AA accessibility, systematic design tokens with first-class dark mode, and modern
interaction motion. Every component passes an automated design-quality gate (the impeccable
design audit) before it ships. Public from day one: the repository is already open; npm
publication is planned.

## The Problem

Developers building fintech-style products in the Russian-speaking market face an odd gap. The
region's most recognizable banking interface — Tinkoff/T-Bank's yellow-black consumer web — has no
public design system. Tinkoff does open-source a web kit (Taiga UI), but it is Angular-only and
serves the internal/business-tooling aesthetic, not the consumer tinkoff.ru look. The internal
"Tinkoff Design System" was documented publicly in 2017 (Habr series) but never open-sourced, and
no public mobile kit exists either. No third-party code kit recreating the consumer language
exists — as of this research (2026-09), the only "tinkoff ui kit" repository on GitHub is this
project; the closest artifacts are unofficial Figma screen recreations.

So a developer wanting that aesthetic today must either screenshot-and-copy ad hoc (no tokens, no
consistency, no a11y) or settle for generic international kits (MUI, Ant Design, shadcn/ui, Narmi)
that carry no regional identity. The cost: fintech projects either look like every other admin
panel, or burn weeks hand-rolling an approximation of a design language they cannot systematically
reference. Accessibility suffers first — copied markup rarely carries keyboard support, contrast
discipline, or ARIA semantics.

## Who This Serves

**Primary:** open-source developers building web apps (fintech, dashboards, landing pages) who want
a production-grade library with the Tinkoff aesthetic — public API clarity, docs, semantic
versioning, and changelogs are product surfaces, not afterthoughts.

**Secondary:** the maintainer's own projects and portfolio — a showcase of systematic
design-engineering craft.

## The Solution

A token-first component library that treats tinkoff.ru as the visual source of truth:

- **Design tokens extracted from the live reference** — palette, type scale, spacing, radii,
  shadows, motion curves — captured with browser automation (playwright-cli) and cross-referenced
  against real-site design data (inspo MCP), then formalized as the kit's token system.
- **Core web component set (~15–20 components)** across primitives, forms, navigation, cards,
  overlays, and data display. [ASSUMPTION → confirmed] the exact component list will be fixed
  during PRD from a structured inventory of the reference site.
- **Improvements layered on the faithful copy**: WCAG 2.1 AA (keyboard, contrast, ARIA), theming
  via tokens with dark mode out of the box, and motion from vetted transition recipes
  (transitions.dev), all respecting `prefers-reduced-motion`.
- **Quality as a pipeline, not a promise**: every component is gated by the impeccable design
  audit; passing it is part of the definition of done.

## What Makes This Different

- **Novel, verified niche** — the first code-level web recreation of the Tinkoff consumer design
  language; the verified gap is documented in The Problem above.
- **The reference is a real, mass-market fintech product** — the kit inherits a design language
  proven on millions of users, not a hypothetical design-school aesthetic.
- **Copy first, improve second** — fidelity to the reference is a hard constraint; improvements
  (a11y, dark mode, motion) never drift the kit away from the recognizable original. This ordering
  is what separates it from "inspired-by" kits that keep only a vague resemblance.
- **Quality gate is automated and public** — detector findings are treated as blockers; passing
  the audit is visible in the repo.
- **Honest positioning** — an unofficial study/recreation project, clearly labeled, with no
  trademark use or official-status claims; distinct from Taiga UI in framework target and
  aesthetic source.

## Success Criteria

v1 is successful when the **internal quality bar** holds across the whole set (internal quality is
the user-confirmed priority; external metrics like stars/downloads are explicitly secondary):

1. Every shipped component passes the impeccable design audit — zero blocker findings.
2. Every component meets WCAG 2.1 AA (keyboard navigation, contrast, ARIA semantics).
3. Dark mode works for every component via the token system — no component-specific hacks.
4. Every component has documentation with live stories/examples.
5. Phase-1 fidelity: side-by-side comparison with the reference site holds up
   (screenshot-driven verification).

## Scope

**In (v1):**
- Design token system extracted from tinkoff.ru (palette, type, spacing, radii, shadows, motion)
- Core web component set: primitives, forms, navigation, cards, overlays, data display (~15–20)
- Light + dark themes via tokens; a11y (WCAG 2.1 AA) in every component
- Interaction motion from transitions.dev recipes (reduced-motion respected)
- Component documentation with stories; public repo; MIT license; npm package

**Out (v1, explicit):**
- Brand redesign — the visual language stays the reference's; we copy and improve, never reinvent
- Native mobile patterns (iOS/Android) — web only
- Data visualization: charts, diagrams, dashboards
- Complex business widgets (e.g., full payment forms as packaged features)
- Other T-Bank/Tinkoff domains beyond tinkoff.ru — the reference base expands to additional
  domains the maintainer will designate after v1 completes
- Stack decision — deliberately deferred to the architecture phase (bmad-architecture), not
  chosen in this brief

## Vision

If v1 lands, tinkoff-ui-kit becomes the default starting point for Russian-speaking fintech web
projects that want recognizable, trustworthy aesthetics without sacrificing accessibility — and a
reference example of building a design system from a live product with an automated quality
pipeline. From there the reference base grows beyond tinkoff.ru to the other T-Bank domains the
maintainer designates (each added with the same capture-and-improve pipeline), the catalogue
deepens (fintech blocks, marketing sections) driven by real adoption, and the kit stays true to
its source: an unofficial, open, improved edition of a design language people already trust.
