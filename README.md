# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — recreated, systematized and improved.

An internal study project: we take the existing site as the design reference, extract its
design system (colors, typography, spacing, components), rebuild it as a proper UI kit,
and improve on the original.

## Toolchain

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

See `CLAUDE.md` for workflows and commands.
