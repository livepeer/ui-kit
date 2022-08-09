import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useProvider } from './useProvider';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useProvider());
    expect(result.current).toMatchInlineSnapshot(
      `"<Provider network={31337} />"`,
    );
  });
});
