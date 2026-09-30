# v1.4.0 fresh-consumer gate — Flow-A ТЖ-ALONE (RELEASE.md §11.4)

**Дата:** 2026-09-30. **Исполнитель:** оркестратор, по явной санкции
мейнтейнера («1 - confirm and validate CI CD statuses, 2 - new tag ok,
3 - continue»). **Вердикт: PASS 3/3 ноги.**

## Порядок гейта (исполнено)

1. **CI-валидация ДО тега (только API-вердикты `gh run`):** все четыре
   головы окна GREEN — 36623061743 (`d02a483`), 36626757077 (`63bba27`),
   36631204306 (`d039d2d`), 36634633196 (`6510262`); in-flight = 0;
   local == remote == `6510262`. Два негрина в списке — исторические,
   объяснённые (202beb1 RED axe-раунд → закрыт d02a483; 58d979e
   timeout-cancel → потолок 60).
2. **Тег v1.4.0 (§11.3, санкция дана):** аннотированный, на `6510262`
   (close-out голова), tag-объект `0e620018`; запушен; remote сверен
   `git ls-remote --tags` с deref (`refs/tags/v1.4.0^{}` = `6510262f…`).
   Теговый пуш CI не триггерит (workflow: push branches [main] only).
   Batch-confirm ЧАСТЬ v1.4.0 отдельным присестом НЕ проводился — тег
   санкционирован мейнтейнером напрямую; пункт остаётся в очереди как
   оппортунистический ретроспективный.
3. **Fresh-consumer Flow-A** (ниже).

## Отклонение от буквы §11.4, записанное честно

Клон исполнен **ЛОКАЛЬНО** (`git clone --branch v1.4.0 <repo-path>`),
не по https: сетевой клон PNG-тяжёлого репо полз ~2.5 МБ/мин (убит на
24 МБ за ~9 мин; GitHub-транспорт в этом окне деградирован — push/ls-remote
проходили, bulk-пак нет). Идентичность дерева гарантирует tag-объект
(`v1.4.0` → `6510262`), чьё присутствие на remote проверено deref-сверкой
ДО выбора локального клона. Checkout по тегу: detached HEAD на `6510262`,
`git describe --tags --exact-match` = `v1.4.0`. Транспорт GitHub остаётся
непроверенным этим гейтом — единственное, что не покрыто отклонением.

## Потребитель (copy-run, §11.4/getting-started/README-зеркало)

- `pnpm init` + `pnpm-workspace.yaml` (`packages: [., ../tinkoff-ui-kit/packages/*]`).
- Кит по тегу: `pnpm install && pnpm build` — чисто (Docs/Storybook включённо).
- **Ловушка devEngines повторилась с новой стороны:** pnpm v12 `init`
  пишет `devEngines.packageManager.version: "^11.20.0"` — caret-спека,
  которую `pnpm add` сам отвергает («expected a semver version»). §10.4
  ловил perl-ломку этого блока; теперь блок приходит сломанным из
  `init`. Фикс по ключу (node, JSON-безопасно) — РЕЦЕПТ §11.4/README
  ЗАСЛУЖИВАЕТ ПРИМЕЧАНИЯ (кандидат в README «Быстрый старт»).
- Реестр-пакеты ставились `--prefer-offline` (общий стор машины; 340 мс
  / 399 мс против зависания на сетевой резолюции).
- **Census `node_modules`: РОВНО `pillkit-tj-{tokens,components,react}`
  @1.4.0 — банковских пакетов НЕТ** (FR-17 с потребительской стороны).
- Файлы приложения: `index.html` (charset utf-8, `tj-cta` как элемент +
  `#root`), `vite.config.ts` (dedupe-трёхстрочник до-словно),
  `main.ts` (`pillkit-tj-tokens/tokens.css` + `pillkit-tj-components` +
  обёртка `Cta` из `pillkit-tj-react`, React 19.3.0).
- `vite build` (8.3.1): 34 модуля, токеновый лист 4.43 kB в бандле,
  ноль ошибок, «Invalid hook call» нет.

## Ноги гейта (playwright chromium, viewport 900×420)

| Нога | ОС-схема | Атрибут | `--tj-color-page` | CTA fill / текст | Вердикт |
|---|---|---|---|---|---|
| L1 авто | light | — | `#f0f0f0` | `#333` / белый | PASS |
| L2 форс | light | `data-tj-theme="dark"` | `#12151c` | `#f5f5f9` / чёрный | PASS |
| L3 override | **dark** | `data-tj-theme="light"` | `#f0f0f0` | light-пара | PASS |

- Рендер на КАЖДОЙ ноге: 2 CTA — raw-element «Как элемент» (href
  пробрасывается) + React-обёртка «Через React-обёртку»; консоль — ноль
  ошибок на всех трёх.
- **L3 — стержневая:** нативный `prefers-color-scheme: dark` эмулирован,
  override `light` удержал light-слой — guard `:not([data-tj-theme="light"])`
  работает (dual-emit контракт 15.2 подтверждён у свежего потребителя).
- Первый прогон «fail» — ТОЛЬКО формат ассерта: кастомные свойства
  возвращаются как объявлены (`#f0f0f0`), не rgb(); ожидания
  нормализованы, продуктовых дефектов ноль.

## Артефакты

`L{1,2,3}-{auto-light,forced-dark,override-light}.png` (страница) +
`…-cta.png` (элемент) — 6 PNG, плюс этот NOTES.md.

## Остаток очереди мейнтейнера (HANDOFF §4)

Пункт (b) «релиз v1.4.0» закрыт этим окном: тег + Flow-A (эти пруфы).
Осталось: (a) batch-confirm ЧАСТЬ v1.4.0 — оппортунистический
ретроспективный (тег санкционирован напрямую, минуя его); (c)
SR-RUNSHEET-v1.4.0 живой VoiceOver (механизуемая computed-половина —
проба по прецеденту sr-v130-probe.mjs); (d) Graphik/Charter; (e)
header-chip 36px FLAG; (f) iOS momentum-scroll + admin open-state
спот-чеки.
