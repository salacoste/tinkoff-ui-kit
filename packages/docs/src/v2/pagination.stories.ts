import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/pagination/pagination.js';

/**
 * v2 docs page — tk-pagination (spec 8.3): what/when/not-for, live usage,
 * theming, a11y incl. the SR protocol, composition pointers. API table is
 * the generated CEM render; the interactive suite lives at
 * Components/Pagination. Content RU, meta EN.
 */

const meta: Meta = {
  title: 'Components v2/Pagination',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Pagination — пагинация каталога</h1>
      <p class="tkv2-note">
        <code>tk-pagination</code> — навигация по страницам данных: ряд
        номеров с жёлтой активной пилюлей, окно из пяти номеров с
        многоточиями, шевроны «‹/›» на границах и ОТДЕЛЬНАЯ полоса «Показать
        еще» над номерами. Компонент домена invest/stocks (v2).
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Постраничный просмотр длинного каталога: активная страница — жёлтая
          пилюля, окна номеров схлопываются в «…», первая и последняя
          страницы видны всегда.
        </li>
        <li>
          Режим «догрузки»: <code>show-more</code> рисует полосу «Показать
          еще» — нажатие шлёт голое событие <code>load-more</code> и НЕ
          меняет страницу (догружает потребитель).
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Чистая догрузка без номеров страниц: ряд номеров — ядро анатомии и
          отдельным переключателем не отключается; для ленты без пагинации
          соберите полосу сами (например, из <code>tk-button</code>).
        </li>
        <li>
          Пошаговые мастера — для этого <code>tk-stepper</code> (индекс
          прогресса, не выбор страницы).
        </li>
        <li>
          Малые наборы (до ~20 позиций одной страницы) — пагинация добавляет
          шум; покажите список целиком.
        </li>
      </ul>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <tk-pagination count="196" default-page="1" show-more></tk-pagination>
      </div>
      ${codeBlock(`<!-- неконтролируемый режим: страницу хранит элемент -->
<tk-pagination count="196" default-page="1" show-more></tk-pagination>

<script type="module">
  import 'pillkit-components';
  const pager = document.querySelector('tk-pagination');
  pager.addEventListener('page-change', (event) => {
    console.log(event.detail.value); // новая страница — число
  });
  pager.addEventListener('load-more', () => {
    // «Показать еще»: страница НЕ меняется — догрузите данные сами
  });
</script>`)}
      <p class="tkv2-note">
        Контролируемый режим — по контракту §4: свойство <code>page</code>
        (только свойство, без атрибута) рендерится ровно как задано;
        <code>page-change</code> несёт
        <code>detail.value</code> — новое число. Недопустимые значения
        <code>count</code> клампятся к 1, деградация без исключений (§2).
      </p>
      <div class="tkv2-gotcha">
        <strong>Договорённости с потребителем.</strong>
        Активная страница — фокусируемая кнопка с
        <code>aria-current="page"</code>, её активация — no-op (записанный
        выбор: плоский порядок Tab и цель фокуса после смены страницы).
        Шевроны на границах не отключаются атрибутом — они
        <code>text-muted</code> с <code>aria-disabled</code>. «Показать еще»
        — ГОЛОЕ событие-occurrence без payload: компонент никогда не
        решает, что значит «догрузить».
      </div>

      <h2>Темизация</h2>
      <p>
        Наследование семантики без собственных значений: номера —
        <code>link</code> (в тёмной теме переотображается), активная
        пилюля — <code>yellow-100</code> с чернильным текстом
        (инвариантны в обеих темах), полоса «Показать еще» —
        <code>surface-muted</code> с текстом <code>link-on-tint</code> (AA
        шаг для ссылки на тонированной поверхности). Точечные слоты §6:
        <code>--tk-pagination-active-fill</code>,
        <code>--tk-pagination-active-text</code>,
        <code>--tk-pagination-page-text</code>,
        <code>--tk-pagination-more-fill</code>,
        <code>--tk-pagination-more-text</code>,
        <code>--tk-pagination-radius</code>,
        <code>--tk-pagination-more-radius</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Контейнер — ориентир <code>&lt;nav&gt;</code> с именем через
        <code>label</code> (по умолчанию «Пагинация»). Многоточие —
        <code>aria-hidden</code>: это визуальное сокращение, не кнопка.
        Полный чек-лист — на странице компонента (история
        <a href="?path=/story/components-pagination--accessibility" target="_top"
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
            <td>«Пагинация, навигация» — имя ориентира; затем «страница 1, текущая страница» на активной</td>
          </tr>
          <tr>
            <td>Номер страницы</td>
            <td>«2, ссылка/кнопка» — номер и роль; активная дополнительно «текущая страница»</td>
          </tr>
          <tr>
            <td>Шеврон на границе</td>
            <td>«Назад, недоступна» — aria-disabled на границе ряда</td>
          </tr>
          <tr>
            <td>«Показать еще»</td>
            <td>«Показать еще, кнопка» — обычная кнопка; после нажатия объявление не меняется (страницу держит потребитель)</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Нижний кластер каталога — сценарий
        <a
          href="?path=/story/showcase-stocks-catalog--stocks-catalog"
          target="_top"
          >Showcase/Stocks catalog</a
        >: таблица + пагинация с «Показать еще», связка живая.
      </p>
    </div>
    ${apiReferenceDoc('tk-pagination')}
  `,
};
