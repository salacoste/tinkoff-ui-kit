---
stepsCompleted:
  - v5-epics-authored
  - v5-epics-reviewed
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-tinkoff-ui-kit-2026-09-21/prd.md (§4.9, FR-17..22; OQ-8..10)
  - _bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/{DESIGN,EXPERIENCE}.md (the ТЖ authority)
  - _bmad-output/planning-artifacts/architecture/architecture-tinkoff-ui-kit-2026-09-21/ARCHITECTURE-SPINE.md (v5 Delta)
  - .playwright-cli/captures-v3/tj/{INDEX,probe-notes}.md (recon)
runMode: maintainer-sanctioned planning («ok lets continue» 2026-09-28, after the ТЖ recon report)
---

# tinkoff-ui-kit — Epic Breakdown v5 (the ТЖ sub-kit)

v1–v4 are complete and released (tags through v1.3.0). This file plans v5 per PRD §4.9
(FR-17..22): the ТЖ (Тиньков Журнал, t-j.ru) vertical as a SEPARATE EXPORTABLE SUB-KIT — a
parallel package family (`pillkit-tj-{tokens,components,react}`, `--tj-*`, `tj-`) with zero
runtime dependency on the bank family. The component-story gate applies VERBATIM to every ТЖ
story (FR-22 = the FR-16 treatment): impeccable zero blockers, axe in BOTH themes (native-dark
contract included), stories complete with keyboard checklists + SR protocol sections,
generated React wrapper, provisional baselines + side-by-side vs `captures-v3/tj/`.
Distribution stays GitHub git-tags; the ТЖ packages join the train (OQ-10 default).

## Epic 15: ТЖ family scaffold (the second kit stands up)

A consumer can install the ТЖ family ALONE — the lockfile proves it (FR-17) — and every later
story rides machinery identical to the bank kit's.

### Story 15.1: Workspace scaffold — parallel family + boundaries + CI

As a kit maintainer, I want the `tj-tokens` / `tj-components` / `tj-react` packages scaffolded
in the workspace with lint boundaries and CI coverage,
So that the family exists before any token or component lands (the v1 story-1.1 mold, second
instance).
- Given the v5 Delta (parallel lanes), when the packages are scaffolded, then
  `tj-components→tj-tokens`, `tj-react→tj-components`, `docs→tj-*` are the only allowed
  imports; ANY `tj-*→{tokens,components,react}` edge fails lint (FR-17 mechanized);
- `private: true` ×3, TS strict dual-alias setup mirrored, Vite lib builds + root typecheck
  green; CI gates (build/test/lint/typecheck) extended to the new packages on the same
  workflow; the docs package gains a ТЖ section shell.
- tj-components seeds its CONVENTIONS.md from the bank's frozen §4/§9 grammar (marked
  [OPEN — first stateful ТЖ component freezes]; AD-5).

### Story 15.2: ТЖ token layer — generator second input + mandatory probes + AA pins

As a kit maintainer, I want `--tj-*` tokens generated from the ТЖ DESIGN.md (light + native
dark + the auto/light/dark contract) with the radii/shadows PIXEL-PROBED before freezing,
So that every ТЖ component consumes named tokens only (FR-18 substrate) and no vision
artifact enters the table (the 9.1 lesson).
- First: live pixel-probe the vision-flagged candidates on the reference (card radii
  20/24/32, shadow lifts, CTA r5 confirm, icon-tile radius) — DESIGN.md amended with measured
  values BEFORE generation; probe forensics archived (`.playwright-cli/verify/tj-tokens/`);
- the generator runs as ONE mechanism with the ТЖ DESIGN.md as its second input (AD-3 v5):
  `--tj-*` on `:root` + `[data-tj-theme=dark]` + the `auto` media layer (EXPERIENCE.md
  contract); TS types + TOKENS.md listing; the bank table is untouched (byte-check);
- contrast test mechanizes the 3-decimal pins incl. the gold asymmetry (gold-ink light /
  reference gold dark) and the RESTRICTED inks (annotations carried — the 9.2 machine-truth
  mold, ТЖ instance); zero-hardcoded + consumed-tokens guards scoped to the ТЖ family.

### Story 15.3: ТЖ fonts — OQ-8 closure (stacks + fallbacks + local-fonts path)

As a licensed/unlicensed consumer, I want the two-family font contract shipped with honest
fallbacks and an optional self-host path,
So that ТЖ renders correctly without bundling proprietary Graphik/Charter (FR-20, OQ-2
policy).
- OQ-8 RULED: stacks carry `Graphik`/`Charter` first (licensed auto-pickup), open fallback
  pair per the UX proposal (Inter + PT Serif) unless the maintainer delivers licenses at or
  before this story (then the Daytona bundling mold applies — rename, LICENSE-FONTS entry);
- the docs local-fonts mechanism is extended to serve ТЖ docs renders; visual-harness font
  pinning decides (deterministic render) and is recorded; no font files land without a
  license record.

## Epic 16: Editorial roster (the FR-19 components)

A page author assembles every reconnoitered ТЖ surface from `tj-*` components, dark included,
keyboard-complete per the EXPERIENCE.md contracts.

### Story 16.1: Reading primitives — tj-prose + tj-link + tj-cta (FREEZE story)

As an article author, I want the reading column (serif lead/body, grotesque H2/pull-quote,
15px grotesque in-body links) and the quiet-geometry CTA/link primitives,
So that the ТЖ identity markers exist as components (and the first ТЖ component runs the
freeze ritual).
- `[verify-at-story]` resolved by live probe: article-H1 family (heads-grotesque assumption)
  + nav-label weight — probe forensics archived, DESIGN.md corrected if wrong;
- tj-prose: the w760/w764 reading container with the two-family cascade, RU hyphenation
  contract, slotted pull-quote/in-body links; tj-link: gold-ink light / gold dark semantic;
  tj-cta: #333 r5 h30 with the invisible 44×44 floor, dark pill inversion, link semantics;
- tj-CONVENTIONS [OPEN] items frozen at this story (AD-5 ritual, ТЖ instance); CEM manifest +
  generated React wrappers + `pnpm gen` wiring proven here (AD-1, second instance);
- FR-22 gate verbatim; side-by-side vs the article captures (both themes).

### Story 16.2: Rubric header + news card

As a rubric editor, I want the cover+squircle rubric header and the single-link-carrier news
card (24/700 titles, squircle mark + avatar byline, engagement counts),
So that feed surfaces compose from two components.
- Contracts per EXPERIENCE.md: decorative squircle (aria-hidden), whole-card single anchor,
  counts as static text, restricted time-ink usage; skeleton states (meta-ink alpha, never
  bank gray-200); FR-22 gate + side-by-side vs rubric-news captures.

### Story 16.3: Tag-chip nav + /pro/ hero pattern

As a course editor, I want the translucent tag-chip row (links, natural tab order) and the
purple hero pattern documentation,
So that the /pro/ surface composes.
- Chips = links with chevrons (decorative), wrap-never-scroll, 150ms lift; the purple hero is
  a DOCS PATTERN composing tokens + chips (scoped badge-purple carrier rule respected — no
  purple enters the general token surface set); FR-22 gate + side-by-side vs /pro/ captures.

### Story 16.4: Community — composer + post card

As a community member, I want the emit-only composer card and the clamped post card,
So that community surfaces compose without the kit owning application logic (Out: editorial
logic).
- Composer = button emitting `open-compose` + avatar slot; post card = news-card mold
  (2-line clamp + title attr); FR-22 gate + side-by-side vs community captures.

### Story 16.5: Chrome — tj-header + tj-rail + burger drawer (AD-12 helper)

As a site assembler, I want the sticky header (wordmark slot, nav chips, theme control,
«Написать» CTA) and the w290 rubric rail with its burger drawer,
So that every ТЖ page gets the chrome family.
- The theme control = menu button cycling auto→light→dark with polite announcements +
  no-flash attribute contract; sticky h72→h56 (150ms, reduced-motion honored);
- the ТЖ-owned overlay helper (mount + focus trap + scroll lock — AD-12 v5 ruling) lands
  here with the navbar-drawer behavioral mold (post-await revalidation, popover-UA resets);
- FR-22 gate + side-by-side vs home captures (light + native dark).

### Story 16.6: Article composition + ad-slot recipe + live walkthrough

As a consumer, I want the composed article page pattern and the documented ad-module recipe
(main-kit promo inside the ТЖ ad slot),
So that the FR-17/21 boundary is demonstrated end-to-end (Flow C) and the reading flow is
proven live.
- Article page pattern (header + rail + prose + engagement bar) from ТЖ components ONLY —
  the lockfile/imports assert it; ad-slot = slot + grid geometry, recipe composes the
  main-kit promo-card in docs (consumer-side, never a package edge);
- live walkthrough (the UJ mold): keyboard pass both themes incl. native-dark flip, sane
  focus topology, skeletons; walkthrough driver committed (`.playwright-cli/verify/tj-article/`).

## Epic 17: ТЖ verification + release

The ТЖ family ships under the same verification regime as every prior cycle, and the release
gate belongs to the maintainer.

### Story 17.1: ТЖ a11y sweep (the 5.1/11.1 method on the ТЖ stories)

Engine legs for every ТЖ story × both themes (native-dark contract): keyboard/ring/name/
geometry; SR computed name/role/state probe + SR-RUNSHEET-v1.4.0 drafted (live VO remains
the maintainer's, METHOD.md §SR boundary).

### Story 17.2: ТЖ dark sweep (the 5.4 mold, extraction-verification mode)

Structure parity both themes, slot-aware alpha chains, light-only-leftover detection — with
the twist that ТЖ dark values are the REFERENCE'S OWN: the sweep verifies extraction
fidelity, not authored tonal rules; any forced invariant failure re-opens the DESIGN.md dark
rows with measured evidence.

### Story 17.3: ТЖ docs completion (the 5.5/8.3 mold)

Token reference (generated, drift-proof), theming guide (the auto/light/dark contract),
getting-started (install-alone recipe + the ad-module integration recipe), API tables from
the ТЖ CEM, patterns pages (article, rubric, community, /pro/); search/anchors follow the
docs-regroup conventions.

### Story 17.4: Verification ledger + ad-language audit + impeccable + baseline package

Fidelity ledger ТЖ rows (side-by-side verdicts vs captures-v3/tj); the AD-LANGUAGE AUDIT:
a mechanical check that zero `#FFDD2D`/`#06101E`-family values exist in ТЖ tokens/components
(FR-21 — the yellow-audit's ТЖ analog); impeccable across BOTH trees; baseline review
package (ЧАСТЬ v1.4.0) assembled for the maintainer — GATE NOT EXECUTED by the run.

### Story 17.5: Release prep — the ТЖ family joins the train (TAG = maintainer)

Versions bump across the six shippable packages (bank ×3 + ТЖ ×3) on one tag (OQ-10);
CHANGELOG section; RELEASE.md «Релиз v1.4.0» recipe (fresh-clone consumer installs ТЖ ALONE
and renders tj-cta — the Flow-A lockfile acceptance at release grade); the tag itself ONLY on
the maintainer's explicit sanction (the standing rule).

## Sequencing and batches

15.1 → 15.2 → 15.3 (15.2+15.3 batchable if the font ruling needs no maintainer input) →
16.1 (FREEZE — never batched) → 16.2+16.3 (batch) → 16.4 → 16.5 → 16.6 → 17.1+17.2 (batch)
→ 17.3 → 17.4 → 17.5. Port-6007 serialization unchanged: ТЖ stories join the ONE visual suite.

## Review (critic pass, 2026-09-28)

- Challenged roster completeness vs the recon site map: games/shows/shopping/aptechka rubric
  surfaces are all news-card/rubric-header instances — no separate stories (kept as
  composition demos inside 17.3 patterns). Search/notifications/authorizations chrome
  interiors are consumer slots, not components (EXPERIENCE.md already rules them).
- Challenged 16.1 as FREEZE story (vs a dedicated pilot): justified — the API grammar
  inherits from the bank CONVENTIONS; only ТЖ-specific [OPEN] items freeze here.
- Challenged the purple-hero-as-pattern call (16.3): purple is a scoped carrier by DESIGN.md
  ruling; a component would generalize it — pattern wins.
- Challenged story sizes: 16.5 is the largest (header+rail+drawer+helper) but they share one
  behavioral spine (sticky/overlay) — kept together deliberately; split trigger recorded for
  the spec if the helper exceeds ~1 screen of diff.
- Gate coverage check: every component story carries FR-22 verbatim; Epic 17 carries the
  verification debt (sweeps/ledger/audit) — no gate lives only in prose.
