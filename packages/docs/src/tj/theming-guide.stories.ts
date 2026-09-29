import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../../tj-components/src/tj-cta/tj-cta.js';
import '../../../tj-components/src/tj-link/tj-link.js';
import '../../../tj-components/src/tj-tag-chip/tj-tag-chip.js';

/**
 * ТЖ theming guide (spec 17.3): the bank 5.5 mold duplicated-and-adapted —
 * switching (with the AUTO leg the bank guide does NOT have), semantic-level
 * overrides (the ТЖ roster exposes NO per-component channels — stated
 * truthfully, verified against the css.ts files), and the 17.2 dark-pairing
 * rulings (FLAT shadows kept as-is, the purple/gold invariants, the cta-fill
 * flip, the link pair flip, ink-reference-time unbound).
 *
 * Live demos flip via the TOOLBAR Theme control only — no in-page toggle, no
 * OS emulation inside the story (the preview determinism law; the harness
 * captures every demo in both themes).
 *
 * Demo overrides set ONLY --tj-* tokens and always to TOKEN values — the page
 * itself follows the zero-hard-coded rule. The purple-field pair override is
 * deliberately NOT rendered live: an unchanged white label on a
 * pseudo-painted purple pill is exactly the class the 17.2 dark sweep treats
 * as a leftover outside its legal grounds — it ships as code + warning
 * instead (the recorded adjustment of this story).
 *
 * Page chrome consumes bank --tk-* (docs-site chrome is shared); the stages
 * consume --tj-* only. Content RU (OQ-4), story meta EN for baseline
 * stability.
 */

const meta: Meta = {
  title: 'TJ/Theming Guide',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

const CONVENTIONS_URL =
  'https://github.com/salacoste/tinkoff-ui-kit/blob/main/packages/tj-components/CONVENTIONS.md';

const pageStyles = html`
  <style>
    .tjtg {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      /* Canvas follows the theme's base surface (the 5.4 dark-sweep rule). */
      background: var(--tk-color-surface-base);
    }
    .tjtg h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tjtg h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tjtg p {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tjtg ol,
    .tjtg ul {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tjtg li {
      margin: 0 0 var(--tk-space-8);
    }
    .tjtg a {
      color: var(--tk-color-link);
    }
    .tjtg code {
      /* Code surfaces render the mono chain (story 11.2); block and inline
         alike. */
      font-family: var(--tk-font-mono);
    }
    .tjtg pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    /* Scrollable code blocks join the tab order (the page-scaffold mold). */
    .tjtg pre:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    .tjtg .tjtg-note {
      color: var(--tk-color-text-secondary);
    }
    .tjtg .tjtg-warn {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-left: var(--tk-space-4) solid var(--tk-color-border-strong);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tjtg td,
    .tjtg th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
      vertical-align: top;
    }
    /* --- The ТЖ stage: --tj-* ONLY from here down (the FR-21 boundary) --- */
    .tjtg-stage {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tj-space-32) var(--tj-space-24);
      background: var(--tj-color-page);
      border: 1px solid var(--tj-color-divider);
      border-radius: var(--tj-radius-panel);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjtg-stage .tjtg-card {
      box-sizing: border-box;
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
      padding: var(--tj-space-24);
      background: var(--tj-color-card);
      border-radius: var(--tj-radius-card);
    }
    /* Page-ground text rides ink-100 exactly like the tj-rail row labels
       (ink-300 is a CARD-ground step only — the 16.5 mold). */
    .tjtg-stage .tjtg-stage-note {
      margin: 0 0 var(--tj-space-16);
      max-width: var(--tj-space-column-reading-body);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
    }
    .tjtg-stage .tjtg-card p {
      margin: 0 0 var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
    }
    .tjtg-stage .tjtg-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tj-space-16);
    }
    .tjtg-stage .tjtg-caption {
      margin: var(--tj-space-16) 0 0;
      font-size: var(--tj-text-time-meta-size);
      font-weight: var(--tj-text-time-meta-weight);
      line-height: var(--tj-text-byline-leading);
      color: var(--tj-color-ink-100);
    }
  </style>
`;

export const Switching: Story = {
  name: 'Переключение темы',
  render: () => html`
    ${pageStyles}
    <main class="tjtg">
      <h1>ТЖ — темизация: переключение</h1>
      <p class="tjtg-note">
        Тема ТЖ — это один атрибут <code>data-tj-theme</code> на корне
        документа. Ни правок разметки, ни классов, ни ветвлений в
        компонентах: семантические токены переопределяются слоем
        <code>[data-tj-theme="dark"]</code>, и каждая поверхность
        перестраивается наследованием.
      </p>

      <h2>Порядок подключения</h2>
      <ol>
        <li>
          Токеновый лист подключается ОДИН раз на уровне документа —
          компоненты наследуют разрешённые значения в свои shadow root:
          <pre tabindex="0"><code>import 'pillkit-tj-tokens/tokens.css';</code></pre>
        </li>
        <li>
          Тема переключается атрибутом на <code>&lt;html&gt;</code>:
          <pre tabindex="0"><code>&lt;html data-tj-theme="dark"&gt;</code></pre>
        </li>
      </ol>
      <p class="tjtg-note">
        Не внедряйте токеновый лист внутрь shadow root: светлый слой объявляет
        значения на <code>:host</code> и перебьёт унаследованные тёмные
        значения — ловушка shadow-каскада. Подробности — на странице
        «Начало работы ТЖ».
      </p>

      <h2>Нога AUTO — контракт, которого нет в банковском ките</h2>
      <p>
        У ТЖ ДВЕ ноги включения тёмного слоя (двойная эмиссия 15.2):
        явный атрибут И системное предпочтение. Атрибут
        <strong>отсутствует</strong> → тёмная включается сама под
        <code>prefers-color-scheme: dark</code>; явный
        <code>data-tj-theme="light"</code> РАЗОРУЖАЕТ авто-ногу — светлое
        остаётся светлым и под тёмной системой (контракт no-flash):
      </p>
      <pre tabindex="0"><code>/* токеновый лист эмитит обе ноги: */
:host([data-tj-theme="dark"]), :root[data-tj-theme="dark"] { /* … */ }
@media (prefers-color-scheme: dark) {
  :host(:not([data-tj-theme="light"])),
  :root:not([data-tj-theme="light"]) { /* те же переопределения */ }
}</code></pre>
      <div class="tjtg-warn">
        <strong>Caveat загрузчика.</strong> Рантайм этой документации пишет
        <code>data-tj-theme="light"</code> на рендере каждой истории, а
        визуальный харнесс снимает атрибут ПОСЛЕ settles, чтобы проверить
        авто-ногу (урок 16.6: атрибут — это контракт отображения, а не
        источник истины о состоянии; не ветвите рендер на чтение атрибута в
        момент загрузки). В своём приложении управляйте атрибутом сами:
        <code>null</code> — следовать системе, <code>"light"</code>/
        <code>"dark"</code> — принудительно.
      </div>

      <h2>Живая демонстрация</h2>
      <p>
        Переключите контрол Theme в тулбаре Storybook — сцена ниже
        перестроится без единой правки разметки: CTA-плашка и ссылка
        перевернутся парами, а чипы фиолетовых полей НЕ изменятся — их пара
        инвариантна по теме (16.2/16.3). Внутри историй нет ни собственного
        переключателя, ни эмуляции ОС — только тулбар (закон
        детерминированности preview).
      </p>
      <div class="tjtg-stage" lang="ru">
        <p class="tjtg-stage-note">
          Колонка чтения на карточке: ссылка в теле — вид зонда
          (<tj-link href="#tjtg-anchor">правило двух поверхностей</tj-link>),
          а CTA — тихая плашка 30px в невидимом боксе 44×44.
        </p>
        <div class="tjtg-card">
          <p>
            Статья читается как статья: серифный регистр в теле, гротеск в
            подзаголовках. Тема меняет только токены — не разметку.
          </p>
          <tj-cta href="#tjtg-cta">Написать</tj-cta>
        </div>
        <div class="tjtg-row">
          <tj-tag-chip href="#tjtg-chip-games">Игры</tj-tag-chip>
          <tj-tag-chip href="#tjtg-chip-shows">Сериалы</tj-tag-chip>
        </div>
        <p class="tjtg-caption">
          CTA и ссылка флипают с темой; чипы остаются на фиолетовом поле в
          обеих.
        </p>
      </div>

      <p class="tjtg-note">
        Полная таблица токенов со значениями обеих тем — на странице
        <a href="?path=/story/tj-token-reference--colors" target="_top"
          >ТЖ Token Reference</a
        >; правила тёмных пар — ниже в этой же группе.
      </p>
    </main>
  `,
};

export const Overrides: Story = {
  name: 'Переопределение токенов',
  render: () => html`
    ${pageStyles}
    <main class="tjtg">
      <h1>ТЖ — темизация: переопределение токенов</h1>
      <p class="tjtg-note">
        Уровень настройки у ТЖ сегодня ОДИН — семантические токены: когда
        бренд меняет палитру, переопределяются семантики, и вся тема
        перестраивается сама.
      </p>

      <h2>Семантический уровень</h2>
      <p>
        Значением берётся токен, а не литерал — переопределение продолжает
        ВИДЕТЬ тему: ниже CTA-пара уведена на ссылочную пару
        (<code>--tj-color-cta-fill</code> → <code>link-body</code>), и плашка
        по-прежнему флипает вместе с тёмным слоем, потому что флипает сам
        токен-значение.
      </p>
      <div class="tjtg-stage" lang="ru">
        <div class="tjtg-card">
          <div class="tjtg-row">
            <tj-cta href="#tjtg-default">Написать</tj-cta>
            <tj-cta
              href="#tjtg-overridden"
              style="--tj-color-cta-fill: var(--tj-color-link-body)"
              >Написать</tj-cta
            >
          </div>
          <p class="tjtg-caption">
            Слева умолчание (пара cta-fill/cta-ink), справа заливка уведена
            на ссылочный токен — инк остаётся парным, контраст держится в
            обеих темах.
          </p>
        </div>
      </div>
      <pre tabindex="0"><code>&lt;tj-cta
  href="#compose"
  style="--tj-color-cta-fill: var(--tj-color-link-body)"
&gt;Написать&lt;/tj-cta&gt;</code></pre>
      <p class="tjtg-note">
        Переопределяйте семантики на <code>:root</code> (вся тема) или на
        поддереве (одна поверхность) — механизм один и тот же: custom
        property наследуется в shadow root каждого компонента.
      </p>

      <h2>Покомпонентные каналы — их пока НЕТ</h2>
      <p>
        Грамматика <code>--tj-&lt;component&gt;-&lt;slot&gt;</code>
        зарезервирована в
        <a href="${CONVENTIONS_URL}" target="_blank" rel="noreferrer noopener"
          >CONVENTIONS.md</a
        >
        (быстрый справочник имён), но ростер 16.1–16.5 не объявил НИ ОДНОГО
        канала: каждый <code>css.ts</code> потребляет семантические токены
        напрямую, без fallback-хуков. Это проверяемый факт, а не обещание —
        тест потреблённых токенов уже выводит пространство имён хуков из
        реальных директорий компонентов, поэтому будущий канал не пройдёт
        мимо guards. Пока канал не существует — настраивайте семантику.
      </p>

      <h2>Инвариантное предупреждение: фиолетовые поля</h2>
      <p>
        Пара «белые чернила на фиолетовом» — близнец-закреплённая пара
        (16.2/16.3): <code>chip-ink</code> на <code>chip-fill</code> и на
        <code>badge-purple</code> выверена по AA и инвариантна к теме.
        Переопределять СЕМЬЮ полей на уровне листа нельзя — сломаются
        закрепления чипов и /pro/-hero. Локальная пара на scoped-носителе
        легальна ровно потому, что переиспользует закреплённую пару:
      </p>
      <pre tabindex="0"><code>/* scoped pair override — НЕ рендерится живьём в этой
   истории: неизменяющаяся белая метка вне легальных
   фиолетовых основ — класс leftover для тёмного свипа */
.pro-cta {
  --tj-color-cta-fill: var(--tj-color-badge-purple);
  --tj-color-cta-ink: var(--tj-color-chip-ink);
}</code></pre>
      <div class="tjtg-warn">
        <strong>Контракт ограниченных чернил.</strong> Чернила
        <code>--tj-color-engage</code>, <code>--tj-color-ink-reference-meta</code>
        и <code>--tj-color-ink-reference-time</code> — ограниченные: только
        счётчики/времени-меты, никогда имена и заголовки. Не назначайте их
        тексту сами.
      </div>
      <!-- Ссылка — на грунте страницы, НЕ внутри muted-бокса: банковская пара
           --tk-color-link на surface-base даёт AA (4.62), на surface-muted в
           светлой теме — 4.24, провал (находка axe-минта 17.3). -->
      <p class="tjtg-note">
        Правила и коэффициенты ограниченных чернил — на странице
        <a href="?path=/story/tj-token-reference--registers" target="_top"
          >«Регистры ТЖ»</a
        >.
      </p>
    </main>
  `,
};

export const DarkPairing: Story = {
  name: 'Правила тёмной темы',
  render: () => html`
    ${pageStyles}
    <main class="tjtg">
      <h1>ТЖ — темизация: правила тёмной темы</h1>
      <p class="tjtg-note">
        Тёмный слой переопределяет 13 семантических цветов — собственные
        значения референса (живой захват prefers-color-scheme, не авторинг).
        Правила 17.2 держат пары читаемыми без правок компонентов.
      </p>

      <h2>1. FLAT: тень — единственная и сохраняется</h2>
      <p>
        ТЖ — плоский язык: единственная тень <code>--tj-shadow-overlay</code>
        (панель подсказок), и в тёмной теме она ОСТАЁТСЯ как есть — в
        противоположность банковскому коллапсу теней в <code>none</code>.
        Иерархию строят тональные ступени: <code>page</code> →
        <code>card</code>. Не возвращайте элевацию вручную — любая иная
        геометрия тени ловится тёмным свипом как непроверенное возвышение.
      </p>

      <h2>2. Инварианты темы</h2>
      <ul>
        <li>
          <strong>Фиолетовые поля</strong> (<code>badge-purple</code>,
          <code>chip-fill</code>) и <strong>золото</strong> (<code>gold</code>,
          <code>gold-ink</code>) не переопределяются тёмным слоем: чипы
          остаются на фиолетовом с белыми чернилами <code>chip-ink</code> —
          близнец-закреплённая пара 16.2/16.3.
        </li>
        <li>
          <strong>Типографика, радиусы, отступы, моушен и z-шкала</strong> —
          один набор на обе темы.
        </li>
        <li>
          <strong><code>ink-200</code></strong> — только светлая CTA-заливка:
          сам флип несёт семантика <code>cta-fill</code>, тёмный сильный
          интерфейсный цвет — <code>ink-100</code>.
        </li>
      </ul>

      <h2>3. Парность</h2>
      <p>
        Заливка и чернила меняются ПАРАМИ: <code>cta-fill</code>/
        <code>cta-ink</code> инвертируются вместе (тёмная плашка — светлая с
        чёрными чернилами), ссылочная пара <code>link</code>/
        <code>link-body</code> флипает на светлый сине-фиолетовый.
        <code>ink-reference-time</code> в тёмной НЕ закреплён (тёмная статья
        не пробована) — не рендерите его, время-меты несут обычные шаги.
      </p>
      <div class="tjtg-stage" lang="ru">
        <p class="tjtg-stage-note">
          Одна разметка, две темы: плашка инвертируется парой, ссылка
          флипает видом зонда — переключите контрол Theme.
        </p>
        <div class="tjtg-card">
          <p>
            Колонка чтения со
            <tj-link href="#tjtg-dark-anchor">ссылкой в теле</tj-link> и
            плашкой действия.
          </p>
          <tj-cta href="#tjtg-dark-cta">Подписаться</tj-cta>
        </div>
        <p class="tjtg-caption">Пары cta-fill/cta-ink и link в обеих темах.</p>
      </div>

      <h2>Контраст — по таблице AA</h2>
      <p>
        Пары выверены механически: закрепления контрастов — в
        <code>tests/tj-contrast.test.ts</code>, полный тёмный аудит каждой
        истории — в <code>tests/visual/tj-dark-sweep.spec.ts</code>. Значения
        и формулировки правил — в
        <a href="?path=/story/tj-token-reference--registers" target="_top"
          >«Регистрах ТЖ»</a
        >. При переопределениях держитесь тех же правил: меняйте заливку и
        чернила парой и оставайтесь в пределах токенов.
      </p>
      <table>
        <thead>
          <tr><th>Пара</th><th>Светлая</th><th>Тёмная</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Текст на странице/карточке</td>
            <td><code>ink-100</code> на <code>page</code>/<code>card</code></td>
            <td>те же семантики (значения флипают слоем)</td>
          </tr>
          <tr>
            <td>CTA-пара</td>
            <td><code>cta-fill</code> + <code>cta-ink</code></td>
            <td>инверсия пары слоем</td>
          </tr>
          <tr>
            <td>Ссылка</td>
            <td><code>link</code> = <code>link-body</code></td>
            <td>обе флипают на тёмное значение вида зонда</td>
          </tr>
          <tr>
            <td>Чипы /pro/-полей</td>
            <td><code>chip-ink</code> на <code>chip-fill</code>/<code>badge-purple</code></td>
            <td>инвариантно (близнец-закреплённая пара)</td>
          </tr>
          <tr>
            <td>Время-меты</td>
            <td><code>ink-reference-time</code> (ограниченный)</td>
            <td>не закреплён — не рендерить</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
