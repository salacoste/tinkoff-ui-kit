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

## Verification

Executed 2026-09-27: gap-map fact-check greps (navbar/avatar, data-table
status, drawer, menu-popover) run against the repo; roster + capture-source
decision recorded; run-sheet issued (Implementation Notes above). Awaiting
capture delivery for roster ratification (task 2).
