import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchStreamSessions, useStreamSessions } from './useStreamSessions';

// stream ID which was generated previously for tests
const streamId = 'd7ae985a-7a27-4c18-a00c-22a5b5ea7e10';

describe('useStreamSessions', () => {
  it('fetches', async () => {
    const utils = renderHook(() => useStreamSessions({ streamId }));

    const { result, waitFor } = utils;

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result?.current?.data?.map((s) => s.id)).toMatchInlineSnapshot(
      `
      [
        "d7aeaae0-ab35-486c-a164-171594c0c65f",
        "d7aefb04-6a89-4e81-8e47-31481cb68851",
      ]
    `,
    );
  });

  describe('prefetchStreamSessions', () => {
    it('prefetches', async () => {
      const state = await prefetchStreamSessions(streamId, { provider });

      expect(state.queries[0]?.queryHash).toMatchInlineSnapshot(
        '"[{\\"args\\":\\"d7ae985a-7a27-4c18-a00c-22a5b5ea7e10\\",\\"config\\":{\\"apiKey\\":\\"a616be3b-8980-4932-8079-0122e0106f95\\",\\"baseUrl\\":\\"https://livepeer.studio/api\\",\\"name\\":\\"Livepeer Studio\\"},\\"entity\\":\\"getStreamSessions\\"}]"',
      );
      expect(
        (state.queries[0]?.state?.data as any[])?.[0]?.id,
      ).toMatchInlineSnapshot('"d7aeaae0-ab35-486c-a164-171594c0c65f"');
      expect(
        (state.queries[0]?.state?.data as any[])?.[1]?.id,
      ).toMatchInlineSnapshot('"d7aefb04-6a89-4e81-8e47-31481cb68851"');
    });
  });
});
