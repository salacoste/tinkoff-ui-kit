---
title: 'Story 16.2+16.3 (batch) — ТЖ feed surfaces: tj-rubric-header + tj-news-card + tj-tag-chip + /pro/ hero pattern'
type: 'feature'
created: '2026-09-29'
status: 'draft'
baseline_commit: '76b8ca5'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Stories 16.2 + 16.3; batching sanctioned at the sequencing note: «16.2+16.3 (batch)»)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (chip-pair AA override + byline row landed as 16.2/16.3 pre-work @76b8ca5; news-card/rubric-header/tag-chip component rows)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (Rubric header / News card / Tag-chip nav contracts)'
  - '{project-root}/.playwright-cli/verify/tj-tokens/NOTES.md (feed-card census 760×270 ×95; chips 121–127×40 r20 home/flows/pro; /pro/ hero 1260×600 r30 #8054FF; byline 15/700/20 probe9)'
  - '{project-root}/.playwright-cli/captures-v3/tj/ (tj-rubric-news-{viewport,fullpage}-2026-09-28.png + tj-pro-viewport-2026-09-28.png — the side-by-side targets)'
  - '{project-root}/packages/components/src/ (the row-as-link precedents: card family + data-table rows; the 16.1 tj molds: tj-prose/tj-link/tj-cta)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 batch 16.2+16.3; chip-pair/byline pre-work landed @76b8ca5) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ family has its reading primitives (16.1) but ZERO feed surfaces. Every ТЖ page below the article is a feed: the rubric landing (cover + squircle header + card list) and the /pro/ hero (purple field + chip nav). Epic 16 continues with the two feed carriers and the chip, batched per the epics sequencing note.

**Approach — three stateless components + one documented pattern, exactly as the probes define them:**

1. **`tj-rubric-header`** — the rubric landing head: a LAYOUT surface (slots, no properties beyond them): `cover` slot (the slotted `<img>` gets panel-radius 30 clipping + object-fit cover; consumer alt mandatory-by-contract, empty alt acceptable for decorative covers), `mark` slot (the 100×100 squircle art — slotted image, `aria-hidden` wrapper by the component, overlap = half the mark over the cover boundary — structural FLAG, unmeasured), default slot = the consumer's `<h1>` (styled `::slotted(h1)` rubric-h1 38/700/45 ink-100) + subtitle flow (`::slotted(p)` card-title 17/400 — the flagged on-scale pick, side-by-side pending). Card surface, panel radius, zero events.

2. **`tj-news-card`** — the single-link feed card: shadow `<a href>` wrapping the whole card (the row-as-link mold — title + byline + counts ride ONE anchor, one tab stop); slots `mark` (mini squircle, decorative), `avatar` (consumer image), `byline` (author name — byline tokens 15/700/20 ink-100), `title` (news-title 24/700/30 ink-100; slotted heading keeps consumer heading-level freedom), `excerpt` (optional, article-body register 17/400 — the small-card register, FLAGGED if off-capture), `meta` (timestamp + counts row — time-meta 15/400 ink-300; counts ink-300 static text, NEVER live regions; the RESTRICTED engage/reference-time inks are NOT story-rendered — FR-22 zero-violations, the 16.1 round-3 mold). Card bg/radius (760-wide column family). **`skeleton` boolean attribute**: slots render as bones — `color-mix(in srgb, var(--tj-color-ink-300) 12%, transparent)` (meta-ink alpha, NEVER a bank gray-200 import — epics constraint; the 12% is a flagged structural value), NO shimmer (reference skeleton behavior unprobed — nothing invented), `aria-busy="true"` on the host while skeleton, bones `aria-hidden`.

3. **`tj-tag-chip`** — the purple-field nav chip: shadow `<a href>` pill — h40, radius chip 20, fill `var(--tj-color-chip-fill)` / ink `var(--tj-color-chip-ink)` (the authored AA pair, THEME-INVARIANT — no dark branch by design: chips ride the purple fields in both themes), label = nav-label 17/700 + a component-rendered decorative chevron (inline `aria-hidden` SVG, `currentColor`, right-side, `margin-inline-start` from the space scale — FLAGGED geometry). Hover/focus LIFT on `--tj-motion-duration-fast` + curve-standard (translateY −2px — FLAGGED magnitude, EXPERIENCE names the lift but not its size); focus ring = **chip-ink** 2px/offset-2px (the generic focus-ring token fails 3:1 on purple — the DESIGN row ruling). Deterministic external-rel rule = the 16.1 tj-link mold verbatim. Chips WRAP (flex-wrap), never scroll — consumer-side layout, documented in the story.

4. **The /pro/ hero PATTERN** (a story, NOT a component — the epics ruling): composes `var(--tj-color-badge-purple)` field (r30, the measured 1260×600 register scaled to canvas), `pro-h1` 32/700 chip-ink, a wrapping `tj-tag-chip` row, the r10 h50 CTA (`--tj-radius-cta-promo`, chip-ink on badge-purple = 4.536:1 machine-pinned), decorative squircles (aria-hidden pattern art). Lives in `tj-tag-chip.stories.ts` as the composition story; consumes ONLY `--tj-*` tokens (FR-17 clean — «no purple enters the general token surface set» holds: badge-purple/chip-* are the scoped carriers).

Plus the machinery ride-along: all three are stateless display/link surfaces — the frozen EMPTY event-map stays empty (first stateful surface = 16.4), wrappers arrive via `pnpm gen` with zero event-map edits, `check:gen` + tests/tj-gen-drift.test.ts gate the drift.

## Boundaries & Constraints

**Always:**
- The 16.1 component mold exactly: one directory per component under `packages/tj-components/src/<name>/` with the five files; styles consume ONLY `var(--tj-*)`; every structural (non-token) value flagged in a css.ts comment (known flags: the mark 50/50 overlap, the bone 12% alpha, the chip chevron gap + −2px lift, the excerpt register pick, the hero pattern canvas geometry).
- A11y floor: natural tab order; the news card = ONE tab stop (the whole-card anchor); `:focus-visible` rings 2px/offset-2px on the shadow anchors (chip ring = chip-ink per the DESIGN ruling; news-card ring = focus-ring on the CARD surface — the AA-surface law); Enter activates / Space scrolls (native anchor delta, checklist rows ×all stories).
- Counts/timestamps in stories render **ink-300** (the authored AA meta); the RESTRICTED `--tj-color-engage` / `--tj-color-ink-reference-time` values stay token-table-documented, never story-rendered (FR-22; the fidelity delta vs the reference grays recorded in the story prose).
- Stories RU-content (real feed-shaped data, no PII — synthetic authors), each with FR-22 sections: keyboard checklist + SR protocol notes + the Space-scroll row; composition/pro-hero stories carry the side-by-side targets in their notes.
- Wrappers: `pnpm gen` (manifest + tj-react) with the event-map UNTOUCHED; index re-exports; consumed-tokens guard covers the new surface pins.
- Gates: `pnpm install` (if deps move) → `pnpm test` → `pnpm lint` → `pnpm typecheck` → `pnpm build`. NO local `test:visual` in ANY mode (orchestrator mints provisional baselines post-review — port 6007 single-owner).

**Never:**
- No `_bmad-output/` / `.playwright-cli/` edits by the executor; freeze-ruling or DESIGN findings go in the executor REPORT (orchestrator lands them).
- No token VALUE edits, no new token keys (the chip-pair + byline pre-work @76b8ca5 landed everything this batch consumes — rubric subtitle rides the EXISTING card-title register, flagged).
- No `--tk-*` reads, no bank-package imports in `packages/tj-*` (FR-17; the row-as-link mold is TRANSLATED, not imported); no `--tj-*` reads from bank code (AD-2).
- No npm/publish/version changes; no CI workflow edits (harness auto-discovers).
- No invented states: no chip active/selected/disabled variants, no news-card hover-lift/shadow (cards are FLAT — the 95-card census), no skeleton shimmer/animation, no excerpt clamp (clamp = 16.4 post-card), no live regions for counts, no purple outside badge-purple/chip-* carriers.
- No heading-level invention: the rubric h1 and card titles are SLOTTED consumer headings (the component styles `::slotted(h1)`/`::slotted(h2,h3)` — it never renders its own heading element).

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rubric header composition | cover img + mark img + h1 + p in slots | panel-radius cover clip, 100×100 mark half-overlapping, rubric-h1 h1, card-title subtitle | missing cover/mark slots render without the overlap art (graceful, no broken layout) |
| Rubric header unknown slots | arbitrary slotted tags | unstyled inert passthrough (BYO content contract) | documented dev note |
| News card whole-card link | href + all slots filled | ONE anchor wraps card; single tab stop; ring on the card anchor | href empty/unset → inert anchor (16.1 mold), no crash |
| News card external | `target="_blank"` no rel | anchor carries `rel="noopener noreferrer"` | consumer rel wins verbatim; target non-_blank mints nothing |
| News card skeleton | `skeleton` attribute on/off | bones replace slot content (ink-300 12% alpha), aria-busy on host, bones aria-hidden; removing → live content | empty optional slots never render bones (excerpt optional both ways) |
| Tag chip | href + label slot | h40 pill, chip-fill/chip-ink, chevron decorative, wrap layout | href empty → inert (16.1 mold) |
| Chip hover/focus | pointer / Tab | lift −2px @ fast/curve-standard; ring chip-ink 2px/offset-2 | reduced-motion → lift 0ms (token collapse) |
| Chip dark theme | `data-tj-theme="dark"` ancestor | ZERO visual change (theme-invariant pair — tokens carry no dark override) | un-themed = same render (the pair IS the render) |
| Pro hero pattern | the composition story | purple field r30 + pro-h1 white + chip row + r10 CTA, both themes identical (theme-invariant surface) | pattern documented as composition, not shipped API |
| Wrapper drift | hand-edited generated file | `check:gen` RED | deterministic, sorted, no timestamps |
| FR-17 trip | any tj file importing bank packages | eslint boundary + consumed-tokens guards RED | mechanized at 15.1 |

## Code Map

- `packages/tj-components/src/tj-rubric-header/{index.ts,tj-rubric-header.ts,tj-rubric-header.css.ts,tj-rubric-header.test.ts,tj-rubric-header.stories.ts}` — NEW
- `packages/tj-components/src/tj-news-card/{index.ts,tj-news-card.ts,tj-news-card.css.ts,tj-news-card.test.ts,tj-news-card.stories.ts}` — NEW
- `packages/tj-components/src/tj-tag-chip/{index.ts,tj-tag-chip.ts,tj-tag-chip.css.ts,tj-tag-chip.test.ts,tj-tag-chip.stories.ts}` — NEW (includes the /pro/ hero pattern story)
- `packages/tj-components/src/index.ts` + `custom-elements.json` + `packages/tj-react/src/generated/` — via `pnpm gen` (event-map UNTOUCHED)
- `packages/tj-components/README.md` — component list +1 batch (short, honest)

## Tasks & Acceptance

**Execution:**
- [ ] tj-rubric-header (slots + slotted typography + overlap geometry + graceful-empty)
- [ ] tj-news-card (whole-card anchor + slots + skeleton + inert/external rules)
- [ ] tj-tag-chip (pill + chevron + lift + chip-ink ring + theme-invariance pin)
- [ ] /pro/ hero pattern story (tokens-only composition, both themes)
- [ ] Stories RU (playground/anatomy-or-species/accessibility/composition per the 16.1 story grammar) with FR-22 sections
- [ ] `pnpm gen` (manifest + wrappers ×3; event-map untouched) + index re-exports + README
- [ ] Full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

**Acceptance Criteria:**
- Given the docs build, when the harness reads the story index, then the new ТЖ stories are discovered with zero harness edits and pass axe in BOTH themes (zero violations — restricted inks never story-rendered; counts/timestamps at ink-300).
- Given `data-tj-theme="dark"` on an ancestor, when the chip renders, then it is PIXEL-IDENTICAL to light (theme-invariant pair pinned by test); the rubric header/news card re-resolve through tokens with zero component branches.
- Given the news card with `skeleton`, when captured, then bones render at the flagged ink-300-alpha with aria-busy and no animation; removing the attribute restores live slots.
- Given `pnpm gen`, when it runs, then manifest + wrappers regenerate deterministically for all SIX ТЖ components and `pnpm check:gen` passes clean.
- Given the executor diff, when reviewed, then no token value/key edits, no `_bmad-output/`/`.playwright-cli/` touches, no invented states, and every structural value carries its css.ts flag.

## Design Notes

- The chip AA story is the batch's load-bearing decision: the reference's OWN translucent chip fails AA with its white labels (3.380:1 machine-computed on the #9773FF composite). The authored `chip-fill #6E48DB` keeps the lift-off-the-field architecture (14% black compose over badge-purple) at 5.813:1 — the gold-ink mold (authored AA override, reference value recorded). The boundary vs the field (1.282:1) is decorative — the label text carries identification.
- The chip focus ring uses chip-ink, NOT focus-ring: the generic ring #8A8AE5 fails 3:1 against the purple field. This is the AA-surface law applied to focus — the ring rides its surface's ink. Pinned in css.ts comment + a test assertion.
- Counts/timestamps at ink-300 vs the reference's restricted grays: the 16.1 round-3 precedent generalized — FR-22 wins, the delta recorded. The engage/reference-time TOKENS stay in the table (consumers may opt into reference-exact chrome; the annotation documents the ratios).
- The rubric subtitle (card-title 17/400) and the excerpt register (article-body 17/400) are on-scale picks pending the side-by-side vs tj-rubric-news captures — the 16.1 H2-band mold: pick from the existing scale, flag, maintainer confirms.
- The whole-card anchor = one tab stop with a single accessible name: the accessible name computation rides the slotted title (aria-labelledby → the slotted heading id is CONSUMER-owned; the story demonstrates the pattern; the component adds no aria of its own beyond skeleton/busy).
- The /pro/ hero stays a PATTERN: shipping a hero component would freeze a surface the roster never asks to reuse; the story documents the composition + the purple-carrier ruling.

## Verification

**Commands:**
- `pnpm gen && git status --porcelain` (manifest + wrappers ×6; only expected changes)
- `pnpm check:gen` (clean tree passes)
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build`
- Visual/baseline work is ORCHESTRATOR-owned post-review: `pnpm test:visual:update` mints the provisional ТЖ baselines for the new stories (existing baselines byte-stable), CI compare owns the verdict.
</frozen-after-approval>

## Implementation Notes

(post-review orchestrator triage lands here)
