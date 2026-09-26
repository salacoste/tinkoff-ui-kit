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

/** One searchable component entry — the 19 kit pages (names, not values). */
interface SearchEntry {
  /** Sidebar/EN name — matches what the consumer sees in Storybook. */
  title: string;
  /** Element tag — the API name. */
  tag: string;
  /** Russian display name — what the RU docs copy calls it. */
  ru: string;
  /** Story id of the component's playground story. */
  id: string;
}

const COMPONENTS: readonly SearchEntry[] = [
  { title: 'ArticleCard', tag: 'tk-article-card', ru: 'Карточка статьи', id: 'components-articlecard--playground' },
  { title: 'Badge', tag: 'tk-badge', ru: 'Бейдж', id: 'components-badge--playground' },
  { title: 'Button', tag: 'tk-button', ru: 'Кнопка', id: 'components-button--playground' },
  { title: 'Checkbox', tag: 'tk-checkbox', ru: 'Чекбокс', id: 'components-checkbox--playground' },
  { title: 'FeatureCard', tag: 'tk-feature-card', ru: 'Фича-карточка', id: 'components-featurecard--playground' },
  { title: 'Footer', tag: 'tk-footer', ru: 'Подвал', id: 'components-footer--playground' },
  { title: 'Input', tag: 'tk-input', ru: 'Поле ввода', id: 'components-input--playground' },
  { title: 'Link', tag: 'tk-link', ru: 'Ссылка', id: 'components-link--playground' },
  { title: 'Modal', tag: 'tk-modal', ru: 'Модальное окно', id: 'components-modal--playground' },
  { title: 'Navbar', tag: 'tk-navbar', ru: 'Шапка', id: 'components-navbar--playground' },
  { title: 'ProgressBar', tag: 'tk-progress-bar', ru: 'Индикатор прогресса', id: 'components-progressbar--playground' },
  { title: 'PromoCard', tag: 'tk-promo-card', ru: 'Промо-карточка', id: 'components-promocard--playground' },
  { title: 'SegmentedRadio', tag: 'tk-segmented-radio', ru: 'Сегментный переключатель', id: 'components-segmentedradio--playground' },
  { title: 'Select', tag: 'tk-select', ru: 'Выпадающий список', id: 'components-select--playground' },
  { title: 'ServiceCard', tag: 'tk-service-card', ru: 'Сервисная карточка', id: 'components-servicecard--playground' },
  { title: 'Tabs', tag: 'tk-tabs', ru: 'Табы', id: 'components-tabs--playground' },
  { title: 'ThumbnailPicker', tag: 'tk-thumbnail-picker', ru: 'Выбор плиткой', id: 'components-thumbnailpicker--playground' },
  { title: 'Toast', tag: 'tk-toast', ru: 'Тост', id: 'components-toast--playground' },
  { title: 'Tooltip', tag: 'tk-tooltip', ru: 'Подсказка', id: 'components-tooltip--playground' },
];

/** Case-insensitive, ё-Insensitive containment. */
function matches(entry: SearchEntry, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const haystack = `${entry.title} ${entry.tag} ${entry.ru}`
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
                          <code>${entry.tag}</code>
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
