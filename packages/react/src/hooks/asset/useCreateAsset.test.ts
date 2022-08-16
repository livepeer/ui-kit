import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useCreateAsset } from './useCreateAsset';

describe('useCreateAsset', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useCreateAsset());
    expect(result.current).toMatchInlineSnapshot(
      `
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
        "variables": undefined,
      }
    `,
    );
  });
});
