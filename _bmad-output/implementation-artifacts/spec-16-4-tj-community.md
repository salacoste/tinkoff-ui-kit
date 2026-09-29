---
title: 'Story 16.4 — ТЖ community: tj-composer + tj-post-card (first stateful — the event-map opens)'
type: 'feature'
created: '2026-09-29'
status: 'executed'
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
- [x] tj-composer (button + label channel + open-compose dispatch + avatar slot aria-hidden + on-scale height composition)
- [x] tj-post-card (news-card anchor mold verbatim + clamp quartet + title-attr mirror + bubble/count line)
- [x] Event-map first entry + `pnpm gen` + React `onOpenCompose` smoke + tests/tj-event-map-completeness.test.ts
- [x] CONVENTIONS §4 ТЖ rows + 16.5 marker correction; README +2
- [x] Stories RU (playground/anatomy/accessibility/composition per the 16.1 grammar) with FR-22 sections; community pattern story (sheet + 3-col grid + composer atop)
- [x] Full gates ×7 packages (test → lint → typecheck → build); NO test:visual locally

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

**Executor round** — mold-faithful end to end; zero spec violations in orchestrator triage (anchor mold verbatim, on-scale 24/40/24 height arithmetic, structural r20 + avatar-20 + clamp-quartet flags all placed, no invented states, artifacts untouched). Seven sound deviations, all recorded by the executor:

1. **Registry path:** the spec's Code Map named `packages/tj-components/src/event-map.ts`; the REAL 15.1-scaffold registry (which the smoke test, completeness net, and gen machinery all read) is `packages/tj-react/src/event-map.ts` — entry landed there. (Spec Code Map label corrected post-hoc here; the spec body elsewhere named the real path.)
2. **Entry shape:** the frozen registry grammar is `{ ReactProp → native event name }` (runtime lookup in `createKitComponent`), so the entry is `'tj-composer': { onOpenCompose: 'open-compose' }` — the spec's `{ 'open-compose': TjOpenComposeEvent }` notation was conceptual.
3. **Meta-avatar FLAG rationale:** `--tj-space-20` exists in the space scale (same value, spacing channel — not a size channel); the literal stays per the spec's explicit command, the FLAG comment names the measurement basis + the channel ruling (the r20-vs-radius-chip logic extended).
4. **Completeness net scans BOTH dispatch idioms** (`new CustomEvent('name'` bank mold + `new TjX…Event()` class mold resolved via `static readonly eventName`) — necessary or the tj-composer entry would be hand-guarded instead of net-demanded.
5. **Empty-label contract row:** implemented as host `aria-label` forwarding (tracked property, consumer wins) rather than a bare fallback string.
6. **Ride-along mechanical pins:** consumed-tokens roster flip 6→8 (the 16.2+16.3 flip-the-assertion protocol); stale header updates where prose said "ships EMPTY" in present tense.
7. **Native typing:** `ariaLabel: string | null` (ARIAMixin) and `title: string` — both caught by the build stage.

**Lens quick-review round** — verdict PATCH-NEEDED(1 MAJOR + 2 MINOR + 5 NIT); MAJOR + both MINORs + 4 NITs landed (orchestrator-owned patches):

- **MAJOR (dead property channel — REAL):** `@property() override title` shadows the native reflecting accessor, so a consumer PROPERTY write (`el.title = 'x'` — exactly how `@lit/react` sets known props) never touches the attribute; `#syncAnchorTitle` read only `getAttribute('title')` and silently overrode the consumer's tooltip with the slot mirror. The documented consumer-wins contract was dead on the PRIMARY React path. Fix: precedence chain ATTRIBUTE (verbatim, `""` = deliberate suppression) → non-empty PROPERTY → slot mirror; false jsdoc rewritten; two new pins (property round-trip + attribute-beats-property precedence). The composer's `aria-label` forwarding already read the property — the story's own consistency proved the mold.
- **MINOR (height pins weaker than prose):** `not.toContain('height: 88')` missed `height: 96`/`max-height`/`block-size`. Hardened to a scoped rule-extraction pin: the `.composer { … }` block itself must carry ZERO height/block-size declarations (scoped so the avatar's legit `height: var(--tj-space-40)` and any line-height cannot defeat it).
- **MINOR (completeness net silent skip):** the `if (!tag.startsWith('tj-')) continue` let a grammar-matching dispatch in a non-component file ship unregistered green (the bank net fails loudly there). Skip removed — non-manifest directory tags now fail test 2's attribution check.
- **NITs landed:** ::slotted count pin (exactly two non-empty-paren selectors) + the clamp quartet pinned INSIDE the extracted `::slotted(h2,h3)` rule (moving it to `.title` now fails); empty `aria-label=""` host pin (no attribute → content name survives); story prose token name corrected to `--tj-radius-badge` (the css actually consumes it); README «Семь stateless» → honest «все восемь stateless; tj-composer несёт единственное событие, но не держит состояния».
- **NIT accepted-as-is (bank-mirror property):** double-quoted/template-literal dispatch literals escape the net's regexes — the bank net carries the identical hole and its comment documents «future verbs append»; not a regression, noted for the family's ledger.

**Gates** (post-patch, pipefail chain, `&&` between the pnpm commands): GENUINELY GREEN — tj-tokens 4 · tokens 17 · tj-components 156 · tj-react 16 · components 713 · react 70 · root 183 (root = 18 files incl. the new tj-event-map-completeness ×3 + consumed-tokens flip) · lint clean · typecheck clean · docs Storybook build Done.

**Process lesson (standing — the PIPEFAIL GATE LAW, second variant):** the patch-round gate chain was mis-structured as `pnpm test | tail && echo "=== LINT ==="; pnpm lint | tail && echo …` — the `&&` gated only the decorative HEADER echoes while `;` chained the gates themselves: `pnpm test` genuinely failed (two of the orchestrator's own patch tests) and the chain still printed `ALL GATES GREEN`. The law's second clause: chain the GATES with `&&` between the pnpm commands themselves (`pnpm test | tail && pnpm lint | tail && …`); never `;`-separate stages, never let an echo be the right operand. (The two real failures were both orchestrator patch bugs, caught and fixed in-round: Lit maps attribute REMOVAL to a NULL property write — `this.title.length` threw, null-guard added; and the ::slotted count pin mis-counted two selector strings h2+h3 as one occurrence — the count is 3.)

**Side-by-side (vision round on minted CDN baselines, 4_5v analyze_image):**

- **tj-composer anatomy — PASS.** Card ~90–96px vs avatar 40 (the band brackets the derived 88 = 24/40/24); radius read 20–24 (structural r20 FLAG inside the band); ghost text regular-weight gray in the ~#8C8F94 register (= ink-300's channel), vertically centered, clean gap right of the avatar; no extra controls; zero defects. The reported «subtle shadow» is edge-contrast perception on white-card-over-gray-canvas — the css declares NO box-shadow (pinned). The avatar placeholder reading as a filled gray disc is the STORY's neutral SVG placeholder art; the reference's stroke-only placeholder is consumer art, not kit chrome (the spec ruling held).
- **community-pattern round 1 — ONE real finding, pattern-level, spec-origin:** the frozen Intent §3 placed the composer INSIDE the white sheet → tone-on-tone, the card stopped reading as a card; the reference carries the composer on the GRAY PAGE above the sheet, «Выбор редакции» a separate white block (capture facts). The executor had followed the frozen text faithfully — the miss was the orchestrator's own spec wording, not the implementation. **Fixed story-side (orchestrator patch):** composer moved to a SIBLING above the sheet — `.tjcp-composer { display: block; max-width: var(--tj-space-column-main); margin: 0 0 var(--tj-space-32) }` — riding the existing gray canvas (`.tjpc-canvas` already carries `--tj-color-page`); story prose + pattern FLAG comments updated to the reference composition; component css/ts UNTOUCHED. Gates after the patch: typecheck · lint · docs build green.
- **Ellipsis «defect» — FALSE POSITIVE:** vision claimed a missing «…» glyph while its own transcription ended THREE titles with «…» («…консерватор ил…», «налогообложении…»); `-webkit-line-clamp: 2` always draws the ellipsis in Chromium and the quartet is pinned inside the extracted `::slotted(h2,h3)` rule by the unit suite. No action.
- **Round 1 otherwise CONFIRMED the reference register:** 3 equal columns, text-only transparent cells (no per-card boxing), meta row with author darker/bolder than the date, comment line with bubble glyph + count on its own line, avatars and bubbles render, no orphan «·», no misalignment.
- **Round 2 (re-minted community-pattern, post-fix) — PASS, the fix landed:** the composer now reads as its OWN white rounded card on the gray page, ABOVE the sheet, clear gap; the sheet holds ONLY the 3-column grid; all grid registers re-confirmed (3 equal columns, transparent cells, author-bolder-than-date, 2-line titles — the ellipsis EXPLICITLY transcribed this round: «…консерватор ил…», double-confirming round 1's ellipsis claim false); no overlap/clipping/orphan separators, icons intact. Two residual observations, both NON-defects: (a) «stacked pair reads by gap only, no elevation» — the kit ships no shadows by design (unprobed → no invention; the reference is flat white-on-gray); (b) «composer inner content starts ~100px vs grid's ~60px» — vision measured the composer's TEXT start (32 padding + 40 avatar + 24 gap ≈ 96 from the card edge — the reference's own anatomy) against the first grid column's text; the OUTER EDGES align (vision's own confirmation), and inner insets are anatomy of different elements. No action on either.

**Baselines:** first mint 1624/1624 passed (9.9m), +42 vs the 1582 floor = exactly 14 NEW PNGs (composer ×3 stories + post-card ×4 stories, each ×2 themes), ZERO existing modified — the remaining +28 are the axe/visual pairs of the same stories. Community-pattern pair re-minted post-fix: 2 PNGs deleted explicitly first (the standing rule), update-mode re-take. **Final delta (post re-mint):** tree = exactly 14 untracked PNGs (the re-minted pattern pair among them), 0 tracked baselines modified. The re-mint's `-g "community-pattern"` scoping was silently lost to pnpm's `--` passthrough (playwright treats post-`--` args as POSITIONAL file filters) → the run became a FULL-suite update: 1624/1624 passed (9.9m), exit 0 — a bonus byte-stability re-verification of all 1610 existing baselines. Standing lesson: for scoped update runs OMIT the `--` (`pnpm test:visual:update -g "x"`).

**CI:** _(pending)_
