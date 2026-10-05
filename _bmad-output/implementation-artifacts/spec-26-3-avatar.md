# Spec 26.3 — tk-avatar: круглый носитель личности

- **status:** DRAFT 2026-10-05
- **baseline_commit:** 3e27649
- **epic note:** Epic 26, brief `brief-epic-26-form-control-wave-2026-10-05.md`
  (аудит-вердикт «в волну»: заземлён трижды — tj byline 20px,
  tj news 45px (замер 20.1), admin-фид круглые).

## Story

As a kit consumer, I want a round avatar atom (image/initials/
placeholder) covering byline/news/admin-feed registers,
So that author rows stop hand-rolling circles.

## AC

1. **Контракт.** `src` (изображение), `name` (источник инициалов +
   aria-label при отсутствии слота), `size` (px-строка, молд skeleton:
   host inline style; дефолт 45 — news-замер 20.1). Слот — контентная
   обёртка поверх (молд service-card) для статус-точек потребителя.
2. **Три состояния.** image (object-fit cover, loading=lazy — молд
   tk-figure lazy-энфорсмент; decode-fail → initials), initials
   (первые инициалы `name`, верхний регистр, обрезка до 2), placeholder
   (плоский токен-фон без содержимого — tj-composer-плейсхолдер).
3. **A11y.** role=img self-assert + aria-label = `name` (закон React
   19: атрибуты из connectedCallback, не ctor); decorative-режим
   (`aria-hidden` свойством) для повторов в рядах (админ-фид:
   первый озвучивает, остальные скрыты — паттерн потребителя).
4. **Визуал.** Круг радиусом 50%; фоны — токен-семейство surface/
   gray; инициалы — text-secondary; хуки `--tk-avatar-{size,bg,fg}`
   (size продублирован property — хук для консюмер-темы); БЕЗ
   статус-кольца (потребительский оверлей — слотом).
5. **Полный цикл FR-16.** Юниты (инициалы из name, lazy-атрибут,
   aria-пины, decode-fail фолбэк); CEM → React Avatar; стори RU:
   byline 20 (news-ряд) + 45 (новостная карточка) + админ-фид
   (транзакции, вымышленные имена); базлайны light/dark;
   hidden-guard 54→55; ростер; event-map — STATELESS (no-entry, молд
   tk-rating).

## Out of scope

Avatar-группы/стеки; статус-точки; загрузка blob; кропперы.

## Verification (план)

- юнит-пины: aria-label из name; initials «Мария Оганова»→«МО»;
  img loading=lazy присутствует;
- полный visual compare: только новые базлайны.
