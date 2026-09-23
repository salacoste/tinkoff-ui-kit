# RELEASE.md — чеклист публикации v1 (для мейнтейнера)

Подготовлено Story 5.7 (publish prep). Всё до решения о публикации сделано и
проверено автономным прогоном; **сами шаги ниже исполняет только мейнтейнер**.
Ничего из этого файла не было исполнено в 5.7: `private: true` стоит во всех
пакетах, тегов нет, npm-команд не запускалось.

Публикуются три пакета: `pillkit-tokens`, `pillkit-components`, `pillkit-react`.
`pillkit-docs` и корень воркспейса остаются приватными навсегда.

---

## 0. Записанные решения 5.7 на ратификацию (перед pre-flight)

> **✅ РАТИФИЦИРОВАНО мейнтейнером 2026-09-23 (живая сессия гейтов):**
> §0.1 `SEE LICENSE IN LICENSE` — подтверждён; §0.3 vendored transitions —
> остаются в репо как есть (немодифицированы, провенанс-заголовки, в npm не
> попадают). Bounce-easing ignore детектора — ратифицирован. NVDA-часть
> SR-чеков — осознанно отложена (Windows-машины нет; VoiceOver 19/19 пройден,
> дайджест `.playwright-cli/verify/sr-spot-check/PROTOCOL-DIGEST.md`).
> §0.2 (версия) решается при публикации — гейт 4.

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

## 2. Версия и CHANGELOG

1. Выбрать версию (§0.2): `1.0.0-rc.1` или `1.0.0`.
2. В `CHANGELOG.md`: заменить заголовок `[Unreleased]` на
   `[1.0.0-rc.1] - ГГГГ-ММ-ДД` (или `[1.0.0] - …`), добавить пустой
   `[Unreleased]` сверху.
3. Во всех трёх публикуемых `package.json` выставить `"version"` из `0.0.0`
   в выбранную (одинаковую).

## 3. Снятие `private` + правка межпакетной зависимости

В `packages/tokens/package.json`, `packages/components/package.json`,
`packages/react/package.json`: **удалить `"private": true`**.
`pillkit-docs` и корневой `package.json` не трогать.

Важно (plain npm не умеет `workspace:*`): в `packages/react/package.json`
заменить зависимость

```json
"pillkit-components": "workspace:*"
```

на версию публикуемого компонентного пакета, например `"^1.0.0-rc.1"`
(точная форма — та же, что выбрана в §2). Без этого tarball `pillkit-react`
уйдёт в npm с буквальным `workspace:*` и сломает установку потребителям.

Проверка содержимого перед публикацией (из каталога пакета):

```sh
npm pack --dry-run
```

Ожидания: `pillkit-tokens` — LICENSE, fonts/ (7 файлов + LICENSE-FONTS.md),
dist/; `pillkit-components` — LICENSE, dist/ (типы включены, `api-reference.*`
ИСКЛЮЧЁН files-negation'ом), CONVENTIONS.md, custom-elements.json;
`pillkit-react` — LICENSE, dist/.

## 4. Публикация (plain npm)

```sh
npm login

cd packages/tokens     && npm publish --tag rc
cd ../components       && npm publish --tag rc
cd ../react            && npm publish --tag rc
```

- `--tag rc` обязателен для prerelease-версий: без него npm молча ставит
  `latest` на `1.0.0-rc.1`. Для финальной `1.0.0` — `npm publish` без
  `--tag` (станет `latest`).
- Порядок важен: tokens → components → react.
- Имена `pillkit-*` проверены как свободные (OQ-3, 2026-09-22); unscoped,
  `--access public` не требуется.

## 5. Сразу после публикации — свежая установка из registry

По молде SM-6 (`.playwright-cli/verify/sm6-self-test/NOTES.md`), но пакеты
ставятся из npm, без линка. **rc-путь: тег дистрибуции обязателен** — при
публикации с `--tag rc` тег `latest` никуда не указывает, и bare-установка
пакета, у которого есть только prerelease-версии, завершается ошибкой
(`No matching version found`); npm никогда не резолвит prerelease без явного
указания тега/версии. Для финального `1.0.0`-пути (`latest` указывает на
релиз) — обычные bare-имена.

```sh
d=$(mktemp -d) && cd "$d" && npm init -y
# rc-путь (§0.2):
npm i pillkit-tokens@rc pillkit-components@rc pillkit-react@rc react@19 react-dom
# 1.0.0-путь: npm i pillkit-tokens pillkit-components pillkit-react react@19 react-dom
npm i -D vite
# index.html + main.ts — из «Быстрого старта» корневого README
npx vite
```

Проверить: обе кнопки рендерятся; `npm view pillkit-tokens license` →
`SEE LICENSE IN LICENSE`; в `node_modules/pillkit-tokens/` есть `LICENSE`,
`fonts/LICENSE-FONTS.md` и шрифты; `npm view pillkit-react peerDependencies`
→ `react@^19.0.0`.

## 6. Тег и GitHub

```sh
git tag v1.0.0-rc.1 && git push origin main --tags
```

- Release на GitHub — из раздела CHANGELOG (по желанию).
- **Description репозитория** (настройки GitHub, строка для вставки):

  ```
  pillkit — неофициальный учебный UI kit: 19 Lit-компонентов, React-обёртки, дизайн-токены (воссоздание дизайн-системы по публичному сайту-референсу; без аффилиации)
  ```

- OQ-3 закрыт этим знаком: имена финальны.
- **Вернуть `workspace:*`:** в follow-up-коммите после публикации отменить
  правку §3 — зависимость `pillkit-components` в `packages/react/package.json`
  обратно на `"workspace:*"` (версионный спес `^1.0.0-rc.1` в воркспейсе будет
  резолвиться из registry и затенит локальный линк при следующем
  `pnpm install`). Само снятие `private` остаётся как есть.

## 7. Откат (если что-то не так)

- В течение ~72 ч: `npm unpublish <pkg>@<version> --force` (окно npm для
  новых пакетов; все три пакета — никто не успел зависеть).
- Позже: `npm deprecate <pkg>@<version> "причина"` + патч/минор сверху.
- Тег удалить: `git tag -d v1.0.0-rc.1 && git push origin :refs/tags/v1.0.0-rc.1`.

---

## Что 5.7 уже проверило (не нужно повторять)

- SM-6: свежий потребитель по рецепту README рендерит кнопку обоими способами
  (transcript + скриншот + DOM-ассертации — `.playwright-cli/verify/sm6-self-test/`).
- `npm pack --dry-run` всех трёх пакетов: состав tarball'ов соответствует
  ожиданиям §3, `api-reference.*` исключён, LICENSE-файлы включены.
- Товарный знак: нулевые попадания в published-строках (§1.6).
- Визуальная сюита после N8-правки: пара getting-started перебазлайнена,
  остальное 919/921 неизменно.
