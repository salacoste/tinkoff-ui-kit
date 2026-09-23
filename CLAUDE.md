# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — **copy the existing site, systematize, and improve**.
Study project: the reference site (tinkoff.ru) is the design source of truth; we extract its design system
(colors, typography, spacing, components, motion) and rebuild it as a proper, improved UI kit.

**Stack: chosen by BMAD architecture (d1bfa05) — core-and-adapters.** Lit 3.3.3 core (shadow DOM,
`--tk-*` token pipeline) in `packages/components`; React 19 wrapper package generated from CEM
(`@lit/react`); pnpm workspace `pillkit-{tokens,components,react,docs}`; TS 7 strict, Vite 8, Vitest,
Playwright visual/axe harness. Planning artifacts (PRD/UX/architecture/epics) live in `_bmad-output/planning-artifacts/`.

## Project state (updated 2026-09-23 — autonomous build run)

- **BMAD chain complete through epics; EPICS 1–4 FULLY BUILT — ALL 19 v1 COMPONENTS SHIPPED**
  (commits 19b12a6 → fb8980c). Epic 1 foundation (scaffold, tokens light 131 + dark 17 semantic
  overrides, CONVENTIONS.md, Storybook 10.6 docs, Playwright visual harness, tk-button pilot,
  CI green) · Epic 2 forms + API FREEZE (Input 2.1 froze §4/§9; overlay controller 2.2; Select/
  Checkbox/SegmentedRadio/ThumbnailPicker/ProgressBar; composed-form walkthrough) · Epic 3
  navigation/cards/homepage (Link, Badge, Tabs, Navbar+burger drawer, Footer, 4 cards, homepage
  composition + UX-DR14 matrix; mint/beige tint closures) · Epic 4 overlays (tk-modal, tk-tooltip,
  tk-toast + showToast; UJ-3 Toast leg closed; popover-UA-reset lesson hit twice — scrim AND toast host)
- **Kit totals: 604 unit tests + 472 visual/axe baselines ×2 + walkthrough 31/31; 19 React wrappers**
- Packages: `pillkit-{tokens,components,react,docs}` (npm names resolved at OQ-3, verified free; still
  `private: true` until first publish). The `tk-` element prefix and `--tk-*` properties are KEPT
  (OQ-3 decision — generic abbreviation, zero trademark collision).
  Scripts: `pnpm build|test|lint|typecheck|gen|check:gen|test:visual|test:visual:update|check:tokens-drift`
- **Lit on this stack requires `experimentalDecorators: true`** (vite8/rolldown drops TC39
  decorators silently) — do not "fix" this
- Fonts: DaytonaSans (400/500/600) + DaytonaPragma (400/500/700) bundled in `packages/tokens/fonts/`
  under LICENSE-FONTS.md (separately licensed, NOT MIT) — topic fully closed
- Next per epics.md: **Epic 5 release readiness** — 5.1–5.3 a11y sweeps (method + 3 groups,
  VoiceOver+NVDA), 5.4 dark sweep + dark-tint refinement, 5.5 docs completion (token reference,
  theming guide, getting-started, RU), 5.6 fidelity+discipline verification (16/16+3/3, kit-wide
  impeccable, yellow-discipline audit, maintainer PROVISIONAL baseline batch gate), 5.7 publish
  (MAINTAINER GATE: MIT/semver/changelog/disclaimer; pillkit-* names stand)
- Maintainer queue: ratify bounce-easing detector ignore, batch-confirm provisional baselines (5.6);
  deferred-work.md tracks the rest (LICENSE file, AD-4 single-source, react peer range, mono font
  slot, iOS real-device scroll-lock, fallback-path projection limitation)

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
  (live `get_filters` call, 2026-09-21)
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
