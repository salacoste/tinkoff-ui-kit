import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './thumbnail-picker.js';
import type { TkThumbnailPickerOption } from './thumbnail-picker.js';

/**
 * tk-thumbnail-picker stories (spec 2.6): playground (the reference
 * «Выберите дизайн карты» composition — 6 card-design tiles wrapping 4+2),
 * every state (nothing selected / selected / initials fallback / broken-image
 * fallback / disabled option / disabled group / empty copy slot), the frozen
 * controlled/uncontrolled contract live, theming demo, and the a11y notes
 * with the row-major keyboard-only checklist.
 *
 * Motion: the ring and hover hairline run on `--tk-motion-duration-fast`
 * (150ms) productive-standard and collapse to 0ms under
 * prefers-reduced-motion via the token layer — no separate media query
 * exists to forget.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. The tile ARTWORK is
 * generated at render time as inline-SVG data URIs whose colors are READ
 * from the token layer via getComputedStyle (theme-invariant scale tokens,
 * so baselines stay deterministic in both themes; no literal ever appears
 * in this source).
 */

/** Reads a token's computed value (the artwork source — no literals in this file). */
const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/** Card-design artwork: rounded square + chip + mark, colors from tokens. */
const cardArt = (fillToken: string, markToken: string): string => {
  const fill = tokenColor(fillToken);
  const mark = tokenColor(markToken);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">' +
    `<rect width="144" height="144" rx="24" fill="${fill}"/>` +
    `<rect x="18" y="102" width="38" height="16" rx="4" fill="${mark}"/>` +
    `<circle cx="112" cy="38" r="14" fill="${mark}"/>` +
    '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** The reference «Выберите дизайн карты» set (2.0 capture: 6 card designs, first checked). */
const CARD_DESIGNS: TkThumbnailPickerOption[] = [
  { value: 'black', label: 'Чёрная', thumbnail: cardArt('--tk-color-ink-400', '--tk-color-yellow-100') },
  { value: 'yellow', label: 'Жёлтая', thumbnail: cardArt('--tk-color-yellow-100', '--tk-color-ink-300') },
  { value: 'platinum', label: 'Платиновая', thumbnail: cardArt('--tk-color-gray-200', '--tk-color-ink-200') },
  { value: 'blue', label: 'Синяя', thumbnail: cardArt('--tk-color-blue-100', '--tk-color-white') },
  { value: 'green', label: 'Зелёная', thumbnail: cardArt('--tk-color-green-100', '--tk-color-white') },
  { value: 'red', label: 'Красная', thumbnail: cardArt('--tk-color-red-100', '--tk-color-white') },
];

/** The same set without thumbnails — the initials fallback face. */
const INITIALS_ONLY: TkThumbnailPickerOption[] = CARD_DESIGNS.map(({ value, label }) => ({
  value,
  label,
}));

type ThumbnailPickerArgs = {
  label: string;
  value?: string;
  defaultValue: string;
  disabled: boolean;
};

const thumbnailPicker = (
  args: Partial<ThumbnailPickerArgs> = {},
  options: TkThumbnailPickerOption[] = CARD_DESIGNS,
) => {
  const { label, value, defaultValue, disabled } = args;
  // `value === undefined ? undefined : value` keeps the demo UNCONTROLLED by
  // default: a bound value would strict-control the element and leave demo
  // arrows visually stuck until a re-render (the frozen §4 contract).
  return html`
    <tk-thumbnail-picker
      class="tkp-field"
      .options=${options}
      .label=${label ?? 'Выберите дизайн карты'}
      .value=${value}
      .defaultValue=${defaultValue ?? ''}
      ?disabled=${disabled ?? false}
    ></tk-thumbnail-picker>
  `;
};

const canvasStyles = html`
  <style>
    .tkp-canvas {
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
    .tkp-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkp-canvas .tkp-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkp-canvas .tkp-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkp-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkp-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas td,
    .tkp-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkp-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkp-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* The reference composition width: 72px tiles wrap 4+2 like the capture's grid. */
    .tkp-canvas .tkp-field {
      max-width: 324px;
    }
    .tkp-canvas .tkp-field--narrow {
      max-width: 260px;
    }
    .tkp-canvas .tkp-log {
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
    .tkp-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkp-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkp-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkp-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<ThumbnailPickerArgs> = {
  title: 'Components/ThumbnailPicker',
  component: 'tk-thumbnail-picker',
  args: {
    label: 'Выберите дизайн карты',
    defaultValue: 'black',
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Видимая подпись группы над сеткой — доступное имя radiogroup.',
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

type Story = StoryObj<ThumbnailPickerArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>ThumbnailPicker</h1>
      <p class="tkp-note">
        Сетка выбираемых плиток из формы-эталона («Выберите дизайн карты»):
        квадраты 72px radius-md, упакованные в
        <code>repeat(auto-fill,&nbsp;72px)</code> с шагом 12px (проба захвата),
        выбранная плитка — внешнее кольцо 2px ink-300, повторяющее скруглённый
        контур (геометрия кольца — пиксель-проба эталона; цвет по DESIGN.md).
        Лицо плитки — картинка <code>thumbnail</code> (при ошибке загрузки —
        инициалы), подпись скрыта визуально и остаётся доступным именем радио.
        Стрелки ходят по сетке построчно (→ в конце строки переходит на первую
        плитку следующей), выбор следует за фокусом, Пробел/Enter выбирают.
        Контракт value/defaultValue унаследован дословно из замороженного §4
        (строчный канал). Ширина поля 324px — четыре плитки в строке, перенос
        4+2 как в эталоне.
      </p>
      ${thumbnailPicker(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Состояния</h1>
      <p class="tkp-note">
        Невыбранное состояние — ноль выбрано (валидное «до первого касания»,
        Tab входит на первую доступную плитку). Выбранное — внешнее кольцо
        2px ink-300. Без <code>thumbnail</code> плитка рендерит инициалы
        («Чёрная» → «Ч»); битый URL тихо падает на инициалы — значка
        «сломанной картинки» нет. Отдельная отключённая плитка пропускается
        стрелками и не выбирается. Ноль опций — слот копии пустого состояния
        (текст по умолчанию или свой через <code>slot="empty"</code>).
        Тёмная тема — контрол Theme в тулбаре.
      </p>
      <div class="tkp-row">
        <figure>
          ${thumbnailPicker({ defaultValue: '' })}
          <figcaption>ничего не выбрано (Tab входит на первую плитку)</figcaption>
        </figure>
        <figure>
          ${thumbnailPicker({ defaultValue: 'black' })}
          <figcaption>выбрана «Чёрная»: внешнее кольцо 2px ink-300</figcaption>
        </figure>
        <figure>
          ${thumbnailPicker({}, INITIALS_ONLY)}
          <figcaption>без thumbnail: лицо-инициалы на заливке surface-field</figcaption>
        </figure>
        <figure>
          ${thumbnailPicker(
            { defaultValue: 'blue' },
            [
              { value: 'black', label: 'Чёрная', thumbnail: '/missing-card-design.png' },
              { value: 'yellow', label: 'Жёлтая', thumbnail: '/missing-card-design.png' },
              { value: 'platinum', label: 'Платиновая', thumbnail: '/missing-card-design.png' },
              { value: 'blue', label: 'Синяя', thumbnail: '/missing-card-design.png' },
            ],
          )}
          <figcaption>
            битые URL (404): плитки падают на инициалы, ошибки загрузки не видны
          </figcaption>
        </figure>
        <figure>
          ${thumbnailPicker(
            { defaultValue: 'black' },
            CARD_DESIGNS.map((option) =>
              option.value === 'platinum' ? { ...option, disabled: true } : option,
            ),
          )}
          <figcaption>«Платиновая» disabled: приглушена, стрелки пропускают, клик инертен</figcaption>
        </figure>
        <figure>
          ${thumbnailPicker({ disabled: true, defaultValue: 'black' })}
          <figcaption>disabled группа: 40% прозрачности, aria-disabled</figcaption>
        </figure>
        <figure>
          <tk-thumbnail-picker class="tkp-field tkp-field--narrow" .options=${[]}></tk-thumbnail-picker>
          <figcaption>пустое состояние: копия по умолчанию в слоте empty</figcaption>
        </figure>
        <figure>
          <tk-thumbnail-picker class="tkp-field tkp-field--narrow" .options=${null}>
            <span slot="empty">Дизайны карт временно недоступны</span>
          </tk-thumbnail-picker>
          <figcaption>пустое состояние: своя копия через slot="empty"</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** Live demo of the frozen §4 semantics on the string channel (mirrors the 2.3–2.5 stories). */
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
      <main class="tkp-canvas">
        <h1>Режимы value</h1>
        <p class="tkp-note">
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
          <tk-thumbnail-picker
            class="tkp-field"
            default-value="black"
            .options=${CARD_DESIGNS}
            label="Выберите дизайн карты"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkp-log-uncontrolled', `value-change → ${value}`);
            }}
          ></tk-thumbnail-picker>
          <pre class="tkp-log" id="tkp-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Без выбора: пустая сетка до первого касания</h2>
          <tk-thumbnail-picker
            class="tkp-field"
            .options=${CARD_DESIGNS}
            label="Выберите дизайн карты"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkp-log-empty', `value-change → ${value}`);
            }}
          ></tk-thumbnail-picker>
          <pre class="tkp-log" id="tkp-log-empty">—</pre>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Темизация</h1>
      <p class="tkp-note">
        Сетка темизуется только наследованием — переключите контрол Theme в
        тулбаре: лицо-инициалы перекрашивается через
        <code>--tk-color-text-primary</code> на
        <code>--tk-color-surface-field</code>, кольцо фокуса — через
        <code>--tk-color-focus-ring</code>. Кольцо выбора — ink-300,
        инвариантное теме (жёлтый держит чернильный — пара из DESIGN.md).
        Ни одной ветки темы в коде. Слоты перекрываются по грамматике
        <code>--tk-&lt;component&gt;-&lt;slot&gt;</code>:
        <code>--tk-thumbnail-picker-face-fill</code>,
        <code>--tk-thumbnail-picker-initials</code>,
        <code>--tk-thumbnail-picker-ring</code>,
        <code>--tk-thumbnail-picker-radius</code>,
        <code>--tk-thumbnail-picker-tile</code>.
      </p>
      <section class="tkp-panel">
        ${thumbnailPicker({ defaultValue: 'black' })}
        ${thumbnailPicker({ defaultValue: '' })}
      </section>
      <section class="tkp-panel tkp-panel--muted">
        ${thumbnailPicker({ defaultValue: 'green', label: 'Дизайн для подписки' })}
      </section>
      <section class="tkp-panel tkp-panel--bluegray">
        ${thumbnailPicker({ defaultValue: 'yellow', label: 'Дизайн детской карты' })}
      </section>
      <section class="tkp-panel tkp-panel--charcoal">
        ${thumbnailPicker({ defaultValue: 'red', label: 'Дизайн всех категорий' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Доступность</h1>
      <p class="tkp-note">
        Техника доступности (паттерн 2.4/2.5): нативные
        <code>&lt;input type="radio"&gt;</code> в теневом корне ОСТАЮТСЯ
        поверхностью взаимодействия и объявления — Пробел, клик по плитке,
        участие в форме и объявление checked/unchecked даёт платформа. Сетка
        несёт <code>role="radiogroup"</code>, её доступное имя — видимая
        подпись через aria-labelledby (или aria-label, если подписи нет);
        подпись — SPAN, не label[for] (урок 2.5: for конкатенирует текст
        группы в имя плитки). Каждая плитка названа своим лейблом: текст
        подписи скрыт визуально (в эталоне плитки — только рисунок), но
        остаётся в оборачивающем label. Стрелки проводятся явно
        (preventDefault + собственный переход), ПОСТРОЧНО по сетке: ←/→ —
        соседняя плитка (в конце строки → первая плитка следующей), ↓/↑ — та
        же колонка соседней строки, с переходом по циклу через края сетки;
        disabled-плитки пропускаются, выбор следует за фокусом. Roving
        tabindex: выбранная плитка tabindex=0, остальные −1; без выбора —
        первая доступная. Home/End сознательно отсутствуют (буква EXPERIENCE:
        только стрелки — то же решение, что в 2.5). Число колонок элемент
        выводит из отрисованной сетки в момент нажатия (кластеризация плиток
        по offsetTop) — без пропа columns. Форма: участие через
        <code>formAssociated</code> + ElementInternals — FormData получает
        name=value выбранной плитки, ничего — без выбора; form.reset()
        восстанавливает defaultValue. Ошибка загрузки thumbnail меняет лицо
        на инициалы без значка «сломанной картинки». Ноль опций — слот копии,
        инертный и без роли. Disabled: aria-disabled с сохранением фокуса,
        выбор заблокирован любым способом. Кольцо фокуса 2px
        (<code>--tk-color-focus-ring</code>, сдвиг 2px) никогда не убирается.
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
              Фокус входит на ВЫБРАННУЮ плитку (без выбора — на первую
              доступную) и покидает сетку естественно; кольцо фокуса 2px
              обводит плитку и не убирается.
            </td>
          </tr>
          <tr>
            <td><code>→</code></td>
            <td>
              Следующая плитка по строке; в конце строки — первая плитка
              следующей строки; с последней плитки — переход по циклу на
              первую. Фокус и выбор двигаются вместе; эмитится
              <code>value-change</code> (composed, bubbles,
              <code>detail: {'{'} value: string {'}'}</code>).
            </td>
          </tr>
          <tr>
            <td><code>←</code></td>
            <td>Предыдущая плитка по строке — то же правило зеркально.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code></td>
            <td>
              Та же колонка, следующая/предыдущая строка, с переходом по
              циклу через низ/верх сетки. Одна строка — no-op.
            </td>
          </tr>
          <tr>
            <td><code>Пробел</code> / <code>Enter</code></td>
            <td>
              Выбирает плитку под фокусом; уже выбранная — no-op (нативная
              семантика радио). Enter не отправляет форму.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «Выберите дизайн карты, группа радио»: имя плитки и
              состояние «выбран/не выбран»; disabled-плитка объявляется
              недоступной.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkp-row">
        ${thumbnailPicker({ defaultValue: 'black' })}
      </div>
    </main>
  `,
};
