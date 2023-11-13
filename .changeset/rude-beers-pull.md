---
'@livepeer/core-web': patch
'@livepeer/react': patch
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/react-native': patch
---

**Fix:** fixed a race condition when b-frames are present in a stream, and fallback happens to HLS while SDP negotiation is still pending.
