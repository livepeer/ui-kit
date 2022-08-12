import { describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getLPMSProvider } from './getLPMSProvider';

describe('getProvider', () => {
  it('default', async () => {
    setupClient();
    expect(getLPMSProvider()).toMatchInlineSnapshot(`"<Provider />"`);
  });
});
