import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import type { AttributePart } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './combobox-search.js';
import type { TkComboboxSearch, TkComboboxSearchOption } from './combobox-search.js';

/**
 * tk-combobox-search stories (spec 6.3): playground, the OPEN state (driven
 * through the real typing path — see TypeOnMount), variants (foreign value,
 * empty options, custom messages, disabled), the frozen value contract
 * live, theming, and the a11y notes with the FULL keyboard checklist + an
 * SR-protocol section (maintainer-side execution).
 *
 * Motion: NOTHING animates — the field has no chevron and the menu rows
 * snap between hover/active fills (the select menu language). The
 * reduced-motion letter holds trivially.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

/** The reference's own instrument set (invest/stocks catalog, spec 6.3). */
const INSTRUMENTS: TkComboboxSearchOption[] = [
  { value: 'GAZP', label: 'Газпром' },
  { value: 'SBER', label: 'Сбербанк' },
  { value: 'LKOH', label: 'Лукойл' },
  { value: 'GMKN', label: 'Норникель' },
  { value: 'YNDX', label: 'Яндекс' },
  { value: 'TCSG', label: 'Т-Технологии' },
  { value: 'ROSN', label: 'Роснефть' },
  { value: 'NVDA', label: 'NVIDIA' },
  { value: 'AAPL', label: 'Apple' },
  { value: 'MOEX', label: 'Московская биржа' },
];

/**
 * Story-only OPEN-STATE driver. The suggestion menu's open state is
 * INTERNAL UI (the filter-chips precedent — spec 6.3 ruled it), so there is
 * no declarative `open` channel for a baseline story to render; this
 * directive runs the component's PUBLIC typing path once the element has
 * mounted — focus + input event on the shadow control, exactly what a
 * user's keystroke produces. Without it the story baselines and the axe
 * sweep would only ever see the closed field.
 */
class TypeOnMount extends Directive {
  #driven = new WeakSet<object>();

  override update(part: AttributePart): string {
    const element = part.element as TkComboboxSearch;
    if (element && !this.#driven.has(element)) {
      this.#driven.add(element);
      void element.updateComplete
        .then(() => {
          const control = element.shadowRoot?.querySelector<HTMLInputElement>('.field__control');
          if (!control) return;
          control.focus();
          control.value = 'н'; // Сбербанк, Норникель, Яндекс, Т-Технологии, Роснефть
          control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        })
        // Deterministic capture state (CI triage 2026-09-25): a focused field
        // paints its focus-within ring and then races whatever steals focus
        // before the screenshot — the first ubuntu run captured the focused
        // state while the confirmed baselines hold the settled one. Settle
        // explicitly: let the menu open once (its real pixels are the
        // page-clipped combobox-search.spec.ts pair), then blur — focusout
        // closes the menu WITHOUT restoreQuery, so the typed filter text
        // stays in the field. Same pixels on every platform, race or not.
        .then(() => element.updateComplete)
        .then(() => element.shadowRoot?.querySelector<HTMLInputElement>('.field__control')?.blur());
    }
    return this.render();
  }

  override render(): string {
    return '';
  }
}

const typeOnMount = directive(TypeOnMount);

type ComboboxSearchArgs = {
  label: string;
  placeholder: string;
  value?: string;
  disabled: boolean;
};

const comboboxSearch = (args: Partial<ComboboxSearchArgs> = {}) => {
  const { label, placeholder, value, disabled } = args;
  return html`
    <tk-combobox-search
      .options=${INSTRUMENTS}
      .label=${label ?? 'Поиск инструментов'}
      .placeholder=${placeholder ?? 'Название или тикер'}
      .value=${value}
      .disabled=${disabled ?? false}
    ></tk-combobox-search>
  `;
};

const canvasStyles = html`
  <style>
    .tkcs-canvas {
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
    .tkcs-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkcs-canvas .tkcs-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkcs-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkcs-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkcs-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkcs-canvas td,
    .tkcs-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkcs-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkcs-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkcs-canvas .tkcs-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkcs-canvas .tkcs-log {
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
    .tkcs-canvas .tkcs-fieldrow {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tkcs-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkcs-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkcs-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkcs-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<ComboboxSearchArgs> = {
  title: 'Components/ComboboxSearch',
  component: 'tk-combobox-search',
  args: {
    label: 'Поиск инструментов',
    placeholder: 'Название или тикер',
    disabled: false,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ComboboxSearchArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkcs-canvas">
      <h1>ComboboxSearch</h1>
      <p class="tkcs-note">
        Безрамочное поле поиска инструментов (52px, заливка surface, лупа
        20px, плейсхолдер «Название или тикер») с фильтрующим списком
        подсказок: фильтр по названию И тикеру, регистронезависимо; ввод
        открывает панель; Enter выбирает активную строку, Esc закрывает и
        восстанавливает текст значения. Фокус НИКОГДА не покидает поле —
        навигация стрелками водит aria-activedescendant. Подсчёт «Найдено N
        инструментов» объявляется вежливой областью.
      </p>
      <div class="tkcs-fieldrow">
        ${comboboxSearch(args)}
      </div>
    </main>
  `,
};

export const Open: Story = {
  name: 'Открытое меню',
  render: () => html`
    ${canvasStyles}
    <main class="tkcs-canvas">
      <h1>Открытое меню</h1>
      <p class="tkcs-note">
        Открытое состояние — внутренняя логика элемента (канала open нет,
        прецедент filter-chips), поэтому стори управляет им публичным путём
        ввода: директива фокусирует поле и печатает «н» сразу после монта —
        ровно то, что делает живой пользователь. Панель: ширина поля,
        якорь — бокс поля, строки 48px, выбранное значение («Яндекс») —
        жирным с галочкой, активная строка — заливка surface-field.
        Базелайн и axe-прогон видят ОТКРЫТУЮ панель, а не только закрытое
        поле.
      </p>
      <div class="tkcs-fieldrow">
        <tk-combobox-search
          .options=${INSTRUMENTS}
          label="Поиск инструментов"
          default-value="YNDX"
          data-driver=${typeOnMount()}
        ></tk-combobox-search>
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkcs-canvas">
      <h1>Варианты</h1>
      <p class="tkcs-note">
        Значение вне options НЕ стягивается — поле держит свободный текст
        (поиск, не select). Пустой набор и ноль совпадений держат панель
        открытой со строкой «Ничего не найдено» (инвертированный урок 6.2).
        Тексты объявлений переопределяются свойствами results-message (шаблон
        с {n}) и no-results-message.
      </p>
      <figure>
        ${comboboxSearch({})}
        <figcaption>по умолчанию: иконка, плейсхолдер, пустое значение</figcaption>
      </figure>
      <figure>
        ${comboboxSearch({ value: 'GAZP' })}
        <figcaption>значение GAZP: поле показывает название («Газпром»)</figcaption>
      </figure>
      <figure>
        ${comboboxSearch({ value: 'XYZ' })}
        <figcaption>постороннее значение «XYZ»: рисуется как есть — нет клампа</figcaption>
      </figure>
      <figure>
        ${comboboxSearch({ placeholder: 'Тикер или название', label: 'Поиск бумаг' })}
        <figcaption>свои placeholder и доступное имя</figcaption>
      </figure>
      <figure>
        <tk-combobox-search
          .options=${[]}
          label="Пустой набор"
          @value-change=${() => {}}
        ></tk-combobox-search>
        <figcaption>пустые options: ввод открывает «Ничего не найдено»</figcaption>
      </figure>
      <figure>
        <tk-combobox-search
          .options=${INSTRUMENTS}
          label="Английские объявления"
          results-message="Matches: {n}"
          no-results-message="No matches"
        ></tk-combobox-search>
        <figcaption>свои шаблоны объявлений (results-message / no-results-message)</figcaption>
      </figure>
      <figure>
        ${comboboxSearch({ disabled: true, value: 'SBER' })}
        <figcaption>disabled: readonly, aria-disabled, полупрозрачность</figcaption>
      </figure>
    </main>
  `,
};

/** Delayed "consumer answers" apply, tracked PER FIELD (see select's ValueModes note). */
const pendingApply = new WeakMap<TkComboboxSearch, number>();

export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    const cancelApply = (field: TkComboboxSearch): void => {
      window.clearTimeout(pendingApply.get(field));
      pendingApply.delete(field);
    };

    return html`
      ${canvasStyles}
      <main class="tkcs-canvas">
        <h1>Режимы value</h1>
        <p class="tkcs-note">
          Тот же контракт, что и Input/Select (CONVENTIONS §4): (1) начальное
          значение неконтролируемого режима — <code>defaultValue</code>; (2)
          контролируемый режим строгий — ввод только ЖИВОЙ ТЕКСТ (никогда не
          эмитит), выбор строки эмитит <code>value-change</code> и ничего не
          применяет локально, поле рендерит ровно consumer-ский
          <code>value</code> на границах коммита; (3) снятие
          <code>value</code> отпускает контроль с сеянием от последнего
          значения. Постороннее значение НЕ стягивается — канал свободного
          текста.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-combobox-search
            .options=${INSTRUMENTS}
            label="Поиск инструментов"
            default-value="LKOH"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkcs-log-uncontrolled', `value-change → «${value}»`);
            }}
          ></tk-combobox-search>
          <pre class="tkcs-log" id="tkcs-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый: строгий (value применяется с задержкой 700ms)</h2>
          <tk-combobox-search
            .options=${INSTRUMENTS}
            label="Поиск инструментов"
            .value=${'GAZP'}
            @value-change=${(event: Event) => {
              const field = event.currentTarget as TkComboboxSearch;
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkcs-log-controlled', `value-change → «${value}»`);
              cancelApply(field);
              pendingApply.set(
                field,
                window.setTimeout(() => {
                  field.value = value;
                  log('tkcs-log-controlled', `value применён → «${value}»`);
                }, 700),
              );
            }}
          ></tk-combobox-search>
          <pre class="tkcs-log" id="tkcs-log-controlled">—</pre>
          <div class="tkcs-actions">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-combobox-search') as TkComboboxSearch | null;
                if (!field) return;
                cancelApply(field);
                field.value = 'NVDA';
                log('tkcs-log-controlled', 'value сброшен потребителем → «NVDA»');
              }}
              >Установить value="NVDA"</tk-button
            >
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-combobox-search') as TkComboboxSearch | null;
                if (!field) return;
                cancelApply(field);
                field.value = undefined;
                log('tkcs-log-controlled', 'value снят → неконтролируемый, сеяние от последнего value');
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
    <main class="tkcs-canvas">
      <h1>Темизация</h1>
      <p class="tkcs-note">
        Поле темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Слоты:
        <code>--tk-combobox-search-fill</code>,
        <code>--tk-combobox-search-radius</code>,
        <code>--tk-combobox-search-text</code>,
        <code>--tk-combobox-search-placeholder</code>,
        <code>--tk-combobox-search-icon</code>; у меню —
        <code>--tk-combobox-search-menu-radius</code>.
      </p>
      <section class="tkcs-fieldrow tkcs-panel">
        ${comboboxSearch({ value: 'SBER' })}
      </section>
      <section class="tkcs-fieldrow tkcs-panel tkcs-panel--muted">
        ${comboboxSearch({ label: 'На muted-поверхности' })}
      </section>
      <section class="tkcs-fieldrow tkcs-panel tkcs-panel--bluegray">
        <tk-combobox-search
          .options=${INSTRUMENTS}
          label="Со своим слотом заливки"
          style="--tk-combobox-search-fill: var(--tk-color-white)"
        ></tk-combobox-search>
      </section>
      <section class="tkcs-fieldrow tkcs-panel tkcs-panel--charcoal">
        ${comboboxSearch({ label: 'Промокод' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkcs-canvas">
      <h1>Доступность</h1>
      <p class="tkcs-note">
        Поле — <code>role="combobox"</code> (aria-expanded/controls/
        activedescendant, aria-autocomplete="list") с именем через
        <code>aria-label</code> (свойство label; видимой подписи нет — как в
        образце). Панель — <code>role="listbox"</code>, строки —
        <code>role="option"</code> + <code>aria-selected</code> на выбранном
        значении. Фокус НИКОГДА не покидает поле: навигация стрелками водит
        <code>aria-activedescendant</code> (модель APG combobox; строки —
        div-указатели, не кнопки). Лупа — <code>aria-hidden</code>. Ввод IME
        ставит конвейер на паузу (isComposing) — список не мерцает посреди
        композиции. Поле ≥44px. Объявления — вежливая область «Найдено N
        инструментов» после каждого фильтра; закрывается — очищается.
        Стрелки с модификаторами (Alt+↓/↑) не перехватываются,
        PageUp/PageDown не реализованы — опциональные клавиши APG,
        спецификация о них молчит; решение осознанное.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на поле (единственная остановка) и уходит дальше; открытая панель закрывается сама.</td>
          </tr>
          <tr>
            <td>печать</td>
            <td>
              Открывает панель и фильтрует по названию/тикеру (регистр не
              важен); активная строка — выбранное значение, если оно
              проходит фильтр, иначе первая. Область объявляет «Найдено N …».
            </td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (закрыто)</td>
            <td>Открывает панель: ↓ — первая строка, ↑ — последняя.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (открыто)</td>
            <td>Активная строка шагает с переходом через край (wrap), подсветка и activedescendant следуют, строка прокручивается в кадр.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code> (открыто)</td>
            <td>Активная строка — первая / последняя.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code> (закрыто)</td>
            <td>Нативное движение каретки — панель НЕ открывается (однострочное поле владеет этими клавишами).</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Символ запроса, НЕ клавиша меню (правило Space-инертности select сюда НЕ переносится).</td>
          </tr>
          <tr>
            <td><code>Enter</code> (открыто)</td>
            <td>
              Выбирает активную строку: <code>value-change</code>, поле
              показывает название, панель закрывается, фокус остаётся в поле.
              На выбранной строке — закрытие без изменения.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> (закрыто)</td>
            <td>Инертна — ни открытия, ни эмита.</td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>
              Закрывает панель И восстанавливает текст значения (запрос —
              временный ввод, не значение); канал value не меняется.
            </td>
          </tr>
          <tr>
            <td>клик вне</td>
            <td>Панель закрывается, фокус возвращается в поле.</td>
          </tr>
          <tr>
            <td>клик по строке</td>
            <td>Выбор тем же каналом, панель закрывается, фокус не покидал поле.</td>
          </tr>
          <tr>
            <td>IME</td>
            <td>Композиция идёт без фильтрации; по завершении — обычный ввод.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Поиск, поле комбинированный список, не развёрнуто»; строка — «вариант, 1 из N»; после фильтра — «Найдено N инструментов».</td>
          </tr>
        </tbody>
      </table>
      <div class="tkcs-fieldrow">
        ${comboboxSearch({ value: 'YNDX' })}
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkcs-note">
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
            <td>«Поиск инструментов, поле комбинированный список, редактируемый, не развёрнуто»</td>
          </tr>
          <tr>
            <td>Печать «газ»</td>
            <td>«развёрнуто»; затем — «Найден 1 инструмент»; активная строка: «Газпром, вариант»</td>
          </tr>
          <tr>
            <td>↓</td>
            <td>строки объявляются по одной: «вариант N из M» + название</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>«Газпром, выбрано»; панель свёрнута, фокус в поле</td>
          </tr>
          <tr>
            <td>Esc посреди ввода</td>
            <td>панель свёрнута; поле снова читает выбранное название</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-combobox-search'),
};
