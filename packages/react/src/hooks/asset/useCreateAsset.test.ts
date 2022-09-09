import { describe, expect, it } from 'vitest';

import { act, getSampleVideo, renderHook } from '../../../test';
import { useCreateAsset } from './useCreateAsset';

const assetName = 'livepeer.js tests :: new asset';

describe('useCreateAsset', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useCreateAsset());
    expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "internal": {
          "reset": [Function],
        },
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "mutate": [Function],
        "mutateAsync": [Function],
        "status": "idle",
        "uploadProgress": undefined,
        "variables": undefined,
      }
    `);
  });

  describe('create', () => {
    it('mutates', async () => {
      const utils = renderHook(() => useCreateAsset());

      const { result, waitFor } = utils;

      await waitFor(() => expect(result.current.mutate).toBeDefined());

      await act(async () => {
        result.current.mutateAsync?.({
          name: assetName,
          ...getSampleVideo(),
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy(), {
        timeout: 15_000,
      });

      const { data, variables, ...res } = result.current;
      expect(data?.id).toBeDefined();
      expect(variables).toBeDefined();
      expect(res).toMatchInlineSnapshot(`
        {
          "error": null,
          "internal": {
            "reset": [Function],
          },
          "isError": false,
          "isIdle": false,
          "isLoading": false,
          "isSuccess": true,
          "mutate": [Function],
          "mutateAsync": [Function],
          "status": "success",
          "uploadProgress": undefined,
        }
      `);
    }, 20_000);
  });
});
