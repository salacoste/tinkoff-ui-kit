# Epic 3 Context: Navigation, content cards, and homepage composition

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Deliver the navigation and content-card components — TextLink, Badge/Chip, Tabs, Navbar (with mobile burger drawer), Footer, PromoCard, FeatureCard (incl. charcoal editorial variant), ServiceCard, ArticleCard — and prove the kit's core promise: the reference homepage above the fold reassembles entirely from kit components plus content, with tint auto-pairing and composability verified across breakpoints, both themes, and the a11y gates. This epic completes the 16 reference-grounded components (each gets a capture side-by-side baseline), leaving only the derived overlay trio for Epic 4.

## Stories

- Story 3.1: TextLink
- Story 3.2: Badge/Chip
- Story 3.3: Tabs — pill active state with automatic activation
- Story 3.4: Navbar — sticky header with burger drawer
- Story 3.5: Footer — grouped directory with pill quick-links
- Story 3.6: PromoCard — tinted card with automatic text pairing
- Story 3.7: FeatureCard — 2-up large with charcoal editorial variant
- Story 3.8: ServiceCard
- Story 3.9: ArticleCard
- Story 3.10: Homepage composability check
- Story 3.11: Composition verification — breakpoints, a11y, discipline

## Requirements & Constraints

- Every component story passes the component gate: impeccable audit with zero blockers; axe checks on its story in BOTH themes; a Storybook story covering default + all variants + interactive states + theming demo + a11y notes including the keyboard-only checklist; controlled/uncontrolled modes where stateful (per `CONVENTIONS.md`); a CEM-generated React wrapper; an approved visual baseline; reduced-motion paths for all motion. A component without stories does not merge.
- Visual fidelity: automated comparison is kit-vs-kit screenshots at a 1.5% diff-pixel tolerance in a pinned capture environment; baseline creation for these reference-grounded components requires a side-by-side against the tbank.ru capture attached to the baseline PR. Baselines recorded during the autonomous run are provisional — automated drift enforcement applies from provisional approval onward; the maintainer confirms or re-takes them as a batched human gate later.
- WCAG 2.1 AA as each component is built: keyboard operability, visible focus, correct roles/names/states, contrast including pastel tints and charcoal in both themes; interactive targets ≥44×44px effective.
- Yellow discipline: yellow only for the primary action and active indicators — never links, icons at rest, or decoration; text on yellow is ink, never white; yellow indicators are always redundant with text weight or shadow, never carrying state alone.
- Tint auto-pairing: dark text on gray/bluegray/mint/beige tints, white on charcoal; tinted surfaces stay flat (no shadows); the tint variant sets the pairing automatically. Dark-mode tints derive by darkening toward L≈16–20% keeping hue; charcoal is theme-invariant.
- Composition discipline: exactly one primary Button per view cluster; cards are not clickable — the CTA or text link carries the action.
- The mint/beige tint hex values are flagged assumptions in the token listing; this epic verifies them against reference captures and resolves the flags in the design token source and the canonical token listing.

## Technical Decisions

- Components are Lit custom elements (shadow DOM), one directory per component under `packages/components/src/<name>/`, named with the `tk-` prefix; React wrappers are generated from the Custom Elements Manifest — no behavior, styling, or a11y logic in the React package; `pnpm gen` must leave a clean diff.
- Styling crosses shadow boundaries only via `--tk-*` custom properties; zero hard-coded color/radius/shadow/font/z-index values in component code; z-order only from the `--tk-z-*` scale.
- API: camelCase reactive props; events `<prop>-change` (value updates, `detail: { value }`) and bare `<verb>` (occurrences); controlled + uncontrolled with identical semantics. The React-surface API is already frozen (decided at Input) — conform; deviations require a logged exception.
- The Navbar drawer must use the shared overlay controller for refcounted scroll-lock and focus trap/restore; it implements neither itself. Positioning and z-order for any floating surface likewise flow through the controller.
- Motion comes only from motion tokens: hover 150ms, press 75ms, tab/content swaps expressive-standard curves; transitions.dev recipes consume `--tk-*` properties (their `:root`-level selectors never match inside shadow stylesheets); every animation has a `prefers-reduced-motion` path.
- Radius registers never mix within one component: pill (`full`) for active tabs, badges, quick-links; xxl 32px for promo/feature cards; xl 24px for service cards. Spacing is the 4-based scale with a 1200px container and 20px grid-gap; 2-up/3-up equal-column grids.
- SSR-compat rule: no imperative DOM access at construction time; render via Lit templates only.

## UX & Interaction Patterns

- Tabs: tablist/tab/tabpanel semantics, arrow-key cycle, Home/End, automatic activation (reference behavior); panel swap animates content only, never the tab bar; active state = white pill + default shadow with ink text (yellow-redundancy rule).
- Navbar: sticky, shadow shrinks in on scroll, yellow active underline paired with 700-weight ink text, search/account utility slots; below 768px collapses to a burger opening a focus-trapped drawer (controller scroll-lock) that restores focus to the burger on dismiss.
- Footer: contentinfo landmark whose link columns are lists; uppercase caps-s group headers (transform applied at render); optional ink pill quick-links and bold phone block; legal fine-print at body-xs with inline links.
- TextLink: inline within text or standalone (standalone = body-m); hover darkens one token step at 150ms; focus shows a visible underline; on tinted surfaces uses the link-on-tint token.
- Badge/Chip: never interactive alone (no focus stop); counts > 99 render "99+".
- Cards: PromoCard art slot lazy-loads with a skeleton state; FeatureCard ships 2-up scale (min-height 320px) with the charcoal editorial variant (white heading, white pill CTA, art bleeding right); ServiceCard's 3D icon is decorative (aria-hidden) with the text link pinned to the card bottom across description lengths; ArticleCard's "Читать" link covers the whole card via a ::after stitch — one tab stop, one click target.
- State patterns: focus-visible = 2px token ring, offset 2px, never removed; hover = one token step at 150ms; skeletons are gray-200 blocks matching the final layout, static under reduced-motion.
- Responsive matrix: ≥1024px full layout (1200px container, 2-up/3-up grids, full Navbar); 768–1023px grids collapse one column step, Navbar full until 768; <768px single column, burger drawer, full-width hero CTA, card padding one spacing step down, mobile heading mapping (site L/M/S).
- Touch parity: every hover affordance has tap and keyboard equivalents.

## Cross-Story Dependencies

- Builds on Epic 1 (token layers, conventions, visual harness, CI gates, Button) and Epic 2 (overlay controller; form components and capture pack feed the composition stories).
- FeatureCard inherits PromoCard's patterns — build 3.6 before 3.7.
- The tint-assumption verification uses the native-zoom mint/beige captures from the Epic 2 capture pack.
- Composition stories (3.10–3.11) require all Epic 2 + Epic 3 components; Epic 5 later re-verifies this group (a11y sweep, fidelity ledger closure, dark-mode sweep).
