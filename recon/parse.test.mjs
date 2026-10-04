// Hermetic parser tests (spec 25.1 AC8): every unit covers a pure function —
// no network, no filesystem. The harvest path itself is exercised by the
// dogfood + pilot runs recorded in the spec execution record.

import { describe, expect, it } from 'vitest';

import { classifyListing, renderCapabilityDoc } from './lib/capability.mjs';
import { sumRange } from './lib/downloads.mjs';
import { cssVars, flattenTokenJson, parseCem } from './lib/extract.mjs';
import { normalizeRepoUrl } from './lib/github.mjs';
import { latestSnapshot, renderKitReport, renderSummary } from './report.mjs';
import { appendSnapshot, buildSnapshot } from './lib/snapshot.mjs';

describe('parseCem', () => {
  it('extracts components with props, events and slots', () => {
    const cem = {
      modules: [
        {
          declarations: [
            {
              kind: 'class',
              name: 'TkFoo',
              tagName: 'tk-foo',
              attributes: [{ name: 'label' }, { name: 'open' }],
              events: [{ name: 'open-change' }],
              slots: [{ name: '' }, { name: 'anchor' }],
            },
            { kind: 'variable', name: 'helper' }, // not a component
          ],
        },
      ],
    };
    const { components, notes } = parseCem(cem);
    expect(notes).toEqual([]);
    expect(components).toHaveLength(1);
    expect(components[0]).toEqual({
      name: 'TkFoo',
      tag: 'tk-foo',
      props: ['label', 'open'],
      events: ['open-change'],
      slots: ['', 'anchor'],
    });
  });

  it('reports honestly when the CEM yields nothing readable', () => {
    expect(parseCem(null)).toEqual({ components: [], notes: ['CEM present but unreadable: no modules[] array'] });
    expect(parseCem({ modules: [] })).toEqual({ components: [], notes: ['CEM parsed but yielded 0 component declarations'] });
  });
});

describe('cssVars heuristic', () => {
  it('collects unique custom property names, sorted', () => {
    const css = '.a{--tk-space-16: 4px; --tk-space-24: 8px} .b{--tk-space-16: 4px} .c{--tui-radius: 8px}';
    expect(cssVars(css)).toEqual(['--tk-space-16', '--tk-space-24', '--tui-radius']);
  });

  it('does not match malformed or non-declaration dashes', () => {
    expect(cssVars('a:hover { color: red } .x { --broken }')).toEqual([]);
  });
});

describe('flattenTokenJson', () => {
  it('reads W3C $value nesting and flat leaf maps', () => {
    const doc = {
      color: { primary: { $value: '#00813E' } },
      space: { unit: { $value: 4 } },
    };
    expect(flattenTokenJson(doc, '', 0)).toEqual([
      ['color.primary', '#00813E'],
      ['space.unit', '4'],
    ]);
    const nestedFlat = { scale: { small: '4px', large: '8px' } };
    expect(flattenTokenJson(nestedFlat, '', 0)).toEqual([
      ['scale.small', '4px'],
      ['scale.large', '8px'],
    ]);
  });

  it('ignores top-level primitives (package metadata, not tokens)', () => {
    expect(flattenTokenJson({ name: 'x', version: 1 }, '', 0)).toEqual([]);
  });
});

describe('appendSnapshot idempotency', () => {
  const existing = ['{"kit":"taiga","npm":"@taiga-ui/core","version":"4.0.0"}'];

  it('skips the same kit@version', () => {
    const result = appendSnapshot(existing, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.0.0' });
    expect(result.action).toBe('skipped');
    expect(result.lines).toHaveLength(1);
  });

  it('appends a new version and replaces in place on --force', () => {
    const bumped = appendSnapshot(existing, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.1.0' });
    expect(bumped.action).toBe('appended');
    expect(bumped.lines).toHaveLength(2);
    const forced = appendSnapshot(existing, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.0.0' }, { force: true });
    expect(forced.action).toBe('replaced');
    expect(forced.lines).toHaveLength(1);
    expect(JSON.parse(forced.lines[0]).version).toBe('4.0.0');
  });

  it('collapses stale duplicate lines of the same version on --force', () => {
    const dupes = [...existing, '{"kit":"taiga","npm":"@taiga-ui/core","version":"4.0.0"}'];
    const forced = appendSnapshot(dupes, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.0.0' }, { force: true });
    expect(forced.action).toBe('replaced');
    expect(forced.lines).toHaveLength(1);
  });
});

describe('buildSnapshot d.ts component heuristic', () => {
  const base = {
    kit: 'probe',
    npm: 'probe-core',
    version: '1.0.0',
    meta: {},
    scan: {
      packageJson: { name: 'probe-core' },
      cem: null,
      cemPath: null,
      dtsPaths: ['index.d.ts', 'components/button/button.directive.d.ts', 'components/calendar/calendar-sheet.component.d.ts'],
      dtsComponentPaths: ['components/button/button.directive.d.ts', 'components/calendar/calendar-sheet.component.d.ts'],
      tokenJsonPaths: [],
      themePaths: [],
      stylesheetPaths: [],
      readme: null,
    },
    cemResult: { components: [], notes: [] },
    tokenResult: { tokens: [], notes: [] },
  };

  it('records the d.ts inventory count and an honest note when CEM is absent', () => {
    const snap = buildSnapshot(base);
    expect(snap.artifactsFound.dtsComponents).toBe(2);
    expect(snap.components).toEqual([]);
    expect(snap.notes).toContain('no CEM; d.ts inventory carries 2 component/directive declarations (path-derived, not typed API)');
  });

  it('stays silent when CEM already describes the API', () => {
    const snap = buildSnapshot({
      ...base,
      cemResult: { components: [{ name: 'TkFoo', tag: 'tk-foo', props: [], events: [], slots: [] }], notes: [] },
    });
    expect(snap.notes).toEqual([]);
  });
});

describe('activity-layer helpers', () => {
  it('sums a daily downloads series', () => {
    expect(sumRange([{ downloads: 10 }, { downloads: '15' }, {}, { downloads: 5 }])).toBe(30);
  });

  it('normalizes repository fields to owner/repo and rejects non-github hosts', () => {
    expect(normalizeRepoUrl('git+https://github.com/taiga-family/taiga-ui.git')).toBe('taiga-family/taiga-ui');
    expect(normalizeRepoUrl('https://github.com/mui/material-ui')).toBe('mui/material-ui');
    expect(normalizeRepoUrl('github.com/ant-design/ant-design')).toBe('ant-design/ant-design');
    expect(normalizeRepoUrl({ url: 'git://github.com/mantinedev/mantine.git' })).toBe('mantinedev/mantine');
    expect(normalizeRepoUrl('https://gitlab.com/foo/bar')).toBeNull();
    expect(normalizeRepoUrl(null)).toBeNull();
  });
});

describe('report renderers', () => {
  const snap = {
    kit: 'probe',
    npm: 'probe-core',
    version: '2.0.0',
    fetchedAt: '2026-10-04T00:00:00Z',
    meta: {
      license: 'MIT',
      repository: 'https://github.com/acme/probe',
      releasesTotal: 40,
      releasesLast12mo: 9,
      activity: {
        downloads: { lastMonth: 1234, window: 'a..b' },
        github: { repo: 'acme/probe', stars: 42, forks: 7, openIssues: 3, contributors: 5, releases: [{ tag: 'v2', publishedAt: '2026-09-01T00:00:00Z' }] },
      },
    },
    artifactsFound: { cem: true, dtsCount: 10, dtsComponents: 0, tokenJsonCount: 1, themeFiles: [], stylesheets: 2, readme: true },
    components: [{ name: 'PFoo', tag: 'p-foo', props: [], events: [], slots: [] }],
    tokens: [{ name: 'p.color', value: '#fff', source: 'tokens-json' }],
    notes: ['typed tokens: 1 entry'],
  };
  const entry = { id: 'probe', family: 'lit', anchor: false };

  it('latestSnapshot takes the JSONL tail', () => {
    const older = JSON.stringify({ ...snap, version: '1.0.0' });
    expect(latestSnapshot([older, JSON.stringify(snap)]).version).toBe('2.0.0');
  });

  it('renders a per-kit report with identity, artifacts, activity, notes', () => {
    const doc = renderKitReport(snap, entry);
    expect(doc).toContain('# probe');
    expect(doc).toContain('CEM **yes**');
    expect(doc).toContain('⭐ 42');
    expect(doc).toContain('- typed tokens: 1 entry');
  });

  it('renders a SUMMARY row per kit with the anchor mark', () => {
    const doc = renderSummary([{ entry: { ...entry, anchor: true }, snap }], '2026-10-04T00:00:00Z');
    expect(doc).toContain('| probe ⚓ | lit | 2.0.0 | ✅ | 1 | 10 |');
    expect(doc).toContain('Kits: 1.');
  });
});

describe('capability matrix', () => {
  const listing = {
    ok: true,
    files: [
      { name: '/package/custom-elements.json', size: 10 },
      { name: '/package/index.d.ts', size: 10 },
      { name: '/package/themes/dark.css', size: 10 },
    ],
  };

  it('classifies artifacts from a flat listing', () => {
    expect(classifyListing('probe', listing)).toMatchObject({
      id: 'probe',
      reachable: true,
      cem: true,
      dts: 1,
      themes: 1,
    });
  });

  it('carries errors honestly for unreachable packages', () => {
    expect(classifyListing('ghost', { ok: false, error: 'HTTP 404' })).toMatchObject({
      id: 'ghost',
      reachable: false,
      cem: false,
    });
  });

  it('renders a markdown table row per kit', () => {
    const doc = renderCapabilityDoc([classifyListing('probe', listing)], '2026-10-04T00:00:00Z');
    expect(doc).toContain('| kit |');
    expect(doc).toContain('| probe | yes | yes | 1 |');
  });
});
