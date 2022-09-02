---
'livepeer': minor
---

**Feature:** added hls.js as a dependency and the creation of an HLS instance to manage a video element and provide HLS and LLHLS support.

See below for the API changes:

```diff
+ export { createNewHls, isHlsSupported } from './video';
+ export type { HlsVideoConfig } from './video';
```

The `createNewHls` can be used to instantiate a new `Hls` class which connects
to the provided `HTMLMediaElement` to stream HLS video.

```typescript
if (mediaElement && typeof window !== 'undefined' && isHlsSupported()) {
  const { destroy } = createNewHls(src, mediaElement, hlsConfig);
}
```

The `createNewHls` function also instantiates reporting to the provider to provide viewership/general metrics.

This allows a user to build their own custom video player using different frameworks other than React, with easy integration with metrics and HLS out of the box.
