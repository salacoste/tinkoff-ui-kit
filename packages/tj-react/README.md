# pillkit-tj-react

React 19 адаптеры ТЖ-под-кита [pillkit](https://github.com/salacoste/tinkoff-ui-kit) —
обёртки для `tj-*` элементами `pillkit-tj-components`, генерируемые из его
Custom Elements Manifest (`@lit/react`). Обработчики событий получают
распакованный `detail` вместо сырого `CustomEvent`. Регенерация — `pnpm gen`
из корня репозитория (механизм один, входов два — AD-1/AD-3 v5).

Статус: первые обёртки (story 16.1) — `Prose`, `Link`, `Cta` из манифеста
примитивов чтения; реестр событий ПУСТ по фризу (stateless-поверхности ничего
не диспатчат — запись в `src/event-map.ts`), первая stateful-поверхность
(16.4+) дополнит его. Семейство ТЖ не зависит от банковского кита (FR-17) и
ставится отдельно от него.

> **Неофициальный учебный проект.** pillkit — независимое воссоздание языка
> дизайна в учебных целях; не аффилирован ни с какой компанией и не использует
> чужие товарные знаки в наименовании. Полный дисклеймер — в README репозитория.

## Установка

Дистрибуция — только через [GitHub-репозиторий](https://github.com/salacoste/tinkoff-ui-kit),
в npm пакеты не публикуются. Рецепт workspace-линка — в README репозитория
(«Быстрый старт»), затем — только семейство ТЖ:

```bash
pnpm add -w pillkit-tj-react pillkit-tj-components pillkit-tj-tokens --workspace
pnpm add -w react@^19 react-dom@^19
```

Peer-зависимость: React 19.x.

## Использование

```tsx
import 'pillkit-tj-tokens/tokens.css';
import 'pillkit-tj-components'; // регистрирует tj-prose / tj-link / tj-cta
import { Prose } from 'pillkit-tj-react'; // Prose / Link / Cta — из ТЖ CEM
```

## Лицензия

[MIT](https://github.com/salacoste/tinkoff-ui-kit/blob/main/LICENSE) © 2026
salacoste.
