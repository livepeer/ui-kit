import { describe, expect, it } from 'vitest';

import { UserRejectedRequestError } from './errors';

describe('UserRejectedRequestError', () => {
  it('creates', () => {
    expect(new UserRejectedRequestError()).toBeInstanceOf(
      UserRejectedRequestError,
    );
  });
});
