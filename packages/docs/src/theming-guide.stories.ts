import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../components/src/button/button.js';
import '../../components/src/input/input.js';
import '../../components/src/promo-card/promo-card.js';

/**
 * Theming guide (spec 5.5): switching, per-token overrides, dark-mode pairing
 * rules — with live demos in both themes (the toolbar Theme control flips the
 * whole preview; the visual harness captures every demo in light and dark).
 *
 * The override demos set ONLY per-component channels
 * (`--tk-<component>-<slot>`, CONVENTIONS §6) and always to TOKEN values —
 * the page itself follows the zero-hard-coded rule (FR-1).
 *
 * RECORDED ADJUSTMENT: tk-button exposes NO per-component fill hooks (it
 * consumes semantic tokens directly) — the fill-channel demo uses the real
 * equivalents `--tk-input-fill` / `--tk-select-fill`, alongside the charcoal
 * card CTA pair (`--tk-promo-card-cta-fill` / `-text`).
 *
 * Content RU (OQ-4), story meta EN for baseline stability.
 */

const meta: Meta = {
  title: 'Theming Guide',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

const TOKENS_URL =
  'https://github.com/salacoste/tinkoff-ui-kit/blob/main/packages/tokens/src/TOKENS.md';

const pageStyles = html`
  <style>
    .tktg {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      /* Canvas follows the theme's base surface (the 5.4 dark-sweep rule). */
      background: var(--tk-color-surface-base);
    }
    .tktg h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tktg h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tktg p {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tktg ol,
    .tktg ul {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tktg li {
      margin: 0 0 var(--tk-space-8);
    }
    .tktg a {
      color: var(--tk-color-link);
    }
    .tktg code {
      font-family: var(--tk-font-body);
    }
    .tktg pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tktg .tktg-note {
      color: var(--tk-color-text-secondary);
    }
    .tktg .tktg-demo {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    .tktg .tktg-demo-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tktg .tktg-demo-row > * {
      flex: 0 1 320px;
    }
    .tktg .tktg-caption {
      margin: var(--tk-space-12) 0 0;
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
    }
    /* Charcoal pairs WHITE text (DESIGN Colors: the tint is theme-invariant,
       the pair on it is white — the promo-card precedent). */
    .tktg .tktg-demo--charcoal .tktg-caption {
      color: var(--tk-color-white);
    }
    .tktg td,
    .tktg th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
      vertical-align: top;
    }
  </style>
`;

/** A themed demo panel: the charcoal tint stays put in BOTH toolbar themes. */
function charcoalDemo(content: ReturnType<typeof html>) {
  return html`
    <div
      class="tktg-demo tktg-demo--charcoal"
      style="background: var(--tk-color-tint-charcoal); border-color: var(--tk-color-tint-charcoal)"
    >
      ${content}
    </div>
  `;
}

export const Switching: Story = {
  name: 'Переключение темы',
  render: () => html`
    ${pageStyles}
    <main class="tktg">
      <h1>Темизация — переключение</h1>
      <p class="tktg-note">
        Тема в ките — это один атрибут на корне документа. Ни правок разметки,
        ни классов, ни ветвлений в компонентах: семантические токены
        переопределяются слоем <code>[data-theme="dark"]</code>, и каждая
        поверхность перестраивается наследованием.
      </p>

      <h2>Порядок подключения</h2>
      <ol>
        <li>
          Токеновый лист подключается ОДИН раз на уровне документа — компоненты
          наследуют разрешённые значения в свои shadow root:
          <pre><code>import 'pillkit-tokens/tokens.css';</code></pre>
        </li>
        <li>
          Тема переключается атрибутом на <code>&lt;html&gt;</code>:
          <pre><code>&lt;html data-theme="dark"&gt;</code></pre>
        </li>
      </ol>
      <p class="tktg-note">
        Не внедряйте токеновый лист внутрь shadow root: светлый слой объявляет
        значения на <code>:host</code> и перебьёт унаследованные тёмные значения.
        Подробности — на странице «Начало работы».
      </p>

      <h2>Живая демонстрация</h2>
      <p>
        Переключите контрол Theme в тулбаре Storybook — эта страница и всё её
        содержимое перестроятся без единой правки разметки. Жёлтая кнопка
        сохраняет чернильный текст в обеих темах; тени в тёмной теме
        схлопываются в <code>none</code>.
      </p>
      <div class="tktg-demo">
        <div class="tktg-demo-row">
          <tk-button variant="primary" size="card">Продолжить</tk-button>
          <tk-button variant="secondary" size="card">Подробнее</tk-button>
        </div>
        <p class="tktg-caption">
          Светлая и тёмная темы одной и той же разметки; снимки обеих закреплены
          в визуальном baseline.
        </p>
      </div>
    </main>
  `,
};

export const Overrides: Story = {
  name: 'Переопределение токенов',
  render: () => html`
    ${pageStyles}
    <main class="tktg">
      <h1>Темизация — переопределение токенов</h1>
      <p class="tktg-note">
        Два уровня настройки: глобальные семантические токены (когда бренд
        меняет палитру целиком) и покомпонентные каналы (когда одну поверхность
        нужно увести от общего стиля). Шкалы никогда не переопределяются —
        компоненты читают семантику.
      </p>

      <h2>Семантический уровень</h2>
      <pre><code>:root {
  /* один токен — вся палитра ссылок в обеих темах */
  --tk-color-link: var(--tk-color-blue-300);
}</code></pre>
      <p class="tktg-note">
        Значением берётся токен, а не литерал — переопределение продолжает
        видеть тему: в тёмной теме слой по-прежнему управляет парами.
      </p>

      <h2>Покомпонентные каналы</h2>
      <p>
        Грамматика <code>--tk-&lt;component&gt;-&lt;slot&gt;</code> (CONVENTIONS
        §6): одно имя слота — одна роль во всех компонентах. Канал всегда имеет
        токен-умолчание, поэтому переопределяется точечно и без каскада.
      </p>

      <h3>Заливка поля — <code>--tk-input-fill</code></h3>
      <div class="tktg-demo">
        <div class="tktg-demo-row">
          <tk-input label="Сумма перевода" placeholder="1 331 ₽"></tk-input>
          <tk-input
            label="Сумма перевода"
            placeholder="1 331 ₽"
            style="--tk-input-fill: var(--tk-color-tint-bluegray)"
          ></tk-input>
        </div>
        <p class="tktg-caption">
          Слева умолчание (токен <code>surface-field</code>), справа канал
          переведён на другой тонированный токен — одним свойством, без
          обёрток.
        </p>
      </div>
      <pre><code>&lt;tk-input
  label="Сумма перевода"
  style="--tk-input-fill: var(--tk-color-tint-bluegray)"
&gt;&lt;/tk-input&gt;</code></pre>

      <h3>Пара CTA на charcoal-карточке</h3>
      <p>
        Каналы ходят ПАРАМИ, когда меняется заливка с текстом: заливка и цвет
        подписи задаются вместе, контраст проверяется по таблице AA.
      </p>
      ${charcoalDemo(html`
        <div class="tktg-demo-row">
          <tk-promo-card
            variant="charcoal"
            heading="Премиум"
            description="Белая пилюля на чернильном фоне — умолчание пары."
          >
            <tk-button slot="actions" variant="secondary" size="compact">
              Оформить
            </tk-button>
          </tk-promo-card>
          <tk-promo-card
            variant="charcoal"
            heading="Премиум"
            description="Та же пара, уведённая на жёлтый канал."
            style="--tk-promo-card-cta-fill: var(--tk-color-yellow-100); --tk-promo-card-cta-text: var(--tk-color-ink-300)"
          >
            <tk-button slot="actions" variant="secondary" size="compact">
              Оформить
            </tk-button>
          </tk-promo-card>
        </div>
        <p class="tktg-caption">
          Charcoal инвариантен в обеих темах — демо одинаково и в светлой, и в
          тёмной (проверьте контрол Theme).
        </p>
      `)}
      <pre><code>tk-promo-card[variant='charcoal'] {
  --tk-promo-card-cta-fill: var(--tk-color-yellow-100);
  --tk-promo-card-cta-text: var(--tk-color-ink-300);
}</code></pre>
      <p class="tktg-note">
        Полный перечень каналов каждого компонента — в jsdoc его стилевого
        модуля (<code>&lt;name&gt;.css.ts</code>) и на его странице API.
        Токен-умолчание каждого канала видно прямо в значении
        <code>var(--tk-…, var(--tk-…))</code>.
      </p>
    </main>
  `,
};

export const DarkPairing: Story = {
  name: 'Правила тёмной темы',
  render: () => html`
    ${pageStyles}
    <main class="tktg">
      <h1>Темизация — правила тёмной темы</h1>
      <p class="tktg-note">
        Тёмный слой переопределяет только семантические цвета. Три правила
        держат пары читаемыми без правок компонентов.
      </p>

      <h2>1. Тональная элевация вместо теней</h2>
      <p>
        Все <code>--tk-shadow-*</code> схлопываются в <code>none</code>;
        иерархию строят ступени поверхностей:
        <code>surface-base</code> → <code>surface-muted</code> → поля и
        тональные подложки. Не возвращайте тени в тёмной теме вручную.
      </p>
      <div class="tktg-demo">
        <div class="tktg-demo-row">
          <div
            style="padding: var(--tk-space-16); border-radius: var(--tk-radius-sm); background: var(--tk-color-surface-muted); width: 100%"
          >
            surface-muted над surface-base — ступень вместо тени
          </div>
        </div>
      </div>

      <h2>2. Инвариантные поверхности</h2>
      <ul>
        <li>
          <strong>Жёлтая заливка</strong> всегда несёт чернильный текст:
          <code>--tk-color-text-on-primary</code> не переопределяется тёмным
          слоем.
        </li>
        <li>
          <strong>Charcoal</strong> (<code>--tk-color-tint-charcoal</code>)
          остаётся чернильным в обеих темах; текст и CTA на нём — белой парой.
        </li>
        <li>
          Типографика, радиусы, отступы, моушен и z-шкала — один набор на обе
          темы.
        </li>
      </ul>
      ${charcoalDemo(html`
        <div class="tktg-demo-row">
          <tk-button variant="primary" size="card">Продолжить</tk-button>
          <tk-button variant="inverse" size="card">Открыть счёт</tk-button>
        </div>
        <p class="tktg-caption">
          Жёлтый с чернильным текстом и inverse-пилюля на чернильном фоне —
          одинаково в светлой и тёмной темах.
        </p>
      `)}

      <h2>3. Контраст по таблице AA</h2>
      <p>
        Пары светлой темы, не дотягивающие до 4.5:1, переопределены
        семантическими шагами (<code>text-secondary</code>,
        <code>link-on-tint</code>, <code>error-on-field</code>) — извлечённые
        шкалы при этом не тронуты. Тёмная пара строится из белых
        alpha-ступеней. Значения и коэффициенты — в
        <a href="${TOKENS_URL}" target="_blank" rel="noreferrer noopener"
          >TOKENS.md</a
        >
        и на странице «Token Reference»; механическая проверка пар живёт в
        тестах кита (<code>tests/contrast.test.ts</code>).
      </p>
      <table>
        <thead>
          <tr><th>Пара</th><th>Светлая</th><th>Тёмная</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Текст на базовой поверхности</td>
            <td><code>text-primary</code> на <code>surface-base</code></td>
            <td><code>text-primary</code> на <code>surface-base</code></td>
          </tr>
          <tr>
            <td>Ссылка</td>
            <td><code>link</code></td>
            <td><code>link</code> (переопределён синим для тёмного)</td>
          </tr>
          <tr>
            <td>Ссылка на подложке</td>
            <td><code>link-on-tint</code></td>
            <td><code>link-on-tint</code> (= <code>link</code>)</td>
          </tr>
          <tr>
            <td>Ошибка в поле</td>
            <td><code>error-on-field</code></td>
            <td><code>error-on-field</code> (светлее красный)</td>
          </tr>
          <tr>
            <td>Текст на жёлтой заливке</td>
            <td><code>text-on-primary</code></td>
            <td>инвариантно</td>
          </tr>
        </tbody>
      </table>
      <p class="tktg-note">
        При переопределении каналов придерживайтесь тех же правил: меняйте
        заливку и текст парой и оставайтесь в пределах токенов — тогда тёмная
        тема продолжает работать сама.
      </p>
    </main>
  `,
};
