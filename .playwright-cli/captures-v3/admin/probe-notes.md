# probe-notes — admin (authorized-zone) pack 2026-09-27

Session type: **MAINTAINER SESSION** (the SR-RUNSHEET mold): the maintainer
navigated the logged-in Т-Банк business console read-only and handed over 8
PNG screenshots (delivered via chat 2026-09-27). The autonomous pipeline never
authenticated — the standing iron rule. Probe method differs from the
bank/business packs: **vision-model analysis of the delivered PNGs** — no
playwright-cli session, no computed styles. Geometry/colors below are
model-estimated from pixels (approximate, ±); the PNGs are the ground truth.

**PII: redacted before commit** (maintainer decision 2026-09-27 — full
redaction; the repo is public). Sensitive regions (names, account numbers,
balances, amounts, card last-4) are covered by opaque fills — see the
redaction log at the bottom. Values were never transcribed into any repo file.

## Per-capture findings

### admin-auth-tid-quick-entry (2000×1067) — T-ID quick-entry dialog
- Centered modal card ~690×490, white, **r24**, flat (no shadow) on `#F2F3F5`
  page backdrop; top-center dark circular logo ~84px.
- Greeting heading ~32–36/700 `#1C1C1E`; subtext 18 `#8B8F94`; **4 code-input
  cells** ~60×70, fill `#F0F1F4`, **r12**; two text links `#2A6EF4` (18px).
- Close control = 56px gray circle `#EEF0F3` top-right; T-ID badge = dark pill
  + yellow shield glyph top-left.
- Pattern: auth = centered card + code cells + links; zero filled buttons.

### admin-main-fullpage (858×2000) — «Главная» fullpage
- **Header ~70px**: «Т БИЗНЕС» logo, product links (Бухгалтерия / Отчётность /
  Интернет-эквайринг), «Все сервисы» trigger, icon cluster (payments, search,
  bell, user + avatar).
- **Secondary tab row** (Главная / Платежи / Выписка / Реквизиты / …):
  text-only tabs — the console's primary in-product nav.
- **Left column ~340px = CONTENT, not a nav rail**: «Ваши счета» widget (3
  account cards: icon + name + balance + number), «Добавить счет», promo
  banner, 3 mini-cards, feedback card with emoji rating.
- **Main column**: «Действия» toolbar — 6 buttons **h36–40, fill `#ECEEF0`,
  r10**, icon+label (one white variant with shadow); text tabs (Операции /
  В работе / Черновики); search; **filter chips** pills with active = yellow
  border `#FFDD2D`; «Запомнить» toggle; monthly summary; date-grouped
  transaction feed — rows with colored circular avatars, right-aligned amounts
  (**credits green `#3BC46D`**, debits dark), account label chips.
- Yellow appears ONLY as: active-chip outline, count badge «7», one avatar
  square. **No yellow button fills anywhere in the console.**

### admin-accounts-list (858×884) — «Ваши счета» panel crop
- Title ~34/700; **primary account = filled card** `#F2F2F2` r14–16 (balance +
  account number as dashed/underlined link + mini card graphic w/ MC mark);
  secondary row = plain, no card bg; «Цифровой рубль» row with red circular
  icon `#E5462D`; divider; «Добавить» row (+ icon); kebab «⋮» right-aligned.
- Row rhythm ~80–100px. List = flat rows + ONE highlighted primary card.

### admin-table-toolbar (1588×580) — payments list + toolbar («В работе»)
- Text tabs with **count badges** (gray circle with digit on inactive tabs).
- **Segmented filter control**: 2 pills h44, fully rounded r24 — **active =
  2px `#FFDD2D` outline on white fill**, inactive 1px gray outline; count
  digit inside the chip.
- **Summary row**: checkbox ~28px r8 + «Всего N платеж» left, total amount
  right-aligned.
- Row: 48–56px circular avatar (periwinkle `#A9C7F5`-ish + doc glyph), title +
  2 subtitles, right-aligned amount + pencil icon + date.
- **Status = gray pill h28** («Ожидает подписи») — light fill, gray text, NOT
  colored.

### admin-mega-menu (2000×1295) — «Все сервисы» dropdown
- Header ~125px: logo tile tan `#C9A26B` ~56px r14 + «БИЗНЕС», nav tabs with
  **active = dark underline `#333`**, search / bell / **avatar ~56px
  rounded-square**.
- Panel: full-width rounded card (x≈75–1925) **r24–32**, white, soft shadow,
  over `#E6E6E6` backdrop; **4 text columns** (~365px each at x≈130/595/1055/
  1515): bold group headings 26–28 + plain links 20–22, ~62px rhythm.
- **Monochrome**: zero yellow/colored fills inside the menu; links are plain
  text, no pills, no icons. Closest kit relative: v2 `mega-nav` (composition
  candidate, console-variant tweaks: 4 columns, underline trigger).

### admin-payments-hub (1780×1494) — «Платежи» hub
- Back = text link «◀ Назад»; H1 page title.
- **Favorites card**: white r24 full-width, inside = 5×2 grid of payee tiles
  `#F0F0F2` **r16**, each with «…» overflow dots.
- **In-progress slim bar** (white card) with **red count pill `#E5372B`**.
- Two option cards (r24): list-style rows with circular icon chips blue
  `#3B6EF5` / purple `#7B61C9`.
- Overflow «…» on EVERY tile — the menu-popover trigger is pervasive.

### admin-limits-company (2000×853) — «Лимиты» → Компания
- **Page header pattern**: top tab nav (active underline) → H1 title + **right
  -aligned secondary tabs** (Компания / Пользователи / Бизнес-карты) + 1px
  divider.
- Card white r24 + **3 sub-cards `#F0F0F2`** ~570px: label + value + thin
  progressbar (dark `#333`, blue sliver `#4A5FC1`) + «из X ₽» muted footer.
- bg `#F5F5F7`. **No yellow on this tab** — progress is neutral-dark here.

### admin-limits-business-cards (2000×912) — «Лимиты» → Бизнес-карты
- Same page-header pattern; H1 + circular «…» overflow button ~64px r16
  outlined.
- 2-col card grid (~845px, gutter 60): limit cards white r24 h~265 — holder
  name, limit description, **progressbar `#FFDD2D`** h10 fully-rounded,
  remaining caption + blue link «Изменить лимит» `#2B6BE4`, mini card preview
  + kebab «⋮».
- **Ghost action tile**: «Выпустить карту» — flat, blue icon+link, no border.

## Console design language (cross-surface, feeds DESIGN.md patterns)

- **Mono chrome is the console's identity**: yellow NEVER fills buttons; it
  survives only as selection outline (2px on active chips/segments), progress
  fill, logo. Marketing yellow-fill heroes do not cross into the authorized
  zone. Green/red carry value semantics only.
- Buttons: `#ECEEF0` fill r10 h36–40 icon+label; white+shadow variant for the
  emphasized one; actions-in-place = blue text links.
- Cards: white r24 flat/soft-shadow on `#F5F6F8`; nested sub-cards `#F0F0F2`
  r14–20; tiles r16.
- Tabs: text-only, active = bold + dark underline; page-level tabs right
  -aligned above a 1px divider.
- Status: gray pill h28 (uncolored); counts: gray in-chip circles, red pill
  `#E5372B` for attention, yellow-ring on nav badges.
- Feedback rows: colored circular avatars per counterparty; amounts right
  -aligned, credits green.
- Overflow everywhere: «…» circles and «⋮» kebabs — generic menu-popover is a
  real recurring trigger, dropdown state not captured.

## Roster ratification (vs the spec 13.1 gap-map)

| Gap-map verdict | Pixel verdict |
|---|---|
| NEW `tk-sidebar-nav` | **DROPPED** — no left rail exists; console = top header + secondary tabs; left ~340px is a content column |
| NEW avatar-menu + `tk-menu-popover` | **SPLIT** — avatar trigger confirmed (56px rounded-square), open state NOT captured; menu-popover triggers pervasive («…», «⋮»), panel anatomy grounded by mega-menu |
| COMPOSITION status tables | **CONFIRMED** (gray pill h28, count badges, segmented filter, summary row) |
| COMPOSITION toolbar | **CONFIRMED** (action buttons + search + chips + toggle) |
| NEW `tk-empty-state` | **NOT OBSERVED** — no empty surface in the delivery; stays ungrounded (defer) |
| NEW breadcrumbs | **DROPPED** — console navigates by tabs + back link; zero breadcrumbs seen |
| CONDITIONAL drawer | **RESOLVED ABSENT** — not observed; not in v1.3.0 |
| — (new evidence) | page-header pattern, segmented control (yellow-outline active), progressbar-in-cards, favorites tile grid, ghost action tile, T-ID auth dialog → backlog note |

## PII redaction log (pre-commit)

Decision (maintainer, 2026-09-27): **full redaction** — opaque fills over
names, account numbers, balances, amounts, card fragments; geometry/chrome
preserved. Unredacted originals live ONLY in the maintainer's local chat
cache — never in the repo.

| File | Redacted regions (data classes) |
|---|---|
| admin-auth-tid-quick-entry | greeting first name |
| admin-main-fullpage | header org label; account balances+numbers; summary amounts; counterparty names; transaction amounts |
| admin-accounts-list | balances; account numbers; mini-card number fragment |
| admin-table-toolbar | recipient org title+subtitle; amounts (summary + row) |
| admin-mega-menu | header org label + avatar |
| admin-payments-hub | payee names on tiles (option-card rows proved generic — labels only, kept) |
| admin-limits-company | remaining-limit values + «из X ₽» totals |
| admin-limits-business-cards | holder names; card last-4; remaining amounts |

(Box coordinates are applied via ImageMagick; the full redaction log with
coordinates and the verification evidence ledger live in
`../../verify/admin-13-1/NOTES.md`. Verification = a deterministic pixel
audit (unique-color count inside every fill) + fresh-path vision sweeps;
all 8 files CLEAN before commit.)
