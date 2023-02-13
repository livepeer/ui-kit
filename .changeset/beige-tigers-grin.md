---
'@livepeer/core': patch
'livepeer': patch
'@livepeer/react-native': patch
'@livepeer/core-react': patch
'@livepeer/react': patch
---

**Fix:** fixed `usePlayerList` to use a React ref to avoid dynamic runtime `onViewableItemsChanged` errors.
