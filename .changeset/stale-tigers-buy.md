---
'@livepeer/core': minor
'@livepeer/core-web': minor
'@livepeer/core-react': minor
'@livepeer/react': minor
---

**Feature:** added track selectors to WebRTC so developers can override video and audio tracks.

```tsx
<Player
  webrtcConfig={{
    videoTrackSelector: '~1280x720',
  }}
/>
```

See [here](https://docs.mistserver.org/mistserver/concepts/track_selectors/) for more documentation.
