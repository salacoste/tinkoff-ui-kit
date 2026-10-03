# Flow-B v1.6.0 — свежий потребитель по тегу (release gate §13.4)

- **Дата:** 2026-10-03 (тег поставлен 2026-10-02 по санкции «tag ok»)
- **Тег:** `v1.6.0` — tag-объект `64cbe75c`, deref `a283e3d` (штамп-голова
  релиза; remote сверен `git ls-remote` ДО клона: `64cbe75c` / `^{}` →
  `a283e3d`). Теговый пуш CI не триггернул (workflow push branches [main]
  only — проверено `gh run list`).
- **Клон:** локальный по тегу (file-транспорт; прецедент §12.4 v1.5.0 —
  честное отклонение от буквы «git clone URL»). Census на теговых битах:
  **ровно семёрка @1.6.0** (tokens/components/react + tj ×3 + tj-fonts).

## Приложение-потребитель (README-рецепт дословно)

`pnpm init` → удаление `devEngines`-блока (ловушка pnpm v12, README) →
`pnpm-workspace.yaml` с `../kit/packages/*` → `pnpm install && pnpm build`
кита → `pnpm add -w pillkit-tokens pillkit-components pillkit-react
--workspace` → `react@19.3.0` + `react-dom@19.3.0` → vite. Конфиг:
`resolve.dedupe: ['react','react-dom']` (урок v1.1.0) — обязателен.

**Транспорт-урок окна:** `pnpm add react react-dom` БЕЗ флага висел >100 мин
(процесс жив, 0.74 CPU-сек, node_modules пуст) — реестр встал. `--prefer-offline`
(собственный README-рецепт, стор локален) поставил оба пакета за **318 мс**
и vite за **413 мс**. Метод: при медленном реестре оффлайн-стор — первый ход,
не ожидание.

Прод-билд: `vite build` — **638 мс, exit 0** (чанк 563 кБ: весь индекс кита
`import 'pillkit-components'` + react + обёртки; предупреждение о размере —
информационное). Прогон probe — по PREVIEW (прод-биты).

## Гейтовые ноги — 15/15 PASS (раунд 1 = единственный, дефектов НЕТ)

| # | Нога | Пруф |
|---|---|---|
| 1 | raw hero upgraded | shadow-дерево отрисовано |
| 2 | tone reflect | host `tone="stock"` |
| 3 | анатомия hero | name «Северсталь», ticker «CHMF» |
| 4 | metric-блок | label «Изменение за день» + slot «+1,24%» |
| 5 | action-слот | слот-кнопка ★ видима |
| 6 | slotted h2 override | `h2 slot="name"` виден И assigned (AC3 heading-семантика) |
| 7 | metric slot-presence | hero без слота рендерит блок? НЕТ (правило присутствия) |
| 8 | invest-стопы | градиент на `:host` = linear-gradient(90deg, #2e970a, #257a08) — стоп-токены резолвятся |
| 9 | анатомия ticket | label/value/note слоты присвоены («Купить по цене»/«277,65 ₽»/ИИР-приписка) |
| 10 | CTA-пара | `.button::before` = **rgb(255,221,45)** — жёлтая primary-пара |
| 11 | React hero props | tone light + name «Т-Технологии» + metric «-0,82%» — ПРОПСЫ ПЕРЕЖИВАЮТ создание элемента (закон React 19 / v1.5.0) |
| 12 | React hero второй | tone dark, без metric |
| 13 | React ticket | variant=ticket, label «Продать по цене», value «23 035,00 ₽» |
| 14 | консоль | ноль errors/warnings |
| 15 | dark remap | `--tk-color-surface-base` на :root — `#fff` → `#1a1a1a` (селектор `:root[data-theme=dark]`) |

Скриншоты обеих тем: `flow-b-light.png` / `flow-b-dark.png`.

## Probe-раунды (честно): 10/15 → 12/15 → 14/15 → 15/15

Все 5+2+1 промежуточных провалов — **probe-баги, ноль продуктовых**:
- угаданные имена классов (`.hero__metric` vs реальная тройка
  `.hero__metric/-label/-value`);
- `slot.textContent` СЛЕП к assigned-узлам (слот-контент живёт в light DOM) —
  читать `assignedNodes({flatten:true})`;
- краска слоями: primary-кнопка красит `.button::before`, identity-градиент
  живёт на `:host` — замер хоста/элемента мимо псевдо-слоя даёт «прозрачно»;
- тема: мерить токен с `:root` (remap `#fff`→`#1a1a1a`), а не хост-элемент.

Метод-урок (в копилку v1.5.0): в Flow-B не угадывать селекторы — сначала
дамп shadow-дерева (список классов + computed по всем узлам), потом ноги.

## Вердикт

**ГЕЙТ ПРОЙДЕН 15/15, тег v1.6.0 валиден.** Дефектов уровня v1.5.0-раунд-1
(React-19 закон конструктора) нет — фикс `c7fe548` живёт в каждом аттоме
(роли/атрибуты в connectedCallback), пропсы и слоты переживают React-19
создание элемента на обоих новых атомах.
