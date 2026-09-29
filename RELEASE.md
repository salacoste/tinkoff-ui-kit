# RELEASE.md — чеклист релиза v1 (для мейнтейнера)

**Модель дистрибуции (решение мейнтейнера 2026-09-23): только GitHub, npm не
используется — никогда.** Потребители получают кит клоном/checkout'ом
репозитория и pnpm-workspace-линком (рецепт — «Быстрый старт» корневого README,
проверен дословно в SM-6). Релизный маркер — **git-тег `v<X.Y.Z>` на `main`**;
первый релиз — `v1.0.0`.

Подготовлено Story 5.7 (publish prep); развёрнуто на GitHub-модель при том же
автономном прогоне. Всё до решения о релизе сделано и проверено автономным
прогоном; **сами шаги ниже исполняет только мейнтейнер**. `private: true`
стоит во всех пакетах и остаётся навсегда (§3); npm-команд не запускалось.

Распространяются три пакета исходниками в составе checkout'а репозитория:
`pillkit-tokens`, `pillkit-components`, `pillkit-react`. `pillkit-docs` и
корень воркспейса — служебные, потреблять снаружи не нужно.

---

## 0. Записанные решения 5.7 на ратификацию (перед pre-flight)

> **✅ РАТИФИЦИРОВАНО мейнтейнером 2026-09-23 (живая сессия гейтов):**
> §0.1 `SEE LICENSE IN LICENSE` — подтверждён; §0.3 vendored transitions —
> остаются в репо как есть (немодифицированы, провенанс-заголовки, в npm не
> попадают). Bounce-easing ignore детектора — ратифицирован. NVDA-часть
> SR-чеков — осознанно отложена (Windows-машины нет; VoiceOver 19/19 пройден,
> дайджест `.playwright-cli/verify/sr-spot-check/PROTOCOL-DIGEST.md`).
> §0.2 (версия) решается при публикации — гейт 4.
> **§0.2 решена 2026-09-23: финальная `1.0.0`** — гейты §1 закрыты, правок
> не потребовалось (rc-путь отпал вместе с npm-публикацией).

### 0.1 License-поле `pillkit-tokens` = `SEE LICENSE IN LICENSE`

Пакет — смешанная лицензия: MIT-код + шрифтовые бинарники по договорам
мейнтейнера (не MIT, не OFL, не SPDX-выражаемо). Практика npm
(docs.npmjs.com, package.json → license): для не-SPDX/составных лицензий
предусмотрено ровно одно значение — `SEE LICENSE IN <файл>`; SPDX-выражения
здесь неприменимы (`MIT OR X` давал бы потребителю право выбрать MIT для
шрифтов — ложь; `MIT AND X` заявлял бы конъюнкцию на весь пакет — тоже ложь).

Выбрано: `"license": "SEE LICENSE IN LICENSE"` + файл `packages/tokens/LICENSE`
(код = MIT, шрифты = отдельно, указатель на `fonts/LICENSE-FONTS.md`; оба
файла попадают в tarball — проверено `npm pack --dry-run`).

- Плюс: npm-страница не заявляет MIT для tarball'а с проприетарными шрифтами;
  юридически честно из коробки.
- Минус: пакет не фильтруется по «MIT» в поиске npm; часть лицензионных
  линтеров пометит поле как non-SPDX (обычно warning).

Альтернатива (отвергнута, но доступна): `"license": "MIT"` + раздел NOTICE в
README — красивее в поиске, но реестр показывал бы MIT для пакета с
несвободными шрифтами; 5.7 считает это в точности той ошибкой, которую
история должна исключить. **Ратифицировать выбор или сменить его здесь.**

### 0.2 Версия: рекомендация — `1.0.0-rc.1`

Функционально комплект готов (19/19, свипы закрыты), но финальные
человеческие гейты ещё не закрыты: батч-подтверждение базлайнов 5.6,
SR-спот-чеки, ратификация 0.1 и bounce-easing. Если что-то из них заставит
что-то поправить — rc-семантика позволяет выпустить `1.0.0-rc.2` без
«порчи» майлстоуна; финальная `1.0.0` затем выходит повторной публикацией
тех же (или исправленных) битов. Контраргумент: rc отпугнёт ранних
потребителей, а kit — учебный, цена ошибки низка. **Решение за
мейнтейнером; оба пути описаны ниже.** Если все гейты §1 уже закрыты и
правок не предвидится — можно сразу `1.0.0`.

### 0.3 Вендорные transitions.dev рецепты в публичном репозитории

Публичный репозиторий несёт 32 вендорных файла `transitions/t-*.css` +
`_root.css` как исходный материал для будущего token-folding. Условия
upstream (transitions.dev/terms.html, проверены 5.7): рецепты — free и Pro —
можно использовать в неограниченных личных/коммерческих проектах, модифицировать
и поставлять в составе продукта; **нельзя** перераспространять саму коллекцию
или её существенную часть как библиотеку/пак. Наши файлы: немодифицированы,
снабжены provenance-заголовками, не входят ни в один npm `files`-манифест, и
kit не перепродаёт их как transitions-библиотеку — но публичная выкладка
«существенной части» коллекции в составе репозитория остаётся суждением,
которое должен сделать человек. Альтернативы при дискомфорте: сократить набор
до реально потреблённых рецептов или перенести в приватное хранилище.
**Подтвердить комфорт или выбрать альтернативу.** Контекст: корневой LICENSE
(scope-раздел) и закрытая запись в deferred-work.md.

---

## 1. Pre-flight (всё зелёное ДО релиза)

1. **CI зелёный на HEAD** `main` (полная цепочка workflow).
2. Локально на HEAD: `pnpm install && pnpm build && pnpm test && pnpm lint &&
   pnpm typecheck && pnpm gen && pnpm gen:tokens` — всё зелёное, `git status`
   чистый (включая check:gen / check:tokens-drift).
3. **Базлайны:** пройден присест подтверждения по пакету
   `_bmad-output/implementation-artifacts/baseline-review-package.md`
   (274 PNG; в первую очередь флаг F1 progress-bar и волны 5.6 — карты,
   UX-DR17, доки). Неподтверждённые — перезаписать по правилу delete+update
   из того же пакета.
4. **SR-спот-чеки** (VoiceOver/NVDA) по протоколам в «Доступность»-историях —
   исполнены, или решение «публикуемся с отложенными» принято осознанно
   (deferred-work.md хранит запись).
5. **Ratify bounce-easing detector ignore** (maintainer-queue из CLAUDE.md).
6. **OQ-3 финал:** имена `pillkit-*` / `tk-*` — финальное подписание (свип
   5.7 зелёный: в names/descriptions/keywords/README пакетов нулевые
   совпадения Т-Банк/Tinkoff/tbank; остались только фактологические URL
   репозитория и дисклеймер в корневом README).
7. Ратифицированы решения §0 (или изменены — тогда внести правки и пройти
   гейты заново).

> **Поправка 2026-09-25 (обнаружено при подготовке v1.1.0, ДО тега v1.1.0;**
> **касается §1.1 и тега v1.0.0):** на v1.0.0 пункт §1.1 исполнялся как
> «локальная цепочка зелёная», а не как вердикт Actions. Фактически Actions
> был красным с 6962326 (Story 5.5): docs-стори `token-reference.stories.ts`
> первой начала импортировать workspace-пакет в корневой typecheck, шаг
> typecheck стоял ДО build, а типы резолвятся через `dist/*.d.ts` — на свежем
> чекауте детерминированный TS2307. Последний зелёный прогон — 6b07feb
> (2026-09-23 00:33); у тегового коммита v1.0.0 (4bb0046) прогонов CI нет
> вовсе. Локальные гейты это маскировали (dist от прошлых сборок). Продукт
> v1.0.0 содержательно цел (все локальные гейты зелёные + свежий потребитель
> 5.7), но запись «CI зелёный» в этом файле была неверной. Чинено ba0b622
> (2026-09-25, порядок build → typecheck; репетиция порядка на очищенном dist
> локально зелёная). **Правило вперёд: «CI зелёный» = только вердикт Actions
> (проверять `gh run`), никогда не вывод из локальных гейтов.**

## 2. Версия и CHANGELOG

Для **v1.0.0 уже исполнено** (при развороте на GitHub-дистрибуцию,
2026-09-23): во всех трёх `package.json` стоит `"version": "1.0.0"`,
`CHANGELOG.md` несёт `[1.0.0] - 2026-09-23` и пустой `[Unreleased]` сверху.
Ниже — шаблон для следующих релизов:

1. Выбрать версию по семверу: ломающие изменения — мажор; компоненты/токены/
   фичи — минор; фиксы — патч.
2. В `CHANGELOG.md`: заменить заголовок `[Unreleased]` на `[X.Y.Z] - ГГГГ-ММ-ДД`,
   добавить пустой `[Unreleased]` сверху.
3. Во всех трёх `packages/{tokens,components,react}/package.json` выставить
   одинаковую `"version"` (манифесты остаются `private: true` — см. §3).

## 3. `private` остаётся навсегда

**Снятия `private` не будет никогда.** Во всех трёх пакетах
(`tokens`/`components`/`react`) `"private": true` — это не флаг «до первого
релиза», а постоянная защита: случайный `npm publish` из каталога пакета
падает с ошибкой вместо ухода в реестр.

- `pillkit-components: "workspace:*"` в `packages/react/package.json`
  остаётся как есть навсегда — резолв внутри воркспейса и есть рабочий
  механизм дистрибуции.
- `npm pack` / `npm publish` не запускаются; состав tarball'ов больше не
  релевантен (исторические проверки 5.7 зафиксированы в конце файла).

## 4. Релиз = коммит + тег

```sh
# на чистом main, после закрытия гейтов §1 и свёрстки версии/CHANGELOG (§2):
git tag v1.0.0
git push origin main --tags
```

- Маркер релиза — **тег `v<X.Y.Z>` на `main`**: именно на него пинуются
  потребители (`git clone --branch vX.Y.Z …`, `git checkout vX.Y.Z`).
- Для v1.0.0: манифесты уже на `1.0.0`, CHANGELOG уже датирован (§2) — тег
  ставится на коммит, который это включает.
- Тег должен указывать на коммит с зелёным CI (§1.1).

## 5. Верификация релиза — свежий потребитель по тегу

По молде SM-6 (`.playwright-cli/verify/sm6-self-test/NOTES.md`), но клон —
релизный тег с GitHub (не HEAD рабочего дерева):

```sh
d=$(mktemp -d) && cd "$d"
git clone --depth 1 --branch v1.0.0 https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
# index.html + main.ts — из «Быстрого старта» корневого README
pnpm exec vite
```

Проверить (минимум — как в SM-6): обе кнопки рендерятся и стилизуются
токенами кита; тёмная тема переключается атрибутом `data-theme="dark"`.
Этот прогон — релизный гейт: до него релиз не считается закрытым.

## 6. GitHub-хоускипинг

- Тег запушен (`git push origin main --tags`, §4).
- Release на GitHub — заметки из раздела CHANGELOG этого тега (по желанию;
  источник — `CHANGELOG.md`).
- **Description репозитория** (настройки GitHub, строка для вставки):

  ```
  pillkit — неофициальный учебный UI kit: 19 Lit-компонентов, React-обёртки, дизайн-токены (воссоздание дизайн-системы по публичному сайту-референсу; без аффилиации)
  ```

- OQ-3 закрыт этим знаком: имена финальны.
- **Исполнено 2026-09-25 (окно v1.1.0):** созданы Release-страницы
  **v1.0.0** (задним числом) и **v1.1.0** (latest; заметки — из CHANGELOG,
  включая Fixed-часть и установочную заметку с dedupe), описание репозитория
  обновлено до 27 компонентов (дисклеймер «без аффилиации» сохранён), топики:
  ui-kit, lit, web-components, custom-elements, react, design-tokens,
  storybook — нейтральные, без товарных знаков (OQ-3).
- **Исполнено 2026-09-28 (хоускипинг после v1.3.0):** созданы
  Release-страницы **v1.2.0** и **v1.3.0** (latest; заметки — дословно из
  разделов CHANGELOG [1.2.0]/[1.3.0]); описание репозитория актуально
  (27 компонентов), топики без изменений.

## 7. Откат (если что-то не так)

- Реестра нет — откатывать в npm нечего. Сломанный релиз откатывается тегом:
  `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z` (если на тег никто
  не успел пиннуться) либо перемещением тега на исправленный коммит
  (`git tag -f vX.Y.Z <sha> && git push -f origin vX.Y.Z`) с записью в
  CHANGELOG.
- Правка поверх: фикс + патч-релиз (новый тег) следующим номером.

---

## Что 5.7 уже проверило (не нужно повторять)

- SM-6: свежий потребитель по рецепту README рендерит кнопку обоими способами
  (transcript + скриншот + DOM-ассертации — `.playwright-cli/verify/sm6-self-test/`).
- `npm pack --dry-run` всех трёх пакетов: состав tarball'ов соответствовал
  ожиданиям (§3 старой npm-модели — до разворота на GitHub-дистрибуцию),
  `api-reference.*` исключён, LICENSE-файлы включены. Историческая запись:
  к GitHub-модели эта проверка больше не применяется.
- Товарный знак: нулевые попадания в published-строках (§1.6).
- Визуальная сюита после N8-правки: пара getting-started перебазлайнена,
  остальное 919/921 неизменно.

---
---

# Релиз v1.1.0 (v2) — подготовлено Story 8.4 (2026-09-25)

**Всё до тега подготовлено и проверено автономным прогоном 8.4; шаги ниже
исполняет ТОЛЬКО мейнтейнер.** v2 = 14 историй (6.1–8.4): девять новых
компонентов, три композиции, v2-токены, свипы, доки. Итог: 27 компонентов,
**881 юнит + 1368 visual/axe тестов**, 414 базлайн-PNG (v1-часть 274 уже
ПОДТВЕРЖДЕНА 2026-09-23 — новый присест подтверждает только v2-ножи).
Модель та же: **только GitHub, тег `v1.1.0` на `main`; npm — никогда**;
`private: true` навсегда; npm-команды не запускались, тег НЕ ставился
(8.4 завершилась с `git tag -l` без v1.1.0 — проверяемо).

## 8.1. Гейты до релиза (pre-flight v1.1.0)

1. **CI зелёный на HEAD `main`** (полная цепочка workflow).
   **Исполнено/исправлено 2026-09-25:** обнаружено красным (класс и история —
   поправка в §1): ba0b622 перевёл порядок в build → typecheck; первый после
   фикса полный прогон (ubuntu) довёл цепочку до визуала — 1366/1368, два
   платформенных класса добиты точечно (детерминистичное состояние open-стори
   combobox-search; CI-scoped tolerance для text-advance сдвига автo-width
   пилюль tooltip — запись в deferred-work.md), локально ×2 1368/1368.
   Зелёный вердикт Actions на релизном коммите — гейт §8.2.3 ниже.
2. Локально на HEAD: `pnpm install && pnpm build && pnpm test && pnpm lint &&
   pnpm typecheck && pnpm gen && pnpm gen:tokens` — всё зелёное, `git status`
   чистый (включая check:gen / check:tokens-drift).
3. **БАТЧ-ПОДТВЕРЖДЕНИЕ v2-базлайнов** — ЧАСТЬ v2 пакета
   `_bmad-output/implementation-artifacts/baseline-review-package.md`
   (140 новых + 16 adjudicated-перезаписей + 2 токен-страницы; в первую
   очередь R-14/R-2/R-2' — перезаписи поверх подтверждённых v1). Фиделити-
   контекст: `.playwright-cli/verify/fidelity-verification-v2/` (ledger 25
   строк, жёлтый аудит, impeccable). Неподтверждённые — перезаписать по
   правилу delete+update (§3 v1-части).
4. **SR-спот-чеки v2** по протоколам в «Доступность»-историях девяти v2-
   компонентов (метод — `verify/a11y-sweep/METHOD.md` §SR; VoiceOver; NVDA
   по-прежнему осознанно отложен — нет Windows-машины, решение 2026-09-23
   в §0 выше).
   **Исполнено 2026-09-25 (мейнтейнер, живая сессия):** VoiceOver-проход по
   run-sheet `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v2.md` (9
   компонентов × light/dark) — **18/18 ✓, отклонений нет**; v2-таблица
   дописана в `verify/sr-spot-check/PROTOCOL-DIGEST.md`.
5. **Решение по коричневому токену бейджа stepper** (deferred-work, 7.3):
   либо добавить токен (DESIGN.md + `pnpm gen:tokens`), либо зафиксировать
   отказ — не блокирует релиз, но решение должно быть записано.
   **Решение записано 2026-09-25 (мейнтейнер): ОТКАЗ** — текущий маппинг
   остаётся (AA 9.655:1), хуки `--tk-stepper-badge-*` документированы,
   revisit v1.2.0; полная запись — deferred-work.md (7.3).
6. §0-ратификации v1 наследуются (ничего нового на ратификацию в v2 нет;
   жёлтый аудит v2 — ноль нарушений, impeccable — ноль блокеров).

## 8.2. Версия и CHANGELOG (прецедент §2)

1. Во всех трёх `packages/{tokens,components,react}/package.json` выставить
   `"version": "1.1.0"` (манифесты остаются `private: true`).
2. В `CHANGELOG.md`: заменить `[Unreleased]` на `[1.1.0] - <дата релиза>`,
   добавить пустой `[Unreleased]` сверху. Текст — из драфта §8.5 ниже
   (при необходимости правьте; 14 строк = 14 историй v2).
3. Закоммитить («chore(release): v1.1.0 — version + changelog»); дождаться
   зелёного CI на ЭТОМ коммите.

## 8.3. Тег (мейнтейнер — единственный исполнитель)

```sh
# на чистом main, после §8.1–8.2 (тег указывает на релизный коммит с зелёным CI):
git tag v1.1.0
git push origin main --tags
```

**Исполнено 2026-09-25:** тег `v1.1.0` (аннотированный — по прецеденту v1.0.0)
поставлен на кончик `e09fd3c` и запушен. Вердикт Actions на коммите — success
(run 36110877833, проверено `gh run`). Тег выше релизного f38c5fa: он несёт
записи о закрытии §8.1.4 (SR-прогон) и §8.1.5 (отказ по токену) плюс run-sheet
и дайджест — решение «тег на кончик» принял мейнтейнер (2026-09-25, живая
сессия: «жди и потом тегай» после зелёного вердикта).

Откат — тот же механизм, что §7.

## 8.4. Верификация релиза — свежий потребитель рендерит tk-data-table

По молди §5/SM-6, но проверяем v2-компонент (клон — релизный тег):

```sh
d=$(mktemp -d) && cd "$d"
git clone --depth 1 --branch v1.1.0 https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
cat > index.html <<'EOF'
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>v1.1.0 check</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF
cat > main.tsx <<'EOF'
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createRoot } from 'react-dom/client';
import { DataTable } from 'pillkit-react';

const el = document.createElement('div');
el.setAttribute('data-theme', 'light');
document.getElementById('root')!.append(el);
createRoot(el).render(
  <DataTable
    caption="Каталог акций"
    columns={[
      { key: 'name', header: 'Название' },
      { key: 'price', header: 'Цена', align: 'end' },
    ]}
    rows={[
      { href: '#sber', cells: {
        name:  { primary: 'Сбербанк', secondary: 'SBER' },
        price: { primary: '303,55 ₽', secondary: '+1,2%', delta: 'positive' },
      }},
      { href: '#lkoh', cells: {
        name:  { primary: 'ЛУКОЙЛ', secondary: 'LKOH' },
        price: { primary: '7 148,5 ₽', secondary: '−0,8%', delta: 'negative' },
      }},
    ]}
  />,
);
EOF
pnpm exec vite
```

Для vite — обязательный `vite.config.ts` с `resolve.dedupe: ['react',
'react-dom']` (без него линк-депы пребандлятся в две копии React — «Invalid
hook call»; README «Быстрый старт» несёт те же три строки).

Проверить: таблица рендерится с двухстрочными ячейками (имя/тикер), дельты
позитивная зелёная / негативная красная, вся строка — ссылка; клавиатура —
стрелки/Home/End/Enter работают (APG-слой 6.4); тёмная тема — поставить
`<html data-theme="dark">` и перезагрузить. Этот прогон — релизный гейт v1.1.0.

**Исполнено 2026-09-25 — гейт ПРОЙДЕН:** свежий клон по тегу → workspace-линк
→ сборка кита → consumer на vite; рендер подтверждён программно (playwright)
и скриншотами обеих тем — `.playwright-cli/verify/v110-fresh-clone/`
(двухстрочные ячейки; дельты rgb(22,136,33)/rgb(196,11,8), тёмная пара
rgb(57,181,74); строка-ссылка, Enter → #sber/#lkoh; ArrowDown/Home/End водят
roving tabindex; `<html data-theme="dark">`: текст #333→#fff; 0 ошибок
консоли). Гейт нашёл ДВЕ поправки рецепта: (1) `vite.config.ts` dedupe —
см. блок выше и NOTES (патч-дрифт vite ^8.3: SM-6 на v1.0.0 проходил без
конфига); (2) атрибут тёмной темы — на `<html>`, не на произвольный div.
Тег НЕ двигался: продуктовые биты не менялись, поправки — рецептовые.

## 8.5. Драфт changelog v1.1.0 (EN — перенести в CHANGELOG.md на §8.2)

```
### Added — v2 (tbank.ru/invest + /business reference domains)
- v2 token layer: `{colors.*}` reference syntax + rgba literals in DESIGN.md; table/delta/warm-cream
  semantics; typography registers as mappings — zero new type tokens (6.1)
- tk-filter-chips + tk-pagination: catalog filter pills (border-only selection, overflow «Ещё» menu)
  and the pager (nav landmark, windowing, load-more bar) (6.2)
- tk-combobox-search: borderless 52px typeahead field, activedescendant listbox, IME-safe value sync (6.3)
- tk-data-table: typographic row-as-link catalog table, direction-carrying delta colors, APG roving
  keyboard layer (6.4)
- stocks-catalog showcase composition: five surfaces wired live + recorded 39-step keyboard walkthrough (6.5)
- tk-navbar mega-nav extension: optional two-deep header (subLinks row), v1 renders byte-stable (7.1)
- tk-cookie-banner: non-modal consent dialog; `consent-choice` event; storage stays with the consumer (7.2)
- tk-stepper + tk-store-badges + tk-qr-block: the marketing display trio (7.3)
- business-landing showcase: bento 2+3 on warm-cream, floating white CTA, form cluster with toast (7.4)
- invest-landing showcase: marketing register (h1 = heading-2), install cluster qr→steps→badges (7.5)
- v2 a11y sweep: 54/54 ledger cells, kit-wide `:host([hidden])` guards (33 sheets), empty-name fallbacks (8.1)
- v2 dark sweep: all six 6.1 dark assumptions held (zero value changes); engine registry 19→28;
  store-badges anchor color-channel fix (8.2)
- v2 docs: nine component pages (live CEM tables) + registers surface, single-source TOKENS.md (8.3)
- v2 verification ledger (16+9 rows) + yellow-discipline audit extension + v1.1.0 release prep (8.4)
```

## 8.6. Шрифты и право (НЕИЗМЕННО — напоминание)

- **DaytonaSans/DaytonaPragma — отдельно лицензированные бинарники**
  (© Monotype Imaging / © ParaType), НЕ MIT: права потребителя определяет
  ТОЛЬКО `packages/tokens/fonts/LICENSE-FONTS.md`. Договоры лицензируют
  МЕЙНТЕЙНЕРА и НЕ передаются с пакетом. Публичный репозиторий несёт шрифты
  в составе checkout'а — модель распределения не изменилась с v1.0.0
  (решение 2026-09-23, §0 выше).
- Вендорные transitions.dev-рецепты — провенанс-заголовки на каждом файле,
  статус §0.3 ратифицирован «как есть». v2 компонентов на них не добавилось.
- Товарный знак: свип 5.7 остаётся в силе; v2-строки (имена компонентов
  `tk-*`, описания, доки) прошли тот же grep в 8.4 — ноль попаданий
  Т-Банк/Tinkoff/tbank вне фактологических URL и дисклеймера.

## 8.7. Что 8.4 уже проверила (не нужно повторять)

- Гейты на aa9780f: build/test/lint/typecheck/gen/gen:tokens зелёные;
  визуальная сюита 1368/1368 ×2 (приватный порт 6061; темп-конфиг удалён).
- Жёлтый аудит v2-ножей (9+3+доки): ноль нарушений; impeccable детектор
  kit-wide (207 файлов): exit 0, ноль блокеров.
- Фиделити-ledger 25 строк с валидными указателями (ledger.md выше по пути).
- РОВНО НИЧЕГО из §8.2–8.3 НЕ исполнено: `git tag -l` не содержит v1.1.0,
  версии пакетов на 1.0.0, CHANGELOG без [1.1.0] — это гейт мейнтейнера.

# Релиз v1.2.0 (эпики-v3) — подготовлено Story 11.3 (2026-09-26)

**Всё до тега подготовлено и проверено автономным прогоном 11.3; шаги ниже
исполняет ТОЛЬКО мейнтейнер.** v1.2.0 = 9 стори-юнитов эпиков-v3 (9.1, 9.2,
10.1+10.2, 10.3, 10.4, 11.1, 11.2, 11.3): два токена (tint-brown,
font-mono), режимные API (sr-only ×2, error, subtitle, page-copy, art-mode,
href), a11y-свип по новым режимам, доки-mono. Итог (ИЗМЕРЕНО на голове
11.3): 27 компонентов, **943 юнит + 1380 visual/axe тестов**, 414
базлайн-PNG (файлов не прибавилось — окно перезаписывало и добавляло
engine-ноги). Модель та же: **только GitHub, тег `v1.2.0` на `main`; npm —
никогда**; `private: true` навсегда; npm-команды не запускались, тег НЕ
ставился (11.3 завершилась с `git tag -l` = v1.0.0 v1.1.0 — проверяемо, §9.7).

## 9.1. Гейты до релиза (pre-flight v1.2.0)

1. **CI зелёный на HEAD `main`** — вердикт только по `gh run` (правило
   CLAUDE.md: никогда не выводить из локальных гейтов). Окно v1.2.0 держало
   CI зелёным с 9.1 (после tooltip-tolerance восстановления) — каждый
   CI-круг 9.x–11.2 записан в соответствующем спеке.
2. Локально на HEAD: `pnpm install && pnpm build && pnpm test && pnpm lint &&
   pnpm typecheck && pnpm gen && pnpm gen:tokens` — всё зелёное, `git status`
   чистый.
3. **Gen-drift после коммита:** `pnpm gen && pnpm gen:tokens && git diff
   --exit-code -- packages/ tests/` — пустой (генераторы воспроизводимы).
4. **Визуальная сюита ×2:** `pnpm test:visual` дважды — 1380/1380 оба прогона
   (порт 6007 машинно-глобален: перед прогонами `lsof -ti:6007` пуст; для
   критичных кругов — приватный порт через временный конфиг, удалить до
   коммита — прецедент 8.4/9.x).
5. **БАТЧ-ПОДТВЕРЖДЕНИЕ v1.2.0-базлайнов** — ЧАСТЬ v1.2.0 пакета
   `_bmad-output/implementation-artifacts/baseline-review-package.md`
   (реестр перезаписей окна: 11 коммитов / 163 PNG-события, forensic-
   однострочники; byte-identical-пары помечены). Фиделити-контекст:
   `.playwright-cli/verify/fidelity-verification-v1-2-0/` (ledger 13 строк,
   жёлтый аудит, impeccable). Неподтверждённые — перезаписать по правилу
   delete+update (§3 v1-части).
6. **SR-спот-чеки v1.2.0** — исполнить
   `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md` (файл написан
   историей 11.1: 14 пустых строк-«Результат» по семи поверхностям × обе
   темы; NVDA осознанно отложена — решение 2026-09-23 в §0). Может ехать
   ПОСЛЕ тега (как v2) — но протоколы уже в «Доступность»-историях.

## 9.2. Версия и CHANGELOG (прецедент §2/§8.2)

1. Во всех трёх `packages/{tokens,components,react}/package.json` выставить
   `"version": "1.2.0"` (манифесты остаются `private: true`; корневой
   0.1.0 и docs 0.0.0 вне релизного контракта — прецедент 8.4).
2. В `CHANGELOG.md`: заменить `[Unreleased]` на `[1.2.0] - <дата релиза>`,
   добавить пустой `[Unreleased]` сверху. Текст — из драфта §9.5 ниже.
3. Закоммитить («chore(release): v1.2.0 — version + changelog»); дождаться
   зелёного CI на ЭТОМ коммите.

## 9.3. Тег (мейнтейнер — единственный исполнитель)

```sh
# на чистом main, после §9.1–9.2 (тег указывает на релизный коммит с зелёным CI):
git tag v1.2.0
git push origin main --tags
```

**Исполнено 2026-09-27:** тег `v1.2.0` (аннотированный — по прецеденту
v1.0.0/v1.1.0) поставлен на РЕЛИЗНЫЙ коммит `7d3b3db` и запушен. Вердикт
Actions на коммите — success (run 36319189468, проверено `gh run view`).
Поставлен по явной живой санкции мейнтейнера («я тебе доверяю, ставь
корректный тег») — делегирование единственному исполнителю §9.3. Тег на
релизный коммит, а не на кончик: §9.4 верифицировал ровно этот SHA, а
HEAD после него нёс только docs-записи (`680e04a`/`4bb87e7` — NOTES,
нуль продуктовых битов). Сообщение тега поправлено ОДИН раз, сразу после
постановки (потребителей у тега быть не успело): счётчик юнитов 942
(устаревший, spec-11-1) → 943 — пруф-значение §9.7 (17+708+70+148);
итоговый тег-объект `2855ec2`, remote сверен `ls-remote` (тег →
`2855ec2`, дереференс → `7d3b3db`).

Откат — тот же механизм, что §7.

## 9.4. Верификация релиза — свежий потребитель рендерит tk-promo-card в bleed-режиме

По молду §5/SM-6/§8.4, но проверяем v1.2.0-поверхность (клон — релизный тег):
арт-режим `bleed` (10.3) — full-bleed нижняя арт-зона + парящая CTA-пилюля
на зондируемой высоте 32px. Экспорт и пропсы сверены с реальным API
(`packages/react/src/generated/promo-card.ts` → `PromoCard`; проп
`artMode: 'top' | 'bleed'`, невалидное значение клампится в `top`; слоты
`art`/`heading`/`description`/`actions`; CTA — `Button variant="secondary"
size="card"`, строки дословно из promo-card.stories.ts).

```sh
d=$(mktemp -d) && cd "$d"
git clone --depth 1 --branch v1.2.0 https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>v1.2.0 check</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF
cat > main.tsx <<'EOF'
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createRoot } from 'react-dom/client';
import { Button, PromoCard } from 'pillkit-react';

const el = document.createElement('div');
el.setAttribute('data-theme', 'light');
document.getElementById('root')!.append(el);
createRoot(el).render(
  <PromoCard
    artMode="bleed"
    heading="Т-Мобайл"
    description="Связь, интернет и подписки в одном тарифе"
  >
    <svg slot="art" viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <rect x="30" y="52" width="120" height="52" rx="10" fill="#FFFFFF" />
      <rect x="46" y="38" width="120" height="52" rx="10" fill="#FFDD2D" />
      <rect x="62" y="24" width="120" height="52" rx="10" fill="#333333" />
    </svg>
    <Button slot="actions" variant="secondary" size="card">Подробнее</Button>
  </PromoCard>,
);
EOF
pnpm exec vite
```

**Замечание о самодостаточности (кэваут §8.4 снят):** рецепт больше НЕ
нуждает в отдельном предупреждении — корневой README («Быстрый старт») и
getting-started-страница доков ОБА несут те же три строки
`resolve.dedupe: ['react', 'react-dom']` (README.md:76,
getting-started.stories.ts:217; поправки внесены самим гейтом v1.1.0 +
историей 11.2). `vite.config.ts` выше — те же строки дословно.

Проверить: арт-зона прижата к нижней кромке карты и достигает её краёв
(bleed), пилюля «Подробнее» ПАРИТ внутри арт-зоны (отступ снизу 32px) —
не под картой; заголовок/описание над артом; `<html data-theme="dark">` —
тёмная тема; пилюля остаётся белой (theme-invariant white pills — техника
charcoal-CTA внутри компонента). Этот прогон — релизный гейт v1.2.0.

**Исполнено 2026-09-27 — гейт ПРОЙДЕН:** потребитель собран по рецепту
(адаптация: на момент прогона тег ещё не стоял — клон `main` с проверкой
`CLONED_AT=7d3b3db…`; после постановки тега буква протокола закрыта
клоном `--branch v1.2.0` → тот же SHA, три пакета `1.2.0`, CHANGELOG
`[1.2.0]`, LICENSE-FONTS на месте) → workspace-линки `pillkit-*@1.2.0` →
vite. Рендер подтверждён программно (playwright eval-rect'ы + пиксельные
скан-линии, обе темы) — полная запись с числами: NOTES §§11–12,
`.playwright-cli/verify/baseline-review-v120/`. Выдержано в точности:
bleed-холст svg `(40, 133.7, 384.4, 230.6)` — лево/право/низ впритык к
карте `(40, 40, 384.4, 324.3)` (низ 364.3 = 364.3); пилюля
`(158.9, 284.3, 146.6, 48)` — отступ снизу РОВНО 32.0px, центр 232.2 =
центр карты, тело 255,255,255; заголовок/описание над артом. Тёмная
тема: `<html data-theme="dark">` — карта 36,36,36, глифы 220,220,220,
пилюля осталась 255,255,255, бокс карты идентичен между темами (нуль
layout-сдвига); консоль чистая. Урок §8.4 подтверждён ещё раз: атрибут
на произвольном div — no-op (dark-слой собранного tokens.css =
`:host([data-theme=dark]),:root[data-theme=dark]`; theming-guide
документирует именно `<html>`). Гейт нашёл ДВЕ ловушки окружения (сам
рецепт валиден): (1) `pnpm init` пишет `devEngines.packageManager` с
`^`-диапазоном, на котором pnpm затем падает — блок удалить; (2)
`cmd | tail` маскирует сбой `set -e` в пайпе (exit-код пайпа = tail) —
не собирать установку через пайпы. Тег НЕ двигался.

## 9.5. Драфт changelog v1.2.0 (EN — перенести в CHANGELOG.md на §9.2)

```
### Added — v1.2.0 surface (epics-v3)
- Token layer: `tint-brown` #8D6040 (theme-invariant, the charcoal mold; AA gates pinned in
  tests/contrast.test.ts) and the `--tk-font-mono` font slot (system-first chain) (9.1)
- tk-input + tk-segmented-radio: `srOnly` label mode — visually hidden label keeps the full
  accessible-name chain (1px-clip utility) (10.1)
- tk-checkbox: `error` channel — the tk-input error line verbatim (consumer copy, described-by
  wired, error-on-field pairing in both themes) (10.2)
- tk-stepper: `subtitle` slot; tk-qr-block: `page-copy` slot — presence-mold slots; showcase copy
  is reference-verbatim, render-verified (10.1/10.2)
- tk-promo-card: `artMode="bleed"` — CSS-only full-bleed bottom art zone + floating-pill actions
  overlay (pill offset probe-measured at --tk-space-32) (10.3)
- tk-button: `href`/`target`/`rel` anchor mode — `<a class="button">` when href is set; no-href
  render byte-identical; rel = noopener noreferrer iff target=_blank (10.4)

### Changed
- tk-stepper badge pairing switched to the reference reading: brown `tint-brown` fill + WHITE
  numeral (AA 5.413:1; hooks --tk-stepper-badge-fill/-number unchanged) — the v1.1.0 cream-raised
  mapping retired by the maintainer's ADOPT decision (9.1)

### Internal
- 9.2 generator truth (aa-annotations derive from DESIGN.md, AD-4 matrix single-sourced),
  11.1 a11y engine legs for the new modes (+12; group-VI ledger 42/42; SR-RUNSHEET-v1.2.0),
  11.2 docs code surfaces flipped to --tk-font-mono with the harness font pin (JetBrains Mono,
  test-only) — no consumer-facing surface beyond the lines above
```

## 9.6. Шрифты и право (НЕИЗМЕННО — напоминание + ОДНО НОВОЕ)

- **DaytonaSans/DaytonaPragma — отдельно лицензированные бинарники**
  (© Monotype Imaging / © ParaType), НЕ MIT: права потребителя определяет
  ТОЛЬКО `packages/tokens/fonts/LICENSE-FONTS.md`. Договоры лицензируют
  МЕЙНТЕЙНЕРА и НЕ передаются с пакетом. Модель распределения не менялась
  с v1.0.0 (решение 2026-09-23, §0).
- **Новое окно v1.2.0 — JetBrains Mono ТЕСТ-ТОЛЬКО:** `@fontsource/
  jetbrains-mono@5.3.0` (OFL-1.1) — КОРНЕВАЯ devDependency харнесса
  (`package.json:28`, монтируется `tests/visual/serve.mjs` в /jetbrains-mono
  для пина детерминистских метрик моно при захвате базлайнов). Это НЕ
  поставляемый шрифтовый ассет: потребители его не получают, ни один пакет
  кита его не декларирует; токенный слой не тронут — `--tk-font-mono`
  остаётся систем-first цепочкой по решению 9.1 (лицензированного моно-
  начертания не существует, у Daytona нет моно-ката). Рантьера OFL-1.1
  обязательств на репозиторий не накладывает (использование — dev-тесты).
- Вендорные transitions.dev-рецепты — провенанс-заголовки, статус §0.3;
  новых v2/v1.2.0 компонентов на них не добавилось.
- Товарный знак: свип 5.7 в силе; строки окна v1.2.0 прошли тот же grep в
  11.3 (жёлтый аудит + impeccable включали сырой-hex и prose-свипы) — ноль
  попаданий Т-Банк/Tinkoff/tbank вне фактологических URL и дисклеймера.

## 9.7. Что 11.3 уже проверила (не нужно повторять)

- Гейты на голове 11.3: build/test/lint/typecheck/gen/gen:tokens зелёные;
  юниты **943/943** (17+708+70+148); `playwright --list` = **1380 тестов в
  21 файле**; визуальная сюита ×2 — вердикт в спеке 11.3 (Verification).
- Жёлтый аудит окна (13 строк moved-множества): ноль нарушений; impeccable
  детектор kit-wide (207 файлов): exit 0, ноль блокеров; can-fail-проба
  exit 2 воспроизведена.
- Фиделити-ledger v1.2.0 (13 строк) с валидными указателями —
  `.playwright-cli/verify/fidelity-verification-v1-2-0/ledger.md`.
- **РОВНО НИЧЕГО из §9.2–9.3 НЕ исполнено — ПРУФЫ ИСПОЛНЕНЫ 2026-09-26:**
  `git tag -l` = `v1.0.0 v1.1.0` (без v1.2.0); `packages/{tokens,components,
  react}/package.json` = `"version": "1.1.0"` (все три); `grep "1\.2\.0"
  CHANGELOG.md` = 0 совпадений (exit 1). Это гейт мейнтейнера.

# Релиз v1.3.0 (эпики-v4) — подготовлено Story 14.2 (2026-09-28)

**Всё до тега подготовлено и проверено автономным прогоном 14.2; шаги ниже
исполняет ТОЛЬКО мейнтейнер.** v1.3.0 = окно эпиков-v4 (12.1, 12.2, 13.1,
13.2, 13.3, 14.1, 14.2 + межоконный interlude): доки-рестракчер по
повершруппам, капчу-паки v3 (bank + admin), консольное семейство (tabs
`indicator="underline"`, badge neutral/attention + хуки
`--tk-badge-fill`/`--tk-badge-text`, progress-bar хук высоты) + две
страницы паттернов (Console chrome / Data surfaces) + Group VII свип +
доки-комплишн (поиск 30 записей). Interlude: mono-extension (33 правила
код-чипов компонентных пакей + демо card→hero) и port-6007 tree-identity
гард. Итог (ИЗМЕРЕНО на голове 14.2): 27 компонентов, **951 юнит + 1438
visual/axe тестов**, **430 базлайн-PNG** (414 → 430: +16 новых —
консольное семейство и страницы паттернов). Модель та же: **только GitHub,
тег `v1.3.0` на `main`; npm — никогда**; `private: true` навсегда;
npm-команды не запускались, тег НЕ ставился (14.2 завершилась с
`git tag -l` = v1.0.0 v1.1.0 v1.2.0 — проверяемо, §10.7).

## 10.1. Гейты до релиза (pre-flight v1.3.0)

1. **CI зелёный на HEAD `main`** — вердикт только по `gh run` (правило
   CLAUDE.md: никогда не выводить из локальных гейтов). Окно v1.3.0
   держало CI зелёным: 12.x-окно (runs на 3ff938e/c9fa58e/4f4a40c/e274712),
   13.2 (afa645e-предшественники: c22f3eb run 36343418534, 13.3 afa645e
   run 36346034697), 14.1 4044a3b run 36347702653, spec-14.2 80a3604 run
   36352389403 — каждый вердикт записан в соответствующем спеке.
2. Локально на HEAD: `pnpm install && pnpm build && pnpm test && pnpm lint &&
   pnpm typecheck && pnpm gen && pnpm gen:tokens` — всё зелёное, `git status`
   чистый.
3. **Gen-drift после коммита:** `pnpm gen && pnpm gen:tokens && git diff
   --exit-code -- packages/ tests/` — пустой (генераторы воспроизводимы).
4. **Визуальная сюита ×2:** `pnpm test:visual` дважды — 1438/1438 оба
   прогона (порт 6007 машинно-глобален: перед прогонами `lsof -ti:6007`
   пуст; tree-identity гард 7c112e6 сам прервёт чужое дерево).
5. **БАТЧ-ПОДТВЕРЖДЕНИЕ v1.3.0-базлайнов** — ЧАСТЬ v1.3.0 пакета
   `_bmad-output/implementation-artifacts/baseline-review-package.md`
   (реестр окна: 5 коммитов / 197 PNG-событий + 16 новых, forensic-
   однострочники; наибольшая волна — interlude mono 151). Фиделити-контекст:
   `.playwright-cli/verify/fidelity-verification-v1-3-0/` (ledger 6 строк,
   жёлтый аудит с консольной дисциплиной, impeccable 209 файлов).
   Неподтверждённые — перезаписать по правилу delete+update (§3 v1-части).
6. **SR-спот-чеки v1.3.0** — исполнить
   `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.3.0.md` (файл написан
   историей 14.2: 12 пустых строк-«Результат» по шести поверхностям × обе
   темы; NVDA осознанно отложена — решение 2026-09-23 в §0). Может ехать
   ПОСЛЕ тега (как v2/v1.2.0) — но протоколы уже в историях и страницах
   паттернов.

## 10.2. Версия и CHANGELOG (прецедент §2/§8.2/§9.2)

1. Во всех трёх `packages/{tokens,components,react}/package.json` выставить
   `"version": "1.3.0"` (манифесты остаются `private: true`; корневой
   0.1.0 и docs 0.0.0 вне релизного контракта — прецедент 8.4/9.2).
2. В `CHANGELOG.md`: заменить `[Unreleased]` на `[1.3.0] - <дата релиза>`,
   добавить пустой `[Unreleased]` сверху. Текст — из драфта §10.5 ниже.
3. Закоммитить («chore(release): v1.3.0 — version + changelog»); дождаться
   зелёного CI на ЭТОМ коммите.

## 10.3. Тег (мейнтейнер — единственный исполнитель)

```sh
# на чистом main, после §10.1–10.2 (тег указывает на релизный коммит с зелёным CI):
git tag v1.3.0
git push origin main --tags
```

Никаких исполненных штампов в этом разделе НЕТ (в отличие от §9.3) —
история 14.2 завершилась до тега by design. Откат — тот же механизм,
что §7.

**Исполнено 2026-09-28:** тег `v1.3.0` (аннотированный — по прецеденту
v1.0.0/v1.1.0/v1.2.0) поставлен на РЕЛИЗНЫЙ коммит `b8a7b3a` и запушен.
Вердикт Actions на коммите — success (run 36391431890, проверено
`gh run view`). Поставлен делегированным исполнением по явной живой
санкции мейнтейнера («a and then b and then c»; прецедент делегирования —
§9.3). Тег-объект `1dc18af0`; remote сверен `ls-remote`:
`refs/tags/v1.3.0` → `1dc18af0`, дереференс `^{}` → `b8a7b3a`.
Pre-flight §10.1 закрыт тем же днём: batch-гейт (a) — ✅-блок в ЧАСТИ
v1.3.0 `baseline-review-package.md` (делегированный агент-присест, метод
записан честно — гибрид: inline + vision на композитах + ImageMagick
пиксели + source-grounding); локальные гейты + gen-drift зелёные;
визуальная сюита ×2 — **1438/1438 оба прогона** (первый прогон с тремя
30s-таймаут-флейками в зачёт НЕ шёл — изолированный ре-ран 6/6,
полные повторы зелёные).

## 10.4. Верификация релиза — свежий потребитель рендерит tk-badge в режиме attention

По молду §5/SM-6/§8.4/§9.4, но проверяем v1.3.0-поверхность (клон —
релизный тег): консольные тона бейджа (13.3) — attention-счётчик
red-300/white (AA 6.179:1) + neutral-пилюля + пары хуков
`--tk-badge-fill`/`--tk-badge-text`, перекрашивающие бейдж СКВОЗЬ границу
шэдоу-рута с предка. Экспорт и пропсы сверены с реальным API
(`packages/react/src/generated/badge.ts` → `Badge`; проп `variant:
'incentive' | 'stat' | 'neutral' | 'attention'`; `count?: number` —
число-данные, рендерит «99+»-кап; `label?: string` — фолбэк слота).

```sh
d=$(mktemp -d) && cd "$d"
git clone --depth 1 --branch v1.3.0 https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>v1.3.0 check</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF
cat > main.tsx <<'EOF'
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createRoot } from 'react-dom/client';
import { Badge } from 'pillkit-react';

const el = document.createElement('div');
el.setAttribute('data-theme', 'light');
document.getElementById('root')!.append(el);
createRoot(el).render(
  <main style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 24 }}>
    <Badge variant="neutral" label="Ожидает подписи" />
    <Badge variant="attention" count={3} />
    <span style={{ ['--tk-badge-fill' as string]: 'var(--tk-color-yellow-100)',
                   ['--tk-badge-text' as string]: 'var(--tk-color-text-on-primary)' }}>
      <Badge variant="attention" count={7} />
    </span>
  </main>,
);
EOF
pnpm exec vite
```

**Замечание о самодостаточности — то же, что §9.4:** рецепт несёт те же
три строки `resolve.dedupe` (README «Быстрый старт» +
getting-started-страница). Две ловушки окружения из §9.4 действуют и
здесь: блок `devEngines.packageManager` из `pnpm init` удалить; установку
не собирать через пайпы с `tail`.

Проверить: (1) neutral-пилюля — светло-серая заливка с тёмно-серым
текстом; (2) attention-счётчик — красная заливка с БЕЛОЙ цифрой «3»;
(3) обёрнутый в span с хуками счётчик «7» — ЖЁЛТАЯ заливка с чернильной
цифрой (пара переопределена с ПРЕДКА, сквозь границу шэдоу-рута — сам
Badge не тронут); (4) `<html data-theme="dark">` — все три пары остаются
читаемыми (attention остаётся красной парой); (5) консоль чистая. Этот
прогон — релизный гейт v1.3.0.

**Исполнено 2026-09-28 — гейт ПРОЙДЕН** (делегированное исполнение по
живой санкции «a→b→c», как §10.3): клон `--branch v1.3.0` → `b8a7b3a`
(дeref сверен); три линка `pillkit-*@1.3.0`; consumer на vite по рецепту.
Рендер подтверждён программно (playwright DOM-rect'ы + пиксельные скан'ы,
обе темы) — полная запись с числами: `.playwright-cli/verify/
v130-fresh-clone/NOTES.md`. Выдержано в точности: neutral 130×22
#F5F5F6/#616871; attention «3» 24×22 #C40B08 + белая цифра; hooks «7»
23×22 #FFDD2D + чернильная #333 — хук-пара с предка перекрасила сквозь
шэдоу-границу; консоль 0 ошибок. Тёмная тема: `<html data-theme="dark">`
применяется (text-primary #333→#fff), пары тематически-инвариантны by
design (у референс-пака консоли нет dark mode — дельта 13.1). Гейт нашёл
ОДНУ новую ловушку окружения (сам рецепт валиден): наивное perl-удаление
блока `devEngines` ломает JSON манифеста — править по ключу, не regex'ом
по хвосту (NOTES §2.1). Тег НЕ двигался.

## 10.5. Драфт changelog v1.3.0 (EN — перенести в CHANGELOG.md на §10.2)

```
### Added — v1.3.0 surface (epics-v4: the authorized-zone / admin family)
- tk-badge: `neutral` and `attention` console variants (AA pairs gray-100/gray-600 ≈5.17:1
  and red-300/white 6.179:1 — the raw reference red maps onto the red scale per the frozen
  AA-pairing ruling) + the `--tk-badge-fill`/`--tk-badge-text` hook pair (per-instance
  retint, inherits through the shadow boundary — a pair on an ANCESTOR re-tints nested
  tab counters with zero tabs code) (13.3)
- tk-progress-bar: `--tk-progress-bar-height` geometry hook (default 4px unchanged;
  console thin bars = one property on an ancestor) (13.3)
- tk-tabs: `indicator="underline"` console mode — 2px ink bar on aria-selected via the
  `--tk-tabs-indicator` hook, pill default untouched; announcements unchanged (13.2)
- Docs: two v2 console pattern pages — Console chrome (header + underline tabs + static
  4-column mega panel) and Data surfaces (toolbar, counted tabs, status table, labeled
  thin bars, favorites tile grid) — composition surfaces grounded on the 13.1 admin pack
  (13.2/13.3); docs search index 19 → 30 entries (v2 family + pattern pages, 14.1);
  per-vertical showcase groups Bank/Business/Invest (12.1); DESIGN.md authorized-zone
  console language section (13.2)
- Reference packs: captures-v3 per-vertical convention — bank vertical (12.2) + the
  PII-redacted admin console pack, 8 surfaces (13.1)

### Internal
- a11y-sweep engine Group VII: +9 legs for the console family (108 total; stops asserted
  exactly by the walk); SR-protocol rows in three Accessibility stories + protocol tables
  on both pattern pages; SR-RUNSHEET-v1.3.0 (14.1/14.2)
- Interlude: 33 component-package code rules join --tk-font-mono (mono-extension) +
  theming-guide demos card→hero; port-6007 tree-identity guard for the visual harness
  (serve.mjs /__tree__ + globalSetup gate + lockfile)
- Verification: fidelity ledger v1.3.0 (6 rows, composition classification for pattern
  pages), yellow-discipline audit with the console rule (yellow never fills buttons in
  the authorized zone — 0 violations), impeccable 209 files exit 0 (14.2)
```

## 10.6. Шрифты и право (НЕИЗМЕННО — напоминание)

- **DaytonaSans/DaytonaPragma — отдельно лицензированные бинарники**
  (© Monotype Imaging / © ParaType), НЕ MIT: права потребителя определяет
  ТОЛЬКО `packages/tokens/fonts/LICENSE-FONTS.md`. Договоры лицензируют
  МЕЙНТЕЙНЕРА и НЕ передаются с пакетом. Модель распределения не менялась
  с v1.0.0 (решение 2026-09-23, §0).
- **JetBrains Mono — ТЕСТ-ТОЛЬКО (без изменений с v1.2.0):** корневая
  devDependency харнесса (пин детерминистских метрик моно при захвате
  базлайнов); не поставляемый ассет, ни один пакет кита его не декларирует;
  токенный слой остаётся систем-first (решение 9.1).
- Вендорные transitions.dev-рецепты — провенанс-заголовки, статус §0.3;
  новых компонентов на них в окне v1.3.0 не добавилось.
- Товарный знак: свип 5.7 в силе; строки окна v1.3.0 прошли те же grep'ы
  в 14.2 (жёлтый аудит + impeccable включали сырой-hex и prose-свипы) —
  ноль попаданий Т-Банк/Tinkoff/tbank вне фактологических URL и
  дисклеймера. PII-дисциплина нового уровня: админ-пак закоммичен ТОЛЬКО
  в полностью редактированном виде (решение мейнтейнера 2026-09-27;
  верификация редакции — `verify/admin-13-1/NOTES.md`).

## 10.7. Что 14.2 уже проверила (не нужно повторять) + ПРУФ НЕИСПОЛНЕНИЯ

- Гейты на голове 14.2: build/test/lint/typecheck/gen/gen:tokens зелёные;
  юниты **951/951** (17+713+70+151); `playwright --list` = **1438 тестов
  в 21 файле**; полный compare-прогон сюиты на голове 14.1 = 1438/1438
  (спека 14.1 Verification; дифф 14.2 — docs/verification-only, собранное
  дерево байт-идентично).
- Жёлтый аудит окна (6 строк moved-множества + консольная дисциплина
  страниц паттернов): ноль нарушений; impeccable детектор kit-wide
  (**209 файлов**): exit 0, ноль блокеров; can-fail-проба exit 2
  воспроизведена.
- Фиделити-ledger v1.3.0 (6 строк) с валидными указателями —
  `.playwright-cli/verify/fidelity-verification-v1-3-0/ledger.md`.
- **РОВНО НИЧЕГО из §10.2–10.3 НЕ ИСПОЛНЕНО — ПРУФЫ ИСПОЛНЕНЫ 2026-09-28:**
  `git tag -l` = `v1.0.0 v1.1.0 v1.2.0` (без v1.3.0);
  `packages/{tokens,components,react}/package.json` = `"version": "1.2.0"`
  (все три); `grep "1\.3\.0" CHANGELOG.md` = 0 совпадений (exit 1); npm-команды
  не запускались. Это гейт мейнтейнера.

# Релиз v1.4.0 (эпики-v5) — подготовлено Story 17.5 (2026-09-30)

**Всё до тега подготовлено автономным прогоном 17.4+17.5; тег ставит ТОЛЬКО
мейнтейнер.** v1.4.0 = окно эпиков-v5 — ТЖ (Т-Журнал) редакционное семейство
как ОТДЕЛЬНЫЙ экспортируемый кит: 15.1–15.3 (скаффолд тройки
`tj-{tokens,components,react}` + FR-17 механизация, токеновый слой с
dual-emit контрактом, шрифтовые слоты OQ-8), 16.1–16.6 (10 `tj-*` компонентов:
prose/link/cta, рубрикатор/новостная карточка/чип, композер/пост-карточка,
хедер/рейл + burger-drawer, статья + ad-slot-рецепт), 17.1+17.2 (a11y 140 ног +
dark 45), 17.3 (доки-комплишн: token-reference/theming-guide/4 страницы
паттернов/API-таблицы ×10/getting-started Flow-A, поиск +16), 17.4 (квартет
верификации) + межоконные interlude-ы банка (нав-перегруппировка 43fb084,
mono-пины 20d3796, getting-started 67b7fd9). Итог (ИЗМЕРЕНО на голове 17.4
`63bba27`): 37 компонентов (27 банк + 10 ТЖ), **1267 юнит + 2123 visual/axe
ног (23 файла)**, **544 базлайн-PNG сюиты + 25 per-component** (408 → 544:
+136, всё ТЖ, 0 удалено). По OQ-10 ТЖ-тройка едет тем же git-тег-поездом с
собственной секцией CHANGELOG. Модель та же: **только GitHub, тег `v1.4.0`
на `main`; npm — никогда**; `private: true` навсегда.

## 11.1. Гейты до релиза (pre-flight v1.4.0)

1. **CI зелёный на голове релиза — вердикт только по `gh run`** (правило
   CLAUDE.md). Цепочка окна записана честно, ran-id-ами: код-голова 17.3
   `58d979e` = run 36593380779, три попытки `completed cancelled` ровно на
   ~30:20 job-time при нулевых упавших шагах — форензика по таймингам шагов
   показала `timeout-minutes: 30` в ci.yml (timeout-kill репортится как
   cancel под триггер-актором; сюита выросла до 2123 ног и визуальный шаг
   ~28m52s перестал влезать); потолок поднят 30 → 60 (`202beb1`, с
   forensic-комментарием). Run 36617540273 (`202beb1`) — **RED, настоящий
   гейт**: 5 axe color-contrast [light] на страницах паттернов 17.3
   (`.tjpat-note > a`: банковская ссылка на surface-muted = 4.24:1 — тот же
   закон, что у theming-guide; scoped-only перепроверка после пересборки dist
   не гоняла эти ноги — дыру закрыл CI, как и владеет). Фикс `d02a483`
   (ссылки на грунт страницы, law-комментарии в 5 файлах; ровно 10 PNG
   delete+re-mint) → run 36623061743: **GREEN** (~28 мин, первый вердикт под
   потолком 60). Close-out 17.4 `63bba27` → run 36626757077: **GREEN**.
   Вердикт головы 17.5 — по её ran-id в спеке 17.5 (Verification).
2. **Standing practice окна (записана в CLAUDE.md):** после любого
   пост-rebuild source-фикса — ПОЛНЫЙ локальный прогон, не scoped-ноги
   (урок 17.3). Полный прогон на `d02a483`: **2123/2123, exit 0, 12.3 мин**
   (порт 6007 машинно-глобален, `lsof -ti:6007` пуст перед прогоном;
   tree-identity гард 7c112e6 сам прервёт чужое дерево).
3. Локально на голове 17.5: `pnpm build && pnpm test && pnpm lint &&
   pnpm typecheck && pnpm gen` — всё зелёное (1267 юнит:
   17+713+70+197 банк + 4+247+19 ТЖ).
4. **Gen-drift после бампа версий:** `pnpm gen` → diff пуст, РОВНО ожидаемые
   файлы (6 строк `package.json` + CHANGELOG) — CEM-манифесты не встраивают
   версию пакета (только `schemaVersion`), бамп генерационно-чист (проверено
   на исполнении 17.5).
5. **БАТЧ-ПОДТВЕРЖДЕНИЕ v1.4.0-базлайнов** — ЧАСТЬ v1.4.0 пакета
   `_bmad-output/implementation-artifacts/baseline-review-package.md`
   (реестр окна: 14 коммитов / 204 PNG-события, forensic-однострочники;
   наибольшие волны — 16.x-добавления 110 и 50 movers 17.3).
   Фиделити-контекст: `.playwright-cli/verify/fidelity-verification-v1-4-0/`
   (ledger 11 строк, ad-language аудит 0 значений, impeccable 297 файлов
   exit 0). Неподтверждённые — перезаписать по правилу delete+update.
6. **SR-спот-чеки v1.4.0** — исполнить
   `.playwright-cli/verify/tj-a11y-sweep/SR-RUNSHEET-v1.4.0.md` (пустые
   строки-«Результат» по ТЖ-поверхностям × обе темы; живые VoiceOver/NVDA —
   maintainer-side, NVDA осознанно отложена — решение 2026-09-23 в §0).
   Может ехать ПОСЛЕ тега.

## 11.2. Версия и CHANGELOG (прецедент §2/§8.2/§9.2/§10.2) — ИСПОЛНЕНО в-story 17.5

В отличие от v1.3.0, бамп и CHANGELOG исполнены САМИМ прогоном 17.5 (спека
санкционировала; тег — нет). Исполнено 2026-09-30:

- `packages/{tokens,components,react}/package.json`: `1.3.0` → `1.4.0`
  (банк ×3); `packages/tj-{tokens,components,react}/package.json`:
  `0.0.0` → `1.4.0` (ТЖ ×3 — OQ-10: единый поезд тегов monorepo, своя секция
  CHANGELOG). Корневой `0.1.0` и docs `0.0.0` — вне релизного контракта,
  не тронуты.
- `CHANGELOG.md`: `[Unreleased]` → `[1.4.0] - 2026-09-30` (Added — семейство
  ТЖ + Internal с Verification-строкой: ledger 11 строк, ad-language 0,
  impeccable 297, ЧАСТЬ v1.4.0) + свежий пустой `[Unreleased]` сверху; NOTE
  межоконной перегруппировки выжил внутрь Internal.
- Проверка чистоты: diff = ровно 6 строк версий + CHANGELOG; `pnpm gen`
  после бампа — zero drift (см. §11.1.4).

## 11.3. Тег (мейнтейнер — единственный исполнитель)

Прецедент §3/§4 + §10.3 (включая запись «Исполнено» от 2026-09-28 —
делегированное исполнение по явной санкции). Для v1.4.0 исполнение НЕ
делегировано — только мейнтейнер, ПОСЛЕ батч-подтверждения (§11.1.5):

```
git tag -a v1.4.0 -m "pillkit v1.4.0 — the ТЖ editorial family (epics-v5)" <head-17.5>
git push origin v1.4.0
```

Никогда не `npm publish`; `private: true` не снимается (ЖЕЛЕЗНО).

## 11.4. Верификация релиза — свежий потребитель рендерит ТЖ-семейство (Flow-A: ТОЛЬКО ТЖ)

Прецедент §5/§8.4/§9.4/§10.4. Отличие окна: Flow-A ставит ТОЛЬКО ТЖ-тройку —
банковские пакеты потребителю редакционного языка НЕ нужны (FR-17, ноль
runtime-зависимостей в обе стороны). Рецепт = getting-started ТЖ
(`packages/docs/src/tj/getting-started.stories.ts`) дословно; банковский
флоу §10.4 референсен, не повторяется (до тега — recipe-only):

```
git clone https://github.com/salacoste/tinkoff-ui-kit
cd my-app && pnpm init
# pnpm-workspace.yaml: packages: [., ../tinkoff-ui-kit/packages/*]
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-tj-tokens pillkit-tj-components pillkit-tj-react --workspace

// vite.config.ts — ОБЯЗАТЕЛЬНО (найдено релизным гейтом v1.1.0):
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
```

Ожидания прогона: `tj-news-card` рендерится с токенами из
`pillkit-tj-tokens` (каскад с `<html>`), `data-tj-theme="light"` на корне
переключает dual-emit слой, композер принимает ввод (первая stateful-пара),
в `node_modules` НЕТ ни одного `pillkit-{tokens,components,react}` —
потребительская сторона FR-17. Ad-slot-рецепт (Flow-C) сознательно НЕ входит
в Flow-A: модули рекламы едут банковским `tk-promo-card` через
`--tk-promo-card-*` хуки — это отдельный контекст, ссылка на
`packages/docs/src/tj/ad-slot-recipe.stories.ts`.

## 11.5. Драфт changelog v1.4.0 — уже перенесён

Исполнено в-story (§11.2): текст живёт в `CHANGELOG.md` под
`[1.4.0] - 2026-09-30` (Added — v1.4.0 surface / Internal с
Verification-строкой). Дубль здесь не приводится — единственный источник
CHANGELOG.md (правило 14.2).

## 11.6. Шрифты и право (НЕИЗМЕННО — напоминание + НОВОЕ ОКНА)

- **DaytonaSans/DaytonaPragma — отдельно лицензированные бинарники**
  (© Monotype Imaging / © ParaType), НЕ MIT: права потребителя определяет
  ТОЛЬКО `packages/tokens/fonts/LICENSE-FONTS.md`. Модель не менялась
  с v1.0.0 (§0).
- **JetBrains Mono — ТЕСТ-ТОЛЬКО** (пин детерминистских метрик моно при
  захвате базлайнов; не поставляемый ассет) — без изменений с v1.2.0.
- **НОВОЕ ОКНА — ТЖ-шрифтовые слоты (15.3, закрытие OQ-8):** токеновый слой
  ТЖ объявляет слоты Inter (UI) и PT Serif (заголовки) систем-first; НОСИТЕЛЬ
  не бандлит ни одного шрифта (zero-fonts инвариант, тестом); лицензируемый
  путь Graphik/Charter задокументирован в DESIGN.md/TOKENS.md — потребитель
  приносит файлы сам, лицензии мейнтейнера не передаются. ТЖ-пакеты —
  чистый MIT-слой без шрифтовых бинарников.
- Товарный знак: свип 5.7 в силе; строки окна прошли ad-language аудит
  (0 значений `#FFDD2D`/`#06101E`-семейства в ТЖ-деревьях) + impeccable
  (297 файлов) + zero-hardcoded трипваер в CI — ноль попаданий
  Т-Банк/Tinkoff/tbank вне фактологических URL и дисклеймера. PII: ТЖ
  капчу-пак (`captures-v3/tj`, 11 поверхностей) закоммичен полностью
  синтетическим — нулевая PII, дисклеймер на rubric--demo странице.

## 11.7. Что 17.4+17.5 уже проверили (не нужно повторять) + ПРУФ НЕИСПОЛНЕНИЯ

- Гейты на голове 17.4 (`63bba27`, run 36626757077 GREEN): build/test/lint/
  typecheck/gen зелёные; юниты **1267/1267**; полный compare-прогон сюиты на
  `d02a483` = **2123/2123** (12.3 мин; дифф 17.4 — docs/verification-only,
  собранное дерево байт-идентично — прецедент 14.2). Гейты головы 17.5 —
  ran-id в спеке 17.5.
- Квартет 17.4: fidelity ledger 11 строк с валидными указателями
  (`verify/fidelity-verification-v1-4-0/ledger.md`), ad-language аудит —
  **0 значений** во всех четырёх ТЖ-деревьях, impeccable **297 файлов**
  exit 0 + can-fail-проба exit 2, ЧАСТЬ v1.4.0 собран (14 коммитов /
  204 PNG-события) — НЕ подтверждён, гейт мейнтейнера.
- **НЕ ИСПОЛНЕНО ТОЛЬКО ОДНО — ТЕГ** (в отличие от §10.7: версии и
  CHANGELOG исполнены в-story по спеке 17.5, §11.2). ПРУФЫ ИСПОЛНЕНЫ
  2026-09-30: `git tag -l` = `v1.0.0 v1.1.0 v1.2.0 v1.3.0` (без v1.4.0);
  npm-команды не запускались. Тег v1.4.0 — ТОЛЬКО явная санкция
  мейнтейнера (§11.3).


