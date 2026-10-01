import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../link/link.js';
import './empty-state.js';

/**
 * tk-empty-state stories (spec 21.3, invest foundation wave): the
 * centered stack and its slots, the favorites grounding («Здесь пока
 * пусто» + text-link CTA inside a consumer card) and the console
 * compact — a DERIVED idiom (the admin frame's pixel check showed an
 * account row, not empty-state anatomy; the probe label was
 * optimistic), so it demonstrates hook overrides, not a second live
 * grounding. Financial copy is FICTIONAL per the recon law.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root; the disc-size
 * and gap overrides in the compact demo are prose literals of the
 * STORY (hook consumption, exactly what the hooks exist for).
 */

type EmptyStateArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkes-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while the block remaps — story chrome invisible
         (the 5.4 dark-sweep finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkes-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkes-canvas .tkes-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkes-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkes-canvas section {
      max-width: var(--tk-space-container);
    }
    .tkes-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The favorites grounding surface: the PAGE mutes (the live page
       bg ≈ surface-muted) and the consumer card floats on it — the atom
       owns only the centered stack inside (tokens only, FR-1). */
    .tkes-page {
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-md);
    }
    .tkes-card {
      display: grid;
      place-items: center;
      padding: var(--tk-space-40) var(--tk-space-32);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-md);
    }
    /* The slotted clock glyph — a STORY decoration (tokens only,
       currentColor): proves the icon slot inherits the disc's muted
       tone without the atom shipping any iconography. */
    .tkes-glyph {
      width: var(--tk-space-24);
      height: var(--tk-space-24);
    }
    /* The console compact: a WIDE, short card (the admin frame's
       926×258 proportions) with hook overrides — disc 72, tighter
       rhythm. Derived idiom, flagged in the story prose. */
    .tkes-compact {
      --tk-empty-state-disc-size: 72px;
      --tk-empty-state-gap: var(--tk-space-12);
      --tk-empty-state-text-gap: var(--tk-space-4);
      max-width: 706px;
      padding: var(--tk-space-24) var(--tk-space-32);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    .tkes-compact .tkes-desc {
      max-width: 440px;
    }
  </style>
`;

const meta: Meta<EmptyStateArgs> = {
  title: 'Components/EmptyState',
  component: 'tk-empty-state',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<EmptyStateArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkes-canvas">
      <h1>EmptyState</h1>
      <p class="tkes-note">
        Блок «здесь пока пусто» инвест-поверхностей (spec 21.3): диск-иконка →
        заголовок → поддерживающая строка → действие, центрированный стек.
        Атом не рисует карту — фон и рамку даёт потребитель. Действие —
        <strong>слот</strong>, не атрибут: живое заземление несёт текстовую
        ссылку, кнопка ложится в тот же слот. Диск декоративен
        (<code>aria-hidden</code>); ров heading — h3 (молд карточных
        заголовков кита), уровень выше задаёт слот <code>heading</code>.
        Ритм и диск — хуки <code>--tk-empty-state-*</code>: компактная
        плотность консоли достигается переопределением, не режимом атома.
      </p>
      <section>
        <h2>Дефолт: пустой диск</h2>
        <div class="tkes-page">
          <div class="tkes-card">
            <tk-empty-state heading="Здесь пока пусто">
              <span slot="description">Отмечайте бумаги звёздочкой — они появятся в этом списке.</span>
              <tk-link slot="action" href="#">Добавить бумаги</tk-link>
            </tk-empty-state>
          </div>
        </div>
      </section>
      <section>
        <h2>Иконка в диске</h2>
        <div class="tkes-page">
          <div class="tkes-card">
            <tk-empty-state heading="Отчёт готовится">
              <span slot="description">Сводная таблица сформируется автоматически.</span>
              <svg
                slot="icon"
                class="tkes-glyph"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8.5"></circle>
                <path d="M12 7.5V12l3 2"></path>
              </svg>
              <tk-link slot="action" href="#">Открыть настройки</tk-link>
            </tk-empty-state>
          </div>
        </div>
      </section>
    </main>
  `,
};

/**
 * The favorites grounding: a muted page, the consumer card, the atom and
 * the TEXT LINK CTA — the capture's anatomy one-to-one (disc → heading →
 * supporting line → link), RU copy fictional.
 */
export const FavoritesEmpty: Story = {
  name: 'Избранное пусто',
  render: () => html`
    ${canvasStyles}
    <main class="tkes-canvas">
      <h1>Избранное пусто</h1>
      <p class="tkes-note">
        Заземление invest-избранного: приглушённая страница, карточка
        потребителя, внутри — атом с ссылкой-CTA «Добавить бумаги». Действие
        — именно ссылка, не кнопка: живой замер, атом не предполагает иное.
        Пиксельная таблица замера — в шапке empty-state.css.ts.
      </p>
      <section>
        <div class="tkes-page">
          <div class="tkes-card">
            <tk-empty-state heading="Здесь пока пусто">
              <span slot="description">Отмечайте бумаги звёздочкой — они появятся в этом списке.</span>
              <tk-link slot="action" href="#">Добавить бумаги</tk-link>
            </tk-empty-state>
          </div>
        </div>
      </section>
    </main>
  `,
};

/**
 * The console compact: derived from the admin capture's PROBE LABEL
 * («compact icon+title+sub+action»), whose pixel check showed an account
 * row — so this story demonstrates hook overrides at console density
 * and claims no second live grounding. The prose says so.
 */
export const ConsoleCompact: Story = {
  name: 'Компакт консоли',
  render: () => html`
    ${canvasStyles}
    <main class="tkes-canvas">
      <h1>Компакт консоли</h1>
      <p class="tkes-note">
        Консольный идиом: широкая низкая карточка (~926×258 живого кадра),
        диск 72px и плотный ритм — переопределения хуков потребителя,
        <strong>не</strong> режим атома. Честная пометка: кадр админ-капчуры
        при пиксельной проверке оказался строкой счёта, а не empty-блоком —
        «двойное заземление» спеки схлопнулось до одного живого; этот демо —
        производная идиомы, а не свидетельство.
      </p>
      <section>
        <div class="tkes-compact">
          <tk-empty-state heading="Счетов пока нет">
            <span slot="description">Откройте расчётный счёт — он появится здесь вместе с картами и лимитами.</span>
            <tk-link slot="action" href="#">Открыть счёт</tk-link>
          </tk-empty-state>
        </div>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-empty-state')}`,
};
