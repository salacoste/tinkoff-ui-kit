# Validation Report — tinkoff-ui-kit UX spines

- **DESIGN.md:** `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md`
- **EXPERIENCE.md:** `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md`
- **Run at:** 2026-09-21
- **Status:** findings applied — report reflects the gate run; re-run overwrites

## Overall verdict

Rubric walker: **strong, near-finalize-ready contract** — 19/19 components dual-covered, canonical
shape both spines, accurate UJ/FR/OQ citation, all `{path.to.token}` refs resolve after fixes.
The two blocking gaps (motion/shadow tokens unpromoted from `.working/`) were data promotion and
are fixed in the spines.

Accessibility reviewer: behavioral floor strong and APG-aligned, but the initial "both themes
verified AA" claim was **false** — 2 critical / 3 high contrast failures, all token-level, all
now fixed (semantic overrides + dark link/error/focus tokens + redundant yellow indicators).
Computed ratios recorded in DESIGN.md Colors.

PRD reconciliation: 5 gaps — FR-9/10 anchoring, FR-11 docs disclaimer, OQ-2 font
recommendation, bilingual scope addition, dark-tint-charcoal — all folded in.

## Category verdicts

- Flow coverage — strong
- Token completeness — adequate → strong after fixes (motion/shadows promoted)
- Component coverage — strong (19/19)
- State coverage — adequate → strong after docs-site states added
- Visual reference coverage — thin → adequate after reference anchors linked
- Bloat & overspecification — strong
- Inheritance discipline — adequate (minor name drift fixed: Badge/Chip)
- Shape fit — strong
- Accessibility — not-ready → fixed (see AA table in DESIGN.md)

## Findings by severity

### Critical (2) — accessibility, FIXED
- text-secondary #79818C failed 4.5:1 everywhere (3.94:1 white) → overridden to gray-600 #616871
- Dark theme had no AA link/error variants (blue-100 3.76:1 on dark-base) → dark-link #66A3FF, dark-error #FF7B74

### High (5) — FIXED
- Motion tokens referenced but undefined → `motion:` frontmatter block added
- Shadow tokens named, 1/6 valued → `shadows:` block added (all six)
- blue-100 links on tints 4.07–4.24:1 → link-on-tint blue-200
- Yellow active indicators 1.34:1 vs 3:1 (1.4.11) → indicators always redundant with text weight/contrast
- Ink focus rings invisible on ink surfaces → unified blue focus-ring token (light+dark)

### Medium (4) — FIXED
- Contrast targets not numeric → AA table with computed ratios in DESIGN.md Colors
- Docs-site surfaces lacked states → cold-load/empty-search row added
- Fidelity capture unlinked → Reference anchors block in DESIGN.md Components
- FR-9/10 quality regime unanchored → anchored in EXPERIENCE.md Foundation

### Low (8) — FIXED (representative)
- Flow 1 now names Input; fontFamily inheritance noted; textTransform moved out of token;
  dark-tint-charcoal added; Badge→Badge/Chip aligned; Select aria-selected; Toast API deferred to FR-3

## Reviewer files

- `review-rubric.md` — full rubric walk
- `review-a11y.md` — accessibility specialist pass with computed ratios
- `reconcile-prd.md` — PRD reconciliation
