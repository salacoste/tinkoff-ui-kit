# Flow-B §14.4 — v1.7.0 fresh-clone verification (RELEASE.md §14.4)

**Исполнено 2026-10-04, раунд-1 = единственный, 26/26 ног PASS, дефектов НЕТ.**
Санкция: «tag ok» получена явным выбором мейнтейнера в интерактивном Q&A этого
окна (вопрос «Ставим тег v1.7.0 сейчас?», ответ «Да — "tag ok"»).

## 1. Тег и клон

- Тег: аннотированный `v1.7.0` на релизной голове `89a20da` (HEAD релиза =
  штамп-коммит prep-цикла; CI run 37190043724 = success на момент тега;
  дерево чисто; zero-in-flight). Tag-объект `ce427667f78edff7a35941064c52b945afc6351c`.
- Пуш: `git push origin v1.7.0` → CI НЕ триггернул (workflow: push branches
  [main] only; проверено `gh run list` через 20 с — новых ранов нет).
  Verdict-обязательство переходит на последующий docs-коммит (штампы).
- Remote deref сверен ДО клона: `refs/tags/v1.7.0` → `ce427667`,
  `^{}` → `89a20da` — локально и на remote байт-в-байт.
- Клон: `git clone --depth 1 --branch v1.7.0 file://<kit>` — локальный
  file-транспорт, честное отклонение по прецеденту §12.4/§13.4
  (идентичность дерева гарантирует tag-объект). `CLONED_AT=89a20da…`,
  `git describe --tags --exact-match` = `v1.7.0`.

## 2. Consumer-сборка (рецепт §13.4 дословно)

- `pnpm install --prefer-offline` в клоне: **1.3 с** (pnpm 12.5.1;
  `--prefer-offline` — транспорт-урок §13.4: наивный add висел >100 мин).
- `pnpm build`: exit 0, ~7.5 с (все пакеты + Storybook docs).
- `my-app`: `pnpm init` → devEngines-блок снят ПО КЛЮЧУ через node
  (урок §10.4: perl-regex по хвосту ломает JSON) → workspace-yaml
  (`., ../tinkoff-ui-kit/packages/*`) → `pnpm add -w --prefer-offline`
  тройки + react 19.3.0 + vite: 274–425 мс на пакет (в my-app резолвился
  pnpm v11.20.0 — окружение без пина; наблюдение, не блокер).
- **Census:** `node_modules` my-app = РОВНО `pillkit-{tokens,components,react}`
  @1.7.0; в дереве клона все СЕМЬ пакетов @1.7.0 (bank ×3 + ТЖ ×3 + tj-fonts).
- Прод-билд vite: exit 0, 335 мс, чанк 585.20 кБ (gzip 164.86) — рост с
  563 кБ v1.6.0 = новые компоненты; предупреждение о размере — информационное.

## 3. Проба (26 ног, probe.mjs; round-1 финальный прогон)

- **tk-chart raw** (tone=bond, badge, reference=20 000 000, 5 точек
  миллионного масштаба): host `role="img"` self-asserted; derived aria-label
  `«График, 5 точек, последнее значение 20 235 500,5»` — NBSP-группировка +
  RU-запятая; `tone` reflected; SVG = area+line paths, quiet grid 3 inner
  линии, dashed reference внутри домена; **градиентные стопы резолвятся
  байт-в-байт: stop-a `rgb(0,158,77)` = #009E4D, stop-b `rgb(0,129,62)` =
  #00813E** (токены 22.5); Y-ось `["20,4 млн","20,2 млн","20 млн","19,8
  млн","19,6 млн"]` — тыс./млн-аббревиатуры одной конвенцией; badge =
  `20 235 500,5` (полная точность); X-метки из данных.
- **tk-breadcrumb raw**: nav[aria-label="Хлебные крошки"] > ol > 3 li;
  2 якоря с href из данных; шевроны ×2 aria-hidden; терминал =
  span aria-current="page", НЕ якорник.
- **tk-figure raw**: img получил `loading=lazy` + `decoding=async`
  (lazy-энфорсмент); аспект-бокс 1.778 = 16/9; figcaption по caption-prop.
- **React-обёртки** (`Chart`/`Breadcrumb`/`Figure`): пропсы ПЕРЕЖИВАЮТ
  создание элемента (закон React 19/v1.5.0) — points/tone/badge, items,
  caption + slotted media у обёрток рендерят идентично raw.
- **Dark:** `<html data-theme="dark">` → `--tk-color-surface-base` = `#1a1a1a`.
- **Консоль: 0 ошибок** (console.error + pageerror).
- Скриншоты: `light-full.png` / `dark-full.png` (900px, full page).

## 4. Пиксельное подтверждение (ImageMagick, light-full.png)

Гистограмма: bond-интерьер `#009548` (0,149,72 — бакет между стопами),
правый тёмный край `#00823E` (0,130,62 ≈ токен #00813E), stock-семейство
чарта-обёртки `#298809`/`#2C920A`/`#267D08` (series line = жёлто-зелёный
stock-b), плейсхолдер фигуры `#E5E5E5`, текст `#333333`. Оба тон-семейства
красят в проде.

## 5. Probe-уроки (все промежуточные FAIL — баги пробы, не продукта)

1. **`createRoot().render()` конкурентен:** raw-присваивания данных на дне
   main.tsx исполняются ДО коммита React-дерева → getElementById = null,
   модуль умирает, данные не доезжают. Фикс: rAF-поллинг готовности узлов.
   (Продукт не тронут — это рецептовая гонка LIVE-стороны, не кита.)
2. **`const URL = argv` затеняет глобал** → «URL is not a constructor» в
   ESM-скрипте. Переименован в PAGE_URL.
3. **Custom property сериализуется hex** (`#1a1a1a`, не `rgb(26,26,26)`) —
   проба обязана принимать обе формы.
4. **Докстринговая опечатка стопа:** chart.ts/chart.css.ts каменты говорят
   «(0,128,62)», канонический токен `#00813E` = **(0,129,62)**; краска
   байт-в-байт по токену (подтверждено computed + пикселями). Опечатка
   комментария вычищается отдельным микро-коммитом.
