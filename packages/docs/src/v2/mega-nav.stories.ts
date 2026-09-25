import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/navbar/navbar.js';

/**
 * v2 docs page — the mega-nav/two-deep navbar EXTENSION (spec 8.3): this
 * page extends the tk-navbar documentation with the row-2 sub-nav section
 * (the subLinks contract, Story 7.1). Row 1 (v1) is documented at
 * Components/Navbar; the API table below is the FULL tk-navbar manifest —
 * the v2 rows are sub-active-value / sub-label / subLinks. Content RU,
 * meta EN.
 */

const NAV_LINKS = [
  { value: 'retail', label: 'Частным лицам', href: '#' },
  { value: 'business', label: 'Бизнесу', href: '#' },
  { value: 'invest', label: 'Инвестиции', href: '#' },
  { value: 'insurance', label: 'Страхование', href: '#' },
  { value: 'payments', label: 'Платежи', href: '#' },
];

const SUB_LINKS = [
  { value: 'catalog', label: 'Каталог', href: '#' },
  { value: 'portfolio', label: 'Портфель', href: '#' },
  { value: 'pulse', label: 'Пульс', href: '#' },
  { value: 'terminal', label: 'Терминал', href: '#' },
  { value: 'analytics', label: 'Аналитика', href: '#' },
];

const meta: Meta = {
  title: 'Components v2/Mega nav',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Mega nav — двухрядная шапка домена</h1>
      <p class="tkv2-note">
        Это расширение <code>tk-navbar</code> (v2, Story 7.1): опциональный
        ВТОРОЙ навигационный ряд — «банк-широкий» ряд 1 плюс поднавигация
        домена (инвестиции, бизнес). Отдельного элемента
        <code>tk-mega-nav</code> нет: тот же <code>tk-navbar</code> получает
        свойство <code>subLinks</code> — решение «не плодить элементы без
        нужды». Ряд 1 не меняется вообще; документация базовой шапки — на
        странице
        <a href="?path=/story/components-navbar--playground" target="_top"
          >Components/Navbar</a
        >.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Кросс-доменные шапки «второго уровня»: когда у раздела
          (Инвестиции, Бизнес) есть собственные подразделы, а верхний ряд
          остаётся общебанковским.
        </li>
        <li>
          Один sticky-бар на обе строки: тень и липкость наследуются, шов
          между рядами несёт волосяную линию, тень лежит под ПОСЛЕДНИМ
          рядом.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Мобильные вьюпорты: второй ряд — desktop-only хром, ниже 768px он
          скрыт И никогда не попадает в burger-drawer (drawer остаётся на
          ссылках ряда 1 — модель v1 без изменений).
        </li>
        <li>
          Мега-панели с контентом (карточки/баннеры в выпадающем слое):
          референс двухрядных шапок — плоские ссылки поднавигации, не
          контентные панели; таких элементов в ките нет.
        </li>
      </ul>

      <h2>Контракт subLinks</h2>
      <p>
        Форма записи — ТА ЖЕ, что у <code>links</code>:
        <code>{ value, label, href }</code>. Пустой или отсутствующий список
        рендерит НОЛЬ изменений: без <code>subLinks</code> DOM, CSS и вывод
        байт-в-байт идентичны v1 (закреплено юнит-тестом — базовые baselines
        не двигаются). Активный подраздел — <code>sub-active-value</code>:
        совпавшая ссылка получает вес 700, цвет text-primary и серое
        подчёркивание 2px по нижней кромке ряда; НЕсовпавший маркер не
        подсвечивает ничего (того же правила «нет клампа всегда-один-актив»,
        что и в <code>active-value</code>). Второй ряд — самостоятельный
        ориентир <code>&lt;nav&gt;</code> с именем через
        <code>sub-label</code> (по умолчанию «Разделы»).
      </p>
      <div class="tkv2-demo" style="padding: 0">
        <tk-navbar
          .links=${NAV_LINKS}
          active-value="invest"
          .subLinks=${SUB_LINKS}
          sub-active-value="catalog"
        >
          <strong slot="logo">Т-Банк</strong>
        </tk-navbar>
      </div>
      ${codeBlock(`<tk-navbar active-value="invest" sub-active-value="catalog">
  <span slot="logo">Т-Банк</span>
</tk-navbar>

<script type="module">
  import 'pillkit-components';
  const navbar = document.querySelector('tk-navbar');
  navbar.links = [
    { value: 'retail', label: 'Частным лицам', href: '/' },
    { value: 'invest', label: 'Инвестиции', href: '/invest/' },
    // ряд 1 — тот же контракт, что в v1
  ];
  navbar.subLinks = [
    { value: 'catalog', label: 'Каталог', href: '/invest/catalog/' },
    { value: 'portfolio', label: 'Портфель', href: '/invest/portfolio/' },
    // ряд 2 — ТА ЖЕ форма записи; пустой список = шапка v1 без изменений
  ];
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Договорённости с потребителем.</strong>
        Навигация, НЕ канал значений: клик по ссылке — нативный переход
        якоря, кит не перехватывает роутинг; пары §4 value/defaultValue и
        событий НЕТ (закреплено юнит-тестом). Активность
        (<code>active-value</code>, <code>sub-active-value</code>) —
        входные свойства страницы, страница сама знает текущий раздел.
        Дубликаты и записи без value отфильтровываются с dev-предупреждением.
      </div>

      <h2>Темизация</h2>
      <p>
        Оба ряда наследуют семантику: заливка бара
        <code>--tk-navbar-fill</code> (surface-base, в тёмной теме
        переотображается), ссылки — <code>--tk-navbar-link</code>,
        активная ряда 1 — жёлтое подчёркивание
        <code>--tk-navbar-underline</code> с весом 700 (жёлтое дублируется
        весом — АА-правило избыточности), поднавигация —
        <code>--tk-navbar-sublink</code> (text-secondary), активная —
        <code>--tk-navbar-sublink-active</code> + подчёркивание. Тень
        скролла появляется после порога 10px и в тёмной теме схлопывается
        (токеновый слой). Слоты ряда 2: полная гамма
        <code>--tk-navbar-sub*</code> в таблице API ниже.
      </p>

      <h2>Доступность</h2>
      <p>
        Два ряда — ДВА ориентира <code>&lt;nav&gt;</code> с различающимися
        именами («Навигация» и «Разделы» по умолчанию): несколько nav на
        странице обязаны различаться для скринридеров. Внутри — нативные
        якоря: роль, имя и активация достаются конструкцией. Полные чек-листы
        (включая burger-двухрядность и фокус-ловушку drawer) — истории
        <a
          href="?path=/story/components-navbar--mega-nav-accessibility"
          target="_top"
          >«Доступность (мега)»</a
        >
        и
        <a href="?path=/story/components-navbar--accessibility" target="_top"
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
            <td>Просмотр ориентиров (ротор Landmarks в VoiceOver)</td>
            <td>«Навигация 1: Навигация» и «Навигация 2: Разделы» — два различимых ориентира</td>
          </tr>
          <tr>
            <td>Ссылка ряда 1 (активная)</td>
            <td>«Инвестиции, ссылка» — активность подчёркиванием для глаза; имя и роль неизменны</td>
          </tr>
          <tr>
            <td>Ссылка ряда 2</td>
            <td>«Каталог, ссылка 1 из 5» — плоский порядок Tab внутри ряда</td>
          </tr>
          <tr>
            <td>&lt;768px (burger)</td>
            <td>ряда 2 в списке НЕТ: drawer перечисляет только ссылки ряда 1</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Двухрядная шапка открывает каталог инструментов — сценарий
        <a
          href="?path=/story/showcase-stocks-catalog--stocks-catalog"
          target="_top"
          >Showcase/Stocks catalog</a
        >
        (шапка с <code>subLinks</code> разделов инвестиций). Бизнес-лендинг
        использует ряд 1 без поднавигации —
        <a
          href="?path=/story/showcase-business-landing--business-landing"
          target="_top"
          >Showcase/Business landing</a
        >.
      </p>
    </div>
    ${apiReferenceDoc('tk-navbar')}
  `,
};
