import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render } from 'lit';

import '../button/button.js';
import '../input/input.js';
import '../select/select.js';
import type { TkSelectOption } from '../select/select.js';
import '../checkbox/checkbox.js';
import '../segmented-radio/segmented-radio.js';
import type { TkSegmentedRadioOption } from '../segmented-radio/segmented-radio.js';
import '../thumbnail-picker/thumbnail-picker.js';
import type { TkThumbnailPickerOption } from '../thumbnail-picker/thumbnail-picker.js';
import '../progress-bar/progress-bar.js';

/**
 * The composed application form (spec 2.8) — Epic 2's stated deliverable:
 * «Заявка на дебетовую карту», assembled ONLY from kit atoms (Input, Select,
 * SegmentedRadio, ThumbnailPicker, ProgressBar, Checkbox, Button). This is a
 * SHOWCASE story, not a component: a composite form widget is explicitly out
 * of scope (Epic 2 context), so the file lives in a dedicated
 * `src/showcase/` directory — compositions must not read as kit components,
 * and the directory placement keeps that boundary visible in the tree
 * (the spec's «note the choice»).
 *
 * STANDARD (the spec's side-by-side ruling): this record is about ASSEMBLY —
 * reading order, cluster, wiring — not per-pixel matching. Per-component
 * fidelity deltas are already recorded in each component's verify NOTES
 * (.playwright-cli/verify/<component>/NOTES.md); the assembly-level
 * side-by-side lives in .playwright-cli/verify/form/NOTES.md.
 *
 * WIRING TECHNIQUE (the spec's Design Notes): one render function keyed to a
 * closure state object, re-invoked via Lit `render(template, host)` from each
 * `-change` handler — a tiny state object, no framework. Lit diffs the host
 * in place, so the uncontrolled element instances (and focus) survive every
 * re-render; only the derived bindings (ProgressBar value, Input error,
 * Button loading) move. Stories rerender on args changes; this story has no
 * controls, so the single mount owns the state for its lifetime.
 *
 * COMPLETION FORMULA (the spec's noted judgment call): completed fields /
 * total fields, rounded — total = 6 (ФИО, телефон, гражданство, кэшбэк,
 * дизайн, согласие); a field counts when it holds a value (trim-nonempty for
 * the inputs, non-empty selection for the pickers, checked for consent).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. The tile artwork is the
 * 2.6 technique: inline-SVG data URIs whose colors are READ from the token
 * layer via getComputedStyle (no literal in this source).
 */

/** Reads a token's computed value (the 2.6 artwork source — no literals here). */
const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/** Card-design artwork: rounded square + chip + mark, colors from tokens (2.6). */
const cardArt = (fillToken: string, markToken: string): string => {
  const fill = tokenColor(fillToken);
  const mark = tokenColor(markToken);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">' +
    `<rect width="144" height="144" rx="24" fill="${fill}"/>` +
    `<rect x="18" y="102" width="38" height="16" rx="4" fill="${mark}"/>` +
    `<circle cx="112" cy="38" r="14" fill="${mark}"/>` +
    '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** The reference «Выберите дизайн карты» set (2.0 capture: 6 designs, first checked). */
const CARD_DESIGNS: TkThumbnailPickerOption[] = [
  { value: 'black', label: 'Чёрная', thumbnail: cardArt('--tk-color-ink-400', '--tk-color-yellow-100') },
  { value: 'yellow', label: 'Жёлтая', thumbnail: cardArt('--tk-color-yellow-100', '--tk-color-ink-300') },
  { value: 'platinum', label: 'Платиновая', thumbnail: cardArt('--tk-color-gray-200', '--tk-color-ink-200') },
  { value: 'blue', label: 'Синяя', thumbnail: cardArt('--tk-color-blue-100', '--tk-color-white') },
  { value: 'green', label: 'Зелёная', thumbnail: cardArt('--tk-color-green-100', '--tk-color-white') },
  { value: 'red', label: 'Красная', thumbnail: cardArt('--tk-color-red-100', '--tk-color-white') },
];

/** The reference «Гражданство РФ?» pair (2.5). */
const CITIZENSHIP: TkSegmentedRadioOption[] = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

/** The reference «повышенный кэшбэк» categories (2.3). */
const CASHBACK: TkSelectOption[] = [
  { value: 'all', label: '1% Все покупки' },
  { value: 'restaurants', label: '5% Рестораны' },
  { value: 'pharmacy', label: '5% Аптеки' },
  { value: 'ozon', label: '5% Ozon.ru' },
  { value: 'perekrestok', label: '3% Пятёрочка' },
  { value: 'sport', label: '5% Спорттовары' },
  { value: 'taxi', label: '5% Такси' },
];

/**
 * Submit-required message for the empty ФИО (the spec's error-driving
 * technique: the STORY's validation sets the Input `error` prop on click —
 * described-by, no focus theft). Calm bank-grade tone, no exclamation.
 */
const FIO_REQUIRED_MESSAGE = 'Укажите фамилию, имя и отчество';

/**
 * Demo submit reset window — a JS timing constant (the token layer cannot
 * feed JS timers; the select typeahead's TK_SELECT_TYPEAHEAD_RESET_MS
 * precedent). Long enough to observe the frozen-width spinner, short enough
 * not to read as a hang.
 */
const SUBMIT_RESET_MS = 1200;

/** The demo's whole state (the spec: a tiny state object; no framework). */
interface FormState {
  fio: string;
  phone: string;
  citizenship: string;
  cashback: string;
  design: string;
  consent: boolean;
  /** Story-driven validation error on ФИО (undefined = none). */
  fioError: string | undefined;
  /** The submit button's loading window. */
  submitting: boolean;
}

/**
 * Initial values mirror the reference capture: «Да» preselected (2.5
 * capture), first card design checked (2.6 capture), everything else empty.
 * Completion starts at 2/6 = 33% — the reference's own «5%» is the site's
 * internal metric, while the demo's formula is completed/total (noted).
 */
const INITIAL_STATE: FormState = {
  fio: '',
  phone: '',
  citizenship: 'yes',
  cashback: '',
  design: 'black',
  consent: false,
  fioError: undefined,
  submitting: false,
};

/** The formula: completed fields / total, rounded. */
const TOTAL_FIELDS = 6;

const completedCount = (state: FormState): number =>
  (state.fio.trim() !== '' ? 1 : 0) +
  (state.phone.trim() !== '' ? 1 : 0) +
  (state.citizenship !== '' ? 1 : 0) +
  (state.cashback !== '' ? 1 : 0) +
  (state.design !== '' ? 1 : 0) +
  (state.consent ? 1 : 0);

const completionPercent = (state: FormState): number =>
  Math.round((completedCount(state) / TOTAL_FIELDS) * 100);

const meta: Meta = {
  title: 'Showcase/Application form',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const ApplicationForm: Story = {
  name: 'Заявка на дебетовую карту (composed)',
  render: () => {
    const state: FormState = { ...INITIAL_STATE };
    // The re-render host: `draw` re-invokes Lit render() into THIS node, so
    // every update diffs in place (element instances and focus survive).
    const host = document.createElement('div');

    const update = (patch: Partial<FormState>): void => {
      Object.assign(state, patch);
      draw();
    };

    const handleStringChange =
      (key: 'fio' | 'phone' | 'citizenship' | 'cashback' | 'design') => (event: Event) => {
        const { value } = (event as CustomEvent<{ value: string }>).detail;
        // Editing ФИО clears the submit error — the consumer-driven contract:
        // the message cannot outlive the user fixing the field.
        if (key === 'fio' && state.fioError !== undefined) {
          update({ fio: value, fioError: undefined });
          return;
        }
        update({ [key]: value } as Partial<FormState>);
      };

    const handleConsentChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: boolean }>).detail;
      update({ consent: value });
    };

    /**
     * Submit (the spec's I/O matrix): empty required ФИО → the story sets the
     * Input `error` prop (aria-describedby, focus NOT stolen, ProgressBar
     * untouched); valid ФИО → the button goes loading briefly (spinner, width
     * frozen), then resets. ProgressBar reads 100% whenever all six fields
     * are complete — the formula, not a submit side effect. NO Toast: the
     * confirmation toast is deferred to story 4.3 (see the note copy below).
     */
    const handleSubmit = (): void => {
      if (state.submitting) return;
      if (state.fio.trim() === '') {
        update({ fioError: FIO_REQUIRED_MESSAGE });
        return;
      }
      update({ submitting: true });
      window.setTimeout(() => update({ submitting: false }), SUBMIT_RESET_MS);
    };

    const view = () => html`
      <main class="tkf-canvas">
        <h1>Заявка на дебетовую карту</h1>
        <p class="tkf-note">
          Сборка формы-эталона из атомов кита — без единого нового компонента:
          ProgressBar «Уже заполнено» (наверху, как в эталоне), ФИО (Input,
          обязательное, бейдж «+20%»), «Мобильный телефон» (Input,
          <code>type=tel</code>), «Гражданство РФ?» (SegmentedRadio),
          «Выберите повышенный кэшбэк (четыре категории)» (Select), «Выберите
          дизайн карты» (ThumbnailPicker, 4+2), строка согласия (Checkbox со
          встроенной ссылкой) и единственная первичная кнопка кластера
          «Продолжить». Порядок чтения — ФИО → телефон → гражданство →
          кэшбэк → дизайн → согласие → кнопка. Проценты считаются по формуле
          «заполненных полей / всего» (всего 6; «Да» и «Чёрная» предвыбраны
          как в эталоне — старт 33%). Отправка с пустым ФИО поднимает ошибку
          через <code>error</code>-проп — aria-describedby, фокус не крадётся;
          валидная отправка крутит спиннер с замороженной шириной и
          сбрасывается. Тост подтверждения отложен до 4.3 — после успешной
          отправки форма молча готова к следующему шагу.
        </p>
        <div class="tkf-panel">
          <tk-progress-bar
            class="tkf-progress"
            label="Уже заполнено"
            .value=${completionPercent(state)}
            announce
          ></tk-progress-bar>
          <tk-input
            class="tkf-field"
            label="Фамилия, имя и отчество"
            name="fio"
            autocomplete="name"
            required
            .error=${state.fioError}
            @value-change=${handleStringChange('fio')}
          >
            <span slot="badge">+20%</span>
          </tk-input>
          <tk-input
            class="tkf-field"
            label="Мобильный телефон"
            name="phone"
            type="tel"
            autocomplete="tel"
            placeholder="+7 900 000-00-00"
            @value-change=${handleStringChange('phone')}
          ></tk-input>
          <tk-segmented-radio
            class="tkf-field"
            label="Гражданство РФ?"
            name="citizenship"
            .options=${CITIZENSHIP}
            default-value="yes"
            @value-change=${handleStringChange('citizenship')}
          ></tk-segmented-radio>
          <tk-select
            class="tkf-field"
            label="Выберите повышенный кэшбэк (четыре категории)"
            placeholder="Выберите категорию"
            name="cashback"
            .options=${CASHBACK}
            @value-change=${handleStringChange('cashback')}
          ></tk-select>
          <tk-thumbnail-picker
            class="tkf-field tkf-field--design"
            label="Выберите дизайн карты"
            name="design"
            .options=${CARD_DESIGNS}
            default-value="black"
            @value-change=${handleStringChange('design')}
          ></tk-thumbnail-picker>
          <hr class="tkf-divider" />
          <tk-checkbox
            class="tkf-consent"
            name="consent"
            value="granted"
            @checked-change=${handleConsentChange}
          >
            Соглашаюсь получать рекламу про кешбэк, повышенный процент и
            <a class="tkf-link" href="#conditions">выгодные предложения</a>
          </tk-checkbox>
          <div class="tkf-submit-row">
            <tk-button
              class="tkf-submit"
              variant="primary"
              size="hero"
              ?loading=${state.submitting}
              @click=${handleSubmit}
            >
              Продолжить
            </tk-button>
          </div>
        </div>
        <section class="tkf-notes">
          <h2>Как собрано</h2>
          <p>
            Неконтролируемые компоненты, связанные событиями: каждый
            <code>-change</code> обновляет маленький объект состояния, и одна
            функция рендера перевызывается через Lit
            <code>render(шаблон, хост)</code> — Lit диффает на месте, поэтому
            экземпляры элементов и фокус переживают каждый обновляющий
            ререндер; двигаются только производные привязки (value
            ProgressBar, error у ФИО, loading кнопки). Подтверждающий тост
            (история 4.3) сюда сознательно не включён — ветка UJ-3 с тостом
            будет пройдена заново вместе с его стори в эпике 4.
          </p>
          <h2>Чек-лист UJ-3: только с клавиатуры</h2>
          <table>
            <thead>
              <tr><th>Шаг</th><th>Ожидаемое поведение</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code> по форме</td>
                <td>
                  Порядок чтения ФИО → телефон → гражданство → кэшбэк → дизайн
                  → согласие → «Продолжить»; в каждом поле сначала объявляется
                  подпись, затем бейдж («+20%» у ФИО), затем поле.
                </td>
              </tr>
              <tr>
                <td>Заполнение полей</td>
                <td>
                  ProgressBar растёт живьём (заполненных / 6, округление);
                  вежливое объявление «Заполнено N%» через aria-live.
                </td>
              </tr>
              <tr>
                <td>Select клавиатурой</td>
                <td>
                  Enter/Space открывает, стрелки ходят, Enter выбирает, Esc
                  закрывает без выбора; typeahead и Home/End работают.
                </td>
              </tr>
              <tr>
                <td>SegmentedRadio стрелками</td>
                <td>
                  ←/→ двигают выбор Да/Нет, фокус следует за выбором.
                </td>
              </tr>
              <tr>
                <td>«Продолжить» с пустым ФИО</td>
                <td>
                  Ошибка появляется через aria-describedby, фокус не крадётся;
                  слышна при следующем визите поля; ProgressBar не меняется.
                </td>
              </tr>
              <tr>
                <td>Валидная отправка</td>
                <td>
                  Кнопка крутит спиннер (ширина заморожена) и сбрасывается;
                  ProgressBar на 100% — все шесть полей заполнены.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
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
    .tkf-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkf-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkf-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkf-canvas .tkf-note {
      margin: 0;
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    /* The form panel: the reference's white elevated card on the gray page.
       Width 568px = the reference form line (the 2.7 like-for-like width). */
    .tkf-canvas .tkf-panel {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      width: 568px;
      max-width: 100%;
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-lg);
      box-shadow: var(--tk-shadow-default);
    }
    /* The picker stays at the 4+2 wrap: the kit's 72px tiles need ≤380px
       (2.6's own composition width; the reference's larger tiles are 2.6's
       recorded per-component delta, not an assembly concern). */
    .tkf-canvas .tkf-field--design {
      max-width: 324px;
    }
    .tkf-canvas .tkf-divider {
      margin: 0;
      border: 0;
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tkf-canvas .tkf-submit-row {
      display: flex;
      justify-content: flex-end;
    }
    /* The consent example's inline link — the reference's «same ink +
       continuous underline» reading (the checkbox story's precedent;
       TextLink formalizes it in 3.1). */
    .tkf-canvas .tkf-link {
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 0.125em;
    }
    .tkf-canvas .tkf-link:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    .tkf-canvas .tkf-notes {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tkf-canvas .tkf-notes p {
      margin: 0;
      color: var(--tk-color-text-secondary);
    }
    .tkf-canvas td,
    .tkf-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkf-canvas code {
      font-family: var(--tk-font-body);
    }
  </style>
`;
