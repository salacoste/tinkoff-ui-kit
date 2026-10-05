# Spec 26.2 — tk-switch: boolean-тумблер

- **status:** EXECUTED 2026-10-05 (code head `04f19c4`, CI GREEN run 37297112761)
- **baseline_commit:** 3e27649
- **epic note:** Epic 26, brief `brief-epic-26-form-control-wave-2026-10-05.md`
  (аудит-вердикт «в волну»: admin probe-notes «Запомнить» toggle,
  grounded-prose; пиксель-форма проверяется в этой спеке — AC2).

## Story

As a kit consumer, I want a boolean switch atom with the APG switch
contract and the admin-console visual register,
So that settings rows stop mixing checkboxes and ad-hoc toggles.

## AC

1. **Контракт.** `checked` + `checked-change` (§9: молчит на первом
   рендере); `disabled`; `label` — слот (не проп — молд tk-checkbox);
   `name`/`value` для form- participation (нативный input
   type=checkbox ВНУТРИ — скрытый, форма получает корректную пару).
2. **Пиксель-форма (гейт этой спеки).** Повторная живая проба
   авторизованной админ-поверхности («Действия»-тулбар): если тумблер
   «Запомнить» — iOS-style капсула, фиксируем геометрию капсулы/ручки
   промером; если чекбокс — ЧЕСТНО понижаем 26.2 до «админ-паттерн =
   чекбокс» и заземляем форму по второму источнику (бизнес/business
   INDEX hero-toggle — текстовый сегмент) с рулингом мейнтейнера.
   Без живого доступа — решение мейнтейнера по
   admin-main-fullpage-2026-09-27.png.
3. **A11y.** role=switch + aria-checked на нативной кнопке/инпуте;
   Space/Enter переключают; focus-visible токеном; подпись кликабельна
   (label for/id или обёртка). Гейт — атрибутные локаторы.
4. **Визуал.** Капсула+ручка, включённое = жёлтый токен кита
   (акцентный), выключенное = gray-семейство; переход — reduced-motion
   гард (молд skeleton); хуки `--tk-switch-{width,height,knob,
   track-on,track-off}`; размерный ряд по админ-контексту h36–40
   не наследуется напрямую — свитч меньше, размер фиксируется пробой
   AC2.
5. **Полный цикл FR-16.** Юниты (toggle, aria, form-participation,
   event-молчание); CEM → React Switch; стори RU «настройки
   уведомлений» (админ-регистр, вымышленные подписи); базлайны
   light/dark ×2 (+disabled); hidden-guard 53→54; ростер; event-map.

## Change Log

- **2026-10-05 (pre-execution).** AC2 resolved WITHOUT live access (the
  MAINTAINER SESSION mold — the autonomous pipeline never authenticates):
  pixel probe of admin-main-fullpage-2026-09-27.png found «Запомнить»
  at x333–411 / y302–319 — NEITHER spec branch holds. It is a light-gray
  CHIP-BUTTON (~78×18 @ likely DPR1, #F3F4F7 fill, full radius, a ring
  glyph + the label text INSIDE the pill; the same compact 18px toolbar
  row as the «Все/Списание/Поступления» filter chips above it). No
  two-tone track+knob (switch), no square+border (checkbox). The second
  source (business INDEX:39 hero toggle) is a segmented TEXT control
  («Открыть счет»/«Открыть бизнес», transparent, r6, thin border) — also
  not a capsule. probe-notes' «toggle» was the prober's interpretation
  of a state-carrying chip, not a switch control. **Maintainer ruling
  (2026-10-05, this window): «kit registers + HOLD→24T» — the 26.1
  mold.** AC4 geometry therefore lands on kit registers (NOT on the
  admin 78×18 chip): iOS capsule, track = the tk-progress-bar/
  tk-range-slider track family (full-radius pill), ON = yellow-100,
  OFF = border-default gray family, knob = surface-base circle with
  hairline; hit-area floor 44px via the tk-checkbox label mold. Pixel
  grounding HOLD → switch surfaces added to the 24T capture checklist.
  Vision budget: 1 navigation call (crop locator) + pixel probes —
  this entry is the AC2 record required before baseline minting.

## Out of scope

Checkbox→switch миграции в существующих сторях; switch-группы;
loading-состояние тумблера; admin chip-button pattern (a separate
consumer-level pattern candidate, NOT this atom).

## Verification (план)

- юнит-пины: aria-checked после Space/Enter; form data содержит
  name/value при checked;
- полный visual compare: только новые базлайны;
- AC2-проба задокументирована в execution record ДО минта базлайнов.

## Execution record

- **AC2 (гейт, закрыт ДО минта базлайнов).** Живой доступ невозможен
  (MAINTAINER SESSION mold) → пиксельная проба ground-truth PNG
  admin-main-fullpage-2026-09-27.png: навигация одним vision-вызовом по
  кропу тулбар-зоны (CDN-URL от Read; бюджет 1/2), затем пиксельный
  арбитраж ASCII-картами зон. «Запомнить» = x333–411 / y302–319:
  светло-серая chip-кнопка ~78×18 (@вероятно DPR1), заливка #F3F4F7,
  full-radius, внутри кольцевой глиф (~10×8) + текст; тот же компактный
  18px-ряд, что фильтр-чипы «Все/Списание/Поступления» (y279–296,
  outline-чипы). Трека с ручкой НЕТ, квадрата НЕТ. Второй источник
  (business INDEX:39) — сегмент-контрол r6, тоже не капсула. Обе ветки
  AC2 мертвы → рулинг мейнтейнера «китовые регистры + HOLD→24T» (см.
  Change Log). Тумблерные поверхности добавлены в 24T-чеклист (раздел
  Epic 26, пункт 4).
- **Атом** (`packages/components/src/switch/`): strict §4 boolean-зеркало
  tk-checkbox (checked property-only strict-controlled, defaultChecked
  сеет uncontrolled, release сеет от последнего controlled);
  APG Switch Pattern — нативный `input type=checkbox` + `role="switch"`,
  aria-checked НИКОГДА руками (имплицитен нативному checked — не может
  разойтись); единственный нативный пробел — Enter (чекбокс не
  активируется) — кейдаун-гвард preventDefault + click() тем же
  change-pipeline; form-participation = formAssociated +
  ElementInternals setFormValue-зеркало (Chromium form-owner walk не
  пересекает shadow root — проба 2026-09-22), formResetCallback;
  label-обёртка (нативный label кликается и именует), слот против
  label-пропа по badge-slot presence-правилу; disabled — 40% /
  pointer-events none / aria-disabled / в фокусе, гвард ревертирует.
- **Визуал:** капсула 36×20 (трек full-radius, семейство
  progress-bar/slider), ручка 16 surface-base с волосяной рамкой,
  включено = yellow-100, выключено = border-default; путь ручки =
  w − h (инсет-пары сокращаются — переопределение хуков геометрически
  консистентно); transition transform/background fast + явный
  reduced-motion гард (молд skeleton); фокус-кольцо 2px на видимой
  капсуле через sibling-мост; hit-area флоор 44px — паддинги label-молда
  tk-checkbox. Хуки: `--tk-switch-{width,height,knob,track-on,track-off}`
  (ровно пять из AC4).
- **Тесты:** юниты 14 (happy-dom: регистрация, APG-поверхность, §4-пара,
  Enter-гвард, disabled-гвард, слот-присутствие, aria-label-форвард,
  кламп не-boolean, §3-пейлоад, CSS-пины); хромиум
  tests/visual/switch.spec.ts — FormData (checked → name=value, «on»
  по умолчанию, nameless → ничего), реальный Enter через
  page.keyboard, hit-area ≥44×44 bare-конфигурации.
- **React/гварды:** Switch — 48-й враппер (CEM → генератор), event-map
  `onCheckedChange: 'checked-change'`; hidden-guard 53→54 щита / 42→43
  файла; component-search ростер («Переключатель»); entry-пин TkSwitch.
- **Гейты (локально):** gen zero-drift ожидаемо (манифест+враппер в
  коммите), build EXIT 0, юниты 932 (components, +14 switch) + 70
  (react) + 221 (root), lint/typecheck EXIT 0.
- **Базлайны:** 10 PNG (5 стори × 2 темы: Песочница/Варианты/Настройки
  уведомлений/Доступность/API); минт скоупед-командой из корня (урок
  17.0: pnpm-обёртка съедает -g; из tests/visual конфиг не находится —
  запускать из корня). Пиксель-санити: yellow-100 трек и белая ручка
  на месте. **Нулевой дрейф остальных базлайнов** (component-search
  строка «Переключатель» не сдвинула ни одну страницу — growth нет,
  git status пруф: 0 modified PNG).
- **Полный compare: 2634/2635, единственный фейл — тест-трассировка
  моего функционального Enter-теста** (ждал true после первого Enter,
  а стори стартует default-checked → первый Enter даёт false; прод-код
  не тронут). Фикс теста — читает живое стартовое состояние; scoped
  прогон 3/3. Suite 2602→**2635** (+33, объяснено полностью: 10 visual
  + 10 axe + 10 reduced-motion — свип авто-собирает стори, гвард
  прошел — + 3 функциональных). Reduced-motion-ноги прошли с первого
  прогона: явный @media-гард выключает transition трека/ручки.
- **CI VERDICT на `04f19c4`: GREEN — run 37297112761** (10:31:22Z →
  ~11:09Z, gates job success; вердикт по API после факта,
  zero-in-flight соблюдён).
