---
title: 'Story 7.4 — Business landing composition (bento + warm-cream)'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — after 7.3: composes tk-stepper)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.4 — FR-14 bento recipes + warm-cream proof)'
  - '{project-root}/packages/components/src/showcase/{homepage,application-form}.stories.ts (THE composition mold)'
  - '{project-root}/.playwright-cli/captures-v2/NOTES.md (§business: 2+3 bento anatomy; §C warm-cream measured table — #F1EEE8 page / #E9E0D1 cards, hue ~81°, DISTINCT family)'
  - '{project-root}/.playwright-cli/captures-v2/business/{full-scrolled,full}.png + pattern-{hero-service-selector,products-grid,application-form-detail,steps-open-account-detail,footer-detail}.png'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-14's bento recipes and the 6.1 warm-cream family have no composed proof —
the business above-the-fold (header → hero-selector → 2+3 bento → steps → form → footer)
is the domain that exercises both.

**Approach:** A SHOWCASE composition (the `src/showcase/` mold — canvas LAYOUT recipes,
not new components): `business-landing.stories.ts` assembling 7.1 navbar → hero
service-selector → the asymmetric 2+3 bento (flat cream cards from the EXISTING card
element + §6 surface hooks, floating white-pill CTAs over art) → 7.3 stepper → the
v1-composed application form cluster → v1 footer — on the warm-cream page tokens.

## Boundaries & Constraints

**Always:**
- Placement + mold: `packages/components/src/showcase/business-landing.stories.ts` — the
  application-form wiring mold (state object + `render(template, host)`, focus survives,
  tokens-only canvas styling); the jsdoc states the ASSEMBLY standard (reading order,
  cluster, wiring — not per-pixel).
- Bento (THE deliverable — NOTES measured): asymmetric **2+3 grid**; cards = FLAT warm-cream
  fill `--tk-color-surface-card-cream` (#E9E0D1) on page `--tk-color-surface-cream`
  (#F1EEE8) — the 6.1 tokens, NO new ones; card ~528×408 at reference scale, **radius 24px
  → nearest token step, RECORD the mapping (24 is likely a flagged literal if no token
  step matches)**; NO shadow (flat register); big 3D art = story-only placeholder art via
  the 2.6 token-read SVG technique (yellow ONLY inside illustrations — never UI chrome);
  **floating white-pill CTA overlapping the art's bottom** (surface-base pill, standard
  button register composed on the existing button); grid-footer centered pill «Все сервисы»
  (light fill + blue text — the link register). Cards compose the EXISTING card element
  with §6 hooks (surface/fill overrides) — a bento COMPONENT is explicitly NOT built
  (NOTES candidate #9 ruling).
- Section anatomy (top→bottom per full-scrolled): 7.1 navbar (bank-wide row; subLinks if
  the business capture shows row 2 — probe, follow the capture) → hero service-selector
  (probe pattern-hero-service-selector.png: heading register + selector cluster — v1
  components) → bento → steps = 7.3 tk-stepper (white cards on cream per its spec) →
  form cluster (pattern-application-form-detail: segmented toggle «Открыть счет»/
  «Открыть бизнес» → phone input → 1px divider → consent left + yellow pill submit right —
  v1 SegmentedRadio/Input/Checkbox/Button, the application-form mold) → v1 footer.
- Typography: the BUSINESS register mappings (marketing h1 → heading tokens per the 6.1
  registers doc — probe the capture's scale and map, zero new type tokens).
- The v1 composition gate (the showcase precedent): axe × both themes zero violations;
  provisional baselines ×2; side-by-side vs `business/full-scrolled.png` REGIONS (one
  composite per section cluster) archived to `.playwright-cli/verify/business-landing/`
  + probes (runs.awk) on the bento geometry (grid tracks, radius, CTA overlap); vision =
  blocked-protocol note; RU content, EN meta.

**Never:**
- No new components or elements (bento = canvas recipes on existing cards — the candidate-9
  ruling); no new tokens (6.1 cream family IS the token layer); no theme branches; no
  yellow UI chrome; no shadow on bento cards; no per-pixel truing beyond the bento
  geometry probes; no changes to composed components' APIs (gaps = REPORT, triage decides);
  no §4/§9 text changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Compose | story mounts | header→hero→bento→steps→form→footer, reference order | — |
| Bento grid | desktop viewport | 2+3 asymmetric tracks, cream cards flat, no shadow | — |
| Floating CTA | over art | white pill overlaps art bottom edge, ≥44px hit | — |
| Grid footer | «Все сервисы» | centered light pill, blue link text | — |
| Form wiring | phone + consent + submit | the application-form mold wiring (validation + toast) | invalid → inline errors |
| Narrow viewport | mobile | bento stacks (1-col), sections reflow | — |
| Theme | dark toggle | composition re-themes incl. cream surfaces (the 6.1 dark first-pass) | — |
| a11y | axe both themes | zero violations | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/showcase/application-form.stories.ts` -- THE wiring mold
- `packages/components/src/{navbar,stepper}/` + v1 card/button/input/segmented-radio/
  checkbox/footer -- the composed surfaces (READ APIs, never modify)
- `.playwright-cli/captures-v2/business/full-scrolled.png` -- regional side-by-side source
- `tests/visual/` -- baselines; `.playwright-cli/verify/business-landing/` -- evidence

## Tasks & Acceptance

- [ ] `packages/components/src/showcase/business-landing.stories.ts` (+ any shared
      story-only helpers, the mold's pattern)
- [ ] `.playwright-cli/verify/business-landing/` — regional side-by-sides + bento geometry
      probes + vision (blocked-protocol)
- [ ] baselines ×2 via update flow; axe both themes green; full gates green (VISUAL
      SERIALIZED); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (8), when the composed story is driven, then each row holds.
- Given the bento, when probed, then cards = cream tokens, flat (no shadow), radius mapped
  and recorded, 2+3 tracks match the reference's asymmetry.
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
