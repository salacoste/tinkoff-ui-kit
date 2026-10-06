# Flow-B §15.4 — свежий потребитель v1.8.0 (release gate)

**Дата:** 2026-10-06 · **Вердикт: ПРОЙДЕН раунд-1, 22/22 ног PASS, дефектов НЕТ** (третий
подряд одно-раундовый Flow-B — v1.6.0, v1.7.0, v1.8.0; прецедент-молд — `verify/v170-fresh-clone/`).

## Клон и ценсус

- Клон по тегу: `git clone --branch v1.8.0` локальным file-транспортом (честное
  отклонение по прецеденту §12.4/§13.4/§14.4); **remote deref сверен ДО клона**:
  `refs/tags/v1.8.0` → tag-объект `fe1a3bd`, `^{}` → `bbad7f6` (штамп-голова),
  local = remote байт-в-байт. `CLONED_AT=bbad7f6`, `git describe --exact-match` =
  `v1.8.0`.
- Ценсус клона: 7 × `1.8.0` (банк ×3 + ТЖ ×3 + tj-fonts) + docs `0.0.0`.
- Ценсус потребителя: РОВНО банковская тройка `pillkit-{tokens,components,react}`@1.8.0,
  других pillkit-* нет.
- install `--prefer-offline` (транспорт-урок v1.6.0) — мгновенно; build кита полная;
  прод-билд vite exit 0 (75 мс rebuild; чанк >500 кБ — предупреждение, не ошибка;
  `resolve.dedupe:['react','react-dom']` обязателен, молд v1.1.0).
- Ловушка `pnpm init` devEngines применена (блок удалён до add — README-рецепт).

## 22 ноги (probe.mjs, полный протокол в логе выше)

| Атом | Ноги |
|---|---|
| tk-range-slider | нативный range-интерьер; value=40; valueFormatter → readout «40 %» И aria-valuetext (4 ноги) |
| tk-switch | нативный checkbox + **role="switch" на input** (не на хосте); §4 property-канал `checked`; капсула 36×20 в регистре (3) |
| tk-avatar | role=img + aria-label из connectedCallback (закон React 19); инициалы «МО» (2) |
| tk-textarea | автосайз 16·n+16 → **48px** на двух строках; нативная label-связка (2) |
| tk-button positive/negative | ::before `rgb(11,162,100)`/`rgb(157,43,43)` байт-в-байт токенам #0BA264/#9D2B2B; radius 4px; белая подпись (5) |
| React-обёртки | пропсы переживают создание элемента: RangeSlider valueFormatter (72 %), Switch defaultChecked→checked, Avatar name («Ли Вонг»→«ЛВ», role+label), Textarea label, Button variant-заливки (5) |
| Темы | dark `--tk-color-surface-base` → **#1a1a1a** (1) |
| Консоль | 0 ошибок (1) |

Скриншоты: `light.png` / `dark.png` (full page).

## Probe-уроки (раунд-1)

1. **role="switch" живёт на нативном input внутри shadow, НЕ на хосте** — проба,
   читавшая host.getAttribute('role'), ложно фейлила; истина на обоих инстансах
   (raw и React) — закон React 19 держит.
2. **`checked` — строгий §4 property-канал**: атрибут `checked=""` НЕ ставит
   состояние (замер: input.checked=false при атрибуте); JS-свойство и React
   `defaultChecked` (через обёртку → свойство) работают. Потребитель обязан
   ставить свойство — контракт, не дефект.
3. label-текст в shadow несёт верстальные переводы строк — сравнение только
   после `.trim()`.

## Итог

Релизный гейт v1.8.0 закрыт раундом-1. Все новинки релиза (range-slider, switch,
avatar, textarea, button positive/negative) рендерятся из тегового чекаута и raw
(Lit), и React-обёртками; токены trade-пары байт-точны; dark жив; консоль чиста.
npm-команды не запускались.
