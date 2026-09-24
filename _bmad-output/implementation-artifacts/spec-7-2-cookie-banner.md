---
title: 'Story 7.2 — CookieBanner: the consent dialog'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — Track B of the 6.4 window)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 7.2)'
  - '{project-root}/packages/components/CONVENTIONS.md (§3 occurrence events, §6, §8, §9 FROZEN)'
  - '{project-root}/.playwright-cli/captures-v2/invest-stocks/cookie-dialog-element.png (212×126 — the WHOLE card, live-captured 2026-09-24) + cookie-dialog-live.png + cookie-dialog-viewport.png (position attempt)'
  - '{project-root}/.playwright-cli/verify/cookie-banner/ref-x4.png (4× probe render) + runs.awk'
  - 'Live DOM snapshot 2026-09-24: dialog "Баннер согласия использования cookies" > text «Мы используем» + link «Согласие на обработку данных» (/privacy/, visible text «куки») + text ", чтобы делать сайт удобным для вас" + button «Принять использование файлов cookie» (visible «Хорошо»)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's on-load cookie-consent dialog (FR-13) has no kit counterpart —
consent flows on v2 domains need the sanctioned primitive.

**Approach:** Implement `tk-cookie-banner` — a compact NON-MODAL consent dialog on the 2.2
overlay controller's modal LAYER (top-layer z-class) but scrimless, scroll-lock-free and
trap-free: consent is a POSITIVE ACT — Esc and outside-click do NOT dismiss, the only close
path is the consumer's `open` prop after `consent-choice`. Storage is the CONSUMER's (the kit
never touches persistence).

## Boundaries & Constraints

**Always:**
- API: `open` (boolean attribute/property) + `open-change` (the §9 declarative surface
  contract VERBATIM — the modal mold; note: the banner has NO internal close path, so
  `open-change` fires only on consumer-driven state, never self-dismissed); `label`
  (accessible dialog name, default «Баннер согласия использования cookies»); `acceptLabel`
  (default «Хорошо»); the message = DEFAULT SLOT (the reference embeds an inline link
  mid-sentence — rich content is the consumer's composition; the kit styles
  `::slotted(a)` — link color via the §6 hook, default text-secondary with underline on
  hover only; reference link core #B8B8B8 ≈ muted family, recorded deviation vs the link
  token); `consent-choice` — the §3 BARE-VERB occurrence event (no payload; the load-more
  mold), emitted on accept click, registered in the event map.
- Behavior: «Хорошо» (the ONLY interactive path): emits `consent-choice`, focus stays on the
  button (the consumer closes by flipping `open`); **Esc = preventDefault + NO dismiss, NO
  open-change** (deliberate: consent is a positive act — documented in the a11y story);
  outside click/pointerdown = NO dismiss (same ruling; the dialog is non-blocking chrome,
  the page behind stays interactive — no scroll-lock, no scrim, no focus trap); on open,
  focus moves to the accept button (the natural next act); Tab moves NATURALLY through the
  card and back to the page (non-modal dialog; aria-modal ABSENT — role=dialog only).
- Anatomy (live-captured, 212×126 card, probe-verified on the 4× render): compact white
  surface-base card, width FIT-CONTENT (the reference card ≈212px at body-s text — do NOT
  pin a width; min-width literal ~180px flagged), card radius UNMEASURED in the element
  crop — take the floating-dialog register `radius-lg` as a flagged house judgment (the
  modal card language), shadow-default (the floating-card register), NO border; body text
  body-s 13px #656565-family → text-secondary token (recorded), two-line max in the
  reference; the accept button = pill stadium, fill #F2F4F7 → `surface-field` token
  (nearest, recorded), height ~24px VISUAL with the §8 44px EFFECTIVE hit floor (padded
  hit area — the navbar drawer-link pattern), label ink text-primary body-s/600; card
  padding 16px (flagged: crop-measured inset of text x≈13/4x≈53).
- Mount: the 2.2 overlay controller — modal LAYER (top-layer with fallback), positioned
  FIXED bottom-left of the viewport with a 16px gap (FLAGGED judgment: the element capture
  pins the CARD but not its on-page position — the live viewport re-attempt (7s settle)
  did not catch the mount; standard T-Bank placement bottom-left; the verify round
  re-attempts a longer-settle capture to true it); zero bespoke positioning/z (controller
  owns placement class), entrance = NONE (reference shows no motion; no transition —
  flag as deliberate no-motion).
- The v1 component gate VERBATIM (FR-16): impeccable zero blockers; axe both themes;
  stories = default playground (the reference copy: «Мы используем куки, чтобы делать
  сайт удобным для вас» with the slotted privacy link) + variants (long message wrap,
  custom acceptLabel, closed) + theming + a11y notes (the Esc/outside no-dismiss ruling,
  the non-modal contract, keyboard walkthrough) + SR-protocol section; React surface via
  `pnpm gen` + event-map entry (`consent-choice` bare verb); provisional baselines ×2 +
  side-by-side vs cookie-dialog-element.png archived to `.playwright-cli/verify/
  cookie-banner/` (the dir already holds ref-x4.png + runs.awk) + vision check
  (blocked-protocol honest); RU content, EN meta.

**Never:**
- No new tokens; no theme branches; no z-index literals; NO localStorage/cookie access in
  the kit (storage is the consumer's); no scrim; no scroll-lock; no focus trap; no
  internal close path (no X button); no §4 channel (not a form control); no §4/§9 text
  changes; no motion (deliberate none).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Open | open=true | card top-layer bottom-left, focus on «Хорошо», open-change(false→true) per §9 change-guard | — |
| Accept | click/Enter/Space on «Хорошо» | `consent-choice` emitted (once), focus STAYS on button, open UNCHANGED by the kit | — |
| Esc | keydown Esc while open | preventDefault, NO dismiss, NO open-change | — |
| Outside click | pointerdown outside | NO dismiss, page interactive | — |
| Keyboard flow | Tab from button | natural cycle card → page (non-modal, no trap) | — |
| Slotted link | focus/click | focusable, §6 hook color, hover underline; navigation native | — |
| Empty slot | no message projected | the card still renders (label + button); never blank (§2) | — |
| Long message | 3+ lines | card grows, width capped ~320px (flagged), wrap | — |
| Close | consumer sets open=false | card unmounts per §9, focus returns to previously-focused (controller restore) | — |
| Disconnect | removed while open | clean teardown, no leak (the navbar mold) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/modal/` -- the controller-mounted dialog mold (open/open-change,
  teardown, focus restore) — MINUS scrim/lock/trap (this surface's Never list)
- `packages/components/src/overlays/` -- mountOverlay modal layer, LAYER tokens
- `packages/components/src/pagination/` -- the §3 bare-verb occurrence mold (load-more)
- `.playwright-cli/captures-v2/invest-stocks/cookie-dialog-element.png` -- side-by-side source
- `tests/visual/` -- baselines; `packages/components/src/index.ts` + index.test.ts -- exports

## Tasks & Acceptance

- [ ] `packages/components/src/cookie-banner/{index.ts,cookie-banner.ts,cookie-banner.css.ts,cookie-banner.test.ts,cookie-banner.stories.ts}`
- [ ] event-map entry (`consent-choice`) + `pnpm gen` + wrapper smoke (bare-verb mapping)
- [ ] `.playwright-cli/verify/cookie-banner/` side-by-side + probes (+ the longer-settle
      live position re-attempt, honest either way) + vision (blocked-protocol)
- [ ] baselines via update flow + stability ×2; full gates green (VISUAL SERIALIZED — port
      6007 machine-global); spec closed; commit + push

**Acceptance Criteria:**
- Given the matrix rows (10), when the unit suite runs, then each row asserts.
- Given Esc and outside-click while open, then NOTHING dispatches and open is unchanged.
- Given axe × both themes on every story, then zero violations.
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
