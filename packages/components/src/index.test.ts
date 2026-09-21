import { LitElement } from 'lit';
import { describe, expect, it } from 'vitest';

import { componentsPackagePlaceholder } from './index.js';

describe('@tk-kit/components scaffold', () => {
  it('exposes the scaffold placeholder module', () => {
    expect(componentsPackagePlaceholder).toBe(true);
  });

  it('resolves the pinned lit dependency for the 1.7 component work', () => {
    expect(LitElement).toBeDefined();
  });
});
