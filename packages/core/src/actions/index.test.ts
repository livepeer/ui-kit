import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createAsset",
      "getAsset",
      "updateAsset",
      "getAssetMetrics",
      "getPlaybackInfo",
      "getLivepeerProvider",
      "watchLivepeerProvider",
      "createStream",
      "getStream",
      "getStreamSession",
      "getStreamSessions",
      "updateStream",
    ]
  `);
});
