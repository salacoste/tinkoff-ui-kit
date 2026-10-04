# Spec 24.11 — reward-tiers + share/copy-link виджет (pattern wave 24b)

- **status:** DRAFT 2026-10-03 (AC frozen; исполнения нет)
- **baseline_commit:** 977fa40
- **epic note:** Epic 24, brief `brief-epic-24-pattern-wave-2026-10-03.md`
  (Решение 1, 24b: P12).
- **grounding:** gap-7, mgm (image-verified): «Приводите друзей» —
  tiered reward cards «За 1 друга 100 ₽ / За 5 +100 / За 15 +900 / За
  30 +2 400 ₽» — НОВПАТТЕРН; share-link widget: readonly pill со
  ссылкой (tinvest.io/…) + copy icon-button; qr-block покрывает
  QR-share, но НЕ копирование ссылки (input+button+toast собираемы, но
  не собраны); ряд social-share круглых иконочных кнопок — VARIANT
  tk-button (не этого эпика). Отчёты:
  `.playwright-cli/captures-v4/invest/reports/gap-7-promo.md`.
- **решение ростера:** ПАТТЕРН-СТОРЯ на существующих атомах: (а)
  тиры — бордер-тайлы потребителя (молд stat-tiles 24.4: число в
  heading-регистре + видимый лейбл, БЕЗ тёмного тайла здесь), (б)
  copy-link: readonly tk-input + tk-button compact с иконкой-стабом —
  копирование через navigator.clipboard в демо-логике стори +
  санкционированный императивный тост «Ссылка скопирована»; (в) share-
  ряд — круглые иконки как ПОТРЕБИТЕЛЬСКИЙ CSS поверх tk-button
  (атомный icon-only VARIANT — Epic 25, out of scope). Ссылка
  демо-вымышленная.

## AC (frozen)

1. **Композиция.** Все элементы из существующих атомов; без новых
   компонентов/токенов/пинов.
2. **Copy-контракт.** Клик = реальное копирование в буфер (демо),
   фолбэк-тост при недоступности clipboard API; иконка копирования
   декоративна (aria-hidden), доступное имя — на кнопке; readonly
   поле несёт ссылку как value (доступно для чтения SR).
3. **Тиры.** Грид тайлов (auto-fit), каждый: «За N друзей» + сумма в
   heading-регистре; все суммы вымышленные (ПД).
4. **A11y.** axe обеих тем; единый h1; чек-лист клавиатуры в видимой
   прозе; результат копирования объявляется (тост — aria-live носитель
   уже кита).
5. **Обе темы** без правок состава.
6. **Цикл.** гейты → pathspec → zero-in-flight → push → CI-вердикт →
   close-out; урок 23.4.

## Out of scope

- tk-button icon-only круглый VARIANT (Epic 25); реферальная логика/
  генерация ссылок (демо-ссылка); QR (qr-block уже в ките — отдельная
  история); счётчики приглашённых.

## Execution record (2026-10-04)

- reward-tiers: 4 тира (auto-fit minmax(150px,1fr), суммы +50/+150/
  +750/+1 500 ₽ в heading-4 — вымышленные), CTA primary card → тост;
  .rw-field нативный readonly input (value читается SR, aria-label);
  копия — navigator.clipboard.writeText с фолбэк-тостом; 3 круглых
  share-кнопки с геометрическими стабами; иконки currentColor.
  Токен-промах (surface-inverse/text-inverse не существуют) закрыт
  парой yellow-100 + text-on-primary.
- Минт 4/4, линзы 2/2 PASS, compare детерминирован. Эфир волны:
  9c936ef, CI GREEN 37182715344. #98 completed.
