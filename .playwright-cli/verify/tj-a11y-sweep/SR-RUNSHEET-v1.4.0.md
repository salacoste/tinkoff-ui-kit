# SR-прогон ТЖ v1.4.0 — run-sheet (VoiceOver / NVDA; истории 17.1–17.2)

> **Статус: механизуемая половина ИСПОЛНЕНА 2026-09-29** (SR-пины
> `tests/visual/tj-a11y-sweep.spec.ts`, describe-block «tj-a11y-sweep SR
> state pins», 5 тестов — computed role/state на DOM-уровне; scoped-прогон
> 185/185 GREEN). **Живой VoiceOver — НЕ исполнялся** (харнесс не
> управляет скринридером пользователя — METHOD.md §SR): строки ниже
> отмечают программное совпадение computed name/role/state с ожидаемым
> RU-анонсом, а не живую наррацию. NVDA — по появлению Windows-машины
> (решение 2026-09-23, RELEASE.md §0).

Подготовка (один раз):
`pnpm --filter pillkit-docs build && node tests/visual/serve.mjs 6007 &`
- URL-паттерн: `http://localhost:6007/iframe.html?id=<STORY-ID>&viewMode=story`
- тёмная тема ТЖ: `&globals=theme:dark` (пишет `data-tj-theme="dark"` на корень)
- VoiceOver: Cmd+F5; навигация — Ctrl+Option+стрелки; rotor — Ctrl+Option+U.
- Порядок присеста: по блокам ниже. Отмечай ✓/✗ в строке «Результат» — файл потом заберёт оркестратор.
- Источник протоколов: «Доступность»-истории ТЖ-компонентов + протокольные
  секции обеих страниц паттернов (16.5/16.6). Каждое расхождение с
  ожидаемым объявлением — дефект, а не особенность.

## 1. tj-composer (fake-input: кнопка, не поле ввода)

- URL (light): http://localhost:6007/iframe.html?id=tj-composer--playground&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-composer--playground&viewMode=story&globals=theme:dark
- Обход: Tab на обе строки композера → линейное чтение
- Ожидаемые анонсы (RU, дословно из протокола):
  1. «Написать пост или вопрос…, кнопка» — НЕ «поле ввода»: рендер-элемент
     `<button type="button">`, курсорные семантики ввода отсутствуют
     (постановка 16.4)
  2. Вторая строка → «Спросите сообщество, кнопка»
  3. Иконки/аватары молчат (aria-hidden); host `aria-label` при
     выставлении ЗАМЕНЯЕТ имя кнопки целиком
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: SR-пин подтвердил
  `button type=button`, подпись спана «Написать пост или вопрос…» /
  «Спросите сообщество», форвард host `aria-label` → теневая кнопка с
  победой атрибутного имени. Живой VO — не исполнялся.

## 2. tj-header (переключатель темы: цикл + вежливые анонсы)

- URL (light): http://localhost:6007/iframe.html?id=tj-header--theme-contract&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-header--theme-contract&viewMode=story&globals=theme:dark
- Обход: Tab до «Переключить тему оформления» → Enter ×3 → чтение шапки
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab → «Переключить тему оформления, кнопка» (глиф молчит)
  2. Enter → «Тема оформления: тёмная», затем «…системная», затем
     «…светлая» — по одному на клик, вежливая область; двойных анонсов нет
  3. Ориентир «Навигация» при входе; текущий чип — «Разборы, ссылка,
     текущая страница» (aria-current), остальные — просто «ссылка»
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: SR-пин: цикл
  light→dark→auto→light, live-регион молчит до первой активации, detail
  `theme-change` = строки ['dark','auto','light']. Живой VO — не исполнялся.

## 3. tj-rail (ящик: диалог + ловушка + Esc)

- URL (light): http://localhost:6007/iframe.html?id=tj-rail--drawer&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-rail--drawer&viewMode=story&globals=theme:dark
- Обход: активировать демо-кнопку «Открыть ящик из кода» → Tab/Shift+Tab внутри → Esc
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Ящик → «Разделы, диалог, модальный»; Tab читает только ссылки листа,
     содержимое за scrim недоступно
  2. Esc → закрытие; фокус возвращается на ПРОШЛЫЙ элемент (LIFO) — при
     программном открытии это демо-кнопка; бургер ниже 1200px —
     «Разделы, кнопка, развёрнуто/свёрнуто»
  3. Строки → «Разборы, ссылка, текущая страница»; плитки молчат
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: SR-пин: sheet
  role=dialog aria-modal, фокус в ловушке на первой строке, Esc → open
  false + возврат на демо-кнопку (LIFO-пин правилки run-4). Живой VO —
  не исполнялся.

## 4. Контракты якорей (инертный href / _blank / rel потребителя)

- URL (light): http://localhost:6007/iframe.html?id=tj-link--anchor-contract&viewMode=story
  (и tj-cta / tj-tag-chip / tj-news-card / tj-post-card —anchor-contract/--anatomy)
- URL (dark): те же + `&globals=theme:dark`
- Обход: Tab по фигурам; линейное чтение
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Живые якоря — «ссылка» + имя; ИНЕРТНЫЙ (`href=""`) НЕ таб-стоп и не
     «ссылка» вовсе — атрибут не рендерится (правило 16.1)
  2. `_blank` без rel — переход без потери контекста (noopener noreferrer
     вешается китом автоматически, анонса не меняет)
  3. rel потребителя (next/nofollow) — едет ДОСЛОВНО, ничего не дописано
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: SR-пин прошёл все
  пять историй контрактов: инертные рендерят БЕЗ href; `_blank`+no-rel =
  ровно `noopener noreferrer`; next/nofollow дословно. Живой VO — не
  исполнялся.

## 5. Ленты карточек (news / post / community-паттерн)

- URL (light): http://localhost:6007/iframe.html?id=tj-post-card--community-pattern&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-post-card--community-pattern&viewMode=story&globals=theme:dark
- Обход: Tab по карточкам → Enter на карточке
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Карточка целиком — «ссылка» с именем заголовка (строка-как-ссылка;
     стянутый ::after делает кликабельным всю площадь)
  2. Метки времени/авторы читаются текстом внутри той же ссылки; иконки
     молчат
  3. Enter — навигация якоря, кит не перехватывает
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: механизованная
  часть — walk-ноги движка (точные счётчики стопов, имена, кольца);
  сообщество-паттерн 4 стопа. Живой VO — не исполнялся.

## 6. tj-article-page (engagement: переключатель против действий)

- URL (light): http://localhost:6007/iframe.html?id=tj-article-page--page-composition&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-article-page--page-composition&viewMode=story&globals=theme:dark
- Обход: Tab до «Нравится» → Enter ×2 → Tab по соседям
- Ожидаемые анонсы (RU, дословно из протокола):
  1. «Нравится, кнопка-переключатель, не нажато» → после Enter «нажато»;
     счётчик (129) — текстом, подпись НЕ меняется; быстрые повторы — один
     анонс на переключение
  2. «Комментировать / Поделиться / В закладки, кнопка» — БЕЗ состояния:
     действия, не переключатели
  3. Режим скелета (демо-кнопка) → «Занято» на статье, кости молчат
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: SR-пин (скоуп на
  основную панель — клон скролл-бэк панели исключён, правилка run-4):
  ровно ОДИН переключатель, aria-pressed false→true→false, счётчик
  128→129→128 от data-base-count, подпись статична. Живой VO — не
  исполнялся.

## 7. tj-ad-slot-recipe (граница FR-21: оба семейства на одной странице)

- URL (light): http://localhost:6007/iframe.html?id=tj-ad-slot-recipe--recipe&viewMode=story
- URL (dark): http://localhost:6007/iframe.html?id=tj-ad-slot-recipe--recipe&viewMode=story&globals=theme:dark
- Обход: Tab по рельс ТЖ → кнопка-переключатель рекламы → CTA банковской промо-карты
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Строки рельса/статьи — «ссылка», имена текстовые; tj-link в абзаце —
     «ссылка»
  2. «Убрать рекламу (схлопывание слота), кнопка-переключатель, не
     нажато» — состояние переворачивается, слот схлопывается БЕЗ
     пустых коробок
  3. CTA промо-карты — «ссылка»/«кнопка» по нативу tk-button; имена
     читаются сквозь оба шэдоу-дерева
- Результат: light [мех. ✓] / dark [мех. ✓] — заметки: механизованная
  часть — pattern-строка движка (6 kit-стопов + 1 chrome, счётчики tk-
  хостов включены); dark-строка — bank-граница (ledger 17.2). Живой VO —
  не исполнялся.

## Критерий закрытия

Механизуемая половина закрыта (5 SR-пинов + 45 walk ×2 + 45 scan, все
GREEN в scoped-прогоне 2026-09-29). Живой VoiceOver по строкам выше —
мейнтейнер; NVDA — при появлении Windows-машины. Каждое расхождение —
дефект с репортом в этот файл.
