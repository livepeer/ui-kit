---
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/core-web': patch
'@livepeer/react': patch
---

**Fix:** added timeout for VPN playback blocking ICE candidates and stalling indefinitely. The default is 5000ms with an override with:

```tsx
<Player
  webrtcConfig={{
    iceCandidateTimeout: 2000,
  }}
/>
```
