# Interlude micro-round 2026-09-27 — mono-extension + docs hero demos + port-6007 guard

Post-v1.2.0-tag queue (user: «доделывать по твоим рекомендациять»). Three deliverables,
one baseline round. All numbers below are from the actual runs (logs in /tmp/visual-mono-run{A,B,C}.log
while the session lives; verdicts recorded here).

## 1. The change set (uncommitted at NOTES time)

- **mono-extension (33 rules, deferred-work spec-11-2 N1):** every code-selector rule in
  the component packages flipped `--tk-font-body` → `--tk-font-mono` — `.tkap code`
  (api-reference.ts:148; `.tkap td code` has no font-family, inherits), 27 component
  `*-canvas code` story rules, 5 showcase rules (`.tkf-canvas code`, `.tkb-docs code`,
  `.tkh-docs code`, `.tki-docs code`, `.tks-notes code`).
- **docs demos card→hero (option (b) of the button-tier analysis):** theming-guide.stories.ts
  lines 195/196/350/351 — the light demo (primary+secondary) and the charcoal demo
  (primary+inverse) now render `size="hero"`.
- **port-6007 tree-identity guard (deferred-work spec-6-3):** serve.mjs `/__tree__`
  endpoint + tmpdir lockfile (names the holder on EADDRINUSE), tests/visual/global-setup.ts
  (aborts the run pre-legs on foreign/different-tree server), playwright.config.ts
  globalSetup wiring, tripwire tests/visual/global-setup.test.ts (3 paths: this-tree /
  different-tree / no-identity).

## 2. Run A (compare; affected-set discovery) — 2026-09-27

Full suite on the edited tree: **1229 passed / 151 failed / 1380 total, 10.5m**.
Every failure is a VISUAL leg (zero axe failures). Grouping by surface:

- 27 v1-component canvases/api pages (navbar 12 legs — its 6 stories; checkbox/promocard 8;
  the rest 2–6) + 3 v2 pages (combobox-search, filter-chips, mega-nav ×2 themes each);
- theming-guide dark-pairing + switching ×2 themes (the hero flip);
- 3 of 5 showcases (application-form ×2, stocks-catalog ×2, homepage light-only).
  business-landing + invest-landing PASSED: their code chips sit inside full-page
  canvases where the mono re-render stays under the 1.5% ratio — a legitimate pass,
  not a miss (the 11.2 platform-metric class needs the harness pin only on CI).

**Zero canaries** — every group traces to an edited file; nothing outside the class moved.

## 3. Baseline re-take (the sanctioned mold: explicit delete → write → confirm)

- Exactly the 151 affected PNGs deleted (list derived from run A's failed legs;
  filename mold `visual-<id>-<theme>-1-chromium.png`).
- **Run B (write): 1229 passed / 151 «A snapshot doesn't exist … writing actual»**
  — Playwright marks a missing-baseline leg failed while writing it; all 151 error
  blocks classified, zero real diffs, zero size mismatches. 151 files re-appear (git M).
- **Run C (green confirmation): 1380 passed, exit 0, 8.5m** — the new baselines are
  stable end-to-end on the same tree + harness pin.
- Runs B and C each passed through the NEW globalSetup (same-tree path proven twice
  in real suite runs; tripwire 3/3 + port-6099 smoke covered the abort paths earlier).

## 4. Sample verification (playwright-cli probes, server on 6009, read-only)

- button--api page: 32 code chips; sample `custom-elements.json` inside `.tkap`;
  computed font-family = `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`
  — the `--tk-font-mono` system-first stack (was the body stack before the flip).
- theming-guide--switching demo row: two tk-button at **56/56** px (hero).
- theming-guide--dark-pairing charcoal demo row: **56/56** px (hero).

## 5. Disposition

- Mini-confirm package (151 re-taken baselines) presented to the maintainer —
  THE human gate before commit (batch-confirm rule; green CI is not consent).
  **CONFIRMED 2026-09-27** («Подтверждаю»); commits 1af5c23 (flip+hero+151
  baselines) / 7c112e6 (guard+records) / 582b5eb (epics-v4 draft), pushed
  2accdf0..582b5eb.

## 6. CI remediation — the flip's ubuntu tail (run 36329127911)

First CI proof came back RED on exactly 5 visual legs — all legs run A PASSED on
macOS (button--interaction [dark] 0.02, link--theming [dark] 0.02,
progressbar--announce [light] 0.02, tooltip--theming [light] 0.04 / [dark] 0.03):
SAME-SIZE pixel ratios (no size mismatch — the mono pin holds heights; the ratio
path applies), the flip's chip-advance delta sitting under the 1.5% re-take bar
locally but amplified to 0.02–0.04 by ubuntu body text-advance. Per the 1.5%
rule their baselines are NOT re-taken (macOS delta < 1.5%); the sanctioned relief
is the standing CI-only per-leg tolerance (tooltip mold): 5 entries added to
CI_VISUAL_TOLERANCE (0.05/0.05/0.05/0.08/0.06, ~2× the measured bands), THIRD
CLASS paragraph in the spec's history comment. Local compare untouched (CI-only
gate; run C already green at defaults). Unit gates after the edit: 946
(17+708+70+151 — the +3 is the global-setup tripwire joining the root set).
