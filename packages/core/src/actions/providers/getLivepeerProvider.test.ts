import { describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getLivepeerProvider } from './getLivepeerProvider';

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
