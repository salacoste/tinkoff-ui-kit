/**
 * ТЖ registers-surface parsing (spec 17.3) — the TJ-side mirror of
 * src/v2/registers.ts, REUSING its generic primitives.
 *
 * RECORDED FALLBACK (the spec sanctions it): the ТЖ TOKENS.md section
 * grammar diverges from the bank mold — there is no `### Typography
 * registers (v2)` section (the ТЖ table IS semantic, no register
 * indirection), and the ТЖ-unique sections are `### Font family slots`
 * (FR-20), `## Dark layer (Story 15.2)` (the light/dark/source table) and
 * `### Theme invariants` (the bullet list). Rather than bending the bank
 * assembler, this module composes the SAME single-source principle from the
 * SAME primitives: mdSection / mdTable / mdFirstParagraph / colorNotes are
 * imported verbatim; only the ТЖ section shapes are new. No value is ever
 * hand-copied — every row renders what the generator wrote.
 *
 * Pure string parsing — no Lit, so tests/tj-docs-registers-source.test.ts
 * imports this module directly and feeds the committed TOKENS.md through
 * the real code path (the AD-4 lesson: the guard tests the code, not a
 * copy of its output). All misses throw — fail loudly, never blank.
 */

import { colorNotes, mdFirstParagraph, mdSection, mdTable, type MdTable } from '../v2/registers.js';

/** One `- token — rationale` bullet of the Theme invariants list. */
export type TjInvariant = readonly [token: string, rationale: string];

/** The assembled ТЖ registers-surface data (throws when any piece is absent). */
export interface TjRegistersData {
  /** `### Font family slots` — ui/reading stacks (FR-20). */
  fontSlots: MdTable;
  /** The FR-20 paragraph after the font-slots table (ui = Graphik, reading = Charter). */
  fontSlotsNote: string;
  /** `## Dark layer (Story 15.2)` table — Token | Light | Dark | Source | Notes. */
  darkLayer: MdTable;
  /** The dual-emission lead paragraph of the dark-layer section (15.2 contract). */
  darkLayerNote: string;
  /** `### Theme invariants` bullets — tokens the dark layer never overrides. */
  invariants: readonly TjInvariant[];
  /** The quiet-geometry lead of `## Radius` (cards 25 / panels 30, the vision trio deleted). */
  radiusNote: string;
  /** Token → AA/restriction Notes from `## Colors` (verbatim rulings). */
  notes: Record<string, string>;
}

/**
 * The Colors tokens whose TOKENS.md Notes carry a load-bearing AA/restriction
 * ruling — an absent note throws (the ruling IS the content; the 8-entry
 * aa-annotations block of the generator, see TOKENS.md header).
 */
export const TJ_REQUIRED_NOTES: readonly string[] = [
  '--tj-color-ink-reference-meta',
  '--tj-color-ink-reference-time',
  '--tj-color-gold-ink',
  '--tj-color-link-body',
  '--tj-color-badge-purple',
  '--tj-color-chip-fill',
  '--tj-color-focus-ring',
  '--tj-color-engage',
];

/** Parse a `- ` bullet list; every bullet must open with a `` `token` `` span. */
function mdBullets(block: string): TjInvariant[] {
  const bullets: TjInvariant[] = [];
  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('- ')) continue;
    const token = trimmed.match(/`(--tj-[a-z0-9-]+)`/)?.[1];
    if (!token) {
      throw new Error('TOKENS.md: a Theme invariants bullet lost its token span — the generator shape changed.');
    }
    const rationale = trimmed.replace(/^-\s+`[^`]+`\s*—\s*/, '');
    if (rationale.length === 0) {
      throw new Error(`TOKENS.md: the ${token} invariant bullet lost its rationale.`);
    }
    bullets.push([token, rationale]);
  }
  if (bullets.length === 0) {
    throw new Error('TOKENS.md: the Theme invariants list is empty — the registers surface cannot render.');
  }
  return bullets;
}

/**
 * Strip the markdown CODE markers from an identifier/value cell — the ТЖ
 * tables wrap their cells in backticks (the bank v2 tables do not), and the
 * story interpolates these cells into <code> spans directly: markers would
 * render as literal characters. The Notes column keeps its markers (it
 * renders through mdInline, which needs them).
 */
const mdCodeless = (cell: string): string => cell.replace(/`/g, '').trim();

/** Parse everything the ТЖ registers story renders; every miss throws. */
export function tjRegistersData(markdown: string): TjRegistersData {
  const fontSlotsSection = mdSection(markdown, '### Font family slots');
  const fontSlotsRaw = mdTable(fontSlotsSection);
  if (!fontSlotsRaw || fontSlotsRaw.rows.length === 0) {
    throw new Error('TOKENS.md: the Font family slots table not found — the registers surface cannot render.');
  }
  // Token | Stack — identifier/value columns drop their code markers.
  const fontSlots: MdTable = {
    header: fontSlotsRaw.header,
    rows: fontSlotsRaw.rows.map((row) => [mdCodeless(row[0] ?? ''), mdCodeless(row[1] ?? '')]),
  };
  const fontSlotsNote = mdFirstParagraph(
    // The FR-20 paragraph sits AFTER the table — drop the table lines first.
    fontSlotsSection.slice(fontSlotsSection.indexOf('|')),
  );
  const darkLayerRaw = mdTable(mdSection(markdown, '## Dark layer (Story 15.2)'));
  if (!darkLayerRaw || darkLayerRaw.rows.length === 0) {
    throw new Error('TOKENS.md: the Dark layer table not found — the registers surface cannot render.');
  }
  // Token | Light | Dark | Source — identifiers/values drop their code
  // markers; the Notes column (4) KEEPS them (it renders via mdInline).
  const darkLayer: MdTable = {
    header: darkLayerRaw.header,
    rows: darkLayerRaw.rows.map((row) => [
      mdCodeless(row[0] ?? ''),
      mdCodeless(row[1] ?? ''),
      mdCodeless(row[2] ?? ''),
      mdCodeless(row[3] ?? ''),
      row[4] ?? '',
    ]),
  };
  const darkLayerNote = mdFirstParagraph(mdSection(markdown, '## Dark layer (Story 15.2)'));
  const invariants = mdBullets(mdSection(markdown, '### Theme invariants'));
  const radiusNote = mdFirstParagraph(mdSection(markdown, '## Radius'));
  const notes = colorNotes(markdown);
  for (const token of TJ_REQUIRED_NOTES) {
    if (!notes[token]) {
      throw new Error(`TOKENS.md: no Notes row for ${token} — the ТЖ registers surface lost its ruling.`);
    }
  }
  return { fontSlots, fontSlotsNote, darkLayer, darkLayerNote, invariants, radiusNote, notes };
}
