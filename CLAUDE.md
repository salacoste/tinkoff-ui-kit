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
  PARALLEL-TRACK RULE (paid for 2026-09-24): the visual harness's webServer port 6007 is
  machine-global — NEVER run two `pnpm test:visual` concurrently (worktrees/agents); kill
  stray 6007 servers before gate rounds (see deferred-work.md). **Story 7.1 DONE (736191e +
  truing b068bb8, merged 0ec0790, spec-7-1 closed):** tk-navbar extended in place with the
  optional 64px sub-nav row (subLinks/subActiveValue/subLabel; two named nav landmarks;
  sub-nav desktop-only; v1 byte-stability pinned) — TRUING corrected two frozen premises
  (row-2 active HAS a 2px underline + inter-row 1px divider; Spec Change Log), 784 unit +
  visual 1065/1065 ×2, verify evidence in `.playwright-cli/verify/mega-nav/`. **6.4 DONE
  (e06e844, spec pending lens-close): tk-data-table — typographic row-as-link catalog, APG
  keyboard layer, §9 delta-on-hover row. 7.2 DONE (773f53d worktree → merge 0f1592d → gate-fix
  9086551, spec-7-2 closed): tk-cookie-banner — non-modal consent dialog, consent-choice bare
  verb, 12 baselines, merged visual 1145/1145 ×1 (axe co-driver debt FIXED in the same window:
  tests/visual/axe-serialize.ts chain + busy-retry).** **IN FLIGHT: 6.5 (stocks-catalog
  showcase composition, executor on main, spec b558fd6) + 7.3 (stepper/store-badges/qr-block
  trio, executor in worktree)** — sequencing in
  epics-v2.md; the v1 component-story gate applies VERBATIM (FR-16). Key v2 decisions: delta
  semantics via AA-override (green-300/red-300); warm-cream family DISTINCT from beige (dark
  first-pass [ASSUMPTION] → 8.2); typography registers = mappings (h1 44→heading-2, 36→heading-3),
  zero new type tokens; keyboard defects of the reference (inert arrows, chip focus-drop) are
  IMPROVED per APG — the sanctioned a11y axis
- **Kit totals: 833 unit + 1145 visual/axe tests, 24 components, 24 React wrappers, v1 design
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
