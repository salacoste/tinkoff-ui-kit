# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — **copy the existing site, systematize, and improve**.
Study project: the reference site (tinkoff.ru) is the design source of truth; we extract its design system
(colors, typography, spacing, components, motion) and rebuild it as a proper, improved UI kit.

**Stack: chosen by BMAD architecture (d1bfa05) — core-and-adapters.** Lit 3.3.3 core (shadow DOM,
`--tk-*` token pipeline) in `packages/components`; React 19 wrapper package generated from CEM
(`@lit/react`); pnpm workspace `pillkit-{tokens,components,react,docs}`; TS 7 strict, Vite 8, Vitest,
Playwright visual/axe harness. Planning artifacts (PRD/UX/architecture/epics) live in `_bmad-output/planning-artifacts/`.

## Project state (updated 2026-09-24 — v1.0.0 RELEASED; v2 build IN PROGRESS)

- **v1.0.0 SHIPPED as git tag `v1.0.0`** (maintainer gate session 2026-09-23/24). All maintainer
  gates closed: 274/274 baselines CONFIRMED (F1 re-taken), VoiceOver SR walk 19/19 (tabs
  track→panel rhythm fixed in-session), §0 ratifications recorded in RELEASE.md
- **Distribution model: GitHub-only — NO npm, ever (maintainer decision 2026-09-23).** Consumers
  clone/checkout a tag and use the workspace-link recipe (README quickstart — SM-6-verified AND
  verified live from the tag; the quickstart html REQUIRES `<meta charset="utf-8">` — a real
  mojibake bug the release gate caught and fixed). `private: true` in all packages is PERMANENT.
  Releases = commit + `git tag vX.Y.Z` + push; the release gate = fresh consumer clones the tag
  and runs the README recipe end-to-end (RELEASE.md §4–§5)
- **v2 IN PROGRESS (designated 2026-09-24):** three new domains — tbank.ru/business,
  /invest/mobile-application, /invest/stocks. BMAD chain COMPLETE (brief/PRD §4.8 FR-12..16,
  UX spines, architecture delta = zero, **epics-v2.md: 3 epics / 13 stories**). Recon + UX-phase
  captures in `.playwright-cli/captures-v2/`. **Story 6.1 DONE (c999e12, spec-6-1 closed):**
  gen:tokens consumes `{colors.*}` references + rgba literals; delta/table/cream semantics live
  (6 dark first-pass [ASSUMPTION]s → 8.2); registers documented in TOKENS.md. CONSTRAINT for 6.4:
  delta text sits on surface-base cells only — green-300 fails muted/field/hover composites
  (4.210/4.039/4.163, pinned in contrast.test.ts). **Story 6.2 DONE (spec-6-2 closed):**
  tk-filter-chips (tablist pills + «Ещё» overlay menu, border-only selection) + tk-pagination
  (nav landmark, windowing, load-more bar) — geometry pixel-probed (bar 44 / gap 16; frozen
  radius-full chips kept vs ref r≈10–12, §9-recorded), verify evidence in
  `.playwright-cli/verify/{filter-chips,pagination}/`. **Story 6.3 DONE (spec-6-3 closed):**
  tk-combobox-search (borderless 52px search register + controller-mounted suggestion panel,
  aria-activedescendant, IME-composition-safe live-text re-sync, RU-pluralized announcements;
  icon-gap trued to the reference x52 arithmetic; §9 row for the internal panel state) —
  772 unit + visual 1041/1041, verify evidence in `.playwright-cli/verify/combobox-search/`.
  PARALLEL-TRACK RULE (paid for 2026-09-24, sharpened 2026-09-25): the visual harness's
  webServer port 6007 is machine-global — NEVER run two `pnpm test:visual` concurrently
  (worktrees/agents); kill stray 6007 servers before gate rounds (see deferred-work.md).
  SHARPENING (6.4 fix round): `reuseExistingServer` made a run silently test against a
  STALE orphan dist (foreign serve.mjs whose cwd matched the tree grabbed 6007 within
  ~40s twice) — ownership is necessary, CONTENT FRESHNESS is the real guarantee; for
  high-stakes gate rounds use a PRIVATE port via a temporary VISUAL_PORT-overridable
  playwright config (proven technique, delete before commit). **Story 7.1 DONE (736191e +
  truing b068bb8, merged 0ec0790, spec-7-1 closed):** tk-navbar extended in place with the
  optional 64px sub-nav row (subLinks/subActiveValue/subLabel; two named nav landmarks;
  sub-nav desktop-only; v1 byte-stability pinned) — TRUING corrected two frozen premises
  (row-2 active HAS a 2px underline + inter-row 1px divider; Spec Change Log), 784 unit +
  visual 1065/1065 ×2, verify evidence in `.playwright-cli/verify/mega-nav/`. **6.4 DONE (e06e844 → §9-fix 13bedc2 → lens fix round
  eb9fdd7, spec-6-4 closed): tk-data-table — typographic row-as-link catalog, APG keyboard
  layer, §9 delta-on-hover row (leg map corrected: light-pos 4.163 / dark-neg 3.382 are the
  dipping legs); lens B1 (dead `.cell__link` selector) fixed — empirically PIXEL-NEUTRAL in
  the pinned capture env (keyboard baselines md5-identical). 7.2 DONE (773f53d worktree →
  merge 0f1592d → gate-fix 9086551, spec-7-2 closed): tk-cookie-banner — non-modal consent
  dialog, consent-choice bare verb, 12 baselines (axe co-driver debt FIXED in the same
  window: tests/visual/axe-serialize.ts chain + busy-retry). 6.5 DONE (b1a1b9f, spec-6-5
  closed): stocks-catalog showcase composition — 5 surfaces wired live, 39-step recorded
  keyboard walkthrough, a11y-ledger group-IV, lens SHIP 0/0/2.** 7.3 DONE (d199a79 worktree → merge d6a9f2c → lens fix 6cb2234, spec-7-3 closed):
  tk-stepper + tk-store-badges + tk-qr-block — the marketing display trio (brown badge
  = deferred-work maintainer flag; qr tablist = v1 tk-tabs composed verbatim; note
  under the tile). Lens SHIP 0/2/7, both WARNs fixed in-window.** **7.4 DONE (bbbceef
  worktree → merge 5a6f5e5, spec-7-4 closed): business-landing showcase — bento 2+3 on the
  warm-cream family (radius 24 = radius-xxl EXACT), floating white CTA, form cluster with
  mode-derived imperative toast (element-screenshot evidence: page-clip breaks at
  scrollY≈2268); two premise corrections pixel-confirmed (capture pill reads «Все продукты»,
  token names = tint-cream family); lens SHIP 0/0/5, all three hygiene notes fixed in-window
  (hex-in-comment, stale jsdoc, NOTES path). 7.5 DONE (7df3097 worktree → merge 508bd7b +
  CEM regen 0df4593, spec-7-5 closed): invest-landing showcase — marketing register h1 =
  heading-2 mapping EXACT, install cluster qr→steps→badges (capture-refuted order,
  premise corrected), «Вариант 2» both headings verbatim; lens SHIP 0/0/0; kit gaps
  (qr-block page-copy slot, button href mode) reported to deferred-work. PROVISIONING
  LESSON: both showcase worktrees were born at d27773b (pre-trio HEAD) — executors
  self-recovered via reset to d6a9f2c; launch dependent executors strictly AFTER the base
  commit exists.** **8.1 DONE (8a2e5a9 + cd00449 worktree → merge 037699d + baseline
  re-take 256e5cf, spec-8-1 closed): the 5.1 method on the nine — 54/54 cells PASS, ledger
  group-V.md, 28 engine legs (ringAncestor topology; cookie walk rides variants — top-layer
  forward-walk limitation recorded in deferred-work); F1 sub-label/burger-label empty-name
  fallback at all 3 name sites; F2 kit-wide :host([hidden]) 33/33 sheets + tripwire pattern
  test that FOUND 5 real multi-sheet gaps (tk-modal rendered while hidden!); the guard
  removed a baked-in select stray-band defect → 14 baselines legitimately re-taken
  (exactly-14 verified). Lens SHIP 0/0/4, all notes fixed in-window. 8.3 DONE (e63639c
  worktree → FAST-FORWARD merge, spec-8-3 closed): 9 v2 docs pages (live CEM tables) +
  registers story on token-reference (single-source: TOKENS.md ?raw + throwing parser +
  drift test in pnpm test); canvas-bg debt CLOSED (keep per-story copies, preview.ts:52-70);
  docs-chrome axe fixes only (zero component changes). Lens SHIP 0/0/5.** **8.2 DONE
  (70d02a8 worktree = 8c0fdde tokens + 9231315 engine/F5 + 70d02a8 ledger; base 7e525c2 →
  FAST-FORWARD merge; spec-8-2 closed): ALL SIX 6.1 dark [ASSUMPTION]s HELD with computed
  evidence (zero value changes — DESIGN.md/tokens diffs comments-only, lens-verified
  byte-identical hex); TOKENS.md flag-free. Engine registry 19→28 + delta verdict legs
  (3.382/4.883 confirmed LIVE on rendered DOM, raster-precision composite); F5 real
  defect fixed (store-badges anchor had NO color channel — UA link-blue survived theme
  flips; token hookup, zero pixel change). Ledger 28/28. The worktree ×2 surfaced 2
  PRE-EXISTING baseline fails (mega-nav--page light+dark: 8.1's CEM growth +41px, same
  class 256e5cf adjudicated — the docs PAGE was missed); STOP obeyed by the executor,
  orchestrator adjudicated LEGITIMATE → re-taken exactly-2 (1280×3372→3413, prediction
  exact). Lens SHIP 0/0/5 (3 pointer/arithmetic notes fixed in-window); true unit count
  trued 876→881 (8.3's +5 had been missed).** **8.4 DONE (b05613d worktree = 83f2b7e
  verify-trio + batch package, b05613d RELEASE §8 + HANDOFF close; base aa9780f →
  FAST-FORWARD merge; spec-8-4 closed): fidelity ledger 25 rows (58 documented
  deviations, HYBRID/pattern-consistency honesty), yellow audit 13/13 PASS (0
  violations), impeccable kit-wide 207 files exit 0 (lens re-ran the detector + the
  can-fail probe itself), baseline package ЧАСТЬ v2 (414 PNG; re-takes R-14/R-2/R-2′ =
  16+2), RELEASE.md «Релиз v1.1.0» §8.1–8.7 (tag = MAINTAINER-only; PROOF nothing
  executed: tags = v1.0.0 only, versions 1.0.0, CHANGELOG clean), HANDOFF v2 ✅ 14/14.
  Lens SHIP 0/0/5 (4 citation fixes in-window). Visual proof INHERITED — the range is
  docs-only and `git diff --exit-code -- packages/ tests/` vs aa9780f is CLEAN (the
  8.2-close ×2 1368/1368 stands for the bit-identical served tree).** **v2 COMPLETE —
  14/14 stories (2026-09-25). The repo now waits on the MAINTAINER QUEUE only: (a)
  baseline batch-confirm (ЧАСТЬ v2 of baseline-review-package.md — 140 new + 18
  adjudicated re-takes), (b) release v1.1.0 per RELEASE.md §8.1–8.5 (THE tag — never
  automated), (c) SR spot-checks v2 + iOS momentum-scroll, (d) the stepper brown-token
  decision. Sequencing in
  epics-v2.md; the v1 component-story gate applies VERBATIM (FR-16). Key v2 decisions: delta
  semantics via AA-override (green-300/red-300); warm-cream family DISTINCT from beige (dark
  first-pass [ASSUMPTION] → 8.2); typography registers = mappings (h1 44→heading-2, 36→heading-3),
  zero new type tokens; keyboard defects of the reference (inert arrows, chip focus-drop) are
  IMPROVED per APG — the sanctioned a11y axis
- **Kit totals: 881 unit + 1368 visual/axe tests, 27 components, 27 React wrappers, v1 design
  assumptions all closed (6 v2 dark first-pass [ASSUMPTION]s open BY DESIGN until 8.2), CI green**
- Fonts: DaytonaSans/DaytonaPragma in `packages/tokens/fonts/` under LICENSE-FONTS.md (separately
  licensed, NOT MIT; consumer rights ONLY per that file)
- **Lit on this stack requires `experimentalDecorators: true`** — do not "fix" this
- **HANDOFF.md (root) is the full handoff document** — plan, debts, nuances, governance
- deferred-work.md: revisit-condition entries (axe re-entrancy serialization, mono slot, iOS
  scroll-lock, AD-4 single-source, AA-derivation, fold literals, preview.ts canvas bg)

## Toolchain (installed & configured)

### BMAD Method v6 — planning & delivery loop
- 30 skills in `.claude/skills/bmad*` (agents: Mary-analyst, John-PM, Sally-UX, Winston-architect, Amelia-dev)
- Runtime: `_bmad/` (config.toml, scripts) — never hand-edit `_bmad/scripts`
- Artifacts output: `_bmad-output/` (planning-artifacts/, implementation-artifacts/)
- Say **"bmad help"** when unsure which skill is next
- Maintenance: `npx skills update` (uses skills-lock.json), then "bmad doctor" to repair the runtime
- Requires `uv` (installed ✓)

### impeccable — design quality & anti-slop
- Skill at `.claude/skills/impeccable/` + 4 agents + detector hooks in `.claude/settings.json`
  (every Edit/Write of UI files gets immediate checks; deep pass on Stop — treat findings as blockers)
- **init done:** `PRODUCT.md` exists (schema 1); `buildPath: "code"` in `.impeccable/config.json`
  → build surfaces directly in code (the reference site is the visual bar), no comp images
- `DESIGN.md` does not exist yet — it appears via `/impeccable document` or new-work once real UI exists
- Key commands: `/impeccable craft|audit|polish|critique <target>`

### transitions.dev — UI motion
- Skill with 32 transition references at `.claude/skills/transitions-dev/` + `transitions-polish`
- Vendored at scaffold (Story 1.1); motion values fold into `--tk-motion-*` tokens per AD-9
  (the recipes' `:root`-level selectors never match inside shadow stylesheets)
- All transitions respect `prefers-reduced-motion`; classes namespaced `t-*`

### inspo MCP — real-site design references
- Project-scoped server in `.mcp.json` (hosted https://inspomcp.dev/api/mcp) — **verified operational**
  (live `get_filters` call, 2026-09-24; taxonomy: 19 macrostructures w/ coverage, 11 styles,
  10 component types)
- NOTE: `claude mcp list` may report "⏸ Pending approval" — that is a stale artifact of the non-interactive
  subprocess check. Judge availability by whether `mcp__inspo__*` tools are present in the session
- Use before writing UI: `recommend(brief)`, 1–2 `search_screens`, then `get_screen` on the 3–5 kept
  references; `find_by_color('#hex')` when a brand color is named. Budget: one recommend + a couple of
  searches per study; results are re-read every turn, extra searches cost more than they find
- Optional: `TOGETHER_API_KEY` env unlocks semantic search (never commit secrets)

## Browser automation — playwright-cli ONLY (no browser MCP)

- `playwright-cli` v0.1.21 installed globally + user-level skill; `@playwright/mcp` is deliberately
  **NOT registered** — the CLI covers everything (same snapshot/ref model) and two parallel browser
  stacks cause session/state conflicts. Do not add browser MCP servers
- Per-project session isolation (ALWAYS set before use):
  ```bash
  export PLAYWRIGHT_CLI_SESSION=tinkoff-ui
  playwright-cli open <url> --persistent   # first open persists the profile
  ```
- Reference capture from tinkoff.ru: `screenshot --hires` (full pixel ratio), `find <text|sel>` (grep-like
  snapshot search — keeps huge pages out of context; prefer over full `snapshot` on tinkoff.ru)
- Verification of our axes: `set-color-scheme dark`, `set-reduced-motion`, `set-contrast`, `set-forced-colors`
- Mobile: `open --mobile` or `--device="iPhone 15"`
- E2E (later, after scaffold): `pnpm add -D @playwright/test` → `playwright test`
- Screenshot analysis: this harness is text-only for images — use zai-mcp-server vision tools
  (`mcp__zai-mcp-server__analyze_image` etc.) on saved screenshot files, never describe images from memory

## Design reference workflow (this project)

1. Analyze the reference site (tinkoff.ru) — inspo MCP `recommend()` + playwright-cli capture for tokens
2. Extract design tokens → palette, type scale, spacing, radii, shadows, motion curves
3. Component inventory → rebuild as kit primitives, improve a11y / dark mode / tokens where the original is weak
4. Every component: impeccable `audit` + transitions for interaction states
5. Naming: unofficial study/recreation project — no T-Bank trademark use in published output, no official-status claims

## Conventions

- pnpm only (`pnpm add`, `pnpm dev`); Node >= 20
- Git: `origin` = github.com/salacoste/tinkoff-ui-kit.git, branch `main`; commit messages in English,
  conventional style (chore/docs/feat/fix)
- Don't commit `.claude/settings.local.json`; `.omc/`, `.claude/state/`, `.claude/sessions/` are gitignored runtime state
- `_bmad-output/` drafts are fine to commit once stable
- UI edits trigger impeccable hook feedback — findings are blockers for design work
