# Story 12.1 + 12.2 — docs per-vertical restructure + capture packs (2026-09-27)

Epic 12 opening round (epics-v4 ratified 2026-09-27). Spec:
`_bmad-output/implementation-artifacts/spec-12-1-12-2-docs-verticals-capture-packs.md`.
All verdicts below are from the actual runs.

## 12.1 — the rename round (zero pixels, proven)

- Five titles: `Showcase/{Homepage,Application form,Business landing,Invest
  landing,Stocks catalog}` → `Bank/Homepage`, `Bank/Application form`,
  `Business/Landing`, `Invest/Landing`, `Invest/Stocks catalog` (+ a
  pack-cross-link comment at each title line).
- 4 STORY_ID constants updated (homepage/business-landing/invest-landing/
  stocks-catalog specs) + the homepage header comment; `grep 'showcase-'`
  over tests/*.ts returns nothing.
- Docs build green; built index.json: **zero `showcase-*` ids, five
  `bank|business|invest-*` ids** exactly per the spec matrix.
- 10 baselines `git mv`-ed (10 R in git status); behavioral specs' PNG names
  are human-keyed — untouched (spec edge-case b held: nothing re-wrote).
- **Rename proof: full `pnpm test:visual` 1380/1380 GREEN at default
  tolerance, exit 0, 9.1m** — the renamed baselines byte-match the renamed
  stories; also one more real-suite pass through the tree-identity gate.
- Gates: unit 13 files (151 root tests incl. the guard tripwire), lint 0,
  typecheck 0.
- No mini-confirm needed (zero pixel content changes — git renames only; the
  green run IS the proof). Rename list: the 10 pairs in the spec matrix.

## 12.2 — the capture packs

- `captures-v3/bank/` (NEW): `bank-{viewport,fullpage,form-section}-2026-09-27.png`
  + INDEX.md + probe-notes.md. Live read-only session `bank-capture`
  (playwright-cli, 1280×800): retail homepage (pageH 9221, 47 imgs/11 lazy —
  warm-up scrolled before the atlas) + the debit-card application form
  (`/cards/debit-cards/tinkoff-black/#form`, form y≈1880 H844, zero field
  interaction). Probe highlights: retail = single-tone WHITE hero (vs
  business beige #F1EEE8); h1/h2 44/700 rgba(0,0,0,0.8) cross-vertical same;
  form submit «Продолжить» 56×127 #FFDD2D/#333 **r12 hero-tier** (a live
  button-tier data point: retail form submits hero-class); no cookie banner
  surfaced on retail (business showed one same-day — per-surface consent
  state, recorded as-is).
- `captures-v3/INDEX.md` (NEW root): the per-vertical convention (naming,
  pack anatomy, read-only iron rules, login-walled = maintainer-session mold),
  invest = cross-reference to the v2 packs (no byte moves), ТЖ reserved slot.
- Cross-links live in the five story title comments (12.1).

## 12.1a — execution-discovered: the v2 cross-links (spec Change Log 2)

A full-repo sweep (the lens task run by the orchestrator) found ten RENDERED
cross-links in 8 v2 docs stories carrying the old kind as `?path=/story/
showcase-…` href (dead after rename) AND as visible text —
combobox-search/data-table/pagination/mega-nav ×2/filter-chips/stepper ×2/
qr-block/store-badges. All flipped to the new ids + `Invest/Stocks catalog` /
`Invest/Landing` / `Business/Landing` texts; repo sweep for `Showcase`
outside dist: clean.

**Discovery run D (after the flip): 1380/1380 GREEN at default tolerance** —
the re-worded prose links sit in full-page canvases and stay under 1.5% (the
legitimate sub-threshold class; the mono round's business/invest precedents).
Per the 1.5% rule: NO re-take, NO mini-confirm — the committed baselines keep
the old link text as tolerated drift; a CI ubuntu band, if it appears, takes
the per-leg tolerance mold (mono-tail precedent).

## Disposition

Commits by pathspec: code+renames / captures+INDEX / spec+epics+NOTES; push
when no run in flight; CI verdict by Actions only (recorded in §Verdict).
