# Group I ledger — primitives, indicators, overlays (Story 5.1)

Seven components × six checks = 42 cells. Evidence legend: **sweep** =
`tests/visual/a11y-sweep.spec.ts` (walk = Tab/Shift-Tab + rings both themes;
scan = names + ≥44 geometry, light), **RM** = `tests/visual/reduced-motion.spec.ts`
(story × theme legs), **axe** = generated `tests/visual/visual.spec.ts` per-theme
legs. All file:line pointers were opened during the sweep; bodies verified.

## tk-button

| Check | Evidence |
|---|---|
| 1 Keyboard | Tab/Shift+Tab: sweep walk `sweep I/walk: tk-button` (playground, both themes). Space/Enter LIVE: sweep leg «REAL Space and Enter keydowns activate the native button» (2 clicks for Enter+Space); walkthrough Enter legs `.playwright-cli/verify/form/walkthrough.mjs:275` (empty-required submit) and `:367` (valid submit → loading + toast). Construction: `button.test.ts:64` (native `<button>` — platform activation). |
| 2 Ring | `button.css.ts:90-92` (2px token ring, offset 2px); asserted computed at the real Tab stop by the sweep walk, both themes (token color #1771E6 light / #66A3FF dark). |
| 3 Roles/names/states | Native button role by construction (`button.test.ts:64`); aria-disabled `:152`, aria-busy `:138` (omitted when false — no attribute noise); accessible name = slot label, pinned by the sweep scan (slot-text resolution) and axe (both themes, every story). |
| 4 Contrast | ink-300 on yellow-100 primary `contrast.test.ts` (9.405); white on ink-300 inverse (12.635); focus-ring non-text 3:1 vs surface-base/muted/field (three rows); dark invariant yellow pair (9.405). |
| 5 Geometry | hero 56 / card 48 / compact 44 CLICKABLE box with the 32px visual pill — real-pixel `tests/visual/button.spec.ts:50-79`; sweep scan ≥44 both dimensions. |
| 6 Reduced motion | Spinner belt `button.css.ts:239-245` (animation: none — static two-tone ring); RM legs on every button story × theme incl. `components-button--states` (loading figures) — getAnimations() empty, computed sweep clean. |

## tk-link

| Check | Evidence |
|---|---|
| 1 Keyboard | Tab/Shift+Tab: sweep walk `sweep I/walk: tk-link` (variants story — 5 distinct stops, reverse walk revisits). Enter: native anchor construction `link.test.ts:52`; disabled inertness (no navigation) `:134`. |
| 2 Ring | §9 exception (CONVENTIONS.md exception log, 2026-09-23 tk-link rows) — verified LIVE by the sweep walk: `text-decoration: underline` with OPAQUE currentColor while `:focus-visible` in both themes; the rest-underline is transparent (`link.css.ts:47-63`). |
| 3 Roles/names/states | Slot label names the anchor (`link.test.ts:52`); aria-disabled `:123`; variants clamp `:70`; axe both themes; sweep scan names (incl. the footer-composed legal instances). |
| 4 Contrast | link (blue-100) on surface-base 4.624; dark link 6.836; legal = text-secondary on surface-base 5.635 / dark 8.47–9.07 rows; sweep additions: link-on-tint on all four tints light + dark (4.724–6.137). |
| 5 Geometry | Standalone 44×44 floor: structural `link.test.ts:201` + sweep scan real-pixel (inline-flex box ≥44). Inline/legal variants: text-target RULING (§9 kit-wide row) — the scan's only exemption class. |
| 6 Reduced motion | Underline fade rides the 150ms token (`link.css.ts:47-49`) — collapses to 0s under reduce; RM legs assert the transition-duration collapse live on every link story × theme. |

## tk-badge

| Check | Evidence |
|---|---|
| 1 Keyboard | N/A by construction — `badge.test.ts:41` «renders a plain SPAN — never interactive: no tabindex, no role, no focus stop»; the sweep walk asserts ZERO kit Tab stops on the variants story (both themes). |
| 2 Ring | N/A — no focusable surface (same construction proof as check 1). |
| 3 Roles/names/states | Plain span, no role noise (`badge.test.ts:41`); count cap «99+» `:94`, zero renders «0» `:82`; label/slot precedence `:131-:153`; axe both themes (badge text read as content). |
| 4 Contrast | Sweep additions: incentive = text-on-primary (ink-300) on green-100 4.742; stat = white on ink-300 12.635. Neutral variant = text-primary on surface-base 12.635 row. |
| 5 Geometry | N/A — never interactive (`badge.test.ts:41`); sweep scan confirms 0 kit interactive surfaces. |
| 6 Reduced motion | Static display-only; RM legs on every badge story × theme. |

## tk-progress-bar

| Check | Evidence |
|---|---|
| 1 Keyboard | N/A by construction — no focus stop, no channel events: `progress-bar.test.ts:419` («is stateless: a value change dispatches NOTHING») + `:428` (no formAssociated/name — display only); sweep walk asserts 0 kit Tab stops (both themes). |
| 2 Ring | N/A — no focusable surface (check 1 proofs). |
| 3 Roles/names/states | aria-valuenow/min/max wiring `progress-bar.test.ts:85`; custom min/max `:96`; degenerate ranges never reach AT `:124,:133`; narration opt-in announce `:208` (polite, once per settled change `:231`); bare bar carries no name by design `:412`; axe both themes. |
| 4 Contrast | RULING (R2): the yellow fill vs track 1.343:1 is a REDUNDANT state indicator — the value is carried by aria-valuenow + optional % text (text-primary pairs) — the DESIGN.md AA-table redundancy rule, anchored in `contrast.test.ts` rationale anchors; header label pairs = text-primary/text-secondary rows. |
| 5 Geometry | N/A — display-only (check 1 proofs). |
| 6 Reduced motion | THE spec-named nuance: indeterminate sweep STATIC under reduce — structural belt `progress-bar.test.ts:180` (animation: none in the media query) + RM legs LIVE on `components-progressbar--indeterminate` × both themes (getAnimations empty — an infinite animator would fail the guard). |

## tk-modal

| Check | Evidence |
|---|---|
| 1 Keyboard | Tab trap wrap both edges `modal.test.ts:205` (opened, body verified); zero-focusable panel focus `:224`; Esc release + focus restore `:240` (body verified: mount/lock released, opener focused); scrim click `:275`; destructive Esc ≠ action `:295`; nesting LIFO `:337`; sweep walk on the open story (trap containment + Shift+Tab cycle). |
| 2 Ring | Panel `outline: none` = the documented native-dialog dedup (`modal.css.ts:128-132`, panel is not a tab stop — tabindex −1 programmatic focus only). The ACTION surfaces are composed tk-buttons carrying the unified ring — asserted computed at both trap stops by the sweep walk, both themes. |
| 3 Roles/names/states | role=dialog + aria-modal + labelledby LIVE `tests/visual/modal.spec.ts:88-90`; heading fallback name `modal.test.ts:397`; live re-naming `:405`; axe both themes (open story audited at paint). |
| 4 Contrast | Panel text-primary on surface-base LIGHT: sweep addition 12.635; DARK: existing dark text-primary row 17.404; scrim ruled decorative (R2 — scrim-vs-panel is not an information pair; the panel's border separates). |
| 5 Geometry | Actions = consumer tk-buttons (compact 44 — the button geometry precedent); sweep scan on the open story: both action surfaces ≥44, named. |
| 6 Reduced motion | Belt `modal.css.ts:198` (exit instant under reduce — `modal.test.ts:326` immediate release); RM legs every modal story × theme. |

## tk-tooltip

| Check | Evidence |
|---|---|
| 1 Keyboard | Esc closes + cancels pending timer `tooltip.test.ts:266` (body verified); focusin opens after the delay `:204` (hover never the only path); pill NEVER focusable: `:380` (focusables impossible by construction) + LIVE `tests/visual/tooltip.spec.ts:87` (tabindex false); trigger Tab stop = composed tk-button — sweep walk (F3 fix). |
| 2 Ring | The kit owns no focusable surface (check 1); the trigger ring belongs to the consumer element — the canonical composition (tk-button) is pinned by the sweep walk at the real Tab stop, both themes. |
| 3 Roles/names/states | role=tooltip + aria-describedby wiring LIVE `tooltip.spec.ts:86-88`; icon-only trigger without a name dev-warns `tooltip.test.ts:396`; multi-slot warn `:424`; rewire restores describedby `:436`; axe both themes. |
| 4 Contrast | Sweep addition: tooltip pill text (white) on ink-300 = 12.635 (theme-invariant fill by design — `tooltip.css.ts` header). |
| 5 Geometry | Pill non-interactive (check 1); trigger = consumer content — the story's composed tk-button compact carries the 44 floor (sweep scan: named, ≥44). |
| 6 Reduced motion | The fade rides the fast token and is opacity-only — collapses to 0ms, NO belt needed (documented ruling `tooltip.css.ts:32-36`); verified LIVE by the RM legs (`tk-tooltip-in 0s` is motionless — the guard's exact semantics). |

## tk-toast

| Check | Evidence |
|---|---|
| 1 Keyboard | Esc dismisses the NEWEST, focus never moves `toast.test.ts:258` (body verified); never takes focus — no tabindex, no focus() in source `:314`; action click native `:280`; focusin/focusout pause-resume parity `:186`; sweep walk on the stack story (action button is the single kit Tab stop). |
| 2 Ring | F1 FIXED THIS SWEEP: the action button's unified ring never painted — `::slotted(button):focus-visible` is silently DROPPED at parse (CSS Scoping; probed via CSSOM); now `::slotted(button:focus-visible)` (`toast.css.ts:115`) — pinned computed by the sweep walk, both themes. |
| 3 Roles/names/states | aria-live polite default / role=alert destructive `toast.test.ts:233,:243`; LIVE stack roles `tests/visual/toast.spec.ts:65` (['polite','polite','alert']); walkthrough announcement legs `.playwright-cli/verify/form/walkthrough.mjs:397-402` («Заявка отправлена», polite, no focus theft); axe. |
| 4 Contrast | Toast body text-primary on surface-base LIGHT: sweep addition 12.635; DARK: existing dark rows; action link = link token pairs (4.624 / 6.836); icons decorative (aria-hidden glyph `toast.test.ts:233`). |
| 5 Geometry | Action button min-height 44 via `::slotted(button)` (`toast.css.ts:97-101`); stack geometry LIVE `toast.spec.ts:63-72`; sweep scan (top-layer host reached — document-wide scan). |
| 6 Reduced motion | Belt `toast.css.ts:137` (dismiss immediate — `toast.test.ts:163`); RM legs every toast story × theme (entrance keyframes killed). |

**Group I total: 42/42 cells evidenced.** SR protocol rows added to all seven
components' «Доступность» stories (RU; execution deferred — METHOD.md §SR).
