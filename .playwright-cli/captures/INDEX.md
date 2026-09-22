# Reference capture pack — tbank.ru (2026-09-22, Story 2.0)

Source of truth: spec-2-0-capture-pack.md. Session: `PLAYWRIGHT_CLI_SESSION=tinkoff-ui` (persistent
profile holds tbank.ru). Method: `playwright-cli screenshot <ref> --hires` element captures; full-page
crops (tints, Platinum banner) via ImageMagick from a fresh `--full-page --hires` shot (DPR 1 → CSS px
= image px). Mobile header via generic mobile emulation (360×732, DPR 3).

All form captures come from the **inline application form on the homepage** (tablist «Дебетовая карта /
Кредитная карта / Вклад» → debit tab selected). The form renders inline for the debit tab; the credit
tab renders its form inside an iframe. Dummy data only (Иванов Алексей Петрович / +7 (921) 123-45-67 /
ivan@domain.ru — placeholder-style values from the 2026-09-21 session profile); nothing was submitted.

## File → component → source map

| File | Component | Where on the page | URL |
|---|---|---|---|
| `input-application-form.png` | **Input** | «Фамилия, имя и отчество*» field (label + filled combobox-style field + `+20%` badge) in the debit-card application form | https://www.tbank.ru/ (debit tab form) |
| `select-cashback.png` | **Select** (closed) | trigger «Выберите повышенный кэшбэк (четыре категории)» | same form |
| `select-cashback-open.png` | **Select** (open menu) | same trigger after click — listbox «Выберите четыре категории»: 1% Все покупки, 5% Рестораны, 5% Аптеки, 5% Ozon.ru, 3% Пятёрочка, 5% Спорттовары, 5% Такси | same form, interaction state |
| `checkbox-consent.png` | **Checkbox** | consent line «Соглашаюсь получать рекламу про кешбэк…» with inline link | same form |
| `checkbox-consent-checked.png` | **Checkbox** (checked) | same consent line after checking the box — the Story 2.4 gap-close capture; method: fresh persistent session (the stale profile's service worker was redirecting to status.tbank-online.com — `delete-data`, reopen), trusted `check` on the native input via `input[type=checkbox] >> nth=1`, temp-id'd the wrapping label, `screenshot <selector> --hires` (DPR 1 → 536×38). Pixel-probed ground truth (ImageMagick): 16×16 box, fill exactly `#FFDD2D` (yellow-100), check glyph exactly `#333333` (ink-300) — the DESIGN.md frozen pairing confirmed; the 16 vs 20px box reading stays in the 2.0 flagged range (DESIGN 20px wins for the kit) | same form, interaction state |
| `segmented-radio-citizenship.png` | **SegmentedRadio** | «Гражданство РФ?» Да/Нет pill group (Да checked) | same form |
| `thumbnail-picker-card-design.png` | **ThumbnailPicker** | «Выберите дизайн карты» — 6 selectable card-design tiles (first checked) | same form |
| `progress-bar-fill.png` | **ProgressBar** | «Уже заполнено 5%» progress strip | same form |
| `badge-chip-incentive.png` | **Badge/Chip** | «+20%» incentive badge beside the ФИО field — the form's instance of the «+30%»-style badge; no literal «+30%» badge exists on the page | same form |
| `tabs-switcher.png` | **Tabs** | tablist «Дебетовая карта / Кредитная карта / Вклад» under «Управляйте финансами с выгодой в Т‑Банке» | https://www.tbank.ru/ |
| `navbar-desktop.png` | **Navbar** (desktop) | site header, 1280px viewport — logo, «Частным лицам / Бизнесу / Премиум / Еще», search, «Личный кабинет» | https://www.tbank.ru/ |
| `navbar-mobile.png` | **Navbar** (mobile) | site header at 360×732 (DPR 3) — logo, login pill, search, hamburger | https://www.tbank.ru/ (mobile emulation) |
| `footer.png` | **Footer** | full site footer | https://www.tbank.ru/ |
| `promo-card-grid.png` | **PromoCard** | «Рекомендуемые продукты» slider — 5 product cards (Платинум, Т‑Инвестиции, Т‑Мобайл, Вклады, ОСАГО) | https://www.tbank.ru/ |
| `feature-card-platinum.png` | **FeatureCard** | Платинум wide banner card (528×408, slate tint) — cropped from the fresh full-page shot at y≈2612 | https://www.tbank.ru/ |
| `feature-card-tj-banner.png` | **FeatureCard** | Т‑Ж banner «Как на самом деле пользоваться кредиткой» with «Читать» link | https://www.tbank.ru/ |
| `service-card-grid.png` | **ServiceCard** | «Сервисы и услуги» grid — Курсы валют, Снятие наличных, Переводы и пополнения | https://www.tbank.ru/ |
| `article-card-grid.png` | **ArticleCard** | «Актуально сейчас» — 3 article tiles | https://www.tbank.ru/ |
| `text-link-read-more.png` | **TextLink** | «Читать» link in its article tile (default state) | https://www.tbank.ru/ |
| `application-form-full.png` | context (bonus) | whole «Дебетовая карта Black» form block incl. header chips and submit row | https://www.tbank.ru/ (debit tab form) |
| `tint-mint.png` | tint evidence (Story 3.6) | ОСАГО product-card surface, computed `background-color: #D0F4F2`; crop 360×480 @ (844,3056), native zoom (DPR 1, no browser zoom) | https://www.tbank.ru/ product grid |
| `tint-beige.png` | tint evidence (Story 3.6) | right-column wide card (528×384) in the two-up row at y≈5972, computed `background-color: #F1EBD6`; crop 552×408 @ (652,5960), native zoom | https://www.tbank.ru/ |

## Gaps

None open. (The Checkbox checked-state gap was closed at Story 2.4 — see the
`checkbox-consent-checked.png` row above for the method and pixel-probe notes.)

Residual notes:

- «+30%» literal badge absent site-wide (homepage + form); the equivalent «+20%» field badge captured.
- Tabs switcher lives on the homepage (not /cards as the spec guessed) — no extra navigation needed.
- Mint/beige evidence: measured via `getComputedStyle().backgroundColor` on the live DOM (see
  `.working/captures-2026-09-22.md` § Tints) and cropped 1:1 from the same-render full-page shot.
