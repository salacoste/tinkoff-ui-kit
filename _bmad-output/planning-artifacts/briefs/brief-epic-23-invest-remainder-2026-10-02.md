---
rulingsDate: 2026-10-02
runMode: maintainer Q&A session (5 questions answered one-by-one; documented for next steps)
inputDocuments:
  - .playwright-cli/captures-v4/invest/GAP-MAP.md (recon triage, 2026-10-01)
  - .playwright-cli/captures-v4/invest/reports/gap-2-instrument.md (chart / publisher / sidebar grounding)
  - _bmad-output/implementation-artifacts/spec-22-{1..6}-*.md (the landed identity wave)
  - RELEASE.md §12 + spec-19-2 (the release mold)
---

# Epic 23 «invest remainder» — maintainer rulings + sequencing (2026-10-02)

Five open questions asked and answered in one session; this brief is the durable record.
The four stories below are specced as DRAFT in `implementation-artifacts/spec-23-{1..4}-*.md`
pending «go».

## Ruling 1 — release v1.6.0 FIRST, full cycle

`[Unreleased]` holds twelve stories (Epic 21 six atoms + Epic 22 six identity stories;
suite 2326→2386, every CI green, tree clean at `e5795a2`). The 19.2 mold runs verbatim:
versions ×7 → 1.6.0, CHANGELOG `[1.6.0]`, RELEASE §12 mirror, HANDOFF §2/§4 queue,
README/getting-started pins, full suite, Flow-B fresh clone; **the tag moves only on the
maintainer's «tag ok»**.

**Graphik closure rides this release** (Ruling 4): final HANDOFF/deferred-work record +
local-fonts README finalization — XCharter stays the reading carrier, the commented
@font-face recipe is the PERMANENT Graphik story (consumers with their own license wire
it themselves). This closes the last maintainer tail open since v1.5.0.

## Ruling 2 — Epic 23 direction: invest, the GAP-MAP remainder

The subproject direction (bank / business / ТЖ-later / invest) continues on invest —
the two landed waves (21 foundation, 22 identity) leave the instrument page one wave
short of complete. ТЖ vertical and admin family stay queued for later epics.

## Ruling 3 — B1 chart scoping: a STATIC SVG chart IN the kit

The only L-class recon item is ruled IN, scoped down to the kit's display discipline:

- `data-in → SVG-out`, STATELESS (the tk-rating mold: value in, graphics out, zero
  events, zero channel);
- series / gradient fill / grid / axes / reference line rendered from TOKENS measured
  on the recon captures; FR-1 applies to SVG presentation attributes the same as to
  box CSS;
- the Y-axis formats values properly (the live bond chart's raw-float bug is recorded
  ammo — the kit does it right; RU decimal convention pinned);
- **OUT**: crosshair, hover tooltips, zoom/pan, live updates, indicator engine — the
  consumer layers interactivity on top; the deferred «terminal chrome» stays deferred
  (imagery-only, no DOM capture exists).

## Ruling 4 — Graphik: keep as-is, close the tail

No purchase, no substitute wave. XCharter ×4 remains the shipped reading face
(`--tj-font-reading`); Graphik remains a commented recipe forever. Final record lands
with the v1.6.0 release docs (Ruling 1). Nothing was blocked by this decision.

## Ruling 5 — Epic 23 composition (all four selected)

| # | Story | GAP-MAP | Class | Size |
|---|---|---|---|---|
| 23.1 | tk-chart — static SVG price chart | B1 (ruled) | NEW-COMPONENT | M (L scoped down) |
| 23.2 | tk-publisher-header — «Профиль в Пульсе» | B14 | NEW-COMPONENT | S |
| 23.3 | Trade form — покупка/продажа composition | 22.6 out-of-scope tail | NEW-PATTERN (composition) | S/M |
| 23.4 | Instrument page assembly + sticky sidebar | P-class layout | NEW-PATTERN | M |

Sequencing: 23.1 → 23.2 → 23.3 → 23.4 (the assembly page consumes the chart; the wave
closes by composing the complete instrument page from everything 21.x–23.x built).

## Explicitly left for Epic 24+ (not this wave)

- The pattern wave proper: P1 pricing matrix, P2 screener, P3 lead-form, P4 stat tiles,
  P5/P6 list completions, P8 research pattern + B6 chart-figure wrapper, P10–P17.
- The VARIANT packs batched per component (filter-chips yellow-outline, tabs pill mode,
  article-card social/modes, post-card invest extension, input OTP/phone…).
- Terminal DOM re-capture (needs an auth-gated live session — imagery-only today),
  authenticated surfaces, B3 range-slider, B5 audio-player, B7 code-block, B8 timeline.

## Standing laws (unchanged, apply verbatim)

npm — never; releases = git tags on «tag ok»; zero-in-flight before every push;
explicit baselines re-mint (PNG deleted BEFORE re-mint); ≤1.5% baselines age by the
5.4-F1 law; full suite after any built-tree change; PD gate (fictional RU story data);
vision budget ≤2 per review; pathspec-only commits, conventional EN, co-author line.
