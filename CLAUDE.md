# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — **copy the existing site, systematize, and improve**.
Study project: the reference site (tinkoff.ru) is the design source of truth; we extract its design system
(colors, typography, spacing, components, motion) and rebuild it as a proper, improved UI kit.

**Stack: chosen by BMAD architecture (d1bfa05) — core-and-adapters.** Lit 3.3.3 core (shadow DOM,
`--tk-*` token pipeline) in `packages/components`; React 19 wrapper package generated from CEM
(`@lit/react`); pnpm workspace `pillkit-{tokens,components,react,docs}`; TS 7 strict, Vite 8, Vitest,
Playwright visual/axe harness. Planning artifacts (PRD/UX/architecture/epics) live in `_bmad-output/planning-artifacts/`.

## Project state (updated 2026-09-23 — v1 BUILD COMPLETE, maintainer-gate mode)

- **BMAD v1 plan FULLY EXECUTED: all 38 stories / 5 epics / 19 components** (commits 19b12a6 → 320232c).
  Epics 1–4 built the kit (tokens, forms+API freeze, navigation/cards/homepage, overlays); Epic 5
  verified and prepared release: a11y sweeps (114-cell ledgers + permanent reduced-motion/ring/
  theme-branch CI guards), dark sweep (4 real bugs fixed; tint assumptions closed), docs completion
  (generated token reference, theming guide, verified quickstart), fidelity+discipline closure
  (xxl radius corrected 32→24 by probe; yellow audit; ZERO [ASSUMPTION] flags remain), publish prep
  (MIT + fonts/transitions carve-outs, per-package LICENSEs, CHANGELOG, SM-6 self-test PASSED,
  RELEASE.md maintainer checklist)
- **Totals: 644 unit + 921 visual/axe tests, 274 baselines, 19 React wrappers, CI green**
- Packages `pillkit-{tokens,components,react,docs}`: `private: true` everywhere, 0 tags, npm untouched
- **The project now waits on MAINTAINER GATES ONLY — entry point `RELEASE.md`**: baseline batch
  confirm/re-take (`_bmad-output/implementation-artifacts/baseline-review-package.md`), SR spot-checks
  (VoiceOver+NVDA protocols in the 19 stories), §0 ratifications (bounce-easing ignore, tokens
  license field, transitions redistribution, version — 1.0.0-rc.1 recommended), then private-flip →
  tag → publish
- Fonts: DaytonaSans/DaytonaPragma in `packages/tokens/fonts/` under LICENSE-FONTS.md (separately
  licensed, NOT MIT; consumer rights ONLY per that file)
- **Lit on this stack requires `experimentalDecorators: true`** — do not "fix" this
- deferred-work.md: 6 entries with revisit conditions (fold literals, AD-4 single-source,
  AA-derivation, mono slot, iOS scroll-lock, SR execution)

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
