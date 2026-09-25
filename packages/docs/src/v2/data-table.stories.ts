import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/data-table/data-table.js';

/**
 * v2 docs page — tk-data-table (spec 8.3): what/when/not-for, live usage,
 * theming, a11y incl. the SR protocol and the roving-keyboard contract,
 * composition pointers. API table is the generated CEM render; the
 * interactive suite lives at Components/Data table. Content RU, meta EN.
 */

const COLUMNS = [
  { key: 'name', header: 'Инструмент', width: '2fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'change', header: 'Изменение', align: 'end' },
];

const ROWS = [
  {
    href: '#sber',
    cells: {
      name: { primary: 'Сбербанк', secondary: 'SBER' },
      price: { primary: '314,65 ₽' },
      change: { primary: '+1,84 ₽ (+0,59%)', delta: 'positive' },
    },
  },
  {
    href: '#gazp',
    cells: {
      name: { primary: 'Газпром', secondary: 'GAZP' },
      price: { primary: '128,4 ₽' },
      change: { primary: '−0,35 ₽ (−0,27%)', delta: 'negative' },
    },
  },
  {
    href: '#lkoh',
    cells: {
      name: { primary: 'Лукойл', secondary: 'LKOH' },
      price: { primary: '7 315,5 ₽' },
      change: { primary: '+52,5 ₽ (+0,72%)', delta: 'positive' },
    },
  },
  {
    cells: {
      name: { primary: 'Индекс МосБиржи', secondary: 'IMOEX' },
      price: { primary: '3 254,82' },
      change: { primary: '+8,14 (+0,25%)', delta: 'positive' },
    },
  },
];

const meta: Meta = {
  title: 'Components v2/Data table',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Data table — типографическая таблица-каталог</h1>
      <p class="tkv2-note">
        <code>tk-data-table</code> — флагманский компонент v2: двухстрочные
        ячейки (первичная 15/24 + вторичная 13/20), дельты, у которых
        НАПРАВЛЕНИЕ несёт цвет, строки 81px с волосяными разделителями
        1px, ховер всей строки и каждая строка — нативный якорь, чьё
        <code>::after</code> накрывает строку целиком (вся строка — зона
        клика).
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Каталоги-списки с переходом: строки ведут на страницы инструментов
          (<code>href</code>), клик — по всей площади строки.
        </li>
        <li>
          Плотные табличные данные в реестре product-UI: типографика
          body-m/body-s, выравнивание чисел по правому краю
          (<code>align: 'end'</code>).
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Редактируемые/сортируемые таблицы: канал выбора и сортировка — вне
          v2 (шапка статична); это таблица-НАВИГАЦИЯ, не сетка данных.
        </li>
        <li>
          Очень длинные наборы с виртуализацией — вне v2: списки скроллятся
          естественно, окна не делают.
        </li>
        <li>
          Логотипы брендов колонкой — типа колонки «лого» в v2 нет (и
          сторонние знаки — актив потребителя).
        </li>
      </ul>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <tk-data-table
          caption="Каталог инструментов"
          .columns=${COLUMNS}
          .rows=${ROWS}
        ></tk-data-table>
      </div>
      ${codeBlock(`<tk-data-table caption="Каталог инструментов">
</tk-data-table>

<script type="module">
  import 'pillkit-components';
  const table = document.querySelector('tk-data-table');
  table.columns = [
    { key: 'name', header: 'Инструмент', width: '2fr' },
    { key: 'price', header: 'Цена', align: 'end' },   // трек как в CSS grid
    { key: 'change', header: 'Изменение', align: 'end' },
  ];
  table.rows = [
    {
      href: '/invest/sber/',            // вся строка — ссылка; нет href = инертная строка
      cells: {
        name:   { primary: 'Сбербанк', secondary: 'SBER' },
        price:  { primary: '314,65 ₽' },
        change: { primary: '+1,84 ₽ (+0,59%)', delta: 'positive' }, // цвет = направление
      },
    },
  ];
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Клавиатурный контракт.</strong> Клавиатурный слой — roving
        tabindex по APG: ОДИН таб-стоп на таблицу, ↑/↓ по строкам со
        СТОПОМ на краях (инертные строки перескакиваются), Home/End — к
        первой/последней доступной, Enter — нативный переход якоря, Space —
        preventDefault + click (якоря не активируются Space сами). Это
        СОЗНАТЕЛЬНОЕ улучшение кита над референсом (FR-12): у эталона
        таблица клавиатурно непроходима. Дельты на ховере строки —
        зафиксированное исключение §9 (журнал конвенций): направление-цвет
        семантически неделимо, контраст пары на ховер-заливке ниже 4,5:1 на
        одной ноге темы, все цифры закреплены в contrast-тестах.
      </div>
      <p class="tkv2-note">
        Каналов значений и событий НЕТ вообще: <code>columns</code>,
        <code>rows</code>, <code>caption</code> — только входные свойства;
        клик — нативная навигация якоря, кит ничего не перехватывает
        (навигация, не форма — то же правило, что у navbar). Деградация без
        исключений (§2): пустые <code>rows</code> рендерят копию нулевого
        состояния «Нет данных», неизвестные ключи колонок — пустые ячейки.
      </p>

      <h2>Темизация</h2>
      <p>
        Разделители — <code>border-table</code> (полупрозрачный тёмный в
        светлой теме, белый-слой в тёмной), ховер строки —
        <code>surface-row-hover</code>, дельты —
        <code>delta-positive</code>/<code>delta-negative</code> (в тёмной
        теме — собственные первые проходы 6.1; дельты санкционированы на
        surface-base покоящихся строк). Узкие вьюпорты скроллят хост
        (<code>overflow-x: auto</code>) против min-width таблицы — колонки
        никогда не перестраиваются. Переопределение геометрии — слот
        <code>--tk-data-table-row-min-height</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Роли APG-таблицы: контейнер <code>role="table"</code> с именем через
        <code>caption</code> (aria-label, видимого заголовка нет — как в
        эталоне), шапка <code>columnheader</code>, тело
        <code>rowgroup</code>/<code>row</code>/<code>cell</code>. В каждой
        строке ровно одна ссылка — доступное имя строки наследует её.
        Кольцо фокуса — единый токен 2px вокруг ВСЕЙ строки, только с
        клавиатуры. Живой чек-лист — история «Клавиатура», полный —
        <a href="?path=/story/components-datatable--accessibility" target="_top"
          >«Доступность»</a
        >
        на странице компонента.
      </p>
      <h3>Протокол скринридер-проверки (VoiceOver / NVDA)</h3>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab в таблицу</td>
            <td>«Каталог инструментов, таблица» — имя из caption; фокус на первой строке</td>
          </tr>
          <tr>
            <td>Строка в фокусе</td>
            <td>«Сбербанк, SBER, 314,65 ₽, +1,84 ₽ (+0,59%), ссылка» — строка читается ячейками, имя — из единственного якоря</td>
          </tr>
          <tr>
            <td>↓ / ↑</td>
            <td>переход по строкам без выхода из таблицы; на краях — стоп</td>
          </tr>
          <tr>
            <td>Home / End</td>
            <td>первая / последняя ДОСТУПНАЯ строка (инертные перескакиваются)</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>переход по href строки (нативный)</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Центр каталога инструментов — сценарий
        <a
          href="?path=/story/showcase-stocks-catalog--stocks-catalog"
          target="_top"
          >Showcase/Stocks catalog</a
        >: поиск + чипы + таблица + пагинация на одной странице.
      </p>
    </div>
    ${apiReferenceDoc('tk-data-table')}
  `,
};
