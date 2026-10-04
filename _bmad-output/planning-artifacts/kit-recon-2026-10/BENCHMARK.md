# Kit-recon benchmark — synthesis (spec 25.4, closes Epic 25)

Generated 2026-10-04 from: `recon/snapshots/*.jsonl` (25.2, latest line
per kit), inventories re-derived from the SAME cached tarballs that
minted the snapshots (`recon/.cache/*/package/`), the visual reference
(25.3, `.playwright-cli/verify/kit-recon/`), and this repo itself for
the self column. Vision reads this story: **2** (shadcn + polaris docs
indexes — the only two kits without a machine or tarball inventory);
budget ≤2/kit respected. Every numeric claim is reproducible from the
JSONL or by the stated directory listing; every qualitative claim cites
its artifact. No product code was touched (AC4).

## 0. Roster at a glance (machine layer, JSONL 25.2)

| kit | ver | family | CEM | inventory basis | components | css-var tokens | dl 30d | stars |
|---|---|---|---|---|---|---|---|---|
| antd | 6.6.5 | react | no | `es/` dirs (tarball) | 75 dirs | 0 (15994 typed, cssinjs) | 15.7M | 99.7k |
| mui | 9.4.0 | react | no | package dirs (tarball) | ~85 dirs | 0 (ThemeProvider objects) | 43.1M | 99.1k |
| mantine | 9.6.3 | react | no | `styles/*.css` (tarball) | 99 css families | 638 | 10.5M | 31.8k |
| carbon | 1.116.0 | tokens | no | `scss/components/` (tarball) | 87 scss families | 800 (capped of 1136) | 704K | 9.5k |
| shoelace | 2.20.1 | lit | **yes** | CEM (machine) | **58 exact** | 390 | 535K | 13.8k |
| taiga | 5.26.0 | angular | no | `*.component|directive.d.ts` (tarball) | 93 decls | 0 in core pkg | 122K | 4.1k |
| radix | 1.6.7 | headless | no | `*.d.ts` (tarball) | ~29 primitives | 0 by design | **60.9M** | 19.4k |
| polaris | 9.4.2 | react | no | docs hub index (PNG) | ~45 cats | 452 | 1.07M | 6.2k |
| shadcn | — | registry | no | docs index (PNG) | ~45 cats | — (repo-only) | — | **125.1k** |
| spectrum | 1.12.4 | lit | no | family shell pkg | ~60 per-component pkgs | 0 in shell | 373K | 1.5k |
| **self** | 1.7.0 | lit | **yes** | CEM (machine) | **45 exact** (41 + 4 sub) | 151 `--tk-*` gen + 107 `--tj-*` gen | n/a (`private: true` — by law) | repo-local |

Counts marked "dirs/families" include layout primitives and exclude
`_util`/style/theme/locale/version sidecars; the exact listing command
per kit is the artifact (same tarball the JSONL pins by version).

## 1a. Nomenclature mapping — their X ≈ our Y / GAP

Universal set (present in ≥6 of 10 roster kits): button, input-family,
checkbox, select, tabs, accordion, modal, tooltip, dropdown menu,
badge/tag, table, skeleton, empty-state, progress, pagination,
carousel, avatar, breadcrumb, notification/toast, drawer/side-panel,
switch, slider, spinner.

| category | roster evidence (kit → name) | OURS | verdict |
|---|---|---|---|
| button | all → Button | `tk-button` | ✅ |
| input | all → Input/TextField | `tk-input` | ✅ single-line only |
| textarea | mui TextareaAutosize, mantine Input, carbon text-area | — | **GAP** |
| checkbox | all | `tk-checkbox` | ✅ |
| radio list | mui RadioGroup, carbon radio-button, shoelace radio-group | `tk-segmented-radio` | ◐ segmented pattern only |
| switch | antd/mui/mantine/carbon/shoelace/radix Switch/Toggle | — | **GAP** |
| select | all | `tk-select` | ✅ |
| combobox | antd AutoComplete, mantine Combobox, taiga select-like | `tk-combobox-search` | ◐ search flavor |
| slider/range | 8/10 kits (all react + shoelace + taiga + radix) | — | **GAP** |
| number input | antd input-number, mantine NumberInput, carbon number-input | — | **GAP** |
| date picker/calendar | antd date-picker+calendar, carbon date-picker, taiga calendar+with-native-picker, shadcn date-picker, polaris date picker | — | **GAP** |
| time picker | antd, carbon, taiga | — | **GAP** (follows date) |
| otp/pin input | radix one-time-password-field, mantine PinInput | — | **GAP** (bank-real: SMS codes) |
| file upload | antd upload, mui Upload, carbon file-uploader | — | **GAP** |
| avatar | 7/10 (antd, mui, mantine user-avatar→, carbon user-avatar, shoelace, polaris, shadcn) | — | **GAP** (ТЖ 45px measurement exists, story 20.1) |
| badge/tag | all | `tk-badge` + chips | ✅ |
| breadcrumb | 6/10 | `tk-breadcrumb` (24b) | ✅ |
| tabs | all | `tk-tabs` | ✅ |
| accordion/collapse | all | `tk-accordion` (21.1) | ✅ |
| modal/dialog | all | `tk-modal` + overlays | ✅ |
| drawer/side-panel | antd/mui/mantine Drawer, shoelace Drawer, carbon side-panel, polaris Sheet, shadcn Drawer | — | **GAP** (modal only; admin console consumer) |
| tooltip | all | `tk-tooltip` | ✅ |
| popover | all | `tk-menu-popover` (19.1) | ✅ |
| dropdown menu | all | `tk-menu-*` | ✅ |
| toast/notification | antd message+notification, mantine, radix toast, shoelace alert | `tk-toast` | ✅ |
| table | antd/mui/mantine/carbon data-table | `tk-data-table` + `tk-kv-list` (22.3/22.4) | ✅ |
| tree | antd tree, carbon treeview, mantine Tree, shoelace tree | — | **GAP** (weak bank pattern) |
| progress bar | all | `tk-progress-bar` | ✅ |
| progress ring | shoelace progress-ring, mantine RingProgress | — | GAP (minor) |
| spinner/loader | taiga loader, polaris Spinner, shoelace spinner, antd spin | — | **GAP** |
| skeleton | shoelace/mantine/antd/polaris | `tk-skeleton` (21.2) | ✅ |
| empty state | antd empty, mantine EmptyState, polaris | `tk-empty-state` (21.3) | ✅ |
| rating | shoelace rating | `tk-rating` (21.5) | ✅ (rare parity) |
| pagination | antd/mui/mantine/carbon | `tk-pagination` | ✅ |
| stepper | antd steps, mantine Stepper | `tk-stepper` | ✅ |
| carousel | antd/shoelace/taiga | `tk-carousel` (21.6) | ✅ |
| navbar/app shell | mui AppBar, mantine AppShell, polaris Top bar, carbon ui-shell | `tk-navbar` + `tj-header` | ✅ |
| footer | (rare in kits — site-level) | `tk-footer` | ✅ differentiator |
| link | all | `tk-link` + `tj-link` | ✅ |
| icon system | 8/10 (not radix, not ours) | slot content (ruling 23.2) | skip-by-ruling |
| chart | NONE in core tarballs (antd/mui split to external pkgs; shadcn wraps recharts) | `tk-chart` (23.1) | ✅ **differentiator** |
| qr | antd qr-code, shoelace qr-code | `tk-qr-block` | ✅ parity |
| copy button | carbon copy-button, shoelace copy-button | pattern 24.11 (no atom) | watch |
| typography primitives | mantine Text/Title/Code/Kbd, antd typography | `tj-prose` (pattern) | watch |
| scroll area | radix scroll-area, mantine ScrollArea | native | watch |
| aspect ratio | radix/mantine/carbon aspect-ratio | `tk-figure` (aspect hook, 24.7) | ✅ |
| form validation | antd Form, mantine useForm | native + patterns 24.2/24.3 | watch |

Bank-domain atoms with NO roster equivalent (category leaders absent):
`tk-quote-chip`, `tk-instrument-hero`, `tk-promo-card`(ticket),
`tk-publisher-header`, `tk-cookie-banner`, `tk-store-badges`,
`tk-thumbnail-picker`, `tk-filter-chips`, `tk-service-card`,
`tk-article-card`, `tk-feature-card`, `tk-note` + the ТЖ family (10) —
these are the kit's actual moat; no roster kit ships them.

## 1b. API conventions

| kit | API carrier | machine CEM | depth (avg props/events/slots) | theming hooks |
|---|---|---|---|---|
| shoelace | Lit props/events/slots | yes | 6.2 / 1.9 / 1.8 (58 comp) | 390 `--sl-*` |
| self | Lit + generated React wrappers (46) | yes | 3.3 / 0.4 / 1.6 (45 comp) | hooks per component (CONVENTIONS §6); 145 unique `var(--tk-*/--tj-*)` consumers in css.ts |
| taiga | Angular components + directives (93 decls ≈ 35 comp + 58 directives — attribute-API style) | no | n/a (not machine-shapeable) | 0 css vars in core pkg (styles external) |
| antd/mui/mantine | TS interfaces in d.ts | no | n/a (d.ts not component-shaped — structural fact, not absence) | antd cssinjs runtime; mantine 638 vars; mui ThemeProvider objects |
| carbon | React components + scss token layer | no | n/a | 800 `--cds-*`-style vars (capped of 1136) |
| radix | headless d.ts primitives | no | n/a | none by design |
| shadcn | copy-paste registry (no package API) | no | n/a | tailwind vars in consumer space |
| polaris | React components | no | n/a | 452 `--p-*` |

Finding (honest): our CEM **events surface is thin** — 0.4 events per
component vs shoelace 1.9. Partly architectural (STATELESS display
atoms by design — `tk-skeleton`, `tk-figure` etc. rightly emit
nothing), partly real: interactive atoms lean on `*-change` only where
the ПД patterns demanded it. Reproducible:
`components[].events` arrays in `self.jsonl` vs `shoelace.jsonl`.

## 1c. Token architecture

| kit | source of truth | tokens (machine) | theming model |
|---|---|---|---|
| antd | TS seed→map algorithms (`es/theme/` 63 files, tarball list) | **15994 typed** (token.json 2491 + token-meta 5506 ×es/lib) | cssinjs runtime, dark = algorithm |
| carbon | Sass `_theme/_themes` → per-component vars | 800 (cap; 1136 raw) | 4 static themes (white/g10/g90/g100) |
| mantine | `createTheme` TS + css-var emission | 638 | CSS Variables API, static layers |
| shoelace | css files | 390 | light/dark css files, class switch |
| polaris | theme TS objects (`themes/{light,dark,light-high-contrast,light-mobile}.js`) | 452 | **4 themes incl. high-contrast + mobile-dense** |
| self | DESIGN.md (W3C-flavored source) → generated `packages/{tokens,tj-tokens}` | 151 `--tk-*` + 107 `--tj-*` (dist css, unique names) + 145 var() consumers in components | static layers + per-component hooks; **FR-1 zero-hardcoded law (scanner-enforced — unique in roster)** |

antd's `token-meta.json` pattern (every token carries
name/desc/type/source — visible in `antd.jsonl` tokenSample) is the
documentation bar; our equivalent of "source" is DESIGN.md lineage, but
we publish no token-metadata artifact.

## 1d. Activity (25.2, verbatim)

radix 60.9M dl (headless + React: the demand signal for generated
wrappers) · mui 43.1M · antd 15.7M · mantine 10.5M · polaris 1.07M ·
carbon 704K · shoelace 535K — **0 releases 12+ mo, last publish
2025-03-11** · spectrum 373K · taiga 122K · shadcn no-npm, **125.1k
stars** (largest repo; registry/copy-paste distribution model). Self:
no npm presence ever (`private: true`, releases = git tags — by law).

## 1e. Visual registers (25.3, qualitative, artifact = composite-<kit>.png)

- taiga — yellow/blue Т-Банк-adjacent identity, large radii, airy docs
  (`composite-taiga.png`; genuine darks)
- shoelace — calm neutral-Indigo, generous whitespace (`composite-shoelace.png`)
- mui — Material blue accent, dense enterprise reference (`composite-mui.png`)
- antd — warm red accent, densest tables of the roster (`composite-antd.png`; dark partial)
- mantine — clean neutral, dark behind docs toggle (`composite-mantine.png`; light-only captured)
- carbon — IBM Plex, grey-blue, engineering register (`composite-carbon.png`; light-only)
- polaris — Shopify green reference hub (`composite-polaris.png`)
- radix — deliberately unstyled mini-demos; no visual language of its own (`composite-radix.png`)
- shadcn — zinc-neutral minimalism (`composite-shadcn.png`)
- spectrum — Adobe grey-blue strict system (`composite-spectrum.png`; light-only)
- self — Т-Банк yellow/dark identity; evidence = the kit's own 2572-leg suite (not re-captured, PLAN.md "self" note)

## 2. Gap report — top findings, {adopt / watch / skip-by-laws}

| # | finding | evidence | verdict |
|---|---|---|---|
| 1 | **Slider/range absent** while present in 8/10 roster kits; Т-Банк deposit-amount patterns are slider-heavy | §1a row slider; antd/mui/mantine/carbon/shoelace/taiga/radix inventories | **adopt** (next brief) |
| 2 | **Switch/toggle absent**; universal control | §1a row switch | **adopt** |
| 3 | **Spinner absent** (progress-bar ≠ indeterminate loader) | §1a row spinner; taiga loader d.ts, polaris Spinner | **adopt** |
| 4 | **Textarea absent** (tk-input is single-line; verified — no textarea in `packages/components/src/input/`) | §1a; repo grep | **adopt** (small) |
| 5 | **Avatar absent**; ТЖ news 45px avatar already measured in 20.1 audit | §1a; `verify/tj-live-fidelity-audit-2026-10-01/` | **adopt** |
| 6 | **Date picker/calendar absent**; 5/10 kits ship it, but ПД-gate requires a live Т-Банк pattern first (no transcription) | §1a; 25.3 PLAN dark-verified pages | **watch** (gate: live grounding) |
| 7 | **Drawer/side-panel absent**; admin-zone console (v1.3.0 family) is the natural consumer | §1a; admin-zone scope | **watch** |
| 8 | **OTP/pin input absent**; bank-real (SMS codes); radix+mantine both ship one | §1a; radix one-time-password-field d.ts | **watch** |
| 9 | **Tree absent** — no bank ПД pattern observed across captures | §1a; invest/bank recon GAP-MAPs | **skip** (no live pattern; re-visit with admin zone) |
| 10 | **CEM events surface thin** (0.4 vs shoelace 1.9 avg) — interactive atoms expose only `*-change` where patterns demanded | §1b; JSONL `components[].events` | **watch** (audit per interactive atom) |
| 11 | **antd token-meta documentation pattern** — per-token name/desc/type/source metadata; our DESIGN.md lineage lives only in repo | §1c; `antd.jsonl` tokenSample | **watch** (generated token doc artifact) |
| 12 | **polaris light-high-contrast theme** — a11y theme tier we lack | §1c; polaris themeFiles list | **watch** |
| 13 | **Icon system** — 8/10 kits ship glyphs; ours by ruling has none (slot content) | §1a; ruling 23.2 | **skip-by-laws** (maintainer ruling) |
| 14 | **shadcn copy-paste registry model** — 125k stars without publishing a package; our distribution is git tags + `private: true` forever | §1d; roster shadcn row | **skip-by-laws** (npm never; private forever) |
| 15 | **Chart in-kit is a differentiator** (no roster core tarball ships one) — protect tk-chart scope (static SVG, consumer-side interactivity) | §1a; 23.1 spec | **adopt** (keep/strength, no new work) |

## 3. Feed for the next brief

Strongest adopt cluster: **form-control completeness wave**
(slider, switch, spinner, textarea, avatar — items 1–5, all
groundable in existing ПД evidence or Т-Банк patterns). Watch items
6–8 and 10–12 need either a live pattern capture (24T flow) or an
explicit maintainer call. Distribution identity stays: CEM + generated
React wrappers + git-tag releases — the recon shows we are one of two
CEM publishers in the roster and the only one with scanner-enforced
token discipline; that is the positioning to keep.

— generated by spec 25.4; snapshots idempotency re-proven this story
(`--kit shoelace` without force → `skipped`, zero JSONL diff).
