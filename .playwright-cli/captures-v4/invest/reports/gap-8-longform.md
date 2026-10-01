# Gap report 8 — invest longreads / legal / 404 (5 pages, chunk 2)

Source: inv-gap2-longform agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census (research-review-sample, research-strategy-sample [census-only, size], disclaimers-risk, for-deponents, notfound). Image budget (2) spent on disclaimers-risk.png + for-deponents.png.

Repo facts used for coverage claims — full tag roster: 30 tk-* + 10 tj-* (`tj-composer, tj-cta, tj-header, tj-link, tj-news-card, tj-post-card, tj-prose, tj-rail, tj-rubric-header, tj-tag-chip`). `tj-prose` slotted species ONLY `p / p[lead] / h2 / blockquote / a` (packages/tj-components/src/tj-prose/tj-prose.css.ts:75-145) — no figure, img, table, list, h3 species; unknown tags render unstyled. Grep breadcrumb/callout/footnote/TOC/accordion across components/src + tj-components/src + docs/src: zero component hits.

## research-review-sample — «Рынок удобрений» (/invest/research/review/2022-fertilizers/)
- Page scale — NEW-PATTERN — scrollH 56,694 px (~44 screens), links 362, h2 5: analytic-longread template the ТЖ article pattern (packages/tj-components/src/patterns/article-page.stories.ts) does not compose.
- Embedded charts — NEW-COMPONENT — iframes 55, canvas 0, tables 0: ALL data-viz arrives as sandboxed iframe embeds; kit has zero figure/embed species.
- Figures/images — NEW-COMPONENT (same figure block) — img 29 (figures + avatars/logos); no figcaption/caption species in kit.
- Byline/analyst block — VARIANT — ТЖ byline recipe exists; invest byline is analyst-flavored (role, disclaimer link) — census-only, unverified detail.
- Page tabs (2 tabs/1 tablist) — COVERED — tk-tabs.
- TOC/sticky nav, footnote blocks — UNVERIFIED from census — details 0 kills collapsible variants; flat footnote links / sticky TOC cannot be proven or excluded without a slice read. Flag for follow-up probe, not a claim.
- Header/footer/CTA/cookie — COVERED.

## research-strategy-sample — «Защитные облигации» (/invest/research/strategy/2021-bonds/)
- Same template smaller — NEW-PATTERN — scrollH 27,406, links 356, iframes 24, img 23, svg 18, buttons 18.
- Embedded charts — NEW-COMPONENT — iframes 24 / canvas 0 / tables 0, same evidence.
- Dual tablists (4 tabs/2 tablists) — COVERED (tk-tabs) as primitive; composed template is part of the longread pattern.

## disclaimers-risk — «Не является индивидуальной инвестиционной рекомендацией» [image-read]
- Legal-text page — NEW-PATTERN — dense small-print column with numbered/lettered enumerations and inline links; h2/h3 0 (bold paragraph leads, not headings). tj-prose is the wrong instrument: editorial Charter 21/30 + H2 38px vs legal ~16px fine print. No legal/document-text species in either family.
- Breadcrumb («Инвестиции / Раскрытие информации») — NEW-COMPONENT — zero breadcrumb implementations in repo (grep); appears on invest inner pages generally.
- «Скачать PDF» full-width yellow pill — COVERED — tk-button (full-width = layout variant).
- Page chrome — COVERED.

## for-deponents — «Новости вышестоящих депозитариев» [image-read]
- Document/link list — NEW-PATTERN — two sections of icon + bold-title + gray-meta link rows; svg 40, links 192, buttons 2, no h1 in DOM. No list-row/document species in kit (tk-menu-item dropdown-scoped; tj-news-card / tk-article-card are cards, not rows).
- Chrome — COVERED.

## notfound — «Такой страницы нет»
- 404 composition — NEW-PATTERN — census: h1 + 4 img + 7 links, 0 inputs / 0 buttons / 0 svg, scrollH 978. Hypothesized «404 illustration+search» CONTRADICTED: no search field, no buttons — illustration + h1 + links only. Nothing in kit covers it (no error/404 pattern). Estimate S.
- Note: 0 svg — even the logo is not inline SVG; page close to chromeless.

## Cross-page notes
- Chrome uniform on all 5 pages — COVERED (tk-navbar/mega-nav, tk-footer, tk-cookie-banner).
- details:0 on ALL 5 pages — any footnote/TOC candidate must be flat, not `<details>`-based.
- **iframe-as-chart is the strongest structural signal**: review 55 + strategy 24 iframes with canvas 0 AND tables 0 at top level — every table/chart in the analytic template lives inside sandboxed embeds, so the kit gap is the FIGURE WRAPPER (caption + lazy embed + aspect), not the chart engine.
- Unverified from census (flag): sticky TOC on research (tabs 2/tablists 1 might be a switcher), footnote blocks (flat-link unprovable), byline details. A slice probe would settle all three.

## Final ranked shortlist
1. tk-chart-figure / embed-figure — NEW-COMPONENT, M — captioned slot for iframe/img data-viz (optional lazy-load + aspect contract). Evidence: 55 + 24 iframes, 0 canvas, 0 tables. Core of the analytic template; highest value.
2. Invest research-article PATTERN — NEW-PATTERN, M/L — analyst byline + figure flow + tabs + closing «Не является ИИР» risk note; composes #1; docs-side recipe like the ТЖ article pattern.
3. Legal/document prose page («Раскрытие информации») — NEW-PATTERN, S/M — h1 + full-width yellow «Скачать PDF» + dense small-print enumerations; tj-prose wrong scale. Could ship as a variant story before any component.
4. Document/link list rows (for-deponents) — NEW-PATTERN, S — icon + bold-title + gray-meta link rows. Reusable across invest info pages.
5. tk-breadcrumb — NEW-COMPONENT, S — «Инвестиции / Раскрытие информации» on inner pages; zero implementations repo-wide.
6. 404 pattern — NEW-PATTERN, S — illustration + h1 + links, explicitly NO search.

Explicitly COVERED: header/navbar + mega-nav, footer, yellow CTA, page tabs, cookie dialog, search entry (tk-combobox-search — the 404 ships none). VARIANT-only: byline row, full-width PDF button. No claims rely on the two full-size research PNGs (census-only).
