---
title: 'Story 13.2 — authorized-zone navigation chrome (console top-nav + tab bar + mega-menu)'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'e274712'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-13-1-admin-gap-map-capture-source.md (Change Log 2 ratifies this scope; the frozen sidebar verdict is superseded)'
  - '{project-root}/.playwright-cli/captures-v3/admin/ (THE reference pack: INDEX.md + probe-notes.md + 8 PII-redacted PNGs — pixels are ground truth)'
  - '{project-root}/packages/components/src/tabs/ (sole text-tab treatment: pill indicator, active = body-m-bold 500 — "text tabs" is a DESIGN.md label, not a code axis; the console needs an underline indicator)'
  - '{project-root}/packages/components/src/navbar/ (marketing v1 bar with strict .bar invariant + v2 sub-nav mega-nav row — NOT to be mutated into the console header)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md (gains the authorized-zone console language section)'
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (Epic 13 sequencing: 13.2 nav chrome → 13.3 data surfaces)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** kit consumers build админки (maintainer direction 2026-09-25),
and the ratified admin reference pack (spec 13.1, `captures-v3/admin/`)
shows the authorized-zone console navigates with a **top header + secondary
text tabs + «Все сервисы» mega-menu** — monochrome, underline-active —
while the kit's navigation atoms are marketing-flavored (yellow navbar) and
its `tabs` text-tab treatment (pill indicator — no code variant axis)
lacks the console's underline indicator.

**Scope (ratified by spec 13.1 Change Log 2 against pixels):**

| Surface | Pixel evidence (pack) | Deliverable |
|---|---|---|
| Secondary tab bar | `admin-main-fullpage`: text-only tabs, active = bold + dark underline | **`tabs` underline indicator** (code: `indicator` option on the sole text-tab treatment; pill default stays) |
| Console top header | `admin-main-fullpage` + `admin-mega-menu` header: logo, product links, «Все сервисы» trigger, icon cluster, avatar+org block | **Composition pattern** (docs + showcase story; navbar NOT mutated) |
| Mega-menu | `admin-mega-menu`: full-width r24–32 panel, 4 text columns ~365px, bold group headings 26–28 + links 20–22, ~62px rhythm, monochrome, underline trigger | **Composition pattern** grounded on the capture; nearest relative navbar v2 sub-nav recorded |
| Console design language | cross-surface (probe-notes §"Console design language") | **DESIGN.md section** (tokens-adjacent guidance) |

**Out of scope (recorded, not lost):** avatar-menu OPEN state and the
generic kebab/«…» menu-popover (no open-state capture — optional follow-up
maintainer capture per 13.1 Change Log 2); page-header pattern with
right-aligned sub-tabs + divider (→ 13.3, where the limits captures ground
it); empty-state (deferred — ungrounded).

</frozen-after-approval>

## Boundaries & Constraints

- **navbar is not touched.** The v1 `.bar` class invariant and the v2
  mega-nav sub-nav row are marketing-frozen; the console header composes
  existing atoms (link, button, qr/avatar via plain img slot) in a pattern,
  not a variant bolted onto navbar.
- `tabs` change is additive: an `indicator` option on the existing (single)
  text-tab treatment (`pill` default stays); no renaming, no breaking props.
  Console specifics: active = bold + **2px dark underline** (ink, not
  yellow); inactive = regular text-secondary — matches the existing tokens.
- **The no-motion pin survives:** the tab bar carries NO transition except
  the text-color hover (structurally pinned in `tabs.test.ts` against the
  sheet, `tabs.css.ts:38-41`) — the underline indicator must SNAP like the
  pill, or the structural pin breaks.
- Any `tabs/*.css.ts` change ⇒ `pnpm gen` (regen committed WITH the change)
  ⇒ `pnpm test` AFTER gen. New stories ⇒ new visual baselines land as
  unconfirmed-by-default PNGs (below 1.5% never overwritten; batch human
  confirmation at the pre-release gate per the standing rule).
- Story content RU, story-meta EN; commits EN conventional by explicit
  pathspec; pnpm only; visual runs never parallel on 6007.
- The pack PNGs are the ONLY reference truth; probe geometry/colors are
  model-estimated ±. Where a token already exists (`--tk-tabs-*`), reuse —
  no new token without a pack-grounded reason.

## Tasks & Acceptance

1. **DESIGN.md — authorized-zone console language section.** AC: section
   added (monochrome chrome; yellow = selection outline/progress/logo
   ONLY; buttons `#ECEEF0` r10 h36–40; cards white r24 on `#F5F6F8`,
   sub-cards `#F0F0F2`; links blue; credits green `#3BC46D`; tabs
   underline-active) citing `captures-v3/admin/`.
2. **`tabs` underline indicator.** AC: the sole text-tab treatment gains
   an `indicator` option (underline; `pill` default stays) — a11y floor
   intact — ≥44px targets, state never rides color/underline alone: bold
   stays); css.ts regen committed with the change; unit tests cover the
   option; one RU story demos the console tab bar; visual baseline
   captured for the new story.
3. **Console chrome composition pattern.** AC: docs pattern page (header
   composition + secondary tabs + mega-menu reference table pointing at
   the pack) + a showcase story composing the console header from existing
   atoms; mega-menu section records the v2-sub-nav nearest-relative and
   the 4-column/underline-trigger/monochrome deltas.
4. **Ledger + epics-v4 amendment.** AC: spec Change Log + Verification
   filled honestly; out-of-scope items restated with their owners (13.3 /
   follow-up capture); the epics-v4 Story 13.2/13.3 rows amended to the
   post-ratification wording (they still carry the pre-capture
   sidebar-nav/avatar-menu/breadcrumbs phrasing).

## Implementation Notes

- Console tab geometry from the pack: text-only row directly under the
  ~70px header; active tab bold + dark underline; keep `--tk-tabs-*` hooks,
  add only what the underline needs (e.g. `--tk-tabs-indicator` color /
  thickness) — names follow the existing token grammar.
- Mega-menu pattern numbers (model-estimated ±): panel x≈75–1925, r24–32,
  white, soft shadow on `#E6E6E6`; 4 columns ~365px at x≈130/595/1055/1515;
  group headings 26–28 bold; links 20–22 plain, ~62px rhythm; trigger =
  text + underline-active, NOT a filled button.
- Header composition: logo, inline product links, «Все сервисы» trigger,
  icon cluster (payments/search/bell), avatar block (56px rounded-square
  avatar + org label) — all PII-redacted zones in the pack are cover
  patches, not design elements; do not copy them into stories.
- Sequencing: land after CI verdict on `e274712` (never push while a run
  is in flight).

## Spec Change Log

1. 2026-09-27 — initial draft; scope per spec 13.1 Change Log 2
   ratification; reference = the PII-redacted admin pack.
2. 2026-09-27 — quick-review lens round 1: **APPROVED with minors**;
   applied — DESIGN.md pointer corrected to the ux-designs path;
   "TEXT variant" wording corrected (no code axis exists; pill is the sole
   treatment); the no-motion pin constraint added (underline SNAPS);
   epics-v4 row amendment added to Task 4.
3. 2026-09-27 — lens round 2 (re-verdict APPROVED): residual wording in
   the Intent problem statement + Task 2 AC still said "TEXT variant" —
   corrected to the sole-treatment + `indicator` option phrasing
   (sanctioned lens correction under Change Log 2's authority).
4. 2026-09-27 — EXECUTION. Task 3 deviation, recorded: the "showcase
   story" landed as the `Демо` story OF the pattern page
   (`packages/docs/src/v2/console-chrome.stories.ts`), not a
   `components/src/showcase/` entry — the composition has no component
   code (navbar untouched), the docs page IS the adoption surface, and
   the visual harness baselines it like any story; 13.3's payments-list
   showcase covers the full-screen composition case.

## Verification

Task 1 — DESIGN.md console language section: **DONE**. Block
`**Authorized-zone console language (v2, admin — Story 13.2).**` added
inside `## Components` (before Reference anchors) + the Components-table
Tabs row amended with the underline indicator; all Task-1 AC values
present (monochrome; yellow = selection outline/progress/logo ONLY;
buttons #ECEEF0 r10 h36–40; cards white r24 on #F5F6F8, sub-cards
#F0F0F2; links blue; credits green #3BC46D; tabs underline-active) with
`captures-v3/admin/` cited; AA caveat for #3BC46D recorded per the file's
delta discipline. `pnpm gen:tokens && pnpm gen` run after the edit (iron
rule) — clean.

Task 2 — tabs underline indicator: **DONE**. `indicator` option
('pill' default | 'underline', reflected attribute, willUpdate clamp) in
`tabs.ts`; sheet block in `tabs.css.ts` (pill pseudo display:none, 2px
bar on aria-selected ::after, `--tk-tabs-indicator` hook, no transition —
the bar-animation pin governs the pseudo); CEM regenerated (+33 lines,
committed with the change); 2 unit tests (attribute reflect incl. the
Lit-paints-default-reflection fix + degenerate clamp; sheet-rule pins);
RU story «Консольный андерлайн»; live visual spec in
`tests/visual/tabs.spec.ts` (pill never paints, 2px bar active-only,
transitionDuration 0s, ArrowRight snap probe). Baselines: 2 NEW
(console-underline light+dark) + `api` light+dark REGENERATED (explicit
rm + update — intentional: the CEM/JSdoc change repaints the API story;
delete+update rule followed, no overwrite of a failing diff).

Task 3 — composition pattern: **DONE** (deviation in Change Log 4).
`packages/docs/src/v2/console-chrome.stories.ts`: «Обзор» (language
summary, when/when-not, mega-menu nearest-relative + deltas, a11y,
codeBlock) + «Демо» (header from existing atoms: logo tile
yellow-100/text-on-primary, product links, «Все сервисы» trigger, icon
cluster, avatar slot — plain spans, tokens only; static mega panel 4
columns; tk-tabs indicator="underline"). Token check: every var verified
against the tokens package (--tk-color-accent did NOT exist — replaced
with yellow-100/text-on-primary, the button-primary pair). Baselines for
the two docs stories: captured in this round (scoped --update-snapshots
run; PNGs land unconfirmed-by-default per the standing gate).

Task 4 — ledger + epics-v4: **DONE**. This Change Log + Verification;
epics-v4 Story 13.2/13.3 rows rewritten to post-ratification wording
(sidebar-nav dropped, avatar-menu open-state → optional follow-up
capture, empty-state/drawer dropped in 13.3, deliverables restated).

Full `pnpm test` after gen: components+react+tokens+root GREEN (counts
in the commit CI run); scoped visual run GREEN. Push gated on the
in-flight c22f3eb run per the never-push-while-in-flight rule.
