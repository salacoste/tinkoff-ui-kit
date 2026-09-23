---
title: 'Stories 3.6–3.9 — Card family: Promo, Feature, Service, Article (+ tint closures)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '65b61259ff200c08eaaa67d64df49627b5ef0a28'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The four card components (the homepage's visual language core) are missing, and two DESIGN.md tint assumptions (mint/beige) have measured pixel evidence awaiting closure.

**Approach:** Batch the card family — `tk-promo-card` (3.6, with the mint/beige [ASSUMPTION] closure: correct DESIGN.md values → regenerate tokens in the same change), `tk-feature-card` (3.7), `tk-service-card` (3.8), `tk-article-card` (3.9). All share: tint/background variants, token-driven flat cards (no shadow on tint), content slots, CTA/link actions. One spec, one implementation agent, one review pass — four independent suites.

## Boundaries — shared

- All cards: tokens only; tinted surfaces FLAT (no shadow — DESIGN); every card exposes `--tk-<name>-*` hooks; skeleton states where EXPERIENCE names them (ArticleCard, PromoCard content — a shared skeleton pattern: gray-200 blocks matching layout, static under reduced-motion; implement as a `skeleton` boolean prop rendering placeholder blocks — note the pattern).
- Tint auto-pairing: the tint VARIANT decides text pairing (dark text on pastels, white on charcoal) — implementation via per-tint token consumption (text-primary vs white), zero theme branches beyond the token layer.
- The 3.6 CLOSURES: mint #D0F4F2 / beige #F1EBD6 (measured, computed-style + native-zoom crops) replace DESIGN.md's #E2F1EC / #F5EFE6 → edit DESIGN.md frontmatter (sanctioned assumption-resolution protocol: capture evidence in hand) → `pnpm gen:tokens` → committed artifacts regenerate → side-by-sides prove the cards now match; the [ASSUMPTION] flags clear from the canonical listing; dark tints stay first-pass (5.4).
- React: wrappers via gen; no event-map entries (display components; CTA clicks are native anchor/button inside slots — note).

## tk-promo-card (3.6)

- EXPERIENCE/DESIGN: tint bg (gray/bluegray/mint/beige/charcoal variants), radius-xxl 32, padding 32, art slot TOP (lazy: loading="lazy" decoding="async" on projected img? — slot content is consumer's; provide a lazy default by documenting + a `art` slot with no lazy enforcement — EXPERIENCE says «art slot lazy-loads»: enforce by setting img[loading] via slotchange on slotted imgs — note the technique), title/desc props+slots, white pill CTA BOTTOM-CENTER (a tk-button secondary slotted by the consumer — the CARD is not clickable; the CTA carries the action); auto text-pairing per tint.
- Tests: variants pair correctly, CTA-not-card clickability (card has no click surface — pointer-events none on the card wrapper? NO — the card is passive but content selectable; assert no card-level click handler/role), lazy enforcement on slotted art, clamps, skeleton.
- Side-by-side: promo-card-grid.png + tint-mint.png/tint-beige.png probes.

## tk-feature-card (3.7)

- 2-up scale, min-height 320; charcoal EDITORIAL variant: white heading, white pill CTA, art bleeding RIGHT (the art slot absolutely positioned right-bleed on the editorial variant only); CTA carries action (inherit); skeleton.
- Tests: editorial variant wiring (bleed class, white pairing), heights, CTA-not-card, clamps, skeleton.

## tk-service-card (3.8)

- radius-xl 24, padding 24; small icon slot (aria-hidden decorative — the component sets aria-hidden on the projected icon container), title, desc, TEXT LINK pinned BOTTOM (a slotted tk-link — the action); link pinned across varying desc lengths (flex column + margin-top auto).
- Tests: icon aria-hidden, link pinned (structural), clamps.

## tk-article-card (3.9)

- Text-only: 2-line title (line-clamp 2), desc, «Читать» LINK covering the whole card via ::after stitch (single tab stop, whole-card click); skeleton state.
- Tests: stitch CSS (position/coverage structural pin), single tab stop (one focusable: the link), line-clamp, skeleton, clamps.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|----------------|----------------|
| Tint pairing | variant=mint | dark text; charcoal → white | unknown variant clamps to gray |
| Card click | click on card body | nothing (no card-level action) | — |
| Promo art | img slotted | loading=lazy enforced | no img → layout holds |
| Editorial bleed | feature editorial | art bleeds right; white pairing | — |
| Service link | long desc | link stays pinned bottom | — |
| Article stitch | click anywhere | navigates via the link; ONE tab stop | — |
| Skeleton | skeleton=true | gray-200 blocks, static reduced-motion | — |
| Tint closures | n/a | mint/beige corrected in DESIGN.md + tokens + probes recorded | — |

</frozen-after-approval>

## Code Map

- `.playwright-cli/captures/{promo-card-grid,feature-card-platinum,feature-card-tj-banner,service-card-grid,article-card-grid,tint-mint,tint-beige}.png` + `.working/captures-2026-09-22.md` §§ (FULL path: _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/)
- `packages/tokens/scripts/generate.mjs` -- the DESIGN.md → tokens pipeline (the closure regen)
- `packages/components/src/{button,link}/` -- the CTA/link composition parts
- 2.0 tint evidence: mint #D0F4F2 beige #F1EBD6 (computed styles + crops)

## Tasks & Acceptance

- [x] DESIGN.md tint closure (mint/beige) + gen:tokens regen + committed artifacts
- [x] `packages/components/src/{promo-card,feature-card,service-card,article-card}/{...}` -- four suites
- [x] `packages/react` wrappers via gen + smokes (no event entries)
- [x] `.playwright-cli/verify/{promo-card,feature-card,service-card,article-card}/` side-by-sides + probes + vision (incl. the corrected-tint proof)
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when each unit suite runs, then each row asserts.
- Given the tint closure, when tokens regenerate, then DESIGN.md carries the measured values with the flags cleared (canonical listing updated) and the side-by-sides record the match.
- Given any card, when axe runs both themes, zero violations; `pnpm gen && git diff --exit-code` (staged) exit 0; visual stable ×2.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: lazy enforcement technique (slotchange attribute set), skeleton pattern (prop), line-clamp (webkit prefix + standard), editorial bleed approach (grid/absolute — pick grid, note).

## Spec Change Log

## Review Triage Log

Quick review (auto, 2026-09-23) — 5 findings + comment drift, all patched in the same change:

1. **Dark-theme CTA invisibility on charcoal/editorial (promo/feature)** — the composed tk-button secondary paints its pill from `--tk-color-surface-base`, which the dark layer remaps to #1A1A1A → near-invisible on the theme-invariant charcoal (live-proven; was baked into the dark baselines). PATCHED: the charcoal/editorial rules re-scope `--tk-color-surface-base` (the button's actual fill channel — button.css.ts has no `--tk-button-fill`) and `--tk-color-text-primary` (its label) to the dedicated PAIR `--tk-<name>-cta-fill` (default white) / `--tk-<name>-cta-text` (default ink-300), scoped to `.card__actions` ONLY so nothing else in the card is swallowed; flat-tree inheritance carries them into the slotted button — the pill stays white with ink text in BOTH themes and remains themable. Unit structural pins (incl. the scoped-once check) + a live dark-pill computed assertion in the committed capture recipes (a non-white pill fails the recipe); dark stories re-baselined.
2. **Empty art zone gaps ×2 (promo/feature)** — the art zone reserved a stray 24px margin when nothing was slotted, and the editorial grid kept an empty 0.95fr column. PATCHED: the element toggles a `data-has-art` host attribute from the art slot's slotchange (the attribute pick over `:has()` — `:empty` cannot work, the slot element is always a child; noted in the css headers); base `.card__art` is `display:none` with no margin and `:host([data-has-art])` expands it; the editorial grid stays single-column until the attribute arrives. Unit pins for both (no-art → heading at the 32px register; editorial no-art → single column).
3. **Wrong token in docs (article-card Theming story)** — the note claimed the link consumes `--tk-color-link`; it consumes `--tk-color-link-on-tint` via `--tk-article-card-link`. PATCHED (note + the stale css-header hook doc line).
4. **Missing §9 exception-log row** — the article-card's underline-only focus indicator (the tk-link precedent) was not recorded. PATCHED: row appended to CONVENTIONS.md §9.
5. **service-card link grammar** — the card re-scoped the KIT-WIDE `--tk-color-link` on the whole `.card` (swallowing consumer overrides; no own-grammar hook). PATCHED: own-grammar hook `--tk-service-card-link` (default the on-tint AA step; white on charcoal), consumed by the re-scope which now lives on `.card__actions` ONLY — the re-scope must remain because the slotted tk-link resolves `--tk-color-link` inside its own shadow root and a custom-property re-scope is the only cross-boundary delivery (documented in the css header); Theming story note updated to the hook.
6. **Comment drift (3 spots)** — article-card skeleton widths (90/90/25, not 60/90), promo/feature `#enforceLazyArt` docstrings (arbitrary depth via querySelectorAll, not one level), feature editorial align-self (stretch + flex-end anchoring, not self-aligns-end). PATCHED to match the code.

## Design Notes

The cards share a skeleton util pattern — consider a tiny shared `renderSkeleton(shape)` helper per suite (no cross-imports; copy the ~15 lines — note). The stitch: `.card__link::after { position:absolute; inset:0 }` on a position:relative card. 2-up/3-up GRIDS are consumer layout (the cards are grid-agnostic blocks) — stories demonstrate with grid templates.

## Verification

**Commands:**
- `pnpm gen:tokens && git diff --exit-code -- packages/tokens` (after the DESIGN.md edit + staging) -- exit 0
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0
- `pnpm test:visual` (update flow, then ×2) -- stable
