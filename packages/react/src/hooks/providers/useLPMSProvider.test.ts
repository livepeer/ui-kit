import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useLPMSProvider } from './useLPMSProvider';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useLPMSProvider());
    expect(result.current).toMatchInlineSnapshot(
      `"<Provider network={31337} />"`,
    );
  });
});
