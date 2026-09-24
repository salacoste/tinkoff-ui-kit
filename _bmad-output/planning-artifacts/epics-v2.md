---
stepsCompleted:
  - v2-epics-authored
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-tinkoff-ui-kit-2026-09-21/prd.md (§4.8, FR-12..16)
  - _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/{DESIGN,EXPERIENCE}.md (v2 rows)
  - _bmad-output/planning-artifacts/architecture/architecture-tinkoff-ui-kit-2026-09-21/ARCHITECTURE-SPINE.md (v2 delta)
  - .playwright-cli/captures-v2/{INDEX,NOTES}.md (recon + UX-phase addendum)
runMode: autonomous continuation (standing delegation; v1's 38 stories all closed — this file extends the plan with v2)
---

# tinkoff-ui-kit — Epic Breakdown v2 (multi-domain expansion)

v1 (Epic 1–5, 38 stories) is COMPLETE and released as tag v1.0.0. This file plans v2 per PRD
§4.8 (FR-12..16): the business + invest domains, 9 new components, table semantics, the
warm-cream family, typography registers. The v1 component-story gate applies VERBATIM to every
v2 story (FR-16): impeccable zero blockers, axe both themes, stories complete with keyboard
checklists + SR protocol sections, generated React wrapper, provisional baselines +
side-by-side vs the v2 captures. Distribution stays GitHub git-tags (release = v1.1.0 at 8.4).

## Epic 6: Data-table family (the stocks-catalog pattern)

A developer can assemble the invest/stocks catalog — search, filter chips, typographic table,
pagination — from kit components, keyboard-complete per the APG improvement layer.

### Story 6.1: v2 token layer — table semantics + warm-cream + registers

As a kit maintainer, I want the v2 tokens generated (delta-positive/negative semantics via the
AA-override pattern, border-table, surface-row-hover, tint-cream/-raised + dark first-pass
[ASSUMPTION], the registers documented in the canonical listing),
So that every v2 component consumes named tokens only (FR-15 substrate).
- Given DESIGN.md frontmatter (already carrying the v2 rows), when `pnpm gen:tokens` runs,
  then tokens.css/ts/TOKENS.md gain the new names; contrast table extends (delta pairs ≥4.5:1
  both themes); zero-hardcoded/consumed-tokens guards cover the new names; dark first-pass
  values flagged [ASSUMPTION] for 8.2.

### Story 6.2: FilterChips + Pagination

As a page author, I want the chip filter row (single-select semantics, pill selected state,
«Ещё» overflow dropdown) and the numbered pagination (yellow active pill, «Показать еще»),
So that data views filter and page like the reference (FR-12).
- Chips: tab stops + arrow cycle; focus PRESERVED on toggle (the reference defect fixed);
  §4 channel (string value); «Ещё» opens the overlay controller dropdown layer.
- Pagination: nav landmark; active page not a link; load-more = secondary button; focus stays
  on nav after change (§4 channel: page-change).
- Component gate each; baselines + side-by-side vs `invest-stocks/pattern-catalog-filters.png`
  and the table capture's pagination region.

### Story 6.3: ComboboxSearch

As a page author, I want the typeahead search field («Название или тикер»),
So that catalogs are searchable keyboard-complete (FR-12).
- The Select 2.3 mold: opens on typing, arrows navigate, Enter selects, Esc returns focus;
  polite count announcement; overlay controller only; §4 channel.
- Gate + side-by-side vs the catalog-filters capture region.

### Story 6.4: DataTable

As a page author, I want the typographic data table (row-as-link, two-line cells, deltas),
So that catalogs render exactly like the reference with BETTER keyboard (FR-12).
- 81px rows, 1px border-table dividers, hover surface-row-hover, delta text semantics
  (color carries direction; sign optional per cell data), body-m/s cells with the dense
  leadings; column headers static; rows plain anchors + the APG layer (roving tabindex,
  ArrowUp/Down, Home/End, Enter/Space activate).
- Props-driven columns/rows data shape (the 2.3 options mold); no selection channel v2.
- Gate + side-by-side vs `invest-stocks/pattern-table-stocks.png`; pixel probes (divider,
  hover, delta colors, row height).

### Story 6.5: Composed stocks catalog + walkthrough

As the maintainer, I want the invest/stocks above-the-fold catalog reassembled (mega-nav is
7.1 — compose with a plain header stand-in or after 7.1 lands; sequence 6.5 AFTER 7.1),
So that FR-12's composition consequence is proven (search + chips + table + pagination, one
page, keyboard walkthrough recorded).
- Composition story + live walkthrough (Tab/arrow journey through the whole cluster; the
  a11y-sweep ledger gains the v2 rows); axe both themes; side-by-side vs
  `invest-stocks/full.png` top region.

## Epic 7: Site chrome + marketing blocks

### Story 7.1: MegaNav (two-deep header)

As a page author, I want the two-deep header (bank-wide row + domain sub-nav row),
So that cross-domain sites navigate like invest/business (FR-13).
- Extension of tk-navbar (not a new element where avoidable — pick: new `tk-mega-nav` OR
  navbar composition API; spec decides, exception log if it deviates from §9); plain link
  rows (panels OUT of scope — volatile A/B); active sub-nav section marking; sticky/shadow/
  burger inherit.
- Gate + side-by-side vs `invest-stocks/pattern-header-meganav.png`.

### Story 7.2: CookieBanner

As a page author, I want the consent dialog,
So that consent flows match the reference (FR-13).
- Dialog semantics, consent link + accept; Esc does NOT dismiss; consent-choice event emitted
  (bare verb per §3); storage is the consumer's; overlay controller mount (modal layer).
- Gate + side-by-side vs `invest-stocks/pattern-cookie-banner.png`.

### Story 7.3: Stepper + StoreBadges + QrBlock

As a page author, I want the three marketing blocks (numbered stepper cards; app-store badge
row; QR-install tablist block),
So that business/app-landing pages assemble (FR-14).
- Batch of three display components; QrBlock's tablist = the Tabs contract composed; badges
  are plain external links (rel=noopener); stepper display-only with optional CTA slot.
- Gate each + side-by-sides vs the business/invest-mobile captures.

### Story 7.4: Business landing composition (bento + warm-cream)

As the maintainer, I want the business above-the-fold reassembled (header, bento 2+3 on
tint-cream, floating white-pill CTAs, steps, form, footer),
So that FR-14's bento recipes + the warm-cream family are proven on a composed page.
- Bento = consumer layout recipes in the story canvas (asymmetric 2+3 grid, full-bleed,
  floating CTA over art on existing cards + cream tokens); form/steps/footer compose v1+v2
  components; axe both themes; side-by-side vs `business/full-scrolled.png` regions.

### Story 7.5: Invest-mobile landing composition

As the maintainer, I want the app-landing above-the-fold reassembled (hero with yellow CTA +
phone visual, QR block, store badges, install steps),
So that the marketing register (h1 44 / Daytona) is proven on a composed page.
- Register mapping applied (h1 = heading-2 tokens); axe both themes; side-by-side vs
  `invest-mobile/pattern-hero-full.png` + regions.

## Epic 8: v2 verification + release

### Story 8.1: v2 a11y sweep (5.1 method on the 9)

The 5.1–5.3 method (six checks, ledger, engine legs) applied to the nine v2 components;
ledgers extend; SR protocol sections added to their stories (execution stays maintainer-side).

### Story 8.2: v2 dark sweep (5.4 mold)

19+9 components dark-verified; the warm-cream dark first-pass [ASSUMPTION] closed by the
L-rule computation (correct or hold, the 3.6/5.4 molds); dark-audit engine extended to the
v2 suites.

### Story 8.3: v2 docs completion (5.5 mold)

9 component pages (API tables from CEM, theming, a11y incl. SR protocols); registers
documentation surface (the mapping table in the token reference); token reference auto-gains
the v2 tokens.

### Story 8.4: v2 verification ledger + release v1.1.0

16+9 fidelity rows (or pattern-consistency where derived — chips/pagination are
reference-grounded, cookie/stepper/badges/QR/mega-nav reference-grounded, combobox derived
from Select); yellow-discipline audit extension; kit-wide impeccable; **maintainer baseline
batch PREP v2** (extends the 5.6 package); RELEASE.md v1.1.0 flow (tag; the maintainer gate
unchanged).

---

*Sequencing: 6.1 → 6.2 → 6.3 → 7.1 → 6.4 → 6.5 → 7.2 → 7.3 → 7.4 → 7.5 → 8.1–8.4
(6.5 needs 7.1's header; everything else is dependency-loose and batchable per the v1 molds:
specs batch [6.2+6.3], [7.3], [8.1–8.3] candidates).*
