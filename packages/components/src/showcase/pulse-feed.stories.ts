import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, render as litRender } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import type { AttributePart } from 'lit';

import '../link/link.js';
import '../quote-chip/quote-chip.js';
import { showToast } from '../toast/show.js';

/**
 * The infinite-scroll feed (spec 24.8, pattern wave 24b): the single-column
 * pulse/news card stream with NO pagination, NO «Показать ещё» and NO
 * footer — the page simply keeps appending as the reader approaches the
 * edge (the live news page runs 21 694 px, the pulse 16 515 px, both
 * ending mid-card — gap-2). The feed CARD is a consumer composition (the
 * gap-2 «uniform anatomy» pin): author row → bold headline → optional
 * cover → body line → ticker-chip row → action bar over a thin divider.
 *
 * THE RECIPE (pinned in the prose, the story's point): a SENTINEL at the
 * stream's edge + IntersectionObserver append the next batch and announce
 * it through the status line (role=status). The kit ships NO
 * infinite-scroll atom — the feed is consumer layout, exactly as the
 * recon classified it; only the ticker chips ride the kit
 * (tk-quote-chip pill + the overflow «Ещё N» form).
 *
 * DETERMINISM GUARD (the 24.6 lesson, generalized): a canvas whose
 * resting state depends on observer TIMING cannot be baselined. The
 * story mounts with the FIRST append already driven (the
 * SelectDollarOnMount mold — a story-only directive), and the observer
 * is armed only after the reader actually scrolls. The baseline
 * therefore always holds: initial batch + one driven append + the
 * status line — regardless of viewport height.
 *
 * DATA (the PD gate): channels, headlines, prices and counts are
 * FICTIONAL; RU content, EN story meta.
 */

const NBSP = '\u00A0';

interface DemoQuote {
  ticker: string;
  price: string;
  delta: string;
}

interface DemoPost {
  channel: string;
  time: string;
  headline: string;
  body?: string;
  cover?: boolean;
  quotes: DemoQuote[];
  /** The overflow chip's count («Ещё N») — present → render the overflow chip. */
  overflow?: number;
  likes: number;
  comments: number;
}

const BATCHES: DemoPost[][] = [
  [
    {
      channel: 'Демо-канал «Индексы»',
      time: '10 минут назад',
      headline: 'Демо-сценарий: широкий индекс обновил максимум квартала',
      body: 'Вымышленный разбор: что квартальный отчёт демо-эмитента говорит о широкой линейке инструментов.',
      quotes: [
        { ticker: 'DMWX', price: `4${NBSP}128,40${NBSP}₽`, delta: '+0,8%' },
        { ticker: 'DMWO', price: `1${NBSP}904,15${NBSP}₽`, delta: '+0,3%' },
      ],
      overflow: 6,
      likes: 128,
      comments: 14,
    },
    {
      channel: 'Демо-канал «Облигации»',
      time: '34 минуты назад',
      headline: 'Демо-разбор: купонная политика демо-эмитента на осень',
      body: 'Вымышленный сценарий купонных выплат — иллюстрация жанра, не прогноз.',
      quotes: [
        { ticker: 'DMO1', price: `998,00${NBSP}₽`, delta: '+0,1%' },
        { ticker: 'DMO2', price: `1${NBSP}012,50${NBSP}₽`, delta: '−0,05%' },
      ],
      likes: 64,
      comments: 9,
    },
    {
      channel: 'Демо-канал «Валюта»',
      time: 'час назад',
      headline: 'Демо-обзор: валютная пара в спокойном диапазоне',
      cover: true,
      quotes: [
        { ticker: 'DMUS', price: `92,40${NBSP}₽`, delta: '+0,2%' },
        { ticker: 'DMEU', price: `99,15${NBSP}₽`, delta: '−0,1%' },
      ],
      likes: 212,
      comments: 31,
    },
  ],
  [
    {
      channel: 'Демо-канал «Фонды»',
      time: '2 часа назад',
      headline: 'Демо-дайджест: три демо-фонда и их вымышленные стратегии',
      body: 'Состав портфелей демо-фондов приведён как иллюстрация жанра обзора.',
      quotes: [
        { ticker: 'DMFE', price: `87,60${NBSP}$`, delta: '+1,1%' },
        { ticker: 'DMFI', price: `104,15${NBSP}₽`, delta: '+0,4%' },
      ],
      likes: 96,
      comments: 12,
    },
    {
      channel: 'Демо-канал «Сырьё»',
      time: '3 часа назад',
      headline: 'Демо-заметка: сырьевой демо-корзине не хватает объёма',
      quotes: [
        { ticker: 'DMBR', price: `81,20${NBSP}$`, delta: '−0,9%' },
      ],
      overflow: 3,
      likes: 45,
      comments: 7,
    },
    {
      channel: 'Демо-канал «Дивиденды»',
      time: '5 часов назад',
      headline: 'Демо-календарь: вымышленные отсечки демо-эмитентов',
      body: 'Даты и размеры выплат вымышленные — демонстрация формата строки.',
      quotes: [
        { ticker: 'DMD1', price: `54,30${NBSP}$`, delta: '+2,0%' },
        { ticker: 'DMD2', price: `312,40${NBSP}₽`, delta: '+0,6%' },
      ],
      likes: 301,
      comments: 58,
    },
  ],
  [
    {
      channel: 'Демо-канал «Идеи»',
      time: '7 часов назад',
      headline: 'Демо-идея: циклический демо-сектор в фазе консолидации',
      quotes: [{ ticker: 'DMCY', price: `640,80${NBSP}₽`, delta: '−1,4%' }],
      overflow: 4,
      likes: 77,
      comments: 19,
    },
    {
      channel: 'Демо-канал «IPO»',
      time: '9 часов назад',
      headline: 'Демо-анонс: вымышленное размещение демо-компании',
      body: 'Диапазон цены и структура книги заявок вымышленные.',
      quotes: [{ ticker: 'DMIP', price: `12–16${NBSP}₽`, delta: '' }],
      likes: 154,
      comments: 23,
    },
    {
      channel: 'Демо-канал «Обучение»',
      time: '11 часов назад',
      headline: 'Демо-гид: как читать вымышленные отчётности демо-эмитентов',
      quotes: [],
      likes: 89,
      comments: 11,
    },
  ],
  [
    {
      channel: 'Демо-канал «Риск-профиль»',
      time: '13 часов назад',
      headline: 'Демо-разбор: толерантность к просадке на вымышленном портфеле',
      body: 'Все кривые доходности — синтетические демонстрационные ряды.',
      quotes: [{ ticker: 'DMRP', price: `1${NBSP}240,00${NBSP}₽`, delta: '+0,05%' }],
      likes: 52,
      comments: 6,
    },
    {
      channel: 'Демо-канал «Компании»',
      time: '15 часов назад',
      headline: 'Демо-новость: демо-эмитент обновил вымышленную стратегию',
      quotes: [
        { ticker: 'DMCO', price: `228,70${NBSP}₽`, delta: '+1,7%' },
        { ticker: 'DMC2', price: `96,45${NBSP}₽`, delta: '−0,3%' },
      ],
      overflow: 5,
      likes: 188,
      comments: 27,
    },
    {
      channel: 'Демо-канал «Ретро»',
      time: 'вчера',
      headline: 'Демо-архив: как вымышленный демо-индекс прошёл прошлый цикл',
      quotes: [{ ticker: 'DMRT', price: `3${NBSP}482,10${NBSP}₽`, delta: '+0,9%' }],
      likes: 63,
      comments: 8,
    },
  ],
];

/**
 * Story-only FIRST-APPEND driver (the SelectDollarOnMount mold, spec 24.6;
 * the TypeOnMount precedent, 6.3): the feed mounts with batch 2 already
 * appended — one deterministic loadNext() right after the canvas commits —
 * so the resting baseline never depends on observer timing. The host is a
 * plain <main> (no updateComplete), hence the microtask hop; the
 * interactive direction (scroll → further batches) stays live.
 */
class DriveFirstAppend extends Directive {
  #driven = new WeakSet<object>();

  override update(part: AttributePart): string {
    const host = part.element;
    if (host && !this.#driven.has(host)) {
      this.#driven.add(host);
      queueMicrotask(() => {
        document.dispatchEvent(new CustomEvent('pf-drive-first-append'));
      });
    }
    return this.render();
  }

  override render(): string {
    return '';
  }
}

const driveFirstAppend = directive(DriveFirstAppend);

/** The monogram disc's letter: the channel name's first letter after «. */
const discLetter = (channel: string): string =>
  channel.split('«')[1]?.charAt(0) || 'Д';

const canvasStyles = html`
  <style>
    .pf-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .pf-layout {
      max-width: 640px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .pf-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .pf-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE FEED (consumer layout): single column, hairline dividers BETWEEN
       cards — boxed cards are a different surface; the pulse stream is a
       ruled column (the gap-2 anatomy pin). */
    .pf-feed {
      display: flex;
      flex-direction: column;
    }
    .pf-card {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      padding: var(--tk-space-16) 0;
    }
    .pf-card + .pf-card {
      border-top: 1px solid var(--tk-color-border-default);
    }
    .pf-author {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    .pf-author__disc {
      width: 40px;
      height: 40px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
      font-weight: 700;
    }
    .pf-author__name {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .pf-author__time {
      margin-left: auto;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .pf-headline {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .pf-body {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    /* Decorative cover stub — a token-tinted 16:9 band (no live art: PD). */
    .pf-cover {
      aspect-ratio: 16 / 9;
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--tk-color-text-secondary);
    }
    .pf-quotes {
      display: flex;
      align-items: center;
      gap: var(--tk-space-8);
      flex-wrap: wrap;
    }
    /* Action bar OVER a thin divider (the gap-2 pin). The like control is a
       NATIVE button in consumer clothes: aria-pressed belongs on the very
       element the reader activates — the kit's tk-button owns no pressed
       surface (its shadow <button> would leave the host attribute unread). */
    .pf-actions {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      padding-top: var(--tk-space-12);
      border-top: 1px solid var(--tk-color-border-default);
    }
    .pf-like {
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      padding: var(--tk-space-4) var(--tk-space-8);
      border: 0;
      border-radius: var(--tk-radius-md);
      background: transparent;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
      cursor: pointer;
    }
    .pf-like:hover {
      color: var(--tk-color-text-primary);
    }
    .pf-like:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    .pf-like[aria-pressed='true'] {
      color: var(--tk-color-text-primary);
      font-weight: 700;
    }
    .pf-actions__count {
      font-size: var(--tk-text-body-s-size);
      color: var(--tk-color-text-secondary);
    }
    .pf-actions__share {
      margin-left: auto;
    }
    .pf-status {
      margin: 0;
      padding: var(--tk-space-16) 0 var(--tk-space-8);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
      text-align: center;
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Pulse feed',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const InfiniteFeed: Story = {
  name: 'Бесконечная лента',
  render: () => {
    // One-shot demo consumer (the 23.3 mold): the loaded-batch count and
    // the like-state live in a closure; the kit owns nothing here.
    let loadedBatches = 1;
    const liked = new Set<number>();

    const postTemplate = (post: DemoPost, index: number) => {
      const isLiked = liked.has(index);
      return html`
        <article class="pf-card">
          <div class="pf-author">
            <span class="pf-author__disc" aria-hidden="true"
              >${discLetter(post.channel)}</span
            >
            <span class="pf-author__name">${post.channel}</span>
            <span class="pf-author__time">${post.time}</span>
          </div>
          <h2 class="pf-headline">${post.headline}</h2>
          ${post.cover
            ? html`<div class="pf-cover" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" />
                  <path d="M8 30c8-10 24-10 32-4" stroke="currentColor" stroke-width="2" />
                </svg>
              </div>`
            : nothing}
          ${post.body ? html`<p class="pf-body">${post.body}</p>` : nothing}
          ${post.quotes.length
            ? html`<div class="pf-quotes">
                ${post.quotes.map(
                  (quote) => html`
                    <tk-quote-chip
                      variant="pill"
                      ticker=${quote.ticker}
                      price=${quote.price}
                      delta=${quote.delta}
                      href="#"
                    ></tk-quote-chip>
                  `,
                )}
                ${post.overflow
                  ? html`<tk-quote-chip variant="overflow"
                      >Ещё${NBSP}${post.overflow}</tk-quote-chip
                    >`
                  : nothing}
              </div>`
            : nothing}
          <div class="pf-actions">
            <button
              type="button"
              class="pf-like"
              aria-pressed=${isLiked ? 'true' : 'false'}
              @click=${() => {
                if (isLiked) liked.delete(index);
                else liked.add(index);
                renderFeed();
              }}
            >
              Нравится · ${post.likes + (isLiked ? 1 : 0)}
            </button>
            <span class="pf-actions__count">${post.comments} комментариев</span>
            <tk-link
              class="pf-actions__share"
              href="#"
              @click=${(event: Event) => {
                event.preventDefault();
                showToast({ message: 'Поделиться — демо-действие без эффекта' });
              }}
              >Поделиться</tk-link
            >
          </div>
        </article>
      `;
    };

    const feedHost = () => document.querySelector<HTMLElement>('#pf-feed');
    const statusEl = () => document.querySelector<HTMLElement>('#pf-status');

    const renderFeed = () => {
      const host = feedHost();
      if (!host) return;
      const posts = BATCHES.slice(0, loadedBatches).flat();
      litRender(
        html`${posts.map((post, index) => postTemplate(post, index))}`,
        host,
      );
    };

    const setStatus = (text: string) => {
      const status = statusEl();
      if (status) status.textContent = text;
    };

    const loadNext = (): boolean => {
      if (loadedBatches >= BATCHES.length) {
        setStatus('Это конец демо-ленты — больше батчей нет');
        return false;
      }
      loadedBatches += 1;
      renderFeed();
      setStatus(
        `Загружено ещё ${BATCHES[loadedBatches - 1].length} — демо-лента, батчей осталось: ${BATCHES.length - loadedBatches}`,
      );
      return true;
    };

    // The determinism guard (AC3): the first append is DRIVEN on mount;
    // the IntersectionObserver arms only after the reader actually
    // scrolls — the resting baseline can never race the observer.
    document.addEventListener('pf-drive-first-append', () => loadNext(), {
      once: true,
    });

    let armed = false;
    const armObserver = () => {
      if (armed) return;
      armed = true;
      const sentinel = document.querySelector<HTMLElement>('#pf-sentinel');
      if (!sentinel || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!loadNext()) observer.disconnect();
        }
      });
      observer.observe(sentinel);
    };
    window.addEventListener(
      'scroll',
      () => {
        armObserver();
      },
      { once: true, passive: true },
    );

    return html`
      ${canvasStyles}
      <main class="pf-canvas" data-driver=${driveFirstAppend()}>
        <p class="pf-note">
          Бесконечная лента (спека 24.8): одноколоночный поток карточек БЕЗ
          пагинации, «Показать ещё» и футера — страница догружается по мере
          чтения (живые новости/пульс: 21 694 и 16 515 px, конец посреди
          карточки — gap-2). РЕЦЕПТ: сентинел на краю ленты +
          IntersectionObserver аппендит следующий батч, статус-строка
          (role=status) объявляет догрузку; кит НЕ получает атом бесконечной
          ленты — это потребительская раскладка, из кита едут только
          тикер-чипы (tk-quote-chip pill + overflow «Ещё N»). Анатомия
          карточки — строка автора (диск-монограмма, канал, серое время),
          жирный заголовок, опциональная обложка, строка тела, ряд
          котировок, экшн-бар над тонким разделителем. ДЕТЕРМИНИЗМ (урок
          24.6): первый аппенд выполняет стори-драйвер на маунте,
          наблюдатель взводится только после реального скролла — базлайн в
          покое всегда: стартовый батч + один догруженный + статус-строка.
          Клавиатура: Tab — чипы, «Нравится», «Поделиться»; «Нравится» —
          нативная кнопка с aria-pressed (теневая кнопка кита не несёт
          pressed-поверхности). Обе темы — без правок состава. Каналы,
          заголовки, цены и счётчики вымышленные.
        </p>
        <div class="pf-layout">
          <h1 class="pf-title">Демо-лента Пульса</h1>
          <div id="pf-feed" class="pf-feed"></div>
          <div id="pf-sentinel" aria-hidden="true" style="height: 1px"></div>
          <p id="pf-status" class="pf-status" role="status">
            Догрузка по скроллу — демо (наблюдатель взведётся после первого
            скролла)
          </p>
        </div>
      </main>
    `;
  },
};
