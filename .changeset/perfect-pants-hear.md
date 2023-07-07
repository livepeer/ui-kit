---
'@livepeer/core': patch
'@livepeer/core-react': patch
'livepeer': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
---

**Feature:** added `renderChildrenOutsideContainer` to both Broadcast and Player, which determines whether the children should be rendered outside of the aspect ratio container. This is used for custom controls, so children of the Player/Broadcast can use
`useMediaController` without any parent elements.

Also added `onPlaybackStatusUpdate`, which is a callback that is called when the broadcast status updates.
**This should be used with `playbackStatusSelector` to limit state updates.**
