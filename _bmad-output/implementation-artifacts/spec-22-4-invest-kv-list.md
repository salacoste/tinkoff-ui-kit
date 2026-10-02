# Spec 22.4 — tk-kv-list атом (invest identity wave, GAP-MAP B4)

- **status:** DRAFT 2026-10-02 (AC frozen pending «go»; исполнения нет)
- **baseline_commit:** 3706cc9 (голова close-out 21.6; zero-in-flight)
- **epic note:** Epic 22 «invest identity wave», sequencing §2:
  «B4 KV list» — оболочка, которой в ките нет (tk-tooltip есть,
  списка нет).
- **grounding:** gap-2 #7 (bond «Информация о выпуске»: серый лейбл
  слева, чёрное значение справа right-aligned, 1px разделители,
  серые круглые ⓘ-тултипы — Субординированность, Амортизация) +
  future «Параметры фьючерса» (ВСЕ строки с серыми «?»-иконками) +
  sber «Показатели акции» (6 строк KV с зелёными/красными дельтами).
- **решение ростера:** НОВЫЙ атом; тултип = существующий tk-tooltip
  (слот/атрибут wiring, НЕ дубль); дельта-значения = токены 22.x.

## AC (frozen)

1. **Атом.** `tk-kv-list` (`packages/components/src/kv-list/`):
  default slot = строки `<tk-kv-list-item>` (label-проп или
  label-слот слева; value-слот справа, right-aligned); разделители
  1px между строками (::slotted или border — по замеру); item =
  light-DOM ребёнок (молд аккордеона: контейнер + слот-дисциплина).
2. **Тултип.** item-проп `hint` (строка) → серая круглая ⓘ-иконка
  у лейбла + tk-tooltip на hover/focus (иконка = кнопка/таб-стоп,
  aria-describedby — механика китовского тултипа, aria-expanded НЕ
  нужен — это подсказка, не disclosure); без hint иконки нет.
3. **Токены.** `--tk-kv-list-{divider,label,value,gap,icon}` —
  дефолты из замеров (серый лейбл = text-secondary, значение =
  text-primary right-aligned); минта НЕТ.
4. **A11y.** Список semantics: dl/dt/dd НЕ в shadow (слоты) —
  контейнер role="list" при не-ul light-DOM не форсируем: замер
  живого при исполнении (живое = div-строки без семантики — кит
  делает правильно через правильные слоты, решение в record).
5. **Стори.** песочница (строки с/без тултипов, дельта-значения
  из 22.2-токенов) + демо «Информация о выпуске» (bond-заземление,
  вымышленные значения) + API. Dark — штатные пары.
6. **Тесты.** Unit: label/value, hint→иконка+tooltip wiring,
  разделители, css-пины; hidden-guard рост; axe; базлайны НОВЫЕ,
  полный compare зелёный.
7. **Цикл.** gen → гейты → pathspec → zero-in-flight → push →
   CI-вердикт → close-out штамп.

## Out of scope

- Редактируемые значения, копирование ISIN-строк, группировка с
  заголовками, «показать ещё N строк», платёжный календарь
  (GAP-MAP: НЕ минтовать график).
