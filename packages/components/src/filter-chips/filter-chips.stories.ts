import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './filter-chips.js';
import type { TkFilterChips, TkFilterChipsItem } from './filter-chips.js';

/**
 * tk-filter-chips stories (spec 6.2): playground, variants (window sizes,
 * overflow-resident selection, the «Ещё» row), the frozen value contract
 * live, theming, and the a11y notes with the FULL keyboard checklist + an
 * SR-protocol section (maintainer-side execution).
 *
 * Motion: the only animation is the «Ещё» chevron rotation on open and the
 * chip border-color step — motion tokens throughout, collapsed to 0ms under
 * prefers-reduced-motion by the token layer (no component media query).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

/** The reference's own chip set (invest/stocks catalog — 10 incl. overflow). */
const CATALOG: TkFilterChipsItem[] = [
  { value: 'what-to-buy', label: 'Что купить' },
  { value: 'stocks', label: 'Акции' },
  { value: 'currency', label: 'Валюта' },
  { value: 'funds', label: 'Фонды' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'futures', label: 'Фьючерсы' },
  { value: 'options', label: 'Опционы' },
  { value: 'strategies', label: 'Стратегии' },
  { value: 'indexes', label: 'Индексы' },
  { value: 'favorites', label: 'Избранное' },
];

type FilterChipsArgs = {
  label: string;
  visibleCount: number;
  value?: string;
};

const filterChips = (args: Partial<FilterChipsArgs> = {}, items: TkFilterChipsItem[] = CATALOG) => {
  const { label, visibleCount, value } = args;
  return html`
    <tk-filter-chips
      .items=${items}
      .label=${label ?? 'Раздел каталога'}
      .visibleCount=${visibleCount ?? 7}
      .value=${value}
    ></tk-filter-chips>
  `;
};

const canvasStyles = html`
  <style>
    .tkf-canvas {
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
    .tkf-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkf-canvas .tkf-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkf-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkf-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkf-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkf-canvas td,
    .tkf-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkf-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkf-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkf-canvas .tkf-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkf-canvas .tkf-log {
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
    .tkf-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkf-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkf-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkf-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<FilterChipsArgs> = {
  title: 'Components/FilterChips',
  component: 'tk-filter-chips',
  args: {
    label: 'Раздел каталога',
    visibleCount: 7,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<FilterChipsArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>FilterChips</h1>
      <p class="tkf-note">
        Однострочный ряд пилюль каталога инвестий: радиус full, body-m, белая
        заливка, ОДИН невыбранный волос 1px; выбор — ТОЛЬКО жёлтая рамка 2px
        (заливка и цвет текста не меняются). Разделение референса: 7 видимых
        чипов + «Ещё» с меню оставшихся. Контракт value/defaultValue —
        замороженный §4. Откройте «Ещё» кликом или стрелкой вниз.
      </p>
      ${filterChips(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Варианты</h1>
      <p class="tkf-note">
        Выбранный чип — жёлтая рамка 2px при неизменной заливке; активный
        элемент ряда меняется, прежний гаснет (одинарный выбор по построению).
        Если активен элемент из «Ещё», жёлтую рамку несёт САМ чип «Ещё» —
        видимый индикатор всегда ровно один.
      </p>
      <figure>
        ${filterChips({})}
        <figcaption>по умолчанию: 7 видимых + «Ещё» (референсный сплит)</figcaption>
      </figure>
      <figure>
        ${filterChips({ value: 'stocks' })}
        <figcaption>выбран второй чип («Акции»): рамка 2px yellow-100</figcaption>
      </figure>
      <figure>
        ${filterChips({ value: 'indexes' })}
        <figcaption>выбран элемент из «Ещё» («Индексы»): рамку несёт «Ещё»</figcaption>
      </figure>
      <figure>
        ${filterChips({ visibleCount: 3 })}
        <figcaption>visible-count 3: короткое окно, длинный оверфлоу</figcaption>
      </figure>
      <figure>
        ${filterChips({}, CATALOG.slice(0, 5))}
        <figcaption>без оверфлоу: «Ещё» не рендерится</figcaption>
      </figure>
      <figure>
        ${filterChips({ visibleCount: 1 })}
        <figcaption>видим один чип: крайний случай окна</figcaption>
      </figure>
    </main>
  `,
};

/** Delayed "consumer answers" apply, tracked PER FIELD (see select's ValueModes note). */
const pendingApply = new WeakMap<TkFilterChips, number>();

export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    const cancelApply = (field: TkFilterChips): void => {
      window.clearTimeout(pendingApply.get(field));
      pendingApply.delete(field);
    };

    return html`
      ${canvasStyles}
      <main class="tkf-canvas">
        <h1>Режимы value</h1>
        <p class="tkf-note">
          Тот же контракт, что и Input/Select (CONVENTIONS §4): (1) начальное
          значение неконтролируемого режима — <code>defaultValue</code>; (2)
          контролируемый режим строгий — выбор чипа только эмитит
          <code>value-change</code>, ряд рендерит ровно consumer-ский
          <code>value</code>; (3) снятие <code>value</code> отпускает контроль
          с сеянием от последнего значения. Значение вне items стягивается к
          первому элементу (§2). Повторный выбор активного чипа — no-op:
          снятия выбора нет, value всегда один из items.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-filter-chips
            .items=${CATALOG}
            label="Раздел каталога"
            default-value="currency"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkf-log-uncontrolled', `value-change → «${value}»`);
            }}
          ></tk-filter-chips>
          <pre class="tkf-log" id="tkf-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый: строгий (value применяется с задержкой 700ms)</h2>
          <tk-filter-chips
            .items=${CATALOG}
            label="Раздел каталога"
            .value=${'what-to-buy'}
            @value-change=${(event: Event) => {
              const field = event.currentTarget as TkFilterChips;
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkf-log-controlled', `value-change → «${value}»`);
              cancelApply(field);
              pendingApply.set(
                field,
                window.setTimeout(() => {
                  field.value = value;
                  log('tkf-log-controlled', `value применён → «${value}»`);
                }, 700),
              );
            }}
          ></tk-filter-chips>
          <pre class="tkf-log" id="tkf-log-controlled">—</pre>
          <div class="tkf-actions">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-filter-chips') as TkFilterChips | null;
                if (!field) return;
                cancelApply(field);
                field.value = 'favorites';
                log('tkf-log-controlled', 'value сброшен потребителем → «favorites» (рамка на «Ещё»)');
              }}
              >Установить value="favorites"</tk-button
            >
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const field = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-filter-chips') as TkFilterChips | null;
                if (!field) return;
                cancelApply(field);
                field.value = undefined;
                log('tkf-log-controlled', 'value снят → неконтролируемый, сеяние от последнего value');
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
    <main class="tkf-canvas">
      <h1>Темизация</h1>
      <p class="tkf-note">
        Чипы темизуются наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Слоты:
        <code>--tk-filter-chips-fill</code>,
        <code>--tk-filter-chips-radius</code>,
        <code>--tk-filter-chips-text</code>,
        <code>--tk-filter-chips-selected-border</code>; у меню —
        <code>--tk-filter-chips-menu-radius</code>.
      </p>
      <section class="tkf-panel">
        ${filterChips({ value: 'stocks' })}
      </section>
      <section class="tkf-panel tkf-panel--muted">
        ${filterChips({ label: 'На muted-поверхности' })}
      </section>
      <section class="tkf-panel tkf-panel--bluegray">
        <tk-filter-chips
          .items=${CATALOG}
          label="Со своим слотом заливки"
          style="--tk-filter-chips-fill: var(--tk-color-white)"
        ></tk-filter-chips>
      </section>
      <section class="tkf-panel tkf-panel--charcoal">
        ${filterChips({ label: 'Промокод' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkf-canvas">
      <h1>Доступность</h1>
      <p class="tkf-note">
        Контейнер — <code>role="tablist"</code> с именем через
        <code>aria-label</code> (свойство label; видимой подписи нет — как в
        образце), чипы — <code>role="tab"</code> +
        <code>aria-selected</code>. Каждый чип — остановка Tab (7 наблюдаемых
        остановок референса): отклонение от APG roving-tabindex ЗАФИКСИРОВАНО
        как решение — фидельность референса, стрелки работают внутри ряда.
        Клавиша Space/Enter выбирает; выбор не уводит фокус с чипа (дефект
        референса «фокус падает в body» исправлен — санкционированная ось
        улучшений). Меню «Ещё» — <code>aria-haspopup="menu"</code>,
        <code>aria-expanded</code>, панель <code>role="menu"</code>, строки —
        <code>menuitemradio</code> с <code>aria-checked</code>; фокус реально
        ходит по строкам меню, Esc закрывает без изменения значения и возвращает
        фокус на «Ещё». Шеврон — <code>aria-hidden</code>. Мишени ≥44×44.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на первый чип и идёт по каждому чипу ряда (все — остановки Tab), затем «Ещё».</td>
          </tr>
          <tr>
            <td><code>←</code> / <code>→</code></td>
            <td>
              Фокус ходит по чипам таблиста с переходом через край (wrap);
              выбора НЕТ — ручная активация.
            </td>
          </tr>
          <tr>
            <td><code>Space</code> / <code>Enter</code> на чипе</td>
            <td>
              Выбор: <code>value-change</code>, прежний чип гаснет, фокус
              ОСТАЁТСЯ на выбранном чипе.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> на «Ещё»</td>
            <td>Меню открывается, <code>aria-expanded="true"</code>, фокус на первой строке (или на отмеченной).</td>
          </tr>
          <tr>
            <td><code>↓</code> на «Ещё»</td>
            <td>Открытие с фокусом на первой строке; <code>↑</code> — на последней.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> в меню</td>
            <td>Фокус по строкам с переходом через край.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code> в меню</td>
            <td>Прыжок на первую / последнюю строку.</td>
          </tr>
          <tr>
            <td><code>Enter</code> в меню</td>
            <td>
              Выбор строки: <code>value-change</code> (тот же канал, что у
              чипа), меню закрывается, фокус на «Ещё», «Ещё» несёт жёлтую рамку.
            </td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>Меню закрывается БЕЗ изменения значения; фокус на «Ещё».</td>
          </tr>
          <tr>
            <td><code>Tab</code> из открытого меню</td>
            <td>Меню закрывается, фокус уходит естественным порядком (не принудительно).</td>
          </tr>
          <tr>
            <td>клик вне</td>
            <td>Меню закрывается, фокус возвращается на «Ещё».</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Раздел каталога, список вкладок»; чип — «вкладка, выбрана/не выбрана»; меню — «меню», строки — «пункт меню-переключатель, отмечен».</td>
          </tr>
        </tbody>
      </table>
      <div>
        ${filterChips({ value: 'currency' })}
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkf-note">
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
            <td>Tab на первый чип</td>
            <td>«Раздел каталога, список вкладок, Что купить, вкладка, выбрана»</td>
          </tr>
          <tr>
            <td>Стрелки по ряду</td>
            <td>чипы объявляются по одному: имя + «вкладка, не выбрана»; выбора нет</td>
          </tr>
          <tr>
            <td>Space (выбор)</td>
            <td>«Валюта, вкладка, выбрана» — фокус и объявление остаются на чипе</td>
          </tr>
          <tr>
            <td>Enter на «Ещё»</td>
            <td>«Ещё, развёрнуто, меню»; фокус: «Стратегии, пункт меню-переключатель»</td>
          </tr>
          <tr>
            <td>Enter на «Индексы»</td>
            <td>«Индексы, отмечено»; меню свёрнуто, фокус: «Ещё, кнопка»</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>закрытие без изменения значения, фокус на «Ещё»</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-filter-chips'),
};
