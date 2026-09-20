# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — **copy the existing site, systematize, and improve**.
Study project: the reference site is the design source of truth; we extract its design system
(colors, typography, spacing, components, motion) and rebuild it as a proper, improved UI kit.

**Stack: NOT chosen yet** — decide via BMAD planning (`bmad-architecture`), don't invent one ad hoc.
Package manager is **pnpm**. Node >= 20.

## Toolchain (installed & configured)

### BMAD Method v6 — planning & delivery loop
- 30 skills in `.claude/skills/bmad*` (agents: Mary-analyst, John-PM, Sally-UX, Winston-architect, Amelia-dev)
- Runtime: `_bmad/` (config.toml, scripts) — never hand-edit `_bmad/scripts`
- Artifacts output: `_bmad-output/` (planning-artifacts/, implementation-artifacts/)
- Typical flow for this project: `bmad-product-brief` → `bmad-prd` → `bmad-ux` → `bmad-architecture` → `bmad-create-epics-and-stories` → `bmad-build`
- Say **"bmad help"** when unsure which skill is next
- Maintenance: `npx skills update` (skills-lock.json), then "bmad doctor" to repair runtime
- Requires `uv` (installed ✓)

### impeccable — design quality & anti-slop
- Skill at `.claude/skills/impeccable/` + 4 agents + hooks in `.claude/settings.json`
  (detector runs on every Edit/Write of UI files and a deep pass on Stop — read its findings, don't ignore)
- **First run in chat: `/impeccable init`** → writes PRODUCT.md (product context) — not done yet
- Visual direction goes in DESIGN.md via `/impeccable document`
- Key commands: `/impeccable craft|audit|polish|critique <target>`
- Config: `.impeccable/config.json` (committed); ephemeral output is gitignored

### transitions.dev — UI motion
- Skill with 32 transition references at `.claude/skills/transitions-dev/` + `transitions-polish`
- Add transitions once src/ exists: `npx transitions-dev add --free` (or per-name, e.g. `add modal`)
- All transitions respect `prefers-reduced-motion`; classes namespaced `t-*`

### inspo MCP — real-site design references
- Project-scoped server in `.mcp.json` (hosted: https://inspomcp.dev/api/mcp), tools are read-only
- Use before writing UI: `recommend(brief)` composes references, palettes, fonts, per-site DESIGN.md autopsies
- Optional: `TOGETHER_API_KEY` env unlocks semantic search (don't commit secrets)

## Design reference workflow (this project)

1. Analyze the reference site (tinkoff.ru) — inspo MCP `recommend()` + direct inspection for tokens
2. Extract design tokens → palette, type scale, spacing, radii, shadows, motion curves
3. Component inventory → rebuild as kit primitives, improve a11y / dark mode / tokens where the original is weak
4. Every component: impeccable `audit` + transitions for interaction states
5. Naming: this is a study/recreation project, not an official T-Bank product — no trademark use in published output

## Conventions

- pnpm only (`pnpm add`, `pnpm dev`)
- Playwright (via `playwright-cli`) is the only browser automation tool
- Don't commit `.claude/settings.local.json`, `_bmad-output/` drafts are fine to commit once stable
- UI edits trigger impeccable hook feedback — treat findings as blockers for design work
