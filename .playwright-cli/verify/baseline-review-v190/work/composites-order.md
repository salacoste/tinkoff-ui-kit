# Композиты v1.9.0 — карта порядка тайлов (сайдкар для qa-vision)

Метод — молд v1.8.0, урок 21.2: append-build (`-resize 560x` → `+append` по
горизонтали → `-append` по вертикали, белый фон), НЕ `montage`. Подписей на
тайлах НЕТ — соответствие позиций файлам даёт эта карта. Белые доборы
(выравнивание высот рядов снизу, хвост 2-тайлового ряда справа) — ХРОМ сборки,
не контент кадра.

Выравнивание в рядах: `-gravity North` — короткие тайлы дополняются белым
СНИЗУ до высоты самого высокого тайла ряда.

## composite-G1.png — 2240x752 (verify: magick identify)

Спиннер, 10 тайлов, 3 ряда (4+4+2), тайл 560px:

- **Ряд 1 (высота 351, выравнивание по spinner--api 802→351):**
  1. [колонка 1] `visual-components-spinner--accessibility-light-1-chromium.png` (630→276, белый довес снизу 75)
  2. [колонка 2] `visual-components-spinner--accessibility-dark-1-chromium.png` (630→276, белый довес снизу 75)
  3. [колонка 3] `visual-components-spinner--api-light-1-chromium.png` (802→351, задаёт высоту ряда)
  4. [колонка 4] `visual-components-spinner--api-dark-1-chromium.png` (802→351, задаёт высоту ряда)
- **Ряд 2 (высота 226, выравнивание по in-button 516→226):**
  5. [колонка 1] `visual-components-spinner--in-button-light-1-chromium.png` (516→226, задаёт высоту ряда)
  6. [колонка 2] `visual-components-spinner--in-button-dark-1-chromium.png` (516→226, задаёт высоту ряда)
  7. [колонка 3] `visual-components-spinner--playground-light-1-chromium.png` (413→181, белый довес снизу 45)
  8. [колонка 4] `visual-components-spinner--playground-dark-1-chromium.png` (413→181, белый довес снизу 45)
- **Ряд 3 (высота 175, 2 тайла + белый хвост справа до 2240):**
  9. [колонка 1] `visual-components-spinner--sizes-light-1-chromium.png` (399→175)
  10. [колонка 2] `visual-components-spinner--sizes-dark-1-chromium.png` (399→175)
  11. [колонки 3–4] БЕЛЫЙ хвост 1120x175 (`-gravity West -extent 2240x`) — хром, не контент.

## composite-G2.png — 1120x1927 (verify: magick identify)

Getting-started, 2 тайла, один ряд (молд v1.8.0 G7 — 2 колонки):

1. [колонка 1] `visual-getting-started--page-light-1-chromium.png` (1280x4405 → 560x1927)
2. [колонка 2] `visual-getting-started--page-dark-1-chromium.png` (1280x4405 → 560x1927)

Оба тайла одинаковой высоты — дополнений нет. ВАЖНО: это «visual-getting-started»
(основной кит), НЕ «visual-tj-getting-started».

## composite-G3.png — 2240x427 (verify: magick identify)

Carousel + toast (api-стороны), 4 тайла, один ряд (высоту задаёт toast 975→427):

1. [колонка 1] `visual-components-carousel--api-light-1-chromium.png` (900→394, белый довес снизу 33)
2. [колонка 2] `visual-components-carousel--api-dark-1-chromium.png` (900→394, белый довес снизу 33)
3. [колонка 3] `visual-components-toast--api-light-1-chromium.png` (975→427, задаёт высоту ряда)
4. [колонка 4] `visual-components-toast--api-dark-1-chromium.png` (975→427, задаёт высоту ряда)

## Verify-сводка (magick identify, исполнено после сборки)

| Файл | Размер | Расчётное | Сходится |
|---|---|---|---|
| composite-G1.png | 2240x752 | 351+226+175=752 | да |
| composite-G2.png | 1120x1927 | 1927 | да |
| composite-G3.png | 2240x427 | 427 | да |

Все тайлы исходно 1280px шириной → resize 560x даёт масштаб 0.4375 без искажений
пропорций (высоты округлены ImageMagick до целого).
