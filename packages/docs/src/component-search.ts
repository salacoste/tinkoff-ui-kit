import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';

/**
 * Interactive component search for the docs index (spec 5.5, EXPERIENCE
 * «Docs-site cold-load / empty search»).
 *
 * RECORDED RULING — scope: the docs-site states land on the kit's OWN index
 * page (component search + empty state + cold-load skeleton). Customizing the
 * Storybook manager chrome/sidebar search is OUT OF SCOPE: the manager is
 * tooling around the product surface, not the product surface itself.
 *
 * This is a DOCS-SITE element, not a kit component: it lives in packages/docs,
 * carries no `tk-` prefix, is not part of the CEM manifest and ships to no
 * consumer. Styling consumes var(--tk-*) tokens only (FR-1 scan root).
 *
 * The empty state copy is fixed by EXPERIENCE.md:
 * «Ничего не найдено. Попробуйте название компонента.»
 */

/** One searchable docs page — the 19 v1 component pages + the 11 v2 pages
 *  (Guides/ overviews + Patterns/ composition pages; the v2 family joined
 *  at 14.1) + the 16 ТЖ rows (10 tj-* component pages + 6 pattern/recipe
 *  pages; spec 17.3). */
interface SearchEntry {
  /** Sidebar/EN name — matches what the consumer sees in Storybook. */
  title: string;
  /** Element tag — the API name. OPTIONAL: pattern pages (Mega nav is the
   *  tk-navbar extension, so it KEEPS a tag; Console chrome / Data surfaces
   *  compose atoms and own no element) render no tag chip line. */
  tag?: string;
  /** Russian display name — what the RU docs copy calls it. */
  ru: string;
  /** Story id of the page's entry story (playground / Обзор). */
  id: string;
}

const COMPONENTS: readonly SearchEntry[] = [
  // 21.1 (invest foundation wave): the accordion opens the Epic 21 roster —
  // the first GAP-MAP Tier A atom; entry points at the Components/ story.
  { title: 'Accordion', tag: 'tk-accordion', ru: 'Аккордеон', id: 'components-accordion--playground' },
  { title: 'ArticleCard', tag: 'tk-article-card', ru: 'Карточка статьи', id: 'components-articlecard--playground' },
  { title: 'Badge', tag: 'tk-badge', ru: 'Бейдж', id: 'components-badge--playground' },
  { title: 'Button', tag: 'tk-button', ru: 'Кнопка', id: 'components-button--playground' },
  // 21.6 (invest foundation wave): the horizontal card carousel — GAP-MAP
  // Tier A #2, the recon's most repeated surface; entry points at the
  // Components/ story.
  { title: 'Carousel', tag: 'tk-carousel', ru: 'Карусель', id: 'components-carousel--playground' },
  // 23.1 (invest remainder wave): the static SVG price chart — GAP-MAP B1;
  // entry points at the Components/ story.
  { title: 'Chart', tag: 'tk-chart', ru: 'График', id: 'components-chart--playground' },
  // 23.2 (invest remainder wave): the «Профиль в Пульсе» publisher row —
  // GAP-MAP B14; avatar disc + bold name with verification chips +
  // subscriber meta + the consumer's follow action (stateless).
  { title: 'PublisherHeader', tag: 'tk-publisher-header', ru: 'Заголовок издателя', id: 'components-publisherheader--playground' },
  { title: 'Checkbox', tag: 'tk-checkbox', ru: 'Чекбокс', id: 'components-checkbox--playground' },
  // 21.3 (invest foundation wave): the «nothing here yet» block — GAP-MAP
  // Tier A #5; entry points at the Components/ story.
  { title: 'EmptyState', tag: 'tk-empty-state', ru: 'Пустое состояние', id: 'components-emptystate--playground' },
  { title: 'FeatureCard', tag: 'tk-feature-card', ru: 'Фича-карточка', id: 'components-featurecard--playground' },
  { title: 'Footer', tag: 'tk-footer', ru: 'Подвал', id: 'components-footer--playground' },
  { title: 'Input', tag: 'tk-input', ru: 'Поле ввода', id: 'components-input--playground' },
  // 22.5 (invest identity wave): the instrument page identity card —
  // GAP-MAP B2 (four measured gradient families, metric/logo/action
  // slots); entry points at the Components/ sandbox.
  { title: 'InstrumentHero', tag: 'tk-instrument-hero', ru: 'Герой инструмента', id: 'components-instrumenthero--playground' },
  // 22.4 (invest identity wave): the key-value spec list — GAP-MAP B4
  // (bond «Информация о выпуске» / future «Параметры» shape); entry points
  // at the Components/ story.
  { title: 'KvList', tag: 'tk-kv-list', ru: 'Список параметров', id: 'components-kvlist--playground' },
  { title: 'Link', tag: 'tk-link', ru: 'Ссылка', id: 'components-link--playground' },
  { title: 'Modal', tag: 'tk-modal', ru: 'Модальное окно', id: 'components-modal--playground' },
  { title: 'Navbar', tag: 'tk-navbar', ru: 'Шапка', id: 'components-navbar--playground' },
  // 21.4 (invest foundation wave): the quiet fine-print note — GAP-MAP
  // Tier A #6; entry points at the Components/ story.
  { title: 'Note', tag: 'tk-note', ru: 'Заметка', id: 'components-note--playground' },
  { title: 'ProgressBar', tag: 'tk-progress-bar', ru: 'Индикатор прогресса', id: 'components-progressbar--playground' },
  { title: 'PromoCard', tag: 'tk-promo-card', ru: 'Промо-карточка', id: 'components-promocard--playground' },
  // 22.1 (invest identity wave): the market-data chip family — GAP-MAP
  // A3, the only market-data answer in the kit; entry points at the
  // Components/ story.
  { title: 'QuoteChip', tag: 'tk-quote-chip', ru: 'Чип котировки', id: 'components-quotechip--playground' },
  // 21.5 (invest foundation wave): the read-only star rating — GAP-MAP
  // Tier A #7; entry points at the Components/ story.
  { title: 'Rating', tag: 'tk-rating', ru: 'Рейтинг', id: 'components-rating--playground' },
  { title: 'SegmentedRadio', tag: 'tk-segmented-radio', ru: 'Сегментный переключатель', id: 'components-segmentedradio--playground' },
  { title: 'Select', tag: 'tk-select', ru: 'Выпадающий список', id: 'components-select--playground' },
  { title: 'ServiceCard', tag: 'tk-service-card', ru: 'Сервисная карточка', id: 'components-servicecard--playground' },
  // 21.2 (invest foundation wave): the loading-placeholder bone — GAP-MAP
  // Tier A #4; entry points at the Components/ story.
  { title: 'Skeleton', tag: 'tk-skeleton', ru: 'Скелетон', id: 'components-skeleton--playground' },
  { title: 'Tabs', tag: 'tk-tabs', ru: 'Табы', id: 'components-tabs--playground' },
  { title: 'ThumbnailPicker', tag: 'tk-thumbnail-picker', ru: 'Выбор плиткой', id: 'components-thumbnailpicker--playground' },
  { title: 'Toast', tag: 'tk-toast', ru: 'Тост', id: 'components-toast--playground' },
  { title: 'Tooltip', tag: 'tk-tooltip', ru: 'Подсказка', id: 'components-tooltip--playground' },
  // --- the v2 family (14.1; regrouped from «Components v2» 2026-09-28):
  //     Guides/ carries 9 overview pages (8 element pages + the Mega nav
  //     extension, which KEEPS a tag — it is the tk-navbar two-row story);
  //     Patterns/ carries the two 13.x composition pages that own no
  //     element — no tag chip line renders for them.
  { title: 'Combobox search', tag: 'tk-combobox-search', ru: 'Поиск с подсказками', id: 'guides-combobox-search--page' },
  { title: 'Cookie banner', tag: 'tk-cookie-banner', ru: 'Баннер cookie', id: 'guides-cookie-banner--page' },
  { title: 'Data table', tag: 'tk-data-table', ru: 'Таблица данных', id: 'guides-data-table--page' },
  { title: 'Filter chips', tag: 'tk-filter-chips', ru: 'Фильтр-чипы', id: 'guides-filter-chips--page' },
  { title: 'Mega nav', tag: 'tk-navbar', ru: 'Мега-навигация', id: 'guides-mega-nav--page' },
  // 19.1: the entry points at the COMPONENT story (the Components/ group),
  // not a guides- page — the admin patterns live inside the MenuPopover
  // stories themselves; a dedicated overview page stays out of 19.1 scope.
  { title: 'MenuPopover', tag: 'tk-menu-popover', ru: 'Меню-поповер', id: 'components-menupopover--playground' },
  { title: 'Pagination', tag: 'tk-pagination', ru: 'Пагинация', id: 'guides-pagination--page' },
  { title: 'QR block', tag: 'tk-qr-block', ru: 'QR-блок', id: 'guides-qr-block--page' },
  { title: 'Stepper', tag: 'tk-stepper', ru: 'Шаги', id: 'guides-stepper--page' },
  { title: 'Store badges', tag: 'tk-store-badges', ru: 'Бейджи магазинов', id: 'guides-store-badges--page' },
  { title: 'Console chrome', ru: 'Хром консоли', id: 'patterns-console-chrome--page' },
  { title: 'Data surfaces', ru: 'Поверхности данных', id: 'patterns-data-surfaces--page' },
  // --- the ТЖ family (spec 17.3): the 10 tj-* component pages + the 6
  //     pattern/recipe rows. Findable by «tj», by the Russian display name
  //     or by the tag; the ТЖ getting-started page points here instead of
  //     embedding the search (its deliberate 17.3 ruling — that page stays
  //     non-interactive).
  { title: 'TJ Composer', tag: 'tj-composer', ru: 'ТЖ: композер сообщества', id: 'tj-composer--playground' },
  { title: 'TJ CTA', tag: 'tj-cta', ru: 'ТЖ: CTA-плашка', id: 'tj-cta--playground' },
  { title: 'TJ Header', tag: 'tj-header', ru: 'ТЖ: шапка журнала', id: 'tj-header--playground' },
  { title: 'TJ Link', tag: 'tj-link', ru: 'ТЖ: ссылка в теле', id: 'tj-link--playground' },
  { title: 'TJ News Card', tag: 'tj-news-card', ru: 'ТЖ: карточка ленты', id: 'tj-news-card--playground' },
  { title: 'TJ Post Card', tag: 'tj-post-card', ru: 'ТЖ: карточка поста', id: 'tj-post-card--playground' },
  { title: 'TJ Prose', tag: 'tj-prose', ru: 'ТЖ: колонка чтения', id: 'tj-prose--playground' },
  { title: 'TJ Rail', tag: 'tj-rail', ru: 'ТЖ: рельс разделов', id: 'tj-rail--playground' },
  { title: 'TJ Rubric Header', tag: 'tj-rubric-header', ru: 'ТЖ: шапка рубрики', id: 'tj-rubric-header--playground' },
  { title: 'TJ Tag Chip', tag: 'tj-tag-chip', ru: 'ТЖ: тег-чип', id: 'tj-tag-chip--playground' },
  //     Pattern/recipe rows compose atoms and own no element of their own —
  //     no tag chip line renders (the Console chrome mold).
  { title: 'TJ Article page', ru: 'ТЖ: страница статьи', id: 'tj-article-page--page-composition' },
  { title: 'TJ Ad slot recipe', ru: 'ТЖ: рекламный слот', id: 'tj-ad-slot-recipe--recipe' },
  { title: 'TJ Pattern: Rubric', ru: 'ТЖ: страница рубрики', id: 'tj-patterns-rubric--demo' },
  { title: 'TJ Pattern: Article', ru: 'ТЖ: паттерн статьи', id: 'tj-patterns-article--page' },
  { title: 'TJ Pattern: Community', ru: 'ТЖ: страница сообщества', id: 'tj-patterns-community--page' },
  { title: 'TJ Pattern: Pro', ru: 'ТЖ: /pro/ лендинг', id: 'tj-patterns-pro--page' },
];

/** Case-insensitive, ё-Insensitive containment. */
function matches(entry: SearchEntry, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const haystack = `${entry.title} ${entry.tag ?? ''} ${entry.ru}`
    .toLowerCase()
    .replaceAll('ё', 'е');
  return haystack.includes(normalizedQuery);
}

export class DocsComponentSearch extends LitElement {
  /** Initial filter value — lets a story demonstrate the empty state. */
  @property({ type: String }) query = '';

  @state() private searchTerm = '';

  protected override createRenderRoot() {
    // Light DOM: the links must be real anchors in the page for the
    // target="_top" navigation, and the page styles stay theme-flippable.
    return this;
  }

  protected override firstUpdated(): void {
    this.searchTerm = this.query;
  }

  private readonly onInput = (event: Event): void => {
    this.searchTerm = (event.target as HTMLInputElement).value;
  };

  protected override render() {
    const normalized = this.searchTerm.toLowerCase().trim().replaceAll('ё', 'е');
    const results = COMPONENTS.filter((entry) => matches(entry, normalized));
    return html`
      <style>
        .tkcs {
          box-sizing: border-box;
          font-family: var(--tk-font-body);
          font-size: var(--tk-text-body-m-size);
          font-weight: var(--tk-text-body-m-weight);
          line-height: var(--tk-text-body-m-leading);
          color: var(--tk-color-text-primary);
        }
        .tkcs-field {
          box-sizing: border-box;
          width: 100%;
          max-width: var(--tk-space-container);
          margin: 0 0 var(--tk-space-16);
          padding: var(--tk-space-12) var(--tk-space-16);
          font: inherit;
          font-size: var(--tk-text-body-m-size);
          color: var(--tk-color-text-primary);
          background: var(--tk-color-surface-field);
          border: 1px solid var(--tk-color-border-default);
          border-radius: var(--tk-radius-sm);
        }
        .tkcs-field:focus-visible {
          outline: 2px solid var(--tk-color-focus-ring);
          outline-offset: 2px;
        }
        .tkcs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--tk-space-grid-gap);
          margin: 0;
          padding: 0;
          max-width: var(--tk-space-container);
          list-style: none;
        }
        .tkcs-grid a {
          display: block;
          box-sizing: border-box;
          min-height: 44px;
          padding: var(--tk-space-12) var(--tk-space-16);
          text-decoration: none;
          color: var(--tk-color-text-primary);
          background: var(--tk-color-surface-muted);
          border: 1px solid var(--tk-color-border-default);
          border-radius: var(--tk-radius-sm);
        }
        .tkcs-grid a:hover,
        .tkcs-grid a:focus-visible {
          border-color: var(--tk-color-border-strong);
        }
        .tkcs-grid a:focus-visible {
          outline: 2px solid var(--tk-color-focus-ring);
          outline-offset: 2px;
        }
        .tkcs-grid code {
          display: block;
          margin-top: var(--tk-space-4);
          /* Code surfaces render the mono chain — --tk-font-mono's first
             consumer (story 11.2); block and inline alike. The tag chips
             are code content (element tags); missed by the story round's
             sweep (hyphenated selector stem), caught by the review lens. */
          font-family: var(--tk-font-mono);
          font-size: var(--tk-text-body-xs-size);
          line-height: var(--tk-text-body-xs-leading);
          letter-spacing: var(--tk-text-body-xs-tracking);
          color: var(--tk-color-text-secondary);
        }
        .tkcs-empty {
          margin: 0;
          padding: var(--tk-space-16) var(--tk-space-16);
          color: var(--tk-color-text-secondary);
          background: var(--tk-color-surface-muted);
          border: 1px dashed var(--tk-color-border-strong);
          border-radius: var(--tk-radius-sm);
        }
      </style>
      <div class="tkcs">
        <input
          class="tkcs-field"
          type="search"
          aria-label="Поиск компонента"
          placeholder="Название компонента"
          .value=${this.searchTerm}
          @input=${this.onInput}
        />
        <div class="tkcs-results" aria-live="polite">
          ${results.length
            ? html`
                <ul class="tkcs-grid">
                  ${results.map(
                    (entry) => html`
                      <li>
                        <a href="?path=/story/${entry.id}" target="_top">
                          ${entry.ru}
                          ${entry.tag ? html`<code>${entry.tag}</code>` : null}
                        </a>
                      </li>
                    `,
                  )}
                </ul>
              `
            : html`<p class="tkcs-empty">
                Ничего не найдено. Попробуйте название компонента.
              </p>`}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('docs-component-search')) {
  customElements.define('docs-component-search', DocsComponentSearch);
}

declare global {
  interface HTMLElementTagNameMap {
    'docs-component-search': DocsComponentSearch;
  }
}
