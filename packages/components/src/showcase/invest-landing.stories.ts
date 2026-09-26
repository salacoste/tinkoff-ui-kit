import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button/button.js';
import '../link/link.js';
import '../navbar/navbar.js';
import type { TkNavbarLink } from '../navbar/navbar.js';
import '../qr-block/qr-block.js';
import type { TkQrTab } from '../qr-block/qr-block.js';
import '../stepper/stepper.js';
import type { TkStepperStep } from '../stepper/stepper.js';
import '../store-badges/store-badges.js';
import type { TkStoreBadge } from '../store-badges/store-badges.js';

/**
 * The composed invest-mobile landing (spec 7.5) — Epic 7's install trio
 * assembled as ONE page: the consumer header (pattern-header-consumer), the
 * marketing hero (h1 on the heading-2 register, the iOS/Android CTA pair,
 * the phone art), and the install cluster — tk-qr-block, tk-stepper,
 * tk-store-badges — each per its OWN spec anatomy (7.3), zero new
 * components, zero new tokens, zero component edits.
 *
 * STANDARD (the 6.5/7.5 ruling): this record is about ASSEMBLY — reading
 * order, cluster, wiring — not per-pixel matching. Per-component fidelity
 * deltas live in .playwright-cli/verify/{qr-block,stepper,store-badges}/
 * NOTES.md; the assembly-level side-by-side against
 * captures-v2/invest-mobile/{pattern-hero-full,full}.png lives in
 * .playwright-cli/verify/invest-landing/NOTES.md.
 *
 * COMPOSE ORDER (MEASURED on captures-v2/invest-mobile/full.png, 2026-09-24
 * probe — deterministic row/column pixel scans, y-coordinates in the verify
 * NOTES): qr-block (title y≈1735-1782 → tabs y≈1900-1940 → tile y≈1975-2195)
 * → «Как установить приложение» steps (heading y≈2255, cards y≈2325-2760) →
 * «Вариант 2. Скачивайте нас…» + store badges (heading y≈2838-2880, pills
 * y≈2908-2985). The spec's frozen assumption listed badges BEFORE the steps
 * («reference order» qr → badges → stepper); the capture orders them the
 * other way — the composition FOLLOWS THE CAPTURE and the delta is recorded
 * in the verify NOTES (disposition: capture wins, spec premise corrected
 * there — _bmad-output/ is never edited from a story).
 *
 * REGISTER (the 6.1 mapping ruling): the marketing h1 is 44px on the
 * reference = heading-2 metrics EXACTLY (size/weight/leading tokens) — no
 * new type token exists or is needed; the section h2s ride heading-4. RU
 * content, EN story meta.
 *
 * HERO (pattern-hero-full probes, y 108-940): h1 centered 1 line, subcopy
 * body-l secondary, the CTA pair ON ONE ROW — the primary yellow pill
 * «Скачать для iOS» (tk-button primary/hero — the kit's own yellow-on-ink
 * pill) + the secondary «Скачать для Android» as a tk-link (the capture's
 * dark text link, ≥44px target via the canvas row recipe) — then the phone
 * art below. THE ART IS STORY-ONLY placeholder art (the spec's ruling): an
 * abstract phone — yellow frame, chart screen, coin discs — drawn as inline
 * SVG whose fills are READ from the token layer via getComputedStyle (the
 * 2.6 technique; no literal in this source, no brand art, no text glyphs —
 * raster determinism).
 *
 * WIRING RULING (the homepage 3.10 judgment call, verbatim in spirit): the
 * closure-state + render()-reinvocation mold exists to move DERIVED
 * bindings, and this composition has none — the QR block's platform switch
 * is tk-tabs' OWN uncontrolled value channel (7.3 froze «no events beyond
 * what tk-tabs itself owns»; the block is a display surface), the badges
 * are plain external links, the steps are static. A closure state here
 * would be dead code; the story renders one static template.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

/** Reads a token's computed value (the 2.6 artwork source — no literals here). */
const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/**
 * The hero's placeholder phone (aria-hidden): an abstract reading of the
 * reference fold's 3D phone — yellow frame, a chart screen (blue bars on
 * the page surface), coin discs beside it. Shapes only, fills from live
 * tokens so the art re-derives per theme on reload (the homepage mold).
 */
const phoneArt = (): string => {
  const yellow = tokenColor('--tk-color-yellow-100');
  const ink = tokenColor('--tk-color-ink-300');
  const surface = tokenColor('--tk-color-surface-base');
  const blue = tokenColor('--tk-color-blue-100');
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380" fill="none">' +
    // The depth card peeking behind the phone (the reference's 3D stack).
    `<rect x="116" y="0" width="170" height="330" rx="26" fill="${ink}" fill-opacity="0.12"/>` +
    // The phone: yellow frame + surface screen.
    `<rect x="30" y="14" width="188" height="366" rx="30" fill="${yellow}"/>` +
    `<rect x="40" y="24" width="168" height="346" rx="22" fill="${surface}"/>` +
    // The chart screen: a baseline + five bars (blue at rising opacities).
    `<line x1="58" y1="210" x2="190" y2="210" stroke="${ink}" stroke-opacity="0.25" stroke-width="2"/>` +
    `<rect x="62" y="168" width="18" height="42" rx="4" fill="${blue}" fill-opacity="0.35"/>` +
    `<rect x="88" y="148" width="18" height="62" rx="4" fill="${blue}" fill-opacity="0.55"/>` +
    `<rect x="114" y="158" width="18" height="52" rx="4" fill="${blue}" fill-opacity="0.45"/>` +
    `<rect x="140" y="120" width="18" height="90" rx="4" fill="${blue}" fill-opacity="0.8"/>` +
    `<rect x="166" y="98" width="18" height="112" rx="4" fill="${blue}"/>` +
    // The screen's header band + sparkline dot rows (abstract analytics).
    `<rect x="56" y="52" width="72" height="10" rx="5" fill="${ink}" fill-opacity="0.2"/>` +
    `<circle cx="176" cy="57" r="7" fill="${yellow}"/>` +
    `<rect x="56" y="240" width="136" height="8" rx="4" fill="${ink}" fill-opacity="0.12"/>` +
    `<rect x="56" y="258" width="96" height="8" rx="4" fill="${ink}" fill-opacity="0.12"/>` +
    `<rect x="56" y="292" width="136" height="48" rx="12" fill="${yellow}"/>` +
    // The coin stack at the phone's foot (the reference's coins).
    `<circle cx="262" cy="322" r="30" fill="${yellow}"/>` +
    `<circle cx="262" cy="322" r="19" fill="${surface}"/>` +
    `<circle cx="262" cy="322" r="9" fill="${yellow}"/>` +
    '</svg>'
  );
};

/**
 * A deterministic QR placeholder — the qr-block story's own idiom, copied
 * verbatim in spirit (finder squares + a seeded module grid). The kit never
 * generates real QR art: qrSrc is the consumer's encoding (7.3); the seeds
 * differ per tab so the panel swap is visible in the baselines.
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

/**
 * A NEUTRAL store-mark placeholder (the store-badges story's own glyph):
 * gray squircle + white download arrow — deliberately not any store's art.
 * Consumers pass their own licensed marks through iconSrc (7.3).
 */
const PLACEHOLDER_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='12' fill='gray'/><path d='M24 12v14m0 0l-6-6m6 6l6-6' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/><path d='M15 33v3h18v-3' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
)}`;

/** The consumer header's own link set (pattern-header-consumer, verbatim). */
const NAV_LINKS: TkNavbarLink[] = [
  { value: 'retail', label: 'Частным лицам', href: '#retail' },
  { value: 'business', label: 'Бизнесу', href: '#business' },
  { value: 'premium', label: 'Премиум', href: '#premium' },
  { value: 'more', label: 'Ещё', href: '#more' },
];

/** The QR block's reference tabs (pattern-qr-loaded, 2026-09-24 probe). */
const QR_TABS: TkQrTab[] = [
  {
    label: 'Android 9.0 и выше',
    qrSrc: qrPlaceholder(1),
    note: 'Наведите камеру телефона на QR-код, чтобы скачать приложение',
  },
  { label: 'Android ниже 9.0', qrSrc: qrPlaceholder(2) },
];

/**
 * The install steps — MEASURED copy: the reference's three instruction
 * cards (full.png y≈2325-2760) carry dialog screenshots + these captions
 * verbatim (probe transcribed in verify/invest-landing/NOTES.md); the page
 * paints NO step titles, so the titles are the story's derived one-liners
 * over the caption semantics (the texts ride verbatim).
 */
const INSTALL_STEPS: TkStepperStep[] = [
  {
    title: 'Скачайте установочный файл',
    text: 'В случае уведомления «Файл может быть опасным» нажмите «Все равно скачать». Гарантируем безопасность файлов',
  },
  {
    title: 'Разрешите установку',
    text: 'Если смартфон запросит разрешение, дайте его в настройках: «Разрешить из этого источника» → «Установить»',
  },
  {
    title: 'Начните установку',
    text: 'После скачивания найдите файл в загрузках и начните установку — приложение появится на рабочем столе',
  },
];

/** The badge row's reference trio (pattern-store-badges-loaded, verbatim order). */
const STORE_BADGES: TkStoreBadge[] = [
  { href: 'https://example.com/appgallery', label: 'AppGallery', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/rustore', label: 'RuStore', iconSrc: PLACEHOLDER_ICON },
  { href: 'https://example.com/samsung', label: 'Samsung Store', iconSrc: PLACEHOLDER_ICON },
];

const meta: Meta = {
  title: 'Showcase/Invest landing',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const InvestLanding: Story = {
  name: 'Мобильное приложение Т-Инвестиций (composed)',
  render: () => html`
    <div class="tki-page">
      <tk-navbar class="tki-navbar" .links=${NAV_LINKS} active-value="retail" sticky>
        <span slot="logo" class="tki-logo" aria-hidden="true">
          <span class="tki-logo__shield">Т</span>
        </span>
        <a slot="utilities" class="tki-utility" href="#search" aria-label="Поиск">
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
        <a slot="utilities" class="tki-utility tki-utility--login" href="#login">Личный кабинет</a>
      </tk-navbar>

      <main class="tki-main">
        <!-- HERO: the marketing register — h1 on heading-2 (the 6.1 mapping),
             the iOS/Android CTA pair, the placeholder phone below. -->
        <section class="tki-hero" aria-labelledby="tki-hero-title">
          <div class="tki-hero__copy">
            <h1 id="tki-hero-title">Мобильное приложение Т-Инвестиций</h1>
            <p class="tki-hero__body">Простой и удобный доступ к мировым фондовым рынкам</p>
            <div class="tki-hero__actions">
              <tk-button variant="primary" size="hero" href="#ios">Скачать для iOS</tk-button>
              <tk-link class="tki-hero__alt" variant="standalone" href="#android">
                Скачать для Android
              </tk-link>
            </div>
          </div>
          <div class="tki-hero__art" aria-hidden="true">${unsafeSVG(phoneArt())}</div>
        </section>

        <!-- INSTALL CLUSTER (measured reading order — see the file header):
             qr → steps → stores, each block per its OWN 7.3 anatomy. -->
        <section class="tki-cluster" aria-label="Установка приложения">
          <tk-qr-block title="Вариант 2. Отсканируйте QR-код" .tabs=${QR_TABS}>
            <p slot="page-copy">
              Переходите по ссылкам только с этой страницы и не сканируйте файлы
              с непроверенных сайтов. Версию Android можно посмотреть в
              настройках смартфона — достаточно узнать первую цифру
            </p>
          </tk-qr-block>

          <tk-stepper heading="Как установить приложение" .steps=${INSTALL_STEPS}></tk-stepper>

          <section class="tki-stores" aria-labelledby="tki-stores-title">
            <h2 id="tki-stores-title">Вариант 2. Скачивайте нас в доступных магазинах приложений</h2>
            <tk-store-badges .badges=${STORE_BADGES}></tk-store-badges>
          </section>
        </section>

        <section class="tki-docs" aria-labelledby="tki-docs-title">
          <div class="tki-container">
            <h2 id="tki-docs-title">Как собрано</h2>
            <p>
              Лендинг мобильного приложения собран ТОЛЬКО из компонентов кита и
              контента: шапка-потребитель (tk-navbar одного ряда — паттерн
              header-consumer: логотип, четыре ссылки, поиск и «Личный кабинет»),
              герой маркетингового регистра (h1 на токенах heading-2 —
              сопоставление 6.1, 44px эталона без единого нового токена; пара CTA:
              жёлтая tk-button «Скачать для iOS» + tk-link «Скачать для Android»;
              телефон — абстрактный арт стори, заливки читаются из токенного
              слоя через getComputedStyle, техника 2.6), затем кластер установки
              в измеренном порядке чтения: tk-qr-block (переключатель платформ —
              собственный неконтролируемый канал tk-tabs, 7.3), tk-stepper как
              шаги установки (подписи карточек эталона дословно), tk-store-badges
              (внешние ссылки target=_blank + rel=noopener noreferrer; иконки —
              нейтральные заглушки, бренд-арт в репозитории запрещен). Ни одного
              нового компонента, элемента или токена; веток темы нет — тёмная
              тема перевыпускается наследованием токенов. Расхождения сборки
              (порядок кластера против замороженной посылки спецификации,
              названия шагов как производные) — с измерениями в
              <code>.playwright-cli/verify/invest-landing/NOTES.md</code>;
              дельта двухстрочного абзаца QR-блока закрыта в 10.2 — слот
              page-copy несёт копию эталона дословно (зонд
              batch-10-1-10-2).
            </p>
          </div>
        </section>
      </main>
    </div>
    ${canvasStyles}
  `,
};

const canvasStyles = html`
  <style>
    .tki-page {
      box-sizing: border-box;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tki-main {
      flex: 1;
    }
    .tki-container {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }

    /* --- Story-composed navbar slots (the navbar story's own recipe) -------- */
    .tki-logo {
      display: inline-flex;
    }
    .tki-logo__shield {
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
    .tki-utility {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      min-height: 44px;
      min-width: 44px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .tki-utility:hover {
      color: var(--tk-color-text-secondary);
    }
    .tki-utility:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }

    /* --- Hero: centered marketing cluster (pattern-hero-full probes) -------- */
    .tki-hero {
      box-sizing: border-box;
      padding-block: var(--tk-space-96) var(--tk-space-64);
      text-align: center;
    }
    .tki-hero__copy {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }
    .tki-hero__copy h1 {
      /* The marketing h1 = heading-2 metrics (the 6.1 register mapping): the
         reference's 44px without a new type token. */
      max-width: 700px;
      margin: 0 0 var(--tk-space-24);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
    }
    .tki-hero__body {
      margin: 0 0 var(--tk-space-40);
      max-width: 560px;
      font-size: var(--tk-text-body-l-size);
      font-weight: var(--tk-text-body-l-weight);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }
    /* The reference's CTA pair sits on ONE row (probe y≈318-378): the yellow
       pill + the dark text link side by side, wrapping to a column under
       768. The link's 44px hit target is the row item recipe (min-height +
       centered inline content). */
    .tki-hero__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--tk-space-16) var(--tk-space-24);
    }
    .tki-hero__alt {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
    }
    /* The placeholder phone (structural size — the probe's ~215px width;
       px lengths are outside FR-1's color/z letter). */
    .tki-hero__art {
      display: flex;
      justify-content: center;
      margin-top: var(--tk-space-64);
      padding-inline: var(--tk-space-24);
    }
    .tki-hero__art svg {
      display: block;
      width: 216px;
      height: auto;
    }

    /* --- Install cluster: the three 7.3 blocks in the measured order ------- */
    .tki-cluster {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-96);
      padding-block: var(--tk-space-96) var(--tk-space-120);
    }
    .tki-cluster > * {
      box-sizing: border-box;
      width: 100%;
      max-width: var(--tk-space-container);
      margin-inline: auto;
      padding-inline: var(--tk-space-24);
    }
    /* The stores section heading rides heading-4 (the capture's centered
       ~28px bold line above the pills). */
    .tki-stores h2 {
      margin: 0 0 var(--tk-space-32);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
      text-align: center;
    }
    .tki-stores tk-store-badges {
      display: block;
    }

    /* --- Docs block (story chrome, not composition) ------------------------- */
    .tki-docs {
      padding-block: var(--tk-space-64);
      background: var(--tk-color-surface-muted);
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tki-docs h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tki-docs p {
      margin: 0;
      max-width: 820px;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tki-docs code {
      font-family: var(--tk-font-body);
    }

    /* --- UX-DR14: <768 — the hero stacks, the art scales, the cluster
       reflows (the blocks' own auto-fit grids + wraps do their part) -------- */
    @media (max-width: 767px) {
      .tki-container,
      .tki-cluster > * {
        padding-inline: var(--tk-space-16);
      }
      .tki-hero {
        padding-block: var(--tk-space-64);
      }
      /* Mobile heading mapping (the homepage's recorded observation): the
         display steps to heading-4 metrics, weight stays 700. */
      .tki-hero__copy h1 {
        font-size: var(--tk-text-heading-4-size);
        line-height: var(--tk-text-heading-4-leading);
      }
      .tki-hero__body {
        margin-bottom: var(--tk-space-24);
      }
      /* The CTA pair stacks; the pill stretches full width (the probed
         consumer recipe: column flex makes the shadow pill a cross-axis
         flex item under align-items: stretch). */
      .tki-hero__actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        max-width: 420px;
      }
      /* The probed consumer recipe (homepage 3.10): the HOST flips to a
         column flex so the shadow pill becomes a cross-axis flex item and
         stretches to the full row width. */
      .tki-hero__actions tk-button {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .tki-hero__alt {
        justify-content: center;
      }
      .tki-hero__art {
        margin-top: var(--tk-space-32);
      }
      .tki-hero__art svg {
        /* The art scales with the viewport, never wider than the copy. */
        width: min(216px, 64%);
      }
      .tki-cluster {
        gap: var(--tk-space-64);
        padding-block: var(--tk-space-64);
      }
      .tki-stores h2 {
        margin-bottom: var(--tk-space-24);
      }
      /* The reference's mobile utility cluster: round search chip + login
         pill (the navbar story's own breakpoint recipe). */
      .tki-utility {
        justify-content: center;
        width: 44px;
        padding: 0;
        border-radius: var(--tk-radius-full);
        background: var(--tk-color-surface-muted);
      }
      .tki-utility--login {
        order: -1;
        width: auto;
        padding-inline: var(--tk-space-16);
        border-radius: var(--tk-radius-full);
        font-size: var(--tk-text-body-s-size);
      }
    }
  </style>
`;
