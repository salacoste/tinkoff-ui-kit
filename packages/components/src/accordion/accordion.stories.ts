import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './accordion.js';
import './accordion-item.js';

/**
 * tk-accordion stories (spec 21.1, invest foundation wave): the §9 channel
 * playground with an event log, the «Частые вопросы» carded demo (the SBER
 * grounding — the card is the CONSUMER's pattern wrapper, the atom paints
 * bare rows) and the bare open-states demo (the bonds/etfs catalog
 * grounding). Financial-everyday copy is FICTIONAL per the recon law: no
 * verbatim legal formulas, no numbers lifted from the captures.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type AccordionArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkacc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input story's 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while text remaps to white — story chrome invisible
         (5.4 dark-sweep finding, the axe transparent-background blind
         spot). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkacc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkacc-canvas .tkacc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkacc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkacc-canvas section {
      max-width: var(--tk-space-container);
    }
    /* The pattern card of the SBER «Частые вопросы» grounding — a STORY
       decoration (prose literal, tokens only): the atom itself paints bare
       rows, the card belongs to the consuming page (the 21.1 AC3 deviation
       note). */
    .tkacc-card {
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      padding: var(--tk-space-4) var(--tk-space-24);
    }
    .tkacc-canvas .tkacc-log {
      margin: var(--tk-space-12) 0 0;
      padding: var(--tk-space-12);
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-surface-muted);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
      white-space: pre-wrap;
    }
    .tkacc-canvas code {
      font-family: var(--tk-font-mono);
    }
  </style>
`;

const log = (id: string, line: string): void => {
  const pre = document.getElementById(id);
  if (pre) {
    pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
  }
};

const playgroundRows = html`
  <tk-accordion-item>
    <span slot="summary">Как открыть брокерский счёт?</span>
    <p>Заявка заполняется онлайн и рассматривается в течение рабочего дня — без визита в офис.</p>
  </tk-accordion-item>
  <tk-accordion-item>
    <span slot="summary">Можно ли пополнить счёт с чужой карты?</span>
    <p>Пополнение принимается только со счетов и карт, оформленных на владельца счёта.</p>
  </tk-accordion-item>
  <tk-accordion-item>
    <span slot="summary">Что происходит с дивидендами?</span>
    <p>Выплаты зачисляются на брокерский счёт и доступны для вывода или новых покупок.</p>
  </tk-accordion-item>
`;

const meta: Meta<AccordionArgs> = {
  title: 'Components/Accordion',
  component: 'tk-accordion',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<AccordionArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkacc-canvas">
      <h1>Accordion</h1>
      <p class="tkacc-note">
        Строки-раскрытия самого частого блока инвест-поверхности (spec 21.1):
        жирный вопрос слева, тонкий серый chevron справа, волосяной
        разделитель <em>между</em> строками. Триггер — настоящий
        <code>&lt;button&gt;</code> с <code>aria-expanded</code>; панель —
        <code>role="region"</code> с подписью из вопроса, пока открыта.
        Каждая строка независима — раскрывается сама, без ротации.
        Декларативный канал: атрибут <code>open</code> на строке и событие
        <code>open-change</code> (молчит при первом рендере).
      </p>
      <section>
        <tk-accordion
          @open-change=${(event: Event) => {
            const { value } = (event as CustomEvent<{ value: boolean }>).detail;
            const summary = (event.target as Element).querySelector('[slot="summary"]')
              ?.textContent;
            log('tkacc-log', `open-change → ${value ? 'открыто' : 'закрыто'}: «${summary ?? ''}»`);
          }}
        >
          ${playgroundRows}
        </tk-accordion>
        <pre class="tkacc-log" id="tkacc-log">—</pre>
      </section>
    </main>
  `,
};

/**
 * The SBER «Частые вопросы» grounding: a white bordered card around the
 * list, bold questions, one row open by default. The card is drawn by THIS
 * story (the consumer's pattern wrapper) — the atom itself paints bare rows
 * (see the css capture→token table).
 */
export const FaqDemo: Story = {
  name: 'Частые вопросы',
  render: () => html`
    ${canvasStyles}
    <main class="tkacc-canvas">
      <h1>Частые вопросы</h1>
      <p class="tkacc-note">
        Заземление stock-SBER: белая бордер-карточка, внутри — голые строки
        аккордеона; первая открыта по умолчанию атрибутом
        <code>open</code>. Карта — обёртка паттерна потребителя, атом её
        не рисует. Тексты вымышленные.
      </p>
      <section class="tkacc-card">
        <tk-accordion>
          <tk-accordion-item open>
            <span slot="summary">Сколько стоит обслуживание?</span>
            <p>
              Обслуживание некастодиального счёта не тарифицируется —
              комиссии появляются только в операциях.
            </p>
          </tk-accordion-item>
          <tk-accordion-item>
            <span slot="summary">Как вывести деньги?</span>
            <p>Заявка на вывод создаётся онлайн; срок зачисления зависит от банка-получателя.</p>
          </tk-accordion-item>
          <tk-accordion-item>
            <span slot="summary">Можно ли торговать вечером?</span>
            <p>Вечерняя сессия доступна по отдельному соглашению о расширенном доступе.</p>
          </tk-accordion-item>
        </tk-accordion>
      </section>
    </main>
  `,
};

/**
 * The bonds/etfs catalog grounding: bare rows on the page surface, two
 * rows open at once — the independence contract. Dark theme rides the
 * harness (every story is captured in both), and the atom's neutrals
 * remap through the token layer with zero branches.
 */
export const OpenStates: Story = {
  name: 'Открытые состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkacc-canvas">
      <h1>Открытые состояния</h1>
      <p class="tkacc-note">
        Заземление каталогов bonds/etfs: строки без карточки, прямо на
        поверхности страницы; две строки открыты одновременно — режим
        ротации <code>single</code> не заводился (нет живого заземления).
        Переключите контрол Theme — нейтрали атома перестроятся через
        токенный слой, chevron и разделители остаются собой.
      </p>
      <section>
        <tk-accordion>
          <tk-accordion-item open>
            <span slot="summary">Что такое облигация?</span>
            <p>Долговая бумага: эмитент возвращает номинал и платит купоны по графику.</p>
          </tk-accordion-item>
          <tk-accordion-item open>
            <span slot="summary">Чем фонд отличается от акции?</span>
            <p>Фонд держит корзину бумаг и пересчитывается ежедневно по чистым активам.</p>
          </tk-accordion-item>
          <tk-accordion-item>
            <span slot="summary">Зачем нужен ИИС?</span>
            <p>Отдельный тип счёта с особыми условиями налогообложения для долгих стратегий.</p>
          </tk-accordion-item>
        </tk-accordion>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-accordion')}${apiReferenceDoc('tk-accordion-item')}`,
};
