import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, render as litRender } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import type { AttributePart } from 'lit';

import '../link/link.js';
import '../quote-chip/quote-chip.js';

/**
 * The social pair of the feed surfaces (spec 24.13, pattern wave 24b):
 * (а) the QUOTE-REPOST — gap-4's nested card-in-card: an outer feed card
 * (the 24.8 anatomy) carrying an inner INSET (border + surface-muted
 * backdrop + the smaller body-s register) with the quoted post's author
 * line and body. Nesting is ONE level — the live pulse never goes deeper
 * (§Out of scope). The inset is a single passive container: no links, no
 * buttons of its own; the quoted header stays semantically INSIDE the
 * article card (a plain blockquote line, never a heading).
 *
 * (б) STRATEGY AUTHORS — gap-2 #12 / gap-4 «Медиа»: widget rows of
 * authors/channels with a recommendation — avatar monogram roundel (PD:
 * never a live photo) + name + gray fictional metrics + the subscribe
 * control. The Т-Журнал variant of this row is a VARIANT→ТЖ note (FR-17:
 * the bank story rides bank atoms only; families never mix).
 *
 * THE SUBSCRIBE CONTROL (the roster named the tk-button secondary
 * compact REGISTER; the semantics demand native — the 24.8 «Нравится»
 * precedent): aria-pressed belongs on the very element the reader
 * activates, and the kit button's shadow <button> leaves the host
 * attribute unread. So the control is a native button in secondary
 * compact clothes, flipping to the kit's PRIMARY pairing (yellow + ink,
 * theme-invariant) in the pressed state, with the label swap
 * «Подписаться» ↔ «Вы подписаны» and a check glyph stub (currentColor).
 * The toggle announces through a role=status line.
 *
 * HEADINGS: h1 → h2 sections → h3 card headlines (the feed card is an
 * article; the quoted inset never adds a level). DATA (the PD gate):
 * authors, channels, metrics and counts are FICTIONAL. Story-canvas
 * styling consumes var(--tk-*) tokens only (FR-1).
 */

type FeedSocialArgs = Record<string, never>;

const NBSP = '\u00A0';

interface DemoQuote {
  ticker: string;
  price: string;
  delta: string;
}

interface QuotedPost {
  author: string;
  letter: string;
  time: string;
  body: string;
}

interface RepostCard {
  channel: string;
  time: string;
  headline: string;
  body?: string;
  quote?: QuotedPost;
  quotes: DemoQuote[];
  likes: number;
  comments: number;
}

interface AuthorRow {
  name: string;
  letter: string;
  focus: string;
  metrics: string;
}

const FEED: RepostCard[] = [
  {
    channel: 'Демо-канал «Стратегии»',
    time: '20 минут назад',
    headline: 'Демо-разбор: автор отвечает на вымышленную критику портфеля',
    quote: {
      author: 'Демо-автор Анна К.',
      letter: 'А',
      time: 'вчера',
      body: 'Вымышленный тезис цитируемого поста: диверсификация демо-портфеля снизила просадку в синтетическом сценарии. Числа — иллюстрация жанра, не результат.',
    },
    quotes: [
      { ticker: 'DMWX', price: `4${NBSP}128,40${NBSP}₽`, delta: '+0,8%' },
      { ticker: 'DMBG', price: `1${NBSP}012,50${NBSP}₽`, delta: '+0,1%' },
    ],
    likes: 84,
    comments: 12,
  },
  {
    channel: 'Демо-канал «Разборы»',
    time: '2 часа назад',
    headline: 'Демо-дайджест: три вымышленные стратегии недели',
    body: 'Состав и результаты демо-стратегий приведены как иллюстрация жанра обзора.',
    quotes: [{ ticker: 'DMSR', price: `640,80${NBSP}₽`, delta: '−1,4%' }],
    likes: 45,
    comments: 7,
  },
];

const AUTHORS: AuthorRow[] = [
  {
    name: 'Демо-автор Анна К.',
    letter: 'А',
    focus: 'Дивидендные демо-стратегии',
    metrics: `17,5${NBSP}тыс. подписчиков · +38${NBSP}% за 3${NBSP}года`,
  },
  {
    name: 'Демо-автор Пётр Л.',
    letter: 'П',
    focus: 'Облигационные демо-портфели',
    metrics: `9,2${NBSP}тыс. подписчиков · +21${NBSP}% за 3${NBSP}года`,
  },
  {
    name: 'Демо-автор Мария В.',
    letter: 'М',
    focus: 'Валютное демо-хеджирование',
    metrics: `5,4${NBSP}тыс. подписчиков · +12${NBSP}% за 3${NBSP}года`,
  },
  {
    name: 'Демо-автор Игорь Д.',
    letter: 'И',
    focus: 'Индексные демо-корзины',
    metrics: `28,0${NBSP}тыс. подписчиков · +29${NBSP}% за 3${NBSP}года`,
  },
];

/** The check glyph stub — currentColor, decorative (aria-hidden inline). */
const CHECK_ICON = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

/**
 * Story-only FIRST-PAINT driver (the 24.8 DriveFirstAppend mold): the
 * interactive host #fs-root mounts EMPTY and the directive drives one
 * paint right after commit. The litRender-into-host machinery must be
 * the ONLY writer of that subtree — re-rendering a container that
 * Storybook itself populated leaves its nodes behind (caught by the
 * pre-mint probe: two role=status lines). The host is a plain <main>
 * (no updateComplete), hence the microtask hop; the toggle direction
 * (click → re-paint) stays live.
 */
class DriveFirstPaint extends Directive {
  #driven = new WeakSet<object>();

  override update(part: AttributePart): string {
    const host = part.element;
    if (host && !this.#driven.has(host)) {
      this.#driven.add(host);
      queueMicrotask(() => {
        document.dispatchEvent(new CustomEvent('fs-paint-first'));
      });
    }
    return this.render();
  }

  override render(): string {
    return '';
  }
}

const driveFirstPaint = directive(DriveFirstPaint);

const canvasStyles = html`
  <style>
    .fs-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .fs-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-layout {
      max-width: 640px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-32);
    }
    .fs-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .fs-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .fs-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    /* THE FEED SECTION (consumer layout): a ruled column — hairline
       dividers BETWEEN cards, boxed cards are a different surface (the
       gap-2 / 24.8 pin). */
    .fs-feed {
      display: flex;
      flex-direction: column;
    }
    .fs-card {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      padding: var(--tk-space-16) 0;
    }
    .fs-card + .fs-card {
      border-top: 1px solid var(--tk-color-border-default);
    }
    .fs-card__author {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    .fs-card__disc {
      width: 40px;
      height: 40px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
      font-weight: 700;
    }
    .fs-card__name {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .fs-card__time {
      margin-left: auto;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-card__headline {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .fs-card__body {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE QUOTE INSET (the story's subject, gap-4): ONE nesting level,
       a single passive container — border + surface-muted backdrop + the
       smaller body-s register. No links, no buttons inside: the quoted
       header is a plain line semantically inside the article card, never
       a heading of its own. */
    .fs-quote {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-muted);
    }
    .fs-quote__head {
      display: flex;
      align-items: center;
      gap: var(--tk-space-8);
    }
    .fs-quote__disc {
      width: 24px;
      height: 24px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-base);
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-s-size);
      font-weight: 700;
    }
    .fs-quote__author {
      font-size: var(--tk-text-body-s-size);
      font-weight: 700;
      line-height: var(--tk-text-body-s-leading);
    }
    .fs-quote__time {
      margin-left: auto;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-quote__body {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-card__quotes {
      display: flex;
      align-items: center;
      gap: var(--tk-space-8);
      flex-wrap: wrap;
    }
    .fs-card__actions {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      padding-top: var(--tk-space-12);
      border-top: 1px solid var(--tk-color-border-default);
    }
    /* The like control — native (the 24.8 pin): aria-pressed on the
       activated element; the kit button's shadow <button> cannot carry it. */
    .fs-like {
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
    .fs-like:hover {
      color: var(--tk-color-text-primary);
    }
    .fs-like:focus-visible,
    .fs-sub:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    .fs-like[aria-pressed='true'] {
      color: var(--tk-color-text-primary);
      font-weight: 700;
    }
    .fs-card__count {
      font-size: var(--tk-text-body-s-size);
      color: var(--tk-color-text-secondary);
    }
    .fs-card__share {
      margin-left: auto;
    }
    /* THE AUTHORS SECTION (gap-2 #12): widget rows — avatar monogram
       roundel + name block + gray metrics + the subscribe control. */
    .fs-authors {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
    }
    .fs-author-row {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      padding: var(--tk-space-16) 0;
    }
    .fs-author-row + .fs-author-row {
      border-top: 1px solid var(--tk-color-border-default);
    }
    .fs-author-row__disc {
      width: 48px;
      height: 48px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
      font-weight: 700;
    }
    .fs-author-row__body {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      min-width: 0;
      flex: 1;
    }
    .fs-author-row__name {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .fs-author-row__focus {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-author-row__metrics {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
      white-space: nowrap;
    }
    /* THE SUBSCRIBE CONTROL: the tk-button secondary compact REGISTER on
       a native button (the 24.8 «Нравится» precedent — aria-pressed must
       sit on the activated element); pressed flips to the kit's PRIMARY
       pairing (yellow + ink, theme-invariant). */
    .fs-sub {
      flex: none;
      display: inline-flex;
      align-items: center;
      gap: var(--tk-space-8);
      height: 36px;
      padding: 0 var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      background: transparent;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      cursor: pointer;
    }
    .fs-sub[aria-pressed='true'] {
      border-color: transparent;
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-text-on-primary);
      font-weight: 700;
    }
    .fs-status {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

/** The channel disc's letter: the first letter after «. */
const discLetter = (channel: string): string =>
  channel.split('«')[1]?.charAt(0) || 'Д';

const meta: Meta<FeedSocialArgs> = {
  title: 'Invest/Feed social',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<FeedSocialArgs>;

export const RepostAndAuthors: Story = {
  name: 'Репост-цитата и авторы стратегий',
  render: () => {
    // One-shot demo consumer (the 23.3 mold): like/subscribe state lives
    // in a closure; the kit owns nothing here.
    const liked = new Set<number>();
    const subscribed = new Set<number>();
    let statusText = 'Лайки и подписки — демо-переключения без эффекта';

    const subscribeButton = (author: AuthorRow, index: number) => {
      const on = subscribed.has(index);
      return html`
        <button
          type="button"
          class="fs-sub"
          aria-pressed=${on ? 'true' : 'false'}
          @click=${() => {
            if (on) subscribed.delete(index);
            else subscribed.add(index);
            statusText = on
              ? `Подписка на «${author.name}» отменена`
              : `Вы подписались на «${author.name}»`;
            paint();
          }}
        >
          ${on ? CHECK_ICON : nothing}<span>${on ? 'Вы подписаны' : 'Подписаться'}</span>
        </button>
      `;
    };

    const feedCard = (post: RepostCard, index: number) => {
      const isLiked = liked.has(index);
      return html`
        <article class="fs-card">
          <div class="fs-card__author">
            <span class="fs-card__disc" aria-hidden="true">${discLetter(post.channel)}</span>
            <span class="fs-card__name">${post.channel}</span>
            <span class="fs-card__time">${post.time}</span>
          </div>
          <h3 class="fs-card__headline">${post.headline}</h3>
          ${post.quote
            ? html`
                <blockquote class="fs-quote">
                  <div class="fs-quote__head">
                    <span class="fs-quote__disc" aria-hidden="true">${post.quote.letter}</span>
                    <span class="fs-quote__author">${post.quote.author}</span>
                    <span class="fs-quote__time">${post.quote.time}</span>
                  </div>
                  <p class="fs-quote__body">${post.quote.body}</p>
                </blockquote>
              `
            : nothing}
          ${post.body ? html`<p class="fs-card__body">${post.body}</p>` : nothing}
          <div class="fs-card__quotes">
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
          </div>
          <div class="fs-card__actions">
            <button
              type="button"
              class="fs-like"
              aria-pressed=${isLiked ? 'true' : 'false'}
              @click=${() => {
                if (isLiked) liked.delete(index);
                else liked.add(index);
                paint();
              }}
            >
              Нравится · ${post.likes + (isLiked ? 1 : 0)}
            </button>
            <span class="fs-card__count">${post.comments} комментариев</span>
            <tk-link class="fs-card__share" href="#">Поделиться</tk-link>
          </div>
        </article>
      `;
    };

    const template = () => html`
      <p class="fs-note">
        Социальная пара лент (спека 24.13): (а) РЕПОСТ-ЦИТАТА — вложенная
        карточка-в-карточке (gap-4): внешняя карточка ленты (молд 24.8:
        строка автора, жирный заголовок, ряд котировок, экшн-бар над
        разделителем) + внутренняя врезка — border + surface-muted
        подложка + меньший body-s регистр — со строкой автора и телом
        цитируемого поста. ВЛОЖЕННОСТЬ ОДНА (живое не глубже); врезка —
        единый пассивный блок: внутри нет ни ссылок, ни кнопок, заголовок
        цитируемого — обычная строка внутри article-карточки, НЕ свой
        уровень заголовка. ИЕРАРХИЯ: h1 → h2 секций → h3 заголовки карт.
        (б) АВТОРЫ СТРАТЕГИЙ (gap-2 #12): виджет-ряды — аватар-монограм
        (ПД: никогда живые фото), имя, серые вымышленные метрики,
        «Подписаться». РЕГИСТР кнопки — tk-button secondary compact;
        РЕАЛИЗАЦИЯ — нативная (прецедент «Нравится» 24.8): aria-pressed
        должен стоять на активируемом элементе, теневая кнопка кита
        хост-атрибут не переносит; нажатое состояние — первичная пара
        кита (жёлтое + чернильное, вне темы), смена подписи
        «Подписаться» ↔ «Вы подписаны», галка — стаб currentColor;
        переключение объявляет role=status строка. Клавиатура: Tab —
        чипы, «Нравится», «Поделиться», подписки. Обе темы — без правок
        состава. Авторы, каналы, метрики и счётчики вымышленные.
      </p>
      <div class="fs-layout">
        <h1 class="fs-title">Пульс: репосты и авторы (демо)</h1>
        <section class="fs-section">
          <h2 class="fs-section__title">Репост-цитата в ленте</h2>
          <div class="fs-feed">${FEED.map(feedCard)}</div>
        </section>
        <section class="fs-section">
          <h2 class="fs-section__title">Авторы стратегий</h2>
          <ul class="fs-authors" role="list">
            ${AUTHORS.map(
              (author, index) => html`
                <li class="fs-author-row" role="listitem">
                  <span class="fs-author-row__disc" aria-hidden="true">${author.letter}</span>
                  <span class="fs-author-row__body">
                    <span class="fs-author-row__name">${author.name}</span>
                    <span class="fs-author-row__focus">${author.focus}</span>
                  </span>
                  <span class="fs-author-row__metrics">${author.metrics}</span>
                  ${subscribeButton(author, index)}
                </li>
              `,
            )}
          </ul>
          <p class="fs-status" role="status">${statusText}</p>
        </section>
      </div>
    `;

    const paint = () => {
      const host = document.querySelector<HTMLElement>('#fs-root');
      if (host) litRender(template(), host);
    };

    // The determinism guard (the 24.8 mold): the first paint is DRIVEN on
    // mount; every later paint comes from a user toggle — the resting
    // baseline never depends on render timing.
    document.addEventListener('fs-paint-first', () => paint(), { once: true });

    return html`
      ${canvasStyles}
      <main class="fs-canvas" id="fs-root" data-driver=${driveFirstPaint()}></main>
    `;
  },
};
