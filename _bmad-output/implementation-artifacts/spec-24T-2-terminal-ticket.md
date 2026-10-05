# Spec 24T.2 — терминальный тикет: ре-открытие паттерна 23.3 (grounded)

- **status:** SPEC (frozen 2026-10-05; awaiting execution)
- **baseline_commit:** 7e99340 (24T capture pack; CI 37356340358 GREEN)
- **epic note:** 24T mini-wave. Исполняет ОБЕЩАНИЕ спеки 23.3: «при
  будущем DOM-каптуре паттерн пересматривается отдельной историей».
  Каптура доставлена (24T pack: 8 кадров тикета 344×500 + DOM
  limit/delayed). Публичный бланк 23.3 (жёлтая CTA, банк-контекст)
  ОСТАЕТСЯ — это другая поверхность; терминальный тикет — НОВАЯ
  паттерн-сторя на измеренном материале.

## Grounding (измерено + DOM, captures-v5/terminal)

- Панель 344×500; кадры ×8 состояний (clean/delayed/empty/limit/
  limit-filled/limit-stopchecked/qty-filled, обе темы).
- **Режимы ордера = табы** (DOM): `role=tablist`, `data-tab-id=
  "Market|Limit|Stop|Iceberg"`, Iceberg `aria-disabled="true"` (кадр
  айсберг-disabled снят), активный таб `aria-selected/expanded`.
- **NumericInput** (DOM): size-m с ±-степперами; степперы
  `tabindex="-1"` (ВНЕ таб-порядка — клавиатура вводит цифрами),
  имена `aria-label="Плюс"/"Минус"`, минус `aria-disabled` + disabled
  на границе.
- **Нижний блок = ДВЕ колонки** (DOM `OrderButtons`): слева
  `order-available-buy` + CTA «Купить», справа `order-available-sell`
  + CTA «Продать» — limits-полоса ПРИНАДЛЕЖИТ своей кнопке.
- **OrderLimits-полоса**: h27, inset-фон dark `rgb(36,52,66)` /
  light `rgb(243,245,248)`, лейбл «Доступно» слева, значение справа
  (right-aligned).
- **CTA-пара**: 155×32 каждая, гэп 8, радиус ≈4 (row-inset 3px на
  верхней строке), theme-invariant заливки: Купить `rgb(11,162,100)`
  (#0BA264, DOM-класс `button-positive` fill m), Продать
  `rgb(157,43,43)` (#9D2B2B, negative-близнец), белая подпись.
- Заметка к инструменту = textarea (заземлена отдельно, 24T.1).

## Story

As a kit consumer, I want the terminal order-ticket pattern story
(tabs, steppers, paired limits, paired positive/negative CTA),
So that dense trading surfaces assemble from kit atoms with measured
terminal geometry instead of guessed registers.

## AC (frozen)

1. **Композиция (всё измерено).** Паттерн-сторя «Терминальный тикет»
   (Invest/Terminal ticket, секция invest-паттернов): узкая панель
   344 на full-bleed канве активной темы (молд 23.3 dark-обзора);
   режим-табы Маркет/Лимит/Условный (+Айсберг disabled) — мини-паттерн
   нативных кнопок role=tab/tabpanel со стрелочным ходом (↑↓←→,
   Home/End) и aria-selected; два NumericInput-поля (цена — только в
   Лимит/Условном, лоты — всегда) со степперами вне таб-порядка
   (tabindex=-1, aria-label, disabled-край — DOM-механика живого);
   нижний блок двух колонок: слева limits-buy «Доступно …₽» + CTA
   Купить, справа limits-sell + CTA Продать (гэп колонок 8).
2. **CTA-пара = tk-button compact + НОВЫЕ варианты `positive`/
   `negative`.** Расширение атома (юнит-пины обязательны): fill на
   семенном `::before`, `var(--tk-color-trade-buy|sell)`, белая
   подпись, theme-invariant; compact уже даёт 32px визуальную пилюлю
   при 44px хит-таргете — терминальный замер 32 совпал с регистром
   кита без нового size. Радиус пары — замер ≈4 против пилюли
   compact: пиксель-арбитраж на исполнении, решение фиксируется в
   record (допустим вариант-специфичный радиус). Hover/active
   affordance — семейная механика (::before-заливка), степень без
   цветовых литералов (FR-1); решение механики (лестница токенов vs
   немаркированная инертность) — в record.
3. **Новые токены (2, theme-invariant, measured).**
   `--tk-color-trade-buy: #0BA264`, `--tk-color-trade-sell: #9D2B2B`
   (источник-комментарий: measured 24T captures-v5/terminal, кадры
   clean-dark/light; прецедент invest-токенов 22.5 — identity-заливки
   без dark-слоя). Это ЕДИНСТВЕННОЕ токен-добавление волны.
4. **A11y паттерна.** Табы — APG tabs-паттерн (roving tabindex,
   стрелки, aria-selected; панели — role=tabpanel с aria-labelledby);
   степперы — реальные кнопки с aria-label, НЕ таб-стопы (замер
   живого), поля несут метки; limits-полосы — текст (не виджеты);
   чек-лист клавиатуры видимой прозой стори; axe обеих тем зелёный.
5. **Данные — вымышленные (ПД-гейт).** Инструмент, цены, значения
   «Доступно» — демо-числа стори (НЕ транскрипция живых значений
   юзера; живые значения отредактированы в капчерах). Айсберг-
   disabled и delayed-валидация — состояния демо-логики.
6. **Цикл.** Токены → gen → юниты кнопки (+варианты) → стори →
   базлайны НОВЫЕ (обе темы) → полный compare (дрейф существующих
   ног = 0; api-стори кнопки при манифест-приросте — реминт по уроку
   26.1) → pathspec → zero-in-flight → push → CI-вердикт → close-out.

## Out of scope

Стакан/хром терминала (материал пака — на будущие волны по брифу);
live-котировки; айсберг-логика (только disabled-состояние);
спиннер/слайдер/тумблер/OTP (в терминале не встречены — HOLD жив);
мобильный терминал.

## Verification (план)

- юниты: positive/negative варианты (классы/токен-пины, кламп
  варианта), радиус-решение пином;
- visual: НОВЫЕ базлайны терминального тикета ×2 темы + переминты
  затронутых (api кнопки при CEM-приросте);
- пиксель-контроль стори против кадров пака (высота CTA 32, гэп 8,
  limits-полоса h27) — вычисляемые прямоугольники, не глаз;
- CI-вердикт run-level после факта.

## Change Log

- 2026-10-05 — спека заморожена; ре-открытие 23.3 материализовано
  (DOM+пиксели пака 24T); публичный бланк 23.3 остаётся отдельной
  поверхностью.
