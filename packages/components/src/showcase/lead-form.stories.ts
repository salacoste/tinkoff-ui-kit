import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../checkbox/checkbox.js';
import '../input/input.js';
import '../link/link.js';
import { showToast } from '../toast/show.js';
import type { TkButton } from '../button/button.js';
import type { TkCheckbox } from '../checkbox/checkbox.js';
import type { TkInput } from '../input/input.js';

/**
 * The lead form (spec 24.3, pattern wave 24a): phone + consent + CTA — the
 * single most repeated form shape on the invest surfaces (gap-6 ×3 +
 * gap-3 hub). All atoms exist (tk-input type=tel, tk-checkbox, tk-button,
 * tk-link); what's missing is the LAYOUT RECIPE — this story pins it in two
 * variants on one canvas: (а) the standalone hero cluster, (б) the embed
 * wrapper (the 320px «iframe view» without hero chrome). Zero atom edits,
 * zero token edits; the variant difference is consumer CSS only.
 *
 * REAL FORMS (AC2): both variants are native `<form>`s — label+input pairs,
 * the consent checkbox (a FICTIONAL consent wording, not a copy of the live
 * legal text), the CTA DISABLED until consent (demo state), «Назад» as
 * tk-link. The same web-component caveat as 24.2: submission is wired
 * through the form element (Enter submits), the CTA calls requestSubmit().
 *
 * VALIDATION + SUBMIT (demo logic, the 23.3 closure mold): the phone mask is
 * a STORY-level demo (+7 (900) 000-00-00 shape — the mask is NOT a kit
 * feature, Epic 25 VARIANT); submit validates the phone length through
 * tk-input's `error` channel and — on success — fires the sanctioned
 * imperative toast «Заявка отправлена (демо)». Nothing leaves the page.
 *
 * HEADINGS (AC3): one h1, one h2 per variant; the keyboard checklist is
 * pinned in the visible prose; axe in both themes.
 *
 * DATA (the PD gate): every name/phone in the placeholders is FICTIONAL;
 * RU content, EN story meta.
 */

const PHONE_LEN = 11;

/** Demo phone mask (story logic — NOT a kit feature): digits → +7 (900) 000-00-00. */
const maskPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, PHONE_LEN);
  const body = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  const parts = [
    body.slice(0, 3),
    body.slice(3, 6),
    body.slice(6, 8),
    body.slice(8, 10),
  ].filter(Boolean);
  let out = '+7';
  if (parts[0]) out += ` (${parts[0]}`;
  if (parts[0]?.length === 3) out += ')';
  if (parts[1]) out += ` ${parts[1]}`;
  if (parts[2]) out += `-${parts[2]}`;
  if (parts[3]) out += `-${parts[3]}`;
  return out;
};

/** Wire one lead form: consent gate, phone mask, validation, demo submit. */
const wireLead = (formId: string, phoneId: string, consentId: string, ctaId: string) => {
  const form = document.querySelector<HTMLFormElement>(`#${formId}`);
  if (!form) return;
  const phone = () => document.querySelector<TkInput>(`#${phoneId}`);
  const consent = () => document.querySelector<TkCheckbox>(`#${consentId}`);
  const cta = () => document.querySelector<TkButton>(`#${ctaId}`);

  const syncCta = () => {
    const button = cta();
    if (button) button.disabled = !(consent()?.checked ?? false);
  };

  consent()?.addEventListener('checked-change', syncCta);

  phone()?.addEventListener('value-change', (event) => {
    const field = phone();
    if (!field) return;
    const masked = maskPhone((event as CustomEvent<{ value: string }>).detail.value);
    if (masked !== field.value) field.value = masked;
    if (field.error) field.error = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const field = phone();
    if (!field) return;
    const digits = (field.value ?? '').replace(/\D/g, '');
    if (digits.length < PHONE_LEN) {
      field.error = 'Введите телефон полностью';
      return;
    }
    showToast({ message: 'Заявка отправлена (демо)' });
  });
};

const canvasStyles = html`
  <style>
    .lf-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .lf-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-40);
    }
    .lf-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .lf-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .lf-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .lf-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    /* (а) STANDALONE: the hero cluster — heading register + wide form.
       surface-BASE (the business-landing form-card mold), NOT muted: the
       tk-link «Назад» rides --tk-color-link, which is tuned to surface-base
       (4.62 AA) and drops to 4.24 on muted — the v1.4.0 law: links never
       sit on muted boxes. */
    .lf-standalone {
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-32);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-xxl);
      background: var(--tk-color-surface-base);
    }
    .lf-standalone__heading {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .lf-standalone__sub {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    /* (б) EMBED: the 320px «iframe view» — no hero chrome, name field added. */
    .lf-embed {
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-24);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .lf-form {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .lf-actions {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .lf-actions tk-button {
      width: 100%;
    }
    .lf-back {
      align-self: center;
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Lead form',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const LeadForm: Story = {
  name: 'Лид-форма',
  render: () => {
    queueMicrotask(() => {
      wireLead('lf-form-a', 'lf-phone-a', 'lf-consent-a', 'lf-cta-a');
      wireLead('lf-form-b', 'lf-phone-b', 'lf-consent-b', 'lf-cta-b');
    });
    return html`
      ${canvasStyles}
      <main class="lf-canvas">
        <p class="lf-note">
          Лид-форма (спека 24.3): телефон + согласие + жёлтая CTA — самый
          повторяющийся бланк invest-поверхностей, оба варианта на одной
          канве. Рецепты: (а) standalone — hero-кластер (заголовок + форма,
          широкая карта на surface-base с рамкой — молд business-landing;
          НЕ surface-muted: tk-link «Назад» сидит на --tk-color-link,
          который тюнен под surface-base (4.62 AA), а на muted даёт 4.24 —
          записанный закон v1.4.0: ссылки не живут на muted-коробках;
          CTA во всю ширину); (б) embed —
          узкая карта 320px «iframe-вид» без hero-хрома, добавлено поле
          имени. Оба варианта — реальные form'ы: Enter отправляет, CTA идёт
          через requestSubmit() (теневая кнопка кастомного элемента не
          ассоциирована с формой — сабмит заведён через сам form). Состояние —
          демо-логика стори: CTA заблокирована до согласия; телефон
          маскируется на лету (+7 (900) 000-00-00 — маска НЕ фича кита, а
          стори-логика); неполный номер → ошибка через error-канал tk-input.
          Отправка никуда не идёт — тост «Заявка отправлена (демо)».
          Клавиатура: Tab — поля, чекбокс, кнопки; пробел переключает
          чекбокс; Enter в поле телефона отправляет форму. Обе темы — без
          правок состава. Формулировка согласия и все плейсхолдеры
          вымышленные.
        </p>
        <div class="lf-layout">
          <h1 class="lf-title">Лид-форма</h1>

          <section class="lf-section" aria-labelledby="lf-standalone-title">
            <h2 class="lf-section__title" id="lf-standalone-title">
              Standalone — hero-кластер
            </h2>
            <div class="lf-standalone">
              <p class="lf-standalone__heading">Начните инвестировать</p>
              <p class="lf-standalone__sub">
                Оставьте телефон — демо-форма покажет паттерн заявки. Это
                демонстрация: данные никуда не отправляются.
              </p>
              <form class="lf-form" id="lf-form-a" novalidate>
                <tk-input
                  id="lf-phone-a"
                  label="Телефон"
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  name="phone"
                  autocomplete="tel"
                ></tk-input>
                <tk-checkbox id="lf-consent-a" name="consent">
                  Согласен на обработку указанных данных демо-формой
                  (вымышленная формулировка для демонстрации)
                </tk-checkbox>
                <div class="lf-actions">
                  <tk-button id="lf-cta-a" disabled>
                    Оставить заявку
                  </tk-button>
                  <tk-link
                    class="lf-back"
                    href="#"
                    @click=${(event: Event) => event.preventDefault()}
                    >Назад</tk-link
                  >
                </div>
              </form>
            </div>
          </section>

          <section class="lf-section" aria-labelledby="lf-embed-title">
            <h2 class="lf-section__title" id="lf-embed-title">
              Embed — «iframe-вид» 320px
            </h2>
            <form class="lf-embed" id="lf-form-b" novalidate>
              <tk-input
                id="lf-name-b"
                label="Имя"
                placeholder="Как к вам обращаться"
                name="name"
                autocomplete="name"
              ></tk-input>
              <tk-input
                id="lf-phone-b"
                label="Телефон"
                type="tel"
                placeholder="+7 (900) 000-00-00"
                name="phone"
                autocomplete="tel"
              ></tk-input>
              <tk-checkbox id="lf-consent-b" name="consent">
                Согласен на обработку указанных данных демо-формой
                (вымышленная формулировка для демонстрации)
              </tk-checkbox>
              <div class="lf-actions">
                <tk-button
                  id="lf-cta-b"
                  disabled
                  @click=${() =>
                    document.querySelector<HTMLFormElement>('#lf-form-b')?.requestSubmit()}
                >
                  Оставить заявку
                </tk-button>
                <tk-link
                  class="lf-back"
                  href="#"
                  @click=${(event: Event) => event.preventDefault()}
                  >Назад</tk-link
                >
              </div>
            </form>
          </section>
        </div>
      </main>
    `;
  },
};
