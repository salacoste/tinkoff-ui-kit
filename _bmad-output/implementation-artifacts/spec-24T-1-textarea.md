# Spec 24T.1 — tk-textarea: многострочное поле (grounded, 24T mini-wave)

- **status:** SPEC (frozen 2026-10-05; awaiting execution)
- **baseline_commit:** 7e99340 (24T capture pack; CI 37356340358 GREEN)
- **epic note:** 24T mini-wave (рулинг «1 and then 2», 2026-10-05) — первая
  история на живом терминальном материале
  `.playwright-cli/captures-v5/terminal/`. Снимает HOLD, который спека
  25.4 (adopt-находка) держала с момента GAP-аудита: «tk-input
  однострочный (textarea GAP подтверждён grep)».

## Grounding (измерено, не регистры)

Пара notes-виджетов живого терминала (обе темы), кадры
`terminal-notes-editor-dark/light.png`,
`terminal-notes-textarea-empty/filled/grown-dark.png`, DOM
`terminal-notes-editor-dom.txt`:

- поле `374×32` в пустом состоянии (1 строка), `48` с двумя строками
  (grown-кадр + DOM `style="height: 48px;"` — автосайз инлайновой
  высотой, механика живого);
- DOM: `<textarea placeholder="Добавьте заметку" rows="1" maxlength="1000">`
  — `rows=1`, мягкий лимит 1000 символов, плейсхолдер без лейбла
  (виджет-контекст; в ките label-проп остаётся семейным);
- типографика поля: fs 13 / lh 16 (body-s-семейство); вертикальный шаг
  строки 16 → высота = `16·n + 16` (паддинги 8+8), база n=1 → 32;
- заземление переехало из Epic 26 HOLD-списка (чек-лист 24T п.2):
  единственная многострочная поверхность, снятая волной.

## Story

As a kit consumer, I want a tk-textarea atom (multiline sibling of
tk-input), So that note/comment flows stop shipping raw `<textarea>`
with re-invented validation and error markup.

## AC (frozen)

1. **Контракт (семейный, молд tk-input 2.1).** `label`, `placeholder`,
   `default-value` (initial-value семантика), `value` (STRICT §4,
   property-only), `required` (+on-blur проверка «Обязательное поле»),
   `error` (переопределяет внутреннюю), `disabled`, `sr-only`,
   `name`, `maxlength` (pass-through, замер 1000 — дефолта НЕТ:
   без пропа лимита нет), `value-change {value}` (§9 — молчит на
   первом рендере). Badge-слот НЕ переносится (в заземлении не
   встречен — семейный минимализм, зафиксировано здесь).
2. **Autosize (замер — механика живого).** Нативный `rows=1`,
   `resize: none`; высота контрола = `16·n + 16`, где n — строки
   контента в силе, клампится минимумом 32 (пустое) и максимумом
   `max-rows` (проп, default 6 — вырастает каждый кадр на 16; лимит
   живого не замерен, регистр кита). Реализация — инлайновая высота
   контрола по scrollHeight (молд живого inline-height), пересчёт на
   каждом вводе/обновлении значения; после выхода за max-rows —
   нативный вертикальный скролл.
3. **A11y.** Нативная семантика `<textarea>`; имя — видимая `<label
   for>` (aria-labelledby не нужен — нативная связка); error через
   `aria-describedby` + `aria-invalid`; disabled — readonly +
   aria-disabled (семейная инертность); on-blur required — по живому
   тексту контрола (молд `#controlValue`).
4. **Визуал (семенные регистры, замер — только вертикаль).** Бокс поля:
   border-default покой / focus-ring 2px/2px / error-on-field —
   семейство input; радиус и фоны — семенные input-регистры
   (радиус-md); ВЫСОТА — не 52-бокс семейства, а авторастущая
   32-база (замер: заметки — компактная форма ввода, отдельный
   вертикальный регистр семейства). Пустой лейбл-контекст = плейсхолдер
   имена (нативный фолбэк). Хуки ровно два:
   `--tk-textarea-{min-height,max-height}` (дизайн-контроль пределов
   роста; дефолты 32/112). Стори не красят литералы (FR-1).
5. **Полный цикл FR-16.** Юниты (авtosize-механика через моки высот,
   strict/§4/§9 каналы, required-blur, maxlength pass-through, кламп
   max-rows, aria-пины, CSS-пины с strip комментариев AD-3);
   Chromium-функционалка (реальный autosize: ввод перевода строки →
   computed height 48; выход за max-rows → overflow-y auto) молд
   input-code.spec.ts; CEM → React Textarea-враппер; ростер банка
   41→42; hidden-guard 55→56 (новый css-файл textarea.css.ts);
   event-map value-change (запись уже есть — носитель новый каталог);
   стори RU ×3 (паспорт заметок «Заметка о инструменте»: пустое /
   заполненное 2 строки / max-rows + error + disabled микс) обе темы,
   базлайны НОВЫЕ.

## Out of scope

Счётчик символов; форматтеры; badge/суффикс-слоты; автофокус;
form-association (семейное ограничение v1); мобильные жесты.

## Verification (план)

- юнит-пины: высотная формула 16n+16 на моках; controlled-strictness;
  §9-тишина; required-blur по живому тексту; maxlength атрибут
  pass-through;
- visual compare: только НОВЫЕ базлайны textarea; существующие ноги
  нулевой дрейф; api-стори НЕ трогается (манифест растёт — CEM-гейт
  gen-идемпотентности + при api-диффе реминт ×N по уроку 26.1);
- полный compare зелёный; CI-вердикт run-level после пуша.

## Change Log

- 2026-10-05 — спека заморожена по материалу 24T-капчуров
  (grounding-секция); HOLD 25.4 снимается.
