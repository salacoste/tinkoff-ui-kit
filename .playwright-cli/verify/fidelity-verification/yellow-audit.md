# UX-DR17 yellow-discipline audit (Story 5.6, 2026-09-23)

**Standard (epics.md UX-DR17):** «yellow exclusively for primary action and
active indicators; ink text on yellow (never white); yellow never for
links/icons-at-rest/decoration; active indicators always redundant with text
weight or shadow (WCAG 1.4.11).» DESIGN.md Do's/Don'ts row 1 states the same
as a hard Don't: «Yellow for links, icons, decoration, or white-on-yellow
text».

**The audit is mechanized and CAN fail.** Two real violations were found and
FIXED in-change (rows F1/F2 below); the rest of the inventory classifies
clean. Zero unclassified usages.

## Step 1 — which tokens resolve to yellow hexes (light layer)

From the generated `packages/tokens/src/tokens.css`:

| Token | Light value | Dark layer |
|---|---|---|
| `--tk-color-yellow-100` | `#FFDD2D` | no override — **invariant** (yellow keeps ink in dark; Story 1.3) |
| `--tk-color-yellow-200` | `#FCC521` | no override — invariant |
| `--tk-color-yellow-300` | `#FAB619` | no override — invariant |

No other token resolves to a yellow hex (surface/tint/ink/gray/blue/green/red
families all differ; asserted by inspection of the generated sheet — the
consumed-tokens CI guard additionally proves every `var(--tk-*)` reference
resolves). `--tk-color-text-on-primary` `#333333` is the ink side of the
pairing, not a yellow.

## Step 2 — the mechanized inventory

Command (re-runnable; scans every kit UI source root the CI detector uses):

```sh
grep -rn "yellow-100\|yellow-200\|yellow-300" \
  packages/tokens/src packages/components/src packages/react/src \
  packages/docs/src packages/docs/.storybook \
  --include="*.ts" --include="*.css" --include="*.js" --include="*.mjs" --include="*.html"
```

Every hit is classified below. Comments mentioning yellow (select.ts,
select.css.ts, badge.css.ts, badge.ts, checkbox.ts, input.css.ts, button.ts,
navbar.ts jsdoc) and RU story prose («жёлт…») are documentation, not
consumption — listed once, not per-file.

## Step 3 — classification (every consuming selector)

### A. Primary CTA fill — LEGAL (UX-DR17 letter 1), ink pairing asserted in-code

| # | Selector | File:line | Classification | Ink-on-yellow pairing |
|---|---|---|---|---|
| A1 | `:host([variant='primary']) .button::before` | `button.css.ts:128` | primary CTA fill yellow-100 | `color: var(--tk-color-text-on-primary)` (#333) on the same button (`button.css.ts:124`); contrast-table pin 9.405:1 |
| A2 | `:host([variant='primary']:not([loading])) .button:hover::before` | `button.css.ts:135` | hover step of the primary fill (yellow-200) | same ink pairing; 12.635:1 |
| A3 | `:host([variant='primary']:not([loading])) .button:active::before` | `button.css.ts:139` | press step (yellow-300) | same ink pairing; 17.404:1 |
| A4 | theming-guide CTA demo `style="--tk-promo-card-cta-fill: var(--tk-color-yellow-100); --tk-promo-card-cta-text: var(--tk-color-ink-300)"` | `theming-guide.stories.ts:276,289` | primary-CTA-fill **demo** of the documented channel | ink-300 asserted INLINE in the same declaration (both occurrences) |

### B. Active indicators — LEGAL (UX-DR17 letter 1 + redundancy letter 4)

| # | Selector | File:line | Indicator | Redundancy partner (cited) |
|---|---|---|---|---|
| B1 | `.checkbox :is(:checked, indeterminate) box` (`border-color` + `background`) | `checkbox.css.ts:135-136` | checked/mixed state fill | the **ink-300 check / dash glyph** painted in the box (`checkbox.css.ts` checked rule; pixel-probed `#333333` on `#FFDD2D`, 2.4 NOTES) + native `aria-checked`; the glyph is the state carrier, yellow never carries state alone |
| B2 | `.segment__dot` background | `segmented-radio.css.ts:203` | selected-option dot (yellow-100 Ø24 + ink-300 Ø12 center) | the selected **white solid segment** + `aria-checked` on the native radio (probe record 2.5); ink center dot = ink-on-yellow held |
| B3 | `.link[aria-current='page']::after` underline (2 occurrences: desktop + drawer) | `navbar.css.ts:175,298` | active-section underline (4px strip on the bar's bottom border edge) | **700-weight ink link text** (heading-2 weight token; `navbar.css.ts` active rule) + `aria-current="page"`; unit-pinned `navbar.test.ts:183`; text NEVER sits on the strip (strip scope — dark-sweep ruling 6) |

### C. Demo/ART content in slots — RULED (not kit chrome; the consumer-content class)

| # | Site | File:line | What | Ruling |
|---|---|---|---|---|
| C1 | logo-slot demo shield | `navbar.stories.ts:156` | story-composed brand mark, yellow bg + ink-400 text | consumer `logo` slot demo — the kit ships NO logo; the reference's own logo IS the yellow mark (trademark posture: simplified squircle, 3.4 deviation 3). Ink pairing held (ink-400 text). |
| C2 | logo-slot demo shield (homepage copy) | `homepage.stories.ts:407` | same recipe in the composition | same ruling; ink-400 pairing held |
| C3 | hero art disc | `homepage.stories.ts:522` | token-drawn abstract art (the reference's yellow hero blob, 3.10 notes) | art slot content mirroring the reference's own artwork; not UI chrome; no text on it |
| C4 | bleed-art disc | `feature-card.stories.ts:109` | demo bleed art | same class (3.7 deviation 3: real 3D art is consumer content) |
| C5 | art disc | `promo-card.stories.ts:110` | demo art (2.6 token-drawn pattern) | same class |
| C6 | card-design swatches | `thumbnail-picker.stories.ts:49-50`, `application-form.stories.ts:71-72` | generated card artwork («Чёрная»/«Жёлтая» designs) | dark-sweep R1 ruling class — drawn swatches are consumer content; no text on the fills |
| C7 | token-reference palette | `token-reference.stories.ts` (no literal — renders the generated token maps) | the yellow scale's own swatch specimens | meta-documentation of the token system (data-driven, not a styled usage) |

### D. VIOLATIONS found by the audit — FIXED in-change (Story 5.6)

| # | Selector | File:line | Why illegal | Fix |
|---|---|---|---|---|
| F1 | `.tkap .tkap-foot` `border-left: 4px solid yellow-100` | `api-reference.ts:160` | a callout rule on a status/note box is **decoration** — not a primary action, not an active indicator; the exact Don't in DESIGN.md row 1. No redundancy partner exists for static chrome. | `border-left` color → `--tk-color-border-strong` (light `#CBCFD3`, dark `#FFFFFF3D` — the rule stays visible in both themes); UX-DR17 comment pinned at the rule. 19 API-story baselines re-taken (both themes). |
| F2 | `.tkgs .tkgs-status` `border-left: 4px solid yellow-100` | `getting-started.stories.ts:98` | same pattern, same class | same fix; getting-started baselines re-taken (both themes). |

Both were introduced by Story 5.5's new docs surfaces and were invisible to
every earlier per-component audit (5.5's axe pass checks contrast, not
discipline). The audit's ability to fail is demonstrated by these two rows —
found, classified illegal, fixed with baselines, not waived.

## Step 4 — ink-on-yellow (never white) — asserted

Every surface where TEXT/GLYPH sits on a yellow fill:

| Surface | Text carrier | Value | Asserted by |
|---|---|---|---|
| tk-button primary | `.button` color | `text-on-primary` #333333 | contrast.test row 9.405:1; unit pin; dark-sweep engine FORCE rule |
| tk-checkbox checked/mixed | check/dash glyph | ink-300 #333333 | pixel probe (2.4): glyph exactly `#333333` on `#FFDD2D` |
| tk-segmented-radio dot | ink center dot | ink-300 #333333 | probe (2.5): `#333` core; dark-sweep engine |
| theming-guide CTA demo | `--tk-promo-card-cta-text` | ink-300, inline | the demo's own declaration |
| navbar/homepage logo shields | mark glyph | ink-400 | story source |

No `--tk-color-white` (or white-family) text color is declared on any yellow
fill anywhere in the kit sources — cross-checked by grepping each yellow
consumer's text rules. The dark layer keeps both sides invariant (yellow-100
has no dark override; `text-on-primary` is documented as theme-invariant,
tokens.css "Theme invariants" comment).

## Verdict

- Primary CTA fills: **4** (A1–A4, one component + one documented demo) — legal.
- Active indicators: **3** (B1–B3) — legal, each with its redundancy partner cited.
- Demo/art slot content: **7** (C1–C7) — ruled, consumer-content class.
- **Illegal: 2 found → 2 fixed** (F1/F2), zero waivers.
- Ink-on-yellow: asserted at every text-bearing yellow surface; zero white-on-yellow.

UX-DR17 holds kit-wide post-fix. Re-run anchor: this file's Step-2 command
plus the impeccable kit-wide run (`impeccable-run.md`) — the detector's
color/motion rules and this discipline audit are complementary, not
redundant.
