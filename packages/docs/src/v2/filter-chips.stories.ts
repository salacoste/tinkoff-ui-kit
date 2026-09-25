import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/filter-chips/filter-chips.js';

/**
 * v2 docs page — tk-filter-chips (spec 8.3): what/when/not-for, live usage,
 * theming, a11y incl. the SR protocol, composition pointers. API table is
 * the generated CEM render; the interactive suite lives at
 * Components/Filter chips. Content RU, meta EN (baseline stability).
 */

const CATALOG_FILTERS = [
  { value: 'all', label: 'Все инструменты' },
  { value: 'stocks', label: 'Акции' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'etf', label: 'Фонды' },
  { value: 'currency', label: 'Валюты' },
  { value: 'futures', label: 'Фьючерсы' },
  { value: 'options', label: 'Опционы' },
  { value: 'indices', label: 'Индексы' },
  { value: 'commodities', label: 'Товары' },
];

const meta: Meta = {
  title: 'Components v2/Filter chips',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Filter chips — ряд фильтров-пилюль</h1>
      <p class="tkv2-note">
        <code>tk-filter-chips</code> — однострочный ряд фильтров каталога
        инструментов: пилюли radius-full в одну НЕпереносящуюся строку,
        одиночный выбор, переполнение собирается в чип «Ещё» с выпадающим
        меню. Компонент домена invest/stocks (v2).
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Переключение ОДНОГО фильтра на странице каталога: выбор чипа
          деактивирует предыдущий — множественного выбора нет by design.
        </li>
        <li>
          Короткие взаимоисключающие категории (типы инструментов, периоды) —
          до ~9 пунктов; всё сверх <code>visible-count</code> уходит в «Ещё».
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Множественный выбор — это другой паттерн; чипы одиночные по
          построению (повторный выбор активного чипа сохраняет его активным,
          «сброса в ничто» нет).
        </li>
        <li>
          Навигация по разделам — для этого есть ссылки (в т.ч. второй ряд
          <code>tk-navbar</code>, см. «Mega nav»); чипы — фильтр данных, не
          переход.
        </li>
        <li>
          Ввод произвольного значения — это <code>tk-combobox-search</code>,
          не чипы.
        </li>
      </ul>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <tk-filter-chips
          label="Тип инструмента"
          default-value="stocks"
          visible-count="7"
          .items=${CATALOG_FILTERS}
        ></tk-filter-chips>
      </div>
      ${codeBlock(`<!-- неконтролируемый режим — выбор хранит элемент -->
<tk-filter-chips label="Тип инструмента" default-value="stocks">
</tk-filter-chips>

<script type="module">
  import 'pillkit-components';
  const chips = document.querySelector('tk-filter-chips');
  chips.items = [
    { value: 'all', label: 'Все инструменты' },
    { value: 'stocks', label: 'Акции' },
    // … ещё пункты; всё после 7-го уйдёт в «Ещё»
  ];
  chips.addEventListener('value-change', (event) => {
    console.log(event.detail.value); // выбранное значение — строка
  });
</script>`)}
      <p class="tkv2-note">
        Контролируемый режим — по контракту §4: задайте <code>value</code>, и
        элемент рендерит ровно его; <code>value-change</code> только
        сообщает, применение за потребителем. Данные пунктов — свойство
        <code>items</code> (объекты не отражаются атрибутами).
      </p>
      <div class="tkv2-gotcha">
        <strong>Договорённости с потребителем.</strong> Роль контейнера —
        <code>tablist</code>, чипы — <code>tab</code> c
        <code>aria-selected</code> (семантика референса). Каждый чип —
        таб-стоп: у референса 7 наблюдаемых остановок, это зафиксированное
        отклонение от roving-tabindex APG. Стрелки ←/→ двигают ФОКУС без
        выбора, Space/Enter выбирают; фокус сохраняется на чипе после смены
        значения. Меню «Ещё» — внутреннее состояние: канал <code>open</code>
        отсутствует (запись в журнале исключений §9 CONVENTIONS.md).
      </div>

      <h2>Темизация</h2>
      <p>
        Компонент наследует семантику без собственных значений: волосяная
        линия невыбранного — <code>border-default</code>, выбранный чип —
        рамка 2px <code>yellow-100</code> при НЕизменённых заливке и тексте
        (выбор — только рамка; жёлтый текст на белом не проходит AA).
        Переключите контрол Theme в тулбаре — в тёмной теме линии и текст
        переразрешаются токенами, жёлтая рамка инвариантна. Точечные
        переопределения — слоты грамматики §6:
        <code>--tk-filter-chips-fill</code>,
        <code>--tk-filter-chips-text</code>,
        <code>--tk-filter-chips-selected-border</code>,
        <code>--tk-filter-chips-radius</code>,
        <code>--tk-filter-chips-menu-radius</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Группа получает имя через <code>label</code> (видимой подписи в
        референсе нет; без атрибута подставляется «Фильтры»). Меню «Ещё» —
        кнопка с <code>aria-haspopup</code>/<code>aria-expanded</code> и
        пункты <code>menuitemradio</code>. Полные чек-листы — на странице
        компонента (история
        <a href="?path=/story/components-filterchips--accessibility" target="_top"
          >«Доступность»</a
        >).
      </p>
      <h3>Протокол скринридер-проверки (VoiceOver / NVDA)</h3>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab в ряд</td>
            <td>«Тип инструмента, список вкладок» — имя группы и роль tablist</td>
          </tr>
          <tr>
            <td>Tab по чипам</td>
            <td>«Все инструменты, вкладка, выбрана 1 из 9» — имя, роль tab, состояние выбора</td>
          </tr>
          <tr>
            <td>Space / Enter на чипе</td>
            <td>объявление нового выбранного чипа; прежний снимается; фокус остаётся на выбранном</td>
          </tr>
          <tr>
            <td>Кнопка «Ещё»</td>
            <td>«Ещё, кнопка, развёрнуто» при открытом меню; пункты — «Акции, пункт меню, выбран»</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Живая сборка каталога — кластер управления фильтрами в сценарии
        <a
          href="?path=/story/showcase-stocks-catalog--stocks-catalog"
          target="_top"
          >Showcase/Stocks catalog</a
        >
        (поиск + чипы + таблица + пагинация на одной странице).
      </p>
    </div>
    ${apiReferenceDoc('tk-filter-chips')}
  `,
};
