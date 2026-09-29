# Story 16.6 — walkthrough + review verdicts (orchestrator log)

Date: 2026-09-29. Harness: `node tests/visual/serve.mjs 6013` (docs dist,
rebuilt after the final bone-census patch) + `walkthrough.mjs` (chromium,
1280×800 DSF1, reduced-motion reduce, pinned fonts — the tests/visual env).

## Driver verdict — 22/22 PASS (final run)

- **Step 0 tree**: article landmark `aria-busy=false`; opt-in scroll-back rail
  starts hidden (OFF by default — the improvement clause).
- **Step 1 tab topology**: exactly 18 stops in natural DOM order — wordmark →
  chips ×3 → theme toggle → CTA → rail ×5 → in-body `tj-link` → engage ×4 →
  demo ×2; the hidden backrail contributes NO stops. 2px token focus rings on
  both a nav chip and the like button (`rgb(138, 138, 229)`).
- **Step 2 like toggle**: Enter flips `aria-pressed=true`, label unchanged,
  demo count 128→129; Space flips back — both keys activate; state is
  story-local (emit-only contract holds; the kit stores nothing).
- **Step 3 theme cycle ×3**: absent→light→dark→absent; canvas re-themes every
  step (`#F0F0F0` ↔ `#12151C`); RU polite announcements match exactly
  («Тема оформления: светлая/тёмная/системная»); focus stays on the control.
- **Step 4 skeleton**: `aria-busy=true`, live flow hidden, bones shown; bone
  fill = `color(srgb 0.431373 0.431373 0.431373 / 0.12)` — ink-300 (110/255)
  at the 12% spec alpha; **article height 1310 → 1310, zero layout shift**;
  full tab walk in bones mode carries ZERO prose/engage stops (only the two
  demo toggles remain); toggle returns the live flow.
- **Step 5 scroll-back rail**: armed demo stays hidden at rest (120px floor,
  direction-based); scrolling UP shows it (visibility + transform in); shown
  rail adds exactly its 4 buttons (10 plain-button stops total: engage ×4 +
  demo ×2 + rail ×4); scrolling DOWN re-hides it (back outside tab order).
- **Step 6 Esc**: inert at 1280 with no drawer open — focus unchanged.
- **Step 7 native-dark auto leg**: attribute absent + OS dark → the whole
  article renders dark (`#12151C`) via the token sheet's media-scoped block;
  first click from native writes `light` (stateless read-on-click).
- **Step 8 axe**: zero violations, BOTH themes (WCAG 2.0/2.1 A+AA).
- **Step 9 kit renders**: `kit-article-light.png`, `kit-article-dark.png`,
  `kit-article-skeleton.png` (this directory).

## Walkthrough-round fixes (all ratified)

1. **REAL story defect — bone census drift 30px**: live flow measured
   4/4/3/**4** body-paragraph lines, the census authored 4/4/3/**3** — the
   last paragraph bone was `para-l3` (90px) against a 4-line live block
   (120px). Localized block-by-block by `probe-census.mjs`; fixed by flipping
   the last bone to `para-l4` + retuning the census comment. Post-fix swap:
   1310 vs 1310 (delta 0).
2. **Driver bug — unscoped role query**: «Разборы» legitimately exists as both
   the active header chip and the current rail row (the article's rubric is
   current in BOTH navigations) → scoped to the header nav («Навигация»).
3. **Driver bug — tab-walk start point**: Chromium's sequential focus
   navigation starting point sticks to the last clicked control, so walks
   after the demo-toggle clicks sampled only the DOM tail (and
   `document.body.focus()` is a no-op in Chromium — body is not natively
   focusable). Fixed by focusing the FIRST tab stop (wordmark) directly and
   recording the full forward order.
4. **Driver bug — engage-hidden probe**: a child inside a `display:none`
   subtree keeps its OWN computed display in Chromium (the engage div reports
   `flex`); the probe now targets the `.tjart-live` ancestor the skeleton
   actually hides.
5. **Driver bug — native-dark leg**: the docs boot runtime writes
   `data-tj-theme='light'` for deterministic story rendering; the native auto
   leg is only observable with the attribute absent, so the driver now removes
   it AFTER boot (same fact `openStory`'s removeAttribute encodes).
6. **Driver cosmetics**: boneColor assertion accepts Chromium's `color(srgb …)`
   serialization of `color-mix` (0.431373 = 110/255 = ink-300), not just
   `rgba(110, 110, 110, …)`.

## Side-by-side vision review — PASS (both themes)

- **Light vs reference** (`tj-article-viewport/fullpage-2026-09-28.png`): the
  composition carries the reference's structural truths — white reading card
  over the gray page, left rail with rounded icon tiles, header pill chips,
  quiet byline meta row, engagement BELOW the fold (the reference viewport
  confirms it is not visible), no scroll-back rail on the reference (the
  opt-in OFF default is correct), lead > body hierarchy, H2 band, display-size
  pull-quote, blue in-body link, flat native engagement row. The reference's
  notably light byline/time meta IS the sub-AA class the 15.2 token table
  documents as RESTRICTED — the authored AA step (ink-300 on card) is the
  sanctioned 16.2/16.3-mold deviation, now documented in the story chrome
  comment and anatomy row. The reference's ad surfaces (top promo carousel,
  floating yellow overlay card) are site-level ads outside the pattern scope —
  the Flow C in-flow recipe (760/290 registers) stands on the accent locator.
- **Dark (no article-dark reference exists)**: card #20232A over page #12151C,
  white headings, ink-300 dark body (#D0D0D2) readable, byline/engage/rail all
  legible, zero layout defects — theme treatment consistent with
  `tj-home-dark-viewport`. Both legs axe-clean (step 8).

## Maintainer-side remainders (unchanged)

Live VoiceOver/NVDA narration, iOS momentum-scroll feel, live ad-language
audit — human tasks per METHOD.md §SR; the automated chain above is the
complete machine-verifiable portion.
