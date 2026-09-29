import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './tj-tag-chip.js';

/**
 * tj-tag-chip stories (spec 16.3): the purple-field nav chip — playground,
 * the anchor/theme contract, the /pro/ hero PATTERN (a composition story,
 * NOT shipped API — the epics ruling), and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * The chips are demoed ON purple fields (their measured home): the pair
 * chip-fill/chip-ink is theme-invariant — both storybook themes render the
 * same purple, by design.
 */

const canvasStyles = html`
  <style>
    .tjtc-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjtc-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjtc-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjtc-canvas p,
    .tjtc-canvas .tjtc-note {
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
    .tjtc-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjtc-canvas td,
    .tjtc-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    /* The measured chip home: a purple field (badge-purple is a SCOPED
       carrier — this canvas block is that carrier's demo, tokens only). */
    .tjtc-field {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
      padding: var(--tj-space-24);
      background: var(--tj-color-badge-purple);
      border-radius: var(--tj-radius-panel);
    }
    .tjtc-chiprow {
      display: flex;
      flex-wrap: wrap; /* chips WRAP, never scroll (EXPERIENCE contract) */
      gap: var(--tj-space-12);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Tag Chip',
  component: 'tj-tag-chip',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjtc-canvas" lang="ru">
      <h1>tj-tag-chip</h1>
      <p class="tjtc-note">
        Навигационный чип фиолетовых полей: пилюля 40px, радиус
        <code>--tj-radius-chip</code> (20), пара заливка/чернила
        <code>chip-fill/chip-ink</code> — авторская AA-пара 5.813:1
        (референсный полупрозрачный чип давал 3.380:1 — пара переписана,
        архитектура «отрыва от поля» сохранена: 14% чёрного поверх
        badge-purple). Подпись — nav-label 17/700, шеврон декоративный
        (currentColor, aria-hidden). Подъём hover/focus −2px за
        duration-fast; кольцо фокуса — chip-ink, НЕ focus-ring: серо-синий
        токен кольца не проходит 3:1 на фиолетовом поле.
      </p>
      <div class="tjtc-field">
        <div class="tjtc-chiprow">
          <tj-tag-chip href="#kursy">Курсы</tj-tag-chip>
          <tj-tag-chip href="#longridy">Лонгриды</tj-tag-chip>
          <tj-tag-chip href="#keysy">Разборы кейсов</tj-tag-chip>
          <tj-tag-chip href="#community">Комьюнити</tj-tag-chip>
        </div>
      </div>
    </main>
  `,
};

export const AnchorContract: Story = {
  name: 'Контракт якоря и темы',
  render: () => html`
    ${canvasStyles}
    <main class="tjtc-canvas" lang="ru">
      <h1>Контракт якоря и темы</h1>
      <p class="tjtc-note">
        Якорный контракт — модель 16.1 verbatim: пустой <code>href</code>
        рендерит чип БЕЗ атрибута (инертный, вне табуляции);
        <code>target="_blank"</code> без rel получает
        <code>noopener noreferrer</code>; явный rel потребителя побеждает
        дословно. Тема: пара chip-fill/chip-ink НЕ имеет тёмного оверрайда в
        токен-слое (инварианты 15.2) — переключите тему сторибука: чип
        идентичен пиксель-в-пиксель. Это дизайн-решение: чипы живут на
        фиолетовых полях в обеих темах. Чипы — ССЫЛКИ в естественном порядке
        табуляции: без tablist, без aria-selected, без active/selected
        состояний (спека: ничего не изобретать). Ряд чипов переносится
        (flex-wrap) и никогда не скроллится — раскладка на потребителе.
      </p>
      <div class="tjtc-field">
        <div class="tjtc-chiprow">
          <tj-tag-chip href="">Инертный (без href)</tj-tag-chip>
          <tj-tag-chip href="#tab-order" target="_blank">Внешний (_blank)</tj-tag-chip>
          <tj-tag-chip href="#tab-order" target="_blank" rel="nofollow">
            rel потребителя побеждает
          </tj-tag-chip>
        </div>
      </div>
    </main>
  `,
};

export const ProHeroPattern: Story = {
  name: 'Паттерн: /pro/ hero',
  render: () => html`
    ${canvasStyles}
    <style>
      /* Pattern-level canvas styles — the composition is a STORY, not
         shipped API (the epics ruling). Structural FLAGS of the pattern
         (canvas geometry, unmeasured/scaled — NOTES.md /pro/ evidence):
         - field min-height 600: the measured 1260×600 register, scaled;
         - squircle radius 200 (pattern-level, NOT a token — NOTES.md);
         - squircle alpha 10% (chip-ink over the field, decorative);
         - h1 leading 40 (no pro-h1 leading token exists — pick);
         - CTA height 50 (measured 160–198×50 /pro/ CTAs). */
      .tjpro-hero {
        position: relative;
        overflow: hidden;
        max-width: var(--tj-space-column-reading-body);
        margin: 0 0 var(--tj-space-16);
        min-height: 600px; /* FLAG: measured register scaled to canvas */
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: var(--tj-space-24);
        padding: var(--tj-space-48) var(--tj-space-40);
        background: var(--tj-color-badge-purple);
        border-radius: var(--tj-radius-panel);
      }
      .tjpro-hero__title {
        position: relative;
        margin: 0;
        max-width: var(--tj-space-column-main);
        font-family: var(--tj-font-ui);
        font-size: var(--tj-text-pro-h1-size);
        font-weight: var(--tj-text-pro-h1-weight);
        line-height: var(--tj-space-40); /* FLAG: pick — no pro-h1 leading token */
        color: var(--tj-color-chip-ink); /* white ON the field rides the chip-ink pin (4.536:1) */
      }
      .tjpro-hero__chips {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: var(--tj-space-12);
      }
      .tjpro-hero__cta {
        position: relative;
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 50px; /* FLAG: measured /pro/ CTA height */
        padding-inline: var(--tj-space-24);
        border-radius: var(--tj-radius-cta-promo);
        background: var(--tj-color-badge-purple);
        color: var(--tj-color-chip-ink); /* chip-ink ON badge-purple = 4.536:1 machine-pinned pair (spec 16.3) */
        font-family: var(--tj-font-ui);
        font-size: var(--tj-text-cta-label-size);
        font-weight: var(--tj-text-nav-label-weight); /* pick: promo label weight */
        text-decoration: none;
      }
      .tjpro-hero__cta:focus-visible {
        outline: 2px solid var(--tj-color-chip-ink);
        outline-offset: 2px;
      }
      /* Decorative squircles — pattern art (aria-hidden), token-sourced ink. */
      .tjpro-blob {
        position: absolute;
        border-radius: 200px 200px 200px 0; /* FLAG: pattern-level squircle (NOTES.md) */
        background: color-mix(in srgb, var(--tj-color-chip-ink) 10%, transparent); /* FLAG: alpha pick */
      }
      .tjpro-blob--a {
        width: 228px;
        height: 360px; /* FLAG: measured decorative squircle */
        right: var(--tj-space-40);
        top: var(--tj-space-40);
      }
      .tjpro-blob--b {
        width: 160px;
        height: 240px; /* FLAG: scaled companion */
        right: var(--tj-space-48);
        bottom: var(--tj-space-48);
      }
    </style>
    <main class="tjtc-canvas" lang="ru">
      <h1>Паттерн: /pro/ hero</h1>
      <p class="tjtc-note">
        <strong>Это ПАТТЕРН композиции, а не API кита.</strong> Герой /pro/ —
       поверхность, собираемая потребителем: фиолетовое поле (badge-purple, r30 —
        измеренный регистр 1260×600, смасштабированный к канве),
        pro-h1 32/700 белым (chip-ink 4.536:1 на badge-purple — машинно
        закреплено), ряд <code>tj-tag-chip</code> с переносом, CTA
        r10×h50 (<code>--tj-radius-cta-promo</code>; фиолетовая заливка
        badge-purple, белая подпись chip-ink — та же закреплённая пара)
        и декоративные сквирклы
        (aria-hidden, паттерн-уровень). Фиделити-примечание: CTA живого
        героя в верхней части вьюпорта — текстовая ссылка без заливки;
        фиолетовые r10×h50 заливки измерены ниже фолда — паттерн
        показывает измеренный вид. Отдельный hero-компонент НЕ
        поставляется: ростер его не переиспользует — замораживать поверхность
        раньше времени спека запрещает. Всё — только <code>--tj-*</code>
        токены; поле инвариантно к теме (фиолетовый — носитель в обеих
        темах). Side-by-side цель:
        <code>tj-pro-viewport-2026-09-28.png</code>.
      </p>
      <section class="tjpro-hero">
        <div class="tjpro-blob tjpro-blob--a" aria-hidden="true"></div>
        <div class="tjpro-blob tjpro-blob--b" aria-hidden="true"></div>
        <h1 class="tjpro-hero__title">
          Обучение для тех, кто принимает решения о деньгах
        </h1>
        <div class="tjpro-hero__chips">
          <tj-tag-chip href="#pro-kursy">Курсы</tj-tag-chip>
          <tj-tag-chip href="#pro-longridy">Лонгриды</tj-tag-chip>
          <tj-tag-chip href="#pro-keysy">Разборы кейсов</tj-tag-chip>
          <tj-tag-chip href="#pro-community">Комьюнити</tj-tag-chip>
        </div>
        <a class="tjpro-hero__cta" href="#pro-programs">Смотреть программы</a>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjtc-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjtc-note">
        <code>tj-tag-chip</code> рендерит нативный <code>&lt;a&gt;</code> —
        роль, имя и Enter по конструкции. Цель 40px высотой; шеврон — чистая
        декорация (<code>aria-hidden</code>, <code>focusable="false"</code>).
        Чипы НЕ являются tablist: это ссылки рубрик в естественном порядке
        табуляции — без aria-selected, без стрелочной навигации. Кольцо
        фокуса 2px — chip-ink (белое): приоритет поверхности над общим
        токеном (AA-закон поверхностей: серо-синий общий токен кольца не проходит 3:1 на фиолетовом поле).
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
              Фокус входит на чип / покидает его по DOM-порядку; кольцо 2px
              обводит пилюлю с отступом 2px, одновременно срабатывает подъём
              −2px (тот же transform).
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Переход по href — нативная активация якоря.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>
              Прокрутка страницы — нативная дельта якоря, НЕ активация
              («Space scrolls», спека 16.3, I/O-матрица).
            </td>
          </tr>
          <tr>
            <td>Наведение / фокус</td>
            <td>
              Подъём −2px за 150ms (curve-standard). При reduced-motion
              токен-слой схлопывает длительность в 0ms — подъём мгновенный,
              без анимации; собственный media-query у чипа нет.
            </td>
          </tr>
          <tr>
            <td>Инертный чип</td>
            <td>href="" — вне табуляции целиком; визуально чип остаётся.</td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjtc-note">
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
            <td>Tab на чип</td>
            <td>«Курсы, ссылка» — якорь, не кнопка и не вкладка.</td>
          </tr>
          <tr>
            <td>Чтение чипа</td>
            <td>
              Только подпись слота: шеврон молчит (aria-hidden), «раскрывающийся»
              смысл чипу не приписывается.
            </td>
          </tr>
          <tr>
            <td>Ряд чипов</td>
            <td>
              Отдельные ссылки по одной — НИКАКОЙ семантики списка вкладок:
              tablist/tab не объявляется.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tj-tag-chip'),
};
