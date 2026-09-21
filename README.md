# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — recreated, systematized and improved.

An internal study project: we take the existing site as the design reference, extract its
design system (colors, typography, spacing, components), rebuild it as a proper UI kit,
and improve on the original.

> **Unofficial study project.** tinkoff-ui-kit is an independent recreation of the
> Tinkoff (T-Bank) design language, built for study purposes only. It is not affiliated
> with, endorsed by, or connected to T-Bank / TCS Holding. No T-Bank trademarks are used
> in the published output, and the reference site serves purely as a design reference.

**Status:** in development — the pnpm workspace (`packages/{tokens,components,react,docs}`)
is scaffolded on the architecture-spine stack (TypeScript 7 strict, Vite lib mode, Lit 3
core with React adapters, Vitest); the token system and components land next (Epic 1).

## Workspace

| Package | Role |
|---|---|
| `@tk-kit/tokens` | Design tokens — `--tk-*` custom property layers (Story 1.2) |
| `@tk-kit/components` | Lit custom elements core (Story 1.7+) |
| `@tk-kit/react` | React wrappers generated from the Custom Elements Manifest (Story 1.7+) |
| `@tk-kit/docs` | Docs surface — Storybook skeleton (Story 1.5) |
| `tests/` | Committed import-boundary + build-isolation guards for the AD-4 matrix (run in `pnpm test`) |
| `transitions/` | Vendored transitions.dev recipes (raw `t-*.css` + `_root.css`) — motion source for Story 1.2 |

```bash
pnpm install && pnpm build && pnpm test   # green baseline
pnpm lint                                 # typescript-eslint + AD-4 import boundaries
pnpm typecheck                            # TS 7 over root surfaces (tests/, config files)
```

pnpm 12.5.1 arrives via the `packageManager` field + corepack — a machine with a local
pnpm 11.x needs no manual upgrade. `pnpm-lock.yaml` is intentionally a two-document
YAML stream written by pnpm 12; do not "clean" it into a single document.

## Toolchain

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

See `CLAUDE.md` for workflows and commands.
