import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useRoundsManager } from './useLivepeerContract';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useRoundsManager());
    expect(result.current).toMatchInlineSnapshot(
      `"<Provider network={31337} />"`,
    );
  });
});
