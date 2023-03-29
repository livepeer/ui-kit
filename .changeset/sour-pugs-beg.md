---
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
'livepeer': patch
---

**Fix:** added an `onError` callback to the Player to allow users to catch and handle miscellaneous errors which occur in the Player, which are not already handled.
