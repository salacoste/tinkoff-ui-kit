# Group III ledger — navigation + cards (Story 5.3)

Seven components × six checks = 42 cells + burger <768 + the 3.10
composition re-verification. Legend: **sweep** = `tests/visual/a11y-sweep.spec.ts`,
**RM** = `tests/visual/reduced-motion.spec.ts`, **axe** = generated per-theme legs.
All file:line pointers opened during the sweep; bodies verified.

## tk-tabs

| Check | Evidence |
|---|---|
| 1 Keyboard | LIVE matrix `tests/visual/tabs.spec.ts:76-129` (arrows cycle + WRAP with automatic activation — focus AND aria-selected AND value-change move together; End; Home) + `:131-145` (disabled skipped both directions, live) + `:147-205` (Tab enters the ACTIVE panel, empty panel passes through, inactive panels unreachable); unit Home/End `tabs.test.ts:256`, unhandled keys pass through `:204`; sweep walk (roving single stop). |
| 2 Ring | Tab ring `tabs.css.ts:131-134` — asserted computed at the real Tab stop by the sweep walk, both themes. |
| 3 Roles/names/states | tablist/tab/tabpanel wiring `tabs.test.ts:108`; the badge count JOINS the accessible name (name computation pierces the nested badge shadow) `tabs.spec.ts:207-218` LIVE; aria-selected tracks activation `:507`; roving tabindex `:486`; axe. |
| 4 Contrast | Active/inactive tab text = text-primary/text-secondary on surface-base rows; the active treatment's underline redundancy principle (700 weight + underline, yellow never alone) — the navbar ruling family (`navbar.test.ts:176` structural analog); charcoal-tint theming pairs covered by the sweep tint rows. |
| 5 Geometry | Every tab button box ≥44 tall (the full track height) — real-pixel `tabs.spec.ts:279-295`; sweep scan. |
| 6 Reduced motion | Belt `tabs.css.ts:229`; NO-BAR-ANIMATION + swap-only-with-motion pinned in COMPUTED styles both preferences `tabs.spec.ts:220-277` LIVE; RM legs every tabs story × theme. |

## tk-navbar

| Check | Evidence |
|---|---|
| 1 Keyboard | Burger opens → controller mount + scroll lock + focus trap `navbar.test.ts:257` (body verified: wrap Tab defaultPrevented, focus inside); Esc closes + lock released + focus RESTORED `:337`; burger toggles; link click closes `:360`; COMPOSITION-level live trap: `tests/visual/homepage.spec.ts:233-267` (drawer at 360: focus placed on first link, 6×Tab cycles inside, Esc closes, focus back on burger) — re-verified this change; sweep walk (playground: EXACTLY 6 kit stops — 4 links + 2 utilities, both themes, count pinned) + sweep 360 leg (Enter-open, Tab ring inside, Esc close). |
| 2 Ring | Links + drawer links `navbar.css.ts:155-159`, burger `:198-201` — asserted computed by the sweep walk (both themes) and the sweep 360 burger/drawer leg; utilities = story-composed anchors with the ring (`navbar.stories.ts` .tkn-utility:focus-visible) — F2 fix pads them to 44 min-width. |
| 3 Roles/names/states | banner + nav landmarks + slots `navbar.test.ts:224`; activeValue → aria-current exactly on the match `:145`, unmatched marks nothing `:162`; yellow underline CSS-redundant with 700 weight `:176`; axe both themes. |
| 4 Contrast | Links text-secondary on surface-base 5.635 / dark rows; active text-primary rows; underline = redundant state (R2 family); burger glyph decorative (aria-label names the button). |
| 5 Geometry | Links stretch the FULL bar height (72px desktop / 56px mobile — `navbar.css.ts:64-65,:117-121,:303-305`, align-items: stretch) — sweep scan real-pixel ≥44; burger 44×44 (`:184-185` + sweep 360 leg measured); drawer links min-height 44 (`:273-278` + sweep 360 leg measured); utilities 44 floor after F2 (sweep scan). |
| 6 Reduced motion | Scrolled-shadow fade rides the 150ms token (`navbar.css.ts:69-71`, instant under reduce — `navbar.test.ts:131` structural) + drawer belt `:253`; RM legs every navbar story × theme. |

## tk-footer

| Check | Evidence |
|---|---|
| 1 Keyboard | Tab/Shift+Tab: sweep walk `sweep III/walk: tk-footer` (playground — full link set, reverse walk revisits every stop); anchors native (`footer.test.ts:104` — ul/li + plain anchors with hrefs); stateless `:281`. |
| 2 Ring | Column links + pills ring `footer.css.ts:112-116` — asserted computed at every stop by the sweep walk, both themes. |
| 3 Roles/names/states | contentinfo LANDMARK via native footer `footer.test.ts:97`; columns are LISTS `:104`; pills named `:139`; malformed entries never break the tree `:231`; axe both themes. |
| 4 Contrast | Column links text-secondary on surface-base 5.635 (light) / dark rows; pills white on ink-300 12.635 (existing inverse-fill pair; sweep's badge-stat row re-cites the values); legal = text-secondary rows; phone = text-primary rows. |
| 5 Geometry | Pills ≥44 (structural `footer.test.ts:139` + sweep scan real-pixel); column/legal links = text-target RULING (§9 kit-wide row — dense directory lists keep text-bounded targets; the scan's only exemption). |
| 6 Reduced motion | Pill/link transitions ride tokens; RM legs every footer story × theme. |

## tk-promo-card

| Check | Evidence |
|---|---|
| 1 Keyboard | Card is PASSIVE — no role/tabindex/channel events `promo-card.test.ts:121`; the action is the slotted tk-button (button matrix, group I); sweep walk (playground: single CTA stop). |
| 2 Ring | None owned (passive — check 1); the CTA's ring comes from the composed tk-button — asserted computed by the sweep walk, both themes. |
| 3 Roles/names/states | h3 heading from props `:51`; slot overrides `:78`; absent props render nothing `:69`; axe both themes; sweep scan (CTA named, ≥44). |
| 4 Contrast | Sweep grid: text-primary on 4 tints light 10.586–11.596 + dark 14.909–15.626; text-secondary descriptions 4.721–5.172 light / 8.091–8.382 dark; white on invariant charcoal 12.635; the charcoal-CTA invariant pair 12.635. |
| 5 Geometry | CTA = tk-button card size 48 (button precedent); sweep scan. |
| 6 Reduced motion | SKELETON static (no animation) under the attribute `promo-card.test.ts:249` + RM legs LIVE on skeleton stories × theme; lazy art decode (`:170,:182`) is not motion. |

## tk-feature-card

| Check | Evidence |
|---|---|
| 1 Keyboard | Passive `feature-card.test.ts:149` (no role/tabindex/pointer cursor); action = slotted tk-button; sweep walk (single CTA stop). |
| 2 Ring | CTA ring via the composed tk-button — sweep walk, both themes; editorial CTA pair stays white/ink `:94` (review finding 1 re-verified by the invariant contrast row). |
| 3 Roles/names/states | h3 heading-4 `:46`; editorial wiring `:59`; art-zone collapse `:107`; lazy enforcement `:173`; axe; sweep scan. |
| 4 Contrast | The same sweep tint grid (text-primary/secondary × tints × themes); editorial = white on charcoal 12.635 + editorial CTA invariant pair. |
| 5 Geometry | CTA = tk-button (48 card size); min-height 320 via hook `:132` (structural); sweep scan. |
| 6 Reduced motion | SKELETON static `:206` + RM legs LIVE × theme. |

## tk-service-card

| Check | Evidence |
|---|---|
| 1 Keyboard | Passive `service-card.test.ts:126` (no click surface); the action is a slotted tk-link STANDALONE — group I link matrix (native anchor Enter, construction); sweep walk (single link stop, reverse walk). |
| 2 Ring | Link underline §9 exception — verified LIVE by the sweep walk (opaque underline at the stop, both themes; the walk's global exception matchers). |
| 3 Roles/names/states | Icon container aria-hidden `:48`; h3 heading-5 `:82`; slot override `:96`; NO skeleton ruling `:163`; axe; sweep scan (link named «Подробнее», ≥44). |
| 4 Contrast | Action link = link-on-tint on the card tints — sweep rows (4.724–5.175 light / 5.856–6.137 dark; white on charcoal 12.635). |
| 5 Geometry | Standalone link 44×44 floor (group I geometry + sweep scan real-pixel); icon tile 48 square decorative `:17-18` header. |
| 6 Reduced motion | Static content card; RM legs every story × theme. |

## tk-article-card

| Check | Evidence |
|---|---|
| 1 Keyboard | SINGLE tab stop — exactly one focusable in the shadow tree (the link) `article-card.test.ts:56`; the ::after stitch covers the whole card `:46` — one native click target; Enter = native anchor; sweep walk (single stop, Shift+Tab reverse). |
| 2 Ring | §9 exception (2026-09-23 tk-article-card row) — the underline is the indicator; verified LIVE by the sweep walk (opaque underline at the stop, both themes). |
| 3 Roles/names/states | h3 heading-6 `:81`; link label overridable + semantic token `:95`; slot override `:109`; axe; sweep scan (link named, named heading). |
| 4 Contrast | Title/description = the sweep tint grid (text-primary/secondary on tints × themes); the «Читать» link = link-on-tint rows; charcoal variant = white on charcoal 12.635. |
| 5 Geometry | The STITCH is the target: sweep targeted leg LIVE — ::after resolves absolute + inset 0 over the positioned card, card ≥44×44 (plus the structural pin `:46` and single-stop `:56`); the glyph box itself may be shorter — the hit area is the card. |
| 6 Reduced motion | SKELETON static render `:160` + RM legs LIVE × theme. |

## Re-verifications (spec-required, this change)

- **Burger drawer <768 (component level):** sweep 360 leg — burger visible
  44×44, keyboard-open via Enter, drawer links ≥44 tall, unified ring at a
  real Tab stop inside the drawer, Esc closes and focus returns to the
  navbar. The UTILITIES cluster stays visible at 360 (the story media query
  chips it: round search + login pill) and its geometry is asserted in the
  same leg — both chips ≥44×44 (the F2 min-width floor holds at the mobile
  register too). Composition level: homepage.spec burger walkthrough re-run green
  (below).
- **3.10 homepage axe 3×2 + composition:** `tests/visual/homepage.spec.ts`
  re-run this change — 14/14 green (axe at 1280/900/360 × light/dark zero
  violations; tracks/burger/CTA legs; single-primary discipline; the burger
  trap walkthrough). The F2 story-css fix (utilities min-width) does not
  touch the composed homepage (it composes its own utilities), re-verified
  by the green re-run.

**Group III total: 42/42 cells evidenced + burger leg + homepage 3×2.** SR
protocol rows added to all seven components' «Доступность» stories.
