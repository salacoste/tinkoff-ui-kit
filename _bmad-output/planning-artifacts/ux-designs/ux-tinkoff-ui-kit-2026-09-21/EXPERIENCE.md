---
title: "EXPERIENCE.md: tinkoff-ui-kit"
status: final
created: 2026-09-21
updated: 2026-09-21
sources:
  - ../../prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
  - DESIGN.md (same directory) — visual identity reference
---

# tinkoff-ui-kit — Experience Spine

## Foundation

Responsive web component library (desktop-first reference, mobile-web supported — the reference
is a responsive marketing site). Standalone design system: no inherited UI framework; the kit's
own tokens (`DESIGN.md` frontmatter) are the system of record. Stack deliberately undecided
until bmad-architecture (OQ-5); every behavioral rule below is stack-agnostic. Quality regime
per PRD: the impeccable design audit gates every UI change (FR-9); fidelity/pattern-consistency
checks gate visual drift (FR-10) — both anchor the story-docs CI at build time.

## Information Architecture

The kit's shipped product surfaces (story docs site):

| Surface | Reached from | Purpose |
|---|---|---|
| Docs index | / | Getting started: install, theming (light/dark), font slot, token table |
| Component page ×19 | Index / search | Live default, all variants, interactive states, theming demo, a11y notes, API table |
| Token reference | Index | Canonical token listing with light/dark values side by side |
| Theming guide | Getting started | Theme layer: switching, per-token overrides, dark-mode pairing rules |

Every docs surface carries the unofficial-project disclaimer (PRD FR-11): study/recreation
project, not affiliated with or endorsed by T-Bank. Consumer apps assemble their own IA from
Kit Components; the kit ships no app-level routes.

## Voice and Tone

Microcopy inside components (labels, states, announcements). Product voice lives in
DESIGN.md.Brand & Style. Language: single language for v1 (OQ-4); shipped copy is
localization-ready (string slots, no baked-in concatenation) so consumers translate without
forking.

| Do | Don't |
|---|---|
| "Обязательное поле" / "Required field" | "Ошибка! Введите данные!!! 🚀" |
| "Продолжить" / "Continue" — verbs, no exclamation | "Давайте начнём!!" |
| Numbers with spaces: "1 331 ₽" | "1331.00руб." |
| Calm, bank-grade, second person | Marketing hype inside component copy |

## Component Patterns

Behavioral contracts. Visual specs live in DESIGN.md.Components.

| Component | Behavioral rules |
|---|---|
| Button | Single primary per view cluster; loading state keeps width (no layout shift); icon slot optional left; disabled = no pointer events, announced as disabled. |
| TextLink | Inline within text or standalone; standalone gets body-m; keyboard focus visible underline. |
| Badge/Chip | Static or dynamic count; count > 99 renders "99+"; never interactive alone. |
| Input | Label + placeholder both supported (placeholder never replaces label); required marked with asterisk + aria-required; inline badge slot (e.g. "+30%") announced after label; validation on blur, message tied via aria-describedby; error does not steal focus. |
| Select | Native-equivalent keyboard: arrows navigate, Enter selects, Esc closes, typeahead jumps; selected option conveys `aria-selected`; menu closes on outside click and focus loss. |
| Checkbox | Toggle on Space; label clickable; indeterminate prop for parent states; consent pattern ships as composed example, not separate component. |
| SegmentedRadio | Arrow keys move within group, selection follows focus (radio semantics); one selected, ever. |
| ThumbnailPicker | Radio-group semantics over visual tiles; selected state (ring) announced; tiles 72px, wrap to grid; arrow-key navigation row-major. |
| ProgressBar | Determinate by default; value, min, max exposed; label and % optional slots; indeterminate variant uses reduced-motion-safe pulse. |
| Tabs | Full tab semantics: tablist/tab/tabpanel, arrow keys cycle, Home/End, automatic activation (reference behavior); panel swap animates content only, not the tab bar. |
| Navbar | Sticky; shrinks shadow in on scroll; active section indicated by yellow underline; utilities (search, account) slots; collapses to burger under 768px with focus-trapped drawer. |
| Footer | Landmark with nav; link columns are lists; pill quick-links and phone block optional slots; legal fine-print renders body-xs with inline links. |
| PromoCard | Whole card not clickable — CTA button carries the action (reference pattern); art slot lazy-loads; tint variant sets text pairing automatically. |
| FeatureCard | As PromoCard, 2-up scale; editorial variant supports background art bleed right. |
| ServiceCard | Text link is the action; icon decorative (aria-hidden). |
| ArticleCard | "Читать" link covers whole card via ::after stitch (single tab stop). |
| Modal | Focus trap + restore on close; Esc and overlay-click dismiss (destructive actions require explicit button); body scroll locked; opens with productive-entrance curve, closes productive-exit; one level deep. |
| Tooltip | Hover + focus show (delay 300ms), Esc/hide-on-blur dismiss; never contains focusable content; positioning flips near viewport edges; icon trigger gets accessible name. |
| Toast | Auto-dismiss 5s default (configurable), pause on hover/focus; aria-live="polite"; destructive variant role="alert"; stack bottom-right, max 3 visible (oldest collapses); supports imperative and declarative usage patterns (final API shape set at architecture per FR-3). |

## State Patterns

| State | Component(s) | Treatment |
|---|---|---|
| Hover | Buttons, links, cards' CTAs | Token step (yellow-200 / blue-200); 150ms |
| Focus visible | All interactive | 2px `{colors.focus-ring}` (light) / `{colors.dark-focus-ring}` (dark), offset 2px; never removed |
| Active/press | Buttons | Next token step (yellow-300) + 75ms scale-free press |
| Disabled | Buttons, inputs, select | 40% opacity, no pointer events, aria-disabled |
| Loading | Button | In-place spinner, width frozen, label kept for SR |
| Error | Input, Select | red-100 message + icon, aria-invalid, described-by |
| Empty | ProgressBar, ThumbnailPicker | Zero-state copy slot; never blank |
| Skeleton | ArticleCard, PromoCard content | Gray-200 blocks matching final layout, reduced-motion static |
| Theme switch | All | Token layer swap only; no markup change; 0ms by default, optional 150ms cross-fade |
| Docs-site cold-load / empty search | Docs index, component pages | Skeleton matching layout; search empty state: "No matches. Try a component name." — minimal, kit states take priority |

## Interaction Primitives

- **Pointer:** click to act; hover is enhancement, never the only path (touch parity).
- **Keyboard:** every interactive component operable — Tab/Shift-Tab, arrows (Select, Tabs,
  SegmentedRadio, ThumbnailPicker), Space (Button, Checkbox), Esc (Modal, Tooltip, Select,
  Toast action), Home/End (Tabs). Tab order = reading order.
- **Focus management:** Modal traps and restores; Navbar drawer traps; Toast never takes focus;
  Select returns focus to trigger on close. Focus ring is a **unified token**: 2px
  `{colors.focus-ring}` (light) / `{colors.dark-focus-ring}` (dark), offset 2px — never ink
  (invisible on ink surfaces in the reference).
- **Motion:** all transitions use DESIGN.md `motion` tokens (site curves/durations); everything
  respects `prefers-reduced-motion: reduce` → durations to 0ms, opacity-only fallbacks.
  `[ASSUMPTION]` transitions.dev recipes map onto the site's expressive/productive curves at
  build time; mapping table lands in the architecture doc.

## Accessibility Floor

Behavioral (visual contrast lives in DESIGN.md — its Colors section carries computed ratios and
the AA-override table: reference pairs that fail 4.5:1/3:1 are overridden semantically while
scales stay extracted).

- WCAG 2.1 AA for all 19 components; keyboard-complete per Interaction Primitives.
- Roles/names/states correct by construction (radio groups, tablist, dialog, alert); announcements
  via aria-live only for Toast/ProgressBar optional narration.
- Target sizes: interactive ≥ 44×44px effective (pill heights comply; compact 32px Button ships
  with `min-height` corrective padding). `[ASSUMPTION]` — reference ships 32px compact buttons;
  kit pads to 44px as an improvement, fidelity check covers visuals not hit-targets.
- Screen-reader spot-checks per component group recorded in story docs (PRD FR-6).
- Both themes pass contrast: yellow/ink pairs, white-alpha text on dark steps, tinted-card pairings.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| ≥ 1024px | Full reference layout: container 1200px, 2-up/3-up grids, full Navbar |
| 768–1023px | Grids collapse one column step; Navbar full until 768 |
| < 768px | Single column; Navbar → burger drawer; hero CTA full-width; card paddings drop one spacing step; headings use site mobile mapping (L/M/S) |

Mobile web only — no native platform claims. Touch: hover-dependent affordances gain tap
equivalents (hover-revealed card actions, tooltips → visible info-icon trigger).

## Inspiration & Anti-patterns

- **Lifted from the Reference Site:** pill CTA discipline, pastel card language with automatic
  text pairing, semantic shadow layers, two-register radius system, form progress feedback.
- **Lifted from the T-Bank app (dark):** tonal elevation without shadows; white-alpha text trio.
- **Rejected — redesign drift:** any "improvement" that changes static identity beyond a11y/dark/
  motion axes (PRD SM-C2).
- **Rejected — decorative motion:** confetti, bounce physics, parallax — the reference's motion
  is productive and brief.
- **Rejected — table/data-grid in v1:** not in the reference; deferred (PRD FR-4 Out of Scope).
- **Rejected — hover-only affordances:** every hover behavior has a pointer/touch and keyboard
  equivalent.

## Key Flows

### Flow 1 — Anya ships a fintech landing in one evening (UJ-1)

1. Anya runs the README install, drops the theme layer in, and points the brand-font slot at a
   system stack for now.
2. She assembles the hero: Navbar, heading-1, paragraph, primary Button, PromoCard grid — and
   drops an Input pair (phone + email) into the signup strip.
3. Side-by-side with a tbank.ru capture, she nudges content — not components — to match.
4. **Climax:** her page renders indistinguishable from the reference; the fidelity is inherited,
   not hand-built. She ships the same evening.

Failure: brand font missing → fallback stack renders metrically close; a console hint names the
font slot. Nothing breaks.

### Flow 2 — Marat flips the portal to dark (UJ-2)

1. Marat's portal uses Kit Components throughout, tokens untouched.
2. He sets the theme layer to dark — one attribute/prop, zero component code.
3. Every surface restyles: canvas `dark-base`, cards tonal steps, yellow CTAs keep ink text.
4. **Climax:** the whole portal is dark and still visibly T-Bank — brand survived the theme
   flip because identity lives in shape and yellow, not in light-only colors.

Failure: a custom consumer component hard-codes a light color → kit docs' "token discipline"
checklist catches it in review (zero hard-coded values rule, FR-1).

### Flow 3 — Lena completes a form by keyboard and screen reader (UJ-3)

1. Lena Tabs into the form: Input announces label + required; the inline "+30%" badge reads
   after the label, not over it.
2. Select opens on Enter, arrows move, Enter picks; SegmentedRadio arrows between Да/Нет with
   focus-follows-selection.
3. She submits with the primary Button; a validation error appears in an Input described-by
   message — focus is not stolen; she hears it on next visit to the field.
4. **Climax:** the whole form passes under keyboard + SR without Anya (the developer) having
   written a single aria attribute — semantics came from the box.

Failure: Toast on submit → announced politely, never steals focus; remains 5s, pausable.
