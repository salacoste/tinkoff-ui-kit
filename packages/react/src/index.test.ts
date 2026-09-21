import * as litReact from '@lit/react';
import { describe, expect, it } from 'vitest';

import { componentsPackagePlaceholder } from './index.js';

describe('@tk-kit/react scaffold', () => {
  it('re-exports the @tk-kit/components entry', () => {
    expect(componentsPackagePlaceholder).toBe(true);
  });

  it('resolves the pinned @lit/react dependency for the 1.7 wrapper generation', () => {
    expect(typeof litReact.createComponent).toBe('function');
  });
});
