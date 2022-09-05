---
'@livepeer/react': minor
---

**Feature:** added a `VideoPlayer` component to provide HLS and LLHLS video streaming.

See below for the API changes:

```diff
+ export { VideoPlayer } from './components';
```

The `VideoPlayer` component uses hls.js under the hood and creates a new `HTMLVideoElement` and adds event handlers for metrics reporting.

```typescript
import { VideoPlayer } from '@livepeer/react';

const playbackId = 'abcde6mykgkvtxav';

function App() {
  return <VideoPlayer playbackId={playbackId} />;
}
```

The `VideoPlayer` requires a `playbackId` or `src` prop to be passed, with the `playbackId` automatically used to fetch the playback URL from the provider.
