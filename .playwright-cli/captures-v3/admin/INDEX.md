# Live captures v3 — admin (authorized-zone) round (2026-09-27)

Reference pack for the **authorized-zone / admin family** (Epic 13 — the
maintainer direction 2026-09-25: «наши клиенты будут писать админки»).
SURFACE FAMILY pack, not a subproject vertical: the console is the Т-Банк
business ЛК (tbank.ru business console), referenced for admin chrome and
data-surface patterns that kit consumers compose админки from.

Session: **MAINTAINER SESSION** (the root-INDEX mold for login-walled
surfaces — the SR-RUNSHEET lineage): the maintainer navigated the logged-in
console read-only and delivered 8 PNG screenshots via chat; the autonomous
pipeline never authenticated. Probe method: vision-model analysis of the
delivered PNGs (no computed styles — approximations; PNGs are ground truth).
Full findings: `probe-notes.md`.

**PII: redacted before commit** (maintainer decision 2026-09-27 — full
redaction; this repo is public). Opaque fills cover names / account numbers /
balances / amounts / card fragments; geometry and chrome are untouched.
Unredacted originals exist only in the maintainer's local cache.

## Files

| File | Content | Run-sheet slot |
|---|---|---|
| `admin-main-fullpage-2026-09-27.png` | «Главная» fullpage: header + tabs + accounts column + operations feed | 1 (fullpage) |
| `admin-payments-hub-2026-09-27.png` | «Платежи» hub: favorites tile grid + in-progress bar + option cards | 1 (viewport, second surface) |
| `admin-accounts-list-2026-09-27.png` | «Ваши счета» panel: primary filled card + flat rows + kebab | fragment of 1 |
| `admin-table-toolbar-2026-09-27.png` | Payments list + toolbar: tabs w/ counts, segmented filter, summary row, status pill | 4 |
| `admin-mega-menu-2026-09-27.png` | «Все сервисы» full-width 4-column dropdown | bonus (13.2 nav chrome) |
| `admin-limits-company-2026-09-27.png` | «Лимиты»/Компания: page header + sub-tabs + 3 limit cards w/ progress | bonus (page-header pattern) |
| `admin-limits-business-cards-2026-09-27.png` | «Лимиты»/Бизнес-карты: 2-col limit cards, yellow progress, ghost tile | bonus (same family) |
| `admin-auth-tid-quick-entry-2026-09-27.png` | T-ID quick-entry dialog: centered card + 4 code cells + links | bonus (auth family — backlog) |

Not captured (honest absence): avatar-menu OPEN state, collapsed rail (no
rail exists), empty state, breadcrumbs (absent in console), drawer (absent),
dark mode (console has none observed).

## Probe highlights (raw detail in `probe-notes.md`)

- **The console has NO left nav rail** — navigation = top header (product
  links + «Все сервисы» mega-menu) + secondary text tabs (active = bold +
  dark underline). The left ~340px column on «Главная» is a CONTENT widget
  («Ваши счета»), not navigation. → spec 13.1 roster FLIP: `tk-sidebar-nav`
  dropped; 13.2 re-scopes to console top-nav + tab bar + mega-menu
  composition (v2 `mega-nav` is the nearest kit relative).
- **Console chrome is monochrome**: yellow never fills buttons — it survives
  as 2px selection outline (active chips/segments), progress fill, logo.
  Buttons = `#ECEEF0` fill r10 h36–40; cards = white r24 on `#F5F6F8` with
  `#F0F0F2` sub-cards; links blue.
- **Status tables confirmed as composition** (slot 4): gray status pill h28,
  count badges, segmented filter pills h44 (active = yellow outline), summary
  row w/ checkbox r8, feedback rows w/ colored circular avatars.
- **New evidence beyond the gap-map**: page-header pattern (H1 + right-aligned
  sub-tabs + divider + «…» overflow), progressbar-in-cards (yellow /
  neutral-dark variants), favorites tile grid with per-tile «…», ghost action
  tile, T-ID auth dialog (code cells r12) — recorded for 13.2/13.3 scoping
  and the auth-family backlog.

## Subproject grounding

Epic 13's single reference source (13.2 navigation chrome, 13.3 data
surfaces). Roster ratification recorded in
`_bmad-output/implementation-artifacts/spec-13-1-admin-gap-map-capture-source.md`
(Change Log 2).

## Follow-up pack (f) — 2026-09-30 (open states; runbook: RUNBOOK-followup-captures.md)

Second maintainer session (read-only, logged-in console), 5 PNG via chat:
the 3 mandatory open states + bonus kebab on «Ваши счета» + the optional
compact empty state — closes the «Not captured (honest absence)» line
above. PII: opaque fills painted by the maintainer BEFORE delivery,
verified per-frame on probe (log in `probe-notes.md` § 2026-09-30);
values never transcribed. Outcome: **roster decision** — `tk-menu-popover`
atom confirmed NEW (spec 19.1), avatar-menu = composition via header slot,
full-page empty state stays ungrounded.

| File | Content | Run-sheet slot |
|---|---|---|
| `admin-avatar-menu-open-2026-09-30.png` | header avatar → open panel: user block + item groups + «Выйти» | 1 |
| `admin-kebab-open-2026-09-30.png` | payments table row «⋮» → commands panel | 2 |
| `admin-overflow-open-2026-09-30.png` | page-header «…» → panel (top in frame) | 3 |
| `admin-kebab-accounts-open-2026-09-30.png` | «Ваши счета» flat-row kebab → same panel mold | bonus |
| `admin-empty-state-2026-09-30.png` | COMPACT empty block (icon + title + sub + action inline) | optional №4 |
