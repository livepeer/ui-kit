---
'livepeer': patch
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/react': patch
---

**Fix:** fixed [Safari not emitting `canplay` event](https://github.com/video-dev/hls.js/issues/1686) with autoplay disabled, and replaced this event with `loadedmetadata` to know when the video is ready for playback.
