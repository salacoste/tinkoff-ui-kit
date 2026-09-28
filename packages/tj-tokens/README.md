# pillkit-tj-tokens

Дизайн-токены ТЖ-под-кита [pillkit](https://github.com/salacoste/tinkoff-ui-kit) —
редакционный язык «Тиньков Журнала»: custom properties `--tj-*` со светлой базой
на `:root` и нативной тёмной темой на `[data-tj-theme="dark"]` (контракт
`auto`/`light`/`dark`). Семейство ТЖ не зависит от банковского кита ни одним
импортом (FR-17) и потребляется отдельно от него.

Статус: скаффолд (story 15.1). Рабочая таблица токенов генерируется из
`ux-designs/ux-tj-kit-2026-09-28/DESIGN.md` вторым входом того же генератора
(story 15.2); сейчас `tokens.css` несёт только маркер
`--tj-scaffold-placeholder`.

> **Неофициальный учебный проект.** pillkit — независимое воссоздание языка
> дизайна в учебных целях; не аффилирован ни с какой компанией и не использует
> чужие товарные знаки в наименовании. Полный дисклеймер — в README репозитория.

## Установка

Дистрибуция — только через [GitHub-репозиторий](https://github.com/salacoste/tinkoff-ui-kit),
в npm пакеты не публикуются. Рецепт workspace-линка — в README репозитория
(«Быстрый старт»): клонировать репо (пин релизного тега), добавить его
`packages/*` в свой `pnpm-workspace.yaml`, собрать, затем — только семейство ТЖ:

```bash
pnpm add -w pillkit-tj-tokens --workspace
```

## Использование

```ts
import 'pillkit-tj-tokens/tokens.css';
```

Тёмная тема — атрибутом на корне приложения: `<html data-tj-theme="dark">`
(или `auto` — следует системной схеме).

## Лицензия

[MIT](https://github.com/salacoste/tinkoff-ui-kit/blob/main/LICENSE) © 2026
salacoste.
