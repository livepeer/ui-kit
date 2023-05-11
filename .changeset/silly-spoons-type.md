---
'livepeer': patch
'@livepeer/react': patch
---

**Feature:** added `webrtcConfig` to the Player to allow for customization of playback from WebRTC. This currently only supports selecting the video track, but will be expanded further in future releases.

```tsx
export type WebRTCVideoConfig = {
  /**
   * The configuration for the video track selector in MistServer.
   *
   * @default maxbps
   * @link https://mistserver.org/guides/MistServer_Manual_3.0.pdf
   */
  videoTrackSelector?:
    | 'highbps'
    | 'maxbps'
    | 'bestbps'
    | 'lowbps'
    | 'minbps'
    | 'worstbps';
};
```
