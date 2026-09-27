# SR-спот-чеки v1.3.0 — run-sheet (VoiceOver; история 14.2)

> **Статус: НЕ ИСПОЛНЯЛСЯ.** Строки «Результат» ПУСТЫ — проставляет
> исполнитель (мейнтейнер) по живой сессии. Автоматический прогон
> скринридером не управляет (METHOD.md §SR; deferred-work.md). NVDA
> осознанно отложена (нет Windows-машины; решение 2026-09-23 — RELEASE.md §0).

Подготовка (один раз):
`pnpm --filter pillkit-docs build && node tests/visual/serve.mjs 6009 &`
- URL-паттерн: `http://localhost:6009/iframe.html?id=<STORY-ID>&viewMode=story`
- тёмная тема: `&globals=theme:dark`
- VoiceOver: Cmd+F5; навигация — Ctrl+Option+стрелки; rotor — Ctrl+Option+U.
- Порядок присеста: по блокам ниже. Отмечай ✓/✗ в строке «Результат» — файл потом заберёт оркестратор.
- Источник протоколов: «Доступность»-истории компонентов + протокольные секции обеих страниц паттернов (METHOD.md §SR — PROTOCOL ONLY; каждое расхождение с ожидаемым объявлением — дефект, а не особенность). Демо-фигуры В САМИХ историях — URL-аргументы НЕ нужны.

## 1. tk-tabs (indicator="underline", консольный режим)

- URL (light): http://localhost:6009/iframe.html?id=components-tabs--console-underline&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-tabs--console-underline&viewMode=story&globals=theme:dark
- Обход: Tab на ленту → ArrowRight / ArrowLeft → линейное чтение
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на ленту → та же вкладка/имя/«выбрана», как в пилюльном режиме (например «Главная, вкладка, выбрана, 1 из N») — объявления НЕ меняются против пилюли: чернильный бар и вес 500 чисто презентационны, состояния сверх aria-selected не добавляется
  2. ArrowRight → следующая вкладка объявляется и АКТИВИРУЕТСЯ (панель меняется вместе с фокусом — контракт tk-tabs; roving tabindex, одна остановка на ленту)
- Результат: light [ ] / dark [ ] — заметки:

## 2. tk-badge (консольные тона neutral/attention)

- URL (light): http://localhost:6009/iframe.html?id=components-badge--console-tones&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-badge--console-tones&viewMode=story&globals=theme:dark
- Обход: линейное чтение фигур (статус-пилюля → счётчик 3 → tabs-фигура с серыми цифрами) → Tab на вкладки третьей фигуры
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Статус-пилюля → «Ожидает подписи» — тон НЕ объявляется и не должен: читается только текст; цвет сопутствующий, состояние несёт контент (правило «не цветом одним»)
  2. Счётчик → «3» — тот же принцип
  3. Tabs-фигура → «…вкладка… 1 из N»; серые цифры счётчиков входят в имя вкладки (хуки --tk-badge-* на предке — пере-кросс границы шэдоу-рута пикселей не меняет в имени)
- Результат: light [ ] / dark [ ] — заметки:

## 3. tk-progress-bar (тонкие бары, хук высоты)

- URL (light): http://localhost:6009/iframe.html?id=components-progressbar--thin-bars&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-progressbar--thin-bars&viewMode=story&globals=theme:dark
- Обход: линейное чтение трёх фигур (h6 жёлтый / h8 чернильный / h10 синий)
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Каждая фигура → «<текст label>, индикатор выполнения, N процентов» — объявления НЕ меняются: хук — только геометрия трека; имя по-прежнему обязано приходить из label (беар-бары пака валят axe aria-progressbar-name — дельта продиктована доступностью)
- Результат: light [ ] / dark [ ] — заметки:

## 4. Console chrome — страница паттерна («Демо»)

- URL (light): http://localhost:6009/iframe.html?id=components-v2-console-chrome--demo&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-v2-console-chrome--demo&viewMode=story&globals=theme:dark
- Обход: линейное чтение хедера → Tab на ленту табов → стрелки → чтение мега-панели
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Линейное чтение хедера → продукт-ссылки — якоря с собственными именами; «Все сервисы» и плитка аватара — статический текст (панель в деме СТАТИЧНА, интерактива нет)
  2. Tab на ленту табов → «Главная, вкладка, выбрана, 1 из 4» — объявления НЕ отличаются от пилюльного режима: чернильный андлайн чисто презентационный
  3. ArrowRight / ArrowLeft → вкладка объявляется и АКТИВИРУЕТСЯ: панель меняется вместе с фокусом (контракт tk-tabs)
  4. Мега-панель → заголовки групп читаются как заголовки (h3), ссылки — якоря; Esc-закрытия в деме НЕТ — открытого состояния в паке нет (13.1)
- Результат: light [ ] / dark [ ] — заметки:

## 5. Data surfaces — «Платежи» (тулбар + таблица)

- URL (light): http://localhost:6009/iframe.html?id=components-v2-data-surfaces--payments-demo&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-v2-data-surfaces--payments-demo&viewMode=story&globals=theme:dark
- Обход: Tab по тулбару → Tab на табы со счётчиками → чтение таблицы
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab по тулбару → кнопки «Создать платёж» → «Подписать» → «Загрузить» → поле «Контрагент» (combobox) → чипы «Неделя/Месяц/Квартал» → «Запомнить» (checkbox) — имена из label
  2. Табы со счётчиками → «Все, вкладка, выбрана, 1 из 4» — счётчик входит в имя: «На подпись, 5»; тон бейджа НЕ объявляется (текст несёт контент)
  3. Таблица платежей → «Получатель, столбец 1 из 3» → строки читаются ячейками: «ООО «Альфа-Сбыт»… Ожидает подписи… 84 000 ₽» — статус-бейдж объявляется как текст ячейки
- Результат: light [ ] / dark [ ] — заметки:

## 6. Data surfaces — «Прогресс и избранное» (тонкие бары + плитки)

- URL (light): http://localhost:6009/iframe.html?id=components-v2-data-surfaces--progress-favorites-demo&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-v2-data-surfaces--progress-favorites-demo&viewMode=story&globals=theme:dark
- Обход: линейное чтение карточек лимитов → плитки избранного
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Карточка лимита → «Лимит Spending-карты, индикатор выполнения, 72 процента» — имя обязательно из label: беар-бары пака валят axe aria-progressbar-name (дельта продиктована доступностью)
- Результат: light [ ] / dark [ ] — заметки:

## Критерий закрытия

Все 12 строк (6 поверхностей × light/dark) отмечены ✓ — или каждое ✗ снабжено заметкой и отклонение разобрано (дефект / записанное решение / обновление протокола). После этого оркестратор фиксирует результат спот-чеков и §10.4 RELEASE.md закрывается.
