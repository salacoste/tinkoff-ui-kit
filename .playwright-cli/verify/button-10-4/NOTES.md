# Story 10.4 — button href mode: evidence record (2026-09-26)

Spec: `_bmad-output/implementation-artifacts/spec-10-4-button-href-mode.md`
(baseline commit c9cd63d, executed on spec commit 92dcb34).

## The no-probe disposition (the probes-first rule's empty case)

ZERO pixel probes this round — recorded in the frozen Intent so the executor
does not invent a probe round. Rationale, verbatim from the spec:

- the pill visuals are already shipped (1.7 baselines); the anchor changes
  semantics, not pixels — `button.css.ts` is untouched and gates everything
  on the `.button` class and `:host([...])` attributes, never on the tag;
- the only reference question — the href VALUE of the invest hero's
  «Скачать для iOS» CTA — is unanswerable from screenshots by construction
  (captures carry no URLs), resolved by the `#fragment` placeholder mold:
  `href="#ios"` beside the adjacent tk-link's `href="#android"` (7.5). The
  real App Store URL is UNKNOWABLE and was NOT invented.

No capture scripts, no probes, no invented URLs in this directory — the
byte-stability of the no-href render is pinned by the DOM-identity unit test
(`packages/components/src/button/test.ts` pattern →
`packages/components/src/button/button.test.ts`, the literal
`BUTTON_BRANCH_DOM` pin), not by pixels.

## The showcase adoption diff (ledger 7.5(b) closed)

`packages/components/src/showcase/invest-landing.stories.ts` — the hero CTA:

```diff
-              <tk-button variant="primary" size="hero">Скачать для iOS</tk-button>
+              <tk-button variant="primary" size="hero" href="#ios">Скачать для iOS</tk-button>
```

Label/art byte-stable otherwise; the pair's geometry pins
(tests/visual/invest-landing.spec.ts, the 360 hero leg) pierce to `.button`
(tag-agnostic) and gained the anchor pins: the shadow root's interactive
element is an `A` carrying `href="#ios"` + the `.button` class, no native
button left.

## The sanctioned baseline re-take set (8 legs, both themes)

Explicit `rm` + `--update-snapshots` per targeted legs; nothing outside this
set moved (Playground/States/Interaction/LongLabel/WithIcon/Theming are the
byte-stable canaries; the invest-landing qr interactive clip is untouched).

| Leg (light+dark) | Why it moves |
|---|---|
| `visual-components-button--variants-and-sizes` | the href demo row (same-tab + `_blank` pills, RU figcaptions) |
| `visual-components-button--accessibility` | the anchor row in the keyboard-only checklist (+ the one-sentence note extension) |
| `visual-components-button--api` | CEM regen: href/target/rel attribute rows in the Api table |
| `visual-showcase-invest-landing--invest-landing` | the hero CTA adoption — pixels expected UNCHANGED (anchor paints the identical pill); re-taken because the leg is the adoption's drift guard |

Re-take manifest (filled after the round): see "Round log" below.

## Round log

- Phase 1: `pnpm test` 12 → 20 tests in `button.test.ts`, all green;
  build/lint/typecheck clean.
- Phase 2: stories + adoption + invest pins + CHANGELOG `### Added`;
  `pnpm gen` → CEM +63/−1 (three attribute fields, class-header anchor-mode
  paragraph, private `#anchorRel` method entry); react wrappers byte-stable
  (typing derives from the element class); `pnpm gen:tokens` byte-stable
  (zero token changes — no diff under `packages/tokens`).
- Phase 3 (the baseline round, 2026-09-26):
  - `lsof -ti:6007` empty before every pass (checked 4×: targeted re-take,
    visual pass 1, visual pass 2).
  - Explicit `rm` of the 8 sanctioned legs, then ONE targeted re-take:
    `node_modules/.bin/playwright test visual.spec.ts -g "visual:
    (components-button--(variants-and-sizes|accessibility|api)|
    showcase-invest-landing--invest-landing)" --update-snapshots` → 8 passed.
  - Moved PNGs (git-visible): exactly the 6 button legs
    (`variants-and-sizes`, `accessibility`, `api` × light/dark). The two
    invest-landing legs re-took with **byte-identical** content — git shows
    no change — the direct proof that the adopted anchor paints the hero CTA
    pixel-for-pixel (AC: "its pixels are unchanged from the re-take").
  - Zero movement outside the sanctioned set: all canaries
    (Playground/States/Interaction/LongLabel/WithIcon/Theming) byte-stable,
    the invest-landing qr interactive clip untouched.
  - Visual ×2 (full suite, compare mode): 1368 passed / 8.2m, twice —
    includes the 360 hero leg's new anchor pins and axe in both themes.
  - Full gate chain green: build → test (147 unit) → lint → typecheck →
    gen (wrappers byte-stable) → gen:tokens (byte-stable); post-commit
    gen-drift clean (`git diff --exit-code -- packages/ tests/`).
