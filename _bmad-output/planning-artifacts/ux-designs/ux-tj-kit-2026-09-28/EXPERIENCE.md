# tj-kit — Experience Spine

Status: **draft for the v5 planning chain** (UX phase). Source: the 2026-09-28 recon
(`.playwright-cli/captures-v3/tj/`) + PRD §4.9 (FR-17..22). Visual values live in DESIGN.md;
this file owns BEHAVIOR. The bank kit's EXPERIENCE.md remains the umbrella reference —
everything not overridden here inherits its floor (a11y, reduced-motion, keyboard-first).

## Foundation

Separate exportable web-component sub-kit (Lit core + CEM + generated React adapters — same
substrate, own packages, FR-17). Desktop-first editorial reference (1280 target), mobile-web
supported. Tokens: the ТЖ DESIGN.md frontmatter is the system of record, namespaced apart from
`--tk-*` (prefix at architecture, OQ-9). Zero runtime dependency on the main kit.

## Information Architecture

The ТЖ docs presence (own section in the Storybook docs package — placement ruling at
architecture):

- Getting started (install ТЖ alone; the optional main-kit ad-module integration as a recipe)
- Foundations: tokens (light + native dark), typography (two-family contract)
- Components: reading surface, rubric/news, community, /pro/ nav, chrome (header, rail, CTA)
- Patterns: article page, rubric page, community page, ad-module composition

## Voice and Tone

Editorial, not bank. The kit's built-in copy (labels, announcements) follows the reference's
register:

| Do | Don't |
|---|---|
| «Написать» / «Читать» — short verbs | Marketing CTAs («Только сегодня!») |
| «Время чтения: 7 минут» — service meta | Emoji in meta lines |
| Lowercase overlines («учебник») | ALL-CAPS shouting |
| Names as given («Сергей Кощеев») | Truncated/honorific'd names |

## Component Patterns

Behavioral contracts for the roster (FR-19). Observed-baseline → improvement where the
reference is weak, per the project's copy-and-improve principle.

**Reading surface (article).** The composition: H1 (45/700) → byline row (avatar, author,
time-meta, read-time) → lead (serif 27) → body (serif 21, w760) with in-body H2 (38/700) and
pull-quotes (grotesque 35) → engagement bar. Contracts: reading column is a `max-width`
container, never a hard grid column; RU hyphenation ON (reference behavior, `lang=ru`
consumers); in-body links are 15px groteske (reference quirk — kept). Engagement bar:
like = toggle button with pressed state, emit-only (no counts stored); comment/share/bookmark
= buttons announcing identity; the bar is sticky-capable but never traps focus. Baseline
observed: reference engagement sits below the fold; improvement: the bar re-appears on
scroll-back as a compact rail (motion: 150ms, reduced-motion instant) — opt-in slot, off by
default.

**Rubric header.** Cover image + 100×100 squircle mark overlapping the boundary + h1 +
subtitle. Contracts: the squircle is decorative (aria-hidden) — the rubric name is the h1
text; cover art is a slotted image with explicit consumer alt (empty alt acceptable —
decorative default).

**News card.** Byline (squircle mark + avatar + author) + title (24/700) + optional excerpt
+ engagement counts. Contracts: the WHOLE card is a single link carrier (title + byline ride
one anchor — the bank kit's row-as-link precedent); counts are text, not live regions;
timestamp uses ink-reference-time (restricted AA — supplementary by design).

**Tag-chip nav (/pro/).** Translucent chips with chevrons on the purple hero. Contracts:
chips are LINKS in natural tab order (not a tablist — they navigate, they don't switch
panels); chevron is decorative; hover/focus lift on 150ms; the chip row wraps, never scrolls
horizontally on desktop.

**Community composer.** The fake-input card («Написать пост или вопрос…»). Contracts: the
card is a BUTTON (name = the placeholder text) that emits `open-compose` — the kit never
renders the editor (editorial application logic is Out); avatar slot for the consumer's user.

**Post card.** Author + date + title (2-line clamp) + comment count. Contracts: single link
carrier (news-card mold); clamp via `-webkit-line-clamp` + title attr carrying the full text.

**Header bar.** Logo wordmark (Т—Ж + «МЕДИА Т-БАНКА» sticker — decorative, the text is in the
logo slot for SR as one name), nav chips (Для вас / Учебник / Сообщество), icon actions
(Поиск, Уведомления, тема, Авторизоваться), «Написать» CTA. Contracts: sticky, h72→h56 on
scroll (motion 150ms); the theme control is a MENU BUTTON (see State Patterns); «Написать» =
link semantics (`href` consumer-owned) styled as the #333 CTA.

**Sidebar rail.** w290 rubric list, 40px icon tiles + labels. Contracts: it is the bank
kit's nav-list semantics translated: `nav` landmark + `ul/li` links, current rubric
`aria-current="page"`; icon tiles decorative; the rail collapses to a burger drawer under the
responsive breakpoint (the navbar-drawer overlay mold).

**CTA «Написать».** The quiet-geometry marker: #333 fill, r5, h30, 15px label. Contracts:
dark inverts to the #F5F5F9 pill; 44×44 clickable floor maintained via invisible padding
(the bank kit's compact-button correction precedent — the reference's 30px target fails the
floor); link semantics when it navigates.

**Ad-module composition (the FR-17/21 boundary).** Native-ad slots in a ТЖ composition are
SLOTS — the ТЖ kit renders the placeholder and the grid geometry; the ad content itself is
the main kit's promo-card family composed by the consumer (documented recipe). The ТЖ kit
ships zero yellow/navy values.

## State Patterns

**Theme.** The reference is prefers-color-scheme-native ONLY. The kit's improvement layer:
`auto` (default — follows the media query, live-updating) | `light` | `dark`, driven by a
`data-` attribute on the root scope (name at architecture). The header's theme control cycles
auto→light→dark and announces the resulting mode politely. No flash: tokens resolve before
first paint on the override path (the attribute is a render-blocking selector, not a JS
post-patch — the docs already prove the pattern with `[data-theme=dark]`).

**Engagement states.** Like: unpressed/pressed with count; counts never animate on change
(reduced-motion floor applies regardless). Bookmark: pressed-state button, no count.

**Loading/skeleton.** Card skeletons exist for feed surfaces (news, community): text-line
blocks in meta ink at 12% alpha — never the bank kit's gray-200 (wrong family); skeleton
shapes mirror the card anatomy.

## Interaction Primitives

Keyboard: everything reachable in natural tab order; no roving tabindex anywhere in the ТЖ
roster (no tablist-pattern components — the tag chips are links). Focus ring: 2px offset 2px
in an ink-based ring (gold ring candidate — AA against both surfaces must be proven at the
token story; blue fallback per the bank kit's unified-ring precedent if gold fails as a
non-text 3:1 UI component). Hover transitions 150ms; press feedback on the CTA at 75ms.
Overlay usage: the rail's burger drawer reuses the overlay-controller contract (the bank
kit's AD-12 machinery — reimplemented in the ТЖ package or imported at architecture's
discretion; BEHAVIOR is identical either way: focus trap, Esc, scroll lock).

## Accessibility Floor

The umbrella floor inherits verbatim: WCAG 2.1 AA both themes (native dark included — FR-22),
impeccable zero blockers, axe in both themes, complete keyboard checklists per story,
reduced-motion honored, SR protocol sections per story (computed name/role/state mechanized;
live VoiceOver by the maintainer's run-sheet). ТЖ-specific rulings recorded in DESIGN.md
(restricted meta inks, gold-ink override, dark-link asymmetry).

## Responsive & Platform

Desktop-first (1280); the reference's own breakpoints govern: rail collapses to burger;
reading column narrows fluidly (w764 → 100% − padding); card grids drop 3→2→1. Mobile CTA
targets respect the 44px floor. No native-mobile patterns (umbrella non-goal).

## Key Flows

### Flow A — consumer ships an editorial section

Install `pillkit-tj-*` alone (no main-kit packages in the lockfile — FR-17 acceptance),
compose header + rail + rubric header + news cards from stories, flip to dark via the media
query with zero JS. Acceptance: the lockfile test.

### Flow B — reader goes dark natively

OS switches → tokens re-resolve live (no reload — the reference's own behavior, kept), CTA
inverts to the near-white pill, gold links keep `#C79637` (5.86:1 — the asymmetry is the
point).

### Flow C — consumer mixes an ad into an editorial feed

The recipe: main-kit promo-card inside the ТЖ ad slot; visual language stays bank-yellow by
design (the reference's own editorial-vs-ad split, made contractual); zero ТЖ tokens leak
into the ad and vice versa.

### Flow D — keyboard reader walks a rubric

Tab lands on rail links (aria-current on the open rubric), header actions, first card as a
single stop, engagement buttons individually; no focus traps outside the burger drawer; every
stop has a visible ink/gold ring in both themes.
