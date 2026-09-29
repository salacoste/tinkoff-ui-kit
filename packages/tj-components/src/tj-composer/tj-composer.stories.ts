import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './tj-composer.js';

/**
 * tj-composer stories (spec 16.4): the fake-input composer card — playground,
 * the label/avatar anatomy, and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC community-shaped content, zero PII (spec constraint).
 * Placeholder art: NEUTRAL named-color SVG data URLs (the bank store-badges
 * mold — a placeholder image is content, but stays clean of hex literals).
 */

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const canvasStyles = html`
  <style>
    .tjcm-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjcm-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjcm-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjcm-canvas p,
    .tjcm-canvas .tjcm-note {
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
    .tjcm-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjcm-canvas td,
    .tjcm-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjcm-field {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
      padding: var(--tj-space-24);
      background: var(--tj-color-card);
      border-radius: var(--tj-radius-panel);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Composer',
  component: 'tj-composer',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjcm-canvas" lang="ru">
      <h1>tj-composer</h1>
      <p class="tjcm-note">
        Карточка-композер — «фейковый инпут» страницы сообщества: это КНОПКА,
        а не поле ввода. Настоящий <code>&lt;textarea&gt;</code> обещал бы
        редактирование, которое кит не доставляет — редактор остаётся на
        стороне потребителя, а весь контракт кита — событие
        <code>open-compose</code>. Высота собирается из масштаба:
        24 + 40 + 24 = 88 (виз. полоса 88–96; высота НЕ декларируется). Радиус
        — структурные <code>20px</code> с FLAG (зонд r20; токен
        <code>--tj-radius-composer</code> — кандидат на ратификацию, в этой
        истории НЕ минтится). Призрачный текст — вид card-title 17/400 на
        ink-300, ведущая 24 (пик по шкале — токена card-title-leading нет).
        Hover-арта НЕТ: поведение не зондировано — ничего не изобретаем.
        Side-by-side цель: <code>tj-community-viewport-2026-09-28.png</code>.
      </p>
      <div class="tjcm-field">
        <tj-composer label="Написать пост или вопрос…">
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ирины Сомовой" />
        </tj-composer>
      </div>
      <div class="tjcm-field">
        <tj-composer label="Спросите сообщество"></tj-composer>
      </div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия: канал label и слот avatar',
  render: () => html`
    ${canvasStyles}
    <main class="tjcm-canvas" lang="ru">
      <h1>Анатомия: канал label и слот avatar</h1>
      <p class="tjcm-note">
        Канал <code>label</code> — строка, НЕ отражается в атрибут ( freeze
        §2 из 16.1 перенесён на ТЖ): подмена текста — дословная, по умолчанию
        референсная копия «Написать пост или вопрос…». Слот
        <code>avatar</code> — опционален в обе стороны: пустой слот НЕ
        оставляет фантомного круга, блок текста держит свои паддинги; при
        заполнении аватар 40px круглый (<code>--tj-space-40</code> +
        <code>--tj-radius-badge</code>) в обёртке
        <code>aria-hidden</code> — аватар ЗДЕСЬ декоративен, идентификацию
        несёт имя кнопки (призрачный текст): alt слота не должен попадать в
        доступное имя. Обводка-плейсхолдер референса — арт потребителя,
        не хром кита.
      </p>
      <div class="tjcm-field">
        <tj-composer>
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ирины Сомовой" />
        </tj-composer>
      </div>
      <div class="tjcm-field">
        <tj-composer> </tj-composer>
      </div>
      <h2>Контракт события</h2>
      <p class="tjcm-note">
        Активация (клик / Enter / Space — нативная активация кнопки)
        диспетчит <code>open-compose</code> — класс
        <code>TjOpenComposeEvent</code>, <code>composed: true</code>,
        <code>bubbles: true</code>, БЕЗ detail (голый глагол §9, модель
        consent-choice/load-more). Элемент НЕ меняет ничего: ни редактора,
        ни состояния, ни фокуса — открытие редактора целиком на потребителе.
        Это ПЕРВАЯ запись в ТЖ-реестре событий
        (<code>packages/tj-react/src/event-map.ts</code>) — обёртка
        <code>Composer</code> получает проп <code>onOpenCompose</code>.
      </p>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjcm-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjcm-note">
        Настоящая <code>&lt;button type="button"&gt;</code>: роль, имя и
        Enter/Space по конструкции; пол 44×44 перекрыт с запасом (высота 88).
        Имя кнопки — призрачный текст (контент кнопки); аватар скрыт
        (<code>aria-hidden</code> на обёртке) — alt слота НЕ попадает в имя.
        Пустой <code>label=""</code> — контрактная строка: кнопка без имени;
        потребитель, опустошающий канал, именует кнопку сам — host
        <code>aria-label</code> пробрасывается кнопке дословно и побеждает.
        Кольцо фокуса 2px — токен focus-ring НА поверхности карточки
        (AA-закон поверхностей). Живых регионов нет: событие — не объявление.
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
              Фокус входит на карточку-кнопку ЦЕЛИКОМ / покидает её; кольцо
              2px обводит всю карточку с отступом 2px. Внутри таб-стопов нет —
              одна кнопка на всю карту.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>
              Диспетчится <code>open-compose</code> — нативная активация
              кнопки; редактор открывает потребитель.
            </td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>
              ТОЖЕ диспетчит <code>open-compose</code> — осознанная дельта к
              якорям («Space scrolls» на ссылках, но это КНОПКА: Space
              активирует, прокрутки НЕ происходит).
            </td>
          </tr>
          <tr>
            <td>Активация</td>
            <td>
              Ничего не мутирует: ни редактора, ни состояния, ни фокуса —
              только событие. Повторные нажатия диспетчат повторно.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjcm-note">
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
            <td>Tab на композер</td>
            <td>
              «Написать пост или вопрос…, кнопка» — имя из призрачного текста;
              аватар молчит (aria-hidden), «поле ввода» НЕ объявляется.
            </td>
          </tr>
          <tr>
            <td>Активация (Enter/Space)</td>
            <td>
              Объявления самой кнопки не меняются — событие не роняет
              объявления; открытие редактора озвучивает уже потребительский UI.
            </td>
          </tr>
          <tr>
            <td>Чтение страницы</td>
            <td>
              Композер — один элемент списка табуляции; «фейковый инпут» не
              создаёт второй таб-стоп и не объявляется как редактируемое поле.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tj-composer'),
};
