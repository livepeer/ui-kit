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
      "defaultStudioConfig",
      "defaultTranscodingProfiles",
      "HttpError",
      "addMediaMetrics",
      "canPlayMediaNatively",
      "getMediaSourceType",
      "getMetricsReportingUrl",
      "MetricsStatus",
      "PlaybackMonitor",
      "createStorage",
      "noopStorage",
      "deepMerge",
      "pick",
      "isPictureInPictureSupported",
      "studioProvider",
      "defaultTheme",
      "getCssText",
      "styling",
      "createReactClient",
      "ControlsContainer",
      "FullscreenButton",
      "MediaControllerProvider",
      "PictureInPictureButton",
      "PlayButton",
      "Player",
      "Poster",
      "Progress",
      "ThemeProvider",
      "TimeDisplay",
      "Title",
      "useMediaController",
      "useTheme",
      "Volume",
      "Context",
      "LivepeerConfig",
      "useClient",
      "useAsset",
      "useAssetMetrics",
      "useCreateAsset",
      "useCreateStream",
      "useLivepeerProvider",
      "useStream",
      "useStreamSession",
      "useStreamSessions",
      "useUpdateAsset",
      "useUpdateStream",
      "deserialize",
      "serialize",
    ]
  `);
});
