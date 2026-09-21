# Review — ARCHITECTURE-SPINE.md (rubric walk)

Date: 2026-09-21. Reviewer: rubric walker (read-only).
Target: `ARCHITECTURE-SPINE.md` (this directory). Sources checked: `../../prds/prd-tinkoff-ui-kit-2026-09-21/prd.md`, `../../ux-designs/ux-tinkoff-ui-kit-2026-09-21/{DESIGN,EXPERIENCE}.md`.
Line references are to ARCHITECTURE-SPINE.md as read 2026-09-21.

## Verdict

**Sound spine — paradigm, rules, and deferrals are fundamentally right; three Medium fixes required before scaffold.** No paradigm-level problem. The builder-facing divergence points are genuinely covered (AD-1/2/3/5/9/11 each bind a decision a component-builder would otherwise re-derive), the Deferred list is divergence-safe, the Capability→Architecture map covers FR-1..11 completely, and the Mermaid diagram is syntactically valid and conveys the one-way dependency rule. The findings below are contradictions and one absent cross-component decision, not structural flaws.

## Checklist results

| Rubric item | Result |
| --- | --- |
| Fixes real divergence points for component-level builders | Yes, with one miss (F3: overlay positioning) and one thin spot (F6: slot patterns) |
| Every AD Rule enforceable + prevents stated divergence | Mostly yes; AD-4 contradicts the spine's own structure (F1); AD-8 rule as written cannot pass (F2) |
| Nothing under Deferred lets two units diverge | Pass — SSR (guarded by AD-10 constraints), naming (mechanical rename), CI provider (mechanics), dark tints (single-owner token set), i18n (string slots per EXPERIENCE) |
| Named tech verified-current | Versions lens owns this; nothing implausible, two nits (F7) |
| Spec capabilities covered vs PRD FR-1..11 | All 11 mapped and governed; FR-3's slot/content patterns named in PRD but absent from AD-5 (F6); FR-11's semver/changelog/labeling not in any ledger (F5) |
| Every owned dimension decided/deferred/open | Mostly; operational envelope — runtime-ops absence is defensible for a client-side library, but release mechanics + docs hosting are neither decided, deferred, nor open (F5) |
| Mermaid valid + conveys dependency rule | Valid syntax (chained `-->` edges, quoted labels); direction matches AD-4's allowed imports and the "adapters never imported by core" rule |

## Findings

### F1 — [MEDIUM] AD-4's allowed-import list contradicts the Structural Seed and AD-7

- **Where:** AD-4, lines 70–72 ("Allowed imports: `components→tokens`, `react→components`, `docs→{react, tokens}`. Anything else fails lint") vs Structural Seed line 174 (`components/src/<component>/` includes the story) and line 177 ("docs/ — Storybook 10: stories re-export components' stories"); also AD-7 line 98 (story required per component).
- **Why it matters:** re-exporting the components' stories requires `docs→components`, which AD-4's lint rule would fail. Two readings are possible (stories live in `components` and are re-exported, or stories live in `docs`), which is exactly the kind of ambiguity that lets units diverge — one builder scaffolds stories in `packages/components/src/<name>/`, another in `packages/docs`.
- **Fix:** add `docs→components` to the allowed list (one line), or move all story files into `docs` and drop them from the per-component directory convention. Pick one and make the Mermaid diagram agree.

### F2 — [MEDIUM] AD-8's baseline rule is unworkable as written for the 16 reference-grounded components

- **Where:** AD-8, lines 105–109 ("The 16 reference-grounded components baseline against tbank.ru captures … pixelmatch with a 1.5% perceptual diff threshold").
- **Why it matters:** an automated pixel diff of a kit story render against a tbank.ru capture cannot stay under 1.5% for any text-bearing component: the reference's proprietary brand font is explicitly not bundled (OQ-2, DESIGN.md Typography; Inter/fallback is the substitute), plus content and AA-override deltas (focus ring, text-secondary). Every component would permanently fail its own gate, forcing teams to either ignore the gate or hand-edit baselines — the rule prevents nothing once everyone ignores it.
- **Fix:** baseline = the component's first approved kit render; approval is a human side-by-side against the capture (matching DESIGN.md's "DESIGN.md and EXPERIENCE.md win on conflict"). Keep pixelmatch for kit-render-vs-kit-render drift only, as already done for the 3 derived overlays.

### F3 — [MEDIUM] Overlay positioning / stacking-context strategy is undecided and not deferred

- **Where:** AD-11, lines 130–136 (covers focus trap/restore, Esc, aria-live, targets — but not positioning); EXPERIENCE.md Component Patterns Modal/Tooltip/Toast rows (viewport-edge flipping, bottom-right stack, max-3 coordination, body scroll lock); AD-2 lines 51–54 (shadow roots, no document-level styles) makes the question sharper, not settled.
- **Why it matters:** three separate builders implement Modal, Tooltip, and Toast. Attachment strategy (shadow-root absolute vs document body container vs Popover API top-layer), positioning engine (manual vs floating-ui), and cross-instance toast stacking are shared infrastructure. Left unstated, three implementations will diverge or duplicate — the precise failure this altitude exists to prevent. Note toast stacking ("stack bottom-right, max 3 visible") is impossible without some shared/document-level coordination point, which as written collides with AD-2's "never inject document-level styles".
- **Fix:** one AD (or an explicit Deferred entry with an owner and trigger): decide the floating-layer mechanism once for all three overlays.

### F4 — [MINOR] Token namespace is internally inconsistent and collision-prone

- **Where:** AD-3, lines 60–64 ("Site-native variable names are mirrored where extraction used them (`--color-primary`, `--shadow-modal`, …)") vs Consistency Conventions lines 145/147 (`--tk-font-*` slots) and line 142 (`tk-` element prefix, revisited with OQ-3).
- **Why it matters:** two naming schemes coexist (mirrored site-native vs `--tk-` prefix), so a builder adding a token has no single rule. Worse, unprefixed generics like `--color-primary` defined on `:root` are high-collision names in host pages — custom properties inherit into shadow roots, so a consumer's existing `--color-primary` silently restyles the kit (an inverse of the bleed AD-2 exists to prevent).
- **Fix:** one namespace rule (e.g., all tokens `--tk-*`, with the site-native name recorded as provenance metadata only).

### F5 — [MINOR] Operational envelope: runtime absence is defensible; release mechanics and docs hosting are off-ledger

- **Where:** Deferred lines 198–207 (CI provider deferred, but nothing else operational); Capability map FR-11 row, line 196 (FR-11 → "AD-4, OQ-3 deferred").
- **Why it matters:** for a client-side library with no runtime infra, omitting deployment/environments/operations is defensible — the deploy surface is `npm publish` + a static Storybook site. But FR-11 binds this spine (frontmatter line 11) and includes semver enforcement, changelog per release, and unofficial labeling; none of these is decided, deferred, or marked open. Docs-site hosting is likewise absent. Dimensions this altitude owns should at least appear in the Deferred ledger.
- **Fix:** add two Deferred entries: release mechanics (semver/changelog tooling + unofficial-labeling checklist pre-publish, tied to the existing OQ-3 trigger) and docs hosting (static host, decided at scaffold).

### F6 — [MINOR] FR-3's slot/content patterns dropped from AD-5

- **Where:** AD-5, lines 74–83 (rule covers props, events, controlled/uncontrolled only); PRD FR-3 explicitly includes "slot/content patterns"; conventions table lines 138–148 has no slot-naming row.
- **Why it matters:** low-stakes but a named part of the spec's capability: one builder names the art slot `art`, another `media`/`icon`. EXPERIENCE.md already implies canonical names (art slot, icon slot, label).
- **Fix:** one conventions row (named slots: `icon`, `art`, `label`, …) and a clause in AD-5 pointing at CONVENTIONS.md.

### F7 — [NIT] Stack-version hygiene (for the versions lens)

- Vitest "latest stable at scaffold" (line 161) is unpinned while everything else is pinned — fine under the "stack is seed" note, but pick at scaffold.
- AD-10 cites `@lit-labs/ssr` as "experimental — verified 2026-09" (line 126); confirm the package is still `@lit-labs/ssr` vs promoted `@lit/ssr` when SSR is revisited.

### F8 — [NIT] Behavioral unit tests ungoverned

- **Where:** Structural Seed line 174 lists a `test` file per component, but no AD states what behavior must be tested (e.g., AD-5's controlled/uncontrolled parity, event contracts). Enforcement currently rests on PR checklists (AD-5) and story-level a11y/visual gates (AD-7/8).
- **Fix (optional):** one sentence in AD-7 or AD-5: unit tests cover event dispatch, controlled/uncontrolled parity, and reduced-motion branches per component.

## What is good (evidence for the verdict)

- AD-1/AD-2/AD-3/AD-5/AD-9/AD-11 each close a decision 19 component stories would otherwise re-derive; AD-11's "implementation is wrong until either changes by PR" is a clean authority rule.
- All seven PRD OQs are resolved or explicitly deferred with triggers (OQ-1 in DESIGN.md, OQ-2 in conventions, OQ-3/OQ-4 deferred, OQ-5 via AD-1, OQ-6 via AD-8 threshold, OQ-7 via AD-10).
- AD-10 is the model deferral: value deferred, invariant that protects the future kept ("no imperative DOM access at construction time").
- Capability→Architecture map is complete over FR-1..11 with no orphan capabilities.
- Single Mermaid diagram is valid and encodes the same edge set as AD-4 (modulo F1).
