import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button/button.js';
import '../footer/footer.js';
import type { TkFooterColumn, TkFooterLink } from '../footer/footer.js';
import '../input/input.js';
import '../link/link.js';
import '../navbar/navbar.js';
import type { TkNavbarLink } from '../navbar/navbar.js';
import '../promo-card/promo-card.js';

/**
 * The composed homepage above the fold (spec 3.10+3.11) — Epic 3's stated
 * deliverable: the reference homepage reassembles from kit components plus
 * content ONLY. Like the application-form showcase (2.8) this is a SHOWCASE
 * story, not a component: it lives in `src/showcase/` so compositions never
 * read as kit atoms in the tree.
 *
 * PARTS (all existing, zero edits): tk-navbar (sticky, yellow-underlined
 * active link, logo + utilities slots), hero heading + body + ONE primary
 * CTA (the docs canvas consuming heading-1/body tokens), a PromoCard 3-up
 * grid on the corrected tints (mint #D0F4F2 measured at 3.6; cards carry
 * SECONDARY pill CTAs — cards are passive), the signup strip (phone+email
 * Input pair + the strip's primary Button), and tk-footer (the reference
 * directory columns).
 *
 * SINGLE PRIMARY PER VIEW CLUSTER (UX-DR14-era discipline): the composition
 * tags its two CTA-bearing clusters with `data-cluster` (hero / signup) so
 * the verification matrix can pin «exactly one primary per cluster» —
 * tests/visual/homepage.spec.ts asserts it live at all three breakpoints.
 *
 * WIRING (the spec's noted judgment call — minimal): the strip is STATIC
 * display plus one INTERACTIVE Input pair. The two tk-inputs are real
 * uncontrolled fields (typing works out of the box), but nothing derives
 * from them — no completion formula, no error driving, no loading state —
 * so the 2.8 closure-state + render()-reinvocation pattern is deliberately
 * NOT used here: it exists to move DERIVED bindings, and this composition
 * has none. The full validated-submit walkthrough is the form showcase's
 * own story («Заявка на дебетовую карту», spec 2.8).
 *
 * FULL-WIDTH CTA AT <768 (UX-DR14 row): tk-button's pill lives in shadow
 * DOM and sizes to content under the host's row inline-flex, so a bare
 * `width: 100%` on the host grows the BOX but not the pill. The consumer
 * recipe (probed live, zero component edits): flip the host to a COLUMN
 * flex — the pill becomes a cross-axis flex item and the default
 * `align-items: stretch` stretches it to the full width.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. The hero art is the
 * 2.6 technique: inline SVG whose fills are READ from the token layer via
 * getComputedStyle (no literal in this source).
 */

/** Reads a token's computed value (the 2.6 artwork source — no literals here). */
const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/**
 * The hero's decorative art (aria-hidden): the reference fold's abstract
 * reading — a large yellow blob, an ink card shape, a coin disc. Shapes
 * only (no text glyphs — raster determinism), fills from live tokens so
 * the art re-derives per theme on reload.
 */
const heroArt = (side: 'start' | 'end') => {
  const yellow = tokenColor('--tk-color-yellow-100');
  const ink = tokenColor('--tk-color-ink-400');
  const surface = tokenColor('--tk-color-surface-base');
  if (side === 'start') {
    // The ink card + coin cluster (reference: the dark card with the crown).
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" fill="none">' +
      `<rect x="18" y="26" width="130" height="86" rx="16" fill="${ink}" transform="rotate(-8 83 69)"/>` +
      `<path d="M46 66l14-16 14 16 14-16 14 16v20H46z" fill="${yellow}" transform="rotate(-8 83 69)"/>` +
      `<circle cx="168" cy="104" r="26" fill="${surface}"/>` +
      `<circle cx="168" cy="104" r="16" fill="${yellow}"/>` +
      '</svg>';
    return svg;
  }
  // The yellow blob (reference: the soft yellow swoosh behind the fold).
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">' +
    `<circle cx="90" cy="90" r="90" fill="${yellow}"/>` +
    `<circle cx="126" cy="58" r="20" fill="${ink}" fill-opacity="0.08"/>` +
    '</svg>'
  );
};

/** The reference nav (tbank.ru capture navbar-desktop.png) — the navbar story's own set. */
const NAV_LINKS: TkNavbarLink[] = [
  { value: 'retail', label: 'Частным лицам', href: '#retail' },
  { value: 'business', label: 'Бизнесу', href: '#business' },
  { value: 'premium', label: 'Премиум', href: '#premium' },
  { value: 'more', label: 'Еще', href: '#more' },
];

/** The reference directory (footer capture) — the footer story's own six columns. */
const FOOTER_COLUMNS: TkFooterColumn[] = [
  {
    title: 'Банк',
    links: [
      { label: 'Кредиты наличными', href: '#loans' },
      { label: 'Ипотека', href: '#mortgage' },
      { label: 'Вклады', href: '#deposits' },
      { label: 'Дебетовые карты', href: '#cards' },
      { label: 'Рефинансирование', href: '#refinance' },
    ],
  },
  {
    title: 'Инвестиции',
    links: [
      { label: 'Брокерский счёт', href: '#broker' },
      { label: 'Портфели', href: '#portfolios' },
      { label: 'Фонды', href: '#funds' },
    ],
  },
  {
    title: 'Страхование',
    links: [
      { label: 'ОСАГО', href: '#osago' },
      { label: 'Каско', href: '#casco' },
      { label: 'Путешествия', href: '#travel' },
    ],
  },
  {
    title: 'Платежи',
    links: [
      { label: 'Переводы', href: '#transfers' },
      { label: 'Оплата услуг', href: '#bills' },
      { label: 'Пополнение', href: '#topup' },
    ],
  },
  {
    title: 'Бизнесу',
    links: [
      { label: 'Расчетный счет', href: '#business' },
      { label: 'Эквайринг', href: '#acquiring' },
      { label: 'Зарплатный проект', href: '#payroll' },
    ],
  },
  {
    title: 'Еще',
    links: [
      { label: 'О банке', href: '#about' },
      { label: 'Карьера', href: '#careers' },
      { label: 'Пункты выдачи', href: '#offices' },
    ],
  },
];

const FOOTER_QUICK: TkFooterLink[] = [
  { label: 'О банке', href: '#about' },
  { label: 'Новости', href: '#news' },
  { label: 'Блог', href: '#blog' },
  { label: 'Работа', href: '#careers' },
  { label: 'Банкоматы', href: '#atm' },
  { label: 'Курсы валют', href: '#rates' },
  { label: 'Контакты', href: '#contacts' },
];

/** Card-art stand-ins per grid seat — token-drawn discs (2.6), varied by class. */
const gridCard = (
  variant: 'charcoal' | 'bluegray' | 'mint',
  heading: string,
  description: string,
  discClass: string,
) => html`
  <tk-promo-card variant=${variant} heading=${heading} description=${description}>
    <div class="tkh-art" slot="art"><span class="tkh-art__disc ${discClass}"></span></div>
    <tk-button slot="actions" variant="secondary" size="card">Подробнее</tk-button>
  </tk-promo-card>
`;

const meta: Meta = {
  title: 'Showcase/Homepage',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Homepage: Story = {
  name: 'Главная выше фолда (composed)',
  render: () => html`
    <div class="tkh-page">
      <tk-navbar class="tkh-navbar" .links=${NAV_LINKS} active-value="retail" sticky>
        <span slot="logo" class="tkh-logo" aria-hidden="true">
          <span class="tkh-logo__shield">Т</span>
        </span>
        <a slot="utilities" class="tkh-utility" href="#search" aria-label="Поиск">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5L21 21"></path>
          </svg>
        </a>
        <a slot="utilities" class="tkh-utility tkh-utility--account" href="#login">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4.5 20.5c1.8-3.4 4.4-5 7.5-5s5.7 1.6 7.5 5z"></path>
          </svg>
          Личный кабинет
        </a>
      </tk-navbar>

      <main class="tkh-main">
        <section class="tkh-hero" data-cluster="hero" aria-labelledby="tkh-hero-title">
          <div class="tkh-hero__art tkh-hero__art--start" aria-hidden="true">
            ${unsafeSVG(heroArt('start'))}
          </div>
          <div class="tkh-hero__art tkh-hero__art--end" aria-hidden="true">
            ${unsafeSVG(heroArt('end'))}
          </div>
          <div class="tkh-hero__copy">
            <h1 id="tkh-hero-title">Дебетовая карта, которую рекомендуют ваши друзья</h1>
            <p class="tkh-hero__body">
              Кэшбэк рублями до 30%, переводы клиентам Т-Банка без комиссии
            </p>
            <tk-button class="tkh-hero__cta" variant="primary" size="hero">
              Оформить карту
            </tk-button>
          </div>
        </section>

        <section class="tkh-section" aria-labelledby="tkh-grid-title">
          <div class="tkh-container">
            <h2 id="tkh-grid-title">Рекомендуемые продукты</h2>
            <div class="tkh-grid">
              ${gridCard('charcoal', 'Платинум', 'Премиальное обслуживание', 'tkh-art__disc--yellow')}
              ${gridCard('bluegray', 'Т-Инвестиции', 'Портфель под цель', 'tkh-art__disc--ink')}
              ${gridCard('mint', 'ОСАГО', 'Страховка за 2 минуты', 'tkh-art__disc--blue')}
            </div>
          </div>
        </section>

        <section class="tkh-section tkh-strip" data-cluster="signup" aria-labelledby="tkh-strip-title">
          <div class="tkh-container">
            <div class="tkh-strip__panel">
              <h2 id="tkh-strip-title">Оставьте заявку на карту</h2>
              <p class="tkh-strip__note">
                Статичная демонстрация: пара интерактивных полей без валидации
                и загрузки — полный маршрут отправки живёт в стори
                «Заявка на дебетовую карту».
              </p>
              <div class="tkh-strip__row">
                <tk-input
                  class="tkh-strip__field"
                  label="Мобильный телефон"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  placeholder="+7 900 000-00-00"
                ></tk-input>
                <tk-input
                  class="tkh-strip__field"
                  label="Электронная почта"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="mail@example.ru"
                ></tk-input>
                <tk-button class="tkh-strip__submit" variant="primary" size="hero">
                  Продолжить
                </tk-button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <tk-footer
        class="tkh-footer"
        .columns=${FOOTER_COLUMNS}
        .quickLinks=${FOOTER_QUICK}
        phone="8 800 333-33-33"
      >
        <p class="tkh-legal__line">
          © 2006—2026, АО «Банк». Информация не является публичной офертой. Услуги
          оказывают <tk-link variant="legal" href="#brokera">ООО «Брокер»</tk-link>
          и <tk-link variant="legal" href="#leasing">ООО «Лизинг»</tk-link> —
          подробности в <tk-link variant="legal" href="#docs">документах</tk-link>.
        </p>
      </tk-footer>

      <section class="tkh-docs" aria-labelledby="tkh-docs-title">
        <div class="tkh-container">
          <h2 id="tkh-docs-title">Как собрано</h2>
          <p>
            Финальная проверка эпика 3: главная выше фолда пересобрана ТОЛЬКО из
            компонентов кита и контента — tk-navbar (липкая, жёлтый штрих
            активной ссылки, слоты лого/утилит), заголовок героя и текст
            (heading-1 и body-l токены канвы), сетка 3-в-ряд из tk-promo-card на
            выверенных тонах (мята — измеренное значение 3.6), пара tk-input
            (телефон + почта) и первичная tk-button полосы заявки, tk-footer с
            колонками эталона. Ни одного нового компонента или токена. Дисциплина
            кнопок: ровно одна первичная на кластер вида — герой и полоса заявки
            помечены <code>data-cluster</code> и проверяются матрицей
            (tests/visual/homepage.spec.ts); CTA карточек — вторичные пилюли.
            Полоса заявки статична: поля интерактивны (неконтролируемые),
            но ничего не производит — паттерн замыкания 2.8 здесь не нужен, ему
            нечего двигать. Полноширинная CTA на &lt;768 — рецепта потребителя:
            хост в колонку-флекс, пилюля растягивается по поперечной оси.
          </p>
          <h3>Чек-лист: только с клавиатуры</h3>
          <table>
            <thead>
              <tr><th>Шаг</th><th>Ожидаемое поведение</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code> по странице</td>
                <td>
                  Шапка → ссылки навигации → утилиты → CTA героя → CTA карточек
                  → поля полосы → «Продолжить» → ссылки футера; на &lt;768
                  ссылки шапки сходятся в бургер.
                </td>
              </tr>
              <tr>
                <td>Бургер на &lt;768</td>
                <td>
                  Enter/Space открывает drawer: фокус внутри, Tab/Shift+Tab
                  циклятся, Esc закрывает и возвращает фокус на бургер.
                </td>
              </tr>
              <tr>
                <td>Поля полосы</td>
                <td>
                  Подпись читается до поля; ввод работает (неконтролируемые
                  tk-input); ошибок нет — валидация не подключена сознательно.
                </td>
              </tr>
              <tr>
                <td>Скринридер</td>
                <td>
                  Баннер, одна навигация по имени, активная ссылка — «текущая
                  страница», h1 героя, статьи карточек с h3, contentinfo футера.
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Разрывы сборки</h3>
          <p>
            Блокирующих разрывов нет. Наблюдения: (1) полная ширина CTA
            достигается рецептом потребителя (колоночный флекс хоста) — эргономика
            «из коробки» может улучшаться будущим презентационным свойством;
            (2) референс держит под фолдом ещё ленту категорий и полную форму
            заявки — обе вне границ этой композиции (форма — отдельная стори 2.8);
            (3) абстрактный арт героя скрыт на &lt;768 ради чистоты мобильного
            ряда — референс сохраняет иллюстрацию, зафиксировано в NOTES.
          </p>
        </div>
      </section>
    </div>
    ${canvasStyles}
  `,
};

const canvasStyles = html`
  <style>
    .tkh-page {
      box-sizing: border-box;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      color: var(--tk-color-text-primary);
    }
    .tkh-main {
      flex: 1;
    }
    .tkh-container {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }

    /* --- Story-composed navbar slots (the navbar story's own recipe) -------- */
    .tkh-logo {
      display: inline-flex;
    }
    .tkh-logo__shield {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-ink-400);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-1-weight);
      line-height: 1;
    }
    .tkh-utility {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      min-height: 44px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .tkh-utility:hover {
      color: var(--tk-color-text-secondary);
    }
    .tkh-utility:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }

    /* --- Hero: centered copy on the reference's reading, token-drawn art ----- */
    .tkh-hero {
      position: relative;
      box-sizing: border-box;
      padding-block: var(--tk-space-96) var(--tk-space-64);
      text-align: center;
    }
    .tkh-hero__copy {
      /* Positioned ABOVE the decorative layer: both are positioned, later in
         tree order wins — no z-index needed (the z scale stays overlay-only). */
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }
    .tkh-hero__copy h1 {
      /* Wrap balance: two reference-like centered lines instead of an orphan
         word (structural px length — outside FR-1's color/z letter). */
      max-width: 700px;
      margin: 0 0 var(--tk-space-16);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-1-size);
      font-weight: var(--tk-text-heading-1-weight);
      line-height: var(--tk-text-heading-1-leading);
    }
    .tkh-hero__body {
      margin: 0 0 var(--tk-space-32);
      max-width: 560px;
      font-size: var(--tk-text-body-l-size);
      font-weight: var(--tk-text-body-l-weight);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkh-hero__art {
      position: absolute;
      pointer-events: none;
    }
    .tkh-hero__art svg {
      display: block;
      width: 100%;
      height: auto;
    }
    /* The reference fold's abstract marks — structural sizes (px lengths are
       outside FR-1's letter; the guard scans color/z literals), tucked into
       the corners AWAY from the centered copy so contrast never degrades. */
    .tkh-hero__art--start {
      bottom: var(--tk-space-24);
      left: var(--tk-space-48);
      width: 200px;
    }
    .tkh-hero__art--end {
      top: var(--tk-space-24);
      right: var(--tk-space-48);
      width: 180px;
    }

    /* --- Sections rhythm ----------------------------------------------------- */
    .tkh-section {
      padding-block: var(--tk-space-96);
    }
    .tkh-section h2 {
      margin: 0 0 var(--tk-space-24);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }

    /* --- PromoCard 3-up grid: ≥1024 three equal columns, container-1200 ------ */
    .tkh-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--tk-space-grid-gap);
    }
    .tkh-art {
      aspect-ratio: 4 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-base);
    }
    .tkh-art__disc {
      width: var(--tk-space-96);
      height: var(--tk-space-96);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-yellow-100);
    }
    .tkh-art__disc--ink {
      background: var(--tk-color-ink-300);
    }
    .tkh-art__disc--blue {
      background: var(--tk-color-blue-100);
    }

    /* --- The signup strip ------------------------------------------------------ */
    .tkh-strip {
      padding-block: var(--tk-space-96) var(--tk-space-120);
    }
    .tkh-strip__panel {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-xl);
    }
    .tkh-strip__panel h2 {
      margin: 0;
    }
    .tkh-strip__note {
      margin: 0;
      max-width: 560px;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkh-strip__row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
      gap: var(--tk-space-20);
      align-items: end;
    }
    .tkh-strip__field {
      min-width: 0;
    }
    /* The strip's submit stays a natural pill on ≥768 — the strip's single
       primary; the <768 full-width flip lives in the breakpoint block below. */

    /* --- Footer gutters: the component's own layout contract leaves the
       container rhythm to the consumer (its docblock). Centered PADDING, not
       max-width + auto margins: the page is a column flex, and auto
       cross-axis margins shrink a stretched item to fit-content (a 972px
       footer, measured). The max() floor keeps the 24px gutter below the
       container width. */
    .tkh-footer {
      box-sizing: border-box;
      /* + the container's own 24px inline padding, so the directory's edge
         lands exactly on .tkh-container's content edge (probed 64px at 1280). */
      padding-inline: max(
        var(--tk-space-24),
        calc((100% - var(--tk-space-container)) / 2 + var(--tk-space-24))
      );
    }

    /* --- Docs block (below the footer — clearly chrome, not composition) ----- */
    .tkh-docs {
      padding-block: var(--tk-space-64);
      background: var(--tk-color-surface-muted);
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tkh-docs h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkh-docs h3 {
      margin: var(--tk-space-24) 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkh-docs p {
      margin: 0;
      max-width: 560px;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkh-docs td,
    .tkh-docs th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkh-docs code {
      font-family: var(--tk-font-body);
    }

    /* --- UX-DR14: 768–1023 — one column-step collapse, full navbar ------------ */
    @media (max-width: 1023px) {
      .tkh-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .tkh-hero__art--start {
        left: var(--tk-space-24);
      }
      .tkh-hero__art--end {
        right: var(--tk-space-24);
      }
    }

    /* --- UX-DR14: <768 — single column, burger, full-width CTA, step-down ----- */
    @media (max-width: 767px) {
      .tkh-container,
      .tkh-footer {
        padding-inline: var(--tk-space-16);
      }
      .tkh-hero {
        padding-block: var(--tk-space-64);
      }
      .tkh-hero__copy {
        padding-inline: var(--tk-space-16);
      }
      /* Mobile heading mapping (site L/M/S — recorded as an observation):
         the display size steps down to heading-4 metrics, weight stays 700
         (heading-3 left a ragged 4-line wrap at 360 — probed). */
      .tkh-hero__copy h1 {
        font-size: var(--tk-text-heading-4-size);
        line-height: var(--tk-text-heading-4-leading);
      }
      .tkh-hero__body {
        margin-bottom: var(--tk-space-24);
      }
      .tkh-hero__art {
        display: none;
      }
      /* THE full-width CTA recipe (probed): column flex on the host makes the
         shadow pill a cross-axis flex item — default align-items: stretch
         grows it to the full width. */
      .tkh-hero__cta {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .tkh-section {
        padding-block: var(--tk-space-64);
      }
      .tkh-strip {
        padding-block: var(--tk-space-64);
      }
      .tkh-grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .tkh-strip__panel {
        padding: var(--tk-space-24);
      }
      .tkh-strip__row {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--tk-space-16);
      }
      .tkh-strip__submit {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      /* The reference's mobile utility cluster: round search chip + login pill
         (the navbar story's own breakpoint recipe). */
      .tkh-utility {
        justify-content: center;
        width: 44px;
        padding: 0;
        border-radius: var(--tk-radius-full);
        background: var(--tk-color-surface-muted);
      }
      .tkh-utility--account {
        order: -1;
        width: auto;
        padding-inline: var(--tk-space-16);
        border-radius: var(--tk-radius-full);
        font-size: var(--tk-text-body-s-size);
      }
      .tkh-utility--account svg {
        display: none;
      }
    }
  </style>
`;
