# HANDOFF — tinkoff-ui-kit (2026-09-24)

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
| **v1** | ✅ RELEASED `v1.0.0` (2026-09-24). 38 стори / 5 эпиков BMAD-плана исполнены. 19 компонентов, 645 юнит + 921 visual/axe тестов, CI зелёный, ноль открытых дизайнерских допущений |
| **v2** | 🚧 6.2+6.3+7.1+6.4+7.2+6.5+7.3 ИСПОЛНЕНЫ (7.3: трио tk-stepper + tk-store-badges + tk-qr-block — worktree d199a79 → merge d6a9f2c → lens-fix 6cb2234; lens SHIP 0/2/7: zero-state центрирован W1, дефолтный alt иконки декоративный W2; qr tablist = v1 tk-tabs скомпонован дословно; КОРИЧНЕВЫЙ бейдж #8D6040 — flag мейнтейнеру в deferred-work, токен принадлежит токен-слою). Итоги окна: 873 unit + visual 1244/1244 ×2 (приватный порт 6041), 27 компонентов/врапперов; пруфы — `.playwright-cli/verify/{filter-chips,pagination,combobox-search,mega-nav,data-table,cookie-banner,stocks-catalog,stepper,store-badges,qr-block}/`. В РАБОТЕ ПАРАЛЛЕЛЬНО: 7.4 (business-landing showcase, порт 6051) ∥ 7.5 (invest-landing showcase, порт 6061) — обе компонуют сложившееся трио; после них 8.1–8.3 (sweeps+docs, порт-протокол как выше) → 8.4 (release PREP, БЕЗ тега — гейт мейнтейнера). ПРАВИЛА ПОРТА: 6007 машинно-глобален; ownership необходим, свежесть контента — настоящая гарантия; критичные круги — приватный VISUAL_PORT-конфиг (6041/6051/6061 распределены) |
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
1. **Axe re-entrancy race** — «Axe is already running» в visual-сьюте (3 случая; рецепт
   фикса: per-frame сериализация промисов в хелпере visual.spec.ts). Самый достойный первый PR.
2. Mono-шрифт-слот — при первой код-поверхности.
3. iOS momentum-scroll модалки — real-device проверка (мейнтейнерская).
4. **SR-спот-чеки VoiceOver+NVDA** — протоколы в 19 сторях, исполнение человеком
   (VoiceOver 19/19 пройден 2026-09-23; NVDA отложен — нет Windows).
5. Cross-surface top-layer stacking точен только на fallback-пути (контроллер).
6. AA-derivation таблица, fold-литералы в gen, preview.ts single-canvas — мелочь с условиями.
Мейнтейнерская очередь: batch-confirm новых v2-базлайнов (8.4); ratify-поверхность RELEASE.md §0.

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
pnpm test:visual                                  # 921 тест, compare-режим
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
| Пакет базлайнов (закрыт v1) | `_bmad-output/implementation-artifacts/baseline-review-package.md` |

## 7. С чего начать

1. Прочитать этот файл + CLAUDE.md + epics-v2.md.
2. Прогнать гейты на HEAD (все зелёные — точка входа чистая).
3. Стори 6.1 по циклу §5 — ✅ исполнена 2026-09-24 (spec-6-1 закрыт, c999e12;
   нюанс входа: гейты на 1dcf272 были красные ровно в одном шве — gen:tokens/токен-дрифт
   на v2-строках DESIGN.md; 6.1 этот шов закрыла). Стори 6.2 — ✅ исполнена 2026-09-24
   (spec-6-2 закрыт: filter-chips + pagination; нюанс входа: реализация найдена в
   ворктри после зависшей сессии исполнителя — аудиторский след восстановлен из
   транскрипта, триаж/фиксы/верификация довершены оркестратором). Стори 6.3 — ✅
   исполнена 2026-09-24 (spec-6-3 закрыт: combobox-search; полный цикл с параллельным
   треком 7.1 в worktree — родилось правило сериализации test:visual). Стори 7.1 — ✅
   исполнена 2026-09-24 (spec-7-1 закрыт: 736191e + truing b068bb8 в worktree, merge 0ec0790,
   гейты на main 784 unit / visual 1065×2; прецедент Spec Change Log: пиксели опровергли два
   замороженных утверждения анатомии — активный саблинк ИМЕЕТ подчёркивание 2px + межрядный
   разделитель 1px существуют). В работе: 6.4 + 7.2 параллельно (executor на main +
   executor в worktree; спеки 1bc8ee5 / 2b77d31).
4. Вопросы мейнтейнеру — только на гейтах: базлайны-партия (8.4), релизный тег, всё
   остальное автономно по плану.

*Составлено оркестратором autonomous-прогона (2026-09-24). Всё, что здесь не сказено,
ищите в memlog-ах спинов и spec-триажах — проект ведёт полную аудиторскую историю.*
