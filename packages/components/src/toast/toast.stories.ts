import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './toast.js';
import { showToast } from './show.js';
import type { TkToast } from './toast.js';

/**
 * tk-toast stories (spec 4.3): playground + the STACK state (the baseline
 * story — sticky toasts so the capture is deterministic), variants (THREE
 * static toasts: default, with action, destructive), the overflow story
 * (4 sticky toasts — the oldest collapses on the 4th connect), the
 * imperative showToast demo (interactive-only — nothing renders until
 * clicked, so the baseline stays deterministic), theming (showToast-driven —
 * the stack is ALWAYS fixed bottom-right), and the a11y notes.
 *
 * Stack determinism: every STATICALLY rendered toast in these stories uses
 * `duration="0"` (sticky) — an auto-dismissing toast could vanish mid-capture.
 * The imperative demo fires real 5000ms toasts on click only.
 *
 * Motion: entrance slide-up+fade 150ms fast productive-entrance; exit 150ms
 * productive-exit then self-removal. Under prefers-reduced-motion the token
 * layer collapses durations and the sheet's belt kills the keyframes.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type ToastArgs = {
  variant: 'default' | 'destructive';
  duration: number;
};

const toast = (args: Partial<ToastArgs> = {}, message: string, actionLabel?: string) => {
  const { variant, duration } = args;
  const el = document.createElement('tk-toast') as TkToast;
  el.className = 'tkt-toast';
  el.setAttribute('duration', String(duration ?? 0));
  if (variant) el.setAttribute('variant', variant);
  el.append(message);
  if (actionLabel) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = actionLabel;
    button.setAttribute('slot', 'action');
    el.append(button);
  }
  return el;
};

const canvasStyles = html`
  <style>
    .tkt-canvas {
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
    .tkt-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkt-canvas .tkt-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkt-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      align-items: flex-start;
    }
    .tkt-canvas .tkt-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkt-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      align-items: flex-start;
    }
    .tkt-canvas figcaption {
      max-width: 420px;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas td,
    .tkt-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkt-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkt-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkt-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkt-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

/** The stack demo block (sticky toasts — deterministic captures). */
const stackBlock = () => html`
  <div class="tkt-stack-demo">
    <tk-toast duration="0">Заявка отправлена. Менеджер свяжется с вами</tk-toast>
    <tk-toast duration="0">Копия ссылки создана
      <button slot="action" type="button">Открыть</button></tk-toast
    >
    <tk-toast duration="0" variant="destructive">Не удалось сохранить изменения</tk-toast>
  </div>
`;

const meta: Meta<ToastArgs> = {
  title: 'Components/Toast',
  component: 'tk-toast',
  args: { variant: 'default', duration: 0 },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ToastArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Toast</h1>
      <p class="tkt-note">
        Уведомление-карточка: surface-base, radius-lg, тень --tk-shadow-default,
        паддинг 16/20, иконка + сообщение + опциональное действие. Элемент
        сам зачисляет себя в общий стек справа внизу (слой toast, z 600,
        максимум 3 видимых — старейший сворачивается). Авто-скрытие 5с
        по умолчанию (0 — липкий), пауза при наведении/фокусе; Esc закрывает
        самое новое, фокус никогда не крадётся.
      </p>
      <div class="tkt-row">
        <tk-button
          size="compact"
          variant="primary"
          @click=${() =>
            showToast({ message: 'Заявка отправлена. Менеджер свяжется с вами' })}
          >Показать тост (5с)</tk-button
        >
        <tk-button
          size="compact"
          @click=${() =>
            showToast({
              message: 'Не удалось сохранить изменения',
              variant: 'destructive',
              duration: 0,
            })}
          >Деструктивный (липкий)</tk-button
        >
        <tk-button
          size="compact"
          @click=${() =>
            showToast({
              message: 'Копия ссылки создана',
              duration: 0,
              action: { label: 'Открыть' },
            })}
          >С действием (липкий)</tk-button
        >
      </div>
    </main>
  `,
};

/**
 * The STACK story (the baseline/axe story): three STICKY toasts of every
 * variant — statically rendered, self-enqueued into #tk-toast-stack on
 * connect. The body-locator baseline cannot see the top-layer stack; the
 * page-level capture lives in tests/visual/toast.spec.ts.
 */
export const Stack: Story = {
  name: 'Стек (базлайн/axe)',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Toast — стек</h1>
      <p class="tkt-note">
        Три липких тоста (duration 0) в общем стеке справа внизу: обычный,
        с действием и деструктивный. Максимум 3 видимых — четвёртый
        сворачивает старейший (см. Песочницу).
      </p>
      ${stackBlock()}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Варианты</h1>
      <p class="tkt-note">
        Обычный — aria-live="polite" и галочка успеха; деструктивный —
        role="alert" (намекающий на assertive) и глиф ошибки. Действие —
        один интерактивный элемент в слоте action: его нативный клик —
        потребительский, тост остаётся до истечения срока или dismiss.
      </p>
      <div class="tkt-row">
        <figure>
          ${toast({}, 'Заявка отправлена. Менеджер свяжется с вами')}
          <figcaption>default: polite, галочка (green-200 — AA non-text)</figcaption>
        </figure>
        <figure>
          ${toast({}, 'Не удалось сохранить изменения', 'Повторить')}
          <figcaption>default с действием (клик — потребительский)</figcaption>
        </figure>
        <figure>
          ${toast({ variant: 'destructive' }, 'Платёж не прошёл')}
          <figcaption>destructive: role=alert, глиф ошибки (error)</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The OVERFLOW story: FOUR sticky toasts rendered statically — the 4th
 * connect collapses the OLDEST (max 3 visible). Under the pinned capture
 * env (reducedMotion: reduce) the collapse is instant, so the baseline
 * records exactly the three survivors; with motion the oldest plays its
 * exit and leaves — the same end state.
 */
export const Overflow: Story = {
  name: 'Переполнение стека (максимум три)',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Переполнение стека</h1>
      <p class="tkt-note">
        В общем стеке видно максимум ТРИ уведомления. Здесь отрисованы
        четыре: в момент подключения четвёртого очередь сворачивает СТАРЕЙШЕЕ
        — при включённых анимациях оно проигрывает выход и уходит, при
        prefers-reduced-motion исчезает сразу. Остаются три живых тоста;
        следующий опять вытеснит старейшее из них.
      </p>
      <div class="tkt-row">
        <tk-toast duration="0">Первое — будет вытеснено</tk-toast>
        <tk-toast duration="0">Второе — остаётся</tk-toast>
        <tk-toast duration="0">Третье — остаётся</tk-toast>
        <tk-toast duration="0">Четвёртое — прибывает последним и вытесняет первое</tk-toast>
      </div>
    </main>
  `,
};

export const Imperative: Story = {
  name: 'Императивный showToast',
  render: () => {
    const handles: Array<{ dismiss(): void }> = [];
    return html`
      ${canvasStyles}
      <main class="tkt-canvas">
        <h1>Императивный помощник</h1>
        <p class="tkt-note">
          <code>showToast(options)</code> — единственный санкционированный
          императивный оверлей-паттерн (§9): строит ТОТ ЖЕ tk-toast, ставит
          пропы, вкладывает сообщение и действие слотами и возвращает
          <code>{ dismiss() }</code>. Декларативный вид — тот же элемент:
          положите <code>&lt;tk-toast&gt;</code> куда угодно, он сам переедет
          в общий стек.
        </p>
        <div class="tkt-row">
          <tk-button
            size="compact"
            variant="primary"
            @click=${() => {
              handles.push(
                showToast({
                  message: `Тост №${handles.length + 1} — 5 секунд, пауза при наведении`,
                }),
              );
            }}
            >showToast (5с)</tk-button
          >
          <tk-button
            size="compact"
            @click=${() => {
              handles.push(
                showToast({
                  message: 'Ссылка скопирована',
                  duration: 0,
                  action: {
                    label: 'Открыть',
                    onClick: () => undefined, // the consumer's own handler — demo no-op
                  },
                }),
              );
            }}
            >showToast c действием (липкий)</tk-button
          >
          <tk-button
            size="compact"
            @click=${() => handles.splice(0).forEach((handle) => handle.dismiss())}
            >dismiss все</tk-button
          >
        </div>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Темизация</h1>
      <p class="tkt-note">
        Карточка темизуется токенами (переключите контрол Theme): surface-base,
        в тёмной теме тень схлопывается в тон, текст — белый. Слоты:
        <code>--tk-toast-fill</code>, <code>--tk-toast-radius</code>,
        <code>--tk-toast-icon</code>. Стек ВСЕГДА фиксирован в правом нижнем
        углу вьюпорта — независимо от того, где в разметке находится триггер
        или сам элемент: тонированные панели ниже задают только КОНТЕКСТ
        триггера, тост из них не «вырастает».
      </p>
      <section class="tkt-panel">
        <tk-button
          size="compact"
          variant="primary"
          @click=${() =>
            showToast({ message: 'Из базового контекста — 5с', duration: 5000 })}
          >Из базового контекста</tk-button
        >
      </section>
      <section class="tkt-panel tkt-panel--muted">
        <tk-button
          size="compact"
          @click=${() =>
            showToast({
              message: 'Из приглушённого контекста — всё равно вправо вниз',
              duration: 5000,
              variant: 'destructive',
            })}
          >Деструктивный из приглушённого</tk-button
        >
      </section>
      <section class="tkt-panel tkt-panel--charcoal">
        <tk-button
          size="compact"
          variant="inverse"
          @click=${() =>
            showToast({
              message: 'Из тёмного контекста — стек не меняет позицию',
              duration: 5000,
            })}
          >Из тёмного контекста</tk-button
        >
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Доступность</h1>
      <p class="tkt-note">
        Обычный тост — <code>aria-live="polite"</code>: вежливое объявление
        без перебивания; деструктивный — <code>role="alert"</code> (assertive
        по умолчанию). Тост НИКОГДА не берёт фокус: ни tabindex, ни focus() —
        действие в слоте фокусируется обычным Tab-порядком, когда тост уже
        объявлен. Esc закрывает самое новое уведомление. Наведение или фокус
        (например, на кнопке действия) ставит таймер на паузу — можно дочитать.
        Иконка — aria-hidden, объявляется только текст. Анимации — только
        motion-токены, 0ms при prefers-reduced-motion.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Действие</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>появление тоста</td>
            <td>
              Фокус НЕ двигается; скринридер вежливо объявляет текст
              (destructive — немедленно, alert).
            </td>
          </tr>
          <tr>
            <td><code>Tab</code> к действию</td>
            <td>
              Кнопка действия достижима обычным порядком; таймер на паузе,
              пока фокус внутри тоста.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> на действии</td>
            <td>Нативный клик — обработчик потребителя; тост остаётся.</td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>Закрывается самое новое уведомление; фокус не трогается.</td>
          </tr>
          <tr>
            <td>наведение</td>
            <td>Таймер на паузе; уход курсора — возобновление остатка.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkt-row">
        <tk-button
          size="compact"
          variant="primary"
          @click=${() =>
            showToast({
              message: 'Уведомление доступности — 5 секунд, пауза при наведении',
            })}
          >Показать (5с)</tk-button
        >
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkt-note">
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
            <td>Появление тоста</td>
            <td>фокус НЕ смещается; текст зачитывается вежливо: «Заявка отправлена…» (aria-live polite)</td>
          </tr>
          <tr>
            <td>Destructive-вариант</td>
            <td>роль alert — объявление перебивает текущее высказывание</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>новейший тост закрывается; фокус остаётся там, где был</td>
          </tr>
          <tr>
            <td>Кнопка действия</td>
            <td>«Открыть, кнопка» — достижима по Tab внутри тоста</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-toast'),
};
