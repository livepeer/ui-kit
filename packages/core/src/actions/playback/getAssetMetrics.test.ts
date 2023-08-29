import { beforeAll, describe, expect, it } from 'vitest';

import { getAssetMetrics } from './getAssetMetrics';
import { setupClient } from '../../../test';

const assetId = '373d4737-6e23-4b39-b37c-bcd4e72735e2';

describe('getAssetMetrics', () => {
  beforeAll(() => {
    setupClient();
  });

  it('gets asset metrics', async () => {
    const assetMetrics = await getAssetMetrics({ assetId });

    expect(assetMetrics).toMatchInlineSnapshot(`
      {
        "metrics": [
          {
            "id": "373d7a8kibjpsi0d",
            "startViews": 2,
          },
        ],
        "type": "ViewsMetrics",
      }
    `);
  });
});
