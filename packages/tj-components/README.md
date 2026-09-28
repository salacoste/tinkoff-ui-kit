# pillkit-tj-components

Ядро ТЖ-под-кита [pillkit](https://github.com/salacoste/tinkoff-ui-kit) на Lit
custom elements: редакционные компоненты `tj-*` (статьи, рубрики, ленты) в
Shadow DOM, темизация через `--tj-*`. Семейство ТЖ не импортирует банковские
пакеты — и наоборот (FR-17); docs-пакет репозитория собирает оба семейства и
только он.

Статус: скаффолд (story 15.1). Компоненты — эпик 16: `tj-prose`, `tj-link`,
`tj-cta` (16.1, фриз API-грамматики), затем рубрики/ленты/хром. API-грамматика
наследует `CONVENTIONS.md` этого пакета (§4/§9 банковского кита с ТЖ-неймингом).

> **Неофициальный учебный проект.** pillkit — независимое воссоздание языка
> дизайна в учебных целях; не аффилирован ни с какой компанией и не использует
> чужие товарные знаки в наименовании. Полный дисклеймер — в README репозитория.

## Установка

Дистрибуция — только через [GitHub-репозиторий](https://github.com/salacoste/tinkoff-ui-kit),
в npm пакеты не публикуются. Рецепт workspace-линка — в README репозитория
(«Быстрый старт»), затем — только семейство ТЖ:

```bash
pnpm add -w pillkit-tj-components pillkit-tj-tokens --workspace
```

## Использование

```ts
import 'pillkit-tj-tokens/tokens.css';
import 'pillkit-tj-components'; // регистрирует tj-* элементы (с эпика 16)
```

## Лицензия

[MIT](https://github.com/salacoste/tinkoff-ui-kit/blob/main/LICENSE) © 2026
salacoste.
