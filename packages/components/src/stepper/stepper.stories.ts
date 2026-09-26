import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './stepper.js';

/**
 * tk-stepper stories (spec 7.3): playground from the reference copy,
 * variants (the reference block, 5-step auto-numbering, the CTA slot, the
 * zero state), theming, and the a11y notes with the keyboard checklist +
 * an SR-protocol section (maintainer-side execution).
 *
 * Motion: NONE anywhere in the component (the spec's never-list).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type StepperArgs = {
  heading: string;
  steps: Array<{ title: string; text: string }>;
};

/** The reference block's own copy (pattern-steps-open-account, 2026-09-24 probe). */
const REFERENCE_STEPS = [
  { title: 'Заполните заявку', text: 'Это займет не более 10 минут' },
  { title: 'Дождитесь решения', text: 'Мы рассмотрим заявку в течение 1 дня' },
  { title: 'Начните работать', text: 'Откройте счет и подключите инструменты' },
];

const stepper = (args: Partial<StepperArgs> = {}) => html`
  <tk-stepper .heading=${args.heading} .steps=${args.steps ?? REFERENCE_STEPS}></tk-stepper>
`;

const canvasStyles = html`
  <style>
    .tks-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-tint-cream);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tks-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tks-canvas .tks-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tks-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tks-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tks-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tks-canvas td,
    .tks-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tks-canvas code {
      font-family: var(--tk-font-body);
    }
    .tks-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tks-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tks-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tks-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tks-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
    }
    /* On-tint recipe (the tabs 3.3 precedent): the heading sits DIRECTLY on
       the panel surface — charcoal flips it to white. The cards are opaque
       surfaces (surface-base) and keep their own text-primary pairing on
       every panel; the brown badge is theme-invariant (tint-brown fill +
       white numeral in both themes — the charcoal mold, story 9.1). */
    .tks-panel--charcoal tk-stepper {
      --tk-stepper-heading: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<StepperArgs> = {
  title: 'Components/Stepper',
  component: 'tk-stepper',
  args: {
    heading: 'Откройте счет для бизнеса',
    steps: REFERENCE_STEPS,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<StepperArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Stepper</h1>
      <p class="tks-note">
        Нумерованные шаги маркетингового блока: белые карточки radius-xl на
        кремовой странице, числовые бейджи 56×56 вровень с верхним краем
        (половина бейджа над картой), центрированный заголовок и текст
        body-l. Нумерация автоматическая 1..n — в данных числа нет.
      </p>
      ${stepper(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Варианты</h1>
      <p class="tks-note">
        Ряд — auto-fit сетка с порогом 240px: при узком контейнере карточки
        складываются в один столбец, геометрия бейджа не меняется (позиция
        считается от карточки, не от вьюпорта). Слот subtitle (10.2) —
        необязательный подзаголовок между заголовком и карточками: обёртка
        рендерится ТОЛЬКО когда слот непуст (пустой слот не добавляет ритма,
        data-has-subtitle выключен).
      </p>
      <figure>
        ${stepper({ heading: 'Откройте счет для бизнеса' })}
        <figcaption>эталон: 3 шага, заголовок heading-2, без CTA — как в образце</figcaption>
      </figure>
      <figure>
        <tk-stepper heading="Откройте счет для бизнеса" .steps=${REFERENCE_STEPS}>
          <p slot="subtitle">
            Если у вас не зарегистрирован бизнес, сначала оставьте заявку на
            регистрацию — поможем бесплатно
          </p>
        </tk-stepper>
        <figcaption>
          слот subtitle (10.2): подзаголовок между заголовком и карточками —
          body-m/400/text-primary по центру; копия и метрики измерены с захвата
          бизнес-домена (verify/batch-10-1-10-2/NOTES.md)
        </figcaption>
      </figure>
      <figure>
        <tk-stepper .steps=${REFERENCE_STEPS}>
          <p slot="subtitle">Три шага — и счет готов к работе</p>
        </tk-stepper>
        <figcaption>subtitle без heading: рендерится без скрытой связи с заголовком</figcaption>
      </figure>
      <figure>
        <tk-stepper heading="Как открыть счет">
          <p slot="subtitle">Пока шагов нет — раздел готовится</p>
        </tk-stepper>
        <figcaption>
          subtitle + steps=[]: подзаголовок и копия нулевого состояния
          рендерятся вместе (слот — авторитет потребителя)
        </figcaption>
      </figure>
      <figure>
        <tk-stepper
          heading="Как это работает"
          .steps=${Array.from({ length: 5 }, (_, index) => ({
            title: `Шаг ${index + 1}`,
            text: 'Автоматическая нумерация 1..n — поле числа в данных не существует',
          }))}
        ></tk-stepper>
        <figcaption>5 шагов: числа проставлены блоком (1..5)</figcaption>
      </figure>
      <figure>
        <tk-stepper
          heading="Откройте счет для бизнеса"
          .steps=${REFERENCE_STEPS}
        >
          <tk-button>Перейти к заявке</tk-button>
        </tk-stepper>
        <figcaption>
          слот CTA (безымянный): ряд появляется под карточками, только когда
          слот непуст — пустой слот не добавляет ритма
        </figcaption>
      </figure>
      <figure>
        <tk-stepper heading="Откройте счет для бизнеса"></tk-stepper>
        <figcaption>
          steps=[]: слот нулевого состояния (текст по умолчанию — «Нет
          доступных шагов»; заменяется своим содержимым через slot="empty")
        </figcaption>
      </figure>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Темизация</h1>
      <p class="tks-note">
        Блок темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Слоты:
        <code>--tk-stepper-heading</code>,
        <code>--tk-stepper-card-fill</code>,
        <code>--tk-stepper-card-radius</code>,
        <code>--tk-stepper-badge-fill</code>,
        <code>--tk-stepper-badge-number</code>,
        <code>--tk-stepper-badge-radius</code>,
        <code>--tk-stepper-subtitle</code>,
        <code>--tk-stepper-title</code>,
        <code>--tk-stepper-text</code>.
        Бейдж — коричневый <code>tint-brown</code> с белой цифрой: измеренное
        значение эталона (зонд 2026-09-24), токен посадил стори 9.1;
        инвариант темы (модель charcoal), AA 5,413:1. До 9.1 бейдж шел на
        кремовом tint-cream-raised с чернильной цифрой — запись 7.3 в
        verify/stepper/NOTES.md.
      </p>
      <section class="tks-panel">
        ${stepper({})}
      </section>
      <section class="tks-panel tks-panel--muted">
        ${stepper({})}
      </section>
      <section class="tks-panel tks-panel--bluegray">
        ${stepper({})}
      </section>
      <section class="tks-panel tks-panel--charcoal">
        ${stepper({})}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Доступность</h1>
      <p class="tks-note">
        Обёртка — <code>&lt;ol&gt;</code>: порядок и «элемент N» объявляет
        семантика списка, нарисованная цифра — <code>aria-hidden</code>
        (дубликат для зрения). Заголовок шага — <code>&lt;h3&gt;</code>,
        заголовок блока — <code>&lt;h2&gt;</code>. Блок пассивен: не
        перехватывает клавиши, цели фокуса — только слоты (кнопка CTA),
        таб-порядок сквозной. Движение отсутствует полностью (never-list) —
        транзишнов и анимаций в таблице стилей нет.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус проходит НАСКВОЗЬ: блок не останавливает таб (внутри нет интерактивных элементов, кроме слота CTA).</td>
          </tr>
          <tr>
            <td>Нет интерактивных элементов</td>
            <td>Карточки и бейджи — текст: указателя нет, колец фокуса нет; при наличии CTA фокус — на кнопке слота.</td>
          </tr>
          <tr>
            <td>Уменьшение вьюпорта</td>
            <td>Карточки складываются в столбец; ничего не скроллится по клавишам блока (блок клавиш не владеет).</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Список, 3 элемента»; «1. Заполните заявку, заголовок 3-го уровня»; цифра-бейдж не объявляется (aria-hidden).</td>
          </tr>
        </tbody>
      </table>
      <div class="tks-panel">
        ${stepper({})}
      </div>
      <div class="tks-panel">
        <tk-stepper heading="Откройте счет для бизнеса" .steps=${REFERENCE_STEPS}>
          <p slot="subtitle">
            Если у вас не зарегистрирован бизнес, сначала оставьте заявку на
            регистрацию — поможем бесплатно
          </p>
        </tk-stepper>
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tks-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером. Каждое расхождение с ожидаемым
        объявлением — дефект, а не особенность.
      </p>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Чтение блока</td>
            <td>«Откройте счет для бизнеса, заголовок 2-го уровня»; затем «список, 3 элемента»</td>
          </tr>
          <tr>
            <td>Обход списка</td>
            <td>«1. Заполните заявку, заголовок 3-го уровня … Это займет не более 10 минут» — по элементу на шаг; порядковый номер от списка</td>
          </tr>
          <tr>
            <td>Цифровой бейдж</td>
            <td>НЕ объявляется: нарисованная цифра — aria-hidden, номер даёт семантика списка</td>
          </tr>
          <tr>
            <td>Блок с подзаголовком (вторая фигура демо)</td>
            <td>
              «Откройте счет для бизнеса, заголовок 2-го уровня»; затем абзац
              подзаголовка — обычный текст («Если у вас не зарегистрирован
              бизнес…»); затем «список, 3 элемента» — подзаголовок не меняет
              ни роль списка, ни порядок шагов
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-stepper'),
};
