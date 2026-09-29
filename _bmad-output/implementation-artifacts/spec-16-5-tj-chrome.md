---
title: 'Story 16.5 — ТЖ chrome: tj-header + tj-rail + burger drawer (AD-12 helper, --tj-z-* opens)'
type: 'feature'
created: '2026-09-29'
status: 'executed'
baseline_commit: 'e7f202d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 16.5 — the largest 16.x; split trigger recorded if the helper exceeds ~1 screen of diff)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (Header bar / Sidebar rail / CTA «Написать» / State Patterns·Theme / Interaction Primitives — verbatim contracts)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (species rows; shadows.overlay single; motion scale incl. duration-fast 150ms; the 16.5 z-scale comment note = orchestrator pre-work)'
  - '{project-root}/.playwright-cli/captures-v3/tj/probe-notes.md (site map: nav Для вас/Учебник/Сообщество, actions Поиск/Уведомления/Переключить тему оформления/Авторизоваться, «Написать» → /blank-form/; CTA #333 r5 h30 15/400/20, dark INVERTS #F5F5F9/#000 w98; sidebar w290 h899 ×16 rubrics)'
  - '{project-root}/.playwright-cli/verify/tj-tokens/NOTES.md (the ONLY measured shadow = overlay 0 2px 8px rgba(0,0,0,.1); cards FLAT — 95-card census)'
  - '{project-root}/packages/components/src/navbar/ + src/overlays/ (the TRANSLATE-ONLY molds — bank code is NEVER imported, FR-17)'
  - '{project-root}/packages/tj-components/CONVENTIONS.md (§4 rows; the [OPEN — 16.5] drawer ruling + the z ruling resolved here)'
  - '{project-root}/packages/tj-react/src/event-map.ts + tests/tj-event-map-completeness.test.ts (registry grows ×2; the net auto-follows)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 story 16.5) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ kit has surfaces (reading, feed, community) but no chrome: every ТЖ page needs the sticky header (wordmark, nav chips, theme control, «Написать») and the w290 rubric rail — and the rail's burger drawer is the family's FIRST overlay-class surface, which opens the `--tj-z-*` axis (CONVENTIONS 16.1 ruling: "The 16.5 burger drawer is the opener: it mints `--tj-z-*` tokens") and the ТЖ-owned AD-12 helper (the documented FR-17 duplication).

**Approach — two chrome components + the helper + the z mint:**

1. **`tj-header`** — the sticky chrome bar:
   - **Slots:** `wordmark` (the logo block; ONE accessible name from the slot's text content — the «МЕДИА Т-БАНКА» sticker is decorative consumer art riding inside the slot, aria-hidden is the CONSUMER's choice in art, the kit wraps the slot neutrally), `actions` (icon buttons — Поиск/Уведомления/Авторизоваться are CONSUMER interiors per the epics critic ruling; the kit ships spacing + ::slotted geometry hooks only, NO icon art).
   - **Nav chips:** `items: Array<{ label: string; href: string }>` (attribute:false — the bank navbar mold), `active-value` string **prop-only** (§9 exception row 3 translated: no event, consumer sets it). Species = **cta-label 15/400/20 ink-100; current = weight 700 + `aria-current="page"`** (weight-only marking AUTHORED — yellow is FR-21-forbidden in editorial chrome and underline is unprobed; the bank underline+700 redundancy translates to 700 alone; FLAG for the maintainer's side-by-side).
   - **«Написать» CTA:** `cta-href` string + `cta-label` (default «Написать») → a real anchor; **empty/unset href → inert** (attribute omitted, no tab stop — the news-card mold). Styling = the tj CTA token pair (`--tj-color-cta-fill`/`--tj-color-cta-ink` — the probe's #333 r5 h30 15/400/20; dark re-resolves to the inverted pill via tokens, ZERO branches), **44×44 clickable floor via invisible padding** (the compact-button correction precedent), visual h30 r5. The header renders its OWN anchor css — no `<tj-cta>` composition (the family's no-cross-compose norm, 16.1–16.4).
   - **Theme control (the State-Patterns contract):** a built-in `<button type="button">`, accessible name «Переключить тему оформления» (the reference's own computed label, probe-notes), decorative fallback glyph (a neutral contrast-circle SVG, aria-hidden — the 16.4 bubble/chip-chevron chrome-art mold) overridable by a `theme-icon` slot. Click **CYCLES auto→light→dark→auto STATELESSLY**: on every click the control READS `document.documentElement.getAttribute('data-tj-theme')` (null/'light'/'dark') and writes the next mode — auto = **REMOVE the attribute** (the 15.2 sheet's auto leg is `:not([data-tj-theme="light"])` + prefers-color-scheme; no-flash holds because the selector is render-blocking CSS, never a JS post-patch). NO matchMedia listener (auto re-resolution is pure CSS — nothing for JS to do). Dispatches **`theme-change`** (`TjThemeChangeEvent`, detail `'auto'|'light'|'dark'`, composed+bubbles) and announces the resulting mode via an internal `aria-live="polite"` region (RU copy: «Тема оформления: системная» / «…светлая» / «…тёмная»).
   - **Sticky + compress:** `position: sticky; top: 0; z-index: var(--tj-z-nav)`; height **72px → 56px on scroll** (structural FLAGs — capture-sourced via EXPERIENCE), transition via `--tj-motion-duration-fast` (150ms) + `--tj-motion-curve-standard`, `prefers-reduced-motion` → no transition (instant); internal passive scroll observer (>0 scrollY) sets a host `data-scrolled` attribute — internal state, NOT public API. Background `--tj-color-page` + 1px `--tj-color-divider` bottom hairline (AUTHORED FLAG — unprobed; the side-by-side confirms or re-rules). NO hide-on-scroll (unprobed → no invention).

2. **`tj-rail`** — the w290 rubric nav:
   - `items: Array<{ label: string; href: string; value?: string }>` (attribute:false) + `current-value` string → the matching item's anchor carries `aria-current="page"` (the EXPERIENCE contract verbatim). Renders **`nav` landmark > `ul > li > a`** (the bank nav-list semantics translated).
   - **Icon tiles:** per-item named slot **`icon-{value}`** inside a 40px tile wrapper (structural FLAG; radius `--tj-radius-icon-tile` — the 15.2 probe r7), wrapper `aria-hidden` (tiles are decorative — identification rides the label; the 16.4 avatar mold). No `value` on an item, or nothing slotted for it → **no tile, label-only row** (the graceful-empty law; no phantom boxes).
   - Species: labels **cta-label 15/400 ink-100; current = 700** (authored, same ruling as header chips). Width `--tj-space-rail-sidebar` (290px, minted at 15.2).
   - **Responsive + burger:** `@media (max-width: 1199px)` — the list hides, a **burger button** shows (44×44 box, h40 visual chip; `burger-label` property, default «Разделы»; `aria-expanded` + `aria-controls` → the drawer sheet); ≥1200px inverse. **Breakpoint <1200px AUTHORED FLAG** (unprobed — cross-origin wall; rail 290 + column 770 + gutters ≈ 1100 minimum; the round generous pick; maintainer ratification candidate). The burger lives IN the rail (the bank navbar one-component mold translated): the CONSUMER's layout owns where the rail sits per breakpoint — the pattern story demonstrates both compositions; the kit never teleports shadow DOM across components.
   - **Burger drawer (the family's first overlay):** activating the burger opens a mounted **full-height sheet** (w290 — the rail's own width; mobile clamp `min(290px, 86vw)` AUTHORED FLAG) listing THE SAME items (the drawer re-renders `items` — one source, no consumer duplication) + a scrim. **`open` boolean REFLECTED property + `open-change` event** (`TjOpenChangeEvent`, detail `boolean` — the select/modal §4 channel mold; programmatic open VALID at any viewport — the 2.3 harness lesson: open overlay states are driven via the element API and captured with page-level clips). Esc closes; focus trapped + restored; body scroll locked. Drawer surface = `--tj-color-card` + `--tj-radius-card`… no — the sheet is a full-height panel: radius on the inner vertical edge only, `--tj-radius-panel` structural pick FLAGGED; shadow `--tj-shadow-overlay` (the ONLY measured ТЖ shadow — the suggest-panel value, 15.2); scrim = ink at 12% alpha FLAG (the skeleton alpha precedent); z `var(--tj-z-drawer)`.

3. **The ТЖ overlay helper (AD-12 v5 ruling — CONVENTIONS row verbatim):** `packages/tj-components/src/overlays/` NEW — a deliberate, documented **duplication** of the bank controller's contract (importing `pillkit-components` breaks FR-17; the REVISIT trigger — a second ТЖ overlay surface → extract a shared `pillkit-overlays` peer — stays). **Minimal honest surface:** `mountSheet` (append sheet+scrim to document.body; Popover API top-layer when available, plain `position: fixed` fallback at `var(--tj-z-drawer)`), `lockScroll` (refcounted, scrollbar-gutter/padding compensation), `trapFocus` (**SHADOW-AWARE composed traversal** — the 2.2 critical catch; LIFO nesting; restore on release). **NO floating positioning engine** (the sheet is full-height — no anchor math), **NO toast queue, NO enqueue** — every omission carries a comment naming the bank pointer. Behavioral lessons translated VERBATIM: **post-await revalidation** (the 3.4 async-open race guard) and **popover-UA inset/margin resets** (the 3.10/4.x find). Pure functions + typed exports from the package index; NO component exports.

4. **`--tj-z-*` mint:** `packages/tj-tokens/scripts/generate.mjs` — `zScale: []` becomes the authored ТЖ scale: `--tj-z-nav: 100` (sticky site chrome), `--tj-z-drawer: 300` (burger sheet + scrim; **200 stays spare** — the bank one-spare-slot-between-layers grammar). AUTHORED not probed (the cross-origin wall; the bank AD-12 scale is the reference precedent — the CLI's own 15.2 comment says exactly this). Regen via `pnpm gen:tokens:tj` (byte-stable elsewhere); `check:tokens-drift:tj` green; consumed-tokens guard covers the new pins; the generator's stale "no z-scale" prose comments (header/footer literals in the CLI) update to the new truth. The DESIGN.md z-scale comment note = orchestrator pre-work (already landed with this spec commit).

5. **Event-map growth (entries 2 and 3):** `'tj-header': { onThemeChange: 'theme-change' }`, `'tj-rail': { onOpenChange: 'open-change' }` — both match the frozen `-change$` grammar; `TjThemeChangeEvent`/`TjOpenChangeEvent` classes with `static readonly eventName` (the completeness net's class-mold idiom — the net auto-demands both). React smokes ×2 (react-dom mold): the theme cycle end-to-end (click → `onThemeChange` receipt + `document.documentElement.getAttribute('data-tj-theme')` assertion + removal assertion on the auto step) and the `open` round-trip. CONVENTIONS §4 rows freeze: the theme channel (data-tj-theme on the document root, cycle semantics, no-flash contract, announcement copy) and the open channel (the select/modal mold on the ТЖ drawer); the `[OPEN — 16.5 burger drawer]` marker resolves.

6. **Chrome composition PATTERN story** (a story, NOT API): header + rail + rubric-header + news-card column at 1280 — side-by-side targets `tj-home-{viewport,fullpage}-2026-09-28.png` (light + the native-dark capture); plus the drawer story (programmatic open; page-level clip so the top layer is IN the capture — the 2.3 lesson) and a theme-contract story (auto/light/dark demo — the docs already prove the `[data-tj-theme]` selector pattern).

## Boundaries & Constraints

**Always:**
- The 16.1 component mold: one directory per component, five files, styles consume ONLY `var(--tj-*)`, every structural value flagged in a css.ts comment (known flags: h72/h56, nav-chip weight-only current, 40px tile, <1200 breakpoint, drawer w290/86vw, scrim 12%, sheet edge radius).
- A11y floor: header = one sticky bar, natural tab order (wordmark → chips → actions slot → theme → CTA), rings per the shipped tj mold (2px focus-ring, RESTRICTED to card/chip surfaces — the header rides `--tj-color-page`, rings resolve per the AA-surface law); rail = list semantics + `aria-current`; drawer = focus trap + Esc + restore + scroll lock; theme announcements polite; FR-22 sections in every story (keyboard checklist, SR protocol notes, reduced-motion rows).
- Wrappers: `pnpm gen` (manifest + wrappers ×2 new + event-map +2); index re-exports; consumed-tokens guard covers new pins; `tests/tj-gen-drift.test.ts` + `check:gen` green.
- Gates: `pnpm install` (if deps move) → `pnpm test` → `pnpm lint` → `pnpm typecheck` → `pnpm build`, chained with `&&` between the pnpm commands under `set -o pipefail` when piped (the PIPEFAIL GATE LAW). NO local `test:visual` in ANY mode (orchestrator mints provisional baselines post-review — port 6007 single-owner).

**Never:**
- No `_bmad-output/` / `.playwright-cli/` edits by the executor (CONVENTIONS.md in `packages/tj-components/` IS editable — package code; the DESIGN.md z note is ALREADY landed by the orchestrator).
- No bank-package imports ANYWHERE in `packages/tj-*` (FR-17) — the helper is TRANSLATED from `packages/components/src/overlays/`, the navbar mold TRANSLATED from `packages/components/src/navbar/`; the eslint boundary + trip-probes stay armed.
- No token VALUE edits, no renames — the ONLY token change is the sanctioned `zScale` addition (nav 100 / drawer 300).
- No yellow/navy values (FR-21); no `--tk-*` reads; no hover art beyond tokens (unprobed states stay unstyled-plus-native); no hide-on-scroll; no matchMedia in the theme control; no per-mode theme icons (ONE glyph + slot); no positioning engine/toast queue in the helper (the minimal surface above); no z literals in css (`var(--tj-z-*)` only — the CONVENTIONS law).
- No npm/publish/version changes; no CI workflow edits; no new deps.

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Theme cycle | click ×3 from auto | attr absent→'light'→'dark'→absent on `documentElement`; `theme-change` details light/dark/auto in order; polite announcements match each step | consumer pre-set attr out-of-band → next click reads it fresh (stateless — no desync) |
| Theme dark pre-set | `data-tj-theme="dark"` on root before load | sheet resolves dark pre-paint (no flash); control still cycles correctly from dark | — |
| Header scrolled | scrollY > 0 / back to 0 | host `data-scrolled` set/removed; height 56/72 via transition; reduced-motion instant | passive listener; no rAF thrash (class toggle only on threshold cross) |
| Header CTA inert | `cta-href` empty/unset | anchor renders without href — no tab stop, visually present | `cta-label` still consumer-swappable |
| Nav current | `active-value="community"` | that chip 700 + `aria-current="page"`; others 400 | unknown value → nothing marked (no crash) |
| Rail current | `current-value="news"` | that anchor `aria-current="page"` + 700 | unknown value → nothing marked |
| Rail iconless | item without `value`, or no slotted icon | label-only row, no phantom tile | — |
| Drawer open (burger) | click burger (<1200 viewport) | `open` true (reflected) + `open-change` true; sheet mounted via helper; focus trapped; scroll locked; burger `aria-expanded` | focus restores to burger on close |
| Drawer close | Esc / scrim click / `open` property false | `open-change` false; sheet unmounts; lock/trap released (refcount correct) | rapid open→close→open (the post-await revalidation mold — no zombie sheets) |
| Drawer programmatic | `el.open = true` at ANY viewport | sheet opens (deterministic harness states) | — |
| Wrapper events | React `onThemeChange` / `onOpenChange` | receive the typed events (smokes) | completeness net RED on registry drift |
| z guard | css consuming an undeclared `--tj-z-*` | consumed-tokens guard RED | — |
| FR-17 trip | any tj file importing bank packages | eslint boundary + guards RED | mechanized at 15.1 |

## Code Map

- `packages/tj-components/src/tj-header/{index.ts,tj-header.ts,tj-header.css.ts,tj-header.test.ts,tj-header.stories.ts}` — NEW
- `packages/tj-components/src/tj-rail/{index.ts,tj-rail.ts,tj-rail.css.ts,tj-rail.test.ts,tj-rail.stories.ts}` — NEW (includes the drawer + burger)
- `packages/tj-components/src/overlays/` — NEW (the AD-12 ТЖ helper: mount/lock/trap minimal surface + tests; exact file split is the executor's within this surface)
- `packages/tj-tokens/scripts/generate.mjs` — `zScale` mint (nav 100 / drawer 300) + stale prose literals updated
- `packages/tj-components/src/{index.ts,custom-elements.json}` + `packages/tj-react/src/{event-map.ts,generated/}` — via `pnpm gen`
- `packages/tj-components/CONVENTIONS.md` — `[OPEN — 16.5]` resolved: helper surface + z ruling + §4 rows (theme channel, open channel)
- `packages/tj-components/README.md` — component list +2
- `tests/tj-event-map-completeness.test.ts` — grows mechanically (registry-driven)
- `tests/consumed-tokens.test.ts` — roster grows (z + any new pins)

## Tasks & Acceptance

**Execution:**
- [x] tj-header (slots + items/active-value + cta-href/label + theme control cycle/announcement + sticky 72→56)
- [x] tj-rail (items/current-value + icon tiles + aria-current + burger + drawer channel)
- [x] ТЖ overlay helper (mountSheet + lockScroll + trapFocus — translated, commented omissions, post-await + UA resets)
- [x] `--tj-z-*` mint + regen + drift check + guard roster
- [x] Event-map ×2 + React smokes ×2 + CONVENTIONS `[OPEN — 16.5]` resolved + README +2
- [x] Stories RU (playground/anatomy/accessibility per component + chrome pattern + drawer + theme contract) with FR-22 sections
- [x] Full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

**Acceptance Criteria:**
- Given the theme control at auto, when clicked three times, then `data-tj-theme` on `document.documentElement` goes absent→'light'→'dark'→absent, each step dispatches `theme-change` with the matching detail, the polite region announces the mode, and the React wrapper's `onThemeChange` receives all three (smoke-verified).
- Given the drawer open, when Esc is pressed, then focus returns to the burger, the sheet unmounts, the scroll lock refcount drains, and rapid re-open mounts exactly one sheet (revalidation pin).
- Given `current-value`/`active-value`, when the components render, then exactly the matching entries carry `aria-current="page"` and the 700 weight.
- Given `pnpm gen` + `check:gen` + `check:tokens-drift:tj`, when the z mint and two components land, then all three pass clean for TEN ТЖ components and the z tokens are declared + consumed consistently (guards green).
- Given `data-tj-theme` pre-set before load, when the sheet resolves, then dark applies pre-paint (the selector contract — no JS on the token path) and the control's next click cycles from the preset state.

## Design Notes

- **The stateless cycle is the load-bearing theme ruling:** no cached mode, no MutationObserver — the control reads the attribute ON CLICK, so consumer out-of-band changes (SSR, other controls, devtools) can never desync it. The kit's whole theme contract is: attribute = render-blocking CSS (no-flash by construction), JS only writes the attribute and announces.
- **Weight-only current marking (header chips + rail items):** the bank underline+700 redundancy translates minus the underline — yellow is ad-language (FR-21) and underline is unprobed on the ТЖ reference. Flagged for the maintainer's side-by-side; a one-line css swap if the capture rules otherwise.
- **The one-spare-slot z grammar** keeps the ТЖ scale growth-compatible (200 free for a future dropdown step) at the roster's honest size — two tokens, not the bank's six; mint-grow only when a surface demands it (the CONVENTIONS law).
- **Helper minimalism is fidelity, not laziness:** the bank controller's positioning engine exists for anchored floats; the ТЖ roster's only overlay is a full-height sheet. Duplicating the engine would duplicate dead code — the omission comments name the bank pointer for the future REVISIT.
- **h72/h56, page-bg + hairline, <1200 breakpoint, drawer w290/86vw, scrim 12%** — all AUTHORED/capture-sourced structural picks, each FLAGGED in css.ts; the maintainer's side-by-side (home captures, light + native dark) confirms or re-rules each.
- **Split trigger (epics review):** if the helper exceeds ~1 screen of diff, split it to its own story — recorded here per the epics ruling.

## Verification

**Commands:**
- `pnpm gen:tokens:tj && git status --porcelain` (z tokens land; only expected changes)
- `pnpm gen && git status --porcelain` (manifest + wrappers ×10; only expected changes)
- `pnpm check:tokens-drift:tj && pnpm check:gen` (clean tree passes both)
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build` — `&&` between pnpm commands, `set -o pipefail` when piped (the PIPEFAIL GATE LAW, both clauses)
- Visual/baseline work is ORCHESTRATOR-owned post-review: `pnpm test:visual:update` mints the provisional ТЖ baselines (existing byte-stable; scoped runs OMIT the `--` — the 16.4 pnpm passthrough lesson); CI compare owns the verdict.
</frozen-after-approval>

## Implementation Notes

**Executor round** (subagent `tj-chrome-165`, single pass, all 7 tasks): both components + the overlays helper + the z mint + event-map ×2 landed per the code map. Executor deviations ratified in triage: chips/rows species = nav-label **17/700** (the probe9 census ×11/11 — stronger than the spec's authored cta-label 15/400); the sheet is a shadow-tree child of `tj-rail` (the 2.3 ratified pattern — the burger's aria-controls resolves in one tree); `burger-label` empty-fallback at the prop; the helper translated with post-await revalidation + popover-UA resets as demanded.

**Triage (orchestrator):** (a) MAJOR — the drawer lifecycle guarded BOTH dispatch and mount on the first-update change entry; Lit stamps EVERY first-update change with old value `undefined` (reactive-element `_$changeProperty`: `if (!this.hasUpdated && !useDefault) oldValue = undefined` — stamped attributes included), so a STAMPED `open` attribute never mounted its sheet (reflected `open` + `aria-expanded` with no scrim/lock/trap/z). Fix: dispatch-only guard (the bank select.ts:289-307 mold) + UNCONDITIONAL mount + guarded unmount (initialization-to-closed must not focus-steal the burger); reconnect-while-open explicitly skipped (exotic, bank-uncovered, unspecced). (b) the current-marking ruling — resolved in the fidelity round below.

**Lens verdict:** PATCH-NEEDED (2 MAJOR / 3 MINOR / 3 NIT), all folded into one consolidated patch round: (a) as above; (b) `burgerLabel` null write — Lit maps attribute REMOVAL to a null property write on String-typed props → `.trim()` throws; `string | null` + fallback; (c) the CEM analyzer infers events from `dispatchEvent` sites in class METHODS and cannot name CustomEvent subclasses there → a NAMELESS manifest entry rode next to the @fires row; fix: the dispatch moved to a `#emitOpenChange` field initializer (the `#handleThemeActivate` shape) — the manifest carries exactly one named `open-change` after regen; (d) the vacuous SSR test replaced with stubbed globals (`vi.stubGlobal('document', undefined)`) — rewriting it FOUND A REAL BUG: `document.createElement?.('div')` throws ReferenceError when `document` is undefined (`?.` guards the CALL, not the base access); fixed with a `typeof document === 'undefined'` ternary; (e) theme-story attribute leak — story-local `tjhh-theme-reset` element restoring `data-tj-theme` on disconnect; (f) missing Anatomy stories (task demanded playground/anatomy/accessibility per component) — delivered ×2.

**Fidelity patch round (reference-first — 2026-09-28 captures + probe9):** current marking re-ruled **SEMANTIC-ONLY** — the reference renders every row/chip in ONE species (probe9 ×11/11 uniform 17/700; the capture shows NO weight/pill/color delta on any row) — the spec's authored 700-delta marking and its `[aria-current]` css rules DELETED (deviation from spec §nav-chips/§species, evidence-named; `aria-current="page"` alone remains). Header chips = **WHITE CARD PILLS** (`--tj-color-card` on the page-gray bar, `--tj-radius-chip`, nav-label species) — the capture's per-chip icons ruled CONSUMER art (the actions-slot norm); the authored 1px bar hairline REMOVED (the bar blends into the page); the CTA re-ruled a **fully-rounded 36px pill** (`--tj-radius-full`, `inset-block: 4px` — the capture pill, NOT the article CTA's r5 h30). The sheet gained `height: auto; border: none` popover-UA re-assertions. Unit tests re-pinned to all of the above (incl. `not.toContain(".chip[aria-current='page']")`); stories prose + README updated («чипы-пилюли»).

**Side-by-side vision (light + dark — minted renders vs `tj-home-{viewport,dark-viewport}-2026-09-28.png`): PASS.** Light: pill chips, no divider, uniform chips, fully-rounded dark CTA, theme control, rail directly on gray. Dark: dark canvas, blending bar, card pills, inverted CTA. Two vision claims DISMISSED with evidence: (1) «rail rows mixed weight» — structurally impossible (the `.row` base carries the species; NO differentiating selector exists in the sheet) and disproven pixel-level (a 3× zoom pass reads ALL labels as the same stroke, «о»/«а» matching across tile/non-tile rows; the two full-page passes even disagreed on WHICH rows were «bold» — 17px antialiasing next to busy tiles misleads at page scale); (2) «dark hero light-leak» — the story's synthetic placeholder art (slotted consumer content), identical by design in light.

**Gates:** `set -o pipefail && pnpm lint && pnpm typecheck && pnpm test && pnpm build` — all green (tj-components **247/247** — +3: stamped-open mount, burger-label null write, sheet UA resets; tj-react 19/19). `pnpm gen` ×2; `check:tokens-drift:tj` / `check:gen` exit 1 pre-commit by design (vs-HEAD comparison on the uncommitted tree).

**Baselines (orchestrator-minted, port 6007):** `pnpm test:visual:update` → **1678 passed** (1624 → 1678), exit 0; **18 NEW PNGs** (header ×4 stories + rail ×5 stories, light+dark), 0 tracked modified — the chrome changes are confined to new stories. Maintainer batch-confirm package grows to 78 (16.1's 24 + 16.2/16.3's 22 + 16.4's 14 + 16.5's 18).

**CI:** verdict stamped in the close-out commit (docs(bmad)).
