import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './navbar.js';
import type { TkNavbarLink } from './navbar.js';

/**
 * tk-navbar stories (spec 3.4): playground (the reference header
 * composition), active-link states, the viewport-forced mobile-burger demo
 * (a 375px embedded preview — media queries answer to the IFRAME's
 * viewport, so the burger shows inside it at any canvas width), theming
 * (hooks + dark toolbar), and the a11y notes with the keyboard-only
 * checklist.
 *
 * Motion: the scrolled shadow fades over the 150ms token (instant under
 * reduced motion — the token layer collapses durations); the drawer
 * entrance runs the productive-entrance curve and is explicitly disabled
 * under reduced motion. The bar never animates anything else.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

/** The reference nav (tbank.ru capture navbar-desktop.png): 4 sections. */
const LINKS: TkNavbarLink[] = [
  { value: 'retail', label: 'Частным лицам', href: '#retail' },
  { value: 'business', label: 'Бизнесу', href: '#business' },
  { value: 'premium', label: 'Премиум', href: '#premium' },
  { value: 'more', label: 'Еще', href: '#more' },
];

type NavbarArgs = {
  activeValue: string;
  sticky: boolean;
  burgerLabel: string;
};

/** The brand mark for the logo slot — story-level composition (tokens only). */
const logoSlot = html`
  <span slot="logo" class="tkn-logo" aria-hidden="true">
    <span class="tkn-logo__shield">Т</span>
  </span>
`;

/** The reference utility cluster for the utilities slot — story-level composition. */
const utilitiesSlot = html`
  <a slot="utilities" class="tkn-utility" href="#search" aria-label="Поиск">
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5"></circle>
      <path d="M15.5 15.5L21 21"></path>
    </svg>
  </a>
  <a slot="utilities" class="tkn-utility tkn-utility--account" href="#login">
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M4.5 20.5c1.8-3.4 4.4-5 7.5-5s5.7 1.6 7.5 5z"></path>
    </svg>
    Личный кабинет
  </a>
`;

const navbarCanvas = (args: Partial<NavbarArgs> = {}) => html`
  <tk-navbar
    .links=${LINKS}
    .activeValue=${args.activeValue ?? 'retail'}
    ?sticky=${args.sticky ?? true}
    burger-label=${args.burgerLabel ?? 'Меню'}
  >
    ${logoSlot} ${utilitiesSlot}
  </tk-navbar>
`;

const canvasStyles = html`
  <style>
    .tkn-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: 0 0 var(--tk-space-32);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkn-canvas main {
      padding: 0 var(--tk-space-24);
    }
    .tkn-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkn-canvas .tkn-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkn-canvas h2 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkn-canvas .tkn-demo {
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-block: var(--tk-space-24);
    }
    .tkn-canvas .tkn-demo p {
      margin: 0 0 var(--tk-space-12);
      max-width: 560px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkn-canvas td,
    .tkn-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkn-canvas code {
      font-family: var(--tk-font-body);
    }
    /* The story-composed brand mark (logo slot content). */
    .tkn-logo {
      display: inline-flex;
    }
    .tkn-logo__shield {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-ink-400);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-1-weight);
      line-height: 1;
    }
    /* The story-composed utility cluster (utilities slot content): ≥44px
       targets with the unified focus ring; on mobile the reference chips
       them (round search, login pill) — the story's own media query. */
    .tkn-utility {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      min-height: 44px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .tkn-utility:hover {
      color: var(--tk-color-text-secondary);
    }
    .tkn-utility:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    /* The reference's mobile utility chips: round search button + login
       pill in surface-muted (the story's own breakpoint — the component's
       burger flip owns the same query). */
    @media (max-width: 767px) {
      .tkn-utility {
        justify-content: center;
        width: 44px;
        padding: 0;
        border-radius: var(--tk-radius-full);
        background: var(--tk-color-surface-muted);
      }
      /* The reference's mobile cluster order: login pill → search chip →
         burger; the pill is text-only (the desktop-only person icon drops
         so the row fits 360px with the burger intact). */
      .tkn-utility--account {
        order: -1;
        width: auto;
        padding-inline: var(--tk-space-16);
        border-radius: var(--tk-radius-full);
        font-size: var(--tk-text-body-s-size);
      }
      .tkn-utility--account svg {
        display: none;
      }
    }
    /* The viewport-forced frames: a nested 375px preview. Media queries
       answer to the IFRAME's viewport, so the burger + 56px bar render
       inside the frame at any canvas width. */
    .tkn-frame {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      margin: 0;
      padding: 0;
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      overflow: hidden;
      background: var(--tk-color-surface-base);
    }
    .tkn-frame__view {
      display: block;
      width: 375px;
      border: none;
      opacity: 0;
    }
    .tkn-frame__view.tkn-frame__view--ready {
      opacity: 1;
    }
    .tkn-frame__open {
      display: block;
      width: 375px;
      height: 480px;
    }
    .tkn-canvas figcaption {
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta<NavbarArgs> = {
  title: 'Components/Navbar',
  component: 'tk-navbar',
  args: {
    activeValue: 'retail',
    sticky: true,
    burgerLabel: 'Меню',
  },
  argTypes: {
    activeValue: {
      control: 'text',
      description:
        'Активная секция: жёлтый подчёркивающий штрих + вес 700 (правило избыточности). Значение вне links ничего не помечает — это навигация, а не переключатель.',
    },
    sticky: { control: 'boolean', description: 'Липкая шапка (по умолчанию включена).' },
    burgerLabel: { control: 'text', description: 'Имя кнопки-бургера и диалога меню.' },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<NavbarArgs>;

/**
 * Reveal an embedded preview only once its fonts settle (deterministic
 * captures: the nested document is same-origin, so the story can await its
 * font readiness directly).
 */
const revealOnReady = (event: Event): void => {
  const frame = event.target as HTMLIFrameElement;
  const reveal = (): void => frame.classList.add('tkn-frame__view--ready');
  try {
    const doc = frame.contentDocument;
    if (!doc) {
      reveal();
      return;
    }
    void doc.fonts.ready.then(reveal);
  } catch {
    reveal();
  }
};

/**
 * Opens the drawer inside an embedded preview after it settles (frame 2 of
 * the mobile demo). BOUNDED RETRY POLL, not a fonts.ready+setTimeout(0)
 * one-shot: the nested Storybook preview mounts ASYNCHRONOUSLY after the
 * iframe's load event, so the one-shot click queried before tk-navbar
 * existed and silently no-oped (observed in the built bundle —
 * aria-expanded stayed false and the «открытый drawer» frame shipped a
 * closed bar; found at the 3.10 composition review). The poll lands the
 * click the moment the burger renders — ~5s ceiling, then it degrades to
 * the closed state.
 */
const openDrawerInside = (event: Event): void => {
  const frame = event.target as HTMLIFrameElement;
  const OPEN_ATTEMPTS = 50;
  const OPEN_RETRY_MS = 100;
  const tryOpen = (attemptsLeft: number): void => {
    let burger: HTMLButtonElement | null | undefined;
    try {
      burger = frame.contentDocument
        ?.querySelector('tk-navbar')
        ?.shadowRoot?.querySelector<HTMLButtonElement>('.burger');
    } catch {
      /* the frame is same-origin; a cross-origin surprise stops the poll */
      return;
    }
    if (burger) {
      burger.click();
      return;
    }
    if (attemptsLeft > 0) window.setTimeout(() => tryOpen(attemptsLeft - 1), OPEN_RETRY_MS);
  };
  tryOpen(OPEN_ATTEMPTS);
};

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <div class="tkn-canvas">
      ${navbarCanvas(args)}
      <main>
        <div class="tkn-demo">
          <h1>Navbar</h1>
          <p class="tkn-note">
            Шапка эталона: 72px (DESIGN), логотип слева, ссылки с жёлтым
            активным штрихом и весом 700, утилиты справа. Прокрутите страницу —
            после 10px появляется тень и волосяная линия (150мс). Ниже 768px
            ссылки складываются в бургер (см. «Мобильный»). Навигация, а не
            форма: <code>activeValue</code> — просто вход, событий нет.
          </p>
          <h2>Секция страницы</h2>
          <p>
            Контент под шапкой. Липкость включена — при прокрутке шапка
            остаётся сверху, тень проявляется по порогу прокрутки, а не по
            наведению.
          </p>
        </div>
      </main>
    </div>
  `,
};

export const ActiveLink: Story = {
  name: 'Активная ссылка',
  render: () => html`
    ${canvasStyles}
    <div class="tkn-canvas">
      <main>
        <div class="tkn-demo">
          <h1>Активная секция</h1>
          <p class="tkn-note">
            Активная ссылка — пара избыточности AA: жёлтый штрих 4px на линии
            границы + чернильный текст весом 700. Жёлтый никогда не несёт
            состояние один. Значение вне списка не помечает ничего.
          </p>
        </div>
      </main>
      ${navbarCanvas({ activeValue: 'retail' })}
      ${navbarCanvas({ activeValue: 'business' })}
      ${navbarCanvas({ activeValue: 'zzz' })}
    </div>
  `,
};

export const MobileBurger: Story = {
  name: 'Мобильный (<768)',
  render: (_args, context) => {
    // The nested preview must follow the toolbar theme (the globals URL
    // param is the persisted form the preview honors).
    const dark = context.globals.theme === 'dark';
    const suffix = dark ? '&globals=theme:dark' : '';
    return html`
      ${canvasStyles}
      <div class="tkn-canvas">
        <main>
          <div class="tkn-demo">
            <h1>Мобильная шапка</h1>
            <p class="tkn-note">
              Встроенный превью шириной 375px — медиавыражения отвечают
              вьюпорту IFRAME, поэтому бургер виден внутри рамки при любой
              ширине канвы. Высота панели 56px (проба), кнопка 44px. Вторая
              рамка — открытый drawer: контроллер оверлеев монтирует панель
              (слой dropdown), блокирует прокрутку и заворачивает фокус;
              Esc возвращает фокус на бургер.
            </p>
            <figure class="tkn-frame">
              <iframe
                class="tkn-frame__view"
                title="tk-navbar, закрытая шапка, viewport 375px"
                src="iframe.html?id=components-navbar--playground&viewMode=story${suffix}"
                @load=${revealOnReady}
              ></iframe>
              <figcaption>закрытая шапка: логотип + утилиты + бургер</figcaption>
            </figure>
            <figure class="tkn-frame">
              <iframe
                class="tkn-frame__view tkn-frame__open"
                title="tk-navbar, открытый drawer, viewport 375px"
                src="iframe.html?id=components-navbar--playground&viewMode=story${suffix}"
                @load=${(event: Event) => {
                  revealOnReady(event);
                  openDrawerInside(event);
                }}
              ></iframe>
              <figcaption>открытый drawer: список ссылок, фокус внутри</figcaption>
            </figure>
          </div>
        </main>
      </div>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <div class="tkn-canvas">
      <main>
        <div class="tkn-demo">
          <h1>Темизация</h1>
          <p class="tkn-note">
            Тёмная тема — контрол Theme в тулбаре: ни одной ветки темы в коде,
            токены перекрашивают шапку целиком; подчёркивающий штрих остаётся
            жёлтым (бренд), вес 700 — избыточный носитель состояния. На
            тонированных поверхностях перекрывайте ВСЕ текстовые хуки вместе:
            <code>--tk-navbar-link</code> и <code>--tk-navbar-link-hover</code>
            — иначе ховер неактивной ссылки упадёт в text-primary и станет
            невидимым на чернильном фоне (прецедент tk-tabs). Остальные слоты:
            <code>--tk-navbar-fill</code>,
            <code>--tk-navbar-underline</code>,
            <code>--tk-navbar-height</code>.
          </p>
        </div>
      </main>
      <style>
        /* On-tint recipe: BOTH text hooks go white on charcoal. */
        .tkn-hero tk-navbar {
          --tk-navbar-fill: var(--tk-color-tint-charcoal);
          --tk-navbar-link: var(--tk-color-white);
          --tk-navbar-link-hover: var(--tk-color-white);
          --tk-navbar-link-active: var(--tk-color-white);
        }
        .tkn-hero__body {
          background: var(--tk-color-tint-charcoal);
          color: var(--tk-color-white);
          padding: var(--tk-space-24) var(--tk-space-24) var(--tk-space-32);
        }
        .tkn-hero__body p {
          margin: 0;
          max-width: 560px;
          font-size: var(--tk-text-body-m-size);
          line-height: var(--tk-text-body-m-leading);
        }
      </style>
      <div class="tkn-hero">
        ${navbarCanvas({ activeValue: 'business' })}
        <div class="tkn-hero__body">
          <p>
            Шапка на чернильном герое: заливка перекрыта на tint-charcoal,
            текстовые хуки — на белый. Жёлтый штрих виден на любом фоне.
          </p>
        </div>
      </div>
      ${navbarCanvas({ activeValue: 'premium' })}
    </div>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <div class="tkn-canvas">
      ${navbarCanvas({ activeValue: 'business' })}
      <main>
        <div class="tkn-demo">
          <h1>Доступность</h1>
          <p class="tkn-note">
            Шапка — нативный <code>&lt;header&gt;</code> (баннер), ссылки — в
            <code>&lt;nav aria-label&gt;</code>; активная помечена
            <code>aria-current="page"</code>. Бургер: имя из
            <code>burger-label</code>, <code>aria-expanded</code>,
            <code>aria-controls</code> на панель. Drawer —
            <code>role="dialog"</code> + <code>aria-modal</code>, фокус
            заворачивается примитивом trapFocus, Esc закрывает и возвращает
            фокус на бургер, прокрутка блокируется пересчётной блокировкой
            контроллера. Цели ≥44px: ссылки на всю высоту панели, бургер 44px.
            Кольцо фокуса единое: 2px, сдвиг 2px. Слот-оверрайд drawer
            (<code>burger</code>) не попадает в обход фокуса — держите в нём
            хотя бы один фокусируемый элемент.
          </p>
          <h2>Чек-лист: только с клавиатуры</h2>
          <table>
            <thead>
              <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code></td>
                <td>Лого → ссылки → утилиты → (на &lt;768) бургер; кольцо 2px на каждом шаге.</td>
              </tr>
              <tr>
                <td><code>Enter</code> на ссылке</td>
                <td>Нативная навигация якоря; компонент ничего не перехватывает.</td>
              </tr>
              <tr>
                <td><code>Enter</code> / <code>Space</code> на бургере</td>
                <td>Drawer открывается: фокус — на первую ссылку, Tab/Shift+Tab циклятся внутри.</td>
              </tr>
              <tr>
                <td><code>Esc</code> в drawer</td>
                <td>Закрывается, фокус возвращается на бургер, прокрутка страницы разблокируется.</td>
              </tr>
              <tr>
                <td>Скринридер</td>
                <td>Баннер, навигация по имени, активная ссылка объявляется «текущая страница»; drawer — модальный диалог по имени кнопки.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
};
