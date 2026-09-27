---
stepsCompleted:
  - v4-epics-drafted (2026-09-27, post-v1.2.0 planning round — awaiting maintainer
    ratification; grounded in the maintainer's standing directions: admin family in
    scope 2026-09-25, subprojects direction 2026-09-26/27)
  - v4-epics-ratified (maintainer salacoste, 2026-09-27: «ok lets continue» in reply to
    the draft presentation — scope as drafted, 7 stories; execution starts at Epic 12)
inputDocuments:
  - _bmad-output/implementation-artifacts/deferred-work.md (the single ledger — near-clean after v1.2.0; this cycle owns the still-open entries it names)
  - _bmad-output/planning-artifacts/epics-v3.md (the mold; v3 COMPLETE, released as tag v1.2.0 → 7d3b3db)
  - RELEASE.md (§9 flow re-used verbatim as the release mold; §8.4 consumer recipe)
  - .playwright-cli/captures-v3/business/INDEX.md (the per-vertical capture-pack mold — business first)
  - .playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md (the maintainer-session mold re-used for authorized-surface captures)
runMode: ratified — executing (Epic 12 first)
---

# tinkoff-ui-kit — Epic Breakdown v4 (v1.3.0: subproject structure + admin family)

v1 (Epic 1–5, 38 stories) → v1.0.0. v2 (Epic 6–8, 14 stories) → v1.1.0. v3 (Epic 9–11,
9 stories) → v1.2.0 (tag 2855ec2 → release commit 7d3b3db, all gates + consumer verified
both themes). This cycle is shaped by two maintainer directions recorded since v1.2.0:
the kit HOSTS SUBPROJECTS (tinkoff bank / tinkoff business / tinkoff инвестиции; ТЖ
explicitly later) — per-vertical families over a shared 27-component core, not a flat
kit; and the AUTHORIZED-ZONE / admin surface is first-class scope («наши клиенты будут
писать админки»). Two interlude micro-stories landed after the v1.2.0 tag and ship in
this cycle's CHANGELOG: the mono-extension (33 component-package code rules +
docs demos card→hero) and the port-6007 tree-identity guard (serve.mjs /__tree__ +
globalSetup gate + lockfile). Non-goals (standing): transitions.dev literal folding
(still no consumer), packages/react peer-only layout (the vite-dedupe recipe covers
the class), iOS momentum-scroll + NVDA/VoiceOver execution (hardware-gated,
maintainer-side — run-sheets stand), button default tier stays 48 (the docs demos now
show both tiers; revisit only if admin reference rows force it).

## Epic 12: Subproject structure — the kit hosts verticals

### Story 12.1: Docs per-vertical restructure

As a kit consumer, I want the docs navigation organized by vertical (Банк — Homepage,
Заявка; Бизнес — Business landing; Инвестиции — Invest landing, Stocks catalog; ТЖ
reserved-empty for later) with Components / Components v2 untouched as the shared core,
So that per-vertical composition starts on the docs surface the subprojects direction
names, without fragmenting the component packages (the 27 stay one core).
- Story-title renames only (`Showcase/*` → per-vertical groups); story-meta stays EN,
  content RU; zero component-package edits;
- baseline RENAME round: `git mv` the affected PNGs (bytes unchanged), one full green
  run proves zero pixel churn — no mini-confirm unless a canvas actually changes;
- cross-link each vertical group to its capture pack (12.2).

### Story 12.2: Per-vertical reference capture packs

As a kit maintainer, I want `.playwright-cli/captures-v3/` formalized as the
per-vertical capture convention (business pack already lands the mold: capture +
INDEX.md + probe-notes.md per surface),
So that every subproject family (admin included) grounds in its OWN reference domain
instead of ad-hoc capture sprawl.
- captures-v3/business exists (cookie-banner 2026-09-27); add invest (cross-reference
  the captures-v2 invest-mobile / invest-stocks packs from the v3 INDEX — no byte
  moves) and bank (retail: homepage + form surfaces, fresh read-only pass);
- ТЖ reserved: INDEX slot only, «займемся позже»;
- convention written into the captures INDEX (surface-date naming, probe-notes mold,
  read-only iron rule).

## Epic 13: Admin / authorized-zone family

### Story 13.1: Admin gap-map + capture-source decision

As a kit maintainer, I want a gap-map of the authorized-zone surface against the
existing 27 (data-table, pagination, filter-chips, combobox-search, tabs, modal, toast
already cover part of the admin bones) plus a DECIDED capture source for
login-walled reference surfaces,
So that the family roster is ratified before any spec: what is a NEW component, what
is a composition/preset over the core, and what reference material each one grounds in.
- Candidate set from the direction memory: sidebar navigation, user/avatar menu,
  status tables/pills, toolbars, empty states, page header/breadcrumbs — each mapped
  to NEW vs COMPOSITION vs COVERED, with evidence;
- login-walled surfaces: the SR-RUNSHEET mold (maintainer-side session hands over
  read-only captures — the autonomous run never types/submits on the live reference);
- output: ratified roster + per-item reference packs → feeds 13.2/13.3 specs.

### Story 13.2: Authorized-zone navigation chrome

As an admin-panel author, I want the navigation chrome family (sidebar-nav and the
user/avatar menu — plus breadcrumbs if 13.1 keeps them) shipped through the full
v1 pipeline,
So that authorized screens compose their frame from the kit (the biggest gap-map
items: nothing in the kit renders a sidebar or an avatar menu today).
- Reference capture → pixel-probe → DESIGN.md pattern → Lit component + CEM + react
  wrapper; both themes; keyboard/SR protocols + a11y legs; baselines in the cycle's
  round.

### Story 13.3: Admin data surfaces

As an admin-panel author, I want the data-dense family — toolbar composition
(filter-chips + combobox-search + pagination), status/empty-state renderings on
data-table, and a side drawer if the gap-map demands it,
So that the admin workhorse screens (list + filter + detail) compose without
consumer-side glue.
- Expected mostly compositions/presets over existing components; empty-state is the
  likely NEW component;
- the cross-surface stacking debt (deferred-work, spec-2-2) gets its trigger CHECK
  here: admin compositions (toasts over modal over drawer) are the first real
  consumer of exact top-layer ordering — fold the ordered top-layer strategy into
  this story only if the reference composition demands it.

## Epic 14: v1.3.0 verification + release

### Story 14.1: Sweep deltas + docs completion

a11y-sweep engine legs for the new family (13.2/13.3); dark legs auto via the visual
suite; SR protocol sections extend in the touched stories (execution stays
maintainer-side per the §8.1.4 run-sheet mold); CEM-driven component pages + the new
vertical docs groups gain their family entries.

### Story 14.2: Verification ledger + release v1.3.0

Fidelity rows where reference-grounded (admin chrome + data surfaces vs the 13.1
packs); yellow-discipline audit extension; kit-wide impeccable; **maintainer baseline
batch PRE v1.3.0** (extends the 5.6/8.4/11.3 package — this cycle's round carries the
new-family legs); RELEASE.md §9 flow re-used verbatim: gates → tag v1.3.0
(maintainer-only) → fresh-clone consumer check (§8.4 recipe self-sufficient).

---

*Sequencing: 12.1 ∥ 12.2 → 13.1 → [13.2 + 13.3] → 14.1 → 14.2 (12.x are independent
of the admin line and land first as the docs/capture substrate; 13.1 gates the family —
no component spec before its roster + reference packs are ratified; 13.2+13.3 batch as
one spec round per the v2 [6.2+6.3] precedent if the roster stays within two families;
14.x mirrors 11.x. Total 7 stories.)*
