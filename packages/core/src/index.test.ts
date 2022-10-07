import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createAsset",
      "createStream",
      "getAsset",
      "getAssetMetrics",
      "getLivepeerProvider",
      "getPlaybackInfo",
      "getStream",
      "getStreamSession",
      "getStreamSessions",
      "updateAsset",
      "updateStream",
      "watchLivepeerProvider",
      "Client",
      "createClient",
      "clearClient",
      "defaultStudioConfig",
      "defaultTranscodingProfiles",
      "HttpError",
      "addEventListeners",
      "canPlayMediaNatively",
      "createControllerStore",
      "createNewHls",
      "createPlayerTheme",
      "defaultTheme",
      "getCssText",
      "getMediaSourceType",
      "getMetricsReportingUrl",
      "isHlsSupported",
      "MetricsStatus",
      "PlaybackMonitor",
      "reportMediaMetrics",
      "styling",
      "createStorage",
      "noopStorage",
      "deepMerge",
      "pick",
    ]
  `);
});
