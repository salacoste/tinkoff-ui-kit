# UX-DR17 yellow-discipline audit — v1.3.0 extension (Story 14.2, 2026-09-28)

**Standard (unchanged since v1 — `../fidelity-verification/yellow-audit.md`,
methodology verbatim):** yellow ONLY for primary-action fills and active
indicators; ink text on yellow (never white); yellow never for links /
icons-at-rest / decoration; active indicators always redundant with weight,
shadow, or another color-insensitive carrier (WCAG 1.4.11). PLUS the
console-pack discipline this cycle grounds: in the authorized zone yellow
survives ONLY as the 2px selection outline, the progress fill, and the
logo — NEVER a button fill; mega panel monochrome.

**Extension scope of this run:** every surface the `v1.2.0..HEAD` diff
moved (the 12.x–14.x window: the interlude mono-extension, the 12.1
renames, tabs underline, badge neutral/attention + hooks, progress-bar
height hook, the two v2 pattern pages, the 14.1 docs completion). The v1
(19 components + docs), v2 (nine + three compositions + v2 docs pages),
and v1.2.0 audits stand; this run re-executes the same mechanical
inventory and classifies the DIFF surface. The audit CAN fail — the v1 run
found and fixed 2 real violations (F1/F2); the same bar applies here.

## Step 1 — yellow tokens (unchanged)

`--tk-color-yellow-100 #FFDD2D / -200 #FCC521 / -300 #FAB619` —
theme-invariant (no dark override). No other token resolves to a yellow
hex; the v1.3.0 window minted NO tokens at all (packages/tokens ZERO diff
— badge hooks and the progress height hook are per-component channels, not
palette entries). The consumed-tokens CI guard still proves every
`var(--tk-*)` resolves.

## Step 2 — mechanical inventory (re-run, honest counts)

The v1/v2/v1.2.0 command verbatim over the five roots at HEAD `80a3604`:

```sh
grep -rn "yellow-100\|yellow-200\|yellow-300" \
  packages/tokens/src packages/components/src packages/react/src \
  packages/docs/src packages/docs/.storybook \
  --include="*.ts" --include="*.css" --include="*.js" --include="*.mjs" --include="*.html"
```

**Result: 72 hits / 32 files** (v1.2.0 run at e693d40: 66/29 — the +6
hits / +3 files are exactly the new consuming rules classified in Step 3;
the files are progress-bar.stories, data-surfaces, console-chrome,
theming-guide [badge figure] + the CEM re-embeds of the touched sheets).
Documentation-class hits (jsdoc, RU story prose, generated TOKENS sheets)
dominate exactly as in every prior run.

**Diff-scoped pass** (the v1.3.0-relevant surface — added lines only,
`git diff v1.2.0..HEAD -U0 -- packages/ | grep '^+'`):

- **Source roots: exactly 6 added yellow-consuming lines** (each pair =
  live demo + its codeBlock twin):
  1. `progress-bar.stories.ts:261` — thin-bars h6 demo bar,
     `--tk-progress-bar-fill: var(--tk-color-yellow-100)` (×1 line; the
     codeBlock twin carries the same declaration);
  2. `v2/data-surfaces.stories.ts:347` (codeBlock) + `:471` (live) — the
     labeled yellow thin bar in «Прогресс и избранное»;
  3. `v2/console-chrome.stories.ts:77` — `background:
     var(--tk-color-yellow-100)` on the demo LOGO TILE;
  4. `theming-guide.stories.ts:305` (live span) + `:316` (codeBlock) — the
     14.1 badge-pair override demo.
- **Raw-hex sweep on added lines: 0 hits** (`#FFDD2D|#FCC521|#FAB619|
  255,221,45` — zero yellow hex literals entered the tree this window).
  Full-tree raw-hex state: 7 hits — 3+3 in `tokens.{ts,css}` (the token
  definitions, where literals belong) + the one known comment
  (`thumbnail-picker.css.ts:13`, the documented v2 residual). Unchanged.

## Step 3 — classification of the v1.3.0 diff surface

### C. Demo/art in slots + theming demos — RULED (consumer-content class)

| # | Site | File:line | What | Ruling |
|---|---|---|---|---|
| C14 | thin-bars demo, yellow h6 bar | `progress-bar.stories.ts:261` | the 13.3 demo of the height hook with the EXISTING `--tk-progress-bar-fill` channel set to yellow-100 | **the console pack's OWN sanctioned class**: progress fill is one of yellow's three legal survivals in the authorized zone (`admin-limits-business-cards` progressbar `#FFDD2D` h10 — probe-notes). No text on the fill (bars are aria-named separately) |
| C15 | data-surfaces «Прогресс и избранное», labeled yellow bar | `v2/data-surfaces.stories.ts:471` (codeBlock :347) | the same progress-fill class inside the pattern-page composition | same ruling as C14 (the page mirrors the limits cards verbatim — yellow bar + muted footer caption OUTSIDE the fill) |
| C16 | console-chrome demo logo tile | `v2/console-chrome.stories.ts:77` | the «Т БИЗНЕС» demo logo tile background (yellow-100 + `text-on-primary` pair) | **the pack's logo class** — yellow survives as the logo in the console chrome (`admin-main-fullpage` «Т БИЗНЕС», the pack's own observation). The pair on it is the button-primary ink pair (text-on-primary) — ink-on-yellow holds |
| C17 | theming-guide badge-pair figure | `theming-guide.stories.ts:305` (codeBlock :316) | the 14.1 OVERRIDE DEMO: attention badge pair retinted to `yellow-100`/`text-on-primary` through the `--tk-badge-*` hooks | theming-documentation class (the same class as the pre-existing charcoal-CTA yellow demo at :279): a DEMO of the override channel, not a kit chrome decision; the pair is the sanctioned ink pair; the figure exists to prove shadow-boundary inheritance |

No other consuming selector was added by 12.x–14.1. The tabs underline bar
is `--tk-tabs-indicator` defaulting to `text-primary` (INK, not yellow —
the pack's console underline is dark `#333`-class); the badge
neutral/attention variants consume gray/red scales; the mono-extension and
renames add zero color rules.

### A/B — no new entries

- New primary-CTA fills in kit chrome: **0** (the pattern pages' buttons
  are secondary/ghost — the pack's own mono-chrome discipline: NO yellow
  button fills anywhere in the console; the recorded gray-fill divergence
  is a GRAY question, not a yellow one).
- New active indicators: **0** (tabs underline = ink bar + 500-weight
  text — state never rides color alone; filter-chips' active treatment is
  the pre-existing v2 surface, untouched by this window).

## Step 4 — verdicts per v1.3.0-moved surface

| Surface | Verdict | Basis |
|---|---|---|
| interlude mono-extension (1af5c23) | PASS | font-family declarations only; grep confirms zero yellow rules touched |
| 12.1 renames | PASS | byte-identical files (100%-similarity renames); zero color content |
| tk-tabs underline | PASS | bar = ink (text-primary via hook); zero yellow selectors in the sheet block |
| tk-badge neutral/attention + hooks | PASS | gray/red scale pairs; hooks are channels, not palette; zero yellow |
| tk-progress-bar height hook | PASS | geometry-only channel; the yellow DEMO fill is C14 (sanctioned class) |
| console-chrome page | PASS | the special-interest leg: page discipline = the pack's console discipline — yellow ONLY on the logo tile (C16); buttons secondary/ghost; mega panel monochrome (zero yellow inside, mirroring `admin-mega-menu`); tabs underline ink |
| data-surfaces page | PASS | yellow ONLY as the labeled progress fill (C15); status pills gray; links blue; ghost tile blue-icon |
| 14.1 docs completion | PASS | search/theming/protocol text surfaces; the one yellow figure is C17 (ink-paired demo) |

## Step 5 — ink-on-yellow (never white)

Every NEW yellow fill this window (C14–C17) carries NO text, or the
sanctioned ink pair: C14/C15 bars are text-free (labels outside the fill);
C16/C17 pair `yellow-100` with `text-on-primary` (the button-primary ink
pair — never white). Every pre-existing ink-on-yellow pair is untouched by
the diff (selectors byte-identical at HEAD). Dark layer: yellow-100
remains without override; pairs theme-invariant (8.2 engine, unchanged).

## Verdict

- New primary-CTA fills: **0**. New active indicators: **0**. New
  demo/art/theming fills: **4** (C14–C17 — all ruled: 2 × the pack's own
  progress-fill class, 1 × logo class, 1 × override demo, all ink-paired
  or text-free). **Illegal: 0 found → 0 fixes.**
- The audit's ability to fail is inherited from the v1 run (F1/F2) and the
  unchanged command; re-run anchor: Step 2's command + the diff-scoped
  pass.
- UX-DR17 holds kit-wide at the v1.3.0 head — and the CONSOLE extension of
  the rule (yellow never fills buttons in the authorized zone) is now
  reference-grounded by the pack and satisfied by both pattern pages.
