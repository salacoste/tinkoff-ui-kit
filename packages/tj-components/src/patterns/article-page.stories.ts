import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../tj-header/tj-header.js';
import '../tj-link/tj-link.js';
import '../tj-prose/tj-prose.js';
import '../tj-rail/tj-rail.js';

/**
 * Article page PATTERN (spec 16.6): the kit's flagship surface composed from
 * the CLOSED 16.1–16.5 roster — tj-header + tj-rail + the reading column in
 * tj-prose, with the H1/byline row, the ENGAGEMENT BAR recipe, an opt-in
 * scroll-back rail demo, and a reading skeleton. This is a DOCUMENTED RECIPE
 * story, NOT shipped API (the epics ruling: the roster closed at 16.5; if
 * consumers need the engagement bar or the ad slot as components, that is an
 * epics-v6 conversation).
 *
 * The engagement bar is NATIVE semantics, emit-only: like is an aria-pressed
 * TOGGLE, comment/share/bookmark are identity buttons; the kit markup stores
 * NOTHING (counts are consumer data — the demo handler below is story-local
 * in-memory state only). The scroll-back rail is an IMPROVEMENT, not
 * reference: the observed baseline keeps engagement below the fold, so the
 * compact rail ships as an opt-in recipe block, OFF by default.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero cross-family vars — pinned by
 * tests/tj-article-pattern-imports.test.ts). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC editorial content, zero PII. Placeholder art: NEUTRAL
 * named-color SVG data URLs (the bank store-badges mold).
 */

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const ICON_SVG = (fill: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><rect width='30' height='30' rx='7' fill='${fill}'/><circle cx='15' cy='15' r='8' fill='white'/></svg>`,
  )}`;

const RAIL_ITEMS = [
  { label: 'Главное', href: '#main', value: 'main' },
  { label: 'Разборы', href: '#razbory', value: 'razbory' },
  { label: 'Истории', href: '#istorii', value: 'istorii' },
  { label: 'Шапки', href: '#shapki', value: 'shapki' },
  { label: 'Инструкции', href: '#instrukcii', value: 'instrukcii' },
];

/**
 * The like-toggle demo handler — STORY-LOCAL state only (the emit-only
 * contract): aria-pressed flips on the button itself, the count text is
 * re-derived from data attributes (the consumer-data stand-in), and nothing
 * persists anywhere in kit markup.
 */
const handleLikeToggle = (event: Event): void => {
  const button = event.currentTarget as HTMLButtonElement;
  const pressed = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(pressed));
  const base = Number(button.dataset.baseCount ?? '0');
  const count = button.querySelector('.tjart-engage__count');
  if (count) count.textContent = String(pressed ? base + 1 : base);
};

/** Skeleton demo state: toggles the reading column between bones and live slots. */
const handleSkeletonToggle = (event: Event): void => {
  const button = event.currentTarget as HTMLButtonElement;
  const article = document.querySelector('#tjart-article');
  if (!article) return;
  const skeleton = article.classList.toggle('is-skeleton');
  article.setAttribute('aria-busy', String(skeleton));
  button.setAttribute('aria-pressed', String(skeleton));
  button.textContent = skeleton ? 'Скелет: скрыть' : 'Скелет: показать';
};

/** The ONE scroll listener of the opt-in demo (replaced wholesale on re-arm). */
let stickyListener: (() => void) | null = null;

/**
 * Arms/disarms the scroll-back demo: OFF by default (the improvement
 * clause). Direction-based: scrolling UP shows the compact rail, scrolling
 * DOWN hides it; the 120px floor keeps the top-of-page rest state clean.
 */
const handleStickyToggle = (event: Event): void => {
  const button = event.currentTarget as HTMLButtonElement;
  const rail = document.querySelector('#tjart-backrail');
  if (!rail) return;
  const arm = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(arm));
  button.textContent = arm ? 'Скролл-бэк панель: выключить' : 'Скролл-бэк панель: включить (opt-in)';
  if (stickyListener) {
    window.removeEventListener('scroll', stickyListener);
    stickyListener = null;
  }
  rail.classList.toggle('is-armed', arm);
  rail.classList.remove('is-on');
  if (arm) {
    let lastY = window.scrollY;
    stickyListener = () => {
      // Queried FRESH each event — a story re-render replaces the node, and a
      // captured one would toggle classes on a detached element (16.6 lens).
      const live = document.querySelector('#tjart-backrail');
      const y = window.scrollY;
      live?.classList.toggle('is-on', y < lastY && y > 120); /* FLAG: 120px floor — authored demo pick, unprobed */
      lastY = y;
    };
    window.addEventListener('scroll', stickyListener, { passive: true });
  }
};

const canvasStyles = html`
  <style>
    .tjart-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-32) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    /* CANVAS-SCOPE LAW (the 16.6 triage catch, the tj-prose story mold):
       an OUTER descendant selector like ".tjart-canvas p" (0,1,1) BEATS every
       ::slotted rule of tj-prose — Chromium counts only the ::slotted()
       ARGUMENT's specificity, so a bare ".tjart-canvas p" painted the slotted
       article flow in note-card chrome (ink-300 + padding + 12px rhythm) and
       ".tjart-canvas h2" crushed the prose H2 to 15px. Canvas chrome therefore
       NEVER descends: notes carry the .tjart-note class, headings scope to
       the frame's OWN children (.tjart-frame > h1/h2) — the same child-
       combinator guard the 16.1 prose canvas uses (.tjprose-canvas > p). */
    .tjart-frame > h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjart-frame > h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjart-canvas .tjart-note {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
      color: var(--tj-color-ink-300);
      background: var(--tj-color-card);
      padding: var(--tj-space-12) var(--tj-space-16);
      border-radius: var(--tj-radius-card);
    }
    .tjart-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjart-canvas td,
    .tjart-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjart-canvas table {
      margin: 0 0 var(--tj-space-16);
      color: var(--tj-color-ink-100);
    }
    .tjart-frame {
      max-width: var(--tj-space-container);
      margin: 0 auto;
    }
    .tjart-demo-button {
      height: var(--tj-space-40);
      padding-inline: var(--tj-space-16);
      border: none;
      border-radius: var(--tj-radius-control-sm);
      background: var(--tj-color-cta-fill);
      color: var(--tj-color-cta-ink);
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-cta-label-size);
      cursor: pointer;
    }
    .tjart-demo-button:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
    /* The composition pattern grid: rail column + reading column (the 16.5 mold). */
    .tjart-layout {
      display: grid;
      grid-template-columns: var(--tj-space-rail-sidebar) minmax(0, 1fr);
      gap: var(--tj-space-40);
      align-items: start;
      margin-block-start: var(--tj-space-24);
    }
    .tjart-wordmark {
      font-weight: var(--tj-text-nav-label-weight);
      text-decoration: none;
      color: var(--tj-color-ink-100);
      font-size: var(--tj-text-nav-label-size);
    }
    /* The reading column is a WHITE column over the gray page (the t-j.ru
       reference, the 16.1 composition mold — the ink-300/reference inks need
       it for AA). */
    .tjart-article {
      max-width: var(--tj-space-column-reading-body);
      background: var(--tj-color-card);
      padding: var(--tj-space-24);
      border-radius: var(--tj-radius-card);
    }
    /* H1 + byline are PAGE CHROME, not prose species (the load-bearing 16.6
       ruling): tj-prose's cascade deliberately covers flow content only, so
       the H1 rides the pattern canvas on the article-h1 tokens. The time-meta
       rides the AUTHORED AA meta step (ink-300 on card — the 16.2/16.3
       news-card mold), NOT the restricted reference-time ink: the restricted
       inks (reference-time 3.949:1, engage 2.434:1 light / 3.277:1 dark) are
       sub-AA BY token-table design and are therefore never RENDERED by kit
       stories — the CI axe gate owns the rendered truth, so they stay
       documented table facts for opt-in reference-fidelity consumers. */
    .tjart-title {
      margin: 0 0 var(--tj-space-16);
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-article-h1-size);
      font-weight: var(--tj-text-article-h1-weight);
      line-height: var(--tj-text-article-h1-leading);
      color: var(--tj-color-ink-100);
    }
    .tjart-byline {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tj-space-12); /* FLAG: byline gap — authored pick (unprobed) */
      margin: 0 0 var(--tj-space-24);
    }
    .tjart-byline__avatar {
      display: block;
      width: var(--tj-space-40); /* FLAG: byline avatar 40 — authored pick matching the h40 rows (article byline avatar unprobed) */
      height: var(--tj-space-40);
      border-radius: var(--tj-radius-badge);
    }
    .tjart-byline__author {
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-byline-size);
      font-weight: var(--tj-text-byline-weight);
      line-height: var(--tj-text-byline-leading);
      color: var(--tj-color-ink-100);
    }
    .tjart-byline__meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tj-space-8);
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-time-meta-size);
      font-weight: var(--tj-text-time-meta-weight);
      line-height: var(--tj-text-byline-leading);
      color: var(--tj-color-ink-300); /* the authored AA meta step — the restricted reference-time ink never renders in kit stories (see the chrome comment above) */
    }
    /* The composed vertical band — canvas-owned (the 16.1 Composition mold):
       H2/pull-quote spacing is UNMEASURED on the reference; the pick rides
       the EXISTING scale only (40/24 H2, 32 pull-quote). */
    .tjart-article tj-prose h2 {
      margin-block: var(--tj-space-40) var(--tj-space-24);
    }
    .tjart-article tj-prose blockquote {
      margin-block: var(--tj-space-32);
    }
    /* --- The ENGAGEMENT BAR recipe (native semantics, emit-only) --------- */
    .tjart-engage {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tj-space-8);
      margin-block-start: var(--tj-space-40); /* FLAG: band pick — the 16.1 CTA rhythm */
      padding-block-start: var(--tj-space-24);
      border-top: 1px solid var(--tj-color-divider);
    }
    .tjart-engage__btn {
      display: inline-flex;
      align-items: center;
      gap: var(--tj-space-8);
      box-sizing: border-box;
      height: var(--tj-space-40); /* FLAG: h40 engagement row (probe-notes home census) */
      padding-inline: var(--tj-space-12);
      border: none;
      border-radius: var(--tj-radius-control-sm); /* FLAG: quiet-control radius — authored pick (unprobed) */
      background: transparent;
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-cta-label-weight);
      line-height: var(--tj-text-cta-label-leading);
      color: var(--tj-color-ink-300); /* the AA meta step: identity labels are essential text */
      cursor: pointer;
    }
    .tjart-engage__btn:hover {
      color: var(--tj-color-ink-100);
    }
    .tjart-engage__btn:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
    /* The pressed state is SEMANTIC-first: aria-pressed flips the ink; no
       fill is invented (the reference pressed treatment is unprobed). */
    .tjart-engage__btn[aria-pressed='true'] {
      color: var(--tj-color-ink-100);
    }
    .tjart-engage__glyph {
      flex: none;
      color: var(--tj-color-ink-300); /* meta-ink glyph — decorative, aria-hidden in markup */
    }
    .tjart-engage__btn:hover .tjart-engage__glyph,
    .tjart-engage__btn[aria-pressed='true'] .tjart-engage__glyph {
      color: var(--tj-color-ink-100);
    }
    /* Counts are CONSUMER data riding the same authored AA step as their
       label (ink-300 on card): the restricted engage ink (2.434:1 light /
       3.277:1 dark) is sub-AA by token-table design and never renders in kit
       stories — the CI axe gate owns the rendered truth. */
    .tjart-engage__count {
      color: var(--tj-color-ink-300);
    }
    /* --- The opt-in scroll-back rail (improvement, OFF by default) ------- */
    .tjart-backrail {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: var(--tj-z-nav); /* sticky chrome class — the sanctioned nav step */
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--tj-space-8);
      padding: var(--tj-space-8) var(--tj-space-16);
      background: var(--tj-color-card);
      border-top: 1px solid var(--tj-color-divider);
      transform: translateY(110%);
      visibility: hidden; /* hidden = NO tab stops — the rail never traps focus */
      transition:
        transform var(--tj-motion-duration-fast) var(--tj-motion-curve-standard),
        visibility 0s linear var(--tj-motion-duration-fast);
    }
    .tjart-backrail.is-armed.is-on {
      transform: translateY(0);
      visibility: visible;
      transition:
        transform var(--tj-motion-duration-fast) var(--tj-motion-curve-standard),
        visibility 0s;
    }
    .tjart-backrail__btn {
      padding-inline: var(--tj-space-12);
    }
    /* --- The reading skeleton (the 16.2 law: meta-ink alpha, no shimmer) - */
    .tjart-bones {
      display: none;
    }
    .tjart-article.is-skeleton .tjart-live {
      display: none;
    }
    .tjart-article.is-skeleton .tjart-bones {
      display: block;
    }
    .tjart-sk {
      background: color-mix(in srgb, var(--tj-color-ink-300) 12%, transparent); /* FLAG: the 12% bone alpha (spec 16.2) */
      border-radius: var(--tj-radius-cta);
    }
    /* Bone census = the LIVE flow's measured census (the 16.6 lens fix,
       re-probed at the walkthrough round): each bone's height is its species'
       leading × the live element's measured line count at the 1280 demo
       (title 2×50, lead 2×35, paragraphs 4/4/3/4 ×30, quote 3×50, h2 45),
       and the rhythm is the prose's own flagged 25px
       literal — so the live↔skeleton swap keeps the SAME boxes (zero layout
       shift, pinned by the walkthrough driver). RETUNE when the demo copy
       changes. Widths stay on-scale anatomy picks (the 16.2 mold). */
    .tjart-sk--title {
      width: 92%;
      height: calc(2 * var(--tj-text-article-h1-leading));
      margin-bottom: var(--tj-space-16);
    }
    /* Byline bones mirror the live flex ROW exactly (a block wrapper — inline
       spans' vertical margins don't stack like the live div's, off by the
       title's 16px gap; the wrapper kills the drift class entirely). */
    .tjart-sk-byline {
      display: flex;
      align-items: center;
      gap: var(--tj-space-12);
      height: var(--tj-space-40);
      margin-bottom: var(--tj-space-24);
    }
    .tjart-sk--avatar {
      flex: none;
      width: var(--tj-space-40);
      height: var(--tj-space-40);
      border-radius: var(--tj-radius-badge);
    }
    .tjart-sk--word {
      width: 22%;
      height: var(--tj-text-byline-leading);
    }
    .tjart-sk--meta {
      flex: none;
      width: 18%;
      height: var(--tj-text-byline-leading);
    }
    .tjart-sk--lead {
      width: 100%;
      height: calc(2 * var(--tj-text-article-lead-leading));
      margin-bottom: 25px; /* FLAG: the prose rhythm literal (probe10) — no --tj-space-25 exists and none may be minted */
    }
    .tjart-sk--para-l4 {
      width: 96%;
      height: calc(4 * var(--tj-text-article-body-leading));
      margin-bottom: 25px; /* FLAG: same rhythm literal */
    }
    .tjart-sk--h2 {
      width: 52%;
      height: var(--tj-text-article-h2-leading);
      margin-block: var(--tj-space-40) var(--tj-space-24); /* the composed band (40/24) mirrored */
    }
    .tjart-sk--quote {
      width: 78%;
      height: calc(3 * var(--tj-text-pull-quote-leading));
      margin-block: var(--tj-space-32); /* the composed band (32/32) mirrored */
    }
    .tjart-sk--para-l3 {
      width: 96%;
      height: calc(3 * var(--tj-text-article-body-leading));
      margin-bottom: 25px; /* FLAG: same rhythm literal */
    }
    .tjart-sk--engage {
      box-sizing: content-box;
      width: 34%;
      height: var(--tj-space-40);
      margin-top: var(--tj-space-40);
      padding-top: var(--tj-space-24);
      border-top: 1px solid var(--tj-color-divider);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Article Page',
  component: 'tj-header',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const PageComposition: Story = {
  name: 'Паттерн: статья (1280)',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjart-canvas" lang="ru">
      <div class="tjart-frame">
        <h1>Паттерн: статья (1280)</h1>
        <p class="tjart-note">
          <strong>Это ПАТТЕРН композиции, а не API кита</strong> (ростер закрыт
          на 16.5): страница статьи собирается из готовых компонентов — sticky
          <code>tj-header</code> (переключатель темы внутри — клик циклично
          перетемы́вает ВСЮ страницу, включая статью), <code>tj-rail</code> слева
          с <code>current-value</code> рубрики статьи, колонка чтения в
          <code>tj-prose</code>. H1 и строка автора — ХРОМ страницы, не вид
          прозы: каскад 16.1 сознательно покрывает только поток, поэтому H1
          45/700/50 живёт на канве паттерна, а time-meta — на авторском
          AA-шаге мета-чернил (ink-300 на карточной земле, mold
          news-card: restricted-чернила референса саб-AA и в историях кита
          не рендерятся вовсе). Engagement-панель — РЕЦЕПТ на нативной семантике:
          «Нравится» — переключатель <code>aria-pressed</code> (emit-only, кит
          ничего не хранит — счётчики в демо ниже локальны для истории),
          остальные кнопки называют действие. Скролл-бэк панель — УЛУЧШЕНИЕ, а
          не референс: включается кнопкой ниже, по умолчанию ВЫКЛЮЧЕНА.
        </p>
        <tj-header
          .items=${[
            { label: 'Главное', href: '#main' },
            { label: 'Разборы', href: '#razbory' },
            { label: 'Истории', href: '#istorii' },
          ]}
          active-value="#razbory"
          cta-href="#write"
        >
          <a slot="wordmark" href="#top" class="tjart-wordmark">ЖУРНАЛ</a>
        </tj-header>
        <div class="tjart-layout">
          <tj-rail .items=${RAIL_ITEMS} current-value="razbory">
            <img slot="icon-main" src=${ICON_SVG('dimgray')} alt="" />
            <img slot="icon-istorii" src=${ICON_SVG('gray')} alt="" />
            <img slot="icon-shapki" src=${ICON_SVG('darkgray')} alt="" />
          </tj-rail>
          <article class="tjart-article" id="tjart-article" aria-busy="false">
            <div class="tjart-live">
              <h1 class="tjart-title">
                Как читать договор страхования: разбор на пальцах
              </h1>
              <div class="tjart-byline">
                <img
                  class="tjart-byline__avatar"
                  src=${AVATAR_PLACEHOLDER}
                  alt="Аватар Марии Ветровой"
                />
                <span class="tjart-byline__author">Мария Ветрова</span>
                <span class="tjart-byline__meta">
                  <time datetime="2026-09-29T11:20">29 сентября, 11:20</time>
                  <span aria-hidden="true">·</span>
                  <span>7 минут чтения</span>
                </span>
              </div>
              <tj-prose>
                <p slot="lead">
                  Страховой полис читают один раз — в день, когда платить уже
                  поздно. Разбираем, какие строки договора решают всё.
                </p>
                <p>
                  Договор страхования написан языком, который юристы называют
                  точным, а все остальные — пугающим. На деле в нём есть
                  несколько несущих строк: что считается страховым случаем,
                  какие исключения снимают выплату и в какой срок подаются
                  документы. Всё остальное — обвязка.
                </p>
                <h2>Исключения важнее покрытия</h2>
                <p>
                  Первое, что ищем в документе, — раздел об исключениях. Он
                  определяет, когда страховка НЕ работает:
                  <tj-link href="#tjart-anchor-exclusions">хронические болезни до подписания</tj-link>,
                  алкоголь, опасные хобби. Если исключение описано широко —
                  «опасные виды спорта» без списка — уточняйте перечень до
                  покупки, а не после.
                </p>
                <blockquote>
                  Страховка — это не обещание заплатить, а обещание прочитать
                  условия вместе с вами.
                </blockquote>
                <p>
                  Второй несущий блок — сроки. У каждой обязанности есть окно:
                  подать заявление, приложить документы, дождаться решения.
                  Пропущенное окно — законный отказ, даже когда случай
                  бесспорный.
                </p>
                <h2 id="tjart-anchor-exclusions">Что проверить до подписания</h2>
                <p>
                  Сфотографируйте полис и держите под рукой три вещи: список
                  исключений, срок уведомления о случае и порядок оспаривания
                  решения. Эти строки — вся практическая ценность документа;
                  остальное читается по необходимости.
                </p>
              </tj-prose>
              <div class="tjart-engage" role="group" aria-label="Действия со статьёй">
                <button
                  type="button"
                  class="tjart-engage__btn"
                  aria-pressed="false"
                  data-base-count="128"
                  @click=${handleLikeToggle}
                >
                  <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
                    width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 17 4 11a4 4 0 1 1 6-5 4 4 0 1 1 6 5z" />
                  </svg>
                  <span>Нравится</span>
                  <span class="tjart-engage__count">128</span>
                </button>
                <button type="button" class="tjart-engage__btn">
                  <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
                    width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M3 4h14v9H8l-5 4z" />
                  </svg>
                  <span>Комментировать</span>
                </button>
                <button type="button" class="tjart-engage__btn">
                  <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
                    width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 2l4 5h-3v6h-2V7H6z" />
                    <path fill="currentColor" d="M4 13v5h12v-5h-2v3H6v-3z" />
                  </svg>
                  <span>Поделиться</span>
                </button>
                <button type="button" class="tjart-engage__btn">
                  <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
                    width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M5 2h10v16l-5-4-5 4z" />
                  </svg>
                  <span>В закладки</span>
                </button>
              </div>
            </div>
            <!-- Reading skeleton: bones as meta-ink alpha on the card ground
                 (the 16.2 law: NEVER a bank gray); the bone census mirrors
                 the live flow 1:1 (same boxes — the swap never shifts
                 layout); aria-hidden bones + aria-busy on the article; NO
                 shimmer exists. -->
            <div class="tjart-bones" aria-hidden="true">
              <div class="tjart-sk tjart-sk--title"></div>
              <div class="tjart-sk-byline">
                <span class="tjart-sk tjart-sk--avatar"></span>
                <span class="tjart-sk tjart-sk--word"></span>
                <span class="tjart-sk tjart-sk--meta"></span>
              </div>
              <div class="tjart-sk tjart-sk--lead"></div>
              <div class="tjart-sk tjart-sk--para-l4"></div>
              <div class="tjart-sk tjart-sk--h2"></div>
              <div class="tjart-sk tjart-sk--para-l4"></div>
              <div class="tjart-sk tjart-sk--quote"></div>
              <div class="tjart-sk tjart-sk--para-l3"></div>
              <div class="tjart-sk tjart-sk--h2"></div>
              <div class="tjart-sk tjart-sk--para-l4"></div>
              <div class="tjart-sk tjart-sk--engage"></div>
            </div>
          </article>
        </div>

        <h2>Демо-контролы состояния (для прогона)</h2>
        <p class="tjart-note">
          Скелет — ОБЯЗАТЕЛЬное состояние паттерна: кости в 12% альфы
          чернильного мета-тока на карточной земле, коробки совпадают с живым
          контентом (сдвига раскладки нет), анимации нет вовсе. Скролл-бэк
          панель — opt-in улучшение: референс держит панель ниже фолда, поэтому
          по умолчанию её нет; вооружите демо и прокрутите страницу вверх —
          компактная панель въедет за 150мс (в reduced-motion — мгновенно,
          токен-слой схлопывает длительность в 0). Панель прижата к нижней
          кромке вьюпорта полосой ХРОМА (как шапка сверху), а не плавает над
          колонкой; в приложении добавьте скролл-контейнеру
          scroll-padding-bottom высоты полосы — читаемая строка никогда не
          уходит под неё.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--tj-space-12);">
          <button
            type="button"
            class="tjart-demo-button"
            id="tjart-skeleton-toggle"
            aria-pressed="false"
            @click=${handleSkeletonToggle}
          >
            Скелет: показать
          </button>
          <button
            type="button"
            class="tjart-demo-button"
            id="tjart-sticky-toggle"
            aria-pressed="false"
            @click=${handleStickyToggle}
          >
            Скролл-бэк панель: включить (opt-in)
          </button>
        </div>
      </div>
      <!-- The opt-in compact rail: hidden = no tab stops; shown = the same
           four identities as the main bar (Flow D: engagement buttons
           individually). The demo like button carries its own story-local
           handler; a consumer wires both views to the same store. -->
      <nav class="tjart-backrail" id="tjart-backrail" aria-label="Действия со статьёй">
        <button
          type="button"
          class="tjart-engage__btn tjart-backrail__btn"
          aria-pressed="false"
          data-base-count="128"
          @click=${handleLikeToggle}
        >
          <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
            width="20" height="20" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 17 4 11a4 4 0 1 1 6-5 4 4 0 1 1 6 5z" />
          </svg>
          <span>Нравится</span>
          <span class="tjart-engage__count">128</span>
        </button>
        <button type="button" class="tjart-engage__btn tjart-backrail__btn">
          <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
            width="20" height="20" viewBox="0 0 20 20">
            <path fill="currentColor" d="M3 4h14v9H8l-5 4z" />
          </svg>
          <span>Комментировать</span>
        </button>
        <button type="button" class="tjart-engage__btn tjart-backrail__btn">
          <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
            width="20" height="20" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 2l4 5h-3v6h-2V7H6z" />
            <path fill="currentColor" d="M4 13v5h12v-5h-2v3H6v-3z" />
          </svg>
          <span>Поделиться</span>
        </button>
        <button type="button" class="tjart-engage__btn tjart-backrail__btn">
          <svg class="tjart-engage__glyph" aria-hidden="true" focusable="false"
            width="20" height="20" viewBox="0 0 20 20">
            <path fill="currentColor" d="M5 2h10v16l-5-4-5 4z" />
          </svg>
          <span>В закладки</span>
        </button>
      </nav>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия и контракт',
  render: () => html`
    ${canvasStyles}
    <main class="tjart-canvas" lang="ru">
      <div class="tjart-frame">
        <h1>Анатомия и контракт</h1>
        <p class="tjart-note">
          Паттерн страницы статьи — ДОКУМЕНТИРОВАННЫЙ РЕЦЕПТ, как герой /pro/
          из 16.3: копируйте композицию, кит не поставляет ни «компонент
          статьи», ни «панель реакций». Если потребителям нужен компонентный
          engagement-бар или ad-слот — это разговор epics-v6, записан здесь
          триггером. Всё интерактивное — нативная семантика; состояние — на
          потребителе.
        </p>
        <table>
          <thead>
            <tr><th>Регион</th><th>Контракт</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>H1 + строка автора</td>
              <td>
                Хром страницы НАД прозой: H1 45/700/50 на токенах
                <code>article-h1</code>; аватар/автор (byline 15/700) /
                time-meta 15/400 на авторском AA-шаге ink-300 (mold
                news-card — restricted-чернила референса саб-AA и никогда
                не рендерятся историями кита). Кормить это В prose нельзя:
                каскад 16.1 заморожен на p/h2/blockquote/a.
              </td>
            </tr>
            <tr>
              <td>Колонка чтения</td>
              <td>
                <code>tj-prose</code>: слот-лид Charter 27/35, тело 21/30,
                H2 38/700/45, цитата 35/400/50; ссылки внутри абзацев —
                <code>&lt;tj-link&gt;</code> (двухповерхностный закон ссылок);
                переносы — <code>hyphens: auto</code> при <code>lang="ru"</code>.
                Вертикальный ритм H2/цитаты — выбор канвы (40/24 и 32 — в
                масштабе существующей шкалы).
              </td>
            </tr>
            <tr>
              <td>Engagement-панель</td>
              <td>
                Ряд тихих кнопок h40: «Нравится» — <code>aria-pressed</code>
                переключатель, emit-only (ноль состояний в ките; счётчики —
                данные потребителя); «Комментировать»/«Поделиться»/«В закладки»
                — кнопки-действия БЕЗ pressed-семантики, имя = назначение.
                Глифы декоративны (aria-hidden), кольца 2px. Быстрое
                переключение никогда не даёт двойного анонса — одна кнопка,
                один анонс.
              </td>
            </tr>
            <tr>
              <td>Скролл-бэк панель</td>
              <td>
                OPT-IN, по умолчанию ВЫКЛ: референс панель ниже фолда не
                дублирует. Включённая — компактный ряд тех же четырёх кнопок,
                полоса хрома у нижней кромки, 150мс (reduced-motion —
                мгновенно), скрытая панель ВНЕ табуляции — фокус не ловит
                никогда.
              </td>
            </tr>
            <tr>
              <td>Скелет чтения</td>
              <td>
                Кости — 12% альфы мета-чернил на карточной земле (закон 16.2:
                никогда банковский серый), коробки повторяют живой контент —
                ноль сдвига раскладки; анимации нет. Живой контент скрыт,
                кости aria-hidden, статья — <code>aria-busy</code>.
              </td>
            </tr>
            <tr>
              <td>Рекламный слот</td>
              <td>
                В ЭТОЙ истории слота нет — граница FR-17/FR-21 держится на
                docs-стороне: рецепт Flow C (ТЖ-геометрия слота + банковская
                promo-карта внутри) живёт в
                <code>packages/docs/src/tj/ad-slot-recipe.stories.ts</code> —
                docs единственная точка композиции обоих семейств.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjart-canvas" lang="ru">
      <div class="tjart-frame">
        <h1>Доступность</h1>
        <p class="tjart-note">
          Топология Tab паттерна — естественный порядок DOM: шапка (wordmark →
          чипы навигации → слот actions → переключатель темы → CTA «Написать»),
          затем рельс (ниже 1200px — бургер и ящик), затем ссылки тела статьи,
          затем кнопки engagement-панели по одной. Ловушка фокуса одна во всём
          ките — ящик рельса; Esc вне ящика ничего не делает.
        </p>
        <h2>Чек-лист: только с клавиатуры</h2>
        <table>
          <thead>
            <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Tab</code> по странице</td>
              <td>
                Порядок: ссылка wordmark → чипы шапки → переключатель темы →
                CTA → строки рельса → ссылки в абзацах
                (<code>tj-link</code>) → кнопки engagement по одной → два
                демо-ключа состояния (скелет / скролл-бэк — истори-хром,
                не паттерн). Кольцо 2px на каждом стопе.
              </td>
            </tr>
            <tr>
              <td><code>Enter</code> / <code>Space</code> на «Нравится»</td>
              <td>
                Обе клавиши активируют кнопку; <code>aria-pressed</code>
                переключается, подпись НЕ меняется. Быстрые повторные нажатия —
                один анонс на каждое переключение, без дублей.
              </td>
            </tr>
            <tr>
              <td><code>Enter</code> / <code>Space</code> на действиях</td>
              <td>
                «Комментировать»/«Поделиться»/«В закладки» активируются как
                кнопки; pressed-семантики на них нет — это действия, не
                переключатели. «Поделиться» без URL — кнопка, никогда не мёртвая
                ссылка.
              </td>
            </tr>
            <tr>
              <td>Переключатель темы ×3</td>
              <td>
                Цикл auto→light→dark→auto; каждый клик анонсирует режим
                вежливой областью («Тема оформления: …»); вся страница
                перерисовывается токенами, фокус остаётся на контроле.
              </td>
            </tr>
            <tr>
              <td>Скролл-бэк панель</td>
              <td>
                Скрытая панель — вне табуляции (visibility); показанная входит
                в порядок после основных кнопок. Фокус она не перехватывает и
                не ловит.
              </td>
            </tr>
            <tr>
              <td>Скелет</td>
              <td>
                В режиме костей нет ни одного таб-стопа (кости aria-hidden,
                живой контент скрыт); <code>aria-busy="true"</code> на статье
                объявляет загрузку.
              </td>
            </tr>
            <tr>
              <td><code>Esc</code></td>
              <td>
                Ничего не делает вне ящика рельса (ниже 1200px);
                engagement-панель Esc не обслуживает.
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
        <p class="tjart-note">
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
              <td>Чтение шапки страницы</td>
              <td>
                Заголовок статьи — «заголовок первого уровня»; строка автора —
                имя, метки времени; рельс — «Разделы, ориентир навигации»,
                текущая рубрика — «текущая страница».
              </td>
            </tr>
            <tr>
              <td>Tab на «Нравится»</td>
              <td>
                «Нравится, кнопка-переключатель, не нажато» / после
                активации — «нажато»; счётчик объявляется как текст, отдельной
                живой области нет (счётчики не анимируются).
              </td>
            </tr>
            <tr>
              <td>Tab на действия</td>
              <td>
                «Комментировать, кнопка», «Поделиться, кнопка», «В закладки,
                кнопка» — имя = назначение, без состояния.
              </td>
            </tr>
            <tr>
              <td>Переключатель темы</td>
              <td>
                «Переключить тему оформления, кнопка»; после клика — вежливый
                анонс «Тема оформления: светлая/тёмная/системная».
              </td>
            </tr>
            <tr>
              <td>Режим скелета</td>
              <td>«Занято» на статье; кости молчат (aria-hidden).</td>
            </tr>
          </tbody>
        </table>

        <h2>Уменьшенное движение</h2>
        <table>
          <thead>
            <tr><th>Состояние</th><th>Поведение</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>prefers-reduced-motion: reduce</code></td>
              <td>
                Токен-слой схлопывает все длительности в 0мс: скролл-бэк
                панель появляется/исчезает мгновенно; сжатие шапки — мгновенно.
                Отдельных media-правил у паттерна нет.
              </td>
            </tr>
            <tr>
              <td>Кости скелета</td>
              <td>
                Никогда не анимируются (закон 16.2 — шиммера не существует);
                reduced-motion путь тривиально тот же рендер.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  `,
};
