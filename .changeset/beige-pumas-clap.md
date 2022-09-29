---
'livepeer': minor
---

**Feature:** added styling for media player components using `@stitches/core` and polyfilling using `core-js`.

Added a core vanilla JS store based on Zustand, w/ state propagated to/from a media element (see `MediaControllerState` and `MediaControllerStore`). Also added more helper functions for validating/constructing media sources and mime types, theming, and browser interactions.

The following updates were made to `package.json`:

```diff
   },
   "peerDependenciesMeta": {},
   "dependencies": {
+    "@stitches/core": "^1.2.8",
+    "core-js": "^3.25.2",
     "cross-fetch": "^3.1.5",
     "hls.js": "^1.2.1",
     "tus-js-client": "^3.0.0",
```

The following updates were made to the exports from `livepeer`:

```diff
   TestnetLivepeerChainId,
 } from './constants';
 export { HttpError, IncorrectChainIdError } from './errors';
+export {
+  addEventListeners,
+  canPlayMediaNatively,
+  createControllerStore,
+  createNewHls,
+  createPlayerTheme,
+  defaultTheme,
+  getCssText,
+  getMediaSourceType,
+  getMetricsReportingUrl,
+  isHlsSupported,
+  MetricsStatus,
+  PlaybackMonitor,
+  reportMediaMetrics,
+  styling,
+} from './media';
+export type {
+  AspectRatio,
+  AudioSrc,
+  ControlsOptions,
+  HlsSrc,
+  HlsVideoConfig,
+  MediaControllerState,
+  MediaControllerStore,
+  PlaybackRecord,
+  RawMetrics,
+  Src,
+  ThemeConfig,
+  VideoSrc,
+} from './media';
 export { createStorage, noopStorage } from './storage';
 export type { ClientStorage as Storage } from './storage';

 ...

   UpdateStreamArgs,
   ViewsMetrics,
 } from './types';
-export { pick } from './utils';
-export {
-  createNewHls,
-  getMetricsReportingUrl,
-  isHlsSupported,
-  MetricsStatus,
-  PlaybackMonitor,
-  reportVideoMetrics,
-} from './video';
-export type { HlsVideoConfig, PlaybackRecord, RawMetrics } from './video';
+export { deepMerge, pick } from './utils';
```
