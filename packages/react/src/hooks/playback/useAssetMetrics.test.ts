import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchAssetMetrics, useAssetMetrics } from './useAssetMetrics';

// asset ID which was generated previously for tests
const assetId = 'd8e8b87d-6774-4083-a2d7-4e85872d18cd';

describe('useAssetMetrics', () => {
  it('mounts', async () => {
    const { result, waitFor } = renderHook(() => useAssetMetrics({ assetId }));

    expect(result.current.status).toMatchInlineSnapshot('"loading"');

    await waitFor(() => expect(result.current.status).to.eq('success'), {
      timeout: 5000,
    });

    expect(result.current.data).toMatchInlineSnapshot(`
      {
        "metrics": [
          {
            "id": "d8e8c2v2dqal5je6",
            "startViews": 2,
          },
        ],
        "type": "ViewsMetrics",
      }
    `);
  });

  describe('prefetchAssetMetrics', () => {
    it('prefetches', async () => {
      const state = await prefetchAssetMetrics({ assetId }, { provider });

      expect(state.queries[0]?.queryHash).toMatchInlineSnapshot(
        '"[{\\"args\\":{\\"assetId\\":\\"d8e8b87d-6774-4083-a2d7-4e85872d18cd\\"},\\"config\\":{\\"apiKey\\":\\"a616be3b-8980-4932-8079-0122e0106f95\\",\\"baseUrl\\":\\"https://livepeer.studio/api\\",\\"name\\":\\"Livepeer Studio\\"},\\"entity\\":\\"getAssetMetrics\\"}]"',
      );
      expect(state.queries[0]?.state?.data).haveOwnProperty(
        'type',
        'ViewsMetrics',
      );
    });
  });
});
