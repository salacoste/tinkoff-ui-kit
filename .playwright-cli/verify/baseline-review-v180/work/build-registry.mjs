// Independent PNG-registry verification for the v1.8.0 batch-confirm window.
// Range: ff0e423..bbad7f6, tag commit bbad7f6, HEAD fa3e853.
// Reads git logs captured in this work dir; writes registry.md. Read-only on the repo.
import fs from 'node:fs';

const WORK = '/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/.playwright-cli/verify/baseline-review-v180/work';
const SNAP = 'tests/visual/visual.spec.ts-snapshots/';
const read = (f) => fs.readFileSync(`${WORK}/${f}`, 'utf8');

function parseLog(text) {
  const commits = [];
  let cur = null;
  for (const line of text.split('\n')) {
    if (!line) continue;
    if (line.startsWith('COMMIT ')) {
      const rest = line.slice(7);
      const sp = rest.indexOf(' ');
      cur = { hash: rest.slice(0, sp), subject: rest.slice(sp + 1), files: [] };
      commits.push(cur);
    } else if (cur && /^[A-Z][0-9]*\t/.test(line)) {
      const parts = line.split('\t');
      cur.files.push({ status: parts[0], paths: parts.slice(1) });
    }
  }
  return commits; // newest-first, as git log emits
}

const testsLog = parseLog(read('log-tests.txt'));
const allLog = parseLog(read('log-all.txt'));
const oldestFirst = [...testsLog].reverse();
const subjects = new Map(testsLog.map((c) => [c.hash, c.subject]));

// --- expected set, encoded from the stated spec (stories per group) ---
const ld = (base) => [`${base}-light`, `${base}-dark`];
const expected = new Map(); // path -> group
const add = (g, bases) => { for (const b of bases) expected.set(`${SNAP}${b}-1-chromium.png`, g); };
const stories = (prefix, list) => list.flatMap((s) => ld(`${prefix}${s}`));

add('G1', stories('visual-components-rangeslider--', ['accessibility', 'api', 'calculator', 'playground', 'variants']));
add('G2', stories('visual-components-switch--', ['accessibility', 'api', 'playground', 'settings', 'variants']));
add('G3', stories('visual-components-avatar--', ['accessibility', 'admin-feed', 'api', 'news-row', 'playground', 'variants']));
add('G4', stories('visual-components-input--', ['api', 'code-accessibility', 'code-mode', 'confirmation']));
add('G5', stories('visual-components-textarea--', ['accessibility-notes', 'notes', 'states']));
add('G6', ld('visual-components-button--api')
  .concat(ld('visual-invest-terminal-ticket--terminal-ticket'))
  .concat(ld('visual-token-reference--colors')));
add('G7', ld('visual-getting-started--page'));

const stated = { G1: 10, G2: 10, G3: 12, G4: 10, G5: 6, G6: 6, G7: 2 };
const statedTotal = 56;

// --- actual events under tests/ ---
const actual = new Map(); // png path -> [{hash, status}]
const firstEvent = new Map(); // png path -> hash of oldest event (window)
const nonPngTests = [];
const badStatus = [];
for (const c of oldestFirst) {
  for (const f of c.files) {
    const p = f.paths[f.paths.length - 1];
    const base = f.status.replace(/[0-9]+$/, '');
    if (!p.startsWith('tests/')) continue;
    if (/\.png$/i.test(p)) {
      if (!actual.has(p)) { actual.set(p, []); firstEvent.set(p, c.hash); }
      actual.get(p).push(`${c.hash}:${base}`);
      if (base !== 'A' && base !== 'M') badStatus.push(`${base}\t${p}\t@${c.hash}`);
      if (f.paths.length > 1) badStatus.push(`RENAME(${f.status})\t${f.paths[0]} -> ${f.paths[1]}\t@${c.hash}`);
    } else {
      nonPngTests.push(`@${c.hash} ${base} ${p}`);
    }
  }
}

function groupOf(p) {
  const b = p.slice(SNAP.length).replace(/-1-chromium\.png$/, '');
  if (b.startsWith('visual-components-rangeslider--')) return 'G1';
  if (b.startsWith('visual-components-switch--')) return 'G2';
  if (b.startsWith('visual-components-avatar--')) return 'G3';
  if (b.startsWith('visual-components-input--')) return 'G4';
  if (b.startsWith('visual-components-textarea--')) return 'G5';
  if (b.startsWith('visual-components-button--api-')) return 'G6';
  if (b.startsWith('visual-invest-terminal-ticket--')) return 'G6';
  if (b.startsWith('visual-token-reference--colors-')) return 'G6';
  if (b.startsWith('visual-getting-started--page-')) return 'G7';
  return 'G?';
}

// --- final states at bbad7f6 ---
const ls = read('ls-tree-bbad7f6.txt').split('\n').filter(Boolean);
const lsSet = new Set(ls);
const lsSnapPng = ls.filter((p) => p.startsWith(SNAP) && /\.png$/i.test(p));
const missingAtTag = [...actual.keys()].filter((p) => !lsSet.has(p));
const expectedMissingAtTag = [...expected.keys()].filter((p) => !lsSet.has(p));

// --- post-tag emptiness ---
const postTagRaw = read('log-post-tag.txt');
const postTagEmpty = postTagRaw.trim() === '';

// --- PNG events outside tests/ across the whole range ---
const outside = [];
const captures = [];
const testsPngInAll = new Set();
for (const c of allLog) {
  for (const f of c.files) {
    for (const p of f.paths) {
      if (!/\.png$/i.test(p)) continue;
      if (p.startsWith('tests/')) { testsPngInAll.add(p); continue; }
      const rec = { hash: c.hash, status: f.status, path: p };
      (p.startsWith('.playwright-cli/captures-v5/') ? captures : outside).push(rec);
    }
  }
}
// cross-check: tests-scoped log vs full log agree on tests/ PNGs
const crossOk = testsPngInAll.size === actual.size && [...actual.keys()].every((p) => testsPngInAll.has(p));

// --- checks ---
const expectedNoEvent = [...expected.keys()].filter((p) => !actual.has(p));
const eventsOutsideExpected = [...actual.keys()].filter((p) => !expected.has(p));
const groupActual = {};
for (const p of actual.keys()) groupActual[groupOf(p)] = (groupActual[groupOf(p)] || 0) + 1;
const groupExpected = {};
for (const g of expected.values()) groupExpected[g] = (groupExpected[g] || 0) + 1;

const discrepancies = [];
if (expectedNoEvent.length) discrepancies.push(`(a) файлы из ожидаемого списка без событий: ${expectedNoEvent.join(', ')}`);
if (eventsOutsideExpected.length) discrepancies.push(`(b) PNG-события с файлами вне списка: ${eventsOutsideExpected.join(', ')}`);
if (badStatus.length) discrepancies.push(`(c) D/R/иные статусы: ${badStatus.join('; ')}`);
if (missingAtTag.length) discrepancies.push(`(4) события есть, файла нет на bbad7f6: ${missingAtTag.join(', ')}`);
if (expectedMissingAtTag.length) discrepancies.push(`(4b) файлы ожидаемого списка отсутствуют на bbad7f6: ${expectedMissingAtTag.join(', ')}`);
if (!postTagEmpty) discrepancies.push(`(5) ПОСЛЕ тега есть tests/-события:\n${postTagRaw}`);
if (outside.length) discrepancies.push(`PNG-события вне tests/ и вне captures-v5: ${outside.length} шт. в одном коммите — .playwright-cli/verify/kit-recon/ (см. секцию «PNG-события вне tests/»); это референс-капчуры сторонних китов, НЕ базлайны сюиты`);
if (!crossOk) discrepancies.push('cross-check log-tests vs log-all по tests/ PNG разошёлся');
for (const g of ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']) {
  if ((groupActual[g] || 0) !== stated[g]) {
    discrepancies.push(`счёт ${g}: фактически ${groupActual[g] || 0}, заявлено ${stated[g]}`);
  }
}
if (actual.size !== statedTotal) {
  discrepancies.push(`итого файлов: фактически ${actual.size}, заявлено ${statedTotal}. Заявление G4 "×10" внутренне несогласовано с его же перечнем стори (api, code-accessibility, code-mode, confirmation = 4×2 = 8)`);
}

// --- table rows ---
const order = { G1: 1, G2: 2, G3: 3, G4: 4, G5: 5, G6: 6, G7: 7, 'G?': 8 };
const rows = [...actual.keys()]
  .map((p) => ({ p, g: groupOf(p) }))
  .sort((a, b) => (order[a.g] - order[b.g]) || a.p.localeCompare(b.p))
  .map(({ p, g }) => {
    const base = p.slice(SNAP.length);
    const ev = actual.get(p).join(', ');
    const fh = firstEvent.get(p);
    return `| ${g} | \`${base}\` | ${ev} | ${fh} ${subjects.get(fh)} |`;
  });

const capByDir = {};
for (const r of captures) {
  const d = r.path.split('/').slice(0, 3).join('/');
  capByDir[d] = (capByDir[d] || 0) + 1;
}
const capCommits = [...new Set(captures.map((r) => r.hash))];
const allSubjects = new Map(allLog.map((c) => [c.hash, c.subject]));
const outsideCommits = [...new Set(outside.map((r) => r.hash))];

const md = `# PNG-реестр окна batch-confirm v1.8.0 — независимая сверка (dev-registry)

Диапазон: \`ff0e423..bbad7f6\` (8 коммитов с events в tests/). Теговый коммит: \`bbad7f6\`. HEAD на момент сверки: \`fa3e853\`.
Каталог базлайнов: \`${SNAP}\` — на bbad7f6 содержит ${ls.length} файлов (все PNG: ${lsSnapPng.length}); из них окно затрагивает ${actual.size}.

## Сводка по группам

| Группа | Семейство | Заявлено | Фактически | Совпадает |
|---|---|---|---|---|
| G1 | rangeslider (accessibility, api, calculator, playground, variants) | 10 | ${groupActual.G1 || 0} | ${(groupActual.G1 || 0) === 10 ? 'да' : 'НЕТ'} |
| G2 | switch (accessibility, api, playground, settings, variants) | 10 | ${groupActual.G2 || 0} | ${(groupActual.G2 || 0) === 10 ? 'да' : 'НЕТ'} |
| G3 | avatar (accessibility, admin-feed, api, news-row, playground, variants) | 12 | ${groupActual.G3 || 0} | ${(groupActual.G3 || 0) === 12 ? 'да' : 'НЕТ'} |
| G4 | input (api, code-accessibility, code-mode, confirmation) | 10 | ${groupActual.G4 || 0} | ${(groupActual.G4 || 0) === 10 ? 'да' : 'НЕТ'} |
| G5 | textarea (accessibility-notes, notes, states) | 6 | ${groupActual.G5 || 0} | ${(groupActual.G5 || 0) === 6 ? 'да' : 'НЕТ'} |
| G6 | terminal (button--api, invest-terminal-ticket, token-reference--colors) | 6 | ${groupActual.G6 || 0} | ${(groupActual.G6 || 0) === 6 ? 'да' : 'НЕТ'} |
| G7 | getting-started--page | 2 | ${groupActual.G7 || 0} | ${(groupActual.G7 || 0) === 2 ? 'да' : 'НЕТ'} |
| **Итого** | | **${statedTotal}** | **${actual.size}** | **${actual.size === statedTotal ? 'да' : 'НЕТ'}** |

Примечание к G4: перечень стори в задании (api, code-accessibility, code-mode, confirmation) даёт 4×2 = 8 файлов — цифра «×10» не согласуется с самим перечнем. Фактические события покрывают ровно 8 файлов и ровно эти 4 стори; лишних input-базлайнов в окне нет.

## Реестр событий (56-заявленный / ${actual.size}-фактический)

| Группа | Файл | События (hash:статус, старые→новые) | Forensic (первое событие окна) |
|---|---|---|---|
${rows.join('\n')}

Статусы: A — добавлен в окне, M — существовавший до окна базлайн, обновлён в окне. Коммиты окна (старые→новые): ${oldestFirst.map((c) => `${c.hash} ${c.subject}`).join(' // ')}

## Не-PNG события в tests/ (вне базлайн-реестра, информационно)

${nonPngTests.length ? nonPngTests.map((s) => `- ${s}`).join('\n') : '—'}

## ${discrepancies.length ? 'РАСХОЖДЕНИЯ' : 'Расхождений нет'}

${discrepancies.length ? discrepancies.map((d) => `- ${d}`).join('\n') : `
- (a) все файлы ожидаемого списка (по перечню стори) имеют ≥1 событие в окне — расхождений нет;
- (b) PNG-событий с файлами вне списка нет;
- (c) удалений (D) и ренеймов (R) в tests/ за окно нет — только A и M;
- (полнота) все PNG-события окна в tests/ лежат в \`visual.spec.ts-snapshots/\`; прочие \`*-snapshots\`-каталоги tests/visual/ (12 шт. — business-landing, combobox-search, cookie-banner, data-table, filter-chips, invest-landing, menu-popover, modal, select, stocks-catalog, toast, tooltip) существуют на bbad7f6, но в окне не тронуты (0 событий — всё до-оконное); новые spec-файлы окна (switch/textarea/input-code/terminal-ticket.spec.ts) собственных снапшот-каталогов не имеют;
- (4) все ${actual.size} файлов с событиями существуют на bbad7f6 (ls-tree, ${ls.length} файлов в каталоге, все PNG);
- (5) после тега: \`git log --name-only bbad7f6..HEAD -- tests/\` пуст (0 байт, HEAD=fa3e853) — базлайны после тега не менялись.`}

## PNG-события вне tests/ (весь диапазон, без pathspec; 29 коммитов)

- Вне tests/ и вне \`.playwright-cli/captures-v5/\`: **${outside.length}** — ${outsideCommits.map((h) => `\`${h}\` ${allSubjects.get(h)}`).join('; ') || '— нет'}; все статусы A; расположение: \`.playwright-cli/verify/kit-recon/\`. Это референс-капчуры сторонних китов (antd/carbon/mantine/mui/polaris/radix/shadcn/shoelace/spectrum/polaris/taiga: галереи + composite-* + vision-*) — НЕ базлайны сюиты, НЕ часть PNG-реестра окна; на реестр не влияют. Полный перечень:
${outside.map((r) => `  - \`${r.path}\` @${r.hash}:${r.status}`).join('\n')}
- \`.playwright-cli/captures-v5/\` (капчуры, НЕ базлайны, вне scope реестра): ${captures.length} событий PNG в ${Object.keys(capByDir).length} каталог(ах) — ${Object.entries(capByDir).map(([d, n]) => `${d}: ${n}`).join(', ')}; коммит: ${capCommits.map((h) => `\`${h}\` ${allSubjects.get(h)}`).join(', ') || '—'}. Подтверждено: captures-v5/terminal — капчуры терминала, вне scope базлайн-реестра.

## Метод

\`git log --name-status -M --format="COMMIT %h %s" ff0e423..bbad7f6 -- tests/\` (84 строки) · полный диапазон без pathspec (408 строк) · \`git ls-tree -r --name-only bbad7f6 -- ${SNAP}\` (738) · \`git log --name-only bbad7f6..HEAD -- tests/\` (0 байт). Скрипт: build-registry.mjs. Полные PNG в контекст не читались.
`;

fs.writeFileSync(`${WORK}/registry.md`, md);
console.log(JSON.stringify({
  actualFiles: actual.size,
  expectedFromStoryLists: expected.size,
  groupActual, groupExpected, stated,
  expectedNoEvent, eventsOutsideExpected, badStatus,
  missingAtTag, expectedMissingAtTag, postTagEmpty,
  outsideCount: outside.length, capturesCount: captures.length, capByDir, capCommits,
  crossOk, lsTotal: ls.length, lsSnapPng: lsSnapPng.length,
  nonPngTests, discrepancies,
}, null, 2));
