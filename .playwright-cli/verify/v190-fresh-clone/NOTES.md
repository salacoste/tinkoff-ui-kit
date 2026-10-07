# v1.9.0 Flow-B fresh-consumer gate — NOTES (RELEASE.md §16.4)

Дата: 2026-10-06→07. Гейт релиза v1.9.0: свежий клон по тегу → банковская
тройка → tk-spinner + события фазы B (carousel `page-change`, toast `hide`),
raw и React. Двухраундовый исход (молд `verify/v150-fresh-clone/`): раунд-1
нашёл дефект на теговых битах → фикс → раунд-2 чист.

## 1. Клон и ценсус

- Клон по тегу `git clone --branch v1.9.0` локальным file-транспортом
  (честное отклонение по прецеденту §12.4/§13.4/§14.4/§15.4); **remote deref
  сверен ДО клона**: `refs/tags/v1.9.0` → tag-объект `9a8ba9b6`, `^{}` →
  `9d179c6` (штамп-голова), local = remote байт-в-байт. `CLONED_AT=9d179c6`,
  `git describe --tags --exact-match` = `v1.9.0`.
- Ценсус клона: 7 × `1.9.0` (банк ×3 + ТЖ ×3 + tj-fonts) + docs `0.0.0`.
- Ценсус потребителя: РОВНО банковская тройка
  `pillkit-{tokens,components,react}`@1.9.0, других pillkit-* нет.
- install `--prefer-offline` (транспорт-урок v1.6.0); ловушка `pnpm init`
  devEngines применена (блок удалён до add — README-рецепт); прод-билд vite
  exit 0 (517 мс, чанк 623.28 кБ; `resolve.dedupe:['react','react-dom']`
  обязателен, молд v1.1.0).

## 2. Раунд 1 — ГЕЙТ НАШЁЛ ДЕФЕКТ (продуктовый, на теговых битах)

Симптом: `onPageChange`/`onHide` в React-композициях получали СЫРОЙ
`CustomEvent` вместо payload — `payload.page` = undefined, `isEvent` = true
(2 FAIL из 19 ног). Raw-каналы (DOM-listener `event.detail`) были чисты;
юниты кита (74/74) были зелёными — дефект жил в РАСТВОРЁННОМ правиле
обёртки, которое сюита не простреливала для новой формы detail.

Корень: `unwrapKitEventPayload` (packages/react/src/kit-component.ts) знал
только `detail: { value }` (CONVENTIONS §3-большинство). События 27.4 —
`page-change { page }`, `hide { reason }` — ключа `value` не несут, попадали
в ветку «payload-less» и уходили хендлеру как event. Нарушение AD-1 «React
handlers receive the unwrapped value, never the CustomEvent».

Параллельная находка (не дефект рантайма): CHANGELOG [1.9.0] утверждал
size-union спиннера «16/20/24/32/40» — «40» никогда не существовал
(sizes = `['16','20','24','32']`, CHANGELOG-описка).

Фикс (двумя коммитами):

- `54b9d18` — unwrap-правило расширено: непустой object-detail БЕЗ ключа
  `value` проходит ЦЕЛИКОМ (`{ page }` / `{ reason }`); value-несущие —
  байт-идентично прежнему; пустые/payload-less — event. + 2 юнит-теста
  (Carousel/Toast unwrapped-shape, `not.toBeInstanceOf(CustomEvent)`),
  CHANGELOG [Unreleased] Fixed. Гейты: react 74/74, build/test/lint/
  typecheck EXIT 0, gen zero-drift (generated не тронут), ПОЛНЫЙ visual
  compare **2755/2755 (26.3 мин)** — фикс пиксельно нейтрален.
- `8791dd3` — CHANGELOG-микрофикс строки [1.9.0] («16/20/24/32/40» →
  «16/20/24/32»; пост-теговый прецедент fa3e853).

## 3. Раунд 2 — ГЕЙТ ПРОЙДЕН (19/19 ног, на `8791dd3`)

**Протокольное отклонение (честно):** клон переведён на фикс-голову
`8791dd3` (`git fetch origin main && git checkout`), НЕ по тегу — тег
v1.9.0 остаётся на `9d179c6`; перемещение тега = решение мейнтейнера
(молда v1.5.0 §7). Раунд-2 работал против fix-битов main. Probe — 19/19
PASS, полный протокол в `round2.log`:

| Атом | Ноги |
|---|---|
| tk-spinner | named role=status + label; default «Загрузка»; `label=''` → decorative aria-hidden; size=24 → inline 24px + viewBox; size=48 → кламп 20; currentColor rgb(11,162,100); pathLength 100 / dash «75 25» / stroke 2px / svg aria-hidden; reduce → animationName none ↔ tk-spinner-rotate (8) |
| tk-carousel | §9-молчание первого рендера (0 событий при listener до append); шеврон → `{page:2}` composed+bubbles; «Назад» → `{page:1}` (3) |
| tk-toast | duration 600 → `hide {reason:'auto'}` ровно один; sticky + Esc → `{reason:'manual'}`; 0 show-событий (REFUSED) (3) |
| React-обёртки | Spinner label (role+label переживают создание элемента); **Carousel onPageChange → распакованный `{page:2}`, isEvent=false; Toast onHide → распакованный `{reason:'auto'}`, isEvent=false** — дефект раунда-1 закрыт (3) |
| Темы | dark `--tk-color-surface-base` → **#1a1a1a** (1) |
| Консоль | 0 ошибок (1) |

Скриншоты: `light.png`/`dark.png`. Раунд-2 пере-снял ту же пару и произвёл
**БАЙТ-ИДЕНТИЧНЫЕ PNG** (sha1 совпадает по трём копиям, включая живой
`/tmp/tk-v190/shots/`) — харнесс детерминирован, а unwrap-фикс пиксельно
нейтрален (независимо подтверждено полным compare 2755/2755); дубликатная
пара не хранится. Полные прогоны `round1.log`/`round2.log` — локальный
артефакт (`*.log` вне git по глобальному игнору, молд v150/v180: протокол
живёт в этой NOTES; копии в `/tmp/`).

## 4. Probe-уроки (перенесены в протокол окна)

1. **Workspace root требует `-w`**: `pnpm add react react-dom vite` без
   флага молча НЕ записался → `pnpm exec vite` «Command not found».
2. **Ценсус через exports-маппу падает**: `require('pillkit-components/
   package.json')` → ERR_PACKAGE_PATH_NOT_EXPORTED (exports не отдаёт
   package.json) — читать `fs.readFileSync('node_modules/<pkg>/package.json')`.
3. **Мягкие ожидания для пейлоадов**: waitForFunction с условием на поле
   payload (`.page === 2`) при дефекте висит до таймаута и съедает протокол;
   ждать существования окна + пины в `ok()` — раунд-1 выдал полный лог одним
   прогоном, включая FAIL-детали.

## 5. Статус релиза

Раунд-2 прогнан против main `8791dd3`; тег v1.9.0 стоит на `9d179c6` (ДО
фикса) — live-решение за мейнтейнером: перенести на фикс-голову механизмом
§7 (молда v1.5.0) или оставить. Итог гейта: **ДЕФЕКТОВ НА ФИКС-ГОЛОВЕ НЕТ,
19/19**; CHANGELOG [Unreleased] несёт запись Fixed для следующего релиза.
npm-команды не запускались.
