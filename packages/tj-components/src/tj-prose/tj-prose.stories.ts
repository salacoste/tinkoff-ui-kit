import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../tj-cta/tj-cta.js';
import '../tj-link/tj-link.js';
import './tj-prose.js';

/**
 * tj-prose stories (spec 16.1): the reading column — playground, the species
 * breakdown, the COMPOSED ARTICLE demo (the three primitives arranged as the
 * reading column; the side-by-side baseline target vs
 * captures-v3/tj/tj-article-fullpage-*.png for the baseline review), and the
 * FR-22 accessibility page (keyboard checklist + SR protocol).
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY — this file sits inside
 * the zero-hardcoded guard's scan root AND inside FR-17's tj-family boundary
 * (zero --tk-* reads). The token sheet itself is loaded by the docs
 * composition root (packages/docs/.storybook/preview.ts) — stories here stay
 * import-clean of it.
 *
 * VERTICAL BAND FLAG (spec 16.1 Design Notes): H2/pull-quote/lead vertical
 * spacing is UNMEASURED on the reference — the composition story composes it
 * from the EXISTING spacing scale (24/32/40) and the pick (40/24 for H2,
 * 32 for the pull-quote) is recorded for the side-by-side baseline review;
 * nothing off-scale ships.
 */

const canvasStyles = html`
  <style>
    .tjprose-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjprose-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjprose-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjprose-canvas > p,
    .tjprose-canvas .tjprose-note {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
      /* ink-300: the AA meta step — ink-200 is light-CTA-fill duty only
         (15.2 contract) and fails contrast on the dark canvas. */
      color: var(--tj-color-ink-300);
      /* Card surface, not ink: the reference's notes are cards over the gray
         page — ink-300 is AA on the card, 4.478 on the bare page. */
      background: var(--tj-color-card);
      padding: var(--tj-space-12) var(--tj-space-16);
      border-radius: var(--tj-radius-card);
    }
    .tjprose-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjprose-canvas td,
    .tjprose-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Prose',
  component: 'tj-prose',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjprose-canvas" lang="ru">
      <h1>tj-prose</h1>
      <p class="tjprose-note">
        Колонка чтения: контейнер типографики, а не стилизованный абзац. Слоты
        (лид + поток статьи) получают двухсемейный каскад — Charter для лида и
        тела, гротеск прерывает его дважды: подзаголовок H2 и цитата. Колонка
        ограничена токеном <code>--tj-space-column-reading-body</code> (760px —
        это кап, а не колонка сетки). Переключите тему в тулбаре — токен
        <code>--tj-*</code> переразрешится сам, веток темы в компоненте нет.
      </p>
      <tj-prose>
        <p slot="lead">
          Персональные данные стали валютой: разбираться, кто и что о нас знает,
        </p>
        <p>
          Каждое касание экрана оставляет след. Банковские приложения знают о нас
          больше, чем близкие: где мы кофе, когда спим и сколько тратим на
          такси. Разбираемся, как читать цифровой след и зачем это уметь.
        </p>
        <p>
          История про данные — это история про доверие. Чем прозрачнее цепочка
          от касания до решения, тем проще отвечать на главный вопрос: кому и
          когда мы сами отдали свой след.
        </p>
      </tj-prose>
    </main>
  `,
};

export const Species: Story = {
  name: 'Виды слотов',
  render: () => html`
    ${canvasStyles}
    <main class="tjprose-canvas" lang="ru">
      <h1>Виды слотов</h1>
      <p class="tjprose-note">
        Известные виды: <code>p</code> (тело, Charter 21/30), <code>p slot=lead</code>
        (лид, Charter 27/35), <code>h2</code> (гротеск 38/700/45), <code>blockquote</code>
        (цитата-вынос, гротеск 35/400/50), <code>a</code> (вид ссылки из
        зонда — но только якорь, присвоенный слоту НАПРЯМУЮ). Контракт ссылок
        двухповерхностный: <code>::slotted</code> не достаёт потомков слот-узлов,
        поэтому ссылка ВНУТРИ абзаца — это <code>&lt;tj-link&gt;</code> (его
        теневой якорь несёт тот же вид из тех же токенов), а топ-уровневый
        якорь-слот стилизуется правилом <code>::slotted(a)</code> (демо —
        сырой якорь в конце потока ниже). Неизвестные
        теги остаются НЕстилизованными — контракт BYO: свои стили для всего
        вне списка.
      </p>
      <tj-prose>
        <p slot="lead">
          Лид — стоячий абзац, который продаёт статью за одну строку.
        </p>
        <p>
          Тело статьи. Внутри предложения живёт
          <tj-link href="#tjprose-species-anchor">ссылка вида зонда</tj-link>:
          цвет не меняется ни в покое, ни при наведении — появляется только
          подчёркивание, 70% чернил.
        </p>
        <h2>Подзаголовок секции</h2>
        <p>
          Гротеск прерывает serif-поток: контраст голосов — фирменный приём
          референса.
        </p>
        <blockquote>
          «Цитата-вынос держит мысль секции в одной фразе — крупно и без
          кавычек-орнаментов».
        </blockquote>
        <p>Вертикальные отступы H2 и цитаты задаёт потребитель — композиция ниже.</p>
        <h2 id="tjprose-species-anchor">Якорь демо-ссылки</h2>
        <div>
          Этот div — неизвестный вид: рендерится как есть, без стилей каскада
          (BYO-контракт).
        </div>
        <a href="#tjprose-species-anchor">Ссылка верхнего уровня — вид ::slotted(a)</a>
      </tj-prose>
    </main>
  `,
};

export const Composition: Story = {
  name: 'Статья целиком (цель базлайна)',
  render: () => html`
    ${canvasStyles}
    <style>
      /* The composed vertical band — canvas-owned (spec 16.1 Design Notes):
         H2/pull-quote spacing is UNMEASURED on the reference; the pick below
         rides the EXISTING scale only (40/24 H2, 32 pull-quote) and is the
         FLAGGED choice for the side-by-side baseline review against
         captures-v3/tj/tj-article-fullpage-*.png. Document styles beat
         ::slotted, so these compose reliably over the component's
         margin-neutralized species. */
      .tj-article h2 {
        margin-block: var(--tj-space-40) var(--tj-space-24);
      }
      .tj-article blockquote {
        margin-block: var(--tj-space-32);
      }
      .tj-article__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--tj-space-12);
        margin: 0 0 var(--tj-space-24);
        font-size: var(--tj-text-cta-label-size);
        line-height: var(--tj-text-cta-label-leading);
        /* essential meta = ink-300 (the AA step); reference-meta is the
           decorative/diminished reference ink, restricted for essential
           text (AD layer ruling). */
        color: var(--tj-color-ink-300);
      }
      /* The article is a WHITE column over the gray page (the t-j.ru
         reference, the baseline target) — the ink-300 meta needs it for AA. */
      .tj-article {
        background: var(--tj-color-card);
        padding: var(--tj-space-24);
        border-radius: var(--tj-radius-card);
      }
      .tj-article__cta {
        margin-top: var(--tj-space-40);
      }
    </style>
    <main class="tjprose-canvas" lang="ru">
      <h1>Статья целиком</h1>
      <p class="tjprose-note">
        Три примитива вместе: мета-строка и ссылка рубрики (<code>tj-link</code>),
        колонка чтения (<code>tj-prose</code>) и якорь-CTA в конце
        (<code>tj-cta</code>). Это целевая композиция для сайд-бай-сайд сверки
        с базлайном <code>captures-v3/tj/tj-article-fullpage-*.png</code>.
      </p>
      <div class="tj-article" style="max-width: var(--tj-space-column-reading-body)">
        <p class="tj-article__meta">
          <tj-link href="#tjprose-rubric">Технологии</tj-link>
          <span>·</span>
          <time>14 марта</time>
          <span>·</span>
          <span>7 минут</span>
        </p>
        <tj-prose>
          <p slot="lead">
            Нейросети научились писать убедительнее средних редакторов — и это
            меняет не журналистику, а доверие.
          </p>
          <p>
            Ещё пять лет назад текст с ошибкой в согласовании выдавал машину
            мгновенно. Сегодня строки, написанные моделью и человеком, различает
            только тот, кто знает, что искать. Разбираемся, что это делает с
            редакциями и читателями.
          </p>
          <h2>Как текст теряет автора</h2>
          <p>
            Раньше подпись под статьёй была обещанием: за эти слова отвечает
            человек с именем и репутацией. Генеративные модели размыли само
            обещание — текст больше не след руки, а результат настройки.
            <tj-link href="#tjprose-composition-anchor">Редакции отвечают маркировкой</tj-link>:
            честная подпись стала элементом дизайна, а не юридической формальностью.
          </p>
          <blockquote>
            Доверие к тексту не исчезает — оно переезжает с автора на редакцию.
          </blockquote>
          <p>
            Парадокс в том, что чем лучше пишет машина, тем дороже становится
            человеческая проверка. Фактчекинг из скучного финального этапа
            превращается в ядро производства: именно он теперь продаёт.
          </p>
          <h2 id="tjprose-composition-anchor">Что остаётся человеку</h2>
          <p>
            Выбор угла. Машина складывает слова, но не решает, о чём сегодня
            стоит рассказать и почему это важно именно сейчас. Это решение —
            и есть редакция.
          </p>
        </tj-prose>
        <tj-cta class="tj-article__cta" href="#tjprose-subscribe">
          Читать ТЖ в приложении
        </tj-cta>
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjprose-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjprose-note">
        <code>tj-prose</code> — контейнер потокового содержимого: он не
        перехватывает навигацию и не создаёт ролей. Вкладка ходит по ссылкам и
        CTA ВНУТРИ колонки — <code>tj-link</code>/<code>tj-cta</code> несут
        нативные якоря в своём shadow DOM, топ-уровневые якоря-слоты —
        нативные <code>&lt;a&gt;</code> светлого DOM; сам контейнер не
        фокусируется. Индикатор фокуса ссылок — кольцо
        2px (<code>--tj-color-focus-ring</code>), слой улучшения поверх
        контурного фокуса референса. Переносы <code>hyphens: auto</code>
        работают при <code>lang="ru"</code> на документе — долг потребителя
        (на этих канвасах он выставлен).
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Фокус ходит по ссылкам внутри статьи — <code>tj-link</code> в
              абзацах, топ-уровневые якоря-слоты, <code>tj-cta</code>; сам
              tj-prose в порядок табуляции не входит.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> на ссылке</td>
            <td>Переход по href — нативная активация якоря (компонент не перехватывает).</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Прокрутка страницы — нативная дельта якоря, НЕ активация:
            ссылки и CTA внутри колонки активируются только Enter,
            контейнер прокрутку не перехватывает.</td>
          </tr>
          <tr>
            <td>Видимость фокуса</td>
            <td>Кольцо 2px с отступом 2px на каждом интерактиве; никогда не
              отключается.</td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjprose-note">
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
            <td>Чтение статьи</td>
            <td>Заголовки объявляются как заголовки (<code>h2</code> светло-
              го DOM проходят насквозь), абзацы — как текст; контейнер молчит.</td>
          </tr>
          <tr>
            <td>Tab на ссылку в абзаце (tj-link)</td>
            <td>«Текст ссылки, ссылка» — нативная роль без лишних обёрток.</td>
          </tr>
          <tr>
            <td>Tab на CTA</td>
            <td>«Читать ТЖ в приложении, ссылка» — якорь, не кнопка.</td>
          </tr>
        </tbody>
      </table>

      <tj-prose>
        <p slot="lead">Цель для клавиатурной проверки композиции.</p>
        <p>
          Внутри абзаца — <tj-link href="#tjprose-a11y-anchor">ссылка для Tab</tj-link>;
          в конце колонки — CTA.
        </p>
        <tj-cta href="#tjprose-a11y-anchor">Финальный CTA</tj-cta>
      </tj-prose>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tj-prose'),
};
