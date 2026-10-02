import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './carousel.js';

/**
 * tk-carousel stories (spec 21.6, invest foundation wave): the
 * horizontal card carousel — the recon's most repeated surface (GAP-MAP
 * A2; census 46 + 95 + 5 rails). Financial copy is FICTIONAL per the
 * recon law — the tickers/prices below are invented.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root. The stub
 * cards' px WIDTHS ride inline styles (the skeleton width/height
 * precedent): card geometry is consumer-side, the measured references
 * (248px rec/edu, 230px sber, 150×110 mini) are pinned in prose.
 */

type CarouselArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkcr-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while the cards flip — story chrome invisible
         (the 5.4 dark-sweep finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkcr-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkcr-canvas .tkcr-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkcr-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkcr-canvas section {
      max-width: var(--tk-space-container);
    }
    .tkcr-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The stub card: light-DOM consumer chrome — the atom owns only
       the rail/chrome. Surface + radius + text from tokens; the px
       width rides the inline style per card. */
    .tkcr-card {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      padding: var(--tk-space-16);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-lg);
      box-shadow: var(--tk-shadow-default);
      color: var(--tk-color-text-primary);
    }
    .tkcr-card--mutedbg {
      background: var(--tk-color-surface-muted);
    }
    .tkcr-card .tkcr-card__title {
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tkcr-card .tkcr-card__sub {
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      white-space: nowrap;
    }
    .tkcr-card .tkcr-card__delta {
      color: var(--tk-color-delta-positive);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      white-space: nowrap;
    }
    /* The instrument roundel (the sber grounding's brand coin). */
    .tkcr-roundel {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--tk-space-40);
      height: var(--tk-space-40);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-gray-100);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      color: var(--tk-color-text-primary);
    }
    /* The horizontal instrument row inside «Похожие акции» cards. */
    .tkcr-inst {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    /* The mini card's centered stack (recently-viewed grounding). */
    .tkcr-mini {
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  </style>
`;

const meta: Meta<CarouselArgs> = {
  title: 'Components/Carousel',
  component: 'tk-carousel',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<CarouselArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkcr-canvas">
      <h1>Carousel</h1>
      <p class="tkcr-note">
        Горизонтальная карусель карточек (spec 21.6, GAP-MAP A2 — самый
        повторяемый кандидат рекон-обхода): нативный scroll-snap контейнер,
        карточки — light-DOM слот. Шевроны «Назад/Вперёд» появляются по
        ховеру/фокусу рейла (в статике живого сайта их нет — доказано
        порогокорректированным пиксельным сканом; замер — в шапке
        carousel.css.ts), шаг прокрутки — страница (ширина вьюпорта рейла),
        у краёв — disable. Точечная пагинация — декоративная (aria-hidden,
        некликабельна), активная точка — существующий жёлтый, совпавший с
        живой байт-в-байт. Ширина карточки — консьюмерская (замер-ориентир
        248px у рекомендаций, 230px у «Похожих акций»). Хук-слой
        <code>--tk-carousel-*</code>. Тёмная тема — штатная пара ног сьюты.
      </p>
      <section>
        <h2>Рейл из десяти карточек</h2>
        <tk-carousel label="Промо-карусель">
          ${Array.from(
            { length: 10 },
            (_, index) => html`
              <a class="tkcr-card" style="width: 248px; height: 140px" href="#">
                <span class="tkcr-card__title">Карточка ${index + 1}</span>
                <span class="tkcr-card__sub">Слот light-DOM</span>
              </a>
            `,
          )}
        </tk-carousel>
      </section>
    </main>
  `,
};

/**
 * The stock-sber grounding («Похожие акции»): instrument cards with a
 * brand roundel, price and the green delta; dot pagination under the
 * rail — the ONLY chrome the live statics paint (measured 8px dots,
 * 16px pitch, active yellow byte-identical).
 */
export const SimilarStocks: Story = {
  name: 'Похожие акции',
  render: () => html`
    ${canvasStyles}
    <main class="tkcr-canvas">
      <h1>Похожие акции</h1>
      <p class="tkcr-note">
        Заземление страницы инструмента (stock-sber): белые скруглённые
        карточки 230px с раунд-логотипом, ценой и зелёной дельтой; гэп
        карточек — 45px (замер), под рейлом — точечная пагинация. Тикеры
        и цены вымышленные (закон рекон-обхода).
      </p>
      <section>
        <h2>Похожие акции</h2>
        <tk-carousel label="Похожие акции" dots>
          ${[
            ['Т', 'Т-Технологии', '260,78 ₽', '+3,8%'],
            ['С', 'Северный банк', '9,41 ₽', '+1,0%'],
            ['Л', 'Лесной дом', '712,50 ₽', '+0,6%'],
            ['М', 'Мосберг', '128,04 ₽', '+2,2%'],
            ['К', 'Кама-Финанс', '54,90 ₽', '+4,1%'],
          ].map(
            ([letter, name, price, delta]) => html`
              <a class="tkcr-card" style="width: 230px" href="#">
                <span class="tkcr-inst">
                  <span class="tkcr-roundel">${letter}</span>
                  <span class="tkcr-card__title">${name}</span>
                </span>
                <span class="tkcr-card__sub">${price}</span>
                <span class="tkcr-card__delta">${delta}</span>
              </a>
            `,
          )}
        </tk-carousel>
      </section>
    </main>
  `,
};

/**
 * The recommendations grounding («Недавно просмотренные»): the ~150×110
 * mini cards — a centered roundel + one-line name, the densest rail of
 * the recon (education, census 95).
 */
export const RecentlyViewed: Story = {
  name: 'Недавно просмотренные',
  render: () => html`
    ${canvasStyles}
    <main class="tkcr-canvas">
      <h1>Недавно просмотренные</h1>
      <p class="tkcr-note">
        Заземление рекомендаций: мини-карточки ~150×110 — центрированный
        круглый раунд и однострочное имя; гэп 41px (замер обеих
        recommendations-полос, ноль разброса). Шевронов в статике нет —
        рейл скроллится нативно, хром проявляется по ховеру/фокусу.
      </p>
      <section>
        <h2>Недавно просмотренные</h2>
        <tk-carousel label="Недавно просмотренные">
          ${[
            'Т-Технологии',
            'Северный банк',
            'Лесной дом',
            'Мосберг',
            'Кама-Финанс',
            'Вектор',
            'Онега',
            'Дельта-Рента',
          ].map(
            (name, index) => html`
              <a class="tkcr-card tkcr-mini" style="width: 150px; height: 110px" href="#">
                <span class="tkcr-roundel">${name.charAt(0)}</span>
                <span class="tkcr-card__title">${name}</span>
                <span class="tkcr-card__sub">№${index + 1}</span>
              </a>
            `,
          )}
        </tk-carousel>
      </section>
    </main>
  `,
};

/**
 * The dots demo: wide cards force several pages; the muted section
 * surfaces the inactive dot against the consumer's page surface (the
 * grounding rails sit on muted pages).
 */
export const Dots: Story = {
  name: 'Точечная пагинация',
  render: () => html`
    ${canvasStyles}
    <main class="tkcr-canvas">
      <h1>Точечная пагинация</h1>
      <p class="tkcr-note">
        Декоративные точки: 8px, шаг 16px, отступ 16px от низа рейла;
        активная — жёлтый токен (байт-в-байт с живой пробой), пассивная —
        gray-200 (живая проба отличалась на 3 единицы канала — девиация
        зафиксирована в шапке css-листа, токен не минтован).
        Кликабельности нет: навигация —
        шевроны и нативный скролл; количество страниц выводится из
        геометрии рейла. Раздел на приглушённой поверхности — как
        заземлённые страницы каталогов.
      </p>
      <section>
        <h2>Три страницы</h2>
        <tk-carousel label="Стратегии" dots>
          ${Array.from(
            { length: 6 },
            (_, index) => html`
              <a class="tkcr-card tkcr-card--mutedbg" style="width: 400px; height: 160px" href="#">
                <span class="tkcr-card__title">Стратегия ${index + 1}</span>
                <span class="tkcr-card__sub">Широкая карточка — страница вмещает почти три</span>
              </a>
            `,
          )}
        </tk-carousel>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-carousel')}`,
};
