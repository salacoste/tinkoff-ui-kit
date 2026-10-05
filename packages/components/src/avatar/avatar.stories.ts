import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './avatar.js';

/**
 * tk-avatar stories (spec 26.3, form-control completeness wave): the
 * playground, the state matrix (image/initials/placeholder + sizes + the
 * consumer overlay), the two grounded registers (tj byline 20 / tj news
 * card 45 — the 20.1 measurement) and the admin-feed repeat pattern
 * (the first row announces, the repeats hide — AC3).
 *
 * Demo images: NEUTRAL named-color SVG data URLs (the tj-rail/store-badges
 * mold) — no network fetch, no hex literals; the decode-fail demo points
 * at a nonexistent local path so the 404 drives the real error pipeline.
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. Names, headlines and
 * amounts are fictional (the PD gate).
 */

type AvatarArgs = {
  name: string;
  size: string;
  src: string;
};

/** The silhouette placeholder art builder (named SVG colors only). */
const silhouette = (fill: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='${fill}'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
  )}`;

const avatarSrc = { dark: silhouette('darkgray'), slate: silhouette('slategray'), tan: silhouette('rosybrown') };

const av = (args: Partial<AvatarArgs> = {}) => {
  const { name, size, src } = args;
  return html`
    <tk-avatar
      class="tkav-el"
      .name=${name ?? 'Мария Оганова'}
      .size=${size ?? ''}
      .src=${src ?? ''}
    ></tk-avatar>
  `;
};

const canvasStyles = html`
  <style>
    .tkav-canvas {
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
    .tkav-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkav-canvas .tkav-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkav-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkav-canvas .tkav-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-24) var(--tk-space-32);
    }
    .tkav-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      flex: 1 1 280px;
      max-width: 420px;
    }
    .tkav-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkav-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkav-canvas td,
    .tkav-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    /* The byline register (tj news rows): 20px disc + name + meta on one
       line — the grounded minimum size. */
    .tkav-canvas .tkav-byline {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      max-width: 560px;
    }
    .tkav-canvas .tkav-byline-row {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    .tkav-canvas .tkav-byline-meta {
      display: flex;
      flex-direction: column;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkav-canvas .tkav-byline-meta b {
      font-weight: 600;
    }
    .tkav-canvas .tkav-byline-meta span {
      color: var(--tk-color-text-secondary);
    }
    /* The news-card register: 45px disc (the 20.1 measurement) + headline
       column — the avatar as the card's identity anchor. */
    .tkav-canvas .tkav-news {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      max-width: 560px;
    }
    .tkav-canvas .tkav-news-card {
      display: flex;
      gap: var(--tk-space-16);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .tkav-canvas .tkav-news-body {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
    }
    .tkav-canvas .tkav-news-body h3 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkav-canvas .tkav-news-body p {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* The admin-feed register: white cards on the muted console page. */
    .tkav-canvas .tkav-feed {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      max-width: 560px;
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-lg);
    }
    .tkav-canvas .tkav-feed-row {
      display: flex;
      align-items: center;
      gap: var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-lg);
    }
    .tkav-canvas .tkav-feed-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkav-canvas .tkav-feed-body span {
      color: var(--tk-color-text-secondary);
    }
    .tkav-canvas .tkav-feed-sum {
      font-weight: 600;
      white-space: nowrap;
    }
    /* The consumer status dot — slotted overlay content (AC4: the ring is
       the consumer's, never the atom's). */
    .tkav-canvas .tkav-dot {
      position: absolute;
      right: 0;
      bottom: 0;
      box-sizing: border-box;
      width: 12px;
      height: 12px;
      border: 2px solid var(--tk-color-surface-base);
      border-radius: 50%;
      background: var(--tk-color-yellow-100);
    }
    .tkav-canvas .tkav-legend {
      margin: 0;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta<AvatarArgs> = {
  title: 'Components/Avatar',
  component: 'tk-avatar',
  args: {
    name: 'Мария Оганова',
    size: '45px',
    src: avatarSrc.dark,
  },
  argTypes: {
    name: { control: 'text', description: 'Имя: источник инициалов и доступного имени диска.' },
    size: { control: 'text', description: 'Диаметр (px-строка, дефолт 45) — хост-строка, канал один с --tk-avatar-size.' },
    src: { control: 'text', description: 'URL изображения; пусто или ошибка декодирования → инициалы/плейсхолдер.' },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<AvatarArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkav-canvas">
      <h1>Avatar</h1>
      <p class="tkav-note">
        Круглый носитель личности (спека 26.3, form-control wave) с тремя производными состояниями:
        изображение (cover-кроп, lazy), инициалы из <code>name</code> («Мария Оганова» → «МО») и
        плоский плейсхолдер. Заземлён трижды — tj byline 20px, tj news 45px (замер 20.1),
        админ-фид; дефолт 45. Один канал размера — <code>size</code>/<code>--tk-avatar-size</code>
        ведёт и короб, и кегль инициалов. Слот — декоративный оверлей потребителя
        (статус-точки), кольцо не входит в атом.
      </p>
      ${av(args)}
      ${av({ ...args, name: 'Иван Петров', src: '' })}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkav-canvas">
      <h1>Варианты</h1>
      <p class="tkav-note">
        Матрица состояний и размеров: изображение, инициалы, плейсхолдер, byline-минимум 20,
        геометрия на хуках и слот-оверлей (статус-точка — контент потребителя). Демо
        decode-fail указывает на несуществующий путь — реальный 404 запускает фолбэк на инициалы.
      </p>
      <div class="tkav-row">
        <figure>
          <tk-avatar class="tkav-el" name="Мария Оганова" src=${avatarSrc.dark}></tk-avatar>
          <figcaption>image — силуэт data-URL, cover-кроп, lazy</figcaption>
        </figure>
        <figure>
          <tk-avatar class="tkav-el" name="Иван Петров"></tk-avatar>
          <figcaption>initials — «ИП», text-secondary на surface-muted</figcaption>
        </figure>
        <figure>
          <tk-avatar class="tkav-el" aria-hidden="true"></tk-avatar>
          <figcaption>placeholder — плоский диск; безымянный = контракт потребителя (скрыт)</figcaption>
        </figure>
        <figure>
          <tk-avatar class="tkav-el" name="Ольга Тарасова" size="20px"></tk-avatar>
          <figcaption>byline-минимум 20 — кегль инициалов следует сам</figcaption>
        </figure>
        <figure>
          <tk-avatar
            class="tkav-el"
            name="Сергей Ильин"
            src="/broken-avatar-demo.png"
          ></tk-avatar>
          <figcaption>decode-fail — 404 переводит в инициалы «СИ»</figcaption>
        </figure>
        <figure>
          <tk-avatar class="tkav-el" name="Мария Оганова" src=${avatarSrc.slate}>
            <span class="tkav-dot"></span>
          </tk-avatar>
          <figcaption>слот-оверлей — статус-точка потребителя, декоративна</figcaption>
        </figure>
        <figure>
          <tk-avatar
            class="tkav-el"
            name="Дарья Ким"
            style="--tk-avatar-bg: var(--tk-color-yellow-100); --tk-avatar-fg: var(--tk-color-text-primary)"
          ></tk-avatar>
          <figcaption>инстанс перекрашивает диски хуками — тема не ветвится</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The grounded registers (AC5): the tj byline row (20px — the author line
 * under news) and the tj news card (45px — the 20.1 measurement). All
 * names, headlines and dates are fictional (the PD gate).
 */
export const NewsRow: Story = {
  name: 'Новостной ряд (паттерн)',
  render: () => html`
    ${canvasStyles}
    <main class="tkav-canvas">
      <h1>Новостной ряд</h1>
      <p class="tkav-note">
        Два заземлённых регистра спеки: byline 20 (строка автора под новостью) и карточка 45
        (идентичность новости). Имена, заголовки и даты — демо-контент, вымышленный.
      </p>
      <h2>Byline 20</h2>
      <div class="tkav-byline">
        <div class="tkav-byline-row">
          <tk-avatar class="tkav-el" name="Мария Оганова" size="20px"></tk-avatar>
          <div class="tkav-byline-meta">
            <b>Мария Оганова</b><span>обозреватель · 21 минута назад</span>
          </div>
        </div>
        <div class="tkav-byline-row">
          <tk-avatar class="tkav-el" name="Иван Петров" size="20px" src=${avatarSrc.tan}></tk-avatar>
          <div class="tkav-byline-meta">
            <b>Иван Петров</b><span>аналитик · вчера</span>
          </div>
        </div>
        <div class="tkav-byline-row">
          <tk-avatar class="tkav-el" name="Ольга Тарасова" size="20px"></tk-avatar>
          <div class="tkav-byline-meta">
            <b>Ольга Тарасова</b><span>редактор · 3 дня назад</span>
          </div>
        </div>
      </div>
      <h2>Карточка 45</h2>
      <div class="tkav-news">
        <article class="tkav-news-card">
          <tk-avatar class="tkav-el" name="Мария Оганова" src=${avatarSrc.dark}></tk-avatar>
          <div class="tkav-news-body">
            <h3>Как устроен налоговый калькулятор в новом приложении</h3>
            <p>Мария Оганова · 21 минута назад · 4 минуты чтения</p>
          </div>
        </article>
        <article class="tkav-news-card">
          <tk-avatar class="tkav-el" name="Сергей Ильин"></tk-avatar>
          <div class="tkav-news-body">
            <h3>Разбор квартальной отчётности: что читаем в первую очередь</h3>
            <p>Сергей Ильин · вчера · 7 минут чтения</p>
          </div>
        </article>
      </div>
    </main>
  `,
};

/**
 * The admin-feed register (AC3's repeat pattern): every row carries the
 * same counterpart avatar — the FIRST announces, the repeats hide with
 * the reflected aria-hidden property (a named role=img per row would be
 * noise). Names and amounts are fictional (the PD gate).
 */
export const AdminFeed: Story = {
  name: 'Админ-фид (паттерн)',
  render: () => html`
    ${canvasStyles}
    <main class="tkav-canvas">
      <h1>Админ-фид</h1>
      <p class="tkav-note">
        Паттерн повторов (AC3): в ленте транзакций контрагент повторяется — первый диск
        озвучивает имя, повторы скрыты <code>aria-hidden</code>. Суммы и имена — демо-контент,
        вымышленный.
      </p>
      <section class="tkav-feed">
        <div class="tkav-feed-row">
          <tk-avatar class="tkav-el" name="Мария Оганова" size="32px"></tk-avatar>
          <div class="tkav-feed-body">
            Мария Оганова <span>Перевод · сегодня, 12:40</span>
          </div>
          <b class="tkav-feed-sum">−2 400 ₽</b>
        </div>
        <div class="tkav-feed-row">
          <tk-avatar class="tkav-el" aria-hidden="true" name="Мария Оганова" size="32px"></tk-avatar>
          <div class="tkav-feed-body">
            Мария Оганова <span>Возврат · сегодня, 11:05</span>
          </div>
          <b class="tkav-feed-sum">+1 800 ₽</b>
        </div>
        <div class="tkav-feed-row">
          <tk-avatar class="tkav-el" name="Иван Петров" size="32px" src=${avatarSrc.slate}></tk-avatar>
          <div class="tkav-feed-body">
            Иван Петров <span>Перевод по номеру телефона · вчера</span>
          </div>
          <b class="tkav-feed-sum">−5 600 ₽</b>
        </div>
        <div class="tkav-feed-row">
          <tk-avatar class="tkav-el" aria-hidden="true" size="32px"></tk-avatar>
          <div class="tkav-feed-body">
            ООО «Ромашка-Демо» <span>Списание по договору · вчера</span>
          </div>
          <b class="tkav-feed-sum">−12 000 ₽</b>
        </div>
      </section>
      <p class="tkav-legend">Имена, организации и суммы — демо-контент, вымышленный.</p>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkav-canvas">
      <h1>Доступность</h1>
      <p class="tkav-note">
        Диск — <code>role="img"</code> с доступным именем из <code>name</code>: атрибуты
        ставятся в <code>connectedCallback</code> (закон React 19 — атрибуты конструктора не
        выживают апгрейд), имя пересчитывается на каждом изменении. Инициалы и картинка —
        презентационные (имя объявляет роль, дубликат не озвучивается). Безымянный диск атом
        не трогает: консьюмер называет его хостовым aria-label или скрывает свойством
        <code>aria-hidden</code> — паттерн повторов в рядах.
      </p>
      <h2>Чек-лист</h2>
      <table>
        <thead>
          <tr><th>Ситуация</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Именованный диск</td>
            <td>Скринридер: «имя, изображение» — role=img + aria-label=name, одно объявление на диск.</td>
          </tr>
          <tr>
            <td>Ошибка декодирования</td>
            <td>Фолбэк на инициалы молча: имя не меняется, объявление то же.</td>
          </tr>
          <tr>
            <td>Повторы в ряду</td>
            <td>Первый диск озвучивает, повторы скрыты aria-hidden — ряд не спамит именем.</td>
          </tr>
          <tr>
            <td>Безымянный диск</td>
            <td>Контракт потребителя: хостовый aria-label или скрытие; слепой role=img без имени — axe-нарушение, атом его не ставит.</td>
          </tr>
          <tr>
            <td>Клавиатура</td>
            <td>Нет фокус-стопа: дисплей-атом, интерактивность — на обёртке потребителя.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkav-row">
        <figure>
          <tk-avatar class="tkav-el" name="Мария Оганова" src=${avatarSrc.dark}></tk-avatar>
          <figcaption>именованный диск — попробуйте скринридер</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-avatar'),
};
