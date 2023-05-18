---
'@livepeer/core': patch
'@livepeer/core-react': patch
'livepeer': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
---

**Fix:** added debouncing to the error handler to increment the source index with exponential backoff, to prevent any fast reloads.
