import { describe, expect, it } from 'vitest';

import { useCreateAsset } from './useCreateAsset';
import { act, getSampleVideo, renderHook } from '../../../test';

const assetName = 'Livepeer React tests :: new asset';

describe('useCreateAsset', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useCreateAsset(null));
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
        "mutate": undefined,
        "mutateAsync": [Function],
        "progress": undefined,
        "status": "idle",
        "variables": undefined,
      }
    `);
  });

  describe('create', () => {
    it('mutates', async () => {
      const utils = renderHook(() =>
        useCreateAsset({
          sources: [
            {
              name: assetName,
              ...getSampleVideo(),
            },
          ] as const,
        }),
      );
      const { result, waitFor } = utils;
      await waitFor(() => expect(result.current.mutateAsync).toBeDefined());
      await act(async () => {
        result.current.mutateAsync?.();
      });

      await waitFor(
        () =>
          expect(
            result.current.progress?.[0].phase === 'processing',
          ).toBeTruthy(),
        {
          timeout: 35_000,
        },
      );

      const { variables, ...res } = result.current;
      expect(variables).toBeDefined();

      expect({
        phase: res.progress?.[0].phase,
        progress: undefined,
        status: res.status,
        error: res.error,
        data: res.data,
      }).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "phase": "processing",
          "progress": undefined,
          "status": "loading",
        }
      `);
    }, 45_000);
  });
});
