import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import './select.js';
import type { TkSelect, TkSelectOption } from './select.js';

/**
 * tk-select stories (spec 2.3): playground, every variant (with/without
 * label, selected value, required, error, disabled, long list), the OPEN
 * state (the baseline/axe story — rendered statically via `<tk-select open>`,
 * the frozen §9 declarative open surface, so axe and the visual harness see
 * the mounted menu without play functions), the frozen value contract live,
 * theming demo, and the a11y notes with the FULL keyboard checklist.
 *
 * Motion: the only animation is the chevron rotation on open — 150ms
 * productive-standard on the motion tokens, collapsed to 0ms under
 * prefers-reduced-motion by the token layer (no component media query needed).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

/** The reference «повышенный кэшбэк» categories (tbank.ru debit form, 2.0 capture). */
const CASHBACK: TkSelectOption[] = [
  { value: 'all', label: '1% Все покупки' },
  { value: 'restaurants', label: '5% Рестораны' },
  { value: 'pharmacy', label: '5% Аптеки' },
  { value: 'ozon', label: '5% Ozon.ru' },
  { value: 'perekrestok', label: '3% Пятёрочка' },
  { value: 'sport', label: '5% Спорттовары' },
  { value: 'taxi', label: '5% Такси' },
];

const LONG_LIST: TkSelectOption[] = Array.from({ length: 24 }, (_, i) => ({
  value: `v${i}`,
  label: `Категория ${i + 1}`,
}));

type SelectArgs = {
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  error: string;
  value?: string;
};

const select = (args: Partial<SelectArgs> = {}, options: TkSelectOption[] = CASHBACK) => {
  const { label, placeholder, required, disabled, error, value } = args;
  return html`
    <tk-select
      class="tks-field"
      .options=${options}
      .label=${label ?? 'Выберите повышенный кэшбэк (четыре категории)'}
      .placeholder=${placeholder ?? 'Выберите категорию'}
      ?required=${required ?? false}
      ?disabled=${disabled ?? false}
      .error=${error && error.length > 0 ? error : undefined}
      .value=${value}
    ></tk-select>
  `;
};

const canvasStyles = html`
  <style>
    .tks-canvas {
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
    .tks-canvas .tks-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tks-canvas .tks-row > * {
      flex: 1 1 280px;
      max-width: 420px;
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
    .tks-canvas .tks-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tks-canvas .tks-log {
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
    .tks-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tks-panel .tks-field {
      max-width: 420px;
    }
    .tks-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tks-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tks-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<SelectArgs> = {
  title: 'Components/Select',
  component: 'tk-select',
  args: {
    label: 'Выберите повышенный кэшбэк (четыре категории)',
    placeholder: 'Выберите категорию',
    required: false,
    disabled: false,
    error: '',
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SelectArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Select</h1>
      <p class="tks-note">
        Поле выбора в языке поля Input (surface-field, radius-md, 52px, шеврон)
        с меню через оверлей-контроллер: слой dropdown, якорная ширина
        (min — длинные подписи растут), тень --tk-shadow-dropdown, строки
        radius-sm. Контракт value/defaultValue — замороженный §4. Откройте
        меню кликом или клавиатурой.
      </p>
      ${select(args)}
    </main>
  `,
};

/**
 * The OPEN-state story: static `<tk-select open>` — the frozen §9 declarative
 * surface IS the "menu open through element API" technique (noted per the
 * spec's Implementation Notes). No play functions: the menu mounts through
 * the overlay controller on first update, so both the baseline and axe see
 * the open listbox. Kept short on purpose — the panel is position:fixed, and
 * a single-viewport canvas keeps the capture deterministic.
 */
export const Open: Story = {
  name: 'Открытое меню (базлайн/axe)',
  render: () => html`
    ${canvasStyles}
    <main class="tks-canvas">
      <h1>Select — открытое меню</h1>
      <p class="tks-note">
        Менее заметная строка не выбрана (3% Пятёрочка — disabled: недоступна
        ни стрелкам, ни typeahead, ни клику). Визуальный фокус — на первой
        строке (aria-activedescendant), реальный фокус остаётся на триггере.
      </p>
      <div class="tks-row">
        <figure>
          <tk-select
            class="tks-field"
            .options=${CASHBACK}
            label="Выберите повышенный кэшбэк (четыре категории)"
            placeholder="Выберите категорию"
            ?open=${true}
          ></tk-select>
          <figcaption>открытое меню: якорная ширина, тень dropdown, строки radius-sm</figcaption>
        </figure>
      </div>
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
        Поле разделяет язык Input: заливка surface-field, radius-md, 52px,
        волосяная линия, плейсхолдер text-secondary (AA-шаг от gray-500 —
        gray-500 даёт 3.46:1 на заливке поля; см. NOTES) — плейсхолдер
        никогда не заменяет подпись. Выбранная строка помечается галочкой (ink) —
        в образце нет жёлтой пометки выбранной строки.
      </p>
      <div class="tks-row">
        <figure>
          ${select({})}
          <figcaption>по умолчанию: подпись + плейсхолдер</figcaption>
        </figure>
        <figure>
          ${select({ label: '', placeholder: 'Электронная почта' })}
          <figcaption>без подписи — поле называет плейсхолдер</figcaption>
        </figure>
        <figure>
          ${select({ value: 'restaurants' })}
          <figcaption>со значением: подпись выбранной строки в поле</figcaption>
        </figure>
        <figure>
          ${select({ required: true })}
          <figcaption>required: звёздочка + aria-required</figcaption>
        </figure>
        <figure>
          ${select({ error: 'Выберите категорию' })}
          <figcaption>ошибка потребителя (aria-invalid + described-by)</figcaption>
        </figure>
        <figure>
          ${select({ required: true, error: 'Обязательное поле' })}
          <figcaption>required + ошибка потребителя</figcaption>
        </figure>
        <figure>
          ${select({ disabled: true })}
          <figcaption>disabled: 40% прозрачности, aria-disabled</figcaption>
        </figure>
        <figure>
          ${select({}, LONG_LIST)}
          <figcaption>длинный список: внутренний скролл (7 строк), Home/End работают</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** Delayed "consumer answers" apply, tracked PER FIELD (see Input's ValueModes note). */
const pendingApply = new WeakMap<TkSelect, number>();

export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    const cancelApply = (field: TkSelect): void => {
      window.clearTimeout(pendingApply.get(field));
      pendingApply.delete(field);
    };

    return html`
      ${canvasStyles}
      <main class="tks-canvas">
        <h1>Режимы value</h1>
        <p class="tks-note">
          Тот же контракт, что и Input (CONVENTIONS §4): (1) начальное значение
          неконтролируемого режима — <code>defaultValue</code>; (2)
          контролируемый режим строгий — выбор только эмитит
          <code>value-change</code>, элемент рендерит ровно consumer-ский
          <code>value</code>; (3) снятие <code>value</code> отпускает контроль
          с сеянием от последнего значения. Отдельно: <code>open</code> /
          <code>open-change</code> — замороженная §9-поверхность оверлея.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-select
            class="tks-field"
            .options=${CASHBACK}
            label="Повышенный кэшбэк"
            default-value="restaurants"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tks-log-uncontrolled', `value-change → «${value}»`);
            }}
            @open-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: boolean }>).detail;
              log('tks-log-uncontrolled', `open-change → ${value}`);
            }}
          ></tk-select>
          <pre class="tks-log" id="tks-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый: строгий (value применяется с задержкой 700ms)</h2>
          <tk-select
            class="tks-field"
            .options=${CASHBACK}
            label="Повышенный кэшбэк"
            .value=${'all'}
            @value-change=${(event: Event) => {
              const field = event.currentTarget as TkSelect;
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tks-log-controlled', `value-change → «${value}»`);
              cancelApply(field);
              pendingApply.set(
                field,
                window.setTimeout(() => {
                  field.value = value;
                  log('tks-log-controlled', `value применён → «${value}»`);
                }, 700),
              );
            }}
          ></tk-select>
          <pre class="tks-log" id="tks-log-controlled">—</pre>
          <div class="tks-actions">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-select') as TkSelect | null;
                if (!field) return;
                cancelApply(field);
                field.value = 'taxi';
                log('tks-log-controlled', 'value сброшен потребителем → «taxi»');
              }}
              >Установить value="taxi"</tk-button
            >
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-select') as TkSelect | null;
                if (!field) return;
                cancelApply(field);
                field.value = undefined;
                log('tks-log-controlled', 'value снят → неконтролируемый, сеяние от последнего value');
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
    <main class="tks-canvas">
      <h1>Темизация</h1>
      <p class="tks-note">
        Триггер темизуется наследованием токенов (переключите контрол Theme);
        меню перекрашивается тем же слоем — surface-base, тень в тёмной теме
        схлопывается в тональную ступень по DESIGN.md. Слоты поля:
        <code>--tk-select-fill</code>, <code>--tk-select-radius</code>,
        <code>--tk-select-text</code>, <code>--tk-select-placeholder</code>;
        у меню — <code>--tk-select-menu-radius</code>.
      </p>
      <section class="tks-panel">
        ${select({ error: 'Выберите категорию' })}
      </section>
      <section class="tks-panel tks-panel--muted">
        ${select({ label: 'Категория', placeholder: 'Любая' })}
      </section>
      <section class="tks-panel tks-panel--bluegray">
        <tk-select
          class="tks-field"
          .options=${CASHBACK}
          label="Со своим слотом заливки"
          placeholder="Выберите категорию"
          style="--tk-select-fill: var(--tk-color-white)"
        ></tk-select>
      </section>
      <section class="tks-panel tks-panel--charcoal">
        ${select({ label: 'Промокод', placeholder: 'TINKOFF' })}
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
        Триггер — <code>role="combobox"</code> с доступным именем через
        <code>aria-labelledby</code> (подпись), <code>aria-expanded</code>,
        <code>aria-controls</code> на панель и <code>aria-activedescendant</code>
        на активную строку, пока меню открыто. Панель —
        <code>role="listbox"</code>, строки — <code>role="option"</code> с
        <code>aria-selected</code>/<code>aria-disabled</code>; панель —
        сгенерированный ребёнок shadow-дерева элемента (одно дерево с
        триггером — id-ссылки aria не пересекают границ), монтируется
        оверлей-контроллером. Фокус реальный остаётся на триггере всё время,
        пока меню открыто, — визуальный фокус двигается через
        activedescendant. Меню закрывается по клику вне (фокус возвращается на
        триггер) и по потере фокуса (фокус следует естественному порядку
        табов). Шеврон и галочка — <code>aria-hidden</code>. Ошибка —
        <code>aria-invalid</code> + <code>aria-describedby</code>, фокус не
        крадёт. Анимация — только поворот шеврона, 150ms на motion-токенах,
        0ms при prefers-reduced-motion.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на триггер / покидает его; кольцо 2px обводит всё поле.</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code></td>
            <td>Меню открывается; визуальный фокус на выбранной строке (или первой доступной).</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (закрыто)</td>
            <td>Меню открывается: ↓ — с первой доступной строки, ↑ — с последней.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (открыто)</td>
            <td>
              Визуальный фокус двигается по строкам (с переходом через край —
              wrap), недоступные строки пропускаются; активная строка
              прокручивается в вид (block: nearest).
            </td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Прыжок на первую / последнюю доступную строку (и открытие, если закрыто).</td>
          </tr>
          <tr>
            <td>печать символов</td>
            <td>
              Typeahead: буфер из нескольких символов, скачок на первую
              доступную строку по префиксу (без учёта регистра); сброс буфера
              через 500ms.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> (открыто)</td>
            <td>Выбор активной строки: <code>value-change</code>, меню закрывается, фокус на триггере.</td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>Меню закрывается БЕЗ изменения значения; фокус на триггере.</td>
          </tr>
          <tr>
            <td><code>Tab</code> из открытого меню</td>
            <td>Меню закрывается, фокус уходит естественным порядком (не принудительно).</td>
          </tr>
          <tr>
            <td>клик вне</td>
            <td>Меню закрывается, фокус возвращается на триггер.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Подпись, combobox, свёрнуто/развёрнуто»; при навигации объявляется активная строка; выбранная — «выбрана».</td>
          </tr>
        </tbody>
      </table>
      <div class="tks-row">
        ${select({ required: true })}
      </div>
    </main>
  `,
};
