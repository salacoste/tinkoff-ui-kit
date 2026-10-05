import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './input.js';
import type { TkInput, TkInputType } from './input.js';

/**
 * tk-input stories (spec 2.1): playground, every variant (with/without label,
 * badge, required, error, disabled, filled), the frozen controlled/
 * uncontrolled contract live, theming demo, and the a11y notes with the
 * keyboard-only checklist. Reduced motion: Input has NO animation by default —
 * the focus ring is instant (state changes toggle classes/attributes only),
 * and the token layer collapses `--tk-motion-duration-*` to 0ms under
 * prefers-reduced-motion anyway.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type InputArgs = {
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  srOnly: boolean;
  error: string;
  badge: boolean;
  type: TkInputType;
  code: boolean;
  length: number;
};

const input = (args: Partial<InputArgs> = {}) => {
  const { label, placeholder, required, disabled, srOnly, error, badge, type, code, length } = args;
  return html`
    <tk-input
      class="tkin-field"
      .label=${label ?? 'Фамилия, имя и отчество'}
      .placeholder=${placeholder ?? 'Иван'}
      ?required=${required ?? false}
      ?disabled=${disabled ?? false}
      ?sr-only=${srOnly ?? false}
      ?code=${code ?? false}
      .length=${length ?? 4}
      .error=${error && error.length > 0 ? error : undefined}
      .type=${type ?? 'text'}
    >
      ${badge ? html`<span slot="badge">+30%</span>` : ''}
    </tk-input>
  `;
};

const canvasStyles = html`
  <style>
    .tkin-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface: the error/hint text sits on
         the canvas (not on a component fill), so the dark canvas must be dark
         for the dark error token to hold AA. Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkin-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkin-canvas .tkin-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkin-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkin-canvas .tkin-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkin-canvas .tkin-row > * {
      flex: 1 1 280px;
      max-width: 420px;
    }
    .tkin-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkin-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkin-canvas td,
    .tkin-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkin-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkin-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkin-canvas .tkin-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkin-canvas .tkin-log {
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
    .tkin-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkin-panel .tkin-field {
      max-width: 420px;
    }
    .tkin-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkin-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkin-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<InputArgs> = {
  title: 'Components/Input',
  component: 'tk-input',
  args: {
    label: 'Фамилия, имя и отчество',
    placeholder: 'Иван',
    required: false,
    disabled: false,
    srOnly: false,
    error: '',
    badge: false,
    type: 'text',
    code: false,
    length: 4,
  },
  argTypes: {
    label: { control: 'text', description: 'Видимая подпись над полем — видна всегда.' },
    placeholder: {
      control: 'text',
      description: 'Подсказка внутри поля; никогда не заменяет подпись.',
    },
    required: {
      control: 'boolean',
      description: 'Звёздочка + aria-required + внутренняя проверка при потере фокуса.',
    },
    disabled: {
      control: 'boolean',
      description: 'Прозрачность 40%, без pointer-событий, aria-disabled.',
    },
    srOnly: {
      control: 'boolean',
      description:
        'Скрыть подпись утилитой sr-only (10.1): имя поля остаётся за label; без подписи — no-op.',
    },
    error: {
      control: 'text',
      description: 'Ошибка потребителя: применяется немедленно, переопределяет внутреннюю.',
    },
    badge: {
      control: 'boolean',
      description: 'Слот badge — чип «+30%» справа внутри поля (для демо).',
    },
    type: {
      control: 'radio',
      options: ['text', 'email', 'tel', 'password', 'url', 'search'],
      description: 'Белый список нативных типов; неверное значение клампится в text.',
    },
    code: {
      control: 'boolean',
      description: 'Режим кода (26.4): ряд ячеек по одной цифре вместо одиночного поля.',
    },
    length: {
      control: { type: 'range', min: 4, max: 8, step: 1 },
      description: 'Режим кода: количество ячеек, кламп 4–8 (по умолчанию 4).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<InputArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Input</h1>
      <p class="tkin-note">
        Первый stateful-компонент кита. Контракт value/defaultValue заморожен в
        этом PR (CONVENTIONS §4/§9, «frozen at 2.1»). Переключите контрол Theme
        в тулбаре — поле перестраивается через унаследованные
        <code>var(--tk-*)</code> токены без единой ветки темы в коде.
      </p>
      ${input(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Варианты</h1>
      <p class="tkin-note">
        Поле: заливка surface-field, radius-md, высота 52px, плейсхолдер
        gray-500, волосяная линия border-default. Подпись видна всегда —
        плейсхолдер никогда её не заменяет. Чек-лист строк матрицы спецификации
        2.1: с подписью / без подписи, со значением, бейдж «+30%», required,
        ошибка, disabled. Тёмная тема — контрол Theme в тулбаре.
      </p>
      <div class="tkin-row">
        <figure>
          ${input({})}
          <figcaption>по умолчанию: подпись + плейсхолдер</figcaption>
        </figure>
        <figure>
          ${input({ label: '', placeholder: 'Электронная почта' })}
          <figcaption>без подписи — поле называет плейсхолдер</figcaption>
        </figure>
        <figure>
          ${input({ badge: true })}
          <figcaption>бейдж-слот справа внутри поля</figcaption>
        </figure>
        <figure>
          ${input({ required: true })}
          <figcaption>required: звёздочка + aria-required</figcaption>
        </figure>
        <figure>
          ${input({ error: 'Проверьте данные' })}
          <figcaption>ошибка потребителя (aria-invalid + described-by)</figcaption>
        </figure>
        <figure>
          ${input({ required: true, error: 'Обязательное поле' })}
          <figcaption>required + ошибка потребителя (prop error, тон образца)</figcaption>
        </figure>
        <figure>
          ${input({ disabled: true, placeholder: 'Иван' })}
          <figcaption>disabled: 40% прозрачности, aria-disabled</figcaption>
        </figure>
        <figure>
          ${input({ label: 'Телефон', placeholder: '+7 900 000-00-00', type: 'tel' })}
          <figcaption>type=tel — проходной белый список типов</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * Live demo of the three frozen semantics (CONVENTIONS §4, «frozen at 2.1 —
 * Input PR»). Handlers write straight into the log <pre> nodes — story args
 * stay untouched, so the whole demo runs inside the canvas.
 *
 * The delayed "consumer answers" apply is tracked PER FIELD (WeakMap keyed by
 * the element), so a timer armed for one field can never re-assert control
 * over another — and the reset/release buttons cancel the pending apply of
 * THEIR field before acting (an orphaned timer would otherwise flip a field
 * the user just released back to controlled).
 */
const pendingApply = new WeakMap<TkInput, number>();

export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    const cancelApply = (field: TkInput): void => {
      window.clearTimeout(pendingApply.get(field));
      pendingApply.delete(field);
    };

    return html`
      ${canvasStyles}
      <main class="tkin-canvas">
        <h1>Режимы value</h1>
        <p class="tkin-note">
          Контракт, замороженный в этом PR и обязательный для всех later-
          компонентов: (1) начальное значение неконтролируемого режима —
          <code>defaultValue</code>, изменения после подключения игнорируются;
          (2) контролируемый режим строгий — элемент рендерит ровно
          <code>value</code>, ввод только эмитит <code>value-change</code> и
          ничего не применяет локально; (3) снятие <code>value</code>
          переключает поле в неконтролируемый режим, сея внутреннее состояние
          последним контролируемым значением.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-input
            class="tkin-field"
            label="Фамилия, имя и отчество"
            placeholder="Иван"
            default-value="Ива"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkin-log-uncontrolled', `value-change → «${value}»`);
            }}
          ></tk-input>
          <pre class="tkin-log" id="tkin-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый: строгий (value применяется с задержкой 700ms)</h2>
          <tk-input
            class="tkin-field"
            label="Телефон"
            placeholder="+7 900 000-00-00"
            type="tel"
            @value-change=${(event: Event) => {
              const field = event.currentTarget as TkInput;
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkin-log-controlled', `value-change → «${value}»`);
              // Models setState: the consumer answers the event — until it
              // does, the element applies nothing locally (strict contract).
              // The delayed apply makes the hand-off visible.
              cancelApply(field);
              pendingApply.set(
                field,
                window.setTimeout(() => {
                  field.value = value;
                  log('tkin-log-controlled', `value применён → «${value}»`);
                }, 700),
              );
            }}
          ></tk-input>
          <pre class="tkin-log" id="tkin-log-controlled">—</pre>
          <div class="tkin-actions">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-input') as TkInput | null;
                if (!field) return;
                cancelApply(field);
                field.value = '+7 900';
                log('tkin-log-controlled', 'value сброшен потребителем → «+7 900»');
              }}
              >Установить value="+7 900"</tk-button
            >
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-input') as TkInput | null;
                if (!field) return;
                cancelApply(field);
                field.value = undefined;
                log(
                  'tkin-log-controlled',
                  'value снят → неконтролируемый режим, сеяние от последнего value',
                );
              }}
              >Снять value (отпустить контроль)</tk-button
            >
          </div>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Темизация</h1>
      <p class="tkin-note">
        Поле темизуется только наследованием — переключите контрол Theme в
        тулбаре (<code>data-theme="dark"</code> на корне превью): заливка поля
        становится тёмной через <code>--tk-color-surface-field</code>, ошибка —
        через <code>--tk-color-error-on-field</code>, фокус-кольцо — через
        <code>--tk-color-focus-ring</code>. Ни одной ветки темы в коде
        компонента. Дополнительно каждый слот поля перекрывается по грамматике
        <code>--tk-&lt;component&gt;-&lt;slot&gt;</code>:
        <code>--tk-input-fill</code>, <code>--tk-input-radius</code>,
        <code>--tk-input-text</code>, <code>--tk-input-placeholder</code>.
      </p>
      <section class="tkin-panel">
        ${input({ badge: true })}
        ${input({ error: 'Проверьте данные' })}
      </section>
      <section class="tkin-panel tkin-panel--muted">
        ${input({ label: 'Электронная почта', placeholder: 'ivan@domain.ru', type: 'email' })}
      </section>
      <section class="tkin-panel tkin-panel--bluegray">
        ${input({ required: true })}
      </section>
      <section class="tkin-panel tkin-panel--charcoal">
        ${input({ label: 'Промокод', placeholder: 'TINKOFF' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Доступность</h1>
      <p class="tkin-note">
        Техника доступного имени (выбрана реализатором, зафиксирована в
        спецификации): нативный <code>&lt;input&gt;</code> несёт
        <code>aria-labelledby="…-label …-badge"</code> — порядок id в цепочке
        задаёт порядок объявления «подпись → бейдж → поле». Видимый
        <code>&lt;label for&gt;</code> остаётся запасной ассоциацией и целью
        клика; без подписи поле называет плейсхолдер (нативный фолбэк).
        Сообщение ошибки связано через <code>aria-describedby</code>, состояние
        — через <code>aria-invalid</code>; звёздочка и иконка ошибки
        <code>aria-hidden</code> — семантику несут <code>aria-required</code> и
        текст сообщения. Ошибка никогда не крадёт фокус: она слышна при
        следующем визите к полю. Валидация — по blur; внутренняя проверка
        только required («Обязательное поле», спокойный тон), остальные ошибки
        приносит потребитель через <code>error</code>. Режим
        <code>sr-only</code> (10.1): видимая подпись скрывается утилитой
        1px-клипа, но <code>&lt;label for&gt;</code> остаётся — клик по
        текстовой метке невозможен (её нет), а имя поля читается из скрытой
        подписи той же цепочкой labelledby; без <code>label</code> режим —
        задокументированный no-op (поле называет плейсхолдер). Motion: у Input
        нет анимаций по умолчанию — фокус-кольцо появляется мгновенно, и слой
        токенов схлопывает длительности до 0ms при prefers-reduced-motion.
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
              Фокус входит в поле / покидает его; кольцо фокуса 2px
              (<code>--tk-color-focus-ring</code>, offset 2px) обводит всё
              поле целиком и не убирается.
            </td>
          </tr>
          <tr>
            <td>ввод текста</td>
            <td>
              Текст появляется; эмитится <code>value-change</code>
              (composed, bubbles, <code>detail: { value }</code>). В
              контролируемом режиме элемент ничего не применяет локально —
              текст рендерится ровно consumer-ский.
            </td>
          </tr>
          <tr>
            <td><code>Tab</code> из пустого required-поля</td>
            <td>
              По blur появляется спокойное сообщение «Обязательное поле»,
              <code>aria-invalid</code>, <code>aria-describedby</code>; фокус
              НЕ переходит — сообщение читается при следующем визите.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «подпись → бейдж → значение» (порядок цепочки
              labelledby), затем required/invalid по aria-состояниям.
            </td>
          </tr>
          <tr>
            <td>Скринридер на <code>sr-only</code>-поле</td>
            <td>
              AT читает имя скрытой метки: объявление то же, что у видимой
              подписи («Телефон, поле редактирования текста»); геометрия поля
              совпадает с безподписным вариантом, бейдж (независимый слот)
              остаётся видимым и вторым в цепочке имени.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkin-row">
        ${input({ required: true, badge: true })}
        ${input({ label: 'Телефон', placeholder: '+7 900 000-00-00', srOnly: true })}
        ${input({ label: 'Телефон', placeholder: '+7 900 000-00-00', srOnly: true, badge: true })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tki-note">
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
            <td>Tab на поле</td>
            <td>«Фамилия, имя и отчество, плюс 30 процентов, поле редактирования текста» — бейдж ПОСЛЕ подписи (aria-labelledby порядок; бейдж демо — «+30%»)</td>
          </tr>
          <tr>
            <td>Обязательное поле, blur пустым</td>
            <td>при возврате фокуса зачитывается сообщение: «Обязательное поле» (aria-describedby + aria-invalid)</td>
          </tr>
          <tr>
            <td>Ввод текста</td>
            <td>символы эхом; ошибки не перехватывают фокус</td>
          </tr>
          <tr>
            <td>Tab на sr-only-поле (второй ряд демо)</td>
            <td>
              «Телефон, поле редактирования текста» — объявление то же, что у
              видимой подписи: метка скрыта с экрана (1px-клип), но остаётся
              первой в цепочке aria-labelledby; вариант с бейджем — «Телефон,
              плюс 30 процентов, поле редактирования текста»
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

/**
 * Code mode (spec 26.4): the cell row on kit registers — the spec's capture
 * premise (create-account.png) did not survive the pixel probe (the frame is
 * the PHONE step), so the geometry is the input family's own: 52px squares,
 * radius-md, border-default → border-strong when filled, the family focus
 * ring on the active cell. Resend/counters stay OUT (consumer pattern).
 */
export const CodeMode: Story = {
  name: 'Код подтверждения',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Код подтверждения</h1>
      <p class="tkin-note">
        Режим <code>code</code> у tk-input (26.4): ряд ячеек по одной цифре,
        value — склеенная строка, <code>value-change</code> на каждом вводе,
        <code>complete</code> — когда заполнены все ячейки. Первая ячейка несёт
        <code>autocomplete="one-time-code"</code> — браузер предложит СМС сам.
        Не-цифровые символы не коммитятся (правило: только [0-9]); вставка с
        разделителями (пробел/дефис) разбивается по ячейкам. Геометрия —
        китовые регистры семейства: квадрат 52, radius-md, рамка темнее у
        заполненной, жёлтый focus-токен у активной. Хуки:
        <code>--tk-input-code-size</code>, <code>--tk-input-code-cell</code>,
        <code>--tk-input-code-gap</code>,
        <code>--tk-input-code-border-active</code>.
      </p>
      ${input({ ...args, code: true, label: 'Код подтверждения' })}
      <div class="tkin-row">
        <figure>
          <tk-input class="tkin-field" code label="Код подтверждения"></tk-input>
          <figcaption>по умолчанию: 4 пустые ячейки</figcaption>
        </figure>
        <figure>
          <tk-input
            class="tkin-field"
            code
            label="Код подтверждения"
            default-value="12"
          ></tk-input>
          <figcaption>prefill через defaultValue: «12»</figcaption>
        </figure>
        <figure>
          <tk-input class="tkin-field" code label="Код подтверждения" length="6"></tk-input>
          <figcaption>length=6 (кламп 4–8)</figcaption>
        </figure>
        <figure>
          <tk-input
            class="tkin-field"
            code
            label="Код подтверждения"
            default-value="12"
            error="Неверный код"
          ></tk-input>
          <figcaption>error: обводка всех ячеек + aria-invalid</figcaption>
        </figure>
        <figure>
          <tk-input class="tkin-field" code label="Код подтверждения" disabled></tk-input>
          <figcaption>disabled на всю группу</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The confirmation-flow composition (spec AC5): the consumer pattern around
 * the code cells — masked phone (FICTIONAL digits, ПД-гейт), a STATIC timer
 * line («00:58» — the countdown pattern is deliberately NOT taken) and the
 * complete hand-off. Story handlers write into the log pre; args stay
 * untouched.
 */
export const Confirmation: Story = {
  name: 'Подтверждение заявки',
  render: () => {
    const log = (line: string): void => {
      const pre = document.getElementById('tkin-log-code');
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 6).join('\n');
      }
    };
    return html`
      ${canvasStyles}
      <main class="tkin-canvas">
        <h1>Подтверждение заявки</h1>
        <p class="tkin-note">
          Паттерн потребителя вокруг ячеек: маскированный телефон, статичная
          строка таймера (значения вымышленные), нативная ссылка повторной
          отправки. Событие <code>complete</code> — точка передачи: потребитель
          сам решает, что делать с собранным кодом (серверная проверка — вне
          атома). Счётчик попыток и resend-countdown — вне скоупа кита.
        </p>
        <section class="tkin-panel tkin-panel--muted">
          <h2>Заявка № 8-4471</h2>
          <p class="tkin-note">
            Мы отправили код подтверждения на +7 9•• ••• •• 58. Код действует
            <strong>00:58</strong>.
          </p>
          <tk-input
            class="tkin-field"
            code
            label="Код подтверждения"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log(`value-change → «${value}»`);
            }}
            @complete=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log(`complete → «${value}» — передаём потребителю`);
            }}
          ></tk-input>
          <p class="tkin-note">
            Повторная отправка кода — паттерн потребителя; строка таймера
            статична («00:58»), countdown-механика в кит не входит.
          </p>
          <pre class="tkin-log" id="tkin-log-code">—</pre>
        </section>
      </main>
    `;
  },
};

export const CodeAccessibility: Story = {
  name: 'Доступность: код',
  render: () => html`
    ${canvasStyles}
    <main class="tkin-canvas">
      <h1>Доступность: код</h1>
      <p class="tkin-note">
        Группа ячеек — <code>role="group"</code> с именем из подписи (без
        подписи — фолбэк «Код подтверждения»: группа не бывает безымянной);
        каждая ячейка — фокусируемый нативный input с <code>aria-label</code>
        «Цифра N». Фокус РЕАЛЬНЫЙ, не roving-имитация: каждая ячейка —
        самостоятельный tab-stop (осознанный выбор спеки 26.4). Ошибка
        обводит все ячейки и ставит <code>aria-invalid</code> на каждую;
        сообщение связано через <code>aria-describedby</code>.
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
              Фокус входит в первую ячейку / покидает группу из последней;
              кольцо 2px жёлтого focus-токена на активной ячейке.
            </td>
          </tr>
          <tr>
            <td>цифра</td>
            <td>
              Коммит + авто-переход к следующей ячейке; эмит
              <code>value-change</code> со склеенной строкой; при заполнении
              всех ячеек — <code>complete</code>.
            </td>
          </tr>
          <tr>
            <td><code>Backspace</code> на пустой ячейке</td>
            <td>Фокус уходит на ячейку назад, её цифра очищается.</td>
          </tr>
          <tr>
            <td><code>←</code> / <code>→</code></td>
            <td>Ходьба по ячейкам без ввода.</td>
          </tr>
          <tr>
            <td>не-цифра</td>
            <td>Игнорируется: ячейка возвращает прежнюю цифру, событий нет.</td>
          </tr>
          <tr>
            <td>вставка «1 2-3 4»</td>
            <td>Разделители отбрасываются, ячейки заполняются с текущей.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkin-row">
        ${input({ code: true, label: 'Код подтверждения' })}
        ${input({ code: true, error: 'Неверный код' })}
        ${input({ code: true, label: 'Код подтверждения', srOnly: true })}
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-input'),
};
