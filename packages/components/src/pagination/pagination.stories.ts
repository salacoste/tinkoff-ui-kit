import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './pagination.js';

import type { TkPagination } from './pagination.js';

/**
 * tk-pagination stories (spec 6.2): playground, variants (windowing states,
 * boundaries, show-more, count=1), the frozen page contract live, theming,
 * and the a11y notes with the FULL keyboard checklist + an SR-protocol
 * section (maintainer-side execution).
 *
 * Motion: the only transitions are the load-more hover fill and the active
 * pill fill — motion tokens throughout, collapsed to 0ms under
 * prefers-reduced-motion by the token layer (no component media query).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

/** The capture's own catalog scale (invest/stocks: 196 pages). */
const STOCKS_COUNT = 196;

type PaginationArgs = {
  label: string;
  count: number;
  showMore: boolean;
  moreLabel: string;
  page?: number;
};

const pagination = (args: Partial<PaginationArgs> = {}) => {
  const { label, count, showMore, moreLabel, page } = args;
  return html`
    <tk-pagination
      .label=${label ?? 'Пагинация'}
      .count=${count ?? STOCKS_COUNT}
      ?show-more=${showMore ?? true}
      .moreLabel=${moreLabel ?? 'Показать еще'}
      .page=${page}
    ></tk-pagination>
  `;
};

const canvasStyles = html`
  <style>
    .tkp-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkp-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkp-canvas .tkp-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkp-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkp-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas td,
    .tkp-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkp-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkp-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkp-canvas .tkp-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkp-canvas .tkp-log {
      box-sizing: border-box;
      margin: 0;
      min-height: 3em;
      max-width: var(--tk-space-container);
      padding: var(--tk-space-8) var(--tk-space-12);
      overflow: auto;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-sm);
      white-space: pre-wrap;
    }
    .tkp-canvas .tkp-block {
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
    }
    .tkp-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkp-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkp-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkp-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    /* On-tint recipe (the tabs 3.3 precedent): the surface overrides the
       component's text hooks. Inactive numbers and chevrons are LINK-colored
       (--tk-pagination-page-text) — link blue fails AA on tinted fills, so
       the light tints flip to the token layer's link-on-tint (#1464CC, the
       AA-correct link step for tinted surfaces) and charcoal goes white (the
       tabs charcoal pick). The ACTIVE pill needs nothing: its text sits on
       the opaque yellow fill. */
    .tkp-panel--muted tk-pagination,
    .tkp-panel--bluegray tk-pagination {
      --tk-pagination-page-text: var(--tk-color-link-on-tint);
    }
    .tkp-panel--charcoal tk-pagination {
      --tk-pagination-page-text: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<PaginationArgs> = {
  title: 'Components/Pagination',
  component: 'tk-pagination',
  args: {
    label: 'Пагинация',
    count: STOCKS_COUNT,
    showMore: true,
    moreLabel: 'Показать еще',
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<PaginationArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Pagination</h1>
      <p class="tkp-note">
        Пейджер каталога: сверху отдельной строкой — полноширинная плашка
        «Показать еще» (surface-muted, radius-md, синий текст по центру,
        эмитит load-more и НЕ меняет страницу), ниже — центрированный ряд
        номеров: шеврон ‹, номера текстом в синем цвете ссылок, активная
        страница — жёлтая пилюля ~32px с тёмным текстом 700, многоточие
        вместо пропусков ≥2. Контракт page/defaultPage — замороженный §4.
      </p>
      ${pagination(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Варианты</h1>
      <p class="tkp-note">
        Окно номеров: всегда первая и последняя страницы + пять подряд вокруг
        активной (у края окно сдвигается — образец при active=1 рисует
        1 2 3 4 5 … 196). Пропуски ≥2 схлопываются в одно многоточие; при
        count ≤ 7 многоточий нет — ряд полный.
      </p>
      <figure>
        ${pagination({ page: 1 })}
        <figcaption>страница 1 (случай образца): 1 2 3 4 5 … 196, шеврон ‹ погашен</figcaption>
      </figure>
      <figure>
        ${pagination({ page: 95 })}
        <figcaption>середина: 1 … 93 94 95 96 97 … 196</figcaption>
      </figure>
      <figure>
        ${pagination({ page: 196 })}
        <figcaption>последняя: 1 … 192–196, шеврон › погашен</figcaption>
      </figure>
      <figure>
        ${pagination({ count: 7, page: 4, showMore: false })}
        <figcaption>count=7: полный ряд без многоточий, без плашки</figcaption>
      </figure>
      <figure>
        ${pagination({ count: 1, page: 1 })}
        <figcaption>count=1: ряд номеров скрыт полностью — только «Показать еще»</figcaption>
      </figure>
      <figure>
        ${pagination({ count: 1, page: 1, showMore: false })}
        <figcaption>count=1 без show-more: компонент не рендерит ничего</figcaption>
      </figure>
      <figure>
        ${pagination({ count: 12, moreLabel: 'Показать ещё акции' })}
        <figcaption>свой текст плашки (more-label)</figcaption>
      </figure>
      <figure>
        ${pagination({ label: 'Страницы каталога', count: 12, page: 3, showMore: false })}
        <figcaption>своё имя навигации (label → aria-label)</figcaption>
      </figure>
    </main>
  `,
};

/** Delayed "consumer answers" apply, tracked PER FIELD (see select's ValueModes note). */
const pendingApply = new WeakMap<TkPagination, number>();

export const PageModes: Story = {
  name: 'Режимы page (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    const cancelApply = (field: TkPagination): void => {
      window.clearTimeout(pendingApply.get(field));
      pendingApply.delete(field);
    };

    return html`
      ${canvasStyles}
      <main class="tkp-canvas">
        <h1>Режимы page</h1>
        <p class="tkp-note">
          Тот же контракт, что и Input/Select (CONVENTIONS §4): (1) начальная
          страница неконтролируемого режима — <code>defaultPage</code>; (2)
          контролируемый режим строгий — нажатие номера только эмитит
          <code>page-change</code>, ряд рендерит ровно consumer-ский
          <code>page</code>; (3) снятие <code>page</code> отпускает контроль с
          сеянием от последней страницы. Страница вне [1, count] стягивается
          к диапазону (§2). «Показать еще» страницу НЕ меняет — только
          <code>load-more</code>; после смены страницы фокус падает на
          НОВОАКТИВНЫЙ номер (никогда в body).
        </p>
        <section>
          <h2>Неконтролируемый: defaultPage + page-change + load-more</h2>
          <div class="tkp-block">
            <tk-pagination
              .count=${STOCKS_COUNT}
              default-page="5"
              ?show-more=${true}
              @page-change=${(event: Event) => {
                const { value } = (event as CustomEvent<{ value: number }>).detail;
                log('tkp-log-uncontrolled', `page-change → ${value}`);
              }}
              @load-more=${() => {
                log('tkp-log-uncontrolled', 'load-more (страница не меняется)');
              }}
            ></tk-pagination>
          </div>
          <pre class="tkp-log" id="tkp-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый: строгий (page применяется с задержкой 700ms)</h2>
          <div class="tkp-block">
            <tk-pagination
              .count=${STOCKS_COUNT}
              .page=${1}
              @page-change=${(event: Event) => {
                const field = event.currentTarget as TkPagination;
                const { value } = (event as CustomEvent<{ value: number }>).detail;
                log('tkp-log-controlled', `page-change → ${value}`);
                cancelApply(field);
                pendingApply.set(
                  field,
                  window.setTimeout(() => {
                    field.page = value;
                    log('tkp-log-controlled', `page применён → ${value}`);
                  }, 700),
                );
              }}
            ></tk-pagination>
          </div>
          <pre class="tkp-log" id="tkp-log-controlled">—</pre>
          <div class="tkp-actions">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-pagination') as TkPagination | null;
                if (!field) return;
                cancelApply(field);
                field.page = 196;
                log('tkp-log-controlled', 'page сброшен потребителем → 196');
              }}
              >Установить page=196</tk-button
            >
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-pagination') as TkPagination | null;
                if (!field) return;
                cancelApply(field);
                field.page = undefined;
                log('tkp-log-controlled', 'page снят → неконтролируемый, сеяние от последней страницы');
              }}
              >Снять page (отпустить контроль)</tk-button
            >
          </div>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Темизация</h1>
      <p class="tkp-note">
        Пейджер темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Слоты:
        <code>--tk-pagination-active-fill</code>,
        <code>--tk-pagination-active-text</code>,
        <code>--tk-pagination-radius</code>,
        <code>--tk-pagination-page-text</code>,
        <code>--tk-pagination-more-fill</code>,
        <code>--tk-pagination-more-text</code>,
        <code>--tk-pagination-more-radius</code>.
      </p>
      <section class="tkp-panel">
        ${pagination({ page: 3 })}
      </section>
      <section class="tkp-panel tkp-panel--muted">
        ${pagination({ count: 24, page: 3, showMore: false })}
      </section>
      <section class="tkp-panel tkp-panel--bluegray">
        ${pagination({ count: 24, page: 3, showMore: false })}
      </section>
      <section class="tkp-panel tkp-panel--charcoal">
        ${pagination({ count: 24, page: 3, showMore: false })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Доступность</h1>
      <p class="tkp-note">
        Обёртка — <code>&lt;nav&gt;</code> с именем через <code>aria-label</code>
        («Пагинация» по умолчанию). Номера — КНОПКИ (нативный фокус), не
        ссылки: у компонента нет URL-модели, потребитель перехватывает
        <code>page-change</code>. Активная страница — кнопка с
        <code>aria-current="page"</code>, ЗАПИСАННОЕ решение
        «фокусируемая-но-текущая»: она остаётся реальной целью фокуса для
        посадки после смены страницы, активация — no-op. Шевроны на границах —
        <code>aria-disabled</code> (остаются фокусируемыми), обхода через край
        НЕТ. Многоточие — <code>aria-hidden</code>. Мишени ≥44×44 (номера и
        шевроны — невидимые поля 44px вокруг видимого глифа ~32px; плашка —
        вся 44px). Кольцо фокуса — единый токен 2px.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит: плашка «Показать еще» (если есть) → шеврон ‹ → номера по порядку → шеврон ›.</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> на номере</td>
            <td>
              <code>page-change</code>; пилюля переезжает на новый номер; ФОКУС
              — на новоактивной кнопке (не в body).
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> на активном номере</td>
            <td>no-op: значение не эмитится (страница уже текущая).</td>
          </tr>
          <tr>
            <td><code>Enter</code> на ‹ / ›</td>
            <td>Шаг на соседнюю страницу с той же посадкой фокуса.</td>
          </tr>
          <tr>
            <td>‹ / › на границе</td>
            <td>
              <code>aria-disabled="true"</code>, текст приглушён; нажатие —
              no-op, обхода через край НЕТ.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> на плашке</td>
            <td><code>load-more</code>; страница НЕ меняется; фокус остаётся на плашке.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Пагинация, навигация»; номер — «кнопка, 2»; активный — «2, страница, текущая страница»; шеврон — «Предыдущая страница, кнопка, недоступна» на границе.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkp-block">
        ${pagination({ count: STOCKS_COUNT, page: 95 })}
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkp-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером (запись в deferred-work.md). Каждое
        расхождение с ожидаемым объявлением — дефект, а не особенность.
      </p>

      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab на ряд номеров</td>
            <td>«Пагинация, навигация»; фокус на шевроне ‹: «Предыдущая страница, кнопка» (недоступна на странице 1)</td>
          </tr>
          <tr>
            <td>Tab по номерам</td>
            <td>«1, кнопка, текущая страница» затем «2, кнопка» … — по одному на номер</td>
          </tr>
          <tr>
            <td>Enter на «2»</td>
            <td>«2, текущая страница» — фокус и объявление на новоактивном номере</td>
          </tr>
          <tr>
            <td>Enter на «Показать еще»</td>
            <td>«Показать еще, кнопка» — нажатие; страница не меняется, объявлений смены страницы нет</td>
          </tr>
          <tr>
            <td>Последняя страница</td>
            <td>«Следующая страница, кнопка, недоступна» — граница без обхода</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-pagination'),
};
