import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchAsset, useAsset } from './useAsset';

// asset ID which was generated previously for tests
const assetId = 'd8e8b87d-6774-4083-a2d7-4e85872d18cd';

describe('useAsset', () => {
  it('fetches', async () => {
    const utils = renderHook(() => useAsset(assetId));

    const { result, waitFor } = utils;

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result?.current?.data?.hash).toMatchInlineSnapshot(`
      [
        {
          "algorithm": "md5",
          "hash": "5c31d513e48b136a676e2f46e012785c",
        },
        {
          "algorithm": "sha256",
          "hash": "9dbae3ea325b045f6ec8ab47ab8939a1f84ff4195c52fcfdcf3d99a28e6de9a5",
        },
      ]
    `);
  });

  describe('prefetchAssetMetrics', () => {
    it('prefetches', async () => {
      const state = await prefetchAsset({ assetId }, { provider });

      expect(state.queries[0]?.queryHash).toMatchInlineSnapshot(
        '"[{\\"args\\":{\\"assetId\\":\\"d8e8b87d-6774-4083-a2d7-4e85872d18cd\\"},\\"config\\":{\\"apiKey\\":\\"a616be3b-8980-4932-8079-0122e0106f95\\",\\"baseUrl\\":\\"https://livepeer.studio/api\\",\\"name\\":\\"Livepeer Studio\\"},\\"entity\\":\\"getAsset\\"}]"',
      );
      expect(state.queries[0]?.state?.data).haveOwnProperty('id', assetId);
    });

    it('does not prefetch when undefined', async () => {
      const state = await prefetchAsset({ assetId: undefined }, { provider });

      expect(state.queries).toMatchInlineSnapshot('[]');
    });
  });
});
