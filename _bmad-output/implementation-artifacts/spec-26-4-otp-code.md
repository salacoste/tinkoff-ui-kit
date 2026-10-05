# Spec 26.4 — OTP-code: ячеечный ввод кода подтверждения

- **status:** DRAFT 2026-10-05
- **baseline_commit:** 3e27649
- **epic note:** Epic 26, brief `brief-epic-26-form-control-wave-2026-10-05.md`
  (рулинг-2 после аудита; заземление gap-6 #4: create-account,
  «Код подтверждения», 4 ячейки). Форма — вариант `code` у tk-input
  (gap-6 формулировка), НЕ новый атом.

## Story

As a kit consumer, I want a code-input mode on tk-input (N cells,
auto-advance, paste-split),
So that SMS-confirmation flows stop shipping four raw inputs.

## AC

1. **Контракт.** tk-input `code`-режим: `length` (default 4, кламп
   4–8), value = склеенная строка; `value-change` (§9 — молчит на
   первом рендере), `complete`-событие при заполнении всех ячеек
   (detail.value); `disabled` на всю группу; `error` — красная
   обводка всех ячеек + aria-invalid.
2. **Механика.** Каждая ячейка — input inputmode=numeric
   autocomplete=one-time-code maxlength=1 (первая ячейка несёт
   autocomplete — браузер сам вставит СМС); ввод цифры → авто-фокус
   следующей; Backspace на пустой → фокус назад + очистка прежней;
   paste строки с разделителями (пробел/дефис) → split-заполнение
   (gap-6: «вставка-разделение»); стрелки влево/вправо ходят по
   ячейкам; не-цифровые символы игнорируются (документированное
   правило: только [0-9]).
3. **A11y.** Роль группы: role=group + aria-label (по `label`-пропу
   «Код подтверждения»); каждая ячейка aria-label «Цифра N»
   (1-based); focus движется реальный (не roving-имитация — ячейки
   фокусируемы сами); гейт — атрибутные локаторы + shadowRoot.
   activeElement (урок v1.5.0).
4. **Визуал.** Квадратные ячейки ~48–56 по капче create-account.png
   (промер на исполнении); заполненная ячейка — рамка темнее,
   активная — жёлтый focus-токен; хуки
   `--tk-input-code-{cell,size,gap,border-active}` (семейство input);
   счётчик попыток/резенд — ВНЕ скоупа (паттерн shortlist).
5. **Полный цикл FR-16.** Юниты (auto-advance, paste-split, Backspace
   walk, complete-событие, кламп length, не-цифры); CEM tk-input
   расширяется (новые атрибуты) — React Input-враппер пропускает
   length/code; стори RU «подтверждение заявки» (вымышленный номер,
   00:58 → вымышленный таймер текстом СТАТИЧНО — countdown-паттерн
   не берём); базлайны light/dark; hidden-guard без изменений (тот
   же input.css.ts — трипваер уже стоит; если новый css-файл —
   55→56); event-map += value-change(code)/complete.

## Out of scope

Resend-countdown (shortlist gap-6 #5); буквенные коды; masked-режим;
подтверждённая проверка кода (сервер — потребитель).

## Change Log

- **2026-10-05, исполнение — AC4 заземление ОПРОВЕРГНУТО (третий случай
  волны: 26.1 слайдер, 26.2 тумблер).** Vision-анализ create-account.png
  (даунскейл 720, бюджет 1/2) + пиксельные карты показали: кадр — шаг
  ВВОДА ТЕЛЕФОНА («Введите номер телефона», одно поле + жёлтая кнопка
  «Далее»); ячеек кода на странице НЕТ; «четыре кластера» нижней зоны —
  колонки сайтмапа в футере. Действует рулинг волны «китовые регистры +
  HOLD→24T»: геометрия = регистры семейства input — квадрат 52 (литерал
  высоты поля DESIGN.md components.input, внутри мёртвой полосы 48–56),
  radius-md, зазор `--tk-space-8` (флекс-гэп поля), border-default покой /
  border-strong заполненная / focus-ring активная (семейный идиом 2px/2px
  + хук `--tk-input-code-border-active`). Ячейки OTP — пункт 5 чек-листа
  24T (`captures-v5/TERMINAL-CAPTURE-CHECKLIST.md`).
- **2026-10-05, исполнение — AC1 уточнение значения.** Value = склеенная
  строка, ячейки — её left-packed вид: дырок не существует, удаление
  компактирует (splice), перезапись пишет поверх. Дырочная семантика
  (позиционное хранение) отвергнута — контракт строки заморожен §4/§9.

## Verification (план)

- юнит-пины: paste «1 2-3 4» → value «1234» + complete; Backspace
  маршрут; maxlength ячейки = 1;
- полный visual compare: только новые базлайны; существующие
  tk-input-ноги НЕ дрейфят (новый режим = отдельные стори).
