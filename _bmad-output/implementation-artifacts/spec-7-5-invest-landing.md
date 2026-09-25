---
title: 'Story 7.5 — Invest-mobile landing composition (marketing register)'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '7df3097 (worktree, base d6a9f2c) → merge 508bd7b + CEM regen 0df4593 (→ combined with 7.4 at 5a6f5e5)'
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

**Executor round (worktree → 7df3097; merge 508bd7b):**

- `packages/components/src/showcase/invest-landing.stories.ts` (543 lines) — the homepage
  3.10 static-render mold VERBATIM: v1 `tk-navbar` (the capture's verbatim consumer set
  «Частным лицам / Бизнесу / Премиум / Ещё» + search + «Личный кабинет», NO subLinks — the
  capture shows the plain bank-wide row) → hero h1 «Мобильное приложение Т-Инвестиций» on
  **--tk-text-heading-2-\*** (44/700/1.15 — the 6.1 register MAPPING, zero new tokens) →
  subcopy → CTA row: yellow `tk-button` «Скачать для iOS» + `tk-link` «Скачать для Android»
  → phone art (story-only placeholder: yellow frame + chart screen via the 2.6
  getComputedStyle token-read technique — no hex in source) → `tk-qr-block` → `tk-stepper`
  → h2 «Вариант 2 …» (measured VERBATIM at 8× on the capture — BOTH variant headings read
  «Вариант 2», the reference's own copy quirk) → `tk-store-badges`.
- **Cluster order premise CORRECTED by pixels** (Spec Change Log below): the frozen block's
  qr→badges→stepper order is REFUTED by the capture — full.png measures the steps cards
  (y2325–2760) ABOVE the stores heading (y2838–2880); the composed order is
  qr→**steps**→badges. Recorded in `.playwright-cli/verify/invest-landing/NOTES.md`.
- ZERO component edits: composed surfaces are tk-navbar/button/link (v1) + the 7.3 trio —
  APIs read-only; gen NO-OP on wrappers (27 unchanged).
- `tests/visual/invest-landing.spec.ts` (265 lines): axe 1280+360 × both themes — zero
  violations; QR tabs driven LIVE (ArrowRight auto-activation → src swaps, per-tab note
  disappears per tab data); badges contract legs (target=_blank + noopener noreferrer +
  capture order); narrow-viewport reflow (CTA stacks, pill stretches, stepper 1-column,
  badges one-per-row); interactive clip baseline (the combobox-search/cookie-banner
  page-level clip mold). Three initial locator failures were test-side (shadow-slot
  crossing, non-piercing querySelector, missing host recipe) — fixed in the spec, not the
  components.
- Baselines: exactly 4 all-new (story light+dark in visual.spec.ts-snapshots + 2
  interactive clip legs in tests/visual/invest-landing.spec.ts-snapshots).
- Worktree gates: build/test/lint/typecheck/gen/gen:tokens green — 872 unit (tokens 15 +
  components 665/29 files + react 70 + root 122); visual 1259/1259 ×2 (7.8m/7.6m) on
  private port 6061, temp VISUAL_PORT config deleted pre-commit.
- **Kit gaps REPORTED, not patched** (recorded for the maintainer): tk-qr-block lacks a
  page-copy slot between title and tablist (reference carries a description line);
  tk-button has no href/link mode (hero CTA renders a button where the reference links to
  a store) — both are component-layer decisions, out of the showcase lane.
- **Provisioning incident (process note):** the worktree was provisioned at d27773b
  (pre-trio-merge) instead of the merge HEAD; the executor verified 0 unique commits +
  clean status, then `git reset --hard d6a9f2c` BEFORE work began. Lesson recorded:
  dependent executors launch strictly AFTER the base commit exists.
- Hero pill 50 vs 56px: the capture's hero pill measured 50px against the assembly
  standard 56 — kept at the v1 button's own register (assembly standard outranks
  per-capture deltas in a composition story; deviation logged in NOTES).

## Spec Change Log

- **2026-09-24 (executor round, premise correction — pixels over prose):** frozen
  Always-list said «tk-qr-block → tk-store-badges → tk-stepper (install steps)». The
  capture's own geometry (full.png: steps y2325–2760 above stores y2838–2880) refutes the
  order; composed qr→steps→badges. The 7.1 precedent (frozen anatomy vs measured pixels —
  pixels win, deviation logged). No other frozen term changed.

## Review Triage Log

**Lens qr-lens-7-5 (2026-09-25, read-only pass on worktree @ 7df3097): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / notes below.**

All eight executor claim-groups CONFIRMED with cites (worktree-relative):

1. Composition — story id in the built docs index (suite ran it); navbar verbatim set
   stories.ts:154-159, search :217-231, «Личный кабинет» :232, NO subLinks; h1 consumes
   --tk-text-heading-2-{size,weight,leading} :378-380 → tokens.ts:98-100 = 44px/700/1.15
   (register mapping EXACT, zero new tokens; commit touches nothing in packages/tokens;
   all 39 var(--tk-*) in the story resolve in tokens.css); CTA pair one row :243-246,
   :394-400; phone art via tokenColor/getComputedStyle :70-72, :80-111; qr :255, stepper
   :257, h2+badges :259-262.
2. Cluster order — DOM qr→stepper→stores; CONFIRMED visually on side-by-side-cluster.png
   (steps rows ABOVE the stores heading, kit matches); y-coords in NOTES.md:54-60.
3. «Вариант 2» both headings — confirmed in source (:255, :260) AND on the side-by-side;
   8× glyph measurement is the NOTES.md:61-64 method (3 vision claims discarded on the
   deterministic scans, NOTES.md:22-26).
4. Gates — lens RE-RAN read-only: typecheck OK; units 15/665(29 files)/70/122 = 872 exact;
   lint clean. gen/gen:tokens not re-run (write ops; structurally consistent). Visual ×2
   structurally confirmed (story id in served dist index, baselines committed).
5. Baselines — diff-tree: exactly 4 all-new (Bin 0 →); clip technique = stocks-catalog
   precedent (stocks-catalog.spec.ts:76-109).
6. Visual spec legs — axe 1280+360 both themes (:98-117); QR live ArrowRight + aria/focus
   + src/alt swaps + note-disappear (:124-157, alt format = qr-block.ts:107); badges
   contract (:159-177; rel rendered unconditionally store-badges.ts:89-90); narrow reflow
   (:209-239, :241-264); clip baseline both themes (:179-200). Shadow classes + property
   names all verified against component sources.
7. Kit gaps reported not patched — NOTES.md:139-151; `git diff d6a9f2c..7df3097` over
   stepper/store-badges/qr-block/button/link/navbar + packages/react = EMPTY.
8. Hygiene — 13 lane-only files; no _bmad-output/package.json; no tags/push; temp visual
   config deleted; placeholder glyph byte-identical to store-badges.stories.ts:34; QR
   idiom copies qr-block.stories.ts:39-57. Provisioning incident conduct confirmed via
   reflog (worktree born d27773b → reset d6a9f2c BEFORE work; exactly one commit 7df3097).

Accepted deviations (all documented, capture-true): cluster order premise correction;
static render (the homepage 3.10 precedent itself is static — homepage.stories.ts:186;
zero derived wiring, QR rides uncontrolled tk-tabs); QR page-copy paragraph not composed
(no slot — reported gap); step titles derived single-line; hero CTA button-not-link
(reported gap).

Lens notes (no action required): Register + CTA-hit matrix rows covered by full-page
baselines + NOTES probes (:96-108) + story CSS min-height (:401-405) rather than dedicated
asserts — acceptable for a composition story; Compose-order row pinned by baselines;
named colors only inside placeholder data (FR-1 letter holds — grep clean); «Как собрано»
doc block matches the homepage mold (homepage.stories.ts:301-303).

**Orchestrator disposition: NO fix round — merged as-is (508bd7b).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor) | build/test 872/lint/typecheck/gen/gen:tokens green; gen-drift clean (27 wrappers unchanged) |
| Worktree visual (executor) | 1259/1259 ×2 (7.8m/7.6m), private port 6061, temp config deleted pre-commit; scoped baseline-creation 15 passed |
| Merge | 508bd7b clean (no conflicts — lane-only files); post-merge CEM regen 0df4593 (embeds the 7.3 W1 cssText missed at 6cb2234) |
| Main gates (post-merge) | build/test/lint/typecheck/gen/gen:tokens GREEN; post-commit gen-drift CLEAN |
| Main visual (merged) | pass 1: 1259/1259 (7.7m) port 6041; then 7.4 merged (5a6f5e5) — final ×2 on the combined tree recorded in spec-7-4 (superset: every 7.5 leg has pass 1 + 2 combined passes = 3 green total) |
| Baselines | 4 all-new (story light+dark + 2 interactive clip legs); no baselines re-taken on main (pixel-stable merge) |
| Spec closed | 2026-09-25 — see commits: 508bd7b (merge), 0df4593 (CEM), close commit |
