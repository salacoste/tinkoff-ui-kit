---
title: 'Story 13.1 — admin gap-map + capture-source decision'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '4f4a40c'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (Story 13.1 gates the admin family)'
  - '{project-root}/packages/components/src/ (the 27-component roster fact-checked 2026-09-27: no avatar/user-menu in navbar, no status/badge use in data-table stories, no standalone drawer, no generic menu-popover)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md (the maintainer-session mold this story re-uses for captures)'
  - '{project-root}/.playwright-cli/captures-v3/INDEX.md (the pack convention the admin pack joins)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** the authorized-zone/admin family (the maintainer direction
2026-09-25: «наши клиенты будут писать админки») enters Epic 13 with no
ratified roster and no reference material — the surfaces are login-walled,
and the house pipeline (captures → probe → DESIGN.md pattern → spec →
component) cannot start from guesses.

**Scope — the gap-map verdicts (fact-checked against the repo 2026-09-27) and
the DECIDED capture source:**

| Surface | Verdict | Evidence |
|---|---|---|
| Sidebar navigation (authorized left rail) | **NEW `tk-sidebar-nav`** | kit has only marketing top-navbar (+v2 mega-nav); no rail |
| User/avatar menu | **NEW + a generic `tk-menu-popover`** | no avatar menu; select/combobox listboxes are internal form-bound popups |
| Status tables | **COMPOSITION** | data-table + badge exist; needs a status-column pattern preset (docs pattern) |
| Toolbar above tables | **COMPOSITION** | filter-chips + combobox-search + button compose it |
| Empty states | **NEW `tk-empty-state`** | icon+title+text+action surface absent |
| Breadcrumbs | **NEW (small)**; page header | composition of title+tabs+actions |
| Drawer / side panel | **CONDITIONAL — reference decides** | navbar has an INTERNAL burger-drawer; no standalone reusable drawer |

**Capture source — DECIDED 2026-09-27 (maintainer salacoste): MAINTAINER
SESSION** (the SR-RUNSHEET mold): the maintainer logs into the Т-Банк
business console / ЛК and hands over READ-ONLY captures; the autonomous run
never authenticates (the standing iron rule — nothing typed/submitted on the
live reference). Deliverables + run-sheet below.

</frozen-after-approval>

## Boundaries & Constraints

- The roster above is PROVISIONAL until the captures land: NEW↔COMPOSITION
  flips are expected where the live console composes differently (e.g. if the
  rail is a navbar variant, or empty states are plain prose blocks).
- The maintainer session captures ONLY screenshots (read-only navigation
  inside the authorized zone is fine; no form submissions, no sensitive-data
  screens — the run-sheet lists surfaces that avoid personal data panes).
- The admin pack lands at `.playwright-cli/captures-v3/admin/` per the root
  INDEX convention; 13.2/13.3 specs cite it as their reference source.

## Tasks & Acceptance

1. **Capture run-sheet issued** (below) — the maintainer's checklist. **AC:**
   the run-sheet lists every roster surface with capture instructions + file
   naming.
2. On capture delivery: probes + INDEX/probe-notes per the pack mold;
   roster ratified against pixels (flips recorded here).
3. 13.2/13.3 specs then cite the pack (sequencing gate).

## Implementation Notes — the CAPTURE RUN-SHEET (maintainer session)

Session: desktop browser 1280×800 (any modern browser; screenshots PNG).
Logged into the Т-Банк business console (or ЛК) — READ-ONLY navigation.
Avoid screens with personal data (balances/statement values are fine to
EXCLUDE — crop or skip; geometry and chrome are the target, not data).

| # | Surface | Capture | File name |
|---|---|---|---|
| 1 | Console main / dashboard | fullpage + viewport | `admin-main-{fullpage,viewport}-<date>.png` |
| 2 | Left sidebar rail (if present) | viewport with rail visible; collapsed state too if toggleable | `admin-sidebar{,-collapsed}-<date>.png` |
| 3 | User/avatar menu | viewport with the dropdown OPEN | `admin-avatar-menu-<date>.png` |
| 4 | Table screen (operations/clients) | viewport incl. toolbar above the table + status pills column | `admin-table-toolbar-<date>.png` |
| 5 | Empty state (empty filtered list / new client) | viewport | `admin-empty-state-<date>.png` |
| 6 | Breadcrumbs instance (if present) | viewport | `admin-breadcrumbs-<date>.png` |
| 7 | Side drawer/filter panel (if present) | viewport OPEN | `admin-drawer-<date>.png` |
| 8 | Dark mode of any of the above, if the console has it | same names + `-dark` | — |

Skip what the console lacks — every «if present» row is optional; the probe
round works with what exists. Hand the files over in any way convenient
(drop into `.playwright-cli/captures-v3/admin/` and say «готово»).

## Spec Change Log

1. 2026-09-27 — initial spec; gap-map fact-checked; capture source DECIDED
   (maintainer session) via AskUserQuestion.
2. 2026-09-27 — **capture delivery processed (8 screenshots) + roster
   RATIFIED against pixels.** Pack: `captures-v3/admin/` (8 PNGs + INDEX +
   probe-notes per the pack mold; probe method = vision-model analysis of
   the delivered PNGs — no playwright-cli session, no computed styles).
   Flips vs the frozen gap-map:
   - **`tk-sidebar-nav` DROPPED** — the console has NO left nav rail;
     navigation = top header (product links + «Все сервисы» mega-menu) +
     secondary text tabs (active = bold + dark underline). The left ~340px
     column on «Главная» is a «Ваши счета» CONTENT widget. → 13.2 re-scopes
     to console top-nav + tab bar + mega-menu composition (v2 `mega-nav` is
     the nearest kit relative; console variant: 4 text columns, underline
     trigger, monochrome).
   - **Breadcrumbs DROPPED** — console navigates by tabs + back text link;
     zero instances in the delivery.
   - **Drawer RESOLVED ABSENT** — no instance; not in v1.3.0.
   - **Empty-state stays UNGROUNDED** — no instance captured; deferred
     (needs a follow-up capture or stays out).
   - **Avatar-menu SPLIT** — trigger confirmed (56px rounded-square avatar +
     org label in header), open state NOT captured; menu-popover triggers
     are pervasive («…» circles, «⋮» kebabs). 13.2 either takes one more
     maintainer capture (dropdown open) or composes on existing popover
     primitives.
   - **Status-tables + toolbar COMPOSITION CONFIRMED** — gray status pill
     h28 (not colored), count badges (gray in-chip / red `#E5372B` /
     yellow-ring), segmented filter pills h44 with active = 2px `#FFDD2D`
     outline, summary row with checkbox r8.
   - **New evidence beyond the gap-map**: page-header pattern (H1 +
     right-aligned sub-tabs + 1px divider + «…» overflow), progressbar-in
     -cards (yellow + neutral-dark variants), favorites tile grid with
     per-tile overflow dots, ghost action tile, T-ID auth dialog (centered
     card r24 + code cells r12 + links) — auth family noted for backlog.
   - **Console design language** (feeds DESIGN.md): monochrome chrome —
     yellow = selection outline / progress fill only, NEVER a button fill;
     buttons `#ECEEF0` r10 h36–40; cards white r24 on `#F5F6F8`, sub-cards
     `#F0F0F2`; links blue; credits green `#3BC46D`.
   **PII (execution-discovered):** the delivered captures contain maintainer
   personal/financial data (ИП names, 20-digit account numbers, balances,
   transaction amounts, card last-4) — the run-sheet's crop/skip rule was
   not applied at capture time, and the repo is PUBLIC. Maintainer decision
   (AskUserQuestion, 2026-09-27): **FULL REDACTION** — opaque ImageMagick
   fills over every sensitive region BEFORE commit; geometry/chrome
   preserved; unredacted originals stay only in the maintainer's local chat
   cache; values never transcribed into any repo file (probe-notes carries
   classes, not values).

## Verification

Executed 2026-09-27: gap-map fact-check greps (navbar/avatar, data-table
status, drawer, menu-popover) run against the repo; roster + capture-source
decision recorded; run-sheet issued (Implementation Notes above). Capture
delivery processed the same day: 8/8 surfaces identified + analyzed (vision
model), pack written at `captures-v3/admin/` (8 PNGs + INDEX + probe-notes),
roster ratified (Change Log 2 flips above — the frozen table is superseded
where flipped), PII redaction applied pre-commit per the maintainer decision
(redaction log in the pack probe-notes; verification pass recorded in the
round NOTES). Task 2 AC met; task 3 (13.2/13.3 specs cite the pack) is the
sequencing gate for Epic 13's next stories.
