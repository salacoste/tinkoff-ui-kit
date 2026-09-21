# Reconcile: PRODUCT.md → prd.md

Input: `PRODUCT.md` (impeccable product context, schema v1). Target: `prd.md` (PRD: tinkoff-ui-kit v1, 2026-09-21). PRD not modified. Material deltas only; verified against both documents' sections.

## Gaps

1. **Phase 2 improvement axis "modernized visuals" dropped — and recast as failure.**
   PRODUCT.md (Product Purpose; Capabilities and Constraints) names three user-confirmed improvement axes: (a) a11y, (b) design tokens + dark mode + theming, (c) *modernized visuals and* motion. The PRD carries (a) as FR-6, (b) as FR-2, and only the motion half of (c) as FR-7; the glossary defines Phase 2 as "(a11y hardening, dark theme, motion)". No FR covers modernized visuals, and the PRD pushes the other way: Non-Goal "never invent new brand identity" plus counter-metric SM-C2 ("Visual novelty — drift from the Reference Site is failure, not freshness"). The PRD silently narrowed Phase 2 from three axes to two-and-motion. Resolve: either drop the axis with explicit user re-confirmation, or scope what "modernized visuals" permits inside the fidelity constraint.

2. **Trademark / unofficial-status commitment downgraded from settled constraint to open question, and narrowed to the package name only.**
   PRODUCT.md states it as settled, twice: "no T-Bank trademark use in published names/branding; no claim or implication of official status" (Capabilities and Constraints) and "Repo name: tinkoff-ui-kit … Unofficial, not affiliated with T-Bank" (Brand Commitments; principle 5 repeats it for "anything published"). The PRD retains only Open Question 2 / FR-11's "OSS-ready name … trademark-safe" — a naming TBD for npm. The "no claim or implication of official status" and "not affiliated" positioning for everything else published (README attribution, branding, repo vs package naming) is absent. A ship-floor brand commitment became a deferred decision.

3. **Phase 1 fidelity quietly softened: "1:1" → tolerance TBD, and reference scope narrowed from the site to the homepage.**
   PRODUCT.md (Product Purpose): Phase 1 is "a faithful 1:1 recreation of the reference's components and tokens." The PRD defines a Fidelity check as a side-by-side comparison (FR-10) with pixel-exact vs. perceptual tolerance explicitly an open question (OQ6), and grounds the 18-component scope in a homepage-only inventory ("v1 is the consumer homepage only", Non-Goals; component table sourced from a homepage capture). Both refinements may be correct, but neither is flagged as a change to PRODUCT.md's Phase-1 definition — "1:1" silently became "within tolerance" and "the reference's components" silently became "homepage-visible components."

4. **"Published as an original re-implementation — no scraped proprietary assets" constraint not carried; font/asset licensing left unaddressed.**
   PRODUCT.md (Capabilities and Constraints) constrains publication to an original re-implementation with no scraped proprietary assets. The PRD honors this only for 3D illustrations (content slots, not kit assets — Assumptions Index) and never restates the rule. FR-1's extraction method ("screenshot or computed style") and the type-scale token work leave the obvious edge — proprietary T-Bank font families, if the reference uses them — unaddressed: shipping or bundling them would violate the PRODUCT.md constraint the PRD no longer states.

5. **Minor dropped operational/positioning details (low severity).**
   (a) Operating Context pins "pnpm; Node >= 20"; the PRD mentions pnpm once (FR-11 example) and Node >= 20 not at all — belongs at architecture, but the constraint is stated in PRODUCT.md and absent from the PRD. (b) Positioning contrasts the kit with generic neighbors ("MUI, Ant, shadcn don't carry this identity"); the PRD Vision drops the competitive contrast (delegated to the brief, so acceptable — noted for completeness).
   Informational, not a gap: the reference URL changed tinkoff.ru → tbank.ru (301, rebrand) — an explicit, documented update in PRD §0, listed here so the PRODUCT.md "tinkoff.ru" reference is known to be superseded.

## Verified consistent (no gap)

Audience (OSS devs; API/docs/examples/semver/changelog as product surfaces → §2.1, FR-3/FR-8/FR-11), stack deferral to bmad-architecture, Phase 1-then-2 sequencing, tokens-before-pixels (FR-1), WCAG 2.1 AA as per-component target with Phase-2 timing (FR-6, SM-2, matches "from the first improved version on"), MIT/free/open positioning, no-fabrication stance (PRD metrics are internal quality bars; no invented usage data or testimonials).
