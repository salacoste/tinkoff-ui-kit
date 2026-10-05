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

- 2026-10-06 — EXECUTION FINDINGS (исполнение, локальные гейты зелёные;
  CI-вердикт будет дописан после факта):
  - **Токены**: через DESIGN.md (colors v2.5 + aa-annotation trade-buy
    measured + строка тела Colors «Terminal trade CTA pair»); контрасты
    посчитаны: white-on-buy 3.299:1 RECORDED-FAILING as-measured (молд
    invest-stock-a), white-on-sell 7.463:1 ✓. Грамматика генератора
    AA_STORY_RE расширена осознанно: `/^\d+[A-Z]?\.\d+$/` — поинтеры
    capture-волн «24T.2» (назад-совместимо, core.mjs:601). aa-ledger пин
    16→17 (packages/tokens/src/index.test.ts). Dark-слой не тронут
    (theme-invariant, contrast-пин 25 цел).
  - **Кнопка**: variants += positive/negative; заливки на ::before
    (--tk-color-trade-buy|sell), подпись --tk-color-white. РАДИУС-АРБИТРАЖ:
    замер ≈4 = --tk-radius-xs (4px) ТОЧНО → вариант-специфичный радиус
    (семейная пилюля НЕ меняется). HOVER-МЕХАНИКА (третий путь против
    дилеммы спеки): color-mix(in srgb, fill 88%|78%,
    --tk-color-ink-400) — замешивание существующего ink-токена, ноль
    цветовых литералов (FR-1), бюджет ровно-двух токенов цел; 88/78 —
    структурные mix-пропорции (флаг в css-комментарии).
  - **Табы**: существующий tk-tabs (APG: roving tabindex, стрелки,
    Home/End, aria-selected, tabpanel/aria-labelledby, disabled-скип) —
    мини-паттерн спеки не понадобился. Индикатор НЕ заземлён (кадры не
    пинят стиль) → китовый дефолт pill (record).
  - **Limits-полосы**: фон --tk-color-surface-field (семантика
    field-инсет); точные живые хексы (light #F3F5F8 / dark #243442)
    отличаются от токена и пары-токена НЕ заводились (бюджет) — recorded
    как delta. Радиус полосы — китовый radius-sm (не замер).
  - **CTA 155px**: рецепт homepage UX-DR14 (хост в column-flex →
    пилюля растягивается cross-axis) — 155 лёг точно (пин
    hostWidth=155, pillWidth=155).
  - **Степперы**: 28px hit + 2px гэп — китовый пик (не замер); замеренные
    mechanics пинятся: tabindex=-1, aria-label Плюс/Минус, disabled-край
    (минус на полу) + общий lots-state по всем панелям режимов.
  - **ПД-гейт**: инструмент/цены/лимиты — вымышленные демо-числа
    (AVAILABLE_BUY 150 000 ₽ / SELL 120; цены 253,70/249,00).
  - **Гейты**: юниты 986+70+221 (токены-drift/consumed/zero-hardcoded
    приняли color-mix и trade-пары); пиксель-контроль 3/3 с первого
    прохода (32px пилюля / гэп 8 / 155 / h27 / степперы); терминальная
    сторя 6/6 (visual+axe ×2 темы, axe зелёный сразу); api-стори кнопки
    диффанула по манифест-приросту → ЯВНЫЙ rm + реминт 6 ног (урок 26.1
    подтвердился); полный compare — вердикт по эквиваленту: прогон №1
    **2723 passed / 2 failed** — ровно прогнозные token-reference--colors
    ×2 (рост токен-манифеста честно диффает референс; ЯВНЫЙ rm → реминт).
    Контрольный полный прогон убит ОС (low memory, обрыв ~400-й ноги, до
    обрыва ноль фейлов — ос-лимит второго параллельного сьюта), вместо
    повтора точечная verify переминченных ног compare-режимом:
    token-reference--colors **16/16 GREEN** (остальные 2723 ноги не
    менялись после первого зелёного полного прогона). Локальная
    верификация полна по эквиваленту; CI-вердикт — run-level после пуша
    (допишется после факта).
