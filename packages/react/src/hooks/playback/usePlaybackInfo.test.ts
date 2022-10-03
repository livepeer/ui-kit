import { describe, expect, it } from 'vitest';

import { provider, renderHook } from '../../../test';
import { prefetchPlaybackInfo, usePlaybackInfo } from './usePlaybackInfo';

const playbackId = 'a4e8o6mykgkvtxav';

describe('usePlaybackInfo', () => {
  it('mounts', async () => {
    const { result, waitFor } = renderHook(() =>
      usePlaybackInfo({ playbackId }),
    );

    expect(result.current.status).toMatchInlineSnapshot('"loading"');

    await waitFor(() => expect(result.current.status).to.eq('success'), {
      timeout: 5000,
    });

    expect(result.current.data).toMatchInlineSnapshot(`
      {
        "meta": {
          "source": [
            {
              "hrn": "HLS (TS)",
              "type": "html5/application/vnd.apple.mpegurl",
              "url": "https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8",
            },
          ],
        },
        "type": "vod",
      }
    `);
  });

  describe('prefetchPlaybackInfo', () => {
    it('prefetches', async () => {
      const state = await prefetchPlaybackInfo(playbackId, { provider });

      expect(state.queries[0]?.queryHash).toMatchInlineSnapshot(
        '"[{\\"args\\":\\"a4e8o6mykgkvtxav\\",\\"config\\":{\\"apiKey\\":\\"a616be3b-8980-4932-8079-0122e0106f95\\",\\"baseUrl\\":\\"https://livepeer.studio/api\\",\\"name\\":\\"Livepeer Studio\\"},\\"entity\\":\\"getPlaybackInfo\\"}]"',
      );
      expect(state.queries[0]?.state?.data).haveOwnProperty('type', 'vod');
    });
  });
});
