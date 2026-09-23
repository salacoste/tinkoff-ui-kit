---
title: 'Story 5.6 — Fidelity and discipline verification: 16/16 + 3/3, kit-wide audits, maintainer baseline package'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '6962326c20cf0b83ba54e008523aa0aa0c5c8ad0'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** SM-1/SM-3 (impeccable zero blockers kit-wide; drift provably absent; yellow discipline) and FR-10's closure (16/16 fidelity + 3/3 pattern-consistency, assumption flags resolved) are evidenced only piecewise per story — the release needs ONE verified ledger, and the maintainer's batched provisional-baseline gate needs ONE review package.

**Approach:** Three products: (1) the **fidelity ledger** — 16 reference-grounded components each mapped to baseline + archived tbank.ru side-by-side + probe evidence, 3 derived mapped to pattern-consistency records; (2) the **discipline audits** — kit-wide impeccable detector run (zero blockers) + a yellow-usage audit (UX-DR17) with a mechanized usage classification; (3) the **maintainer baseline-review package** — every provisional baseline from Epics 1–5 grouped with its side-by-side/evidence, the flagged exceptions (F1 sub-threshold dark PNG, re-take waves), and confirm/re-take instructions. Plus the last [ASSUMPTION] closure: xxl/xl radii verified against captures.

## Boundaries & Constraints

- **16/16 ledger:** for each of Button, Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar, TextLink, Badge, Tabs, Navbar, Footer, PromoCard, FeatureCard, ServiceCard, ArticleCard — the committed baseline set, the archived side-by-side location (`.playwright-cli/verify/<name>/` per story), and the probe/vision evidence pointer. MISSING side-by-side = a finding (backfill from the archived captures, do not re-capture from the live site without need).
- **3/3 pattern-consistency:** Modal/Tooltip/Toast records from Epic 4's verify dirs — anatomy vs DESIGN Components table, audit-clean, a11y-clean pointers.
- **xxl/xl radii closure:** verify 32/24 against the card captures (probe radii from the archived PNGs/computed-style notes — the 2.0 pack + 3.6 evidence); resolve the DESIGN.md flags (values confirmed or corrected; correction = DESIGN.md edit → gen:tokens → committed artifacts → probe proof, the 3.6 mold).
- **impeccable kit-wide:** run the headless detector (`impeccable detect`, the CI contract: exit 0/1/2) across ALL component sources; zero blockers; the one sanctioned ignore (bounce-easing, value-scoped) re-verified and listed for the maintainer ratification queue.
- **Yellow-discipline audit (UX-DR17):** map which tokens resolve to yellow hexes in the light layer → grep every component usage → classify: primary CTA fill / active indicator (redundant w/ weight or shadow?) / ILLEGAL (links, icons-at-rest, decoration) / ink-on-yellow pairing check. Mechanized classification + a reviewed exceptions list. Ink-on-yellow (never white) asserted.
- **Maintainer package:** `_bmad-output/implementation-artifacts/baseline-review-package.md` — grouped by epic/story: baseline name(s), theme, the side-by-side/probe evidence path, provisional-since commit, flagged notes (F1 dark progress-bar PNG explicitly; 5.4's 23 re-takes; 5.5's 52+2; homepage/composition waves), and a one-page «how to confirm or re-take» instruction. The gate itself stays HUMAN — this story prepares it, never executes it.
- **SM-C2 statement:** visual suite stable at the pinned env (already green ×2 per story — cite the latest), zero unexplained re-approvals in history (the ledger's re-take list IS the explanation).
- No component code changes expected; anything the audits surface as a REAL violation gets fixed in-change (or ruled with an entry) — the audits must be able to fail.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| 16/16 ledger | committed baselines | every row: baseline+side-by-side+probe | missing side-by-side → backfill |
| 3/3 records | Epic 4 verify dirs | anatomy/audit/a11y pointers | — |
| Radii closure | captures + probes | flags resolved (confirm or correct+regen) | — |
| impeccable kit-wide | all sources | exit 0, zero blockers; ignore list verified | blocker → fix in-change |
| Yellow audit | token map + grep | classified usages, zero illegal | illegal → fix in-change |
| Maintainer package | all provisional baselines | grouped review doc w/ flags + instructions | — |
| SM-C2 | suite history | stable + re-takes all explained | — |

</frozen-after-approval>

## Code Map

- `.playwright-cli/verify/**` (per-story evidence) + `.playwright-cli/captures/**` (reference pack + INDEX.md) -- the ledger's sources
- `.impeccable/` + `.claude/settings.json` -- detector config + the sanctioned ignore
- `packages/tokens/src/tokens.css` + DESIGN.md frontmatter -- yellow-resolving tokens, radii flags
- `tests/visual/visual.spec.ts-snapshots/` -- the committed baseline inventory
- Ledger/product home: `.playwright-cli/verify/fidelity-verification/`; package at `_bmad-output/implementation-artifacts/baseline-review-package.md`

## Tasks & Acceptance

- [x] `.playwright-cli/verify/fidelity-verification/{ledger.md,impeccable-run.md,yellow-audit.md,radii-probe.mjs,logs/}` -- the audit products + committed probe recipe + preserved run logs
- [x] xxl/xl radii [ASSUMPTION] closure -- xl=24 CONFIRMED; **xxl CORRECTED 32→24** (reference banners 22.2 across 3 captures; 3.6 mold: DESIGN.md→regen→probes; two sub-signatures honestly recorded); article-card 16→24 (probe overrules 3.9 vision); spacing flag Verified-systematized; grep-verified ZERO [ASSUMPTION] left
- [x] `_bmad-output/implementation-artifacts/baseline-review-package.md` -- RU maintainer package (flagged-first, 274-PNG inventory grouped by story, one action per row, confirm/re-take instructions); the gate NOT executed
- [x] Audit findings fixed in-change (2 illegal yellow decorations, Button side-by-side backfill, R1/R2/Y1/Y2) or ruled; full gates; visual stable ×2 (921/921)

**Acceptance Criteria:**
- Given the ledger, when read, then 16+3 rows carry evidence pointers and every [ASSUMPTION] flag in DESIGN.md/token listing is resolved or explicitly re-annotated with reason.
- Given the yellow audit, when a usage is classified, then the classification cites the consuming selector and the redundancy partner (or is flagged illegal → fixed).
- Given the package, when the maintainer opens it, then every provisional baseline is accounted for with evidence and an action (confirm/re-take), flagged exceptions first.
- Given `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; `impeccable detect` exit 0.

## Implementation Notes

- Approved autonomously (standing delegation). The story's headline: **xxl radii CORRECTED 32→24** — the probe (closed-form corner-arc fit on archived captures, DPR-1-grounded, reproducible) measured reference banners at 22.2 vs tiles 23.5; 22 would break scale monotonicity, so 24 (the xl landing) — the two-register card-radius claim of UX-DR4 is SUPERSEDED (recorded in ledger R1; epics.md is frozen planning, pointer not edit). article-card radius-lg→xl (16→24) — probe overrules the 3.9 vision reading.
- Yellow audit: 4 primary-CTA / 3 indicators (partners cited) / 7 demo-art (docs surfaces only) / **2 illegal decorations → fixed** (api-reference + getting-started → border-strong). Ink-on-yellow asserted everywhere; alias-chase verified (generated sheet emits literal hexes — only yellow-* carry them).
- impeccable kit-wide (145 files): exit 0; can-fail proven (injected violation → exit 2); the single value-scoped bounce-easing ignore re-verified + listed for maintainer ratification.
- Button side-by-side backfilled from ARCHIVED crops (1.7 predates the convention) — zero live-site captures this story.
- **Agent failure handled:** the first agent stalled mid-patch (silent 6-min freeze, 5th drop-class event) → killed per maintainer instruction → replacement agent resumed from the stop-point inventory with revalidation; it found 3 predecessor gaps (token artifacts one revision behind DESIGN.md — root `pnpm gen` excludes `gen:tokens`; 2 stale «32» prose refs in promo/feature stories.ts the review itself missed; package mid-edit completed). Re-take set trued to **70** (66 + 4 below-threshold docs pages).

## Spec Change Log

(none — frozen block untouched)

## Review Triage Log

Quick review (2026-09-23): 0 blockers / 3 MAJOR / 2 MINOR / 4 NOTE → FIX-THEN-SHIP; the review INDEPENDENTLY REPRODUCED the probe numbers (exact), the detector run, the yellow-grep inventory, the 66-file set, and the 274-PNG count. All patched:

1. **[MAJOR] 4 stale-but-passing PNGs** (token-reference Surfaces ×2, theming-guide ×2 — old 32px renders sub-threshold; the F1 class). PATCHED: deleted + re-taken.
2. **[MAJOR] Stale «radius-xxl 32» jsdoc → CEM → freshly-pinned API baseline.** PATCHED: jsdoc corrected, `pnpm gen`, API pair re-taken. **Replacement agent found 2 MORE stale prose refs the review missed** (promo/feature stories.ts «радиус xxl 32») → playground pairs re-taken too (final set 10 PNGs this round).
3. **[MAJOR] Superseded NOTES rows contradicting the ledger citing them.** PATCHED: supersession lines (article→R2, promo→R1, pointing at radii-probe.mjs).
4. **[MINOR] UX-DR4 supersession** — ledger R1 line (pointer; epics frozen). PATCHED.
5. **[MINOR] «One consistent arc signature» overstated** — reworded to two sub-signatures (22.2/23.5) collapsed to one token; token artifacts re-regenerated (the drift the replacement caught).
6. **[NOTE] service-card rebuild clause** in the package. PATCHED. **[NOTE] audit grep extensions** (+js/mjs/html; re-run zero hits). PATCHED. **[NOTE] /tmp log citations** → copied into verify/logs/ + post-patch runs added. PATCHED. **[NOTE] probe single-corner limitation** — header note. PATCHED.

Post-patch verification: 644 unit + 921 visual ×2 + orchestrator compare run + impeccable exit 0; both generators drift-clean; 119 files staged, zero unstaged/untracked residue.

## Design Notes

The audits must be ABLE TO FAIL — a yellow audit that cannot find an illegal usage and an impeccable run that cannot emit a blocker are unverifiable. Where mechanization is impossible, the manual check records its method. The maintainer package is written FOR the maintainer: flagged items first, one action per row.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `impeccable detect` (repo config) -- exit 0
- `pnpm test:visual` -- stable (compare) ×1 after any fixes
