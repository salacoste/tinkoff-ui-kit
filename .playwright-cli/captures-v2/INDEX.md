# v2 Reference capture pack — three new domains (2026-09-24, recon)

Domains designated by the maintainer: tbank.ru/business, tbank.ru/invest/mobile-application,
tbank.ru/invest/stocks. Method: playwright-cli (session `tinkoff-ui`), `screenshot --hires`
element regions + full-page per domain; token probes via live computed styles; vision analysis
via zai-mcp-server on saved files. Read-only browsing, no data entered. Observations → NOTES.md.
(Partial agent run died at the API usage limit after the business domain; orchestrator completed
invest domains inline — same method.)

## File → domain → pattern map

| File | Domain | Pattern |
|---|---|---|
| `business/full.png` | business | whole page |
| `business/pattern-header.png` | business | slim header: logo/4 links/«Личный кабинет» — v1-navbar-mold, no CTA, no visible active marker |
| `business/pattern-products-grid.png` | business | asymmetric 2+3 bento, flat beige tint cards, floating white-pill CTAs, 3D art |
| `business/pattern-hero-service-selector.png` | business | hero + service selector |
| `business/pattern-application-form.png` | business | inline application form (business register) |
| `business/pattern-steps-open-account.png` | business | steps/how-to-open-account block |
| `business/pattern-link-grid.png` | business | link directory grid |
| `business/pattern-mobile-promo.png` | business | Т-Бизнес app promo |
| `business/pattern-app-tbusiness.png` | business | app showcase |
| `business/pattern-footer.png` | business | footer |
| `invest-stocks/full.png` | invest/stocks | whole page (catalog) |
| `invest-stocks/pattern-header-meganav.png` | invest/stocks | bank-wide mega-nav (Банк/Бизнес/Инвестиции/…) + Войти |
| `invest-stocks/pattern-catalog-filters.png` | invest/stocks | combobox search + checkbox-chip tablist (7 инструментов + «Ещё») + filter buttons w/ inline tooltips |
| `invest-stocks/pattern-table-stocks.png` | invest/stocks | typographic data table (NO sparklines), red/green deltas, 1px dividers, ~80px rows |
| `invest-stocks/pattern-cookie-banner.png` | invest/stocks | cookie consent dialog |
| `invest-mobile/full.png` | invest/mobile | whole page (marketing landing) |
| `invest-mobile/pattern-header-consumer.png` | invest/mobile | consumer-style header (Частным лицам/Бизнесу/Премиум/Еще) |
| `invest-mobile/pattern-hero.png` | invest/mobile | h1 crop (44px, bold) — full hero anatomy TBD at UX (re-capture with scroll) |
| `invest-mobile/pattern-qr-tabs.png` | invest/mobile | QR-code install tablist |
| `invest-mobile/pattern-store-badges.png` | invest/mobile | store-badges section heading (badges lazy below fold — re-capture at UX) |
