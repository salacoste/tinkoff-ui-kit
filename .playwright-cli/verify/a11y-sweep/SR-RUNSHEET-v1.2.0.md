# SR-спот-чеки v1.2.0 — run-sheet (VoiceOver; история 11.1)

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
- Источник протоколов: «Доступность»-истории семи поверхностей (METHOD.md §SR — PROTOCOL ONLY; каждое расхождение с ожидаемым объявлением — дефект, а не особенность). Режимные демо В САМИХ историях (вторые ряды/фигуры) — URL-аргументы НЕ нужны.

## 1. tk-input (sr-only)

- URL (light): http://localhost:6009/iframe.html?id=components-input--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-input--accessibility&viewMode=story&globals=theme:dark
- Обход: Tab на первое поле → Tab на sr-only-поле (второй ряд) → Tab на sr-only-поле с бейджем
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на первое поле → «Фамилия, имя и отчество, плюс 20 процентов, поле редактирования текста» — бейдж ПОСЛЕ подписи
  2. Tab на sr-only-поле → «Телефон, поле редактирования текста» — объявление то же, что у видимой подписи: метка скрыта с экрана (1px-клип), но остаётся первой в цепочке aria-labelledby
  3. sr-only-поле с бейджем → «Телефон, плюс 20 процентов, поле редактирования текста»
- Результат: light [ ] / dark [ ] — заметки:

## 2. tk-segmented-radio (sr-only)

- URL (light): http://localhost:6009/iframe.html?id=components-segmentedradio--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-segmentedradio--accessibility&viewMode=story&globals=theme:dark
- Обход: Tab на группу → стрелки по опциям → Tab на sr-only-группу (второй ряд)
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на группу → «Гражданство РФ?, группа радио, Да, радио-кнопка, выбрана 1 из 2» — одна остановка на группу
  2. ArrowRight / ArrowLeft → «Нет, радио-кнопка, выбрана» — выбор следует за фокусом
  3. Tab на sr-only-группу → «Тип операции, группа радио, Да, радио-кнопка, выбрана 1 из 2» — имя скрытой метки то же, что у видимой подписи; резервное имя «Выбор» НЕ срабатывает (labelledby выигрывает у aria-label)
- Результат: light [ ] / dark [ ] — заметки:

## 3. tk-checkbox (ошибка)

- URL (light): http://localhost:6009/iframe.html?id=components-checkbox--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-checkbox--accessibility&viewMode=story&globals=theme:dark
- Обход: Tab на чекбокс → Space → Tab на чекбокс с ошибкой (второй ряд) → Space
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на чекбокс → «Согласие, пункт выбора, не отмечен»
  2. Space → «отмечен» — состояние объявляется сразу
  3. Чекбокс с ошибкой → «Согласен с условиями, пункт выбора, не отмечен» — текст ошибки НЕ входит в имя; при остановке зачитывается описание «Подтвердите согласие, чтобы продолжить» (aria-describedby), поле помечено aria-invalid
  4. Indeterminate-демо → «частично отмечен» (aria-checked=mixed)
- Результат: light [ ] / dark [ ] — заметки:

## 4. tk-stepper (подзаголовок)

- URL (light): http://localhost:6009/iframe.html?id=components-stepper--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-stepper--accessibility&viewMode=story&globals=theme:dark
- Обход: чтение первой фигуры → чтение фигуры с подзаголовком (вторая панель) → обход списка
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Чтение блока → «Откройте счет для бизнеса, заголовок 2-го уровня»; затем «список, 3 элемента»
  2. Блок с подзаголовком → «Откройте счет для бизнеса, заголовок 2-го уровня»; затем абзац подзаголовка — обычный текст («Если у вас не зарегистрирован бизнес…»); затем «список, 3 элемента» — подзаголовок не меняет ни роль списка, ни порядок шагов
  3. Обход списка → «1. Заполните заявку, заголовок 3-го уровня … Это займет не более 10 минут» — по элементу на шаг; цифровой бейдж НЕ объявляется (aria-hidden)
- Результат: light [ ] / dark [ ] — заметки:

## 5. tk-qr-block (page-copy)

- URL (light): http://localhost:6009/iframe.html?id=components-qrblock--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-qrblock--accessibility&viewMode=story&globals=theme:dark
- Обход: Tab на переключник первой фигуры → обход вкладок → чтение фигуры с page-copy (вторая панель)
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на переключник → «Вариант 2. Отсканируйте QR-код, заголовок 2-го уровня»; затем «панель переключателя вкладок»
  2. Обход вкладок → «Android 9.0 и выше, вкладка, выбрана 1 из 2»; стрелка — «Android ниже 9.0, вкладка, выбрана 2 из 2»
  3. Активная панель → «Наведите камеру телефона на QR-код…» затем «QR-код для Android 9.0 и выше, изображение»
  4. Блок с абзацем page-copy → «Вариант 2. Отсканируйте QR-код, заголовок 2-го уровня»; затем «Переходите по ссылкам только с этой страницы…» — обычный абзац ДО «панель переключателя вкладок»; копия не меняет ни роль вкладок, ни их порядок
- Результат: light [ ] / dark [ ] — заметки:

## 6. tk-promo-card (режимы: bleed)

- URL (light): http://localhost:6009/iframe.html?id=components-promocard--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-promocard--accessibility&viewMode=story&globals=theme:dark
- Обход: линейное чтение первой карты → Tab (CTA) → чтение bleed-карты (второй столбец) → Tab
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Линейное чтение → карта НЕ интерактивна: заголовок «Т-Инвестиции, заголовок 3 уровня», затем описание
  2. Tab → единственная остановка — CTA-кнопка: «Подробнее, кнопка»; сама карта в порядке табуляции отсутствует
  3. bleed-карта → «Т-Бизнес, заголовок 3 уровня», затем описание; арт bleed НЕ объявляется (aria-hidden на стороне потребителя); Tab — «Подробнее, кнопка» — имя слоттированной кнопки, порядок таба не меняется
- Результат: light [ ] / dark [ ] — заметки:

## 7. tk-button (режим href)

- URL (light): http://localhost:6009/iframe.html?id=components-button--accessibility&viewMode=story
- URL (dark): http://localhost:6009/iframe.html?id=components-button--accessibility&viewMode=story&globals=theme:dark
- Обход: Tab по демо-кнопкам → Tab на href-ряд → Enter на «Открыть страницу» (назад) → Enter на «Открыть в новой вкладке»
- Ожидаемые анонсы (RU, дословно из протокола):
  1. Tab на кнопку → «Подпись, кнопка» — имя и роль; размер/вариант НЕ объявляются
  2. Tab на кнопку-ссылку → «Открыть страницу, ссылка» и «Открыть в новой вкладке, ссылка» — роль ССЫЛКА вместо кнопки (нативный `<a>`); размер и вариант не объявляются
  3. Enter на «Открыть страницу» → переход по href (нативная навигация ссылки); Space в режиме href прокручивает страницу — записанная дельта режима, не дефект
- Результат: light [ ] / dark [ ] — заметки:

## Критерий закрытия

Все 14 строк (7 поверхностей × light/dark) отмечены ✓ — или каждое ✗ снабжено заметкой и отклонение разобрано (дефект / записанное решение / обновление протокола). После этого оркестратор фиксирует результат спот-чеков и §8.1.4 RELEASE.md закрывается.
