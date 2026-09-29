import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../../components/src/button/button.js';
import '../../../components/src/promo-card/promo-card.js';
import '../../../tj-components/src/tj-link/tj-link.js';
import '../../../tj-components/src/tj-prose/tj-prose.js';
import '../../../tj-components/src/tj-rail/tj-rail.js';

/**
 * Flow-C ad-slot recipe (spec 16.6): a consumer mixing an ad into an editorial
 * feed — the ТЖ ad slot as GRID GEOMETRY with the BANK tk-promo-card composed
 * inside. This docs page is the SOLE sanctioned both-families composition
 * point (AD-4 v5 / FR-17): the ТЖ packages ship zero bank imports, zero
 * yellow/navy values (FR-21) — the promo's yellow lives INSIDE its own frame,
 * on the bank family's own tokens, and no var() crosses the boundary in
 * either direction (the cross-family isolation guard in
 * tests/consumed-tokens.test.ts is the mechanical net).
 *
 * Page chrome consumes the BANK tokens by design (docs-site chrome is shared
 * — the TJ/Getting started mold); the ТЖ stage inside consumes --tj-* only;
 * the promo consumes the bank sheet. Three token worlds, one page — that IS
 * the recipe. Story content RU, meta titles EN, synthetic ad copy (zero PII).
 */

const ICON_SVG = (fill: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><rect width='30' height='30' rx='7' fill='${fill}'/><circle cx='15' cy='15' r='8' fill='white'/></svg>`,
  )}`;

const RAIL_ITEMS = [
  { label: 'Главное', href: '#main', value: 'main' },
  { label: 'Разборы', href: '#razbory', value: 'razbory' },
  { label: 'Истории', href: '#istorii', value: 'istorii' },
];

/** Ad-free collapse demo: removing the promo must collapse the slot — no phantom boxes. */
const handleAdToggle = (event: Event): void => {
  const button = event.currentTarget as HTMLButtonElement;
  const stage = document.querySelector('#tjad-stage');
  if (!stage) return;
  const adfree = stage.classList.toggle('is-adfree');
  button.setAttribute('aria-pressed', String(adfree));
  button.textContent = adfree ? 'Вернуть рекламу' : 'Убрать рекламу (схлопывание слота)';
};

const pageStyles = html`
  <style>
    .tjad-page {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-base);
    }
    /* PAGE-CHROME SCOPE (the 16.6 triage catch): descendant selectors here
       reach the slotted tj-prose flow inside the stage below — outer
       (0,1,1) beats every ::slotted rule (Chromium counts only the ::slotted()
       argument's specificity), which repainted the prose H2 in bank
       heading-5 chrome. Page chrome scopes to the page's OWN children —
       the same guard the ТЖ pattern canvas uses. */
    .tjad-page > h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tjad-page > h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tjad-page > p {
      margin: 0 0 var(--tk-space-12);
    }
    .tjad-page > ul {
      margin: 0 0 var(--tk-space-12);
      padding-left: var(--tk-space-20);
    }
    .tjad-page > ul > li {
      margin-bottom: var(--tk-space-4);
    }
    .tjad-page .tjad-note {
      margin-top: var(--tk-space-24);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
    }
    .tjad-page code {
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
    }
    .tjad-page table {
      margin: 0 0 var(--tk-space-16);
    }
    .tjad-page td,
    .tjad-page th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tjad-toggle {
      height: var(--tk-space-40);
      padding-inline: var(--tk-space-16);
      border: none;
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-text-primary);
      color: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      cursor: pointer;
    }
    .tjad-toggle:focus-visible {
      outline: 2px solid var(--tk-color-border-default);
      outline-offset: 2px;
    }
    /* --- The ТЖ stage: --tj-* ONLY from here down (the FR-21 boundary) --- */
    .tjad-stage {
      box-sizing: border-box;
      margin-block: var(--tj-space-32);
      padding: var(--tj-space-32) var(--tj-space-24);
      background: var(--tj-color-page);
      border-radius: var(--tj-radius-panel);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjad-layout {
      display: grid;
      grid-template-columns: var(--tj-space-rail-sidebar) minmax(0, 1fr);
      gap: var(--tj-space-40);
      align-items: start;
    }
    .tjad-article {
      max-width: var(--tj-space-column-reading-body);
      background: var(--tj-color-card);
      padding: var(--tj-space-24);
      border-radius: var(--tj-radius-card);
    }
    .tjad-article tj-prose h2 {
      margin-block: var(--tj-space-40) var(--tj-space-24);
    }
    /* The ТЖ ad slot: GRID GEOMETRY ONLY — no border, no background, no
       min-height of its own, so an EMPTY slot collapses to zero height (no
       phantom boxes). The two width registers are the reference's own
       (accent locator): 760 in-flow cells, 290 in the rail column. */
    .tjad-slot {
      display: block;
      width: 100%;
      max-width: var(--tj-space-column-reading-body); /* FLAG: 760 — the in-flow ad register (accent locator) */
      margin-block: var(--tj-space-32); /* FLAG: band pick — the 16.1 H2 rhythm */
    }
    .tjad-slot--rail {
      max-width: var(--tj-space-rail-sidebar); /* FLAG: 290 — the rail column's ad cell (accent locator) */
      margin-block: var(--tj-space-24); /* FLAG: pick — separation from the rail list */
    }
    /* Ad-free collapse hides the WHOLE slot — promo AND its demo label and
       margins — a truly empty cell is zero geometry (no orphan «Слот …»
       caption floating over nothing; the 16.6 lens catch). */
    .tjad-stage.is-adfree .tjad-slot {
      display: none;
    }
    /* The slot caption rides PAGE ground (the rail column has no card of its
       own) — and ink-300 is a CARD-ground AA step only (4.47:1 on the light
       page gray misses 4.5), so page-ground text rides ink-100 exactly like
       the tj-rail row labels (the 16.5 mold, both themes). */
    .tjad-slot-label {
      display: block;
      margin-block-end: var(--tj-space-8);
      font-size: var(--tj-text-time-meta-size);
      font-weight: var(--tj-text-time-meta-weight);
      line-height: var(--tj-text-byline-leading);
      color: var(--tj-color-ink-100);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Ad Slot Recipe',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Recipe: Story = {
  name: 'Рецепт: слот рекламы (Flow C)',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${pageStyles}
    <div class="tjad-page" lang="ru">
      <h1>Рецепт: рекламный слот в ТЖ-поверхности (Flow C)</h1>
      <p>
        Поток C из EXPERIENCE: потребитель подмешивает рекламу в редакционную
        ленту. Кит ТЖ не поставляет ни рекламного компонента, ни единого
        жёлтого значения — слот это <strong>геометрия сетки</strong>
        (обёртка без собственной рамки), а содержимое — банковская
        <code>tk-promo-card</code>, собранная потребителем внутри. Эта
        docs-страница — единственная санкционированная точка композиции обоих
        семейств (FR-17): в пакетах ТЖ нет ни одного банковского импорта.
      </p>

      <h2>Граница FR-21 — редакционное против рекламы</h2>
      <ul>
        <li>
          Жёлтый/нави живут ТОЛЬКО внутри собственной рамки промо: заливка —
          банковский токен <code>--tk-color-yellow-100</code> через
          документированный хук <code>--tk-promo-card-fill</code>, чернила —
          банковская пара на жёлтом <code>--tk-color-text-on-primary</code>.
        </li>
        <li>
          ТЖ-поверхность вокруг (страница, карточка статьи, колонка чтения,
          геометрия слота) читает только <code>--tj-*</code>. Ни один var() не
          пересекает границу ни в одну сторону — механически это держит
          кросс-семейный изолятор из story 15.2 (tests/consumed-tokens.test.ts).
        </li>
        <li>
          Промо говорит СОБСТВЕННЫМ языком банка: радиус 24 её реестра (у
          ТЖ-карточек 25), свои типы, свой CTA — кит ТЖ промо не перекрашивает
          и не рескиннит.
        </li>
        <li>
          Регистры слота — из самого референса (accent locator): в потоке
          статьи ячейки шириной 760 (баннеры 760×350 и 760×220, r25), в колонке
          рельса — ячейка 290. Высота здесь НЕ закреплена: слот не рисует
          фантомной геометрии, высоту несёт контент.
        </li>
      </ul>

      <h2>Композиция (обе семьи, живая)</h2>
      <p>
        Слева — <code>tj-rail</code> с рекламной ячейкой 290 под списком
        разделов; справа — колонка чтения <code>tj-prose</code> со слотом 760
        между абзацами. Кнопка убирает/возвращает промо: пустой слот
        схлопывается в нуль — ни рамок, ни пустых коробок.
      </p>
      <button type="button" class="tjad-toggle" aria-pressed="false" @click=${handleAdToggle}>
        Убрать рекламу (схлопывание слота)
      </button>

      <div class="tjad-stage" id="tjad-stage" lang="ru">
        <div class="tjad-layout">
          <div>
            <tj-rail .items=${RAIL_ITEMS} current-value="razbory">
              <img slot="icon-main" src=${ICON_SVG('dimgray')} alt="" />
              <img slot="icon-istorii" src=${ICON_SVG('gray')} alt="" />
            </tj-rail>
            <div class="tjad-slot tjad-slot--rail">
              <span class="tjad-slot-label">Слот рельса · 290</span>
              <tk-promo-card
                class="tjad-promo"
                variant="charcoal"
                heading="РКО для ИП"
                description="Расчётный счёт без платы за обслуживание в первый месяц — синтетическое предложение, не оффер."
              >
                <tk-button slot="actions" variant="secondary" href="#tjad-rko">Открыть</tk-button>
              </tk-promo-card>
            </div>
          </div>
          <article class="tjad-article">
            <tj-prose>
              <p slot="lead">
                Реклама в редакционном потоке — тоже дизайн-решение: у неё свой
                язык, и граница языков проводится по рамке карты.
              </p>
              <p>
                Статья читается как статья: Charter в теле, гротеск в
                подзаголовках, ссылки вида зонда
                (<tj-link href="#tjad-anchor">правило двух поверхностей</tj-link>).
                Рекламный слот встаёт МЕЖДУ блоками текста — сеточная ячейка
                шириной колонки, без собственной рамки.
              </p>
              <div class="tjad-slot">
                <span class="tjad-slot-label">Слот в потоке · 760</span>
                <tk-promo-card
                  class="tjad-promo"
                  heading="Кредит для бизнеса — за два дня"
                  description="Ставка от 9,9%, решение онлайн. Синтетическая нативная реклама: ни одного реального продукта."
                  style="--tk-promo-card-fill: var(--tk-color-yellow-100); --tk-promo-card-text: var(--tk-color-text-on-primary); --tk-promo-card-text-muted: var(--tk-color-text-on-primary);"
                >
                  <tk-button slot="actions" variant="primary" href="#tjad-credit">Подробнее</tk-button>
                </tk-promo-card>
              </div>
              <p>
                Жёлтая карта выше — банковской семьи: её заливка и чернила
                ссылаются только на банковскую токен-таблицу, загруженную на
                уровне документа этой docs-страницей. У потребителя без
                банковского кита этот слот просто останется пустым: ячейка
                схлопнется, текст не сдвинется.
              </p>
              <h2 id="tjad-anchor">Почему это рецепт, а не компонент</h2>
              <p>
                Ростер ТЖ закрыт на 16.5. Слот — паттерн-уровень: геометрию
                держит потребительская раскладка, содержимое — любой банк-компонент,
                который потребитель вправе смешать со своим редакционным
                контентом. Понадобится компонентный ad-слот — это разговор
                epics-v6.
              </p>
            </tj-prose>
          </article>
        </div>
      </div>

      <p class="tjad-note">
        <strong>Проверка границы.</strong> Хром этой страницы — банковские
        <code>--tk-*</code> (docs-хром общий, как в «ТЖ / Getting started»);
        ТЖ-сцена — только <code>--tj-*</code>; промо — только банковская
        таблица. Три токен-мира на одной странице и есть демонстрация
        контракта: жёлтое не вытекает из рамки промо, ТЖ-чернила не заходят
        внутрь неё.
      </p>
    </div>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${pageStyles}
    <div class="tjad-page" lang="ru">
      <h1>Доступность рекламного слота</h1>
      <p>
        Слот не вносит НИ ОДНОЙ новой роли или ориентира: реклама — обычный
        контент потока, доступный скринридеру как есть (никакого aria-hidden
        на рекламе: она часть страницы). Внутри промо всё несёт сам банковский
        компонент — заголовок <code>h3</code>, CTA-якорь.
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
              Строки рельса → CTA промо рельса → ссылки тела статьи → CTA
              промо в потоке — естественный порядок DOM, каждый стоп с кольцом
              2px (внутри промо — банковский токен, снаружи — ТЖ; оба
              применены на карточных поверхностях).
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> на CTA промо</td>
            <td>
              Нативный переход якоря — CTA собран из <code>tk-button</code> с
              href, кнопка-якорь, не мёртвая ссылка.
            </td>
          </tr>
          <tr>
            <td>Схлопывание слота</td>
            <td>
              Удаление промо убирает и таб-стоп: пустой слот — нулевая
              геометрия, скрытых интерактивов не остаётся.
            </td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>
              Ничего не делает: у слота нет оверлеев; единственный оверлей
              ТЖ — ящик рельса (менее 1200px).
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjad-note">
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
            <td>Чтение потока статьи</td>
            <td>
              Подпись слота — обычный текст 15px; промо объявляется своим
              заголовком («Кредит для бизнеса — за два дня, заголовок») и
              описанием; пометки «реклама» в ките нет — маркировку нативной
              рекламы несёт потребитель (копия/бейдж его данных).
            </td>
          </tr>
          <tr>
            <td>Tab на CTA</td>
            <td>«Подробнее, ссылка» / «Открыть, ссылка» — якоря, не кнопки.</td>
          </tr>
          <tr>
            <td>Схлопнутый слот</td>
            <td>Ни объявлений, ни таб-стопов — геометрии нет, контента нет.</td>
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
              В рецепте нечего сворачивать: слот и промо не анимируются вовсе
              (непроверенное не изобретается); путь reduced-motion тривиально
              тот же рендер.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
