# Spec 26.2 — tk-switch: boolean-тумблер

- **status:** DRAFT 2026-10-05
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

## Out of scope

Checkbox→switch миграции в существующих сторях; switch-группы;
loading-состояние тумблера.

## Verification (план)

- юнит-пины: aria-checked после Space/Enter; form data содержит
  name/value при checked;
- полный visual compare: только новые базлайны;
- AC2-проба задокументирована в execution record ДО минта базлайнов.
