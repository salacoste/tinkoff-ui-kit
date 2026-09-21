---
title: "Accessibility review — tinkoff-ui-kit UX artifacts"
reviewed:
  - DESIGN.md (same directory)
  - EXPERIENCE.md (same directory)
date: 2026-09-21
standard: WCAG 2.1 AA (PRD FR-6 hard requirement), WAI-ARIA APG patterns
method: contrast ratios computed from frontmatter hex values (WCAG relative luminance; alpha tokens composited in sRGB, matching browser blending)
verdict: NOT READY — the behavioral floor is strong, but 2 critical token failures and 3 high-severity indicator/contrast gaps block the "AA verified" claim in EXPERIENCE.md
counts: { critical: 2, high: 3, medium: 9, low: 6, total: 20 }
---

# Accessibility Review — DESIGN.md + EXPERIENCE.md

## Verdict

**Not ready for AA sign-off.** Keyboard/ARIA/focus-management/motion coverage is genuinely good
(close to APG across all 19 components), and the core brand pairs pass with large margin.
But the secondary-text token fails AA on every surface it is used on, the dark theme ships no
functional (link/error) variants and fails for them, and two "sole indicator" patterns
(yellow-on-white active state, ink focus ring on ink surfaces) fail non-text contrast.
EXPERIENCE.md's claim *"both themes verified AA there"* is currently false and must be removed
or conditioned on the fixes below.

---

## Critical

### C1. `text-secondary` gray-500 `#79818C` fails 4.5:1 on every surface — WCAG 1.4.3
Computed ratios (4.5:1 required for normal text):

| Pair | Ratio | |
|---|---|---|
| #79818C on white (surface-base) | **3.94:1** | FAIL |
| #79818C on #F5F5F6 (surface-muted, tint-gray) | **3.61:1** | FAIL |
| #79818C on #ECF1F7 (surface-field — **placeholder spec uses gray-500**) | **3.47:1** | FAIL |
| #79818C on #F5EFE6 (tint-beige) | **3.45:1** | FAIL |
| #79818C on #E2F1EC (tint-mint) | **3.38:1** | FAIL |

Affected: card descriptions (ServiceCard, PromoCard, ArticleCard), secondary/footer text,
and the Input `placeholder: gray-500` token — a systematic failure, not an edge case.
Note: placeholder text is **not** exempt from 1.4.3; and 12–15px body sizes never qualify as
"large text", so the 3:1 allowance never applies here.
**Fix:** re-point `text-secondary` (and input placeholder) to gray-600 `#616871` — verified
5.63:1 on white, 5.17:1 on #F5F5F6, 4.96:1 on #ECF1F7, 4.93:1 on beige, 4.84:1 on mint (all
pass). Reserve gray-500/gray-400 for disabled/decorative only.

### C2. Dark theme ships no functional-color variants — links and errors fail AA — WCAG 1.4.3
The dark palette defines base/surfaces/text/borders but **no dark variants of blue (links) or
red (error)**; EXPERIENCE.md Flow 2 assumes components restyle automatically, which would
render light-theme blue-100/red-100 on near-black:

| Pair | Ratio | |
|---|---|---|
| blue-100 `#1771E6` on dark-base `#1A1A1A` | **3.76:1** | FAIL |
| blue-100 on dark-elevated `#373737` (modal/toast dark surfaces) | **2.57:1** | FAIL |
| red-100 `#E01F19` on dark-base | **3.63:1** | FAIL |
| green-100 `#39B54A` on dark-elevated (dark success text) | **4.47:1** | FAIL (borderline) |

**Fix:** add a dark functional layer: link `#66A3FF` (verified 6.84/6.25/5.71/5.26/4.68:1
across #1A1A1A→#373737), error `#FF7B74` (6.91→4.73:1), success green-100 OK on base through
#2F2F2F but restrict on #373737 or lighten. Update DESIGN.md "Dark theme (authored)" section
and the EXPERIENCE.md a11y claim.

---

## High

### H1. blue-100 links fail on tints/secondary surfaces — WCAG 1.4.3
blue-100 `#1771E6` on white = **4.62:1 PASS**, but on surface-muted/tint-gray `#F5F5F6` =
**4.24:1 FAIL** and on surface-field/tint-bluegray `#ECF1F7` = **4.07:1 FAIL**. Any TextLink
inside a muted panel or field-adjacent surface fails. The Don'ts already ban colored text on
tinted *cards*, but surface-muted panels are not covered by that rule.
**Fix:** surface-aware link token: blue-200 `#1464CC` on tints (5.17:1 on #F5F5F6, 4.96:1 on
#ECF1F7 — both pass), keep blue-100 on white; or promote the Don't to a linted rule covering
all non-white surfaces.

### H2. Yellow-on-white as sole active/selected indicator — WCAG 1.4.11 (and 1.4.1)
yellow-100 `#FFDD2D` on white = **1.34:1** vs the **3:1** required for state indicators.
Affected: Navbar yellow active underline (white navbar), and Tabs' white-pill-on-white-track
(distinguished only by shadow, which carries no guaranteed contrast). If that indicator is the
only way to tell active from inactive, it fails; color-only differentiation also risks 1.4.1.
**Fix:** never let yellow underline be the sole cue — pair with a text treatment (weight
and/or ink color change on the active item) and `aria-current="page"` for nav; for Tabs give
the active pill a real border or rely on text styling. Document the pairing in DESIGN.md
Components (Navbar, Tabs).

### H3. Focus ring token breaks on ink/charcoal surfaces; Input focus spec contradicts it — WCAG 2.4.7
State Patterns mandate a 2px **ink** outline (light theme). On the inverse Button (ink-300 bg),
footer pill links, ink Badge, tooltip triggers, and the charcoal FeatureCard, ink-on-ink =
**1.00:1** — invisible. Separately, DESIGN.md's Input spec says focus shows
`border-default` `#E7E8EA` = **1.23:1** on white — a near-invisible focus state that
contradicts EXPERIENCE.md's outline rule.
**Fix:** make the focus ring surface-aware: white ring on ink/charcoal surfaces (12.63:1),
ink ring elsewhere; delete the border-default focus treatment from the Input spec and defer to
the single outline rule. In dark theme, pin the ring to white-alpha-B3 (6.75:1 on #373737).

---

## Medium

### M1. `text-muted` gray-400 `#959BA4` = 2.80:1 on white — WCAG 1.4.3
Cannot be used for any meaningful text (captions, timestamps, "optional" hints, the TextLink
"inline-legal variant in gray" if gray means gray-400). **Fix:** restrict to disabled/
decorative; use gray-600 (5.63:1) for real muted text. Pin which gray "gray" means in the
TextLink spec.

### M2. green-100 as text/icon = 2.66:1 on white — WCAG 1.4.3
Green-100 works as a badge *fill* with ink text (4.74:1 PASS) but fails as success text or
icon. green-300 `#168821` = 4.59:1 on white (passes, no margin) and 3.94–4.21:1 on tints
(fails). **Fix:** success text token = green-300 on white only; forbid green text on tints.

### M3. Dark muted text (50% white) fails on elevated surfaces — WCAG 1.4.3
Composite of #FFFFFF80 over #373737 = #9B9B9B = **4.28:1 FAIL** (4.58:1 on #2F2F2F — 0.08
margin). Dark modals/toasts use these steps. **Fix:** bump the muted tier to ~55–60% alpha
(8C = 4.83:1, 99 = 5.43:1 on #373737) or restrict the 50% tier to base/surface-1/2 and
forbid it on elevated/modal surfaces.

### M4. Input boundary identification below 3:1 — WCAG 1.4.11 (nuanced)
Light: border-default 1.23:1 and field fill 1.14:1 vs white. Dark: field fill #FFFFFF1A =
1.34–1.38:1 vs surfaces; dark-border #FFFFFF24 = 1.56:1. If the boundary/fill is required to
identify the control, these fail 1.4.11. The label mitigates, but this is the classic
"subtle-field" trap. **Fix:** ship a ≥3:1 border token that activates on hover/focus
(already implied by H3's outline fix), and document that resting identification relies on
label + fill, not boundary alone — or strengthen the resting border.

### M5. Skeleton / progress track have no dark variants
Skeleton = "gray-200 blocks" and ProgressBar track = gray-200 `#E7E8EA`: on dark surfaces
these render as glowing light blocks (and track-vs-fill contrast in dark is undefined; blue-100
on #1A1A1A is 3.76:1, passes 3:1 only). **Fix:** add `dark-skeleton` and `dark-track` tokens
(e.g. white-alpha steps) to the dark layer.

### M6. Select: "selected option checked" is the wrong ARIA state
APG listbox uses `aria-selected` on `option`; `aria-checked` belongs to checkbox/menuitem
patterns. As written, the spec will mislead implementers. Also unpinned: roving-tabindex vs
`aria-activedescendant`, and open-key behavior (Enter vs Alt+Down). **Fix:** reword to
"`aria-selected` on the focused/selected option"; name the traversal technique.

### M7. Disabled pattern should follow APG disabled guidance
"Disabled = no pointer events, aria-disabled" — good, but native `disabled` also removes the
control from the tab order (undiscoverable by SR/keyboard). **Fix:** specify: remains
focusable, `aria-disabled="true"`, no activation. Loading: add `aria-busy="true"` to the
Button spec (label-kept is already right).

### M8. Navbar drawer: Esc-to-close unspecified; active item semantics missing
Focus-trapped ✓ but Esc dismissal isn't stated; the active-section underline needs
`aria-current="page"` (ties to H2 — the visual cue alone fails contrast). **Fix:** add Esc
close + restore focus to burger; require `aria-current`.

### M9. Tooltip: WCAG 1.4.13 partially covered
Dismissible ✓ (Esc), but **hoverable** (pointer must be able to move onto the tooltip without
it dismissing) and **persistent** (brief hide delay after trigger blur) are unspecified.
**Fix:** add both to the Tooltip behavioral contract.

---

## Low

- **L1 — Target sizes beyond buttons:** Checkbox is a 20px box; spec relies on the clickable
  label but never requires a ≥44px effective target. Toast/Modal close-button sizes are
  unspecified. Add effective-target minimums (the 44px claim currently covers only pills).
- **L2 — Dark focus ring alpha unpinned:** "white-alpha (dark)" — which tier? Pin to B3
  (verified 6.75:1 worst-case on #373737). The 80 tier also passes (5.24:1 on base) but has
  no headroom.
- **L3 — 12px text (`body-xs`, `caps-s`):** never qualifies as "large text", so always needs
  4.5:1 — legal fine-print in gray is the risk (see M1). Not a SC failure by size alone;
  flag for readability review.
- **L4 — Toast collapse:** "oldest collapses" at max 3 — the collapsed toast's content must
  remain available (announced at insertion is enough; collapsed history should be
  SR-reachable or explicitly dropped).
- **L5 — Modal initial focus unspecified:** APG dialog pattern: initial focus to first
  focusable (or the dialog itself for destructive variants). Add one line to the contract.
- **L6 — Validation announcement timing:** describedby-on-refocus (Flow 3) is acceptable;
  optionally announce on-blur errors politely when focus has already left the field, and
  prefer `aria-errormessage` where support allows.

---

## What already passes (keep as-is)

| Pair | Ratio |
|---|---|
| ink-300 #333333 on yellow-100 (primary CTA, checkbox fill) | **9.41:1** |
| ink-300 on yellow-200/300 (hover/active) | 7.91 / 7.08:1 |
| white on ink-300 (inverse button, tooltip, charcoal card, badge) | **12.63:1** |
| ink-300 body on all light tints | 10.85–11.60:1 |
| ink-300 on green-100 badge fill | 4.74:1 |
| blue-100 link on white | 4.62:1; blue-200 hover 5.64:1 |
| red-100 error text on white | 4.80:1 |
| blue-100 progress fill vs gray-200 track | 3.77:1 (≥3:1 non-text) |
| dark-text-secondary 70% white on #1A1A1A–#373737 | 6.75–9.07:1 |
| dark-text-muted 50% white on base–#2F2F2F | 4.58–5.24:1 |
| dark white-alpha B3 on dark-tint-mint/beige | 8.09 / 8.12:1 |
| yellow-100 CTA vs dark-base (non-text) | 12.96:1 |
| white on dark-base | 17.40:1 |

Behavioral floor strengths: keyboard operability per component matches APG (Tabs with
Home/End + automatic activation, Select arrows/Esc/typeahead, radio-group
selection-follows-focus, Modal trap/restore + Esc, Toast live-region strategy, touch parity
for hover affordances), `prefers-reduced-motion` → 0ms with opacity-only fallbacks, skeleton
static under reduced motion, 44px target improvement over the reference's 32px, ArticleCard
single-tab-stop stitch.

## Recommended fix order

1. C1 + C2 (token changes — one frontmatter edit each, unblocks the AA claim)
2. H3 + M6/M7/M8 (focus ring surface-awareness, ARIA state corrections — contract text)
3. H1 + H2 + M1–M5 (remaining token/indicator rules + dark skeleton/track)
4. Lows during story-doc authoring
