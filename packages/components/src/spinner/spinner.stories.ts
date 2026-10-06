import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './spinner.js';

/**
 * tk-spinner stories (spec 27.1, quality window): the data-loading
 * default, the 16/20/24/32 size row, the in-button waiting pattern (the
 * atom inline next to visible text + the tk-button `loading` register that
 * ships it built-in) and the a11y notes for the two modes.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. The demo buttons are
 * STORY decorations (prose literals, tokens only) standing in for the
 * consumer's own button — the atom owns no button of itself. All copy is
 * fictional (the PD gate).
 */

type SpinnerArgs = {
  label: string;
  size: string;
};

const sp = (args: Partial<SpinnerArgs> = {}) => {
  const { label, size } = args;
  return html`
    <tk-spinner class="tksp-el" .label=${label ?? 'Обновляем курс'} .size=${size ?? '20'}></tk-spinner>
  `;
};

const canvasStyles = html`
  <style>
    .tksp-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-skeleton 21.2
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while the arc remaps — story chrome invisible. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tksp-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tksp-canvas .tksp-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tksp-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksp-canvas section {
      max-width: var(--tk-space-container);
    }
    .tksp-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The loading quote card of the default demo — a STORY decoration
       (tokens only): the consumer's card the spinner stands in. */
    .tksp-card {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .tksp-card .tksp-card-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--tk-space-4);
    }
    .tksp-card .tksp-card-body span {
      color: var(--tk-color-text-secondary);
    }
    .tksp-card .tksp-card-value {
      font-weight: var(--tk-text-body-m-bold-weight);
    }
    /* The size row: one figure per step, the caption under each. */
    .tksp-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-24) var(--tk-space-32);
    }
    .tksp-row figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tksp-row figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    /* The in-button pattern: consumer buttons (STORY decorations, tokens
       only) carrying the atom inline; the waiting one freezes its look —
       aria-busy is the consumer attribute, the spinner keeps its own name. */
    .tksp-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-16);
    }
    .tksp-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      padding: var(--tk-space-8) var(--tk-space-20);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-bold-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-full);
      cursor: pointer;
    }
    .tksp-btn[aria-busy='true'] {
      color: var(--tk-color-text-secondary);
      cursor: default;
    }
    .tksp-canvas td,
    .tksp-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    /* The colored-register demo: currentColor follows the context text —
       the atom adds no token of its own. */
    .tksp-canvas .tksp-accent {
      color: var(--tk-color-blue-100);
    }
  </style>
`;

const meta: Meta<SpinnerArgs> = {
  title: 'Components/Spinner',
  component: 'tk-spinner',
  args: {
    label: 'Обновляем курс',
    size: '20',
  },
  argTypes: {
    label: { control: 'text', description: 'Доступное имя состояния загрузки (дефолт «Загрузка»); пустая строка — декоративный режим.' },
    size: { control: 'select', options: ['16', '20', '24', '32'], description: 'Размер (16/20/24/32, дефолт 20) — хост-строка, канал один с --tk-spinner-size.' },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SpinnerArgs>;

export const Playground: Story = {
  name: 'Загрузка данных',
  render: (args) => html`
    ${canvasStyles}
    <main class="tksp-canvas">
      <h1>Spinner</h1>
      <p class="tksp-note">
        Круговой индикатор неопределённой загрузки (спека 27.1): дуга в три четверти
        окружности, штрих 2px со скруглёнными концами, ровный оборот за 0.9s. Цвет —
        <code>currentColor</code>: дуга наследует цвет текста вокруг, своего токена
        у атома нет. Определённая загрузка (проценты) — контракт
        <code>tk-progress-bar</code>, спиннер её не дублирует. Именованный инстанс
        ставит <code>role="status"</code> с доступным именем из <code>label</code>
        сам, при <code>label=''</code> — декоративный режим (<code>aria-hidden</code>).
      </p>
      <section>
        <h2>Обновление котировки</h2>
        <div class="tksp-card">
          ${sp(args)}
          <div class="tksp-card-body">
            <div class="tksp-card-value">SBER — 318,40 ₽</div>
            <span>Обновляем данные последней сделки…</span>
          </div>
        </div>
      </section>
    </main>
  `,
};

export const Sizes: Story = {
  name: 'Размерный ряд',
  render: () => html`
    ${canvasStyles}
    <main class="tksp-canvas">
      <h1>Размерный ряд</h1>
      <p class="tksp-note">
        Ряд 16/20/24/32 — типовые кегли текста кита: 16 и 20 садятся в строки
        метаданных и кнопки, 24 и 32 — в карточки и пустые состояния. Канал один:
        <code>size</code> пишет хостовую строку <code>--tk-spinner-size</code>,
        короб и геометрия дуги (r = (size − 4)/2) не разъезжаются. Ниже — цветовой
        регистр: дуга следует цвету текста контейнера.
      </p>
      <div class="tksp-row">
        <figure>
          <tk-spinner class="tksp-el" size="16" label="Загружаем список"></tk-spinner>
          <figcaption>16 — строка метаданных</figcaption>
        </figure>
        <figure>
          <tk-spinner class="tksp-el" size="20" label="Загружаем список"></tk-spinner>
          <figcaption>20 — дефолт, кнопки и строки</figcaption>
        </figure>
        <figure>
          <tk-spinner class="tksp-el" size="24" label="Загружаем список"></tk-spinner>
          <figcaption>24 — карточки</figcaption>
        </figure>
        <figure>
          <tk-spinner class="tksp-el" size="32" label="Загружаем список"></tk-spinner>
          <figcaption>32 — пустые состояния</figcaption>
        </figure>
        <figure class="tksp-accent">
          <tk-spinner class="tksp-el" size="24" label="Загружаем список"></tk-spinner>
          <figcaption>24 в цветном контексте — currentColor следует тексту</figcaption>
        </figure>
        <figure>
          <tk-spinner
            class="tksp-el"
            size="24"
            label="Загружаем список"
            style="--tk-spinner-duration: 1.8s; --tk-spinner-stroke: 3px"
          ></tk-spinner>
          <figcaption>инстанс замедляет оборот и утолщает штрих хуками</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The waiting-button pattern (AC5): the atom inline in the consumer's own
 * button (a STORY decoration — the waiting look and aria-busy are the
 * CONSUMER's, the spinner keeps its accessible name), next to the kit's
 * tk-button `loading` register that ships the same language built-in.
 * Copy is fictional (the PD gate).
 */
export const InButton: Story = {
  name: 'В кнопке при ожидании',
  render: () => html`
    ${canvasStyles}
    <main class="tksp-canvas">
      <h1>В кнопке при ожидании</h1>
      <p class="tksp-note">
        Паттерн ожидания: пока платёж проводится, кнопка показывает спиннер вместо
        текста — ширина не прыгает, повторные нажатия не проходят. Слева — кнопка
        потребителя со встроенным атомом (декоративный <code>label=''</code> рядом
        с видимым текстом «Проводим…», состояние держит сама кнопка:
        <code>aria-busy</code> + <code>aria-disabled</code>). Справа —
        <code>tk-button</code> со встроенным регистром <code>loading</code>:
        тот же язык загрузки из коробки, ширина заморожена.
      </p>
      <section>
        <h2>Перевод по реквизитам</h2>
        <div class="tksp-actions">
          <button class="tksp-btn" type="button" aria-busy="true" aria-disabled="true">
            <tk-spinner class="tksp-el" label="" size="16"></tk-spinner>
            <span>Проводим платёж…</span>
          </button>
          <button class="tksp-btn" type="button">
            <span>Отправить ещё раз</span>
          </button>
        </div>
        <h2>Регистр tk-button</h2>
        <div class="tksp-actions">
          <tk-button loading>Подписать платёж</tk-button>
          <tk-button variant="secondary">Отмена</tk-button>
        </div>
      </section>
      <p class="tksp-note">Суммы и названия — демо-контент, вымышленный.</p>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tksp-canvas">
      <h1>Доступность</h1>
      <p class="tksp-note">
        Именованный инстанс — <code>role="status"</code> с доступным именем из
        <code>label</code> (дефолт «Загрузка»): полиси aria-live берётся от роли,
        скринридер объявит появление спиннера один раз. Атрибуты ставятся в
        <code>connectedCallback</code> (закон React 19 — атрибуты конструктора не
        выживают апгрейд) и пересчитываются при смене label. Дуга — презентационная
        (<code>aria-hidden</code>) в обоих режимах. При
        <code>prefers-reduced-motion</code> вращение отключается: остаётся
        статичная дуга, смысл несёт label.
      </p>
      <h2>Чек-лист</h2>
      <table>
        <thead>
          <tr><th>Ситуация</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Именованный инстанс</td>
            <td>Скринридер: «Обновляем курс, статус» — role=status + aria-label=label, одно объявление на монтирование.</td>
          </tr>
          <tr>
            <td>Декоративный (label='')</td>
            <td>Хост скрыт aria-hidden — рядом есть видимый текст, дубликат не озвучивается.</td>
          </tr>
          <tr>
            <td>Уменьшенная анимация</td>
            <td>Оборот останавливается, дуга статична; смысл — в label, не в движении.</td>
          </tr>
          <tr>
            <td>Определённый прогресс</td>
            <td>Не здесь: проценты — tk-progress-bar (aria-valuenow, нулевое состояние); спиннер — только «ждём».</td>
          </tr>
          <tr>
            <td>Клавиатура</td>
            <td>Нет фокус-стопа: индикатор, интерактивность — на контейнере потребителя.</td>
          </tr>
        </tbody>
      </table>
      <div class="tksp-row">
        <figure>
          ${sp({ label: 'Обновляем курс', size: '24' })}
          <figcaption>именованный — попробуйте скринридер</figcaption>
        </figure>
        <figure>
          <tk-spinner class="tksp-el" label="" size="24"></tk-spinner>
          <figcaption>декоративный — скрыт, рядом видимый текст</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-spinner'),
};
