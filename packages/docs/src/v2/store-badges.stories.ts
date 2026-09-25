import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/store-badges/store-badges.js';

/**
 * v2 docs page — tk-store-badges (spec 8.3): what/when/not-for, live
 * usage, theming, a11y incl. the SR protocol, composition pointers. API
 * table is the generated CEM render; the interactive suite lives at
 * Components/Store badges. Content RU, meta EN.
 */

/** A neutral placeholder mark — deliberately NOT any store's art (named
 *  colors only, the kit stories' own placeholder mold). */
const PLACEHOLDER_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='12' fill='gray'/><path d='M24 12v14m0 0l-6-6m6 6l6-6' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/><path d='M15 33v3h18v-3' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
)}`;

const STORES = [
  { href: 'https://example.com/rustore', label: 'RuStore', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/appgallery', label: 'AppGallery', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/samsung', label: 'Samsung Store' },
];

const meta: Meta = {
  title: 'Components v2/Store badges',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Store badges — ряд бейджей магазинов приложений</h1>
      <p class="tkv2-note">
        <code>tk-store-badges</code> — ряд одинаковых светлых пилюль: слева
        голое название магазина, справа — знак, вся поверхность пилюли —
        внешняя ссылка. Форму и меру задаёт компонент; ЗНАКИ магазинов —
        данные потребителя.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Кластер «Скачать приложение» на лендингах: 2–3 стора рядом
          (RuStore, AppGallery, сторонние), каждый — переход вовне.
        </li>
        <li>
          Ряд ссылок на внешние площадки — пилюля целиком кликабельна,
          <code>target="_blank"</code> + <code>rel="noopener noreferrer"</code>
          ставятся ВСЕГДА безусловно.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Ссылки на СВОИ страницы: пилюля по определению ведёт к
          третьей стороне и всегда открывается в новой вкладке; внутренние
          переходы — <code>tk-link</code>/<code>tk-button</code>.
        </li>
        <li>
          Список магазинов с ценами/рейтингами — это бейдж-ряд, не карточки
          магазинов.
        </li>
      </ul>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <tk-store-badges .badges=${STORES}></tk-store-badges>
      </div>
      ${codeBlock(`<tk-store-badges></tk-store-badges>

<script type="module">
  import 'pillkit-components';
  document.querySelector('tk-store-badges').badges = [
    // знак — ВАШ лицензированный ассет; без iconSrc пилюля станет чисто текстовой
    { href: 'https://apps.rustore.ru/app/…', label: 'RuStore', iconSrc: '/assets/rustore.svg' },
    { href: 'https://appgallery.huawei.com/app/…', label: 'AppGallery', iconSrc: '/assets/appgallery.svg' },
    { href: 'https://samsung.com/…', label: 'Samsung Store' },
  ];
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Арт — потребителя.</strong> Репозиторий кита не содержит НИ
        ОДНОГО стороннего бренд-знака (железное правило спеки): RuStore /
        AppGallery / App Store — торговые марки их владельцев.
        <code>iconSrc</code> — ваш собственный лицензированный ассет
        (иконки сторов распространяются по бренд-гайдам владельцев); unset —
        честная деградация в текстовую пилюлю того же размера. Здесь и в
        историях кита — нейтральные заглушки, никак не настоящие логотипы.
      </div>
      <p class="tkv2-note">
        Дисплейный компонент: ни канала §4, ни событий (event-map пуст,
        закреплено юнит-тестом). Пустые <code>badges</code> рендерят копию
        «Нет доступных магазинов» (слот <code>empty</code>),
        null/undefined клампятся (§2). Моушена нет: ховер-шаг заливки
        мгновенный.
      </p>

      <h2>Темизация</h2>
      <p>
        Пилюли — светлый шаг поверхностей: заливка
        <code>surface-muted</code> (честно-нейтральное отображение
        пробированной светло-серой заливки эталона), ховер — шаг к
        <code>surface-field</code>, оба переотображаются в тёмной теме.
        Текст —
        <code>text-primary</code>. Слоты §6:
        <code>--tk-store-badges-fill</code>,
        <code>--tk-store-badges-fill-hover</code>,
        <code>--tk-store-badges-label</code>,
        <code>--tk-store-badges-radius</code>,
        <code>--tk-store-badges-icon-radius</code>. Кольцо фокуса — единый
        токен вокруг ВСЕЙ пилюли.
      </p>

      <h2>Доступность</h2>
      <p>
        Пилюля — нативный якорь: роль, имя (label) и активация достаются
        конструкцией. Открытие в новой вкладке объявляется скринридерами
        по target=_blank самому. Знак — декоративное изображение: alt по
        умолчанию равен названию магазина, дублирование имени не ломает.
        Полный чек-лист — история
        <a
          href="?path=/story/components-storebadges--accessibility"
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
            <td>Tab по ряду</td>
            <td>«RuStore, ссылка, 1 из 3» / «AppGallery, ссылка» / «Samsung Store, ссылка» — плоский порядок</td>
          </tr>
          <tr>
            <td>Активация</td>
            <td>новая вкладка (target=_blank); некоторые скринридеры добавляют «новая вкладка» к объявлению</td>
          </tr>
          <tr>
            <td>Нулевое состояние</td>
            <td>«Нет доступных магазинов» — копия не пустует никогда</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Кластер загрузок мобильного приложения — сценарий
        <a
          href="?path=/story/showcase-invest-landing--invest-landing"
          target="_top"
          >Showcase/Invest landing</a
        >
        (бейджи под QR-блоком и шагами установки).
      </p>
    </div>
    ${apiReferenceDoc('tk-store-badges')}
  `,
};
