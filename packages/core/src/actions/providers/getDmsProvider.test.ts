import { describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getDmsProvider } from './getDmsProvider';

describe('getProvider', () => {
  it('default', async () => {
    setupClient();
    expect(getDmsProvider()).toMatchInlineSnapshot(`"<Provider />"`);
  });
});
