/**
 * Registers-surface parsing for the token-reference page (spec 8.3).
 *
 * SINGLE SOURCE — the committed GENERATED listing packages/tokens/src/
 * TOKENS.md (exported by pillkit-tokens as `pillkit-tokens/TOKENS.md`,
 * imported by the story as `?raw`). The docs page renders what the
 * generator wrote — no second hand-copy of any mapping or ruling exists in
 * the docs package. Drift is impossible by construction on two gates:
 * check:tokens-drift regenerates TOKENS.md and fails on a stale diff, and
 * tests/docs-registers-source.test.ts feeds the committed file through THIS
 * parser and fails loudly when the generator's section shape changes (the
 * AD-4 single-source lesson — the guard tests the real code path, not a
 * copy of it).
 *
 * Pure string parsing — no Lit, so the drift-guard test imports this
 * module directly. All functions throw on a missing section (fail loudly,
 * never render silently-empty tables).
 */

/** One parsed markdown table: header cells + body rows. */
export interface MdTable {
  header: string[];
  rows: string[][];
}

/**
 * The body of a markdown section: text from the line AFTER `## heading` /
 * `### heading` to the next heading of the SAME OR HIGHER level. Absent
 * heading → throw (the generator's shape is a contract).
 */
export function mdSection(markdown: string, heading: string): string {
  const level = heading.match(/^#+/)?.[0]?.length ?? 2;
  const start = markdown.indexOf(`\n${heading}\n`);
  if (start === -1) {
    throw new Error(`TOKENS.md: section «${heading}» not found — the generator shape changed; update the registers surface.`);
  }
  const body = markdown.slice(start + heading.length + 2);
  const next = new RegExp(`\\n#{2,${level}} `, 'g');
  next.lastIndex = 0;
  const tail = next.exec(body);
  return tail === null ? body : body.slice(0, tail.index);
}

/** The first markdown table inside a block, or null when there is none. */
export function mdTable(block: string): MdTable | null {
  const lines = block.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\|.*\|$/.test(lines[i]!.trim()) && /^\|[\s:|-]+\|$/.test(lines[i + 1]?.trim() ?? '')) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;
  const cells = (line: string): string[] =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());
  const rows: string[][] = [];
  for (let i = start + 2; i < lines.length && /^\|.*\|$/.test(lines[i]!.trim()); i += 1) {
    rows.push(cells(lines[i]!));
  }
  return { header: cells(lines[start]!), rows };
}

/** The first paragraph (non-empty, non-table, non-code line run) of a section. */
export function mdFirstParagraph(block: string): string {
  const lines = block.split('\n').map((line) => line.trim());
  const paragraph: string[] = [];
  for (const line of lines) {
    if (line.length === 0) {
      if (paragraph.length > 0) break;
      continue;
    }
    if (line.startsWith('|') || line.startsWith('```') || line.startsWith('#')) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(line);
  }
  if (paragraph.length === 0) {
    throw new Error('TOKENS.md: expected a lead paragraph in the section — the generator shape changed; update the registers surface.');
  }
  return paragraph.join(' ');
}

/**
 * Token → Notes mapping from the Colors table (`| Token | Value | Notes |`).
 * The AA rulings for the v2 surface semantics (delta pair, cream tints)
 * render VERBATIM from here — never re-authored in the docs.
 */
export function colorNotes(markdown: string): Record<string, string> {
  const table = mdTable(mdSection(markdown, '## Colors'));
  if (!table) {
    throw new Error('TOKENS.md: the Colors table not found — the registers surface needs its Notes column.');
  }
  const notes: Record<string, string> = {};
  for (const row of table.rows) {
    const token = row[0]?.replace(/`/g, '');
    if (token && row[2] && row[2].length > 0) notes[token] = row[2];
  }
  return notes;
}

/** The assembled registers-surface data (throws when any piece is absent). */
export interface RegistersData {
  /** The 6.1 typography-register mapping table (marketing/product-UI/consumer). */
  typography: MdTable;
  /** The radius-registers lead sentence (pill-soft vs tight-precise). */
  radiusNote: string;
  /** Notes of the v2 surface-semantics tokens, keyed by token name. */
  notes: Record<string, string>;
}

/** The v2 surface-semantics groups the page renders (names are page chrome). */
export const SURFACE_SEMANTICS_GROUPS: ReadonlyArray<{
  title: string;
  tokens: readonly string[];
  /**
   * Tokens whose TOKENS.md Notes carry a load-bearing ruling — absent note
   * throws (the ruling IS the content). Others (surface-field is v1, reused
   * by the v2 search) render with «—» when TOKENS.md documents no note.
   */
  requiredNotes: readonly string[];
}> = [
  {
    title: 'Поиск (search)',
    tokens: ['--tk-color-surface-field'],
    requiredNotes: [],
  },
  {
    title: 'Таблица (table)',
    tokens: [
      '--tk-color-border-table',
      '--tk-color-surface-row-hover',
      '--tk-color-delta-positive',
      '--tk-color-delta-negative',
    ],
    requiredNotes: [
      '--tk-color-border-table',
      '--tk-color-surface-row-hover',
      '--tk-color-delta-positive',
      '--tk-color-delta-negative',
    ],
  },
  {
    title: 'Тёплый cream (business)',
    tokens: ['--tk-color-tint-cream', '--tk-color-tint-cream-raised'],
    requiredNotes: ['--tk-color-tint-cream', '--tk-color-tint-cream-raised'],
  },
];

/** Parse everything the registers story renders; every miss throws. */
export function registersData(markdown: string): RegistersData {
  const typography = mdTable(mdSection(markdown, '### Typography registers (v2)'));
  if (!typography || typography.rows.length === 0) {
    throw new Error('TOKENS.md: the Typography registers (v2) table not found — the registers surface cannot render.');
  }
  const radiusNote = mdFirstParagraph(mdSection(markdown, '## Radius'));
  const notes = colorNotes(markdown);
  for (const group of SURFACE_SEMANTICS_GROUPS) {
    for (const token of group.requiredNotes) {
      if (!notes[token]) {
        throw new Error(`TOKENS.md: no Notes row for ${token} — the surface-semantics table lost its ruling.`);
      }
    }
  }
  return { typography, radiusNote, notes };
}
