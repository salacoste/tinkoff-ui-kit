import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/combobox-search/combobox-search.js';

/**
 * v2 docs page — tk-combobox-search (spec 8.3): what/when/not-for, live
 * usage, theming, a11y incl. the SR protocol, composition pointers. API
 * table is the generated CEM render; the interactive suite lives at
 * Components/Combobox search. Content RU, meta EN.
 */

const INSTRUMENTS = [
  { value: 'SBER', label: 'Сбербанк' },
  { value: 'GAZP', label: 'Газпром' },
  { value: 'LKOH', label: 'Лукойл' },
  { value: 'GMKN', label: 'Норникель' },
  { value: 'YNDX', label: 'Яндекс' },
  { value: 'TCSG', label: 'Т-Технологии' },
  { value: 'MOEX', label: 'Мосбиржа' },
  { value: 'VTBR', label: 'ВТБ' },
];

const meta: Meta = {
  title: 'Components v2/Combobox search',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Combobox search — поиск с подсказками</h1>
      <p class="tkv2-note">
        <code>tk-combobox-search</code> — безрамочное поле поиска (52px,
        заливка <code>surface-field</code>, лупа, плейсхолдер «Название или
        тикер») с фильтрующим списком подсказок в выпадающей панели. Поле
        остаётся полем ввода: панель — генерируемый оверлей, а не inline-рост.
        Компонент домена invest/stocks (v2).
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Поиск по каталогу с выбором конкретной записи: фильтр регистронезависимый
          — подстрока ищется И по названию, И по тикеру («GAZP» и «Газ» находят
          «Газпром»).
        </li>
        <li>
          Плотные каталоги, где важна клавиатура: полный контракт комбинированного
          списка APG — стрелки, Home/End, Enter-коммит, Escape-возврат.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Форма с отправкой запроса: это поисковое ПОЛЕ выбора записи, а не
          текстовый input с кнопкой «Найти» — самостоятельный поиск без
          списка подсказок соберите из <code>tk-input</code>.
        </li>
        <li>
          Выбор из малого фиксированного набора (до ~7) — дешевле
          <code>tk-select</code> или чипы <code>tk-filter-chips</code>.
        </li>
        <li>
          Ранжирование по релевантности: фильтр детерминированный, порядок —
          как в <code>options</code>; сортировку делает потребитель данными.
        </li>
      </ul>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <div style="max-width: 480px">
          <tk-combobox-search
            label="Поиск инструмента"
            placeholder="Название или тикер"
            .options=${INSTRUMENTS}
          ></tk-combobox-search>
        </div>
      </div>
      ${codeBlock(`<tk-combobox-search label="Поиск инструмента">
</tk-combobox-search>

<script type="module">
  import 'pillkit-components';
  const search = document.querySelector('tk-combobox-search');
  search.options = [
    { value: 'SBER', label: 'Сбербанк' },
    { value: 'GAZP', label: 'Газпром' },
    // …
  ];
  search.addEventListener('value-change', (event) => {
    // ПРИШЛО ТОЛЬКО КОММИТ-значение: Enter/стрелки+Enter по активной строке
    console.log(event.detail.value); // тикер выбранной записи — строка
  });
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Печатание НИКОГДА не эмитит.</strong> Живой запрос —
        переходящее состояние ввода, НЕ значение: <code>value-change</code>
        приходит только с коммитом (Enter по активной строке; Enter в пустом
        поле — коммита нет). Escape закрывает панель И возвращает полю подпись
        закоммиченного значения; клик вне закрывает панель, сохраняя набранный
        текст. Открытость панели — внутреннее состояние (нет канала
        <code>open</code>, запись в журнале исключений §9). IME-композиция
        (китайский/японский ввод) не прерывается: события композиции
        игнорируются до её завершения.
      </div>
      <p class="tkv2-note">
        Контролируемый режим — строгий §4: <code>value</code> рендерится
        ровно как задан (чужое значение отображается как есть, ничего не
        клампится); коммит эмитит и НЕ применяется локально. Счётчик «Найдено
        N инструментов» объявляется в вежливой live-области после каждого
        фильтра; шаблоны сообщений — <code>results-message</code> /
        <code>no-results-message</code>.
      </p>

      <h2>Темизация</h2>
      <p>
        Заливка поля — <code>surface-field</code> (в тёмной теме — белый
        слой с прозрачностью), панель — <code>surface-base</code> с волосяной
        линией и тенью <code>shadow-dropdown</code> (в тёмной теме тень
        схлопывается в none, иерархию держит тональная ступень). Активная
        строка — шаг <code>surface-field</code>. Слоты §6:
        <code>--tk-combobox-search-fill</code>,
        <code>--tk-combobox-search-text</code>,
        <code>--tk-combobox-search-icon</code>,
        <code>--tk-combobox-search-placeholder</code>,
        <code>--tk-combobox-search-radius</code>,
        <code>--tk-combobox-search-menu-radius</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Контракт APG combobox: <code>role="combobox"</code> с
        <code>aria-expanded</code>/<code>aria-controls</code>/
        <code>aria-activedescendant</code>,
        <code>aria-autocomplete="list"</code>; панель — <code>listbox</code>
        из <code>option</code>. Фокус НЕ покидает поле — навигация двигает
        aria-activedescendant по строкам. Home/End работают как клавиши меню
        только при открытой панели; закрытой — нативные перемещения каретки.
        Пробел — символ запроса, НЕ клавиша меню. Полный чек-лист — история
        <a
          href="?path=/story/components-comboboxsearch--accessibility"
          target="_top"
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
            <td>Tab в поле</td>
            <td>«Поиск инструмента, поле редактирования комбинированного списка» — имя и роль</td>
          </tr>
          <tr>
            <td>Печать «газ»</td>
            <td>«Найден 1 инструмент» в live-области (шаблон склоняется по числам); текст запроса озвучивается как ввод</td>
          </tr>
          <tr>
            <td>ArrowDown</td>
            <td>«Газпром, выбрано 1 из 1» — активная строка через aria-activedescendant, фокус остаётся в поле</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>коммит: поле читает подпись выбранной записи; value-change ушёл потребителю</td>
          </tr>
          <tr>
            <td>Escape</td>
            <td>панель закрылась, поле вернулось к подписи закоммиченного значения</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Верхний кластер каталога — рядом с чипами фильтров в сценарии
        <a
          href="?path=/story/showcase-stocks-catalog--stocks-catalog"
          target="_top"
          >Showcase/Stocks catalog</a
        >.
      </p>
    </div>
    ${apiReferenceDoc('tk-combobox-search')}
  `,
};
