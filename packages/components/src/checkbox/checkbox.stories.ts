import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './checkbox.js';

/**
 * tk-checkbox stories (spec 2.4): playground, every state (unchecked /
 * checked / indeterminate / disabled / slotted label), the consent composed
 * example (checkbox + label text + inline link — a STORY composition, not a
 * component; TextLink ships at 3.1, so the link is a plain anchor styled via
 * tokens), the frozen controlled/uncontrolled contract live, theming demo,
 * and the a11y notes with the keyboard-only checklist.
 *
 * Motion: the box fill/border transition runs on `--tk-motion-duration-fast`
 * (150ms) and collapses to 0ms under prefers-reduced-motion via the token
 * layer — no separate media query exists to forget.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type CheckboxArgs = {
  label: string;
  checked: boolean;
  defaultChecked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  error: string;
  ariaLabel: string;
};

const checkbox = (args: Partial<CheckboxArgs> = {}, slot?: string) => {
  const { label, checked, defaultChecked, indeterminate, disabled, error, ariaLabel } = args;
  // `checked === true ? true : undefined` keeps the demo UNCONTROLLED by
  // default: a bound `false` would strict-control the element and leave demo
  // toggles visually stuck until a re-render (the frozen §4 contract).
  return html`
    <tk-checkbox
      .label=${label ?? 'Соглашаюсь получать рекламу про кешбэк, повышенный процент и выгодные предложения'}
      .checked=${checked === true ? true : undefined}
      .defaultChecked=${defaultChecked ?? false}
      .ariaLabel=${ariaLabel}
      .error=${error && error.length > 0 ? error : undefined}
      ?indeterminate=${indeterminate ?? false}
      ?disabled=${disabled ?? false}
    >
      ${slot ?? ''}
    </tk-checkbox>
  `;
};

const canvasStyles = html`
  <style>
    .tkc-canvas {
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
    .tkc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkc-canvas .tkc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkc-canvas .tkc-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkc-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkc-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkc-canvas td,
    .tkc-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkc-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkc-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkc-canvas .tkc-field {
      max-width: 536px;
    }
    .tkc-canvas .tkc-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkc-canvas .tkc-log {
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
    .tkc-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkc-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkc-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkc-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    /* The consent example's inline link — the reference's «same ink +
       continuous underline» reading; TextLink (3.1) will formalize it. */
    .tkc-consent-link {
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 0.125em;
    }
    .tkc-consent-link:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
  </style>
`;

const meta: Meta<CheckboxArgs> = {
  title: 'Components/Checkbox',
  component: 'tk-checkbox',
  args: {
    label: 'Соглашаюсь получать рекламу про кешбэк, повышенный процент и выгодные предложения',
    checked: false,
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    error: '',
    ariaLabel: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст подписи; используется, только если слот по умолчанию пуст.',
    },
    checked: {
      control: 'boolean',
      description:
        'Контролируемое состояние (строгий режим §4): рендерится ровно оно; переключение только эмитит checked-change.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Начальное состояние неконтролируемого режима; после подключения игнорируется.',
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Только визуальное смешанное состояние (жёлтая заливка + чернирный минус + aria-checked="mixed"); в канал значения не входит.',
    },
    disabled: {
      control: 'boolean',
      description: 'Прозрачность 40%, без pointer-событий, aria-disabled (остаётся в фокусе).',
    },
    error: {
      control: 'text',
      description:
        'Ошибка потребителя (10.2, молд input): строка под подписью, aria-invalid + aria-describedby; пустая строка/null — нет ошибки.',
    },
    ariaLabel: {
      control: 'text',
      description:
        'Имя для «голой» коробки без подписи — переносится на нативный input (паттерн wrapper-компонента).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<CheckboxArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkc-canvas">
      <h1>Checkbox</h1>
      <p class="tkc-note">
        Чекбокс согласия из формы-эталона: коробка 20px, radius-xs, чернирная
        галочка ink-300 на жёлтой заливке yellow-100. Пробел переключает,
        подпись кликабельна (нативный label), indeterminate — только
        визуальное состояние родителя. Контракт checked/defaultChecked
        унаследован дословно из замороженного §4 (булев канал).
      </p>
      ${checkbox(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkc-canvas">
      <h1>Состояния</h1>
      <p class="tkc-note">
        Непроверенная коробка — белая заливка с волосяной линией border-default
        (по захвату эталона); проверенная — жёлтая yellow-100 + галочка ink-300;
        смешанная — жёлтая + минус. Фокус — единое кольцо 2px со сдвигом 2px.
        Тёмная тема — контрол Theme в тулбаре.
      </p>
      <div class="tkc-row">
        <figure>
          ${checkbox({})}
          <figcaption>непроверенное состояние (белая коробка + волосяная линия)</figcaption>
        </figure>
        <figure>
          ${checkbox({ defaultChecked: true })}
          <figcaption>проверенное: yellow-100 + галочка ink-300</figcaption>
        </figure>
        <figure>
          ${checkbox({ indeterminate: true })}
          <figcaption>indeterminate: жёлтая заливка + минус, aria-checked="mixed"</figcaption>
        </figure>
        <figure>
          ${checkbox({ disabled: true, defaultChecked: true })}
          <figcaption>disabled: 40% прозрачности, aria-disabled</figcaption>
        </figure>
        <figure>
          ${checkbox({}, 'Слот-контент побеждает prop label')}
          <figcaption>подпись через слот (слот важнее prop)</figcaption>
        </figure>
        <figure>
          ${checkbox({ label: '', ariaLabel: 'Согласен' })}
          <figcaption>
            без подписи — голая коробка; имя даёт потребитель через aria-label (переносится на input)
          </figcaption>
        </figure>
        <figure>
          ${checkbox({
            label: 'Соглашаюсь с условиями обслуживания',
            error: 'Подтвердите согласие, чтобы продолжить',
          })}
          <figcaption>
            ошибка потребителя через error (10.2): строка input-молда — иконка
            + текст error-on-field, aria-invalid + aria-describedby; внутрь
            имени подписи не попадает (строка — сиблинг label)
          </figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The consent pattern (EXPERIENCE.md Checkbox row): label text + inline link
 * + checkbox — a COMPOSED STORY EXAMPLE, deliberately not a separate
 * «consent» component (spec Never). The link is a plain anchor styled with
 * kit tokens (TextLink is story 3.1); clicking the link navigates and does
 * NOT toggle the box (native label semantics skip interactive descendants).
 */
export const ConsentExample: Story = {
  name: 'Паттерн согласия (composed example)',
  render: () => html`
    ${canvasStyles}
    <main class="tkc-canvas">
      <h1>Паттерн согласия</h1>
      <p class="tkc-note">
        Композиция из чекбокса + текста подписи + встроенной ссылки — ровно как
        строка согласия в форме-эталоне («Соглашаюсь получать рекламу про
        кешбэк…»). Это пример композиции в story, не отдельный компонент:
        текст и ссылку приносит потребитель. Ссылка — обычный якорь на токенах
        кита (тот же чернирный цвет + непрерывное подчёркивание, что и в
        эталоне); компонент TextLink появится в 3.1.
      </p>
      <div class="tkc-field">
        <tk-checkbox name="consent" value="granted">
          Соглашаюсь получать рекламу про кешбэк, повышенный процент и
          <a class="tkc-consent-link" href="#conditions">выгодные предложения</a>
        </tk-checkbox>
      </div>
    </main>
  `,
};

/** Live demo of the frozen §4 semantics on the boolean channel (mirrors the Input story). */
export const ValueModes: Story = {
  name: 'Режимы checked (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };

    return html`
      ${canvasStyles}
      <main class="tkc-canvas">
        <h1>Режимы checked</h1>
        <p class="tkc-note">
          Булевое зеркало контракта §4: (1) начальное состояние
          неконтролируемого режима — <code>defaultChecked</code>, изменения
          после подключения игнорируются; (2) контролируемый режим строгий —
          элемент рендерит ровно <code>checked</code>, переключение только
          эмитит <code>checked-change</code>; (3) снятие
          <code>checked</code> переключает в неконтролируемый режим, сея
          состояние последним контролируемым значением.
          <code>indeterminate</code> в канал значения не входит — только
          визуальное состояние родителя.
        </p>
        <section>
          <h2>Неконтролируемый: defaultChecked + checked-change</h2>
          <tk-checkbox
            class="tkc-field"
            default-checked
            @checked-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: boolean }>).detail;
              log('tkc-log-uncontrolled', `checked-change → ${value}`);
            }}
          >
            Соглашаюсь получать рекламу про кешбэк
          </tk-checkbox>
          <pre class="tkc-log" id="tkc-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Индетерминат: визуально и в aria, вне канала значения</h2>
          <tk-checkbox
            class="tkc-field"
            indeterminate
            @checked-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: boolean }>).detail;
              log('tkc-log-mixed', `checked-change → ${value} (mixed → ${value ? 'checked' : 'unchecked'})`);
            }}
          >
            Выбрать все уведомления (indeterminate)
          </tk-checkbox>
          <pre class="tkc-log" id="tkc-log-mixed">—</pre>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkc-canvas">
      <h1>Темизация</h1>
      <p class="tkc-note">
        Чекбокс темизуется только наследованием — переключите контрол Theme в
        тулбаре: непроверенная коробка становится тёмной через
        <code>--tk-color-surface-base</code>, волосяная линия — через
        <code>--tk-color-border-default</code>, кольцо фокуса — через
        <code>--tk-color-focus-ring</code>. Проверенная/смешанная пара
        yellow-100 + ink-300 инвариантна теме (жёлтый всегда держит чернильный
        текст). Ни одной ветки темы в коде. Слоты перекрываются по грамматике
        <code>--tk-&lt;component&gt;-&lt;slot&gt;</code>:
        <code>--tk-checkbox-box-fill</code>, <code>--tk-checkbox-fill</code>,
        <code>--tk-checkbox-check</code>, <code>--tk-checkbox-radius</code>.
      </p>
      <section class="tkc-panel">
        ${checkbox({})}
        ${checkbox({ defaultChecked: true })}
        ${checkbox({ indeterminate: true })}
      </section>
      <section class="tkc-panel tkc-panel--muted">
        ${checkbox({ label: 'Уведомления об операциях' })}
      </section>
      <section class="tkc-panel tkc-panel--bluegray">
        ${checkbox({ defaultChecked: true, label: 'Бумажные выписки' })}
      </section>
      <!-- Charcoal tint: the inline --tk-checkbox-text override IS the
           documented per-tint escape hatch this story demonstrates —
           light-theme text-secondary fails AA on charcoal (≈2.24:1), white
           passes (12.635:1, the pinned table's white-on-ink-300 pair). -->
      <section class="tkc-panel tkc-panel--charcoal">
        <tk-checkbox
          style="--tk-checkbox-text: var(--tk-color-white)"
          indeterminate
          label="Все категории подписки"
        ></tk-checkbox>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkc-canvas">
      <h1>Доступность</h1>
      <p class="tkc-note">
        Техника доступности (выбрана реализатором, зафиксирована в
        спецификации): нативный <code>&lt;input type="checkbox"&gt;</code> в
        теневом корне ОСТАЁТСЯ поверхностью взаимодействия и объявления —
        Пробел, клик по подписи, участие в форме и объявление
        checked/unchecked даёт платформа. Единственный пробел нативности —
        indeterminate не объявляется, поэтому пока
        непроверенно+indeterminate элемент ставит
        <code>aria-checked="mixed"</code> прямо на нативный input (явный
        aria-checked законен на чекбоксе и перекрывает «unchecked» на «mixed»
        — ровно нужная семантика). role=checkbox на хосте НЕ ставится — он
        удвоил бы семантику рядом с нативным input. Имя — от оборачивающего
        <code>&lt;label&gt;</code>: слот-контент или prop label. Форма:
        участие через <code>formAssociated</code> + ElementInternals —
        нативный input в shadow root НЕ сабмитится браузером (form-owner не
        пересекает границу shadow root), поэтому хост зеркалирует запись
        через <code>setFormValue</code>: FormData получает name=value когда
        checked, ничего — когда unchecked; form.reset() восстанавливает
        defaultChecked. Disabled: aria-disabled с
        сохранением фокуса (паттерн кнопочного пилота), переключение
        заблокировано любым способом. Канал <code>error</code> (10.2, молд
        input): сообщение — СИБЛИНГ после label (текст ошибки не входит в
        доступное имя подписи), нативный input несёт
        <code>aria-invalid</code> + <code>aria-describedby</code> только пока
        сообщение показано; внутренней валидации нет и не добавлено.
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
              Фокус входит на коробку / покидает её; кольцо фокуса 2px
              (<code>--tk-color-focus-ring</code>, сдвиг 2px) обводит коробку
              и не убирается.
            </td>
          </tr>
          <tr>
            <td><code>Пробел</code></td>
            <td>
              Переключает состояние; эмитится <code>checked-change</code>
              (composed, bubbles, <code>detail: { value: boolean }</code>). В
              контролируемом режиме элемент ничего не применяет локально —
              коробка рендерится ровно consumer-ское.
            </td>
          </tr>
          <tr>
            <td>Клик по подписи</td>
            <td>
              Переключает (нативная связь label→input); клик по встроенной
              ссылке внутри подписи НЕ переключает — переход по ссылке.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет имя подписи и состояние: «not checked» / «checked», а
              в смешанном окне — «half-checked» (aria-checked="mixed").
              Disabled объявляется как недоступный.
            </td>
          </tr>
          <tr>
            <td>Скринридер + <code>error</code></td>
            <td>
              «Согласен с условиями, пункт выбора, не отмечен, недействителен»
              — затем по повторному визиту зачитывается сообщение
              (aria-describedby); строка ошибки НЕ входит в имя подписи.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkc-row">
        ${checkbox({ indeterminate: true })}
        ${checkbox({
          label: 'Согласен с условиями',
          error: 'Подтвердите согласие, чтобы продолжить',
        })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkc-note">
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
            <td>Tab на чекбокс</td>
            <td>«Согласие, пункт выбора, не отмечен»</td>
          </tr>
          <tr>
            <td>Space</td>
            <td>«отмечен» — состояние объявляется сразу</td>
          </tr>
          <tr>
            <td>Indeterminate</td>
            <td>«частично отмечен» (aria-checked=mixed)</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-checkbox'),
};
