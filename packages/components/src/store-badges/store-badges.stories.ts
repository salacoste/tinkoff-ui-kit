import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './store-badges.js';

/**
 * tk-store-badges stories (spec 7.3): playground from the reference copy,
 * variants (the reference trio, label-only degrade, long label, the zero
 * state), theming, and the a11y notes with the keyboard checklist + an
 * SR-protocol section (maintainer-side execution).
 *
 * Motion: NONE (the spec's never-list) — hover is an instant fill step.
 *
 * BRAND ART: the kit ships ZERO third-party marks; the icons below are
 * NEUTRAL placeholder glyphs (a generic download arrow on a gray squircle,
 * NAMED colors only — no hex in source). Consumers pass their own licensed
 * store art through `iconSrc`.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type BadgesArgs = {
  badges: Array<{ href: string; label: string; iconSrc?: string; iconAlt?: string }>;
};

/**
 * A NEUTRAL store-mark placeholder: gray squircle + white download glyph —
 * deliberately not any store's art. NAMED colors only (FR-1 spirit: no hex
 * literals in source; a placeholder image is content, but stays clean).
 */
const PLACEHOLDER_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='12' fill='gray'/><path d='M24 12v14m0 0l-6-6m6 6l6-6' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/><path d='M15 33v3h18v-3' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
)}`;

/** The reference trio (pattern-store-badges-loaded, 2026-09-24 probe): BARE store names. */
const REFERENCE_BADGES = [
  { href: 'https://example.com/appgallery', label: 'AppGallery', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/rustore', label: 'RuStore', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/samsung', label: 'Samsung Store', iconSrc: PLACEHOLDER_ICON },
];

const canvasStyles = html`
  <style>
    .tkb-canvas {
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
    .tkb-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkb-canvas .tkb-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkb-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkb-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkb-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkb-canvas td,
    .tkb-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkb-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkb-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkb-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkb-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkb-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkb-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
    }
    /* The pill is an opaque surface carrying its own text pairing on every
       panel — no on-tint overrides needed (unlike pagination's link-blue
       numbers, nothing here sits directly on the panel). */
  </style>
`;

const meta: Meta<BadgesArgs> = {
  title: 'Components/StoreBadges',
  component: 'tk-store-badges',
  args: { badges: REFERENCE_BADGES },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<BadgesArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkb-canvas">
      <h1>Store badges</h1>
      <p class="tkb-note">
        Ряд внешних ссылок на магазины приложений: одноцветные плашки
        surface-muted 324×80 radius-lg, слева — название магазина (голое
        имя, без «Скачать в …»), справа — иконка потребителя 48×48. Вся
        плашка — ссылка: target=_blank, rel=noopener noreferrer. Иконки в
        этом сторибуке — НЕЙТРАЛЬНЫЕ заглушки кита, сторонний бренд-арт в
        репозитории запрещен (iconSrc — данные потребителя).
      </p>
      <tk-store-badges .badges=${args.badges ?? REFERENCE_BADGES}></tk-store-badges>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkb-canvas">
      <h1>Варианты</h1>
      <p class="tkb-note">
        Плашки держат единый класс размера: ширина может расти под длинные
        названия, но не сжимается — ряд остается равномерным; перенос строк
        работает на узких контейнерах (gap — токен 64).
      </p>
      <figure>
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
        <figcaption>эталон: три плашки с иконками — как в образце</figcaption>
      </figure>
      <figure>
        <tk-store-badges
          .badges=${[
            { href: 'https://example.com/rustore', label: 'RuStore' },
            { href: 'https://example.com/appgallery', label: 'AppGallery' },
          ]}
        ></tk-store-badges>
        <figcaption>без iconSrc: плашка «только текст» того же класса размера</figcaption>
      </figure>
      <figure>
        <tk-store-badges
          .badges=${[{ href: 'https://example.com/appstore', label: 'Скачать в App Store' }]}
        ></tk-store-badges>
        <figcaption>длинная подпись: плашка растет, ряд не ломается</figcaption>
      </figure>
      <figure>
        <tk-store-badges></tk-store-badges>
        <figcaption>
          badges=[]: слот нулевого состояния (текст по умолчанию — «Нет
          доступных магазинов»; заменяется своим содержимым через slot="empty")
        </figcaption>
      </figure>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkb-canvas">
      <h1>Темизация</h1>
      <p class="tkb-note">
        Ряд темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте. Слоты:
        <code>--tk-store-badges-fill</code>,
        <code>--tk-store-badges-fill-hover</code>,
        <code>--tk-store-badges-radius</code>,
        <code>--tk-store-badges-label</code>,
        <code>--tk-store-badges-icon-radius</code>.
        Плашка — непрозрачная поверхность: текст всегда сидит на её
        собственной заливке, поэтому перекрытий на тинт-панелях не нужно.
      </p>
      <section class="tkb-panel">
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
      </section>
      <section class="tkb-panel tkb-panel--muted">
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
      </section>
      <section class="tkb-panel tkb-panel--bluegray">
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
      </section>
      <section class="tkb-panel tkb-panel--charcoal">
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkb-canvas">
      <h1>Доступность</h1>
      <p class="tkb-note">
        Плашка — нативная ссылка: имя — название магазина, фокус и активация
        браузерные, кольцо — единый токен 2px. Внешние переходы всегда
        target=_blank + rel=noopener noreferrer. Мишень — вся плашка 80px
        (превышает порог 44). Иконка декоративна по умолчанию: alt
        подставляется из названия магазина; движение отсутствует полностью
        (never-list) — смена заливки при наведении мгновенная.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус: плашка за плашкой слева направо, кольцо 2px токен-кольца.</td>
          </tr>
          <tr>
            <td><code>Enter</code> на плашке</td>
            <td>Новая вкладка: адрес ссылки, noreferrer; текущая страница не меняется.</td>
          </tr>
          <tr>
            <td>Курсор: Tab / стрелки внутри плашки</td>
            <td>Ничего не перехватывается: внутри ссылки нет таб-точек, блок клавиш не владеет.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«RuStore, ссылка» — голое имя магазина; иконка с alt по умолчанию не добавляет второго объявления имени.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkb-panel">
        <tk-store-badges .badges=${REFERENCE_BADGES}></tk-store-badges>
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkb-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером. Каждое расхождение с ожидаемым
        объявлением — дефект, а не особенность.
      </p>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab на ряд</td>
            <td>«AppGallery, ссылка» — по одному объявлению на плашку</td>
          </tr>
          <tr>
            <td>Список</td>
            <td>«список, 3 элемента» — плашки размечены как список ссылок</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>Активация ссылки (новая вкладка); смены контекста внутри страницы нет</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-store-badges'),
};
