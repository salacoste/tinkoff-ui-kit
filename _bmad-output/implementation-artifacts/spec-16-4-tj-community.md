---
title: 'Story 16.4 — ТЖ community: tj-composer + tj-post-card (first stateful — the event-map opens)'
type: 'feature'
created: '2026-09-29'
status: 'draft'
baseline_commit: '063bb4a'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 16.4: composer + post card; Story 16.5 owns the drawer + AD-12 overlay helper + --tj-z-* minting)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/EXPERIENCE.md (Community composer + Post card contracts — verbatim source)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (species: news-title 24/700/30 «news + community posts», byline 15/700/20, time-meta 15/400, card-title 17/400)'
  - '{project-root}/.playwright-cli/captures-v3/tj/probe-notes.md (§Сообщество: h1 38/700; post titles 24/700/30; composer card white r20 + avatar placeholder + ghost text; fill census — yellow/navy ad fills stay OUT per FR-21)'
  - '{project-root}/.playwright-cli/captures-v3/tj/tj-community-{viewport,fullpage}-2026-09-28.png (side-by-side targets)'
  - '{project-root}/packages/tj-components/src/tj-news-card/ (the single-link carrier mold this story reuses verbatim)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 story 16.4) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ kit has reading primitives (16.1) and feed surfaces (16.2+16.3) but nothing for the community page: the fake-input composer card and the post card grid. 16.4 is also the family's FIRST STATEFUL surface — the frozen-EMPTY event-map opens with its first entry, and CONVENTIONS §4 re-opens on the ТЖ instance.

**Approach — two components + the community composition pattern:**

1. **`tj-composer`** — the fake-input card, a BUTTON not an input: shadow `<button type="button">` wrapping (a) an `avatar` slot inside an `aria-hidden` wrapper (the user's avatar is decorative HERE — the button's name is the ghost text; slot alt text must not pollute the name), and (b) the ghost text «Написать пост или вопрос…». Surface = white card on the gray page: height **derived on-scale** — `padding-block var(--tj-space-24) × 2 + avatar 40px = 88px` (the vision band 88–96 brackets it; no height FLAG — it composes from scale parts), avatar 40px round (scale value; reference shows a stroke-only placeholder — the STROKE is consumer art, not kit chrome), gap avatar→text `var(--tj-space-24)`, inline padding `var(--tj-space-32)`. Ghost text = **card-title species 17/400, ink-300, leading 24** (one-species-one-leading; AA on the white card per the AA-surface law — muted gray on card, matching the reference's ~50% register). Radius = **structural `20px` FLAGGED** (probe-measured r20; no card-family token carries 20 — `--tj-radius-chip` is pill geometry, not a card radius; a `--tj-radius-composer` token is a maintainer ratification candidate, NOT minted here — no new tokens this story).
   - **API (§4 first ТЖ entry):** `label` string property, default `«Написать пост или вопрос…»`, **NOT reflected** (string data never reflects — the 16.1 bank freeze carried over). Click dispatches **`open-compose`** — `TjOpenComposeEvent`, `composed: true, bubbles: true`, no detail (§9 grammar; `TjX…Event` naming). The kit NEVER renders the editor (editorial application logic is Out). Enter/Space activate natively (real `<button>`); focus ring = the shipped 16.1/16.3 tj ring mold verbatim (2px focus-ring, offset 2px, on the card surface); hover = NOTHING (unprobed — no invention); cursor pointer (native).

2. **`tj-post-card`** — the community cell: **transparent** (no own bg/radius/border — the reference's cards are text-only cells on a shared white sheet; boxing them would break the composition). Carrier = the **tj-news-card anchor mold verbatim**: whole-card shadow `<a href>`, href empty/unset → inert, `target="_blank"` without rel → `rel="noopener noreferrer"`, consumer rel wins. Slots: `avatar` (meta-row mini avatar, **20px structural FLAG** — vision-measured tiny circle), `byline` (byline 15/700/20 ink-100), `date` (time-meta 15/400 ink-300), `title` (slotted `h2`/`h3`, **news-title 24/700/30 ink-100** — the DESIGN row already names community posts; machine probe beats the vision's 16–18px pixel-guess on downscaled cells), `count` (number text; the component renders a **decorative speech-bubble SVG** `aria-hidden` `currentColor` before the slot — the chip-chevron mold; register time-meta 15/400 ink-300; static text, NEVER a live region).
   - **2-line clamp (the EXPERIENCE contract verbatim):** `::slotted(h2,h3)` gets `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden` (the four declarations = the clamp kit, FLAGGED structural). **`title` attr mirror:** on title-slot `slotchange`, the component sets `anchor.title = textContent.trim()` of the first assigned element (the full text rides the anchor as the tooltip/clamp recovery); a consumer-set `title` attribute on the HOST forwards verbatim and WINS (never overwrite consumer intent).
   - **Count placement fidelity note:** the reference tucks the bubble at the title's truncation line; the kit's count rides its own flow line after the clamped title (a clamp box is a block — an inline sibling after it cannot share its last line; no float hacks invented). Recorded in story prose for the maintainer's side-by-side pass.

3. **Community composition PATTERN** (a story, NOT a component): the white sheet (`--tj-color-card` + `--tj-radius-panel` — the big-surface pair; the vision's ~20px estimate on a downscaled capture is the known vision-radius artifact, probes rule) with the composer card on top and a 3-column `tj-post-card` grid below («Выбор редакции»), gutters from the space scale, consumer-side layout. Lives in `tj-post-card.stories.ts`.

4. **The event-map opens + §4 re-opens (the machinery this story exists to ship):**
   - `packages/tj-components/src/event-map.ts` (tj family location per 15.1 scaffold): first entry `tj-composer: { 'open-compose': TjOpenComposeEvent }`.
   - `pnpm gen` mints the `TjComposer` React wrapper with **`onOpenCompose`** — the AD-1 wrapper machinery's first ТЖ event-bearing exercise; a React smoke test (bank mold: react-dom render, not @testing-library) asserts the wrapper's `onOpenCompose` receives the dispatched event (epics: «AD-1 second instance exercised with a real event»).
   - **NEW `tests/tj-event-map-completeness.test.ts`** — the bank's tests/event-map-completeness mechanization mirrored for ТЖ: dispatch every registry event name on the Lit element ↔ assert the registry key exists (and vice versa). Grows mechanically with future entries.
   - **CONVENTIONS.md §4 re-opens on the ТЖ instance:** rows for `label` (string channel, not reflected, default is the reference copy), `open-compose` (composed+bubbling, no detail), `TjX…Event` naming. Frozen IN this story (the 16.1 bank grammar inherited, ТЖ-local wording).

**Numbering correction recorded (spec-level, no history amended):** CONVENTIONS.md line ~34's `[OPEN — 16.4 burger drawer]` marker predates the FINAL epics numbering — the drawer + AD-12 overlay helper + `--tj-z-*` minting live at **16.5**. This story touches NO z tokens and NO overlay machinery; the CONVENTIONS edit updates the marker to 16.5 while adding the §4 rows.

## Boundaries & Constraints

**Always:**
- The 16.1 component mold: one directory per component, five files, styles consume ONLY `var(--tj-*)`, every structural value flagged in a css.ts comment (known flags: composer radius 20px, meta avatar 20px, the clamp quartet).
- A11y floor: composer = a real `<button>` (name = ghost text, Enter/Space native, 44×44 floor trivially exceeded); post card = ONE tab stop (the whole-card anchor); rings per the shipped tj mold; the post card's accessible name = the anchor's flattened subtree (byline → date → title → count, DOM order — the 16.3 honest-prose mold, NO host-level labelledby claims).
- Stories RU-content (synthetic authors, no PII), each with FR-22 sections: keyboard checklist, SR protocol notes, the Space-scroll row (composer: Space OPENS — it is a button, the deliberate delta vs anchors, checklist row states it).
- Wrappers: `pnpm gen` (manifest + tj-react + event-map FIRST entry); index re-exports; consumed-tokens guard covers new pins; `tests/tj-gen-drift.test.ts` stays green.
- Gates: `pnpm install` (if deps move) → `pnpm test` → `pnpm lint` → `pnpm typecheck` → `pnpm build`. NO local `test:visual` in ANY mode (orchestrator mints provisional baselines post-review — port 6007 single-owner).

**Never:**
- No `_bmad-output/` / `.playwright-cli/` edits by the executor (CONVENTIONS.md in `packages/tj-components/` IS editable — it is package code, not a planning artifact).
- No token VALUE edits, no new token keys (radius stays structural-20 FLAGGED; sheet uses the existing panel pair).
- No `--tk-*` reads, no bank-package imports in `packages/tj-*` (FR-17); the anchor/rel/inert mold is TRANSLATED from tj-news-card, not imported from bank code.
- No npm/publish/version changes; no CI workflow edits.
- No invented states: no composer hover/press art, no editor rendering, no submit affordances, no post-card like/bookmark/engagement UI (capture: none exist), no skeleton for either surface (unprobed), no count as live region, no z-index anywhere, no overlay controller usage (16.5).
- No ad-language blocks (the community page's yellow/navy fills — FR-21: ad modules reuse main-kit promo components; the ТЖ story prose records the exclusion).

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Composer rest | `label` default + avatar slot filled | white card 88px tall (24/40/24), avatar 40 aria-hidden, ghost text ink-300 card-title register, r20 | empty avatar slot → text block keeps its padding (graceful, no phantom circle) |
| Composer activate | click / Enter / Space | `open-compose` dispatches, composed+bubbling; nothing else mutates (no editor, no state) | label = empty string → button name falls back to the story-documented aria-label contract row (dev note; default never empty unless consumer empties it) |
| Composer label channel | `label="Спросите сообщество"` | ghost text swaps; NOT reflected to an attribute | — |
| Composer theme | dark ancestor | card stays the CARD token (dark override re-resolves); ghost text re-resolves ink-300-dark | zero component branches (token re-resolution only) |
| Post card rest | all slots filled | meta row (avatar 20 + byline + date), clamped 2-line title, bubble+count line; transparent cell | any empty optional slot → its row piece simply absent (no orphan separators — the «·» joins are consumer-side in the byline/date slots) |
| Post card clamp | title > 2 lines | ellipsis at line 2; anchor `title` carries the full text | consumer-set host `title` forwards verbatim and WINS over the mirror |
| Post card link rules | href / target / rel | the tj-news-card mold verbatim (inert on empty href; noopener+noreferrer on bare `_blank`) | — |
| Wrapper event | React `onOpenCompose` prop | receives the dispatched TjOpenComposeEvent (smoke, react-dom render) | event-map registry ↔ dispatch completeness test RED on drift |
| FR-17 trip | any tj file importing bank packages | eslint boundary + consumed-tokens guards RED | mechanized at 15.1 |

## Code Map

- `packages/tj-components/src/tj-composer/{index.ts,tj-composer.ts,tj-composer.css.ts,tj-composer.test.ts,tj-composer.stories.ts}` — NEW
- `packages/tj-components/src/tj-post-card/{index.ts,tj-post-card.ts,tj-post-card.css.ts,tj-post-card.test.ts,tj-post-card.stories.ts}` — NEW (includes the community composition pattern story)
- `packages/tj-components/src/event-map.ts` — FIRST entry (`tj-composer` / `open-compose` → `TjOpenComposeEvent`)
- `packages/tj-components/src/{index.ts,custom-elements.json}` + `packages/tj-react/src/generated/` — via `pnpm gen`
- `packages/tj-react/` React smoke test (bank mold location) — `onOpenCompose` end-to-end
- `tests/tj-event-map-completeness.test.ts` — NEW (dispatch ↔ registry, bank mirror)
- `packages/tj-components/CONVENTIONS.md` — §4 ТЖ rows + the 16.4→16.5 drawer-marker correction
- `packages/tj-components/README.md` — component list +2

## Tasks & Acceptance

**Execution:**
- [ ] tj-composer (button + label channel + open-compose dispatch + avatar slot aria-hidden + on-scale height composition)
- [ ] tj-post-card (news-card anchor mold verbatim + clamp quartet + title-attr mirror + bubble/count line)
- [ ] Event-map first entry + `pnpm gen` + React `onOpenCompose` smoke + tests/tj-event-map-completeness.test.ts
- [ ] CONVENTIONS §4 ТЖ rows + 16.5 marker correction; README +2
- [ ] Stories RU (playground/anatomy/accessibility/composition per the 16.1 grammar) with FR-22 sections; community pattern story (sheet + 3-col grid + composer atop)
- [ ] Full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

**Acceptance Criteria:**
- Given the composer, when activated by click/Enter/Space, then `open-compose` dispatches composed+bubbling with the registry class, and the React wrapper's `onOpenCompose` receives it (smoke-verified).
- Given a title longer than two lines, when the post card renders, then the slotted heading clamps at exactly 2 lines with ellipsis and the anchor's `title` carries the full text (consumer host `title` wins when set).
- Given `check:gen` and `tests/tj-gen-drift.test.ts`, when the event-map entry lands, then manifest + wrappers regenerate deterministically for all EIGHT ТЖ components and both gates pass clean.
- Given `data-tj-theme="dark"` on an ancestor, when both components render, then every color re-resolves through tokens with ZERO component branches (the css.ts no-branch pins).
- Given the executor diff, when reviewed, then no token edits, no `_bmad-output/`/`.playwright-cli/` touches, no invented states, every structural value flagged (r20, avatar 20, clamp quartet).

## Design Notes

- **The button-not-input ruling is the story's load-bearing a11y decision:** a real `<textarea>`/input would promise editing the kit never delivers; a `<button>` with the ghost text as its name tells SR users exactly what happens (something opens). The editor stays consumer-side by FR/design; the event is the kit's whole contract.
- **Avatar aria-hidden on BOTH components** (composer avatar slot, post-card meta avatar): identification rides the byline/name text; slotted `alt` text joining the accessible name is pollution (the 16.3 news-card mark ruling generalized).
- **news-title 24/700/30 for post titles over the vision's 16–18px estimate:** computed-style probes (probe-notes §Сообщество) and the DESIGN row both name community posts at the news-title species; vision pixel-guessing on ~230px downscaled grid cells systematically under-reads glyph size. Machine truth wins.
- **The count-below-title micro-delta** (reference: tucked at the truncation line; kit: own flow line) is the honest implementable form — the clamp box is a block; no float hacks. Fidelity note in prose; the maintainer's side-by-side confirms or re-rules.
- **r20 structural FLAG over `--tj-radius-chip`:** value-identical tokens with lying names are worse than flagged structural values; if the maintainer ratifies a composer radius token later it is a one-line swap (the flag names the exact value and the reason).
- **Sheet = card fill + panel radius:** the «Выбор редакции» block is one big surface — the token system's big-sheet pair; per-cell boxing was the trap the capture explicitly rules out.

## Verification

**Commands:**
- `pnpm gen && git status --porcelain` (manifest + wrappers ×8; only expected changes)
- `pnpm check:gen` (clean tree passes)
- `pnpm test && pnpm lint && pnpm typecheck && pnpm build` — under `set -o pipefail` when piped (the PIPEFAIL GATE LAW)
- Visual/baseline work is ORCHESTRATOR-owned post-review: `pnpm test:visual:update` mints the provisional ТЖ baselines (existing baselines byte-stable), CI compare owns the verdict.
</frozen-after-approval>

## Implementation Notes

_(orchestrator fills after execution)_
