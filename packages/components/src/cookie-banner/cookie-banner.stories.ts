import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './cookie-banner.js';

import type { TkCookieBanner } from './cookie-banner.js';

/**
 * tk-cookie-banner stories (spec 7.2): the reference playground (the live
 * DOM snapshot's own copy with the slotted privacy link), variants (long
 * message wrap, custom accept-label, empty slot), theming, and the a11y
 * notes — the Esc/outside NO-DISMISS ruling, the non-modal contract, the
 * full keyboard walkthrough + an SR-protocol section (maintainer-side
 * execution).
 *
 * Motion: NONE anywhere in the component (the frozen no-motion ruling — no
 * entrance, no transitions; recorded in NOTES.md/cookie-banner).
 *
 * DEMO MECHANIC (the modal-stories mold): the card is VIEWPORT-FIXED
 * bottom-left — several open cards would stack at the same spot. Every
 * variant/theming demo therefore renders its banner CLOSED and gives it a
 * «Показать» button; only the Playground opens one on load (the reference
 * look).
 *
 * NOTE for baseline readers: the open card is a TOP-LAYER surface —
 * `locator('body')` story baselines EXCLUDE it (the combobox-search/select
 * lesson). The open card's pixels + placement are covered by the dedicated
 * page-level clip spec in tests/visual/cookie-banner.spec.ts.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type CookieBannerArgs = {
  label: string;
  acceptLabel: string;
  open: boolean;
};

/** Opens the banner inside the demo `scope` element (its first tk-cookie-banner). */
const showBanner = (scope: EventTarget | null): void => {
  const holder = (scope as HTMLElement | null)?.closest('figure, section, .tkcb-block');
  const bannerEl = holder?.querySelector('tk-cookie-banner') as TkCookieBanner | null;
  if (bannerEl) bannerEl.open = true;
};

const showButton = html`
  <tk-button size="compact" @click=${(event: Event) => showBanner(event.currentTarget)}>Показать</tk-button>
`;

const canvasStyles = html`
  <style>
    .tkcb-canvas {
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
    .tkcb-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkcb-canvas .tkcb-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkcb-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkcb-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tkcb-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkcb-canvas td,
    .tkcb-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkcb-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkcb-canvas .tkcb-log {
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
    .tkcb-canvas .tkcb-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkcb-canvas .tkcb-block {
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
    }
    .tkcb-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkcb-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkcb-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkcb-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    /* The charcoal demo's caption must inherit the panel's white — the
    canvas-wide figcaption gray fails contrast on the dark tint (axe). */
    .tkcb-canvas .tkcb-panel--charcoal figcaption {
      color: inherit;
    }
  </style>
`;

const log = (id: string, line: string): void => {
  const pre = document.getElementById(id);
  if (pre) {
    pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
  }
};

const meta: Meta<CookieBannerArgs> = {
  title: 'Components/Cookie Banner',
  component: 'tk-cookie-banner',
  args: {
    label: 'Баннер согласия использования cookies',
    acceptLabel: 'Хорошо',
    open: false,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<CookieBannerArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkcb-canvas">
      <h1>Cookie Banner</h1>
      <p class="tkcb-note">
        Компактный НЕМОДАЛЬНЫЙ диалог согласия: карточка на модальном слое
        контроллера (top-layer), но без скрима, блокировки скролла и ловушки
        фокуса — страница позади остаётся интерактивной. Согласие —
        ПОЗИТИВНЫЙ акт: Esc и клик вне карточки НИЧЕГО не закрывают;
        единственный путь закрытия — потребитель переключает
        <code>open</code> после <code>consent-choice</code>. Хранилище —
        потребителя: компонент не трогает localStorage/cookie.
      </p>
      <div class="tkcb-actions">
        <tk-button
          size="compact"
          @click=${() => {
            const bannerEl = document.querySelector('main tk-cookie-banner') as TkCookieBanner | null;
            if (!bannerEl) return;
            bannerEl.open = !bannerEl.open;
            log('tkcb-log', `open → ${String(bannerEl.open)} (потребитель)`);
          }}
          >Показать / скрыть баннер</tk-button
        >
      </div>
      <pre class="tkcb-log" id="tkcb-log">—</pre>
      <tk-cookie-banner
        open
        @consent-choice=${() => {
          log('tkcb-log', 'consent-choice (компонент НЕ закрывает себя — закройте сами)');
        }}
        @open-change=${(event: CustomEvent<{ value: boolean }>) => {
          log('tkcb-log', `open-change → ${String(event.detail.value)}`);
        }}
        >Мы используем <a href="/privacy/" aria-label="Согласие на обработку данных">куки</a>,
        чтобы делать сайт удобным для вас</tk-cookie-banner
      >
      <p class="tkcb-note">
        Нажмите «Хорошо»: придёт только <code>consent-choice</code> — фокус
        останется на кнопке, карточка не исчезнет. Попробуйте Esc и клик по
        странице: ничего не произойдёт (записанное решение — см.
        «Доступность»).
      </p>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkcb-canvas">
      <h1>Варианты</h1>
      <p class="tkcb-note">
        Карточки открываются по одной (все они стоят в одной фиксированной
        точке — паттерн демо как у Modal). Карточка растёт вниз: ширина
        fit-content в пределах [180px, 212px] (потолок — измеренная ширина
        референса); длинные сообщения переносятся. Последний ряд —
        закрытое состояние: в дереве нет карточки, компонент невидим.
      </p>
      <figure>
        ${showButton}
        <tk-cookie-banner
          >Мы используем <a href="/privacy/">куки</a>, чтобы делать сайт удобным для
          вас</tk-cookie-banner
        >
        <figcaption>образец референса: сообщение со слотованной ссылкой + «Хорошо»</figcaption>
      </figure>
      <figure>
        ${showButton}
        <tk-cookie-banner accept-label="Хорошо, понятно"
          >Мы используем куки, чтобы делать сайт удобным для вас</tk-cookie-banner
        >
        <figcaption>свой текст кнопки (accept-label)</figcaption>
      </figure>
      <figure>
        ${showButton}
        <tk-cookie-banner
          >Мы используем файлы cookie, чтобы делать сайт удобным для вас. Продолжая
          пользоваться сайтом, вы соглашаетесь с
          <a href="/privacy/">политикой обработки данных</a>. Вы можете отозвать
          согласие в любой момент в настройках профиля.</tk-cookie-banner
        >
        <figcaption>длинное сообщение: перенос строк, потолок ширины 212px</figcaption>
      </figure>
      <figure>
        ${showButton}
        <tk-cookie-banner label="Использование cookie"></tk-cookie-banner>
        <figcaption>пустой слот: карточка не пустеет — имя + кнопка (§2)</figcaption>
      </figure>
      <figure>
        <tk-cookie-banner
          >Мы используем куки, чтобы делать сайт удобным для вас</tk-cookie-banner
        >
        <figcaption>закрыт (open=false): нечего показывать — карточки в дереве нет</figcaption>
      </figure>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkcb-canvas">
      <h1>Темизация</h1>
      <p class="tkcb-note">
        Баннер темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте — в тёмной теме тень схлопывается по
        токену (высота через тон поверхности, не тень). Слоты:
        <code>--tk-cookie-banner-fill</code>,
        <code>--tk-cookie-banner-radius</code>,
        <code>--tk-cookie-banner-max-width</code>,
        <code>--tk-cookie-banner-text</code>,
        <code>--tk-cookie-banner-gap</code>,
        <code>--tk-cookie-banner-accept-fill</code>,
        <code>--tk-cookie-banner-accept-text</code>,
        <code>--tk-cookie-banner-link</code>.
      </p>
      <section class="tkcb-panel tkcb-panel--hooks">
        ${showButton}
        <tk-cookie-banner
          >Мы используем <a href="/privacy/">куки</a>, чтобы делать сайт удобным для
          вас</tk-cookie-banner
        >
        <figcaption>перекрытие слотов: крем-фон, radius-xl, жёлтая пилюля с тёмным текстом</figcaption>
      </section>
      <section class="tkcb-panel tkcb-panel--muted">
        ${showButton}
        <tk-cookie-banner
          >Мы используем <a href="/privacy/">куки</a>, чтобы делать сайт удобным для
          вас</tk-cookie-banner
        >
        <figcaption>на muted-панели — карточка остаётся surface-base (слой выше)</figcaption>
      </section>
      <section class="tkcb-panel tkcb-panel--charcoal">
        ${showButton}
        <tk-cookie-banner>Мы используем куки, чтобы делать сайт удобным для вас</tk-cookie-banner>
        <figcaption>на тёмной панели — та же карточка, тема наследуется от html</figcaption>
      </section>
    </main>
    <style>
      .tkcb-panel--hooks {
        --tk-cookie-banner-fill: var(--tk-color-tint-cream);
        --tk-cookie-banner-radius: var(--tk-radius-xl);
        --tk-cookie-banner-accept-fill: var(--tk-color-yellow-100);
        --tk-cookie-banner-accept-text: var(--tk-color-ink-300);
        --tk-cookie-banner-link: var(--tk-color-link);
      }
    </style>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkcb-canvas">
      <h1>Доступность</h1>
      <p class="tkcb-note">
        Карточка — <code>role="dialog"</code> с именем через
        <code>aria-label</code> (по умолчанию «Баннер согласия использования
        cookies»); <code>aria-modal</code> ОТСУТСТВУЕТ намеренно: диалог
        НЕМОДАЛЬНЫЙ. Нет скрима, блокировки скролла и ловушки фокуса — Tab
        уходит в страницу естественным порядком. Мишень кнопки ≥44×44
        (невидимые поля вокруг видимой пилюли ~32px — паттерн navbar);
        кольцо фокуса — единый токен 2px. Ссылка в сообщении — обычный
        якорь: цвет через слот <code>--tk-cookie-banner-link</code>
        (text-secondary), подчёркивание только при наведении/фокусе.
      </p>

      <h2>Записанное решение: Esc и клик вне НЕ закрывают</h2>
      <p class="tkcb-note">
        Согласие — ПОЗИТИВНЫЙ акт: молчаливое или случайное закрытие не
        должно выглядеть отказом. Esc перехватывается с
        <code>preventDefault</code> (нажатие «потреблено» контрактом
        баннера), но состояние не меняется и <code>open-change</code> не
        приходит; клик/pointerdown вне карточки вообще не слушается.
        Единственный путь — «Хорошо» → <code>consent-choice</code> →
        потребитель закрывает, переключив <code>open</code> (и сохранив
        выбор в СВОЁМ хранилище — компонент про хранение ничего не знает).
      </p>

      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Открытие (<code>open</code>)</td>
            <td>Фокус переходит на «Хорошо» — естественное следующее действие.</td>
          </tr>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Естественный порядок: сообщение-ссылка → «Хорошо» → страница.
              Цикла НЕТ (диалог немодальный, ловушки нет).
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> на «Хорошо»</td>
            <td>
              <code>consent-choice</code>; фокус остаётся на кнопке, карточка
              не закрывается сама.
            </td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>
              <code>preventDefault</code>, НИЧЕГО не закрывается,
              <code>open-change</code> не приходит.
            </td>
          </tr>
          <tr>
            <td>Закрытие (<code>open=false</code>)</td>
            <td>
              Фокус возвращается на элемент, бывший до открытия (пока он в
              дереве и фокус был внутри баннера).
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Баннер согласия использования cookies, диалог»; кнопка — «Хорошо, кнопка».</td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkcb-note">
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
            <td>Открытие баннера</td>
            <td>«Баннер согласия использования cookies, диалог»; фокус на кнопке: «Хорошо, кнопка»</td>
          </tr>
          <tr>
            <td>Shift+Tab на ссылку</td>
            <td>«Согласие на обработку данных, ссылка» (aria-label якоря)</td>
          </tr>
          <tr>
            <td>Enter на «Хорошо»</td>
            <td>«Хорошо, кнопка» — нажатие; объявлений закрытия НЕТ (баннер сам не закрывается)</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>Изменений нет — объявления закрытия отсутствуют, фокус на кнопке</td>
          </tr>
        </tbody>
      </table>

      <div class="tkcb-block">
        ${showButton}
        <tk-cookie-banner
          >Мы используем <a href="/privacy/" aria-label="Согласие на обработку данных">куки</a>,
          чтобы делать сайт удобным для вас</tk-cookie-banner
        >
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-cookie-banner'),
};
