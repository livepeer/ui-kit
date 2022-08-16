import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useLivepeerProvider } from './useLivepeerProvider';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useLivepeerProvider());
    expect(result.current.getConfig()).toMatchInlineSnapshot(`
      {
        "baseUrl": "https://livepeer.studio/api",
        "name": "Livepeer Studio",
      }
    `);
  });
});
