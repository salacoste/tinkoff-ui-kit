# tokens-9-2 — generator truth: anchor + byte-stability transcript

Story 9.2 executor evidence (2026-09-25, worktree branch off dd100ed). Probe: `anchor-probe.mjs` in this directory — it re-derives the generator mechanics over the real DESIGN.md; the generator itself remains the authority (`pnpm gen:tokens` aborts on any lost anchor).

## 1. The 10 aa-annotations anchors (mechanics transcript)

Pinned mechanics: every entry must have at least one line in the **Colors body ∪ colors frontmatter** that contains the entry token ref (`{colors.<name>}` or the bare name as a word) **and** at least one factual substring of `text` (an `N.NNN:1` ratio or a hex; the bare AA threshold `4.5:1` is excluded — measurements only). Co-location is per LINE (an AA-table row is one line). The frontmatter side of the space stops EXPLICITLY at the next column-0 frontmatter key, at an indented `aa-annotations:` key, or at the fence end (review hardening) — the aa-annotations block's own `text:` lines can never enter the space and vacuously self-anchor an entry. Anchor lost → generation aborts naming the entry.

| # | Entry | kind / status / story | Facts in text | Anchor region | Fact(s) found on the anchoring line |
|---|---|---|---|---|---|
| 1 | `text-secondary` | override / verified / 1.2 | 4 | colors frontmatter | #616871 |
| 2 | `focus-ring` | override / verified / 1.2 | 1 | Colors body | 1.23:1 |
| 3 | `link-on-tint` | addition / verified / 1.2 | 1 | Colors body | 4.07:1 |
| 4 | `error-on-field` | addition / verified / 1.3 | 2 | colors frontmatter | 4.22:1, 4.40:1 |
| 5 | `text-muted` | restricted / verified / 1.2 | 1 | colors frontmatter | #959BA4 |
| 6 | `delta-positive` | override / verified / 6.1 | 8 | Colors body | 4.587:1, 3.350:1, 4.210:1, 4.039:1, 4.163:1, #168821, #00A328, #F2F4F7 |
| 7 | `delta-negative` | override / verified / 6.1 | 8 | Colors body | 6.179:1, 4.090:1, #C40B08, #F52222, #F2F4F7 |
| 8 | `tint-cream` | pairing / verified / 6.1 | 2 | Colors body | 10.911:1, 4.866:1 |
| 9 | `tint-cream-raised` | pairing / verified / 6.1 | 2 | Colors body | 9.655:1, 4.306:1 |
| 10 | `tint-brown` | measured / verified / 9.1 | 4 | colors frontmatter | #8D6040 |

Anchoring lines (trimmed to the load-bearing span):

- **text-secondary** (colors frontmatter) — fact #616871: text-secondary: '#616871'
- **focus-ring** (Colors body) — fact 1.23:1: …offset 2px (site's ink-on-ink = invisible; border-default = 1.23:1) ¦
- **link-on-tint** (Colors body) — fact 4.07:1: …; on tints use `{colors.link-on-tint}` blue-200 (blue-100 = 4.07:1 on field — fails) ¦
- **error-on-field** (colors frontmatter) — fact 4.22:1, 4.40:1: …n field/muted surfaces; red-100 = 4.22:1 on surface-field / 4.40:1 on surface-muted
- **text-muted** (colors frontmatter) — fact #959BA4: text-muted: '#959BA4'
- **delta-positive** (Colors body) — fact 4.587:1, 3.350:1, 4.210:1, 4.039:1, 4.163:1, #168821, #00A328, #F2F4F7: …ite `#F2F4F7` 4.163:1, surface-muted 4.210:1, surface-field 4.039:1; dark `#F63434`: row-hover composite `#313131` 3.382:1, tonal step 1 `#222222` 4.136:1; red-300 clears muted/field/hover at 5.671/5.441/5.608) — 6.2/6.4 hold deltas on unhovered rows or re…
- **delta-negative** (Colors body) — fact 6.179:1, 4.090:1, #C40B08, #F52222, #F2F4F7: …at least one leg per theme (green-300: row-hover composite `#F2F4F7` 4.163:1, surface-muted 4.210:1, surface-field 4.039:1; dark `#F63434`: row-hover composite `#313131` 3.382:1, tonal step 1 `#222222` 4.136:1; red-300 clears muted/field/hover at 5.671/5.4…
- **tint-cream** (Colors body) — fact 10.911:1, 4.866:1: …5.90:1 ¦ sanctioned: text-primary 10.911:1 / text-secondary 4.866:1 on `tint-cream`; text-primary 9.655:1 on `tint-cream-raised`; dark: 15.895 / 8.461 on `dark-tint-cream`, 14.680 / 7.989 on `dark-tint-cream-raised`. **text-secondary NOT sanctioned on `tin…
- **tint-cream-raised** (Colors body) — fact 9.655:1, 4.306:1: … **text-secondary NOT sanctioned on `tint-cream-raised`** — 4.306:1 fails 4.5:1, use text-primary there (the v1 on-tint ruling precedent) ¦
- **tint-brown** (colors frontmatter) — fact #8D6040: tint-brown: '#8D6040'

Notes: `error-on-field` is the one entry with no Colors-body AA-table row — its anchor is the colors-frontmatter comment added by this story (the spec's "frontmatter comment where the table has no row" path). `text-muted` anchors on its own frontmatter declaration line (`text-muted: '#959BA4'` — ref + hex co-located). `text-secondary` and `tint-brown` anchor TWICE (their frontmatter declarations — first hit, shown — and their AA-table rows 331/339, which carry the ratios); the generator accepts any anchoring line, so both entries survive an edit to either side alone. The other eight anchor on AA-table rows in the Colors body (the table itself was NOT touched by this story).

## 2. Byte stability (regen proof)

- `renderArtifacts(designText)` completes (exit 0) — all 10 anchors hold on the first run after the comment fix (the initial run aborted exactly as designed while the error-on-field comment was multi-line: ref and fact on different lines — the line-co-location mechanic caught its own transcript bug).
- `packages/tokens/src/tokens.css` + `tokens.ts`: **zero-byte diff** vs HEAD (`git diff` empty — the derived notes byte-equal the dead literals, so the css comments are unchanged).
- Double regen: `pnpm gen:tokens` ×2 → md5 of all three artifacts identical (DOUBLE_REGEN_STABLE).
- `packages/tokens/src/TOKENS.md`: exactly 1 line changed — the derived status line (git diff: 1 insertion, 1 deletion; every annotation row byte-identical).

## 3. Zero-PNG manifest

- This story changes no token value and no component, so nothing renders differently: `git status --porcelain` at gate time lists NO file under `tests/visual/` snapshots or any `.png`. Visual compare-only ×2 ran green with zero PNG movement (no baseline re-taken, updated, or deleted); the runs' counts live in the executor report.

