# Reconcile: brief + addendum → PRD

- **Input:** `briefs/brief-tinkoff-ui-kit-2026-09-21/brief.md` (final) + `addendum.md` (incl. its pointers to PRODUCT.md principles and `.memlog.md` decisions)
- **Target:** `prds/prd-tinkoff-ui-kit-2026-09-21/prd.md` (draft) — not modified by this pass
- **Method:** line-by-line comparison of decisions, constraints, qualitative ideas (tone/positioning), and scope boundaries; explicit check of the five Product Principles, success-criteria mapping, post-v1 domain expansion, and non-goals.

## Gaps

1. **Dark mode demoted from primary success criterion to secondary metric (silent re-tiering).**
   Brief Success Criteria lists five co-equal conditions ("v1 is successful when…"), dark mode being #3. PRD §7 splits them into Primary (SM-1..4) and Secondary, where dark mode is SM-5 — while a brand-new metric (SM-6, install < 15 min, no brief basis) joins the secondary tier. Nothing in the PRD flags this demotion. Confirm intentional or restore dark mode to the primary tier.

2. **"Respect the source" / honest-positioning constraint narrowed from "anything published" to the package name only.**
   Brief (What Makes This Different): unofficial study/recreation, clearly labeled, no trademark use or official-status claims; PRODUCT.md Principle 5 (cited by the addendum as PRD input): "no trademark or official-status claims in anything published"; addendum takeaway: "position explicitly as unofficial; do not imply Taiga UI heritage." The PRD carries only a trademark-safe npm name (FR-11, Open Question 2). No FR requires the repo/README/docs/demo pages to label the project as an unofficial recreation. Suggest extending FR-11 (or a new Distribution FR) to cover all published surfaces.

3. **Reference base silently narrowed from the tinkoff.ru site to the consumer homepage.**
   Brief scope: tokens and ~15–20 components extracted from tinkoff.ru, list fixed "from a structured inventory of the reference site"; `.memlog.md` decision speaks of the reference *base*. The PRD declares "v1 is the consumer homepage only" (§5) and grounds FR-4 exclusively in one homepage capture. The narrowing also silently swaps the brief's "data display" component category for a single Indicator (ProgressBar) and drops earlier candidates (Table, Switch) — Table's drop is justified, but the site→homepage boundary change itself is never flagged as a decision. Confirm homepage-only is the intended v1 reference boundary.

4. **Secondary audience and market ambition dropped from Vision/Target User.**
   Brief Who This Serves: secondary audience = the maintainer's own projects and portfolio ("a showcase of systematic design-engineering craft"); Brief Vision: become "the default starting point for Russian-speaking fintech web projects." PRD §2 has no secondary user, and §1 refocuses the ambition on being "a public reference for building design systems from live products." Qualitative positioning shift, unflagged; it can influence docs polish and RU-market priorities (cf. Open Question 3).

5. **Token-capture methodology (inspo cross-reference) dropped despite being named a core differentiator.**
   Brief Solution: tokens "captured with browser automation (playwright-cli) and cross-referenced against real-site design data (inspo MCP)"; addendum: this methodology "is the project's core differentiating capability." FR-1's traceability consequence requires only "a Reference Site capture (screenshot or computed style)" — the inspo cross-referencing step is absent. May be a deliberate altitude choice (tool names → architecture), but confirm, since the brief treats the methodology itself as differentiating.

6. **Component-count inconsistency adjacent to the success mapping (PRD-internal, flagged in passing).**
   FR-4 lists 18 components and FR-5 adds Toast — 19 shipped components — while the Glossary and SM-1..SM-5 all say "18"/"18 of 18". If Toast counts as a Kit Component, the success metrics undercount by one.

## Checked and carried correctly (no gap)

- **Five Product Principles** (brief's five "What Makes This Different" bullets / PRODUCT.md): copy-first-improve-second ✓ (§5, SM-C2, FR-10); real mass-market reference ✓ (§1); a11y floor ✓ (FR-6/SM-2, Phase-1 semantics / Phase-2 verification is consistent with "from the first improved version on"); tokens-before-pixels ✓ (FR-1); library ergonomics = quality ✓ (FR-3, FR-8, FR-11). Only Principle 5 is partial → gap 2.
- **Success criteria mapping:** audit ✓ (SM-1), WCAG AA ✓ (SM-2), docs ✓ (SM-4), fidelity ✓ (SM-3); "external metrics explicitly secondary" preserved ✓. Only dark mode re-tiered → gap 1.
- **Post-v1 domain expansion:** present and correct in §5 and §6.2 (maintainer-designated domains after v1). Minor residual: the brief's "each added with the same capture-and-improve pipeline" continuity requirement is dropped, but that is post-v1 vision, acceptable for a v1 PRD.
- **Non-goals:** all six brief Out-items carried verbatim in §5 (redesign, native mobile, data-viz, business widgets, other domains, deferred stack). PRD additions (Table/chat/carousels deferrals, Figma exports, localization) are reasonable refinements, not contradictions.
- **Other spot-checks:** tinkoff.ru → tbank.ru update is explicitly documented in the PRD reference note (not silent); MIT + npm + semver ✓ (FR-11); ~15–20 → 18 components is within brief range; "public from day one" (repo already open) omitted from the PRD — trivial.
