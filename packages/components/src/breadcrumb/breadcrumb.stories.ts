import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './breadcrumb.js';
import type { TkBreadcrumbItem } from './breadcrumb.js';

/**
 * tk-breadcrumb stories (spec 24.9, pattern wave 24b): the crumb trail —
 * the invest inner pages' «Инвестиции / Раскрытие информации» opener,
 * zero implementations repo-wide before the atom. The trail is DATA-DRIVEN
 * (the `items` prop: label + href per stop; the LAST stop renders as
 * aria-current="page" plain text — never a link to itself), the chevrons
 * between stops are decorative, the anchors ride the link token.
 *
 * DEMO HREFS are hash stubs (the PD gate): the atom renders the consumer's
 * hrefs but the stories point nowhere live. Story-canvas styling consumes
 * var(--tk-*) tokens only (FR-1).
 */

type BreadcrumbArgs = Record<string, never>;

const TRAIL: TkBreadcrumbItem[] = [
  { label: 'Инвестиции', href: '#' },
  { label: 'Документы', href: '#' },
  { label: 'Раскрытие информации' },
];

const LONG_TRAIL: TkBreadcrumbItem[] = [
  { label: 'Инвестиции', href: '#' },
  { label: 'Документы', href: '#' },
  { label: 'Демо-регламент', href: '#' },
  { label: 'Редакция действующая' },
];

const canvasStyles = html`
  <style>
    .tkbc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32);
      max-width: 820px;
      margin: 0 auto;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkbc-canvas h1 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkbc-note {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkbc-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .tkbc-canvas h2 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkbc-canvas hr {
      border: 0;
      border-top: 1px solid var(--tk-color-border-default);
    }
  </style>
`;

const meta: Meta<BreadcrumbArgs> = {
  title: 'Components/Breadcrumb',
  component: 'tk-breadcrumb',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<BreadcrumbArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkbc-canvas">
      <h1>Breadcrumb</h1>
      <p class="tkbc-note">
        Хлебные крошки (spec 24.9): навигационный хвост внутренних страниц —
        «Инвестиции / Раскрытие информации». Nav-ориентир с доступным именем
        (attr <code>label</code>, дефолт «Хлебные крошки»), ol/li-структура,
        последний пункт — <code>aria-current="page"</code> обычным текстом
        (никогда не ссылка на самого себя), шевроны между остановками
        декоративны (aria-hidden). Ссылки — на токене link: без подчёркивания
        в покое, линия проявляется на hover/focus-visible по motion-токенам.
        Данные едут пропом <code>items</code> (label + href); href среднего
        пункта без значения деградирует до текста — не мёртвый якорь.
        Stateless: ни событий, ни состояния. Хуки:
        <code>--tk-breadcrumb-{gap,separator,color}</code>. Клавиатура: Tab
        по ссылкам, Enter — переход потребителя (в песочнице — заглушка #).
        Обе темы — без правок состава.
      </p>
      <section>
        <h2>Три остановки — живая форма</h2>
        <tk-breadcrumb .items=${TRAIL}></tk-breadcrumb>
      </section>
      <section>
        <h2>Глубокий хвост и собственное имя ориентира</h2>
        <tk-breadcrumb .items=${LONG_TRAIL} label="Путь по документам"></tk-breadcrumb>
      </section>
      <section>
        <h2>Перенос на узкой канве — wrap, не обрезка</h2>
        <div style="max-width: 280px">
          <tk-breadcrumb .items=${LONG_TRAIL}></tk-breadcrumb>
        </div>
      </section>
      <hr />
      <section>
        <h2>Деградации §2</h2>
        <tk-breadcrumb .items=${[{ label: 'Только текущая' }]}></tk-breadcrumb>
        <tk-breadcrumb .items=${[{ label: 'Средний без ссылки' }, { label: 'Текущая' }]}></tk-breadcrumb>
        <tk-breadcrumb .items=${[]}></tk-breadcrumb>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-breadcrumb')}`,
};
