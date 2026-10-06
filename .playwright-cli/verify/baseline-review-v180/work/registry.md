# PNG-реестр окна batch-confirm v1.8.0 — независимая сверка (dev-registry)

Диапазон: `ff0e423..bbad7f6` (8 коммитов с events в tests/). Теговый коммит: `bbad7f6`. HEAD на момент сверки: `fa3e853`.
Каталог базлайнов: `tests/visual/visual.spec.ts-snapshots/` — на bbad7f6 содержит 738 файлов (все PNG: 738); из них окно затрагивает 54.

## Сводка по группам

| Группа | Семейство | Заявлено | Фактически | Совпадает |
|---|---|---|---|---|
| G1 | rangeslider (accessibility, api, calculator, playground, variants) | 10 | 10 | да |
| G2 | switch (accessibility, api, playground, settings, variants) | 10 | 10 | да |
| G3 | avatar (accessibility, admin-feed, api, news-row, playground, variants) | 12 | 12 | да |
| G4 | input (api, code-accessibility, code-mode, confirmation) | 10 | 8 | НЕТ |
| G5 | textarea (accessibility-notes, notes, states) | 6 | 6 | да |
| G6 | terminal (button--api, invest-terminal-ticket, token-reference--colors) | 6 | 6 | да |
| G7 | getting-started--page | 2 | 2 | да |
| **Итого** | | **56** | **54** | **НЕТ** |

Примечание к G4: перечень стори в задании (api, code-accessibility, code-mode, confirmation) даёт 4×2 = 8 файлов — цифра «×10» не согласуется с самим перечнем. Фактические события покрывают ровно 8 файлов и ровно эти 4 стори; лишних input-базлайнов в окне нет.

## Реестр событий (56-заявленный / 54-фактический)

| Группа | Файл | События (hash:статус, старые→новые) | Forensic (первое событие окна) |
|---|---|---|---|
| G1 | `visual-components-rangeslider--accessibility-dark-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--accessibility-light-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--api-dark-1-chromium.png` | e02825f:A, 3f92922:M | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--api-light-1-chromium.png` | e02825f:A, 3f92922:M | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--calculator-dark-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--calculator-light-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--playground-dark-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--playground-light-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--variants-dark-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G1 | `visual-components-rangeslider--variants-light-1-chromium.png` | e02825f:A | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G2 | `visual-components-switch--accessibility-dark-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--accessibility-light-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--api-dark-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--api-light-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--playground-dark-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--playground-light-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--settings-dark-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--settings-light-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--variants-dark-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G2 | `visual-components-switch--variants-light-1-chromium.png` | 04f19c4:A | 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) |
| G3 | `visual-components-avatar--accessibility-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--accessibility-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--admin-feed-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--admin-feed-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--api-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--api-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--news-row-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--news-row-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--playground-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--playground-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--variants-dark-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G3 | `visual-components-avatar--variants-light-1-chromium.png` | 8452765:A | 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) |
| G4 | `visual-components-input--api-dark-1-chromium.png` | aa78856:M | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--api-light-1-chromium.png` | aa78856:M | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--code-accessibility-dark-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--code-accessibility-light-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--code-mode-dark-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--code-mode-light-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--confirmation-dark-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G4 | `visual-components-input--confirmation-light-1-chromium.png` | aa78856:A | aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) |
| G5 | `visual-components-textarea--accessibility-notes-dark-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G5 | `visual-components-textarea--accessibility-notes-light-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G5 | `visual-components-textarea--notes-dark-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G5 | `visual-components-textarea--notes-light-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G5 | `visual-components-textarea--states-dark-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G5 | `visual-components-textarea--states-light-1-chromium.png` | bf4e167:A | bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) |
| G6 | `visual-components-button--api-dark-1-chromium.png` | 75d9ef5:M | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G6 | `visual-components-button--api-light-1-chromium.png` | 75d9ef5:M | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G6 | `visual-invest-terminal-ticket--terminal-ticket-dark-1-chromium.png` | 75d9ef5:A | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G6 | `visual-invest-terminal-ticket--terminal-ticket-light-1-chromium.png` | 75d9ef5:A | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G6 | `visual-token-reference--colors-dark-1-chromium.png` | 75d9ef5:M | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G6 | `visual-token-reference--colors-light-1-chromium.png` | 75d9ef5:M | 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens |
| G7 | `visual-getting-started--page-dark-1-chromium.png` | e02825f:M, 8452765:M, aa9bbcf:M | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |
| G7 | `visual-getting-started--page-light-1-chromium.png` | e02825f:M, 8452765:M, aa9bbcf:M | e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) |

Статусы: A — добавлен в окне, M — существовавший до окна базлайн, обновлён в окне. Коммиты окна (старые→новые): e02825f feat(components): tk-range-slider — native-range amount slider (spec 26.1) // 3f92922 fix(visual): rangeslider api baselines reminted on the aria-label manifest (spec 26.1) // 04f19c4 feat(components): tk-switch boolean toggle — APG switch contract, kit-register capsule (story 26.2) // 8452765 feat(components): tk-avatar — round identity disc (image/initials/placeholder) // aa78856 feat(input): code mode — one-digit SMS cells (spec 26.4, closes Epic 26) // bf4e167 feat(components): 24T.1 tk-textarea — the terminal notes atom (autosize 16·n+16, frozen input-family contract) // 75d9ef5 feat(components): 24T.2 terminal ticket — pattern story + button trade pair + trade tokens // aa9bbcf docs(release): v1.8.0 — RELEASE §15 + HANDOFF + README pins, bank counter 41→45

## Не-PNG события в tests/ (вне базлайн-реестра, информационно)

- @e02825f M tests/hidden-guard.test.ts
- @04f19c4 M tests/hidden-guard.test.ts
- @04f19c4 A tests/visual/switch.spec.ts
- @8452765 M tests/hidden-guard.test.ts
- @aa78856 A tests/visual/input-code.spec.ts
- @bf4e167 M tests/hidden-guard.test.ts
- @bf4e167 A tests/visual/textarea.spec.ts
- @75d9ef5 A tests/visual/terminal-ticket.spec.ts

## РАСХОЖДЕНИЯ

- PNG-события вне tests/ и вне captures-v5: 71 шт. в одном коммите — .playwright-cli/verify/kit-recon/ (см. секцию «PNG-события вне tests/»); это референс-капчуры сторонних китов, НЕ базлайны сюиты
- счёт G4: фактически 8, заявлено 10
- итого файлов: фактически 54, заявлено 56. Заявление G4 "×10" внутренне несогласовано с его же перечнем стори (api, code-accessibility, code-mode, confirmation = 4×2 = 8)

## PNG-события вне tests/ (весь диапазон, без pathspec; 29 коммитов)

- Вне tests/ и вне `.playwright-cli/captures-v5/`: **71** — `9a1011a` feat(recon): 25.3 visual reference — 10 kit docs galleries, 51 honest PNGs; все статусы A; расположение: `.playwright-cli/verify/kit-recon/`. Это референс-капчуры сторонних китов (antd/carbon/mantine/mui/polaris/radix/shadcn/shoelace/spectrum/polaris/taiga: галереи + composite-* + vision-*) — НЕ базлайны сюиты, НЕ часть PNG-реестра окна; на реестр не влияют. Полный перечень:
  - `.playwright-cli/verify/kit-recon/antd-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/antd-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/antd-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/antd-table-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/antd-table-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/carbon-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/carbon-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/carbon-input-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-antd.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-carbon.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-mantine.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-mui.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-polaris.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-radix.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-shadcn.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-shoelace.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-spectrum.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/composite-taiga.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mantine-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mantine-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mantine-table-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-button-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-input-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/mui-input-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/polaris-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/polaris-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/polaris-webcomponents-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/polaris-webcomponents-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-accordion-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-accordion-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-dialog-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-dialog-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/radix-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-button-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-input-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shadcn-input-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-button-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-dialog-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-dialog-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-gallery-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-input-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/shoelace-input-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/spectrum-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/spectrum-field-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/spectrum-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-button-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-button-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-gallery-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-input-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-input-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-table-dark.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/taiga-table-light.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-antd.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-carbon.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-mantine.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-mui.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-polaris.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-radix.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-shadcn.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-shoelace.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-spectrum.png` @9a1011a:A
  - `.playwright-cli/verify/kit-recon/vision-taiga.png` @9a1011a:A
- `.playwright-cli/captures-v5/` (капчуры, НЕ базлайны, вне scope реестра): 28 событий PNG в 1 каталог(ах) — .playwright-cli/captures-v5/terminal: 28; коммит: `7e99340` docs(captures): 24T terminal pack — 28 PII-gated PNG + 6 DOM dumps + measured passports (story 24T captures). Подтверждено: captures-v5/terminal — капчуры терминала, вне scope базлайн-реестра.

## Метод

`git log --name-status -M --format="COMMIT %h %s" ff0e423..bbad7f6 -- tests/` (84 строки) · полный диапазон без pathspec (408 строк) · `git ls-tree -r --name-only bbad7f6 -- tests/visual/visual.spec.ts-snapshots/` (738) · `git log --name-only bbad7f6..HEAD -- tests/` (0 байт). Скрипт: build-registry.mjs. Полные PNG в контекст не читались.
