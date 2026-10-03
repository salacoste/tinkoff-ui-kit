import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../input/input.js';
import type { TkInput } from '../input/input.js';
import '../note/note.js';
import '../segmented-radio/segmented-radio.js';
import type { TkSegmentedRadioOption } from '../segmented-radio/segmented-radio.js';

/**
 * The trade ticket composition (spec 23.3) — the invest remainder wave's
 * PATTERN story: the buy/sell order form assembled ENTIRELY from existing
 * kit atoms (zero new components, zero token edits, zero registry pins).
 *
 * GROUNDING (recorded in the spec, repeated here for the lens): no DOM
 * capture exists — the live ticket sits behind auth/terminal chrome
 * (GAP-MAP Deferred). Every geometry below is a KIT REGISTER pick, not a
 * measurement; a future terminal capture re-opens the pattern as its own
 * story.
 *
 * AC4 RULING (fixed at execution): the amount suffix is the EXISTING
 * tk-input badge slot — a right-anchored inline slot announced after the
 * label («Сумма покупки, ₽»). No tk-input variant is minted; the atom is
 * untouched.
 *
 * COMPOSITION (AC1): side = tk-segmented-radio (Купить/Продажа, story-level
 * state); amount = tk-input + ₽ badge; lots = the − value + mini-pattern on
 * tk-button secondary compact (the 44px target register); CTA = tk-button
 * primary with side-driven copy; portfolio star = the 22.5 slot-button mold
 * (consumer state, aria-pressed); ИИР = tk-note info tone (the legal
 * formula — wording mold from live captures, not PD content).
 *
 * A11Y CONTRACT (AC2 — the visible keyboard checklist pins it): the group
 * names via tk-segmented-radio's label; the counter is a role=group of
 * REAL buttons whose accessible names come from an sr-only span («Убрать
 * лот»/«Добавить лот» — a bare «−» names nothing), the live value rides
 * <output aria-live="polite">; the amount is a label+input pair (native
 * tk-input machinery). The visual suite runs axe on this story in both
 * themes.
 *
 * DATA (AC3 — the PD gate): instrument, price and every total are
 * FICTIONAL demo numbers; the «итого» math is story logic (the demo
 * consumer — the kit never computes).
 */

/** Fictional price of one lot (₽) — demo data, not a measurement. */
const PRICE_PER_LOT = 1234.56;

/** NBSP literal (the tk-chart axis mold) — RU thousands/«₽» non-breaking bind. */
const NBSP = ' ';

/** Side options — the pattern's two states (RU copy, EN meta per the kit law). */
const SIDE_OPTIONS: TkSegmentedRadioOption[] = [
  { value: 'buy', label: 'Купить' },
  { value: 'sell', label: 'Продать' },
];

/** RU money format for the demo: NBSP thousands, comma decimals (story logic). */
const formatRub = (value: number): string =>
  value
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

/** Parses the demo amount field back to a number (NBSP/comma tolerant). */
const parseRub = (text: string): number => {
  const normalized = text.replace(/\s/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Story-level demo state (the consumer's state — the pattern holds none). */
interface TradeState {
  side: 'buy' | 'sell';
  lots: number;
}

const ctaText = (state: TradeState): string =>
  `${state.side === 'buy' ? 'Купить' : 'Продать'} за${NBSP}${formatRub(
    state.lots * PRICE_PER_LOT,
  )}${NBSP}₽`;

const canvasStyles = html`
  <style>
    /* Full-bleed page surface (the kit's dark-review mold: the WHOLE canvas
       rides surface-base of the active theme — no pale letterbox in dark),
       the ticket itself a centered narrow column. */
    .trf-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-40) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .trf-sheet {
      max-width: 440px;
      margin: 0 auto;
    }
    .trf-canvas h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .trf-canvas .trf-note {
      margin: 0 0 var(--tk-space-24);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .trf-form {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-20);
    }
    /* The lots mini-pattern: real 44px targets (tk-button compact), the
       value centered between them. */
    .trf-counter {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    .trf-counter__value {
      min-width: var(--tk-space-40);
      text-align: center;
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
    }
    .trf-counter__hint {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .trf-actions {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      margin-top: var(--tk-space-4);
    }
    .trf-actions tk-button {
      flex: 1;
    }
    /* The portfolio star — the 22.5 slot-button mold: a consumer widget,
       state included. The counter-suffix label keeps it off the CTA's tail. */
    .trf-star {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--tk-color-text-secondary);
      cursor: pointer;
    }
    .trf-star:hover {
      color: var(--tk-color-text-primary);
    }
    .trf-star:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
      border-radius: var(--tk-radius-full);
    }
    .trf-star[aria-pressed='true'] {
      color: var(--tk-color-text-primary);
    }
    .trf-star[aria-pressed='true'] .trf-star__glyph {
      fill: currentColor;
    }
    /* Accessible names for the ± buttons — a bare «−» names nothing (AC2). */
    .trf-sr {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      border: 0;
      white-space: nowrap;
      clip-path: inset(50%);
      overflow: hidden;
    }
  </style>
`;

/** The outline star glyph (the 22.5 mold — consumer svg, kit tokens). */
const starGlyph = html`
  <svg class="trf-star__glyph" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8L12 3.6z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    ></path>
  </svg>
`;

const meta: Meta = {
  title: 'Invest/Trade form',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const TradeForm: Story = {
  name: 'Торговый бланк',
  render: () => {
    // One-shot demo consumer: the closure is the state holder, DOM ids are
    // the update channel (Storybook renders web-component stories once).
    const state: TradeState = { side: 'buy', lots: 1 };
    const syncDerived = (): void => {
      const amount = document.querySelector<TkInput>('#trf-amount');
      if (amount) amount.value = formatRub(state.lots * PRICE_PER_LOT);
      const value = document.querySelector<HTMLOutputElement>('#trf-lots-value');
      if (value) value.textContent = String(state.lots);
      const cta = document.querySelector<HTMLElement>('#trf-cta-text');
      if (cta) cta.textContent = ctaText(state);
    };
    const onSide = (event: Event): void => {
      state.side = (event as CustomEvent<{ value: string }>).detail.value === 'sell' ? 'sell' : 'buy';
      const amount = document.querySelector<TkInput>('#trf-amount');
      if (amount) amount.label = state.side === 'buy' ? 'Сумма покупки' : 'Сумма продажи';
      syncDerived();
    };
    const onLots = (delta: number): void => {
      state.lots = Math.min(99, Math.max(1, state.lots + delta));
      syncDerived();
    };
    const onAmount = (event: Event): void => {
      const text = (event as CustomEvent<{ value: string }>).detail.value;
      const parsed = parseRub(text);
      if (parsed <= 0) return;
      state.lots = Math.min(99, Math.max(1, Math.round(parsed / PRICE_PER_LOT)));
      const value = document.querySelector<HTMLOutputElement>('#trf-lots-value');
      if (value) value.textContent = String(state.lots);
      const cta = document.querySelector<HTMLElement>('#trf-cta-text');
      if (cta) cta.textContent = ctaText(state);
    };
    const onStar = (event: Event): void => {
      const star = event.currentTarget as HTMLButtonElement;
      const pressed = star.getAttribute('aria-pressed') !== 'true';
      star.setAttribute('aria-pressed', String(pressed));
      star.setAttribute('aria-label', pressed ? 'Убрать из портфеля' : 'Добавить в портфель');
    };

    return html`
      ${canvasStyles}
      <main class="trf-canvas">
        <div class="trf-sheet">
        <h1>Сделка с демо-инструментом</h1>
        <p class="trf-note">
          Композиция торгового бланка из атомов кита: сторона
          (tk-segmented-radio), сумма (tk-input с суффиксом-бейджем «₽» —
          суффикс едет на существующем слоте, без варианта), счётчик лотов
          (мини-паттерн «− значение +» на tk-button compact — цели 44px),
          CTA по стороне (tk-button primary), звезда портфеля (слот-кнопка
          консьюмера, молд 22.5) и ИИР-приписка (tk-note info). Цены и
          инструмент — вымышленные демо-данные; расчёт «итого» — логика
          демо-консьюмера, кит не считает. Замеров нет (DOM-каптура за
          терминальным гейтом — GAP-MAP Deferred): геометрия — китовые
          регистры. Клавиатура: Tab — один стоп на группу стороны
          (стрелки ← → переключают Купить/Продажу, выбор следует за
          фокусом), затем сумма, «−», «+», кнопка сделки, звезда;
          Enter/Space активируют; лоты объявляются живой областью
          (output aria-live="polite").
        </p>
        <form class="trf-form" @submit=${(event: Event) => event.preventDefault()}>
          <tk-segmented-radio
            name="trf-side"
            label="Сторона сделки"
            .options=${SIDE_OPTIONS}
            default-value="buy"
            @value-change=${onSide}
          ></tk-segmented-radio>
          <tk-input
            id="trf-amount"
            label="Сумма покупки"
            placeholder="0"
            default-value=${formatRub(PRICE_PER_LOT)}
            @value-change=${onAmount}
          >
            <span slot="badge">₽</span>
          </tk-input>
          <div class="trf-counter" role="group" aria-labelledby="trf-lots-label">
            <span class="trf-sr" id="trf-lots-label">Количество лотов</span>
            <tk-button variant="secondary" size="compact" @click=${() => onLots(-1)}>
              <span aria-hidden="true">−</span><span class="trf-sr">Убрать лот</span>
            </tk-button>
            <output class="trf-counter__value" id="trf-lots-value" aria-live="polite">1</output>
            <tk-button variant="secondary" size="compact" @click=${() => onLots(1)}>
              <span aria-hidden="true">+</span><span class="trf-sr">Добавить лот</span>
            </tk-button>
            <span class="trf-counter__hint">${formatRub(PRICE_PER_LOT)}${NBSP}₽ за лот</span>
          </div>
          <div class="trf-actions">
            <tk-button>
              <span id="trf-cta-text">${ctaText(state)}</span>
            </tk-button>
            <button class="trf-star" type="button" aria-label="Добавить в портфель" aria-pressed="false" @click=${onStar}>
              ${starGlyph}
            </button>
          </div>
          <tk-note tone="info" label="Информация">
            Не является индивидуальной инвестиционной рекомендацией
          </tk-note>
        </form>
        </div>
      </main>
    `;
  },
};
