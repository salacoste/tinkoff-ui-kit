import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './segmented-radio.js';
import type { TkSegmentedRadioOption } from './segmented-radio.js';

/**
 * tk-segmented-radio stories (spec 2.5): playground (the reference Да/Нет
 * citizenship composition), every state (nothing selected / Да selected /
 * disabled group / disabled option / three segments), the frozen
 * controlled/uncontrolled contract live, theming demo, and the a11y notes
 * with the keyboard-only checklist.
 *
 * Motion: the segment surface fill and the dot run on
 * `--tk-motion-duration-fast` (150ms) productive-standard and collapse to
 * 0ms under prefers-reduced-motion via the token layer — no separate media
 * query exists to forget.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

/** The reference «Гражданство РФ?» gate (tbank.ru debit form, 2.0 capture). */
const CITIZENSHIP: TkSegmentedRadioOption[] = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

type SegmentedRadioArgs = {
  label: string;
  value?: string;
  defaultValue: string;
  disabled: boolean;
};

const segmentedRadio = (
  args: Partial<SegmentedRadioArgs> = {},
  options: TkSegmentedRadioOption[] = CITIZENSHIP,
) => {
  const { label, value, defaultValue, disabled } = args;
  // `value === undefined ? undefined : value` keeps the demo UNCONTROLLED by
  // default: a bound value would strict-control the element and leave demo
  // arrows visually stuck until a re-render (the frozen §4 contract).
  return html`
    <tk-segmented-radio
      class="tkr-field"
      .options=${options}
      .label=${label ?? 'Гражданство РФ?'}
      .value=${value}
      .defaultValue=${defaultValue ?? ''}
      ?disabled=${disabled ?? false}
    ></tk-segmented-radio>
  `;
};

const canvasStyles = html`
  <style>
    .tkr-canvas {
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
    .tkr-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkr-canvas .tkr-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkr-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkr-canvas .tkr-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkr-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkr-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkr-canvas td,
    .tkr-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkr-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkr-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkr-canvas .tkr-field {
      max-width: 536px;
    }
    .tkr-canvas .tkr-log {
      box-sizing: border-box;
      margin: 0;
      min-height: 3em;
      max-width: var(--tk-space-container);
      padding: var(--tk-space-8) var(--tk-space-12);
      overflow: auto;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-sm);
      white-space: pre-wrap;
    }
    .tkr-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkr-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkr-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkr-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<SegmentedRadioArgs> = {
  title: 'Components/SegmentedRadio',
  component: 'tk-segmented-radio',
  args: {
    label: 'Гражданство РФ?',
    defaultValue: 'yes',
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Видимая подпись группы над дорожкой — доступное имя radiogroup.',
    },
    value: {
      control: 'text',
      description:
        'Контролируемое значение (строгий режим §4): рендерится ровно оно; выбор только эмитит value-change.',
    },
    defaultValue: {
      control: 'text',
      description: 'Начальное значение неконтролируемого режима; после подключения игнорируется.',
    },
    disabled: {
      control: 'boolean',
      description: 'Вся группа: прозрачность 40%, без pointer-событий, aria-disabled (остаётся в фокусе).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SegmentedRadioArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>SegmentedRadio</h1>
      <p class="tkr-note">
        Да/Нет-переключатель из формы-эталона («Гражданство РФ?»): дорожка-пилюля
        radius-full на заливке surface-field, выбранный сегмент — сплошная
        белая заливка с волосяной линией и жёлтый индикатор yellow-100 Ø24 с
        чернильной сердцевиной Ø12 (пиксель-проба захвата эталона). Стрелки
        двигают выделение внутри группы с переходом по циклу, выбор следует за
        фокусом (семантика радио), Пробел/Enter выбирают. Контракт
        value/defaultValue унаследован дословно из замороженного §4 (строчный
        канал).
      </p>
      ${segmentedRadio(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>Состояния</h1>
      <p class="tkr-note">
        Невыбранное состояние — ноль выбрано (валидное «до первого касания»,
        Tab входит на первый доступный сегмент). Выбранное — сплошная белая
        заливка + жёлтая точка; у невыбранных сегментов фон прозрачный, точка —
        «пустой колодец» surface-base. Отдельный отключённый сегмент
        пропускается стрелками и не выбирается. Тёмная тема — контрол Theme в
        тулбаре.
      </p>
      <div class="tkr-row">
        <figure>
          ${segmentedRadio({ defaultValue: '' })}
          <figcaption>ничего не выбрано (Tab входит на первый сегмент)</figcaption>
        </figure>
        <figure>
          ${segmentedRadio({ defaultValue: 'yes' })}
          <figcaption>выбрано «Да»: белая заливка + жёлтая точка с сердцевиной</figcaption>
        </figure>
        <figure>
          ${segmentedRadio({}, [
            { value: 'all', label: 'Все' },
            { value: 'yes', label: 'Да', disabled: true },
            { value: 'no', label: 'Нет' },
          ])}
          <figcaption>средний сегмент disabled: стрелки пропускают, клик инертен</figcaption>
        </figure>
        <figure>
          ${segmentedRadio({ disabled: true, defaultValue: 'yes' })}
          <figcaption>disabled группа: 40% прозрачности, aria-disabled</figcaption>
        </figure>
        <figure>
          ${segmentedRadio(
            { defaultValue: 'card' },
            [
              { value: 'card', label: 'Карта' },
              { value: 'account', label: 'Счёт' },
              { value: 'credit', label: 'Кредит' },
            ],
          )}
          <figcaption>три сегмента (равные доли дорожки)</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** Live demo of the frozen §4 semantics on the string channel (mirrors the Input/Select/Checkbox stories). */
export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };

    return html`
      ${canvasStyles}
      <main class="tkr-canvas">
        <h1>Режимы value</h1>
        <p class="tkr-note">
          Строчное зеркало контракта §4: (1) начальное значение
          неконтролируемого режима — <code>defaultValue</code>, изменения после
          подключения игнорируются; (2) контролируемый режим строгий — элемент
          рендерит ровно <code>value</code>, выбор только эмитит
          <code>value-change</code>; (3) снятие <code>value</code>
          переключает в неконтролируемый режим, сея состояние последним
          контролируемым значением. Ноль выбрано — валидное состояние до
          первого выбора.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-segmented-radio
            class="tkr-field"
            default-value="yes"
            .options=${CITIZENSHIP}
            label="Гражданство РФ?"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkr-log-uncontrolled', `value-change → ${value}`);
            }}
          ></tk-segmented-radio>
          <pre class="tkr-log" id="tkr-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Без выбора: пустая дорожка до первого касания</h2>
          <tk-segmented-radio
            class="tkr-field"
            .options=${CITIZENSHIP}
            label="Гражданство РФ?"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkr-log-empty', `value-change → ${value}`);
            }}
          ></tk-segmented-radio>
          <pre class="tkr-log" id="tkr-log-empty">—</pre>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>Темизация</h1>
      <p class="tkr-note">
        Группа темизуется только наследованием — переключите контрол Theme в
        тулбаре: дорожка становится тёмной через
        <code>--tk-color-surface-field</code>, выбранный сегмент — через
        <code>--tk-color-surface-base</code>, волосяная линия — через
        <code>--tk-color-border-default</code>, кольцо фокуса — через
        <code>--tk-color-focus-ring</code>. Пара «жёлтая точка + чернильная
        сердцевина» инвариантна теме (жёлтый всегда держит чернильный).
        Ни одной ветки темы в коде. Слоты перекрываются по грамматике
        <code>--tk-&lt;component&gt;-&lt;slot&gt;</code>:
        <code>--tk-segmented-radio-fill</code>,
        <code>--tk-segmented-radio-segment-fill</code>,
        <code>--tk-segmented-radio-dot-fill</code>,
        <code>--tk-segmented-radio-dot-center</code>,
        <code>--tk-segmented-radio-radius</code>.
      </p>
      <section class="tkr-panel">
        ${segmentedRadio({ defaultValue: 'yes' })}
        ${segmentedRadio({ defaultValue: '' })}
      </section>
      <section class="tkr-panel tkr-panel--muted">
        ${segmentedRadio({ defaultValue: 'no', label: 'Уведомления об операциях' })}
      </section>
      <section class="tkr-panel tkr-panel--bluegray">
        ${segmentedRadio({ defaultValue: 'yes', label: 'Бумажные выписки' })}
      </section>
      <section class="tkr-panel tkr-panel--charcoal">
        ${segmentedRadio({ defaultValue: 'yes', label: 'Все категории подписки' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>Доступность</h1>
      <p class="tkr-note">
        Техника доступности (паттерн 2.4): нативные
        <code>&lt;input type="radio"&gt;</code> в теневом корне ОСТАЮТСЯ
        поверхностью взаимодействия и объявления — Пробел, клик по сегменту,
        участие в форме и объявление checked/unchecked даёт платформа. Дорожка
        несёт <code>role="radiogroup"</code>, её доступное имя — видимая
        подпись через aria-labelledby (или aria-label, если подписи нет).
        Стрелки проводятся явно (preventDefault + собственный переход): влево/вверх —
        предыдущий, вправо/вниз — следующий, с переходом по циклу, disabled-сегменты
        пропускаются, выбор следует за фокусом. Roving tabindex: выбранный
        сегмент tabindex=0, остальные −1; без выбора — первый доступный.
        Home/End сознательно отсутствуют (буква EXPERIENCE: только стрелки).
        Форма: участие через <code>formAssociated</code> + ElementInternals —
        нативные радио в shadow root НЕ сабмитятся браузером, поэтому хост
        зеркалирует запись через <code>setFormValue</code>: FormData получает
        name=value выбранного сегмента, ничего — без выбора; form.reset()
        восстанавливает defaultValue. Disabled: aria-disabled с сохранением
        фокуса (паттерн кнопочного пилота), выбор заблокирован любым способом.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Фокус входит на ВЫБРАННЫЙ сегмент (без выбора — на первый
              доступный) и покидает группу естественно; кольцо фокуса 2px
              (<code>--tk-color-focus-ring</code>, сдвиг 2px) обводит сегмент
              и не убирается.
            </td>
          </tr>
          <tr>
            <td><code>→</code> / <code>↓</code></td>
            <td>
              Следующий доступный сегмент (с переходом по циклу): фокус и
              выбор двигаются вместе; эмитится
              <code>value-change</code> (composed, bubbles,
              <code>detail: { value: string }</code>).
            </td>
          </tr>
          <tr>
            <td><code>←</code> / <code>↑</code></td>
            <td>Предыдущий доступный сегмент (с переходом по циклу) — то же самое.</td>
          </tr>
          <tr>
            <td><code>Пробел</code> / <code>Enter</code></td>
            <td>
              Выбирает сегмент под фокусом; уже выбранный — no-op (нативная
              семантика радио). Enter не отправляет форму.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «Гражданство РФ?, группа радио»: имя сегмента и
              состояние «выбран/не выбран»; disabled-сегмент объявляется
              недоступным.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkr-row">
        ${segmentedRadio({ defaultValue: 'yes' })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tksr-note">
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
            <td>Tab на группу</td>
            <td>«Гражданство РФ?, группа радио, Да, радио-кнопка, выбрана 1 из 2» — одна остановка на группу</td>
          </tr>
          <tr>
            <td>ArrowRight / ArrowLeft</td>
            <td>объявляется новая опция: «Нет, радио-кнопка, выбрана» — выбор следует за фокусом</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-segmented-radio'),
};
