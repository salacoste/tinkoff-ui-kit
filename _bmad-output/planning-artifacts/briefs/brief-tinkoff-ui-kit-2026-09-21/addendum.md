# Addendum: tinkoff-ui-kit brief

Depth that belongs to downstream documents (PRD, architecture) rather than the brief itself.

## Landscape research (2026-09-21, web-researched)

**Takeaway for PRD:** the niche is verified empty — a React, Vue, or framework-agnostic recreation
of the consumer tinkoff.ru language is novel. Reference-capture methodology (playwright-cli +
inspo) is the project's core differentiating capability. Position explicitly as unofficial; do
not imply Taiga UI heritage.

### Tinkoff / T-Bank official OSS
- **Taiga UI** — the official flagship kit: 130+ components, ~4k stars, Apache-2.0, active
  (taiga-ui.dev, github.com/taiga-family/taiga-ui). Caveats: Angular-only (no React/Vue), and its
  aesthetic targets internal/business tooling, not the tinkoff.ru consumer brand. The org
  (`taiga-family`) now brands itself independently of T-Bank.
- **Consumer design system**: closed. `design.tbank.ru` 301 → `brand.tbank.ru` (brand portal, no
  tokens/components). Internal "Tinkoff Design System" documented only in the 2017 Habr series,
  never open-sourced.
- **Mobile**: no public native kit. `tinkoff-mobile-tech` hosts payment/acquiring SDKs (with
  embedded payment-sheet UI), TinkoffID, `decoro` masking — mostly archived. Native OSS moved
  behind SSO at opensource.tbank.ru (login-walled).
- **Legacy org & npm** — old github.com/Tinkoff org largely archived; npm `@tinkoff/*` = Tramvai
  infra + `@tinkoff/tui-editor`; no visual web kit.

### Community recreations
- None in code (GitHub search returns only this project). Figma Community has fan artifacts:
  "T-Bank mobile screens", "Tinkoff Form Design System" (explicitly "not an exact copy").
- Landscape context for the empty-niche claim: github.com/unchase/awesome-russian-design-systems

### Comparables for positioning
Narmi Design System (banking React kit, closest aesthetic sibling),
IBM Carbon, Ant Design, MUI, shadcn/ui (mainstream baselines).

## Source-material inventory for PRD input
- PRODUCT.md (impeccable init) — audience, phases, principles
- CLAUDE.md — toolchain contracts (impeccable gates, transitions, inspo budget, playwright-cli only)
- `brief.md` + `.memlog.md` (same directory as this addendum) — decisions with rationale
