import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../link/link.js';
import './footer.js';
import type { TkFooterColumn, TkFooterLink } from './footer.js';

/**
 * tk-footer stories (spec 3.5): playground (the reference directory
 * composition — 6 columns, pills, phone, legal), variant states
 * (columns-only / pills-only / empty), theming demo, and the a11y notes
 * with the keyboard-only checklist.
 *
 * The legal fine-print composes tk-link `legal` instances INSIDE the slot
 * (composed, not reimplemented — the kit's own link carries the inline
 * link affordance).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

/** The reference directory (tbank.ru capture footer.png): 6 columns. */
const COLUMNS: TkFooterColumn[] = [
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

const QUICK: TkFooterLink[] = [
  { label: 'О банке', href: '#about' },
  { label: 'Новости', href: '#news' },
  { label: 'Блог', href: '#blog' },
  { label: 'Работа', href: '#careers' },
  { label: 'Банкоматы', href: '#atm' },
  { label: 'Курсы валют', href: '#rates' },
  { label: 'Контакты', href: '#contacts' },
];

/** The legal fine-print — tk-link legal instances composed in the slot. */
const legalSlot = html`
  <p class="tkf-legal__line">
    © 2006—2026, АО «Банк». Информация не является публичной офертой. Услуги
    оказывают <tk-link variant="legal" href="#brokera">ООО «Брокер»</tk-link>
    и <tk-link variant="legal" href="#leasing">ООО «Лизинг»</tk-link> —
    подробности в
    <tk-link variant="legal" href="#docs">документах</tk-link>.
  </p>
`;

type FooterArgs = {
  phone: string;
};

const footerCanvas = (args: Partial<FooterArgs> = {}) => html`
  <tk-footer .columns=${COLUMNS} .quickLinks=${QUICK} .phone=${args.phone ?? '8 800 333-33-33'}>
    ${legalSlot}
  </tk-footer>
`;

const canvasStyles = html`
  <style>
    .tkf-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkf-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkf-canvas .tkf-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkf-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkf-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkf-canvas figure {
      margin: 0;
    }
    .tkf-canvas figcaption {
      margin-top: var(--tk-space-8);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkf-canvas td,
    .tkf-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkf-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkf-legal__line {
      margin: 0;
    }
  </style>
`;

const meta: Meta<FooterArgs> = {
  title: 'Components/Footer',
  component: 'tk-footer',
  args: {
    phone: '8 800 333-33-33',
  },
  argTypes: {
    phone: { control: 'text', description: 'Контактный блок (жирный). Ссылку tel: добавляет потребитель.' },
  },
};

export default meta;

type Story = StoryObj<FooterArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Footer</h1>
      <p class="tkf-note">
        Директория ссылок эталона: 6 колонок-списков с caps-s заголовками
        (трансформация в рендере), чернильные пилюли быстрых ссылок, жирный
        телефон и юридический мелкий шрифт body-xs со встроенными tk-link
        legal. Лендмарк contentinfo — нативный shadow-элемент footer.
      </p>
      ${footerCanvas(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Состояния</h1>
      <p class="tkf-note">
        Пустая колонка опускается; null-пропы клампятся; телефон и пилюли
        необязательны. Заголовки caps-s — text-secondary (AA-оверрайд пробы),
        ссылки — text-secondary с шагом ховера в text-primary за 150мс.
      </p>
      <section>
        <h2>Полный</h2>
        <figure>${footerCanvas({})}</figure>
      </section>
      <section>
        <h2>Только колонки</h2>
        <figure>
          <tk-footer .columns=${COLUMNS}>
            <p class="tkf-legal__line">© 2006—2026, АО «Банк».</p>
          </tk-footer>
        </figure>
      </section>
      <section>
        <h2>Пилюли + телефон без директории</h2>
        <figure>
          <tk-footer .quickLinks=${QUICK} .phone=${'8 800 333-33-33'}>
            <p class="tkf-legal__line">Минимальный футер: быстрые ссылки и контакт.</p>
          </tk-footer>
        </figure>
      </section>
      <section>
        <h2>С пустыми колонками (опускаются)</h2>
        <figure>
          <tk-footer
            .columns=${[
              COLUMNS[0]!,
              { title: 'Пусто', links: [] },
              COLUMNS[1]!,
            ]}
            .quickLinks=${QUICK.slice(0, 3)}
          >
            <p class="tkf-legal__line">Колонка «Пусто» не рендерится вовсе.</p>
          </tk-footer>
        </figure>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Темизация</h1>
      <p class="tkf-note">
        Тёмная тема — контрол Theme в тулбаре: ни одной ветки темы в коде.
        Пилюли несут собственную чернильную заливку (ink-300 без темной
        перекраски — тон-инвариантный элемент, как charcoal), белый текст
        проходит AA в обеих темах. Слоты перекрываются по грамматике
        <code>--tk-footer-*</code>:
        <code>--tk-footer-header</code>,
        <code>--tk-footer-link</code>,
        <code>--tk-footer-link-hover</code>,
        <code>--tk-footer-pill-fill</code>,
        <code>--tk-footer-pill-fill-hover</code>,
        <code>--tk-footer-pill-text</code>,
        <code>--tk-footer-column-gap</code>.
        На чернильных поверхностях перекрывайте ОБА ссылочных хука вместе
        (прецедент tk-tabs — иначе ховер упадёт в text-primary и исчезнет);
        заливки пилюль тоже ходят парой —
        <code>--tk-footer-pill-fill-hover</code> (шаг в ink-400) перекрывайте
        вместе с <code>--tk-footer-pill-fill</code>.
      </p>
      ${footerCanvas({})}
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Доступность</h1>
      <p class="tkf-note">
        Лендмарк contentinfo — нативный shadow-элемент
        <code>&lt;footer&gt;</code> (роль не навешивается). Колонки —
        настоящие списки ul/li; заголовки секций — h3. Все ссылки — нативные
        якоря с именами по тексту; кольцо фокуса единое (2px, сдвиг 2px).
        Пилюли — цели ≥44px. Цвет заголовков caps-s — text-secondary:
        серый пробы эталона не проходит AA (контраст ≈3.2:1), семантический
        оверрайд зафиксирован в NOTES.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code></td>
            <td>
              Фокус идёт по ссылкам в порядке чтения: колонки слева направо,
              затем пилюли, затем inline-ссылки юридического блока; кольцо
              2px на каждом шаге.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Нативная навигация якоря; компонент ничего не перехватывает.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «содержимое информации» (contentinfo), списки с
              числом элементов, заголовки секций; активных состояний нет —
              футер не переключатель.
            </td>
          </tr>
        </tbody>
      </table>
      ${footerCanvas({})}
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkf-note">
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
            <td>Переход к подвалу (VO: D-жест / rotor)</td>
            <td>«дополнительная информация» (contentinfo landmark)</td>
          </tr>
          <tr>
            <td>Колонки</td>
            <td>«список, N элементов», затем ссылки по имени — «О картах, ссылка»</td>
          </tr>
          <tr>
            <td>Быстрые ссылки-пилюли</td>
            <td>«Реквизиты, ссылка» — те же объявления, что у текстовых</td>
          </tr>
          <tr>
            <td>Юридический мелкий текст</td>
            <td>читается строкой со встроенными ссылками: «ООО „Брокер“, ссылка»</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-footer'),
};
