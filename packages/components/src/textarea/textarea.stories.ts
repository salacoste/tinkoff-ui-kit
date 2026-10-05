import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './textarea.js';

/**
 * tk-textarea stories (spec 24T.1, grounded in the 24T terminal notes
 * widget): the measured passport (empty / two lines / grown), the state
 * matrix (required+error, disabled, soft limit), and the a11y walkthrough.
 * Reduced motion: the atom has NO animation — growth is an instant inline
 * height re-measure (the focus ring toggles classes only).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

const canvasStyles = html`
  <style>
    .tkt-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface: the error text sits on the
         canvas, so the dark canvas must be dark for the dark error token. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkt-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkt-canvas .tkt-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkt-canvas .tkt-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkt-canvas .tkt-row > * {
      flex: 1 1 280px;
      max-width: 420px;
    }
    .tkt-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkt-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta = {
  title: 'Components/Textarea',
};

export default meta;

type Story = StoryObj;

/** The measured passport row: empty → two lines → grown (24T grounding). */
export const Notes: Story = {
  name: 'Заметка о инструменте',
  render: () => html`
    ${canvasStyles}
    <div class="tkt-canvas">
      <div>
        <h1>Заметка о инструменте</h1>
        <p class="tkt-note">
          Многострочное поле семейства tk-input, заземлено терминальными
          заметками (24T): базовая высота одной строки 32, рост по контенту
          шагом строки, автосайз инлайновой высотой, resize отключён.
          Значения — демо-текст.
        </p>
      </div>
      <div class="tkt-row">
        <figure>
          <tk-textarea
            label="Заметка"
            placeholder="Добавьте заметку"
          ></tk-textarea>
          <figcaption>Пустое поле — 32, одна строка</figcaption>
        </figure>
        <figure>
          <tk-textarea
            label="Заметка"
            .defaultValue=${'Дивиденды ожидаются в декабре\nпересмотреть таргет после отчёта'}
          ></tk-textarea>
          <figcaption>Две строки — рост до 48</figcaption>
        </figure>
        <figure>
          <tk-textarea
            label="Заметка"
            .defaultValue=${'Отчёт 25 числа.\nСлабый квартал у сектора.\nХеджировать позицию к отчёту.\nПересмотр таргета после конференции.'}
          ></tk-textarea>
          <figcaption>Рост продолжается строка за строкой</figcaption>
        </figure>
      </div>
    </div>
  `,
};

/** The state matrix: required+error, disabled, the grounded soft limit. */
export const States: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <div class="tkt-canvas">
      <div>
        <h2>Состояния</h2>
        <p class="tkt-note">
          Ошибка потребителя и обязательность (проверка по потере фокуса),
          инертное состояние и мягкий лимит длины — 1000 символов живого
          виджета заметок (замер 24T).
        </p>
      </div>
      <div class="tkt-row">
        <tk-textarea
          label="Заметка"
          required
          error="Обязательное поле"
        ></tk-textarea>
        <tk-textarea
          label="Заметка"
          maxlength="1000"
          .defaultValue=${'Мягкий лимит — 1000 символов: дальше ввод обрезается самим полем'}
        ></tk-textarea>
        <tk-textarea
          label="Заметка"
          disabled
          placeholder="Добавьте заметку"
        ></tk-textarea>
      </div>
    </div>
  `,
};

/** The a11y walkthrough: sr-only label + the visible keyboard checklist. */
export const AccessibilityNotes: Story = {
  name: 'Доступность: заметка',
  render: () => html`
    ${canvasStyles}
    <div class="tkt-canvas">
      <div>
        <h2>Доступность</h2>
        <p class="tkt-note">
          Имя поля — видимая подпись (нативная связка label/for; вариант
          sr-only прячет подпись с экрана, не из дерева доступности).
          Клавиатура: Tab — один стоп на поле; ввод печатает, Enter —
          перевод строки (нативное поведение многострочного поля);
          обязательность объявляется aria-required, сообщение ошибки
          связывается aria-describedby и никогда не крадёт фокус.
          Автосайз роста не меняет порядка фокуса.
        </p>
      </div>
      <div class="tkt-row">
        <tk-textarea
          sr-only
          label="Скрытая подпись заметки"
          placeholder="Подпись доступна скринридеру"
        ></tk-textarea>
      </div>
    </div>
  `,
};
