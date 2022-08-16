import { describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getLivepeerProvider } from './getLivepeerProvider';

describe('getProvider', () => {
  it('default', async () => {
    setupClient();
    expect(getLivepeerProvider().getConfig()).toMatchInlineSnapshot(`
      {
        "baseUrl": "https://livepeer.studio/api",
        "name": "Livepeer Studio",
      }
    `);
  });
});
