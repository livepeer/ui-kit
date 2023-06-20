import { describe, expect, it } from 'vitest';

import { useLivepeerProvider } from './useLivepeerProvider';
import { renderHook } from '../../../test';

describe('useProvider', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useLivepeerProvider());
    expect(result.current.getConfig()).toMatchInlineSnapshot(`
      {
        "apiKey": "${
          process.env.STUDIO_API_KEY ?? 'a616be3b-8980-4932-8079-0122e0106f95'
        }",
        "baseUrl": "https://livepeer.studio/api",
        "name": "Livepeer Studio",
        "webrtcIngestBaseUrl": "https://webrtc.livepeer.com/webrtc",
      }
    `);
  });
});
