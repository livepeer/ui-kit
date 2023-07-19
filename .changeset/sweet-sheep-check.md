---
'@livepeer/core': minor
'@livepeer/core-react': minor
'livepeer': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
---

**Feature:** added `lowLatency` option of `force` - this requires WebRTC to be used, if a WebRTC playback source exists (which is only for livestreams). It disables the automatic fallback to HLS.

Fixed issue when `lowLatency` is `true` where it would immediately fall back to HLS - it should now retry if the stream is offline, and fall back to HLS only when there is an unknown error (this could be a variety of causes - intermittent network issues, browser failure, etc).

The default `lowLatency` option is now `true` - to opt out of low latency, pass `lowLatency=false` to the Player or the lvpr.tv search params.
