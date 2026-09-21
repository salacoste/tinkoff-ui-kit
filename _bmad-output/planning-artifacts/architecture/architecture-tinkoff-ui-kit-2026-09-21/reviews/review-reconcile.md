---
title: Reconciliation Review — Architecture Spine vs Inputs
date: 2026-09-21
kind: reconcile (read-only pass)
spine: ../ARCHITECTURE-SPINE.md
inputs:
  - ../../prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
  - ../../ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md
  - ../../ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md
result: 11 gaps (PRD 4, DESIGN 2, EXPERIENCE 5); no contradictions on stack, tokens, font strategy, or OQ resolutions
---

# Reconciliation Review — Architecture Spine

Method: line-by-line carry check of every FR, OQ, constraint (PRD §5.1), token/font/AA/dark
material (DESIGN.md), and behavioral/a11y/responsive contract (EXPERIENCE.md) against the
spine's decisions, conventions, capability map, and deferred list.

## Requested spot-checks

| Check | Verdict |
| --- | --- |
| Node >= 20 engines | **GAP** — absent from the spine entirely (no rule, no Stack/AD-6 mention) |
| transitions.dev mapping table lands in architecture (EXPERIENCE assumption) | **LANDED** in AD-9 — with one nit: press duration mismatch (gap E-3) |
| Stack-agnostic PRD constraints carried | **PARTIAL** — pnpm (AD-4) and font-not-bundled carried; playwright-cli-only contract not restated; Node >= 20 dropped |
| OQ-2 font strategy honored | **YES** — `--tk-font-*` consumer-supplied slot, system fallbacks, Inter rec, zero bundling |
| OQ-5 stack resolved correctly | **YES** — Lit core + generated React adapter; decision within architecture's authority, PRD kept stack-agnostic |
| OQ-6 threshold resolved correctly | **YES** — 1.5% perceptual (pixelmatch, per component viewport) per PRD "set with tooling at architecture" |
| OQ-7 SSR resolved correctly | **BY DEFERRAL** — v1 client-only with a non-blocking guard (no construction-time DOM); weaker than "settle at architecture" but recorded openly (gap P-4) |

## Input 1 — PRD (4 gaps)

- **P-1 [Major] Node >= 20 dropped.** §5.1 Tooling requires "Node >= 20"; the spine has no
  engines rule anywhere (AD-6, Stack table, Structural Seed all silent). Fix: add
  `engines.node >= 20` + `packageManager` field requirement to AD-6 or the Stack section.
- **P-2 [Major] FR-11 non-structural requirements dropped.** AD-4 (the FR-11 binding) covers
  workspace/publish topology and name deferral only. MIT license, semver, changelog per
  release, and the unofficial disclaimer on every published surface (docs site included —
  EXPERIENCE IA requires it per-surface) appear nowhere in the spine. Fix: extend AD-4 or add
  a Consistency Conventions row for license/semver/disclaimer.
- **P-3 [Minor] playwright-cli-only contract not restated.** §5.1: "playwright-cli is the only
  browser automation tool." AD-7/AD-8 and the Stack table name Playwright /
  @axe-core/playwright generically. Not contradicted, but unstated — CI scaffold could
  legitimately introduce a second browser tool. Fix: one clause in AD-7/AD-8.
- **P-4 [Minor] OQ-7 settled by deferral rather than settlement.** PRD: "Consumer-project
  constraints to settle at architecture." AD-10 defers to first SSR consumer with a guard
  (verifiable: "no imperative DOM access at construction time"). Defensible — no SSR consumer
  exists — but the deferral should carry recorded maintainer sign-off, as PRD assumptions do.

*Not counted:* `.playwright-cli/` captures as baselines are sanctioned by FR-1/FR-10
methodology; recommend the spine state captures are dev-only and never shipped in published
packages (§5.1 legal cleanliness).

## Input 2 — DESIGN.md (2 gaps)

- **D-1 [Major] Body design rules lack a normative anchor.** AD-3 makes the *frontmatter* the
  token source of truth; AD-7's axe checks catch contrast only. Load-bearing body rules with
  no spine home: the AA-override table's component-pairing rules — yellow indicators always
  redundant ("yellow never carries state alone"), muted `#FFFFFF80` restricted to >= 48px or
  non-essential text — plus "never mix marketing/app radius registers in one component"
  (Shapes) and "no shadows on colored surfaces / shadow-stacks on dark theme" (Elevation,
  Do/Don'ts). Fix: one sentence in AD-3 or AD-11 making the DESIGN.md body (AA-override table,
  Shapes register rule, Elevation dark rule, Do/Don'ts) normative alongside the frontmatter.
- **D-2 [Minor] Build-time verification assumptions only partially carried.** Deferred lists
  `dark-tint-*` refinement but not the other `[ASSUMPTION]` items DESIGN.md marks
  "verify at build": mint/beige tint hexes (vision-estimated) and the `{rounded.xxl}`/`{rounded.xl}`
  card radii (vision-estimated). Fix: add to Deferred so the fidelity stories include the
  capture verification.

*Carried correctly:* token pipeline (AD-3), font slot + Inter recommendation (Conventions
"Fonts" row), dark theme (AD-3 layers, conventions, Deferred refinement), site-native token
name mirroring.

## Input 3 — EXPERIENCE.md (5 gaps)

- **E-1 [Major] Responsive & Platform section entirely dropped.** Breakpoints (>= 1024 /
  768–1023 / < 768), Navbar burger drawer with focus trap under 768px, mobile heading mapping
  (L/M/S), single-column collapse, full-width hero CTA, touch parity ("hover-dependent
  affordances gain tap equivalents") — none appear in the spine; the only "viewport" reference
  (AD-8) is about test viewports. Fix: add a convention or extend AD-2/AD-5 fixing the two
  breakpoints and making touch parity normative.
- **E-2 [Major] AD-11's normative scope too narrow.** AD-11 names "Component Patterns" only.
  State Patterns (hover 150ms / press 75ms, disabled 40% + aria-disabled, loading width-freeze,
  skeleton reduced-motion static, theme-switch 0ms / optional 150ms cross-fade) and
  Interaction Primitives (unified 2px/offset-2px focus-ring token, Select focus return,
  Toast never takes focus) are equally behavioral contracts the spine must call normative.
  Fix: "EXPERIENCE.md Component Patterns, State Patterns, and Interaction Primitives are
  normative."
- **E-3 [Minor] AD-9 contradicts State Patterns on press duration.** EXPERIENCE/DESIGN set
  press = 75ms (`duration-fastest`); AD-9 maps "hover/press → duration-fast" (150ms). Fix:
  split — hover → duration-fast, press → duration-fastest. Otherwise the required mapping
  table landed correctly (overlay open/close → productive entrance/exit matches the Modal
  contract verbatim).
- **E-4 [Minor] Docs IA reduced.** EXPERIENCE specifies docs index (install, theming, font
  slot, token table), Token reference, and Theming guide surfaces plus the unofficial
  disclaimer on every surface; the spine's `docs` package is "stories re-export + theming
  addon" only. Non-story pages (and the disclaimer) are unassigned. Ties into P-2.
- **E-5 [Minor] Imperative Toast API unassigned.** EXPERIENCE requires Toast to support
  imperative + declarative usage, "final API shape set at architecture per FR-3." AD-5 covers
  element props/events and defers the React-surface shape to the first component PR; an
  imperative `toast()` function does not fit AD-1's "one wrapper per element" model and has
  no architectural home. Fix: assign it (e.g., a function export in `packages/react` bound to
  a core controller) or explicitly defer with the API question.

## Summary

| Input | Gaps | Significant |
| --- | --- | --- |
| PRD | 4 | P-1 Node >= 20; P-2 FR-11 license/semver/disclaimer |
| DESIGN.md | 2 | D-1 body rules not normative |
| EXPERIENCE.md | 5 | E-1 responsive dropped; E-2 AD-11 scope |

All bindings FR-1…FR-11 are present in the spine's `binds`/capability map; no stack, token,
font, or OQ-resolution contradictions found. All fixes are additive sentences — no decision
reversal required.
