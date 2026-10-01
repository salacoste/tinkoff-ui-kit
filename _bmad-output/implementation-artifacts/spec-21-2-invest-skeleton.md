# Spec 21.2 — tk-skeleton атом (invest foundation wave, GAP-MAP A4)

- **status:** EXECUTED 2026-10-01 — коммит `cde959e`, CI-ран
  36912573965 **success** (вердикт по run id после факта). Live-probe
  честно провален ×3 (гидратация быстрее транспорта) → fallback по AC:
  ТЖ-молд + census; полный compare 2224/2224 после минта 6 базлайнов
  (+2 переминченных getting-started — новая плитка поиска); vision-ревью
  montage PASS (FLAT fill подтверждён). Штамп close-out — этим же днём.
- **baseline_commit:** голова Epic 21 на старте исполнения (zero-in-flight:
  вердикт рана 72939e9 + всех промежуточных снят)
- **epic note:** Epic 21 «invest foundation wave», волновое исполнение
  GAP-MAP (`.playwright-cli/captures-v4/invest/GAP-MAP.md`), Tier A #4.
- **grounding:** два независимых доклада: gap-1 (census `skeleton`: stocks 1,
  bonds 3 — «shimmer blocks near FAQ zone», currencies 1, germany 1; «новое
  против v2-маппинга») + gap-3 (favorites 1 — logged-out lazy content).
  Плюс внутрипакетный сиблинг-молд: `tj-news-card.css.ts` `.card--skeleton`
  (скелетон-грань существует в ТЖ с контрактом zero-layout-shift — 20.2
  закрепил паритет хука; банкового системного примитива нет).
- **ограничение материала (честно):** живая геометрия скелетон-блоков —
  ЦЕНСУС-только (класс-хиты), пиксельно не верифицирована агентами. Замер
  при исполнении: live-probe bonds-list — goto + немедленный screenshot
  (скелетон виден до гидрации контента), read-only. Если проба не ловит —
  fallback-заземление = ТЖ news-card skeleton (in-repo истина) + census.

## AC (frozen)

1. **Атом.** `tk-skeleton` (`packages/components/src/skeleton/`): варианты
   `variant="line" | "circle" | "rect"`; геометрия — атрибуты `width`/
   `height` (px-строки) рендерятся в host inline style; дефолты: line =
   полная ширина × 12px, circle = 40×40, rect = полная ширина × 80px.
   Радиус: line/rect — `--tk-radius-sm`, circle — 50%.
2. **Анимация.** Пульс `opacity` 1↔0.5, ~1.4s ease-in-out infinite;
   `prefers-reduced-motion: reduce` — БЕЗ анимации (a11y-закон кита).
   Shimmer-свип (градиентная пересветка) — только если live-probe докажет
   его на живом сайте; иначе не заводим (FLAT-цензус).
3. **A11y.** Атом несёт `aria-hidden="true"` (декоративный плейсхолдер);
   контейнер-паттерн `aria-busy="true"` — документируется в демо-стори
   (атрибут потребителя, не атома).
4. **Токены.** `--tk-skeleton-fill` (нейтральная приглушённая поверхность,
   живой замер; кандидат — существующий surface-muted) через хук-слой
   `--tk-skeleton-*`; px-геометрия атрибутов — документированная слепая
   зона zero-hardcoded (прецедент MENU_OFFSET_PX, 19.1). Жёлтого ноль.
5. **Стори.** (a) песочница — три варианта + произвольные размеры;
   (b) демо «загрузка каталога» — заземление bonds: карточка-скелетон
   (rect + две line + circle лого-место) рядом с готовой карточкой —
   контракт zero-layout-shift молдом tj-news-card; (c) dark;
   (d) reduced-motion заметка в прозе. Контент RU, мета EN.
6. **Тесты.** Unit: variant-классы ×3, aria-hidden, дефолты геометрии,
   reduced-motion media-пин css.ts; hidden-guard рост; axe — скелетон
   вне a11y-дерева (aria-hidden); визуальные базлайны НОВЫЕ, полный
   compare зелёный.
7. **Цикл.** `pnpm gen` → гейты EXIT 0 → pathspec-коммит → zero-in-flight
   → push → CI-вердикт по run id ПОСЛЕ факта → close-out штамп.

## Out of scope

- Скелетон-грани существующих компонентов (data-table skeleton-строки,
  tj-news-card реформа на tk-skeleton) — консьюмерские раунды позже.
- Shimmer-градиент, волны, вложенные композиции-пресеты («карточка целиком»
  как отдельный вариант) — собирается слотами/сториями, не атомом.
- Live-регресс скелетон-таймингов (E2E ожидания) — не кит.

## Risks / notes

- Live-probe тайминг: скелетон живёт секунды — проба = goto + мгновенный
  screenshot без sleep; если гидрация быстрее транспорта — повторить ×3,
  затем fallback по материалу.
- Анимация в визуальном сьюте: базлайны снимаются на паузе? — нет,
  playwright-скриншот ловит кадр пульса; фиксация: в visual-спеке
  `prefers-reduced-motion: reduce` эмуляция (медия-оверрайд пробы) —
  детерминированные базлайны, пульс не роняет compare.
