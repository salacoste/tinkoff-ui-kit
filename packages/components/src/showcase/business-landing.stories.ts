import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../navbar/navbar.js';
import type { TkNavbarLink } from '../navbar/navbar.js';
import '../button/button.js';
import '../service-card/service-card.js';
import '../promo-card/promo-card.js';
import '../stepper/stepper.js';
import type { TkStepperStep } from '../stepper/stepper.js';
import '../segmented-radio/segmented-radio.js';
import type { TkSegmentedRadioOption } from '../segmented-radio/segmented-radio.js';
import '../input/input.js';
import '../checkbox/checkbox.js';
import '../link/link.js';
import '../footer/footer.js';
import type { TkFooterColumn, TkFooterLink } from '../footer/footer.js';
import '../toast/toast.js';
import { showToast } from '../toast/show.js';

/**
 * The composed business landing (spec 7.4) — FR-12's composition consequence
 * for the business domain: the v2/v1 surfaces assembled top→bottom over the
 * warm-cream page tokens (6.1) — 7.1 tk-navbar (bank-wide row ONLY: the
 * business capture shows no second row — probed), the hero service-selector
 * (marketing heading register + a five-card selector cluster), the asymmetric
 * 2+3 bento of FLAT cream cards built on the EXISTING tk-promo-card + its §6
 * surface hooks with floating white-pill CTAs over token-read art, 7.3
 * tk-stepper (white cards on cream), the v1-composed application form cluster
 * (segmented toggle → phone input → 1px divider → consent + primary submit;
 * the application-form mold wiring with validation + toast), and the v1
 * tk-footer. A SHOWCASE story in the `src/showcase/` mold — this is assembly,
 * not a component; the application-form closure-state + `render(view, host)`
 * pattern verbatim, so element instances (and focus) survive every
 * re-render and only derived bindings move.
 *
 * ASSEMBLY-STANDARD record (spec's ruling): reading order, cluster, wiring —
 * not per-pixel matching. Per-component fidelity deltas live in each
 * component's verify NOTES (.playwright-cli/verify/{mega-nav,stepper}/);
 * the assembly-level deltas (token-name divergence, the card-structure
 * inversion, the radius mapping, the steps title/text mapping, the visible
 * phone label) are measured and cited in
 * .playwright-cli/verify/business-landing/NOTES.md.
 *
 * WIRING MAP:
 * - MODE TOGGLE — `value-change` from tk-segmented-radio carries 'account' /
 *   'business'; the state keeps it and the SUBMIT label + toast copy derive
 *   from it (the reference's own «Открыть счет»/«Открыть бизнес» register).
 * - PHONE — `value-change` feeds the state; any edit clears the error
 *   (the mold's own rule). Submit with an empty phone drives tk-input's
 *   `error` prop («Введите номер телефона») — aria-describedby wiring is the
 *   component's own.
 * - CONSENT — `checked-change` feeds the state (present in the composition
 *   per the frozen spec; NOT submit-gated — the mold's own consent rule and
 *   the reference's own informational consent reading).
 * - SUBMIT — valid → `loading` for 1200ms → state reset + `showToast`
 *   confirmation (the imperative §9-sanctioned helper).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. All illustration art is
 * the 2.6 technique: inline SVG whose fills are READ from the token layer
 * via getComputedStyle (no color literal in this source). RU content,
 * EN meta.
 */

/** Reads a token's computed value (the 2.6 artwork source — no literals here). */
const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/** One selector seat — the hero's service cluster (capture: 5 fanned cards). */
interface SelectorService {
  /** Stable key (the card is passive — display only). */
  value: string;
  /** Service label — the capture's own card captions. */
  label: string;
  /** Abstract art motif (aria-hidden iconography, token-read fills). */
  art: string;
}

/** One bento seat — the product grid card copy (capture, verbatim). */
interface BentoProduct {
  /** Card heading — the capture's bold line. */
  heading: string;
  /** Card description — the capture's body line. */
  description: string;
  /** Abstract art motif for the lower zone. */
  art: string;
}

/* ------------------------------------------------------------------ art ---
 * Abstract token-read illustrations (2.6): every fill is a live token read,
 * every shape is structural geometry. Yellow appears ONLY here inside the
 * illustrations — never as UI chrome (the recon's own rule), except the
 * sanctioned primary CTAs the form/hero clusters carry.
 */

const selectorIcon = (motif: string): string => {
  const ink = tokenColor('--tk-color-ink-300');
  const yellow = tokenColor('--tk-color-yellow-100');
  const base = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">';
  const shapes: Record<string, string> = {
    account:
      `<rect x="6" y="12" width="36" height="26" rx="6" fill="${yellow}"/>` +
      `<rect x="6" y="18" width="36" height="6" fill="${ink}"/>`,
    credit:
      `<circle cx="18" cy="30" r="12" fill="${yellow}"/>` +
      `<circle cx="31" cy="22" r="9" fill="${ink}" fill-opacity="0.85"/>`,
    acquiring:
      `<rect x="8" y="6" width="32" height="24" rx="5" fill="${yellow}"/>` +
      `<rect x="14" y="34" width="20" height="8" rx="3" fill="${ink}"/>`,
    seller:
      `<rect x="8" y="14" width="32" height="24" rx="4" fill="${yellow}"/>` +
      `<rect x="20" y="6" width="16" height="10" rx="3" fill="${ink}" fill-opacity="0.85"/>`,
    fuel:
      `<rect x="12" y="10" width="18" height="32" rx="5" fill="${yellow}"/>` +
      `<path d="M32 14l8 8v12a4 4 0 01-8 0z" fill="${ink}" fill-opacity="0.85"/>`,
  };
  return base + (shapes[motif] ?? '') + '</svg>';
};

const bentoArt = (motif: string): string => {
  const ink = tokenColor('--tk-color-ink-300');
  const yellow = tokenColor('--tk-color-yellow-100');
  const surface = tokenColor('--tk-color-white');
  const base = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" fill="none">';
  const shapes: Record<string, string> = {
    account:
      `<rect x="30" y="52" width="120" height="52" rx="10" fill="${surface}"/>` +
      `<rect x="46" y="38" width="120" height="52" rx="10" fill="${yellow}"/>` +
      `<rect x="62" y="24" width="120" height="52" rx="10" fill="${ink}"/>`,
    registration:
      `<rect x="58" y="18" width="84" height="88" rx="8" fill="${surface}"/>` +
      `<rect x="72" y="32" width="56" height="8" rx="4" fill="${ink}" fill-opacity="0.3"/>` +
      `<rect x="72" y="48" width="56" height="8" rx="4" fill="${ink}" fill-opacity="0.3"/>` +
      `<circle cx="100" cy="80" r="18" fill="${yellow}"/>` +
      `<path d="M92 80l6 6 11-12" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    credit:
      `<ellipse cx="100" cy="96" rx="64" ry="10" fill="${ink}" fill-opacity="0.12"/>` +
      `<rect x="56" y="62" width="44" height="30" rx="8" fill="${yellow}"/>` +
      `<rect x="76" y="44" width="44" height="30" rx="8" fill="${yellow}"/>` +
      `<rect x="96" y="26" width="44" height="30" rx="8" fill="${ink}"/>`,
    payments:
      `<rect x="30" y="30" width="70" height="60" rx="8" fill="${surface}"/>` +
      `<rect x="30" y="30" width="70" height="14" rx="7" fill="${ink}"/>` +
      `<rect x="112" y="46" width="58" height="40" rx="8" fill="${yellow}"/>` +
      `<rect x="122" y="58" width="38" height="6" rx="3" fill="${ink}" fill-opacity="0.4"/>`,
    accounting:
      `<rect x="42" y="70" width="24" height="30" rx="4" fill="${yellow}"/>` +
      `<rect x="76" y="54" width="24" height="46" rx="4" fill="${yellow}"/>` +
      `<rect x="110" y="38" width="24" height="62" rx="4" fill="${ink}"/>` +
      `<circle cx="156" cy="76" r="16" fill="${yellow}"/>`,
  };
  return base + (shapes[motif] ?? '') + '</svg>';
};

/* ----------------------------------------------------------------- data --- */

/** The bank-wide row 1 (the 7.1/6.5 story's own set — «Бизнесу» active here). */
const MEGA_LINKS: TkNavbarLink[] = [
  { value: 'bank', label: 'Банк', href: '#bank' },
  { value: 'business', label: 'Бизнесу', href: '#business' },
  { value: 'invest', label: 'Инвестиции', href: '#invest' },
  { value: 'mobile', label: 'Мобильная связь', href: '#mobile' },
  { value: 'insurance', label: 'Страхование', href: '#insurance' },
  { value: 'travel', label: 'Путешествия', href: '#travel' },
];

/** The hero selector cluster — the capture's five service cards, verbatim. */
const SELECTOR_SERVICES: SelectorService[] = [
  { value: 'account', label: 'Расчетный счет', art: 'account' },
  { value: 'credit', label: 'Кредиты', art: 'credit' },
  { value: 'acquiring', label: 'Торговый эквайринг', art: 'acquiring' },
  { value: 'seller', label: 'Селлер', art: 'seller' },
  { value: 'fuel', label: 'Топливо', art: 'fuel' },
];

/** The bento product grid — capture copy verbatim; rows 2+3 by reading order. */
const BENTO_PRODUCTS: BentoProduct[] = [
  {
    heading: 'Счет для бизнеса',
    description:
      'Бесплатное открытие. Первые два месяца обслуживания — 0 ₽. Бонусы от партнеров на сумму до 500 000 ₽',
    art: 'account',
  },
  {
    heading: 'Регистрация ИП и ООО',
    description:
      'Бесплатно, без поездок в офис банка или налоговую. Не надо платить госпошлину',
    art: 'registration',
  },
  {
    heading: 'Кредиты на любые цели',
    description: 'До 300 000 000 ₽ на срок до 10 лет. Решение от 2 минут',
    art: 'credit',
  },
  {
    heading: 'Прием платежей',
    description:
      'Принимайте оплату картами, через СБП и Pay-сервисы — офлайн и онлайн. Комиссия от 0,2%',
    art: 'payments',
  },
  {
    heading: 'Бухгалтерия от 0 ₽',
    description: 'Онлайн-бухгалтерия и бухгалтерское обслуживание',
    art: 'accounting',
  },
];

/**
 * The steps block (7.3 tk-stepper). The reference shows ONE text line per
 * card; the element's frozen shape is {title,text}. Mapping (recorded in the
 * verify NOTES): step 1 splits at the reference's own dash — both halves
 * verbatim; the single-clause steps 2–3 carry the full sentence as the title
 * with empty text (the empty p renders nothing — the component's own
 * zero-content rule keeps it rhythm-free). Zero invented copy.
 */
const STEPS: TkStepperStep[] = [
  { title: 'Заполните заявку онлайн', text: 'Вам не нужно посещать офис' },
  { title: 'Представитель банка бесплатно доставит вам документы', text: '' },
  { title: 'Начните пользоваться счетом', text: '' },
];

/** The form's mode toggle — the capture's segmented pair. */
const MODE_OPTIONS: TkSegmentedRadioOption[] = [
  { value: 'account', label: 'Открыть счет' },
  { value: 'business', label: 'Открыть бизнес' },
];

/** The reference directory (business capture reading) — six columns. */
const FOOTER_COLUMNS: TkFooterColumn[] = [
  {
    title: 'Счет и платежи',
    links: [
      { label: 'Расчетный счет', href: '#account' },
      { label: 'Эквайринг', href: '#acquiring' },
      { label: 'Зарплатный проект', href: '#payroll' },
      { label: 'Платежи и переводы', href: '#payments' },
      { label: 'Валютный контроль', href: '#fx' },
    ],
  },
  {
    title: 'Финансирование',
    links: [
      { label: 'Кредиты для бизнеса', href: '#credit' },
      { label: 'Овердрафт', href: '#overdraft' },
      { label: 'Банковские гарантии', href: '#guarantees' },
      { label: 'Лизинг', href: '#leasing' },
      { label: 'Факторинг', href: '#factoring' },
    ],
  },
  {
    title: 'Регистрация',
    links: [
      { label: 'Регистрация ИП', href: '#ip' },
      { label: 'Регистрация ООО', href: '#ooo' },
      { label: 'Смена ОКВЭД', href: '#okved' },
    ],
  },
  {
    title: 'Сервисы',
    links: [
      { label: 'Бухгалтерия', href: '#accounting' },
      { label: 'Онлайн-бухгалтерия', href: '#online-accounting' },
      { label: 'Селлер', href: '#seller' },
      { label: 'Топливо', href: '#fuel' },
    ],
  },
  {
    title: 'Вклады и инвестиции',
    links: [
      { label: 'Вклады для бизнеса', href: '#deposits' },
      { label: 'Накопительный счет', href: '#savings' },
      { label: 'Депозиты', href: '#deposit' },
    ],
  },
  {
    title: 'Еще',
    links: [
      { label: 'О банке', href: '#about' },
      { label: 'Карьера', href: '#careers' },
      { label: 'Контакты', href: '#contacts' },
      { label: 'Тарифы и документы', href: '#tariffs' },
    ],
  },
];

const FOOTER_QUICK: TkFooterLink[] = [
  { label: 'О банке', href: '#about' },
  { label: 'Новости', href: '#news' },
  { label: 'Помощь', href: '#help' },
  { label: 'Работа', href: '#careers' },
  { label: 'Банкоматы', href: '#atm' },
  { label: 'Курсы валют', href: '#rates' },
  { label: 'Контакты', href: '#contacts' },
];

/* ---------------------------------------------------------------- wiring -- */

/** Consumer-side required-phone copy (the mold's own message pattern). */
const PHONE_REQUIRED_MESSAGE = 'Введите номер телефона';
/** Loading window before the reset + toast (the mold's own 1200ms). */
const SUBMIT_RESET_MS = 1200;

/** The whole demo state (the mold: a tiny state object, no framework). */
interface BusinessFormState {
  /** The mode toggle's value ('account' | 'business'). */
  mode: string;
  /** The phone field's live value. */
  phone: string;
  /** Consumer error message for the phone field ('' = none). */
  phoneError: string;
  /** Submit loading flag. */
  submitting: boolean;
  /** The consent checkbox's live state. */
  consent: boolean;
}

const INITIAL_STATE: BusinessFormState = {
  mode: 'account',
  phone: '',
  phoneError: '',
  submitting: false,
  consent: false,
};

/** The submit label + toast subject derive from the mode (the wiring map). */
const modeLabel = (mode: string): string =>
  MODE_OPTIONS.find((option) => option.value === mode)?.label ?? 'Открыть счет';

const meta: Meta = {
  title: 'Showcase/Business landing',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const BusinessLanding: Story = {
  name: 'Лендинг для бизнеса (composed)',
  render: () => {
    const state: BusinessFormState = { ...INITIAL_STATE };
    // The re-render host (the mold): `draw` re-invokes Lit render() into THIS
    // node, so every update diffs in place — element instances and focus
    // survive; only derived bindings move.
    const host = document.createElement('div');

    const update = (patch: Partial<BusinessFormState>): void => {
      Object.assign(state, patch);
      draw();
    };

    /** Mode toggle — drives the submit label + toast copy (see wiring map). */
    const handleModeChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: string }>).detail;
      update({ mode: value });
    };

    /** Phone edits clear the error (the mold's own rule). */
    const handlePhoneChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: string }>).detail;
      update({ phone: value, phoneError: '' });
    };

    /** Consent feeds the state (display + toast copy context; not gated). */
    const handleConsentChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: boolean }>).detail;
      update({ consent: value });
    };

    /** Invalid → inline error; valid → loading → reset + toast (the mold). */
    const handleSubmit = (): void => {
      if (state.phone.trim() === '') {
        update({ phoneError: PHONE_REQUIRED_MESSAGE });
        return;
      }
      update({ submitting: true });
      window.setTimeout(() => {
        update({ phone: '', phoneError: '', consent: false, submitting: false });
        showToast({
          message: `Заявка отправлена: ${modeLabel(state.mode)}. Менеджер свяжется с вами`,
          duration: 5000,
        });
      }, SUBMIT_RESET_MS);
    };

    /** One bento seat: promo-card on the cream hooks + the stage (art + CTA). */
    const bentoCard = (product: BentoProduct) => html`
      <tk-promo-card class="tkb-bento__card" heading=${product.heading} description=${product.description}>
        <div class="tkb-stage" slot="actions">
          <div class="tkb-stage__art" aria-hidden="true">${unsafeSVG(bentoArt(product.art))}</div>
          <tk-button class="tkb-stage__cta" variant="secondary" size="card">Подробнее</tk-button>
        </div>
      </tk-promo-card>
    `;

    const view = () => html`
      <div class="tkb-page">
        <tk-navbar
          class="tkb-navbar"
          ?sticky=${true}
          burger-label="Меню"
          .links=${MEGA_LINKS}
          .activeValue=${'business'}
        >
          <span slot="logo" class="tkb-logo" aria-hidden="true">
            <span class="tkb-logo__shield">Т</span>
          </span>
          <a slot="utilities" class="tkb-utility" href="#search" aria-label="Поиск">
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            >
              <circle cx="10.5" cy="10.5" r="6.5"></circle>
              <path d="M15.5 15.5L21 21"></path>
            </svg>
          </a>
          <a slot="utilities" class="tkb-utility" href="#become-client">Стать клиентом</a>
        </tk-navbar>

        <main class="tkb-main">
          <section class="tkb-hero" data-cluster="hero" aria-labelledby="tkb-hero-title">
            <div class="tkb-container">
              <h1 id="tkb-hero-title" class="tkb-hero__title">
                Узнайте, какие сервисы вам подойдут и чем можно пользоваться бесплатно
              </h1>
              <p class="tkb-hero__sub">
                Ответьте на несколько вопросов теста — подберем сервисы для развития бизнеса
              </p>
              <tk-button class="tkb-hero__cta" variant="primary" size="hero">
                Подобрать варианты
              </tk-button>
            </div>
            <div class="tkb-container">
              <div class="tkb-selector">
                ${SELECTOR_SERVICES.map(
                  (service) => html`
                    <tk-service-card class="tkb-selector__card" heading=${service.label}>
                      <div slot="icon" aria-hidden="true">${unsafeSVG(selectorIcon(service.art))}</div>
                    </tk-service-card>
                  `,
                )}
              </div>
            </div>
          </section>

          <section class="tkb-bento" aria-labelledby="tkb-bento-title">
            <div class="tkb-container">
              <h2 id="tkb-bento-title" class="tkb-section-title">
                Популярные банковские продукты для открытия и ведения бизнеса
              </h2>
              <div class="tkb-bento__row tkb-bento__row--wide">
                ${bentoCard(BENTO_PRODUCTS[0])} ${bentoCard(BENTO_PRODUCTS[1])}
              </div>
              <div class="tkb-bento__row tkb-bento__row--trio">
                ${bentoCard(BENTO_PRODUCTS[2])} ${bentoCard(BENTO_PRODUCTS[3])}
                ${bentoCard(BENTO_PRODUCTS[4])}
              </div>
              <div class="tkb-bento__footer">
                <a class="tkb-all" href="#services">Все сервисы</a>
              </div>
            </div>
          </section>

          <section class="tkb-steps">
            <div class="tkb-container">
              <tk-stepper heading="Откройте счет для бизнеса в Т-Банке" .steps=${STEPS}></tk-stepper>
            </div>
          </section>

          <section class="tkb-form" data-cluster="form" aria-labelledby="tkb-form-title">
            <div class="tkb-container">
              <div class="tkb-form__card">
                <h2 id="tkb-form-title" class="tkb-form__title">
                  Оставьте заявку на расчетный счет
                </h2>
                <tk-segmented-radio
                  class="tkb-form__mode"
                  name="mode"
                  .options=${MODE_OPTIONS}
                  default-value="account"
                  @value-change=${handleModeChange}
                ></tk-segmented-radio>
                <tk-input
                  class="tkb-form__field"
                  label="Телефон"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  placeholder="+7 900 000-00-00"
                  .error=${state.phoneError}
                  @value-change=${handlePhoneChange}
                ></tk-input>
                <hr class="tkb-form__divider" />
                <div class="tkb-form__row">
                  <tk-checkbox
                    class="tkb-form__consent"
                    name="consent"
                    value="granted"
                    @checked-change=${handleConsentChange}
                  >
                    При вводе номера телефона вы соглашаетесь
                    <a class="tkb-form__link" href="#conditions">с условиями</a>
                  </tk-checkbox>
                  <tk-button
                    class="tkb-form__submit"
                    variant="primary"
                    size="hero"
                    ?loading=${state.submitting}
                    @click=${handleSubmit}
                  >
                    ${modeLabel(state.mode)}
                  </tk-button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <tk-footer
          class="tkb-footer"
          .columns=${FOOTER_COLUMNS}
          .quickLinks=${FOOTER_QUICK}
          phone="8 800 333-33-33"
        >
          <p class="tkb-legal__line">
            © 2006—2026, АО «Банк». Информация не является публичной офертой. Услуги
            оказывают <tk-link variant="legal" href="#brokera">ООО «Брокер»</tk-link>
            и <tk-link variant="legal" href="#leasing">ООО «Лизинг»</tk-link> —
            подробности в <tk-link variant="legal" href="#docs">документах</tk-link>.
          </p>
        </tk-footer>

        <section class="tkb-docs" aria-labelledby="tkb-docs-title">
          <div class="tkb-container">
            <h2 id="tkb-docs-title">Как собрано</h2>
            <p>
              Лендинг бизнес-домена собран из компонентов кита и контента, без единого
              нового компонента или токена. Навигация — tk-navbar c банк-рядом
              (захват бизнес-страницы второго ряда не показывает — зонд зафиксирован в
              NOTES); герой — заголовок маркетингового регистра (h1 44 → heading-2) и
              кластер-селектор из пяти tk-service-card на кремовой заливке; бенто 2+3 —
              tk-promo-card на хуках §6 (заливка tint-cream-raised), арт снизу через
              слот actions: сцена = токен-арт + плавающая белая пилюля
              (secondary, size card), техника re-scope из charcoal-варианта держит
              пилюлю белой в обеих темах; шаги — tk-stepper 7.3 на кремовой странице;
              форма — tk-segmented-radio + tk-input + tk-checkbox + tk-button с
              валидацией и тостом (молд 2.8 дословно); футер — tk-footer v1.
              Радиус карточек 24 = radius-xxl карты — точное совпадение, без
              переопределения. Арт читает цвета из токен-слоя (getComputedStyle) —
              литералов в исходнике нет.
            </p>
            <h3>Чек-лист: только с клавиатуры</h3>
            <table>
              <thead>
                <tr><th>Шаг</th><th>Ожидаемое поведение</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>Tab</code> по странице</td>
                  <td>
                    Шапка (ссылки ряда 1 → утилиты: поиск, «Стать клиентом») → CTA
                    героя → CTA карточек селектора нет (карточки пассивны) → CTA
                    карточек бенто («Подробнее») → «Все сервисы» → тумблер формы
                    (стрелки ←/→ двигают выбор, фокус не падает) → поле «Телефон» →
                    чекбокс согласия → «Открыть счет» → ссылки футера.
                  </td>
                </tr>
                <tr>
                  <td>Отправка с пустым телефоном</td>
                  <td>
                    Инлайн-ошибка «Введите номер телефона» через <code>error</code>-проп
                    (aria-describedby, фокус не крадётся); любой ввод снимает ошибку.
                  </td>
                </tr>
                <tr>
                  <td>Валидная отправка</td>
                  <td>
                    Спиннер 1,2 с с замороженной шириной → сброс полей → тост
                    подтверждения (aria-live polite, 5 с).
                  </td>
                </tr>
                <tr>
                  <td>Скринридер</td>
                  <td>
                    Одна навигация по имени; h1 героя; статьи карточек; заголовок
                    блока шагов — h2 (внутри tk-stepper), шаги — список; тумблер —
                    радиогруппа «Выбор» (fallback имени без видимой подписи);
                    contentinfo футера.
                  </td>
                </tr>
              </tbody>
            </table>
            <h3>Разрывы сборки</h3>
            <p>
              Измеренные дельты — в
              <code>.playwright-cli/verify/business-landing/NOTES.md</code>: имена
              кремовых токенов в спеке vs фактические (<code>tint-cream*</code>);
              инверсия структуры карточки (арт снизу — через слот actions, не art);
              видимая подпись «Телефон» (у эталона placeholder-only; у tk-input нет
              sr-only-режима); чекбокс согласия (в эталоне — текст без чекбокса;
              оставлен по замороженному составу кластера); радиус формы (оценка
              эталона ~32 против китовых 24); маппинг шагов title/text. Желтый в
              арт-иллюстрациях и первичных CTA — санкционировано; остальной хром —
              без него.
            </p>
          </div>
        </section>
      </div>
    `;

    const draw = (): void => {
      render(view(), host);
    };
    draw();

    return html`${canvasStyles}${host}`;
  },
};

const canvasStyles = html`
  <style>
    .tkb-page {
      box-sizing: border-box;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--tk-color-tint-cream);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkb-main {
      flex: 1;
    }
    .tkb-container {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }

    /* --- Story-composed navbar slots (the navbar story's own recipe) -------- */
    .tkb-logo {
      display: inline-flex;
    }
    .tkb-logo__shield {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-ink-400);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-1-weight);
      line-height: 1;
    }
    .tkb-utility {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--tk-space-8);
      min-height: 44px;
      min-width: 44px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .tkb-utility:hover {
      color: var(--tk-color-text-secondary);
    }
    .tkb-utility:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }

    /* --- Hero: marketing register (h1 44 -> heading-2), centered ------------ */
    .tkb-hero {
      padding-block: var(--tk-space-96) var(--tk-space-64);
      text-align: center;
    }
    .tkb-hero__title {
      max-width: 780px;
      margin: 0 auto var(--tk-space-16);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
    }
    .tkb-hero__sub {
      max-width: 560px;
      margin: 0 auto var(--tk-space-32);
      font-size: var(--tk-text-body-l-size);
      font-weight: var(--tk-text-body-l-weight);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }

    /* --- The service selector cluster: five cream seats --------------------- */
    .tkb-selector {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: var(--tk-space-16);
      margin-top: var(--tk-space-64);
      text-align: left;
    }
    .tkb-selector__card {
      --tk-service-card-fill: var(--tk-color-tint-cream-raised);
      min-width: 0;
    }
    /* The projected icon SVG fills the component's fixed 48x48 icon tile. */
    .tkb-selector__card [slot='icon'] {
      width: 100%;
      height: 100%;
    }
    .tkb-selector__card [slot='icon'] svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* --- Bento 2+3: asymmetric rows, flat cream cards ----------------------- */
    .tkb-section-title {
      max-width: 780px;
      margin: 0 auto var(--tk-space-48);
      text-align: center;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
    }
    .tkb-bento {
      padding-block: var(--tk-space-64);
    }
    .tkb-bento__row {
      display: grid;
      align-items: stretch;
    }
    /* Row 1: two wide seats (probe: ~495/486 at a ~48 gutter). */
    .tkb-bento__row--wide {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: var(--tk-space-48);
    }
    /* Row 2: three seats, CENTER WIDER (probe: ~303/385/294 at ~24 gutters). */
    .tkb-bento__row--trio {
      grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(0, 4fr);
      column-gap: var(--tk-space-24);
      margin-top: var(--tk-space-24);
    }
    .tkb-bento__card {
      /* The §6 surface hooks: the 6.1 warm-cream pair. text-muted re-pairs to
         text-primary — text-secondary fails AA on cream-raised (4.306:1, the
         6.1 contrast pin). Radius needs NO hook: the default radius-xxl IS
         the probe-measured 24. */
      --tk-promo-card-fill: var(--tk-color-tint-cream-raised);
      --tk-promo-card-text-muted: var(--tk-color-text-primary);
      min-width: 0;
    }
    /* The bento stage: art-bottom + floating white pill. The pair re-scope is
       the promo-card charcoal technique verbatim (promo-card.css.ts) applied
       at the stage scope: the slotted secondary button paints its pill from
       surface-base — pinned to white here so the FLOATING WHITE PILL stays
       white in both themes (the dark theme's near-black surface-base would
       fail 1.4.11 on the cream-raised card). */
    .tkb-stage {
      position: relative;
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      --tk-color-surface-base: var(--tk-color-white);
      --tk-color-text-primary: var(--tk-color-ink-300);
    }
    .tkb-stage__art {
      width: 100%;
      max-width: 260px;
    }
    .tkb-stage__art svg {
      display: block;
      width: 100%;
      height: auto;
    }
    /* The floating CTA: centered on the stage centerline, overlapping the
       art's bottom edge (probe: pill center ~90-93% card height). The card's
       own padding-32 absorbs the hang. size=card keeps the 48px box — the
       ≥44px hit target the matrix row pins. */
    .tkb-stage__cta {
      position: absolute;
      bottom: calc(-1 * var(--tk-space-16));
      left: 50%;
      transform: translateX(-50%);
    }
    .tkb-bento__footer {
      display: flex;
      justify-content: center;
      margin-top: var(--tk-space-48);
    }
    /* The grid-footer pill: light fill + blue text (the link register). The
       on-tint link step — blue-100 fails 4.5:1 on the muted fill (the
       service-card actions' own documented pairing rule). */
    .tkb-all {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding-inline: var(--tk-space-40);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-link-on-tint);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
      text-decoration: none;
      white-space: nowrap;
    }
    .tkb-all:hover {
      text-decoration: underline;
    }
    .tkb-all:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }

    /* --- Steps: the 7.3 block on the cream page (white cards are its own) --- */
    .tkb-steps {
      padding-block: var(--tk-space-64);
    }

    /* --- The form cluster: white card on cream ------------------------------ */
    .tkb-form {
      padding-block: var(--tk-space-64) var(--tk-space-96);
    }
    .tkb-form__card {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      max-width: 560px;
      margin-inline: auto;
      padding: var(--tk-space-32);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-xl);
    }
    .tkb-form__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkb-form__divider {
      margin: 0;
      border: none;
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tkb-form__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--tk-space-24);
    }
    .tkb-form__consent {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* The consent example's inline link — the reference's «same ink +
       continuous underline» reading (the mold's own recipe). */
    .tkb-form__link {
      color: var(--tk-color-text-secondary);
      text-decoration: underline;
    }

    /* --- Footer gutters (the homepage recipe: centered padding, not
       max-width — the page is a column flex). ------------------------------- */
    .tkb-footer {
      box-sizing: border-box;
      padding-inline: max(
        var(--tk-space-24),
        calc((100% - var(--tk-space-container)) / 2 + var(--tk-space-24))
      );
    }

    /* --- Docs block (below the footer — clearly chrome, not composition) --- */
    .tkb-docs {
      padding-block: var(--tk-space-64);
      background: var(--tk-color-surface-muted);
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tkb-docs h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkb-docs h3 {
      margin: var(--tk-space-24) 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkb-docs p {
      margin: 0;
      max-width: 720px;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkb-docs td,
    .tkb-docs th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkb-docs code {
      font-family: var(--tk-font-body);
    }

    /* --- 768-1023: one column-step collapse --------------------------------- */
    @media (max-width: 1023px) {
      .tkb-selector {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }
      .tkb-bento__row--trio {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    /* --- <768: single column, step-down, full-width submit ------------------ */
    @media (max-width: 767px) {
      .tkb-container,
      .tkb-footer {
        padding-inline: var(--tk-space-16);
      }
      .tkb-hero {
        padding-block: var(--tk-space-64);
      }
      /* Mobile heading mapping (the homepage story's own probed step-down). */
      .tkb-hero__title,
      .tkb-section-title {
        font-size: var(--tk-text-heading-4-size);
        line-height: var(--tk-text-heading-4-leading);
      }
      .tkb-bento__row--wide,
      .tkb-bento__row--trio {
        grid-template-columns: minmax(0, 1fr);
        margin-top: 0;
      }
      .tkb-bento__row--wide + .tkb-bento__row--trio {
        margin-top: var(--tk-space-24);
      }
      .tkb-form__card {
        padding: var(--tk-space-24);
      }
      .tkb-form__row {
        flex-direction: column;
        align-items: stretch;
      }
      /* The full-width CTA recipe (probed): column flex on the host makes the
         shadow pill a cross-axis flex item — stretch grows it full-width. */
      .tkb-form__submit {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  </style>
`;
