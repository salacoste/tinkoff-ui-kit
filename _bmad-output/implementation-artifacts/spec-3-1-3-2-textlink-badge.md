---
title: 'Story 3.1+3.2 — TextLink & Badge/Chip (paired primitives batch)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '57598ebe948fc5a879a0e294040dcf5f76e808e2'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The two remaining primitives (TextLink, Badge/Chip) are dependencies of the card stories and the showcase — Epic 3 cannot proceed without them. They are small, stateless, and share the simple-component mold: batching them into one story halves the cycle overhead without coupling their designs.

**Approach:** Implement `tk-link` (TextLink) and `tk-badge` (Badge/Chip) per EXPERIENCE.md/DESIGN.md in one batch — two independent component suites, one review pass. TextLink: blue-100, underline on hover, focus-visible underline, inline-legal variant. Badge: pill chip, incentive green/ink and stat ink/white variants, dynamic count capping at «99+», never interactive.

## Boundaries & Constraints — tk-link

- Behavior (EXPERIENCE TextLink row): inline within text or standalone (standalone gets body-m); keyboard focus → visible underline; underline on hover (NOT underline-at-rest — follow the reference: probe the capture text-link-read-more.png: rest = no underline or subtle? probe decides; DESIGN says «underline on hover» — rest without).
- Anchors: renders an `<a>` (native semantics; href pass-through, target/rel props, disabled prop = aria-disabled + inert click interception per the Button mold); inline-legal variant (prop `variant: 'inline' | 'standalone' | 'legal'` — legal = body-xs gray per DESIGN).
- Colors: blue-100 default; on tinted/field surfaces consumers use the semantic token? NO — the link always consumes `--tk-color-link` (semantic, blue-100 light / #66A3FF dark — the AA pair the token layer already carries); legal variant = text-secondary gray. NOTE for docs: consumers do NOT pick link-on-tint manually — the semantic token themes itself (probe NOTES record).
- No events beyond native click; no channel; stateless.
- Unit tests: variants render, focus-visible class wiring (structural), disabled inertness, href/target reflection, legal typography class; wrapper via gen (no event-map entry — no dispatches).

## Boundaries & Constraints — tk-badge

- Behavior (EXPERIENCE Badge/Chip row): static or dynamic count; count > 99 renders «99+»; NEVER interactive alone (no focus stop, no click); variants: `incentive` (green-100 bg + ink text — the AA pairing 2.1 established) and `stat` (ink-300 bg + white text); `count` prop (number — when present, renders the count with the cap; label slot/prop otherwise).
- Visual: pill radius-full, body-xs typography (DESIGN badge spec); heights ~20-24px (probe the capture badge-chip-incentive.png); the reference «+20%» badge is the incentive shape.
- Unit tests: count cap (0/99/100/1000 → renders, «99», «99+», «99+»), variants, no interactive surface (no tabindex/focus), slot-vs-prop, clamps; wrapper via gen (no event entry).

## Shared

- Component gate each: impeccable/axe both themes; story (default + variants + theming + a11y notes); PROVISIONAL baselines + side-by-sides vs text-link-read-more.png / badge-chip-incentive.png + pixel probes (rest-underline question for link; badge height/colors) + vision.
- React: wrappers via gen; NO event-map entries (neither dispatches); smoke tests (render/props).
- No new tokens; no theme branches; SPAN/anchor semantics only.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Link hover/focus | pointer/focus | underline appears (focus: always visible) | — |
| Link disabled | disabled prop | inert + aria-disabled, no navigation | — |
| Legal variant | variant=legal | body-xs gray, no underline at rest | — |
| Badge count 100 | count=100 | renders «99+» | — |
| Badge count 0 | count=0 | renders «0» (visible-zero is information) | — |
| Badge interactive attempt | click/tap | nothing (no role=button, no focus stop) | — |
| Badge label slot | slotted content | slot wins over prop | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/button/` -- the stateless mold (variants, reflection, inert interception)
- `.playwright-cli/captures/{text-link-read-more,badge-chip-incentive}.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` §§ TextLink, Badge/Chip -- references + observations (FULL path per the 2.5/2.6 lesson)
- `packages/tokens/src/tokens.css` -- link, green-100, ink-300, radius-full, body-xs tokens

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/link/{index.ts,link.ts,link.css.ts,link.test.ts,link.stories.ts}` + `packages/components/src/badge/{...}` -- two independent suites
- [x] `packages/react` -- wrappers via gen (no event entries) + smoke tests
- [x] `.playwright-cli/verify/{link,badge}/` side-by-sides + pixel probes + vision checks
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when each unit suite runs, then each row asserts (all seven).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; completeness guard green with NO new event entries.
- Given the visual suite, both components' baselines stable ×2; axe both themes zero violations; pixel probes recorded (link rest-underline resolved; badge height/colors).

## Implementation Notes

- Approved autonomously (standing delegation). Batched per the small-stateless rationale; the suites stay independent (no shared state, separate reviews of findings).
- Judgment calls: link rest-underline (probe decides), badge count-0 rendering (picked: visible «0»), badge heights (probe).

## Spec Change Log

## Review Triage Log

Quick lens (auto), 2026-09-23 — six findings, all resolved; verified green:

1. **tk-link standalone target floor was height-only** — a short label («Далее») fell under 44px WIDE. FIXED in `link.css.ts`: space-12 inline padding on the standalone variant (44×44 floor, the Button-compact pairing precedent); structural test extended (`link.test.ts`). Inline links unchanged (documented deviation).
2. **Hover color-step conflict ratified (not silent)** — EXPERIENCE State Patterns' hover token step (blue-200) vs the shipped underline-only hover. ADJUDICATED: underline affordance only, no color step — blue-200 has NO dark remap (a raw step would be invisible/wrong in dark) and no-new-tokens forbids inventing a link-hover semantic. Recorded in CONVENTIONS §9 exception log (row 1). The 150ms motion letter now holds: the underline FADES on `--tk-motion-duration-fast` (`text-decoration-color` transparent → currentColor) instead of popping.
3. **`--tk-color-link-on-tint` was DESIGN-declared but consumed by nothing** — FIXED: the Theming story gained an on-tint demo panel (tint-bluegray, opaque in both themes) running the documented document-level override recipe (`--tk-color-link: var(--tk-color-link-on-tint)` on the container): light shows blue-200 (4.965:1), dark resolves to #66A3FF. Token now documented-and-demonstrated; noted in verify/link/NOTES.md.
4. **Focus indicator = underline vs CONVENTIONS §8 unified ring** — RATIFIED in the CONVENTIONS §9 exception log (row 2): EXPERIENCE's TextLink component row names «keyboard focus visible underline»; the ring governs boxed controls. CONVENTIONS no longer in silent conflict.
5. **CONVENTIONS §1 said `<name>.story.ts`; every suite ships `<name>.stories.ts`** (10+ files since 1.7) — FIXED the CONVENTIONS text to `stories.ts` (reality wins; correction noted in place).
6. **Badge weight = body-s-bold (500) over body-xs vs the spec letter «body-xs typography»** — ADJUDICATED, no code change: same-reference-chip consistency wins (the tk-input slotted-chip precedent, cited in the badge.css.ts header); body-xs carries no bold token of its own.

Evidence: `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen` (staged) all exit 0; `pnpm test:visual:update` + compare ×2 → 239/239 each; impeccable detect `[]`; pixel probes and vision records in `.playwright-cli/verify/{link,badge}/NOTES.md`.

## Design Notes

Link: native `<a>` in the shadow root? NO — an anchor in light DOM with the custom element WRAPPING it breaks styling; render the anchor as the root via `render()` returning static template with the host styled `display: inline`? Simplest correct: the element renders an `<a>` in its shadow root with a default slot for the label; href etc. reflect. Badge: pure span with slot. Both follow the 1.7 stateless mold (reflection, clamps, inert interception on the host).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
