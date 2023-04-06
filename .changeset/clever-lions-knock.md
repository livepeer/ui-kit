---
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
'livepeer': patch
---

**Feature:** added support for base64 video sources - this allows for a video source like `data:video/webm;base64,GkX...AUL3` to be passed into the `src` prop and the Player will handle it properly.
