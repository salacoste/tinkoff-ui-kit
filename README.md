# tinkoff-ui-kit

[![CI](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml)

CI проверяет каждый push/PR полной цепочкой: `lint` → `typecheck` → `build` →
`test` (unit + gen/tokens drift + zero-hardcoded + import boundaries + preview +
contrast) → `test:visual` (режим сравнения с закоммиченными кроссплатформенными
baseline, axe в обеих темах) → impeccable design-детектор по изменённым UI-файлам;
визуальные диффы при падении выгружаются как артефакты.

UI kit на основе дизайн-языка Тинькофф (Т-Банка) — воссоздание, систематизация и улучшение.

Учебный проект: существующий сайт берётся как дизайн-референс, из него извлекается
дизайн-система (цвета, типографика, отступы, компоненты), и она пересобирается в
настоящий UI kit, улучшающий оригинал.

> **Неофициальный учебный проект.** pillkit (tinkoff-ui-kit) — независимое воссоздание
> дизайн-языка Тинькофф (Т-Банка) исключительно в учебных целях. Проект не аффилирован
> с Т-Банком / ТКС Холдинг, не одобрен ими и никак с ними не связан; товарные знаки
> Т-Банка в публикуемом результате не используются, а сайт-референс служит только
> источником дизайн-эталона.

**Статус:** в разработке — pnpm-воркспейс (`packages/{tokens,components,react,docs}`)
разворачивается на стеке architecture-spine (TypeScript 7 strict, Vite lib mode, Lit 3
ядро с React-адаптерами, Vitest); система токенов и компоненты — следующими (Epic 1).

## Воркспейс

| Пакет | Роль |
|---|---|
| `pillkit-tokens` | Дизайн-токены — слои custom properties `--tk-*` (Story 1.2) |
| `pillkit-components` | Ядро на Lit custom elements (Story 1.7+) |
| `pillkit-react` | React-обёртки, генерируемые из Custom Elements Manifest (Story 1.7+) |
| `pillkit-docs` | Документация — Storybook-скелет (Story 1.5) |
| `tests/` | Закоммиченные гарантии import-boundary + build-isolation для матрицы AD-4 (запускаются в `pnpm test`) |
| `transitions/` | Вендорные рецепты transitions.dev (сырые `t-*.css` + `_root.css`) — источник моушна для Story 1.2 |

```bash
pnpm install && pnpm build && pnpm test   # зелёный baseline
pnpm lint                                 # typescript-eslint + AD-4 import boundaries
pnpm typecheck                            # TS 7 по корневым поверхностям (tests/, конфиги)
```

pnpm 12.5.1 arrives via the `packageManager` field + corepack — a machine with a local
pnpm 11.x needs no manual upgrade. `pnpm-lock.yaml` is intentionally a two-document
YAML stream written by pnpm 12; do not "clean" it into a single document.

## Инструменты

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

Workflows и команды — в `CLAUDE.md`.
