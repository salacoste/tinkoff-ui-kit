import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './qr-block.js';

/**
 * tk-qr-block stories (spec 7.3): playground from the reference copy,
 * variants (the reference pair, the no-note panel, the title-less block,
 * the empty degrade), theming, and the a11y notes with the FULL keyboard
 * checklist (the composed tk-tabs contract) + an SR-protocol section
 * (maintainer-side execution).
 *
 * Motion: the block's own sheet has NONE; panel swaps ride the composed
 * tk-tabs' v1 swap (motion tokens, collapsed under reduced-motion by the
 * token layer).
 *
 * QR ART: the kit NEVER generates QR codes; the tiles below are
 * DETERMINISTIC placeholder glyphs (finder squares + a seeded module grid,
 * NAMED colors only — no hex in source). Consumers pass their own encoding
 * through `qrSrc`.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type QrArgs = {
  title: string;
  tabs: Array<{ label: string; qrSrc: string; note?: string }>;
};

/**
 * A deterministic QR-LIKE placeholder (NOT scannable — no encoding): three
 * finder patterns + a seeded module grid. NAMED colors only.
 */
const qrPlaceholder = (seed: number): string => {
  const modules: string[] = [];
  const finder = (x: number, y: number): void => {
    modules.push(`<rect x='${x}' y='${y}' width='7' height='7' fill='black'/>`);
    modules.push(`<rect x='${x + 1}' y='${y + 1}' width='5' height='5' fill='white'/>`);
    modules.push(`<rect x='${x + 2}' y='${y + 2}' width='3' height='3' fill='black'/>`);
  };
  finder(0, 0);
  finder(22, 0);
  finder(0, 22);
  for (let y = 0; y < 29; y += 1) {
    for (let x = 0; x < 29; x += 1) {
      const inFinder = (x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20);
      if (inFinder) continue;
      const noise = Math.sin(seed * 127.1 + x * 311.7 + y * 74.7) * 43758.5453;
      if (noise - Math.floor(noise) > 0.5) {
        modules.push(`<rect x='${x}' y='${y}' width='1' height='1' fill='black'/>`);
      }
    }
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29' width='168' height='168'><rect width='29' height='29' fill='white'/>${modules.join('')}</svg>`,
  )}`;
};

/** The reference pair (pattern-qr-loaded, 2026-09-24 probe). */
const REFERENCE_TABS = [
  {
    label: 'Android 9.0 и выше',
    qrSrc: qrPlaceholder(1),
    note: 'Наведите камеру телефона на QR-код, чтобы скачать приложение',
  },
  { label: 'Android ниже 9.0', qrSrc: qrPlaceholder(2) },
];

const canvasStyles = html`
  <style>
    .tkq-canvas {
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
    .tkq-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkq-canvas .tkq-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkq-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkq-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkq-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkq-canvas td,
    .tkq-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkq-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkq-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkq-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkq-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkq-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkq-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
    }
    /* On-tint recipe (the tabs 3.3 precedent): the title and the note sit
       DIRECTLY on the panel — charcoal flips them white; the inactive tab
       text (tk-tabs' text-secondary) goes white through the nested element's
       OWN hooks, set here as CONSUMER theming (the component's sheet stays
       hook-clean — the compose-verbatim pin). The active pill and the QR
       tile are opaque surfaces and need nothing. */
    .tkq-panel--charcoal tk-qr-block {
      --tk-qr-block-title: var(--tk-color-white);
      --tk-qr-block-note: var(--tk-color-white);
      --tk-tabs-text: var(--tk-color-white);
      --tk-tabs-text-hover: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<QrArgs> = {
  title: 'Components/QrBlock',
  component: 'tk-qr-block',
  args: { title: 'Вариант 2. Отсканируйте QR-код', tabs: REFERENCE_TABS },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<QrArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkq-canvas">
      <h1>QR block</h1>
      <p class="tkq-note">
        Блок установки приложения: центрированный заголовок heading-4,
        переключник платформ — СОБРАННЫЙ v1 tk-tabs (его клавиатура,
        семантика и своя анимация панелей), под активной вкладкой —
        подсказка камера+QR и белая плитка radius-lg с QR-кодом. Код
        генерирует потребитель (qrSrc); alt собирается автоматически:
        «QR-код для {label}». QR в сторибуке — детерминированная заглушка,
        не кодировка.
      </p>
      <tk-qr-block .title=${args.title} .tabs=${args.tabs ?? REFERENCE_TABS}></tk-qr-block>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkq-canvas">
      <h1>Варианты</h1>
      <p class="tkq-note">
        Переключение вкладок — неконтролируемый tk-tabs по умолчанию (как в
        образце); значение вкладки — индекс. note опционален: панель без
        подсказки — только плитка. Слот page-copy (10.2) — необязательный
        абзац между заголовком и переключником: обёртка рендерится ТОЛЬКО
        когда слот непуст (data-has-page-copy выключен у пустого слота).
      </p>
      <figure>
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
        <figcaption>эталон: две вкладки, у первой подсказка, у второй — нет</figcaption>
      </figure>
      <figure>
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}>
          <p slot="page-copy">
            Переходите по ссылкам только с этой страницы и не сканируйте файлы
            с непроверенных сайтов. Версию Android можно посмотреть в
            настройках смартфона — достаточно узнать первую цифру
          </p>
        </tk-qr-block>
        <figcaption>
          слот page-copy (10.2): абзац безопасности между заголовком и табами —
          body-m/400/text-primary на белом, по центру; копия посимвольно
          декодирована и render-сверена с захвата invest (зонд в
          verify/batch-10-1-10-2/NOTES.md)
        </figcaption>
      </figure>
      <figure>
        <tk-qr-block>
          <p slot="page-copy">
            Переключатель вкладок появится, когда будут доступны обе версии
            приложения
          </p>
        </tk-qr-block>
        <figcaption>
          page-copy без title и с tabs=[]: копия рендерится в обеих
          деградациях (независимые поверхности)
        </figcaption>
      </figure>
      <figure>
        <tk-qr-block .tabs=${REFERENCE_TABS}></tk-qr-block>
        <figcaption>без title: блок без заголовка, переключник и плитки на месте</figcaption>
      </figure>
      <figure>
        <tk-qr-block .title=${'Отсканируйте QR-код'}></tk-qr-block>
        <figcaption>
          tabs=[]: деградация — только заголовок (нуль-вкладочный переключник
          не рендерится; копирайт нулевого состояния специка не задает)
        </figcaption>
      </figure>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkq-canvas">
      <h1>Темизация</h1>
      <p class="tkq-note">
        Блок темизуется наследованием токенов (переключите контрол Theme);
        ноль веток темы в компоненте, ноль переопределений tk-tabs в его
        таблице. Слоты блока:
        <code>--tk-qr-block-title</code>,
        <code>--tk-qr-block-note</code>,
        <code>--tk-qr-block-copy</code>,
        <code>--tk-qr-block-tile-fill</code>,
        <code>--tk-qr-block-tile-radius</code>,
        <code>--tk-qr-block-tile-shadow</code>.
        Переключник стилизуется СВОИМИ слотами tk-tabs (передаются
        потребителем как здесь — на charcoal).
      </p>
      <section class="tkq-panel">
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
      </section>
      <section class="tkq-panel tkq-panel--muted">
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
      </section>
      <section class="tkq-panel tkq-panel--bluegray">
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
      </section>
      <section class="tkq-panel tkq-panel--charcoal">
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkq-canvas">
      <h1>Доступность</h1>
      <p class="tkq-note">
        Переключник — ДОСЛОВНО контракт v1 tk-tabs: tablist/tab/tabpanel,
        roving tabindex (активная — 0, остальные −1), стрелки циклично с
        автоматической активацией, Home/End — к первому/последнему, Tab не
        перехватывается. Плитка QR — изображение с собранным alt: «QR-код
        для {label}». Подсказка — обычный параграф внутри панели.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на АКТИВНУЮ вкладку; из неё — в содержимое её панели, затем за блок.</td>
          </tr>
          <tr>
            <td><code>←</code> / <code>→</code> (и ↑/↓)</td>
            <td>Переход по вкладкам ЦИКЛИЧЕСКИ, выбор следует за фокусом (автоматическая активация); панель меняется.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Первая / последняя вкладка (с активацией).</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Переключатель вкладок»; вкладка — «Android 9.0 и выше, вкладка, выбрана 1 из 2»; изображение — «QR-код для Android 9.0 и выше».</td>
          </tr>
        </tbody>
      </table>
      <div class="tkq-panel">
        <tk-qr-block .title=${'Вариант 2. Отсканируйте QR-код'} .tabs=${REFERENCE_TABS}></tk-qr-block>
      </div>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkq-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером. Каждое расхождение с ожидаемым
        объявлением — дефект, а не особенность.
      </p>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab на переключник</td>
            <td>«Вариант 2. Отсканируйте QR-код, заголовок 2-го уровня»; затем «панель переключателя вкладок»</td>
          </tr>
          <tr>
            <td>Обход вкладок</td>
            <td>«Android 9.0 и выше, вкладка, выбрана 1 из 2»; стрелка — «Android ниже 9.0, вкладка, выбрана 2 из 2»</td>
          </tr>
          <tr>
            <td>Активная панель</td>
            <td>«Наведите камеру телефона на QR-код…» затем «QR-код для Android 9.0 и выше, изображение»</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-qr-block'),
};
