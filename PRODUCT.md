# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Undecided by explicit user decision (2026-09-20): stack selection is delegated to the BMAD planning flow (`bmad-architecture`), which the user will trigger himself. Do not pick a stack ad hoc before that artifact exists.

## Users

Open-source developers. The primary audience is the community building web apps who want a production-grade, Tinkoff (T-Bank)-style component library. Public API clarity, documentation, examples, semantic versioning, and changelogs are product surfaces, not afterthoughts.

## Product Purpose

A UI kit that recreates the Tinkoff (T-Bank) website design language and then improves on it. Success means: (1) Phase 1 — a faithful 1:1 recreation of the reference's components and tokens; (2) Phase 2 — surpass the original on accessibility, systematic design tokens with theming and first-class dark mode, and modernized visuals and motion.

## Positioning

The recognizable fintech design language of one of the most-used Russian banking products — rebuilt as a free, open, accessible, token-driven library. The original is closed; neighboring generic kits (MUI, Ant, shadcn) don't carry this identity.

## Operating Context

Development is agent-driven: BMAD planning artifacts in `_bmad-output/`, impeccable design gates (detector hooks on every UI edit), transitions.dev motion references, inspo MCP for real-site design references. Package manager: pnpm; Node >= 20.

## Capabilities and Constraints

- Phase 1 is a faithful recreation of the reference site's components and design tokens; improvements come after the copy is true.
- Confirmed improvement axes (user-selected): a11y (WCAG, keyboard, contrast, ARIA); design tokens + dark mode + theming; modernized visuals and motion.
- Unofficial study project: no T-Bank trademark use in published names/branding; no claim or implication of official status.
- Published as an original re-implementation inspired by the reference — no scraped proprietary assets.

## Brand Commitments

Repo name: tinkoff-ui-kit (github.com/salacoste/tinkoff-ui-kit). Unofficial, not affiliated with T-Bank.

## Evidence on Hand

- Reference: the live Tinkoff (T-Bank) website (tinkoff.ru) — the visual source of truth for Phase 1.
- inspo MCP connected: 832 real production sites with palettes/fonts for cross-reference.
- No real product copy, usage data, testimonials, or original source code on hand — future work must not fabricate any.

## Product Principles

1. Copy first, improve second — improvement never drifts ahead of fidelity to the reference.
2. Accessibility is a floor, not a feature — from the first improved version on, a component that is not WCAG-AA does not ship.
3. Tokens before pixels — colors, type, spacing, and motion live in the token system, never hard-coded.
4. Library ergonomics equal component quality — API, docs, and versioning are first-class product surfaces.
5. Respect the source — unofficial recreation; no trademark or official-status claims in anything published.

## Accessibility & Inclusion

WCAG 2.1 AA is the confirmed target for every component (user-selected improvement axis). Keyboard navigation, contrast, and ARIA semantics are in scope from the first improved release.
