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

- [x] Probes FIRST: (a) pill box + bottom offset from the hires card; (b) art zone span
      per card from the grid crop; (c) adoption art span render-verified vs capture ink
      — all in verify NOTES with measured → token + Δ *(probes A–D + the render-verify
      fixture; probe A's pill offset OVERTURNED the spec's expected neighborhood — see
      Implementation Notes 1)*
- [x] `artMode` union prop (reflect, clamp, jsdoc) + the bleed CSS set (zone geometry,
      actions overlay + re-scope, skeleton mirror, <768 chain) — CSS-only, no template
      edit *(gating invariant pinned by unit test; the `attribute: 'art-mode'` pin —
      Implementation Notes 6)*
- [x] Stories: Variants bleed demo + Accessibility row; showcase bento adoption
      (`.tkb-stage` retired, slots flipped); tests per the matrix *(components
      696→700; business-landing.spec.ts re-pinned to the live anatomy — Implementation
      Notes 10)*
- [x] `pnpm gen` (CEM + wrappers) + `pnpm gen:tokens` byte-stable; DOM-identity proof
      (no attr → byte-identical) *(shadow-render identity pinned by unit test; the
      host-mint deviation honestly recorded — Spec Change Log 1)*
- [x] THE baseline round: sanctioned set explicit-delete + update, both themes, ×2
      stable, zero movement outside the set; `lsof -ti:6007` clean before each pass
      *(exactly the 8 sanctioned PNGs; playground/theming canaries byte-stable)*
- [x] Full gates (build → test → lint → typecheck → gen-drift post-commit → visual ×2);
      spec closed; conventional commit EN; CI green by `gh run` *(executor 9813a65 +
      orchestrator merge round; CI verdict in Verification)*

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

## Implementation Notes

Executor judgment calls (worktree commit 9813a65; lens-audited — all five mandated
adjudications returned in the executor's favor where they clashed with the spec's
expectations):
1. **Pill bottom offset = `var(--tk-space-32)`, Δ=0.0 in 6/6 cards** (probe A hires
   528×408: pill rows 332–375, cols 208–319, center 263.5 = card center EXACTLY;
   probe B: 32px in all five grid cards) — the spec's expected space-12–16
   neighborhood REFUTED by pixels. That neighborhood traced to the retired
   `.tkb-stage__cta { bottom: calc(-1*var(--tk-space-16)) }` workaround — a proxy of
   the old stage, not the reference. The lens's independent strict detector
   (contiguous white-run ≥246, run ≥80px — excludes art-white contamination) reproduced
   the same boxes. Probe D re-confirmed on the re-taken baseline (33 PNG px ≈ 32 CSS).
2. **No scrim held** (probe A: 0 colorful px above the art zone in any reference card;
   text bands all above art; art top at 42–52% of card) — the spec's probe gate
   confirmed the no-overlay decision.
3. **Sizing anchored on ZONE HEIGHT, not ink width:** reference art ink spans 99–100%
   of card width; the kit's five bentoArt SVGs reach only 43–71% intrinsically and
   redrawing is forbidden → `width:100%; max-width:400px` on the sizing hook (zone h =
   0.6 × svg width): wide cards +1.7% (card 0: 240 vs 236) / +0.4% (card 1: 240 vs
   239); trio at 100% width undershoot −9.0…−19.1% — the closest possible without
   >100% width. *(The +1.7% figure was initially miswritten +0.4% in NOTES/ledger/
   commit message — corrected in the docs round, see Change Log 3.)*
4. **Zone height stays NATURAL** (reference varies 208–239 per card) — `height:auto`,
   nothing pinned; render-verified: aspect checks 0.989–1.002 on all five shapes, svg
   box flush to card bottom (each ink-bottom gap equals the shape's intrinsic empty
   strip exactly).
5. **Charcoal + bleed coexist:** both selectors declare the IDENTICAL re-scope pair —
   one cascade result, no conflict; both kept (each documents its own surface).
6. **`attribute: 'art-mode'` pin on the @property options** (with `reflect: true`):
   Lit's default reflected name is the property PLAIN-LOWERCASED (`artmode`), NOT
   kebab — without the pin the CSS gate `[art-mode='bleed']` would never match and
   `setAttribute('art-mode', …)` would never reach the property. Lens mutation-proved
   it on the worktree's own deps (happy-dom + Lit probe: unit test's first assertion
   fails without the pin). Pagination `show-more` precedent.
7. **Host attribute minting** — see Spec Change Log 1 (the round's one honest
   deviation).
8. **400px is a showcase-side length literal** (probe-measured): the zero-hardcoded
   guard's letter covers colors/z-index — lengths are its documented blind spot
   (tests/zero-hardcoded.test.ts:31-37); the literal carries a provenance comment
   (flag-don't-invent).
9. **Showcase art wrapper** `<span class="tkb-bento__art" slot="art">`: `bentoArt()`
   returns raw svg strings (unsafeSVG) and the component's `::slotted(svg)` cannot
   reach nested svgs — the wrapper carries the slot + aria-hidden, wrapper sizing lives
   in showcase CSS (the retired stage's own mold); the component stays generic
   (`::slotted(img)` verbatim + the documented svg companion).
10. **business-landing.spec.ts geometry leg re-pinned:** the old leg asserted the DEAD
    `.tkb-stage` DOM (rects 0 → `0 < 0`) — mandatory, not discretionary. Lens diffed
    old vs new: NO coverage lost (wide/trio zone tracks, cta/zone overlap, ≥44 pill hit
    all retained), three assertions GAINED (zone ≈ card width ±0.5, zone flush to card
    bottom ±0.5, pill offset ≈32 digits-0) — the shadow bleed zone measured through the
    open shadowRoot.
11. Baseline-update round triaged two failures: the geometry leg above (spec fix, not a
    PNG) and a `token-reference--motion [light]` 2.7m duration vs ~850ms siblings with
    the PNG unchanged on disk — pre-capture timeout under the loaded run (starvation
    class); passed both ×2 passes, no action.

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **Honest deviation (MINOR-3, lens-required): the host MINTS `art-mode="top"` from
   the first update on every card.** The frozen byte-stability text said «no attribute
   is minted», but the SAME frozen block mandated `@property({ reflect: true })` with
   the `'top'` default — reflect + a non-undefined default necessarily writes the
   attribute; the two sentences were internally inconsistent. The mint is the exact
   `variant="gray"` precedent (minted on every card since 3.6 — that IS the baseline
   state). Operative mitigations, all lens-verified: the SHADOW render is
   byte-identical (unit-pinned CSS-ONLY identity test — bleed vs plain innerHTML
   equal, zero `art-mode` attrs inside any shadow tree); zero CSS matches
   `[art-mode='top']`; canary PNGs byte-stable (the commit moves EXACTLY the 8
   sanctioned legs). AC-2's operative reading (pixels + shadow DOM) holds; the strict
   host-DOM reading is this entry.
2. Pill offset probe outcome (Implementation Notes 1): the spec's frozen
   «expected neighborhood space-12–16» was a probe-gated EXPECTATION, not a frozen
   number — the gate fired and the probe won (the spec's own mechanism, no change-log
   deviation; recorded here because the frozen text named a number).
3. Docs-round corrections (lens MINOR-1/2): NOTES probe-C card-0 arithmetic corrected
   +0.4% → +1.7% (also in the business-landing ledger row 10); detector caveat
   recorded for the committed probe scripts (the RECORDED pill boxes come from strict
   detection; re-running the committed `probe_a4_hires_final.py`/`probe_b3` yields
   art-white-contaminated wider boxes on the hires card and grid cards 1/3). The
   commit message's «wide +0.4%» repeats the slip unamendably — this entry is the
   correction of record.
4. Merge round + CI verdicts: see Verification.

## Review Triage Log

Quick review (qr-lens-10-x, 2026-09-26): **SHIP — 0 MAJOR / 3 MINOR; no executor fix
round. All five mandated adjudications returned EXECUTOR-CORRECT where they clashed
with the orchestrator/spec expectations:**
1. [ADJ-1] Pill offset 32 vs 12–16 — executor's 32 CONFIRMED by the lens's own strict
   detector (hires + 5/5 grid cards, center-exact); the 12–16 neighborhood traced to
   the retired `.tkb-stage` workaround. `toBeCloseTo(32, 0)` pin CORRECT.
2. [ADJ-2] max-width:400px — HONEST: the zero-hardcoded guard's documented letter does
   not cover length literals (no guard evasion); provenance comment thorough.
   Precision correction extracted as MINOR-2 (+1.7% miswritten +0.4%, card 0).
3. [ADJ-3] `attribute:'art-mode'` pin — REQUIRED; lens mutation-proved it in probe
   space (worktree untouched): without the pin reflect writes `artmode`, and
   `setAttribute('art-mode','bleed')` never reaches the property.
4. [ADJ-4] The mint — all technical claims TRUE (shadow identity test, zero CSS
   matches 'top', canaries byte-stable); Change Log entry owed → written at triage
   (Change Log 1, the MINOR-3 REQUIRED action — this round).
5. [ADJ-5] spec-test rewrite — NO coverage lost, three pins gained; the old leg
   asserted dead DOM.
- [MINOR-1] committed probe scripts over-detect vs the recorded NOTES boxes → caveat
  recorded (Change Log 3); scripts kept as evidence artifacts.
- [MINOR-2] +1.7% miswritten as +0.4% (NOTES:77, ledger dev.10, commit message) →
  corrected in docs round (Change Log 3).
- [MINOR-3] mint deviation unrecorded in the spec Change Log → REQUIRED triage action,
  done (Change Log 1).
- Checklist independently re-verified by the lens: unit 700/700 (29 files) re-run,
  zero-hardcoded 7/7 re-run, gen+gen:tokens drift 0 re-proven, root lint/typecheck
  OK, `.tkb-stage` grep = zero live markup, sanctioned containment proven
  structurally (commit diff moves exactly the 8 PNGs), iron rules held, stories RU
  content/EN meta held.

## Verification

- Executor round (worktree, 9813a65): probes A–D + the render-verify fixture FIRST →
  implementation → gen/gen:tokens (byte-stable) → build → test (components 700, total
  934) → lint → typecheck — all exit 0. Baseline round: exactly the 8 sanctioned PNGs
  (explicit delete + update; port clean before the run); two update-run failures
  triaged (Implementation Notes 11); visual **1368/1368 ×2** (8.8m / 8.1m); post-commit
  gen-drift clean.
- Lens round (qr-lens-10-x): unit 700/700 (29 files) re-run, zero-hardcoded 7/7 re-run,
  gen+gen:tokens drift 0 re-proven, root lint/typecheck re-run, `.tkb-stage` grep =
  zero live markup, sanctioned containment proven structurally (commit diff moves
  exactly the 8 PNGs), the Lit-casing pin mutation-proved in probe space, the pill
  offset independently re-measured (strict detector: 32.0px hires + 5/5 grid).
- Merge round (orchestrator, main tree): fast gates green (build → test **934** (147+
  17+700+70) → lint → typecheck → gen → gen:tokens); GEN_DRIFT_CLEAN; worktree
  porcelain clean; visual **1368/1368 ×2** (8.2m / 8.2m), `lsof -ti:6007` clean
  before every pass.
- Merge: bdea907..9813a65 ff-only (35 files, +1602/−54); pushed.
- **CI VERDICT on 9813a65: GREEN — run 36227239549 (07:35:22Z → 07:55:30Z, 20.1m,
  gates job success).** Story 10.3's green head = 9813a65.
- Docs round: spec post-execution sections + Change Log (the mint entry — Change Log 1)
  + MINOR-1/2 corrections (NOTES +1.7%/caveat, ledger row 10) + ledger 7.4(e) closure
  + CLAUDE.md cycle bullet and totals 930→934; docs-head CI verdict recorded below.
- **CI VERDICT on the docs head: GREEN — run 36228304954, gates job success** (the
  terminal head's own run verified via `gh run` after this line landed — the standing
  non-self-referential close).
