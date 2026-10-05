import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../input/input.js';
import type { TkInput } from '../input/input.js';
import '../tabs/tabs.js';

/**
 * The terminal order-ticket pattern (spec 24T.2) — the 23.3 re-open,
 * executed on the 24T capture pack (`.playwright-cli/captures-v5/terminal/`:
 * 8 frames of the 344×500 ticket panel + the DOM dumps). The public trade
 * form (23.3, the bank-context yellow-CTA sheet) REMAINS a separate
 * surface; this story is the terminal's own register, measured.
 *
 * GROUNDING (measured, see the spec's grounding section): panel 344 wide;
 * order modes are TABS (live DOM role=tablist, Market/Limit/Stop/Iceberg,
 * Iceberg disabled); NumericInput steppers sit OUTSIDE the tab order
 * (live DOM tabindex="-1", aria-label «Плюс»/«Минус», minus disabled at
 * the boundary); the bottom block is TWO columns — each owns its limits
 * strip (h27, inset field fill, label left / value right) and its CTA
 * (155×32, gap 8, ≈4 radius); the CTA pair is theme-invariant
 * `--tk-color-trade-buy`/`--tk-color-sell`… buy/sell fills with white
 * labels (24T.2 button variants positive/negative on the compact size —
 * its 32px visual pill IS the measured terminal pill).
 *
 * NOT GROUNDed (kit-register picks, recorded): the tab indicator (the
 * live DOM names tabs but the frames pin no indicator style — the kit's
 * default pill), the limits-strip radius, the stepper hit size. The
 * strip fill rides `--tk-color-surface-field` (the field-inset semantic
 * the strip plays in the live panel; the exact live hexes differ per
 * theme and carry no token counterpart — recorded, not minted).
 *
 * A11Y CONTRACT (AC4): the tabs ride tk-tabs (the kit's APG tabs — roving
 * tabindex, arrow/Home/End walk, automatic activation, aria-selected,
 * tabpanel/aria-labelledby wiring, disabled Iceberg skipped); the steppers
 * are REAL buttons with the measured aria-labels, deliberately NOT tab
 * stops (the live DOM mechanics — keyboard types digits, the buttons are
  * pointer affordances); the fields carry sr-only labels; the limits
 * strips are plain text. The keyboard checklist is visible prose; the
 * visual suite runs axe on this story in both themes.
 *
 * DATA (AC5 — the PD gate): instrument, prices and every «Доступно»
 * figure are FICTIONAL demo numbers; the live user's values were
 * redacted in the captures and are never transcribed here.
 */

/** Fictional demo portfolio figures (the PD gate — invented). */
const AVAILABLE_BUY = '150 000 ₽';
const AVAILABLE_SELL = '120';

/** Order-mode tabs — the measured live tablist, Iceberg disabled (DOM). */
const MODE_TABS = [
  { value: 'market', label: 'Маркет' },
  { value: 'limit', label: 'Лимит' },
  { value: 'stop', label: 'Условный' },
  { value: 'iceberg', label: 'Айсберг', disabled: true },
];

const meta: Meta = {
  title: 'Invest/Terminal ticket',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const TerminalTicket: Story = {
  name: 'Терминальный тикет',
  render: () => {
    // One-shot demo consumer (the trade-form mold): the closure is the
    // state holder, DOM queries are the update channel.
    const state = { lots: 1 };
    const syncLots = (): void => {
      document.querySelectorAll<TkInput>('.tt-lots').forEach((field) => {
        field.value = String(state.lots);
      });
      // The measured DOM mechanics: the stepper pair disables AT the
      // boundary (minus at the floor, plus at the ceiling) — every stepper
      // pair in the ticket shares the state.
      document
        .querySelectorAll<HTMLButtonElement>('.tt-step[data-step="-1"]')
        .forEach((btn) => {
          const atFloor = state.lots <= 1;
          btn.disabled = atFloor;
          if (atFloor) btn.setAttribute('aria-disabled', 'true');
          else btn.removeAttribute('aria-disabled');
        });
      document.querySelectorAll<HTMLButtonElement>('.tt-step[data-step="1"]').forEach((btn) => {
        const atCeil = state.lots >= 99;
        btn.disabled = atCeil;
        if (atCeil) btn.setAttribute('aria-disabled', 'true');
        else btn.removeAttribute('aria-disabled');
      });
    };
    const onStep = (event: Event): void => {
      const btn = event.currentTarget as HTMLButtonElement;
      const delta = Number(btn.dataset.step);
      state.lots = Math.min(99, Math.max(1, state.lots + delta));
      syncLots();
    };
    const onLotsType = (event: Event): void => {
      const text = (event as CustomEvent<{ value: string }>).detail.value.trim();
      const parsed = Number.parseInt(text, 10);
      if (Number.isFinite(parsed)) state.lots = Math.min(99, Math.max(1, parsed));
      syncLots();
    };

    /** The stepper pair — the measured NumericInput affordance inside the field. */
    const steppers = html`
      <span slot="badge" class="tt-steppers">
        <button
          class="tt-step"
          type="button"
          data-step="-1"
          tabindex="-1"
          aria-label="Минус"
          disabled
          aria-disabled="true"
          @click=${onStep}
        >
          <span class="tt-step__glyph" aria-hidden="true">−</span>
        </button>
        <button
          class="tt-step"
          type="button"
          data-step="1"
          tabindex="-1"
          aria-label="Плюс"
          @click=${onStep}
        >
          <span class="tt-step__glyph" aria-hidden="true">+</span>
        </button>
      </span>
    `;

    /** A lots field with steppers (every active mode carries one). */
    const lotsField = html`
      <tk-input
        class="tt-lots"
        label="Лоты"
        sr-only
        placeholder="1"
        default-value="1"
        @value-change=${onLotsType}
      >
        ${steppers}
      </tk-input>
    `;

    /** A price field (Limit/Conditional modes only — measured). */
    const priceField = (value: string) => html`
      <tk-input class="tt-price" label="Цена, ₽" sr-only placeholder="0" default-value=${value}>
        <span slot="badge" class="tt-unit" aria-hidden="true">₽</span>
      </tk-input>
    `;

    return html`
      <style>
        /* Full-bleed page surface (the dark-review mold) — the ticket a
           centered 344px column (the measured panel width). */
        .tt-canvas {
          min-height: 100vh;
          box-sizing: border-box;
          padding: var(--tk-space-40) var(--tk-space-24);
          background: var(--tk-color-surface-base);
          font-family: var(--tk-font-body);
          color: var(--tk-color-text-primary);
        }
        .tt-sheet {
          max-width: 344px;
          margin: 0 auto;
        }
        .tt-canvas h1 {
          margin: 0 0 var(--tk-space-8);
          font-family: var(--tk-font-heading);
          font-size: var(--tk-text-heading-4-size);
          font-weight: var(--tk-text-heading-4-weight);
          line-height: var(--tk-text-heading-4-leading);
        }
        .tt-canvas .tt-note {
          margin: 0 0 var(--tk-space-24);
          font-size: var(--tk-text-body-s-size);
          line-height: var(--tk-text-body-s-leading);
          color: var(--tk-color-text-secondary);
        }
        .tt-ticket {
          display: flex;
          flex-direction: column;
          gap: var(--tk-space-16);
        }
        .tt-mode {
          display: flex;
          flex-direction: column;
          gap: var(--tk-space-12);
        }
        .tt-iceberg {
          margin: 0;
          font-size: var(--tk-text-body-s-size);
          line-height: var(--tk-text-body-s-leading);
          color: var(--tk-color-text-secondary);
        }
        /* The stepper pair inside the field's badge slot — pointer
           affordances OUTSIDE the tab order (measured DOM). 28px hit size
           and the 2px pair gap are kit-register picks (not measured). */
        .tt-steppers {
          display: inline-flex;
          gap: 2px;
        }
        .tt-step {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--tk-color-text-secondary);
          font-family: var(--tk-font-body);
          font-size: var(--tk-text-body-l-bold-size);
          font-weight: var(--tk-text-body-l-bold-weight);
          line-height: 1;
          cursor: pointer;
        }
        .tt-step:hover {
          color: var(--tk-color-text-primary);
        }
        .tt-step:focus-visible {
          outline: 2px solid var(--tk-color-focus-ring);
          outline-offset: 2px;
          border-radius: var(--tk-radius-xs);
        }
        .tt-step[disabled] {
          opacity: 0.4;
          cursor: default;
        }
        .tt-step__glyph {
          pointer-events: none;
        }
        .tt-unit {
          color: var(--tk-color-text-secondary);
        }
        /* The bottom block: two columns, gap 8 (measured). Each column owns
           its limits strip and its CTA. */
        .tt-actions {
          display: flex;
          gap: var(--tk-space-8);
        }
        .tt-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--tk-space-8);
        }
        /* The limits strip — h27 measured (structural literal), the
           field-inset semantic fill, label left / value right. */
        .tt-limit {
          box-sizing: border-box;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--tk-space-12);
          border-radius: var(--tk-radius-sm);
          background: var(--tk-color-surface-field);
          font-size: var(--tk-text-body-s-size);
          line-height: var(--tk-text-body-s-leading);
          color: var(--tk-color-text-secondary);
        }
        .tt-limit__value {
          color: var(--tk-color-text-primary);
          font-weight: var(--tk-text-body-m-bold-weight);
        }
        /* The CTA pair at the measured 155px width: the pill lives in
           shadow DOM and sizes to content, so the validated full-width
           recipe (homepage UX-DR14) flips the host to a COLUMN flex — the
           pill becomes a cross-axis item and the default align-items
           stretch stretches it to the full 155. */
        .tt-column tk-button.tt-cta {
          display: flex;
          flex-direction: column;
          width: 155px;
        }
      </style>
      <main class="tt-canvas">
        <div class="tt-sheet">
          <h1>Терминальный тикет</h1>
          <p class="tt-note">
            Терминальный бланк заявки на измеренном материале
            (captures-v5/terminal): режимы — табы tk-tabs (APG: стрелки
            ходят по режимам, Home/End — в начало/конец, выбор следует за
            фокусом; «Айсберг» недоступен), поля цены и лотов — tk-input со
            степперами внутри поля: степперы — реальные кнопки, но ВНЕ
            таб-порядка (Tab их пропускает — клавиатура вводит цифрами
            напрямую; на границе диапазона шаг отключается), внизу — пара
            «Доступно» + CTA Купить/Продать (155×32, терминальные заливки
            theme-invariant, вариант positive/negative). Инструмент, цены и
            лимиты — вымышленные демо-данные. Плотная панель 344 — замер.
          </p>
          <div class="tt-ticket">
            <tk-tabs .tabs=${MODE_TABS} default-value="market">
              <div slot="tab-0" class="tt-mode">${lotsField}</div>
              <div slot="tab-1" class="tt-mode">${priceField('253,70')} ${lotsField}</div>
              <div slot="tab-2" class="tt-mode">${priceField('249,00')} ${lotsField}</div>
              <div slot="tab-3" class="tt-mode">
                <p class="tt-iceberg">Скрытая заявка недоступна в демо-терминале.</p>
              </div>
            </tk-tabs>
            <div class="tt-actions">
              <div class="tt-column">
                <div class="tt-limit">
                  <span>Доступно</span>
                  <span class="tt-limit__value">${AVAILABLE_BUY}</span>
                </div>
                <tk-button class="tt-cta" variant="positive" size="compact">Купить</tk-button>
              </div>
              <div class="tt-column">
                <div class="tt-limit">
                  <span>Доступно</span>
                  <span class="tt-limit__value">${AVAILABLE_SELL}</span>
                </div>
                <tk-button class="tt-cta" variant="negative" size="compact">Продать</tk-button>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;
  },
};
