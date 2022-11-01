import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchStream, useStream } from './useStream';

// stream ID which was generated previously for tests
const streamId = 'd7ae985a-7a27-4c18-a00c-22a5b5ea7e10';

describe('useStream', () => {
  it('fetches', async () => {
    const utils = renderHook(() => useStream(streamId));

    const { result, waitFor } = utils;

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result?.current?.data?.playbackUrl).toMatchInlineSnapshot(
      '"https://livepeercdn.com/hls/d7aer9qx8act4lfd/index.m3u8"',
    );
  });

  describe('prefetchStream', () => {
    it('prefetches', async () => {
      const state = await prefetchStream(streamId, { provider });

      expect(
        (state.queries[0]?.queryKey?.[0] as any)?.args,
      ).toMatchInlineSnapshot('"d7ae985a-7a27-4c18-a00c-22a5b5ea7e10"');
      expect(
        (state.queries[0]?.queryKey?.[0] as any)?.entity,
      ).toMatchInlineSnapshot('"getStream"');
      expect(state.queries[0]?.state?.data).haveOwnProperty('id', streamId);
    });
  });
});
