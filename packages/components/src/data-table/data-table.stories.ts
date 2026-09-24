import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './data-table.js';

import type { TkDataTableColumn, TkDataTableRow } from './data-table.js';

/**
 * tk-data-table stories (spec 6.4): the reference catalog playground
 * (Название/Цена/Изменение, two-line cells, real tickers), variants
 * (single-line rows, align end, delta mixes incl. no-delta, inert rows,
 * zero-state), an interactive keyboard story (the roving contract live),
 * a 100-row long list (no virtualization), theming, a11y notes with the
 * FULL roving keyboard checklist + an SR-protocol section
 * (maintainer-side execution).
 *
 * Motion: the only transition is the row hover fill — motion token
 * throughout, collapsed to 0ms under prefers-reduced-motion by the token
 * layer (no component media query). No synthetic :hover states beyond the
 * token (the spec's Never row).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

/** The capture's own catalog anatomy (invest/stocks: Название/Цена/Изменение). */
const STOCK_COLUMNS: TkDataTableColumn[] = [
  { key: 'name', header: 'Название', width: '1fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'change', header: 'Изменение', align: 'end' },
];

const row = (
  name: string,
  ticker: string,
  price: string,
  lot: string,
  deltaRub: string,
  deltaPct: string,
  delta: 'positive' | 'negative' | undefined,
  href?: string,
): TkDataTableRow => ({
  href: href ?? `/invest/stocks/${ticker}/`,
  cells: {
    name: { primary: name, secondary: ticker },
    price: { primary: price, secondary: lot },
    change: { primary: deltaRub, secondary: deltaPct, delta },
  },
});

/** Real RU tickers at the capture's own scale (10 rows — the matrix row 1 shape). */
const TEN_STOCKS: TkDataTableRow[] = [
  row('Сбербанк', 'SBER', '318,44 ₽', '1 лот = 10 акций', '+12,55 ₽', '+1,46 %', 'positive'),
  row('Т-Технологии', 'TCSG', '3 285,00 ₽', '1 лот = 1 акция', '−48,50 ₽', '−0,9 %', 'negative'),
  row('Газпром', 'GAZP', '128,36 ₽', '1 лот = 10 акций', '+0,66 ₽', '+0,51 %', 'positive'),
  row('Лукойл', 'LKOH', '684,50 ₽', '1 лот = 1 акция', '−1,2 ₽', '−0,18 %', undefined),
  row('Норникель', 'GMKN', '121,80 ₽', '1 лот = 10 акций', '−0,9 ₽', '−0,63 %', 'negative'),
  row('МТС', 'MTSS', '214,60 ₽', '1 лот = 10 акций', '+2,1 ₽', '+0,8 %', 'positive'),
  row('Магнит', 'MGNT', '4 120,00 ₽', '1 лот = 1 акция', '−25,0 ₽', '−1,1 %', 'negative'),
  row('Полюс', 'PLZL', '1 812,00 ₽', '1 лот = 1 акция', '+14,4 ₽', '+0,42 %', 'positive'),
  row('ВТБ', 'VTBR', '0,0581 ₽', '1 лот = 10 000 акций', '+0,0002 ₽', '+0,35 %', 'positive'),
  row('Аэрофлот', 'AFLT', '60,85 ₽', '1 лот = 100 акций', '+0,35 ₽', '+0,58 %', 'positive'),
];

type DataTableArgs = {
  caption: string;
  columns: TkDataTableColumn[];
  rows: TkDataTableRow[];
};

const dataTable = (args: Partial<DataTableArgs> = {}) => html`
  <tk-data-table
    .caption=${args.caption}
    .columns=${args.columns ?? STOCK_COLUMNS}
    .rows=${args.rows ?? TEN_STOCKS}
  ></tk-data-table>
`;

const canvasStyles = html`
  <style>
    .tkd-canvas {
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
    .tkd-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkd-canvas .tkd-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkd-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkd-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkd-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkd-canvas td,
    .tkd-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkd-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkd-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkd-canvas .tkd-block {
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
    }
    .tkd-canvas .tkd-frame {
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      padding: var(--tk-space-8);
    }
    .tkd-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkd-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkd-log {
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
  </style>
`;

const meta: Meta<DataTableArgs> = {
  title: 'Components/DataTable',
  component: 'tk-data-table',
  args: {
    caption: 'Каталог акций',
    columns: STOCK_COLUMNS,
    rows: TEN_STOCKS,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<DataTableArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkd-canvas">
      <h1>DataTable</h1>
      <p class="tkd-note">
        Типографическая таблица каталога: строки 81px с двухстрочными ячейками
        (первичная 15/24 + вторичная 13/20), разделители 1px, deltas — цвет
        несёт направление (обе строки ячейки), вся строка — область клика
        единственной ссылки (::after-стич). Клавиатурный слой — roving
        tabindex: один Tab-стоп, стрелки без обхода через край, Home/End,
        Enter — нативная навигация, Space — активация. Это навигация, а не
        форма: нет каналов value и событий.
      </p>
      ${dataTable(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkd-canvas">
      <h1>Варианты</h1>
      <p class="tkd-note">
        Однострочные ячейки (без <code>secondary</code>), выравнивание колонок
        по правому краю (<code>align: 'end'</code>), миксы deltas (вверх /
        вниз / без семантики), инертная строка (без <code>href</code> — не
        ссылка, не ховер, пропускается фокусом), нулевое состояние и пустая
        ячейка по неизвестному ключу.
      </p>
      <figure>
        ${dataTable({
          rows: [
            {
              href: '/invest/stocks/MOEX/',
              cells: {
                name: { primary: 'Московская Биржа' },
                price: { primary: '197,9 ₽' },
                change: { primary: '+0,6 ₽', delta: 'positive' },
              },
            },
            {
              href: '/invest/stocks/ALRS/',
              cells: {
                name: { primary: 'АЛРОСА' },
                price: { primary: '55,1 ₽' },
                change: { primary: '−0,15 ₽', delta: 'negative' },
              },
            },
            {
              href: '/invest/stocks/PHOR/',
              cells: {
                name: { primary: 'ФосАгро' },
                price: { primary: '6 640,00 ₽' },
                change: { primary: '0,00 ₽' },
              },
            },
          ],
        })}
        <figcaption>однострочные ячейки — все три формы delta подряд</figcaption>
      </figure>
      <figure>
        ${dataTable({
          columns: [
            { key: 'ticker', header: 'Тикер', width: '120px' },
            { key: 'name', header: 'Название', width: '1fr' },
            { key: 'price', header: 'Цена', align: 'end', width: '160px' },
          ],
          rows: [
            {
              href: '/invest/stocks/SNGS/',
              cells: {
                ticker: { primary: 'SNGS' },
                name: { primary: 'Сургутнефтегаз', secondary: 'SNGS · нефть и газ' },
                price: { primary: '20,86 ₽', secondary: '1 лот = 100 акций' },
              },
            },
            {
              href: '/invest/stocks/IRAO/',
              cells: {
                ticker: { primary: 'IRAO' },
                name: { primary: 'Интер РАО', secondary: 'IRAO · энергетика' },
                price: { primary: '3,92 ₽', secondary: '1 лот = 100 акций' },
              },
            },
          ],
        })}
        <figcaption>своя сетка колонок (width — значение grid-трека как есть), фикс. ширины + align end</figcaption>
      </figure>
      <figure>
        ${dataTable({
          rows: [
            row('Сбербанк', 'SBER', '318,44 ₽', '1 лот = 10 акций', '+12,55 ₽', '+1,46 %', 'positive'),
            { cells: { name: { primary: 'Листинг приостановлен', secondary: 'TROW' } } },
            row('Газпром', 'GAZP', '128,36 ₽', '1 лот = 10 акций', '+0,66 ₽', '+0,51 %', 'positive'),
            {
              href: '/invest/stocks/OZON/',
              cells: {
                name: { primary: 'Озон', secondary: 'OZON' },
                price: { primary: '3 410,00 ₽', secondary: '1 лот = 1 акция' },
              },
            },
          ],
        })}
        <figcaption>инертная строка (без href — без ссылки и ховера, фокус её перескакивает) и строка с пустой ячейкой изменения</figcaption>
      </figure>
      <figure>
        ${dataTable({ rows: [] })}
        <figcaption>rows=[]: нулевое состояние «Нет данных» (не пустота), без rowgroup</figcaption>
      </figure>
    </main>
  `,
};

export const Keyboard: Story = {
  name: 'Клавиатура (интерактивно)',
  render: () => {
    const log = (line: string): void => {
      const pre = document.getElementById('tkd-log-keyboard');
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 10).join('\n');
      }
    };
    // The row anchor of a composed event (Space/Enter activations, focus
    // moves): `event.target` RETARGETS to the host at the shadow boundary,
    // so the real leaf comes off the composed path.
    const anchorOf = (event: Event): Element | null => {
      const leaf = event.composedPath()[0];
      return leaf instanceof Element ? leaf.closest('a[data-index]') : null;
    };
    return html`
      ${canvasStyles}
      <main class="tkd-canvas">
        <h1>Клавиатура — roving tabindex</h1>
        <p class="tkd-note">
          Табличка ниже — живой стенд: кликните внутрь и работайте только с
          клавиатуры. Один <code>Tab</code>-стоп на всю таблицу (у
          сфокусированной строки <code>tabindex="0"</code>, у остальных
          <code>-1</code>), стрелки ↑/↓ — по строкам, на краях СТОП (без
          обхода), <code>Home</code>/<code>End</code> — первая/последняя
          строка, <code>Enter</code> — нативный переход по ссылке строки,
          <code>Space</code> — активация (ссылки не слушают Space нативно —
          компонент вызывает клик сам). Инертные строки фокус перескакивает.
          Лог справа пишет живую позицию таб-стопа и активации.
        </p>
        <section>
          <div class="tkd-frame" id="tkd-keyboard-frame">
            <tk-data-table
              id="tkd-keyboard-table"
              caption="Каталог акций (интерактив)"
              .columns=${STOCK_COLUMNS}
              .rows=${[
                row('Сбербанк', 'SBER', '318,44 ₽', '1 лот = 10 акций', '+12,55 ₽', '+1,46 %', 'positive', '#tkd-SBER'),
                { cells: { name: { primary: 'Листинг приостановлен', secondary: 'TROW' } } },
                row('Т-Технологии', 'TCSG', '3 285,00 ₽', '1 лот = 1 акция', '−48,50 ₽', '−0,9 %', 'negative', '#tkd-TCSG'),
                row('Газпром', 'GAZP', '128,36 ₽', '1 лот = 10 акций', '+0,66 ₽', '+0,51 %', 'positive', '#tkd-GAZP'),
                row('МТС', 'MTSS', '214,60 ₽', '1 лот = 10 акций', '+2,1 ₽', '+0,8 %', 'positive', '#tkd-MTSS'),
                row('ВТБ', 'VTBR', '0,0581 ₽', '1 лот = 10 000 акций', '+0,0002 ₽', '+0,35 %', 'positive', '#tkd-VTBR'),
              ]}
              @focusin=${(event: FocusEvent) => {
                const anchor = anchorOf(event);
                if (anchor) log(`фокус → строка ${Number(anchor.getAttribute('data-index')) + 1} (${anchor.textContent})`);
              }}
              @click=${(event: Event) => {
                const anchor = anchorOf(event);
                if (anchor) {
                  event.preventDefault(); // стенд: без ухода со страницы
                  log(`активация → ${anchor.getAttribute('href')} (строка ${Number(anchor.getAttribute('data-index')) + 1})`);
                }
              }}
            ></tk-data-table>
          </div>
          <pre class="tkd-log" id="tkd-log-keyboard">—</pre>
        </section>
      </main>
    `;
  },
};

export const LongList: Story = {
  name: '100 строк',
  render: () => html`
    ${canvasStyles}
    <main class="tkd-canvas">
      <h1>100 строк — без виртуализации</h1>
      <p class="tkd-note">
        Длинный список скроллится естественно (виртуализация вне v2): roving
        tabindex не деградирует — <code>End</code> ведёт на сотую строку и
        подскроллит её в поле зрения (<code>scrollIntoView: nearest</code>).
      </p>
      <div class="tkd-frame">
        ${dataTable({
          rows: Array.from({ length: 100 }, (_, i) => {
            const up = i % 3 !== 2;
            return row(
              `Акция ${i + 1}`,
              `TK${i}`,
              `${(100 + i * 7).toLocaleString('ru-RU')},00 ₽`,
              '1 лот = 1 акция',
              up ? `+${(i % 9) + 1},00 ₽` : `−${(i % 5) + 1},00 ₽`,
              up ? `+0,${i % 10} %` : `−0,${i % 10} %`,
              up ? 'positive' : 'negative',
            );
          }),
        })}
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkd-canvas">
      <h1>Темизация</h1>
      <p class="tkd-note">
        Таблица темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Прямой слот один —
        <code>--tk-data-table-row-min-height</code> (по умолчанию 81px —
        буква капчура; третья секция переопределяет его). Границы пар по
        цвету: deltas калиброваны по AA на базовой поверхности
        (<code>surface-base</code>/cream — проход 6.1); на подкрашенных
        поверхностях пара <code>delta-*</code> не гарантирована, поэтому
        санкционированная поверхность каталога — базовая, а muted-пример
        ниже несёт строки без направления (без <code>delta</code>).
        Тёмная тема приезжает ремапом слоя токенов (тёмные deltas —
        первичный проход 6.1, 8.2 верифицирует).
      </p>
      <section class="tkd-panel">
        ${dataTable({ rows: TEN_STOCKS.slice(0, 4) })}
      </section>
      <section class="tkd-panel tkd-panel--muted">
        ${dataTable({
          rows: [
            {
              href: '/invest/stocks/TATN/',
              cells: {
                name: { primary: 'Татнефть', secondary: 'TATN' },
                price: { primary: '678,40 ₽', secondary: '1 лот = 1 акция' },
                change: { primary: '0,00 ₽', secondary: '0,00 %' },
              },
            },
            {
              href: '/invest/stocks/SNGS/',
              cells: {
                name: { primary: 'Сургутнефтегаз', secondary: 'SNGS' },
                price: { primary: '20,86 ₽', secondary: '1 лот = 100 акций' },
                change: { primary: '0,00 ₽', secondary: '0,00 %' },
              },
            },
          ],
        })}
      </section>
      <section class="tkd-panel" style="--tk-data-table-row-min-height: 96px">
        ${dataTable({ rows: TEN_STOCKS.slice(4, 7) })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkd-canvas">
      <h1>Доступность</h1>
      <p class="tkd-note">
        Контейнер — <code>role="table"</code> с именем через
        <code>caption</code> (aria-label, видимого заголовка нет — как в
        образце); шапка — <code>role="row"</code> из
        <code>role="columnheader"</code>, тело — <code>role="rowgroup"</code>
        из <code>role="row"</code>/<code>role="cell"</code>. В КАЖДОЙ строке
        ровно одна ссылка — первичный текст первой ячейки, её
        <code>::after</code> накрывает строку: вся строка — зона клика
        (≥44px с запасом). Кольцо фокуса — единый токен 2px вокруг ВСЕЙ
        строки (регистр «бокса», не подчёркивание), только с клавиатуры.
        Строка без <code>href</code> инертна и не участвует в фокусе.
        Направление deltas несёт ЦВЕТ (ядро семантики таблицы); ховер по
        строке — токен <code>surface-row-hover</code> (контраст пары на ховере
        — зафиксированное исключение §9, см. журнал конвенций).
      </p>
      <h2>Чек-лист: только с клавиатуры (roving-контракт)</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code></td>
            <td>Фокус входит на ПЕРВУЮ строку таблицы — единственный таб-стоп; <code>Shift+Tab</code> выходит тем же путём.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code></td>
            <td>Фокус по строкам; на первой/последней — СТОП (обхода через край нет); инертные строки перескакиваются.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Первая / последняя ДОСТУПНАЯ строка (длинные списки подскролливаются).</td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Нативный переход по href строки (компонент не перехватывает).</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Активация ссылки (preventDefault + click — ссылки не активируются пробелом нативно).</td>
          </tr>
          <tr>
            <td><code>Tab</code> со строки</td>
            <td>Выходит из таблицы естественным порядком — с той строки, где стоит фокус.</td>
          </tr>
          <tr>
            <td>Клик мышью по строке</td>
            <td>Переход по href с любого места строки; таб-стоп переезжает на эту строку; кольцо НЕ рисуется (фокус не клавиатурный).</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Каталог акций, таблица, 11 строк, 3 столбца»; ячейка имени — «Сбербанк, ссылка»; deltas читают знак из данных («+12,55 рубля»), цвет — дублирование.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkd-block">
        ${dataTable({ rows: TEN_STOCKS.slice(0, 6) })}
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkd-note">
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
            <td>Tab на таблицу</td>
            <td>«Каталог акций, таблица»; фокус на первой строке: «Сбербанк, ссылка» (стоп один — следующая строка только стрелкой)</td>
          </tr>
          <tr>
            <td>↓ ↓ по строкам</td>
            <td>«Т-Технологии, ссылка», затем «Газпром, ссылка» — по одному объявлению на строку</td>
          </tr>
          <tr>
            <td>Строка без ссылки</td>
            <td>Инертная строка не получает фокус — стрелка объявляет СЛЕДУЮЩУЮ доступную строку</td>
          </tr>
          <tr>
            <td>Enter на строке</td>
            <td>Переход по адресу строки (нативная навигация ссылки)</td>
          </tr>
          <tr>
            <td>Ячейка deltas</td>
            <td>Знак читается из текста данных («+12,55 рубля», «+1,46 процента») — направление дублируется знаком, цвет несёт визуальную семантику</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-data-table'),
};
