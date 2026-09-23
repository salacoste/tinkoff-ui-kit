---
title: 'Story 3.3 — Tabs: pill active state, automatic activation'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 0
baseline_commit: '1aa7bd7926de344b56dea7a53b6ba83a3f06356a'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's debit/credit/deposit switcher (the homepage's primary section control) has no kit counterpart.

**Approach:** Implement `tk-tabs` per EXPERIENCE.md/DESIGN.md: text tabs with the active tab rendered as a white pill + default shadow inside an invisible track; full tab semantics (tablist/tab/tabpanel, arrow cycling, Home/End, automatic activation per the reference); panel swap animates content only (expressive-standard), never the tab bar; frozen §4-style value channel (string) + index parity.

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE Tabs row): full semantics — tablist/tab/tabpanel roles, aria-selected, aria-controls/labelledby id wiring; arrow keys CYCLE (Left/Up prev, Right/Down next, WRAPPING — note the pick); Home/End jump first/last (named for Tabs in the Interaction Primitives — implement them here); AUTOMATIC ACTIVATION (reference behavior: moving focus selects); Tab moves into the active panel then out; roving tabindex (active tab 0, others −1); disabled tabs skipped by arrows, not focusable.
- Activation: `value`/`defaultValue`/`value-change` (string channel, frozen §4 semantics) + `activeIndex` derived parity (expose index in the event detail alongside value? — NO: detail {value} stays frozen-uniform; index derivable — note). `tabs` prop (2.3 data shape: { value, label, disabled?, badge?: number } — the reference switcher carries no badges but Badge exists now; support optional badge count rendering per tab; note the decision).
- Panels: content via named slots (`tab-<value>`? — slot names must be static-per-render; use per-index named slots `tab-0`, `tab-1`, … mapped from the active tab; document the consumer recipe; note the pattern). Panel swap animation: content-only fade/translate on the ACTIVE panel (expressive-standard curve, moderate duration per AD-9 mapping «tab swaps → expressive standard»), never the bar; reduced-motion → none (token layer + explicit).
- Visual (DESIGN tabs spec): text tabs; active = white pill + `--tk-shadow-default` INSIDE an invisible track (probe tabs-switcher.png for track metrics/pill height/inactive text color — the reference shows ~48px pill in a ~56px track? probe decides); active text = ink 500-weight + the yellow-redundancy rule (pill + shadow carry state, text weight reinforces — never yellow alone); inactive = text-secondary; hover = text color step (a cross-theme-safe token — surface-muted? NO, that's a bg; use text-primary on hover, 150ms — note); unified ring on the focused tab.
- Unit tests: full keyboard matrix (arrows cycle+wrap, skip-disabled, Home/End, Tab-into-panel), automatic activation, roving tabindex, aria wiring (selected/controls/labelledby), §4 transitions (strict/defaultValue/release), badge rendering, clamps, panel slot mapping, no-bar-animation structural pin.
- React: `'tk-tabs': { onValueChange: 'value-change' }` + gen + wrapper smoke.
- Component gate: impeccable/axe both themes; story: default + with badges + disabled tab + theming + a11y/keyboard checklist; PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/tabs-switcher.png` + PIXEL-PROBE (track/pill/inactive colors) + vision.

**Never:**
- No new tokens; no theme branches; no cross-theme hover tokens without dark mappings (2.5 lesson); no bar animation; no label[for].

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Arrow cycle | → at last tab | wraps to first; selection follows (automatic) | single tab → inert arrows |
| Skip disabled | disabled middle | arrows skip both ways; not focusable | all-disabled → first stays selected? pick: none selected + inert (note) |
| Home/End | Home | first tab selected + focused | — |
| Tab into panel | Tab from active tab | focus enters the active panel content | empty panel → focus passes through |
| Controlled | value prop set | strict; release seeds | value not in tabs → clamps to first (note) |
| Badge | badge: 5 on a tab | count chip renders in the tab (cap per Badge rules) | — |
| Panel swap | activation | active panel content animates (expressive-standard); bar static | reduced-motion → no animation |

</frozen-after-approval>

## Code Map

- `packages/components/src/select/` + `src/segmented-radio/` -- the molds (options channel, roving tabindex, arrow handling, §4 string semantics)
- `.playwright-cli/captures/tabs-switcher.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` § Tabs -- reference + observations (FULL path)
- `packages/components/src/badge/` -- the badge rendering inside tabs (compose, don't re-implement — render a tk-badge? shadow-nesting cost; simplest: render the badge MARKUP inline via shared css? NO — instantiate tk-badge inside the tab (shadow-of-shadow is fine: light-DOM child of the tab element in THIS component's shadow — nested custom elements work) — note the composition)

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/tabs/{index.ts,tabs.ts,tabs.css.ts,tabs.test.ts,tabs.stories.ts}` -- the suite
- [x] `packages/react/src/event-map.ts` + gen + wrapper smoke
- [x] `.playwright-cli/verify/tabs/` side-by-side + pixel probe + vision check
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts (all seven).
- Given activation, when the panel swaps, then ONLY panel content animates (structural pin: no animation properties on the track/tab bar).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; axe both themes zero violations; pixel probe recorded.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: wrap (yes), all-disabled selection state, hover treatment (text-primary 150ms), panel slot naming (index-based), badge composition (nested tk-badge).

## Spec Change Log

## Review Triage Log

2026-09-23 (quick review, 3 findings — all patched):

1. **Charcoal hover invisibility.** Hover on inactive tabs consumed the
   ACTIVE-text hook (`--tk-tabs-text-active` fallback text-primary #333) →
   on the charcoal Theming panel hover turned 1:1 invisible (proven live);
   overriding that hook to white would break the active pill label. PATCH:
   dedicated `--tk-tabs-text-hover` hook (default text-primary,
   cross-theme-safe) + the Theming charcoal recipe now overrides BOTH text
   hooks + a live hover-contrast assertion in tests/visual/tabs.spec.ts
   (computed hover color ≠ panel bg) + documented in the css header + NOTES.
2. **Truncation structurally impossible.** `flex:none` + nowrap with no
   track overflow spilled 3 tabs in a 360px host 62px over adjacent layout;
   the shipped label-ellipsis comment never engaged. PATCH (shrink route):
   `.tab { flex: 0 1 auto; min-width: 0 }` (shrink, no grow — text tabs stay
   content-sized) + `flex:none` on the nested badge so the label absorbs the
   shrink; overflow expectations documented in the css header; live spec
   assertion (360px host: `track.scrollWidth <= clientWidth`, last tab within
   bounds, ellipsis active on the constrained label).
3. **Swap-animation coverage gap.** The restart technique had no test — a
   technique regression kept every gate green (verified manually working).
   PATCH: tests/visual/tabs.spec.ts animationstart-based assertion across a
   real activation (fresh in-page mount with a shadow-root-internal listener
   — composed animation events retarget at the boundary; mount animation
   count PINNED at exactly one, a documented decision point so a future
   «no animation on mount» change fails loudly).

Also recorded (implementation-time catch, not a review finding): the active
tab's label initially did not paint — the positioned `::before` pill covers
unpositioned inline content; caught by the side-by-side PIXEL PROBE gate
(zero dark pixels inside the pill band), fixed via positioned `.tab__label` +
badge (the tk-button label mold), baselines re-taken in the same change.

## Design Notes

The pill: the ACTIVE tab button gets the white pill + shadow (background surface-base, radius-full, shadow-default) — the "invisible track" is just the row container with no background; probe the capture for exact heights. Panel animation: a keyframe on the panel element re-triggered on activation (animation restart via key change or re-added class — use the Lit keyed re-render or an animation-name toggle; document the technique; reduced-motion off).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
