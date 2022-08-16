import { describe, expect, it } from 'vitest';

import { renderHook } from '../../../test';
import { useStream } from './useStream';

// stream ID which was generated previously for tests
const streamId = '591b42e4-d09e-413f-9a56-0130fb1ee587';

describe('useStream', () => {
  it('fetches', async () => {
    const utils = renderHook(() => useStream(streamId));

    const { result, waitFor } = utils;

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result?.current?.data?.playbackUrl).toMatchInlineSnapshot(
      '"https://livepeercdn.com/hls/591bppswh1q05kfw/index.m3u8"',
    );
  });
});
