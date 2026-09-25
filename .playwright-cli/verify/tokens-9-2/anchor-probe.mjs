// Story 9.2 executor probe — anchor transcript generator.
// Re-derives the generator's anchor mechanics over the real DESIGN.md and
// writes NOTES.md (this directory). Run: node .playwright-cli/verify/tokens-9-2/anchor-probe.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { renderArtifacts } from '../../../packages/tokens/scripts/generate.mjs';

// `yaml` is a pillkit-tokens dependency — resolve it from the generator's own
// location, not from this verify script's directory.
const requireFromGenerator = createRequire(
  new URL('../../../packages/tokens/scripts/generate.mjs', import.meta.url),
);
const { parse } = requireFromGenerator('yaml');

const DESIGN = '_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md';
const designText = readFileSync(DESIGN, 'utf8');
const artifacts = renderArtifacts(designText); // must not throw — all 10 anchor

const fence = /^---\r?\n([\s\S]*?)\r?\n---/.exec(designText);
const doc = parse(fence[1]);
const fm = /^colors:\r?\n((?:[ \t][^\n]*\r?\n|\#[^\n]*\r?\n)*)/m.exec(designText)[1];
const body = /\n## Colors\r?\n([\s\S]*?)(?=\r?\n## )/.exec(designText)[1];
const fmLines = fm.split(/\r?\n/);
const lines = [...fmLines, ...body.split(/\r?\n/)];
const region = (line) => (fmLines.includes(line) ? 'colors frontmatter' : 'Colors body');

const factsOf = (text) => {
  const facts = new Set([...text.matchAll(/\d+\.\d+:1/g)].map((m) => m[0]));
  for (const m of text.matchAll(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g)) {
    facts.add(m[0]);
  }
  facts.delete('4.5:1');
  return [...facts];
};

const out = [];
out.push('# tokens-9-2 — generator truth: anchor + byte-stability transcript');
out.push('');
out.push(
  'Story 9.2 executor evidence (2026-09-25, worktree branch off dd100ed). Probe: `anchor-probe.mjs` in this directory — it re-derives the generator mechanics over the real DESIGN.md; the generator itself remains the authority (`pnpm gen:tokens` aborts on any lost anchor).',
);
out.push('');
out.push('## 1. The 10 aa-annotations anchors (mechanics transcript)');
out.push('');
out.push(
  'Pinned mechanics: every entry must have at least one line in the **Colors body ∪ colors frontmatter** that contains the entry token ref (`{colors.<name>}` or the bare name as a word) **and** at least one factual substring of `text` (an `N.NNN:1` ratio or a hex; the bare AA threshold `4.5:1` is excluded — measurements only). Co-location is per LINE (an AA-table row is one line). Anchor lost → generation aborts naming the entry.',
);
out.push('');
out.push('| # | Entry | kind / status / story | Facts in text | Anchor region | Fact(s) found on the anchoring line |');
out.push('|---|---|---|---|---|---|');
let i = 0;
for (const [name, spec] of Object.entries(doc['aa-annotations'])) {
  i += 1;
  const facts = factsOf(spec.text);
  const refRe = new RegExp(`\\{colors\\.${name}\\}|\\b${name}\\b`);
  const hit = lines.find((line) => refRe.test(line) && facts.some((f) => line.includes(f)));
  const found = facts.filter((f) => hit.includes(f));
  out.push(
    `| ${i} | \`${name}\` | ${spec.kind} / ${spec.status} / ${spec.story} | ${facts.length} | ${region(hit)} | ${found.join(', ')} |`,
  );
}
out.push('');
out.push('Anchoring lines (trimmed to the load-bearing span):');
out.push('');
for (const [name, spec] of Object.entries(doc['aa-annotations'])) {
  const facts = factsOf(spec.text);
  const refRe = new RegExp(`\\{colors\\.${name}\\}|\\b${name}\\b`);
  const hit = lines.find((line) => refRe.test(line) && facts.some((f) => line.includes(f)));
  const found = facts.filter((f) => hit.includes(f));
  let shown = hit.trim();
  for (const fact of found) {
    const at = shown.indexOf(fact);
    if (at > 60) shown = '…' + shown.slice(at - 60);
  }
  if (shown.length > 260) shown = shown.slice(0, 257) + '…';
  out.push(`- **${name}** (${region(hit)}) — fact ${found.join(', ')}: ${shown.replace(/\|/g, '¦')}`);
}
out.push('');
out.push(
  'Notes: `error-on-field` is the one entry with no Colors-body AA-table row — its anchor is the colors-frontmatter comment added by this story (the spec\'s "frontmatter comment where the table has no row" path). `text-muted` anchors on its own frontmatter declaration line (`text-muted: \'#959BA4\'` — ref + hex co-located). `text-secondary` and `tint-brown` anchor TWICE (their frontmatter declarations — first hit, shown — and their AA-table rows 331/339, which carry the ratios); the generator accepts any anchoring line, so both entries survive an edit to either side alone. The other eight anchor on AA-table rows in the Colors body (the table itself was NOT touched by this story).',
);
out.push('');
out.push('## 2. Byte stability (regen proof)');
out.push('');
out.push(
  '- `renderArtifacts(designText)` completes (exit 0) — all 10 anchors hold on the first run after the comment fix (the initial run aborted exactly as designed while the error-on-field comment was multi-line: ref and fact on different lines — the line-co-location mechanic caught its own transcript bug).',
);
out.push(
  '- `packages/tokens/src/tokens.css` + `tokens.ts`: **zero-byte diff** vs HEAD (`git diff` empty — the derived notes byte-equal the dead literals, so the css comments are unchanged).',
);
out.push(
  '- Double regen: `pnpm gen:tokens` ×2 → md5 of all three artifacts identical (DOUBLE_REGEN_STABLE).',
);
out.push(
  '- `packages/tokens/src/TOKENS.md`: exactly 1 line changed — the derived status line (git diff: 1 insertion, 1 deletion; every annotation row byte-identical).',
);
out.push('');
out.push('## 3. Zero-PNG manifest');
out.push('');
out.push(
  '- This story changes no token value and no component, so nothing renders differently: `git status --porcelain` at gate time lists NO file under `tests/visual/` snapshots or any `.png`. Visual compare-only ×2 ran green with zero PNG movement (no baseline re-taken, updated, or deleted); the runs\' counts live in the executor report.',
);
out.push('');

writeFileSync(
  new URL('./NOTES.md', import.meta.url),
  out.join('\n') + '\n',
);
console.log(`renderArtifacts OK — transcript written: ${out.length} lines`);
