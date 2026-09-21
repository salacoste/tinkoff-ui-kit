# Spine Pair Review — tinkoff-ui-kit

Reviewed: `DESIGN.md` + `EXPERIENCE.md` in `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/` (both `status: draft`, pre-Finalize). Sources read: `prds/prd-tinkoff-ui-kit-2026-09-21/prd.md` (UJ-1..3, FR-1..11, OQ-1..7, SM-1..SM-C2), `briefs/brief-tinkoff-ui-kit-2026-09-21/brief.md`. Shape references: `design-example-mobile/shadcn/editorial.md`, `experience-example-mobile/shadcn.md`, `references/design-md-spec.md`.

## Overall verdict

The pair is a strong, near-finalize-ready contract: 19/19 components carry real visual AND behavioral specs, both spines follow canonical shape exactly, source citation (UJ/FR/OQ/SM ids) is accurate and disciplined, and every `{path.to.token}` reference inside DESIGN.md resolves. Two high-severity gaps block clean source-extraction today, and both are the same root cause — extracted data that stayed in `.working/` instead of being promoted into the spine: **motion tokens are referenced by EXPERIENCE.md but defined nowhere in DESIGN.md**, and **shadow tokens are referenced by name in the components frontmatter but carry values for only 1 of 6 shadows**. Fixes are promotions of already-captured data, not new design work. Run is legitimately pre-Finalize (imports/mockups empty, no finalization memlog entry), so linkage gaps are expected-but-must-land.

**Category verdicts:** Flow coverage — strong · Token completeness — adequate · Component coverage — strong · State coverage — adequate · Visual reference coverage — thin · Bloat & overspecification — strong · Inheritance discipline — adequate · Shape fit — strong.

**Findings: 0 critical · 2 high · 4 medium · 8 low.**

## 1. Flow coverage — strong

Checked: PRD §2.3 UJ-1/UJ-2/UJ-3 → EXPERIENCE.md Key Flows; each flow for named protagonist, numbered steps, climax beat, failure path.

All three source UJs have a flow, each tagged with the verbatim UJ id: Flow 1 (Anya, UJ-1) steps 1–4 + climax + failure; Flow 2 (Marat, UJ-2) steps 1–4 + climax + failure; Flow 3 (Lena, UJ-3) steps 1–4 + climax + failure. Climaxes are genuine beats (inherited fidelity; brand surviving the theme flip; semantics from the box), and the failures are non-trivial (font-slot fallback, token-discipline checklist, focus-preserving error). Flows double as FR coverage: FR-1/fidelity (Flow 1 side-by-side), FR-2 (Flow 2), FR-5/FR-6 (Flow 3). PRD §2.1's "OSS consumer" JTBD (upgrade boring and safe) has no flow — acceptable, the PRD itself scaled journeys light ("journeys scaled light per template dial") and delegates SM-6 to release prep.

### Findings
- **low** Flow 1 omits Input: PRD UJ-1 names "Button, Input and PromoCard" as Anya's drops; the flow assembles Navbar, heading-1, paragraph, primary Button, PromoCard grid (EXPERIENCE.md Key Flows, Flow 1 step 2). *Fix:* add a form section (Input + Select) to step 2, or a half-sentence noting the landing includes an application form strip — UJ-1's "drops in" list should be recognizably complete.

## 2. Token completeness — adequate

Checked: every frontmatter token defined with a legal value; every `{path.to.token}` in prose/components (33 distinct refs, grepped exhaustively); contrast targets for load-bearing pairs.

**What holds:** all 62 color tokens have hex (8-digit alpha hex for the dark layer is valid CSS hex); every one of the 33 `{…}` references resolves against the frontmatter (colors, rounded, spacing, typography all clean — including `{spacing.container}`/`{spacing.grid-gap}` named tokens and `{typography.body-m-bold}`); light/dark carried as separate kebab-case tokens per the spec's pattern; platform-semantic values correctly avoided where the source is extraction, not inheritance. The gaps are two token families that are referenced but never defined, plus unstated contrast numbers.

### Findings
- **high** Motion tokens referenced but defined nowhere in DESIGN.md. EXPERIENCE.md §Interaction Primitives states "all transitions use DESIGN.md motion tokens (site curves/durations)"; the Modal row commits "opens with productive-entrance curve, closes productive-exit"; State Patterns cites 150ms/75ms durations. DESIGN.md has no motion key in frontmatter and no motion content in any body section — the names `productive-entrance`, `productive-exit`, and the duration scale resolve to nothing. The full data exists extracted in `.working/tokens-extract-tbank-ru.md` (6 curves incl. expressive/productive standard/entrance/exit, durations 75/150/300/500/700ms) and PRD FR-1/FR-7 make motion part of the Token System. Downstream (architecture, story-dev) cannot source-extract motion. *Fix:* promote curves + durations into DESIGN.md — the spec's frontmatter enum has no `motion` key, so either an invented frontmatter block (documented as extension) or an added body section ("Motion", placed per judgment after Elevation & Depth) holding the six named curves and five durations verbatim from the extract; EXPERIENCE's `[ASSUMPTION]` on transitions.dev mapping then has something to map onto.
- **high** Shadow tokens referenced by name with no values. Components frontmatter uses `shadow: default` (button-secondary, toast), `shadow: modal`, `shadow: tooltip`, `active-shadow: default` (tabs); the Components body additionally uses the `dropdown` shadow (Select row). Elevation & Depth gives a value only for `default` (0 4px 24px rgba(0,0,0,.12)); `default-hover`, `modal`, `tooltip`, `popover`/`dropdown` (3-layer) have no values anywhere in the spine. `.working/tokens-extract-tbank-ru.md` holds three of them verbatim (default-hover `0 12px 36px rgba(0,0,0,.2)`, modal `0 18px 30px rgba(51,51,51,.52)`, tooltip `0 6px 15px rgba(0,0,0,.2)`); the popover/dropdown 3-layer values are missing even there. For a token-first kit this is a broken machine reference on 4+ component entries. *Fix:* inline all captured values in Elevation & Depth; tag the 3-layer popover/dropdown values `[ASSUMPTION]` pending build-time capture.
- **medium** Contrast targets not stated numerically for load-bearing pairs. The pairs are correctly named (yellow-100/ink-300 primary button, auto text-pairing on tints, white-alpha trio on dark steps — DESIGN.md Colors + Do's and Don'ts; EXPERIENCE.md Accessibility Floor asserts "both themes verified AA there"), but no ratio or threshold appears in either spine, and PRD FR-6 gates exactly these pairs in both themes. Yellow-on-light surfaces is the classic failure mode; "yellow-on-dark keeps ink text — contrast holds" is an unverified claim. *Fix:* one line in DESIGN.md Colors (or Do's and Don'ts) committing targets — e.g. "≥ 4.5:1 text pairs, ≥ 3:1 large-text/UI — with yellow-100/ink-300 and dark-step pairings computed at build and recorded in token docs."
- **low** Body/label typography roles carry no `fontFamily`. The brand-font slot strategy (OQ-2) is documented on `heading-1.note` and in Typography prose ("Typography tokens therefore declare the reference's own fallback stack"), but body-l/m/s/xs, the bold variants, and caps-s declare no family at all — the prose claim and the frontmatter disagree for 9 of 13 roles. *Fix:* either add the stack to every role or state once in Typography that all roles share the heading stack via the font slot.
- **low** 5 of 19 components have no `components` frontmatter entry (Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar, ArticleCard) while the other 15 do. Body-table specs exist for all 19, and partial frontmatter coverage is precedented (shadcn example), but there it marked brand-layer deltas over an inherited system — here the kit is standalone and token-first, so the machine layer's asymmetry has no principled boundary. *Fix:* either complete the frontmatter for all 19 or state the convention (frontmatter = entries with kit-level token overrides).
- **low** `textTransform: 'uppercase'` in `typography.caps-s` is outside the spec's allowed typography property subset (`fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`). *Fix:* keep the value (it is load-bearing for the Footer row) but note the intentional extension, or move uppercase to the Typography body rule.
- **low** `tint-charcoal` (#333333) has no dark counterpart (`dark-tint-gray/bluegray/mint/beige` exist). The derivation rule ("darken toward L≈16–20%") is vacuous for charcoal, which is already there — the FeatureCard charcoal editorial variant's dark-mode treatment is unresolved. *Fix:* one sentence in Colors: charcoal in dark mode stays as-is (it already sits at target lightness) or elevates via `dark-surface-*`.

## 3. Component coverage — strong

Checked: PRD FR-4's 19 components → DESIGN.md.Components visual row AND EXPERIENCE.md.Component Patterns behavioral row, with real rules.

Both tables carry exactly 19 rows with identical PascalCase names in the same vocabulary as the PRD (Button, TextLink, Badge, Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar, Tabs, Navbar, Footer, PromoCard, FeatureCard, ServiceCard, ArticleCard, Modal, Tooltip, Toast). Visual rows are real specs (anatomy + token wiring, e.g. Checkbox "20px box, `{rounded.xs}`, ink-300 check on yellow-100 fill"); behavioral rows are real contracts (e.g. Input's label/badge/validation/aria rules, Toast's dismiss/stack/live semantics). Thin rows are legitimate inheritance-by-reference ("FeatureCard — As PromoCard, 2-up scale…") rather than one-word filler. The derived trio (Modal/Tooltip/Toast) is behaviorally richer than the reference requires — appropriate, since PRD FR-5 hangs the overlay contract on them.

### Findings
- **low** Badge name drift: PRD FR-4 row 3 names the component "Badge/Chip"; both spines use "Badge". Consistent across spines, divergent from the source list the PRD calls canonical. *Fix:* either match "Badge/Chip" verbatim or record the rename ("Chip" folded into Badge variants) in the memlog so inheritance review stays mechanical.

## 4. State coverage — adequate

Checked: walk EXPERIENCE.md IA surfaces → states each should have; verify State Patterns coverage.

Component-state coverage is strong: hover, focus-visible, active/press, disabled, loading, error, empty, skeleton, and theme-switch are all present with treatments, keyed to the right components; overlay open/dismiss/stack states live correctly in Component Patterns; ProgressBar indeterminate, Checkbox indeterminate, and reduced-motion fallbacks are all committed. The gap is the other half of the declared IA: the spine names the docs site as "the kit's shipped product surfaces" (Docs index, Component page ×19, Token reference, Theming guide), and no state is specified for any of them — no cold-load/skeleton for docs pages, no search-empty (the Component-page row explicitly lists "Index / search" as entry), no error state for the docs shell.

### Findings
- **medium** Docs-site surfaces have no states (EXPERIENCE.md §State Patterns vs §Information Architecture). A story-dev building the story-docs site (PRD FR-8) has no state contract for it. *Fix:* either add docs-shell rows (cold-load skeleton, search-empty, component-page error) or add one sentence scoping State Patterns to kit components and deferring docs-shell states to architecture — the latter is defensible since the docs site's stack is OQ-5-dependent, but the deferral should be explicit, not silent.

## 5. Visual reference coverage — thin

Checked: every file in `mockups/`, `wireframes/`, `imports/`, `.working/`; reference-site captures; spine links/mentions; spines-win-on-conflict statement.

Inventory: `mockups/` and `wireframes/` do not exist; `imports/` is empty; `.working/` holds one research extract (`tokens-extract-tbank-ru.md`); `.playwright-cli/` (project root) holds the reference captures `tbank-home-full.png` (1.6MB full-page), `page-2026-09-21T19-07-00-623Z.yml` (DOM snapshot), `console-…​.log`. Nothing is linked or named by either spine: DESIGN.md cites "live tbank.ru computed styles and inventory captures" generically; EXPERIENCE.md Flow 1 says "a tbank.ru capture" generically. This is consistent with a pre-Finalize run (promotion and inlining are Finalize steps), but the two artifacts below are load-bearing enough to flag now.

### Findings
- **medium** The fidelity baseline is unlinked: `.playwright-cli/tbank-home-full.png` is named in the PRD (§0 Reference note) as the inventory basis and underwrites FR-10's per-component baselines for 16 reference-grounded components, but neither spine links it at the Components section or Flow 1, where it is the working visual anchor. The DOM snapshot beside it is likewise unmentioned. *Fix:* link both at Finalize — DESIGN.md Components ("fidelity baseline for #1–16") and EXPERIENCE.md Flow 1 step 3.
- **medium** The extraction provenance is unlinked: `.working/tokens-extract-tbank-ru.md` is the recorded source FR-1's traceability consequence requires ("token values trace to recorded extraction notes") and contains the exact shadow and motion data the category-2 highs need. *Fix:* promote it at Finalize (or link it from Colors/Elevation) rather than leaving it as ephemeral workspace — its data must survive into the committed spine or its extraction notes.
- **low** Spines-win-on-conflict is stated in neither file. Harmless today (nothing exists to conflict), but the statement is a Finalize deliverable once mockups or imports appear. *Fix:* add the one-liner when promoting artifacts.

## 6. Bloat & overspecification — strong

Checked: pixel specs duplicating tokens; source restatement; prose-vs-table; dead sections; narrative untied to decisions.

Clean. DESIGN.md prose carries editorial voice (sanctioned) while staying decision-dense; every body section commits rules a consumer can test. EXPERIENCE.md is table-first everywhere a table works; PRD content is cited by id (FR/OQ/SM), never restated — the flows reference requirements rather than re-narrating them. Inline pixel values in EXPERIENCE (ThumbnailPicker "tiles 72px", focus "2px outline offset 2px") are borderline visual leaks into the behavioral spine but each is a single load-bearing number, not a spec dump. Frontmatter-vs-body duplication (button heights, card radii) follows the spec's machine-layer/human-layer pattern, not bloat.

### Findings
- **low** Toast row pre-commits "imperative and declarative APIs" (EXPERIENCE.md Component Patterns). API convention is explicitly FR-3's architecture-time deliverable; the dual-mode intent is fine, the contract is premature. *Fix:* soften to "supports both imperative and declarative usage (API shape per FR-3 at architecture)".

## 7. Inheritance discipline — adequate

Checked: sources frontmatter resolution; UJ/requirement names verbatim; glossary consistency; component-name identity across sections and files; EXPERIENCE→DESIGN token references.

Sources resolve: PRD and brief paths exist for DESIGN.md; PRD + "DESIGN.md (same directory)" exist for EXPERIENCE.md. UJ ids are verbatim (UJ-1/2/3). FR/OQ/SM citations were spot-checked against the PRD and are accurate and correctly scoped: OQ-2 (font), OQ-4 (language), OQ-5 (stack) in EXPERIENCE Foundation/Voice; FR-1 (zero hard-coded), FR-4 Out of Scope (table/data-grid), FR-6 (SR spot-checks per group — matches the PRD consequence), SM-C2 (drift) in Anti-patterns; DESIGN.md's OQ-2 note and "fidelity is a hard constraint" both trace cleanly. PRD §3 glossary terms (reference-grounded, derived, fidelity check, story docs) are used consistently and not restated. Component names are identical across EXPERIENCE.md and DESIGN.md body (PascalCase, 19/19). The motion-reference failure is counted in category 2 and not recounted here.

### Findings
- **low** "2px ink outline" (EXPERIENCE.md State Patterns, Focus visible) — `ink` is a 4-step scale; the step is unstated (ink-300 vs ink-400), and the dark counterpart is described only as "white-alpha" without naming `dark-text-*`. *Fix:* name the tokens: ink-300 outline light / `dark-text-primary`-alpha or `dark-border` dark.

## 8. Shape fit — strong

Checked: DESIGN.md canonical section order and frontmatter completeness; EXPERIENCE.md required defaults, triggered sections, defensible drops; invented sections earning their place.

DESIGN.md: all eight canonical body sections present in exact locked order (Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts); frontmatter carries name, description, colors, typography, rounded, spacing, components — spec-complete. EXPERIENCE.md: all eight required defaults present in order (Foundation, Information Architecture, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows); both triggered sections are present, correctly triggered, and earn their place — Inspiration & Anti-patterns (reference products and rejects are evidenced throughout sources and memlog) and Responsive & Platform (three-breakpoint table from reference behavior), placed in example order between Accessibility Floor and Key Flows. No defaults dropped; no invented sections — which is itself the one structural note: the pair currently has no home for motion tokens (category 2 high), so the fix will need either an invented DESIGN.md section or a frontmatter extension; inventing it is justified by the product-specific concern, not a shape violation. Foundation correctly names the no-framework posture ("standalone design system… stack deliberately undecided until bmad-architecture"), which matches SKILL.md's inheritance rule by negation — nothing to inherit, and the spine says so.

### Findings
(none)

## Mechanical notes

- **EXPERIENCE.md frontmatter uses `title:` where both shape examples use `name:`** (`name: Quill`, `name: Drift`). Cosmetic; align at Finalize for tooling that keys on `name`.
- **Component-name casing splits by layer**: frontmatter `components` keys are kebab-case (`card-promo`, `footer-pill-link`) while DESIGN.md body, EXPERIENCE.md, and the PRD use PascalCase (`PromoCard`). Precedented by the shadcn example, but note `footer-pill-link` maps to a Footer sub-element, not a component — a resolver walking frontmatter keys against the 19-name list will find 16 entries covering 15 components plus one sub-element and no entry for 5 components (see category-2 low).
- **EXPERIENCE.md references DESIGN.md tokens by bare name** (`dark-base`, `yellow-200`, `body-xs`, `caps-s`, `heading-1`) rather than `{path.to.token}` braces. All resolve; bare-name style matches both shape examples, so this is consistent, not a defect — recorded because a strict resolver would miss them.
- **All 33 `{path.to.token}` references in DESIGN.md resolve** (grepped exhaustively; no dangling paths, no orphan frontmatter tokens beyond those noted). 8-digit hex (`#FFFFFF24`, `#FFFFFFB3`, `#FFFFFF80`, `#FFFFFF1A`) is valid CSS hex.
- **Both spines `status: draft`**; `.memlog.md` shows create-run decisions only, no finalization event; `imports/` empty, no `mockups/`/`wireframes/`. The linkage findings in category 5 are Finalize work, not regressions — but the category-2 token gaps should be fixed before status flips to final, since Finalize's own Pass 1 would flag them.
- **`[ASSUMPTION]` tags are used well** (mint/beige hexes, dark tints, spacing scale, RU/EN slots, 44px targets, transitions.dev mapping) — each is a committed-with-provenance decision rather than an evasion; the dark-theme evidence chain (site on-dark tokens, app dark mode, Taiga UI ramp) is cited in DESIGN.md Colors and matches `.memlog.md` decisions.
- No Mermaid diagrams in either spine — nothing to syntax-check.
