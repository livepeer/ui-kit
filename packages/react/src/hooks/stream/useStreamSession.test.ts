import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchStreamSession, useStreamSession } from './useStreamSession';

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

      expect(state.queries[0]?.queryHash).toMatchInlineSnapshot(
        '"[{\\"args\\":\\"d7aeaae0-ab35-486c-a164-171594c0c65f\\",\\"config\\":{\\"apiKey\\":\\"a616be3b-8980-4932-8079-0122e0106f95\\",\\"baseUrl\\":\\"https://livepeer.studio/api\\",\\"name\\":\\"Livepeer Studio\\"},\\"entity\\":\\"getStreamSession\\"}]"',
      );
      expect(state.queries[0]?.state?.data).haveOwnProperty(
        'id',
        streamSessionId,
      );
    });
  });
});
