# Dark mode sweep — METHOD (Story 5.4, 2026-09-23)

**Standard being swept:** SM-5 — dark mode 19/19 with **zero
component-specific hacks**: every component renders correctly under
`data-theme="dark"` (no illegible pairs, no light-only assumptions, no
leftover light artifacts), shadows collapse to tonal elevation (UX-DR2),
the charcoal + yellow-keeps-ink invariants hold, and the dark-tint
first-pass values ([ASSUMPTION] flags) are verified against the derivation
rule. The sweep's product is EVIDENCE (this ledger + the tint table), a
MECHANICAL zero-theme-branch CI guard, and IN-CHANGE FIXES — not new
features.

## The instruments (what proves what)

| Check | Instrument |
|---|---|
| Both-theme render of EVERY story (screenshots + axe wcag2a/2aa/2.1a/2.1aa) | `tests/visual/visual.spec.ts` — generated from the built story index; the dark URL leg also asserts the `data-theme` attribute actually flipped |
| Mechanized AA pair table (57 rows: 30 light / 27 dark, generated-sourced values) | `tests/contrast.test.ts` |
| **DOM-level dark audit** (NEW, this story): per the 19 canonical stories — structure parity across themes, computed text/bg pairs (alpha chain composited through ancestors, shadow hosts, and **slots**), light-only-leftover detection (unchanged backgrounds/borders/text outside the invariant families), invariant holds (yellow/green/ink/charcoal fills must stay; the ONE sanctioned flip = the inverse button's text-primary channel), shadow collapse (elevation layers must be `none` or pure zero-offset zero-blur rings), border presence (width preserved, non-transparent resolved color), yellow-behind-text keeps ink | `tests/visual/dark-sweep.spec.ts` (19 legs, both-theme loads, one evaluate per load) |
| **Zero theme branches (mechanical CI guard, NEW)**: no `data-theme` / `dataset.theme` / `prefers-color-scheme` / `light-dark(` / `color-scheme` occurrence in component RUNTIME sources | `tests/zero-theme-branches.test.ts` (vitest lane, `pnpm test`) |
| Dark-tint derivation-rule verification (L/hue computation + correction threshold) | this ledger's tint table; values sourced from the generated `darkColorTokens` map |
| Charcoal invariant at the token layer | generation-time assert (`generate.mjs` `darkLayerModel`: `dark-tint-charcoal === tint-charcoal`) + `contrast.test.ts` white-on-charcoal row + the DOM engine's FORCE rule |

**Placement decision** (same as the 5.1–5.3 sweeps): the dark-audit spec
lives in the Playwright visual lane (`tests/visual/*.spec.ts`) because it
needs the built-docs webServer; `pnpm test:visual` is the existing CI gate
— zero workflow edits. The branch guard is pure source scanning → vitest
lane (`pnpm test`). The full story × theme axe/screenshot coverage stays
the visual suite's job; the dark audit adds the computed-paint half axe
cannot do (see the transparent-canvas finding F4 below — axe resolves a
fully transparent ancestor chain as *incomplete*, not violation).

## Interpretation rulings (recorded judgment calls)

1. **The derivation rule's "L≈16–20%" reads as CIE Lab L\*** — the L\*
   symbol's standard meaning. The OKLCH-L reading self-destructs: the
   palette's own `dark-base` #1A1A1A is OKLCH L 21.8% and every tonal step
   above it (25.2–33.7%), so a 16–20% OKLCH window would demand tinted
   cards DARKER than the canvas — an impossible elevated surface. In Lab
   L\* the ramp is base 9.3 / s1 13.2 / s2 16.6 / s3 19.4 / elevated 23.1
   and the window brackets tonal steps 2–3. Both scales are recorded per
   tint in the table below.
2. **Correction threshold (recorded per the spec's Implementation Note):**
   correct a tint iff its Lab L\* misses the window by **> 2 L\* points
   AND the miss is visually meaningful** (≥ a just-noticeable difference
   at that lightness — ΔL 2.1 ≈ the 2.3 JND — and not in the safe
   direction: darker tint = more text contrast while still sitting above
   the canvas).
3. **Hue-kept tolerance:** ±20° OKLCH hue at chroma ≤ 0.04 (near-neutrals
   shift hue invisibly as chroma collapses; bluegray Δ2.9° is exact, mint
   Δ17.3° / beige Δ15.7° ride the chroma reduction).
4. **Indicator fills (engine allowance):** a text-less element may keep a
   functional-scale fill (blue/red) across the flip — the R2 redundancy
   ruling (aria carries the state; the 5.1–5.3 precedent for the yellow
   ProgressBar fill).
5. **Tier-B white pill:** an unchanged white background is legal only with
   an unchanged forced-invariant ancestor — the charcoal-card CTA
   re-scope (3.7 review fix). A rogue white card on a remapped canvas
   fails.
6. **Yellow-keeps-ink scope:** yellow paints checked for ink text only
   where text sits ON them (own background or a full-cover `inset: 0`
   pseudo fill). Yellow underline strips (navbar/drawer active) and
   decorative discs are the AA table's redundant indicators — never the
   text carrier.

## Zero-theme-branch guard — exemption list (documented)

- `packages/tokens` — the token layer itself; `[data-theme="dark"]` is its
  one legitimate selector surface (not scanned by design).
- `packages/docs/.storybook/preview.ts` — THE theme toggle decorator
  (writes `document.documentElement.dataset.theme`); the single runtime
  writer of the attribute, by design (spec 1.5).
- `*.stories.ts` — docs/demo chrome, not component runtime: stories print
  the theming snippet in RU content (`<html data-theme="dark">` code
  samples) and may read Storybook's own toolbar global
  (`navbar.stories.ts` composes a demo iframe URL from
  `context.globals.theme` — demo plumbing, not component theming).
- `*.test.ts` — tests quote the forbidden patterns while asserting their
  absence (`link.test.ts` pins `css).not.toContain('data-theme')`).

Scope: `packages/{components,react}/src` + `packages/docs/{src,.storybook}`
minus the above. The detector is a blunt substring scan over
comment-stripped source (any occurrence — selector, attribute read,
string literal — fails), with vacuous-walk, stale-exemption, and
negative/positive self-checks.

## Findings disposition (this sweep)

| # | Finding | Disposition |
|---|---|---|
| F1 | **ProgressBar track = gray-200 in dark** — the scale token has no dark override; the 4px rail rendered near-white (#E7E8EA) on #1A1A1A (vision-confirmed on the pre-fix dark baseline; exactly the lightblue-200 bug class). | FIXED: `progress-bar.css.ts` track fallback → `--tk-color-border-default` (light value **byte-identical** — border-default #E7E8EA = gray-200's hex; dark = the white-alpha tonal step, computed `rgba(255,255,255,0.14)` probed live). DESIGN.md Components row updated. Light baselines unchanged. **FLAG — the dark progress-bar baselines are knowingly STALE-BUT-PASSING** (the 4px rail change is sub-threshold for pixel compare): they MUST join the 5.6 maintainer batch-confirm so the tonal rail is eyeballed at the gate — the computed-style pin holds the line until then. |
| F2 | **Card skeletons = gray-200 in dark** (article/feature/promo `.sk` blocks) — same class: near-white blocks on dark tints. | FIXED: `.sk` fill → `--tk-color-border-default` (same byte-identical-in-light argument); unit pins updated to the new token. Dark variant-story baselines re-taken. |
| F3 | **Select option hover = gray-100 in dark** — near-white hover chip on the dark menu (hover-state only; invisible in static baselines). | FIXED: hover → `--tk-color-surface-muted` (light #F5F5F6 = gray-100's exact hex; dark tonal step 1 #222222). The active > hover perceptibility ordering holds in both themes (active = surface-field → translucent white in dark, MORE visible than hover — probed ratios 1.60 vs 1.09). |
| F4 | **Story canvases without a painted background** (button, link, badge) — the browser canvas stays WHITE in dark while story text remaps to white: the playground headings/notes were INVISIBLE in dark baselines. Axe never flagged it: a fully transparent ancestor chain resolves as *incomplete* under axe's color-contrast rule, not a violation — the exact blind spot this DOM-level audit exists to close. | FIXED: canvas styles gain `background: var(--tk-color-surface-base)` (the tk-input story's own 2.1 precedent + comment). Light renders byte-identical (white over white). 20 dark baselines re-taken (button 8 + badge 6 + link 6). |
| F5 | **Input placeholder = gray-500 in dark** — unchanged mid-gray on the translucent dark field (≈3.2:1 composited). | RULED, not fixed: placeholder is the documented restricted slot (DESIGN.md Colors: text-muted class — placeholder/disabled/non-essential). The engine holds placeholders to ≥3:1 (the non-text floor) and the pair passes. No token with light=gray-500 AND a dark remap exists; inventing one is a no-new-tokens violation. |
| R1 | Thumbnail-picker / showcase story **card-design swatch art** uses `--tk-color-gray-200` fills (platinum card art). | RULED: invariant artwork, not a themed surface — card designs are drawn swatches (the same class as the glossy 3D art slots); SVG art fills are outside the engine's channel set by design. |
| R2 | Functional-scale indicator fills (ProgressBar fill blue-100, input success icon green-100/200) unchanged in dark. | RULED: redundancy rulings (R2/5.1–5.3); blue-100 vs dark-base = 3.76:1 visible; state carried by aria. |
| R3 | Inverse button fill flips ink→white in dark. | RULED: the sanctioned semantic flip (fill rides text-primary; DESIGN.md Components) — the engine's one forced-invariant exemption. |

**Baselines re-taken (23, dark only, provisional rule — join the 5.6 batch
gate):** button ×8, badge ×6, link ×6, article-card/feature-card/
promo-card `variants` ×3 (skeletons). Light baselines untouched. The F1
track change is below the screenshot threshold (a 4px rail ≈ 0.16% of the
playground canvas vs the 1.5% budget) — its pin is the computed-style
engine leg + the live probe above, not pixels; see F1's FLAG row for the
5.6 batch-confirm obligation.

**Engine limitation (documented):** the slot-reparenting walk is ONE level
deep — `assignedSlot` re-parents a slotted element onto its slot, but
DESCENDANTS of a slotted element keep their light-DOM chain and can miss a
shadow-painted fill behind an intermediate wrapper. Miss direction is
false-FAIL only (the fallback paper is white, so a missed dark fill fails
the pair check loudly, never silently passes); no current story hits it
(19/19 walk clean). A second-level walk is future hardening if composed
slot content ever nests.

**Dark tonal steps 2/3/elevated (`dark-surface-2/3`, `dark-elevated`):**
verified NO current consumer needs them — elevation in dark is carried by
`surface-muted` (step 1) + the white-alpha hairline family + the
translucent field. The DESIGN reservation stands for future overlay work
(TOKENS.md deferred list unchanged).
