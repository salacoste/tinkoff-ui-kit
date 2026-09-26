---
title: 'Story 10.3 — promo-card full-bleed art mode (art-mode=bleed)'
type: 'feature'
created: '2026-09-26'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'f0a3050'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 10.3; ratified 2026-09-25)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (spec-7-4 entry (e): the full-bleed gap; the 10.1+10.2 lazy-media decode rule)'
  - '{project-root}/.playwright-cli/verify/business-landing/NOTES.md (deviation registry rows 2/4/10 — the .tkb-stage workaround, the pill re-scope, heights)'
  - '{project-root}/.playwright-cli/captures-v2/business/pattern-products-grid.png (the bento 2+3: five cards, orchestrator-probed 2026-09-26 — numbers below)'
  - '{project-root}/.playwright-cli/captures-v2/business/probe-beige-card-hires.png (528×408 hi-res card — the pill/zone offset probe source)'
  - '{project-root}/packages/components/src/promo-card/{promo-card.ts,promo-card.css.ts} (current anatomy: art TOP inside padding, actions inside body)'
  - '{project-root}/packages/components/src/showcase/business-landing.stories.ts:389-396,785-814 (the bentoCard .tkb-stage workaround this story retires)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-10-1-10-2-sr-only-labels-error-channel-slots.md (the batch-mold spec; the render-verify lesson)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** tk-promo-card's art zone renders only ABOVE the content, inside the card
padding (Story 3.6 anatomy). The reference business bento (7.4's deviation 2) runs the
art as a FULL-BLEED zone at the card's BOTTOM — escaping the padding, spanning the card
width, flush to the bottom edge — with the white CTA pill floating OVER the art near the
card's bottom, centered. The 7.4 showcase could not compose this from the kit and shipped
the `.tkb-stage` workaround (art + CTA crammed into the actions slot). Epics-v3 10.3
(ledger 7.4e) closes the gap.

**Approach:** One additive mode channel — `artMode: 'top' | 'bleed' = 'top'` (reflected
`art-mode`, the CONVENTIONS §2 literal-union + enum-clamp mold). The mode is **CSS-ONLY
on the existing anatomy**: the template/DOM does not change, `data-has-art` keeps
governing the zone, all new rules live behind `:host([art-mode='bleed'])`. In bleed:
the art zone re-orders BELOW the body (flex `order`), escapes the card padding via
negative margins that track the SAME padding hooks (desktop + the <768 mobile hook),
clips to the card's bottom corners (the radius hook + overflow hidden), and the actions
zone becomes an overlay pinned bottom-center over the art (the reference's floating
pill), carrying the charcoal-CTA re-scope pair so the pill stays white over art in BOTH
themes. The business showcase's bento then adopts the mode — `.tkb-stage` dies, art →
`art` slot, CTA → `actions` slot — closing deviation 2.

**Orchestrator probe evidence (2026-09-26, pattern-products-grid.png, all five cards):**
art zone at the card bottom in every card (colorful bands h≈147–208 — NATURAL height,
varies per card; zone spans to the card edges), text rows carry ZERO colorful pixels
(text sits on pure tint above the art — **no text-over-art anywhere**), white pill
≈112–123×44 present in ALL five cards floating over the art bottom (pill rows ~90–96%
of card height, horizontally centered; two white-run bands per pill = pill chrome around
the label glyphs). **SCRIM DECISION (the epics' probe gate): NO scrim** — the reference
carries no overlay; its contrast strategy is positional separation (text on tint, art
below) + the pill's own white surface. No token is added.

## Boundaries & Constraints

- **API:** `@property({ reflect: true }) artMode: TkPromoArtMode = 'top'` with
  `static readonly artModes = ['top', 'bleed'] as const`; invalid values clamp to
  `'top'` with the reflected attribute corrected (the `variant` willUpdate mold,
  verbatim). jsdoc `@attr {top|bleed} art-mode` + class-header mode paragraph. No other
  prop/slot/event. React surface: ZERO manual work (CEM regen carries typing).
- **Byte-stability invariant (the round's core guarantee):** with `art-mode` absent (or
  `'top'`), the rendered output is IDENTICAL to baseline_commit — every new CSS rule is
  gated behind `:host([art-mode='bleed'])`, the template is untouched, no attribute is
  minted. The ONLY baselines that may move (both themes, ×2 stable, explicit delete +
  update) are: `components-promocard--{variants,accessibility,api}` (new demo + CEM)
  and `showcase-business-landing--business-landing` (the adoption). ANY other PNG
  moving → STOP and investigate (the 6.3 contamination class).
- **Bleed zone geometry:** `.card__art` gains `order: 2` (renders after `.card__body`;
  the DOM stays art-first — no template edit), `margin-inline:
  calc(-1 * <padding hook chain>)`, `margin-block-end: calc(-1 * <padding hook chain>)`
  (the SAME `--tk-promo-card-padding` chain the card padding consumes — a consumer
  override propagates to the bleed automatically; the <768 media overrides with the
  `--tk-promo-card-padding-mobile` chain), `overflow: hidden`, bottom-corner radius =
  the `--tk-promo-card-radius` chain (top corners 0), `margin-bottom: 0` (top mode's
  space-24 rhythm dies in bleed). `::slotted(img)` in bleed: `display: block;
  width: 100%; height: auto` (the reference mold: illustration at natural height —
  `object-fit` stays UNCONSUMED; no cover-crop decision, no heights pinned).
- **Actions overlay (the floating pill):** in bleed `.card { position: relative }` and
  `.card__actions` becomes `position: absolute; inset-inline: 0;
  bottom: <probe-gated offset>` + `justify-content: center; padding-top: 0`
  (`margin-top: auto` is void — out of flow). The offset is PROBED from
  `probe-beige-card-hires.png` (+ the grid crop's pill rows ~90–96% card height);
  expected neighborhood: `var(--tk-space-12)`–`var(--tk-space-16)`; record measured →
  token + Δ in verify NOTES and the css header. The pill's theme safety rides the
  charcoal-CTA technique (promo-card.css.ts's documented pair): bleed applies the SAME
  re-scope (`--tk-color-surface-base: var(--tk-promo-card-cta-fill, var(--tk-color-white))`
  / `--tk-color-text-primary: var(--tk-promo-card-cta-text, var(--tk-color-ink-300))`)
  inside the actions zone — the dark layer's surface-base remap would otherwise paint
  the pill near-black over theme-invariant art (the exact 7.4 stage finding). Same
  hooks, NO new tokens; `variant='charcoal'` + bleed coexist (both declare the pair —
  identical values, no conflict; record).
- **data-has-art interplay UNCHANGED:** no slotted art in bleed → the zone stays
  collapsed (`display: none`), the body renders normally, and the absolute actions
  overlay pins to the card's bottom over the tint — an acceptable, recorded degrade
  (the no-art row). Skeleton in bleed mirrors the mode: `.sk--art` gets the same
  order/bleed margins/bottom-corner radius (aspect 4/3 stays as the placeholder
  estimate); `.sk--cta` keeps `margin-top: auto` (the placeholder approximates the
  overlay — recorded, not re-derived).
- **Showcase adoption (the story's own «compose without deviations» clause):** the
  bento cards flip to `art-mode="bleed"`: `.tkb-stage` dies, the existing
  `bentoArt(product.art)` SVG moves to `slot="art"` (aria-hidden stays), the secondary
  `tk-button` «Подробнее» moves to `slot="actions"`, the stage CSS block dies. The
  art's rendered size is PROBE-GATED against the captures (the stage's old
  `max-width: 260px` is a starting hypothesis, not a frozen number — measure the
  reference art span vs card width, map, record). All other showcase content
  byte-stable. Deviation 2 closes; deviations 3/4/10 annotations update in NOTES only.
- **Probes FIRST (the 10.1+10.2 lesson — every extraction render-verified):** before any
  CSS, record in `.playwright-cli/verify/promo-card-10-3/NOTES.md`: (a) the pill bottom
  offset + pill box from `probe-beige-card-hires.png`; (b) the art zone's vertical span
  + horizontal reach per card from `pattern-products-grid.png`; (c) the adoption art's
  reference span (art ink width vs card width) with a render-width check against the
  capture ink. Numbers → tokens with Δ recorded.
- **Story/demo placement (RU content, EN meta):** the bleed demo lands in promo-card
  Variants (composed secondary button + a decorative svg, aria-hidden); the
  Accessibility checklist gains the bleed row (slotted decorative art stays
  consumer-aria-hidden; the pill's accessible name is the button's own); Api moves via
  CEM (`@attr` jsdoc). No v2 docs page exists for promo-card — none created.
- **Gates:** full chain build → test → lint → typecheck; `pnpm gen` (CEM + wrappers) +
  `pnpm gen:tokens` (byte-stable); post-commit gen-drift (`pnpm gen && pnpm gen:tokens
  && git diff --exit-code -- packages/ tests/`); visual ×2 zero-unexplained movement
  with `lsof -ti:6007` clean before each pass; CI green = Actions verdict (`gh run`) on
  the pushed head.
- **Non-goals:** no scrim token (the probe decision above); no top-mode restyle; no new
  slots/props beyond `artMode`; no `object-fit: cover` photo mode; no bento grid/height
  changes (deviation 10's assembly standard stays); no button href (10.4); no
  storycopy invention (existing bento copy verbatim); no baseline re-takes outside the
  sanctioned set.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| default (attr absent) | no `art-mode` | render byte-identical to baseline (top mode) | any diff → FIX before baselines |
| art-mode='top' | explicit | same as default | — |
| art-mode='bleed' + art | slot art + heading/desc | zone bleeds bottom (order 2, negative margins, bottom corners clipped); pill overlays art bottom-center | zone inside padding / pill under art → FIX |
| bleed + NO art | `art-mode="bleed"` alone | zone collapsed; pill pinned bottom over tint (recorded degrade) | phantom empty zone → FIX |
| bleed + skeleton | `skeleton` + bleed | `.sk--art` mirrors the bleed zone; other blocks unchanged | top-mode art block in bleed → FIX |
| bleed + charcoal | `variant="charcoal"` | both CTA re-scopes coexist (identical pair) | conflicting scope → never |
| bleed + dark theme | `data-theme="dark"` | pill stays white/ink (the re-scope pair) | near-black pill over art → FIX |
| bleed + empty actions | no slotted CTA | overlay zone empty — zero phantom space | phantom gap → FIX |
| bleed <768px | narrow viewport | bleed margins track the padding-mobile chain | padding escapes but bleed doesn't → FIX |
| invalid art-mode | `art-mode="diagonal"` | clamps to 'top', attribute corrected | throw/unknown mode render → never |
| lazy art enforcement | slotted `<img>` | `loading=lazy decoding=async` still enforced (untouched handler) | regression → FIX |
| showcase adoption | bento cards | `.tkb-stage` gone; art slot + actions slot compose; deviation 2 closed | invented art/copy/size → never (probe-gate) |
| CEM regen | `pnpm gen` | `art-mode` in CEM + wrappers; Api docs pick up | stale CEM → gen-drift fails |
| Round isolation | any PNG outside sanctioned set | STOP + investigate | blind update → process violation |
| Gates | full chain + visual ×2 + gen-drift | ALL exit 0 | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/promo-card/promo-card.ts` — `artMode` prop + union + clamp +
  jsdoc (`@attr`, class-header mode paragraph). NO template change.
- `packages/components/src/promo-card/promo-card.css.ts` — the `:host([art-mode='bleed'])`
  rule set (zone order/bleed/clip, actions overlay + re-scope pair, skeleton mirror,
  <768 chain) + header documentation (probe numbers, the no-scrim decision)
- `packages/components/src/promo-card/promo-card.stories.ts` — Variants bleed demo,
  Accessibility checklist row
- `packages/components/src/promo-card/promo-card.test.ts` — reflection, clamp, bleed +
  data-has-art toggle, default byte-shape pins
- `packages/components/src/showcase/business-landing.stories.ts` — the bento adoption
  (`.tkb-stage` dies; slots flip)
- `custom-elements.json` + `packages/react/src/generated/*` — regenerated (`pnpm gen`),
  zero hand edits
- `tests/visual/visual.spec.ts-snapshots/` — the sanctioned re-take set (6 legs:
  promocard ×3 stories ×2 themes + business-landing ×2; explicit delete + update)
- `.playwright-cli/verify/promo-card-10-3/NOTES.md` — probe transcripts (pill offset,
  zone geometry, adoption art span + render-verify), re-take manifest

## Tasks & Acceptance

- [ ] Probes FIRST: (a) pill box + bottom offset from the hires card; (b) art zone span
      per card from the grid crop; (c) adoption art span render-verified vs capture ink
      — all in verify NOTES with measured → token + Δ
- [ ] `artMode` union prop (reflect, clamp, jsdoc) + the bleed CSS set (zone geometry,
      actions overlay + re-scope, skeleton mirror, <768 chain) — CSS-only, no template
      edit
- [ ] Stories: Variants bleed demo + Accessibility row; showcase bento adoption
      (`.tkb-stage` retired, slots flipped); tests per the matrix
- [ ] `pnpm gen` (CEM + wrappers) + `pnpm gen:tokens` byte-stable; DOM-identity proof
      (no attr → byte-identical)
- [ ] THE baseline round: sanctioned set explicit-delete + update, both themes, ×2
      stable, zero movement outside the set; `lsof -ti:6007` clean before each pass
- [ ] Full gates (build → test → lint → typecheck → gen-drift post-commit → visual ×2);
      spec closed; conventional commit EN; CI green by `gh run`

**Acceptance Criteria:**
- Given `<tk-promo-card art-mode="bleed">` with slotted art + a secondary button, then
  the art renders as a bottom full-bleed zone (outside the padding, clipped to the
  card's bottom corners) and the pill floats over the art bottom-center, white in both
  themes.
- Given the same card WITHOUT `art-mode`, then the rendered output is byte-identical to
  the pre-story render (top mode; DOM unchanged, no phantom attributes).
- Given the business bento after adoption, then no `.tkb-stage` markup remains, the
  cards compose from the mode directly, and deviation 2 is closed in NOTES.
- Given the merged tree, then every gate exits 0, gen-drift is clean, and the only
  moved PNGs are inside the sanctioned set.
