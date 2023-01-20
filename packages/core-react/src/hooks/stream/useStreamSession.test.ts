import { describe, expect, it } from 'vitest';

import { prefetchStreamSession, useStreamSession } from './useStreamSession';
import { provider, renderHook } from '../../../test';

// stream session ID which was generated previously for tests
const streamSessionId = 'd7aeaae0-ab35-486c-a164-171594c0c65f';

describe('useStreamSession', () => {
  it('fetches', async () => {
    const utils = renderHook(() => useStreamSession({ streamSessionId }));

    const { result, waitFor } = utils;

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result?.current?.data?.createdAt).toMatchInlineSnapshot(
      '1664580177006',
    );
  });

  describe('prefetchStreamSession', () => {
    it('prefetches', async () => {
      const state = await prefetchStreamSession(streamSessionId, { provider });

      expect(
        (state.queries[0]?.queryKey?.[0] as any)?.args,
      ).toMatchInlineSnapshot('"d7aeaae0-ab35-486c-a164-171594c0c65f"');
      expect(
        (state.queries[0]?.queryKey?.[0] as any)?.entity,
      ).toMatchInlineSnapshot('"getStreamSession"');
      expect(state.queries[0]?.state?.data).haveOwnProperty(
        'id',
        streamSessionId,
      );
    });
  });
});
