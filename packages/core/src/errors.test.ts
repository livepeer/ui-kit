import { describe, expect, it } from 'vitest';

import { IncorrectChainIdError } from './errors';

describe('IncorrectChainIdError', () => {
  it('creates', () => {
    expect(new IncorrectChainIdError()).toBeInstanceOf(IncorrectChainIdError);
  });
});
