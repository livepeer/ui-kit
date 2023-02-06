---
'@livepeer/core': minor
'@livepeer/core-react': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
'livepeer': minor
---

**Feature:** added MP4 rendition prioritization to the React and React Native Player.

This is for support of MP4 renditions returned from `playbackInfo` from the Studio provider. If an MP4 rendition exists for an Asset, it will be prioritized over HLS, since this has been introduced as a performance improvement over HLS for short-form video.
