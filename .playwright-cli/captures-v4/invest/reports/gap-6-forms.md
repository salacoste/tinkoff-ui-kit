# Gap report 6 — invest account/application forms (7 pages, chunk 2)

Source: inv-gap2-forms agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census (account, create-account, create-iis, form-start, iframe-form-account, dfa-account [auth-gated], iis). Image-read budget (2) spent on create-account.png + iis.png; rest census + repo evidence.

## /invest/account/ — «Брокерский счет» (scrollH 8796; 31 btn, 6 inputs, 2 tabs, 11 h2, 20 h3, 1 video)
- Hero с формой лид-генерации (телефон + CTA, несколько полей) — NEW-PATTERN — атомы существуют (tk-input type=tel, tk-button), но рецепт макета формы отсутствует (packages/docs/src/v2/ — console-chrome/data-surfaces/mega-nav, истории форм нет).
- Блок тарифов/преимуществ карточки — COVERED — tk-feature-card / tk-promo-card / tk-service-card.
- Табы (2) — COVERED — tk-tabs pill/underline.
- «Как открыть счет» этапы — COVERED — tk-stepper (stepper.stories.ts «pattern-steps-open-account»).
- FAQ «Вопросы и ответы» — NEW-COMPONENT (tk-accordion) — census details=0; нет директории accordion в ростере.
- Видео-встроение (1) — media-гэп, вне скоупа этого доклада (см. gap-5).
- Диалоги/чат (2 dialogs, 1 iframe) — COVERED — tk-modal + tk-cookie-banner (чат-виджет 3rd-party iframe, вне скоупа кита).

## /invest/create_account/ — «Подтвердите заявку на открытие брокерского счета» (scrollH 2210; 11 btn, 2 inputs)
- 4-ячеечный OTP «Код подтверждения» — NEW-PATTERN (вариант `code` у tk-input допустим) — 4 ячейки, автопереход, вставка-разделение; tk-input не имеет режима ячеек/маски (input.ts attrs: label/placeholder/error/disabled/type whitelist).
- Обратный отсчёт повторной отправки «Получить новый код можно через 00:58» → активная ссылка — VARIANT — нет примитива countdown (grep чист).
- Чекбокс согласия — COVERED — tk-checkbox.
- Основная жёлтая кнопка «Подтвердить» + «Назад» arrow-link — COVERED — tk-button, tk-link.
- Боковая панель «8 800 555-44-44» + карточка чата — COVERED — tk-service-card.
- Этапы «Как открыть брокерский счет» (4 + иллюстрации) — COVERED — tk-stepper.

## /invest/create_iis/ — «Подтвердите заявку на открытие ИИС»
Тот же шаблон, что и create-account (census почти идентичен: 11 btn / 2 inp / 2 iframe / 1 dialog) — те же классификации, лейбл-вариант. Одна реализация, переиспользуется.

## /invest/form/start/ — «Начните инвестировать всего от 10 ₽» (scrollH 4030; 3 btn, 1 input, 5 h2, 9 h3, 16 img)
- Hero с формой лид-генерации телефона — NEW-PATTERN — тот же рецепт, что и в account.
- Карточки преимуществ/шаги — COVERED — tk-feature-card / tk-stepper.

## /invest/iframe/form/account/ — bare form shell «Оформить заявку» (900px; 2 inputs, 2 buttons, 1 h3)
- Встроенная мини-форма (имя+телефон+CTA+назад) — NEW-PATTERN (рецепт лид-формы, embed-вариант) — атомы COVERED, рецепт отсутствует.

## /invest/dfa/… — auth-gated
Захват = экран «Вход в Т-Банк» (1 input, 1 form, 2 buttons); целевая поверхность не видна. Поверхность аутентификации вне invest-скоупа. Записано как auth-gated, переклассификация не требуется.

## /invest/iis/ — «Верните до 88 000 ₽ в год» (scrollH 7398; 24 btn, 2 inputs, 5 tabs/2 tablists, 9 h2, 26 h3)
- Hero-калькулятор «Выберите сумму»: интерактивный слайдер суммы → «Получите вычет до 52 000 ₽» + жёлтый CTA «Открыть ИИС» — NEW-COMPONENT (tk-range-slider) — интерактивный трек с ручкой управляет вычисляемым значением; grep по components/src + docs + tj-components: ноль slider/range; tk-progress-bar только display (progress-bar.ts).
- Табы «Как получить вычет» (5 tabs/2 tablists) — COVERED — tk-tabs.
- «Откройте ИИС за 4 шага» — COVERED — tk-stepper.
- Сравнение «ИИС или брокерский счет» двухколоночные карточки — COVERED — tk-feature-card / tk-promo-card.
- Ряд benefit-карточек / жёлтая секция-формула — COVERED.
- FAQ — NEW-COMPONENT (tk-accordion) — details=0.
- Нижняя CTA-полоса — COVERED — tk-promo-card + tk-button.
- Диалоги/чат — COVERED (см. account).

## Ranked shortlist
1. tk-range-slider — NEW-COMPONENT — M — калькулятор на iis, рекуррент на invest calc/tariff страницах; нужны keyboard a11y, aria-valuenow, min/max/step, value formatter.
2. Lead-form recipe (телефон + согласие + CTA, включая iframe-вариант) — NEW-PATTERN — M — 3 страницы (account, form-start, iframe-form-account); docs-стори + опциональный phone-mask вариант.
3. tk-accordion (FAQ) — NEW-COMPONENT — M — дыра ростера; «Вопросы и ответы» на обоих лендингах, рекуррент везде.
4. OTP code-input (4 ячейки) — NEW-PATTERN (вариант `code` у tk-input допустим) — S/M — create-account/create-iis; auto-advance, paste-split.
5. Resend countdown — VARIANT — S — пара к #4; таймер → ссылка.
6. Phone mask на tk-input (+7 форматирование) — VARIANT — S — каждая лид-форма; type=tel есть, маски нет.
