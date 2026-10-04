import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../breadcrumb/breadcrumb.js';
import '../button/button.js';
import '../link/link.js';
import { showToast } from '../toast/show.js';

/**
 * The legal/doc page (spec 24.9, pattern wave 24b): the invest «Раскрытие
 * информации» shape (gap-8, 5 466 px) — a dense fine-print column of
 * ~16 px prose with numbered/lettered enumerations and inline links,
 * h2/h3 = 0 (BOLD LEADS, not headings — the live pin), the crumb trail
 * above and a full-width yellow «Скачать PDF» bar below, plus the
 * for-deponents half: two blocks of DOC ROWS — svg icon + bold link title
 * + gray meta (rows, NOT cards).
 *
 * THE REGISTER RULING (the gap-8 pin, recorded): tj-prose is the WRONG
 * tool here — it is the editorial Charter 21/30 reading column, while the
 * legal page runs ~16 px body-m fine print. The prose below is CONSUMER
 * CSS on the kit registers (body-m), the enumerations are native ol/li,
 * the inline links are tk-link.
 *
 * DATA (the PD gate): every legal formulation below is FICTIONAL — genre
 * structure, not live texts; document titles and dates are demo stubs.
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type LegalDocArgs = Record<string, never>;

const TRAIL = [
  { label: 'Инвестиции', href: '#' },
  { label: 'Раскрытие информации' },
];

const canvasStyles = html`
  <style>
    .ld-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .ld-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE LEGAL COLUMN (consumer layout): ~16 px fine print — body-m, the
       gap-8 pin; NOT tj-prose (that is the editorial Charter column). */
    .ld-layout {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .ld-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    /* h2/h3 = 0 on the live page — paragraphs open with BOLD LEADS
       instead (the pin); the lead is a run-in <strong>, not a heading. */
    .ld-legal {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
    }
    .ld-legal ol {
      margin: 0;
      padding-left: var(--tk-space-24);
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .ld-legal .ld-alpha {
      list-style-type: lower-alpha;
    }
    .ld-legal .ld-roman {
      list-style-type: lower-roman;
    }
    .ld-download {
      width: 100%;
    }
    /* DOC ROWS (the for-deponents half): icon + bold link title + gray
       meta — ROWS, not cards (the gap-8 recipe). The row is its own hover
       surface: muted fill + radius, never a border box. */
    .ld-rows {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .ld-row {
      display: flex;
      align-items: flex-start;
      gap: var(--tk-space-16);
      padding: var(--tk-space-16);
      border-radius: var(--tk-radius-md);
    }
    .ld-row:hover {
      background: var(--tk-color-surface-muted);
    }
    .ld-row__icon {
      flex: none;
      display: inline-flex;
      margin-top: var(--tk-space-4);
      color: var(--tk-color-text-secondary);
    }
    .ld-row__icon svg {
      display: block;
    }
    .ld-row__body {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      min-width: 0;
    }
    .ld-row__title {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .ld-row__meta {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

/** Decorative document icon — currentColor, aria-hidden in the template. */
const DOC_ICON = html`
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 2h7l5 5v15H7z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path d="M14 2v5h5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M10 12h6M10 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
  </svg>
`;

/** Decorative table icon — currentColor, aria-hidden in the template. */
const TABLE_ICON = html`
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"></rect>
    <path d="M4 10h16M10 10v9" stroke="currentColor" stroke-width="1.5"></path>
  </svg>
`;

const meta: Meta<LegalDocArgs> = {
  title: 'Invest/Legal doc',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<LegalDocArgs>;

export const DisclosurePage: Story = {
  name: 'Раскрытие информации',
  render: () => html`
    ${canvasStyles}
    <main class="ld-canvas">
      <p class="ld-note">
        Страница раскрытия (спека 24.9): плотная юридическая колонка мелкого
        шрифта (~16 px, body-m) с нумерованными и буквенными перечислениями
        и инлайн-ссылками. ПИН: h2/h3 = 0 — абзацы открывают ЖИРНЫЕ ЛИДЫ, не
        заголовки (живая страница так и устроена); единственный h1 — титул
        канвы. РЕЦЕПТ РЕГИСТРА: tj-prose — НЕВЕРНЫЙ инструмент (это
        редакционная колонка Charter 21/30), юридическая проза —
        потребительский CSS на регистрах кита. Наверху — хлебные крошки
        (tk-breadcrumb, атом 24.9: nav-ориентир, ol/li, последний пункт
        aria-current без ссылки). Внизу — full-width жёлтая плашка
        «Скачать PDF» (tk-button primary; демо без выгрузки — тост). Для
        депозитариев — два блока doc-строк: иконка + жирная ссылка-заголовок
        + серая мета; РЯДЫ, не карточки (gap-8). Клавиатура: Tab — крошки,
        инлайн-ссылки, doc-строки, кнопка. Обе темы — без правок состава.
        Все юридические формулировки и названия документов вымышленные.
      </p>
      <div class="ld-layout">
        <tk-breadcrumb .items=${TRAIL}></tk-breadcrumb>
        <h1 class="ld-title">Раскрытие информации (демо)</h1>
        <div class="ld-legal">
          <p style="margin: 0">
            <strong>Демо-раздел 1. Общие условия.</strong> Настоящий
            вымышленный документ описывает структуру раскрытия демо-эмитента
            и не является юридическим текстом. Операции с инструментами
            описаны в
            <tk-link href="#">демо-регламенте</tk-link>, составленном как
            иллюстрация жанра.
          </p>
          <ol>
            <li>
              Демо-эмитент раскрывает вымышленные сведения о своей
              деятельности в порядке, установленном демонстрационным
              сценарием.
            </li>
            <li>
              Раскрытие осуществляется путём публикации демонстрационных
              документов на этой странице; сроки в примерах вымышленные.
            </li>
            <li>
              Изменения в порядок раскрытия вносятся вымышленной редакцией
              демо-регламента, указанной в
              <tk-link href="#">перечне редакций</tk-link>.
            </li>
          </ol>
          <p style="margin: 0">
            <strong>Демо-раздел 2. Состав раскрываемых сведений.</strong>
            Перечень сведений приведён для демонстрации структуры перечислений
            и не имеет юридической силы.
          </p>
          <ol class="ld-alpha">
            <li>вымышленное наименование демо-эмитента;</li>
            <li>демо-адрес страницы в сети Интернет;</li>
            <li>
              вымышленные сведения о регистрации демо-эмитента и присвоенных
              кодах.
            </li>
          </ol>
          <p style="margin: 0">
            <strong>Демо-раздел 3. Порядок ознакомления.</strong> Заинтересованное
            лицо знакомится с демонстрационными документами самостоятельно;
            нумерация подпунктов ниже — иллюстрация римской нумерации жанра.
          </p>
          <ol class="ld-roman">
            <li>выбор раздела раскрытия на демо-странице;</li>
            <li>ознакомление с вымышленным документом;</li>
            <li>фиксация демонстрационной даты ознакомления.</li>
          </ol>
        </div>
        <tk-button
          class="ld-download"
          variant="primary"
          size="card"
          @click=${() => showToast({ message: 'Выгрузка PDF — демо-действие без файла' })}
          >Скачать PDF (демо)</tk-button
        >
        <p style="margin: 0; font-size: var(--tk-text-body-m-size); font-weight: 700">
          Для депозитариев
        </p>
        <div class="ld-rows">
          <div class="ld-row">
            <span class="ld-row__icon" aria-hidden="true">${DOC_ICON}</span>
            <span class="ld-row__body">
              <span class="ld-row__title">
                <tk-link href="#">Демо-перечень документов депозитария</tk-link>
              </span>
              <span class="ld-row__meta">Вымышленная редакция от 01.01.2026 · PDF, 0,4 МБ</span>
            </span>
          </div>
          <div class="ld-row">
            <span class="ld-row__icon" aria-hidden="true">${TABLE_ICON}</span>
            <span class="ld-row__body">
              <span class="ld-row__title">
                <tk-link href="#">Демо-форма раскрытия для номинальных держателей</tk-link>
              </span>
              <span class="ld-row__meta">Вымышленная редакция от 01.02.2026 · XLSX, 0,2 МБ</span>
            </span>
          </div>
        </div>
        <p style="margin: 0; font-size: var(--tk-text-body-m-size); font-weight: 700">
          Для независимых оценщиков
        </p>
        <div class="ld-rows">
          <div class="ld-row">
            <span class="ld-row__icon" aria-hidden="true">${DOC_ICON}</span>
            <span class="ld-row__body">
              <span class="ld-row__title">
                <tk-link href="#">Демо-методика раскрытия отчётности оценщика</tk-link>
              </span>
              <span class="ld-row__meta">Вымышленная редакция от 15.01.2026 · PDF, 0,6 МБ</span>
            </span>
          </div>
          <div class="ld-row">
            <span class="ld-row__icon" aria-hidden="true">${TABLE_ICON}</span>
            <span class="ld-row__body">
              <span class="ld-row__title">
                <tk-link href="#">Демо-реестр раскрытых отчётов оценщиков</tk-link>
              </span>
              <span class="ld-row__meta">Вымышленная редакция от 20.02.2026 · XLSX, 0,3 МБ</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  `,
};
