import { describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getLPMSProvider } from './getLPMSProvider';

describe('getProvider', () => {
  it('default', async () => {
    setupClient();
    expect(getLPMSProvider().getLPMS()).toMatchInlineSnapshot(`
      {
        "baseUrl": "https://livepeer.studio/api",
        "name": "Livepeer Studio",
      }
    `);
  });
});
