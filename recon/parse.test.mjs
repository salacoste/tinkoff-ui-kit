// Hermetic parser tests (spec 25.1 AC8): every unit covers a pure function —
// no network, no filesystem. The harvest path itself is exercised by the
// dogfood + pilot runs recorded in the spec execution record.

import { describe, expect, it } from 'vitest';

import { classifyListing, renderCapabilityDoc } from './lib/capability.mjs';
import { cssVars, flattenTokenJson, parseCem } from './lib/extract.mjs';
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

  it('appends a new version and honors --force', () => {
    const bumped = appendSnapshot(existing, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.1.0' });
    expect(bumped.action).toBe('appended');
    expect(bumped.lines).toHaveLength(2);
    const forced = appendSnapshot(existing, { kit: 'taiga', npm: '@taiga-ui/core', version: '4.0.0' }, { force: true });
    expect(forced.action).toBe('appended');
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
