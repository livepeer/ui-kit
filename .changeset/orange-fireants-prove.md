---
'@livepeer/core-web': patch
'@livepeer/react': patch
'@livepeer/core': patch
'@livepeer/core-react': patch
---

**Fix:** resolves issue with VPNs transparently blocking WebRTC playback and failing to start.

The timeout for playback can be customized with `webrtcConfig.canPlayTimeout`:

```tsx
import { Player, WebRTCVideoConfig } from '@livepeer/react';

const webrtcConfig: WebRTCVideoConfig = {
  canPlayTimeout: 8000,
};

const Page = () => {
  return <Player playbackId={playbackId} webrtcConfig={webrtcConfig} />;
};
```
