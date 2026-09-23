import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './modal.js';
import type { TkModal } from './modal.js';

/**
 * tk-modal stories (spec 4.1): playground (trigger-driven open/close through
 * the frozen §9 element API), the OPEN state (the baseline/axe story —
 * rendered statically via `<tk-modal open>`), variants (with/without
 * heading, long scrolling body, the DESTRUCTIVE confirm story pattern), the
 * open channel live (open-change log), one-level nesting, theming, and the
 * a11y notes with the FULL keyboard checklist.
 *
 * Motion: entrance = scrim fade + panel opacity/translateY on the 300ms
 * moderate productive-entrance token; exit = 150ms fast productive-exit,
 * then the mount releases. Under prefers-reduced-motion the token layer
 * collapses durations to 0ms and the sheet's belt kills the keyframes.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type ModalArgs = {
  heading: string;
};

const openFrom = (event: Event, selector: string): void => {
  const scope = (event.currentTarget as HTMLElement).closest(selector);
  const modalEl = scope?.querySelector('tk-modal') as TkModal | null;
  if (modalEl) modalEl.open = true;
};

const canvasStyles = html`
  <style>
    .tkm-canvas {
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
    .tkm-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkm-canvas .tkm-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkm-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkm-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      align-items: flex-start;
    }
    .tkm-canvas .tkm-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-16);
    }
    .tkm-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      align-items: flex-start;
    }
    .tkm-canvas figcaption {
      max-width: 420px;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkm-canvas td,
    .tkm-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkm-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkm-canvas .tkm-log {
      box-sizing: border-box;
      margin: 0;
      min-height: 3em;
      max-width: var(--tk-space-container);
      padding: var(--tk-space-8) var(--tk-space-12);
      overflow: auto;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-sm);
      white-space: pre-wrap;
    }
    .tkm-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkm-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkm-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<ModalArgs> = {
  title: 'Components/Modal',
  component: 'tk-modal',
  args: { heading: 'Подтвердите действие' },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ModalArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Modal</h1>
      <p class="tkm-note">
        Диалоговое окно через оверлей-контроллер: слой modal (z 500), scrim —
        ink-400 52% (color-mix), панель surface-base, radius-lg, тень
        --tk-shadow-modal, max-width 480 (10×48), паддинг 32. Скролл тела
        заблокирован (refcounted), фокус заперт в панели (Tab/Shift+Tab по
        кругу) и возвращается на кнопку-открывалку при закрытии. Esc и клик
        по затемнению закрывают; клики по панели — никогда.
      </p>
      <section>
        <tk-button variant="primary" @click=${(event: Event) => openFrom(event, 'main')}
          >Открыть диалог</tk-button
        >
        <tk-modal class="tkm-modal" .heading=${args.heading ?? 'Подтвердите действие'}
          >Перевод с карты •• 4581 на карту •• 7732. Комиссия не взимается.</tk-modal
        >
      </section>
    </main>
  `,
};

/**
 * The OPEN-state story: static `<tk-modal open>` — the frozen §9 declarative
 * surface (the select Open-story mold). No play functions: the surface
 * mounts through the overlay controller on first update, so the page-level
 * capture (tests/visual/modal.spec.ts) and axe see the open dialog.
 */
export const Open: Story = {
  name: 'Открытое окно (базлайн/axe)',
  render: () => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Modal — открытое окно</h1>
      <p class="tkm-note">
        Панель по центру вьюпорта, заголовок именует диалог
        (aria-labelledby, id внутри одного shadow-дерева), начальный фокус —
        на первой кнопке действий.
      </p>
      <tk-modal class="tkm-modal" open heading="Перевести 10 000 ₽?">
        <p>Перевод с карты •• 4581 на карту •• 7732. Комиссия не взимается.</p>
        <tk-button slot="actions" size="compact" variant="secondary">Отмена</tk-button>
        <tk-button slot="actions" size="compact" variant="primary">Перевести</tk-button>
      </tk-modal>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Варианты</h1>
      <p class="tkm-note">
        Заголовок опционален (без него диалог получает имя по умолчанию
        «Диалог»); длинное тело скроллится внутри панели
        (overscroll-behavior: contain — митигация momentum-скролла iOS);
        деструктивное подтверждение — СТОРИ-ПАТТЕРН: явная кнопка в слоте
        actions, dismiss никогда её не нажимает.
      </p>
      <div class="tkm-row">
        <figure>
          <tk-button size="compact" @click=${(event: Event) => openFrom(event, 'figure')}
            >С заголовком</tk-button
          >
          <tk-modal class="tkm-modal" heading="Заголовок диалога">Короткое тело.</tk-modal>
          <figcaption>с заголовком — aria-labelledby на заголовок</figcaption>
        </figure>
        <figure>
          <tk-button size="compact" @click=${(event: Event) => openFrom(event, 'figure')}
            >Без заголовка</tk-button
          >
          <tk-modal class="tkm-modal">Тело без заголовка — имя «Диалог».</tk-modal>
          <figcaption>без заголовка — имя по умолчанию (AA name gate)</figcaption>
        </figure>
        <figure>
          <tk-button size="compact" @click=${(event: Event) => openFrom(event, 'figure')}
            >Длинное тело</tk-button
          >
          <tk-modal class="tkm-modal" heading="Условия программы лояльности"
            >${Array.from(
              { length: 12 },
              (_, i) =>
                html`<p>
                  Раздел ${i + 1}. Условия предоставления бонусов и порядок их
                  начисления описаны в общих правилах программы.
                </p>`,
            )}</tk-modal
          >
          <figcaption>длинное тело: внутренний скролл панели, contain</figcaption>
        </figure>
        <figure>
          <tk-button
            size="compact"
            variant="primary"
            @click=${(event: Event) => openFrom(event, 'figure')}
            >Деструктивное</tk-button
          >
          <tk-modal class="tkm-modal" heading="Удалить карту?">
            Действие необратимо. Все данные карты будут удалены.
            <tk-button slot="actions" size="compact" variant="secondary">Отмена</tk-button>
            <tk-button slot="actions" size="compact" variant="primary">Удалить</tk-button>
          </tk-modal>
          <figcaption>
            destructive — стори-паттерн: явная кнопка «Удалить» в actions
          </figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const OpenChannel: Story = {
  name: 'Канал open (замороженный §9)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };
    return html`
      ${canvasStyles}
      <main class="tkm-canvas">
        <h1>Канал open</h1>
        <p class="tkm-note">
          Тот же канал, что у Select (замороженный §9): состояние —
          <code>open</code> (атрибут/свойство), событие —
          <code>open-change</code> с <code>detail: { value }</code>.
          <code>open-change(true)</code> приходит после монтирования,
          <code>open-change(false)</code> — после анимации закрытия и
          снятия блокировки скролла.
        </p>
        <section>
          <div style="display: flex; gap: var(--tk-space-12); align-items: center">
            <tk-button
              size="compact"
              @click=${(event: Event) => {
                const modalEl = (event.currentTarget as HTMLElement)
                  .closest('section')
                  ?.querySelector('tk-modal') as TkModal | null;
                if (modalEl) modalEl.open = !modalEl.open;
              }}
              >Переключить open</tk-button
            >
            <span>лог open-change ниже</span>
          </div>
          <tk-modal
            class="tkm-modal"
            heading="Канал open"
            @open-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: boolean }>).detail;
              log('tkm-log', `open-change → ${value}`);
            }}
            >Неконтролируемое состояние живёт внутри элемента.</tk-modal
          >
          <pre class="tkm-log" id="tkm-log">—</pre>
        </section>
      </main>
    `;
  },
};

export const Nesting: Story = {
  name: 'Один уровень вложенности',
  render: () => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Вложенность (один уровень)</h1>
      <p class="tkm-note">
        Второе окно поверх первого: внутренняя панель держит свой фокус-капкан
        (LIFO), оба скролл-лока удерживаются refcount-ом, закрытие внутреннего
        возвращает фокус во внешнее. Глубже одного уровня не поддерживается.
      </p>
      <section>
        <tk-button variant="primary" @click=${(event: Event) => openFrom(event, 'section')}
          >Открыть внешнее окно</tk-button
        >
        <tk-modal class="tkm-modal" heading="Внешнее окно">
          <p>Первый уровень. Следующий шаг подтверждается вложенным окном.</p>
          <tk-button
            slot="actions"
            size="compact"
            @click=${(event: Event) => openFrom(event, 'tk-modal')}
            >Продолжить</tk-button
          >
          <tk-modal class="tkm-modal" heading="Внутреннее окно">
            Подтвердите переход.
            <tk-button slot="actions" size="compact" variant="primary">Да, продолжить</tk-button>
          </tk-modal>
        </tk-modal>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Темизация</h1>
      <p class="tkm-note">
        Панель темизуется токенами (переключите контрол Theme): surface-base в
        светлой теме — белый, в тёмной — тональная база, разделение даёт scrim.
        Слоты: <code>--tk-modal-fill</code>, <code>--tk-modal-radius</code>,
        <code>--tk-modal-width</code>, <code>--tk-modal-scrim</code>.
      </p>
      <section class="tkm-panel">
        <tk-button size="compact" @click=${(event: Event) => openFrom(event, 'section')}
          >На базовой поверхности</tk-button
        >
        <tk-modal class="tkm-modal" heading="Диалог"
          >Тело на базовой поверхности.</tk-modal
        >
      </section>
      <section class="tkm-panel tkm-panel--muted">
        <tk-button size="compact" @click=${(event: Event) => openFrom(event, 'section')}
          >На приглушённой</tk-button
        >
        <tk-modal class="tkm-modal" heading="Диалог"
          >Тело на приглушённой поверхности.</tk-modal
        >
      </section>
      <section class="tkm-panel tkm-panel--charcoal">
        <tk-button
          size="compact"
          variant="inverse"
          @click=${(event: Event) => openFrom(event, 'section')}
          >С усиленным scrim</tk-button
        >
        <tk-modal
          class="tkm-modal"
          heading="Свой scrim"
          style="--tk-modal-scrim: color-mix(in srgb, var(--tk-color-ink-400) 70%, transparent)"
          >Scrim усилен через --tk-modal-scrim.</tk-modal
        >
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkm-canvas">
      <h1>Доступность</h1>
      <p class="tkm-note">
        Панель — <code>role="dialog"</code> + <code>aria-modal="true"</code>,
        имя через <code>aria-labelledby</code> на заголовок (id внутри одного
        shadow-дерева поверхности; без заголовка — имя «Диалог»). Фокус
        запирается в панели (Tab/Shift+Tab по кругу, вложенность LIFO) и
        возвращается на открывалку при закрытии. Esc и клик по scrim
        закрывают; фокус никогда не крадётся. Панель —
        <code>tabindex="-1"</code>: начальный фокус, когда в окне нет
        фокусируемых элементов (и focusable-скролл-область для axe).
        Анимации — только motion-токены, 0ms при prefers-reduced-motion.
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
              Цикл внутри панели: с последней кнопки — на первую, с первой —
              на последнюю; фокус не покидает окно, пока оно открыто.
            </td>
          </tr>
          <tr>
            <td>открывалка</td>
            <td>
              Начальный фокус — первый фокусируемый элемент панели (кнопки
              действий); при отсутствии фокусируемых — сама панель.
            </td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>
              Закрывает: exit-анимация 150ms, снятие блокировки скролла,
              возврат фокуса на кнопку-открывалку. Действие в окне НЕ
              выполняется.
            </td>
          </tr>
          <tr>
            <td>клик по затемнению</td>
            <td>Закрывает; клики по панели и её содержимому — никогда.</td>
          </tr>
          <tr>
            <td>вложенное окно</td>
            <td>
              Внутреннее держит свой капкан; Esc закрывает только самое новое
              окно; закрытие внутреннего возвращает фокус во внешнее.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              «Заголовок, диалог, модальное»; содержимое читается по порядку:
              заголовок → тело → кнопки.
            </td>
          </tr>
        </tbody>
      </table>
      <section>
        <tk-button variant="primary" @click=${(event: Event) => openFrom(event, 'section')}
          >Открыть диалог</tk-button
        >
        <tk-modal class="tkm-modal" heading="Проверка доступности"
          >Tab по кнопкам действий ниже.</tk-modal
        >
      </section>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkm-note">
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
            <td>Открытие (Enter на триггере)</td>
            <td>«Перевести 10 000 ₽?, диалог» — фокус внутри; фон не читается</td>
          </tr>
          <tr>
            <td>Tab внутри</td>
            <td>цикл по кнопкам действий: «Отмена, кнопка» → «Перевести, кнопка» — выхода из диалога нет</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>диалог закрывается; фокус и объявление возвращаются на триггер</td>
          </tr>
          <tr>
            <td>Скролл-лок</td>
            <td>страница за диалогом не скроллится и не читается жестами</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-modal'),
};
