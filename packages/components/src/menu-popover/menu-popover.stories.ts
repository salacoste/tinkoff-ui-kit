import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './menu-popover.js';
import './menu-item.js';
import './menu-divider.js';

/**
 * tk-menu-popover stories (spec 19.1): playground, the OPEN state (the
 * baseline/axe story — static `<tk-menu-popover open>`, the frozen §9
 * declarative surface: the panel mounts through the overlay controller on
 * first update, no play functions), variants (icons, destructive, disabled,
 * dividers, long list, the width hook), THE ADMIN PATTERNS the follow-up
 * pack grounded (avatar-menu with the header slot, table-kebab,
 * header-overflow), theming, and the a11y checklist.
 *
 * Determinism rules inherited from the select mold: the panel is
 * position:fixed, so every story showing an open menu stays single-viewport
 * short (taller canvases would stitch a fixed panel into ghost copies); the
 * auto visual suite's body capture EXCLUDES top-layer pixels, so the open
 * panel's drift protection lives in tests/visual/menu-popover.spec.ts (the
 * select.spec.ts region mold), while axe (DOM-tree based) sees it here.
 *
 * ПД law: every name/company/sum in the pattern stories is FICTIONAL —
 * values observed in the captures are never transcribed.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1); anchors are
 * ≥44×44 (the A11y floor mechanized by the sweep — default tk-button and
 * 44px icon tiles).
 */

type MenuPopoverArgs = {
  label: string;
  open: boolean;
};

/** Rows for the kebab pattern — commands of a table row (fictional payer). */
const menuRows = html`
  <tk-menu-item>Открыть карточку</tk-menu-item>
  <tk-menu-item>Повторить платёж</tk-menu-item>
  <tk-menu-divider></tk-menu-divider>
  <tk-menu-item>Отменить</tk-menu-item>
  <tk-menu-item variant="destructive">Удалить</tk-menu-item>
`;

/** 20px inline icons (currentColor — token color; deterministic vector paint). */
const iconPerson = html`
  <svg
    slot="icon"
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <circle cx="10" cy="6.5" r="3" />
    <path d="M4 16.5c1.5-3 3.5-4 6-4s4.5 1 6 4" />
  </svg>
`;
const iconPlan = html`
  <svg
    slot="icon"
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <path d="M4 5.5h12M4 10h12M4 14.5h6" />
  </svg>
`;
const iconPeople = html`
  <svg
    slot="icon"
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <circle cx="7.5" cy="7" r="2.5" />
    <path d="M2.5 15.5c1-2.2 2.8-3.2 5-3.2s4 1 5 3.2" />
    <path d="M13.5 5.2a2.5 2.5 0 0 1 0 4.6M14.5 12.6c1.6.5 2.6 1.5 3 2.9" />
  </svg>
`;
/** The kebab trigger's three dots (44px tile, dots optically centered). */
const iconKebab = html`
  <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="4" r="1.6" />
    <circle cx="10" cy="10" r="1.6" />
    <circle cx="10" cy="16" r="1.6" />
  </svg>
`;

const canvasStyles = html`
  <style>
    .tkmp-canvas {
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
    .tkmp-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkmp-canvas h2 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkmp-canvas .tkmp-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkmp-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkmp-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkmp-canvas .tkmp-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-32);
    }
    .tkmp-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkmp-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkmp-canvas table {
      border-collapse: collapse;
    }
    .tkmp-canvas td,
    .tkmp-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkmp-canvas .tkmp-log {
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
    /* The pattern triggers: 44×44 icon tiles (the A11y floor; the console's
       avatar/kebab controls on kit tokens). */
    .tkmp-avatar {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      padding: 0;
      border-radius: 50%;
      /* The kit's identity pair (button primary): yellow fill, ink text —
         the avatar tile is TRIGGER chrome, not menu chrome (the probe's
         «zero yellow» ruling covers the panel itself). */
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-text-on-primary);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      font-weight: var(--tk-text-body-m-weight);
      cursor: pointer;
    }
    .tkmp-avatar:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    .tkmp-iconbtn {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--tk-color-border-default);
      padding: 0;
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-surface-base);
      color: var(--tk-color-text-secondary);
      cursor: pointer;
    }
    .tkmp-iconbtn:hover {
      background: var(--tk-color-surface-muted);
    }
    .tkmp-iconbtn:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    /* The header slot's user block (avatar-menu pattern): static content in
       the panel header, inset to the row text grid. */
    .tkmp-user {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
    }
    .tkmp-user .tkmp-user__name {
      font-weight: var(--tk-text-body-m-weight);
    }
    .tkmp-user .tkmp-user__meta {
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
    /* A minimal table-row chrome for the kebab pattern (composition, not a
       kit component — tokens only). */
    .tkmp-tablerow {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      min-width: 420px;
      padding: var(--tk-space-12) var(--tk-space-16);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    .tkmp-tablerow .tkmp-cell {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      flex: 1 1 auto;
    }
    .tkmp-tablerow .tkmp-cell--sum {
      flex: 0 0 auto;
      text-align: right;
    }
    .tkmp-tablerow .tkmp-sub {
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkmp-toolbar {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      padding: var(--tk-space-8);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    .tkmp-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkmp-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkmp-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
  </style>
`;

/** The fictional avatar-menu rows (the console's «Профиль/Тарифы/Пользователи/Выйти» shape). */
const avatarRows = html`
  <tk-menu-item>${iconPerson}Профиль компании</tk-menu-item>
  <tk-menu-item>${iconPlan}Тарифы и лимиты</tk-menu-item>
  <tk-menu-item>${iconPeople}Пользователи и доступы</tk-menu-item>
  <tk-menu-divider></tk-menu-divider>
  <tk-menu-item>Выйти</tk-menu-item>
`;

const log = (id: string, line: string): void => {
  const pre = document.getElementById(id);
  if (pre) {
    pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
  }
};

const meta: Meta<MenuPopoverArgs> = {
  title: 'Components/MenuPopover',
  component: 'tk-menu-popover',
  args: { label: 'Действия', open: false },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<MenuPopoverArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>MenuPopover</h1>
      <p class="tkmp-note">
        Якорное меню команд (spec 19.1): триггер — слот <code>slot="anchor"</code>
        (атом триггер не рисует), панель — белый поповер с волосяной линией,
        r12, тенью dropdown, строками 44px и полными разделителями групп.
        Позиционирование — правым краем к триггеру (кадры консоли),
        оверлей-контроллер: слой dropdown, зазор 4px. Деструктив-строка —
        красный текст без заливки. Откройте кликом или <code>↓</code>.
      </p>
      <section>
        <tk-menu-popover
          .label=${args.label || 'Действия'}
          @select=${(event: Event) => {
            const { value } = (event as CustomEvent<{ value: Element }>).detail;
            log('tkmp-log', `select → «${value.textContent?.trim() ?? ''}»`);
          }}
          @open-change=${(event: Event) => {
            const { value } = (event as CustomEvent<{ value: boolean }>).detail;
            log('tkmp-log', `open-change → ${value}`);
          }}
        >
          <tk-button slot="anchor">Действия</tk-button>
          ${menuRows}
        </tk-menu-popover>
        <pre class="tkmp-log" id="tkmp-log">—</pre>
      </section>
    </main>
  `,
};

/**
 * The OPEN-state story: static `<tk-menu-popover open>` — the frozen §9
 * declarative surface mounts the panel through the overlay controller on
 * first update, so both axe and the region capture (tests/visual/
 * menu-popover.spec.ts) see the open menu without play functions. Short on
 * purpose — the panel is position:fixed and a single-viewport canvas keeps
 * the capture deterministic (the select Open-story rule). The figure sits
 * at the canvas' RIGHT edge — the console frames' anchor mode, and the room
 * the end-alignment geometry pin needs (a left-edge figure would clamp the
 * 280px panel at the viewport edge, hiding the flush-trailing-edge
 * contract).
 */
export const Open: Story = {
  name: 'Открытое меню (базлайн/axe)',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>MenuPopover — открытое меню</h1>
      <p class="tkmp-note">
        Панель открыта декларативно (<code>open</code>): правый край к
        триггеру, зазор 4px, строки 44px, разделители групп на всю ширину.
        «Удалить» — деструктив (красный текст), «Отменить» — disabled
        (пропускается стрелками, не выбирается). Реальный фокус при
        статичном открытии остаётся вне меню — Tab попадает на триггер,
        стрелки с триггера вводят фокус в строки (roving tabindex).
      </p>
      <div class="tkmp-row" style="justify-content: flex-end">
        <figure>
          <tk-menu-popover label="Действия" ?open=${true}>
            <tk-button slot="anchor">Действия</tk-button>
            <tk-menu-item>Открыть карточку</tk-menu-item>
            <tk-menu-item>Повторить платёж</tk-menu-item>
            <tk-menu-divider></tk-menu-divider>
            <tk-menu-item disabled>Отменить</tk-menu-item>
            <tk-menu-item variant="destructive">Удалить</tk-menu-item>
          </tk-menu-popover>
          <figcaption>открытое меню: правый край к триггеру, 280px, r12</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Варианты</h1>
      <p class="tkmp-note">
        Строки: с ведущей иконкой (слот <code>icon</code>, text-secondary),
        деструктив (красный текст — заливки нет), disabled, разделитель,
        длинная подпись с усечением. Ширина панели — слот
        <code>--tk-menu-popover-width</code> (по умолчанию 280px; кебаб-паттерн
        сужает до 240px). Длинный список: внутренний скролл (~7 строк),
        Home/End работают.
      </p>
      <div class="tkmp-row">
        <figure>
          <tk-menu-popover label="Аккаунт">
            <tk-button slot="anchor" size="compact">Аккаунт</tk-button>
            ${avatarRows}
          </tk-menu-popover>
          <figcaption>строки с иконками + разделитель + нейтральный выход</figcaption>
        </figure>
        <figure>
          <tk-menu-popover
            label="Действия"
            style="--tk-menu-popover-width: 240px"
          >
            <tk-button slot="anchor" size="compact">Узкое меню</tk-button>
            ${menuRows}
          </tk-menu-popover>
          <figcaption>кебаб-ширина 240px + деструктив-строка</figcaption>
        </figure>
        <figure>
          <tk-menu-popover label="Длинный список">
            <tk-button slot="anchor" size="compact">Длинный список</tk-button>
            ${Array.from({ length: 12 }, (_, i) => html`<tk-menu-item>Категория ${i + 1}</tk-menu-item>`)}
          </tk-menu-popover>
          <figcaption>12 строк: внутренний скролл, max-height от spacing-токенов</figcaption>
        </figure>
        <figure>
          <tk-menu-popover label="Длинная подпись">
            <tk-button slot="anchor" size="compact">Длинная подпись</tk-button>
            <tk-menu-item
              >Переоформить зарплатный проект с новой редакцией договора</tk-menu-item
            >
            <tk-menu-item>Короткая</tk-menu-item>
          </tk-menu-popover>
          <figcaption>усечение подписи (ellipsis), доступное имя — полное</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** The avatar-menu pattern: the header slot carries the user block (fictional company). */
export const PatternAvatar: Story = {
  name: 'Паттерн: меню аватара',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Паттерн: меню аватара</h1>
      <p class="tkmp-note">
        Композиция, не отдельный компонент: слот <code>slot="header"</code>
        несёт статичный блок пользователя (имя + метаданные), под ним —
        строки с иконками и нейтральный «Выйти» (кадр avatar-menu: выход —
        НЕ деструктив). Триггер — 44px плитка-аватар с инициалами. Справа —
        то же меню, открытое статически.
      </p>
      <div class="tkmp-row">
        <figure>
          <tk-menu-popover label="Аккаунт компании">
            <button slot="anchor" class="tkmp-avatar" type="button">РМ</button>
            <div slot="header" class="tkmp-user">
              <span class="tkmp-user__name">ООО «Ромашка»</span>
              <span class="tkmp-user__meta">billing@romashka.example</span>
            </div>
            ${avatarRows}
          </tk-menu-popover>
          <figcaption>закрыто: триггер — плитка-аватар</figcaption>
        </figure>
        <figure>
          <tk-menu-popover label="Аккаунт компании" ?open=${true}>
            <button slot="anchor" class="tkmp-avatar" type="button">РМ</button>
            <div slot="header" class="tkmp-user">
              <span class="tkmp-user__name">ООО «Ромашка»</span>
              <span class="tkmp-user__meta">billing@romashka.example</span>
            </div>
            ${avatarRows}
          </tk-menu-popover>
          <figcaption>открыто: header-слот + строки с иконками</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** The table-kebab pattern: row actions on a data surface (fictional payment). */
export const PatternKebab: Story = {
  name: 'Паттерн: кебаб таблицы',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Паттерн: кебаб таблицы</h1>
      <p class="tkmp-note">
        Строковые действия на поверхности данных: триггер — иконка «⋮»
        (44px), панель 240px с разделителем групп и деструктив-строкой
        «Удалить». Плательщик и суммы — вымышленные. Справа — открыто.
      </p>
      <div class="tkmp-row">
        <figure>
          <div class="tkmp-tablerow">
            <span class="tkmp-cell">
              <span>ООО «Тюльпан»</span>
              <span class="tkmp-sub">Списание · 26.09.2026</span>
            </span>
            <span class="tkmp-cell tkmp-cell--sum">
              <span>12 400 ₽</span>
            </span>
            <tk-menu-popover label="Действия с платежом">
              <button slot="anchor" class="tkmp-iconbtn" type="button" aria-label="Действия с платежом">${iconKebab}</button>
              ${menuRows}
            </tk-menu-popover>
          </div>
          <figcaption>закрыто: кебаб в строке данных</figcaption>
        </figure>
        <figure>
          <tk-menu-popover
            label="Действия с платежом"
            style="--tk-menu-popover-width: 240px"
            ?open=${true}
          >
            <button slot="anchor" class="tkmp-iconbtn" type="button" aria-label="Действия с платежом">${iconKebab}</button>
            ${menuRows}
          </tk-menu-popover>
          <figcaption>открыто: правый край к триггеру, деструктив — красный текст</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** The header-overflow pattern: the page header's «Ещё» menu. */
export const PatternOverflow: Story = {
  name: 'Паттерн: overflow шапки',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Паттерн: overflow шапки</h1>
      <p class="tkmp-note">
        Шапка страницы: основные действия — кнопками, редкие — за «Ещё»
        (кадр header-overflow). Ниже — то же меню открытым.
      </p>
      <div class="tkmp-row">
        <figure>
          <div class="tkmp-toolbar">
            <tk-button>Создать платёж</tk-button>
            <tk-button variant="secondary">Шаблоны</tk-button>
            <tk-menu-popover label="Ещё">
              <tk-button slot="anchor" variant="secondary">Ещё</tk-button>
              <tk-menu-item>Скачать выписку</tk-menu-item>
              <tk-menu-item>Настройки колонок</tk-menu-item>
              <tk-menu-divider></tk-menu-divider>
              <tk-menu-item>Скрыть фильтры</tk-menu-item>
            </tk-menu-popover>
          </div>
          <figcaption>закрыто: редкие действия за «Ещё»</figcaption>
        </figure>
        <figure>
          <tk-menu-popover label="Ещё" ?open=${true}>
            <tk-button slot="anchor" variant="secondary">Ещё</tk-button>
            <tk-menu-item>Скачать выписку</tk-menu-item>
            <tk-menu-item>Настройки колонок</tk-menu-item>
            <tk-menu-divider></tk-menu-divider>
            <tk-menu-item>Скрыть фильтры</tk-menu-item>
          </tk-menu-popover>
          <figcaption>открыто: панель правым краем к кнопке «Ещё»</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Темизация</h1>
      <p class="tkmp-note">
        Панель темизуется наследованием токенов (переключите контрол Theme):
        заливка surface-base, волосяная линия border-default, тень
        dropdown-токена (в тёмной теме схлопывается в тональную ступень).
        Слоты панели: <code>--tk-menu-popover-fill</code>,
        <code>--tk-menu-popover-border</code>,
        <code>--tk-menu-popover-radius</code>,
        <code>--tk-menu-popover-width</code>,
        <code>--tk-menu-popover-divider</code>.
      </p>
      <section class="tkmp-panel">
        <tk-menu-popover label="Действия">
          <tk-button slot="anchor">На surface-base</tk-button>
          ${menuRows}
        </tk-menu-popover>
      </section>
      <section class="tkmp-panel tkmp-panel--muted">
        <tk-menu-popover label="Действия">
          <tk-button slot="anchor">На surface-muted</tk-button>
          ${menuRows}
        </tk-menu-popover>
      </section>
      <section class="tkmp-panel tkmp-panel--bluegray">
        <tk-menu-popover
          label="Действия"
          style="--tk-menu-popover-fill: var(--tk-color-white)"
        >
          <tk-button slot="anchor">Свой слот заливки</tk-button>
          ${menuRows}
        </tk-menu-popover>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkmp-canvas">
      <h1>Доступность</h1>
      <p class="tkmp-note">
        Триггер — собственный контрол потребителя: атом ставит на него
        <code>aria-haspopup="menu"</code> и <code>aria-expanded</code>
        (aria-controls НЕ ставится: панель — сгенерированный ребёнок
        shadow-дерева, id-ссылка из светлого DOM не разрешится — урок
        tk-select). Панель — <code>role="menu"</code> с доступным именем
        (<code>label</code>, дефолт «Меню»), строки —
        <code>role="menuitem"</code> с roving tabindex: реальный фокус
        ходит по строкам (↓/↑ с переходом через край, disabled
        пропускаются), Home/End — первый/последний. Esc — закрыть, фокус на
        триггер; Tab из строки — закрыть естественным порядком; клик вне —
        закрыть с возвратом фокуса. Активация — клик / Enter / Space:
        <code>select</code> с деталью-строкой, затем закрытие с возвратом
        фокуса. Строки ≥44×44; кольцо фокуса — единые 2px, inset в строке.
        Ловушки фокуса нет — меню не модально.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на триггер / покидает его (меню закрыто — внутри ничего таб-доступного).</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> (закрыто)</td>
            <td>Нативная активация триггера открывает меню (клик триггера).</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (закрыто)</td>
            <td>Открытие: ↓ — фокус на первой доступной строке, ↑ — на последней.</td>
          </tr>
          <tr>
            <td><code>↓</code> / <code>↑</code> (открыто)</td>
            <td>Реальный фокус по строкам, с переходом через край; disabled-строки пропускаются.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Первая / последняя доступная строка.</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> (на строке)</td>
            <td><code>select</code> + закрытие, фокус возвращается на триггер.</td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>Закрытие, фокус на триггере.</td>
          </tr>
          <tr>
            <td><code>Tab</code> из строки</td>
            <td>Закрытие, фокус уходит естественным порядком; Shift+Tab с первой строки — на триггер, меню остаётся открытым.</td>
          </tr>
          <tr>
            <td>клик вне</td>
            <td>Закрытие, фокус возвращается на триггер.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Триггер, меню, развёрнуто/свёрнуто»; строки — «пункт меню», disabled — «недоступно».</td>
          </tr>
        </tbody>
      </table>
      <div class="tkmp-row">
        <tk-menu-popover label="Действия">
          <tk-button slot="anchor">Проверьте клавиатурой</tk-button>
          ${menuRows}
        </tk-menu-popover>
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-menu-popover'),
};
