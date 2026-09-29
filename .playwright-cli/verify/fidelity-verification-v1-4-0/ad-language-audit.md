# AD-LANGUAGE AUDIT — ТЖ family (Story 17.4, 2026-09-29)

**Standard (FR-21 / epics-v5 17.4):** the yellow-audit's ТЖ analog. The
editorial ТЖ family must carry ZERO bank ad-language VALUES — the
yellow/navy pair `#FFDD2D` (+ the yellow-200/300 kin `#FCC521`/`#FAB619`)
and navy `#06101E` — in tokens, components, and wrappers. The split is
architectural (FR-21): native-ad modules on the live reference are BANK
surfaces; in the kit they ride `tk-promo-card` through its documented
`--tk-promo-card-*` hooks (16.6 Flow-C), never ТЖ-side values.

## Method (mechanical, 2026-09-29, tree at 58d979e)

```sh
# case-insensitive, values AND mentions, per package
grep -rniE "FFDD2D|FCC521|FAB619|06101E" <package>
```

The family regex covers both literals of the epics wording plus the
yellow-200/300 kin (the yellow-audit's family set at v1.3.0). Swept as
VALUES-or-MENTIONS so nothing hides in comments; classification follows.

## Verdicts per package

| Scope | Files basis | Hits | Verdict |
|---|---|---|---|
| `packages/tj-tokens` (src incl. generated tokens.css/tokens.ts/TOKENS.md, scripts, README) | whole package | **0** | **PASS** — zero ad-language values or mentions |
| `packages/tj-components` (10 tj-* dirs, overlays, patterns, api-reference, CONVENTIONS, stories, CEM) | whole package | **0** | **PASS** |
| `packages/tj-react` (generated wrappers + src) | whole package | **0** | **PASS** |
| `packages/docs/src/tj` (incl. the ad-slot recipe — the docs-side leg) | dir | **0** | **PASS** — recipe paints via `var(--tk-promo-card-*)` hooks only (ad-slot-recipe.stories.ts:289); this leg rides `tests/zero-hardcoded.test.ts` in CI (already scoped over docs/src — raw hex anywhere in docs src would trip) |
| Planning model `_bmad-output/.../ux-tj-kit-2026-09-28/DESIGN.md` (NOT a shipped package — evidence base) | file | 3 | **BY DESIGN** — the ad-language CENSUS records (line 302-303: the live-page hex counts incl. `#FFDD2D×11 (art only)`) + the deliberate-absence declaration (line 328: «Yellow #FFDD2D / navy #06101E are deliberately ABSENT from this table»). These are the audit's own evidence, not kit values. |

**Total ad-language values in the ТЖ family: 0. Open violations: 0. Fixes: 0.**

## The structural half (already mechanized, cited)

- `tests/import-boundaries.test.ts` — FR-17 BOTH directions (tj-* cannot
  import bank; bank cannot import tj): the import channel for ad language
  is closed mechanically.
- `tests/zero-hardcoded.test.ts` — raw-hex tripwire scoped over
  `packages/tj-components/src`, `packages/tj-react/src`, docs src: a hex
  literal of ANY family cannot enter style-bearing code.
- `tests/tj-tokens-drift.test.ts` / `check:tokens-drift:tj` — the generated
  token artifacts cannot drift from DESIGN.md (where the absence is
  declared), so an ad hex cannot leak in through regeneration.

## Reference grounding (why zero is CORRECT, not merely true)

The capture pack's own census (INDEX.md): yellow `#FFDD2D` + navy `#06101E`
appear on the live ТЖ pages ONLY inside native-ad promo modules (760×350/220,
r25, bank-style yellow CTA) — 11 yellow paint sites, art + module chrome
only. The kit's answer is the 16.6 Flow-C recipe: embed the BANK
promo-card (which owns the yellow language legally, per the bank's own
yellow-audit discipline) through its public hooks. The editorial family
stays gold-accented (`#C79637`, the award/editorial accent) and near-black
CTA — the button-language split the probe recorded (CTA «Написать» = `#333`
r5 h30, NOT the bank's yellow r12 h56 hero tier).
