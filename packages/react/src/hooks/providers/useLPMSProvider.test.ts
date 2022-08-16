import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useLPMSProvider } from './useLPMSProvider';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useLPMSProvider());
    expect(result.current.getLPMS()).toMatchInlineSnapshot(`
      {
        "baseUrl": "https://livepeer.studio/api",
        "name": "Livepeer Studio",
      }
    `);
  });
});
