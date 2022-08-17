import { describe, expect, it } from 'vitest';

import { act, renderHook } from '../../../test';
import { useCreateStream } from './useCreateStream';

const streamName = 'livepeer.js tests :: new stream';

describe('useCreateStream', () => {
  it('mounts', async () => {
    const { result, waitFor } = renderHook(() => useCreateStream());

    await waitFor(() => expect(result.current.isIdle).toBeTruthy());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internal, ...res } = result.current;
    expect(res).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "mutate": [Function],
        "mutateAsync": [Function],
        "status": "idle",
        "variables": undefined,
      }
    `);
  });

  describe('create', () => {
    it('mutates', async () => {
      const utils = renderHook(() => useCreateStream());

      const { result, waitFor } = utils;

      await waitFor(() => expect(result.current.mutate).toBeDefined());

      await act(async () => {
        result.current.mutate?.({ name: streamName });
      });

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy(), {
        timeout: 10_000,
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
        }
      `);
    });
  });
});
