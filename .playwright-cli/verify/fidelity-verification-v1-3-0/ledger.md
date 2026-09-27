# Fidelity ledger v1.3.0 — rows over the v1.2.0..HEAD moved set (Story 14.2, 2026-09-28)

**Standard (FR-16 / epics-v4 14.2, the 11.3 mold at v1.3.0 scope):** every
component whose pixels/API moved in `git diff v1.2.0..HEAD` gets a row with
(1) reference source capture, (2) verify/evidence pointer, (3) deviation
count, (4) open flags. The moved set was RE-MEASURED at the execution head
`80a3604` (the numstat >4-lines filter): **badge** (css.ts 35+5, stories
86+8, test 45+4, ts 11+7), **tabs** (css.ts 27+1, stories 63+2, test 37+0,
ts 24+0), **progress-bar** (css.ts 8+3, stories 61+1, test 11+0), the five
**showcase 2-line cross-link comments** (NOT surface moves), and the docs
side (component-search / getting-started / theming-guide texts + the two NEW
v2 pattern pages). The docs-side TEXT moves are NOT ledger rows — they are
not reference-grounded component surfaces (see the scope note below);
the two pattern pages ARE rows (they are the 13.x family's shipped
surfaces). packages/react + packages/tokens: **ZERO diff** (verified in the
numstat — the 13.x API additions flow through CEM attributes, the same
verdict as v1.2.0). Re-take register: `git log v1.2.0..HEAD --
'tests/visual/*snapshots*'` = 5 commits / **197 PNG-events** (forensic
one-liners in the baseline package, ЧАСТЬ v1.3.0). UNCHANGED components are
NOT re-rowed — the aggregate pointer to the prior ledgers carries them.

**Reference pack of this cycle:** `../../captures-v3/admin/` (8
PII-redacted PNGs + INDEX.md + probe-notes.md; the 13.1 maintainer-session
pack). Probe method is vision-model pixel analysis — geometry/colors are
ESTIMATES (±), the PNGs are ground truth; kit-side facts (AA ratios, CSS
values) are measured. Derived/composition surfaces keep honest
classifications — never dressed as pixel fidelity.

## v1.3.0-moved components

| # | Component (story) | Reference capture | Verify / evidence | Deviations | Open flags |
|---|---|---|---|---|---|
| 1 | **tk-badge — neutral/attention + hooks** (13.3) | `admin-table-toolbar` (gray status pill h28 «Ожидает подписи», gray count circles on inactive tabs), `admin-payments-hub` (red count pill on the in-progress bar), `admin-main-fullpage` (gray tab-count digits) | `../../captures-v3/admin/probe-notes.md` (Status/Counts lines); kit side: `badge.css.ts:87-110` (hooks family), `badge.test.ts:192/207`, story «Консольные тона» `badge.stories.ts:190`; AA gates in `tests/contrast.test.ts` | 1 RECORDED AA-mapping deviation: the pack's raw attention red `#E5372B` with white pair measures **4.3:1 — FAILS body-xs AA**; mapped onto the red scale `red-300`/white **6.179:1** (the frozen AA-pairing ruling, NO new token; recorded in badge.css.ts header + DESIGN.md Colors). neutral = `gray-100`/`gray-600` **≈5.17:1**. Pill height h28 is a vision estimate (±) — the kit keeps its own badge sizing scale | on-tab red badge (a red count inside a TAB) deferred — ungrounded extension (no capture isolates the announcement context); recorded in spec-13-3 out-of-scope |
| 2 | **tk-tabs — `indicator="underline"`** (13.2) | `admin-mega-menu` (nav tabs, active = bold + dark underline `#333`), `admin-main-fullpage` (secondary text tabs — the console's primary in-product nav), `admin-limits-company` (page-level right-aligned sub-tabs over a 1px divider) | `../../captures-v3/admin/probe-notes.md` (Tabs lines + Console-language block); kit side: `tabs.css.ts:198-208` (pill pseudo display:none, 2px `::after` bar on aria-selected, `--tk-tabs-indicator` hook, NO transition — the bar-animation pin), live legs in `tests/visual/tabs.spec.ts:444+` (pill never paints / 2px bar active-only / transitionDuration 0s / ArrowRight snap), story «Консольный андерлайн» `tabs.stories.ts:303` | 1 recorded mapping: the pack's bar ink is the console dark `#333`-class — the kit maps the bar onto `--tk-color-text-primary` via the `--tk-tabs-indicator` hook (dark-theme remap free; per-INSTANCE retint day one). Bar geometry 2px = the pack's thin dark underline band (vision-estimated ±1px). Page-level right-aligned tabs = the PAGE pattern (row 4), not the component | none — the underline stays opt-in (`pill` default untouched; v1 rows stand) |
| 3 | **tk-progress-bar — height hook** (13.3) | `admin-limits-company` (thin dark bars inside limit sub-cards, dark `#333` + blue sliver), `admin-limits-business-cards` (progressbar `#FFDD2D` h10 fully-rounded + «из X ₽» footer) | `../../captures-v3/admin/probe-notes.md` (both limits sections); kit side: `progress-bar.css.ts:117` (`height: var(--tk-progress-bar-height, 4px)` — geometry-only, default unchanged), `progress-bar.test.ts:190` structural pin, story «Тонкие бары» `progress-bar.stories.ts:242` (h6 yellow / h8 ink-300 / h10 default-blue via the EXISTING `--tk-progress-bar-fill`) | geometry is vision-estimated (h6/h8/h10 are the pack's nearest ramp steps, ±1–2px); the HOOK itself is a kit-side mechanism (no reference counterpart to deviate from — the reference bars are simply consumers of a height value). Bare bars in the pack carry NO label — the kit's axe gate REQUIRES a name (labeled bars; the bare-pack delta recorded in the story + SR protocol) | none |
| 4 | **Console chrome — v2 pattern page** (13.2, `components-v2-console-chrome`) — **COMPOSITION, not pixel fidelity** | `admin-main-fullpage` (header: logo + product links + «Все сервисы» + icon cluster + avatar; secondary tab row) + `admin-mega-menu` (full-width 4-column dropdown, r24–32, monochrome) | the page ITSELF is the record: `packages/docs/src/v2/console-chrome.stories.ts` («Обзор» cites both PNGs + the deltas; «Демо» composes existing atoms); DESIGN.md console-language section `DESIGN.md:520` | Composition/pattern-consistency classification (the 8.3 page mold): deltas recorded IN-PAGE — buttons rendered secondary/ghost (the pack's `#ECEEF0` gray-fill r10 h36–40 is a RECORDED divergence with hooks documented), icon cluster + avatar as plain spans (slots), static mega panel (no open-state capture — pack honest-absence), mega radius `--tk-radius-xl` 24 (the pack band, corrected in-round from radius-lg) | mega-panel OPEN state + avatar-menu/kebab open states — optional follow-up maintainer capture (13.1 roster); not blocking |
| 5 | **Data surfaces — v2 pattern page** (13.3, `components-v2-data-surfaces`) — **COMPOSITION** | `admin-table-toolbar` (toolbar + tabs w/ counts + segmented filter + summary row + status pill), `admin-limits-company` + `admin-limits-business-cards` (page header + thin bars + tile grid), `admin-payments-hub` (favorites 5×2 grid + red count + ghost tile) | the page itself: `packages/docs/src/v2/data-surfaces.stories.ts` (Обзор five pattern sections each citing its PNG + deltas; «Платежи» toolbar+table showcase; «Прогресс и избранное» labeled bars + r16 tile grid + ghost tile) | Composition classification; deltas recorded IN-PAGE and repeated here per the spec: gray-fill button divergence (as row 4), filter-chips carry NO count slot (pack shows count digits inside chips — deferred extension), «…»/kebab popovers PERVASIVE in the pack but deferred (no open-state capture), bare-bar naming delta (row 3), avatars as plain colored slots (no avatar atom) | filter-chips count slot + menu-popover atom — backlog items (13.1 ratification); both recorded in spec-13-3 out-of-scope with owners |
| 6 | **Showcase story-id RENAMES** (12.1 per-vertical restructure) — **POINTER rows, nothing re-measured** | n/a — zero pixel moves | `git show -M b5c2daf -- 'tests/visual/*snapshots*'`: **10 renames at 100% similarity** (showcase-application-form/homepage → bank-*; business-landing, invest-landing drop the showcase- prefix; stocks-catalog → invest-*). Byte-for-byte identical files; the fidelity record is the PRIOR ledgers' rows (v2: business/invest/stocks rows; v1: homepage row 11's base) | 0 by construction (100%-similarity renames; the cross-link comments in the 5 showcase stories are the only source diff) | none |

## Scope note — the docs-side text moves (NOT ledger rows)

`component-search.ts` (11 v2 entries + optional tag), `getting-started`
(27-components status claim), `theming-guide` (the badge-pair override
figure + height-hook note), the v2 `mega-nav`/`stepper` pages (SR-protocol
tables only), and DESIGN.md's console-language section are DOCS/record
surfaces: they document the kit to itself and carry no external reference
to be grounded against. Their accuracy gates are the stale-claim sweep
(14.1 — clean), the zero-hardcoded guard, and the visual suite's axe legs —
all green at this head. Recorded here so the next ledger does not
re-discover the classification.

## UNCHANGED components — prior ledger rows stand

All surfaces not listed above are untouched by v1.2.0..HEAD (numstat
verified; the showcase 2-line comments and the mono-extension round
`1af5c23` re-took PNGs for the SAME pixels under the mono font pin — the
re-take is a capture-platform change, not a component move; see the
register in the baseline package). The v2 ledger
(`../fidelity-verification-v2/ledger.md`, 25 rows) and the v1.2.0 ledger
(`../fidelity-verification-v1-2-0/ledger.md`, 13 rows) remain the fidelity
record for everything else — button, inputs, tabs pill mode (v1 row),
navbar+mega-nav, cards, the v2 nine, overlays, showcases' content rows.

## Findings this story (found → dispositioned)

| # | Finding | Disposition |
|---|---|---|
| L1 | The window's LARGEST re-take wave (151 PNGs, `1af5c23`) is the post-v1.2.0 interlude mono-extension — NOT a 12.x–14.x story surface | register + package record both; the ledger correctly rows it as a capture-platform event (mono pin), not a component fidelity move — the components' pixels are unchanged in kind |
| L2 | `progressbar--api` re-takes (13.3) are BYTE-IDENTICAL (no git event) — the API table renders attributes/members/events/slots, not cssProperties; the height hook lives in cssProperties docs only | the 13.3 capture doubles as PROOF the hook changed no rendered API surface (kept in the spec record; not a register line — git shows nothing) |
| L3 | The pack carries NO dark mode (console observed light-only) — the 13.x surfaces' dark legs have no reference counterpart | recorded honestly: dark legs are KIT-discipline legs (dark-sweep GREEN via the 13.3 scoped extension), not reference fidelity |
| L4 | `packages/react` + `packages/tokens`: ZERO diff in the window — indicator/badge-variant/height-hook all ride CEM attributes | the v1.2.0 verdict carried forward verbatim (wrappers byte-stable; `custom-elements.json` +N lines only) |

## SM-C2 statement (v1.3.0 legs)

Visual suite at the 14.2 prep head: full compare run **1438 passed**
(visual + axe, both themes, every story — the 14.1 gate round; this story's
diff is docs/verification-only, so the served tree is bit-identical). Unit
totals MEASURED at this head: **951** (tokens 17 + components 713 + react
70 + root 151) — all green. PNG inventory: **430** (408 suite + 22
per-component; 414 → 430 = +16 NEW, 0 deleted). Every re-take wave since
v1.2.0 is explained in the register with a forensic one-liner:
`baseline-review-package.md`, ЧАСТЬ v1.3.0.
