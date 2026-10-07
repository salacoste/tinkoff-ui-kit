# Пиксельные паспорта v1.9.0 — 16 PNG (batch-confirm, dev-passport)

Инструмент: ImageMagick `magick` (7.x, /opt/homebrew). Метод — молд v1.8.0
(`baseline-review-v180/NOTES.md` § «Паспорта и композиты»): размеры через
`magick identify -format "%wx%h"`, нормированные mean/std через
`-colorspace Gray -format "%[fx:mean] %[fx:standard_deviation]"`. Ошибок
измерения 0. Все 16 файлов — 1280px шириной (фактически проверено), высоты
399–4405.

Каталог: `tests/visual/visual.spec.ts-snapshots/`.

## Таблица паспортов (16 строк)

| # | Файл | WxH | mean | std |
|---|------|-----|------|-----|
| 1 | visual-components-spinner--accessibility-light-1-chromium.png | 1280x630 | 0.966338 | 0.126776 |
| 2 | visual-components-spinner--accessibility-dark-1-chromium.png | 1280x630 | 0.143835 | 0.156488 |
| 3 | visual-components-spinner--api-light-1-chromium.png | 1280x802 | 0.973807 | 0.110308 |
| 4 | visual-components-spinner--api-dark-1-chromium.png | 1280x802 | 0.187119 | 0.245299 |
| 5 | visual-components-spinner--in-button-light-1-chromium.png | 1280x516 | 0.969311 | 0.114288 |
| 6 | visual-components-spinner--in-button-dark-1-chromium.png | 1280x516 | 0.146560 | 0.160870 |
| 7 | visual-components-spinner--playground-light-1-chromium.png | 1280x413 | 0.971155 | 0.109627 |
| 8 | visual-components-spinner--playground-dark-1-chromium.png | 1280x413 | 0.137509 | 0.135565 |
| 9 | visual-components-spinner--sizes-light-1-chromium.png | 1280x399 | 0.971894 | 0.109544 |
| 10 | visual-components-spinner--sizes-dark-1-chromium.png | 1280x399 | 0.134050 | 0.127596 |
| 11 | visual-getting-started--page-light-1-chromium.png | 1280x4405 | 0.957606 | 0.116458 |
| 12 | visual-getting-started--page-dark-1-chromium.png | 1280x4405 | 0.208151 | 0.252563 |
| 13 | visual-components-carousel--api-light-1-chromium.png | 1280x900 | 0.974444 | 0.108894 |
| 14 | visual-components-carousel--api-dark-1-chromium.png | 1280x900 | 0.186965 | 0.245190 |
| 15 | visual-components-toast--api-light-1-chromium.png | 1280x975 | 0.974320 | 0.109691 |
| 16 | visual-components-toast--api-dark-1-chromium.png | 1280x975 | 0.186833 | 0.245142 |

## Непустота (порог std < 0.05 → флаг)

**0 флагов.** Min std по сетке = **0.109544** (spinner--sizes light) — более чем
вдвое выше порога 0.05 и выше v1.8.0-минимума (0.085). Min высота = 399px
(spinner--sizes). Пустых/однотонных кадров нет: даже самые «ровные» light-кадры
(spinner--sizes 0.110, carousel--api 0.109, toast--api 0.110, spinner--api
0.110) несут штатную текстур-нагрузку харнесса (баннер-дисклеймер, hex-таблица,
демо-панели).

## Дифференциация тем (8 пар, порог |Δmean| < 0.02 → флаг)

**0 флагов** — «забытых dark» нет: все пары различаются на 0.75+.

| Пара (сторя) | mean light | mean dark | \|Δmean\| | Флаг |
|---|---|---|---|---|
| spinner--accessibility | 0.966338 | 0.143835 | 0.822503 | нет |
| spinner--api | 0.973807 | 0.187119 | 0.786688 | нет |
| spinner--in-button | 0.969311 | 0.146560 | 0.822751 | нет |
| spinner--playground | 0.971155 | 0.137509 | 0.833646 | нет |
| spinner--sizes | 0.971894 | 0.134050 | 0.837844 | нет |
| getting-started--page | 0.957606 | 0.208151 | 0.749455 | нет |
| carousel--api | 0.974444 | 0.186965 | 0.787479 | нет |
| toast--api | 0.974320 | 0.186833 | 0.787487 | нет |

Диапазон |Δmean| = **0.749–0.838** при пороге 0.02 (v1.8.0 было 0.720–0.856 —
та же полоса, чуть уже).

## Наблюдения (БЕЗ флагов — объяснимые значения)

- **Dark-версии api-страниц имеют std ~0.245 против ~0.11 у light** (spinner--api
  0.2453, carousel--api 0.2452, toast--api 0.2451 — практически идентичны). Та
  же картина, что в v1.8.0 у textarea dark (0.238–0.249): в тёмном кадре
  крупные СВЕТЛЫЕ панели (hex-таблица light→dark — инвариант харнесса,
  code-блоки CEM-таблиц) дают бимодальное распределение яркости → std растёт
  при здоровом кадре. Дифференциация тем при этом 0.787.
- **getting-started--page dark: mean 0.2081 и std 0.2526** — самые высокие
  dark-значения сетки: длинная страница (4405px) с крупными светлыми
  install/code-блоками на тёмном фоне. Ожидаемо по спеке страницы; Δmean пары
  0.749 — минимум сетки, но далеко от порога.
- **Плато light-mean 0.957–0.974** и dark-mean 0.134–0.208 — однородная
  светометрия харнесса между сторями; выбросов нет.
- Высота getting-started 4405 против 4329 в v1.8.0 (+76px) — рост ростера
  страницы между релизами, согласуется с механикой окна (для арбитража —
  реестр/пики оркестратора, не паспорта).
