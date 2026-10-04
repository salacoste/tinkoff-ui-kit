import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../input/input.js';
import type { TkInput } from '../input/input.js';
import { showToast } from '../toast/show.js';

/**
 * The gift certificate page (spec 24.15, pattern wave 24b — the wave's
 * closing story): gap-7's «Вам подарили долю в компании» — the
 * certificate card + the promo-code entry. The claim steps are COVERED
 * (tk-stepper, out of scope); NO countdown is claimed anywhere — the
 * capture shows no deadline evidence.
 *
 * HONEST GROUNDING (recorded per the AC): gift-certificate/promo-code
 * is CENSUS-INFERRED, not image-verified — every geometry below is a
 * kit REGISTER pick, not a measurement (GAP-MAP Deferred).
 *
 * THE CERTIFICATE CARD (the lead-form 24.3 mold): a consumer
 * surface-base card with a hairline — heading-register title, the
 * fictional share line, the nominal, the OPTIONAL sender (presence
 * mold: no value → no node) and the serial-number stub. The serial is
 * READABLE by screen readers (never aria-hidden) — it identifies the
 * certificate; its letter tracking is consumer CSS (see below).
 *
 * THE PROMO CONTRACT (the 24.2/24.3 caveats): a REAL native form —
 * label+input pair, Enter submits, the CTA goes through
 * requestSubmit() (a shadow button is not form-associated), a short
 * code surfaces through tk-input's error channel, success fires the
 * sanctioned imperative toast; nothing leaves the page. The code's
 * letter TRACKING stays consumer CSS demonstrated on the certificate
 * serial — the mono font slot remains docs-only by the 11.2 ruling
 * (and tk-input's field lives in the shadow root, out of consumer
 * CSS reach — no atom edits).
 *
 * DATA (the PD gate): the company, share, nominal, sender and serial
 * are FICTIONAL. Story-canvas styling consumes var(--tk-*) tokens only
 * (FR-1).
 */

type GiftCertificateArgs = Record<string, never>;

const NBSP = '\u00A0';

/** The demo serial — fictional, letter-tracked by consumer CSS. */
const DEMO_SERIAL = 'DEMO-42-000017';

/** Wire the promo form: validation through tk-input's error channel. */
const wirePromo = (formId: string, inputId: string) => {
  const form = document.querySelector<HTMLFormElement>(`#${formId}`);
  if (!form) return;
  const field = () => document.querySelector<TkInput>(`#${inputId}`);
  // The demo consumer's closure (the 24.2 screener mold): the uncontrolled
  // tk-input keeps its value in the shadow field — the latest string rides
  // value-change events, host.value stays undefined.
  let current = '';

  field()?.addEventListener('value-change', (event) => {
    current = (event as CustomEvent<{ value: string }>).detail.value;
    const input = field();
    if (input?.error) input.error = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = field();
    if (!input) return;
    if (current.trim().length < 8) {
      input.error = 'Промокод короткий — введите полностью (демо-проверка)';
      return;
    }
    showToast({ message: 'Сертификат активирован (демо)' });
  });
};

const canvasStyles = html`
  <style>
    .gc-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .gc-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .gc-layout {
      max-width: 560px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-32);
    }
    .gc-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .gc-sub {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .gc-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    /* THE CERTIFICATE CARD (the lead-form 24.3 mold): surface-base,
       hairline all four sides, generous padding — the wide form-card
       register (a kit register pick, NOT a live measurement). */
    .gc-cert {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-32);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-base);
    }
    .gc-cert__head {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      color: var(--tk-color-text-secondary);
    }
    .gc-cert__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .gc-cert__share {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .gc-cert__line {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE SERIAL: letter-tracked caps — the consumer-CSS demonstration
       of code tracking (the mono slot stays docs-only by the 11.2
       ruling). Readable by screen readers — it identifies the
       certificate, never aria-hidden. */
    .gc-cert__serial {
      margin: var(--tk-space-8) 0 0;
      padding-top: var(--tk-space-16);
      border-top: 1px solid var(--tk-color-border-table);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--tk-color-text-secondary);
    }
    /* THE PROMO FORM: label+input + CTA, one column (the claim-step
       register). */
    .gc-promo {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .gc-promo__actions {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .gc-hint {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

/** Decorative gift glyph — currentColor, aria-hidden in the template. */
const GIFT_ICON = html`
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="9" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.5"></rect>
    <path d="M4 13h16M12 9v11" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M12 9c-3.5 0-4.8-1.6-4-3.2.8-1.5 3-.9 4 3.2 1-4.1 3.2-4.7 4-3.2.8 1.6-.5 3.2-4 3.2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
  </svg>
`;

const meta: Meta<GiftCertificateArgs> = {
  title: 'Invest/Gift certificate',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<GiftCertificateArgs>;

export const CertificatePage: Story = {
  name: 'Вам подарили долю',
  render: () => {
    queueMicrotask(() => wirePromo('gc-form', 'gc-promo-field'));
    return html`
    ${canvasStyles}
    <main class="gc-canvas">
      <p class="gc-note">
        Подарочный сертификат (спека 24.15): СЕРТИФИКАТ-КАРТОЧКА (молд
        lead-form 24.3: surface-base карта с хайрлайном) — заголовок-регистр,
        вымышленная «доля в компании», номинал, ОПЦИОНАЛЬНЫЙ отправитель
        (молд присутствия: нет значения — нет узла) и серийный
        номер-стаб, который читается скринридером (не aria-hidden).
        ПРОМОКОД-ВВОД — реальный нативный form: Enter сабмитит, CTA —
        через requestSubmit() (теневая кнопка кастомного элемента не
        form-associated, каверзы 24.2/24.3), короткий код → error-канал
        tk-input, успех → санкционированный тост; ничего не уходит со
        страницы. БУКВЕННЫЙ ТРЕКИНГ кода — потребительский CSS,
        продемонстрирован на серийнике сертификата (letter-spacing +
        капс); слот --tk-font-mono остаётся docs-only (правило 11.2), а
        поле tk-input живёт в теневом корне — извне не стилизуется,
        атомных правок нет. ЧЕСТНОЕ ЗАЗЕМЛЕНИЕ: gift-certificate и
        промокод — census-inferred, НЕ image-verified; все геометрии —
        регистры кита, не замеры (GAP-MAP Deferred). Обратного отсчёта
        НЕТ — улик не найдено, не заявляется. Клавиатура: Tab — поле
        промокода, CTA; Enter в поле сабмитит форму. Обе темы — без
        правок состава. Компания, доля, номинал, отправитель и серийник
        вымышленные.
      </p>
      <div class="gc-layout">
        <h1 class="gc-title">Вам подарили долю (демо)</h1>
        <p class="gc-sub">
          Вымышленный сценарий: друг подарил вам демо-долю. Активируйте
          сертификат промокодом — всё на этой странице демо, без эффекта
          вне её.
        </p>
        <section aria-label="Сертификат">
          <h2 class="gc-section__title">Сертификат</h2>
          <div class="gc-cert">
            <div class="gc-cert__head">
              ${GIFT_ICON}
              <h3 class="gc-cert__title">Доля в компании «Демо-Пекарня №7»</h3>
            </div>
            <p class="gc-cert__share">0,5${NBSP}% уставного капитала</p>
            <p class="gc-cert__line">Номинал: 5${NBSP}000${NBSP}₽</p>
            <p class="gc-cert__line">Отправитель: Демо-Анна</p>
            <p class="gc-cert__serial">Серия ${DEMO_SERIAL}</p>
          </div>
        </section>
        <section aria-label="Активация">
          <h2 class="gc-section__title">Активация</h2>
          <form class="gc-promo" id="gc-form" novalidate>
            <tk-input
              id="gc-promo-field"
              label="Промокод"
              placeholder="DEMO-XXXX-XXXX"
              name="promo"
              autocomplete="off"
            ></tk-input>
            <div class="gc-promo__actions">
              <tk-button
                id="gc-cta"
                variant="primary"
                @click=${() =>
                  document.querySelector<HTMLFormElement>('#gc-form')?.requestSubmit()}
                >Активировать сертификат</tk-button
              >
              <span class="gc-hint">Демо-подсказка: любой код от 8 символов подходит</span>
            </div>
          </form>
        </section>
      </div>
    </main>
    `;
  },
};
