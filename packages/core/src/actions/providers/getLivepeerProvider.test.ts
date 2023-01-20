import { describe, expect, it } from 'vitest';

import { getLivepeerProvider } from './getLivepeerProvider';
import { setupClient } from '../../../test';

describe('getProvider', () => {
  it('default', async () => {
    setupClient();
    expect(getLivepeerProvider().getConfig()).toMatchObject({
      apiKey: `${
        process.env.STUDIO_API_KEY ?? 'a616be3b-8980-4932-8079-0122e0106f95'
      }`,
      baseUrl: 'https://livepeer.studio/api',
      name: 'Livepeer Studio',
    });
  });
});
