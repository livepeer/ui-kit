import { beforeAll, describe, expect, it } from 'vitest';

import { setupClient } from '../../../test';
import { getMetrics } from './getMetrics';

const assetId = '373d4737-6e23-4b39-b37c-bcd4e72735e2';

describe('getMetrics', () => {
  beforeAll(() => {
    setupClient();
  });

  it('gets metrics', async () => {
    const assetMetrics = await getMetrics({ assetId });

    expect(assetMetrics).toMatchInlineSnapshot(`
      {
        "0": {
          "id": "373d7a8kibjpsi0d",
          "startViews": 25,
        },
      }
    `);
  });
});
