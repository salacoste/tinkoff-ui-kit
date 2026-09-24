---
title: 'Story 7.5 — Invest-mobile landing composition (marketing register)'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — after 7.3: composes qr-block/store-badges/stepper)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.5 — marketing register proof)'
  - '{project-root}/packages/components/src/showcase/{homepage,application-form}.stories.ts (THE composition mold)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§invest-mobile: hero-full anatomy 108–940px; register divergence 50/44/36)'
  - '{project-root}/.playwright-cli/captures-v2/invest-mobile/pattern-hero-full.png + pattern-qr-loaded.png + pattern-store-badges-loaded.png + full.png'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The marketing register's proof surface — h1 44/Daytona with the app-install
cluster — has no composed page; 7.3's three blocks need their landing context and FR-14's
last composition consequence stays unproven.

**Approach:** A SHOWCASE composition: `invest-landing.stories.ts` assembling the consumer
header (pattern-header-consumer) → the hero (h1 = **heading-2** tokens per the 6.1 register
MAPPING — 44px, zero new type tokens; subcopy; yellow «Скачать для iOS» primary CTA +
secondary «Скачать для Android» link; phone 3D visual as story art via the 2.6 token-read
technique) → 7.3 tk-qr-block → 7.3 tk-store-badges → 7.3 tk-stepper (install steps) —
the app-distribution cluster on one page.

## Boundaries & Constraints

**Always:**
- Placement + mold: `packages/components/src/showcase/invest-landing.stories.ts` — the
  showcase mold VERBATIM (state object + `render(template, host)`, tokens-only canvas
  styling, assembly-standard jsdoc). Composed surfaces are v1 button/link + 7.3's three —
  APIs READ, never modified (gaps = REPORT).
- Hero (pattern-hero-full, y108–940 measured): h1 44px bold → **`--tk-text-heading-2`
  scale via the register mapping (h1 = heading-2 — the 6.1 ruling, zero new tokens)**;
  subcopy body register; primary CTA = the standard yellow pill button («Скачать для
  iOS»); secondary = the link register («Скачать для Android»); phone visual = story-only
  placeholder art (yellow frame, coins, chart screen — the 2.6 getComputedStyle SVG
  technique; art is NOT a component). Probe the capture for the exact hero cluster
  geometry (heading→subcopy→CTA gaps, art placement) and RECORD.
- The install cluster (below hero, reference order): tk-qr-block (7.3) → tk-store-badges
  (7.3) → tk-stepper as install steps (7.3) — each per its OWN spec anatomy; page surface
  = the domain's page register (probe full.png: consumer surface-base or cream — follow
  the capture, record).
- Consumer header: pattern-header-consumer — compose the v1 navbar (bank-wide row, no
  subLinks) unless the capture shows otherwise (probe; follow).
- The v1 composition gate (the showcase precedent): axe × both themes zero violations;
  provisional baselines ×2; side-by-side vs `pattern-hero-full.png` + full.png regions
  archived to `.playwright-cli/verify/invest-landing/` + probes (hero geometry); vision =
  blocked-protocol note; RU content, EN meta.

**Never:**
- No new components or elements; no new tokens (the 44 h1 = heading-2 MAPPING is the 6.1
  decision — do not mint heading tokens); no theme branches; no per-pixel truing beyond
  the hero geometry probes; no changes to composed components' APIs; no §4/§9 text
  changes; no brand art (store icons stay consumer-supplied data per 7.3).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Compose | story mounts | header→hero→qr→badges→steps, reference order | — |
| Register | hero h1 | heading-2 token scale (44), Daytona stack as shipped | — |
| CTA pair | primary + secondary | yellow pill + link register, both ≥44px hit | — |
| QR cluster | tabs interact | the 7.3 qr-block contract verbatim | — |
| Badges | click | external noopener navigation (7.3 contract) | — |
| Steps | 3 install steps | the 7.3 stepper anatomy | — |
| Narrow viewport | mobile | hero stacks, art scales, cluster reflows | — |
| Theme | dark toggle | whole composition re-themes | — |
| a11y | axe both themes | zero violations | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/showcase/application-form.stories.ts` -- THE wiring mold
- `packages/components/src/{qr-block,store-badges,stepper}/` (7.3) + v1 navbar/button/link
  -- the composed surfaces (READ APIs, never modify)
- `.playwright-cli/captures-v2/invest-mobile/pattern-hero-full.png` + `full.png` --
  side-by-side sources
- `tests/visual/` -- baselines; `.playwright-cli/verify/invest-landing/` -- evidence

## Tasks & Acceptance

- [ ] `packages/components/src/showcase/invest-landing.stories.ts`
- [ ] `.playwright-cli/verify/invest-landing/` — side-by-sides + hero geometry probes +
      vision (blocked-protocol)
- [ ] baselines ×2 via update flow; axe both themes green; full gates green (VISUAL
      SERIALIZED); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (9), when the composed story is driven, then each row holds.
- Given the hero, when probed, then h1 renders the heading-2 scale (register mapping, no
  new tokens) and the CTA pair matches the capture cluster.
- Given axe × both themes on the composed story, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
