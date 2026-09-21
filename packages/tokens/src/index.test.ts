import { describe, expect, it } from 'vitest';

import { tokensPackagePlaceholder } from './index.js';

describe('@tk-kit/tokens scaffold', () => {
  it('exposes the scaffold placeholder module', () => {
    expect(tokensPackagePlaceholder).toBe(true);
  });
});
