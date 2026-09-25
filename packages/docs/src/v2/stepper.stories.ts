import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/stepper/stepper.js';

/**
 * v2 docs page — tk-stepper (spec 8.3): what/when/not-for, live usage,
 * theming, a11y incl. the SR protocol, composition pointers. API table is
 * the generated CEM render; the interactive suite lives at
 * Components/Stepper. Content RU, meta EN.
 */

const STEPS = [
  {
    title: 'Заполните заявку онлайн',
    text: 'Вам не нужно посещать офис',
  },
  {
    title: 'Представитель банка бесплатно доставит вам документы',
    text: 'В удобное время и место',
  },
  {
    title: 'Начните пользоваться счетом',
    text: 'Реквизиты придут в СМС',
  },
];

const meta: Meta = {
  title: 'Components v2/Stepper',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Stepper — пронумерованные шаги</h1>
      <p class="tkv2-note">
        <code>tk-stepper</code> — маркетинговый блок шагов: белые
        скруглённые карточки на поверхности страницы, номер — квадратный
        бейдж, наполовину перекрывающий верхнюю кромку карточки по её
        осевой линии, заголовок и текст по центру. Нумерация автоматическая
        1..n; числа в данных нет и быть не может.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          «Как это работает» на лендингах: 3–4 шага от заявки до результата
          — подписи карточек дословно из эталона бизнес-домена.
        </li>
        <li>
          Регистр marketing: карточки на кремовой странице (тёплый cream —
          фишка бизнес-домена), заголовок блока — heading-2 по центру.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          ИНТЕРАКТИВНЫЕ мастера с переходами между шагами: компонент —
          дисплейный, состояний и событий не имеет вовсе; пошаговый
          интерфейс собирайте из <code>tk-tabs</code> или форм.
        </li>
        <li>
          Прогресс текущего процесса («шаг 2 из 3, текущий») — номер здесь
          декоративная нумерация списка, не индикатор состояния.
        </li>
        <li>
          Длинные пошаговые инструкции (7+) — сетка карточек рассчитана на
          один ряд; сверьтесь с композицией страницы.
        </li>
      </ul>

      <h2>Использование</h2>
      <p class="tkv2-note">
        Естественная среда — кремовая страница бизнес-домена; ниже блок на
        своём фоне.
      </p>
      <div class="tkv2-demo tkv2-panel tkv2-panel--cream">
        <tk-stepper
          heading="Откройте счет для бизнеса в Т-Банке"
          .steps=${STEPS}
        ></tk-stepper>
      </div>
      ${codeBlock(`<tk-stepper heading="Откройте счет для бизнеса в Т-Банке">
  <button slot="">Подать заявку</button><!-- необязательный CTA-ряд -->
</tk-stepper>

<script type="module">
  import 'pillkit-components';
  document.querySelector('tk-stepper').steps = [
    { title: 'Заполните заявку онлайн', text: 'Вам не нужно посещать офис' },
    { title: 'Представитель банка бесплатно доставит вам документы', text: '' },
    // номер НЕ задаётся: нумерация автоматическая 1..n
  ];
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Договорённости с потребителем.</strong>
        Дисплейный компонент (молд tk-promo-card): нет ни канала §4, ни
        событий — event-map пуст (закреплено юнит-тестом). Необязательный
        безымянный слот — CTA-ряд ПОД карточками: контейнер рендерится
        только когда слот непуст (эталон CTA не несёт). Пустые
        <code>steps</code> рендерят копию нулевого состояния «Нет доступных
        шагов» (переопределяется слотом <code>empty</code>); null/undefined
        клампятся (§2). Бейдж номера — декоративная краска поверх
        упорядоченного списка: painted numeral <code>aria-hidden</code>,
        «пункт N» даёт семантика списка.
      </div>

      <h2>Темизация</h2>
      <p>
        Карточки — <code>surface-base</code> на кремовой странице
        (<code>tint-cream</code>; в тёмной теме — собственный тёмный
        первый проход 6.1), бейдж — коричневый <code>tint-brown</code> с
        белой цифрой: измеренное значение эталона (зонд 2026-09-24),
        токен посадил стори 9.1; инвариант темы (модель charcoal), AA
        5,413:1. До 9.1 бейдж шёл на <code>tint-cream-raised</code> с
        чернильной цифрой (ближайшего коричневого токена в слое не было —
        запись 7.3 в verify/stepper/NOTES.md). Моушена нет совсем — ни
        переходов, ни ховер-подъёма карточек (never-list спеки). Слоты §6:
        <code>--tk-stepper-card-fill</code>,
        <code>--tk-stepper-card-radius</code>,
        <code>--tk-stepper-badge-fill</code>,
        <code>--tk-stepper-badge-number</code>,
        <code>--tk-stepper-badge-radius</code>,
        <code>--tk-stepper-heading</code>,
        <code>--tk-stepper-title</code>,
        <code>--tk-stepper-text</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Семантика — <code>&lt;ol&gt;</code>/<code>&lt;li&gt;</code>:
        «пункт 1 из 3» следует из списка, нарисованный номер —
        aria-hidden-декорация. Заголовок блока — настоящий h2 (иерархия
        страницы сохраняется). Интерактивности нет — клавиатурный чек-лист
        неприменим (дисплейный компонент; то же правило, что у
        progress-bar). Полные заметки — история
        <a href="?path=/story/components-stepper--accessibility" target="_top"
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
            <td>Чтение блока</td>
            <td>«Откройте счет для бизнеса в Т-Банке, заголовок 2 уровня», затем «список, 3 пункта»</td>
          </tr>
          <tr>
            <td>Чтение шага</td>
            <td>«1. Заполните заявку онлайн, Вам не нужно посещать офис» — номер из семантики списка; нарисованная цифра молчит (aria-hidden)</td>
          </tr>
          <tr>
            <td>Нулевое состояние</td>
            <td>«Нет доступных шагов» — копия не пустует никогда</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Шаги открытия счёта — на кремовой странице
        <a
          href="?path=/story/showcase-business-landing--business-landing"
          target="_top"
          >Showcase/Business landing</a
        >
        и как шаги установки приложения — в
        <a
          href="?path=/story/showcase-invest-landing--invest-landing"
          target="_top"
          >Showcase/Invest landing</a
        >.
      </p>
    </div>
    ${apiReferenceDoc('tk-stepper')}
  `,
};
