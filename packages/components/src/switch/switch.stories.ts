import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './switch.js';

/**
 * tk-switch stories (spec 26.2, form-control wave): playground, the variant
 * matrix (bare/labelled/slotted/checked/disabled + hook-override geometry),
 * the admin-register settings block («настройки уведомлений» — the atom's
 * reason to exist), and the a11y checklist (APG switch: role=switch on the
 * native checkbox, Space native, Enter through the keydown guard).
 *
 * Geometry register note (AC2/AC4, maintainer ruling 2026-10-05): the admin
 * «Запомнить» pixel probe resolved to a chip-button, not a switch — the
 * capsule follows kit registers (track = the progress-bar/slider family,
 * ON yellow-100 / OFF border-default, surface-base knob); pixel grounding
 * is a HOLD → 24T.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. Story copy is fictional
 * (the PD gate).
 */

type SwitchArgs = {
  label: string;
  defaultChecked: boolean;
  disabled: boolean;
};

const sw = (args: Partial<SwitchArgs> = {}) => {
  const { label, defaultChecked, disabled } = args;
  return html`
    <tk-switch
      class="tksw-field"
      .label=${label ?? 'Уведомления об операциях'}
      ?default-checked=${defaultChecked ?? false}
      ?disabled=${disabled ?? false}
    ></tk-switch>
  `;
};

const canvasStyles = html`
  <style>
    .tksw-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tksw-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tksw-canvas .tksw-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tksw-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksw-canvas .tksw-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-24) var(--tk-space-32);
    }
    .tksw-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      flex: 1 1 280px;
      max-width: 420px;
    }
    .tksw-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tksw-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tksw-canvas td,
    .tksw-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    /* The admin-register settings block: white cards on the muted console
       page, one switch row per channel (console design language, kit
       tokens). */
    .tksw-canvas .tksw-settings {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      max-width: 560px;
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-lg);
    }
    .tksw-canvas .tksw-card {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      padding: var(--tk-space-16) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-lg);
    }
    .tksw-canvas .tksw-card h3 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksw-canvas .tksw-card p {
      margin: 0 0 var(--tk-space-4);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tksw-canvas .tksw-legend {
      margin: 0;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta<SwitchArgs> = {
  title: 'Components/Switch',
  component: 'tk-switch',
  args: {
    label: 'Уведомления об операциях',
    defaultChecked: true,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Видимая подпись справа от тумблера (слот перекрывает).' },
    defaultChecked: {
      control: 'boolean',
      description: 'Стартовое состояние неконтролируемого режима; после первого апдейта игнорируется.',
    },
    disabled: {
      control: 'boolean',
      description: 'Прозрачность 40%, без pointer-событий, aria-disabled (остаётся в фокусе).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SwitchArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tksw-canvas">
      <h1>Switch</h1>
      <p class="tksw-note">
        Boolean-тумблер с контрактом APG Switch (спека 26.2, form-control wave). Семантика —
        нативный <code>&lt;input type="checkbox" role="switch"&gt;</code> под невидимым слоем:
        Space, клик по подписи и form-ассоциация достаются бесплатно, Enter закрывает
        китовый кейдаун-гвард. Геометрия — китовые регистры (рулинг мейнтейнера 2026-10-05):
        капсула семейства треков progress-bar/slider, включённое — жёлтый токен, ручка —
        surface-круг с волосяной рамкой; пиксельное заземление — HOLD → 24T. Хуки
        <code>--tk-switch-*</code> перекрывают геометрию и цвета; тема перестраивается
        наследованием токенов, без единой ветки в коде.
      </p>
      ${sw(args)}
      ${sw({ ...args, label: 'Email-дайджест недели', defaultChecked: !args.defaultChecked })}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tksw-canvas">
      <h1>Варианты</h1>
      <p class="tksw-note">
        Матрица: голый тумблер (имя только через aria-label), подпись-проп, слот вместо
        пропа, выключено/включено, disabled и геометрия на хуках — крупная капсула через
        <code>--tk-switch-width/height/knob</code> (значения демо, инстанс-level).
      </p>
      <div class="tksw-row">
        <figure>
          <tk-switch class="tksw-field" aria-label="Тёмная тема панели"></tk-switch>
          <figcaption>голый тумблер — без подписи; имя через aria-label</figcaption>
        </figure>
        <figure>
          ${sw({ label: 'Push о платежах', defaultChecked: true })}
          <figcaption>label-проп, включённое состояние — жёлтый трек</figcaption>
        </figure>
        <figure>
          <tk-switch class="tksw-field" default-checked>
            <span>SMS о входах <b>с нового устройства</b></span>
          </tk-switch>
          <figcaption>слот перекрывает проп — разметка подписи на консьюмере</figcaption>
        </figure>
        <figure>
          ${sw({ label: 'Отчёты для бухгалтерии', disabled: true })}
          <figcaption>disabled: 40% прозрачности, aria-disabled, в фокусе</figcaption>
        </figure>
        <figure>
          <tk-switch
            class="tksw-field tksw-field--lg"
            label="Крупная капсула (демо хуков)"
            default-checked
            style="--tk-switch-width: 48px; --tk-switch-height: 28px; --tk-switch-knob: 24px"
          ></tk-switch>
          <figcaption>
            инстанс переопределяет геометрию — путь ручки пересчитывается сам (w − h)
          </figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The atom's reason to exist (AC5): the console settings block — switch rows
 * in the admin register (white cards on the muted console page). The admin
 * «Запомнить» probe resolved to a chip-button, so this register is the
 * PATTERN context, not a pixel copy; all channel names and copy are
 * fictional (the PD gate).
 */
export const Settings: Story = {
  name: 'Настройки уведомлений (паттерн)',
  render: () => html`
    ${canvasStyles}
    <main class="tksw-canvas">
      <h1>Настройки уведомлений</h1>
      <p class="tksw-note">
        Паттерн «строка настройки»: подпись-канал, пояснение и тумблер. Клики идут через
        нативный label; состояние живёт в <code>checked-change</code> (контролируемый
        режим применяет ответ консьюмера и только его). Названия каналов и лимиты —
        вымышленные.
      </p>
      <section class="tksw-settings">
        <div class="tksw-card">
          <h3>Push-уведомления о платежах</h3>
          <p>Присылать push о поступлениях и списаниях свыше 10&nbsp;000&nbsp;₽.</p>
          ${sw({ label: 'Push о платежах', defaultChecked: true })}
        </div>
        <div class="tksw-card">
          <h3>Email-отчёт недели</h3>
          <p>Сводка операций по всем счетам каждый понедельник в 9:00.</p>
          ${sw({ label: 'Email-отчёт недели', defaultChecked: false })}
        </div>
        <div class="tksw-card">
          <h3>SMS о входах</h3>
          <p>Сообщать о входах в консоль с новых устройств.</p>
          ${sw({ label: 'SMS о входах', defaultChecked: true })}
        </div>
        <div class="tksw-card">
          <h3>Интеграция с таблицей расходов</h3>
          <p>Доступна на тарифе «Про» — тумблер неактивен до повышения.</p>
          ${sw({ label: 'Интеграция с таблицей расходов', disabled: true })}
        </div>
      </section>
      <p class="tksw-legend">Подписи каналов, пороги и тариф — демо-контент, вымышленный.</p>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tksw-canvas">
      <h1>Доступность</h1>
      <p class="tksw-note">
        Семантика — APG Switch Pattern поверх нативного чекбокса:
        <code>role="switch"</code> меняет объявление на «переключатель,
        включено/выключено», состояние читается из нативного <code>checked</code> —
        атрибут aria-checked руками не выставляется и не может разойтись с реальностью.
        Раскрашенная капсула — aria-hidden-декорация над семантической поверхностью.
        Единственный нативный пробел закрыт вручную: Enter активирует тумблер
        (кейдаун-гвард, AC3). Кольцо фокуса — единые 2px
        (<code>--tk-color-focus-ring</code>, offset 2px) на видимой капсуле.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на капсулу / покидает её; видимое кольцо 2px на капсуле, без сдвигов макета.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Переключение — нативно, без JS; каждый шаг эмитит <code>checked-change</code> (composed, bubbles, <code>detail: { value }</code>).</td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Переключение — китовый гвард (нативный пробел чекбокса); тот же pipeline, что и Space.</td>
          </tr>
          <tr>
            <td>Клик по подписи</td>
            <td>Нативный label оборачивает тумблер и текст — подпись кликабельна и является доступным именем.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«подпись, переключатель, включено/выключено»; disabled объявляется через aria-disabled, капсула остаётся в таб-порядке.</td>
          </tr>
        </tbody>
      </table>
      <div class="tksw-row">
        <figure>
          <tk-switch class="tksw-field" label="Автопродление подписки" default-checked></tk-switch>
          <figcaption>попробуйте весь чек-лист на этом экземпляре</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-switch'),
};
