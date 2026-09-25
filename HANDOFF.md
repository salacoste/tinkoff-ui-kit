# HANDOFF — tinkoff-ui-kit (2026-09-25; v2 финал)

Полная передача проекта новой команде: состояние, план, долги, нюансы, governance. Прочитайте
этот файл целиком перед первым коммитом. Документы-первоисточники помечены путями.

---

## 1. Что это за проект

**tinkoff-ui-kit** — open-source UI kit, воссоздающий дизайн-язык Т-Банка (экс-Тинькофф):
копируем референс системно (токены → компоненты), улучшаем там, где оригинал слаб
(a11y / dark mode / motion / keyboard), и не drift'им визуальную идентичность.

- **Юридическая рамка (НЕНАРУШИМА):** неофициальный учебный проект; ноль товарных знаков
  Т-Банка в публикуемых строках; дисклеймер на каждой поверхности; **шрифты DaytonaSans/
  DaytonaPragma — отдельно лицензированные (© Monotype / © ParaType), НЕ под MIT** — права
  потребителя определяет ТОЛЬКО `packages/tokens/fonts/LICENSE-FONTS.md`.
- **Дистрибуция: ТОЛЬКО GitHub git-теги. npm — НИКОГДА** (решение мейнтейнера 2026-09-23;
  `private: true` во всех пакетах — постоянная защита). Релиз = коммит + `git tag vX.Y.Z` +
  push; релизный гейт = свежий потребитель клонирует тег и проходит рецепт из README до
  рендера кнопки (RELEASE.md §4–§5).
- Владелец/гейты: **salacoste** (мейнтейнер). Публикация релиза и подтверждение базлайнов —
  только его явное решение.

## 2. Текущее состояние

| | |
|---|---|
| **v1** | ✅ RELEASED `v1.0.0` (2026-09-24). 38 стори / 5 эпиков BMAD-плана исполнены. 19 компонентов, 645 юнит + 921 visual/axe тестов, CI зелёный *(поправка 2026-09-25: «зелёный» означало локальные гейты — Actions был красным с 5.5/6962326 до ba0b622; запись — RELEASE.md §1)*, ноль открытых дизайнерских допущений |
| **v2** | ✅ ИСПОЛНЕНА 14/14 (2026-09-25, финал — 8.4). Три домена: /invest/stocks (filter-chips, pagination, combobox-search, data-table, stocks-catalog, mega-nav), /business (stepper, business-landing; cookie-banner — эталон invest/stocks), /invest/mobile (store-badges, qr-block, invest-landing) + v2-токены 6.1 (дельта/warm-cream/регистры — ноль новых типо-токенов; шесть dark-допущений УДЕРЖАНЫ 8.2 с нулём изменений значений) + свипы 8.1/8.2 (54/54 a11y-ячеек; `:host([hidden])` 33/33; engine 19→28; F5 store-badges фикс) + доки 8.3 (9 страниц + registers single-source). **8.4 закрыла v2**: fidelity-ledger 25 строк + жёлтый аудит v2 (0 нарушений) + impeccable kit-wide 207 файлов exit 0 + baseline-пакет расширен (140 новых, 16 adjudicated перезаписей: 256e5cf ×14 + d7c36d6 ×2) + RELEASE.md «Релиз v1.1.0» (тег/рецепт/changelog-драфт — НИЧЕГО не исполнено, тега нет). Итоги: **881 unit + 1368 visual/axe ×2**, 27 компонентов/врапперов, 414 базлайн-PNG, CI: в окне v2 «CI зелёный» писалось по локальным гейтам, а Actions был красным с 5.5/6962326 (typecheck до build, маскировка локальными dist) — чинен ba0b622 2026-09-25, запись RELEASE.md §1. Пруфы: `.playwright-cli/verify/{filter-chips,pagination,combobox-search,mega-nav,data-table,cookie-banner,stocks-catalog,stepper,store-badges,qr-block,business-landing,invest-landing,a11y-sweep,dark-sweep,fidelity-verification-v2}/` + `packages/docs/src/v2/`. Кит-гэпы v2 — в deferred-work (qr-block page-copy слот, button href, input sr-only label, checkbox error, stepper subtitle, promo-card full-bleed, ~32 radius, коричневый токен). ПРАВИЛА ПОРТА: 6007 машинно-глобален; критичные круги — приватный VISUAL_PORT-конфиг (6041 main; 6061 использован 8.4, конфиг удалён) |
| Репо | `github.com/salacoste/tinkoff-ui-kit`, ветка `main`. HEAD документирован в CLAUDE.md |

Стек (ЗАМОРОЖЕН, пере-планирование не требуется): Lit 3.3.3 core (shadow DOM) в
`packages/components` → CEM-манифест → `@lit/react` генерирует React-обёртки в
`packages/react`; `pillkit-{tokens,components,react,docs}` (pnpm workspace); TS 7 strict
(двойной алиас: `typescript=@typescript/typescript6` для tseslint + `@typescript/native`
владеет tsc — НЕ «чинить»), Vite 8, Vitest 5, Playwright 1.63 + axe, Storybook 10.6.
Токены генерируются из DESIGN.md frontmatter (`pnpm gen:tokens`) — hand-правки dist запрещены.

## 3. План v2 (полный — `_bmad-output/planning-artifacts/epics-v2.md`)

Три новых референс-домена: **tbank.ru/business, /invest/mobile-application, /invest/stocks**.
Рекон-пак с доказательствами: `.playwright-cli/captures-v2/{INDEX,NOTES}.md` (там же
UX-фаза-аддендум: точные хексы, OKLCH, живая клавиатура эталона).

**Секвенс:** 6.1 → 6.2+6.3 (батч) → 7.1 → 6.4 → 6.5 → 7.2 → 7.3 (батч) → 7.4 → 7.5 → 8.1–8.3 → 8.4.

- **E6 таблицы:** 6.1 v2-токены (дельта-семантики, warm-cream, флаги dark first-pass);
  6.2 FilterChips+Pagination; 6.3 ComboboxSearch; 6.4 **DataTable** (флагман: типографические
  ряды-ссылки 81px, дельты «цвет несёт направление», + APG-слой: roving tabindex, стрелки,
  Home/End — эталон их НЕ имеет, это санкционированное улучшение); 6.5 композиция каталога
  (после 7.1 — нужен хедер) + живой walkthrough.
- **E7 хром+маркетинг:** 7.1 MegaNav (двухуровневый хедер — расширение tk-navbar; панели
  мега-меню бизнеса = volatile A/B, OUT of scope); 7.2 CookieBanner (Esc НЕ закрывает;
  компонент эмитит consent-choice, хранение — потребитель); 7.3 Stepper+StoreBadges+QrBlock
  (батч трёх дисплейных); 7.4 бизнес-композиция (бенто 2+3 на cream, парящие белые CTA);
  7.5 инвест-лендинг (регистр маркетинга: h1 = heading-2).
- **E8 верификация+релиз:** 8.1 a11y-свип методом 5.1 (9 новых); 8.2 dark-свип молдом 5.4
  (**закрывает [ASSUMPTION] dark-крема**); 8.3 доки (9 страниц + таблица регистров);
  8.4 ledger + **подготовка релиза v1.1.0** (baseline-пакет для мейнтейнера расширяется;
  тег — только после его гейта).

**Гейт компонента (FR-16) = гейт v1 дословно:** impeccable ноль блокеров; axe обеих тем;
сторя (default+варианты+состояния+theming+a11y-заметки incl. keyboard-чеклист + секция
SR-протокола); React-обёртка из CEM; провизорные базлайны + side-by-side против captures-v2;
reduced-motion на всю моторику.

**Ключевые дизайн-решения v2 (уже в спинах, не переоткрывать):**
- Дельты: эталон #00A328/#F52222 **проваливают AA** → семантики `delta-positive/negative`
  указывают на green-300/red-300 (AA-override-паттерн v1); эталонные значения — якоря в DESIGN.md.
- Warm-cream (#F1EEE8 стр / #E9E0D1 карт, hue ~81°) — **отдельная семья** от беж (94°).
- Регистры типографики = МАППИНГИ на существующие токены (маркетинг h1→heading-2 44,
  продукты h1→heading-3 36) — ноль новых типо-токенов, ноль веток в токен-слое.
- Дефекты клавиатуры эталона (инертные стрелки таблицы, фокус-дроп чипов) — кит УЛУЧШАЕТ
  по APG; фидельность покрывает визуал, не баги клавиатуры.

## 4. Технические долги (`_bmad-output/implementation-artifacts/deferred-work.md` — первоисточник)

Открытые (с условиями revisit):
1. ~~**Axe re-entrancy race**~~ — **ЗАКРЫТ 2026-09-24/25 (окно 7.2)**: механизм
   `tests/visual/axe-serialize.ts` (per-worker promise chain + wait-and-retry на «Axe is
   already running», 5 попыток/250ms+; потребляется visual.spec.ts + homepage.spec.ts);
   co-driver = сервируемый axe-бандл Storybook-аддона. Полная запись — deferred-work.md
   (закрытая запись с механизмом).
2. Mono-шрифт-слот — при первой код-поверхности.
3. iOS momentum-scroll модалки — real-device проверка (мейнтейнерская).
4. **SR-спот-чеки VoiceOver+NVDA** — протоколы в 19 сторях, исполнение человеком
   (VoiceOver 19/19 пройден 2026-09-23; NVDA отложен — нет Windows).
5. Cross-surface top-layer stacking точен только на fallback-пути (контроллер).
6. AA-derivation таблица, fold-литералы в gen, preview.ts single-canvas — мелочь с условиями.
Мейнтейнерская очередь (все — ручные гейты, nothing executed): (a) batch-confirm
v2-базлайнов по ЧАСТИ v2 `baseline-review-package.md` (140 новых + 16 adjudicated
перезаписей; фиделити-контекст — `.playwright-cli/verify/fidelity-verification-v2/`)
— **ЗАКРЫТ 2026-09-25: батч подтверждён целиком (salacoste, contact-sheet
`.playwright-cli/verify/baseline-review-v2.html`; ✅-блок в ЧАСТИ v2)**;
(b) **ИСПОЛНЕНО 2026-09-25 — тег `v1.1.0` стоит на `e09fd3c` и запушен**
(Actions success run 36110877833; поставлен по явному живому указанию
мейнтейнера после зелёного вердикта; в тег вошли записи закрытия §8.1.4/§8.1.5);
§8.4 закрыт тем же днём: свежий клон по тегу рендерит DataTable через
React-обёртку (весь чек-лист зелёный, скриншоты обеих тем —
`.playwright-cli/verify/v110-fresh-clone/`); гейт нашёл две поправки рецепта
— `vite.config.ts` с `resolve.dedupe:['react','react-dom']` (патч-дрифт
vite ^8.3; SM-6 проходил без него) и атрибут тёмной темы на `<html>`; обе
внесены в README/RELEASE, запись в deferred-work; (c) SR-спот-чеки v2 — **ЗАКРЫТЫ 2026-09-25: VoiceOver
18/18 ✓, отклонений нет** (run-sheet `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v2.md`,
v2-таблица в PROTOCOL-DIGEST.md); iOS momentum-scroll (п. 3) остаётся
мейнтейнерским долгом, релиз не гейтит;
(d) **РЕШЕНО 2026-09-25 — ОТКАЗ зафиксирован** (deferred-work 7.3, revisit v1.2.0).

## 5. Нюансы и специфика (уроки, оплаченные багами — НЕ переоткрывайте)

**Стек/сборка:**
- Lit на vite8/rolldown требует `experimentalDecorators: true` — TC39-декораторы молча
  пропадают. Не «чинить».
- Корневой `pnpm gen` НЕ покрывает `gen:tokens` — после правки DESIGN.md запускать ОБА.
- `pnpm test` до `pnpm gen` даёт ложный gen-drift (CEM встраивает css-строки) — gen первым.
- `check:tokens-drift` exit 1 до коммита — by design (сравнивает с HEAD).
- CEM module order недетерминирован — sortModulesPlugin уже стоит.
- Потребителю: `pnpm add -w` на воркспейс-руте; `pnpm exec` вместо `npx` (packageManager-
  поле ломает npm-кли); минимальный index.html ОБЯЗАН иметь `<meta charset="utf-8">`.

**CSS/CEM:**
- `::slotted(button:focus-visible)` — правильно; `::slotted(button):focus-visible` —
  парсер МОЛЧА выкидывает правило (баг ловили в 5.1).
- `@СЛОВО` в css.ts jsdoc → CEM парсит как block-tag и обрезает description.
- Popover-UA-сбросы (`inset: auto; margin: 0; border: 0`) нужны на КАЖДОЙ top-layer
  поверхности — попалось дважды (scrim модалки, toast-хост).

**Lit/оверлеи:**
- First-update change-map: mount-time `open-change(false)` — guard `wasOpen !== undefined`;
  тесты вешают слушатель ДО connect (вакуозный класс ловили 3 раза).
- После любого `await` в open/close — ревалидация state+isConnected; disconnect-during-open
  не должен течь (молд navbar.ts + регресс-тесты).
- Idrefs (aria-labelledby/describedby) — внутри одного shadow-дерева; light-DOM панели
  валит axe.
- Формы: formAssociated + ElementInternals.setFormValue (form-owner Chromium останавливается
  на shadow-root).
- Open-state базлайны невидимы story-скриншотам (top-layer) — per-component spec с
  page-level clip (молд select.spec.ts).
- Кросс-темные хуки требуют dark-маппингов (lightblue-200 — только light).

**Процесс:**
- Цикл стори: спек (frozen-блок + I/O-матрица) → executor-субагент → quick-review-линза
  (читает спек+диф; ловит то, что гейты не видят) → триаж → патчи тому же агенту →
  ПОЛНЫЕ гейты оркестратором → закрытие спека → conventional commit + push.
- Базлайны: update-флоу НЕ перезаписывает ниже порога 1.5% — удаляйте PNG явно.
- Изображения: харнес текстовый — vision только через zai-MCP на сохранённых файлах.
- Браузер: ТОЛЬКО playwright-cli (`export PLAYWRIGHT_CLI_SESSION=tinkoff-ui`), никакого
  browser-MCP. На живом референсе — ничего не вводить/не сабмитить.
- Языки: контент сторей RU, story meta EN (стабильность базлайнов); коммиты EN conventional.
- Субагенты не редактируют `_bmad-output/` (кроме санкционированных дописок) — триаж
  записывает оркестратор. Если субагент завис (~6 минут без записей на диск и без процессов) —
  kill и рестарт с точкой остановки + ревалидацией сделанного; это работает.

**Гейты (зелёные перед каждым коммитом):**
```
pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && pnpm gen:tokens
git add -A && pnpm gen && git diff --exit-code   # gen-drift
pnpm test:visual                                  # 1368 тест, compare-режим
```
CI (GitHub Actions) гоняет всё это + impeccable headless детектор на каждый push.

## 6. Карты файлов

| Что | Где |
|---|---|
| План v2 (сториби) | `_bmad-output/planning-artifacts/epics-v2.md` |
| PRD §4.8 / FR-12..16 | `_bmad-output/planning-artifacts/prds/prd-.../prd.md` |
| Дизайн-спины (норматив) | `.../ux-designs/ux-.../{DESIGN,EXPERIENCE}.md` + .memlog.md |
| Арх-спайн + v2-дельта | `.../architecture/arch-.../ARCHITECTURE-SPINE.md` |
| Спеки (28 закрытых — молды) | `_bmad-output/implementation-artifacts/spec-*.md` |
| Долги | `_bmad-output/implementation-artifacts/deferred-work.md` |
| Релизный чеклист | `RELEASE.md` (RU) |
| Референсы v1 / v2 | `.playwright-cli/captures/` / `.playwright-cli/captures-v2/` |
| Per-story доказательства | `.playwright-cli/verify/<компонент>/` |
| Контракт API | `packages/components/CONVENTIONS.md` (§4/§9 FROZEN) |
| Оверлей-механика | `packages/components/src/overlays/` (AD-12) |
| Пакет базлайнов (v1 закрыт; ЧАСТЬ v2 — гейт v1.1.0) | `_bmad-output/implementation-artifacts/baseline-review-package.md` |
| Фиделити-ledger v2 (25 строк) + жёлтый аудит + impeccable | `.playwright-cli/verify/fidelity-verification-v2/` |
| Релиз v1.1.0 (тег/рецепт/changelog-драфт) | `RELEASE.md`, раздел «Релиз v1.1.0» (§8.1–8.7) |

## 7. С чего начать

1. Прочитать этот файл + CLAUDE.md + epics-v2.md.
2. Прогнать гейты на HEAD (все зелёные — точка входа чистая).
3. v2 ИСПОЛНЕНА целиком (6.1 → 8.4; все 14 спеков закрыты, история — в §2 и
   spec-триажах). Следующая работа — только мейнтейнерская очередь §4
   (v2-батч → тег v1.1.0 → SR-чеки → коричневый токен); после тега —
   свежий потребитель по RELEASE.md §8.4 (tk-data-table). Новые стори
   (если появятся) — по циклу §5, гейт компонента = FR-16 дословно.
4. Вопросы мейнтейнеру — только на гейтах: v2-батч базлайнов, релизный тег,
   SR-чеки, коричневый токен — всё остальное автономно по плану.

*Составлено оркестратором autonomous-прогона (2026-09-24; v2-финал — 8.4,
2026-09-25). Всё, что здесь не сказено, ищите в memlog-ах спинов и
spec-триажах — проект ведёт полную аудиторскую историю.*
