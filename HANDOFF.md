# HANDOFF — tinkoff-ui-kit (2026-10-01; v1.5.0 ВЫПУЩЕН — тег поставлен по «tag ok» и ПЕРЕМЕЩЁН на fix-голову `c7fe548` после находки Flow-B раунд-1; гейт закрыт раунд-2 23/23 PASS; batch-confirm прироста и Release-страницы v1.4.0/v1.5.0 закрыты тем же днём; очередь §4 = живой VO + iOS + Graphik-бриф)

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
| **v1.2.0 / эпики-v3** | ✅ ИСПОЛНЕНА 8/8 стори-юнитов (2026-09-26, финал — 11.3): 9.1 (tint-brown + font-mono токены; brown-badge ADOPTED — белый нумерал на коричневом, AA 5.413:1; radius-3xl REFUSED пробой 23.8px — «≈32» был артефактом зрения; tooltip 288px-cap) + 9.2 (генератор-истина: aa-annotations из DESIGN.md, AD-4 single-source) + 10.1+10.2 (sr-only ×2, error-канал, слоты subtitle/page-copy; референс-дословные копии лендингов — render-верификация после lens-MAJOR на выдуманном подзаголовке) + 10.3 (promo-card art-mode=bleed + floating-pill, оффсет space-32 Δ=0) + 10.4 (button href/target/rel; no-href байт-идентичен; НОЛЬ отклонений спека — первый в цикле) + 11.1 (a11y-свип режимов: +12 engine-ног, group-VI 42/42, SR-RUNSHEET-v1.2.0) + 11.2 (доки-mono: --tk-font-mono первый потребитель, 36+2+36 перезаписей, харнесс-пин JetBrains Mono) + 11.3 (эта — verification ledger v1.2.0 + жёлтый аудит + impeccable + ЧАСТЬ v1.2.0 + RELEASE §9 + этот close). Итоги: **943 unit + 1380 visual/axe**, 414 базлайн-PNG (392 сюиты + 22 per-component; файлов за окно не прибавилось), packages/react ZERO diff (пропсы едут через CEM). Пруфы: `.playwright-cli/verify/{tokens-9-1,tokens-9-2,batch-10-1-10-2,promo-card-10-3,button-10-4,docs-11-2,a11y-sweep/group-VI.md,fidelity-verification-v1-2-0}/`. Тег НЕ ставился (гейт мейнтейнера — очередь ниже) |
| **v1.3.0 / эпики-v4** | ✅ ИСПОЛНЕНА 7/7 стори-юнитов (2026-09-28, финал — 14.2): 12.1 (доки-рестракчер по повершруппам Bank/Business/Invest — 10 story-id переименований, байты не тронуты) + 12.2 (капчу-паки v3: bank-вертикаль + per-vertical INDEX-конвенция) + 13.1 (admin gap-map + ПАК: 8 PII-редактированных поверхностей консоли, maintainer-session; roster-ратификация: sidebar-nav DROPPED, empty-state/drawer dropped, avatar-menu split) + 13.2 (tabs `indicator="underline"` + страница паттерна Console chrome + DESIGN.md console-language секция) + 13.3 (badge neutral/attention + хуки `--tk-badge-fill`/`--tk-badge-text` + progress-bar `--tk-progress-bar-height` + страница Data surfaces) + 14.1 (Group VII свип: 9 ног, файл 108; SR-протоколы ×5; поиск 30 записей; theming-фигура; stale-claim свип) + 14.2 (эта — verification ledger v1.3.0 + жёлтый аудит с консольной дисциплиной + impeccable 209 файлов + ЧАСТЬ v1.3.0 + SR-RUNSHEET-v1.3.0 + RELEASE §10 + этот close). Interlude между окнами: mono-extension (33 правила + 151 базлайн), tree-identity гард порта 6007, cookie-banner 7.2(c) REFUSED. Итоги: **951 unit + 1438 visual/axe**, **430 базлайн-PNG** (+16: консольное семейство + 2 страницы паттернов), packages/react + tokens ZERO diff. Пруфы: `.playwright-cli/verify/{a11y-sweep/group-VII.md,fidelity-verification-v1-3-0/,admin-13-1/,mono-extension/}` + `captures-v3/`. Тег НЕ ставился (гейт мейнтейнера — очередь ниже) |
| **Полиш-раунд пост-релиз** | ✅ (2026-09-28, санкция «lets continue to improve», три направления выбраны): нав-регруппировка доков `43fb084` (Components v2 → **Guides** 9 + **Patterns** 2; 26 базлайнов prefix-move байт-идентично, 2 cookie-страницы пересняты под точный кейсинг; поиск/якоря синхронизированы; CI success 36415613440; форензика — `.playwright-cli/verify/docs-regroup/NOTES.md`) + OSS-оформление `a1148f9` (README-свежесть: 27 компонентов/v1.3.0-пины/«независимый»; CONTRIBUTING.md; шаблоны issue ×2 + PR — с PII-гейтом) + админ-подготовка `0cbe955` (ранбук 3 открытых состояний — avatar-menu/кебаб/overflow, read-only, PII-редакция ДО передачи; драфт гэп-мапы menu-popover — НЕ спек). Направления дальше: **ТЖ = ОТДЕЛЬНЫЙ экспортируемый под-кит** (директива мейнтейнера, эпики-v5 — планирование по слову), админ остаётся first-class |
| **v1.4.0 / эпики-v5 (ТЖ)** | ✅ ИСПОЛНЕНА 12/12 стори-юнитов (2026-09-30, финал — 17.5): Т-Журнал как **отдельный экспортируемый кит** `pillkit-tj-{tokens,components,react}` с нулём runtime-зависимостей в обе стороны (FR-17 механизован: boundary-тесты ×2 + eslint-полосы + ad4-матрица; OQ-10 — один git-тег-поезд, своя секция CHANGELOG). 15.1–15.3 (скаффолд тройки, токеновый слой dual-emit `:host`/`:host(:not([data-tj-theme="light"]))` + AA-пины, шрифты OQ-8: Inter/PT Serif слоты, zero-fonts инвариант, Graphik/Charter путь задокументирован) + 16.1–16.6 (10 `tj-*`: prose/link/cta, rubric-header/news-card/tag-chip + /pro/ purple-hero, композер/post-card — первая stateful-пара, header/rail + burger-drawer AD-12 + `--tj-z-*`, статья + ad-slot-рецепт на банковских `--tk-promo-card-*` хуках) + 17.1+17.2 (a11y 140 ног + dark 45, extraction-verification) + 17.3 (доки-комплишн: token-reference + theming-guide + 4 страницы паттернов + API-таблицы ×10 + getting-started Flow-A; 50 movers) + 17.4 (квартет: fidelity ledger 11 строк, ad-language аудит **0 значений**, impeccable **297 файлов** exit 0, ЧАСТЬ v1.4.0 — 14 коммитов / 204 PNG-события) + 17.5 (эта — версии ×6 → 1.4.0 ИСПОЛНЕНО в-story + CHANGELOG `[1.4.0] - 2026-09-30` + RELEASE.md §11 + этот close). CI-цепочка окна записана честно: 58d979e 3× timeout-cancel (~30:20, `timeout-minutes: 30` — timeout-kill репортится как cancel; поднят 30→60 в `202beb1`) → 36617540273 RED axe×5 (ссылки на surface-muted 4.24:1 — закон) → фикс `d02a483` → **36623061743 GREEN** (~28 мин); close-out `63bba27` → **36626757077 GREEN**. Итоги: **1267 unit + 2123 visual/axe ног (23 файла)**, **544 базлайн-PNG сюиты + 25 per-component** (+136, всё ТЖ, 0 удалено), 37 компонентов (27 банк + 10 ТЖ). Пруфы: `.playwright-cli/verify/{fidelity-verification-v1-4-0/,tj-a11y-sweep/,tj-dark-sweep/}` + `captures-v3/tj/` + `packages/docs/src/tj/`. Тег НЕ ставился (гейт мейнтейнера — очередь ниже) — **СВЕРХ ТОЧКИ: тег v1.4.0 ПОСТАВЛЕН 2026-09-30 по явной санкции «new tag ok»** (tag-объект `0e620018` на `6510262`, remote сверен deref; RELEASE §11.3 «ИСПОЛНЕНО») **+ Flow-A §11.4 свежий потребитель ПРОЙДЕН 3/3** (census = ровно ТЖ-тройка @1.4.0, ноль банковских пакетов; пруфы `verify/v140-fresh-clone/`) |
| **post-v1.4.0 окно → v1.5.0** | ✅ ИСПОЛНЕНА (2026-09-30 → 2026-10-01): очередь §4 v1.4.0 закрыта до мейнтейнер-хвостов — (a) batch-confirm ЧАСТЬ v1.4.0 делегированным ретро-присестом (**139 ног все ✅**, 0 флагов/перезаписей; коммит `61b6716`); (e) **18.1** tj-header метрики (чипы 36→**40px** 7×2 ноль разброса, CTA 36→**30px** байт-в-байт; дельта суб-1.5% — реминт отменён законом, истина в юнит-пинах; `0c88291`); **18.2** README-freshness (пин v1.4.0, devEngines-ловушка, `--prefer-offline`; `827f0c6`); (d) рулинги B/сплит/XCharter → **18.3** `pillkit-tj-fonts` (XCharter ×4 woff2 В ДЕРЕВЕ по Bitstream-условиям, Graphik — только face-рецепт; ad4-регистрация; lockfile-importers урок; `fccfe44`→фикс `a485cab`); **18.4** доки-актуализация ×10 устареваний (`87538af`); (f) follow-up капчи доставлены (5 PNG captures-v3/admin, ПД-заливки) → **19.1** `tk-menu-popover` + `tk-menu-item`/`tk-menu-divider` (`9bdd14d`, 52 файла) — **Epic 19 «admin follow-up» ОТКРЫТ**: APG-меню поверх overlay-контроллера, host-делегированный pull-anchor (молд tooltip), `alignment:'start'|'end'` в computeFloatingPosition (прецедент matchAnchorWidth), sweep-VII строка measured, регион-спека с геометрия-пинами. CI-цепочка окна — ВСЕ GREEN: 36705793707 / 36709057024 / 36715355750 (после 26-с RED lockfile-фикса) / 36718261116 / 36721958634 / 36725989337 / **36749011384** (19.1: полный compare **2182/2182** двухпроходный) / 36754900566. Итоги: **40 компонентов** (30 банк + 10 ТЖ), **562 базлайн-PNG сюиты** (+18 menu-popover), регион-наборы 12×2. **19.2 release-prep v1.5.0** (2026-10-01, санкция «go»): версии ×7 → 1.5.0 + CHANGELOG `[1.5.0] - 2026-10-01` + RELEASE.md §12 + пины тега. **РЕЛИЗ ЗАВЕРШЁН тем же днём:** штамп `9e3c32b` (CI 36812781743 GREEN) → **тег v1.5.0 поставлен по «tag ok»** (на `9e3c32b`, tag-объект `b828a98c`) → **Flow-B §12.4 раунд-1 НАШЁЛ продуктовый дефект на теговых битах** (закон React 19: конструкторные атрибуты не выживают создания элемента — React-композиции получали ряды без role) → фикс `c7fe548` (роли в `connectedCallback`; CI 36820396725 GREEN; полный compare 2182/2182) → **по решению мейнтейнера тег ПЕРЕМЕЩЁН на `c7fe548`** (§7, tag-объект `df4c3c8`, потребителей нет) → **раунд-2 23/23 PASS** (роли/геометрия/клавиатура/события/dark/консоль; ценсус pillkit-*@1.5.0; prod подтверждён) — полная запись `verify/v150-fresh-clone/`, штампы RELEASE §12.3/§12.4/§12.7 |
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

**Мейнтейнерская очередь v1.2.0 (открыта 11.3, все — ручные гейты, nothing
executed):** (a) batch-confirm базлайнов окна v1.2.0 по ЧАСТИ v1.2.0
`baseline-review-package.md` (реестр 11 коммитов / 163 PNG-события с
forensic-однострочниками; порядок присеста ~1 час — v1.2.0-§3) — **ЗАКРЫТ
2026-09-27: пакет подтверждён одним присестом salacoste (все 6 групп;
три санкционированные перезаписи исполнены, CI GREEN каждая; ✅-блок в
ЧАСТИ v1.2.0)**; (b) релиз
v1.2.0 по RELEASE.md «Релиз v1.2.0» §9.1–9.5 (версии + CHANGELOG из драфта
§9.5 + **тег v1.2.0 — ТОЛЬКО мейнтейнер** + свежий клон §9.4 рендерит
tk-promo-card в bleed-режиме; §9.6 — JetBrains Mono ТЕСТ-ТОЛЬКО, не
поставляемый ассет) — **ИСПОЛНЕНО 2026-09-27: §9.1–9.2 зелёные (релизный
коммит `7d3b3db`, run 36319189468 success); тег `v1.2.0` стоит на
`7d3b3db` и запушен (аннотированный, тег-объект `2855ec2`, поставлен по
явной санкции мейнтейнера с делегированием исполнения); §9.4 — гейт
ПРОЙДЕН (обе темы, клон по тегу; §9.6 перепроверен). Штампы — RELEASE.md
§9.3/§9.4; полная запись — NOTES §§10–12
`.playwright-cli/verify/baseline-review-v120/`**; (c) исполнить
`.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md` — файл написан
историей 11.1 (14 пустых строк по семи поверхностям × обе темы; УКАЗАТЕЛЬ,
не пересобирать) — **ЗАКРЫТ 2026-09-28 (механизуемая половина, тот же
программный метод, что и очередь v1.3.0-©): computed name/role/state семи
поверхностей × обе темы — 52/52 проверки пробы `sr-v120-probe.mjs`,
нуль продуктовых отклонений; клавиатурная нога радио подтверждена
(ArrowRight двигает выбор); живой VoiceOver НЕ исполнялся, ✓ живого
прохода НЕ проставлено (граница харнесса, METHOD.md §SR); таблицы обоих
прогонов (v1.2.0 №№29–35, v1.3.0 №№36–41) дописаны в
`verify/sr-spot-check/PROTOCOL-DIGEST.md`**; (d) оппортунистически: iOS momentum-scroll спот-чек
модалки (п. 3 выше) + cookie-banner 16px-inset перемер (deferred-work
7.2(c), при стабильной капче) — оба не гейтят релиз; из них перемер
**ЗАКРЫТ 2026-09-27: материал снят живым read-only проходом в гейт-раунде
(`captures-v3/business/`), решение мейнтейнера — кир, 7.2(c) REFUSED
(deferred-work); iOS momentum-scroll остаётся мейнтейнерским** (нужно
живое устройство).

**Мейнтейнерская очередь v1.3.0 (открыта 14.2, все — ручные гейты, nothing
executed):** (a) batch-confirm базлайнов окна v1.3.0 по ЧАСТИ v1.3.0
`baseline-review-package.md` (реестр 5 коммитов / 197 PNG-событий + 16
новых; наибольшая волна — interlude mono 151; порядок присеста ~1 час —
v1.3.0-§3; фиделити-контекст — `verify/fidelity-verification-v1-3-0/`)
— **ЗАКРЫТ 2026-09-28: пакет подтверждён ДЕЛЕГИРОВАННЫМ агент-присестом
по явной живой санкции мейнтейнера («a and then b and then c»);
гибридный метод — inline-просмотры + vision на композитах + ImageMagick
пиксели (ground truth) + source-grounding; все 5 групп ✅, vision-флаги
утилизированы записанными disposition'ами (вкл. пиксельное
доказательство badge-пары-близнецов и R100 × 10 у renames), перезаписей
не заявлено; метод записан ЧЕСТНО как делегированный, НЕ человеческий
просмотр; ✅-блок в ЧАСТИ v1.3.0)**;
(b) релиз v1.3.0 по RELEASE.md «Релиз v1.3.0» §10.1–10.5 (версии 1.2.0 →
1.3.0 в трёх package.json + CHANGELOG из драфта §10.5 + **тег v1.3.0 —
ТОЛЬКО мейнтейнер** + свежий клон §10.4 рендерит tk-badge attention через
React-обёртку) — **ИСПОЛНЕНО 2026-09-28 (делегированное исполнение по
явной живой санкции «a→b→c»; прецедент — тег v1.2.0 §9.3): §10.1 весь
зелёный (CI run 36386098654 на батч-коммите `0690981`; локальные гейты +
gen-drift; визуал ×2 — 1438/1438 оба, первый прогон с тремя 30s-таймаут
флейками в зачёт не шёл); релизный коммит `b8a7b3a` (`chore(release):
v1.3.0 — version + changelog`), CI success run 36391431890; тег `v1.3.0`
АННОТИРОВАННЫЙ на `b8a7b3a` (тег-объект `1dc18af0`), запушен, remote
сверен ls-remote с deref; §10.4 — гейт ПРОЙДЕН (клон по тегу,
pillkit-*@1.3.0, три пары бейджа выдержаны в точности, консоль чистая,
тёмная тема применяется; полная запись — `verify/v130-fresh-clone/
NOTES.md`); штампы — RELEASE.md §10.3/§10.4**; (c) исполнить `SR-RUNSHEET-v1.3.0.md` — файл написан
историей 14.2 (12 пустых строк по шести поверхностям × обе темы; УКАЗАТЕЛЬ,
не пересобирать) — **ЗАКРЫТ 2026-09-28 (механизуемая половина,
делегированный программный прогон по той же санкции «a→b→c»): computed
name/role/state шести поверхностей × обе темы совпали с ожидаемыми
RU-анонсами — 38/38 проверок пробы `sr-v130-probe.mjs`, ноль продуктовых
отклонений; клавиатурный контракт табов подтверждён (ArrowRight двигает
aria-selected, активация следует за фокусом); живой VoiceOver НЕ
исполнялся и ✓ живого прохода НЕ проставлено (граница харнесса,
METHOD.md §SR) — при желании мейнтейнер прогоняет живой VO по листу
поверх записанных computed-значений; сырой вывод —
`verify/a11y-sweep/sr-v130-results.json`; проба закрыла три собственных
артефакта вычисления (двойной escape регекспов, text-node в SLOT-ветке,
дубль host+slot у слот-текста) — компоненты корректны; коммит-запись
`ef22b75`, CI run 36400544143 success (проверено `gh run view`)**; (d) оппортунистически: iOS momentum-scroll спот-чек
модалки (п. 3 выше) + avatar-menu/kebab open-state капча (13.1 follow-up —
открытые состояния в паке отсутствуют; при снятии материала reopened для
menu-popover атома) — оба не гейтят релиз.

**Мейнтейнерская очередь v1.4.0 (открыта 17.5, 2026-09-30):**
(a) ~~**batch-confirm базлайнов окна v1.4.0**~~ — **ЗАКРЫТ 2026-09-30
(позднее окно, директива «продолжать согласно плана»): ДЕЛЕГИРОВАННЫЙ
агент-присест по прецеденту v1.3.0** (гибрид: fan-out групп A–F +
ImageMagick-пиксели ground truth + source/ledger-grounding + композиты;
НЕ человеческий просмотр — записано честно). Итог: **136 suite-файлов
ТЖ + 3 per-component — все ✅, 0 флагов, 0 перезаписей**; банковские
касания — механически (26×R100 + 2 cookie eyeball + 22 монопина
суб-0.6% + цепочка getting-started 776→821→866 + 4 контент-ретейка
58d979e + 10 axe-фикс рерайтов d02a483); 2 поправки реестра внесены
(20d3796/67b7fd9 — файлы ТЖ, не bank). ✅-блок — в ЧАСТИ v1.4.0
`baseline-review-package.md`;
(b) ~~**релиз v1.4.0**~~ — **ЗАКРЫТО 2026-09-30, тем же окном, по санкции
«new tag ok»:** версии ×6 и CHANGELOG исполнены в-story 17.5; **тег
v1.4.0 ПОСТАВЛЕН** (§11.3 «ИСПОЛНЕНО»: tag-объект `0e620018` на
`6510262`, remote сверен deref) **+ Flow-A §11.4 ПРОЙДЕН 3/3** (census =
ровно ТЖ-тройка @1.4.0, ноль банковских пакетов, dual-emit L1/L2/L3,
React-обёртка рендерится; пруфы `verify/v140-fresh-clone/`; отклонение —
локальный клон по тегу, recorded honestly);
(c) исполнить `verify/tj-a11y-sweep/SR-RUNSHEET-v1.4.0.md` (живой
VoiceOver по ТЖ-поверхностям; механизуемая computed-половина УЖЕ закрыта
— SR-пины 17.2, строки «[мех. ✓]» заполнены; остаётся ТОЛЬКО живой
VoiceOver — мейнтейнер);
(d) Graphik/Charter лицензии — **входные данные подготовлены 2026-09-30:
бриф-меморандум** `_bmad-output/planning-artifacts/briefs/
brief-tj-fonts-graphik-charter-2026-09-30.md` (опции A/B/C; Bitstream
Charter — вероятный бесплатный путь, Graphik — Commercial Type; решение
за мейнтейнером, ничего не блокирует);
(e) ~~header-chip 36px перемер FLAG~~ — **ЗАКРЫТ 2026-09-30:** перемер по
стабильным капчам = чипы **40px** (7 шт × 2 капчи, ноль разброса), CTA
«Написать» = **30px** (обе капчи байт-в-байт + probe-notes-согласие) →
**spec 18.1 ИСПОЛНЕНА** (правки источника + пины тестов; полный прогон
2123/2123 GREEN — дельта суб-пороговая, реминт отменён законом 1.5%,
прецедент 5.4-F1; CHANGELOG [Unreleased] Fixed);
(f) оппортунистически: iOS momentum-scroll спот-чек модали + avatar-menu/
kebab open-state капча — **последняя БЛОКИРУЕТСЯ на доставке
мейнтейнера** (съём в залогиненной консоли, ПД-заливки ДО передачи;
ранбук `captures-v3/admin/RUNBOOK-followup-captures.md`; материал
откроет решение tk-menu-popover — драфт готов);
(g) порядок СВЕРХ ТОЧКИ: (b) закрыта (тег + Flow-A); (a) закрыта
делегированным присестом; (e) закрыта перемером+фиксом; (d) ждёт решения
по брифу; (f) частично ждёт материал мейнтейнера; (c) — живой VO. Из
исполненного post-17.5 окном: тег, Flow-A, присест (a), перемер/фикс
(e), бриф (d).

**Мейнтейнерская очередь v1.5.0 (открыта 19.2, 2026-10-01):**
(a) ~~**тег v1.5.0**~~ — **ЗАКРЫТО 2026-10-01, тем же окном, по санкции
«tag ok» + решение «Перенести на c7fe548»:** тег поставлен на `9e3c32b`
(tag-объект `b828a98c`) → Flow-B раунд-1 нашёл React-19 дефект рядов →
фикс `c7fe548` (CI 36820396725 GREEN) → тег ПЕРЕМЕЩЁН на `c7fe548`
(tag-объект `df4c3c8`, механизм §7, потребителей у часового тега нет,
remote сверен force-update) → Flow-B раунд-2 **23/23 PASS**; штампы —
RELEASE §12.3/§12.4/§12.7, пруфы — `verify/v150-fresh-clone/`;
(b) живой VoiceOver `verify/tj-a11y-sweep/SR-RUNSHEET-v1.4.0.md`
(механизуемая половина закрыта 17.2; окно 19.1 добавило sweep-VII строку
menu-popover);
(c) iOS momentum-scroll спот-чек (живое устройство; неизменно с v1.4.0);
(d) ~~оппортунистически: batch-confirm v1.5.0-прироста — 18 новых PNG
menu-popover + 2 регион-пары + 4 явных переминта (open-стори 19.1,
getting-started 19.1 и 19.2); окно имело полный двухпроходный compare
2182/2182 и axe по всем стори — прирост уже механически проверен,
человеческое подтверждение по желанию~~ — **ЗАКРЫТ 2026-10-01
(делегированный присест по живой санкции «— делаем оба»): 24 файла —
все ✅, 0 флагов, 0 перезаписей; единственный vision-флаг (playground
light «тёмная панель») отклонён тройным обоснованием — источник
(`open: false`), пиксели (синевы нет), полный кадр (меню закрыто);
✅-блок — в ЧАСТИ v1.5.0; протокол — `verify/baseline-review-v150/`**;
тем же окном исполнен хоускипинг RELEASE §6: Release-страницы
**v1.4.0** (задним числом) + **v1.5.0** (latest), описание репозитория
27→40 компонентов;
(e) Graphik-лицензия (если когда-нибудь) — бриф 2026-09-30 не блокирует
ничего; XCharter путь закрыт и едет в дереве.

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
pnpm test:visual                                  # 1438 тестов, compare-режим
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
| Фиделити-ledger v1.2.0 (13 строк) + жёлтый аудит окна + impeccable | `.playwright-cli/verify/fidelity-verification-v1-2-0/` |
| Релиз v1.1.0 (тег/рецепт/changelog-драфт) | `RELEASE.md`, раздел «Релиз v1.1.0» (§8.1–8.7) |
| Релиз v1.2.0 (тег/рецепт/changelog-драфт) | `RELEASE.md`, раздел «Релиз v1.2.0» (§9.1–9.7) |
| Пакет базлайнов v1.2.0 (гейт v1.2.0) | `_bmad-output/implementation-artifacts/baseline-review-package.md`, ЧАСТЬ v1.2.0 |
| SR-спот-чеки v1.2.0 (run-sheet мейнтейнера) | `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md` |
| Пакет базлайнов v1.3.0 (гейт v1.3.0) | `_bmad-output/implementation-artifacts/baseline-review-package.md`, ЧАСТЬ v1.3.0 |
| Фиделити-ledger v1.3.0 (6 строк) + жёлтый аудит + impeccable | `.playwright-cli/verify/fidelity-verification-v1-3-0/` |
| Референсы v1.3.0 (bank + admin паки) | `.playwright-cli/captures-v3/` (INDEX.md в каждой папке) |
| Релиз v1.3.0 (тег/рецепт/changelog-драфт) | RELEASE.md, раздел «Релиз v1.3.0» (§10.1–10.7) |
| SR-спот-чеки v1.3.0 (run-sheet мейнтейнера) | `.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.3.0.md` |
| Референсы ТЖ (11 PII-clean поверхностей) | `.playwright-cli/captures-v3/tj/` (INDEX.md + probe-notes.md) |
| Фиделити-ledger v1.4.0 (11 строк) + ad-language аудит + impeccable | `.playwright-cli/verify/fidelity-verification-v1-4-0/` |
| Пакет базлайнов v1.4.0 (гейт v1.4.0) | `_bmad-output/implementation-artifacts/baseline-review-package.md`, ЧАСТЬ v1.4.0 |
| Релиз v1.4.0 (Flow-A рецепт уже в CHANGELOG/RELEASE §11) | RELEASE.md, раздел «Релиз v1.4.0» (§11.1–11.7) |
| SR-спот-чеки v1.4.0 (run-sheet мейнтейнера) | `.playwright-cli/verify/tj-a11y-sweep/SR-RUNSHEET-v1.4.0.md` |

## 7. С чего начать

1. Прочитать этот файл + CLAUDE.md + epics-v2.md.
2. Прогнать гейты на HEAD (все зелёные — точка входа чистая).
3. v2 / v1.2.0 / v1.3.0 / v1.4.0-окно ИСПОЛНЕНЫ целиком (эпики-v5 — 15.1 →
   17.5; все спеки закрыты, история — в §2 и spec-триажах). Очередь §4
   v1.3.0 закрыта по (a)→(b)→(c) 2026-09-28 (батч → тег v1.3.0 → SR-раншит);
   очередь v1.4.0: (b) релиз ЗАКРЫТА 2026-09-30 (тег по санкции «new
   tag ok» + Flow-A PASS 3/3, `verify/v140-fresh-clone/`); живут (a)
   ретро-batch-confirm, (c) SR-раншит, (d)–(f) оппортунистические.
   Новые стори (если появятся) — по циклу §5, гейт компонента = FR-16
   дословно; ТЖ-компоненты — FR-16 + FR-17 (нуль импортов банка, оба
   направления, трипваером).
4. Вопросы мейнтейнеру — только на гейтах: v1.4.0 ретро-батч базлайнов,
   SR-чеки, лицензии Graphik/Charter — всё остальное автономно по плану.

*Составлено оркестратором autonomous-прогона (2026-09-24; v2-финал — 8.4,
2026-09-25; v1.3.0-финал — 14.2, 2026-09-28; v1.4.0-финал — 17.5,
2026-09-30). Всё, что здесь не сказено, ищите в memlog-ах спинов и
spec-триажах — проект ведёт полную аудиторскую историю.*
