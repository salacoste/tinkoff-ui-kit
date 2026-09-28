import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/tabs/tabs.js';

/**
 * v2 docs page — CONSOLE CHROME composition (spec 13.2): the authorized-zone
 * navigation recipe from the admin reference pack (captures-v3/admin,
 * 2026-09-27): monochrome top header + secondary underline tab bar +
 * «Все сервисы» mega-menu panel. A PATTERN page — no new element, the
 * navbar is untouched; the console header composes existing atoms (links,
 * tk-tabs indicator="underline", plain slots). Grounding: pack geometry is
 * vision-model-estimated ±; the PNGs are the truth. Content RU, meta EN;
 * styling consumes var(--tk-*) tokens only (FR-1).
 */

const CONSOLE_TABS = [
  { value: 'main', label: 'Главная' },
  { value: 'payments', label: 'Платежи' },
  { value: 'statement', label: 'Выписка' },
  { value: 'details', label: 'Реквизиты' },
];

const MEGA_GROUPS = [
  {
    heading: 'Платежи',
    links: ['Платежи контрагентам', 'Переводы себе', 'Бюджетные платежи', 'Валютные операции'],
  },
  {
    heading: 'Финансы',
    links: ['Кредиты для бизнеса', 'Депозиты', 'Инкассация', 'Эквайринг'],
  },
  {
    heading: 'Бухгалтерия',
    links: ['Бухгалтерия онлайн', 'Электронный документооборот', 'Отчётность', 'Справки'],
  },
  {
    heading: 'Сервисы',
    links: ['Зарплатные проекты', 'Бизнес-карты', 'Депозиты для бизнеса', 'Страхование'],
  },
];

const meta: Meta = {
  title: 'Patterns/Console chrome',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

/** The console page chrome styles — tokens only; pack-estimated geometry. */
const consoleChromeStyles = html`
  <style>
    .tkc-header {
      display: flex;
      align-items: center;
      gap: var(--tk-space-24);
      padding: var(--tk-space-16) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkc-logo {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
    }
    .tkc-logo-mark {
      width: var(--tk-space-40);
      height: var(--tk-space-40);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-text-on-primary);
      /* the console logo tile: yellow square + ink glyph (pack: tan/yellow
         tile r14; token-mapped — the exact capture tint is a recorded delta) */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: var(--tk-text-body-m-size);
    }
    .tkc-links {
      display: flex;
      gap: var(--tk-space-16);
      margin-inline-start: var(--tk-space-24);
    }
    .tkc-links a {
      color: var(--tk-color-text-secondary);
      text-decoration: none;
      font-size: var(--tk-text-body-m-size);
    }
    .tkc-links a:hover {
      color: var(--tk-color-text-primary);
    }
    .tkc-all-services {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-m-bold-weight);
      font-size: var(--tk-text-body-m-size);
    }
    .tkc-icons {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      margin-inline-start: auto;
    }
    .tkc-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--tk-space-40);
      height: var(--tk-space-40);
      border-radius: var(--tk-radius-full);
      border: 1px solid var(--tk-color-border-default);
      color: var(--tk-color-text-secondary);
    }
    .tkc-avatar {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
    }
    .tkc-avatar-tile {
      width: var(--tk-space-40);
      height: var(--tk-space-40);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--tk-color-text-primary);
      font-size: var(--tk-text-body-s-size);
      font-weight: var(--tk-text-body-m-bold-weight);
    }
    .tkc-org {
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-s-size);
    }
    /* Mega-menu panel: full-width card r24–32 (pack) over the page; four
       text columns, group headings bold, plain links, monochrome. */
    .tkc-mega {
      box-sizing: border-box;
      margin: var(--tk-space-8) var(--tk-space-24) 0;
      padding: var(--tk-space-40) var(--tk-space-40);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-xl);
      box-shadow: var(--tk-shadow-default);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--tk-space-24) var(--tk-space-32);
    }
    .tkc-mega h3 {
      margin: 0 0 var(--tk-space-16);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkc-mega ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .tkc-mega li + li {
      margin-block-start: var(--tk-space-16);
    }
    .tkc-mega a {
      color: var(--tk-color-text-primary);
      text-decoration: none;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
    }
    .tkc-mega a:hover {
      color: var(--tk-color-link);
    }
    .tkc-tabs-row {
      padding: 0 var(--tk-space-24);
      max-width: 720px;
    }
  </style>
`;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Console chrome — навигация авторизованной зоны</h1>
      <p class="tkv2-note">
        Паттерн 13.2 по админ-паку <code>captures-v3/admin/</code> (мейнтейнерская
        сессия, 2026-09-27): консоль Т-Бизнеса НЕ имеет левого сайдбара —
        навигация = монохромный верхний хедер + вторичные текстовые табы +
        мега-меню «Все сервисы». Это страница-рецепт КОМПОЗИЦИИ: нового
        элемента нет, <code>tk-navbar</code> (маркетинговый, v1-инвариант
        <code>.bar</code>) не трогается. Табы — <code>tk-tabs</code> с новым
        индикатором <code>indicator="underline"</code> (13.2): монохром, активный
        — жирный + 2px чернильный андлайн.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Админки и авторизованные зоны потребителей кита: монохромный хром,
          жёлтый только как контур выбора/прогресс/логотип — никогда как заливка
          кнопки.
        </li>
        <li>
          Верхняя навигация поверх контента: продукт-ссылки + триггер «Все
          сервисы» + иконочный кластер + блок аватара организации.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Маркетинговые поверхности: там остаётся <code>tk-navbar</code> (жёлтая
          пилюля CTA, burger-drawer) — языки не смешиваются.
        </li>
        <li>
          Левые сайдбары: в паке их НЕТ (решение 13.1 —
          <code>tk-sidebar-nav</code> дропнут); левая колонка «Главной» — это
          контент-виджет, не навигация.
        </li>
      </ul>

      <h2>Язык консоли (сводка)</h2>
      <ul>
        <li>Монохром: жёлтый = контур выбора 2px / заливка прогресса / логотип.</li>
        <li>
          Кнопки — серая заливка r10 h36–40 (экстракционные якоря значений — в
          DESIGN.md, блок «Authorized-zone console language»; дельта: в ките —
          <code>tk-button secondary</code>, белый + волосяная линия).
        </li>
        <li>
          Карточки белые r24 на светло-сером фоне страницы; суб-карточки
          приглушённее (точные значения — там же в DESIGN.md).
        </li>
        <li>
          Ссылки синие; поступления зелёные — только семантика значений
          (AA-пару см. DESIGN.md).
        </li>
        <li>
          Табы: только текст, активный = жирный + тёмный андлайн (в ките —
          <code>indicator="underline"</code>; хук
          <code>--tk-tabs-indicator</code>).
        </li>
      </ul>

      <h2>Мега-меню «Все сервисы»</h2>
      <p>
        Ближайший родственник в ките — второй ряд <code>tk-navbar</code> v2
        (<code>subLinks</code>, Story 7.1): тот же язык «жирный заголовок группы
        + плоские ссылки», то же правило андлайна у триггера. Дельты консоли
        (по паку): панель — отдельная полноширинная карточка r24–32 с мягкой
        тенью на приглушённом фоне, 4 текстовые колонки ~365px, группы 26–28
        жирные + ссылки 20–22 с ритмом ~62px, МОНОХРОМ (ноль жёлтых заливок
        внутри), триггер — текст с андайном, не кнопка. Геометрия
        vision-оценка ±: PNG пака — истина.
      </p>

      <h2>Доступность</h2>
      <ul>
        <li>
          Табы несут полную семантику tablist/tab/tabpanel (стрелки, Home/End,
          roving tabindex) — индикатор чисто презентационный.
        </li>
        <li>
          Андлайн 2px — не единственный носитель состояния: вес текста 500
          остаётся (правило избыточности).
        </li>
        <li>
          Панель мега-меню в реальном продукте — Esc-закрываемый поповер с
          фокус-менеджментом; открытого состояния в паке НЕТ (решение 13.1:
          опциональный follow-up capture).
        </li>
      </ul>

      <h3>Протокол скринридер-проверки (VoiceOver / NVDA)</h3>
      <p class="tkv2-note">
        Протокол исполняется вручную на стороне мейнтейнера (§8.1.4,
        run-sheet mold); история «Демо» — исполняемая поверхность. Каждое
        расхождение с ожидаемым объявлением — дефект, а не особенность.
      </p>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab на ленту табов («Демо»)</td>
            <td>«Главная, вкладка, выбрана, 1 из 4» — объявления НЕ отличаются от пилюльного режима: чернильный андлайн чисто презентационный</td>
          </tr>
          <tr>
            <td>ArrowRight / ArrowLeft</td>
            <td>вкладка объявляется и АКТИВИРУЕТСЯ: панель меняется вместе с фокусом (контракт tk-tabs)</td>
          </tr>
          <tr>
            <td>Линейное чтение хедера</td>
            <td>продукт-ссылки — якоря с собственными именами; «Все сервисы» и плитка аватара — статический текст (панель в деме СТАТИЧНА, интерактива нет)</td>
          </tr>
          <tr>
            <td>Мега-панель</td>
            <td>заголовки групп читаются как заголовки (h3), ссылки — якоря; Esc-закрытия в деме НЕТ — открытого состояния в паке нет (13.1)</td>
          </tr>
        </tbody>
      </table>

      ${codeBlock(`<tk-tabs indicator="underline"
  .tabs=\${[{ value: 'main', label: 'Главная' }, …]}>
  <div slot="tab-0">…</div>
</tk-tabs>`)}
    </div>
  `,
};

export const Demo: Story = {
  name: 'Демо',
  render: () => html`
    ${v2PageStyles}
    ${consoleChromeStyles}
    <div class="tkv2">
      <h1>Демо — хедер + табы + мега-панель</h1>
      <p class="tkv2-note">
        Композиция из существующих атомов (токены кита; дельты консоли — в
        «Обзоре»). Аватар-плитка и иконки — плоские слоты: готового
        аватар/меню-компонента в ките нет (решение 13.1). Панель показана
        СТАТИЧНО открытой — как в паке.
      </p>

      <header class="tkc-header">
        <span class="tkc-logo">
          <span class="tkc-logo-mark">Т</span>
          <span>БИЗНЕС</span>
        </span>
        <nav class="tkc-links" aria-label="Продукты">
          <a href="#">Бухгалтерия</a>
          <a href="#">Отчётность</a>
          <a href="#">Эквайринг</a>
        </nav>
        <span class="tkc-all-services">Все сервисы</span>
        <span class="tkc-icons" aria-hidden="true">
          <span class="tkc-icon">⌕</span>
          <span class="tkc-icon">◇</span>
        </span>
        <span class="tkc-avatar">
          <span class="tkc-avatar-tile">АА</span>
          <span class="tkc-org">Организация</span>
        </span>
      </header>

      <section class="tkc-mega" aria-label="Все сервисы">
        ${MEGA_GROUPS.map(
          (group) => html`
            <div>
              <h3>${group.heading}</h3>
              <ul>
                ${group.links.map((label) => html`<li><a href="#">${label}</a></li>`)}
              </ul>
            </div>
          `,
        )}
      </section>

      <div class="tkc-tabs-row">
        <tk-tabs indicator="underline" .tabs=${CONSOLE_TABS} .defaultValue=${'main'}>
          <div slot="tab-0"><p>Сводка консоли.</p></div>
          <div slot="tab-1"><p>Хаб платежей.</p></div>
          <div slot="tab-2"><p>Выписка за период.</p></div>
          <div slot="tab-3"><p>Реквизиты компании.</p></div>
        </tk-tabs>
      </div>
    </div>
  `,
};
